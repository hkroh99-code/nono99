# -*- coding: utf-8 -*-
import re
s=open('parts/_t14_base.html',encoding='utf-8').read()
R=[
 ('「더 좋은 영상 장치를 만들자」','「더 좋은 유압 장치를 만들자」'),
 ('🎯 부품을 켜고 끄며 <b>총 비용</b>이 한도 안인지, <b>동작 시간</b>이 임무 시간보다 긴지 확인하세요. 값은 시판 모듈의 <b>대표 어림값</b>이며 실제는 데이터시트와 측정으로 바꿔야 합니다.','🎯 활동을 켜고 끄며 <b>총 비용</b>이 한도 안인지, <b>팀 작업 시간</b>이 쓸 수 있는 시간 안인지 확인하세요. 값은 학교 실험실 · 문구점 기준 <b>대표 어림값</b>이며 실제 가격과 시간으로 바꿔야 합니다.'),
 ('모형 : 총 작업량(1인 기준)는 켜져 있는 부품의 대표 총 작업량(1인 기준)의 합, 동작 시간 = 0.8 × 용량 ÷ 총 작업량(1인 기준). 송신 · 서보 · 카메라는 순간 전류(피크)가 훨씬 크므로 전압 강하(리셋)도 따로 점검하세요(6번 탭). 비용 한도 350 g 은 「예시」이며 대회마다 다릅니다.','모형 : 총 작업량(1인 기준)은 켜진 활동의 어림 작업 시간의 합, 팀 작업 시간 = 총 작업량 ÷ (인원 × 0.8). 혼자(1 명)는 협업 손실이 없어 효율 1 로 계산합니다. 비용 한도 50 천 원은 「예시」이며 학교 · 대회마다 다릅니다. 사람 수를 늘려도 시간이 정확히 반이 되지 않음을 확인하세요.'),
 ('data-pngname="medimg-budget"','data-pngname="fluid-budget"'),
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
# 식 카드 교체
NEW_EQ=('<p>비용 예산 $C=\\sum_k c_k\\le C_{\\lim}$. 시간 예산 : 팀 $n$ 명, 협업 효율 $\\varepsilon$ 일 때 $t=\\dfrac{W}{n\\,\\varepsilon}\\le t_{\\rm avail}$ ($W$ : 1인 기준 총 작업량). 필요한 인원은 $n\\ge \\dfrac{W}{\\varepsilon\\,t_{\\rm avail}}$ 입니다. 인원을 늘리면 $t$ 는 $1/n$ 보다 느리게 줄어듭니다($\\varepsilon<1$) — <b>비용과 시간의 거래</b>.</p>\n        <p class="lv-uni">교과서 밖 : 여러 제약이 있는 계획은 「실행 가능 영역」을 그리는 최적화 문제입니다. 목적함수(예 : 측정 점 개수)를 정하고 비용 · 시간 제약 아래서 최대로 만드는 선형계획으로 활동 조합을 찾아볼 수 있습니다.</p>')
s=re.sub(r'<p>질량 예산 \$M.*?</p>\s*<p class="lv-uni">.*?</p>',lambda m:NEW_EQ,s,flags=re.S)
code=r'''  <div class="card">
    <div class="h3">💻 ④ 시작 코드 — 복사해서 시작하고, 내 것으로 고치기 <span class="badge b-high">고등</span></div>
    <div class="goal">🎯 완성품이 아니라 <b>출발점</b>입니다. 핀 번호 · 보정값은 내 부품에 맞게 바꾸고 데이터시트와 라이브러리 문서를 확인하세요. 모든 활동은 <b>물 · 저압</b>이며 고압 · 가열 · 가스는 쓰지 않습니다.</div>
    <details class="code" open><summary>① 파이썬 — 부력으로 액체 밀도 구하기 (종합1 · R01 · R02)</summary>
      <button type="button" class="btn sm" data-copy="code-rho">📋 복사</button>
      <pre><code id="code-rho">import numpy as np
V  = np.array([0, 20, 40, 60, 80, 100.])        # 잠긴 부피(mL) — 내 측정값으로 바꾸기
dm = np.array([0, 20, 41, 60, 82, 101.])        # 저울 읽음 감소(g)
slope = (V * dm).sum() / (V * V).sum()          # 원점 통과 최소제곱 기울기 (g/mL)
rho = slope * 1000                              # kg/m³
res = dm - slope * V
se = np.sqrt((res**2).sum() / (len(V) - 1) / (V**2).sum())
print(f"rho = {rho:.0f} ± {se*1000:.0f} kg/m3")</code></pre>
    </details>
    <details class="code"><summary>② 파이썬 — 주사기 유압 효율 η (종합2 · R04)</summary>
      <button type="button" class="btn sm" data-copy="code-eta">📋 복사</button>
      <pre><code id="code-eta">import numpy as np
d1, d2 = 10.0, 30.0                              # 내경(mm)
ratio = (d2 / d1) ** 2                           # 이론 면적비 A2/A1
F1 = np.array([1, 2, 3, 4, 5.])                  # 입력 힘(N) = 저울 g × 0.00981
F2 = np.array([8.1, 16.8, 25.0, 33.5, 41.0])     # 출력 힘(N)
k = (F1 * F2).sum() / (F1 * F1).sum()            # 기울기
print("기울기", round(k, 2), " 이론", ratio, " η =", round(k / ratio, 3))</code></pre>
    </details>
    <details class="code"><summary>③ 파이썬 — 압력-깊이 기울기 ρg (종합3 · R03 · I02)</summary>
      <button type="button" class="btn sm" data-copy="code-pg">📋 복사</button>
      <pre><code id="code-pg">import numpy as np
h = np.array([0, 5, 10, 15, 20, 25.]) / 100      # 깊이(m)
p = np.array([0, 0.5, 1.0, 1.5, 2.0, 2.5]) * 1e3 # 게이지압(Pa)
g = 9.80
slope = (h * p).sum() / (h * h).sum()
print("rho =", slope / g, "kg/m3")</code></pre>
    </details>
    <details class="code"><summary>④ 파이썬 — 보일 법칙 pV=일정 (R05 · 카르테시안 잠수부 R10)</summary>
      <button type="button" class="btn sm" data-copy="code-boyle">📋 복사</button>
      <pre><code id="code-boyle">p0 = 101.3e3                       # 대기압(Pa)
rho, g = 998.0, 9.80
for h in [0, 0.5, 1, 2, 5]:        # 물 깊이(m)
    p = p0 + rho * g * h
    print(f"{h:4.1f} m  p={p/1e3:6.1f} kPa  부피비 V/V0={p0/p:.3f}")</code></pre>
    </details>
    <details class="code"><summary>⑤ 아두이노 — 저가 압력센서로 수심 재기 (I02 · 선택)</summary>
      <button type="button" class="btn sm" data-copy="code-ard">📋 복사</button>
      <pre><code id="code-ard">// 저압(0~40 kPa) 아날로그 압력센서 + 튜브. 센서 사양서의 출력 범위와 전원 전압을 확인하세요.
const int PIN = A0;
const float P0V = 0.5, P1V = 4.5;     // 0 kPa, 최대압에서의 출력 전압(사양서 값으로 바꾸기)
const float PMAX = 40.0;              // kPa
void setup() { Serial.begin(115200); }
void loop() {
  float v = analogRead(PIN) * 5.0 / 1023.0;
  float p = (v - P0V) / (P1V - P0V) * PMAX;     // kPa (게이지)
  float h = p * 1000.0 / (998.0 * 9.80);        // 수심(m) = p/(ρg)
  Serial.print(p, 2); Serial.print(','); Serial.println(h, 3);
  delay(200);
}</code></pre>
    </details>
    <details class="code"><summary>⑥ 파이썬 — 배의 흘수와 GM (R06 · R07)</summary>
      <button type="button" class="btn sm" data-copy="code-ship">📋 복사</button>
      <pre><code id="code-ship">L, B, rho = 0.20, 0.10, 1000.0      # 상자형 배 길이·폭(m), 물 밀도
m, KG = 0.30, 0.04                  # 질량(kg), 무게중심 높이(m)
d  = m / (rho * L * B)              # 흘수
KB = d / 2
BM = B**2 / (12 * d)
GM = KB + BM - KG
print(f"흘수 {d*100:.1f} cm, GM = {GM*100:.1f} cm ->", "안정" if GM > 0 else "불안정")</code></pre>
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
      <div class="step"><b>한국</b> : 한국해양과학기술원(KIOST) · 한국해양진흥공사(KOBC) · 한국조선해양플랜트협회 · 한국수력원자력 · 한국기계연구원(유압 · 구동) · 행정안전부 · 해양경찰청(구명 · 안전) · 학교 R&amp;E · 영재학급 · 학생과학탐구대회.</div>
      <div class="step"><b>미국</b> : NOAA(수심 · 조석) · WHOI(Woods Hole 해양연구소 · 심해 잠수정 Alvin) · U.S. Coast Guard(구명조끼 승인 기준) · NASA Neutral Buoyancy Lab · ASME(유압 · 압력용기 규격) · NSF.</div>
      <div class="step"><b>일본</b> : JAMSTEC(해양연구개발기구, 유인잠수정 「신카이 6500」 · 지구심부탐사선) · 国土交通省(조선 · 해사) · 日本機械学会 · 日本フルードパワーシステム学会.</div>
      <div class="step"><b>국제</b> : ISO 12402(구명동의 규격) · IMO(국제해사기구, 선박 복원성 규정) · ISO 4413(유압 안전) · BIPM(SI 단위, 압력 Pa).</div>
      <div class="step"><b>이론</b> : 교과서 역학 · 유체(정수압, 파스칼, 아르키메데스) · 열 · 기체 법칙(보일) · 수학(선형회귀 · 오차 전파).</div>
      <div class="step"><b>특허</b> : 한국특허정보원 KIPRIS 에서 비슷한 발명을 검색해 「내 것의 새로운 점」을 정리합니다(발명 10선).</div>
    </div>
    <p class="tiny">※ 이 자료의 통계 · 연도 · 규모는 공개된 자료를 바탕으로 정리한 것이며 해마다 바뀔 수 있습니다. 활용 전 <b>반드시 공식 최신 자료</b>를 확인하세요.</p>
  </div>
</section>
'''
open('parts/t14.html','w',encoding='utf-8').write(s+code)
print('ok')
