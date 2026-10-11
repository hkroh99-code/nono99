"""Car-chive — 중고차 점검 사진 아카이브.  실행:  streamlit run app.py"""
from __future__ import annotations

import os
import sqlite3
from datetime import date
from pathlib import Path

import altair as alt
import pandas as pd
import streamlit as st

import demo
import imaging
import report
import suggest
from db import NORMAL, SEV_RANK, Archive
from taxonomy import ANGLES, REQUIRED_AREAS, SEVERITIES

st.set_page_config(page_title="Car-chive 점검 사진 아카이브", page_icon="🚗", layout="wide")

SEV_ICON = {"경미": "🟢", "주의": "🟡", "심각": "🔴"}
FUELS = ["가솔린", "디젤", "LPG", "하이브리드", "전기", "기타"]
PAGES = ["📊 대시보드", "📤 사진 등록", "🏷️ 분류 대기함", "🔎 검색·갤러리", "🚗 차량·보고서", "🚘 차종별 취약 리포트", "🧩 분류체계 관리", "💾 데이터 관리"]


@st.cache_resource
def get_archive() -> Archive:
    return Archive(os.environ.get("CARCHIVE_DATA", Path(__file__).parent / "data"))


A = get_archive()


def gate():
    """환경변수 CARCHIVE_PASSWORD 가 있으면 비밀번호를 입력해야 들어갈 수 있다(간이 보호, 사내망용)."""
    pw = os.environ.get("CARCHIVE_PASSWORD")
    if not pw or st.session_state.get("authed"):
        return
    st.title("🚗 Car-chive")
    got = st.text_input("비밀번호", type="password")
    if got and got == pw:
        st.session_state["authed"] = True
        st.rerun()
    elif got:
        st.error("비밀번호가 맞지 않습니다.")
    st.stop()


gate()


# ───────────────────────── 공용 부품 ─────────────────────────
def cat_display(c) -> str:
    return ("💧 " if c["is_flood"] else "") + c["label"]


def tag_picker(label: str, key: str, default_ids: list[int] | None = None):
    """하자 항목을 검색해서 고르는 다중 선택. 선택된 카테고리 dict 목록을 돌려준다."""
    cats = A.categories()
    by = {c["id"]: c for c in cats}
    opts = [c["id"] for c in cats]
    default = [i for i in (default_ids or []) if i in by]
    ids = st.multiselect(label, opts, default=default, key=key, format_func=lambda i: cat_display(by[i]),
                         placeholder="입력해서 검색 (예: 누유, 진흙, 퓨즈박스)  💧=침수 관련 항목")
    return [by[i] for i in ids]


def chips(defects, limit=3) -> str:
    if not defects:
        return "_분류 전_"
    out = [f"{SEV_ICON.get(d['severity'], '')}{'💧' if d['is_flood'] else ''} {d['sub_part']} · {d['defect_type']}" for d in defects[:limit]]
    if len(defects) > limit:
        out.append(f"외 {len(defects) - limit}건")
    return "  \n".join(out)


def car_caption(p) -> str:
    bits = [f"**{p['manufacturer']} {p['model_name']}**"]
    if p.get("model_year"):
        bits.append(f"{p['model_year']}년식")
    if p.get("mileage"):
        bits.append(f"{p['mileage']:,}km")
    return " · ".join(bits)


def photo_card(p, key: str, show_btn=True):
    with st.container(border=True):
        tp = A.abs_thumb(p)
        if tp.exists():
            st.image(str(tp), width="stretch")
        else:
            st.warning("썸네일 파일 없음")
        st.markdown(car_caption(p))
        st.markdown(chips(p.get("defects", [])))
        if show_btn and st.button("상세 보기 / 수정", key=key, width="stretch"):
            photo_dialog(p["id"])


def hbar(rows: list[dict], title: str, color="#2563eb", x="n", xtitle="건수"):
    if not rows:
        st.caption(f"{title}: 데이터 없음")
        return
    df = pd.DataFrame(rows)
    ch = (alt.Chart(df).mark_bar(color=color, cornerRadiusEnd=3)
          .encode(x=alt.X(f"{x}:Q", title=xtitle), y=alt.Y("label:N", sort="-x", title=None,
                                                          axis=alt.Axis(labelLimit=320, labelOverlap=False)),
                  tooltip=["label", x])
          .properties(title=title, height=alt.Step(28)))
    st.altair_chart(ch, width="stretch")


def go(page: str):
    st.session_state["page"] = page



def area_options() -> list[str]:
    return REQUIRED_AREAS + sorted({c["sub_part"] for c in A.categories(active_only=False)} - set(REQUIRED_AREAS))


def _add_to_picker(key: str, cid: int):
    st.session_state[key] = list(dict.fromkeys(st.session_state.get(key, []) + [cid]))


def suggest_panel(pid: int, picker_key: str | None, comment: str | None, key: str, on_add=None):
    """하자 후보 추천 카드. picker_key 가 있으면 그 멀티셀렉트에 추가, 없으면 on_add(cid) 호출."""
    with st.container(border=True):
        st.markdown("**💡 하자 후보 추천** <small>— 후보일 뿐입니다. 눌러서 확정하세요.</small>", unsafe_allow_html=True)
        sugg = suggest.suggest(A, pid, comment=comment)
        if not sugg:
            st.caption("지금은 뚜렷한 후보가 없습니다. 코멘트를 적으면 단어로 찾아 주고, 같은 차종 사진이 쌓일수록 정확해집니다.")
        for s in sugg:
            c1, c2 = st.columns([5, 1])
            bar = "▰" * max(1, round(s.score * 6)) + "▱" * (6 - max(1, round(s.score * 6)))
            c1.markdown(f"{'💧' if s.category['is_flood'] else ''} **{s.category['sub_part']} · {s.category['defect_type']}**  `{bar} {s.score:.0%}`")
            c1.caption(" / ".join(s.reasons))
            if picker_key:
                c2.button("＋", key=f"{key}_{s.category['id']}", on_click=_add_to_picker, args=(picker_key, s.category["id"]), help="태그에 추가")
            elif c2.button("＋", key=f"{key}_{s.category['id']}", help="태그에 추가"):
                on_add(s.category["id"])
        if suggest.ai_available():
            ok = st.checkbox("사진을 AI 서비스(Anthropic)로 전송하는 데 동의", key=f"{key}_ok", help="체크하고 버튼을 눌렀을 때만, 이 사진 1장이 외부로 전송됩니다. 번호판·사람 얼굴이 보이면 쓰지 마세요.")
            cached = A.ai_cache_get(pid) is not None
            if st.button("🤖 AI로 판독" + (" (다시)" if cached else ""), key=f"{key}_ai", disabled=not ok):
                try:
                    with st.spinner("판독 중…"):
                        suggest.ai_run(A, pid)
                    st.rerun(scope="fragment") if on_add else st.rerun()
                except Exception as e:  # noqa: BLE001
                    st.error(f"AI 판독 실패: {e}")
        else:
            st.caption("🤖 AI 사진 판독(선택): `ANTHROPIC_API_KEY` 환경변수를 설정하면 켜집니다. README 참고.")

# ───────────────────────── 사진 상세(팝업) ─────────────────────────
@st.dialog("사진 상세", width="large")
def photo_dialog(pid: int):
    p = A.photo(pid)
    if not p or p["deleted_at"]:
        st.info("이 사진은 삭제되었습니다.")
        return
    boxes = A.boxes(pid)
    pk = f"pd{pid}"
    pend = None
    if st.session_state.get(f"{pk}_showpend"):
        pend = {k: st.session_state.get(f"{pk}_{k}", 0) / 100 for k in ("x", "y", "w", "h")}
        pend["label"] = "추가할 위치"
    left, right = st.columns([5, 4])
    with left:
        fp = A.abs_file(p)
        if fp.exists():
            st.image(imaging.render_with_boxes(str(fp), boxes, pend), width="stretch")
            st.download_button("⬇️ 원본 내려받기", fp.read_bytes(), file_name=p.get("original_name") or fp.name, key=f"{pk}_dl")
        else:
            st.error(f"원본 파일이 없습니다: {p['file_path']}")
    with right:
        st.markdown(car_caption(p))
        meta = [f"사진 #{pid}", f"등록 {p['created_at'][:16]}"]
        if p.get("shot_at"):
            meta.append(f"촬영 {p['shot_at'][:16]}")
        if p.get("plate"):
            meta.append(f"차량번호 {p['plate']}")
        st.caption(" · ".join(meta) + f" · {p['width']}×{p['height']}")
        t1, t2, t3, t4 = st.tabs(["🏷️ 태그·코멘트", "📍 위치 표시", "🔗 비슷한 사례", "🚘 차량"])
        def _dlg_add(cid):
            cur_ids = {d["category_id"]: (d["severity"], d["note"] or "") for d in A.photo_defects(pid)}
            cur_ids.setdefault(cid, ("주의", ""))
            A.set_photo_defects(pid, [(k, v[0], v[1]) for k, v in cur_ids.items()])
            A.resolve_suggestions(pid, set(cur_ids))
            st.session_state.pop(f"{pk}_ed", None)
            st.rerun(scope="fragment")

        with t1:
            cats = A.categories(active_only=False)
            by = {c["id"]: c for c in cats}
            active = {c["id"] for c in cats if c["is_active"]}
            cur = p["defects"]
            lab = {c["id"]: cat_display(c) for c in cats}
            inv = {v: k for k, v in lab.items()}
            df = pd.DataFrame([{"하자 항목": lab[d["category_id"]], "심각도": d["severity"], "메모": d["note"] or ""} for d in cur],
                              columns=["하자 항목", "심각도", "메모"])
            opts = [lab[i] for i in sorted(active | {d["category_id"] for d in cur}, key=lambda i: by[i]["label"])]
            ed = st.data_editor(df, num_rows="dynamic", key=f"{pk}_ed", width="stretch", hide_index=True,
                                column_config={"하자 항목": st.column_config.SelectboxColumn(options=opts, required=True, width="medium"),
                                               "심각도": st.column_config.SelectboxColumn(options=SEVERITIES, default="주의", required=True, width="small"),
                                               "메모": st.column_config.TextColumn(width="small")})
            st.caption("표 아래 빈 줄을 눌러 태그를 추가하고, 줄 왼쪽을 선택해 Delete 로 지웁니다.")
            comment = st.text_area("점검자 코멘트", p.get("comment") or "", key=f"{pk}_cm")
            areas = area_options()
            area = st.selectbox("촬영 부위(보고서의 ‘촬영 커버리지’에 쓰임)", areas, index=areas.index(p["area"]) if p.get("area") in areas else None,
                                key=f"{pk}_ar", placeholder="선택(생략 가능)")
            c1, c2 = st.columns(2)
            inspector = c1.text_input("점검자", p.get("inspector") or "", key=f"{pk}_in")
            angles = ANGLES if (p.get("angle") or "") in ANGLES + [""] else ANGLES + [p["angle"]]
            angle = c2.selectbox("촬영 구분", angles, index=angles.index(p["angle"]) if p.get("angle") in angles else None, key=f"{pk}_an",
                                 placeholder="선택", help="‘비교용(정상)’은 하자가 없는 정상 부위 사진으로, 분류 대기함에서 빠집니다.")
            if st.button("💾 저장", type="primary", key=f"{pk}_save"):
                rows = {}
                for _, r in ed.dropna(subset=["하자 항목"]).iterrows():
                    rows[inv[r["하자 항목"]]] = (inv[r["하자 항목"]], r["심각도"] if r["심각도"] in SEVERITIES else "주의",
                                                  "" if pd.isna(r["메모"]) else str(r["메모"]))
                A.set_photo_defects(pid, list(rows.values()))
                A.update_photo(pid, comment=comment.strip(), inspector=inspector.strip(), angle=angle or "", area=area or "")
                A.resolve_suggestions(pid, set(rows))
                st.session_state.pop(f"{pk}_showpend", None)
                st.rerun()
            suggest_panel(pid, None, comment, f"{pk}_sg", on_add=_dlg_add)
            with st.expander("🗑️ 이 사진 삭제"):
                st.caption("휴지통으로 이동합니다. ‘데이터 관리 › 휴지통’에서 되살릴 수 있습니다.")
                if st.button("휴지통으로 보내기", key=f"{pk}_del"):
                    A.soft_delete(pid)
                    st.rerun()

        with t2:
            st.caption("사진 위에 결함 위치를 네모로 표시합니다(원본은 그대로, 좌표만 저장). 막대를 움직이면 파란 네모가 미리 보입니다.")
            st.session_state[f"{pk}_showpend"] = True
            a, b = st.columns(2)
            a.slider("왼쪽에서 %", 0, 95, 30, key=f"{pk}_x")
            b.slider("위에서 %", 0, 95, 30, key=f"{pk}_y")
            a.slider("너비 %", 3, 100, 25, key=f"{pk}_w")
            b.slider("높이 %", 3, 100, 25, key=f"{pk}_h")
            names = [d["defect_type"] for d in cur] or [""]
            lbl = st.selectbox("이름표", names, accept_new_options=True, key=f"{pk}_bl")
            if st.button("➕ 이 위치 저장", key=f"{pk}_addbox"):
                g = lambda k: st.session_state[f"{pk}_{k}"] / 100  # noqa: E731
                A.add_box(pid, g("x"), g("y"), min(g("w"), 1 - g("x")), min(g("h"), 1 - g("y")), lbl or "")
                st.session_state[f"{pk}_showpend"] = False
                st.rerun()
            for bx in boxes:
                cc1, cc2 = st.columns([4, 1])
                cc1.write(f"▫️ {bx['label'] or '(이름 없음)'}  ({bx['x']:.0%}, {bx['y']:.0%})")
                if cc2.button("삭제", key=f"{pk}_bd{bx['id']}"):
                    A.delete_box(bx["id"])
                    st.rerun()

        with t3:
            sims = A.similar_cases(pid)
            if not sims:
                st.caption("같은 하자 태그를 가진 다른 차량의 사진이 아직 없습니다.")
            for s in sims:
                sc1, sc2 = st.columns([1, 2])
                sc1.image(str(A.abs_thumb(s)), width="stretch")
                sc2.markdown(f"{car_caption(s)}\n\n{'⭐ 같은 차종' if s['same_model'] else ''}  공통 태그 {s['shared']}개")
                sc2.caption(f"사진 #{s['id']}")

        with t4:
            v = A.vehicle(p["vehicle_id"])
            with st.form(f"{pk}_vf"):
                c1, c2 = st.columns(2)
                mf = c1.text_input("제조사", v["manufacturer"])
                mo = c2.text_input("차종", v["model_name"])
                yr = c1.number_input("연식", 1980, 2035, v["model_year"], step=1)
                km = c2.number_input("주행거리(km)", 0, 2_000_000, v["mileage"], step=1000)
                tr = c1.text_input("트림", v["trim"] or "")
                pl = c2.text_input("차량번호", v["plate"] or "")
                if st.form_submit_button("차량 정보 수정"):
                    A.update_vehicle(v["id"], manufacturer=mf, model_name=mo, model_year=yr, mileage=km, trim=tr, plate=pl)
                    st.rerun()
            others = [x for x in A.q("SELECT * FROM photos WHERE vehicle_id=? AND deleted_at IS NULL AND id<>?", (v["id"], pid))]
            if others:
                st.caption(f"같은 차량의 다른 사진 {len(others)}장")
                cols = st.columns(3)
                for i, o in enumerate(others[:9]):
                    cols[i % 3].image(str(A.abs_thumb(o)), caption=f"#{o['id']}", width="stretch")


# ───────────────────────── 페이지: 대시보드 ─────────────────────────
def page_dashboard():
    st.title("📊 대시보드")
    t = A.totals()
    if t["photos"] == 0:
        st.info("아직 등록된 사진이 없습니다. 「📤 사진 등록」에서 사진을 올리거나, 먼저 체험해 보려면 아래 버튼으로 가상 데이터를 넣어 보세요.")
        c1, c2 = st.columns(2)
        c1.button("📤 사진 등록하러 가기", on_click=go, args=(PAGES[1],), type="primary")
        if c2.button("🧪 데모 데이터 불러오기 (합성 이미지 약 70장)"):
            with st.spinner("만드는 중…"):
                n = demo.load_demo(A)
            st.success(f"{n}장을 넣었습니다. 체험이 끝나면 「데이터 관리」에서 한 번에 지울 수 있습니다.")
            st.rerun()
        return
    m = st.columns(6)
    m[0].metric("전체 사진", f"{t['photos']:,}장")
    m[1].metric("차량 수", f"{t['vehicles']:,}대")
    m[2].metric("하자 태그", f"{t['tags']:,}건")
    m[3].metric("이번 주 등록", f"{t['week']:,}장")
    m[4].metric("💧 침수 관련 사진", f"{t['flood']:,}장")
    m[5].metric("분류 대기", f"{t['untagged']:,}장")
    if t["untagged"]:
        st.warning(f"태그가 아직 없는 사진이 {t['untagged']}장 있습니다.")
        st.button("🏷️ 분류 대기함으로 이동", on_click=go, args=(PAGES[2],))
    c1, c2 = st.columns(2)
    with c1:
        span = st.radio("기간", ["최근 30일", "전체"], horizontal=True, label_visibility="collapsed")
        hbar(A.top_defects(30 if span == "최근 30일" else None), f"많이 등록된 하자 TOP 10 ({span})")
    with c2:
        hbar(A.by_main_part(), "대분류별 하자 건수", "#0d9488")
    c3, c4 = st.columns(2)
    with c3:
        hbar(A.by_model(), "차종별 사진 수", "#7c3aed")
    with c4:
        up = A.uploads_by_day(30)
        if up:
            st.altair_chart(alt.Chart(pd.DataFrame(up)).mark_bar(color="#ea580c").encode(
                x=alt.X("day:T", title=None), y=alt.Y("n:Q", title="등록 장수")).properties(title="최근 30일 등록 추이", height=220),
                width="stretch")
    stats = A.suggestion_stats()
    if stats:
        st.subheader("💡 하자 후보 추천 적중률")
        df = pd.DataFrame([{"단서": suggest.SOURCE_NAMES[x["source"]], "추천 횟수": x["shown"], "채택": x["accepted"], "적중률(%)": round(x["rate"] * 100, 1)} for x in stats])
        st.dataframe(df, hide_index=True, width="stretch", column_config={"적중률(%)": st.column_config.ProgressColumn(min_value=0, max_value=100, format="%.1f")})
        st.caption("추천 후보가 실제 태그로 채택된 비율입니다. 낮은 단서는 신뢰하지 마세요. 사진이 쌓일수록 ‘차종 통계’ 단서가 좋아집니다.")
    st.subheader("최근 등록")
    rows, _ = A.search_photos({}, limit=8)
    cols = st.columns(4)
    for i, p in enumerate(rows):
        with cols[i % 4]:
            photo_card(p, f"dash{p['id']}")


# ───────────────────────── 페이지: 사진 등록 ─────────────────────────
def page_upload():
    st.title("📤 사진 등록")
    if msg := st.session_state.pop("up_msg", None):
        st.success(msg["ok"])
        for w in msg["warn"]:
            st.warning(w)
    n = st.session_state.setdefault("up_n", 0)

    st.subheader("① 어느 차량인가요?")
    vehicles = A.vehicles()
    NEW = "➕ 새 차량 등록"
    labels = {v["id"]: A.vehicle_label(v) for v in vehicles}
    pick = st.selectbox("차량 선택", [NEW] + [v["id"] for v in vehicles], key=f"up_v{n}",
                        format_func=lambda x: x if x == NEW else labels[x],
                        help="같은 차량에 사진을 더 올릴 때는 기존 차량을 고르세요. 목록에서 글자를 쳐서 찾을 수 있습니다.")
    vid, newv = None, None
    if pick == NEW:
        c = st.columns(4)
        mf = c[0].selectbox("제조사 *", A.distinct("manufacturer"), index=None, accept_new_options=True, key=f"up_mf{n}", placeholder="선택 또는 직접 입력")
        mo = c[1].selectbox("차종 *", A.models_of([mf] if mf else None), index=None, accept_new_options=True, key=f"up_mo{n}", placeholder="예: 그랜저 IG")
        yr = c[2].number_input("연식", 1980, 2035, None, step=1, key=f"up_yr{n}")
        km = c[3].number_input("주행거리(km)", 0, 2_000_000, None, step=1000, key=f"up_km{n}")
        c = st.columns(4)
        trim = c[0].text_input("트림(선택)", key=f"up_tr{n}")
        fuel = c[1].selectbox("연료(선택)", FUELS, index=None, key=f"up_fu{n}", placeholder="선택")
        plate = c[2].text_input("차량번호(선택)", key=f"up_pl{n}", help="개인정보입니다. 꼭 필요한 경우만 입력하세요.")
        vin = c[3].text_input("차대번호(선택)", key=f"up_vn{n}")
        newv = dict(manufacturer=mf or "", model_name=mo or "", model_year=yr, mileage=km, trim=trim, fuel=fuel or "", plate=plate, vin=vin)
    else:
        vid = pick

    st.subheader("② 사진 선택")
    files = st.file_uploader("점검 사진 (여러 장 한꺼번에 가능 · JPG/PNG/WEBP)", type=["jpg", "jpeg", "png", "webp"],
                             accept_multiple_files=True, key=f"up_f{n}")
    if files:
        cols = st.columns(8)
        for i, f in enumerate(files[:16]):
            cols[i % 8].image(f.getvalue(), width="stretch")
        if len(files) > 16:
            st.caption(f"… 외 {len(files) - 16}장")

    st.subheader("③ 공통 정보 (선택한 모든 사진에 같이 적용)")
    c1, c2 = st.columns([2, 1])
    inspector = c1.text_input("점검자", st.session_state.get("inspector", ""), key=f"up_in{n}")
    angle = c2.selectbox("촬영 구분", ANGLES, index=None, key=f"up_an{n}", placeholder="선택(생략 가능)")
    area = st.selectbox("촬영 부위 (선택 · 정상 사진도 ‘촬영 커버리지’에 반영하려면 지정)", area_options(), index=None, key=f"up_ar{n}", placeholder="예: 퓨즈박스/전장")
    tags = tag_picker("하자 항목 (여러 개 가능, 비워 두면 ‘분류 대기함’으로 갑니다)", f"up_tg{n}")
    sev = st.radio("심각도", SEVERITIES, index=1, horizontal=True, key=f"up_sv{n}", captions=["사용에 지장 없음", "추적·설명 필요", "보증 판단 영향"])
    comment = st.text_area("코멘트", key=f"up_cm{n}", placeholder="예: 조수석 프레임 하단부 심한 부식, 미션팬 누유")
    st.caption("💡 사진마다 하자가 다르면: 태그 없이 올린 뒤 「🏷️ 분류 대기함」에서 한 장씩 빠르게 분류하세요.")

    if st.button("💾 저장 및 분류", type="primary", disabled=not files):
        try:
            if newv is not None:
                vid = A.create_vehicle(**newv)
        except ValueError as e:
            st.error(str(e))
            return
        st.session_state["inspector"] = inspector
        ok, warn = 0, []
        prog = st.progress(0.0)
        for i, f in enumerate(files):
            try:
                pid, new = A.add_photo(vid, f.getvalue(), f.name, inspector, comment, angle or "",
                                       [(c["id"], sev, "") for c in tags], area=area or "")
                if new:
                    ok += 1
                else:
                    ex = A.q1("SELECT deleted_at FROM photos WHERE id=?", (pid,))
                    warn.append(f"{f.name}: 이미 등록된 사진입니다(사진 #{pid}){' — 휴지통에 있음' if ex['deleted_at'] else ''}. 건너뜀")
            except imaging.BadImage as e:
                warn.append(f"{f.name}: {e}")
            prog.progress((i + 1) / len(files))
        st.session_state["up_msg"] = {"ok": f"{ok}장 저장했습니다." + ("" if tags else " 태그가 없는 사진은 「분류 대기함」에서 분류하세요."), "warn": warn}
        st.session_state["up_n"] = n + 1
        st.rerun()


# ───────────────────────── 페이지: 분류 대기함 ─────────────────────────
def page_triage():
    st.title("🏷️ 분류 대기함")
    ids = A.untagged_ids()
    if not ids:
        st.success("분류할 사진이 없습니다. 모두 정리됐어요! 🎉")
        return
    i = min(st.session_state.get("tri_i", 0), len(ids) - 1)
    pid = ids[i]
    p = A.photo(pid)
    st.progress((i + 1) / len(ids), text=f"{i + 1} / {len(ids)}장 대기 중")
    l, r = st.columns([3, 2])
    with l:
        st.image(imaging.render_with_boxes(str(A.abs_file(p)), A.boxes(pid)), width="stretch")
    with r:
        st.markdown(car_caption(p))
        st.caption(f"사진 #{pid} · 점검자 {p.get('inspector') or '-'} · 등록 {p['created_at'][:16]}")
        suggest_panel(pid, f"tri_tg{pid}", st.session_state.get(f"tri_cm{pid}", p.get("comment") or ""), f"tri_sg{pid}")
        tags = tag_picker("하자 항목", f"tri_tg{pid}")
        sev = st.radio("심각도", SEVERITIES, index=1, horizontal=True, key=f"tri_sv{pid}")
        cm = st.text_area("코멘트", p.get("comment") or "", key=f"tri_cm{pid}")
        ar = st.selectbox("촬영 부위(선택)", area_options(), index=None, key=f"tri_ar{pid}", placeholder="비워 두면 태그의 부위로 계산")
        b1, b2, b3 = st.columns(3)
        if b1.button("💾 저장 → 다음", type="primary", disabled=not tags, key=f"tri_s{pid}", width="stretch"):
            A.set_photo_defects(pid, [(c["id"], sev, "") for c in tags])
            A.update_photo(pid, comment=cm.strip(), area=ar or "")
            A.resolve_suggestions(pid, {c["id"] for c in tags})
            st.rerun()
        if b2.button("⏭️ 건너뛰기", key=f"tri_k{pid}", width="stretch"):
            st.session_state["tri_i"] = (i + 1) % len(ids)
            st.rerun()
        if b3.button("✅ 정상 사진", key=f"tri_n{pid}", width="stretch", help="하자가 없는 정상 부위 사진(비교용)으로 표시하고 대기함에서 뺍니다."):
            A.update_photo(pid, angle=NORMAL, comment=cm.strip(), area=ar or "")
            A.resolve_suggestions(pid, set())
            st.rerun()
        with st.expander("🗑️ 쓸 수 없는 사진(흔들림 등) 삭제"):
            if st.button("휴지통으로", key=f"tri_d{pid}"):
                A.soft_delete(pid)
                st.rerun()


# ───────────────────────── 페이지: 검색·갤러리 ─────────────────────────
def page_gallery():
    st.title("🔎 검색·갤러리")
    cats = A.categories()
    byid = {c["id"]: c for c in cats}
    with st.container(border=True):
        c = st.columns(4)
        mfrs = c[0].multiselect("제조사", A.distinct("manufacturer"), key="g_mf")
        models = c[1].multiselect("차종", A.models_of(mfrs or None), key="g_mo")
        mains = c[2].multiselect("대분류(부위)", sorted({x["main_part"] for x in cats}), key="g_mp")
        cat_ids = c[3].multiselect("하자 항목", [x["id"] for x in cats if not mains or x["main_part"] in mains],
                                   key="g_ct", format_func=lambda i: cat_display(byid[i]))
        c = st.columns(5)
        ymin = c[0].number_input("연식 이상", 1980, 2035, None, key="g_y0")
        ymax = c[1].number_input("연식 이하", 1980, 2035, None, key="g_y1")
        kmax = c[2].number_input("주행거리 이하(km)", 0, 2_000_000, None, step=10000, key="g_km")
        sevs = c[3].multiselect("심각도", SEVERITIES, key="g_sv")
        insp = c[4].multiselect("점검자", A.distinct("inspector", "p"), key="g_in")
        c = st.columns([2, 1, 1, 1, 1])
        text = c[0].text_input("글자 검색", key="g_tx", placeholder="코멘트·차량번호·차종·메모")
        flood = c[1].checkbox("💧 침수 관련만", key="g_fl")
        untag = c[2].checkbox("분류 전만", key="g_ut")
        d0 = c[3].date_input("등록일 이후", None, key="g_d0")
        d1 = c[4].date_input("등록일 이전", None, key="g_d1")
    f = dict(manufacturers=mfrs, models=models, main_parts=mains, category_ids=cat_ids, severities=sevs, inspectors=insp,
             year_min=ymin, year_max=ymax, mileage_max=kmax, text=text, flood_only=flood, untagged=untag, date_from=d0, date_to=d1)
    c = st.columns([1, 1, 2])
    order = c[0].selectbox("정렬", ["최신순", "오래된순", "차종순", "촬영일순"], key="g_or")
    per = 24
    _, total = A.search_photos(f, limit=1)
    pages = max(1, -(-total // per))
    pg = c[1].number_input(f"쪽 (1~{pages})", 1, pages, 1, key="g_pg")
    rows, _ = A.search_photos(f, limit=per, offset=(pg - 1) * per, order=order)
    c[2].markdown(f"**검색 결과 {total:,}장**")
    if total:
        allrows, _ = A.search_photos(f, limit=100000, order=order)
        flat = [{"사진ID": r["id"], "제조사": r["manufacturer"], "차종": r["model_name"], "연식": r["model_year"], "주행거리": r["mileage"],
                 "점검자": r["inspector"], "코멘트": r["comment"], "대분류": d["main_part"], "중분류": d["sub_part"], "하자유형": d["defect_type"],
                 "심각도": d["severity"], "침수관련": "Y" if d["is_flood"] else ""}
                for r in allrows for d in (r["defects"] or [{"main_part": "", "sub_part": "", "defect_type": "", "severity": "", "is_flood": 0}])]
        st.download_button("⬇️ 검색 결과 CSV (엑셀용)", pd.DataFrame(flat).to_csv(index=False).encode("utf-8-sig"),
                           file_name=f"carchive_search_{date.today():%Y%m%d}.csv", mime="text/csv")
    if not rows:
        st.info("조건에 맞는 사진이 없습니다. 조건을 줄여 보세요.")
        return
    cols = st.columns(4)
    for i, p in enumerate(rows):
        with cols[i % 4]:
            photo_card(p, f"g{p['id']}")



# ───────────────────────── 페이지: 차량·보고서 ─────────────────────────
def page_vehicle():
    st.title("🚗 차량·보고서")
    vs = [v for v in A.vehicles() if v["n_photos"]]
    if not vs:
        st.info("사진이 있는 차량이 없습니다.")
        return
    byid = {v["id"]: v for v in vs}
    vid = st.selectbox("차량 선택 (글자를 쳐서 검색)", [v["id"] for v in vs], format_func=lambda i: f"{A.vehicle_label(byid[i])} · 사진 {byid[i]['n_photos']}장", key="veh_pick")
    v = byid[vid]
    photos = A.vehicle_photos(vid)
    tags = [d for p in photos for d in p["defects"]]
    cov = A.vehicle_coverage(vid, REQUIRED_AREAS)
    done = sum(1 for c in cov if c["state"] != "미촬영")
    txt, n_flood, flood_items = report.flood_opinion(photos)
    m = st.columns(5)
    m[0].metric("사진", f"{len(photos)}장")
    m[1].metric("하자 태그", f"{len(tags)}건")
    m[2].metric("‘심각’", f"{sum(1 for d in tags if d['severity'] == '심각')}건")
    m[3].metric("💧 침수 관련 항목", f"{n_flood}개")
    m[4].metric("촬영 커버리지", f"{done}/{len(cov)}")
    (st.error if n_flood >= 3 else st.warning if n_flood else st.success)(f"침수 참고 소견: {txt}")
    t1, t2, t3 = st.tabs(["✅ 촬영 체크리스트", "🖼️ 사진", "📄 PDF 보고서"])
    with t1:
        icon = {"하자 있음": "🔴", "정상 확인": "🟢", "미촬영": "⚪"}
        st.dataframe(pd.DataFrame([{"상태": icon[c["state"]] + " " + c["state"], "부위": c["area"], "사진 수": c["n_photos"],
                                    "하자": ", ".join(c["defects"])} for c in cov]), hide_index=True, width="stretch", height=min(740, 38 * len(cov) + 40))
        miss = [c["area"] for c in cov if c["state"] == "미촬영"]
        if miss:
            st.warning("아직 촬영·기록되지 않은 필수 부위: " + ", ".join(miss))
        st.caption("정상인 부위도 사진을 올릴 때 ‘촬영 부위’를 지정하면 🟢 정상 확인으로 계산됩니다.")
    with t2:
        cols = st.columns(4)
        for i, p in enumerate(photos):
            with cols[i % 4]:
                photo_card(p, f"vp{p['id']}")
    with t3:
        st.caption("선택한 사진과 요약·하자표·촬영 커버리지·침수 참고 소견을 담은 A4 PDF를 만듭니다. 사진에는 저장해 둔 결함 위치 네모가 함께 그려집니다.")
        c = st.columns(2)
        insp = c[0].text_input("점검자(보고서 표기)", st.session_state.get("inspector", ""), key=f"rp_in{vid}")
        stat = c[1].checkbox("차종 참고 통계 포함", True, key=f"rp_st{vid}")
        summ = st.text_area("점검자 총평(선택)", key=f"rp_sm{vid}", placeholder="예: 프레임 하단 부식 진행. 미션 미세누유 관찰 필요.")
        lab = {p["id"]: f"#{p['id']} " + (", ".join(d["defect_type"] for d in p["defects"][:2]) or "태그 없음") for p in photos}
        order = sorted(lab, key=lambda i: -max([SEV_RANK.get(d["severity"], 0) for d in next(p for p in photos if p["id"] == i)["defects"]] or [0]))
        sel = st.multiselect("보고서에 넣을 사진", order, default=order[:30], format_func=lambda i: lab[i], key=f"rp_ph{vid}")
        if len(sel) > 30:
            st.caption("사진이 많으면 PDF가 길어집니다(30장 이하 권장).")
        if st.button("📄 PDF 만들기", type="primary", disabled=not sel, key=f"rp_go{vid}"):
            with st.spinner("PDF 만드는 중…"):
                path, data, no = report.save_report(A, vid, photo_ids=sel, inspector=insp, summary=summ, include_model_stats=stat)
            st.session_state[f"rp_out{vid}"] = (data, no)
        if out := st.session_state.get(f"rp_out{vid}"):
            st.success(f"만들었습니다: {out[1]}.pdf  (data/reports 폴더에도 저장됨)")
            st.download_button("⬇️ PDF 내려받기", out[0], file_name=f"{out[1]}.pdf", mime="application/pdf", type="primary", key=f"rp_dl{vid}")
        old = A.reports_of(vid)
        if old:
            with st.expander(f"이전에 만든 보고서 {len(old)}건"):
                for r in old:
                    f = A.report_dir / r["file_path"]
                    cc = st.columns([3, 2, 1])
                    cc[0].write(f"📄 {r['report_no']}")
                    cc[1].caption(f"{r['created_at'][:16]} · 사진 {r['n_photos']}장 · {r['inspector'] or '-'}")
                    if f.exists():
                        cc[2].download_button("받기", f.read_bytes(), file_name=f.name, mime="application/pdf", key=f"old{r['id']}")

# ───────────────────────── 페이지: 차종별 취약 리포트 ─────────────────────────
def page_report():
    st.title("🚘 차종별 취약 리포트")
    st.caption("“이 차종은 어디가 잘 문제 되나?” — 등록된 점검 사진에서 하자가 확인된 **차량 수** 기준으로 집계합니다.")
    t1, t2, t3 = st.tabs(["차종별 리포트", "차종 × 부위 히트맵", "💧 침수 의심 모아보기"])
    with t1:
        if "r_mf" not in st.session_state:   # 처음엔 사진이 가장 많은 차종을 보여 준다
            top = A.q1("SELECT v.manufacturer a, v.model_name b FROM photos p JOIN vehicles v ON v.id=p.vehicle_id "
                       "WHERE p.deleted_at IS NULL GROUP BY a, b ORDER BY COUNT(*) DESC LIMIT 1")
            if top:
                st.session_state["r_mf"], st.session_state["r_mo"] = top["a"], top["b"]
        c = st.columns(4)
        mfr = c[0].selectbox("제조사", A.distinct("manufacturer"), index=None, key="r_mf", placeholder="선택")
        model = c[1].selectbox("차종", A.models_of([mfr] if mfr else None), index=None, key="r_mo", placeholder="선택")
        y = A.q1("SELECT MIN(model_year) a, MAX(model_year) b FROM vehicles WHERE model_year IS NOT NULL")
        yr = (None, None)
        if y and y["a"] and y["a"] < y["b"]:
            yr = c[2].slider("연식 범위", y["a"], y["b"], (y["a"], y["b"]), key="r_yr")
        if not (mfr and model):
            st.info("제조사와 차종을 고르세요.")
        else:
            rows, nveh = A.model_report(mfr, model, *yr)
            n_ph = A.q1("SELECT COUNT(*) n FROM photos p JOIN vehicles v ON v.id=p.vehicle_id WHERE p.deleted_at IS NULL AND v.manufacturer=? AND v.model_name=?", (mfr, model))["n"]
            m = st.columns(3)
            m[0].metric("대상 차량", f"{nveh}대")
            m[1].metric("해당 차종 사진", f"{n_ph}장")
            m[2].metric("확인된 하자 종류", f"{len(rows)}가지")
            if nveh < 5:
                st.warning(f"표본이 {nveh}대뿐이라 비율은 참고용입니다. 데이터가 쌓일수록 정확해집니다.")
            if rows:
                df = pd.DataFrame(rows)
                df["하자"] = df["main_part"].str.split("(").str[0] + " › " + df["sub_part"] + " › " + df["defect_type"]
                hbar([{"label": r["하자"], "n": round(r["rate"] * 100, 1)} for _, r in df.head(10).iterrows()],
                     f"{mfr} {model} — 하자 발생 차량 비율 TOP 10", "#dc2626", xtitle="차량 비율(%)")
                show = pd.DataFrame({"하자": df["하자"], "💧": df["is_flood"].map({1: "💧", 0: ""}), "발견 차량 수": df["vehicles"],
                                     "발생률(%)": (df["rate"] * 100).round(1), "사진 수": df["photos"],
                                     "평균 심각도(1~3)": df["sev"].round(2), "‘심각’ 건수": df["n_severe"],
                                     "최저 주행거리(km)": df["km_min"], "평균 주행거리(km)": df["km_avg"].round(-2)})
                st.dataframe(show, width="stretch", hide_index=True,
                             column_config={"발생률(%)": st.column_config.ProgressColumn(min_value=0, max_value=100, format="%.1f")})
                st.download_button("⬇️ 이 표 CSV", show.to_csv(index=False).encode("utf-8-sig"),
                                   file_name=f"report_{mfr}_{model}.csv", mime="text/csv")
                st.subheader("대표 사진 (심각도 높은 순)")
                for _, r in df.head(5).iterrows():
                    st.markdown(f"**{r['하자']}** — {r['vehicles']}대 / {nveh}대")
                    ph = A.photos_for_category(int(r["category_id"]), mfr, model, 4)
                    cols = st.columns(4)
                    for i, p in enumerate(ph):
                        p["defects"] = A.photo_defects(p["id"])
                        with cols[i]:
                            photo_card(p, f"rp{r['category_id']}_{p['id']}")
            else:
                st.info("이 차종은 아직 하자 태그가 달린 사진이 없습니다.")
    with t2:
        mx = A.model_matrix()
        if not mx:
            st.info("데이터가 없습니다.")
        else:
            df = pd.DataFrame(mx)
            ch = alt.Chart(df).mark_rect().encode(
                x=alt.X("part:N", title=None, axis=alt.Axis(labelAngle=-20)), y=alt.Y("model:N", title=None),
                color=alt.Color("n:Q", title="차량 수", scale=alt.Scale(scheme="oranges")), tooltip=["model", "part", "n"])
            txt = alt.Chart(df).mark_text(fontSize=13).encode(x="part:N", y="model:N", text="n:Q")
            st.altair_chart((ch + txt).properties(height=max(160, 36 * df["model"].nunique())), width="stretch")
            st.caption("칸의 숫자 = 그 차종에서 해당 부위 하자가 확인된 차량 수.")
    with t3:
        rows, total = A.search_photos({"flood_only": True}, limit=12)
        fl = A.q("SELECT v.manufacturer||' '||v.model_name label, COUNT(DISTINCT v.id) n FROM photo_defects pd JOIN categories c ON c.id=pd.category_id "
                 "JOIN photos p ON p.id=pd.photo_id JOIN vehicles v ON v.id=p.vehicle_id WHERE c.is_flood=1 AND p.deleted_at IS NULL GROUP BY label ORDER BY n DESC")
        hbar(fl, "침수 관련 항목이 확인된 차량 수(차종별)", "#0284c7", xtitle="차량 수")
        st.caption(f"💧 표시 항목이 붙은 사진 {total}장 중 최신 12장 — 전체는 갤러리의 ‘💧 침수 관련만’으로 보세요. "
                   "침수 여부의 최종 판단은 여러 증거를 종합해야 하며 이 화면은 참고 자료입니다.")
        cols = st.columns(4)
        for i, p in enumerate(rows):
            with cols[i % 4]:
                photo_card(p, f"fl{p['id']}")


# ───────────────────────── 페이지: 분류체계 관리 ─────────────────────────
def page_taxonomy():
    st.title("🧩 분류체계 관리")
    st.caption("부위·하자 항목은 여기서 마음대로 추가·이름 변경·숨김 할 수 있습니다. 이름을 바꾸면 이미 달린 태그에도 자동 반영됩니다. "
               "항목은 지우지 않고 ‘사용’을 끄면 목록에서만 숨겨집니다(기존 사진 태그 보존).")
    cats = A.categories(active_only=False)
    with st.form("addcat", clear_on_submit=True):
        c = st.columns([2, 2, 2, 1])
        mp = c[0].selectbox("대분류", sorted({x["main_part"] for x in cats}), index=None, accept_new_options=True, placeholder="선택/새로 입력")
        sp = c[1].selectbox("중분류", sorted({x["sub_part"] for x in cats}), index=None, accept_new_options=True, placeholder="선택/새로 입력")
        dt = c[2].text_input("하자 유형")
        fl = c[3].checkbox("💧 침수 관련")
        if st.form_submit_button("➕ 항목 추가"):
            if not (mp and sp and dt.strip()):
                st.error("대분류·중분류·하자 유형을 모두 입력하세요.")
            else:
                try:
                    A.add_category(mp, sp, dt, fl)
                    st.rerun()
                except sqlite3.IntegrityError:
                    st.error("이미 있는 항목입니다.")
    use = A.category_usage()
    df = pd.DataFrame([{"id": c["id"], "대분류": c["main_part"], "중분류": c["sub_part"], "하자 유형": c["defect_type"],
                        "침수 관련": bool(c["is_flood"]), "사용": bool(c["is_active"]), "사진 수": use.get(c["id"], 0)} for c in cats])
    ed = st.data_editor(df, hide_index=True, width="stretch", height=520, key="tax_ed", disabled=["id", "사진 수"],
                        column_config={"id": st.column_config.NumberColumn(width="small")})
    if st.button("💾 변경 저장", type="primary"):
        n, errs = 0, []
        for (_, a), (_, b) in zip(df.iterrows(), ed.iterrows()):
            if not a.equals(b):
                try:
                    A.update_category(int(b["id"]), b["대분류"], b["중분류"], b["하자 유형"], b["침수 관련"], b["사용"])
                    n += 1
                except sqlite3.IntegrityError:
                    errs.append(f"#{b['id']} {b['대분류']} › {b['중분류']} › {b['하자 유형']} : 이미 같은 항목이 있어 저장 못 함")
        for e in errs:
            st.error(e)
        if n and not errs:
            st.rerun()
        elif not n and not errs:
            st.info("바뀐 내용이 없습니다.")


# ───────────────────────── 페이지: 데이터 관리 ─────────────────────────
def page_data():
    st.title("💾 데이터 관리")
    t1, t2, t3, t4, t5 = st.tabs(["내보내기", "백업", "차량 목록·수정", "휴지통", "데모 데이터"])
    with t1:
        rows = A.export_rows()
        st.write(f"사진×태그 {len(rows):,}행. 엑셀에서 바로 열립니다(UTF-8).")
        if rows:
            df = pd.DataFrame(rows)
            st.dataframe(df.head(20), width="stretch", hide_index=True)
            st.download_button("⬇️ 전체 CSV", df.to_csv(index=False).encode("utf-8-sig"),
                               file_name=f"carchive_all_{date.today():%Y%m%d}.csv", mime="text/csv", type="primary")
    with t2:
        st.write(f"현재 저장소 크기: **{A.storage_mb():,.1f} MB** · 위치: `{A.root.resolve()}`")
        st.caption("사진과 DB를 zip 하나로 묶습니다. 정기적으로(예: 주 1회) 외장하드·공유 드라이브에 복사해 두세요. "
                   "복구하려면 앱을 끄고 zip을 풀어 `carchive.db`, `photos/`, `thumbs/` 를 data 폴더에 덮어쓰면 됩니다.")
        if st.button("📦 백업 만들기"):
            with st.spinner("압축 중…"):
                z = A.backup()
            st.success(f"만들었습니다: {z.name}")
        for z in sorted(A.backup_dir.glob("*.zip"), reverse=True)[:5]:
            c = st.columns([3, 1, 1])
            c[0].write(f"📦 {z.name}")
            c[1].write(f"{z.stat().st_size / 1e6:,.1f} MB")
            c[2].download_button("내려받기", z.read_bytes() if z.stat().st_size < 500e6 else b"", file_name=z.name, key=f"bk{z.name}",
                                 disabled=z.stat().st_size >= 500e6)
    with t3:
        vs = A.vehicles()
        if not vs:
            st.info("차량이 없습니다.")
        else:
            df = pd.DataFrame([{k: v[k] for k in ("id", "manufacturer", "model_name", "model_year", "mileage", "trim", "fuel", "plate", "vin", "memo", "n_photos")} for v in vs])
            df.columns = ["id", "제조사", "차종", "연식", "주행거리", "트림", "연료", "차량번호", "차대번호", "메모", "사진 수"]
            ed = st.data_editor(df, hide_index=True, width="stretch", disabled=["id", "사진 수"], key="veh_ed", height=420)
            if st.button("💾 차량 정보 저장"):
                keys = ["manufacturer", "model_name", "model_year", "mileage", "trim", "fuel", "plate", "vin", "memo"]
                n = 0
                for (_, a), (_, b) in zip(df.iterrows(), ed.iterrows()):
                    if not a.equals(b):
                        vals = {k: (None if pd.isna(x) else (int(x) if k in ("model_year", "mileage") else x)) for k, x in zip(keys, b.iloc[1:10])}
                        if not (vals["manufacturer"] and vals["model_name"]):
                            st.error(f"#{b['id']}: 제조사·차종은 비울 수 없습니다.")
                            continue
                        A.update_vehicle(int(b["id"]), **vals)
                        n += 1
                st.success(f"{n}대 수정했습니다.") if n else st.info("바뀐 내용이 없습니다.")
    with t4:
        tr = A.trash()
        if not tr:
            st.info("휴지통이 비어 있습니다.")
        for p in tr:
            c = st.columns([1, 4, 1, 1])
            c[0].image(str(A.abs_thumb(p)), width="stretch")
            c[1].write(f"#{p['id']} {p['manufacturer']} {p['model_name']} · 삭제 {p['deleted_at'][:16]}")
            if c[2].button("되살리기", key=f"rs{p['id']}"):
                A.restore(p["id"]); st.rerun()
            if c[3].button("영구 삭제", key=f"pg{p['id']}"):
                A.purge(p["id"]); st.rerun()
    with t5:
        st.write("체험용 합성 이미지를 넣거나 지웁니다. 점검자 이름이 ‘데모’인 사진만 대상이라 실제 데이터는 건드리지 않습니다.")
        c = st.columns(2)
        if c[0].button("🧪 데모 데이터 넣기"):
            st.success(f"{demo.load_demo(A)}장 추가"); st.rerun()
        if c[1].button("🧹 데모 데이터 모두 지우기"):
            st.success(f"{demo.remove_demo(A)}장 삭제"); st.rerun()


# ───────────────────────── 메인 ─────────────────────────
st.session_state.setdefault("page", PAGES[0])
with st.sidebar:
    st.markdown("## 🚗 Car-chive")
    st.caption("중고차 점검 사진 아카이브")
    st.radio("메뉴", PAGES, key="page", label_visibility="collapsed")
    t = A.totals()
    st.divider()
    st.caption(f"사진 {t['photos']:,}장 · 차량 {t['vehicles']:,}대 · 분류 대기 {t['untagged']:,}장")

PAGE_FN = dict(zip(PAGES, [page_dashboard, page_upload, page_triage, page_gallery, page_vehicle, page_report, page_taxonomy, page_data]))
PAGE_FN[st.session_state["page"]]()
