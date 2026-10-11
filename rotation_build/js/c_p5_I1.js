/* ═══════════════════════════════════════════════════════════════════════════
   발명 프로젝트 I01 ~ I05 : 빔 토크 렌치 · 비틀림 저울 · 회전수 센서 · 천칭 감도 · 반작용 휠
   (손으로 돌리는 낮은 속력 · 작은 질량 · 5 V 이하. 모든 모형은 교육용 어림)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I01 : 빔 토크 렌치 — 지시 각 θ = τ/κ_b , 손 힘 F = τ/L ───────── */
function i01(tau,L,seed){ var rn=rng32(seed*3+11), kb=0.25, ang=tau/kb, F=tau/(L/100), rows=[], i;
  for(i=0;i<6;i++){ var tt=1+1.6*i, an=tt/kb; rows.push({t:tt,a:an*(1+0.05*gaussR(rn))+0.2*gaussR(rn),ideal:an}); }
  return {ang:ang,F:F,ok:F<=60&&ang<=40,rows:rows,Lmin:tau/60*100}; }
(function(){ var a=i01(5,30,1), b=i01(5,15,1), c=i01(10,30,1), d=i01(9,40,1);
  mkP({ id:'I01', t:'빔 토크 렌치 발명 — 나사를 적당한 세기로 조이는 도구', icon:'🔩', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 1 만 5 천 원',
    one:'얇은 금속 판(휨 빔)이 토크에 비례해 휘는 것을 이용해, 손잡이 길이 L 에서 나사를 조이는 토크 τ 를 휜 각도 θ = τ/κ_b 로 읽는 눈금 렌치 시제품을 만들고 눈금을 보정한다.',
    q:'조일 때 얼마나 세게 돌리고 있는지 어떻게 알까? 빔이 휘는 각은 토크에 비례할까? 손잡이가 길면 같은 토크에 힘이 얼마나 줄까?',
    why:'<b>자동차 바퀴 너트와 자전거 부품</b>은 정해진 토크로 조여야 합니다. 토크 렌치는 「힘을 길이와 곱해 눈금으로 보여 주는」 도구입니다. 안전한 모형으로 눈금 보정까지 해 볼 수 있습니다.',
    link:'원리② 토크와 평형(3번 탭) · 종합1(15번 탭).',
    cap:'얇은 판 빔(길이 L)의 한쪽을 렌치 머리에 고정하고 손잡이 끝에 힘을 줄 때 휘는 각도를 지시침이 눈금에 표시한다(가운데). 판 빔 · 렌치 머리 · 지시침 · 눈금판 · 보정용 추 · 기록표',
    parts:[['휨 빔','얇은 금속판','쇠자 · 얇은 알루미늄 판','휘는 정도가 토크에 비례하는 구간만 쓴다.'],
           ['렌치 머리','볼트 머리용 소켓','목재 · 플라스틱 소켓','안전한 낮은 토크(10 N·m 이하) 모형 볼트.'],
           ['지시침 · 눈금판','각도 표시','종이 눈금판','0° 에서 40° 까지 눈금을 그린다.'],
           ['보정 추','알려진 토크','추 + 자','알려진 힘을 걸어 눈금에 N·m 를 새긴다.'],
           ['손잡이','길이 L 15 ~ 40 cm','나무 막대','길이를 정확히 재서 기록한다.'],
           ['기록표','τ · θ','스프레드시트','θ 대 τ 그래프.']],
    budget:[['쇠자 · 얇은 판','1','약 3 천 원','—'],['목재 · 나사','1 세트','약 4 천 원','—'],['종이 눈금판 · 핀','1','약 1 천 원','—'],['추 세트','1','학교 보유','—'],['장갑','1','—','—']],
    steps:['빔 렌치를 만들고 손잡이 길이 L 을 정확히 잰다.','알려진 추를 걸어 토크 $\\tau=mgL$ 를 만들고 지시침 각 θ 를 눈금판에 표시한다(0.5 ~ 10 N·m).','θ 대 τ 가 원점을 지나는 직선인지 확인해 기울기 $\\kappa_b$ 를 구한다.','눈금판에 N·m 를 새기고 볼트 하나를 조여 목표 토크에서 눈금이 맞는지 확인한다.','L 을 바꿔 같은 토크에 필요한 힘 F 가 어떻게 달라지는지 보고한다.'],
    vars:['설정 토크 τ · 손잡이 길이 L','지시침 각 θ · 필요한 손 힘 F','빔 두께 · 온도 · 반복 사용'],
    predict:[['τ = 5 N·m · L = 30 cm','θ = '+fx(a.ang,0)+'° · F = '+fx(a.F,0)+' N','$\\theta=\\tau/\\kappa_b$, $F=\\tau/L$'],
             ['τ = 5 N·m · L = 15 cm','F = '+fx(b.F,0)+' N','짧은 손잡이는 힘이 든다'],
             ['τ = 10 N·m · L = 30 cm','θ = '+fx(c.ang,0)+'° · F = '+fx(c.F,0)+' N','토크가 2 배 → 각도도 2 배'],
             ['τ = 9 N·m · L = 40 cm','θ = '+fx(d.ang,0)+'° · F = '+fx(d.F,0)+' N','빔 한계 가까움']],
    data:{cols:['τ (N·m)','θ 측정 (°)','이론 (°)','차이 (°)'], rows:i01(5,30,1).rows.map(function(q){ return [fx(q.t,1),fx(q.a,1),fx(q.ideal,1),fx(q.a-q.ideal,1)]; })},
    analysis:'θ 대 τ 의 직선 기울기 $1/\\kappa_b$ 를 구하고 선형성 한계(탄성한계)를 찾는다. 눈금 정확도는 반복 측정의 표준편차와 최대 오차로 표시한다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 빔 렌치'],['측정 범위','0 ~ 10 N·m'],['정확도','±5 % (목표)'],['재료','얇은 금속판'],['안전','한계 이상 힘 금지 · 장갑']]],
    fails:[['눈금이 일정하지 않다','빔이 소성 변형되었으니 새 판으로 교체하고 한계를 줄인다'],['0 점이 어긋난다','빔을 편 상태에서 지시침 0 점을 다시 맞춘다'],['손잡이가 헛돈다','빔과 손잡이를 단단히 고정한다']],
    up:['<b>C05</b> — 렌치 체험 부스.','<b>I02</b> — 비틀림 저울.','<b>종합1(15번 탭)</b> — 토크 측정.'],
    next:['원리② 토크와 평형',3],
    eval:[['창의성','구조'],['정확성','눈금 오차'],['반복성','재현성'],['안전','한계 힘']],
    tip:'보정 곡선(θ 대 τ)과 한계(탄성한계)를 함께 제시하면 시제품 보고서가 단단해집니다.' });
})();
SIMS.I01={ q:'설정 토크와 손잡이 길이를 바꾸면 지시침과 필요한 힘은 어떻게 될까?',
  a:{nm:'설정 토크 τ',min:1,max:12,step:0.5,val:5,unit:'N·m',d:1}, b:{nm:'손잡이 길이 L',min:15,max:45,step:1,val:30,unit:'cm',d:0},
  cap1:'손잡이 끝을 당기면 빔이 휘고 지시침이 눈금을 가리킵니다. 눈금의 한계는 40°, 손 힘 한계는 60 N.',
  cap2:'📊 토크 τ 와 지시침 각 θ — 직선(기울기 1/κ_b), 측정점은 잡음 5 %.',
  note:'모형 : 휨 각이 토크에 비례(κ_b = 0.25 N·m/°) · 직각으로 당김 · 40° 이상은 탄성한계 초과.',
  anim:function(ctx,w,h,t,tau,L,S){ var o=i01(tau,L,S.seed), cx=w*0.22, cy=h*0.5, sc=w*0.011, th=Math.min(o.ang,50)*PI/180*Math.min(1,(t%6)/1.2);
    cvCirc(ctx,cx,cy,12,'rgba(148,163,184,.6)',COL.white,1.2); ctx.save(); ctx.translate(cx,cy); drawBeam(ctx,0,0,L*sc*0.8,0,6,COL.dim); ctx.rotate(-th); drawBeam(ctx,0,0,L*sc*0.8,0,5,COL.tick); cvArrow(ctx,L*sc*0.8,0,L*sc*0.8,-Math.min(60,o.F)*0.8,COL.grav,3); ctx.restore();
    var px=w*0.62, py=h*0.65, rr=Math.min(h*0.4,w*0.18); ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(px,py,rr,PI,PI*1.5+0.2); ctx.stroke(); ctx.lineWidth=1;
    for(var k=0;k<=40;k+=10){ var aa=PI+k/40*(PI/2); cvLine(ctx,[[px+rr*0.9*Math.cos(aa),py+rr*0.9*Math.sin(aa)],[px+rr*Math.cos(aa),py+rr*Math.sin(aa)]],COL.tick,1.5); cvText(ctx,k+'°',px+(rr+14)*Math.cos(aa),py+(rr+14)*Math.sin(aa),COL.tick,'10px system-ui,sans-serif','center'); }
    var pa=PI+Math.min(o.ang,40)/40*(PI/2)*Math.min(1,(t%6)/1.2); cvLine(ctx,[[px,py],[px+rr*0.85*Math.cos(pa),py+rr*0.85*Math.sin(pa)]],COL.amber,3);
    cvText(ctx,'τ = '+tau.toFixed(1)+' N·m · θ = '+o.ang.toFixed(0)+'° · 손 힘 F = '+o.F.toFixed(0)+' N '+(o.ok?'✅':'⚠ 한계 초과'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,tau,L,S){ var o=i01(tau,L,S.seed);
    lineGraph(ctx,w,h,{xmin:0,xmax:12,ymin:0,ymax:55,xl:'토크 τ (N·m)',yl:'지시침 각 θ (°)',title:'τ 와 θ — θ = τ/κ_b',curves:[{pts:[[0,0],[12,48]],col:COL.ok,lw:2.2},{pts:[[0,40],[12,40]],col:COL.grav,lw:1.2,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.t,q.a]; }),now:[tau,o.ang],legend:[['이론',COL.ok],['탄성한계 40°',COL.grav],['측정',COL.blue],['지금',COL.amber]],yd:0,lw:120}); },
  kv:function(tau,L,S){ var o=i01(tau,L,S.seed); return [['지시침 각 θ',o.ang.toFixed(1)+'°','a'],['필요한 손 힘 F',o.F.toFixed(0)+' N','g'],['한계 힘 60 N 일 때 최소 L',o.Lmin.toFixed(0)+' cm','v2'],['κ_b','0.25 N·m/°','r'],['판정',o.ok?'사용 가능':'한계 초과']]; } };

/* ── I02 : 비틀림 저울 — T = 2π√(I/κ) , κ = 4π² I / T² ─────────── */
function i02(m,kap,seed){ var rn=rng32(seed*5+9), Id=6.25e-5, ru=0.04, I=Id+2*(m/1000)*ru*ru, k=kap*1e-3, T=TAU*Math.sqrt(I/k), rows=[], i;
  for(i=0;i<6;i++){ var mm=5+5*i, II=Id+2*(mm/1000)*ru*ru, TT=TAU*Math.sqrt(II/k); rows.push({m:mm,T:TT*(1+0.02*gaussR(rn)),ideal:TT}); }
  return {I:I,T:T,k:k,f:1/T,kinf:TAU*TAU*I/(T*T),tau1:k*0.1,rows:rows}; }
(function(){ var a=i02(10,1,1), b=i02(30,1,1), c=i02(10,3,1), d=i02(20,0.5,1);
  mkP({ id:'I02', t:'비틀림 저울 발명 — 철사의 비틀림으로 작은 토크 재기', icon:'🧵', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 1 만 원',
    one:'가는 철사(또는 낚싯줄)에 매단 원판의 진동 주기 T 를 재서 비틀림 상수 κ 를 $\\kappa=4\\pi^2I/T^2$ 로 구하고, 그 κ 로 작은 토크를 재는 비틀림 저울(쿨롱 저울 원리)을 만든다.',
    q:'가는 철사가 정말 용수철처럼 되돌리는 토크를 줄까? 질량을 달면 주기는 어떻게 변할까? 이 저울로 얼마나 작은 힘을 잴 수 있을까?',
    why:'<b>쿨롱의 정전기 힘, 캐번디시의 중력 상수</b> 실험이 비틀림 저울로 이루어졌습니다. 작은 토크를 주기라는 시간으로 바꿔 읽는 아이디어를 안전한 장난감 규모로 재현합니다.',
    link:'원리③ 관성 모멘트(4번 탭) · 원리⑤ 진자와 진동(6번 탭).',
    cap:'가는 철사에 매단 원판(관성 모멘트 I)이 비틀려 왕복한다(가운데). 원판 위 두 질량 m 의 위치 r 를 바꿔 주기를 비교한다. 철사 · 원판 · 질량 · 스톱워치 · 영상 · 기록표',
    parts:[['가는 철사','κ ≈ 1 mN·m/rad','낚싯줄 · 가는 구리선','길이와 굵기를 기록한다.'],
           ['원판','I_d ≈ 6×10⁻⁵ kg·m²','CD 원판 · 두꺼운 종이','질량과 반지름을 잰다.'],
           ['추 2 개','m, r = 4 cm','동전 묶음','원판 가장자리에 대칭으로 붙인다.'],
           ['받침틀','수직 고정','ㄷ자 틀 · 클램프','철사가 진동 중 꼬이지 않게.'],
           ['주기 측정','스톱워치 · 영상','스마트폰 슬로 모션','10 회 진동 시간 ÷ 10.'],
           ['기록표','m · T','스프레드시트','T² 대 I 그래프.']],
    budget:[['낚싯줄 · 철사','1','약 2 천 원','—'],['CD · 종이 원판','1','약 1 천 원','—'],['동전 · 접착제','1','약 1 천 원','—'],['받침틀','1','약 4 천 원','—'],['스마트폰','1','보유','—']],
    steps:['철사에 원판을 매달고 처음 비틀림을 작게(10° 이내) 주어 진동 주기 T₀ 를 재고, 10 회 평균을 구한다.','원판 위에 질량 m = 5 ~ 30 g 을 붙여 T 를 잰다.','$T^2$ 대 $I$ 가 직선인지 확인하고 기울기 $4\\pi^2/\\kappa$ 로 κ 를 구한다.','구한 κ 로 작은 힘(예: 0.1 g 무게)이 만드는 비틀림 각 $\\theta=\\tau/\\kappa$ 를 예측한다.','저울로 쓸 수 있는 가장 작은 토크를 보고한다.'],
    vars:['추 질량 m · 철사 κ','진동 주기 T','처음 각 · 공기 저항 · 철사 길이'],
    predict:[['m = 10 g · κ = 1 mN·m/rad','T = '+fx(a.T,2)+' s','$T=2\\pi\\sqrt{I/\\kappa}$'],
             ['m = 30 g · κ = 1','T = '+fx(b.T,2)+' s','질량이 크면 주기도 길다'],
             ['m = 10 g · κ = 3','T = '+fx(c.T,2)+' s','철사가 굵으면 빠르다'],
             ['m = 20 g · κ = 0.5','T = '+fx(d.T,2)+' s','약한 철사 — 매우 느림']],
    data:{cols:['m (g)','T 측정 (s)','이론 (s)','차이 (%)'], rows:i02(10,1,1).rows.map(function(q){ return [fx(q.m,0),fx(q.T,2),fx(q.ideal,2),fx((q.T/q.ideal-1)*100,1)]; })},
    analysis:'$T^2$ 대 $I$ 의 직선 기울기에서 κ 를 구하고 이론 $4\\pi^2/\\kappa$ 와 비교한다. 진폭이 작을 때만 주기가 일정하므로(Hooke 한계) 진폭을 바꿔 확인한다. 공기 저항으로 진폭이 서서히 줄어드는 감쇠 시간 상수도 구해 본다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 비틀림 저울'],['측정 범위','0.1 ~ 10 mN·m'],['측정량','주기 → κ → 토크'],['재료','가는 철사 · 원판'],['안전','철사 끝 눈 보호 · 바람 차단']]],
    fails:[['진동이 금방 멈춘다','공기 저항 — 원판을 작게 하고 바람을 막는다'],['주기가 일정하지 않다','진폭이 너무 크다 — 10° 이내로'],['원판이 흔들린다','철사를 수직으로 정확히 고정한다']],
    up:['<b>I01</b> — 빔 토크 렌치.','<b>R03</b> — 관성 모멘트 측정.','<b>종합1(15번 탭)</b> — 토크 측정.'],
    next:['원리③ 관성 모멘트와 τ=Iα',4],
    eval:[['창의성','저울 구성'],['정확성','κ 오차'],['반복성','주기 재현성'],['안전','철사 끝 보호']],
    tip:'「주기 = 작은 토크를 시간으로 읽는 방법」임을 한 문장으로 요약해 보세요.' });
})();
SIMS.I02={ q:'원판 위 질량과 철사의 굵기를 바꾸면 비틀림 진동 주기는 어떻게 될까?',
  a:{nm:'원판 위 질량 m(각 2 개)',min:0,max:40,step:5,val:10,unit:'g',d:0}, b:{nm:'비틀림 상수 κ',min:0.3,max:4,step:0.1,val:1,unit:'mN·m/rad',d:1},
  cap1:'원판이 철사에 매달려 비틀림 진동합니다. 주기 T 는 $\\sqrt{I/\\kappa}$ 에 비례합니다.',
  cap2:'📊 질량 m 에 따른 주기 T — 이론(곡선)과 측정(점).',
  note:'모형 : 질량은 반지름 4 cm 에 2 개 · 원판 I_d = 6.25×10⁻⁵ kg·m² · 감쇠 무시 · 측정 잡음 2 %.',
  anim:function(ctx,w,h,t,m,kap,S){ var o=i02(m,kap,S.seed), cx=w*0.3, cy=h*0.62, rx=Math.min(w*0.2,h*0.5), th=0.8*Math.sin(TAU*t/o.T), ry=rx*0.3;
    cvLine(ctx,[[cx,10],[cx,cy]],COL.dim,1.5); ctx.strokeStyle='rgba(148,163,184,.7)'; ctx.fillStyle='rgba(148,163,184,.25)'; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,TAU); ctx.fill(); ctx.stroke();
    [0,PI].forEach(function(a0){ var px=cx+rx*0.8*Math.cos(th+a0), py=cy+ry*0.8*Math.sin(th+a0); cvCirc(ctx,px,py,5+m*0.08,COL.grav,COL.white,1.2); });
    cvText(ctx,'주기 T = '+o.T.toFixed(2)+' s · 진동수 f = '+o.f.toFixed(2)+' Hz · θ = '+(th*180/PI).toFixed(0)+'°',12,h-12,COL.text,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.55,h*0.28,w*0.4,h*0.45,[['I (×10⁻⁴)',o.I*1e4,COL.blue],['κ (mN·m/rad)',o.k*1e3,COL.ok],['T (s)',o.T,COL.amber]],Math.max(o.I*1e4,o.T,o.k*1e3)*1.15,''); },
  graph:function(ctx,w,h,m,kap,S){ var o=i02(m,kap,S.seed), cur=[],k; for(k=0;k<=40;k+=1){ var II=6.25e-5+2*(k/1000)*0.0016; cur.push([k,TAU*Math.sqrt(II/(kap*1e-3))]); }
    lineGraph(ctx,w,h,{xmin:0,xmax:42,ymin:0,ymax:Math.max(2,cur[40][1]*1.15),xl:'원판 위 질량 m (g)',yl:'주기 T (s)',title:'m 에 따른 주기 T = 2π√(I/κ)',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.m,q.T]; }),now:[m,o.T],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:2,lw:90}); },
  kv:function(m,kap,S){ var o=i02(m,kap,S.seed); return [['I',(o.I*1e4).toFixed(2)+' ×10⁻⁴ kg·m²','a'],['주기 T',o.T.toFixed(2)+' s','g'],['진동수 f',o.f.toFixed(2)+' Hz','v2'],['κ(주기에서 역산)',(o.kinf*1e3).toFixed(2)+' mN·m/rad','r'],['0.1 rad 에서 토크',(o.tau1*1e3).toFixed(2)+' mN·m']]; } };

/* ── I03 : 회전수 센서 — rpm = 60·N_count/(N·T) ───────────────── */
function i03(N,T,seed){ var rn=rng32(seed*7+2), rpm=150, thr=200, ex=N*T*rpm/60, cnt=Math.round(ex+0.4*gaussR(rn)), meas=60*cnt/(N*T), res=60/(N*T), rows=[], i;
  for(i=0;i<6;i++){ var r2=rng32(seed*31+i), c2=Math.round(ex+0.8*(r2()-0.5)*2), mm=60*c2/(N*T); rows.push({i:i+1,m:mm,ideal:rpm}); }
  return {rpm:rpm,meas:meas,res:res,err:(meas/rpm-1)*100,warn:meas>=thr,rows:rows,cnt:cnt,ex:ex}; }
(function(){ var a=i03(4,1,1), b=i03(1,0.5,1), c=i03(10,1,1), d=i03(20,2,1);
  mkP({ id:'I03', t:'회전수 센서·속도 경고기 발명 — 홀 센서로 rpm 읽기', icon:'📟', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 2 만 원',
    one:'회전하는 판의 가장자리에 자석 N 개를 붙이고 홀 센서(5 V)가 T 초 동안 센 신호 수로 rpm 을 구하는 회전수 센서를 만들어, 설정 회전수(200 rpm)를 넘으면 LED 가 켜지는 속도 경고기를 완성한다.',
    q:'센서가 센 신호 수로 rpm 을 어떻게 알아낼까? 자석을 많이 붙이면 정확해질까? 측정 시간을 길게 하면 어떨까?',
    why:'<b>자전거 속도계 · 엔진 회전계 · 세탁기 센서</b>가 모두 회전수 센서입니다. 「센 횟수 ÷ 시간」이라는 단순한 아이디어가 해상도와 응답 시간의 맞바꿈으로 이어진다는 것이 핵심입니다.',
    link:'원리① 각운동학(2번 탭) · 도구함 회전수 코드(14번 탭).',
    cap:'회전판 가장자리에 N 개 자석(왼쪽), 고정된 홀 센서가 T 초 동안 신호를 세어(가운데) rpm 을 표시하고 설정을 넘으면 LED 를 켠다(오른쪽). 회전판 · 자석 · 홀 센서 · 마이크로컨트롤러(5 V) · LED · 기록표',
    parts:[['회전판','반지름 6 cm','판지 · CD','자석 N 개를 같은 간격으로 붙인다.'],
           ['자석','소형 네오디뮴 N 개','소형 자석 4 ~ 20 개','극 방향을 모두 같게. 삼키지 않게 주의.'],
           ['홀 센서','5 V 센서','홀 센서 모듈','자석이 센서 앞을 지날 때 펄스.'],
           ['마이크로컨트롤러','카운터 · 타이머','교육용 보드(5 V)','T 초 동안 펄스 수를 센다.'],
           ['LED · 부저','경고','LED 1 개','200 rpm 이상이면 켠다.'],
           ['기록표','N · T · rpm','스프레드시트','분해능 대 응답 시간.']],
    budget:[['회전판 · 모터(5 V)','1','약 4 천 원','—'],['홀 센서 · 자석','1 세트','약 5 천 원','—'],['교육용 보드','1','약 8 천 원','—'],['LED · 저항','1','약 1 천 원','—'],['전원(5 V)','1','약 2 천 원','—']],
    steps:['회전판을 5 V 모터로 150 rpm 정도에 돌리고 자석 N = 1, 4, 10, 20 개를 붙인다(안전을 위해 낮은 속도).','측정 시간 T = 0.2, 0.5, 1, 2 s 로 바꿔 센 신호 수를 기록한다.','$\\mathrm{rpm}=60\\,n/(NT)$ 로 계산하고 실제(고속 영상)와 비교한다.','해상도 $60/(NT)$ 와 응답 시간 T 의 맞바꿈 그래프를 그린다.','200 rpm 이상일 때 LED 가 켜지는지 시험한다.'],
    vars:['자석 개수 N · 측정 시간 T','측정 rpm · 해상도','모터 전압 · 자석 간격 · 센서 거리'],
    predict:[['N = 4 · T = 1 s','측정 ≈ '+fx(a.meas,0)+' rpm · 해상도 '+fx(a.res,0)+' rpm','150 rpm = 2.5 회전/초 → 센 수 10'],
             ['N = 1 · T = 0.5 s','측정 ≈ '+fx(b.meas,0)+' rpm · 해상도 '+fx(b.res,0)+' rpm','해상도가 나쁘다'],
             ['N = 10 · T = 1 s','측정 ≈ '+fx(c.meas,0)+' rpm · 해상도 '+fx(c.res,0)+' rpm','N 이 늘면 좋아진다'],
             ['N = 20 · T = 2 s','측정 ≈ '+fx(d.meas,0)+' rpm · 해상도 '+fx(d.res,1)+' rpm','정확하지만 느리다']],
    data:{cols:['시행','rpm 측정','실제 rpm','차이'], rows:i03(4,1,1).rows.map(function(q){ return [fx(q.i,0),fx(q.m,0),fx(q.ideal,0),fx(q.m-q.ideal,0)]; })},
    analysis:'해상도 $\\Delta\\mathrm{rpm}=60/(NT)$ 와 오차가 같은 수준인지 확인하고, N·T 곱 대 표준편차 그래프를 그린다. 응답 시간(T)과 정확도의 맞바꿈을 설명한다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 회전수 센서'],['측정 범위','30 ~ 300 rpm'],['분해능','60/(N·T)'],['경고','200 rpm 이상 LED'],['안전','5 V 이하 · 낮은 속도 · 자석 삼킴 주의']]],
    fails:[['신호가 빠진다','센서 거리를 줄이고(2~3 mm) 자석 방향을 맞춘다'],['rpm 이 흔들린다','T 를 늘리거나 이동 평균을 쓴다'],['자석이 떨어진다','접착제로 단단히 붙인다']],
    up:['<b>C08</b> — 회전판 놀이기구.','<b>I10</b> — 휠 균형 장치.','<b>종합3(17번 탭)</b> — 회전수 측정.'],
    next:['원리① 각운동학',2],
    eval:[['창의성','경고 구성'],['정확성','rpm 오차'],['반복성','재현성'],['안전','5 V · 자석 관리']],
    tip:'「해상도와 반응 속도는 맞바꿈」이라는 그래프를 한 장 넣으면 설득력이 큽니다.' });
})();
SIMS.I03={ q:'자석 개수와 측정 시간을 바꾸면 rpm 측정값과 해상도는 어떻게 달라질까?',
  a:{nm:'자석 개수 N',min:1,max:20,step:1,val:4,unit:'개',d:0}, b:{nm:'측정 시간 T',min:0.2,max:2,step:0.1,val:1,unit:'s',d:1},
  cap1:'회전판(150 rpm)이 돌며 자석이 센서 앞을 지나면 펄스가 셉니다. 센 수로 rpm 을 계산하고 200 rpm 이상이면 경고 LED.',
  cap2:'📊 N·T 에 따른 해상도 60/(N·T) — 곡선 위 점이 지금 설정.',
  note:'모형 : 실제 150 rpm 고정 · 센 수는 정수로 반올림 · 약간의 잡음 · 경고 기준 200 rpm.',
  anim:function(ctx,w,h,t,N,T,S){ var o=i03(N,T,S.seed), cx=w*0.25, cy=h*0.52, R=Math.min(h*0.34,w*0.16), ang=t*TAU*150/60*0.15;
    ctx.fillStyle='rgba(148,163,184,.3)'; ctx.beginPath(); ctx.arc(cx,cy,R,0,TAU); ctx.fill(); for(var i=0;i<N;i++){ var a=ang+i*TAU/N; cvCirc(ctx,cx+R*0.85*Math.cos(a),cy-R*0.85*Math.sin(a),4,COL.grav,COL.white,1); }
    cvRect(ctx,cx+R+6,cy-8,16,16,COL.ok,COL.white,1.2); cvText(ctx,'홀 센서',cx+R+14,cy+24,COL.tick,'11px system-ui,sans-serif','center');
    cvText(ctx,'N = '+N+' · T = '+T.toFixed(1)+' s → 센 수 '+o.cnt+' → '+o.meas.toFixed(0)+' rpm (오차 '+o.err.toFixed(1)+'%)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    cvCirc(ctx,w*0.8,h*0.3,12,o.warn?'#ef4444':'rgba(100,116,139,.5)',COL.white,1.5); cvText(ctx,o.warn?'경고!':'정상',w*0.8,h*0.3+28,COL.tick,'11.5px system-ui,sans-serif','center');
    barRows(ctx,w*0.5,h*0.5,w*0.46,h*0.35,[['실제',o.rpm,COL.dim],['측정',o.meas,COL.blue],['해상도 ×10',o.res*10,COL.amber]],Math.max(o.rpm,o.meas,o.res*10)*1.1,''); },
  graph:function(ctx,w,h,N,T,S){ var o=i03(N,T,S.seed), cur=[],k; for(k=1;k<=40;k+=1) cur.push([k,60/(k*T)]);
    lineGraph(ctx,w,h,{xmin:0,xmax:42,ymin:0,ymax:Math.max(60/T*1.05,60),xl:'자석 개수 N',yl:'해상도 60/(N·T) (rpm)',title:'N 에 따른 해상도(작을수록 정밀)',curves:[{pts:cur,col:COL.ok,lw:2.2}],now:[N,o.res],legend:[['해상도',COL.ok],['지금',COL.amber]],yd:0,lw:90}); },
  kv:function(N,T,S){ var o=i03(N,T,S.seed); return [['센 수 (기대)',o.ex.toFixed(1)+' → '+o.cnt,'a'],['측정 rpm',o.meas.toFixed(0)+' rpm','g'],['해상도',o.res.toFixed(1)+' rpm','v2'],['오차',o.err.toFixed(1)+' %','r'],['경고 LED',o.warn?'켜짐':'꺼짐']]; } };

/* ── I04 : 천칭 감도 — tanφ = Δm L /(M h) , T = 2π√(I/(M g h)) ───── */
function i04(L,hmm,seed){ var rn=rng32(seed*3+5), M=100, dm=1, h=hmm/10, phi=Math.atan(dm*L/(M*h))*180/PI, I=(M/1000)*Math.pow(L/100,2)/3, T=TAU*Math.sqrt(I/((M/1000)*G*(hmm/1000))), rows=[], i;
  for(i=0;i<6;i++){ var dd=0.5+0.5*i, ph=Math.atan(dd*L/(M*h))*180/PI; rows.push({d:dd,p:ph*(1+0.04*gaussR(rn)),ideal:ph}); }
  return {phi:phi,T:T,sens:phi,rows:rows,slow:T>6}; }
(function(){ var a=i04(15,3,1), b=i04(15,1,1), c=i04(25,3,1), d=i04(15,8,1);
  mkP({ id:'I04', t:'천칭 저울 감도 설계 — 민감하지만 느리지 않게', icon:'⚖️', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 1 만 원',
    one:'받침점 아래 무게중심 높이 h 와 팔 길이 L 을 바꿔 가며 1 g 의 질량 차이에 대한 기울기 각 φ(감도)와 흔들림 주기 T 를 측정하고, 민감도와 안정(빠른 정지)의 균형이 좋은 천칭 저울을 설계한다.',
    q:'감도를 높이려면 팔을 길게? 무게중심을 받침점에 가깝게? 그러면 왜 천천히 흔들릴까?',
    why:'<b>정밀 저울</b>은 감도 $\\tan\\varphi=\\Delta m L/(Mh)$ 를 크게 하려고 h 를 매우 작게 하지만 그러면 주기가 길어져 측정이 오래 걸립니다. 공학에서 흔한 「성능 대 속도」의 맞바꿈을 보여 줍니다.',
    link:'원리② 토크와 평형(3번 탭) · 원리⑤ 진자(6번 탭).',
    cap:'받침점 위에 얹은 가벼운 팔(길이 2L)의 양 끝에 접시, 아래에 조절 가능한 추(무게중심을 h 만큼 아래로). 한쪽에 1 g 을 더 올리면 기울어진 각이 감도(가운데). 팔 · 접시 · 조절 추 · 받침점 · 각도기 · 기록표',
    parts:[['팔(빔)','반길이 L = 10 ~ 30 cm','알루미늄 막대','가볍고 단단하게.'],
           ['받침점','칼날 받침','바늘 · 클립 날','마찰을 작게.'],
           ['조절 추','무게중심 높이 h 조절','볼트와 너트','아래로 내리면 h 가 커진다.'],
           ['접시 · 추','Δm = 1 g','동전 · 클립','1 g 단위로 올린다.'],
           ['각도 측정','φ 읽기','지시침 + 각도기','영상으로 읽는다.'],
           ['기록표','φ · T','스프레드시트','φ 대 Δm 그래프.']],
    budget:[['알루미늄 막대','1','약 3 천 원','—'],['바늘 · 클립 받침','1','약 1 천 원','—'],['볼트 · 너트','1 세트','약 1 천 원','—'],['각도기','1','약 1 천 원','—'],['동전 · 클립','1 세트','약 1 천 원','—']],
    steps:['팔의 무게중심이 받침점 아래 h = 3 mm 가 되도록 조절 추를 세팅한다.','Δm = 0.5 ~ 3 g 을 한쪽에 올릴 때 기울어진 각 φ 를 읽는다.','h 를 1, 3, 5, 8 mm 로 바꿔 감도 φ/Δm 과 흔들림 주기 T 를 잰다.','L 을 바꿔 같은 실험을 하고 $\\tan\\varphi=\\Delta mL/(Mh)$ 와 비교한다.','감도와 주기를 함께 만족하는 h 와 L 을 추천한다.'],
    vars:['팔 길이 L · 무게중심 높이 h','기울기 φ · 흔들림 주기 T','받침점 마찰 · 팔 질량'],
    predict:[['L = 15 cm · h = 3 mm','φ = '+fx(a.phi,0)+'° · T = '+fx(a.T,1)+' s','균형 설계'],
             ['L = 15 cm · h = 1 mm','φ = '+fx(b.phi,0)+'° · T = '+fx(b.T,1)+' s','더 민감하지만 느리다'],
             ['L = 25 cm · h = 3 mm','φ = '+fx(c.phi,0)+'° · T = '+fx(c.T,1)+' s','긴 팔은 민감하다'],
             ['L = 15 cm · h = 8 mm','φ = '+fx(d.phi,0)+'° · T = '+fx(d.T,1)+' s','둔하지만 빠르다']],
    data:{cols:['Δm (g)','φ 측정 (°)','이론 (°)','차이 (°)'], rows:i04(15,3,1).rows.map(function(q){ return [fx(q.d,1),fx(q.p,1),fx(q.ideal,1),fx(q.p-q.ideal,1)]; })},
    analysis:'φ 대 Δm 이 작은 각에서 직선임을 확인하고 기울기를 $L/(Mh)$ 와 비교한다. 감도 대 주기 그래프에서 「쓸 만한」 영역(예: T < 6 s)을 찾는다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 천칭'],['측정 범위','0 ~ 10 g'],['감도','° / g'],['안정 시간','주기 6 s 이하'],['안전','바늘 받침 보호']]],
    fails:[['한쪽으로만 기울어진다','팔 좌우 대칭과 무게중심을 다시 점검'],['움직임이 멈추지 않는다','공기 저항을 줄이지 말고 약한 감쇠를 둔다'],['감도가 너무 낮다','조절 추를 올려 h 를 줄인다']],
    up:['<b>R01</b> — 지렛대 평형.','<b>C01</b> — 균형 모빌.','<b>I02</b> — 비틀림 저울.'],
    next:['원리② 토크와 평형',3],
    eval:[['창의성','설계'],['정확성','감도 일치'],['반복성','재현성'],['안전','바늘 받침 보호']],
    tip:'감도와 응답 시간의 맞바꿈 그래프를 한 장으로 제시하세요.' });
})();
SIMS.I04={ q:'팔 길이와 무게중심 높이를 바꾸면 1 g 에 대한 기울기와 흔들림 주기는 어떻게 될까?',
  a:{nm:'팔 반길이 L',min:10,max:30,step:1,val:15,unit:'cm',d:0}, b:{nm:'무게중심 높이 h',min:1,max:10,step:0.5,val:3,unit:'mm',d:1},
  cap1:'1 g 을 더한 쪽으로 기울어지는 천칭. 무게중심이 받침점에 가까울수록(h 가 작을수록) 크게 기울지만 천천히 흔들립니다.',
  cap2:'📊 무게중심 높이 h 와 감도 φ(왼쪽 축), 흔들림 주기 T — 맞바꿈.',
  note:'모형 : 팔 질량 M = 100 g · 접시 질량 무시 · $I=ML^2/3$ · 작은 감쇠 무시 · 측정 잡음 4 %.',
  anim:function(ctx,w,h,t,L,hmm,S){ var o=i04(L,hmm,S.seed), cx=w*0.5, cy=h*0.45, sc=w*0.012, ph=o.phi*PI/180, tilt=Math.min(0.5,ph)*(1-Math.exp(-(t%6)*1.2)*Math.cos(TAU*(t%6)/o.T));
    drawPivot(ctx,cx,cy,10); ctx.save(); ctx.translate(cx,cy); ctx.rotate(tilt); drawBeam(ctx,-L*sc*0.7,0,L*sc*0.7,0,5,COL.tick); cvLine(ctx,[[0,0],[0,hmm*sc*0.6+12]],COL.dim,2); cvCirc(ctx,0,hmm*sc*0.6+14,5,COL.amber,COL.white,1);
    cvRect(ctx,L*sc*0.7-14,10,28,6,COL.grav,COL.white,1); cvRect(ctx,-L*sc*0.7-14,10,28,6,COL.blue,COL.white,1); cvText(ctx,'+1 g',L*sc*0.7,28,COL.grav,'11px system-ui,sans-serif','center'); ctx.restore();
    cvText(ctx,'φ = '+o.phi.toFixed(0)+'° · 주기 T = '+o.T.toFixed(1)+' s '+(o.slow?'⚠ 너무 느리다':'✅ 쓸 만하다'),12,16,o.slow?COL.amber:COL.ok,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,L,hmm,S){ var p1=[],p2=[],k, mxT=0; for(k=1;k<=10;k+=0.25){ var o2=i04(L,k,S.seed); p1.push([k,o2.phi]); p2.push([k,o2.T*10]); mxT=Math.max(mxT,o2.T*10); }
    var o=i04(L,hmm,S.seed); lineGraph(ctx,w,h,{xmin:0,xmax:10.5,ymin:0,ymax:Math.max(90,mxT),xl:'무게중심 높이 h (mm)',yl:'φ (°) · T ×10 (s)',title:'h 에 따른 감도 φ(위)와 주기 T×10(아래)',curves:[{pts:p1,col:COL.ok,lw:2.2},{pts:p2,col:COL.amber,lw:2}],now:[hmm,o.phi],legend:[['φ (°)',COL.ok],['T×10 (s)',COL.amber],['지금',COL.amber]],yd:0,lw:100}); },
  kv:function(L,hmm,S){ var o=i04(L,hmm,S.seed); return [['감도 φ',o.phi.toFixed(0)+'° / g','a'],['흔들림 주기 T',o.T.toFixed(1)+' s','g'],['tanφ',Math.tan(o.phi*PI/180).toFixed(2),'v2'],['L/(M·h)',(L/(100*hmm/10)).toFixed(2)+' / g','r'],['판정',o.slow?'느리다':'쓸 만하다']]; } };

/* ── I05 : 반작용 휠 — I_w ω_w = I_b ω_b ───────────────────────── */
function i05(R,rpm,seed){ var rn=rng32(seed*5+3), mw=0.1, Iw=0.5*mw*Math.pow(R/100,2), Ib=0.004, ww=rpm*TAU/60, wb=Iw*ww/Ib, T90=(PI/2)/wb, rows=[], i;
  for(i=0;i<6;i++){ var rr=100+100*i, w2=rr*TAU/60, wbb=Iw*w2/Ib; rows.push({r:rr,w:wbb*(1+0.05*gaussR(rn)),ideal:wbb}); }
  return {Iw:Iw,Ib:Ib,wb:wb,deg:wb*180/PI,T90:T90,Lw:Iw*ww,ok:T90<=3,rows:rows}; }
(function(){ var a=i05(4,300,1), b=i05(2,300,1), c=i05(6,300,1), d=i05(4,600,1);
  mkP({ id:'I05', t:'반작용 휠 자세 제어 발명 — 우주선처럼 방향 바꾸기', icon:'🛰️', type:'발명 · 시제품', lv:3, dur:'3 주', cost:'약 2 만 5 천 원',
    one:'5 V 소형 모터에 단 휠(100 g, 반지름 R)의 각속도를 바꾸면 반대 방향으로 본체가 도는 반작용 휠 시제품을 만들어, $I_w\\omega_w=I_b\\omega_b$ 로 예측한 본체의 회전 속도를 비디오로 확인한다.',
    q:'바닥을 밀지 않고도 방향을 바꿀 수 있을까? 휠이 클수록 효과가 클까? 몇 초 만에 90° 돌 수 있을까?',
    why:'<b>우주 위성의 방향 제어</b>는 바퀴를 돌려 몸체를 돌리는 방식(반작용 휠, 모멘텀 휠)을 씁니다. 각운동량 보존의 직접적 공학 응용입니다. 안전한 낮은 rpm(600 rpm 이하)에서 재현합니다.',
    link:'원리④ 각운동량(5번 탭) · C03 각운동량 마술.',
    cap:'가벼운 본체(회전 의자 대신 실로 매단 판)에 휠이 달린 모터가 있고 휠을 시계 방향으로 돌리면 본체가 반시계로 돈다(가운데). 모터 · 휠 · 본체 · 매단 실 · 영상 · 기록표',
    parts:[['본체','I_b ≈ 4×10⁻³ kg·m²','판지 판 + 배터리','실로 매달아 마찰 없이 돌게.'],
           ['휠','m = 100 g, R = 2 ~ 6 cm','두꺼운 원판','질량 분포가 균일하게.'],
           ['소형 모터','5 V, 600 rpm 이하','소형 DC 모터','속도 제어는 단계 전압으로.'],
           ['전원','5 V 배터리','5 V 배터리 팩','안전 5 V.'],
           ['스마트폰 영상','본체 각속도','위에서 촬영','본체가 도는 각도 대 시간.'],
           ['기록표','R · rpm · ω_b','스프레드시트','ω_b 대 ω_w 직선.']],
    budget:[['소형 DC 모터(5 V)','1','약 4 천 원','—'],['두꺼운 원판 · 판지','1','약 3 천 원','—'],['5 V 배터리 팩','1','약 5 천 원','—'],['실 · 틀','1','약 2 천 원','—'],['스마트폰','1','보유','—']],
    steps:['본체를 가는 실로 수평하게 매달아 마찰을 최소화한다(안전 5 V, 낮은 rpm).','휠 반지름 R = 2, 4, 6 cm 로 교체해 같은 휠 회전수(300 rpm)에서 본체의 각속도를 영상으로 잰다.','휠 회전수를 100 ~ 600 rpm 으로 바꿔 ω_b 를 잰다.','ω_b 대 ω_w 가 원점을 지나는 직선, 기울기 $I_w/I_b$ 를 이론과 비교한다.','90° 돌리는 데 걸린 시간을 보고하고 정지시키는 방법(휠 감속)을 설명한다.'],
    vars:['휠 반지름 R · 휠 회전수 rpm','본체 각속도 ω_b','실의 비틀림 · 마찰 · 배터리 무게'],
    predict:[['R = 4 cm · 300 rpm','ω_b = '+fx(a.deg,1)+' °/s · 90°에 '+fx(a.T90,1)+' s','$\\omega_b=I_w\\omega_w/I_b$'],
             ['R = 2 cm · 300 rpm','ω_b = '+fx(b.deg,1)+' °/s','$R^2$ 에 비례해 작다'],
             ['R = 6 cm · 300 rpm','ω_b = '+fx(c.deg,1)+' °/s','큰 휠이 효과적'],
             ['R = 4 cm · 600 rpm','ω_b = '+fx(d.deg,1)+' °/s','rpm 2 배 → 속도 2 배']],
    data:{cols:['휠 rpm','ω_b 측정 (rad/s)','이론 (rad/s)','차이 (%)'], rows:i05(4,300,1).rows.map(function(q){ return [fx(q.r,0),fx(q.w,3),fx(q.ideal,3),fx((q.w/q.ideal-1)*100,0)]; })},
    analysis:'ω_b 대 ω_w 의 직선 기울기를 $I_w/I_b$ 와 비교한다. 실의 비틀림 복원력과 공기 저항이 오차의 큰 원인이므로 처음 1 초 동안의 평균을 쓴다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 반작용 휠'],['출력','본체 각속도 °/s'],['구동','5 V 모터'],['제어','휠 회전수 단계'],['안전','5 V · 600 rpm 이하 · 부품 단단히 고정']]],
    fails:[['본체가 거의 안 돈다','휠을 키우거나 본체를 가볍게(I_b 감소)'],['실이 꼬여 돌아온다','매다는 실 대신 회전 베어링을 쓰거나 긴 실을 쓴다'],['휠이 흔들린다','휠 중심을 정확히 맞추고 균형을 잡는다']],
    up:['<b>I06</b> — 자이로 안정화.','<b>C03</b> — 각운동량 마술.','<b>종합2(16번 탭)</b> — 각운동량 보존.'],
    next:['원리④ 각운동량',5],
    eval:[['창의성','구조'],['정확성','ω_b 일치'],['반복성','재현성'],['안전','5 V · 저속']]  ,
    tip:'「휠이 도는 만큼 본체가 반대로 돈다」를 영상 한 컷으로 증명하세요.' });
})();
SIMS.I05={ q:'휠의 크기와 회전수를 바꾸면 본체는 얼마나 빠르게 반대로 돌까?',
  a:{nm:'휠 반지름 R',min:2,max:6,step:0.5,val:4,unit:'cm',d:1}, b:{nm:'휠 회전수',min:100,max:600,step:50,val:300,unit:'rpm',d:0},
  cap1:'위에서 본 모습. 휠이 시계 방향으로 돌면 각운동량 보존으로 본체는 반시계 방향으로 돕니다.',
  cap2:'📊 휠 회전수에 따른 본체 각속도 ω_b — 이론(선)과 측정(점).',
  note:'모형 : 휠 100 g · 본체 I_b = 4×10⁻³ kg·m² · 마찰 무시 · 처음 정지 · 측정 잡음 5 %.',
  anim:function(ctx,w,h,t,R,rpm,S){ var o=i05(R,rpm,S.seed), cx=w*0.3, cy=h*0.52, rb=Math.min(h*0.34,w*0.2), tc=t%6, bang=o.wb*tc, wang=-rpm*TAU/60*tc*0.3;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(-bang); ctx.fillStyle='rgba(148,163,184,.25)'; ctx.strokeStyle=COL.tick; ctx.fillRect(-rb,-rb*0.6,rb*2,rb*1.2); ctx.strokeRect(-rb,-rb*0.6,rb*2,rb*1.2); cvLine(ctx,[[0,0],[rb,0]],COL.amber,3); ctx.restore();
    drawWheel(ctx,cx,cy,R*rb/8,wang,0.5); cvText(ctx,'본체 '+(bang*180/PI).toFixed(0)+'° · ω_b = '+o.wb.toFixed(2)+' rad/s',12,16,COL.text,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.56,h*0.28,w*0.4,h*0.48,[['L 휠',o.Lw*1000,COL.blue],['L 본체',o.Ib*o.wb*1000,COL.ok],['ω_b ×10',o.wb*10,COL.amber]],Math.max(o.Lw*1000,o.wb*10)*1.1,''); },
  graph:function(ctx,w,h,R,rpm,S){ var o=i05(R,rpm,S.seed), cur=[[100,i05(R,100,S.seed).wb],[600,i05(R,600,S.seed).wb]];
    lineGraph(ctx,w,h,{xmin:50,xmax:650,ymin:0,ymax:Math.max(0.5,i05(6,600,S.seed).wb*1.05),xl:'휠 회전수 (rpm)',yl:'본체 각속도 ω_b (rad/s)',title:'휠 회전수와 본체 각속도 — 기울기 I_w/I_b',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.r,q.w*R*R/16]; }),now:[rpm,o.wb],legend:[['이론',COL.ok],['측정(R 환산)',COL.blue],['지금',COL.amber]],yd:2,lw:130}); },
  kv:function(R,rpm,S){ var o=i05(R,rpm,S.seed); return [['I_w',(o.Iw*1e4).toFixed(2)+' ×10⁻⁴ kg·m²','a'],['본체 ω_b',o.wb.toFixed(2)+' rad/s ('+o.deg.toFixed(0)+' °/s)','g'],['90° 돌리는 시간',o.T90.toFixed(1)+' s','v2'],['L(휠)',(o.Lw*1000).toFixed(2)+' ×10⁻³ kg·m²/s','r'],['판정',o.ok?'3 초 이내':'느리다']]; } };
