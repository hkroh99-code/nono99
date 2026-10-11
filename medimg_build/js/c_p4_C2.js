/* ═══════════════════════════════════════════════════════════════════════════
   창의 프로젝트 C06 ~ C10 : 선량 인포그래픽 · 조직 모사 팬텀 · 슬라이스 두께 · 창 수준/창 폭 · 검사 대기열
   ═══════════════════════════════════════════════════════════════════════════ */
/** 공용 : PROJ 객체에 도해(FIGS)를 붙여 등록 */
function mkP(o){ o.fig=FIGS[o.id].fig; o.tg=FIGS[o.id].tg; PROJ[o.id]=o; return o; }
function axisFmt(d){ return function(v){ return v.toFixed(d); }; }

/* ── C06 : 선량 인포그래픽 ─────────────────────────────────────────── */
var C06 = { NM:['흉부 X선','치과 파노라마','유방 촬영(2방향)','복부 CT','흉부 CT','두부 CT'], D:[0.1,0.02,0.4,8,7,2], BG:2.4 };
function c06(k,days){ var d=C06.D[k-1]; return {d:d, nat:d/C06.BG*365, ratio:d/(C06.BG/365*days)}; }
(function(){ var a=c06(1,1), b=c06(4,1), c=c06(2,1);
  mkP({ id:'C06', t:'선량 인포그래픽 — 방사선량을 「일상의 양」으로 번역하기', icon:'📊', type:'창의 · 인포그래픽', lv:1, dur:'1 주', cost:'약 0 ~ 1만 원',
    one:'검사별 유효선량(mSv)을 「자연방사선 며칠 분」 「바나나 몇 개」 같은 일상의 비교로 바꿔 포스터 · 웹 인포그래픽으로 만든다. 과장도 축소도 하지 않는 정직한 시각화가 목표이다.',
    q:'같은 방사선량도 어떻게 표현하느냐에 따라 사람들이 느끼는 위험이 달라진다. 정확하면서 겁주지 않는 표현은 무엇일까?',
    why:'선량 숫자(mSv)는 일반인에게 낯섭니다. <b>자연방사선(연 약 2.4 mSv)</b>과 비교하면 크기 감이 생깁니다. 숫자를 그림으로 옮기는 일은 과학 소통의 핵심 기술입니다.',
    link:'원리⑥ 품질 · 선량 · 안전(6번 탭) · 7번 탭 · 비례와 단위 환산 · 시각화 디자인.',
    cap:'검사별 선량 막대(왼쪽, 로그 눈금) → 자연방사선 일 분량 환산(가운데) → 연간 자연방사선 2.4 mSv 기준(오른쪽). 선량표(왼쪽 아래) · 환산(가운데 아래) · 기준(오른쪽 아래)',
    parts:[['선량 막대','검사별 mSv · 로그 눈금','값이 100 배 차이','로그 눈금을 쓰면 0.02 ~ 8 mSv 를 한 그림에 담을 수 있다. 눈금을 반드시 표시한다.'],
           ['일 분량 환산','선량 ÷ (2.4/365 mSv)','자연방사선 며칠 분','흉부 X선 0.1 mSv ≈ 약 15 일치 자연방사선 : 직관적 비교.'],
           ['기준선','연간 자연방사선 약 2.4 mSv','전 세계 평균 어림','지역 · 고도 · 집 구조에 따라 크게 달라진다고 주석을 단다.'],
           ['자료 출처','UNSCEAR · 보건당국 · 학회 자료','연도 · 범위 표기','선량은 장비 · 환자에 따라 범위가 크다 → 대표값과 범위를 함께.'],
           ['디자인','색 · 아이콘 · 이야기','과장 금지','빨강 경고색을 남용하지 않는다. 「위험」보다 「크기 감」을 목표로.'],
           ['공정한 표현','이익과 위험을 함께','검사의 이익 표기','필요한 검사의 이익이 선량의 위험보다 큼을 한 줄 넣는다.']],
    budget:[['A3 용지 · 색 펜','1 세트','약 5천 원','웹 · 태블릿'],['디자인 도구(Canva 등)','1','무료','—'],['선량 자료(공식 보고서)','—','무료','—'],['인쇄','1 장','약 1천 원','화면 발표'],['—','—','—','—']],
    steps:['검사 6 종의 대표 유효선량과 범위를 공신력 있는 자료(UNSCEAR · 학회)에서 찾아 표로 만든다.','자연방사선 연 2.4 mSv 를 일 단위로 환산하고 검사 선량을 「며칠 분」으로 계산한다.','로그 막대와 일 분량 아이콘을 포함한 포스터 초안을 만든다.','친구 10 명에게 보여 주고 「이 검사가 위험하게 느껴지는가」를 5 점 척도로 조사한다.','표현을 고쳐 다시 조사하고(과장 · 축소 여부 점검) 최종 인포그래픽을 완성한다.'],
    vars:['표현 방식(숫자 · 일 환산 · 아이콘)','관람자의 위험 인식 점수','선량 기준값 · 출처'],
    predict:[['흉부 X선 0.1 mSv','자연방사선 약 '+fx(a.ratio*1,0)+' 일치','일 분량 = 0.1 ÷ (2.4/365) ≈ 15 일'],
             ['복부 CT 8 mSv','약 '+fx(b.ratio,0)+' 일치(약 '+fx(b.nat,1)+' 년)','CT 선량은 X선의 수십 배 → 필요할 때만'],
             ['유방 촬영 0.4 mSv','약 '+fx(c.ratio,0)+' 일치','숫자만 보다 환산이 크기를 알려 준다'],
             ['표현 효과(예상)','환산 표시 후 「위험하다」 응답이 줄 가능성','측정 후 검증 : 결과는 설문 의존']],
    data:{cols:['검사','유효선량 mSv','자연방사선 일수','자연방사선 연수'],
          rows:[1,2,3,4,5,6].map(function(k){ var s=c06(k,1); return [C06.NM[k-1],fx(s.d,2),fx(s.ratio,0),fx(s.nat,2)]; })},
    analysis:'설문 점수의 평균 차이(표현 전 vs 후)를 구하고, 그림의 어떤 요소가 크기 감을 가장 잘 전달했는지 서술한다. 선량의 범위(최소~최대)와 대표값의 차이를 그림 속에 어떻게 보였는지 점검한다.',
    special:['🎨 작품 기획서',[['작품 이름','「엑스선 한 번, 자연방사선 며칠?」 — 선량 번역기'],['표현 아이디어','일 달력 위에 검사 선량 칸을 칠해 비교'],['과학 근거','유효선량 mSv · 자연방사선 평균 · 출처 표기'],['전시 구성','포스터 + 비교 설문 + 이익 · 위험 설명문']]],
    fails:[['숫자만 많아 어렵다','일 환산 · 아이콘 하나로 핵심 전달'],['선량이 자료마다 다르다','범위와 대표값 · 출처 연도를 같이 표기'],['겁주는 느낌','경고색 절제 · 검사의 이익 문장 추가']],
    up:['<b>I06</b> — 누적 선량 기록 앱.','<b>I01</b> — 선량 자동 조절 장치.','<b>R09</b> — 선량과 잡음 관계.'],
    next:['품질 · 선량 · 안전',6],
    eval:[['정확성','선량 · 출처 · 환산'],['소통력','크기 감 전달 · 설문'],['공정성','과장 · 축소 없음'],['윤리','이익 · 위험 균형']],
    tip:'「0.1 mSv = 자연방사선 15 일」처럼 한 문장 환산을 포스터 가장 큰 글씨로 쓰면 효과가 큽니다.' });
})();
SIMS.C06={ q:'검사를 고르고 기준 기간을 바꾸면 선량은 자연방사선 며칠 분일까?',
  a:{nm:'검사 종류',min:1,max:6,step:1,val:4,unit:'',d:0,fmt:pick(C06.NM)}, b:{nm:'비교 기간',min:1,max:30,step:1,val:1,unit:'일',d:0},
  cap1:'검사 선량(mSv)을 로그 막대로 보여 줍니다. 선택한 검사가 강조되고, 자연방사선의 일 · 기간 분량이 점선으로 표시됩니다.',
  cap2:'📊 비교 기간 동안 받는 자연방사선(점선)과 선택한 검사 선량. 기간이 길수록 검사 선량의 상대 크기가 작아집니다.',
  note:'모형 : 대표 유효선량(mSv) 흉부 X선 0.1 · 치과 0.02 · 유방 0.4 · 복부 CT 8 · 흉부 CT 7 · 두부 CT 2. 자연방사선 연 2.4 mSv ÷ 365 = 하루 약 0.0066 mSv. 실제 값은 장비 · 환자에 따라 범위가 크며 교육용 대표값이다.',
  anim:function(ctx,w,h,t,k,days,S){ var fr=Math.min(1,t/2), x0=130, bw=w-x0-24, i, lg=function(v){ return (Math.log10(v)+2.2)/3.4; };
    cvText(ctx,'선택 : '+C06.NM[k-1]+' '+C06.D[k-1]+' mSv',12,16,COL.text,'bold 12.5px system-ui,sans-serif');
    for(i=0;i<6;i++){ var y=32+i*((h-60)/6), hh=(h-60)/6-8, sel=(i===k-1), L=Math.max(0,lg(C06.D[i]))*bw*fr; ctx.fillStyle=sel?COL.amber:COL.axis2; ctx.fillRect(x0,y,L,hh); cvText(ctx,C06.NM[i],x0-6,y+hh*0.66,sel?COL.amber:COL.tick,(sel?'bold ':'')+'11.5px system-ui,sans-serif','right'); cvText(ctx,C06.D[i]+' mSv',x0+L+6,y+hh*0.66,COL.text,'11px system-ui,sans-serif'); }
    var nx=x0+Math.max(0,lg(C06.BG/365*days))*bw; ctx.strokeStyle=COL.ok; ctx.setLineDash([5,4]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(nx,26); ctx.lineTo(nx,h-30); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'자연방사선 '+days+'일 = '+(C06.BG/365*days).toFixed(3)+' mSv',nx-4,h-12,COL.ok,'bold 11.5px system-ui,sans-serif','right'); },
  graph:function(ctx,w,h,k,days,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:30,ymin:0,ymax:Math.max(0.3,C06.D[k-1]*1.2),xlabel:'비교 기간 (일)',ylabel:'선량 (mSv)',title:'자연방사선 누적 vs 이 검사 1 회',left:56,xfmt:axisFmt(0),yfmt:axisFmt(2)}), pts=[],i;
    for(i=0;i<=30;i++) pts.push([i,C06.BG/365*i]); plotLine(ctx,P,pts,COL.ok,2.2); plotLine(ctx,P,[[0,C06.D[k-1]],[30,C06.D[k-1]]],COL.amber,2,[6,4]); plotPoints(ctx,P,[[days,C06.BG/365*days]],COL.blue,7); legend(ctx,P.x1-150,P.y1+14,[['자연방사선 누적',COL.ok],['검사 1 회',COL.amber]]); },
  kv:function(k,days,S){ var s=c06(k,days); return [['검사 선량',s.d.toFixed(2)+' mSv','a'],['자연방사선 환산',(s.d/(C06.BG/365)).toFixed(0)+' 일치','g'],['= 연수',s.nat.toFixed(2)+' 년','v2'],['비교 기간 자연방사선',(C06.BG/365*days).toFixed(3)+' mSv'],['이 검사 ÷ 기간 자연',s.ratio.toFixed(1)+' 배','r']]; } };

/* ── C07 : 조직 모사 팬텀 ──────────────────────────────────────────── */
function c07(phi,ca){ var mu=0.206*phi/100+0.0072*ca; return {mu:mu,hu:huOf(mu)}; }
(function(){ var a=c07(90,0), b=c07(60,0), c=c07(90,25), d=c07(90,50);
  mkP({ id:'C07', t:'조직 모사 팬텀 — 우리 집 재료로 만드는 인체 대용품', icon:'🧪', type:'창의 · 제작', lv:2, dur:'2 주', cost:'약 1 ~ 3만 원',
    one:'젤라틴 · 한천 · 스티로폼 · 칼슘 분말 등으로 「물 같은 조직」 「폐 같은 조직」 「뼈 같은 조직」을 만들고, 밀도(채움률)와 칼슘 함량을 바꾸어 영상에서의 밝기(HU 어림)를 조절한다.',
    q:'채움률(밀도)과 칼슘 분말 비율을 바꾸면 조직의 감약이 어떻게 달라지고, 목표 HU 에 맞추려면 어떤 비율이 필요할까?',
    why:'병원은 영상 장비를 검사할 때 <b>팬텀</b>(인체 모형)을 씁니다. 재료를 섞어 목표 밝기에 맞추는 경험은 「CT 값은 밀도와 원소로 결정된다」를 몸으로 이해하는 길입니다.',
    link:'원리② CT(3번 탭) · 밀도 · 질량 감약 · HU · R01 · R02.',
    cap:'칸막이 틀(왼쪽: 채움률 φ) → 조직 모사 칸 비교(가운데: 칼슘 첨가) → 스마트폰 라이트박스 촬영(오른쪽). 채움률(왼쪽 아래) · 칼슘 분말(가운데 아래) · 목표 HU 맞추기(오른쪽 아래)',
    parts:[['칸막이 틀','투명 아크릴 · 종이 상자','칸 6 개','칸마다 재료를 바꿔 한 번에 비교한다. 두께는 같게.'],
           ['기본 재료','젤라틴 · 한천 · 물','물 같은 조직','물 = 0 HU 에 가까운 기준 칸. 거품이 없게 만든다.'],
           ['저밀도 재료','스티로폼 알갱이 · 기포','폐 같은 조직','공기 비율(1−φ)이 클수록 감약이 줄어 밝게(어둡게) 보인다.'],
           ['칼슘 분말','분필 가루 · 칼슘 보충제','뼈 같은 조직','칼슘 함량이 늘면 감약이 급격히 커진다.'],
           ['촬영 도구','스마트폰 + 라이트박스','밝기 측정','같은 거리 · 노출로 촬영하고 ROI 평균 밝기를 읽는다.'],
           ['안전','식품 · 비독성 재료','가루 흡입 주의','칼슘 분말은 마스크를 쓰고 다룬다. 실제 X선은 사용하지 않는다.']],
    budget:[['젤라틴 · 한천','1 봉','약 3천 원','—'],['스티로폼 알갱이','1 봉','약 2천 원','솜'],['분필 가루 · 칼슘','1 통','약 5천 원','—'],['아크릴 칸막이 틀','1','약 8천 원','종이 상자'],['라이트박스','1','약 5천 원','태블릿']],
    steps:['물 기준 칸(φ = 100 %)을 만들어 촬영하고 밝기를 기준값(0 HU 환산)으로 삼는다.','스티로폼 비율을 달리한 칸 5 개(φ = 90, 75, 60, 45, 30 %)를 만들고 촬영한다.','칼슘 분말 비율을 달리한 칸(0, 10, 25, 50 %)을 만들고 촬영한다.','각 칸의 ROI 평균 밝기를 읽어 ln(기준/칸) 로 감약 계수를 구한다.','목표 값(예 : 뼈 같은 칸 약 300 HU 환산)에 맞는 레시피를 정하고 검증 칸을 만든다.'],
    vars:['채움률 φ · 칼슘 분율','ROI 밝기 · 감약 계수 · HU 환산','칸 두께 · 광원 균일도 · 촬영 거리'],
    predict:[['φ = 90 % · 칼슘 0','HU ≈ '+fx(a.hu,0),'물(0 HU)보다 낮다 : 공기 10 % 만큼'],
             ['φ = 60 % · 칼슘 0','HU ≈ '+fx(b.hu,0)+' (폐처럼 낮다)','공기 비율이 크면 낮아진다'],
             ['φ = 90 % · 칼슘 25 %','HU ≈ '+fx(c.hu,0),'칼슘이 늘면 급격히 증가'],
             ['φ = 90 % · 칼슘 50 %','HU ≈ '+fx(d.hu,0)+' (뼈 수준)','50 % 에서 뼈에 가까운 값']],
    data:{cols:['φ(%)','칼슘(%)','μ(cm⁻¹)','HU(어림)'],
          rows:[[100,0],[90,0],[75,0],[60,0],[90,10],[90,25],[90,50]].map(function(q){ var s=c07(q[0],q[1]); return [q[0],q[1],fx(s.mu,3),fx(s.hu,0)]; })},
    analysis:'칸별 μ 를 구해 φ · 칼슘에 대한 그래프를 그린다. 칼슘 분율이 같은 증가량에서 μ 증가가 일정한지 확인하고, 목표 HU 를 맞추는 레시피를 역으로 계산한 뒤 검증 칸의 오차(%)를 보고한다.',
    special:['🎨 작품 기획서',[['작품 이름','「나만의 인체 모형 — 조직 팔레트」'],['표현 아이디어','밝기 단계가 있는 6 칸 팔레트와 레시피 카드'],['과학 근거','밀도 · 질량 감약 계수 · HU 정의'],['전시 구성','팬텀 + 촬영 사진 + μ–φ 그래프 + 안전 수칙']]],
    fails:[['칸마다 두께가 달라 비교가 안 된다','같은 틀 · 같은 두께 · 자로 확인'],['거품이 있어 밝기가 불규칙','저온 응고 · 거품 제거 · 천천히 저어 준다'],['촬영마다 밝기가 다르다','수동 노출 · 기준 칸을 사진마다 포함']],
    up:['<b>C08</b> — 팬텀으로 슬라이스 두께 실험.','<b>C09</b> — 창 수준으로 팬텀 영상 보기.','<b>R02</b> — 용액 농도와 감약.'],
    next:['CT 원리',3],
    eval:[['제작','칸 정밀도 · 재현성'],['정량화','μ · HU 환산 · 오차'],['설명','밀도 · 원소 효과'],['안전','분말 · 방사선 장비 미사용']] });
})();
SIMS.C07={ q:'채움률 φ 와 칼슘 분율을 바꾸면 팬텀의 감약과 HU 는 어떻게 변할까?',
  a:{nm:'채움률 φ',min:20,max:100,step:5,val:90,unit:'%',d:0}, b:{nm:'칼슘 분율',min:0,max:60,step:5,val:0,unit:'%',d:0},
  cap1:'6 칸 팬텀 팔레트(밝을수록 감약 큼). 가운데 칸이 지금 설정이고 오른쪽에 물(0 HU) 기준 칸이 있습니다.',
  cap2:'📊 칼슘 분율에 따른 HU(곡선) — 점선 : 폐 · 물 · 뼈 범위. 파란 점이 지금 설정입니다.',
  note:'모형 : μ = 0.206 φ + 0.0072 · Ca(%) (cm⁻¹, 60 keV 어림) · HU = 1000(μ − μ_물)/μ_물. 칼슘 약 50 % 에서 뼈의 μ(0.57)에 가까워지도록 맞춘 교육용 선형 어림.',
  anim:function(ctx,w,h,t,phi,ca,S){ var sets=[[100,0],[phi,ca],[phi,ca/2],[phi*0.7,ca],[phi,Math.min(60,ca*1.5)],[40,0]], bw=(w-40)/6-8, i, fr=Math.min(1,t/2);
    cvText(ctx,'조직 팔레트 (밝기 = 감약, 오른쪽 칸 = 설정값)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    sets.forEach(function(q,i){ var s=c07(q[0],q[1]), v=Math.max(0,Math.min(1,(s.hu+1000)/2200))*fr, x=16+i*(bw+8), g=Math.round(255*v); ctx.fillStyle='rgb('+g+','+g+','+g+')'; ctx.fillRect(x,40,bw,h-110); ctx.strokeStyle=(i===1)?COL.amber:COL.axis2; ctx.lineWidth=(i===1)?3:1; ctx.strokeRect(x,40,bw,h-110); cvText(ctx,(i===0?'물':i===1?'지금':'변형')+(i>1?'':''),x+bw/2,h-52,(i===1)?COL.amber:COL.tick,'bold 11px system-ui,sans-serif','center'); cvText(ctx,Math.round(q[0])+'% · Ca'+Math.round(q[1]),x+bw/2,h-36,COL.tick,'10.5px system-ui,sans-serif','center'); cvText(ctx,fx(s.hu,0)+' HU',x+bw/2,h-18,COL.text,'bold 11px system-ui,sans-serif','center'); }); },
  graph:function(ctx,w,h,phi,ca,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:60,ymin:-1000,ymax:1800,xlabel:'칼슘 분율 (%)',ylabel:'HU(어림)',title:'칼슘 분율 → HU',left:60,xfmt:axisFmt(0),yfmt:axisFmt(0)}), cs=[[40,COL.ok],[70,COL.amber],[100,COL.white]], i;
    cs.forEach(function(q,k){ var pts=[]; for(i=0;i<=60;i+=2) pts.push([i,c07(q[0],i).hu]); plotLine(ctx,P,pts,q[1],1.4,[4,3]); }); var pt=[]; for(i=0;i<=60;i+=2) pt.push([i,c07(phi,i).hu]); plotLine(ctx,P,pt,COL.blue,2.4); plotPoints(ctx,P,[[ca,c07(phi,ca).hu]],COL.blue,7); legend(ctx,P.x0+60,P.y1+14,[['φ 40 %',COL.ok],['φ 70 %',COL.amber],['φ 100 %',COL.white],['지금 φ '+phi,COL.blue]]); },
  kv:function(phi,ca,S){ var s=c07(phi,ca); return [['μ',s.mu.toFixed(3)+' cm⁻¹','a'],['HU(어림)',s.hu.toFixed(0),'g'],['물 대비 μ',(s.mu/0.206).toFixed(2)+' 배','v2'],['가장 가까운 조직',s.hu<-500?'폐':s.hu<-50?'지방':s.hu<100?'연조직(물)':s.hu<500?'뼈 해면':'뼈'],['목표 300 HU 와 차',(s.hu-300).toFixed(0)+' HU','r']]; } };

/* ── C08 : 슬라이스 두께 · 부분용적효과 ───────────────────────────── */
function c08(D,t){ var f=Math.min(1,0.75*D/t), sig=8*Math.sqrt(5/t), c=f*60, cnr=c/sig; return {f:f,c:c,sig:sig,cnr:cnr}; }
(function(){ var a=c08(5,5), b=c08(5,1), c=c08(2,5), d=c08(2,1);
  mkP({ id:'C08', t:'슬라이스 두께와 부분용적효과 — 작은 병변이 사라지는 까닭', icon:'🍞', type:'창의 · 실험', lv:2, dur:'2 주', cost:'약 1 ~ 2만 원',
    one:'식빵 · 젤리 · 층층이 쌓은 투명 필름으로 「슬라이스」를 만들고, 작은 구슬(병변)이 두꺼운 슬라이스에서는 평균되어 흐려지는 현상을 확인한다. 얇게 자를수록 선명하지만 잡음이 커지는 거래를 정량화한다.',
    q:'병변 지름보다 슬라이스가 두꺼우면 병변의 대비는 얼마나 줄까? 두께를 줄이면 잡음은 얼마나 늘까?',
    why:'CT 에서 「얇게 찍으면 더 잘 보인다」는 반만 맞습니다. <b>부분용적효과</b>(대비 감소)와 <b>잡음 증가</b>가 서로 맞섭니다. 이 거래를 직접 만들어 보는 프로젝트입니다.',
    link:'원리② CT(3번 탭) · 원리⑥(6번 탭) · 평균 · 비례 · C07.',
    cap:'층층이 쌓은 얇은 슬라이스(왼쪽) → 두꺼운 슬라이스 속 병변(가운데) → 대비 vs 두께 곡선(오른쪽). 슬라이스 두께 t(왼쪽 아래) · 병변 지름 D(가운데 아래) · 부분용적효과(오른쪽 아래)',
    parts:[['슬라이스 층','투명 필름 · 젤리 얇은 층','두께 t 를 바꾼다','같은 병변을 얇은 층 / 두꺼운 층으로 비교. 두께는 자로 측정한다.'],
           ['병변 모형','구슬 · 콩 · 젤리 속 색 공','지름 D','진한 색 구슬은 병변처럼 대비가 크다. 지름을 정확히 잰다.'],
           ['배경','투명 젤리 · 흰 배경','균일','병변이 없는 층은 배경 밝기의 기준이 된다.'],
           ['촬영','스마트폰 · 라이트박스','밝기 읽기','층 위에서 직접 촬영해 병변 중심 밝기를 읽는다.'],
           ['대비 계산','대비 = (병변 − 배경)/배경','두께별 비교','두꺼울수록 평균되어 대비가 작아진다.'],
           ['잡음 비교','여러 장 평균 · 표준편차','얇을수록 잡음 ↑','얇은 층 여러 장을 합치면 두꺼운 층과 같은 효과.']],
    budget:[['젤리 · 한천','1 봉','약 3천 원','식빵 조각'],['색 구슬 · 콩','1 세트','약 3천 원','—'],['투명 필름','1 묶음','약 3천 원','—'],['자 · 버니어','1','보유','—'],['라이트박스','1','약 5천 원','태블릿']],
    steps:['지름 D 가 다른 구슬(2, 5, 10 mm)을 준비하고 두께 t = 1, 3, 5, 10 mm 의 젤리 층을 만든다.','같은 구슬을 각 두께의 층에 넣고 촬영한다.','병변 중심 대비 · 배경 대비를 읽어 두께 − 대비 표를 만든다.','얇은 층을 여러 장 겹쳐 두꺼운 층과 같은 효과를 내는지 확인한다.','병변 지름 / 두께 비율에 따라 대비가 어떻게 달라지는지 그래프로 정리한다.'],
    vars:['슬라이스 두께 t · 병변 지름 D','병변 대비 · 잡음 · CNR','병변 위치 · 조명 균일도'],
    predict:[['D = 5 mm · t = 5 mm','병변 비율 f = '+fx(a.f,2)+' · CNR '+fx(a.cnr,1),'두께 = 지름이면 대비 약 75 %'],
             ['D = 5 mm · t = 1 mm','f = '+fx(b.f,2)+' · CNR '+fx(b.cnr,1),'얇아도 병변이 꽉 차면 잡음만 증가'],
             ['D = 2 mm · t = 5 mm','f = '+fx(c.f,2)+' · CNR '+fx(c.cnr,1),'지름보다 두꺼우면 대비가 작아져 사라짐'],
             ['D = 2 mm · t = 1 mm','f = '+fx(d.f,2)+' · CNR '+fx(d.cnr,1),'작은 병변은 얇게 찍어야 보인다(잡음 감수)']],
    data:{cols:['D(mm)','t(mm)','f','잡음 σ','CNR'],
          rows:[[2,1],[2,3],[2,5],[5,1],[5,3],[5,10],[10,5]].map(function(q){ var s=c08(q[0],q[1]); return [q[0],q[1],fx(s.f,2),fx(s.sig,1),fx(s.cnr,1)]; })},
    analysis:'두께 − 대비 곡선이 f = 0.75 D/t (t > 0.75 D) 형태를 따르는지 비교하고, CNR 이 최대가 되는 두께를 병변 크기별로 찾는다. 얇은 층 N 장을 평균한 결과가 잡음 √N 감소와 일치하는지 평가한다.',
    special:['🎨 작품 기획서',[['작품 이름','「샌드위치 속 병변 — 두께의 거래」'],['표현 아이디어','투명 층을 쌓아 병변이 사라지고 나타나는 장면 전시'],['과학 근거','부분용적효과 · CNR · 잡음 ∝ 1/√t'],['전시 구성','층 모형 + 그래프 + 「얇게 vs 두껍게」 퀴즈']]],
    fails:[['대비 차이가 안 보인다','병변 색을 진하게 · 배경 투명하게'],['층 두께 측정이 부정확','같은 틀 · 필름 두께 합산'],['조명 불균일','라이트박스 확산지 · 같은 위치 촬영']],
    up:['<b>R09</b> — 평균으로 잡음 줄이기.','<b>C09</b> — 창 폭으로 작은 대비 확인.','<b>I10</b> — 잡음 제거 필터.'],
    next:['CT 원리',3],
    eval:[['정량 분석','CNR · 대비 곡선'],['모형 정확도','두께 · 지름 측정'],['설명','부분용적효과와 잡음의 거래'],['안전','필름 · 젤리 취급']] });
})();
SIMS.C08={ q:'병변 지름과 슬라이스 두께를 바꾸면 병변의 대비와 CNR 은 어떻게 변할까?',
  a:{nm:'병변 지름 D',min:1,max:10,step:0.5,val:3,unit:'mm',d:1}, b:{nm:'슬라이스 두께 t',min:0.5,max:10,step:0.5,val:5,unit:'mm',d:1},
  cap1:'슬라이스를 옆에서 본 모습. 구슬(병변)이 두께 안에서 차지하는 비율 f 만큼만 어둡게 평균되어 단면 영상에서 흐려집니다.',
  cap2:'📊 슬라이스 두께에 따른 병변 대비(왼쪽 눈금)와 CNR(점선). CNR 은 대비 ÷ 잡음으로 두께가 매우 얇아지면 잡음이 커져 다시 줄어듭니다.',
  note:'모형 : 대비 = 60 HU × min(1, 0.75 D/t) · 잡음 σ = 8 √(5/t) HU(두께 5 mm 에서 8 HU 가정) · CNR = 대비/σ. 구는 중심 단면에서의 어림이며 교육용 모형.',
  anim:function(ctx,w,h,t,D,th,S){ var s=c08(D,th), x0=30, y0=40, sw=Math.min(w-200,200), sh=Math.min(h-90,130), fr=Math.min(1,t/2), sc=sh/12;
    cvText(ctx,'옆에서 본 슬라이스 · f = '+s.f.toFixed(2),12,18,COL.text,'bold 12.5px system-ui,sans-serif');
    ctx.fillStyle='rgba(125,211,252,.2)'; ctx.fillRect(x0,y0+sh/2-th*sc/2,sw,th*sc); ctx.strokeStyle=COL.blue; ctx.strokeRect(x0,y0+sh/2-th*sc/2,sw,th*sc);
    ctx.fillStyle=COL.grav; ctx.beginPath(); ctx.arc(x0+sw/2,y0+sh/2,D*sc/2,0,6.283); ctx.fill();
    cvText(ctx,'t = '+th+' mm',x0+sw+8,y0+sh/2+4,COL.blue,'11.5px system-ui,sans-serif'); cvText(ctx,'D = '+D+' mm',x0+sw/2,y0+sh+16,COL.grav,'11.5px system-ui,sans-serif','center');
    var ix=x0+sw+90, is=Math.min(90,w-ix-16); if(is>30){ var v=Math.round(255*(0.25+0.6*s.f*fr)); ctx.fillStyle='rgb(60,60,60)'; ctx.fillRect(ix,y0,is,is); ctx.fillStyle='rgb('+v+','+v+','+v+')'; ctx.beginPath(); ctx.arc(ix+is/2,y0+is/2,Math.max(2,D*is/24),0,6.283); ctx.fill(); cvText(ctx,'단면 영상',ix+is/2,y0+is+16,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,'CNR '+s.cnr.toFixed(1),ix+is/2,y0+is+32,COL.amber,'bold 12px system-ui,sans-serif','center'); } },
  graph:function(ctx,w,h,D,th,S){ var P=makePlot(ctx,w,h,{xmin:0.5,xmax:10,ymin:0,ymax:70,xlabel:'슬라이스 두께 t (mm)',ylabel:'병변 대비 (HU)',title:'두께 → 대비(실선) · CNR×5(점선)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)}), a=[],b=[],t;
    for(t=0.5;t<=10.01;t+=0.25){ var s=c08(D,t); a.push([t,s.c]); b.push([t,s.cnr*5]); } plotLine(ctx,P,a,COL.amber,2.2); plotLine(ctx,P,b,COL.ok,1.8,[5,3]); var c=c08(D,th); plotPoints(ctx,P,[[th,c.c]],COL.blue,7); legend(ctx,P.x1-130,P.y1+14,[['대비 HU',COL.amber],['CNR × 5',COL.ok],['지금',COL.blue]]); },
  kv:function(D,th,S){ var s=c08(D,th); return [['병변 점유 비율 f',s.f.toFixed(2),'a'],['단면 대비',s.c.toFixed(1)+' HU','g'],['잡음 σ',s.sig.toFixed(1)+' HU','v2'],['CNR',s.cnr.toFixed(1)],['판정',s.cnr>=3?'보인다':'불확실','r']]; } };

/* ── C09 : 창 수준 / 창 폭 뷰어 ────────────────────────────────────── */
var C09 = { N:96, lab:null, hu:null, pre:[['뇌 창',40,80],['뼈 창',400,1800],['폐 창',-600,1500],['전체',0,2000]] };
(function(){ var N=C09.N, lab=makeHead(N,1), hu=huMap(lab), i, r=rng32(5); for(i=0;i<hu.length;i++) hu[i]+= (hu[i]>-900? 3*gaussR(r):0); C09.lab=lab; C09.hu=hu; })();
function c09hist(){ var hist=new Array(24).fill(0), i; for(i=0;i<C09.hu.length;i++){ var b=Math.floor((C09.hu[i]+1000)/(1900/24)); if(b>=0&&b<24) hist[b]++; } return hist; }
function c09stat(WL,WW){ var lo=WL-WW/2, hi=WL+WW/2, gm=C09.hu.filter(function(v,i){ return C09.lab[i]===3; }), wm=C09.hu.filter(function(v,i){ return C09.lab[i]===4; }), mg=mean(gm), mw=mean(wm), cg=Math.max(0,Math.min(1,(mg-lo)/WW)), cw=Math.max(0,Math.min(1,(mw-lo)/WW)); return {lo:lo,hi:hi,cont:Math.abs(cg-cw),sat:0}; }
(function(){ var a=c09stat(40,80), b=c09stat(40,400), c=c09stat(400,1800), d=c09stat(-600,1500);
  mkP({ id:'C09', t:'창 수준 · 창 폭 뷰어 — 같은 CT 를 다르게 보는 법', icon:'🪟', type:'창의 · 소프트웨어', lv:2, dur:'2 주', cost:'무료(코딩)',
    one:'CT 영상(공개 데이터 또는 팬텀)의 HU 값을 창 수준(WL)과 창 폭(WW)으로 변환해 회색조로 보여 주는 간단한 뷰어(웹 · 파이썬)를 만들고, 뇌 · 뼈 · 폐 창 프리셋을 설계한다.',
    q:'WL 과 WW 를 어떻게 정하면 회색질과 백색질처럼 비슷한 조직이 구별될까? 창이 넓을 때와 좁을 때 무엇을 잃을까?',
    why:'CT 는 수천 가지 HU 값을 갖지만 화면은 256 단계의 회색뿐입니다. <b>창</b>은 우리가 보고 싶은 범위만 골라 확대하는 도구입니다. 같은 영상이 창에 따라 전혀 다르게 보입니다.',
    link:'원리② CT(3번 탭) · 함수 · 선형 변환 · 히스토그램 · 프로그래밍.',
    cap:'머리 CT HU 영상(왼쪽) → 창 변환 함수(가운데: 하한~상한) → 화면의 회색조(오른쪽). HU → 밝기 변환(왼쪽 아래) · 창 폭 좁게 = 미세 대비(가운데 아래) · 뇌/뼈/폐 창(오른쪽 아래)',
    parts:[['HU 영상','공개 CT 영상 · 팬텀','수천 단계의 값','HU 값을 배열로 읽는다. 의료 영상 파일(DICOM)은 공개 데이터셋 사용.'],
           ['창 변환 함수','밝기 = (HU − 하한)/WW','0 ~ 1 로 자른다','하한 아래는 검정, 상한 위는 흰색으로 포화된다.'],
           ['프리셋','뇌 창 · 뼈 창 · 폐 창','WL · WW 표','뇌 40/80, 뼈 400/1800, 폐 −600/1500 이 흔히 쓰이는 어림.'],
           ['슬라이더 UI','WL · WW 조절','실시간 갱신','마우스로 조절하며 변화를 관찰한다.'],
           ['히스토그램','HU 분포','어느 범위를 확대할지 결정','분포 봉우리 위치를 보고 창을 정한다.'],
           ['한계 표기','진단 목적 아님','교육용 뷰어','실제 진단은 인증된 소프트웨어로. 개인정보는 제거한다.']],
    budget:[['컴퓨터','1','보유','태블릿'],['파이썬/자바스크립트','1','무료','—'],['공개 CT 데이터','—','무료','팬텀'],['—','—','—','—'],['—','—','—','—']],
    steps:['HU 영상을 배열로 읽는 코드를 만든다(팬텀 또는 공개 데이터).','창 함수 밝기 = clip((HU − (WL − WW/2))/WW, 0, 1) 를 구현한다.','WL · WW 슬라이더를 연결하고 뇌 · 뼈 · 폐 프리셋 버튼을 만든다.','창이 좁을 때 회색질-백색질 대비와 포화 화소 비율을 계산해 표로 만든다.','사용 설명서(언제 어떤 창을 쓰는가)를 한 페이지로 정리한다.'],
    vars:['창 수준 WL · 창 폭 WW','조직 간 대비 · 포화 화소 비율','영상 종류 · 잡음 수준'],
    predict:[['뇌 창(WL 40 · WW 80)','회색질-백색질 대비 '+fx(a.cont,2),'비슷한 연조직이 구별된다'],
             ['WL 40 · WW 400','대비 '+fx(b.cont,2)+' (낮아짐)','창이 넓어지면 미세 차이가 사라진다'],
             ['뼈 창(WL 400 · WW 1800)','대비 '+fx(c.cont,2)+' (거의 0)','뼈 구조는 잘 보이나 뇌 조직 구별 불가'],
             ['폐 창(WL −600 · WW 1500)','대비 '+fx(d.cont,2),'폐 · 공기 구별에 적합']],
    data:{cols:['창','WL','WW','GM–WM 대비'],
          rows:C09.pre.map(function(p){ var s=c09stat(p[1],p[2]); return [p[0],p[1],p[2],fx(s.cont,2)]; })},
    analysis:'창별로 GM–WM 대비와 포화 화소 비율(검정/흰색으로 잘린 비율)을 비교한다. 대비가 최대가 되는 WL 과 WW 를 슬라이더로 찾고, 좁은 창일수록 잡음이 눈에 띄는 현상을 영상으로 확인해 보고한다.',
    special:['🛠️ 소프트웨어 사양',[['입력','HU 2 차원 배열(팬텀 · 공개 데이터)'],['출력','회색조 영상 + 히스토그램 + WL/WW 값'],['핵심 식','밝기 = clip((HU − WL + WW/2)/WW, 0, 1)'],['검증','회색질 · 백색질 · 뼈 · 공기 평균 HU 가 기대와 일치하는가']]],
    fails:[['영상이 모두 검거나 하얗다','WL 이 HU 범위를 벗어난 것 : 히스토그램으로 확인'],['대비가 낮다','WW 를 줄이되 잡음 증가를 확인'],['의료 정보 유출','공개 · 익명화 데이터만 사용']],
    up:['<b>C08</b> — 슬라이스 두께와 잡음.','<b>I10</b> — 잡음 제거로 좁은 창 개선.','<b>C07</b> — 팬텀 HU 만들기.'],
    next:['CT 원리',3],
    eval:[['정확성','창 변환 식 구현'],['사용성','프리셋 · 슬라이더'],['정량화','대비 · 포화 계산'],['윤리','익명 · 교육용 표기']] });
})();
SIMS.C09={ q:'창 수준(WL)과 창 폭(WW)을 바꾸면 같은 머리 CT 영상이 어떻게 달라 보일까?',
  a:{nm:'창 수준 WL',min:-600,max:600,step:10,val:40,unit:'HU',d:0}, b:{nm:'창 폭 WW',min:40,max:2000,step:20,val:80,unit:'HU',d:0},
  cap1:'머리 단면 CT. 뇌 창(WL 40 · WW 80)에서는 회색질 / 백색질이 구별되고 뼈는 하얗게 포화됩니다. 창을 넓히면 뼈가 보이는 대신 뇌 대비가 사라집니다.',
  cap2:'📊 HU 분포 히스토그램(막대)과 창 범위(파란 띠). 띠 안의 HU 만 회색으로 표현되고 바깥은 검정/흰색으로 잘립니다.',
  note:'모형 : 머리 팬텀 HU(공기 −1000 · 두피 25 · 두개골 700 · 회색질 40 · 백색질 30 · 뇌척수액 5 · 병변 65 · 석회화 320) + 잡음 3 HU. 밝기 = clip((HU − WL + WW/2)/WW). 교육용 가상 영상.',
  anim:function(ctx,w,h,t,WL,WW,S){ var s=sqFit(w*0.55,h,30), x0=14, y0=24, st=c09stat(WL,WW); grayImage(ctx,C09.hu,C09.N,x0,y0,s,s,st.lo,st.hi,false); ctx.strokeStyle=COL.dim; ctx.strokeRect(x0,y0,s,s);
    var xr=x0+s+16; cvText(ctx,'WL '+WL+' · WW '+WW,12,16,COL.text,'bold 12.5px system-ui,sans-serif'); cvText(ctx,'하한 '+st.lo.toFixed(0)+' HU',xr,y0+30,COL.tick,'12px system-ui,sans-serif'); cvText(ctx,'상한 '+st.hi.toFixed(0)+' HU',xr,y0+50,COL.tick,'12px system-ui,sans-serif'); cvText(ctx,'GM–WM 대비 '+st.cont.toFixed(2),xr,y0+76,COL.amber,'bold 12.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,WL,WW,S){ var P=makePlot(ctx,w,h,{xmin:-1000,xmax:900,ymin:0,ymax:1,xlabel:'HU',ylabel:'상대 빈도',title:'HU 히스토그램과 창',left:50,xfmt:axisFmt(0),yfmt:axisFmt(1)}), hist=c09hist(), mx=Math.max.apply(null,hist.slice(1)), i, bw=1900/24, st=c09stat(WL,WW);
    ctx.fillStyle='rgba(125,211,252,.2)'; var xa=Math.max(P.xmin,st.lo), xb=Math.min(P.xmax,st.hi); if(xb>xa) ctx.fillRect(P.X(xa),P.y1,P.X(xb)-P.X(xa),P.y0-P.y1);
    for(i=0;i<24;i++){ var v=Math.min(1,hist[i]/mx), x=-1000+i*bw; ctx.fillStyle=COL.amber; ctx.fillRect(P.X(x)+1,P.Y(v),Math.max(1,P.X(x+bw)-P.X(x)-2),P.y0-P.Y(v)); } },
  kv:function(WL,WW,S){ var s=c09stat(WL,WW); return [['표시 범위',s.lo.toFixed(0)+' ~ '+s.hi.toFixed(0)+' HU','a'],['GM–WM 대비',s.cont.toFixed(2),'g'],['회색질/백색질 구별',s.cont>0.08?'잘 된다':s.cont>0.03?'어렵다':'안 된다','v2'],['적합한 용도',WW<=150?'뇌 · 연조직':WW<=800?'연조직 · 복부':WW>=1400?'뼈 · 폐':'혼합'],['한 단계 HU 폭',(WW/256).toFixed(1)+' HU','r']]; } };

/* ── C10 : 검사 대기열 시뮬레이터 ──────────────────────────────────── */
function erlang(lam,c,mu){ var rho=lam/(c*mu); if(rho>=1) return {rho:rho,Wq:Infinity,Pw:1}; var a=lam/mu, s=0, k, f=1; for(k=0;k<c;k++){ if(k>0) f*=a/k; s+=f; } var fc=f*a/c; var top=fc/(1-rho), Pw=top/(s+top); return {rho:rho,Pw:Pw,Wq:Pw/(c*mu-lam)*60}; }
function c10sim(lam,c,mu,seed){ var r=rng32(seed), t=0, free=[], i, n=240, W=[], arr=0; for(i=0;i<c;i++) free.push(0); for(i=0;i<n;i++){ arr+=-Math.log(1-r())/lam; var k=0,j; for(j=1;j<c;j++) if(free[j]<free[k]) k=j; var st=Math.max(arr,free[k]); W.push((st-arr)*60); free[k]=st+(-Math.log(1-r())/mu); } return W; }
(function(){ var a=erlang(4,1,5), b=erlang(4,2,5), c=erlang(9,2,5), d=erlang(9,3,5);
  mkP({ id:'C10', t:'검사 대기열 시뮬레이터 — 장비 대수와 대기 시간의 관계', icon:'⏱️', type:'창의 · 시뮬레이션', lv:3, dur:'2 ~ 3주', cost:'무료(코딩)',
    one:'환자가 무작위로 도착하고 검사 장비(MRI 등)가 한 명씩 처리하는 상황을 컴퓨터로 시뮬레이션해 장비 대수 · 도착률 · 검사 시간에 따른 평균 대기 시간을 구한다. 이론식(얼랑 C)과 비교한다.',
    q:'도착률이 같아도 장비가 한 대 늘면 대기 시간은 얼마나 줄까? 가동률이 90 % 를 넘으면 왜 갑자기 길어질까?',
    why:'MRI 대기 시간은 기술보다 <b>운영</b>의 문제입니다. 확률과 시뮬레이션으로 「가동률이 높을수록 대기가 폭발한다」는 직관 밖의 사실을 직접 확인할 수 있습니다.',
    link:'7번 탭(국가별 장비 · 이용) · 확률분포(지수 · 푸아송) · 시뮬레이션 · 모델링.',
    cap:'도착(왼쪽: 무작위) → 장비(가운데: 서비스 시간) → 대기열과 대기 시간(오른쪽). 도착률 λ(왼쪽 아래) · 장비 대수 c(가운데 아래) · 평균 대기 시간(오른쪽 아래)',
    parts:[['도착 과정','시간당 λ 명 · 지수 간격','무작위 도착','도착 간격을 지수분포로 뽑아 무작위성을 표현한다.'],
           ['장비','대수 c · 시간당 처리 μ','검사 시간 지수분포','서비스 시간도 무작위로 한다. μ = 5 명/시간(평균 12 분)을 기본으로.'],
           ['대기열','선착순','먼저 온 순','빈 장비에 먼저 온 환자를 배정한다.'],
           ['지표','평균 대기 · 가동률 ρ','ρ = λ/(cμ)','가동률이 1 에 가까울수록 대기가 급증한다.'],
           ['검증','이론식(얼랑 C)과 비교','오차 %','시뮬레이션이 이론에 수렴하는지 확인한다.'],
           ['정책 실험','영업 시간 연장 · 대수 증설','비용 대 효과','정책별 대기 시간 변화를 비교한다. 윤리 · 비용을 함께 논의한다.']],
    budget:[['컴퓨터','1','보유','—'],['파이썬/스프레드시트','1','무료','—'],['—','—','—','—'],['—','—','—','—'],['—','—','—','—']],
    steps:['지수 난수로 도착 간격과 검사 시간을 만드는 함수를 작성한다.','장비 c 대를 배정하는 선착순 규칙을 구현한다(가장 빨리 비는 장비).','각 시뮬레이션을 1000 회 반복해 평균 대기 시간을 구한다.','c = 1, 2, 3 · λ 를 바꾸며 표를 만들고 얼랑 C 이론값과 비교한다.','가동률 90 % 근처에서 대기 변화가 급해지는 현상을 그래프로 설명한다.'],
    vars:['도착률 λ · 장비 대수 c · 서비스율 μ','평균 대기 시간 · 대기 확률 · 가동률','무작위 시드 · 반복 횟수'],
    predict:[['λ 4 · c 1 (ρ 0.8)','이론 평균 대기 '+fx(a.Wq,1)+' 분',''],
             ['λ 4 · c 2 (ρ 0.4)','이론 평균 대기 '+fx(b.Wq,1)+' 분 (대폭 감소)','한 대 추가가 대기를 거의 없앤다'],
             ['λ 9 · c 2 (ρ 0.9)','이론 평균 대기 '+fx(c.Wq,1)+' 분','가동률 0.9 에서 급증'],
             ['λ 9 · c 3 (ρ 0.6)','이론 평균 대기 '+fx(d.Wq,1)+' 분','증설이 효과적']],
    data:{cols:['λ(명/h)','c','가동률 ρ','대기 확률','평균 대기(분)'],
          rows:[[3,1],[4,1],[4.5,1],[4,2],[8,2],[9,2],[9,3]].map(function(q){ var e=erlang(q[0],q[1],5); return [q[0],q[1],fx(e.rho,2),fx(e.Pw,2),isFinite(e.Wq)?fx(e.Wq,1):'∞']; })},
    analysis:'시뮬레이션 평균 대기 시간과 얼랑 C 이론값의 오차를 반복 횟수별로 비교하고, ρ 가 0.7 · 0.8 · 0.9 일 때 대기 시간 증가율을 서술한다. 정책 비교(증설 vs 시간 연장)의 효과 · 비용 · 형평성을 논의한다.',
    special:['🛠️ 모형 사양',[['입력','λ(도착률) · c(장비 수) · μ(처리율)'],['출력','평균 대기 시간 · 가동률 · 대기 확률'],['이론','M/M/c 대기 모형 : 얼랑 C 식'],['한계','응급 우선 · 예약제 · 검사 시간 변동을 단순화']]],
    fails:[['시뮬레이션이 불안정하다','반복 횟수 ↑ · 초기 구간 제거'],['ρ ≥ 1 에서 대기가 무한','안정 조건 확인 후 입력 제한'],['현실과 다르다','예약제 · 우선순위 · 야간 운영을 추가 모형으로']],
    up:['<b>C05</b> — 자원 제약 게임.','<b>I06</b> — 누적 기록 앱.','<b>7번 탭</b> — 국가별 장비 수와 이용.'],
    next:['활용 현황',7],
    eval:[['정확성','모형 · 이론 비교'],['분석','가동률-대기 관계'],['정책 제안','증설 · 시간 연장 논의'],['한계 서술','단순화한 가정 명시']] });
})();
SIMS.C10={ q:'도착률과 장비 대수를 바꾸면 검사 대기 시간은 어떻게 달라질까?',
  a:{nm:'도착률 λ',min:1,max:14,step:0.5,val:4,unit:'명/h',d:1}, b:{nm:'장비 대수 c',min:1,max:4,step:1,val:1,unit:'대',d:0},
  cap1:'시계가 흐르며 환자(점)가 무작위로 도착해 장비(칸) 앞에서 대기합니다. 주황 점이 대기 중인 환자입니다.',
  cap2:'📊 환자 번호별 대기 시간(점)과 이론 평균(점선). 가동률이 1 에 가까우면 대기가 길고 불안정합니다.',
  note:'모형 : M/M/c — 도착 간격과 검사 시간 모두 지수분포, 처리율 μ = 5 명/시간 · 선착순. 이론 평균 대기 W_q = P_wait/(cμ − λ) (얼랑 C). ρ ≥ 1 에서는 대기가 무한히 늘어난다.',
  anim:function(ctx,w,h,t,lam,c,S){ var e=erlang(lam,c,5), r=rng32(11), i, y0=44, W=c10sim(lam,c,5,3), n=Math.min(40,W.length), fr=Math.min(1,t/3);
    cvText(ctx,'가동률 ρ = '+e.rho.toFixed(2)+(e.rho>=1?' (불안정 : 대기 무한)':'')+' · 이론 평균 대기 '+(isFinite(e.Wq)?e.Wq.toFixed(1)+' 분':'∞'),12,16,COL.text,'bold 12.5px system-ui,sans-serif');
    var qx=16, qw=w*0.5; for(i=0;i<n;i++){ var x=qx+(i%20)*(qw/20), y=y0+Math.floor(i/20)*18, wait=W[i]; ctx.fillStyle=wait>15?COL.grav:wait>1?COL.amber:COL.ok; ctx.globalAlpha=(i/n<fr)?1:0.15; ctx.beginPath(); ctx.arc(x+6,y+8,5,0,6.283); ctx.fill(); } ctx.globalAlpha=1;
    var mx=w*0.62, k; for(k=0;k<c;k++){ var yy=y0+k*40; ctx.fillStyle=COL.panel||'#1e293b'; ctx.fillRect(mx,yy,w*0.3,32); ctx.strokeStyle=COL.blue; ctx.strokeRect(mx,yy,w*0.3,32); cvText(ctx,'장비 '+(k+1)+' (μ=5/h)',mx+8,yy+20,COL.blue,'12px system-ui,sans-serif'); }
    cvText(ctx,'■ 대기 15분↑',16,h-12,COL.grav,'11px system-ui,sans-serif'); cvText(ctx,'■ 1~15분',110,h-12,COL.amber,'11px system-ui,sans-serif'); cvText(ctx,'■ 거의 없음',190,h-12,COL.ok,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,lam,c,S){ var W=c10sim(lam,c,5,3), e=erlang(lam,c,5), ym=Math.max(10,quantile(W,0.97)*1.1), P=makePlot(ctx,w,h,{xmin:0,xmax:W.length,ymin:0,ymax:ym,xlabel:'환자 번호',ylabel:'대기 시간 (분)',title:'환자별 대기 시간 · 이론 평균(점선)',left:56,xfmt:axisFmt(0),yfmt:axisFmt(0)});
    plotPoints(ctx,P,W.map(function(v,i){ return [i,Math.min(ym,v)]; }),COL.amber,3); if(isFinite(e.Wq)) plotLine(ctx,P,[[0,e.Wq],[W.length,e.Wq]],COL.ok,2,[6,4]); },
  kv:function(lam,c,S){ var e=erlang(lam,c,5), W=c10sim(lam,c,5,3); return [['가동률 ρ',e.rho.toFixed(2),e.rho>=0.9?'r':'a'],['대기 확률',isFinite(e.Wq)?(e.Pw*100).toFixed(0)+' %':'100 %','g'],['이론 평균 대기',isFinite(e.Wq)?e.Wq.toFixed(1)+' 분':'∞','v2'],['시뮬레이션 평균(240 명)',mean(W).toFixed(1)+' 분'],['최대 대기',Math.max.apply(null,W).toFixed(0)+' 분','r']]; } };
