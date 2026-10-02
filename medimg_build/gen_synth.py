# -*- coding: utf-8 -*-
def tab(n, title, badge, goal, org_t, org, bridge, poe, ctrls, kv, note, hints, cap1, cap2, formula, steps, rec_title, easy):
    pre='k%d'%n
    ctr=''.join('''        <div class="ctrl">
          <div class="ctrl-top"><span class="nm">%s</span><span class="vl" id="%s-%sV">—</span></div>
          <input type="range" id="%s-%s" min="%s" max="%s" step="%s" value="%s" aria-label="%s">
        </div>
'''%(c[1],pre,c[0],pre,c[0],c[2],c[3],c[4],c[5],c[1]) for c in ctrls)
    kvh=''.join('<div class="cell %s"><span class="k">%s</span><span class="v" id="%s-%s">—</span></div>'%(k[2],k[1],pre,k[0]) for k in kv)
    st=''.join('<div class="step">%s</div>'%s for s in steps for s in [s])
    return '''<section class="panel" id="tab%d" role="tabpanel" aria-labelledby="tabbtn%d" tabindex="0">
  <div class="card">
    <div class="h3"><span class="badge b-high">고등/수능</span><span class="badge b-exp">실험</span><span class="badge b-poe">POE</span>%s</div>
    <div class="goal">%s</div>
    <div class="organizer">
      <div class="ot">%s</div>
      %s
      <div class="bridge">%s</div>
    </div>
    %s
    <div id="%s-misc"></div>
  </div>
  <div class="grid2">
    <div>
      <div class="card">
        <div class="h3">🎛 가상 실험실 — 조건을 정하고 [측정 기록]</div>
%s        <div class="row">
          <button type="button" class="btn sm" id="%s-new">🎲 새 조건(숨은 값 다시 뽑기)</button>
          <button type="button" class="btn sm pri" id="%s-rec">📏 측정 기록</button>
          <button type="button" class="btn sm" id="%s-rec10">📏×5 연속 기록</button>
          <button type="button" class="btn sm rd" id="%s-clr">🧹 측정 초기화</button>
        </div>
        <div class="kv">%s</div>
        <p class="tiny">%s</p>
      </div>
      <div class="card">
        <div class="h4">📋 %s <span class="tiny" id="%s-cnt">0개</span></div>
        <div class="tblscroll"><table id="%s-tbl"><thead></thead><tbody></tbody></table></div>
        <p class="tiny">기록한 값은 <b>실험보고서(19번 탭)</b>의 표 · 그래프 · 결과로 자동으로 이어집니다. 5개 이상 모으세요.</p>
      </div>
      <div class="hintbox" data-hints="%s"></div>
    </div>
    <div>
      <div class="card tight">
        <div class="cv-wrap">
          <div class="cv-tools"><button type="button" class="btn sm fsb" data-fsx="%s" title="전체화면으로 보기 (수업용)">⛶ 전체화면</button><button type="button" class="btn sm" data-png="%s-cv" data-pngname="medimg-synth-%d">🖼 PNG</button></div>
          <canvas id="%s-cv" role="img" aria-label="가상 실험 장면" style="height:300px"></canvas>
          <div class="cv-cap">%s</div>
        </div>
        <div id="%s-time"></div>
        <div class="cv-wrap" style="margin-top:9px">
          <canvas id="%s-cv2" role="img" aria-label="측정 결과 그래프" style="height:320px"></canvas>
          <div class="cv-cap">%s</div>
        </div>
      </div>
      <div class="card lv-high">
        <div class="h4">📐 식으로 정리하기 <span class="badge b-high">고등</span></div>
        %s
      </div>
    </div>
  </div>
  <div class="card">
    <div class="h4">🧪 이 실험을 진짜로 하려면</div>
    <div class="steps">%s</div>
    %s
  </div>
</section>
'''%(n,n,title,goal,org_t,org,bridge,poe,pre,ctr,pre,pre,pre,pre,kvh,note,rec_title,pre,pre,hints,pre,pre,n,pre,cap1,pre,pre,cap2,formula,st,easy)

def poe(q,opts,ans,exp): return '<div class="poe" data-q="%s"\n         data-opts="%s"\n         data-ans="%d"\n         data-exp="%s"></div>'%(q,'||'.join(opts),ans,exp)
def br(items): return '<span class="ar">→</span>'.join('<span class="st%s">%s</span>'%(' new' if i==len(items)-1 else '',t) for i,t in enumerate(items))

out={}
# ───── 15 : X선/빛 감약
out[15]=tab(15,'📊 [종합1] 감약계수 μ 재기 — 램버트–비어 법칙','',
 '🎯 이 실험에서 하는 것 — 흡수체(물 · 필름 더미) 두께 $x$ 를 바꾸어 통과한 빛(X선 모사)의 세기 $I$ 를 재고, $\\ln(I_0/I)$ 대 $x$ 의 그래프를 그려 <b>원점을 지나는 직선의 기울기 = 감약계수 $\\mu$</b> 를 구합니다. 반가층 $\\mathrm{HVL}=\\ln2/\\mu$ 도 구합니다. 여기서 모은 값은 <b>실험보고서의 실험 A</b>가 됩니다. (실제 방사선이 아닌 안전한 가상 · 빛 실험입니다)',
 '🧭 선행조직자 — 지수를 로그로 펴기','$I=I_0e^{-\\mu x}$ 는 곡선이지만 양변에 로그를 취하면 $\\ln(I_0/I)=\\mu x$ — 직선입니다. 직선의 기울기 하나로 물질의 감약계수가 정해지고, 검출한 광자 수가 적을수록 포아송 잡음이 커서 점이 흩어집니다.',
 br(['$I=I_0e^{-\\mu x}$','$\\ln(I_0/I)=\\mu x$','기울기 = $\\mu$','HVL = $\\ln2/\\mu$']),
 poe('두께 2 cm 에서 세기가 절반이 되었다면, 두께 6 cm 에서 세기는 처음의 몇 배일까?',['1/2 배','1/4 배','1/6 배','1/8 배'],3,'2 cm 마다 절반 → 6 cm 는 반가층 3 개분 → $(1/2)^3=1/8$. 지수 법칙이라 두께가 3 배면 세기는 3 제곱으로 줄어듭니다. 오른쪽 직선 그래프로 확인하세요.'),
 [('x','흡수체 두께 x',1,20,1,6),('N0','입사 광자 수 N₀',200,20000,200,5000)],
 [('oI','이론 I/I₀','a'),('oL','ln(I₀/I) 이론','g'),('oM','측정 ln(I₀/I)','v2'),('oF','추정 μ','r'),('oH','추정 HVL','')],
 '모형 : 단색 좁은 빔 · 포아송 계수 잡음($\\sigma_I=\\sqrt I$). 숨은 참 $\\mu$ 는 [새 조건]을 누를 때마다 0.15 ~ 0.28 cm⁻¹ 에서 바뀝니다(보고서에서 참값과 비교). 두께 단위 cm. 산란 · 선질경화 무시한 교육용 모형입니다.',
 '① 두께를 1 ~ 20 cm 로 넓게 퍼뜨려 [측정 기록] 하세요.||② 광자 수 N₀ 를 200 으로 줄이면 점이 얼마나 흩어지나요? 왜 그럴까요(√N 잡음)?||③ 기울기에서 μ 를 구하는 식과 HVL = ln2/μ 를 직접 계산해 오른쪽 결과와 맞춰 보세요.||④ 두께 1 ~ 3 cm 만 쓸 때와 1 ~ 20 cm 를 쓸 때 추정 μ 의 불확실성을 비교하세요.',
 '광원(왼쪽) → 흡수체(가운데) → 검출기(오른쪽). 점 = 광자, 흡수체에서 흡수되면 사라집니다(10 초 반복).',
 '📊 가로 두께 $x$ · 세로 $\\ln(I_0/I)$ 산점도. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기가 $\\mu$.',
 '<p>$\\ln(I_0/I)=\\mu x$ → 기울기 $s=\\mu$. $\\mathrm{HVL}=\\ln2/\\mu$. 예 : $s=0.20$ → $\\mathrm{HVL}=3.5$ cm. 포아송 잡음 : $\\dfrac{\\delta\\ln(I_0/I)}{1}\\approx\\dfrac{1}{\\sqrt I}$ 이므로 광자 수가 4 배면 불확실성 ½.</p><p class="lv-uni">교과서 밖 : 실제 X선은 다색 스펙트럼이라 두께가 늘수록 평균 에너지가 올라가(선질경화) 로그 그래프가 약간 휘고, 조직 · 에너지마다 μ 가 다릅니다(2번 탭의 μ(E)). CT 의 HU 는 $\\mu$ 를 물 기준으로 바꾼 값입니다.</p>',
 ['<b>준비</b> : 안전한 대용 실험 — LED 광원 + 조도계(스마트폰 조도 앱) + 투명 OHP 필름 여러 장(또는 색 용액 층).','<b>측정</b> : 필름 장수 N 을 0, 1, 2 … 10 으로 바꾸며 조도 E 를 3 회씩 재어 평균한다(R01 참고).','<b>그래프</b> : $\\ln(E_0/E)$ 대 N 의 점을 찍고 직선 기울기를 구한다(스프레드시트 · 파이썬, 14번 탭 코드).','<b>해석</b> : 기울기 = 필름 한 장의 감약 지수 → 반가층(장 수) 구하기.','<b>결론</b> : 조명 불균일 · 반사 · 센서 포화 같은 오차 원인과 실제 X선과의 차이를 서술한다.'],
 '측정 기록표','')
# ───── 16 : 초음파 왕복 시간
out[16]=tab(16,'📊 [종합2] 초음파로 재는 깊이 — 음속과 왕복 시간','',
 '🎯 이 실험에서 하는 것 — 반사체의 깊이 $d$ 를 바꾸어 초음파 펄스의 <b>왕복 시간 $t$</b> 를 재고, $t$ 대 $d$ 그래프의 <b>원점을 지나는 직선 기울기 $2/c$</b> 로 조직의 <b>음속 $c$</b> 를 구합니다. 초음파 영상이 깊이를 정하는 원리($d=ct/2$)를 직접 확인합니다. 결과는 <b>보고서의 실험 C</b>가 됩니다. (안전한 가상 · 공기 중 초음파 센서 실험)',
 '🧭 선행조직자 — 시간이 거리','초음파 영상 장치는 소리를 보내고 <b>되돌아오는 데 걸린 시간</b>만 알 수 있습니다. 소리가 갔다 오는 경로 $2d$ 를 음속 $c$ 로 나눈 것이 시간이므로 $t=2d/c$ — 직선입니다. 음속을 잘못 가정하면 깊이가 틀려 보입니다(1540 m/s 가정).',
 br(['$t=2d/c$','$t$ 대 $d$ 직선','기울기 $=2/c$','$c=2/\\text{기울기}$']),
 poe('음속이 1540 m/s 인 조직에서 깊이 7.7 cm 의 반사체까지 왕복 시간은 대략?',['약 10 μs','약 50 μs','약 100 μs','약 1 ms'],2,'$t=2d/c=2\\times0.077/1540=1.0\\times10^{-4}$ s = <b>100 μs</b>. 초음파 장치는 이 정도의 시간 간격을 측정해 영상 깊이로 바꿉니다.'),
 [('d','반사체 깊이 d',2,20,1,8),('S','타이머 잡음 σ',0,2,0.1,0.5)],
 [('oT','이론 왕복 시간','a'),('oM','측정 t','g'),('oF','추정 음속 c','v2'),('oE','1540 가정 시 깊이 오차','r'),('oN','기록 개수','')],
 '모형 : $t=2d/c$ (μs = 2×10⁴ d(cm)/c). 숨은 참 음속 $c$ 는 [새 조건]마다 1450(지방 같은) ~ 1600 m/s(근육 같은) 중에서 뽑힙니다. 타이머 잡음 σ(μs) 가 점을 흩뜨립니다. 감쇠 · 굴절 무시한 교육용 모형.',
 '① 깊이를 2 ~ 20 cm 로 넓게 바꾸며 [측정 기록] 하세요.||② 기울기에서 $c=2\\times10^4/$기울기(μs/cm) 를 직접 계산해 오른쪽 결과와 맞춰 보세요.||③ 숨은 음속이 1450 인 조직에 1540 을 가정하면 깊이가 몇 % 틀려 보이나요?||④ 타이머 잡음을 크게 하면 추정 음속이 얼마나 흔들리나요? 깊이를 넓게 퍼뜨리면 도움이 되나요?',
 '탐촉자(왼쪽)가 펄스를 보내고 반사체(오른쪽)에서 되돌아오는 에코가 도착하는 순간 타이머가 멈춥니다(10 초 반복).',
 '📊 가로 깊이 $d$ · 세로 왕복 시간 $t$. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 $=2/c$.',
 '<p>$t=\\dfrac{2d}{c}$ → 기울기 $s=\\dfrac{2}{c}$ (단위 μs/cm 이면 $c=\\dfrac{2\\times10^4}{s}$ m/s). 예 : $s=13.0$ → $c=1538$ m/s. 1540 m/s 가정 시 깊이 오차 $\\dfrac{c_{가정}-c}{c}$.</p><p class="lv-uni">교과서 밖 : 간(약 1550) · 지방(약 1450) · 근육(약 1580) m/s 로 음속이 조직마다 달라 영상에서 지방이 많은 부위의 깊이가 약간 어긋납니다(굴절 · 속도 인공물). 실제 장비는 평균 1540 m/s 로 영상을 구성합니다.</p>',
 ['<b>준비</b> : HC-SR04 초음파 센서 + Arduino(또는 마이크로비트), 평평한 벽 · 판, 줄자(R04 참고).','<b>측정</b> : 거리 0.2 ~ 2 m 에서 왕복 시간(μs)을 5 회씩 평균하여 기록한다.','<b>그래프</b> : 왕복 시간 대 거리를 그려 기울기를 구하고 $c=2/\\text{기울기}$ 로 공기 중 음속(약 343 m/s)과 비교한다.','<b>확장</b> : 온도(드라이기 · 얼음)를 바꾸어 $c=331.3+0.606T$ 를 확인하고, 물 속(수조)에서 같은 방식으로 측정한다.','<b>결론</b> : 기울기의 불확실성과 오차 원인(센서 지연 · 반사체 각도)을 서술하고, 인체 초음파의 1540 m/s 가정과 연결한다.'],
 '측정 기록표','')
# ───── 17 : SNR √N
out[17]=tab(17,'📊 [종합3] 잡음과 평균 — SNR 의 √N 법칙','',
 '🎯 이 실험에서 하는 것 — 같은 대상을 <b>N 장 찍어 평균</b>하면 신호 대 잡음비(SNR)가 얼마나 좋아지는지 측정합니다. $\\mathrm{SNR}$ 대 $\\sqrt N$ 그래프는 <b>원점을 지나는 직선</b>이고 기울기가 한 장의 SNR 입니다. 결과는 <b>보고서의 실험 D</b>가 됩니다. (CT · MRI · 초음파의 평균 · 선량 · 촬영 시간 거래의 핵심)',
 '🧭 선행조직자 — 평균은 잡음을 √N 만큼 줄인다','신호는 쌓이면 N 배, 서로 독립인 잡음은 √N 배로만 커지므로 평균하면 SNR 은 √N 배 좋아집니다. 화질을 2 배 좋게 하려면 촬영 시간(또는 선량)이 <b>4 배</b> 필요합니다 — 의료영상에서 선량과 화질의 거래.',
 br(['신호 N 배','잡음 √N 배','SNR ∝ √N','선량 4 배 = 화질 2 배']),
 poe('한 장의 SNR 이 3 인 영상을 16 장 평균하면 SNR 은 대략?',['6','12','24','48'],1,'$\\mathrm{SNR}_N=\\sqrt N\\cdot\\mathrm{SNR}_1=4\\times3=12$. 16 배 시간을 써도 화질은 4 배 좋아질 뿐입니다.'),
 [('Nf','평균 프레임 수 N',1,64,1,8)],
 [('oS','이론 SNR','a'),('oM','측정 SNR','g'),('oF','추정 SNR₁(기울기)','v2'),('oR','필요한 노력 비','r'),('oN','기록 개수','')],
 '모형 : 측정 SNR = SNR₁ √N (1 + 0.07 ε), ε 는 가우시안 잡음(측정 SNR 자체의 흔들림). 한 장의 숨은 SNR₁ 은 [새 조건]마다 2 ~ 5 에서 뽑힙니다.',
 '① N 을 1, 4, 9, 16, 25, 49 로 바꾸며 [측정 기록] 하세요(√N 이 정수가 되도록).||② SNR 대 √N 점이 원점을 지나는 직선인가요? 기울기가 한 장의 SNR 인가요?||③ SNR 을 2 배로 하려면 N 을 몇 배로 해야 하나요? 선량이면 어떤 뜻인가요?||④ 평균해도 잡음이 √N 으로 줄지 않는 경우(잡음이 서로 독립이 아닐 때)를 생각해 보세요.',
 '왼쪽 : 한 장(잡음 많음), 오른쪽 : N 장 평균(깨끗). 같은 팬텀 · 같은 신호입니다(10 초 반복).',
 '📊 가로 $\\sqrt N$ · 세로 SNR. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = 한 장의 SNR.',
 '<p>$\\mathrm{SNR}_N=\\sqrt N\\,\\mathrm{SNR}_1$ → 기울기 $s=\\mathrm{SNR}_1$. 필요한 평균 장 수 $N=(\\mathrm{SNR}_목표/\\mathrm{SNR}_1)^2$. 예 : $s=3.0$ 에서 목표 12 → $N=16$.</p><p class="lv-uni">교과서 밖 : X선 · CT 는 광자 수 $N_\\gamma$ 의 포아송 잡음이라 $\\mathrm{SNR}\\propto\\sqrt{N_\\gamma}\\propto\\sqrt{\\text{선량}}$. MRI 는 신호 평균 횟수(NEX) $\\sqrt{\\mathrm{NEX}}$. 상관된 잡음에서는 평균 효과가 줄어듭니다.</p>',
 ['<b>준비</b> : 스마트폰으로 어두운 장면(저조도)을 같은 위치에서 고정해 연속 촬영(삼각대).','<b>측정</b> : 한 장의 관심영역(ROI) 평균 밝기 대비 표준편차로 SNR₁ 을 구한다(R09 참고).','<b>평균</b> : N = 1, 4, 9, 16 장을 평균한 영상의 SNR 을 계산한다(파이썬 numpy).','<b>그래프</b> : SNR 대 √N 점을 찍고 기울기가 SNR₁ 과 일치하는지 본다.','<b>결론</b> : 선량 · 시간 · 화질 거래와 한계(움직임, 비독립 잡음)를 서술한다.'],
 '측정 기록표','')
for n in out:
    open('parts/t%d.html'%n,'w',encoding='utf-8').write(out[n])
