/* ═══════════════════════════════════════════════════════════════════════════
   발명 프로젝트 I01 ~ I05 : 자동 노출 제어 · 초음파 정합층 · 빔경화 필터 · 움직임 번짐 경보 · MRI 금속 게이트
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I01 : 자동 노출 제어(AEC) ─────────────────────────────────────── */
function i01(th,cap){ var mu=0.2, fix=100, aec=Math.min(cap,100*Math.exp(mu*(th-20))), sf=fix*Math.exp(-mu*th), sa=aec*Math.exp(-mu*th); return {fix:fix,aec:aec,sf:sf,sa:sa,nf:1/Math.sqrt(sf),na:1/Math.sqrt(sa),ok:aec<cap}; }
(function(){ var a=i01(14,400), b=i01(20,400), c=i01(30,400), d=i01(36,400);
  mkP({ id:'I01', t:'자동 노출 제어(AEC) — 두께에 맞춰 알아서 조절하는 X선 모형', icon:'🎛️', type:'발명 · 제어', lv:3, dur:'3 주', cost:'약 3 ~ 5만 원',
    one:'가벼운 광원(LED)과 조도 센서로 「X선 노출」을 모사하고, 물체 두께(투명 필름 겹 수)를 미리 측정해 광원 세기를 자동 조절하여 검출기 신호를 일정하게 유지하는 장치를 만든다. 선량(광원 세기) 상한을 두는 안전 장치도 설계한다.',
    q:'두께에 따라 노출을 자동으로 바꾸면 영상의 잡음과 선량은 각각 어떻게 달라질까? 상한을 두면 어떤 경우에 한계가 올까?',
    why:'고정 노출은 얇은 환자에게 <b>과다 선량</b>, 두꺼운 환자에게 <b>잡음</b>을 일으킵니다. 지수적으로 줄어드는 감약을 거꾸로 계산해 노출을 정하는 제어 아이디어는 실제 AEC 의 핵심입니다.',
    link:'원리① X선(2번 탭) · 원리⑥(6번 탭) · R01 · 제어 · 지수 함수 · 마이크로컨트롤러.',
    cap:'두께 센서(왼쪽: 투명 필름 겹 수) → 제어기(가운데: 광원 세기 = 기준 × e^{μΔt}) → 검출기 조도 센서(오른쪽). 두께 센서(왼쪽 아래) · 선량과 잡음의 균형(가운데 아래) · 과선량 상한 보호(오른쪽 아래)',
    parts:[['두께 센서','초음파 · 거리 센서 · 필름 겹 수 입력','두께 t 측정','촬영 전에 두께를 잰다. X선 없이도 두께를 아는 점이 장점이다.'],
           ['제어기','마이크로컨트롤러(Arduino)','노출 = 기준 × e^{μ(t−t₀)}','감약 지수를 거꾸로 적용해 검출기 신호가 같도록 광원을 조절한다.'],
           ['광원','LED · PWM 조광','세기 조절','PWM 듀티로 세기를 조절하고 상한(최대 듀티)을 코드로 제한한다.'],
           ['검출기','조도 센서(BH1750 등)','목표 신호 확인','검출기 신호가 목표에 맞는지 피드백으로 검증한다.'],
           ['상한 보호','최대 노출 제한','과선량 방지','두꺼운 물체에서도 상한을 넘지 않는다. 대신 잡음이 커진다.'],
           ['기록','노출 · 두께 로그','효과 분석','고정 노출과 AEC 의 신호 · 노이즈 차이를 기록한다.']],
    budget:[['Arduino 호환 보드','1','약 1만 원','마이크로비트'],['조도 센서 BH1750','1','약 2천 원','광저항'],['LED + MOSFET','1 세트','약 3천 원','—'],['거리 센서 HC-SR04','1','약 2천 원','자'],['투명 필름 · 틀','1 세트','약 1만 원','—']],
    steps:['필름 겹 수 n 에 따라 조도 감약 계수 μ 를 측정한다(R01).','제어식 세기 = I₀ e^{μ(n−n₀)} 를 코드로 만들고 PWM 으로 출력한다.','n = 1 ~ 8 겹에서 고정 세기 vs AEC 의 검출기 신호를 기록한다.','상한을 두었을 때 두꺼운 필름에서 신호가 부족해지는 구간을 확인한다.','선량(광원 세기 합)과 잡음(신호 변동)의 교환 그래프를 그리고 발명 설명서를 작성한다.'],
    vars:['두께(필름 겹 수) · 노출 상한','검출기 신호 · 잡음 · 광원 세기 합','센서 정확도 · 주변광'],
    predict:[['두께 14 cm(얇음)','고정 100 → AEC '+fx(a.aec,0)+' mAs, 선량 '+fx((1-a.aec/a.fix)*100,0)+' % 절감','얇으면 노출이 줄어 선량 절약'],
             ['두께 20 cm(기준)','AEC '+fx(b.aec,0)+' (고정과 같음)','기준 두께에서는 같다'],
             ['두께 30 cm(두꺼움)','AEC '+fx(c.aec,0)+' mAs → 신호 일정','두꺼운 환자도 잡음이 같다'],
             ['두께 36 cm · 상한 400','AEC '+fx(d.aec,0)+' (상한 도달)','상한에 걸려 신호 부족 · 잡음 ↑']],
    data:{cols:['두께(cm)','고정 신호','AEC mAs','AEC 신호','잡음 비(AEC/고정)'],
          rows:[10,15,20,25,30,35].map(function(q){ var s=i01(q,400); return [q,fx(s.sf,2),fx(s.aec,0),fx(s.sa,2),fx(s.na/s.nf,2)]; })},
    analysis:'두께 별 고정 / AEC 의 신호 · 노이즈 · 선량을 표로 정리한다. AEC 가 선량을 늘리는 구간(두꺼움)과 줄이는 구간(얇음)을 식별하고, 상한값 선택이 두꺼운 물체에서 영상 품질에 미치는 영향을 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「두께 맞춤 노출 조절기」'],['핵심 아이디어','사전 두께 측정 → 지수 보정 → 상한 보호'],['기존 방법과 차이','고정 노출은 환자 차이를 무시, AEC 는 검출 신호를 일정하게'],['한계','구조 불균일 · 산란 · 센서 오차 · 실제 의료기기와 다름']]],
    fails:[['신호가 흔들린다','센서 평균 필터 · 주변광 차단'],['두꺼운 필름에서 포화/부족','상한 · 하한 보호 코드'],['μ 가 일정하지 않다','재료별 μ 표 · 보정 실험']],
    up:['<b>I03</b> — 필터로 피부 선량 줄이기.','<b>C06</b> — 선량 인포그래픽.','<b>R01</b> — 감약 측정.'],
    next:['품질 · 선량 · 안전',6],
    eval:[['발명성','제어 아이디어'],['정량 평가','신호 · 선량 · 잡음 비교'],['안전 설계','상한 보호'],['한계 서술','모형과 실제 차이']] });
})();
SIMS.I01={ q:'물체 두께와 노출 상한을 바꾸면 고정 노출과 AEC 의 신호 · 노출량은 어떻게 달라질까?',
  a:{nm:'물체 두께',min:8,max:40,step:1,val:30,unit:'cm',d:0}, b:{nm:'AEC 상한',min:100,max:600,step:50,val:400,unit:'mAs',d:0},
  cap1:'두 장치의 검출기 신호(막대). 고정 노출은 두꺼울수록 신호가 급감하고, AEC 는 상한 안에서 신호를 일정하게 유지합니다.',
  cap2:'📊 두께에 따른 검출기 신호 — 고정 노출(점선)은 지수적으로 감소, AEC(실선)는 상한 이전까지 일정. 세로 점선 = 지금 두께.',
  note:'모형 : 신호 = mAs · e^{−μ t}, μ = 0.2 cm⁻¹(어림) · 고정 = 100 mAs · AEC mAs = 100 e^{μ(t−20)} (상한 적용) · 잡음 ∝ 1/√신호. 산란 · 구조 불균일은 무시한 교육용 모형.',
  anim:function(ctx,w,h,t,th,cap,S){ var s=i01(th,cap), fr=Math.min(1,t/2), bw=Math.min(80,w/6), x1=w*0.25-bw/2, x2=w*0.62-bw/2, y0=h-46, top=44, mx=Math.max(1,s.sa,s.sf,1.2);
    cvText(ctx,'두께 '+th+' cm · 상한 '+cap+' mAs',12,16,COL.text,'bold 12.5px system-ui,sans-serif');
    [[x1,s.sf,COL.dim,'고정 100 mAs'],[x2,s.sa,s.ok?COL.ok:COL.grav,'AEC '+s.aec.toFixed(0)+' mAs'+(s.ok?'':' (상한)')]].forEach(function(q){ var hh=(y0-top)*Math.min(1,q[1]/mx)*fr; ctx.fillStyle=q[2]; ctx.fillRect(q[0],y0-hh,bw,hh); ctx.strokeStyle=COL.axis2; ctx.strokeRect(q[0],top,bw,y0-top); cvText(ctx,q[3],q[0]+bw/2,y0+16,COL.tick,'11.5px system-ui,sans-serif','center'); cvText(ctx,'신호 '+q[1].toFixed(2),q[0]+bw/2,y0-hh-6,COL.text,'bold 11.5px system-ui,sans-serif','center'); });
    cvText(ctx,'잡음 : 고정 '+s.nf.toFixed(2)+' → AEC '+s.na.toFixed(2),12,h-8,COL.amber,'12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,th,cap,S){ var P=makePlot(ctx,w,h,{xmin:8,xmax:40,ymin:0,ymax:3.5,xlabel:'물체 두께 (cm)',ylabel:'검출기 신호(상대)',title:'두께 → 신호 : 고정(점선) vs AEC(실선)',left:54,xfmt:axisFmt(0),yfmt:axisFmt(1)}), a=[],b=[],x;
    for(x=8;x<=40;x+=1){ var s=i01(x,cap); a.push([x,s.sf]); b.push([x,s.sa]); } plotLine(ctx,P,a,COL.dim,1.8,[5,4]); plotLine(ctx,P,b,COL.ok,2.4); plotLine(ctx,P,[[th,0],[th,3.5]],COL.blue,1.4,[3,3]); },
  kv:function(th,cap,S){ var s=i01(th,cap); return [['AEC 노출',s.aec.toFixed(0)+' mAs','a'],['고정 대비 선량',(s.aec/s.fix*100).toFixed(0)+' %','g'],['신호(AEC)',s.sa.toFixed(2),'v2'],['잡음 비(AEC/고정)',(s.na/s.nf).toFixed(2)+' 배'],['상한 도달',s.ok?'아니오':'예 (신호 부족)','r']]; } };

/* ── I02 : 정합층 · 젤 ──────────────────────────────────────────────── */
function i02T(Z1,Zm,Z2,x,f0){ // 단일 정합층 전송선로. x = 층 두께(λ/4 의 배수) · f = f/f0
  var th=Math.PI/2*x*f0; var tn=Math.tan(th); var re=Z1; // Zin = Zm (Z2 + j Zm tan) / (Zm + j Z2 tan)
  var nr=Z2, ni=Zm*tn, dr=Zm, di=Z2*tn, den=dr*dr+di*di, zr=Zm*(nr*dr+ni*di)/den, zi=Zm*(ni*dr-nr*di)/den;
  var gr=(zr-Z1)/(zr+Z1), gi=zi/(zr+Z1+0), a=(zr-Z1), b=zi, c=(zr+Z1), dd=zi; var R=(a*a+b*b)/(c*c+dd*dd); return 1-R; }
function i02(Zm,x){ var Z1=30, Z2=1.6, f=[0.5,0.75,1,1.25,1.5], T=f.map(function(ff){ return i02T(Z1,Zm,Z2,x,ff); }); return {T0:T[2],Tbare:1-usR(Z1,Z2),Topt:i02T(Z1,Math.sqrt(Z1*Z2),Z2,1,1),T:T,f:f,Zopt:Math.sqrt(Z1*Z2)}; }
(function(){ var a=i02(6.9,1), b=i02(15,1), c=i02(3,1), d=i02(6.9,0.5);
  mkP({ id:'I02', t:'초음파 정합층과 젤 — 임피던스를 이어 주는 중간 다리', icon:'🧴', type:'발명 · 소재', lv:3, dur:'3 주', cost:'약 2 ~ 5만 원',
    one:'압전 소자(Z ≈ 30 MRayl)와 연조직(Z ≈ 1.6)의 큰 임피던스 차이를 줄이는 중간 임피던스 층(Z_m = √(Z₁Z₂), 두께 λ/4)의 효과를 이론과 수중 · 공기 중 모형으로 확인하고, 젤 · 층 재료를 설계한다.',
    q:'중간 층의 임피던스와 두께를 어떻게 정해야 에너지가 가장 많이 전달될까? 두께가 틀리면 주파수 특성은 어떻게 바뀔까?',
    why:'압전체와 조직 사이를 그대로 붙이면 <b>대부분의 초음파가 반사</b>됩니다. 정합층은 소리를 잘 전달하는 「다리」입니다. 이 설계는 빛의 반사방지 코팅과 같은 원리여서 통합 교육 자료로 좋습니다.',
    link:'원리③ 초음파(4번 탭) · R05 · 반사 · 간섭 · 파동의 공명 · 반사방지 코팅.',
    cap:'압전 소자(왼쪽: PZT) → λ/4 정합층(가운데 왼쪽) → 조직(가운데 오른쪽). 임피던스 식 Z_m = √(Z₁Z₂)(왼쪽 아래) · 주파수에 따른 전달(가운데 아래) · 대역폭과 효율의 거래(오른쪽 아래)',
    parts:[['압전 소자','PZT 세라믹 Z ≈ 30 MRayl','기준 Z₁','딱딱한 소자는 임피던스가 높아 조직(1.6)과 크게 어긋난다.'],
           ['정합층','에폭시 + 분말 · Z ≈ 7','두께 λ/4','두께가 1/4 파장일 때 반사파가 소멸간섭 → 전달 극대.'],
           ['조직(부하)','연조직 Z ≈ 1.6','Z₂','젤 · 물로 공기를 제거해 Z₂ 와 접촉한다.'],
           ['임피던스 식','Z_m = √(Z₁ Z₂)','≈ 6.9 MRayl','가장 효율적인 중간 값. 재료 선택 지표.'],
           ['주파수 특성','T(f) 곡선','중심 f₀ 에서 최대','두께가 정확해야 f₀ 에서 100 %. 대역폭은 한 층으로는 한계가 있다.'],
           ['젤 · 접촉','초음파 젤 · 물','공기 틈 제거','공기(0.0004)는 Z 가 극단적이므로 젤 없이는 거의 전달되지 않는다.']],
    budget:[['에폭시 · 알루미나 분말','1 세트','약 2만 원','점토 · 수지'],['초음파 센서(40 kHz)','2','약 3천 원','—'],['함수 발생 앱 · 오디오','1','무료','—'],['얇은 층 틀','1','약 5천 원','—'],['젤 · 물','1','약 3천 원','—']],
    steps:['Z₁ = 30, Z₂ = 1.6 MRayl 로 이론 전달률을 계산한다 : 맨 접촉 약 '+fx(a.Tbare*100,0)+' %.','정합층을 Z_m = √(Z₁Z₂) 로 하고 두께 λ/4 를 구해 전달률 약 100 % 를 확인한다.','Z_m · 두께를 바꾼 5 가지 층에 대해 주파수 곡선 T(f) 를 시뮬레이션한다.','40 kHz 센서에 얇은 층(다른 두께)을 붙여 수신 진폭(오디오 앱)을 비교한다.','젤 유무에 따른 수신 진폭을 비교하고 발명 설명서에 층 설계 방법을 정리한다.'],
    vars:['정합층 임피던스 Z_m · 두께 x','전달률 T · 대역폭','재료 · 접촉 상태 · 주파수'],
    predict:[['Z_m = 6.9 · 두께 λ/4','중심에서 T ≈ '+fx(a.T0*100,0)+' %','이상적 정합 : 거의 100 %'],
             ['정합 없음(맨 접촉)','T ≈ '+fx(a.Tbare*100,0)+' %','대부분 반사 → 극히 약함'],
             ['Z_m = 15 (너무 높음)','T ≈ '+fx(b.T0*100,0)+' %','어긋나면 전달률 저하'],
             ['Z_m = 6.9 · 두께 0.5 × (λ/8)','중심에서 T ≈ '+fx(d.T0*100,0)+' %','두께가 틀리면 f₀ 에서 효율이 떨어진다']],
    data:{cols:['Z_m (MRayl)','두께 (×λ/4)','T(0.5f₀)','T(f₀)','T(1.5f₀)'],
          rows:[[3,1],[6.9,1],[10,1],[15,1],[6.9,0.5],[6.9,1.5]].map(function(q){ var s=i02(q[0],q[1]); return [q[0],q[1],fx(s.T[0],2),fx(s.T[2],2),fx(s.T[4],2)]; })},
    analysis:'수신 진폭 비 (정합 / 맨 접촉)를 이론 전달 비와 비교하고, 주파수가 f₀ 에서 벗어날 때 전달률이 줄어드는 곡선 모양을 확인한다. 정합층을 2 겹으로 확장했을 때 대역폭이 넓어지는 아이디어를 제안한다.',
    special:['🔧 발명 설명서',[['발명 이름','「소리 다리 — 정합층 설계 도구」'],['핵심 아이디어','Z_m = √(Z₁Z₂), 두께 λ/4 에 따른 전달률 곡선 설계'],['기존 방법과 차이','층 수 · 재료를 자동 탐색하는 설계 시뮬레이터'],['한계','단일 주파수 · 감쇠 · 접합 상태 무시']]],
    fails:[['신호가 전혀 안 나온다','공기 틈 제거 · 젤 사용'],['층이 두께가 불균일','틀로 눌러 경화 · 두께 측정'],['측정이 불안정','진폭 평균 · 거리 고정']],
    up:['<b>R05</b> — 경계 반사율 실험.','<b>I07</b> — 압력 가이드(접촉 개선).','<b>R04</b> — 음속 측정.'],
    next:['초음파 원리',4],
    eval:[['발명성','층 설계 · 도구화'],['정량 평가','전달률 · 주파수 곡선'],['설명','반사 · 간섭 원리'],['한계 서술','이상화한 가정']] });
})();
SIMS.I02={ q:'정합층의 임피던스와 두께를 바꾸면 소자와 조직 사이의 초음파 전달률은 어떻게 달라질까?',
  a:{nm:'정합층 임피던스 Z_m',min:1.5,max:25,step:0.5,val:6.9,unit:'MRayl',d:1}, b:{nm:'층 두께',min:0.3,max:1.7,step:0.1,val:1,unit:'×λ/4',d:1},
  cap1:'PZT(Z = 30) → 정합층 → 조직(Z = 1.6) 구조와 중심 주파수에서의 전달률(막대). 이상적인 Z_m = 6.9 에 가까울수록 높습니다.',
  cap2:'📊 주파수에 따른 전달률 T(f) — 회색 점선 : 정합 없음. 정합이 맞으면 f₀ 근처에서 거의 100 % 입니다.',
  note:'모형 : 단일 정합층 전송선로. Z_in = Z_m (Z₂ + j Z_m tanθ)/(Z_m + j Z₂ tanθ) · θ = (π/2)(두께 비)(f/f₀) · 전달률 T = 1 − |(Z_in − Z₁)/(Z_in + Z₁)|². Z₁ = 30 · Z₂ = 1.6 MRayl, 감쇠 · 접합 무시.',
  anim:function(ctx,w,h,t,Zm,x,S){ var s=i02(Zm,x), fr=Math.min(1,t/2), y0=h-50, top=44, bw=60, cx=[w*0.14,w*0.38,w*0.62];
    cvText(ctx,'Z_m '+Zm+' · 두께 '+x+'×λ/4 · 중심 전달률 '+(s.T0*100).toFixed(0)+' %',12,16,COL.text,'bold 12.5px system-ui,sans-serif');
    [['PZT 30',COL.white],['정합층 '+Zm,COL.amber],['조직 1.6',COL.ok]].forEach(function(q,i){ ctx.fillStyle=q[1]; ctx.globalAlpha=0.5; ctx.fillRect(cx[i],56,bw,70); ctx.globalAlpha=1; ctx.strokeStyle=q[1]; ctx.strokeRect(cx[i],56,bw,70); cvText(ctx,q[0],cx[i]+bw/2,140,q[1],'11.5px system-ui,sans-serif','center'); });
    var bx=w*0.8, bh=(y0-top-20)*s.T0*fr; ctx.fillStyle=COL.ok; ctx.fillRect(bx,y0-bh,36,bh); ctx.strokeStyle=COL.axis2; ctx.strokeRect(bx,top,36,y0-top); cvText(ctx,'전달 T',bx+18,y0+14,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,(s.T0*100*fr).toFixed(0)+' %',bx+18,y0-bh-6,COL.text,'bold 11.5px system-ui,sans-serif','center');
    for(var i=0;i<5;i++){ var xx=cx[0]+bw+(i*8), a=1-Math.min(1,i/4); ctx.strokeStyle='rgba(125,211,252,'+(0.8*a*(0.3+0.7*s.T0))+')'; ctx.beginPath(); ctx.moveTo(cx[0]+bw+2,70+i*10); ctx.lineTo(cx[2]-2,70+i*10); ctx.stroke(); }
    cvText(ctx,'맨 접촉 전달 '+(s.Tbare*100).toFixed(0)+' % · 이상 Z_m '+s.Zopt.toFixed(1),12,h-8,COL.amber,'12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,Zm,x,S){ var P=makePlot(ctx,w,h,{xmin:0.2,xmax:1.8,ymin:0,ymax:1.05,xlabel:'주파수 f / f₀',ylabel:'전달률 T',title:'정합층의 주파수 응답',left:54,xfmt:axisFmt(1),yfmt:axisFmt(1)}), a=[],b=[],f; for(f=0.2;f<=1.8;f+=0.02){ a.push([f,i02T(30,Zm,1.6,x,f)]); b.push([f,i02T(30,Math.sqrt(48),1.6,1,f)]); } var s=i02(Zm,x);
    plotLine(ctx,P,[[0.2,s.Tbare],[1.8,s.Tbare]],COL.dim,1.4,[5,4]); plotLine(ctx,P,b,COL.ok,1.4,[4,3]); plotLine(ctx,P,a,COL.blue,2.4); legend(ctx,P.x1-150,P.y1+14,[['지금 설정',COL.blue],['이상 설계',COL.ok],['정합 없음',COL.dim]]); },
  kv:function(Zm,x,S){ var s=i02(Zm,x); return [['중심 전달률',(s.T0*100).toFixed(0)+' %','a'],['맨 접촉',(s.Tbare*100).toFixed(0)+' %','g'],['이상적 Z_m',s.Zopt.toFixed(1)+' MRayl','v2'],['설계 오차',((Zm/s.Zopt-1)*100).toFixed(0)+' %'],['0.75 f₀ 전달률',(s.T[1]*100).toFixed(0)+' %','r']]; } };

/* ── I03 : 빔경화 · 필터 ────────────────────────────────────────────── */
function i03(x,kv){ var E=[],N=[],i, S0=0,S1=0,Sd=0,Sk=0,Sm=0,Sm0=0; for(i=20;i<=kv;i+=2){ var f=(kv-i)/i*Math.exp(-muE('Al',i)*0.05), fl=Math.exp(-muE('Al',i)*x/10), p=f*fl; N.push([i,p]); S0+=f; S1+=p*i; Sm+=p; var body=Math.exp(-muE('water',i)*20); Sd+=p*i*body; Sk+=p*i*muE('water',i)*0.5; Sm0+=0; E.push(i); }
  var Em=S1/Sm; return {N:N,Em:Em,sig:Sd,skin:Sk,ratio:Sk/Sd}; }
(function(){ var a=i03(0,80), b=i03(2,80), c=i03(5,80), d=i03(2,100);
  mkP({ id:'I03', t:'빔경화 보정 필터 — 알루미늄 한 장이 피부 선량을 줄인다', icon:'🔻', type:'발명 · 소재', lv:3, dur:'2 ~ 3주', cost:'무료(계산) ~ 1만 원',
    one:'X선관의 연속 스펙트럼(크레이머스 어림)에서 낮은 에너지 X선은 몸에 흡수만 되고 영상에 기여하지 못한다. 알루미늄 필터 두께에 따른 평균 에너지 · 환자 피부 선량 · 검출 신호를 계산하고 최적 두께를 찾는 설계 도구를 만든다.',
    q:'필터를 두껍게 하면 평균 에너지는 올라가지만 신호는 줄어든다. 같은 검출 신호를 얻을 때 피부 선량이 가장 작은 두께는?',
    why:'필터는 「쓸모없이 환자에게만 흡수되는 낮은 에너지 X선」을 걸러 냅니다. 실제 X선 장비에 반드시 있는 장치의 원리를 계산으로 설계해 보는 활동으로, 스펙트럼의 개념을 몸에 익힐 수 있습니다.',
    link:'원리① X선(2번 탭) · 원리⑥ · 연속 스펙트럼 · 감약 · 최적화.',
    cap:'X선관(왼쪽: 연속 스펙트럼) → 알루미늄 필터(가운데: 두께 x) → 환자와 검출기(오른쪽). 스펙트럼 모양(왼쪽 아래) · 평균 에너지 상승(가운데 아래) · 피부 선량 감소(오른쪽 아래)',
    parts:[['X선관','관 전압 kVp · 연속 스펙트럼','최대 에너지 = kVp','제동복사는 낮은 에너지가 많은 스펙트럼 N(E) ∝ (E_max − E)/E.'],
           ['필터','알루미늄 두께 x','Al 의 μ(E) 는 낮은 에너지에서 큼','낮은 에너지 X선을 선택적으로 제거해 빔을 「경화」한다.'],
           ['환자','물 20 cm','μ_물(E)','낮은 에너지는 표면(피부)에서 대부분 흡수된다.'],
           ['검출기','신호 ∝ Σ N E e^{−μt}','영상 기여','높은 에너지 X선만 검출기에 도달한다.'],
           ['지표','평균 에너지 · 피부 선량 / 신호','낮을수록 좋다','같은 신호를 얻는 데 필요한 피부 선량을 비교한다.'],
           ['도구','스프레드시트 · 파이썬','x · kVp 탐색','두께 · 전압을 바꾸며 최적점을 찾는다.']],
    budget:[['컴퓨터','1','보유','—'],['스프레드시트/파이썬','1','무료','—'],['알루미늄 호일(필터 모사)','1 롤','약 2천 원','—'],['광원 · 센서(모사)','1 세트','약 1만 원','—'],['—','—','—','—']],
    steps:['크레이머스 스펙트럼 N(E) ∝ (kVp − E)/E 를 20 ~ kVp 범위에서 그린다.','알루미늄 두께 x 에 따라 N(E)e^{−μ_Al x} 를 계산하고 평균 에너지를 구한다.','물 20 cm 통과 후 검출 신호와 피부 선량(입사 쪽)을 각각 계산한다.','같은 신호로 규격화한 피부 선량 비를 x = 0 ~ 6 mm 에서 표로 정리한다.','필터 · 전압 조합의 최적점과 한계(신호 손실로 인한 노출 증가)를 발명 설명서에 쓴다.'],
    vars:['알루미늄 두께 x · 관 전압 kVp','평균 에너지 · 신호 대비 피부 선량','스펙트럼 모양 · 물 두께'],
    predict:[['kVp 80 · x = 0','평균 에너지 '+fx(a.Em,0)+' keV · 피부선량/신호 '+fx(a.ratio,2),'필터 없음 : 낮은 에너지 많음'],
             ['kVp 80 · x = 2 mm','평균 에너지 '+fx(b.Em,0)+' keV · '+fx(b.ratio,2)+' ('+fx((1-b.ratio/a.ratio)*100,0)+' % 감소)','필터로 선량 대폭 감소'],
             ['kVp 80 · x = 5 mm','평균 에너지 '+fx(c.Em,0)+' keV · '+fx(c.ratio,2),'수익 체감 · 신호 손실 증가'],
             ['kVp 100 · x = 2 mm','평균 에너지 '+fx(d.Em,0)+' keV · '+fx(d.ratio,2),'전압을 높여도 비슷한 효과']],
    data:{cols:['x(mm)','kVp','평균 E(keV)','피부 선량/신호','필터 없음 대비'],
          rows:[[0,80],[1,80],[2,80],[3,80],[5,80],[2,100]].map(function(q){ var s=i03(q[0],q[1]), z=i03(0,q[1]); return [q[0],q[1],fx(s.Em,0),fx(s.ratio,2),fx(s.ratio/z.ratio*100,0)+' %']; })},
    analysis:'필터 두께에 따른 평균 에너지 · 피부 선량/신호 곡선을 그리고 감소율이 둔화되는 두께를 찾는다. 같은 신호를 얻기 위해 관 전류를 늘려야 하는 부담(관 부하)과 비교하여 실무적 최적 두께를 제안한다.',
    special:['🔧 발명 설명서',[['발명 이름','「스펙트럼 필터 설계기」'],['핵심 아이디어','스펙트럼 계산으로 필터 두께 · 전압 최적화'],['기존 방법과 차이','필터 소재 · 두께 · 전압을 한 화면에서 탐색'],['한계','단순 크레이머스 모델 · 산란 · 해리 효과 무시']]],
    fails:[['평균 에너지가 안 바뀐다','필터 두께 단위(mm → cm) 확인'],['신호가 0 에 가깝다','필터 · 물 두께 과다 : 범위 조정'],['결과 해석이 어렵다','같은 신호로 규격화해 비교']],
    up:['<b>I01</b> — 노출 자동 조절.','<b>R01</b> — 감약 측정.','<b>C06</b> — 선량 시각화.'],
    next:['X선 원리',2],
    eval:[['정량 설계','평균 에너지 · 선량 계산'],['발명성','최적점 탐색 도구'],['설명','빔경화 개념'],['한계 서술','모형 단순화']] });
})();
SIMS.I03={ q:'알루미늄 필터 두께와 관 전압을 바꾸면 스펙트럼과 피부 선량(같은 신호 기준)은 어떻게 달라질까?',
  a:{nm:'알루미늄 두께',min:0,max:6,step:0.5,val:2,unit:'mm',d:1}, b:{nm:'관 전압',min:60,max:120,step:10,val:80,unit:'kVp',d:0},
  cap1:'필터 통과 후 X선 스펙트럼. 얇은 선 = 필터 없음 · 진한 면 = 필터 후. 낮은 에너지 쪽이 크게 줄어 평균 에너지가 오른다.',
  cap2:'📊 필터 두께에 따른 「같은 신호당 피부 선량」(없을 때 = 100 %). 두께가 늘수록 감소하지만 점차 둔화됩니다.',
  note:'모형 : 크레이머스 어림 N(E) ∝ (kVp − E)/E · 내장 필터 0.5 mm Al · 환자 = 물 20 cm · 피부 선량 ∝ Σ N E μ_물 · 신호 ∝ Σ N E e^{−μ_물·20}. 산란 · 특성 X선 무시한 교육용 어림.',
  anim:function(ctx,w,h,t,x,kv,S){ var s=i03(x,kv), z=i03(0,kv), fr=Math.min(1,t/2), P=makePlot(ctx,w,h,{xmin:20,xmax:120,ymin:0,ymax:1.05,xlabel:'E (keV)',ylabel:'상대 N(E)',title:'스펙트럼 : 필터 없음(선) → 필터 후(면)',left:52,xfmt:axisFmt(0),yfmt:axisFmt(1)}), mx=Math.max.apply(null,z.N.map(function(q){ return q[1]; })), i;
    plotLine(ctx,P,z.N.map(function(q){ return [q[0],q[1]/mx]; }),COL.dim,1.4,[4,3]); ctx.fillStyle='rgba(125,211,252,.4)'; ctx.beginPath(); ctx.moveTo(P.X(20),P.Y(0)); s.N.forEach(function(q){ ctx.lineTo(P.X(q[0]),P.Y(q[1]/mx*fr)); }); ctx.lineTo(P.X(kv),P.Y(0)); ctx.fill(); plotLine(ctx,P,s.N.map(function(q){ return [q[0],q[1]/mx*fr]; }),COL.blue,2.2); plotLine(ctx,P,[[s.Em,0],[s.Em,1]],COL.amber,1.6,[4,3]); cvText(ctx,'평균 '+s.Em.toFixed(0)+' keV',P.X(s.Em)+4,P.y1+16,COL.amber,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,x,kv,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:6,ymin:0,ymax:110,xlabel:'알루미늄 두께 (mm)',ylabel:'같은 신호당 피부 선량 (%)',title:'필터 두께 → 피부 선량 비',left:58,xfmt:axisFmt(1),yfmt:axisFmt(0)}), z=i03(0,kv), pts=[],q; for(q=0;q<=6;q+=0.25) pts.push([q,i03(q,kv).ratio/z.ratio*100]); plotLine(ctx,P,pts,COL.ok,2.4); plotPoints(ctx,P,[[x,i03(x,kv).ratio/z.ratio*100]],COL.blue,7); },
  kv:function(x,kv,S){ var s=i03(x,kv), z=i03(0,kv); return [['평균 에너지',s.Em.toFixed(0)+' keV','a'],['피부 선량/신호',(s.ratio/z.ratio*100).toFixed(0)+' %','g'],['검출 신호',(s.sig/z.sig*100).toFixed(0)+' %(필터 없음 대비)','v2'],['필요한 전류 증가',(z.sig/s.sig).toFixed(2)+' 배'],['평균 E 상승',(s.Em-z.Em).toFixed(0)+' keV','r']]; } };

/* ── I04 : 움직임 번짐 경보 ─────────────────────────────────────────── */
function i04(v,te){ var blur=v*te/1000, pix=0.3, ratio=blur/pix, fx0=1/(2*pix), mtf=Math.abs(Math.sin(Math.PI*fx0*blur)/(Math.PI*fx0*blur+1e-9)); if(blur<1e-6) mtf=1; return {blur:blur,ratio:ratio,mtf:mtf,warn:ratio>1,redo:ratio>1.5}; }
(function(){ var a=i04(1,50), b=i04(5,50), c=i04(20,50), d=i04(20,10);
  mkP({ id:'I04', t:'움직임 감지 · 번짐 경보 — 영상이 흐려지기 전에 알려 주기', icon:'📳', type:'발명 · 센서', lv:2, dur:'2 주', cost:'약 2 ~ 4만 원',
    one:'가속도 · 자이로 센서(MPU6050)를 촬영 대상에 붙여 움직임 속도를 측정하고, 노출 시간 동안의 이동량(번짐)이 한 화소 크기를 넘으면 경고하는 장치를 만든다. 번짐 = 속도 × 노출 시간을 정량 검증한다.',
    q:'환자(대상)가 얼마나 움직이면 영상이 흐려질까? 노출 시간을 줄이면 번짐이 어떻게 줄고, 대가는 무엇일까?',
    why:'CT · MRI · X선 모두 <b>움직임 번짐</b>이 큰 재촬영 원인입니다. 센서로 사전에 알려 주면 불필요한 재촬영과 선량을 줄일 수 있습니다. 단순한 곱셈식 하나로 설계가 가능한 좋은 입문 발명입니다.',
    link:'원리⑥ 품질 · 선량 · 안전(6번 탭) · 속도 · 적분 · 센서 · 임계값 설계.',
    cap:'움직임 센서(왼쪽: MPU6050) → 노출 중 이동(가운데: 선명 vs 번짐) → 경보(오른쪽). 번짐 = v × t(왼쪽 아래) · 픽셀 크기와 비교(가운데 아래) · 재촬영 줄이기(오른쪽 아래)',
    parts:[['움직임 센서','MPU6050 가속도 · 자이로','속도 추정','가속도를 적분하면 속도 · 이동량. 드리프트 보정이 필요하다.'],
           ['대상 모형','손 · 인체 모형 · 슬라이더','속도 v 를 바꾼다','일정 속도로 움직이는 슬라이더 · 줄 장치를 쓴다.'],
           ['촬영','스마트폰 동영상 · 일정 노출','노출 t','노출 시간을 수동으로 바꾸며 같은 움직임을 촬영한다.'],
           ['번짐 계산','번짐 = v × t','픽셀 크기 p 와 비교','번짐/p > 1 이면 흐려짐으로 경고한다.'],
           ['경보','LED · 부저','임계값 설정','임계 비 1 에서 주의, 1.5 에서 재촬영 권고.'],
           ['검증','영상 선명도(윤곽 폭)','센서 vs 영상','센서 예측과 실제 윤곽 폭이 비례하는지 확인.']],
    budget:[['MPU6050 · Arduino','1 세트','약 1만 원','스마트폰 센서'],['LED · 부저','1 세트','약 1천 원','—'],['슬라이더 · 줄 장치','1','약 1만 원','—'],['스마트폰(고속 촬영)','1','보유','—'],['—','—','—','—']],
    steps:['슬라이더를 일정 속도 v 로 움직이며 센서 값을 기록하고 속도를 추정한다.','같은 속도로 노출 시간 t = 10, 30, 100 ms 의 사진을 찍는다.','영상에서 윤곽의 번짐 폭을 측정해 v · t 와 비교한다.','번짐/p > 1 이면 LED 가 켜지도록 코드를 만든다.','센서가 경보를 올린 사진과 정상 사진의 선명도를 비교해 효과를 검증한다.'],
    vars:['속도 v · 노출 시간 t','번짐 폭 · 경보 정확도','센서 노이즈 · 임계값'],
    predict:[['v 1 mm/s · t 50 ms','번짐 '+fx(a.blur,3)+' mm = '+fx(a.ratio,2)+' 화소','거의 선명'],
             ['v 5 mm/s · t 50 ms','번짐 '+fx(b.blur,2)+' mm = '+fx(b.ratio,1)+' 화소','한계에 가까움 → 주의'],
             ['v 20 mm/s · t 50 ms','번짐 '+fx(c.blur,2)+' mm = '+fx(c.ratio,1)+' 화소 · 경보','흐려져 재촬영 필요'],
             ['v 20 mm/s · t 10 ms','번짐 '+fx(d.blur,2)+' mm = '+fx(d.ratio,1)+' 화소','노출을 줄이면 번짐 감소(잡음 ↑)']],
    data:{cols:['v(mm/s)','t(ms)','번짐(mm)','번짐/화소','경보'],
          rows:[[1,50],[5,50],[10,50],[20,50],[20,10],[50,10]].map(function(q){ var s=i04(q[0],q[1]); return [q[0],q[1],fx(s.blur,2),fx(s.ratio,1),s.redo?'재촬영':s.warn?'주의':'정상']; })},
    analysis:'센서 속도와 영상 번짐의 상관(기울기 ≈ t)을 확인하고 경보 임계의 민감도 · 특이도를 구한다. 번짐 때문에 영상 해상도가 떨어지는 정도를 MTF 로 설명하고, 노출 시간을 줄일 때 잡음이 늘어나는 거래를 논의한다.',
    special:['🔧 발명 설명서',[['발명 이름','「번짐 경보기」'],['핵심 아이디어','센서 속도 × 노출 시간으로 번짐을 예측'],['기존 방법과 차이','촬영 후가 아니라 촬영 전 · 중에 경고'],['한계','센서 드리프트 · 비선형 움직임 · 호흡 같은 주기 운동']]],
    fails:[['센서 속도가 점점 어긋난다','영점 보정 · 고역통과 필터'],['경보가 너무 잦다','임계값 · 이동 평균 조정'],['영상에서 번짐이 안 보인다','대상에 선명한 선 무늬 부착']],
    up:['<b>I01</b> — 노출 자동 조절과 결합.','<b>R09</b> — 평균과 잡음.','<b>I10</b> — 잡음 제거.'],
    next:['품질 · 선량 · 안전',6],
    eval:[['발명성','예측 · 경보 설계'],['정량 검증','센서-영상 일치'],['실용성','오경보 · 미경보 분석'],['한계 서술','센서 · 모형 한계']] });
})();
SIMS.I04={ q:'대상의 속도와 노출 시간을 바꾸면 영상의 번짐과 경보는 어떻게 달라질까?',
  a:{nm:'대상 속도 v',min:0,max:50,step:1,val:10,unit:'mm/s',d:0}, b:{nm:'노출 시간 t',min:5,max:200,step:5,val:50,unit:'ms',d:0},
  cap1:'노출 시간 동안 점이 이동한 폭(흰 띠)과 한 화소 크기(점선 칸). 번짐이 화소보다 크면 영상이 흐려져 경보가 켜집니다.',
  cap2:'📊 노출 시간에 따른 번짐 — 속도별 직선(기울기 = v). 점선 = 한 화소(0.3 mm) · 위쪽 = 재촬영 권고(1.5 화소).',
  note:'모형 : 번짐 = v × t · 화소 0.3 mm · MTF(공간주파수 1/(2p)) = |sinc(번짐 × f)| · 경고 번짐/화소 > 1, 재촬영 > 1.5. 움직임은 일정 속도로 가정한 교육용 어림.',
  anim:function(ctx,w,h,t,v,te,S){ var s=i04(v,te), p=0.3, sc=Math.min(60,(w-120)/Math.max(2.5,s.blur/p+2)), x0=40, y0=46, hh=50, ph=((t%2)/2), nn=8, i;
    cvText(ctx,'번짐 '+s.blur.toFixed(2)+' mm = '+s.ratio.toFixed(2)+' 화소  '+(s.redo?'→ 재촬영 권고':s.warn?'→ 주의':'→ 정상'),12,18,s.redo?COL.grav:s.warn?COL.amber:COL.ok,'bold 12.5px system-ui,sans-serif');
    for(i=0;i<nn;i++){ ctx.strokeStyle=COL.axis2; ctx.strokeRect(x0+i*sc,y0,sc,hh); } ctx.fillStyle=COL.dim; ctx.fillRect(x0+sc,y0+hh+10,sc,6); cvText(ctx,'화소 0.3 mm',x0+sc*1.5,y0+hh+30,COL.tick,'11px system-ui,sans-serif','center');
    ctx.fillStyle='rgba(255,255,255,'+(0.35+0.4/Math.max(1,s.ratio))+')'; ctx.fillRect(x0+2*sc,y0+10,Math.max(3,s.blur/p*sc),hh-20); ctx.fillStyle=COL.white; ctx.fillRect(x0+2*sc+Math.max(3,s.blur/p*sc)*ph,y0+6,5,hh-12);
    cvText(ctx,'MTF(1/(2p)) = '+s.mtf.toFixed(2),12,h-10,COL.amber,'12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,v,te,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:200,ymin:0,ymax:Math.max(2,50*0.2/0.3),xlabel:'노출 시간 (ms)',ylabel:'번짐 / 화소',title:'노출 시간 → 번짐(속도별)',left:64,xfmt:axisFmt(0),yfmt:axisFmt(1)});
    [[5,COL.ok],[20,COL.amber],[50,COL.grav]].forEach(function(q){ plotLine(ctx,P,[[0,0],[200,q[0]*0.2/0.3]],q[1],1.3,[4,3]); }); plotLine(ctx,P,[[0,1],[200,1]],COL.dim,1.4,[6,4]); plotLine(ctx,P,[[0,v*0/0.3],[200,v*0.2/0.3]],COL.blue,2.4); plotPoints(ctx,P,[[te,v*te/1000/0.3]],COL.blue,7); legend(ctx,P.x1-140,P.y1+14,[['5 mm/s',COL.ok],['20 mm/s',COL.amber],['50 mm/s',COL.grav],['지금 '+v,COL.blue]]); },
  kv:function(v,te,S){ var s=i04(v,te); return [['번짐',s.blur.toFixed(2)+' mm','a'],['번짐/화소',s.ratio.toFixed(2),'g'],['MTF(1/2p)',s.mtf.toFixed(2),'v2'],['경보',s.redo?'재촬영':s.warn?'주의':'정상'],['안전 노출 시간(<1화소)',v>0?(300/v).toFixed(0)+' ms':'제한 없음','r']]; } };

/* ── I05 : MRI 금속 안전 게이트 ─────────────────────────────────────── */
function i05(m,sens){ var d=0.12*Math.pow(m*sens,1/3), half=0.45; return {d:d, ok:d>=half, mmin:Math.pow(half/0.12,3)/sens}; }
(function(){ var a=i05(5,3), b=i05(50,3), c=i05(500,3), d=i05(50,8);
  mkP({ id:'I05', t:'MRI 금속 안전 게이트 — 입구에서 먼저 찾아내기', icon:'🚪', type:'발명 · 안전', lv:3, dur:'3 주', cost:'약 3 ~ 6만 원',
    one:'코일 금속 탐지 원리(유도 · 홀 센서)로 소지품의 금속을 감지하는 게이트를 모형으로 만들고, 물체 질량(자기 모멘트)에 따른 탐지 거리가 m^{1/3} 에 비례함을 확인한다. 실제 강한 자기장은 사용하지 않는다.',
    q:'어떤 크기의 금속까지 게이트가 찾아낼까? 감도를 올리면 오경보는 얼마나 늘까?',
    why:'MRI 사고의 대부분은 <b>금속 반입</b>입니다. 자기장 안의 물체가 받는 힘은 질량에 비례하는 반면 탐지 신호는 거리의 3 제곱에 반비례하므로, 탐지 거리는 질량의 세제곱근에 비례합니다. 간단한 모형에서 안전 설계의 어려움을 느낄 수 있습니다.',
    link:'원리④ MRI(5번 탭) · C04 · 자기 쌍극자(B ∝ m/r³) · 센서 · 안전 설계.',
    cap:'MRI 자기장 구역(왼쪽) → 금속 탐지 코일 게이트(가운데) → 경보(오른쪽). 탐지 거리 ∝ m^{1/3}(왼쪽 아래) · 끌림 위험 반경(가운데 아래) · 게이트 경보(오른쪽 아래)',
    parts:[['금속 탐지 코일','LC 발진 · 홀 센서','금속 접근 시 신호 변화','금속이 가까우면 인덕턴스 변화 → 발진 주파수 이동으로 검출한다.'],
           ['대상 물체','클립 · 열쇠 · 동전 · 렌치','질량 m','질량이 클수록 신호가 커서 멀리서도 탐지된다.'],
           ['탐지 거리','d ∝ (m · 감도)^{1/3}','쌍극자 장 B ∝ m/d³','임계 신호 B_th 에 도달하는 거리 d = (m/B_th)^{1/3}.'],
           ['게이트 폭','통로 ±45 cm','탐지 사각지대','게이트 반경보다 탐지 거리가 작으면 놓친다.'],
           ['경보','LED · 부저 · 문 잠금','오경보 ↔ 미탐지','감도를 높이면 작은 금속도 찾지만 오경보가 는다.'],
           ['안전 연계','5 가우스선 · 점검표(C04)','사람 · 기록','게이트는 보조 수단이며 사람 점검과 병행해야 한다.']],
    budget:[['홀 센서/탐지 코일 모듈','1','약 1만 원','스마트폰 자기장 앱'],['Arduino · 부저','1 세트','약 1.5만 원','—'],['금속 시료(클립 · 동전 등)','1 세트','약 3천 원','—'],['통로 틀(종이 상자)','1','약 5천 원','—'],['눈금자','1','보유','—']],
    steps:['금속 시료 질량 m = 1 ~ 100 g 을 정하고 센서가 반응하는 거리 d 를 측정한다(자 사용).','log d – log m 을 그려 기울기가 약 1/3 인지 확인한다.','통로 폭(±45 cm) 안에서 모든 시료를 탐지할 수 있는 감도를 설정한다.','오경보(비금속 · 소형 금속) 비율을 감도 별로 기록한다.','게이트 + 사람 점검표(C04)를 조합한 안전 절차를 발명 설명서로 정리한다.'],
    vars:['질량 m · 감도 s','탐지 거리 d · 오경보 비율','센서 종류 · 통로 폭 · 물체 방향'],
    predict:[['5 g · 감도 3','탐지 거리 '+fx(a.d*100,0)+' cm','게이트 폭(45 cm)보다 작아 '+(a.ok?'탐지':'놓칠 수 있다')],
             ['50 g · 감도 3','탐지 거리 '+fx(b.d*100,0)+' cm','질량이 10 배 → 거리 약 2.2 배'],
             ['500 g · 감도 3','탐지 거리 '+fx(c.d*100,0)+' cm','큰 금속은 멀리서도 탐지'],
             ['50 g · 감도 8','탐지 거리 '+fx(d.d*100,0)+' cm','감도 ↑ → 거리 ↑ (오경보 ↑)']],
    data:{cols:['m(g)','감도','탐지 거리(cm)','탐지 여부(45 cm)','최소 탐지 질량(g)'],
          rows:[[1,3],[5,3],[20,3],[50,3],[200,3],[50,8]].map(function(q){ var s=i05(q[0],q[1]); return [q[0],q[1],fx(s.d*100,0),s.ok?'탐지':'놓침',fx(s.mmin,0)]; })},
    analysis:'측정한 탐지 거리와 m^{1/3} 비례 모형의 일치도를 로그–로그 기울기로 비교한다. 놓치는 최대 질량 · 오경보 비를 감도에 따라 정리하고, 게이트 단독의 한계와 사람 점검의 필요를 논의한다.',
    special:['🔧 발명 설명서',[['발명 이름','「자석방 앞 금속 파수꾼」'],['핵심 아이디어','탐지 거리 ∝ m^{1/3} 에 기반한 감도 · 폭 설계'],['기존 방법과 차이','질량별 탐지 한계를 정량화해 안전 절차에 연결'],['한계','자성 물질 · 방향 · 환자 이식물은 별도 절차가 필요']]],
    fails:[['작은 금속을 놓친다','감도 ↑ · 폭 ↓ · 사람 점검 병행'],['오경보가 많다','기준 신호 보정 · 이동 평균'],['측정값이 흔들린다','센서 고정 · 같은 방향으로 통과']],
    up:['<b>C04</b> — 자기장 안전 전시.','<b>I06</b> — 기록 앱.','<b>R08</b> — 라모어 비유.'],
    next:['MRI 원리',5],
    eval:[['발명성','탐지 · 안전 설계'],['정량 평가','m^{1/3} 검증'],['안전 의식','게이트 한계 인식'],['한계 서술','자성/비자성 · 이식물']] });
})();
SIMS.I05={ q:'금속 질량과 감도를 바꾸면 게이트의 탐지 거리와 놓치는 물체는 어떻게 달라질까?',
  a:{nm:'금속 질량 m',min:1,max:1000,step:1,val:50,unit:'g',d:0}, b:{nm:'게이트 감도 s',min:1,max:10,step:0.5,val:3,unit:'',d:1},
  cap1:'게이트(가운데)와 금속의 탐지 범위(파란 원). 물체가 통로(±45 cm) 안의 어디를 지나더라도 원 안이면 경보가 울립니다.',
  cap2:'📊 질량에 따른 탐지 거리 d = 0.12 (m·s)^{1/3} (로그 눈금) — 점선 = 통로 반폭 45 cm. 점선 아래는 놓칠 수 있는 질량입니다.',
  note:'모형 : 자기 쌍극자 B ∝ m/d³ ≥ B_th → d = 0.12 (m · s)^{1/3} m (m : g). 통로 반폭 45 cm · 방향 · 재질 차이 · 이식물은 무시한 교육용 어림.',
  anim:function(ctx,w,h,t,m,s,S){ var q=i05(m,s), sc=Math.min((w-60)/3.0,(h-60)/2.2), cx=w*0.5, cy=h*0.55, xo=-1.2+((t%5)/5)*2.4, hit=Math.abs(xo)<q.d*0+Math.max(0,q.d);
    cvText(ctx,'질량 '+m+' g · 감도 '+s+' → 탐지 거리 '+(q.d*100).toFixed(0)+' cm  '+(q.ok?'(게이트 폭 전체 탐지)':'(일부 놓침)'),12,16,q.ok?COL.ok:COL.amber,'bold 12.5px system-ui,sans-serif');
    ctx.strokeStyle=COL.axis2; ctx.strokeRect(cx-0.45*sc,cy-0.9*sc,0.9*sc,1.8*sc); ctx.strokeStyle=COL.grav; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-0.45*sc,cy-0.9*sc); ctx.lineTo(cx-0.45*sc,cy+0.9*sc); ctx.moveTo(cx+0.45*sc,cy-0.9*sc); ctx.lineTo(cx+0.45*sc,cy+0.9*sc); ctx.stroke(); ctx.lineWidth=1;
    var px=cx+(((t%5)/5)*2.4-1.2)*sc*0, py=cy+0.8*sc-(((t%5)/5)*1.6*sc), ox=cx+0.15*sc; var d2=Math.hypot(ox-cx-0.45*sc*0.0,0);
    var dist=Math.abs(0.3-0.0); ctx.fillStyle='rgba(125,211,252,.12)'; ctx.beginPath(); ctx.arc(ox,py,q.d*sc,0,6.283); ctx.fill(); ctx.strokeStyle=COL.blue; ctx.stroke();
    var inside=(q.d*sc>=Math.abs(ox-cx)); ctx.fillStyle=COL.white; ctx.beginPath(); ctx.arc(ox,py,5,0,6.283); ctx.fill(); cvText(ctx,inside?'🚨 경보':'… 조용(놓침)',ox+10,py-8,inside?COL.grav:COL.dim,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,m,s,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:3,ymin:0,ymax:1.3,xlabel:'log₁₀ 질량 (g)',ylabel:'탐지 거리 (m)',title:'질량 → 탐지 거리 (d ∝ m^{1/3})',left:54,xfmt:axisFmt(1),yfmt:axisFmt(1)}), pts=[],x; for(x=0;x<=3;x+=0.1) pts.push([x,i05(Math.pow(10,x),s).d]); plotLine(ctx,P,pts,COL.ok,2.4); plotLine(ctx,P,[[0,0.45],[3,0.45]],COL.grav,1.6,[6,4]); plotPoints(ctx,P,[[Math.log10(m),i05(m,s).d]],COL.blue,7); },
  kv:function(m,s,S){ var q=i05(m,s); return [['탐지 거리',(q.d*100).toFixed(0)+' cm','a'],['통로 반폭 45 cm',q.ok?'전체 탐지':'일부 놓침','g'],['최소 탐지 질량',q.mmin.toFixed(0)+' g','v2'],['질량 10 배일 때 거리',(i05(m*10,s).d/q.d).toFixed(2)+' 배'],['권고','게이트 + 사람 점검','r']]; } };
