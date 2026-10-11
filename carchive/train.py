"""명령줄 학습:  python train.py [--extractor auto|torch|basic] [--data data]"""
import argparse

import ml
from db import Archive

ap = argparse.ArgumentParser()
ap.add_argument("--extractor", default="auto", choices=["auto", "torch", "basic"])
ap.add_argument("--data", default="data")
args = ap.parse_args()
a = Archive(args.data)
try:
    info = ml.train(a, args.extractor, progress=lambda f, t: print(f"\r{t}", end=""))
except (ml.NotEnoughData, ml.ExtractorUnavailable) as e:
    raise SystemExit(f"\n학습하지 못했습니다: {e}")
print(f"\n특징 추출기 {info['extractor']} · 사진 {info['n_photos']}장 · 차량 {info['n_vehicles']}대")
for m in info["metrics"]:
    p = "-" if m["precision"] is None else f"{m['precision']:.0%}"
    r = "-" if m["recall"] is None else f"{m['recall']:.0%}"
    print(f"  {'사용' if m['enabled'] else '보류'}  정밀도 {p:>4} 재현율 {r:>4}  {m['label']}  {m.get('note', '')}")
print("활성화된 모델:", ml.active_id(a) or "없음(검증 통과 항목이 없어 추천에 쓰지 않음)")
