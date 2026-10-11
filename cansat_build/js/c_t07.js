/* ───────────────────────────────────────────────────────────────────────────
   TAB 7 — 활용 현황 : 한국 · 미국 · 일본(+유럽) — 나라별 카드 · 연표 캔버스 · 내가 갈 길
   ※ 이 데이터는 공개된 대회 소개 · 보도에서 확인한 사실만 담는다(탭의 「근거로 삼은 공개 자료」 참고).
     규정 · 일정 · 참가 자격은 해마다 바뀌므로 화면에서도 「공식 사이트에서 확인」 을 안내한다.
   ─────────────────────────────────────────────────────────────────────────── */
var CNT = {
  kr:{ name:'🇰🇷 한국', color:'gr', head:'캔위성 경연대회 — KAIST 인공위성연구센터 주관 (2012~)',
    pts:[
     ['대회 구성','초 · 중학생은 <b>체험캠프</b>(위성 교육과 캔위성 제작 실습), 고등학생은 <b>슬기부</b>, 대학생은 <b>창작부</b>로 캔위성을 직접 기획 · 개발 · 발사해 겨룹니다.'],
     ['방출과 미션','기구(풍선)나 소형 과학로켓으로 <b>수백 m 상공</b>에서 분리되어 낙하하며 지상관측 영상 · 대기과학 정보를 지상국에 전송하고, <b>지상 목표물에 최대한 가까이</b> 도달하는 것이 핵심입니다.'],
     ['규모 · 선발(보도 기준)','2023년 제12회 대회에 슬기부 45팀 · 창작부 19팀이 참가했고, 슬기부 5팀 · 창작부 5팀이 최종 선정되었습니다(최우수상 : 경산과학고 · 충남대 팀). 다른 해 보도에는 서류심사 → 발표평가로 부문별 팀을 압축하는 방식이 소개되어 있습니다.'],
     ['목표와 국제 연결','대회 소개에는 유럽 · 미국 · 일본 등에서 열리는 <b>국제 캔위성 대회에 대한 관심을 높이고</b> 참가를 독려하며 우주기술 민간 교류를 넓히는 것이 목적 중 하나로 적혀 있습니다. 보도에 따르면 미국 CanSat 결선 참가국 가운데 한국이 포함된 해도 있습니다.'],
     ['이 학습실과의 연결','방출 고도가 수백 m 라 <b>낙하 시간은 약 1 분</b> → 2 · 4번 탭의 낙하 · 유도 모형이 그대로 맞고, 영상 · 대기 전송은 3 · 5번 탭, 복귀 정밀도는 17번 탭과 이어집니다.']
    ]},
  us:{ name:'🇺🇸 미국', color:'cy', head:'AAS/AIAA CanSat Competition · ARLISS(네바다)',
    pts:[
     ['AAS/AIAA CanSat Competition','미국천문학회(AAS) · 항공우주학회(AIAA) 주최로 NASA · 해군연구소(NRL) 등이 후원하는 <b>설계 · 제작 · 발사</b> 대회(2005년경부터 매년). 대학(원)생 국제 팀이 참가하며, 설계 보고서와 실제 비행을 함께 평가합니다.'],
     ['2025 결선 (보도 기준)','6월 5 ~ 8일 미국 버지니아. 아르헨티나 ITBA 팀이 97.98 점으로 1위, 2위 터키, 3위 대만. 보도에 따르면 약 17개국 34팀이 결선에 올랐습니다.'],
     ['2026 임무','Mission Guide 2026 : 「Paraglider Instrument Delivery」 — 재진입체를 모사해 <b>낙하 속도와 자세를 제어</b>하며 대기 · 과학 측정을 합니다. 팀은 구조 · 전력 · 통신 · 센서 · 자료 처리 · 회수까지 한 캔 안에서 통합해야 합니다.'],
     ['ARLISS (블랙록 사막)','1999.9.11 첫 개최(일본 2팀 · 미국 2팀). 매년 9월 네바다 블랙록 사막에서 열리며, 캔위성을 로켓으로 <b>약 4 km 상공</b>에서 방출합니다. <b>Comeback</b>(목표 지점까지 자율 복귀) 과 <b>Mission</b>(자유 임무) 두 부문.'],
     ['시사점','미국 대회는 <b>요구사항 문서(Mission Guide)를 읽고 설계에 반영하는 연습</b>이 중심입니다 — 이 학습실의 연구 도구함(14번 탭) 요구사항 표가 같은 방식입니다.']
    ]},
  jp:{ name:'🇯🇵 일본', color:'rd', head:'UNISEC 중심의 캔위성 교육 생태계',
    pts:[
     ['UNISEC 와 ARLISS','대학우주공학컨소시엄(UNISEC)이 ARLISS 참가를 이끌며, 일본 대학 · 팀이 해마다 다수 참가합니다. Comeback 에서는 로버형 · 비행기형 캔위성이 목표로 자율 복귀를 시도합니다.'],
     ['교육자 연수 CLTP','CanSat Leader Training Program — 2010년 출범, 2011년 첫 연수, 2019년까지 <b>37개국 81명</b>이 수료. 학생이 아니라 <b>가르칠 사람</b>을 키우는 프로그램입니다.'],
     ['국내 대회','아키타현 노시로의 <b>능대 우주이벤트</b>(8월)에서는 2005년부터 캔위성 대회가 열렸고, <b>다네가시마 로켓 콘테스트</b>(3월)는 일본 국내 고교 · 고전 · 대학생과 사회인이 참가할 수 있습니다.'],
     ['중 · 고교생에게 열린 행사','도쿄대 공학부와 일본항공우주학회가 함께 연 미니위성 CanSat 콘테스트(2025.4.5)는 <b>중 · 고교생도 팀을 이뤄</b> 주어진 임무를 수행할 수 있는 형식이었습니다.'],
     ['시사점','대학 → 고교 → 교사 연수까지 <b>사다리가 이어진 구조</b>가 특징입니다. 한국 교사도 CLTP 와 UNISEC 자료를 참고해 동아리 · R&E 를 설계할 수 있습니다.']
    ]},
  eu:{ name:'🇪🇺 유럽', color:'vi', head:'ESA · ESERO — European CanSat Competition',
    pts:[
     ['구조','유럽우주국(ESA)과 ESERO 가 운영. <b>나라별 예선 → 유럽 결선</b>. 2025년에는 스페인(갈리시아) · 그리스 · 카탈루냐 등에서 국가 결선이 열렸고 유럽 결선은 6월 ESA 네덜란드 본부에서 열렸습니다.'],
     ['미션','모든 팀이 <b>온도 · 기압</b>을 재는 필수 임무를 하고, 팀이 직접 정하는 <b>선택 임무</b>를 더합니다(예 : 환경 · 영상 · 착륙 방식).'],
     ['대상','중 · 고등학생 중심. 고교생 대상 첫 유럽 캔위성 대회 보고가 2010년 국제우주대회 논문으로 발표되었습니다.'],
     ['시사점','「필수 + 선택」 구조는 <b>학교 프로젝트로 옮기기 쉬운 모델</b>입니다. 이 학습실의 종합실험 2(기압 → 고도)가 필수 임무와 같은 종류입니다.']
    ]}
};
var MILE = [
  {y:1999, c:'us', t:'ARLISS 첫 개최', pos:'u', d:'1999.9.11 미국 네바다 블랙록 사막. 스탠퍼드대와 일본 대학이 중심. 참가 일본 2팀 · 미국 2팀.'},
  {y:2005, c:'jp', t:'능대 CanSat 대회', pos:'u', d:'일본 아키타현 노시로의 능대 우주이벤트에서 국내 캔위성 대회가 2005년부터 이어졌습니다.'},
  {y:2005, c:'us', t:'AAS/AIAA 대회', pos:'d', d:'미국천문학회 · 항공우주학회 주최 국제 캔위성 대회가 2005년경부터 해마다 열립니다(NASA · NRL 후원).'},
  {y:2010, c:'eu', t:'유럽 고교생 대회', pos:'u', d:'고교생을 위한 첫 유럽 캔위성 대회 보고가 2010년 국제우주대회 논문으로 발표되었습니다. 이후 ESA · ESERO 대회로 자리잡았습니다.'},
  {y:2010, c:'ed', t:'CLTP 출범', pos:'u', d:'UNISEC 의 CanSat Leader Training Program 이 2010년 출범했습니다(교육자 · 리더 연수).'},
  {y:2011, c:'ed', t:'첫 CLTP', pos:'d', d:'2011년 첫 CLTP 연수가 열렸습니다. 이후 해마다 이어져 2019년까지 37개국 81명이 수료했습니다.'},
  {y:2012, c:'kr', t:'한국 캔위성 경연대회', pos:'u', d:'KAIST 인공위성연구센터 주관, 한국에서 처음으로 캔위성 경연대회가 열렸습니다. 초 · 중 체험캠프와 고등 · 대학부 경연으로 구성.'},
  {y:2023, c:'kr', t:'제12회 (45 · 19팀)', pos:'u', d:'2023년 12회 대회 — 슬기부(고등) 45팀 · 창작부(대학) 19팀 참가, 각 5팀이 최종 선정되었습니다.'},
  {y:2025, c:'jp', t:'도쿄대 CanSat 콘테스트', pos:'u', d:'2025.4.5 도쿄대 공학부 × 일본항공우주학회 공동 미니위성 CanSat 콘테스트. 중 · 고교생 팀도 참가 가능한 형식.'},
  {y:2025, c:'us', t:'AAS/AIAA 결선', pos:'d', d:'2025.6.5~8 미국 버지니아. 아르헨티나(ITBA)가 97.98점으로 1위(보도). 약 17개국 34팀이 결선에 참가했다고 보도되었습니다.'},
  {y:2025, c:'eu', t:'ESA 유럽 결선', pos:'d', d:'2025 유럽 결선(「Space Engineer for a Day」)이 6월 ESA 네덜란드 본부에서 열렸습니다.'},
  {y:2026, c:'us', t:'파라글라이더 임무', pos:'u', d:'AAS/AIAA 2026 Mission Guide : 「Paraglider Instrument Delivery」 — 낙하 속도 · 자세를 제어하며 측정하는 재진입체 모사 임무.'}
];
var LANE={us:0, jp:1, kr:2, eu:3, ed:4};
var LANEC={us:'cy', jp:'rd', kr:'gr', eu:'vi', ed:'am'};
var LANEN={us:'미국', jp:'일본', kr:'한국', eu:'유럽', ed:'교육자 연수'};
var PATHS = {
  mid:'<b>중학생</b> — ① 한국 캔위성 경연대회의 <b>체험캠프</b>(초 · 중학생 대상 위성 교육 · 캔위성 제작 실습) 모집을 공식 사이트에서 확인합니다. ② 이 학습실 1 ~ 6번 탭을 읽고 ★ 하나짜리 프로젝트(R&amp;E 01 · 03, 창의 03 · 10)로 시작합니다. ③ 학교 과학 동아리에서 낙하산 · 기압 실험부터 해 봅니다.',
  hs:'<b>고등학생</b> — ① 한국 캔위성 경연대회의 <b>고등부(슬기부)</b> 모집 요강을 확인합니다(팀 구성 · 설계서 → 발표평가 순서로 진행된 해가 있음). ② R&amp;E 10선 → 종합실험 3개 → 실험보고서로 <b>데이터가 있는 설계서</b>를 만듭니다. ③ 학교 R&amp;E · 동아리 연구로 확장하고, 해외는 ESA(유럽 학생 대상) · 일본 UNISEC 관련 행사의 참가 자격을 확인합니다.',
  uni:'<b>대학생</b> — ① 한국 캔위성 경연대회 <b>창작부</b>. ② AAS/AIAA CanSat Competition(국제 · 대학(원)생 중심, Mission Guide 매년 게시)과 ARLISS(UNISEC 연계)에 팀으로 도전합니다. ③ 발명 10선(I01 ~ I10)과 R&amp;E 심화(★★★)를 연구 프로젝트로 발전시켜 학회 · 논문으로 연결합니다.',
  tch:'<b>교사</b> — ① 동아리 · R&amp;E 지도에 이 학습실의 프로젝트 카드(방법 5단계 · 예산 · 평가 기준)를 그대로 씁니다. ② 일본 UNISEC 의 CLTP(교육자 연수)와 ESA · ESERO 의 교사 자료를 참고합니다. ③ KAIST 캔위성 경연대회의 체험캠프 · 시상 자료로 학생 동기 부여 수업을 구성하고, 안전 수칙(6번 탭)을 먼저 점검합니다.'
};
TabInit[7] = function(){ T7.init(); };
TabDraw[7] = function(){ T7.draw(Anim.time(7)); Anim.kick(7); };
var T7 = (function(){
  var tb=null, sel=-1, DUR=27;
  function SB(h){ return String(h).replace(/<b>/g,'<strong>').replace(/<\/b>/g,'</strong>'); }
  function C(k){ return COL[{cy:'blue',rd:'grav',gr:'ok',vi:'iner',am:'amber'}[LANEC[k]]]; }
  function showCountry(key){
    var c=CNT[key], h='<div class="h4" style="margin-top:10px">'+c.name+' — '+c.head+'</div><div class="parts">';
    c.pts.forEach(function(p){ h+='<div class="part"><b>'+p[0]+'</b>'+SB(p[1])+'</div>'; });
    document.getElementById('t7-country').innerHTML=h+'</div>';
    $$('#t7-tabs button').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-c')===key?'true':'false'); });
    if(window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([document.getElementById('t7-country')]).catch(function(){});
  }
  function info(i){
    sel=i; var m=MILE[i];
    document.getElementById('t7-info').innerHTML='<strong style="color:var(--am)">'+m.y+'년 · '+LANEN[m.c]+'</strong> — <strong>'+m.t+'</strong><br>'+m.d;
    $$('#t7-pts button').forEach(function(b,j){ b.setAttribute('aria-pressed', j===i?'true':'false'); });
    Anim.pause(7); Anim.seek(7, Math.max(0,m.y-1999));
    draw(Anim.time(7));
  }
  function counts(t){ var y=1999+t, n=0, i; for(i=0;i<MILE.length;i++) if(MILE[i].y<=y+0.001) n++; return n; }
  function draw(t){
    var cv=document.getElementById('t7-cv'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, x0=86, x1=W-34, y0=96, y1=H-62, i, yr=1999+t;
    function X(y){ return x0+(x1-x0)*(y-1999)/27; } function Y(l){ return y0+(y1-y0)*l/4; }
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H); ctx.fillStyle=COL.plotbg; ctx.fillRect(x0-8,y0-46,x1-x0+16,y1-y0+82);
    /* 레인 */
    ctx.font='bold 11.5px system-ui,sans-serif'; ctx.textBaseline='middle';
    ['us','jp','kr','eu','ed'].forEach(function(k){ var yy=Y(LANE[k]); ctx.strokeStyle=COL.gridln; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x0-8,yy); ctx.lineTo(x1+8,yy); ctx.stroke();
      ctx.fillStyle=C(k); ctx.textAlign='right'; ctx.fillText(LANEN[k], x0-14, yy); });
    /* 연도 눈금 */
    ctx.strokeStyle=COL.axis; ctx.fillStyle=COL.tick; ctx.font='10.5px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
    [1999,2005,2010,2015,2020,2026].forEach(function(v){ var x=X(v); ctx.beginPath(); ctx.moveTo(x,y1+22); ctx.lineTo(x,y1+28); ctx.stroke(); ctx.fillText(v,x,y1+31); });
    ctx.beginPath(); ctx.moveTo(x0-8,y1+22); ctx.lineTo(x1+8,y1+22); ctx.stroke();
    /* 지금(연도) 선 */
    var xn=X(Math.min(2026,yr)); ctx.strokeStyle=COL.amber; ctx.lineWidth=1.6; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.moveTo(xn,y0-44); ctx.lineTo(xn,y1+22); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=COL.amber; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(Math.floor(Math.min(2026,yr)+0.001), xn, y0-46);
    /* 마일스톤 */
    for(i=0;i<MILE.length;i++){
      var m=MILE[i], on=m.y<=yr+0.001, x=X(m.y), yy=Y(LANE[m.c]), col=C(m.c);
      ctx.strokeStyle=col; ctx.lineWidth=on?1.4:1; ctx.globalAlpha=on?1:0.3;
      ctx.beginPath(); ctx.arc(x,yy,on?7:5,0,6.2832); if(on){ ctx.fillStyle=col; ctx.fill(); } ctx.stroke();
      if(i===sel){ ctx.lineWidth=2.2; ctx.strokeStyle=COL.text; ctx.beginPath(); ctx.arc(x,yy,11,0,6.2832); ctx.stroke(); }
      ctx.font=(i===sel?'bold ':'')+'10.5px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline= m.pos==='u'?'bottom':'top';
      var lx=Math.max(x0+40,Math.min(W-52,x)), ly= m.pos==='u'? yy-12 : yy+12;
      ctx.fillStyle=on? COL.text : COL.dim; ctx.fillText(m.t, lx, ly); ctx.globalAlpha=1;
    }
    setTxt('t7-oY', Math.floor(Math.min(2026,yr)+0.001)+'년'); setTxt('t7-oN', counts(t)+' / '+MILE.length);
    cv.setAttribute('aria-label','캔위성 연표. '+Math.floor(Math.min(2026,yr)+0.001)+'년까지 '+counts(t)+'개 항목');
  }
  function init(){
    showCountry('kr');
    $$('#t7-tabs button').forEach(function(b){ b.addEventListener('click', function(){ showCountry(b.getAttribute('data-c')); }); });
    var host=document.getElementById('t7-pts'); MILE.forEach(function(m,i){ var b=document.createElement('button'); b.type='button'; b.className='btn sm'; b.setAttribute('aria-pressed','false'); b.textContent=m.y+' '+m.t; b.addEventListener('click', function(){ info(i); }); host.appendChild(b); });
    $$('#tab7 [data-s]').forEach(function(b){ b.addEventListener('click', function(){ var k=b.getAttribute('data-s'); document.getElementById('t7-path').innerHTML=SB(PATHS[k]); $$('#tab7 [data-s]').forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); }); }); });
    tb=buildTimeBar('t7-time', 7, {dur:DUR, unit:'년 경과', digits:0});
    Anim.register(7,{dur:DUR, loop:false, autoplay:false, draw:draw, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
    Anim.seek(7, DUR); draw(DUR);
  }
  return { init:init, draw:draw };
})();
