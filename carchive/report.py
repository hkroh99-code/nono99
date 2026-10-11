"""차량 점검 사진 보고서(PDF). fpdf2 + 동봉 나눔고딕 폰트(한글)."""
from __future__ import annotations

import io
from datetime import datetime
from pathlib import Path

import logging

from fpdf import FPDF
from fpdf.enums import XPos, YPos

import imaging
from db import SEV_RANK, Archive
from taxonomy import REQUIRED_AREAS

logging.getLogger("fontTools").setLevel(logging.ERROR)   # 폰트 서브셋 경고 숨김
FONT_DIR = Path(__file__).parent / "fonts"
SEV_COLOR = {"경미": (22, 163, 74), "주의": (217, 119, 6), "심각": (220, 38, 38)}
STATE_COLOR = {"하자 있음": (220, 38, 38), "정상 확인": (22, 163, 74), "미촬영": (120, 120, 120)}
DISCLAIMER = ("본 보고서는 점검 시점에 촬영·기록된 사진과 점검자의 의견을 정리한 참고 자료입니다. 촬영되지 않은 부위와 사진으로 확인할 수 없는 "
              "내부 상태는 포함되지 않으며, 침수·사고 이력의 최종 판단은 점검자의 종합 검토와 추가 정밀 점검에 따릅니다.")


def flood_opinion(photos: list[dict]) -> tuple[str, int, list[str]]:
    """침수 관련 태그 개수로 만든 참고 소견. (등급문구, 항목수, 근거 목록)"""
    items = {}
    for p in photos:
        for d in p["defects"]:
            if d["is_flood"]:
                key = f"{d['sub_part']} · {d['defect_type']}"
                items[key] = max(items.get(key, ""), d["severity"], key=lambda s: SEV_RANK.get(s, 0))
    n = len(items)
    severe = any(v == "심각" for v in items.values())
    if n == 0:
        txt = "사진상 침수 관련 항목이 확인되지 않음(촬영 범위 내)"
    elif n >= 3 or severe:
        txt = "침수 관련 흔적이 다수/심각 수준으로 기록됨 — 정밀 점검 권장"
    else:
        txt = "침수 관련 흔적 일부 기록됨 — 추가 확인 권장"
    return txt, n, [f"{k} ({v})" for k, v in sorted(items.items())]


class PDF(FPDF):
    def __init__(self, title: str, number: str):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.doc_title, self.number = title, number
        self.add_font("N", "", str(FONT_DIR / "NanumGothic-Regular.ttf"))
        self.add_font("N", "B", str(FONT_DIR / "NanumGothic-Bold.ttf"))
        self.set_auto_page_break(True, 16)
        self.set_margins(14, 14, 14)
        self.set_title(title)
        self.set_creator("Car-chive")

    def header(self):
        self.set_font("N", "", 8)
        self.set_text_color(130)
        self.cell(0, 5, f"Car-chive 점검 사진 보고서 · {self.number}", align="L")
        self.ln(7)
        self.set_text_color(0)

    def footer(self):
        self.set_y(-12)
        self.set_font("N", "", 8)
        self.set_text_color(130)
        self.cell(0, 5, f"{self.page_no()} / {{nb}}", align="C")
        self.set_text_color(0)

    # ── 작은 도구들 ──
    def h2(self, txt):
        self.ln(2)
        self.set_font("N", "B", 12)
        self.set_fill_color(235, 240, 250)
        self.cell(0, 8, "  " + txt, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)
        self.set_font("N", "", 9.5)

    def kv(self, rows: list[tuple[str, str]], cols=2):
        w = (self.w - self.l_margin - self.r_margin) / cols
        self.set_font("N", "", 9.5)
        for i in range(0, len(rows), cols):
            for k, v in rows[i:i + cols]:
                x, y = self.get_x(), self.get_y()
                self.set_text_color(110)
                self.cell(24, 6, k)
                self.set_text_color(0)
                self.cell(w - 24, 6, str(v or "-"))
            self.ln(6.5)

    def table(self, head, rows, widths, colors: dict | None = None):
        self.set_font("N", "B", 9)
        self.set_fill_color(225, 230, 240)
        for h, w in zip(head, widths):
            self.cell(w, 7, h, border=1, fill=True, align="C")
        self.ln()
        self.set_font("N", "", 9)
        for r in rows:
            if self.get_y() > self.h - 28:
                self.add_page()
            for j, (v, w) in enumerate(zip(r, widths)):
                if colors and (j in colors) and v in colors[j]:
                    self.set_text_color(*colors[j][v])
                self.cell(w, 6.5, str(v), border=1)
                self.set_text_color(0)
            self.ln()


def build_report(a: Archive, vehicle_id: int, photo_ids: list[int] | None = None, inspector: str = "", summary: str = "",
                 include_model_stats: bool = True, now: datetime | None = None) -> tuple[bytes, str]:
    now = now or datetime.now()
    v = a.vehicle(vehicle_id)
    all_photos = a.vehicle_photos(vehicle_id)
    photos = [p for p in all_photos if photo_ids is None or p["id"] in photo_ids]
    number = f"CC-{vehicle_id:05d}-{now:%Y%m%d%H%M}"
    pdf = PDF("차량 점검 사진 보고서", number)
    pdf.alias_nb_pages()
    pdf.add_page()

    pdf.set_font("N", "B", 20)
    pdf.cell(0, 12, "차량 점검 사진 보고서", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("N", "", 9)
    pdf.set_text_color(110)
    pdf.cell(0, 5, f"보고서 번호 {number}   ·   작성 {now:%Y-%m-%d %H:%M}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_text_color(0)

    pdf.h2("1. 차량 정보")
    pdf.kv([("제조사", v["manufacturer"]), ("차종", v["model_name"]), ("트림", v.get("trim")), ("연식", f"{v['model_year']}년식" if v.get("model_year") else ""),
            ("주행거리", f"{v['mileage']:,} km" if v.get("mileage") else ""), ("연료", v.get("fuel")),
            ("차량번호", v.get("plate")), ("차대번호", v.get("vin")),
            ("점검자", inspector or ", ".join(sorted({p["inspector"] for p in photos if p.get("inspector")})) or ""), ("점검 사진", f"{len(photos)}장")])

    # 하자 집계
    tags = [(p, d) for p in photos for d in p["defects"]]
    sev_n = {s: sum(1 for _, d in tags if d["severity"] == s) for s in SEV_RANK}
    txt, n_flood, flood_items = flood_opinion(photos)
    pdf.h2("2. 점검 요약")
    pdf.set_font("N", "B", 10.5)
    pdf.cell(0, 7, f"하자 태그 {len(tags)}건  (심각 {sev_n['심각']} · 주의 {sev_n['주의']} · 경미 {sev_n['경미']})", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("N", "", 9.5)
    pdf.set_text_color(*( (220, 38, 38) if n_flood >= 3 else (217, 119, 6) if n_flood else (22, 163, 74)))
    pdf.cell(0, 6.5, f"침수 관련 참고 소견: {txt}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_text_color(0)
    for f in flood_items:
        pdf.cell(0, 5.5, f"    • {f}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    if summary.strip():
        pdf.ln(1)
        pdf.set_font("N", "B", 9.5)
        pdf.cell(0, 6, "점검자 총평", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("N", "", 9.5)
        pdf.multi_cell(0, 5.5, summary.strip(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # 하자 표
    pdf.h2("3. 하자 목록")
    grp: dict[tuple, dict] = {}
    for p, d in tags:
        g = grp.setdefault((d["main_part"], d["sub_part"], d["defect_type"]), {"sev": d["severity"], "n": 0, "ids": []})
        g["n"] += 1
        g["ids"].append(p["id"])
        if SEV_RANK[d["severity"]] > SEV_RANK[g["sev"]]:
            g["sev"] = d["severity"]
    if grp:
        rows = [(f"{k[0].split('(')[0]} › {k[1]}", k[2], g["sev"], f"{g['n']}장", ", ".join(f"#{i}" for i in g["ids"][:6]))
                for k, g in sorted(grp.items(), key=lambda kv: (-SEV_RANK[kv[1]["sev"]], kv[0]))]
        pdf.table(["부위", "하자 유형", "심각도", "사진", "사진번호"], rows, [54, 56, 18, 14, 40], {2: SEV_COLOR})
    else:
        pdf.cell(0, 7, "기록된 하자 태그가 없습니다.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # 커버리지
    pdf.h2("4. 촬영 커버리지 (필수 부위)")
    cov = a.vehicle_coverage(vehicle_id, REQUIRED_AREAS)
    done = sum(1 for c in cov if c["state"] != "미촬영")
    pdf.cell(0, 6, f"필수 {len(cov)}개 부위 중 {done}개 촬영 · 미촬영 {len(cov) - done}개", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(1)
    pdf.table(["부위", "상태", "사진", "내용"], [(c["area"], c["state"], f"{c['n_photos']}장", ", ".join(c["defects"])[:34]) for c in cov],
              [62, 24, 14, 82], {1: STATE_COLOR})

    if include_model_stats:
        rows, n_veh = a.model_report(v["manufacturer"], v["model_name"])
        if rows and n_veh >= 2:
            pdf.h2(f"5. 참고: {v['manufacturer']} {v['model_name']} 차종에서 자주 기록된 하자")
            pdf.set_font("N", "", 8.5)
            pdf.cell(0, 5, f"우리 아카이브의 같은 차종 {n_veh}대 기준(표본이 작으면 참고용).", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.ln(1)
            pdf.table(["부위 › 하자", "발견 차량", "비율"], [(f"{r['sub_part']} › {r['defect_type']}"[:44], f"{r['vehicles']}대", f"{r['rate']:.0%}") for r in rows[:6]],
                      [120, 30, 32])

    # 사진
    if photos:
        pdf.add_page()
        pdf.h2("6. 점검 사진")
        for p in photos:
            fp = a.abs_file(p)
            if not fp.exists():
                continue
            im = imaging.render_with_boxes(str(fp), a.boxes(p["id"]))
            im.thumbnail((900, 900))
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=82)
            iw = 86.0
            ih = iw * im.height / im.width
            if pdf.get_y() + max(ih, 30) > pdf.h - 18:
                pdf.add_page()
            y0 = pdf.get_y()
            pdf.image(buf, x=pdf.l_margin, y=y0, w=iw)
            x = pdf.l_margin + iw + 5
            pdf.set_xy(x, y0)
            wtxt = pdf.w - pdf.r_margin - x
            pdf.set_font("N", "B", 9.5)
            pdf.multi_cell(wtxt, 5.5, f"사진 #{p['id']}" + (f"  ·  {p['area']}" if p.get("area") else ""), new_x=XPos.LEFT, new_y=YPos.NEXT)
            pdf.set_font("N", "", 8.5)
            pdf.set_text_color(110)
            meta = [f"촬영 {p['shot_at'][:16]}" if p.get("shot_at") else f"등록 {p['created_at'][:16]}"]
            if p.get("inspector"):
                meta.append(f"점검자 {p['inspector']}")
            pdf.multi_cell(wtxt, 5, " · ".join(meta), new_x=XPos.LEFT, new_y=YPos.NEXT)
            pdf.set_text_color(0)
            for d in sorted(p["defects"], key=lambda d: -SEV_RANK[d["severity"]]):
                pdf.set_text_color(*SEV_COLOR[d["severity"]])
                pdf.multi_cell(wtxt, 5, f"■ [{d['severity']}] {d['sub_part']} · {d['defect_type']}" + ("  (침수 관련)" if d["is_flood"] else ""),
                               new_x=XPos.LEFT, new_y=YPos.NEXT)
            pdf.set_text_color(0)
            if not p["defects"]:
                pdf.multi_cell(wtxt, 5, "(하자 태그 없음)", new_x=XPos.LEFT, new_y=YPos.NEXT)
            if p.get("comment"):
                pdf.set_xy(x, pdf.get_y() + 1)
                pdf.multi_cell(wtxt, 5, p["comment"], new_x=XPos.LEFT, new_y=YPos.NEXT)
            pdf.set_y(max(pdf.get_y(), y0 + ih) + 6)

    # 서명·면책
    if pdf.get_y() > pdf.h - 60:
        pdf.add_page()
    pdf.ln(4)
    pdf.set_font("N", "", 8)
    pdf.set_text_color(110)
    pdf.multi_cell(0, 4.5, DISCLAIMER, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_text_color(0)
    pdf.ln(8)
    pdf.set_font("N", "", 9.5)
    pdf.cell(95, 8, "점검자 :  ______________________  (서명)")
    pdf.cell(0, 8, "확인자 :  ______________________  (서명)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    return bytes(pdf.output()), number


def save_report(a: Archive, vehicle_id: int, **kw) -> tuple[Path, bytes, str]:
    data, number = build_report(a, vehicle_id, **kw)
    path = a.report_dir / f"{number}.pdf"
    path.write_bytes(data)
    a.add_report_record(vehicle_id, number, path.name, kw.get("inspector", ""), len(kw.get("photo_ids") or a.vehicle_photos(vehicle_id)))
    return path, data, number
