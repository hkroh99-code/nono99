/* ═══════════════════════════════════════════════════════════════════════════
   창의 프로젝트 C06 ~ C10
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── C06 : 달걀 우주인 구출 — 낙하산 + 완충 설계 영역 ───────────────────── */
var C06LIM=50;     // 달걀이 견디는 충격 가속도(교육용 가정, g)
function c06(Dcm, dmm){ var m=0.12, v=vTerm(m, dragArea(Dcm/100)), a=impactG(v, dmm/1000); return {v:v, a:a, ok:a<=C06LIM, margin:C06LIM/a}; }
function c06dmin(Dcm){ var v=vTerm(0.12, dragArea(Dcm/100)); return v*v/(2*C06LIM*SUBJ.g)*1000; }
(function(){
  var a=c06(40,15), b=c06(0,15), c=c06(30,10), d=c06(60,30);
  PROJ.C06={ id:'C06', t:'달걀 우주인 구출 — 낙하산과 완충재로 깨뜨리지 않고 착륙', icon:'🥚', type:'창의 · 설계 대회', lv:1, dur:'2주', cost:'약 1 ~ 2만 원',
    one:'달걀을 태운 캡슐(총 120 g)을 낙하산 + 완충재로 보호해 정해진 높이에서 떨어뜨린다. 낙하산 지름 D 와 완충 두께 d 를 정해 「깨지지 않는 설계 영역」을 계산 · 시험으로 찾는다.',
    q:'달걀이 견디는 충격 가속도를 약 50 g 로 가정하면, 낙하산 지름 D 와 완충 두께 d 가 어떤 조합일 때 깨지지 않을까? (설계 영역은 어떤 모양일까?)',
    why:'「달걀 낙하 대회」는 가장 인기 있는 공학 설계 활동입니다. 이 프로젝트의 차이점은 <b>계산으로 먼저 예측</b>하고 시험으로 확인한다는 것 — 낙하산(속도 ↓)과 완충(거리 ↑)이 서로 <b>바꿔 쓸 수 있는 자원</b>임을 눈으로 보게 됩니다.',
    link:'교과서 일 · 에너지 · 충격량 · 2번 탭(종단속도) · 6번 탭(충격) · R06(충격 측정) · 발명 04(격자 완충).',
    fig:FIGS.C06.fig, tg:FIGS.C06.tg,
    cap:'달걀 우주인(왼쪽)을 캡슐(가운데)에 넣고 낙하산(오른쪽)을 달아 높이 H 에서 떨어뜨린다. 바닥에는 완충재(두께 d, 아래 왼쪽). 성공 · 실패를 표로 기록하면 설계 영역이 나타난다',
    parts:[['달걀 우주인','삶은 달걀 · 생달걀','처음엔 삶은 달걀로 연습, 마지막에 생달걀. 얼굴을 그려 「우주인」으로. 한 번 금이 가면 다시 쓰지 않는다.'],
           ['캡슐','총 질량 120 g 이하','달걀을 감싸는 종이컵 · 폼 케이스. <i>질량을 정해진 값 이하</i>로(대회 규칙을 만든다).'],
           ['낙하산','D = 20 · 30 · 40 cm','비닐 · 종이. 지름이 크면 종단속도가 작아진다(R01). 줄은 같은 길이 6 가닥.'],
           ['완충재','스펀지 · 폼 d = 5 ~ 30 mm','착지면 · 캡슐 바닥에. 두께 d 를 늘리면 충격 $a=v^2/2d$ 감소(6번 탭).'],
           ['낙하 시험','H = 3 ~ 5 m','같은 방법으로 놓기. 낙하산이 충분히 펴지는 높이가 필요(낮으면 종단속도에 못 이른다).'],
           ['결과 기록표','성공 · 실패 · 균열','(D, d) 조합별 5 회 시도 결과 · 계산한 g. 성공 확률을 표로.']],
    budget:[['달걀 · 삶은 달걀','10 개','약 3천 원','—'],['폼 · 스펀지 · 종이컵','1 세트','약 3천 원','—'],['비닐 · 실 · 테이프','1 세트','약 3천 원','—'],['저울 · 줄자','1','학교 비품','—'],['스마트폰(슬로모션)','1','보유','—']],
    steps:['규칙을 정한다 : 총 질량 120 g 이하, 낙하 높이 4 m, 성공 = 금이 가지 않음. 팀별로 D · d 를 설계한다.','계산으로 예측한다 : 종단속도 $v_t=\\sqrt{2mg/\\rho C_dA}$, 충격 $a=v^2/2d$ 를 구해 50 g 이하인지 확인.','제작 후 같은 높이에서 삶은 달걀 → 생달걀 순으로 시험하고 영상을 남긴다.','(D, d) 조합표에 성공 · 실패를 적고 계산한 가속도와 함께 설계 영역 그래프를 그린다.','가장 가볍고 작게 성공한 팀의 설계 이유를 식으로 발표한다(질량 최소화가 점수).'],
    vars:['낙하산 지름 D · 완충 두께 d','착지 충격(가속도) · 성공 여부','캡슐 질량 · 낙하 높이 · 놓는 방법 · 달걀 종류'],
    predict:[['D 40 cm · d 15 mm','착지 속도 '+fx(a.v)+' m/s · 충격 '+fx(a.a,0)+' g → '+(a.ok?'성공(여유 '+fx(a.margin,1)+' 배)':'실패'),'$v_t$ = '+fx(a.v,2)+' m/s, $a=v^2/2d$'],
             ['낙하산 없이 d 15 mm','착지 속도 '+fx(b.v,0)+' m/s · 충격 '+fx(b.a,0)+' g → '+(b.ok?'성공':'실패'),'낙하산이 없으면 속도가 크게 늘어 완충만으로는 어렵다'],
             ['D 30 cm · d 10 mm','충격 '+fx(c.a,0)+' g → '+(c.ok?'성공':'실패(한계 근처)'),'같은 낙하산에서 완충을 얇게 하면 한계를 넘는다'],
             ['D 60 cm · d 30 mm','충격 '+fx(d.a,1)+' g → 성공(과설계)','너무 크면 가볍게 만들기 어렵고 질량 점수가 낮아진다']],
    data:{cols:['D (cm)','d (mm)','착지 속도 (m/s)','충격 (g)','한계 50 g 대비','판정'],
          rows:[[0,15],[20,15],[30,10],[30,20],[40,15],[60,30]].map(function(q){ var r=c06(q[0],q[1]); return [q[0],q[1],fx(r.v,1),fx(r.a,0),fx(r.margin,2)+' 배',r.ok?'성공':'실패']; })},
    analysis:'(D, d) 평면에 성공 · 실패 점을 찍고 계산한 경계 곡선 $d_{\\min}(D)=\\dfrac{v_t(D)^2}{2\\,a_{\\lim}}$ 과 비교한다. 경계에서 벗어난 점(예 : 계산상 성공인데 깨짐)은 낙하산 개방 지연 · 달걀 위치 · 충격 방향(옆면)으로 설명한다. 한계 가속도 $a_{\\lim}$ 도 시험으로 구해 본다(삶은 달걀 점차 높이 올리기).',
    special:['🎨 작품 기획서',[['작품 이름','「우주인 구출 작전」 — 달걀 캡슐 착륙선'],['표현 아이디어','캡슐에 우주인 캐릭터 · 임무 패치를 붙이고 팀별 설계 영상 소개'],['과학 근거','$v_t$ · $a=v^2/2d$ · 설계 영역(질량 최소 vs 안전 계수)'],['전시 구성','팀별 설계표 + 낙하 시연 + 성공 확률 게시판']]],
    fails:[['계산은 성공인데 깨진다','달걀이 캡슐 안에서 움직인다 — 달걀을 완충재로 완전히 감싸고 고정'],['낙하산이 안 펴진다','줄 엉킴 · 접힘 — 접는 법 통일, 낮은 높이에서는 낙하산 대신 완충 중심 설계'],['성공 확률이 불안하다','안전 계수(여유 1.5 배)를 두고 설계, 같은 조건 5 회 이상 시험']],
    up:['<b>R06 연결</b> — 가속도 센서로 실제 충격 g 를 재서 한계 가속도를 구한다.','<b>발명 04</b> — 3D 프린트 격자 완충으로 질량을 줄인 설계.','<b>점수 설계</b> — 질량 · 성공 여부를 합친 대회 점수식(C09 와 연결).'],
    next:['원리⑤ 전력 · 충격 · 안전',6],
    eval:[['창의성','설계 아이디어와 표현(캐릭터 · 발표)'],['계산 · 예측','계산한 설계 영역과 시험 결과의 일치'],['안전 계수','여유 · 반복 시험으로 신뢰도 확보'],['발표','실패에서 배운 점을 식으로 설명']],
    tip:'성공 · 실패 점이 찍힌 (D, d) 지도에 계산 경계선을 얹어 「계산이 맞았나」를 보여 주면 가장 강력한 결과 화면이 됩니다.' };
})();
SIMS.C06={ q:'낙하산 지름과 완충 두께를 바꾸면 달걀이 안전한 설계 영역은 어디일까? (달걀 한계 50 g 가정)',
  a:{nm:'낙하산 지름 D (0 = 없음)',min:0,max:60,step:2,val:40,unit:'cm',d:0}, b:{nm:'완충 두께 d',min:5,max:50,step:1,val:15,unit:'mm',d:0},
  cap1:'캡슐이 낙하산으로 내려와 완충재 위에 착지합니다(×0.2 슬로모션). 결과가 바로 표시됩니다.',
  cap2:'📊 설계 지도 : 초록 = 안전(충격 ≤ 50 g), 빨강 = 위험. 흰 곡선 = 경계, 점 = 지금 설계. 질량 120 g 고정.',
  note:'모형 : 총 질량 120 g, 낙하산 Cd 1.5 + 캡슐 몸통, 일정 감속 충격 $a=v^2/2d$. 「달걀 한계 50 g」은 교육용 가정이며 실제 값은 시험으로 구해야 합니다(달걀 · 충격 방향에 따라 크게 다름).',
  anim:function(ctx,w,h,t,D,dmm,S){ var q=c06(D,dmm), gy=h-34, top=40, sc=(gy-top-70)/8, fh=Math.max(4,dmm*1.2), y0=gy-fh-34-8*sc, tt=t*0.2, d=Math.min(8,fall1D(q.v,tt)), y=y0+d*sc, cx=w*0.4, landed=d>=8;
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy); ctx.fillStyle='rgba(251,191,36,.30)'; ctx.fillRect(cx-34,gy-fh,68,fh); ctx.strokeStyle=COL.amber; ctx.setLineDash([4,3]); ctx.strokeRect(cx-34,gy-fh,68,fh); ctx.setLineDash([]);
    if(!landed && D>0) drawChute(ctx,cx,y,34,Math.max(10,D*1.2),1); ctx.fillStyle=COL.metal; ctx.strokeStyle=COL.dev; ctx.fillRect(cx-14,y,28,34); ctx.strokeRect(cx-14,y,28,34); ctx.fillStyle='#fde68a'; ctx.beginPath(); ctx.ellipse(cx,y+17,7,9,0,0,6.2832); ctx.fill();
    if(landed){ ctx.fillStyle=q.ok?COL.ok:COL.grav; ctx.font='bold 26px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(q.ok?'🥚 무사!':'💥 깨짐!',cx,gy-fh-70); }
    cvText(ctx,'착지 속도 '+q.v.toFixed(2)+' m/s · 충격 '+q.a.toFixed(0)+' g (한계 '+C06LIM+' g) · 여유 '+q.margin.toFixed(2)+' 배',12,16,q.ok?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,D,dmm,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:60,ymin:5,ymax:50,xlabel:'낙하산 지름 D (cm)',ylabel:'완충 두께 d (mm)',title:'설계 지도 — 달걀이 안전한 (D, d)',left:56,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}), i, j, nx=30, ny=23;
    for(i=0;i<nx;i++) for(j=0;j<ny;j++){ var Dd=60*(i+0.5)/nx, dd=5+45*(j+0.5)/ny, r=c06(Dd,dd), x0=P.X(60*i/nx), x1=P.X(60*(i+1)/nx), y0=P.Y(5+45*(j+1)/ny), y1=P.Y(5+45*j/ny); ctx.fillStyle=r.ok?'rgba(52,211,153,'+(0.15+0.3*Math.min(1,(r.margin-1)/3))+')':'rgba(251,113,133,'+(0.18+0.3*Math.min(1,(r.a/C06LIM-1)/3))+')'; ctx.fillRect(x0,y0,x1-x0+0.5,y1-y0+0.5); }
    var Lb=[]; for(i=0;i<=60;i++){ var dm=c06dmin(i); if(dm>=5&&dm<=50) Lb.push([i,dm]); } plotLine(ctx,P,Lb,COL.white,2.4); plotPoints(ctx,P,[[D,dmm]],COL.amber,7);
    cvText(ctx,'안전',P.X(50),P.Y(42),COL.ok,'bold 13px system-ui,sans-serif','center'); cvText(ctx,'위험',P.X(8),P.Y(10),COL.grav,'bold 13px system-ui,sans-serif','center'); },
  kv:function(D,dmm,S){ var q=c06(D,dmm); return [['착지 속도',q.v.toFixed(2)+' m/s','a'],['충격 가속도',q.a.toFixed(0)+' g'],['한계 대비 여유',q.margin.toFixed(2)+' 배','g'],['필요한 최소 완충 d',c06dmin(D).toFixed(1)+' mm','v2'],['판정',q.ok?'✅ 안전':'💥 위험','r']]; } };

/* ── C07 : 스모그 지도 — 기온 역전층과 PM2.5 프로파일 ─────────────────────── */
function c07(zi, dT){ var k=1.5, ratio=1/(1+k*dT), B=15000, Cs=B/(zi+500*ratio), Ca=Cs*ratio; return {Cs:Cs, Ca:Ca, ratio:ratio, zi:zi, dT:dT}; }
function c07C(h, q){ if(h<=q.zi) return q.Cs; return q.Ca*Math.exp(-(h-q.zi)/500); }
function c07T(h, zi, dT, Tg){ var x=Math.max(0,Math.min(1,(h-(zi-50))/100)); return Tg-0.0065*h+dT*(x*x*(3-2*x)); }
(function(){
  var a=c07(300,4), b=c07(300,0), c=c07(150,4), d=c07(300,8);
  PROJ.C07={ id:'C07', t:'우리 동네 스모그 지도 — 기온 역전층 위 · 아래의 미세먼지', icon:'🌫', type:'창의 · 사회 문제', lv:2, dur:'4주', cost:'약 4 ~ 7만 원',
    one:'미세먼지(PM2.5) 센서와 온도 · 기압 센서를 낙하 · 상승하는 캔위성(풍선 · 드론)에 달아 고도별 농도 · 온도 프로파일을 재고, 기온 역전층이 오염 물질을 가두는 모습을 「우리 동네 스모그 지도」로 시각화한다.',
    q:'기온 역전층(강도 ΔT, 높이 $z_i$)이 있을 때 지표 PM2.5 농도는 역전이 없을 때의 몇 배일까? 역전층 위 · 아래의 농도비는?',
    why:'「왜 겨울 아침에 미세먼지가 더 심할까」를 <b>자기 동네의 실제 데이터</b>로 답할 수 있습니다. 한 번의 상승 · 하강 프로파일에는 온도가 거꾸로 올라가는 층과 먼지의 급감이 함께 찍혀, 대기 과학이 사회 문제와 곧바로 연결됩니다.',
    link:'교과서 대기 안정도 · 기온 감률(3번 탭) · 확산 · 환경 문제 · 5번 탭(원격측정으로 실시간 전송).',
    fig:FIGS.C07.fig, tg:FIGS.C07.tg,
    cap:'온도 센서(왼쪽) · PM 센서(가운데) · 기압 고도(오른쪽)를 단 캔위성이 고도별 값을 기록한다. 역전층 그림(아래 왼쪽) 아래에 먼지가 모이고(농도 프로파일, 가운데) 동네 지도(오른쪽)로 정리',
    parts:[['온도 센서','DS18B20 · BME280','기온 감률(−6.5 ℃/km) 대신 <i>높이에 따라 온도가 오르는 구간</i>(역전층)을 찾는다. R05 의 응답 시간 지연에 주의.'],
           ['PM 센서','PMS5003 · SDS011','레이저 산란식 소형 센서. 흡입 팬이 있어 5 V · 100 mA. 낙하 중 공기 흐름에 맞게 흡입구 방향을 설계.'],
           ['고도(기압)','BMP280','3번 탭 방법으로 고도 계산. 프로파일은 고도 순서로 정렬.'],
           ['역전층 해석','ΔT · 높이 z_i','온도 – 고도 곡선에서 온도가 위로 갈수록 증가하는 구간의 높이와 증가량.'],
           ['농도 프로파일','C(h) 그래프','역전층 아래 · 위의 평균 농도 비를 구한다. 기준선(WHO 24 h 15 µg/m³ · 한국 24 h 환경기준 35 µg/m³ — 개정 가능, 확인)과 비교.'],
           ['동네 지도','여러 날 · 여러 지점','같은 장소를 맑은 날 · 안개 낀 아침 · 미세먼지 나쁨 날 비교해 한 장의 포스터로.']],
    budget:[['PM 센서(PMS5003 · SDS011)','1','약 2 ~ 3만 원','학교 대기측정기'],['온도 · 기압 센서(BME280)','1','약 5천 원','—'],['아두이노 · SD 모듈','1 세트','약 2만 원','—'],['풍선 · 헬륨 또는 드론','—','약 1만 원 ~ 대여','C10 · 학교 드론'],['배터리 · 케이블','1 세트','약 5천 원','—']],
    steps:['센서 3 종을 한 보드에 연결해 1 초 간격으로 온도 · 기압 · PM2.5 를 SD 카드에 기록하는 코드를 만든다(14번 탭).','맑은 날 · 안개가 낀 새벽 · 미세먼지 나쁨 날 세 번, 풍선(또는 드론)으로 300 ~ 500 m 까지 올라갔다 내려오며 측정한다(허가 · 안전 필수).','고도 순서로 온도 – 고도, PM2.5 – 고도 그래프를 그린다.','온도가 오르는 구간(역전층) 높이 · ΔT 와 그 아래 · 위의 평균 농도를 구해 비를 낸다.','결과를 「동네 스모그 지도」 포스터로 만들고 이론 모형(농도 비 $1+k\\Delta T$)과 비교한다.'],
    vars:['날씨(역전층 유무) · 고도','PM2.5 농도 · 온도 · 농도비','센서 · 시간대 · 장소 · 풍선 상승 속도'],
    predict:[['역전 없음(ΔT = 0) · 혼합 높이 300 m','지표 PM2.5 약 '+fx(b.Cs,0)+' µg/m³ · 위와 거의 같음(비 1)','역전이 없으면 농도가 고도에 따라 부드럽게 줄어든다'],
             ['역전 4 K · 높이 300 m','지표 약 '+fx(a.Cs,0)+' µg/m³ (역전 없을 때의 '+fx(a.Cs/b.Cs,1)+' 배), 역전층 위 약 '+fx(a.Ca,0)+' µg/m³ (비 '+fx(a.Cs/a.Ca,1)+')','역전층이 뚜껑 역할 — 같은 오염량이 낮은 층에 모인다'],
             ['역전 높이 150 m (더 낮음)','지표 약 '+fx(c.Cs,0)+' µg/m³ ('+fx(c.Cs/a.Cs,1)+' 배)','가두는 공기 부피가 작을수록 농도 상승'],
             ['역전 8 K (매우 강함)','지표 약 '+fx(d.Cs,0)+' µg/m³, 역전층 위 약 '+fx(d.Ca,0)+' µg/m³ (비 '+fx(d.Cs/d.Ca,1)+')','ΔT 가 커질수록 위로 못 빠져나간다']],
    data:{cols:['날씨','역전 ΔT (K)','z_i (m)','지표 PM2.5 (µg/m³)','역전층 위 (µg/m³)','농도비'],
          rows:[['맑음 · 오후',0,300,b],['안개 낀 아침',4,300,a],['낮은 역전',4,150,c],['강한 역전',8,300,d]].map(function(q){ return [q[0],q[1],q[2],fx(q[3].Cs,0),fx(q[3].Ca,0),fx(q[3].Cs/q[3].Ca,1)]; })},
    analysis:'온도 프로파일에서 $dT/dh>0$ 인 구간을 찾아 $z_i$ 와 ΔT 를 정하고, 농도 프로파일의 급감 높이와 일치하는지 본다. 농도비 $C_{\\text{아래}}/C_{\\text{위}}$ 를 ΔT 에 대해 그려 모형 $1+k\\Delta T$ 의 k 를 맞춘다(모형 1.5). 센서의 습도 영향(안개 때 과대 평가)을 보정 · 한계로 명시.',
    special:['🎨 작품 기획서',[['작품 이름','「안개 낀 아침의 수직 단면」 — 우리 동네 스모그 지도'],['표현 아이디어','고도별 농도를 색(초록 → 빨강)으로, 역전층을 점선 뚜껑으로 그린 단면도 포스터'],['과학 근거','기온 감률 · 역전층 · 정적 안정도, 농도 프로파일'],['전시 구성','측정 영상 + 단면도 포스터 + 「왜 겨울 아침이 위험한가」 설명 코너']]],
    fails:[['PM 값이 안개에서 비정상적으로 크다','습도가 높으면 센서가 물방울도 입자로 셈 — 습도 기록, 보정 또는 한계로 명시'],['고도가 올라가면 센서가 멈춘다','저온 · 배터리 저하 — 보온 · 예비 전원, 짧은 비행부터'],['데이터가 들쭉날쭉','센서 안정 시간(워밍업 30 s) 확보, 고도 구간별 평균']],
    up:['<b>3번 탭 연결</b> — 기온 감률 · 기압 고도 계산.','<b>R05 연결</b> — 온도 센서 지연 보정을 적용해 역전층 높이를 더 정확히.','<b>시민 과학</b> — 여러 학교가 같은 날 측정해 지도를 합치기.'],
    next:['원리② 대기 — 기압 · 고도 · 온도',3],
    eval:[['창의성','사회 문제를 데이터 포스터로 표현'],['정확성','센서 보정 · 고도 정렬 · 불확도'],['해석','역전층과 농도의 관계를 근거로 설명'],['안전 · 규정','풍선 · 드론 비행 허가 · 안전 수칙 준수']],
    tip:'온도 – 고도 그래프에서 「거꾸로 오르는 구간」과 PM 급감 지점을 같은 높이에 점선으로 이어 주세요.' };
})();
SIMS.C07={ q:'역전층 높이와 세기를 바꾸면 지표 PM2.5 와 역전층 위 · 아래의 농도 차이는 어떻게 될까?',
  a:{nm:'역전층 높이 z_i',min:100,max:800,step:20,val:300,unit:'m',d:0}, b:{nm:'역전 세기 ΔT',min:0,max:8,step:0.5,val:4,unit:'K',d:1},
  cap1:'캔위성이 고도 800 m 에서 내려오며 먼지 입자(점)가 짙은 층을 통과합니다. 점선 = 역전층 높이.',
  cap2:'📊 왼쪽 : 온도 대 고도(역전층에서 거꾸로 오름), 오른쪽 : PM2.5 대 고도. 점선 = 기준(WHO 24 h 15 · 한국 24 h 35 µg/m³, 개정 가능).',
  note:'모형 : 역전층 아래 농도 $C_s$ 균일, 위는 $C_s/(1+1.5\\Delta T)$ 에서 시작해 500 m 척도로 감소, 연직 적분량 15 mg/m² 고정. 지표 기온 15 ℃. 교육용 어림 — 실제 프로파일은 풍속 · 습도 · 배출원에 따라 다릅니다.',
  anim:function(ctx,w,h,t,zi,dT,S){ var q=c07(zi,dT), gy=h-30, top=30, H=800, sc=(gy-top)/H, hh=H-(H-20)*Math.min(1,t/9.5), r=rng32(S.seed*5+1), i;
    skyBg(ctx,w*0.6,gy); groundBg(ctx,w*0.6,h,gy); var N=380; for(i=0;i<N;i++){ var hy=r()*H, p=c07C(hy,q)/Math.max(q.Cs,1); if(r()<p){ var x=r()*w*0.6; cvCirc(ctx,x,gy-hy*sc,1.7,'rgba(180,170,150,'+(0.25+0.5*p)+')',null); } }
    ctx.strokeStyle=COL.grav; ctx.setLineDash([6,4]); ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(0,gy-zi*sc); ctx.lineTo(w*0.6,gy-zi*sc); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'역전층 '+zi+' m · ΔT '+dT.toFixed(1)+' K',8,gy-zi*sc-8,COL.grav,'bold 11px system-ui,sans-serif');
    drawCan(ctx,w*0.3-8,gy-hh*sc-30,30); var Cn=c07C(hh,q), Tn=c07T(hh,zi,dT,15);
    var tx=w*0.64; cvText(ctx,'높이',tx,36,COL.tick,'11px system-ui,sans-serif'); cvText(ctx,hh.toFixed(0)+' m',tx,56,COL.text,'bold 18px system-ui,sans-serif'); cvText(ctx,'PM2.5',tx,92,COL.tick,'11px system-ui,sans-serif'); cvText(ctx,Cn.toFixed(0)+' µg/m³',tx,112,Cn>35?COL.grav:(Cn>15?COL.amber:COL.ok),'bold 18px system-ui,sans-serif'); cvText(ctx,'기온',tx,148,COL.tick,'11px system-ui,sans-serif'); cvText(ctx,Tn.toFixed(1)+' ℃',tx,168,COL.blue,'bold 18px system-ui,sans-serif'); },
  graph:function(ctx,w,h,zi,dT,S){ var q=c07(zi,dT), hw=Math.floor(w*0.5), i, Cmax=Math.max(60,Math.ceil(q.Cs*1.15/10)*10);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    subPlot(ctx,0,0,hw,h,{xmin:4,xmax:20,ymin:0,ymax:800,xlabel:'기온 (℃)',ylabel:'고도 (m)',title:'온도 프로파일',left:56,top:28,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var Lt=[]; for(i=0;i<=80;i++){ var hh=800*i/80; Lt.push([c07T(hh,zi,dT,15),hh]); } plotLine(ctx,P,Lt,COL.blue,2.2); plotLine(ctx,P,[[4,zi],[20,zi]],COL.grav,1.2,[5,4]); });
    subPlot(ctx,hw,0,w-hw,h,{xmin:0,xmax:Cmax,ymin:0,ymax:800,xlabel:'PM2.5 (µg/m³)',ylabel:'',title:'농도 프로파일',left:46,top:28,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(){ return ''; }}, function(P){ var Lc=[]; for(i=0;i<=160;i++){ var hh=800*i/160; Lc.push([c07C(hh,q),hh]); } plotLine(ctx,P,Lc,COL.amber,2.4); plotLine(ctx,P,[[0,zi],[Cmax,zi]],COL.grav,1.2,[5,4]);
      plotLine(ctx,P,[[15,0],[15,800]],COL.ok,1.2,[3,3]); plotLine(ctx,P,[[35,0],[35,800]],COL.warm,1.2,[3,3]); cvText(ctx,'15',P.X(15)+3,P.y1+12,COL.ok,'10px system-ui,sans-serif'); cvText(ctx,'35',P.X(35)+3,P.y1+12,COL.warm,'10px system-ui,sans-serif'); }); },
  kv:function(zi,dT,S){ var q=c07(zi,dT), b=c07(zi,0); return [['지표 PM2.5',q.Cs.toFixed(0)+' µg/m³','a'],['역전층 위',q.Ca.toFixed(0)+' µg/m³'],['농도비(아래/위)',(q.Cs/q.Ca).toFixed(1),'g'],['역전 없을 때 대비',(q.Cs/b.Cs).toFixed(1)+' 배','v2'],['한국 24 h 기준(35) 대비',(q.Cs/35).toFixed(1)+' 배','r']]; } };

/* ── C08 : 해바라기 캔위성 — 패널 방향과 하루 에너지 (동서 2차원 어림) ───────── */
function c08(beta, err){ var N=121, Ef=0, Et=0, i, ser={t:[],f:[],k:[]}; for(i=0;i<N;i++){ var tt=12*i/(N-1), phi=Math.PI*tt/12, pf=Math.max(0,Math.cos(phi-beta*Math.PI/180)), pk=Math.max(0,Math.cos(err*Math.PI/180))*Math.sin(Math.max(0.03,phi)>0?1:1); ser.t.push(tt); ser.f.push(pf); ser.k.push(Math.cos(err*Math.PI/180)); Ef+=pf*12/(N-1); Et+=Math.cos(err*Math.PI/180)*12/(N-1); }
  var serv=0.03*12/1; return {Ef:Ef, Et:Et, Etn:Et-serv*1, ser:ser, gain:(Et-serv)/Math.max(0.01,Ef)}; }
(function(){
  var a=c08(90,0), b=c08(60,0), c=c08(90,15), d=c08(0,0);
  PROJ.C08={ id:'C08', t:'해바라기 캔위성 — 태양을 따라 도는 패널은 하루에 얼마나 더 벌까?', icon:'🌻', type:'창의 · 에너지', lv:2, dur:'4주', cost:'약 3 ~ 6만 원',
    one:'소형 태양전지 패널을 고정했을 때와 광센서(LDR 4 개) · 서보로 태양을 추적하게 했을 때의 하루 발전량을 비교한다. 입사각 $\\theta$ 에 대한 $P=P_0\\cos\\theta$ 를 확인하고 추적 장치의 전력 비용까지 계산한다.',
    q:'태양 빛이 패널 법선과 θ 만큼 어긋나면 출력은 $\\cos\\theta$ 로 줄까? 추적하면 고정(수평)보다 하루 에너지가 얼마나 늘고, 서보 소비 전력을 빼도 이득일까?',
    why:'캔위성이 착륙한 뒤 오래 신호를 보내는 장기 임무에는 <b>전력</b>이 열쇠입니다. 「태양을 따라 도는 해바라기」는 코사인 법칙 하나로 설계되고, 소형 서보의 전력 비용까지 따져야 진짜 이득을 알 수 있습니다.',
    link:'교과서 빛의 세기와 입사각(코사인) · 에너지 · 6번 탭 전력 · 태양광 발전.',
    fig:FIGS.C08.fig, tg:FIGS.C08.tg,
    cap:'패널(왼쪽)을 서보 2 축(가운데) 위에 달고 광센서 4 개(오른쪽)의 밝기 차로 태양 방향을 찾는다. 입사각 θ(아래 왼쪽)에 따라 출력이 바뀌어 하루 곡선(아래 가운데)이 되고 면적이 하루 에너지(아래 오른쪽)',
    parts:[['태양전지 패널','5 V · 1 W급','소형 패널의 단락 전류 · 개방 전압을 확인. 부하(저항)에 연결해 전력 $P=IV$ 를 측정.'],
           ['서보 2 축','SG90 서보 2 개','팬(수평)과 틸트(수직). 소비 전력은 움직일 때만(듀티 5 ~ 10 %).'],
           ['광센서 LDR × 4','4 사분면 센서','태양이 정면이면 4 개 값이 같다. 차이가 나면 서보를 그쪽으로 돌린다(비례 제어).'],
           ['입사각 θ','cos θ','패널에 닿는 빛의 양은 $\\cos\\theta$ 에 비례. θ = 60° 면 ½.'],
           ['전압 · 전류 기록','INA219 · 멀티미터','10 분마다 패널 출력 기록(하루 종일). 고정 패널과 추적 패널을 동시에.'],
           ['하루 에너지','E = ∫ P dt','출력 곡선 아래 면적(Wh). 추적 패널 − 서보 소비 = 순이득.']],
    budget:[['소형 태양전지 패널(5 V · 1 W)','2','약 6천 원 × 2','학교 패널'],['SG90 서보 2 개 · 아두이노','1 세트','약 1.5만 원','—'],['LDR 4 개 + 저항','1 세트','약 2천 원','—'],['전류 센서 INA219','1','약 3천 원','멀티미터'],['받침대 · 배터리','1 세트','약 5천 원','—']],
    steps:['고정 패널(수평)과 추적 패널을 나란히 놓고 같은 부하로 출력을 10 분마다 기록한다(맑은 날 하루).','추적 장치는 4 사분면 LDR 의 차 $(L_1+L_2)-(L_3+L_4)$ 로 서보를 돌리는 비례 제어로 만든다.','패널이 태양과 θ 만큼 어긋나게 일부러 기울여 출력 대 θ 를 재고 $\\cos\\theta$ 곡선과 비교한다.','하루 출력 곡선 아래 면적(Wh)을 계산해 고정 대 추적의 비 · 서보 소비(전류 측정)를 뺀 순이득을 구한다.','추적 오차(광센서 정밀도)를 바꿔 이득이 어떻게 줄어드는지 분석한다.'],
    vars:['고정 각 β · 추적 오차','패널 출력 P · 하루 에너지 E','날씨(구름) · 시간대 · 패널 온도'],
    predict:[['수평 고정(β = 90°) 대 추적 (동서 2 차원 어림, 12 시간)','고정 하루 에너지 '+fx(a.Ef,2)+' Wh(1 W 패널 기준) · 추적 '+fx(a.Et,2)+' Wh → 약 '+fx((a.Et/a.Ef-1)*100,0)+' % 증가','수평 고정은 평균 $2/\\pi\\approx0.64$ 배, 추적은 1 (가정 : 항상 맑음)'],
             ['서보 소비(30 mW × 12 h)를 빼면','추적 순이득 '+fx(a.Etn,2)+' Wh → 고정 대비 '+fx((a.gain-1)*100,0)+' %','서보 에너지 0.36 Wh 는 이득의 약 '+fx(0.36/(a.Et-a.Ef)*100,0)+' %'],
             ['추적 오차 15°','추적 출력이 $\\cos15^\\circ=0.966$ 배 → 하루 '+fx(c.Et,2)+' Wh','오차가 작은 동안은 손실이 작다(코사인은 0 근처에서 평평)'],
             ['고정 각 β = 60°','하루 '+fx(b.Ef,2)+' Wh (수평 '+fx(a.Ef,2)+' Wh)','동서 평면에서 기울인 패널은 한쪽 방향 아침 · 저녁 편향']],
    data:{cols:['구성','하루 에너지 (Wh)','고정 대비','비고'],
          rows:[['수평 고정 β=90°',fx(a.Ef,2),'1.00','기준'],['기울인 고정 β=60°',fx(b.Ef,2),fx(b.Ef/a.Ef,2),'아침 편향'],['추적(오차 0)',fx(a.Et,2),fx(a.Et/a.Ef,2),'서보 소비 전'],['추적(오차 15°)',fx(c.Et,2),fx(c.Et/a.Ef,2),'—'],['추적 순이득(서보 0.36 Wh 감)',fx(a.Etn,2),fx(a.Etn/a.Ef,2),'—']]},
    analysis:'출력 – 시간 곡선을 사다리꼴 적분으로 Wh 로 환산하고, 구름 낀 구간은 따로 표시해 고정 · 추적 비를 계산한다. 각도 대 출력은 $P=P_0\\cos\\theta$ 에 맞춰 $P_0$ 를 구한다. 서보 소비는 평균 전류 × 전압 × 시간으로 측정해 순이득 = (추적 − 고정) − 서보 에너지.',
    special:['🎨 작품 기획서',[['작품 이름','「해바라기 캔위성」 — 태양을 따라 돌며 신호를 보내는 착륙선'],['표현 아이디어','패널이 꽃잎처럼 펼쳐지고 해를 따라 돌며 LED 가 켜지는 모형'],['과학 근거','$P=P_0\\cos\\theta$ · 하루 에너지 · 서보 소비 vs 이득'],['전시 구성','전등으로 태양을 만들어 직접 움직여 보는 체험 + 하루 출력 곡선 포스터']]],
    fails:[['추적 장치가 흔들린다','제어 이득을 낮추고 불감대(±5°)를 둔다 — 서보 소비도 줄어든다'],['LDR 값이 서로 달라 한쪽으로만 돈다','4 개 센서를 같은 환경에서 보정(밝은 정면 기준)'],['하루 측정이 구름으로 엉망','같은 시간대 기록을 병렬로(고정 · 추적), 비율로 비교']],
    up:['<b>6번 탭 연결</b> — 하루 에너지를 배터리 용량 · 전력 예산과 연결.','<b>2 축 → 1 축</b> — 한 축 추적과 2 축의 이득 비교.','<b>착륙 후 임무</b> — 태양 추적 전력으로 LoRa 비콘을 며칠간 유지.'],
    next:['원리⑤ 전력 · 충격 · 안전',6],
    eval:[['창의성','구조 · 전시 아이디어'],['정확성','하루 에너지 적분 · 서보 소비 측정'],['해석','코사인 법칙과 이득의 한계를 설명'],['안전','서보 · 배터리 · 야외 전원 안전']],
    tip:'고정 · 추적의 하루 출력 곡선 두 개를 한 그래프에 그려 「면적 차이」가 이득임을 색칠해 보여 주세요.' };
})();
SIMS.C08={ q:'패널 고정 각과 추적 오차를 바꾸면 하루 에너지(고정 대 추적)는 어떻게 달라질까?',
  a:{nm:'고정 패널 각 β (90° = 수평)',min:0,max:180,step:5,val:90,unit:'°',d:0}, b:{nm:'추적 오차',min:0,max:40,step:1,val:5,unit:'°',d:0},
  cap1:'태양이 동쪽에서 서쪽으로 지나가는 하루(12 시간)를 10 초로 압축했습니다. 파랑 = 고정 패널, 초록 = 추적 패널(법선이 태양을 향함).',
  cap2:'📊 하루 출력 곡선(고정 = 파랑, 추적 = 초록) — 색칠한 면적 = 하루 에너지, 아래 숫자 = 고정 대비.',
  note:'모형 : 동서 방향 2차원 어림. 태양 방향각 $\\phi=\\pi t/12$ (t = 0 ~ 12 h, 항상 맑음), 고정 패널 출력 $\\max(0,\\cos(\\phi-\\beta))$, 추적 = $\\cos(\\text{오차})$, 패널 1 W, 서보 평균 30 mW(12 h = 0.36 Wh). 실제는 계절 · 남중 고도 · 구름으로 달라집니다.',
  anim:function(ctx,w,h,t,beta,err,S){ var q=c08(beta,err), phi=Math.PI*Math.min(1,t/10), cx=w*0.5, cy=h-60, R=Math.min(w*0.4,h*0.72); ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); skyBg(ctx,w,cy+10); groundBg(ctx,w,h,cy+10);
    ctx.strokeStyle=COL.hint; ctx.setLineDash([4,5]); ctx.beginPath(); ctx.arc(cx,cy+10,R,Math.PI,0); ctx.stroke(); ctx.setLineDash([]);
    var sx=cx-R*Math.cos(phi), sy=cy+10-R*Math.sin(phi); cvCirc(ctx,sx,sy,12,COL.light,COL.amber,2);
    function panel(px,py,ang,col,lab,pw){ ctx.save(); ctx.translate(px,py); ctx.rotate(-ang); ctx.fillStyle='#1e3a8a'; ctx.strokeStyle=col; ctx.lineWidth=2; ctx.fillRect(-26,-3,52,6); ctx.strokeRect(-26,-3,52,6); ctx.restore(); cvLine(ctx,[[px,py],[px,py+22]],COL.dev,2); cvText(ctx,lab,px,py+36,col,'bold 11px system-ui,sans-serif','center'); cvText(ctx,(pw*100).toFixed(0)+' %',px,py+52,COL.text,'11px system-ui,sans-serif','center'); }
    var nf=Math.PI/2-(beta*Math.PI/180), pf=Math.max(0,Math.cos(phi-beta*Math.PI/180)); panel(cx-90,cy-40,(beta*Math.PI/180)-Math.PI/2+0.0,COL.blue,'고정 β='+beta+'°',pf);
    var pt=Math.cos(err*Math.PI/180); panel(cx+90,cy-40,phi-Math.PI/2+err*Math.PI/180,COL.ok,'추적(오차 '+err+'°)',pt);
    cvLine(ctx,[[sx,sy],[cx-90,cy-40]],'rgba(253,224,71,.5)',1.2,[3,3]); cvLine(ctx,[[sx,sy],[cx+90,cy-40]],'rgba(253,224,71,.5)',1.2,[3,3]);
    cvText(ctx,'시각 '+(6+12*Math.min(1,t/10)).toFixed(1)+' 시 · 태양 방향각 '+(phi*180/Math.PI).toFixed(0)+'° (동 0° → 서 180°)',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,beta,err,S){ var q=c08(beta,err), P=makePlot(ctx,w,h,{xmin:0,xmax:12,ymin:0,ymax:1.1,xlabel:'시간 (태양이 뜬 뒤 h)',ylabel:'상대 출력 P/P₀',title:'하루 출력 곡선',left:54,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}), i;
    ctx.fillStyle='rgba(56,189,248,.18)'; ctx.beginPath(); ctx.moveTo(P.X(0),P.Y(0)); for(i=0;i<q.ser.t.length;i++) ctx.lineTo(P.X(q.ser.t[i]),P.Y(q.ser.f[i])); ctx.lineTo(P.X(12),P.Y(0)); ctx.closePath(); ctx.fill();
    plotLine(ctx,P,q.ser.t.map(function(tt,k){ return [tt,q.ser.f[k]]; }),COL.blue,2.2); plotLine(ctx,P,q.ser.t.map(function(tt,k){ return [tt,q.ser.k[k]]; }),COL.ok,2.2);
    legend(ctx,P.x1-210,P.y1+14,[['고정 : '+q.Ef.toFixed(2)+' Wh',COL.blue],['추적 : '+q.Et.toFixed(2)+' Wh (서보 후 '+q.Etn.toFixed(2)+')',COL.ok]]); },
  kv:function(beta,err,S){ var q=c08(beta,err); return [['고정 하루 에너지',q.Ef.toFixed(2)+' Wh','a'],['추적 하루 에너지',q.Et.toFixed(2)+' Wh'],['서보 후 순에너지',q.Etn.toFixed(2)+' Wh','g'],['고정 대비 순이득',((q.gain-1)*100).toFixed(0)+' %','v2'],['평균 cos θ (추적)',Math.cos(err*Math.PI/180).toFixed(3),'r']]; } };

/* ── C09 : 착륙 챌린지 게임 — 점수식 설계와 공정성 ───────────────────────── */
function c09run(d0, sw, seed){ var r=rng32(seed*911+Math.round(d0*3)+Math.round(sw*100)), res=[], i; for(i=0;i<60;i++){ var wx=3+sw*gaussR(r), wy=0.5*sw*gaussR(r); var g=guideSim({h0:300,vs:5,LD:2.5,wind:[wx,wy],p0:[-180,120],target:[0,0],gps:3,dt:0.1,turn:1,rng:r}); var d=g.miss; res.push({x:g.x[g.x.length-1],y:g.y[g.y.length-1],d:d,s:100*Math.exp(-(d/d0)*(d/d0))}); } return res; }
(function(){
  var r1=c09run(20,1,1), s1=r1.map(function(q){ return q.s; }), d1=r1.map(function(q){ return q.d; }), r2=c09run(20,3,1), r3=c09run(5,1,1), s3=r3.map(function(q){ return q.s; });
  PROJ.C09={ id:'C09', t:'착륙 챌린지 게임 — 바람이 바뀌어도 공정한 점수식 만들기', icon:'🎮', type:'창의 · 게임 · 대회 설계', lv:2, dur:'3주', cost:'0 ~ 2만 원',
    one:'4번 탭의 유도 시뮬레이션을 이용해 「착륙 정밀도 대회」의 규칙과 점수식 $S=100e^{-(d/d_0)^2}$ 을 설계한다. 바람이 바뀌는 60 번의 비행으로 점수 분포 · 변별력 · 운(바람)의 영향을 분석해 공정한 득점 반경 $d_0$ 를 정한다.',
    q:'득점 반경 $d_0$ 를 크게 / 작게 하면 점수 분포는 어떻게 달라질까? 바람 변동이 클 때 실력이 같은 팀의 점수 순위는 얼마나 뒤섞일까?',
    why:'「잘 설계된 대회」는 <b>실력은 점수에 반영하고 운은 줄이는</b> 규칙입니다. 점수식 하나가 팀 전략 · 공정성 · 흥미를 모두 바꿉니다. 시뮬레이션으로 60 번의 대회를 미리 돌려 보고 규칙을 고치는 것 자체가 데이터 과학 · 게임 설계입니다.',
    link:'교과서 확률과 통계(분포 · 평균 · 표준편차) · 4번 탭 유도 · R08(GPS 분포) · 17번 탭 [종합3].',
    fig:FIGS.C09.fig, tg:FIGS.C09.tg,
    cap:'풍선에서 방출(왼쪽) → 바람 w ± σ(가운데) → 목표 과녁(오른쪽)에 얼마나 가까이 착륙하는가. 점수식(아래 왼쪽)과 점수판(아래 가운데)으로 순위를 매기고 규칙 문서(아래 오른쪽)에 적는다',
    parts:[['방출 위치 X₀','바람 위쪽 거리','대회 규칙에서 방출 위치를 고정할지 팀이 고를지 정한다. 위치 선택이 전략이 된다.'],
           ['바람 변동 σ','평균 ± 변동','풍속이 라운드마다 달라지는 정도. 크면 운의 요소가 커진다.'],
           ['목표 과녁','반경 d₀','득점 반경. 작으면 정밀도 경쟁, 크면 완주 경쟁.'],
           ['점수식','S = 100·e^{−(d/d₀)²}','거리 d 가 d₀ 이면 약 37 점, 0 이면 100 점. 연속적이라 순위가 세밀하다.'],
           ['점수판','평균 · 순위','60 라운드 평균 점수와 순위. 같은 팀을 여러 번 돌려 순위 안정성 평가.'],
           ['규칙 문서','1 쪽 요약','방출 · 질량 · 안전 · 점수 · 동점 처리까지. 학교 대회로 실제 운영 가능.']],
    budget:[['컴퓨터(시뮬레이션)','1','보유','—'],['과녁 현수막 · 줄자(실제 대회 시)','1 세트','약 1만 원','분필'],['점수 기록지 · 시트','—','무료','—'],['(선택) 드론 · 풍선','—','대여','C10']],
    steps:['4번 탭의 방법으로 유도 낙하 한 번의 착륙 오차 d 를 구한다(바람 3 m/s, L/D 2.5, GPS 3 m).','바람 변동 σ_w 를 0 ~ 3 m/s 로 바꿔 60 번 시뮬레이션하고 착륙 오차 분포를 본다.','득점 반경 $d_0$ 를 5 · 20 · 50 m 로 바꿔 점수식을 적용하고 점수 분포 · 순위 변별력을 비교한다.','같은 팀을 두 번 대회에 내보내 순위가 얼마나 달라지는지(재현성)를 본다.','분석 결과로 최종 득점 반경과 규칙 문서를 작성하고 실제 학교 대회에서 시험한다.'],
    vars:['득점 반경 $d_0$ · 풍속 변동 σ_w','점수 분포 · 평균 · 표준편차 · 순위 안정성','L/D · GPS 오차 · 방출 위치 · 라운드 수'],
    predict:[['d₀ = 20 m · σ_w = 1 m/s','평균 착륙 오차 '+fx(mean(d1),1)+' m · 평균 점수 '+fx(mean(s1),0)+' · 표준편차 '+fx(stdev(s1),0),'점수식 100·e^{−(d/20)²}'],
             ['바람 변동 3 m/s (큰 변동)','평균 오차 '+fx(mean(r2.map(function(q){ return q.d; })),1)+' m → 점수 '+fx(mean(r2.map(function(q){ return q.s; })),0),'운의 영향이 커져 같은 실력의 팀 사이 점수 차가 커진다'],
             ['d₀ = 5 m (매우 엄격)','평균 점수 '+fx(mean(s3),0)+' (만점 근처 거의 없음)','변별력은 높아지지만 대부분이 0 점 근처 → 흥미 하락'],
             ['공정한 d₀ 선택','평균 점수가 50 ~ 70 점 근처이면서 표준편차가 큰 값','점수 분포가 넓게 퍼질수록 실력 차이를 구분하기 쉽다']],
    data:{cols:['d₀ (m)','σ_w (m/s)','평균 오차 (m)','평균 점수','점수 표준편차','만점(≥90) 비율'],
          rows:[[5,1,r3],[20,1,r1],[50,1,c09run(50,1,1)],[20,3,r2]].map(function(q){ var ss=q[2].map(function(z){ return z.s; }), dd=q[2].map(function(z){ return z.d; }); return [q[0],q[1],fx(mean(dd),1),fx(mean(ss),0),fx(stdev(ss),0),fx(ss.filter(function(x){ return x>=90; }).length/ss.length*100,0)+' %']; })},
    analysis:'점수 분포의 평균 · 표준편차 · 상위 10 % 기준을 $d_0$ 별로 비교하고, 같은 팀을 N 회 반복했을 때 순위의 표준편차를 구해 재현성을 측정한다(순위 변동이 작을수록 공정). 점수식을 $S=100e^{-(d/d_0)^2}$ 대신 선형 $S=\\max(0,100-d)$ 로 바꿨을 때의 분포 차이도 비교한다.',
    special:['🎨 작품 기획서',[['작품 이름','「착륙 챌린지」 — 바람을 이기는 교내 캔위성 대회'],['표현 아이디어','팀별 캐릭터 · 순위판 · 라이브 방송(점수 즉시 표시)'],['과학 근거','착륙 오차 분포(레일리) · 점수식 · 순위 안정성'],['전시 구성','시뮬레이션 게임 부스 + 규칙 문서 + 실제 낙하 시연']]],
    fails:[['모두 만점 또는 모두 0 점','d₀ 를 조정해 평균이 50 ~ 70 점이 되게'],['운이 너무 크다','라운드 수를 늘리고 3 회 평균 · 풍속이 비슷한 구간에서만 경기'],['규칙이 모호하다','방출 위치 · 질량 · 동점 처리 · 안전 규정을 한 쪽 문서로']],
    up:['<b>종합3 연결</b> — 착륙 오차 분포를 분석한 것을 규칙 설계에 사용.','<b>R08</b> — GPS 오차가 점수에 주는 영향 분석.','<b>실제 대회</b> — 풍선 방출(C10)로 학교 행사 · 한국 캔위성 경연대회 준비 연습.'],
    next:['[종합3] 복귀 정밀도 — 오차 분포',17],
    eval:[['창의성','규칙 · 점수식 · 게임 요소의 독창성'],['분석','분포 · 순위 안정성을 숫자로 평가'],['공정성','운 요소를 줄이는 설계 근거'],['실행 가능성','안전 · 예산 · 시간 계획']],
    tip:'점수 분포 히스토그램을 d₀ 별로 나란히 보여 주고 「이 d₀ 가 가장 공정한 까닭」을 설명하세요.' };
})();
SIMS.C09={ q:'득점 반경과 바람 변동을 바꾸면 점수 분포와 대회의 변별력은 어떻게 달라질까?',
  a:{nm:'득점 반경 d₀',min:5,max:60,step:1,val:20,unit:'m',d:0}, b:{nm:'바람 변동 σ_w',min:0,max:3,step:0.25,val:1,unit:'m/s',d:2},
  cap1:'60 번의 유도 낙하(바람 평균 3 ± σ_w, L/D 2.5, GPS 3 m)의 착륙 위치. 색 = 점수(빨강 낮음 → 초록 높음), 원 = 득점 반경.',
  cap2:'📊 점수 분포(막대) 와 점수식 곡선(노랑). 평균이 중간이고 넓게 퍼질수록 좋은 규칙입니다.',
  note:'모형 : guideSim — 방출점 (−180, 120) m, 침하 5 m/s, 고도 300 m, GPS 잡음 3 m(1 Hz), 풍속 3 ± σ_w m/s(동), 남북 0.5σ_w. 점수 S = 100·exp(−(d/d₀)²). 시드가 같은 고정된 60 라운드입니다.',
  anim:function(ctx,w,h,t,d0,sw,S){ var key=d0+'_'+sw+'_'+S.seed; if(!S.cache||S.cache.key!==key) S.cache={key:key,res:c09run(d0,sw,S.seed)}; var res=S.cache.res, n=Math.max(1,Math.floor(t/10*res.length)), cx=w/2, cy=h/2+6, xs=res.map(function(q){ return Math.abs(q.x); }), ys=res.map(function(q){ return Math.abs(q.y); }), R=Math.max(d0*1.6,quantile(xs.concat(ys),0.95)*1.3,15), sc=Math.min(w,h)/2/R*0.92, i;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle=COL.plotbg; ctx.fillRect(8,8,w-16,h-16);
    [d0,2*d0].forEach(function(r,k){ cvCirc(ctx,cx,cy,r*sc,k?null:'rgba(251,191,36,.08)',COL.amber,k?0.8:1.4); cvText(ctx,r.toFixed(0)+' m',cx+r*sc*0.72,cy-r*sc*0.72-4,COL.amber,'10px system-ui,sans-serif'); });
    cvLine(ctx,[[cx-8,cy],[cx+8,cy]],COL.grav,2); cvLine(ctx,[[cx,cy-8],[cx,cy+8]],COL.grav,2);
    var sm=0; for(i=0;i<n;i++){ var q=res[i], px=cx+q.x*sc, py=cy-q.y*sc; if(px<14||px>w-14||py<14||py>h-14) continue; sm+=q.s; var g=q.s/100; cvCirc(ctx,px,py,4,'rgb('+Math.round(251*(1-g)+52*g)+','+Math.round(113*(1-g)+211*g)+','+Math.round(133*(1-g)+153*g)+')',COL.ptEdge,0.6); }
    var ss=res.slice(0,n).map(function(q){ return q.s; }); cvText(ctx,'라운드 '+n+' / '+res.length+' · 평균 점수 '+mean(ss).toFixed(0),12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,d0,sw,S){ var res=(S.cache&&S.cache.key===d0+'_'+sw+'_'+S.seed)? S.cache.res : c09run(d0,sw,S.seed), ss=res.map(function(q){ return q.s; }), nb=10, bins=[], i; for(i=0;i<nb;i++) bins.push(0); ss.forEach(function(s){ bins[Math.min(nb-1,Math.floor(s/10))]++; });
    var P=makePlot(ctx,w,h,{xmin:0,xmax:100,ymin:0,ymax:Math.max.apply(null,bins)*1.25+1,xlabel:'점수',ylabel:'횟수(60 라운드)',title:'점수 분포',left:54,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    ctx.fillStyle=COL.histFill; for(i=0;i<nb;i++){ var x0=P.X(i*10), x1=P.X((i+1)*10), y=P.Y(bins[i]); ctx.fillRect(x0+1,y,x1-x0-2,P.y0-y); }
    plotLine(ctx,P,[[mean(ss),0],[mean(ss),Math.max.apply(null,bins)*1.25+1]],COL.ok,1.6,[5,4]);
    cvText(ctx,'평균 '+mean(ss).toFixed(0)+' · 표준편차 '+stdev(ss).toFixed(0),P.x1-8,P.y1+14,COL.ok,'11.5px system-ui,sans-serif','right'); },
  kv:function(d0,sw,S){ var res=(S.cache&&S.cache.key===d0+'_'+sw+'_'+S.seed)? S.cache.res : c09run(d0,sw,S.seed), ss=res.map(function(q){ return q.s; }), dd=res.map(function(q){ return q.d; }); return [['평균 착륙 오차',mean(dd).toFixed(1)+' m','a'],['평균 점수',mean(ss).toFixed(0)],['점수 표준편차',stdev(ss).toFixed(0),'g'],['상위 10 % 기준',quantile(ss,0.9).toFixed(0)+' 점','v2'],['만점(≥90) 비율',(ss.filter(function(x){ return x>=90; }).length/ss.length*100).toFixed(0)+' %','r']]; } };

/* ── C10 : 풍선 방출 시스템 — 부력과 상승 속도 ───────────────────────────── */
function c10(D0, pay){ var V=Math.PI/6*D0*D0*D0, gross=(SUBJ.rho0-0.169)*V, mb=0.1*Math.pow(D0/1.2,2), net=gross-mb-pay, A=Math.PI*D0*D0/4, v=net>0? Math.sqrt(2*net*SUBJ.g/(SUBJ.rho0*0.47*A)):0; return {V:V, gross:gross, mb:mb, net:net, v:v, t300:v>0?300/v:Infinity, free:net>0?net/(mb+pay):0}; }
(function(){
  var a=c10(1.5,0.5), b=c10(1.0,0.5), c=c10(2.0,1.0), d=c10(1.5,1.0);
  PROJ.C10={ id:'C10', t:'풍선 방출 시스템 설계 — 부력과 상승 속도로 높이 정하기', icon:'🎈', type:'창의 · 시스템 설계', lv:2, dur:'4주', cost:'약 3 ~ 6만 원',
    one:'헬륨 풍선으로 캔위성을 수백 m 까지 올려 방출하는 시스템을 설계한다. 풍선 지름 · 탑재 질량으로 순부력 $F=(\\rho_{\\text{공기}}-\\rho_{He})Vg-mg$ 과 상승 속도 $v=\\sqrt{2F/\\rho C_dA}$ 를 계산하고, 300 m 도달 시간 · 헬륨 양을 정한다.',
    q:'지름 1.5 m 풍선으로 0.5 kg 을 올리면 순부력과 상승 속도는? 탑재 질량을 2 배로 하면 속도는 어떻게 변하고 언제 못 뜨게 될까?',
    why:'한국 캔위성 경연대회의 방출 방식인 <b>기구(풍선)</b>를 직접 설계해 봅니다. 「얼마나 큰 풍선이 필요한가」「얼마나 빨리 올라가는가」는 부력 · 항력 · 질량 세 가지의 균형 문제이고, 계산이 틀리면 풍선이 안 뜨거나 너무 빨리 날아가 버립니다.',
    link:'교과서 부력(아르키메데스) · 이상기체(밀도) · 힘의 평형 · 종단속도(2번 탭) · 3번 탭(기압 · 고도).',
    fig:FIGS.C10.fig, tg:FIGS.C10.tg,
    cap:'풍선(왼쪽)에 헬륨(가운데)을 채우고 줄 끝 방출 장치(오른쪽)에 캔위성을 단다. 부력식(아래 왼쪽) → 상승 속도(아래 가운데) → 안전과 규정(아래 오른쪽)',
    parts:[['풍선(라텍스)','지름 1 ~ 2.5 m · 질량 100 g급','고무 풍선의 질량과 파열 지름을 데이터시트로 확인. 파열 지름이 가까워지면 위험.'],
           ['헬륨 가스','밀도 0.17 kg/m³','공기(1.225)보다 가벼워 $\\Delta\\rho=1.06$ kg/m³. 부피 1 m³ 당 약 1 kg 을 든다. 가스 취급 안전(고압 용기 고정).'],
           ['줄 · 방출 장치','서보 · 나크롬선 · 타이머','정해진 고도(기압)에서 줄을 끊거나 걸쇠를 열어 캔위성을 분리. 비행 허가 필요 시 상한 고도 준수.'],
           ['부력 계산','F = Δρ V g − mg','풍선 · 줄 · 방출 장치 · 캔위성 질량을 모두 합한 총 질량 m. 순부력이 양이어야 뜬다.'],
           ['상승 속도','v = √(2F/ρC_dA)','Cd ≈ 0.47(구). 순부력 클수록 빠르다. 수백 m 까지 올라가는 시간 = 높이 ÷ v.'],
           ['안전 · 규정','허가 · 장소 · 풍속','풍선 · 비행체는 항공 안전 규정 대상일 수 있음 — 반드시 사전 확인. 전선 · 도로 · 공항 근처 금지.']],
    budget:[['라텍스 기상 풍선 100 ~ 600 g급','1','약 1 ~ 3만 원','학교 과학실 풍선'],['헬륨 가스(대여 · 구입)','1 회','약 3 ~ 8만 원','행사 업체'],['방출 장치(서보 + 타이머)','1','약 1.5만 원','나크롬선 + 타이머'],['줄 · 낙하산 · 캔위성 모형','1 세트','약 1만 원','—'],['GPS 트래커 · 풍속계','1','보유 · 대여','—']],
    steps:['목표 고도(예 300 m), 캔위성 + 방출 장치 + 줄의 총 질량을 정한다(예 0.5 kg).','풍선 지름 $D_0$ 후보(1.0 · 1.5 · 2.0 m)로 순부력 · 상승 속도 · 300 m 도달 시간을 계산한다.','헬륨 부피(리터)와 비용을 계산해 예산과 비교하고 풍선을 선택한다.','실내(체육관)에서 줄을 짧게 하여 순부력(자유 부양력)을 저울로 시험한다.','허가된 장소에서 방출 시험을 하고 GPS · 영상으로 상승 속도를 재 모형과 비교한다.'],
    vars:['풍선 지름 $D_0$ · 탑재 질량 m','순부력 · 상승 속도 · 도달 시간','헬륨 순도 · 온도 · 풍속 · 풍선 질량'],
    predict:[['D₀ 1.5 m · 탑재 0.5 kg','순부력 '+fx(a.net,2)+' kg · 상승 '+fx(a.v,1)+' m/s · 300 m 까지 '+fx(a.t300,0)+' 초 · He '+fx(a.V*1000,0)+' L','$F=(1.225-0.169)Vg-m_bg-m g$'],
             ['D₀ 1.0 m (작은 풍선)','순부력 '+fx(b.net,2)+' kg → '+(b.net>0?'상승 '+fx(b.v,1)+' m/s':'뜨지 못함'),'부피 ∝ D³ — 지름이 작아지면 급격히 약해진다'],
             ['탑재 1.0 kg (D₀ 1.5 m)','순부력 '+fx(d.net,2)+' kg · 상승 '+fx(d.v,1)+' m/s','질량이 늘면 순부력 · 속도 모두 감소'],
             ['D₀ 2.0 m · 탑재 1.0 kg','순부력 '+fx(c.net,2)+' kg · 상승 '+fx(c.v,1)+' m/s · He '+fx(c.V*1000,0)+' L','큰 풍선은 부피 효과가 크다(그러나 바람에 더 휘둘린다)']],
    data:{cols:['D₀ (m)','탑재 (kg)','헬륨 (L)','총 부력 (kg)','순부력 (kg)','상승 속도 (m/s)','300 m (s)'],
          rows:[[1.0,0.5],[1.5,0.5],[1.5,1.0],[2.0,1.0],[2.0,1.5]].map(function(q){ var r=c10(q[0],q[1]); return [q[0],q[1],fx(r.V*1000,0),fx(r.gross,2),fx(r.net,2),fx(r.v,1),r.net>0? fx(r.t300,0):'—']; })},
    analysis:'순부력을 저울로 잰 값과 계산값을 비교하고(자유 부양력), 상승 속도를 GPS 고도 · 시간으로 구해 모형과 비교한다. 상승하면 풍선이 팽창하고(기압 ↓) 항력과 부력이 변하며 파열 고도에 이르는 점을 $V(h)=V_0P_0/P(h)$ 로 논의한다. 한계 : 풍선 질량 · 온도 · 순도 오차가 순부력에 ±10 %.',
    special:['🎨 작품 기획서',[['작품 이름','「학교 위의 기구」 — 우리 팀 캔위성 방출 시스템'],['표현 아이디어','풍선에 팀 로고를 그리고 발사 카운트다운 · 실시간 고도 방송'],['과학 근거','부력 · 항력 · 힘의 평형 · 이상기체'],['전시 구성','순부력 계산표 + 실내 부양 시험 영상 + 안전 규정 서약서']]],
    fails:[['풍선이 안 뜬다 · 느리다','순부력(저울)을 먼저 측정, 탑재 질량 줄이기 · 풍선 키우기'],['풍선이 너무 빨리 올라 높이를 못 맞춘다','순부력을 줄이기(헬륨 덜 채우기), 상승 속도 모형으로 방출 고도를 시간 · 기압으로 지정'],['방출 장치가 작동하지 않는다','전원 · 타이머 · 걸쇠를 지상에서 3 회 시험, 이중 방출 장치']],
    up:['<b>R04 연결</b> — 방출 고도별 바람 이동 거리 실측.','<b>발명 01</b> — 기압 · 고도 센서로 자동 방출 · 낙하산 전개.','<b>C07 연결</b> — 상승하며 기온 · PM 프로파일을 측정해 스모그 지도.'],
    next:['발명 · 자동 낙하산 전개 장치 (I01)',12],
    eval:[['설계','부력 · 속도 계산으로 풍선 크기 · 양을 정당화'],['시험','자유 부양력 · 상승 속도를 측정해 모형 검증'],['안전 · 규정','허가 · 장소 · 비상 계획'],['창의성','방출 방식 · 발표']],
    tip:'「풍선 지름 – 탑재 질량」 평면에 뜨는 영역(순부력 > 0)을 색으로 칠해 보여 주면 설계 근거가 분명해집니다.' };
})();
SIMS.C10={ q:'풍선 지름과 탑재 질량을 바꾸면 순부력과 상승 속도는? 어디서부터 못 뜰까?',
  a:{nm:'풍선 지름 D₀',min:0.6,max:2.5,step:0.1,val:1.5,unit:'m',d:1}, b:{nm:'탑재 질량',min:0.2,max:2.0,step:0.1,val:0.5,unit:'kg',d:1},
  cap1:'풍선이 상승합니다(화살표 : 파랑 = 순부력, 빨강 = 총 무게). 순부력이 0 이하이면 뜨지 못합니다.',
  cap2:'📊 위 : 순부력 대 탑재 질량(풍선 지름 1.0 · 1.5 · 2.0 m). 아래 : 상승 속도 대 탑재 질량. 점 = 지금.',
  note:'모형 : 헬륨 밀도 0.169, 공기 1.225 kg/m³, 풍선 질량 0.1 kg·(D₀/1.2)², 구형 항력 Cd 0.47, 지표면 값(상승하며 팽창 · 파열은 무시). 교육용 어림 — 실제 풍선 사양은 제품 데이터시트를 확인하세요.',
  anim:function(ctx,w,h,t,D0,pay,S){ var q=c10(D0,pay), gy=h-34, top=30, sc=(gy-top-100)/300, hh=Math.min(300,q.v*t*3), cx=w*0.4, rpx=Math.max(14,D0*22);
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy); ctx.strokeStyle=COL.axis; ctx.lineWidth=1; ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle'; [0,100,200,300].forEach(function(k){ var yy=gy-k*sc-70; ctx.beginPath(); ctx.moveTo(30,yy); ctx.lineTo(38,yy); ctx.stroke(); ctx.fillText(k+' m',2,yy); });
    var by=gy-hh*sc-70-rpx; ctx.fillStyle='rgba(251,191,36,.25)'; ctx.strokeStyle=COL.amber; ctx.lineWidth=1.8; ctx.beginPath(); ctx.ellipse(cx,by,rpx*0.85,rpx,0,0,6.2832); ctx.fill(); ctx.stroke(); cvLine(ctx,[[cx,by+rpx],[cx,by+rpx+34]],COL.dev,1.4); drawCan(ctx,cx-9,by+rpx+34,30);
    var sF=22, up=Math.max(0,q.net+q.mb+pay)*sF*0.9, dn=(q.mb+pay)*sF*0.9; arrow2(ctx,cx+rpx+18,by,cx+rpx+18,by-up,COL.blue,3); arrow2(ctx,cx+rpx+40,by,cx+rpx+40,by+dn,COL.grav,3);
    cvText(ctx,'총 부력 '+q.gross.toFixed(2)+' kg',cx+rpx+24,by-up-8,COL.blue,'11px system-ui,sans-serif'); cvText(ctx,'무게 '+(q.mb+pay).toFixed(2)+' kg',cx+rpx+46,by+dn+12,COL.grav,'11px system-ui,sans-serif');
    cvText(ctx,q.net>0?('순부력 '+q.net.toFixed(2)+' kg · 상승 '+q.v.toFixed(1)+' m/s · 300 m 까지 '+q.t300.toFixed(0)+' s · He '+(q.V*1000).toFixed(0)+' L'):'⚠ 순부력 ≤ 0 : 뜨지 못합니다',12,16,q.net>0?COL.text:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,D0,pay,S){ var hh=Math.floor(h*0.5), i, cols=[COL.blue,COL.ok,COL.iner]; ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    subPlot(ctx,0,0,w,hh,{xmin:0.2,xmax:2,ymin:-2,ymax:6,ylabel:'순부력 (kg)',title:'순부력 대 탑재 질량',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [1.0,1.5,2.0].forEach(function(D,k){ plotLine(ctx,P,[[0.2,c10(D,0.2).net],[2,c10(D,2).net]],cols[k],D===+D0.toFixed(1)?3:1.6); }); plotLine(ctx,P,[[0.2,c10(D0,0.2).net],[2,c10(D0,2).net]],COL.amber,3); plotLine(ctx,P,[[0.2,0],[2,0]],COL.grav,1.2,[4,3]); plotPoints(ctx,P,[[pay,c10(D0,pay).net]],COL.amber,6.5); legend(ctx,P.x1-120,P.y1+14,[['D₀ 1.0 m',cols[0]],['D₀ 1.5 m',cols[1]],['D₀ 2.0 m',cols[2]],['지금',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.2,xmax:2,ymin:0,ymax:8,xlabel:'탑재 질량 (kg)',ylabel:'상승 속도 (m/s)',title:'상승 속도 대 탑재 질량',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [1.0,1.5,2.0].forEach(function(D,k){ var Lp=[],x; for(x=0.2;x<=2.001;x+=0.05) Lp.push([x,c10(D,x).v]); plotLine(ctx,P,Lp,cols[k],1.6); }); plotPoints(ctx,P,[[pay,c10(D0,pay).v]],COL.amber,6.5); }); },
  kv:function(D0,pay,S){ var q=c10(D0,pay); return [['헬륨 부피',(q.V*1000).toFixed(0)+' L','a'],['순부력',q.net.toFixed(2)+' kg'+(q.net<=0?' ⚠':''),'g'],['상승 속도',q.v.toFixed(1)+' m/s'],['300 m 까지',q.net>0? q.t300.toFixed(0)+' s':'—','v2'],['자유 부양력 비',(q.free*100).toFixed(0)+' %','r']]; } };
