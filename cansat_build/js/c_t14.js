/* ───────────────────────────────────────────────────────────────────────────
   TAB 14 — 공방 ⑦ 연구 도구함
   ① 발상기 · ② 질량 / 전력 예산 계산기(캔버스 k14-cv) · ③ 연구계획서(자동 저장) · ④ 코드 복사 · ⑤ 안전 점검표(자동 저장)
   부품 값은 시판 모듈의 대표 어림값(교육용). 동작 시간 = 0.8 × 용량 ÷ 평균 전류.
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[14] = function(){ T14.init(); };
TabDraw[14] = function(){ T14.draw(); };
var T14 = (function(){
  var PARTS=[ // [이름, 질량 g, 평균 전류 mA, 비용 원, 기본 켜짐]
    ['캔 외피 · 프레임',40,0,2000,1], ['아두이노 나노 급 MCU',7,20,6000,1], ['BMP280 기압 센서',2,3,2500,1], ['GPS 모듈 + 안테나',14,45,15000,1],
    ['LoRa 송신 모듈',8,30,15000,1], ['IMU(MPU6050)',2,4,2500,1], ['SD 카드 로거',3,15,2000,0], ['서보 1 개(SG90 급)',9,20,3000,0],
    ['카메라(ESP32-CAM 급)',10,150,12000,0], ['열화상 센서(MLX90640)',6,23,80000,0], ['부저 · LED',2,10,500,1], ['낙하산 + 줄',30,0,3000,1], ['3D 프린트 완충재',15,0,2000,0] ];
  var BAT=[{c:250,m:7,p:3000},{c:500,m:13,p:6000},{c:1000,m:24,p:9000}];
  var COLS=['#38bdf8','#34d399','#fbbf24','#fb7185','#a78bfa','#f97316','#22d3ee','#84cc16','#e879f9','#f43f5e','#14b8a6','#eab308','#60a5fa'];
  var on=PARTS.map(function(p){ return p[4]; }), lim=350, need=2, bat=1;

  /* ── ① 발상기 ── */
  var IDEA=[
    {k:'임무 영역', v:['낙하 중 대기(기압 · 기온) 측정','목표 지점으로 돌아오는 정밀 착륙','착지 충격으로부터 부품 보호','낙하 영상 · 열화상 관측','원격측정 · 통신 성능 높이기','환경 모니터링(미세먼지 · 자외선)','소리 · 빛으로 표현하는 낙하(예술)','착지한 캔위성 회수 · 위치 추적','태양광 · 에너지 활용','낙하 속도를 정해진 값으로 제어']},
    {k:'기술 · 방법', v:['기압 센서(BMP280) 로깅','GPS + 서보 조향','3D 프린트 구조물','LoRa 원격측정 · 지향 안테나','가속도 · 자이로(IMU)','열화상 센서(MLX90640)','아두이노 규칙(임계값 · 연속 판정)','파이썬 시뮬레이션으로 예측','태양전지 + 소형 모터','스마트폰 센서 · 카메라']},
    {k:'제약 조건', v:['총 질량 350 g 이하','예산 5 만 원 이하','낙하 높이 30 m 이하(안전한 장소)','배터리 1 시간만 사용','부품 3 종류만 사용','2 주 안에 완성','잡음이 큰 값싼 센서','바람 5 m/s 이상']},
    {k:'평가 지표', v:['오차의 표준편차','낙하 속도 오차(m/s)','충격 가속도(g)','통신 성공률(%)','착륙 거리 오차(m)','에너지 사용량(Wh)','검출 성공률(%)','비용 대비 효과']}
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
  function totals(){ var m=BAT[bat].m, I=0, c=BAT[bat].p, i, rows=[];
    for(i=0;i<PARTS.length;i++) if(on[i]){ m+=PARTS[i][1]; I+=PARTS[i][2]; c+=PARTS[i][3]; }
    return {m:m, I:I, c:c, h:I>0? 0.8*BAT[bat].c/I : Infinity, Imax:0.8*BAT[bat].c/need}; }
  function readout(){ var t=totals(), okM=t.m<=lim, okH=t.h>=need;
    setTxt('k14-limV', lim+' g'); setTxt('k14-needV', need.toFixed(1)+' 시간');
    setTxt('k14-oM', t.m.toFixed(0)+' g'); setTxt('k14-oMl', (lim-t.m>=0? '+':'')+(lim-t.m).toFixed(0)+' g');
    setTxt('k14-oI', t.I.toFixed(0)+' mA'); setTxt('k14-oH', isFinite(t.h)? t.h.toFixed(1)+' 시간' : '—');
    setTxt('k14-oJ', (okM&&okH)? '✅ 통과' : (!okM&&!okH? '⚠ 질량 · 시간 모두 부족' : (!okM? '⚠ 질량 초과' : '⚠ 시간 부족')));
    setTxt('k14-oC', (Math.round(t.c/1000))+' 천 원'); }
  function buildParts(){
    var host=document.getElementById('k14-parts'); if(!host) return; host.innerHTML='';
    PARTS.forEach(function(p,i){ var l=document.createElement('label');
      l.innerHTML='<input type="checkbox"'+(on[i]?' checked':'')+'><span class="sw" style="background:'+COLS[i%COLS.length]+'"></span><span class="nm">'+p[0]+'</span><span class="sp">'+p[1]+' g · '+p[2]+' mA</span>';
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
    /* 질량 */
    names=['배터리']; cols=['#94a3b8']; vals=[BAT[bat].m];
    for(i=0;i<PARTS.length;i++) if(on[i]){ names.push(PARTS[i][0]); cols.push(COLS[i%COLS.length]); vals.push(PARTS[i][1]); }
    var maxM=Math.max(lim*1.15,t.m*1.08), yb=52, bh=44;
    ctx.fillStyle=COL.text; ctx.font='bold 13px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic'; ctx.fillText('① 질량 예산 — 총 '+t.m.toFixed(0)+' g / 한도 '+lim+' g',x0,26);
    ctx.fillStyle='rgba(120,150,190,.12)'; ctx.fillRect(x0,yb,x1-x0,bh); seg(ctx,x0,x1,yb,bh,cols,vals,names,maxM);
    var xl=x0+(x1-x0)*lim/maxM; ctx.strokeStyle=COL.grav; ctx.lineWidth=2.4; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(xl,yb-8); ctx.lineTo(xl,yb+bh+8); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=COL.grav; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText('한도 '+lim+' g',Math.min(Math.max(xl,x0+30),x1-30),yb+bh+22);
    ctx.fillStyle=t.m<=lim?COL.ok:COL.grav; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left'; ctx.fillText(t.m<=lim?'✔ 여유 '+(lim-t.m).toFixed(0)+' g':'✖ '+(t.m-lim).toFixed(0)+' g 초과',x0,yb+bh+42);
    /* 전류 */
    names=[]; cols=[]; vals=[];
    for(i=0;i<PARTS.length;i++) if(on[i] && PARTS[i][2]>0){ names.push(PARTS[i][0]); cols.push(COLS[i%COLS.length]); vals.push(PARTS[i][2]); }
    var maxI=Math.max(t.Imax*1.25,t.I*1.1,50), y2=yb+bh+96;
    ctx.fillStyle=COL.text; ctx.font='bold 13px system-ui,sans-serif'; ctx.textAlign='left'; ctx.fillText('② 전력 예산 — 평균 '+t.I.toFixed(0)+' mA → '+(isFinite(t.h)? t.h.toFixed(1):'—')+' 시간 (필요 '+need.toFixed(1)+' 시간)',x0,y2-26);
    ctx.fillStyle='rgba(120,150,190,.12)'; ctx.fillRect(x0,y2,x1-x0,bh); seg(ctx,x0,x1,y2,bh,cols,vals,names,maxI);
    var xi=x0+(x1-x0)*t.Imax/maxI; ctx.strokeStyle=COL.ok; ctx.lineWidth=2.4; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(xi,y2-8); ctx.lineTo(xi,y2+bh+8); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=COL.ok; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText('한계 전류 '+t.Imax.toFixed(0)+' mA',Math.min(Math.max(xi,x0+50),x1-50),y2+bh+22);
    ctx.fillStyle=t.h>=need?COL.ok:COL.grav; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left'; ctx.fillText(t.h>=need?'✔ 동작 시간 충분':'✖ 필요한 시간보다 '+(need-t.h).toFixed(1)+' 시간 부족',x0,y2+bh+42);
    cv.setAttribute('aria-label','질량 예산 '+t.m.toFixed(0)+' g 한도 '+lim+' g, 평균 전류 '+t.I.toFixed(0)+' mA 동작 시간 '+(isFinite(t.h)?t.h.toFixed(1):'무한')+' 시간');
  }

  /* ── ③ 연구계획서 ── */
  var PIDS=['k14-p-title','k14-p-q','k14-p-h','k14-p-iv','k14-p-dv','k14-p-cv','k14-p-tool','k14-p-m','k14-p-a','k14-p-r','k14-p-s'];
  var PNM=['연구 제목','연구 질문','가설','독립변인(바꾸는 것)','종속변인(재는 것)','통제변인(같게 둘 것)','측정 도구 · 정밀도','실험 방법','예상 결과 · 분석 방법','위험 요인과 안전 대책','일정 · 역할'];
  function planText(){ var s='연구계획서 (캔위성)\n작성 : '+new Date().toLocaleDateString('ko-KR')+'\n\n';
    PIDS.forEach(function(id,i){ var el=document.getElementById(id); s+='['+(i+1)+'] '+PNM[i]+'\n'+(el&&el.value?el.value:'(미작성)')+'\n\n'; }); return s; }
  function copyText(txt, msgId){
    function ok(){ setTxt(msgId,'복사했습니다 ✔'); setTimeout(function(){ setTxt(msgId,''); },2200); }
    function fb(){ var ta=document.createElement('textarea'); ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); ok(); }catch(e){ setTxt(msgId,'복사 실패 — 직접 선택해서 복사하세요'); } document.body.removeChild(ta); }
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(ok, fb); } else fb();
  }

  /* ── ⑤ 안전 점검표 ── */
  var SAFE=[
    '<b>전지</b> — 보호회로가 있는 리튬 전지를 쓰고, 단락 · 찌그러짐 · 부풀음이 있으면 쓰지 않는다. 충전은 지도교사 감독 아래서만.',
    '<b>시험 장소</b> — 학교 · 관리 기관의 허가를 받고 사람 · 도로 · 시설 · 동물이 없는 곳에서. 처음에는 <b>낮은 높이</b>에서 시작한다.',
    '<b>낙하 구역</b> — 아래에 사람이 없는지 확인하고 구역을 통제한다. 옥상 · 높은 곳에서는 난간 · 안전줄 · 보호 장비를 쓴다.',
    '<b>비행 관련 규정</b> — 드론 · 풍선 · 연 · 로켓을 쓸 때는 해당 지역의 항공 안전 규정(비행 금지 구역 · 높이 제한 · 허가)을 먼저 확인한다.',
    '<b>전파</b> — 허용 대역 · 출력 규정을 지키는 인증 모듈만 쓴다. 규정에 맞지 않는 출력 · 주파수는 사용하지 않는다.',
    '<b>풍선 · 헬륨</b> — 풍선 방출은 환경 · 항공 문제가 있으므로 허가 없이 방출하지 않는다(창의 C10). 헬륨 · 가스 용기는 안전하게 다룬다.',
    '<b>환경</b> — 시험 후 <b>모두 회수</b>한다(전지 · 플라스틱 · 줄). 못 찾은 부품은 위치 · 종류를 기록해 신고한다.',
    '<b>개인정보 · 윤리</b> — 카메라 · 열화상으로 사람이나 사유지를 찍을 때는 동의를 얻고, 데이터는 목적에 필요한 만큼만 저장한다.',
    '<b>기록</b> — 모든 시험의 조건 · 실패 · 사고 · 아슬아슬한 순간을 기록한다. 실패 기록은 연구의 재산이다.',
    '<b>출처 · 정직</b> — 참고한 자료 · 코드 · 아이디어의 출처를 쓰고, 측정하지 않은 값을 측정한 것처럼 쓰지 않는다.'
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
