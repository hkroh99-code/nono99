/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R06 ~ R10 : 물리 진자(자) · 비틀림 진자 · 회전판 미끄러짐 한계 · 자전거 바퀴 자이로 세차 · 실감개 당기기
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R06 : 물리 진자 — 받침점 위치와 주기 ─────────────────────────── */
function r06(d,L,seed){ var rn=rng32(seed*37+3), m=0.1, Icm=m*L*L/12, T=Tphys(Icm,m,d/100), dmin=L/Math.sqrt(12)*100, Tmin=Tphys(Icm,m,dmin/100), rows=[], i;
  for(i=0;i<6;i++){ var dd=6+8*i, TT=Tphys(Icm,m,dd/100); rows.push({d:dd,T:TT*(1+0.012*gaussR(rn)),ideal:TT}); }
  return {T:T,dmin:dmin,Tmin:Tmin,Icm:Icm,rows:rows,leq:(Icm/(m*d/100)+d/100)}; }
(function(){ var a=r06(10,1,1), b=r06(29,1,1), c=r06(45,1,1), d=r06(29,0.5,1);
  mkP({ id:'R06', t:'물리 진자 — 막대 진자의 주기는 받침점 위치에 따라 어떻게 변할까', icon:'📏', type:'R&E · 정량 실험', lv:2, dur:'2 주', cost:'약 5 천 원',
    one:'1 m 자에 구멍을 뚫거나 못으로 받침을 바꿔 무게중심에서 d = 6 ~ 46 cm 되는 점에 매달고 진동 주기 T 를 영상으로 재서 $T=2\\pi\\sqrt{(I_{cm}+md^2)/(mgd)}$ 와 비교하고 주기가 최소가 되는 d = L/√12 ≈ 29 cm 를 찾는다.',
    q:'받침점이 무게중심에 가까우면 주기가 어떻게 될까? 주기가 가장 짧은 받침점은 어디일까? 자의 길이가 반이면 최소 주기는 어떻게 변할까?',
    why:'<b>단진자는 질량이 점일 때만 맞지만 자는 막대입니다.</b> 관성 모멘트 $I_{cm}$ 와 평행축 정리가 주기를 어떻게 바꾸는지를 직접 보고 「최소 주기」라는 의외의 결과를 발견합니다.',
    link:'원리③ 관성 모멘트(4번 탭) · 평행축 정리 · 교과서 단진동.',
    cap:'1 m 자를 받침점에서 매달아 작은 각으로 흔든다(가운데). 받침점의 위치 d 에 따라 주기가 달라진다(오른쪽). 자 · 받침(못) · 스톱워치(영상) · 줄자 · 기록표',
    parts:[['자(막대)','길이 1 m · 질량 m','1 m 나무 자','질량을 저울로 재고 무게중심 위치(중점)를 찾는다.'],
           ['받침점','구멍 · 못','교사가 구멍을 뚫는다','구멍 위치가 d = 6, 14, 22, … cm 되게 한다. 못 마찰이 작아야.'],
           ['스톱워치 · 영상','주기 T','스마트폰 240 fps','10 번 왕복 시간을 재서 10 으로 나눈다.'],
           ['각도 제한','작은 각 5° 이하','각도 표시','큰 각이면 주기가 커진다. 작은 각으로 흔든다.'],
           ['줄자','d 측정','줄자 1 m','무게중심에서 받침점까지 거리.'],
           ['기록표 · 그래프','d 대 T','스프레드시트','곡선의 최솟값을 찾는다.']],
    budget:[['1 m 나무 자','1','약 2 천 원','—'],['못 · 받침대','1 세트','약 3 천 원','—'],['스마트폰','1','보유','—'],['줄자','1','약 3 천 원','—'],['저울','1','학교 보유','—']],
    steps:['자의 질량 m 과 길이 L 을 재고 무게중심(중점) 위치를 표시한다.','구멍 위치 d = 6, 14, 22, 30, 38, 46 cm 에 못으로 매달고 작은 각도로 흔들어 10 왕복 시간을 재어 주기 T 를 구한다(3 회 평균).','T 대 d 그래프를 그려 최솟값 위치를 찾고 이론 $d_{min}=L/\\sqrt{12}$ 와 비교한다.','이론 주기 $T=2\\pi\\sqrt{(L^2/12+d^2)/(gd)}$ 와 측정을 한 그래프에 그린다.','자를 반으로 잘라(0.5 m) 최소 주기의 위치가 절반이 되는지 확인한다.'],
    vars:['받침점 위치 d · 자 길이 L','진동 주기 T','진폭 · 못 마찰 · 자의 균일도'],
    predict:[['d = 10 cm · L = 1 m','T = '+fx(a.T,2)+' s','무게중심에 가까워 느리다'],
             ['d = 29 cm · L = 1 m','T = '+fx(b.T,2)+' s (최소 '+fx(b.Tmin,2)+' s)','주기가 가장 짧다'],
             ['d = 45 cm · L = 1 m','T = '+fx(c.T,2)+' s','다시 길어진다'],
             ['d = 29 cm · L = 0.5 m','T = '+fx(d.T,2)+' s','최소 주기 위치는 L/√12']],
    data:{cols:['d (cm)','T 측정 (s)','T 이론 (s)','차이 (%)'], rows:r06(10,1,1).rows.map(function(q){ return [fx(q.d,0),fx(q.T,3),fx(q.ideal,3),fx((q.T/q.ideal-1)*100,1)]; })},
    analysis:'T 대 d 곡선에서 최소점의 위치를 이론 $L/\\sqrt{12}$ 와 비교한다. $T^2d$ 대 $d^2$ 를 그리면 직선(기울기 $4\\pi^2/g$, 절편 $4\\pi^2L^2/12g$)이 되어 g 와 $I_{cm}$ 를 한꺼번에 구할 수 있다(선형화).',
    special:['🎓 연구 설계',[['연구 질문','주기는 받침점 위치에 어떻게 의존하는가?'],['독립변인','받침점 위치 d · 막대 길이 L'],['종속변인','주기 T'],['통제변인','진폭 · 자 · 못'],['기대 결과','T(d) 곡선, 최소점 d = L/√12']]],
    fails:[['진동이 금방 멈춘다','못 마찰이 크다 — 매끄러운 못, 작은 구멍에 윤활'],['주기가 이론보다 길다','진폭이 크다 — 5° 이하로 흔든다'],['측정이 흔들린다','10 번 왕복 시간을 영상으로 정확히 측정']],
    up:['<b>I03</b> — 비틀림 진자 관성 측정기.','<b>C09</b> — 균형 새 설계.','<b>종합</b> — 평행축 정리 그래프.'],
    next:['원리③ 관성 모멘트',4],
    eval:[['정확성','T(d) 이론 대비'],['반복성','3 회'],['분석','최솟값 위치'],['안전','못 · 구멍 가공(교사)']],
    tip:'「주기가 가장 짧은 받침점은 막대 길이의 0.29 배」라는 숫자 하나가 좋은 결론입니다.' });
})();
SIMS.R06={ q:'받침점 위치와 막대 길이를 바꾸면 진자의 주기는 어떻게 달라질까?',
  a:{nm:'받침점까지의 거리 d',min:5,max:48,step:1,val:12,unit:'cm',d:0}, b:{nm:'막대 길이 L',min:0.5,max:1.2,step:0.1,val:1,unit:'m',d:1},
  cap1:'막대(자)가 받침점에서 흔들립니다. 노랑 점은 받침점, 파랑 점은 무게중심입니다. d 가 약 0.29 L 일 때 가장 빠르게 흔들립니다.',
  cap2:'📊 받침점 거리 d 대 주기 T — 이론 곡선(최소점 d = L/√12)과 측정점(잡음 1.2 %). 노란 점이 지금입니다.',
  note:'모형 : 균일 막대 $I_{cm}=mL^2/12$ · $T=2\\pi\\sqrt{(I_{cm}+md^2)/(mgd)}$ · 작은 각 · 측정 잡음 1.2 % · 공기 저항 · 마찰 무시.',
  anim:function(ctx,w,h,t,d,L,S){ var o=r06(d,L,S.seed), px=w*0.45, py=h*0.16, sc=h*0.55/L, ang=0.35*Math.cos(TAU*t/o.T); ctx.save(); ctx.translate(px,py); ctx.rotate(ang); drawBeam(ctx,0,-0.0,0,L*sc*0.5+d/100*sc*1,8,COL.tick); ctx.restore();
    // 막대 : 받침점에서 위쪽으로 (L/2 - d) , 아래로 L/2 + d
    ctx.save(); ctx.translate(px,py); ctx.rotate(ang); var top=-(L/2-d/100)*sc, bot=(L/2+d/100)*sc; drawBeam(ctx,0,top,0,bot,9,'rgba(203,213,225,.9)'); cvCirc(ctx,0,d/100*sc,5,COL.blue,COL.white,1.2); ctx.restore(); cvCirc(ctx,px,py,5,COL.amber,COL.white,1.2);
    cvText(ctx,'d = '+d+' cm · L = '+L+' m → 주기 T = '+o.T.toFixed(3)+' s',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'최소 주기 위치 d_min = L/√12 = '+o.dmin.toFixed(1)+' cm (T_min = '+o.Tmin.toFixed(3)+' s)',12,h-12,COL.tick,'11.5px system-ui,sans-serif'); cvText(ctx,'등가 단진자 길이 '+(o.leq*100).toFixed(1)+' cm',w*0.68,h*0.4,COL.ok,'12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,d,L,S){ var o=r06(d,L,S.seed), pts=o.rows.map(function(q){ return [q.d,q.T]; }), cur=[], k, m=0.1, Icm=m*L*L/12; for(k=4;k<=48;k+=1) cur.push([k,Tphys(Icm,m,k/100)]);
    lineGraph(ctx,w,h,{xmin:0,xmax:50,ymin:Math.max(0,o.Tmin*0.8),ymax:Math.min(4,cur[0][1]*1.05),xl:'받침점까지 거리 d (cm)',yl:'주기 T (s)',title:'받침점 위치 대 주기 — 최소점 d = L/√12',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[o.dmin,0],[o.dmin,5]],col:COL.dim,lw:1.2,dash:[4,3]}],pts:pts,now:[d,o.T],legend:[['이론',COL.ok],['d_min',COL.dim],['측정',COL.blue],['지금',COL.amber]],yd:2}); },
  kv:function(d,L,S){ var o=r06(d,L,S.seed); return [['I_cm = mL²/12',o.Icm.toFixed(4)+' kg·m²','a'],['주기 T',o.T.toFixed(3)+' s','g'],['최소 주기',o.Tmin.toFixed(3)+' s @ '+o.dmin.toFixed(1)+' cm','v2'],['등가 단진자 길이',(o.leq*100).toFixed(1)+' cm','r'],['진동수 f',(1/o.T).toFixed(2)+' Hz']]; } };

/* ── R07 : 비틀림 진자 — 철사의 토크 상수 ──────────────────────────── */
function r07(rr,len,seed){ var rn=rng32(seed*41+5), k0=0.02, kap=k0*30/len, I0=5e-4, m=0.05, I=I0+2*m*Math.pow(rr/100,2), T=TAU*Math.sqrt(I/kap), rows=[], i;
  for(i=0;i<6;i++){ var r2=3+2.2*i, I2=I0+2*m*Math.pow(r2/100,2), TT=TAU*Math.sqrt(I2/kap)*(1+0.015*gaussR(rn)); rows.push({r:r2,I:I2,T2:TT*TT,ideal:Math.pow(TAU,2)*I2/kap}); }
  return {kap:kap,I:I,T:T,rows:rows,I0:I0}; }
(function(){ var a=r07(8,30,1), b=r07(4,30,1), c=r07(12,30,1), d=r07(8,60,1);
  mkP({ id:'R07', t:'비틀림 진자 — 철사의 토크 상수 κ 구하기', icon:'🌀', type:'R&E · 정량 실험', lv:2, dur:'2 주', cost:'약 1.5 만 원',
    one:'가는 철사(또는 낚싯줄)에 가로 막대를 매달고 양 끝의 추를 축에서 r = 3 ~ 13 cm 로 바꾸며 비틀림 진동의 주기 T 를 재서 $T^2=\\dfrac{4\\pi^2}{\\kappa}(I_0+2mr^2)$ 의 직선 관계로 토크 상수 κ 와 막대의 관성 모멘트 I₀ 를 구한다.',
    q:'비틀림 진자의 주기는 추의 거리와 어떤 관계일까? 철사를 길게 하면 κ 와 주기는 어떻게 변할까?',
    why:'<b>비틀림 진자는 관성 모멘트를 직접 측정하는 표준 방법</b>입니다. T² 대 I 의 직선이 절편 없이 원점을 지나지 않는 까닭(막대 자체의 I₀)까지 설명할 수 있으면 훌륭한 분석입니다.',
    link:'원리③ 관성 모멘트(4번 탭) · I03 관성 모멘트 측정기 · 교과서 단진동.',
    cap:'가는 철사에 막대와 추가 매달려 있다(가운데). 비틀어 놓고 놓으면 비틀림 진동을 한다(오른쪽 화살표). 천장 · 철사 · 막대 · 추 · 영상 · 기록표',
    parts:[['철사(비틀림 줄)','낚싯줄 · 구리선','길이 30 cm','철사가 가늘수록 κ 가 작아 주기가 길다. 길이를 바꾸면 κ ∝ 1/ℓ.'],
           ['가로 막대','질량 m₀','나무 막대 · 자','가운데를 철사에 묶는다. 수평이 되게.'],
           ['추 2 개','m 50 g 씩','동전 · 클립','축에서 같은 거리 r 에 둔다. 단단히 고정.'],
           ['거리 r 조절','3 ~ 13 cm','눈금 있는 막대','r 를 정밀하게 재서 $I=I_0+2mr^2$.'],
           ['영상 · 스톱워치','T 측정','스마트폰','10 번 진동 시간을 재서 주기를 구한다.'],
           ['기록표 · 그래프','T² 대 I','스프레드시트','직선의 기울기 $4\\pi^2/\\kappa$.']],
    budget:[['낚싯줄 · 구리선','1 세트','약 3 천 원','—'],['나무 막대 · 눈금','1','약 3 천 원','30 cm 자'],['동전 · 추','1 세트','약 2 천 원','—'],['스마트폰','1','보유','—'],['받침대','1','약 5 천 원','책 + 클램프']],
    steps:['철사에 막대를 매달고 막대 중앙이 축에 오도록 한다. 천장 고정을 확인한다.','막대를 작은 각(약 30°)으로 비틀었다 놓아 10 번 진동 시간을 재서 주기 T 를 구한다(3 회).','추를 r = 3 ~ 13 cm 로 바꾸며 반복하고 $I=I_0+2mr^2$ 로 T² 대 I 를 그린다.','기울기에서 κ 를 구하고 절편에서 I₀ 를 구한다.','철사 길이를 30 → 60 cm 로 바꿔 κ 가 절반이 되는지 확인한다.'],
    vars:['추의 거리 r · 철사 길이 ℓ','주기 T · 토크 상수 κ','진폭 · 철사 재질 · 막대 균형'],
    predict:[['r = 8 cm · ℓ = 30 cm','T = '+fx(a.T,2)+' s · κ = '+fx(a.kap,3)+' N·m/rad','기준'],
             ['r = 4 cm','T = '+fx(b.T,2)+' s','관성이 작아 빠르다'],
             ['r = 12 cm','T = '+fx(c.T,2)+' s','추가 멀면 느리다'],
             ['r = 8 cm · ℓ = 60 cm','T = '+fx(d.T,2)+' s · κ = '+fx(d.kap,3),'긴 철사 → κ 반 → 주기 ×1.41']],
    data:{cols:['r (cm)','I (10⁻³ kg·m²)','T² 측정 (s²)','T² 이론 (s²)'], rows:r07(8,30,1).rows.map(function(q){ return [fx(q.r,1),fx(q.I*1000,2),fx(q.T2,2),fx(q.ideal,2)]; })},
    analysis:'T² 대 I 의 기울기 $4\\pi^2/\\kappa$ 에서 κ 를 구하고 절편이 0 이 되도록 I₀ 를 포함해 계산한다(막대 자체 관성). 큰 진폭에서는 주기가 변하므로 작은 각에서만 측정한다.',
    special:['🎓 연구 설계',[['연구 질문','비틀림 진자의 주기는 관성 모멘트와 어떤 관계인가?'],['독립변인','추의 거리 r · 철사 길이'],['종속변인','주기 T · κ'],['통제변인','진폭 · 추 질량 · 철사'],['기대 결과','$T^2\\propto I$, κ ∝ 1/ℓ']]],
    fails:[['진동이 철사 방향으로 흔들린다','막대를 수평으로 하고 철사를 곧게 편다'],['주기가 매번 다르다','진폭을 일정하게 하고 영상으로 측정'],['철사가 소성 변형한다','큰 각으로 비틀지 않는다(30° 이하)']],
    up:['<b>I03</b> — 비틀림 진자 관성 측정기.','<b>I08</b> — 고무줄 태엽 자동차.','<b>종합1(15번 탭)</b> — 관성 모멘트.'],
    next:['원리③ 관성 모멘트',4],
    eval:[['정확성','κ 일관성'],['반복성','3 회'],['분석','T²–I 직선'],['안전','철사 끝 보호']],
    tip:'T² 대 I 직선의 기울기와 절편을 함께 해석하면 한 장의 그래프로 두 물리량을 얻습니다.' });
})();
SIMS.R07={ q:'추의 거리와 철사의 길이를 바꾸면 비틀림 진동의 주기는 어떻게 달라질까?',
  a:{nm:'추의 거리 r',min:3,max:14,step:0.5,val:8,unit:'cm',d:1}, b:{nm:'철사 길이 ℓ',min:20,max:80,step:5,val:30,unit:'cm',d:0},
  cap1:'철사에 매달린 막대와 추가 위에서 보면 비틀려 진동합니다. 주기는 관성 모멘트의 제곱근에 비례합니다.',
  cap2:'📊 관성 모멘트 I 대 T² — 이론 직선과 측정점(잡음 1.5 %). 기울기 4π²/κ.',
  note:'모형 : 철사 κ = 0.02 × (30/ℓ) N·m/rad · 막대 I₀ = 5×10⁻⁴ kg·m² · 추 2 × 50 g · $T=2\\pi\\sqrt{I/\\kappa}$ · 감쇠 · 큰 각 효과 무시.',
  anim:function(ctx,w,h,t,rr,len,S){ var o=r07(rr,len,S.seed), cx=w*0.4, cy=h*0.55, sc=Math.min(w*0.3,200)/14, ang=0.7*Math.cos(TAU*t/o.T)*Math.exp(-t*0.05); cvLine(ctx,[[cx,h*0.1],[cx,cy-6]],COL.tick,1.5); cvRect(ctx,cx-14,h*0.1-6,28,6,'#475569',null); ctx.save(); ctx.translate(cx,cy); ctx.scale(1,0.4); ctx.rotate(ang); drawBeam(ctx,-14*sc,0,14*sc,0,6,'rgba(203,213,225,.9)'); cvCirc(ctx,-rr*sc,0,9,COL.amber,COL.white,1.2); cvCirc(ctx,rr*sc,0,9,COL.amber,COL.white,1.2); ctx.restore(); cvCirc(ctx,cx,cy,3,COL.dim,null);
    arcArrow(ctx,cx,cy-24,16,-2.6,-0.6,COL.ok,2); cvText(ctx,'r = '+rr+' cm · I = '+(o.I*1000).toFixed(2)+'×10⁻³ kg·m² · κ = '+o.kap.toFixed(3)+' N·m/rad → T = '+o.T.toFixed(2)+' s',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,rr,len,S){ var o=r07(rr,len,S.seed), pts=o.rows.map(function(q){ return [q.I*1000,q.T2]; }), cur=[], k, kap=o.kap; for(k=0.4;k<=4;k+=0.2){ cur.push([k,TAU*TAU*(k/1000)/kap]); }
    lineGraph(ctx,w,h,{xmin:0,xmax:4.2,ymin:0,ymax:Math.max(8,cur[cur.length-1][1]*1.05),xl:'관성 모멘트 I (10⁻³ kg·m²)',yl:'T² (s²)',title:'T² 대 I — 기울기 4π²/κ (원점을 지나는 직선)',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[o.I*1000,o.T*o.T],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:1}); },
  kv:function(rr,len,S){ var o=r07(rr,len,S.seed); return [['토크 상수 κ',o.kap.toFixed(4)+' N·m/rad','a'],['관성 모멘트 I',(o.I*1000).toFixed(3)+'×10⁻³ kg·m²','g'],['주기 T',o.T.toFixed(3)+' s','v2'],['진동수',(1/o.T).toFixed(2)+' Hz','r'],['막대 I₀',(o.I0*1000).toFixed(2)+'×10⁻³']]; } };

/* ── R08 : 회전판에서 미끄러지는 한계 ─────────────────────────────── */
function r08(r,mu,seed){ var rn=rng32(seed*43+9), w=Math.sqrt(mu*G/(r/100)), rpm=w2rpm(w), rows=[], i;
  for(i=0;i<6;i++){ var rr=3+3*i, ww=Math.sqrt(mu*G/(rr/100)); rows.push({r:rr,rpm:w2rpm(ww)*(1+0.06*gaussR(rn)),ideal:w2rpm(ww)}); }
  return {w:w,rpm:rpm,ac:acent(w,r/100),rows:rows,lp:(w2rpm(w)>78?'LP 78 rpm 에서도 안전':(w2rpm(w)>33.3?'LP 33⅓ rpm 에서는 안전':'LP 33⅓ rpm 에서도 미끄러짐'))}; }
(function(){ var a=r08(10,0.5,1), b=r08(5,0.5,1), c=r08(18,0.5,1), d=r08(10,0.25,1);
  mkP({ id:'R08', t:'회전판 위에서 미끄러지는 한계 — 구심력과 마찰', icon:'💿', type:'R&E · 정량 실험', lv:2, dur:'1 주', cost:'약 1.5 만 원',
    one:'속도를 조절할 수 있는 턴테이블(손으로 돌리는 회전판 · 학교 실험용)에 작은 지우개를 반지름 r = 3 ~ 18 cm 에 놓고 회전수를 서서히 올려 미끄러지기 시작하는 순간의 rpm 을 영상으로 재서 $\\omega_{max}=\\sqrt{\\mu_sg/r}$ 를 검증한다.',
    q:'물체가 미끄러지기 시작하는 회전수는 반지름과 어떤 관계일까? 표면이 미끄러우면 한계는 어떻게 달라질까?',
    why:'<b>「원심력이 물체를 밖으로 밀어낸다」는 말의 진짜 뜻</b>을 정확히 알 수 있습니다. 물체가 실제로 받는 것은 중심을 향한 정지 마찰력이며, 그것이 부족한 순간 접선 방향으로 미끄러진다는 것을 정량적으로 확인합니다.',
    link:'원리① 각운동학(2번 탭) · 오개념(원심력) · 교과서 원운동.',
    cap:'회전판(위에서 본 모습) 위에 놓인 지우개(왼쪽)가 회전이 빨라지면 마찰력의 한계에 이르러 미끄러진다(가운데). 회전수와 반지름의 관계(오른쪽). 회전판 · 물체 · 속도 조절 · 영상 · 눈금 · 기록표',
    parts:[['회전판','턴테이블 · 실험용','학교 보유 회전판 또는 LP 플레이어','회전수를 천천히 올릴 수 있어야 한다. 보호 덮개와 안전 거리를 지킨다.'],
           ['물체(지우개)','작고 가벼운 물체','지우개 · 작은 고무','질량이 달라도 한계는 같다. 날아가도 안전한 가벼운 것.'],
           ['반지름 표시','r 눈금','회전판 위 동심원 표시','3 cm 간격의 원을 그려 둔다.'],
           ['영상','rpm 측정','스마트폰 슬로 모션','판 가장자리 표시가 한 바퀴 도는 프레임 수로 rpm 을 센다.'],
           ['마찰 표면','μ 변화','천 · 종이 · 고무 시트','표면 재질을 바꿔 μ 를 바꾼다.'],
           ['기록표 · 그래프','r 대 ω_max','스프레드시트','$\\omega_{max}^2$ 대 $1/r$ 의 기울기 μg.']],
    budget:[['회전판(학교 보유)','1','—','LP 플레이어'],['지우개 · 고무 시트','1 세트','약 2 천 원','—'],['눈금 스티커','1','약 1 천 원','—'],['스마트폰','1','보유','—'],['보호 덮개(투명)','1','약 5 천 원','투명 상자']],
    steps:['회전판에 3, 6, 9, … cm 되는 곳에 같은 지우개를 놓고 투명 덮개를 씌운다. 보호 거리를 확보한다.','회전수를 아주 천천히 올리며(교사 조작) 지우개가 미끄러지기 시작하는 순간의 rpm 을 영상으로 읽는다.','반지름 r 별 ω_max 를 구하고 $\\omega_{max}^2$ 대 $1/r$ 를 그려 기울기 $\\mu_sg$ 를 구한다.','표면(천 · 종이 · 고무)을 바꿔 μ 를 바꿔 기울기가 어떻게 변하는지 비교한다.','같은 r 에서 질량이 다른 물체의 한계 rpm 이 같은지 확인한다.'],
    vars:['반지름 r · 표면 μ','한계 회전수','회전 가속 속도 · 먼지 · 수평'],
    predict:[['r = 10 cm · μ = 0.5','ω_max = '+fx(a.w,1)+' rad/s ('+fx(a.rpm,0)+' rpm)','LP 33 rpm 에서는 안전'],
             ['r = 5 cm · μ = 0.5','ω_max = '+fx(b.w,1)+' rad/s ('+fx(b.rpm,0)+' rpm)','안쪽일수록 더 빨리 돌아야 미끄러진다'],
             ['r = 18 cm · μ = 0.5',''+fx(c.rpm,0)+' rpm','바깥은 일찍 미끄러진다'],
             ['r = 10 cm · μ = 0.25',''+fx(d.rpm,0)+' rpm','미끄러운 표면은 한계가 낮다']],
    data:{cols:['r (cm)','한계 rpm 측정','이론 (rpm)','차이 (%)'], rows:r08(10,0.5,1).rows.map(function(q){ return [fx(q.r,0),fx(q.rpm,0),fx(q.ideal,0),fx((q.rpm/q.ideal-1)*100,0)]; })},
    analysis:'$\\omega_{max}^2$ 대 $1/r$ 가 원점을 지나는 직선인지 확인하고 기울기에서 정지 마찰 계수 $\\mu_s$ 를 구한다. 가속이 빠르면 한계가 높게 읽히므로 천천히 올린다. 질량이 달라도 한계가 같아야 한다($m$ 이 소거).',
    special:['🎓 연구 설계',[['연구 질문','미끄러지는 한계 회전수는 반지름 · 표면과 어떤 관계인가?'],['독립변인','반지름 · 표면'],['종속변인','한계 rpm'],['통제변인','회전 가속 속도 · 판'],['기대 결과','$\\omega_{max}=\\sqrt{\\mu_sg/r}$']]],
    fails:[['한계가 불규칙하다','회전수를 아주 천천히 올리고 먼지를 닦는다'],['물체가 날아가 위험하다','투명 덮개 · 가벼운 물체 · 안전 거리'],['rpm 읽기가 어렵다','판 가장자리에 표시를 붙이고 슬로 모션으로 프레임을 센다']],
    up:['<b>C10</b> — 놀이터 회전 기구 조사.','<b>C06</b> — 회전 놀이기구 인포그래픽.','<b>종합2(16번 탭)</b> — 구심력 대 ω².'],
    next:['원리① 각운동학 · 원심력 오개념',2],
    eval:[['정확성','ω_max 이론 대비'],['반복성','3 회'],['분석','ω²–1/r 직선'],['안전','덮개 · 거리']],
    tip:'「원심력은 겉보기 힘, 실제 힘은 마찰」이라는 결론을 실험 사진과 함께 쓰면 오개념 교정 프로젝트가 됩니다.' });
})();
SIMS.R08={ q:'반지름과 표면의 미끄러움을 바꾸면 물체가 미끄러지기 시작하는 회전수는 어떻게 달라질까?',
  a:{nm:'반지름 r',min:3,max:20,step:1,val:10,unit:'cm',d:0}, b:{nm:'정지 마찰 계수 μ_s',min:0.2,max:0.8,step:0.05,val:0.5,unit:'',d:2},
  cap1:'회전판 위에 지우개가 놓여 있습니다. 회전수가 한계를 넘으면 지우개가 접선 방향으로 미끄러져 나갑니다(바깥으로 직진).',
  cap2:'📊 반지름 r 대 한계 회전수 — 이론 곡선(1/√r)과 측정점(잡음 6 %). 점선은 LP 33⅓ rpm 과 78 rpm.',
  note:'모형 : 정지 마찰이 구심력을 공급 $\\mu_smg=mr\\omega^2$ → $\\omega_{max}=\\sqrt{\\mu_sg/r}$ · 측정 잡음 6 % · 질량 무관 · 회전판 평평하고 수평.',
  anim:function(ctx,w,h,t,r,mu,S){ var o=r08(r,mu,S.seed), cx=w*0.32, cy=h*0.52, R=Math.min(h*0.38,w*0.26), ph=(t%8)/8, om=o.w*1.4*Math.min(1,ph*1.2), th=(this.th||0)+om*0.03; this.th=th; ctx.fillStyle='rgba(148,163,184,.18)'; ctx.beginPath(); ctx.arc(cx,cy,R,0,TAU); ctx.fill(); ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.stroke(); ctx.lineWidth=1;
    var rp=r/20*R, slip=om>o.w; var px=cx+rp*Math.cos(th), py=cy+rp*Math.sin(th); if(slip){ var extra=(om-o.w)*0.3; px+=Math.cos(th+1.57)*extra*40; py+=Math.sin(th+1.57)*extra*40; } cvLine(ctx,[[cx,cy],[cx+R*Math.cos(th),cy+R*Math.sin(th)]],COL.dim,1); cvCirc(ctx,px,py,7,slip?COL.grav:COL.amber,COL.white,1.2);
    if(!slip){ cvArrow(ctx,px,py,px+(cx-px)*0.35,py+(cy-py)*0.35,COL.ok,2.6); cvText(ctx,'마찰력 = 구심력',px+8,py-12,COL.ok,'11px system-ui,sans-serif'); }
    cvText(ctx,'ω = '+om.toFixed(1)+' rad/s ('+w2rpm(om).toFixed(0)+' rpm) / 한계 '+o.w.toFixed(1)+' rad/s ('+o.rpm.toFixed(0)+' rpm) '+(slip?'→ 미끄러짐!':'→ 안전'),12,16,slip?COL.grav:COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'구심 가속도 한계 '+o.ac.toFixed(2)+' m/s² = μ g · '+o.lp,12,h-12,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,r,mu,S){ var o=r08(r,mu,S.seed), pts=o.rows.map(function(q){ return [q.r,q.rpm]; }), cur=[], k; for(k=3;k<=20;k+=0.5) cur.push([k,w2rpm(Math.sqrt(mu*G/(k/100)))]);
    lineGraph(ctx,w,h,{xmin:0,xmax:21,ymin:0,ymax:Math.max(100,cur[0][1]*1.1),xl:'반지름 r (cm)',yl:'한계 회전수 (rpm)',title:'반지름 대 한계 회전수 — 1/√r',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[0,33.3],[21,33.3]],col:COL.dim,lw:1.2,dash:[4,3]},{pts:[[0,78],[21,78]],col:'#fb923c',lw:1.2,dash:[4,3]}],pts:pts,now:[r,o.rpm],legend:[['이론',COL.ok],['33⅓ rpm',COL.dim],['78 rpm','#fb923c'],['측정',COL.blue],['지금',COL.amber]],yd:0,lw:130}); },
  kv:function(r,mu,S){ var o=r08(r,mu,S.seed); return [['한계 각속도',o.w.toFixed(2)+' rad/s','a'],['한계 회전수',o.rpm.toFixed(0)+' rpm','g'],['한계 구심 가속도',o.ac.toFixed(2)+' m/s²','v2'],['LP 와 비교',o.lp,'r'],['한계 선속도',(o.w*r/100).toFixed(2)+' m/s']]; } };

/* ── R09 : 자전거 바퀴 자이로 세차 ─────────────────────────────────── */
function r09(rpm,d,seed){ var rn=rng32(seed*47+11), I=0.08, m=0.1, w=rpm2w(rpm), Om=m*G*d/100/(I*w), T=TAU/Om, rows=[], i;
  for(i=0;i<6;i++){ var rr=100+60*i, ww=rpm2w(rr), O=m*G*d/100/(I*ww); rows.push({rpm:rr,Om:O*(1+0.08*gaussR(rn)),ideal:O}); }
  return {w:w,Om:Om,T:T,L:I*w,rows:rows,I:I}; }
(function(){ var a=r09(200,20,1), b=r09(400,20,1), c=r09(200,10,1), d=r09(100,20,1);
  mkP({ id:'R09', t:'자이로스코프 세차 — 빨리 돌수록 천천히 기운다', icon:'🎡', type:'R&E · 영상 분석', lv:3, dur:'3 주', cost:'약 1.5 만 원',
    one:'자전거 바퀴(손으로 돌린 100 ~ 400 rpm 이하, 손잡이 달린 축)의 한쪽 축 끝에 작은 추(100 g)를 d = 10 ~ 25 cm 에 매달고 바퀴를 돌려 세차(수평으로 천천히 도는 운동) 각속도 Ω 를 재서 $\\Omega=\\dfrac{mgd}{I\\omega}$ 와 비교한다.',
    q:'바퀴가 빨리 돌수록 세차는 빨라질까 느려질까? 추를 멀리 달면 세차는 어떻게 변할까?',
    why:'<b>중력이 바퀴를 넘어뜨리지 않고 옆으로 돌게 만드는</b> 놀라운 현상입니다. 팽이가 쓰러지지 않는 이유와 지구의 세차를 설명하는 핵심이며, 토크와 각운동량의 벡터적 관계를 직관적으로 보여 줍니다.',
    link:'원리④ 각운동량(5번 탭) · 벡터 토크 심화 · 교과서 회전 운동.',
    cap:'바퀴의 축 한쪽에 추를 달면(왼쪽) 바퀴가 쓰러지지 않고 수평으로 천천히 돈다(세차, 가운데). 세차 주기와 회전수의 관계(오른쪽). 바퀴 · 축 손잡이 · 추 · 스톱워치 · 영상 · 기록표',
    parts:[['자전거 바퀴','I 약 0.08 kg·m²','분리한 앞바퀴 · 손잡이 달린 축','축 양쪽에 손잡이를 달아 한쪽 손으로 잡는다. 바퀴는 손으로만 돌린다(낮은 속도).'],
           ['추(100 g)','질량 m','동전 · 클립 묶음','축 끝 d 에서 매달거나 끈으로 건다. 떨어지지 않게 고정.'],
           ['회전수 측정','ω','스마트폰 영상 · 스포크 표시','한 바퀴 프레임 수로 rpm 측정.'],
           ['세차 측정','Ω','영상 위에서','수평 회전 한 바퀴의 시간 T_p 를 잰다.'],
           ['안전','손 보호','장갑 · 보안경','고속 회전 금지. 손가락이 스포크에 끼이지 않게 한다.'],
           ['기록표 · 그래프','1/ω 대 Ω','스프레드시트','Ω 대 1/ω 의 기울기 mgd/I.']],
    budget:[['자전거 앞바퀴 · 축 손잡이','1','약 1 만 원','학교 보유'],['추 · 줄','1 세트','약 2 천 원','—'],['스마트폰','1','보유','—'],['장갑 · 보안경','1','약 3 천 원','—'],['눈금 표시','1','약 1 천 원','—']],
    steps:['바퀴를 한쪽 손잡이로 잡고(다른 손으로 축 반대쪽 지지) 손으로 천천히 돌린 뒤 축을 수평으로 든다(교사 감독, 낮은 속도).','축 끝에 추를 걸고 바퀴가 쓰러지지 않고 수평으로 도는 세차를 영상으로 기록한다.','영상에서 바퀴 회전수 ω(프레임으로 측정)와 세차 한 바퀴 시간 T_p 를 읽는다.','$\\Omega=2\\pi/T_p$ 와 이론 $mgd/(I\\omega)$ 를 비교한다(I 는 R03 방법으로 측정).','추의 위치 d 를 바꿔 Ω ∝ d 를 확인한다.'],
    vars:['바퀴 회전수 ω · 추의 거리 d','세차 각속도 Ω','바퀴 I · 마찰 · 지지 방식'],
    predict:[['200 rpm · d = 20 cm','Ω = '+fx(a.Om,2)+' rad/s (한 바퀴 '+fx(a.T,0)+' s)','천천히 돈다'],
             ['400 rpm · d = 20 cm','Ω = '+fx(b.Om,2)+' rad/s','빠를수록 세차는 절반'],
             ['200 rpm · d = 10 cm','Ω = '+fx(c.Om,2)+' rad/s','추가 가까우면 절반'],
             ['100 rpm · d = 20 cm','Ω = '+fx(d.Om,2)+' rad/s','느리게 돌수록 세차가 빠르다']],
    data:{cols:['회전수 (rpm)','Ω 측정 (rad/s)','이론 (rad/s)','차이 (%)'], rows:r09(200,20,1).rows.map(function(q){ return [fx(q.rpm,0),fx(q.Om,3),fx(q.ideal,3),fx((q.Om/q.ideal-1)*100,0)]; })},
    analysis:'Ω 대 1/ω 가 원점을 지나는 직선인지 확인하고 기울기에서 $mgd/I$ 를 구해 I 를 추정한다. 바퀴가 느려지면 세차가 빨라지는 것(마찰로 ω 감소)도 관찰한다. 세차 단순 공식은 빠르게 돌 때만 정확하다(ω ≫ Ω).',
    special:['🎓 연구 설계',[['연구 질문','세차 각속도는 바퀴의 회전수와 추 위치에 어떻게 의존하는가?'],['독립변인','회전수 · 추 위치'],['종속변인','세차 각속도 Ω'],['통제변인','추 질량 · 바퀴'],['기대 결과','$\\Omega\\propto d/\\omega$']]],
    fails:[['바퀴가 쓰러진다','회전수가 낮다 — 조금 더 빠르게(안전 범위 내), 추를 가볍게'],['세차가 불규칙하다','축을 수평으로 지지하고 바퀴 균형을 맞춘다'],['위험하다','고속 금지, 장갑 · 보안경, 교사 감독']],
    up:['<b>C03</b> — 각운동량 마술 쇼.','<b>I06</b> — 역진자 균형 제어.','<b>종합</b> — 벡터 토크 심화 자료.'],
    next:['원리④ 각운동량',5],
    eval:[['정확성','Ω 이론 대비'],['반복성','3 회'],['분석','1/ω 직선'],['안전','회전 바퀴 · 손가락']],
    tip:'영상 한 컷에 바퀴 · 추 · 세차 방향을 함께 보여 주면 이해가 빠릅니다. 안전 수칙을 첫 장에 쓰세요.' });
})();
SIMS.R09={ q:'바퀴의 회전수와 추의 위치를 바꾸면 세차 각속도는 어떻게 달라질까?',
  a:{nm:'바퀴 회전수',min:60,max:400,step:20,val:200,unit:'rpm',d:0}, b:{nm:'추의 거리 d',min:5,max:25,step:1,val:20,unit:'cm',d:0},
  cap1:'위에서 본 바퀴(왼쪽)의 각운동량 L(초록)과 중력 토크(빨강)가 L 의 방향을 옆으로 서서히 돌립니다(세차).',
  cap2:'📊 회전수 대 세차 각속도 — 이론 곡선(1/ω)과 측정점(잡음 8 %). 빠르게 돌수록 세차가 느립니다.',
  note:'모형 : 바퀴 $I=0.08$ kg·m² · 추 100 g · 세차 $\\Omega=mgd/(I\\omega)$ ($\\omega\\gg\\Omega$) · 측정 잡음 8 %. 마찰 · 장동 무시. 안전을 위해 실제 실험은 저속 · 교사 감독.',
  anim:function(ctx,w,h,t,rpm,d,S){ var o=r09(rpm,d,S.seed), cx=w*0.32, cy=h*0.5, R=Math.min(h*0.3,w*0.2), ph=(this.ph||0)+o.Om*0.03; this.ph=ph; var ax=cx+R*Math.cos(ph), ay=cy+R*0.45*Math.sin(ph);
    ctx.strokeStyle='rgba(148,163,184,.4)'; ctx.setLineDash([3,4]); ctx.beginPath(); ctx.ellipse(cx,cy,R,R*0.45,0,0,TAU); ctx.stroke(); ctx.setLineDash([]); cvLine(ctx,[[cx,cy],[ax,ay]],COL.tick,5); cvCirc(ctx,cx,cy,5,COL.amber,COL.white,1.2); cvCirc(ctx,ax,ay,7+Math.min(10,o.L*4),COL.blue,COL.white,1.4);
    cvArrow(ctx,ax,ay,ax,ay+36,COL.grav,2.6); cvText(ctx,'mg',ax+8,ay+28,COL.grav,'11px system-ui,sans-serif'); cvArrow(ctx,cx,cy,ax,ay,COL.ok,3);
    var bx=w*0.62; cvText(ctx,'각운동량 L = Iω = '+o.L.toFixed(2)+' kg·m²/s',bx,h*0.3,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'세차 각속도 Ω = '+o.Om.toFixed(3)+' rad/s',bx,h*0.44,COL.ok,'bold 13px system-ui,sans-serif'); cvText(ctx,'한 바퀴 세차 시간 '+o.T.toFixed(1)+' s',bx,h*0.58,COL.tick,'12px system-ui,sans-serif'); cvText(ctx,'빠르게 돌수록(L 큼) 세차는 느리다',bx,h*0.72,COL.amber,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,rpm,d,S){ var o=r09(rpm,d,S.seed), pts=o.rows.map(function(q){ return [q.rpm,q.Om]; }), cur=[], k; for(k=60;k<=400;k+=10) cur.push([k,0.1*G*d/100/(0.08*rpm2w(k))]);
    lineGraph(ctx,w,h,{xmin:40,xmax:420,ymin:0,ymax:Math.max(0.2,cur[0][1]*1.1),xl:'바퀴 회전수 (rpm)',yl:'세차 각속도 Ω (rad/s)',title:'회전수 대 세차 각속도 — Ω ∝ 1/ω',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:pts,now:[rpm,o.Om],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:2}); },
  kv:function(rpm,d,S){ var o=r09(rpm,d,S.seed); return [['각속도 ω',o.w.toFixed(1)+' rad/s','a'],['각운동량 L',o.L.toFixed(2)+' kg·m²/s','g'],['중력 토크 mgd',(0.1*G*d/100).toFixed(3)+' N·m','v2'],['세차 Ω',o.Om.toFixed(3)+' rad/s','r'],['세차 주기',o.T.toFixed(1)+' s']]; } };

/* ── R10 : 실감개(스풀) 당기기 — 굴러가는 방향 ────────────────────── */
function r10(phi,ratio,seed){ var rn=rng32(seed*53+17), phic=Math.acos(ratio)*180/PI, net=ratio-Math.cos(phi*PI/180), dir=net>0.001?'당기는 쪽으로':(net<-0.001?'반대쪽으로':'제자리(정지)'), rows=[], i;
  for(i=0;i<7;i++){ var pp=i*13, nn=ratio-Math.cos(pp*PI/180)+0.02*gaussR(rn); rows.push({phi:pp,net:nn,dir:nn>0.03?'당기는 쪽':(nn<-0.03?'반대쪽':'제자리')}); }
  return {phic:phic,net:net,dir:dir,rows:rows}; }
(function(){ var a=r10(30,0.5,1), b=r10(70,0.5,1), c=r10(60,0.5,1), d=r10(30,0.8,1);
  mkP({ id:'R10', t:'실감개 당기기 — 줄을 어느 각도로 당기면 어느 쪽으로 구를까', icon:'🧵', type:'R&E · 관찰·정량', lv:2, dur:'1 주', cost:'약 3 천 원',
    one:'실이 감긴 실감개(스풀)의 아래쪽에서 나온 실을 수평면과 각도 φ 로 당겨 스풀이 앞으로 굴러가는지 뒤로 굴러가는지 기록하고, 접촉점에 대한 토크가 0 이 되는 임계각 $\\cos\\varphi_c=r/R$ 를 구해 실험값과 비교한다.',
    q:'실을 낮게 당기면 스풀이 어느 쪽으로 굴러갈까? 방향이 바뀌는 각도는 안쪽 반지름과 바깥 반지름의 비로 정해질까?',
    why:'<b>직관을 거스르는 결과</b>(낮게 당기면 당기는 쪽으로, 높게 당기면 반대쪽으로?)를 접촉점에 대한 토크로 설명하는 명쾌한 프로젝트입니다. 어떤 점을 축으로 잡는지가 토크 계산을 쉽게 만든다는 것을 배웁니다.',
    link:'원리② 토크와 평형(3번 탭) · 접촉점 기준 토크 · 교과서 구름.',
    cap:'스풀(실감개)이 바닥에 놓여 있고(왼쪽), 실을 각도 φ 로 당기면(가운데) 접촉점에 대한 토크의 부호에 따라 구르는 방향이 정해진다(오른쪽). 스풀 · 실 · 각도기 · 영상 · 기록표',
    parts:[['스풀(실감개)','바깥 R · 안쪽 r','빈 실감개 · 두루마리 심','바깥(플랜지) 반지름 R 와 실이 감긴 안쪽 반지름 r 를 잰다.'],
           ['실','감긴 실','가는 실','안쪽 반지름에서 아래쪽으로 나오게 감는다.'],
           ['각도 조절','φ 0 ~ 90°','각도기 · 눈금','실을 당기는 각도(수평면 기준)를 고정한다.'],
           ['평평한 면','구름 바닥','책상 · 판','미끄러지지 않을 만큼 거친 표면.'],
           ['영상','움직임 방향','스마트폰','앞 · 뒤 · 제자리를 프레임으로 확인.'],
           ['기록표 · 그래프','φ 대 이동 방향','스프레드시트','부호가 바뀌는 각도 φ_c.']],
    budget:[['실감개(스풀) 3 종','1 세트','약 1 천 원','두루마리 휴지 심'],['실 · 클립','1','약 1 천 원','—'],['각도기','1','약 1 천 원','—'],['스마트폰','1','보유','—'],['평평한 판','1','—','책상']],
    steps:['스풀의 R 와 r 를 재서 임계각 $\\varphi_c=\\arccos(r/R)$ 를 예측한다.','실을 스풀 아래쪽에서 뽑아 φ = 0°(수평), 20°, 40°, … 90° 로 천천히 당겨 구르는 방향을 영상으로 확인한다.','방향이 바뀌는 각도 φ_c 의 측정값을 구한다.','스풀의 r/R 를 바꿔(실을 더 감아 r 키우기) φ_c 가 어떻게 달라지는지 본다.','접촉점에 대한 토크 $\\tau=F(R\\cos\\varphi-r)$ 의 부호로 결과를 설명한다.'],
    vars:['당기는 각도 φ · 반지름비 r/R','구르는 방향(앞 · 뒤)','실 당김 속도 · 표면 마찰'],
    predict:[['φ = 30° · r/R = 0.5','방향 : '+a.dir+' (φ_c = '+fx(a.phic,0)+'°)','낮게 당기면 당기는 쪽으로'],
             ['φ = 70° · r/R = 0.5','방향 : '+b.dir,'높게 당기면 반대쪽으로'],
             ['φ = 60° · r/R = 0.5','방향 : '+c.dir,'임계각에서 제자리'],
             ['φ = 30° · r/R = 0.8','방향 : '+d.dir+' (φ_c = '+fx(d.phic,0)+'°)','r/R 가 크면 임계각이 작다']],
    data:{cols:['φ (°)','부호 지표 r/R − cosφ','이동 방향'], rows:r10(30,0.5,1).rows.map(function(q){ return [fx(q.phi,0),fx(q.net,2),q.dir]; })},
    analysis:'방향이 바뀌는 각도의 측정값을 이론 $\\arccos(r/R)$ 와 비교한다. 접촉점에 대한 토크 $\\tau=F(r-R\\cos\\varphi)$ 의 부호가 이동 방향을 정한다. 마찰이 부족해 미끄러지면 임계각이 달라질 수 있다.',
    special:['🎓 연구 설계',[['연구 질문','실의 각도에 따른 스풀의 구르는 방향은?'],['독립변인','당기는 각도 · 반지름비'],['종속변인','이동 방향 · 임계각'],['통제변인','표면 · 당기는 속도'],['기대 결과','$\\varphi_c=\\arccos(r/R)$']]],
    fails:[['스풀이 미끄러진다','표면을 더 거칠게(종이 · 천)'],['방향이 불명확하다','천천히 당기고 임계각 근처에서 영상을 확대'],['실이 겹쳐 감긴다','안쪽 반지름에 한 겹으로']],
    up:['<b>R04</b> — 구르기 경주.','<b>I08</b> — 고무줄 태엽 자동차.','<b>C07</b> — 기어 박스 장난감.'],
    next:['원리② 토크와 평형',3],
    eval:[['정확성','임계각 일치도'],['반복성','각도별 3 회'],['분석','접촉점 토크 설명'],['안전','실 · 작은 부품']],
    tip:'스풀 사진 한 장과 「접촉점에 대한 토크의 부호」 한 줄이면 훌륭한 설명이 됩니다.' });
})();
SIMS.R10={ q:'실을 당기는 각도와 안쪽·바깥 반지름비를 바꾸면 스풀은 어느 쪽으로 굴러갈까?',
  a:{nm:'당기는 각도 φ',min:0,max:90,step:5,val:30,unit:'°',d:0}, b:{nm:'반지름비 r/R',min:0.2,max:0.9,step:0.05,val:0.5,unit:'',d:2},
  cap1:'스풀(옆모습)을 실로 각도 φ 로 당깁니다. 접촉점에 대한 토크의 부호에 따라 앞(당기는 쪽) 또는 뒤(반대쪽)로 구르고 임계각에서는 제자리입니다.',
  cap2:'📊 당기는 각도 φ 대 접촉점 토크 지표 r/R − cosφ — 0 을 가로지르는 곳이 임계각입니다.',
  note:'모형 : 접촉점에 대한 토크 $\\tau=F(r-R\\cos\\varphi)$ → 부호 지표 $r/R-\\cos\\varphi$ · 임계각 $\\varphi_c=\\arccos(r/R)$ · 미끄러짐 없는 구름 가정 · 측정 잡음 0.02.',
  anim:function(ctx,w,h,t,phi,ratio,S){ var o=r10(phi,ratio,S.seed), cx=w*0.4, gy=h*0.78, R=Math.min(h*0.24,w*0.14), r=R*ratio, mv=(o.net>0.001?-1:(o.net<-0.001?1:0)); var ph=(t%4)/4, dx=mv*ph*60, ang=-dx/R; cvLine(ctx,[[10,gy],[w-10,gy]],COL.axis2,2.4);
    var sx=cx+dx, sy=gy-R; ctx.save(); ctx.translate(sx,sy); ctx.rotate(ang); cvCirc(ctx,0,0,R,'rgba(148,163,184,.25)',COL.white,2); cvCirc(ctx,0,0,r,'rgba(251,191,36,.45)',COL.amber,1.5); cvLine(ctx,[[0,0],[R,0]],COL.tick,1.2); ctx.restore();
    var tx=sx-r*0, ty=sy+r; var L=70, ex=tx-L*Math.cos(phi*PI/180), ey=ty-L*Math.sin(phi*PI/180); cvArrow(ctx,tx,ty,ex,ey,COL.amber,3); cvText(ctx,'F',ex-8,ey-4,COL.amber,'bold 12px system-ui,sans-serif'); cvCirc(ctx,sx,gy,4,COL.grav,null); cvText(ctx,'접촉점',sx,gy+16,COL.grav,'10.5px system-ui,sans-serif','center');
    cvText(ctx,'φ = '+phi+'° · r/R = '+ratio.toFixed(2)+' → '+o.dir+' (임계각 '+o.phic.toFixed(0)+'°)',12,16,o.net>0.001?COL.ok:(o.net<-0.001?COL.amber:COL.text),'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,phi,ratio,S){ var o=r10(phi,ratio,S.seed), cur=[], k; for(k=0;k<=90;k+=2) cur.push([k,ratio-Math.cos(k*PI/180)]);
    lineGraph(ctx,w,h,{xmin:0,xmax:92,ymin:-1,ymax:1,xl:'당기는 각도 φ (°)',yl:'r/R − cosφ (토크 부호)',title:'접촉점 토크의 부호 — 0 이 되는 각이 임계각',curves:[{pts:cur,col:COL.ok,lw:2.4},{pts:[[0,0],[92,0]],col:COL.dim,lw:1.2,dash:[4,3]},{pts:[[o.phic,-1],[o.phic,1]],col:COL.grav,lw:1.2,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.phi,q.net]; }),now:[phi,o.net],legend:[['이론',COL.ok],['임계각',COL.grav],['측정 부호',COL.blue],['지금',COL.amber]],yd:1}); },
  kv:function(phi,ratio,S){ var o=r10(phi,ratio,S.seed); return [['임계각 φ_c',o.phic.toFixed(1)+'°','a'],['토크 지표 r/R − cosφ',o.net.toFixed(3),'g'],['구르는 방향',o.dir,'v2'],['접촉점 토크 부호',o.net>0.001?'당기는 쪽 +':(o.net<-0.001?'반대쪽 −':'0'),'r'],['r/R',ratio.toFixed(2)]]; } };
