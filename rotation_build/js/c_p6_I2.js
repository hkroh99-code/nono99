/* ═══════════════════════════════════════════════════════════════════════════
   발명 프로젝트 I06 ~ I10 : 자이로 세차 · 안전 제동기 · 기어드 모터 선택 · 플라이휠 저장 · 휠 균형
   (손으로 돌리는 낮은 속력 · 작은 질량 · 5 V 이하. 모든 모형은 교육용 어림)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I06 : 자이로 세차 — Ω = m g d /(I ω) ─────────────────────── */
function i06(rpm,d,seed){ var rn=rng32(seed*7+9), m=0.8, I=0.05, w=rpm*TAU/60, Om=m*G*(d/100)/(I*w), rows=[], i;
  for(i=0;i<6;i++){ var rr=60+40*i, w2=rr*TAU/60, O2=m*G*(d/100)/(I*w2); rows.push({r:rr,O:O2*(1+0.06*gaussR(rn)),ideal:O2}); }
  return {Om:Om,Tp:TAU/Om,I:I,L:I*w,tau:m*G*d/100,rows:rows,ok:Om<2.5}; }
(function(){ var a=i06(200,20,1), b=i06(100,20,1), c=i06(300,20,1), d=i06(200,10,1);
  mkP({ id:'I06', t:'자이로 세차 발명 — 도는 바퀴가 쓰러지지 않는 이유', icon:'🌀', type:'발명 · 시제품', lv:3, dur:'3 주', cost:'약 2 만 원',
    one:'자전거 바퀴(또는 큰 원판) 축 한쪽 끝에 줄을 매달아 바퀴를 천천히 돌리면(300 rpm 이하) 아래로 쓰러지지 않고 수평으로 세차(precession) 운동을 하는 것을 이용해, 세차 각속도 $\\Omega=mgd/(I\\omega)$ 를 측정하고 예측과 비교한다.',
    q:'돌고 있는 바퀴는 왜 쓰러지지 않고 옆으로 돌까? 더 빨리 돌리면 세차는 느려질까? 받침점에서의 거리가 멀면?',
    why:'<b>자이로 스코프 · 팽이 · 자전거가 쓰러지지 않는 이유</b>의 핵심입니다. 벡터 곱 $\\tau=dL/dt$ 로 설명되는 이 운동을 눈으로 보는 것이 가장 큰 재미입니다.',
    link:'원리④ 각운동량(5번 탭) · C02 팽이.',
    cap:'바퀴를 천천히 손으로 돌리고 축 한쪽을 줄로 매달면(왼쪽) 바퀴는 수평으로 천천히 돈다(가운데). 바퀴 · 축 · 줄 · 영상 · 각도기 · 기록표',
    parts:[['바퀴','m ≈ 0.8 kg, R ≈ 25 cm','자전거 바퀴','테두리에 무게가 몰려 있어야 효과적이다.'],
           ['축','가로 막대','두꺼운 막대 · 볼트','바퀴가 자유롭게 돌게 베어링.'],
           ['매다는 줄','길이 1 m','튼튼한 줄','높은 곳에 안전하게 고정, 아래에 사람 금지.'],
           ['보조자','안전','2 명','바퀴가 떨어지지 않게 지탱한다.'],
           ['스마트폰 영상','세차 주기','위에서 촬영','한 바퀴 도는 시간 측정.'],
           ['기록표','rpm · d · Ω','스프레드시트','Ω 대 1/ω 그래프.']],
    budget:[['자전거 바퀴(재활용)','1','약 5 천 원','—'],['막대 · 볼트','1 세트','약 5 천 원','—'],['튼튼한 줄','1','약 3 천 원','—'],['스마트폰','1','보유','—'],['장갑','1','—','—']],
    steps:['바퀴 축 한쪽에 매달 줄을 고정하고, 다른 쪽은 보조자가 받치도록 한다.','바퀴를 손으로 100 ~ 300 rpm 정도로(낮은 속도) 돌린 뒤 한쪽을 놓아 세차시킨다.','위에서 촬영한 영상에서 세차 한 바퀴 시간 T_p 를 잰다.','회전수와 받침점 거리 d 를 바꿔 Ω 를 잰다.','Ω 대 1/ω 가 직선인지 확인하고 기울기를 $mgd/I$ 와 비교한다.'],
    vars:['스핀 회전수 rpm · 받침점 거리 d','세차 각속도 Ω','바퀴 질량 분포 · 마찰'],
    predict:[['200 rpm · d = 20 cm','Ω = '+fx(a.Om,2)+' rad/s · 한 바퀴 '+fx(a.Tp,1)+' s','$\\Omega=mgd/(I\\omega)$'],
             ['100 rpm · d = 20 cm','Ω = '+fx(b.Om,2)+' rad/s','스핀이 느리면 세차가 빠르다'],
             ['300 rpm · d = 20 cm','Ω = '+fx(c.Om,2)+' rad/s','스핀이 빠르면 세차가 느리다'],
             ['200 rpm · d = 10 cm','Ω = '+fx(d.Om,2)+' rad/s','d 절반 → Ω 절반']],
    data:{cols:['스핀 rpm','Ω 측정 (rad/s)','이론 (rad/s)','차이 (%)'], rows:i06(200,20,1).rows.map(function(q){ return [fx(q.r,0),fx(q.O,2),fx(q.ideal,2),fx((q.O/q.ideal-1)*100,0)]; })},
    analysis:'Ω 대 1/ω 의 직선 기울기를 $mgd/I$ 와 비교한다. 스핀이 느려지면 세차가 빨라지고 결국 쓰러지는 현상(안정 한계)도 관찰한다. 진짜 세차(안정)와 흔들림(장동, nutation)을 구분해 본다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 자이로 세차 모형'],['핵심 원리','각운동량 · 토크'],['스핀 범위','100 ~ 300 rpm(낮은 속도)'],['측정','세차 주기'],['안전','고속 금지 · 보조자 필수 · 바퀴 낙하 주의']]],
    fails:[['바퀴가 그냥 처진다','스핀 속도가 부족 — 안전 한도 내에서 조금 올린다'],['세차가 불규칙하다','바퀴의 균형을 확인하고 매다는 줄의 마찰을 줄인다'],['쉽게 흔들린다','장동(nutation)이므로 처음 놓을 때 부드럽게 놓는다']],
    up:['<b>I05</b> — 반작용 휠.','<b>C02</b> — 팽이 디자인.','<b>종합2(16번 탭)</b> — 각운동량.'],
    next:['원리④ 각운동량',5],
    eval:[['창의성','구성'],['정확성','Ω 일치'],['반복성','재현성'],['안전','저속 · 보조자']],
    tip:'안전이 최우선 — 속도는 낮게, 보조자는 반드시. 영상 한 컷이 가장 설득력이 있습니다.' });
})();
SIMS.I06={ q:'스핀 속도와 받침점 거리를 바꾸면 세차 속도는 어떻게 달라질까?',
  a:{nm:'스핀 회전수',min:60,max:300,step:20,val:200,unit:'rpm',d:0}, b:{nm:'받침점 거리 d',min:5,max:30,step:1,val:20,unit:'cm',d:0},
  cap1:'위에서 본 모습. 바퀴가 돌며 한쪽 끝을 줄이 받치면 바퀴 축이 수평으로 천천히 돕니다(세차).',
  cap2:'📊 스핀 회전수에 따른 세차 각속도 Ω — 이론(선)과 측정(점).',
  note:'모형 : 바퀴 m = 0.8 kg · I = 0.05 kg·m² · 이상적 규칙 세차(장동 무시) · 측정 잡음 6 %.',
  anim:function(ctx,w,h,t,rpm,d,S){ var o=i06(rpm,d,S.seed), cx=w*0.3, cy=h*0.52, L=Math.min(h*0.34,w*0.2), pa=o.Om*t, sx=cx+L*Math.cos(pa), sy=cy+L*Math.sin(pa);
    cvCirc(ctx,cx,cy,6,COL.amber,COL.white,1.2); cvLine(ctx,[[cx,cy],[sx,sy]],COL.tick,5); var wang=-rpm*TAU/60*t*0.1; drawWheel(ctx,sx,sy,22,wang,1);
    arcArrow(ctx,cx,cy,L+22,pa-0.6,pa-0.1,COL.ok,2.4); cvText(ctx,'세차 Ω = '+o.Om.toFixed(2)+' rad/s · 한 바퀴 '+o.Tp.toFixed(1)+' s '+(o.ok?'':'⚠ 빠름'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.56,h*0.28,w*0.4,h*0.48,[['L = Iω',o.L,COL.blue],['토크 mgd',o.tau,COL.grav],['Ω ×5',o.Om*5,COL.ok]],Math.max(o.L,o.tau,o.Om*5)*1.1,''); },
  graph:function(ctx,w,h,rpm,d,S){ var o=i06(rpm,d,S.seed), cur=[],k; for(k=60;k<=300;k+=10) cur.push([k,i06(k,d,S.seed).Om]);
    lineGraph(ctx,w,h,{xmin:40,xmax:320,ymin:0,ymax:Math.max(1,cur[0][1]*1.1),xl:'스핀 회전수 (rpm)',yl:'세차 각속도 Ω (rad/s)',title:'스핀과 세차 — Ω ∝ 1/ω',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.r,q.O]; }),now:[rpm,o.Om],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:2,lw:90}); },
  kv:function(rpm,d,S){ var o=i06(rpm,d,S.seed); return [['L = Iω',o.L.toFixed(2)+' kg·m²/s','a'],['토크 mgd',o.tau.toFixed(2)+' N·m','g'],['세차 Ω',o.Om.toFixed(2)+' rad/s','v2'],['세차 한 바퀴',o.Tp.toFixed(1)+' s','r'],['판정',o.ok?'안정':'빨라서 불안정']]; } };

/* ── I07 : 안전 제동기 — t = Iω₀/(μ N r_b) ─────────────────────── */
function i07(rpm,N,seed){ var rn=rng32(seed*13+1), I=0.01, rb=0.05, mu=0.5, w0=rpm*TAU/60, tb=mu*N*rb, t=I*w0/tb, turns=w0*t/2/TAU, rows=[], i;
  for(i=0;i<6;i++){ var rr=30+24*i, ww=rr*TAU/60, tt=I*ww/tb; rows.push({r:rr,t:tt*(1+0.07*gaussR(rn)),ideal:tt}); }
  return {t:t,turns:turns,tb:tb,K:0.5*I*w0*w0,Q:0.5*I*w0*w0,ok:t<=1.5,rows:rows,w0:w0}; }
(function(){ var a=i07(100,5,1), b=i07(100,10,1), c=i07(150,5,1), d=i07(60,2,1);
  mkP({ id:'I07', t:'안전 제동기 발명 — 회전하는 바퀴를 안전하게 멈추기', icon:'🛑', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 1 만 5 천 원',
    one:'손으로 돌린 바퀴(약 100 rpm)의 가장자리에 고무 브레이크 패드를 눌러 멈추게 하는 장치를 만들고, 제동 토크 $\\tau_b=\\mu N r_b$ 와 정지 시간 $t=I\\omega_0/\\tau_b$ 를 측정해 짧은 시간에 안전하게 멈추는 설계를 겨룬다.',
    q:'브레이크를 두 배로 세게 누르면 정지 시간은 절반일까? 회전수가 높으면? 멈추는 데 필요한 열은 어디서 나올까?',
    why:'<b>자동차 · 자전거 · 놀이기구 제동</b>은 회전 운동 에너지를 열로 바꾸는 장치입니다. $K=\\tfrac12I\\omega^2$ 가 마찰열 $Q$ 로 바뀌는 과정을 숫자로 확인합니다.',
    link:'원리③ 관성 모멘트와 τ=Iα(4번 탭) · 원리⑤ 회전 에너지(6번 탭).',
    cap:'바퀴(I = 0.01 kg·m²)를 100 rpm 으로 돌리고 가장자리에 고무 패드를 힘 N 으로 눌러 정지 시간을 잰다(가운데). 바퀴 · 패드 · 용수철 저울 · 영상 · 기록표',
    parts:[['바퀴','I ≈ 0.01 kg·m²','자전거 바퀴 · 나무 원판','질량과 반지름을 잰다.'],
           ['브레이크 패드','고무 · 가죽','자전거 브레이크 패드','접촉면이 넓고 마모가 적게.'],
           ['누르는 장치','레버 + 용수철 저울','저울이 달린 레버','N 을 알 수 있게.'],
           ['보호 덮개','안전','투명 덮개','손가락이 끼지 않게.'],
           ['영상 측정','정지 시간','슬로 모션','처음 속도를 영상으로 정확히.'],
           ['기록표','rpm · N · t','스프레드시트','t 대 1/N 그래프.']],
    budget:[['바퀴(재활용)','1','약 5 천 원','—'],['브레이크 패드','1 세트','약 3 천 원','—'],['레버 · 틀','1 세트','약 5 천 원','—'],['용수철 저울','1','학교 보유','—'],['덮개','1','약 2 천 원','—']],
    steps:['바퀴를 손으로 서서히 100 rpm 으로 돌린 뒤 놓는다(낮은 속도, 덮개 사용).','패드를 N = 2, 5, 10 N 으로 눌러 바퀴가 멈출 때까지의 시간 t 를 영상으로 잰다.','처음 속도를 60, 100, 150 rpm 으로 바꿔 t 를 잰다.','t 대 1/N 이 직선인지 확인하고 기울기 $I\\omega_0/(\\mu r_b)$ 를 구한다.','정지 중 열(마찰열) $Q=\\tfrac12I\\omega_0^2$ 를 계산해 패드 온도 상승을 어림한다.'],
    vars:['처음 회전수 rpm · 누르는 힘 N','정지 시간 t','패드 재질 · 마모 · 온도'],
    predict:[['100 rpm · N = 5 N','t = '+fx(a.t,2)+' s · '+fx(a.turns,1)+' 바퀴','$t=I\\omega_0/(\\mu N r_b)$'],
             ['100 rpm · N = 10 N','t = '+fx(b.t,2)+' s','힘 2 배 → 시간 절반'],
             ['150 rpm · N = 5 N','t = '+fx(c.t,2)+' s','속도 1.5 배 → 시간 1.5 배'],
             ['60 rpm · N = 2 N','t = '+fx(d.t,2)+' s','약한 제동 — 느리다']],
    data:{cols:['처음 rpm','t 측정 (s)','이론 (s)','차이 (%)'], rows:i07(100,5,1).rows.map(function(q){ return [fx(q.r,0),fx(q.t,2),fx(q.ideal,2),fx((q.t/q.ideal-1)*100,0)]; })},
    analysis:'t 대 ω₀ 가 원점을 지나는 직선(일정 마찰 토크)임을 확인한다. 패드 마찰 계수 μ 를 기울기에서 역산해 문헌값과 비교한다. 정지 중 열이 모두 패드로 간다고 가정해 온도 상승을 어림한다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 안전 제동기'],['처음 속도','≤ 150 rpm'],['정지 시간 목표','1.5 s 이하'],['재료','고무 패드'],['안전','덮개 · 손 끼임 방지 · 저속']]],
    fails:[['정지 시간이 너무 길다','N 을 높이거나 패드 접촉 면적을 키운다'],['바퀴가 갑자기 멈추며 흔들린다','제동 토크를 부드럽게 올린다'],['패드가 뜨겁다','연속 시험 사이에 식힌다']],
    up:['<b>C06</b> — 자전거 기어.','<b>I09</b> — 플라이휠 저장.','<b>종합3(17번 탭)</b> — 회전 에너지.'],
    next:['원리⑤ 회전 에너지',6],
    eval:[['창의성','구성'],['정확성','t 일치'],['반복성','재현성'],['안전','덮개 · 저속']],
    tip:'정지 시간 t 와 마찰열 Q 를 함께 보고하면 에너지 변환을 정확히 설명할 수 있습니다.' });
})();
SIMS.I07={ q:'처음 회전수와 누르는 힘을 바꾸면 바퀴가 멈추는 데 걸리는 시간은 얼마나 달라질까?',
  a:{nm:'처음 회전수',min:30,max:150,step:10,val:100,unit:'rpm',d:0}, b:{nm:'누르는 힘 N',min:1,max:15,step:0.5,val:5,unit:'N',d:1},
  cap1:'바퀴가 일정한 마찰 토크로 줄어들어 멈춥니다. 오른쪽 막대는 초기 운동 에너지 대 마찰열.',
  cap2:'📊 처음 회전수 대 정지 시간 — 이론(직선)과 측정(점).',
  note:'모형 : 바퀴 I = 0.01 kg·m² · 패드 반지름 5 cm · μ = 0.5 · 마찰 토크 일정 · 측정 잡음 7 %.',
  anim:function(ctx,w,h,t,rpm,N,S){ var o=i07(rpm,N,S.seed), cx=w*0.3, cy=h*0.52, R=Math.min(h*0.34,w*0.18), tc=t%(o.t+1.5), tt=Math.min(tc,o.t), om=o.w0*(1-tt/o.t), th=o.w0*(tt-tt*tt/(2*o.t))*0.2;
    drawWheel(ctx,cx,cy,R,th,1); cvRect(ctx,cx+R-4,cy-10,14+N,20,COL.grav,COL.white,1.2); cvArrow(ctx,cx+R+40+N,cy,cx+R+10+N,cy,COL.grav,2.6); cvText(ctx,'N = '+N.toFixed(1)+' N',cx+R+20,cy-18,COL.tick,'11px system-ui,sans-serif');
    cvText(ctx,'t = '+tt.toFixed(2)+' / '+o.t.toFixed(2)+' s · ω = '+Math.max(0,om).toFixed(1)+' rad/s '+(o.ok?'':'⚠ 정지 시간 김'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.56,h*0.28,w*0.4,h*0.48,[['K₀ (J)',o.K,COL.blue],['마찰열 Q',o.Q*(tt/o.t>0.999?1:(1-(1-tt/o.t)*(1-tt/o.t))),COL.grav],['제동 토크 ×10',o.tb*10,COL.amber]],Math.max(o.K,o.tb*10)*1.1,''); },
  graph:function(ctx,w,h,rpm,N,S){ var o=i07(rpm,N,S.seed), cur=[[30,i07(30,N,S.seed).t],[150,i07(150,N,S.seed).t]];
    lineGraph(ctx,w,h,{xmin:0,xmax:160,ymin:0,ymax:Math.max(1,i07(150,N,S.seed).t*1.2),xl:'처음 회전수 (rpm)',yl:'정지 시간 t (s)',title:'정지 시간 t ∝ ω₀ (일정 제동 토크)',curves:[{pts:[[0,0],cur[1]],col:COL.ok,lw:2.2},{pts:[[0,1.5],[160,1.5]],col:COL.grav,lw:1.2,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.r,q.t]; }),now:[rpm,o.t],legend:[['이론',COL.ok],['목표 1.5 s',COL.grav],['측정',COL.blue],['지금',COL.amber]],yd:2,lw:110}); },
  kv:function(rpm,N,S){ var o=i07(rpm,N,S.seed); return [['제동 토크',(o.tb*1000).toFixed(0)+' mN·m','a'],['정지 시간',o.t.toFixed(2)+' s','g'],['돈 바퀴 수',o.turns.toFixed(1)+' 바퀴','v2'],['처음 K',o.K.toFixed(2)+' J','r'],['판정',o.ok?'안전 범위':'너무 느림']]; } };

/* ── I08 : 기어드 모터 선택 — τ_m = τ_L/(Gη) , ω_out = ω_m/G ───── */
function i08(tL,G_,seed){ var rn=rng32(seed*9+4), w0=600, ts=0.02, eta=0.7, tm=tL/(G_*eta), stall=tm>=ts, wm=stall?0:w0*(1-tm/ts), wo=wm/G_, P=tL*wo, rows=[], i;
  for(i=0;i<6;i++){ var g=10+16*i, tm2=tL/(g*eta), s2=tm2>=ts, wm2=s2?0:w0*(1-tm2/ts), wo2=wm2/g; rows.push({g:g,w:wo2*(1+0.05*gaussR(rn)),ideal:wo2}); }
  return {tm:tm,wm:wm,wo:wo,P:P,stall:stall,Gbest:2*tL/(eta*ts),rpm:wo*60/TAU,rows:rows}; }
(function(){ var a=i08(0.2,30,1), b=i08(0.2,10,1), c=i08(0.2,60,1), d=i08(0.05,30,1);
  mkP({ id:'I08', t:'기어드 모터 선택기 발명 — 부하에 맞는 기어비 찾기', icon:'⚙️', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 2 만 원',
    one:'5 V 소형 DC 모터(정지 토크 20 mN·m, 무부하 600 rad/s)에 기어비 G 를 붙여 출력 토크 $\\tau_L=G\\eta\\tau_m$ 와 출력 속도 $\\omega_{out}=\\omega_m/G$ 를 측정하고, 부하에 맞는 최적의 기어비를 고르는 선택기를 설계한다.',
    q:'기어비가 크면 힘이 세지는 대신 얼마나 느려질까? 최대 출력을 내는 기어비는? 너무 큰 기어비는 왜 오히려 손해일까?',
    why:'<b>로봇 · 전동 드릴 · 전기 자전거</b> 모두 모터와 기어의 조합입니다. 기어비 선택이 일률 $P=\\tau\\omega$ 를 정하는 모터 설계의 핵심 감각을 익힙니다.',
    link:'원리⑤ 회전 에너지·일률(6번 탭) · C06 자전거 기어.',
    cap:'5 V 모터에 기어박스(기어비 G)를 붙여 도르래로 추를 올리고(가운데) 올리는 속도와 전류를 잰다(오른쪽). 모터 · 기어박스 · 도르래 · 추 · 전류계 · 기록표',
    parts:[['DC 모터','5 V','소형 DC 모터','정지 토크 약 20 mN·m.'],
           ['기어박스','G = 5 ~ 100','기어박스 키트','기어비를 바꿀 수 있게.'],
           ['도르래','반지름 1 cm','나무 도르래','줄로 추를 올린다.'],
           ['추','50 ~ 500 g','동전 · 병','부하 토크 τ_L = mgr.'],
           ['전류계 · 타이머','입력 전력','5 V 전류계','전력을 입력과 출력으로 비교한다.'],
           ['기록표','G · v · P','스프레드시트','P 대 G 그래프.']],
    budget:[['DC 모터 · 기어박스','1 세트','약 8 천 원','—'],['도르래 · 줄','1','약 2 천 원','—'],['5 V 전원','1','약 3 천 원','—'],['전류계','1','학교 보유','—'],['추','1 세트','약 1 천 원','—']],
    steps:['부하 τ_L = 0.2 N·m(약 2 kg · 1 cm)로 맞춘다.','기어비 G = 10, 30, 60 로 바꿔 추를 올리는 속도로 출력 ω_out 을 구한다.','출력 일률 $P=\\tau_L\\omega_{out}$ 대 G 그래프에서 최대점 G* 를 찾는다.','이론값 $G^*=2\\tau_L/(\\eta\\tau_s)$ 와 비교한다.','부하를 바꿔 G* 가 어떻게 변하는지 보고한다.'],
    vars:['부하 토크 τ_L · 기어비 G','출력 속도 ω_out · 일률 P','기어 효율 η · 모터 전압'],
    predict:[['τ_L = 0.2 · G = 30','ω_out = '+fx(a.wo,1)+' rad/s · P = '+fx(a.P,2)+' W',(a.stall?'정지(스톨)':'작동')],
             ['τ_L = 0.2 · G = 10','ω_out = '+fx(b.wo,1)+' rad/s',(b.stall?'스톨 — 모터가 못 돈다':'작동')],
             ['τ_L = 0.2 · G = 60','ω_out = '+fx(c.wo,1)+' rad/s · P = '+fx(c.P,2)+' W','느리지만 안전'],
             ['τ_L = 0.05 · G = 30','ω_out = '+fx(d.wo,1)+' rad/s · P = '+fx(d.P,2)+' W','가벼운 부하']],
    data:{cols:['G','ω_out 측정 (rad/s)','이론 (rad/s)','차이 (%)'], rows:i08(0.2,30,1).rows.map(function(q){ return [fx(q.g,0),fx(q.w,1),fx(q.ideal,1),(q.ideal>0?fx((q.w/q.ideal-1)*100,0):'-')]; })},
    analysis:'ω_out 대 G 를 그려 스톨 경계와 최대 출력점을 찾는다. 모터의 토크–속도 직선 $\\omega=\\omega_0(1-\\tau/\\tau_s)$ 가 선형인지 확인한다. 기어 효율 η 는 입력 전력과 출력 일률의 비로 구한다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 기어 선택기'],['입력','부하 토크'],['출력','권장 기어비'],['전원','5 V'],['안전','손가락 끼임 주의 · 과열 시 휴식']]],
    fails:[['모터가 멈춘다','스톨 — 기어비를 높이거나 부하를 줄인다'],['소리가 크다','기어 정렬과 윤활을 점검한다'],['전류가 높다','부하를 줄이고 쉬는 시간을 둔다']],
    up:['<b>C06</b> — 자전거 기어.','<b>I07</b> — 안전 제동기.','<b>종합3(17번 탭)</b> — 일률.'],
    next:['원리⑤ 회전 에너지·일률',6],
    eval:[['창의성','선택 알고리즘'],['정확성','G* 일치'],['반복성','재현성'],['안전','과열 · 손 끼임']],
    tip:'일률 대 기어비 그래프에서 「정점」과 「스톨 경계」를 한 장에 보이세요.' });
})();
SIMS.I08={ q:'부하와 기어비를 바꾸면 출력 속도와 일률은 어떻게 달라질까?',
  a:{nm:'부하 토크 τ_L',min:0.05,max:0.5,step:0.05,val:0.2,unit:'N·m',d:2}, b:{nm:'기어비 G',min:5,max:100,step:5,val:30,unit:'',d:0},
  cap1:'모터는 토크가 커질수록 느려집니다(직선 관계). 기어비 G 가 너무 작으면 정지(스톨)하고, 너무 크면 느려집니다.',
  cap2:'📊 기어비 G 에 따른 출력 일률 P — 최대점이 최적 기어비 G*.',
  note:'모형 : 모터 정지 토크 20 mN·m · 무부하 600 rad/s · 선형 토크–속도 · 기어 효율 0.7 · 측정 잡음 5 %.',
  anim:function(ctx,w,h,t,tL,g,S){ var o=i08(tL,g,S.seed), cx=w*0.25, cy=h*0.5, R=Math.min(h*0.2,w*0.1), ang=o.wm*t*0.02, ang2=-ang/g*8;
    drawWheel(ctx,cx,cy,R*0.6,ang,0.5); drawWheel(ctx,cx+R*1.6,cy,R*1.3,ang2,1); var hh=((o.wo*0.05*t)%1)*(h*0.4); cvLine(ctx,[[cx+R*2.9,cy],[cx+R*2.9,cy+h*0.35-hh]],COL.dim,1.5); cvRect(ctx,cx+R*2.9-12,cy+h*0.35-hh,24,20,COL.grav,COL.white,1.2);
    cvText(ctx,'τ_m = '+(o.tm*1000).toFixed(1)+' mN·m · ω_out = '+o.wo.toFixed(1)+' rad/s ('+o.rpm.toFixed(0)+' rpm) '+(o.stall?'⚠ 스톨':''),12,16,o.stall?COL.amber:COL.ok,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.58,h*0.28,w*0.38,h*0.48,[['모터 토크',o.tm*1000,COL.blue],['스톨 한계',20,COL.dim],['출력 P ×100',o.P*100,COL.ok]],Math.max(20,o.P*100,o.tm*1000)*1.1,''); },
  graph:function(ctx,w,h,tL,g,S){ var o=i08(tL,g,S.seed), cur=[],k,mx=0; for(k=5;k<=100;k+=1){ var q=i08(tL,k,S.seed); cur.push([k,q.P]); mx=Math.max(mx,q.P); }
    lineGraph(ctx,w,h,{xmin:0,xmax:105,ymin:0,ymax:Math.max(0.1,mx*1.2),xl:'기어비 G',yl:'출력 일률 P (W)',title:'G 에 따른 일률 — 최대점 G*',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[o.Gbest,0],[o.Gbest,mx*1.2]],col:COL.grav,lw:1.2,dash:[4,3]}],now:[g,o.P],legend:[['일률',COL.ok],['G*',COL.grav],['지금',COL.amber]],yd:2,lw:90}); },
  kv:function(tL,g,S){ var o=i08(tL,g,S.seed); return [['모터 토크 τ_m',(o.tm*1000).toFixed(1)+' mN·m','a'],['출력 속도',o.wo.toFixed(1)+' rad/s','g'],['출력 일률',o.P.toFixed(2)+' W','v2'],['최적 기어비 G*',o.Gbest.toFixed(0),'r'],['판정',o.stall?'스톨':'작동']]; } };

/* ── I09 : 플라이휠 에너지 저장 — K = ½ I ω² ─────────────────── */
function i09(m,rpm,seed){ var rn=rng32(seed*5+6), R=0.1, I=0.5*(m/1000)*R*R, w=rpm*TAU/60, K=0.5*I*w*w, P=0.05, eta=0.5, tl=eta*K/P, rows=[], i;
  for(i=0;i<6;i++){ var rr=60+48*i, ww=rr*TAU/60, KK=0.5*I*ww*ww, tt=eta*KK/P; rows.push({r:rr,t:tt*(1+0.08*gaussR(rn)),ideal:tt}); }
  return {I:I,K:K,tl:tl,P:P,rows:rows,ok:tl>=10,v:w*R}; }
(function(){ var a=i09(500,300,1), b=i09(500,150,1), c=i09(200,300,1), d=i09(1000,300,1);
  mkP({ id:'I09', t:'플라이휠 에너지 저장 발명 — 돌려서 모은 에너지로 LED 켜기', icon:'🔋', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 1 만 5 천 원',
    one:'원판(반지름 10 cm, 질량 m)을 손으로 천천히 돌려 모은 회전 운동 에너지 $K=\\tfrac12I\\omega^2$ 를 작은 발전기(소형 모터)로 전기로 바꿔 0.05 W LED 를 몇 초 켤 수 있는지 예측하고 측정한다.',
    q:'질량이 두 배가 되면 오래 켜져 있을까? 속도를 두 배로 하면? 에너지를 가장 많이 모으는 방법은?',
    why:'<b>플라이휠 에너지 저장</b>은 전력 안정화와 하이브리드 자동차에 쓰입니다. $K\\propto\\omega^2$ 이므로 속도가 질량보다 더 효과적이라는 점을 몸으로 느끼게 해 줍니다. 안전을 위해 300 rpm 이하만 다룹니다.',
    link:'원리⑤ 회전 에너지(6번 탭) · 도구함 에너지 코드(14번 탭).',
    cap:'원판을 손으로 300 rpm 까지 서서히 돌려 모터 발전기를 연결해 LED 를 켠다(가운데). 시간 대 LED 밝기를 관찰(오른쪽). 원판 · 발전기 모터 · LED · 스톱워치 · 전압계 · 기록표',
    parts:[['플라이휠','R = 10 cm, m = 200 ~ 1000 g','나무 원판 · 금속 원판','질량 분포가 균일하게, 가장자리가 더 효율적.'],
           ['축 · 베어링','마찰 작게','자전거 허브','부드럽게 돌게.'],
           ['소형 모터(발전기)','5 V','DC 모터','돌리면 전압이 생긴다.'],
           ['LED','0.05 W','저항 포함 LED','5 V 이하.'],
           ['전압계 · 스톱워치','측정','전압계','LED 가 켜지는 시간.'],
           ['기록표','m · rpm · t','스프레드시트','t 대 rpm² 그래프.']],
    budget:[['원판 · 허브','1 세트','약 6 천 원','—'],['소형 모터','1','약 3 천 원','—'],['LED · 저항','1','약 1 천 원','—'],['전압계','1','학교 보유','—'],['보호 덮개','1','약 2 천 원','—']],
    steps:['원판을 손으로 100 ~ 300 rpm 까지 서서히 돌린다(덮개 사용, 낮은 속도).','손을 떼고 모터 발전기를 연결해 LED 가 켜지는 시간을 잰다(3 회).','질량(200, 500, 1000 g)과 속도를 바꿔 반복한다.','시간 대 rpm² 가 원점을 지나는 직선인지 확인한다.','효율 η = 얻은 전기 에너지 ÷ 저장 에너지를 구한다.'],
    vars:['원판 질량 m · 회전수 rpm','LED 켜진 시간 t','마찰 · 발전기 효율'],
    predict:[['500 g · 300 rpm','K = '+fx(a.K,2)+' J → LED '+fx(a.tl,0)+' s','$K=\\tfrac12I\\omega^2$'],
             ['500 g · 150 rpm','K = '+fx(b.K,2)+' J → LED '+fx(b.tl,0)+' s','속도 절반 → 에너지 1/4'],
             ['200 g · 300 rpm','K = '+fx(c.K,2)+' J → LED '+fx(c.tl,0)+' s','질량 비례'],
             ['1000 g · 300 rpm','K = '+fx(d.K,2)+' J → LED '+fx(d.tl,0)+' s','질량 2 배 → 시간 2 배']],
    data:{cols:['rpm','t 측정 (s)','이론 (s)','차이 (%)'], rows:i09(500,300,1).rows.map(function(q){ return [fx(q.r,0),fx(q.t,1),fx(q.ideal,1),fx((q.t/q.ideal-1)*100,0)]; })},
    analysis:'t 대 rpm² 이 원점을 지나는 직선임을 확인하고 기울기에서 효율 η 를 구한다. 유지 시간이 이론보다 짧은 이유(마찰, 발전기 손실)를 토의한다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 플라이휠 배터리'],['저장 에너지','약 1 J'],['방전 시간','LED 10 초 이상'],['재료','원판 + 모터'],['안전','300 rpm 이하 · 덮개 · 손 끼임 주의']]],
    fails:[['LED 가 거의 안 켜진다','발전기 모터의 극과 LED 방향을 확인한다'],['금방 멈춘다','축의 마찰을 줄이고 모터 연결을 유지한다'],['원판이 흔들린다','균형을 맞추고 속도를 낮춘다']],
    up:['<b>I07</b> — 안전 제동기.','<b>I10</b> — 휠 균형.','<b>종합3(17번 탭)</b> — 회전 에너지.'],
    next:['원리⑤ 회전 에너지',6],
    eval:[['창의성','구성'],['정확성','에너지 일치'],['반복성','재현성'],['안전','저속 · 덮개']],
    tip:'「속도 2 배 → 에너지 4 배」 그래프가 이 프로젝트의 핵심 한 장입니다.' });
})();
SIMS.I09={ q:'원판의 질량과 회전수를 바꾸면 LED 를 얼마나 오래 켤 수 있을까?',
  a:{nm:'원판 질량 m',min:200,max:1000,step:100,val:500,unit:'g',d:0}, b:{nm:'회전수',min:60,max:300,step:20,val:300,unit:'rpm',d:0},
  cap1:'원판이 돌며 모은 회전 에너지가 발전기를 거쳐 LED 에 쓰입니다. 에너지가 바닥나면 LED 가 꺼집니다.',
  cap2:'📊 회전수에 따른 LED 유지 시간 — K ∝ ω² 이므로 포물선 모양.',
  note:'모형 : 원판 R = 10 cm · I = ½mR² · LED 0.05 W · 총 변환 효율 0.5 · 마찰 무시 · 측정 잡음 8 %.',
  anim:function(ctx,w,h,t,m,rpm,S){ var o=i09(m,rpm,S.seed), cx=w*0.28, cy=h*0.52, R=Math.min(h*0.32,w*0.17), cyc=o.tl+2, tc=t%cyc, Ef=Math.max(0,1-tc/o.tl), th=tc*rpm*TAU/60*0.12*Ef;
    drawWheel(ctx,cx,cy,R,th,0.5); var led=Ef>0; cvCirc(ctx,w*0.72,h*0.3,14,led?'rgba(250,204,21,'+(0.4+0.6*Ef)+')':'rgba(100,116,139,.4)',COL.white,1.5); cvText(ctx,led?'LED 켜짐':'LED 꺼짐',w*0.72,h*0.3+30,COL.tick,'11.5px system-ui,sans-serif','center');
    cvText(ctx,'K₀ = '+o.K.toFixed(2)+' J · LED '+o.tl.toFixed(0)+' s · 남은 에너지 '+(Ef*100).toFixed(0)+' %',12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.5,h*0.5,w*0.46,h*0.35,[['I (×10⁻³)',o.I*1000,COL.blue],['K (J)',o.K*Ef,COL.ok],['LED 시간 (s)',o.tl*Ef,COL.amber]],Math.max(o.I*1000,o.K,o.tl)*1.1,''); },
  graph:function(ctx,w,h,m,rpm,S){ var o=i09(m,rpm,S.seed), cur=[],k; for(k=60;k<=300;k+=10) cur.push([k,i09(m,k,S.seed).tl]);
    lineGraph(ctx,w,h,{xmin:40,xmax:320,ymin:0,ymax:Math.max(10,cur[cur.length-1][1]*1.15),xl:'회전수 (rpm)',yl:'LED 유지 시간 (s)',title:'회전수와 유지 시간 — K ∝ ω²',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[40,10],[320,10]],col:COL.grav,lw:1.2,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.r,q.t*m/500]; }),now:[rpm,o.tl],legend:[['이론',COL.ok],['목표 10 s',COL.grav],['측정(m 환산)',COL.blue],['지금',COL.amber]],yd:0,lw:130}); },
  kv:function(m,rpm,S){ var o=i09(m,rpm,S.seed); return [['I',(o.I*1000).toFixed(2)+' ×10⁻³ kg·m²','a'],['저장 K',o.K.toFixed(2)+' J','g'],['LED 유지',o.tl.toFixed(0)+' s','v2'],['가장자리 속력',o.v.toFixed(2)+' m/s','r'],['판정',o.ok?'목표 10 s 달성':'부족']]; } };

/* ── I10 : 휠 균형 — F = m_u r_u ω² ─────────────────────────── */
function i10(mu,rpm,seed){ var rn=rng32(seed*3+8), ru=0.05, w=rpm*TAU/60, F=(mu/1000)*ru*w*w, Wt=0.3*G, rows=[], i;
  for(i=0;i<6;i++){ var rr=60+48*i, ww=rr*TAU/60, FF=(mu/1000)*ru*ww*ww; rows.push({r:rr,F:FF*(1+0.07*gaussR(rn)),ideal:FF}); }
  return {F:F,ratio:F/Wt,w:w,res:F*0.1,rows:rows,ok:F/Wt<0.5,Fbal:0}; }
(function(){ var a=i10(5,200,1), b=i10(5,100,1), c=i10(10,200,1), d=i10(2,300,1);
  mkP({ id:'I10', t:'휠 균형 맞추기 장치 발명 — 흔들리는 바퀴 잡기', icon:'🛞', type:'발명 · 시제품', lv:2, dur:'2 주', cost:'약 1 만 5 천 원',
    one:'원판(300 g) 가장자리 r_u = 5 cm 에 작은 불균형 질량 m_u 를 붙이고 원판을 300 rpm 이하로 돌릴 때 생기는 진동(원심력 $F=m_ur_u\\omega^2$)을 측정한 뒤, 반대편에 보정 질량을 붙여 진동을 없애는 균형 장치를 만든다.',
    q:'조금만 불균형해도 왜 심하게 떨릴까? 속도를 두 배로 하면 진동은 몇 배일까? 반대쪽에 얼마를 붙이면 균형일까?',
    why:'<b>자동차 바퀴 균형 맞추기, 세탁기 떨림, 드론 프로펠러 정렬</b>이 모두 동적 균형 문제입니다. 원심력이 $\\omega^2$ 에 비례해 커진다는 것을 눈과 손으로 느낄 수 있습니다.',
    link:'원리① 각운동학 $a_c=r\\omega^2$(2번 탭) · 원리⑤ 구르기와 안전(6번 탭).',
    cap:'원판 가장자리의 작은 질량(왼쪽)이 돌 때 만드는 원심력으로 틀이 떨린다(가운데). 반대편에 보정 질량을 붙여 진동이 줄어든 것을 영상과 앱 가속도 센서로 비교(오른쪽). 원판 · 질량 · 모터(5 V) · 스마트폰 가속도 앱 · 기록표',
    parts:[['원판','300 g, R = 10 cm','나무 원판','축이 중심에 오게.'],
           ['불균형 질량','m_u = 2 ~ 10 g','동전 · 클립','r_u = 5 cm 에 붙인다.'],
           ['보정 질량','같은 질량','동전','반대편(180°)에 붙인다.'],
           ['구동 모터','5 V, 300 rpm 이하','소형 DC 모터','낮은 속도, 덮개 사용.'],
           ['진동 측정','가속도 앱','스마트폰을 틀에 붙임','진폭을 기록한다.'],
           ['기록표','m_u · rpm · 진폭','스프레드시트','진폭 대 rpm² 그래프.']],
    budget:[['나무 원판 · 축','1 세트','약 5 천 원','—'],['5 V 모터','1','약 4 천 원','—'],['동전 · 클립','1 세트','약 1 천 원','—'],['스마트폰','1','보유','—'],['덮개 · 클램프','1','약 4 천 원','—']],
    steps:['안전 확인(덮개, 낮은 속도). 균형 질량 없는 원판을 100 ~ 300 rpm 으로 돌려 진동 진폭을 가속도 앱으로 기록한다.','m_u = 2, 5, 10 g 으로 바꿔 진폭을 기록한다.','진폭 대 $\\omega^2$ 가 직선인지, 진폭 대 m_u 가 직선인지 확인한다.','반대편에 보정 질량을 붙여 진동이 줄어드는 정도를 비교한다.','가장 작은 진동이 되는 보정 질량 위치와 크기를 보고한다.'],
    vars:['불균형 질량 m_u · 회전수 rpm','진동 진폭','보정 질량 · 위치 각도'],
    predict:[['m_u = 5 g · 200 rpm','F = '+fx(a.F,3)+' N · 원판 무게의 '+fx(a.ratio*100,0)+' %','$F=m_ur_u\\omega^2$'],
             ['m_u = 5 g · 100 rpm','F = '+fx(b.F,3)+' N','속도 절반 → 힘 1/4'],
             ['m_u = 10 g · 200 rpm','F = '+fx(c.F,3)+' N','질량 2 배 → 힘 2 배'],
             ['m_u = 2 g · 300 rpm','F = '+fx(d.F,3)+' N','가벼워도 빠르면 크다']],
    data:{cols:['rpm','F 측정 (N)','이론 (N)','차이 (%)'], rows:i10(5,200,1).rows.map(function(q){ return [fx(q.r,0),fx(q.F,3),fx(q.ideal,3),fx((q.F/q.ideal-1)*100,0)]; })},
    analysis:'진폭 대 ω² 가 원점을 지나는 직선(기울기 $m_ur_u$)임을 확인한다. 균형 보정 후 진폭이 몇 % 줄었는지 보고한다. 보정 질량의 각도 오차 δ 가 있을 때 남는 힘 $\\approx m_ur_u\\omega^2\\,\\delta$ 도 어림한다.',
    special:['🔧 시제품 사양서',[['제품명','○○ 휠 밸런서'],['속도 범위','≤ 300 rpm'],['목표','진동 90 % 감소'],['방법','반대편 보정'],['안전','덮개 · 낮은 속도 · 손 끼임 주의']]],
    fails:[['진동이 줄지 않는다','보정 위치가 정확한 반대(180°)인지 확인한다'],['원판이 심하게 흔들린다','먼저 속도를 낮추고 축을 점검한다'],['앱 값이 불안정하다','틀을 단단히 고정하고 평균을 쓴다']],
    up:['<b>I03</b> — 회전수 센서.','<b>I09</b> — 플라이휠 저장.','<b>C08</b> — 회전판 놀이기구.'],
    next:['원리① 각운동학',2],
    eval:[['창의성','구성'],['정확성','진동 감소율'],['반복성','재현성'],['안전','저속 · 덮개']],
    tip:'보정 전·후 진폭 그래프를 한 장에 겹쳐 그리면 효과가 한눈에 보입니다.' });
})();
SIMS.I10={ q:'불균형 질량과 회전수를 바꾸면 진동을 일으키는 힘은 얼마나 커질까?',
  a:{nm:'불균형 질량 m_u',min:1,max:12,step:1,val:5,unit:'g',d:0}, b:{nm:'회전수',min:50,max:300,step:25,val:200,unit:'rpm',d:0},
  cap1:'원판 가장자리의 작은 질량이 돌면 원심력이 축을 흔듭니다. 반대편에 같은 질량을 붙이면 힘이 서로 상쇄됩니다.',
  cap2:'📊 회전수에 따른 진동 힘 F — 포물선(F ∝ ω²). 보정하면 거의 0.',
  note:'모형 : 원판 300 g · r_u = 5 cm · 보정 질량이 정확히 반대면 F = 0 · 측정 잡음 7 %.',
  anim:function(ctx,w,h,t,mu,rpm,S){ var o=i10(mu,rpm,S.seed), cx=w*0.28, cy=h*0.52, R=Math.min(h*0.34,w*0.18), th=t*rpm*TAU/60*0.08, sh=Math.sin(th)*Math.min(10,o.F*20)*0.5;
    ctx.fillStyle='rgba(148,163,184,.28)'; ctx.beginPath(); ctx.arc(cx+sh,cy,R,0,TAU); ctx.fill(); var ux=cx+sh+R*0.8*Math.cos(th), uy=cy+R*0.8*Math.sin(th); cvCirc(ctx,ux,uy,5+mu*0.5,COL.grav,COL.white,1.2); cvArrow(ctx,ux,uy,ux+(ux-cx-sh)*0.4,uy+(uy-cy)*0.4,COL.amber,2.4);
    cvText(ctx,'F = m_u r_u ω² = '+o.F.toFixed(3)+' N · 원판 무게의 '+(o.ratio*100).toFixed(1)+' % '+(o.ok?'':'⚠ 진동 큼'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.56,h*0.28,w*0.4,h*0.48,[['보정 전 F',o.F,COL.grav],['보정 후 F',o.F*0.05,COL.ok],['원판 무게 ×0.1',0.3*G*0.1,COL.dim]],Math.max(o.F,0.3*G*0.1)*1.1,' N'); },
  graph:function(ctx,w,h,mu,rpm,S){ var o=i10(mu,rpm,S.seed), cur=[],k; for(k=50;k<=300;k+=10) cur.push([k,i10(mu,k,S.seed).F]);
    lineGraph(ctx,w,h,{xmin:30,xmax:320,ymin:0,ymax:Math.max(0.2,cur[cur.length-1][1]*1.15),xl:'회전수 (rpm)',yl:'진동 힘 F (N)',title:'회전수와 진동 힘 — F ∝ ω²',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.r,q.F*mu/5]; }),now:[rpm,o.F],legend:[['이론',COL.ok],['측정(m_u 환산)',COL.blue],['지금',COL.amber]],yd:3,lw:140}); },
  kv:function(mu,rpm,S){ var o=i10(mu,rpm,S.seed); return [['ω',o.w.toFixed(1)+' rad/s','a'],['진동 힘 F',o.F.toFixed(3)+' N','g'],['원판 무게 대비',(o.ratio*100).toFixed(1)+' %','v2'],['보정 후 잔여 F(5 %)',(o.F*0.05).toFixed(4)+' N','r'],['판정',o.ok?'진동 작음':'진동 큼']]; } };
