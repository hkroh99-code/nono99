/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R01 ~ R05 : 빛 감약 · 용액 농도 · 광학 CT · 공기 중 음속 · 소리의 반사
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R01 : 빛 감약 — 필름 장수 N 과 투과율 (램버트–비어) ──────────────────── */
var R01 = { E0:800 };
function r01(N,T1,seed){ var r=rng32(seed*101+Math.round(T1*100)), pts=[], i; for(i=0;i<=12;i++){ var E=R01.E0*Math.pow(T1,i); pts.push([i,Math.max(1,nz(r,E,0.03))]); }
  var fit=ols(pts.map(function(q){ return [q[0],Math.log(R01.E0/q[1])]; }),false); return {pts:pts, fit:fit, E:R01.E0*Math.pow(T1,N), mu:-Math.log(T1), hvl:Math.LN2/(-Math.log(T1))}; }
(function(){
  var a=r01(3,0.8,1), b=r01(6,0.8,1), c=r01(3,0.6,1), d=r01(8,0.9,1);
  PROJ.R01={ id:'R01', t:'빛 감약으로 배우는 램버트–비어 법칙 — 투명 필름을 겹쳐 지수 감약 확인', icon:'🔦', type:'R&E · 탐구', lv:1, dur:'1주', cost:'약 1 ~ 2만 원',
    one:'투명 필름(OHP)을 1 ~ 12 장 겹쳐 LED 손전등 앞에 대고 스마트폰 조도계로 밝기를 잰다. 장수에 따라 지수적으로 줄어드는지, $\\ln(E_0/E)$ 가 장수에 정비례하는지 확인해 X선 감약의 원리를 안전하게 체험한다.',
    q:'필름을 한 장씩 늘릴 때 밝기는 일정한 값씩 줄어들까, 일정한 비율로 줄어들까? 그래프의 기울기는 무엇을 뜻할까?',
    why:'X선이 몸을 지날 때 줄어드는 법칙($I=I_0e^{-\\mu x}$)을 <b>방사선 없이</b> 재현합니다. 곱셈으로 줄어드는 현상이 로그를 취하면 직선이 되는 순간을 직접 보는 것이 이 프로젝트의 핵심입니다.',
    link:'원리① X선 감약(2번 탭) · 15번 탭 [종합1] · 실험보고서 B · 교과서 지수 · 로그 함수 · 파동의 흡수.',
    fig:FIGS.R01.fig, tg:FIGS.R01.tg,
    cap:'LED(왼쪽) → 필름 여러 장(가운데) → 스마트폰 조도계(오른쪽). 어두운 방에서 같은 거리로 재고(왼쪽 아래), 장수별 밝기를 그래프로 그려(가운데 아래) $\\ln(E_0/E)$ 표를 만든다(오른쪽 아래)',
    parts:[['광원','LED 손전등 · 흰색','밝기가 흔들리지 않게 새 건전지 · 고정','밝기가 시간에 따라 변하면 측정이 무의미해진다. 5 분 켜 두고 안정시킨 뒤 잰다.'],
           ['필름 묶음','OHP 필름 12 장 · 같은 크기','한 장씩 늘리며 겹쳐 쌓는다','겹친 사이에 공기가 끼면 반사가 늘어 오차가 커진다. 가볍게 눌러 밀착시킨다.'],
           ['조도계','스마트폰 조도 앱 · 센서 면','렌즈 쪽 센서 위치를 항상 같게','센서의 위치 · 각도가 바뀌면 값이 크게 변한다. 테이프로 고정한다.'],
           ['어두운 방','불을 끈 방 · 같은 거리 20 cm','외부 빛 차단','외부 빛이 섞이면 감약이 작게 보인다. 필름 없을 때 바탕 밝기도 재서 뺀다.'],
           ['그래프','엑셀 · 구글 시트','$E$ 대 $N$ 과 $\\ln(E_0/E)$ 대 $N$','한 쪽은 곡선, 다른 쪽은 직선이 되는 것을 비교한다.'],
           ['기록표','장수 · 조도 · $E/E_0$ · $\\ln$','3 회 반복 평균','3 번씩 재서 평균 · 표준편차를 낸다. 오차 막대를 단다.']],
    budget:[['OHP 필름(A4)','1 묶음','약 5천 원','셀로판 · 투명 파일'],['LED 손전등','1','약 3천 원','스마트폰 플래시'],['스마트폰(조도 앱)','1','보유','실험실 조도계'],['고정 테이프 · 자','1 세트','약 1천 원','—'],['종이 상자(암실)','1','무료','검은 천']],
    steps:['어두운 방에서 LED 와 센서 사이 거리를 20 cm 로 고정하고 필름 없이 조도 $E_0$ 를 3 회 잰다.','필름을 1 장 겹치고 조도 $E_1$ 을 3 회, 2 장일 때 $E_2$ … 12 장까지 순서대로 잰다.','각 장수의 평균 $E$ 를 구하고 $E/E_0$ 와 $\\ln(E_0/E)$ 를 계산해 표를 만든다.','$E$ 대 $N$ 그래프(곡선)와 $\\ln(E_0/E)$ 대 $N$ 그래프(직선)를 그리고 직선의 기울기 $\\mu$ 를 구한다.','반가층 장수 $N_{1/2}=\\ln2/\\mu$ 를 구해 그래프에서 읽은 값과 비교하고, 필름 종류를 바꾸어 $\\mu$ 가 어떻게 달라지는지 비교한다.'],
    vars:['필름 장수 N · 필름 종류','조도 E · 투과율 $E/E_0$ · 기울기 $\\mu$','광원 밝기 · 거리 · 센서 위치 · 외부 빛'],
    predict:[['필름 1 장 투과율 0.8 · 3 장','$E/E_0=0.8^3$ = '+fx(a.E/R01.E0,2)+' (조도 약 '+fx(a.E,0)+' lux)','곱셈으로 줄어듦(지수 감약)'],
             ['투과율 0.8 · 6 장','$E/E_0$ = '+fx(b.E/R01.E0,2)+' (2 배 장수 → 제곱)','장수 2 배면 투과율은 제곱'],
             ['투과율 0.6 · 3 장','$E/E_0$ = '+fx(c.E/R01.E0,2)+' · 반가층 '+fx(c.hvl,1)+' 장','어두운 필름은 μ 가 커서 반가층이 짧다'],
             ['투과율 0.9 · 8 장','$E/E_0$ = '+fx(d.E/R01.E0,2)+' · 반가층 '+fx(d.hvl,1)+' 장','밝은 필름은 반가층이 길다 — 많이 겹쳐야 절반']],
    data:{cols:['장수 N','조도 E (lux)','E/E₀','ln(E₀/E)','반가층 비교'],
          rows:[0,1,2,3,4,6,8,12].map(function(n){ var q=r01(n,0.8,1); return [n,fx(q.pts[n][1],0),fx(q.pts[n][1]/R01.E0,3),fx(Math.log(R01.E0/q.pts[n][1]),2),n? fx(n/q.hvl,2)+' 반가층':'—']; })},
    analysis:'$\\ln(E_0/E)$ 대 $N$ 을 원점을 지나는 직선으로 회귀해 기울기 $\\mu$ 와 $R^2$ 를 구한다. 점들이 직선에서 벗어나는지(잔차의 모양)를 보고, 장수가 많을 때 어두워 센서 잡음이 커지는 영향과 겹친 사이의 반사로 인한 체계적 오차를 논의한다. 이 기울기가 15번 탭의 $\\mu$ 와 같은 개념이다.',
    special:['🎓 연구 설계',[['연구 질문','필름 장수가 늘 때 투과 밝기는 일정한 비율로 줄어드는가? 기울기 μ 는 필름마다 얼마인가?'],['가설','$E=E_0e^{-\\mu N}$ — $\\ln(E_0/E)$ 는 N 에 정비례한다.'],['통제 변인','광원 밝기 · 거리 · 센서 위치 · 외부 빛'],['분석','원점 회귀 기울기 · R² · 잔차'],['한계','필름 사이 반사 · 센서 포화 · 광원의 스펙트럼(단색 아님)']]],
    fails:[['값이 매번 달라진다','광원을 충분히 예열하고 센서를 고정, 3 회 평균'],['직선이 아니라 휜다','필름 사이 공기 · 센서 포화(밝기가 너무 큼) 확인 — 밝기를 낮춘다'],['많이 겹치면 값이 바닥에 닿는다','주변 빛 · 센서 하한. 바탕 밝기를 빼고 분석에서 제외']],
    up:['<b>색 필터</b> — 빨강 · 초록 · 파랑 필름으로 파장에 따른 μ 비교(X선 에너지 의존의 유사).','<b>R02</b> — 용액 농도 비어 법칙.','<b>종합1</b> — 15번 탭에서 가상 X선 감약으로 같은 분석.'],
    next:['원리① X선 감약',2],
    eval:[['측정','같은 조건으로 3 회 반복 · 오차 막대'],['분석','로그 변환 · 원점 회귀 · R²'],['이해','곱셈 → 지수 → 로그 직선의 설명'],['안전 · 한계','방사선 아닌 빛의 유사 실험임을 밝힘']],
    tip:'곡선(E–N)과 직선(ln–N) 그래프를 한 장에 나란히 놓고 「왜 로그를 취하면 직선이 되는가」를 한 문장으로 쓰면 가장 강력한 결과 화면입니다.' };
})();
SIMS.R01={ q:'필름 장수와 필름 한 장의 투과율을 바꾸면 밝기는 어떻게 줄어들까?',
  a:{nm:'필름 장수 N',min:0,max:12,step:1,val:4,unit:'장',d:0}, b:{nm:'필름 1 장 투과율 T₁',min:0.5,max:0.95,step:0.01,val:0.8,unit:'',d:2},
  cap1:'LED(왼쪽) → 필름(가운데 층) → 센서(오른쪽). 필름이 많을수록 빛(점)이 줄고 센서 막대가 짧아집니다.',
  cap2:'📊 위 : 조도 E 대 장수 N(곡선) · 아래 : ln(E₀/E) 대 N(직선) — 점 = 3 % 잡음이 있는 가상 측정, 선 = 이론.',
  note:'모형 : $E=E_0T_1^N$, $E_0$ = 800 lux, 측정 잡음 3 % (새 측정마다 달라짐). 반사 · 센서 포화는 무시한 이상 모형이며 실제로는 필름 사이 반사 때문에 직선에서 조금 벗어납니다.',
  anim:function(ctx,w,h,t,N,T1,S){ var q=r01(N,T1,S.seed), x0=44, y0=h/2, k, i; skyBg(ctx,w,h);
    cvCirc(ctx,x0,y0,9,COL.amber,null,0); for(i=0;i<8;i++){ var a=i*Math.PI/4; cvLine(ctx,[[x0+12*Math.cos(a),y0+12*Math.sin(a)],[x0+18*Math.cos(a),y0+18*Math.sin(a)]],COL.amber,1.4); }
    var fx0=w*0.30, fw=Math.min(14,(w*0.34)/Math.max(N,1)), tot=N*fw; for(i=0;i<N;i++){ ctx.fillStyle='rgba(125,211,252,.22)'; ctx.fillRect(fx0+i*fw,y0-52,fw-1,104); ctx.strokeStyle=COL.blue; ctx.strokeRect(fx0+i*fw,y0-52,fw-1,104); }
    var nph=26, sx=fx0+tot, ex=w-120; for(k=0;k<nph;k++){ var p=((t*0.35+k/nph)%1), x=x0+16+(ex-x0-16)*p, yy=y0-40+(k*37%80), pass=true, j; for(j=0;j<N;j++){ var fxj=fx0+j*fw; if(x>=fxj && x<fxj+fw && ((k*7919+j*104729)%1000)/1000>T1){ pass=false; } } var lost=false; for(j=0;j<N;j++){ var fxj2=fx0+j*fw; if(x>fxj2+fw && ((k*7919+j*104729)%1000)/1000>T1) lost=true; } if(!lost){ ctx.fillStyle=COL.amber; ctx.fillRect(x,yy,3,3); } }
    cvRect(ctx,w-86,y0-40,56,80,COL.plotbg,COL.dim,1.2); var rel=q.E/R01.E0, hh=70*rel; ctx.fillStyle=COL.ok; ctx.fillRect(w-80,y0+36-hh,44,hh); cvText(ctx,'조도계',w-58,y0-48,COL.tick,'10.5px system-ui,sans-serif','center'); cvText(ctx,q.E.toFixed(0)+' lux',w-58,y0+54,COL.text,'bold 12px system-ui,sans-serif','center');
    cvText(ctx,'N = '+N+' 장 · 투과율 '+(rel*100).toFixed(1)+' %',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,N,T1,S){ var q=r01(N,T1,S.seed), hh=Math.floor(h/2), i, th=[], tl=[];
    for(i=0;i<=12;i+=0.25){ th.push([i,R01.E0*Math.pow(T1,i)]); tl.push([i,i*q.mu]); }
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:12,ymin:0,ymax:R01.E0*1.05,ylabel:'조도 E (lux)',title:'E 대 N (지수 감소)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,th,COL.blue,1.8); plotPoints(ctx,P,q.pts,COL.amber,3.6); plotPoints(ctx,P,[[N,q.E]],COL.ok,6.5); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:12,ymin:0,ymax:Math.max(1,12*q.mu*1.1),xlabel:'필름 장수 N',ylabel:'ln(E₀/E)',title:'ln(E₀/E) 대 N (직선, 기울기 μ)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,tl,COL.blue,1.8); plotPoints(ctx,P,q.pts.map(function(p){ return [p[0],Math.log(R01.E0/p[1])]; }),COL.amber,3.6); if(q.fit) plotLine(ctx,P,[[0,q.fit.b],[12,q.fit.a*12+q.fit.b]],COL.grav,1.4,[5,4]); legend(ctx,P.x1-150,P.y1+14,[['이론 μ '+q.mu.toFixed(3),COL.blue],['측정 기울기 '+(q.fit?q.fit.a.toFixed(3):'—'),COL.grav]]); }); },
  kv:function(N,T1,S){ var q=r01(N,T1,S.seed); return [['지금 조도',q.E.toFixed(0)+' lux','a'],['투과율',(q.E/R01.E0*100).toFixed(1)+' %'],['이론 μ (장당)',q.mu.toFixed(3),'g'],['측정 기울기',(q.fit?q.fit.a.toFixed(3):'—'),'v2'],['반가층',q.hvl.toFixed(1)+' 장','r']]; } };

/* ── R02 : 용액 농도와 투과율(비어 법칙) ────────────────────────────── */
function r02(c,L){ var A=0.045*c*L, T=Math.pow(10,-A); return {A:A,T:T,Lhalf:Math.log10(2)/(0.045*Math.max(c,1e-6))}; }
(function(){
  var a=r02(6,4), b=r02(12,4), c=r02(6,8), d=r02(3,2);
  PROJ.R02={ id:'R02', t:'용액 농도와 투과율 — 식용 색소로 확인하는 비어 법칙(조영제의 비유)', icon:'🧪', type:'R&E · 탐구', lv:1, dur:'1주', cost:'약 1 ~ 2만 원',
    one:'식용 색소(또는 우유) 용액의 농도 $c$ 와 광경로 길이 $L$ 을 바꾸며 투과 밝기를 재어 흡광도 $A=\\varepsilon cL$ 이 농도 · 길이에 비례하는지 확인한다. 조영제가 농도에 따라 영상을 밝게 · 어둡게 하는 원리를 비유로 이해한다.',
    q:'색소를 두 배 진하게 하면 흡광도도 두 배가 될까? 용액이 두 배 두꺼우면 투과율은 어떻게 변할까?',
    why:'X선 조영제(요오드 · 바륨)는 농도가 진할수록 X선을 많이 흡수합니다. <b>농도와 길이가 로그 흡광도에 비례</b>하는 비어–램버트 법칙을 색소 용액으로 안전하게 확인합니다. 화학 · 분석에서 가장 흔한 측정 방법이기도 합니다.',
    link:'원리① X선 감약(2번 탭) · R01 · 화학 용액 농도 · 교과서 로그.',
    fig:FIGS.R02.fig, tg:FIGS.R02.tg,
    cap:'LED(왼쪽) → 색소 용액이 든 투명 용기(가운데) → 조도계(오른쪽). 농도(왼쪽 아래)를 바꾸고 경로 길이(가운데 아래)는 일정하게 하여 흡광도–농도 직선을 만든다(오른쪽 아래)',
    parts:[['광원','흰색 LED · 필터(색소 보색)','색소의 보색 필터를 쓰면 대비가 커진다','빨간 색소에는 초록 빛이 가장 잘 흡수된다. 색 필터로 단색에 가깝게 한다.'],
           ['용액 용기','투명 직육면체 용기 · 경로 L','L = 1, 2, 4, 8 cm 로 바꿀 수 있게','같은 용기로 L 만 바꾸려면 용액을 부은 높이가 아니라 용기의 폭을 바꾼다(여러 용기 사용).'],
           ['조도계','스마트폰 앱 · 고정','용기 바로 뒤','용기 벽의 반사를 일정하게 하려고 항상 같은 위치로 둔다.'],
           ['농도 표','색소 0 · 2 · 4 · 8 · 16 방울','순서대로 희석 시리즈','한 번에 정확한 농도를 만들기 어려우므로 희석 시리즈(2 배씩)로 만든다.'],
           ['바탕 보정','맹물만 넣은 용기','$E_0$ 로 사용','용기 벽의 반사 · 흡수를 $E_0$ 에 포함시켜 용액의 흡광만 분리한다.'],
           ['그래프','A 대 c · A 대 L','$A=\\log_{10}(E_0/E)$','두 그래프 모두 원점을 지나는 직선이어야 한다.']],
    budget:[['식용 색소(빨강)','1','약 2천 원','잉크 · 우유'],['투명 용기(직육면체)','3 개','약 5천 원','비커'],['LED 손전등 · 조도 앱','1','보유','—'],['스포이트 · 자','1 세트','약 2천 원','—'],['물','—','무료','—']],
    steps:['맹물 용기에서 $E_0$ 를 3 회 잰다.','색소 2 방울을 넣어 용액을 섞고(농도 $c$ = 2), 조도 $E$ 를 3 회 잰다. 4 · 8 · 16 방울로 농도를 2 배씩 올리며 반복한다.','흡광도 $A=\\log_{10}(E_0/E)$ 를 계산해 $A$ 대 $c$ 그래프를 그린다(원점을 지나는 직선인가?).','용기 폭 $L$ 을 1 · 2 · 4 cm 로 바꾸어 같은 농도에서 $A$ 대 $L$ 을 그린다.','미지 농도 용액의 $A$ 를 재어 검량선(A–c)으로 농도를 추정하고 실제 값과 비교한다.'],
    vars:['색소 농도 c · 경로 길이 L','흡광도 A · 투과율 T','광원 · 용기 · 센서 위치 · 용액의 혼합 정도'],
    predict:[['c = 6 · L = 4 cm','$A=0.045\\cdot6\\cdot4$ = '+fx(a.A,2)+' → T '+fx(a.T*100,0)+' %','$A=\\varepsilon cL$'],
             ['c = 12 · L = 4 cm(2 배 진하게)','A = '+fx(b.A,2)+' → T '+fx(b.T*100,1)+' %','농도 2 배 → A 2 배(T 는 제곱)'],
             ['c = 6 · L = 8 cm(2 배 두껍게)','A = '+fx(c.A,2)+' → T '+fx(c.T*100,1)+' %','길이 2 배 → A 2 배'],
             ['c = 3 · L = 2 cm','A = '+fx(d.A,2)+' → T '+fx(d.T*100,0)+' %','A 가 0.3 이상이어야 조도계로 안정적']],
    data:{cols:['c(방울)','L(cm)','E(lux)','T','A = log(E₀/E)','A / (cL)'],
          rows:[[0,4],[2,4],[4,4],[8,4],[16,4],[8,2],[8,8]].map(function(q){ var r=r02(q[0],q[1]); return [q[0],q[1],fx(800*r.T,0),fx(r.T,3),fx(r.A,3),q[0]? fx(r.A/(q[0]*q[1]),3):'—']; })},
    analysis:'A 대 c, A 대 L 이 원점을 지나는 직선인지 확인하고 기울기에서 몰 흡광계수 비례 상수 $\\varepsilon$ 를 구한다. 농도가 높아지면 직선에서 벗어나는 경우(용액 불균일 · 산란)를 논의하고, 검량선으로 미지 농도를 추정한 뒤 오차를 평가한다. X선 조영제와의 대응 : 요오드 농도 ↔ 색소 방울 수.',
    special:['🎓 연구 설계',[['연구 질문','흡광도 A 는 농도와 광경로 길이에 정비례하는가? 어느 농도까지 직선인가?'],['가설','$A=\\varepsilon cL$ — A–c, A–L 모두 원점을 지나는 직선'],['통제 변인','광원 · 센서 위치 · 용기 재질 · 온도'],['분석','원점 회귀 · 검량선으로 미지 농도 추정'],['한계','진한 용액에서의 산란 · 용기 반사 · 색소의 침전']]],
    fails:[['A 가 농도에 비례하지 않는다','진한 용액에서 빛이 포화 · 산란 — 농도 범위를 낮추고 용기를 얇게'],['용기를 바꿀 때마다 값이 다르다','바탕(맹물) 보정을 용기마다 한다'],['값이 계속 변한다','색소가 덜 섞임 — 충분히 젓고 1 분 정지 후 측정']],
    up:['<b>색별 흡수</b> — 빨강 · 초록 · 파랑 필터로 흡수 스펙트럼 대략 측정.','<b>R01</b> — 장수(두께) 와 같은 법칙임을 한 그래프에 통합.','<b>C07</b> — 조직 모사 팬텀에서 농도 · 두께 조절.'],
    next:['원리① X선 감약',2],
    eval:[['측정','희석 시리즈 · 3 회 반복'],['분석','검량선 · 직선성의 한계'],['응용','미지 농도 추정 정확도'],['비유','조영제 · X선 감약과의 연결 설명']],
    tip:'미지 용액의 농도를 검량선으로 맞히고 「실제와 몇 % 차이」를 말하면 분석 능력을 한 번에 보여 줄 수 있습니다.' };
})();
SIMS.R02={ q:'색소 농도와 용기 두께를 바꾸면 투과율과 흡광도는 어떻게 변할까?',
  a:{nm:'색소 농도 c',min:0,max:20,step:1,val:6,unit:'방울',d:0}, b:{nm:'경로 길이 L',min:1,max:10,step:1,val:4,unit:'cm',d:0},
  cap1:'용기 안 색소 용액의 진하기와 통과하는 빛(밝은 막대). 진할수록 · 두꺼울수록 빛이 줄어듭니다.',
  cap2:'📊 위 : 투과율 T 대 농도 c(곡선, L 2 · 4 · 8 cm) · 아래 : 흡광도 A 대 c(원점을 지나는 직선). 점 = 지금.',
  note:'모형 : $A=\\varepsilon cL$, $\\varepsilon=0.045$ /(방울·cm), $T=10^{-A}$. 산란 · 포화는 무시한 이상 모형입니다.',
  anim:function(ctx,w,h,t,c,L,S){ var q=r02(c,L), y0=h/2, x0=50, cw=Math.min(210,w*0.34)*(0.4+0.6*L/10), cx=w*0.42-cw/2, i; skyBg(ctx,w,h);
    cvCirc(ctx,x0,y0,9,COL.amber,null,0); var al=Math.min(0.92,0.08+c/22*0.84); ctx.fillStyle='rgba(251,113,133,'+al+')'; ctx.fillRect(cx,y0-50,cw,100); ctx.strokeStyle=COL.dim; ctx.strokeRect(cx,y0-50,cw,100);
    for(i=0;i<5;i++){ var y=y0-36+i*18, xs=x0+14, w1=cx-xs, w2=w-110-(cx+cw), I1=1, I2=Math.pow(10,-q.A); ctx.strokeStyle='rgba(251,191,36,'+I1+')'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(xs,y); ctx.lineTo(cx,y); ctx.stroke(); ctx.strokeStyle='rgba(251,191,36,'+Math.max(0.05,I2)+')'; ctx.beginPath(); ctx.moveTo(cx+cw,y); ctx.lineTo(w-110,y); ctx.stroke(); }
    cvRect(ctx,w-96,y0-44,60,88,COL.plotbg,COL.dim,1.2); ctx.fillStyle=COL.ok; var hh=80*q.T; ctx.fillRect(w-90,y0+38-hh,48,hh); cvText(ctx,'T '+(q.T*100).toFixed(0)+' %',w-66,y0-54,COL.text,'bold 11.5px system-ui,sans-serif','center');
    cvText(ctx,'c '+c+' 방울 · L '+L+' cm · 흡광도 A '+q.A.toFixed(2),12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,c,L,S){ var hh=Math.floor(h/2), Ls=[2,4,8], cols=[COL.blue,COL.ok,COL.violet||COL.amber], i, cs=[]; for(i=0;i<=20;i++) cs.push(i);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:20,ymin:0,ymax:1.05,ylabel:'투과율 T',title:'T 대 c (지수 감소)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ Ls.forEach(function(l,k){ plotLine(ctx,P,cs.map(function(x){ return [x,r02(x,l).T]; }),cols[k],1.8); }); plotPoints(ctx,P,[[c,r02(c,L).T]],COL.amber,6.5); legend(ctx,P.x1-90,P.y1+14,[['L 2',cols[0]],['L 4',cols[1]],['L 8',cols[2]],['지금',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:20,ymin:0,ymax:8,xlabel:'색소 농도 c (방울)',ylabel:'흡광도 A',title:'A 대 c (직선, 기울기 = εL)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ Ls.forEach(function(l,k){ plotLine(ctx,P,[[0,0],[20,r02(20,l).A]],cols[k],1.8); }); plotPoints(ctx,P,[[c,r02(c,L).A]],COL.amber,6.5); }); },
  kv:function(c,L,S){ var q=r02(c,L); return [['흡광도 A',q.A.toFixed(2),'a'],['투과율 T',(q.T*100).toFixed(1)+' %','g'],['조도(E₀ 800)',(800*q.T).toFixed(0)+' lux','v2'],['절반 되는 경로',(c>0? (Math.log10(2)/(0.045*c)).toFixed(1)+' cm':'—'),'r'],['A 가 0.3 이상?',q.A>=0.3?'✅ 측정 가능':'⚠ 너무 연함']]; } };

/* ── R03 : 광학 CT — 회전 투영과 재구성 ──────────────────────────────── */
var R03 = { N:48, pix:0.12, LAB:null, HU:null };
(function(){ var N=R03.N, f=new Float32Array(N*N), i, j; for(j=0;j<N;j++) for(i=0;i<N;i++){ var x=(i+0.5)/N*2-1, y=1-(j+0.5)/N*2, rr=Math.hypot(x,y), v=-1000; if(rr<0.86){ v=0; if(rr>0.78) v=250; if(Math.hypot(x-0.30,y-0.18)<0.20) v=600; if(Math.hypot(x+0.28,y+0.22)<0.14) v=450; if(Math.abs(x+0.05)<0.05&&y>-0.55&&y<0.1) v=700; } f[j*N+i]=v; } R03.HU=f; })();
function r03(nth,noise,seed){ var N=R03.N, N0=noise>0? 1/Math.pow(noise/100,2) : 0, r=ctRecon(R03.HU,N,{nth:nth,filt:'sl',N0:N0,pix:R03.pix,seed:seed*13+1}); var se=0, n=0, i; for(i=0;i<N*N;i++) if(R03.HU[i]>-900){ var d=r.hu[i]-R03.HU[i]; se+=d*d; n++; } return {hu:r.hu, sino:r.sino, nd:r.nd, rmse:Math.sqrt(se/n)}; }
(function(){
  var a=r03(12,0,1), b=r03(36,0,1), c=r03(36,10,1), d=r03(72,10,1);
  PROJ.R03={ id:'R03', t:'광학 CT — 회전 투영 사진으로 단면을 복원하기', icon:'🌀', type:'R&E · 탐구', lv:3, dur:'3 ~ 4주', cost:'약 3 ~ 5만 원',
    one:'투명한 수조(물 + 우유 약간) 안에 불투명한 물체를 두고 회전판에서 10° 씩 돌리며 LED 뒷빛에 대한 스마트폰 사진을 찍는다. 사진 한 줄의 밝기에 −ln 을 취해 사이노그램을 만들고 필터 역투영으로 단면 영상을 복원한다.',
    q:'투영 사진을 몇 장 찍어야 물체의 모양이 제대로 복원될까? 카메라 잡음이 크면 필요한 장수가 달라질까?',
    why:'CT 의 수학(사이노그램 · 필터 역투영)을 <b>방사선 없이</b> 직접 구현해 보는 가장 도전적이고 가장 멋진 프로젝트입니다. 「왜 단순 역투영은 번질까?」를 코드로 직접 확인합니다.',
    link:'원리② CT(3번 탭) · 교과서 삼각함수 · 행렬 · 푸리에(대학 연계) · 파이썬 numpy.',
    fig:FIGS.R03.fig, tg:FIGS.R03.tg,
    cap:'회전판(왼쪽) 위 물체를 LED 뒤에서 비추며 돌리고, 스마트폰(가운데)이 매번 찍는다. 10° 씩 도는 회전판(왼쪽 아래)으로 얻은 사진 → 파이썬 필터 역투영(가운데 아래) → 단면(오른쪽 아래)',
    parts:[['회전판','턴테이블 · 각도 눈금판','10° 씩 정확히 돌린다','각도 오차가 크면 재구성이 번진다. 손으로 돌릴 때는 눈금판의 클릭으로 고정한다.'],
           ['투명 수조','직육면체 · 물 + 우유 몇 방울','약한 산란 매질','물체 주변 매질이 너무 불투명하면 빛이 사라진다. 우유는 아주 조금(희뿌옇게) 넣는다.'],
           ['LED 뒷빛','면광원(태블릿 흰 화면)','균일한 평행에 가까운 빛','광원이 균일하지 않으면 줄무늬가 생긴다. 흰 화면 위에 확산지를 덮는다.'],
           ['카메라','스마트폰 · 삼각대 · 고정 노출','같은 노출 · 초점','자동 노출이 켜져 있으면 장마다 밝기가 달라져 그림이 망가진다. 수동 고정.'],
           ['파이썬 재구성','numpy · matplotlib','−ln(I/I₀) → 필터 → 역투영','14번 탭 코드의 필터 역투영 + 램프 필터. 투영 장수와 필터 유무를 바꿔 실험.'],
           ['평가','참값(실제 물체 위치)과 비교','RMSE · 모양 일치','물체 위치를 미리 재서 복원 위치와 비교한다.']],
    budget:[['투명 수조(직육면체)','1','약 5천 원','어항 · 투명 보관함'],['턴테이블 + 각도 눈금판','1','약 5천 원','접시 돌림판'],['태블릿(흰 화면)','1','보유','라이트박스'],['스마트폰 · 삼각대','1','보유','—'],['우유 · 불투명 물체','1 세트','약 3천 원','페트병 뚜껑']],
    steps:['수조에 물과 우유 약간을 넣고 가운데 물체를 둔 뒤 빛이 통과하는 정도를 확인한다. 노출 · 초점을 수동 고정한다.','회전판을 10° 씩 돌려 0 ~ 180° 에서 18 장(또는 5° 씩 36 장) 사진을 찍는다.','각 사진의 가운데 한 줄(또는 물체가 있는 한 행)의 밝기 $I$ 를 읽고 $p=-\\ln(I/I_0)$ 를 구해 사이노그램을 만든다.','파이썬으로 역투영 · 필터 역투영을 구현해 단면을 만들고 투영 장수(6 · 12 · 18 · 36)별로 비교한다.','복원 영상에서 물체 위치 · 크기를 재어 참값과 비교하고, 사진을 어둡게(잡음) 했을 때의 변화도 본다.'],
    vars:['투영(사진) 장수 N_θ · 카메라 잡음','복원 영상의 오차(RMSE) · 선명도','회전 각도 정확도 · 노출 고정 · 광원 균일도'],
    predict:[['12 장 · 잡음 0','복원 오차 RMSE '+fx(a.rmse,0)+' HU 단위(줄무늬 뚜렷)','각도가 적어 별 모양 줄무늬'],
             ['36 장 · 잡음 0','RMSE '+fx(b.rmse,0)+' — 물체 모양이 선명','장수가 늘면 줄무늬가 사라진다'],
             ['36 장 · 잡음 10 %','RMSE '+fx(c.rmse,0)+' — 잡음이 얼룩으로 나타남','잡음이 크면 장수가 많아도 한계'],
             ['72 장 · 잡음 10 %','RMSE '+fx(d.rmse,0)+' — 잡음이 약간 줄어든다','장수 2 배 → 잡음 약 ×0.7']],
    data:{cols:['투영 장수','잡음 (%)','RMSE','원인 해석'],
          rows:[[6,0],[12,0],[24,0],[36,0],[36,5],[36,10],[72,10]].map(function(q){ var r=r03(q[0],q[1],1); return [q[0],q[1],fx(r.rmse,0),q[0]<=12?'줄무늬':(q[1]>=10?'잡음 얼룩':'양호')]; })},
    analysis:'투영 장수 대 RMSE 그래프를 그린다(잡음별 곡선). 이론적으로 필요한 장수는 $\\pi N/2$ (영상 한 변 화소 $N$)이며 이 값 근처에서 오차가 급감해 완만해짐을 확인한다. 필터를 끈 단순 역투영과 비교해 「번짐」의 크기를 정량화한다.',
    special:['🎓 연구 설계',[['연구 질문','투영 사진 장수와 카메라 잡음이 복원 정확도를 어떻게 정하는가?'],['가설','$N_\\theta\\gtrsim\\pi N/2$ 에서 줄무늬가 사라지고 잡음은 $1/\\sqrt{N_\\theta}$ 로 줄어든다.'],['통제 변인','물체 · 광원 · 노출 · 카메라 위치'],['분석','RMSE 대 장수 · 필터 유무 비교'],['한계','평행 빔 근사 · 회전축 정렬 · 매질 산란']]],
    fails:[['복원 영상이 번져 보인다','필터를 적용했는지 확인(램프 필터), 각도 수 늘리기'],['사진마다 밝기가 달라 줄무늬가 생긴다','노출 · 감도 수동 고정, 광원 일정'],['물체 중심이 한쪽으로 쏠린다','회전축을 물체 중심에 정렬']],
    up:['<b>3D 복원</b> — 여러 행을 쌓아 입체 복원.','<b>R09 · I10</b> — 프레임 평균 · 잡음 제거로 화질 개선.','<b>C02</b> — 사이노그램 아트.'],
    next:['원리② CT',3],
    eval:[['구현','필터 역투영 코드 · 동작','] '],['분석','장수 · 잡음별 RMSE 그래프'],['재현성','각도 · 노출 기록'],['이해','사이노그램 설명']].map(function(e){ return e.slice(0,2); }),
    tip:'단순 역투영(번진 별 모양)과 필터 역투영(선명)을 나란히 보여 주는 한 장이 CT 의 핵심을 전달합니다.' };
})();
SIMS.R03={ q:'투영(사진) 장수와 카메라 잡음에 따라 광학 CT 복원은 얼마나 정확해질까?',
  a:{nm:'투영(사진) 장수 N_θ',min:6,max:90,step:2,val:72,unit:'장',d:0}, b:{nm:'카메라 잡음',min:0,max:20,step:1,val:2,unit:'%',d:0},
  cap1:'왼쪽 : 참값 물체(수조 속 불투명 물체 · 테두리). 오른쪽 : 복원 영상 — 투영이 하나씩 더해지며 선명해집니다.',
  cap2:'📊 위 : 투영 장수 대 복원 오차(RMSE, 잡음 0 · 5 · 15 %) · 아래 : 사이노그램(가로 위치 · 세로 각도).',
  note:'모형 : 48×48 화소 · 화소 1.2 mm 의 광학 팬텀(μ 단위는 HU 환산), 램프(쉐프–로건) 필터 역투영, 투영의 상대 잡음 = 입력 %. 평행 빔 · 단색광 근사입니다.',
  anim:function(ctx,w,h,t,nth,nz_,S){ var key=nth+'_'+nz_+'_'+S.seed; if(!S.cache||S.cache.key!==key){ S.cache={key:key,r:r03(nth,nz_,S.seed)}; } var r=S.cache.r, s=Math.max(60,Math.min((w-36)/2,h-46)), xA=(w-2*s-16)/2, xB=xA+s+16;
    cvText(ctx,'참값 물체',xA+s/2,16,COL.text,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,R03.HU,R03.N,xA,26,s,-100,800); cvText(ctx,'복원 (장수 '+nth+', 잡음 '+nz_+' %) RMSE '+r.rmse.toFixed(0),xB+s/2,16,COL.ok,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,r.hu,R03.N,xB,26,s,-100,800);
    var a=Math.PI*Math.min(1,t/8); ctx.strokeStyle=COL.amber; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(xA+s/2-Math.sin(a)*s*0.6,26+s/2+Math.cos(a)*s*0.6); ctx.lineTo(xA+s/2+Math.sin(a)*s*0.6,26+s/2-Math.cos(a)*s*0.6); ctx.stroke(); cvText(ctx,'빛 방향 '+(a*180/Math.PI).toFixed(0)+'°',xA+s/2,h-8,COL.tick,'10.5px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,nth,nz_,S){ var hh=Math.floor(h*0.52), ns=[6,12,24,36,48,72,90], cols=[COL.blue,COL.ok,COL.violet||COL.amber], noises=[0,5,15], key=nth+'_'+nz_+'_'+S.seed;
    if(!S.cache||S.cache.key!==key) S.cache={key:key,r:r03(nth,nz_,S.seed)}; var r=S.cache.r;
    subPlot(ctx,0,0,w,hh,{xmin:6,xmax:90,ymin:0,ymax:400,xlabel:'투영 장수 N_θ',ylabel:'RMSE',title:'장수가 늘수록 줄무늬 오차가 줄어든다',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ noises.forEach(function(nn,k){ plotLine(ctx,P,ns.map(function(n){ return [n,Math.min(400,r03(n,nn,S.seed).rmse)]; }),cols[k],1.8); }); plotPoints(ctx,P,[[nth,Math.min(400,r.rmse)]],COL.amber,6.5); legend(ctx,P.x1-120,P.y1+14,[['잡음 0 %',cols[0]],['잡음 5 %',cols[1]],['잡음 15 %',cols[2]],['지금',COL.amber]]); });
    var mn=1e9, mx=-1e9, i; for(i=0;i<r.sino.length;i++){ if(r.sino[i]<mn) mn=r.sino[i]; if(r.sino[i]>mx) mx=r.sino[i]; } cvText(ctx,'사이노그램 (가로 위치 · 세로 각도)',10,hh+14,COL.text,'bold 11.5px system-ui,sans-serif'); grayImage2(ctx,r.sino,r.nd,nth,10,hh+22,w-20,h-hh-30,mn,mx,false); },
  kv:function(nth,nz_,S){ var r=r03(nth,nz_,S.seed); return [['복원 오차 RMSE',r.rmse.toFixed(0),'a'],['필요 장수 π N/2',Math.round(Math.PI/2*R03.N)+' 장'],['지금 / 필요',(nth/(Math.PI/2*R03.N)).toFixed(2)+' 배','g'],['잡음',nz_+' %','v2'],['판정',nth>=Math.PI/2*R03.N*0.9?'✅ 장수 충분':'⚠ 줄무늬','r']]; } };

/* ── R04 : 공기 중 초음파 속도와 온도 ──────────────────────────────── */
function cAir(T){ return 331.3*Math.sqrt(1+T/273.15); }
function r04(T,d){ var c=cAir(T), t=2*d/c*1e6, dErr=d*(1-343/c); return {c:c,t:t,err:dErr,tick:t/58}; }
(function(){
  var a=r04(20,1.5), b=r04(0,1.5), c=r04(40,1.5), d=r04(20,4);
  PROJ.R04={ id:'R04', t:'공기 중 초음파 속도와 온도 — HC-SR04 로 재는 음속', icon:'📏', type:'R&E · 탐구', lv:2, dur:'1 ~ 2주', cost:'약 1 ~ 2만 원',
    one:'아두이노와 초음파 거리 센서(HC-SR04)로 벽까지의 왕복 시간 $t$ 를 재고 거리 $d$ 와의 관계 $t=2d/c$ 에서 음속을 구한다. 온도를 바꾸어 $c=331.3+0.606T$ 를 확인한다.',
    q:'초음파 거리 센서가 재는 것은 시간이다. 시간과 거리의 비례 상수에서 음속을 구할 수 있을까? 기온이 바뀌면 값이 얼마나 달라질까?',
    why:'초음파 진단기의 핵심 식 $d=ct/2$ 를 <b>손으로 만든 장치로 검증</b>합니다. 음속이 매질 · 온도에 따라 달라지므로 보정이 필요한 이유(조직에서는 1540 m/s 가정)를 직접 이해합니다.',
    link:'원리③ 초음파(4번 탭) · 16번 탭 [종합2] · 교과서 파동의 속력 · 일차 함수 회귀 · 아두이노.',
    fig:FIGS.R04.fig, tg:FIGS.R04.tg,
    cap:'HC-SR04 센서(왼쪽)가 소리를 내고 벽(오른쪽)에서 돌아오는 시간을 아두이노(가운데)가 잰다. 식 $t=2d/c$ (왼쪽 아래) · 시간–거리 그래프(가운데 아래) · 음속–온도 식(오른쪽 아래)',
    parts:[['HC-SR04 센서','40 kHz 초음파 송 · 수신','유효 거리 약 2 cm ~ 4 m','분해능은 보통 약 0.3 cm 수준. 부드러운 천 · 비스듬한 면은 반사가 약하다.'],
           ['아두이노','Nano · pulseIn() 사용','Trig 10 μs 펄스 → Echo 폭(μs)','Echo 핀 high 시간이 왕복 시간이다. 14번 탭 코드 참고.'],
           ['벽 · 반사판','단단한 판 · 센서에 수직','거리 0.3 ~ 3 m','벽이 기울면 반사 방향이 어긋나 값이 튄다. 직각으로 세운다.'],
           ['거리 기준','줄자 · 레이저 거리계','진짜 거리 d','센서 측정과 비교할 참값. ±1 mm 이내로 잰다.'],
           ['온도계','디지털 온도계','공기 온도 $T$','센서 근처 온도를 잰다. 햇빛이 비추면 오차가 크다.'],
           ['기록','시리얼 모니터 · 시트','d · t · T 반복 10 회','한 거리마다 10 회 이상 재서 평균 · 표준편차를 낸다.']],
    budget:[['HC-SR04 초음파 센서','1','약 2천 원','—'],['아두이노 나노','1','약 5천 원','마이크로비트'],['줄자 · 반사판','1 세트','약 3천 원','—'],['디지털 온도계','1','약 5천 원','센서 모듈'],['점퍼선 · 케이블','1 세트','약 2천 원','—']],
    steps:['센서를 고정하고 반사판을 0.3 · 0.6 · 1.0 · 1.5 · 2.0 · 3.0 m 에 두고 거리마다 왕복 시간(μs)을 10 회씩 기록한다.','$t$ 대 $d$ 그래프를 그려 기울기 $2/c$ 에서 음속을 구하고 $c=2/\\text{기울기}$ 로 계산한다.','같은 장치로 온도를 바꾸어(따뜻한 방 · 차가운 베란다) 음속 변화를 측정한다.','센서가 가정한 343 m/s 로 계산한 거리와 참 거리의 차이를 구해 온도 보정의 필요성을 확인한다.','음속의 불확실성 $\\delta c/c$ 를 반복 측정의 표준편차에서 구한다.'],
    vars:['거리 d · 기온 T','왕복 시간 t · 음속 c','반사판 재질 · 각도 · 센서 위치'],
    predict:[['20 ℃ · d = 1.5 m','$c$ = '+fx(a.c,1)+' m/s → 왕복 '+fx(a.t,0)+' μs','$t=2d/c$'],
             ['0 ℃ · d = 1.5 m','$c$ = '+fx(b.c,1)+' → 343 m/s 가정 시 거리 오차 '+fx(b.err*100,1)+' cm','추우면 음속이 느려 거리를 짧게 잘못 계산'],
             ['40 ℃ · d = 1.5 m','$c$ = '+fx(c.c,1)+' → 거리 오차 '+fx(c.err*100,1)+' cm','더우면 음속이 빨라 거리가 길게 나옴'],
             ['20 ℃ · d = 4 m','왕복 '+fx(d.t,0)+' μs (HC-SR04 한계 근처)','1 μs ≈ 0.17 mm — 분해능은 시간보다 장치 한계']],
    data:{cols:['거리 d (m)','왕복 시간 t (μs)','측정 c = 2d/t (m/s)','343 가정 오차 (cm)'],
          rows:[0.3,0.6,1.0,1.5,2.0,3.0].map(function(dd){ var q=r04(20,dd); return [dd,fx(q.t,0),fx(cAir(20),1),fx(q.err*100,1)]; })},
    analysis:'$t$ 대 $d$ 의 회귀 기울기에서 $c=2/\\text{기울기}$ 를 구하고 이론값 $331.3\\sqrt{1+T/273.15}$ 와 비교한다. 절편이 0 이 아니면 센서의 지연 시간(상수 오차)이다. 온도를 바꾼 데이터로 $c$ 대 $T$ 직선(기울기 0.606 m/s/℃)을 만든다.',
    special:['🎓 연구 설계',[['연구 질문','왕복 시간은 거리에 정비례하는가? 음속은 온도에 얼마나 의존하는가?'],['가설','$t=2d/c$, $c=331.3+0.606T$'],['통제 변인','센서 · 반사판 각도 · 습도(영향 작음)'],['분석','t–d 회귀 기울기 · c–T 회귀'],['한계','센서 분해능 · 열 불균일 · 바람']]],
    fails:[['값이 튄다','반사판을 수직으로 · 근처 물체 제거 · 중앙값 사용'],['가까울수록 오차가 큰 비율로 나타난다','상수 지연(트리거 시간) 때문 — 절편을 보정'],['온도 효과가 안 보인다','온도 변화를 20 ℃ 이상 크게(냉장고 앞 vs 난로 앞) · 충분히 안정시킨다']],
    up:['<b>R05</b> — 재질별 반사 세기.','<b>R07</b> — 서보로 부채꼴 스캔(B-모드 흉내).','<b>종합2</b> — 16번 탭에서 조직 속 음속을 가상으로 측정.'],
    next:['원리③ 초음파',4],
    eval:[['측정','거리마다 10 회 이상 반복'],['분석','회귀 기울기 · 절편 해석'],['보정','온도 효과 이해'],['정직','센서 한계 · 오차 원인 서술']],
    tip:'t–d 그래프의 기울기에서 음속을 읽고 이론값과의 차이(%)를 적는 한 문장이 가장 중요한 결과입니다.' };
})();
SIMS.R04={ q:'기온과 거리를 바꾸면 초음파 센서의 왕복 시간과 343 m/s 가정 오차는 어떻게 달라질까?',
  a:{nm:'기온 T',min:-10,max:40,step:1,val:20,unit:'℃',d:0}, b:{nm:'벽까지 거리 d',min:0.3,max:4,step:0.1,val:1.5,unit:'m',d:1},
  cap1:'센서(왼쪽) → 벽(오른쪽) → 센서. 노란 점이 소리 펄스입니다. 왕복 시간이 기온(음속)과 거리로 정해집니다.',
  cap2:'📊 위 : 음속 대 기온(직선) · 아래 : 센서가 343 m/s 로 가정할 때의 거리 오차(거리 1 · 2 · 4 m). 점 = 지금.',
  note:'모형 : $c=331.3\\sqrt{1+T/273.15}$ (건조 공기), 왕복 시간 $t=2d/c$, 오차 = $d(1-343/c)$. 습도 · 바람 · 센서 지연은 무시.',
  anim:function(ctx,w,h,t,T,d,S){ var q=r04(T,d), y0=h/2, xs=70, xw=w-80, tt=t/10, ph=(tt*2.2)%2, p=ph<1?ph:2-ph, x=xs+(xw-xs)*p; skyBg(ctx,w,h); cvRect(ctx,24,y0-22,50,44,COL.metal||'#475569',COL.dev,1.2); cvCirc(ctx,40,y0,9,COL.plotbg,COL.blue,1.4); cvCirc(ctx,60,y0,9,COL.plotbg,COL.blue,1.4); cvRect(ctx,xw,y0-60,14,120,COL.dim,COL.dev,1); cvLine(ctx,[[xs,y0],[xw,y0]],COL.dim,1,[3,4]);
    cvCirc(ctx,x,y0,6,COL.amber,null,0); cvLine(ctx,[[x-8,y0-10],[x-8,y0+10]],COL.blue,1.4); cvText(ctx,'d = '+d.toFixed(1)+' m',(xs+xw)/2,y0-30,COL.violet||COL.amber,'bold 12px system-ui,sans-serif','center'); cvText(ctx,'왕복 '+q.t.toFixed(0)+' μs · c = '+q.c.toFixed(1)+' m/s',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'센서가 343 으로 계산한 거리 '+(d*343/q.c).toFixed(3)+' m (오차 '+(-q.err*100).toFixed(1)+' cm)',12,h-14,Math.abs(q.err)<0.01?COL.ok:COL.grav,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,T,d,S){ var hh=Math.floor(h/2), i, ts=[]; for(i=-10;i<=40;i+=2) ts.push(i);
    subPlot(ctx,0,0,w,hh,{xmin:-10,xmax:40,ymin:320,ymax:360,ylabel:'음속 c (m/s)',title:'c 대 T (직선, 0.606 m/s/℃)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,ts.map(function(x){ return [x,cAir(x)]; }),COL.blue,2); plotPoints(ctx,P,[[T,cAir(T)]],COL.amber,6.5); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:-10,xmax:40,ymin:-12,ymax:12,xlabel:'기온 T (℃)',ylabel:'거리 오차 (cm)',title:'343 m/s 가정 때의 거리 오차',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [1,2,4].forEach(function(dd,k){ plotLine(ctx,P,ts.map(function(x){ return [x,r04(x,dd).err*100]; }),[COL.blue,COL.ok,COL.violet||COL.amber][k],1.6); }); plotLine(ctx,P,[[-10,0],[40,0]],COL.grav,1,[3,3]); plotPoints(ctx,P,[[T,r04(T,d).err*100]],COL.amber,6.5); legend(ctx,P.x1-100,P.y1+14,[['1 m',COL.blue],['2 m',COL.ok],['4 m',COL.violet||COL.amber]]); }); },
  kv:function(T,d,S){ var q=r04(T,d); return [['음속 c',q.c.toFixed(1)+' m/s','a'],['왕복 시간',q.t.toFixed(0)+' μs','g'],['센서 틱(58 μs/cm)',q.tick.toFixed(1)+' cm','v2'],['343 가정 거리 오차',(q.err*100).toFixed(1)+' cm','r'],['상대 오차',(q.err/d*100).toFixed(1)+' %']]; } };

/* ── R05 : 경계면의 반사율과 음향 임피던스 ─────────────────────────── */
var R05M=['지방','간','물','근육','뼈','공기'], R05K=['fat','liver','water','muscle','bone','air'];
function r05(k,dcm){ var Z1=usZ('muscle'), Z2=usZ(R05K[Math.round(k)-1]), R=usR(Z1,Z2), f=5, att=2*0.5*f*dcm, lvl=10*Math.log10(Math.max(R,1e-9))-att; return {Z2:Z2,R:R,T:1-R,att:att,lvl:lvl,Z1:Z1}; }
(function(){
  var a=r05(1,3), b=r05(5,3), c=r05(6,3), d=r05(3,6);
  PROJ.R05={ id:'R05', t:'경계면의 반사와 음향 임피던스 — 재질마다 소리가 반사되는 정도 비교', icon:'🔊', type:'R&E · 탐구', lv:2, dur:'2 주', cost:'약 1 ~ 3만 원',
    one:'스피커에서 짧은 소리(클릭)를 내고 마이크로 반사음을 녹음해 재질(유리판 · 나무판 · 스펀지 · 천)에 따라 반사음 크기가 어떻게 달라지는지 비교한다. 이를 임피던스 차이로 설명하고 초음파 영상의 밝기와 연결한다.',
    q:'딱딱한 판과 푹신한 스펀지에서 소리가 반사되는 세기는 얼마나 다를까? 반사 세기는 무엇으로 정해질까?',
    why:'초음파 영상에서 밝은 경계와 어두운 구역은 <b>반사율 $R=((Z_2-Z_1)/(Z_2+Z_1))^2$</b>에서 나옵니다. 공기–물체 경계가 왜 거의 완전 반사인지(젤이 필요한 까닭)를 소리 실험으로 체험합니다.',
    link:'원리③ 초음파(4번 탭) · 오개념 5 · 6 · 교과서 소리의 반사 · 파동의 세기 · 로그(dB).',
    fig:FIGS.R05.fig, tg:FIGS.R05.tg,
    cap:'스피커(왼쪽)에서 나온 소리가 경계(가운데: 매질1 · 매질2)에서 반사되어 마이크(오른쪽)로 돌아온다. 반사율 식(왼쪽 아래) · 반사 진폭(가운데 아래) · 녹음 분석(오른쪽 아래)',
    parts:[['소리 발생','스피커 · 짧은 클릭음(1 ms)','짧은 펄스일수록 반사 시점이 구분됨','긴 소리는 반사와 직접음이 겹친다. 스마트폰에서 짧은 클릭 파일을 쓴다.'],
           ['반사판 재질','유리 · 나무 · 스펀지 · 천','같은 크기 · 같은 거리','면적 · 거리를 같게 해야 재질만 비교된다. 크기가 파장보다 충분히 커야 한다.'],
           ['마이크','스마트폰 · Audacity','녹음 형식 무손실','자동 이득 조절을 끈다. 직접음(스피커→마이크)과 반사음 시점을 구분한다.'],
           ['반사율 계산','$R=((Z_2-Z_1)/(Z_2+Z_1))^2$','공기 Z ≈ 0.0004 · 물 1.5 · 유리 약 13 MRayl','공기와 딱딱한 물체의 임피던스 차가 매우 커서 거의 전반사. 재질별 R 은 문헌 값 참고.'],
           ['진폭 비교','반사음 진폭 / 직접음 진폭','dB 로 표시','$20\\log_{10}(A_r/A_0)$ 를 구한다. 재질별 순서가 이론과 맞는지.'],
           ['기록','재질 · 거리 · 진폭(dB)','각 5 회','방 반사 · 배경 소음을 줄이려 담요로 둘러싸고 5 회 평균.']],
    budget:[['스마트폰 + 앱','1','보유','—'],['반사판 재질 4 종','1 세트','약 5천 원','골판지 · 아크릴'],['소형 스피커','1','약 5천 원','—'],['담요 · 거리 표시 자','1 세트','보유','—'],['메트로놈 앱(클릭음)','1','무료','—']],
    steps:['조용한 방에서 스피커와 마이크를 같은 높이로 두고 반사판 없이 직접음 진폭 $A_0$ 를 녹음한다.','20 cm 앞에 재질별 판을 세우고 클릭음을 낸 뒤 반사음 진폭 $A_r$ 을 읽는다(재질마다 5 회).','반사 진폭비 $A_r/A_0$ 를 dB 로 환산해 재질별 순위를 표로 만든다.','문헌의 음향 임피던스 값으로 이론 반사율을 계산해 순위와 비교한다.','스펀지 위에 얇은 비닐(젤 흉내)을 덮는 등 표면 조건을 바꾸어 반사가 어떻게 변하는지 본다.'],
    vars:['반사판 재질 · 표면 조건','반사 진폭 $A_r$ (dB)','거리 · 판 크기 · 스피커 출력 · 방 반사'],
    predict:[['근육 → 지방 경계(5 MHz, 3 cm)','R = '+fx(a.R*100,2)+' % · 왕복 감쇠 '+fx(a.att,0)+' dB → 에코 '+fx(a.lvl,0)+' dB','연조직 경계는 반사가 매우 작다'],
             ['근육 → 뼈 경계','R = '+fx(b.R*100,0)+' %','경계 반사가 크다 → 뼈 표면이 밝고 뒤는 그림자'],
             ['근육 → 공기','R = '+fx(c.R*100,2)+' %','거의 전반사 — 젤이 없으면 영상이 안 나온다'],
             ['근육 → 물(6 cm)','R = '+fx(d.R*100,2)+' % · 감쇠 '+fx(d.att,0)+' dB','깊을수록 감쇠로 약해진다(왕복)']],
    data:{cols:['제2 매질','Z₂ (MRayl)','반사율 R (%)','투과율 (%)','에코(3 cm, dB)'],
          rows:[1,2,3,4,5,6].map(function(k){ var q=r05(k,3); return [R05M[k-1],fx(q.Z2,2),fx(q.R*100,3),fx((1-q.R)*100,2),fx(q.lvl,0)]; })},
    analysis:'재질별 반사 진폭(dB)을 막대그래프로 그리고 이론 R 의 순위와 비교한다. 소리 실험에서는 공기 중 소리를 쓰므로 「공기 → 고체」경계의 R 이 거의 1 이고 재질 차이는 표면의 흡음(스펀지의 다공성)으로 나타난다는 점을 논의한다.',
    special:['🎓 연구 설계',[['연구 질문','재질에 따라 소리의 반사 세기는 얼마나 다른가? 임피던스와 흡음 중 어느 것이 더 큰 영향을 주는가?'],['가설','딱딱한 평판 > 천 > 스펀지 순으로 반사가 크다.'],['통제 변인','거리 · 판 크기 · 소리 · 방'],['분석','진폭(dB) 막대 · 문헌 R 과 순위 비교'],['한계','공기 중 소리와 조직 속 초음파의 차이 · 방 반사']]],
    fails:[['반사음이 직접음에 묻힌다','짧은 클릭 · 반사판을 30 cm 이상 · 마이크 위치 조정'],['재질 순서가 이론과 반대','스펀지는 흡음(다공성)이 커서 R 이 작다 — 이 효과를 따로 논의'],['값이 매번 다르다','5 회 평균 · 담요로 방 반사 줄이기']],
    up:['<b>I02</b> — 정합층 · 젤 설계.','<b>R04</b> — 시간 정보까지 함께(거리 + 세기).','<b>R07</b> — 여러 각도에서 반사 지도.'],
    next:['원리③ 초음파',4],
    eval:[['측정','5 회 반복 · dB 변환'],['분석','순위 비교 · 이론 연결'],['해석','임피던스 vs 흡음 분리 논의'],['정직','공기 중 소리 실험의 한계 서술']],
    tip:'「공기 → 물체」가 거의 전반사임을 보여 주는 한 장의 그래프가 「왜 젤을 바르는가」에 답합니다.' };
})();
SIMS.R05={ q:'어떤 재질과 맞닿은 경계에서 초음파는 얼마나 반사되고 깊이에 따라 얼마나 약해질까?',
  a:{nm:'제2 매질(근육 다음)',min:1,max:6,step:1,val:1,unit:'',d:0,fmt:pick(R05M)}, b:{nm:'경계의 깊이',min:1,max:12,step:1,val:3,unit:'cm',d:0},
  cap1:'근육(위)과 제2 매질의 경계에서 입사 펄스가 반사(되돌아가는 화살표) · 투과(아래 화살표)로 나뉩니다. 굵기 = 세기.',
  cap2:'📊 위 : 매질별 경계 반사율(로그 막대) · 아래 : 깊이에 따른 에코 세기(5 MHz, 왕복 감쇠 포함).',
  note:'모형 : 수직 입사 · 근육(Z 1.70) 아래 경계 · 반사율 $R=((Z_2-Z_1)/(Z_2+Z_1))^2$, 에코 = 10 log R − 2αfd (α = 0.5 dB/cm/MHz · f = 5 MHz). 매질 값은 대표 어림값입니다.',
  anim:function(ctx,w,h,t,k,dc,S){ var q=r05(k,dc), y0=h*0.52, cx=w*0.4, tt=(t%5)/5; cvRect(ctx,0,0,w,y0,'rgba(251,113,133,.14)',null); cvRect(ctx,0,y0,w,h-y0,'rgba(125,211,252,.12)',null); cvLine(ctx,[[0,y0],[w,y0]],COL.dim,1.6);
    cvText(ctx,'근육 Z '+q.Z1.toFixed(2),12,y0-12,COL.tick,'11px system-ui,sans-serif'); cvText(ctx,R05M[k-1]+' Z '+q.Z2.toFixed(2),12,y0+16,COL.tick,'11px system-ui,sans-serif');
    var inc=Math.min(1,tt*2), refl=Math.max(0,(tt-0.5)*2); var wi=4+10*1, wr=2+Math.min(14,Math.sqrt(q.R)*18), wt=2+10*Math.sqrt(1-q.R);
    cvLine(ctx,[[cx-20,y0-(y0-30)*(1-inc)-0],[cx-20,y0]],COL.blue,wi); if(refl>0){ cvLine(ctx,[[cx+20,y0],[cx+20,y0-(y0-30)*refl]],COL.grav,wr); } if(tt>0.5){ cvLine(ctx,[[cx-20,y0],[cx-20,y0+(h-y0-20)*Math.min(1,(tt-0.5)*2)]],COL.ok,wt); }
    cvText(ctx,'반사 R = '+(q.R*100).toFixed(2)+' % · 투과 '+(q.T*100).toFixed(2)+' %',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'깊이 '+dc+' cm 에서 되돌아온 에코 ≈ '+q.lvl.toFixed(0)+' dB',12,h-12,q.lvl>-60?COL.ok:COL.grav,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,k,dc,S){ var hh=Math.floor(h/2), i, cols=['#fbbf24','#7dd3fc','#34d399','#a78bfa','#fb7185','#94a3b8'];
    subPlot(ctx,0,0,w,hh,{xmin:0.5,xmax:6.5,ymin:1e-5,ymax:2,ylog:true,ylabel:'반사율 R',title:'매질별 경계 반사율(근육 기준)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toExponential(0); }}, function(P){ for(i=1;i<=6;i++){ var q=r05(i,1); ctx.fillStyle=cols[i-1]; ctx.globalAlpha=(i===k?1:0.5); ctx.fillRect(P.X(i)-14,P.Y(Math.max(q.R,1e-5)),28,P.y0-P.Y(Math.max(q.R,1e-5))); ctx.globalAlpha=1; cvText(ctx,R05M[i-1],P.X(i),P.y0+10,COL.tick,'10.5px system-ui,sans-serif','center'); } });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:12,ymin:-100,ymax:0,xlabel:'경계 깊이 (cm)',ylabel:'에코 (dB)',title:'깊이 대 에코 세기(왕복 감쇠 2αfd 포함)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [2,5,6].forEach(function(kk,j){ plotLine(ctx,P,[0,3,6,9,12].map(function(d){ return [d,r05(kk,d).lvl]; }),[COL.ok,COL.grav,COL.dim][j],1.6); }); plotLine(ctx,P,[0,3,6,9,12].map(function(d){ return [d,r05(k,d).lvl]; }),COL.amber,2.6); plotPoints(ctx,P,[[dc,r05(k,dc).lvl]],COL.amber,6.5); legend(ctx,P.x1-120,P.y1+14,[['간',COL.ok],['뼈',COL.grav],['공기',COL.dim],['지금',COL.amber]]); }); },
  kv:function(k,dc,S){ var q=r05(k,dc); return [['반사율 R',(q.R*100).toFixed(3)+' %','a'],['투과율',((1-q.R)*100).toFixed(2)+' %'],['왕복 감쇠',q.att.toFixed(0)+' dB','g'],['에코 세기',q.lvl.toFixed(0)+' dB','v2'],['판정',q.lvl>-60?'✅ 보인다(동적범위 60 dB)':'❌ 안 보인다','r']]; } };
