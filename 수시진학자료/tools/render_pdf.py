"""HTML 안내자료를 A4 PDF로 변환하고 1페이지인지 확인한다.

사용법: python3 수시진학자료/tools/render_pdf.py  (저장소 루트에서 실행)
필요: pip install playwright pypdf, 한글 글꼴(Pretendard 또는 Noto Sans KR)
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright
from pypdf import PdfReader

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGETS = sorted(ROOT.glob("[0-9][0-9]_*/*_수시안내.html"))


def main() -> int:
    ok = True
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for html in TARGETS:
            pdf = html.with_suffix(".pdf")
            page.goto(html.as_uri())
            page.emulate_media(media="print")
            page.pdf(path=str(pdf), format="A4", print_background=True,
                     prefer_css_page_size=True)
            n = len(PdfReader(str(pdf)).pages)
            print(f"{pdf.relative_to(ROOT)}: {n} page(s)")
            ok &= n == 1
        browser.close()
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
