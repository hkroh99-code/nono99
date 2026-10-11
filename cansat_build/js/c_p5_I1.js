/* ═══════════════════════════════════════════════════════════════════════════
   발명 I01 ~ I05 : 자동 낙하산 전개 · 파라포일 자동 조향 · 가변 낙하산 · 격자 완충재 · 영상 안정화
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I01 : 자동 낙하산 전개 — 잡음에 강한 「연속 N 회」 판정 ─────────────── */
var I01 = { H0:700, V:40, HTH:300, FS:10, NT:300, NS:200 };
var I01Z = (function(){ var r=rng32(4101), z=[], i, j; for(i=0;i<I01.NT;i++){ var row=[]; for(j=0;j<I01.NS;j++) row.push(gaussR(r)); z.push(row); } return z; })();
/** 한 번의 낙하 : 잡음 배열 z, 잡음 크기 sg, 연속 횟수 N → {idx(전개 표본), alt(전개 때 실제 고도), reads[]} */
function i01trial(z, sg, N){ var cnt=0, i, rd=[], idx=-1;
  for(i=0;i<I01.NS;i++){ var h=I01.H0-I01.V*i/I01.FS; if(h<0) break; var r=h+sg*z[i]; rd.push(r); if(idx<0){ if(r<I01.HTH) cnt++; else cnt=0; if(cnt>=N) idx=i; } }
  return {idx:idx, alt:idx<0? 0 : I01.H0-I01.V*idx/I01.FS, reads:rd}; }
/** 전체 시험 : 조기 전개(임계 +50 m 보다 위) 비율 · 평균 전개 고도 오차 */
function i01(sg, N){ var i, early=0, late=0, es=[], T=I01.NT;
  for(i=0;i<T;i++){ var q=i01trial(I01Z[i],sg,N); es.push(q.alt-I01.HTH); if(q.alt>I01.HTH+15) early++; if(q.alt<I01.HTH-30) late++; }
  return {early:early/T*100, late:late/T*100, bias:mean(es), sd:stdev(es), ok:100-(early+late)/T*100}; }
(function(){
  var a=i01(8,1), b=i01(8,5), c=i01(16,5), d=i01(0,1);
  PROJ.I01={ id:'I01', t:'자동 낙하산 전개 장치 — 잡음에 강한 「연속 N 회」 판정', icon:'🪂', type:'발명 · 제어', lv:2, dur:'3 ~ 4주', cost:'약 3 ~ 5만 원',
    one:'기압 센서(BMP280)가 읽은 고도가 기준 고도 아래로 N 번 연속 내려가면 서보 걸쇠가 열려 낙하산이 펴진다. 센서 잡음 σ 때문에 낙하산이 일찍 · 늦게 펴지는 문제를 N 으로 조절한다.',
    q:'센서 잡음이 있을 때 「몇 번 연속 아래로 읽히면」 낙하산을 펴야 너무 일찍도 너무 늦게도 펴지지 않을까?',
    why:'<b>낙하산이 펴지는 순간</b>이 임무의 성패를 가릅니다. 한 번만 아래로 읽혀도 펴면 잡음에 속아 조기 전개, 너무 신중하면 지면에 닿은 뒤에야 폅니다. 「오작동 vs 지연」의 균형을 숫자로 설계하는 대표적인 임베디드 발명 문제입니다.',
    link:'원리③ 기압과 고도(3번 탭) · 5번 탭(센서 잡음) · R04(고도 측정 정밀도) · 발명 02 · 도구함의 아두이노 코드.',
    fig:FIGS.I01.fig, tg:FIGS.I01.tg,
    cap:'기압 센서(왼쪽)가 고도를 읽어 MCU(가운데)가 규칙(왼쪽 아래)으로 판정하고, 서보 걸쇠(오른쪽)가 접힌 낙하산(가운데 아래)을 놓아 준다',
    parts:[['기압 센서','BMP280 (±1 m 급)','10 Hz 로 읽어 고도로 환산(3번 탭). 잡음 σ 는 책상에서 1 분 측정해 구한다.'],
           ['마이크로컨트롤러','아두이노 나노 · 마이크로비트','연속 횟수 카운터를 두고 규칙을 실행. 기준 고도 · N 을 변수로 둔다.'],
           ['서보 걸쇠','9 g 서보 + 클립','서보 각도가 바뀌면 걸쇠가 풀려 낙하산 덮개가 열린다(밴드 · 스프링).'],
           ['판정 규칙','연속 N 회 h < h_th','카운터 cnt: 읽은 값 < 기준 → cnt+1, 아니면 0 으로 초기화. cnt ≥ N 이면 전개.'],
           ['접힌 낙하산','깔끔히 접어 캔 위 덮개 아래','접는 방식이 개방 시간(1 s 안팎)을 좌우한다. 줄 엉킴 방지.'],
           ['전원','소형 리튬 전지 3.7 V','전압 강하 시 서보가 약해진다 — 전원 안정 확인.']],
    budget:[['BMP280 + 아두이노 나노','1 세트','약 1.5만 원','마이크로비트 + 센서'],['9 g 서보','1','약 3천 원','—'],['낙하산 · 걸쇠 재료','1 세트','약 5천 원','—'],['전지 · 스위치','1 세트','약 5천 원','—'],['USB 로깅 케이블','1','보유','—']],
    steps:['책상 위에서 BMP280 을 1 분간 읽어 고도 잡음 σ(m) 를 구한다(표준편차).','코드에 「연속 N 회 기준 아래」 규칙을 넣고, 먼저 서보 대신 LED 로 판정 시점을 확인한다.','계단 · 옥상 · 줄에 매달아 내려오며 N = 1, 3, 5, 8 로 바꾸어 판정 고도를 기록한다(각 N 5 회).','판정 고도의 평균 · 표준편차를 N 별로 표로 만들고 조기 · 지연 비율을 구한다.','서보 걸쇠와 낙하산을 연결해 낮은 높이 시험 → 가장 균형 좋은 N 을 정해 낙하 시험을 한다.'],
    vars:['연속 횟수 N · 기준 고도 h_th','센서 잡음 σ · 낙하 속도 · 갱신 주기','전개 고도 오차 · 조기 / 지연 비율'],
    predict:[['잡음 σ = 8 m · N = 1','조기 전개 '+fx(a.early,0)+' % · 평균 전개 고도 오차 '+fx(a.bias,0)+' m','한 번이라도 아래로 읽히면 전개 → 잡음에 속아 기준보다 높은 곳에서 전개'],
             ['잡음 σ = 8 m · N = 5','조기 전개 '+fx(b.early,0)+' % · 평균 오차 '+fx(b.bias,0)+' m','연속 5 회 잡음이 같은 쪽으로 나올 확률은 매우 작다 → 조기 전개 거의 사라짐'],
             ['잡음 σ = 16 m · N = 5','조기 '+fx(c.early,0)+' % · 오차 표준편차 '+fx(c.sd,0)+' m','잡음이 2 배로 커지면 N 을 늘려야 같은 안전도'],
             ['잡음 0 · N = 1','평균 오차 '+fx(d.bias,0)+' m (표본 간격 '+fx(I01.V/I01.FS,1)+' m)','잡음이 없으면 지연은 표본 간격(40 m/s ÷ 10 Hz = 4 m)만큼']],
    data:{cols:['잡음 σ (m)','N','조기 전개 (%)','지연 (%)','평균 오차 (m)','표준편차 (m)'],
          rows:[[8,1],[8,3],[8,5],[8,8],[16,5],[16,10]].map(function(q){ var r=i01(q[0],q[1]); return [q[0],q[1],fx(r.early,0),fx(r.late,0),fx(r.bias,0),fx(r.sd,0)]; })},
    analysis:'N 에 따른 조기 전개 · 지연 비율과 평균 전개 오차를 그래프로 그리고, 오작동과 지연을 함께 줄이는 N 을 고른다. 이론 : 한 표본이 기준 아래일 확률 p 일 때 연속 N 회 확률은 $p^N$. 실험과 비교해 두 값이 일치하는지 확인한다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','센서 잡음으로 낙하산이 일찍 · 늦게 펴져 임무가 실패한다'],['새로운 점','「연속 N 회 판정」의 N 을 잡음 크기 σ 에 맞춰 자동 선택하는 전개 규칙'],['구성','기압 센서 · MCU(카운터) · 서보 걸쇠 · 접힌 낙하산'],['효과 · 한계','오작동 비율 ↓, 대신 판정 지연이 N/표본율 만큼 늘어남 — 고도 여유 필요']]],
    fails:[['시험마다 전개 고도가 크게 다르다','σ 가 큰 센서 — 이동평균 + 연속 판정을 함께 쓰고 센서 온도 안정화'],['서보가 걸쇠를 못 푼다','서보 토크 · 걸쇠 마찰 점검, 전지 전압 확인'],['낙하산이 안 펴진다(펴지는 시간 부족)','전개 고도를 높이고 접는 법을 바꾼다 — 개방 시간 측정']],
    up:['<b>잡음 자동 추정</b> — 낙하 전 1 분간 σ 를 측정해 N 을 자동 결정.','<b>가속도 센서 병용</b> — 낙하 감지(자유낙하 0 g)와 AND 조건.','<b>백업</b> — 기압 규칙이 실패해도 시간 타이머로 비상 전개.'],
    next:['원리③ 기압과 고도',3],
    eval:[['발명성','기존 방식과 다른 점을 한 문장으로 설명'],['정량 평가','조기 · 지연 비율을 숫자로 비교'],['안전','낮은 높이 시험 · 실패 시 대책'],['명세서','구성 · 효과 · 한계의 논리']],
    tip:'「N 에 따라 조기 전개 비율이 어떻게 줄고 평균 지연이 어떻게 늘어나는지」 두 그래프를 나란히 보여 주면 설계 근거가 한눈에 보입니다.' };
})();
SIMS.I01={ q:'센서 잡음과 연속 횟수 N 을 바꾸면 낙하산이 펴지는 고도는 어떻게 달라질까?',
  a:{nm:'센서 잡음 σ',min:0,max:20,step:1,val:8,unit:'m',d:0}, b:{nm:'연속 횟수 N',min:1,max:10,step:1,val:3,unit:'회',d:0},
  cap1:'40 m/s 로 낙하하며 10 Hz 로 읽은 고도(점)와 실제 고도(선). 기준(300 m) 아래가 N 번 연속이면 전개(세로선).',
  cap2:'📊 위 : N 에 따른 조기 전개 비율(σ 4 · 8 · 16 m) · 아래 : 평균 전개 고도 오차. 점 = 지금 설정.',
  note:'모형 : 700 m 에서 40 m/s 로 낙하(캔만), 10 Hz 표본, 읽은 고도 = 실제 + σ·가우시안. 300 회 시험 평균. 조기 전개 = 기준보다 15 m 넘게 위, 지연 = 기준보다 30 m 넘게 아래. 새 측정은 보여 주는 한 번의 낙하만 바꿉니다.',
  anim:function(ctx,w,h,t,sg,N,S){ var q=i01trial(I01Z[S.seed%I01.NT],sg,Math.round(N)), x0=54, x1=w-14, y0=h-30, y1=30, Tm=I01.H0/I01.V*I01.FS, n=Math.min(q.reads.length,Math.floor(t/10*Tm)+1), i;
    function X(i){ return x0+(x1-x0)*i/Tm; } function Y(v){ return y0-(y0-y1)*Math.max(-40,Math.min(I01.H0+60,v))/(I01.H0+60); }
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle=COL.plotbg; ctx.fillRect(x0,y1,x1-x0,y0-y1);
    cvLine(ctx,[[x0,Y(I01.HTH)],[x1,Y(I01.HTH)]],COL.grav,1.4,[5,4]); cvText(ctx,'기준 '+I01.HTH+' m',x1-4,Y(I01.HTH)-8,COL.grav,'11px system-ui,sans-serif','right');
    cvLine(ctx,[[X(0),Y(I01.H0)],[X(Tm),Y(0)]],COL.dim,1.2);
    for(i=0;i<n;i++){ var below=q.reads[i]<I01.HTH; cvCirc(ctx,X(i),Y(q.reads[i]),2.6,below?COL.amber:COL.blue,null,0); }
    if(q.idx>=0 && q.idx<n){ cvLine(ctx,[[X(q.idx),y1],[X(q.idx),y0]],COL.ok,2); cvText(ctx,'전개! 실제 고도 '+q.alt.toFixed(0)+' m',Math.min(X(q.idx)+6,x1-150),y1+12,COL.ok,'bold 12px system-ui,sans-serif'); }
    cvText(ctx,'읽은 고도 (m)',8,y1+4,COL.text,'11px system-ui,sans-serif');
    [0,300,600].forEach(function(v){ cvText(ctx,String(v),x0-6,Y(v),COL.text,'10px system-ui,sans-serif','right','middle'); });
    cvText(ctx,'σ '+sg+' m · N '+Math.round(N)+' 회 · '+(q.idx<0?'전개 못 함(지면)':'전개 고도 오차 '+(q.alt-I01.HTH).toFixed(0)+' m'),12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,sg,N,S){ var hh=Math.round(h*0.5), sgs=[4,8,16], cols=[COL.blue,COL.ok,COL.violet||COL.amber], Ns=[1,2,3,4,5,6,7,8,9,10], cur=i01(sg,Math.round(N));
    subPlot(ctx,0,0,w,hh,{xmin:1,xmax:10,ymin:0,ymax:60,ylabel:'조기 전개 (%)',title:'N 이 클수록 조기 전개가 줄고(위), 지연이 늘어난다',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ sgs.forEach(function(s,k){ plotLine(ctx,P,Ns.map(function(n){ return [n,i01(s,n).early]; }),cols[k],1.8); }); plotPoints(ctx,P,[[Math.round(N),cur.early]],COL.amber,6.5); legend(ctx,P.x1-100,P.y1+14,[['σ 4 m',cols[0]],['σ 8 m',cols[1]],['σ 16 m',cols[2]],['지금',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:1,xmax:10,ymin:-50,ymax:40,xlabel:'연속 횟수 N',ylabel:'평균 전개 오차 (m)',title:'평균 전개 고도 오차(기준 대비)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ sgs.forEach(function(s,k){ plotLine(ctx,P,Ns.map(function(n){ return [n,i01(s,n).bias]; }),cols[k],1.8); }); plotLine(ctx,P,[[1,0],[10,0]],COL.grav,1.2,[4,3]); plotPoints(ctx,P,[[Math.round(N),cur.bias]],COL.amber,6.5); }); },
  kv:function(sg,N,S){ var q=i01(sg,Math.round(N)); return [['조기 전개(+15 m 초과)',q.early.toFixed(0)+' %','r'],['지연(−30 m 초과)',q.late.toFixed(0)+' %'],['평균 전개 오차',q.bias.toFixed(0)+' m','a'],['오차 표준편차',q.sd.toFixed(0)+' m','g'],['정상 전개 비율',q.ok.toFixed(0)+' %','v2']]; } };

/* ── I02 : 파라포일 자동 조향 — 바람을 이기고 목표로 돌아오는 조건 ─────── */
var I02 = { H0:300, VS:5, P0:[120,80], TURN:1.0 };
function i02run(LD, wind, seed, n){ var r=rng32(seed*37+Math.round(LD*10)+Math.round(wind*100)), res=[], i; n=n||24;
  for(i=0;i<n;i++){ var wx=wind+0.8*gaussR(r), wy=0.4*wind*gaussR(r); var g=guideSim({h0:I02.H0,vs:I02.VS,LD:LD,wind:[wx,wy],p0:I02.P0,target:[0,0],gps:3,dt:0.2,turn:I02.TURN,rng:r}); res.push({d:g.miss,g:g}); }
  return res; }
function i02(LD, wind, seed){ var res=i02run(LD,wind,seed,24), ds=res.map(function(q){ return q.d; }); return {d:mean(ds), ok:ds.filter(function(x){ return x<=20; }).length/ds.length*100, Vg:LD*I02.VS, ratio:wind>0? LD*I02.VS/wind : 99, res:res}; }
(function(){
  var a=i02(2,4,1), b=i02(0,4,1), c=i02(1,6,1), d=i02(3,6,1);
  PROJ.I02={ id:'I02', t:'파라포일 자동 조향 — 바람을 이기고 목표로 돌아오는 조건', icon:'🪁', type:'발명 · 유도', lv:3, dur:'4 ~ 6주', cost:'약 6 ~ 10만 원',
    one:'GPS 로 현재 위치를 알고 목표 방위와 진행 방향의 차이(오차각)에 따라 좌 · 우 조종줄을 당겨 파라포일(램에어 낙하산)이 목표 지점으로 돌아오게 한다.',
    q:'파라포일의 활공비 L/D 와 바람 세기가 어떤 관계일 때 목표로 되돌아올 수 있을까? GPS 잡음은 착륙 오차를 얼마나 키울까?',
    why:'「Comeback(복귀)」 임무의 핵심입니다. <b>수평 대기속도 V<sub>g</sub> = (L/D)·침하속도</b> 가 바람보다 커야 바람을 거슬러 돌아올 수 있다는 단순한 관계가 실제 설계의 출발점입니다. 시뮬레이션과 시험을 오가며 제어 이득을 맞추는 경험이 큽니다.',
    link:'4번 탭(바람 · 낙하 궤적) · 도구함의 방위 계산 코드 · R09 · 창의 09 · 17번 탭(종합 실험 3).',
    fig:FIGS.I02.fig, tg:FIGS.I02.tg,
    cap:'파라포일(왼쪽)을 좌우 서보(가운데)가 조종줄(왼쪽 아래)로 당겨 방향을 바꾼다. GPS(오른쪽)와 방위 계산(왼쪽 아래)이 오차각을 만들고 착륙 목표(오른쪽 아래)로 향한다',
    parts:[['파라포일','램에어형 · 면적 0.3 ~ 0.6 m²','활공비 L/D 2 ~ 4. 시판 모형 파라포일이나 직접 제작(펴짐 확인).'],
           ['좌 · 우 서보','2 개 · 줄 당김 5 ~ 10 mm','한쪽 줄을 당기면 그쪽으로 선회. 줄 당김과 선회율의 관계는 시험으로 보정.'],
           ['GPS 모듈','NEO-6M 등 · 1 ~ 5 Hz','위치 잡음 σ ≈ 2 ~ 5 m. 낙하 속도가 큰 구간에서는 갱신이 늦을 수 있다.'],
           ['방위 오차 계산','오차각 = 목표 방위 − 진행 방향','atan2 로 방위 · 진행 방향은 GPS 이동 벡터에서. 오차 ±180° 로 감싼다.'],
           ['조종 줄','낚싯줄 · 케블라 실','늘어나지 않는 줄. 서보 호른 길이로 당김 양 결정.'],
           ['착륙 목표','지름 20 m 원','점수 = 목표에서의 거리. 풍향 · 풍속을 사전에 측정해 전략을 세운다.']],
    budget:[['모형 파라포일','1','약 3만 원','직접 제작(원단 · 실)'],['GPS 모듈','1','약 1.5만 원','—'],['서보 2 개 · 아두이노','1 세트','약 2만 원','—'],['풍속계(소형)','1','약 1만 원','스마트폰 앱'],['SD 카드 로거','1','약 5천 원','시리얼 로깅']],
    steps:['지상에서 서보를 좌 · 우로 당겨 파라포일이 어느 쪽으로 도는지 줄 당김량 ↔ 선회율 표를 만든다.','시뮬레이터(미니 모의실험)로 L/D · 풍속에 따른 착륙 오차를 예측하고 도달 가능 영역을 그린다.','높은 곳(건물 · 연 · 드론)에서 낮은 높이로 방출해 GPS 궤적을 로깅하고 오차각 제어를 조정한다.','제어 이득 · 갱신 주기를 바꾸어 착륙 오차 10 회 평균을 비교한다.','같은 조건에서 비조향 낙하산과 착륙 오차 · 편향을 비교해 효과를 보고서로 정리한다.'],
    vars:['활공비 L/D · 제어 이득 · GPS 갱신 주기','풍속 · 풍향 · 방출 고도 · 위치','착륙 오차 · 성공률(20 m 이내)'],
    predict:[['L/D 2 · 풍속 4 m/s','평균 오차 '+fx(a.d,0)+' m · 성공률 '+fx(a.ok,0)+' % (V_g '+fx(a.Vg,0)+' > 풍속 4)','바람보다 빠른 수평 속도가 있어 목표로 돌아올 수 있다'],
             ['L/D 0(일반 낙하산) · 풍속 4 m/s','평균 오차 '+fx(b.d,0)+' m','조향이 없으면 바람이 정한 만큼 밀려 간다'],
             ['L/D 1 · 풍속 6 m/s','평균 오차 '+fx(c.d,0)+' m (V_g '+fx(c.Vg,0)+' < 풍속 6)','V_g < 바람 : 거슬러 가지 못해 오차가 매우 크다'],
             ['L/D 3 · 풍속 6 m/s','평균 오차 '+fx(d.d,0)+' m · 성공률 '+fx(d.ok,0)+' %','V_g 15 > 6 이면 돌아올 수 있으나 GPS 잡음 · 선회 한계로 오차가 남는다']],
    data:{cols:['L/D','풍속 (m/s)','V_g (m/s)','V_g / 풍속','평균 오차 (m)','성공률 (%)'],
          rows:[[1,6],[2,4],[2,6],[3,6],[4,6],[3,8]].map(function(q){ var r=i02(q[0],q[1],1); return [q[0],q[1],fx(r.Vg,0),fx(r.ratio,2),fx(r.d,0),fx(r.ok,0)]; })},
    analysis:'착륙 오차 대 V_g/풍속 의 그래프를 그린다. 이 값이 1 보다 작으면 오차가 급격히 커지는지, 1 보다 클 때 GPS 잡음 · 선회율이 남은 오차를 결정하는지 확인한다. 도달 가능 영역(바람에 밀린 원) 안에 목표가 있어야만 돌아올 수 있음을 그림으로 설명한다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','일반 낙하산은 바람에 밀려 목표에서 멀리 착륙한다'],['새로운 점','방위 오차각 + 바람 보정 선회로 도달 가능 영역 안의 목표로 복귀하는 간단한 제어'],['구성','파라포일 · GPS · MCU · 좌우 서보 · 조종줄'],['효과 · 한계','착륙 오차 감소 / V_g 가 바람보다 작으면 불가, GPS 잡음 · 선회율 한계']]],
    fails:[['한쪽으로만 계속 돈다','서보 중립 위치 · 줄 길이 보정, 오차각 부호 확인'],['목표 근처에서 좌우로 진동','제어 이득 낮추기, 목표 근처 불감대(±10°) 두기'],['GPS 가 낙하 중 끊긴다','안테나 위치(위로) · 콜드 스타트 대신 미리 위성 고정']],
    up:['<b>바람 추정</b> — 지상속도 − 대기속도로 풍속 추정 후 도착 방향 계획.','<b>마지막 접근</b> — 목표 바람머리 방향으로 정렬한 뒤 착륙(속도 최소).','<b>시뮬레이션</b> — 시드 난수로 100 회 몬테카를로 평가.'],
    next:['원리④ 바람과 낙하 궤적',4],
    eval:[['발명성','제어 방식의 차별점과 근거'],['정량 평가','착륙 오차 분포 · 성공률'],['안전','방출 장소 · 사람 · 시설 안전 확보'],['명세서','V_g 와 풍속 관계를 이용한 한계 기술']],
    tip:'「V_g/풍속 = 1」 선을 기준으로 오차가 급변하는 그래프는 발명의 한계와 가능성을 동시에 보여 주는 가장 설득력 있는 결과입니다.' };
})();
SIMS.I02={ q:'파라포일의 활공비와 바람을 바꾸면 목표로 돌아올 수 있을까? (GPS 잡음 3 m)',
  a:{nm:'활공비 L/D',min:0,max:4,step:0.25,val:2,unit:'',d:2}, b:{nm:'바람(동쪽으로) 세기',min:0,max:8,step:0.5,val:4,unit:'m/s',d:1},
  cap1:'위에서 본 비행 궤적(시뮬레이션 첫 시험). 노란 원 = 도달 가능 영역(바람에 밀린 위치 기준), 초록 = 목표. 새 측정으로 다른 바람 · GPS 잡음 시험.',
  cap2:'📊 평균 착륙 오차 대 L/D (풍속 2 · 4 · 6 m/s, 24 회 평균). 점 = 지금 설정.',
  note:'모형 : 방출 (120, 80) m · 고도 300 m · 침하 5 m/s(60 s 비행) · 수평 대기속도 V_g = L/D × 5 m/s · 선회율 한계 1 rad/s · GPS 잡음 3 m(1 Hz) · 풍속 평균 ± 0.8 m/s. 바람은 +x(동) 방향이라 방출점(동쪽)에서 목표를 멀어지게 밉니다.',
  anim:function(ctx,w,h,t,LD,wd,S){ var q=i02(LD,wd,S.seed), g=q.res[0].g, R=Math.max(140,Math.hypot(I02.P0[0],I02.P0[1])*1.25,Math.max.apply(null,g.x.map(Math.abs))*1.15,Math.max.apply(null,g.y.map(Math.abs))*1.15), sc=Math.min(w/2,h/2-8)/R*0.92, cx=w/2, cy=h/2+4, n=Math.min(g.t.length-1,Math.floor(t/10*(g.t.length-1))), i, pts=[];
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); ctx.fillStyle=COL.plotbg; ctx.fillRect(8,8,w-16,h-16);
    ctx.save(); ctx.beginPath(); ctx.rect(8,8,w-16,h-16); ctx.clip(); cvCirc(ctx,cx+g.reach.cx*sc,cy-g.reach.cy*sc,Math.max(2,g.reach.r*sc),'rgba(251,191,36,.07)',COL.amber,1.2); ctx.restore();
    cvCirc(ctx,cx,cy,20*sc,'rgba(52,211,153,.18)',COL.ok,1.4); cvText(ctx,'목표(20 m)',cx,cy+20*sc+14,COL.ok,'11px system-ui,sans-serif','center');
    for(i=0;i<=n;i++) pts.push([cx+g.x[i]*sc,cy-g.y[i]*sc]); if(pts.length>1) cvLine(ctx,pts,COL.blue,2);
    cvCirc(ctx,cx+I02.P0[0]*sc,cy-I02.P0[1]*sc,4,COL.dim,null,0); cvText(ctx,'방출',cx+I02.P0[0]*sc+7,cy-I02.P0[1]*sc,COL.dim,'10px system-ui,sans-serif');
    var cur=pts[pts.length-1]; cvCirc(ctx,cur[0],cur[1],5,COL.amber,null,0);
    cvLine(ctx,[[16,h-22],[16+40,h-22]],COL.blue,2); cvText(ctx,'바람 '+wd.toFixed(1)+' m/s →',62,h-22,COL.text,'11px system-ui,sans-serif');
    cvText(ctx,'V_g '+q.Vg.toFixed(1)+' m/s '+(q.Vg>wd?'> 풍속 → 복귀 가능':'≤ 풍속 → 복귀 불가')+' · 오차 '+g.miss.toFixed(0)+' m (첫 시험)',12,16,q.Vg>wd?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,LD,wd,S){ var Ls=[0,0.5,1,1.5,2,2.5,3,3.5,4], ws=[2,4,6], cols=[COL.blue,COL.ok,COL.violet||COL.amber], cur=i02(LD,wd,S.seed);
    var P=makePlot(ctx,w,h,{xmin:0,xmax:4,ymin:0,ymax:300,xlabel:'활공비 L/D',ylabel:'평균 착륙 오차 (m)',title:'착륙 오차 — V_g(=L/D×5)가 바람보다 커야 한다',left:56,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }});
    ws.forEach(function(wv,k){ plotLine(ctx,P,Ls.map(function(l){ return [l,Math.min(300,i02(l,wv,S.seed).d)]; }),cols[k],1.8); plotLine(ctx,P,[[wv/I02.VS,0],[wv/I02.VS,300]],cols[k],0.8,[3,3]); });
    plotPoints(ctx,P,[[LD,Math.min(300,cur.d)]],COL.amber,7); legend(ctx,P.x1-130,P.y1+14,[['풍속 2 m/s',cols[0]],['풍속 4 m/s',cols[1]],['풍속 6 m/s',cols[2]],['지금',COL.amber]]); },
  kv:function(LD,wd,S){ var q=i02(LD,wd,S.seed); return [['평균 착륙 오차',q.d.toFixed(0)+' m','a'],['성공률(20 m 이내)',q.ok.toFixed(0)+' %'],['수평 대기속도 V_g',q.Vg.toFixed(1)+' m/s','g'],['V_g / 풍속',wd>0? q.ratio.toFixed(2) : '∞','v2'],['판정',q.Vg>wd?'✅ 복귀 가능':'❌ 복귀 불가','r']]; } };

/* ── I03 : 가변 낙하산 — 벤트로 목표 착지 속도 유지 ──────────────────────── */
var I03 = { M0:0.35, OPEN:0.5 };
function i03(vstar, dm){
  var CdA0=2*I03.M0*SUBJ.g/(SUBJ.rho0*vstar*vstar);       // 공칭 질량에서 벤트 50 % 일 때 v* 가 되도록 낙하산 면적 A0 결정
  var A0=Math.max(1e-4,(CdA0-CAN.CdCan*CAN.A)/CAN.CdChute/(1-I03.OPEN*0.5));
  function CdAf(f){ return CAN.CdCan*CAN.A + CAN.CdChute*A0*(1-0.5*f); }
  var mm=[], lo=I03.M0*(1-dm/100), hi=I03.M0*(1+dm/100), i, rows=[];
  for(i=0;i<=20;i++){ var m=lo+(hi-lo)*i/20, need=2*m*SUBJ.g/(SUBJ.rho0*vstar*vstar), part=need-CAN.CdCan*CAN.A, f=(1-part/(CAN.CdChute*A0))/0.5, fc=Math.max(0,Math.min(1,f));
    rows.push({m:m, vf:vTerm(m,CdAf(I03.OPEN)), vv:vTerm(m,CdAf(fc)), f:fc, sat:f<-0.001||f>1.001}); }
  return {D:2*Math.sqrt(A0/Math.PI)*100, A0:A0, rows:rows, CdAf:CdAf,
    errF:Math.max.apply(null,rows.map(function(r){ return Math.abs(r.vf-vstar); })), errV:Math.max.apply(null,rows.map(function(r){ return Math.abs(r.vv-vstar); })), sat:rows.some(function(r){ return r.sat; }) }; }
(function(){
  var a=i03(5,20), b=i03(5,50), c=i03(7,20), d=i03(4,30);
  PROJ.I03={ id:'I03', t:'가변 낙하산 — 벤트를 여닫아 질량이 달라도 목표 속도로 착지', icon:'🎚️', type:'발명 · 제어', lv:3, dur:'3 ~ 5주', cost:'약 3 ~ 5만 원',
    one:'낙하산 꼭대기의 구멍(벤트)을 서보 덮개로 여닫아 유효 면적을 바꾼다. 속도 센서(기압 변화율)로 목표 착지 속도를 유지하도록 벤트를 제어하여, 탑재물 질량이 달라져도 같은 속도로 내려오게 한다.',
    q:'탑재물 질량이 ±몇 % 까지 달라져도 벤트 조절만으로 목표 속도를 유지할 수 있을까?',
    why:'대회에서는 규정이 「낙하 속도를 정해진 범위로 맞추기」인 경우가 많습니다. 고정 낙하산은 질량이 바뀌면 $v\\propto\\sqrt{m}$ 로 속도가 바뀌지만, <b>면적을 바꿀 수 있는 낙하산</b>이면 보정할 수 있습니다. 제어의 가능 범위(포화)를 숫자로 찾는 것이 핵심입니다.',
    link:'2번 탭(종단속도) · R01(낙하산 면적-속도) · R02 · 발명 01 · 15번 탭(종합 실험 1).',
    fig:FIGS.I03.fig, tg:FIGS.I03.tg,
    cap:'낙하산(왼쪽)의 벤트 구멍을 서보 덮개(가운데)로 연다. 속도 센서(오른쪽)가 v 를 재 목표 속도 제어(왼쪽 아래)가 줄(가운데 아래)로 연결된 캔(오른쪽 아래)의 속도를 맞춘다',
    parts:[['낙하산 + 벤트','돔 꼭대기 구멍(지름 5 ~ 10 cm)','구멍이 열리면 공기가 빠져 유효 면적이 줄고 속도 ↑. 벤트 면적비 0 ~ 30 %.'],
           ['벤트 서보','덮개를 여닫는 9 g 서보','가벼운 PET 덮개 + 걸쇠. 열림 정도 f = 0(닫힘) ~ 1(완전 열림).'],
           ['속도 센서','BMP280 고도 변화 · 필터','고도의 시간 변화로 v = −dh/dt (이동평균 필수). 잡음 → 낮은 반응.'],
           ['목표 속도 제어','P(비례) 또는 PI','v > 목표 → 벤트 닫아 면적 ↑ 속도 ↓. 포화(f=0 · 1) 처리.'],
           ['줄','같은 길이 6 가닥','줄 길이 · 균형이 흐름을 안정화한다.'],
           ['캔(탑재물)','질량 0.25 ~ 0.45 kg','공칭 질량 0.35 kg. 탑재 센서에 따라 ±몇 % 달라진다고 가정.']],
    budget:[['낙하산 천(스프링스트립)','1','약 5천 원','—'],['9 g 서보','1','약 3천 원','—'],['BMP280 · 아두이노','1 세트','약 1.5만 원','—'],['걸쇠 · 줄 · 테이프','1 세트','약 5천 원','—'],['전지','1','약 5천 원','—']],
    steps:['벤트 열림 f = 0, 0.5, 1 에서의 종단속도를 같은 질량으로 5 회씩 측정해 면적-속도 관계를 만든다(R01 과 같은 방법).','공칭 질량(0.35 kg)에서 목표 속도가 되는 낙하산 지름을 구하고 벤트 열림 f = 0.5 를 기준으로 정한다.','질량을 ±20 % 로 바꿔 고정 상태(f = 0.5)의 속도 변화를 측정하고 이론 $\\sqrt{m}$ 와 비교한다.','속도 되먹임 제어(P 제어)로 벤트를 조절해 같은 질량 변화에서 속도 편차를 비교한다.','제어가 효과를 보는 질량 범위(포화 한계)를 표로 정리한다.'],
    vars:['벤트 열림 f · 질량 · 목표 속도','착지 속도 편차 · 포화 여부','센서 필터 길이 · 제어 이득'],
    predict:[['목표 5 m/s · 질량 ±20 %','고정 낙하산 속도 오차 최대 '+fx(a.errF,2)+' m/s → 가변 '+fx(a.errV,2)+' m/s','벤트가 f 0.17 ~ 0.83 사이에서 보정 → 목표 유지'],
             ['목표 5 m/s · 질량 ±50 %','가변 오차 '+fx(b.errV,2)+' m/s ('+(b.sat?'일부 구간 포화':'포화 없음')+')','보정 폭을 넘으면 벤트가 완전 열림 · 닫힘에 걸려 오차가 남는다'],
             ['목표 7 m/s · ±20 %','고정 오차 '+fx(c.errF,2)+' m/s → 가변 '+fx(c.errV,2)+' m/s','목표가 빠를수록 같은 질량 변화의 속도 차이도 커진다'],
             ['목표 4 m/s · ±30 %','필요 지름 약 '+fx(d.D,0)+' cm, 가변 오차 '+fx(d.errV,2)+' m/s','느린 목표 속도 = 큰 낙하산']],
    data:{cols:['목표 (m/s)','질량 편차 (±%)','낙하산 지름 (cm)','고정 오차 (m/s)','가변 오차 (m/s)','포화'],
          rows:[[5,10],[5,20],[5,30],[5,50],[7,20],[4,30]].map(function(q){ var r=i03(q[0],q[1]); return [q[0],q[1],fx(r.D,0),fx(r.errF,2),fx(r.errV,2),r.sat?'있음':'없음']; })},
    analysis:'질량-착지 속도 그래프를 고정 · 가변 두 경우로 그린다. 고정은 $v\\propto\\sqrt m$ 로 곡선, 가변은 목표 근처 수평선(포화 전까지). 수평선이 끝나는 질량 편차가 이 발명의 「보정 범위」이다. 센서 지연 · 필터 길이가 과도 응답(오버슈트)에 미치는 영향은 시간-속도 그래프로 본다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','탑재물 질량이 달라지면 낙하 속도가 달라져 규정을 못 맞춘다'],['새로운 점','꼭대기 벤트 면적을 되먹임 제어해 질량에 관계없이 목표 속도 유지'],['구성','낙하산 · 벤트 덮개 서보 · 속도 센서 · 제어기'],['효과 · 한계','보정 범위 ± 몇 % / 벤트 면적비 한계 · 센서 지연 · 오버슈트']]],
    fails:[['속도가 계속 출렁인다','이득이 너무 큼 — 낮추고 센서를 이동평균, 벤트 변화 속도 제한'],['벤트가 반대로 움직인다','부호 확인 : 속도 > 목표 이면 벤트를 닫는다'],['낙하산이 찌그러진다','벤트가 너무 크거나 줄 균형 불량 — 벤트 크기 축소']],
    up:['<b>질량 자동 인식</b> — 처음 몇 초의 가속도로 질량을 추정해 초기 f 설정.','<b>착지 직전 감속</b> — 마지막 20 m 에서 벤트 완전 닫아 충격 ↓.','<b>적응형</b> — 대기 밀도(고도)에 따른 보정(1번 탭).'],
    next:['원리② 낙하산과 종단속도',2],
    eval:[['발명성','면적 가변 방식의 새로움'],['정량 평가','보정 범위 · 오차 표'],['제어 설계','포화 · 안정성 고려'],['명세서','한계의 솔직한 서술']],
    tip:'「고정 vs 가변」 질량-속도 그래프 하나로 발명의 효과와 한계(포화)를 동시에 보여 줄 수 있습니다.' };
})();
SIMS.I03={ q:'목표 속도와 질량 편차를 바꾸면 가변 낙하산이 보정할 수 있는 범위는 어디까지일까?',
  a:{nm:'목표 착지 속도 v*',min:3,max:9,step:0.5,val:5,unit:'m/s',d:1}, b:{nm:'질량 편차(±)',min:0,max:60,step:5,val:20,unit:'%',d:0},
  cap1:'가장 무거운 질량(공칭 +편차)으로 낙하. 왼쪽 = 고정 낙하산, 오른쪽 = 가변(벤트 제어). 보정 범위를 넘으면 벤트가 완전 열림 · 닫힘에 갇힙니다.',
  cap2:'📊 질량 대 착지 속도. 파랑 = 고정, 초록 = 가변, 점선 = 목표. 초록이 수평선인 구간이 보정 범위.',
  note:'모형 : 공칭 질량 0.35 kg 에서 벤트 50 % 열림일 때 목표 속도가 되도록 낙하산 면적 설계. 벤트 완전 열림 = 낙하산 항력 면적 50 % 감소, 닫힘 = 100 %. 종단속도 v = √(2mg/ρCdA). 센서 지연 · 과도 응답은 무시한 정상 상태 모형입니다.',
  anim:function(ctx,w,h,t,vs,dm,S){ var q=i03(vs,dm), r=q.rows[q.rows.length-1], gy=h-30, top=44, H=7, sc=(gy-top-90)/H, tt=t*0.14, vF=r.vf, vV=r.vv, dF=Math.min(H,fall1D(vF,tt)), dV=Math.min(H,fall1D(vV,tt)), xs=[w*0.28,w*0.72], ds=[dF,dV], vv=[vF,vV], k;
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    for(k=0;k<2;k++){ var y=top+70+ds[k]*sc, rr=(k===0? q.D*0.65 : q.D*0.65*(1-0.25*r.f)); rr=Math.min(rr,w*0.18); if(ds[k]<H) drawChute(ctx,xs[k],y,34,Math.max(12,rr),1); drawCan(ctx,xs[k],y,30);
      if(k===1){ cvText(ctx,'벤트 '+(r.f*100).toFixed(0)+' %'+(r.sat?' (포화)':''),xs[k],y-48-Math.max(12,rr)*0.4,r.sat?COL.grav:COL.ok,'11px system-ui,sans-serif','center'); }
      cvText(ctx,(k?'가변':'고정')+' '+vv[k].toFixed(1)+' m/s',xs[k],gy+16,Math.abs(vv[k]-vs)<0.3?COL.ok:COL.grav,'bold 12px system-ui,sans-serif','center'); }
    cvText(ctx,'질량 '+(r.m*1000).toFixed(0)+' g · 목표 '+vs.toFixed(1)+' m/s',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,vs,dm,S){ var q=i03(vs,dm), P=makePlot(ctx,w,h,{xmin:q.rows[0].m*1000-1,xmax:q.rows[q.rows.length-1].m*1000+1,ymin:vs*0.6,ymax:vs*1.4,xlabel:'탑재 질량 (g)',ylabel:'착지 속도 (m/s)',title:'질량이 달라질 때 착지 속도',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    plotLine(ctx,P,q.rows.map(function(r){ return [r.m*1000,r.vf]; }),COL.blue,2.2); plotLine(ctx,P,q.rows.map(function(r){ return [r.m*1000,r.vv]; }),COL.ok,2.6); plotLine(ctx,P,[[q.rows[0].m*1000-1,vs],[q.rows[q.rows.length-1].m*1000+1,vs]],COL.grav,1.2,[4,3]);
    legend(ctx,P.x1-130,P.y1+14,[['고정 낙하산',COL.blue],['가변(벤트 제어)',COL.ok],['목표',COL.grav]]); },
  kv:function(vs,dm,S){ var q=i03(vs,dm); return [['낙하산 지름(설계)',q.D.toFixed(0)+' cm','a'],['고정 최대 속도 오차',q.errF.toFixed(2)+' m/s','r'],['가변 최대 속도 오차',q.errV.toFixed(2)+' m/s','g'],['보정 범위 초과',q.sat?'있음(포화)':'없음','v2'],['개선 배율',(q.errV>0.005? (q.errF/q.errV).toFixed(1) : '∞')+' 배']]; } };

/* ── I04 : 격자 완충재 — 3D 프린트 격자의 두께 · 채움률 설계 ─────────────── */
var I04 = { M:0.35, A:Math.PI*0.033*0.033, V:4, S0:0.53e6 };
function i04(dmm, phiPct){
  var phi=phiPct/100, sp=I04.S0*Math.pow(phi,1.5), F=sp*I04.A, aPl=F/I04.M, ed=0.8*(1-phi), sAv=ed*dmm/1000, sNeed=I04.V*I04.V/(2*aPl), peak, bott;
  if(sNeed<=sAv){ peak=aPl*1.1; bott=false; } else { var vrem2=I04.V*I04.V-2*aPl*sAv; peak=aPl+vrem2/(2*0.002); bott=true; }
  return {g:peak/SUBJ.g, gPl:aPl/SUBJ.g, sNeed:sNeed*1000, sAv:sAv*1000, bott:bott, F:F, sp:sp}; }
(function(){
  var a=i04(40,15), b=i04(80,15), c=i04(40,5), d=i04(40,30), e=i04(20,15);
  PROJ.I04={ id:'I04', t:'격자 완충재 — 3D 프린트 격자의 두께와 채움률로 충격 줄이기', icon:'🧱', type:'발명 · 구조', lv:2, dur:'3 ~ 4주', cost:'약 2 ~ 4만 원',
    one:'3D 프린터로 출력한 격자(라티스) 구조를 캔 바닥에 붙여 충돌 때 찌그러지며 에너지를 흡수하게 한다. 두께 d 와 채움률 φ 를 바꿔 충격 가속도의 최솟값(최적 설계)을 찾는다.',
    q:'격자 완충재의 두께 d 와 채움률 φ 는 어떤 조합일 때 같은 낙하 속도에서 충격 가속도가 가장 작을까?',
    why:'스펀지는 너무 부드러우면 「바닥에 닿아」 충격이 커지고 너무 단단하면 충격이 크게 전달됩니다. 격자 구조는 <b>같은 힘으로 일정하게 찌그러지는(플래토)</b> 영역이 있어 에너지를 효율적으로 흡수합니다. 재료 · 구조 설계의 핵심 개념을 몸으로 느낄 수 있습니다.',
    link:'6번 탭(충격 $a=v^2/2d$) · R06(충격 측정) · 창의 06(달걀 우주인) · 3D 프린터 활용 수업.',
    fig:FIGS.I04.fig, tg:FIGS.I04.tg,
    cap:'격자 구조(왼쪽)가 캔 몸체(가운데) 바닥에 붙어 충돌 때 찌그러진다. 3D 프린터(오른쪽)가 두께 · 채움률이 다른 시편을 만든다. 응력-변형 곡선(왼쪽 아래)과 가속도 센서(가운데 아래), 낙하대(오른쪽 아래)로 시험',
    parts:[['격자 구조','채움률 5 ~ 30 % · 두께 10 ~ 60 mm','TPU(유연) 또는 PLA 로 출력. 채움률 φ 가 클수록 단단하다.'],
           ['캔 몸체','질량 0.35 kg(모형)','바닥에 완충재를 끼운다. 질량을 고정해 비교.'],
           ['3D 프린터','FDM · 노즐 0.4 mm','같은 격자를 두께 · 채움률만 바꿔 여러 개 출력. 출력 방향 · 온도 기록.'],
           ['응력-변형 곡선','초기 탄성 → 플래토 → 치밀화','플래토 응력 σ_p 가 일정한 힘 F = σ_p·A 를 만든다. 치밀화가 시작되면 힘이 급증.'],
           ['가속도 센서','ADXL375 · 200 g 급','충돌 순간 가속도 시계열을 기록(R06).'],
           ['낙하대','일정한 높이(0.8 m ≈ 4 m/s)','같은 속도로 낙하. 높이 h → $v=\\sqrt{2gh}$.']],
    budget:[['TPU 필라멘트(또는 PLA)','1 롤','약 2.5만 원','학교 3D 프린터실'],['가속도 센서 모듈','1','약 1.5만 원','스마트폰 앱 센서'],['아두이노 · SD','1 세트','약 1.5만 원','—'],['캔 모형 · 줄자','1','약 5천 원','—'],['낙하대(막대 · 스톱)','1','보유','—']],
    steps:['격자 시편(두께 40 mm, 채움률 10 · 20 · 30 %)을 출력하고 천천히 눌러 힘-변위(또는 무게 올려 변형) 곡선을 만든다.','플래토 응력 σ_p 를 구한다(힘 F / 면적 A). $\\sigma_p\\propto\\varphi^{1.5}$ 정도의 관계가 나오는지 확인한다.','가속도 센서를 단 캔을 0.8 m 에서 낙하시켜 두께 · 채움률별 최대 가속도를 5 회씩 측정한다.','「바닥 닿음(치밀화)」이 나타나는 조합과 그렇지 않은 조합을 구별해 기록한다.','최적 조합(가장 작은 최대 가속도)을 고르고 이론 예측과 비교한다.'],
    vars:['두께 d · 채움률 φ · 격자 형태','충격 최대 가속도(g) · 바닥 닿음 여부','낙하 속도 · 캔 질량 · 출력 방향'],
    predict:[['d 40 mm · φ 15 %','최대 가속도 약 '+fx(a.g,0)+' g'+(a.bott?' (바닥 닿음)':' (플래토 구간)'),'필요 멈춤 거리 '+fx(a.sNeed,0)+' mm ≤ 쓸 수 있는 거리 '+fx(a.sAv,0)+' mm'],
             ['d 20 mm · φ 15 %(절반 두께)','약 '+fx(e.g,0)+' g'+(e.bott?' (바닥 닿음)':''),'멈출 거리가 모자라 격자가 다 눌리면(치밀화) 가속도가 폭증한다'],
             ['d 80 mm · φ 15 %(2 배 두께)','약 '+fx(b.g,0)+' g (플래토 가속도와 같다)','같은 격자면 두께를 늘려도 평균 힘은 같다 — 두께는 「바닥 닿음」만 막아 준다'],
             ['d 40 mm · φ 5 %','약 '+fx(c.g,0)+' g (바닥 닿음)','너무 무르면 충분히 못 막고 바닥에 닿아 큰 충격'],
             ['d 40 mm · φ 30 %','약 '+fx(d.g,0)+' g','너무 단단하면 플래토 힘이 커서 충격이 큼']],
    data:{cols:['두께 d (mm)','채움률 φ (%)','플래토 가속도 (g)','필요 멈춤 거리 (mm)','가용 거리 (mm)','최대 가속도 (g)'],
          rows:[[40,5],[40,10],[40,15],[40,20],[40,30],[20,15]].map(function(q){ var r=i04(q[0],q[1]); return [q[0],q[1],fx(r.gPl,0),fx(r.sNeed,0),fx(r.sAv,0),fx(r.g,0)+(r.bott?' ⚠':'')]; })},
    analysis:'φ 대 최대 가속도 그래프는 U 자 모양이다(왼쪽 = 바닥 닿음, 오른쪽 = 너무 단단함). 최저점이 최적 채움률이며 두께가 커질수록 최저 가속도가 낮아지고 최적 φ 가 작아진다. 실험 곡선과 이론 곡선의 차이는 접착 · 출력 오차 · 격자 비틀림으로 분석한다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','캔 충돌 때 전자 부품에 큰 충격이 전달된다'],['새로운 점','채움률을 두께에 맞춰 최적화한 3D 프린트 격자 완충재(플래토 이용)'],['구성','격자층 · 접착면 · 캔 몸체 · (선택) 가속도 센서'],['효과 · 한계','충격 가속도 ↓, 질량 소폭 증가 / 반복 충돌 시 변형 · 출력 품질 편차']]],
    fails:[['시험마다 가속도가 크게 다르다','낙하 속도 · 방향 일정하게, 출력 방향(층 방향) 통일'],['TPU 가 늘어져 격자가 불균일','출력 속도 낮추기 · 냉각 · 건조 필라멘트'],['충돌 후 변형이 남는다','한 번 쓰는 소모형으로 설계하거나 복원이 좋은 재료 선택']],
    up:['<b>구배 격자</b> — 아래쪽을 무르게, 위를 단단하게(점진적 감속).','<b>방향 설계</b> — 옆 충돌 · 비스듬한 충돌까지 고려한 구조.','<b>질량 최적화</b> — 가속도 대비 무게(성능 지수)로 비교.'],
    next:['원리⑤ 전력 · 충격 · 안전',6],
    eval:[['발명성','구조 설계의 아이디어와 독창성'],['정량 평가','두께 · 채움률별 가속도 곡선'],['재현성','출력 조건 · 시험 조건 기록'],['명세서','한계(반복 · 비스듬한 충돌) 서술']],
    tip:'U 자 곡선(φ 대 최대 가속도)과 최저점 표시는 「최적 설계」를 가장 직관적으로 보여 주는 한 장입니다.' };
})();
SIMS.I04={ q:'두께와 채움률을 바꾸면 격자 완충재의 충격 가속도는 어디서 가장 작을까? (바닥 닿음에 주의)',
  a:{nm:'두께 d',min:10,max:80,step:5,val:40,unit:'mm',d:0}, b:{nm:'채움률 φ',min:3,max:40,step:1,val:15,unit:'%',d:0},
  cap1:'캔이 4 m/s 로 격자에 충돌합니다(×0.2 슬로모션). 격자가 찌그러지는 정도와 치밀화(바닥 닿음)를 보세요.',
  cap2:'📊 채움률 대 최대 가속도(두께 20 · 40 · 60 mm와 지금 설정). 왼쪽 급등 = 바닥 닿음, 오른쪽 완만한 상승 = 너무 단단함. U 자의 바닥이 최적.',
  note:'모형 : 질량 0.35 kg, 충돌 속도 4 m/s, 단면적 3.4 cm². 격자 플래토 응력 σ_p = 0.53 MPa × φ^1.5(교육용 가정 — 재료 · 구조에 따라 크게 다름), 치밀화 변형 0.8(1−φ). 에너지 흡수 거리가 모자라면 마지막 2 mm 에서 급정지로 가속도가 폭증합니다.',
  anim:function(ctx,w,h,t,dmm,phi,S){ var q=i04(dmm,phi), gy=h-30, cx=w*0.5, tt=Math.min(1,t/10*5), baseT=dmm*1.4, comp=Math.min(1,tt*1.0), sMax=Math.min(q.sAv,q.sNeed), cmp=Math.min(baseT, (sMax/Math.max(1,dmm))*baseT*(tt<0.5?tt*2:1)), cy0=gy-baseT-60, cy=cy0+ (tt<0.4? 80*tt/0.4*0 + 0:0), k, y;
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    var hh=baseT-cmp*(tt>0.4?1:0), canY=gy-hh-74; ctx.fillStyle='rgba(251,191,36,.25)'; ctx.fillRect(cx-40,gy-hh,80,hh); ctx.strokeStyle=COL.amber; ctx.lineWidth=1;
    var nl=6; for(k=0;k<=nl;k++){ y=gy-hh+hh*k/nl; ctx.beginPath(); ctx.moveTo(cx-40,y); ctx.lineTo(cx+40,y); ctx.stroke(); } for(k=0;k<=5;k++){ ctx.beginPath(); ctx.moveTo(cx-40+80*k/5,gy-hh); ctx.lineTo(cx-40+80*k/5,gy); ctx.stroke(); }
    if(tt<0.4) canY=gy-baseT-74-(0.4-tt)*140; drawCan(ctx,cx,canY,74);
    cvText(ctx,'최대 '+q.g.toFixed(0)+' g · '+(q.bott?'바닥 닿음 ⚠':'플래토 구간 ✔'),12,16,q.bott?COL.grav:COL.ok,'bold 12px system-ui,sans-serif'); cvText(ctx,'d '+dmm+' mm · φ '+phi+' % · 필요 거리 '+q.sNeed.toFixed(0)+' mm / 가용 '+q.sAv.toFixed(0)+' mm',12,34,COL.text,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,dmm,phi,S){ var ds=[20,40,60], cols=[COL.blue,COL.ok,COL.violet||COL.amber], ph=[], i; for(i=3;i<=40;i++) ph.push(i); var cur=i04(dmm,phi);
    var P=makePlot(ctx,w,h,{xmin:3,xmax:40,ymin:0,ymax:200,xlabel:'채움률 φ (%)',ylabel:'최대 가속도 (g)',title:'U 자 곡선 — 너무 무르면 바닥, 너무 단단하면 큰 힘',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    ds.forEach(function(d,k){ plotLine(ctx,P,ph.map(function(p){ return [p,Math.min(200,i04(d,p).g)]; }),cols[k],1.8); }); plotLine(ctx,P,ph.map(function(p){ return [p,Math.min(200,i04(dmm,p).g)]; }),COL.amber,2.8);
    plotPoints(ctx,P,[[phi,Math.min(200,cur.g)]],COL.amber,7); legend(ctx,P.x1-130,P.y1+14,[['d 20 mm',cols[0]],['d 40 mm',cols[1]],['d 60 mm',cols[2]],['지금 d '+dmm,COL.amber]]); },
  kv:function(dmm,phi,S){ var q=i04(dmm,phi), best=1e9, bp=0, p; for(p=3;p<=40;p+=0.5){ var g=i04(dmm,p).g; if(g<best){ best=g; bp=p; } } return [['최대 가속도',q.g.toFixed(0)+' g','r'],['플래토 가속도',q.gPl.toFixed(0)+' g'],['필요 멈춤 거리',q.sNeed.toFixed(0)+' mm','a'],['가용 거리',q.sAv.toFixed(0)+' mm','g'],['이 두께의 최적 φ',bp.toFixed(1)+' % ('+best.toFixed(0)+' g)','v2']]; } };

/* ── I05 : 영상 안정화 — 짐벌 대역폭과 흔들림 진폭 ────────────────────────── */
var I05 = { F:0.65, FOV:60, PX:1920, TEXP:1/500, LIM:25 };       // 낙하산 아래 진자 흔들림 0.65 Hz(줄 길이 ≈ 0.6 m)
function i05(A, fb){ var f=I05.F, ratio=f/fb, hp=ratio/Math.sqrt(1+ratio*ratio);      // 고역 통과 : 흔들림 진폭을 제어 대역폭 fb 로 줄인다
  var resid=A*hp, ex=A>I05.LIM? (A-I05.LIM) : 0, res2=Math.sqrt(resid*resid+ex*ex), w0=2*Math.PI*f*A*Math.PI/180, w1=2*Math.PI*f*res2*Math.PI/180, pxdeg=I05.PX/I05.FOV;
  return {raw:A/Math.SQRT2, res:res2/Math.SQRT2, gain:A/Math.max(res2,1e-6), blur0:w0*I05.TEXP*180/Math.PI*pxdeg, blur1:w1*I05.TEXP*180/Math.PI*pxdeg, sat:A>I05.LIM, resA:res2}; }
(function(){
  var a=i05(12,2), b=i05(12,0.5), c=i05(30,3), d=i05(8,6);
  PROJ.I05={ id:'I05', t:'영상 안정화 — 짐벌 제어 대역폭으로 낙하 영상의 흔들림 줄이기', icon:'🎥', type:'발명 · 영상', lv:3, dur:'4 ~ 6주', cost:'약 4 ~ 7만 원',
    one:'낙하산 아래에서 진자처럼 흔들리는 캔 속 카메라를 IMU 와 2 축 서보 짐벌로 안정화한다. 제어 대역폭 f_b 와 흔들림 진폭 A 에 따라 영상 흔들림 · 번짐이 얼마나 줄어드는지 정량 평가한다.',
    q:'제어 대역폭을 몇 Hz 로 해야 낙하 흔들림(약 0.65 Hz)이 눈에 띄게 줄고 영상 번짐이 사라질까?',
    why:'낙하 영상은 <b>진자 흔들림과 회전</b>으로 멀미가 날 정도로 흔들립니다. 짐벌은 흔들림 주파수보다 충분히 빠르게 반응해야 합니다. 「흔들림 주파수 대 제어 대역폭」이라는 제어공학의 핵심을 영상 품질로 확인합니다.',
    link:'원리⑤ 센서 · 관성(5번 탭) · 창의 05(낙하 영상) · 발명 10(리액션 휠) · 도구함의 IMU 코드.',
    fig:FIGS.I05.fig, tg:FIGS.I05.tg,
    cap:'카메라(왼쪽)를 2 축 짐벌(가운데)에 달고 IMU(오른쪽)가 기울기를 알려 주면 서보 2 개(가운데 아래)가 반대로 움직인다. 흔들림 곡선(왼쪽 아래 : 빨강 = 안정화 전, 초록 = 후)과 영상(오른쪽 아래)',
    parts:[['카메라','소형 캠 · 1080p · 30 fps','셔터 속도 1/500 s 이상으로 번짐 줄임. 화각 약 60°.'],
           ['2 축 짐벌','롤 · 피치 프레임','서보 2 개로 각 축을 ±25° 범위에서 보정. 가볍게 3D 프린트.'],
           ['IMU','MPU6050 · 100 Hz','자이로 + 가속도 → 상보 필터로 기울기. 드리프트 보정 필요.'],
           ['흔들림 비교','안정화 전 · 후 각도 시계열','진폭 · RMS 를 계산(분석 단계).'],
           ['서보 2 개','9 g 서보 · 반응 5 ~ 10 Hz 급','대역폭이 제어 성능의 한계. 서보 속도 · 지연 확인.'],
           ['영상 평가','번짐 · 흔들림 정도','영상에서 지평선 기울기 · 프레임 간 이동량을 분석.']],
    budget:[['MPU6050 IMU','1','약 3천 원','—'],['9 g 서보 2 개','1 세트','약 6천 원','—'],['소형 카메라','1','약 2만 원','스마트폰'],['아두이노 · 전원','1 세트','약 1.5만 원','—'],['3D 프린트 프레임','1','약 5천 원','—']],
    steps:['줄에 매단 카메라의 진자 흔들림 주기를 스톱워치로 재고($T=2\\pi\\sqrt{L/g}$) 이론과 비교한다.','IMU 로 기울기를 기록해 흔들림 진폭 A · 주파수 f 를 구한다.','서보 짐벌에 IMU 되먹임을 구현하고(P 제어) 이득을 바꿔 가며 제어 대역폭을 조절한다.','안정화 전 · 후의 영상에서 프레임 간 지평선 각도 변화(RMS)를 비교한다.','진폭이 클 때(서보 가동 한계)의 효과 감소를 확인하고 한계를 표로 정리한다.'],
    vars:['제어 대역폭 f_b · 흔들림 진폭 A','영상 RMS 흔들림 · 번짐(px)','서보 한계 · 센서 지연 · 셔터 속도'],
    predict:[['A 12° · f_b 2 Hz','흔들림 RMS '+fx(a.raw,1)+'° → '+fx(a.res,1)+'° ('+fx(a.gain,1)+' 배 감소) · 번짐 '+fx(a.blur0,1)+' → '+fx(a.blur1,1)+' px','$|E|=A\\cdot\\dfrac{f/f_b}{\\sqrt{1+(f/f_b)^2}}$'],
             ['A 12° · f_b 0.5 Hz','흔들림 RMS '+fx(b.res,1)+'° ('+fx(b.gain,1)+' 배)','제어가 흔들림(0.65 Hz)보다 느리면 거의 효과 없다'],
             ['A 30° · f_b 3 Hz','서보 한계 25° 초과 → 잔여 '+fx(c.res,1)+'°','진폭이 가동 범위를 넘으면 포화로 효과 ↓'],
             ['A 8° · f_b 6 Hz','잔여 '+fx(d.res,2)+'° ('+fx(d.gain,1)+' 배) · 번짐 '+fx(d.blur1,2)+' px','대역폭이 흔들림 주파수의 10 배면 ≈ 10 배 감소']],
    data:{cols:['A (°)','f_b (Hz)','안정화 전 RMS (°)','후 RMS (°)','감소 배율','번짐 후 (px)'],
          rows:[[12,0.5],[12,1],[12,2],[12,4],[12,6],[30,3]].map(function(q){ var r=i05(q[0],q[1]); return [q[0],q[1],fx(r.raw,1),fx(r.res,2),fx(r.gain,1),fx(r.blur1,2)]; })},
    analysis:'제어 대역폭 대 감소 배율을 그래프로 그린다. f_b ≪ f 에서는 1 배(효과 없음), f_b ≫ f 에서는 약 f_b/f 배로 줄어듦을 확인한다. 이론 곡선과 실험 점의 차이는 서보 지연 · 센서 잡음 · 마찰로 설명한다. 번짐 픽셀은 각속도 × 노출시간 × 픽셀/° 로 환산한다.',
    special:['📄 발명 명세서(초안)',[['해결 과제','낙하산 아래 진자 흔들림으로 영상이 심하게 흔들린다'],['새로운 점','IMU 되먹임 2 축 짐벌의 제어 대역폭을 흔들림 주파수에 맞춘 경량 설계'],['구성','카메라 · 2 축 짐벌 · IMU · 서보 · MCU'],['효과 · 한계','영상 흔들림 감소 / 서보 대역폭 · 가동 범위 · 질량 증가']]],
    fails:[['안정화하니 오히려 떨린다','이득이 너무 큼 — 낮추고 센서 필터(상보 필터) 조정'],['한쪽으로 서서히 기운다','자이로 드리프트 — 가속도 보정 · 정지 시 보정'],['서보가 뜨겁다 · 소음','항상 작동하는 서보 부하 — 데드존 · 가벼운 프레임']],
    up:['<b>3 축 + 회전</b> — 요 축(회전)까지 보정하는 3 축 짐벌.','<b>소프트웨어 안정화</b> — 영상 후처리(전자 흔들림 보정)와 비교.','<b>리액션 휠</b>(발명 10) — 몸체 자세로 흔들림 감소.'],
    next:['원리⑤ 센서 · 전력 · 안전',5],
    eval:[['발명성','구조 · 제어 아이디어'],['정량 평가','안정화 전 · 후 RMS 와 배율'],['영상 품질','번짐 · 지평선 기울기'],['명세서','포화 · 지연의 한계 기술']],
    tip:'안정화 전 · 후 영상을 나란히 재생하고 RMS 값을 자막으로 넣으면 짧은 영상 하나로 발명의 효과가 전달됩니다.' };
})();
SIMS.I05={ q:'제어 대역폭과 흔들림 진폭을 바꾸면 영상 흔들림은 얼마나 줄어들까? (낙하 흔들림 0.65 Hz)',
  a:{nm:'제어 대역폭 f_b',min:0.2,max:8,step:0.2,val:2,unit:'Hz',d:1}, b:{nm:'흔들림 진폭 A',min:2,max:40,step:2,val:12,unit:'°',d:0},
  cap1:'같은 흔들림(0.65 Hz)을 겪는 카메라 화면. 왼쪽 = 안정화 전, 오른쪽 = 안정화 후. 건물(사각형)이 화면 안에서 얼마나 흔들리는지 비교.',
  cap2:'📊 제어 대역폭 대 잔여 흔들림 RMS(진폭 6 · 12 · 30°). 점선 = 지금 진폭의 안정화 전 RMS, 점 = 지금 설정. 30° 는 서보 한계 25° 를 넘어 일부가 남는다.',
  note:'모형 : 흔들림 f = 0.65 Hz(줄 0.6 m 진자). 안정화 잔여 = A·(f/f_b)/√(1+(f/f_b)²)(고역 통과), 가동 범위 ±25° 초과분은 보정 불가. 번짐 px = 각속도 × 노출(1/500 s) × 32 px/°(1080p · 화각 60°). 서보 지연 · 센서 잡음은 무시한 이상 모형입니다.',
  anim:function(ctx,w,h,t,fb,A,S){ var q=i05(A,fb), pw=w/2-14, ph=h-62, px0=[8,w/2+6], k, ang=Math.sin(2*Math.PI*I05.F*t*0.5), pxdeg=pw/I05.FOV*0.9;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    for(k=0;k<2;k++){ var amp=k===0? A : q.resA, dx=amp*ang*pxdeg*0.5, x0=px0[k], y0=38; ctx.save(); ctx.beginPath(); ctx.rect(x0,y0,pw,ph); ctx.clip(); ctx.fillStyle='#1b3a5e'; ctx.fillRect(x0,y0,pw,ph*0.55); ctx.fillStyle=COL.ground; ctx.fillRect(x0,y0+ph*0.55,pw,ph*0.45);
      ctx.translate(dx,0); ctx.fillStyle='#64748b'; ctx.fillRect(x0+pw*0.18,y0+ph*0.28,pw*0.18,ph*0.3); ctx.fillRect(x0+pw*0.5,y0+ph*0.38,pw*0.14,ph*0.2); ctx.fillRect(x0+pw*0.72,y0+ph*0.22,pw*0.12,ph*0.36); ctx.fillStyle=COL.amber; ctx.fillRect(x0+pw*0.2,y0+ph*0.34,6,6); ctx.restore();
      ctx.strokeStyle=COL.dim; ctx.lineWidth=1.2; ctx.strokeRect(x0,y0,pw,ph); cvText(ctx,k===0?'안정화 전 (A '+A+'°)':'안정화 후 (f_b '+fb.toFixed(1)+' Hz)',x0+pw/2,y0-8,k?COL.ok:COL.grav,'bold 12px system-ui,sans-serif','center'); }
    cvText(ctx,'RMS '+q.raw.toFixed(1)+'° → '+q.res.toFixed(2)+'° · '+q.gain.toFixed(1)+' 배 감소'+(q.sat?' · 서보 한계 초과':''),w/2,h-10,COL.text,'bold 12px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,fb,A,S){ var fbs=[], i; for(i=0;i<=40;i++) fbs.push(0.2+i*0.2); var As=[6,12,30], cols=[COL.blue,COL.ok,COL.violet||COL.amber], cur=i05(A,fb);
    var P=makePlot(ctx,w,h,{xmin:0.2,xmax:8,ymin:0,ymax:22,xlabel:'제어 대역폭 f_b (Hz)',ylabel:'잔여 흔들림 RMS (°)',title:'f_b 가 클수록 잔여 흔들림이 줄어든다(흔들림 0.65 Hz)',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    As.forEach(function(a2,k){ plotLine(ctx,P,fbs.map(function(f){ return [f,i05(a2,f).res]; }),cols[k],1.8); }); plotLine(ctx,P,[[0.2,A/Math.SQRT2],[8,A/Math.SQRT2]],COL.grav,1.2,[4,3]);
    plotPoints(ctx,P,[[fb,cur.res]],COL.amber,7); legend(ctx,P.x1-130,P.y1+14,[['A 6°',cols[0]],['A 12°',cols[1]],['A 30°(포화)',cols[2]],['지금',COL.amber]]); },
  kv:function(fb,A,S){ var q=i05(A,fb); return [['안정화 전 RMS',q.raw.toFixed(1)+' °'],['안정화 후 RMS',q.res.toFixed(2)+' °','g'],['감소 배율',q.gain.toFixed(1)+' 배','a'],['번짐(전 → 후)',q.blur0.toFixed(1)+' → '+q.blur1.toFixed(2)+' px','v2'],['서보 한계 25°',q.sat?'초과(포화)':'범위 안','r']]; } };
