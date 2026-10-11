"""하자 후보 자동 추천.

네 가지 단서를 합쳐 ‘이 사진에 붙일 만한 태그’ 후보를 점수순으로 보여 준다. 추천은 어디까지나 후보이며
사용자가 눌러서 확정해야 태그가 된다(자동 확정 없음).

  prior    같은 차종에서 자주 나온 하자(데이터가 쌓일수록 정확)
  keyword  점검자 코멘트에 적힌 부위·증상 단어
  visual   색·질감이 비슷한 기존 사진에 달린 태그(간이 유사도 — 하자를 ‘알아보는’ 것이 아님)
  ml       이 아카이브의 태그된 사진으로 학습한 전용 분류 모델(데이터 관리 › 학습 모델)
  ai       Claude 비전 판독(선택. API 키가 있고 사용자가 버튼을 눌렀을 때만, 사진이 외부로 전송됨)
"""
from __future__ import annotations

import base64
import json
import os
import re
from dataclasses import dataclass, field

import numpy as np

from db import Archive

SOURCE_NAMES = {"ml": "학습 모델", "prior": "차종 통계", "keyword": "코멘트 단어", "visual": "비슷한 사진", "ai": "AI 판독"}
WEIGHT = {"ml": 0.85, "ai": 1.0, "keyword": 0.9, "prior": 0.6, "visual": 0.5}
MIN_SCORE = 0.12

# 증상 단어 → 같은 뜻으로 보는 표현들
SYMPTOMS = {
    "누유": ["누유", "오일 샘", "오일샘", "오일 번", "기름", "번짐", "젖어", "새어", "누출"],
    "누수": ["누수", "냉각수 샘", "물 샘"],
    "부식": ["부식", "녹", "삭", "썩", "산화", "오염"],
    "진흙": ["진흙", "펄", "모래", "흙", "토사"],
    "침수": ["침수", "물때", "물 자국", "잠김", "잠긴", "젖은"],
    "곰팡이": ["곰팡이", "악취", "냄새", "쉰내"],
    "용접": ["용접", "절단", "땜", "스팟"],
    "판금": ["판금", "도색", "덧칠", "재도장", "퍼티", "광택 차이"],
    "교환": ["교환", "탈거", "교체", "신품"],
    "파손": ["파손", "깨짐", "깨진", "균열", "금이", "크랙", "갈라"],
    "마모": ["마모", "닳", "편마모", "단차"],
    "유격": ["유격", "흔들", "덜컹"],
    "혼입": ["혼입", "섞", "유화", "카푸치노"],
    "변색": ["변색", "탄 ", "검게", "타서"],
    "굴곡": ["굴곡", "변형", "찌그러", "휨", "주름"],
    "찍힘": ["찍힘", "덴트", "긁힘"],
}
# 부위 별칭(중분류 이름에서 자동으로 뽑은 단어 외에 사람들이 흔히 쓰는 말)
PART_ALIAS = {
    "프레임/서브프레임": ["프레임", "서브프레임", "크로스멤버", "멤버"],
    "미션/변속기": ["미션", "변속기", "오토미션", "미션팬"],
    "엔진블록": ["엔진", "블록", "오일팬", "헤드커버"],
    "실린더헤드": ["헤드", "가스켓", "실린더"],
    "라디에이터/냉각계": ["라디에이터", "냉각", "라디", "쿨런트", "워터펌프"],
    "퓨즈박스/전장": ["퓨즈", "전장", "릴레이", "배선", "컨트롤"],
    "안전벨트": ["벨트", "안전벨트", "시트벨트"],
    "바닥 매트/카펫 하단": ["매트", "카펫", "바닥", "플로어"],
    "시트/시트레일": ["시트", "레일"],
    "트렁크/스페어타이어 수납부": ["트렁크", "스페어", "공구함"],
    "서스펜션": ["서스펜션", "쇼바", "쇽", "부싱", "스프링", "암"],
    "조향장치": ["조향", "스티어링", "타이로드", "랙"],
    "제동장치": ["브레이크", "제동", "디스크", "캘리퍼", "패드"],
    "배기계": ["배기", "머플러", "촉매", "소음기"],
    "휠하우스": ["휠하우스", "휠 하우스", "펜더"],
    "쿼터패널": ["쿼터", "휀다", "뒷펜더"],
    "필러/사이드실": ["필러", "사이드실", "실패널", "A필러", "B필러", "C필러"],
    "인사이드패널/트렁크플로어": ["인사이드", "트렁크 플로어", "트렁크플로어", "리어패널"],
    "범퍼/라이트/유리": ["범퍼", "라이트", "헤드램프", "램프", "유리", "윈드"],
    "구동계(등속조인트)": ["등속", "조인트", "부츠", "드라이브샤프트"],
    "터보/인터쿨러": ["터보", "인터쿨러"],
    "고전압 배터리팩": ["배터리팩", "배터리", "고전압"],
    "충전구/고전압 커넥터": ["충전구", "충전", "커넥터"],
    "계기판/경고등": ["계기판", "경고등", "클러스터"],
    "에어컨/공조": ["에어컨", "공조", "증발기", "히터"],
    "타이어": ["타이어"],
    "휠": ["휠", "알루미늄휠"],
    "도어": ["도어", "문짝"],
    "하부 전반": ["하부", "언더", "바닥면"],
}


@dataclass
class Suggestion:
    category: dict
    score: float = 0.0
    sources: dict[str, float] = field(default_factory=dict)   # source -> 단서 점수(0~1)
    reasons: list[str] = field(default_factory=list)


def _tokens(label: str) -> list[str]:
    return [t for t in re.split(r"[\s/()·,]+", label) if len(t) >= 2]


def keyword_scores(text: str, cats: list[dict]) -> dict[int, tuple[float, str]]:
    """코멘트에 부위 단어와 증상 단어가 같이 있으면 높은 점수, 한쪽만 있으면 낮은 점수."""
    if not text or not text.strip():
        return {}
    out = {}
    for c in cats:
        parts = set(_tokens(c["sub_part"])) | set(PART_ALIAS.get(c["sub_part"], []))
        sym = set()
        for tok in _tokens(c["defect_type"]):
            base = re.sub(r"(흔적|관련|여부)$", "", tok)
            for key, syns in SYMPTOMS.items():
                if key in base or any(base.startswith(s) for s in syns):
                    sym |= set(syns) | {key}
            sym.add(base)
        sym = {s for s in sym if len(s) >= 1}
        ph = [p for p in parts if p in text]
        dh = [s for s in sym if len(s) >= 2 and s in text] + [s for s in sym if len(s) == 1 and re.search(rf"(?<![가-힣]){s}(?![가-힣])", text)]
        if ph and dh:
            out[c["id"]] = (0.9, f"코멘트에 ‘{ph[0]}’+‘{dh[0]}’")
        elif dh:
            out[c["id"]] = (0.3, f"코멘트에 ‘{dh[0]}’")
        elif ph:
            out[c["id"]] = (0.15, f"코멘트에 ‘{ph[0]}’")
    return out


def prior_scores(a: Archive, vehicle: dict, cats: list[dict]) -> dict[int, tuple[float, str]]:
    counts, n_veh = a.model_category_counts(vehicle["manufacturer"], vehicle["model_name"])
    if n_veh < 2:
        return {}
    glob = a.global_category_rates()
    out = {}
    for c in cats:
        k = counts.get(c["id"], 0)
        if not k:
            continue
        rate = (k + 2 * glob.get(c["id"], 0.0)) / (n_veh + 2)   # 표본이 적으면 전체 평균 쪽으로 당긴다
        out[c["id"]] = (min(0.8, rate * 1.4), f"같은 차종 {n_veh}대 중 {k}대에서 확인")
    return out


def visual_scores(a: Archive, pid: int, vehicle_id: int, k=8, min_sim=0.93) -> dict[int, tuple[float, str]]:
    a.ensure_embeddings()
    me = a.photo_embedding(pid)
    if me is None:
        return {}
    q = np.frombuffer(me, dtype=np.float32)
    rows = a.tagged_embeddings(vehicle_id)
    if not rows:
        return {}
    M = np.stack([np.frombuffer(r[1], dtype=np.float32) for r in rows])
    sim = (M @ q) / ((np.linalg.norm(M, axis=1) + 1e-9) * (np.linalg.norm(q) + 1e-9))
    sims = sorted(((float(sim[i]), rows[i][0], rows[i][2]) for i in np.argsort(-sim)[:k]), reverse=True)
    top = [t for t in sims[:k] if t[0] >= min_sim]
    if not top:
        return {}
    wsum = sum(t[0] - min_sim + 0.01 for t in top)
    agg: dict[int, float] = {}
    cnt: dict[int, int] = {}
    for s, _, cids in top:
        for cid in cids:
            agg[cid] = agg.get(cid, 0.0) + (s - min_sim + 0.01)
            cnt[cid] = cnt.get(cid, 0) + 1
    return {cid: (min(0.7, w / wsum * 0.9), f"비슷한 사진 {len(top)}장 중 {cnt[cid]}장에 달린 태그") for cid, w in agg.items()}


def suggest(a: Archive, pid: int, comment: str | None = None, include_ai: bool = True, top_n=6) -> list[Suggestion]:
    p = a.photo(pid)
    cats = a.categories()
    byid = {c["id"]: c for c in cats}
    have = {d["category_id"] for d in p["defects"]}
    comment = p.get("comment") if comment is None else comment
    layers = {
        "prior": prior_scores(a, p, cats),
        "keyword": keyword_scores(comment or "", cats),
        "visual": visual_scores(a, pid, p["vehicle_id"]),
    }
    try:   # 학습된 모델이 있으면 사용(scikit-learn 이 없거나 모델이 없으면 조용히 건너뜀)
        import ml
        layers["ml"] = ml.predict(a, pid)
    except Exception:  # noqa: BLE001
        pass
    if include_ai:
        layers["ai"] = ai_cached_scores(a, pid)
    res: dict[int, Suggestion] = {}
    for src, d in layers.items():
        for cid, (sc, why) in d.items():
            if cid in have or cid not in byid:
                continue
            s = res.setdefault(cid, Suggestion(byid[cid]))
            s.sources[src] = sc
            s.reasons.append(f"{SOURCE_NAMES[src]}: {why}")
    for s in res.values():   # noisy-OR: 단서가 겹칠수록 확신이 올라간다
        miss = 1.0
        for src, sc in s.sources.items():
            miss *= 1 - WEIGHT[src] * sc
        s.score = 1 - miss
    out = sorted((s for s in res.values() if s.score >= MIN_SCORE), key=lambda s: -s.score)[:top_n]
    if out:
        a.log_suggestions(pid, [(s.category["id"], ",".join(sorted(s.sources)), round(s.score, 3)) for s in out])
    return out


# ───────────── AI(Claude 비전) — 선택 기능 ─────────────
def ai_available() -> bool:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return False
    try:
        import anthropic  # noqa: F401
        return True
    except ImportError:
        return False


def _parse_ai(text: str, valid_ids: set[int]) -> list[dict]:
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        return []
    try:
        data = json.loads(m.group(0))
    except json.JSONDecodeError:
        return []
    out = []
    for it in data.get("candidates", []):
        try:
            cid, conf = int(it["id"]), float(it.get("confidence", 0.5))
        except (KeyError, TypeError, ValueError):
            continue
        if cid in valid_ids:
            out.append({"id": cid, "confidence": max(0.0, min(1.0, conf)), "reason": str(it.get("reason", ""))[:200]})
    return out[:6]


def ai_cached_scores(a: Archive, pid: int) -> dict[int, tuple[float, str]]:
    raw = a.ai_cache_get(pid)
    if not raw:
        return {}
    try:
        items = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return {it["id"]: (min(0.95, it["confidence"]), f"{it.get('reason') or '사진 판독'} (신뢰 {it['confidence']:.0%})") for it in items}


def ai_run(a: Archive, pid: int, client=None) -> list[dict]:
    """사진 1장을 AI에게 보여 후보를 받아 캐시에 저장한다(같은 사진은 다시 호출하지 않음). 실패하면 예외."""
    p = a.photo(pid)
    cats = a.categories()
    valid = {c["id"] for c in cats}
    import io
    from PIL import Image, ImageOps
    im = ImageOps.exif_transpose(Image.open(a.abs_file(p))).convert("RGB")
    im.thumbnail((1280, 1280))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=85)
    listing = "\n".join(f"{c['id']}: {c['label']}" for c in cats)
    prompt = (
        "당신은 중고차 점검 사진을 보조 판독하는 도우미입니다. 사진에서 *눈에 보이는* 이상 징후만 근거로, 아래 분류 목록에서 "
        "해당할 만한 항목을 최대 5개 고르세요. 사진으로 확신할 수 없으면 신뢰도를 낮게 주거나 고르지 마세요. 추측으로 침수·사고를 단정하지 마세요.\n"
        f"차량: {p['manufacturer']} {p['model_name']} {p.get('model_year') or ''}\n점검자 코멘트: {p.get('comment') or '없음'}\n\n"
        f"분류 목록(id: 대분류 › 중분류 › 하자유형):\n{listing}\n\n"
        '반드시 JSON 한 개만 출력: {"candidates":[{"id":번호,"confidence":0~1,"reason":"보이는 근거 한 문장"}]}  해당 없으면 {"candidates":[]}')
    model = os.environ.get("CARCHIVE_VISION_MODEL", "claude-sonnet-5-5")
    if client is None:
        import anthropic
        client = anthropic.Anthropic()
    msg = client.messages.create(model=model, max_tokens=700, messages=[{"role": "user", "content": [
        {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": base64.b64encode(buf.getvalue()).decode()}},
        {"type": "text", "text": prompt}]}])
    text = "".join(getattr(b, "text", "") for b in msg.content)
    items = _parse_ai(text, valid)
    a.ai_cache_set(pid, json.dumps(items, ensure_ascii=False), model)
    return items
