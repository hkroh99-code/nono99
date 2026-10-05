/* ══════════════════════════════════════════════
   TAB (오개념 진단) — 탭 번호는 QUIZ_TAB(TOPIC.tabs 의 role:'quiz'). 문항은 위쪽 MISCONCEPTIONS 에서 자동 생성됩니다.
   문항을 따로 손보려면 buildQuizFromMisc() 결과를 받아 고치거나, QUIZ 를 직접 덮어쓰세요.
     {t:분류, go:탭번호, q:질문, o:[보기4], a:정답번호(0부터), mis:오개념, e:설명}
   ══════════════════════════════════════════════ */
var QUIZ = buildQuizFromMisc();

(function(){
  var ANS = new Array(QUIZ.length).fill(-1);
  function build(){
    var box=document.getElementById('t10-list'); if(!box) return;
    box.innerHTML='';
    QUIZ.forEach(function(Q,i){
      var d=document.createElement('div'); d.className='qcard';
      d.innerHTML='<div class="qn">문항 '+(i+1)+' · '+Q.t+' <span class="badge b-exp">오개념 '+(i+1)+'</span></div>'
        +'<div class="qt">🤔 [예측] '+Q.q+'</div><div class="opts"></div>'
        +'<div class="poe-exp"><div class="et">🔬 [관찰 &amp; 설명] 흔한 오개념 : &ldquo;'+Q.mis+'&rdquo;</div>'+Q.e
        +'<div class="row"><button type="button" class="btn sm" data-goto="'+Q.go+'">🔗 '+Q.go+'번 탭에서 직접 확인하기</button></div></div>';
      var wrap=d.querySelector('.opts');
      Q.o.forEach(function(o,j){
        var b=document.createElement('button'); b.type='button'; b.className='opt';
        b.innerHTML='<span class="mk">'+'①②③④⑤'[j]+'</span>'+o;
        b.addEventListener('click', function(){
          if(ANS[i]>=0) return;
          ANS[i]=j;
          $$('.opt',d).forEach(function(x,k){
            if(k===Q.a) x.classList.add('ok'); else if(k===j) x.classList.add('no');
          });
          d.querySelector('.poe-exp').classList.add('on');
          update(); Store.set('quiz', ANS);
        });
        wrap.appendChild(b);
      });
      box.appendChild(d);
    });
  }
  function update(){
    var done=ANS.filter(function(v){return v>=0;}).length;
    var ok=ANS.filter(function(v,i){ return v===QUIZ[i].a; }).length;
    var bar=document.getElementById('t10-bar'); if(bar) bar.style.width=(done/QUIZ.length*100)+'%';
    setTxt('t10-prog', done+' / '+QUIZ.length+' 응답');
    setTxt('t10-score', '정답 '+ok+'개');
  }
  function report(){
    var done=ANS.filter(function(v){return v>=0;}).length;
    var ok=ANS.filter(function(v,i){ return v===QUIZ[i].a; }).length;
    var wrong=[], right=[];
    QUIZ.forEach(function(Q,i){ if(ANS[i]<0) return; (ANS[i]===Q.a?right:wrong).push(Q); });
    var now=new Date();
    var html='<p class="muted">생성 시각 : '+now.toLocaleString('ko-KR')+'</p>'
      +'<div class="kv"><div class="cell"><span class="k">응답</span><span class="v">'+done+' / '+QUIZ.length+'</span></div>'
      +'<div class="cell g"><span class="k">정답</span><span class="v">'+ok+'개</span></div>'
      +'<div class="cell r"><span class="k">교정 필요</span><span class="v">'+wrong.length+'개</span></div>'
      +'<div class="cell a"><span class="k">정답률</span><span class="v">'+(done?Math.round(ok/done*100):0)+'%</span></div></div>';
    html+='<div class="h4">🔴 아직 교정이 필요한 개념</div>';
    html+= wrong.length? '<ul class="bul">'+wrong.map(function(Q){ return '<li><b>'+Q.mis+'</b> → '+Q.e+' <span class="tiny">(관련 탭 '+Q.go+')</span></li>'; }).join('')+'</ul>'
                       : '<p class="muted">없습니다. 훌륭합니다! 👏</p>';
    html+='<div class="h4">🟢 정확히 이해한 개념</div>';
    html+= right.length? '<ul class="bul">'+right.map(function(Q){ return '<li>'+Q.t+' — '+Q.q+'</li>'; }).join('')+'</ul>'
                       : '<p class="muted">아직 없습니다.</p>';
    var poeOk=POE_LOG.filter(function(p){return p.correct;}).length;
    html+='<div class="h4">📌 탭별 POE 예측 기록</div><p class="muted">시도 '+POE_LOG.length+'회 중 예측 적중 '+poeOk+'회</p>';
    var sum=document.getElementById('t10-summary');
    sum.style.display='block';
    document.getElementById('t10-sumbody').innerHTML=html;
    if(window.MathJax&&window.MathJax.typesetPromise) window.MathJax.typesetPromise([sum]).catch(function(){});
    var plain = '학습 리포트\n생성 : '+now.toLocaleString('ko-KR')+'\n'
      +'응답 '+done+'/'+QUIZ.length+' · 정답 '+ok+'개 · 정답률 '+(done?Math.round(ok/done*100):0)+'%\n\n'
      +'[교정이 필요한 개념]\n'+(wrong.length? wrong.map(function(Q,i){ return (i+1)+'. '+Q.mis+'\n   → '+Q.e.replace(/<[^>]+>/g,'')+'\n   (관련 탭 '+Q.go+')'; }).join('\n') : '없음')
      +'\n\n[정확히 이해한 개념]\n'+(right.length? right.map(function(Q,i){ return (i+1)+'. '+Q.t+' — '+Q.q; }).join('\n') : '없음')
      +'\n\nPOE 예측 기록 : '+POE_LOG.length+'회 중 적중 '+poeOk+'회\n';
    try{
      var blob=new Blob([plain],{type:'text/plain;charset=utf-8'});
      var a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='학습리포트_'+now.getFullYear()+('0'+(now.getMonth()+1)).slice(-2)+('0'+now.getDate()).slice(-2)+'.txt';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1500);
    }catch(e){ console.warn('리포트 저장 실패', e); }
  }
  TabInit[QUIZ_TAB]=function(){
    build();
    var saved=Store.get('quiz',null);
    if(saved && saved.length===QUIZ.length){
      saved.forEach(function(v,i){
        if(v<0) return;
        var card=document.getElementById('t10-list').children[i];
        var opts=$$('.opt',card);
        if(opts[v]) opts[v].click();
      });
    }
    document.getElementById('t10-report').addEventListener('click', report);
    document.getElementById('t10-reset').addEventListener('click', function(){
      ANS=new Array(QUIZ.length).fill(-1); Store.set('quiz',ANS);
      build(); update(); document.getElementById('t10-summary').style.display='none';
    });
    update();
  };
  TabDraw[QUIZ_TAB]=function(){};
})();

/* ───────────────────────────────────────────────────────────────────────────
   TAB (실험보고서) — 「측정 → 기록 → 그래프 → 결론」을 인쇄/PDF 로 저장.
   탭 번호 = REPORT_TAB (TOPIC.tabs 의 role:'report')
   · 실험 A = REPORT_DATA(종합1 자동)   · 실험 B = REPORT_MANUAL(학생 직접 측정)
   · 실험 C·D… = REPORT_EXTRA(reportDefine 으로 등록한 종합2·3… 자동) → 결론 앞에 부분(새 장)이 저절로 생긴다
   · 보고서는 「부분(.rpt-page)」마다 새 장에서 시작한다 : 기본 4부분 → 실험을 더하면 최대 8부분.
     쪽 바닥 [n / N] 과 제목 번호(1. 2. 3. …)는 부분이 늘어나도 엔진이 다시 매긴다.
   PDF 라이브러리 없이 window.print()+@media print 만 사용(2-CDN 제약 준수).
   ─────────────────────────────────────────────────────────────────────────── */
(function(){
  /* 학생이 직접 쓰는 칸 — 여기 있는 id 는 모두 자동 저장/복원된다
     (실험 C·D… 의 방법·관찰 칸은 buildExtraPages 가 덧붙인다) */
  var FIELDS=['school','group','name','mates','date','teacher','purpose',
              'f1','w1','f2','w2','f3','w3','f4','w4',
              'hyp1','hyp2','hyp3','methodA','obsA','LB',
              'mk','mlam','mdiff','concl',
              'e1a','e1b','e1c','e2a','e2b','e2c','e3a','e3b','e3c',
              'q1','q2','free','s1','s2','s3','s4'];
  var STORE_KEY='report11', BKEY='report11B';
  var MANUAL=[];                       // 실험 B : 학생이 직접 적는 [{a:조작변인, W:측정값, memo}]
  var DEFAULT_A=REPORT_MANUAL.seeds.slice();

  function loadSaved(){
    /* 저장값은 모양까지 검사한다 — JSON.parse 가 성공했다는 것만으로는
       배열/객체 모양이 맞는지 알 수 없고, 어긋나면 표가 통째로 사라진다. */
    var s=Store.get(STORE_KEY,null);
    if(s && typeof s==='object' && !(s instanceof Array)){
      FIELDS.forEach(function(k){
        var el=document.getElementById('t11-'+k);
        if(el && s[k]!=null && typeof s[k]!=='object') el.value=s[k];
      });
    }
    var b=Store.get(BKEY,null), okB=false, i;
    if(b instanceof Array && b.length){
      okB=true;
      for(i=0;i<b.length;i++){
        if(!b[i] || typeof b[i]!=='object' || (b[i] instanceof Array)){ okB=false; break; }
      }
    }
    MANUAL = okB
      ? b.map(function(r){ return { a:String(r.a==null?'':r.a),
                                    W:String(r.W==null?'':r.W),
                                    memo:String(r.memo==null?'':r.memo) }; })
      : DEFAULT_A.map(function(a){ return {a:a, W:'', memo:''}; });
  }
  function saveNow(){
    var s={}; FIELDS.forEach(function(k){ var el=document.getElementById('t11-'+k); if(el) s[k]=el.value; });
    Store.set(STORE_KEY,s); Store.set(BKEY,MANUAL);
  }
  /** 여러 줄 입력칸이 내용만큼 늘어나게 — 인쇄할 때 잘리지 않는다(쓴 만큼 자유롭게 확장).
      탭이 숨겨져 있거나 폭이 잡히지 않은 순간에 계산하면 줄바꿈이 폭발해 엉뚱하게 커지므로,
      폭이 제대로 잡혔을 때만 조정한다(탭을 열거나 창 크기가 바뀌면 TabDraw 가 다시 부른다). */
  function grow(el){
    if(!el) return;
    if(!el.offsetParent || el.getBoundingClientRect().width < 60){ el.style.height=''; return; }
    el.style.height='auto';
    el.style.height=(el.scrollHeight+2)+'px';
  }
  function growAll(){ $$('#t11-printarea textarea').forEach(grow); }

  /* ── 실험 C·D… : reportDefine 으로 등록한 자동 수집 실험마다 보고서 한 부분(새 장)을 만든다 ──
     결론 부분(#t11-pageEnd) 바로 앞에 형제로 끼운다 — 감싸는 div 를 두면
     .rpt-page:last-child 가 어긋나 결론이 앞 장에 붙어 버린다. */
  function buildExtraPages(){
    var end=document.getElementById('t11-pageEnd'); if(!end) return;
    REPORT_EXTRA.forEach(function(E){
      if(document.getElementById('t11-page'+E.key)) return;       // 이미 만들었으면 그대로
      var K=E.key, line=(E.mode!=='points');
      var d=document.createElement('div');
      d.className='card report-paper rpt-page'; d.id='t11-page'+K;
      d.innerHTML=
        '<h4>0. 실험 '+K+' &mdash; '+(E.title||'⟪실험 '+K+' 이름⟫')
          +' <span class="tiny" style="font-weight:400">(데이터 자동 수집)</span></h4>'
       +'<div class="rpt-hint">'+(E.hint || ('<b>'+(E.tabName||'[종합]')+'</b> 탭에서 조건을 바꿔가며 <b>[측정 기록]</b> 을 누르면, '
          +'그 값이 아래 표에 <b>자동으로</b> 쌓이고 그래프도 함께 그려집니다. (5개 이상 모으세요)'))+'</div>'
       +'<div class="rpt-q"><b>실험 방법</b> &mdash; 내가 한 순서대로 쓰기</div>'
       +'<textarea id="t11-method'+K+'" rows="4"></textarea>'
       +'<div class="rpt-q"><b>측정 데이터</b> <span class="tiny" id="t11-cnt'+K+'">0개</span></div>'
       +'<div style="overflow-x:auto"><table id="t11-tbl'+K+'"><thead></thead><tbody></tbody></table></div>'
       +'<div class="rpt-q"><b>그래프'+(line?'와 회귀직선':'')+'</b></div>'
       +'<canvas id="t11-cv'+K+'" width="640" height="225" style="width:100%;max-width:560px;height:200px;border:1px solid #d3dae3;border-radius:6px"></canvas>'
       +'<div class="rpt-q"><b>결과</b></div>'
       +'<div id="t11-result'+K+'" style="font-size:.88rem"></div>'
       +'<div class="rpt-q">'+(E.question||'이 결과를 보고 알게 된 것을 한두 문장으로 쓰자. (가설과 비교하면?)')+'</div>'
       +'<textarea id="t11-obs'+K+'" rows="3"></textarea>'
       +'<div class="rpt-foot"><span class="rpt-no"></span> &nbsp;·&nbsp; 실험 '+K+'</div>';
      end.parentNode.insertBefore(d, end);
      if(E.method){ var m=document.getElementById('t11-method'+K); if(m) m.value=E.method; }
      FIELDS.push('method'+K, 'obs'+K);
    });
  }
  /** 쪽 바닥 [n / N] 과 h4 제목 번호(1. 2. …)를 부분 수에 맞게 다시 매긴다 */
  function numberParts(){
    var pages=$$('#t11-printarea .rpt-page'), n=pages.length;
    pages.forEach(function(p,i){ var no=p.querySelector('.rpt-no'); if(no) no.textContent='['+(i+1)+' / '+n+']'; });
    var k=0;
    $$('#t11-printarea h4').forEach(function(h){
      var t=h.firstChild;
      if(t && t.nodeType===3 && /^\s*\d+\./.test(t.nodeValue)){ k++; t.nodeValue=t.nodeValue.replace(/^\s*\d+\./, k+'.'); }
    });
    return n;
  }

  /* ── 자동 수집 표 ─────────────────────────────────────────────────────── */
  function renderRows(tblId, cols, rows){
    var thead=document.querySelector('#'+tblId+' thead'), tbody=document.querySelector('#'+tblId+' tbody');
    if(!thead||!tbody) return;
    thead.innerHTML='<tr>'+(cols||[]).map(function(c){ return '<th>'+c+'</th>'; }).join('')+'</tr>';
    tbody.innerHTML='';
    rows.forEach(function(r){
      var tr=document.createElement('tr');
      tr.innerHTML=r.cells.map(function(c){ return '<td>'+c+'</td>'; }).join('');
      tbody.appendChild(tr);
    });
  }
  function renderTable(){
    renderRows('t11-tbl', REPORT_DATA.cols, REPORT_DATA.rows);
    var n=REPORT_DATA.rows.length;
    setTxt('t11-cnt2', n+'개 측정');
    setTxt('t11-cnt', REPORT_EXTRA.length
      ? ['A '+n+'개'].concat(REPORT_EXTRA.map(function(E){ return E.key+' '+E.rows.length+'개'; })).join(' · ')
      : n+'개');
  }
  /* ── 실험 B : 학생이 직접 채우는 표 ─────────────────────────────────────── */
  function derivedText(x,y){
    var d=REPORT_MANUAL.derived(x,y);
    return (d==null || !isFinite(d)) ? '—' : (Math.abs(d)>=100 ? d.toFixed(1) : d.toFixed(2));
  }
  function renderManual(){
    var tb=document.querySelector('#t11-tblB tbody'); if(!tb) return;
    var th=document.querySelector('#t11-tblB thead');
    if(th) th.innerHTML='<tr><th style="width:34px">#</th><th>'+REPORT_MANUAL.colX+'</th>'
      +'<th>'+REPORT_MANUAL.colD+'</th><th>'+REPORT_MANUAL.colY+'</th><th>메모</th></tr>';
    tb.innerHTML='';
    MANUAL.forEach(function(r,i){
      var tr=document.createElement('tr');
      tr.innerHTML='<td>'+(i+1)+'</td>'
        +'<td><input type="text" data-mi="'+i+'" data-mk="a" value="'+(r.a||'')+'" placeholder="'+REPORT_MANUAL.placeholderX+'"></td>'
        +'<td class="rpt-auto">'+derivedText(parseFloat(r.a), parseFloat(r.W))+'</td>'
        +'<td><input type="text" data-mi="'+i+'" data-mk="W" value="'+(r.W||'')+'" placeholder="'+REPORT_MANUAL.placeholderY+'"></td>'
        +'<td><input type="text" data-mi="'+i+'" data-mk="memo" value="'+(r.memo||'')+'"></td>';
      tb.appendChild(tr);
    });
    $$('#t11-tblB input').forEach(function(el){
      el.addEventListener('input', function(){
        var i=+el.getAttribute('data-mi');
        MANUAL[i][el.getAttribute('data-mk')]=el.value;
        var tr=el.parentNode.parentNode, cell=tr.children[2];
        if(cell) cell.textContent=derivedText(parseFloat(MANUAL[i].a), parseFloat(MANUAL[i].W));
        drawManual(); saveNow();
      });
    });
  }
  /** 학생이 적은 값 → 그래프 위의 점 → 최소제곱 회귀 */
  function manualFit(){
    var pts=[];
    MANUAL.forEach(function(r){
      var x=parseFloat(r.a), y=parseFloat(r.W);
      if(!isFinite(x)||!isFinite(y)) return;
      var d=REPORT_MANUAL.derived(x,y);
      if(d==null||!isFinite(d)) return;
      var p=REPORT_MANUAL.point(x,y,d);
      if(isFinite(p[0])&&isFinite(p[1])) pts.push(p);
    });
    if(pts.length<2) return {pts:pts, fit:null};
    return {pts:pts, fit:ols(pts,false)};
  }
  /* ── 흰 종이용 그래프 ─────────────────────────────────────────────────── */
  function tickFmt(v, span){
    var a=Math.abs(span);
    return a>=100 ? v.toFixed(0) : a>=10 ? v.toFixed(1) : a>=1 ? v.toFixed(2) : v.toFixed(3);
  }
  /** 산점도(+회귀직선) — 앱 테마와 상관없이 항상 밝게(인쇄 대비) 그린다.
      opt.noFit : 점만 찍는다(분포·비교형)   opt.zero : false 면 원점을 억지로 넣지 않는다(기본은 원점 포함)
      음수 값(온도 하강·압축 때의 일 등)이 있으면 축을 그만큼 넓혀 그대로 그린다. */
  function plotXY(cvId, pts, xLabel, yLabel, opt){
    opt=opt||{};
    var cv=document.getElementById(cvId); if(!cv) return null;
    var s=setupCanvas(cv), ctx=s.ctx, w=s.w, h=s.h;
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,w,h);
    pts=pts.filter(function(p){ return isFinite(p[0]) && isFinite(p[1]); });
    var withZero=(opt.zero!==false);
    function range(arr){
      var lo=0, hi=1;
      if(arr.length){ lo=Math.min.apply(null,arr); hi=Math.max.apply(null,arr); }
      if(withZero){ lo=Math.min(lo,0); hi=Math.max(hi,0); }
      if(hi-lo<=0){ var c=hi, dd=(Math.abs(c)||1)*0.5; lo=c-dd; hi=c+dd; }
      var sp=hi-lo;
      if(!(withZero && lo===0)) lo-=sp*0.10;   // 원점에 붙은 쪽은 그대로, 나머지는 여백
      hi+=sp*0.16;
      return [lo,hi];
    }
    var xr=range(pts.map(function(p){return p[0];})), yr=range(pts.map(function(p){return p[1];}));
    var xmin=xr[0], xmax=xr[1], ymin=yr[0], ymax=yr[1];
    var pad={l:54,r:16,t:14,b:34};
    var x0=pad.l, x1=w-pad.r, y0=h-pad.b, y1=pad.t;
    function X(v){ return x0+(v-xmin)/(xmax-xmin)*(x1-x0); }
    function Y(v){ return y0-(v-ymin)/(ymax-ymin)*(y0-y1); }
    ctx.strokeStyle='#e6eaf0'; ctx.fillStyle='#64748b'; ctx.font='10px system-ui,sans-serif'; ctx.lineWidth=1;
    for(var i=0;i<=5;i++){
      var xv=xmin+(xmax-xmin)*i/5, yv=ymin+(ymax-ymin)*i/5;
      ctx.beginPath(); ctx.moveTo(X(xv),y0); ctx.lineTo(X(xv),y1); ctx.stroke();
      ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillText(tickFmt(xv,xmax-xmin), X(xv), y0+4);
      ctx.beginPath(); ctx.moveTo(x0,Y(yv)); ctx.lineTo(x1,Y(yv)); ctx.stroke();
      ctx.textAlign='right'; ctx.textBaseline='middle'; ctx.fillText(tickFmt(yv,ymax-ymin), x0-5, Y(yv));
    }
    ctx.strokeStyle='#94a3b8';
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y0); ctx.moveTo(x0,y0); ctx.lineTo(x0,y1); ctx.stroke();
    ctx.strokeStyle='#b6c2d1';                              // 0 이 축 안쪽에 있으면 0 선을 조금 진하게
    if(ymin<0 && ymax>0){ ctx.beginPath(); ctx.moveTo(x0,Y(0)); ctx.lineTo(x1,Y(0)); ctx.stroke(); }
    if(xmin<0 && xmax>0){ ctx.beginPath(); ctx.moveTo(X(0),y0); ctx.lineTo(X(0),y1); ctx.stroke(); }
    ctx.fillStyle='#334155'; ctx.font='11px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText(xLabel, (x0+x1)/2, h-16);
    ctx.save(); ctx.translate(14,(y0+y1)/2); ctx.rotate(-Math.PI/2); ctx.textAlign='center'; ctx.fillText(yLabel,0,0); ctx.restore();
    ctx.fillStyle='#2563eb';
    pts.forEach(function(p){ ctx.beginPath(); ctx.arc(X(p[0]),Y(p[1]),3.6,0,6.2832); ctx.fill(); });
    var fit = (!opt.noFit && pts.length>=2) ? ols(pts,false) : null;
    if(fit){
      ctx.save(); ctx.beginPath(); ctx.rect(x0,y1,x1-x0,y0-y1); ctx.clip();
      ctx.strokeStyle='#dc2626'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.moveTo(X(xmin),Y(fit.a*xmin+fit.b)); ctx.lineTo(X(xmax),Y(fit.a*xmax+fit.b)); ctx.stroke();
      ctx.restore();
      ctx.fillStyle='#334155'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.font='10.5px system-ui,sans-serif';
      ctx.fillText('y = '+fit.a.toFixed(4)+'x '+(fit.b>=0?'+ ':'− ')+Math.abs(fit.b).toFixed(4)
                   +'  (R² = '+fit.r2.toFixed(4)+')', x0+6, y1+2);
    } else if(!pts.length || !opt.noFit){
      ctx.fillStyle='#94a3b8'; ctx.font='11.5px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(opt.noFit ? '측정하면 여기에 점이 찍힙니다' : '점이 2개 이상 있어야 직선을 그립니다', (x0+x1)/2, (y0+y1)/2);
    }
    cv.setAttribute('aria-label', yLabel+' 대 '+xLabel+' 그래프. 데이터 '+pts.length+'개');
    return fit;
  }
  /* ── 결과 문장 ── */
  function fmtV(v,d){ return (v==null || !isFinite(v)) ? '—' : v.toFixed(d==null?1:d); }
  /** interpret 가 없거나 계산이 실패해도 보고서가 멈추지 않게 */
  function interp(fn, fit, rows){
    if(typeof fn!=='function') return null;
    try{ var r=fn(fit, rows); return (r && isFinite(r.value)) ? r : null; }
    catch(e){ console.warn('보고서 결과 계산 오류', e); return null; }
  }
  function showResult(out, fit, ip, emptyMsg){
    if(!out) return;
    if(ip){
      var d=ip.digits, u=ip.unit ? ' '+ip.unit : '';        // 단위가 없으면 빈칸도 없게
      var err=(ip.trueValue!=null && ip.trueValue!==0) ? (ip.value-ip.trueValue)/ip.trueValue*100 : null;
      out.innerHTML=(fit ? '<div>회귀직선의 기울기 k = <b>'+fit.a.toFixed(4)+'</b> (R² = '+fit.r2.toFixed(4)+')</div>' : '')
        +(ip.formula ? '<div style="margin-top:3px">'+ip.formula+'</div>' : '')
        +'<div style="font-size:1.05rem;margin-top:3px">→ <b>'+ip.label+' = '+fmtV(ip.value,d)+u+'</b>'
        +(err!=null ? '　(참값 '+ip.trueValue+u+', 오차 '+(err>=0?'+':'')+err.toFixed(2)+'%)' : '')+'</div>';
    } else if(fit){
      out.innerHTML='<div>기울기 = '+fit.a.toFixed(4)+', R² = '+fit.r2.toFixed(4)+'</div>';
    } else {
      out.innerHTML='<div style="color:#94a3b8">'+emptyMsg+'</div>';
    }
  }
  /* ── 실험 A(자동 수집) 그래프 + 결과 ── */
  function drawAuto(){
    var pts=REPORT_DATA.rows.map(function(r){ return [r.x,r.y]; });
    var fit=plotXY('t11-cv', pts, REPORT_DATA.xLabel, REPORT_DATA.yLabel, {zero:REPORT_DATA.zero!==false});
    showResult(document.getElementById('t11-result'), fit, fit ? interp(REPORT_DATA.interpret, fit, REPORT_DATA.rows) : null,
      '<b>'+(REPORT_DATA.tabName||'[종합1]')+'</b> 탭에서 조건을 바꿔가며 <b>[측정 기록]</b> 을 2번 이상 누르면 '
      +'여기에 표·그래프·결과가 채워집니다.');
  }
  /* ── 실험 C·D…(자동 수집 추가) ── */
  function drawExtras(){
    REPORT_EXTRA.forEach(function(E){
      renderRows('t11-tbl'+E.key, E.cols, E.rows);
      setTxt('t11-cnt'+E.key, E.rows.length+'개 측정');
      var line=(E.mode!=='points');
      var pts=E.rows.map(function(r){ return [r.x,r.y]; });
      var fit=plotXY('t11-cv'+E.key, pts, E.xLabel, E.yLabel, {noFit:!line, zero:E.zero!==false});
      var ip = line ? (fit ? interp(E.interpret, fit, E.rows) : null)
                    : (E.rows.length ? interp(E.interpret, null, E.rows) : null);
      showResult(document.getElementById('t11-result'+E.key), fit, ip,
        '<b>'+(E.tabName||'[종합]')+'</b> 탭에서 <b>[측정 기록]</b> 을 '+(line?'2번':'1번')
        +' 이상 누르면 여기에 표·그래프·결과가 채워집니다.');
    });
  }
  /* ── 실험 B(직접 측정) 그래프 ── */
  function drawManual(){
    var m=manualFit();
    plotXY('t11-cv2', m.pts, REPORT_MANUAL.gx, REPORT_MANUAL.gy, {zero:REPORT_MANUAL.zero!==false});
  }
  /** 지금 쓴 분량이 A4 몇 장이 될지 어림해 보여 준다.
      <b>기본 쪽수 = 보고서 부분(.rpt-page) 수</b>(4~8, 자동). 학생이 많이 쓰면 늘어나는 것이 자연스러우므로
      <b>8쪽까지는 조용히 두고</b>, 그보다 많을 때만 색으로 알려 준다. <b>어느 경우에도 인쇄를 막지 않으며,
      분량을 맞추려고 학생 입력칸이나 측정 표를 무리하게 줄이지 않는다.</b>
      화면 폭이 좁으면 글이 더 여러 줄로 접혀 실제 인쇄보다 길게 나오므로, 재는 동안만
      보고서를 <b>A4 인쇄영역 크기(가로 180mm ≒ 680px)</b>로 맞춰 놓고 잰 뒤 되돌린다. */
  var A4W=680, A4H=1017;                    // A4 인쇄영역(180mm × 269mm) @96dpi
  var PAGE_OK=8;                            // 8쪽까지는 정상(경고 없음) · 기본 쪽수는 부분 수로 자동
  function updatePageCount(){
    var el=document.getElementById('t11-pages'), area=document.getElementById('t11-printarea');
    if(!el || !area) return;
    var pages=$$('#t11-printarea .rpt-page');
    if(!pages.length || !pages[0].offsetParent) return;   // 탭이 숨겨져 있으면 그대로 둔다
    var PAGE_BASE=pages.length, LIMIT=Math.max(PAGE_OK, PAGE_BASE);
    var pw=area.style.width, pm=area.style.maxWidth;
    area.style.width=A4W+'px'; area.style.maxWidth='none';
    growAll();                                            // 그 폭에서 서술칸 높이를 다시 잡고
    var total=0;
    pages.forEach(function(p){
      var cs=getComputedStyle(p);
      var h=p.getBoundingClientRect().height-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
      if(h<=1) return;
      total += Math.max(1, Math.ceil(h/A4H));
    });
    area.style.width=pw; area.style.maxWidth=pm;
    growAll();                                            // 화면 폭으로 되돌린다
    if(!total) return;
    var many = total > LIMIT;
    el.textContent = '예상 인쇄 분량 '+total+'쪽'
                   + (total>PAGE_BASE && !many ? ' (정상)' : '');
    el.style.color = many ? 'var(--am)' : 'var(--dim)';
    el.title = many
      ? '내용이 많아 A4 '+LIMIT+'쪽을 넘었습니다('+total+'쪽). 그대로 인쇄해도 됩니다 — 꼭 줄여야 하는 것은 아닙니다.'
      : (total<=PAGE_BASE
          ? '보고서 '+PAGE_BASE+'부분이 A4 '+PAGE_BASE+'쪽에 알맞게 들어갑니다.'
          : 'A4 '+total+'쪽 — 기본 '+PAGE_BASE+'쪽에서 늘어났지만 '+LIMIT+'쪽까지는 정상입니다.');
  }
  /** 타이핑 중에는 계속 재지 않고 잠깐 멈췄을 때 한 번만 잰다(레이아웃 부담 줄이기) */
  var pcTimer=null;
  function schedulePageCount(){ clearTimeout(pcTimer); pcTimer=setTimeout(updatePageCount, 180); }
  function renderAll(){ renderTable(); drawAuto(); drawManual(); drawExtras(); growAll(); updatePageCount(); }

  /* ── 인쇄 : 보고서를 잠시 body 바로 밑으로 옮겨 쪽 나눔이 그대로 나오게 한다 ────────
     (FSX 전체화면과 같은 자리 바꿔치기 방식. position:fixed 로는 2쪽부터 잘린다) */
  var holder=null;
  function beginPrint(){
    var pa=document.getElementById('t11-printarea');
    if(!pa || holder) return;
    growAll();
    holder=document.createElement('span'); holder.hidden=true;
    pa.parentNode.insertBefore(holder, pa);
    document.body.appendChild(pa);
    document.body.classList.add('printing');
  }
  function endPrint(){
    var pa=document.getElementById('t11-printarea');
    if(!pa || !holder) return;
    holder.parentNode.insertBefore(pa, holder);
    holder.parentNode.removeChild(holder);
    holder=null;
    document.body.classList.remove('printing');
  }
  /** 실험 B 를 견줄 실험 키 : 'A'(기본) · 'C'~'F' · null(비교 안 함) */
  function cmpKey(){ var c=REPORT_MANUAL.compareWith; return (c===undefined) ? 'A' : c; }

  TabInit[REPORT_TAB]=function(){
    buildExtraPages();                                    // ① 실험 C·D… 부분을 먼저 만들고
    var nParts=numberParts();                             // ② 쪽 바닥 [n / N] · 제목 번호를 다시 매긴 뒤
    if(nParts>PAGE_OK) console.warn('보고서 부분이 '+nParts+'개입니다 — 8부분(8쪽) 이하로 설계하세요.');
    loadSaved();                                          // ③ 저장해 둔 글을 채운다
    renderManual();
    document.getElementById('t11-import').addEventListener('click', renderAll);
    document.getElementById('t11-clear').addEventListener('click', function(){
      var keys=['A'].concat(REPORT_EXTRA.map(function(E){ return E.key; })).join('·');
      if(confirm('자동 수집 데이터(실험 '+keys+')를 지울까요? 직접 쓴 글과 실험 B 값은 그대로 남습니다.')){
        reportClear(); REPORT_EXTRA.forEach(function(E){ E.rows.length=0; }); renderAll();
      }
    });
    document.getElementById('t11-reset').addEventListener('click', function(){
      if(!confirm('보고서에 적은 내용을 모두 지울까요? (되돌릴 수 없습니다)')) return;
      FIELDS.forEach(function(k){ var el=document.getElementById('t11-'+k); if(el && k!=='LB') el.value=''; });
      MANUAL=DEFAULT_A.map(function(a){ return {a:a, W:'', memo:''}; });
      Store.set(STORE_KEY,null); Store.set(BKEY,null);
      renderManual(); renderAll();
    });
    document.getElementById('t11-print').addEventListener('click', function(){
      saveNow(); renderAll(); beginPrint(); window.print(); endPrint();
    });
    /* 브라우저의 Ctrl+P 로 인쇄해도 보고서만 나오도록 */
    window.addEventListener('beforeprint', function(){ if(curTab===REPORT_TAB) beginPrint(); });
    window.addEventListener('afterprint', endPrint);

    document.getElementById('t11-addrow').addEventListener('click', function(){
      if(MANUAL.length>=14){ alert('측정 칸은 14개까지 만들 수 있습니다.'); return; }
      MANUAL.push({a:'', W:'', memo:''}); renderManual(); drawManual(); updatePageCount(); saveNow();
    });
    document.getElementById('t11-delrow').addEventListener('click', function(){
      if(MANUAL.length<=2) return;
      MANUAL.pop(); renderManual(); drawManual(); updatePageCount(); saveNow();
    });
    document.getElementById('t11-clearB').addEventListener('click', function(){
      if(!confirm('직접 측정해 적은 값을 지울까요?')) return;
      MANUAL=DEFAULT_A.map(function(a){ return {a:a, W:'', memo:''}; });
      renderManual(); drawManual(); saveNow();
    });
    /* 실험 B 의 보조 상수 입력칸 — REPORT_MANUAL.aux 가 없으면 감춘다 */
    var auxWrap=document.getElementById('t11-auxwrap');
    if(REPORT_MANUAL.aux){
      setTxt('t11-auxlabel', REPORT_MANUAL.aux.label);
      setTxt('t11-auxunit', REPORT_MANUAL.aux.unit||'');
      var auxIn=document.getElementById('t11-LB');
      if(auxIn && !auxIn.value) auxIn.value=REPORT_MANUAL.aux.value;
    } else if(auxWrap){ auxWrap.hidden=true; }

    var cw=cmpKey();
    setTxt('t11-cmplabel', cw ? '실험 '+cw+' 에서 구한 값과의 차이 (%)' : '다른 실험과의 비교 (이 보고서에서는 하지 않음)');

    /* ✅ 내 계산 확인 — 먼저 학생이 적고, 눌러서 맞춰 본다 */
    document.getElementById('t11-check').addEventListener('click', function(){
      var m=manualFit();
      if(!m.fit){ alert('먼저 실험 B 표에 측정값을 2줄 이상 적어 주세요.'); return; }
      var Lb=null;
      if(REPORT_MANUAL.aux){
        Lb=parseFloat(document.getElementById('t11-LB').value);
        if(!isFinite(Lb)||Lb<=0){ alert(REPORT_MANUAL.aux.label+' 값을 먼저 적어 주세요.'); return; }
      }
      var ip=REPORT_MANUAL.interpret(m.fit, Lb), d=ip.digits;
      setTxt('t11-ck',  ip.slopeText+'  (R²='+m.fit.r2.toFixed(4)+')');
      setTxt('t11-clam', fmtV(ip.value,d)+' '+ip.unit);
      if(!cw){ setTxt('t11-cdiff', '—'); return; }
      var src=(cw==='A') ? REPORT_DATA : reportExtra(cw);
      var rs=src ? src.rows.map(function(r){ return [r.x,r.y]; }).filter(function(p){ return isFinite(p[0])&&isFinite(p[1]); }) : [];
      var ipS=(src && rs.length>=2) ? interp(src.interpret, ols(rs,false), src.rows) : null;
      if(ipS && ipS.value){
        setTxt('t11-cdiff', ((ip.value-ipS.value)/ipS.value*100).toFixed(2)+' %  (실험 '+cw+' : '+fmtV(ipS.value,d)+' '+ip.unit+')');
      } else {
        setTxt('t11-cdiff', '실험 '+cw+' 데이터가 없어 비교할 수 없습니다');
      }
    });

    FIELDS.forEach(function(k){
      var el=document.getElementById('t11-'+k); if(!el) return;
      el.addEventListener('change', saveNow);
      if(el.tagName==='TEXTAREA') el.addEventListener('input', function(){ grow(el); schedulePageCount(); });
    });
    renderAll();
  };
  TabDraw[REPORT_TAB]=function(){ renderAll(); };
})();
