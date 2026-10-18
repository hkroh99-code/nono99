# CERN 탐구 교실

고등학생이 CERN 과학자처럼 실험하는 **20시간 입자물리 프로젝트 수업 자료**입니다.
주제마다 **학생용 활동지 · 교사용 지도서 · 3D 모의실험**이 한 묶음이고, 마지막 주제에서는 **CMS 실험의 실제 충돌 데이터**를 분석합니다.

## 바로 열기

- 웹으로 보기(GitHub Pages를 켠 경우): `https://hkroh99-code.github.io/nono99/`
- 내려받아 보기: 저장소를 ZIP으로 내려받아 압축을 풀고 `index.html`을 브라우저로 엽니다. 인터넷 없이도 동작합니다.

### GitHub Pages 켜는 법
1. 저장소 → **Settings** → **Pages**
2. **Source**: `Deploy from a branch`, **Branch**: `main` / `/(root)` → **Save**
3. 1~2분 뒤 위 주소로 접속합니다. 학생에게는 이 주소만 알려 주면 됩니다.

## 구성 (10개 주제 · 20시간)

| 단계 | 주제 | 실물 실험 (실험 A) | 3D 모의실험 (실험 B) |
|---|---|---|---|
| 기본 | 1. CERN과 물질의 기본 구성 | 블랙박스 탐구 | 물질 속으로 줌인 · 표준모형 갤러리 |
| 기본 | 2. 러더퍼드 산란 | 구슬 산란으로 크기 재기 | 금박 산란실 |
| 기본 | 3. 전기장으로 입자 가속하기 | 정전기·계단 모형 가속 | 선형가속기 위상 맞추기 |
| 기본 | 4. 자기장으로 입자 휘기 | 로렌츠 힘 그네 | 자기장 속 궤적 · 싱크로트론 |
| 기본 | 5. 입자 검출기 | 구름상자 만들기 | CMS 검출기 탐험 |
| 심화 | 6. 특수 상대성이론과 우주선 뮤온 | 뮤온 계수 · 주사위 붕괴 | 뮤온 비행 실험실 |
| 심화 | 7. 보존 법칙과 불변질량 | 2차원 충돌 영상 분석 | 붕괴 재구성 실험실 |
| 종합 | 8. 나만의 LHC 설계하기 | 가속기 설계 제안서 · 모형 | LHC 가상 운전실 |
| 종합 | 9. 사건 분석가 되기 | 사건 카드 분류(마스터클래스형) | 3D 이벤트 디스플레이 분석기 |
| 종합 | 10. 실제 CERN 데이터로 발견하기 | 스프레드시트로 실제 데이터 분석 | CMS 오픈데이터 분석실 |

- 차시는 바꿀 수 있습니다. 홈페이지의 **차시 설계기**에서 10 · 15 · 20 · 30시간 배분을 고르거나 주제별로 직접 조정하세요. 지도서마다 **1차시 압축안**과 **3차시 확장안**이 있습니다.
- **출력·만들기 키트 10종**(`make/`): A4로 출력해 자르고 접어 만드는 카드 게임, 미니북, 숨은 표적판, 종이 CMS 회전판, 곡률 자와 거품상자 카드, 붕괴 주사위, 보드게임, 실제 CMS 사건 카드와 교실 히스토그램, 방탈출, 쌍극자석 페이퍼크래프트. 키트마다 인쇄용 PDF(`make/pdf/`)가 있습니다.
- **인쇄용 PDF**: 학생용 활동지(`students/pdf/`)와 교사용 지도서(`teachers/pdf/`)도 A4 PDF로 들어 있습니다.
- **업그레이드 트랙**(`upgrade/`): Python 데이터 분석(Colab), 반물질과 PET, 하드론 치료, 암흑물질, 연구 프로젝트, 차시 재구성과 평가 설계.

## 폴더 구조

```
index.html            홈: 차시 지도, 차시 설계기
students/tNN.html     학생용 활동지 (입력 자동 저장, 답안 복사)
teachers/tNN.html     교사용 지도서 (정답·해설·루브릭 포함 — 학생 배포 금지)
sims/tNN.html         3D 모의실험
make/kNN.html         출력·만들기 키트 (make/pdf/ 인쇄용 PDF)
upgrade/              업그레이드 모듈 U1~U6
notebooks/            Google Colab용 Python 노트북
data/                 실제 CMS 오픈데이터 (CSV + 오프라인용 JS 사본)
assets/               공통 스타일, 3D 도구(sim-kit.js), three.js r147
templates/            새 주제를 만들 때 복사할 틀
docs/curriculum-spec.md  교육과정 설계서(자료를 고치거나 추가할 때 기준)
```

## 실제 데이터 출처

`data/`의 파일은 CERN Open Data Portal에 공개된 CMS 2011~2012년 충돌 데이터에서 만든 교육용 파일입니다(CC0).
원본: [opendata.cern.ch record 545](https://opendata.cern.ch/record/545) 등, 교육용 정리본: [cms-opendata-education](https://github.com/cms-opendata-education) (CC-BY 4.0).
자세한 설명은 `data/README.md`를 보세요.

## 자료 업그레이드하는 법

1. `docs/curriculum-spec.md`에 새 주제나 바뀐 내용을 먼저 적습니다.
2. `templates/`의 세 파일을 복사해 `students/`, `teachers/`, `sims/`에 넣고 내용을 채웁니다.
3. `assets/js/common.js`의 `TOPICS` 배열에 주제를 추가하면 메뉴·목록·이전/다음 링크가 자동으로 갱신됩니다.
4. 변경 내용은 `CHANGELOG.md`에 기록합니다.

## 라이선스와 고지

- 수업 자료(HTML·노트북): 교사 제작 교육 자료입니다. 수업에 자유롭게 쓰고 고쳐 쓰세요.
- three.js: MIT License (`assets/vendor/three/LICENSE`)
- CMS Open Data: CC0. CERN의 공식 자료가 아닙니다.
