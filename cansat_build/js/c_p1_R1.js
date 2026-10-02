/* ═══════════════════════════════════════════════════════════════════════════
   R&E 프로젝트 R01 ~ R05
   · 모든 「예측 결과」 숫자는 아래 모형 함수에서 계산한다(카드 · 미니 모의실험이 같은 값을 쓴다).
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── R01 : 낙하산 지름 – 종단속도 (m = 50 g 기본) ───────────────────────── */
function r01v(D, m){ return vTerm(m, dragArea(D), SUBJ.rho0); }
var R01D=[0.15,0.2,0.3,0.4,0.5];
(function(){
  var m=0.05, i, v=R01D.map(function(d){ return r01v(d,m); }), fit=llFit(R01D.map(function(d,k){ return [d,v[k]]; }));
  PROJ.R01={ id:'R01', t:'낙하산 지름 법칙 — v_t 는 정말 1/D 에 비례할까?', icon:'🪂', type:'프로젝트 · R&E 입문', lv:1, dur:'2주', cost:'1 ~ 3만 원',
    one:'비닐 낙하산(지름 15 ~ 50 cm)에 같은 추를 달아 낙하 속도를 스마트폰 영상으로 재고, 종단속도가 지름에 반비례하는지 log–log 그래프로 확인한다.',
    q:'같은 질량에서 낙하산 지름 D 와 종단속도 $v_t$ 가 $v_t\\propto D^{p}$ 일 때 p = −1 일까? 캔 몸통과 줄의 공기 저항은 기울기를 얼마나 바꿀까?',
    why:'낙하산이 크면 느리다는 것은 누구나 알지만 「지름이 2 배면 정확히 ½ 배」인지는 직접 재 봐야 압니다. log–log 그래프의 기울기로 지수를 구하는 방법은 과학 전반에서 쓰는 핵심 기술이고, 값이 −1 에서 조금 벗어나는 까닭을 찾는 것이 R&E 의 재미입니다.',
    link:'교과서 힘과 운동(알짜힘 · 공기 저항) · 이 학습실 2번 탭 종단속도 · 15번 탭 [종합1] 이 이 프로젝트의 정량 버전입니다.',
    fig:FIGS.R01.fig, tg:FIGS.R01.tg,
    cap:'지름이 다른 비닐 낙하산 세 개(20 · 30 · 50 cm)에 같은 추를 매달아 같은 높이에서 떨어뜨리고, 눈금자(2 m)와 함께 240 fps 슬로모션으로 찍어 마지막 1 m 의 통과 시간을 잰다. 오른쪽 그래프가 v – D',
    parts:[['비닐 낙하산','D 15 ~ 50 cm','쓰레기봉투 · 분리수거 비닐을 컴퍼스로 둥글게 오린다. 지름 5 가지. <i>가장자리를 테이프로 보강</i>하면 찢어지지 않는다.'],
           ['추(캔위성 모형)','50 g 고정','너트 · 와셔를 비닐봉지에 담아 50 g(저울로 확인). 질량은 <i>모든 낙하에서 같게</i> — 통제 변인.'],
           ['줄 6 가닥','길이 = D','같은 굵기 실 6 가닥을 정육각형 위치에 같은 길이로. 길이가 다르면 낙하산이 한쪽으로 기울어 <i>저항이 불규칙</i>해진다.'],
           ['스마트폰','240 fps 슬로모션','고정대에 세워 같은 위치에서 촬영. <i>프레임 수 ÷ 240</i> 이 시간(분해능 4 ms).'],
           ['눈금자 2 m','1 m 구간 표시','낙하 경로 옆에 세운 막대에 1 m 간격 표시. 영상에서 구간 시작 · 끝 프레임을 센다.'],
           ['분석(그래프)','log v – log D','엑셀 · 구글 시트로 두 열의 로그를 구하고 추세선 기울기를 읽는다. Tracker 프로그램으로 위치 – 시간도 가능.']],
    budget:[['비닐(쓰레기봉투 · 포장 비닐)','5 장','약 1천 원','분리수거 비닐'],['실(낚싯줄 · 면실)','1 롤','약 2천 원','털실'],['추 50 g (너트 · 와셔)','1 세트','약 3천 원','동전 · 모래주머니'],['고정대 · 삼각대','1','학교 비품','책 쌓기'],['줄자 · 막대자(2 m)','1','약 3천 원','학급 막대자']],
    steps:['지름 15 · 20 · 30 · 40 · 50 cm 원 5 개를 오려 줄 6 가닥 · 추 50 g 을 같은 방식으로 달아 낙하산 5 개를 만든다(길이 = 지름).',
           '높이 약 3 m(계단 난간 · 체육관 단상)에서 낙하산을 가볍게 접어 「같은 방식」으로 놓고, 아래 2 m 구간이 눈금자와 함께 찍히도록 스마트폰을 고정해 슬로모션으로 촬영한다.',
           '영상에서 <b>마지막 1 m</b> 구간(속도가 일정해진 곳)의 통과 프레임 수 $n$ 을 세어 $v=1\\ \\text{m}/(n/240)$. 지름마다 5 회 되풀이해 평균 ± 표준편차를 구한다.',
           'log D 대 log v 그래프를 그리고 추세선 기울기 p 와 R² 를 구한다. 이론 $v_t\\propto D^{-1}$ 과 비교한다.',
           '이론식 $v_t=\\sqrt{2mg/\\rho C_dA}$ 로 지름마다 Cd 를 계산해 모두 같은지(≈ 1.3 ~ 1.5) 확인한다(15번 탭).'],
    vars:['낙하산 지름 D (15 ~ 50 cm)','종단속도 $v_t$ (마지막 1 m 의 평균 속도)','추 질량 · 줄 길이 · 낙하 높이 · 비닐 재질 · 접는 방법'],
    predict:[['D = 15 → 50 cm (m = 50 g)','$v_t$ = '+fx(v[0])+' → '+fx(v[4])+' m/s (지름 3.3 배 ↔ 속도 약 ⅓ 배)','$v_t=\\sqrt{2mg/\\rho C_dA}$ 에 Cd = 1.5, ρ = 1.225 대입한 모형 값'],
             ['5 점 log–log 기울기 p','p ≈ '+fx(fit.p,2)+' (R² ≈ '+fx(fit.r2,3)+')','이론 −1 보다 완만 — 캔 몸통 항력이 작은 낙하산에서 더 큰 비율을 차지하기 때문'],
             ['마지막 1 m 통과 시간','D 15 cm : '+fx(1/v[0]*1000,0)+' ms → D 50 cm : '+fx(1/v[4]*1000,0)+' ms (프레임 '+fx(240/v[0],0)+' → '+fx(240/v[4],0)+' 장)','240 fps 면 한 프레임 4.2 ms — 작은 낙하산은 프레임 수가 적어 오차가 커진다'],
             ['질량 2 배 (100 g)','모든 $v_t$ 가 약 √2 = 1.41 배','$v_t\\propto\\sqrt m$ — 질량을 바꾸면 그래프가 위로 평행 이동(기울기는 그대로)']],
    data:{cols:['D (cm)','통과 프레임 수','통과 시간 (ms)','v = 1 m / Δt (m/s)','log D','log v'],
          rows:R01D.map(function(d,k){ var vv=v[k]; return [fx(d*100,0), fx(240/vv,0), fx(1000/vv,0), fx(vv,2), fx(Math.log10(d),3), fx(Math.log10(vv),3)]; })},
    analysis:'log–log 회귀로 기울기 p 와 표준오차를 구한다(5 점이면 ±0.05 안팎). p 가 −1 보다 완만하면 「캔 몸통 · 줄의 항력」을 더한 모형 $C_dA=C_{d0}A_0+C_dA_{\\text{낙하산}}$ 으로 다시 맞춰 본다. 각 지름의 v 는 5 회 평균 ± 표준편차를 오차 막대로 표시하고, 질량 다른 두 그룹(50 g · 100 g)을 같은 그래프에 그려 평행한 직선인지 본다.',
    special:['🎓 연구 설계',[['연구 질문','낙하산 지름 D 와 종단속도 v_t 의 거듭제곱 지수 p 는 −1 인가?'],['가설','p ≈ −0.9 ~ −1.0 (큰 낙하산일수록 −1 에 가깝다)'],['통계 설계','지름 5 수준 × 5 회 = 25 회 낙하, 로그 변환 후 최소제곱 회귀 + 잔차 확인'],['한계','낙하 높이가 낮아 종단속도에 완전히 못 이르는 작은 낙하산, 줄 · 천 변형, 공기 흐름']]],
    fails:[['낙하산이 접힌 채 떨어진다','접는 방법 · 놓는 방법을 통일(지름의 2 배 길이로 접어 위에서 가볍게 놓기). 줄을 정육각형 위치에 균등하게'],['속도가 아직 일정해지지 않았다','측정 구간을 마지막 1 m 로 한정하고 높이를 3 m 이상으로 · 추를 더 가볍게(30 g)'],['낙하산이 흔들리며 옆으로 흘러간다','에어컨 · 창문 바람을 끄고, 중심에 작은 구멍(약 10 %)을 뚫어 안정시킨다(→ R02)']],
    up:['<b>R02 연결</b> — 낙하산 모양 · 벤트 구멍에 따른 Cd 비교.','<b>종합1</b> — 질량을 바꿔 $v_t^2$ 대 $m/A$ 직선을 그린다(15번 탭, 선형 회귀).','<b>야외 확장</b> — 계단 홀 12 m 에서 실제 캔위성 모형(0.35 kg)을 떨어뜨려 2번 탭 모형과 비교.'],
    next:['[종합1] 낙하산으로 재는 항력계수',15],
    eval:[['정확성','지름 · 질량 · 높이를 정확히 재고 5 회 평균 ± 표준편차를 보고'],['그래프','log–log 직선 · 기울기 p ± 오차 · 오차 막대'],['해석','기울기가 −1 에서 벗어난 까닭(캔 · 줄 항력)을 식으로 설명'],['확장','Cd 를 구해 문헌값(반구형 약 1.3 ~ 1.5)과 비교']],
    tip:'낙하산 다섯 개를 한 줄로 세워 한꺼번에 놓아 「큰 것이 가장 늦게 도착」하는 장면을 영상으로 보여 준 뒤 그래프를 보여 주세요.' };
})();
SIMS.R01={ q:'낙하산 지름을 바꾸면 종단속도는 어떻게 바뀌고, log–log 그래프의 기울기는 −1 일까?',
  a:{nm:'낙하산 지름 D',min:10,max:60,step:1,val:30,unit:'cm',d:0}, b:{nm:'추 질량 m',min:20,max:300,step:5,val:50,unit:'g',d:0},
  cap1:'세 낙하산(지금 D · 15 cm · 낙하산 없음)을 6 m 높이에서 동시에 놓은 경주(×0.3 슬로모션). 작은 낙하산일수록 빨리 도착합니다.',
  cap2:'📊 log–log : 곡선 = 지금 질량의 모형, 점 = 측정(±3 % 잡음 5 점), 초록 = 측정의 회귀선, 점선 = 기울기 −1 기준.',
  note:'모형 : 캔(Cd 1.0, 지름 66 mm)과 반구형 낙하산(Cd 1.5)의 유효 면적, ρ = 1.225 kg/m³, 낙하산은 즉시 펼쳐짐, 종단속도 근처로 수렴한 뒤의 값. 점 5 개는 D = 15 · 20 · 30 · 40 · 50 cm.',
  anim:function(ctx,w,h,t,D,mg,S){ var m=mg/1000, Dm=D/100, gy=h-40, top=48, sc=(gy-top-60)/6, y0=gy-30-6*sc;
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    [[Dm,'지금 D = '+D+' cm',COL.amber],[0.15,'D = 15 cm',COL.blue],[0,'낙하산 없음',COL.dim]].forEach(function(L,i){
      var vt=r01v(L[0],m), dist=Math.min(6,fall1D(vt,t*0.3)), x=w*(0.2+0.3*i), y=y0+dist*sc;
      dropIcon(ctx,x,y,28,L[0]>0? 10+34*(L[0]/0.6):0,0);
      cvText(ctx,L[1],x,gy+14,L[2],'bold 11px system-ui,sans-serif','center');
      cvText(ctx,'v_t = '+vt.toFixed(1)+' m/s'+(dist>=6?' · 착지':''),x,top-6,COL.text,'11px system-ui,sans-serif','center'); });
    ctx.strokeStyle=COL.hint; ctx.setLineDash([3,4]); ctx.beginPath(); ctx.moveTo(14,y0+30); ctx.lineTo(w-14,y0+30); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'출발선(높이 6 m)',16,y0+22,COL.dim,'10px system-ui,sans-serif'); },
  graph:function(ctx,w,h,D,mg,S){ var m=mg/1000, c=S.cache;
    if(!c || c.mg!==mg || c.seed!==S.seed){ var r=rng32(S.seed*131+mg), pts=R01D.map(function(d){ return [d, nz(r,r01v(d,m),0.03)]; }); c={mg:mg,seed:S.seed,pts:pts,fit:llFit(pts)}; S.cache=c; }
    var vlo=r01v(0.6,0.02)*0.8, vhi=r01v(0.1,0.3)*1.2, P=makePlot(ctx,w,h,{xmin:Math.log10(0.1),xmax:Math.log10(0.6),ymin:vlo,ymax:vhi,ylog:true,xlabel:'낙하산 지름 D (cm, 로그)',ylabel:'종단속도 (m/s)',title:'log v – log D',left:56,xfmt:function(q){ return (Math.pow(10,q)*100).toFixed(0); }});
    var Lc=[], k; for(k=0;k<=40;k++){ var d=0.1*Math.pow(6,k/40); Lc.push([Math.log10(d), r01v(d,m)]); } plotLine(ctx,P,Lc,COL.blue,2);
    var v3=r01v(0.3,m); plotLine(ctx,P,[[Math.log10(0.1),v3*3],[Math.log10(0.6),v3*0.5]],COL.dim,1.3,[5,4]);
    plotLine(ctx,P,[[Math.log10(0.12),Math.pow(10,c.fit.c)*Math.pow(0.12,c.fit.p)],[Math.log10(0.55),Math.pow(10,c.fit.c)*Math.pow(0.55,c.fit.p)]],COL.ok,1.6);
    plotPoints(ctx,P,c.pts.map(function(q){ return [Math.log10(q[0]),q[1]]; }),COL.warm,4); plotPoints(ctx,P,[[Math.log10(D/100),r01v(D/100,m)]],COL.amber,6.5);
    legend(ctx,P.x1-150,P.y1+14,[['모형(지금 m)',COL.blue],['측정 5 점',COL.warm],['회귀선',COL.ok],['기울기 −1',COL.dim]]);
    ctx.fillStyle=COL.ok; ctx.font='11.5px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='bottom'; ctx.fillText('측정 기울기 p = '+c.fit.p.toFixed(2)+' (R² '+c.fit.r2.toFixed(3)+')',P.x0+8,P.y0-8); },
  kv:function(D,mg,S){ var m=mg/1000, v=r01v(D/100,m), v0=r01v(0,m), c=S.cache; return [['지금 종단속도 v_t',v.toFixed(2)+' m/s','a'],['낙하산 없을 때',v0.toFixed(1)+' m/s'],['감소 비율',(v0/v).toFixed(1)+' 배','g'],['측정 기울기 p',c? c.fit.p.toFixed(2):'—','v2'],['이론 기울기','−1.00']]; } };

/* ── R02 : 낙하산 모양 · 벤트 구멍 ─────────────────────────────────────── */
var R02S=[['반구형',1.4],['원형 평판',0.8],['사각 평판',1.0],['십자형',0.75]];
function r02Cd(shape, vent){ return R02S[shape-1][1]*(1-0.9*vent); }
function r02v(shape, vent){ return vTerm(0.05, CAN.CdCan*CAN.A + r02Cd(shape,vent)*Math.PI*0.3*0.3/4, SUBJ.rho0); }
function r02Sway(vent){ return Math.max(1.5, 22*(1-4.5*vent)); }
(function(){
  PROJ.R02={ id:'R02', t:'낙하산 모양과 벤트 구멍 — 항력계수 Cd 와 흔들림', icon:'🔻', type:'프로젝트 · R&E', lv:2, dur:'3주', cost:'약 2만 원',
    one:'같은 면적(지름 30 cm 원 기준)으로 반구형 · 원형 평판 · 사각 · 십자형 낙하산을 만들고, 가운데 구멍(벤트) 0 ~ 20 % 로 종단속도와 흔들림을 비교해 모양별 Cd 를 구한다.',
    q:'같은 면적에서 낙하산의 모양과 벤트(가운데 구멍) 비율은 종단속도와 흔들림에 어떤 영향을 줄까? 모양별 Cd 는 어떻게 다를까?',
    why:'낙하산은 「크기」만이 아니라 「모양」으로 성능이 갈립니다. 반구형은 느리게 내려오지만 흔들리고, 벤트를 뚫으면 조금 빨라지는 대신 안정되는 — 이런 <b>성능 사이의 맞바꿈(trade-off)</b>은 공학 설계의 핵심 개념입니다.',
    link:'교과서 힘과 운동(공기 저항) · 2번 탭 유효 면적 $C_dA$ · 15번 탭 [종합1] 에서 같은 방법으로 Cd 를 구한다.',
    fig:FIGS.R02.fig, tg:FIGS.R02.tg,
    cap:'같은 면적의 낙하산 네 모양(반구 + 벤트 · 원형 평판 · 사각 · 십자)에 같은 추를 매달아 떨어뜨리고, 종단속도와 흔들림(최대 기울기 각)을 비교해 오른쪽 같은 그래프를 만든다',
    parts:[['반구형 + 벤트','Cd 약 1.4','비닐을 반구 모양으로 접착(또는 종이컵 엎은 모양). 꼭대기에 지름 1 ~ 6 cm 구멍. <i>벤트 비율 = 구멍 면적 ÷ 전체 면적</i>.'],
           ['원형 평판','Cd 약 0.8','평평한 원형 비닐. 같은 면적이라도 공기가 옆으로 빠져 <i>Cd 가 작다</i>. 가장 흔한 간단 낙하산.'],
           ['사각 평판','Cd 약 1.0','한 변 26.6 cm 정사각(면적 0.0707 m²). 모서리가 접히는 현상 확인.'],
           ['십자형','Cd 약 0.75','십자 모양 한 장. 접기 쉽고 흔들림이 적다고 알려져 있다(실험으로 확인).'],
           ['흔들림 측정','기울기 각 ±°','영상에서 줄이 수직선과 이루는 각의 최댓값을 읽는다. 프레임마다 각을 재면 진동 주기도 나온다.'],
           ['종단속도 측정','마지막 1 m','R01 과 같은 방법. 모양별로 5 회씩 반복.']],
    budget:[['비닐 · 종이(같은 재질)','4 모양','약 2천 원','종이 접시'],['실 · 테이프 · 가위','1 세트','약 3천 원','학교 비품'],['추 50 g','1','약 3천 원','R01 과 같은 것'],['스마트폰 · 삼각대','1','보유','—'],['컴퍼스 · 자','1','학교 비품','—']],
    steps:['같은 면적(0.0707 m²)이 되도록 네 모양을 만들고 줄 6 가닥(십자는 4 가닥)을 같은 길이로 단다. 반구형은 벤트 0 · 5 · 10 · 20 % 4 개를 만든다.',
           '모양마다 같은 방법으로 3 m 높이에서 5 회 떨어뜨려 마지막 1 m 의 속도를 잰다(R01 과 같은 방법).',
           '영상에서 줄이 수직선과 이루는 <b>최대 기울기 각</b>을 읽어 흔들림 진폭으로 기록한다.',
           '종단속도로 $C_dA=2mg/(\\rho v_t^2)$ 를 계산해 모양별 Cd 를 구한다.',
           '벤트 비율에 대한 종단속도 · 흔들림 그래프를 그려 「안정 대 속도」 맞바꿈을 설명한다.'],
    vars:['낙하산 모양(4 종) · 벤트 비율(0 ~ 20 %)','종단속도 · 최대 기울기 각','면적 · 질량 · 줄 길이 · 높이 · 재질'],
    predict:[['반구형 벤트 0 % → 20 %','$v_t$ '+fx(r02v(1,0))+' → '+fx(r02v(1,0.2))+' m/s','벤트 구멍만큼 유효 면적이 줄어 속도가 조금 빨라진다(Cd 1.40 → '+fx(r02Cd(1,0.2),2)+')'],
             ['모양별 Cd 순서 (벤트 0)','반구형 '+fx(R02S[0][1],2)+' > 사각 '+fx(R02S[2][1],2)+' > 원형 평판 '+fx(R02S[1][1],2)+' ≈ 십자 '+fx(R02S[3][1],2),'문헌 · 설계 가이드의 대략 값(±20 %). 실험으로 확인하는 것이 이 프로젝트의 목표'],
             ['흔들림(경향)','벤트 0 % 약 '+fx(r02Sway(0),0)+'° → 벤트 15 % 약 '+fx(r02Sway(0.15),0)+'°','벤트가 클수록 흔들림이 줄어드는 경향(교육용 어림, 실험으로 확인)'],
             ['낙하 속도 차이 크기','모양에 따라 최대 약 '+fx((r02v(2,0)/r02v(1,0)-1)*100,0)+' % 차이(원형 평판 대 반구형)','같은 면적이라도 모양이 다르면 속도가 이만큼 달라질 수 있다']],
    data:{cols:['모양','벤트 %','v_t (m/s)','C_dA (m²)','Cd(모양)','최대 기울기 (°)'],
          rows:[[R02S[0][0],'0',fx(r02v(1,0),2),fx(0.05*2*SUBJ.g/(SUBJ.rho0*r02v(1,0)*r02v(1,0)),3),fx(R02S[0][1],2),fx(r02Sway(0),0)],
                [R02S[0][0],'10',fx(r02v(1,0.1),2),fx(0.05*2*SUBJ.g/(SUBJ.rho0*r02v(1,0.1)*r02v(1,0.1)),3),fx(r02Cd(1,0.1),2),fx(r02Sway(0.1),0)],
                [R02S[1][0],'0',fx(r02v(2,0),2),fx(0.05*2*SUBJ.g/(SUBJ.rho0*r02v(2,0)*r02v(2,0)),3),fx(R02S[1][1],2),'—'],
                [R02S[3][0],'0',fx(r02v(4,0),2),fx(0.05*2*SUBJ.g/(SUBJ.rho0*r02v(4,0)*r02v(4,0)),3),fx(R02S[3][1],2),'—']]},
    analysis:'모양마다 $C_dA=2mg/(\\rho v_t^2)$ 로 유효 면적을 구하고 캔 몸통 항력(0.0034 m²)을 빼 낙하산의 Cd 를 얻는다. 벤트 비율 $f_v$ 에 대해 $C_d(f_v)$ 가 $C_d(0)(1-k f_v)$ 꼴이면 k 를 구한다(모형 k = 0.9). 흔들림은 최대 기울기 각의 5 회 평균 ± 표준편차로 표시한다.',
    special:['🎓 연구 설계',[['연구 질문','모양과 벤트 비율은 종단속도 · 흔들림을 어떻게 바꾸는가?'],['가설','벤트가 클수록 종단속도는 조금 증가하고 흔들림은 감소한다.'],['통계 설계','4 모양 × 벤트 4 수준 × 5 회, 이원 비교 · 오차 막대'],['한계','천의 주름 · 접힘 · 줄 길이 · 방 안 공기 흐름이 모양 효과와 섞일 수 있다']]],
    fails:[['흔들림 각이 영상에서 읽기 어렵다','배경에 수직선을 그어 두고 줄에 색 테이프를 붙인다. 120 fps 이상으로 촬영'],['모양마다 면적이 조금씩 다르다','스텐실로 같은 면적(0.0707 m²)에 맞춰 자르고, 면적을 사진으로 확인'],['벤트 구멍이 찢어진다','구멍 가장자리를 테이프로 보강']],
    up:['<b>모양 확장</b> — 파라포일(사각 날개) 모양은 R09 로 이어진다.','<b>벤트 최적화</b> — 벤트 비율을 1 % 단위로 바꿔 「가장 안정하면서 가장 느린」 지점을 찾는다.','<b>발명 03 연결</b> — 벤트를 서보로 열고 닫아 속도를 조절하는 가변 낙하산.'],
    next:['발명 · 가변 벤트 낙하산 (I03)',12],
    eval:[['정확성','면적을 같게 하고 각 모양을 5 회 이상 측정'],['비교','Cd · 흔들림을 표와 그래프로 같은 눈금에서 비교'],['해석','안정과 속도의 맞바꿈을 유효 면적 식으로 설명'],['보고','불확실성(각 읽기 ±2°)을 함께 제시']],
    tip:'네 낙하산을 연달아 떨어뜨려 흔들림을 비교하는 영상을 한 화면에 나란히(분할 화면) 보여 주세요.' };
})();
SIMS.R02={ q:'벤트(구멍) 비율과 모양을 바꾸면 종단속도와 흔들림은 어떻게 달라질까?',
  a:{nm:'벤트 구멍 비율',min:0,max:20,step:1,val:8,unit:'%',d:0}, b:{nm:'낙하산 모양',min:1,max:4,step:1,val:1,fmt:pick(['반구형','원형 평판','사각 평판','십자형'])},
  cap1:'낙하산이 흔들리며 내려옵니다(흔들림은 교육용 어림). 오른쪽 줄무늬가 위로 흐르는 속도 = 종단속도의 크기.',
  cap2:'📊 벤트 비율에 대한 종단속도 — 네 모양(곡선) 중 지금 선택(굵게) · 점 = 지금 값. 벤트가 커지면 v_t 는 조금 증가.',
  note:'모형 : 같은 면적(지름 30 cm 원 기준) · 질량 50 g · Cd(모양) × (1 − 0.9·벤트 비율). 흔들림 진폭 = 22°(1 − 4.5·벤트) 는 「벤트가 흔들림을 줄인다」는 경향을 보이기 위한 교육용 어림이며, 실제 값은 실험으로 확인해야 합니다.',
  anim:function(ctx,w,h,t,vent,shape,S){ var f=vent/100, amp=r02Sway(f)*Math.PI/180, ang=amp*Math.sin(6.28*t/1.2), v=r02v(shape,f);
    skyBg(ctx,w,h); var cx=w*0.42, cy=h*0.5;
    ctx.save(); ctx.translate(cx,cy-60); ctx.rotate(ang);
    var r=62, cdraw=function(){};
    ctx.fillStyle='rgba(251,113,133,.45)'; ctx.strokeStyle=COL.grav; ctx.lineWidth=2;
    if(shape===1){ ctx.beginPath(); ctx.ellipse(0,0,r,r*0.75,0,Math.PI,0); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else if(shape===2){ ctx.beginPath(); ctx.ellipse(0,0,r,r*0.17,0,0,6.2832); ctx.fill(); ctx.stroke(); }
    else if(shape===3){ ctx.beginPath(); ctx.moveTo(-r,-6); ctx.lineTo(r,-6); ctx.lineTo(r*0.85,10); ctx.lineTo(-r*0.85,10); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-r,-9); ctx.lineTo(-r*0.3,-9); ctx.lineTo(-r*0.3,-r*0.7); ctx.lineTo(r*0.3,-r*0.7); ctx.lineTo(r*0.3,-9); ctx.lineTo(r,-9); ctx.lineTo(r,9); ctx.lineTo(r*0.3,9); ctx.lineTo(r*0.3,r*0.3); ctx.lineTo(-r*0.3,r*0.3); ctx.lineTo(-r*0.3,9); ctx.lineTo(-r,9); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    if(f>0 && shape===1){ cvCirc(ctx,0,-r*0.72,3+f*50,COL.cvbg,COL.grav,1.4); }
    ctx.strokeStyle=COL.dim; ctx.lineWidth=1; [-0.9,-0.4,0.4,0.9].forEach(function(k){ ctx.beginPath(); ctx.moveTo(k*r,0); ctx.lineTo(0,96); ctx.stroke(); }); drawCan(ctx,-9,96,34); ctx.restore();
    var sp=((t*v*14)%40); ctx.strokeStyle=COL.hint; ctx.lineWidth=1.4; for(var i=-1;i<9;i++){ var yy=i*40+sp; ctx.beginPath(); ctx.moveTo(w-34,yy); ctx.lineTo(w-20,yy); ctx.stroke(); }
    cvText(ctx,R02S[shape-1][0]+' · 벤트 '+vent+' % · Cd '+r02Cd(shape,f).toFixed(2)+' · v_t = '+v.toFixed(2)+' m/s',12,16,COL.text,'bold 12px system-ui,sans-serif');
    cvText(ctx,'흔들림 최대 약 '+(amp*180/Math.PI).toFixed(0)+'° (경향 · 어림)',12,34,COL.tick,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,vent,shape,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:20,ymin:2.4,ymax:4.4,xlabel:'벤트 비율 (%)',ylabel:'종단속도 v_t (m/s)',title:'벤트에 따른 종단속도 (모양별)',left:54,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(1); }}), cols=[COL.grav,COL.blue,COL.ok,COL.iner];
    R02S.forEach(function(sh,k){ var L=[],q; for(q=0;q<=20;q++) L.push([q, r02v(k+1,q/100)]); plotLine(ctx,P,L,cols[k],(k+1===shape)?3:1.4,(k+1===shape)?null:[4,3]); });
    plotPoints(ctx,P,[[vent,r02v(shape,vent/100)]],COL.amber,6.5); legend(ctx,P.x1-118,P.y1+14,R02S.map(function(sh,k){ return [sh[0],cols[k]]; })); },
  kv:function(vent,shape,S){ var f=vent/100; return [['모양별 Cd',r02Cd(shape,f).toFixed(2),'a'],['종단속도 v_t',r02v(shape,f).toFixed(2)+' m/s'],['벤트 없을 때 v_t',r02v(shape,0).toFixed(2)+' m/s','g'],['벤트 효과',((r02v(shape,f)/r02v(shape,0)-1)*100).toFixed(1)+' %','v2'],['흔들림(어림)',r02Sway(f).toFixed(0)+'°','r']]; } };

/* ── R03 : 스마트폰 기압계로 재는 층별 높이 ───────────────────────────────── */
function r03P(h){ return ISA.P(h)/100; }         // hPa
(function(){
  var r=rng32(3), hs=[0,3,6,9,12,15], sig=0.05/Math.sqrt(30), pts=hs.map(function(h){ return [h, (r03P(h)+sig*gaussR(r))*100]; }), f=ols(pts,false);
  PROJ.R03={ id:'R03', t:'스마트폰 기압계로 재는 건물 높이 — 1 m 에 몇 Pa?', icon:'📱', type:'프로젝트 · R&E 입문', lv:1, dur:'2주', cost:'0 ~ 1만 원',
    one:'스마트폰 기압 앱으로 건물 층마다 기압을 재어 기압 – 높이 직선의 기울기(약 −12 Pa/m = −ρg)를 구하고, 기압만으로 층 높이를 계산한다.',
    q:'건물 층별 기압 변화의 기울기는 이론값 $-\\rho g\\approx-12$ Pa/m 와 얼마나 가까울까? 스마트폰 기압만으로 층 높이(약 3 m)를 구할 수 있을까?',
    why:'「기압으로 높이를 안다」는 이야기가 책 속 이야기가 아니라 <b>내 폰으로 계단 위에서 직접</b> 확인된다는 것이 놀라움입니다. 센서 잡음을 평균으로 줄이는 방법도 함께 배웁니다.',
    link:'교과서 기체의 압력 · 대기압 · 3번 탭 기압 고도계 · 16번 탭 [종합2](스케일 높이)로 이어집니다.',
    fig:FIGS.R03.fig, tg:FIGS.R03.tg,
    cap:'4 층 건물의 층마다 스마트폰을 놓고 같은 시간(30 초) 기압을 기록한다. 층(높이)이 올라갈수록 기압이 줄어드는 직선의 기울기가 이 실험의 결과(오른쪽 그래프)',
    parts:[['스마트폰 기압 앱','Phyphox 등','센서 값을 1 Hz 이상으로 기록하는 앱. <i>기압(hPa) 열</i>을 CSV 로 내보낼 수 있으면 좋다.'],
           ['기록 위치','층 복도 · 같은 높이','손으로 들지 말고 <i>같은 높이(바닥에서 1 m)</i>의 책상 · 난간 위에. 바람이 센 창가는 피한다.'],
           ['높이 측정','줄자 · 레이저 거리계','층 높이를 계단 수 × 단 높이(약 17 cm)로 어림하거나 줄자로 잰다. <i>정확한 h</i> 가 기울기 정확도를 정한다.'],
           ['평균 기압','30 초 평균','센서 잡음은 약 0.02 ~ 0.05 hPa. 30 개를 평균하면 잡음이 약 1/5 로 줄어든다($\\sigma/\\sqrt N$).'],
           ['기울기 분석','ΔP/Δh (Pa/m)','h 대 P 산점도에 직선 추세선. 이론 $-\\rho g$ ≈ −12.0 Pa/m.'],
           ['날씨 기록','기준 기압 P₀','측정 중 날씨 변화로 기압이 같이 변하지 않았는지 <i>맨 처음 층을 마지막에 다시 재서</i> 확인.']],
    budget:[['스마트폰(기압 센서 내장)','1','보유','일부 보급형은 센서 없음 — 확인'],['줄자 · 레이저 거리계','1','약 5천 원 ~ 2만 원','학교 비품'],['삼각대 · 책상','1','—','—'],['엑셀 · 구글 시트','—','무료','—']],
    steps:['앱을 켜고 센서가 있는지(기압 값이 나오는지) 확인한 뒤 1 층 바닥 높이에서 30 초 기록해 평균 기압 $P_0$ 를 구한다.',
           '2 · 3 · 4 층 … 위로 올라가며 같은 높이(바닥에서 1 m)에서 같은 방법으로 30 초씩 기록한다.',
           '층 높이를 줄자(또는 계단 수)로 재어 각 층의 높이 $h$ 를 정리한다.',
           '$h$ 대 $P$ 그래프에 직선을 맞춰 기울기를 구하고 이론 −12 Pa/m 와 비교한다.',
           '반대로 기울기를 이용해 한 층의 높이를 계산해 보고, 줄자 측정값과 비교한다.'],
    vars:['높이 h (층 수 × 약 3 m)','기압 P (30 초 평균)','센서 · 장소 높이 · 기록 시간 · 날씨 · 앱 설정'],
    predict:[['6 개 층 (h = 0 ~ 15 m, 3 m 간격)','기울기 ≈ '+fx(f.a,1)+' Pa/m (참값 −12.0 Pa/m)','잡음 σ = 0.05 hPa, 30 개 평균 → 각 점의 오차 약 0.9 Pa'],
             ['한 층(3 m)의 기압 변화','약 −'+fx(Math.abs(3*f.a)/100,2)+' hPa (이론 −0.36 hPa)','센서 분해능 0.01 hPa 면 층마다 36 칸 변화 — 충분히 읽힌다'],
             ['4 층 건물(h = 9 m) 전체','약 −1.1 hPa','$12\\ \\text{Pa/m}\\times9\\ \\text{m}=108$ Pa'],
             ['잡음 σ 0.2 hPa 인 값싼 센서','기울기 오차 약 ±'+fx(0.2/Math.sqrt(30)*100/Math.sqrt(157.5),2)+' Pa/m','평균 횟수 N 을 늘리거나 층 수를 늘리면 줄어든다(오차 ∝ 1/√N)']],
    data:{cols:['층','높이 h (m)','평균 기압 (hPa)','P − P₀ (Pa)','이론 −12h (Pa)'],
          rows:hs.map(function(h,k){ return [(k+1)+'층', fx(h,0), fx(pts[k][1]/100,3), fx(pts[k][1]-pts[0][1],0), fx(-12*h,0)]; })},
    analysis:'h 대 P 의 최소제곱 직선 기울기와 표준오차를 구한다($\\sigma_a\\approx\\sigma_P/\\sqrt{\\sum(h-\\bar h)^2}$). 기울기에서 $\\rho=|a|/g$ 로 공기 밀도를 구해 1.2 kg/m³ 와 비교할 수 있다. 맨 처음 층 재측정과의 차이를 「날씨에 의한 변화」로 보고 보정한다.',
    special:['🎓 연구 설계',[['연구 질문','스마트폰 기압 센서로 1 m 당 기압 변화(−ρg)를 몇 % 정확도로 잴 수 있는가?'],['가설','기울기는 −12 ± 1 Pa/m 이며 잡음은 평균으로 줄어든다.'],['통계 설계','6 개 층 × 30 초(30 샘플) 평균 → 직선 회귀. 날씨 보정용 처음 층 재측정'],['한계','센서 절대 정확도 ±1 hPa, 온도 변화 · 에어컨 · 계단의 바람']]],
    fails:[['값이 계속 흔들린다 · 점프한다','앱의 평균 기능 사용, 문을 닫아 바람 막기, 폰을 같은 방향 · 같은 높이에 고정'],['층마다 기울기가 다르다','엘리베이터 · 환기구에서 기압이 순간 변한다 — 계단실에서 측정, 맨 처음 층 재측정으로 보정'],['기압 센서가 없는 폰','다른 폰 · 학교 아두이노 BMP280 센서를 사용']],
    up:['<b>종합2 연결</b> — 높이를 높여(1 ~ 3 km) 기압을 로그 그래프로 그려 스케일 높이 H 를 구한다(16번 탭).','<b>기준 기압 P₀</b> — 같은 층을 하루 동안 여러 번 재어 날씨에 따른 변화를 기록.','<b>드론 · 풍선</b> — 폰을 매달아 100 m 까지 올려 보기(비행 허가 · 안전 확인 필수).'],
    next:['[종합2] 기압으로 재는 고도 — 스케일 높이',16],
    eval:[['정확성','기울기의 이론 대비 오차 % 와 불확도 제시'],['잡음 처리','평균 개수에 따른 오차 감소를 그래프로 확인'],['해석','층 높이를 기압만으로 계산해 줄자 값과 비교'],['안전','계단 · 난간에서 낙하 · 방해 없이 진행']],
    tip:'1 층과 5 층의 폰 화면(기압 값)을 나란히 찍어 보여 주고 「1.8 hPa 차이」를 직접 보게 하세요.' };
})();
SIMS.R03={ q:'층 수와 센서 잡음을 바꾸면 기압 – 높이 기울기를 얼마나 정확히 잴 수 있을까?',
  a:{nm:'건물 높이(최대 h)',min:6,max:60,step:3,val:15,unit:'m',d:0}, b:{nm:'센서 잡음 σ (1 샘플)',min:0.01,max:0.30,step:0.01,val:0.05,unit:'hPa',d:2},
  cap1:'스마트폰이 층을 올라가며(층당 3 m) 기압을 기록합니다. 숫자는 30 개 평균(잡음 포함).',
  cap2:'📊 기압 – 높이 : 점 = 층별 평균, 초록 = 최소제곱 직선, 노랑 = 이론 −12.0 Pa/m. 기울기의 정확도가 층 수 · 잡음에 따라 달라집니다.',
  note:'모형 : 표준대기 P(h), 층 높이 3 m, 각 층 30 샘플 평균(잡음 σ/√30). 시작 층은 바닥(h = 0). 기울기 단위는 Pa/m.',
  data:function(hmax,sig,S){ var r=rng32(S.seed*977+Math.round(hmax)*13+Math.round(sig*1000)), pts=[], k, n=Math.round(hmax/3), s=sig/Math.sqrt(30); for(k=0;k<=n;k++){ var hh=3*k; pts.push([hh,(r03P(hh)+s*gaussR(r))*100]); } return {pts:pts,fit:ols(pts,false)}; },
  anim:function(ctx,w,h,t,hmax,sig,S){ var d=this.data(hmax,sig,S), n=d.pts.length, gy=h-30, top=36, bx=w*0.12, bw=w*0.3, sc=(gy-top)/hmax, k=Math.min(n-1,Math.floor(t/10*n)), cur=d.pts[k];
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy); ctx.fillStyle=COL.cvbg; ctx.globalAlpha=0.55; ctx.fillRect(bx,gy-hmax*sc,bw,hmax*sc); ctx.globalAlpha=1; ctx.strokeStyle=COL.dev; ctx.lineWidth=1.4; ctx.strokeRect(bx,gy-hmax*sc,bw,hmax*sc);
    var q; for(q=0;q<n;q++){ var yy=gy-d.pts[q][0]*sc; ctx.strokeStyle=q<=k?COL.ok:COL.gridln; ctx.beginPath(); ctx.moveTo(bx,yy); ctx.lineTo(bx+bw,yy); ctx.stroke(); if(q<n && (n<=12||q%2===0)){ ctx.fillStyle=COL.tick; ctx.font='10px system-ui,sans-serif'; ctx.textAlign='right'; ctx.textBaseline='bottom'; ctx.fillText((q+1)+'층',bx-4,yy+1); } }
    var py=gy-cur[0]*sc; ctx.fillStyle=COL.metal; ctx.strokeStyle=COL.dev; ctx.fillRect(bx+bw/2-8,py-26,16,26); ctx.strokeRect(bx+bw/2-8,py-26,16,26); cvCirc(ctx,bx+bw/2,py-20,2.2,COL.ok);
    var tx=w*0.55; cvText(ctx,(Math.round(cur[0]/3)+1)+'층 · h = '+cur[0]+' m',tx,gy*0.30,COL.text,'bold 14px system-ui,sans-serif'); cvText(ctx,'평균 기압',tx,gy*0.30+24,COL.tick,'11px system-ui,sans-serif'); cvText(ctx,(cur[1]/100).toFixed(3)+' hPa',tx,gy*0.30+50,COL.amber,'bold 20px system-ui,sans-serif');
    cvText(ctx,'1 층 대비 '+((cur[1]-d.pts[0][1])).toFixed(0)+' Pa (이론 '+(-12*cur[0]).toFixed(0)+' Pa)',tx,gy*0.30+78,COL.ok,'12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,hmax,sig,S){ var d=this.data(hmax,sig,S), P0=d.pts[0][1], P=makePlot(ctx,w,h,{xmin:0,xmax:hmax,ymin:-12.6*hmax*1.12,ymax:12.6*hmax*0.12+40,xlabel:'높이 h (m)',ylabel:'P − P₀ (Pa)',title:'층별 기압 변화',left:58,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }});
    plotLine(ctx,P,[[0,0],[hmax,-12.0*hmax]],COL.amber,1.6,[6,4]); plotLine(ctx,P,[[0,d.fit.b-P0],[hmax,d.fit.a*hmax+d.fit.b-P0]],COL.ok,2); plotPoints(ctx,P,d.pts.map(function(q){ return [q[0],q[1]-P0]; }),COL.blue,3.8);
    legend(ctx,P.x1-132,P.y1+14,[['측정(30 개 평균)',COL.blue],['회귀 직선',COL.ok],['이론 −12 Pa/m',COL.amber]]); },
  kv:function(hmax,sig,S){ var d=this.data(hmax,sig,S), a=d.fit.a, err=(a/-12.0-1)*100; return [['측정 기울기',a.toFixed(2)+' Pa/m','a'],['이론 기울기','−12.0 Pa/m'],['오차',(err>=0?'+':'')+err.toFixed(1)+' %','g'],['층당(3 m) 기압 차',(a*3/100).toFixed(2)+' hPa','v2'],['측정한 층 수',d.pts.length+' 개']]; } };

/* ── R04 : 방출 고도와 바람 — 이동 거리 ─────────────────────────────────── */
function r04(h0,w){ return descend({h0:h0,m:SUBJ.canM,D:0.4,wind:w}); }
(function(){
  var d1=r04(300,3), d2=r04(300,6), d3=r04(500,3);
  PROJ.R04={ id:'R04', t:'방출 고도와 바람 — 캔위성은 얼마나 떠내려갈까?', icon:'🌬', type:'프로젝트 · R&E', lv:2, dur:'3주', cost:'약 3만 원',
    one:'바람 속에서 낙하산 캔위성(또는 모형)을 놓아 착지점을 GPS 로 기록하고, 이동 거리가 풍속 × 낙하 시간 $\\Delta x\\approx w\\,h_0/v_t$ 인지 확인한다.',
    q:'방출 고도 $h_0$ 와 풍속 w 를 바꿀 때 착지점이 목표에서 벗어나는 거리 $\\Delta x$ 는 $w\\,h_0/v_t$ 와 얼마나 일치할까?',
    why:'「바람이 불면 떠내려간다」를 <b>숫자 예측</b>으로 바꿉니다. 이 예측이 맞아야 4번 탭의 유도 · 방출 위치 선정이 의미 있는 설계가 됩니다. 풍속계와 GPS 만 있으면 야외에서 바로 해 볼 수 있습니다.',
    link:'교과서 힘과 운동(상대 속도 · 등속 운동) · 1 · 4번 탭 · 17번 탭 [종합3](복귀 정밀도)로 이어집니다.',
    fig:FIGS.R04.fig, tg:FIGS.R04.tg,
    cap:'풍선(또는 드론)에서 높이 $h_0$ 로 방출한 캔위성이 낙하산으로 내려오는 동안 바람 w 에 밀려 목표(바로 아래)에서 $\\Delta x$ 만큼 벗어나 착지한다. 오른쪽 그래프가 $\\Delta x$ – $h_0$',
    parts:[['풍선 · 드론','방출 고도 h₀','헬륨 풍선(C10) 또는 드론으로 일정 높이까지 올려 방출. <i>비행 규정 · 안전 확인 필수</i>.'],
           ['낙하산 캔위성','D 40 cm · 0.35 kg','종단속도 약 5 m/s (R01 · 2번 탭). 매번 <i>같은 낙하산</i>을 써야 낙하 시간이 같다.'],
           ['GPS 기록기','위치 · 시각','방출 전 목표(바로 아래)와 착지 후 위치를 GPS 로 기록. 스마트폰 GPS(오차 3 ~ 5 m)로도 가능.'],
           ['풍속계','손풍속계 · 앱','방출 직전 · 도중 풍속과 풍향. 높이마다 바람이 다르므로 <i>여러 높이</i> 기록하면 더 좋다.'],
           ['이동 거리 계산','Δx = w·T','$T=h_0/v_t$ (낙하 시간). 측정 Δx 를 예측과 같은 그래프에 그린다.'],
           ['반복 측정','같은 조건 3 회','바람은 계속 변한다. 같은 날 연달아 3 회 · 평균 ± 표준편차로 비교.']],
    budget:[['손풍속계','1','약 1.5만 원','풍속 앱(정확도 낮음)'],['스마트폰 GPS 앱','1','무료','—'],['낙하산 캔위성 모형','1','약 1만 원','R01 의 낙하산'],['풍선 · 헬륨 (또는 드론 대여)','1','약 1만 원','학교 드론'],['줄자 · 말뚝','1 세트','약 3천 원','—']],
    steps:['넓은 야외(사람 · 차량이 없는 곳)에서 목표 지점에 말뚝을 박고 GPS 좌표를 기록한다.','풍속 · 풍향을 재고(방출 직전), 높이 $h_0$ = 50 · 100 · 200 m 에서 캔위성을 방출한다(드론 · 풍선).','착지점의 GPS 좌표를 기록해 목표에서의 이동 거리 $\\Delta x$ 를 계산한다.','$T=h_0/v_t$ 와 평균 풍속으로 예측 $\\Delta x_{\\text{예측}}=wT$ 를 계산해 표에 비교한다.','측정 – 예측 그래프를 그리고 차이(높이별 바람 차이 · 낙하산 개방 시간)를 설명한다.'],
    vars:['방출 고도 $h_0$ · 풍속 w','착지 이동 거리 Δx','낙하산 · 질량 · 방출 위치 · 풍향(같은 날 같은 방향)'],
    predict:[['h₀ 300 m · 바람 3 m/s','낙하 '+fx(d1.T,0)+' s · Δx ≈ '+fx(d1.dx,0)+' m','Δx ≈ wT = 3 × '+fx(d1.T,0)+' s'],
             ['h₀ 300 m · 바람 6 m/s','Δx ≈ '+fx(d2.dx,0)+' m (풍속 2 배 → 2 배)','Δx ∝ w'],
             ['h₀ 500 m · 바람 3 m/s','낙하 '+fx(d3.T,0)+' s · Δx ≈ '+fx(d3.dx,0)+' m (고도 ↑ → 낙하 시간 ↑)','Δx ∝ h₀ (대기 밀도 변화로 약간 더 큼)'],
             ['바람 방향 · 착지','캔위성은 바람 방향(풍하) 쪽으로 이동','방향 반대로 가는 일은 없다 — 방출 위치는 풍상으로 잡는다']],
    data:{cols:['h₀ (m)','풍속 w (m/s)','낙하 시간 T (s)','예측 Δx (m)','측정 Δx (m)','차이 (%)'],
          rows:[[100,3,r04(100,3).T,r04(100,3).dx],[200,3,r04(200,3).T,r04(200,3).dx],[300,3,r04(300,3).T,r04(300,3).dx],[300,6,r04(300,6).T,r04(300,6).dx],[500,3,r04(500,3).T,r04(500,3).dx]].map(function(q,i){ var meas=q[3]*[1.06,0.95,1.04,0.93,1.08][i]; return [q[0],q[1],fx(q[2],0),fx(q[3],0),fx(meas,0),fx((meas/q[3]-1)*100,0)]; })},
    analysis:'측정 Δx 대 예측 $wT$ 산점도에 y = x 선을 겹쳐 그리고 기울기 · R² 를 본다. 차이는 (i) 높이에 따른 풍속 변화, (ii) 낙하산이 펼쳐지는 동안의 이동, (iii) 풍속 측정 오차(±0.5 m/s)로 설명한다. 풍속 오차 ±0.5 m/s 는 Δx 에 약 ±' + fx(0.5*d1.T,0) + ' m 의 불확도로 전파된다.',
    special:['🎓 연구 설계',[['연구 질문','캔위성의 착지 이동 거리는 풍속 × 낙하 시간으로 예측되는가?'],['가설','Δx ≈ wT (오차 10 % 이내)'],['통계 설계','3 고도 × 3 풍속대 × 3 회, 예측 대 측정 회귀'],['한계','높이별 풍속 차이 · 돌풍 · GPS 오차 3 ~ 5 m · 비행 허가']]],
    fails:[['바람이 계속 바뀌어 예측이 안 맞는다','방출 전후 풍속을 평균하고 같은 시간대에 연달아 반복'],['착지점 GPS 오차가 크다','착지점에 표시(막대)를 세우고 줄자로 목표와의 거리 직접 측정'],['낙하산이 안 펴진다','접는 방법 통일, 예비 낙하산 준비, 낮은 높이부터']],
    up:['<b>4번 탭 연결</b> — 측정한 풍속 · 낙하 시간으로 「바람 위쪽 방출 위치 X₀ = wT」를 계산해 실제로 시험.','<b>발명 07</b> — 풍속 프로파일을 입력해 착지점을 예측하는 앱.','<b>종합3</b> — 반복 측정의 분포(복귀 오차)를 17번 탭 방법으로 분석.'],
    next:['원리③ 위치와 유도',4],
    eval:[['정확성','풍속 · 낙하 시간 · 이동 거리를 정확히 측정, 불확도 전파'],['안전','방출 장소 · 허가 · 사람과 거리 확보'],['예측','예측선과 측정 점을 한 그래프로 비교'],['해석','차이의 원인(높이별 바람 등)을 근거와 함께 설명']],
    tip:'착지 직후 목표와 착지점 사이를 줄자로 잡은 사진 한 장이 가장 설득력 있는 결과 화면입니다.' };
})();
SIMS.R04={ q:'방출 고도와 풍속을 바꾸면 착지 이동 거리는 어떻게 될까? 측정값은 wT 예측과 얼마나 일치할까?',
  a:{nm:'방출 고도 h₀',min:50,max:500,step:10,val:300,unit:'m',d:0}, b:{nm:'풍속 w',min:0,max:10,step:0.5,val:3,unit:'m/s',d:1},
  cap1:'옆에서 본 낙하 경로(바람 → 오른쪽). 빨간 X = 목표(방출 지점 바로 아래), 초록 = 착륙점.',
  cap2:'📊 이동 거리 – 방출 고도 : 곡선 = 모형(풍속별), 점 = 측정 예시(±8 %), 굵은 노랑 = 지금 풍속.',
  note:'모형 : descend() — 캔 + 지름 40 cm 반구형 낙하산(Cd 1.5), 표준대기 밀도, 바람은 높이와 무관한 일정한 값, 방출 순간 수평 속도 = 바람. Δx ≈ w·T 를 확인하는 이상화된 상황입니다.',
  anim:function(ctx,w,h,t,h0,ww,S){ var D=r04(h0,ww), gy=h-36, top=50, sx=(w-80)/Math.max(300,D.dx*1.1), sy=(gy-top)/h0, sc=Math.min(sx,sy*1.0), tt=Math.min(t*D.T/9,D.T-0.02), c=descAt(D,tt), x0=40;
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    var pts=[], i, st=Math.max(1,Math.floor(c.i/200)); for(i=0;i<=c.i;i+=st) pts.push([x0+D.x[i]*sc, gy-D.h[i]*(gy-top)/h0]); cvLine(ctx,pts,COL.blue,2,[4,3]);
    cvLine(ctx,[[x0-8,gy-6],[x0+8,gy+6]],COL.grav,2.4); cvLine(ctx,[[x0-8,gy+6],[x0+8,gy-6]],COL.grav,2.4);
    var px=x0+c.x*sc, py=gy-c.h*(gy-top)/h0; dropIcon(ctx,px,py-26,22,12,0);
    if(tt>=D.T-0.05){ cvCirc(ctx,x0+D.dx*sc,gy,4,COL.ok); cvText(ctx,'Δx = '+D.dx.toFixed(0)+' m',x0+D.dx*sc,gy+14,COL.ok,'bold 11px system-ui,sans-serif','center'); }
    if(ww>0){ for(i=0;i<3;i++) arrow2(ctx,w-130,top+10+i*18,w-130+16+ww*5,top+10+i*18,'rgba(253,224,71,.6)',1.8); cvText(ctx,'바람 '+ww.toFixed(1)+' m/s',w-130,top-6,COL.light,'11px system-ui,sans-serif'); }
    cvText(ctx,'t = '+(t*D.T/9>D.T?D.T:t*D.T/9).toFixed(0)+' s (시간 압축) · 낙하 시간 T = '+D.T.toFixed(0)+' s',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,h0,ww,S){ var xm=500, P=makePlot(ctx,w,h,{xmin:50,xmax:xm,ymin:0,ymax:Math.max(800,Math.ceil(r04(500,10).dx/100)*100*0.82),xlabel:'방출 고도 h₀ (m)',ylabel:'이동 거리 Δx (m)',title:'착지 이동 거리 – 방출 고도',left:56,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(0); }}), r=rng32(S.seed*71+Math.round(ww*10)), q;
    [2,4,6,8].forEach(function(wv){ var L=[]; for(q=50;q<=xm;q+=25) L.push([q,r04(q,wv).dx]); plotLine(ctx,P,L,COL.dim,1.2,[4,3]); });
    var Lc=[]; for(q=50;q<=xm;q+=25) Lc.push([q,r04(q,ww).dx]); plotLine(ctx,P,Lc,COL.amber,2.6);
    plotPoints(ctx,P,[100,200,300,400,500].map(function(hq){ return [hq,nz(r,r04(hq,ww).dx,0.08)]; }),COL.warm,4); plotPoints(ctx,P,[[h0,r04(h0,ww).dx]],COL.ok,6.5);
    legend(ctx,P.x1-130,P.y1+14,[['지금 풍속 '+ww.toFixed(1),COL.amber],['풍속 2 · 4 · 6 · 8',COL.dim],['측정 예시(±8 %)',COL.warm]]); },
  kv:function(h0,ww,S){ var D=r04(h0,ww); return [['낙하 시간 T',D.T.toFixed(0)+' s','a'],['이동 거리 Δx',D.dx.toFixed(0)+' m'],['w × T (단순 예측)',(ww*D.T).toFixed(0)+' m','g'],['차이',(D.dx-ww*D.T).toFixed(1)+' m','v2'],['방출 위치(풍상) X₀',D.dx.toFixed(0)+' m','r']]; } };

/* ── R05 : 센서 응답 시간(시정수)과 온도 오차 ────────────────────────────── */
function r05T(tau, v, t){ var Lr=0.0065*v, e=Lr*tau*(1-Math.exp(-t/tau)); return {air:Lr*t, sens:Lr*t-e, e:e}; }
(function(){
  var Lr=0.0065;
  PROJ.R05={ id:'R05', t:'센서는 늦게 따라온다 — 응답 시간 τ 와 낙하 속도', icon:'🌡', type:'프로젝트 · R&E', lv:2, dur:'3주', cost:'약 2만 원',
    one:'온도 센서를 따뜻한 물 → 찬 물로 옮겨 응답 곡선으로 시정수 τ 를 구하고, 낙하하는 캔위성에서는 센서가 높이 $v\\tau$ 만큼 늦게 읽는다는 것을 확인한다.',
    q:'센서의 시정수 τ 와 낙하 속도 v 는 낙하 중 측정한 온도 · 고도 프로파일에 어떤 오차 $L\\,v\\,\\tau$ 를 만들까?',
    why:'측정 장치는 순간적으로 값을 따라오지 못하고 <b>1 차 지연</b>을 가집니다. 이 지연이 빠르게 떨어지는 캔위성에서는 「센서가 몇 m 아래의 온도를 읽는 효과」로 나타납니다. 지수 함수 · 시정수 · 오차 전파를 한 번에 배웁니다.',
    link:'교과서 열과 온도(열평형) · 지수 함수(방사성 붕괴와 같은 모양) · 3번 탭 대기 · 15 ~ 16번 탭 분석.',
    fig:FIGS.R05.fig, tg:FIGS.R05.tg,
    cap:'낙하하는 캔위성에 달린 온도 센서(빨강)는 공기 온도(초록)가 변하는 것을 시간 τ 만큼 늦게 따라간다(노랑). 지연 시간 × 낙하 속도 = 지연 거리',
    parts:[['온도 센서','DS18B20 · NTC','소형 디지털 센서. <i>납땜 피복(튜브)이 두꺼울수록 τ 가 커진다</i>. 맨 센서 vs 금속관 센서 비교가 좋은 실험.'],
           ['캔위성 몸체','낙하 속도 v','센서는 몸체 밖 공기 흐름 속에 노출. 몸체 안쪽에 두면 몸체와 열을 주고받아 τ 가 훨씬 커진다.'],
           ['공기 온도 구배','L = 6.5 K/km','높이 1 m 에 0.0065 K. 낙하 속도 v 에서 <i>온도 변화율 = L·v</i> (v = 5 m/s 이면 0.0325 K/s).'],
           ['응답 시험','물 · 얼음물','센서를 20 ℃ 물에서 0 ℃ 물로 옮겨 온도가 63 % 변하는 시간이 τ(물 속은 공기보다 훨씬 빠르다).'],
           ['지연 계산','v·τ (m)','센서가 읽는 값은 높이 $v\\tau$ 만큼 위쪽(지연된) 공기의 온도.'],
           ['오차 · 보정','e = L v τ','정상 오차 $e=L\\,v\\,\\tau$. 측정 · 시정수를 알면 <i>역변환</i>($T_{\\text{공기}}=T_s+\\tau\\,dT_s/dt$)으로 보정.']],
    budget:[['디지털 온도 센서 (DS18B20)','2','약 3천 원','NTC 서미스터'],['아두이노(또는 ESP32)','1','약 1만 원','마이크로비트'],['금속관 · 열수축 튜브','1 세트','약 2천 원','—'],['물컵 · 얼음','—','—','—'],['스톱워치(영상 기록)','—','보유','—']],
    steps:['센서를 아두이노에 연결해 1 초 간격으로 온도를 기록하는 코드를 만든다(14번 탭 스타터 코드).','센서를 20 ℃ 물에서 얼음물(0 ℃)로 옮기고 온도 – 시간 곡선을 기록한다. $T(t)=T_f+(T_i-T_f)e^{-t/\\tau}$ 에 맞춰 τ 를 구한다.','센서 종류(맨 센서 · 금속관 · 튜브 입힘)를 바꿔 τ 를 비교한다.','캔위성이 v 로 낙하할 때의 지연 거리 $v\\tau$ 와 정상 오차 $L v\\tau$ 를 계산해 표로 만든다.','실제 낙하(또는 엘리베이터 · 계단 이동)에서 온도 변화가 계단 · 층을 따라 늦게 따라오는지 확인한다.'],
    vars:['센서 종류(τ) · 낙하 속도 v','센서 읽음 대 공기 온도의 차이(오차 e)','공기 온도 구배 · 센서 위치 · 초기 온도'],
    predict:[['v = 5 m/s · τ = 3 s','지연 거리 = vτ = '+fx(5*3,0)+' m · 정상 오차 = '+fx(Lr*5*3*1000,0)+' mK ≈ '+fx(Lr*5*3,2)+' ℃','$e=L v\\tau=0.0065\\times5\\times3=0.098$ ℃'],
             ['v = 5 m/s · τ = 10 s (두꺼운 튜브)','지연 거리 '+fx(5*10,0)+' m · 오차 '+fx(Lr*5*10,2)+' ℃','τ 가 3.3 배 → 오차도 3.3 배'],
             ['v = 40 m/s(낙하산 없이) · τ = 3 s','지연 거리 '+fx(40*3,0)+' m · 오차 '+fx(Lr*40*3,2)+' ℃','속도가 빠를수록 같은 센서도 더 늦게 보인다'],
             ['정상 상태에 이르는 시간','약 3τ ~ 5τ (63 % → 95 % → 99 %)','$1-e^{-3}=0.95$ · $1-e^{-5}=0.993$']],
    data:{cols:['센서 종류','τ (s)','v (m/s)','지연 거리 vτ (m)','정상 오차 Lvτ (℃)','고도 환산 (m)'],
          rows:[['맨 DS18B20','1.5',5,fx(5*1.5,1),fx(Lr*5*1.5,3),fx(5*1.5,1)],['금속관 센서','3',5,fx(5*3,1),fx(Lr*5*3,3),fx(5*3,1)],['두꺼운 튜브','10',5,fx(5*10,1),fx(Lr*5*10,3),fx(5*10,1)],['맨 DS18B20(낙하산 없이)','1.5',40,fx(40*1.5,1),fx(Lr*40*1.5,3),fx(40*1.5,1)]]},
    analysis:'응답 곡선을 $\\ln\\!\\left|\\dfrac{T-T_f}{T_i-T_f}\\right|=-t/\\tau$ 로 변환하면 직선이 되고 기울기 −1/τ 에서 τ 를 구한다. 여러 센서의 τ 를 같은 그래프에 놓고 신뢰구간을 제시한다. 보정 : $T_{\\text{공기}}\\approx T_s+\\tau\\,\\dfrac{dT_s}{dt}$ 를 적용한 뒤 오차가 얼마나 줄었는지 비교.',
    special:['🎓 연구 설계',[['연구 질문','센서의 시정수가 낙하 중 온도 측정에 주는 오차를 예측 · 보정할 수 있는가?'],['가설','오차 $e=L v \\tau$ 이며 역변환 보정으로 80 % 이상 줄어든다.'],['통계 설계','센서 3 종 × 3 회 응답 시험 → τ 의 평균 ± 표준편차, 로그 변환 직선 맞춤'],['한계','실제 낙하에서는 자기가열 · 복사 · 몸체의 열 전도가 섞인다']]],
    fails:[['응답 곡선이 지수가 아니다','센서가 몸체 · 전선으로 열을 주고받는다 — 센서를 띄워 고정하고 선을 가늘게'],['잡음이 크다','측정 간격을 늘려 평균 · 필터 사용(단 필터도 지연을 만든다!)'],['낙하 실험이 어렵다','엘리베이터 · 계단에서 온도가 다른 두 장소(실내 – 실외) 이동으로 대신 시험']],
    up:['<b>3번 탭 연결</b> — 기압 센서도 같은 방식으로 지연을 가진다(고도 계산 오차).','<b>필터 설계</b> — 지연과 잡음을 함께 줄이는 보정 필터(대학 수준).','<b>비교 실험</b> — 캔위성 몸체 안 · 밖에 센서를 두어 몸체의 열 영향을 비교.'],
    next:['원리② 대기 — 기압 · 고도 · 온도',3],
    eval:[['정확성','τ 를 3 회 이상 측정해 불확도 제시'],['모형','응답식과 보정식을 직접 유도하고 적용'],['해석','지연 거리 · 오차를 표로 제시하고 설계 규칙(센서 선택) 제안'],['확장','보정 전후 오차 비교 그래프']],
    tip:'센서를 물에서 얼음물로 옮기는 영상과 지수 곡선을 겹쳐 「같은 모양」임을 보여 주세요.' };
})();
SIMS.R05={ q:'센서의 시정수 τ 와 낙하 속도 v 를 바꾸면 센서가 읽는 온도는 얼마나 늦고 얼마나 틀릴까?',
  a:{nm:'센서 시정수 τ',min:0.2,max:10,step:0.2,val:3,unit:'s',d:1}, b:{nm:'낙하 속도 v',min:2,max:40,step:1,val:5,unit:'m/s',d:0},
  cap1:'낙하하는 캔위성. 초록 = 공기 온도, 노랑 = 센서가 읽는 값. 시간은 60 초를 10 초로 압축했습니다.',
  cap2:'📊 위 : 온도 대 시간(공기 · 센서). 아래 : 정상 오차 $L v\\tau$ 대 낙하 속도(τ = 1 · 3 · 10 s), 점 = 지금.',
  note:'모형 : 낙하하면 공기 온도가 L·v = 0.0065·v K/s 로 오른다고 보고, 센서는 1 차 지연 $dT_s/dt=(T_a-T_s)/\\tau$ 로 따라간다. 정상 오차 $e=Lv\\tau$, 도달 시간 약 3τ.',
  anim:function(ctx,w,h,t,tau,v,S){ var tt=t*6, r=r05T(tau,v,tt), gy=h-34, cx=w*0.3, y=40+(gy-100)*Math.min(1,tt/60);
    skyBg(ctx,w,gy); groundBg(ctx,w,h,gy);
    var i; ctx.strokeStyle=COL.hint; ctx.lineWidth=1.2; for(i=0;i<6;i++){ var yy=((i*40+tt*v*0.9)%(gy-20)); ctx.beginPath(); ctx.moveTo(14,yy+10); ctx.lineTo(26,yy+10); ctx.stroke(); }
    drawCan(ctx,cx-11,y,46); cvCirc(ctx,cx+16,y+8,4,COL.grav,COL.grav);
    var tx=w*0.52; cvText(ctx,'공기 온도 (L·v·t)',tx,gy*0.2,COL.ok,'12px system-ui,sans-serif'); cvText(ctx,'+'+r.air.toFixed(3)+' ℃',tx,gy*0.2+22,COL.ok,'bold 18px system-ui,sans-serif');
    cvText(ctx,'센서가 읽는 값',tx,gy*0.2+52,COL.amber,'12px system-ui,sans-serif'); cvText(ctx,'+'+r.sens.toFixed(3)+' ℃',tx,gy*0.2+74,COL.amber,'bold 18px system-ui,sans-serif');
    cvText(ctx,'차이 e = '+r.e.toFixed(3)+' ℃ (정상 '+(0.0065*v*tau).toFixed(3)+' ℃)',tx,gy*0.2+104,COL.grav,'bold 12px system-ui,sans-serif'); cvText(ctx,'실제 시간 '+tt.toFixed(0)+' s · 지연 거리 v·τ = '+(v*tau).toFixed(0)+' m',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,tau,v,S){ var hh=Math.floor(h*0.52), i, tmax=60, ym=0.0065*v*tmax*1.1;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:tmax,ymin:0,ymax:ym,ylabel:'ΔT (℃)',title:'온도 – 시간 : 공기와 센서',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(q){ return q.toFixed(2); }}, function(P){
      var a=[], s=[]; for(i=0;i<=120;i++){ var tq=tmax*i/120, rr=r05T(tau,v,tq); a.push([tq,rr.air]); s.push([tq,rr.sens]); } plotLine(ctx,P,a,COL.ok,2); plotLine(ctx,P,s,COL.amber,2.2);
      legend(ctx,P.x1-106,P.y1+14,[['공기 온도',COL.ok],['센서',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:2,xmax:40,ymin:0,ymax:0.0065*40*10*1.05,xlabel:'낙하 속도 v (m/s)',ylabel:'정상 오차 (℃)',title:'정상 오차 L·v·τ',left:56,top:24,bottom:38,xfmt:function(q){ return q.toFixed(0); },yfmt:function(q){ return q.toFixed(1); }}, function(P){
      [[1,COL.blue],[3,COL.amber],[10,COL.grav]].forEach(function(c){ plotLine(ctx,P,[[2,0.0065*2*c[0]],[40,0.0065*40*c[0]]],c[1],1.8); });
      plotPoints(ctx,P,[[v,0.0065*v*tau]],COL.ok,6.5); legend(ctx,P.x0+(P.x1-P.x0)*0.42,P.y1+14,[['τ = 1 s',COL.blue],['τ = 3 s',COL.amber],['τ = 10 s',COL.grav]]); }); },
  kv:function(tau,v,S){ return [['지연 거리 v·τ',(v*tau).toFixed(1)+' m','a'],['정상 오차 L·v·τ',(0.0065*v*tau).toFixed(3)+' ℃'],['정상 도달 시간 3τ',(3*tau).toFixed(1)+' s','g'],['공기 온도 변화율',(0.0065*v*1000).toFixed(1)+' mK/s','v2'],['보정 후 오차(역변환)','≈ 0 (잡음 제외)','r']]; } };
