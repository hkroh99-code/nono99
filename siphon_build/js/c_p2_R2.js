/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R06 ~ R10 : 정점 압력 · 수온–점성–유량 · 두 통 평형 · 노즐 지름 · 설탕물 농도
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R06 : 정점 압력 마노미터 ───────────────────────────────────────── */
function r06(Hc,h,seed){ var rn=rng32(seed*13+9), s=siphon(h/100,0.01,2*Hc/100+1.2,1e-3,1), dyn=s.v*s.v/(2*G)*100, read=Hc+dyn, pc=pCrest(Hc/100,s.v), rows=[], i;
  for(i=0;i<6;i++){ var hc=15+20*i, q=siphon(h/100,0.01,2*hc/100+1.2,1e-3,1); rows.push({Hc:hc,r:hc+q.v*q.v/(2*G)*100+0.5*gaussR(rn),ideal:hc}); }
  return {v:s.v,dyn:dyn,read:read,pc:pc,rows:rows}; }
(function(){ var a=r06(60,50,1), b=r06(20,50,1), c=r06(110,50,1), d=r06(60,80,1);
  pk({ id:'R06', t:'정점 압력 재기 — 마노미터로 본 압력 강하', icon:'🌡️', lv:2, dur:'1 주', cost:'약 1 만 원',
    one:'사이펀 정점에 투명 빨대 마노미터를 달아 정점 높이 $H_c$ = 15 ~ 115 cm 에서 수주 높이차를 읽고 대기압과의 차이 $\\Delta p=\\rho g(H_c+v^2/2g)$ 가 정점 높이에 따라 직선으로 커지는지 확인한다.',
    q:'정점이 높아지면 정점의 압력은 얼마나 낮아질까? 유속은 압력에 얼마나 영향을 줄까?',
    why:'<b>정점 압력이 대기압보다 낮다</b>는 사실을 눈으로 확인하는 실험입니다. 투명 관 속 수주가 올라가는 높이가 곧 압력 강하이므로 「관이 물을 끌어당기는」 것이 아니라 「압력이 줄어드는」 것임을 보여 줍니다.',
    link:'원리② 정점 압력과 시동(3번 탭).',
    cap:'정점(가운데 위)에 가는 투명 관(마노미터)을 세워 물이 올라간 높이 $\\Delta h$ 를 읽는다. 호스 · 투명 빨대 · T 자 연결 · 줄자 · 기록표',
    parts:[['투명 호스','D = 10 mm','투명 호스 2.5 m','정점이 높게 올라가도록.'],['T 연결 부품','정점에 마노미터','T 자 커넥터','새지 않게 밀봉(실리콘 테이프).'],['마노미터 관','가는 투명 관','투명 빨대 + 테이프','세워 수주를 읽는다.'],['줄자','Hc · Δh','줄자','1 mm 단위로.'],['위 통 · 아래 통','통 2 개','양동이','수위 일정.'],['기록표','Hc · Δh','스프레드시트','Δh 대 Hc 직선.']],
    budget:BUD,
    steps:['정점에 T 자 부품으로 마노미터 빨대를 세운다(위는 열려 있되 물이 넘치지 않게 길게).','정점 높이 $H_c$ 를 15, 35, 55, 75, 95, 115 cm 로 바꿔 사이펀을 시동하고 흐르는 동안 마노미터의 수주 높이 $\\Delta h$ 를 읽는다.','$\\Delta h$ 대 $H_c$ 그래프를 그려 직선 기울기가 1 에 가까운지 확인한다.','정지했을 때($v=0$)와 흐를 때의 차이로 동압 항 $v^2/2g$ 를 구한다.','정점 압력 $p_c=p_{atm}-\\rho g\\Delta h$ 를 계산한다.'],
    vars:['정점 높이 H_c','마노미터 수주 Δh','높이차 · 유속 · 관 지름'],
    predict:[['H_c = 60 cm · h = 50 cm','Δh ≈ '+fx(a.read,1)+' cm · p_c ≈ '+fx(a.pc,1)+' kPa','$\\Delta h=H_c+v^2/2g$'],['H_c = 20 cm','Δh ≈ '+fx(b.read,1)+' cm','낮은 정점 — 압력 강하 작다'],['H_c = 110 cm','Δh ≈ '+fx(c.read,1)+' cm · p_c ≈ '+fx(c.pc,1)+' kPa','압력이 더 낮다'],['H_c = 60 cm · h = 80 cm','Δh ≈ '+fx(d.read,1)+' cm','유속이 크면 동압 항이 더 커진다']],
    data:{cols:['H_c (cm)','Δh 측정 (cm)','H_c 이론 (cm)','차이 (cm)'], rows:r06(60,50,1).rows.map(function(q){ return [fx(q.Hc,0),fx(q.r,1),fx(q.ideal,1),fx(q.r-q.ideal,1)]; })},
    analysis:'$\\Delta h$ 대 $H_c$ 직선의 기울기가 1 이고 절편이 $v^2/2g$ (cm) 에 가까운지 본다. 마노미터의 지름이 너무 가늘면 모세관 상승이 더해지고 너무 굵으면 흐름에 영향을 준다. 압력 강하가 증기압에 가까워지면 기포가 생긴다.',
    expect:'Δh = H_c + v²/2g (기울기 1)',
    fails:[['마노미터 물이 올라가지 않는다','연결부에서 공기가 샌다 — 밀봉 점검'],['수주가 출렁인다','관을 곧게 세우고 흐름이 안정된 뒤 읽는다'],['기포가 정점에 모인다','정점을 낮추거나 물을 새로 갈아 용존 공기를 줄인다']],
    up:['<b>R05</b> — 시동 임계.','<b>C04</b> — 사이펀 분수.','<b>종합1(15번 탭)</b>.'],
    next:['원리② 정점 압력과 시동',3] });
})();
SIMS.R06={ q:'정점 높이와 높이차를 바꾸면 정점 압력과 마노미터 수주는 어떻게 될까?',
  a:{nm:'정점 높이 H_c',min:10,max:120,step:5,val:60,unit:' cm',d:0}, b:{nm:'높이차 h',min:20,max:80,step:5,val:50,unit:' cm',d:0},
  cap1:'정점에서 마노미터 수주가 올라갑니다. 높을수록 정점 압력이 낮습니다.',
  cap2:'📊 정점 높이 H_c 대 마노미터 수주 — 기울기 1 직선(이론)과 측정점.',
  note:'모형 : $\\Delta h=H_c+v^2/2g$, 관 지름 10 mm, 읽기 잡음 0.5 cm. 정점 압력은 $p_{atm}-\\rho g\\Delta h$.',
  anim:function(ctx,w,h,t,Hc,hh,S){ var o=r06(Hc,hh,S.seed), Hv=Math.min(70,10+Hc*0.5); var g=siphScene(ctx,w,h,{hU:Math.min(hh,30),Hc:Hv,hL:null,v:o.v,on:true,tankH:25,pTop:o.pc},t); var xm=w*0.41, ytop=g.gy(Math.min(hh,30)+Hv); var hh2=Math.min(90,o.read*0.9); cvRect(ctx,xm,ytop-hh2-6,8,hh2+6,'rgba(56,189,248,.0)',COL.axis2,1.2); ctx.fillStyle='rgba(56,189,248,.6)'; ctx.fillRect(xm+1,ytop-hh2,6,hh2); cvText(ctx,'Δh = '+o.read.toFixed(1)+' cm',xm+14,ytop-hh2/2,COL.ok,'bold 11.5px system-ui,sans-serif'); ttl(ctx,'정점 압력 p_c = '+o.pc.toFixed(1)+' kPa (대기압 101.3 kPa 보다 낮다)'); },
  graph:function(ctx,w,h,Hc,hh,S){ var o=r06(Hc,hh,S.seed), cur=[[10,10+r06(10,hh,S.seed).dyn],[120,120+r06(120,hh,S.seed).dyn]];
    lineGraph(ctx,w,h,{xmin:0,xmax:125,ymin:0,ymax:135,xl:'정점 높이 H_c (cm)',yl:'마노미터 수주 Δh (cm)',title:'H_c 대 Δh',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.Hc,q.r]; }),now:[Hc,o.read],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:0,lw:90}); },
  kv:function(Hc,hh,S){ var o=r06(Hc,hh,S.seed); return [['정점 압력 p_c',o.pc.toFixed(1)+' kPa','a'],['마노미터 Δh',o.read.toFixed(1)+' cm','g'],['동압 항 v²/2g',o.dyn.toFixed(1)+' cm','v2'],['대기압 대비',(101.3-o.pc).toFixed(1)+' kPa 낮음','r'],['유속 v',o.v.toFixed(2)+' m/s']]; } };

/* ── R07 : 수온 → 점성 → 유량 (가는 관) ─────────────────────────────── */
function r07(T,D,seed){ var rn=rng32(seed*7+11), mu=muW(T), s=siphon(0.5,D/1000,1,mu,1), rows=[], i;
  for(i=0;i<6;i++){ var tt=10+10*i, q=siphon(0.5,D/1000,1,muW(tt),1); rows.push({T:tt,q:qm(q.Q)*(1+0.03*gaussR(rn)),ideal:qm(q.Q)}); }
  return {mu:mu,Q:qm(s.Q),Re:s.Re,reg:s.reg,rel:s.Q/siphon(0.5,D/1000,1,muW(10),1).Q,rows:rows}; }
(function(){ var a=r07(20,2.5,1), b=r07(10,2.5,1), c=r07(60,2.5,1), d=r07(20,4,1);
  pk({ id:'R07', t:'수온과 유량 — 따뜻한 물이 더 빨리 흐를까', icon:'🌡️', lv:2, dur:'1 주', cost:'약 1 만 5 천 원',
    one:'지름 2.5 mm 가는 관 사이펀에 10 ~ 60 °C 의 물(온수는 위험하지 않은 60 °C 이하)을 흘려 유량을 재고 점성 $\\mu(T)$ 가 줄어 $Q\\propto1/\\mu$ 로 늘어나는 것을 확인한다.',
    q:'수온이 올라가면 유량은 얼마나 늘까? 점성은 온도에 어떻게 변할까?',
    why:'<b>꿀을 데우면 잘 흐르는 것</b>과 같은 현상을 정량적으로 보여 줍니다. 가는 관 층류에서는 $Q\\propto1/\\mu$ 이므로 온도 변화가 유량 변화로 그대로 나타나 점도계의 원리가 됩니다.',
    link:'원리③ 마찰과 점성(4번 탭) · 종합3(17번 탭).',
    cap:'온도를 바꾼 물을 가는 관 사이펀으로 흘려(가운데) 같은 높이차에서 유량을 잰다. 가는 관 · 온도계 · 보온병 · 눈금 통 · 스톱워치 · 기록표',
    parts:[['가는 관','D = 2.5 mm · 1 m','투명 가는 관','층류가 되도록 가늘게.'],['온도계','10 ~ 60 °C','주방 온도계','물의 온도를 재서 기록.'],['위 통','큰 통','보온병 · 양동이','온도가 유지되도록.'],['눈금 통','부피','메스실린더','50 mL.'],['스톱워치','시간','스마트폰','3 회.'],['안전','화상 방지','장갑 · 60 °C 이하','끓는 물은 쓰지 않는다.']],
    budget:BUD,
    steps:['가는 관(2.5 mm, 1 m)으로 높이차 50 cm 의 사이펀을 만든다.','물 온도를 10, 20, 30, 40, 50, 60 °C 로 맞추고(60 °C 이하) 온도를 잰 직후 50 mL 를 받는 시간을 3 회씩 잰다.','$Q$ 대 $T$ 그래프를 그리고 같은 온도에서 $1/\\mu$ 와 비교한다.','10 °C 대비 유량비를 계산해 점성비와 비교한다.','레이놀즈 수를 계산해 층류인지 확인한다.'],
    vars:['수온 T','유량 Q','관 지름 · 길이 · 높이차'],
    predict:[['T = 20 °C · D = 2.5 mm','Q ≈ '+fx(a.Q,2)+' mL/s · μ = '+fx(a.mu*1000,2)+' mPa·s','$Q\\propto1/\\mu$'],['T = 10 °C','Q ≈ '+fx(b.Q,2)+' mL/s','차가우면 느리다'],['T = 60 °C','Q ≈ '+fx(c.Q,2)+' mL/s ('+fx(c.rel,2)+' 배)','점성이 약 1/3'],['T = 20 °C · D = 4 mm','Q ≈ '+fx(d.Q,2)+' mL/s ('+d.reg+')','굵으면 마찰 영향이 줄어든다']],
    data:{cols:['T (°C)','Q 측정 (mL/s)','이론 (mL/s)','차이 (%)'], rows:r07(20,2.5,1).rows.map(function(q){ return [fx(q.T,0),fx(q.q,2),fx(q.ideal,2),fx((q.q/q.ideal-1)*100,1)]; })},
    analysis:'$Q$ 대 $1/\\mu(T)$ 가 원점을 지나는 직선이면 층류 하겐–푸아죄유가 성립한다. 점성은 $\\mu\\approx2.414\\times10^{-5}\\cdot10^{247.8/(T+133.15)}$ Pa·s. 관 속에서 물이 식거나 데워져 온도가 변하는 것이 주된 오차이다.',
    expect:'Q ∝ 1/μ(T)',
    fails:[['온도가 떨어져 값이 이상하다','측정을 빨리 하고 보온병을 쓴다'],['유량이 너무 작아 읽기 어렵다','받는 부피를 20 mL 로 줄이고 반복'],['난류가 되어 직선이 깨진다','관을 더 가늘게 하거나 높이차를 줄인다']],
    up:['<b>R10</b> — 설탕물과 유량.','<b>I09</b> — 사이펀 점도계.','<b>종합3(17번 탭)</b> — 점성 μ.'],
    next:['원리③ 마찰과 점성',4] });
})();
SIMS.R07={ q:'수온과 관 지름을 바꾸면 가는 관 사이펀의 유량은 어떻게 변할까?',
  a:{nm:'수온 T',min:10,max:60,step:5,val:20,unit:' °C',d:0}, b:{nm:'관 지름 D',min:2,max:4,step:0.5,val:2.5,unit:' mm',d:1},
  cap1:'따뜻한 물일수록 점성이 작아 가는 관에서 훨씬 빨리 흐릅니다.',
  cap2:'📊 수온 대 유량 — 이론(선)과 측정(점). 점성 감소를 그대로 따라 올라갑니다.',
  note:'모형 : 높이차 50 cm, 길이 1 m, $\\mu(T)$ 는 간이식, 층류에서 $Q\\propto1/\\mu$, 측정 잡음 3 %.',
  anim:function(ctx,w,h,t,T,D,S){ var o=r07(T,D,S.seed); siphScene(ctx,w,h,{hU:50,Hc:25,hL:null,v:Math.min(1.8,o.Q/(PI*D*D/4)*0.3),on:true,tankH:35},t); ttl(ctx,T+' °C · μ = '+(o.mu*1000).toFixed(2)+' mPa·s · Q = '+o.Q.toFixed(2)+' mL/s · '+o.reg); },
  graph:function(ctx,w,h,T,D,S){ var o=r07(T,D,S.seed), cur=[],k; for(k=10;k<=60;k+=2) cur.push([k,qm(siphon(0.5,D/1000,1,muW(k),1).Q)]);
    lineGraph(ctx,w,h,{xmin:5,xmax:65,ymin:0,ymax:cur[cur.length-1][1]*1.1,xl:'수온 T (°C)',yl:'유량 Q (mL/s)',title:'T 대 Q',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.T,q.q*(D/2.5>0?1:1)]; }),now:[T,o.Q],legend:[['이론',COL.ok],['측정(D=2.5)',COL.blue],['지금',COL.amber]],yd:2,lw:120}); },
  kv:function(T,D,S){ var o=r07(T,D,S.seed); return [['점성 μ',(o.mu*1000).toFixed(2)+' mPa·s','a'],['유량 Q',o.Q.toFixed(2)+' mL/s','g'],['레이놀즈 수',Math.round(o.Re)+' ('+o.reg+')','v2'],['10 °C 대비',o.rel.toFixed(2)+' 배','r'],['1/μ (상대)',(1e-3/o.mu).toFixed(2)]]; } };

/* ── R08 : 두 통의 평형 수위 (부피 보존) ───────────────────────────── */
function r08(ratio,h0,seed){ var rn=rng32(seed*17+5), A1=300, A2=A1*ratio, h1=10+h0, h2=10, hf=(A1*h1+A2*h2)/(A1+A2), a=PI*0.01*0.01/4, K=siphon(h0/100,0.01,1,1e-3,1).K, T=tDrain(A1*A2/(A1+A2)/1e4,a,K,h0/100), rows=[], i, rs=[0.5,1,1.5,2,3,4];
  for(i=0;i<6;i++){ var hh=(A1*h1+A1*rs[i]*h2)/(A1+A1*rs[i]); rows.push({r:rs[i],f:hh+0.3*gaussR(rn),ideal:hh}); }
  return {hf:hf,T:T,drop:h1-hf,rise:hf-h2,rows:rows,h1:h1,h2:h2}; }
(function(){ var a=r08(1,20,1), b=r08(0.5,20,1), c=r08(4,20,1), d=r08(1,35,1);
  pk({ id:'R08', t:'두 통의 평형 — 부피 보존으로 최종 수위 예측', icon:'⚖️', dur:'1 주', cost:'약 1 만 원',
    one:'단면적이 다른 두 통(위 통 300 cm²)을 호스 사이펀으로 이어 최종 수위 $h_f=\\dfrac{A_1h_1+A_2h_2}{A_1+A_2}$ 를 예측하고 실제 평형 수위와 비교한다.',
    q:'두 통의 수위는 평균에서 만날까? 아래 통이 더 넓으면 위 통 수위는 얼마나 내려갈까?',
    why:'<b>사이펀은 수면을 같게 만드는 장치</b>입니다. 물의 부피가 보존된다는 간단한 규칙으로 최종 수위를 예측하고, 단면적 비에 따라 위 · 아래 통의 수위 변화가 달라지는 것을 직접 확인합니다.',
    link:'원리④ 배수 시간과 두 통의 평형(5번 탭) · C10 사이펀 퍼즐.',
    cap:'단면적이 다른 두 통(가운데 연결 호스)에서 위 통은 내려가고 아래 통은 올라가 수위가 같아진다(오른쪽). 통 2 개 · 호스 · 줄자 · 눈금자 · 기록표',
    parts:[['위 통','A₁ = 300 cm²','수납통','수위 눈금자.'],['아래 통','A₂ = 150 ~ 1200 cm²','크기가 다른 통','단면적을 잰다.'],['호스','D = 10 mm','투명 호스','입구를 통 바닥 가까이.'],['눈금자','수위 읽기','줄자 · 테이프','1 mm 단위로.'],['스톱워치','평형 시간','스마트폰','수위차가 0 이 될 때까지.'],['기록표','A₂/A₁ · h_f','스프레드시트','h_f 대 A₂/A₁.']],
    budget:BUD,
    steps:['두 통의 밑면적을 재고 처음 수위(위 통 30 cm, 아래 통 10 cm)를 눈금자로 기록한다.','사이펀을 시동하고 수위가 더 이상 변하지 않을 때까지 기다려 최종 수위 $h_f$ 를 읽는다.','아래 통을 바꿔 $A_2/A_1$ = 0.5, 1, 1.5, 2, 3, 4 에서 반복한다.','$h_f$ 대 $A_2/A_1$ 그래프를 이론 곡선과 비교한다.','평형에 이르는 시간도 재어 이론 $T$ 와 비교한다.'],
    vars:['단면적 비 A₂/A₁ · 처음 수위차','최종 수위 h_f · 평형 시간','호스 · 출구 높이 · 수온'],
    predict:[['A₂/A₁ = 1 · h₀ = 20 cm','h_f ≈ '+fx(a.hf,1)+' cm · T ≈ '+fx(a.T,0)+' s','두 통 같으면 평균'],['A₂/A₁ = 0.5','h_f ≈ '+fx(b.hf,1)+' cm','아래 통이 좁으면 위 통에 가깝다'],['A₂/A₁ = 4','h_f ≈ '+fx(c.hf,1)+' cm','아래 통이 넓으면 아래 통에 가깝다'],['A₂/A₁ = 1 · h₀ = 35 cm','h_f ≈ '+fx(d.hf,1)+' cm','처음 차이가 커도 평균']],
    data:{cols:['A₂/A₁','h_f 측정 (cm)','이론 (cm)','차이 (cm)'], rows:r08(1,20,1).rows.map(function(q){ return [fx(q.r,1),fx(q.f,1),fx(q.ideal,1),fx(q.f-q.ideal,1)]; })},
    analysis:'$h_f$ 가 부피 보존 값과 일치하는지(오차 ±3 mm) 본다. 호스 속 물의 부피와 통 모서리(곡면)의 단면적 변화가 작은 오차를 만든다. 수위가 같아졌는데 멈추지 않으면 정점의 기포나 호스의 높이 차이가 원인이다.',
    expect:'h_f = (A₁h₁+A₂h₂)/(A₁+A₂)',
    fails:[['수위가 같지 않은데 멈춘다','입구가 공기에 닿았거나 기포가 들어왔다 — 다시 채운다'],['단면적을 정확히 모르겠다','통이 사각이면 밑면 가로 × 세로를 잰다'],['시간이 너무 길다','호스를 굵게 하거나 처음 수위차를 줄인다']],
    up:['<b>C10</b> — 사이펀 퍼즐.','<b>R04</b> — 배수 시간.','<b>종합2(16번 탭)</b>.'],
    next:['원리④ 배수 시간',5] });
})();
SIMS.R08={ q:'아래 통의 넓이와 처음 수위차를 바꾸면 최종 수위는 어디서 만날까?',
  a:{nm:'단면적 비 A₂/A₁',min:0.5,max:4,step:0.25,val:1,unit:' 배',d:2}, b:{nm:'처음 수위차 h₀',min:10,max:40,step:5,val:20,unit:' cm',d:0},
  cap1:'위 통은 내려가고 아래 통은 올라가 최종 수위(점선)에서 만납니다.',
  cap2:'📊 단면적 비 대 최종 수위 — 이론(곡선)과 측정(점).',
  note:'모형 : 위 통 300 cm², 처음 위 통 수위 = 10 + h₀ (출구 위), 아래 통 10 cm, 부피 보존, 측정 잡음 3 mm.',
  anim:function(ctx,w,h,t,ratio,h0,S){ var o=r08(ratio,h0,S.seed), f=Math.min(1,(t%12)/10), up=o.h1-(o.h1-o.hf)*f, lo=o.h2+(o.hf-o.h2)*f; siphScene(ctx,w,h,{hU:up,Hc:20,hL:lo,v:f<0.98?1:0,on:f<0.98,tankH:Math.max(30,o.h1)},t); ttl(ctx,'위 '+up.toFixed(1)+' cm → '+o.hf.toFixed(1)+' · 아래 '+lo.toFixed(1)+' cm → '+o.hf.toFixed(1)+' (최종 수위)'); },
  graph:function(ctx,w,h,ratio,h0,S){ var o=r08(ratio,h0,S.seed), cur=[],k; for(k=0.5;k<=4.01;k+=0.1) cur.push([k,r08(k,h0,S.seed).hf]);
    lineGraph(ctx,w,h,{xmin:0.3,xmax:4.2,ymin:0,ymax:o.h1*1.1,xl:'A₂/A₁',yl:'최종 수위 h_f (cm)',title:'A₂/A₁ 대 h_f',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.r,q.f*0+q.f+(h0-20)*0]; }),now:[ratio,o.hf],legend:[['이론',COL.ok],['측정(h₀=20)',COL.blue],['지금',COL.amber]],yd:0,xd:1,lw:120}); },
  kv:function(ratio,h0,S){ var o=r08(ratio,h0,S.seed); return [['최종 수위 h_f',o.hf.toFixed(1)+' cm','a'],['위 통 하강',o.drop.toFixed(1)+' cm','g'],['아래 통 상승',o.rise.toFixed(1)+' cm','v2'],['평형 시간',o.T.toFixed(0)+' s','r'],['부피 이동',(300*o.drop/1000).toFixed(2)+' L']]; } };

/* ── R09 : 노즐 지름 → 유량 ─────────────────────────────────────────── */
function r09(d,h,seed){ var rn=rng32(seed*11+2), s=siphon(h/100,d/1000,1,1e-3,1), rows=[], i, ds=[3,4,5,6,8,10];
  for(i=0;i<6;i++){ var q=siphon(h/100,ds[i]/1000,1,1e-3,1); rows.push({d:ds[i],q:qm(q.Q)*(1+0.04*gaussR(rn)),ideal:qm(q.Q)}); }
  return {Q:qm(s.Q),v:s.v,reg:s.reg,Re:s.Re,rows:rows}; }
(function(){ var a=r09(6,40,1), b=r09(3,40,1), c=r09(10,40,1), d=r09(6,70,1);
  pk({ id:'R09', t:'출구 노즐 지름 — 좁히면 빨라질까, 줄어들까', icon:'🪠', dur:'1 주', cost:'약 1 만 원',
    one:'같은 호스(10 mm) 끝에 지름이 다른 노즐(3 ~ 10 mm)을 달아 같은 높이차에서 유량 $Q$ 를 재고 $Q$ 대 $d^2$ 가 직선인지, 출구 속력이 노즐이 좁을수록 커지는지 확인한다.',
    q:'출구를 좁히면 유량이 늘어날까 줄어들까? 출구 속력은 어떻게 변할까?',
    why:'<b>호스 끝을 손가락으로 막으면 물이 멀리 나가지만 양은 줄어드는 것</b>을 정량적으로 정리합니다. 연속 방정식($Av$ 일정)과 에너지 보존을 함께 쓰는 좋은 연습입니다.',
    link:'원리① 높이차와 유속(2번 탭) · 연속 방정식.',
    cap:'호스 끝에 노즐(가운데)을 달아 출구 속력과 유량을 잰다. 호스 · 노즐(빨대 · 주사기 끝) · 눈금 통 · 줄자 · 기록표',
    parts:[['호스','D = 10 mm','투명 호스 1 m','고정.'],['노즐','d = 3 ~ 10 mm','빨대 · 주사기 끝','안지름을 캘리퍼스로.'],['위 통','큰 통','양동이','수위 일정.'],['눈금 통','부피','메스실린더','500 mL.'],['줄자','높이차 · 사거리','줄자','수평으로 나간 거리.'],['기록표','d · Q · v','스프레드시트','Q 대 d².']],
    budget:BUD,
    steps:['높이차 40 cm 로 고정하고 노즐 없이 유량 $Q_0$ 를 잰다.','지름 3, 4, 5, 6, 8, 10 mm 노즐을 차례로 달아 같은 방법으로 $Q$ 를 잰다.','$Q$ 대 $d^2$ 그래프를 그려 직선(작은 $d$)과 포화(큰 $d$)를 확인한다.','출구 속력 $v=Q/A_n$ 을 계산해 노즐이 좁을수록 커지는지 확인한다.','수평으로 나가는 물줄기의 사거리로 속력을 어림한다.'],
    vars:['노즐 지름 d','유량 Q · 출구 속력 v','높이차 · 호스 · 수위'],
    predict:[['d = 6 mm · h = 40 cm','Q ≈ '+fx(a.Q,1)+' mL/s · v = '+fx(a.v,2)+' m/s','$Q=A_nv$'],['d = 3 mm','Q ≈ '+fx(b.Q,1)+' mL/s · v = '+fx(b.v,2)+' m/s','좁으면 유량은 줄고'],['d = 10 mm','Q ≈ '+fx(c.Q,1)+' mL/s · v = '+fx(c.v,2)+' m/s','넓으면 마찰로 속력이 작다'],['d = 6 mm · h = 70 cm','Q ≈ '+fx(d.Q,1)+' mL/s','높이차가 크면 유량이 √ 로 증가']],
    data:{cols:['d (mm)','Q 측정 (mL/s)','이론 (mL/s)','차이 (%)'], rows:r09(6,40,1).rows.map(function(q){ return [fx(q.d,0),fx(q.q,1),fx(q.ideal,1),fx((q.q/q.ideal-1)*100,1)]; })},
    analysis:'작은 노즐에서는 노즐이 전체 저항을 정해 $Q\\propto d^2$ 이고, 큰 노즐에서는 호스 마찰이 지배해 포화한다. 측정 노즐의 안지름 오차(±0.2 mm)가 $d^2$ 에 크게 영향을 준다.',
    expect:'작은 d 에서 Q ∝ d², 큰 d 에서 포화',
    fails:[['노즐이 빠진다','호스와 단단히 연결하고 테이프로 밀봉'],['사거리가 흔들린다','출구를 수평으로 고정하고 바람을 막는다'],['유량이 작아 읽기 어렵다','받는 부피를 늘린다']],
    up:['<b>I07</b> — 점적 관개.','<b>C04</b> — 사이펀 분수.','<b>종합1(15번 탭)</b>.'],
    next:['원리① 높이차와 유속',2] });
})();
SIMS.R09={ q:'노즐 지름과 높이차를 바꾸면 유량과 출구 속력은 어떻게 달라질까?',
  a:{nm:'노즐 지름 d',min:3,max:10,step:1,val:6,unit:' mm',d:0}, b:{nm:'높이차 h',min:20,max:80,step:5,val:40,unit:' cm',d:0},
  cap1:'노즐이 좁을수록 물줄기는 빨라지지만 유량은 줄어듭니다.',
  cap2:'📊 노즐 지름의 제곱 대 유량 — 작은 d 에서 직선, 큰 d 에서 포화.',
  note:'모형 : 호스 10 mm 끝에 노즐을 단 것이 아니라 지름 d 의 관을 쓰는 단순 모형($K_m=1$, 길이 1 m), 측정 잡음 4 %.',
  anim:function(ctx,w,h,t,d,hh,S){ var o=r09(d,hh,S.seed); siphScene(ctx,w,h,{hU:hh,Hc:25,hL:null,v:o.v,on:true,tankH:35},t); ttl(ctx,'노즐 '+d+' mm · Q = '+o.Q.toFixed(1)+' mL/s · v = '+o.v.toFixed(2)+' m/s'); },
  graph:function(ctx,w,h,d,hh,S){ var o=r09(d,hh,S.seed), cur=[],k; for(k=3;k<=10.01;k+=0.5) cur.push([k*k,qm(siphon(hh/100,k/1000,1,1e-3,1).Q)]);
    lineGraph(ctx,w,h,{xmin:0,xmax:105,ymin:0,ymax:cur[cur.length-1][1]*1.1,xl:'d² (mm²)',yl:'유량 Q (mL/s)',title:'d² 대 Q',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.d*q.d,q.q*hh/40*0+q.q]; }),now:[d*d,o.Q],legend:[['이론',COL.ok],['측정(h=40)',COL.blue],['지금',COL.amber]],yd:0,lw:120}); },
  kv:function(d,hh,S){ var o=r09(d,hh,S.seed); return [['유량 Q',o.Q.toFixed(1)+' mL/s','a'],['출구 속력 v',o.v.toFixed(2)+' m/s','g'],['레이놀즈 수',Math.round(o.Re)+' ('+o.reg+')','v2'],['노즐 면적',(PI*d*d/4).toFixed(1)+' mm²','r'],['Q/d²',(o.Q/(d*d)).toFixed(3)]]; } };

/* ── R10 : 설탕물 농도 → 유량 ───────────────────────────────────────── */
function r10(c,D,seed){ var rn=rng32(seed*19+4), mu=muSugar(c), rho=1000+3.8*c, s=siphon(0.5,D/1000,1,mu,1,rho), rows=[], i;
  for(i=0;i<6;i++){ var cc=10*i, mm=muSugar(cc), q=siphon(0.5,D/1000,1,mm,1,1000+3.8*cc); rows.push({c:cc,q:qm(q.Q)*(1+0.04*gaussR(rn)),ideal:qm(q.Q)}); }
  return {mu:mu,rho:rho,Q:qm(s.Q),Re:s.Re,reg:s.reg,rel:s.Q/siphon(0.5,D/1000,1,1e-3,1).Q,rows:rows}; }
(function(){ var a=r10(20,3,1), b=r10(0,3,1), c=r10(40,3,1), d=r10(20,6,1);
  pk({ id:'R10', t:'설탕물 농도와 유량 — 끈적일수록 느려진다', icon:'🍯', lv:2, dur:'1 주', cost:'약 1 만 5 천 원',
    one:'설탕물 농도(0 ~ 50 %)를 바꿔 가며 지름 3 mm 가는 관 사이펀의 유량을 재서 점성이 커질수록($\\mu$ : 1 → 15 mPa·s) 유량이 $1/\\mu$ 로 줄어드는지 확인한다.',
    q:'설탕을 녹이면 유량은 얼마나 줄까? 높은 농도에서 급격히 느려지는 까닭은?',
    why:'<b>시럽 · 꿀처럼 점성이 큰 액체</b>가 관에서 어떻게 흐르는지를 정량적으로 보여 줍니다. 점성이 농도에 따라 지수적으로 커져서 유량이 급격히 줄어드는 비선형성이 핵심입니다.',
    link:'원리③ 마찰과 점성(4번 탭) · 오개념 9.',
    cap:'설탕물(0 ~ 50 %)을 가는 관 사이펀으로 흘려(가운데) 같은 높이차에서 유량을 잰다. 설탕 · 저울 · 가는 관 · 눈금 통 · 스톱워치 · 기록표',
    parts:[['설탕 · 저울','농도 0 ~ 50 %','설탕 · 주방 저울','질량 %로 만든다.'],['가는 관','D = 3 mm · 1 m','가는 투명 관','깨끗이 씻어 재사용.'],['위 통','큰 통','양동이','고정 높이.'],['눈금 통','부피','메스실린더','50 mL.'],['스톱워치','시간','스마트폰','3 회.'],['안전','끈적임 · 미끄럼','수건 · 쟁반','바닥 닦기. 먹지 않는다.']],
    budget:BUD,
    steps:['설탕 농도 0, 10, 20, 30, 40, 50 %(질량 %)의 설탕물을 만든다.','같은 가는 관 사이펀(높이차 50 cm)으로 각 농도에서 50 mL 를 받는 시간을 3 회 재어 $Q$ 를 구한다.','$Q$ 대 농도 그래프와 $Q$ 대 $1/\\mu$ 그래프를 그린다.','$\\mu$ 의 값은 표(참고)를 쓰고 직선 기울기와 비교한다.','밀도가 달라도 유량에 거의 영향이 없음을 논의한다.'],
    vars:['설탕물 농도 c','유량 Q','관 지름 · 길이 · 높이차 · 수온'],
    predict:[['20 % · D = 3 mm','Q ≈ '+fx(a.Q,2)+' mL/s · μ = '+fx(a.mu*1000,2)+' mPa·s','$Q\\propto1/\\mu$'],['0 % (물)','Q ≈ '+fx(b.Q,2)+' mL/s','기준'],['40 %','Q ≈ '+fx(c.Q,2)+' mL/s ('+fx(c.rel,2)+' 배)','점성이 약 6 배 → 유량 약 1/6'],['20 % · D = 6 mm','Q ≈ '+fx(d.Q,1)+' mL/s','굵은 관은 난류 쪽이라 영향이 작다']],
    data:{cols:['농도 (%)','Q 측정 (mL/s)','이론 (mL/s)','차이 (%)'], rows:r10(20,3,1).rows.map(function(q){ return [fx(q.c,0),fx(q.q,2),fx(q.ideal,2),fx((q.q/q.ideal-1)*100,1)]; })},
    analysis:'$Q$ 대 $1/\\mu$ 가 원점을 지나는 직선이면 층류가 성립한다. 농도가 높을수록 점성이 지수적으로 증가해 유량이 급격히 줄어든다. 온도가 1 °C 달라도 점성이 크게 변하므로 온도를 함께 기록한다.',
    expect:'Q ∝ 1/μ (농도 ↑ → 급감)',
    fails:[['가는 관이 막힌다','설탕이 덜 녹은 것 — 완전히 녹이고 거른다'],['유량이 너무 작다','받는 부피를 10 mL 로 줄이거나 높이차를 늘린다'],['온도 때문에 값이 흔들린다','같은 온도에서 측정']],
    up:['<b>R07</b> — 수온과 유량.','<b>I09</b> — 사이펀 점도계.','<b>종합3(17번 탭)</b>.'],
    next:['원리③ 마찰과 점성',4] });
})();
SIMS.R10={ q:'설탕물 농도와 관 지름을 바꾸면 사이펀 유량은 얼마나 달라질까?',
  a:{nm:'설탕물 농도 c',min:0,max:50,step:5,val:20,unit:' %',d:0}, b:{nm:'관 지름 D',min:2,max:6,step:1,val:3,unit:' mm',d:0},
  cap1:'농도가 높을수록 액체가 끈적여 가는 관에서 느리게 흐릅니다.',
  cap2:'📊 설탕물 농도 대 유량 — 이론(선)과 측정(점). 높은 농도에서 급격히 줄어듭니다.',
  note:'모형 : 높이차 50 cm · 길이 1 m, 점성은 표(20 °C 근사)에서 보간, 밀도 $1000+3.8c$ kg/m³, 측정 잡음 4 %.',
  anim:function(ctx,w,h,t,c,D,S){ var o=r10(c,D,S.seed); siphScene(ctx,w,h,{hU:50,Hc:25,hL:null,v:Math.min(1.8,o.Q/(PI*D*D/4)*0.3),on:true,tankH:35},t); ttl(ctx,c+' % · μ = '+(o.mu*1000).toFixed(2)+' mPa·s · Q = '+o.Q.toFixed(2)+' mL/s · '+o.reg); },
  graph:function(ctx,w,h,c,D,S){ var o=r10(c,D,S.seed), cur=[],k; for(k=0;k<=50;k+=2) cur.push([k,qm(siphon(0.5,D/1000,1,muSugar(k),1,1000+3.8*k).Q)]);
    lineGraph(ctx,w,h,{xmin:0,xmax:52,ymin:0,ymax:cur[0][1]*1.1,xl:'설탕물 농도 (%)',yl:'유량 Q (mL/s)',title:'농도 대 Q',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.c,q.q*(D/3>0?1:1)]; }),now:[c,o.Q],legend:[['이론',COL.ok],['측정(D=3)',COL.blue],['지금',COL.amber]],yd:2,lw:120}); },
  kv:function(c,D,S){ var o=r10(c,D,S.seed); return [['점성 μ',(o.mu*1000).toFixed(2)+' mPa·s','a'],['유량 Q',o.Q.toFixed(2)+' mL/s','g'],['물 대비',o.rel.toFixed(2)+' 배','v2'],['밀도',o.rho.toFixed(0)+' kg/m³','r'],['레이놀즈 수',Math.round(o.Re)+' ('+o.reg+')']]; } };
