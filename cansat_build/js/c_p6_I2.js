/* ═══════════════════════════════════════════════════════════════════════════
   발명 I06 ~ I10 : 지향 안테나 지상국 · 착지점 예측 앱 · 회수 비컨 · 열화상 관측기 · 리액션 휠
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I06 : 지향 안테나 지상국 — 링크 예산과 지향 오차 ─────────────────────── */
var I06 = { F:433, N:3.2, PTX:10, SENS:-100, REQ:800 };
function i06hp(Gdb){ return Math.min(180, Math.sqrt(30000/Math.pow(10,Gdb/10))); }                     // 반전력 빔폭 ≈ √(30000/G)
function i06gain(Gdb, off){ var hp=i06hp(Gdb); return Gdb - Math.min(30, 12*Math.pow(off/hp,2)); }       // 주엽 안 : 12 (θ/HPBW)² dB 감소
function i06range(Gdb, off){ var pl=I06.PTX+0+i06gain(Gdb,off)-I06.SENS; return Math.pow(10,(pl-pl1m(I06.F))/(10*I06.N)); }
(function(){
  var a=i06range(3,0), b=i06range(12,0), c=i06range(12,30), d=i06range(12,60);
  PROJ.I06={ id:'I06', t:'지향 안테나 지상국 — 안테나 이득과 지향 오차의 거래', icon:'📡', type:'발명 · 통신', lv:2, dur:'3 ~ 4주', cost:'약 3 ~ 6만 원',
    one:'야기(Yagi) 형 지향 안테나와 삼각대 · 방위 눈금으로 캔위성을 따라가며 수신한다. 이득이 클수록 멀리 닿지만 빔폭이 좁아 지향 오차에 민감해진다 — 이득과 빔폭의 균형을 설계한다.',
    q:'지상국 안테나 이득을 높이면 통신거리가 얼마나 늘고, 캔위성이 빔에서 벗어나면 얼마나 줄어들까? 최적 이득은?',
    why:'<b>더 센 안테나가 항상 좋은 것은 아닙니다.</b> 이득 G 가 클수록 빔폭이 좁아져 낙하하는 캔위성을 놓치기 쉽습니다. 링크 예산(dB)으로 계산하는 습관과 「지향 오차 대 이득」의 거래(trade-off)를 직접 체험합니다.',
    link:'5번 탭(전파와 통신 · 링크 예산) · R05 · R07 · 도구함의 RSSI 로거 · 발명 08(회수 비컨).',
    fig:FIGS.I06.fig, tg:FIGS.I06.tg,
    cap:'야기 안테나(왼쪽)를 삼각대(가운데)에 세우고 수신기(오른쪽)로 신호를 받는다. 이득 곡선(왼쪽 아래)에 따라 통신거리가 달라지고, 노트북(가운데 아래)이 신호 세기를 기록하며 방위 눈금(오른쪽 아래)으로 지향 방향을 읽는다',
    parts:[['지향 안테나','야기 · 이득 6 ~ 12 dBi','소자 수가 많을수록 이득 ↑ 빔폭 ↓. 자작 가능(구리선 · 줄자).'],
           ['삼각대 · 방위각 장치','사진 삼각대 + 각도기','방위(좌우)와 고도각(상하)을 손으로 돌리며 따라간다.'],
           ['수신기','LoRa 모듈(국내 허용 대역 · 인증품)','수신 세기 RSSI(dBm)를 USB 로 기록. 감도 약 −100 dBm.'],
           ['안테나 이득 곡선','G(θ) = G₀ − 12 (θ/HPBW)²','빔 가운데에서 어긋날수록 이득이 줄어든다(근사).'],
           ['노트북 로그','시간 · 방위 · RSSI 기록','측정값으로 이론(경로 손실 모형)과 비교한다.'],
           ['방위 눈금','0 ~ 360° · 5° 눈금','지향 오차를 같은 방법으로 재기 위해 기준선을 그린다.']],
    budget:[['LoRa 송 · 수신 모듈','2 세트','약 3만 원','—'],['야기 안테나(자작 재료)','1','약 1만 원','구리선 · 막대'],['삼각대 · 각도기','1','약 1만 원','보유'],['USB 연결 · 노트북','1','보유','—'],['방위 눈금 판','1','약 3천 원','종이']],
    steps:['야기 안테나 없이(막대 안테나) 거리 50 · 100 · 200 m 에서 RSSI 를 측정해 경로 손실 지수 n 을 구한다(5번 탭).','같은 거리에서 야기 안테나를 정면으로 향해 RSSI 증가(= 이득 차이, dB)를 구한다.','거리 100 m 에서 안테나를 5° 씩 돌려 방위 대 RSSI 곡선을 그리고 반전력 빔폭(−3 dB)을 구한다.','구한 이득 · 빔폭으로 링크 예산을 계산해 최대 통신거리 곡선(지향 오차 포함)을 예측하고 측정과 비교한다.','캔위성(또는 드론)이 이동하는 시나리오에서 사람이 따라가며 지향하는 데 허용되는 오차를 정한다.'],
    vars:['안테나 이득 G · 지향 오차 θ','수신 세기 RSSI · 최대 통신거리','거리 · 장애물 · 송신 출력 · 주파수'],
    predict:[['이득 3 dBi · 정면','최대 통신거리 약 '+fx(a,0)+' m','링크 예산 : $P_{tx}+G-P_{sens}=PL_{\\max}$, $d=10^{(PL_{\\max}-PL_{1m})/10n}$'],
             ['이득 12 dBi · 정면','약 '+fx(b,0)+' m ('+fx(b/a,1)+' 배)','이득 +9 dB 는 거리 약 '+fx(Math.pow(10,9/32),1)+' 배'],
             ['이득 12 dBi · 지향 오차 30°','약 '+fx(c,0)+' m','빔폭 '+fx(i06hp(12),0)+'° 이므로 30° 오차는 이득 손실 약 '+fx(12-i06gain(12,30),1)+' dB'],
             ['이득 12 dBi · 지향 오차 60°','약 '+fx(d,0)+' m','빔 밖으로 벗어나면 이득이 크게 줄어 이득이 없는 것보다 못한 경우도 생긴다']],
    data:{cols:['이득 (dBi)','빔폭 (°)','지향 오차 (°)','유효 이득 (dBi)','통신거리 (m)','필요 800 m 대비'],
          rows:[[3,0],[7,0],[12,0],[12,15],[12,30],[12,60]].map(function(q){ var r=i06range(q[0],q[1]); return [q[0],fx(i06hp(q[0]),0),q[1],fx(i06gain(q[0],q[1]),1),fx(r,0),r>=I06.REQ?'충분':'부족']; })},
    analysis:'지향 오차 대 통신거리 그래프를 이득별로 그려 「이 이득이 허용하는 오차」를 구한다. 낙하하는 캔위성을 사람이 따라갈 수 있는 지향 정밀도(보통 ±10° 안팎)가 가능하면 이득을 높이고, 그렇지 않으면 이득을 낮춰(빔폭 ↑) 안정적으로 수신하는 편이 낫다는 결론을 낸다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','낙하 중 통신이 끊겨 데이터를 잃는다'],['새로운 점','캔위성 궤적(방위 · 고도각)을 예측해 안테나를 따라 움직이게 하는 보조 지향 눈금(또는 모터 지향)'],['구성','야기 안테나 · 삼각대 · 방위 눈금 · 수신기 · 로거'],['효과 · 한계','통신거리 증가 / 빔폭이 좁아 추적 오차에 민감']]],
    fails:[['안테나를 돌려도 RSSI 가 안 변한다','편파(수직 · 수평) 일치 확인, 케이블 점검, 주변 금속 · 사람 위치'],['측정할 때마다 값이 흔들린다','같은 위치 10 회 평균, 사람 몸 · 지면 반사의 영향 줄이기'],['빔폭 이론과 측정이 다르다','근사식이므로 측정 곡선으로 대체, 주변 반사 확인']],
    up:['<b>모터 추적</b> — 서보 · 스텝 모터로 방위 자동 추적(발명 02 와 연계).','<b>예측 지향</b> — 낙하 궤적 예측(I07)으로 안테나 선행 이동.','<b>다이버시티</b> — 안테나 2 개로 신호 큰 쪽 선택.'],
    next:['원리⑤ 전파와 통신',5],
    eval:[['발명성','지향 보조 방식의 아이디어'],['정량 평가','링크 예산 vs 측정 비교'],['설계 판단','이득과 빔폭의 거래 근거'],['명세서','한계의 서술']],
    tip:'지향 오차 대 통신거리 곡선에서 「필요한 거리」 가로선과 만나는 점이 허용 오차 — 이 한 장이 설계의 결론이 됩니다.' };
})();
SIMS.I06={ q:'안테나 이득과 지향 오차를 바꾸면 통신거리는 어떻게 달라질까? (필요 거리 800 m)',
  a:{nm:'안테나 이득 G',min:0,max:16,step:1,val:10,unit:'dBi',d:0}, b:{nm:'지향 오차 θ',min:0,max:90,step:5,val:20,unit:'°',d:0},
  cap1:'위에서 본 지상국. 노랑 = 안테나 빔 패턴(극좌표), 점 = 캔위성. 빔 중심(실선)에서 어긋날수록 유효 이득이 줄어듭니다.',
  cap2:'📊 지향 오차 대 통신거리(이득 3 · 8 · 13 dBi와 지금). 가로 점선 = 필요 거리 800 m. 점 = 지금 설정.',
  note:'모형 : 계산용 주파수 433 MHz(실제 사용은 국내 허용 대역 · 출력 규정 준수) · 송신 10 dBm · 수신 감도 −100 dBm · 경로 손실 지수 n = 3.2 · 송신 안테나 0 dBi. 빔폭 HPBW ≈ √(30000/G선형), 지향 오차에 의한 이득 손실 ≈ 12 (θ/HPBW)² dB(주엽 근사). 교육용 어림이며 실제 안테나 패턴은 측정이 필요합니다.',
  anim:function(ctx,w,h,t,G,off,S){ var cx=w*0.36, cy=h/2+10, R=Math.min(w*0.3,h*0.42), hp=i06hp(G), i, pts=[], ang0=0;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle=COL.plotbg; ctx.fillRect(8,8,w-16,h-16);
    [0.5,1].forEach(function(f){ cvCirc(ctx,cx,cy,R*f,null,COL.gridln,1); });
    for(i=-180;i<=180;i+=3){ var g=Math.max(0.03,Math.pow(10,i06gain(G,Math.abs(i))/20)/Math.pow(10,G/20)); pts.push([cx+R*g*Math.cos(i*Math.PI/180),cy-R*g*Math.sin(i*Math.PI/180)]); } cvLine(ctx,pts.concat([pts[0]]),COL.amber,2);
    cvLine(ctx,[[cx,cy],[cx+R*1.05,cy]],COL.amber,1.4,[4,3]); cvText(ctx,'안테나 방향',cx+R*1.05,cy-8,COL.amber,'10px system-ui,sans-serif','right');
    var r2=R*0.92, a2=off*Math.PI/180+Math.sin(t*0.9)*0.0; cvCirc(ctx,cx+r2*Math.cos(a2),cy-r2*Math.sin(a2),6,COL.ok,null,0); cvLine(ctx,[[cx,cy],[cx+r2*Math.cos(a2),cy-r2*Math.sin(a2)]],COL.ok,1.4); cvText(ctx,'캔위성 (오차 '+off+'°)',cx+r2*Math.cos(a2)+8,cy-r2*Math.sin(a2),COL.ok,'11px system-ui,sans-serif');
    cvCirc(ctx,cx,cy,4,COL.text,null,0); cvText(ctx,'지상국',cx-6,cy+16,COL.text,'11px system-ui,sans-serif','right');
    var rg=i06range(G,off), ok=rg>=I06.REQ, x0=w*0.72; cvText(ctx,'빔폭 '+hp.toFixed(0)+'°',x0,40,COL.text,'12px system-ui,sans-serif'); cvText(ctx,'유효 이득 '+i06gain(G,off).toFixed(1)+' dBi',x0,62,COL.text,'12px system-ui,sans-serif'); cvText(ctx,'통신거리 '+rg.toFixed(0)+' m',x0,90,ok?COL.ok:COL.grav,'bold 15px system-ui,sans-serif'); cvText(ctx,ok?'필요 800 m 충족':'필요 800 m 부족',x0,114,ok?COL.ok:COL.grav,'12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,G,off,S){ var Gs=[3,8,13], cols=[COL.blue,COL.ok,COL.violet||COL.amber], os=[], i; for(i=0;i<=90;i+=3) os.push(i);
    var P=makePlot(ctx,w,h,{xmin:0,xmax:90,ymin:0,ymax:Math.ceil(i06range(16,0)*1.1/100)*100,xlabel:'지향 오차 θ (°)',ylabel:'통신거리 (m)',title:'지향 오차 대 통신거리',left:60,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    Gs.forEach(function(g,k){ plotLine(ctx,P,os.map(function(o){ return [o,i06range(g,o)]; }),cols[k],1.8); }); plotLine(ctx,P,os.map(function(o){ return [o,i06range(G,o)]; }),COL.amber,2.8); plotLine(ctx,P,[[0,I06.REQ],[90,I06.REQ]],COL.grav,1.4,[5,4]);
    plotPoints(ctx,P,[[off,i06range(G,off)]],COL.amber,7); legend(ctx,P.x1-140,P.y1+14,[['3 dBi',cols[0]],['8 dBi',cols[1]],['13 dBi',cols[2]],['지금 '+G+' dBi',COL.amber],['필요 800 m',COL.grav]]); },
  kv:function(G,off,S){ var r=i06range(G,off), best=0, bo=0, o; for(o=0;o<=90;o+=1){ if(i06range(G,o)>=I06.REQ) bo=o; } return [['통신거리',r.toFixed(0)+' m','a'],['반전력 빔폭',i06hp(G).toFixed(0)+' °'],['유효 이득',i06gain(G,off).toFixed(1)+' dBi','g'],['허용 지향 오차(800 m)',(i06range(G,0)>=I06.REQ? bo+' °':'정면에서도 부족'),'v2'],['판정',r>=I06.REQ?'✅ 충분':'❌ 부족','r']]; } };

/* ── I07 : 착지점 예측 앱 — 바람 시어와 외삽 오차 ────────────────────────── */
var I07 = { H0:500, VS:6 };
function i07drift(z, w10, al){ return w10*Math.pow(10,-al)*Math.pow(z,1+al)/(I07.VS*(1+al)); }          // 고도 z 에서 땅까지 바람에 밀리는 거리
function i07wind(z, w10, al){ return w10*Math.pow(Math.max(z,1)/10, al); }                              // 고도 z 의 풍속(멱법칙)
function i07err(z, w10, al){ var naive=i07wind(z,w10,al)*z/I07.VS; return Math.abs(naive-i07drift(z,w10,al)); }
(function(){
  var a=i07err(300,5,0.2), b=i07err(100,5,0.2), c=i07err(300,5,0.4), d=i07err(300,10,0.2);
  PROJ.I07={ id:'I07', t:'착지점 예측 앱 — 낙하 중 바람 정보로 착륙 위치 미리 알기', icon:'🗺️', type:'발명 · 소프트웨어', lv:2, dur:'3 ~ 4주', cost:'약 1 ~ 3만 원',
    one:'GPS 위치 · 고도 · 속도를 지상국 스마트폰 앱으로 받아 「지금 위치 + 현재 바람 × 남은 시간」으로 착지점을 계산해 지도 위 원(불확실 영역)으로 보여 준다. 바람이 고도에 따라 달라지는 시어(shear)가 외삽 오차를 만든다.',
    q:'현재 속도로 착지점을 외삽하면 높은 고도에서는 얼마나 틀릴까? 바람 시어 지수가 클수록 오차는 어떻게 변할까?',
    why:'회수 · 점수 모두 「어디에 떨어질까」를 알면 유리합니다. 가장 단순한 예측(현재 속도 외삽)이 <b>고도에 따라 틀리는 이유</b>(바람 시어)를 직접 계산해 보고, 예측 원(불확실 영역)을 그리는 이유를 이해합니다. 소프트웨어 · 통계 · 기상의 만남.',
    link:'4번 탭(바람과 낙하 궤적) · R08 · 발명 02(자동 조향) · 발명 08(회수 비컨) · 도구함의 GPS 코드.',
    fig:FIGS.I07.fig, tg:FIGS.I07.tg,
    cap:'지상국 스마트폰 앱(왼쪽)이 고도별 풍속(가운데)과 낙하 궤적(오른쪽)으로 착지 위치를 계산(왼쪽 아래)해 지도(가운데 아래)에 불확실 영역(오른쪽 아래)을 그린다',
    parts:[['스마트폰 앱','웹앱 · MIT App Inventor','수신한 위치 · 고도를 받아 계산해 지도에 표시. 간단히는 스프레드시트도 가능.'],
           ['고도별 풍속','10 m · 100 m · 300 m 의 풍속','바람은 위로 갈수록 세다. 사전 기상 정보 또는 풍선 · 연 측정.'],
           ['낙하 궤적','위치 · 속도 시계열','GPS 로 얻은 위치로 현재 수평 속도 계산.'],
           ['계산식','x ≈ x₀ + v_h·(h/v_s)','현재 수평 속도 v_h 와 남은 시간 h/v_s 로 외삽. 바람 시어 보정은 추가 항.'],
           ['지도 격자','OpenStreetMap · 좌표 변환','위도 · 경도 → 미터 변환(소규모에서 평면 근사).'],
           ['불확실 영역','예측 오차를 반지름으로 한 원','남은 고도가 낮을수록 원이 작아진다 — 이 반경이 예측의 정직한 표현.']],
    budget:[['스마트폰(이미 보유)','1','—','—'],['수신기 · 안테나(I06 공유)','1 세트','—','—'],['GPS 모듈(캔위성 쪽)','1','약 1.5만 원','—'],['풍속계 또는 앱','1','약 1만 원','무료 앱'],['지도 서비스','—','무료','—']],
    steps:['GPS 로그(R08 과 같은 데이터)에서 위치 · 시각 → 수평 속도 $v_h$ 를 계산한다.','각 시각마다 「현재 위치 + v_h · (고도 / 침하속도)」로 착지점을 외삽하고 실제 착지와의 거리 오차를 구한다.','남은 고도(오차) 그래프를 그린다 — 높을 때 크고 낮아질수록 0 으로 수렴하는지 확인.','고도별 풍속 정보(사전 풍속 측정)를 넣은 보정식으로 다시 계산해 오차를 비교한다.','불확실 영역(원) 반지름을 오차 곡선으로 정해 지도에 표시하고 회수팀에게 보여 준다.'],
    vars:['고도(남은 높이) · 바람 시어 지수 · 침하속도','예측 오차(m) · 불확실 반지름','GPS 갱신 주기 · 잡음 · 기상 정보 정확도'],
    predict:[['남은 고도 300 m · 풍속 5 m/s · α 0.2','외삽 오차 약 '+fx(a,0)+' m','바람이 위로 갈수록 세므로 위쪽 바람이 땅 근처보다 더 많이 밀지만 현재 값으로 일정하게 가정하면 과다 예측'],
             ['남은 고도 100 m','약 '+fx(b,0)+' m','고도가 낮아질수록 $z^{1+\\alpha}$ 로 급감'],
             ['α 0.4(강한 시어) · 300 m','약 '+fx(c,0)+' m','시어가 클수록 외삽 오차 증가(약 '+fx(c/a,1)+' 배)'],
             ['풍속 10 m/s · 300 m','약 '+fx(d,0)+' m','풍속에 비례(2 배)']],
    data:{cols:['남은 고도 (m)','풍속 10 m (m/s)','α','현재 풍속 (m/s)','외삽 오차 (m)','착지까지 (s)'],
          rows:[[500,5,0.2],[300,5,0.2],[100,5,0.2],[30,5,0.2],[300,5,0.4],[300,10,0.2]].map(function(q){ return [q[0],q[1],q[2],fx(i07wind(q[0],q[1],q[2]),1),fx(i07err(q[0],q[1],q[2]),0),fx(q[0]/I07.VS,0)]; })},
    analysis:'남은 고도 대 예측 오차 그래프(로그 · 로그)를 그려 기울기가 $1+\\alpha$ 근처인지 확인한다. 이론 외삽(현재 속도)과 보정(프로파일) 오차를 비교하고, 회수팀이 믿을 수 있는 불확실 반지름을 정한다. 실제 GPS 로그에서 구한 오차와 비교해 모형의 한계(난류 · 풍향 변화)를 논의한다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','캔위성이 어디에 떨어질지 몰라 회수에 오래 걸린다'],['새로운 점','남은 고도에 비례하는 불확실 반지름을 가진 착지 예측 원(바람 시어 보정 포함)'],['구성','GPS 데이터 수신 · 계산 앱 · 지도 표시'],['효과 · 한계','회수 시간 단축 / 난류 · 풍향 변화 · GPS 지연에 취약']]],
    fails:[['착지점이 계속 흔들린다','수평 속도를 이동평균(5 샘플)으로 안정화, 낮은 고도에서만 신뢰'],['예측 위치가 지도에서 어긋난다','위도 · 경도 → 미터 변환 확인, GPS 좌표 순서(위도, 경도) 점검'],['데이터가 끊긴다','마지막으로 받은 값 기준으로 예측 유지 + 경과 시간 표시']],
    up:['<b>기상청 풍속 연동</b> — 고도별 풍속 예보로 사전 계산.','<b>몬테카를로</b> — 바람 오차를 난수로 100 번 시뮬레이션해 확률 원 그리기.','<b>유도 낙하와 결합</b> — 예측이 목표에서 벗어나면 조향 명령(발명 02).'],
    next:['원리④ 바람과 낙하 궤적',4],
    eval:[['발명성','예측 + 불확실성 표시의 설계'],['정량 평가','남은 고도별 오차 곡선'],['소프트웨어','좌표 변환 · 필터 구현'],['명세서','한계(난류)의 서술']],
    tip:'지도 위에 「예측점 + 오차 원」이 시간에 따라 줄어들며 수렴하는 장면은 이 발명의 가장 설득력 있는 시연입니다.' };
})();
SIMS.I07={ q:'바람 시어가 있을 때 「현재 속도로 외삽」한 착지 예측은 남은 고도에 따라 얼마나 틀릴까?',
  a:{nm:'지표 풍속 w₁₀',min:0,max:12,step:0.5,val:5,unit:'m/s',d:1}, b:{nm:'바람 시어 지수 α',min:0,max:0.5,step:0.05,val:0.2,unit:'',d:2},
  cap1:'낙하하는 캔(옆에서 본 모습)과 예측 착지점. 파랑 = 실제 궤적, 노랑 점선 = 현재 속도로 외삽한 예측, 빨강 점 = 실제 착지.',
  cap2:'📊 남은 고도에 따른 외삽 예측 오차. 높을수록 크고 땅 근처에서 0 으로 줄어듭니다. 점 = 지금 고도.',
  note:'모형 : 침하 6 m/s 로 500 m 에서 낙하, 바람 w(z)=w₁₀(z/10 m)^α(멱법칙). 실제 이동 거리 = ∫w/v_s dz. 외삽 예측 = 현재 풍속 × 남은 시간. 바람 방향은 일정(동쪽)으로 가정한 교육용 어림입니다.',
  anim:function(ctx,w,h,t,w10,al,S){ var gy=h-30, x0=50, Xmax=i07drift(I07.H0,w10,al)*1.1+40, sx=(w-x0-30)/Xmax, sy=(gy-40)/I07.H0, tt=Math.min(I07.H0/I07.VS, t/10*(I07.H0/I07.VS)), z=I07.H0-I07.VS*tt, xr=i07drift(I07.H0,w10,al)-i07drift(z,w10,al), i, pts=[];
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    for(i=0;i<=40;i++){ var zz=I07.H0*(1-i/40); pts.push([x0+(i07drift(I07.H0,w10,al)-i07drift(zz,w10,al))*sx, gy-zz*sy]); } cvLine(ctx,pts,COL.dim,1,[3,3]);
    var cp=[]; for(i=0;i<=40;i++){ var z2=Math.max(z,I07.H0*(1-i/40)); if(z2<z-1e-9) break; }
    var cur=[x0+xr*sx, gy-z*sy], land=x0+i07drift(I07.H0,w10,al)*sx, pred=x0+(xr+i07wind(z,w10,al)*z/I07.VS)*sx;
    var tr=[]; for(i=0;i<=40;i++){ var zt=I07.H0-(I07.H0-z)*i/40; tr.push([x0+(i07drift(I07.H0,w10,al)-i07drift(zt,w10,al))*sx, gy-zt*sy]); } cvLine(ctx,tr,COL.blue,2.2);
    cvLine(ctx,[cur,[pred,gy]],COL.amber,1.6,[5,4]); cvCirc(ctx,pred,gy,5,COL.amber,null,0); cvCirc(ctx,land,gy,5,COL.grav,null,0); cvCirc(ctx,cur[0],cur[1],5,COL.ok,null,0);
    cvText(ctx,'예측 착지',pred,gy-12,COL.amber,'11px system-ui,sans-serif','center'); cvText(ctx,'실제 착지',land,gy+16,COL.grav,'11px system-ui,sans-serif','center');
    cvText(ctx,'남은 고도 '+z.toFixed(0)+' m · 예측 오차 '+(Math.abs(pred-land)/sx).toFixed(0)+' m',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,w10,al,S){ var zs=[], i; for(i=0;i<=50;i++) zs.push(10+i*9.8); var ymax=Math.max(20,i07err(500,w10,al)*1.15);
    var P=makePlot(ctx,w,h,{xmin:0,xmax:500,ymin:0,ymax:ymax,xlabel:'남은 고도 z (m)',ylabel:'외삽 예측 오차 (m)',title:'예측 오차는 남은 고도에 따라 줄어든다',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    plotLine(ctx,P,zs.map(function(z){ return [z,i07err(z,w10,al)]; }),COL.amber,2.4); plotLine(ctx,P,zs.map(function(z){ return [z,i07err(z,w10,0.4)]; }),COL.violet||COL.blue,1.4,[4,3]); plotLine(ctx,P,zs.map(function(z){ return [z,i07err(z,w10,0.1)]; }),COL.blue,1.4,[4,3]);
    plotPoints(ctx,P,[[300,i07err(300,w10,al)]],COL.amber,6.5); legend(ctx,P.x1-150,P.y1+14,[['지금 α '+al.toFixed(2),COL.amber],['α 0.4(점선)',COL.violet||COL.blue],['α 0.1(점선)',COL.blue]]); },
  kv:function(w10,al,S){ return [['오차(남은 300 m)',i07err(300,w10,al).toFixed(0)+' m','a'],['오차(남은 100 m)',i07err(100,w10,al).toFixed(0)+' m'],['오차(남은 30 m)',i07err(30,w10,al).toFixed(1)+' m','g'],['총 이동 거리',i07drift(I07.H0,w10,al).toFixed(0)+' m','v2'],['500 m 에서 착지까지',(I07.H0/I07.VS).toFixed(0)+' s']]; } };

/* ── I08 : 회수 비컨 — RSSI 로 찾아가는 「뜨거워 · 차가워」 ─────────────── */
var I08 = { N:2.7, STEP:10, WALK:1.4 };
function i08walk(d0, sg, seed){ var r=rng32(seed*131+Math.round(sg*10)+d0), ang=r()*6.2832, x=d0*Math.cos(ang), y=d0*Math.sin(ang), hd=r()*6.2832, path=[[x,y]], steps=0, i;
  function rssi(px,py){ return -10*I08.N*Math.log10(Math.max(1,Math.hypot(px,py))) + sg*gaussR(r); }
  var r0=rssi(x,y);
  while(Math.hypot(x,y)>8 && steps<500){ x+=I08.STEP*Math.cos(hd); y+=I08.STEP*Math.sin(hd); steps++; var r1=rssi(x,y); if(r1<r0){ hd+=2.1+0.6*(r()-0.5); } r0=r1; path.push([x,y]); }
  return {steps:steps, time:steps*(I08.STEP/I08.WALK+1), path:path, found:Math.hypot(x,y)<=8}; }
function i08stat(d0, sg){ var ts=[], f=0, i; for(i=0;i<24;i++){ var q=i08walk(d0,sg,i+1); ts.push(q.time); if(q.found) f++; } return {t:mean(ts)/60, ok:f/24*100}; }
(function(){
  var a=i08stat(100,2), b=i08stat(100,8), c=i08stat(300,2), d=i08stat(300,8);
  PROJ.I08={ id:'I08', t:'회수 비컨 — 신호 세기(RSSI)로 캔위성 찾아가기', icon:'🔔', type:'발명 · 회수', lv:2, dur:'3 ~ 4주', cost:'약 3 ~ 5만 원',
    one:'착지한 캔위성이 주기적으로 신호(비컨)를 보내고, 사람이 수신기로 신호 세기(RSSI)를 보며 「뜨거워 · 차가워」 방식으로 찾아간다. 신호 잡음 σ 와 처음 거리에 따라 수색 시간이 어떻게 달라지는지 시뮬레이션한다.',
    q:'RSSI 잡음이 커지면 찾아가는 데 시간이 얼마나 더 걸릴까? 몇 m 에서부터 신호만으로 방향을 정할 수 없을까?',
    why:'「캔위성을 잃어버렸다」는 실제로 가장 흔한 실패입니다. 거리가 가까울수록 RSSI 가 더 많이 변해(로그) 가까울수록 찾기 쉽고, <b>멀리서는 잡음에 묻혀</b> 방향을 모릅니다 — 로그 거리 모형의 직접 응용입니다.',
    link:'5번 탭(경로 손실 · RSSI) · 발명 06(지향 안테나) · 발명 07(착지 예측) · R05(통신 거리).',
    fig:FIGS.I08.fig, tg:FIGS.I08.tg,
    cap:'캔위성의 부저(왼쪽)와 송신 모듈(가운데)이 신호를 보내고 안테나(오른쪽)로 방사한다. 수신 신호 세기 막대(왼쪽 아래)를 보며 사람이 가까워진다(가운데 아래). 소형 전지(오른쪽 아래)가 며칠 신호를 유지한다',
    parts:[['부저','수동형 · 2.7 kHz','마지막 100 m 이내에서는 소리로 찾는다. 전력 소모 주의(간헐 울림).'],
           ['송신 모듈','LoRa · 10 dBm(인증 모듈 · 허용 대역)','착지 후 5 초마다 짧은 패킷 전송. 대기 전류 μA 급 절전.'],
           ['안테나','1/4 파장 막대','캔 위로 세운다. 눕혀 있으면 감도 저하.'],
           ['RSSI 막대','수신기 화면 · LED 막대','신호 세기를 막대 · 소리 높낮이로 표현(청각화, 창의 03 과 연결).'],
           ['찾는 방법','가기 · 비교 · 회전','10 m 가서 RSSI 가 커지면 직진, 작아지면 방향 전환(뜨거워 · 차가워).'],
           ['소형 전지','CR123A · 리튬','저전력 모드로 며칠 유지.']],
    budget:[['LoRa 송 · 수신 모듈','2 세트','약 3만 원','—'],['부저 · 배터리 홀더','1 세트','약 5천 원','—'],['안테나 재료','1','약 3천 원','—'],['수신기 화면(OLED)','1','약 1.5만 원','스마트폰 앱'],['방수 케이스','1','약 3천 원','—']],
    steps:['거리 10 · 20 · 50 · 100 m 에서 RSSI 를 5 회씩 측정해 평균 · 표준편차를 구하고 로그 거리 모형으로 n 을 구한다(5번 탭).','잡음 σ(표준편차)를 구한다. 이 값이 시뮬레이션의 σ 로 쓰인다.','숨긴 캔위성을 시작점 100 m 에서 「뜨거워 · 차가워」 규칙(10 m 이동)으로 찾아가며 걸린 시간을 5 회 재고 시뮬레이션과 비교한다.','안테나를 눕혔을 때 · 세웠을 때, 사람 몸 앞 · 뒤로 둘 때 RSSI 변화를 비교한다.','시간 · 성공률을 σ 와 시작 거리 별 표로 정리한다.'],
    vars:['RSSI 잡음 σ · 시작 거리 · 걸음 간격','수색 시간 · 성공률','안테나 방향 · 주변 장애물'],
    predict:[['시작 100 m · σ 2 dB','평균 수색 시간 약 '+fx(a.t,0)+' 분 · 성공 '+fx(a.ok,0)+' %','가까워질수록 RSSI 가 더 크게 변해 방향이 잘 보인다'],
             ['시작 100 m · σ 8 dB','약 '+fx(b.t,0)+' 분 · 성공 '+fx(b.ok,0)+' %','잡음이 커지면 방향 판단이 틀려 헤맨다'],
             ['시작 300 m · σ 2 dB','약 '+fx(c.t,0)+' 분','거리에 비례해 시간이 늘어난다'],
             ['시작 300 m · σ 8 dB','약 '+fx(d.t,0)+' 분 · 성공 '+fx(d.ok,0)+' %','멀리서 잡음이 크면 방향을 잡기 어려워 방향성 안테나(발명 06)가 필요']],
    data:{cols:['시작 거리 (m)','RSSI 잡음 σ (dB)','평균 수색 시간 (분)','성공 (%)','10 m 이동 시 RSSI 변화 (dB)','판단 가능 거리 (m)'],
          rows:[[100,2],[100,4],[100,8],[300,2],[300,4],[300,8]].map(function(q){ var r=i08stat(q[0],q[1]), dl=10*I08.N*Math.log10(q[0]/(q[0]-10)); return [q[0],q[1],fx(r.t,0),fx(r.ok,0),fx(dl,2),fx(4.34*I08.N*I08.STEP/q[1],0)]; })},
    analysis:'수색 시간 대 σ(시작 거리별) 그래프를 그린다. 「10 m 이동할 때 RSSI 변화 Δ ≈ 4.34 n · 10/d (dB)」 가 잡음 σ 보다 작아지는 거리 $d^*\\approx43\\,n/\\sigma$ 보다 멀면 방향 판단이 거의 동전 던지기가 됨을 이론과 시뮬레이션으로 확인한다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','착지한 캔위성을 못 찾아 회수에 실패한다'],['새로운 점','RSSI 청각화 + 「가기 · 비교 · 회전」 절차를 앱이 안내하는 회수 보조'],['구성','비컨 송신 · 수신기 · 안내 앱 · 부저'],['효과 · 한계','수색 시간 단축 / 멀리서는 잡음 · 반사로 방향이 불확실']]],
    fails:[['RSSI 가 튄다','5 회 평균 후 사용, 사람 몸이 안테나를 가리지 않게'],['캔위성 신호가 약하다','안테나를 세우고 케이스를 비금속으로, 송신 출력 · 주기 조정'],['전지가 며칠 못 간다','신호 주기 늘리기(5 s → 30 s), 부저는 가까울 때만']],
    up:['<b>방향 탐지</b> — 안테나 2 개로 RSSI 차이를 비교(발명 06).','<b>GPS 마지막 위치</b> — 낙하 중 마지막 수신 위치와 결합(발명 07).','<b>청각화</b> — RSSI 를 음높이로 변환해 시선 없이 찾기(창의 03).'],
    next:['원리⑤ 전파와 통신',5],
    eval:[['발명성','회수 절차 · 앱 안내의 아이디어'],['정량 평가','수색 시간 · 성공률 표'],['실험','잡음 σ · n 측정의 정직성'],['명세서','한계 서술']],
    tip:'「10 m 이동 시 RSSI 변화 vs 잡음」 비교 그래프로 몇 m 에서 방향이 보이는지 보여 주면 설계의 근거가 됩니다.' };
})();
SIMS.I08={ q:'RSSI 잡음과 처음 거리를 바꾸면 「뜨거워 · 차가워」 방식의 수색은 얼마나 걸릴까?',
  a:{nm:'RSSI 잡음 σ',min:0,max:10,step:0.5,val:3,unit:'dB',d:1}, b:{nm:'처음 거리',min:50,max:500,step:10,val:150,unit:'m',d:0},
  cap1:'위에서 본 수색 경로(시뮬레이션 첫 시도). 가운데 = 캔위성(비컨), 노랑 선 = 사람의 경로. 10 m 이동마다 RSSI 가 줄면 방향을 바꿉니다.',
  cap2:'📊 평균 수색 시간 대 잡음 σ(처음 거리 100 · 200 · 400 m와 지금, 24 회 평균). 점 = 지금 설정.',
  note:'모형 : RSSI = −10 n log₁₀ d + 가우시안 잡음(σ), n = 2.7. 10 m 걷기 + 측정 1 초, 이동 속도 1.4 m/s, 8 m 안에 들어가면 발견(소리로). 최대 500 걸음. 같은 시드(고정)이므로 새 측정으로 다른 시도를 보세요.',
  anim:function(ctx,w,h,t,sg,d0,S){ var q=i08walk(d0,sg,S.seed), R=Math.max(d0*1.25,60), sc=Math.min(w,h*1.4)/2/R*0.9, cx=w/2, cy=h/2+4, n=Math.min(q.path.length-1,Math.floor(t/10*(q.path.length-1))), i, pts=[];
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle=COL.plotbg; ctx.fillRect(8,8,w-16,h-16);
    [d0/2,d0].forEach(function(r){ cvCirc(ctx,cx,cy,r*sc,null,COL.gridln,1); cvText(ctx,r.toFixed(0)+' m',cx+r*sc*0.72,cy-r*sc*0.72,COL.dim,'10px system-ui,sans-serif'); });
    for(i=0;i<=n;i++) pts.push([cx+q.path[i][0]*sc,cy-q.path[i][1]*sc]); if(pts.length>1) cvLine(ctx,pts,COL.amber,1.8);
    cvCirc(ctx,cx,cy,6,COL.grav,null,0); cvText(ctx,'캔위성',cx+10,cy,COL.grav,'11px system-ui,sans-serif'); cvCirc(ctx,pts[0][0],pts[0][1],4,COL.dim,null,0); var cur=pts[pts.length-1]; cvCirc(ctx,cur[0],cur[1],5,COL.ok,null,0);
    cvText(ctx,'걸음 '+n+' / '+q.steps+' · '+(q.found?'발견 ('+(q.time/60).toFixed(1)+' 분)':'500 걸음 안에 못 찾음'),12,16,q.found?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,sg,d0,S){ var sgs=[0.5,1,2,3,4,5,6,8,10], ds=[100,200,400], cols=[COL.blue,COL.ok,COL.violet||COL.amber], cur=i08stat(d0,sg);
    var P=makePlot(ctx,w,h,{xmin:0.5,xmax:10,ymin:0,ymax:60,xlabel:'RSSI 잡음 σ (dB)',ylabel:'평균 수색 시간 (분)',title:'잡음이 클수록, 멀수록 오래 걸린다',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    ds.forEach(function(d,k){ plotLine(ctx,P,sgs.map(function(s){ return [s,Math.min(60,i08stat(d,s).t)]; }),cols[k],1.8); }); plotPoints(ctx,P,[[Math.max(0.5,sg),Math.min(60,cur.t)]],COL.amber,7); legend(ctx,P.x1-130,P.y1+14,[['100 m',cols[0]],['200 m',cols[1]],['400 m',cols[2]],['지금',COL.amber]]); },
  kv:function(sg,d0,S){ var q=i08stat(d0,sg), dl=10*I08.N*Math.log10(d0/(d0-10)); return [['평균 수색 시간',q.t.toFixed(1)+' 분','a'],['성공률',q.ok.toFixed(0)+' %'],['10 m 이동 시 RSSI 변화',dl.toFixed(2)+' dB','g'],['잡음 대비',sg>0? (dl/sg).toFixed(2)+' 배' : '∞','v2'],['판단 가능 거리',sg>0? (4.34*I08.N*I08.STEP/sg).toFixed(0)+' m' : '—','r']]; } };

/* ── I09 : 열화상 낙하 관측기 — 해상도와 고도 ─────────────────────────── */
var I09 = { FOV:55, NX:32, NY:24, TAMB:15, DT:30, NETD:3 };
function i09foot(h){ return 2*h*Math.tan(I09.FOV/2*Math.PI/180)/I09.NX; }                                   // 한 칸이 보는 지상 폭(m)
function i09frac(h, dsp){ var f=i09foot(h); return Math.min(1, Math.PI*(dsp/2)*(dsp/2)/(f*f)); }              // 열점이 한 칸에서 차지하는 비율(한 칸 중앙)
function i09(h, dsp){ var fp=i09foot(h), fr=i09frac(h,dsp), c=I09.DT*fr; return {foot:fp, width:fp*I09.NX, frac:fr, cont:c, ok:c>=I09.NETD, cells:Math.max(1,Math.PI*(dsp/2)*(dsp/2)/(fp*fp))}; }
(function(){
  var a=i09(100,3), b=i09(300,3), c=i09(300,10), d=i09(100,1);
  PROJ.I09={ id:'I09', t:'열화상 낙하 관측기 — 고도에 따라 열점이 보이는 한계', icon:'🌡️', type:'발명 · 센서', lv:3, dur:'4 ~ 6주', cost:'약 8 ~ 15만 원',
    one:'32×24 열화상 센서(MLX90640 등)를 캔위성에 달아 낙하하며 지상의 열점(사람 · 불씨 · 동물)을 찾는다. 고도가 높을수록 한 칸이 넓어져 작은 열점은 주변 온도와 섞여 안 보인다 — 검출 한계 고도를 계산한다.',
    q:'열점 크기가 3 m 일 때 몇 m 고도까지 열화상으로 찾을 수 있을까? 해상도(칸 수)를 2 배로 하면 한계 고도는 어떻게 변할까?',
    why:'열화상 카메라가 「작은 열점을 놓치는 까닭」은 해상도가 아니라 <b>한 칸 안에서 열점이 차지하는 비율(필 팩터)</b> 때문입니다. 지상 분해능(GSD)과 검출 한계를 계산해 보며 원격탐사 · 재난 구조 응용을 이해합니다.',
    link:'3번 · 4번 탭(고도 · 낙하) · 창의 02(낙하 영상) · 창의 07(스모그 지도) · 발명 05(영상 안정화).',
    fig:FIGS.I09.fig, tg:FIGS.I09.tg,
    cap:'열화상 센서(왼쪽, 32×24)가 시야각 55°(가운데)로 지상의 열점(오른쪽)을 본다. 해상도 격자(왼쪽 아래)가 한 칸의 크기를 정하고 온도 색 막대(가운데 아래)로 표시, SD 카드(오른쪽 아래)에 저장한다',
    parts:[['열화상 센서','MLX90640 · 32×24 · 55°','가격 약 7만 원. 해상도가 낮은 대신 가볍고 I²C 로 간단히 읽는다.'],
           ['시야각 FOV','55° (가로)','고도 h 에서 가로 폭 $W=2h\\tan(\\mathrm{FOV}/2)$.'],
           ['지상 열점','사람 · 불씨 · 열 패널','온도 차 ΔT 약 +10 ~ 30 K. 크기가 작으면 칸 안에서 비율이 작다.'],
           ['해상도 격자','32 × 24 칸','한 칸 폭 = W/32 ≈ 고도 100 m 에서 3.3 m.'],
           ['온도 색 막대','저온 → 고온 가짜색','범위 설정(자동 · 고정) 방법에 따라 열점이 달라 보인다.'],
           ['저장','SD · 시리얼 로그','프레임당 768 칸 온도 값 · 시간 · 고도 함께 저장.']],
    budget:[['열화상 센서 MLX90640','1','약 7 ~ 10만 원','저해상도 8×8 AMG8833(약 3만 원)'],['아두이노 · 연결선','1 세트','약 2만 원','—'],['SD 모듈','1','약 3천 원','—'],['전지 · 케이스','1 세트','약 5천 원','—'],['열 패널(모의 열점)','1','약 1만 원','손난로 · 사람']],
    steps:['지상에서 센서로 손 · 컵 · 사람을 찍어 온도 값(칸당)과 색 표시를 확인한다.','센서를 높은 곳(건물 · 연 · 드론)에 올려 고도 10 · 30 · 50 m 에서 같은 열점(손난로)을 기록한다.','열점이 보이는 최대 고도를 측정하고 이론(필 팩터)과 비교한다.','열점 크기(지름 1 · 3 m 열 패널)를 바꾸어 한계 고도를 비교한다.','검출 한계 고도 대 열점 크기 그래프로 정리하고 센서 해상도를 2 배(가상)로 했을 때를 예측한다.'],
    vars:['고도 h · 열점 크기 d','칸당 대비 온도(필 팩터 × ΔT) · 검출 여부','센서 해상도 · FOV · 노이즈 NETD'],
    predict:[['고도 100 m · 열점 3 m','한 칸 '+fx(a.foot,1)+' m · 대비 '+fx(a.cont,1)+' K → '+(a.ok?'검출':'놓침'),'$W=2h\\tan(27.5^\\circ)$ = '+fx(a.width,0)+' m, 필 팩터 '+fx(a.frac*100,0)+' %'],
             ['고도 300 m · 열점 3 m','한 칸 '+fx(b.foot,1)+' m · 대비 '+fx(b.cont,1)+' K → '+(b.ok?'검출':'놓침'),'한 칸이 9 배 넓어져 열점 비율 감소'],
             ['고도 300 m · 열점 10 m','대비 '+fx(c.cont,1)+' K → '+(c.ok?'검출':'놓침'),'큰 열점은 높은 고도에서도 보인다'],
             ['고도 100 m · 열점 1 m','대비 '+fx(d.cont,1)+' K → '+(d.ok?'검출':'놓침'),'작은 열점은 한 칸의 몇 % 밖에 안 되어 노이즈 한계 아래']],
    data:{cols:['고도 (m)','열점 지름 (m)','한 칸 폭 (m)','필 팩터 (%)','대비 (K)','검출'],
          rows:[[50,1],[100,1],[100,3],[200,3],[300,3],[300,10]].map(function(q){ var r=i09(q[0],q[1]); return [q[0],q[1],fx(r.foot,1),fx(r.frac*100,0),fx(r.cont,1),r.ok?'검출':'놓침']; })},
    analysis:'열점 지름별 검출 한계 고도 $h_{\\max}$ 를 구해 그래프(지름 대 한계 고도)를 그린다. 필 팩터가 $\\pi d^2/(4 f^2)$ 이고 대비 ≥ NETD 가 조건이므로 $h_{\\max}\\propto d$ 로 늘어남(해상도를 2 배로 하면 $h_{\\max}$ 도 2 배)을 확인한다. 실제 측정에서는 비침투 열 전달 · 대기 흡수 · 방출률이 대비를 더 줄인다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','저해상도 열화상으로 높은 고도에서 작은 열점을 놓친다'],['새로운 점','낙하 고도에 따라 필 팩터를 계산해 「검출 가능 · 불가」 지도를 자동 표시하는 관측기'],['구성','열화상 센서 · MCU · 고도 센서 · 저장'],['효과 · 한계','검출 가능 영역 표시로 해석 오류 감소 / 해상도 · 대기 영향의 한계']]],
    fails:[['모든 칸이 비슷한 색','색 막대 범위가 자동 — 고정 범위(10 ~ 40 ℃)로 설정'],['열점이 안 보인다','필 팩터 계산해 고도 낮추기, 열점 크기 키우기'],['프레임이 느리다','읽기 주파수 조정(4 ~ 8 Hz), I²C 속도 올리기']],
    up:['<b>보간 + 기계학습</b> — 해상도를 가상으로 올려 열점 위치 추정.','<b>가시광 융합</b> — 카메라 영상과 겹쳐 표시(창의 02).','<b>검출 한계 지도</b> — 고도별 검출 가능 영역을 시각화.'],
    next:['원리③ 기압과 고도',3],
    eval:[['발명성','필 팩터를 이용한 설계 아이디어'],['정량 평가','검출 한계 고도 vs 열점 크기'],['센서 이해','FOV · 해상도 · NETD'],['명세서','대기 · 방출률 한계 서술']],
    tip:'「한 칸 안에서 열점이 차지하는 비율」을 그림(격자 위 원)으로 보여 주면 해상도의 의미가 바로 전달됩니다.' };
})();
SIMS.I09={ q:'열점 크기와 고도를 바꾸면 32×24 열화상 센서가 열점을 찾을 수 있을까?',
  a:{nm:'고도 h',min:20,max:500,step:10,val:100,unit:'m',d:0}, b:{nm:'열점 지름 d',min:0.5,max:15,step:0.5,val:3,unit:'m',d:1},
  cap1:'열화상 센서가 본 지상 화면(32×24, 가짜색). 가운데 = 열점(지름 d). 한 칸이 클수록 열점이 칸 안에서 희미해집니다.',
  cap2:'📊 고도 대 열점 대비(필 팩터 × ΔT 30 K). 점선 = 검출 한계(3 K). 열점 지름 1 · 3 · 10 m 와 지금.',
  note:'모형 : 32×24 · 시야각 55°(가로) · 열점 ΔT = +30 K · 검출 한계(NETD 근사) 3 K · 열점이 한 칸 중앙에 있다고 가정. 한 칸 폭 = 2h tan(27.5°)/32. 대기 흡수 · 방출률 · 번짐은 무시한 교육용 어림입니다.',
  anim:function(ctx,w,h,t,H,d,S){ var q=i09(H,d), nx=I09.NX, ny=I09.NY, cw=Math.min((w-24)/nx,(h-50)/ny*0.8), ch=cw, gx=(w-nx*cw)/2, gy=34, r=rng32(S.seed*7+3), i, j, mx=0, ss=3;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    for(j=0;j<ny;j++) for(i=0;i<nx;i++){ var cxm=nx/2, cym=ny/2, rr=d/2/q.foot, cov=0, a, b;
      for(a=0;a<ss;a++) for(b=0;b<ss;b++){ var px=i+(a+0.5)/ss-cxm, py=j+(b+0.5)/ss-cym; if(px*px+py*py<=rr*rr) cov++; } cov/=ss*ss;
      var T=I09.TAMB+0.35*gaussR(r)+I09.DT*cov; mx=Math.max(mx,T); ctx.fillStyle=tColor(T,10,48,1); ctx.fillRect(gx+i*cw,gy+j*ch,cw+0.5,ch+0.5); }
    ctx.strokeStyle=COL.dim; ctx.strokeRect(gx,gy,nx*cw,ny*ch);
    cvText(ctx,'한 칸 '+q.foot.toFixed(1)+' m · 시야 폭 '+q.width.toFixed(0)+' m · 열점 '+d.toFixed(1)+' m ('+q.cells.toFixed(1)+' 칸 분량)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    cvText(ctx,'최고 '+mx.toFixed(1)+' ℃ (배경 '+I09.TAMB+' ℃) · 대비 '+q.cont.toFixed(1)+' K → '+(q.ok?'열점 검출 ✔':'열점 놓침 ✖'),12,h-10,q.ok?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,H,d,S){ var ds=[1,3,10], cols=[COL.blue,COL.ok,COL.violet||COL.amber], hs=[], i; for(i=0;i<=50;i++) hs.push(20+i*9.6);
    var P=makePlot(ctx,w,h,{xmin:20,xmax:500,ymin:0,ymax:32,xlabel:'고도 h (m)',ylabel:'열점 대비 (K)',title:'고도가 높을수록 열점의 대비가 줄어든다',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    ds.forEach(function(dd,k){ plotLine(ctx,P,hs.map(function(hh){ return [hh,i09(hh,dd).cont]; }),cols[k],1.8); }); plotLine(ctx,P,hs.map(function(hh){ return [hh,i09(hh,d).cont]; }),COL.amber,2.8); plotLine(ctx,P,[[20,I09.NETD],[500,I09.NETD]],COL.grav,1.4,[5,4]);
    plotPoints(ctx,P,[[H,i09(H,d).cont]],COL.amber,7); legend(ctx,P.x1-130,P.y1+14,[['1 m',cols[0]],['3 m',cols[1]],['10 m',cols[2]],['지금 '+d.toFixed(1)+' m',COL.amber]]); },
  kv:function(H,d,S){ var q=i09(H,d), hmax=Math.sqrt(Math.PI*d*d/4*I09.DT/I09.NETD)/(2*Math.tan(I09.FOV/2*Math.PI/180)/I09.NX); return [['한 칸이 보는 폭',q.foot.toFixed(1)+' m','a'],['시야 가로 폭',q.width.toFixed(0)+' m'],['열점 필 팩터',(q.frac*100).toFixed(0)+' %','g'],['열점 대비',q.cont.toFixed(1)+' K','v2'],['검출 한계 고도',hmax.toFixed(0)+' m ('+(q.ok?'검출 ✔':'놓침 ✖')+')','r']]; } };

/* ── I10 : 리액션 휠 — 각운동량 보존으로 자세 잡기 ──────────────────────── */
var I10 = { IB:0.5*0.35*0.033*0.033, UMAX:0.004, WMAX:1000, DT:0.002, TEND:6 };
function i10(ratio, om0d){ var Ib=I10.IB, Iw=ratio*Ib, wn=7, kp=wn*wn*Ib, kd=2*0.9*wn*Ib, th=0, om=om0d*Math.PI/180, ww=0, t=0, tr=[], i, n=Math.round(I10.TEND/I10.DT), sat=false, wmaxSeen=0, tSet=-1, thMax=0, ok=0;
  for(i=0;i<=n;i++){ var u=kd*om+kp*th, usat=Math.max(-I10.UMAX,Math.min(I10.UMAX,u)); if((ww>=I10.WMAX&&usat>0)||(ww<=-I10.WMAX&&usat<0)){ usat=0; sat=true; }
    if(i%10===0) tr.push([t,th*180/Math.PI,ww]);
    om+=-usat/Ib*I10.DT; ww+=usat/Iw*I10.DT; th+=om*I10.DT; t+=I10.DT; thMax=Math.max(thMax,Math.abs(th*180/Math.PI)); wmaxSeen=Math.max(wmaxSeen,Math.abs(ww));
    if(Math.abs(th*180/Math.PI)<2 && Math.abs(om*180/Math.PI)<5){ ok++; if(ok>150 && tSet<0) tSet=t-0.3; } else { ok=0; tSet=-1; } }
  return {tr:tr, tSet:tSet, wmax:wmaxSeen, rpm:wmaxSeen*60/(2*Math.PI), sat:sat||wmaxSeen>=I10.WMAX*0.999, thMax:thMax, stable:tSet>=0}; }
(function(){
  var a=i10(0.2,180), b=i10(0.02,180), c=i10(0.2,720), d=i10(0.5,360);
  PROJ.I10={ id:'I10', t:'리액션 휠 자세제어 — 모터로 캔 몸체의 회전 멈추기', icon:'🌀', type:'발명 · 제어', lv:3, dur:'5 ~ 8주', cost:'약 4 ~ 8만 원',
    one:'캔위성 안에 모터로 돌리는 휠(리액션 휠)을 넣어 각운동량 보존으로 몸체의 회전을 멈추고 원하는 방향으로 돌린다. 휠 관성 모멘트 비와 모터 한계에 따라 자세 제어 가능 범위가 결정된다.',
    q:'낙하산 줄이 꼬여 캔이 초당 몇 도로 돌면 리액션 휠로 멈출 수 있을까? 휠의 크기와 모터 한계는 어떤 역할을 할까?',
    why:'우주의 위성이 로켓 연료 없이 자세를 바꾸는 방법이 바로 <b>각운동량 보존</b>입니다. 책상 위 회전 의자 실험이 캔위성 · 제어공학 · 우주 공학으로 이어집니다. 휠의 <b>포화(회전수 한계)</b>가 실제 위성의 가장 큰 제약임도 체험합니다.',
    link:'원리⑤ 센서 · 관성 · 발명 05(영상 안정화) · 창의 05 · 도구함의 IMU 코드 · 물리 Ⅰ 회전 운동 · 각운동량.',
    fig:FIGS.I10.fig, tg:FIGS.I10.tg,
    cap:'캔 안의 휠(왼쪽)을 모터(가운데)로 돌리면 IMU(오른쪽)가 잰 몸체 자세를 PD 제어기(오른쪽 아래)가 보정한다. 각운동량 합이 0 이므로 휠이 한쪽으로 돌면 몸체(가운데 아래)는 반대로 돈다',
    parts:[['리액션 휠','지름 45 mm · 질량 40 g(황동)','관성 모멘트 $I_w=\\tfrac12 m r^2$. 질량을 바깥에 모을수록 효과 ↑.'],
           ['모터','BLDC 또는 DC 모터 + 드라이버','최대 회전수 · 토크가 한계. 토크 4 mN·m 급을 가정.'],
           ['IMU','MPU6050 · 자이로 ±2000°/s','몸체 회전율(자이로)과 각도(상보 필터).'],
           ['각운동량 보존','$I_w\\omega_w+I_b\\omega_b=0$','휠을 가속하면 몸체는 반대로 돈다 — 가장 먼저 책상 위에서 확인.'],
           ['캔 몸체','관성 모멘트 $I_b\\approx\\tfrac12 mr^2$','0.35 kg · 반지름 33 mm 이면 약 1.9×10⁻⁴ kg·m².'],
           ['PD 제어기','$u=K_p\\theta+K_d\\dot\\theta$','각도 · 각속도 되먹임. 모터 한계(포화)를 넘으면 제어 불가.']],
    budget:[['모터 + 드라이버','1 세트','약 2만 원','—'],['MPU6050 · 아두이노','1 세트','약 1.5만 원','—'],['휠(황동 · 3D 프린트 + 금속)','1','약 5천 원','—'],['전지 · 스위치','1 세트','약 5천 원','—'],['회전 의자 · 줄(시험 장치)','1','보유','—']],
    steps:['회전 의자에 앉아 바퀴(자전거 휠)를 돌려 몸이 반대로 도는 것을 체험하고 $I_w\\omega_w=-I_b\\omega_b$ 로 설명한다.','캔 모형을 가는 줄에 매달아(비틀림 진자) 휠을 돌릴 때 몸체가 도는 방향 · 각속도를 IMU 로 기록한다.','휠 관성 모멘트와 몸체 관성 모멘트를 측정(진동 주기 이용)해 비 $I_w/I_b$ 를 구한다.','PD 제어를 구현해 초기 회전 30 · 90 · 180°/s 에서 정착 시간을 측정한다.','휠 포화(최대 회전수)에 도달하는 초기 회전 속도를 찾고 이론 예측과 비교한다.'],
    vars:['관성비 $I_w/I_b$ · 초기 회전 ω₀','정착 시간 · 최대 휠 회전수 · 포화 여부','모터 토크 한계 · 제어 이득 · 센서 지연'],
    predict:[['관성비 0.2 · ω₀ 180°/s','정착 '+(a.stable? fx(a.tSet,1)+' s':'불가')+' · 휠 최대 '+fx(a.rpm,0)+' rpm'+(a.sat?' (포화)':''),'멈추려면 휠이 $\\omega_w=\\omega_0/(I_w/I_b)$ 만큼 필요 = '+fx(180*Math.PI/180/0.2,0)+' rad/s'],
             ['관성비 0.02 · ω₀ 180°/s','휠 최대 '+fx(b.rpm,0)+' rpm'+(b.sat?' → 포화(회전수 한계 도달)':'')+' · '+(b.stable?'정착 '+fx(b.tSet,1)+' s':'정착 불가'),'휠이 작으면 같은 회전을 멈추려 훨씬 빨리 돌아야 한다'],
             ['관성비 0.2 · ω₀ 720°/s','휠 최대 '+fx(c.rpm,0)+' rpm'+(c.sat?' → 포화':'')+' · '+(c.stable?'정착 '+fx(c.tSet,1)+' s':'정착 불가'),'초기 회전이 크면 같은 휠로는 한계'],
             ['관성비 0.5 · ω₀ 360°/s','휠 최대 '+fx(d.rpm,0)+' rpm · '+(d.stable?'정착 '+fx(d.tSet,1)+' s':'정착 불가'),'큰 휠은 낮은 회전수로 해결 — 그러나 질량 · 공간이 든다']],
    data:{cols:['관성비 Iw/Ib','초기 회전 (°/s)','필요 휠 속도 (rpm)','시뮬 최대 (rpm)','정착 시간 (s)','포화'],
          rows:[[0.02,180],[0.05,180],[0.2,180],[0.2,720],[0.5,360],[0.1,360]].map(function(q){ var r=i10(q[0],q[1]); return [q[0],q[1],fx(q[1]*Math.PI/180/q[0]*60/(2*Math.PI),0),fx(r.rpm,0),r.stable?fx(r.tSet,1):'—',r.sat?'있음':'없음']; })},
    analysis:'필요 휠 속도 $\\omega_w=\\omega_0\\,I_b/I_w$ 와 모터 한계 $\\omega_{\\max}$ 의 비교로 「제어 가능한 최대 초기 회전 속도」 $\\omega_{0,\\max}=\\omega_{\\max}\\,I_w/I_b$ 를 구해 실험 결과와 비교한다. PD 이득 · 모터 토크 한계가 정착 시간을 정하고, 포화되면 제어가 실패함을 시간-회전수 그래프로 확인한다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','낙하산 줄 꼬임 · 바람으로 캔이 돌아 영상 · 센서 방향이 흔들린다'],['새로운 점','리액션 휠 + IMU 되먹임으로 캔 자세를 낙하 중에 유지하는 초소형 장치(휠 관성비와 포화 한계를 설계 변수로 명시)'],['구성','휠 · 모터 · IMU · PD 제어기'],['효과 · 한계','몸체 회전 억제 / 외부 토크가 계속되면 휠이 포화']]],
    fails:[['몸체가 오히려 크게 진동한다','이득이 크거나 센서 지연 — Kp · Kd 낮춤, 자이로 필터'],['휠이 계속 한쪽으로 돈다(포화)','외부 토크가 지속되면 포화 — 지속적 회전 원인(줄 꼬임)을 먼저 제거'],['모터가 뜨겁다','연속 최대 토크 사용 중 — 이득 · 정지 시 전류 제한']],
    up:['<b>3 축 휠</b> — 3 개의 휠로 3 축 자세 제어.','<b>모멘텀 덤프</b> — 포화된 휠을 풀기 위한 외부 토크(마그네틱 · 바람).','<b>영상 안정화</b> — 발명 05 와 결합해 영상 흔들림 최소화.'],
    next:['원리⑤ 센서 · 관성 · 안전',5],
    eval:[['발명성','소형화 · 포화 설계의 아이디어'],['정량 평가','관성비 · 한계 속도 · 정착 시간'],['실험 정직성','측정 방법 · 오차 보고'],['명세서','포화 · 외란의 한계 기술']],
    tip:'시간 그래프에서 몸체 각도가 0 으로 수렴하는 동안 휠 속도가 올라가다 일정해지는 모습이 「각운동량이 휠로 옮겨 간다」는 이야기를 그대로 보여 줍니다.' };
})();
SIMS.I10={ q:'휠의 관성비와 초기 회전 속도를 바꾸면 리액션 휠이 캔의 회전을 멈출 수 있을까?',
  a:{nm:'관성비 I_w / I_b',min:0.02,max:0.5,step:0.02,val:0.2,unit:'',d:2}, b:{nm:'초기 회전 ω₀',min:30,max:720,step:30,val:180,unit:'°/s',d:0},
  cap1:'위에서 본 캔 몸체(바깥 원)와 휠(안쪽). 몸체는 초기 회전 ω₀ 로 돌다가 휠이 반대로 돌며 멈춥니다(시간 6 초를 10 초에 압축).',
  cap2:'📊 위 : 몸체 각도 · 아래 : 휠 회전수. 휠이 모터 한계(약 9550 rpm)에 닿으면 제어를 잃습니다.',
  note:'모형 : 몸체 I_b = ½ m r² = 1.9×10⁻⁴ kg·m², 휠 I_w = (비) × I_b. PD 제어(고유진동수 7 rad/s), 모터 토크 한계 4 mN·m, 휠 최대 속도 1000 rad/s(≈ 9550 rpm). 베어링 마찰 · 센서 지연 · 노이즈는 무시한 교육용 모형입니다.',
  anim:function(ctx,w,h,t,ratio,om,S){ var q=i10(ratio,om), n=q.tr.length-1, k=Math.min(n,Math.round(t/10*n)), cx=w*0.5, cy=h/2+6, R=Math.min(h*0.38,w*0.2), th=q.tr[k][1]*Math.PI/180, ww=q.tr[k][2], wang=0, i;
    for(i=0;i<=k;i++){ wang+=q.tr[i][2]*I10.DT*10; }
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle=COL.plotbg; ctx.fillRect(8,8,w-16,h-16);
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(-th); cvCirc(ctx,0,0,R,'rgba(148,163,184,.15)',COL.dev,2); cvLine(ctx,[[0,0],[R,0]],COL.amber,3); cvText(ctx,'몸체 앞',R*0.55,-10,COL.amber,'11px system-ui,sans-serif','center'); ctx.restore();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(-(wang%6.2832)); cvCirc(ctx,0,0,R*0.55,'rgba(52,211,153,.18)',COL.ok,2); for(i=0;i<6;i++){ var a=i*Math.PI/3; cvLine(ctx,[[0,0],[R*0.55*Math.cos(a),R*0.55*Math.sin(a)]],COL.ok,1.2); } ctx.restore();
    cvLine(ctx,[[cx,cy],[cx+R*1.25,cy]],COL.dim,1,[3,3]); cvText(ctx,'목표 방향',cx+R*1.25,cy-8,COL.dim,'10px system-ui,sans-serif','right');
    cvText(ctx,'몸체 각 '+(th*180/Math.PI).toFixed(0)+'° · 휠 '+(ww*60/(2*Math.PI)).toFixed(0)+' rpm'+(q.sat?' · 포화':'')+(q.stable?' · 정착 '+q.tSet.toFixed(1)+' s':' · 정착 못 함'),12,16,q.stable&&!q.sat?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,ratio,om,S){ var q=i10(ratio,om), hh=Math.round(h*0.5), mx=Math.max.apply(null,q.tr.map(function(p){ return Math.abs(p[1]); }))*1.15+5, wm=Math.max(100,q.wmax*60/(2*Math.PI)*1.2);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:I10.TEND,ymin:-mx,ymax:mx,ylabel:'몸체 각도 (°)',title:'몸체 자세',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,q.tr.map(function(p){ return [p[0],p[1]]; }),COL.blue,2); plotLine(ctx,P,[[0,0],[I10.TEND,0]],COL.grav,1.2,[4,3]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:I10.TEND,ymin:-wm,ymax:wm,xlabel:'시간 (s)',ylabel:'휠 (rpm)',title:'휠 회전수',left:56,top:24,bottom:38,xfmt:function(v){ return String(+v.toFixed(1)); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,q.tr.map(function(p){ return [p[0],p[2]*60/(2*Math.PI)]; }),COL.ok,2); plotLine(ctx,P,[[0,I10.WMAX*60/(2*Math.PI)],[I10.TEND,I10.WMAX*60/(2*Math.PI)]],COL.grav,1.2,[4,3]); }); },
  kv:function(ratio,om,S){ var q=i10(ratio,om), need=om*Math.PI/180/ratio, lim=I10.WMAX*ratio*180/Math.PI; return [['정착 시간',q.stable? q.tSet.toFixed(1)+' s':'정착 못 함','a'],['필요 휠 속도',(need*60/(2*Math.PI)).toFixed(0)+' rpm'],['시뮬 최대 휠 속도',q.rpm.toFixed(0)+' rpm','g'],['제어 가능 최대 ω₀',lim.toFixed(0)+' °/s','v2'],['모터 한계(포화)',q.sat?'❌ 포화':'✅ 여유','r']]; } };
