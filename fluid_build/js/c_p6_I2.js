/* ═══════════════════════════════════════════════════════════════════════════
   발명 프로젝트 I06 ~ I10 : 안전 밸브 · 호스 물 수평계 · 손 유압 프레스 · 수면 부이 센서 · 사이펀 자동 배수기
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── I06 : 과압 방지 안전 밸브 설계 ─────────────────────────────────── */
function i06(Fs,Av){ var po=Fs/(Av*1e-4), pb=400e3, SF=pb/po, work=po/2; return {po:po,SF:SF,pb:pb,ok:SF>=4,pw:work}; }
(function(){ var a=i06(20,2), b=i06(40,2), c=i06(40,1), d=i06(10,3);
  mkP({ id:'I06', t:'과압 방지 안전 밸브 — 스프링과 면적으로 열림 압력 설계', icon:'🛡️', type:'발명 · 안전', lv:3, dur:'2 ~ 3주', cost:'약 1 ~ 2만 원',
    one:'주사기 유압 장치에 스프링으로 눌린 작은 밸브(면적 A_v)를 달아 압력이 p_open = F_s/A_v 를 넘으면 열려 물이 빠지도록 한다. 열림 압력을 호스가 견디는 압력(예 : 400 kPa)의 1/4 이하로 설계해 안전 계수를 확보하고 시험한다.',
    q:'스프링 힘과 밸브 면적을 어떻게 정해야 호스가 터지기 전에 밸브가 열릴까? 안전 계수는 얼마가 적당할까?',
    why:'압력을 다루는 장치에서 가장 중요한 것은 <b>과압을 막는 안전 장치</b>입니다. 힘 = 압력 × 면적이라는 식 하나로 안전 밸브를 설계할 수 있어 파스칼 원리의 응용이면서 안전공학의 입문이 됩니다.',
    link:'원리② 파스칼(3번 탭) · R05 · 안전 계수 · 스프링 힘(훅의 법칙) · 압력용기 안전.',
    cap:'스프링으로 눌린 밸브(왼쪽) → 압력 한계 곡선(가운데) → 열림 압력 계산(오른쪽). 스프링 + 밸브(왼쪽 아래) · 과압 시 먼저 열림(가운데 아래) · 열림 압력 계산(오른쪽 아래)',
    parts:[['밸브 몸체','작은 실린더 · 고무 마개','면적 A_v','압력이 작용하는 단면. 작을수록 열림 압력이 높다.'],
           ['스프링','압축 스프링 · 고무줄','힘 F_s = k x','스프링이 마개를 누르는 힘. 압축량 x 로 조절한다.'],
           ['열림 압력','p_open = F_s/A_v','kPa','압력이 이 값을 넘으면 마개가 밀려 물이 빠진다.'],
           ['배출구','회수 용기로','물 튀김 방지','열릴 때 물이 튀지 않게 호스로 용기에 보낸다.'],
           ['호스 정격','파열 압력 p_b','안전 계수 SF = p_b/p_open','일반적으로 4 이상 권장. 사용 호스의 정격은 제조사 자료로 확인.'],
           ['시험 장치','주사기 + 압력계','낮은 압력(~ 200 kPa)에서','압력계(마노미터 · 센서)로 열림 압력을 측정한다. 고압 시험 금지.']],
    budget:[['주사기 · 호스','1 세트','약 5천 원','—'],['스프링 · 마개','1 세트','약 3천 원','고무줄'],['압력 센서(선택)','1','약 5천 원','마노미터'],['투명 용기 · 방수포','1','약 3천 원','—'],['접착제','1','약 1천 원','—']],
    steps:['스프링 상수 k 를 측정(추 매달아 늘어난 길이)하고 설정 압축량 x 에서 F_s = kx 를 구한다.','밸브 면적 A_v 를 안지름으로 계산하고 이론 열림 압력 p_open = F_s/A_v 를 구한다.','주사기를 천천히 눌러 압력 센서(또는 마노미터)로 밸브가 열리는 압력을 읽는다(5 회).','F_s, A_v 를 바꿔 이론과 실측의 관계(직선)를 그려 보고 오차 원인을 분석한다.','호스 정격과의 안전 계수 SF 를 계산해 4 미만이면 설계를 수정한다.'],
    vars:['스프링 힘 F_s · 밸브 면적 A_v','열림 압력 p_open · 안전 계수 SF','마찰 · 스프링 비선형 · 호스 정격'],
    predict:[['F_s 20 N · A_v 2 cm²','p_open = '+fx(a.po/1000,0)+' kPa · SF = '+fx(a.SF,1),a.ok?'안전 계수 충분':'부족'],
             ['F_s 40 N · A_v 2 cm²','p_open = '+fx(b.po/1000,0)+' kPa · SF = '+fx(b.SF,1),b.ok?'충분':'부족(4 미만)'],
             ['F_s 40 N · A_v 1 cm²','p_open = '+fx(c.po/1000,0)+' kPa · SF = '+fx(c.SF,1),'면적을 줄이면 열림 압력 ↑ → 위험'],
             ['F_s 10 N · A_v 3 cm²','p_open = '+fx(d.po/1000,0)+' kPa · SF = '+fx(d.SF,1),'매우 낮은 압력에서 열린다(너무 민감)']],
    data:{cols:['F_s (N)','A_v (cm²)','p_open (kPa)','SF','판정'],
          rows:[[10,2],[20,2],[40,2],[60,2],[40,1],[40,4]].map(function(q){ var o=i06(q[0],q[1]); return [q[0],q[1],fx(o.po/1000,0),fx(o.SF,1),o.ok?'안전':'부족']; })},
    analysis:'이론 p_open 과 측정값의 차이를 마찰 · 스프링 비선형으로 설명하고, 반복 시험의 재현성(표준편차)을 구한다. 안전 계수 4 기준을 만족하는 (F_s, A_v) 영역을 그래프로 나타내고 실제 안전 밸브(국가 규격 · 인증)와의 차이를 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「스프링 열림 안전 밸브」'],['핵심 아이디어','p_open = F_s/A_v 의 설계식 + 안전 계수 4'],['기존 방법과 차이','교육용 저압 안전 밸브를 쉽게 조절'],['한계','교육용 · 낮은 압력 · 실제 압력 용기에 사용 금지']]],
    fails:[['밸브가 안 열린다','마찰 · 고무 마개 접착 점검 · 스프링 힘 감소'],['너무 빨리 열린다','스프링을 더 압축하거나 A_v 를 줄이기(단 안전 계수 확인)'],['물이 샌다','마개와 시트 면을 매끈하게 · 고무 패킹']],
    up:['<b>I08</b> — 손 유압 프레스.','<b>R05</b> — 공기 방울.','<b>C08</b> — 엘리베이터 안전 정지.'],
    next:['원리② 파스칼의 원리',3],
    eval:[['설계 계산','열림 압력 · SF'],['시험','재현성'],['안전 의식','저압 시험 · 규격 인식'],['한계 서술','교육용 명시']],
    tip:'안전 장치의 목적은 「열려서 끝」이 아니라 「열리는 압력을 예측하고 시험으로 증명」하는 것임을 강조하세요.' });
})();
SIMS.I06={ q:'스프링 힘과 밸브 면적을 바꾸면 열림 압력과 호스의 안전 계수는 어떻게 달라질까?',
  a:{nm:'스프링 힘 F_s',min:5,max:80,step:1,val:25,unit:'N',d:0}, b:{nm:'밸브 면적 A_v',min:0.5,max:5,step:0.1,val:2,unit:'cm²',d:1},
  cap1:'밸브 단면. 압력(파랑 화살표) × 면적이 스프링 힘을 넘으면 마개가 열립니다. 막대는 열림 압력과 호스 정격(400 kPa).',
  cap2:'📊 스프링 힘에 따른 열림 압력(밸브 면적별). 점선 = 안전 상한(호스 정격의 1/4 = 100 kPa).',
  note:'모형 : p_open = F_s/A_v · 호스 파열 압력 400 kPa(예시 값, 실제는 제조사 자료 확인) · 안전 계수 SF = 400/p_open · SF ≥ 4 권장. 마찰 · 동적 효과는 무시.',
  anim:function(ctx,w,h,t,Fs,Av,S){ var o=i06(Fs,Av), top=40, bot=h-30, bx=w*0.28, ph=Math.min(1,t/2.2), pr=(o.po*ph), open=pr>=o.po*0.99 && t>2.4;
    ctx.fillStyle='#475569'; ctx.fillRect(bx-30,bot-60,60,60); ctx.fillStyle='rgba(56,189,248,.4)'; ctx.fillRect(bx-24,bot-54,48,54); var lift=open?8:0; ctx.fillStyle=COL.white; ctx.fillRect(bx-14,bot-66-lift,28,10); ctx.strokeStyle=COL.dim; ctx.lineWidth=2.4; ctx.beginPath(); var k; for(k=0;k<8;k++){ var yy=bot-66-lift-6-k*5; ctx.lineTo(bx+(k%2?-9:9),yy); } ctx.stroke(); ctx.lineWidth=1; cvArrow(ctx,bx,bot-20,bx,bot-60,COL.blue,2.6);
    if(open){ for(k=0;k<4;k++){ ctx.fillStyle='rgba(125,211,252,.8)'; ctx.beginPath(); ctx.arc(bx+16+k*10+(t*30%10),bot-62-lift-k*4,3,0,6.283); ctx.fill(); } }
    var sx=w*0.62, bw=50, mx=Math.max(o.pb,o.po)/1000*1.05, h1=(bot-top)*(pr/1000)/mx, h2=(bot-top)*o.pb/1000/mx; ctx.fillStyle=COL.blue; ctx.fillRect(sx,bot-h1,bw,h1); ctx.fillStyle='rgba(251,113,133,.5)'; ctx.fillRect(sx+bw+16,bot-h2,bw,h2); ctx.strokeStyle=COL.axis2; ctx.strokeRect(sx,top,bw,bot-top); ctx.strokeRect(sx+bw+16,top,bw,bot-top);
    cvText(ctx,(pr/1000).toFixed(0)+' kPa',sx+bw/2,bot-h1-6,COL.text,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,'호스 '+(o.pb/1000).toFixed(0)+' kPa',sx+bw*1.5+16,bot-h2-6,COL.grav,'bold 11.5px system-ui,sans-serif','center'); cvText(ctx,'압력',sx+bw/2,bot+14,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,'파열 압력',sx+bw*1.5+16,bot+14,COL.tick,'11px system-ui,sans-serif','center');
    cvText(ctx,'열림 압력 '+(o.po/1000).toFixed(0)+' kPa · 안전 계수 '+o.SF.toFixed(1)+' → '+(o.ok?'안전 설계 ✔':'안전 계수 부족'),12,18,o.ok?COL.ok:COL.grav,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,Fs,Av,S){ var P=makePlot(ctx,w,h,{xmin:5,xmax:80,ymin:0,ymax:500,xlabel:'스프링 힘 F_s (N)',ylabel:'열림 압력 (kPa)',title:'스프링 힘 → 열림 압력 (밸브 면적별)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)}), i;
    plotLine(ctx,P,[[5,400],[80,400]],COL.grav,1.6,[6,4]); plotLine(ctx,P,[[5,100],[80,100]],COL.ok,1.4,[4,4]); [[1,COL.amber],[2,COL.blue],[4,COL.dim]].forEach(function(q){ plotLine(ctx,P,[[5,i06(5,q[0]).po/1000],[80,i06(80,q[0]).po/1000]],q[1],1.4,[5,3]); }); plotLine(ctx,P,[[5,i06(5,Av).po/1000],[80,i06(80,Av).po/1000]],COL.white,2.6); plotPoints(ctx,P,[[Fs,i06(Fs,Av).po/1000]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['A_v 1',COL.amber],['A_v 2',COL.blue],['A_v 4',COL.dim],['지금',COL.white],['호스 400',COL.grav],['SF 4 (100)',COL.ok]]); },
  kv:function(Fs,Av,S){ var o=i06(Fs,Av); return [['열림 압력',(o.po/1000).toFixed(0)+' kPa','a'],['호스 파열 압력',(o.pb/1000).toFixed(0)+' kPa','g'],['안전 계수 SF',o.SF.toFixed(1),'v2'],['SF ≥ 4 ?',o.ok?'예':'아니오'],['권장 최대 열림 압력',(o.pb/4000).toFixed(0)+' kPa','r']]; } };

/* ── I07 : 호스 물 수평계 ───────────────────────────────────────────── */
function i07(b,th){ var e=b*Math.sin(th*Math.PI/180), L=5000, sl=e/L*1000; return {e:e,sl:sl,ok:e<=2}; }
(function(){ var a=i07(0,0), b=i07(30,5), c=i07(60,5), d=i07(30,10);
  mkP({ id:'I07', t:'호스 물 수평계 — 연통관의 원리와 기포 오차', icon:'📐', type:'발명 · 측정기', lv:2, dur:'1 ~ 2주', cost:'약 1 만 원',
    one:'투명 호스에 물을 채워 양끝의 수면 높이가 같다는 연통관의 원리로 먼 곳 두 지점의 높이를 비교하는 수평계를 만든다. 호스 속 기포(길이 b)가 경사 구간에서 생기는 오차 e ≈ b sinθ 를 측정하고 기포를 없애는 방법을 설계한다.',
    q:'호스 속에 작은 기포가 있으면 높이 비교가 얼마나 틀릴까? 호스를 길게 하면 정확도가 좋아질까?',
    why:'목수 · 건축가가 쓰는 물 수평계는 <b>가장 오래된 정밀 도구</b> 중 하나입니다. 압력이 같은 높이에서 같다는 사실에서 나오는 장치를 직접 만들고 오차 원인(기포 · 온도 · 호스 휨)을 분석하는 프로젝트입니다.',
    link:'원리① 압력과 깊이(2번 탭) · 연통관 · R09 · 측정 오차 · 건축 · 측량.',
    cap:'투명 호스의 두 끝에서 수면이 같은 높이(왼쪽) → 호스 속 기포가 오차를 만든다(가운데) → 기포 길이 · 경사에 따른 오차(오른쪽). 연통관 수평 원리(왼쪽 아래) · 기포 길이 b → 오차(가운데 아래) · 호스 길이 · 읽기 오차(오른쪽 아래)',
    parts:[['투명 호스','길이 5 m · 지름 6 mm','물 + 색소','양쪽 끝을 수직으로 세워 수면을 읽는다. 호스 전체가 물로 가득 차야 한다.'],
           ['눈금 고정대','2 개','수면 읽기 눈금','양쪽 끝에 눈금자를 붙여 수면 위치를 mm 로 읽는다.'],
           ['기포 제거','주사기 · 천천히 채우기','공기 방울 없음','기포가 경사 구간에 있으면 오차 e ≈ b sinθ. 호스를 흔들어 모은 뒤 제거.'],
           ['온도 균일','같은 온도의 물','그늘에서 사용','호스의 한쪽만 더우면 밀도가 달라져 수면이 어긋난다(R08).'],
           ['검증','기준 수평면과 비교','레이저 · 수평자','수평이 알려진 면에서 읽은 두 수면의 차이를 오차로 본다.'],
           ['안전','호스 미끄럼','물 닦기','물이 쏟아지지 않게 마개를 사용하고 바닥 물을 닦는다.']],
    budget:[['투명 호스 5 m','1','약 4천 원','—'],['눈금자 2 개','1 세트','약 2천 원','줄자'],['색소 · 주사기','1','약 2천 원','—'],['마개 · 클립','1 세트','약 2천 원','—'],['수평자(검증)','1','학교','—']],
    steps:['호스에 색 물을 채워 기포가 없는지 확인하고 양쪽 끝을 마개로 막아 눈금자에 고정한다.','수평이 알려진 책상 위 두 지점에 양쪽 끝을 두고 수면 높이 차이(영점)를 기록한다.','일부러 기포(길이 10 ~ 100 mm)를 넣고 호스를 경사시켜 수면 차이 e 를 측정한다(경사 θ 5°, 10°).','e 대 b sinθ 를 그려 이론 직선과 비교한다.','기포 제거법(주사기로 밀어내기 · 천천히 채우기)과 정확도를 정리해 발명 설명서를 쓴다.'],
    vars:['기포 길이 b · 호스 경사 θ','수면 높이 차이 e · 기울기 오차','호스 길이 · 온도 · 읽기 오차'],
    predict:[['b = 0 · 경사 0','e = '+fx(a.e,2)+' mm','기포 없으면 오차 없음'],
             ['b = 30 mm · 5°','e = '+fx(b.e,2)+' mm · 5 m 당 '+fx(b.sl,2)+' mm/m','작은 기포는 오차가 작다'],
             ['b = 60 mm · 5°','e = '+fx(c.e,2)+' mm','기포가 길면 비례해 증가'],
             ['b = 30 mm · 10°','e = '+fx(d.e,2)+' mm','경사가 크면 오차 ↑']],
    data:{cols:['b (mm)','θ (°)','e = b sinθ (mm)','5 m 당 기울기 오차 (mm/m)'],
          rows:[[10,5],[30,5],[60,5],[100,5],[30,10],[100,10]].map(function(q){ var o=i07(q[0],q[1]); return [q[0],q[1],fx(o.e,2),fx(o.sl,2)]; })},
    analysis:'측정한 e 와 이론 b sinθ 를 비교해 기울기(감도)와 절편(영점)을 구한다. 호스 길이 5 m 에서 읽기 오차(±1 mm)에 해당하는 최소 측정 기울기를 계산하고, 기포가 없는 호스의 정확도(수평면 대비 ±mm)를 보고한다.',
    special:['🔧 발명 설명서',[['발명 이름','「기포 없는 물 수평계」'],['핵심 아이디어','연통관 + 기포 제거 절차 + 오차 표'],['기존 방법과 차이','수평자보다 먼 거리 정밀 비교 가능'],['한계','온도 · 기포 · 읽기 오차 · 호스 휨']]],
    fails:[['수면이 흔들린다','호스를 가만히 · 흔들림이 멈춘 후 읽기'],['값이 계속 어긋난다','기포 · 온도 차이 점검'],['물이 쏟아진다','마개 · 클립 사용 · 바닥 닦기']],
    up:['<b>R09</b> — 마노미터.','<b>I02</b> — 수심계.','<b>I10</b> — 사이펀.'],
    next:['원리① 압력과 깊이',2],
    eval:[['발명성','기포 제거 방법'],['정량 시험','e 대 b sinθ'],['정확도','mm 단위 평가'],['안전','물 · 미끄럼']],
    tip:'호스 수평계의 정확도는 길이가 아니라 기포와 온도에 달려 있다는 점을 한 줄로 쓰면 날카로운 통찰이 됩니다.' });
})();
SIMS.I07={ q:'호스 속 기포 길이와 경사를 바꾸면 수면 높이 오차는 얼마나 커질까?',
  a:{nm:'기포 길이 b',min:0,max:120,step:5,val:30,unit:'mm',d:0}, b:{nm:'호스 경사 θ',min:0,max:15,step:0.5,val:5,unit:'°',d:1},
  cap1:'호스 양끝의 수면. 기포가 경사 구간에 있으면 압력이 균형을 이루는 높이가 어긋나 e = b sinθ 만큼 수면 차이가 생깁니다.',
  cap2:'📊 기포 길이 대 오차(경사별 직선). 점선 = 허용 오차 2 mm.',
  note:'모형 : 기포 구간의 수직 높이 차 b sinθ 만큼 물 기둥이 빠져 압력이 달라지므로 수면 오차 e = b sinθ · 호스 길이 5 m 가정 · 온도 균일 · 읽기 오차 ±1 mm 는 별도.',
  anim:function(ctx,w,h,t,b,th,S){ var o=i07(b,th), x0=w*0.14, x1=w*0.8, y0=h*0.62, rad=th*Math.PI/180, y1=y0-(x1-x0)*Math.tan(rad)*0.3, e=o.e*1.2;
    ctx.strokeStyle=COL.blue; ctx.lineWidth=7; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.quadraticCurveTo((x0+x1)/2,Math.max(y0,y1)+40,x1,y1); ctx.stroke(); ctx.lineWidth=1; ctx.lineCap='butt';
    var bx=(x0+x1)/2, by=Math.max(y0,y1)+22; ctx.fillStyle='rgba(241,245,249,.9)'; ctx.fillRect(bx-Math.min(40,b*0.5),by-3,Math.min(80,b),6);
    ctx.strokeStyle=COL.axis2; ctx.lineWidth=2.4; ctx.strokeRect(x0-8,y0-70,16,70); ctx.strokeRect(x1-8,y1-70,16,70); ctx.lineWidth=1; var l0=y0-30, l1=y1-30+e*(1); ctx.fillStyle='rgba(56,189,248,.5)'; ctx.fillRect(x0-6,l0,12,y0-l0); ctx.fillRect(x1-6,l1,12,y1-l1); cvLine(ctx,[[x0-20,l0],[x1+20,l0]],COL.tick,1,[3,3]);
    cvText(ctx,'수면 차이 e = '+o.e.toFixed(2)+' mm → 5 m 당 기울기 오차 '+o.sl.toFixed(2)+' mm/m '+(o.ok?'(허용)':'(허용 2 mm 초과)'),12,18,o.ok?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); cvText(ctx,'기포 b = '+b+' mm · 경사 '+th+'°',bx,by+22,COL.tick,'11px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,b,th,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:120,ymin:0,ymax:Math.max(8,i07(120,15).e*1.05),xlabel:'기포 길이 b (mm)',ylabel:'수면 오차 e (mm)',title:'기포 길이 → 오차 (경사별)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(1)});
    plotLine(ctx,P,[[0,2],[120,2]],COL.grav,1.4,[5,4]); [[2,COL.ok],[5,COL.blue],[10,COL.amber]].forEach(function(q){ plotLine(ctx,P,[[0,0],[120,i07(120,q[0]).e]],q[1],1.4,[5,3]); }); plotLine(ctx,P,[[0,0],[120,i07(120,th).e]],COL.white,2.6); plotPoints(ctx,P,[[b,i07(b,th).e]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['2°',COL.ok],['5°',COL.blue],['10°',COL.amber],['지금',COL.white],['허용 2 mm',COL.grav]]); },
  kv:function(b,th,S){ var o=i07(b,th); return [['수면 오차 e',o.e.toFixed(2)+' mm','a'],['5 m 당 오차',o.sl.toFixed(2)+' mm/m','g'],['허용(2 mm)',o.ok?'이내':'초과','v2'],['허용 최대 기포',(th>0? (2/Math.sin(th*Math.PI/180)).toFixed(0):'∞')+' mm'],['권고','기포 제거 후 사용','r']]; } };

/* ── I08 : 손 유압 프레스 (안전 설계) ───────────────────────────────── */
function i08(F,L){ var A1=5e-4, A2=30e-4, eta=0.85, p=F*L/A1, Fo=eta*p*A2, pb=1200e3, SF=pb/p; return {p:p,Fo:Fo,SF:SF,ok:SF>=4,pb:pb,kg:Fo/G}; }
(function(){ var a=i08(60,2), b=i08(100,2), c=i08(100,4), d=i08(40,3);
  mkP({ id:'I08', t:'손 유압 프레스 — 힘의 증폭과 안전 계수 설계', icon:'🛠️', type:'발명 · 기계', lv:3, dur:'3 주', cost:'약 2 ~ 3만 원',
    one:'지레(손잡이 비 L) + 입력 주사기 + 출력 실린더로 만든 손 유압 프레스(압화 · 눌러 접기용)를 설계한다. 작동 압력 p = F L/A₁ 이 호스의 파열 압력의 1/4 이하(안전 계수 4)가 되도록 손잡이 비와 입력 힘을 정하고, 출력 힘 F_o = η p A₂ 를 측정한다.',
    q:'손으로 몇 N 을 눌러야 몇 N 의 힘이 나올까? 호스가 터지지 않으려면 지레 비를 얼마까지 올려도 될까?',
    why:'힘이 커지는 장치는 <b>위험도 함께 커집니다</b>. 안전 계수라는 공학의 핵심 개념을 계산으로 다루며, 발명이 「얼마나 강한가」가 아니라 「얼마나 안전하게 강한가」임을 배웁니다.',
    link:'원리② 파스칼(3번 탭) · I06 · 지레 · 안전 계수 · 압력용기 안전.',
    cap:'손잡이(지레)로 입력 주사기를 누른다(왼쪽) → 작동 압력과 호스 정격 비교(가운데) → 출력 힘과 안전 계수(오른쪽). 손 힘 × 지레비(왼쪽 아래) · p = F/A ≤ p파열/4(가운데 아래) · 안전 계수 SF ≥ 4(오른쪽 아래)',
    parts:[['지레 손잡이','길이비 L = 손 팔/입력 팔','입력 힘 F_in = F·L','손으로 누른 힘이 입력 주사기에서 L 배가 된다.'],
           ['입력 주사기','단면 A₁ 5 cm²','압력 p = F_in/A₁','입력 단면이 작을수록 같은 힘에서 압력이 높다.'],
           ['출력 실린더','단면 A₂ 30 cm²','F_o = η p A₂','면적비 6 → 힘이 6 배 증폭(손잡이 비 별도).'],
           ['호스 · 이음','파열 압력 p_b','제조사 정격 · 예시 1.2 MPa','실제 값은 정격표로 확인. 안전 계수 4 이상 필요.'],
           ['안전 장치','I06 의 릴리프 밸브','p_open ≤ p_b/4','과압이 걸리면 먼저 열려 사고를 막는다.'],
           ['보호구 · 규칙','보안경 · 손 끼임 방지','시험은 교사 감독','프레스 부위에 손가락이 끼지 않게 덮개 · 가림막을 설치한다.']],
    budget:[['주사기 · 실린더','1 세트','약 1만 원','—'],['호스 · 이음','1 세트','약 5천 원','—'],['손잡이 재료(판 · 핀)','1 세트','약 5천 원','—'],['보안경 · 장갑','1','약 3천 원','—'],['압력 센서(선택)','1','약 5천 원','마노미터']],
    steps:['지레비 L, 입력 단면 A₁ 을 정하고 목표 손 힘 F(20 ~ 100 N)에서 작동 압력 p 를 계산한다.','호스 정격 p_b 로 안전 계수 SF = p_b/p 를 구해 4 미만이면 L 또는 A₁ 을 조정한다.','출력 힘 F_o = η p A₂ 를 계산하고 저울 위에서 눌러 실측한다(낮은 입력 힘부터).','릴리프 밸브(I06)를 달아 열림 압력을 p_b/4 이하로 맞추고 동작을 확인한다.','프레스 용도(압화 · 종이 눌러 접기)로 시연하고 안전 점검표를 작성한다.'],
    vars:['손 힘 F · 지레비 L','작동 압력 p · 출력 힘 F_o · 안전 계수 SF','마찰 · 호스 정격 · 누수'],
    predict:[['F 60 N · L 2','p = '+fx(a.p/1000,0)+' kPa · F_o = '+fx(a.Fo,0)+' N · SF = '+fx(a.SF,1),a.ok?'안전':'부족'],
             ['F 100 N · L 2','p = '+fx(b.p/1000,0)+' kPa · SF = '+fx(b.SF,1),b.ok?'안전':'부족(4 미만)'],
             ['F 100 N · L 4','p = '+fx(c.p/1000,0)+' kPa · SF = '+fx(c.SF,1),'지레비를 키우면 압력이 급증 → 위험'],
             ['F 40 N · L 3','p = '+fx(d.p/1000,0)+' kPa · F_o = '+fx(d.Fo,0)+' N · SF = '+fx(d.SF,1),d.ok?'안전':'부족']],
    data:{cols:['F (N)','L','p (kPa)','F_o (N)','SF','판정'],
          rows:[[40,2],[60,2],[100,2],[100,3],[100,4],[150,4]].map(function(q){ var o=i08(q[0],q[1]); return [q[0],q[1],fx(o.p/1000,0),fx(o.Fo,0),fx(o.SF,1),o.ok?'안전':'위험']; })},
    analysis:'측정한 출력 힘과 이론값의 차이(효율 η)를 계산하고 F–F_o 직선을 확인한다. 안전 계수가 4 미만인 설정을 이론으로 식별하고 실제 시험에서는 피한다. 릴리프 밸브의 열림 압력이 안전 계수를 높이는 효과를 정리한다.',
    special:['🔧 발명 설명서',[['발명 이름','「안전 계수 4 손 유압 프레스」'],['핵심 아이디어','지레비 · 면적비 설계와 릴리프 밸브로 과압 방지'],['기존 방법과 차이','안전 계수를 계산으로 설계 · 시험 가능'],['한계','교육용 · 소형 · 압력 한계 · 실제 공업용 프레스와 다름']]],
    fails:[['호스가 부푼다','작동 압력이 정격에 근접 — 즉시 중단하고 설계 변경'],['출력 힘이 작다','공기 · 마찰 · 누수 점검 · 면적비 확인'],['손가락이 끼인다','가림막 · 덮개 · 천천히 시연']],
    up:['<b>I06</b> — 안전 밸브.','<b>I01</b> — 유압 집게.','<b>C02</b> — 유압 로봇 팔.'],
    next:['원리② 파스칼의 원리',3],
    eval:[['설계 계산','압력 · 힘 · SF'],['안전 의식','SF ≥ 4 · 보호구'],['시험','출력 힘 측정'],['한계 서술','교육용 명시']],
    tip:'발명 설명서의 첫 줄을 「안전 계수 4 이상」으로 쓰면 심사위원에게 가장 믿음을 줍니다.' });
})();
SIMS.I08={ q:'손 힘과 지레비를 바꾸면 작동 압력, 출력 힘, 안전 계수는 어떻게 달라질까?',
  a:{nm:'손으로 누르는 힘 F',min:20,max:200,step:10,val:80,unit:'N',d:0}, b:{nm:'지레 비 L',min:1,max:6,step:0.5,val:2,unit:'',d:1},
  cap1:'지레로 입력 주사기를 눌러 출력 실린더가 물건을 누릅니다. 막대는 작동 압력과 호스 정격 대비(초록 = 안전 계수 4 이상, 빨강 = 부족).',
  cap2:'📊 손 힘에 따른 작동 압력(지레비별). 점선 = 안전 상한(호스 정격 1.2 MPa 의 1/4 = 300 kPa).',
  note:'모형 : 입력 단면 A₁ = 5 cm² · 출력 단면 A₂ = 30 cm² · p = F L/A₁ · F_o = η p A₂ (η = 0.85) · 호스 파열 압력 1.2 MPa(예시, 실제는 제조사 자료) · SF = p_b/p · SF ≥ 4 권장.',
  anim:function(ctx,w,h,t,F,L,S){ var o=i08(F,L), top=40, bot=h-30, ph=(t%3)/3, u=ph<0.5?ph*2:1-(ph-0.5)*2, bx=w*0.12; ctx.strokeStyle=COL.white; ctx.lineWidth=7; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(bx,bot-30); ctx.lineTo(bx+110,bot-30-u*20-10); ctx.stroke(); ctx.lineWidth=1; ctx.lineCap='butt'; cvArrow(ctx,bx+100,bot-110,bx+100,bot-60-u*20,COL.amber,3); cvText(ctx,'손 힘 '+F+' N',bx+110,bot-114,COL.amber,'bold 11.5px system-ui,sans-serif');
    ctx.fillStyle='rgba(56,189,248,.3)'; ctx.fillRect(bx+60,bot-70,16,40); cvLine(ctx,[[bx+76,bot-50],[w*0.5,bot-50]],COL.blue,4); ctx.fillStyle='rgba(56,189,248,.3)'; ctx.fillRect(w*0.5,bot-100,50,70); ctx.strokeStyle=COL.axis2; ctx.strokeRect(w*0.5,bot-100,50,70); ctx.fillStyle=COL.white; ctx.fillRect(w*0.5-2,bot-104+u*3,54,6); ctx.fillStyle='#94a3b8'; ctx.fillRect(w*0.5-8,bot-22,66,12);
    var sx=w*0.72, bw=40, mx=o.pb/1000*1.05, h1=(bot-top)*Math.min(1,o.p/1000/mx), h2=(bot-top)*o.pb/1000/mx; ctx.fillStyle=o.ok?COL.ok:COL.grav; ctx.fillRect(sx,bot-h1,bw,h1); ctx.fillStyle='rgba(148,163,184,.4)'; ctx.fillRect(sx+bw+12,bot-h2,bw,h2); ctx.strokeStyle=COL.axis2; ctx.strokeRect(sx,top,bw,bot-top); ctx.strokeRect(sx+bw+12,top,bw,bot-top); cvText(ctx,(o.p/1000).toFixed(0)+' kPa',sx+bw/2,bot-h1-6,COL.text,'bold 11px system-ui,sans-serif','center'); cvText(ctx,'정격',sx+bw*1.5+12,bot-h2-6,COL.tick,'11px system-ui,sans-serif','center');
    cvText(ctx,'압력 '+(o.p/1000).toFixed(0)+' kPa · 출력 '+o.Fo.toFixed(0)+' N(≈'+o.kg.toFixed(0)+' kg중) · 안전 계수 '+o.SF.toFixed(1)+' → '+(o.ok?'안전 ✔':'위험 ✖'),12,18,o.ok?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,F,L,S){ var P=makePlot(ctx,w,h,{xmin:20,xmax:200,ymin:0,ymax:1500,xlabel:'손 힘 F (N)',ylabel:'작동 압력 (kPa)',title:'손 힘 → 작동 압력 (지레비별)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)});
    plotLine(ctx,P,[[20,1200],[200,1200]],COL.grav,1.6,[6,4]); plotLine(ctx,P,[[20,300],[200,300]],COL.ok,1.4,[4,4]); [[1,COL.dim],[2,COL.blue],[4,COL.amber]].forEach(function(q){ plotLine(ctx,P,[[20,i08(20,q[0]).p/1000],[200,i08(200,q[0]).p/1000]],q[1],1.4,[5,3]); }); plotLine(ctx,P,[[20,i08(20,L).p/1000],[200,i08(200,L).p/1000]],COL.white,2.6); plotPoints(ctx,P,[[F,i08(F,L).p/1000]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['L 1',COL.dim],['L 2',COL.blue],['L 4',COL.amber],['지금',COL.white],['정격 1.2 MPa',COL.grav],['SF 4',COL.ok]]); },
  kv:function(F,L,S){ var o=i08(F,L); return [['작동 압력',(o.p/1000).toFixed(0)+' kPa','a'],['출력 힘',o.Fo.toFixed(0)+' N ('+o.kg.toFixed(0)+' kg중)','g'],['안전 계수',o.SF.toFixed(1),'v2'],['SF ≥ 4 ?',o.ok?'예':'아니오'],['권장 최대 압력',(o.pb/4000).toFixed(0)+' kPa','r']]; } };

/* ── I09 : 수면 부이 센서(상하 진동 주기) ───────────────────────────── */
function i09(D,m){ var A=Math.PI*Math.pow(D/200,2), mk=m/1000, d=mk/(RHO_W*A)*100, T=2*Math.PI*Math.sqrt(mk/(RHO_W*G*A)), Hb=Math.max(2*D, d*3), KG=Hb*0.35, KB=d/2, BM=D*D/(16*d), GM=KB+BM-KG; return {A:A,d:d,T:T,GM:GM,stable:GM>0,Hb:Hb}; }
(function(){ var a=i09(8,300), b=i09(16,300), c=i09(8,800), d=i09(5,150);
  mkP({ id:'I09', t:'수면 부이 센서 — 상하 진동 주기와 안정 설계', icon:'🔴', type:'발명 · 센서', lv:3, dur:'3 주', cost:'약 1 ~ 2만 원',
    one:'원통형 부이(지름 D, 질량 m)를 수면에 띄워 살짝 눌렀다 놓았을 때의 상하 진동(heave) 주기 T = 2π√(m/(ρ g A))를 측정하고 설계 변수(D · m)에 따른 흔들림과 안정을 분석한다. 파도 · 센서 부착용 수면 부이의 기초 설계 연습이다.',
    q:'부이를 더 무겁게 하면 진동은 빨라질까 느려질까? 지름이 크면 파도에 덜 흔들릴까?',
    why:'부력은 <b>용수철과 같은 복원력</b>을 만듭니다(변위 x 에 −ρgA x). 그래서 부이는 단진동하며 주기가 질량 · 단면적으로 정해집니다. 파도의 주기와 부이의 고유 주기가 같아지면 공명이 일어나므로 설계 시 반드시 고려합니다.',
    link:'원리③ 아르키메데스(4번 탭) · 원리④ 안정(5번 탭) · 단진동 · 공명 · 해양 관측 부이.',
    cap:'부이를 살짝 누른다(왼쪽) → 부력이 복원력이 되어 상하로 진동(가운데) → 주기 대 질량 · 지름(오른쪽). 부이 지름 · 질량(왼쪽 아래) · T = 2π√(m/(ρgA))(가운데 아래) · 안정 · 상하 진동(오른쪽 아래)',
    parts:[['부이 몸통','원통(병 · 파이프)','지름 D · 질량 m','밀폐 방수 · 바닥에 추 · 지름을 바꿔 시험한다.'],
           ['추(바닥)','모래 · 금속','무게중심 낮추기','추를 바닥에 두면 KG 가 낮아져 수직으로 선다(안정).'],
           ['복원력','−ρ g A x','용수철 상수 k = ρgA','부이를 눌러 잠긴 깊이가 늘면 부력이 늘어나 위로 되돌린다.'],
           ['주기 측정','영상 · 스톱워치','10 번 진동 시간','10 번 진동 시간을 재서 10 으로 나눈다.'],
           ['센서(선택)','IMU · 가속도','진동 기록','방수 센서로 상하 가속도를 기록해 주기를 구한다.'],
           ['수조 · 파도 시험','저속 파도','공명 확인','손으로 수조를 흔들어 부이의 고유 주기 근처에서 진폭이 커지는지 본다.']],
    budget:[['원통(병 · 파이프)','3 가지','약 3천 원','—'],['추 · 접착제','1 세트','약 3천 원','—'],['스톱워치 · 스마트폰','1','보유','—'],['수조','1','약 5천 원','—'],['IMU(선택)','1','약 5천 원','—']],
    steps:['지름이 다른 부이 3 개의 질량 m 과 지름 D 를 재고 이론 주기 T 를 계산한다.','수조에 띄워 약간(1 cm) 눌렀다 놓고 10 번 진동하는 시간을 3 회 재어 T 를 구한다.','질량을 바꿔(추 추가) T 와 m 의 관계(T ∝ √m)를 확인한다.','지름을 바꿔 T 와 D 의 관계(T ∝ 1/D)를 확인한다.','수조를 흔들어 공명 조건(파도 주기 = T)을 확인하고 부이 설계 기준을 정리한다.'],
    vars:['부이 지름 D · 질량 m','진동 주기 T · 안정(GM)','추 위치 · 감쇠 · 수조 크기'],
    predict:[['D 8 cm · m 300 g','T = '+fx(a.T,2)+' s · 흘수 '+fx(a.d,1)+' cm · GM = '+fx(a.GM,1)+' cm','주기 약 0.5 s'],
             ['D 16 cm · m 300 g','T = '+fx(b.T,2)+' s · GM = '+fx(b.GM,1)+' cm','지름이 2 배 → 주기 1/2'],
             ['D 8 cm · m 800 g','T = '+fx(c.T,2)+' s','질량이 2.7 배 → 주기 √2.7 배'],
             ['D 5 cm · m 150 g','T = '+fx(d.T,2)+' s · '+(d.stable?'안정':'불안정(추 필요)'),'가늘고 가벼우면 불안정할 수 있다']],
    data:{cols:['D (cm)','m (g)','T 이론 (s)','흘수 (cm)','GM (cm)'],
          rows:[[8,200],[8,300],[8,800],[12,300],[16,300],[5,150]].map(function(q){ var o=i09(q[0],q[1]); return [q[0],q[1],fx(o.T,2),fx(o.d,1),fx(o.GM,1)]; })},
    analysis:'T² 대 m 과 T 대 1/D 의 직선성을 확인하고 이론과의 차이를 부가질량(물이 함께 움직임 · 약 20 ~ 50 %) 효과로 설명한다. 공명 실험에서 진폭이 최대가 되는 구동 주기와 T 의 일치를 평가하고 실제 해양 관측 부이 설계에서 고유 주기를 파도 주기와 어긋나게 하는 이유를 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「공명을 피하는 수면 부이」'],['핵심 아이디어','T = 2π√(m/ρgA) 로 파도와 어긋나는 주기 설계'],['기존 방법과 차이','계산으로 지름 · 질량을 선택'],['한계','부가질량 · 감쇠 · 단순 원통 · 수조 시험']]],
    fails:[['부이가 눕는다','추를 바닥에 · 지름 대 높이 조정(5번 탭 안정)'],['주기가 이론보다 길다','부가질량 때문 — 보정 계수 도입'],['진동이 금방 멈춘다','감쇠(점성 · 파) — 주기 측정은 처음 몇 번만']],
    up:['<b>R07</b> — 안정과 흔들림 주기.','<b>I02</b> — 수심계.','<b>C09</b> — 호일 배.'],
    next:['원리④ 뜨기 · 안정',5],
    eval:[['정량 분석','T–m · T–D 관계'],['이론 연결','단진동 · 부력'],['설계','공명 회피'],['한계 서술','부가질량 · 감쇠']],
    tip:'주기가 질량의 제곱근에 비례한다는 사실을 스톱워치 하나로 확인하면 그래프 한 장이 큰 설득력을 가집니다.' });
})();
SIMS.I09={ q:'부이의 지름과 질량을 바꾸면 상하 진동 주기와 안정(GM)은 어떻게 달라질까?',
  a:{nm:'부이 지름 D',min:4,max:20,step:1,val:8,unit:'cm',d:0}, b:{nm:'부이 질량 m',min:50,max:1200,step:50,val:300,unit:'g',d:0},
  cap1:'수면의 부이가 상하로 진동합니다. 부력이 복원력이므로 지름이 클수록 빠르고 질량이 클수록 느립니다. 오른쪽 점은 한 주기의 위치 기록.',
  cap2:'📊 위 : 질량에 따른 주기(지름별) — T ∝ √m. 아래 : 지름에 따른 주기 — T ∝ 1/D.',
  note:'모형 : 복원력 −ρ g A x → T = 2π√(m/(ρ g A)) · 흘수 d = m/(ρA) · 균일 원통 · KG = 0.35 H(H = 높이) · BM = D²/(16 d) · 부가질량 · 점성 감쇠는 무시.',
  anim:function(ctx,w,h,t,D,m,S){ var o=i09(D,m), wl=h*0.5, bw=Math.min(100,D*5), hp=o.Hb*3, dp=o.d*3, x=Math.sin(2*Math.PI*t/o.T)*10*Math.exp(-t/20), cx=w*0.3;
    ctx.fillStyle='rgba(56,189,248,.25)'; ctx.fillRect(0,wl,w,h-wl); ctx.strokeStyle='rgba(125,211,252,.7)'; ctx.beginPath(); ctx.moveTo(0,wl); ctx.lineTo(w,wl); ctx.stroke();
    ctx.fillStyle='rgba(251,191,36,.5)'; ctx.fillRect(cx-bw/2,wl-hp+dp+x,bw,hp); ctx.strokeStyle=COL.amber; ctx.strokeRect(cx-bw/2,wl-hp+dp+x,bw,hp); ctx.fillStyle=COL.grav; ctx.fillRect(cx-bw/2+6,wl+dp+x-10,bw-12,8);
    var gx=w*0.55, gw=w*0.38; ctx.strokeStyle=COL.axis2; ctx.beginPath(); ctx.moveTo(gx,wl); ctx.lineTo(gx+gw,wl); ctx.stroke(); ctx.strokeStyle=COL.blue; ctx.lineWidth=2; ctx.beginPath(); for(var i=0;i<=120;i++){ var tt=i/120*Math.min(t,10), yy=Math.sin(2*Math.PI*tt/o.T)*30*Math.exp(-tt/20); var px=gx+gw*i/120*(Math.min(t,10)/10); if(i===0) ctx.moveTo(px,wl-yy); else ctx.lineTo(px,wl-yy); } ctx.stroke(); ctx.lineWidth=1;
    cvText(ctx,'주기 T = '+o.T.toFixed(2)+' s · 흘수 '+o.d.toFixed(1)+' cm · GM '+o.GM.toFixed(1)+' cm → '+(o.stable?'안정':'불안정'),12,18,o.stable?COL.ok:COL.grav,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,D,m,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:50,xmax:1200,ymin:0,ymax:3,ylabel:'T (s)',title:'질량 → 주기 (T ∝ √m)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ [[6,COL.ok],[12,COL.blue],[20,COL.amber]].forEach(function(q){ var pts=[]; for(i=50;i<=1200;i+=50) pts.push([i,i09(q[0],i).T]); plotLine(ctx,P,pts,q[1],1.4,[4,3]); }); var pts=[]; for(i=50;i<=1200;i+=50) pts.push([i,i09(D,i).T]); plotLine(ctx,P,pts,COL.white,2.6); plotPoints(ctx,P,[[m,i09(D,m).T]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['D 6',COL.ok],['D 12',COL.blue],['D 20',COL.amber],['지금',COL.white]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:4,xmax:20,ymin:0,ymax:3,xlabel:'지름 D (cm)',ylabel:'T (s)',title:'지름 → 주기 (T ∝ 1/D)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ var pts=[]; for(i=4;i<=20;i+=0.5) pts.push([i,i09(i,m).T]); plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,[[D,i09(D,m).T]],COL.amber,7); }); },
  kv:function(D,m,S){ var o=i09(D,m); return [['단면적 A',(o.A*1e4).toFixed(1)+' cm²','a'],['흘수',o.d.toFixed(1)+' cm','g'],['주기 T',o.T.toFixed(2)+' s','v2'],['GM',o.GM.toFixed(1)+' cm'],['판정',o.stable?'안정':'불안정','r']]; } };

/* ── I10 : 사이펀 자동 배수기 ───────────────────────────────────────── */
function i10(dh,d){ var A=Math.PI*Math.pow(d/2000,2), v=0.6*Math.sqrt(2*G*dh/100), Q=A*v*1000*60, V=20, t=V/Q, ok=true; return {A:A,v:v,Q:Q,t:t,hmax:9.0}; }
(function(){ var a=i10(30,8), b=i10(60,8), c=i10(30,16), d=i10(100,6);
  mkP({ id:'I10', t:'사이펀 자동 배수기 — 높이 차가 만드는 흐름', icon:'🪣', type:'발명 · 장치', lv:2, dur:'2 주', cost:'약 1 ~ 2만 원',
    one:'물통과 낮은 곳을 호스로 연결한 사이펀(펌프 없는 배수)을 설계해 수위차 Δh 와 호스 지름 d 에 따른 유량 Q = C_d A √(2gΔh) 와 20 L 배수 시간을 예측하고 측정한다. 호스 최고점 높이의 한계(대기압이 받쳐 주는 약 10 m 이하)를 설명한다.',
    q:'수위차를 4 배로 하면 유량은 몇 배가 될까? 호스를 굵게 하면 배수 시간은 얼마나 줄까?',
    why:'사이펀은 <b>펌프 없이 압력 차이로 물을 옮기는</b> 간단한 장치로, 양식장 · 수족관 · 농업 용수에 쓰입니다. 정수압과 베르누이(토리첼리) 속력 √(2gΔh) 를 직접 응용하고, 대기압이 만드는 높이 한계를 이해할 수 있습니다.',
    link:'원리① 압력과 깊이(2번 탭) · R03(토리첼리) · 대기압 · 유량(연속 방정식) · 농업 · 수족관.',
    cap:'높은 물통과 낮은 배수구를 호스로 연결(왼쪽) → 수위차가 유속을 만든다(가운데) → 수위차 대 유량(오른쪽). 수위차 Δh(왼쪽 아래) · Q = C_d A √(2gΔh)(가운데 아래) · 높이 한계 약 10 m(오른쪽 아래)',
    parts:[['물통 + 수위','높이 H','20 L 물통','수위가 내려가면 Δh 가 줄어 유량도 줄어든다. 일정 수위로 시험.'],
           ['호스','투명 호스 · 지름 d','길이 2 ~ 3 m','굵을수록 유량이 크다. 기포 · 꺾임 없이 시작한다(프라이밍).'],
           ['수위차 Δh','입구 수면 − 출구','cm','출구가 낮을수록 속력이 커진다. 속력 v = C_d √(2gΔh).'],
           ['최고점 높이','수면 위 호스 최고점','약 10 m 이하(이론)','대기압이 물 기둥을 받쳐 주는 한계(약 10.3 m). 실제는 기포 때문에 훨씬 낮다.'],
           ['유량 측정','메스실린더 · 시간','Q = 부피/시간','1 분 동안 받은 물의 양으로 Q 를 구한다. 3 회 평균.'],
           ['자동 정지','수위 센서 · 공기 유입','수위가 낮아지면 멈춤','입구가 공기에 닿으면 흐름이 멈춘다 — 자동 정지 원리.']],
    budget:[['투명 호스 3 m(2 종 지름)','1 세트','약 5천 원','—'],['물통 20 L','1','약 5천 원','—'],['메스실린더 · 스톱워치','1','보유','—'],['클립 · 고정대','1','약 2천 원','—'],['색소','1','약 1천 원','—']],
    steps:['호스에 물을 가득 채워(프라이밍) 양끝을 막은 채 입구를 물통에, 출구를 낮은 곳에 놓고 연다.','수위차 Δh = 10, 20, 40, 80 cm 로 바꿔 1 분 동안 나온 물의 부피(Q)를 잰다(3 회 평균).','이론 Q = C_d A √(2gΔh) 와 비교하고 C_d(약 0.6) 를 구한다.','호스 지름 d 를 바꿔(6 mm · 10 mm) Q 의 비를 단면적 비(d²)와 비교한다.','자동 정지(입구 공기 노출) 현상을 확인하고 안전하게 사용할 수 있는 높이 한계를 정리한다.'],
    vars:['수위차 Δh · 호스 지름 d','유량 Q · 배수 시간','호스 길이 · 기포 · 마찰'],
    predict:[['Δh 30 cm · d 8 mm','v = '+fx(a.v,2)+' m/s · Q = '+fx(a.Q,2)+' L/분 · 20 L 배수 '+fx(a.t,0)+' 분','기준'],
             ['Δh 60 cm · d 8 mm','Q = '+fx(b.Q,2)+' L/분(약 '+fx(b.Q/a.Q,2)+' 배)','Δh 가 2 배 → Q 는 √2 배'],
             ['Δh 30 cm · d 16 mm','Q = '+fx(c.Q,2)+' L/분(약 '+fx(c.Q/a.Q,1)+' 배)','지름 2 배 → 단면적 4 배'],
             ['Δh 100 cm · d 6 mm','Q = '+fx(d.Q,2)+' L/분 · 20 L 배수 '+fx(d.t,0)+' 분','가늘면 배수가 오래 걸린다']],
    data:{cols:['Δh (cm)','d (mm)','v (m/s)','Q (L/분)','20 L 배수 (분)'],
          rows:[[10,8],[20,8],[40,8],[80,8],[40,12],[40,16]].map(function(q){ var o=i10(q[0],q[1]); return [q[0],q[1],fx(o.v,2),fx(o.Q,2),fx(o.t,0)]; })},
    analysis:'Q 대 √Δh 가 직선인지 확인하고 기울기에서 C_d A 를 구해 C_d 를 추정한다. Q ∝ d² 의 확인과 마찰 손실(호스가 길수록 Q 감소)의 영향을 논의하고, 이론적 높이 한계 10.3 m 와 실제 한계(기포 때문에 수 m)를 구별해 서술한다.',
    special:['🔧 발명 설명서',[['발명 이름','「전기 없는 자동 배수기」'],['핵심 아이디어','수위차로 흐르는 사이펀 + 수위가 낮으면 자동 정지'],['기존 방법과 차이','펌프 · 전기 없이 배수 속도를 Δh 로 설계'],['한계','프라이밍 필요 · 높이 한계 · 마찰 · 기포']]],
    fails:[['흐름이 멈춘다','호스에 기포 — 다시 물을 채워 시작(프라이밍)'],['유량이 이론보다 작다','C_d(0.6) · 마찰 · 호스 꺾임 점검'],['출구가 높아져 멈춘다','출구가 입구 수면보다 낮아야 흐른다']],
    up:['<b>R03</b> — 구멍 물줄기.','<b>I07</b> — 호스 수평계.','<b>C10</b> — 수도 탑.'],
    next:['원리① 압력과 깊이',2],
    eval:[['정량 분석','Q–√Δh 관계'],['이론 연결','토리첼리 · 대기압'],['설계','지름 · 높이 선택'],['안전','물 · 낮은 높이']],
    tip:'「출구가 입구 수면보다 낮아야 흐른다」는 한 문장이 사이펀의 모든 오해를 풀어 줍니다.' });
})();
SIMS.I10={ q:'수위차와 호스 지름을 바꾸면 사이펀의 유속 · 유량 · 20 L 배수 시간은 어떻게 달라질까?',
  a:{nm:'수위차 Δh',min:5,max:120,step:5,val:30,unit:'cm',d:0}, b:{nm:'호스 지름 d',min:4,max:20,step:1,val:8,unit:'mm',d:0},
  cap1:'높은 물통에서 낮은 곳으로 호스가 이어져 있습니다. 파란 입자가 흐르는 속도는 √(2gΔh)에 비례합니다. 점선 = 출구 높이.',
  cap2:'📊 위 : 수위차에 따른 유량(지름별, Q ∝ √Δh). 아래 : 수위차에 따른 20 L 배수 시간.',
  note:'모형 : v = C_d √(2gΔh) (C_d = 0.6, 마찰 포함 어림) · Q = A v · 물통 20 L 의 일정 수위 가정 · 이론 높이 한계 약 10.3 m(대기압/ρg), 실제는 용존 기체 때문에 수 m 이하. 호스 길이 · 기포는 단순화.',
  anim:function(ctx,w,h,t,dh,d,S){ var o=i10(dh,d), top=36, bot=h-24, tx=w*0.16, tw=70, sc=Math.min(2.2,(bot-top-40)/Math.max(dh,60)), yt=top+30, yo=yt+dh*sc*0.9;
    ctx.fillStyle='rgba(56,189,248,.3)'; ctx.fillRect(tx-tw/2,yt,tw,50); vessel(ctx,tx-tw/2,yt-20,tw,70); cvText(ctx,'물통',tx,yt-26,COL.tick,'11px system-ui,sans-serif','center');
    var x2=w*0.62; ctx.strokeStyle=COL.blue; ctx.lineWidth=Math.max(2,d*0.5); ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(tx-10,yt+25); ctx.lineTo(tx-10,yt-34); ctx.lineTo(tx+40,yt-34); ctx.lineTo(tx+40,yo); ctx.lineTo(x2,yo); ctx.stroke(); ctx.lineWidth=1; ctx.lineCap='butt';
    var n=16, i; for(i=0;i<n;i++){ var p=((t*o.v*0.3+i/n)%1); ctx.fillStyle='rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(tx+40+(x2-tx-40)*p,yo,2.2,0,6.283); ctx.fill(); } ctx.strokeStyle=COL.dim; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(tx-tw/2,yo); ctx.lineTo(x2+30,yo); ctx.stroke(); ctx.setLineDash([]); cvLine(ctx,[[tx+tw/2+16,yt],[tx+tw/2+16,yo]],COL.ok,1.6); cvText(ctx,'Δh '+dh+' cm',tx+tw/2+22,(yt+yo)/2,COL.ok,'bold 11.5px system-ui,sans-serif');
    ctx.fillStyle='rgba(56,189,248,.35)'; ctx.fillRect(x2,yo,60,Math.min(60,(t%10)*6)); ctx.strokeStyle=COL.axis2; ctx.strokeRect(x2,yo,60,60);
    cvText(ctx,'유속 v = '+o.v.toFixed(2)+' m/s · 유량 Q = '+o.Q.toFixed(2)+' L/분 · 20 L 배수 '+o.t.toFixed(0)+' 분',12,18,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,dh,d,S){ var hh=Math.floor(h*0.5), i;
    subPlot(ctx,0,0,w,hh,{xmin:5,xmax:120,ymin:0,ymax:Math.max(8,i10(120,16).Q*1.05),ylabel:'Q (L/분)',title:'수위차 → 유량 (Q ∝ √Δh)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [[6,COL.ok],[12,COL.blue],[16,COL.amber]].forEach(function(q){ var pts=[]; for(i=5;i<=120;i+=5) pts.push([i,i10(i,q[0]).Q]); plotLine(ctx,P,pts,q[1],1.4,[4,3]); }); var pts=[]; for(i=5;i<=120;i+=5) pts.push([i,i10(i,d).Q]); plotLine(ctx,P,pts,COL.white,2.6); plotPoints(ctx,P,[[dh,i10(dh,d).Q]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['d 6',COL.ok],['d 12',COL.blue],['d 16',COL.amber],['지금',COL.white]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:5,xmax:120,ymin:0,ymax:Math.min(60,i10(5,d).t*1.05),xlabel:'수위차 Δh (cm)',ylabel:'20 L 배수 (분)',title:'수위차 → 배수 시간',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ var pts=[]; for(i=5;i<=120;i+=5) pts.push([i,Math.min(60,i10(i,d).t)]); plotLine(ctx,P,pts,COL.ok,2.4); plotPoints(ctx,P,[[dh,Math.min(60,i10(dh,d).t)]],COL.amber,7); }); },
  kv:function(dh,d,S){ var o=i10(dh,d); return [['유속 v',o.v.toFixed(2)+' m/s','a'],['유량 Q',o.Q.toFixed(2)+' L/분','g'],['20 L 배수 시간',o.t.toFixed(0)+' 분','v2'],['호스 단면적',(o.A*1e4).toFixed(2)+' cm²'],['이론 높이 한계','약 10.3 m(실제 수 m 이하)','r']]; } };
