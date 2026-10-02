/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R06 ~ R10 : 호스 마찰 손실 · 분무기 최소 풍속 · 커피 필터 종단 속도 · 구멍과 배수 시간 · 층류–난류 전이
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R06 : 호스 길이와 마찰 손실 (베르누이 + 손실) ────────────────── */
function r06(L,H,seed){ var rn=rng32(seed*37+3), D=0.008, A=Math.PI*D*D/4, v=2, i, f;
  function solve(LL,HH){ var vv=2, ff=0.03, k; for(k=0;k<8;k++){ var Re=1000*vv*D/1.0e-3; ff=fric(Re); vv=Math.sqrt(2*G*HH/(1.5+ff*LL/D)); } return vv; }
  v=solve(L,H); var Re=1000*v*D/1e-3, rows=[]; f=fric(Re);
  for(i=0;i<6;i++){ var LL=0.5+1.9*i, vv=solve(LL,H); rows.push({L:LL,q:Math.max(0,vv*A*1e6*60/1000*(1+0.04*gaussR(rn))+0.1*gaussR(rn)),ideal:vv*A*1e6*60/1000}); }
  return {v:v,Re:Re,f:f,Q:v*A*60*1000,Qid:torr(H)*A*60*1000,loss:1-v/torr(H),rows:rows}; }
(function(){ var a=r06(2,1,1), b=r06(0.5,1,1), c=r06(8,1,1), d=r06(2,1.5,1);
  mkP({ id:'R06', t:'호스 길이와 마찰 손실 — 베르누이 식은 언제 틀리는가', icon:'🧵', type:'R&E · 정량 실험', lv:2, dur:'2 주', cost:'약 1 만 원',
    one:'같은 높이의 물통에서 길이가 다른 호스(0.5 ~ 10 m)로 물을 흘려 보내 1 분간 받은 물의 부피로 유량 Q 를 재고, 토리첼리 이상값 $A\\sqrt{2gH}$ 와 비교해 마찰 손실로 유량이 줄어드는 정도를 구한다.',
    q:'호스가 길어질수록 유량은 얼마나 줄어들까? 이상 유체 식과 실제의 차이는 어디서 올까?',
    why:'학교에서 배운 베르누이 식은 「마찰 없는」 경우입니다. <b>긴 호스에서는 식이 크게 틀립니다</b> — 얼마나 틀리는지를 직접 재면 식의 적용 한계를 과학적으로 말할 수 있습니다.',
    link:'원리⑤ 적용 한계 · 측정(6번 탭) · 원리② 베르누이(3번 탭) · 관 마찰 계수.',
    cap:'수위가 일정한 물통(왼쪽)에서 호스를 따라 물이 나가(가운데) 메스실린더가 받은 부피와 시간으로 유량을 잰다(오른쪽). 물통 · 호스 길이 · 출구 · 메스실린더 · 스톱워치 · 기록표',
    parts:[['물통 · 수위','H 일정','큰 물통 + 넘침 구멍','넘침 구멍으로 수위를 H 로 유지(물 회수)한다.'],
           ['호스(지름 8 mm)','길이 0.5 ~ 10 m','투명 호스 5 종류','같은 지름 · 같은 재질로 길이만 바꾼다. 꼬임이 없게 편다.'],
           ['출구 높이','바닥 H 아래','물통에서 수직 H','출구 높이를 맞춘다. 출구가 잠기지 않게.'],
           ['메스실린더','부피 V','1 L 눈금실린더','일정 시간(30 s) 동안 받은 부피를 읽는다.'],
           ['스톱워치','시간 t','스마트폰','유량 $Q=V/t$.'],
           ['기록표 · 그래프','L 대 Q','스프레드시트','Q 대 L 곡선 · 이상값 비교.']],
    budget:[['투명 호스(8 mm) 12 m','1','약 8 천 원','—'],['물통 · 받침','1','약 3 천 원','—'],['눈금실린더','1','약 3 천 원','계량컵'],['스톱워치','1','보유','스마트폰'],['넘침 처리 용기','1','약 2 천 원','—']],
    steps:['수위 H = 1 m 로 일정하게 하고 길이 0.5 m 호스를 연결해 30 초간 받은 물의 부피를 3 회 잰다.','같은 방법으로 길이 2.4 · 4.3 · 6.2 · 8.1 · 10 m 로 반복한다(호스를 곧게 편다).','$Q=V/t$ 로 유량(L/min)을 구해 L 대 Q 그래프를 그린다.','이상값 $Q_0=A\\sqrt{2gH}$ 와 비교해 $1-Q/Q_0$ 로 손실률을 구한다.','수두 H 를 1 m → 1.5 m 로 올려 같은 관계가 어떻게 달라지는지 본다.'],
    vars:['호스 길이 L · 수두 H','유량 Q (L/min)','호스 지름 · 꼬임 · 수온 · 출구 높이'],
    predict:[['L = 2 m · H = 1 m','Q = '+fx(a.Q,1)+' L/min · 손실 '+fx(a.loss*100,0)+' %','이상값의 일부만 나온다'],
             ['L = 0.5 m · H = 1 m','Q = '+fx(b.Q,1)+' L/min · 손실 '+fx(b.loss*100,0)+' %','짧으면 손실이 작다'],
             ['L = 8 m · H = 1 m','Q = '+fx(c.Q,1)+' L/min · 손실 '+fx(c.loss*100,0)+' %','길수록 유량이 크게 줄어든다'],
             ['L = 2 m · H = 1.5 m','Q = '+fx(d.Q,1)+' L/min','수두가 커져도 √ 로만 증가']],
    data:{cols:['호스 길이 L (m)','유량 측정 (L/min)','이론 (L/min)','차이 (%)'], rows:r06(2,1,1).rows.map(function(q){ return [fx(q.L,1),fx(q.q,2),fx(q.ideal,2),fx((q.q/q.ideal-1)*100,0)]; })},
    analysis:'Q 대 L 그래프에서 호스가 길어질수록 Q 가 $1/\\sqrt{1.5+fL/D}$ 에 따라 줄어드는지 확인한다. $Q_0$ 대비 비율과 레이놀즈 수 $Re=\\rho vD/\\mu$ 를 함께 표로 정리하고 난류 마찰 계수 $f\\approx0.316Re^{-1/4}$ 와 비교한다.',
    special:['🎓 연구 설계',[['연구 질문','호스 길이에 따라 유량은 어떻게 줄어드는가?'],['독립변인','호스 길이 · 수두'],['종속변인','유량 Q · 손실률'],['통제변인','호스 지름 · 수온 · 출구 높이 · 꼬임'],['기대 결과','L 이 길수록 Q 감소, 이상값보다 훨씬 작음']]],
    fails:[['호스가 꼬여 유량이 불규칙하다','호스를 곧게 펴고 접힘이 없게 고정한다'],['수위가 내려간다','넘침 구멍으로 일정하게 유지하거나 짧은 시간에 측정한다'],['공기 방울이 섞인다','호스를 물에 담가 공기를 빼고 연결한다']],
    up:['<b>R02</b> — 벤투리 관 압력 강하.','<b>I10</b> — 에어레이터 절수 노즐.','<b>종합2(16번 탭)</b> — 압력 강하 직선.'],
    next:['원리⑤ 적용 한계',6],
    eval:[['정확성','Q 측정의 일관성'],['반복성','3 회 · 표준편차'],['분석','손실률 · Re'],['안전','물 · 바닥 닦기']],
    tip:'「식이 틀리는 크기」를 숫자로 보고하는 것이 좋은 R&E 의 핵심입니다. 이상값 대비 몇 %인지 한 문장으로 쓰세요.' });
})();
SIMS.R06={ q:'호스 길이와 수두를 바꾸면 유량은 이상값에 비해 얼마나 줄어들까?',
  a:{nm:'호스 길이 L',min:0.5,max:10,step:0.5,val:2,unit:'m',d:1}, b:{nm:'수두 H',min:0.3,max:1.5,step:0.1,val:1,unit:'m',d:1},
  cap1:'물통(왼쪽)의 물이 호스를 따라 흐릅니다. 호스가 길수록 입자 속력이 느리고(색이 파랑 → 연한 색) 출구 유량이 줄어듭니다. 아래 막대는 이상 유량(점선)과 실제 유량입니다.',
  cap2:'📊 호스 길이 L 대 유량 Q — 이론(곡선, 마찰 포함)과 측정점(잡음 4 %). 점선은 마찰 없는 이상 유량.',
  note:'모형 : $H=\\left(1.5+f\\tfrac LD\\right)\\tfrac{v^2}{2g}$ (입구 · 출구 손실 1.5) · $D=8$ mm · 마찰 계수 $f(Re)$ (층류 64/Re, 난류 블라지우스) 반복 계산. 곡률 · 이음새 · 온도 무시.',
  anim:function(ctx,w,h,t,L,H,S){ var o=r06(L,H,S.seed), tx=30, tw=w*0.16, ty=20, th=h*0.52; drawTank(ctx,tx,ty,tw,th,0.85); var sx=tx+tw, sy=ty+th-8, ex=w*0.82, ey=ty+th+h*0.12, pts=[], k; for(k=0;k<=30;k++){ var u=k/30; pts.push([sx+(ex-sx)*u, sy+(ey-sy)*u+Math.sin(u*TAU*Math.max(1,L/2))*8]); } cvLine(ctx,pts,'#7dd3fc',5); cvLine(ctx,pts,'#0b1424',1);
    for(k=0;k<20;k++){ var u=((k/20)+t*0.12*Math.min(1,o.v/3))%1, ii=Math.floor(u*30), p=pts[ii]; cvCirc(ctx,p[0],p[1],2.6,'#e0f2fe',null); }
    var bw=w*0.3, bx=w*0.5, by=h*0.86, rat=o.Q/o.Qid; cvRect(ctx,bx,by-14,bw,12,'rgba(148,163,184,.25)',null); cvRect(ctx,bx,by-14,bw*rat,12,COL.blue,null); cvLine(ctx,[[bx+bw,by-18],[bx+bw,by-2]],COL.amber,2,[3,2]); cvText(ctx,'실제 유량 / 이상 유량 = '+(rat*100).toFixed(0)+' %',bx,by-24,COL.text,'12px system-ui,sans-serif');
    cvText(ctx,'L = '+L+' m · H = '+H+' m · v = '+o.v.toFixed(2)+' m/s · Re = '+o.Re.toFixed(0),12,12,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,L,H,S){ var o=r06(L,H,S.seed), pts=o.rows.map(function(q){ return [q.L,q.q]; }), cur=[], k; for(k=0.5;k<=10;k+=0.5) cur.push([k,r06(k,H,1).Q]);
    lineGraph(ctx,w,h,{xmin:0,xmax:10.5,ymin:0,ymax:o.Qid*1.1,xl:'호스 길이 L (m)',yl:'유량 Q (L/min)',title:'호스 길이 대 유량 — 마찰로 줄어든다',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[0,o.Qid],[10.5,o.Qid]],col:COL.dim,lw:1.4,dash:[5,4]}],pts:pts,now:[L,o.Q],legend:[['마찰 포함',COL.ok],['이상값',COL.dim],['측정',COL.blue],['지금',COL.amber]],yd:1,lw:140}); },
  kv:function(L,H,S){ var o=r06(L,H,S.seed); return [['출구 속력 v',o.v.toFixed(2)+' m/s','a'],['유량 Q',o.Q.toFixed(1)+' L/min','g'],['이상 유량 Q₀',o.Qid.toFixed(1)+' L/min','v2'],['손실률',(o.loss*100).toFixed(0)+' %','r'],['레이놀즈 수 · f',o.Re.toFixed(0)+' · '+o.f.toFixed(3)]]; } };

/* ── R07 : 분무기 최소 풍속과 액면 높이 ──────────────────────────── */
function r07(h,d,seed){ var rn=rng32(seed*41+5), k=0.6, vmin=Math.sqrt(2*1000*G*h/100/(k*1.2)), A=Math.PI*Math.pow(d/2000,2), Q=vmin*A*1000, rows=[], i;
  for(i=0;i<6;i++){ var hh=0.5+0.9*i, v0=Math.sqrt(2*1000*G*hh/100/(k*1.2)); rows.push({h:hh,v:Math.max(0,v0*(1+0.06*gaussR(rn))),ideal:v0}); }
  return {vmin:vmin,Q:Q,ok:Q<0.6,rows:rows,dp:1000*G*h/100}; }
(function(){ var a=r07(2,4,1), b=r07(5,4,1), c=r07(2,7,1), d=r07(1,4,1);
  mkP({ id:'R07', t:'분무기 최소 풍속 — 액면 높이와 노즐 지름', icon:'🌫', type:'R&E · 정량 실험', lv:2, dur:'2 주', cost:'약 1 만 원',
    one:'물컵에 세로 빨대를 꽂고 가로 빨대로 바람을 불어 액체가 처음 올라오는 순간의 풍속(바람 유량과 노즐 면적으로 환산)을 액면 높이 h 별로 재서, $\\tfrac12\\rho_av^2\\cdot k>\\rho_lgh$ 로 설명되는지 확인한다.',
    q:'분무기는 얼마나 빠른 바람이 필요할까? 액면이 높아지면 최소 풍속은 어떻게 변할까? 노즐 지름은 필요한 공기 유량에 어떤 영향을 줄까?',
    why:'분무기는 <b>입으로 불어도 쉽게 만들 수 있는</b> 베르누이 장치입니다. 최소 풍속을 재 보면 「공기가 만드는 압력 강하」와 「액체를 끌어올리는 압력」의 균형을 정량적으로 이해하게 됩니다.',
    link:'원리② 베르누이(3번 탭) · 원리④ 응용 — 분무기(5번 탭).',
    cap:'가로 빨대로 빠른 공기가 흐르고(왼쪽) 세로 빨대 끝의 압력이 낮아져(가운데) 액체가 올라 분무가 일어난다(오른쪽). 컵 · 액면 높이 h · 세로 빨대 · 가로 빨대 노즐 · 공기 유량 측정 · 기록표',
    parts:[['물컵 · 액면','높이 h 조절','투명 컵 + 눈금','액면을 세로 빨대 끝보다 h 만큼 아래로 둔다.'],
           ['세로 빨대','액체 통로','지름 6 mm 빨대','끝을 가로 빨대의 출구 근처에 둔다. 위치가 중요.'],
           ['가로 빨대(노즐)','공기 속력 v','지름 3 ~ 8 mm','노즐 지름을 바꿔 같은 유량에서 속력을 조절한다.'],
           ['공기 유량 측정','Q = A v','풍선 · 비닐 + 시간 / 스마트폰 앱','일정 시간 동안 부풀린 풍선 부피로 유량을 구한다.'],
           ['기록표','h 대 v_min','스프레드시트','h 별 최소 속력을 정리.'],
           ['영상 분석','분무 시작 순간','슬로 모션','액체가 올라오기 시작하는 순간을 확인.']],
    budget:[['빨대 20 개(여러 지름)','1 세트','약 2 천 원','—'],['투명 컵 · 눈금','2','약 2 천 원','—'],['풍선 · 눈금자','1 세트','약 2 천 원','—'],['스마트폰(슬로 모션)','1','보유','—'],['색소(선택)','—','—','—']],
    steps:['세로 빨대를 컵에 꽂고 끝이 가로 빨대 출구 가까이에 오게 하고 액면 높이 h = 1 cm 로 조절한다.','가로 빨대로 서서히 세게 불어 액체가 올라오기 시작하는 최소 바람을 풍선 부피 · 시간으로 환산해 유량 Q 와 속력 $v=Q/A$ 를 구한다.','h = 1, 2, 3, 4, 5 cm 로 바꿔 각 3 회 반복한다.','노즐 지름을 3 · 5 · 8 mm 로 바꿔 같은 h 에서 필요한 유량을 비교한다.','$v_{min}=\\sqrt{2\\rho_lgh/(k\\rho_a)}$ 와 비교해 효율 $k$ 를 구한다.'],
    vars:['액면 높이 h · 노즐 지름 d','최소 분무 풍속 $v_{min}$ · 필요 유량 Q','빨대 위치 · 공기 온도 · 불기 방법'],
    predict:[['h = 2 cm · d = 4 mm','$v_{min}$ = '+fx(a.vmin,0)+' m/s · Q = '+fx(a.Q,2)+' L/s','입으로 가능한 범위'],
             ['h = 5 cm · d = 4 mm','$v_{min}$ = '+fx(b.vmin,0)+' m/s · Q = '+fx(b.Q,2)+' L/s','액면이 높을수록 훨씬 센 바람 필요'],
             ['h = 2 cm · d = 7 mm','Q = '+fx(c.Q,2)+' L/s','같은 속력이면 큰 지름이 더 많은 공기 유량'],
             ['h = 1 cm · d = 4 mm','$v_{min}$ = '+fx(d.vmin,0)+' m/s','$\\sqrt h$ 에 비례해 낮아진다']],
    data:{cols:['액면 h (cm)','v_min 측정 (m/s)','이론 (m/s)','차이 (%)'], rows:r07(2,4,1).rows.map(function(q){ return [fx(q.h,1),fx(q.v,1),fx(q.ideal,1),fx((q.v/q.ideal-1)*100,0)]; })},
    analysis:'$v_{min}^2$ 대 h 를 그려 원점을 지나는 직선인지 확인하고 기울기 $2\\rho_lg/(k\\rho_a)$ 에서 효율 $k$ 를 구한다. 입으로 불 수 있는 공기 유량 상한(약 0.5 L/s)과 비교해 분무 가능 영역을 표로 만든다.',
    special:['🎓 연구 설계',[['연구 질문','분무가 시작되는 최소 풍속은 무엇에 의존하는가?'],['독립변인','액면 높이 · 노즐 지름'],['종속변인','최소 풍속 · 필요 유량'],['통제변인','빨대 위치 · 공기 온도'],['기대 결과','$v_{min}\\propto\\sqrt h$, 효율 $k\\approx0.5$']]],
    fails:[['액체가 올라오지 않는다','세로 빨대 끝 위치를 노즐 출구 앞 1 ~ 2 mm 로 가까이, 액면을 낮춘다'],['유량을 알 수 없다','풍선 부피(눈금)와 시간으로 평균 유량을 구한다'],['분무 순간이 모호하다','슬로 모션 영상으로 첫 방울 순간을 프레임으로 정한다']],
    up:['<b>I04</b> — 최적 노즐 분무기 설계.','<b>C03</b> — 분무 물감 아트.','<b>종합2(16번 탭)</b> — 압력 강하.'],
    next:['원리④ 응용',5],
    eval:[['정확성','v_min 이론 대비'],['반복성','h 당 3 회'],['분석','$v^2$–h 직선'],['안전','입 건강 · 위생(빨대는 개인별)']],
    tip:'「속력은 $\\sqrt h$ 에 비례한다」를 한 장의 직선 그래프로 보여 주세요. 위생 문제를 고려해 개인용 빨대를 쓰는 것도 안전 규칙으로 발표하세요.' });
})();
SIMS.R07={ q:'액면 높이와 노즐 지름을 바꾸면 분무가 시작되는 최소 풍속과 필요한 공기 유량은 어떻게 변할까?',
  a:{nm:'액면 높이 h',min:0.5,max:5,step:0.5,val:2,unit:'cm',d:1}, b:{nm:'노즐 지름 d',min:3,max:8,step:0.5,val:4,unit:'mm',d:1},
  cap1:'가로 빨대로 공기가 빠르게 지나가고 세로 빨대 속 액체가 올라옵니다. 풍속이 최소값을 넘으면 분무(작은 점)가 시작됩니다. 필요한 유량이 입 한계(0.6 L/s)를 넘으면 경고가 뜹니다.',
  cap2:'📊 액면 높이 h 대 최소 풍속 $v_{min}$ — 이론(곡선, √h 에 비례)과 측정점(잡음 6 %).',
  note:'모형 : $\\tfrac12\\rho_av^2k=\\rho_lgh$, 효율 $k=0.6$ · $v_{min}=\\sqrt{2\\rho_lgh/(k\\rho_a)}$ · $Q=v_{min}\\pi d^2/4$ · 입으로 낼 수 있는 유량 어림 0.6 L/s. 표면장력 · 점성 · 빨대 위치 오차 무시.',
  anim:function(ctx,w,h,t,hh,d,S){ var o=r07(hh,d,S.seed), cx=w*0.3, cw=w*0.18, cy=h*0.5, ch=h*0.34; ctx.fillStyle='rgba(56,189,248,.35)'; ctx.fillRect(cx,cy+ch*0.25,cw,ch*0.75); ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.strokeRect(cx,cy,cw,ch); ctx.lineWidth=1;
    var sx=cx+cw*0.5, tipy=cy-hh*3; cvRect(ctx,sx-3,tipy,6,ch*0.7+(cy-tipy),'#475569',null); cvRect(ctx,sx-3,tipy-10,w*0.3,7,'#475569',null); flowDots(ctx,t,o.vmin,sx+4,sx+w*0.3,tipy-22,tipy-4,18,'rgba(251,191,36,.9)');
    var sprayOn=o.ok; if(sprayOn){ for(var i=0;i<22;i++){ var u=((i/22)+t*0.7)%1; cvCirc(ctx,sx+w*0.3+u*w*0.16,tipy-12+Math.sin(i*2.1)*u*14,1.6,'rgba(147,197,253,.9)',null); } }
    cvText(ctx,'액면 차 h = '+hh+' cm → 필요 Δp = ρgh = '+o.dp.toFixed(0)+' Pa',12,14,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'최소 풍속 '+o.vmin.toFixed(0)+' m/s · 공기 유량 '+o.Q.toFixed(2)+' L/s '+(o.ok?'✅ 입으로 가능':'❌ 입으로는 어려움'),12,h-12,o.ok?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,hh,d,S){ var o=r07(hh,d,S.seed), pts=o.rows.map(function(q){ return [q.h,q.v]; }), cur=[], k; for(k=0.5;k<=5.01;k+=0.25) cur.push([k,Math.sqrt(2*1000*G*k/100/(0.6*1.2))]);
    lineGraph(ctx,w,h,{xmin:0,xmax:5.5,ymin:0,ymax:50,xl:'액면 높이 h (cm)',yl:'최소 풍속 v_min (m/s)',title:'분무 시작 풍속 ∝ √h',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[hh,o.vmin],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:0}); },
  kv:function(hh,d,S){ var o=r07(hh,d,S.seed); return [['필요 압력 ρgh',o.dp.toFixed(0)+' Pa','a'],['최소 풍속',o.vmin.toFixed(1)+' m/s','g'],['노즐 면적',(Math.PI*d*d/4).toFixed(1)+' mm²','v2'],['필요 공기 유량',o.Q.toFixed(2)+' L/s','r'],['판정',o.ok?'입으로 가능':'펌프 필요']]; } };

/* ── R08 : 커피 필터 낙하와 종단 속도 (공기 저항) ──────────────────── */
function r08(N,dia,seed){ var rn=rng32(seed*43+9), m=N*1.1e-3, A=Math.PI*Math.pow(dia/200,2), CD=1.2, vt=Math.sqrt(2*m*G/(1.2*CD*A)), rows=[], i;
  for(i=0;i<6;i++){ var nn=i+1, v0=Math.sqrt(2*nn*1.1e-3*G/(1.2*CD*A)); rows.push({n:nn,v:v0*(1+0.05*gaussR(rn)),ideal:v0}); }
  var Re=1.2*vt*(dia/100)/1.8e-5; return {vt:vt,m:m,A:A,Re:Re,rows:rows,t2:2/vt}; }
(function(){ var a=r08(1,12,1), b=r08(4,12,1), c=r08(1,16,1), d=r08(8,12,1);
  mkP({ id:'R08', t:'커피 필터 낙하 — 공기 저항과 종단 속도', icon:'☕', type:'R&E · 정량 실험', lv:1, dur:'1 주', cost:'약 1 만 원',
    one:'바구니형 커피 필터를 1 ~ 6 장 겹쳐 2 m 높이에서 떨어뜨려 일정 속력에 이른 구간의 시간을 영상으로 재서 종단 속도 $v_t$ 를 구하고, $v_t\\propto\\sqrt{m}$ (질량의 제곱근에 비례)임을 확인한다.',
    q:'필터를 겹칠수록 종단 속도는 얼마나 빨라질까? 질량이 4 배가 되면 속력은 몇 배일까?',
    why:'종이컵 모양 필터는 <b>공기 저항 때문에 천천히 떨어지고</b> 질량을 늘리면 속력도 늘지만 제곱근으로만 늘어납니다. 중력과 공기 저항의 균형이라는 아이디어를 가장 값싸게 정량 실험으로 만드는 방법입니다.',
    link:'원리⑤ 적용 한계(6번 탭) · 원리⑥ 동압(7번 탭) · 교과서 힘의 평형.',
    cap:'바구니 필터가 떨어지며(왼쪽) 일정 속력이 되고(가운데) 영상의 프레임으로 낙하 시간을 잰다(오른쪽). 커피 필터 · 줄자(2 m) · 스마트폰 영상 · 계단 높이 · 저울 · 기록표',
    parts:[['커피 필터','바구니형 지름 12 cm','같은 종류 20 장','1 장 질량을 저울로 잰다(약 1.1 g). 같은 방향으로 겹친다.'],
           ['낙하 높이 · 줄자','2 m','벽 · 줄자','일정 속력에 이른 구간(마지막 1 m)의 시간을 잰다.'],
           ['스마트폰 영상','240 fps','삼각대','벽 눈금과 같이 찍어 프레임 수로 시간을 구한다.'],
           ['저울','질량 측정','0.01 g 저울','필터 1 장 · N 장 질량을 정밀하게 잰다.'],
           ['바람 막기','실내','문 · 선풍기 끔','기류 영향을 없앤다.'],
           ['기록표 · 그래프','N 대 v_t','스프레드시트','v_t 대 √m 의 직선 확인.']],
    budget:[['커피 필터 20 장','1','약 2 천 원','—'],['줄자 · 테이프','1','약 3 천 원','—'],['저울(0.01 g)','1','학교','주방 저울'],['삼각대','1','약 5 천 원','책'],['스마트폰','1','보유','—']],
    steps:['필터 1 장의 질량 m 을 저울로 재고 바구니 모양이 아래로 향하게 한다.','높이 2 m 에서 손을 놓아 떨어지는 영상을 찍는다(5 회). 마지막 1 m 구간의 시간으로 종단 속도 $v_t$ 를 구한다.','필터를 2, 3, 4, 5, 6 장 겹쳐 같은 방법으로 반복한다.','$v_t$ 대 √N(또는 $\\sqrt m$)을 그려 원점을 지나는 직선인지 확인한다.','지름이 다른 필터(큰 것)로 같은 실험을 해 $v_t\\propto1/\\sqrt A$ 를 확인한다.'],
    vars:['질량 m(필터 개수) · 필터 지름','종단 속도 $v_t$ · 낙하 시간','공기 밀도 · 모양 · 놓는 자세 · 기류'],
    predict:[['1 장 · 지름 12 cm','$v_t$ = '+fx(a.vt,2)+' m/s · 2 m 낙하 '+fx(a.t2,1)+' s','가볍고 넓어 느리게 떨어진다'],
             ['4 장 · 지름 12 cm','$v_t$ = '+fx(b.vt,2)+' m/s','질량 4 배 → 속력 2 배'],
             ['1 장 · 지름 16 cm','$v_t$ = '+fx(c.vt,2)+' m/s','면적이 커서 더 느리다'],
             ['8 장 · 지름 12 cm','$v_t$ = '+fx(d.vt,2)+' m/s','$\\sqrt8\\approx2.8$ 배']],
    data:{cols:['필터 수 N','v_t 측정 (m/s)','이론 (m/s)','차이 (%)'], rows:r08(1,12,1).rows.map(function(q){ return [fx(q.n,0),fx(q.v,2),fx(q.ideal,2),fx((q.v/q.ideal-1)*100,0)]; })},
    analysis:'$v_t^2$ 대 N 이 원점을 지나는 직선인지, 또는 로그–로그 그래프의 기울기가 0.5 인지 확인한다. 기울기에서 항력 계수 $C_D=2mg/(\\rho Av_t^2)$ 를 추정하고 문헌값(컵 모양 약 1.0 ~ 1.4)과 비교한다.',
    special:['🎓 연구 설계',[['연구 질문','필터의 종단 속도는 질량과 어떤 관계인가?'],['독립변인','필터 개수(질량) · 지름'],['종속변인','종단 속도'],['통제변인','높이 · 모양 · 방향 · 실내 기류'],['기대 결과','$v_t\\propto\\sqrt m$ (로그–로그 기울기 0.5)']]],
    fails:[['필터가 옆으로 날아간다','실내 기류를 막고 같은 자세로 놓는다. 위로 뒤집힌 영상은 제외'],['종단 속도에 못 이른다','더 높은 곳(2 m 이상)에서 떨어뜨린다'],['프레임 읽기가 어렵다','벽에 눈금 테이프를 붙이고 같은 배경에서 촬영']],
    up:['<b>C09</b> — 종이 낙하산 대회.','<b>C05</b> — 형상별 공기 저항 비교.','<b>C06</b> — 바람 세기 인포그래픽.'],
    next:['원리⑥ 활용 현황 · 동압',7],
    eval:[['정확성','로그–로그 기울기 0.5'],['반복성','5 회'],['분석','$C_D$ 추정'],['안전','높은 곳 낙하 주의 · 의자 사용 금지']],
    tip:'공기 저항이 크면 속도가 제곱근으로만 늘어난다는 것을 한 장의 로그–로그 그래프로 보여 주세요.' });
})();
SIMS.R08={ q:'커피 필터를 몇 장 겹치고 지름을 얼마로 하면 종단 속도는 어떻게 될까?',
  a:{nm:'필터 개수 N',min:1,max:8,step:1,val:2,unit:'장',d:0}, b:{nm:'필터 지름',min:8,max:20,step:1,val:12,unit:'cm',d:0},
  cap1:'필터가 떨어지며 중력(보라)과 공기 저항(노랑)이 균형을 이룰 때 속력이 일정해집니다. 아래 눈금은 2 m 낙하 시간입니다.',
  cap2:'📊 필터 수 N 대 종단 속도 $v_t$ — 이론 곡선($\\sqrt N$)과 측정점(잡음 5 %). 질량이 4 배면 속력은 2 배입니다.',
  note:'모형 : $mg=\\tfrac12\\rho C_DAv_t^2$ · $m=1.1$ g × N · $C_D=1.2$ · $A=\\pi(d/2)^2$ (공기 1.2 kg/m³). 초기 가속 구간 · 모양 변형 · 기류 무시.',
  anim:function(ctx,w,h,t,N,dia,S){ var o=r08(N,dia,S.seed), x0=w*0.3, top=24, bot=h-34, ph=Math.min(1,(t%5)/4.2), acc=1-Math.exp(-ph*3.5), y=top+(bot-top)*acc*0.92; var sw=Math.max(14,dia*2.4); ctx.fillStyle='rgba(148,163,184,.18)'; ctx.fillRect(x0-50,top,100,bot-top); cvLine(ctx,[[x0-50,bot],[x0+50,bot]],COL.axis2,2);
    ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.moveTo(x0-sw/2,y-12); ctx.lineTo(x0+sw/2,y-12); ctx.lineTo(x0+sw/4,y+4); ctx.lineTo(x0-sw/4,y+4); ctx.closePath(); ctx.fill(); cvArrow(ctx,x0,y+6,x0,y+6+Math.min(34,N*5+10),'#a78bfa',2.6); cvArrow(ctx,x0,y-14,x0,y-14-Math.min(34,N*5+10)*acc,COL.amber,2.6);
    cvText(ctx,'v = '+(o.vt*acc).toFixed(2)+' m/s → 종단 속도 '+o.vt.toFixed(2)+' m/s',12,14,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'m = '+(o.m*1000).toFixed(1)+' g · A = '+(o.A*1e4).toFixed(0)+' cm² · Re = '+o.Re.toFixed(0)+' · 2 m 낙하 ≈ '+o.t2.toFixed(1)+' s',w*0.46,h*0.5,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,N,dia,S){ var o=r08(N,dia,S.seed), pts=o.rows.map(function(q){ return [q.n,q.v]; }), cur=[], k, A=Math.PI*Math.pow(dia/200,2); for(k=0.5;k<=8.5;k+=0.25) cur.push([k,Math.sqrt(2*k*1.1e-3*G/(1.2*1.2*A))]);
    lineGraph(ctx,w,h,{xmin:0,xmax:8.5,ymin:0,ymax:Math.max(2,cur[cur.length-1][1]*1.15),xl:'필터 수 N',yl:'종단 속도 v_t (m/s)',title:'종단 속도 ∝ √N',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[N,o.vt],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:1}); },
  kv:function(N,dia,S){ var o=r08(N,dia,S.seed); return [['질량 m',(o.m*1000).toFixed(1)+' g','a'],['종단 속도',o.vt.toFixed(2)+' m/s','g'],['레이놀즈 수',o.Re.toFixed(0),'v2'],['2 m 낙하 시간',o.t2.toFixed(1)+' s','r'],['공기 저항(종단)',(o.m*G*1000).toFixed(1)+' mN']]; } };

/* ── R09 : 구멍 크기와 물이 비는 시간 (토리첼리 시간 버전) ─────────── */
function r09(d,H,seed){ var rn=rng32(seed*47+11), A=Math.PI*0.04*0.04, a=Math.PI*Math.pow(d/2000,2), Cd=0.62, T=(A/a)*Math.sqrt(2*H/100/G)/Cd, rows=[], i;
  for(i=0;i<6;i++){ var dd=3+1.2*i, aa=Math.PI*Math.pow(dd/2000,2), T0=(A/aa)*Math.sqrt(2*H/100/G)/Cd; rows.push({d:dd,T:T0*(1+0.03*gaussR(rn)),ideal:T0}); }
  return {T:T,A:A,a:a,rows:rows,vo:torr(H/100)*Cd}; }
(function(){ var a=r09(5,20,1), b=r09(10,20,1), c=r09(5,30,1), d=r09(3,20,1);
  mkP({ id:'R09', t:'구멍 크기와 물이 비는 시간 — 토리첼리 정리의 시간 버전', icon:'⏱', type:'R&E · 정량 실험', lv:1, dur:'1 주', cost:'약 1 만 원',
    one:'원통형 페트병에 지름 3 ~ 10 mm 구멍 하나를 뚫고(교사 가공) 수면이 H 에서 0 이 될 때까지 걸리는 시간 T 를 재서 $T=\\dfrac{A}{C_da}\\sqrt{2H/g}$ 와 비교하고, T 가 구멍 지름의 제곱에 반비례하는지 확인한다.',
    q:'구멍 지름을 2 배로 키우면 물이 다 빠지는 시간은 몇 배로 줄어들까? 처음 수위를 2 배로 하면 시간은?',
    why:'<b>수위가 내려가면 물줄기가 점점 약해지는</b> 현상은 일상에서 쉽게 볼 수 있습니다. 시간의 식 $T\\propto\\sqrt H/d^2$ 은 베르누이와 연속 방정식이 합쳐진 결과로, 간단한 스톱워치로 확인할 수 있습니다.',
    link:'원리① 연속 방정식(2번 탭) · 원리④ 토리첼리(5번 탭).',
    cap:'원통형 병의 수면이 내려가며(왼쪽) 구멍에서 나가는 물줄기가 약해지고(가운데) 수면이 구멍에 이르는 시간 T 를 스톱워치로 잰다(오른쪽). 페트병 · 구멍 · 수위 눈금 · 스톱워치 · 받침 · 기록표',
    parts:[['원통형 병','지름 8 cm','투명 페트병(원통부)','단면적 A 는 지름으로 계산한다. 눈금을 붙인다.'],
           ['구멍(교사 가공)','지름 3 ~ 10 mm','못 · 드릴(교사)','구멍 가장자리를 매끈하게. 한 병에 구멍 하나.'],
           ['수위 눈금','H = 20 cm','테이프 눈금자','수면이 눈금을 지날 때 시간을 기록.'],
           ['스톱워치 · 영상','T 측정','스마트폰','영상으로 재면 정확하다.'],
           ['받침 · 쟁반','물 받기','쟁반 + 수건','바닥에 물이 튀지 않게.'],
           ['기록표 · 그래프','d 대 T','스프레드시트','T 대 $1/d^2$ 의 직선 확인.']],
    budget:[['페트병 6 개','1 세트','약 2 천 원','—'],['못 · 드릴(교사)','1','학교','—'],['눈금 테이프','1','약 2 천 원','—'],['스톱워치','1','보유','—'],['쟁반 · 수건','1','약 3 천 원','—']],
    steps:['구멍 지름이 다른 병(3, 4.5, 6, 7.5, 9, 10 mm)을 준비하고 눈금 H = 20 cm 를 붙인다.','구멍을 막고 H 까지 물을 채운 뒤 손을 떼는 순간부터 수면이 구멍에 닿을 때까지 시간 T 를 재어 3 회 평균한다.','구멍 지름별 T 를 구해 $T$ 대 $1/d^2$ 를 그린다.','처음 수위 H 를 10, 20, 30 cm 로 바꿔 T 대 $\\sqrt H$ 를 그린다.','이론 $T=\\dfrac{A}{C_da}\\sqrt{2H/g}$ 와 비교해 유출 계수 $C_d$ 를 구한다(약 0.6).'],
    vars:['구멍 지름 d · 초기 수위 H','비는 시간 T','병 지름 · 구멍 모양 · 수온 · 병 흔들림'],
    predict:[['d = 5 mm · H = 20 cm','T = '+fx(a.T,0)+' s','구멍이 작아 오래 걸린다'],
             ['d = 10 mm · H = 20 cm','T = '+fx(b.T,0)+' s','지름 2 배 → 시간 1/4'],
             ['d = 5 mm · H = 30 cm','T = '+fx(c.T,0)+' s','수위 1.5 배 → 시간 약 1.22 배'],
             ['d = 3 mm · H = 20 cm','T = '+fx(d.T,0)+' s','매우 오래 걸린다']],
    data:{cols:['구멍 지름 d (mm)','T 측정 (s)','T 이론 (s)','차이 (%)'], rows:r09(5,20,1).rows.map(function(q){ return [fx(q.d,1),fx(q.T,0),fx(q.ideal,0),fx((q.T/q.ideal-1)*100,0)]; })},
    analysis:'T 대 $1/d^2$ 가 원점을 지나는 직선인지, 기울기에서 $C_d$ 를 구해 문헌값(날카로운 구멍 약 0.6)과 비교한다. 수면 속도가 $\\sqrt h$ 에 비례하므로 수위 대 시간 그래프가 포물선(수면 높이가 시간의 제곱으로 줄어듦)이 되는지 영상으로 확인한다.',
    special:['🎓 연구 설계',[['연구 질문','구멍 크기와 수위는 배수 시간에 어떻게 작용하는가?'],['독립변인','구멍 지름 · 초기 수위'],['종속변인','비는 시간 T'],['통제변인','병 지름 · 구멍 모양 · 수온'],['기대 결과','$T\\propto\\sqrt H/d^2$, $C_d\\approx0.6$']]],
    fails:[['구멍에서 물이 휘며 나온다','병을 수평으로 놓고 구멍의 거스러미를 다듬는다'],['시간이 매번 다르다','영상으로 시작 · 종료 프레임을 정해 재고 평균한다'],['공기가 들어가 물이 출렁인다','병 입구를 열어 두어 공기가 자유롭게 들어가게 한다']],
    up:['<b>R03</b> — 구멍 깊이와 도달 거리.','<b>I05</b> — 사이펀 급수기(자동 화분).','<b>I10</b> — 에어레이터 노즐.'],
    next:['원리④ 응용 — 토리첼리',5],
    eval:[['정확성','T 이론 대비'],['반복성','3 회'],['분석','$1/d^2$ 직선 · $C_d$'],['안전','물 · 바닥 닦기']],
    tip:'「지름이 2 배면 시간은 1/4」을 예측한 뒤 실험으로 확인하는 순서로 발표하면 설득력이 있습니다.' });
})();
SIMS.R09={ q:'구멍 지름과 처음 수위를 바꾸면 물이 다 빠지는 시간은 어떻게 달라질까?',
  a:{nm:'구멍 지름 d',min:3,max:10,step:0.5,val:5,unit:'mm',d:1}, b:{nm:'처음 수위 H',min:10,max:30,step:1,val:20,unit:'cm',d:0},
  cap1:'병 속 수면이 내려가며 구멍에서 나오는 물줄기가 점점 약해집니다. 위 글자는 이론 시간 T 와 현재 수위입니다.',
  cap2:'📊 구멍 지름 d 대 비는 시간 T — 이론 곡선($1/d^2$)과 측정점(잡음 3 %). 지름이 2 배면 시간은 1/4 입니다.',
  note:'모형 : 병 지름 8 cm · $T=\\dfrac{A}{C_da}\\sqrt{\\dfrac{2H}{g}}$, $C_d=0.62$ · 수면 높이는 시간에 따라 $h(t)=H(1-t/T)^2$ 로 줄어듭니다. 표면장력 · 공기 흡입 · 구멍 모서리 모양 무시.',
  anim:function(ctx,w,h,t,d,H,S){ var o=r09(d,H,S.seed), bx=w*0.3, bw=w*0.2, by=24, bh=h*0.6, ph=Math.min(1,(t%8)/7), tt=ph*o.T, lv=Math.pow(Math.max(0,1-tt/o.T),2)*0.9+0.04; drawTank(ctx,bx,by,bw,bh,lv); cvCirc(ctx,bx+bw,by+bh-6,Math.max(1.5,d*0.5),'#0b1424',COL.amber,1.5);
    var v=Math.sqrt(Math.max(lv*0.9,0)*1)*1.0, pts=[], k; for(k=0;k<=20;k++){ var x=bx+bw+k*(w*0.3/20)*Math.sqrt(lv)*1.5, y=by+bh-6+ (k*k)*0.35; pts.push([x,Math.min(y,by+bh+14)]); } cvLine(ctx,pts,'#7dd3fc',Math.max(1.4,d*0.5)); cvLine(ctx,[[bx-14,by+bh],[w-12,by+bh+14]],COL.axis2,1,[2,3]);
    cvText(ctx,'t = '+tt.toFixed(0)+' s / T = '+o.T.toFixed(0)+' s · 수위 '+(lv/0.9*H).toFixed(0)+' cm',12,14,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'유출 속력 v = '+(Math.sqrt(2*G*lv/0.9*H/100)*0.62).toFixed(2)+' m/s (수위가 낮아지면 느려진다)',12,h-12,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,d,H,S){ var o=r09(d,H,S.seed), pts=o.rows.map(function(q){ return [q.d,q.T]; }), cur=[], k; for(k=3;k<=10.01;k+=0.25){ var aa=Math.PI*Math.pow(k/2000,2); cur.push([k,(o.A/aa)*Math.sqrt(2*H/100/G)/0.62]); }
    lineGraph(ctx,w,h,{xmin:2,xmax:10.5,ymin:0,ymax:Math.max(100,cur[0][1]*1.05),xl:'구멍 지름 d (mm)',yl:'비는 시간 T (s)',title:'배수 시간 T ∝ 1/d²',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[d,o.T],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:0}); },
  kv:function(d,H,S){ var o=r09(d,H,S.seed); return [['비는 시간 T',o.T.toFixed(0)+' s ('+(o.T/60).toFixed(1)+' 분)','a'],['처음 유출 속력',o.vo.toFixed(2)+' m/s','g'],['구멍 면적',(o.a*1e6).toFixed(1)+' mm²','v2'],['병 단면적',(o.A*1e4).toFixed(1)+' cm²'],['면적비 A/a',(o.A/o.a).toFixed(0),'r']]; } };

/* ── R10 : 층류–난류 전이와 레이놀즈 수 ───────────────────────────── */
function muW(T){ var TK=T+273.15; return 2.414e-5*Math.pow(10,247.8/(TK-140)); }
function r10(Q,T,seed){ var rn=rng32(seed*53+17), D=0.008, A=Math.PI*D*D/4, v=Q*1e-6/A, rho=rhoWater(T), mu=muW(T), Re=rho*v*D/mu, crit=2300*(1+0.12*gaussR(rn)), reg=Re<crit*0.9?'층류':(Re<crit*1.35?'전이':'난류'), rows=[], i;
  for(i=0;i<6;i++){ var qq=2+5*i, vv=qq*1e-6/A, rr=rhoWater(T)*vv*D/mu; rows.push({q:qq,re:rr}); }
  return {v:v,Re:Re,mu:mu,rho:rho,reg:reg,crit:crit,qcrit:2300*mu*A/(rho*D)*1e6,rows:rows}; }
(function(){ var a=r10(5,20,1), b=r10(15,20,1), c=r10(25,20,1), d=r10(10,50,1);
  mkP({ id:'R10', t:'층류에서 난류로 — 레이놀즈 수 임계값 찾기', icon:'🌀', type:'R&E · 시각화 실험', lv:3, dur:'3 주', cost:'약 2 만 원',
    one:'지름 8 mm 투명 관에 물을 흘리고 입구 중심에 색소(잉크)를 주입해 유량 Q 를 올리며 색소선이 직선(층류)에서 퍼지는(난류) 순간의 유량을 읽어 임계 레이놀즈 수($\\approx2300$)를 구하고, 수온(점성)이 임계 유량에 미치는 영향을 비교한다.',
    q:'색소선이 흔들리기 시작하는 유량은 레이놀즈 수로 얼마일까? 물의 온도가 올라가면 임계 유량은 어떻게 변할까?',
    why:'<b>눈으로 보는 층류와 난류의 경계</b>는 유체 역학의 상징적인 실험입니다. 레이놀즈가 1883 년에 했던 실험을 안전한 저속 · 물로 재현하고, 베르누이 식이 어떤 흐름에서 쓸모가 없어지는지 생각해 봅니다.',
    link:'원리⑤ 적용 한계(6번 탭) · 원리① 연속 방정식(2번 탭).',
    cap:'물통의 물이 투명 관으로 흐르며(왼쪽) 색소선이 직선에서 퍼지는 모양으로 바뀐다(가운데) → 그때의 유량으로 레이놀즈 수를 계산한다(오른쪽). 물통 · 색소 주입기 · 투명 관 · 유량 조절 · 메스실린더 · 기록표',
    parts:[['물통 · 정온','수위 · 수온 일정','큰 통 + 온도계','수위를 일정하게 하고 온도를 재서 점성을 구한다.'],
           ['투명 관','지름 8 mm · 길이 1 m','투명 호스 또는 유리관','곧게 펴고 진동이 없게 고정한다. 입구는 완만하게.'],
           ['색소 주입기','중심에 한 줄','주사기(바늘 없음) + 가는 튜브','색소를 천천히 일정하게 주입한다. 바늘은 쓰지 않는다.'],
           ['유량 조절','밸브 · 높이','클램프 · 수위 조정','유량을 천천히 올리며 색소선을 관찰한다.'],
           ['메스실린더 · 스톱워치','유량 Q','1 L 실린더','색소선이 퍼지는 순간의 유량을 재서 기록.'],
           ['기록표 · 계산','Re = ρvD/μ','스프레드시트','수온별 임계 Re 를 비교한다.']],
    budget:[['투명 관(8 mm) 2 m','1','약 5 천 원','—'],['색소 · 주사기(바늘 없음)','1 세트','약 3 천 원','—'],['물통 · 클램프','1','약 5 천 원','—'],['메스실린더 · 스톱워치','1','약 3 천 원','—'],['온도계','1','약 3 천 원','—']],
    steps:['물을 정온(20 ℃)으로 하고 수위를 일정하게 유지한다. 관을 곧게 고정한다.','색소를 관 입구 중심에 주입하며 유량을 아주 천천히 올려 색소선이 직선에서 흔들리고 퍼지기 시작하는 유량 $Q_c$ 를 메스실린더 + 스톱워치로 3 회 재어 평균한다.','$v=Q/A$, $Re=\\rho vD/\\mu$ 로 임계 레이놀즈 수를 구한다(약 2000 ~ 2600).','수온을 20 ℃ → 40 ℃ 로 바꿔 같은 방법으로 반복한다(뜨거운 물은 교사 주의).','수온에 따라 임계 유량이 어떻게 달라지는지 표로 정리한다.'],
    vars:['유량 Q · 수온 T','색소선이 퍼지는 순간(임계 유량) · 레이놀즈 수','관 지름 · 진동 · 입구 모양 · 색소 주입 속도'],
    predict:[['Q = 5 mL/s · 20 ℃','Re = '+fx(a.Re,0)+' → '+a.reg,'충분히 층류'],
             ['Q = 15 mL/s · 20 ℃','Re = '+fx(b.Re,0)+' → '+b.reg,'전이 구간 가까움'],
             ['Q = 25 mL/s · 20 ℃','Re = '+fx(c.Re,0)+' → '+c.reg,'소용돌이가 보인다'],
             ['Q = 10 mL/s · 50 ℃','Re = '+fx(d.Re,0)+' → '+d.reg,'뜨거운 물은 점성이 작아 Re 가 커진다']],
    data:{cols:['유량 Q (mL/s)','속력 v (m/s)','Re','흐름 형태'], rows:r10(5,20,1).rows.map(function(q){ var rr=q.re; return [fx(q.q,0),fx(q.q*1e-6/(Math.PI*0.000016),3),fx(rr,0),rr<2000?'층류':(rr<2800?'전이':'난류')]; })},
    analysis:'임계 유량에서 $Re_c$ 를 계산하고 여러 번의 평균과 표준편차를 구한다(주입 · 진동에 따라 2000 ~ 4000 로 퍼진다). 수온별 $Q_c$ 대 점성 $\\mu(T)$ 를 그려 $Q_c\\propto\\mu$ 인지(Re 일정) 확인한다.',
    special:['🎓 연구 설계',[['연구 질문','임계 레이놀즈 수는 얼마인가? 수온은 어떻게 작용하는가?'],['독립변인','유량 · 수온'],['종속변인','임계 유량 · Re_c'],['통제변인','관 지름 · 진동 · 주입 속도'],['기대 결과','$Re_c\\approx2000\\sim2600$, $Q_c\\propto\\mu$']]],
    fails:[['색소선이 처음부터 흔들린다','관 진동 제거, 입구를 매끈하게, 수위를 안정시키고 색소를 천천히 주입'],['임계값이 너무 낮다','입구 소용돌이를 줄이는 허니콤(빨대 묶음)을 입구에 둔다'],['색소가 퍼져 보이기 어렵다','배경을 흰색으로, 조명을 옆에서']],
    up:['<b>R06</b> — 호스 길이와 마찰 손실.','<b>종합2(16번 탭)</b> — 벤투리 압력 강하.','<b>I03</b> — 벤투리 유량계.'],
    next:['원리⑤ 적용 한계',6],
    eval:[['정확성','Re_c 의 일관성'],['반복성','5 회'],['분석','점성 · 온도 의존'],['안전','뜨거운 물 · 바닥 닦기']],
    tip:'수치 하나(예 : Re_c = 2400 ± 300)와 사진 한 장(층류 · 난류 색소선)이면 발표 자료로 충분합니다.' });
})();
SIMS.R10={ q:'유량과 수온을 바꾸면 레이놀즈 수와 색소선의 모양(층류 · 난류)은 어떻게 변할까?',
  a:{nm:'유량 Q',min:1,max:35,step:1,val:8,unit:'mL/s',d:0}, b:{nm:'수온 T',min:5,max:60,step:1,val:20,unit:'℃',d:0},
  cap1:'투명 관 속 색소선(노랑). 층류에서는 곧은 직선, 임계 근처에서는 흔들리고, 난류에서는 퍼집니다.',
  cap2:'📊 유량 Q 대 레이놀즈 수 Re — 수온별 직선과 임계값(약 2300, 점선). 뜨거운 물은 같은 유량에서 Re 가 커서 일찍 난류가 됩니다.',
  note:'모형 : 관 지름 8 mm · $Re=\\rho vD/\\mu$ · 점성 $\\mu(T)=2.414\\times10^{-5}\\,10^{247.8/(T_K-140)}$ Pa·s · 임계 Re 는 실험마다 2300 ± 12 % 흔들립니다(주입 · 진동). 입구 모양 · 관 거칠기 무시.',
  anim:function(ctx,w,h,t,Q,T,S){ var o=r10(Q,T,S.seed), x0=24, x1=w-24, cy=h*0.5, hw=h*0.17; ctx.fillStyle='rgba(56,189,248,.12)'; ctx.fillRect(x0,cy-hw,x1-x0,2*hw); cvLine(ctx,[[x0,cy-hw],[x1,cy-hw]],COL.axis2,2.4); cvLine(ctx,[[x0,cy+hw],[x1,cy+hw]],COL.axis2,2.4);
    var turb=o.reg==='난류'?1:(o.reg==='전이'?0.45:0), pts=[], k; for(k=0;k<=80;k++){ var x=k/80, grow=Math.max(0,(x-(turb>0.9?0.25:0.6)))*turb, yy=cy+Math.sin(x*26+t*5)*hw*0.5*grow+Math.sin(x*61-t*8)*hw*0.25*grow; pts.push([x0+x*(x1-x0),yy]); } cvLine(ctx,pts,COL.amber,Math.max(2,2+turb*3.5));
    flowDots(ctx,t,o.v*60,x0,x1,cy-hw+4,cy+hw-4,20,'rgba(186,230,253,.75)'); cvText(ctx,'Re = '+o.Re.toFixed(0)+' → '+o.reg+' (임계 약 '+o.crit.toFixed(0)+')',12,16,turb>0.9?COL.amber:(turb>0?COL.amber:COL.ok),'bold 13px system-ui,sans-serif'); cvText(ctx,'v = '+o.v.toFixed(3)+' m/s · μ = '+(o.mu*1000).toFixed(2)+' mPa·s · 임계 유량 ≈ '+o.qcrit.toFixed(1)+' mL/s',12,h-12,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,Q,T,S){ var o=r10(Q,T,S.seed), A=Math.PI*0.000016, mk=function(tt){ var c=[], k; for(k=0;k<=36;k+=2){ var v=k*1e-6/A; c.push([k,rhoWater(tt)*v*0.008/muW(tt)]); } return c; };
    lineGraph(ctx,w,h,{xmin:0,xmax:36,ymin:0,ymax:9000,xl:'유량 Q (mL/s)',yl:'레이놀즈 수 Re',title:'Q 대 Re — 수온이 높을수록 같은 Q 에서 Re 가 크다',curves:[{pts:mk(10),col:COL.blue,lw:1.8},{pts:mk(T),col:COL.ok,lw:2.4},{pts:mk(50),col:'#fb923c',lw:1.8},{pts:[[0,2300],[36,2300]],col:COL.dim,lw:1.4,dash:[5,4]}],now:[Q,o.Re],legend:[['10 ℃',COL.blue],['지금 '+T+' ℃',COL.ok],['50 ℃','#fb923c']],yd:0,lw:130}); },
  kv:function(Q,T,S){ var o=r10(Q,T,S.seed); return [['속력 v',o.v.toFixed(3)+' m/s','a'],['레이놀즈 수',o.Re.toFixed(0),'g'],['점성 μ',(o.mu*1000).toFixed(2)+' mPa·s','v2'],['흐름 형태',o.reg,'r'],['임계 유량(Re=2300)',o.qcrit.toFixed(1)+' mL/s']]; } };
