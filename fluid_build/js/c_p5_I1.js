/* ═══════════════════════════════════════════════════════════════════════════
   발명 프로젝트 I01 ~ I05 : 유압 집게 · 저가 수심계 · 자작 비중계 · 자동 부력 조절 물고기 · 침수 감지 알림
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I01 : 유압 집게 로봇 ───────────────────────────────────────────── */
function i01(r,F){ var eta=0.8, Fg=eta*r*F, d1=30, d2=d1/r, v=60/r, W=F*d1/1000; return {Fg:Fg,d2:d2,v:v,W:W,Wg:Fg*d2/1000,m:Fg/G}; }
(function(){ var a=i01(2,20), b=i01(5,20), c=i01(5,10), d=i01(8,20);
  mkP({ id:'I01', t:'유압 집게 로봇 — 면적비로 설계하는 힘과 속도의 거래', icon:'🦞', type:'발명 · 로봇', lv:3, dur:'3 주', cost:'약 2 ~ 4만 원',
    one:'주사기 두 개(입력 · 출력)의 면적비 r 을 정해 집게 손가락이 집는 힘과 움직임 속도를 설계하는 유압 집게를 만든다. 집는 힘 F_g = η r F_in, 손가락 이동 거리 d₂ = d₁/r 의 거래 관계를 측정하고 용도(달걀 · 병뚜껑 · 가벼운 물건)에 맞는 면적비를 정한다.',
    q:'달걀을 깨지 않고 집으려면 면적비를 얼마로 해야 할까? 힘이 큰 집게는 왜 느릴까?',
    why:'파스칼의 원리를 <b>설계 변수</b>로 쓰는 첫 발명입니다. 면적비 하나가 힘과 속도를 정하고 두 값의 곱(일)은 일정하다는 것을 이해하면, 굴착기 · 로봇 팔의 설계 원리를 알 수 있습니다.',
    link:'원리② 파스칼(3번 탭) · R04 · C02 · 로봇공학 · 설계 거래(trade-off).',
    cap:'입력 주사기(왼쪽)가 호스로 집게 실린더에 연결된다(가운데) → 집는 힘과 속도의 거래 곡선(오른쪽). 면적비 ↔ 속도(왼쪽 아래) · 집는 힘 = 압력 × 면적(가운데 아래) · 힘–속도 거래(오른쪽 아래)',
    parts:[['입력 주사기','5 mL','손 · 서보로 누름','입력 힘 F_in 과 행정 d₁. 안지름으로 A₁ 을 구한다.'],
           ['출력 실린더','10 ~ 20 mL','집게 구동','면적비 r = A₂/A₁ 가 클수록 힘 ↑ · 속도 ↓.'],
           ['집게 손가락','골판지 · 3D 프린트','지레 구조','손가락 끝의 힘과 이동 거리는 실린더 값 × 지레비. 여기서는 1 : 1 가정.'],
           ['호스 · 밸브','투명 호스 · 체크밸브','공기 제거','공기가 들어가면 집는 힘이 약해진다(R05).'],
           ['힘 센서','저울 위에 집게 · 질량 측정','m = F/g','집게가 낼 수 있는 힘을 저울(g중)로 측정한다.'],
           ['시험 물체','달걀 · 병뚜껑','안 깨지게','달걀이 깨지지 않는 최대 힘(약 20 N 이하 어림)을 한계로 정한다.']],
    budget:[['주사기 5 mL · 20 mL','각 2','약 4천 원','—'],['호스 · 체크밸브','1 세트','약 5천 원','—'],['집게 재료(판 · 핀)','1 세트','약 5천 원','—'],['전자저울','1','학교','—'],['시험 물체','1 세트','약 2천 원','—']],
    steps:['안지름으로 면적비 r 을 정하고 이론 집는 힘 F_g = η r F_in 과 이동 거리 d₂ = d₁/r 를 계산한다.','집게를 조립하고 공기를 빼고 저울 위에서 집는 힘을 측정한다(입력 힘 변화 5 단계).','손가락 이동 거리 · 시간(속도)을 영상으로 재고 r 과의 관계를 표로 만든다.','달걀 · 병뚜껑 등 시험 물체를 집어 깨지지 않는 r 의 범위를 찾는다.','힘–속도 거래 그래프와 발명 설명서(새로운 점 · 한계)를 완성한다.'],
    vars:['면적비 r · 입력 힘 F_in','집는 힘 F_g · 이동 속도 v','마찰 · 공기 · 물체 강도'],
    predict:[['r 2 · F_in 20 N','F_g = '+fx(a.Fg,0)+' N · 속도 '+fx(a.v,0)+' mm/s','힘이 작고 빠르다'],
             ['r 5 · F_in 20 N','F_g = '+fx(b.Fg,0)+' N · 속도 '+fx(b.v,0)+' mm/s','힘이 크지만 느리다 — 달걀에는 위험'],
             ['r 5 · F_in 10 N','F_g = '+fx(c.Fg,0)+' N','입력 힘을 줄여 달걀에 맞게 조절'],
             ['r 8 · F_in 20 N','F_g = '+fx(d.Fg,0)+' N · 속도 '+fx(d.v,1)+' mm/s','매우 큰 힘 — 입력을 줄이거나 안전 장치']],
    data:{cols:['r','F_in (N)','집는 힘 (N)','손가락 이동 (mm)','속도 (mm/s)'],
          rows:[[1,20],[2,20],[3,20],[5,20],[5,10],[8,20]].map(function(q){ var o=i01(q[0],q[1]); return [q[0],q[1],fx(o.Fg,0),fx(o.d2,1),fx(o.v,0)]; })},
    analysis:'측정한 집는 힘 대 이론값(η = 실측/이론)을 정리하고 r 에 따른 속도 변화(1/r)를 확인한다. 달걀 파손 한계(약 20 N 어림)를 넘지 않는 r, F_in 의 영역을 힘–속도 그래프에 표시한다.',
    special:['🔧 발명 설명서',[['발명 이름','「힘 조절 유압 집게」'],['핵심 아이디어','면적비 조절 부품으로 힘과 속도를 용도에 맞게 선택'],['기존 방법과 차이','모터 집게는 힘 제한이 어렵고, 유압은 압력 한계 밸브로 제한 가능'],['한계','누수 · 공기 · 마찰 · 속도 느림']]],
    fails:[['힘이 안 나온다','공기 방울 · 마찰 · 호스 누수 점검'],['물체가 깨진다','r 을 줄이거나 입력 힘 제한(릴리프 밸브)'],['집게가 비틀린다','손가락 대칭 · 관절 정밀도']],
    up:['<b>I06</b> — 안전 밸브(힘 제한).','<b>C02</b> — 유압 로봇 팔.','<b>R04</b> — 면적비 · 효율.'],
    next:['원리② 파스칼의 원리',3],
    eval:[['발명성','힘 · 속도 설계'],['정량 시험','측정 vs 이론'],['안전 설계','힘 제한'],['한계 서술','공기 · 마찰']],
    tip:'「힘이 큰 집게는 느리다」는 거래를 그래프 한 장으로 보여 주면 설계 사고가 드러납니다.' });
})();
SIMS.I01={ q:'면적비와 입력 힘을 바꾸면 집게의 집는 힘과 손가락 속도는 어떻게 달라질까?',
  a:{nm:'면적비 r',min:1,max:10,step:0.5,val:4,unit:'',d:1}, b:{nm:'입력 힘 F_in',min:5,max:40,step:1,val:15,unit:'N',d:0},
  cap1:'유압 집게 단면. 입력 주사기(왼쪽)를 누르면 집게 손가락(오른쪽)이 달걀을 집습니다. 초록 영역은 안전, 빨강은 달걀 파손 한계(20 N) 초과.',
  cap2:'📊 면적비에 따른 집는 힘(실선)과 속도(점선) — 힘과 속도는 서로 반대로 움직이는 거래 관계입니다.',
  note:'모형 : 집는 힘 F_g = η r F_in (η = 0.8) · 입력 행정 30 mm · 손가락 이동 d₂ = 30/r · 속도 = 60/r mm/s(입력 속도 60 mm/s 가정) · 달걀 파손 한계 약 20 N(어림, 시료 · 방향에 따라 다름).',
  anim:function(ctx,w,h,t,r,F,S){ var o=i01(r,F), cy=h*0.5, ph=(t%4)/4, u=ph<0.5?ph*2:1-(ph-0.5)*2, ok=o.Fg<=20, ex=w*0.66, gap=22*(1-u*0.9);
    ctx.fillStyle='rgba(56,189,248,.3)'; ctx.fillRect(w*0.08,cy-9,w*0.3,18); ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.strokeRect(w*0.08,cy-9,w*0.3,18); ctx.lineWidth=1; ctx.fillStyle=COL.white; ctx.fillRect(w*0.08+u*18,cy-8,6,16); cvArrow(ctx,w*0.08-28,cy,w*0.08+u*18-2,cy,COL.amber,3); cvText(ctx,'F_in '+F+' N',w*0.08-30,cy-16,COL.amber,'bold 12px system-ui,sans-serif');
    cvLine(ctx,[[w*0.38,cy],[w*0.5,cy]],COL.blue,4); var cw=Math.min(40,10+r*3); ctx.fillStyle='rgba(56,189,248,.3)'; ctx.fillRect(w*0.5,cy-cw/2,w*0.1,cw); ctx.strokeStyle=COL.axis2; ctx.strokeRect(w*0.5,cy-cw/2,w*0.1,cw);
    ctx.fillStyle='#f5e6c8'; ctx.beginPath(); ctx.ellipse(ex,cy,18,22,0,0,6.283); ctx.fill(); ctx.strokeStyle=ok?COL.ok:COL.grav; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(ex,cy,26,0,6.283); ctx.stroke(); ctx.lineWidth=1;
    ctx.fillStyle=COL.white; ctx.fillRect(ex-18-gap+18-10,cy-34,8,68); ctx.fillRect(ex+18+gap-18+2,cy-34,8,68);
    cvText(ctx,'집는 힘 '+o.Fg.toFixed(0)+' N · 손가락 이동 '+o.d2.toFixed(1)+' mm · 속도 '+o.v.toFixed(0)+' mm/s → '+(ok?'달걀 안전':'달걀 파손 위험'),12,18,ok?COL.ok:COL.grav,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,r,F,S){ var a=[],b=[],i; for(i=1;i<=10;i+=0.5){ a.push([i,i01(i,F).Fg]); b.push([i,i01(i,F).v*0.6]); }
    lineGraph(ctx,w,h,{xmin:1,xmax:10,ymin:0,ymax:Math.max(40,i01(10,F).Fg*1.05),xl:'면적비 r',yl:'집는 힘 (N)  /  속도(mm/s)×0.6',title:'면적비 → 집는 힘(실선)과 속도(점선)',curves:[{pts:a,col:COL.ok,lw:2.4},{pts:b,col:COL.blue,lw:2,dash:[5,3]},{pts:[[1,20],[10,20]],col:COL.grav,lw:1.4,dash:[3,4]}],now:[r,i01(r,F).Fg],legend:[['집는 힘',COL.ok],['속도×0.6',COL.blue],['달걀 한계 20 N',COL.grav]]}); },
  kv:function(r,F,S){ var o=i01(r,F); return [['집는 힘',o.Fg.toFixed(0)+' N (≈'+o.m.toFixed(1)+' kg중)','a'],['손가락 이동',o.d2.toFixed(1)+' mm','g'],['속도',o.v.toFixed(0)+' mm/s','v2'],['달걀(20 N)',o.Fg<=20?'안전':'파손 위험'],['일 보존',o.W.toFixed(2)+' J → '+o.Wg.toFixed(2)+' J','r']]; } };

/* ── I02 : 저가 수심계(압력 센서) ───────────────────────────────────── */
function i02(dp,T){ var rho=rhoWater(T), dh=dp/(rho*G)*1000, bias=(rho/1000-1)*100, h=2000, err=(rho/1000-1)*h; return {dh:dh,rho:rho,bias:bias,err:err,hp:h}; }
(function(){ var a=i02(10,20), b=i02(100,20), c=i02(10,60), d=i02(1,4);
  mkP({ id:'I02', t:'저가 수심계 — 압력 센서로 수심을 재는 장치', icon:'📏', type:'발명 · 센서', lv:3, dur:'3 주', cost:'약 2 ~ 4만 원',
    one:'방수 처리한 압력 센서(예 : BMP280 계열을 젤로 보호한 모듈)로 물속 압력을 재어 수심 h = (p − p₀)/(ρg)로 환산하는 수심계를 만든다. 센서 분해능 δp 와 수온에 따른 밀도 변화가 수심 오차에 미치는 영향을 정량화한다.',
    q:'압력 센서의 분해능 10 Pa 는 수심 몇 mm 에 해당할까? 수온이 40 ℃ 변하면 수심 오차는 얼마나 생길까?',
    why:'수압이 깊이에 비례한다는 사실은 <b>수심 측정기</b>의 원리입니다. 분해능과 온도 보정이라는 현실 문제를 숫자로 다루며 센서 설계의 감각을 익힙니다. 안전을 위해 실험은 낮은 수심(수조)에서만 합니다.',
    link:'원리① 압력과 깊이(2번 탭) · 원리⑤ 측정(6번 탭) · R09 · 센서 · 아두이노.',
    cap:'방수 센서가 물속에 잠긴다(왼쪽) → 압력 → 수심 계산(가운데) → 분해능 · 온도 오차(오른쪽). 압력 센서 + 방수(왼쪽 아래) · Δh = Δp/(ρg)(가운데 아래) · 분해능 · 잡음(오른쪽 아래)',
    parts:[['압력 센서','방수 처리 모듈','분해능 δp','센서 표면을 실리콘 젤로 덮고 방수 테이프로 감싸 수조에서만 사용한다.'],
           ['기준 압력 p₀','수면 위 대기압','영점 보정','수면 위에서 p₀ 를 읽어 두고 수중 압력과의 차이를 구한다.'],
           ['수심 환산','h = (p − p₀)/(ρg)','ρ 는 온도 보정','물의 밀도 ρ(T) 를 수온으로 계산해 쓴다.'],
           ['수온 센서','방수 온도 센서','±0.5 ℃','밀도 보정과 센서의 온도 드리프트 보정에 쓴다.'],
           ['마이크로컨트롤러','Arduino','시리얼 출력','1 초에 10 번 읽어 이동 평균(10 개)으로 잡음을 줄인다.'],
           ['눈금자 검증','줄자와 비교','오차 곡선','센서를 5 ~ 50 cm 로 담가 줄자 값과 센서 값을 비교한다.']],
    budget:[['압력 센서 모듈','1','약 5천 원','—'],['Arduino · 케이블','1 세트','약 1.5만 원','마이크로비트'],['방수 젤 · 테이프','1','약 5천 원','—'],['온도 센서','1','약 3천 원','—'],['투명 수조 · 줄자','1','약 1만 원','—']],
    steps:['센서 분해능과 잡음(σ)을 수면 위에서 100 회 읽어 정한다.','수조에 센서를 담가 깊이 5, 10, 20, 30, 40 cm 에서 압력을 읽는다(방수 점검 후 낮은 깊이만).','h_센서 = Δp/(ρg) 와 줄자 값의 차이(오차)를 구한다.','수온을 10 ~ 40 ℃ 로 바꿔 밀도 보정 유무에 따른 오차를 비교한다.','이동 평균 · 보정 코드를 정리해 발명 설명서(분해능 · 오차 · 한계)를 쓴다.'],
    vars:['센서 분해능 δp · 수온 T','수심 오차 · 분해능 Δh','잡음 · 방수 · 드리프트'],
    predict:[['δp 10 Pa · 20 ℃','Δh = '+fx(a.dh,1)+' mm','1 Pa ≈ 0.1 mm 수심'],
             ['δp 100 Pa · 20 ℃','Δh = '+fx(b.dh,1)+' mm','분해능이 나쁘면 1 cm 단위'],
             ['δp 10 Pa · 60 ℃','Δh = '+fx(c.dh,1)+' mm · 밀도 무시 오차 '+fx(c.err,0)+' mm(2 m 수심)','온도에 따라 밀도가 변한다'],
             ['δp 1 Pa · 4 ℃','Δh = '+fx(d.dh,2)+' mm','고분해능 센서면 mm 이하']],
    data:{cols:['δp (Pa)','Δh (mm)','T (℃)','ρ (kg/m³)','2 m 수심 밀도 무시 오차 (mm)'],
          rows:[[1,20],[10,20],[50,20],[100,20],[10,40],[10,60]].map(function(q){ var o=i02(q[0],q[1]); return [q[0],fx(o.dh,2),q[1],fx(o.rho,1),fx(o.err,1)]; })},
    analysis:'센서 오차 곡선(h_센서 − h_줄자)의 평균(편향)과 표준편차를 구하고 온도 보정 전후를 비교한다. 분해능이 수심 분해능으로 변환되는 식과 실측의 일치를 확인하고, 고수심(수 m 이상)에서 필요한 방수 · 압력 정격을 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「mm 수심계」'],['핵심 아이디어','압력 센서 + 온도 보정으로 수심을 mm 단위로 측정'],['기존 방법과 차이','줄 · 눈금 수심계는 육안 의존, 센서는 연속 기록'],['한계','방수 · 드리프트 · 저수심용(교육용), 고수심은 정격 센서 필요']]],
    fails:[['값이 계속 흐른다','온도 안정화 · 센서 드리프트 보정 · 평균'],['방수가 안 된다','센서를 젤로 완전히 덮고 낮은 깊이만 사용 · 전자 부품 침수 금지'],['기준 압력이 변한다','측정 전 · 후 p₀ 를 기록 · 날씨에 따른 기압 변화 보정']],
    up:['<b>R09</b> — 마노미터로 압력 측정.','<b>I05</b> — 침수 감지.','<b>종합3(17번 탭)</b> — 압력–깊이 기울기.'],
    next:['종합3 압력 대 깊이',17],
    eval:[['정량 시험','오차 곡선'],['보정','온도 · 기준 압력'],['안전','방수 · 저전압'],['한계 서술','저수심용 명시']],
    tip:'수심 오차의 가장 큰 원인이 센서가 아니라 기준 압력(날씨)인 경우가 많습니다 — 측정 전후에 p₀ 를 기록하세요.' });
})();
SIMS.I02={ q:'센서 분해능과 수온을 바꾸면 수심 분해능과 밀도 무시 오차는 어떻게 달라질까?',
  a:{nm:'압력 분해능 δp',min:1,max:200,step:1,val:10,unit:'Pa',d:0}, b:{nm:'수온 T',min:0,max:60,step:2,val:20,unit:'℃',d:0},
  cap1:'수조 속 센서(노랑)와 수심 눈금. 오른쪽 오차 막대는 분해능(파랑)과 수온을 보정하지 않았을 때의 밀도 오차(주황, 수심 2 m 기준).',
  cap2:'📊 위 : 분해능 δp 에 따른 수심 분해능(직선, 기울기 1/ρg). 아래 : 수온에 따른 밀도 무시 오차(수심 2 m).',
  note:'모형 : 수심 분해능 Δh = δp/(ρ g) · ρ = ρ_w(T) · 밀도 무시 오차 = (ρ(T)/1000 − 1)·수심(1000 으로 가정 시). 압력 센서 드리프트 · 대기압 변화 · 방수 문제는 별도.',
  anim:function(ctx,w,h,t,dp,T,S){ var o=i02(dp,T), top=36, bot=h-26, tx=w*0.3, tw=Math.min(120,w*0.2), ph=Math.min(1,t/2), sy=top+30+(bot-top-60)*ph;
    ctx.fillStyle='rgba(56,189,248,.28)'; ctx.fillRect(tx-tw/2,top+20,tw,bot-top-20); vessel(ctx,tx-tw/2,top,tw,bot-top); for(var i=0;i<=5;i++){ cvText(ctx,(i*10)+' cm',tx+tw/2+6,top+20+i*(bot-top-20)/5+4,COL.tick,'10.5px system-ui,sans-serif'); }
    ctx.fillStyle=COL.amber; ctx.fillRect(tx-14,sy,28,14); cvLine(ctx,[[tx,top],[tx,sy]],COL.dim,2);
    var bx=w*0.62, bw=48, mx=Math.max(o.dh,Math.abs(o.err),1)*1.1, h1=(bot-top-30)*Math.min(1,o.dh/mx), h2=(bot-top-30)*Math.min(1,Math.abs(o.err)/mx); ctx.fillStyle=COL.blue; ctx.fillRect(bx,bot-h1,bw,h1); ctx.fillStyle=COL.amber; ctx.fillRect(bx+bw+20,bot-h2,bw,h2); cvText(ctx,o.dh.toFixed(1)+' mm',bx+bw/2,bot-h1-6,COL.text,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,o.err.toFixed(0)+' mm',bx+bw*1.5+20,bot-h2-6,COL.text,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,'분해능',bx+bw/2,bot+14,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,'밀도 무시 오차',bx+bw*1.5+20,bot+14,COL.tick,'11px system-ui,sans-serif','center');
    cvText(ctx,'δp '+dp+' Pa → Δh '+o.dh.toFixed(1)+' mm · 수온 '+T+' ℃ → ρ '+o.rho.toFixed(1)+' kg/m³',12,18,COL.text,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,dp,T,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:1,xmax:200,ymin:0,ymax:25,ylabel:'Δh (mm)',title:'압력 분해능 → 수심 분해능',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,[[1,i02(1,T).dh],[200,i02(200,T).dh]],COL.ok,2.4); plotPoints(ctx,P,[[dp,i02(dp,T).dh]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:60,ymin:-60,ymax:5,xlabel:'수온 T (℃)',ylabel:'오차 (mm)',title:'수온 → 밀도 무시 시 수심 오차(2 m)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var pts=[]; for(i=0;i<=60;i+=2) pts.push([i,i02(1,i).err]); plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,[[T,i02(1,T).err]],COL.amber,7); }); },
  kv:function(dp,T,S){ var o=i02(dp,T); return [['수심 분해능',o.dh.toFixed(2)+' mm','a'],['물의 밀도',o.rho.toFixed(1)+' kg/m³','g'],['밀도 무시 편향',o.bias.toFixed(2)+' %','v2'],['2 m 수심 오차',o.err.toFixed(1)+' mm'],['1 hPa(100 Pa) 수심',(100/(o.rho*G)*100).toFixed(2)+' cm','r']]; } };

/* ── I03 : 자작 비중계 ───────────────────────────────────────────────── */
function i03(d,m,rho){ var A=Math.PI*Math.pow(d/20,2), h=m/(A*rho/1000), s=m/(A*Math.pow(rho/1000,2))*10; return {A:A,h:h,sens:s*0.01*1000/1000,len:m/(A*0.9)}; }
(function(){ var a=i03(8,3,1000), b=i03(8,3,1100), c=i03(5,3,1000), d=i03(10,4,1000);
  mkP({ id:'I03', t:'자작 비중계 — 빨대로 만드는 액체 밀도 측정기', icon:'🥤', type:'발명 · 측정기', lv:2, dur:'1 ~ 2주', cost:'약 5천 원',
    one:'속이 빈 빨대(또는 유리관) 끝에 클립 · 모래 추를 넣어 수직으로 뜨는 비중계를 만든다. 액체 밀도 ρ 가 클수록 얕게 잠기는 관계 h = m/(ρA)에 따라 눈금(잠긴 깊이)을 정하고, 줄기 지름 · 추 질량에 따른 감도를 설계한다.',
    q:'소금물에서 비중계는 얼마나 얕게 잠길까? 줄기를 더 가늘게 하면 감도는 어떻게 달라질까?',
    why:'아르키메데스의 원리가 <b>측정기</b>가 되는 과정을 직접 설계합니다. 같은 무게의 비중계가 밀도에 따라 반비례하는 깊이만큼 잠기는 것을 이용하므로 눈금이 균일하지 않다는 것도 계산으로 알 수 있습니다.',
    link:'원리③ 아르키메데스(4번 탭) · R02 · 밀도 측정 · 비례/반비례 · 센서 설계.',
    cap:'추를 단 빨대 비중계가 액체에 수직으로 뜬다(왼쪽) → 밀도에 따른 잠긴 깊이(가운데) → 눈금 곡선(오른쪽). 빨대 + 클립 추(왼쪽 아래) · h = m/(ρA)(가운데 아래) · 눈금 보정(오른쪽 아래)',
    parts:[['줄기(빨대)','속 빈 관 · 지름 d','단면적 A = πd²/4','가늘수록 같은 밀도 변화에 깊이 변화가 크다(감도 ↑).'],
           ['추','클립 · 모래','질량 m(자기 무게 포함)','추를 아래에 두어 무게중심을 낮춘다 — 수직으로 서려면 필요(R07).'],
           ['잠긴 깊이 h','m = ρ A h','h = m/(ρA)','밀도 ρ 가 크면 얕게 잠긴다(반비례). 눈금은 균일하지 않다.'],
           ['눈금 만들기','기준 액체로 보정','물 1.000 · 소금물 1.050 · 1.100','알고 있는 밀도의 액체에 담가 눈금을 표시한다.'],
           ['감도','dh/dρ = −m/(Aρ²)','mm/(0.01 g/cm³)','줄기가 가늘고 추가 클수록 감도가 크지만 길이가 길어진다.'],
           ['안정 · 크기','줄기 길이 ≥ h_max','용기 깊이','용기의 벽에 닿지 않게. 흔들림이 멈춘 뒤 읽는다.']],
    budget:[['빨대(굵은 것 · 가는 것)','각 2','약 1천 원','유리관'],['클립 · 모래','1 세트','약 1천 원','—'],['테이프 · 마커','1','약 1천 원','—'],['눈금실린더 · 소금','1','약 3천 원','—'],['정밀 저울','1','학교','—']],
    steps:['빨대 지름 d 와 추 질량 m(비중계 총 질량)을 정해 물에서의 잠긴 깊이 h = m/(ρA)를 계산한다.','물에 띄워 수직으로 서는지 확인하고(안 서면 추를 아래로), 수면 위치에 「1.00」 눈금을 표시한다.','소금물을 1.05, 1.10, 1.15 로 만들어 같은 방법으로 눈금을 표시한다(시판 비중계로 확인).','깊이 h 대 밀도 ρ 그래프(쌍곡선)를 그리고 이론 곡선과 비교한다.','알 수 없는 액체(설탕물 · 주스)의 밀도를 재고 정확도(오차 %)를 평가한다.'],
    vars:['줄기 지름 d · 추 질량 m','잠긴 깊이 h · 감도','액체 밀도 · 수직 자세'],
    predict:[['d 8 mm · m 3 g · 물 1000','h = '+fx(a.h,2)+' cm','m/(ρA) = 3/(0.503) = 5.97 cm'],
             ['d 8 mm · m 3 g · 소금물 1100','h = '+fx(b.h,2)+' cm (물보다 '+fx(a.h-b.h,2)+' cm 얕음)','밀도 ↑ → 얕게'],
             ['d 5 mm · m 3 g · 물','h = '+fx(c.h,2)+' cm(더 길어짐)','가는 줄기 → 눈금이 길어 감도 ↑'],
             ['d 10 mm · m 4 g · 물','h = '+fx(d.h,2)+' cm','굵은 줄기 → 짧고 감도 ↓']],
    data:{cols:['ρ (kg/m³)','h (d 8 mm · m 3 g) (cm)','눈금 간격 / 0.01 g/cm³ (mm)'],
          rows:[900,950,1000,1050,1100,1200].map(function(r){ var o=i03(8,3,r); return [r,fx(o.h,2),fx(3/(Math.PI*0.16*Math.pow(r/1000,2))*0.01*10,2)]; })},
    analysis:'측정한 h 와 이론 h(ρ) 를 비교하고, 눈금 간격이 밀도가 클수록 좁아지는 비선형성을 서술한다. 감도 dh/dρ 와 읽기 오차 ±0.5 mm 로 밀도 분해능을 구하고 시판 비중계와 정확도를 비교한다.',
    special:['🔧 발명 설명서',[['발명 이름','「빨대 비중계」'],['핵심 아이디어','h = m/(ρA) 를 이용한 가늘고 긴 줄기의 고감도 설계'],['기존 방법과 차이','값싼 재료로 감도를 설계 변수로 조절'],['한계','온도 · 표면 장력 · 수직도 · 눈금 비선형']]],
    fails:[['비중계가 눕는다','추를 아래에 더 무겁게 · 무게중심 낮추기(안정)'],['수면에 붙는다','줄기 표면을 닦고 세제 한 방울(표면 장력 감소)'],['눈금이 일정치 않다','같은 온도 · 같은 용액 · 흔들림 멈춘 후 읽기']],
    up:['<b>R02</b> — 소금물 농도와 밀도.','<b>R08</b> — 온도와 밀도.','<b>I04</b> — 부력 제어.'],
    next:['원리③ 아르키메데스의 원리',4],
    eval:[['발명성','감도 설계'],['정량 시험','눈금 · 정확도'],['안정 설계','추 위치'],['한계 서술','비선형 · 온도']],
    tip:'가는 줄기와 긴 눈금이 감도를 높이지만 용기 깊이 한계가 생기므로 「감도 – 크기」 거래를 한 줄로 쓰세요.' });
})();
SIMS.I03={ q:'줄기 지름과 추 질량을 바꾸면 비중계가 액체 밀도에 따라 잠기는 깊이와 감도는 어떻게 달라질까?',
  a:{nm:'줄기 지름 d',min:3,max:12,step:0.5,val:8,unit:'mm',d:1}, b:{nm:'비중계 총 질량 m',min:1,max:8,step:0.5,val:3,unit:'g',d:1},
  cap1:'액체 3 종(왼쪽부터 알코올 · 물 · 소금물)에 뜬 비중계. 밀도가 클수록 얕게 잠깁니다(눈금은 위쪽이 큰 밀도).',
  cap2:'📊 액체 밀도 대 잠긴 깊이(반비례 곡선). 점은 세 액체. 곡선의 기울기가 감도입니다.',
  note:'모형 : 부력 = 무게 → h = m/(ρA), A = πd²/4 · 감도 |dh/dρ| = m/(Aρ²) · 표면 장력 · 줄기 위 부분의 부력은 무시.',
  anim:function(ctx,w,h,t,d,m,S){ var liq=[[800,'알코올',COL.amber],[1000,'물',COL.blue],[1100,'소금물',COL.ok]], bw=Math.min(90,w*0.2), top=40, bot=h-26, sc=Math.min(10,(bot-top-30)/Math.max(i03(d,m,800).h,3)), i;
    liq.forEach(function(q,k){ var x=w*0.1+k*(bw+22)+bw/2, o=i03(d,m,q[0]), wl=top+36; ctx.fillStyle='rgba(56,189,248,.25)'; ctx.fillRect(x-bw/2,wl,bw,bot-wl); vessel(ctx,x-bw/2,top,bw,bot-top); var bob=Math.sin(t*2+k)*1.5*Math.exp(-t/4), hp=o.h*sc, y=wl+hp-o.len*sc*0.0; ctx.fillStyle=q[2]; ctx.globalAlpha=0.8; ctx.fillRect(x-3,wl-26+bob,6,26+hp); ctx.globalAlpha=1; ctx.fillStyle='#94a3b8'; ctx.beginPath(); ctx.arc(x,wl+hp+bob,5,0,6.283); ctx.fill(); cvText(ctx,q[1]+' '+q[0],x,bot+14,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,'h '+o.h.toFixed(2)+' cm',x,top+14,q[2],'bold 11.5px system-ui,sans-serif','center'); });
    cvText(ctx,'d '+d+' mm · m '+m+' g → 물에서 h = '+i03(d,m,1000).h.toFixed(2)+' cm · 감도 '+(m/(Math.PI*Math.pow(d/20,2))*10).toFixed(1)+' mm per 0.01',12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,d,m,S){ var pts=[],i; for(i=800;i<=1250;i+=10) pts.push([i,i03(d,m,i).h]); var mx=i03(d,m,800).h*1.05;
    lineGraph(ctx,w,h,{xmin:800,xmax:1250,ymin:0,ymax:mx,xl:'액체 밀도 ρ (kg/m³)',yl:'잠긴 깊이 h (cm)',title:'밀도 → 잠긴 깊이 (반비례)',curves:[{pts:pts,col:COL.blue,lw:2.4}],pts:[[800,i03(d,m,800).h],[1000,i03(d,m,1000).h],[1100,i03(d,m,1100).h]],now:[1000,i03(d,m,1000).h]}); },
  kv:function(d,m,S){ var o=i03(d,m,1000); return [['단면적 A',o.A.toFixed(2)+' cm²','a'],['물에서 깊이',o.h.toFixed(2)+' cm','g'],['소금물 1100 에서',i03(d,m,1100).h.toFixed(2)+' cm','v2'],['감도(0.01 g/cm³)',(m/(o.A)*10*0.01*1).toFixed(2)+' mm'],['필요한 줄기 길이',(o.h*1.25).toFixed(1)+' cm','r']]; } };

/* ── I04 : 자동 부력 조절 물고기 ───────────────────────────────────── */
function i04(Kp,zt){ var dt=0.01, T=10, z=0.1, v=0, m=0.3, c=0.7, Fmax=0.12, out=[], i, t=0, ov=0, ts=null, Kd=0.5*Kp; for(i=0;i<=T/dt;i++){ var e=zt-z, u=Math.max(-1,Math.min(1,(Kp*e-Kd*v)/ (0.1*10))); var F=Fmax*u, a=(F-c*v)/m; v+=a*dt; z+=v*dt; if(i%10===0) out.push([t,z]); t+=dt; if(z>zt) ov=Math.max(ov,z-zt); } var j, tss=T; for(j=out.length-1;j>=0;j--){ if(Math.abs(out[j][1]-zt)>0.02*zt){ tss=out[Math.min(out.length-1,j+1)][0]; break; } } return {z:out,ov:ov/zt*100,ts:tss,ess:Math.abs(zt-out[out.length-1][1])/zt*100}; }
(function(){ var a=i04(1,0.3), b=i04(4,0.3), c=i04(10,0.3), d=i04(4,0.5);
  mkP({ id:'I04', t:'자동 부력 조절 물고기 — 주사기 밸러스트와 깊이 제어', icon:'🐟', type:'발명 · 제어', lv:3, dur:'3 ~ 4주', cost:'약 3 ~ 5만 원',
    one:'모형 물고기(방수 병)의 주사기 밸러스트를 서보 모터로 움직여 깊이를 목표값에 맞추는 자동 부력 조절 장치를 설계한다. 비례(P) + 미분(D) 제어로 목표 깊이에 도달하는 시간 · 오버슈트 · 정상 오차를 시험하고 이득 Kp 의 영향을 비교한다.',
    q:'제어 이득을 크게 하면 목표 깊이에 더 빨리 도달할까? 너무 크면 왜 출렁일까?',
    why:'부력으로 깊이를 조절하는 것은 잠수함 · 부레를 가진 물고기의 공통 원리입니다. 센서 + 액추에이터 + 제어 알고리즘이 모이는 작은 공학 프로젝트로, 응답 곡선으로 제어 성능을 말할 수 있게 됩니다.',
    link:'원리③ 아르키메데스(4번 탭) · C04 · R10 · 피드백 제어 · 센서(I02).',
    cap:'물고기의 주사기 밸러스트(왼쪽) → 압력 센서 깊이 측정과 제어기(가운데) → 깊이–시간 곡선(오른쪽). 주사기 밸러스트(왼쪽 아래) · 깊이 피드백 제어(가운데 아래) · 깊이–시간 곡선(오른쪽 아래)',
    parts:[['방수 몸통','페트병 · 방수 케이스','부피 약 500 mL','내부에 부품과 주사기를 넣고 완전 방수. 평균 밀도를 물에 가깝게 조절.'],
           ['주사기 밸러스트','서보 + 주사기','밸러스트 부피 ±20 mL','물을 빨아들이면 가라앉고 내보내면 뜬다. 속도는 서보가 정한다.'],
           ['압력 센서','I02 의 수심계','깊이 z 측정','깊이를 10 Hz 로 읽는다. 이동 평균으로 잡음 제거.'],
           ['제어기','Arduino','u = Kp(z_t − z) − Kd v','P + D 제어. 출력 u 를 서보 각도로 바꾼다. 포화(한계) 처리.'],
           ['안전 한계','수심 · 시간 제한','수조에서만','깊이가 한계 이상이면 정지 · 부력 상승. 전원은 5 V 이하.'],
           ['성능 지표','오버슈트 · 정착 시간','2 % 이내 정착','응답 곡선에서 읽는다. Kp 를 바꿔 비교.']],
    budget:[['방수 병 · 케이스','1','약 3천 원','—'],['서보 · 주사기','1 세트','약 1만 원','—'],['압력 센서 · Arduino','1 세트','약 2만 원','—'],['배터리 5 V','1','약 5천 원','—'],['수조 · 방수 테이프','1','약 1만 원','—']],
    steps:['센서와 서보를 연결하고 수조에서 깊이 측정 · 서보 방향이 맞는지 확인한다(방수 점검).','P 제어(Kd = 0)로 목표 깊이 30 cm 를 주고 응답을 기록한다(Kp 1, 2, 4, 8).','오버슈트와 정착 시간을 응답 곡선에서 읽어 표로 만든다.','D 항(Kd = 0.5 Kp)을 추가하고 같은 시험을 반복해 출렁임이 줄어드는지 확인한다.','목표 깊이를 바꿔(20 · 40 cm) 성능이 유지되는지 시험하고 발명 설명서에 정리한다.'],
    vars:['제어 이득 Kp · 목표 깊이 z_t','오버슈트 · 정착 시간 · 정상 오차','센서 잡음 · 서보 속도 · 방수'],
    predict:[['Kp 1 · 목표 0.3 m','오버슈트 '+fx(a.ov,0)+' % · 정착 '+fx(a.ts,1)+' s','느리지만 안정'],
             ['Kp 4 · 목표 0.3 m','오버슈트 '+fx(b.ov,0)+' % · 정착 '+fx(b.ts,1)+' s','빠르고 약간 출렁'],
             ['Kp 10 · 목표 0.3 m','오버슈트 '+fx(c.ov,0)+' % · 정착 '+fx(c.ts,1)+' s','이득이 크면 출렁임 · 포화'],
             ['Kp 4 · 목표 0.5 m','오버슈트 '+fx(d.ov,0)+' % · 정착 '+fx(d.ts,1)+' s','목표가 멀수록 시간이 걸린다']],
    data:{cols:['Kp','z_t (m)','오버슈트 (%)','정착 시간 (s)','정상 오차 (%)'],
          rows:[[0.5,0.3],[1,0.3],[2,0.3],[4,0.3],[8,0.3],[4,0.5]].map(function(q){ var o=i04(q[0],q[1]); return [q[0],q[1],fx(o.ov,0),fx(o.ts,1),fx(o.ess,1)]; })},
    analysis:'Kp 대 오버슈트 · 정착 시간 그래프를 그려 최적 이득(빠르고 출렁이지 않는 값)을 찾는다. 제어 포화(밸러스트 한계)가 응답을 느리게 하는 효과, D 항의 감쇠 효과, 실제 센서 잡음이 성능에 미치는 영향을 논의한다.',
    special:['🔧 발명 설명서',[['발명 이름','「스스로 깊이를 맞추는 물고기」'],['핵심 아이디어','주사기 밸러스트 + 압력 센서 + PD 제어'],['기존 방법과 차이','수동 조절 대신 목표 깊이 자동 유지'],['한계','수조 시험용 · 방수 · 센서 잡음 · 배터리 · 실제 바다에는 부적합']]],
    fails:[['깊이가 계속 출렁인다','Kp 를 낮추거나 D 항 추가 · 센서 평균'],['목표에 도달 못 한다','밸러스트 용량 · 평균 밀도 점검'],['방수가 샌다','전원 · 센서 부품 침수 금지 · 방수 점검 후 시험']],
    up:['<b>C04</b> — 밸러스트 쇼.','<b>I02</b> — 수심계.','<b>R10</b> — 카르테시안 잠수부.'],
    next:['원리③ 아르키메데스의 원리',4],
    eval:[['발명성','제어 구조'],['정량 시험','응답 곡선 지표'],['안전 설계','한계 · 방수'],['한계 서술','수조 시험용']],
    tip:'응답 곡선 한 장(Kp 별 비교)이 발명 설명서에서 가장 설득력 있는 그림입니다.' });
})();
SIMS.I04={ q:'제어 이득과 목표 깊이를 바꾸면 물고기의 깊이 응답(오버슈트 · 정착 시간)은 어떻게 달라질까?',
  a:{nm:'제어 이득 Kp',min:0.5,max:12,step:0.5,val:4,unit:'',d:1}, b:{nm:'목표 깊이 z_t',min:0.1,max:0.6,step:0.05,val:0.3,unit:'m',d:2},
  cap1:'수조 속 물고기(노랑)가 목표 깊이(점선)로 이동합니다. 주사기가 물을 넣고 빼며 부력을 조절합니다.',
  cap2:'📊 깊이–시간 응답. 점선 = 목표, 주황 = ±2 % 정착 범위. 이득이 클수록 빠르지만 출렁입니다.',
  note:'모형 : 질량 0.3 kg · 점성 항력 0.7 N·s/m · 최대 부력 조절력 ±0.12 N · 제어 u = (Kp e − Kd v)/1, Kd = 0.5 Kp · 포화 ±1 · 시뮬레이션 10 s. 센서 잡음 · 서보 지연은 무시.',
  anim:function(ctx,w,h,t,Kp,zt,S){ var o=i04(Kp,zt), top=30, bot=h-24, tx=w*0.3, tw=Math.min(150,w*0.28), idx=Math.min(o.z.length-1,Math.floor(t/10*o.z.length)), z=o.z[idx][1], y=top+(bot-top)*Math.min(1,z/0.65), ty=top+(bot-top)*zt/0.65;
    ctx.fillStyle='rgba(56,189,248,.25)'; ctx.fillRect(tx-tw/2,top,tw,bot-top); vessel(ctx,tx-tw/2,top-6,tw,bot-top+6); ctx.strokeStyle=COL.ok; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.moveTo(tx-tw/2,ty); ctx.lineTo(tx+tw/2,ty); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'목표 '+zt+' m',tx+tw/2+8,ty+4,COL.ok,'11.5px system-ui,sans-serif');
    ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.ellipse(tx,y,26,10,0,0,6.283); ctx.fill(); ctx.fillStyle='#fb7185'; ctx.beginPath(); ctx.moveTo(tx+26,y); ctx.lineTo(tx+38,y-8); ctx.lineTo(tx+38,y+8); ctx.closePath(); ctx.fill();
    cvText(ctx,'깊이 '+z.toFixed(2)+' m · Kp '+Kp+' → 오버슈트 '+o.ov.toFixed(0)+' % · 정착 '+o.ts.toFixed(1)+' s',12,18,COL.text,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,Kp,zt,S){ var o=i04(Kp,zt);
    var P=lineGraph(ctx,w,h,{xmin:0,xmax:10,ymin:0,ymax:Math.max(0.7,zt*1.5),xl:'시간 (s)',yl:'깊이 (m)',title:'깊이 응답 (Kp 별)',curves:[{pts:i04(1,zt).z,col:COL.dim,lw:1.4,dash:[4,3]},{pts:i04(10,zt).z,col:COL.grav,lw:1.4,dash:[4,3]},{pts:o.z,col:COL.blue,lw:2.6},{pts:[[0,zt],[10,zt]],col:COL.ok,lw:1.4,dash:[6,4]},{pts:[[0,zt*1.02],[10,zt*1.02]],col:COL.amber,lw:0.8,dash:[2,3]},{pts:[[0,zt*0.98],[10,zt*0.98]],col:COL.amber,lw:0.8,dash:[2,3]}],legend:[['지금 Kp',COL.blue],['Kp 1',COL.dim],['Kp 10',COL.grav],['목표',COL.ok]],yd:1}); },
  kv:function(Kp,zt,S){ var o=i04(Kp,zt); return [['오버슈트',o.ov.toFixed(0)+' %','a'],['정착 시간(2 %)',o.ts.toFixed(1)+' s','g'],['정상 오차',o.ess.toFixed(1)+' %','v2'],['제어 방식','P + D (Kd = 0.5Kp)'],['판단',o.ov>20?'출렁임 큼':o.ts>6?'느림':'양호','r']]; } };

/* ── I05 : 침수 감지 알림 ───────────────────────────────────────────── */
function erfc(x){ var z=Math.abs(x), t=1/(1+0.5*z), r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277))))))))); return x>=0? r : 2-r; }
function Q(x){ return 0.5*erfc(x/Math.SQRT2); }
function i05(hth,sig){ var pth=RHO_W*G*hth/100, fa=Q(pth/sig), det=Q((pth*0.7-RHO_W*G*hth*1.0/100)/sig*(-1)*0+((pth*0.7)-pth)/sig), det12=1-Q((pth*1.2-pth)/sig*(-1)), rate=1.0, delay=(sig*1.0)/(RHO_W*G*rate/100/60)/1; return {pth:pth,fa:fa,det:1-Q((1.2*pth-pth)/sig),z:pth/sig,sig:sig,dl:sig/(RHO_W*G/100)*1.0}; }
(function(){ var a=i05(10,20), b=i05(10,100), c=i05(3,50), d=i05(20,50);
  mkP({ id:'I05', t:'침수 감지 알림 — 수압 문턱과 오경보의 거래', icon:'🚨', type:'발명 · 안전', lv:3, dur:'2 ~ 3주', cost:'약 2 ~ 3만 원',
    one:'바닥에 놓은 압력 센서가 수면이 문턱 깊이 h_th 를 넘으면 경보음을 내는 침수 알림 장치를 만든다. 센서 잡음 σ 때문에 마른 상태에서 오경보가 나는 확률과 침수 시 놓치는 확률을 계산하고 문턱을 정한다. 실제 구명 장비를 대신하지 않는 교육용 안전 장치이다.',
    q:'문턱을 낮게 정하면 빨리 알려 주지만 오경보가 늘어난다. 센서 잡음에 맞는 문턱은 얼마일까?',
    why:'안전 장치의 핵심은 <b>빠른 감지와 낮은 오경보의 균형</b>입니다. 수압 p = ρgh 와 잡음의 통계를 연결해 문턱을 정하는 일은 센서 설계의 기본이며, 우리 주변의 침수 · 누수 경보에도 같은 원리가 쓰입니다.',
    link:'원리① 압력과 깊이(2번 탭) · 통계(정규분포) · 센서 · I02 · 7번 탭(안전).',
    cap:'바닥의 압력 센서(왼쪽) → 문턱과 경보(가운데) → 오경보 · 지연의 거래(오른쪽). 침수 감지(압력)(왼쪽 아래) · 오경보 ↔ 지연(가운데 아래) · 안전 우선 설계(오른쪽 아래)',
    parts:[['압력 센서','방수 모듈','잡음 σ','수심 h 에서 p = ρgh. 마른 상태의 잡음 σ 를 100 회 측정해 정한다.'],
           ['문턱 h_th','경보 수심','p_th = ρ g h_th','문턱이 낮으면 일찍 알리지만 잡음에 오경보. 문턱과 σ 의 비 z = p_th/σ 로 판단.'],
           ['오경보 확률','P_fa = Q(z)','마른 상태에서','z 가 클수록(문턱이 잡음보다 충분히 큼) 오경보가 급감한다.'],
           ['경보 지연','침수 속도 · 평균','수면 상승 1 cm/분 가정','평균 시간이 길수록 잡음이 줄지만 지연이 생긴다.'],
           ['경보 장치','부저 · LED','저전압','알림은 큰 소리 + 빛. 수신 확인을 위해 두 가지를 쓴다.'],
           ['안전 설계','교육용 표기','실제 구조 장비 아님','이 장치가 실제 침수 · 구조를 대신하지 않는다는 문구를 표기.']],
    budget:[['압력 센서 · Arduino','1 세트','약 2만 원','—'],['부저 · LED','1 세트','약 2천 원','—'],['방수 케이스','1','약 3천 원','—'],['배터리','1','약 3천 원','—'],['수조','1','보유','—']],
    steps:['마른 상태에서 센서 값을 200 회 읽어 평균과 잡음 σ(Pa)를 구한다.','문턱 깊이 h_th = 2, 5, 10, 20 cm 에 대한 이론 오경보 확률 Q(p_th/σ) 를 계산한다.','수조에서 천천히 물을 채워 경보가 울리는 깊이와 시간을 기록한다(5 회).','마른 상태에서 1 시간 동안 오경보 횟수를 센다.','문턱 · 이동 평균 길이를 정해 오경보와 지연의 균형을 잡고 발명 설명서를 쓴다.'],
    vars:['문턱 깊이 h_th · 센서 잡음 σ','오경보 확률 · 감지 확률 · 지연','평균 길이 · 온도 · 기압 변화'],
    predict:[['h_th 10 cm · σ 20 Pa','z = '+fx(a.z,1)+' · 오경보 '+(a.fa*100).toExponential(1)+' %','문턱이 잡음의 약 49 배'],
             ['h_th 10 cm · σ 100 Pa','z = '+fx(b.z,1)+' · 오경보 '+fx(b.fa*100,2)+' %','잡음이 크면 오경보 증가'],
             ['h_th 3 cm · σ 50 Pa','z = '+fx(c.z,1)+' · 오경보 '+fx(c.fa*100,1)+' %','문턱이 낮으면 오경보 ↑'],
             ['h_th 20 cm · σ 50 Pa','z = '+fx(d.z,1)+' · 오경보 '+(d.fa*100).toExponential(1)+' %','문턱을 높이면 오경보 거의 없음(알림은 늦음)']],
    data:{cols:['h_th (cm)','σ (Pa)','p_th (Pa)','z = p_th/σ','오경보 확률 (%)'],
          rows:[[2,30],[5,30],[10,30],[10,100],[3,50],[20,50]].map(function(q){ var o=i05(q[0],q[1]); return [q[0],q[1],fx(o.pth,0),fx(o.z,1),o.fa<1e-4?(o.fa*100).toExponential(0):fx(o.fa*100,3)]; })},
    analysis:'오경보 확률 이론값과 실제 관측 횟수를 비교하고 평균 길이 N 이 잡음을 σ/√N 으로 줄이는 효과를 확인한다. 문턱 · 지연 · 오경보의 거래 곡선(ROC 비슷한)을 그려 안전과 편의의 균형을 설명하고, 실제 안전 장치의 요구(인증 · 신뢰도)와의 차이를 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「수압 침수 알리미」'],['핵심 아이디어','수압 문턱 + 평균으로 오경보 줄이기'],['기존 방법과 차이','접점식 센서와 달리 연속 수심 측정 · 문턱 조절 가능'],['한계','교육용 · 방수 · 배터리 · 실제 구조 장비를 대신하지 않음']]],
    fails:[['마른 상태에서 울린다','평균 길이 증가 · 문턱 상향 · 기압 변화 보정'],['침수에 늦게 울린다','문턱 낮추기 · 평균 줄이기(오경보와 거래)'],['방수가 샌다','센서 · 전자 부품 침수 금지 · 밀봉 점검']],
    up:['<b>I02</b> — 수심계.','<b>C03</b> — 구명조끼 전시.','<b>7번 탭</b> — 안전 통계.'],
    next:['원리① 압력과 깊이',2],
    eval:[['발명성','문턱 설계'],['정량 분석','오경보 · 지연'],['안전 설계','교육용 표기'],['한계 서술','구조 장비 아님']],
    tip:'「오경보 0 %」를 약속하지 말고 「1 시간에 몇 회 이하」처럼 측정 결과로 성능을 표현하세요.' });
})();
SIMS.I05={ q:'경보 문턱 깊이와 센서 잡음을 바꾸면 마른 상태의 오경보 확률과 침수 감지는 어떻게 달라질까?',
  a:{nm:'문턱 깊이 h_th',min:1,max:30,step:1,val:8,unit:'cm',d:0}, b:{nm:'센서 잡음 σ',min:5,max:150,step:5,val:40,unit:'Pa',d:0},
  cap1:'바닥 센서의 압력 신호(파랑 선)에 잡음이 섞여 있습니다. 빨강 점선 = 경보 문턱. 마른 상태에서 잡음이 문턱을 넘으면 오경보입니다.',
  cap2:'📊 문턱 깊이에 따른 오경보 확률(세로 로그 눈금) — 잡음 σ 별. 문턱이 잡음의 약 4 배 이상이면 거의 0 입니다.',
  note:'모형 : 압력 신호 p = ρ g h + 가우시안 잡음(σ) · 문턱 p_th = ρ g h_th · 마른 상태 오경보 확률 P_fa = Q(p_th/σ) · 침수 시(문턱의 1.2 배 깊이) 감지 확률 = 1 − Q(0.2p_th/σ). 교육용 계산입니다.',
  anim:function(ctx,w,h,t,hth,sig,S){ var o=i05(hth,sig), top=36, bot=h-30, x0=40, x1=w-30, r=rng32(9), n=120, mx=Math.max(o.pth*1.8,sig*4), yv=function(p){ return bot-(bot-top)*(p/mx); }, i, pts=[], alarm=0;
    ctx.strokeStyle=COL.grav; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(x0,yv(o.pth)); ctx.lineTo(x1,yv(o.pth)); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'문턱 p_th = '+o.pth.toFixed(0)+' Pa',x1-4,yv(o.pth)-6,COL.grav,'11px system-ui,sans-serif','right');
    var upto=Math.min(n,Math.floor(t/10*n*1.4)); ctx.strokeStyle=COL.blue; ctx.lineWidth=1.6; ctx.beginPath(); for(i=0;i<=upto;i++){ var p=Math.max(0,sig*gaussR(r)), x=x0+(x1-x0)*i/n; pts.push(p); if(p>o.pth) alarm++; if(i===0) ctx.moveTo(x,yv(p)); else ctx.lineTo(x,yv(p)); } ctx.stroke(); ctx.lineWidth=1;
    pts.forEach(function(p,i){ if(p>o.pth){ ctx.fillStyle=COL.grav; ctx.beginPath(); ctx.arc(x0+(x1-x0)*i/n,yv(p),4,0,6.283); ctx.fill(); } });
    cvText(ctx,'마른 상태 신호(잡음 σ '+sig+' Pa) · 오경보 '+alarm+' 회 / '+(upto+1)+' 샘플 · 이론 확률 '+(o.fa*100<0.001?'<0.001':(o.fa*100).toFixed(3))+' %',12,18,alarm?COL.grav:COL.ok,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,hth,sig,S){ var P=makePlot(ctx,w,h,{xmin:1,xmax:30,ymin:-8,ymax:0,xlabel:'문턱 깊이 h_th (cm)',ylabel:'log₁₀(오경보 확률)',title:'문턱 깊이 → 오경보 확률 (잡음별)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)}), i;
    [[20,COL.ok],[50,COL.blue],[100,COL.amber]].forEach(function(q){ var pts=[]; for(i=1;i<=30;i+=1) pts.push([i,Math.max(-8,Math.log10(Math.max(1e-12,i05(i,q[0]).fa)))]); plotLine(ctx,P,pts,q[1],1.5,[4,3]); }); var pts=[]; for(i=1;i<=30;i+=1) pts.push([i,Math.max(-8,Math.log10(Math.max(1e-12,i05(i,sig).fa)))]); plotLine(ctx,P,pts,COL.white,2.6); plotPoints(ctx,P,[[hth,Math.max(-8,Math.log10(Math.max(1e-12,i05(hth,sig).fa)))]],COL.amber,7); legend(ctx,P.x1-130,P.y0-64,[['σ 20',COL.ok],['σ 50',COL.blue],['σ 100',COL.amber],['지금',COL.white]]); },
  kv:function(hth,sig,S){ var o=i05(hth,sig); return [['문턱 압력',o.pth.toFixed(0)+' Pa','a'],['z = p_th/σ',o.z.toFixed(1),'g'],['오경보 확률',o.fa<1e-6?'< 0.0001 %':(o.fa*100).toFixed(4)+' %','v2'],['침수(1.2배) 감지',(o.det*100).toFixed(1)+' %'],['판단',o.z>=4?'안정 설계':o.z>=2.5?'주의':'오경보 많음','r']]; } };
