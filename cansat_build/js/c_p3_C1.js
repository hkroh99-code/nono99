/* ═══════════════════════════════════════════════════════════════════════════
   창의 프로젝트 C01 ~ C05
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── C01 : 단풍씨앗형 회전 낙하 ──────────────────────────────────────────── */
function c01(Rcm, mg){ var m=mg/1000, R=Rcm/100, A=Math.PI*R*R, v=Math.sqrt(2*m*SUBJ.g/(SUBJ.rho0*A*0.9)), vp=Math.sqrt(2*m*SUBJ.g/(SUBJ.rho0*(CAN.CdCan*CAN.A+1.5*A))), om=2.0*v/R;
  return {v:v, vp:vp, rpm:om*60/6.2832, ratio:v/vp, T3:3/v}; }
(function(){
  var a=c01(12,100), b=c01(24,100), c=c01(12,200);
  PROJ.C01={ id:'C01', t:'단풍씨앗 캔위성 — 한 장의 날개로 천천히 도는 낙하', icon:'🍁', type:'창의 · 자연 모방', lv:1, dur:'2주', cost:'약 2천 ~ 1만 원',
    one:'단풍나무 씨앗처럼 한 장(또는 두 장)의 날개로 회전하며 떨어지는 종이 · 폼 날개를 만들고, 날개 반지름 R 과 질량에 따라 강하 속도가 어떻게 변하는지 낙하산과 비교한다.',
    q:'회전 낙하는 날개 반지름 R 을 2 배로 하면 강하 속도가 정말 ½ 배가 될까? 같은 지름의 낙하산보다 얼마나 빠르고, 왜 그럴까?',
    why:'「낙하산」말고도 자연은 씨앗으로 낙하 문제를 풀었습니다. <b>회전하는 날개가 만드는 원판 면적</b>이 낙하산 면적처럼 일합니다. 종이 한 장으로 5 분이면 만들 수 있고, 헬리콥터의 자동 회전(오토로테이션) 원리와 같아 대학 항공공학까지 이어집니다.',
    link:'교과서 힘과 운동(공기 저항 · 종단속도) · 회전 운동 · 2번 탭 · 15번 탭(항력계수).',
    fig:FIGS.C01.fig, tg:FIGS.C01.tg,
    cap:'날개 한 장(왼쪽)이 달린 캔위성(가운데)이 회전하며 나선형으로 낙하(오른쪽)한다. 종이 템플릿(아래 왼쪽)을 잘라 접고, 영상으로 낙하 시간을 재어 속도(아래 오른쪽)를 구한다',
    parts:[['날개(블레이드)','종이 · 폼 · 얇은 판','길이 R, 폭 약 R/3 의 긴 날개. <i>한쪽 모서리를 접어</i> 앞전을 만들면 회전이 시작된다.'],
           ['몸체(캔 · 무게추)','50 ~ 150 g','날개의 한쪽 끝에 무게추를 달아 무게중심을 날개 뿌리 쪽으로. 질량은 속도에 직접 영향.'],
           ['회전 낙하','자동 회전','공기 흐름이 날개를 회전시켜 원판 면적 $\\pi R^2$ 이 낙하산처럼 일한다. 회전수 약 수 백 rpm.'],
           ['종이 템플릿','자르기 · 접기선','한 장의 도안을 복사해 R = 8 · 12 · 16 · 24 cm 로 키운다. 접는 선은 모든 날개가 같은 위치(비율)에.'],
           ['낙하 시험','2.5 ~ 3 m · 영상','높이 2.5 m 이상에서 놓아 마지막 1 m 의 통과 시간을 잰다. 5 회 평균(회전 시작 전 구간은 제외).'],
           ['속도 비교','v = 1 m ÷ t','같은 질량 · 같은 지름의 낙하산과 속도를 비교해 비율을 구한다.']],
    budget:[['도화지 · 스티로폼 접시','1 세트','약 1천 원','부직포'],['클립 · 테이프(무게추)','1 세트','약 1천 원','—'],['스마트폰(영상)','1','보유','—'],['줄자 · 저울','1','약 3천 원','학교 비품'],['(선택) 3D 프린트 날개','1','약 5천 원','—']],
    steps:['도안을 잘라 날개 4 가지(R = 8 · 12 · 16 · 24 cm)를 만들고 한쪽 끝에 클립 무게추를 달아 총 질량을 100 g 으로 맞춘다.','날개 앞전을 접고 높이 2.5 m 에서 가볍게 놓아 날개가 자동으로 도는지(회전 낙하) 확인한다. 안 돌면 접는 각 · 무게추 위치를 조절한다.','R 마다 5 회씩 마지막 1 m 의 통과 시간을 영상으로 재어 강하 속도를 구한다.','같은 질량 · 같은 지름의 둥근 낙하산(비닐)도 같은 방법으로 재어 속도 비를 구한다(R01 과 같은 방법).','R 대 v 를 log–log 로 그려 지수 p(이론 −1)를 구하고, 회전수(영상의 한 바퀴 시간)로 팁 속도비를 추정한다.'],
    vars:['날개 반지름 R · 질량 m','강하 속도 v · 회전수','접는 각 · 무게추 위치 · 재질 · 낙하 높이'],
    predict:[['R = 12 cm · 100 g','강하 속도 '+fx(a.v)+' m/s · 약 '+fx(a.rpm,0)+' rpm','$v=\\sqrt{2mg/(\\rho A C_d)}$, $A=\\pi R^2$, $C_d\\approx0.9$(교육용 어림)'],
             ['R 2 배 (24 cm)','강하 속도 '+fx(b.v)+' m/s (약 ½ 배)','$v\\propto1/R$ — 낙하산 지름 법칙(R01)과 같은 모양'],
             ['질량 2 배 (200 g)','강하 속도 '+fx(c.v)+' m/s (√2 배)','$v\\propto\\sqrt m$'],
             ['같은 지름 낙하산과 비교','회전 낙하 '+fx(a.v)+' m/s vs 낙하산 '+fx(a.vp)+' m/s (회전 낙하가 약 '+fx((a.ratio-1)*100,0)+' % 빠름)','회전 날개의 유효 Cd 가 낙하산(1.5)보다 작기 때문(어림)']],
    data:{cols:['R (cm)','m (g)','강하 속도 (m/s)','회전수 (rpm)','낙하 3 m 시간 (s)','같은 지름 낙하산 (m/s)'],
          rows:[[8,100],[12,100],[16,100],[24,100],[12,200]].map(function(q){ var r=c01(q[0],q[1]); return [q[0],q[1],fx(r.v,2),fx(r.rpm,0),fx(r.T3,2),fx(r.vp,2)]; })},
    analysis:'R 대 v 의 log–log 회귀로 기울기를 구해 −1 과 비교한다. 같은 지름 낙하산과의 속도비(≈ 1.3)를 반복 측정으로 평균 ± 표준편차로 정리한다. 영상에서 날개 한 바퀴 시간 $T_r$ 을 읽어 회전수 $60/T_r$ rpm, 팁 속도비 $\\lambda=\\Omega R/v$ 를 추정한다(교육용 모형의 λ = 2 와 비교).',
    special:['🎨 작품 기획서',[['작품 이름','「바람을 타는 씨앗」 — 나선으로 내려오는 캔위성'],['표현 아이디어','날개에 LED 를 붙여 밤에 회전 궤적이 원 모양으로 보이게(C04 와 결합)'],['과학 근거','$v\\propto1/R$ · 원판 면적이 낙하산처럼 작용'],['전시 구성','R 4 종 날개 낙하 영상 + 속도 – R 그래프 + 직접 접어 던져 보는 체험 코너']]],
    fails:[['날개가 회전하지 않고 곤두박질','무게추를 날개 뿌리 쪽으로 · 앞전을 접는 각(약 10 ~ 20°)을 바꾼다'],['낙하 시간이 5 회 사이 크게 다르다','놓는 자세(수평) 통일, 바람 없는 실내, 시작 후 회전이 안정된 구간만 측정'],['날개가 찢어진다 · 휜다','두꺼운 종이 · 폼으로, 접는 선을 테이프 보강']],
    up:['<b>회전 센서</b> — 자이로로 회전수를 직접 기록(R10 방법).','<b>2 날개 로터</b> — 헬리콥터형 2 날개로 안정성 · 속도 비교.','<b>캔위성 적용</b> — 날개 한 장 + 캔을 실제 낙하 시험용으로 만들어 낙하산과 시험 비교.'],
    next:['원리① 낙하와 종단속도',2],
    eval:[['창의성','자연 모방 아이디어를 작품 · 장치로 구현'],['정확성','R · m · 낙하 시간을 정확히 측정'],['해석','회전 낙하와 낙하산의 차이를 식 · 그래프로 설명'],['전시','체험 요소(직접 날려 보기)가 있는가']],
    tip:'단풍 씨앗 실물 영상과 종이 날개 영상을 나란히 두고, 둘의 속도 – 크기 그래프를 겹쳐 「같은 원리」를 보여 주세요.' };
})();
SIMS.C01={ q:'날개 반지름과 질량을 바꾸면 회전 낙하 속도와 회전수는 어떻게 되고, 같은 지름의 낙하산과 얼마나 다를까?',
  a:{nm:'날개 반지름 R',min:5,max:30,step:1,val:12,unit:'cm',d:0}, b:{nm:'질량 m',min:30,max:400,step:10,val:100,unit:'g',d:0},
  cap1:'회전 낙하(왼쪽)와 같은 지름의 낙하산(오른쪽, 점선)을 같은 높이 6 m 에서 놓았습니다(×0.15 슬로모션, 날개 회전은 보이게 느리게).',
  cap2:'📊 log–log : 실선 = 회전 낙하, 점선 = 낙하산, 점 = 측정 예시(±4 %). 둘 다 기울기 ≈ −1 이지만 회전 낙하가 위(더 빠름).',
  note:'모형 : 회전 낙하 $v=\\sqrt{2mg/(\\rho\\pi R^2\\cdot0.9)}$ (원판 항력계수 0.9 어림), 낙하산 Cd 1.5 + 캔. 회전수 = 2·v/R (팁 속도비 2). 교육용 어림 — 실제 값은 날개 모양에 따라 크게 달라집니다.',
  anim:function(ctx,w,h,t,Rcm,mg,S){ var q=c01(Rcm,mg), gy=h-40, top=44, sc=(gy-top-70)/6, y0=gy-40-6*sc, tt=t*0.15, R=Math.max(14,Math.min(90,Rcm*3.2));
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    var d1=Math.min(6,fall1D(q.v,tt)), y1=y0+d1*sc, x1=w*0.3+Math.sin(tt*3)*4, phi=t*7;
    ctx.strokeStyle=COL.hint; ctx.setLineDash([3,4]); cvLine(ctx,[[x1,y1-8],[x1,y1-8]],COL.hint,1); ctx.setLineDash([]);
    cvCirc(ctx,x1,y1,0.5,null,null); ctx.save(); ctx.strokeStyle='rgba(251,191,36,.4)'; ctx.fillStyle='rgba(251,191,36,.10)'; ctx.beginPath(); ctx.ellipse(x1,y1,R,R*0.18,0,0,6.2832); ctx.fill(); ctx.stroke(); ctx.restore();
    var bx=R*Math.cos(phi), by=-R*0.18*Math.sin(phi); ctx.strokeStyle=COL.amber; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(x1-bx,y1-by); ctx.lineTo(x1+bx,y1+by); ctx.stroke(); drawCan(ctx,x1-6,y1,24);
    var d2=Math.min(6,fall1D(q.vp,tt)), y2=y0+d2*sc, x2=w*0.68; dropIcon(ctx,x2,y2,24,Math.max(10,Rcm*1.6),0);
    cvText(ctx,'회전 낙하 v = '+q.v.toFixed(2)+' m/s · '+q.rpm.toFixed(0)+' rpm',x1,top-8,COL.amber,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,'같은 지름 낙하산 v = '+q.vp.toFixed(2)+' m/s',x2,top-8,COL.grav,'bold 11.5px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,Rcm,mg,S){ var r=rng32(S.seed*23+mg), P=makePlot(ctx,w,h,{xmin:Math.log10(5),xmax:Math.log10(30),ymin:1,ymax:14,ylog:true,xlabel:'날개 반지름 R (cm, 로그)',ylabel:'강하 속도 (m/s)',title:'log v – log R',left:54,xfmt:function(q){ return Math.pow(10,q).toFixed(0); }}), k;
    var A=[],B=[]; for(k=0;k<=30;k++){ var rr=5*Math.pow(6,k/30); A.push([Math.log10(rr),c01(rr,mg).v]); B.push([Math.log10(rr),c01(rr,mg).vp]); }
    plotLine(ctx,P,B,COL.grav,1.6,[5,4]); plotLine(ctx,P,A,COL.amber,2.4);
    plotPoints(ctx,P,[6,9,12,18,24].map(function(rr){ return [Math.log10(rr),nz(r,c01(rr,mg).v,0.04)]; }),COL.warm,4); plotPoints(ctx,P,[[Math.log10(Rcm),c01(Rcm,mg).v]],COL.ok,6.5);
    legend(ctx,P.x1-130,P.y1+14,[['회전 낙하',COL.amber],['같은 지름 낙하산',COL.grav],['측정 예시',COL.warm]]); },
  kv:function(Rcm,mg,S){ var q=c01(Rcm,mg); return [['강하 속도',q.v.toFixed(2)+' m/s','a'],['회전수',q.rpm.toFixed(0)+' rpm'],['같은 지름 낙하산',q.vp.toFixed(2)+' m/s','g'],['속도비 (회전/낙하산)',q.ratio.toFixed(2),'v2'],['3 m 낙하 시간',q.T3.toFixed(2)+' s','r']]; } };

/* ── C02 : 낙하 파노라마 카메라 — 지상 해상도 ───────────────────────────── */
var C02N=3280, C02OBJ=[['축구장 105 m',105],['자동차 4.5 m',4.5],['자전거 1.8 m',1.8],['사람 0.5 m',0.5]];
function c02(h,fov){ var W=2*h*Math.tan(fov*Math.PI/360), g=W/C02N; return {W:W, gsd:g, area:W*W*0.75, hCar:(4.5/8)*C02N/(2*Math.tan(fov*Math.PI/360))}; }
(function(){
  var a=c02(100,62), b=c02(30,62), c=c02(100,120);
  PROJ.C02={ id:'C02', t:'낙하하며 찍는 파노라마 — 고도에 따라 달라지는 지상 해상도', icon:'📷', type:'창의 · 영상 작품', lv:2, dur:'4주', cost:'약 3 ~ 6만 원',
    one:'낙하하는 캔위성에 소형 카메라(Pi 카메라 · ESP32-CAM)를 달아 영상을 찍고, 고도 h 와 시야각 FOV 로 촬영 폭 · 지상 해상도(cm/픽셀)를 계산해 「어느 고도에서 무엇이 보이는지」를 지도로 만든다.',
    q:'FOV 62° · 3280 픽셀 카메라는 고도 100 m 에서 자동차(4.5 m)를 몇 픽셀로 보고, 사람은 보이는가? 고도 · FOV 를 바꾸면 얼마나 달라질까?',
    why:'낙하하는 영상이 점점 커지며 지면이 다가오는 <b>드라마틱한 장면</b>은 캔위성의 대표 작품입니다. 영상이 멋있을수록 「왜 이 고도에서 이 물체가 안 보이는지」를 계산할 수 있으면 설계가 달라집니다.',
    link:'교과서 빛과 렌즈(시야각) · 삼각비 · 4번 탭 · 발명 05(영상 안정화) · 발명 09(열화상).',
    fig:FIGS.C02.fig, tg:FIGS.C02.tg,
    cap:'카메라(시야각 FOV)가 고도 h 에서 지면을 내려다볼 때 촬영 폭 $W=2h\\tan(\\mathrm{FOV}/2)$, 해상도 GSD = W/N. 오른쪽 아래 : 물체 크기별 픽셀 수(막대)',
    parts:[['카메라 + 시야각','Pi Cam v2 FOV 62°','광각일수록 넓게 보이지만 같은 픽셀 수로 더 거칠다. 렌즈 데이터시트의 <i>수평 FOV</i> 를 확인.'],
           ['촬영 폭 W','W = 2h·tan(FOV/2)','고도 100 m, FOV 62° → 약 120 m 폭. 사진은 4:3 이면 높이는 90 m.'],
           ['해상도(픽셀 수)','N = 3280 (8 MP)','가로 픽셀 수. GSD(지상 샘플 간격) = W ÷ N (cm/픽셀).'],
           ['고도–GSD 표','h 에 비례','고도가 2 배면 GSD 도 2 배(같은 물체가 ½ 픽셀 수). 지표에 가까울수록 선명.'],
           ['물체 크기','픽셀 수 = 크기 ÷ GSD','8 픽셀 이상이면 알아볼 수 있다고 보는 경험칙. 자동차 4.5 m → 8 px 이려면 GSD ≤ 56 cm.'],
           ['영상 저장','SD 카드 · 프레임 간격','낙하 중 초당 몇 장? 속도 5 m/s 에서 1 장/초 면 5 m 간격. 저장 용량도 계산.']],
    budget:[['Pi 카메라 + Pi Zero 또는 ESP32-CAM','1','약 3 ~ 5만 원','스마트폰(영상)'],['SD 카드 · 배터리','1 세트','약 1만 원','—'],['캔위성 몸체(전자 부품 고정)','1','약 5천 원','—'],['목표물(정사각 천 · 현수막)','1 세트','약 5천 원','—'],['줄자 · GPS','1','보유','—']],
    steps:['카메라의 FOV(수평) · 픽셀 수를 데이터시트로 확인하고, 지면에 크기를 아는 목표물(1 m 정사각 천 · 사람 · 자동차)을 놓는다.','드론 · 옥상에서 고도 10 · 20 · 50 · 100 m 에서 수직으로 내려다보는 영상을 찍는다(허가 · 안전 확인).','영상에서 목표물이 차지하는 픽셀 수를 세어 GSD = 크기 ÷ 픽셀 수 를 구한다.','고도 대 GSD 그래프를 그려 이론 $\\mathrm{GSD}=2h\\tan(\\mathrm{FOV}/2)/N$ 과 비교한다.','가장 높은 고도에서도 알아볼 수 있는 물체 크기를 표로 만들고, 파노라마(여러 장 이어 붙이기) 작품을 만든다.'],
    vars:['고도 h · 시야각 FOV','지상 해상도 GSD · 물체 픽셀 수','카메라 · 렌즈 · 초점 · 날씨 · 카메라 각도'],
    predict:[['h = 100 m · FOV 62°','촬영 폭 '+fx(a.W,0)+' m · GSD '+fx(a.gsd*100,1)+' cm/px · 자동차 '+fx(4.5/a.gsd,0)+' px · 사람 '+fx(0.5/a.gsd,0)+' px','$W=2h\\tan(\\mathrm{FOV}/2)$ = 2×100×0.603'],
             ['h = 30 m','GSD '+fx(b.gsd*100,1)+' cm/px · 사람 '+fx(0.5/b.gsd,0)+' px(알아볼 수 있음)','고도가 낮을수록 선명(GSD ∝ h)'],
             ['FOV 120° (광각)','같은 100 m 에서 촬영 폭 '+fx(c.W,0)+' m (GSD '+fx(c.gsd*100,1)+' cm/px, FOV 62° 의 약 '+fx(c.gsd/a.gsd,1)+' 배)','넓게 보이지만 해상도는 떨어진다'],
             ['자동차를 8 픽셀로 보려면','FOV 62° : h ≤ '+fx(a.hCar,0)+' m','$h\\le\\dfrac{(4.5/8)N}{2\\tan(\\mathrm{FOV}/2)}$']],
    data:{cols:['h (m)','촬영 폭 W (m)','GSD (cm/px)','자동차 4.5 m (px)','사람 0.5 m (px)','판정(사람)'],
          rows:[10,30,50,100,200].map(function(hh){ var q=c02(hh,62); return [hh,fx(q.W,0),fx(q.gsd*100,1),fx(4.5/q.gsd,0),fx(0.5/q.gsd,0),0.5/q.gsd>=8?'식별':'안 보임']; })},
    analysis:'측정 GSD 대 이론 GSD 를 한 그래프에 그려 렌즈 왜곡 · 카메라 기울기에 의한 편차를 설명한다. $\\mathrm{GSD}=\\dfrac{2h\\tan(\\mathrm{FOV}/2)}{N}$ 의 기울기에서 FOV 를 역으로 구해 데이터시트와 비교(캘리브레이션). 영상 번짐은 낙하 속도 × 노출 시간 ÷ GSD 로 픽셀 번짐을 계산한다.',
    special:['🎨 작품 기획서',[['작품 이름','「떨어지며 보는 우리 학교」 — 100 m → 0 m 파노라마'],['표현 아이디어','고도별 사진을 한 화면에 이어 붙이고 고도 · GSD 숫자를 자막으로 표시'],['과학 근거','$W=2h\\tan(\\mathrm{FOV}/2)$ · GSD ∝ h · 8 픽셀 식별 기준'],['전시 구성','낙하 영상 + 고도–GSD 그래프 + 「무엇이 보이나」 퀴즈']]],
    fails:[['영상이 흔들리고 흐리다','노출 시간을 짧게(1/500 s), 카메라를 진동 흡수 폼에 고정, 안정화(I05)'],['목표물 픽셀 수가 이론과 다르다','카메라가 정확히 수직이 아님 — 수평계로 맞추고 기울기 각 기록'],['저장 용량이 모자란다','프레임 간격을 늘리거나 해상도를 낮추기, 영상 압축']],
    up:['<b>발명 05</b> — 짐벌 영상 안정화.','<b>발명 09</b> — 같은 방법으로 열화상 센서의 칸 크기 계산.','<b>정사영상</b> — 고도 · 자세 정보로 영상을 지도에 맞춰 붙이기(사진측량).'],
    next:['발명 · 짐벌 영상 안정화 (I05)',12],
    eval:[['창의성','낙하 영상을 작품으로 구성(자막 · 지도 · 이야기)'],['정확성','GSD 이론 · 측정 비교, 불확도'],['해석','식별 가능 크기를 근거로 설명'],['안전','방출 · 촬영 장소 규정 준수']],
    tip:'1 층에서 옥상까지 낙하하는 영상에 「지금 이 고도에서 보이는 가장 작은 물체」를 자막으로 띄우면 이해가 쉽습니다.' };
})();
SIMS.C02={ q:'고도와 시야각이 달라지면 촬영 폭과 지상 해상도, 그리고 알아볼 수 있는 물체의 크기는 어떻게 바뀔까?',
  a:{nm:'시작 고도 h',min:10,max:300,step:5,val:100,unit:'m',d:0}, b:{nm:'카메라 시야각 FOV',min:40,max:120,step:2,val:62,unit:'°',d:0},
  cap1:'캔위성이 시작 고도에서 10 m 까지 내려오며 찍습니다. 막대 = 물체가 영상에서 차지하는 픽셀 수(로그), 빨간 선 = 알아보는 기준 8 픽셀.',
  cap2:'📊 지상 해상도 GSD(cm/픽셀) 대 고도 — 네 FOV(40 · 62 · 90 · 120°), 굵은 점 = 지금 설정.',
  note:'모형 : 가로 3280 픽셀(8 MP), GSD = 2h·tan(FOV/2)/3280, 식별 기준 8 픽셀. 렌즈 왜곡 · 기울기 · 대기 영향은 무시한 이상화입니다.',
  anim:function(ctx,w,h,t,h0,fov,S){ var hh=h0-(h0-10)*Math.min(1,t/9), q=c02(hh,fov), gy=h-30, X0=w*0.28, sc=(gy-60)/h0, cy=gy-hh*sc, half=Math.min(w*0.26,hh*Math.tan(fov*Math.PI/360)*sc*1.0);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); var wl=w*0.5; ctx.save(); ctx.beginPath(); ctx.rect(0,0,wl,h); ctx.clip(); skyBg(ctx,wl,gy); groundBg(ctx,wl,h,gy);
    ctx.fillStyle='rgba(125,211,252,.16)'; ctx.beginPath(); ctx.moveTo(X0,cy); ctx.lineTo(X0-half,gy); ctx.lineTo(X0+half,gy); ctx.closePath(); ctx.fill(); ctx.strokeStyle=COL.blue; ctx.lineWidth=1; ctx.stroke();
    drawCan(ctx,X0-7,cy-30,26); ctx.restore();
    cvText(ctx,'h = '+hh.toFixed(0)+' m',X0+16,cy-16,COL.text,'bold 11px system-ui,sans-serif'); cvText(ctx,'폭 W = '+q.W.toFixed(0)+' m',X0,gy+14,COL.blue,'11px system-ui,sans-serif','center');
    var bx0=wl+30, bx1=w-24, by0=60, bh=34; function xp(px){ return bx0+(bx1-bx0)*(Math.log10(Math.max(px,0.5))+0.3)/(Math.log10(5000)+0.3); }
    cvText(ctx,'영상 속 크기 (픽셀 수, 로그)',bx0,30,COL.text,'bold 11.5px system-ui,sans-serif');
    C02OBJ.forEach(function(o,i){ var px=o[1]/q.gsd, y=by0+i*(bh+18); ctx.fillStyle=px>=8?COL.ok:COL.grav; ctx.fillRect(bx0,y,Math.max(2,xp(px)-bx0),bh*0.6); cvText(ctx,o[0],bx0,y-8,COL.tick,'10.5px system-ui,sans-serif'); var lab=px.toFixed(px<10?1:0)+' px'+(px>=8?' ✓':' ✕'), lx=xp(px)+6, over=lx>w-70; cvText(ctx,lab,over?xp(px)-6:lx,y+bh*0.3,over?COL.cvbg:(px>=8?COL.ok:COL.grav),'bold 11px system-ui,sans-serif',over?'right':'left'); });
    var x8=xp(8); ctx.strokeStyle=COL.grav; ctx.setLineDash([4,3]); ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(x8,by0-14); ctx.lineTo(x8,by0+4*(bh+18)-14); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'8 px',x8+4,by0-18,COL.grav,'10.5px system-ui,sans-serif');
    cvText(ctx,'GSD = '+(q.gsd*100).toFixed(1)+' cm/px',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,h0,fov,S){ var P=makePlot(ctx,w,h,{xmin:Math.log10(10),xmax:Math.log10(300),ymin:0.5,ymax:50,ylog:true,xlabel:'고도 h (m, 로그)',ylabel:'GSD (cm/픽셀)',title:'지상 해상도 GSD – 고도',left:54,xfmt:function(q){ return Math.round(Math.pow(10,q))+''; }}), cols=[COL.blue,COL.ok,COL.iner,COL.grav];
    [40,62,90,120].forEach(function(f,k){ plotLine(ctx,P,[[1,c02(10,f).gsd*100],[Math.log10(300),c02(300,f).gsd*100]],cols[k],f===Math.round(fov)?3:1.4,f===Math.round(fov)?null:[4,3]); });
    plotLine(ctx,P,[[1,0.5/8*100],[Math.log10(300),0.5/8*100]],COL.warm,1.2,[3,3]); plotPoints(ctx,P,[[Math.log10(h0),c02(h0,fov).gsd*100]],COL.amber,6.5);
    legend(ctx,P.x0+10,P.y1+14,[['FOV 40°',cols[0]],['FOV 62°',cols[1]],['FOV 90°',cols[2]],['FOV 120°',cols[3]],['사람 식별선(6 cm)',COL.warm]]); },
  kv:function(h0,fov,S){ var q=c02(h0,fov); return [['촬영 폭 W',q.W.toFixed(0)+' m','a'],['지상 해상도 GSD',(q.gsd*100).toFixed(1)+' cm/px'],['한 장 면적',(q.area/7140).toFixed(1)+' 축구장','g'],['자동차 식별 한계 고도',q.hCar.toFixed(0)+' m','v2'],['사람 픽셀 수(지금)',(0.5/q.gsd).toFixed(1)+' px','r']]; } };

/* ── C03 : 소리로 듣는 고도 (소니피케이션) ──────────────────────────────── */
var NOTE=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
function noteName(f){ var n=Math.round(69+12*Math.log2(f/440)); return NOTE[((n%12)+12)%12]+(Math.floor(n/12)-1); }
function c03f(h,H,oct){ var f0=220, f1=f0*Math.pow(2,oct); return f0*Math.pow(f1/f0,1-h/H); }          // 높을수록 낮은 음, 땅에 가까울수록 높은 음
(function(){
  PROJ.C03={ id:'C03', t:'소리로 듣는 고도 — 땅이 가까워질수록 높아지는 음', icon:'🎵', type:'창의 · 음악 융합', lv:1, dur:'2주', cost:'약 1 ~ 2만 원',
    one:'기압 센서 값을 소리 높이로 바꾸는 소니피케이션 장치를 만든다. 고도가 낮아질수록 음이 올라가도록 매핑 f(h) 를 설계해 「눈 없이 귀로 착륙 고도를 듣는」 캔위성을 만든다.',
    q:'고도 → 음높이 매핑 $f(h)=f_0(f_1/f_0)^{1-h/H}$ 를 쓰면 고도 변화를 몇 반음 단위로 구별할 수 있을까? 사람 귀는 몇 m 의 고도 차이를 알아챌까?',
    why:'데이터를 눈이 아니라 <b>귀</b>로 느끼는 일은 음악 · 접근성(시각 장애 지원) · 항공(고도 경보 장치)에서 모두 쓰입니다. 로그 스케일(옥타브)이 사람의 음높이 지각과 맞는다는 점도 자연스럽게 배웁니다.',
    link:'교과서 소리(진동수 · 음높이) · 평균율 · 로그와 지수 · 3번 탭 기압 고도계.',
    fig:FIGS.C03.fig, tg:FIGS.C03.tg,
    cap:'기압 센서(BMP280)로 고도를 재고 아두이노가 $f(h)$ 를 계산해 부저에 tone() 으로 출력한다. 땅과 가까워질수록 높은 음 — 건반(아래 가운데)에서 어떤 음인지 확인',
    parts:[['고도 센서','BMP280 · 기압 → 높이','3번 탭의 기압 고도식을 사용. <i>0.1 m 분해능</i>이어도 잡음 때문에 평균이 필요.'],
           ['아두이노 · 코드','tone(pin, f)','고도를 읽어 주파수를 계산하고 tone() 으로 출력. 매 0.1 초 갱신.'],
           ['부저 · 스피커','압전 부저 · 소형 스피커','캔위성 안에서 소리가 울리도록. 지상 마이크로 듣거나 착륙 후 위치 찾기 비컨으로도 활용.'],
           ['매핑 f(h)','지수(로그) 매핑','옥타브 수 1 ~ 4. 지수 매핑이면 <i>같은 높이 차이가 같은 음정 차이</i>로 들린다.'],
           ['음계 · 건반','평균율 12 음','$f=440\\cdot2^{(n-69)/12}$. 반음 = 약 5.9 % 진동수 차이.'],
           ['지상 청취','마이크 · 사람 귀','소리가 높아지는 속도로 낙하 속도를 느낄 수 있는지 시험.']],
    budget:[['BMP280 · 아두이노','1 세트','약 1만 원','마이크로비트'],['압전 부저(수동형)','1','약 5백 원','소형 스피커'],['배터리 · 스위치','1 세트','약 3천 원','—'],['스마트폰 소리 분석 앱','1','무료','—']],
    steps:['BMP280 으로 고도를 읽는 코드를 만들고(14번 탭) 책상 위에서 0 m, 계단 위에서 몇 m 가 읽히는지 확인한다.','$f(h)=f_0(f_1/f_0)^{1-h/H}$ 로 고도 H = 20 m 구간에 2 옥타브를 매핑하고 tone() 으로 부저를 울린다.','계단 · 옥상에서 센서를 들고 내려오며 소리가 올라가는지 확인한다. 소리 높이를 앱으로 재 이론과 비교.','매핑을 바꿔(선형 vs 지수) 어떤 것이 귀에 자연스러운지 친구 5 명에게 평가 받는다.','착륙 시 음이 최고음에 닿도록 조정하고 짧은 작품(「낙하 교향곡」)으로 녹음한다.'],
    vars:['매핑 방식(선형 · 지수) · 옥타브 수 · 고도 구간 H','음높이(주파수) · 반음 수 · 청취 평가','센서 잡음 · 갱신 주기 · 스피커 특성'],
    predict:[['H = 1000 m · 2 옥타브','음높이 '+noteName(c03f(1000,1000,2))+' ('+fx(c03f(1000,1000,2),0)+' Hz) → '+noteName(c03f(0,1000,2))+' ('+fx(c03f(0,1000,2),0)+' Hz)','$f_1=f_0\\,2^{2}$ = '+fx(c03f(0,1000,2),0)+' Hz'],
             ['한 반음당 고도 변화','H/(12×옥타브) = '+fx(1000/24,1)+' m','같은 높이 차는 어디서나 같은 음정 차(지수 매핑)'],
             ['사람이 구별 가능한 음정 차','약 10 센트(= 1/10 반음) → 고도 차 약 '+fx(1000/24/10,1)+' m','귀가 예민할수록 작은 고도 변화도 듣는다(개인차 큼)'],
             ['기압 센서 잡음 ±0.5 m','음높이 ±'+fx(0.5/(1000/24)*100,0)+' 센트(약 ±'+fx(0.5/(1000/24),2)+' 반음)','센서 평균 · 필터로 줄이지 않으면 소리가 떨린다']],
    data:{cols:['고도 h (m)','진동수 f (Hz)','음 이름','반음 번호','이전 대비(센트)'],
          rows:[1000,750,500,250,100,0].map(function(hh,i,arr){ var f=c03f(hh,1000,2), fp=i? c03f(arr[i-1],1000,2):f; return [hh,fx(f,0),noteName(f),fx(69+12*Math.log2(f/440),1),i? fx(1200*Math.log2(f/fp),0):'—']; })},
    analysis:'매핑 곡선 f(h) 를 로그 눈금으로 그리면 직선이 되고 기울기가 옥타브/m. 청취 평가표(자연스러움 1 ~ 5)를 선형 · 지수 매핑 별로 평균 ± 표준편차로 비교한다. 센서 잡음에 의한 음 떨림은 표준편차 센트로 환산해 필터 효과를 평가한다.',
    special:['🎨 작품 기획서',[['작품 이름','「낙하 교향곡」 — 고도를 연주하는 캔위성'],['표현 아이디어','고도마다 다른 악기(음색)로 바꾸고, 착륙 직전 화음으로 마무리'],['과학 근거','평균율 $f=440\\cdot2^{(n-69)/12}$ · 지수 매핑 · 기압 고도식'],['전시 구성','계단에서 직접 센서를 들고 내려오며 소리를 연주하는 체험 코너']]],
    fails:[['음이 계속 떨린다','고도 값을 이동평균(5 샘플)하고 갱신 주기를 늦춘다'],['낮은 고도에서 음이 너무 높아 아프다','출력 한계를 두고(예 : 최대 2 kHz) 음량을 줄이기'],['아두이노에서 음이 끊긴다','tone() 은 한 번에 하나, 센서 읽는 시간이 길면 간격이 생김 — 타이머 사용']],
    up:['<b>도플러 효과</b> — 낙하 중 소리의 진동수 변화(속도 × 소리 속도)를 계산.','<b>회수 비컨</b> — 착륙 후 소리로 위치 알리기(I08).','<b>접근성</b> — 시각 장애 학생을 위한 데이터 소니피케이션 수업으로 확장.'],
    next:['발명 · 회수 비컨 + 방향탐지 (I08)',13],
    eval:[['창의성','소리 매핑 · 작품화의 독창성'],['정확성','음높이 계산 · 센서 처리의 타당성'],['평가','청취 실험으로 선형 vs 지수 비교'],['전시','체험 · 연주 요소']],
    tip:'낙하 영상 위에 고도(숫자)와 음높이 파형을 겹쳐 「귀로 보는 고도」임을 보여 주세요.' };
})();
SIMS.C03={ q:'고도 구간과 옥타브 수를 바꾸면 한 반음당 고도 변화는 얼마이고, 센서 오차는 음높이에 어떤 영향을 줄까?',
  a:{nm:'고도 구간 H',min:100,max:2000,step:50,val:1000,unit:'m',d:0}, b:{nm:'옥타브 수',min:1,max:4,step:1,val:2,unit:'옥타브',d:0},
  cap1:'캔위성이 H → 0 m 로 내려오며 음이 올라갑니다. 아래 건반에서 지금 음을 확인하세요(소리는 14번 탭 코드로 실제로 낼 수 있습니다).',
  cap2:'📊 위 : 음높이(주파수) 대 고도, 아래 : 반음 번호 대 고도(지수 매핑이면 직선). 점 = 지금.',
  note:'모형 : $f(h)=220\\,\\mathrm{Hz}\\cdot2^{\\text{옥타브}\\,(1-h/H)}$ (220 Hz = A3 에서 시작). 평균율 $n=69+12\\log_2(f/440)$.',
  anim:function(ctx,w,h,t,H,oct,S){ var hh=H*(1-Math.min(1,t/9.5)), f=c03f(hh,H,oct), n=69+12*Math.log2(f/440), gy=h-26, cx=w*0.2, sc=(gy-50)/H;
    skyBg(ctx,w*0.4,gy); groundBg(ctx,w*0.4,h,gy); drawCan(ctx,cx-8,gy-hh*sc-30,30); cvText(ctx,'h = '+hh.toFixed(0)+' m',cx+16,gy-hh*sc-14,COL.text,'bold 11px system-ui,sans-serif');
    var kx0=w*0.45, kx1=w-24, nk=Math.round(12*oct)+1, k0=Math.round(69+12*Math.log2(220/440)), kw=(kx1-kx0)/nk, ky=h*0.58, kh=h*0.26, i;
    for(i=0;i<nk;i++){ var nn=k0+i, black=[1,3,6,8,10].indexOf(((nn%12)+12)%12)>=0, on=Math.round(n)===nn; ctx.fillStyle=on?COL.amber:(black?COL.dev:COL.white); ctx.globalAlpha=black?0.7:1; ctx.fillRect(kx0+i*kw,ky,kw-1,kh*(black?0.62:1)); ctx.globalAlpha=1; }
    cvText(ctx,noteName(f)+' · '+f.toFixed(0)+' Hz',(kx0+kx1)/2,ky-14,COL.amber,'bold 18px system-ui,sans-serif','center');
    ctx.strokeStyle=COL.blue; ctx.lineWidth=2; ctx.beginPath(); var x, ww=kx1-kx0, cyy=h*0.22; for(x=0;x<=ww;x++){ var y=cyy+Math.sin(x/ww*6.2832*(f/110)+t*8)*18; if(x) ctx.lineTo(kx0+x,y); else ctx.moveTo(kx0,y); } ctx.stroke();
    cvText(ctx,'음파(보이도록 느리게)',kx0,cyy-26,COL.tick,'10.5px system-ui,sans-serif'); cvText(ctx,'한 반음 = '+(H/(12*oct)).toFixed(1)+' m',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,H,oct,S){ var hh=Math.floor(h*0.5), i;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:H,ymin:150,ymax:220*Math.pow(2,oct)*1.1,ylabel:'f (Hz)',title:'음높이 대 고도 (지수 곡선)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(0); }}, function(P){ var Lc=[]; for(i=0;i<=60;i++){ var hq=H*i/60; Lc.push([hq,c03f(hq,H,oct)]); } plotLine(ctx,P,Lc,COL.amber,2.2); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:H,ymin:57,ymax:69+12*Math.log2(220*Math.pow(2,oct)/440)+2,xlabel:'고도 h (m)',ylabel:'반음 번호',title:'반음 번호 대 고도 — 직선',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}, function(P){ var Lc=[]; for(i=0;i<=60;i++){ var hq=H*i/60; Lc.push([hq,69+12*Math.log2(c03f(hq,H,oct)/440)]); } plotLine(ctx,P,Lc,COL.ok,2.2); }); },
  kv:function(H,oct,S){ var f0=c03f(H,H,oct), f1=c03f(0,H,oct); return [['시작 음',noteName(f0)+' ('+f0.toFixed(0)+' Hz)','a'],['끝 음',noteName(f1)+' ('+f1.toFixed(0)+' Hz)'],['한 반음당 고도',(H/(12*oct)).toFixed(1)+' m','g'],['전체 반음 수',(12*oct)+' 개','v2'],['센서 ±0.5 m 오차',(0.5/(H/(12*oct))*100).toFixed(0)+' 센트','r']]; } };

/* ── C04 : LED 스트로보 낙하 궤적 → 속도 · 가속도 ─────────────────────────── */
function c04(fHz, Dcm){ var vt=vTerm(0.1, dragArea(Dcm/100)), dt=1/fHz, pts=[], k=0; while(true){ var d=fall1D(vt,k*dt); if(d>3) break; pts.push({t:k*dt, d:d}); k++; if(k>400) break; }
  var sp=[]; for(var i=1;i<pts.length;i++) sp.push((pts[i].d-pts[i-1].d)); return {vt:vt, pts:pts, sp:sp, dt:dt}; }
(function(){
  var a=c04(20,20), b=c04(20,0), c=c04(40,20);
  PROJ.C04={ id:'C04', t:'LED 점선 궤적 — 사진 한 장으로 속도와 가속도 읽기', icon:'💡', type:'창의 · 빛 작품', lv:1, dur:'2주', cost:'약 1 ~ 2만 원',
    one:'일정한 주파수 f 로 깜빡이는 LED 를 낙하시키며 장노출로 찍으면 점선 궤적이 남는다. 점 사이 거리 $\\Delta s$ 로 속도 $v=\\Delta s\\,f$ 와 가속도를 구하고 낙하산이 속도를 일정하게 만드는 것을 확인한다.',
    q:'스트로보 사진에서 점 간격은 낙하산이 없을 때와 있을 때 어떻게 다를까? 점 간격으로 구한 종단속도는 이론값과 일치할까?',
    why:'「사진 한 장」에 시간 정보가 점선으로 담기는 것이 아름답고, 물리 실험으로는 <b>시간 측정이 필요 없이</b>(주파수만 알면) 속도 · 가속도를 얻는 고전 방법(스트로보 사진)입니다. 밤하늘 빛 작품으로 전시하기에도 좋습니다.',
    link:'교과서 등가속도 운동 · 종단속도 · 2번 탭 · R01(낙하산 속도) · 15번 탭.',
    fig:FIGS.C04.fig, tg:FIGS.C04.tg,
    cap:'깜빡이는 LED(왼쪽)를 매단 낙하 물체의 점선 궤적(오른쪽)을 장노출로 찍는다. 점 간격이 처음엔 점점 넓어지다(가속) 낙하산이 펼쳐지면 일정해진다(종단속도). v = Δs·f',
    parts:[['LED','고휘도 · 흰색 · 빨강','작고 밝은 LED 1 개. 어두운 방에서 찍어야 점이 선명. 질량이 작아야 낙하에 영향이 없다.'],
           ['깜빡임 회로','555 타이머 · 아두이노','주파수 f = 20 Hz(0.05 s 마다). <i>주파수를 오실로스코프나 앱으로 정확히 확인</i> — 속도 계산의 핵심.'],
           ['낙하 경로','2.5 ~ 3 m · 어두운 방','수직 낙하 경로 옆에 눈금 막대(1 m)를 세워 거리 기준으로 쓴다.'],
           ['카메라(장노출)','스마트폰 프로 모드 · 삼각대','셔터 2 ~ 4 초. 낙하 시작 직전에 셔터를 눌러 전 구간을 담는다.'],
           ['점 간격 Δs','자 · 영상 분석','사진 속 점 사이 픽셀 거리를 눈금 막대로 m 로 환산(원근에 주의).'],
           ['속도 계산','v = Δs · f','가속 구간은 연속한 간격의 차 $\\Delta(\\Delta s)=a/f^2$ 로 가속도.']],
    budget:[['고휘도 LED + 저항','2','약 5백 원','손전등'],['555 타이머 또는 아두이노 나노','1','약 1천 ~ 5천 원','마이크로비트'],['9 V 배터리(작은 것)','1','약 1천 원','코인전지'],['삼각대','1','학교 비품','—'],['눈금 막대(1 m)','1','약 3천 원','—']],
    steps:['LED 를 20 Hz 로 깜빡이는 회로를 만들어 가벼운 물체(캔 모형 100 g)에 단다. 주파수를 앱 · 오실로스코프로 확인한다.','어두운 방에서 카메라를 삼각대에 고정하고(셔터 3 초) LED 물체를 낙하산 없이 2.5 m 높이에서 떨어뜨려 점선 사진을 찍는다.','같은 방법으로 지름 20 cm 낙하산을 단 물체도 찍는다.','사진에서 점 간격을 재어 $v_k=\\Delta s_k f$ 를 구하고 v – t(t = k/f) 그래프를 그린다.','낙하산이 있을 때 v 가 일정해지는 값을 종단속도로 하여 이론 $v_t=\\sqrt{2mg/\\rho C_dA}$ 와 비교한다.'],
    vars:['LED 주파수 f · 낙하산 지름 D','점 간격 Δs · 속도 v · 가속도 a','질량 · 높이 · 카메라 위치 · 어둡기'],
    predict:[['낙하산 없음 · f = 20 Hz · 100 g','점 '+b.pts.length+' 개, 간격이 0.5 cm → '+fx(b.sp[b.sp.length-1]*100,0)+' cm 로 계속 증가(가속 중)','자유 낙하에 가까움 — 3 m 구간에서 종단속도(약 '+fx(b.vt,0)+' m/s)에 못 이름'],
             ['낙하산 20 cm · f = 20 Hz','간격이 처음 증가하다 약 '+fx(a.sp[a.sp.length-1]*100,1)+' cm 로 일정 → v = '+fx(a.sp[a.sp.length-1]*20,1)+' m/s','$v_t$ 이론 '+fx(a.vt,2)+' m/s'],
             ['f = 40 Hz','간격이 절반(약 '+fx(c.sp[c.sp.length-1]*100,1)+' cm), 점이 2 배 많아 해상도 향상','같은 속도에서 간격 ∝ 1/f'],
             ['가속도 읽기','자유 낙하 초기 $\\Delta(\\Delta s)=g/f^2$ = '+fx(SUBJ.g/400*100,2)+' cm (f = 20 Hz)','연속한 간격의 차이가 일정하면 등가속도 — 이 값으로 g 도 구할 수 있다']],
    data:{cols:['점 번호 k','시각 t (s)','간격 Δs (cm)','속도 v=Δs·f (m/s)','이론 v(t) (m/s)'],
          rows:a.sp.slice(0,8).map(function(s,k){ return [k+1,fx((k+0.5)*0.05,3),fx(s*100,1),fx(s*20,2),fx(fallV(a.vt,(k+0.5)*0.05),2)]; })},
    analysis:'v_k 대 t_k 그래프에서 초기 기울기 = g(자유 낙하와 비교), 나중 평탄한 값 = 종단속도. $\\Delta s_k$ 의 측정 오차(±2 픽셀)가 속도 오차로 어떻게 전파되는지($\\delta v=f\\,\\delta s$) 계산한다. 낙하산 유무에 따른 v – t 곡선을 겹쳐 그려 비교.',
    special:['🎨 작품 기획서',[['작품 이름','「빛이 그린 낙하」 — 점선으로 쓰는 속도'],['표현 아이디어','LED 색을 f 에 따라 바꾸고(RGB) 낙하산 크기별 궤적을 겹쳐 하나의 포스터로'],['과학 근거','$v=\\Delta s\\,f$ · $a=\\Delta(\\Delta s)\\,f^2$ · 종단속도'],['전시 구성','장노출 사진 전시 + 직접 LED 를 떨어뜨려 찍어 보는 체험 코너(어두운 방)']]],
    fails:[['점이 이어져 선이 된다','깜빡임 듀티를 낮춰(켜짐 시간 짧게) 점을 또렷하게'],['점 간격 측정이 어렵다','눈금 막대를 같은 거리에 세워 함께 찍고 사진 편집기에서 픽셀 거리 측정'],['낙하 중 LED 가 흔들려 궤적이 굽는다','줄에 매달지 말고 가이드 관 안에서 낙하, 낙하산 줄 길이 통일']],
    up:['<b>R01 연결</b> — 지름 법칙을 이 방법으로 정밀 측정.','<b>컬러 스트로보</b> — 주파수에 따라 색을 바꿔 시간 눈금을 색으로.','<b>가속도 센서와 비교</b> — IMU 로 같은 낙하를 기록해 두 방법의 속도를 비교.'],
    next:['원리① 낙하와 종단속도',2],
    eval:[['창의성','빛 작품으로서의 구성'],['정확성','주파수 · 거리 환산의 정확성, 오차 전파'],['해석','가속 구간과 종단속도 구간을 식으로 설명'],['안전','어두운 방 · 낙하 물체 안전']],
    tip:'낙하산 없는 것과 있는 것의 점선 궤적 사진을 나란히 놓으면 「속도가 일정해진다」가 한눈에 보입니다.' };
})();
SIMS.C04={ q:'LED 깜빡임 주파수와 낙하산 크기를 바꾸면 점선 사진의 간격과 읽은 속도는 어떻게 될까?',
  a:{nm:'깜빡임 주파수 f',min:5,max:50,step:1,val:20,unit:'Hz',d:0}, b:{nm:'낙하산 지름 D (0 = 없음)',min:0,max:40,step:2,val:20,unit:'cm',d:0},
  cap1:'3 m 낙하하는 LED(×0.3 슬로모션)와 장노출 사진에 남는 점. 점 간격이 넓어지다 일정해지면 종단속도입니다.',
  cap2:'📊 위 : 점 간격 대 점 번호, 아래 : 간격에서 읽은 속도 $v=\\Delta s\\,f$ 대 시간(점선 = 이론 종단속도).',
  note:'모형 : 질량 100 g, 낙하산 Cd 1.5(+ 캔), 정지에서 출발해 $d(t)=\\dfrac{v_t^2}{g}\\ln\\cosh\\dfrac{gt}{v_t}$, 점은 $t_k=k/f$ 에 찍힘, 총 낙하 3 m.',
  anim:function(ctx,w,h,t,f,D,S){ var q=c04(f,D), gy=h-30, top=26, sc=(gy-top)/3, x0=w*0.28, tt=t*0.3, i; ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle='#04060d'; ctx.fillRect(w*0.1,top-10,w*0.38,gy-top+10);
    cvLine(ctx,[[x0+30,top],[x0+30,gy]],COL.axis2,1); for(i=0;i<=3;i++){ cvLine(ctx,[[x0+26,top+i*sc],[x0+34,top+i*sc]],COL.axis2,1); cvText(ctx,i+' m',x0+38,top+i*sc,COL.tick,'10px system-ui,sans-serif'); }
    for(i=0;i<q.pts.length;i++){ if(q.pts[i].t<=tt){ cvCirc(ctx,x0,top+q.pts[i].d*sc,3,COL.amber,null); } }
    var d=Math.min(3,fall1D(q.vt,tt)); cvCirc(ctx,x0+60,top+d*sc,7,COL.light,COL.amber,2); ctx.fillStyle='rgba(253,224,71,.25)'; ctx.beginPath(); ctx.arc(x0+60,top+d*sc,14,0,6.2832); ctx.fill(); if(D>0) drawChute(ctx,x0+60,top+d*sc-8,10,Math.max(8,D*0.9),1);
    var n=q.sp.length, last=q.sp[n-1]; cvText(ctx,'점 '+q.pts.length+' 개 · 마지막 간격 '+(last*100).toFixed(1)+' cm → v = '+(last*f).toFixed(2)+' m/s (이론 종단 '+q.vt.toFixed(2)+')',12,14,COL.text,'bold 11.5px system-ui,sans-serif'); cvText(ctx,'장노출 사진',w*0.1+6,top+6,COL.dim,'10.5px system-ui,sans-serif'); cvText(ctx,'실시간 낙하',x0+60,gy+14,COL.tick,'10.5px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,f,D,S){ var q=c04(f,D), hh=Math.floor(h*0.48), n=q.sp.length, i, smax=0; for(i=0;i<n;i++) if(q.sp[i]>smax) smax=q.sp[i]; ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:Math.max(n+1,5),ymin:0,ymax:smax*100*1.15+0.5,ylabel:'간격 Δs (cm)',title:'점 간격 대 점 번호',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotPoints(ctx,P,q.sp.map(function(s,k){ return [k+1,s*100]; }),COL.amber,3.6); plotLine(ctx,P,q.sp.map(function(s,k){ return [k+1,s*100]; }),COL.amber,1.2); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:(n+1)/f,ymin:0,ymax:Math.max(q.vt,smax*f)*1.2,xlabel:'시간 t (s)',ylabel:'v = Δs·f (m/s)',title:'읽은 속도',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(2); },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      plotLine(ctx,P,[[0,q.vt],[(n+1)/f,q.vt]],COL.pink2,1.4,[6,4]); var Lv=[],k; for(k=0;k<=60;k++){ var tq=(n+1)/f*k/60; Lv.push([tq,fallV(q.vt,tq)]); } plotLine(ctx,P,Lv,COL.dim,1.2,[4,3]); plotPoints(ctx,P,q.sp.map(function(s,k){ return [(k+0.5)/f,s*f]; }),COL.ok,3.6);
      legend(ctx,P.x1-130,P.y1+14,[['읽은 속도',COL.ok],['이론 v(t)',COL.dim],['종단속도',COL.pink2]]); }); },
  kv:function(f,D,S){ var q=c04(f,D), n=q.sp.length, last=q.sp[n-1], first=q.sp[0]; return [['점 개수',q.pts.length+' 개','a'],['첫 간격 → 마지막',(first*100).toFixed(2)+' → '+(last*100).toFixed(1)+' cm'],['읽은 속도 v',(last*f).toFixed(2)+' m/s','g'],['이론 종단속도',q.vt.toFixed(2)+' m/s','v2'],['가속도 초기 g/f²',(SUBJ.g/f/f*100).toFixed(2)+' cm','r']]; } };

/* ── C05 : 달 탐사 로버 — 경사 · 바퀴 · 토크 ───────────────────────────── */
function c05(th, rcm){ var m=0.5, r=rcm/100, mu=0.6, tau=m*SUBJ.g*r*Math.sin(th*Math.PI/180), v=0.1, Pm=m*SUBJ.g*v*Math.sin(th*Math.PI/180), Pe=Pm/0.4+1.0, hrun=3.7*0.8/Pe; return {tau:tau, kgfcm:tau*10.2, Pm:Pm, Pe:Pe, hrun:hrun, slip:Math.atan(mu)*180/Math.PI, hmax:r*(1-1/Math.sqrt(1+mu*mu))}; }
(function(){
  var a=c05(15,3), b=c05(25,3), c=c05(15,6), lim=c05(0,3).slip;
  PROJ.C05={ id:'C05', t:'달 탐사 로버 캔위성 — 경사 · 바퀴 반지름 · 토크 설계', icon:'🚙', type:'창의 · 로봇 제작', lv:2, dur:'5주', cost:'약 4 ~ 8만 원',
    one:'착륙한 캔위성에서 나와 모래 경사를 오르는 소형 로버를 만든다. 경사각 θ · 바퀴 반지름 r 에 대해 필요한 토크 $\\tau=mgr\\sin\\theta$, 미끄럼 한계 $\\theta<\\arctan\\mu$, 배터리 주행 시간을 계산하고 시험한다.',
    q:'0.5 kg 로버가 15° 모래 경사를 오르는 데 필요한 토크는? 바퀴를 크게 하면 토크는 어떻게 되고, 미끄러지기 전에 오를 수 있는 최대 경사는?',
    why:'「오른다」는 목표를 <b>숫자(토크 · 마찰 · 전력)</b>로 쪼개 설계하는 첫 로봇 프로젝트입니다. 달 · 화성 로버가 왜 큰 바퀴와 가벼운 몸체를 쓰는지 이해하고, 캔위성 착륙 후 임무(이동 · 시료 채취)로 확장할 수 있습니다.',
    link:'교과서 힘의 평형 · 마찰력 · 일과 일률 · 회전(토크) · 6번 탭 전력.',
    fig:FIGS.C05.fig, tg:FIGS.C05.tg,
    cap:'로버의 바퀴(반지름 r) · 모터를 경사로(각 θ)에서 시험하고 필요한 토크 $\\tau=mgr\\sin\\theta$ 와 무게중심 위치, 배터리 주행 시간을 계산한다',
    parts:[['바퀴','반지름 r = 3 ~ 6 cm','큰 바퀴는 필요한 토크가 크지만(τ ∝ r) 장애물을 잘 넘는다. 고무 타이어 · 홈이 있는 바퀴가 마찰에 유리.'],
           ['모터','N20 기어 모터 · 서보','정격 토크(kgf·cm) · 회전수를 확인. 마주 보는 두 바퀴에 각각 모터를 단다.'],
           ['경사로','합판 · 모래','각도 0 ~ 35°, 표면 모래 · 매끈한 판 · 잔디. 각도계 · 앱으로 정확히 맞춘다.'],
           ['필요 토크','τ = m g r sinθ','m = 0.5 kg, r = 3 cm, θ = 15° → 0.038 N·m ≈ 0.39 kgf·cm (합계). 바퀴 2 개면 각 0.2 kgf·cm.'],
           ['무게중심(CG)','낮고 중앙','CG 가 높고 뒤쪽이면 경사에서 뒤집힌다. 배터리를 가장 낮게 · 바퀴 사이에.'],
           ['배터리','3.7 V · 1000 mAh','전력 = 기계 일률 ÷ 효율 + 기본 소모. 주행 시간 = 0.8 × 에너지 ÷ 전력.']],
    budget:[['N20 기어 모터 2 개 + 모터 드라이버','1 세트','약 1.5만 원','서보 2 개'],['바퀴(3 ~ 6 cm)','2 ~ 4 개','약 3천 ~ 1만 원','3D 프린트'],['아두이노 · 배터리 · 케이블','1 세트','약 2 ~ 3만 원','—'],['합판 경사로 · 모래','1','약 1만 원','—'],['각도계 앱','1','무료','—']],
    steps:['로버 몸체(0.5 kg)에 모터 · 바퀴를 달고 CG 를 낮게 잡는다. 질량 · 바퀴 반지름을 기록한다.','경사로를 5° 단위로 올려 가며 로버가 오를 수 있는 최대 각 θ_max 를 찾는다(각 각도 3 회).','각도마다 오르는 시간 · 전류를 재어 전력을 기록한다(멀티미터).','식 $\\tau=mgr\\sin\\theta$ 와 미끄럼 한계 $\\arctan\\mu$ 로 예측한 θ_max 와 실험값을 비교한다.','바퀴 반지름을 바꿔(3 · 4.5 · 6 cm) 같은 시험을 되풀이하고 최적 설계를 제안한다.'],
    vars:['경사각 θ · 바퀴 반지름 r · 표면(μ)','오를 수 있는 최대 각 · 전력 · 주행 시간','질량 · CG · 모터 · 배터리 · 속도'],
    predict:[['θ = 15° · r = 3 cm · 0.5 kg','필요 토크 '+fx(a.kgfcm,2)+' kgf·cm(합계), 기계 일률 '+fx(a.Pm*1000,0)+' mW, 전력 약 '+fx(a.Pe,1)+' W → 주행 '+fx(a.hrun,1)+' 시간','$\\tau=mgr\\sin\\theta$, $P=mgv\\sin\\theta$ (v = 0.1 m/s)'],
             ['θ = 25° · r = 3 cm','필요 토크 '+fx(b.kgfcm,2)+' kgf·cm (15° 의 '+fx(b.tau/a.tau,2)+' 배)','$\\sin25^\\circ/\\sin15^\\circ$ = 1.63'],
             ['r = 6 cm (바퀴 2 배)','필요 토크 '+fx(c.kgfcm,2)+' kgf·cm (2 배)','$\\tau\\propto r$ — 큰 바퀴는 토크가 더 필요'],
             ['모래(μ = 0.6)의 미끄럼 한계','약 '+fx(lim,0)+'° 이상은 토크가 충분해도 바퀴가 미끄러진다','$\\theta_{\\max}=\\arctan\\mu$ — 표면이 정한다']],
    data:{cols:['θ (°)','r (cm)','필요 토크 (kgf·cm)','기계 일률 (mW)','전력 (W)','주행 시간 (h)'],
          rows:[[5,3],[10,3],[15,3],[25,3],[15,6]].map(function(q){ var r=c05(q[0],q[1]); return [q[0],q[1],fx(r.kgfcm,2),fx(r.Pm*1000,0),fx(r.Pe,1),fx(r.hrun,1)]; })},
    analysis:'θ 대 필요 토크의 그래프가 $\\sin\\theta$ 곡선인지, 실제 θ_max 가 모터 정격 토크에서 예측되는지 확인한다. 미끄러짐이 먼저 일어났다면 표면 μ 를 $\\tan\\theta_{\\max}$ 로 역산한다. 바퀴 반지름을 바꾼 실험은 「큰 바퀴 – 낮은 토크 여유」 맞바꿈으로 정리한다.',
    special:['🎨 작품 기획서',[['작품 이름','「달 위의 캔」 — 착륙 후 10 m 탐사 로버'],['표현 아이디어','캔위성에서 로버가 내려와 지정된 경사 코스를 오르는 시연 영상'],['과학 근거','$\\tau=mgr\\sin\\theta$ · $\\theta<\\arctan\\mu$ · 전력과 주행 시간'],['전시 구성','경사 코스 + 직접 각도를 올려 보는 체험 + 설계 비교 표']]],
    fails:[['경사에서 바퀴가 헛돈다','바퀴 표면에 홈 · 고무밴드, 무게를 앞바퀴에 실어 마찰력 증가'],['오르다가 뒤로 뒤집힌다','CG 를 앞 · 아래로 이동(배터리 위치), 바퀴 간격을 넓힌다'],['모터가 멈춘다(과부하)','기어비가 더 큰 모터 · 바퀴를 작게 · 전압 확인']],
    up:['<b>6번 탭 연결</b> — 착륙 충격을 견딘 뒤 작동하는 로버(완충 설계 포함).','<b>자율 주행</b> — 초음파 센서로 장애물 회피 코스.','<b>발명 10</b> — 반작용 휠로 자세 제어(경사에서 뒤집힘 방지).'],
    next:['원리⑤ 전력 · 충격 · 안전',6],
    eval:[['창의성','캔위성과 로버를 하나의 임무로 설계'],['정확성','토크 · 전력 계산과 시험의 일치 정도'],['해석','실패(미끄럼 · 전복)의 원인을 식으로 설명'],['안전','모터 · 배터리 · 경사로 사용 안전']],
    tip:'각도를 한 칸씩 올리며 로버가 포기하는 순간의 각도(= θ_max)를 영상으로 보여 주면 계산과 비교하기 좋습니다.' };
})();
SIMS.C05={ q:'경사각과 바퀴 반지름을 바꾸면 필요한 토크 · 전력은 얼마가 되고, 어느 각도부터 미끄러질까?',
  a:{nm:'경사각 θ',min:0,max:40,step:1,val:15,unit:'°',d:0}, b:{nm:'바퀴 반지름 r',min:2,max:8,step:0.5,val:3,unit:'cm',d:1},
  cap1:'모래 경사를 오르는 로버. 초록 = 오를 수 있음, 빨강 = 미끄러짐(θ > arctan μ). 바퀴는 보이게 느리게 돌립니다.',
  cap2:'📊 위 : 필요 토크(kgf·cm) 대 경사각(r = 2 · 4 · 6 · 8 cm), 주황 = 예시 모터 합계 0.8 kgf·cm. 아래 : 전력과 주행 시간 대 경사각.',
  note:'모형 : 질량 0.5 kg, 마찰계수 μ = 0.6(마른 모래 어림), 속도 0.1 m/s, 모터 효율 0.4, 기본 소모 1 W, 배터리 3.7 V·1000 mAh(80 % 사용). 모터 정격은 예시입니다(제품마다 다름).',
  anim:function(ctx,w,h,t,th,rcm,S){ var q=c05(th,rcm), a=th*Math.PI/180, x0=40, y0=h-50, L=w-110, slip=th>q.slip, rv=Math.max(10,rcm*3);
    skyBg(ctx,w,h); ctx.fillStyle=COL.ground; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x0+L,y0-Math.tan(a)*L*0.9); ctx.lineTo(x0+L,y0+30); ctx.lineTo(x0,y0+30); ctx.closePath(); ctx.fill(); cvLine(ctx,[[x0,y0],[x0+L,y0-Math.tan(a)*L*0.9]],COL.dev,2);
    var s=(slip? 0.15+0.1*Math.sin(t*3):((t/10)*0.75+0.05)), px=x0+L*0.9*s*Math.cos(a)/Math.cos(a), py=y0-Math.tan(a)*(px-x0); ctx.save(); ctx.translate(px,py); ctx.rotate(-a);
    ctx.fillStyle=COL.metal; ctx.strokeStyle=COL.dev; ctx.lineWidth=1.4; ctx.fillRect(-26,-rv*2-8,52,18); ctx.strokeRect(-26,-rv*2-8,52,18); [-18,18].forEach(function(dx){ cvCirc(ctx,dx,-rv,rv,'#334155',COL.dev,1.6); var ph=(slip?0:-t*3)*(dx>0?1:1); cvLine(ctx,[[dx-rv*Math.cos(ph),-rv-rv*Math.sin(ph)],[dx+rv*Math.cos(ph),-rv+rv*Math.sin(ph)]],COL.dev,1.4); });
    cvCirc(ctx,0,-rv*2-16,3,COL.grav,COL.grav,1); ctx.restore();
    arrow2(ctx,px,py-rv*2-20,px+34*Math.cos(-a),py-rv*2-20-34*Math.sin(a),COL.amber,2.4); cvText(ctx,slip?'⚠ 미끄러짐 ('+th+'° > '+q.slip.toFixed(0)+'°)':'오르는 중 ✓',12,16,slip?COL.grav:COL.ok,'bold 13px system-ui,sans-serif');
    cvText(ctx,'필요 토크 '+q.kgfcm.toFixed(2)+' kgf·cm · 전력 '+q.Pe.toFixed(1)+' W · 주행 '+q.hrun.toFixed(1)+' 시간',12,34,COL.text,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,th,rcm,S){ var hh=Math.floor(h*0.52), i; ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); var lim=c05(0,3).slip;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:40,ymin:0,ymax:3.2,ylabel:'토크 (kgf·cm)',title:'필요 토크 대 경사각',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){
      var cols=[COL.blue,COL.ok,COL.iner,COL.grav]; [2,4,6,8].forEach(function(r,k){ var Lp=[]; for(i=0;i<=40;i++) Lp.push([i,c05(i,r).kgfcm]); plotLine(ctx,P,Lp,cols[k],r===Math.round(rcm)?3:1.4,r===Math.round(rcm)?null:[4,3]); });
      plotLine(ctx,P,[[0,0.8],[40,0.8]],COL.warm,1.4,[5,4]); plotLine(ctx,P,[[lim,0],[lim,3.2]],COL.grav,1.4,[3,3]); plotPoints(ctx,P,[[th,c05(th,rcm).kgfcm]],COL.amber,6.5);
      legend(ctx,P.x0+10,P.y1+14,[['r 2 cm',cols[0]],['r 4 cm',cols[1]],['r 6 cm',cols[2]],['r 8 cm',cols[3]],['미끄럼 한계',COL.grav]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:40,ymin:0,ymax:6,xlabel:'경사각 θ (°)',ylabel:'주행 시간 (h)',title:'배터리 주행 시간',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var Lp=[]; for(i=0;i<=40;i++) Lp.push([i,c05(i,rcm).hrun]); plotLine(ctx,P,Lp,COL.ok,2.2); plotPoints(ctx,P,[[th,c05(th,rcm).hrun]],COL.amber,6.5); }); },
  kv:function(th,rcm,S){ var q=c05(th,rcm); return [['필요 토크(합계)',q.kgfcm.toFixed(2)+' kgf·cm','a'],['기계 일률',(q.Pm*1000).toFixed(0)+' mW'],['전력 / 주행 시간',q.Pe.toFixed(1)+' W / '+q.hrun.toFixed(1)+' h','g'],['미끄럼 한계 arctan μ',q.slip.toFixed(0)+'°','v2'],['오를 수 있는 턱 높이(어림)',(q.hmax*100).toFixed(1)+' cm','r']]; } };
