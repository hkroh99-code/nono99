/* ───────────────────────────────────────────────────────────────────────────
   TAB 14 — 공방 ⑦ 연구 도구함
   ① 발상기 · ② 질량 / 전력 예산 계산기(캔버스 k14-cv) · ③ 연구계획서(자동 저장) · ④ 코드 복사 · ⑤ 안전 점검표(자동 저장)
   부품 값은 시판 모듈의 대표 어림값(교육용). 동작 시간 = 0.8 × 용량 ÷ 평균 전류.
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[14] = function(){ T14.init(); };
TabDraw[14] = function(){ T14.draw(); };
var T14 = (function(){
  var PARTS=[ // [이름, 비용 천 원, 작업량 시간(1인), 기본 켜짐]
    ['문헌 · 공개 자료 조사',0,6,1], ['스마트폰 + 라이트박스(조도 앱)',10,2,1], ['OHP 필름 · 색소 · 용기',8,3,1], ['Arduino + 초음파 센서(HC-SR04)',22,8,0],
    ['서보 + 스캐너 거치대',15,6,0], ['MPU6050 · FSR 센서',12,4,0], ['젤라틴 · 한천 팬텀 재료',10,4,0], ['파이썬 코딩 · 분석',0,10,1],
    ['측정 반복 · 기록',0,8,1], ['공개 영상(NIH 등) 내려받기 · 정리',0,3,0], ['전시 · 포스터 제작',10,6,0], ['안전 점검 · 지도교사 검토',0,2,1], ['보고서 · 발표 준비',2,8,1] ];
  var BAT=[{n:1},{n:2},{n:4}];
  var COLS=['#38bdf8','#34d399','#fbbf24','#fb7185','#a78bfa','#f97316','#22d3ee','#84cc16','#e879f9','#f43f5e','#14b8a6','#eab308','#60a5fa'];
  var on=PARTS.map(function(p){ return p[3]; }), lim=50, need=30, bat=1;

  /* ── ① 발상기 ── */
  var IDEA=[
    {k:'주제 영역', v:['X선 감약 · 램버트–비어 법칙','CT 재구성 · 사이노그램','초음파 반사 · 음향 임피던스','MRI 라모어 세차 · 자기장 안전','영상 잡음 · 선량 · 화질의 거래','AI 판독 보조 · 통계 해석','영상 압축 · 창 수준 뷰어','검사 대기열 · 의료 이용 · 정책']},
    {k:'기술 · 방법', v:['스마트폰 조도 앱 + OHP 필름','HC-SR04 초음파 센서 + Arduino','파이썬 시뮬레이션','투명 필름 · 젤리 팬텀','서보 스캐너로 만든 거리 지도','MPU6050 · FSR 센서','공개 영상 + 파이썬 분석','스프레드시트 · 설문']},
    {k:'제약 조건', v:['예산 3 만 원 이하','방사선 · 강자기장 장비 사용 금지','2 주 안에 완성','측정 도구 3 종류만 사용','실제 환자 정보 사용 금지(공개 · 가상 자료만)','잡음이 큰 값싼 센서','교실 안(밝기 조절 가능)에서만']},
    {k:'평가 지표', v:['μ 의 상대 오차(%)','CNR · SNR · RMSE','음속 추정 오차(m/s)','민감도 · 특이도 · PPV','용량 대비 PSNR(dB)','평균 대기 시간(분)','설문 이해도 점수','재현성(반복 측정 표준편차)']}
  ];
  var pick=[0,0,0,0], lock=[false,false,false,false];
  function roll(){ IDEA.forEach(function(I,i){ if(!lock[i]) pick[i]=Math.floor(Math.random()*I.v.length); }); drawIdea(); }
  function sentence(){ return '「'+IDEA[0].v[pick[0]]+'」를 주제로 「'+IDEA[1].v[pick[1]]+'」를 사용하되 「'+IDEA[2].v[pick[2]]+'」 조건에서 「'+IDEA[3].v[pick[3]]+'」로 평가해 본다.'; }
  function drawIdea(){
    var host=document.getElementById('k14-ideagrid'); if(!host) return; host.innerHTML='';
    IDEA.forEach(function(I,i){ var d=document.createElement('div'); d.className='idea-cell'+(lock[i]?' lock':'');
      d.innerHTML='<div class="ik"><span>'+I.k+'</span><button type="button" aria-label="'+I.k+' 고정" aria-pressed="'+lock[i]+'">'+(lock[i]?'🔒':'🔓')+'</button></div><div class="iv">'+I.v[pick[i]]+'</div>';
      d.querySelector('button').addEventListener('click', function(){ lock[i]=!lock[i]; drawIdea(); });
      host.appendChild(d); });
    setTxt('k14-sentence', '💡 '+sentence());
  }

  /* ── ② 예산 계산기 ── */
  function totals(){ var c=0, w=0, i, team=BAT[bat].n;
    for(i=0;i<PARTS.length;i++) if(on[i]){ c+=PARTS[i][1]; w+=PARTS[i][2]; }
    return {m:c, I:w, c:c, h:w/(team*(team>1?0.8:1)), Imax:need*(team*(team>1?0.8:1))}; }
  function readout(){ var t=totals(), okM=t.m<=lim, okH=t.h<=need;
    setTxt('k14-limV', lim+' 천 원'); setTxt('k14-needV', need.toFixed(0)+' 시간');
    setTxt('k14-oM', t.m.toFixed(0)+' 천 원'); setTxt('k14-oMl', (lim-t.m>=0? '+':'')+(lim-t.m).toFixed(0)+' 천 원');
    setTxt('k14-oI', t.I.toFixed(0)+' 시간'); setTxt('k14-oH', t.h.toFixed(1)+' 시간');
    setTxt('k14-oJ', (okM&&okH)? '✅ 통과' : (!okM&&!okH? '⚠ 비용 · 시간 모두 초과' : (!okM? '⚠ 비용 초과' : '⚠ 시간 부족')));
    setTxt('k14-oC', (need-t.h>=0? '+':'')+(need-t.h).toFixed(1)+' 시간'); }
  function buildParts(){
    var host=document.getElementById('k14-parts'); if(!host) return; host.innerHTML='';
    PARTS.forEach(function(p,i){ var l=document.createElement('label');
      l.innerHTML='<input type="checkbox"'+(on[i]?' checked':'')+'><span class="sw" style="background:'+COLS[i%COLS.length]+'"></span><span class="nm">'+p[0]+'</span><span class="sp">'+p[1]+' 천 원 · '+p[2]+' h</span>';
      l.querySelector('input').addEventListener('change', function(){ on[i]=this.checked?1:0; readout(); draw(); });
      host.appendChild(l); });
  }
  function seg(ctx,x0,x1,y,h,cols,vals,names,maxV){
    var x=x0, i, W=x1-x0;
    for(i=0;i<vals.length;i++){ if(vals[i]<=0) continue; var w=W*vals[i]/maxV; ctx.fillStyle=cols[i]; ctx.fillRect(x,y,Math.max(0.5,w-1),h);
      if(w>34){ ctx.fillStyle='#07101f'; ctx.font='10.5px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(names[i].slice(0,Math.max(2,Math.floor(w/9))),x+w/2,y+h/2); }
      x+=w; }
    return x;
  }
  function draw(){
    var cv=document.getElementById('k14-cv'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, t=totals(), x0=18, x1=W-18, i, vals=[], names=[], cols=[];
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    for(i=0;i<PARTS.length;i++) if(on[i] && PARTS[i][1]>0){ names.push(PARTS[i][0]); cols.push(COLS[i%COLS.length]); vals.push(PARTS[i][1]); }
    var maxM=Math.max(lim*1.15,t.m*1.08,10), yb=52, bh=44;
    ctx.fillStyle=COL.text; ctx.font='bold 13px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic'; ctx.fillText('① 비용 예산 — 합계 '+t.m.toFixed(0)+' 천 원 / 한도 '+lim+' 천 원',x0,26);
    ctx.fillStyle='rgba(120,150,190,.12)'; ctx.fillRect(x0,yb,x1-x0,bh); seg(ctx,x0,x1,yb,bh,cols,vals,names,maxM);
    var xl=x0+(x1-x0)*lim/maxM; ctx.strokeStyle=COL.grav; ctx.lineWidth=2.4; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(xl,yb-8); ctx.lineTo(xl,yb+bh+8); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=COL.grav; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText('한도 '+lim+' 천 원',Math.min(Math.max(xl,x0+40),x1-40),yb+bh+22);
    ctx.fillStyle=t.m<=lim?COL.ok:COL.grav; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left'; ctx.fillText(t.m<=lim?'✔ 여유 '+(lim-t.m).toFixed(0)+' 천 원':'✖ '+(t.m-lim).toFixed(0)+' 천 원 초과',x0,yb+bh+42);
    names=[]; cols=[]; vals=[]; var team=BAT[bat].n, f=1/(team*(team>1?0.8:1));
    for(i=0;i<PARTS.length;i++) if(on[i] && PARTS[i][2]>0){ names.push(PARTS[i][0]); cols.push(COLS[i%COLS.length]); vals.push(PARTS[i][2]*f); }
    var maxI=Math.max(need*1.25,t.h*1.1,5), y2=yb+bh+96;
    ctx.fillStyle=COL.text; ctx.font='bold 13px system-ui,sans-serif'; ctx.textAlign='left'; ctx.fillText('② 시간 예산 — 팀 '+team+'명 · '+t.h.toFixed(1)+' 시간 (쓸 수 있는 시간 '+need+' 시간)',x0,y2-26);
    ctx.fillStyle='rgba(120,150,190,.12)'; ctx.fillRect(x0,y2,x1-x0,bh); seg(ctx,x0,x1,y2,bh,cols,vals,names,maxI);
    var xi=x0+(x1-x0)*need/maxI; ctx.strokeStyle=COL.ok; ctx.lineWidth=2.4; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(xi,y2-8); ctx.lineTo(xi,y2+bh+8); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=COL.ok; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText('가용 '+need+' 시간',Math.min(Math.max(xi,x0+40),x1-40),y2+bh+22);
    ctx.fillStyle=t.h<=need?COL.ok:COL.grav; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left'; ctx.fillText(t.h<=need?'✔ 시간 충분':'✖ '+(t.h-need).toFixed(1)+' 시간 부족',x0,y2+bh+42);
    cv.setAttribute('aria-label','비용 '+t.m.toFixed(0)+' 천 원 한도 '+lim+' 천 원, 팀 작업 시간 '+t.h.toFixed(1)+' 시간 가용 '+need+' 시간');
  }

  /* ── ③ 연구계획서 ── */
  var PIDS=['k14-p-title','k14-p-q','k14-p-h','k14-p-iv','k14-p-dv','k14-p-cv','k14-p-tool','k14-p-m','k14-p-a','k14-p-r','k14-p-s'];
  var PNM=['연구 제목','연구 질문','가설','독립변인(바꾸는 것)','종속변인(재는 것)','통제변인(같게 둘 것)','측정 도구 · 정밀도','실험 방법','예상 결과 · 분석 방법','위험 요인과 안전 대책','일정 · 역할'];
  function planText(){ var s='연구계획서 (의료영상)\n작성 : '+new Date().toLocaleDateString('ko-KR')+'\n\n';
    PIDS.forEach(function(id,i){ var el=document.getElementById(id); s+='['+(i+1)+'] '+PNM[i]+'\n'+(el&&el.value?el.value:'(미작성)')+'\n\n'; }); return s; }
  function copyText(txt, msgId){
    function ok(){ setTxt(msgId,'복사했습니다 ✔'); setTimeout(function(){ setTxt(msgId,''); },2200); }
    function fb(){ var ta=document.createElement('textarea'); ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); ok(); }catch(e){ setTxt(msgId,'복사 실패 — 직접 선택해서 복사하세요'); } document.body.removeChild(ta); }
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(ok, fb); } else fb();
  }

  /* ── ⑤ 안전 점검표 ── */
  var SAFE=[
    '<b>방사선 · 강자기장 금지</b> — 이 자료의 모든 활동은 <b>X선 · 방사성 물질 · 강한 자석 · 고출력 초음파를 쓰지 않는 안전한 유사 실험</b>이다. 실제 장비는 면허와 방호 체계가 있는 곳에서만 다룬다.',
    '<b>MRI · 자석</b> — 강한 자석(네오디뮴 등)은 손가락이 끼이고 심박조율기 · 신용카드 · 전자기기에 영향을 준다. 지도교사 감독 아래서만 다루고 약한 자석 시연으로 대신한다.',
    '<b>초음파 센서 · 스피커</b> — 큰 소리를 오래 듣지 않는다(귀 보호). 사람 몸에 의료용 초음파를 쓰는 활동은 하지 않는다.',
    '<b>전기 · 납땜</b> — 5 V 이하 저전압 회로만 쓰고, 납땜은 환기 · 보호안경과 함께 한다. 배터리 단락 · 가열에 주의한다.',
    '<b>개인정보 · 의료 정보</b> — 실제 환자의 영상 · 정보를 쓰지 않는다. 공개 · 익명 데이터와 가상 팬텀만 쓰고, 출처와 이용 조건을 확인한다.',
    '<b>의학적 주장 금지</b> — 만든 장치와 결과를 실제 진단 · 치료에 쓸 수 있다고 말하지 않는다. 「교육용 모형」임을 작품과 발표에 표기한다.',
    '<b>식품 재료 팬텀</b> — 젤라틴 · 한천 팬텀은 먹지 않고, 분말(칼슘 · 분필)은 마스크를 쓰고 다루며, 알레르기 · 위생에 유의한다.',
    '<b>정직한 보고</b> — 측정하지 않은 값을 측정한 것처럼 쓰지 않고, 실패 · 오차 · 한계를 그대로 적는다. 참고한 자료 · 코드의 출처를 쓴다.',
    '<b>통계의 윤리</b> — 선량 · 위험 · AI 성능을 설명할 때 과장 · 축소하지 않는다. 불안을 키우는 표현보다 맥락(이익과 위험)을 함께 전한다.',
    '<b>규정 · 최신성</b> — 선량 · 장비 · 제도 수치는 해마다 바뀌므로 발표 전에 공식 최신 자료로 확인한다.'
  ];
  function buildSafe(){
    var host=document.getElementById('k14-safe'); if(!host) return; host.innerHTML='';
    var st=Store.get('k14safe',null); if(!(st instanceof Array) || st.length!==SAFE.length) st=SAFE.map(function(){ return 0; });
    function upd(){ var n=st.reduce(function(a,b){ return a+(b?1:0); },0); setTxt('k14-safemsg', n+' / '+SAFE.length+' 확인'+(n===SAFE.length?' — 모두 확인했습니다 ✔':'')); }
    SAFE.forEach(function(t,i){ var l=document.createElement('label'); if(st[i]) l.className='on';
      l.innerHTML='<input type="checkbox"'+(st[i]?' checked':'')+'><span>'+t+'</span>';
      l.querySelector('input').addEventListener('change', function(){ st[i]=this.checked?1:0; l.className=st[i]?'on':''; Store.set('k14safe',st); upd(); });
      host.appendChild(l); });
    upd();
  }

  var inited=false;
  function init(){
    if(inited) return; inited=true;
    drawIdea();
    document.getElementById('k14-roll').addEventListener('click', roll);
    document.getElementById('k14-toplan').addEventListener('click', function(){
      var q=document.getElementById('k14-p-q'); if(!q) return;
      q.value=sentence(); q.dispatchEvent(new Event('input'));
      setTxt('k14-planmsg','연구 질문 칸에 넣었습니다 — 변인으로 다시 쓰세요 ✎'); setTimeout(function(){ setTxt('k14-planmsg',''); },3000);
      q.scrollIntoView({block:'center',behavior:'smooth'});
    });
    buildParts();
    function sl(id, fn){ document.getElementById(id).addEventListener('input', function(){ fn(+this.value); readout(); draw(); }); }
    sl('k14-lim', function(v){ lim=v; }); sl('k14-need', function(v){ need=v; });
    $$('input[name="k14-bat"]').forEach(function(r){ r.addEventListener('change', function(){ if(this.checked){ bat=+this.value; readout(); draw(); } }); });
    persistFields(PIDS,'k14plan');
    document.getElementById('k14-copy').addEventListener('click', function(){ copyText(planText(),'k14-planmsg'); });
    document.getElementById('k14-save').addEventListener('click', function(){
      try{ var blob=new Blob([planText()],{type:'text/plain;charset=utf-8'}), a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='연구계획서.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function(){ URL.revokeObjectURL(a.href); },1500); }catch(e){ setTxt('k14-planmsg','저장 실패 — [계획서 복사]를 이용하세요'); } });
    document.getElementById('k14-clear').addEventListener('click', function(){
      if(!confirm('연구계획서에 적은 내용을 모두 지울까요?')) return;
      PIDS.forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; }); Store.set('k14plan',null); });
    $$('[data-copy]').forEach(function(b){ b.addEventListener('click', function(){ var c=document.getElementById(b.getAttribute('data-copy')); if(!c) return; var old=b.textContent; copyText(c.textContent,'k14-none'); b.textContent='✔ 복사됨'; setTimeout(function(){ b.textContent=old; },1600); }); });
    buildSafe(); readout(); draw();
  }
  return { init:init, draw:function(){ draw(); } };
})();
