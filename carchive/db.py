"""SQLite 저장소. 사진 파일은 data/photos 폴더, 정보(차량·태그)는 data/carchive.db 에 저장한다."""
from __future__ import annotations

import sqlite3
import zipfile
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

import imaging
from taxonomy import DEFAULT_TAXONOMY, SEVERITIES

SCHEMA = """
CREATE TABLE IF NOT EXISTS vehicles(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  manufacturer TEXT NOT NULL, model_name TEXT NOT NULL,
  model_year INTEGER, mileage INTEGER, trim TEXT, fuel TEXT,
  plate TEXT, vin TEXT, memo TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')));
CREATE TABLE IF NOT EXISTS categories(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  main_part TEXT NOT NULL, sub_part TEXT NOT NULL, defect_type TEXT NOT NULL,
  is_flood INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1,
  UNIQUE(main_part, sub_part, defect_type));
CREATE TABLE IF NOT EXISTS photos(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
  file_path TEXT NOT NULL, thumb_path TEXT NOT NULL, sha256 TEXT NOT NULL UNIQUE,
  original_name TEXT, width INTEGER, height INTEGER, shot_at TEXT,
  angle TEXT, inspector TEXT, comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  deleted_at TEXT);
CREATE TABLE IF NOT EXISTS photo_defects(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  severity TEXT NOT NULL DEFAULT '주의', note TEXT,
  UNIQUE(photo_id, category_id));
CREATE TABLE IF NOT EXISTS boxes(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  x REAL NOT NULL, y REAL NOT NULL, w REAL NOT NULL, h REAL NOT NULL, label TEXT);
CREATE INDEX IF NOT EXISTS ix_photos_vehicle ON photos(vehicle_id);
CREATE INDEX IF NOT EXISTS ix_pd_photo ON photo_defects(photo_id);
CREATE INDEX IF NOT EXISTS ix_pd_cat ON photo_defects(category_id);
CREATE INDEX IF NOT EXISTS ix_boxes_photo ON boxes(photo_id);
"""

NORMAL = "비교용(정상)"      # 하자 없는 정상 사진 표시. 분류 대기함에서 빠진다.
SEV_RANK = {s: i + 1 for i, s in enumerate(SEVERITIES)}


def cat_label(r) -> str:
    return f"{r['main_part']} › {r['sub_part']} › {r['defect_type']}"


class Archive:
    def __init__(self, root: str | Path = "data"):
        self.root = Path(root)
        self.photos_dir = self.root / "photos"
        self.thumbs_dir = self.root / "thumbs"
        self.backup_dir = self.root / "backups"
        for d in (self.photos_dir, self.thumbs_dir, self.backup_dir):
            d.mkdir(parents=True, exist_ok=True)
        self.db_path = self.root / "carchive.db"
        with self.conn() as c:
            c.executescript(SCHEMA)
            if c.execute("SELECT COUNT(*) FROM categories").fetchone()[0] == 0:
                for main, sub, items in DEFAULT_TAXONOMY:
                    for dt, fl in items:
                        c.execute("INSERT OR IGNORE INTO categories(main_part,sub_part,defect_type,is_flood) VALUES(?,?,?,?)",
                                  (main, sub, dt, fl))

    # ---------- 연결 ----------
    @contextmanager
    def conn(self):
        c = sqlite3.connect(self.db_path, timeout=30)
        c.row_factory = sqlite3.Row
        c.execute("PRAGMA foreign_keys=ON")
        try:
            yield c
            c.commit()
        except Exception:
            c.rollback()
            raise
        finally:
            c.close()

    def q(self, sql: str, args=()) -> list[dict]:
        with self.conn() as c:
            return [dict(r) for r in c.execute(sql, args).fetchall()]

    def q1(self, sql: str, args=()):
        rows = self.q(sql, args)
        return rows[0] if rows else None

    # ---------- 분류체계 ----------
    def categories(self, active_only=True) -> list[dict]:
        sql = "SELECT * FROM categories" + (" WHERE is_active=1" if active_only else "")
        rows = self.q(sql + " ORDER BY main_part, sub_part, defect_type")
        for r in rows:
            r["label"] = cat_label(r)
        return rows

    def category_usage(self) -> dict[int, int]:
        return {r["category_id"]: r["n"] for r in self.q(
            "SELECT category_id, COUNT(*) n FROM photo_defects pd JOIN photos p ON p.id=pd.photo_id "
            "WHERE p.deleted_at IS NULL GROUP BY category_id")}

    def add_category(self, main, sub, dtype, is_flood=0) -> int:
        with self.conn() as c:
            cur = c.execute("INSERT INTO categories(main_part,sub_part,defect_type,is_flood) VALUES(?,?,?,?)",
                            (main.strip(), sub.strip(), dtype.strip(), int(is_flood)))
            return cur.lastrowid

    def update_category(self, cid, main, sub, dtype, is_flood, is_active):
        with self.conn() as c:
            c.execute("UPDATE categories SET main_part=?,sub_part=?,defect_type=?,is_flood=?,is_active=? WHERE id=?",
                      (main.strip(), sub.strip(), dtype.strip(), int(is_flood), int(is_active), cid))

    # ---------- 차량 ----------
    def create_vehicle(self, manufacturer, model_name, model_year=None, mileage=None, trim="", fuel="",
                       plate="", vin="", memo="") -> int:
        if not manufacturer.strip() or not model_name.strip():
            raise ValueError("제조사와 차종은 꼭 입력해야 합니다.")
        with self.conn() as c:
            cur = c.execute(
                "INSERT INTO vehicles(manufacturer,model_name,model_year,mileage,trim,fuel,plate,vin,memo) VALUES(?,?,?,?,?,?,?,?,?)",
                (manufacturer.strip(), model_name.strip(), model_year or None, mileage or None,
                 trim.strip(), fuel.strip(), plate.strip(), vin.strip(), memo.strip()))
            return cur.lastrowid

    def update_vehicle(self, vid, **f):
        cols = {"manufacturer", "model_name", "model_year", "mileage", "trim", "fuel", "plate", "vin", "memo"}
        f = {k: v for k, v in f.items() if k in cols}
        if not f:
            return
        with self.conn() as c:
            c.execute(f"UPDATE vehicles SET {','.join(k + '=?' for k in f)} WHERE id=?", (*f.values(), vid))

    def vehicle(self, vid):
        return self.q1("SELECT * FROM vehicles WHERE id=?", (vid,))

    def vehicles(self, text="") -> list[dict]:
        sql = ("SELECT v.*, (SELECT COUNT(*) FROM photos p WHERE p.vehicle_id=v.id AND p.deleted_at IS NULL) n_photos "
               "FROM vehicles v")
        args = []
        if text.strip():
            like = f"%{text.strip()}%"
            sql += " WHERE manufacturer LIKE ? OR model_name LIKE ? OR plate LIKE ? OR vin LIKE ? OR trim LIKE ?"
            args = [like] * 5
        return self.q(sql + " ORDER BY v.id DESC", args)

    @staticmethod
    def vehicle_label(v) -> str:
        bits = [f"{v['manufacturer']} {v['model_name']}"]
        if v.get("model_year"):
            bits.append(f"{v['model_year']}년식")
        if v.get("mileage"):
            bits.append(f"{v['mileage']:,}km")
        if v.get("plate"):
            bits.append(v["plate"])
        return " · ".join(bits) + f"  (#{v['id']})"

    # ---------- 사진 ----------
    def add_photo(self, vehicle_id: int, data: bytes, original_name="", inspector="", comment="", angle="",
                  defects: list[tuple[int, str, str]] | None = None) -> tuple[int, bool]:
        """사진을 저장한다. 같은 파일(해시 동일)이 이미 있으면 새로 저장하지 않고 (기존 id, False)를 돌려준다."""
        h = imaging.sha256(data)
        dup = self.q1("SELECT id, deleted_at FROM photos WHERE sha256=?", (h,))
        if dup:
            return dup["id"], False
        info = imaging.inspect(data)
        now = datetime.now()
        rel = Path(f"{now:%Y}") / f"{now:%m}"
        (self.photos_dir / rel).mkdir(parents=True, exist_ok=True)
        (self.thumbs_dir / rel).mkdir(parents=True, exist_ok=True)
        fpath = rel / f"{h[:20]}{info['ext']}"
        tpath = rel / f"{h[:20]}.jpg"
        (self.photos_dir / fpath).write_bytes(data)
        (self.thumbs_dir / tpath).write_bytes(imaging.make_thumb(data))
        with self.conn() as c:
            cur = c.execute(
                "INSERT INTO photos(vehicle_id,file_path,thumb_path,sha256,original_name,width,height,shot_at,angle,inspector,comment)"
                " VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                (vehicle_id, fpath.as_posix(), tpath.as_posix(), h, original_name, info["width"], info["height"],
                 info["shot_at"], angle, inspector.strip(), comment.strip()))
            pid = cur.lastrowid
            for cid, sev, note in defects or []:
                c.execute("INSERT OR REPLACE INTO photo_defects(photo_id,category_id,severity,note) VALUES(?,?,?,?)",
                          (pid, cid, sev, note))
        return pid, True

    def abs_file(self, p) -> Path:
        return self.photos_dir / p["file_path"]

    def abs_thumb(self, p) -> Path:
        return self.thumbs_dir / p["thumb_path"]

    def photo(self, pid):
        p = self.q1("SELECT p.*, v.manufacturer, v.model_name, v.model_year, v.mileage, v.plate, v.trim "
                    "FROM photos p JOIN vehicles v ON v.id=p.vehicle_id WHERE p.id=?", (pid,))
        if p:
            p["defects"] = self.photo_defects(pid)
        return p

    def photo_defects(self, pid) -> list[dict]:
        rows = self.q("SELECT pd.id, pd.category_id, pd.severity, pd.note, c.main_part, c.sub_part, c.defect_type, c.is_flood "
                      "FROM photo_defects pd JOIN categories c ON c.id=pd.category_id WHERE pd.photo_id=? ORDER BY pd.id", (pid,))
        for r in rows:
            r["label"] = cat_label(r)
        return rows

    def set_photo_defects(self, pid, defects: list[tuple[int, str, str]]):
        with self.conn() as c:
            c.execute("DELETE FROM photo_defects WHERE photo_id=?", (pid,))
            for cid, sev, note in defects:
                c.execute("INSERT OR REPLACE INTO photo_defects(photo_id,category_id,severity,note) VALUES(?,?,?,?)",
                          (pid, cid, sev, note or ""))

    def update_photo(self, pid, **f):
        cols = {"vehicle_id", "angle", "inspector", "comment"}
        f = {k: v for k, v in f.items() if k in cols}
        if f:
            with self.conn() as c:
                c.execute(f"UPDATE photos SET {','.join(k + '=?' for k in f)} WHERE id=?", (*f.values(), pid))

    def soft_delete(self, pid):
        with self.conn() as c:
            c.execute("UPDATE photos SET deleted_at=datetime('now','localtime') WHERE id=?", (pid,))

    def restore(self, pid):
        with self.conn() as c:
            c.execute("UPDATE photos SET deleted_at=NULL WHERE id=?", (pid,))

    def purge(self, pid):
        """휴지통에서 영구 삭제(파일 포함)."""
        p = self.q1("SELECT * FROM photos WHERE id=? AND deleted_at IS NOT NULL", (pid,))
        if not p:
            return
        for f in (self.abs_file(p), self.abs_thumb(p)):
            f.unlink(missing_ok=True)
        with self.conn() as c:
            c.execute("DELETE FROM photos WHERE id=?", (pid,))

    def trash(self) -> list[dict]:
        return self.q("SELECT p.*, v.manufacturer, v.model_name FROM photos p JOIN vehicles v ON v.id=p.vehicle_id "
                      "WHERE p.deleted_at IS NOT NULL ORDER BY p.deleted_at DESC")

    # ---------- 위치 박스 ----------
    def boxes(self, pid) -> list[dict]:
        return self.q("SELECT * FROM boxes WHERE photo_id=? ORDER BY id", (pid,))

    def add_box(self, pid, x, y, w, h, label=""):
        with self.conn() as c:
            c.execute("INSERT INTO boxes(photo_id,x,y,w,h,label) VALUES(?,?,?,?,?,?)", (pid, x, y, w, h, label))

    def delete_box(self, bid):
        with self.conn() as c:
            c.execute("DELETE FROM boxes WHERE id=?", (bid,))

    # ---------- 검색 ----------
    def _where(self, f: dict):
        where, args = ["p.deleted_at IS NULL"], []

        def isin(col, key):
            vals = f.get(key)
            if vals:
                where.append(f"{col} IN ({','.join('?' * len(vals))})")
                args.extend(vals)

        isin("v.manufacturer", "manufacturers")
        isin("v.model_name", "models")
        if f.get("year_min"):
            where.append("v.model_year>=?"); args.append(f["year_min"])
        if f.get("year_max"):
            where.append("v.model_year<=?"); args.append(f["year_max"])
        if f.get("mileage_max"):
            where.append("v.mileage<=?"); args.append(f["mileage_max"])
        isin("p.inspector", "inspectors")
        isin("p.angle", "angles")
        if f.get("date_from"):
            where.append("date(p.created_at)>=date(?)"); args.append(str(f["date_from"]))
        if f.get("date_to"):
            where.append("date(p.created_at)<=date(?)"); args.append(str(f["date_to"]))
        if f.get("text"):
            like = f"%{f['text'].strip()}%"
            where.append("(p.comment LIKE ? OR p.original_name LIKE ? OR v.plate LIKE ? OR v.vin LIKE ? OR v.model_name LIKE ? "
                         "OR EXISTS(SELECT 1 FROM photo_defects x WHERE x.photo_id=p.id AND x.note LIKE ?))")
            args.extend([like] * 6)
        if f.get("untagged"):
            where.append(f"NOT EXISTS(SELECT 1 FROM photo_defects x WHERE x.photo_id=p.id) AND COALESCE(p.angle,'')<>'{NORMAL}'")
        sub, sargs = [], []
        for key, col in (("main_parts", "c.main_part"), ("sub_parts", "c.sub_part"),
                         ("defect_types", "c.defect_type"), ("severities", "pd.severity")):
            vals = f.get(key)
            if vals:
                sub.append(f"{col} IN ({','.join('?' * len(vals))})")
                sargs.extend(vals)
        if f.get("category_ids"):
            ids = f["category_ids"]
            sub.append(f"pd.category_id IN ({','.join('?' * len(ids))})")
            sargs.extend(ids)
        if f.get("flood_only"):
            sub.append("c.is_flood=1")
        if sub:   # 같은 태그가 모든 조건을 동시에 만족해야 한다
            where.append("EXISTS(SELECT 1 FROM photo_defects pd JOIN categories c ON c.id=pd.category_id "
                         f"WHERE pd.photo_id=p.id AND {' AND '.join(sub)})")
            args.extend(sargs)
        return " AND ".join(where), args

    def search_photos(self, f: dict, limit=40, offset=0, order="최신순") -> tuple[list[dict], int]:
        w, a = self._where(f)
        base = "FROM photos p JOIN vehicles v ON v.id=p.vehicle_id WHERE " + w
        total = self.q1("SELECT COUNT(*) n " + base, a)["n"]
        orders = {"최신순": "p.id DESC", "오래된순": "p.id ASC", "차종순": "v.manufacturer, v.model_name, v.model_year DESC, p.id DESC",
                  "촬영일순": "COALESCE(p.shot_at, p.created_at) DESC"}
        rows = self.q("SELECT p.*, v.manufacturer, v.model_name, v.model_year, v.mileage, v.plate " + base +
                      f" ORDER BY {orders.get(order, 'p.id DESC')} LIMIT ? OFFSET ?", (*a, limit, offset))
        self._attach_defects(rows)
        return rows, total

    def _attach_defects(self, rows):
        if not rows:
            return
        ids = [r["id"] for r in rows]
        by = {i: [] for i in ids}
        for d in self.q("SELECT pd.photo_id, pd.severity, c.main_part, c.sub_part, c.defect_type, c.is_flood "
                        f"FROM photo_defects pd JOIN categories c ON c.id=pd.category_id WHERE pd.photo_id IN ({','.join('?' * len(ids))})", ids):
            by[d["photo_id"]].append(d)
        for r in rows:
            r["defects"] = by[r["id"]]

    def untagged_ids(self, limit=500) -> list[int]:
        return [r["id"] for r in self.q(
            "SELECT p.id FROM photos p WHERE p.deleted_at IS NULL AND NOT EXISTS(SELECT 1 FROM photo_defects x WHERE x.photo_id=p.id) "
            f"AND COALESCE(p.angle,'')<>'{NORMAL}' ORDER BY p.id LIMIT ?", (limit,))]

    def distinct(self, col: str, table="v") -> list[str]:
        assert col in {"manufacturer", "model_name", "inspector", "angle", "fuel"}
        t = "vehicles v" if table == "v" else "photos p"
        r = self.q(f"SELECT DISTINCT {col} x FROM {t} WHERE {col} IS NOT NULL AND {col}<>'' ORDER BY {col}")
        return [i["x"] for i in r]

    def models_of(self, manufacturers: list[str] | None = None) -> list[str]:
        if manufacturers:
            return [r["m"] for r in self.q(
                f"SELECT DISTINCT model_name m FROM vehicles WHERE manufacturer IN ({','.join('?' * len(manufacturers))}) ORDER BY m", manufacturers)]
        return self.distinct("model_name")

    # ---------- 통계 ----------
    def totals(self) -> dict:
        return {
            "photos": self.q1("SELECT COUNT(*) n FROM photos WHERE deleted_at IS NULL")["n"],
            "vehicles": self.q1("SELECT COUNT(DISTINCT vehicle_id) n FROM photos WHERE deleted_at IS NULL")["n"],
            "tags": self.q1("SELECT COUNT(*) n FROM photo_defects pd JOIN photos p ON p.id=pd.photo_id WHERE p.deleted_at IS NULL")["n"],
            "untagged": self.q1("SELECT COUNT(*) n FROM photos p WHERE p.deleted_at IS NULL AND NOT EXISTS(SELECT 1 FROM photo_defects x WHERE x.photo_id=p.id) AND COALESCE(p.angle,'')<>'비교용(정상)'")["n"],
            "week": self.q1("SELECT COUNT(*) n FROM photos WHERE deleted_at IS NULL AND created_at>=datetime('now','localtime','-7 days')")["n"],
            "flood": self.q1("SELECT COUNT(DISTINCT pd.photo_id) n FROM photo_defects pd JOIN categories c ON c.id=pd.category_id "
                             "JOIN photos p ON p.id=pd.photo_id WHERE c.is_flood=1 AND p.deleted_at IS NULL")["n"],
        }

    def top_defects(self, days: int | None = None, limit=10) -> list[dict]:
        extra = f" AND p.created_at>=datetime('now','localtime','-{int(days)} days')" if days else ""
        return self.q("SELECT c.main_part||' › '||c.sub_part||' › '||c.defect_type AS label, COUNT(*) n FROM photo_defects pd "
                      "JOIN categories c ON c.id=pd.category_id JOIN photos p ON p.id=pd.photo_id WHERE p.deleted_at IS NULL" + extra +
                      " GROUP BY c.id ORDER BY n DESC LIMIT ?", (limit,))

    def by_main_part(self) -> list[dict]:
        return self.q("SELECT c.main_part AS label, COUNT(*) n FROM photo_defects pd JOIN categories c ON c.id=pd.category_id "
                      "JOIN photos p ON p.id=pd.photo_id WHERE p.deleted_at IS NULL GROUP BY c.main_part ORDER BY n DESC")

    def by_model(self, limit=15) -> list[dict]:
        return self.q("SELECT v.manufacturer||' '||v.model_name AS label, COUNT(DISTINCT p.id) n FROM photos p "
                      "JOIN vehicles v ON v.id=p.vehicle_id WHERE p.deleted_at IS NULL GROUP BY label ORDER BY n DESC LIMIT ?", (limit,))

    def model_report(self, manufacturer: str, model_name: str, year_min=None, year_max=None) -> tuple[list[dict], int]:
        """한 차종에서 어떤 하자가 얼마나 많은 차량에서 나왔는지. 반환: (행 목록, 사진이 있는 해당 차종 차량 수)"""
        w, a = ["p.deleted_at IS NULL", "v.manufacturer=?", "v.model_name=?"], [manufacturer, model_name]
        if year_min:
            w.append("v.model_year>=?"); a.append(year_min)
        if year_max:
            w.append("v.model_year<=?"); a.append(year_max)
        W = " AND ".join(w)
        n_veh = self.q1(f"SELECT COUNT(DISTINCT v.id) n FROM photos p JOIN vehicles v ON v.id=p.vehicle_id WHERE {W}", a)["n"]
        rows = self.q(
            "SELECT c.id category_id, c.main_part, c.sub_part, c.defect_type, c.is_flood, COUNT(DISTINCT p.id) photos, "
            "COUNT(DISTINCT v.id) vehicles, AVG(CASE pd.severity WHEN '경미' THEN 1 WHEN '주의' THEN 2 ELSE 3 END) sev, "
            "SUM(pd.severity='심각') n_severe, MIN(v.mileage) km_min, AVG(v.mileage) km_avg "
            "FROM photo_defects pd JOIN categories c ON c.id=pd.category_id JOIN photos p ON p.id=pd.photo_id "
            f"JOIN vehicles v ON v.id=p.vehicle_id WHERE {W} GROUP BY c.id ORDER BY vehicles DESC, photos DESC", a)
        for r in rows:
            r["rate"] = r["vehicles"] / n_veh if n_veh else 0
        return rows, n_veh

    def model_matrix(self, min_vehicles=1) -> list[dict]:
        """차종 × 대분류 별 하자가 확인된 차량 수(히트맵용)."""
        return self.q("SELECT v.manufacturer||' '||v.model_name AS model, c.main_part AS part, COUNT(DISTINCT v.id) n "
                      "FROM photo_defects pd JOIN categories c ON c.id=pd.category_id JOIN photos p ON p.id=pd.photo_id "
                      "JOIN vehicles v ON v.id=p.vehicle_id WHERE p.deleted_at IS NULL GROUP BY model, part")

    def photos_for_category(self, category_id, manufacturer=None, model_name=None, limit=4) -> list[dict]:
        w, a = ["p.deleted_at IS NULL", "pd.category_id=?"], [category_id]
        if manufacturer:
            w.append("v.manufacturer=?"); a.append(manufacturer)
        if model_name:
            w.append("v.model_name=?"); a.append(model_name)
        rows = self.q("SELECT p.*, v.manufacturer, v.model_name, v.model_year, pd.severity FROM photo_defects pd "
                      "JOIN photos p ON p.id=pd.photo_id JOIN vehicles v ON v.id=p.vehicle_id WHERE " + " AND ".join(w) +
                      " ORDER BY CASE pd.severity WHEN '심각' THEN 0 WHEN '주의' THEN 1 ELSE 2 END, p.id DESC LIMIT ?", (*a, limit))
        return rows

    def similar_cases(self, pid, limit=6) -> list[dict]:
        """같은 하자 태그를 가진 다른 차량의 사진(같은 차종 우선)."""
        return self.q(
            "SELECT p.*, v.manufacturer, v.model_name, v.model_year, COUNT(*) shared, "
            "(v.model_name=(SELECT v2.model_name FROM photos p2 JOIN vehicles v2 ON v2.id=p2.vehicle_id WHERE p2.id=?)) same_model "
            "FROM photo_defects pd JOIN photos p ON p.id=pd.photo_id JOIN vehicles v ON v.id=p.vehicle_id "
            "WHERE p.deleted_at IS NULL AND p.id<>? AND p.vehicle_id<>(SELECT vehicle_id FROM photos WHERE id=?) "
            "AND pd.category_id IN (SELECT category_id FROM photo_defects WHERE photo_id=?) "
            "GROUP BY p.id ORDER BY same_model DESC, shared DESC, p.id DESC LIMIT ?", (pid, pid, pid, pid, limit))

    def uploads_by_day(self, days=30) -> list[dict]:
        return self.q("SELECT date(created_at) day, COUNT(*) n FROM photos WHERE deleted_at IS NULL "
                      "AND created_at>=datetime('now','localtime',?) GROUP BY day ORDER BY day", (f"-{int(days)} days",))

    # ---------- 내보내기 / 백업 ----------
    def export_rows(self) -> list[dict]:
        """사진 한 장 × 하자 태그 한 개 = 한 행. 태그가 없는 사진도 한 행으로 포함."""
        return self.q(
            "SELECT p.id AS 사진ID, p.created_at AS 등록일시, p.shot_at AS 촬영일시, v.id AS 차량ID, v.manufacturer AS 제조사, "
            "v.model_name AS 차종, v.trim AS 트림, v.model_year AS 연식, v.mileage AS 주행거리, v.fuel AS 연료, v.plate AS 차량번호, "
            "p.angle AS 촬영구분, c.main_part AS 대분류, c.sub_part AS 중분류, c.defect_type AS 하자유형, "
            "CASE c.is_flood WHEN 1 THEN '침수관련' ELSE '' END AS 침수여부, pd.severity AS 심각도, pd.note AS 태그메모, "
            "p.inspector AS 점검자, p.comment AS 코멘트, p.file_path AS 파일경로, p.original_name AS 원본파일명 "
            "FROM photos p JOIN vehicles v ON v.id=p.vehicle_id LEFT JOIN photo_defects pd ON pd.photo_id=p.id "
            "LEFT JOIN categories c ON c.id=pd.category_id WHERE p.deleted_at IS NULL ORDER BY p.id, pd.id")

    def backup(self) -> Path:
        """DB + 사진 전체를 zip 한 파일로 묶는다(data/backups/)."""
        out = self.backup_dir / f"carchive_backup_{datetime.now():%Y%m%d_%H%M%S}.zip"
        snap = self.root / "_snapshot.db"
        with self.conn() as c:
            dst = sqlite3.connect(snap)
            c.backup(dst)
            dst.close()
        with zipfile.ZipFile(out, "w", zipfile.ZIP_STORED) as z:
            z.write(snap, "carchive.db")
            for folder, name in ((self.photos_dir, "photos"), (self.thumbs_dir, "thumbs")):
                for f in folder.rglob("*"):
                    if f.is_file():
                        z.write(f, f"{name}/{f.relative_to(folder).as_posix()}")
        snap.unlink(missing_ok=True)
        return out

    def storage_mb(self) -> float:
        return sum(f.stat().st_size for f in self.root.rglob("*") if f.is_file() and f.parent != self.backup_dir) / 1e6
