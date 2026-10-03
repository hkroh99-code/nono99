/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R01 ~ R05 : 지렛대 평형 · 문 열기 힘과 거리 · 도르래로 관성 모멘트 재기 · 구르기 경주 · 회전 의자 각운동량
   (자 · 동전 · 저울 · 스마트폰 영상으로 하는 안전한 실험. 모든 모형은 교육용 어림)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R01 : 지렛대 평형 m₁d₁ = m₂d₂ ─────────────────────────────────── */
function r01(m1,d1,seed){ var rn=rng32(seed*17+3), m2=100, d2=m1*d1/m2, rows=[], i;
  for(i=0;i<6;i++){ var mm=30+30*i, dd=m1>0? mm*10/m2 : 0, meas=dd*(1+0.03*gaussR(rn))+0.25*gaussR(rn); rows.push({m:mm,d:Math.max(0,meas),ideal:dd}); }
  return {d2:d2,tau1:m1*d1/1000*G/100,ok:d2<=25,rows:rows}; }
(function(){ var a=r01(100,10,1), b=r01(50,10,1), c=r01(100,20,1), d=r01(200,25,1);
  mkP({ id:'R01', t:'지렛대 평형 검증 — 무게 × 거리가 같을 때 균형', icon:'⚖️', type:'R&E · 정량 실험', lv:1, dur:'1 주', cost:'약 5 천 원',
    one:'30 cm 자의 가운데를 받침점으로 하고 한쪽에 동전(질량 m₁)을 받침점에서 d₁ 되는 곳에 올린 뒤, 반대쪽에 100 g 추를 올려 평형이 되는 거리 d₂ 를 재서 $m_1d_1=m_2d_2$ (토크 평형)를 검증한다.',
    q:'받침점 양쪽 토크는 언제 같아질까? 한쪽 질량을 2 배로 하면 평형 거리는 어떻게 변할까? 자 자체의 무게는 얼마나 영향을 줄까?',
    why:'<b>시소의 원리</b>를 정량적으로 확인하는 가장 간단한 토크 실험입니다. 아르키메데스 이래의 지렛대 법칙이 $\\tau=mgd$ 의 합이 0 이라는 식으로 정리된다는 것을 자와 동전만으로 눈으로 볼 수 있습니다.',
    link:'원리② 토크와 평형(3번 탭) · 종합1(15번 탭) · 교과서 힘의 평형.',
    cap:'자(막대)의 가운데를 받침점으로 하고 왼쪽에 질량 m₁(거리 d₁), 오른쪽에 100 g 추(거리 d₂)를 올려 평형을 만든다(가운데). 자 · 받침점 · 동전 · 추 · 눈금 읽기 · 기록표',
    parts:[['자(받침 막대)','길이 30 cm','투명 30 cm 자','눈금이 있어 거리를 바로 읽는다. 자의 무게중심이 받침점 위에 오게 한다.'],
           ['받침점','연필 · 지우개','연필 + 고무줄','받침점이 흔들리지 않게 고정하고 눈높이에서 수평을 확인한다.'],
           ['동전 · 추','질량 m₁, m₂','주방 저울로 질량 측정','동전 질량을 저울로 재고 100 g 추는 눈금 확인한다.'],
           ['눈금 읽기','d₁, d₂','자의 눈금','받침점에서 추의 무게중심까지의 거리를 읽는다.'],
           ['수평 확인','영상 · 수평계','스마트폰 수평계 앱','자가 수평이 되는 순간의 d₂ 를 기록한다.'],
           ['기록표 · 그래프','m₁ 대 d₂','스프레드시트','d₂ 대 m₁ 이 원점을 지나는 직선인지 확인한다.']],
    budget:[['30 cm 자','1','약 1 천 원','—'],['동전 · 클립(질량 확인용)','1 세트','약 1 천 원','—'],['100 g 추','1','약 2 천 원','병 속 물 100 g'],['주방 저울','1','학교 보유','—'],['연필 · 고무줄','1','—','—']],
    steps:['자의 가운데(15 cm)를 받침점에 올려 수평이 되는지 확인하고 자 자체 무게의 영향을 영점 보정한다.','한쪽에 동전(m₁)을 받침점에서 d₁ = 10 cm 에 올리고 반대쪽에 100 g 추를 움직여 수평이 되는 거리 d₂ 를 읽는다(3 회 평균).','m₁ 을 30, 60, 90, 120, 150, 180 g 으로 바꿔 d₂ 를 구한다(d₂ ≤ 15 cm).','d₂ 대 m₁ 그래프의 기울기가 $d_1/m_2=0.1$ cm/g 에 가까운지 확인한다.','d₁ 을 20 cm 로 바꿔 기울기가 2 배가 되는지 확인한다.'],
    vars:['왼쪽 질량 m₁ · 거리 d₁','평형 거리 d₂','자의 무게중심 위치 · 받침점 마찰'],
    predict:[['m₁ = 100 g · d₁ = 10 cm','d₂ = '+fx(a.d2,1)+' cm','$m_1d_1=m_2d_2$ → 10 cm'],
             ['m₁ = 50 g · d₁ = 10 cm','d₂ = '+fx(b.d2,1)+' cm','질량이 절반 → 거리도 절반'],
             ['m₁ = 100 g · d₁ = 20 cm','d₂ = '+fx(c.d2,1)+' cm','거리가 2 배 → d₂ 도 2 배'],
             ['m₁ = 200 g · d₁ = 25 cm','d₂ = '+fx(d.d2,1)+' cm → '+(d.ok?'가능':'자가 짧다'),'d₂ 가 자 길이를 넘으면 불가능']],
    data:{cols:['m₁ (g)','d₂ 측정 (cm)','이론 (cm)','차이 (cm)'], rows:r01(100,10,1).rows.map(function(q){ return [fx(q.m,0),fx(q.d,1),fx(q.ideal,1),fx(q.d-q.ideal,1)]; })},
    analysis:'d₂ 대 m₁ 이 원점을 지나는 직선인지 최소제곱으로 확인하고 기울기 $d_1/m_2$ 와 비교한다. 오차의 큰 원인은 받침점 위치 · 자 눈금 읽기(±0.5 mm) · 자의 무게중심 어긋남이다. 불확도는 3 회 반복의 표준편차를 쓴다.',
    special:['🎓 연구 설계',[['연구 질문','평형일 때 양쪽의 질량 × 거리는 같은가?'],['독립변인','왼쪽 질량 · 거리'],['종속변인','평형 거리 d₂'],['통제변인','오른쪽 추 100 g · 받침점 · 자'],['기대 결과','d₂ ∝ m₁d₁, 기울기 = d₁/m₂']]],
    fails:[['자가 수평으로 멈추지 않는다','받침점을 자의 무게중심에 맞추고, 바닥에 부드러운 받침을 둔다'],['d₂ 값이 이론보다 계속 크다','자 자체 무게 중심이 어긋난 것 — 빈 자만으로 수평을 먼저 확인한다'],['동전이 굴러 떨어진다','접착제나 테이프로 가볍게 고정한다']],
    up:['<b>C01</b> — 균형 모빌 설계.','<b>I04</b> — 천칭 저울의 감도 설계.','<b>종합1(15번 탭)</b> — 토크와 각가속도로 관성 모멘트.'],
    next:['원리② 토크와 평형',3],
    eval:[['정확성','m₁d₁ = m₂d₂ 일치도'],['반복성','3 회 평균'],['분석','직선 기울기'],['안전','추 낙하 주의']],
    tip:'결과를 「m₁d₁ = m₂d₂ ± 2 %」처럼 불확도와 함께 쓰면 소논문 수준이 됩니다.' });
})();
SIMS.R01={ q:'왼쪽 질량과 거리를 바꾸면 오른쪽 100 g 추의 평형 거리는 어떻게 달라질까?',
  a:{nm:'왼쪽 질량 m₁',min:20,max:200,step:10,val:100,unit:'g',d:0}, b:{nm:'왼쪽 거리 d₁',min:5,max:25,step:1,val:10,unit:'cm',d:0},
  cap1:'자가 받침점 위에서 균형을 이룹니다. 오른쪽 추(100 g)가 평형 거리 d₂ 에 있습니다. d₂ 가 15 cm 를 넘으면 자가 모자라 균형을 못 맞춥니다.',
  cap2:'📊 왼쪽 질량 m₁ 대 평형 거리 d₂ — 이론(직선, 기울기 d₁/m₂)과 측정점(잡음 3 % + 0.25 cm).',
  note:'모형 : 자의 질량 · 받침점 마찰 무시 · $m_2=100$ g · $d_2=m_1d_1/m_2$ (3 % + 0.25 cm 읽기 오차). 자의 길이는 한쪽 15 cm 까지로 제한합니다.',
  anim:function(ctx,w,h,t,m1,d1,S){ var o=r01(m1,d1,S.seed), cx=w*0.5, cy=h*0.55, sc=w*0.016, tilt=0.18*Math.sin(t*3)*Math.exp(-t*0.7)+(o.ok?0:0.25);
    drawPivot(ctx,cx,cy+4,14); ctx.save(); ctx.translate(cx,cy); ctx.rotate(tilt); drawBeam(ctx,-15*sc,0,15*sc,0,7,COL.tick); for(var k=-15;k<=15;k+=5) cvLine(ctx,[[k*sc,-3],[k*sc,4]],COL.dim,1);
    var s1=Math.min(46,16+m1*0.18); cvRect(ctx,-d1*sc-s1/2,-s1-4,s1,s1,COL.blue,COL.white,1.2); cvText(ctx,m1+' g',-d1*sc,-s1/2-4,'#07101f','bold 11px system-ui,sans-serif','center');
    var x2=Math.min(15,o.d2)*sc, s2=30; cvRect(ctx,x2-s2/2,-s2-4,s2,s2,COL.grav,COL.white,1.2); cvText(ctx,'100 g',x2,-s2/2-4,'#07101f','bold 10.5px system-ui,sans-serif','center'); ctx.restore();
    cvLine(ctx,[[cx-d1*sc,cy+24],[cx,cy+24]],'#a78bfa',1.2); cvText(ctx,'d₁ = '+d1+' cm',cx-d1*sc/2,cy+40,'#a78bfa','11px system-ui,sans-serif','center'); cvLine(ctx,[[cx,cy+24],[cx+Math.min(15,o.d2)*sc,cy+24]],'#a78bfa',1.2); cvText(ctx,'d₂ = '+o.d2.toFixed(1)+' cm',cx+Math.min(15,o.d2)*sc/2,cy+40,'#a78bfa','11px system-ui,sans-serif','center');
    cvText(ctx,'m₁d₁ = '+(m1*d1).toFixed(0)+' g·cm = m₂d₂ = '+(100*o.d2).toFixed(0)+' g·cm '+(o.ok?'✅ 평형':'⚠ 자가 모자람'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,m1,d1,S){ var o=r01(m1,d1,S.seed), pts=o.rows.map(function(q){ return [q.m,q.d]; }), cur=[[20,20*d1/100],[200,200*d1/100]];
    lineGraph(ctx,w,h,{xmin:0,xmax:210,ymin:0,ymax:Math.max(16,200*d1/100*1.1),xl:'왼쪽 질량 m₁ (g)',yl:'평형 거리 d₂ (cm)',title:'m₁ 대 d₂ — 원점을 지나는 직선',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[0,15],[210,15]],col:COL.grav,lw:1.2,dash:[4,3]}],pts:pts.map(function(q){ return [q[0],q[1]*d1/10]; }),now:[m1,o.d2],legend:[['이론',COL.ok],['자 한계 15 cm',COL.grav],['측정(d₁ 기준 보정)',COL.blue],['지금',COL.amber]],yd:1,lw:170}); },
  kv:function(m1,d1,S){ var o=r01(m1,d1,S.seed); return [['왼쪽 토크 m₁gd₁',(o.tau1*1000).toFixed(1)+' mN·m','a'],['평형 거리 d₂',o.d2.toFixed(1)+' cm','g'],['오른쪽 토크 m₂gd₂',(100*o.d2/1000*G/100*1000).toFixed(1)+' mN·m','v2'],['판정',o.ok?'평형 가능':'자가 짧다','r'],['질량비 m₁/m₂',(m1/100).toFixed(2)]]; } };

/* ── R02 : 문 열기 — 손잡이 위치와 힘 ─────────────────────────────── */
function r02(r,th,seed){ var rn=rng32(seed*19+5), t0=0.6, F=t0/(r/100*Math.sin(th*PI/180)), rows=[], i;
  for(i=0;i<6;i++){ var rr=10+14*i, F0=t0/(rr/100*Math.sin(th*PI/180)); rows.push({r:rr,F:F0*(1+0.05*gaussR(rn)),ideal:F0}); }
  return {F:F,t0:t0,rows:rows,Fperp:F*Math.sin(th*PI/180)}; }
(function(){ var a=r02(40,90,1), b=r02(10,90,1), c=r02(70,90,1), d=r02(40,30,1);
  mkP({ id:'R02', t:'문 열기 힘과 거리 — 손잡이는 왜 경첩의 반대쪽에 있을까', icon:'🚪', type:'R&E · 정량 실험', lv:1, dur:'1 주', cost:'약 1 만 원',
    one:'교실 문(또는 작은 모형 문)을 스프링 저울로 경첩에서 r = 10 ~ 80 cm 되는 곳에서 직각으로 당겨 문이 움직이기 시작하는 힘 F 를 재서 $F\\propto1/r$ (토크 일정)임을 확인하고 당기는 각도를 바꿔 $F\\propto1/\\sin\\theta$ 도 확인한다.',
    q:'문을 열기 시작하는 힘은 경첩에서의 거리와 어떤 관계일까? 비스듬히 당기면 힘이 얼마나 더 필요할까?',
    why:'<b>문 손잡이가 문 끝에 있는 이유</b>를 숫자로 설명할 수 있습니다. 경첩 마찰이 만드는 일정한 저항 토크를 이기려면 $rF\\sin\\theta$ 가 같아야 하므로 거리가 멀수록 힘이 적게 듭니다.',
    link:'원리② 토크와 평형(3번 탭) · 교과서 힘 · 지레.',
    cap:'문을 위에서 본 모습(왼쪽): 경첩, 문, 스프링 저울이 직각으로 문을 당긴다(가운데). 힘 F 와 거리 r(오른쪽). 경첩 · 문 · 스프링 저울 · 줄자 · 각도기 · 기록표',
    parts:[['문(경첩)','저항 토크 τ₀','교실 문 · 모형 문','경첩 마찰이 일정한 저항 토크를 만든다. 문이 수평인지 확인.'],
           ['스프링 저울','F 측정','0 ~ 20 N 스프링 저울','천천히 당기며 문이 움직이기 시작하는 순간의 눈금을 읽는다.'],
           ['줄자','r 측정','줄자 2 m','경첩 축에서 저울을 건 점까지 거리.'],
           ['각도 조절','θ','각도기 · 줄','당기는 줄의 각도를 문 면 기준으로 바꾼다.'],
           ['안전','손가락 보호','장갑 · 고무','문틈에 손가락이 끼이지 않게 한다. 문을 급히 놓지 않는다.'],
           ['기록표 · 그래프','r 대 F','스프레드시트','F 대 1/r 의 직선 기울기가 τ₀.']],
    budget:[['스프링 저울(20 N)','1','약 5 천 원','주방 저울 + 줄'],['줄자','1','약 3 천 원','—'],['각도기 · 줄','1','약 2 천 원','—'],['장갑','1','약 2 천 원','—'],['모형 문(선택)','1','약 3 천 원','골판지 문']],
    steps:['문을 닫은 상태에서 경첩에서 r = 10, 24, 38, 52, 66, 80 cm 되는 곳에 줄을 매고 문에 수직으로 천천히 당긴다.','문이 움직이기 시작하는 순간의 힘 F 를 3 회씩 읽는다.','F 대 1/r 의 기울기 $\\tau_0$ 를 구한다(이론: 원점을 지나는 직선).','r = 40 cm 에서 당기는 각도 θ 를 90°, 60°, 45°, 30° 로 바꿔 F 를 재고 $F\\sin\\theta$ 가 일정한지 확인한다.','τ₀ 를 다른 문과 비교해 경첩 마찰 차이를 말해 본다.'],
    vars:['작용점 거리 r · 당기는 각도 θ','열리기 시작하는 힘 F','경첩 마찰 · 문 무게 · 당기는 속도'],
    predict:[['r = 40 cm · θ = 90°','F = '+fx(a.F,1)+' N','$F=\\tau_0/(r\\sin\\theta)$'],
             ['r = 10 cm · θ = 90°','F = '+fx(b.F,1)+' N','경첩 가까이 → 4 배 센 힘'],
             ['r = 70 cm · θ = 90°','F = '+fx(c.F,1)+' N','손잡이 끝 → 작은 힘'],
             ['r = 40 cm · θ = 30°','F = '+fx(d.F,1)+' N (수직 성분 '+fx(d.Fperp,1)+' N)','비스듬하면 힘이 2 배 필요']],
    data:{cols:['r (cm)','F 측정 (N)','이론 (N)','차이 (%)'], rows:r02(40,90,1).rows.map(function(q){ return [fx(q.r,0),fx(q.F,2),fx(q.ideal,2),fx((q.F/q.ideal-1)*100,0)]; })},
    analysis:'F 대 1/r 가 원점을 지나는 직선인지 확인하고 기울기에서 경첩 저항 토크 τ₀ 를 구한다. θ 를 바꾼 데이터는 $F\\sin\\theta$ 가 θ 와 무관하게 일정한지 본다. 문이 움직이기 시작하는 순간 판단이 오차의 큰 원인이므로 영상으로 확인한다.',
    special:['🎓 연구 설계',[['연구 질문','문이 열리기 시작하는 힘은 거리 · 각도와 어떤 관계인가?'],['독립변인','거리 r · 각도 θ'],['종속변인','힘 F'],['통제변인','문 · 경첩 · 당기는 속도'],['기대 결과','$F\\propto1/(r\\sin\\theta)$, τ₀ 일정']]],
    fails:[['문이 갑자기 열린다','천천히 일정하게 당기고 손을 문틈에서 멀리 둔다'],['힘이 일정하지 않다','경첩 마찰이 변하므로 같은 문에서 여러 번 반복하고 평균'],['저울이 문 면에 수직이 아니다','줄을 문 면에 90° 로 유지(각도기 확인)']],
    up:['<b>C05</b> — 렌치 토크 체험 부스.','<b>I01</b> — 스프링 빔 토크 렌치.','<b>종합1(15번 탭)</b> — 토크와 각가속도.'],
    next:['원리② 토크와 평형',3],
    eval:[['정확성','F–1/r 직선 R²'],['반복성','3 회'],['분석','τ₀ 추정'],['안전','손가락 끼임']],
    tip:'「손잡이를 경첩에서 4 배 멀리 두면 힘이 1/4」과 같은 한 문장을 그래프와 함께 보여 주세요.' });
})();
SIMS.R02={ q:'손잡이(당기는 점)의 위치와 당기는 각도를 바꾸면 문을 열기 시작하는 힘은 어떻게 달라질까?',
  a:{nm:'경첩에서의 거리 r',min:5,max:80,step:5,val:40,unit:'cm',d:0}, b:{nm:'당기는 각도 θ',min:20,max:90,step:5,val:90,unit:'°',d:0},
  cap1:'위에서 본 문(회색)과 경첩(왼쪽), 당기는 힘(노랑). 힘의 수직 성분(초록 점선)만 문을 돌립니다.',
  cap2:'📊 거리 r 대 필요한 힘 F — 이론(쌍곡선, F ∝ 1/r)과 측정점(잡음 5 %). 노란 점이 지금입니다.',
  note:'모형 : 경첩 저항 토크 $\\tau_0=0.6$ N·m(일정) · $F=\\tau_0/(r\\sin\\theta)$ · 측정 잡음 5 %. 문의 질량 · 속도 의존성 무시한 교육용 모형입니다.',
  anim:function(ctx,w,h,t,r,th,S){ var o=r02(r,th,S.seed), hx=w*0.14, hy=h*0.62, L=w*0.66, ang=-Math.min(0.22,0.0022*o.F*Math.min(1,(t%4)/2)); cvLine(ctx,[[hx-2,hy-24],[hx-2,hy+24]],COL.tick,6); ctx.save(); ctx.translate(hx,hy); ctx.rotate(ang); cvRect(ctx,0,-5,L,10,'rgba(148,163,184,.6)',COL.white,1.2); ctx.restore();
    var px=hx+r/80*L*Math.cos(ang), py=hy+r/80*L*Math.sin(ang), Lf=Math.min(90,o.F*4+16), tr=th*PI/180; cvArrow(ctx,px+Lf*Math.cos(Math.PI-tr)*-1,py+Lf*Math.sin(tr)*-1,px,py,COL.amber,3); cvLine(ctx,[[px,py],[px,py-Lf*Math.sin(tr)]],COL.ok,1.5,[4,3]); cvCirc(ctx,px,py,5,COL.amber,COL.white,1.2);
    cvLine(ctx,[[hx,hy+28],[px,hy+28]],'#a78bfa',1.2); cvText(ctx,'r = '+r+' cm',(hx+px)/2,hy+44,'#a78bfa','11px system-ui,sans-serif','center'); cvText(ctx,'필요한 힘 F = '+o.F.toFixed(2)+' N (수직 성분 '+o.Fperp.toFixed(2)+' N) · 저항 토크 0.6 N·m',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,r,th,S){ var o=r02(r,th,S.seed), pts=o.rows.map(function(q){ return [q.r,q.F]; }), cur=[], k; for(k=8;k<=80;k+=2) cur.push([k,0.6/(k/100*Math.sin(th*PI/180))]);
    lineGraph(ctx,w,h,{xmin:0,xmax:85,ymin:0,ymax:Math.min(40,Math.max(6,cur[0][1]*1.05)),xl:'경첩에서의 거리 r (cm)',yl:'필요한 힘 F (N)',title:'거리 대 힘 — F ∝ 1/r (토크 일정)',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[r,Math.min(40,o.F)],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:0}); },
  kv:function(r,th,S){ var o=r02(r,th,S.seed); return [['저항 토크 τ₀',o.t0.toFixed(2)+' N·m','a'],['필요한 힘 F',o.F.toFixed(2)+' N','g'],['수직 성분 F sinθ',o.Fperp.toFixed(2)+' N','v2'],['효율 sinθ',Math.sin(th*PI/180).toFixed(2),'r'],['90° 일 때 필요한 힘',(o.t0/(r/100)).toFixed(2)+' N']]; } };

/* ── R03 : 낙하 질량과 도르래로 관성 모멘트 재기 ──────────────────── */
function r03(m,rr,seed){ var rn=rng32(seed*23+7), I=0.004, h=1.0, a=m/1000*G/(m/1000+I/Math.pow(rr/1000,2)), t=Math.sqrt(2*h/a), al=a/(rr/1000), rows=[], i;
  for(i=0;i<6;i++){ var mm=20+30*i, aa=mm/1000*G/(mm/1000+I/Math.pow(rr/1000,2)), tt=Math.sqrt(2*h/aa)*(1+0.03*gaussR(rn)); rows.push({m:mm,t:tt,Iest:mm/1000*Math.pow(rr/1000,2)*(G*tt*tt/(2*h)-1)}); }
  return {a:a,t:t,al:al,I:I,tau:m/1000*(G-a)*rr/1000,rows:rows}; }
(function(){ var a=r03(50,15,1), b=r03(100,15,1), c=r03(50,25,1), d=r03(50,8,1);
  mkP({ id:'R03', t:'낙하 질량과 바퀴로 관성 모멘트 재기', icon:'🛞', type:'R&E · 정량 실험', lv:2, dur:'2 주', cost:'약 1.5 만 원',
    one:'바퀴(또는 원판)의 축에 실을 감고 끝에 추(m)를 달아 높이 h = 1 m 를 낙하하는 시간 t 를 영상으로 재서 $a=2h/t^2$, $I=mr^2\\left(\\dfrac{gt^2}{2h}-1\\right)$ 로 관성 모멘트를 구하고 이론값 $\\tfrac12MR^2$ 와 비교한다.',
    q:'낙하 시간은 추의 질량과 축 반지름에 어떻게 의존할까? 이 방법으로 구한 관성 모멘트는 이론과 얼마나 다를까?',
    why:'<b>바퀴를 쉽게 돌릴 수 있을지 어려울지</b>를 숫자 하나(I)로 표현하는 연습입니다. 뉴턴 제2법칙을 회전에 적용해 눈에 보이지 않는 관성 모멘트를 낙하 시간만으로 알아내는 간접 측정 연구입니다.',
    link:'원리③ 관성 모멘트와 τ=Iα(4번 탭) · 종합1(15번 탭) · 교과서 도르래 문제.',
    cap:'바퀴 축에 감긴 실(왼쪽)이 추를 달고 내려가며(가운데) 낙하 시간 t 로 가속도 a 와 각가속도 α 를 구한다(오른쪽). 바퀴 · 축 · 실 · 추 · 스톱워치(영상) · 기록표',
    parts:[['바퀴(원판)','질량 M, 반지름 R','자전거 바퀴 · 원판 · CD 묶음','질량을 저울로 재고 반지름을 자로 잰다. 축 마찰이 작아야 한다.'],
           ['축과 실','축 반지름 r','가는 축 + 얇은 실','실이 바퀴 축에 겹치지 않게 한 겹으로 감는다.'],
           ['추','질량 m','동전 · 추 20 ~ 170 g','너무 무겁지 않게 한다(안전). 바닥에 부드러운 받침.'],
           ['높이 · 줄자','h = 1 m','줄자 · 마스킹 테이프','낙하 시작과 끝 표시를 붙인다.'],
           ['영상 촬영','t 측정','스마트폰 240 fps','프레임 수로 낙하 시간 측정.'],
           ['기록표 · 계산','I 추정','스프레드시트','$I=mr^2(gt^2/2h-1)$.']],
    budget:[['바퀴 · 원판','1','약 5 천 원','CD 10 장'],['실 · 클립','1 세트','약 2 천 원','—'],['추 세트','1','약 5 천 원','동전'],['스마트폰','1','보유','—'],['줄자','1','약 3 천 원','—']],
    steps:['바퀴를 수평 축에 고정하고 축 반지름 r 와 바퀴의 질량 M · 반지름 R 를 재서 이론 $I=\\tfrac12MR^2$ 를 계산한다.','축에 실을 감고 추 m = 50 g 을 달아 h = 1 m 를 낙하하는 시간 t 를 영상으로 재어 3 회 평균한다.','$a=2h/t^2$, $\\alpha=a/r$, 토크 $\\tau=m(g-a)r$ 를 구하고 $I=\\tau/\\alpha$ 를 계산한다.','추를 20 ~ 170 g 으로 바꿔 I 를 구해 일정한지 확인한다.','축 반지름 r 를 바꿔(실을 감는 위치) 결과가 달라지는지 확인한다.'],
    vars:['추 질량 m · 축 반지름 r','낙하 시간 t · 관성 모멘트 I','실 두께 · 축 마찰 · 바퀴 균형'],
    predict:[['m = 50 g · r = 15 mm','t = '+fx(a.t,2)+' s · a = '+fx(a.a,3)+' m/s²','관성이 커서 천천히 내려온다'],
             ['m = 100 g · r = 15 mm','t = '+fx(b.t,2)+' s','무거운 추 → 빨리 내려오지만 I 는 같다'],
             ['m = 50 g · r = 25 mm','t = '+fx(c.t,2)+' s','큰 축 반지름 → 같은 추도 빨리'],
             ['m = 50 g · r = 8 mm','t = '+fx(d.t,2)+' s','작은 반지름 → 매우 느림']],
    data:{cols:['m (g)','낙하 시간 t (s)','I 추정 (kg·m²)','이론 I = 0.0040'], rows:r03(50,15,1).rows.map(function(q){ return [fx(q.m,0),fx(q.t,2),fx(q.Iest,4),'0.0040']; })},
    analysis:'I 의 추정값이 추 질량에 무관하게 일정한지 확인하고 평균 ± 표준편차를 이론 $\\tfrac12MR^2$ 와 비교한다. $\\tau$ 대 $\\alpha$ 그래프의 기울기로도 I 를 구한다(종합1). 줄 질량 · 축 마찰은 계통 오차로 작용한다.',
    special:['🎓 연구 설계',[['연구 질문','낙하 시간으로 관성 모멘트를 구할 수 있는가?'],['독립변인','추 질량 · 축 반지름'],['종속변인','낙하 시간 · I'],['통제변인','낙하 높이 · 바퀴 · 실'],['기대 결과','I 는 m 과 무관, $I\\approx\\tfrac12MR^2$']]],
    fails:[['실이 겹쳐 감겨 반지름이 바뀐다','한 겹으로 정돈해 감는다'],['I 가 계속 이론보다 크다','축 마찰이 크다 — 베어링 · 기름, 또는 바퀴 균형을 확인'],['낙하 시간 측정이 흔들린다','영상 프레임으로 시작과 끝을 정한다']],
    up:['<b>I03</b> — 비틀림 진자 관성 측정기.','<b>C02</b> — 팽이 디자인 대회.','<b>종합1(15번 탭)</b> — 토크 대 각가속도 직선.'],
    next:['원리③ 관성 모멘트',4],
    eval:[['정확성','I 이론 대비 오차'],['반복성','질량별 일관성'],['분석','τ–α 그래프'],['안전','낙하 추 · 실 감김']],
    tip:'간접 측정의 오차(낙하 시간 3 % → I 오차 몇 %)를 전파식으로 계산하면 분석 수준이 올라갑니다.' });
})();
SIMS.R03={ q:'추의 질량과 축 반지름을 바꾸면 낙하 시간과 구한 관성 모멘트는 어떻게 달라질까?',
  a:{nm:'추 질량 m',min:20,max:170,step:10,val:50,unit:'g',d:0}, b:{nm:'축 반지름 r',min:6,max:25,step:1,val:15,unit:'mm',d:0},
  cap1:'바퀴(왼쪽)에 감긴 실을 따라 추가 내려옵니다. 바퀴의 관성 때문에 자유 낙하보다 훨씬 천천히 내려옵니다.',
  cap2:'📊 추 질량 m 대 낙하 시간 t — 이론(곡선)과 측정점(잡음 3 %). 무거울수록 빨리 내려오지만 증가가 느려집니다.',
  note:'모형 : 바퀴 $I=0.004$ kg·m² (고정) · $a=mg/(m+I/r^2)$ · $t=\\sqrt{2h/a}$ ($h=1$ m) · 측정 잡음 3 %. 실의 질량 · 축 마찰 무시.',
  anim:function(ctx,w,h,t,m,rr,S){ var o=r03(m,rr,S.seed), cx=w*0.3, cy=h*0.35, R=Math.min(h*0.22,70), ph=(t%Math.max(2,o.t+1)), dist=Math.min(1,0.5*o.a*Math.min(ph,o.t)*Math.min(ph,o.t)); var ang=dist*1/(rr/1000);
    drawWheel(ctx,cx,cy,R,ang,0.5); var hx=cx+rr*0.9+4, y0=cy+8, y1=h*0.88; var y=y0+dist*(y1-y0-20); cvLine(ctx,[[cx+rr*1.2,cy],[cx+rr*1.2,y]],COL.tick,1.5); cvRect(ctx,cx+rr*1.2-14,y,28,22,COL.blue,COL.white,1.2); cvText(ctx,m+' g',cx+rr*1.2,y+12,'#07101f','bold 10.5px system-ui,sans-serif','center');
    cvLine(ctx,[[cx+60,y0],[cx+60,y1]],COL.dim,1,[3,3]); cvText(ctx,'h = 1 m',cx+66,(y0+y1)/2,COL.tick,'11px system-ui,sans-serif');
    var bx=w*0.55; cvText(ctx,'낙하 시간 t = '+o.t.toFixed(2)+' s · a = '+o.a.toFixed(3)+' m/s² (자유낙하의 '+(o.a/G*100).toFixed(1)+' %)',bx,h*0.3,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'각가속도 α = a/r = '+o.al.toFixed(1)+' rad/s²',bx,h*0.42,COL.ok,'12px system-ui,sans-serif'); cvText(ctx,'실의 장력 토크 τ = '+o.tau.toFixed(4)+' N·m',bx,h*0.54,COL.amber,'12px system-ui,sans-serif'); cvText(ctx,'I = τ/α = '+(o.tau/o.al).toFixed(4)+' kg·m² (이론 0.0040)',bx,h*0.66,COL.tick,'12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,m,rr,S){ var o=r03(m,rr,S.seed), pts=o.rows.map(function(q){ return [q.m,q.t]; }), cur=[], k; for(k=20;k<=170;k+=5){ var a=k/1000*G/(k/1000+0.004/Math.pow(rr/1000,2)); cur.push([k,Math.sqrt(2/a)]); }
    lineGraph(ctx,w,h,{xmin:0,xmax:180,ymin:0,ymax:Math.max(cur[0][1]*1.1,2),xl:'추 질량 m (g)',yl:'낙하 시간 t (s)',title:'질량 대 낙하 시간 — 무거울수록 빠르지만 점점 둔해진다',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[m,o.t],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:1}); },
  kv:function(m,rr,S){ var o=r03(m,rr,S.seed); return [['가속도 a',o.a.toFixed(3)+' m/s²','a'],['낙하 시간 t',o.t.toFixed(2)+' s','g'],['각가속도 α',o.al.toFixed(1)+' rad/s²','v2'],['장력 토크 τ',o.tau.toFixed(4)+' N·m','r'],['I (모형 값)',o.I.toFixed(4)+' kg·m²']]; } };

/* ── R04 : 구르기 경주 — 관성 계수 k 재기 ─────────────────────────── */
var SH4R=[null,{n:'속 빈 고리(캔 뚜껑 링)',k:1},{n:'속이 찬 원통(통조림)',k:0.5},{n:'속이 찬 구슬',k:0.4},{n:'속 빈 구(탁구공)',k:2/3}];
function r04(th,sh,seed){ var rn=rng32(seed*29+11), L=1.5, k=SH4R[sh].k, a=G*Math.sin(th*PI/180)/(1+k), t=Math.sqrt(2*L/a), rows=[], i;
  for(i=0;i<6;i++){ var ang=5+4*i, aa=G*Math.sin(ang*PI/180)/(1+k), tt=Math.sqrt(2*L/aa)*(1+0.03*gaussR(rn)); rows.push({th:ang,t:tt,kest:G*Math.sin(ang*PI/180)*tt*tt/(2*L)-1}); }
  return {a:a,t:t,k:k,rows:rows,v:Math.sqrt(2*a*L)}; }
(function(){ var a=r04(15,2,1), b=r04(15,1,1), c=r04(15,3,1), d=r04(25,2,1);
  mkP({ id:'R04', t:'구르기 경주 — 모양이 속도를 정한다', icon:'🏁', type:'R&E · 영상 분석', lv:1, dur:'1 주', cost:'약 1 만 원',
    one:'판자 경사면(길이 1.5 m)에서 속이 찬 통조림 · 속 빈 링 · 구슬 · 탁구공을 굴려 내려오는 시간 t 를 영상으로 재서 $k=\\dfrac{g\\sin\\theta\\,t^2}{2L}-1$ 로 관성 계수를 구하고 이론값(0.5, 1, 0.4, 2/3)과 비교한다.',
    q:'같은 경사면에서 모양이 다른 물체의 도착 순서는? 질량이 달라도 도착 순서가 바뀔까? 구한 관성 계수 k 는 이론과 같을까?',
    why:'<b>직관은 「무거운 것이 먼저」지만 답은 「모양이 정한다」</b>입니다. 의외의 결과를 예측하고 영상으로 확인한 뒤 에너지 보존으로 이유를 설명하면 훌륭한 R&E 가 됩니다.',
    link:'원리⑤ 회전 에너지 · 구르기(6번 탭) · 종합3(17번 탭) · 교과서 에너지.',
    cap:'경사면 꼭대기(왼쪽)에서 여러 모양을 동시에 굴려(가운데) 도착 순서와 시간을 영상으로 잰다(오른쪽). 판자 · 받침 · 구르는 물체 · 스마트폰 · 줄자 · 기록표',
    parts:[['경사 판자','길이 1.5 m','매끈한 판자 · 책 받침','경사각 θ 를 높이/길이로 계산한다. 양옆에 가이드를 세워 방향을 유지한다.'],
           ['굴러가는 물체','통조림 · 링 · 구슬 · 탁구공','질량 · 지름 측정','질량이 다른 같은 모양도 준비한다.'],
           ['출발 장치','동시에 놓기','자를 가로로 대고 뺀다','모두 같은 선에서 같은 순간에 출발.'],
           ['스마트폰 영상','t 측정','240 fps 슬로 모션','프레임 수로 도착 시간을 읽는다.'],
           ['경사각 측정','θ','각도 앱 · 높이/길이','sinθ = 높이/경사 길이.'],
           ['기록표 · 계산','k 추정','스프레드시트','$k=g\\sin\\theta\\,t^2/(2L)-1$.']],
    budget:[['판자 · 책','1 세트','약 5 천 원','—'],['통조림 2 종 · 링','3 개','약 3 천 원','—'],['구슬 · 탁구공','3 개','약 1 천 원','—'],['스마트폰','1','보유','—'],['줄자 · 각도 앱','1','약 3 천 원','—']],
    steps:['판자를 책으로 받쳐 경사각 약 10° 를 만들고 길이 L = 1.5 m 를 표시한다.','네 물체를 같은 선에 놓고 자를 빼 동시에 굴려 도착 순서를 영상으로 확인한다.','각 물체를 3 회씩 굴려 시간 t 를 재고 $a=2L/t^2$ 와 $k$ 를 구한다.','같은 모양에서 질량을 바꿔(통조림에 클립 · 수프 통) 시간이 같은지 확인한다.','경사각 θ 를 5 ~ 25° 로 바꿔 $a\\propto\\sin\\theta$ 를 확인한다.'],
    vars:['모양(k) · 경사각 θ · 질량','도착 시간 t · 가속도 a','경사면 마찰 · 미끄러짐 · 출발 시점'],
    predict:[['원통 · 15°','a = '+fx(a.a,2)+' m/s² · t = '+fx(a.t,2)+' s','k = 0.5'],
             ['링 · 15°','a = '+fx(b.a,2)+' m/s² · t = '+fx(b.t,2)+' s','가장 늦다(k = 1)'],
             ['구슬 · 15°','a = '+fx(c.a,2)+' m/s² · t = '+fx(c.t,2)+' s','가장 빠르다(k = 0.4)'],
             ['원통 · 25°','a = '+fx(d.a,2)+' m/s² · t = '+fx(d.t,2)+' s','경사가 크면 빠르다 ($\\sin25^\\circ$)']],
    data:{cols:['경사각 (°)','t 측정 (s)','k 추정','이론 k'], rows:r04(15,2,1).rows.map(function(q){ return [fx(q.th,0),fx(q.t,2),fx(q.kest,2),'0.50']; })},
    analysis:'k 의 추정값이 경사각과 무관하게 일정한지, 이론값과 몇 % 어긋나는지 확인한다. 미끄러지거나 판자가 휘면 k 가 작게 나온다. 질량이 다른 같은 모양의 t 가 오차 범위에서 같으면 $a$ 가 질량과 무관하다는 결론을 낸다.',
    special:['🎓 연구 설계',[['연구 질문','구르기 가속도는 질량 · 모양 중 무엇에 의존하는가?'],['독립변인','모양 · 질량 · 경사각'],['종속변인','도착 시간 · k'],['통제변인','경사 길이 · 표면 · 출발선'],['기대 결과','같은 모양은 질량과 무관, 순서: 구 < 원통 < 링']]],
    fails:[['물체가 옆으로 빠진다','양옆 가이드를 세우고 판자를 평평하게'],['k 가 이론보다 작게 나온다','미끄러졌다 — 표면에 얇은 천을 대어 마찰을 키운다'],['출발이 동시가 아니다','자를 가로로 대고 한 번에 뺀다. 영상으로 출발 프레임을 맞춘다']],
    up:['<b>C04</b> — 구슬 롤러코스터 루프.','<b>I08</b> — 고무줄 태엽 자동차.','<b>종합3(17번 탭)</b> — v² 대 높이 직선.'],
    next:['원리⑤ 회전 에너지 · 구르기',6],
    eval:[['정확성','k 이론 대비'],['반복성','3 회 평균'],['분석','질량 무관 확인'],['안전','낙하 물체 · 바닥 보호']],
    tip:'「무거운 것이 아니라 모양이 정한다」는 결론을 도착 영상 한 컷과 k 비교표로 보여 주세요.' });
})();
SIMS.R04={ q:'경사각과 모양을 바꾸면 구르는 시간과 구한 관성 계수 k 는 어떻게 달라질까?',
  a:{nm:'경사각 θ',min:5,max:30,step:1,val:15,unit:'°',d:0}, b:{nm:'모양(1~4)',min:1,max:4,step:1,val:2,fmt:function(v){ return SH4R[v].n; }},
  cap1:'경사면 위에서 선택한 모양(보라)과 비교 대상(노랑 원통, 빨강 링)이 함께 구릅니다. 질량이 아니라 모양이 순서를 정합니다.',
  cap2:'📊 경사각 θ 대 구르는 시간 — 선택한 모양의 이론 곡선과 측정점(잡음 3 %). 노란 점이 지금입니다.',
  note:'모형 : 경사 길이 1.5 m · $a=g\\sin\\theta/(1+k)$ · $t=\\sqrt{2L/a}$ · 측정 잡음 3 % · 미끄러짐 없음. $k$ : 링 1, 원통 0.5, 구슬 0.4, 탁구공 2/3.',
  anim:function(ctx,w,h,t,th,sh,S){ var o=r04(th,sh,S.seed), x0=30, x1=w*0.78, len=x1-x0, thr=th*PI/180, Hp=Math.min(h*0.5,len*Math.tan(thr)), y1=h*0.8, y0=y1-Hp; ctx.fillStyle='rgba(148,163,184,.14)'; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.lineTo(x0,y1); ctx.closePath(); ctx.fill(); cvLine(ctx,[[x0,y0],[x1,y1]],COL.axis2,2.4);
    var tt=(t%6)/6*o.t*1.5, objs=[[sh,'#a78bfa'],[2,COL.amber],[1,COL.grav]]; objs.forEach(function(q,i){ var ob=r04(th,q[0],1), s=Math.min(1.5,0.5*ob.a*tt*tt)/1.5, R=11, px=x0+s*len, py=y0+s*(y1-y0); cvCirc(ctx,px-R*Math.sin(thr),py-R*Math.cos(thr)+1,R,q[1],COL.white,1.2); var ra=s*1.5/ (R/ len*1.5/1.0*0.001*0+0.012); cvLine(ctx,[[px-R*Math.sin(thr),py-R*Math.cos(thr)+1],[px-R*Math.sin(thr)+R*Math.cos(ra),py-R*Math.cos(thr)+1+R*Math.sin(ra)]],'#0b1424',2); cvText(ctx,SH4R[q[0]].n.split('(')[0],w*0.8,26+i*18,q[1],'11px system-ui,sans-serif'); });
    cvText(ctx,'θ = '+th+'° · 선택 모양 t = '+o.t.toFixed(2)+' s · a = '+o.a.toFixed(2)+' m/s² · k = '+o.k.toFixed(2),12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,th,sh,S){ var o=r04(th,sh,S.seed), pts=o.rows.map(function(q){ return [q.th,q.t]; }), cur=[], k; for(k=5;k<=30;k+=1) cur.push([k,Math.sqrt(2*1.5/(G*Math.sin(k*PI/180)/(1+SH4R[sh].k)))]);
    lineGraph(ctx,w,h,{xmin:0,xmax:32,ymin:0,ymax:cur[0][1]*1.1,xl:'경사각 θ (°)',yl:'구르는 시간 t (s)',title:'경사각 대 시간 — sinθ 가 클수록 빠르다',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[th,o.t],legend:[['이론(선택 모양)',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:1}); },
  kv:function(th,sh,S){ var o=r04(th,sh,S.seed); return [['관성 계수 k',o.k.toFixed(2),'a'],['가속도 a',o.a.toFixed(2)+' m/s²','g'],['바닥 속력 v',o.v.toFixed(2)+' m/s','v2'],['시간 t',o.t.toFixed(2)+' s','r'],['미끄러짐 대비',(Math.sqrt(1+o.k)).toFixed(2)+' 배 시간']]; } };

/* ── R05 : 회전 의자와 각운동량 ────────────────────────────────────── */
function r05(m,ri,seed){ var rn=rng32(seed*31+13), Ib=1.2, ro=0.6, I1=Ib+2*m*ro*ro, I2=Ib+2*m*Math.pow(ri/100,2), rows=[], i;
  for(i=0;i<6;i++){ var mm=0.5*(i+1), a1=Ib+2*mm*ro*ro, a2=Ib+2*mm*Math.pow(ri/100,2), ideal=a1/a2; rows.push({m:mm,ratio:ideal*(1+0.06*gaussR(rn)),ideal:ideal}); }
  return {I1:I1,I2:I2,ratio:I1/I2,rows:rows,K:I1/I2}; }
(function(){ var a=r05(1,15,1), b=r05(0,15,1), c=r05(2,15,1), d=r05(1,30,1);
  mkP({ id:'R05', t:'회전 의자 각운동량 — 팔을 오므리면 얼마나 빨라질까', icon:'💺', type:'R&E · 영상 분석', lv:2, dur:'2 주', cost:'약 1 만 원',
    one:'회전 의자에 앉아(저속, 보조자와 함께) 양손에 같은 추(0.5 ~ 3 kg 이하)를 들고 팔을 벌린 채 천천히 돌다가 팔을 오므리며 한 바퀴 도는 시간을 영상으로 재서 $\\omega_2/\\omega_1=T_1/T_2=I_1/I_2$ 를 확인한다.',
    q:'팔을 오므리면 회전 속도가 몇 배가 될까? 손에 든 추가 무거우면 효과가 어떻게 달라질까?',
    why:'<b>몸으로 느끼는 각운동량 보존</b>을 정량 실험으로 바꿉니다. 영상 프레임 수만으로 속도비를 구하고 관성 모멘트 변화로 설명하는, 스포츠 과학으로 이어지는 연구입니다.',
    link:'원리④ 각운동량(5번 탭) · 교과서 운동량 보존.',
    cap:'회전 의자(위에서 본 모습)에서 팔을 벌린 채 천천히 돌다가(왼쪽) 팔을 오므리면(가운데) 속도가 빨라진다(오른쪽). 의자 · 추 · 보조자 · 스마트폰 · 줄자 · 기록표',
    parts:[['회전 의자','마찰이 작은 의자','사무용 회전 의자','회전축이 수직이고 흔들리지 않는 것. 발은 바닥에서 뗀다.'],
           ['추(양손)','m 0.5 ~ 3 kg','아령 · 책 · 생수병','한 손에 같은 질량. 무겁지 않게 하고 떨어뜨리지 않는다.'],
           ['보조자','안전','같은 학생 1 명','처음 가볍게 밀어 주고 어지러우면 즉시 멈춘다.'],
           ['스마트폰 영상','T 측정','위에서 촬영 · 슬로 모션','의자 한 바퀴 시간을 프레임으로 센다.'],
           ['자 · 줄자','r 측정','줄자','팔을 벌렸을 때 · 오므렸을 때 추의 축으로부터 거리.'],
           ['기록표 · 계산','I₁/I₂','스프레드시트','$T_1/T_2$ 와 $I_1/I_2$ 를 비교한다.']],
    budget:[['회전 의자','1','학교 보유','—'],['아령 · 책 · 생수병','1 세트','약 5 천 원','—'],['스마트폰','1','보유','—'],['줄자','1','약 3 천 원','—'],['안전 매트(선택)','1','약 1 만 원','—']],
    steps:['(보조자와) 회전 의자를 약 1 회전/3 초의 아주 느린 속도로 돌리고 팔을 벌려 한 바퀴 시간 T₁ 을 영상으로 잰다.','같은 방식으로 팔을 오므린 뒤 한 바퀴 시간 T₂ 를 잰다(각 3 회).','추의 질량을 0.5, 1, 1.5, 2 kg 으로 바꿔 T₁/T₂ 를 구한다.','팔을 벌렸을 때와 오므렸을 때 추의 반지름 r 를 재서 $I=I_{몸}+2mr^2$ 로 I₁/I₂ 를 계산한다(I_몸은 미지수 → 추 0 일 때 보정).','측정한 T₁/T₂ 와 I₁/I₂ 를 비교해 그래프로 나타낸다. 어지러우면 즉시 중단한다.'],
    vars:['추 질량 m · 오므린 반지름 r','회전 시간비 T₁/T₂','의자 마찰 · 처음 속도 · 팔 자세'],
    predict:[['추 1 kg · 오므린 15 cm','ω 비 약 '+fx(a.ratio,2)+' 배','추가 있으면 효과가 크다'],
             ['추 0 kg(빈손)','ω 비 약 '+fx(b.ratio,2)+' 배','몸의 질량만으로도 조금'],
             ['추 2 kg · 오므린 15 cm','ω 비 약 '+fx(c.ratio,2)+' 배','무거운 추 → 더 큰 효과'],
             ['추 1 kg · 오므린 30 cm','ω 비 약 '+fx(d.ratio,2)+' 배','덜 오므리면 효과가 작다']],
    data:{cols:['추 m (kg)','ω 비 측정','ω 비 이론','차이 (%)'], rows:r05(1,15,1).rows.map(function(q){ return [fx(q.m,1),fx(q.ratio,2),fx(q.ideal,2),fx((q.ratio/q.ideal-1)*100,0)]; })},
    analysis:'T₁/T₂ 가 I₁/I₂ 와 일치하는지 y = x 그래프로 확인한다. 의자 마찰 때문에 측정 중에 L 이 조금 줄어드는 것이 계통 오차다. 팔을 오므리는 시간을 짧게 하고 영상 프레임으로 구간을 정한다.',
    special:['🎓 연구 설계',[['연구 질문','팔을 오므리면 각속도는 몇 배가 되는가?'],['독립변인','추 질량 · 오므린 반지름'],['종속변인','각속도 비'],['통제변인','처음 속도 · 의자 · 자세'],['기대 결과','$\\omega_2/\\omega_1=I_1/I_2$']]],
    fails:[['의자 마찰로 속도가 줄어든다','오므리는 동안만 측정하고 매끄러운 의자를 쓴다'],['어지럽다','회전 속도를 낮추고 한 번에 몇 초 이하로, 즉시 중단'],['추를 놓친다','무겁지 않은 추, 손잡이가 있는 물건, 주위를 비운다']],
    up:['<b>C03</b> — 각운동량 마술 쇼.','<b>I06</b> — 역진자 균형 제어.','<b>종합</b> — 보고서 실험 B.'],
    next:['원리④ 각운동량',5],
    eval:[['정확성','ω 비 이론 대비'],['반복성','3 회'],['분석','I₁/I₂ 비교'],['안전','어지러움 · 낙하']],
    tip:'영상 두 컷(벌린 팔 · 오므린 팔)과 속도비 숫자 한 줄이 가장 강력한 발표 자료입니다.' });
})();
SIMS.R05={ q:'추의 질량과 오므린 팔의 반지름을 바꾸면 회전 속도는 몇 배가 될까?',
  a:{nm:'한 손의 추 질량 m',min:0,max:3,step:0.5,val:1,unit:'kg',d:1}, b:{nm:'오므린 반지름 r_in',min:8,max:40,step:1,val:15,unit:'cm',d:0},
  cap1:'위에서 본 회전 의자. 팔을 벌렸다 오므리면 관성 모멘트가 줄어 각속도(초록)가 늘어납니다. 노란 점은 추입니다.',
  cap2:'📊 추 질량 m 대 각속도 비 — 이론 곡선과 측정점(잡음 6 %). 추가 무거울수록 오므림의 효과가 큽니다.',
  note:'모형 : 사람 + 의자 $I_{몸}=1.2$ kg·m² · 벌린 반지름 0.6 m · $I=I_{몸}+2mr^2$ · $\\omega_2/\\omega_1=I_1/I_2$ · 마찰 무시 · 측정 잡음 6 %. 안전을 위해 추는 3 kg 이하 · 저속.',
  anim:function(ctx,w,h,t,m,ri,S){ var o=r05(m,ri,S.seed), cx=w*0.3, cy=h*0.55, sc=Math.min(w*0.2,h*0.36)/0.65, ph=(t%8)/8, mix=ph<0.4?0:(ph<0.6?(ph-0.4)/0.2:(ph<0.9?1:1-(ph-0.9)/0.1)), r=(60*(1-mix)+ri*mix)/100, I=1.2+2*m*r*r, wn=(1.2+2*m*0.36)*1.0/I*1.2, th=(this.th||0)+wn*0.03; this.th=th; var hr=r*sc;
    ctx.strokeStyle='rgba(148,163,184,.4)'; ctx.setLineDash([3,4]); ctx.beginPath(); ctx.arc(cx,cy,0.6*sc,0,TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy,ri/100*sc,0,TAU); ctx.stroke(); ctx.setLineDash([]);
    cvCirc(ctx,cx,cy,16,'#e2e8f0',COL.axis2,1.4); [0,Math.PI].forEach(function(a){ var px=cx+hr*Math.cos(a+th), py=cy+hr*Math.sin(a+th); cvLine(ctx,[[cx,cy],[px,py]],COL.white,4); cvCirc(ctx,px,py,5+m*2.4,COL.amber,COL.white,1.4); });
    var bx=w*0.62; cvText(ctx,'I₁ = '+o.I1.toFixed(2)+' → I₂ = '+o.I2.toFixed(2)+' kg·m²',bx,h*0.3,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'ω 가 '+o.ratio.toFixed(2)+' 배',bx,h*0.44,COL.ok,'bold 14px system-ui,sans-serif'); cvText(ctx,'한 바퀴 시간 T₁/T₂ = '+o.ratio.toFixed(2),bx,h*0.58,COL.tick,'12px system-ui,sans-serif'); cvText(ctx,mix>0.7?'팔 오므림':'팔 벌림',cx,cy+0.6*sc+22,mix>0.7?COL.ok:COL.tick,'bold 12px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,m,ri,S){ var o=r05(m,ri,S.seed), pts=o.rows.map(function(q){ return [q.m,q.ratio]; }), cur=[], k; for(k=0;k<=3.01;k+=0.1) cur.push([k,(1.2+2*k*0.36)/(1.2+2*k*Math.pow(ri/100,2))]);
    lineGraph(ctx,w,h,{xmin:0,xmax:3.2,ymin:0.8,ymax:Math.max(2,cur[cur.length-1][1]*1.1),xl:'한 손의 추 질량 m (kg)',yl:'각속도 비 ω₂/ω₁',title:'추 질량 대 각속도 비 — 무거울수록 효과가 크다',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[m,o.ratio],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:1}); },
  kv:function(m,ri,S){ var o=r05(m,ri,S.seed); return [['관성 모멘트 I₁',o.I1.toFixed(2)+' kg·m²','a'],['오므린 I₂',o.I2.toFixed(2)+' kg·m²','g'],['각속도 비 ω₂/ω₁',o.ratio.toFixed(2)+' 배','v2'],['운동 에너지 비 K₂/K₁',o.K.toFixed(2)+' 배','r'],['각운동량','보존']]; } };
