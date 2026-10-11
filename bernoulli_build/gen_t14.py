# -*- coding: utf-8 -*-
import re
s=open('parts/_t14_base.html',encoding='utf-8').read()
R=[
 ('「더 좋은 영상 장치를 만들자」','「더 좋은 유압 장치를 만들자」'),
 ('🎯 부품을 켜고 끄며 <b>총 비용</b>이 한도 안인지, <b>동작 시간</b>이 임무 시간보다 긴지 확인하세요. 값은 시판 모듈의 <b>대표 어림값</b>이며 실제는 데이터시트와 측정으로 바꿔야 합니다.','🎯 활동을 켜고 끄며 <b>총 비용</b>이 한도 안인지, <b>팀 작업 시간</b>이 쓸 수 있는 시간 안인지 확인하세요. 값은 학교 실험실 · 문구점 기준 <b>대표 어림값</b>이며 실제 가격과 시간으로 바꿔야 합니다.'),
 ('모형 : 총 작업량(1인 기준)는 켜져 있는 부품의 대표 총 작업량(1인 기준)의 합, 동작 시간 = 0.8 × 용량 ÷ 총 작업량(1인 기준). 송신 · 서보 · 카메라는 순간 전류(피크)가 훨씬 크므로 전압 강하(리셋)도 따로 점검하세요(6번 탭). 비용 한도 350 g 은 「예시」이며 대회마다 다릅니다.','모형 : 총 작업량(1인 기준)은 켜진 활동의 어림 작업 시간의 합, 팀 작업 시간 = 총 작업량 ÷ (인원 × 0.8). 혼자(1 명)는 협업 손실이 없어 효율 1 로 계산합니다. 비용 한도 50 천 원은 「예시」이며 학교 · 대회마다 다릅니다. 사람 수를 늘려도 시간이 정확히 반이 되지 않음을 확인하세요.'),
 ('data-pngname="medimg-budget"','data-pngname="bernoulli-budget"'),
 ('📊 위 : 부품별 질량(누적 막대)과 비용 한도(빨간 선) · 아래 : 부품별 총 작업량(1인 기준)(누적 막대)와 쓸 수 있는 작업 시간에 맞는 한계 전류(초록 선). 선을 넘으면 설계를 고쳐야 합니다.','📊 위 : 활동별 비용(누적 막대)과 비용 한도(빨간 선) · 아래 : 활동별 팀 작업 시간(누적 막대)과 쓸 수 있는 시간(초록 선). 선을 넘으면 계획을 고쳐야 합니다.'),
 ('aria-label="비용 예산과 시간 예산 막대 그래프"','aria-label="비용 예산과 시간 예산 막대 그래프"'),
 ('📐 식으로 정리하기','📐 식으로 정리하기'),
 ('저선량에서도 선명한 영상 — 평균 필터의 최적 반경','주사기 유압 장치의 효율 η — 공기 방울은 얼마나 손해인가'),
 ('평균 필터 반경을 키우면 잡음과 경계 선명도는 어떻게 변하는가?','유압 관 속 공기 방울 부피를 늘리면 출력 힘 F₂ 와 효율 η 는 어떻게 변하는가?'),
 ('반경이 커지면 잡음은 1/(2r+1) 로 줄지만 경계가 흐려질 것이다. 독립 잡음의 평균은 √N 으로 줄기 때문이다.','공기는 압축되어 부피가 변하므로(보일 법칙) 움직임이 낭비되어 η 가 줄 것이다. 물만 있으면 비압축성이라 η ≈ 1 일 것이다.'),
 ('필터 반경 r (0, 1, 2, 3 화소)','관 속 공기 방울 부피 (0, 1, 2, 4 mL)'),
 ('영상 잡음(HU), RMSE, CNR','출력 힘 F₂(저울 g 환산)와 효율 η = F₂/(F₁·A₂/A₁)'),
 ('팬텀 · 선량 · 창 수준 · 난수 시드','주사기 크기 · 입력 힘 · 관 길이 · 물 온도'),
 ('스마트폰 조도 앱(±5 %), 자(±1 mm), 파이썬 numpy','주방 저울(±1 g), 자(±1 mm), 눈금 주사기(±0.5 mL)'),
 ('r 대 RMSE 그래프, 이론(잡음 ∝ 1/(2r+1))과 비교','공기량 대 η 그래프, 이상 유압(η=1)과 비교'),
 ('실제 방사선 · 강자기장 미사용, 개인정보 없는 가상 영상만 사용','물 · 저압만 사용, 주사기에 바늘 금지, 바닥 물기 닦기, 보안경 착용'),
 ('1 주 자료 준비, 2 주 측정 · 코딩, 3 주 분석 / 역할 : 측정 · 코드 · 기록','1 주 재료 준비, 2 주 측정, 3 주 분석 / 역할 : 측정 · 기록 · 그래프'),
 ('연구계획서 (의료영상)','연구계획서 (유체)'),
]
for a,b in R:
    s=s.replace(a,b)

R2=[
 ('「더 좋은 유압 장치를 만들자」','「더 좋은 풍속계를 만들자」'),
 ('주사기 유압 장치의 효율 η — 공기 방울은 얼마나 손해인가','피토관 풍속계의 최소 신뢰 풍속 — 센서 분해능과 오차'),
 ('유압 관 속 공기 방울 부피를 늘리면 출력 힘 F₂ 와 효율 η 는 어떻게 변하는가?','센서 만점(FS)을 낮추면 낮은 풍속(3 m/s)의 풍속 분해능과 오차는 어떻게 변하는가?'),
 ('공기는 압축되어 부피가 변하므로(보일 법칙) 움직임이 낭비되어 η 가 줄 것이다. 물만 있으면 비압축성이라 η ≈ 1 일 것이다.','풍속은 압력의 제곱근이라 낮은 풍속일수록 압력 변화가 작아 분해능이 나빠질 것이다. FS 를 낮추면 1 카운트가 작은 압력이므로 개선될 것이다.'),
 ('관 속 공기 방울 부피 (0, 1, 2, 4 mL)','센서 만점 FS (0.5, 1, 2, 5 kPa)'),
 ('출력 힘 F₂(저울 g 환산)와 효율 η = F₂/(F₁·A₂/A₁)','풍속 분해능 δv 와 기준 풍속계 대비 오차'),
 ('주사기 크기 · 입력 힘 · 관 길이 · 물 온도','피토관 정렬 · 선풍기 거리 · 센서 영점 · 온도'),
 ('주방 저울(±1 g), 자(±1 mm), 눈금 주사기(±0.5 mL)','압력 센서(분해능 FS/1023), 기준 풍속계 앱(±0.5 m/s), 아두이노'),
 ('공기량 대 η 그래프, 이상 유압(η=1)과 비교','풍속 대 분해능 그래프, 이론 δv=δp/(ρv)와 비교'),
 ('물 · 저압만 사용, 주사기에 바늘 금지, 바닥 물기 닦기, 보안경 착용','저속 선풍기만 사용, 전원 5 V 이하, 회전체 접촉 금지, 연기는 환기'),
 ('연구계획서 (유체)','연구계획서 (베르누이)'),
]
for a,b in R2: s=s.replace(a,b)
# 식 카드 교체
NEW_EQ=('<p>비용 예산 $C=\\sum_k c_k\\le C_{\\lim}$. 시간 예산 : 팀 $n$ 명, 협업 효율 $\\varepsilon$ 일 때 $t=\\dfrac{W}{n\\,\\varepsilon}\\le t_{\\rm avail}$ ($W$ : 1인 기준 총 작업량). 필요한 인원은 $n\\ge \\dfrac{W}{\\varepsilon\\,t_{\\rm avail}}$ 입니다. 인원을 늘리면 $t$ 는 $1/n$ 보다 느리게 줄어듭니다($\\varepsilon<1$) — <b>비용과 시간의 거래</b>.</p>\n        <p class="lv-uni">교과서 밖 : 여러 제약이 있는 계획은 「실행 가능 영역」을 그리는 최적화 문제입니다. 목적함수(예 : 측정 점 개수)를 정하고 비용 · 시간 제약 아래서 최대로 만드는 선형계획으로 활동 조합을 찾아볼 수 있습니다.</p>')
s=re.sub(r'<p>질량 예산 \$M.*?</p>\s*<p class="lv-uni">.*?</p>',lambda m:NEW_EQ,s,flags=re.S)
code=r'''  <div class="card">
    <div class="h3">💻 ④ 시작 코드 — 복사해서 시작하고, 내 것으로 고치기 <span class="badge b-high">고등</span></div>
    <div class="goal">🎯 완성품이 아니라 <b>출발점</b>입니다. 핀 번호 · 보정값은 내 부품에 맞게 바꾸고 데이터시트와 라이브러리 문서를 확인하세요. 모든 활동은 <b>저속 바람 · 물 · 5 V 이하 저전압</b>이며 고압 공기 · 연소 · 가열 · 고속 회전체는 쓰지 않습니다.</div>
    <details class="code" open><summary>① 파이썬 — 피토관 풍속과 동압 (종합1 · R01 · I01)</summary>
      <button type="button" class="btn sm" data-copy="code-pit">📋 복사</button>
      <pre><code id="code-pit">import numpy as np
rho = 1.204                                      # 공기 밀도 (kg/m3) — 온도 · 고도로 보정
v   = np.array([3, 5, 7, 9, 11, 13.])            # 기준 풍속(m/s) — 내 측정값으로 바꾸기
dh  = np.array([0.6, 1.5, 3.1, 4.9, 7.3, 10.3])  # U자관 수주 높이차(mm)
dp  = dh * 1e-3 * 1000 * 9.8                     # Pa = rho_w g h
k = (v**2 * dp).sum() / (v**4).sum()             # dp = k v^2 (원점 통과 최소제곱)
print("k =", round(k, 3), " 이론 rho/2 =", rho/2)</code></pre>
    </details>
    <details class="code"><summary>② 파이썬 — 벤투리 압력 강하와 유량 (종합2 · R02 · I03)</summary>
      <button type="button" class="btn sm" data-copy="code-ven">📋 복사</button>
      <pre><code id="code-ven">import numpy as np
D1 = 0.02                                        # 입구 지름(m)
r  = np.array([1.5, 2.6, 3.7, 4.8, 5.9])         # 면적비 A1/A2
Q  = 0.1e-3                                      # 유량(m3/s) = 0.1 L/s
v1 = Q / (np.pi * D1**2 / 4)
dp = 0.5 * 1000 * v1**2 * (r**2 - 1)             # 이론 압력 강하(Pa)
print(np.round(dp / (1000 * 9.8) * 100, 1), "cm 수주")</code></pre>
    </details>
    <details class="code"><summary>③ 파이썬 — 날개 양력 계수 C_L (종합3 · R04)</summary>
      <button type="button" class="btn sm" data-copy="code-cl">📋 복사</button>
      <pre><code id="code-cl">import numpy as np
rho, S = 1.204, 0.03                              # 공기 밀도, 날개 면적(m2)
v = np.array([4, 6, 8, 10, 12, 14.])              # 풍속(m/s)
L = np.array([0.4, 0.9, 1.6, 2.5, 3.6, 4.9])      # 양력(N) = 저울 감소(kg) x 9.8
x = 0.5 * rho * v**2 * S                          # 동압 x 면적
CL = (x * L).sum() / (x * x).sum()                # L = CL * x (원점 통과 기울기)
print("C_L =", round(CL, 3))</code></pre>
    </details>
    <details class="code"><summary>④ 파이썬 — 토리첼리 도달 거리와 배수 시간 (R03 · R09)</summary>
      <button type="button" class="btn sm" data-copy="code-tor">📋 복사</button>
      <pre><code id="code-tor">import numpy as np
g, H = 9.8, 0.30                                  # 수면 높이 30 cm
h = np.array([0.04, 0.09, 0.15, 0.21, 0.26])      # 구멍 깊이(m)
x = 2 * 0.97 * np.sqrt(h * (H - h))               # 도달 거리(m)
A, a, Cd = np.pi * 0.04**2, np.pi * 0.0025**2, 0.62
T = (A / (Cd * a)) * np.sqrt(2 * 0.20 / g)        # 20 cm 수위가 빌 때까지 시간(s)
print(np.round(x * 100, 1), "cm   T =", round(T), "s")</code></pre>
    </details>
    <details class="code"><summary>⑤ 아두이노 — 차압 센서로 풍속 재기 (I01 · I10)</summary>
      <button type="button" class="btn sm" data-copy="code-ard">📋 복사</button>
      <pre><code id="code-ard">// 저압 차압 센서 + 피토관. 센서 사양서의 출력 범위 · 전원 전압 · 감도를 확인하세요(5 V 이하).
const int PIN = A0;
const float RHO = 1.204;
float zero = 0;                      // 바람 없을 때의 전압(영점)
const float SENS = 1.0;              // 감도 V/kPa — 사양서 값으로 바꾸기
void setup() { Serial.begin(115200); delay(500); zero = analogRead(PIN) * 5.0 / 1023.0; }
void loop() {
  float v = analogRead(PIN) * 5.0 / 1023.0 - zero;   // 전압 변화(V)
  float dp = max(0.0, v / SENS * 1000.0);            // 차압(Pa)
  float u = sqrt(2.0 * dp / RHO);                    // 풍속(m/s)
  Serial.print(dp, 1); Serial.print(','); Serial.println(u, 2);
  delay(200);
}</code></pre>
    </details>
    <details class="code"><summary>⑥ 파이썬 — 실속 경보기의 거짓 경보 확률 (I07)</summary>
      <button type="button" class="btn sm" data-copy="code-q">📋 복사</button>
      <pre><code id="code-q">from math import erfc, sqrt
Q = lambda x: 0.5 * erfc(x / sqrt(2))
sigma, bias, cruise, stall = 1.2, 0.0, 5.0, 15.0
for s in [8, 10, 12, 14]:
    fa = Q((s - cruise - bias) / sigma)           # 거짓 경보
    pd = Q((s - stall - bias) / sigma)            # 실속 검출
    print(s, f"거짓 {fa*100:.2f} %  검출 {pd*100:.1f} %")</code></pre>
    </details>
  </div>

  <div class="card">
    <div class="h3">🦺 ⑤ 안전 · 윤리 · 규정 점검표 <span class="badge b-poe">체크는 자동 저장</span></div>
    <div class="goal">🎯 <b>시작하기 전에</b> 모두 확인하세요. 학교 · 대회 규정은 시기에 따라 바뀌므로 지도교사와 규정집의 최신 안내를 따릅니다.</div>
    <div class="checklist" id="k14-safe"></div>
    <div class="row"><span class="tiny" id="k14-safemsg">0 / 0 확인</span></div>
  </div>

  <div class="card">
    <div class="h3">📚 ⑥ 더 찾아볼 곳 — 이름만 알려 드립니다(주소는 직접 검색)</div>
    <div class="steps">
      <div class="step"><b>한국</b> : 한국항공우주연구원(KARI) · 한국항공우주산업(KAI) · 한국기계연구원 · 기상청(풍속 · 보퍼트 풍력 계급) · 한국에너지공단(풍력) · 학교 R&amp;E · 영재학급 · 학생과학탐구대회.</div>
      <div class="step"><b>미국</b> : NASA Glenn(Beginner's Guide to Aeronautics — 양력 · 베르누이 설명) · FAA · NOAA · AIAA(항공우주학회) · 대학 풍동 공개 자료 · NSF.</div>
      <div class="step"><b>일본</b> : JAXA(우주항공연구개발기구) · 日本航空宇宙学会 · 鉄道総合技術研究所(RTRI, 철도 공력) · 気象庁(풍속 · 계급).</div>
      <div class="step"><b>국제</b> : ICAO(국제민간항공기구) · ISO 5167(차압식 유량 측정, 벤투리) · IEC 61400(풍력 터빈) · WMO(세계기상기구).</div>
      <div class="step"><b>이론</b> : 교과서 역학 · 유체(연속 방정식 · 베르누이) · 일과 에너지 · 통계(정규분포 · 확률) · 수학(회귀 · 오차 전파).</div>
      <div class="step"><b>특허</b> : 한국특허정보원 KIPRIS 에서 비슷한 발명을 검색해 「내 것의 새로운 점」을 정리합니다(발명 10선).</div>
    </div>
    <p class="tiny">※ 이 자료의 통계 · 연도 · 규모는 공개된 자료를 바탕으로 정리한 것이며 해마다 바뀔 수 있습니다. 활용 전 <b>반드시 공식 최신 자료</b>를 확인하세요.</p>
  </div>
</section>
'''
open('parts/t14.html','w',encoding='utf-8').write(s+code)
print('ok')
