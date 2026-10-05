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
# ───── 15 : v² 대 h (총 손실 계수 K)
out[15]=tab(15,'📊 [종합1] 높이차 대 v² — 사이펀의 총 손실 계수 K','',
 '🎯 이 실험에서 하는 것 — 투명 호스 사이펀의 높이차 $h$ 를 바꾸며 출구 유속 $v$(= 유량 ÷ 단면적)를 재서 $v^2$ 대 $h$ 그래프를 그립니다. 이 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $2g/K$</b> 입니다. 기울기에서 <b>숨은 총 손실 계수 $K$</b> 를 알아내 보세요. 측정값은 보고서(19번 탭)로 이어집니다.',
 '🧭 선행조직자 — 높이차가 만드는 속력의 제곱','베르누이(에너지 보존)에 손실을 넣으면 $gh=\\tfrac12Kv^2$ 이므로 $v^2=\\dfrac{2g}{K}h$ 입니다. $v^2$ 를 세로로, $h$ 를 가로로 그리면 <b>원점을 지나는 직선</b>이고 기울기 하나가 $2g/K$ — 곧 관이 얼마나 많은 에너지를 잃는지를 알려 줍니다. 직선 맞춤은 점 여러 개의 평균이므로 한 번 잰 값보다 정확합니다.',
 br(['$gh=\\tfrac12Kv^2$','$v^2$ 대 $h$ 직선','기울기 = $2g/K$','$K=2g/$기울기']),
 poe('높이차를 4 배로 하면 유속의 제곱 $v^2$ 은 몇 배가 될까? (K 일정)',['2 배','4 배','8 배','같다'],1,'$v^2=\\dfrac{2g}{K}h$ 이므로 높이차에 비례해 <b>4 배</b>가 됩니다(유속 $v$ 는 2 배). 그래서 $v^2$ 대 $h$ 가 원점을 지나는 직선입니다. 오른쪽 그래프로 확인하세요.'),
 [('h','높이차 h',10,100,5,50),('S','$v^2$ 측정 잡음 σ',0,0.4,0.02,0.08)],
 [('oT','이론 v² (숨은 K)','a'),('oM','측정 v²','g'),('oF','추정 기울기 2g/K','v2'),('oE','추정 총 손실 계수 K','r'),('oN','기록 개수','')],
 '모형 : $v^2=\\dfrac{2g}{K}h+\\varepsilon$ (측정 잡음 σ (m/s)²). 숨은 손실 계수 $K$ 는 [새 조건]마다 2.5 ~ 7 에서 뽑힙니다(호스 길이 · 곡관 · 입구 모양). 층류/난류 전이 · 수위 변화는 무시한 교육용 단순화 모형입니다.',
 '① 높이차를 10 ~ 100 cm 로 넓게 바꾸며 [측정 기록] 하세요(가로축은 $h$ 입니다).||② 잡음 σ 를 크게 하면 낮은 높이차의 점이 얼마나 흩어지나요? 왜 그럴까요?||③ 기울기에서 $K$ 를 직접 구해 오른쪽 결과와 맞춰 보세요.||④ 호스를 2 배 길게 하면 기울기는 커질까요 작아질까요? (R03 참고)',
 '위 통의 물이 호스를 타고 정점을 넘어 출구로 흐릅니다(10 초 반복).',
 '📊 가로 높이차 $h$ (m) · 세로 유속의 제곱 $v^2$ (m²/s²). 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $2g/K$.',
 '<p>$gh=\\tfrac12Kv^2$ → $v^2=\\dfrac{2g}{K}h$ → 기울기 $s=2g/K$, $K=2g/s$. 예 : $s=3.9$ → $K=5.0$. 오차 : $\\delta s\\approx\\sigma/\\sqrt{\\sum h_i^2}$ — 높이차가 큰 점이 기울기를 정확하게 정합니다.</p><p class="lv-uni">교과서 밖 : 실제로는 $K$ 가 레이놀즈 수에 따라 조금씩 변해 직선에서 벗어납니다($f=0.316Re^{-1/4}$). 이상 유체($K=1$)면 기울기는 $2g=19.6$ 입니다.</p>',
 ['<b>준비</b> : 투명 호스(지름 10 mm · 1 m), 큰 위 통, 눈금 통, 스톱워치, 줄자(R01 참고).','<b>측정</b> : 높이차 6 가지에서 500 mL 를 받는 시간을 3 회씩 재어 $v=Q/A$ 를 구한다.','<b>그래프</b> : $v^2$ 대 $h$ 를 그려 원점을 지나는 직선으로 맞춘다(기울기 $2g/K$).','<b>분석</b> : $K=2g/s$ 를 구하고 $K=1+K_m+fL/D$ 의 이론값과 비교한다. 불확도도 쓴다.','<b>안전</b> : 입으로 빨지 않고 주사기로 시동, 바닥 물기 닦기.'],
 '측정 기록표','')
# ───── 16 : 배수 시간 (T 대 x)
out[16]=tab(16,'📊 [종합2] 배수 시간 — 통 · 관 면적비와 총 손실 계수 K','',
 '🎯 이 실험에서 하는 것 — 단면적 $A_t$ 가 다른 통에서 처음 수위차 25 cm 를 모두 빼는 시간 $T$ 를 재서 $T$ 대 $x=\\dfrac{A_t}{a}\\sqrt{\\dfrac{2h_0}{g}}$ 그래프를 그립니다. 이 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $\\sqrt K$</b> 입니다. 기울기에서 <b>숨은 총 손실 계수 $K$</b> 를 알아내 보세요.',
 '🧭 선행조직자 — 구멍 난 물통의 수위 방정식','$A_t\\dfrac{dh}{dt}=-a\\sqrt{2gh/K}$ 를 풀면 배수 시간 $T=\\dfrac{A_t}{a}\\sqrt{\\dfrac{2Kh_0}{g}}=\\sqrt K\\cdot x$ 입니다($x=\\dfrac{A_t}{a}\\sqrt{2h_0/g}$). 그래서 $T$ 대 $x$ 는 <b>원점을 지나는 직선</b>이고 기울기가 $\\sqrt K$ 입니다. 통이 넓을수록 · 관이 가늘수록 $x$ 가 커집니다.',
 br(['$T=\\tfrac{A_t}{a}\\sqrt{2Kh_0/g}$','$T$ 대 $x$ 직선','기울기 = $\\sqrt K$','$K=$기울기$^2$']),
 poe('통 단면적을 2 배로 하면 같은 높이를 빼는 시간은 몇 배가 될까? (관 · 처음 수위 같음)',['1/2 배','같다','2 배','4 배'],2,'$T\\propto A_t$ 이므로 2 배입니다. 같은 수위 변화에 빼야 할 부피가 2 배이기 때문입니다. 호스 단면적 $a$ 가 2 배면 시간은 반으로 줄어듭니다.'),
 [('A','통 단면적 A_t',100,800,50,300),('S','시간 측정 잡음 σ',0,15,1,4)],
 [('oT','x = (A/a)√(2h₀/g)','a'),('oM','측정 T','g'),('oF','추정 기울기 √K','v2'),('oE','추정 총 손실 계수 K','r'),('oN','기록 개수','')],
 '모형 : $T=\\sqrt K\\,x+\\varepsilon$ (측정 잡음 σ s; 호스 지름 10 mm · 처음 수위차 25 cm 고정, 난류 일정 $K$ 가정). 숨은 $K$ 는 [새 조건]마다 3 ~ 8 에서 뽑힙니다. 두 통 · 층류는 다루지 않는 교육용 모형입니다.',
 '① 통 단면적을 100 ~ 800 cm² 로 넓게 바꾸며 [측정 기록] 하세요(가로축은 $x$ 입니다).||② 점이 원점을 지나는 직선인가요? 기울기는 얼마인가요?||③ 기울기에서 $K$ 를 구해 이론 $K=1+K_m+fL/D$ 와 비교해 보세요.||④ 처음 수위차를 4 배로 하면 기울기(또는 x)는 어떻게 변할까요?',
 '위 통의 수위가 내려가며 사이펀이 약해집니다(10 초 동안 전체 배수를 압축).',
 '📊 가로 $x=\\dfrac{A_t}{a}\\sqrt{2h_0/g}$ (s) · 세로 배수 시간 $T$ (s). 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $\\sqrt K$.',
 '<p>$T=\\sqrt K\\,x$ → 기울기 $s=\\sqrt K$, $K=s^2$. 예 : $s=2.2$ → $K=4.8$. $x$ 는 통이 넓을수록 커져 큰 통의 점이 기울기를 정확하게 정합니다.</p><p class="lv-uni">교과서 밖 : 가는 관 층류에서는 $T=\\dfrac{128\\mu LA_t}{\\pi\\rho gD^4}\\ln(\\ldots)$ 로 지수 감소가 되어 이 직선 관계가 깨집니다. 어떤 구간에서 직선이 성립하는지 확인하는 것이 연구 주제입니다.</p>',
 ['<b>준비</b> : 단면적이 다른 투명 통 6 종, 호스(10 mm · 1 m), 스톱워치, 줄자(R04 참고).','<b>측정</b> : 처음 수위차 25 cm 에서 완전히 비워질 때까지의 시간 $T$ 를 3 회씩 잰다.','<b>그래프</b> : $T$ 대 $x$ 를 그려 원점을 지나는 직선으로 맞춘다(기울기 $\\sqrt K$).','<b>분석</b> : $K=s^2$ 를 구하고 종합1 의 $K$ 와 비교한다(같은 호스).','<b>안전</b> : 입으로 빨지 않고 주사기로 시동, 바닥 물기 닦기.'],
 '측정 기록표','')
# ───── 17 : 가는 관 유량 (점성 μ)
out[17]=tab(17,'📊 [종합3] 가는 관 유량 — 물의 점성 μ 구하기','',
 '🎯 이 실험에서 하는 것 — 지름이 다른 가는 관(1.5 ~ 3.5 mm, 길이 0.5 m, 높이차 40 cm) 사이펀의 유량 $Q$ 를 재서 $Q$ 대 $x=\\dfrac{\\pi\\rho ghD^4}{128L}$ 그래프를 그립니다. 층류에서는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $1/\\mu$</b> 입니다. 기울기에서 <b>숨은 물의 점성 $\\mu$</b>(수온에 따라 달라짐)를 알아내 보세요.',
 '🧭 선행조직자 — 하겐–푸아죄유 법칙','가는 관의 층류에서 유량은 $Q=\\dfrac{\\pi\\rho gh}{128\\mu L}D^4=\\dfrac{x}{\\mu}$ 입니다. 그래서 $Q$ 를 세로로, $x$ 를 가로로 그리면 <b>원점을 지나는 직선</b>이고 기울기가 $1/\\mu$ 입니다. 지름이 2 배면 $x$ 는 16 배 — 그래서 지름 측정이 가장 중요합니다.',
 br(['$Q=\\dfrac{\\pi\\rho ghD^4}{128\\mu L}$','$Q$ 대 $x$ 직선','기울기 = $1/\\mu$','$\\mu=1/$기울기']),
 poe('같은 높이차 · 길이의 가는 관(층류)에서 지름을 2 배로 하면 유량은 몇 배가 될까?',['2 배','4 배','8 배','16 배'],3,'$Q\\propto D^4$ 이므로 $2^4=16$ 배입니다. 그래서 가는 관 유량은 지름에 매우 민감하고, 점도계 설계에서 지름의 정밀한 측정이 중요합니다.'),
 [('D','관 지름 D',1.5,3.5,0.25,2.5),('S','유량 측정 잡음 σ',0,0.3,0.02,0.05)],
 [('oX','x (×10⁻⁹)','a'),('oM','측정 Q','g'),('oF','추정 기울기 1/μ','v2'),('oE','추정 점성 μ','r'),('oN','기록 개수','')],
 '모형 : $Q=x/\\mu+\\varepsilon$ ($Q$ 는 mL/s, $x=\\pi\\rho ghD^4/(128L)$ 를 10⁻⁹ 단위로, μ 는 mPa·s). 숨은 점성 $\\mu$ 는 [새 조건]마다 0.8 ~ 1.4 mPa·s 에서 뽑힙니다(수온 10 ~ 30 °C). 충분히 가늘어 층류인 구간만 쓰는 교육용 모형입니다.',
 '① 지름을 1.5 ~ 3.5 mm 로 넓게 바꾸며 [측정 기록] 하세요(가로축은 $x$ 입니다).||② 지름이 클수록 점이 위로 얼마나 빨리 올라가나요? 왜 그럴까요?||③ 기울기에서 μ 를 구해 수온(10 ~ 30 °C)의 알려진 값(약 1.3 ~ 0.8 mPa·s)과 비교하세요.||④ 지름을 3 mm 이상으로 키우면 직선에서 벗어날까요? 이유는? (레이놀즈 수)',
 '가는 관 사이펀(가운데)으로 물이 천천히 흐릅니다(10 초 반복).',
 '📊 가로 $x=\\pi\\rho ghD^4/(128L)$ (×10⁻⁹) · 세로 유량 $Q$ (mL/s). 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $1/\\mu$.',
 '<p>$Q=\\dfrac{x}{\\mu}$ → 기울기 $s=1/\\mu$, $\\mu=1/s$. 예 : $s=0.95$ (mL/s per 10⁻⁹) → $\\mu=1.05$ mPa·s (약 19 °C 의 물).</p><p class="lv-uni">교과서 밖 : 층류 조건 $Re=\\rho vD/\\mu<2300$ 에서만 성립합니다. 지름이 커지면 난류로 바뀌어 $Q$ 가 $D^4$ 보다 느리게 늘어납니다. 입구 효과와 운동 에너지 보정(Hagenbach)도 고려합니다.</p>',
 ['<b>준비</b> : 가는 투명 관(1.5 ~ 3.5 mm) 4 종, 위 통, 눈금 통(50 mL), 스톱워치, 온도계(R07 · I09 참고).','<b>측정</b> : 높이차 40 cm · 관 길이 0.5 m 로 고정하고 50 mL 를 받는 시간을 3 회씩 잰다.','<b>그래프</b> : $Q$ 대 $x$ 를 그려 원점을 지나는 직선으로 맞춘다(기울기 $1/\\mu$).','<b>분석</b> : $\\mu=1/s$ 를 구하고 수온의 알려진 값과 비교한다. 지름 오차가 $D^4$ 에 미치는 영향도 쓴다.','<b>안전</b> : 입으로 빨지 않고 주사기로 시동, 60 °C 이하의 물만 사용.'],
 '측정 기록표','')
for n in out:
    open('parts/t%d.html'%n,'w',encoding='utf-8').write(out[n])
