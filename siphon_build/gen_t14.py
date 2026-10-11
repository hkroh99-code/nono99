# -*- coding: utf-8 -*-
"""탭 14 (연구 도구함) : parts/_t14_base.html → parts/t14.html , /tmp/hold2/c_t14.js 의 틀 → js/c_t14.js  (사이펀)"""
import re, os
B=os.path.dirname(os.path.abspath(__file__))
# ───────────── HTML ─────────────
s=open(os.path.join(B,'parts/_t14_base.html'),encoding='utf-8').read()
R=[
 ('「더 좋은 영상 장치를 만들자」','「더 좋은 사이펀을 만들자」'),
 ('🎯 부품을 켜고 끄며','🎯 활동을 켜고 끄며'),
 ('값은 시판 모듈의 <b>대표 어림값</b>이며 실제는 데이터시트와 측정으로 바꿔야 합니다.','값은 학교·문구점 재료의 <b>대표 어림값</b>이며 실제는 가격과 측정으로 바꿔야 합니다.'),
 ('모형 : 총 작업량(1인 기준)는 켜져 있는 부품의 대표 총 작업량(1인 기준)의 합, 동작 시간 = 0.8 × 용량 ÷ 총 작업량(1인 기준). 송신 · 서보 · 카메라는 순간 전류(피크)가 훨씬 크므로 전압 강하(리셋)도 따로 점검하세요(6번 탭). 비용 한도 350 g 은 「예시」이며 대회마다 다릅니다.','모형 : 총 작업량(1인 기준)은 켜져 있는 활동의 대표 작업 시간의 합, 팀 시간 = 작업량 ÷ (인원 × 0.8). 비용 한도 50 천 원은 「예시」이며 학교 · 대회마다 다릅니다.'),
 ('data-pngname="medimg-budget"','data-pngname="siphon-budget"'),
 ('📊 위 : 부품별 질량(누적 막대)과 비용 한도(빨간 선) · 아래 : 부품별 총 작업량(1인 기준)(누적 막대)와 쓸 수 있는 작업 시간에 맞는 한계 전류(초록 선). 선을 넘으면 설계를 고쳐야 합니다.','📊 위 : 활동별 비용(누적 막대)과 비용 한도(빨간 선) · 아래 : 활동별 팀 작업 시간(누적 막대)과 쓸 수 있는 시간(초록 선). 선을 넘으면 계획을 고쳐야 합니다.'),
 ('저선량에서도 선명한 영상 — 평균 필터의 최적 반경','호스 지름과 유량 — 지름을 2 배로 하면 유량은 몇 배가 될까'),
 ('평균 필터 반경을 키우면 잡음과 경계 선명도는 어떻게 변하는가?','같은 높이차에서 호스 지름 D 를 6 mm 에서 12 mm 로 2 배로 하면 유량 Q 는 몇 배가 되는가?'),
 ('반경이 커지면 잡음은 1/(2r+1) 로 줄지만 경계가 흐려질 것이다. 독립 잡음의 평균은 √N 으로 줄기 때문이다.','단면적이 D² 에 비례하므로 이상적으로는 4 배이지만 마찰이 커서 약 3 배에 그칠 것이다.'),
 ('필터 반경 r (0, 1, 2, 3 화소)','호스 지름 D (4, 6, 8, 12, 16 mm)'),
 ('영상 잡음(HU), RMSE, CNR','유량 Q (mL/s) = 부피 ÷ 시간'),
 ('팬텀 · 선량 · 창 수준 · 난수 시드','높이차 50 cm · 호스 길이 1 m · 수온 · 위 통 수위'),
 ('스마트폰 조도 앱(±5 %), 자(±1 mm), 파이썬 numpy','눈금 통(±5 mL), 스톱워치(±0.3 s), 줄자(±1 mm)'),
 ('r 대 RMSE 그래프, 이론(잡음 ∝ 1/(2r+1))과 비교','D 대 Q 로그–로그 그래프의 기울기(지수)와 이론(2 ~ 4)을 비교'),
 ('실제 방사선 · 강자기장 미사용, 개인정보 없는 가상 영상만 사용','물 · 상온만 사용, 입으로 빨지 않고 주사기로 시동, 바닥 물기 닦기'),
 ('1 주 자료 준비, 2 주 측정 · 코딩, 3 주 분석 / 역할 : 측정 · 코드 · 기록','1 주 재료 준비, 2 주 측정, 3 주 분석 / 역할 : 측정 · 기록 · 그래프'),
]
for a,b in R:
    assert a in s, a[:20]
    s=s.replace(a,b)
EQ=r'''<p>비용 예산 $C=\sum_k c_k\le C_{\lim}$. 시간 예산 : 팀 $n$ 명, 협업 효율 $\varepsilon$ 일 때 $t=\dfrac{W}{n\,\varepsilon}\le t_{\rm avail}$ ($W$ : 1인 기준 총 작업량). 필요한 인원은 $n\ge \dfrac{W}{\varepsilon\,t_{\rm avail}}$ 입니다. 인원을 늘려도 소통 손실 때문에 시간이 정확히 반으로 줄지는 않으며, 이는 <b>관을 굵게 해도 마찰 때문에 유량이 단면적 비만큼 늘지 않는 것</b>과 닮은 「효율」 문제입니다.</p>
        <p class="lv-uni">교과서 밖 : 제약이 여럿인 설계는 「실행 가능 영역」을 그리는 최적화 문제입니다. 목적함수(예 : 정확한 측정 개수)를 정하고 비용 · 시간 제약 아래서 최대로 만드는 선형계획으로 활동 조합을 찾아볼 수 있습니다.</p>'''
s2=re.sub(r'<p>질량 예산 \$M.*?</p>\s*<p class="lv-uni">.*?</p>',lambda m:EQ,s,flags=re.S)
assert s2!=s; s=s2
CODE=r'''
  <div class="card">
    <div class="h3">💻 ④ 시작 코드 — 복사해서 시작하고, 내 것으로 고치기 <span class="badge b-high">고등</span></div>
    <div class="goal">🎯 완성품이 아니라 <b>출발점</b>입니다. 핀 번호 · 보정값은 내 부품에 맞게 바꾸고 라이브러리 문서를 확인하세요. 모든 활동은 <b>물 · 상온 · 5 V 이하 저전압</b>이며 가열 · 고압 · 연료 · 약품은 쓰지 않습니다.</div>
    <details class="code" open><summary>① 파이썬 — 높이차와 유량 : Q 대 √h 직선 맞춤 (종합1 · R01)</summary>
      <button type="button" class="btn sm" data-copy="code-q">📋 복사</button>
      <pre><code id="code-q">import numpy as np
g, D = 9.8, 0.010                                 # 호스 지름(m)
h = np.array([10, 25, 40, 55, 70, 85.]) / 100     # 높이차(m) — 내 측정값으로 바꾸기
t = np.array([48, 31, 24, 21, 18.5, 17])          # 500 mL 받는 시간(s)
Q = 500e-6 / t                                    # 유량(m3/s)
x = np.sqrt(h)
k = (x * Q).sum() / (x * x).sum()                 # Q = k sqrt(h) (원점 통과 최소제곱)
A = np.pi * D**2 / 4
K = 2 * g * A**2 / k**2                           # Q = A sqrt(2 g h / K)
print("k =", k, " 총 손실 계수 K =", round(K, 2))</code></pre>
    </details>
    <details class="code"><summary>② 파이썬 — 배수 시간과 K (종합2 · R04)</summary>
      <button type="button" class="btn sm" data-copy="code-t">📋 복사</button>
      <pre><code id="code-t">import numpy as np
g = 9.8
D = 0.010; a = np.pi * D**2 / 4                   # 호스 단면적
At = np.array([100, 200, 300, 450, 600, 800.]) * 1e-4   # 통 단면적(m2)
T = np.array([62, 121, 181, 270, 363, 485.])      # 배수 시간(s) — 내 측정값
h0 = 0.25                                         # 처음 수위차(m)
x = (At / a) * np.sqrt(2 * h0 / g)                # T = sqrt(K) x
s = (x * T).sum() / (x * x).sum()
print("sqrt(K) =", round(s, 3), " K =", round(s**2, 2))</code></pre>
    </details>
    <details class="code"><summary>③ 파이썬 — 가는 관 유량으로 물의 점성 μ (종합3 · I09)</summary>
      <button type="button" class="btn sm" data-copy="code-mu">📋 복사</button>
      <pre><code id="code-mu">import numpy as np
rho, g, L = 1000.0, 9.8, 0.5                      # 밀도, 중력, 관 길이(m)
D = np.array([1.5, 2.0, 2.5, 3.0]) * 1e-3         # 지름(m)
h = np.array([0.30, 0.40, 0.50, 0.40])            # 높이차(m)
Q = np.array([0.52, 1.40, 3.1, 4.2]) * 1e-6       # 유량(m3/s) — 내 측정값
x = rho * g * h * D**4 / L * np.pi / 128          # Q = x / mu
mu = (x * x).sum() / (x * Q).sum()
print("mu =", round(mu * 1e3, 3), "mPa s (물 20 C 약 1.0)")</code></pre>
    </details>
    <details class="code"><summary>④ 파이썬 — 레이놀즈 수와 마찰 계수 (R02 · R03)</summary>
      <button type="button" class="btn sm" data-copy="code-re">📋 복사</button>
      <pre><code id="code-re">import numpy as np
rho, mu, D = 1000.0, 1.0e-3, 0.010
v = np.array([0.1, 0.3, 0.6, 1.0, 2.0])
Re = rho * v * D / mu
f = np.where(Re < 2300, 64 / Re, 0.316 * Re**-0.25)   # 층류 / 난류(매끈한 관)
for r, ff in zip(Re, f): print(int(r), round(ff, 4), "층류" if r < 2300 else "난류")</code></pre>
    </details>
    <details class="code"><summary>⑤ 아두이노 — 수위 전극으로 저수위 경보 (I04)</summary>
      <button type="button" class="btn sm" data-copy="code-ard">📋 복사</button>
      <pre><code id="code-ard">// 5 V 이하 · 전극은 스테인리스, 전기 부품은 물에서 멀리 두고 방수하세요.
const int PIN = A0, LED = 13;
const int THRESH = 300;                // 전극이 물에 닿으면 값이 커진다 — 직접 보정
unsigned long lowSince = 0;
void setup() { pinMode(LED, OUTPUT); Serial.begin(115200); }
void loop() {
  int v = analogRead(PIN);
  bool low = v < THRESH;               // 수위가 전극 아래로 내려감
  if (low) { if (lowSince == 0) lowSince = millis(); } else lowSince = 0;
  digitalWrite(LED, (low && millis() - lowSince > 500) ? HIGH : LOW);   // 0.5 초 지속될 때만 경보
  Serial.println(v); delay(100);
}</code></pre>
    </details>
    <details class="code"><summary>⑥ 파이썬 — 간헐 샘 주기 (C06)</summary>
      <button type="button" class="btn sm" data-copy="code-p">📋 복사</button>
      <pre><code id="code-p">import numpy as np
A, dh, Qout = 100.0, 7.0, 40.0                    # cm2, cm, mL/s
Qin = np.array([3, 5, 10, 15, 20, 30.])
T = A * dh / Qin + A * dh / (Qout - Qin)          # 채움 + 배출
for q, t in zip(Qin, T): print(q, "mL/s ->", round(t), "s")</code></pre>
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
      <div class="step"><b>한국</b> : 한국농어촌공사(수로 · 관개) · 한국수자원공사(K-water) · 한국건설기술연구원 · 학교 R&amp;E · 영재학급 · 학생과학탐구대회 · 국립과천과학관.</div>
      <div class="step"><b>미국</b> : USGS Water Science School(물과 흐름 교육 자료) · 미국 개척국(USBR) 수리 설계 자료 · ASCE · AAPT · NSF.</div>
      <div class="step"><b>일본</b> : 国土交通省(河川 · 下水道 지침) · 農林水産省(농업용수 설계기준) · 日本機械学会 · 日本科学未来館.</div>
      <div class="step"><b>국제</b> : ISO 5167(차압식 유량 측정) · ISO 6358 등 유체 규격 · IAHR(국제수리학회) · WHO(안전한 물).</div>
      <div class="step"><b>이론</b> : 교과서 유체 · 압력 · 베르누이 · 점성(하겐–푸아죄유) · 통계(회귀 · 오차 전파).</div>
      <div class="step"><b>특허</b> : 한국특허정보원 KIPRIS 에서 비슷한 발명을 검색해 「내 것의 새로운 점」을 정리합니다(발명 10선).</div>
    </div>
    <p class="tiny">※ 이 자료의 통계 · 연도 · 규모는 공개된 자료를 바탕으로 정리한 것이며 해마다 바뀔 수 있습니다. 활용 전 <b>반드시 공식 최신 자료</b>를 확인하세요.</p>
  </div>
</section>
'''
open(os.path.join(B,'parts/t14.html'),'w',encoding='utf-8').write(s+CODE)

# ───────────── JS ─────────────
j=open('/tmp/hold2/c_t14.js',encoding='utf-8').read() if os.path.exists('/tmp/hold2/c_t14.js') else open(os.path.join(B,'js/c_t14.js'),encoding='utf-8').read()
PARTS=r'''  var PARTS=[ // [이름, 비용 천 원, 작업량 시간(1인), 기본 켜짐]
    ['문헌 · 공개 자료 조사',0,6,1], ['투명 호스 · 연결 부품',8,2,1], ['양동이 · 통 2 개',6,1,1], ['눈금 통 · 메스실린더',5,1,1],
    ['스톱워치 · 줄자',3,1,1], ['주사기 · 손펌프(시동용)',3,1,0], ['5 V 보드 · 수위 전극 · LED(선택)',15,8,0], ['설탕 · 색소 · 온도계(선택)',4,2,0],
    ['측정 반복 · 기록',0,8,1], ['파이썬 · 스프레드시트 분석',0,8,1], ['전시 · 포스터 제작',10,6,0], ['안전 점검 · 지도교사 검토',0,2,1], ['보고서 · 발표 준비',2,8,1] ];'''
j=re.sub(r"  var PARTS=\[.*?\];",lambda m:PARTS,j,count=1,flags=re.S)
IDEA=r'''  var IDEA=[
    {k:'주제 영역', v:['높이차와 유속 v = √(2gh)','정점 압력과 최대 높이','마찰 · 층류와 난류 · 점성','배수 시간과 수위 곡선','두 통의 평형 · 부피 보존','마리오트 병 · 정유량','간헐 샘 · 문턱과 되먹임','시동 · 정지 · 안전']},
    {k:'기술 · 방법', v:['투명 호스 + 눈금 통 + 스톱워치','스마트폰 슬로 모션 · 타임랩스','마노미터(투명 빨대)','주사기 시동','파이썬 시뮬레이션','스프레드시트 · 설문','5 V 수위 전극 + 보드','색소 · 눈금자 수위 읽기']},
    {k:'제약 조건', v:['예산 3 만 원 이하','물 · 상온(60 °C 이하)만 사용','2 주 안에 완성','측정 도구 3 종류만 사용','입으로 빨기 · 가열 · 연료 · 약품 금지','교실 안에서만','센서 전원 5 V 이하']},
    {k:'평가 지표', v:['유량 상대 오차(%)','이론 곡선과의 차이','배수 시간 · 주기 재현성','손실 계수 K','점성 μ 오차','안전 여유 Q_out/Q_in','재현성(반복 측정 표준편차)','설문 이해도 점수']}
  ];'''
j=re.sub(r"  var IDEA=\[.*?\n  \];",lambda m:IDEA,j,count=1,flags=re.S)
SAFE=r'''  var SAFE=[
    '<b>입으로 빨지 않는다</b> — 사이펀 시동은 주사기 · 손펌프 · 물에 담가 채우기로 한다. 입으로 빨면 오염된 액체(연료 · 약품)를 삼킬 위험이 있다. 연료 · 약품은 사이펀으로 옮기지 않는다.',
    '<b>물 · 상온만</b> — 이 자료의 모든 활동은 상온의 맑은 물이다. 60 °C 를 넘는 물 · 가열 · 고압 · 연소 · 화학약품은 쓰지 않는다. 설탕물은 먹지 않는다.',
    '<b>물 · 미끄럼</b> — 바닥에 물기가 없게 쟁반 · 수건을 깔고 쏟으면 바로 닦는다. 큰 통(10 L 이상)은 보조자와 함께 옮긴다.',
    '<b>전기 · 센서</b> — 5 V 이하 저전압만 쓰고 전자 부품은 물에서 멀리 둔다. 젖은 손으로 만지지 않고 방수 처리를 한다.',
    '<b>헤론 분수 · 밀폐 병</b> — 병이 터지지 않게 저압(높이차 1 m 이하)으로만 하고 보호안경 · 보호자 동반.',
    '<b>높은 곳 · 무거운 물</b> — 위 통을 높이 올릴 때는 안정된 받침 위에 두고 낙하에 주의한다.',
    '<b>위생</b> — 탁한 물 · 오염된 물은 마시지 않는다. 정수기 모형의 물은 먹지 않는다.',
    '<b>정직한 보고</b> — 측정하지 않은 값을 측정한 것처럼 쓰지 않고, 오차 · 실패 · 한계를 그대로 적는다. 참고한 자료 · 코드의 출처를 쓴다.',
    '<b>안전 장치 주장 금지</b> — 만든 경보기 · 수위 상한 · 배수 사이펀을 실제 침수 방지 · 안전 장비처럼 쓸 수 있다고 말하지 않는다. 「교육용 모형」임을 작품과 발표에 표기한다.',
    '<b>규정 · 최신성</b> — 통계 · 규정 수치는 해마다 바뀌므로 발표 전에 공식 최신 자료로 확인한다.'
  ];'''
j=re.sub(r"  var SAFE=\[.*?\n  \];",lambda m:SAFE,j,count=1,flags=re.S)
j=j.replace("연구계획서 (베르누이)","연구계획서 (사이펀)").replace("bernoulli","siphon")
open(os.path.join(B,'js/c_t14.js'),'w',encoding='utf-8').write(j)
print('t14 ok')
