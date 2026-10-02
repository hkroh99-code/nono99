/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R06 ~ R10 : 도플러 · 소나 B-모드 스캐너 · 세차운동(라모어 비유) · 프레임 평균 √N · 영상 AI 평가
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R06 : 도플러 효과 ─────────────────────────────────────────────── */
function r06(v,th){ var c=343, f0=1000, ft=f0*c/(c-v*Math.cos(th*Math.PI/180)), fm=2*5e6*v*Math.cos(th*Math.PI/180)/1540; return {f:ft, df:ft-f0, med:fm}; }
(function(){
  var a=r06(3,0), b=r06(3,60), c=r06(10,0), d=r06(0.5,0);
  PROJ.R06={ id:'R06', t:'도플러 효과로 속도 재기 — 움직이는 스피커의 진동수 변화', icon:'🚗', type:'R&E · 탐구', lv:2, dur:'1 ~ 2주', cost:'약 1 ~ 2만 원',
    one:'1 kHz 소리를 내는 작은 스피커를 장난감 차(또는 줄에 매단 추)에 실어 일정한 속도로 스마트폰 마이크 앞을 지나가게 하고 주파수 분석 앱으로 진동수 변화를 잰다. $f\'=f_0c/(c-v\\cos\\theta)$ 와 비교하고 초음파 도플러(혈류)와 연결한다.',
    q:'움직이는 음원의 진동수는 속도와 각도에 따라 얼마나 변할까? 이 변화로 속도를 거꾸로 구할 수 있을까?',
    why:'도플러 초음파는 혈구가 반사하는 소리의 진동수 변화로 <b>혈류 속도와 방향</b>을 알려 줍니다. 일상의 소리(구급차 사이렌)로 같은 원리를 정량적으로 확인합니다. 진동수 이동이 가청 범위라는 점이 신기합니다.',
    link:'원리③ 초음파(4번 탭: 도플러 $\\Delta f=2f_0v\\cos\\theta/c$) · 교과서 도플러 효과 · 파동의 속력.',
    fig:FIGS.R06.fig, tg:FIGS.R06.tg,
    cap:'스피커(왼쪽)를 실은 수레가 마이크(가운데)를 지나가고 스마트폰(오른쪽)이 진동수를 기록한다. 식 $\\Delta f=f_0v/(c-v)$ (왼쪽 아래) · 속도–진동수 그래프(가운데 아래) · 앱 기록(오른쪽 아래)',
    parts:[['음원','스피커 + 1 kHz 사인파 앱','순수한 단일 진동수','소리가 순수할수록 진동수 읽기가 쉽다. 사인파 생성 앱을 쓴다.'],
           ['이동 장치','장난감 차 · 레일 · 줄 진자','속도를 알 수 있게 구간 시간 측정','구간(1 m)을 통과한 시간으로 $v=L/t$ 를 구한다. 0.5 ~ 3 m/s 정도가 적당.'],
           ['마이크 · 분석 앱','스마트폰 + 스펙트럼 앱','FFT 로 진동수 읽기','접근 시 · 멀어질 때 두 값을 모두 기록해 차이를 구한다.'],
           ['이론식','$f\'=f_0\\dfrac{c}{c-v\\cos\\theta}$','접근 +, 멀어짐 −','가까워지면 높아지고 멀어지면 낮아진다. 정확한 c 는 기온으로 보정.'],
           ['데이터 표','속도 · 접근 f · 이탈 f','5 가지 속도 · 3 회씩','속도와 진동수 차이의 직선 관계를 확인한다.'],
           ['안전','회전 · 진자 반경 밖 통제','충돌 · 줄 풀림 방지','빠르게 움직이는 물체에 사람이 맞지 않도록 구역을 정한다.']],
    budget:[['스피커(작은)','1','약 5천 원','—'],['장난감 차 · 레일','1','약 5천 원','줄 진자'],['스마트폰 · 스펙트럼 앱','1','무료','—'],['스톱워치 · 줄자','1','보유','—'],['사인파 생성 앱','1','무료','—']],
    steps:['정지 상태 스피커의 소리가 정확히 1000 Hz 로 읽히는지 확인한다.','수레가 마이크 쪽으로 다가올 때와 멀어질 때의 진동수를 각각 기록한다(속도마다 3 회).','1 m 구간 통과 시간으로 속도 $v$ 를 구하고 이론 $\\Delta f$ 를 계산한다.','$\\Delta f$ 대 $v$ 그래프를 그려 기울기가 $f_0/c$ 근처인지 확인한다(작은 속도에서는 거의 직선).','각도 $\\theta$ 를 바꾸어(수레가 비스듬히 지나감) $\\cos\\theta$ 의 영향을 확인한다.'],
    vars:['이동 속도 v · 각도 θ','진동수 변화 $\\Delta f$','음원 진동수 · 기온 · 마이크 위치'],
    predict:[['v = 3 m/s · θ = 0°','$f\'$ = '+fx(a.f,1)+' Hz ($\\Delta f$ +'+fx(a.df,1)+')','접근하면 진동수 상승'],
             ['v = 3 m/s · θ = 60°','$\\Delta f$ = '+fx(b.df,1)+' Hz','각도가 크면 속도 성분 $v\\cos\\theta$ 가 작다'],
             ['v = 10 m/s · θ = 0°','$\\Delta f$ = '+fx(c.df,1)+' Hz (약 +'+fx(c.df/10,1)+'%)','속도 약 36 km/h 에서 약 3 % 이동'],
             ['v = 0.5 m/s · 초음파 5 MHz(혈류 반사)','$\\Delta f$ = '+fx(d.med,0)+' Hz','반사 도플러는 2 배($2f_0v/c$)']],
    data:{cols:['v (m/s)','접근 f (Hz)','이탈 f (Hz)','이론 Δf (Hz)','측정 Δf'],
          rows:[0.5,1,2,3,5,10].map(function(v){ var a1=r06(v,0).f, a2=1000*343/(343+v); return [v,fx(a1,1),fx(a2,1),fx(a1-1000,1),fx((a1-a2)/2,1)]; })},
    analysis:'접근 · 이탈 진동수의 차이 $f_a-f_r\\approx2f_0v/c$ 를 속도에 대해 그려 직선의 기울기에서 $c$ 를 구한다(속도가 작을 때 근사). 불확실성은 주파수 분석 앱의 분해능(약 1 Hz)과 속도 측정 오차에서 온다.',
    special:['🎓 연구 설계',[['연구 질문','도플러 이동은 속도에 비례하는가? 각도에 따라 어떻게 변하는가?'],['가설','$\\Delta f\\approx f_0v\\cos\\theta/c$'],['통제 변인','음원 진동수 · 마이크 위치 · 기온'],['분석','Δf–v 회귀 · 기울기 → c'],['한계','속도 측정 오차 · 스펙트럼 분해능 · 반사음']]],
    fails:[['진동수가 안정적으로 읽히지 않는다','FFT 창 길이를 늘리고 주변 소음 제거'],['접근 · 이탈이 구분 안 된다','마이크 위치를 정해진 점으로 고정, 영상으로 통과 시점 표시'],['속도 값이 틀린다','구간 통과 시간을 영상(프레임)으로 측정']],
    up:['<b>R04</b> — 음속을 정확히 구해 도플러 식에 넣기.','<b>R07</b> — 방향까지 지도화.','<b>종합</b> — 컬러 도플러 영상 개념 정리.'],
    next:['원리③ 초음파',4],
    eval:[['측정','접근 · 이탈 모두 · 3 회 반복'],['분석','직선 회귀 · 불확실성'],['연결','초음파 도플러(혈류)와의 연결'],['안전','속도 · 구역 통제']],
    tip:'수레의 영상 + 주파수 그래프를 한 화면에 놓고 「소리가 높아졌다 낮아지는 순간」을 보여 주세요.' };
})();
SIMS.R06={ q:'음원의 속도와 진행 각도를 바꾸면 들리는 진동수는 얼마나 달라질까? (원음 1000 Hz)',
  a:{nm:'음원 속도 v',min:0.5,max:10,step:0.5,val:3,unit:'m/s',d:1}, b:{nm:'진행 각도 θ',min:0,max:80,step:5,val:0,unit:'°',d:0},
  cap1:'오른쪽으로 움직이는 음원과 파면(원). 앞쪽은 촘촘하고 뒤쪽은 성깁니다(속도는 보이도록 과장).',
  cap2:'📊 속도 대 진동수 이동 Δf (각도 0 · 30 · 60°) · 점 = 지금.',
  note:'모형 : 음원 이동 $f\'=f_0c/(c-v\\cos\\theta)$, $c=343$ m/s, $f_0=1000$ Hz. 아래 칸의 초음파는 반사 도플러 $2f_0v\\cos\\theta/c$ (5 MHz · c 1540 m/s). 화면의 이동 속도는 파면이 보이도록 15 배 과장했습니다.',
  anim:function(ctx,w,h,t,v,th,S){ var q=r06(v,th), cy=h/2, cpx=110, vpx=cpx*Math.min(0.55,v*15/343), x0=30, i, te; skyBg(ctx,w,h); var tt=t, xs=x0+((vpx*tt)%(w-100));
    for(i=0;i<40;i++){ te=tt-i*0.16; if(te<0) break; var r=cpx*(tt-te), xe=x0+((vpx*te)%(w-100)); if(xe>xs+1) continue; ctx.strokeStyle='rgba(125,211,252,'+Math.max(0.1,1-r/260)+')'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.arc(xe,cy,Math.max(r,1),0,6.2832); ctx.stroke(); }
    cvRect(ctx,xs-12,cy-9,24,18,COL.metal||'#475569',COL.dev,1.2); cvCirc(ctx,xs,cy,5,COL.plotbg,COL.amber,1.4); cvLine(ctx,[[xs+16,cy],[xs+36,cy]],COL.amber,2); cvText(ctx,'v '+v.toFixed(1)+' m/s',xs,cy-20,COL.amber,'bold 11px system-ui,sans-serif','center');
    cvRect(ctx,w-40,cy-14,10,28,COL.dim,COL.dev,1); cvText(ctx,'마이크',w-35,cy+30,COL.tick,'10.5px system-ui,sans-serif','center');
    cvText(ctx,'관측 진동수 '+q.f.toFixed(1)+' Hz (원음 1000 · 이동 +'+q.df.toFixed(1)+' Hz) — 앞쪽(오른쪽)은 높고 뒤쪽은 낮다',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,v,th,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:10,ymin:0,ymax:50,xlabel:'음원 속도 v (m/s)',ylabel:'진동수 이동 Δf (Hz)',title:'Δf 대 v — 거의 직선, 각도가 크면 기울기가 작다',left:56,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}), vs=[], i; for(i=0;i<=20;i++) vs.push(i*0.5);
    [[0,COL.blue],[30,COL.ok],[60,COL.violet||COL.amber]].forEach(function(q){ plotLine(ctx,P,vs.map(function(x){ return [x,r06(Math.max(x,0.01),q[0]).df]; }),q[1],1.8); }); plotPoints(ctx,P,[[v,r06(v,th).df]],COL.amber,7); legend(ctx,P.x1-120,P.y1+14,[['θ 0°',COL.blue],['θ 30°',COL.ok],['θ 60°',COL.violet||COL.amber],['지금',COL.amber]]); },
  kv:function(v,th,S){ var q=r06(v,th); return [['관측 진동수',q.f.toFixed(1)+' Hz','a'],['이동 Δf',q.df.toFixed(1)+' Hz','g'],['근사 f₀v cosθ/c',(1000*v*Math.cos(th*Math.PI/180)/343).toFixed(1)+' Hz'],['초음파 5 MHz Δf',q.med.toFixed(0)+' Hz','v2'],['들리는 범위',q.med>20?'가청(소리로 들림)':'—','r']]; } };

/* ── R07 : 공기 초음파 B-모드(소나) 스캐너 ─────────────────────────── */
var R07S={ post:{x:-0.5,y:1.1,r:0.04}, box:{x1:0.4,x2:0.8,y1:1.25,y2:1.55}, wallY:2.4, sideX:1.5 };
function r07ray(phi){ var dx=Math.sin(phi*Math.PI/180), dy=Math.cos(phi*Math.PI/180), best=9, p=R07S.post, b=R07S.box, tt, ox, oy, a, bb, c, disc;
  a=1; bb=-2*(p.x*dx+p.y*dy); c=p.x*p.x+p.y*p.y-p.r*p.r; disc=bb*bb-4*a*c; if(disc>=0){ tt=(-bb-Math.sqrt(disc))/2; if(tt>0&&tt<best) best=tt; }
  [[b.x1,'x'],[b.x2,'x']].forEach(function(e){ if(Math.abs(dx)>1e-9){ tt=e[0]/dx; var yy=tt*dy; if(tt>0&&yy>=b.y1&&yy<=b.y2&&tt<best) best=tt; } });
  [[b.y1],[b.y2]].forEach(function(e){ if(Math.abs(dy)>1e-9){ tt=e[0]/dy; var xx=tt*dx; if(tt>0&&xx>=b.x1&&xx<=b.x2&&tt<best) best=tt; } });
  tt=R07S.wallY/dy; if(dy>1e-9 && tt<best && Math.abs(tt*dx)<=R07S.sideX) best=tt; var sx=(dx>0?R07S.sideX:-R07S.sideX)/dx; if(dx!==0&&sx>0&&sx<best) best=sx; return Math.min(best,4); }
function r07(step,bw){ var out=[], th, k, truth=[], err=0, n=0; for(th=-50;th<=50;th+=1) truth.push([th,r07ray(th)]);
  for(th=-50;th<=50.001;th+=step){ var m=9, kk; for(kk=th-bw/2;kk<=th+bw/2+1e-9;kk+=1) m=Math.min(m,r07ray(kk)); out.push([th,m]); }
  truth.forEach(function(q){ var near=out.reduce(function(a,b){ return Math.abs(b[0]-q[0])<Math.abs(a[0]-q[0])? b : a; }); err+=Math.pow(near[1]-q[1],2); n++; });
  var postPhi=Math.atan2(R07S.post.x,R07S.post.y)*180/Math.PI, det=out.filter(function(o){ return Math.abs(o[0]-postPhi)<=bw/2+2.5 && o[1]<1.3; }), width=det.length*step;
  return {pts:out, truth:truth, rmse:Math.sqrt(err/n), postSeen:det.length>0, postW:width, postPhi:postPhi}; }
(function(){
  var a=r07(3,10), b=r07(10,5), c=r07(3,25), d=r07(1,5);
  PROJ.R07={ id:'R07', t:'공기 초음파 스캐너 — 서보 + 초음파 센서로 만드는 B-모드 흉내 거리 지도', icon:'📡', type:'R&E · 탐구', lv:3, dur:'3 ~ 4주', cost:'약 2 ~ 3만 원',
    one:'서보 모터에 HC-SR04 센서를 달아 각도를 1 ~ 10° 씩 훑으며 각 방향의 거리를 재고 극좌표 지도를 그린다. 각도 간격 · 빔폭에 따라 작은 물체가 보이는지, 넓게 번지는지 확인해 초음파 영상의 가로 해상도를 체험한다.',
    q:'스캔 각도 간격과 센서 빔폭이 지도의 해상도를 어떻게 정할까? 작은 기둥은 언제 보이고 언제 사라질까?',
    why:'B-모드 영상은 <b>빔 방향마다 얻은 거리(에코 시간)를 쌓아 만든 지도</b>입니다. 센서 하나로 같은 일을 해 보면 「왜 가로 해상도가 빔 폭으로 정해지는지」를 몸으로 이해합니다.',
    link:'원리③ 초음파(4번 탭) · R04 · 극좌표 · 삼각함수 · 아두이노 서보 제어.',
    fig:FIGS.R07.fig, tg:FIGS.R07.tg,
    cap:'서보에 달린 초음파 센서(왼쪽)가 부채꼴(가운데)로 훑고, 거리 지도가 화면(오른쪽)에 그려진다. 각도 간격 · 빔폭(왼쪽 아래) → 거리 지도(가운데 아래) → 아두이노(오른쪽 아래)',
    parts:[['서보 + 센서','SG90 서보 · HC-SR04','−45° ~ +45° 스캔','서보 한 스텝마다 충분히 멈춘 뒤 측정한다. 진동이 가라앉아야 한다.'],
           ['빔 폭','HC-SR04 약 15° 안팎(제품 사양 확인)','넓을수록 작은 물체가 번짐','실측: 작은 막대를 앞에서 옆으로 옮기며 감지가 사라지는 각도로 빔폭을 잰다.'],
           ['환경','상자 · 막대 · 벽','바닥에 위치를 미리 표시','참 위치를 알아야 오차를 낸다. 소리가 흡수되는 천 · 스펀지 물체는 약하게 반사.'],
           ['각도 스텝','1 ~ 10°','작을수록 촘촘 · 시간 ↑','스텝이 빔폭보다 작으면 이웃 빔이 겹친다(과표본).'],
           ['지도 그리기','극좌표 → (x, y)','$x=d\\sin\\theta$ · $y=d\\cos\\theta$','파이썬 matplotlib 또는 처리(Processing)로 실시간 그린다.'],
           ['제어기','아두이노 · 시리얼 전송','각도 · 거리 CSV','통신 속도 115200. 각도와 거리를 한 줄로 보낸다.']],
    budget:[['HC-SR04 센서','1','약 2천 원','—'],['SG90 서보','1','약 3천 원','—'],['아두이노 나노','1','약 5천 원','—'],['상자 · 막대(표적)','1 세트','약 2천 원','—'],['브라켓 · 케이블','1 세트','약 5천 원','3D 프린트']],
    steps:['센서를 서보에 고정하고 −45° ~ +45° 를 5° 씩 훑는 코드를 만들어 각도–거리 CSV 를 저장한다.','빈 방에서 벽만 스캔해 잡음 수준(거리 표준편차)을 잰다.','상자 · 가는 막대를 두고 스캔해 지도에서 위치 · 크기가 맞는지 확인한다.','각도 간격 1 · 3 · 5 · 10° 로 바꾸어 같은 물체의 보임을 비교한다. 막대와 센서 사이에 거리를 달리해 최소 감지 폭을 잰다.','지도를 필터링(이동 중앙값)해 잡음과 해상도의 거래를 논의한다.'],
    vars:['각도 간격 · 빔폭(센서 · 마스크)','물체의 감지 여부 · 외관 폭 · 지도 오차','표적 재질 · 거리 · 서보 정지 시간'],
    predict:[['간격 3° · 빔폭 10°','지도 오차 RMSE '+fx(a.rmse,2)+' m · 막대 '+(a.postSeen?'감지':'놓침')+' · 외관 폭 '+fx(a.postW,0)+'°','빔폭이 이웃 빔과 겹쳐 작은 물체가 퍼져 보임'],
             ['간격 10° · 빔폭 5°','RMSE '+fx(b.rmse,2)+' m · 막대 '+(b.postSeen?'감지':'<b>놓칠 수 있음</b>'),'간격이 빔폭보다 크면 사이가 비어 물체를 놓친다'],
             ['간격 3° · 빔폭 25°','RMSE '+fx(c.rmse,2)+' m · 막대 외관 폭 '+fx(c.postW,0)+'°','빔이 넓으면 지도가 번져 해상도가 크게 떨어진다'],
             ['간격 1° · 빔폭 5°','RMSE '+fx(d.rmse,2)+' m · 외관 폭 '+fx(d.postW,0)+'°','좁은 빔 · 촘촘한 스텝이 가장 선명(시간은 길다)']],
    data:{cols:['간격 (°)','빔폭 (°)','지도 오차 RMSE (m)','작은 막대','외관 폭 (°)'],
          rows:[[1,5],[3,5],[3,10],[5,10],[10,5],[3,25]].map(function(q){ var r=r07(q[0],q[1]); return [q[0],q[1],fx(r.rmse,2),r.postSeen?'감지':'놓침',fx(r.postW,0)]; })},
    analysis:'각도 간격 · 빔폭 대 지도 오차(RMSE)와 작은 물체의 외관 폭을 표로 만든다. 가로 해상도 $\\approx d\\times$(빔폭 라디안)이며 거리 $d$ 에 비례해 나빠짐을 확인한다(초음파 영상의 가로 해상도 $\\lambda F/D$ 와 같은 구조).',
    special:['🎓 연구 설계',[['연구 질문','스캔 간격과 빔폭이 거리 지도의 해상도와 물체 감지를 어떻게 정하는가?'],['가설','간격 > 빔폭이면 작은 물체를 놓치고, 빔폭이 넓으면 물체가 폭 $\\approx$ 빔폭으로 번진다.'],['통제 변인','표적 위치 · 재질 · 센서 높이'],['분석','RMSE · 외관 폭 · 감지율'],['한계','센서 빔이 이상적인 부채꼴이 아님 · 다중 반사']]],
    fails:[['서보가 움직이는 동안 측정이 튄다','각 스텝에서 100 ms 정지 후 3 회 중앙값'],['먼 벽이 안 잡힌다','반사가 비스듬하면 약해짐 — 표면 수직 · 거리 제한'],['지도가 좌우 반전','각도 부호와 서보 방향 확인']],
    up:['<b>R04 · R05</b> — 음속 보정 · 재질별 반사 세기를 지도 밝기로.','<b>I07</b> — 탐촉자 압력 · 각도 가이드.','<b>C03</b> — 지도를 소리로.'],
    next:['원리③ 초음파',4],
    eval:[['구현','스캔 · 지도 그리기 동작'],['분석','간격 · 빔폭 대 해상도 표'],['이해','B-모드와의 대응'],['한계','센서 빔 · 다중 반사 논의']],
    tip:'극좌표 지도 위에 참 위치(점)를 겹쳐 그려 「번짐」을 한눈에 보여 주는 그림이 효과적입니다.' };
})();
SIMS.R07={ q:'스캔 간격과 빔폭을 바꾸면 거리 지도에서 작은 기둥과 상자는 어떻게 보일까?',
  a:{nm:'각도 간격',min:1,max:10,step:1,val:3,unit:'°',d:0}, b:{nm:'빔폭',min:3,max:30,step:1,val:12,unit:'°',d:0},
  cap1:'위에서 본 방(점선 = 참 윤곽)과 스캔 결과(점). 서보가 부채꼴로 훑을수록 점이 쌓입니다. 작은 기둥은 빔이 넓으면 번지고 간격이 크면 놓칩니다.',
  cap2:'📊 방향(각도)별 측정 거리(계단선) 대 참 거리(흰 선). 빔폭만큼 물체가 옆으로 퍼진 모양을 보세요.',
  note:'모형 : 센서는 원점에서 +y 를 보며 −50° ~ +50° 를 훑는다. 각 빔은 폭 안(1° 간격)에서 가장 가까운 반사까지의 거리를 돌려준다. 물체 : 기둥(반지름 4 cm) · 상자(40×30 cm) · 앞벽 · 옆벽. 이상적인 부채꼴 빔 모형이며 다중 반사 · 재질은 무시.',
  anim:function(ctx,w,h,t,st,bw,S){ var r=r07(st,bw), sc=Math.min((w-30)/3.2,(h-40)/2.7), ox=w/2, oy=h-24, k=Math.max(1,Math.ceil(Math.min(1,t/8)*r.pts.length)), i; ctx.fillStyle=COL.plotbg; ctx.fillRect(6,6,w-12,h-12);
    function px(x,y){ return [ox+x*sc, oy-y*sc]; } var p, b=R07S.box; cvLine(ctx,[px(-1.5,0.1),px(-1.5,2.4),px(1.5,2.4),px(1.5,0.1)],COL.dim,1.2,[4,3]); cvLine(ctx,[px(b.x1,b.y1),px(b.x2,b.y1),px(b.x2,b.y2),px(b.x1,b.y2),px(b.x1,b.y1)],COL.dim,1.2,[4,3]); p=px(R07S.post.x,R07S.post.y); cvCirc(ctx,p[0],p[1],Math.max(2,R07S.post.r*sc),null,COL.dim,1.2);
    var cur=r.pts[k-1], a=cur[0]*Math.PI/180; cvLine(ctx,[[ox,oy],[ox+Math.sin(a)*3*sc,oy-Math.cos(a)*3*sc]],COL.amber,1.2,[3,3]); cvLine(ctx,[[ox,oy],[ox+Math.sin(a-bw*Math.PI/360)*2.5*sc,oy-Math.cos(a-bw*Math.PI/360)*2.5*sc]],'rgba(251,191,36,.35)',1); cvLine(ctx,[[ox,oy],[ox+Math.sin(a+bw*Math.PI/360)*2.5*sc,oy-Math.cos(a+bw*Math.PI/360)*2.5*sc]],'rgba(251,191,36,.35)',1);
    for(i=0;i<k;i++){ var q=r.pts[i], aa=q[0]*Math.PI/180, pp=px(q[1]*Math.sin(aa),q[1]*Math.cos(aa)); cvCirc(ctx,pp[0],pp[1],2.6,COL.ok,null,0); } cvCirc(ctx,ox,oy,6,COL.amber,null,0);
    cvText(ctx,'간격 '+st+'° · 빔폭 '+bw+'° · 기둥 '+(r.postSeen?'감지(외관 폭 '+r.postW.toFixed(0)+'°)':'놓침'),12,16,r.postSeen?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,st,bw,S){ var r=r07(st,bw), P=makePlot(ctx,w,h,{xmin:-50,xmax:50,ymin:0,ymax:3,xlabel:'방향 각도 (°)',ylabel:'거리 (m)',title:'각도별 측정 거리 — 기둥은 빔폭만큼 번진다',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}), i, pts=[]; r.pts.forEach(function(q,k){ pts.push([q[0]-st/2,q[1]]); pts.push([q[0]+st/2,q[1]]); });
    plotLine(ctx,P,r.truth.map(function(q){ return [q[0],Math.min(3,q[1])]; }),COL.white,1.4,[4,3]); plotLine(ctx,P,pts.map(function(q){ return [q[0],Math.min(3,q[1])]; }),COL.blue,2); plotPoints(ctx,P,r.pts.map(function(q){ return [q[0],Math.min(3,q[1])]; }),COL.amber,3); legend(ctx,P.x1-130,P.y1+14,[['참 거리',COL.white],['측정(계단)',COL.blue],['빔 중심',COL.amber]]); },
  kv:function(st,bw,S){ var r=r07(st,bw); return [['지도 오차 RMSE',r.rmse.toFixed(2)+' m','a'],['빔 겹침 bw/간격',(bw/st).toFixed(1)+' 배'],['작은 기둥',r.postSeen?'✅ 감지':'❌ 놓침','g'],['기둥 외관 폭',r.postW.toFixed(0)+' ° (참값 약 4°)','v2'],['1 m 거리 가로 해상도 ≈',(Math.PI/180*bw*100).toFixed(0)+' cm','r']]; } };

/* ── R08 : 세차운동 — 라모어 진동수의 비유 ──────────────────────────── */
function r08(rpm,rc){ var w=2*Math.PI*rpm/60, Om=0.8*9.8*(rc/100)/(0.08*w), Tp=2*Math.PI/Om; return {w:w, Om:Om, Tp:Tp, L:0.08*w}; }
(function(){
  var a=r08(600,15), b=r08(1200,15), c=r08(600,25), d=r08(300,10);
  PROJ.R08={ id:'R08', t:'세차운동과 라모어 진동수의 비유 — 자전거 바퀴로 확인하는 Ω = τ/L', icon:'🌀', type:'R&E · 탐구', lv:2, dur:'1 ~ 2주', cost:'약 1 ~ 2만 원',
    one:'자전거 바퀴(또는 자이로)를 돌리고 한쪽 끝을 줄에 매달아 세차 주기를 잰다. 회전 속도가 빠를수록 세차가 느려지는지(Ω ∝ 1/ω)를 확인하고, MRI 에서 핵 스핀의 세차 진동수 $f=\\gamma B$ 와 비교해 비슷한 점과 다른 점을 정리한다.',
    q:'바퀴의 회전을 빠르게 하면 세차운동은 빨라질까, 느려질까? 이는 MRI 핵 스핀의 세차와 어떻게 닮았을까?',
    why:'MRI 신호는 자기장 속에서 <b>세차하는 핵 스핀</b>에서 나옵니다. 세차는 직관과 달라서(쓰러지는 대신 돌아간다) 손으로 직접 느끼면 훨씬 이해가 쉽습니다. 「토크 / 각운동량」과 「$\\gamma B$」의 닮은 구조를 확인합니다.',
    link:'원리④ MRI(5번 탭) · 각운동량 · 토크 · 교과서 회전 운동(대학 연계) · 전자기.',
    fig:FIGS.R08.fig, tg:FIGS.R08.tg,
    cap:'회전하는 바퀴(왼쪽)를 한쪽 끝에서 줄로 지지한다. 추의 위치(가운데)로 토크를 바꾸고 원뿔을 그리는 세차(오른쪽). 식 $\\Omega=mgr/(I\\omega)$ (왼쪽 아래) · Ω–회전 그래프(가운데 아래) · 라모어 비유(오른쪽 아래)',
    parts:[['회전하는 바퀴','자전거 바퀴 · 축 손잡이','회전 속도 ω 를 바꾼다','손으로 돌려 일정한 속도를 만들기 어렵다 — 전동 드릴로 돌려 속도를 일정하게 한다(안전 주의).'],
           ['토크 조절','추 위치 r · 질량 m','$\\tau=mgr$','추를 축 끝에 달아 팔 길이를 바꾼다.'],
           ['지지점','천장 줄 · 베어링 걸이','한쪽 끝만 지지','지지점이 흔들리면 세차가 흐트러진다. 튼튼히 고정.'],
           ['측정','영상 · 스톱워치 · 각도 표시','세차 한 바퀴 시간 $T_p$','영상으로 1 ~ 2 바퀴 시간을 잰다. 회전 속도는 앱 · 스트로보로.'],
           ['이론 비교','$\\Omega=\\dfrac{mgr}{I\\omega}$','I 는 바퀴 질량 분포','I 를 모르면 한 점에서 측정해 보정 상수로 쓴다.'],
           ['안전','회전체 접촉 금지 · 보호구','손 · 얼굴 보호','빠르게 도는 바퀴에 손이 닿지 않도록 구역을 두고 안경을 쓴다.']],
    budget:[['자전거 바퀴(중고)','1','약 5천 원','자이로 팽이'],['줄 · 걸이 · 추','1 세트','약 5천 원','—'],['스마트폰(슬로모션)','1','보유','—'],['스톱워치 · 자','1','보유','—'],['전동 드릴(교사 감독)','1','보유','손 돌리기']],
    steps:['바퀴를 축 양 끝으로 잡고 돌려 한쪽 끝을 줄에 매단다. 쓰러지지 않고 천천히 도는 세차를 확인한다.','회전 속도를 약 3 단계(느림 · 보통 · 빠름)로 바꾸며 세차 한 바퀴 시간 $T_p$ 를 재고 회전수(rpm)를 함께 기록한다.','추의 위치 $r$ 를 바꾸어 같은 회전에서 $T_p$ 의 변화를 잰다.','$\\Omega=2\\pi/T_p$ 대 $1/\\omega$ 그래프를 그려 원점을 지나는 직선인지 확인한다.','MRI 와 비교 : $\\Omega=\\tau/L$ 와 $\\omega_L=\\gamma B$ 의 대응표를 만든다.'],
    vars:['회전 속도 ω · 추 위치 r','세차 속도 Ω · 주기 $T_p$','바퀴 질량 · 지지점 마찰 · 추 질량'],
    predict:[['600 rpm · r = 15 cm','$\\Omega$ = '+fx(a.Om,3)+' rad/s ($T_p$ '+fx(a.Tp,0)+' s)','$\\Omega=mgr/(I\\omega)$'],
             ['1200 rpm(2 배) · r = 15 cm','$\\Omega$ = '+fx(b.Om,3)+' rad/s (½ 배)','회전이 빠를수록 세차는 느리다'],
             ['600 rpm · r = 25 cm','$\\Omega$ = '+fx(c.Om,3)+' (1.7 배)','토크가 크면 세차가 빠르다'],
             ['300 rpm · r = 10 cm','$\\Omega$ = '+fx(d.Om,3)+' rad/s ($T_p$ '+fx(d.Tp,0)+' s)','너무 느리면 쓰러진다(요동)']],
    data:{cols:['회전 (rpm)','r (cm)','ω (rad/s)','Ω 이론 (rad/s)','Tp 이론 (s)'],
          rows:[[300,15],[600,15],[900,15],[1200,15],[600,10],[600,25]].map(function(q){ var r=r08(q[0],q[1]); return [q[0],q[1],fx(r.w,0),fx(r.Om,3),fx(r.Tp,0)]; })},
    analysis:'$\\Omega$ 대 $1/\\omega$ 가 원점을 지나는 직선인지 확인하고 기울기 $mgr/I$ 에서 바퀴의 관성 모멘트 $I$ 를 구한다. 비유 : 세차 속도 $\\Omega\\leftrightarrow$ 라모어 진동수 $\\omega_L=\\gamma B$; 토크 $\\leftrightarrow$ 자기장 $B$; 각운동량 $L\\leftrightarrow$ 핵 스핀. 차이점 : MRI 의 세차 진동수는 스핀의 크기(회전 속도)와 무관하고 $B$ 에만 비례한다.',
    special:['🎓 연구 설계',[['연구 질문','세차 속도는 회전 속도에 반비례하고 토크에 비례하는가?'],['가설','$\\Omega=\\dfrac{mgr}{I\\omega}$'],['통제 변인','지지점 · 바퀴 · 추 질량'],['분석','Ω–1/ω 직선 · 기울기에서 I'],['한계','마찰로 회전이 줄어듦(시간 의존) · 장동(nutation)']]],
    fails:[['바퀴가 빨리 느려진다(마찰)','측정을 몇 초 안에 끝내고 회전 속도를 시작과 끝에 기록'],['세차 대신 흔들린다','회전을 더 빠르게 · 지지점 마찰 줄이기'],['주기를 정확히 못 잰다','영상을 슬로모션으로 두고 한 바퀴를 프레임으로 센다']],
    up:['<b>5번 탭</b> — 라모어 진동수 · 공명 시뮬레이션.','<b>종합</b> — MRI TR · TE 대조 영상.','<b>C04</b> — 자기장 안전 전시.'],
    next:['원리④ MRI',5],
    eval:[['측정','회전 속도 · 세차 주기 반복'],['분석','Ω–1/ω 직선과 I 추정'],['비유','MRI 와의 대응 표'],['안전','회전체 안전 수칙']],
    tip:'자이로 영상 + 「Ω–1/ω 직선」 + 「f=γB 직선」을 나란히 보여 주는 3 단 그림이 발표의 핵심입니다.' };
})();
SIMS.R08={ q:'바퀴의 회전 속도와 추 위치를 바꾸면 세차 속도(원뿔을 그리며 도는 속도)는 어떻게 달라질까?',
  a:{nm:'바퀴 회전 속도',min:200,max:1500,step:50,val:600,unit:'rpm',d:0}, b:{nm:'추 위치(토크 팔)',min:5,max:30,step:1,val:15,unit:'cm',d:0},
  cap1:'위에서 본 바퀴 축(막대)이 세차하며 원을 그립니다(세차 속도 4 배 가속). 빠르게 돌수록 더 천천히 돕니다.',
  cap2:'📊 위 : 회전 속도 대 세차 속도 Ω (r 10 · 15 · 25 cm, 곡선 ∝ 1/ω) · 아래 : MRI 비유 — 라모어 진동수 f = γB (직선).',
  note:'모형 : $\\Omega=mgr/(I\\omega)$, m = 0.8 kg, I = 0.08 kg·m²(자전거 바퀴 어림), 정상 세차(장동 무시). 라모어 진동수 $f=\\gamma B$ 는 수소 핵 42.58 MHz/T. 화면의 회전은 보이도록 느리게 표시.',
  anim:function(ctx,w,h,t,rpm,rc,S){ var q=r08(rpm,rc), cx=w*0.4, cy=h/2+4, R=Math.min(w,h)*0.32, ph=q.Om*t*4, i; skyBg(ctx,w,h); cvCirc(ctx,cx,cy,R,null,COL.dim,1.2); cvLine(ctx,[[cx-R-14,cy],[cx+R+14,cy]],COL.dim,1,[3,4]); cvLine(ctx,[[cx,cy-R-14],[cx,cy+R+14]],COL.dim,1,[3,4]);
    var ex=cx+R*Math.cos(ph), ey=cy-R*Math.sin(ph)*0.45; cvLine(ctx,[[cx,cy],[ex,ey]],COL.amber,4); cvCirc(ctx,ex,ey,18,'rgba(148,163,184,.25)',COL.metal||'#cbd5e1',2); var sp=q.w*t*0.02; for(i=0;i<6;i++){ var a=sp+i*Math.PI/3; cvLine(ctx,[[ex,ey],[ex+16*Math.cos(a),ey+7*Math.sin(a)]],COL.ok,1.4); }
    cvCirc(ctx,cx,cy,4,COL.text,null,0); cvText(ctx,'세차 Ω = '+q.Om.toFixed(3)+' rad/s · 주기 '+q.Tp.toFixed(1)+' s',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'회전 '+rpm+' rpm · 토크 팔 '+rc+' cm',12,h-12,COL.tick,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,rpm,rc,S){ var hh=Math.floor(h/2), rs=[], i; for(i=200;i<=1500;i+=50) rs.push(i);
    subPlot(ctx,0,0,w,hh,{xmin:200,xmax:1500,ymin:0,ymax:1.2,ylabel:'세차 Ω (rad/s)',title:'세차 속도 Ω 대 회전 속도 ω (∝ 1/ω)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ [10,15,25].forEach(function(r,k){ plotLine(ctx,P,rs.map(function(x){ return [x,Math.min(1.2,r08(x,r).Om)]; }),[COL.blue,COL.ok,COL.violet||COL.amber][k],1.8); }); plotPoints(ctx,P,[[rpm,Math.min(1.2,r08(rpm,rc).Om)]],COL.amber,6.5); legend(ctx,P.x1-100,P.y1+14,[['r 10',COL.blue],['r 15',COL.ok],['r 25',COL.violet||COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:7,ymin:0,ymax:300,xlabel:'자기장 B (T)',ylabel:'라모어 f (MHz)',title:'MRI 의 세차 : f = γB (자기장에 정비례)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,[[0,0],[7,7*SUBJ.gamma]],COL.blue,2); plotPoints(ctx,P,[[1.5,1.5*SUBJ.gamma],[3,3*SUBJ.gamma],[7,7*SUBJ.gamma]],COL.amber,5); cvText(ctx,'1.5 T → '+(1.5*SUBJ.gamma).toFixed(1)+' MHz · 3 T → '+(3*SUBJ.gamma).toFixed(1)+' MHz',P.x1-6,P.y1+14,COL.tick,'10.5px system-ui,sans-serif','right'); }); },
  kv:function(rpm,rc,S){ var q=r08(rpm,rc); return [['세차 속도 Ω',q.Om.toFixed(3)+' rad/s','a'],['세차 주기 Tp',q.Tp.toFixed(1)+' s','g'],['각운동량 L=Iω',q.L.toFixed(2)+' kg·m²/s','v2'],['토크 τ = mgr',(0.8*9.8*rc/100).toFixed(2)+' N·m'],['수소 라모어(1.5 T)',(1.5*SUBJ.gamma).toFixed(1)+' MHz','r']]; } };

/* ── R09 : 프레임 평균과 √N 잡음 법칙 ───────────────────────────────── */
var R09 = { N:64, LB:null, HU:null, FR:null, seed:-1 };
(function(){ R09.LB=makeHead(R09.N); R09.HU=huMap(R09.LB); })();
function r09frames(seed){ if(R09.seed===seed) return R09.FR; var r=rng32(seed*77+5), FR=[], k, i; for(k=0;k<64;k++){ var f=new Float32Array(R09.N*R09.N); for(i=0;i<f.length;i++) f[i]=gaussR(r); FR.push(f); } R09.FR=FR; R09.seed=seed; return FR; }
function r09img(n,snr1,seed){ var FR=r09frames(seed), s1=35/snr1, N=R09.N, out=new Float32Array(N*N), i, k; for(k=0;k<n;k++) for(i=0;i<out.length;i++) out[i]+=FR[k][i]; for(i=0;i<out.length;i++) out[i]=R09.HU[i]+s1*out[i]/n; return out; }
function r09snr(n,snr1,seed){ var im=r09img(n,snr1,seed), v=[], i; for(i=0;i<im.length;i++) if(R09.LB[i]===4) v.push(im[i]); return 35/Math.max(1e-6,stdev(v)); }
(function(){
  var a=r09snr(1,3,1), b=r09snr(4,3,1), c=r09snr(16,3,1), d=r09snr(64,3,1);
  PROJ.R09={ id:'R09', t:'프레임 평균과 √N 잡음 법칙 — 어두운 사진을 겹쳐 선명하게', icon:'🌌', type:'R&E · 탐구', lv:2, dur:'1 ~ 2주', cost:'약 0 ~ 1만 원',
    one:'어두운 곳에서 같은 장면의 스마트폰 영상(고감도 · 잡음이 큰)을 여러 프레임 평균해 잡음(표준편차)이 $1/\\sqrt N$ 로 줄어드는지 확인한다. 의료영상에서 선량 · 평균 횟수와 화질의 관계를 이해한다.',
    q:'프레임을 4 배로 평균하면 잡음은 정말 절반이 될까? 신호 대 잡음비는 몇 장을 평균해야 목표에 도달할까?',
    why:'CT 선량 · MRI 평균 횟수(NEX) · 초음파 합성은 모두 <b>평균하면 잡음이 $1/\\sqrt N$ 로 준다</b>는 같은 법칙입니다. 비용(시간 · 선량)이 제곱으로 늘어나는 이유를 사진 몇 장으로 확인합니다.',
    link:'원리⑤ 영상 품질 · 선량(6번 탭) · 17번 탭 [종합3] · 확률 · 통계(표준편차 · 표준오차).',
    fig:FIGS.R09.fig, tg:FIGS.R09.tg,
    cap:'스마트폰(왼쪽)이 어두운 장면을 연속 촬영한다. 한 장(가운데)은 잡음이 많고 N 장을 평균한 영상(오른쪽)은 깨끗하다. 평균 · 표준편차 계산(왼쪽 아래) → SNR 대 √N 그래프(가운데 아래) → 법칙(오른쪽 아래)',
    parts:[['카메라','스마트폰 · 수동 모드 · 삼각대','ISO 높게 · 노출 일정','자동 노출 · 자동 보정이 켜지면 평균이 의미가 없다. 수동으로 고정.'],
           ['장면','회색 카드 · 그림자 없는 균일한 벽','균일한 밝기','구분이 되는 두 영역(밝은 · 어두운 카드)이 있으면 대조 · 신호 계산이 쉽다.'],
           ['프레임 모음','동영상 → 프레임 추출','N = 1, 2, 4, 8, 16, 32 장','같은 설정에서 연속으로 찍은 프레임을 쓴다.'],
           ['평균 코드','파이썬 numpy · 이미지 평균','같은 위치끼리 평균','프레임 사이 흔들림이 없어야 한다. 삼각대 고정.'],
           ['잡음 측정','관심 영역(ROI)의 표준편차','σ_N','균일한 영역을 골라 표준편차를 잰다. ROI 크기를 같게.'],
           ['그래프','SNR 대 √N','직선 기울기 = SNR₁','로그–로그에서는 기울기 0.5 가 나와야 한다.']],
    budget:[['스마트폰 · 삼각대','1','보유','—'],['회색 카드 · 종이','1','약 1천 원','—'],['파이썬(무료)','1','무료','엑셀'],['어두운 방 · 보조 조명','1','무료','—'],['—','—','—','—']],
    steps:['어두운 방에서 회색 카드를 찍는다(ISO 높게 · 수동 고정). 연속 촬영 64 장을 모은다.','첫 장의 ROI(균일한 영역) 표준편차 $\\sigma_1$ 를 구한다.','$N=1,2,4,8,16,32,64$ 장을 평균한 영상의 $\\sigma_N$ 을 각각 구한다.','$\\sigma_N$ 대 $N$ (로그–로그) 그래프를 그려 기울기 −0.5 를 확인한다.','밝은 영역과 어두운 영역의 신호 차(대조)를 잡음으로 나눈 $\\mathrm{SNR}_N$ 이 $\\sqrt N$ 에 비례하는지 본다.'],
    vars:['평균 프레임 수 N · ISO(잡음)','ROI 표준편차 · SNR','노출 · 흔들림 · 장면 밝기'],
    predict:[['단일 프레임(N=1) · SNR 3','병변 SNR = '+fx(a,1),'기준값'],
             ['N = 4','SNR = '+fx(b,1)+' (×'+fx(b/a,1)+')','$\\sqrt4=2$ 배 개선'],
             ['N = 16','SNR = '+fx(c,1)+' (×'+fx(c/a,1)+')','$\\sqrt{16}=4$ 배'],
             ['N = 64','SNR = '+fx(d,1)+' (×'+fx(d/a,1)+')','8 배 개선 — 64 배 노력(시간 · 선량)']],
    data:{cols:['N','σ_N (HU)','SNR','SNR/SNR₁','이론 √N'],
          rows:[1,2,4,8,16,32,64].map(function(n){ var s=r09snr(n,3,1); return [n,fx(35/s,1),fx(s,1),fx(s/a,2),fx(Math.sqrt(n),2)]; })},
    analysis:'$\\sigma_N$ 대 $N$ 을 로그–로그로 그려 기울기를 회귀한다(이론 −0.5). 기울기가 −0.5 보다 작게(개선이 덜) 나오면 프레임 사이 상관이 있는 잡음(고정 패턴 · 흔들림)이 남아 있음을 의미한다. 선량으로 환산하면 $N$ 배의 방사선이 필요한 셈이다.',
    special:['🎓 연구 설계',[['연구 질문','평균 프레임 수에 따라 잡음은 $1/\\sqrt N$ 로 줄어드는가?'],['가설','$\\sigma_N=\\sigma_1/\\sqrt N$ — 로그–로그 기울기 −0.5'],['통제 변인','카메라 설정 · 장면 · 삼각대'],['분석','로그–로그 회귀 · SNR–√N 직선'],['한계','고정 패턴 잡음(평균으로 줄지 않음) · 프레임 간 흔들림']]],
    fails:[['개선이 √N 만큼 안 된다','고정 패턴 잡음(센서 불균일) — 어두운 프레임을 빼서 보정'],['프레임이 서로 어긋난다','삼각대 · 타이머 촬영 · 정렬 후 평균'],['자동 보정으로 값이 달라진다','수동 모드로 고정(ISO · 셔터 · 화이트밸런스)']],
    up:['<b>17번 탭</b> — 가상 실험에서 SNR–√N 직선.','<b>I10</b> — 평균 대신 필터로 잡음 제거(해상도와의 거래).','<b>6번 탭</b> — 선량으로 환산.'],
    next:['원리⑤ 영상 품질',6],
    eval:[['측정','7 가지 N 으로 정확한 ROI'],['분석','로그–로그 기울기 해석'],['이해','왜 4 배 노력이 필요한가'],['정직','고정 패턴 · 흔들림 한계']],
    tip:'N = 1, 4, 16, 64 장 영상을 한 줄로 나열하고 SNR 표를 붙이면 법칙이 직관적으로 전달됩니다.' };
})();
SIMS.R09={ q:'프레임을 평균하는 장수와 단일 프레임의 신호 대 잡음비를 바꾸면 영상은 얼마나 깨끗해질까?',
  a:{nm:'평균 프레임 수 N',min:1,max:64,step:1,val:8,unit:'장',d:0}, b:{nm:'단일 프레임 SNR',min:1,max:10,step:0.5,val:3,unit:'',d:1},
  cap1:'왼쪽 : 한 프레임(잡음 많음). 오른쪽 : N 장 평균(깨끗). 가운데 오른쪽 밝은 점이 병변(+35 HU)입니다.',
  cap2:'📊 평균 프레임 수 N 대 SNR (로그–로그) — 점 = 측정, 실선 = SNR₁·√N, 기울기 0.5.',
  note:'모형 : 머리 팬텀 + 프레임마다 독립 가우시안 잡음(σ₁=35/SNR₁ HU), N 장 평균. SNR = 병변 대비(35 HU) / 백색질 ROI 표준편차. 같은 시드이면 같은 잡음(새로 측정은 잡음을 새로 뽑음).',
  anim:function(ctx,w,h,t,n,snr1,S){ var s=Math.max(60,Math.min((w-36)/2,h-46)), xA=(w-2*s-16)/2, xB=xA+s+16, a=r09img(1,snr1,S.seed), b=r09img(n,snr1,S.seed); cvText(ctx,'한 프레임 · SNR '+r09snr(1,snr1,S.seed).toFixed(1),xA+s/2,16,COL.text,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,a,R09.N,xA,26,s,-30,100); cvText(ctx,n+' 장 평균 · SNR '+r09snr(n,snr1,S.seed).toFixed(1),xB+s/2,16,COL.ok,'bold 12px system-ui,sans-serif','center'); drawHU(ctx,b,R09.N,xB,26,s,-30,100); cvText(ctx,'잡음 σ '+(35/snr1).toFixed(1)+' → '+(35/snr1/Math.sqrt(n)).toFixed(1)+' HU (÷√'+n+')',w/2,h-8,COL.tick,'11px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,n,snr1,S){ var Ns=[1,2,4,8,16,32,64], P=makePlot(ctx,w,h,{xmin:1,xmax:64,ymin:1,ymax:100,ylog:true,xlabel:'평균 프레임 수 N',ylabel:'SNR',title:'SNR 대 N — 기울기 ½ (√N 법칙)',left:56,xfmt:function(v){ return v.toFixed(0); }}), s1=r09snr(1,snr1,S.seed);
    plotLine(ctx,P,Ns.map(function(k){ return [k,s1*Math.sqrt(k)]; }),COL.white,1.4,[5,4]); plotPoints(ctx,P,Ns.map(function(k){ return [k,r09snr(k,snr1,S.seed)]; }),COL.blue,4.5); plotPoints(ctx,P,[[n,r09snr(n,snr1,S.seed)]],COL.amber,7); legend(ctx,P.x1-150,P.y1+14,[['이론 SNR₁√N',COL.white],['측정',COL.blue],['지금',COL.amber]]); },
  kv:function(n,snr1,S){ var s=r09snr(n,snr1,S.seed), s1=r09snr(1,snr1,S.seed); return [['SNR(지금)',s.toFixed(1),'a'],['단일 프레임 SNR',s1.toFixed(1)],['개선 배율',(s/s1).toFixed(2)+' 배 (이론 '+Math.sqrt(n).toFixed(2)+')','g'],['잡음 σ',(35/s).toFixed(1)+' HU','v2'],['필요 노력(시간 · 선량)',n+' 배','r']]; } };

/* ── R10 : 공개 흉부 X선 데이터로 AI 분류기 평가 ──────────────────────── */
var R10 = { cache:null };
function r10data(prev,seed){ var key=prev+'_'+seed; if(R10.cache&&R10.cache.key===key) return R10.cache; var r=rng32(seed*131+Math.round(prev)), n=1000, np=Math.round(n*prev/100), pos=[], neg=[], i; function cl(x){ return Math.max(0,Math.min(1,x)); } for(i=0;i<np;i++) pos.push(cl(0.68+0.17*gaussR(r))); for(i=0;i<n-np;i++) neg.push(cl(0.35+0.17*gaussR(r)));
  var roc=[], th, auc=0, prev2=null; for(th=1;th>=-0.001;th-=0.01){ var tp=pos.filter(function(x){ return x>=th; }).length, fp=neg.filter(function(x){ return x>=th; }).length, pt=[fp/Math.max(1,neg.length), tp/Math.max(1,pos.length)]; if(prev2) auc+=(pt[0]-prev2[0])*(pt[1]+prev2[1])/2; roc.push(pt); prev2=pt; }
  R10.cache={key:key,pos:pos,neg:neg,roc:roc,auc:auc}; return R10.cache; }
function r10(th,prev,seed){ var D=r10data(prev,seed), tp=D.pos.filter(function(x){ return x>=th; }).length, fn=D.pos.length-tp, fp=D.neg.filter(function(x){ return x>=th; }).length, tn=D.neg.length-fp, sens=tp/Math.max(1,tp+fn), spec=tn/Math.max(1,tn+fp), ppv=tp/Math.max(1,tp+fp), acc=(tp+tn)/(tp+tn+fp+fn); return {tp:tp,fn:fn,fp:fp,tn:tn,sens:sens,spec:spec,ppv:ppv,acc:acc,auc:D.auc}; }
(function(){
  var a=r10(0.5,10,1), b=r10(0.3,10,1), c=r10(0.7,10,1), d=r10(0.5,1,1);
  PROJ.R10={ id:'R10', t:'공개 흉부 X선 데이터로 AI 분류기 평가 — 민감도 · 특이도 · ROC', icon:'🧠', type:'R&E · 탐구', lv:3, dur:'4 ~ 6주', cost:'무료(컴퓨터)',
    one:'공개된 흉부 X선 데이터셋(예 : MedMNIST 의 ChestMNIST · PneumoniaMNIST 등 연구용 공개 자료)으로 간단한 분류 모델을 학습하거나 점수가 주어진 모델 출력을 받아 임계값에 따른 민감도 · 특이도 · 양성 예측도(PPV) · ROC 를 계산한다.',
    q:'분류기의 임계값을 바꾸면 민감도와 특이도는 어떻게 거래될까? 유병률이 낮은 집단에서 같은 성능의 분류기는 왜 덜 쓸모 있을까?',
    why:'의료영상 AI 의 성능은 「정확도 한 숫자」가 아니라 <b>민감도 · 특이도 · PPV · ROC 곡선</b>으로 평가합니다. 어느 기준에서 환자를 놓치지 않을지(응급) 거짓 경보를 줄일지(선별)를 정하는 의사결정을 코드로 체험합니다.',
    link:'확률 · 통계(조건부확률 · 베이즈) · 6 · 7번 탭 · I09 · 파이썬 scikit-learn · 오개념 10.',
    fig:FIGS.R10.fig, tg:FIGS.R10.tg,
    cap:'공개 영상 데이터(왼쪽)에서 분류기가 점수(가운데)를 내고 임계값을 넘으면 양성으로 판정한다. 민감도 · 특이도(왼쪽 아래) · 임계값 슬라이더(가운데 아래) · ROC 곡선과 AUC(오른쪽 아래)',
    parts:[['공개 데이터','MedMNIST · 공개 흉부 X선 데이터셋(연구용)','라이선스 · 개인정보 비식별 확인','실제 환자 정보가 든 비공개 데이터는 쓰지 않는다. 데이터 설명서의 라이선스를 읽는다.'],
           ['분류기','로지스틱 회귀 · 작은 CNN','점수 0 ~ 1 출력','처음에는 로지스틱 회귀 같은 단순 모델로 시작해도 충분하다.'],
           ['임계값','기본 0.5 · 0 ~ 1 변화','점수 ≥ 임계값 → 양성','임계값을 낮추면 환자를 더 잡지만(민감도 ↑) 거짓 경보도 늘어난다(특이도 ↓).'],
           ['혼동행렬','TP · FN · FP · TN','한 표로 모든 지표','양성 · 음성이 불균형하면 정확도만 보면 속는다.'],
           ['성능 지표','민감도 · 특이도 · PPV · 정확도','$\\mathrm{PPV}=\\dfrac{TP}{TP+FP}$','PPV 는 유병률에 따라 크게 변한다. 반드시 유병률을 함께 보고한다.'],
           ['ROC · AUC','민감도 대 (1 − 특이도)','임계값을 모두 훑은 곡선','AUC 0.5 = 무작위, 1 = 완벽. 임계값 선택은 곡선 위 점 고르기.']],
    budget:[['컴퓨터(구글 코랩 등)','1','무료','—'],['파이썬 · scikit-learn','1','무료','—'],['공개 데이터셋','1','무료','—'],['—','—','—','—'],['—','—','—','—']],
    steps:['공개 데이터셋의 설명서(라이선스 · 비식별 · 사용 목적)를 먼저 읽고 연구용으로 허용되는지 확인한다.','데이터를 학습 · 검증 · 시험으로 나눈다(시험 데이터는 마지막에만 쓴다).','분류기를 학습시켜 시험 데이터의 점수를 얻는다.','임계값을 0 ~ 1 로 바꾸며 민감도 · 특이도 · PPV 를 계산하고 ROC 곡선과 AUC 를 그린다.','유병률이 다른 가상 집단(1 % · 10 % · 30 %)으로 PPV 가 어떻게 달라지는지 계산하고 한계(데이터 편향 · 일반화)를 쓴다.'],
    vars:['임계값 · 유병률','민감도 · 특이도 · PPV · AUC','모델 종류 · 데이터 분할 · 영상 해상도'],
    predict:[['임계값 0.5 · 유병률 10 %','민감도 '+fx(a.sens*100,0)+' % · 특이도 '+fx(a.spec*100,0)+' % · PPV '+fx(a.ppv*100,0)+' %','AUC '+fx(a.auc,2)],
             ['임계값 0.3(민감하게)','민감도 '+fx(b.sens*100,0)+' % · 특이도 '+fx(b.spec*100,0)+' %','환자를 더 잡지만 거짓 경보 증가'],
             ['임계값 0.7(엄격하게)','민감도 '+fx(c.sens*100,0)+' % · 특이도 '+fx(c.spec*100,0)+' %','거짓 경보는 줄지만 환자를 놓친다'],
             ['임계값 0.5 · 유병률 1 %','PPV '+fx(d.ppv*100,0)+' %','같은 분류기라도 유병률이 낮으면 양성의 대부분이 거짓']],
    data:{cols:['임계값','민감도 (%)','특이도 (%)','PPV (%)','정확도 (%)'],
          rows:[0.2,0.3,0.4,0.5,0.6,0.7,0.8].map(function(t){ var r=r10(t,10,1); return [t,fx(r.sens*100,0),fx(r.spec*100,0),fx(r.ppv*100,0),fx(r.acc*100,0)]; })},
    analysis:'ROC 곡선 위 점(임계값별)을 표시하고 목적(응급 선별 vs 확진)에 맞는 임계값을 근거와 함께 고른다. 유병률을 바꾼 PPV 표로 「양성 판정의 의미」가 집단에 따라 다름을 설명한다. 신뢰 구간(부트스트랩)으로 AUC 의 불확실성을 보고한다.',
    special:['🎓 연구 설계',[['연구 질문','임계값과 유병률이 분류기의 민감도 · 특이도 · PPV 에 어떤 영향을 주는가?'],['가설','임계값 ↓ → 민감도 ↑ · 특이도 ↓ / 유병률 ↓ → PPV ↓'],['통제 변인','모델 · 데이터 분할 · 영상 전처리'],['분석','혼동행렬 · ROC · AUC · PPV–유병률 곡선'],['한계','공개 데이터 편향 · 실제 병원 데이터와의 차이 · 설명 가능성 · 개인정보 · 이 연구는 진단용이 아님']]],
    fails:[['시험 성능이 너무 좋다','학습 · 시험 데이터에 같은 환자 영상이 섞였는지(누수) 확인'],['정확도만 높고 환자를 못 잡는다','불균형 데이터 — 민감도 · ROC 로 평가'],['데이터 라이선스가 불명확하다','출처가 명확한 공개 데이터만 사용']],
    up:['<b>I09</b> — 베이즈 정리로 PPV 를 설명하는 장치.','<b>I10</b> — 저선량 영상에서의 성능 변화.','<b>설명 가능성</b> — 어떤 영역을 보고 판단했는지(히트맵) 표시.'],
    next:['활용 현황',7],
    eval:[['데이터 윤리','출처 · 라이선스 · 비식별'],['평가','민감도 · 특이도 · ROC · PPV'],['해석','유병률 · 임계값의 의미'],['한계','실제 진단과의 거리 · 편향 논의']],
    tip:'ROC 곡선 위에 「응급용 · 선별용」 임계값 두 점을 표시하고 이유를 한 줄씩 적으면 평가 기준이 한눈에 보입니다.' };
})();
SIMS.R10={ q:'분류기의 임계값과 환자 비율(유병률)을 바꾸면 민감도 · 특이도 · 양성 예측도는 어떻게 변할까?',
  a:{nm:'판정 임계값',min:0,max:1,step:0.01,val:0.5,unit:'',d:2}, b:{nm:'유병률',min:1,max:50,step:1,val:10,unit:'%',d:0},
  cap1:'1000 명의 분류기 점수 분포(빨강 = 환자, 초록 = 건강). 세로선(노랑) = 임계값 — 오른쪽을 양성으로 판정. 겹치는 구간이 오류의 원인입니다.',
  cap2:'📊 위 : ROC 곡선(점 = 지금 임계값, AUC 표시) · 아래 : 임계값 대 민감도 · 특이도 · PPV.',
  note:'모형 : 환자 점수 ~ N(0.68, 0.17), 건강 ~ N(0.35, 0.17), 총 1000 명, [0, 1] 로 자름. 실제 AI 점수 분포는 모델 · 데이터에 따라 다릅니다. 이 시뮬레이션은 교육용이며 진단 목적이 아닙니다.',
  anim:function(ctx,w,h,t,th,prev,S){ var D=r10data(prev,S.seed), r=r10(th,prev,S.seed), nb=25, bp=[], bn=[], i; for(i=0;i<nb;i++){ bp.push(0); bn.push(0); } var frac=Math.min(1,t/5); D.pos.slice(0,Math.floor(D.pos.length*frac)).forEach(function(x){ bp[Math.min(nb-1,Math.floor(x*nb))]++; }); D.neg.slice(0,Math.floor(D.neg.length*frac)).forEach(function(x){ bn[Math.min(nb-1,Math.floor(x*nb))]++; });
    var x0=40, x1=w-14, y0=h-34, y1=30, mx=Math.max(10,Math.max.apply(null,bp.map(function(v,k){ return v+bn[k]; }))*1.15), bw=(x1-x0)/nb; ctx.fillStyle=COL.plotbg; ctx.fillRect(x0,y1,x1-x0,y0-y1);
    for(i=0;i<nb;i++){ var hn=(y0-y1)*bn[i]/mx, hp=(y0-y1)*bp[i]/mx; ctx.fillStyle='rgba(52,211,153,.75)'; ctx.fillRect(x0+i*bw+1,y0-hn,bw-2,hn); ctx.fillStyle='rgba(251,113,133,.85)'; ctx.fillRect(x0+i*bw+1,y0-hn-hp,bw-2,hp); }
    var xt=x0+th*(x1-x0); ctx.strokeStyle=COL.amber; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(xt,y1); ctx.lineTo(xt,y0); ctx.stroke(); ctx.fillStyle='rgba(251,191,36,.07)'; ctx.fillRect(xt,y1,x1-xt,y0-y1);
    cvText(ctx,'점수 →',x1,y0+18,COL.tick,'11px system-ui,sans-serif','right'); cvText(ctx,'양성 판정 영역',xt+6,y1+12,COL.amber,'11px system-ui,sans-serif'); cvText(ctx,'TP '+r.tp+' · FN '+r.fn+' · FP '+r.fp+' · TN '+r.tn,12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,th,prev,S){ var D=r10data(prev,S.seed), r=r10(th,prev,S.seed), hh=Math.floor(h*0.55), ts=[], i; for(i=0;i<=100;i++) ts.push(i/100);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:1,ymin:0,ymax:1.02,xlabel:'1 − 특이도 (거짓 양성률)',ylabel:'민감도',title:'ROC 곡선 (AUC '+D.auc.toFixed(2)+')',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,[[0,0],[1,1]],COL.dim,1,[4,4]); plotLine(ctx,P,D.roc,COL.blue,2.2); plotPoints(ctx,P,[[1-r.spec,r.sens]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:1,ymin:0,ymax:1.02,xlabel:'임계값',ylabel:'비율',title:'임계값 대 민감도 · 특이도 · PPV',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,ts.map(function(x){ return [x,r10(x,prev,S.seed).sens]; }),COL.grav,1.8); plotLine(ctx,P,ts.map(function(x){ return [x,r10(x,prev,S.seed).spec]; }),COL.ok,1.8); plotLine(ctx,P,ts.map(function(x){ return [x,r10(x,prev,S.seed).ppv]; }),COL.amber,1.8); plotLine(ctx,P,[[th,0],[th,1]],COL.white,1,[3,3]); legend(ctx,P.x1-110,P.y1+14,[['민감도',COL.grav],['특이도',COL.ok],['PPV',COL.amber]]); }); },
  kv:function(th,prev,S){ var r=r10(th,prev,S.seed); return [['민감도',(r.sens*100).toFixed(0)+' %','a'],['특이도',(r.spec*100).toFixed(0)+' %','g'],['양성 예측도 PPV',(r.ppv*100).toFixed(0)+' %','v2'],['정확도',(r.acc*100).toFixed(0)+' %'],['AUC',r.auc.toFixed(2),'r']]; } };
