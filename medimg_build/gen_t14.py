# -*- coding: utf-8 -*-
import re
L=open('parts/t14.html',encoding='utf-8').read().split('\n')
head='\n'.join(L[:104])   # 1..104 (카드 ①~③)
tail_safe='\n'.join(L[249:256])  # safety card lines 250..256 (index 249..)
s=head
rep=[
 ('공방 ⑦ 연구 도구함','공방 ⑦ 연구 도구함'),
 ('프로젝트를 시작할 때 필요한 <b>도구 다섯 가지</b>를 한곳에 모았습니다.','프로젝트를 시작할 때 필요한 <b>도구</b>를 한곳에 모았습니다.'),
 ('「더 좋은 캔위성을 만들자」는 연구가 아니라 소망입니다.','「더 좋은 영상 장치를 만들자」는 연구가 아니라 소망입니다.'),
 ('질량 · 전력 예산 계산기','비용 · 시간 예산 계산기'),
 ('질량 · 전력 예산','비용 · 시간 예산'),
 ('질량 한도 (대회 규정에서 확인)','비용 한도 (학교 · 대회 규정에서 확인)'),
 ('질량 한도','비용 한도'),
 ('필요한 동작 시간 (대기 + 비행 + 회수)','쓸 수 있는 작업 시간 (준비 + 제작 + 측정 + 정리)'),
 ('필요한 동작 시간','쓸 수 있는 작업 시간'),
 ('배터리 용량 고르기','팀 규모 고르기'),
 ('배터리 :','팀 규모 :'),
 ('250 mAh · 7 g','1 명(혼자)'),('500 mAh · 13 g','2 명'),('1000 mAh · 24 g','4 명'),
 ('부품 목록','활동 목록'),
 ('총 질량','총 비용'),('질량 여유','비용 여유'),('평균 전류','총 작업량(1인 기준)'),('동작 시간 (용량 × 0.8)','팀 작업 시간 (작업량 ÷ 인원 ÷ 0.8)'),('예산(대략)','시간 여유'),
 ('질량 예산과 전류 예산 막대 그래프','비용 예산과 시간 예산 막대 그래프'),
 ('부품별 질량(누적 막대)과 질량 한도(빨간 선) · 아래 : 부품별 평균 전류(누적 막대)와 필요한 동작 시간에 맞는 한계 전류(초록 선). 선을 넘으면 설계를 고쳐야 합니다.','활동별 비용(누적 막대)과 비용 한도(빨간 선) · 아래 : 활동별 작업 시간(누적 막대)과 쓸 수 있는 시간에 맞는 한계(초록 선). 선을 넘으면 계획을 고쳐야 합니다.'),
 ('cansat-budget','medimg-budget'),
 ('센서 잡음에 강한 낙하산 자동 전개 규칙','저선량에서도 선명한 영상 — 평균 필터의 최적 반경'),
 ('연속 판정 횟수 N 을 늘리면 조기 전개 비율과 평균 지연은 어떻게 변하는가?','평균 필터 반경을 키우면 잡음과 경계 선명도는 어떻게 변하는가?'),
 ('N 이 커지면 조기 전개는 줄고 지연은 늘 것이다. 잡음이 독립이면 연속 N 회 확률이 p^N 이기 때문이다.','반경이 커지면 잡음은 1/(2r+1) 로 줄지만 경계가 흐려질 것이다. 독립 잡음의 평균은 √N 으로 줄기 때문이다.'),
 ('연속 횟수 N (1, 3, 5, 8)','필터 반경 r (0, 1, 2, 3 화소)'),
 ('전개 고도 오차(m), 조기 전개 비율(%)','영상 잡음(HU), RMSE, CNR'),
 ('기준 고도 · 낙하 속도 · 센서 · 표본율','팬텀 · 선량 · 창 수준 · 난수 시드'),
 ('BMP280(±1 m), 스톱워치(±0.05 s)','스마트폰 조도 앱(±5 %), 자(±1 mm), 파이썬 numpy'),
 ('N 대 조기 전개 비율 그래프, 이론 p^N 과 비교','r 대 RMSE 그래프, 이론(잡음 ∝ 1/(2r+1))과 비교'),
 ('낮은 높이에서 시험, 전지 보호회로, 낙하 구역 통제','실제 방사선 · 강자기장 미사용, 개인정보 없는 가상 영상만 사용'),
 ('1 주 측정 준비, 2 주 시험, 3 주 분석 / 역할 : 센서 · 코드 · 기록','1 주 자료 준비, 2 주 측정 · 코딩, 3 주 분석 / 역할 : 측정 · 코드 · 기록'),
 ('연구계획서 (캔위성)','연구계획서 (의료영상)'),
]
for a,b in rep: s=s.replace(a,b)
# 발상기 설명, 안내문, 부분 문구 정리
s=s.replace('임무 · 기술 · 제약 · 평가를 섞어','주제 · 방법 · 제약 · 평가를 섞어')
s=re.sub(r'<p class="tiny">모형 : 평균 전류는.*?</p>','<p class="tiny">모형 : 활동별 비용 · 작업량(시간)은 <b>예시 어림값</b>입니다. 팀 작업 시간 = 총 작업량 ÷ 인원 ÷ 0.8(협업 효율). 한도는 학교 · 대회 규정에 맞게 바꾸세요. 실제 방사선 · 강자기장 장비는 이 자료의 어떤 활동에서도 쓰지 않습니다.</p>',s,flags=re.S)
s=re.sub(r'data-hints="[^"]*"','data-hints="① 처음 켜진 활동만으로 비용과 시간을 읽어 보세요. 판정이 통과인가요?||② 「Arduino 초음파 센서」를 켜 보세요. 비용과 작업 시간은 어떻게 변하나요?||③ 팀 규모를 2 명에서 4 명으로 늘려 보세요. 시간은 정확히 절반이 되나요(협업 효율 0.8)?||④ 비용 한도를 줄여 가며 어떤 활동을 먼저 빼야 연구 질문에 영향이 가장 적을지 토론하세요."',s,count=1,flags=re.S)
# POE 교체
s=re.sub(r'<div class="poe" data-q="배터리를.*?data-exp="[^"]*"></div>','<div class="poe" data-q="같은 일을 혼자 하면 10 시간 걸린다. 4 명이 나누어 하면 걸리는 시간은? (협업 효율 0.8 가정)"\n         data-opts="2.5 시간||약 3.1 시간||5 시간||10 시간"\n         data-ans="1"\n         data-exp="이상적으로는 10 ÷ 4 = 2.5 시간이지만 소통 · 대기 · 합치기에 드는 시간 때문에 효율 0.8 이면 10 ÷ (4×0.8) ≈ <b>3.1 시간</b>입니다. 사람 수를 늘린다고 시간이 정확히 반으로 줄지 않으며, 계획을 짤 때 이 손실을 넣어야 합니다. 아래 계산기에서 확인하세요."></div>',s,flags=re.S)
code=r'''  <div class="card">
    <div class="h3">💻 ④ 시작 코드 — 복사해서 시작하고, 내 것으로 고치기 <span class="badge b-high">고등</span></div>
    <div class="goal">🎯 완성품이 아니라 <b>출발점</b>입니다. 핀 번호 · 주소는 내 부품에 맞게 바꾸고 데이터시트와 라이브러리 문서를 확인하세요. 모든 코드는 <b>방사선 · 강자기장이 없는 안전한 실험</b>(빛 · 공기 중 초음파 · 가상 영상)용입니다.</div>
    <details class="code" open><summary>① HC-SR04 초음파 거리 측정 (아두이노 · R04 · R05 · R07)</summary>
      <button type="button" class="btn sm" data-copy="code-hcsr">📋 복사</button>
      <pre><code id="code-hcsr">const int TRIG = 9, ECHO = 10;
float Tair = 20.0;                         // 기온(℃) — 음속 보정용

void setup() { Serial.begin(115200); pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT); }

void loop() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  unsigned long us = pulseIn(ECHO, HIGH, 30000);        // 왕복 시간(μs), 30 ms 초과 시 0
  float c = 331.3 + 0.606 * Tair;                       // 음속(m/s)
  float d = us * 1e-6 * c / 2.0 * 100.0;                // 거리(cm) = c·t/2
  Serial.print(us); Serial.print(','); Serial.println(d, 1);
  delay(100);
}</code></pre>
    </details>
    <details class="code"><summary>② 거리를 음높이로 — tone() 소리 지팡이 (창의 C03)</summary>
      <button type="button" class="btn sm" data-copy="code-tone">📋 복사</button>
      <pre><code id="code-tone">// d : 장애물까지 거리(cm). 가까울수록 높은 음. 지수 매핑 → 같은 거리 차 = 같은 음정 차
const float DMAX = 200.0, F0 = 220.0, OCT = 2.0;
float f = F0 * pow(2.0, OCT * (1.0 - constrain(d, 20, DMAX) / DMAX));
tone(8, (int)f);        // 8번 핀 수동 부저</code></pre>
    </details>
    <details class="code"><summary>③ MPU6050 움직임 감지 → 번짐 경보 (발명 I04)</summary>
      <button type="button" class="btn sm" data-copy="code-imu">📋 복사</button>
      <pre><code id="code-imu">#include &lt;Wire.h&gt;
#include &lt;MPU6050.h&gt;
MPU6050 imu;
float vel = 0;                       // 적분 속도(m/s) — 드리프트는 영점 보정으로 줄인다
const float PIX = 0.3e-3;            // 화소 크기(m)
const float TEXP = 0.05;             // 노출 시간(s)

void setup() { Serial.begin(115200); Wire.begin(); imu.initialize(); pinMode(13, OUTPUT); }

void loop() {
  int16_t ax, ay, az, gx, gy, gz; imu.getMotion6(&amp;ax, &amp;ay, &amp;az, &amp;gx, &amp;gy, &amp;gz);
  float a = ax / 16384.0 * 9.81;                      // m/s² (±2 g 설정)
  vel = 0.98 * (vel + a * 0.01);                      // 간단한 누설 적분
  float blur = fabs(vel) * TEXP;                      // 번짐 = v × t
  digitalWrite(13, blur &gt; PIX ? HIGH : LOW);          // 번짐 &gt; 1 화소 → 경고
  delay(10);
}</code></pre>
    </details>
    <details class="code"><summary>④ 파이썬 분석 — 감약계수 μ 와 반가층 (종합1 · R01 · R02)</summary>
      <button type="button" class="btn sm" data-copy="code-mu">📋 복사</button>
      <pre><code id="code-mu">import numpy as np
x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8])                 # 두께(장 수 또는 cm)
E = np.array([800, 640, 515, 410, 330, 265, 212, 170, 135.]) # 조도(lux) — 내 측정값으로 바꾸기
y = np.log(E[0] / E)                                       # ln(I0/I)
mu = (x * y).sum() / (x * x).sum()                         # 원점 통과 최소제곱 기울기
hvl = np.log(2) / mu
print(f"mu = {mu:.3f} /단위,  HVL = {hvl:.2f} 단위")</code></pre>
    </details>
    <details class="code"><summary>⑤ 파이썬 분석 — 프레임 평균과 SNR (종합3 · R09)</summary>
      <button type="button" class="btn sm" data-copy="code-snr">📋 복사</button>
      <pre><code id="code-snr">import numpy as np
rng = np.random.default_rng(1)
signal, sigma = 40.0, 13.0                      # 신호 대비(HU), 한 장 잡음 σ
for N in [1, 4, 9, 16, 25, 49]:
    frames = signal + sigma * rng.standard_normal((N, 20000))
    avg = frames.mean(axis=0)
    snr = signal / avg.std()
    print(N, f"SNR = {snr:.2f}  (이론 {signal/sigma*np.sqrt(N):.2f})")</code></pre>
    </details>
    <details class="code"><summary>⑥ 파이썬 분석 — 민감도 · 특이도 · PPV (R10 · I09)</summary>
      <button type="button" class="btn sm" data-copy="code-roc">📋 복사</button>
      <pre><code id="code-roc">import numpy as np
rng = np.random.default_rng(2)
n, prev = 1000, 0.10
y = rng.random(n) &lt; prev                            # 실제 병(True)
score = np.where(y, rng.normal(0.68, 0.17, n), rng.normal(0.35, 0.17, n))
th = 0.5
pred = score &gt;= th
tp = (pred &amp; y).sum(); fp = (pred &amp; ~y).sum(); fn = (~pred &amp; y).sum(); tn = (~pred &amp; ~y).sum()
print("민감도", tp/(tp+fn), "특이도", tn/(tn+fp), "PPV", tp/(tp+fp))</code></pre>
    </details>
    <details class="code"><summary>⑦ 파이썬 — 창 수준(WL) · 창 폭(WW) 변환 (창의 C09)</summary>
      <button type="button" class="btn sm" data-copy="code-win">📋 복사</button>
      <pre><code id="code-win">import numpy as np
def window(hu, wl, ww):
    lo = wl - ww / 2
    return np.clip((hu - lo) / ww, 0.0, 1.0)      # 0~1 밝기
# 예: 뇌 창 WL 40, WW 80 / 뼈 창 WL 400, WW 1800 / 폐 창 WL -600, WW 1500
img = window(hu_image, 40, 80)</code></pre>
    </details>
  </div>
'''
safe=r'''  <div class="card">
    <div class="h3">🦺 ⑤ 안전 · 윤리 · 규정 점검표 <span class="badge b-poe">체크는 자동 저장</span></div>
    <div class="goal">🎯 <b>시작하기 전에</b> 모두 확인하세요. 규정 · 법규는 <b>나라 · 지역 · 시기에 따라 바뀌므로</b> 학교 · 지도교사 · 대회 규정집의 최신 안내를 따릅니다.</div>
    <div class="checklist" id="k14-safe"></div>
    <div class="row"><span class="tiny" id="k14-safemsg">0 / 0 확인</span></div>
  </div>
'''
refs=r'''  <div class="card">
    <div class="h3">📚 ⑥ 더 찾아볼 곳 — 이름만 알려 드립니다(주소는 직접 검색)</div>
    <div class="steps">
      <div class="step"><b>한국</b> : 질병관리청 · 한국원자력안전기술원(KINS) · 대한영상의학회 · 대한초음파의학회 · 식품의약품안전처(의료기기) · 건강보험심사평가원(HIRA) 통계 · 학교 R&amp;E · 영재학급 · 학생과학탐구대회.</div>
      <div class="step"><b>미국</b> : American College of Radiology(ACR) · RSNA RadiologyInfo · NIH Clinical Center · FDA 의료영상 · NCRP · 공개 의료영상 데이터(NIH ChestX-ray14 · The Cancer Imaging Archive).</div>
      <div class="step"><b>일본</b> : 日本医学放射線学会 · 日本放射線技術学会 · 厚生労働省 · 日本医用画像工学会. 국제 비교 통계 : OECD Health Statistics(CT · MRI 보유 대수).</div>
      <div class="step"><b>국제</b> : UNSCEAR(방사선 선량 · 영향 보고서) · ICRP(방사선 방호 권고) · IAEA · WHO 진단영상 · IEC/ISO 의료기기 표준 · DICOM 표준.</div>
      <div class="step"><b>이론</b> : 교과서 파동 · 현대물리(X선 · 광전효과) · 전자기(자기 모멘트 · 라모어) · 수학(라돈 변환 · 푸리에) · 통계(베이즈 · ROC).</div>
      <div class="step"><b>특허</b> : 한국특허정보원 KIPRIS 에서 비슷한 발명을 검색해 「내 것의 새로운 점」을 정리합니다(발명 10선).</div>
    </div>
    <p class="tiny">※ 이 자료의 통계 · 연도 · 규모는 공개된 자료를 바탕으로 정리한 것이며 해마다 바뀔 수 있습니다. 활용 전 <b>반드시 공식 최신 자료</b>를 확인하세요.</p>
  </div>
</section>
'''
open('parts/t14.html','w',encoding='utf-8').write(s+'\n'+code+'\n'+safe+'\n'+refs)
