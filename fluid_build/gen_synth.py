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
          <div class="cv-tools"><button type="button" class="btn sm fsb" data-fsx="%s" title="전체화면으로 보기 (수업용)">⛶ 전체화면</button><button type="button" class="btn sm" data-png="%s-cv" data-pngname="fluid-synth-%d">🖼 PNG</button></div>
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
# ───── 15 : 부력으로 액체 밀도
out[15]=tab(15,'📊 [종합1] 부력으로 재는 액체 밀도 — 아르키메데스 원리','',
 '🎯 이 실험에서 하는 것 — 매달린 추를 액체에 <b>V 만큼 담그면</b> 저울 읽음이 <b>Δm(g)</b> 만큼 늘어납니다(물이 추를 위로 밀면 그 반작용이 저울을 누릅니다). Δm 대 V 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = 액체의 밀도 $\\rho_f$ (g/mL)</b> 입니다. 숨은 액체(소금물 · 설탕물 등)의 밀도를 알아내세요. 결과는 <b>실험보고서의 실험 A</b>가 됩니다. (물 · 저울 · 눈금 실린더만 쓰는 안전한 실험)',
 '🧭 선행조직자 — 밀어낸 액체의 무게가 부력','부력 $B=\\rho_f V g$ — 잠긴 부피 $V$ 만큼의 액체 무게입니다. 저울 위 비커에 추를 줄로 매달아 담그면 저울은 $B/g=\\rho_f V$ (질량 단위) 만큼 더 읽습니다. 그러니 $\\Delta m=\\rho_f V$ — 기울기 하나로 액체의 밀도가 정해집니다.',
 br(['$B=\\rho_f V g$','$\\Delta m=B/g=\\rho_f V$','기울기 = $\\rho_f$','소금물은 기울기가 더 크다']),
 poe('물($\\rho=1.00$ g/mL)에서 50 mL 를 담그면 저울이 50 g 늘었다. 같은 추를 설탕물($\\rho=1.20$ g/mL)에 50 mL 담그면 저울 증가는?',['40 g','50 g','60 g','72 g'],2,'$\\Delta m=\\rho_f V=1.20\\times50=60$ g. 담긴 부피가 같아도 액체가 무거울수록 부력이 큽니다. 오른쪽 직선의 기울기가 더 가파른지 확인하세요.'),
 [('V','잠긴 부피 V',10,200,10,100),('S','저울 잡음 σ',0,2,0.1,0.4)],
 [('oB','이론 부력','a'),('oM','측정 Δm','g'),('oF','추정 밀도 ρ_f','v2'),('oE','물 대비 차이','r'),('oN','기록 개수','')],
 '모형 : $\\Delta m=\\rho_f V+\\varepsilon$ (저울 잡음 σ g). 숨은 액체 밀도 $\\rho_f$ 는 [새 조건]마다 0.95 ~ 1.25 g/mL 에서 뽑힙니다(보고서에서 참값과 비교). 표면장력 · 줄의 부력은 무시한 교육용 모형입니다.',
 '① V 를 10 ~ 200 mL 로 넓게 바꾸며 [측정 기록] 하세요.||② 저울 잡음 σ 를 크게 하면 점이 얼마나 흩어지나요? 점을 많이 모으면 기울기가 어떻게 안정되나요?||③ 기울기에서 밀도를 직접 구해 오른쪽 결과와 맞춰 보세요.||④ 추가 용기 바닥에 닿으면 어떤 오차가 생길까요?',
 '비커의 액체(파랑) 안에 추를 점점 담급니다(10 초 반복). 오른쪽 저울 눈금이 Δm 만큼 올라갑니다.',
 '📊 가로 잠긴 부피 $V$ · 세로 저울 증가 $\\Delta m$. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $\\rho_f$.',
 '<p>$\\Delta m=\\rho_f V$ → 기울기 $s=\\rho_f$ (g/mL = 1000 kg/m³ 의 비율). 예 : $s=1.12$ g/mL → $\\rho_f=1120$ kg/m³. 오차 : $\\delta s\\approx\\sigma/\\sqrt{\\sum V_i^2}$ — V 를 크고 넓게 퍼뜨릴수록 작아집니다.</p><p class="lv-uni">교과서 밖 : 같은 방법으로 <b>고체의 밀도</b>도 잽니다(공기 중 무게 / 부력 = 비중, 아르키메데스의 왕관 문제). 온도가 오르면 물 밀도는 4 ℃ 에서 최대이고 이후 줄어 소금물 측정 시 온도를 기록해야 합니다.</p>',
 ['<b>준비</b> : 주방 저울(0.1 g), 물 컵, 실로 맨 추(비중 큰 금속 · 자갈), 눈금 실린더(R01 · R02 참고).','<b>측정</b> : 컵을 저울에 올려 영점을 맞추고, 추를 실에 매달아 컵 속에 닿지 않게 담근다. 담근 깊이를 바꿔 저울 증가를 읽는다(눈금 컵 수위로 V 를 안다).','<b>그래프</b> : Δm 대 V 를 그려 원점 통과 직선의 기울기를 구한다(14번 탭 코드).','<b>확장</b> : 소금 0 · 5 · 10 · 15 % 로 만든 소금물로 반복해 밀도 대 농도를 그린다.','<b>결론</b> : 오차 원인(기포 · 줄 · 온도 · 용기 닿음)을 서술하고 비중계 값과 비교한다.'],
 '측정 기록표','')
# ───── 16 : 유압 힘 증폭
out[16]=tab(16,'📊 [종합2] 주사기 유압의 힘 증폭 — 파스칼 원리','',
 '🎯 이 실험에서 하는 것 — 단면적이 다른 두 주사기를 물로 연결하고 작은 쪽 피스톤을 $F_1$ 로 눌러 큰 쪽이 내는 힘 $F_2$ 를 잽니다. $F_2$ 대 $F_1$ 그래프는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $\\eta\\,A_2/A_1$</b> 입니다. 이론 면적비(여기서는 9)와 비교해 <b>효율 $\\eta$</b>(마찰 · 공기 손실)를 구합니다. 결과는 <b>보고서의 실험 C</b>가 됩니다. (물 · 낮은 힘만 쓰는 안전한 실험)',
 '🧭 선행조직자 — 압력은 같고 면적이 다르다','밀폐된 물에서 압력은 어디서나 같으므로 $F_1/A_1=F_2/A_2$ → $F_2=F_1A_2/A_1$. 이상적이면 기울기는 면적비(안지름비의 제곱). 실제는 피스톤 마찰 · 공기 방울 때문에 기울기가 작아져 $\\eta<1$ 입니다. 힘은 커지지만 <b>움직인 거리는 면적비만큼 줄어</b> 일은 얻지 못합니다.',
 br(['$p=F_1/A_1=F_2/A_2$','$F_2=\\eta\\dfrac{A_2}{A_1}F_1$','기울기 = $\\eta A_2/A_1$','$\\eta=\\text{기울기}/9$']),
 poe('안지름 10 mm 와 30 mm 주사기를 물로 연결했다(이상적). 작은 쪽을 5 N 으로 누르면 큰 쪽의 힘은? 큰 쪽이 1 cm 움직이려면 작은 쪽은 몇 cm 눌러야 할까?',['5 N, 1 cm','15 N, 3 cm','45 N, 9 cm','45 N, 1/9 cm'],2,'면적비 $(30/10)^2=9$ → $F_2=45$ N. 물은 비압축성이라 부피가 보존되므로 $A_1d_1=A_2d_2$ → 작은 쪽을 <b>9 cm</b> 눌러야 큰 쪽이 1 cm 움직입니다. 힘이 9 배면 거리는 1/9 이어서 일은 같습니다.'),
 [('F','입력 힘 F₁ (N)',1,10,0.5,5),('S','저울 잡음 σ (N)',0,1.5,0.1,0.4)],
 [('oT','이상 F₂ = 9F₁','a'),('oM','측정 F₂','g'),('oF','추정 기울기','v2'),('oE','추정 효율 η','r'),('oN','기록 개수','')],
 '모형 : $F_2=\\eta\\cdot9F_1+\\varepsilon$ (σ N). 숨은 효율 $\\eta$ 는 [새 조건]마다 0.70 ~ 0.95 에서 뽑힙니다. 면적비 9(안지름 10 mm · 30 mm)는 고정입니다. 관 길이 · 점성 · 가속은 무시한 교육용 모형입니다.',
 '① F₁ 을 1 ~ 10 N 으로 넓게 바꾸며 [측정 기록] 하세요.||② 기울기가 9 보다 얼마나 작은가요? 그 비율이 효율 η 입니다.||③ 공기 방울이 있으면 η 가 어떻게 변할지 예상해 보세요(R05 참고).||④ 큰 피스톤이 1 cm 움직일 때 작은 쪽이 몇 cm 움직여야 하는지 계산해 일이 같은지 확인하세요.',
 '작은 피스톤(왼쪽)을 누르면 물을 통해 큰 피스톤(오른쪽)이 올라가며 힘이 면적비만큼 커집니다(10 초 반복).',
 '📊 가로 입력 힘 $F_1$ · 세로 출력 힘 $F_2$. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $\\eta\\cdot9$.',
 '<p>$F_2=\\eta\\dfrac{A_2}{A_1}F_1$ → 기울기 $s=9\\eta$, $\\eta=s/9$. 예 : $s=7.65$ → $\\eta=0.85$. 이상 효율 1 이면 $s=9$. 일 보존 : $F_1d_1=F_2d_2/\\eta$ 이므로 실제 일은 손실만큼 줄어듭니다.</p><p class="lv-uni">교과서 밖 : 실제 유압 장비(굴착기 · 브레이크)는 압력 10 ~ 30 MPa 이상을 쓰며 점성 · 누설 · 가열이 효율을 정합니다. 이 실험은 안전을 위해 kPa 수준의 물 · 낮은 힘만 씁니다.</p>',
 ['<b>준비</b> : 안지름이 다른 주사기 두 개(10 mL 와 60 mL 등), 투명 튜브, 물, 주방 저울 2 개 또는 한 개(R04 참고). <b>바늘은 쓰지 않는다.</b>','<b>측정</b> : 큰 주사기를 저울 위에 세우고 작은 주사기를 눌러 큰 쪽 저울 증가(g)를 읽는다. 작은 쪽 힘은 다른 저울로 잰다. 무게(g) × 0.00981 = N.','<b>그래프</b> : F₂ 대 F₁ 직선의 기울기를 구한다. 안지름을 자로 재어 면적비 $(d_2/d_1)^2$ 를 계산한다.','<b>해석</b> : 효율 η = 기울기 / 면적비. 공기 방울을 일부러 넣었을 때와 비교한다.','<b>결론</b> : 손실 원인(마찰 · 공기 · 누설)과 안전하게 낮은 힘을 쓴 이유를 서술한다.'],
 '측정 기록표','')
# ───── 17 : 정수압 대 깊이
out[17]=tab(17,'📊 [종합3] 압력 대 깊이 — 정수압 p = ρgh','',
 '🎯 이 실험에서 하는 것 — 물 속 깊이 $h$ 를 바꾸며 압력센서(또는 U자관)로 <b>게이지 압력 $p$ (Pa)</b> 를 잽니다. $p$ 대 $h$ 는 <b>원점을 지나는 직선</b>이고 <b>기울기 = $\\rho g$</b> 입니다. 기울기에서 숨은 액체의 밀도를 구합니다. 결과는 <b>보고서의 실험 D</b>가 됩니다. (물 · 낮은 압력만 쓰는 안전한 실험)',
 '🧭 선행조직자 — 깊이가 두 배면 압력 증가도 두 배','같은 높이의 물기둥이 위에서 누르는 무게가 압력입니다. 게이지 압력 $p=\\rho g h$ 는 깊이에 비례하고 용기 모양과 무관합니다(정수압의 역설). 1 m 깊이마다 약 9.8 kPa 이 늘어, 10 m 에서 약 1 기압($\\approx$ 98 kPa)이 더해집니다.',
 br(['$p=\\rho g h$','$p$ 대 $h$ 직선','기울기 = $\\rho g$','$\\rho=\\text{기울기}/g$']),
 poe('수심 20 cm 에서 게이지 압력은 약 얼마일까? (물 1000 kg/m³, g=9.8)',['약 20 Pa','약 200 Pa','약 2 kPa','약 20 kPa'],2,'$p=\\rho g h=1000\\times9.8\\times0.20=1960$ Pa ≈ <b>2 kPa</b>. 수심 20 cm 의 압력은 대기압(101 kPa)의 2 % 정도로 작아 정밀한 센서나 U자관이 필요합니다.'),
 [('h','깊이 h (cm)',2,30,1,10),('S','센서 잡음 σ (Pa)',0,60,5,20)],
 [('oP','이론 p = ρgh','a'),('oM','측정 p','g'),('oF','추정 ρ','v2'),('oE','물과의 차이','r'),('oN','기록 개수','')],
 '모형 : $p=\\rho g h+\\varepsilon$ (σ Pa). 숨은 밀도 $\\rho$ 는 [새 조건]마다 990 ~ 1200 kg/m³ 에서 뽑힙니다. $g=9.80$ m/s². 센서 영점 · 온도 영향은 무시한 교육용 모형입니다.',
 '① 깊이를 2 ~ 30 cm 로 넓게 바꾸며 [측정 기록] 하세요.||② 기울기(Pa/cm)를 읽고 $\\rho=\\text{기울기}\\times100/9.8$ 로 밀도를 직접 계산해 보세요.||③ 센서 잡음 σ 가 크면 추정 밀도가 얼마나 흔들리나요?||④ 같은 깊이에서 용기가 넓거나 좁아도 압력이 같을까요? 이유는?',
 '압력센서가 물 속으로 내려갑니다(10 초 반복). 깊이에 따라 막대(압력)가 길어집니다.',
 '📊 가로 깊이 $h$ · 세로 게이지 압력 $p$. 빨강 = 내 회귀직선, 흰 점선 = 숨은 참 직선. 기울기 = $\\rho g$.',
 '<p>$p=\\rho g h$ → 기울기 $s=\\rho g$ (Pa/cm 로 쓰면 $\\rho=100\\,s/g$). 예 : $s=98$ Pa/cm → $\\rho=1000$ kg/m³. 절대 압력은 $p_0+\\rho g h$ ($p_0\\approx101.3$ kPa).</p><p class="lv-uni">교과서 밖 : 깊은 바다에서는 물이 조금 압축되어 밀도가 깊이에 따라 늘고, 온도 · 염분 구배도 있습니다(해양학의 상태방정식). 수 km 깊이에서는 $p$ 가 수십 MPa 이 되어 선형 근사의 보정이 필요합니다.</p>',
 ['<b>준비</b> : 투명 원통(페트병 윗부분 자름), 물, 자, 저압 압력센서 + 아두이노 또는 U자관 마노미터(R03 · R09 · I02 참고).','<b>측정</b> : 탐침(센서 구멍 또는 U자관 입구)을 깊이 2, 5, 10, 15, 20, 25 cm 에 두고 압력을 3 회 읽어 평균한다.','<b>그래프</b> : p 대 h 직선의 기울기를 구하고 ρ g 와 비교한다(14번 탭 코드).','<b>확장</b> : 소금물에서 반복해 기울기가 커지는지, 용기 모양이 달라도 같은지 확인한다.','<b>결론</b> : 오차 원인(영점 · 기포 · 표면 위치 읽기)과 실제 수심 · 잠수의 압력 연결을 서술한다.'],
 '측정 기록표','')
for n in out:
    open('parts/t%d.html'%n,'w',encoding='utf-8').write(out[n])
