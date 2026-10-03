# -*- coding: utf-8 -*-
"""탭 14 (연구 도구함) : parts/_t14_base.html → parts/t14.html , /tmp/hold2/c_t14.js 의 틀 → js/c_t14.js  (회전운동 · 토크)"""
import re, os
B=os.path.dirname(os.path.abspath(__file__))
# ───────────── HTML ─────────────
s=open(os.path.join(B,'parts/_t14_base.html'),encoding='utf-8').read()
R=[
 ('「더 좋은 영상 장치를 만들자」','「더 좋은 회전 장치를 만들자」'),
 ('🎯 부품을 켜고 끄며','🎯 활동을 켜고 끄며'),
 ('값은 시판 모듈의 <b>대표 어림값</b>이며 실제는 데이터시트와 측정으로 바꿔야 합니다.','값은 학교·문구점 재료의 <b>대표 어림값</b>이며 실제는 가격과 측정으로 바꿔야 합니다.'),
 ('모형 : 총 작업량(1인 기준)는 켜져 있는 부품의 대표 총 작업량(1인 기준)의 합, 동작 시간 = 0.8 × 용량 ÷ 총 작업량(1인 기준). 송신 · 서보 · 카메라는 순간 전류(피크)가 훨씬 크므로 전압 강하(리셋)도 따로 점검하세요(6번 탭). 비용 한도 350 g 은 「예시」이며 대회마다 다릅니다.','모형 : 총 작업량(1인 기준)은 켜져 있는 활동의 대표 작업 시간의 합, 팀 시간 = 작업량 ÷ (인원 × 0.8). 비용 한도 50 천 원은 「예시」이며 학교 · 대회마다 다릅니다.'),
 ('data-pngname="medimg-budget"','data-pngname="rotation-budget"'),
 ('📊 위 : 부품별 질량(누적 막대)과 비용 한도(빨간 선) · 아래 : 부품별 총 작업량(1인 기준)(누적 막대)와 쓸 수 있는 작업 시간에 맞는 한계 전류(초록 선). 선을 넘으면 설계를 고쳐야 합니다.','📊 위 : 활동별 비용(누적 막대)과 비용 한도(빨간 선) · 아래 : 활동별 팀 작업 시간(누적 막대)과 쓸 수 있는 시간(초록 선). 선을 넘으면 계획을 고쳐야 합니다.'),
 ('저선량에서도 선명한 영상 — 평균 필터의 최적 반경','손잡이를 길게 하면 문은 얼마나 쉽게 열릴까 — 토크 F ∝ 1/r 검증'),
 ('평균 필터 반경을 키우면 잡음과 경계 선명도는 어떻게 변하는가?','경첩에서 손잡이까지의 거리 r 을 2 배로 하면 문이 움직이기 시작하는 힘 F 는 어떻게 변하는가?'),
 ('반경이 커지면 잡음은 1/(2r+1) 로 줄지만 경계가 흐려질 것이다. 독립 잡음의 평균은 √N 으로 줄기 때문이다.','토크 τ = rF 가 일정해야 문이 열리므로 r 이 2 배면 F 는 1/2 이 될 것이다.'),
 ('필터 반경 r (0, 1, 2, 3 화소)','경첩에서 손잡이까지 거리 r (10, 30, 50, 70 cm)'),
 ('영상 잡음(HU), RMSE, CNR','문이 움직이기 시작하는 힘 F (N)'),
 ('팬텀 · 선량 · 창 수준 · 난수 시드','문 · 경첩 · 당기는 방향(직각) · 사람'),
 ('스마트폰 조도 앱(±5 %), 자(±1 mm), 파이썬 numpy','용수철 저울(±0.5 N), 자(±1 mm), 스프레드시트'),
 ('r 대 RMSE 그래프, 이론(잡음 ∝ 1/(2r+1))과 비교','F 대 1/r 그래프(원점을 지나는 직선), 기울기 = 필요 토크'),
 ('실제 방사선 · 강자기장 미사용, 개인정보 없는 가상 영상만 사용','문에 손이 끼지 않게 주의, 낮은 힘, 주변에 사람이 없을 때만'),
 ('1 주 자료 준비, 2 주 측정 · 코딩, 3 주 분석 / 역할 : 측정 · 코드 · 기록','1 주 재료 준비, 2 주 측정, 3 주 분석 / 역할 : 측정 · 기록 · 그래프'),
]
for a,b in R:
    assert a in s, a[:20]
    s=s.replace(a,b)
EQ=r'''<p>비용 예산 $C=\sum_k c_k\le C_{\lim}$. 시간 예산 : 팀 $n$ 명, 협업 효율 $\varepsilon$ 일 때 $t=\dfrac{W}{n\,\varepsilon}\le t_{\rm avail}$ ($W$ : 1인 기준 총 작업량). 필요한 인원은 $n\ge \dfrac{W}{\varepsilon\,t_{\rm avail}}$ 입니다. 인원을 늘려도 소통 손실 때문에 시간이 정확히 반으로 줄지는 않으며, 이는 <b>회전운동에서 토크를 더해도 관성 때문에 가속이 바로 늘지 않는 것</b>과 닮은 「효율」 문제입니다.</p>
        <p class="lv-uni">교과서 밖 : 제약이 여럿인 설계는 「실행 가능 영역」을 그리는 최적화 문제입니다. 목적함수(예 : 정확한 측정 개수)를 정하고 비용 · 시간 제약 아래서 최대로 만드는 선형계획으로 활동 조합을 찾아볼 수 있습니다.</p>'''
s2=re.sub(r'<p>질량 예산 \$M.*?</p>\s*<p class="lv-uni">.*?</p>',lambda m:EQ,s,flags=re.S)
assert s2!=s; s=s2
CODE=r'''
  <div class="card">
    <div class="h3">💻 ④ 시작 코드 — 복사해서 시작하고, 내 것으로 고치기 <span class="badge b-high">고등</span></div>
    <div class="goal">🎯 완성품이 아니라 <b>출발점</b>입니다. 핀 번호 · 보정값은 내 부품에 맞게 바꾸고 라이브러리 문서를 확인하세요. 모든 활동은 <b>낮은 속도 · 작은 질량 · 5 V 이하 저전압</b>이며 고속 회전체 · 고전압은 쓰지 않습니다.</div>
    <details class="code" open><summary>① 파이썬 — 토크 평형과 지렛대 직선 맞춤 (종합1 · R01 · R02)</summary>
      <button type="button" class="btn sm" data-copy="code-lev">📋 복사</button>
      <pre><code id="code-lev">import numpy as np
m1 = np.array([30, 60, 90, 120, 150, 180.])      # 왼쪽 질량(g) — 내 측정값으로 바꾸기
d2 = np.array([3.1, 6.2, 8.8, 12.1, 14.9, 18.2]) # 평형 거리 d2 (cm)
d1, m2 = 10.0, 100.0                             # 왼쪽 거리(cm), 오른쪽 추(g)
k = (m1 * d2).sum() / (m1**2).sum()              # d2 = k m1 (원점 통과 최소제곱)
print("기울기 k =", round(k, 4), " 이론 d1/m2 =", d1 / m2)</code></pre>
    </details>
    <details class="code"><summary>② 파이썬 — 도르래로 관성 모멘트 구하기 (종합1 · R03)</summary>
      <button type="button" class="btn sm" data-copy="code-pul">📋 복사</button>
      <pre><code id="code-pul">import numpy as np
g, m, r = 9.8, 0.050, 0.025                      # 추 질량(kg), 도르래 반지름(m)
h = 0.80                                         # 낙하 높이(m)
t = np.array([2.31, 2.28, 2.35, 2.30])           # 낙하 시간(s) — 4 회 측정
a = 2 * h / t.mean()**2                          # 가속도
I = m * r**2 * (g / a - 1)                       # m g - T = m a, T r = I a/r
print("a =", round(a, 3), "m/s2   I =", round(I * 1e4, 2), "x1e-4 kg m2")</code></pre>
    </details>
    <details class="code"><summary>③ 파이썬 — 구르기 가속도와 모양 계수 k (종합3 · R04 · C04)</summary>
      <button type="button" class="btn sm" data-copy="code-roll">📋 복사</button>
      <pre><code id="code-roll">import numpy as np
g, th = 9.8, np.radians(10)                      # 경사각 10도
L = 1.0                                          # 경사 길이(m)
for name, k in [("고리", 1.0), ("원판", 0.5), ("속 빈 공", 2/3), ("구슬", 0.4), ("미끄러짐", 0.0)]:
    a = g * np.sin(th) / (1 + k)
    t = np.sqrt(2 * L / a)
    print(f"{name:6s} k={k:.2f}  a={a:.3f} m/s2  내려오는 시간 {t:.2f} s")</code></pre>
    </details>
    <details class="code"><summary>④ 파이썬 — 각운동량 보존과 에너지 (종합2 · R05 · C03)</summary>
      <button type="button" class="btn sm" data-copy="code-ang">📋 복사</button>
      <pre><code id="code-ang">import numpy as np
I0, m = 1.2, 1.0                                 # 몸 관성 모멘트(kg m2), 아령 1 kg 두 개
r_out, r_in, w1 = 0.60, 0.15, 1.0                # 팔 벌림·오므림 거리(m), 처음 각속도(rad/s)
I1 = I0 + 2 * m * r_out**2
I2 = I0 + 2 * m * r_in**2
w2 = w1 * I1 / I2                                # L = I w 보존
W = 0.5 * I2 * w2**2 - 0.5 * I1 * w1**2         # 몸이 한 일
print("w2 =", round(w2, 2), "rad/s   K 증가 =", round(W, 2), "J")</code></pre>
    </details>
    <details class="code"><summary>⑤ 아두이노 — 홀 센서로 회전수 재기 (I03 · I10)</summary>
      <button type="button" class="btn sm" data-copy="code-ard">📋 복사</button>
      <pre><code id="code-ard">// 홀 센서 출력이 D2 로 들어온다. 센서 사양서의 전원(5 V 이하)을 확인하세요.
const int PIN = 2;
const int NMAG = 4;                       // 회전판에 붙인 자석 개수
const unsigned long WIN = 1000;           // 측정 창 T (ms)
volatile unsigned long cnt = 0;
void onPulse() { cnt++; }
void setup() { Serial.begin(115200); pinMode(PIN, INPUT); attachInterrupt(digitalPinToInterrupt(PIN), onPulse, FALLING); }
void loop() {
  cnt = 0; delay(WIN);
  float rpm = 60.0 * cnt / (NMAG * (WIN / 1000.0));
  Serial.print("rpm = "); Serial.println(rpm, 1);
  if (rpm >= 200) Serial.println("경고: 설정 회전수 초과");   // 교육용 경고 — 실제 안전장치 아님
}</code></pre>
    </details>
    <details class="code"><summary>⑥ 파이썬 — 비틀림 진자로 κ 구하기 (R07 · I02)</summary>
      <button type="button" class="btn sm" data-copy="code-tor">📋 복사</button>
      <pre><code id="code-tor">import numpy as np
m_d, R = 0.050, 0.05                             # 원판 질량(kg), 반지름(m)
Id = 0.5 * m_d * R**2
m = np.array([0.0, 0.010, 0.020, 0.030])         # 가장자리에 붙인 질량(kg, 2 개 합)
r = 0.04
I = Id + m * r**2
T = np.array([2.01, 2.55, 2.97, 3.36])           # 10 회 진동 시간 ÷ 10
T2 = T**2                                        # T^2 = 4 pi^2 I / kappa
slope = (I * T2).sum() / (I * I).sum()           # 원점 통과 기울기
print("kappa =", round(4 * np.pi**2 / slope * 1e3, 3), "mN m/rad")</code></pre>
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
      <div class="step"><b>한국</b> : 한국과학창의재단 · 국립과천과학관(회전 · 균형 전시) · 한국기계연구원 · 한국항공우주연구원(KARI, 위성 자세 제어) · 학교 R&amp;E · 영재학급 · 학생과학탐구대회.</div>
      <div class="step"><b>미국</b> : NASA(반작용 휠 · 모멘텀 휠 · 우주선 자세 제어 교육 자료) · NIST(토크 표준) · 대학 공개 강의(MIT OpenCourseWare 역학) · AAPT(미국물리교사협회) · NSF.</div>
      <div class="step"><b>일본</b> : JAXA(위성 자세 제어) · 日本物理学会 · 日本機械学会 · 産業技術総合研究所(AIST, 토크 표준) · 日本科学未来館.</div>
      <div class="step"><b>국제</b> : ISO 6789(토크 공구 시험), BIPM(국제도량형국, SI 단위 N·m) · IEC 62061(기계 안전 기능) · IOP(영국 물리학회) 교육 자료.</div>
      <div class="step"><b>이론</b> : 교과서 역학(토크 · 평형 · 각운동량) · 강체 회전 · 통계(회귀 · 오차 전파) · 샘플링 이론(착시).</div>
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
    ['문헌 · 공개 자료 조사',0,6,1], ['30 cm 자 · 줄자 · 각도기',3,1,1], ['동전 · 클립 · 추 세트',3,1,1], ['주방 저울(0.1 g)',15,1,1],
    ['용수철 저울(0 ~ 20 N)',10,1,1], ['도르래 · 줄 · 받침대',8,4,0], ['스마트폰 슬로 모션 영상 분석',0,6,0], ['5 V 모터 · 홀 센서 · 자석',25,8,0],
    ['측정 반복 · 기록',0,8,1], ['파이썬 · 스프레드시트 분석',0,8,1], ['전시 · 포스터 제작',10,6,0], ['안전 점검 · 지도교사 검토',0,2,1], ['보고서 · 발표 준비',2,8,1] ];'''
j=re.sub(r"  var PARTS=\[.*?\];",lambda m:PARTS,j,count=1,flags=re.S)
IDEA=r'''  var IDEA=[
    {k:'주제 영역', v:['토크 · 지렛대 평형','관성 모멘트 · 회전 가속도 τ=Iα','각운동량 보존 · 회전 의자','구르기 · 경사면 · 모양 계수 k','물리 진자 · 비틀림 진자','자이로 · 세차 운동','기어 · 축바퀴 · 일률 P=τω','원심력 · 마찰 · 한계 회전수']},
    {k:'기술 · 방법', v:['자 + 동전 + 저울','용수철 저울 + 문 · 렌치','도르래 + 스톱워치','스마트폰 슬로 모션 영상 분석','아두이노 + 홀 센서(5 V)','파이썬 시뮬레이션','스프레드시트 · 설문','회전 의자 + 보조자']},
    {k:'제약 조건', v:['예산 3 만 원 이하','손으로 돌리는 낮은 속도만 사용','2 주 안에 완성','측정 도구 3 종류만 사용','고속 회전체 · 고전압 금지','교실 안에서만','센서 전원 5 V 이하']},
    {k:'평가 지표', v:['토크 상대 오차(%)','관성 모멘트 이론 대비 차이','주기 · 각속도 재현성','센서 분해능 · 응답 시간','구르기 가속도 · 모양 계수 k','한계 회전수 이론 대비','재현성(반복 측정 표준편차)','설문 이해도 점수']}
  ];'''
j=re.sub(r"  var IDEA=\[.*?\n  \];",lambda m:IDEA,j,count=1,flags=re.S)
SAFE=r'''  var SAFE=[
    '<b>낮은 속도만</b> — 이 자료의 모든 회전 활동은 손으로 천천히 돌리는 수준이다. 높은 속도의 플라이휠 · 큰 모터를 단 회전체 · 고속 드릴은 쓰지 않는다. 한계 속도(예 : 300 rpm 이하)를 정해 둔다.',
    '<b>회전 의자 · 큰 바퀴</b> — 반드시 보조자 2 명과 함께, 바닥이 평평한 곳에서, 천천히 시작한다. 어지러우면 즉시 중단하고 의자를 잡아 준다.',
    '<b>아령 · 추</b> — 가벼운 것(2 kg 이하)부터 쓰고 던지거나 놓치지 않는다. 매다는 추 아래에는 사람이 없게 한다. 줄은 충분히 튼튼한 것을 쓴다.',
    '<b>덮개 · 손 끼임</b> — 돌아가는 바퀴 · 기어 · 체인에는 투명 덮개를 씌우고 손가락 · 머리카락 · 옷이 닿지 않게 한다.',
    '<b>전기 · 센서</b> — 5 V 이하 저전압만 쓰고 전지 단락 · 과열에 주의한다. 자석(네오디뮴)은 삼키지 않게 보관하고 전자 기기 가까이 두지 않는다.',
    '<b>스트로보 · 깜박임</b> — 광과민성 발작 위험이 있으므로 깜박임은 낮은 주파수(30 Hz 이하)로 짧게, 안내문을 붙이고 불편하면 즉시 끈다.',
    '<b>구슬 · 작은 부품</b> — 구슬 · 동전이 튀어 눈에 맞지 않게 바닥에 받침 · 투명 덮개를 쓰고 보안경을 쓴다.',
    '<b>정직한 보고</b> — 측정하지 않은 값을 측정한 것처럼 쓰지 않고, 오차 · 실패 · 한계를 그대로 적는다. 참고한 자료 · 코드의 출처를 쓴다.',
    '<b>안전 장치 주장 금지</b> — 만든 회전수 경고기 · 제동기 · 토크 렌치를 실제 안전 장비나 정밀 공구처럼 쓸 수 있다고 말하지 않는다. 「교육용 모형」임을 작품과 발표에 표기한다.',
    '<b>규정 · 최신성</b> — 통계 · 규정 수치는 해마다 바뀌므로 발표 전에 공식 최신 자료로 확인한다.'
  ];'''
j=re.sub(r"  var SAFE=\[.*?\n  \];",lambda m:SAFE,j,count=1,flags=re.S)
j=j.replace("연구계획서 (베르누이)","연구계획서 (회전운동 · 토크)").replace("bernoulli","rotation")
open(os.path.join(B,'js/c_t14.js'),'w',encoding='utf-8').write(j)
print('t14 ok')
