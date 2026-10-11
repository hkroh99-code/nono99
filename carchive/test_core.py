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


if __name__ == "__main__":
    unittest.main()
