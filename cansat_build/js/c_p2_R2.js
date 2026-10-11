/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R06 ~ R10
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R06 : 착륙 충격과 완충 두께 (반사인 펄스 : 최댓값 = π/2 × 평균) ─────────── */
function r06(dmm, Hcm){ var v=Math.sqrt(2*SUBJ.g*Hcm/100), d=dmm/1000, avg=v*v/(2*d)/SUBJ.g; return {v:v, avg:avg, peak:avg*Math.PI/2, ts:2*d/v*1000, K:(Math.PI/2)*v*v/(2*SUBJ.g)}; }
(function(){
  var rows=[20,40,60,80].map(function(d){ var q=r06(d,30); return [fx(d,0),fx(q.v,2),fx(q.avg,1),fx(q.peak,1),fx(q.ts,0),q.peak>16?'포화 위험':'읽힘']; });
  PROJ.R06={ id:'R06', t:'착륙 충격과 완충 두께 — a = v²/2d 를 가속도계로 확인', icon:'📉', type:'프로젝트 · R&E', lv:2, dur:'3주', cost:'1 ~ 3만 원',
    one:'가속도 센서(스마트폰 · MPU6050 · ADXL375)를 폼 위로 떨어뜨려 충격 가속도의 최댓값을 재고, 완충 두께 d 에 대해 $a_{\\max}\\propto1/d$ 와 $a_{\\max}\\propto v^2$ 를 확인한다.',
    q:'폼의 두께 d 와 낙하 높이 H 를 바꿀 때 최대 충격 가속도는 $a_{\\max}=\\dfrac{\\pi}{2}\\dfrac{v^2}{2d}$ 로 예측될까? 센서 한계(포화)는 어떻게 피할까?',
    why:'6번 탭의 식 $a=v^2/2d$ 를 <b>직접 재서 증명</b>합니다. 한편 센서가 읽는 것은 평균이 아니라 순간의 <b>최댓값</b>(평균의 약 1.57 배)이고, 센서에는 측정 범위가 있어 「값이 잘려 나가는 현상(포화)」을 피하는 방법까지 배웁니다.',
    link:'교과서 일과 에너지 · 충격량과 운동량 · 6번 탭 충격 · 발명 04(격자 완충)로 이어집니다.',
    fig:FIGS.R06.fig, tg:FIGS.R06.tg,
    cap:'센서를 단 상자를 가이드 관(높이 H)으로 떨어뜨려 폼(두께 d) 위에 충돌시키고 가속도 a(t)를 기록한다. 최댓값을 1/d 에 대해 그리면 직선이 되고 기울기가 K = (π/2)v²/2g',
    parts:[['완충 폼(두께 d)','스펀지 · EVA 폼','같은 종류를 장수로 쌓아 d = 20 ~ 80 mm. 압축 특성이 같도록 <i>한 가지 재료</i>를 사용한다.'],
           ['가속도 센서','폰 ±16 g · ADXL375 ±200 g','<b>센서의 측정 범위를 먼저 확인!</b> 폰은 대개 약 ±8 ~ 16 g — 충격이 이보다 크면 평평하게 잘린다(포화).'],
           ['낙하 높이 H','가이드 관 · 줄자','PVC 관(내경 > 상자)으로 수직 낙하 보장. $v=\\sqrt{2gH}$ (H = 0.3 m → 2.4 m/s).'],
           ['기록 장치','노트북 · 아두이노','샘플 간격 1 ms 이하(1 kHz). 폰 앱은 100 Hz 정도라 충격 지속(수 ms)을 놓칠 수 있다 — 기록률을 확인.'],
           ['최댓값 vs 1/d','직선 · 원점','$a_{\\max}$ 대 $1/d$ 그래프. 기울기 K 가 $(\\pi/2)v^2/2g$ 와 일치하는지.'],
           ['안전 수칙','낮은 높이부터','폰을 쓸 때는 두꺼운 케이스 · 낮은 높이에서. 파손 · 배터리 손상 주의.']],
    budget:[['가속도 센서 ADXL375(±200 g) 또는 MPU6050 모듈','1','약 1 ~ 4만 원','스마트폰 앱(낮은 g 만)'],['아두이노 + SD 모듈(기록용)','1','약 1.5만 원','노트북 시리얼'],['폼 · 스펀지(여러 두께)','1 세트','약 5천 원','EVA 매트'],['PVC 관 1 m(낙하 가이드)','1','약 3천 원','두꺼운 종이관'],['상자(센서 고정)','1','—','종이 상자']],
    steps:['센서를 상자에 단단히 고정하고 기록 코드를 만들어 정지 상태에서 1 g(9.8 m/s²) 가 읽히는지 확인(보정).','가이드 관을 폼 위에 세우고 H = 30 cm 에서 놓아 충돌 가속도 a(t) 를 기록한다. 폼 두께는 20 · 40 · 60 · 80 mm.','각 조건 5 회씩 최댓값 $a_{\\max}$ 와 펄스 폭 $t_s$ 를 구한다(포화된 데이터는 따로 표시).','$a_{\\max}$ 대 $1/d$(같은 H)와 $a_{\\max}$ 대 $H$(같은 d) 두 그래프를 그린다.','기울기 K 를 이론 $(\\pi/2)v^2/2g$ 와 비교해 「평균 대 최댓값 비 π/2」가 맞는지 평가한다.'],
    vars:['폼 두께 d · 낙하 높이 H','최대 충격 가속도 $a_{\\max}$ · 펄스 폭','센서 · 폼 종류 · 고정 상태 · 충돌 면적'],
    predict:rows.map(function(r){ return ['H = 30 cm · d = '+r[0]+' mm','평균 '+r[2]+' g · 최대 '+r[3]+' g · 지속 '+r[4]+' ms ('+r[5]+')','$a=v^2/2d$ (v = '+r[1]+' m/s), 최대 = 평균 × π/2']; }).concat([['H 를 4 배 (1.2 m)','최대 가속도 4 배(v² ∝ H)','센서 범위를 넘을 수 있어 d 를 키워야 한다']]),
    data:{cols:['d (mm)','v (m/s)','평균 a (g)','최대 a (g)','지속 t_s (ms)','판정(폰 ±16 g)'],rows:rows},
    analysis:'$a_{\\max}$ 대 $1/d$ 에 원점을 지나는 최소제곱 직선을 맞추어 기울기 K 를 구하고 $K_{\\text{이론}}=\\dfrac{\\pi}{2}\\dfrac{v^2}{2g}$ 와 비교한다. 펄스 폭 $t_s$ 는 $2d/v$ 와 비교. 포화된 점(값이 평평하게 잘림)은 분석에서 제외하고 그 개수를 보고한다. 폼은 선형이 아니라서 d 가 매우 작으면(완전 압축) 식이 깨진다는 한계도 확인한다.',
    special:['🎓 연구 설계',[['연구 질문','폼 두께와 낙하 높이에 따라 최대 충격 가속도는 $a_{\\max}=\\frac{\\pi}{2}\\frac{v^2}{2d}$ 로 예측되는가?'],['가설','K(측정)/K(이론) = 0.8 ~ 1.2, 두께 20 mm 에서 센서 포화 가능'],['통계 설계','4 두께 × 3 높이 × 5 회 = 60 회, 원점 회귀 + 잔차'],['한계','폼의 비선형 · 반발, 센서 범위 · 샘플 간격, 상자 회전']]],
    fails:[['가속도 곡선이 평평하게 잘린다','센서 포화 — 낮은 높이 · 두꺼운 폼으로 g 를 낮추거나 ±200 g 센서 사용'],['펄스가 너무 짧아 한 두 점뿐','샘플링을 1 kHz 이상으로 · 앱 대신 아두이노 기록'],['상자가 기울어져 떨어진다','가이드 관 사용 · 센서를 무게중심 근처에 고정']],
    up:['<b>발명 04</b> — 3D 프린트 격자 구조로 같은 질량에서 충격 줄이기.','<b>창의 06</b> — 달걀 우주인 구출 대회에 이 식을 설계에 이용.','<b>임무 설계</b> — 낙하산(착지 속도 ↓)과 완충(d ↑)의 최적 배분.'],
    next:['발명 · 격자 완충 다리 (I04)',12],
    eval:[['정확성','K 의 이론 대비 오차, 포화 데이터의 처리'],['측정 방법','센서 보정 · 샘플링률 · 고정 방법의 타당성'],['해석','π/2 비율의 의미(평균 대 최댓값)를 설명'],['안전','낙하 · 폼 사용 중 안전 관리']],
    tip:'가속도 곡선(반사인 모양) 한 장과 「평균 대 최댓값」 설명이 가장 강한 장면입니다.' };
})();
SIMS.R06={ q:'폼 두께와 낙하 높이를 바꾸면 최대 충격 가속도는 어떻게 되고, 폰 센서(±16 g)는 어디서 포화될까?',
  a:{nm:'폼 두께 d',min:10,max:80,step:2,val:40,unit:'mm',d:0}, b:{nm:'낙하 높이 H',min:10,max:100,step:5,val:30,unit:'cm',d:0},
  cap1:'상자가 폼 위로 떨어져 멈춥니다(충격 구간을 느리게 보여 줌). 빨간 화살표 = 순간 감속 크기.',
  cap2:'📊 위 : 충격 펄스 a(t) — 반사인 모양, 점선 = 평균, 주황 점선 = 폰 한계 16 g. 아래 : 최대 a 대 1/d(점 = 측정, 직선 = 원점 회귀).',
  note:'모형 : 반사인 감속 펄스 $a(t)=A\\sin(\\pi t/t_s)$, $t_s=2d/v$, 평균 $\\bar a=v^2/2d$, 최대 $A=(\\pi/2)\\bar a$. $v=\\sqrt{2gH}$. 점 6 개 = d 10 ~ 80 mm(±8 % 측정 잡음).',
  anim:function(ctx,w,h,t,dmm,Hcm,S){ var q=r06(dmm,Hcm), gy=h-40, fh=dmm*1.5, bh=60, cx=w*0.4, s=0, a=0, bottom;
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    if(t<3){ bottom=(gy-fh)-110*(3-t)/3; } else { var u=Math.min(1,(t-3)/4); s=(dmm/2)*(u+Math.sin(Math.PI*u)/Math.PI); a=q.peak*Math.sin(Math.PI*u); bottom=gy-fh+s*1.5; }
    ctx.fillStyle='rgba(251,191,36,.30)'; ctx.fillRect(cx-46,gy-fh+s*1.5,92,fh-s*1.5); ctx.strokeStyle=COL.amber; ctx.setLineDash([4,3]); ctx.strokeRect(cx-46,gy-fh+s*1.5,92,fh-s*1.5); ctx.setLineDash([]);
    ctx.fillStyle=COL.metal; ctx.strokeStyle=COL.dev; ctx.lineWidth=1.4; ctx.fillRect(cx-30,bottom-bh,60,bh); ctx.strokeRect(cx-30,bottom-bh,60,bh); cvCirc(ctx,cx,bottom-bh/2,6,COL.cvbg,COL.ok,1.4);
    if(t>=3&&t<7){ var L=Math.min(110,10+a*3); arrow2(ctx,cx-48,bottom,cx-48,bottom-L,COL.grav,3); cvText(ctx,'a = '+a.toFixed(1)+' g',cx-56,bottom-L/2,COL.grav,'bold 12px system-ui,sans-serif','right'); }
    cvText(ctx,'v = '+q.v.toFixed(2)+' m/s · 평균 '+q.avg.toFixed(1)+' g · 최대 '+q.peak.toFixed(1)+' g · 지속 '+q.ts.toFixed(0)+' ms',12,16,COL.text,'bold 12px system-ui,sans-serif');
    cvText(ctx,t<3?'접근 중':'충격 (느리게 보기)',12,34,COL.tick,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,dmm,Hcm,S){ var q=r06(dmm,Hcm), hh=Math.floor(h*0.52), i, r=rng32(S.seed*53+Math.round(Hcm)), ds=[10,20,30,40,60,80];
    var pts=ds.map(function(d){ var x=1/(d/1000); return [x, nz(r,r06(d,Hcm).peak,0.08)]; }), fit=ols(pts,true);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var tm=Math.max(q.ts*1.5,6), amax=Math.max(Math.ceil(q.peak*1.2/10)*10,40);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:tm,ymin:0,ymax:amax,ylabel:'가속도 (g)',title:'충격 펄스 a(t)',left:56,top:24,bottom:40,xlabel:'시간 (ms)',xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      var Lp=[]; for(i=0;i<=60;i++){ var tq=q.ts*i/60; Lp.push([tq,q.peak*Math.sin(Math.PI*tq/q.ts)]); } plotLine(ctx,P,Lp,COL.grav,2.4); plotLine(ctx,P,[[0,q.avg],[q.ts,q.avg]],COL.amber,1.4,[5,4]); plotLine(ctx,P,[[0,16],[tm,16]],COL.warm,1.4,[3,3]);
      cvText(ctx,'폰 한계 16 g',P.x1-6,P.Y(16)-8,COL.warm,'10.5px system-ui,sans-serif','right'); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:110,ymin:0,ymax:Math.ceil(q.K*110*1.1/50)*50,xlabel:'1 / d (1/m)',ylabel:'최대 a (g)',title:'최대 a 대 1/d',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      plotLine(ctx,P,[[0,0],[110,q.K*110]],COL.amber,1.6,[6,4]); plotLine(ctx,P,[[0,0],[110,fit.a*110]],COL.ok,2); plotPoints(ctx,P,pts,COL.blue,4); plotPoints(ctx,P,[[1000/dmm,q.peak]],COL.ok,6.5);
      legend(ctx,P.x0+10,P.y1+14,[['측정 6 점',COL.blue],['회귀 K = '+fit.a.toFixed(2),COL.ok],['이론 K = '+q.K.toFixed(2),COL.amber]]); });
    S.cache={K:fit.a}; },
  kv:function(dmm,Hcm,S){ var q=r06(dmm,Hcm); return [['충돌 속도 v',q.v.toFixed(2)+' m/s','a'],['평균 가속도',q.avg.toFixed(1)+' g'],['최대 가속도',q.peak.toFixed(1)+' g','g'],['지속 시간 t_s',q.ts.toFixed(1)+' ms','v2'],['폰(±16 g) 판정',q.peak>16?'⚠ 포화':'✅ 읽힘','r']]; } };

/* ── R07 : 통신 거리와 경로 손실 지수 ───────────────────────────────────── */
var R07D=[10,20,40,80,160,320];
function r07pts(n, sig, seed){ var r=rng32(seed*211+Math.round(n*10)*7+Math.round(sig*10)); return R07D.map(function(d){ return [d, rxPower(14,d,n,433)+sig*gaussR(r)]; }); }
function r07fit(pts){ var f=ols(pts.map(function(q){ return [Math.log10(q[0]),q[1]]; }),false), se=0, k, my=0, n=pts.length; var xs=pts.map(function(q){ return Math.log10(q[0]); }), xm=mean(xs), sxx=0; xs.forEach(function(x){ sxx+=(x-xm)*(x-xm); });
  var sse=0; pts.forEach(function(q,i){ var e=q[1]-(f.a*xs[i]+f.b); sse+=e*e; }); se=Math.sqrt(sse/(n-2)/sxx); return {n:-f.a/10, se:se/10, c:f.b, a:f.a, r2:f.r2}; }
(function(){
  var pts0=R07D.map(function(d){ return [d, rxPower(14,d,2.8,433)]; }), pe=r07fit(r07pts(2.8,4,1)), p0=r07fit(pts0);
  PROJ.R07={ id:'R07', t:'RSSI 로 재는 경로 손실 지수 n — 운동장 · 건물 · 숲', icon:'📡', type:'프로젝트 · R&E', lv:2, dur:'4주', cost:'약 3 ~ 5만 원',
    one:'LoRa 모듈 한 쌍으로 거리 10 ~ 320 m 에서 RSSI 를 재고, RSSI – log d 직선의 기울기 −10n 으로 경로 손실 지수 n 을 구해 장소(운동장 · 건물 사이 · 숲)를 비교한다.',
    q:'장소마다 경로 손실 지수 n 은 어떻게 다를까? 6 점의 RSSI 로 n 을 몇 % 정확도로 구할 수 있고, 그 값으로 최대 통신 거리를 예측할 수 있을까?',
    why:'5번 탭의 식 $P_{rx}=P_{tx}-PL(1\\,\\text{m})-10n\\log_{10}d$ 가 책 속 공식이 아니라 <b>내 장비로 직접 재서 n 이 나오는</b> 값임을 확인합니다. 운동장 · 숲 · 건물 사이의 n 이 다르다는 것을 숫자로 보는 순간 통신 설계가 「감」에서 「계산」으로 바뀝니다.',
    link:'교과서 파동(구면파 · 세기) · 5번 탭 링크 버짓 · 로그 · 선형 회귀. 14번 탭 스타터 코드(RSSI 기록).',
    fig:FIGS.R07.fig, tg:FIGS.R07.tg,
    cap:'송신기(TX)를 일정한 높이(1 m)에 두고 수신기(RX + 노트북)를 10 · 20 · 40 · 80 · 160 · 320 m 로 옮기며 RSSI(dBm)와 수신율을 기록한다. RSSI – log d 직선의 기울기에서 n',
    parts:[['송신기(TX)','LoRa · 14 dBm','1 초마다 번호 붙은 패킷 전송. <i>안테나 방향 · 높이 고정</i>. 허가된 주파수 · 출력 이내로만 사용.'],
           ['수신기(RX)','같은 모듈 + 노트북','RSSI(dBm)를 시리얼로 출력. 수신기 안테나를 항상 같은 방향으로 든다.'],
           ['거리 측정','줄자 · 바퀴자 · GPS','10 ~ 320 m 를 정확히 재야 로그 그래프가 정확. 바퀴 측정자나 GPS 스마트폰 사용.'],
           ['RSSI 기록','30 패킷 평균','각 거리에서 30 패킷의 RSSI 평균 · 수신율. 돌아다니는 사람 · 차 때문에 흔들리므로 평균.'],
           ['로그 그래프','RSSI – log₁₀ d','기울기 $=-10n$ → n. 결정계수 R² 와 표준오차를 함께.'],
           ['장소 비교','운동장 · 건물 · 숲','같은 방법을 세 장소에서 반복해 n 의 차이를 표로.']],
    budget:[['LoRa 모듈 한 쌍(ESP32 LoRa 등)','1 쌍','약 2 ~ 4만 원','XBee · NRF24 모듈'],['노트북 · 시리얼 앱','1','보유','스마트폰 OTG'],['줄자 50 m · 바퀴자','1','약 1만 원','GPS 앱 거리'],['삼각대 · 막대','2','약 5천 원','—'],['배터리 · 케이블','1 세트','약 5천 원','—']],
    steps:['송신기를 1 m 높이 삼각대에 고정하고 수신기에서 RSSI 가 시리얼로 나오는지 확인한다(14번 탭 코드).','운동장에서 d = 10 · 20 · 40 · 80 · 160 · 320 m 로 수신기를 옮기며 30 패킷의 평균 RSSI · 수신율을 기록한다.','$\\log_{10}d$ 대 RSSI 그래프에 직선을 맞춰 기울기 $a=-10n$ 과 표준오차를 구한다.','같은 방법으로 건물 사이 · 나무 아래에서도 측정해 n 을 비교한다.','구한 n 과 수신기 감도(−100 dBm)로 최대 통신 거리를 예측하고 실제 끊어지는 거리와 비교한다.'],
    vars:['거리 d(로그 간격) · 장소(환경)','평균 RSSI · 수신율 · 경로 손실 지수 n','송신 출력 · 안테나 높이 · 방향 · 주파수 · 시간대'],
    predict:[['n = 2.8 인 열린 지형에서 (잡음 없는 직선)','RSSI = '+fx(p0.c+p0.a*Math.log10(10),0)+' dBm(10 m) → '+fx(p0.c+p0.a*Math.log10(320),0)+' dBm(320 m)','$P_{rx}=14-25.2-28\\log_{10}d$'],
             ['그림자 페이딩 σ = 4 dB 로 흔들릴 때','n̂ = '+fx(pe.n,2)+' ± '+fx(pe.se,2)+' (참값 2.8)','6 점의 최소제곱 — 기울기 오차 약 ±0.1 ~ 0.3'],
             ['감도 −100 dBm 일 때 최대 거리','n = 2.0 : 약 27 km · n = 2.8 : 약 '+fx(Math.pow(10,(14+100-25.18)/28)/1000,1)+' km · n = 3.5 : 약 '+fx(Math.pow(10,(14+100-25.18)/35),0)+' m','이론 최대 거리는 실제보다 크게 나오는 경향 — 지면 반사 · 지구 곡률로 짧아진다'],
             ['거리 2 배','RSSI 가 약 −'+fx(10*2.8*Math.log10(2),1)+' dB (n = 2.8)','$10n\\log_{10}2$ = 3.01n dB']],
    data:{cols:['d (m)','log d','RSSI 평균 (dBm)','수신율 (%)','이론 n=2.8 (dBm)'],
          rows:R07D.map(function(d,k){ var p=r07pts(2.8,4,1)[k], m=p[1]-(-100); return [d,fx(Math.log10(d),2),fx(p[1],1),fx(100/(1+Math.exp(-m/1.5)),0),fx(pts0[k][1],1)]; })},
    analysis:'RSSI 대 $\\log_{10}d$ 에 최소제곱 직선을 맞추고 기울기 $a$ 로 $\\hat n=-a/10$, 표준오차 $s_a/10$ 을 구한다. 장소 사이 n 의 차이가 표준오차의 몇 배인지 비교한다. 잔차가 거리에 따라 체계적으로 휘면(예 : 가까운 곳 평평) 2 선 모형(지면 반사)을 의심한다. 최대 통신 거리는 $d_{\\max}=10^{(P_{tx}-S-PL_1)/(10\\hat n)}$.',
    special:['🎓 연구 설계',[['연구 질문','장소(운동장 · 건물 · 숲)에 따라 경로 손실 지수 n 은 어떻게 달라지는가?'],['가설','n(운동장) ≈ 2.5 ~ 3, n(건물 사이) ≈ 3 ~ 4, n(숲) ≈ 3.5 이상'],['통계 설계','6 거리 × 30 패킷 평균 → 회귀, 3 장소 비교(n̂ ± se)'],['한계','안테나 높이 · 사람 · 차량 · 지면 반사, 그림자 페이딩(σ 4 ~ 8 dB)']]],
    fails:[['RSSI 가 들쭉날쭉하다','같은 위치에서 30 패킷 이상 평균, 안테나 방향 · 높이 고정, 주변 사람 이동 피하기'],['먼 거리에서 패킷이 안 온다','감도 근처 — 수신율 대신 RSSI 가 읽히는 거리까지만 회귀에 사용'],['모듈마다 값이 다르다','같은 모듈 쌍 · 같은 설정(대역폭 · 확산계수)으로 고정']],
    up:['<b>발명 06</b> — 방향성 안테나를 쓰는 추적 지상국.','<b>발명 08</b> — RSSI 가 가장 센 방향으로 회수 비컨 찾기.','<b>주파수 비교</b> — 433 · 915 MHz · 2.4 GHz 의 n · 거리 비교(허가 대역 이내).'],
    next:['원리④ 통신 — 원격측정 · 링크',5],
    eval:[['정확성','n̂ ± 표준오차 · R² 제시'],['설계','거리 간격 로그, 평균 패킷 수의 타당성'],['해석','장소별 n 의 차이를 환경 요인으로 설명'],['규정','허가된 주파수 · 출력 준수']],
    tip:'RSSI – log d 그래프 한 장에 세 장소의 직선 기울기를 나란히 그려 「환경이 신호를 얼마나 깎는가」를 보여 주세요.' };
})();
SIMS.R07={ q:'환경(n)과 그림자 잡음 σ 가 다를 때, 6 점의 RSSI 로 n 을 얼마나 정확히 구할 수 있을까?',
  a:{nm:'실제 경로 손실 지수 n',min:2,max:4,step:0.1,val:2.8,unit:'',d:1}, b:{nm:'그림자 잡음 σ',min:0,max:8,step:0.5,val:4,unit:'dB',d:1},
  cap1:'수신기를 10 → 320 m 로 옮겨 가며 RSSI 를 기록합니다. 막대는 수신 세기(−130 ~ −20 dBm), 빨간 선 = 감도 −100 dBm.',
  cap2:'📊 RSSI – log d : 노랑 = 참 직선(기울기 −10n), 초록 = 측정 6 점의 회귀선, 점 = 측정.',
  note:'모형 : 433 MHz, 송신 14 dBm, $P_{rx}=14-25.18-10n\\log_{10}d+N(0,\\sigma)$. 거리 6 점(10 ~ 320 m)마다 1 번 측정. 감도 −100 dBm.',
  anim:function(ctx,w,h,t,n,sig,S){ var pts=r07pts(n,sig,S.seed), k=Math.min(5,Math.floor(t/10*6)), gx=60, y0=h*0.42, xs=function(d){ return gx+(w-gx-40)*(Math.log10(d)-1)/(Math.log10(320)-1); };
    skyBg(ctx,w,h); cvLine(ctx,[[gx,y0+28],[w-30,y0+28]],COL.axis,1.2);
    ctx.strokeStyle=COL.dev; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(gx,y0+26); ctx.lineTo(gx,y0-26); ctx.stroke(); cvText(ctx,'TX',gx,y0+44,COL.text,'bold 11px system-ui,sans-serif','center');
    R07D.forEach(function(d,i){ var x=xs(d), on=i<=k; cvRect(ctx,x-5,y0+10,10,16,on?(pts[i][1]>-100?COL.ok:COL.grav):'rgba(120,150,190,.25)',COL.dev,1); cvText(ctx,d+' m',x,y0+44,on?COL.text:COL.dim,'10.5px system-ui,sans-serif','center');
      if(on) cvText(ctx,pts[i][1].toFixed(0)+' dBm',x,y0-2,pts[i][1]>-100?COL.ok:COL.grav,'bold 11px system-ui,sans-serif','center'); });
    var bx0=40, bx1=w-40, by=h-58, bw=bx1-bx0; function xv(dB){ return bx0+bw*(Math.max(-130,Math.min(-20,dB))+130)/110; }
    ctx.fillStyle='rgba(120,150,190,.18)'; ctx.fillRect(bx0,by,bw,14); ctx.strokeStyle=COL.axis2; ctx.strokeRect(bx0,by,bw,14);
    ctx.fillStyle=pts[k][1]>-100?COL.ok:COL.grav; ctx.fillRect(bx0,by,xv(pts[k][1])-bx0,14); ctx.strokeStyle=COL.grav; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(xv(-100),by-5); ctx.lineTo(xv(-100),by+19); ctx.stroke();
    ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'; [-130,-110,-90,-70,-50,-30].forEach(function(v){ ctx.fillText(v,xv(v),by+20); });
    cvText(ctx,'d = '+R07D[k]+' m : RSSI '+pts[k][1].toFixed(1)+' dBm (참 '+rxPower(14,R07D[k],n,433).toFixed(1)+')',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,n,sig,S){ var pts=r07pts(n,sig,S.seed), f=r07fit(pts), P=makePlot(ctx,w,h,{xmin:1,xmax:2.6,ymin:-130,ymax:-20,xlabel:'거리 d (m, 로그)',ylabel:'RSSI (dBm)',title:'RSSI – log d',left:56,xfmt:function(q){ return Math.round(Math.pow(10,q))+''; },yfmt:function(q){ return q.toFixed(0); }});
    plotLine(ctx,P,[[1,rxPower(14,10,n,433)],[2.6,rxPower(14,Math.pow(10,2.6),n,433)]],COL.amber,2,[6,4]); plotLine(ctx,P,[[1,f.c+f.a],[2.6,f.c+f.a*2.6]],COL.ok,2); plotLine(ctx,P,[[1,-100],[2.6,-100]],COL.grav,1.4,[3,3]);
    plotPoints(ctx,P,pts.map(function(q){ return [Math.log10(q[0]),q[1]]; }),COL.blue,4.5);
    legend(ctx,P.x1-150,P.y1+14,[['참 직선 n = '+n.toFixed(1),COL.amber],['회귀 n̂ = '+f.n.toFixed(2),COL.ok],['감도 −100 dBm',COL.grav]]); },
  kv:function(n,sig,S){ var f=r07fit(r07pts(n,sig,S.seed)), R=Math.pow(10,(14+100-25.18)/(10*f.n)); return [['측정 n̂',f.n.toFixed(2)+' ± '+f.se.toFixed(2),'a'],['참 n',n.toFixed(1)],['오차',((f.n/n-1)*100).toFixed(1)+' %','g'],['R²',f.r2.toFixed(3),'v2'],['예측 최대 거리',R>10000? (R/1000).toFixed(1)+' km' : R.toFixed(0)+' m','r']]; } };

/* ── R08 : GPS 위치 오차 분포 (CEP · R95 · 평균 필터) ─────────────────────── */
function r08pts(sig,N,seed){ var r=rng32(seed*311+Math.round(sig*10)*17+N), s=sig/Math.sqrt(N), pts=[], i; for(i=0;i<100;i++) pts.push([s*gaussR(r), s*gaussR(r)]); return pts; }
(function(){
  var p3=r08pts(3,1,1), r3=p3.map(function(q){ return Math.hypot(q[0],q[1]); }), p25=r08pts(3,25,1), r25=p25.map(function(q){ return Math.hypot(q[0],q[1]); });
  PROJ.R08={ id:'R08', t:'GPS 가 가리키는 위치는 얼마나 흩어질까 — CEP 와 평균의 효과', icon:'🛰', type:'프로젝트 · R&E', lv:2, dur:'3주', cost:'약 2 ~ 5만 원',
    one:'GPS 수신기를 한 자리에 두고 5 분(300 개) 위치를 기록해 오차 분포의 CEP(50 %) · R95 를 구하고, N 개 평균 필터가 오차를 얼마나 줄이는지(1/√N) 확인한다.',
    q:'정지한 GPS 수신기의 위치 오차 분포는 평균 0 의 2 차원 정규 분포에 가까울까? 평균 필터는 오차를 $1/\\sqrt N$ 로 줄일까?',
    why:'「GPS 오차 3 m」라는 한 줄 사양 뒤에는 <b>분포</b>가 있습니다. 같은 값을 여러 번 재면 어떻게 흩어지고, 평균하면 얼마나 좋아지는지를 직접 보면 모든 측정의 오차 분석이 이해됩니다. 그리고 GPS 오차는 <b>시간적으로 상관</b>되어 평균 효과가 이론만큼 안 나올 수 있다는 현실도 발견합니다.',
    link:'확률과 통계(정규분포 · 표준편차) · 4번 탭 GPS · 17번 탭 [종합3](복귀 정밀도).',
    fig:FIGS.R08.fig, tg:FIGS.R08.tg,
    cap:'GPS 수신기(1 Hz)를 같은 자리에 5 분 두어 위치 300 개를 기록한다. 점들의 흩어짐(산점도)에서 CEP(절반이 들어가는 반지름)와 R95 를 구하고 평균 필터의 효과를 비교한다',
    parts:[['GPS 수신기','NEO-6M · 스마트폰','위성 수 · HDOP 를 함께 기록. 실외 · 하늘이 열린 곳. 안테나를 위로.'],
           ['고정 위치','삼각대 · 표시점','측량점(말뚝)에 고정해 <i>참 위치</i>를 정한다. 건물 · 나무가 가까우면 반사(다중경로)로 오차가 커진다.'],
           ['기록','1 Hz × 300 개','위도 · 경도를 m 로 변환($1^\\circ$ 위도 ≈ 111 km, 경도는 × cos 위도)한 동서 · 남북 오차 (x, y).'],
           ['산점도','x–y 평면','점이 한 점을 중심으로 둥글게 모이는지, 한쪽으로 치우치는지(바이어스) 본다.'],
           ['CEP · R95','중앙값 · 95 %','$r=\\sqrt{x^2+y^2}$ 의 중앙값 = CEP50, 95 번째 백분위 = R95. 정규 분포면 $1.18\\sigma$ · $2.45\\sigma$.'],
           ['평균 필터','N 개 이동평균','N = 1 · 5 · 25 · 100 로 평균한 위치의 σ 를 비교. 이론 $\\sigma/\\sqrt N$ vs 실제.']],
    budget:[['GPS 모듈(NEO-6M 등) + 아두이노/ESP32','1','약 1.5 ~ 3만 원','스마트폰 GPS 앱'],['삼각대 · 말뚝','1','약 5천 원','—'],['노트북(로그 저장)','1','보유','—'],['파이썬/엑셀','—','무료','—']],
    steps:['넓은 야외에서 말뚝 옆에 GPS 를 놓고 시작 직후 위성 수(8 개 이상)가 잡힐 때까지 5 분 기다린다.','1 Hz 로 5 분(300 개) 위도 · 경도를 기록한다. 평균 위치를 기준점으로 삼아 각 점을 (x, y) m 로 변환한다.','산점도를 그리고 $r=\\sqrt{x^2+y^2}$ 의 중앙값(CEP50), 95 백분위(R95), 표준편차 σ 를 구한다.','N = 5 · 25 개 이동평균 위치로 같은 분석을 해 σ_N 을 구해 $\\sigma/\\sqrt N$ 와 비교한다.','시간이 지나며 오차가 천천히 떠도는(상관) 정도를 자기상관 그래프로 확인한다.'],
    vars:['평균 개수 N · 환경(열린 곳 · 건물 옆)','위치 오차의 σ · CEP50 · R95','수신기 · 위성 수 · 시간대 · 안테나 방향'],
    predict:[['σ = 3 m(각 축), 평균 없음','CEP50 ≈ '+fx(quantile(r3,0.5),1)+' m (이론 '+fx(1.1774*3,1)+') · R95 ≈ '+fx(quantile(r3,0.95),1)+' m (이론 '+fx(2.4477*3,1)+')','$r$ 는 레일리 분포 — 중앙값 $\\sigma\\sqrt{2\\ln2}$'],
             ['N = 25 개 평균(독립 가정)','σ → '+fx(3/5,1)+' m, CEP50 ≈ '+fx(quantile(r25,0.5),1)+' m','$\\sigma/\\sqrt N$ — 단 GPS 오차는 시간적으로 상관되어 실제 개선은 이보다 작다'],
             ['실제 GPS(1 Hz, 5 분)','CEP50 약 1.5 ~ 3 m 수준이 흔함(수신기 · 환경에 따라 다름)','측정으로 확인할 값 — 이 프로젝트의 결과'],
             ['정규 분포 가정의 검증','x · y 각각의 히스토그램이 정규 곡선에 맞는지, r 이 레일리 곡선에 맞는지','맞지 않으면 바이어스 · 반사 · 상관을 의심']],
    data:{cols:['N','σ_N (이론, m)','CEP50 (m)','R95 (m)','평균 r (m)'],
          rows:[[1,3,quantile(r3,0.5),quantile(r3,0.95),mean(r3)],[25,0.6,quantile(r25,0.5),quantile(r25,0.95),mean(r25)]].map(function(q){ return [q[0],fx(q[1],2),fx(q[2],2),fx(q[3],2),fx(q[4],2)]; })},
    analysis:'(x, y) 의 평균(바이어스)과 표준편차를 구하고, r 의 히스토그램을 레일리 분포 $f(r)=\\dfrac{r}{\\sigma^2}e^{-r^2/2\\sigma^2}$ 와 겹쳐 그린다. 평균 개수 N 에 대한 $\\sigma_N$ 을 로그–로그로 그려 기울기가 −½ 인지 본다. 기울기가 −½ 보다 완만하면 오차 상관 때문이라고 해석하고 자기상관 시간(수십 초)을 추정한다.',
    special:['🎓 연구 설계',[['연구 질문','GPS 정지 오차는 어떤 분포이고, 평균 필터는 얼마나 효과적인가?'],['가설','CEP50 ≈ 1.18σ, N 평균의 효과는 $1/\\sqrt N$ 보다 약하다(상관)'],['통계 설계','300 점 · 3 환경 · N 별 분석, 레일리 적합도 · 자기상관'],['한계','위성 배치 변화 · 다중경로 · 수신기 필터 내부 처리']]],
    fails:[['위성이 잘 안 잡힌다','건물 · 나무에서 떨어진 열린 곳에서 시작 5 분 후 기록'],['점이 한쪽으로 치우친다','바이어스 — 평균 위치를 기준점으로 삼고 따로 보고, 다른 시간대에 반복'],['값이 계단처럼 튄다','수신기 내부 필터 · 속도 설정 확인, 원시(raw) 출력 사용']],
    up:['<b>종합3 연결</b> — GPS 오차가 있는 복귀 시뮬레이션의 착륙 오차 분포(17번 탭).','<b>필터 설계</b> — 이동평균 대 칼만 필터(대학 수준).','<b>이동 중 GPS</b> — 걸으며 직선 경로의 옆 오차를 재서 이동 중 오차 분석.'],
    next:['[종합3] 복귀 정밀도 — 오차 분포',17],
    eval:[['정확성','CEP · R95 를 정확히 계산, 바이어스 분리'],['분포 해석','히스토그램 + 레일리 곡선 비교'],['평균 효과','σ_N 대 1/√N 그래프, 상관 해석'],['보고','측정 조건(위성 수 · HDOP · 환경)을 표로 제시']],
    tip:'산점도에 CEP · R95 원을 겹쳐 그린 한 장이 「GPS 정확도」를 가장 직관적으로 보여 줍니다.' };
})();
SIMS.R08={ q:'GPS 오차(σ)와 평균 개수 N 을 바꾸면 점들의 흩어짐(CEP · R95)은 어떻게 될까?',
  a:{nm:'GPS 잡음 σ (각 축)',min:1,max:10,step:0.5,val:3,unit:'m',d:1}, b:{nm:'평균 개수 N',min:1,max:100,step:1,val:1,unit:'',d:0},
  cap1:'지금까지 기록한 위치(점, 최대 100 개). 초록 점선 = 50 %(CEP) 원, 청록 = 95 % 원(이론), 노랑 = 지금 표본에서 구한 원.',
  cap2:'📊 거리 r 의 히스토그램(막대)과 레일리 분포(곡선). 평균하면 분포가 좁아집니다.',
  note:'모형 : 각 축 독립 정규 잡음 σ, N 개 평균하면 σ/√N(독립 가정). 실제 GPS 는 시간적으로 상관되어 개선이 이보다 작을 수 있습니다. CEP50 = 1.1774 σ, R95 = 2.4477 σ.',
  anim:function(ctx,w,h,t,sig,N,S){ var pts=r08pts(sig,N,S.seed), s=sig/Math.sqrt(N), n=Math.max(1,Math.floor(t/10*100)), cx=w/2, cy=h/2+6, Rm=Math.min(w,h)/2-30, sc=Rm/(Math.max(3.4*sig,1)), i;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle=COL.plotbg; ctx.fillRect(8,8,w-16,h-16);
    var gstep=niceStep(Rm/sc,3); ctx.strokeStyle=COL.gridln; ctx.lineWidth=1; for(i=-6;i<=6;i++){ cvLine(ctx,[[cx+i*gstep*sc,10],[cx+i*gstep*sc,h-10]],COL.gridln,1); cvLine(ctx,[[10,cy+i*gstep*sc],[w-10,cy+i*gstep*sc]],COL.gridln,1); }
    cvLine(ctx,[[cx-8,cy],[cx+8,cy]],COL.grav,2); cvLine(ctx,[[cx,cy-8],[cx,cy+8]],COL.grav,2);
    cvCirc(ctx,cx,cy,1.1774*s*sc,null,COL.ok,1.4); cvCirc(ctx,cx,cy,2.4477*s*sc,null,COL.blue,1.4);
    var rs=[]; for(i=0;i<n;i++){ var p=pts[i]; rs.push(Math.hypot(p[0],p[1])); cvCirc(ctx,cx+p[0]*sc,cy-p[1]*sc,2.6,COL.amber,COL.ptEdge,0.5); }
    if(n>=5){ var c50=quantile(rs,0.5), c95=quantile(rs,0.95); ctx.save(); ctx.setLineDash([5,4]); cvCirc(ctx,cx,cy,c50*sc,null,COL.amber,1.6); cvCirc(ctx,cx,cy,c95*sc,null,COL.amber,1.2); ctx.restore(); }
    cvText(ctx,'점 '+n+' 개 · 현재 표본 CEP50 '+(n>=5?quantile(rs,0.5).toFixed(2):'—')+' m · R95 '+(n>=5?quantile(rs,0.95).toFixed(2):'—')+' m (이론 '+(1.1774*s).toFixed(2)+' · '+(2.4477*s).toFixed(2)+')',12,18,COL.text,'bold 12px system-ui,sans-serif');
    cvText(ctx,'눈금 간격 '+gstep+' m',12,36,COL.tick,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,sig,N,S){ var pts=r08pts(sig,N,S.seed), rs=pts.map(function(p){ return Math.hypot(p[0],p[1]); }), s=sig/Math.sqrt(N), rmax=Math.max(4.2*s,1), nb=14, bw=rmax/nb, bins=[], i; for(i=0;i<nb;i++) bins.push(0); rs.forEach(function(r){ var k=Math.min(nb-1,Math.floor(r/bw)); bins[k]++; });
    var fmax=0; for(i=0;i<nb;i++){ var rc=(i+0.5)*bw; fmax=Math.max(fmax, bins[i]/(rs.length*bw), rc/(s*s)*Math.exp(-rc*rc/(2*s*s))); }
    var P=makePlot(ctx,w,h,{xmin:0,xmax:rmax,ymin:0,ymax:fmax*1.2,xlabel:'위치 오차 r (m)',ylabel:'확률 밀도 (1/m)',title:'r 의 분포 — 레일리 곡선과 비교',left:60,xfmt:function(q){ return q.toFixed(rmax<5?1:0); },yfmt:function(q){ return q.toFixed(2); }});
    ctx.fillStyle=COL.histFill; for(i=0;i<nb;i++){ var d=bins[i]/(rs.length*bw), x0=P.X(i*bw), x1=P.X((i+1)*bw), y=P.Y(d); ctx.fillRect(x0+1,y,x1-x0-2,P.y0-y); }
    var Lc=[], k; for(k=0;k<=80;k++){ var r=rmax*k/80; Lc.push([r, r/(s*s)*Math.exp(-r*r/(2*s*s))]); } plotLine(ctx,P,Lc,COL.amber,2.2);
    plotLine(ctx,P,[[1.1774*s,0],[1.1774*s,fmax*1.2]],COL.ok,1.4,[4,3]); plotLine(ctx,P,[[2.4477*s,0],[2.4477*s,fmax*1.2]],COL.blue,1.4,[4,3]);
    legend(ctx,P.x1-148,P.y1+14,[['표본(100 개)',COL.histFill],['레일리 곡선',COL.amber],['CEP50 이론',COL.ok],['R95 이론',COL.blue]]); },
  kv:function(sig,N,S){ var pts=r08pts(sig,N,S.seed), rs=pts.map(function(p){ return Math.hypot(p[0],p[1]); }), s=sig/Math.sqrt(N); return [['평균 후 σ',s.toFixed(2)+' m','a'],['표본 CEP50',quantile(rs,0.5).toFixed(2)+' m (이론 '+(1.1774*s).toFixed(2)+')'],['표본 R95',quantile(rs,0.95).toFixed(2)+' m (이론 '+(2.4477*s).toFixed(2)+')','g'],['평균 r',mean(rs).toFixed(2)+' m','v2'],['평균 효과 1/√N',(1/Math.sqrt(N)).toFixed(2)+' 배','r']]; } };

/* ── R09 : 파라포일 활공비 (평판 날개 극곡선 모형) ──────────────────────── */
function r09(alpha, AR){ var a0=2*Math.PI/(1+2/AR)/57.2958, CL=Math.max(0.05,a0*(alpha+3)), CD=0.10+CL*CL/(Math.PI*0.8*AR), LD=CL/CD, W=SUBJ.canM*SUBJ.g, S=0.03, cg=LD/Math.sqrt(1+LD*LD), V=Math.sqrt(2*W*cg/(SUBJ.rho0*S*CL)), sink=V/Math.sqrt(1+LD*LD);
  return {CL:CL, CD:CD, LD:LD, V:V, sink:sink, Vh:V*cg, T300:300/sink}; }
(function(){
  var rows=[4,8,12].map(function(a){ var q=r09(a,2.5); return [fx(a,0),fx(q.CL,2),fx(q.CD,3),fx(q.LD,2),fx(q.Vh,1),fx(q.sink,1)]; }), best=null, a;
  for(a=2;a<=16;a+=0.5){ var q2=r09(a,2.5); if(!best||q2.LD>best.LD){ best=q2; best.a=a; } }
  PROJ.R09={ id:'R09', t:'파라포일 활공비 — 받음각과 날개 비율이 L/D 를 정한다', icon:'🪁', type:'프로젝트 · R&E 심화', lv:3, dur:'6주', cost:'약 3 ~ 6만 원',
    one:'종이 · 얇은 천 날개의 받음각(무게추 위치)과 가로세로비 AR 을 바꿔 활공비 L/D = 수평 거리 ÷ 낙하 높이를 재고, 극곡선 모형 $L/D=C_L/C_D$ 와 비교해 최적 받음각을 찾는다.',
    q:'날개의 받음각 α 와 가로세로비 AR 은 활공비 L/D 를 어떻게 바꿀까? L/D 가 최대가 되는 α 는 이론 $C_L=\\sqrt{C_{D0}\\pi eAR}$ 와 맞을까?',
    why:'4번 탭에서 L/D 는 입력값(상수)이었습니다. 여기서는 <b>L/D 가 왜 그 값인지</b>를 날개의 양력 · 항력으로 설명합니다. 종이비행기와 같은 원리가 파라포일 유도의 성능을 정하고, 복귀 가능 영역(4번 탭)을 결정합니다.',
    link:'교과서 힘과 운동(양력 · 항력 개념) · 4번 탭(활공비 · 도달 영역) · 대학 유체역학의 극곡선으로 이어집니다.',
    fig:FIGS.R09.fig, tg:FIGS.R09.tg,
    cap:'종이 날개(또는 소형 파라포일)를 높이 H 에서 놓아 날아간 수평 거리 L 을 잰다. 무게추 위치로 받음각을 바꿔 L/D = L/H 를 비교한다. 오른쪽 그래프는 모형의 L/D – α',
    parts:[['날개 모형','종이 · 얇은 천 사각 날개','가로 × 세로로 AR 을 바꾼다(AR = 폭² ÷ 면적). 면적은 같게(0.03 m² 안팎).'],
           ['받음각 조절','무게추 · 앞전 접기','무게 중심 위치로 받음각을 바꾼다. <i>앞쪽에 추를 달수록 코가 내려가 α 가 작아진다</i>.'],
           ['낙하 높이 H','천장 · 계단 · 체육관 2 ~ 10 m','높을수록 평형 활공이 길어 L/D 가 정확. 수평 바람을 막을 수 있는 실내.'],
           ['수평 거리 L','줄자 · 바닥 표시','출발 연직선에서 착지점까지의 수평 거리. 5 회 평균.'],
           ['영상 분석','240 fps · Tracker','궤적의 기울기(활공각)를 직접 읽어 L/D 와 속도를 이중 확인.'],
           ['L/D 계산','L ÷ H','L/D = L/H. 극곡선 모형값과 비교해 오차를 구한다.']],
    budget:[['종이(두꺼운 도화지) · 얇은 비닐','1 세트','약 2천 원','부직포'],['클립 · 테이프 · 무게추','1 세트','약 2천 원','—'],['줄자 · 막대자','1','약 3천 원','—'],['스마트폰(슬로모션)','1','보유','—'],['(선택) 소형 파라포일 키트','1','약 3 ~ 5만 원','—']],
    steps:['가로세로비 AR = 1 · 2 · 3 인 날개(면적 같게)를 만든다.','각 날개에 클립으로 무게추를 달아 받음각 α 가 작은 · 중간 · 큰 세 가지 상태를 만들고, 각도는 사진으로 재어 기록한다.','같은 높이 H(예 : 3 m)에서 놓아 수평 거리 L 을 5 회 재고, L/D = L/H 를 구한다.','α 대 L/D 그래프를 날개마다 그려 최대가 되는 α 를 찾는다.','모형 곡선과 비교해 일치하는 부분 · 다른 부분(날개 변형 · 레이놀즈 수)을 설명한다.'],
    vars:['받음각 α · 가로세로비 AR','활공비 L/D (= L/H)','날개 면적 · 질량 · 높이 · 놓는 방법 · 바람'],
    predict:[['AR = 2.5 : α = 4° · 8° · 12°','L/D = '+rows.map(function(r){ return r[3]; }).join(' · ')+' (침하 '+rows.map(function(r){ return r[5]; }).join(' · ')+' m/s)','$L/D=C_L/(C_{D0}+C_L^2/\\pi eAR)$, $C_{D0}=0.10$ (파라포일처럼 항력이 큰 날개)'],
             ['최적 받음각','α ≈ '+fx(best.a,1)+'° 에서 L/D 최대 '+fx(best.LD,2),'$C_L=\\sqrt{C_{D0}\\pi eAR}$ 일 때 최대'],
             ['AR 1 → 4','L/D '+fx(r09(8,1).LD,1)+' → '+fx(r09(8,4).LD,1)+' (α = 8°)','가로세로비가 클수록 유도 항력이 작아 활공이 좋아진다'],
             ['300 m 에서 수평 도달 거리(바람 없음)','약 '+fx(300*best.LD,0)+' m (L/D '+fx(best.LD,1)+')','$R=(L/D)h_0$ — 4번 탭 도달 가능 영역의 반지름']],
    data:{cols:['α (°)','C_L','C_D','L/D','수평 속도 (m/s)','침하 속도 (m/s)'],rows:rows},
    analysis:'α 대 L/D 를 AR 마다 그려 최댓값과 그 α 를 비교하고, $L/D\\le\\frac12\\sqrt{\\pi eAR/C_{D0}}$ 로 이론 상한을 계산해 본다. 측정 L/D 가 모형보다 작은 것은 날개의 휨 · 줄 항력 · 몸체 항력 때문일 수 있어 $C_{D0}$ 를 맞춤 변수로 두고 다시 구한다.',
    special:['🎓 연구 설계',[['연구 질문','받음각과 가로세로비는 활공비를 어떻게 바꾸며 최적 받음각은 이론과 맞는가?'],['가설','L/D 는 α 에서 한 번 최대가 되고 AR 이 클수록 증가한다.'],['통계 설계','3 AR × 3 α × 5 회 = 45 회, 평균 ± 표준편차 · 곡선 맞춤($C_{D0}$)'],['한계','종이 날개의 변형 · 레이놀즈 수가 작은 영역 · 공기 흐름 · 던지는 방법']]],
    fails:[['날개가 뒤집히거나 곤두박질한다','무게중심이 너무 뒤 · 앞 — 앞전에 클립을 1 개씩 옮기며 안정 구간 찾기'],['한 번마다 거리가 크게 다르다','놓는 방법 통일(손 높이 · 각), 5 회 평균, 실내 에어컨 끄기'],['모형과 크게 다르다','$C_{D0}$ · 날개 변형을 고려해 맞춤 · 속도가 느려 레이놀즈 수가 작음']],
    up:['<b>4번 탭 연결</b> — 측정 L/D 를 입력해 복귀 가능 영역을 계산.','<b>발명 02</b> — 받음각(줄 당김)을 서보로 바꾸는 파라포일 조향기.','<b>풍동 · 선풍기</b> — 날개 고정 후 선풍기 바람으로 양력 · 항력을 저울로 측정(대학 수준).'],
    next:['발명 · 파라포일 자동 조향기 (I02)',12],
    eval:[['정확성','L 과 H 를 정확히 재고 5 회 평균 ± 표준편차'],['모형','극곡선 모형의 가정을 설명하고 맞춤 변수의 의미를 해석'],['그래프','α 대 L/D 곡선과 최대점'],['확장','4번 탭 복귀 영역에 실측 L/D 적용']],
    tip:'종이 날개 세 개의 비행 궤적을 한 영상에 겹쳐 「어느 것이 가장 멀리 나는가」를 먼저 보여 주세요.' };
})();
SIMS.R09={ q:'받음각과 가로세로비를 바꾸면 활공비 L/D 와 침하 속도는 어떻게 될까?',
  a:{nm:'받음각 α',min:2,max:16,step:0.5,val:8,unit:'°',d:1}, b:{nm:'가로세로비 AR',min:1,max:4,step:0.25,val:2.5,unit:'',d:2},
  cap1:'날개가 활공하는 경로(옆모습). 경사의 기울기 = 1 : (L/D). 300 m 에서 내려올 때의 도달 거리를 보여 줍니다.',
  cap2:'📊 L/D 대 받음각 — AR 1.5 · 2.5 · 4(곡선), 굵은 점 = 지금, 점 = 측정 예시(±5 %).',
  note:'모형 : 평판 날개 이론 $C_L=\\frac{2\\pi}{1+2/AR}(\\alpha+3^\\circ)$, $C_D=0.10+C_L^2/(\\pi\\cdot0.8\\cdot AR)$, 날개 면적 0.03 m², 질량 0.35 kg. 교육용 모형 — 실제 파라포일은 L/D 가 3 ~ 4 정도입니다.',
  anim:function(ctx,w,h,t,al,AR,S){ var q=r09(al,AR), gy=h-40, x0=30, x1=w-30, H0=300, ex=Math.min(1,(x1-x0)/(q.LD*H0)), px=function(xm){ return x0+xm*ex; }, tt=Math.min(1,t/9), xm=q.LD*H0*tt, y=gy-(H0*(1-tt))*(gy-60)/H0;
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy); cvLine(ctx,[[x0,gy-(gy-60)],[px(q.LD*H0),gy]],COL.dim,1.4,[5,4]); cvCirc(ctx,x0,60,4,COL.amber); cvText(ctx,'방출 300 m',x0+8,56,COL.tick,'10.5px system-ui,sans-serif');
    var xx=px(xm); ctx.save(); ctx.translate(xx,y); ctx.rotate(Math.atan(1/q.LD)*0.0); ctx.fillStyle='rgba(251,113,133,.5)'; ctx.strokeStyle=COL.grav; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(-26,-6); ctx.quadraticCurveTo(0,-20,26,-6); ctx.lineTo(20,2); ctx.quadraticCurveTo(0,-8,-20,2); ctx.closePath(); ctx.fill(); ctx.stroke(); drawCan(ctx,-5,4,16); ctx.restore();
    cvCirc(ctx,px(q.LD*H0),gy,3.2,COL.ok); cvText(ctx,'도달 '+(q.LD*H0).toFixed(0)+' m',Math.min(px(q.LD*H0)+6,w-120),gy-10,COL.ok,'bold 11px system-ui,sans-serif');
    cvText(ctx,'L/D = '+q.LD.toFixed(2)+' · C_L '+q.CL.toFixed(2)+' · C_D '+q.CD.toFixed(3)+' · 수평 '+q.Vh.toFixed(1)+' m/s · 침하 '+q.sink.toFixed(1)+' m/s',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,al,AR,S){ var r=rng32(S.seed*29+Math.round(AR*4)), P=makePlot(ctx,w,h,{xmin:2,xmax:16,ymin:0,ymax:6.5,xlabel:'받음각 α (°)',ylabel:'활공비 L/D',title:'L/D – 받음각',left:54,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(1); }}), cols=[COL.blue,COL.ok,COL.iner];
    [1.5,2.5,4].forEach(function(a,k){ var Lp=[],x; for(x=2;x<=16;x+=0.5) Lp.push([x,r09(x,a).LD]); plotLine(ctx,P,Lp,cols[k],1.6,[4,3]); });
    var Lc=[],x; for(x=2;x<=16;x+=0.5) Lc.push([x,r09(x,AR).LD]); plotLine(ctx,P,Lc,COL.amber,2.6);
    plotPoints(ctx,P,[4,8,12].map(function(a){ return [a,nz(r,r09(a,AR).LD,0.05)]; }),COL.warm,4); plotPoints(ctx,P,[[al,r09(al,AR).LD]],COL.ok,6.5);
    legend(ctx,P.x1-130,P.y1+14,[['AR 1.5',cols[0]],['AR 2.5',cols[1]],['AR 4',cols[2]],['지금 AR '+AR.toFixed(2),COL.amber]]); },
  kv:function(al,AR,S){ var q=r09(al,AR); return [['활공비 L/D',q.LD.toFixed(2),'a'],['수평 활공 속도',q.Vh.toFixed(1)+' m/s'],['침하 속도',q.sink.toFixed(1)+' m/s','g'],['300 m 도달 거리',(q.LD*300).toFixed(0)+' m','v2'],['낙하 시간',q.T300.toFixed(0)+' s','r']]; } };

/* ── R10 : 낙하산 아래 캔 진자 진동 — T = 2π√(L/g) ──────────────────────── */
function r10T(L,th){ var t=th*Math.PI/180; return 2*Math.PI*Math.sqrt(L/SUBJ.g)*(1+t*t/16+11*t*t*t*t/3072); }
var R10L=[0.2,0.4,0.6,0.9,1.2,1.5];
(function(){
  var T3=[0.3,0.6,0.9,1.2].map(function(L){ return r10T(L,15); });
  PROJ.R10={ id:'R10', t:'낙하산 아래의 흔들림 — 진자 주기 T = 2π√(L/g)', icon:'⏱', type:'프로젝트 · R&E', lv:2, dur:'3주', cost:'약 1 ~ 2만 원',
    one:'줄 길이 L 을 바꿔 캔 진자의 흔들림 주기 T 를 자이로 · 영상으로 재고, $T^2$ – L 직선의 기울기 $4\\pi^2/g$ 에서 중력가속도 g 를 구한다. 큰 각에서의 오차도 확인한다.',
    q:'줄 길이 L 과 처음 각 $\\theta_0$ 를 바꿀 때 주기는 $T=2\\pi\\sqrt{L/g}$ 로 예측될까? $T^2$ – L 기울기로 구한 g 는 얼마나 정확하고, 큰 각에서는 왜 틀릴까?',
    why:'낙하하는 캔위성이 줄 끝에서 흔들리는 것은 귀찮은 현상이지만 그대로 <b>진자 실험</b>입니다. 단진자의 주기식을 이용해 g 를 재고, 각이 커지면 식이 어떻게 틀어지는지 확인하는 것은 물리 실험의 기본기입니다. 자이로(각속도) 신호의 모양도 눈으로 볼 수 있습니다.',
    link:'교과서 단진동 · 진자 · 단진동 주기 · 4번 탭 방향 제어 · 발명 05(짐벌 안정화)로 이어집니다.',
    fig:FIGS.R10.fig, tg:FIGS.R10.tg,
    cap:'줄 길이 L 의 끝에 캔(또는 추)을 매달아 작은 각으로 흔들고 자이로(IMU)의 각속도 신호에서 주기 T 를 재어 $T^2$ – L 그래프의 기울기로 g 를 구한다',
    parts:[['줄 길이 L','20 ~ 150 cm','줄 길이 = 매단 점에서 캔의 <i>무게중심</i>까지. 줄자로 정확히. 늘어나지 않는 줄(낚싯줄).'],
           ['캔위성(추)','0.35 kg · 낙하산 없이도','질량은 주기에 영향이 거의 없다(확인!). 낙하산이 달리면 공기 흐름으로 주기가 달라질 수 있다.'],
           ['자이로 · 가속도 센서','IMU(MPU6050 등)','회전 각속도 ω(t) 를 기록. 흔들림의 주기가 신호의 주기.'],
           ['주기 T 측정','10 번 흔들리는 시간 ÷ 10','한 번이 아니라 <i>10 번의 시간</i>을 재어 나누면 반응 시간 오차가 1/10 로 줄어든다.'],
           ['T² – L 그래프','직선 · 원점','기울기 $4\\pi^2/g\\approx4.03$ s²/m. 6 개 L 로 최소제곱.'],
           ['g 계산','g = 4π² ÷ 기울기','9.8 m/s² 와 비교. 처음 각이 크면(> 15°) g 가 작게 나온다.']],
    budget:[['IMU 센서(MPU6050)','1','약 3천 원','스마트폰 자이로 앱'],['낚싯줄 · 고리','1 세트','약 2천 원','실'],['추 · 캔 모형 350 g','1','약 2천 원','—'],['아두이노 또는 노트북 기록','1','약 1만 원','스마트폰'],['줄자 · 각도기','1','약 3천 원','—']],
    steps:['천장 고리에 줄을 걸고 줄 끝에 캔(추)을 매단다. 줄 길이 L = 20 · 40 · 60 · 90 · 120 · 150 cm.','처음 각 θ₀ ≈ 10° 로 당겨 놓고, 자이로 신호(또는 영상)를 30 초 기록한다.','신호의 10 주기 시간을 읽어 T 를 구한다(조건마다 3 회).','$T^2$ 대 L 그래프에 원점을 지나는 직선을 맞춰 기울기 s 를 얻고 $g=4\\pi^2/s$ 를 계산한다.','θ₀ 를 5° · 15° · 30° · 40° 로 바꿔 g 의 변화를 보고 큰 각 보정 $T\\approx T_0(1+\\theta_0^2/16)$ 와 비교한다.'],
    vars:['줄 길이 L · 처음 각 θ₀','주기 T → $T^2$ · 추정 g','추 질량 · 줄 늘어남 · 매단 점 마찰 · 공기 저항'],
    predict:[['θ₀ = 15° · L = 0.3 · 0.6 · 0.9 · 1.2 m','T = '+T3.map(function(x){ return fx(x,3); }).join(' · ')+' s','$T=2\\pi\\sqrt{L/g}\\,(1+\\theta_0^2/16)$'],
             ['$T^2$ – L 기울기','약 '+fx(Math.pow(r10T(1,15),2),2)+' s²/m (이론 $4\\pi^2/g$ = '+fx(4*Math.PI*Math.PI/SUBJ.g,2)+')','θ₀ = 15° 의 보정으로 약 0.9 % 크게 나온다 → g 추정 약 '+fx(4*Math.PI*Math.PI/Math.pow(r10T(1,15),2),2)+' m/s²'],
             ['θ₀ = 40° 에서','기울기 약 '+fx(Math.pow(r10T(1,40),2),2)+' s²/m → g 추정 '+fx(4*Math.PI*Math.PI/Math.pow(r10T(1,40),2),2)+' m/s² (참 9.81 보다 '+fx((1-4*Math.PI*Math.PI/Math.pow(r10T(1,40),2)/9.81)*100,1)+' % 작게)','큰 각에서는 주기가 더 길어진다 — 단진동 근사가 틀어짐'],
             ['질량 2 배','T 거의 변하지 않음(< 1 %)','주기는 질량과 무관(등가 원리)']],
    data:{cols:['L (m)','T (이론, s)','T² (s²)','T² / L (s²/m)','측정 T (±2 %)'],
          rows:R10L.map(function(L,k){ var T0=r10T(L,10), Tm=T0*[1.01,0.99,1.02,0.98,1.01,0.99][k]; return [fx(L,2),fx(T0,3),fx(T0*T0,3),fx(T0*T0/L,2),fx(Tm,3)]; })},
    analysis:'$T^2$ 대 L 의 원점 직선 맞춤에서 기울기 s ± 표준오차 → $g=4\\pi^2/s$ 의 불확도 $\\delta g/g=\\delta s/s$. θ₀ 에 대한 g 추정 곡선을 그려 $g(\\theta_0)=g\\,(1+\\theta_0^2/16)^{-2}$ 와 비교한다. 줄의 질량 · 추의 크기(물리진자 보정 $L\\to L+\\frac{2r^2}{5L}$)를 고려하면 정확도가 더 좋아진다.',
    special:['🎓 연구 설계',[['연구 질문','캔 진자의 주기로 g 를 몇 %의 정확도로 구할 수 있고, 처음 각은 얼마나 영향을 주는가?'],['가설','θ₀ ≤ 15° 에서 g = 9.8 ± 0.2, θ₀ = 40° 에서 약 6 % 작게 나온다.'],['통계 설계','6 길이 × 3 회, 원점 회귀 + θ₀ 4 수준 비교'],['한계','줄 늘어남 · 매단 점 마찰 · 추의 크기 · 공기 저항(진폭 감소)']]],
    fails:[['주기가 들쭉날쭉하다','10 주기를 재어 나눈다, 원뿔 운동(타원)이 되지 않도록 한 평면에서 놓는다'],['g 가 계속 작게 나온다','θ₀ 가 큰가? 줄 길이를 추의 중심까지 쟀는가? 고리의 마찰은?'],['낙하산이 달리면 주기가 이상하다','낙하산의 부가 질량 · 공기 흐름 때문 — 낙하산 없이 먼저 측정 후 비교']],
    up:['<b>발명 05</b> — 흔들림을 짐벌로 줄여 영상 안정화.','<b>낙하산 진자 비교</b> — 낙하산이 펼쳐진 상태에서의 실제 주기(공기 때문에 길어진다).','<b>중력 측정</b> — 장소(1 층 · 옥상)에 따른 g 의 미세 차이 도전(고급).'],
    next:['발명 · 짐벌 영상 안정화 (I05)',12],
    eval:[['정확성','10 주기 측정 · 불확도 전파, g ± δg'],['모형','단진자 근사의 범위(각)를 실험으로 설명'],['그래프','$T^2$ – L 직선과 θ₀ 의존성'],['확장','낙하산 상태에서의 주기 비교']],
    tip:'자이로 신호가 사인 곡선을 그리며 서서히 줄어드는 그래프를 실제 흔들림 영상 옆에 놓아 보여 주세요.' };
})();
SIMS.R10={ q:'줄 길이와 처음 각을 바꾸면 흔들림 주기는 어떻게 되고, T²–L 기울기로 구한 g 는 얼마나 정확할까?',
  a:{nm:'줄 길이 L',min:0.2,max:1.5,step:0.05,val:0.6,unit:'m',d:2}, b:{nm:'처음 각 θ₀',min:5,max:40,step:1,val:15,unit:'°',d:0},
  cap1:'낙하산 아래 캔의 흔들림(진자). 오른쪽 줄무늬가 위로 흐르는 것은 낙하 중임을 뜻합니다(교육용 연출).',
  cap2:'📊 위 : 자이로 각속도 ω(t) — 주기 T 가 읽힙니다. 아래 : T² – L (점 = 6 개 길이의 측정, 초록 = 회귀 → g 추정).',
  note:'모형 : $T=2\\pi\\sqrt{L/g}\\,(1+\\theta_0^2/16+11\\theta_0^4/3072)$, 진폭은 시간 상수 8 s 로 감쇠, 측정 주기는 ±2 % 잡음. 줄 질량 · 추 크기 · 마찰 무시.',
  anim:function(ctx,w,h,t,L,th0,S){ var T=r10T(L,th0), th=th0*Math.PI/180*Math.exp(-t/8)*Math.cos(6.2832*t/T), px=w*0.4, py=40, Lp=Math.min(h-130,40+L*150), i;
    skyBg(ctx,w,h); cvCirc(ctx,px,py,4,COL.amber); var bx=px+Lp*Math.sin(th), by=py+Lp*Math.cos(th); cvLine(ctx,[[px,py],[bx,by]],COL.dev,1.6);
    drawCan(ctx,bx-9,by,32); ctx.strokeStyle=COL.hint; ctx.lineWidth=1.4; for(i=0;i<8;i++){ var yy=(i*50+t*60)%(h); ctx.beginPath(); ctx.moveTo(w-34,yy); ctx.lineTo(w-20,yy); ctx.stroke(); }
    ctx.strokeStyle=COL.hint; ctx.setLineDash([3,4]); cvLine(ctx,[[px,py],[px,py+Lp+30]],COL.hint,1); ctx.setLineDash([]);
    cvText(ctx,'L = '+L.toFixed(2)+' m · θ₀ = '+th0+'° · 주기 T = '+T.toFixed(3)+' s (작은 각 T₀ = '+(2*Math.PI*Math.sqrt(L/SUBJ.g)).toFixed(3)+' s)',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,L,th0,S){ var T=r10T(L,th0), hh=Math.floor(h*0.46), r=rng32(S.seed*17+Math.round(th0)), pts=R10L.map(function(l){ var tm=nz(r,r10T(l,th0),0.02); return [l,tm*tm]; }), fit=ols(pts,true), i;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var tmax=Math.max(8,T*5);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:tmax,ymin:-4,ymax:4,xlabel:'시간 (s)',ylabel:'ω (rad/s)',title:'자이로 각속도 ω(t)',left:56,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      var Lw=[], ww=th0*Math.PI/180*6.2832/T; for(i=0;i<=400;i++){ var tq=tmax*i/400; Lw.push([tq,-ww*Math.exp(-tq/8)*Math.sin(6.2832*tq/T)]); } plotLine(ctx,P,Lw,COL.blue,1.8); plotLine(ctx,P,[[T,-4],[T,4]],COL.amber,1.2,[4,3]); cvText(ctx,'T = '+T.toFixed(2)+' s',P.X(T)+4,P.y1+12,COL.amber,'11px system-ui,sans-serif'); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:1.6,ymin:0,ymax:7,xlabel:'줄 길이 L (m)',ylabel:'T² (s²)',title:'T² – L',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      plotLine(ctx,P,[[0,0],[1.6,4*Math.PI*Math.PI/SUBJ.g*1.6]],COL.amber,1.5,[6,4]); plotLine(ctx,P,[[0,0],[1.6,fit.a*1.6]],COL.ok,2); plotPoints(ctx,P,pts,COL.blue,4.5);
      legend(ctx,P.x0+10,P.y1+14,[['이론 4π²/g',COL.amber],['회귀 기울기 '+fit.a.toFixed(3),COL.ok]]); });
    S.cache={g:4*Math.PI*Math.PI/fit.a, s:fit.a}; },
  kv:function(L,th0,S){ var T=r10T(L,th0), c=S.cache, T0=2*Math.PI*Math.sqrt(L/SUBJ.g); return [['주기 T',T.toFixed(3)+' s','a'],['작은 각 주기 T₀',T0.toFixed(3)+' s'],['큰 각 보정',((T/T0-1)*100).toFixed(2)+' %','g'],['회귀 기울기',c? c.s.toFixed(3)+' s²/m':'—','v2'],['추정 g',c? c.g.toFixed(2)+' m/s² ('+((c.g/9.80665-1)*100).toFixed(1)+' %)':'—','r']]; } };
