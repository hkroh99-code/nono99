/* ───────────────────────────────────────────────────────────────────────────
   TAB 7 — 활용 현황 : 인구당 장비 대수(OECD 2011, 공개 논문 표 인용) · 나라별 카드 · 진로 탐색
   검증(손계산) : 도시 100만 명, CT → 한국 35.9 · 미국 40.9 · 일본 101.3 대 / 1 대당 인구 일본 9,872 명 · 한국 27,855 명
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[7] = function(){ T7.init(); };
TabDraw[7] = function(){ T7.graph(); Anim.kick(7); };
var T7 = (function(){
  var R={ CT:{kr:35.9,us:40.9,jp:101.3}, MRI:{kr:21.3,us:31.5,jp:46.9} }, KR22=44.5, pop=100, kind=1, tb=null, DUR=10;
  var CN={ kr:{f:'🇰🇷',n:'한국',rows:[
      ['보급 · 이용','2022년 인구 100만 명당 CT 약 44.5대(OECD 평균 약 27.3대), 인구 1000명당 CT 검사 약 304건(OECD 평균 약 163건)으로 보도됨 — 장비 수와 검사 건수 모두 최상위권.'],
      ['제도','전 국민 건강보험. MRI 는 2005년 이후 진단별 건강보험 적용 등 급여가 단계적으로 확대된 것으로 보도됨(최신 급여 기준은 확인 필요).'],
      ['산업 · 연구','초음파 진단기(삼성메디슨 등) · 디지털 X선 검출기 기업, 영상 AI 기업(루닛 · 뷰노 등). 병원 · 대학의 영상 연구가 활발.'],
      ['쟁점','높은 검사 건수에 따른 과잉 검사 · 누적 선량 관리, 적정 사용 지침 마련.']] },
    us:{f:'🇺🇸',n:'미국',rows:[
      ['보급 · 이용','OECD 자료에서 인구당 MRI 대수는 일본 다음으로 많은 편(2011년 약 31.5대/100만 명). 영상 검사 이용이 많아 비용 · 과잉 영상 논쟁이 있음.'],
      ['제도','민영 · 공공이 섞인 보험 체계. 미국영상의학회(ACR)의 「적정성 기준」과 「Choosing Wisely」 캠페인으로 불필요한 검사를 줄이려는 노력.'],
      ['산업 · 연구','GE 헬스케어(CT · MRI · 초음파 등). 세계 3대 영상 장비 기업으로 GE · 지멘스 헬시니어스(독일) · 필립스(네덜란드)가 꼽힘. FDA 허가 의료 AI 중 영상 분야가 큰 비중.'],
      ['쟁점','의료비 부담 · 접근성의 지역 · 소득 차이, 영상 AI 의 책임 · 편향.']] },
    jp:{f:'🇯🇵',n:'일본',rows:[
      ['보급 · 이용','OECD 자료에서 인구당 CT · MRI 대수 세계 1위(2011년 CT 약 101.3 · MRI 약 46.9 / 100만 명). 병원 · 진료소에 장비가 폭넓게 보급되어 접근성이 높음.'],
      ['제도','국민개보험(전 국민 의료보험)과 고령사회 — 영상 검사 수요가 크다.'],
      ['산업 · 연구','캐논 메디컬 시스템즈(2016년 도시바 메디컬 인수), 후지필름(2021년 히타치 영상진단 사업 인수), 시마즈 제작소 등 CT · MRI · X선 · 초음파 장비 제조사.'],
      ['쟁점','인구 감소 · 고령화 속 장비 운영 인력, 장비 수와 적정 이용의 균형.']] } };
  var CAR=[
    ['영상의학과 전문의','🩺','의과대학 → 수련. 영상을 판독하고 진단 · 중재 시술. 물리(파동 · 전자기) · 생명 · 정보(AI 판독 보조)가 모두 쓰임.'],
    ['방사선사(진단방사선)','🧑‍⚕️','방사선(학)과 → 국가 자격. 촬영 · 장비 운용 · 선량 관리와 환자 안전. 물리(방사선 · 전자기)와 정보가 중요.'],
    ['의학물리사','⚛️','물리학 기반 대학원 → 자격. 장비 품질 관리 · 선량 평가 · 영상 화질 평가. 물리 · 수학 · 통계가 핵심.'],
    ['의공학자(장비 개발)','🛠','전자 · 기계 · 물리 · 의공학. 센서 · 코일 · 탐촉자 · 재구성 알고리즘 설계. 물리 · 수학 · 프로그래밍.'],
    ['의료영상 AI 개발자','🧠','컴퓨터 · 통계 + 의료 지식. 영상 분석 모델 개발과 임상 검증. 수학(확률 · 통계 · 선형대수) · 정보.'],
    ['초음파 검사 전문 인력','🔊','초음파 검사를 직접 수행(심장 · 복부 · 산부인과 등). 자격 · 교육 체계는 나라마다 다르다. 해부 · 생리 · 파동 물리.']];
  function rate(){ return kind===1? R.CT : R.MRI; }
  function cnt(c){ return pop*rate()[c]/100; }
  function readout(){
    setTxt('t7-pV',(pop*10000).toLocaleString('ko-KR')+' 명'); setTxt('t7-kV',kind===1?'CT':'MRI');
    setTxt('t7-oK',cnt('kr').toFixed(1)+' 대'); setTxt('t7-oU',cnt('us').toFixed(1)+' 대'); setTxt('t7-oJ',cnt('jp').toFixed(1)+' 대'); setTxt('t7-oR',(rate().jp/rate().kr).toFixed(1)+' 배');
    setTxt('t7-oP',Math.round(1e6/rate().kr).toLocaleString('ko-KR')+' · '+Math.round(1e6/rate().jp).toLocaleString('ko-KR')+' 명');
  }
  function draw(tm){
    var cv=document.getElementById('t7-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, rows=[['kr','🇰🇷 한국','#34d399'],['us','🇺🇸 미국','#7dd3fc'],['jp','🇯🇵 일본','#fbbf24']], mx=Math.max(cnt('kr'),cnt('us'),cnt('jp')), per=Math.max(1,Math.ceil(mx/60)), frac=Math.min(1,tm/4);
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    cvText(ctx,'도시 인구 '+(pop*10000).toLocaleString('ko-KR')+'명 · '+(kind===1?'CT':'MRI')+' (아이콘 1개 = '+per+' 대)',12,18,COL.text,'bold 12px system-ui,sans-serif');
    rows.forEach(function(r,k){ var n=cnt(r[0]), y=46+k*((h-70)/3), total=n/per, icons=Math.floor(total*frac), x0=84, iw=Math.min(14,(w-100)/Math.max(30,total+2)*0.8), j;
      cvText(ctx,r[1],10,y+12,r[2],'bold 12px system-ui,sans-serif');
      for(j=0;j<Math.ceil(total);j++){ var full=Math.min(1,total-j), on=(j<icons), x=x0+j*(iw+3); ctx.fillStyle=on?r[2]:'rgba(120,150,190,.18)'; ctx.globalAlpha=full<1?0.5:1; ctx.fillRect(x,y,iw,22*full+2); ctx.globalAlpha=1; }
      cvText(ctx,n.toFixed(1)+' 대',w-10,y+28,r[2],'bold 12px system-ui,sans-serif','right'); });
    cv.setAttribute('aria-label','도시 인구에 적용한 나라별 장비 대수. 한국 '+cnt('kr').toFixed(1)+', 미국 '+cnt('us').toFixed(1)+', 일본 '+cnt('jp').toFixed(1)); readout();
  }
  function graph(){
    var cv=document.getElementById('t7-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, y1=h-44, y0=36, mx=110, cols={kr:'#34d399',us:'#7dd3fc',jp:'#fbbf24'}, names={kr:'한국',us:'미국',jp:'일본'};
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h); cvText(ctx,'인구 100만 명당 대수 (OECD 2011, 공개 논문 표 인용)',12,18,COL.text,'bold 12px system-ui,sans-serif');
    ctx.strokeStyle=COL.axis2; ctx.beginPath(); ctx.moveTo(40,y1); ctx.lineTo(w-10,y1); ctx.stroke();
    var bw=Math.min(44,(w-80)/8), gx=[60,60+(w-80)/2];
    [['CT',R.CT],['MRI',R.MRI]].forEach(function(g,gi){ ['kr','us','jp'].forEach(function(c,ci){ var v=g[1][c], x=gx[gi]+ci*(bw+8), hh=(y1-y0)*v/mx; ctx.fillStyle=cols[c]; ctx.fillRect(x,y1-hh,bw,hh); ctx.fillStyle=COL.text; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(v.toFixed(1),x+bw/2,y1-hh-2); ctx.textBaseline='top'; ctx.fillStyle=COL.tick; ctx.fillText(names[c],x+bw/2,y1+4);
        if(gi===0&&c==='kr'){ var h2=(y1-y0)*KR22/mx; ctx.strokeStyle=COL.amber; ctx.setLineDash([4,3]); ctx.strokeRect(x+bw+1,y1-h2,6,h2); ctx.setLineDash([]); } }); cvText(ctx,g[0],gx[gi]+(3*bw+16)/2,y1+22,COL.text,'bold 12px system-ui,sans-serif','center'); });
    cvText(ctx,'점선 막대 = 한국 CT 2022년(보도 약 44.5) — 연도가 다른 값은 직접 비교 금지',w-10,18,COL.amber,'10.5px system-ui,sans-serif','right');
  }
  function drawCountry(c){
    var d=CN[c], h='<div class="part" style="margin-top:9px"><b>'+d.f+' '+d.n+'</b><div class="steps" style="margin-top:6px">'+d.rows.map(function(r){ return '<div class="step"><b>'+r[0]+'</b> — '+r[1]+'</div>'; }).join('')+'</div></div>';
    document.getElementById('t7-country').innerHTML=h;
    $$('#t7-tabs button').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-c')===c?'true':'false'); });
  }
  function drawCareers(){
    var host=document.getElementById('t7-careers'); host.innerHTML='';
    CAR.forEach(function(c,i){ var b=document.createElement('button'); b.type='button'; b.className='btn sm'; b.setAttribute('aria-pressed','false'); b.textContent=c[1]+' '+c[0];
      b.addEventListener('click',function(){ $$('#t7-careers button').forEach(function(x){ x.setAttribute('aria-pressed','false'); }); b.setAttribute('aria-pressed','true'); document.getElementById('t7-path').innerHTML='<b>'+c[1]+' '+c[0]+'</b><br>'+c[2]+'<br><span class="tiny">→ 이 학습실에서 가까운 탭 : '+['3번 CT','4번 초음파','2 · 6번 X선 · 선량','5번 MRI','공방 R10 · I09 AI','4번 초음파'][i]+'</span>'; });
      host.appendChild(b); });
  }
  function setup(){ readout(); if(!tb){ tb=buildTimeBar('t7-time',7,{dur:DUR,unit:'s',digits:1}); Anim.register(7,{dur:DUR,loop:true,autoplay:true,draw:function(tm){ draw(tm); },onTick:function(tm,p){ if(tb) tb.sync(tm,p); }}); } draw(Anim.time(7)); graph(); }
  function bind(){
    document.getElementById('t7-p').addEventListener('input',function(){ pop=+this.value; setup(); });
    document.getElementById('t7-k').addEventListener('input',function(){ kind=+this.value; setup(); });
    $$('#t7-tabs button').forEach(function(b){ b.addEventListener('click',function(){ drawCountry(b.getAttribute('data-c')); }); });
  }
  return { init:function(){ bind(); drawCountry('kr'); drawCareers(); setup(); Anim.play(7); }, graph:graph };
})();
