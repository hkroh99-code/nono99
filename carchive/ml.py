"""전용 하자 분류 모델 학습·사용.

흐름: 태그된 사진 → 특징 추출(사전학습 CNN 또는 간이 특징) → 항목별 로지스틱 회귀(다중 라벨) → 차량 단위로 나눈 검증 → 정밀도가 충분한 항목만 추천에 사용.
  · 특징 추출기 'torch' : torchvision MobileNetV3(ImageNet 사전학습)로 사진의 모양·질감을 숫자 576개로 바꾼다. `pip install torch torchvision` 필요(첫 실행 때 가중치 다운로드, 인터넷 필요).
  · 특징 추출기 'basic' : 색·질감 히스토그램 88개. 설치 없이 되지만 약하다(‘색이 뚜렷이 다른 항목’ 정도만).
검증은 같은 차량의 사진이 학습·검증에 섞이지 않도록 ‘차량 단위’로 나눈다(섞이면 성능이 부풀려진다).
"""
from __future__ import annotations

import io
import json
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
from PIL import Image, ImageOps
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score
from sklearn.model_selection import GroupShuffleSplit
from sklearn.preprocessing import StandardScaler

import imaging
from db import Archive

MIN_PHOTOS = 8        # 한 항목을 학습하려면 최소 사진 수
MIN_VEHICLES = 3      # … 그리고 서로 다른 차량 수
MIN_PRECISION = 0.6   # 검증 정밀도가 이 이상인 항목만 추천에 사용
MIN_VAL_POS = 2       # 검증 세트에 양성이 최소 이만큼 있어야 신뢰


class ExtractorUnavailable(RuntimeError):
    pass


class NotEnoughData(RuntimeError):
    pass


# ───────────── 특징 추출기 ─────────────
class BasicExtractor:
    name = "basic"

    def __call__(self, images: list[Image.Image]) -> np.ndarray:
        out = []
        for im in images:
            b = io.BytesIO()
            im.convert("RGB").save(b, "JPEG", quality=90)
            out.append(np.frombuffer(imaging.embed(b.getvalue()), dtype=np.float32))
        return np.stack(out)


class TorchExtractor:
    name = "torch"

    def __init__(self):
        try:
            import torch
            import torchvision
            from torchvision.models import MobileNet_V3_Small_Weights, mobilenet_v3_small
        except ImportError as e:
            raise ExtractorUnavailable("torch/torchvision 이 설치되어 있지 않습니다. `pip install torch torchvision`") from e
        self.torch = torch
        try:
            w = MobileNet_V3_Small_Weights.DEFAULT
            net = mobilenet_v3_small(weights=w)
        except Exception as e:  # noqa: BLE001
            raise ExtractorUnavailable(f"사전학습 가중치를 받지 못했습니다(인터넷 필요): {e}") from e
        self.net = net.eval()
        self.tf = w.transforms()

    def __call__(self, images: list[Image.Image]) -> np.ndarray:
        torch = self.torch
        outs = []
        with torch.no_grad():
            for i in range(0, len(images), 32):
                x = torch.stack([self.tf(im.convert("RGB")) for im in images[i:i + 32]])
                f = self.net.avgpool(self.net.features(x)).flatten(1)
                outs.append(f.numpy().astype(np.float32))
        return np.concatenate(outs)


def get_extractor(name: str = "auto"):
    if name in ("auto", "torch"):
        try:
            return TorchExtractor()
        except ExtractorUnavailable:
            if name == "torch":
                raise
    return BasicExtractor()


def extractor_status() -> dict:
    try:
        import torch  # noqa: F401
        import torchvision  # noqa: F401
        return {"torch": True}
    except ImportError:
        return {"torch": False}


def _load_thumb(a: Archive, row) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(a.thumbs_dir / row["thumb_path"])).convert("RGB")


def ensure_features(a: Archive, ext, rows: list[dict], progress=None) -> dict[int, np.ndarray]:
    have = a.feats_get(ext.name, [r["id"] for r in rows])
    todo = [r for r in rows if r["id"] not in have and (a.thumbs_dir / r["thumb_path"]).exists()]
    for i in range(0, len(todo), 64):
        chunk = todo[i:i + 64]
        f = ext([_load_thumb(a, r) for r in chunk])
        a.feats_put(ext.name, {r["id"]: f[j].tobytes() for j, r in enumerate(chunk)})
        if progress:
            progress(min(1.0, (i + len(chunk)) / max(1, len(todo))), f"특징 추출 {min(i + 64, len(todo))}/{len(todo)}")
    have = a.feats_get(ext.name, [r["id"] for r in rows])
    return {pid: np.frombuffer(v, dtype=np.float32) for pid, v in have.items()}


# ───────────── 데이터 현황 ─────────────
def class_counts(a: Archive) -> list[dict]:
    rows = a.labeled_photos()
    by: dict[int, dict] = {}
    for r in rows:
        for c in r["cids"]:
            d = by.setdefault(c, {"photos": 0, "veh": set()})
            d["photos"] += 1
            d["veh"].add(r["vehicle_id"])
    cats = {c["id"]: c for c in a.categories(active_only=False)}
    out = [{"category_id": c, "label": cats[c]["label"], "photos": d["photos"], "vehicles": len(d["veh"]),
            "ok": d["photos"] >= MIN_PHOTOS and len(d["veh"]) >= MIN_VEHICLES} for c, d in by.items() if c in cats]
    return sorted(out, key=lambda x: -x["photos"])


# ───────────── 학습 ─────────────
def train(a: Archive, extractor: str = "auto", progress=None, seed: int = 0) -> dict:
    rows = a.labeled_photos()
    counts = {c["category_id"]: c for c in class_counts(a)}
    classes = [cid for cid, c in counts.items() if c["ok"]]
    if not classes:
        raise NotEnoughData(f"학습할 수 있는 항목이 없습니다. 항목마다 사진 {MIN_PHOTOS}장 이상, 서로 다른 차량 {MIN_VEHICLES}대 이상이 필요합니다.")
    ext = get_extractor(extractor)
    feats = ensure_features(a, ext, rows, progress)
    rows = [r for r in rows if r["id"] in feats]
    X = np.stack([feats[r["id"]] for r in rows])
    Y = np.array([[1 if c in r["cids"] else 0 for c in classes] for r in rows])
    groups = np.array([r["vehicle_id"] for r in rows])
    if len(set(groups)) < 4:
        raise NotEnoughData("서로 다른 차량이 4대 이상 있어야 검증을 할 수 있습니다.")

    if progress:
        progress(0.0, "검증 중…")
    tr, va = next(GroupShuffleSplit(1, test_size=0.3, random_state=seed).split(X, groups=groups))
    sc = StandardScaler().fit(X[tr])
    Xtr, Xva = sc.transform(X[tr]), sc.transform(X[va])
    metrics, enabled = [], {}
    for j, cid in enumerate(classes):
        m = {"category_id": cid, "label": counts[cid]["label"], "photos": counts[cid]["photos"], "vehicles": counts[cid]["vehicles"],
             "val_pos": int(Y[va, j].sum()), "precision": None, "recall": None, "ap": None, "enabled": False}
        ytr, yva = Y[tr, j], Y[va, j]
        if ytr.min() == ytr.max() or yva.sum() < MIN_VAL_POS or yva.sum() == len(yva):
            m["note"] = "검증용 양성 사진이 부족해 신뢰할 수 없음"
            metrics.append(m)
            continue
        lr = LogisticRegression(C=0.5, class_weight="balanced", max_iter=2000).fit(Xtr, ytr)
        p = lr.predict_proba(Xva)[:, 1]
        pred = p >= 0.5
        tp = int((pred & (yva == 1)).sum())
        m["precision"] = tp / pred.sum() if pred.sum() else 0.0
        m["recall"] = tp / yva.sum()
        m["ap"] = float(average_precision_score(yva, p))
        m["enabled"] = bool(m["precision"] >= MIN_PRECISION)
        if m["enabled"]:
            enabled[cid] = m["precision"]
        metrics.append(m)

    # 배포용 모델은 전체 데이터로 다시 학습
    sc_all = StandardScaler().fit(X)
    Xall = sc_all.transform(X)
    models = {}
    for j, cid in enumerate(classes):
        if cid in enabled and Y[:, j].min() != Y[:, j].max():
            models[cid] = LogisticRegression(C=0.5, class_weight="balanced", max_iter=2000).fit(Xall, Y[:, j])
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    info = {"id": stamp, "extractor": ext.name, "trained_at": datetime.now().isoformat(timespec="seconds"), "n_photos": len(rows),
            "n_vehicles": int(len(set(groups))), "metrics": metrics, "enabled": {str(k): v for k, v in enabled.items()}}
    joblib.dump({"info": info, "scaler": sc_all, "models": models}, a.model_dir / f"model_{stamp}.joblib")
    (a.model_dir / f"model_{stamp}.json").write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")
    if enabled:
        set_active(a, stamp)
    for old in sorted(a.model_dir.glob("model_*.joblib"))[:-6]:   # 최근 6개만 보관
        old.unlink(missing_ok=True)
        old.with_suffix(".json").unlink(missing_ok=True)
    return info


# ───────────── 모델 관리 / 추론 ─────────────
def list_models(a: Archive) -> list[dict]:
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted(a.model_dir.glob("model_*.json"), reverse=True)]


def active_id(a: Archive) -> str | None:
    f = a.model_dir / "active.json"
    if f.exists():
        i = json.loads(f.read_text()).get("id")
        if i and (a.model_dir / f"model_{i}.joblib").exists():
            return i
    return None


def set_active(a: Archive, model_id: str | None):
    f = a.model_dir / "active.json"
    f.write_text(json.dumps({"id": model_id}), encoding="utf-8")


_CACHE: dict = {}


def _load(a: Archive):
    i = active_id(a)
    if not i:
        return None
    key = (str(a.model_dir), i)
    if key not in _CACHE:
        _CACHE.clear()
        bundle = joblib.load(a.model_dir / f"model_{i}.joblib")
        try:
            bundle["ext"] = get_extractor(bundle["info"]["extractor"])
        except ExtractorUnavailable:
            bundle["ext"] = None
        _CACHE[key] = bundle
    return _CACHE[key]


def predict(a: Archive, pid: int, min_prob=0.3) -> dict[int, tuple[float, str]]:
    """활성 모델로 사진 1장의 후보. 검증을 통과한 항목만 돌려준다. {category_id: (점수, 근거)}"""
    b = _load(a)
    if not b or not b["ext"]:
        return {}
    p = a.q1("SELECT thumb_path FROM photos WHERE id=?", (pid,))
    if not p or not (a.thumbs_dir / p["thumb_path"]).exists():
        return {}
    x = b["ext"]([_load_thumb(a, p)])
    x = b["scaler"].transform(x)
    out = {}
    for cid, lr in b["models"].items():
        prob = float(lr.predict_proba(x)[0, 1])
        if prob >= min_prob:
            prec = b["info"]["enabled"].get(str(cid), MIN_PRECISION)
            out[cid] = (float(min(0.95, prob * prec)), f"모델 확률 {prob:.0%} · 검증 정밀도 {prec:.0%}")
    return out


def export_dataset(a: Archive, out_path: Path) -> int:
    """외부 도구(예: 클라우드 학습)에서 쓸 수 있게 사진과 라벨(labels.csv)을 zip 으로 내보낸다."""
    import csv
    import zipfile
    cats = {c["id"]: c["label"] for c in a.categories(active_only=False)}
    rows = a.labeled_photos()
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_STORED) as z:
        buf = io.StringIO()
        w = csv.writer(buf)
        w.writerow(["file", "vehicle_id", "labels"])
        for r in rows:
            name = f"images/{r['id']}{Path(r['file_path']).suffix}"
            fp = a.photos_dir / r["file_path"]
            if fp.exists():
                z.write(fp, name)
                w.writerow([name, r["vehicle_id"], "|".join(cats.get(c, str(c)) for c in r["cids"])])
        z.writestr("labels.csv", "﻿" + buf.getvalue())
    return len(rows)
