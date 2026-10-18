# CMS 실제 충돌 데이터 (data/)

이 폴더의 CSV 파일은 모두 CERN의 CMS 실험이 2011~2012년에 기록하고 공개한 **실제 양성자–양성자 충돌 데이터**입니다. 주제 10 「실제 CERN 데이터로 발견하기」와 업그레이드 U1(파이썬 분석)에서 씁니다. 웹 페이지 안내는 `data/index.html`에 있습니다.

## 한눈에 보기

| 파일 | 내용 | 사건 수 | 크기 | 주로 쓰는 곳 |
|---|---|---:|---:|---|
| `cms_dimuon_2011_mass.csv` | 이중뮤온 불변질량 M만 | 100,000 | 0.75 MB | 로그 눈금 전체 스펙트럼, 공명 찾기 |
| `cms_dimuon_2011_events.csv` | 이중뮤온 사건의 4-벡터(E, px, py, pz)와 전하 | 20,000 | 1.8 MB | 스프레드시트 불변질량 계산, 3D 사건 보기 |
| `cms_zmumu_2011.csv` | Z→μμ 후보의 pT, η, φ, 전하, 고립도 | 10,583 | 0.79 MB | Z 질량과 폭 측정 |
| `cms_higgs4l_2011_2012.csv` | 4렙톤(4μ, 4e, 2e2μ) 사건의 4-벡터 | 278 | 0.05 MB | 힉스(약 125 GeV) 후보 세기 |
| `cms_wmunu_2011.csv` | W→μν 후보의 뮤온 pT, η, φ, 전하, 누락 횡운동량 | 20,000 | 1.2 MB | W⁺/W⁻ 비 |

단위: E, px, py, pz, pt, MET, M은 GeV(c = 1 단위: GeV, GeV/c, GeV/c²). phi(φ)는 라디안(−π ~ π), eta(η)는 단위 없음, 전하 Q는 기본 전하 단위(+1/−1).

`data/js/*.js`는 같은 데이터를 자바스크립트 문자열로 담은 사본입니다. 3D 모의실험이 `SimKit.data.load("cms_dimuon_2011_mass", "../")`처럼 script 태그로 불러오므로 인터넷 없이 `file://`로 열어도 동작합니다. `data/`와 `data/js/` 폴더 구조를 유지하세요.

## 파일별 설명

### 1. cms_dimuon_2011_mass.csv — 이중뮤온 불변질량 100,000건
- 열: `M` (두 뮤온의 불변질량, GeV/c²). 범위 0.30 ~ 299.2 GeV.
- CMS 2011년 Run2011A DoubleMu 데이터. 선택 조건: 두 뮤온 모두 |η| < 2.4, 적어도 하나는 전역 뮤온, 불변질량 0.3~300 GeV, 반대 부호.
- 로그 눈금으로 그리면 ω, φ, J/ψ, ψ(2S), Υ(1S, 2S, 3S), Z 봉우리가 보입니다.

### 2. cms_dimuon_2011_events.csv — 이중뮤온 사건 20,000건
- 1번 파일의 처음 20,000건과 같은 사건(같은 순서).
- 열: `Run, Event, E1, px1, py1, pz1, Q1, E2, px2, py2, pz2, Q2, M`
- 스프레드시트: `=SQRT((C2+H2)^2-(D2+I2)^2-(E2+J2)^2-(F2+K2)^2)` → M 열과 비교. 99.7% 이상이 0.01 GeV 이내로 일치(에너지가 매우 큰 뮤온이 있는 소수 사건은 반올림 탓에 차이).

### 3. cms_zmumu_2011.csv — Z→μμ 후보 10,583건
- 열: `Run, Event, pt1, eta1, phi1, Q1, iso1, pt2, eta2, phi2, Q2, iso2` (iso = 뮤온 주변 트래커·ECAL·HCAL 신호 합, 작을수록 고립된 뮤온)
- 선택 조건: 두 뮤온 pT > 20 GeV, |η| < 2.1, 불변질량 60~120 GeV. 반대 부호 10,227건, 같은 부호 356건.
- 질량 열이 없음: `=SQRT(2*C2*H2*(COSH(D2-I2)-COS(E2-J2)))` (M² = 2·pT₁·pT₂·(cosh Δη − cos Δφ)).

### 4. cms_higgs4l_2011_2012.csv — 4렙톤 사건 278건
- 열: `year, channel, Run, Event`, 렙톤 i = 1~4마다 `PIDi, Ei, pxi, pyi, pzi, Qi`, 그리고 `mZ1, mZ2, M`.
- PID(PDG 번호): 11 = e⁻, −11 = e⁺, 13 = μ⁻, −13 = μ⁺. 일부 Event 번호는 원본에서 음수로 저장되어 있음.
- 2011년 38건(7 TeV), 2012년 240건(8 TeV). 4μ 113, 4e 48, 2e2μ 117. M 범위 79.4 ~ 742.1 GeV.
- 120~130 GeV 구간: 13건(2011년 2, 2012년 11; 4μ 4, 4e 3, 2e2μ 6). 교육용 일부이므로 이것만으로 발견의 유의성을 재현할 수는 없음.

### 5. cms_wmunu_2011.csv — W→μν 후보 20,000건
- 열: `Run, Event, pt, eta, phi, Q, MET, phiMET`
- 선택 조건: pT > 25 GeV, |η| < 2.1인 전역 뮤온이 하나뿐(다른 뮤온 pT > 10 GeV이면 제외). 원본의 처음 20,000건, chiSq·dxy·iso 열은 제외.
- Q = +1: 11,025건, Q = −1: 8,975건 → W⁺/W⁻ = 1.228 ± 0.017. 횡질량 m_T = √(2·pT·MET·(1 − cos(φ − φ_MET))) > 50 GeV인 사건만: 5,673 / 4,232 = 1.34.

## 출처와 라이선스

- **데이터**: CMS Collaboration, CERN Open Data Portal. 라이선스 **CC0**(퍼블릭 도메인).
  - 이중뮤온·Z·W: record 545 "Datasets derived from the Run2011A SingleElectron, SingleMu, DoubleElectron, and DoubleMu primary datasets" (T. McCauley, 2017) — https://opendata.cern.ch/record/545
  - 4렙톤: record 5200 "Higgs candidate events from CMS 2011 and 2012 open data release selected in the Higgs-to-four-lepton analysis example" (T. McCauley, 2019), DOI 10.7483/OPENDATA.CMS.YGG7.333M — https://opendata.cern.ch/record/5200
  - CMS와 CERN은 이 데이터로 만든 결과물을 보증하지 않으며, 교육용으로 고른 일부 정보이므로 정식 물리 분석에는 적합하지 않습니다.
- **정리 형태**: cms-opendata-education 교육 자료(https://github.com/cms-opendata-education, **CC-BY 4.0**)에 실린 같은 CSV를 바탕으로 열을 줄이고 파일을 합치고 일부 사건만 남겼습니다. 숫자 값은 바꾸지 않았습니다(소수점 아래 4자리, 4렙톤은 3자리).
- 표기 예: "CMS Open Data(CC0), cms-opendata-education 자료(CC-BY 4.0) 참고".

## 원본을 직접 내려받는 방법

포털의 기록(record) 화면과 파일 이름은 바뀔 수 있습니다. 링크가 바뀌었으면 포털 검색창에서 "Dimuon", "Zmumu", "Higgs four lepton"으로 찾으세요.

1. https://opendata.cern.ch 에 접속합니다(로그인 필요 없음, 영어 화면).
2. CMS 데이터셋 검색: https://opendata.cern.ch/search?q=&experiment=CMS&type=Dataset — 왼쪽 필터에서 "Derived"와 키워드 "education"을 고르면 교육용 CSV 기록만 남습니다.
3. https://opendata.cern.ch/record/545 를 열고 "Dataset semantics"(열 설명)와 "How were these data selected?"(선택 조건)를 읽습니다.
4. "Files and indexes"에서 `Dimuon_DoubleMu.csv`(약 13 MiB, 100,000건)의 [Download]를 누릅니다. 같은 기록에 Jpsimumu, Wmunu, Wenu 등도 있습니다(목록이 여러 쪽일 수 있음).
5. 힉스 4렙톤: https://opendata.cern.ch/record/5200 에서 `4mu_2011.csv`, `4e_2011.csv`, `2e2mu_2011.csv`와 2012년 파일을 내려받습니다. `.ig` 파일은 온라인 사건 표시기(https://opendata.cern.ch/visualise/events/CMS)에서 3D로 볼 수 있습니다. 분석 예제 전체: https://opendata.cern.ch/record/5500
6. 구글 시트([파일] → [가져오기] → [업로드]) 또는 엑셀로 엽니다. `Dimuon_DoubleMu.csv`는 21열(Run, Event, type1, E1, px1, py1, pz1, pt1, eta1, phi1, Q1, type2, E2, …, Q2, M)입니다. type은 G(전역 뮤온) 또는 T(트래커 뮤온).
7. `sims/t10.html`(3D 오픈데이터 분석실)의 [내 CSV 불러오기]에 그대로 넣으면 열 이름(E1, px1, … / pt1, eta1, … / M)을 알아보고 분석합니다. 파일은 기기 밖으로 전송되지 않습니다.
8. 포털의 다른 도구: 히스토그램 도구 https://opendata.cern.ch/visualise/histograms/CMS , 스프레드시트 안내 https://opendata.cern.ch/record/5100 , 주피터 노트북 안내 https://opendata.cern.ch/record/5101

학교 네트워크에서 포털이 막히면 이 폴더의 CSV를 미리 USB나 학급 드라이브에 복사해 두고 쓰세요.

## 더 찾아볼 곳: ATLAS 오픈 데이터

ATLAS도 교육용 데이터를 공개합니다: https://opendata.atlas.cern — 13 TeV 충돌 데이터와 모의 데이터, 브라우저에서 돌아가는 파이썬 노트북, 학생 활동 안내. 같은 Z 봉우리나 힉스 채널을 두 실험 데이터로 각각 분석해 비교해 보세요. 파일 형식(ROOT, 열 이름)은 CMS CSV와 다릅니다.
