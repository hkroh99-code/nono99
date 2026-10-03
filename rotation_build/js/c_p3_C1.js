/* ═══════════════════════════════════════════════════════════════════════════
   창의 프로젝트 C01 ~ C05 : 균형 모빌 · 팽이 디자인 · 각운동량 마술 · 구슬 루프 · 렌치 체험 부스
   (손으로 돌리는 낮은 속력 · 작은 질량 · 5 V 이하. 모든 모형은 교육용 어림)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── C01 : 균형 모빌 — 끈 위치 p* = L·M/(m_L+M) ───────────────────── */
function c01(x,p,seed){ var rn=rng32(seed*13+7), L=40, mL=150, M=60+x, ps=L*M/(mL+M), tq=G*(mL*p-M*(L-p))/100*0.001*100, rows=[], i;
  for(i=0;i<6;i++){ var xx=20+20*i, Mx=60+xx, pi=L*Mx/(mL+Mx); rows.push({x:xx,p:Math.max(0,pi+0.4*gaussR(rn)),ideal:pi}); }
  return {ps:ps,M:M,tau:tq,off:p-ps,tilt:Math.max(-0.5,Math.min(0.5,(p-ps)*0.05)),ok:Math.abs(p-ps)<0.8,rows:rows}; }
(function(){ var a=c01(60,L40(60),1), b=c01(20,20,1), c=c01(120,20,1), d=c01(60,10,1); function L40(x){ return 40*(60+x)/(150+60+x); }
  mkP({ id:'C01', t:'균형 모빌 설계 — 매다는 위치는 어디일까', icon:'🎐', type:'창의 · 설계 대회', lv:1, dur:'3 일', cost:'약 4 천 원',
    one:'가는 막대(40 cm)의 왼쪽에 150 g 을, 오른쪽에 작은 모빌(60 g + 추 x)을 매달고, 전체가 수평이 되는 끈의 위치 p 를 토크 평형으로 계산해 예측한 뒤 실제로 맞는지 겨루는 모빌 설계 대회를 연다.',
    q:'끈을 막대의 가운데에 달면 균형이 잡힐까? 오른쪽 추를 늘리면 끈은 어느 쪽으로 옮겨야 할까? 2 단 모빌의 아래 단은 위 단에 어떻게 작용할까?',
    why:'<b>예술 작품 모빌</b>이 사실은 토크 평형의 연쇄입니다. 무게중심의 위치를 계산으로 정해 놓고 끈을 달면 한 번에 수평이 되는 「예측 → 확인」 쾌감이 있습니다.',
    link:'원리② 토크와 평형(3번 탭) · R01 지렛대 · 종합1(15번 탭).',
    cap:'막대 · 끈 · 왼쪽 추 · 오른쪽 작은 모빌(아래 단)을 이은 2 단 모빌. 끈 위치 p 를 계산해 매단 뒤 수평을 확인한다. 막대 · 끈 위치 · 왼쪽 추 · 아래 단 모빌 · 눈금 · 기록표',
    parts:[['막대(위 단)','길이 40 cm','나무 꼬치 · 가는 막대','눈금을 표시해 둔다. 막대 자체의 무게중심이 가운데인지 확인.'],
           ['추 · 클립 묶음','질량 20 ~ 150 g','클립 · 동전 묶음','주방 저울로 질량을 잰다.'],
           ['끈 · 매듭','위치 조절','실 · 테이프','매듭을 풀고 옮길 수 있게 고정은 테이프로.'],
           ['아래 단 모빌','총질량 M','작은 막대 + 추','아래 단 전체를 하나의 질량 M 으로 본다.'],
           ['수평 확인','영상 · 수평계','스마트폰 수평계 앱','수평 ±1° 이내이면 성공으로 기록.'],
           ['설계 기록표','계산값 대 실제','스프레드시트','예측 p 와 실제 p 의 차이를 적는다.']],
    budget:[['나무 꼬치 · 막대','1 묶음','약 1 천 원','—'],['실 · 테이프','1','약 1 천 원','—'],['클립 · 동전','1 세트','약 1 천 원','—'],['주방 저울','1','학교 보유','—'],['색종이 장식(선택)','1','약 1 천 원','—']],
    steps:['위 단 막대의 길이 L = 40 cm 를 정하고 왼쪽에 150 g 을 단다.','오른쪽에 아래 단 모빌(총질량 M = 60 + x g)을 달고, 끈 위치를 $p=L\\,M/(m_L+M)$ 로 계산한다.','끈을 계산한 위치에 달아 수평이 되는지 보고 틀어짐을 기록한다.','x 를 20 ~ 120 g 으로 바꾸어 p 를 다시 계산하고 실제로 맞는지 겨룬다.','아래 단도 같은 방법으로 설계해 2 단 모빌을 완성하고 발표한다.'],
    vars:['오른쪽 추 x · 끈 위치 p','수평 틀어짐 각도 · 위치 오차','막대 무게 · 매듭 크기 · 실 굵기'],
    predict:[['x = 60 g · p 계산값','p* = '+fx(a.ps,1)+' cm','$p=LM/(m_L+M)$'],
             ['x = 20 g · p = 20 cm','틀어짐 '+fx(b.off,1)+' cm (오른쪽이 '+(b.off>0?'올라감':'내려감')+')','끈이 계산값과 다르면 기운다'],
             ['x = 120 g · p = 20 cm','p* = '+fx(c.ps,1)+' cm · 틀어짐 '+fx(c.off,1)+' cm','오른쪽이 무거울수록 끈은 오른쪽으로'],
             ['x = 60 g · p = 10 cm','틀어짐 '+fx(d.off,1)+' cm','오차 1 cm 이면 눈에 띄게 기운다']],
    data:{cols:['x (g)','p 측정 (cm)','p* 이론 (cm)','차이 (cm)'], rows:c01(60,20,1).rows.map(function(q){ return [fx(q.x,0),fx(q.p,1),fx(q.ideal,1),fx(q.p-q.ideal,1)]; })},
    analysis:'p 대 x 그래프가 증가하며 위로 볼록한 곡선(쌍곡 모양)임을 확인한다. 이론값과의 차이는 막대 자체 무게 · 매듭 크기 · 눈금 읽기에서 온다. 막대 질량 m_b 를 고려한 보정 $p=\\dfrac{L(M+m_b/2)}{m_L+M+m_b}$ 도 비교해 본다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 모빌'],['핵심 원리','토크 평형 · 무게중심'],['제작 조건','막대 40 cm · 추 질량 표기'],['전시 방법','계산서와 함께 매달기'],['안전','천장에 달 때 사다리 대신 막대 사용']]],
    fails:[['한쪽으로 계속 기운다','끈 위치를 1 cm 씩 옮기며 찾고, 막대 자체의 무게를 점검한다'],['흔들려 읽기 어렵다','손을 떼고 3 초 뒤에 수평을 본다'],['끈이 미끄러진다','매듭 대신 테이프로 막대에 고정한다']],
    up:['<b>R01</b> — 지렛대 평형을 정량적으로 검증.','<b>I04</b> — 천칭 저울 설계.','<b>종합1(15번 탭)</b> — 토크 측정.'],
    next:['원리② 토크와 평형',3],
    eval:[['창의성','모빌의 짜임'],['계산','p 예측과 일치도'],['측정','수평 확인'],['안전','추 낙하 방지']],
    tip:'먼저 계산서를 내고 나서 매달기 — 예측이 맞으면 점수가 큽니다.' });
})();
SIMS.C01={ q:'오른쪽 모빌의 무게와 끈의 위치를 바꾸면 모빌은 어느 쪽으로 기울까?',
  a:{nm:'오른쪽 추 x',min:20,max:120,step:10,val:60,unit:'g',d:0}, b:{nm:'끈 위치 p (왼쪽 끝에서)',min:5,max:35,step:0.5,val:20,unit:'cm',d:1},
  cap1:'막대에 왼쪽 150 g, 오른쪽 작은 모빌(60 g + x)이 달려 있습니다. 끈 위치 p 가 계산값 p* 에 가까우면 수평이 됩니다.',
  cap2:'📊 끈 위치 p 에 따른 순 토크 — 0 이 되는 곳이 평형 위치 p*.',
  note:'모형 : 막대 질량 · 끈 굵기 무시 · $p^*=LM/(m_L+M)$ · 기울기는 어림. 막대 길이 40 cm, 왼쪽 150 g.',
  anim:function(ctx,w,h,t,x,p,S){ var o=c01(x,p,S.seed), cx=w*0.5, cy=h*0.3, sc=w*0.0155, tilt=o.tilt+0.03*Math.sin(t*3)*Math.exp(-(t%6)*0.5);
    cvLine(ctx,[[cx,8],[cx,cy-sc*0]],COL.dim,1.5); var bx=cx-(p-20)*sc; cvLine(ctx,[[bx,8],[bx,cy]],COL.dim,1.5); cvCirc(ctx,bx,cy,4,COL.amber,COL.white,1.2);
    ctx.save(); ctx.translate(bx,cy); ctx.rotate(tilt); drawBeam(ctx,-p*sc,0,(40-p)*sc,0,5,COL.tick);
    var sL=Math.min(46,16+150*0.15); cvLine(ctx,[[-p*sc,0],[-p*sc,34]],COL.dim,1); cvRect(ctx,-p*sc-sL/2,34,sL,sL*0.7,COL.blue,COL.white,1.2); cvText(ctx,'150 g',-p*sc,34+sL*0.35,'#07101f','bold 10.5px system-ui,sans-serif','center');
    var xr=(40-p)*sc; cvLine(ctx,[[xr,0],[xr,34]],COL.dim,1); var sR=Math.min(46,16+o.M*0.15); cvRect(ctx,xr-sR/2,34,sR,sR*0.7,COL.grav,COL.white,1.2); cvText(ctx,o.M.toFixed(0)+' g',xr,34+sR*0.35,'#07101f','bold 10.5px system-ui,sans-serif','center'); ctx.restore();
    cvText(ctx,'p = '+p.toFixed(1)+' cm · 계산값 p* = '+o.ps.toFixed(1)+' cm · 차이 '+o.off.toFixed(1)+' cm '+(o.ok?'✅ 수평':(o.off>0?'↙ 왼쪽이 내려감':'↘ 오른쪽이 내려감')),12,h-14,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,x,p,S){ var o=c01(x,p,S.seed), cur=[], k; for(k=3;k<=37;k+=1){ cur.push([k,G*(150*k-o.M*(40-k))/1000]); }
    var mx=Math.max(Math.abs(cur[0][1]),Math.abs(cur[cur.length-1][1]))*1.1;
    lineGraph(ctx,w,h,{xmin:0,xmax:40,ymin:-mx,ymax:mx,xl:'끈 위치 p (cm)',yl:'순 토크 (mN·m 비례)',title:'p 에 따른 순 토크 — 0 이면 평형',curves:[{pts:cur,col:COL.ok,lw:2.2},{pts:[[0,0],[40,0]],col:COL.dim,lw:1,dash:[4,3]},{pts:[[o.ps,-mx],[o.ps,mx]],col:COL.grav,lw:1.2,dash:[4,3]}],now:[p,G*(150*p-o.M*(40-p))/1000],legend:[['순 토크',COL.ok],['p*',COL.grav],['지금',COL.amber]],yd:1,lw:110}); },
  kv:function(x,p,S){ var o=c01(x,p,S.seed); return [['평형 위치 p*',o.ps.toFixed(1)+' cm','g'],['오른쪽 총질량 M',o.M.toFixed(0)+' g','a'],['틀어짐 p−p*',o.off.toFixed(1)+' cm','v2'],['기울기',(o.tilt*180/PI).toFixed(1)+'°','r'],['판정',o.ok?'수평 ✅':'기운다']]; } };

/* ── C02 : 팽이 디자인 — 돌아가는 시간 t = k R² ω₀ /(μ g r_tip) ───── */
function c02(R,f,seed){ var rn=rng32(seed*11+9), k=0.5+0.5*f/100, w0=60, mu=0.3, rt=0.002, tf=function(RR,kk){ return kk*(RR/100)*(RR/100)*w0/(mu*G*rt); }, rows=[], i;
  for(i=0;i<6;i++){ var RR=2+0.8*i; rows.push({R:RR,t:tf(RR,k)*(1+0.06*gaussR(rn)),ideal:tf(RR,k)}); }
  return {k:k,t:tf(R,k),tf:tf,I_over_m:k*(R/100)*(R/100),L_over_m:k*(R/100)*(R/100)*w0,rows:rows}; }
(function(){ var a=c02(3,0,1), b=c02(3,100,1), c=c02(5,0,1), d=c02(5,100,1);
  mkP({ id:'C02', t:'팽이 디자인 대회 — 오래 도는 팽이의 비밀', icon:'🪀', type:'창의 · 설계 대회', lv:1, dur:'3 일', cost:'약 4 천 원',
    one:'종이 원판과 연필(또는 이쑤시개) 심으로 반지름과 질량 분포가 다른 팽이를 만들어 손가락으로 같은 세기로 돌리고, 돌아가는 시간을 겨루는 대회를 열어 「모양이 왜 오래 도는가」를 관성 모멘트로 설명한다.',
    q:'크기가 클수록 오래 돌까? 무게를 가장자리에 모으면 어떨까? 질량이 크면 오래 돌까?',
    why:'<b>팽이의 오래 돌기</b>는 관성 모멘트와 바닥 마찰의 대결입니다. 마찰 토크가 질량에 비례하면 질량은 약분되어 사라지고 $R^2$ 와 질량 분포 k 만 남는다는 놀라운 결과가 나옵니다.',
    link:'원리③ 관성 모멘트와 τ=Iα(4번 탭) · 원리④ 각운동량(5번 탭).',
    cap:'원판 팽이(왼쪽)와 가장자리에 동전을 붙인 팽이(가운데)를 같은 세기로 돌려 시간을 잰다(오른쪽). 종이 원판 · 심 · 동전 · 스톱워치 · 평평한 바닥 · 기록표',
    parts:[['팽이 몸체','반지름 2 ~ 6 cm','두꺼운 종이 · 재활용 CD 모양','원판 반지름 R 만 바꾼다.'],
           ['심(축)','연필 심 · 이쑤시개','나무 이쑤시개','가운데에 수직으로 정확히 꽂는다. 기울면 흔들린다.'],
           ['질량 분포','가장자리 동전','동전 · 접착 테이프','가장자리에 붙이면 k 가 커진다.'],
           ['돌리는 방법','손가락 비틀기','같은 사람 · 같은 세기','시작 각속도 ω₀ 를 같게 한다.'],
           ['스톱워치 · 영상','도는 시간','스마트폰 슬로 모션','도는 시간은 영상으로 정확히 잰다.'],
           ['기록표','R · 질량 · 시간','스프레드시트','시간 대 R² 그래프.']],
    budget:[['두꺼운 종이','1 묶음','약 1 천 원','—'],['이쑤시개 · 연필 심','1','약 1 천 원','—'],['동전 · 테이프','1 세트','약 1 천 원','—'],['스톱워치','1','보유','—'],['평평한 책상','1','—','—']],
    steps:['반지름 2, 3, 4, 5, 6 cm 의 같은 질량의 원판 팽이를 만든다(가운데 심).','같은 사람이 같은 세기로 돌려 도는 시간을 5 회씩 잰다.','같은 R 에 가장자리 동전을 붙여(질량 분포 변화) 다시 돌린다.','시간 대 $R^2$ 그래프가 직선인지, 가장자리에 모은 경우 기울기가 몇 배인지 비교한다.','가장 오래 돈 팀이 「이론(관성 모멘트)」으로 설명하는 발표를 한다.'],
    vars:['원판 반지름 R · 가장자리 질량 비율 f','도는 시간 t','처음 세기 ω₀ · 바닥 재질 · 심 끝 모양'],
    predict:[['R = 3 cm · 원판','t ≈ '+fx(a.t,1)+' s','$t=kR^2\\omega_0/(\\mu g r_{tip})$'],
             ['R = 3 cm · 가장자리에 질량','t ≈ '+fx(b.t,1)+' s ('+fx(b.t/a.t,1)+' 배)','k=1 이 되면 2 배'],
             ['R = 5 cm · 원판','t ≈ '+fx(c.t,1)+' s ('+fx(c.t/a.t,1)+' 배)','$R^2$ 에 비례'],
             ['R = 5 cm · 가장자리에 질량','t ≈ '+fx(d.t,1)+' s','큰 R 과 가장자리 질량의 곱']],
    data:{cols:['R (cm)','t 측정 (s)','이론 (s)','차이 (%)'], rows:c02(3,0,1).rows.map(function(q){ return [fx(q.R,1),fx(q.t,1),fx(q.ideal,1),fx((q.t/q.ideal-1)*100,0)]; })},
    analysis:'t 대 R² 직선의 기울기가 $k\\omega_0/(\\mu g r_{tip})$ 와 같은지 본다. 같은 R 에서 질량을 2 배로 해도 t 가 변하지 않는지(마찰 토크가 질량에 비례하여 약분) 확인한다. 공기 저항은 작지만 R 이 크면 영향이 커진다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 팽이'],['핵심 원리','관성 모멘트 · 마찰 토크'],['제작 조건','질량 · 심 규격 고정'],['전시 방법','시간 기록 · R² 그래프'],['안전','작은 부품이 날지 않게 · 눈 보호']]],
    fails:[['팽이가 흔들리며 쓰러진다','심의 수직을 맞추고, 중심을 정확히 잡는다'],['시간이 매번 다르다','돌리는 세기를 같게, 5 회 평균'],['바닥에서 미끄러진다','바닥을 매끈한 책상으로 바꾼다']],
    up:['<b>R03</b> — 관성 모멘트 측정.','<b>I06</b> — 자이로 안정화.','<b>C03</b> — 각운동량 마술.'],
    next:['원리③ 관성 모멘트와 τ=Iα',4],
    eval:[['창의성','팽이 디자인'],['과학적 설명','I 와 마찰 토크'],['측정','시간 · R² 그래프'],['안전','부품 비산 방지']],
    tip:'「질량이 달라도 시간이 같다」는 놀라운 결과를 실험으로 확인하는 것이 하이라이트입니다.' });
})();
SIMS.C02={ q:'팽이의 크기와 질량 분포를 바꾸면 도는 시간은 얼마나 달라질까?',
  a:{nm:'반지름 R',min:2,max:6,step:0.5,val:3,unit:'cm',d:1}, b:{nm:'가장자리 질량 비율 f',min:0,max:100,step:10,val:0,unit:'%',d:0},
  cap1:'손가락으로 ω₀ = 60 rad/s 로 돌린 팽이. 마찰 토크 $\\mu m g r_{tip}$ 로 각속도가 직선적으로 줄어 멈춥니다.',
  cap2:'📊 반지름 R 에 따른 도는 시간 — 지금 모양(초록)과 원판(점선)을 비교.',
  note:'모형 : $I=kmR^2$ (k=0.5~1) · 마찰 토크 $\\mu m g r_{tip}$ (μ=0.3, 끝 반지름 2 mm) · 공기 저항 무시 · 측정 잡음 6 %.',
  anim:function(ctx,w,h,t,R,f,S){ var o=c02(R,f,S.seed), cx=w*0.3, cy=h*0.55, rr=Math.min(h*0.34,w*0.18)*R/6+16, T=o.t, tc=(t%(T*1.4+1)), om=tc<T? 60*(1-tc/T):0, th=tc<T? 60*(tc-tc*tc/(2*T)):60*T/2;
    drawWheel(ctx,cx,cy,rr,th,f>50?1:0.5); cvLine(ctx,[[cx,cy],[cx,cy+rr+12]],COL.tick,3); cvLine(ctx,[[cx-30,cy+rr+12],[cx+30,cy+rr+12]],COL.dim,2);
    cvText(ctx,'t = '+Math.min(tc,T).toFixed(1)+' / '+T.toFixed(1)+' s · ω = '+om.toFixed(0)+' rad/s',12,16,COL.text,'bold 12px system-ui,sans-serif');
    var bx=w*0.6, bw=w*0.34; barRows(ctx,bx-110,h*0.3,bw+120,h*0.5,[['지금 모양',T,COL.ok],['원판 R='+R+' cm',o.tf(R,0.5),COL.dim],['고리 R='+R+' cm',o.tf(R,1),COL.blue]],Math.max(T,o.tf(R,1))*1.1,' s'); },
  graph:function(ctx,w,h,R,f,S){ var o=c02(R,f,S.seed), c1=[],c2=[],k; for(k=2;k<=6.01;k+=0.2){ c1.push([k,o.tf(k,o.k)]); c2.push([k,o.tf(k,0.5)]); }
    lineGraph(ctx,w,h,{xmin:1.5,xmax:6.5,ymin:0,ymax:Math.max(8,o.tf(6,1)*1.1),xl:'반지름 R (cm)',yl:'도는 시간 t (s)',title:'R 에 따른 도는 시간 t ∝ R²',curves:[{pts:c1,col:COL.ok,lw:2.2},{pts:c2,col:COL.dim,lw:1.4,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.R,q.t]; }),now:[R,o.t],legend:[['지금 모양',COL.ok],['원판',COL.dim],['측정',COL.blue],['지금',COL.amber]],yd:1,lw:110}); },
  kv:function(R,f,S){ var o=c02(R,f,S.seed); return [['k (I/mR²)',o.k.toFixed(2),'a'],['도는 시간',o.t.toFixed(1)+' s','g'],['원판 대비',(o.t/o.tf(R,0.5)).toFixed(2)+' 배','v2'],['I/m',(o.I_over_m*1e4).toFixed(1)+' cm²','r'],['질량 의존','없음(약분)']]; } };

/* ── C03 : 각운동량 마술 — 팔을 오므리면 빨라진다 ──────────────────── */
function c03(m,ro,seed){ var rn=rng32(seed*7+5), I0=1.2, ri=0.15, w0=1.0, Io=I0+2*m*(ro/100)*(ro/100), Ii=I0+2*m*ri*ri, wf=w0*Io/Ii, rows=[], i;
  for(i=0;i<6;i++){ var rr=30+10*i, Io2=I0+2*m*(rr/100)*(rr/100), wi=w0*Io2/Ii; rows.push({r:rr,w:wi*(1+0.06*gaussR(rn)),ideal:wi}); }
  return {Io:Io,Ii:Ii,wf:wf,rpm:wf*60/TAU,Kr:Io/Ii,W:0.5*Ii*wf*wf-0.5*Io*w0*w0,rows:rows,w0:w0}; }
(function(){ var a=c03(1,60,1), b=c03(0.5,60,1), c=c03(1,40,1), d=c03(2,80,1);
  mkP({ id:'C03', t:'각운동량 마술 쇼 — 팔을 오므리면 왜 빨라질까', icon:'🧍', type:'창의 · 설계 대회', lv:1, dur:'3 일', cost:'약 2 천 원',
    one:'회전 의자에 앉아 작은 아령(0.5 ~ 2 kg 이하, 또는 물병)을 양손에 들고 팔을 벌린 채 천천히 돌다가 팔을 오므려 속도 변화를 영상으로 재고, 각운동량 보존 $I_1\\omega_1=I_2\\omega_2$ 를 검증하는 마술 쇼를 만든다.',
    q:'팔을 오므리면 얼마나 빨라질까? 아령이 가벼우면 효과가 줄어들까? 오므릴 때 일(에너지)은 어디서 올까?',
    why:'<b>피겨 스케이터의 스핀</b>을 교실에서 재현합니다. 각운동량이 보존되면 I 가 작아질수록 ω 가 커지고, 몸이 한 일 때문에 운동 에너지도 증가한다는 것을 느낄 수 있습니다.',
    link:'원리④ 각운동량(5번 탭) · R05 회전 의자 · 종합2(16번 탭).',
    cap:'회전 의자에서 팔을 벌려 천천히 돌다(왼쪽) 팔을 오므려(가운데) 빨라진 속도를 영상으로 측정(오른쪽). 의자 · 아령 · 스마트폰 · 마커 · 기록표',
    parts:[['회전 의자','마찰 작은 의자','교실 회전 의자(보조자 필수)','반드시 보조자가 의자를 잡아 주고 천천히 시작한다.'],
           ['아령(분동)','0.5 ~ 2 kg','물병 · 작은 아령','가벼운 것부터. 던지거나 놓치지 않도록.'],
           ['스마트폰 영상','회전 속도 측정','위에서 촬영 · 슬로 모션','손에 붙인 마커가 한 바퀴 도는 시간.'],
           ['팔 길이 표시','r 측정','줄자','팔을 벌렸을 때 아령까지의 거리.'],
           ['보조자','안전','2 명 이상','시작 · 정지 때 의자를 잡는다. 어지러우면 즉시 중단.'],
           ['기록표','m · r · ω','스프레드시트','팔 벌림 거리 대 최종 회전율.']],
    budget:[['물병(분동 대용)','2','—','—'],['줄자','1','약 2 천 원','—'],['스마트폰','1','보유','—'],['회전 의자','1','학교 보유','—'],['마커 스티커','1','—','—']],
    steps:['안전 확인(보조자 · 바닥 · 낮은 속도). 팔을 벌려 천천히(약 1 rad/s) 의자를 돌린다.','영상으로 처음 회전율 ω₁ 을 잰다.','팔을 천천히 가슴으로 오므려 ω₂ 를 영상으로 잰다(3 회).','아령 질량(0.5, 1, 2 kg) 또는 벌린 거리(30 ~ 80 cm)를 바꿔 반복한다.','$I_1\\omega_1=I_2\\omega_2$ 로 예측한 ω₂ 와 비교한다.'],
    vars:['아령 질량 m · 벌린 거리 r','오므린 뒤 각속도 ω₂','처음 속도 · 의자 마찰 · 몸 자세'],
    predict:[['m = 1 kg · r = 60 cm','ω₂ ≈ '+fx(a.wf,1)+' rad/s ('+fx(a.rpm,0)+' rpm)','$\\omega_2=\\omega_1 I_1/I_2$'],
             ['m = 0.5 kg · r = 60 cm','ω₂ ≈ '+fx(b.wf,1)+' rad/s','가벼우면 효과 줄어든다'],
             ['m = 1 kg · r = 40 cm','ω₂ ≈ '+fx(c.wf,1)+' rad/s','벌린 거리가 작으면 효과 작다'],
             ['m = 2 kg · r = 80 cm','ω₂ ≈ '+fx(d.wf,1)+' rad/s ('+fx(d.rpm,0)+' rpm)','안전을 위해 이 이상은 하지 않는다']],
    data:{cols:['r (cm)','ω₂ 측정 (rad/s)','이론 (rad/s)','차이 (%)'], rows:c03(1,60,1).rows.map(function(q){ return [fx(q.r,0),fx(q.w,2),fx(q.ideal,2),fx((q.w/q.ideal-1)*100,0)]; })},
    analysis:'ω₂ 대 I₁/I₂ 가 원점을 지나는 직선(기울기 ω₁)인지 확인한다. 오므리는 동안 몸이 한 일 $W=\\tfrac12I_2\\omega_2^2-\\tfrac12I_1\\omega_1^2$ 의 크기를 계산해 에너지 증가가 어디서 왔는지 토론한다. 의자 마찰은 조금씩 L 을 줄인다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 회전 마술'],['핵심 원리','각운동량 보존'],['제작 조건','낮은 속도 · 보조자 필수'],['전시 방법','영상 · 이론값 비교'],['안전','어지러우면 중단 · 아령 놓치지 않기 · 의자 고정 확인']]],
    fails:[['의자가 거의 안 돈다','의자 높이 · 축 윤활을 점검하고 보조자가 가볍게 민다'],['속도 변화가 작다','아령을 더 멀리 벌리고 오므린다(안전 한도 내)'],['영상에서 읽기 어렵다','마커를 크게 붙이고 위에서 촬영한다']],
    up:['<b>R05</b> — 회전 의자 정량 측정.','<b>I05</b> — 반작용 휠 자세 제어.','<b>종합2(16번 탭)</b> — 각운동량 보존.'],
    next:['원리④ 각운동량',5],
    eval:[['창의성','쇼 구성'],['과학적 설명','L 보존 · 에너지'],['측정','영상 분석'],['안전','어지러움 · 낙하 방지']],
    tip:'가장 중요한 것은 안전입니다. 속도는 늘 「천천히」, 보조자는 「필수」.' });
})();
SIMS.C03={ q:'아령 질량과 팔 벌림 거리를 바꾸면 팔을 오므린 뒤 얼마나 빨라질까?',
  a:{nm:'아령 질량(한 손)',min:0.5,max:2,step:0.25,val:1,unit:'kg',d:2}, b:{nm:'팔 벌림 거리 r',min:30,max:80,step:5,val:60,unit:'cm',d:0},
  cap1:'위에서 본 모습. 팔을 벌려 ω₁ = 1 rad/s 로 돌다가 오므리면 각운동량 보존으로 빨라집니다(몸 I₀ = 1.2 kg·m²).',
  cap2:'📊 팔 벌림 거리 r 에 따른 오므린 뒤 각속도 ω₂ — 이론(선)과 측정(점).',
  note:'모형 : 몸 $I_0=1.2$ kg·m² · 아령 2 개 · 오므린 거리 15 cm · $L=I\\omega$ 보존 · 의자 마찰 무시 · 측정 잡음 6 %.',
  anim:function(ctx,w,h,t,m,ro,S){ var o=c03(m,ro,S.seed), cx=w*0.3, cy=h*0.52, cyc=8, tc=t%cyc, ph=tc<2? 0:(tc<4? (tc-2)/2:(tc<6? 1:1-(tc-6)/2)), r=(ro*(1-ph)+15*ph)/100, sc=Math.min(h*0.4,w*0.2)/0.9, om=o.w0+(o.wf-o.w0)*ph;
    if(!S._ang) S._ang=0; if(S._lt==null||t<S._lt) S._ang=0; var dt=S._lt==null||t<S._lt? 0:t-S._lt; S._lt=t; S._ang+=om*dt;
    var ang=S._ang; cvCirc(ctx,cx,cy,16,'rgba(148,163,184,.55)',COL.white,1.2); [0,PI].forEach(function(a0){ var ex=cx+r*sc*Math.cos(ang+a0), ey=cy+r*sc*Math.sin(ang+a0); cvLine(ctx,[[cx,cy],[ex,ey]],COL.tick,4); cvCirc(ctx,ex,ey,5+m*3,COL.grav,COL.white,1.2); });
    cvText(ctx,'r = '+(r*100).toFixed(0)+' cm · ω = '+om.toFixed(2)+' rad/s ('+w2rpm(om).toFixed(0)+' rpm)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.5,h*0.28,w*0.46,h*0.5,[['I 벌림',o.Io,COL.blue],['I 오므림',o.Ii,COL.ok],['ω₁ (×)',o.w0,COL.dim],['ω₂ (×)',o.wf,COL.amber]],Math.max(o.Io,o.wf)*1.1,''); },
  graph:function(ctx,w,h,m,ro,S){ var o=c03(m,ro,S.seed), cur=[],k; for(k=30;k<=80;k+=2){ cur.push([k,c03(m,k,S.seed).wf]); }
    lineGraph(ctx,w,h,{xmin:25,xmax:85,ymin:0,ymax:Math.max(5,c03(m,80,S.seed).wf*1.1),xl:'팔 벌림 거리 r (cm)',yl:'오므린 뒤 ω₂ (rad/s)',title:'r 에 따른 ω₂ = ω₁I₁/I₂',curves:[{pts:cur,col:COL.ok,lw:2.2}],pts:o.rows.map(function(q){ return [q.r,q.w]; }),now:[ro,o.wf],legend:[['이론',COL.ok],['측정',COL.blue],['지금',COL.amber]],yd:1,lw:90}); },
  kv:function(m,ro,S){ var o=c03(m,ro,S.seed); return [['I 벌림',o.Io.toFixed(2)+' kg·m²','a'],['I 오므림',o.Ii.toFixed(2)+' kg·m²','g'],['ω₂',o.wf.toFixed(2)+' rad/s','v2'],['운동 에너지 증가 배율',o.Kr.toFixed(2)+' 배','r'],['몸이 한 일',o.W.toFixed(2)+' J']]; } };

/* ── C04 : 구슬 롤러코스터 루프 — h_min = (2 + (1+k)/2) R ─────────── */
var KSH4=[null,{n:'속이 찬 구슬',k:0.4},{n:'속 빈 공',k:2/3},{n:'속이 찬 원통',k:0.5},{n:'고리(링)',k:1}];
function c04(R,sh,seed){ var rn=rng32(seed*5+1), k=KSH4[Math.round(sh)].k, hm=(2+(1+k)/2)*R, hs=2.5*R, rows=[], i;
  for(i=0;i<6;i++){ var RR=6+2*i, hh=(2+(1+k)/2)*RR; rows.push({R:RR,h:hh*(1+0.05*gaussR(rn))+0.3*gaussR(rn),ideal:hh}); }
  return {k:k,hm:hm,hs:hs,ex:hm-hs,vtop:Math.sqrt(G*R/100),rows:rows}; }
(function(){ var a=c04(10,1,1), b=c04(10,2,1), c=c04(10,4,1), d=c04(15,1,1);
  mkP({ id:'C04', t:'구슬 롤러코스터 루프 설계 — 최소 출발 높이는?', icon:'🎢', type:'창의 · 설계 대회', lv:2, dur:'1 주', cost:'약 5 천 원',
    one:'단열재 파이프나 U 자 홈통으로 반지름 R 의 수직 원형 루프가 있는 구슬 트랙을 만들고, 구슬이 루프를 통과하는 최소 출발 높이 h_min 을 이론(에너지 보존 + 구름 조건)으로 예측해 겨루는 대회를 연다.',
    q:'루프를 돌려면 얼마 높이에서 놓아야 할까? 미끄러지는 물체와 구르는 구슬은 어떻게 다를까? 구슬의 크기와 R 은?',
    why:'<b>롤러코스터 루프</b>는 구심력 · 에너지 보존 · 회전 에너지가 한꺼번에 나오는 종합 문제입니다. 구르는 물체는 회전 운동 에너지 때문에 더 높은 곳에서 출발해야 합니다.',
    link:'원리⑤ 회전 에너지와 구르기(6번 탭) · R04 구르기 경주.',
    cap:'단열재 파이프로 만든 트랙: 경사(출발 높이 h) → 아래쪽 평지 → 반지름 R 의 수직 루프(가운데). 구슬이 꼭대기에서 떨어지지 않고 통과해야 성공(오른쪽). 트랙 · 루프 · 구슬 · 자 · 영상 · 기록표',
    parts:[['트랙(경사)','홈통 · 파이프 단열재','반으로 가른 단열재 파이프','출발 높이를 자로 잰다. 안쪽을 매끈하게.'],
           ['루프','수직 원형 R = 6 ~ 16 cm','굽혀 만든 원','루프 모양이 찌그러지지 않게 고정한다.'],
           ['구슬','유리 · 철 구슬','지름 1.6 cm 정도','질량과 모양을 바꿔 비교한다.'],
           ['높이 측정','출발 높이 h','줄자 · 수평자','구슬 중심의 높이를 잰다(바닥 기준).'],
           ['스마트폰 영상','통과 여부','슬로 모션','떨어지는 지점을 확인한다.'],
           ['기록표','R · h · 성공 여부','스프레드시트','최소 성공 높이 h_min 대 R 그래프.']],
    budget:[['단열재 파이프','2 m','약 3 천 원','—'],['구슬 여러 종','1 세트','약 2 천 원','—'],['테이프 · 받침','1','약 1 천 원','—'],['줄자','1','약 2 천 원','—'],['스마트폰','1','보유','—']],
    steps:['루프 반지름 R = 6, 8, 10, 12, 14 cm 를 만들어 트랙에 고정한다.','구슬 중심 높이 h 를 올려 가며 놓아 루프를 통과하는 최소 높이 h_min 을 찾는다(3 회 반복).','구슬 종류(속이 찬 구슬 · 속 빈 공 등)를 바꿔 h_min 을 비교한다.','h_min 대 R 그래프의 기울기가 $2+(1+k)/2$ 인지 확인한다.','가장 작은 h 로 통과한 팀을 이론으로 설명한다.'],
    vars:['루프 반지름 R · 구슬의 모양(k)','최소 출발 높이 h_min','경사 마찰 · 구슬 반지름 · 연결부 매끄러움'],
    predict:[['R = 10 cm · 속이 찬 구슬','h_min ≈ '+fx(a.hm,1)+' cm ('+fx(a.hm/10,2)+' R)','$h=(2+(1+k)/2)R$, k=0.4'],
             ['R = 10 cm · 속 빈 공','h_min ≈ '+fx(b.hm,1)+' cm','k 가 크면 더 높은 곳에서'],
             ['R = 10 cm · 고리','h_min ≈ '+fx(c.hm,1)+' cm','k=1 이면 3R'],
             ['R = 15 cm · 속이 찬 구슬','h_min ≈ '+fx(d.hm,1)+' cm','R 에 비례']],
    data:{cols:['R (cm)','h_min 측정 (cm)','이론 (cm)','차이 (cm)'], rows:c04(10,1,1).rows.map(function(q){ return [fx(q.R,0),fx(q.h,1),fx(q.ideal,1),fx(q.h-q.ideal,1)]; })},
    analysis:'h_min 대 R 이 원점을 지나는 직선인지 최소제곱으로 구하고 기울기를 $2+(1+k)/2$ 와 비교한다(미끄러지는 물체는 2.5). 구슬 반지름 r 이 R 에 비해 클 때는 R 대신 R−r 를 쓰는 보정을 한다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 루프 코스터'],['핵심 원리','에너지 보존 · 구심력 · 회전 에너지'],['제작 조건','R 6 ~ 16 cm, 구슬 지름 고정'],['전시 방법','최소 높이 시연'],['안전','구슬이 튀지 않게 바닥에 받침']]],
    fails:[['구슬이 루프 중간에서 떨어진다','출발 높이를 올리거나 연결부 단차를 없앤다'],['매번 결과가 다르다','출발 위치를 표시하고 같은 방법으로 놓는다'],['루프가 흔들린다','루프를 책상에 테이프로 단단히 붙인다']],
    up:['<b>R04</b> — 구르기 경주 정량.','<b>I09</b> — 에너지 회수 장치.','<b>종합3(17번 탭)</b> — 구르기 측정.'],
    next:['원리⑤ 회전 에너지와 구르기',6],
    eval:[['창의성','트랙 구성'],['과학적 설명','k 와 h_min'],['측정','h_min 찾기'],['안전','구슬 낙하']],
    tip:'「미끄러지는 경우 2.5 R, 구르면 2.7 R」이라는 숫자를 실험으로 확인해 보세요.' });
})();
SIMS.C04={ q:'루프의 크기와 구슬의 종류를 바꾸면 최소 출발 높이는 어떻게 달라질까?',
  a:{nm:'루프 반지름 R',min:5,max:20,step:1,val:10,unit:'cm',d:0}, b:{nm:'구슬 종류',min:1,max:4,step:1,val:1,unit:'',d:0,fmt:pick(['속이 찬 구슬','속 빈 공','속이 찬 원통','고리(링)'])},
  cap1:'출발 높이를 h_min 으로 놓으면 꼭대기에서 겨우 통과합니다. 점선은 미끄러지는 경우의 높이 2.5 R.',
  cap2:'📊 루프 반지름 R 에 따른 최소 출발 높이 — 모양별 직선(기울기 2+(1+k)/2).',
  note:'모형 : 구슬 크기 무시 · 충분히 매끄러운 연결부 · 구름 조건(미끄러지지 않음) · 꼭대기에서 $v^2\\geq gR$ · 측정 잡음 5 % + 0.3 cm.',
  anim:function(ctx,w,h,t,R,sh,S){ var o=c04(R,sh,S.seed), sc=Math.min(h*0.62/Math.max(o.hm,2*R),w*0.0085), bx=w*0.2, gy=h*0.88, lcx=w*0.55, lcy=gy-R*sc, ang=((t%6)/6)*2.2;
    ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(lcx,lcy,R*sc,0,TAU); ctx.stroke(); cvLine(ctx,[[bx,gy-o.hm*sc],[lcx-R*sc*0.9,gy]],COL.tick,3); cvLine(ctx,[[lcx-R*sc*0.9,gy],[lcx,gy]],COL.tick,3);
    cvLine(ctx,[[bx-60,gy-o.hm*sc],[bx,gy-o.hm*sc]],COL.ok,1.5); cvLine(ctx,[[bx-60,gy-o.hs*sc],[bx,gy-o.hs*sc]],COL.dim,1.5); cvText(ctx,'h_min '+o.hm.toFixed(1)+' cm',bx-62,gy-o.hm*sc-8,COL.ok,'bold 11.5px system-ui,sans-serif'); cvText(ctx,'2.5R '+o.hs.toFixed(1)+' cm',bx-62,gy-o.hs*sc+14,COL.dim,'11px system-ui,sans-serif');
    var u=(t%6)/6, px,py; if(u<0.4){ px=bx+(lcx-R*sc*0.9-bx)*(u/0.4); py=gy-o.hm*sc+(o.hm*sc)*(u/0.4); } else if(u<0.45){ px=lcx-R*sc*0.9+(R*sc*0.9)*((u-0.4)/0.05); py=gy; } else { var a2=(u-0.45)/0.55*TAU; px=lcx-R*sc*Math.sin(a2); py=lcy+R*sc*Math.cos(a2); }
    cvCirc(ctx,px,py,6,COL.grav,COL.white,1.4); cvText(ctx,KSH4[Math.round(sh)].n+' (k = '+o.k.toFixed(2)+')',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'꼭대기 속력 ≥ '+(o.vtop).toFixed(2)+' m/s',w-12,16,COL.tick,'11.5px system-ui,sans-serif','right'); },
  graph:function(ctx,w,h,R,sh,S){ var o=c04(R,sh,S.seed), cv=[],cs=[],k; for(k=5;k<=20;k+=1){ cv.push([k,(2+(1+o.k)/2)*k]); cs.push([k,2.5*k]); }
    lineGraph(ctx,w,h,{xmin:4,xmax:21,ymin:0,ymax:70,xl:'루프 반지름 R (cm)',yl:'최소 출발 높이 h (cm)',title:'h_min 대 R — 기울기 2+(1+k)/2',curves:[{pts:cv,col:COL.ok,lw:2.2},{pts:cs,col:COL.dim,lw:1.4,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.R,q.h]; }),now:[R,o.hm],legend:[['구름',COL.ok],['미끄러짐',COL.dim],['측정',COL.blue],['지금',COL.amber]],yd:0,lw:100}); },
  kv:function(R,sh,S){ var o=c04(R,sh,S.seed); return [['k',o.k.toFixed(2),'a'],['h_min',o.hm.toFixed(1)+' cm','g'],['h_min / R',(o.hm/R).toFixed(2),'v2'],['미끄러짐 때',o.hs.toFixed(1)+' cm','r'],['꼭대기 최소 속력',o.vtop.toFixed(2)+' m/s']]; } };

/* ── C05 : 렌치 체험 부스 — τ = F·L ──────────────────────────────── */
function c05(L,F,seed){ var rn=rng32(seed*3+7), need=5, tau=F*L/100, Lmin=need/F*100, rows=[], i;
  for(i=0;i<6;i++){ var LL=10+16*i; rows.push({L:LL,tau:(F*LL/100)*(1+0.06*gaussR(rn)),ideal:F*LL/100}); }
  return {tau:tau,need:need,Lmin:Lmin,ok:tau>=need,ratio:tau/need,Fmin:need/(L/100),rows:rows}; }
(function(){ var a=c05(20,40,1), b=c05(60,40,1), c=c05(20,80,1), d=c05(100,20,1);
  mkP({ id:'C05', t:'렌치 토크 체험 부스 — 긴 손잡이의 힘', icon:'🔧', type:'창의 · 설계 대회', lv:1, dur:'3 일', cost:'약 1 만 원',
    one:'나무 널빤지에 고정한 큰 너트를 길이를 바꿀 수 있는 손잡이(막대)로 돌려 보며 필요한 힘을 용수철 저울로 재고, $\\tau=FL$ 를 체험으로 익히는 학교 축제 부스를 설계한다.',
    q:'손잡이가 두 배로 길면 힘은 절반이면 될까? 긴 막대를 끼우면 왜 쉽게 돌아갈까? 어떤 각도로 당기는 것이 가장 효율적일까?',
    why:'<b>렌치 · 스패너 · 병뚜껑 따개</b>가 모두 토크 증폭 장치입니다. 몸으로 체험하면서 「돌리는 힘 = 힘 × 팔 길이」를 숫자로 느끼는 부스는 학교 축제에서 인기가 많습니다.',
    link:'원리② 토크와 평형(3번 탭) · R02 문 열기.',
    cap:'큰 너트(안전한 모형, 필요 토크 5 N·m)에 손잡이 길이 L 을 바꾸어 끼우고(가운데) 용수철 저울로 당겨 필요한 힘 F 를 재서 비교한다(오른쪽). 너트 판 · 손잡이 · 용수철 저울 · 자 · 안내판 · 기록표',
    parts:[['너트 판','모형 너트 · 볼트','목재 판 + 큰 나사','필요 토크를 5 N·m 이하로 미리 맞춘다.'],
           ['손잡이(막대)','10 ~ 100 cm','나무 막대 · 파이프','길이를 바꿔 끼운다. 단단히 고정.'],
           ['용수철 저울','0 ~ 100 N','큰 용수철 저울','손잡이 끝에서 직각으로 당긴다.'],
           ['각도 표시','θ 조절','각도기','당기는 각도를 30°, 60°, 90°로 바꾼다.'],
           ['안전 장구','보호','장갑 · 안경','미끄러져 다치지 않게 하고 힘은 서서히 준다.'],
           ['기록표 · 안내판','F · L','스프레드시트','손잡이 길이 대 필요한 힘 그래프를 안내판으로.']],
    budget:[['목재 판 · 나사','1','약 4 천 원','—'],['나무 막대','2 개','약 3 천 원','—'],['용수철 저울','1','학교 보유','—'],['각도기 · 줄자','1','약 2 천 원','—'],['안내판 · 장갑','1 세트','약 1 천 원','—']],
    steps:['필요 토크를 정한 너트 판을 책상에 단단히 고정한다.','손잡이 길이를 L = 10 cm 부터 100 cm 까지 바꿔 너트가 돌기 시작하는 힘 F 를 잰다(3 회).','당기는 각도를 30°, 60°, 90° 로 바꿔 F 변화를 확인한다.','F 대 1/L 그래프의 기울기가 필요한 토크 5 N·m 인지 확인한다.','부스 안내판에 「왜 긴 손잡이가 쉬운가」를 그림으로 설명한다.'],
    vars:['손잡이 길이 L · 당기는 각도 θ','필요한 힘 F','너트 조임 정도 · 마찰 · 손 위치'],
    predict:[['L = 20 cm · F = 40 N','τ = '+fx(a.tau,1)+' N·m · '+(a.ok?'돌아간다':'안 돌아간다'),'$\\tau=FL$ 가 5 N·m 이상이면 돈다'],
             ['L = 60 cm · F = 40 N','τ = '+fx(b.tau,1)+' N·m · '+(b.ok?'돌아간다':'안 돌아간다'),'긴 손잡이'],
             ['L = 20 cm · F = 80 N','τ = '+fx(c.tau,1)+' N·m','힘이 크면 짧아도 돈다'],
             ['L = 100 cm · F = 20 N','τ = '+fx(d.tau,1)+' N·m · 최소 힘 '+fx(d.Fmin,0)+' N','5 N·m ÷ 1 m = 5 N']],
    data:{cols:['L (cm)','τ 측정 (N·m)','이론 (N·m)','차이 (%)'], rows:c05(20,40,1).rows.map(function(q){ return [fx(q.L,0),fx(q.tau,2),fx(q.ideal,2),fx((q.tau/q.ideal-1)*100,0)]; })},
    analysis:'필요한 힘 F 대 1/L 이 원점을 지나는 직선이며 기울기가 필요한 토크(5 N·m)인지 본다. 각도 θ 에서는 $F_{min}=\\tau/(L\\sin\\theta)$ 로 증가함을 확인한다. 손으로 당기는 힘은 개인차가 크므로 평균을 쓴다.',
    special:['🎨 작품 기획서',[['작품 이름','○○ 토크 체험관'],['핵심 원리','토크 = 힘 × 팔 길이'],['제작 조건','필요 토크 5 N·m 이하'],['전시 방법','체험 + 그래프 안내판'],['안전','최대 힘 제한 · 장갑 · 학생 보조자']]],
    fails:[['너트가 안 돈다','필요 토크를 낮추거나 손잡이를 길게 한다'],['저울 값이 흔들린다','서서히 당겨 돌기 시작하는 순간의 값을 읽는다'],['손잡이가 미끄러진다','손잡이를 단단히 끼우고 장갑을 쓴다']],
    up:['<b>R02</b> — 문 열기로 정량 측정.','<b>I01</b> — 토크 렌치 모형.','<b>C01</b> — 균형 모빌.'],
    next:['원리② 토크와 평형',3],
    eval:[['창의성','체험 구성'],['과학적 설명','τ = FL'],['측정','F · L 그래프'],['안전','힘 제한 · 고정']],
    tip:'체험자가 직접 「짧은 손잡이 → 긴 손잡이」를 바꿔 느껴 보게 하면 설명이 필요 없습니다.' });
})();
SIMS.C05={ q:'손잡이의 길이와 당기는 힘을 바꾸면 너트를 돌릴 수 있을까?',
  a:{nm:'손잡이 길이 L',min:10,max:100,step:5,val:20,unit:'cm',d:0}, b:{nm:'당기는 힘 F',min:10,max:100,step:5,val:40,unit:'N',d:0},
  cap1:'너트(필요 토크 5 N·m)에 손잡이를 끼워 당깁니다. 힘 × 팔 길이가 5 N·m 를 넘으면 돌아갑니다.',
  cap2:'📊 손잡이 길이 L 에 따른 토크 τ = FL — 5 N·m 선을 넘는 곳이 돌아가는 영역.',
  note:'모형 : 직각으로 당김 · 마찰 무시 · 필요 토크 5 N·m 고정 · 측정 잡음 6 %.',
  anim:function(ctx,w,h,t,L,F,S){ var o=c05(L,F,S.seed), cx=w*0.3, cy=h*0.55, sc=Math.min(w*0.0045,h*0.0035)*1.0, ang=o.ok? Math.min(1.2,(t%5)*0.6):0.04*Math.sin(t*4);
    cvCirc(ctx,cx,cy,14,'rgba(148,163,184,.6)',COL.white,1.2); ctx.save(); ctx.translate(cx,cy); ctx.rotate(-ang); drawBeam(ctx,0,0,L*sc*1.0,0,7,COL.tick); cvArrow(ctx,L*sc,0,L*sc,-F*0.55,COL.grav,3); ctx.restore();
    arcArrow(ctx,cx,cy,22,-0.3,-1.3,COL.amber,2.4); cvText(ctx,'τ = F·L = '+F+' × '+(L/100).toFixed(2)+' = '+o.tau.toFixed(1)+' N·m '+(o.ok?'✅ 돌아간다':'✗ 안 돈다'),12,16,o.ok?COL.ok:COL.amber,'bold 12px system-ui,sans-serif');
    barRows(ctx,w*0.55,h*0.28,w*0.4,h*0.5,[['필요',o.need,COL.dim],['지금 τ',o.tau,o.ok?COL.ok:COL.grav]],Math.max(o.need,o.tau)*1.15,' N·m'); },
  graph:function(ctx,w,h,L,F,S){ var o=c05(L,F,S.seed), cv=[[10,F*0.1],[100,F*1.0]];
    lineGraph(ctx,w,h,{xmin:0,xmax:105,ymin:0,ymax:Math.max(10,F*1.1),xl:'손잡이 길이 L (cm)',yl:'토크 τ (N·m)',title:'L 에 따른 토크 τ = F·L',curves:[{pts:cv,col:COL.ok,lw:2.2},{pts:[[0,o.need],[105,o.need]],col:COL.grav,lw:1.4,dash:[4,3]}],pts:o.rows.map(function(q){ return [q.L,q.tau]; }),now:[L,o.tau],legend:[['τ = FL',COL.ok],['필요 5 N·m',COL.grav],['측정',COL.blue],['지금',COL.amber]],yd:1,lw:120}); },
  kv:function(L,F,S){ var o=c05(L,F,S.seed); return [['토크 τ',o.tau.toFixed(2)+' N·m','a'],['필요 토크',o.need.toFixed(1)+' N·m','g'],['필요한 최소 힘',o.Fmin.toFixed(1)+' N','v2'],['필요한 최소 길이',o.Lmin.toFixed(0)+' cm','r'],['판정',o.ok?'돌아간다':'안 돈다']]; } };
