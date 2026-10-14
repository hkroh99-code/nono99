#!/usr/bin/env python3
"""과학축전·시연실험 자료 수집기 (한국·일본).

표준 라이브러리만 사용합니다. 세 단계로 나뉩니다.

  python collect.py cinii  --query "科学の祭典"          # CiNii Research 검색 → links.csv
  python collect.py crawl  --sites data/sites.csv         # 사이트 안의 파일 링크 수집 → links.csv
  python collect.py download --links links.csv data/seed_links.csv   # 내려받기 → downloads/, index.csv

공통 원칙: robots.txt 준수, 요청 간격(--delay), 이미 받은 파일은 건너뛰기.
"""
import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import urllib.robotparser
from collections import deque
from html.parser import HTMLParser

USER_AGENT = "ScienceFestivalCollector/1.0 (educational use)"
FILE_EXTS = (".pdf", ".ppt", ".pptx", ".hwp", ".hwpx", ".doc", ".docx")
LINK_FIELDS = ["country", "event", "year", "title", "page_url", "file_url"]
INDEX_FIELDS = LINK_FIELDS + ["path", "bytes", "sha256", "status"]


# ---------------------------------------------------------------- HTTP

def iri_to_uri(url):
    """한글·일본어가 섞인 주소를 퍼센트 인코딩한다 (이미 인코딩된 %XX는 유지)."""
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((
        p.scheme, p.netloc.encode("idna").decode("ascii"),
        urllib.parse.quote(p.path, safe="/%:@!$&'()*+,;=-._~"),
        urllib.parse.quote(p.query, safe="/%:@!$&'()*+,;=?-._~"), "",
    ))


class Fetcher:
    """robots.txt를 지키고 요청 사이에 간격을 두는 간단한 HTTP 클라이언트."""

    def __init__(self, delay=1.5, timeout=30):
        self.delay = delay
        self.timeout = timeout
        self._robots = {}
        self._last = 0.0

    def allowed(self, url):
        parts = urllib.parse.urlsplit(url)
        base = f"{parts.scheme}://{parts.netloc}"
        if base not in self._robots:
            rp = urllib.robotparser.RobotFileParser()
            try:
                req = urllib.request.Request(base + "/robots.txt", headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(req, timeout=self.timeout) as r:
                    rp.parse(r.read().decode("utf-8", "replace").splitlines())
            except Exception:
                rp.parse([])  # robots.txt가 없으면 전부 허용
            self._robots[base] = rp
        return self._robots[base].can_fetch(USER_AGENT, url)

    def get(self, url):
        """(bytes, content_type, final_url)을 돌려준다. robots.txt가 막으면 PermissionError."""
        url = iri_to_uri(url)
        if not self.allowed(url):
            raise PermissionError(f"robots.txt disallows {url}")
        wait = self.delay - (time.time() - self._last)
        if wait > 0:
            time.sleep(wait)
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as r:
                return r.read(), r.headers.get("Content-Type", ""), r.geturl()
        finally:
            self._last = time.time()


# ---------------------------------------------------------------- HTML

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []  # (href, anchor_text)
        self.title = ""
        self._href = None
        self._text = []
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self._href = dict(attrs).get("href")
            self._text = []
        elif tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "a" and self._href:
            self.links.append((self._href, " ".join("".join(self._text).split())))
            self._href = None
        elif tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)
        if self._in_title:
            self.title += data


def parse_html(body, base_url):
    p = LinkParser()
    p.feed(body.decode("utf-8", "replace"))
    links = []
    for href, text in p.links:
        href = href.strip()
        if href.startswith(("mailto:", "javascript:", "tel:", "#")):
            continue
        absolute = urllib.parse.urldefrag(urllib.parse.urljoin(base_url, href))[0]
        links.append((absolute, text))
    return " ".join(p.title.split()), links


def is_file_url(url):
    path = urllib.parse.urlsplit(url).path.lower()
    return path.endswith(FILE_EXTS)


def guess_year(*texts):
    for t in texts:
        m = re.search(r"(19[89]\d|20[0-3]\d)", t or "")
        if m:
            return m.group(1)
    return ""


# ---------------------------------------------------------------- CSV

def read_csv(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def append_links(path, rows):
    """links.csv에 file_url 기준으로 중복 없이 추가한다."""
    existing = set()
    if os.path.exists(path):
        existing = {r["file_url"] for r in read_csv(path)}
    new = [r for r in rows if r["file_url"] not in existing]
    write_header = not os.path.exists(path)
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=LINK_FIELDS, extrasaction="ignore")
        if write_header:
            w.writeheader()
        for r in new:
            existing.add(r["file_url"])
            w.writerow(r)
    print(f"[links] {len(new)}건 추가 (총 {len(existing)}건) → {path}")


def load_keywords(path):
    with open(path, encoding="utf-8") as f:
        return [ln.strip().lower() for ln in f if ln.strip() and not ln.startswith("#")]


def keep(row, keywords):
    if not keywords:
        return True
    hay = " ".join([row.get("title", ""), urllib.parse.unquote(row.get("file_url", ""))]).lower()
    return any(k in hay for k in keywords)


# ---------------------------------------------------------------- crawl

def crawl_site(fetcher, start_url, country, event, max_pages, max_depth):
    """같은 도메인 안에서 BFS로 돌며 파일 링크를 모은다."""
    host = urllib.parse.urlsplit(start_url).netloc
    seen = {start_url}
    queue = deque([(start_url, 0)])
    found = {}
    pages = 0
    while queue and pages < max_pages:
        url, depth = queue.popleft()
        try:
            body, ctype, final = fetcher.get(url)
        except Exception as e:
            print(f"  ! {url}: {e}", file=sys.stderr)
            continue
        pages += 1
        if "html" not in ctype:
            continue
        title, links = parse_html(body, final)
        for link, text in links:
            if is_file_url(link):
                if link not in found:
                    found[link] = {
                        "country": country, "event": event,
                        "year": guess_year(text, link, title),
                        "title": text or title, "page_url": final, "file_url": link,
                    }
            elif (depth < max_depth and link not in seen
                  and urllib.parse.urlsplit(link).netloc == host
                  and link.startswith(("http://", "https://"))):
                seen.add(link)
                queue.append((link, depth + 1))
        print(f"  [{pages}/{max_pages}] {url}  (파일 {len(found)}건)")
    return list(found.values())


def cmd_crawl(args):
    fetcher = Fetcher(args.delay)
    keywords = load_keywords(args.keywords) if args.physics else []
    rows = []
    for site in read_csv(args.sites):
        if site["method"] != "crawl" or (args.country and site["country"] != args.country):
            continue
        print(f"[crawl] {site['name']} {site['url']}")
        rows += crawl_site(fetcher, site["url"], site["country"], site["event"],
                           args.max_pages, args.max_depth)
    append_links(args.out, [r for r in rows if keep(r, keywords)])


# ---------------------------------------------------------------- CiNii

def cmd_cinii(args):
    appid = args.appid or os.environ.get("CINII_APPID")
    if not appid:
        sys.exit("CiNii Research API는 appid가 필요합니다. --appid 또는 환경변수 CINII_APPID를 설정하세요.")
    fetcher = Fetcher(args.delay)
    keywords = load_keywords(args.keywords) if args.physics else []
    rows = []
    for start in range(1, args.limit + 1, 200):
        q = urllib.parse.urlencode({
            "q": args.query, "format": "json", "count": min(200, args.limit - start + 1),
            "start": start, "appid": appid,
        })
        body, _, _ = fetcher.get(f"https://cir.nii.ac.jp/opensearch/{args.type}?{q}")
        items = json.loads(body).get("items", [])
        if not items:
            break
        for it in items:
            title = it.get("title", "")
            record = it.get("@id") or it.get("link", {}).get("@id", "")
            year = (it.get("prism:publicationDate") or "")[:4]
            # 레코드 페이지에서 본문 링크(리포지토리 PDF 등)를 찾는다
            try:
                body2, _, final = fetcher.get(record)
                _, links = parse_html(body2, final)
            except Exception as e:
                print(f"  ! {record}: {e}", file=sys.stderr)
                continue
            # CiNii는 원문을 기관 리포지토리에 링크하므로 한 단계 더 따라간다
            files = [l for l, _ in links if is_file_url(l)]
            if not files:
                outs = [l for l, _ in links
                        if urllib.parse.urlsplit(l).netloc.endswith(("repo.nii.ac.jp", ".ac.jp"))
                        and "cir.nii.ac.jp" not in l][:3]
                for o in outs:
                    try:
                        b3, ct, f3 = fetcher.get(o)
                        if "html" in ct:
                            files += [l for l, _ in parse_html(b3, f3)[1] if is_file_url(l)]
                    except Exception as e:
                        print(f"  ! {o}: {e}", file=sys.stderr)
            for f in dict.fromkeys(files):
                rows.append({"country": "JP", "event": args.event, "year": year,
                             "title": title, "page_url": record, "file_url": f})
            print(f"  {title[:50]}  → 파일 {len(files)}건")
    append_links(args.out, [r for r in rows if keep(r, keywords)])


# ---------------------------------------------------------------- download

def safe_name(s, limit=80):
    s = re.sub(r'[\\/:*?"<>|\s]+', "_", s).strip("._")
    return s[:limit] or "untitled"


MAGIC = [(b"%PDF", ".pdf"), (b"PK\x03\x04", ".zip"), (b"\xd0\xcf\x11\xe0", ".ole")]
CTYPE_EXT = {"pdf": ".pdf", "presentationml": ".pptx", "powerpoint": ".ppt",
             "wordprocessingml": ".docx", "msword": ".doc", "hwp": ".hwp"}


def file_name(url, title, ctype, data):
    """원래 이름 + 제목으로 파일명을 만든다. downBbsNttFile.do처럼 확장자가 없는 주소도 처리."""
    base = urllib.parse.unquote(os.path.basename(urllib.parse.urlsplit(url).path))
    stem, ext = os.path.splitext(base)
    if ext.lower() not in FILE_EXTS:
        stem, ext = "", next((e for k, e in CTYPE_EXT.items() if k in ctype.lower()), "")
        if not ext:
            ext = next((e for m, e in MAGIC if data.startswith(m)), ".bin")
            if ext in (".zip", ".ole"):  # 오피스 문서/HWP는 내용만으로 구분이 어려움
                ext = ".hwp" if b"HWP Document" in data[:4096] else ".docx" if ext == ".zip" else ".doc"
    parts = [p for p in (safe_name(stem, 30) if stem else "", safe_name(title, 60) if title else "") if p]
    return "_".join(parts or ["file"]) + ext.lower()


def cmd_download(args):
    fetcher = Fetcher(args.delay)
    keywords = load_keywords(args.keywords) if args.physics else []
    rows = []
    for path in args.links:
        rows += read_csv(path)
    index = {}
    if os.path.exists(args.index):
        index = {r["file_url"]: r for r in read_csv(args.index)}
    hashes = {r["sha256"]: r["path"] for r in index.values() if r.get("sha256")}

    for r in rows:
        url = r["file_url"]
        if not keep(r, keywords):
            continue
        if url in index and index[url]["status"] in ("ok", "duplicate") and os.path.exists(index[url]["path"]):
            continue
        folder = os.path.join(args.dest, safe_name(r["country"]), safe_name(r["event"] or "기타"))
        entry = {k: r.get(k, "") for k in LINK_FIELDS}
        try:
            data, ctype, _ = fetcher.get(url)
            dest = os.path.join(folder, file_name(url, r.get("title", ""), ctype, data))
            digest = hashlib.sha256(data).hexdigest()
            if digest in hashes:
                entry.update(path=hashes[digest], bytes=len(data), sha256=digest, status="duplicate")
            else:
                os.makedirs(folder, exist_ok=True)
                if os.path.exists(dest):  # 이름만 같고 내용이 다른 파일
                    stem, ext = os.path.splitext(dest)
                    dest = f"{stem}_{digest[:8]}{ext}"
                with open(dest, "wb") as f:
                    f.write(data)
                hashes[digest] = dest
                entry.update(path=dest, bytes=len(data), sha256=digest, status="ok")
            print(f"[{entry['status']}] {entry['path']}")
        except PermissionError as e:
            entry.update(path="", bytes=0, sha256="", status="robots")
            print(f"[robots] {e}", file=sys.stderr)
        except Exception as e:
            entry.update(path="", bytes=0, sha256="", status=f"error: {e}")
            print(f"[error] {url}: {e}", file=sys.stderr)
        index[url] = entry

    with open(args.index, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=INDEX_FIELDS, extrasaction="ignore")
        w.writeheader()
        w.writerows(index.values())
    ok = sum(1 for e in index.values() if e["status"] == "ok")
    print(f"[index] 저장 {ok}건 / 전체 {len(index)}건 → {args.index}")


# ---------------------------------------------------------------- main

def main(argv=None):
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--delay", type=float, default=1.5, help="요청 간격(초)")
    ap.add_argument("--physics", action="store_true", help="keywords.txt에 맞는 자료만 남김")
    ap.add_argument("--keywords", default=os.path.join(here, "data", "keywords.txt"))
    sub = ap.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("crawl", help="sites.csv의 method=crawl 사이트에서 파일 링크 수집")
    c.add_argument("--sites", default=os.path.join(here, "data", "sites.csv"))
    c.add_argument("--country", choices=["KR", "JP"])
    c.add_argument("--max-pages", type=int, default=150)
    c.add_argument("--max-depth", type=int, default=3)
    c.add_argument("--out", default="links.csv")
    c.set_defaults(func=cmd_crawl)

    n = sub.add_parser("cinii", help="CiNii Research 검색 결과에서 PDF 링크 수집")
    n.add_argument("--query", required=True)
    n.add_argument("--type", default="all", choices=["all", "articles", "data"])
    n.add_argument("--event", default="科学の祭典")
    n.add_argument("--limit", type=int, default=200)
    n.add_argument("--appid")
    n.add_argument("--out", default="links.csv")
    n.set_defaults(func=cmd_cinii)

    d = sub.add_parser("download", help="links.csv의 파일 내려받기")
    d.add_argument("--links", nargs="+", default=["links.csv"])
    d.add_argument("--dest", default="downloads")
    d.add_argument("--index", default="index.csv")
    d.set_defaults(func=cmd_download)

    args = ap.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
