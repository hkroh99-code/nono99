"""python3 -m unittest test_core -v   (데이터 계층 점검)"""
import io, tempfile, unittest, zipfile
from PIL import Image
from db import Archive
from imaging import BadImage


def jpg(color):
    b = io.BytesIO(); Image.new("RGB", (320, 240), color).save(b, "JPEG"); return b.getvalue()


class Core(unittest.TestCase):
    def setUp(self):
        self.a = Archive(tempfile.mkdtemp())
        self.c = {c["defect_type"] + c["sub_part"]: c["id"] for c in self.a.categories()}
        self.v = self.a.create_vehicle("현대", "그랜저 IG", 2019, 80000)

    def test_duplicate(self):
        p1, n1 = self.a.add_photo(self.v, jpg((1, 2, 3)))
        p2, n2 = self.a.add_photo(self.v, jpg((1, 2, 3)))
        self.assertTrue(n1); self.assertFalse(n2); self.assertEqual(p1, p2)

    def test_bad_file(self):
        with self.assertRaises(BadImage):
            self.a.add_photo(self.v, b"not an image")

    def test_search_and_untagged(self):
        cid = self.c["부식(녹)프레임/서브프레임"]
        self.a.add_photo(self.v, jpg((9, 9, 9)), defects=[(cid, "심각", "")])
        q, _ = self.a.add_photo(self.v, jpg((8, 8, 8)))
        self.assertEqual(self.a.search_photos({"category_ids": [cid], "severities": ["심각"]})[1], 1)
        self.assertEqual(self.a.search_photos({"category_ids": [cid], "severities": ["경미"]})[1], 0)
        self.assertEqual(self.a.untagged_ids(), [q])
        self.a.update_photo(q, angle="비교용(정상)")
        self.assertEqual(self.a.untagged_ids(), [])

    def test_report_and_trash(self):
        cid = self.c["침수 진흙/모래퓨즈박스/전장"]
        p, _ = self.a.add_photo(self.v, jpg((5, 5, 5)), defects=[(cid, "주의", "")])
        v2 = self.a.create_vehicle("현대", "그랜저 IG", 2020, 50000)
        self.a.add_photo(v2, jpg((6, 6, 6)))
        rows, n = self.a.model_report("현대", "그랜저 IG")
        self.assertEqual(n, 2); self.assertAlmostEqual(rows[0]["rate"], 0.5)
        self.assertEqual(self.a.totals()["flood"], 1)
        self.a.soft_delete(p); self.assertEqual(self.a.totals()["photos"], 1)
        self.a.restore(p); self.assertEqual(self.a.totals()["photos"], 2)
        self.a.soft_delete(p); self.a.purge(p); self.assertEqual(self.a.trash(), [])

    def test_backup(self):
        self.a.add_photo(self.v, jpg((7, 7, 7)))
        names = zipfile.ZipFile(self.a.backup()).namelist()
        self.assertIn("carchive.db", names); self.assertTrue(any(n.startswith("photos/") for n in names))


class Smart(unittest.TestCase):
    def setUp(self):
        import suggest
        self.suggest = suggest
        self.a = Archive(tempfile.mkdtemp())
        self.cid = {(c["sub_part"], c["defect_type"]): c["id"] for c in self.a.categories()}

    def test_keyword(self):
        r = self.suggest.keyword_scores("안전벨트 끝단 진흙 확인", self.a.categories())
        self.assertGreaterEqual(r[self.cid[("안전벨트", "끝단 진흙/모래")]][0], 0.9)
        self.assertEqual(self.suggest.keyword_scores("", self.a.categories()), {})

    def test_prior_and_log(self):
        key = self.cid[("프레임/서브프레임", "부식(녹)")]
        for i in range(3):
            v = self.a.create_vehicle("현대", "그랜저 IG", 2019, 1000)
            self.a.add_photo(v, jpg((i, 20, 30)), defects=[(key, "주의", "")])
        v = self.a.create_vehicle("현대", "그랜저 IG", 2020, 1000)
        pid, _ = self.a.add_photo(v, jpg((200, 10, 10)))
        s = self.suggest.suggest(self.a, pid)
        self.assertEqual(s[0].category["id"], key)
        self.a.resolve_suggestions(pid, {key})
        st = {x["source"]: x for x in self.a.suggestion_stats()}
        self.assertEqual(st["prior"]["accepted"], 1)

    def test_ai_parse(self):
        out = self.suggest._parse_ai('앞말 {"candidates":[{"id":5,"confidence":2},{"id":999,"confidence":0.9},{"x":1}]} 뒷말', {5})
        self.assertEqual(out, [{"id": 5, "confidence": 1.0, "reason": ""}])
        self.assertEqual(self.suggest._parse_ai("json 없음", {5}), [])


class Pdf(unittest.TestCase):
    def test_report_and_coverage(self):
        import report
        a = Archive(tempfile.mkdtemp())
        cid = {(c["sub_part"], c["defect_type"]): c["id"] for c in a.categories()}
        v = a.create_vehicle("기아", "K5", 2021, 50000)
        a.add_photo(v, jpg((1, 1, 1)), defects=[(cid[("퓨즈박스/전장", "침수 진흙/모래")], "심각", "")], inspector="홍")
        a.add_photo(v, jpg((2, 2, 2)), area="도어")
        cov = {c["area"]: c["state"] for c in a.vehicle_coverage(v, ["퓨즈박스/전장", "도어", "타이어"])}
        self.assertEqual(cov, {"퓨즈박스/전장": "하자 있음", "도어": "정상 확인", "타이어": "미촬영"})
        data, no = report.build_report(a, v, inspector="홍", summary="테스트")
        self.assertTrue(data.startswith(b"%PDF")); self.assertIn("CC-", no)
        self.assertIn("침수", report.flood_opinion(a.vehicle_photos(v))[0])


class Learn(unittest.TestCase):
    def test_train_predict(self):
        import random, ml
        a = Archive(tempfile.mkdtemp())
        cats = a.categories()
        cls = [cats[0], cats[10]]
        cols = [(220, 30, 30), (30, 30, 220)]
        rnd = random.Random(3)
        def im(col):
            b = io.BytesIO()
            Image.new("RGB", (200, 150), tuple(max(0, min(255, c + rnd.randint(-40, 40))) for c in col)).save(b, "JPEG")
            return b.getvalue()
        with self.assertRaises(ml.NotEnoughData):
            ml.train(a, "basic")
        for v in range(8):
            vid = a.create_vehicle("현대", "X", 2020, 1)
            for c, col in zip(cls, cols):
                for _ in range(2):
                    a.add_photo(vid, im(col), defects=[(c["id"], "주의", "")])
        info = ml.train(a, "basic")
        self.assertTrue(all(m["enabled"] for m in info["metrics"]))
        self.assertEqual(ml.active_id(a), info["id"])
        vid = a.create_vehicle("현대", "X", 2021, 1)
        pid, _ = a.add_photo(vid, im(cols[1]))
        pred = ml.predict(a, pid)
        self.assertEqual(max(pred, key=lambda k: pred[k][0]), cls[1]["id"])
        ml.set_active(a, None)
        self.assertEqual(ml.predict(a, pid), {})


if __name__ == "__main__":
    unittest.main()
