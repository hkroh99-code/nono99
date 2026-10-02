/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R06 ~ R10 : 배의 흘수 · 배의 안정과 흔들림 주기 · 물 온도와 부력 · U자 마노미터 · 카르테시안 잠수부
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R06 : 모형 배의 적재량과 흘수 (직육면체 배, 길이 L=30 cm · 높이 8 cm · 빈 배 100 g) ───────────── */
function r06(Bw,load,seed){ var L=30, Hh=8, m0=100, m=m0+load, d=m/(L*Bw), r=rng32(seed*31+5), dm=d+0.03*gaussR(r), sink=d>Hh; return {d:d,dm:dm,free:Hh-d,sink:sink,slope:1/(L*Bw),mmax:L*Bw*Hh-m0}; }
(function(){ var a=r06(15,0,1), b=r06(15,500,1), c=r06(10,500,1), d=r06(15,3500,1);
  mkP({ id:'R06', t:'모형 배의 적재량과 흘수 — 직선의 기울기가 말해 주는 것', icon:'🛶', type:'R&E · 정량 실험', lv:1, dur:'1 주', cost:'약 1 만 원',
    one:'직육면체 모양 모형 배(지퍼 백 · 플라스틱 용기)에 동전(추)을 하나씩 실으며 흘수(잠기는 깊이) d 를 잰다. 적재 질량 m 대 흘수 d 의 직선 기울기가 1/(ρ L B) 인지 확인하고, 담수와 소금물에서 기울기를 비교한다.',
    q:'적재 질량이 2 배가 되면 흘수도 2 배가 될까? 배의 폭이 넓으면 기울기는 어떻게 달라질까?',
    why:'배가 뜨는 원리(부력 = 무게)를 가장 단순한 직선 그래프로 확인합니다. 기울기가 배의 바닥 면적 L·B 와 액체 밀도에서 나오므로 <b>기울기에서 면적을 거꾸로 구하는</b> 방법을 익힐 수 있습니다. 만재흘수선의 원리이기도 합니다.',
    link:'원리④ 뜨기 · 안정(5번 탭) · 직선 그래프 · 밀도 · 15번 탭 종합1.',
    cap:'모형 배가 물에 떠 있고 동전을 싣는다(왼쪽) → 적재 질량에 따른 흘수(가운데) → 직선의 기울기 = 1/(ρLB)(오른쪽). 적재 질량 m(왼쪽 아래) · d = m/(ρLB)(가운데 아래) · 기울기로 L·B 구하기(오른쪽 아래)',
    parts:[['모형 배','직육면체 용기','길이 L · 폭 B 를 잰다','바닥이 평평한 용기. 바닥 면적 L·B 를 자로 정확히 잰다.'],
           ['눈금 붙이기','흘수 눈금','방수 테이프 + 자','선체 옆에 0.5 cm 눈금을 붙이고 수면이 닿는 눈금을 읽는다.'],
           ['추(동전)','10 g 단위','질량 저울로 개별 측정','같은 동전을 하나씩 실으며 총 질량을 기록한다. 짐은 가운데 낮게.'],
           ['수조','깊은 대야','잔물결 없는 물','배가 벽에 닿지 않게. 수온을 기록한다.'],
           ['그래프','m 대 d','직선 + 기울기','기울기 = 1/(ρLB). 절편은 빈 배 질량에서의 흘수.'],
           ['소금물 비교','담수 vs 해수(약 3.5 %)','기울기 비','ρ 비 1000 : 1025 이면 기울기 비도 같다.']],
    budget:[['직육면체 용기','1 ~ 2','약 3천 원','지퍼 백 + 판지'],['동전(500원 · 100원)','30 개','보유','볼트 · 너트'],['방수 테이프 + 자','1','약 2천 원','—'],['대야 · 소금','1','약 3천 원','—'],['전자저울','1','학교','—']],
    steps:['배의 길이 L · 폭 B · 높이 H 와 빈 배의 질량 m₀ 를 재고 눈금(흘수 자)을 붙인다.','빈 배의 흘수 d₀ 를 읽고, 동전을 하나씩(10 g 마다) 가운데에 실으며 d 를 기록한다(침몰 직전까지).','m 대 d 를 그려 직선의 기울기 s 를 최소제곱으로 구한다.','이론 기울기 1/(ρLB) 와 비교하고 L·B 를 s 로부터 거꾸로 계산해 실측과 비교한다.','소금물(약 3.5 %)에서 반복해 기울기가 2.5 % 작아지는지 확인한다.'],
    vars:['적재 질량 m · 배의 폭 B(용기 교체)','흘수 d · 기울기','액체 밀도 · 짐의 위치'],
    predict:[['B = 15 cm · 빈 배','d = '+fx(a.d,2)+' cm (빈 배 100 g)','100/(30×15)=0.22 cm'],
             ['B = 15 cm · 500 g 적재','d = '+fx(b.d,2)+' cm · 기울기 '+fx(b.slope*100,2)+' cm/100 g','직선적으로 증가'],
             ['B = 10 cm · 500 g 적재','d = '+fx(c.d,2)+' cm (더 깊이 잠김)','폭이 좁으면 더 많이 잠긴다'],
             ['B = 15 cm · 3500 g 적재','d = '+fx(d.d,2)+' cm &gt; 높이 8 cm → '+(d.sink?'침몰':'뜸'),'침몰 한계 질량 '+fx(d.mmax,0)+' g']],
    data:{cols:['적재 질량 (g)','총 질량 (g)','d 이론 (cm)','d 측정 (cm)'],
          rows:[0,200,500,1000,2000,3000].map(function(l){ var o=r06(15,l,1); return [l,100+l,fx(o.d,2),fx(o.dm,2)]; })},
    analysis:'m 대 d 의 회귀 기울기와 이론 기울기를 비교한다. 기울기로부터 L·B 를 구해 실측 면적과 얼마나 다른지(%)를 구한다. 절편의 의미(빈 배 질량이 흘수 눈금 0 에서 이미 잠기는 양)와 침몰 한계 질량의 예측-실험 일치를 논의한다.',
    special:['🎓 연구 설계',[['연구 질문','적재 질량과 흘수의 관계는? 기울기에서 무엇을 알 수 있나?'],['독립변인','적재 질량 m'],['종속변인','흘수 d'],['통제변인','배 모양 · 액체 · 짐 위치'],['기대 결과','직선, 기울기 = 1/(ρLB), 소금물에서 약 2.4 % 작음']]],
    fails:[['배가 기울어 잠긴다','짐을 가운데 · 낮게(R07 에서 안정 이해)'],['눈금을 읽기 어렵다','투명 용기 · 눈금 크게 · 수면에 붙은 메니스커스를 같은 위치에서 읽기'],['기울기가 이론보다 작다','안쪽이 아닌 바깥 면적으로 계산(벽 두께) · 용기 모서리의 둥근 부분']],
    up:['<b>R07</b> — 안정성과 흔들림 주기.','<b>C09</b> — 호일 배 적재 대회.','<b>종합1(15번 탭)</b> — 기울기 해석 방법.'],
    next:['원리④ 뜨기 · 안정',5],
    eval:[['측정','눈금 읽기 · 반복'],['분석','회귀 기울기 · L·B 역산'],['설명','부력 = 무게'],['안전','물 · 바닥 미끄럼']],
    tip:'절편이 0 이 아닌 이유(빈 배의 무게)를 설명할 수 있으면 부력의 개념이 정확하다는 증거입니다.' });
})();
SIMS.R06={ q:'배의 폭과 적재 질량을 바꾸면 흘수와 침몰 여부는 어떻게 달라질까?',
  a:{nm:'배의 폭 B',min:6,max:25,step:1,val:15,unit:'cm',d:0}, b:{nm:'적재 질량',min:0,max:3600,step:100,val:500,unit:'g',d:0},
  cap1:'길이 30 cm 의 모형 배가 담수에 떠 있습니다. 적재 질량이 늘수록 흘수(파란 눈금)가 깊어지고 건현(남은 높이)이 줄어듭니다.',
  cap2:'📊 적재 질량 대 흘수 — 직선의 기울기 = 1/(ρLB). 점은 측정(0.3 mm 잡음), 빨강 점선 = 선체 높이(침몰선).',
  note:'모형 : 직육면체 배 L = 30 cm · 높이 8 cm · 빈 배 100 g · 담수 1 g/cm³ · 짐은 중심 낮게 · 흘수 d = m/(ρLB) · 측정 잡음 0.3 mm.',
  anim:function(ctx,w,h,t,Bw,load,S){ var o=r06(Bw,load,S.seed), sc=Math.min(10,(h-120)/9), cx=w*0.36, wl=h*0.5, bwp=Bw*3.2, hp=8*sc, dp=Math.min(o.d,9)*sc, bob=Math.sin(t*1.7)*1.6*Math.exp(-t/6);
    ctx.fillStyle='rgba(56,189,248,.25)'; ctx.fillRect(0,wl,w,h-wl); ctx.strokeStyle='rgba(125,211,252,.7)'; ctx.beginPath(); ctx.moveTo(0,wl); ctx.lineTo(w,wl); ctx.stroke();
    var by=wl-hp+dp+bob; ctx.fillStyle='rgba(148,163,184,.5)'; ctx.fillRect(cx-bwp/2,by,bwp,hp); ctx.strokeStyle=COL.white; ctx.lineWidth=2; ctx.strokeRect(cx-bwp/2,by,bwp,hp); ctx.lineWidth=1;
    var nc=Math.min(14,Math.round(load/100)); for(var i=0;i<nc;i++){ ctx.fillStyle=COL.amber; ctx.fillRect(cx-bwp/2+6+(i%8)*Math.max(4,(bwp-12)/8),by-5-Math.floor(i/8)*5,Math.max(3,(bwp-12)/8-1),4); }
    for(i=0;i<=8;i++){ ctx.strokeStyle=COL.tick; ctx.beginPath(); ctx.moveTo(cx+bwp/2+4,by+hp-i*sc); ctx.lineTo(cx+bwp/2+(i%2?10:16),by+hp-i*sc); ctx.stroke(); }
    cvText(ctx,'흘수 d = '+o.d.toFixed(2)+' cm · 건현 '+Math.max(0,o.free).toFixed(2)+' cm '+(o.sink?'→ 침몰!':''),12,18,o.sink?COL.grav:COL.text,'bold 12.5px system-ui,sans-serif'); cvText(ctx,'총 질량 '+(100+load)+' g · 침몰 한계 '+o.mmax.toFixed(0)+' g 적재',12,h-10,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,Bw,load,S){ var pts=[],i,r=rng32(S.seed*7+1); for(i=0;i<=3500;i+=300){ var o=r06(Bw,i,S.seed); pts.push([i,Math.max(0,o.d+0.03*gaussR(r))]); }
    lineGraph(ctx,w,h,{xmin:0,xmax:3600,ymin:0,ymax:9.5,xl:'적재 질량 (g)',yl:'흘수 d (cm)',title:'적재 질량 → 흘수 (직선, 기울기 1/(ρLB))',curves:[{pts:[[0,100/(30*Bw)],[3600,3700/(30*Bw)]],col:COL.ok,lw:2.2},{pts:[[0,8],[3600,8]],col:COL.grav,lw:1.6,dash:[6,4]}],pts:pts,now:[load,r06(Bw,load,S.seed).d],legend:[['이론',COL.ok],['측정',COL.blue],['침몰선 8 cm',COL.grav]]}); },
  kv:function(Bw,load,S){ var o=r06(Bw,load,S.seed); return [['흘수 d',o.d.toFixed(2)+' cm','a'],['건현',Math.max(0,o.free).toFixed(2)+' cm','g'],['기울기 1/(ρLB)',(o.slope*100).toFixed(3)+' cm/100 g','v2'],['침몰 한계 적재',o.mmax.toFixed(0)+' g'],['판정',o.sink?'침몰':'뜸','r']]; } };

/* ── R07 : 배의 안정성 — 무게중심 높이와 흔들림 주기 (L=30, 높이 8, 총질량 600 g) ─────────────── */
function r07(KG,Bw){ var m=600, d=m/(30*Bw), KB=d/2, BM=Bw*Bw/(12*d), GM=KB+BM-KG, k=0.35*Bw/100, T=GM>0.02? 2*Math.PI*k/Math.sqrt(G*GM/100) : Infinity; return {d:d,KB:KB,BM:BM,GM:GM,T:T,stable:GM>0}; }
(function(){ var a=r07(3,15), b=r07(5,15), c=r07(3,8), d=r07(5,8);
  mkP({ id:'R07', t:'배의 안정성 — 무게중심 높이와 흔들림 주기', icon:'⛵', type:'R&E · 정량 실험', lv:3, dur:'2 ~ 3주', cost:'약 1 ~ 2만 원',
    one:'모형 배 위의 무거운 추의 높이(KG)를 바꾸며 배를 살짝 기울였다 놓았을 때의 흔들림 주기 T 를 스톱워치(또는 영상)로 잰다. GM = KB + BM − KG 로 예측한 주기 T = 2π k/√(g·GM) 와 비교하고, 주기가 무한히 길어지거나 뒤집히는 한계(GM = 0)를 찾는다.',
    q:'짐을 높이 실으면 배는 얼마나 천천히 흔들릴까? 어느 높이에서 뒤집힐까?',
    why:'배의 안전은 <b>뜨는 것보다 뒤집히지 않는 것</b>이 더 중요합니다. 흔들림 주기는 안정 정도(GM)를 <b>주기라는 측정 가능한 숫자</b>로 바꿔 주기 때문에, 큰 배의 안정성 시험(경사 시험)과 같은 방식을 교실에서 체험할 수 있습니다.',
    link:'원리④ 뜨기 · 안정(5번 탭) · 단진동 · 돌림힘 · 5번 탭 시뮬레이션.',
    cap:'모형 배 위의 추 높이를 바꾼다(왼쪽) → 기울였다 놓았을 때의 흔들림(가운데) → GM 대 주기 곡선(오른쪽). 무게중심 높이 KG(왼쪽 아래) · GM = KB+BM−KG(가운데 아래) · 흔들림 주기 T(오른쪽 아래)',
    parts:[['모형 배','R06 의 직육면체 배','폭 B 가 다른 용기 2 ~ 3 개','폭이 넓을수록 BM 이 커져 안정하다. 폭을 바꿔 비교한다.'],
           ['높이 조절 추','막대 + 자석 추','추의 높이로 KG 변경','추를 막대 위의 높이에 고정하면 전체 무게중심이 올라간다.'],
           ['스톱워치 · 영상','주기 T 측정','10 번 흔들리는 시간 ÷ 10','스마트폰 슬로모션이면 더 정확하다. 작은 각(10°)으로 시작.'],
           ['G 위치 측정','매달아 균형 잡기','KG 계산','배와 짐 전체의 무게중심을 실로 매달아 위치를 찾는다(또는 계산).'],
           ['이론 GM','KB + BM − KG','KB = d/2 · BM = B²/(12d)','d 는 R06 의 흘수. 값은 cm 단위로 계산한다.'],
           ['안전 한계','GM → 0','주기가 무한대로','GM 이 작을수록 T 가 급격히 길어지고 GM ≤ 0 이면 뒤집힌다.']],
    budget:[['직육면체 용기','2 ~ 3','약 5천 원','—'],['막대 + 추','1 세트','약 3천 원','—'],['스톱워치(스마트폰)','1','보유','—'],['대야','1','약 3천 원','—'],['방수 테이프','1','약 1천 원','—']],
    steps:['배의 폭 B 를 정하고 총 질량 600 g(배 + 추)이 되도록 맞춰 흘수 d 를 잰다.','추의 높이를 1, 2, 3, 4, 5 cm 로 바꿔 가며 전체 무게중심 높이 KG 를 구한다(균형 잡기 또는 계산).','배를 10° 기울였다 놓아 10 번 흔들리는 시간을 재고 T 를 구한다(3 회 평균).','T² 대 1/GM 의 직선을 확인한다(이론 T² = 4π² k²/(g GM)).','GM 이 0 에 가까워질 때 주기 변화와 뒤집힘이 일어나는 높이를 기록하고 이론 값과 비교한다.'],
    vars:['무게중심 높이 KG · 배의 폭 B','흔들림 주기 T · 안정 여부','총 질량 · 추 위치 · 초기 각도'],
    predict:[['KG = 3 cm · B = 15 cm','GM = '+fx(a.GM,2)+' cm · T = '+fx(a.T,2)+' s','넓은 배는 안정하고 흔들림이 빠르다'],
             ['KG = 5 cm · B = 15 cm','GM = '+fx(b.GM,2)+' cm · T = '+fx(b.T,2)+' s','KG ↑ → GM ↓ → 주기 ↑'],
             ['KG = 3 cm · B = 8 cm','GM = '+fx(c.GM,2)+' cm · '+(c.GM>0?'T = '+fx(c.T,2)+' s':'불안정 · 뒤집힘'),'좁은 배는 BM 이 작다'],
             ['KG = 5 cm · B = 8 cm','GM = '+fx(d.GM,2)+' cm · '+(d.GM>0?'T = '+fx(d.T,2)+' s':'불안정 · 뒤집힘'),'GM ≤ 0 이면 평형이 불안정']],
    data:{cols:['KG (cm)','B (cm)','GM (cm)','T 이론 (s)'],
          rows:[[1,15],[3,15],[5,15],[7,15],[2,8],[4,8]].map(function(q){ var o=r07(q[0],q[1]); return [q[0],q[1],fx(o.GM,2),isFinite(o.T)? fx(o.T,2):'∞(불안정)']; })},
    analysis:'T² 대 1/GM 이 원점을 지나는 직선인지 확인하고 기울기에서 회전 반지름 k 를 구한다. 폭 B 를 바꾼 배에서 BM 이 B² 에 비례해 안정이 커지는 것을 정리하고, 이론 GM = 0 의 높이와 실제로 뒤집힌 높이의 차이를 오차 원인과 함께 논의한다.',
    special:['🎓 연구 설계',[['연구 질문','무게중심 높이와 폭이 안정 · 주기에 어떤 영향을 주는가?'],['독립변인','KG(추 높이) · 폭 B'],['종속변인','흔들림 주기 T · 뒤집힘 여부'],['통제변인','총 질량 · 초기 각 10° · 액체'],['기대 결과','KG 증가 → GM 감소 → 주기 증가, GM → 0 에서 뒤집힘']]],
    fails:[['주기를 재기 어렵다','슬로모션 촬영 · 10 번 평균 · 작은 각'],['KG 를 알기 어렵다','실로 매달아 균형 잡는 점으로 측정 · 막대 중심 이용'],['배가 계속 뒤집힌다','추를 낮추거나 폭이 넓은 배로 시작']],
    up:['<b>I09</b> — 부이의 상하 진동 주기.','<b>C09</b> — 호일 배.','<b>5번 탭</b> — GM 시뮬레이션.'],
    next:['원리④ 뜨기 · 안정',5],
    eval:[['정량 분석','T–GM 관계'],['모형 이해','G · B · M 의 역할'],['실험 기술','균형 · 주기 측정'],['안전','물 · 미끄럼']],
    tip:'큰 배는 같은 원리로 「경사 시험」(추를 옮겨 기울기를 재어 GM 계산)을 합니다. 이 실험이 그 축소판입니다.' });
})();
SIMS.R07={ q:'무게중심 높이와 배의 폭을 바꾸면 안정(GM)과 흔들림 주기는 어떻게 달라질까?',
  a:{nm:'무게중심 높이 KG',min:0.5,max:8,step:0.25,val:3,unit:'cm',d:2}, b:{nm:'배의 폭 B',min:6,max:25,step:1,val:15,unit:'cm',d:0},
  cap1:'배 단면이 평형 둘레에서 흔들립니다. GM > 0 이면 감쇠 진동, GM ≤ 0 이면 기울기가 계속 커져 뒤집힙니다. 빨강 G · 초록 B · 노랑 M.',
  cap2:'📊 위 : 무게중심 높이에 따른 GM(0 아래는 불안정). 아래 : GM 에 따른 흔들림 주기 — GM 이 0 에 가까울수록 주기가 급격히 길어집니다.',
  note:'모형 : 총 질량 600 g, L = 30 cm, 흘수 d = 600/(30B) · KB = d/2 · BM = B²/(12d) · 주기 T = 2πk/√(g·GM), 회전 반지름 k = 0.35B(어림). 작은 각 · 감쇠 무시.',
  anim:function(ctx,w,h,t,KG,Bw,S){ var o=r07(KG,Bw), sc=Math.min(9,(h-100)/9), cx=w*0.4, wl=h*0.55, bp=Bw*sc*0.75, hp=8*sc*0.75, dp=o.d*sc*0.75;
    var ang=o.GM>0? 0.25*Math.exp(-0.12*t)*Math.cos(Math.sqrt(Math.max(o.GM,0.05))*2.2*t/Math.max(0.1,Math.sqrt(0.35*Bw/10))*0.6) : Math.min(1.4,0.05*Math.exp(0.55*t));
    ctx.fillStyle='rgba(56,189,248,.25)'; ctx.fillRect(0,wl,w,h-wl); ctx.strokeStyle='rgba(125,211,252,.7)'; ctx.beginPath(); ctx.moveTo(0,wl); ctx.lineTo(w,wl); ctx.stroke();
    ctx.save(); ctx.translate(cx,wl); ctx.rotate(ang); ctx.fillStyle='rgba(148,163,184,.5)'; ctx.fillRect(-bp/2,dp-hp,bp,hp); ctx.strokeStyle=COL.white; ctx.lineWidth=2; ctx.strokeRect(-bp/2,dp-hp,bp,hp); ctx.lineWidth=1;
    var yG=dp-KG*sc*0.75, yB=dp-o.KB*sc*0.75, yM=dp-(o.KB+o.BM)*sc*0.75; ctx.fillStyle=COL.grav; ctx.beginPath(); ctx.arc(0,yG,5,0,6.283); ctx.fill(); ctx.fillStyle=COL.ok; ctx.beginPath(); ctx.arc(0,yB,5,0,6.283); ctx.fill(); if(yM>wl-h) { ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.arc(0,Math.max(yM,-h*0.45),4.5,0,6.283); ctx.fill(); } ctx.restore();
    cvText(ctx,'GM = '+o.GM.toFixed(2)+' cm · '+(o.stable?'T = '+o.T.toFixed(2)+' s (안정)':'불안정 — 뒤집힘'),12,18,o.stable?COL.ok:COL.grav,'bold 12.5px system-ui,sans-serif'); cvText(ctx,'KB '+o.KB.toFixed(2)+' + BM '+o.BM.toFixed(2)+' − KG '+KG.toFixed(2),12,h-10,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,KG,Bw,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:0.5,xmax:8,ymin:-4,ymax:16,ylabel:'GM (cm)',title:'무게중심 높이 → GM (0 아래 = 불안정)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var pts=[]; for(i=0.5;i<=8;i+=0.25) pts.push([i,r07(i,Bw).GM]); plotLine(ctx,P,[[0.5,0],[8,0]],COL.dim,1.3,[5,4]); plotLine(ctx,P,pts,COL.ok,2.4); plotPoints(ctx,P,[[KG,r07(KG,Bw).GM]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.3,xmax:10,ymin:0,ymax:4,xlabel:'GM (cm)',ylabel:'주기 T (s)',title:'GM → 주기 (GM 이 작을수록 느리게 흔들린다)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ var pts=[],k=0.35*Bw/100; for(i=0.3;i<=10;i+=0.2) pts.push([i,Math.min(4,2*Math.PI*k/Math.sqrt(G*i/100))]); plotLine(ctx,P,pts,COL.blue,2.4); var o=r07(KG,Bw); if(o.GM>0.3) plotPoints(ctx,P,[[Math.min(10,o.GM),Math.min(4,o.T)]],COL.amber,7); }); },
  kv:function(KG,Bw,S){ var o=r07(KG,Bw); return [['흘수 d',o.d.toFixed(2)+' cm','a'],['KB · BM',o.KB.toFixed(2)+' · '+o.BM.toFixed(2)+' cm','g'],['GM',o.GM.toFixed(2)+' cm','v2'],['흔들림 주기 T',isFinite(o.T)? o.T.toFixed(2)+' s':'∞(불안정)'],['판정',o.stable?'안정':'불안정','r']]; } };

/* ── R08 : 물의 온도와 부력 ─────────────────────────────────────────── */
function r08(T,V){ var rw=rhoWater(T), ro=2500, app=(ro-rw)*V*1e-6*1000, app20=(ro-rhoWater(20))*V*1e-6*1000; return {rw:rw,app:app,dm:app-app20,res:(rw-rhoWater(20))*V*1e-3}; }
(function(){ var a=r08(20,100), b=r08(60,100), c=r08(80,200), d=r08(4,100);
  mkP({ id:'R08', t:'물의 온도와 부력 — 겉보기 무게로 재는 밀도 변화', icon:'🌡️', type:'R&E · 정량 실험', lv:2, dur:'2 주', cost:'약 1 ~ 2만 원',
    one:'유리 구슬(또는 금속 추)을 실로 매달아 물의 온도 T 를 20 ~ 80 ℃(안전한 범위 · 보온컵)로 바꿔 가며 겉보기 질량을 잰다. 물의 밀도 ρ(T) 가 줄어드는 것이 부력 감소로 나타나는지 확인하고, 문헌 ρ(T) 와 비교한다.',
    q:'물이 따뜻해지면 부력은 얼마나 줄까? 저울의 분해능으로 확인할 수 있을까?',
    why:'「물의 밀도는 1000 이다」라는 가정이 정밀 측정에서 어긋나는 것을 직접 보는 실험입니다. 20 ℃ 와 60 ℃ 의 차이(약 1.7 %)가 부력 · 겉보기 무게에서 어떻게 보이는지, 어떤 저울이 필요한지를 정량으로 알 수 있습니다.',
    link:'원리⑤ 측정 · 오차(6번 탭) · 열팽창 · 물의 밀도 이상 현상(4 ℃).',
    cap:'온도를 바꾼 물에 추를 매단다(왼쪽) → 물의 밀도 변화(가운데) → 온도 대 겉보기 질량 곡선(오른쪽). 물 온도 T 변경(왼쪽 아래) · ρ(T) 표와 비교(가운데 아래) · 겉보기 무게 변화(오른쪽 아래)',
    parts:[['유리 구슬 · 추','부피가 큰 것(100 cm³ 안팎)','밀도 2.5 g/cm³','부력이 커야 변화가 잘 보인다. 부피를 눈금실린더로 잰다.'],
           ['보온컵 · 가열','전기포트 + 온도계','20 ~ 60 ℃(80 ℃ 이하)','화상 주의. 열이 빠지지 않게 보온컵을 쓰고 온도를 동시에 읽는다.'],
           ['정밀 저울','0.01 g 이상','저울 위 거치대','저울 위에 비커를 두고 추를 실로 매달아 물에만 담근다(저울 위로 부력의 반작용이 읽힘).'],
           ['온도계','±0.5 ℃','물 중앙에서 읽기','추 근처에서 온도를 읽고 읽는 순간의 온도를 기록한다.'],
           ['ρ(T) 표','문헌 값','20 ℃ 998.2 · 60 ℃ 983.2 · 80 ℃ 971.8','Tanaka 식 · 물리 상수표와 비교한다.'],
           ['증발 · 대류','뚜껑 · 천천히','오차 원인','증발과 대류가 저울을 흔든다. 뚜껑을 덮고 읽는다.']],
    budget:[['유리 구슬 · 금속 추','1','약 3천 원','볼트'],['보온컵 · 온도계','1 세트','약 1만 원','비커'],['정밀 저울(0.01 g)','1','학교 보유','—'],['전기포트','1','보유','교사 가열'],['거치대','1','약 3천 원','—']],
    steps:['구슬의 부피 V 를 재고 실로 매달아 거치대에 걸어 둔다.','비커에 물을 20 ℃ 로 맞추고 저울을 영점한 뒤 구슬을 담가 저울 증가량(= 부력의 반작용) m_B 를 읽는다.','물을 30, 40, 50, 60 ℃ 로 올리며 같은 방식으로 m_B 와 수온을 기록한다(화상 · 증발 주의).','m_B = ρ(T) V 에서 ρ(T) 를 구해 문헌값과 비교하고 T 대 ρ 곡선을 그린다.','측정 불확도와 20 → 60 ℃ 의 변화량(약 1.7 %)을 비교해 변화가 측정 가능한지 판단한다.'],
    vars:['물 온도 T','부력(저울 증가량) · ρ(T)','구슬 부피 · 증발 · 온도 균일도'],
    predict:[['T = 20 ℃ · V = 100 cm³','ρ = '+fx(a.rw,1)+' kg/m³ · 겉보기 '+fx(a.app,1)+' g','기준'],
             ['T = 60 ℃ · V = 100 cm³','ρ = '+fx(b.rw,1)+' · 겉보기 '+fx(b.app,1)+' g(+'+fx(b.dm,2)+' g)','부력이 줄어 겉보기 무게가 증가'],
             ['T = 80 ℃ · V = 200 cm³','ρ = '+fx(c.rw,1)+' · 겉보기 변화 +'+fx(c.dm,2)+' g','부피가 클수록 변화가 잘 보인다'],
             ['T = 4 ℃ · V = 100 cm³','ρ = '+fx(d.rw,1)+' (최대) · 겉보기 변화 '+fx(d.dm,2)+' g','물은 4 ℃ 에서 가장 무겁다']],
    data:{cols:['T (℃)','ρ(T) (kg/m³)','겉보기 질량 (g)','20 ℃ 대비 (g)'],
          rows:[4,20,40,60,80].map(function(T){ var o=r08(T,100); return [T,fx(o.rw,1),fx(o.app,2),fx(o.dm,2)]; })},
    analysis:'T 대 ρ 곡선을 문헌과 비교하고 20 ℃ 기준 변화량을 정리한다. 저울 분해능(0.01 g)과 변화량의 비로 신호 대 잡음비를 구하고, 온도를 고려하지 않은 부력식 밀도 측정의 오차(R·종합1)를 정량화한다.',
    special:['🎓 연구 설계',[['연구 질문','온도에 따라 부력은 얼마나 변하는가? 저울로 확인 가능한가?'],['독립변인','물의 온도 T'],['종속변인','저울 증가량(부력) · ρ(T)'],['통제변인','구슬 · 거치대 · 저울 · 증발'],['기대 결과','T 가 오르면 ρ ↓ · 부력 ↓, 20 → 80 ℃ 에서 약 2.7 % 변화']]],
    fails:[['값이 계속 변한다','증발 · 대류 · 구슬에 기포 — 뚜껑 · 기포 제거 · 열이 안정될 때까지 대기'],['변화가 안 보인다','부피가 큰 구슬 · 정밀 저울 · 온도 범위를 넓게'],['화상 위험','80 ℃ 이하 · 교사 감독 · 보온컵 · 장갑']],
    up:['<b>I02</b> — 수심계의 온도 보정.','<b>I03</b> — 비중계와 온도.','<b>종합1(15번 탭)</b> — 액체 밀도 측정.'],
    next:['원리⑤ 측정 · 오차 · 안전',6],
    eval:[['측정 기술','저울 · 온도'],['안전','가열 · 화상 대비'],['분석','ρ(T) 비교'],['한계','증발 · 불확도']],
    tip:'4 ℃ 에서 밀도가 최대인 이유(수소 결합)를 한 줄로 덧붙이면 소논문의 깊이가 커집니다.' });
})();
SIMS.R08={ q:'물의 온도와 구슬의 부피를 바꾸면 물의 밀도와 저울이 읽는 겉보기 질량은 어떻게 달라질까?',
  a:{nm:'물의 온도 T',min:0,max:90,step:2,val:40,unit:'℃',d:0}, b:{nm:'구슬 부피 V',min:50,max:300,step:10,val:100,unit:'cm³',d:0},
  cap1:'물에 매달린 구슬. 온도가 오르면 물이 팽창해 밀도가 줄고, 부력(저울 증가량)이 줄어듭니다. 옆 막대는 20 ℃ 대비 겉보기 질량의 변화.',
  cap2:'📊 위 : 온도에 따른 물의 밀도(4 ℃ 부근 최대). 아래 : 온도에 따른 겉보기 질량(구슬 밀도 2.5 g/cm³).',
  note:'모형 : ρ_w(T) = Tanaka 식 · 구슬 ρ₀ = 2500 kg/m³ · 겉보기 질량 = (ρ₀ − ρ_w(T))V. 증발 · 열팽창으로 인한 구슬 부피 변화는 무시.',
  anim:function(ctx,w,h,t,T,V,S){ var o=r08(T,V), tx=w*0.3, tw=Math.min(150,w*0.3), top=44, bot=h-30, wl=top+20, s=Math.cbrt(V)/Math.cbrt(300)*44+14, hot=Math.min(1,T/90);
    ctx.fillStyle='rgba('+Math.round(56+hot*190)+','+Math.round(189-hot*100)+','+Math.round(248-hot*160)+',.28)'; ctx.fillRect(tx-tw/2,wl,tw,bot-wl); vessel(ctx,tx-tw/2,top,tw,bot-top);
    ctx.strokeStyle=COL.dim; ctx.beginPath(); ctx.moveTo(tx,top-16); ctx.lineTo(tx,wl+50); ctx.stroke(); ctx.fillStyle='#e2e8f0'; ctx.beginPath(); ctx.arc(tx,wl+50+s/2,s/2,0,6.283); ctx.fill();
    for(var i=0;i<6;i++){ var ph=(t*0.5+i/6)%1; if(T>50){ ctx.fillStyle='rgba(255,255,255,'+(0.4*(1-ph))+')'; ctx.beginPath(); ctx.arc(tx-tw/2+14+i*(tw-28)/5,bot-ph*(bot-wl),2.4,0,6.283); ctx.fill(); } }
    var bx=w*0.62, bw=60, mx=3.2, hh=(bot-top-30)*Math.min(1,Math.abs(o.dm)/mx); ctx.fillStyle=o.dm>=0?COL.amber:COL.ok; ctx.fillRect(bx,bot-hh,bw,hh); ctx.strokeStyle=COL.axis2; ctx.strokeRect(bx,top+10,bw,bot-top-10); cvText(ctx,(o.dm>=0?'+':'')+o.dm.toFixed(2)+' g',bx+bw/2,bot-hh-6,COL.text,'bold 12px system-ui,sans-serif','center'); cvText(ctx,'20 ℃ 대비',bx+bw/2,bot+14,COL.tick,'11px system-ui,sans-serif','center');
    cvText(ctx,'T = '+T+' ℃ · ρ_w = '+o.rw.toFixed(1)+' kg/m³ · 겉보기 질량 '+o.app.toFixed(1)+' g',12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,T,V,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:100,ymin:955,ymax:1002,ylabel:'ρ_w (kg/m³)',title:'온도 → 물의 밀도',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var pts=[]; for(i=0;i<=100;i+=2) pts.push([i,rhoWater(i)]); plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,[[T,rhoWater(T)]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:100,ymin:0,ymax:Math.max(1,(2500-955)*V*1e-3*1.03),xlabel:'온도 T (℃)',ylabel:'겉보기 질량 (g)',title:'온도 → 겉보기 질량',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var pts=[]; for(i=0;i<=100;i+=2) pts.push([i,r08(i,V).app]); plotLine(ctx,P,pts,COL.ok,2.4); plotPoints(ctx,P,[[T,r08(T,V).app]],COL.amber,7); }); },
  kv:function(T,V,S){ var o=r08(T,V); return [['물의 밀도',o.rw.toFixed(1)+' kg/m³','a'],['부력',(o.rw*V*1e-3).toFixed(1)+' g중','g'],['겉보기 질량',o.app.toFixed(1)+' g','v2'],['20 ℃ 대비 변화',(o.dm>=0?'+':'')+o.dm.toFixed(2)+' g'],['필요한 저울 분해능',(Math.abs(o.dm)/5).toFixed(2)+' g(변화의 1/5)','r']]; } };

/* ── R09 : U자 마노미터로 재는 수압 ─────────────────────────────────── */
function r09(d,rm,seed){ var r=rng32(seed*19+11), dh=1000*d/rm, pts=[], i; for(i=1;i<=8;i++){ var dd=i*d/8*1.0+0.5, v=1000*dd/rm; pts.push([dd,v+0.05*gaussR(r)*v+0.1*gaussR(r)]); } return {dh:dh,p:RHO_W*G*d/100,pts:pts,slope:1000/rm}; }
(function(){ var a=r09(10,1000,1), b=r09(10,850,1), c=r09(30,1000,1), d=r09(10,13600,1);
  mkP({ id:'R09', t:'U자 마노미터로 재는 수압 — 깊이와 압력의 직선', icon:'🔬', type:'R&E · 정량 실험', lv:2, dur:'2 주', cost:'약 1 ~ 2만 원',
    one:'투명 U자 호스(마노미터)에 물 또는 기름을 넣고 한쪽을 깔때기(압력 탐침)에 연결해 물속 깊이 d 에 담근다. 두 액면의 높이차 Δh 로 압력 p = ρ_m g Δh 를 구하고 깊이에 비례하는지(직선 · 기울기 ρ_w/ρ_m) 확인한다.',
    q:'깊이 d 의 압력은 마노미터 높이차로 얼마나 정확히 재어질까? 마노미터 액체의 밀도는 감도에 어떻게 영향을 줄까?',
    why:'압력은 눈에 보이지 않지만 <b>높이차</b>로 바꾸면 자로 잴 수 있습니다. 같은 압력에 대해 밀도가 작은 기름은 높이차가 더 크게 나타나(감도 ↑), 측정 장치의 설계에서 「액체 선택」이 어떤 의미인지 알 수 있습니다.',
    link:'원리① 압력과 깊이(2번 탭) · 17번 탭 종합3 · 압력계의 원리.',
    cap:'U자 호스의 한쪽에 깔때기를 연결해 물속에 담근다(왼쪽) → 마노미터 두 액면의 높이차 Δh(가운데) → 깊이 대 Δh 직선(오른쪽). 깊이 d(왼쪽 아래) · Δh = ρ_w d/ρ_m(가운데 아래) · 기울기(오른쪽 아래)',
    parts:[['U자 호스','투명 호스 6 mm','양쪽 눈금자 고정','한쪽은 열린 대기, 다른 쪽은 깔때기에 연결. 액면 높이를 눈금자로 읽는다.'],
           ['깔때기 + 고무막','압력 탐침','얇은 고무막 씌우기','물속 압력이 고무막을 눌러 공기를 압축하고 마노미터 액면을 움직인다.'],
           ['수조 + 깊이 눈금','투명 수조','깊이 d 를 눈금으로','깔때기 중심의 수면 아래 깊이 d 를 잰다. 수평을 유지.'],
           ['마노미터 액체','물 · 식용유(밀도 약 920) · 색 물','밀도 ρ_m 를 안다','식용유는 물과 섞이지 않는 다른 용도(수은은 교실에서 사용 금지).'],
           ['눈금 읽기','액면의 메니스커스','mm 단위','눈높이를 액면에 맞추고 같은 위치(메니스커스 아래)에서 읽는다.'],
           ['그래프','d 대 Δh','기울기 = ρ_w/ρ_m','직선의 기울기가 밀도비와 일치하는지 확인한다.']],
    budget:[['투명 호스 1 m','1','약 2천 원','—'],['깔때기 · 고무풍선','1 세트','약 2천 원','—'],['투명 수조','1','약 5천 원','양동이'],['눈금자 · 색 물감','1','약 2천 원','—'],['식용유','1','약 3천 원','—']],
    steps:['U자 호스에 색 물을 반쯤 채워 양쪽 액면 높이가 같은지 확인한다(영점).','깔때기 입구에 고무막을 씌워 호스 한쪽 끝에 연결(밀폐)하고 수조의 수면에 맞춘다(d = 0).','깔때기를 깊이 d = 2, 5, 10, 15, 20, 30 cm 로 내리며 마노미터 높이차 Δh 를 읽는다.','d 대 Δh 를 그리고 직선의 기울기(이론 = 1000/ρ_m)를 구한다.','호스 액체를 식용유(920)로 바꿔 같은 방법으로 반복하고 감도를 비교한다.'],
    vars:['깔때기 깊이 d · 마노미터 액체 ρ_m','액면 높이차 Δh · 압력 p','밀폐 상태 · 온도 · 공기 부피'],
    predict:[['d = 10 cm · 물 마노미터','Δh = '+fx(a.dh,1)+' cm · p = '+fx(a.p/1000,2)+' kPa','물속 압력 = 물 높이차 (기울기 1)'],
             ['d = 10 cm · 식용유(850)','Δh = '+fx(b.dh,1)+' cm','밀도가 작아 높이차가 커진다(감도 ↑)'],
             ['d = 30 cm · 물','Δh = '+fx(c.dh,1)+' cm','깊이에 비례'],
             ['d = 10 cm · 수은(13600, 참고)','Δh = '+fx(d.dh,2)+' cm','수은은 밀도가 커서 높이차가 작다(실험실 사용 금지, 이론 비교용)']],
    data:{cols:['d (cm)','Δh 이론 (cm)','Δh 측정 (cm)','차이 (%)'],
          rows:r09(30,1000,1).pts.map(function(p){ var th=p[0]*1; return [fx(p[0],1),fx(th,1),fx(p[1],1),fx((p[1]/th-1)*100,1)]; })},
    analysis:'d 대 Δh 의 최소제곱 기울기와 이론 기울기 ρ_w/ρ_m 을 비교한다. 밀폐된 공기 부피 변화(보일 법칙) 때문에 생기는 약간의 오차를 평가하고, 고무막 장력의 영향을 영점 이동(d = 0 에서의 Δh)으로 확인한다.',
    special:['🎓 연구 설계',[['연구 질문','깊이에 따른 수압은 마노미터에서 직선으로 나타나는가?'],['독립변인','깔때기 깊이 d · 마노미터 액체'],['종속변인','높이차 Δh · 압력 p'],['통제변인','수조 · 호스 · 온도 · 영점'],['기대 결과','Δh = (ρ_w/ρ_m) d 직선, 기름에서 감도 증가']]],
    fails:[['값이 안 나온다','깔때기 · 호스 연결부에서 누기 — 테이프 · 클램프 · 고무막 팽팽함 점검'],['영점이 어긋난다','수면에서 깔때기 중심 위치 맞추기 · 다시 영점'],['기름과 물이 섞인다','다른 액체끼리 섞이지 않는지 확인 · 같은 호스에서는 한 종류만']],
    up:['<b>I02</b> — 압력 센서 수심계.','<b>종합3(17번 탭)</b> — 압력-깊이 기울기 ρg.','<b>R03</b> — 구멍 물줄기.'],
    next:['종합3 압력 대 깊이',17],
    eval:[['측정 기술','밀폐 · 영점 · 눈금'],['분석','기울기 비교'],['장비 이해','감도와 밀도'],['안전','수은 사용 금지']],
    tip:'마노미터 감도를 높이려면 밀도가 작은 액체를 쓰지만 증발 · 표면 장력 문제가 생깁니다 — 설계의 거래를 한 줄로 적어 보세요.' });
})();
SIMS.R09={ q:'깔때기 깊이와 마노미터 액체를 바꾸면 U자관의 높이차는 어떻게 달라질까?',
  a:{nm:'깔때기 깊이 d',min:2,max:40,step:1,val:15,unit:'cm',d:0}, b:{nm:'마노미터 액체 밀도 ρ_m',min:700,max:1400,step:50,val:1000,unit:'kg/m³',d:0},
  cap1:'수조 속 깔때기(오른쪽)가 U자관을 눌러 액면이 Δh 만큼 벌어집니다. 마노미터 액체의 밀도가 작을수록 같은 압력에 높이차가 큽니다.',
  cap2:'📊 깊이 대 높이차 — 직선의 기울기 = ρ_w/ρ_m. 점은 측정(5 % + 1 mm 잡음). 노란 점이 지금 설정.',
  note:'모형 : p = ρ_w g d = ρ_m g Δh → Δh = (ρ_w/ρ_m)d · 밀폐 공기 부피 변화 · 고무막 장력 무시 · 측정점 잡음 5 % + 1 mm. 수은은 교실에서 사용하지 않습니다.',
  anim:function(ctx,w,h,t,d,rm,S){ var o=r09(d,rm,S.seed), ph=Math.min(1,t/2.5), tx=w*0.62, tw=Math.min(150,w*0.3), top=40, bot=h-26, wl=top+22, dy=wl+(bot-wl-40)*Math.min(1,d/40)*ph, ux=w*0.14, uh=Math.min(120,(bot-top)*0.75);
    ctx.fillStyle='rgba(56,189,248,.28)'; ctx.fillRect(tx-tw/2,wl,tw,bot-wl); vessel(ctx,tx-tw/2,top,tw,bot-top); ctx.strokeStyle='rgba(125,211,252,.7)'; ctx.beginPath(); ctx.moveTo(tx-tw/2,wl); ctx.lineTo(tx+tw/2,wl); ctx.stroke();
    ctx.fillStyle='#94a3b8'; ctx.beginPath(); ctx.moveTo(tx-12,dy+14); ctx.lineTo(tx+12,dy+14); ctx.lineTo(tx,dy-2); ctx.closePath(); ctx.fill(); ctx.strokeStyle=COL.dim; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(tx,dy-2); ctx.lineTo(tx,top+4); ctx.quadraticCurveTo(tx,top-12,ux+54,top-12); ctx.stroke(); ctx.lineWidth=1;
    var dhp=Math.min(80,o.dh*1.6*ph), lvl=top+30+uh*0.4; ctx.strokeStyle=COL.axis2; ctx.lineWidth=2.4; ctx.strokeRect(ux,top+16,22,uh); ctx.strokeRect(ux+32,top+16,22,uh); ctx.lineWidth=1;
    ctx.fillStyle=rm>=1000?'rgba(251,113,133,.7)':'rgba(251,191,36,.7)'; ctx.fillRect(ux+2,lvl+dhp/2,18,uh+16-(lvl+dhp/2-top-16)); ctx.fillRect(ux+34,lvl-dhp/2,18,uh+16-(lvl-dhp/2-top-16)); cvLine(ctx,[[ux-6,lvl+dhp/2],[ux+60,lvl+dhp/2]],COL.tick,1); cvLine(ctx,[[ux-6,lvl-dhp/2],[ux+60,lvl-dhp/2]],COL.tick,1);
    cvText(ctx,'Δh = '+(o.dh*ph).toFixed(1)+' cm',ux+66,lvl,COL.amber,'bold 12.5px system-ui,sans-serif'); cvText(ctx,'깊이 d = '+d+' cm · p = '+(o.p/1000).toFixed(2)+' kPa',12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,d,rm,S){ var o=r09(40,rm,S.seed);
    lineGraph(ctx,w,h,{xmin:0,xmax:42,ymin:0,ymax:Math.max(60,1000*40/rm*1.1),xl:'깔때기 깊이 d (cm)',yl:'높이차 Δh (cm)',title:'깊이 → 높이차 (기울기 = ρ_w/ρ_m)',curves:[{pts:[[0,0],[42,42*1000/rm]],col:COL.ok,lw:2.4}],pts:o.pts,now:[d,1000*d/rm],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]]}); },
  kv:function(d,rm,S){ var o=r09(d,rm,S.seed); return [['압력(게이지)',(o.p/1000).toFixed(2)+' kPa','a'],['높이차 Δh',o.dh.toFixed(1)+' cm','g'],['기울기 ρ_w/ρ_m',o.slope.toFixed(3),'v2'],['감도(1 cm 깊이당)',(o.slope*10).toFixed(1)+' mm'],['읽기 오차(±1 mm)',(1/o.slope/d*100).toFixed(1)+' %(깊이 환산)','r']]; } };

/* ── R10 : 카르테시안 잠수부 ────────────────────────────────────────── */
function r10(pg,V0){ var Vs=0.25, md=1.1, Va=V0*P0/(P0+pg*1000), Fn=(RHO_W*(Vs+Va)*1e-6-md*1e-3)*G*1000; return {Va:Va,Fn:Fn,sink:Fn<0,pt:P0*(1-(md-RHO_W*Vs*1e-3)/(RHO_W*V0*1e-3))*(-1)+0,p0g:null}; }
function r10th(V0){ var Vs=0.25, md=1.1, need=md-Vs; return V0>need? (P0*(V0/need-1)/1000) : 0; }
(function(){ var a=r10(0,1.0), b=r10(20,1.0), c=r10(40,1.0), d=r10(20,2.0);
  mkP({ id:'R10', t:'카르테시안 잠수부 — 병을 눌러 압력으로 뜨고 가라앉히기', icon:'🧴', type:'R&E · 정량 실험', lv:2, dur:'1 ~ 2주', cost:'약 5천 원',
    one:'물이 가득한 페트병 속에 공기 방울이 든 작은 잠수부(볼펜 뚜껑 · 간장 병)를 넣고 병을 눌러 압력을 높이면 가라앉고 놓으면 뜨는 현상을 연구한다. 보일 법칙으로 공기 부피가 줄어 부력이 감소하는 문턱 압력을 예측하고 측정한다.',
    q:'병을 얼마나 세게 누르면 잠수부가 가라앉을까? 잠수부 속 공기 부피가 크면 문턱 압력은 어떻게 변할까?',
    why:'파스칼의 원리(병을 누른 압력이 물 전체에 전달됨), 보일 법칙(공기 부피 감소), 아르키메데스(부력 변화)가 <b>하나의 장난감</b>에 모두 들어 있습니다. 잠수함 · 물고기의 부레가 깊이를 조절하는 원리와도 같습니다.',
    link:'원리② 파스칼(3번 탭) · 원리③ 아르키메데스(4번 탭) · 보일 법칙 · R05 · C04 · I04.',
    cap:'물이 가득한 병 속의 잠수부(왼쪽) → 병을 눌러 압력이 전해지면 공기 부피가 줄어든다(가운데) → 압력에 따른 순부력(오른쪽). 병을 누른 압력 p(왼쪽 아래) · pV = 일정(가운데 아래) · 문턱 압력에서 가라앉음(오른쪽 아래)',
    parts:[['페트병 + 물','500 mL, 물 가득','뚜껑이 밀폐','공기 방울이 없게 가득 채워야 압력이 잘 전달된다(공기가 들면 R05).'],
           ['잠수부','볼펜 뚜껑 · 점안액 용기','공기 방울이 든 컵','아래가 열린 작은 컵 속에 공기가 갇힌 구조. 클립으로 질량을 조절한다.'],
           ['압력 측정','병 지름 · 누르는 힘','p = F/A 어림','병을 손으로 누르는 압력을 간접 측정(저울로 누르는 힘 + 병 단면적).'],
           ['부력 균형','부력 ≈ 무게','약간 뜨게 조절','처음에는 아주 조금 떠 있게(순부력 +) 조절한다. 클립으로 미세 조정.'],
           ['보일 법칙','p V = 일정','공기 부피 = V₀p₀/(p₀+p)','압력이 올라가면 공기가 줄고 물이 컵 안으로 들어와 부력이 줄어든다.'],
           ['문턱 압력','순부력 = 0','가라앉는 압력 p*','p* = p₀(V₀/V_need − 1). V_need 는 균형이 되는 최소 공기 부피.']],
    budget:[['페트병(투명)','1','약 1천 원','—'],['볼펜 뚜껑 + 클립','1 세트','약 1천 원','—'],['전자저울(누르는 힘)','1','학교','—'],['물 · 물감','1','약 1천 원','—'],['스톱워치','1','보유','—']],
    steps:['병에 물을 가득 채우고 공기 방울이 든 잠수부를 넣어 뚜껑을 닫는다(약간 뜨게 조절).','병을 눌러 가라앉기 시작하는 최소 누르는 힘 F* 를 저울(병 아래에 두고 위에서 누름)로 읽는다.','잠수부의 공기 부피 V₀ 를 바꿔(클립 · 컵 크기) 같은 방법으로 F* 를 측정한다.','p* = F*/A(병 측면 면적)로 환산해 보일 법칙 예측 p* = p₀(V₀/V_need − 1) 와 비교한다.','깊이를 중간에서 멈추게 하는 압력(중성 부력)을 찾아 보고 안정 여부(복원)를 관찰한다.'],
    vars:['병을 누른 압력 p · 공기 부피 V₀','순부력 F_n · 문턱 압력 p*','온도 · 병의 팽창 · 공기 용해'],
    predict:[['p = 0 · V₀ = 1.0 cm³','순부력 '+fx(a.Fn,2)+' mN → 뜬다','공기가 부력을 만든다'],
             ['p = 20 kPa · V₀ = 1.0','공기 '+fx(b.Va,2)+' cm³ · 순부력 '+fx(b.Fn,2)+' mN','문턱 약 '+fx(r10th(1.0),0)+' kPa 에 가까움'],
             ['p = 40 kPa · V₀ = 1.0','공기 '+fx(c.Va,2)+' cm³ · 순부력 '+fx(c.Fn,2)+' mN → 가라앉음','압력 ↑ → 공기 ↓ → 부력 ↓'],
             ['p = 20 kPa · V₀ = 2.0','공기 '+fx(d.Va,2)+' cm³ · 순부력 '+fx(d.Fn,2)+' mN','공기가 많으면 문턱 압력이 높다('+fx(r10th(2.0),0)+' kPa)']],
    data:{cols:['p (kPa)','공기 부피 (cm³)','순부력 (mN)','상태'],
          rows:[0,10,20,30,40,60].map(function(p){ var o=r10(p,1.0); return [p,fx(o.Va,2),fx(o.Fn,2),o.sink?'가라앉음':'뜬다']; })},
    analysis:'공기 부피 V₀ 대 문턱 압력 p* 를 그려 보일 법칙 예측과 비교한다. 잠수부가 깊이에 따라 불안정(가라앉기 시작하면 더 빠르게 가라앉음)한 이유를 부력의 압력 의존성으로 설명한다. 정지 깊이가 없는 이유와 잠수함의 밸러스트 제어와의 차이를 논의한다.',
    special:['🎓 연구 설계',[['연구 질문','병을 누르는 압력과 잠수부 속 공기 부피가 가라앉는 문턱에 미치는 영향은?'],['독립변인','누르는 압력 · 공기 부피'],['종속변인','순부력 · 문턱 압력 p*'],['통제변인','잠수부 질량 · 병 · 온도'],['기대 결과','보일 법칙에 따라 p* 가 V₀ 에 비례해 증가']]],
    fails:[['눌러도 안 가라앉는다','뚜껑이 샌다 · 병에 공기가 든다 · 잠수부가 너무 떠 있음(클립 추가)'],['가라앉았다가 안 뜬다','압력을 다 풀었는지 · 컵 속에 물이 너무 들어갔는지(공기 보충)'],['측정이 흔들린다','같은 위치 · 천천히 눌러 문턱 찾기']],
    up:['<b>C04</b> — 잠수함 밸러스트 쇼.','<b>I04</b> — 자동 부력 조절 물고기.','<b>R05</b> — 공기 방울과 유압.'],
    next:['원리③ 아르키메데스의 원리',4],
    eval:[['실험 설계','문턱 압력 측정'],['이론 연결','보일 법칙 + 부력'],['분석','V₀ 대 p*'],['안전','페트병 압력 과하게 금지']],
    tip:'놓았을 때 다시 뜨는 이유(공기 부피 복원)와 눌렀을 때 급히 가라앉는 불안정을 구별해 설명하면 완성도가 높아집니다.' });
})();
SIMS.R10={ q:'병을 누른 압력과 잠수부 속 공기 부피를 바꾸면 순부력과 잠수부의 상태는 어떻게 달라질까?',
  a:{nm:'병을 누른 압력 p',min:0,max:80,step:2,val:20,unit:'kPa',d:0}, b:{nm:'잠수부 공기 부피 V₀',min:0.5,max:3,step:0.1,val:1.0,unit:'cm³',d:1},
  cap1:'병 속 잠수부. 압력이 높아지면 공기(흰)가 줄고 물이 컵 안으로 들어와 부력이 감소해 가라앉습니다. 초록 화살표 = 순부력(위), 빨강 = 아래.',
  cap2:'📊 위 : 압력에 따른 공기 부피(보일 법칙). 아래 : 압력에 따른 순부력(0 아래 = 가라앉음) — 문턱 압력에서 부호가 바뀝니다.',
  note:'모형 : 잠수부의 플라스틱 부피 0.25 cm³ · 질량 1.1 g · 공기 부피 V = V₀p₀/(p₀+p) (보일 법칙) · 순부력 = ρ_w g(V_s+V) − m g. 병 팽창 · 공기 용해 · 컵 속 물의 무게는 무시.',
  anim:function(ctx,w,h,t,pg,V0,S){ var o=r10(pg,V0), bx=w*0.3, bw=Math.min(110,w*0.25), top=34, bot=h-26, ph=Math.min(1,t/2.2), settle=o.sink?1:0, y=(o.sink? top+30+(bot-top-80)*Math.min(1,ph*1.1) : top+30+(1-ph)*(bot-top-80)*0.0), sc=24+V0*12;
    ctx.fillStyle='rgba(56,189,248,.25)'; ctx.fillRect(bx-bw/2,top+14,bw,bot-top-14); vessel(ctx,bx-bw/2,top,bw,bot-top); ctx.fillStyle='rgba(148,163,184,.8)'; ctx.fillRect(bx-14,top-4,28,10);
    var cy=y+10; ctx.strokeStyle=COL.white; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(bx-14,cy); ctx.lineTo(bx-14,cy+sc*0.9); ctx.lineTo(bx+14,cy+sc*0.9); ctx.lineTo(bx+14,cy); ctx.stroke(); ctx.lineWidth=1; ctx.fillStyle='rgba(56,189,248,.5)'; var airh=Math.max(4,sc*0.9*(o.Va/V0)*0.7); ctx.fillRect(bx-13,cy+airh,26,sc*0.9-airh); ctx.fillStyle='rgba(241,245,249,.8)'; ctx.fillRect(bx-13,cy,26,airh);
    var fl=Math.max(-70,Math.min(70,o.Fn*24)); if(Math.abs(fl)>2) cvArrow(ctx,bx+34,cy+sc*0.45,bx+34,cy+sc*0.45-fl,fl>0?COL.ok:COL.grav,3);
    var gx=w*0.7, gy=h*0.42, R=Math.min(w*0.14,50), ang=-2.4+3.4*Math.min(1,pg/80); ctx.fillStyle='#0b1424'; ctx.beginPath(); ctx.arc(gx,gy,R,0,6.283); ctx.fill(); ctx.strokeStyle=COL.axis2; ctx.stroke(); cvLine(ctx,[[gx,gy],[gx+Math.cos(ang)*R*0.8,gy+Math.sin(ang)*R*0.8]],COL.grav,3); cvText(ctx,pg+' kPa',gx,gy+R+16,COL.amber,'bold 13px system-ui,sans-serif','center');
    cvText(ctx,'공기 '+o.Va.toFixed(2)+' cm³ · 순부력 '+o.Fn.toFixed(2)+' mN → '+(o.sink?'가라앉는다':'뜬다')+' (문턱 '+r10th(V0).toFixed(0)+' kPa)',12,18,o.sink?COL.grav:COL.ok,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,pg,V0,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:80,ymin:0,ymax:Math.max(1.2,V0*1.05),ylabel:'공기 부피 (cm³)',title:'압력 → 공기 부피 (보일 법칙)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ var pts=[]; for(i=0;i<=80;i+=2) pts.push([i,r10(i,V0).Va]); plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,[[pg,r10(pg,V0).Va]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:80,ymin:-3,ymax:Math.max(2,r10(0,V0).Fn*1.15),xlabel:'병을 누른 압력 p (kPa)',ylabel:'순부력 (mN)',title:'압력 → 순부력 (0 아래 = 가라앉음)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ var pts=[]; for(i=0;i<=80;i+=2) pts.push([i,r10(i,V0).Fn]); plotLine(ctx,P,[[0,0],[80,0]],COL.dim,1.3,[5,4]); plotLine(ctx,P,pts,COL.ok,2.4); plotPoints(ctx,P,[[pg,r10(pg,V0).Fn]],COL.amber,7); }); },
  kv:function(pg,V0,S){ var o=r10(pg,V0); return [['공기 부피',o.Va.toFixed(2)+' cm³','a'],['순부력',o.Fn.toFixed(2)+' mN','g'],['상태',o.sink?'가라앉는다':'뜬다','v2'],['문턱 압력 p*',r10th(V0).toFixed(1)+' kPa'],['공기 압축률',((1-o.Va/V0)*100).toFixed(0)+' %','r']]; } };
