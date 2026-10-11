/* ═══════════════════════════════════════════════════════════════════════════
   창의 프로젝트 C06 ~ C10 : 자전거 기어 · 축바퀴 윈치 · 회전판 놀이기구 · 로봇 팔 균형추 · 거꾸로 도는 바퀴 착시
   (손으로 돌리는 낮은 속력 · 작은 질량 · 5 V 이하. 모든 모형은 교육용 어림)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── C06 : 자전거 기어 — 변속비 g = Zf/Zr ────────────────────────── */
function c06(zf,zr,seed){ var rn=rng32(seed*9+2), Rw=0.33, cad=60, tc=25.5, g=zf/zr, v=TAU*Rw*g*cad/60*3.6, Fg=tc*(zr/zf)/Rw, Fhill=70*G*0.05, rows=[], i;
  for(i=0;i<6;i++){ var zz=11+3*i, vv=TAU*Rw*(zf/zz)*cad/60*3.6; rows.push({z:zz,v:vv*(1+0.05*gaussR(rn)),ideal:vv}); }
  return {g:g,v:v,Fg:Fg,Fhill:Fhill,ok:Fg>=Fhill,tw:tc*zr/zf,rows:rows}; }
(function(){ var a=c06(48,16,1), b=c06(48,11,1), c=c06(34,28,1), d=c06(34,11,1);
  mkP({ id:'C06', t:'자전거 기어 설계 — 빠르게 vs 힘 세게', icon:'🚲', type:'창의 · 설계 대회', lv:1, dur:'3 일', cost:'약 1 만 원',
    one:'레고 · 목재 톱니바퀴 또는 자전거 앞뒤 기어 비로 크랭크 한 바퀴당 뒷바퀴 회전수를 재고, 언덕(5 %)을 오를 힘과 속력의 균형을 계산해 최적의 변속비를 고르는 기어 설계 대회를 연다.',
    q:'앞 톱니가 크면 빨라질까 힘이 세질까? 언덕에서는 어떤 기어를 써야 할까? 변속기는 왜 여러 단이 필요할까?',
    why:'<b>기어는 토크와 속력을 맞바꾸는 장치</b>입니다. 힘(토크)을 키우면 속력이 줄고 속력을 키우면 힘이 줄지만 일률 $P=\\tau\\omega$ 는 (손실 빼고) 같다는 것을 체험합니다.',
    link:'원리⑤ 회전 에너지 · 일률(6번 탭) · 도구함 기어비 코드(14번 탭).',
    cap:'앞 기어(Z_f 톱니)와 뒷 기어(Z_r 톱니)를 체인으로 연결하고(가운데) 크랭크 한 바퀴당 뒷바퀴 회전수를 센다(오른쪽). 앞 기어 · 뒷 기어 · 체인 · 크랭크 · 바퀴 · 기록표',
    parts:[['앞 기어','Z_f = 30 ~ 52','자전거 모형 · 레고 톱니','톱니 수를 정확히 센다.'],
           ['뒷 기어','Z_r = 11 ~ 28','같은 모형 · 톱니바퀴','변속비를 바꾼다.'],
           ['체인 · 벨트','연결','체인 · 고무 벨트','장력이 알맞게. 손가락이 끼지 않게 덮개를 한다.'],
           ['크랭크','팔 길이 17 cm','손으로 돌리는 크랭크','손으로 천천히 한 바퀴씩 돌린다.'],
           ['회전수 세기','영상','스티커 + 영상','크랭크 한 바퀴에 뒷바퀴 몇 바퀴인지 센다.'],
           ['기록표','g · 속력','스프레드시트','속력 대 변속비 그래프.']],
    budget:[['톱니바퀴 세트','1','약 6 천 원','—'],['체인 · 벨트','1','약 2 천 원','—'],['목재 판','1','약 2 천 원','—'],['스마트폰','1','보유','—'],['스티커','1','—','—']],
    steps:['앞 기어와 뒷 기어를 연결해 크랭크 1 바퀴당 뒷바퀴 회전수 $Z_f/Z_r$ 를 센다.','Z_r 을 11 ~ 28 로 바꾸며 크랭크 회전율 60 rpm 일 때 속력을 계산한다.','계산한 바퀴 구동력 $F=\\tau_c\\,(Z_r/Z_f)/R_w$ 를 언덕에서 필요한 힘(약 34 N)과 비교한다.','속력 대 Z_r 그래프를 그려 최적의 변속비를 고른다.','가장 알맞은 기어를 고른 이유를 발표한다.'],
    vars:['앞 톱니 Z_f · 뒤 톱니 Z_r','속력 · 바퀴 구동력','크랭크 회전율 · 체인 마찰'],
    predict:[['앞 48 · 뒤 16','속력 '+fx(a.v,1)+' km/h · 구동력 '+fx(a.Fg,0)+' N','g=3.0 → 빠른 쪽'],
             ['앞 48 · 뒤 11','속력 '+fx(b.v,1)+' km/h · 구동력 '+fx(b.Fg,0)+' N','가장 높은 단'],
             ['앞 34 · 뒤 28','속력 '+fx(c.v,1)+' km/h · 구동력 '+fx(c.Fg,0)+' N','낮은 단 — 언덕용'],
             ['앞 34 · 뒤 11','속력 '+fx(d.v,1)+' km/h · 구동력 '+fx(d.Fg,0)+' N','높은 단이라 언덕은 힘들다']],
    data:{cols:['Z_r','속력 측정 (km/h)','이론 (km/h)','차이 (%)'], rows:c06(48,16,1).rows.map(function(q){ return [fx(q.z,0),fx(q.v,1),fx(q.ideal,1),fx((q.v/q.ideal-1)*100,0)]; })},
    analysis:'속력 대 변속비 g 가 원점을 지나는 직선이고 구동력은 1/g 에 비례함을 보인다. $v\\cdot F$ (일률)는 g 와 무관하게 거의 일정함을 확인한다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 변속 시뮬레이터'],['핵심 원리','기어비 · 토크 대 속력'],['제작 조건','손으로 천천히 · 덮개 사용'],['전시 방법','기어 선택 퀴즈'],['안전','손가락이 기어에 끼지 않게 덮개']]],
    fails:[['체인이 빠진다','장력을 맞추고 앞뒤 기어를 같은 평면에 둔다'],['회전수가 정확하지 않다','스티커로 표시하고 영상으로 센다'],['소음이 크다','기어 간격을 조절한다']],
    up:['<b>I02</b> — 변속 토크 측정기.','<b>I08</b> — 자동 기어 선택기.','<b>종합3(17번 탭)</b> — 일률 측정.'],
    next:['원리⑤ 회전 에너지·일률',6],
    eval:[['창의성','기어 구성'],['과학적 설명','토크 대 속력'],['측정','회전수'],['안전','손 끼임 방지']],
    tip:'「속력을 얻으면 힘을 잃는다」는 교환 법칙을 숫자로 증명하세요.' });
})();
SIMS.C06={ q:'앞뒤 톱니 수를 바꾸면 속력과 바퀴 구동력은 어떻게 달라질까?',
  a:{nm:'앞 톱니 Z_f',min:30,max:52,step:2,val:48,unit:'개',d:0}, b:{nm:'뒤 톱니 Z_r',min:11,max:28,step:1,val:16,unit:'개',d:0},
  cap1:'크랭크 60 rpm 으로 돌릴 때 뒷바퀴가 도는 모양. 초록 화살표는 바퀴 구동력, 빨간 선은 언덕(5 %)을 오르는 데 필요한 힘.',
  cap2:'📊 뒤 톱니 수 Z_r 에 따른 속력 — 선은 이론, 점은 측정. 높은 단(작은 Z_r)일수록 빠릅니다.',
  note:'모형 : 체인 손실 무시 · 크랭크 17 cm · 페달 힘 150 N · 바퀴 반지름 0.33 m · 질량 70 kg · 언덕 5 % · 측정 잡음 5 %.',
  anim:function(ctx,w,h,t,zf,zr,S){ var o=c06(zf,zr,S.seed), cx1=w*0.25, cy=h*0.5, r1=zf*0.7, r2=zr*0.7, cx2=cx1+w*0.42, ang=t*1.0*TAU/60*60/ 10, a1=ang, a2=ang*zf/zr;
    drawWheel(ctx,cx1,cy,r1,a1,0.5); drawWheel(ctx,cx2,cy,r2,a2,0.5); cvLine(ctx,[[cx1,cy-r1],[cx2,cy-r2]],COL.dim,1.5); cvLine(ctx,[[cx1,cy+r1],[cx2,cy+r2]],COL.dim,1.5);
    cvText(ctx,'앞 '+zf+'개',cx1,cy+r1+16,COL.tick,'11.5px system-ui,sans-serif','center'); cvText(ctx,'뒤 '+zr+'개',cx2,cy+r2+16,COL.tick,'11.5px system-ui,sans-serif','center');
    cvText(ctx,'변속비 g = '+o.g.toFixed(2)+' · 속력 '+o.v.toFixed(1)+' km/h · 구동력 '+o.Fg.toFixed(0)+' N (필요 '+o.Fhill.toFixed(0)+' N) '+(o.ok?'✅ 오른다':'✗ 힘 부족'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,zf,zr,S){ var o=c06(zf,zr,S.seed), cur=[],k; for(k=11;k<=28;k+=1) cur.push([k,TAU*0.33*(zf/k)*60/60*3.6]);
    lineGraph(ctx,w,h,{xmin:9,xmax:30,ymin:0,ymax:Math.max(20,TAU*0.33*(zf/11)*3.6*1.1),xl:'뒤 톱니 수 Z_r',yl:'속력 (km/h)',title:'Z_r 에 따른 속력 v ∝ 1/Z_r',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.z,q.v]; }),now:[zr,o.v],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:0,lw:90}); },
  kv:function(zf,zr,S){ var o=c06(zf,zr,S.seed); return [['변속비 g',o.g.toFixed(2),'a'],['속력',o.v.toFixed(1)+' km/h','g'],['바퀴 구동력',o.Fg.toFixed(0)+' N','v2'],['언덕 필요',o.Fhill.toFixed(0)+' N','r'],['판정',o.ok?'오를 수 있다':'힘 부족']]; } };

/* ── C07 : 축바퀴 윈치 — F = M g r / R ───────────────────────────── */
function c07(R,r,seed){ var rn=rng32(seed*5+8), M=2, W=M*G, F=W*r/R, rows=[], i;
  for(i=0;i<6;i++){ var RR=8+6*i, FF=W*r/RR; rows.push({R:RR,F:FF*(1+0.05*gaussR(rn))+0.1*gaussR(rn),ideal:FF}); }
  return {W:W,F:F,MA:R/r,ok:F<=15,pull:2*PI*R/100*5,lift:2*PI*r/100*5,rows:rows}; }
(function(){ var a=c07(20,2,1), b=c07(10,2,1), c=c07(30,2,1), d=c07(20,4,1);
  mkP({ id:'C07', t:'축바퀴 윈치 만들기 — 작은 힘으로 무거운 짐 올리기', icon:'🪣', type:'창의 · 설계 대회', lv:1, dur:'1 주', cost:'약 7 천 원',
    one:'굵은 원통(축, 반지름 r)에 감은 줄에 2 kg 추를 매달고, 반지름 R 의 크랭크 손잡이를 돌려 올리는 윈치(축바퀴)를 만들어 필요한 손 힘 $F=Mg\\,r/R$ 를 측정하고 가장 편한 설계를 겨룬다.',
    q:'손잡이를 길게 하면 정말 힘이 줄어들까? 대신 무엇을 잃을까? 축을 가늘게 하면?',
    why:'<b>우물의 두레박 · 닻 감는 윈치 · 자동차 핸들</b>이 모두 축바퀴입니다. 힘이 줄어든 만큼 손이 움직이는 거리가 늘어나 「일은 같다」는 에너지 보존을 눈으로 확인합니다.',
    link:'원리② 토크와 평형(3번 탭) · 원리③ 토크와 τ=Iα(4번 탭).',
    cap:'가는 축(반지름 r)에 줄을 감고 큰 크랭크(반지름 R)로 돌려 추를 올린다(가운데). 용수철 저울로 손 힘을 잰다(오른쪽). 축 · 줄 · 크랭크 · 추 · 용수철 저울 · 기록표',
    parts:[['축(원통)','r = 1 ~ 5 cm','PVC 관 · 종이 심','줄을 감는 원통의 반지름 r 을 잰다.'],
           ['크랭크','R = 8 ~ 40 cm','나무 막대 · 손잡이','축에 단단히 고정한다.'],
           ['줄 · 추','M = 2 kg','나일론 줄 · 물병 추','줄이 풀리지 않게. 추 아래에 사람이 없게.'],
           ['받침대','틀','나무 틀 · 책상 고정','단단히 고정하고 안정성을 확인.'],
           ['용수철 저울','손 힘 F','0 ~ 20 N 저울','크랭크 끝에서 직각으로 당긴다.'],
           ['기록표','R · F','스프레드시트','F 대 1/R 그래프.']],
    budget:[['PVC 관 · 나무 막대','1 세트','약 4 천 원','—'],['줄 · 물병 추','1','약 1 천 원','—'],['받침대 재료','1','약 2 천 원','—'],['용수철 저울','1','학교 보유','—'],['장갑','1','—','—']],
    steps:['틀에 축을 고정하고 줄을 감은 뒤 2 kg 추를 매단다.','크랭크 길이를 R = 8 ~ 38 cm 로 바꿔 가며 추를 등속으로 올릴 때의 힘 F 를 용수철 저울로 잰다.','축 반지름 r 을 바꿔(2 → 4 cm) 반복한다.','F 대 1/R 그래프의 기울기가 $Mg\\,r$ 인지 확인한다.','손이 움직인 거리와 추가 올라간 높이의 비 $R/r$ 도 잰다.'],
    vars:['크랭크 반지름 R · 축 반지름 r','필요한 손 힘 F','마찰 · 줄 두께 · 추 높이'],
    predict:[['R = 20 · r = 2 cm','F = '+fx(a.F,1)+' N · 이득 '+fx(a.MA,0)+' 배','$F=Mg\\,r/R$'],
             ['R = 10 · r = 2 cm','F = '+fx(b.F,1)+' N','크랭크가 짧으면 힘이 크다'],
             ['R = 30 · r = 2 cm','F = '+fx(c.F,1)+' N','긴 크랭크는 편하지만 돌릴 거리가 늘어난다'],
             ['R = 20 · r = 4 cm','F = '+fx(d.F,1)+' N','축이 굵으면 힘이 2 배']],
    data:{cols:['R (cm)','F 측정 (N)','이론 (N)','차이 (%)'], rows:c07(20,2,1).rows.map(function(q){ return [fx(q.R,0),fx(q.F,2),fx(q.ideal,2),fx((q.F/q.ideal-1)*100,0)]; })},
    analysis:'F 대 1/R 이 원점을 지나는 직선인지 보고 기울기가 $Mgr$ 와 같은지 본다. 일 $F\\cdot2\\pi R$ 와 $Mg\\cdot2\\pi r$ 이 같음(마찰 손실 제외)을 확인해 에너지 보존을 논의한다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 윈치'],['핵심 원리','축바퀴 · 토크 · 에너지 보존'],['제작 조건','추 2 kg 이하 · 안정성 확인'],['전시 방법','F 대 R 그래프'],['안전','추 아래 접근 금지 · 장갑']]],
    fails:[['줄이 겹쳐 감긴다','축에 홈을 파거나 줄 한 줄로 감는다'],['크랭크가 헛돈다','축에 크랭크를 단단히 고정한다'],['저울 값이 들쭉날쭉','등속으로 천천히 돌리며 읽는다']],
    up:['<b>R03</b> — 관성 모멘트와 도르래.','<b>I07</b> — 안전 제동 윈치.','<b>C05</b> — 렌치 부스.'],
    next:['원리② 토크와 평형',3],
    eval:[['창의성','윈치 구성'],['과학적 설명','F=Mgr/R'],['측정','F 대 1/R'],['안전','추 낙하 방지']],
    tip:'「힘 × 거리」를 양쪽에서 곱해 같음을 보이면 에너지 보존까지 연결됩니다.' });
})();
SIMS.C07={ q:'크랭크와 축의 반지름을 바꾸면 추를 올리는 데 필요한 힘은 얼마나 달라질까?',
  a:{nm:'크랭크 반지름 R',min:8,max:40,step:2,val:20,unit:'cm',d:0}, b:{nm:'축 반지름 r',min:1,max:5,step:0.5,val:2,unit:'cm',d:1},
  cap1:'2 kg 추를 올리는 윈치. 이득 R/r 이 클수록 손 힘은 작지만 손이 움직이는 거리가 늘어납니다.',
  cap2:'📊 크랭크 반지름 R 에 따른 필요한 손 힘 — 이론(곡선)과 측정(점). 점선은 편한 한계 15 N.',
  note:'모형 : 마찰 · 줄 두께 무시 · 등속으로 올림 · 추 2 kg · 측정 잡음 5 %.',
  anim:function(ctx,w,h,t,R,r,S){ var o=c07(R,r,S.seed), cx=w*0.35, cy=h*0.38, sc=Math.min(h*0.012,w*0.006), ang=t*1.2, hh=(ang*r/6)*sc*10%(h*0.4);
    drawWheel(ctx,cx,cy,r*sc*3,ang,0.5); var hx=cx+R*sc*Math.cos(ang), hy=cy+R*sc*Math.sin(ang); cvLine(ctx,[[cx,cy],[hx,hy]],COL.tick,4); cvCirc(ctx,hx,hy,6,COL.amber,COL.white,1.2); cvArrow(ctx,hx,hy,hx-Math.sin(ang)*o.F*3,hy+Math.cos(ang)*o.F*3,COL.ok,2.4);
    var ry=cy+r*sc*3+10+ hh; cvLine(ctx,[[cx+r*sc*3,cy],[cx+r*sc*3,ry]],COL.dim,1.5); cvRect(ctx,cx+r*sc*3-14,ry,28,22,COL.grav,COL.white,1.2); cvText(ctx,'2 kg',cx+r*sc*3,ry+11,'#07101f','bold 10.5px system-ui,sans-serif','center');
    cvText(ctx,'F = '+o.F.toFixed(1)+' N · 이득 R/r = '+o.MA.toFixed(1)+' · '+(o.ok?'편하다':'힘이 든다'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.58,h*0.3,w*0.38,h*0.45,[['추 무게 Mg',o.W,COL.grav],['손 힘 F',o.F,COL.ok]],o.W*1.1,' N'); },
  graph:function(ctx,w,h,R,r,S){ var o=c07(R,r,S.seed), cur=[],k; for(k=8;k<=40;k+=1) cur.push([k,o.W*r/k]);
    lineGraph(ctx,w,h,{xmin:6,xmax:42,ymin:0,ymax:Math.max(10,o.W*r/8*1.1),xl:'크랭크 반지름 R (cm)',yl:'손 힘 F (N)',title:'R 에 따른 손 힘 F ∝ 1/R',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[6,15],[42,15]],col:COL.grav,lw:1.2,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.R,q.F*r/2]; }),now:[R,o.F],legend:[['이론',COL.ok],['편한 한계 15 N',COL.grav],['측정(r 환산)',COL.blue],['지금',COL.amber]],yd:1,lw:140}); },
  kv:function(R,r,S){ var o=c07(R,r,S.seed); return [['추 무게 Mg',o.W.toFixed(1)+' N','a'],['손 힘 F',o.F.toFixed(1)+' N','g'],['이득 R/r',o.MA.toFixed(1)+' 배','v2'],['손이 움직이는 거리',(o.pull*100).toFixed(0)+' cm / 5 회전','r'],['추가 올라간 높이',(o.lift*100).toFixed(0)+' cm']]; } };

/* ── C08 : 회전판 놀이기구 — ω_max = √(μ g / r) ───────────────── */
function c08(r,mu,seed){ var rn=rng32(seed*7+1), wm=Math.sqrt(mu*G/(r/100)), rows=[], i;
  for(i=0;i<6;i++){ var rr=4+3*i, w=Math.sqrt(mu*G/(rr/100)); rows.push({r:rr,rpm:w2rpm(w)*(1+0.06*gaussR(rn)),ideal:w2rpm(w)}); }
  return {wm:wm,rpm:w2rpm(wm),ac:wm*wm*r/100,v:wm*r/100,rows:rows,safe:w2rpm(wm)>=30}; }
(function(){ var a=c08(10,0.4,1), b=c08(5,0.4,1), c=c08(15,0.4,1), d=c08(10,0.7,1);
  mkP({ id:'C08', t:'회전판 놀이기구 설계 — 미끄러지기 전 최대 속도', icon:'🎠', type:'창의 · 설계 대회', lv:1, dur:'3 일', cost:'약 5 천 원',
    one:'손으로 천천히 돌리는 회전판(턴테이블) 위에 동전을 반지름 r 에 놓고 판을 서서히 가속해 동전이 미끄러지기 시작하는 회전수를 재고, $\\omega_{max}=\\sqrt{\\mu g/r}$ 와 비교하는 「안전한 놀이기구」 설계 대회를 연다.',
    q:'가장자리에 놓은 동전이 먼저 날아갈까? 판 표면을 거칠게 하면 얼마나 빨리 돌릴 수 있을까? 놀이기구의 안전선은?',
    why:'<b>회전 놀이기구에서 사람이 안 미끄러지는 것은 마찰이 구심력을 주기 때문</b>입니다. 안전한 속력의 한계를 계산으로 예측하고 실험으로 확인하는 것은 공학 설계의 기초입니다.',
    link:'원리① 각운동학(2번 탭) $a_c=r\\omega^2$ · 원리② 토크와 평형.',
    cap:'회전판 위에 동전을 r 에 놓고(가운데) 판을 서서히 가속해 동전이 미끄러지는 순간의 회전수를 영상으로 잰다(오른쪽). 회전판 · 동전 · 반지름 표시 · 스마트폰 · 기록표',
    parts:[['회전판','반지름 20 cm','LP 턴테이블 · 레이저 디스크 · 손 회전 판','판은 평평하고 중심이 고정되어야 한다.'],
           ['동전','같은 동전','지폐 대신 동전 5 개','질량이 달라도 미끄러지는 회전수는 같다.'],
           ['표면 재료','μ 변화','종이 · 고무 · 사포','표면을 바꿔 μ 를 비교한다.'],
           ['회전 속도 측정','rpm','영상 슬로 모션 · 앱','회전 한 바퀴 시간을 센다.'],
           ['동전 보호','안전','투명 덮개','날아간 동전에 맞지 않도록 덮개를 쓴다.'],
           ['기록표','r · rpm','스프레드시트','r 대 rpm 그래프.']],
    budget:[['회전판(중고 턴테이블)','1','약 3 천 원','—'],['동전 · 고무 시트','1','약 1 천 원','—'],['사포 · 종이','1','약 1 천 원','—'],['스마트폰','1','보유','—'],['투명 덮개','1','—','—']],
    steps:['판 표면(종이, μ ≈ 0.4)에서 동전을 r = 4, 7, 10, 13, 16 cm 에 놓는다.','판을 서서히 가속해 동전이 미끄러지는 순간의 회전수를 영상으로 재어 rpm 을 구한다.','표면을 고무(μ ≈ 0.7)로 바꿔 다시 잰다.','rpm 대 $1/\\sqrt{r}$ 가 직선인지 확인한다.','놀이기구의 안전 속도를 정해(예: 30 rpm) 안전 여유를 계산한다.'],
    vars:['놓은 반지름 r · 표면 마찰 계수 μ','미끄러지는 회전수 rpm','가속 속도 · 판의 기울어짐 · 먼지'],
    predict:[['r = 10 cm · μ = 0.4',''+fx(a.rpm,0)+' rpm에서 미끄러짐','$\\omega_{max}=\\sqrt{\\mu g/r}$'],
             ['r = 5 cm · μ = 0.4',''+fx(b.rpm,0)+' rpm','안쪽일수록 더 빨리 돌려야 미끄러진다'],
             ['r = 15 cm · μ = 0.4',''+fx(c.rpm,0)+' rpm','바깥쪽이 먼저 미끄러진다'],
             ['r = 10 cm · μ = 0.7',''+fx(d.rpm,0)+' rpm','μ 가 크면 더 빨리 돌려도 안전']],
    data:{cols:['r (cm)','rpm 측정','이론 rpm','차이 (%)'], rows:c08(10,0.4,1).rows.map(function(q){ return [fx(q.r,0),fx(q.rpm,0),fx(q.ideal,0),fx((q.rpm/q.ideal-1)*100,0)]; })},
    analysis:'미끄러지는 회전수 대 $1/\\sqrt{r}$ 가 원점을 지나는 직선이고 기울기가 $\\tfrac{60}{2\\pi}\\sqrt{\\mu g}$ 인지 확인한다. 정지 마찰 계수 μ 는 기울어진 판에서 미끄러지는 각도로 따로 측정해 비교한다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 놀이기구'],['핵심 원리','구심력 · 마찰'],['제작 조건','회전 속도 한도 60 rpm 이하'],['전시 방법','실험 시연 + 안전 설계'],['안전','투명 덮개 · 학생 접근 제한']]],
    fails:[['모든 동전이 동시에 날아간다','가속을 서서히 하고 반지름 구분을 확실히'],['rpm 측정이 어렵다','판에 스티커를 붙이고 영상으로 센다'],['판이 흔들린다','판 중심 축을 수직으로 고정한다']],
    up:['<b>R02</b> — 문 열기 정량.','<b>I03</b> — 속도 경고기.','<b>C10</b> — 착시 전시.'],
    next:['원리① 각운동학',2],
    eval:[['창의성','놀이기구 구성'],['과학적 설명','마찰이 구심력'],['측정','rpm 읽기'],['안전','비산 방지']],
    tip:'안전 속도(예: 30 rpm)까지 얼마나 여유가 있는지 계산해 안내판에 쓰세요.' });
})();
SIMS.C08={ q:'동전을 놓는 위치와 판의 마찰을 바꾸면 몇 rpm 에서 미끄러질까?',
  a:{nm:'놓은 반지름 r',min:3,max:20,step:1,val:10,unit:'cm',d:0}, b:{nm:'마찰 계수 μ',min:0.2,max:0.9,step:0.05,val:0.4,unit:'',d:2},
  cap1:'판이 서서히 빨라지다가 구심력이 최대 정지 마찰력 μmg 를 넘으면 동전이 바깥으로 미끄러집니다.',
  cap2:'📊 놓은 반지름 r 에 따른 미끄러지는 회전수 — 이론(선), 측정(점). 점선은 안전 속도 30 rpm.',
  note:'모형 : 정지 마찰 계수 μ 일정 · 판이 서서히 가속 · 동전은 점 질량 · 측정 잡음 6 %.',
  anim:function(ctx,w,h,t,r,mu,S){ var o=c08(r,mu,S.seed), cx=w*0.3, cy=h*0.52, R=Math.min(h*0.4,w*0.22), sc=R/20, Tm=Math.max(o.wm*1.4/0.5,1), tc=t%(Tm+2), om=Math.min(tc*0.5,o.wm*1.4), slip=om>=o.wm, th=0.5*0.5*Math.min(tc,Tm)*Math.min(tc,Tm);
    ctx.fillStyle='rgba(148,163,184,.3)'; ctx.beginPath(); ctx.arc(cx,cy,R,0,TAU); ctx.fill(); ctx.strokeStyle=COL.white; ctx.stroke(); cvLine(ctx,[[cx,cy],[cx+R*Math.cos(th),cy+R*Math.sin(th)]],COL.dim,1);
    var rr=r*sc*(slip? 1+(om-o.wm)*0.5:1); var px=cx+rr*Math.cos(th), py=cy+rr*Math.sin(th); cvCirc(ctx,px,py,6,slip?COL.grav:COL.amber,COL.white,1.2);
    cvText(ctx,'ω = '+om.toFixed(2)+' rad/s ('+w2rpm(om).toFixed(0)+' rpm) '+(slip?'→ 미끄러진다!':'→ 붙어 있다'),12,16,slip?COL.grav:COL.ok,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.56,h*0.28,w*0.4,h*0.5,[['한계 rpm',o.rpm,COL.blue],['지금 rpm',w2rpm(om),slip?COL.grav:COL.ok],['안전 30',30,COL.dim]],Math.max(o.rpm,40)*1.1,''); },
  graph:function(ctx,w,h,r,mu,S){ var o=c08(r,mu,S.seed), cur=[],k; for(k=3;k<=20;k+=1) cur.push([k,w2rpm(Math.sqrt(mu*G/(k/100)))]);
    lineGraph(ctx,w,h,{xmin:2,xmax:21,ymin:0,ymax:Math.max(80,cur[0][1]*1.1),xl:'놓은 반지름 r (cm)',yl:'미끄러지는 회전수 (rpm)',title:'r 에 따른 한계 회전수 ∝ 1/√r',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[2,30],[21,30]],col:COL.grav,lw:1.2,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.r,q.rpm*Math.sqrt(mu/0.4)]; }),now:[r,o.rpm],legend:[['이론',COL.ok],['안전 30 rpm',COL.grav],['측정',COL.blue],['지금',COL.amber]],yd:0,lw:120}); },
  kv:function(r,mu,S){ var o=c08(r,mu,S.seed); return [['한계 각속도',o.wm.toFixed(2)+' rad/s','a'],['한계 rpm',o.rpm.toFixed(0)+' rpm','g'],['그때의 가장자리 속력',o.v.toFixed(2)+' m/s','v2'],['구심 가속도',o.ac.toFixed(2)+' m/s²','r'],['30 rpm 에서',o.safe?'미끄러지지 않음':'미끄러진다']]; } };

/* ── C09 : 로봇 팔 균형추 — τ_m = g (m L − m_c d) ──────────────── */
function c09(m,d,seed){ var rn=rng32(seed*11+4), L=30, mc=200, tau=(m*L-mc*d)*0.098/ (1)*1, ds=m*L/mc, rows=[], i;
  for(i=0;i<6;i++){ var mm=50+50*i, dd=mm*L/mc; rows.push({m:mm,d:Math.max(0,dd+0.5*gaussR(rn)),ideal:dd}); }
  return {tau:Math.abs(tau),sgn:tau>=0?1:-1,ds:ds,tau0:m*L*0.098,save:(1-Math.abs(tau)/Math.max(1,m*L*0.098)),ok:ds<=40,rows:rows}; }
(function(){ var a=c09(150,22.5,1), b=c09(150,0,1), c=c09(250,22.5,1), d=c09(300,40,1);
  mkP({ id:'C09', t:'로봇 팔 균형추 — 작은 모터로 들어 올리기', icon:'🦾', type:'창의 · 설계 대회', lv:2, dur:'1 주', cost:'약 1 만 5 천 원',
    one:'5 V 소형 서보(또는 손)로 움직이는 팔(길이 30 cm) 끝의 하중 m 과 반대쪽 균형추 200 g 을 거리 d 에 두어 모터가 감당할 토크를 줄이는 설계를 예측하고 측정해 겨룬다.',
    q:'균형추를 달면 모터 힘이 얼마나 줄까? 완전히 균형이면 모터는 힘이 필요 없을까? 균형추가 너무 무거우면?',
    why:'<b>크레인 · 로봇 팔 · 접이식 램프</b>는 균형추로 모터 부담을 줄입니다. 토크 평형을 응용한 대표적인 공학 설계입니다.',
    link:'원리② 토크와 평형(3번 탭) · C01 모빌 · R01 지렛대.',
    cap:'받침축에서 오른쪽으로 하중 m(팔 30 cm), 왼쪽에 균형추 200 g 을 거리 d 에 둔다(가운데). 서보에 걸리는 토크를 용수철 저울로 잰다(오른쪽). 팔 · 서보 · 하중 · 균형추 · 저울 · 기록표',
    parts:[['팔(막대)','길이 30 cm','알루미늄 막대 · 나무 막대','받침 축에 마찰이 적게.'],
           ['받침 축','회전 축','볼트 · 베어링 대용','팔이 자유롭게 돈다.'],
           ['하중','50 ~ 300 g','동전 · 추','팔 끝에 매단다.'],
           ['균형추','200 g','납 추 대신 동전 묶음','거리 d 를 조절한다.'],
           ['서보 · 저울','토크 측정','5 V 서보 또는 손','저울을 팔 끝에 걸어 힘을 읽는다.'],
           ['기록표','m · d · τ','스프레드시트','d 대 토크 그래프.']],
    budget:[['막대 · 볼트','1 세트','약 4 천 원','—'],['동전 · 추','1 세트','약 2 천 원','—'],['용수철 저울','1','학교 보유','—'],['5 V 서보(선택)','1','약 6 천 원','—'],['받침대','1','약 3 천 원','—']],
    steps:['팔의 받침 축을 고정하고 하중 m = 150 g 을 오른쪽 30 cm 에 단다.','균형추 200 g 을 왼쪽 d = 0, 10, 20, 30 cm 에 두고 팔을 수평으로 잡는 데 필요한 힘을 잰다.','토크 $\\tau=g(mL-m_cd)$ 의 부호가 바뀌는 d 가 균형 위치임을 확인한다.','하중 m 을 바꿔 균형 거리 d* 가 m 에 비례하는지 본다.','균형추를 쓴 경우 서보가 감당할 토크가 몇 % 줄었는지 보고한다.'],
    vars:['하중 m · 균형추 거리 d','서보가 필요한 토크','팔 자체 무게 · 마찰'],
    predict:[['m = 150 g · d = 22.5 cm','토크 ≈ '+fx(a.tau,1)+' mN·m (거의 0)','$d^*=mL/m_c=22.5$ cm'],
             ['m = 150 g · d = 0','토크 ≈ '+fx(b.tau,0)+' mN·m','균형추가 축에 있으면 효과 없음'],
             ['m = 250 g · d = 22.5 cm','토크 ≈ '+fx(c.tau,0)+' mN·m','하중이 늘면 d 도 늘려야'],
             ['m = 300 g · d = 40 cm','토크 ≈ '+fx(d.tau,0)+' mN·m','균형추를 많이 옮긴 경우']],
    data:{cols:['m (g)','d* 측정 (cm)','이론 (cm)','차이 (cm)'], rows:c09(150,22.5,1).rows.map(function(q){ return [fx(q.m,0),fx(q.d,1),fx(q.ideal,1),fx(q.d-q.ideal,1)]; })},
    analysis:'d* 대 m 이 원점을 지나는 직선이며 기울기가 $L/m_c$ 인지 확인한다. 팔 자체 무게(질량 m_a, 무게중심 L/2)가 있으면 $d^*=\\dfrac{mL+m_aL/2}{m_c}$ 로 보정한다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 균형 로봇 팔'],['핵심 원리','토크 평형'],['제작 조건','5 V 서보 이하'],['전시 방법','균형추 위치 퀴즈'],['안전','팔이 갑자기 떨어지지 않게 지지대']]],
    fails:[['팔이 축에서 헛돈다','축과 팔의 마찰을 줄이고 볼트를 점검'],['균형이 맞지 않는다','팔 자체 무게를 보정에 넣는다'],['저울 값이 흔들린다','팔을 가볍게 잡고 값을 읽는다']],
    up:['<b>I01</b> — 토크 렌치 모형.','<b>I05</b> — 반작용 휠.','<b>C01</b> — 균형 모빌.'],
    next:['원리② 토크와 평형',3],
    eval:[['창의성','균형 구조'],['과학적 설명','토크 평형'],['측정','토크 측정'],['안전','낙하 방지']],
    tip:'균형 위치 d* 를 먼저 계산해 놓고 실험으로 확인하세요.' });
})();
SIMS.C09={ q:'하중과 균형추 위치를 바꾸면 모터가 감당할 토크는 얼마나 줄어들까?',
  a:{nm:'하중 m',min:50,max:300,step:10,val:150,unit:'g',d:0}, b:{nm:'균형추 거리 d',min:0,max:40,step:0.5,val:22.5,unit:'cm',d:1},
  cap1:'팔 끝 하중 m(오른쪽, 30 cm)과 왼쪽 균형추 200 g(거리 d). 균형일 때 모터에 거의 힘이 걸리지 않습니다.',
  cap2:'📊 균형추 거리 d 에 따른 필요한 모터 토크 — d* 에서 0 이 됩니다.',
  note:'모형 : 팔 자체 질량 무시 · 균형추 200 g · 팔 길이 30 cm · 마찰 무시 · 토크는 mN·m.',
  anim:function(ctx,w,h,t,m,d,S){ var o=c09(m,d,S.seed), cx=w*0.5, cy=h*0.5, sc=w*0.011, tilt=-o.sgn*Math.min(0.25,o.tau*0.001);
    drawPivot(ctx,cx,cy+2,12); ctx.save(); ctx.translate(cx,cy); ctx.rotate(tilt); drawBeam(ctx,-40*sc,0,30*sc,0,6,COL.tick);
    var sm=Math.min(36,12+m*0.08); cvLine(ctx,[[30*sc,0],[30*sc,16]],COL.dim,1); cvRect(ctx,30*sc-sm/2,16,sm,sm*0.7,COL.grav,COL.white,1.2); cvText(ctx,m+' g',30*sc,16+sm*0.35,'#07101f','bold 10px system-ui,sans-serif','center');
    cvLine(ctx,[[-d*sc,0],[-d*sc,16]],COL.dim,1); cvRect(ctx,-d*sc-18,16,36,24,COL.blue,COL.white,1.2); cvText(ctx,'200 g',-d*sc,28,'#07101f','bold 10px system-ui,sans-serif','center'); ctx.restore();
    cvText(ctx,'균형 위치 d* = '+o.ds.toFixed(1)+' cm · 필요 토크 '+o.tau.toFixed(1)+' mN·m '+(o.tau<5?'✅ 거의 균형':'→ 모터가 힘을 써야'),12,16,o.tau<5?COL.ok:COL.amber,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.1,h*0.75,w*0.8,h*0.2,[['균형추 없을 때',o.tau0,COL.dim],['지금',o.tau,o.tau<5?COL.ok:COL.blue]],Math.max(1,o.tau0)*1.1,' mN·m'); },
  graph:function(ctx,w,h,m,d,S){ var cur=[],k, mx=Math.max(1,(m*30)*0.098)*1.1; for(k=0;k<=40;k+=1) cur.push([k,Math.abs((m*30-200*k)*0.098)]);
    lineGraph(ctx,w,h,{xmin:0,xmax:41,ymin:0,ymax:Math.max(mx,(200*40-m*30)*0.098*1.05),xl:'균형추 거리 d (cm)',yl:'필요한 모터 토크 (mN·m)',title:'d 에 따른 토크 |g(mL − m_c d)|',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[c09(m,d,S.seed).ds,0],[c09(m,d,S.seed).ds,mx]],col:COL.grav,lw:1.2,dash:[4,3]}],now:[d,c09(m,d,S.seed).tau],legend:[['토크',COL.ok],['d*',COL.grav],['지금',COL.amber]],yd:0,lw:90}); },
  kv:function(m,d,S){ var o=c09(m,d,S.seed); return [['균형 위치 d*',o.ds.toFixed(1)+' cm','a'],['균형추 없을 때',o.tau0.toFixed(0)+' mN·m','g'],['지금 필요 토크',o.tau.toFixed(1)+' mN·m','v2'],['줄어든 비율',(Math.max(0,o.save)*100).toFixed(0)+' %','r'],['판정',o.ok?'균형 가능':'d* 가 한계 초과']]; } };

/* ── C10 : 거꾸로 도는 바퀴 착시 — 겉보기 회전수 ─────────────────── */
function c10(fr,fs,seed){ var rn=rng32(seed*13+6), N=6, step=fr/fs*360, d=((step+180/N)%(360/N)+(360/N))%(360/N)-180/N, fa=d/360*fs, rows=[], i;
  for(i=0;i<6;i++){ var ff=1+1.8*i, st=ff/fs*360, dd=((st+180/N)%(360/N)+(360/N))%(360/N)-180/N, fap=dd/360*fs; rows.push({f:ff,app:fap+0.05*gaussR(rn),ideal:fap}); }
  return {step:step,d:d,fa:fa,N:N,dir:fa>0.01?'앞으로':(fa<-0.01?'거꾸로':'멈춘 것처럼'),rows:rows}; }
(function(){ var a=c10(4,30,1), b=c10(5,6,1), c=c10(5,5,1), d=c10(10,30,1);
  mkP({ id:'C10', t:'거꾸로 도는 바퀴 착시 전시 — 스트로보와 영상 프레임', icon:'🎡', type:'창의 · 설계 대회', lv:2, dur:'1 주', cost:'약 1 만 원',
    one:'6 개의 살이 있는 바퀴를 손이나 5 V 소형 팬으로 돌리고 LED 를 f_s 로 깜박이거나 영상 프레임률로 촬영해, 바퀴가 멈춰 보이거나 거꾸로 도는 것처럼 보이는 조건을 겉보기 회전수 식으로 예측하는 전시를 설계한다.',
    q:'바퀴가 멈춰 보이는 회전수는? 조금 더 빨리 돌리면 왜 거꾸로 돌까? 살이 6 개일 때 그림이 반복되는 각은?',
    why:'<b>영화 속 마차 바퀴가 거꾸로 도는 현상(왜건 휠 효과)</b>은 샘플링과 앨리어싱의 대표 예입니다. 회전운동과 주기 개념을 시각적으로 이해시키는 효과적인 전시입니다.',
    link:'원리① 각운동학(2번 탭) · 도구함 영상 분석(14번 탭).',
    cap:'6 개 살 바퀴(왼쪽)를 LED 스트로보 f_s 로 비추거나 카메라 프레임률로 촬영(가운데)해 겉보기 회전을 본다(오른쪽). 바퀴 · LED(5 V) · 타이머 · 스마트폰 · 기록표',
    parts:[['6 살 바퀴','N = 6','종이 원판 · 팬 날개','살 하나에 색 표시를 한다.'],
           ['스트로보 LED','f_s = 5 ~ 30 Hz','5 V LED + 타이머 보드','번쩍임이 눈에 해롭지 않게 낮은 주파수 · 광과민성 주의.'],
           ['회전 측정','f_r 정확히','영상 프레임 수','진짜 회전수는 고속 영상으로 센다.'],
           ['영상 촬영','프레임률 30/60','스마트폰','프레임률을 바꿔 찍어 비교한다.'],
           ['암실','어두운 방','블라인드','스트로보 효과가 잘 보이게.'],
           ['기록표','f_r · f_s · 겉보기','스프레드시트','겉보기 회전수 그래프.']],
    budget:[['종이 원판 · 팬','1','약 2 천 원','—'],['LED · 타이머 보드','1','약 5 천 원','—'],['전원(5 V)','1','약 2 천 원','—'],['스마트폰','1','보유','—'],['암막 천','1','—','—']],
    steps:['안전 확인(광과민성 주의 안내, 낮은 주파수만 사용). 바퀴의 진짜 회전수 f_r 를 정한다.','LED 를 f_s = 30 Hz 로 깜박이며 f_r 를 천천히 올려 가며 겉보기 회전을 본다.','$f_r=n f_s/N$ 일 때 멈춰 보이는 것을 확인한다.','f_r 를 그보다 조금 키우거나 줄여 앞으로·뒤로 도는 속도를 잰다.','겉보기 f_app 대 f_r 그래프(톱니 모양)를 그린다.'],
    vars:['진짜 회전수 f_r · 스트로보 f_s','겉보기 회전수 f_app','살 개수 N · 영상 프레임률'],
    predict:[['f_r = 4 · f_s = 30 Hz','f_app ≈ '+fx(a.fa,2)+' Hz ('+a.dir+')','샘플 간 회전각 48° → 60° 주기'],
             ['f_r = 5 · f_s = 6 Hz','f_app ≈ '+fx(b.fa,2)+' Hz ('+b.dir+')','샘플 간 회전각 300° ≡ −60°'],
             ['f_r = 5 · f_s = 5 Hz','f_app ≈ '+fx(c.fa,2)+' Hz ('+c.dir+')','한 바퀴를 돌고 다시 찍는다'],
             ['f_r = 10 · f_s = 30 Hz','f_app ≈ '+fx(d.fa,2)+' Hz ('+d.dir+')','60° × 2 → 정지처럼']],
    data:{cols:['f_r (Hz)','f_app 측정 (Hz)','이론 (Hz)','차이 (Hz)'], rows:c10(4,30,1).rows.map(function(q){ return [fx(q.f,1),fx(q.app,2),fx(q.ideal,2),fx(q.app-q.ideal,2)]; })},
    analysis:'f_app 대 f_r 그래프가 톱니 모양(주기 f_s/N)임을 확인한다. 살이 N 개일 때 그림이 반복되는 각은 360°/N 이므로 샘플링 각 $\\theta=360f_r/f_s$ 를 이 주기에서 나머지로 줄여 겉보기 속도를 구한다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 착시 바퀴'],['핵심 원리','샘플링 · 앨리어싱'],['제작 조건','5 V 이하 · 낮은 주파수'],['전시 방법','스트로보 조절 · 영상 비교'],['안전','광과민성 안내문 게시 · 15 Hz 이하']]],
    fails:[['착시가 잘 안 보인다','방을 어둡게 하고 살에 표시를 한다'],['f_r 를 정확히 모른다','고속 영상으로 한 바퀴 프레임 수를 센다'],['눈이 피로하다','스트로보를 쉬고 짧게 보여 준다']],
    up:['<b>I03</b> — 회전수 센서.','<b>C08</b> — 회전판 놀이기구.','<b>종합3(17번 탭)</b> — 영상 분석.'],
    next:['원리① 각운동학',2],
    eval:[['창의성','전시 구성'],['과학적 설명','샘플링'],['측정','f_r 정확성'],['안전','광과민성 주의']],
    tip:'광과민성 발작을 막기 위해 깜박임은 늘 낮고 짧게, 안내문은 반드시 붙이세요.' });
})();
SIMS.C10={ q:'바퀴의 진짜 회전수와 스트로보 주파수를 바꾸면 바퀴는 어떻게 보일까?',
  a:{nm:'진짜 회전수 f_r',min:0.5,max:12,step:0.5,val:4,unit:'Hz',d:1}, b:{nm:'스트로보 f_s',min:5,max:30,step:1,val:30,unit:'Hz',d:0},
  cap1:'왼쪽은 진짜 회전, 오른쪽은 f_s 로 찍은 겉보기 회전입니다. 6 개 살의 그림은 60° 마다 반복되므로 샘플 간 각이 60° 의 배수이면 멈춘 것처럼 보입니다.',
  cap2:'📊 진짜 회전수 f_r 에 따른 겉보기 회전수 — 톱니 모양(주기 f_s/6). 0 이면 정지처럼 보임.',
  note:'모형 : 살 6 개 · 이상적 순간 샘플 · 빛 번쩍임 주파수 f_s · 안전을 위해 f_s ≤ 30 Hz(광과민성 주의 안내 필수). 측정 잡음은 0.05 Hz.',
  anim:function(ctx,w,h,t,fr,fs,S){ var o=c10(fr,fs,S.seed), cx1=w*0.22, cx2=w*0.62, cy=h*0.5, R=Math.min(h*0.34,w*0.14);
    function wheel(cx,ang){ ctx.strokeStyle='rgba(203,213,225,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(cx,cy,R,0,TAU); ctx.stroke(); ctx.lineWidth=2; for(var i=0;i<o.N;i++){ var a=ang+i*TAU/o.N; ctx.strokeStyle=i==0?'#fbbf24':'rgba(148,163,184,.8)'; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+R*Math.cos(a),cy-R*Math.sin(a)); ctx.stroke(); } ctx.lineWidth=1; }
    var slow=t*0.2; wheel(cx1,-TAU*fr*slow); wheel(cx2,TAU*o.fa*slow); cvText(ctx,'진짜 (느리게 보기) f_r = '+fr+' Hz',cx1,cy+R+20,COL.tick,'11.5px system-ui,sans-serif','center'); cvText(ctx,'겉보기 f_app = '+o.fa.toFixed(2)+' Hz ('+o.dir+')',cx2,cy+R+20,COL.ok,'bold 11.5px system-ui,sans-serif','center');
    cvText(ctx,'샘플 간 회전각 = '+(o.step%360).toFixed(0)+'° · 60° 주기 환산 = '+o.d.toFixed(1)+'°',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,fr,fs,S){ var o=c10(fr,fs,S.seed), cur=[],k; for(k=0.1;k<=12;k+=0.1){ cur.push([k,c10(k,fs,S.seed).fa]); }
    lineGraph(ctx,w,h,{xmin:0,xmax:12.5,ymin:-fs/12-0.5,ymax:fs/12+0.5,xl:'진짜 회전수 f_r (Hz)',yl:'겉보기 회전수 f_app (Hz)',title:'f_r 에 따른 겉보기 회전수 (톱니 모양)',curves:[{pts:cur,col:COL.ok,lw:1.8},{pts:[[0,0],[12.5,0]],col:COL.dim,lw:1,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.f,q.app]; }),now:[fr,o.fa],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:1,lw:90}); },
  kv:function(fr,fs,S){ var o=c10(fr,fs,S.seed); return [['샘플 간 회전각',(o.step%360).toFixed(0)+'°','a'],['60° 주기 환산',o.d.toFixed(1)+'°','g'],['겉보기 f_app',o.fa.toFixed(2)+' Hz','v2'],['보이는 방향',o.dir,'r'],['정지 조건 f_r',(fs/o.N).toFixed(1)+' Hz 의 배수']]; } };
