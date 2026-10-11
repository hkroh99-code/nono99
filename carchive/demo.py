"""체험용 가상 데이터. 실제 사진이 아니라 글자가 적힌 합성 이미지이며, 점검자 이름이 '데모'로 저장된다."""
from __future__ import annotations

import io
import random

from PIL import Image, ImageDraw

import imaging
from db import Archive

DEMO = "데모"

# (제조사, 차종, 연식, 주행거리, 연료) 와 그 차종에서 잘 나오는 하자 (중분류, 하자유형) 가중치
FLEET = {
    ("현대", "그랜저 IG", "가솔린"): [("프레임/서브프레임", "부식(녹)", 5), ("미션/변속기", "미세누유", 3), ("엔진블록", "미세누유", 2), ("서스펜션", "고무부싱 파열", 3)],
    ("기아", "K5 DL3", "가솔린"): [("안전벨트", "끝단 진흙/모래", 3), ("퓨즈박스/전장", "침수 진흙/모래", 3), ("엔진블록", "누유", 2), ("도어", "판금/도색 흔적", 3)],
    ("현대", "쏘나타 DN8", "LPG"): [("쿼터패널", "판금/도색 흔적", 4), ("휠하우스", "용접 흔적", 2), ("필러/사이드실", "교환 흔적", 2), ("서스펜션", "쇼바 누유", 3)],
    ("BMW", "520i", "디젤"): [("실린더헤드", "냉각수 혼입", 4), ("라디에이터/냉각계", "호스 균열", 3), ("엔진블록", "누유", 4), ("터보/인터쿨러", "오일 누유", 2)],
    ("제네시스", "G80", "가솔린"): [("바닥 매트/카펫 하단", "침수 진흙/모래", 2), ("조향장치", "파워스티어링 누유", 2), ("범퍼/라이트/유리", "파손/균열", 3)],
    ("기아", "쏘렌토 MQ4", "디젤"): [("배기계", "부식/구멍", 3), ("구동계(등속조인트)", "부츠 파손/그리스 누출", 4), ("하부 전반", "부식(녹)", 3)],
}
ANGLES = ["전체", "근접", "근접", "근접", "부품 라벨/번호"]


def _img(text: str, sub: str, seed: int) -> bytes:
    rnd = random.Random(seed)
    w, h = 960, 640
    base = [rnd.randint(40, 120) for _ in range(3)]
    im = Image.new("RGB", (w, h), tuple(base))
    d = ImageDraw.Draw(im)
    for y in range(0, h, 4):
        t = y / h
        d.line([(0, y), (w, y)], fill=tuple(int(c * (0.7 + 0.5 * t)) for c in base))
    for _ in range(40):
        x, y, r = rnd.randint(0, w), rnd.randint(0, h), rnd.randint(8, 70)
        shade = rnd.randint(-25, 25)
        d.ellipse([x - r, y - r, x + r, y + r], fill=tuple(max(0, min(255, c + shade)) for c in base))
    f1, f2 = imaging._font(46), imaging._font(28)
    d.rectangle([30, h - 140, w - 30, h - 30], fill=(0, 0, 0))
    d.text((50, h - 132), text, fill=(255, 255, 255), font=f1)
    d.text((50, h - 70), sub + "   [DEMO – 합성 이미지]", fill=(250, 204, 21), font=f2)
    out = io.BytesIO()
    im.save(out, "JPEG", quality=85)
    return out.getvalue()


def load_demo(a: Archive, n_vehicles: int = 24, seed: int = 7) -> int:
    rnd = random.Random(seed)
    cats = {(c["sub_part"], c["defect_type"]): c for c in a.categories(active_only=False)}
    keys = list(FLEET)
    made = 0
    for i in range(n_vehicles):
        mfr, model, fuel = keys[i % len(keys)]
        year = rnd.randint(2016, 2022)
        km = rnd.randint(18, 160) * 1000
        vid = a.create_vehicle(mfr, model, year, km, fuel=fuel, plate=f"{rnd.randint(10, 99)}가 {rnd.randint(1000, 9999)}", memo="[데모]")
        pool = FLEET[(mfr, model, fuel)]
        for j in range(rnd.randint(2, 4)):
            sub, dt, _ = rnd.choices(pool, weights=[p[2] for p in pool])[0]
            cat = cats.get((sub, dt))
            if not cat:
                continue
            sev = rnd.choices(["경미", "주의", "심각"], [4, 4, 2])[0]
            tag = [(cat["id"], sev, "")]
            if rnd.random() < 0.15:
                tag = []   # 분류 대기함 체험용
            data = _img(f"{sub} · {dt}", f"{mfr} {model} {year}", seed * 1000 + i * 10 + j)
            pid, new = a.add_photo(vid, data, f"demo_{i}_{j}.jpg", DEMO, f"[데모] {sub} {dt} 확인됨", rnd.choice(ANGLES), tag)
            if new and tag and rnd.random() < 0.5:
                a.add_box(pid, rnd.uniform(0.15, 0.5), rnd.uniform(0.1, 0.4), rnd.uniform(0.2, 0.3), rnd.uniform(0.2, 0.3), dt)
            made += new
    return made


def remove_demo(a: Archive) -> int:
    ids = [r["id"] for r in a.q("SELECT id FROM photos WHERE inspector=?", (DEMO,))]
    for i in ids:
        a.soft_delete(i)
        a.purge(i)
    for v in a.q("SELECT v.id FROM vehicles v WHERE v.memo='[데모]' AND NOT EXISTS(SELECT 1 FROM photos p WHERE p.vehicle_id=v.id)"):
        with a.conn() as c:
            c.execute("DELETE FROM vehicles WHERE id=?", (v["id"],))
    return len(ids)
