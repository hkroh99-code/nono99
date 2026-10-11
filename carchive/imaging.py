"""이미지 처리: 해시, EXIF 촬영일, 썸네일, 박스 그리기."""
from __future__ import annotations

import hashlib
import io
from datetime import datetime

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

THUMB_MAX = 480
VIEW_MAX = 1400
ALLOWED = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp", "MPO": ".jpg"}


class BadImage(ValueError):
    pass


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def inspect(data: bytes) -> dict:
    """이미지인지 확인하고 크기·확장자·EXIF 촬영일을 돌려준다."""
    try:
        im = Image.open(io.BytesIO(data))
        im.load()
    except Exception as e:  # noqa: BLE001
        raise BadImage(f"이미지를 읽을 수 없습니다: {e}") from e
    fmt = (im.format or "").upper()
    if fmt not in ALLOWED:
        raise BadImage(f"지원하지 않는 형식입니다({fmt or '알 수 없음'}). JPG/PNG/WEBP만 가능합니다. 아이폰 HEIC는 JPG로 바꿔 올려 주세요.")
    shot = None
    try:
        exif = im.getexif()
        raw = exif.get_ifd(0x8769).get(0x9003) or exif.get(0x0132)
        if raw:
            shot = datetime.strptime(str(raw)[:19], "%Y:%m:%d %H:%M:%S").isoformat(sep=" ")
    except Exception:  # noqa: BLE001
        shot = None
    return {"ext": ALLOWED[fmt], "width": im.width, "height": im.height, "shot_at": shot}


def make_thumb(data: bytes) -> bytes:
    im = Image.open(io.BytesIO(data))
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((THUMB_MAX, THUMB_MAX))
    out = io.BytesIO()
    im.save(out, "JPEG", quality=82)
    return out.getvalue()


def _font(size: int):
    for p in ("C:/Windows/Fonts/malgun.ttf", "/System/Library/Fonts/AppleSDGothicNeo.ttc",
              "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
              "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(p, size)
        except Exception:  # noqa: BLE001
            continue
    return ImageFont.load_default()


def render_with_boxes(path: str, boxes: list[dict], pending: dict | None = None) -> Image.Image:
    """원본에 결함 위치 네모(비율 좌표 0~1)를 그려 화면용으로 돌려준다. 원본 파일은 건드리지 않는다."""
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    im.thumbnail((VIEW_MAX, VIEW_MAX))
    d = ImageDraw.Draw(im)
    f = _font(max(14, im.width // 55))
    lw = max(2, im.width // 300)

    def draw(b, color):
        x0, y0 = b["x"] * im.width, b["y"] * im.height
        x1, y1 = x0 + b["w"] * im.width, y0 + b["h"] * im.height
        d.rectangle([x0, y0, x1, y1], outline=color, width=lw)
        if b.get("label"):
            tw = d.textlength(b["label"], font=f)
            d.rectangle([x0, y0 - f.size - 4, x0 + tw + 8, y0], fill=color)
            d.text((x0 + 4, y0 - f.size - 3), b["label"], fill="white", font=f)

    for b in boxes:
        draw(b, (220, 38, 38))
    if pending:
        draw(pending, (37, 99, 235))
    return im


def embed(thumb_bytes: bytes) -> bytes:
    """사진을 비교하기 위한 가벼운 특징값(색 분포 64 + 질감 8 + 밝기 격자 16 = 88개). 딥러닝이 아니라 ‘비슷하게 생긴 사진’ 찾기용."""
    im = Image.open(io.BytesIO(thumb_bytes)).convert("RGB").resize((96, 96))
    a = np.asarray(im, dtype=np.float32)
    q = (a // 64).astype(int)
    hist = np.bincount((q[..., 0] * 16 + q[..., 1] * 4 + q[..., 2]).ravel(), minlength=64).astype(np.float32)
    hist /= hist.sum()
    g = a.mean(axis=2)
    gx, gy = np.abs(np.diff(g, axis=1))[:-1], np.abs(np.diff(g, axis=0))[:, :-1]
    mag = np.hypot(gx, gy)
    tex = np.histogram(mag, bins=8, range=(0, 120))[0].astype(np.float32)
    tex /= max(1.0, tex.sum())
    grid = g.reshape(4, 24, 4, 24).mean(axis=(1, 3)).ravel() / 255.0
    v = np.concatenate([hist * 2.0, tex * 2.0, grid]).astype(np.float32)
    return v.tobytes()
