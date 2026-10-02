/* ═══════════════════════════════════════════════════════════════════════════
   창의 프로젝트 C01 ~ C05 : 페트병 분수 아트 · 유압 로봇 팔 · 구명조끼 전시 · 잠수함 밸러스트 쇼 · 소금물 밀도 탑
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── C01 : 페트병 분수 아트 (H=30 cm 고정) ──────────────────────────── */
function c01x(h,H){ return 2*Math.sqrt(h*(H-h))*0.97; }
function c01(h1,h2){ var H=30, x1=c01x(h1,H), x2=c01x(h2,H); return {x1:x1,x2:x2,dx:Math.abs(x1-x2),H:H,meet:Math.abs(x1-x2)<1.0,hsym:H-h1}; }
(function(){ var a=c01(5,25), b=c01(10,20), c=c01(5,10), d=c01(15,15);
  mkP({ id:'C01', t:'페트병 분수 아트 — 물줄기를 한 점에 모으는 설계', icon:'⛲', type:'창의 · 조형', lv:1, dur:'1 주', cost:'약 1 만 원',
    one:'페트병 옆면에 높이가 다른 구멍을 뚫어 두 물줄기가 바닥의 한 점에서 만나도록 설계한다. 수면 H 일 때 깊이 h 와 H−h 의 구멍이 같은 거리(2√(h(H−h)))에 떨어진다는 대칭성을 이용해 분수 조형을 만들고, 스마트폰 슬로모션으로 촬영해 전시한다.',
    q:'두 물줄기를 한 점에 모으려면 구멍의 깊이를 어떻게 정해야 할까? 구멍 세 개로 한 점에 모을 수 있을까?',
    why:'압력과 포물선 운동 계산이 <b>작품의 설계 도면</b>이 되는 프로젝트입니다. 「왜 이 구멍과 저 구멍이 한 점에서 만나는가」를 숫자로 설명할 수 있으면 아름다운 물줄기가 그대로 과학 전시가 됩니다.',
    link:'원리① 압력과 깊이(2번 탭) · R03 · 포물선 운동 · 조형 미술.',
    cap:'바닥에서 다른 높이의 구멍에서 나온 두 물줄기(왼쪽) → 한 점에서 만나는 포물선(가운데) → 스마트폰으로 촬영(오른쪽). 구멍 높이 h₁ · h₂(왼쪽 아래) · h₂ = H − h₁ 이면 한 점(가운데 아래) · 물줄기 촬영 · 스케치(오른쪽 아래)',
    parts:[['페트병 + 구멍','깊이 h₁, h₂ 구멍 2 개','못 · 송곳은 교사','구멍은 같은 크기로, 한 줄(같은 세로선)에 뚫는다. 막고 있다가 동시에 연다.'],
           ['수면 H 유지','일정한 수면','보충 호스','수면이 내려가면 물줄기가 짧아진다. 큰 병이나 보충으로 H 일정.'],
           ['도달 거리 x','x = 2√(h(H−h))','h = 5 와 25 → 같은 값','H = 30 cm 에서 h 와 H−h 가 같은 x 를 준다. 대칭성.'],
           ['바닥 눈금','만나는 점 표시','줄자 · 스티커','계산한 x 위치에 표적을 놓고 물줄기가 정확히 맞는지 확인한다.'],
           ['스케치','작품 설계도','숫자 표기','구멍의 위치와 예측 x 를 그림에 적는다. 작품 설명문의 근거.'],
           ['촬영 · 전시','슬로모션 영상','궤적 겹쳐 그리기','영상 프레임을 겹쳐 포물선을 그리고 이론선과 비교한다.']],
    budget:[['페트병(1.5 L 포함)','3','약 2천 원','—'],['못(교사)','1','약 1천 원','—'],['줄자 · 스티커','1','약 2천 원','—'],['대야','1','약 3천 원','—'],['스마트폰','1','보유','—']],
    steps:['병의 바닥에서 구멍까지의 높이와 수면 높이 H 를 정하고 구멍 두 개를 뚫는다(교사 시연).','이론 x 를 계산해(h₂ = H − h₁ 가 되도록) 표적을 바닥에 놓는다.','두 구멍을 동시에 열어 물줄기가 표적에서 만나는지 확인하고 영상을 찍는다.','h₂ 를 바꿔 가며 만나는 점이 어떻게 달라지는지 기록한다.','작품 이름 · 설계도 · 이론 곡선과 실제 궤적을 겹친 사진으로 전시물을 만든다.'],
    vars:['구멍 깊이 h₁, h₂','도달 거리 x₁, x₂ · 두 물줄기의 만남','수면 높이 · 구멍 크기 · 수평'],
    predict:[['h₁ = 5 · h₂ = 25 (H 30)','x₁ = '+fx(a.x1,1)+' · x₂ = '+fx(a.x2,1)+' cm → '+(a.meet?'만남!':'어긋남'),'h₂ = H − h₁ 이면 같은 거리'],
             ['h₁ = 10 · h₂ = 20','x₁ = '+fx(b.x1,1)+' · x₂ = '+fx(b.x2,1)+' cm → '+(b.meet?'만남!':'어긋남'),'대칭 쌍은 항상 만난다'],
             ['h₁ = 5 · h₂ = 10','x₁ = '+fx(c.x1,1)+' · x₂ = '+fx(c.x2,1)+' cm (차 '+fx(c.dx,1)+' cm)','대칭이 아니면 어긋난다'],
             ['h₁ = h₂ = 15','x = '+fx(d.x1,1)+' cm(최대)','한가운데(H/2)가 가장 멀리 간다']],
    data:{cols:['h₁ (cm)','h₂ = H−h₁','x₁ (cm)','x₂ (cm)'],
          rows:[3,5,8,10,13,15].map(function(h){ var o=c01(h,30-h); return [h,30-h,fx(o.x1,1),fx(o.x2,1)]; })},
    analysis:'영상에서 물줄기가 바닥에 닿는 위치를 읽어 이론 x 와 비교한다. 대칭 쌍에서 두 거리의 차가 몇 cm 인지 구하고 오차 원인(수면 하강 · 구멍 크기 · 수평)을 분석해 작품 설명문에 정리한다.',
    special:['🎨 작품 기획서',[['작품 이름','「한 점에서 만나는 물」'],['표현 아이디어','대칭인 구멍 쌍 3 개가 같은 점에 모이는 분수'],['과학 근거','p = ρgh · v = √(2gh) · x = 2√(h(H−h))'],['전시 구성','분수 + 설계도 + 이론 곡선 vs 영상 궤적 + 안전 문구']]],
    fails:[['물줄기가 한 점에서 안 만난다','대칭이 맞는지(h₂ = H − h₁) · 수면이 일정한지 확인'],['구멍에서 물이 번진다','구멍을 깔끔하게 · 테이프를 완전히 떼고'],['영상에서 궤적이 흐리다','검은 배경 + 조명 · 슬로모션 · 고정']],
    up:['<b>R03</b> — 깊이 대 거리 곡선 측정.','<b>C06</b> — 수압 인포그래픽.','<b>I10</b> — 사이펀과 유속.'],
    next:['원리① 압력과 깊이',2],
    eval:[['창의성','작품 구성 · 연출'],['과학 근거','x–h 계산 · 대칭성'],['제작','구멍 정밀도 · 일정한 수면'],['안전','날카로운 도구 · 물 미끄럼']],
    tip:'작품 설명판에 「h 와 H−h 의 곱이 같으면 거리도 같다」는 한 줄을 크게 쓰면 관람객이 원리를 바로 알아봅니다.' });
})();
SIMS.C01={ q:'두 구멍의 깊이를 바꾸면 두 물줄기는 같은 점에서 만날까?',
  a:{nm:'구멍 1 깊이 h₁',min:2,max:28,step:1,val:6,unit:'cm',d:0}, b:{nm:'구멍 2 깊이 h₂',min:2,max:28,step:1,val:24,unit:'cm',d:0},
  cap1:'수면 H = 30 cm 의 병에서 깊이 h₁, h₂ 의 구멍으로 나온 두 물줄기(파랑 · 초록). 도달 거리 x 가 같으면 한 점에서 만납니다.',
  cap2:'📊 구멍 깊이 대 도달 거리(최대 : h = 15 cm). 두 점의 높이가 같으면(점선) 두 물줄기가 만납니다.',
  note:'모형 : H = 30 cm · 구멍 지름이 같고 수면 일정 · x = 0.97·2√(h(H−h)) (수축 보정) · 공기 저항 무시. 구멍 사이 간섭은 없다고 가정.',
  anim:function(ctx,w,h,t,h1,h2,S){ var o=c01(h1,h2), H=30, sc=Math.min((h-70)/36,6), bx=w*0.1, bw=Math.min(60,w*0.12), floor=h-30, wy=floor-H*sc, ph=Math.min(1,t/2.4), xs=Math.min((w-bx-bw-30)/Math.max(o.x1,o.x2,10),sc), i, jets=[[h1,o.x1,COL.blue],[h2,o.x2,COL.ok]];
    ctx.fillStyle='rgba(56,189,248,.28)'; ctx.fillRect(bx,wy,bw,floor-wy); vessel(ctx,bx,wy-20,bw,floor-wy+20); ctx.strokeStyle=COL.axis2; ctx.beginPath(); ctx.moveTo(0,floor); ctx.lineTo(w,floor); ctx.stroke();
    jets.forEach(function(j){ var hh=Math.min(j[0],H-0.5), v=Math.sqrt(2*G*hh/100)*0.97, y=H-hh, tf=Math.sqrt(2*y/100/G), hy=floor-y*sc; ctx.strokeStyle=j[2]; ctx.lineWidth=2.4; ctx.beginPath(); for(i=0;i<=40;i++){ var f=i/40*ph, tt=f*tf, x=v*tt*100, yy=0.5*G*tt*tt*100, px=bx+bw+x*xs, py=hy+yy*sc; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); } ctx.stroke(); ctx.lineWidth=1; ctx.fillStyle=j[2]; ctx.beginPath(); ctx.arc(bx+bw,hy,3.5,0,6.283); ctx.fill(); });
    cvText(ctx,'x₁ = '+o.x1.toFixed(1)+' cm · x₂ = '+o.x2.toFixed(1)+' cm → '+(o.meet?'한 점에서 만난다 ✔':'어긋남 '+o.dx.toFixed(1)+' cm'),12,18,o.meet?COL.ok:COL.amber,'bold 12.5px system-ui,sans-serif'); cvText(ctx,'h₂ = H − h₁ = '+o.hsym+' cm 이면 만남',12,h-8,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,h1,h2,S){ var o=c01(h1,h2), pts=[],i; for(i=1;i<30;i+=0.5) pts.push([i,c01x(i,30)]);
    lineGraph(ctx,w,h,{xmin:0,xmax:30,ymin:0,ymax:32,xl:'구멍 깊이 h (cm)',yl:'도달 거리 x (cm)',title:'깊이 → 도달 거리 (두 구멍의 점)',curves:[{pts:pts,col:COL.dim,lw:2},{pts:[[0,o.x1],[30,o.x1]],col:COL.blue,lw:1.2,dash:[4,4]},{pts:[[0,o.x2],[30,o.x2]],col:COL.ok,lw:1.2,dash:[4,4]}],now:[h1,o.x1],legend:[['구멍 1',COL.blue],['구멍 2',COL.ok]]}); },
  kv:function(h1,h2,S){ var o=c01(h1,h2); return [['x₁',o.x1.toFixed(1)+' cm','a'],['x₂',o.x2.toFixed(1)+' cm','g'],['차이 |x₁−x₂|',o.dx.toFixed(1)+' cm','v2'],['한 점에서 만남?',o.meet?'예':'아니오'],['만나기 위한 h₂',o.hsym+' cm','r']]; } };

/* ── C02 : 유압 로봇 팔 ─────────────────────────────────────────────── */
function c02(La,r){ var Fin=10, eta=0.8, Fo=Fin*r*eta, tau=Fo*0.03, m=tau/(G*La/100), reach=La; return {Fo:Fo,tau:tau,m:m,A1:1.5,P:Fin/1.5e-4,gain:r*eta}; }
(function(){ var a=c02(15,4), b=c02(30,4), c=c02(15,2), d=c02(10,6);
  mkP({ id:'C02', t:'유압 로봇 팔 — 주사기 · 골판지로 만드는 움직이는 조형', icon:'🦾', type:'창의 · 제작', lv:2, dur:'2 주', cost:'약 1 ~ 2만 원',
    one:'골판지 팔의 관절에 주사기 쌍(작은 입력 주사기 + 큰 출력 주사기)을 연결해 호스로 움직이는 로봇 팔을 만든다. 입력 힘 · 주사기 면적비 · 팔 길이에 따라 들어 올릴 수 있는 질량과 도달 거리를 계산해 설계하고 시험한다.',
    q:'팔을 길게 만들면 들어 올릴 수 있는 무게는 어떻게 달라질까? 면적비를 키우면 무엇을 얻고 무엇을 잃을까?',
    why:'굴착기와 같은 구조를 <b>골판지 크기</b>로 만드는 프로젝트입니다. 파스칼의 원리(힘의 증폭)와 지레(돌림힘)가 함께 작용해 「큰 힘 + 먼 거리」의 거래가 눈에 보입니다. 완성품이 움직이는 모습은 전시에서도 큰 호응을 얻습니다.',
    link:'원리② 파스칼(3번 탭) · R04 · 돌림힘 · 지레 · 로봇 공학.',
    cap:'입력 주사기를 누르면 호스를 따라 힘이 전달된다(왼쪽) → 출력 주사기가 팔을 돌린다(가운데) → 들어 올리는 질량(오른쪽). 주사기 = 관절 구동기(왼쪽 아래) · 토크 = 힘 × 팔 길이(가운데 아래) · 들어 올리는 질량(오른쪽 아래)',
    parts:[['입력 주사기','5 mL','손으로 누르는 쪽','작은 단면 A₁. 한 손으로 누르는 힘 약 10 N 을 가정한다.'],
           ['출력 주사기','10 ~ 20 mL','관절에 연결','큰 단면 A₂. 면적비 r = A₂/A₁ 에 힘이 비례한다.'],
           ['골판지 팔','길이 L_a','관절 핀 + 막대','출력 주사기의 힘 F_o 가 관절에서 거리 0.03 m 에 작용한다고 설계한다.'],
           ['호스 · 물','투명 호스','공기 빼기 필수','공기가 들어가면 팔이 늘어져 움직인다(R05).'],
           ['집게 · 짐','가벼운 짐','들어 올리는 질량 m','토크 평형 F_o·0.03 = m g L_a 로 최대 질량을 예측한다.'],
           ['받침대 · 안전','손가락 끼임 주의','관절 덮개','가동 부위에 손가락이 끼지 않게 안전 덮개를 둔다.']],
    budget:[['주사기 5 mL · 20 mL','각 2','약 3천 원','—'],['투명 호스','2 m','약 3천 원','—'],['골판지 · 핀 · 접착제','1 세트','약 5천 원','—'],['추(짐)','1 세트','약 3천 원','—'],['색칠 재료','1','약 2천 원','—']],
    steps:['팔의 길이 L_a 와 관절에서 주사기 부착점 거리(0.03 m)를 정하고 설계 도면에 쓴다.','입력 · 출력 주사기의 안지름으로 면적비 r 을 구하고 출력 힘 F_o = η r F_in (η 약 0.8)을 계산한다.','토크 평형으로 들어 올릴 수 있는 최대 질량 m 을 예측한다.','팔을 조립해 호스를 연결하고 공기를 빼고 짐을 올려 실제 최대 질량을 측정한다.','L_a 와 r 을 바꿔 예측과 측정을 비교하고 작품 설명문을 쓴다.'],
    vars:['면적비 r · 팔 길이 L_a','들어 올리는 질량 m · 팔 끝 속도','주사기 마찰 · 공기 방울 · 관절 마찰'],
    predict:[['L_a 15 cm · r 4','F_o = '+fx(a.Fo,0)+' N → m = '+fx(a.m,2)+' kg','10 N × 4 × 0.8 = 32 N'],
             ['L_a 30 cm · r 4','m = '+fx(b.m,2)+' kg','팔이 2 배 길면 들어 올리는 질량은 1/2'],
             ['L_a 15 cm · r 2','F_o = '+fx(c.Fo,0)+' N → m = '+fx(c.m,2)+' kg','면적비가 작으면 힘이 작다'],
             ['L_a 10 cm · r 6','F_o = '+fx(d.Fo,0)+' N → m = '+fx(d.m,2)+' kg','면적비 ↑ + 짧은 팔 → 큰 질량']],
    data:{cols:['L_a (cm)','r','F_o (N)','m (kg)'],
          rows:[[10,4],[15,4],[20,4],[30,4],[15,2],[15,6]].map(function(q){ var o=c02(q[0],q[1]); return [q[0],q[1],fx(o.Fo,0),fx(o.m,2)]; })},
    analysis:'예측 질량과 실측 질량의 비(효율)를 L_a, r 별로 정리한다. 관절 마찰과 주사기 마찰이 큰 설정(작은 힘)에서 효율이 낮아지는지 확인하고, 힘 · 팔 길이 · 속도의 거래를 표로 설명한다.',
    special:['🎨 작품 기획서',[['작품 이름','「물로 움직이는 팔」'],['표현 아이디어','주사기와 호스만으로 움직이는 큰 팔 조형'],['과학 근거','파스칼 F_o = rF_in · 돌림힘 τ = F d'],['전시 구성','시연 + 설계도 + 질량 예측 표 + 안전 문구']]],
    fails:[['팔이 덜렁거린다','호스에 공기 · 관절 마찰이 작은 설계 점검'],['주사기가 빠진다','호스 끝을 클립 · 고무줄로 고정'],['손이 끼인다','관절에 안전 덮개 · 천천히 시연']],
    up:['<b>I01</b> — 유압 집게 설계.','<b>C08</b> — 유압 엘리베이터.','<b>R04</b> — 면적비와 효율 측정.'],
    next:['원리② 파스칼의 원리',3],
    eval:[['창의성','움직이는 조형'],['과학 근거','토크 · 면적비 계산'],['제작','정밀도 · 공기 제거'],['안전','가동부 덮개']],
    tip:'시연할 때 「입력 한 번에 팔 끝은 얼마나 움직이는가」도 같이 보여 주면 힘과 거리의 거래가 전달됩니다.' });
})();
SIMS.C02={ q:'팔의 길이와 면적비를 바꾸면 로봇 팔이 들어 올리는 질량은 어떻게 달라질까?',
  a:{nm:'팔 길이 L_a',min:8,max:40,step:1,val:15,unit:'cm',d:0}, b:{nm:'주사기 면적비 r',min:1,max:8,step:0.5,val:4,unit:'',d:1},
  cap1:'입력 주사기를 누르면 출력 주사기가 팔의 관절을 돌립니다. 팔이 길수록 같은 힘으로 들어 올릴 수 있는 질량이 줄어듭니다.',
  cap2:'📊 팔 길이에 따른 들어 올릴 수 있는 질량(면적비별). 곡선은 1/L_a 로 줄어듭니다.',
  note:'모형 : 입력 힘 10 N · 효율 0.8 · 출력 주사기 힘 F_o = 0.8 r·10 N 이 관절에서 3 cm 거리에 작용 · 토크 평형 m = F_o·0.03/(g L_a). 팔 자체 무게 · 관절 마찰 무시.',
  anim:function(ctx,w,h,t,La,r,S){ var o=c02(La,r), jx=w*0.34, jy=h*0.62, ph=(t%4)/4, u=ph<0.5?ph*2:1-(ph-0.5)*2, ang=-0.15-u*0.7, L=Math.min(w*0.42,La*5.2);
    ctx.fillStyle='#475569'; ctx.fillRect(jx-60,jy+14,120,12); ctx.strokeStyle=COL.white; ctx.lineWidth=7; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(jx,jy); ctx.lineTo(jx+Math.cos(ang)*L,jy+Math.sin(ang)*L); ctx.stroke(); ctx.lineWidth=1; ctx.lineCap='butt'; ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.arc(jx,jy,7,0,6.283); ctx.fill();
    var ex=jx+Math.cos(ang)*L, ey=jy+Math.sin(ang)*L, ld=Math.min(46,16+o.m*14); ctx.fillStyle=COL.blue; ctx.fillRect(ex-ld/2,ey,ld,ld*0.7); cvText(ctx,o.m.toFixed(2)+' kg',ex,ey+ld*0.45,'#07101f','bold 11.5px system-ui,sans-serif','center');
    var sx=w*0.08; ctx.fillStyle='rgba(56,189,248,.3)'; ctx.fillRect(sx,jy-60,16,48); ctx.fillStyle=COL.white; ctx.fillRect(sx-2,jy-60+u*14,20,5); cvArrow(ctx,sx+8,jy-82,sx+8,jy-64+u*14,COL.amber,2.5); cvText(ctx,'F_in 10 N',sx+22,jy-78,COL.amber,'11px system-ui,sans-serif');
    cvText(ctx,'면적비 '+r+' · F_o = '+o.Fo.toFixed(0)+' N · 최대 질량 '+o.m.toFixed(2)+' kg · 팔 끝 도달 '+La+' cm',12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,La,r,S){ var cs=[[2,COL.ok],[4,COL.blue],[6,COL.amber]], P=makePlot(ctx,w,h,{xmin:8,xmax:40,ymin:0,ymax:6,xlabel:'팔 길이 L_a (cm)',ylabel:'들어 올리는 질량 (kg)',title:'팔 길이 → 최대 질량 (면적비별)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(1)}), i;
    cs.forEach(function(q){ var pts=[]; for(i=8;i<=40;i+=1) pts.push([i,Math.min(6,c02(i,q[0]).m)]); plotLine(ctx,P,pts,q[1],1.6,[4,3]); }); var pts=[]; for(i=8;i<=40;i+=1) pts.push([i,Math.min(6,c02(i,r).m)]); plotLine(ctx,P,pts,COL.white,2.6); plotPoints(ctx,P,[[La,c02(La,r).m]],COL.amber,7); legend(ctx,P.x1-120,P.y1+14,[['r 2',COL.ok],['r 4',COL.blue],['r 6',COL.amber],['지금 r',COL.white]]); },
  kv:function(La,r,S){ var o=c02(La,r); return [['유압 이득 η·r',o.gain.toFixed(1)+' 배','a'],['출력 힘 F_o',o.Fo.toFixed(0)+' N','g'],['관절 토크',o.tau.toFixed(2)+' N·m','v2'],['최대 질량',o.m.toFixed(2)+' kg'],['입력 압력',(o.P/1000).toFixed(0)+' kPa','r']]; } };

/* ── C03 : 구명조끼 디자인 전시 ─────────────────────────────────────── */
function c03(Vf,m){ var Vb=m/1010, sinkF=(1010-1000)*Vb*G, Bj=RHO_W*(Vf/1000)*G-30*(Vf/1000)*G, net=Bj-sinkF, need=0.12*m*G, cls=net>=275?'275 N급':net>=150?'150 N급':net>=100?'100 N급':net>=50?'50 N급':'부족'; return {net:net,B:Bj,sinkF:sinkF,need:need,margin:net/need,cls:cls}; }
(function(){ var a=c03(5,50), b=c03(8,50), c=c03(12,80), d=c03(3,50);
  mkP({ id:'C03', t:'구명조끼 디자인 전시 — 얼마나 떠야 안전한가', icon:'🦺', type:'창의 · 전시', lv:1, dur:'1 주', cost:'약 1 ~ 2만 원',
    one:'구명조끼의 부력이 어디서 오는지(발포체 부피 × 물의 밀도 × g)를 계산하고, 체중 · 발포체 부피에 따라 필요한 부력(50 · 100 · 150 · 275 N 등급)을 만족하는지 보여 주는 전시 · 체험물을 만든다. 모형은 플라스틱 병 · 스티로폼으로 만들고 실제 착용 시험은 하지 않는다.',
    q:'발포체 부피가 몇 리터면 안전한 구명조끼가 될까? 체중이 무거운 사람에게는 더 많은 부력이 필요할까?',
    why:'구명조끼는 <b>부력 = 생명</b>입니다. 부력 공식으로 「왜 이 크기여야 하는가」를 설명하는 전시는 안전 교육과 과학이 만나는 좋은 작품입니다. 미국 해안경비대(USCG) 통계처럼 착용 여부가 생존에 크게 영향을 미친다는 사실도 함께 소개할 수 있습니다.',
    link:'원리③ 아르키메데스(4번 탭) · 7번 탭(구명 안전) · 안전 교육 · 디자인.',
    cap:'발포체 조끼 모형(왼쪽) → 체중 · 발포체 부피에 따른 부력 막대(가운데) → 등급별 부력 N(오른쪽). 발포체 부피 V_f(왼쪽 아래) · 부력 B = ρVg(가운데 아래) · 등급별 부력(오른쪽 아래)',
    parts:[['발포체','스티로폼 · 폴리에틸렌 폼','부피 V_f','물에 가라앉지 않는 가벼운 발포체. 밀도 약 30 kg/m³ → 거의 부피만큼 부력.'],
           ['조끼 모형','마네킹 · 인형','체중을 대신하는 추','실제 착용 시험은 하지 않는다. 마네킹에 질량 추를 달아 수조에서 시험한다.'],
           ['부력 계산','B = ρ_w V_f g','N 단위','1 L 발포체 = 약 9.8 N 의 부력. 몸이 가라앉는 힘(밀도 1010 어림)을 뺀다.'],
           ['등급','50 · 100 · 150 · 275 N','규격(ISO 12402 계열)','용도별 최소 부력 등급. 수치는 공개 규격을 확인해 쓴다.'],
           ['체험 코너','부력 저울','들어 보기','발포체를 물에 눌러 담가 보고 손에 느껴지는 힘을 체험한다.'],
           ['안전 메시지','착용 습관','통계와 함께','USCG 2023 통계 — 익사자의 87 % 가 구명조끼 미착용. 출처와 연도를 표기.']],
    budget:[['스티로폼 · 폼','1 세트','약 5천 원','—'],['마네킹 · 인형','1','약 5천 원','—'],['수조 · 저울','1','약 1만 원','—'],['포스터 재료','1','약 2천 원','—'],['QR(자료 출처)','1','무료','—']],
    steps:['발포체 부피(리터)를 물 채운 눈금통에 눌러 담가 재고 부력 B = ρ_w V g 를 계산한다.','마네킹(질량 추 포함)의 몸이 가라앉는 힘(약 (1010−1000)·V_b g)을 계산해 순부력 = 부력 − 가라앉는 힘을 구한다.','수조에서 마네킹이 뜨는지 시험하고 계산과 비교한다.','등급(50 · 100 · 150 · 275 N)별로 필요한 발포체 부피 표를 만든다.','전시 포스터(부력 공식 · 통계 · 올바른 착용법)와 체험물을 완성한다.'],
    vars:['발포체 부피 V_f · 체중 m','순부력 · 등급','발포체 밀도 · 물의 종류'],
    predict:[['V_f 5 L · 체중 50 kg','순부력 '+fx(a.net,0)+' N → '+a.cls,'1 L 약 9.8 N'],
             ['V_f 8 L · 체중 50 kg','순부력 '+fx(b.net,0)+' N → '+b.cls,'부피가 늘면 등급이 오른다'],
             ['V_f 12 L · 체중 80 kg','순부력 '+fx(c.net,0)+' N · 안전 여유 '+fx(c.margin,1)+' 배','무거운 사람은 더 필요'],
             ['V_f 3 L · 체중 50 kg','순부력 '+fx(d.net,0)+' N → '+d.cls,'부력이 부족하면 머리가 물에 잠길 수 있다']],
    data:{cols:['V_f (L)','체중 (kg)','순부력 (N)','안전 여유 (배)','등급'],
          rows:[[3,50],[5,50],[8,50],[10,50],[10,80],[15,80]].map(function(q){ var o=c03(q[0],q[1]); return [q[0],q[1],fx(o.net,0),fx(o.margin,1),o.cls]; })},
    analysis:'계산한 순부력과 수조 시험의 일치도를 비교하고 필요 부력 대비 여유율을 정리한다. 모형의 한계(몸의 밀도 · 호흡 · 의복 · 파도)와 실제 규격 시험이 다르다는 점, 계산이 안전을 보장하지 않는다는 점을 전시물에 명시한다.',
    special:['🎨 작품 기획서',[['작품 이름','「부력이 생명을 지킨다」 — 구명조끼 체험 전시'],['표현 아이디어','발포체를 눌러 부력을 손으로 느끼는 체험 + 통계 포스터'],['과학 근거','B = ρVg · 순부력 · 등급(N) · USCG 통계(2023)'],['전시 구성','체험 수조 + 계산 카드 + 안전 문구(실제 착용 시험은 하지 않음)']]],
    fails:[['모형이 가라앉는다','발포체 부피를 늘리거나 추 질량을 줄이기 · 계산 다시 확인'],['등급 수치가 정확한지 걱정','공식 규격 문서에서 확인하고 출처 표기 · 교육용 표기'],['통계가 오래됐다','연도를 표기하고 최신 공식 자료로 갱신']],
    up:['<b>C04</b> — 잠수함 밸러스트 쇼.','<b>I05</b> — 침수 감지 알림.','<b>7번 탭</b> — 구명 안전 통계.'],
    next:['활용 현황',7],
    eval:[['과학 근거','부력 계산 · 등급'],['전시 효과','체험성 · 메시지'],['정직','출처 · 한계 표기'],['안전','실제 착용 시험 금지']],
    tip:'전시에서 가장 강한 문장은 숫자 하나입니다 — 「익사자의 87 % 가 구명조끼를 입지 않았다(USCG 2023)」처럼 출처와 함께.' });
})();
SIMS.C03={ q:'발포체 부피와 체중을 바꾸면 구명조끼의 순부력과 등급은 어떻게 달라질까?',
  a:{nm:'발포체 부피 V_f',min:1,max:20,step:0.5,val:6,unit:'L',d:1}, b:{nm:'체중 m',min:20,max:100,step:5,val:50,unit:'kg',d:0},
  cap1:'발포체가 만드는 부력(초록)과 몸이 가라앉는 힘(빨강), 그리고 머리를 물 밖에 두는 데 필요한 힘(노랑 점선)의 비교입니다.',
  cap2:'📊 발포체 부피에 따른 순부력(체중별). 점선 = 등급 기준(50 · 100 · 150 · 275 N).',
  note:'모형 : B_조끼 = (ρ_w − ρ_foam)V_f g (ρ_foam = 30 kg/m³) · 몸이 가라앉는 힘 = (1010 − 1000)·(m/1010)·g · 순부력 = B − 가라앉는 힘 · 필요 부력 = 0.12 m g(머리 지지, 교육용 어림). 실제 규격은 ISO 12402 등 공식 문서를 확인하세요.',
  anim:function(ctx,w,h,t,Vf,m,S){ var o=c03(Vf,m), top=44, bot=h-40, bw=Math.min(70,w*0.12), x0=w*0.1, mx=Math.max(o.B,o.sinkF,o.need,280)*1.1, fr=Math.min(1,t/2.2), i;
    [[o.B,COL.ok,'발포체 부력'],[o.sinkF,COL.grav,'몸이 가라앉는 힘'],[o.net,o.net>=o.need?COL.ok:COL.amber,'순부력']].forEach(function(q,k){ var x=x0+k*(bw+22), hh=(bot-top)*Math.max(0,q[0])/mx*fr; ctx.fillStyle=q[1]; ctx.fillRect(x,bot-hh,bw,hh); ctx.strokeStyle=COL.axis2; ctx.strokeRect(x,top,bw,bot-top); cvText(ctx,(q[0]*fr).toFixed(0)+' N',x+bw/2,bot-hh-6,COL.text,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,q[2],x+bw/2,bot+14,COL.tick,'10.5px system-ui,sans-serif','center'); });
    var yn=bot-(bot-top)*o.need/mx; ctx.strokeStyle=COL.amber; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.moveTo(x0-6,yn); ctx.lineTo(x0+3*(bw+22),yn); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'필요 '+o.need.toFixed(0)+' N',x0+3*(bw+22)+4,yn+4,COL.amber,'11px system-ui,sans-serif');
    var lx=w*0.7; [50,100,150,275].forEach(function(c,k){ var y=top+14+k*30, ok=o.net>=c; ctx.fillStyle=ok?COL.ok:COL.dim; ctx.fillRect(lx,y,16,16); cvText(ctx,c+' N급'+(ok?' ✔':''),lx+24,y+13,ok?COL.ok:COL.tick,(ok?'bold ':'')+'12px system-ui,sans-serif'); });
    cvText(ctx,'V_f '+Vf+' L · 체중 '+m+' kg → 순부력 '+o.net.toFixed(0)+' N · 등급 '+o.cls,12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,Vf,m,S){ var P=makePlot(ctx,w,h,{xmin:1,xmax:20,ymin:-60,ymax:220,xlabel:'발포체 부피 V_f (L)',ylabel:'순부력 (N)',title:'발포체 부피 → 순부력 (체중별)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)}), i;
    [50,100,150].forEach(function(c){ plotLine(ctx,P,[[1,c],[20,c]],COL.dim,1,[3,4]); }); [[50,COL.ok],[80,COL.blue]].forEach(function(q){ var pts=[]; for(i=1;i<=20;i+=0.5) pts.push([i,c03(i,q[0]).net]); plotLine(ctx,P,pts,q[1],1.6,[5,3]); }); var pts=[]; for(i=1;i<=20;i+=0.5) pts.push([i,c03(i,m).net]); plotLine(ctx,P,pts,COL.white,2.6); plotPoints(ctx,P,[[Vf,c03(Vf,m).net]],COL.amber,7); legend(ctx,P.x1-130,P.y0-64,[['50 kg',COL.ok],['80 kg',COL.blue],['지금',COL.white]]); },
  kv:function(Vf,m,S){ var o=c03(Vf,m); return [['발포체 부력',o.B.toFixed(0)+' N','a'],['몸이 가라앉는 힘',o.sinkF.toFixed(1)+' N','g'],['순부력',o.net.toFixed(0)+' N','v2'],['안전 여유',o.margin.toFixed(1)+' 배'],['등급(어림)',o.cls,'r']]; } };

/* ── C04 : 잠수함 밸러스트 쇼 ────────────────────────────────────────── */
function c04(vb,rf){ var V=1000, m0=800, m=m0+vb*1, Fn=(rf*V*1e-6-m*1e-3)*G, vneed=rf*V*1e-6*1000-m0, vel=Fn/0.8; return {Fn:Fn,vneed:vneed,vel:vel,state:Fn>0.01?'뜬다':Fn<-0.01?'가라앉는다':'중성 부력'}; }
(function(){ var a=c04(0,1000), b=c04(200,1000), c=c04(300,1000), d=c04(200,1025);
  mkP({ id:'C04', t:'잠수함 밸러스트 쇼 — 뜨고 가라앉고 멈추는 모형 잠수함', icon:'🚤', type:'창의 · 시연', lv:2, dur:'2 주', cost:'약 1 ~ 2만 원',
    one:'페트병 잠수함에 밸러스트(물)를 주입 · 배출해 부력을 조절하는 시연 모형을 만든다. 밸러스트 물의 양으로 중성 부력(떠 있지도 가라앉지도 않는 상태)을 찾고, 담수와 소금물에서 필요한 물의 양이 달라지는 것을 보여 준다.',
    q:'잠수함이 바닷속에서 가만히 떠 있으려면 밸러스트 물이 정확히 얼마나 필요할까? 소금물에서는 어떻게 달라질까?',
    why:'아르키메데스 원리를 <b>살아 움직이는 장치</b>로 보여 주는 시연입니다. 부력이 무게보다 크면 뜨고 작으면 가라앉으며, 정확히 같을 때 중성이 됩니다. 시연이 성공하려면 계산과 미세 조정이 필요해 탐구 과정이 그대로 드러납니다.',
    link:'원리③ 아르키메데스(4번 탭) · 원리④ 뜨기(5번 탭) · R10 · I04.',
    cap:'병 잠수함의 밸러스트 탱크에 물을 넣는다(왼쪽) → 평균 밀도가 물과 같을 때 중성 부력(가운데) → 깊이 조절 시연(오른쪽). 밸러스트 물 넣기(왼쪽 아래) · 중성 부력 = 평균 밀도 같다(가운데 아래) · 깊이 조절 쇼(오른쪽 아래)',
    parts:[['병 잠수함','500 mL ~ 1 L 병','밀폐 · 방수','안으로 물이 새지 않게 밀폐하고 고리에 추를 달아 자세(뒤집힘)를 맞춘다.'],
           ['밸러스트 탱크','병 속 물','주사기 · 호스로 주입','물을 넣으면 질량이 늘어 가라앉는다. 배출(공기 주입)하면 뜬다.'],
           ['중성 부력','ρ평균 = ρ_액체','물 질량 정확히','밸러스트 물의 양을 조금씩 바꿔 정지 위치를 찾는다. 담수와 소금물에서 다르다.'],
           ['추 · 자세','무게중심 아래 고정','뒤집힘 방지','무게중심이 부력중심 아래에 있어야 안정(5번 탭).'],
           ['수조','투명 수조 60 cm','깊이 눈금','깊이를 눈금으로 읽고 속도를 측정한다. 수조 벽에 닿지 않게.'],
           ['안전','전기 부품 제외','물 · 낮은 압력만','전동 펌프를 쓰는 경우 방수 · 저전압(5 V 이하)을 지킨다.']],
    budget:[['페트병 · 주사기','1 세트','약 3천 원','—'],['호스 · 클립 · 추','1 세트','약 3천 원','—'],['투명 수조','1','약 1만 원','—'],['소금','1','약 1천 원','—'],['방수 테이프','1','약 1천 원','—']],
    steps:['병 잠수함의 총 부피 V 와 빈 질량 m₀ 를 재고 필요한 밸러스트 물 v* = ρV − m₀ 를 계산한다.','계산한 양만큼 주사기로 물을 넣어 수조에서 뜨는지 가라앉는지 관찰한다.','물의 양을 ±5 mL 씩 조정해 정지(중성) 상태를 찾는다.','소금물 수조로 바꿔 같은 방법으로 v* 를 찾고 이론 차이(ρ 비)와 비교한다.','깊이 조절 시연(위로 · 아래로 · 정지)을 영상으로 찍어 전시한다.'],
    vars:['밸러스트 물 부피 v_b · 액체 밀도 ρ_f','순부력 · 상승/하강 속도','병 밀폐 · 자세 · 온도'],
    predict:[['v_b = 0 · 담수','순부력 '+fx(a.Fn*1000,0)+' mN → '+a.state,'병이 가벼워서 뜬다'],
             ['v_b = 200 mL · 담수','순부력 '+fx(b.Fn*1000,0)+' mN → '+b.state,'중성 부력 v* = '+fx(b.vneed,0)+' mL'],
             ['v_b = 300 mL · 담수','순부력 '+fx(c.Fn*1000,0)+' mN → '+c.state,'물이 많으면 가라앉는다'],
             ['v_b = 200 mL · 해수(1025)','순부력 '+fx(d.Fn*1000,0)+' mN → '+d.state,'소금물에서는 더 많은 물 필요(v* '+fx(d.vneed,0)+' mL)']],
    data:{cols:['v_b (mL)','ρ_f (kg/m³)','순부력 (mN)','상태'],
          rows:[[0,1000],[100,1000],[200,1000],[250,1000],[200,1025],[225,1025]].map(function(q){ var o=c04(q[0],q[1]); return [q[0],q[1],fx(o.Fn*1000,0),o.state]; })},
    analysis:'필요한 밸러스트 양의 예측값과 실측값의 차이를 계산하고 오차 원인(공기 포함 · 병 부피 오차)을 분석한다. 담수와 해수에서의 차이가 밀도 비와 일치하는지 확인하고, 중성 부력의 불안정(조금만 변해도 상승 · 하강)을 설명한다.',
    special:['🎨 작품 기획서',[['작품 이름','「조용한 잠수함」 — 중성 부력 시연'],['표현 아이디어','물 한 방울의 차이로 뜨고 가라앉는 장면'],['과학 근거','B = ρVg · 중성 부력 ρ평균 = ρ_f'],['전시 구성','잠수함 시연 + 계산 카드 + 담수/해수 비교']]],
    fails:[['정지가 안 된다','밸러스트 양을 ±2 mL 씩 미세 조정 · 온도 일정'],['병이 뒤집힌다','추를 아래에 · 중심 낮추기'],['물이 샌다','뚜껑 밀폐 · 방수 테이프']],
    up:['<b>I04</b> — 자동 부력 조절 물고기.','<b>R10</b> — 카르테시안 잠수부.','<b>C03</b> — 구명조끼 전시.'],
    next:['원리③ 아르키메데스의 원리',4],
    eval:[['창의성','시연 연출'],['정량 설계','밸러스트 계산'],['제작','밀폐 · 안정'],['안전','전기 부품 방수']],
    tip:'정지 상태를 일부러 못 찾고 흔들리는 모습을 보여 준 뒤 「미세 조정 후 성공」을 시연하면 과정이 드러나는 좋은 발표가 됩니다.' });
})();
SIMS.C04={ q:'밸러스트 물의 양과 액체 밀도를 바꾸면 모형 잠수함은 뜰까, 가라앉을까, 멈출까?',
  a:{nm:'밸러스트 물 v_b',min:0,max:400,step:5,val:150,unit:'mL',d:0}, b:{nm:'액체 밀도 ρ_f',min:1000,max:1030,step:5,val:1000,unit:'kg/m³',d:0},
  cap1:'수조 속 모형 잠수함(부피 1 L, 빈 질량 800 g). 밸러스트 물이 중성 값보다 적으면 떠오르고 많으면 가라앉습니다. 막대는 순부력.',
  cap2:'📊 위 : 밸러스트 물에 따른 순부력(0 선 = 중성 부력). 아래 : 시간에 따른 깊이(속도 = 순부력/0.8).',
  note:'모형 : 부피 1000 cm³ · 빈 질량 800 g · 순부력 = ρ_f V g − (800+v_b) g · 점성 저항으로 종단 속도 = F_n/0.8 (N·s/m) · 수조 깊이 60 cm. 선체 팽창 · 공기 부피 변화 무시.',
  anim:function(ctx,w,h,t,vb,rf,S){ var o=c04(vb,rf), top=30, bot=h-20, bx=w*0.3, bw=Math.min(180,w*0.35), z0=0.5, z=Math.max(0.05,Math.min(0.95,z0-o.vel*t*0.35*0.01*40)), y=top+(bot-top)*z, sh=0.5;
    ctx.fillStyle='rgba(56,189,248,.22)'; ctx.fillRect(bx-bw/2,top,bw,bot-top); vessel(ctx,bx-bw/2,top-6,bw,bot-top+6); ctx.fillStyle='#94a3b8'; ctx.beginPath(); ctx.ellipse(bx,y,42,15,0,0,6.283); ctx.fill(); ctx.strokeStyle=COL.white; ctx.stroke(); ctx.fillStyle='#475569'; ctx.fillRect(bx-6,y-24,12,10);
    var wl=Math.min(30,(vb/400)*26); ctx.fillStyle='rgba(56,189,248,.7)'; ctx.fillRect(bx-26,y+14-wl*0.5,52,wl*0.5); var fl=Math.max(-60,Math.min(60,o.Fn*300)); if(Math.abs(fl)>3) cvArrow(ctx,bx+58,y,bx+58,y-fl,fl>0?COL.ok:COL.grav,3);
    var sx=w*0.68, sw=60, mx=0.5, hh=(bot-top-30)*Math.min(1,Math.abs(o.Fn)/mx); ctx.fillStyle=o.Fn>=0?COL.ok:COL.grav; ctx.fillRect(sx,top+(bot-top)/2-(o.Fn>=0?hh/2:0),sw,hh/2); ctx.strokeStyle=COL.axis2; ctx.strokeRect(sx,top,sw,bot-top); cvLine(ctx,[[sx-6,top+(bot-top)/2],[sx+sw+6,top+(bot-top)/2]],COL.dim,1.2); cvText(ctx,'순부력',sx+sw/2,bot+12,COL.tick,'11px system-ui,sans-serif','center');
    cvText(ctx,'v_b = '+vb+' mL · 순부력 '+(o.Fn*1000).toFixed(0)+' mN → '+o.state+' (중성 필요 '+o.vneed.toFixed(0)+' mL)',12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,vb,rf,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:400,ymin:-3,ymax:3,ylabel:'순부력 (N)',title:'밸러스트 → 순부력 (0 = 중성)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var a=[],b=[]; for(i=0;i<=400;i+=10){ a.push([i,c04(i,1000).Fn]); b.push([i,c04(i,1025).Fn]); } plotLine(ctx,P,[[0,0],[400,0]],COL.dim,1.3,[5,4]); plotLine(ctx,P,a,COL.blue,2,rf===1000?null:[4,3]); plotLine(ctx,P,b,COL.ok,2,rf===1025?null:[4,3]); plotPoints(ctx,P,[[vb,c04(vb,rf).Fn]],COL.amber,7); legend(ctx,P.x1-110,P.y1+14,[['담수 1000',COL.blue],['해수 1025',COL.ok]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:10,ymin:0,ymax:0.6,xlabel:'시간 (s)',ylabel:'깊이 (m)',title:'시간 → 깊이 (시작 0.3 m)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ var o=c04(vb,rf), pts=[]; for(i=0;i<=10;i+=0.25) pts.push([i,Math.max(0,Math.min(0.6,0.3-o.vel*i*0.2))]); plotLine(ctx,P,pts,COL.amber,2.4); }); },
  kv:function(vb,rf,S){ var o=c04(vb,rf); return [['순부력',(o.Fn*1000).toFixed(0)+' mN','a'],['상태',o.state,'g'],['중성 필요 물 v*',o.vneed.toFixed(0)+' mL','v2'],['차이 v_b − v*',(vb-o.vneed).toFixed(0)+' mL'],['종단 속도',Math.abs(o.vel*100).toFixed(1)+' cm/s','r']]; } };

/* ── C05 : 소금물 색 층 쌓기(밀도 탑) ─────────────────────────────── */
function c05(n,cmax){ var L=[],i; for(i=0;i<n;i++){ var c=cmax*(1-i/(n-1||1)); L.push({c:c,rho:998.2+0.7*c}); } var dr=L.length>1? L[0].rho-L[1].rho : 0, N=Math.sqrt(G*dr/1000/0.02); return {L:L,dr:dr,N:N,ok:dr>=8}; }
(function(){ var a=c05(3,150), b=c05(5,250), c=c05(5,50), d=c05(4,120);
  mkP({ id:'C05', t:'소금물 색 층 쌓기 — 밀도 탑 만들기', icon:'🧪', type:'창의 · 조형', lv:1, dur:'1 주', cost:'약 1 만 원',
    one:'소금 농도가 다른 물에 서로 다른 식용 색소를 타서 밀도가 큰 것을 아래에 두고 숟가락 등으로 천천히 쌓아 무지개 색 층을 만든다. 층 사이의 밀도 차 Δρ 가 클수록 안정하다는 것을 확인하고 층별 농도 · 밀도 표를 설계한다.',
    q:'몇 개의 층까지 섞이지 않고 쌓을 수 있을까? 층 사이에 밀도 차가 얼마나 있어야 안정할까?',
    why:'「밀도가 큰 액체는 아래」라는 아르키메데스 원리의 결과를 <b>아름다운 작품</b>으로 확인합니다. 층이 섞이는지 안 섞이는지의 경계를 밀도 차로 말할 수 있으면 실험 설계가 정량적이 됩니다.',
    link:'원리③ 아르키메데스(4번 탭) · R02 · 밀도 · 확산 · 해양의 성층.',
    cap:'색이 다른 소금물을 밀도 순서대로 쌓은 탑(왼쪽) → 농도 – 밀도 표(가운데) → 쌓는 순서(오른쪽). 밀도가 작은 것이 위(왼쪽 아래) · 색 · 염도 순서표(가운데 아래) · 층 쌓는 순서(오른쪽 아래)',
    parts:[['소금물 층','농도 c₁ > c₂ > …','c 를 g/L 로 기록','가장 진한 것이 가장 아래. 농도 차가 클수록 안정하다.'],
           ['식용 색소','4 ~ 5 색','층마다 다른 색','색소 때문에 밀도가 거의 변하지 않는다(소량).'],
           ['밀도 계산','ρ ≈ 998 + 0.7c','R02 의 직선','농도에서 밀도를 계산해 설계표를 만든다.'],
           ['쌓는 도구','숟가락 · 빨대 · 주사기','천천히 흘려 넣기','숟가락 뒷면으로 벽을 타고 내려가게 부어 섞임을 줄인다.'],
           ['투명 용기','가늘고 긴 컵','층이 잘 보이게','지름이 작은 용기는 쌓기 쉽고, 층 두께가 눈에 띈다.'],
           ['안정성 판단','Δρ ≥ 8 kg/m³','경계가 선명한지','Δρ 가 너무 작으면 확산과 흔들림으로 섞인다. 며칠 관찰한다.']],
    budget:[['소금 · 설탕','1 kg','약 2천 원','—'],['식용 색소','1 세트','약 3천 원','—'],['투명 컵 · 숟가락','1 세트','약 3천 원','—'],['주사기','2','약 2천 원','—'],['저울','1','학교','—']],
    steps:['층 수 n 과 최대 농도 c_max 를 정하고 각 층 농도를 c_max 에서 0 까지 같은 간격으로 계산한다.','각 농도의 소금물을 만들어 색소를 탄다(완전히 녹인다).','가장 진한 것부터 컵 바닥에 붓고, 다음 층은 숟가락 뒷면에 대고 천천히 붓는다.','층 사이 경계가 선명한지 사진으로 기록하고 시간(1 시간 · 1 일 · 1 주)에 따라 변화를 관찰한다.','Δρ 가 작은 층을 일부러 넣어 섞이는 정도를 비교하고 설계표를 완성한다.'],
    vars:['층 수 n · 최대 농도 c_max','층 사이 밀도 차 Δρ · 경계 선명도','붓는 속도 · 용기 · 시간'],
    predict:[['n = 3 · c_max 150','Δρ = '+fx(a.dr,1)+' kg/m³ · '+(a.ok?'안정':'불안정'),'층 사이 차이가 충분'],
             ['n = 5 · c_max 250','Δρ = '+fx(b.dr,1)+' kg/m³ · '+(b.ok?'안정':'불안정'),'농도 차가 커서 5 층도 가능'],
             ['n = 5 · c_max 50','Δρ = '+fx(c.dr,1)+' kg/m³ · '+(c.ok?'안정':'불안정(섞임 우려)'),'밀도 차가 작아 쉽게 섞인다'],
             ['n = 4 · c_max 120','Δρ = '+fx(d.dr,1)+' kg/m³ · N = '+fx(d.N,2)+' rad/s','안정도 N 이 크면 흔들림에 강하다']],
    data:{cols:['층 번호 (위 → 아래)','c (g/L)','ρ (kg/m³)','Δρ 위층과의 차'],
          rows:c05(5,250).L.map(function(q,i,L){ return [L.length-i,fx(q.c,0),fx(q.rho,0),i<L.length-1? fx(q.rho-L[i+1].rho,0) : '—']; }).reverse()},
    analysis:'Δρ 대 경계 선명도(1 일 후 · 1 주 후 두께)를 정리해 안정 한계 Δρ* 를 추정한다. 안정도 N = √(gΔρ/(ρΔz)) 가 클수록 섞임이 어렵다는 것을 비교하고, 해양의 성층(염분 · 온도)과 연결해 설명한다.',
    special:['🎨 작품 기획서',[['작품 이름','「밀도의 무지개 탑」'],['표현 아이디어','투명 컵 속 5 색 소금물 층'],['과학 근거','ρ ≈ 998 + 0.7c · 밀도가 큰 층이 아래 · 안정도 N'],['전시 구성','밀도 탑 + 농도 · 밀도 표 + 흔들어 보는 체험 금지 안내']]],
    fails:[['층이 섞인다','천천히 · 숟가락 뒷면 · 밀도 차를 더 크게'],['경계가 흐려진다','시간이 지나면 확산으로 흐려짐 — 사진으로 기록'],['색이 번진다','색소를 소량만 · 가장 아래부터 쌓기']],
    up:['<b>R02</b> — 소금물 농도와 밀도.','<b>I03</b> — 비중계.','<b>C04</b> — 잠수함 밸러스트.'],
    next:['원리③ 아르키메데스의 원리',4],
    eval:[['창의성','색 · 구성'],['정량 설계','농도 · 밀도 계산'],['안정성 분석','Δρ 와 섞임'],['안전','소금 · 색소 취급']],
    tip:'「천천히 흔들면 층이 어떻게 되는지」를 영상으로 보여 주면 성층의 안정을 한눈에 이해시킬 수 있습니다.' });
})();
SIMS.C05={ q:'층의 수와 최대 염도를 바꾸면 밀도 탑의 층 사이 밀도 차와 안정성은 어떻게 달라질까?',
  a:{nm:'층의 수 n',min:2,max:6,step:1,val:4,unit:'층',d:0}, b:{nm:'가장 진한 층의 염도',min:20,max:250,step:10,val:150,unit:'g/L',d:0},
  cap1:'색 층으로 쌓은 소금물 탑. 아래로 갈수록 염도(밀도)가 큽니다. 오른쪽 숫자는 각 층의 밀도입니다.',
  cap2:'📊 높이에 따른 밀도 분포(계단). 인접 층의 밀도 차가 안정도 N 과 안정 판정을 정합니다(Δρ ≥ 8 kg/m³ 어림).',
  note:'모형 : ρ ≈ 998.2 + 0.7c (c : g/L) · 층 두께 2 cm · 안정도 N = √(gΔρ/(ρΔz)) · 안정 어림 기준 Δρ ≥ 8 kg/m³ (확산 · 흔들림을 무시한 교육용). 실제 섞임은 확산 · 붓는 방법에 크게 의존합니다.',
  anim:function(ctx,w,h,t,n,cm,S){ var o=c05(n,cm), top=34, bot=h-26, cx=w*0.3, cw=Math.min(110,w*0.22), lh=(bot-top)/n, cols=['#fb7185','#fbbf24','#34d399','#38bdf8','#a78bfa','#f472b6'], fr=Math.min(1,t/2.4);
    o.L.slice().reverse().forEach(function(q,i){ var idx=n-1-i, y=bot-(i+1)*lh, hh=lh*Math.min(1,Math.max(0,fr*n-i)); ctx.fillStyle=cols[idx%6]; ctx.globalAlpha=0.7; ctx.fillRect(cx-cw/2,bot-i*lh-hh,cw,hh); ctx.globalAlpha=1; if(hh>lh*0.5) cvText(ctx,'ρ '+q.rho.toFixed(0)+' (c '+q.c.toFixed(0)+')',cx+cw/2+10,bot-i*lh-hh/2+4,COL.text,'11.5px system-ui,sans-serif'); });
    ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.strokeRect(cx-cw/2,top,cw,bot-top); ctx.lineWidth=1;
    cvText(ctx,'Δρ = '+o.dr.toFixed(1)+' kg/m³ · 안정도 N = '+o.N.toFixed(2)+' rad/s → '+(o.ok?'안정 ✔':'섞임 우려'),12,18,o.ok?COL.ok:COL.grav,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,n,cm,S){ var o=c05(n,cm), P=makePlot(ctx,w,h,{xmin:990,xmax:Math.max(1010,998.2+0.7*cm+10),ymin:0,ymax:n,xlabel:'밀도 (kg/m³)',ylabel:'층 번호 (아래=1)',title:'층별 밀도 (아래로 갈수록 크다)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)}), i;
    var pts=[]; o.L.slice().reverse().forEach(function(q,k){ pts.push([q.rho,k]); pts.push([q.rho,k+1]); }); plotLine(ctx,P,pts,COL.blue,2.4); o.L.slice().reverse().forEach(function(q,k){ plotPoints(ctx,P,[[q.rho,k+0.5]],COL.amber,5); }); },
  kv:function(n,cm,S){ var o=c05(n,cm); return [['아래층 밀도',o.L[0].rho.toFixed(0)+' kg/m³','a'],['위층 밀도',o.L[o.L.length-1].rho.toFixed(0)+' kg/m³','g'],['층 사이 Δρ',o.dr.toFixed(1)+' kg/m³','v2'],['안정도 N',o.N.toFixed(2)+' rad/s'],['판정',o.ok?'안정':'섞임 우려','r']]; } };
