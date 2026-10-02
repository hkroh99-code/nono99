/* ───────────────────────────────────────────────────────────────────────────
   TAB 1 — 도입 : 검사 선택 도우미(점수 = 진단 가치 + 가중 × (속도 · 저비용 · 방사선 없음)) + 타임라인
   검증(손계산) : 1번(골절) 안전 중요도 3 → wsafe=0.28 : X선 9+1.35+1.35+1.12=12.82 (1위), CT 11.51, MRI 9.28, 초음파 8.65
   ─────────────────────────────────────────────────────────────────────────── */
TabInit[1] = function(){
  var tl=document.getElementById('t1-timeline'); if(tl){
    TIMELINE.forEach(function(t){ var d=document.createElement('button'); d.type='button'; d.className='tl-card';
      d.innerHTML='<div class="yr">'+t.y+'</div><div class="nm">'+t.n+'</div><div class="ds">'+t.d+'</div><div class="lim">'+t.l+'</div>';
      d.addEventListener('click',function(){ showTab(t.go); }); tl.appendChild(d); }); }
  T1.init();
};
TabDraw[1] = function(){ T1.graph(); Anim.kick(1); };
var T1 = (function(){
  var TG=['골절(뼈)','폐렴 · 폐결절','급성 뇌출혈(응급)','무릎 인대 · 연골','태아 성장(임신)','심장 판막의 움직임'];
  var MOD=['X선','CT','초음파','MRI'], COLM=['#fbbf24','#fb7185','#7dd3fc','#a78bfa'];
  var V=[[9,9,3,6],[7,10,2,2],[1,10,0,7],[3,2,5,10],[0,1,10,3],[1,3,10,5]];
  var WS=[[.15,.15],[.2,.15],[.5,0],[.05,.1],[.1,.1],[.2,.1]];
  var SP=[9,8,9,3], CO=[9,5,10,2], SA=[4,2,10,9];
  var INFO=['뼈 · 폐 · 응급 선별(빠르고 값쌈)','단면 · 출혈 · 폐 · 복부(빠른 정밀)','실시간 · 태아 · 심장 · 복부(무방사선)','연조직 · 뇌 · 인대(방사선 없음, 느림)'];
  var WARN=['방사선 · 겹침(앞뒤 구분 어려움)','방사선 선량 · 임신 주의','공기 · 뼈 뒤는 안 보임','금속 · 심박조율기 점검 · 검사 시간 김'];
  var t=1, sf=3, tb=null, DUR=10;
  function scores(){ var ws=WS[t-1][0], wc=WS[t-1][1], wsafe=0.1+0.06*sf, r=[], m; for(m=0;m<4;m++) r.push({m:m, s:V[t-1][m]+ws*SP[m]+wc*CO[m]+wsafe*SA[m], parts:[['진단 가치',V[t-1][m]],['속도',ws*SP[m]],['저비용',wc*CO[m]],['방사선 없음',wsafe*SA[m]]]}); return r; }
  function rank(){ return scores().slice().sort(function(a,b){ return b.s-a.s; }); }
  function readout(){
    var r=rank(), best=r[0], top=best.parts.slice(1).concat([best.parts[0]]).sort(function(a,b){ return b[1]-a[1]; })[0];
    setTxt('t1-tV',TG[t-1]); setTxt('t1-sV',sf+' / 10'); setTxt('t1-oB',MOD[best.m]); setTxt('t1-oS',best.s.toFixed(1)); setTxt('t1-oN',MOD[r[1].m]+' ('+r[1].s.toFixed(1)+')');
    setTxt('t1-oW','진단 가치 '+best.parts[0][1].toFixed(0)+' + 속도 '+best.parts[1][1].toFixed(1)+' + 안전 '+best.parts[3][1].toFixed(1)); setTxt('t1-oC',WARN[best.m]);
  }
  function draw(tm){
    var cv=document.getElementById('t1-cv'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, sc=scores(), r=rank(), best=r[0].m, frac=Math.min(1,tm/2.5), top=44, bot=h-86, mx=Math.max.apply(null,sc.map(function(q){ return q.s; }))*1.12;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    cvText(ctx,'상황 : '+TG[t-1]+' · 방사선 줄이기 중요도 '+sf,12,18,COL.text,'bold 12.5px system-ui,sans-serif');
    var bw=Math.min(90,(w-60)/4-16), gx=(w-(bw*4+16*3))/2;
    sc.forEach(function(q,i){
      var x=gx+i*(bw+16), hh=(bot-top)*q.s/mx*frac, isb=(i===best);
      ctx.fillStyle=isb?COL.ok:COLM[i]; ctx.globalAlpha=isb?1:0.55; ctx.fillRect(x,bot-hh,bw,hh); ctx.globalAlpha=1; ctx.strokeStyle=isb?COL.ok:COL.axis2; ctx.lineWidth=isb?2.5:1; ctx.strokeRect(x,top,bw,bot-top);
      ctx.fillStyle=COL.text; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText((q.s*frac).toFixed(1),x+bw/2,bot-hh-3);
      ctx.textBaseline='top'; ctx.fillStyle=isb?COL.ok:COL.tick; ctx.font='bold 13px system-ui,sans-serif'; ctx.fillText(MOD[i]+(isb?' ★':''),x+bw/2,bot+6);
    });
    cvText(ctx,'알 수 있는 것 : '+INFO[best],12,h-48,COL.ok,'11.5px system-ui,sans-serif'); cvText(ctx,'주의 : '+WARN[best],12,h-28,COL.grav,'11.5px system-ui,sans-serif'); cvText(ctx,'※ 교육용 어림 판단 — 실제 검사 선택은 의사가 합니다',12,h-10,COL.tick,'10.5px system-ui,sans-serif');
    readout(); cv.setAttribute('aria-label','검사 선택 도우미. 상황 '+TG[t-1]+', 가장 알맞은 검사 '+MOD[best]);
  }
  function graph(){
    var cv=document.getElementById('t1-cv2'); if(!cv) return; var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, i, j;
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    var cols=TG.map(function(g,k){ return {n:'진단 '+(k+1), v:function(m){ return V[k][m]; }, sel:(k===t-1)}; }).concat([{n:'속도',v:function(m){ return SP[m]; }},{n:'저비용',v:function(m){ return CO[m]; }},{n:'무방사선',v:function(m){ return SA[m]; }}]);
    var x0=76, y0=44, cw=(w-x0-10)/cols.length, rh=Math.min(46,(h-y0-34)/4);
    cvText(ctx,'검사별 특성 점수 (진단 1 ~ 6 = 위 슬라이더의 상황 번호)',12,18,COL.text,'bold 12px system-ui,sans-serif');
    cols.forEach(function(c,k){ cvText(ctx,c.n,x0+k*cw+cw/2,y0-8,c.sel?COL.amber:COL.tick,(c.sel?'bold ':'')+'10.5px system-ui,sans-serif','center'); });
    for(i=0;i<4;i++){ cvText(ctx,MOD[i],x0-8,y0+i*rh+rh/2,COLM[i],'bold 12.5px system-ui,sans-serif','right','middle');
      for(j=0;j<cols.length;j++){ var v=cols[j].v(i); ctx.fillStyle='rgba(56,189,248,'+(0.08+0.62*v/10)+')'; ctx.fillRect(x0+j*cw+1,y0+i*rh+1,cw-2,rh-2); ctx.fillStyle=COL.text; ctx.font='11.5px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(String(v),x0+j*cw+cw/2,y0+i*rh+rh/2); } }
    ctx.strokeStyle=COL.amber; ctx.lineWidth=2.2; ctx.strokeRect(x0+(t-1)*cw+1,y0+1,cw-2,4*rh-2);
    cvText(ctx,TG.map(function(g,k){ return (k+1)+' '+g; }).join('  ·  '),12,h-12,COL.tick,'10.5px system-ui,sans-serif');
    cv.setAttribute('aria-label','검사별 특성 점수 표');
  }
  function setup(){ readout(); if(!tb){ tb=buildTimeBar('t1-time',1,{dur:DUR,unit:'s',digits:1}); Anim.register(1,{dur:DUR,loop:true,autoplay:true,draw:function(tm){ draw(tm); },onTick:function(tm,p){ if(tb) tb.sync(tm,p); }}); } draw(Anim.time(1)); graph(); }
  function bind(){
    document.getElementById('t1-t').addEventListener('input',function(){ t=+this.value; setup(); Anim.reset(1); Anim.play(1); });
    document.getElementById('t1-s').addEventListener('input',function(){ sf=+this.value; setup(); });
  }
  return { init:function(){ bind(); setup(); Anim.play(1); }, graph:graph };
})();
