/* ═══════════════════════════════════════════════════════════════════════════
   TAB 8 ~ 13 — 프로젝트 공방 (CanSat 형식 : R&E 10 · 창의 10 · 발명 10)
   · PROJ[id]  : 카드 내용(질문 · 재미 · 교과서 · 장치 도해 · 준비물 · 예산 · 방법 · 변인 · 기록표 · 분석 · 실패 · 업그레이드 · 평가)
   · SIMS[id]  : 미니 모의실험 {a, b, cap1, cap2, note, anim(ctx,w,h,t,a,b,S), graph(ctx,w,h,a,b,S), kv(a,b,S)}
   · 장치 도해의 ①~⑥ 이름표는 고정 칸(위 3 · 아래 3)에 두고 지시선만 그려 글자 겹침을 막는다.
   ═══════════════════════════════════════════════════════════════════════════ */
var PROJ = {}, SIMS = {};
var PTAB = { 8:['R01','R02','R03','R04','R05'], 9:['R06','R07','R08','R09','R10'], 10:['C01','C02','C03','C04','C05'], 11:['C06','C07','C08','C09','C10'], 12:['I01','I02','I03','I04','I05'], 13:['I06','I07','I08','I09','I10'] };
var PPREF = { 8:'t8', 9:'t9', 10:'k10', 11:'k11', 12:'k12', 13:'k13' };
var PTYPE = { 8:'R&E · 프로젝트', 9:'R&E · 프로젝트', 10:'창의', 11:'창의', 12:'발명', 13:'발명' };
/* SVG 조각 도우미 (패밀리 룩 색 규약) */
var SV = {
  box:function(x,y,w,h,rx){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx==null?5:rx)+'" fill="#475569" stroke="#94a3b8" stroke-width="1.3"/>'; },
  glass:function(x,y,w,h,rx){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx==null?3:rx)+'" fill="rgba(56,189,248,.05)" stroke="#5b7099" stroke-width="1.5"/>'; },
  fill:function(x,y,w,h,c){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>'; },
  circ:function(cx,cy,r,f,s,sw){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'" stroke="'+(s||'none')+'" stroke-width="'+(sw||1.3)+'"/>'; },
  ell:function(cx,cy,rx,ry,f,s){ return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+(f||'none')+'" stroke="'+(s||'none')+'" stroke-width="1.3"/>'; },
  path:function(d,c,w,dash,f){ return '<path d="'+d+'" stroke="'+c+'" stroke-width="'+(w||1.5)+'" fill="'+(f||'none')+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>'; },
  text:function(x,y,s,c,sz,anc,wt){ return '<text x="'+x+'" y="'+y+'" fill="'+(c||'#e6edf7')+'" font-size="'+(sz||11)+'"'+(anc?' text-anchor="'+anc+'"':'')+(wt?' font-weight="'+wt+'"':'')+'>'+s+'</text>'; },
  arrow:function(x1,y1,x2,y2,c,w){ var dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L, hx=x2-ux*8, hy=y2-uy*8;
    return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+c+'" stroke-width="'+(w||1.6)+'"/><path d="M'+x2+' '+y2+' L'+(hx-uy*4).toFixed(1)+' '+(hy+ux*4).toFixed(1)+' L'+(hx+uy*4).toFixed(1)+' '+(hy-ux*4).toFixed(1)+' Z" fill="'+c+'"/>'; },
  dim:function(x1,y1,x2,y2,lab,lx,ly){ var dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L;
    function head(x,y,sx,sy){ var hx=x-sx*8, hy=y-sy*8; return '<path d="M'+x+' '+y+' L'+(hx-sy*4).toFixed(1)+' '+(hy+sx*4).toFixed(1)+' L'+(hx+sy*4).toFixed(1)+' '+(hy-sx*4).toFixed(1)+' Z" fill="#a78bfa"/>'; }
    return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="#a78bfa" stroke-width="1.2"/>'+head(x2,y2,ux,uy)+head(x1,y1,-ux,-uy)+(lab? SV.text(lx,ly,lab,'#a78bfa',11.5,null,700) : ''); },
  wave:function(x1,y,x2,c){ var d='M'+x1+' '+y, x=x1; while(x<x2-8){ d+=' q4 -6 8 0 t8 0'; x+=16; } return SV.path(d,c,1.5); },
  photon:function(pts){ return pts.map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.6" fill="#fbbf24"/>'; }).join(''); },
  led:function(x,y,c){ return SV.box(x,y,34,26,5)+'<path d="M'+(x+34)+' '+(y+5)+' q12 8 0 16 Z" fill="'+(c||'#fb7185')+'" opacity=".85"/>'; },
  pd:function(x,y){ return '<rect x="'+x+'" y="'+y+'" width="20" height="26" rx="3" fill="#34d399" stroke="#94a3b8"/>'; },
  apple:function(cx,cy,r,c){ return SV.circ(cx,cy,r,c||'rgba(251,113,133,.45)','#fb7185',1.4)+SV.path('M'+cx+' '+(cy-r)+' q3 -12 10 -16','#c47a4a',2.2); }
};
function svgFig(pr){
  var slots=[[20,26],[275,26],[530,26],[20,216],[275,216],[530,216]], lead='', ttl='', dsc='', i;
  for(i=0;i<6;i++){ var s=slots[i], tg=pr.tg[i], ax=s[0]+50, ay=s[1]<100? s[1]+22 : s[1]-16;
    lead+='<path d="M'+ax+' '+ay+' L'+tg[0]+' '+tg[1]+'"/>';
    ttl+='<text x="'+s[0]+'" y="'+s[1]+'">'+'①②③④⑤⑥'[i]+' '+pr.parts[i][0]+'</text>';
    dsc+='<text x="'+s[0]+'" y="'+(s[1]+16)+'">'+pr.parts[i][1]+'</text>'; }
  return '<div class="figwrap"><svg class="fig" viewBox="0 0 780 250" role="img" aria-label="'+pr.id+' '+pr.t+' 장치 도해. '+pr.parts.map(function(p){ return p[0]; }).join(', ')+'.">'
    + pr.fig + '<g stroke="#5b7099" stroke-width="1" stroke-dasharray="3 3" fill="none">'+lead+'</g>'
    + '<g font-size="13" font-weight="700" fill="#cfe0f5">'+ttl+'</g><g font-size="11" fill="#9db0cc">'+dsc+'</g></svg></div>'
    + '<div class="figcap">그림 '+pr.id+'. '+pr.cap+'</div>';
}
function stars(n){ return '★★★'.slice(0,n)+'☆☆☆'.slice(0,3-n); }
function projD1(pr, tab){
  var h='<div class="card"><div class="h3"><span class="badge b-exp">'+pr.id+'</span><span class="badge b-mid">'+stars(pr.lv)+'</span><span class="badge b-high">'+pr.dur+' · '+pr.cost+'</span><span class="badge b-uni">'+pr.type+'</span>'+pr.icon+' '+pr.t+'</div>';
  h+='<div class="goal">🎯 '+(/R&E/.test(pr.type)?'연구 질문':'탐구 질문')+' — '+pr.q+'</div>';
  h+='<div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))"><div><div class="h4">✨ 왜 재미있나</div><p class="muted" style="color:var(--softTx)">'+pr.why+'</p></div><div><div class="h4">📚 교과서 · 원리 연결</div><p class="muted" style="color:var(--softTx)">'+pr.link+'</p></div></div>';
  h+=svgFig(pr);
  h+='<div class="h4">🧰 준비물과 역할 — 「왜 필요한가」</div><div class="parts">'+pr.parts.map(function(p,i){ return '<div class="part"><b>'+'①②③④⑤⑥'[i]+' '+p[0]+'</b>'+p[2]+'</div>'; }).join('')+'</div>';
  h+='<div class="h4">💰 예산표</div><div class="tblwrap" style="max-height:none"><table class="tbl" style="min-width:420px"><thead><tr><th style="text-align:left">품목</th><th>수량</th><th>대략 가격</th><th style="text-align:left">대체품 · 메모</th></tr></thead><tbody>'
    + pr.budget.map(function(b){ return '<tr><td style="text-align:left">'+b[0]+'</td><td>'+b[1]+'</td><td>'+b[2]+'</td><td style="text-align:left">'+b[3]+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="h4">🧪 방법 5단계</div><div class="steps">'+pr.steps.map(function(s){ return '<div class="step">'+s+'</div>'; }).join('')+'</div>';
  if(pr.predict) h+='<div class="h4">🔮 예측 결과 — 모의실험이 알려 주는 「이렇게 나올 것」</div><div class="tblwrap" style="max-height:none"><table class="tbl" style="min-width:420px"><thead><tr><th style="text-align:left">조건</th><th style="text-align:left">예상 결과</th><th style="text-align:left">근거 · 읽는 법</th></tr></thead><tbody>'
    + pr.predict.map(function(r){ return '<tr><td style="text-align:left"><b>'+r[0]+'</b></td><td style="text-align:left">'+r[1]+'</td><td style="text-align:left">'+(r[2]||'')+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="kv" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))"><div class="cell a"><span class="k">조작 변인</span><span class="v" style="font-size:.8rem;font-weight:600">'+pr.vars[0]+'</span></div><div class="cell g"><span class="k">종속 변인</span><span class="v" style="font-size:.8rem;font-weight:600">'+pr.vars[1]+'</span></div><div class="cell"><span class="k">통제 변인</span><span class="v" style="font-size:.8rem;font-weight:600">'+pr.vars[2]+'</span></div></div>';
  return h+'</div>';
}
function projD2(pr, tab){
  var h='<div class="card"><div class="h3">📋 '+pr.id+' 이어서 — 기록 · 분석 · 실패 대처 · 평가</div>';
  h+='<div class="h4">📋 데이터 기록표 예시</div><div class="tblwrap" style="max-height:none"><table class="tbl" style="min-width:380px"><thead><tr>'+pr.data.cols.map(function(c){ return '<th>'+c+'</th>'; }).join('')+'</tr></thead><tbody>'
    + pr.data.rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="h4">📈 분석 방법</div><p style="font-size:.85rem;color:var(--softTx)">'+pr.analysis+'</p>';
  if(pr.special) h+='<div class="h4">'+pr.special[0]+'</div><div class="tblwrap" style="max-height:none"><table class="tbl" style="min-width:380px"><tbody>'+pr.special[1].map(function(r){ return '<tr><td style="text-align:left;width:26%"><b>'+r[0]+'</b></td><td style="text-align:left">'+r[1]+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="h4">🧯 흔한 실패와 해결</div><div class="rulebox">'+pr.fails.map(function(f){ return '<div class="rule no">❗ '+f[0]+'</div><div class="rule ok">✔ '+f[1]+'</div>'; }).join('')+'</div>';
  h+='<div class="h4">🚀 업그레이드 · 다음 단계</div><ul class="bul" style="font-size:.84rem">'+pr.up.map(function(u){ return '<li>'+u+'</li>'; }).join('')+'</ul>';
  if(pr.next) h+='<div class="row"><button type="button" class="btn sm" data-goto="'+pr.next[1]+'">🔗 다음 단계 : '+pr.next[0]+'</button></div>';
  h+='<div class="h4">🏅 평가 기준 · 발표 팁</div><div class="tblwrap" style="max-height:none"><table class="tbl" style="min-width:380px"><thead><tr><th style="text-align:left">평가 기준</th><th style="text-align:left">이렇게 하면 좋은 점수</th></tr></thead><tbody>'
    + pr.eval.map(function(e){ return '<tr><td style="text-align:left"><b>'+e[0]+'</b></td><td style="text-align:left">'+e[1]+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<p class="tiny" style="margin-top:8px">🎤 발표 팁 — '+pr.tip+'</p>';
  return h+'</div>';
}
/* 공방 탭 초기화 */
function setupWorkshop(tab){
  var pre=PPREF[tab], ids=PTAB[tab], cur=Store.get('proj'+tab,0), S={}, tb=null, DUR=10;
  if(typeof cur!=='number' || !(cur>=0 && cur<ids.length)) cur=0;
  function pr(){ return PROJ[ids[cur]]; }
  function sim(){ return SIMS[ids[cur]]; }
  function st(){ var k=ids[cur]; if(!S[k]) S[k]={seed:1, cache:null}; return S[k]; }
  function vals(){ return [+document.getElementById(pre+'-a').value, +document.getElementById(pre+'-b').value]; }
  function fmt(sp,v){ return sp.fmt? sp.fmt(v) : (v.toFixed(sp.d==null?1:sp.d)+(sp.unit?' '+sp.unit:'')); }
  function kv(){ var v=vals(), m=sim(), rows=m.kv(v[0],v[1],st()), box=document.getElementById(pre+'-kv');
    box.innerHTML=rows.map(function(r){ return '<div class="cell '+(r[2]||'')+'"><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'; }).join('');
    setTxt(pre+'-aV', fmt(m.a, v[0])); setTxt(pre+'-bV', fmt(m.b, v[1])); }
  function drawAnim(t){
    var cv=document.getElementById(pre+'-cv'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, v=vals();
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    try{ sim().anim(ctx,w,h,t,v[0],v[1],st()); }catch(e){ console.warn('공방 모의실험', e); }
    ctx.fillStyle=COL.dim; ctx.font='10.5px system-ui,sans-serif'; ctx.textAlign='right'; ctx.textBaseline='bottom'; ctx.fillText('t = '+t.toFixed(2)+' s', w-8, h-6);
    cv.setAttribute('aria-label', pr().id+' '+pr().t+' 미니 모의실험 애니메이션');
  }
  function drawGraph(){
    var cv=document.getElementById(pre+'-cv2'); if(!cv) return;
    var s0=setupCanvas(cv), ctx=s0.ctx, w=s0.w, h=s0.h, v=vals();
    ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,w,h);
    try{ sim().graph(ctx,w,h,v[0],v[1],st()); }catch(e){ console.warn('공방 그래프', e); }
    cv.setAttribute('aria-label', pr().id+' 예상 결과 그래프');
  }
  function refresh(){ kv(); drawGraph(); drawAnim(Anim.time(tab)); }
  function select(i){
    cur=i; Store.set('proj'+tab, i);
    var P=pr(), M=sim();
    $$('#'+pre+'-pick .tl-card').forEach(function(c,j){ c.setAttribute('aria-pressed', j===i?'true':'false'); c.style.borderTopColor= j===i? 'var(--am)' : ''; c.style.background= j===i? 'var(--panel3)' : ''; });
    document.getElementById(pre+'-d1').innerHTML=projD1(P,tab);
    document.getElementById(pre+'-d2').innerHTML=projD2(P,tab);
    setTxt(pre+'-simT', P.id+' '+P.t); setTxt(pre+'-simQ', M.q||P.q.replace(/<[^>]+>/g,''));
    [['a',M.a],['b',M.b]].forEach(function(q){ var el=document.getElementById(pre+'-'+q[0]); el.min=q[1].min; el.max=q[1].max; el.step=q[1].step; el.value=q[1].val; el.setAttribute('aria-label',q[1].nm); setTxt(pre+'-'+q[0]+'N', q[1].nm); });
    setTxt(pre+'-note', M.note); setTxt(pre+'-cap1', M.cap1); setTxt(pre+'-cap2', M.cap2);
    if(window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([document.getElementById(pre+'-d1'),document.getElementById(pre+'-d2')]).catch(function(){});
    Anim.reset(tab); Anim.play(tab); refresh();
  }
  var pick=document.getElementById(pre+'-pick');
  ids.forEach(function(id,i){ var P=PROJ[id], d=document.createElement('button'); d.type='button'; d.className='tl-card';
    d.innerHTML='<div class="yr">'+P.id+' · '+stars(P.lv)+' · '+P.dur+'</div><div class="nm">'+P.icon+' '+P.t+'</div><div class="ds">'+P.one+'</div><div class="lim">'+P.cost+' · '+P.type+'</div>';
    d.addEventListener('click', function(){ select(i); var d1=document.getElementById(pre+'-d1'); if(d1 && d1.scrollIntoView) d1.scrollIntoView({behavior:'smooth', block:'start'}); });
    pick.appendChild(d); });
  ['a','b'].forEach(function(k){ document.getElementById(pre+'-'+k).addEventListener('input', function(){ st().cache=null; refresh(); }); });
  document.getElementById(pre+'-go').addEventListener('click', function(){ st().seed++; st().cache=null; Anim.reset(tab); Anim.play(tab); refresh(); });
  document.getElementById(pre+'-def').addEventListener('click', function(){ var M=sim(); document.getElementById(pre+'-a').value=M.a.val; document.getElementById(pre+'-b').value=M.b.val; st().cache=null; refresh(); });
  tb=buildTimeBar(pre+'-time', tab, {dur:DUR, unit:'s', digits:2});
  Anim.register(tab,{dur:DUR, loop:true, draw:drawAnim, onTick:function(t,p){ if(tb) tb.sync(t,p); }});
  select(cur);
  return { redraw:function(){ drawGraph(); Anim.kick(tab); }, select:select };
}
var WS={};
[8,9,10,11,12,13].forEach(function(tab){
  TabInit[tab]=function(){ WS[tab]=setupWorkshop(tab); };
  TabDraw[tab]=function(){ if(WS[tab]) WS[tab].redraw(); };
});

/* ── 미니 모의실험 공용 그리기 도우미 ───────────────────────────────── */
function cvText(ctx,s,x,y,col,font,align,base){ ctx.fillStyle=col||COL.text; ctx.font=font||'11px system-ui,sans-serif'; ctx.textAlign=align||'left'; ctx.textBaseline=base||'middle'; ctx.fillText(s,x,y); }
function cvRect(ctx,x,y,w,h,fill,stroke,lw){ if(fill){ ctx.fillStyle=fill; ctx.fillRect(x,y,w,h); } if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw||1.2; ctx.strokeRect(x,y,w,h); } }
function cvCirc(ctx,x,y,r,fill,stroke,lw){ ctx.beginPath(); ctx.arc(x,y,r,0,6.2832); if(fill){ ctx.fillStyle=fill; ctx.fill(); } if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw||1.2; ctx.stroke(); } }
function cvLine(ctx,pts,col,lw,dash){ if(pts.length<2) return; ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=lw||1.4; if(dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]); ctx.stroke(); ctx.restore(); }

