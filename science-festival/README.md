# 과학축전·시연실험 자료 수집 (한국·일본)

과학축전과 물리 시연실험 자료(PDF·PPT·HWP)를 모아 나라·행사별 폴더에 정리하는 도구입니다.
**찾기는 MCP와 Claude Code가, 받기는 Python 스크립트가** 맡는 2단계 방식입니다.

> 집이나 학교 PC의 Claude Code에서 실행하세요. 클라우드 세션은 외부 사이트 접속이 막혀 있을 수 있습니다.

## 폴더 구성

| 파일 | 역할 |
|---|---|
| `collect.py` | 수집기 본체. 표준 라이브러리만 써서 설치할 것이 없습니다 (Python 3.9 이상) |
| `data/sites.csv` | 대상 사이트 목록과 사이트별 수집 방법(`crawl` / `cinii` / `playwright` / `seed`) |
| `data/seed_links.csv` | 사전 조사로 찾아 둔 대학 리포지토리 PDF 7건 |
| `data/links_found.csv` | Firecrawl로 찾아 둔 한·일 자료 141건 |
| `data/keywords.txt` | 물리 분야만 거를 때 쓰는 한·일·영 키워드 |
| `.mcp.json` | Firecrawl·Playwright MCP 설정 (이 폴더에서 Claude Code를 켜면 자동으로 읽힘) |

## 준비

1. Node.js 18 이상 설치 (MCP 서버 실행용)
2. Firecrawl API 키 발급(https://firecrawl.dev) 후 환경변수 설정
   ```bash
   export FIRECRAWL_API_KEY=fc-...       # Windows PowerShell: $env:FIRECRAWL_API_KEY="fc-..."
   ```
3. (선택) CiNii Research API 키(appid) 발급 후 `export CINII_APPID=...`
   일본 대학 출전 보고서를 대량으로 찾는 데 가장 효과적입니다. 비상업 교육 목적 등록은 무료입니다.

## 찾아 둔 자료 한 번에 받기

`data/links_found.csv`에 Firecrawl 검색으로 찾아 둔 파일 141건이 정리되어 있습니다.

| 나라 | 묶음 | 건수 |
|---|---|---|
| 일본 | 科学の祭典 全国大会 実験解説集 (2026년 62개 실험 낱장 + 합본, 2022 합본 등) | 72 |
| 일본 | 科学の祭典 지역대회 보고서 | 25 |
| 일본 | 출전 보고 (대학·연구소·물리교육학회) | 12 |
| 일본 | 演示実験 (초전도 시연 등) | 4 |
| 한국 | 국립중앙과학관 물리 실험 장치·탐구 자료 | 13 |
| 한국 | 사이언스올 물리 수업 자료 | 11 |
| 한국 | 과학축전 자료집·운영 계획 | 4 |

```bash
cd science-festival
python collect.py download --links data/links_found.csv data/seed_links.csv
```
→ 요청 간격 1.5초라 약 5분 걸립니다. 파일은 `downloads/나라/묶음/` 아래에 `원래이름_제목.pdf` 형태로 저장됩니다.

`2018~2025 全国大会 実験解説集 (주소 추정)` 7건은 2022·2026년 주소 규칙으로 만든 것이라 없으면 `index.csv`에 404로 남습니다.

## 전체 수집 순서

```bash
# ① 일본: 학술 리포지토리의 출전 보고서 (CINII_APPID 필요)
python collect.py cinii --query "科学の祭典"
python collect.py cinii --query "青少年のための科学の祭典 演示"
python collect.py cinii --query "演示実験 物理" --event 演示実験

# ② 사이트 크롤링: sites.csv에서 method=crawl인 곳 (사이트당 최대 150페이지)
python collect.py crawl                  # 한·일 모두
python collect.py crawl --country KR     # 한국만

# ③ links.csv를 열어 필요 없는 줄을 지운 뒤 내려받기
python collect.py download --links links.csv data/seed_links.csv

# 물리 분야만 원하면 어느 단계든 --physics 를 붙입니다
python collect.py --physics download --links links.csv data/seed_links.csv
```

결과물:
- `downloads/나라/행사명/파일` — 내용이 같은 파일은 한 번만 저장(SHA-256 비교)
- `index.csv` — 파일별 출처 페이지, 원본 주소, 저장 경로, 상태(ok·duplicate·robots·error)

같은 명령을 다시 실행하면 이미 받은 파일은 건너뛰므로, 중간에 끊겨도 이어서 받을 수 있습니다.

## MCP가 맡는 일

`method=playwright`인 사이트(공공데이터포털)나, 크롤링으로 링크가 잡히지 않는 게시판은 스크립트로 처리하기 어렵습니다.
이런 곳은 Claude Code에게 MCP로 링크를 찾아 `links.csv`에 추가해 달라고 하면 됩니다.
아래 [지시문](#claude-code-지시문)에 그 과정이 들어 있습니다.

- **Firecrawl MCP**: 현지어 검색(`search`), 사이트 전체 URL 목록 뽑기(`map`)
- **Playwright MCP**: 클릭해야 열리는 게시판, 자바스크립트로 만든 다운로드 버튼

## Claude Code 지시문

이 폴더에서 `claude`를 실행하고 아래를 그대로 붙여 넣으세요.

```text
science-festival 폴더의 README와 collect.py를 읽고 한국·일본 과학축전 자료를 수집해줘.

1. 먼저 `python collect.py download --links data/seed_links.csv`로 동작을 확인해.
2. Firecrawl search로 아래 검색어를 찾아서 sites.csv에 없는 좋은 출처를 후보로 골라
   표로 보여줘. 내가 확인하기 전에는 크롤링하지 마.
   - 일본: 科学の祭典 実験解説集 pdf / 科学の祭典 出展 報告 / 演示実験 物理 pdf
   - 한국: 과학축전 체험부스 운영 자료 pdf / 과학축전 실험 매뉴얼 / 과학관 실험 프로그램 자료집
3. 내가 고른 사이트를 sites.csv에 추가하고 `python collect.py crawl`을 실행해.
   링크가 거의 안 나오는 사이트는 Firecrawl map으로 URL을 뽑아 pdf/ppt/pptx/hwp/docx만
   links.csv 형식(country,event,year,title,page_url,file_url)으로 추가해.
4. 공공데이터포털(data.go.kr)은 Playwright로 "국립중앙과학관", "국립과천과학관"
   제공 파일데이터 중 실험·전시 자료집을 찾아 다운로드 링크를 links.csv에 추가해.
5. CINII_APPID가 설정돼 있으면 README의 cinii 명령도 실행해.
6. links.csv를 나라·행사별 건수로 요약해서 보여주고, 확인받은 뒤
   `python collect.py download --links links.csv data/seed_links.csv`로 내려받아.
7. 끝나면 index.csv의 PDF마다 제목과 한 줄 요약(한국어)을 summary.csv로 만들어줘.
   물리 수업에 바로 쓸 만한 자료는 별표로 표시해.
```

2단계와 6단계에서 한 번씩 멈추게 한 것은, 엉뚱한 사이트를 통째로 긁어 시간과 Firecrawl 크레딧을 낭비하지 않기 위해서입니다.

## 유의할 점

- **저작권**: 수업 준비용 참고는 괜찮지만, 원본을 학생이나 다른 교사에게 배포·재게시할 때는 출처와 이용 조건을 확인하세요. `index.csv`에 출처가 남아 있습니다.
- **예의 있는 수집**: 기본 요청 간격은 1.5초(`--delay`)이고 robots.txt가 막은 주소는 받지 않습니다. 간격을 줄이지 마세요.
- **주소 확인**: `sites.csv`에서 "주소 확인 필요"라고 적힌 곳은 사전 조사에서 주소를 직접 확인하지 못한 곳입니다.

## 다운로드가 실패할 때

실행이 끝나면 `[실패 요약]`에 사이트별 원인이 나옵니다. 같은 명령을 다시 실행하면 실패한 것만 다시 시도합니다.

| 원인 | 해결 |
|---|---|
| 인증서 검증 실패 (주로 `.go.kr`) | `pip install truststore` 후 다시 실행. 운영체제 인증서 저장소로 검증합니다 |
| 파일 대신 웹페이지(HTML)가 옴 | 로그인·세션이 필요한 자료입니다. 브라우저에서 `index.csv`의 주소를 직접 열어 받으세요 |
| HTTP 404 | 자료가 삭제됐거나 주소가 바뀐 것입니다 |
