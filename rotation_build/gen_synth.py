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
          <div class="cv-tools"><button type="button" class="btn sm fsb" data-fsx="%s" title="전체화면으로 보기 (수업용)">⛶ 전체화면</button><button type="button" class="btn sm" data-png="%s-cv" data-pngname="rotation-synth-%d">🖼 PNG</button></div>
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
# ───── 15 : 토크 대 각가속도 (관성 모멘트)
out[15]=tab(15,'📊 [종합1] 토크 대 각가속도 — 도르래 원판의 관성 모멘트 I','',
 '🎯 이 실험에서 하는 것 — 회전하는 원판(반지름 2.5 cm 도르래)에 줄로 추를 매달아 추의 질량 $m$ 을 바꾸며 토크 $\\tau=mgr$ 와 각가속도 $\\alpha$ 를 재서 $\\alpha$ 대 $\\tau$ 그래프를 그립니다. 이 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $1/I$</b> 입니다. 기울기에서 <b>숨은 관성 모멘트 $I$</b> 를 알아내 보세요. 측정값은 보고서(19번 탭)로 이어집니다.',
 '🧭 선행조직자 — 토크와 가속도는 비례한다','회전운동의 제2법칙 $\\tau=I\\alpha$ 에서 $\\alpha=\\tau/I$ 입니다. 그래서 $\\alpha$ 를 세로로, $\\tau$ 를 가로로 그리면 <b>원점을 지나는 직선</b>이고 기울기 하나가 $1/I$ — 즉 회전하기 어려운 정도(관성 모멘트)를 알려 줍니다. 직선 맞춤은 점 여러 개의 평균이므로 한 번 잰 값보다 정확합니다.',
 br(['$\\tau=I\\alpha$','$\\alpha$ 대 $\\tau$ 직선','기울기 = $1/I$','$I=1/$기울기']),
 poe('같은 원판에 매다는 추를 2 배로 하면(토크 2 배) 각가속도는 몇 배가 될까? (추의 관성 무시)',['1/2 배','같다','2 배','4 배'],2,'$\\alpha=\\tau/I$ 이므로 토크가 2 배면 각가속도도 <b>2 배</b>입니다. 같은 원판에 대해 $\\alpha$ 대 $\\tau$ 가 원점을 지나는 직선인 이유입니다. 오른쪽 그래프로 확인하세요.'),
 [('m','추 질량 m',10,200,10,100),('S','각가속도 측정 잡음 σ',0,2,0.1,0.4)],
 [('oT','토크 τ = mgr','a'),('oM','측정 α','g'),('oF','추정 기울기 1/I','v2'),('oE','추정 관성 모멘트 I','r'),('oN','기록 개수','')],
 '모형 : $\\alpha=\\tau/I+\\varepsilon$ (측정 잡음 σ rad/s², $r=2.5$ cm, 추의 관성 · 축 마찰 무시). 숨은 관성 모멘트 $I$ 는 [새 조건]마다 0.8 ~ 3.0 ×10⁻³ kg·m² 에서 뽑힙니다. 추 질량이 크면 추의 관성도 효과가 있어 오차가 생기는 교육용 단순화 모형입니다.',
 '① 추 질량을 10 ~ 200 g 으로 넓게 바꾸며 [측정 기록] 하세요(가로축은 토크 τ 입니다).||② 잡음 σ 를 크게 하면 가벼운 추의 점이 얼마나 흩어지나요? 왜 그럴까요?||③ 기울기에서 관성 모멘트를 직접 구해 오른쪽 결과와 맞춰 보세요.||④ 원판 위에 추가 질량을 올리면 기울기는 어떻게 변할까요? (R03 · I02 참고)',
 '원판(왼쪽)에 감긴 줄로 추가 내려오며 원판이 점점 빨라집니다(10 초 반복).',
 '📊 가로 토크 $\\tau$ (mN·m) · 세로 각가속도 $\\alpha$ (rad/s²). 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $1/I$.',
 '<p>$\\alpha=\\tau/I$ → 기울기 $s=1/I$, $I=1/s$. 예 : $s=0.50$ rad/s² per mN·m → $I=2.0\\times10^{-3}$ kg·m². 오차 : $\\delta s\\approx\\sigma/\\sqrt{\\sum \\tau_i^2}$ — 토크가 큰 점이 기울기를 정확하게 정합니다.</p><p class="lv-uni">교과서 밖 : 실제 도르래 실험에서는 추의 관성 때문에 $\\alpha=mgr/(I+mr^2)$ 가 되어 추가 무거울수록 직선에서 벗어납니다. 또한 축 마찰 토크 $\\tau_f$ 가 있으면 직선은 가로축의 $\\tau_f$ 에서 시작합니다.</p>',
 ['<b>준비</b> : 회전 원판(도르래, 반지름 2.5 cm), 추 세트(10 ~ 200 g), 줄, 스마트폰 슬로 모션, 스톱워치(R03 참고).','<b>측정</b> : 추 질량 6 가지에서 낙하 높이 h 와 시간 t 를 3 회씩 잰다. $a=2h/t^2$, $\\alpha=a/r$.','<b>그래프</b> : $\\alpha$ 대 $\\tau=mgr$ 를 그려 원점을 지나는 직선으로 맞춘다(기울기 $1/I$).','<b>분석</b> : $I=1/s$ 를 구하고 이론값($I=\\tfrac12MR^2$)과 비교한다. 불확도와 마찰 토크도 쓴다.','<b>안전</b> : 추 아래에 사람이 없게, 줄이 풀려도 손이 끼지 않게 한다.'],
 '측정 기록표','')
# ───── 16 : 각운동량 보존 (ω₂ 대 ω₁)
out[16]=tab(16,'📊 [종합2] 각운동량 보존 — 회전 의자 팔 오므리기와 관성 모멘트 비','',
 '🎯 이 실험에서 하는 것 — 회전 의자(보조자와 함께, 낮은 속도)에서 팔을 벌린 채 처음 각속도 $\\omega_1$ 로 돌다가 팔을 오므린 뒤의 각속도 $\\omega_2$ 를 영상으로 재서 $\\omega_2$ 대 $\\omega_1$ 그래프를 그립니다. 외부 토크가 없으면 $L=I\\omega$ 가 보존되므로 이 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $I_1/I_2$</b> 입니다. 숨은 관성 모멘트 비를 알아내 보세요.',
 '🧭 선행조직자 — 각운동량이 같으면 I 가 작을수록 빠르다','외부 토크가 0 이면 $I_1\\omega_1=I_2\\omega_2$ 이므로 $\\omega_2=(I_1/I_2)\\,\\omega_1$ 입니다. $\\omega_2$ 를 세로로, $\\omega_1$ 을 가로로 그리면 <b>원점을 지나는 직선</b>이고 기울기가 곧 관성 모멘트의 비입니다. 이 비는 팔 벌림 거리와 아령 질량이 정합니다.',
 br(['$I_1\\omega_1=I_2\\omega_2$','$\\omega_2$ 대 $\\omega_1$ 직선','기울기 = $I_1/I_2$','운동 에너지는 $I_1/I_2$ 배로 증가']),
 poe('처음 ω₁ = 1 rad/s 로 돌다 팔을 오므려 I 가 1/3 로 줄었다. 나중 ω₂ 와 운동 에너지 K 는? (마찰 무시)',['ω₂ = 1/3, K 는 1/3','ω₂ = 3, K 는 같다','ω₂ = 3, K 는 3 배','ω₂ = 1, K 는 3 배'],2,'$L$ 보존: $\\omega_2=3\\omega_1=3$ rad/s. $K=\\tfrac12I\\omega^2=\\tfrac{L^2}{2I}$ 이므로 I 가 1/3 이면 K 는 <b>3 배</b>가 됩니다. 늘어난 에너지는 팔을 오므리는 몸이 한 일에서 옵니다.'),
 [('w','처음 각속도 ω₁',0.3,2,0.1,1),('S','각속도 측정 잡음 σ',0,0.3,0.02,0.08)],
 [('oT','처음 ω₁','a'),('oM','측정 ω₂','g'),('oF','추정 기울기 (I₁/I₂)','v2'),('oE','운동 에너지 증가 배율','r'),('oN','기록 개수','')],
 '모형 : $\\omega_2=(I_1/I_2)\\omega_1+\\varepsilon$ (측정 잡음 σ rad/s, 의자 마찰 무시). 숨은 비 $I_1/I_2$ 는 [새 조건]마다 1.8 ~ 3.2 에서 뽑힙니다. 낮은 속도(2 rad/s 이하)만 다루는 교육용 모형입니다.',
 '① 처음 각속도를 0.3 ~ 2 rad/s 로 바꾸며 [측정 기록] 하세요(가로축은 ω₁).||② 직선이 원점을 지나나요? 지나지 않는다면 의자 마찰 때문일까요?||③ 기울기가 크려면 아령을 어떻게 하면 좋을까요?||④ 운동 에너지가 몇 배로 늘었나요? 그 에너지는 어디서 왔을까요?',
 '위에서 본 회전 의자(왼쪽)의 팔이 벌려졌다 오므려지며 속도가 변합니다(10 초 반복).',
 '📊 가로 처음 각속도 $\\omega_1$ · 세로 나중 각속도 $\\omega_2$. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $I_1/I_2$.',
 '<p>$I_1\\omega_1=I_2\\omega_2$ → 기울기 $s=I_1/I_2$. 예 : $s=2.4$ → 팔을 오므려 관성 모멘트가 약 $1/2.4$ 로 줄었다. $K_2/K_1=I_1/I_2=s$ 이므로 운동 에너지도 $s$ 배.</p><p class="lv-uni">교과서 밖 : 실제 의자 마찰이 있으면 $\\omega$ 가 시간에 따라 서서히 줄어들어 오므린 직후의 값을 읽어야 합니다. 마찰 토크가 있을 때는 $d(I\\omega)/dt=-\\tau_f$ 로 모델링합니다.</p>',
 ['<b>준비</b> : 회전 의자, 아령(0.5 ~ 2 kg 이하) 또는 물병 2 개, 스마트폰(위에서 촬영), 보조자 2 명(R05 참고).','<b>측정</b> : 낮은 속도(약 0.3 ~ 2 rad/s)로 팔을 벌려 돌리고 영상으로 ω₁ 을 잰 뒤 오므려 ω₂ 를 잰다(3 회).','<b>그래프</b> : $\\omega_2$ 대 $\\omega_1$ 을 그려 원점을 지나는 직선으로 맞춘다(기울기 $I_1/I_2$).','<b>분석</b> : 기울기를 팔 길이로 예측한 $I_1/I_2$ 와 비교한다. 의자 마찰과 읽기 오차를 쓴다.','<b>안전</b> : 보조자 2 명 필수, 어지러우면 즉시 중단, 아령은 놓치지 않는다.'],
 '측정 기록표','')
# ───── 17 : 구르기 가속도 (a 대 g sinθ)
out[17]=tab(17,'📊 [종합3] 구르기 가속도 — 경사면에서 모양 계수 k 구하기','',
 '🎯 이 실험에서 하는 것 — 경사면의 각도 $\\theta$ 를 바꾸며 구르는 물체(원통 · 공)의 가속도 $a$ 를 재서 $a$ 대 $g\\sin\\theta$ 그래프를 그립니다. 미끄러짐 없이 구르면 이 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $1/(1+k)$</b> 입니다. 기울기에서 <b>숨은 모양 계수 $k$</b> 를 알아내 보세요(속이 찬 구 0.4, 원통 0.5, 고리 1).',
 '🧭 선행조직자 — 구르면 회전에도 에너지를 쓴다','구르는 물체는 위치 에너지의 일부를 회전 운동 에너지로 씁니다: $mgh=\\tfrac12mv^2(1+k)$. 그래서 가속도는 $a=g\\sin\\theta/(1+k)$ 로 미끄러질 때($g\\sin\\theta$)보다 작습니다. $a$ 를 세로로, $g\\sin\\theta$ 를 가로로 그리면 <b>원점을 지나는 직선</b>이고 기울기가 $1/(1+k)$ 입니다. 질량과 반지름은 약분됩니다.',
 br(['$a=g\\sin\\theta/(1+k)$','$a$ 대 $g\\sin\\theta$ 직선','기울기 = $1/(1+k)$','$k=1/$기울기$-1$']),
 poe('같은 경사면에서 속이 찬 구와 속 빈 고리가 동시에 출발하면 먼저 도착하는 것은? (미끄러짐 없이)',['고리','구','동시','질량에 따라 다르다'],1,'$a=g\\sin\\theta/(1+k)$ 에서 k 가 작은 구(0.4)가 고리(1)보다 가속도가 큽니다: 구 $\\approx0.71\\,g\\sin\\theta$, 고리 $0.5\\,g\\sin\\theta$. 질량과 반지름은 상관이 없습니다.'),
 [('th','경사각 θ',2,20,1,10),('S','가속도 측정 잡음 σ',0,0.2,0.01,0.05)],
 [('oX','g sinθ','a'),('oM','측정 a','g'),('oF','추정 기울기 1/(1+k)','v2'),('oE','추정 모양 계수 k','r'),('oN','기록 개수','')],
 '모형 : $a=g\\sin\\theta/(1+k)+\\varepsilon$ (측정 잡음 σ m/s², 미끄러짐 · 공기 저항 무시). 숨은 모양 계수 $k$ 는 [새 조건]마다 0.35 ~ 1.0 에서 뽑힙니다(구 · 원통 · 공 · 고리). 경사각 20° 이하의 교육용 모형입니다.',
 '① 경사각을 2 ~ 20° 로 넓게 바꾸며 [측정 기록] 하세요(가로축은 g sinθ).||② 점이 원점을 지나는 직선인가요? 기울기는 얼마인가요?||③ 기울기에서 k 를 구해 물체가 구인지 원통인지 고리인지 추리해 보세요.||④ 질량을 2 배로 하면 기울기가 달라질까요?',
 '경사면(가운데)에서 구르는 물체가 점점 빨라지며 내려옵니다(10 초 반복).',
 '📊 가로 $g\\sin\\theta$ (m/s²) · 세로 가속도 $a$ (m/s²). 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $1/(1+k)$.',
 '<p>$a=\\dfrac{g\\sin\\theta}{1+k}$ → 기울기 $s=\\dfrac1{1+k}$, $k=\\dfrac1s-1$. 예 : $s=0.714$ → $k=0.40$ (속이 찬 구). 미끄러지면 $s$ 가 1 에 가까워집니다.</p><p class="lv-uni">교과서 밖 : 정지 마찰이 부족하면 미끄러지며 구르는 조건은 $\\mu_s\\ge\\dfrac{k}{1+k}\\tan\\theta$ 입니다. 경사가 커질수록 미끄러지기 쉬워 이 직선은 큰 각도에서 휘어집니다.</p>',
 ['<b>준비</b> : 경사판(1 m), 받침 책, 각도기, 구르는 물체(원통 · 공), 스마트폰 슬로 모션(R04 참고).','<b>측정</b> : 경사각 6 가지에서 출발 위치와 시간을 영상으로 재어 $a=2L/t^2$ 을 구한다(3 회 평균).','<b>그래프</b> : $a$ 대 $g\\sin\\theta$ 를 그려 원점을 지나는 직선으로 맞춘다(기울기 $1/(1+k)$).','<b>분석</b> : $k=1/s-1$ 을 구하고 물체의 이론 k 와 비교한다. 미끄러짐의 영향도 쓴다.','<b>안전</b> : 구르는 물체가 책상에서 떨어지지 않게 막이를 두고 발등에 주의한다.'],
 '측정 기록표','')
for n in out:
    open('parts/t%d.html'%n,'w',encoding='utf-8').write(out[n])
