/* ═══════════════════════════════════════════════════════════════════════════
   인터랙티브 실험실 — 「사이펀 만들기」 (탭 3 안에 붙는다)
   정점(주황 점)과 출구(분홍 점)를 직접 끌어 높이를 바꾸고, 주사기로 시동하고, 공기 방울을 넣어 보며
   언제 흐르고 언제 멈추는지(출구 높이 · 정점 압력 · 입구 노출 · 기포) 예측하고 확인한다.
   배율 ×10 은 그림의 1 cm 가 실제 10 cm 인 「실제 건물 규모」 — 정점 10 m 한계를 볼 수 있다.
   ═══════════════════════════════════════════════════════════════════════════ */
function siphLab(){
  var host=document.getElementById('tab3'); if(!host||document.getElementById('lab3')) return;
  var card=document.createElement('div'); card.className='card'; card.id='lab3';
  card.innerHTML='<div class="h3">🧪 사이펀 만들기 실험실 <span class="badge b-high">직접 끌어 보기</span></div>'+
   '<div class="goal">🎯 그림의 <b style="color:#fbbf24">주황 점(정점)</b>과 <b style="color:#fb7185">분홍 점(출구)</b>을 위아래로 <b>끌어서</b> 높이를 바꾸세요. 먼저 [💉 주사기로 시동] 을 눌러 관을 물로 채워야 흐릅니다(입으로 빨지 않습니다). 출구를 위 수면보다 높이거나, 정점을 너무 높이거나, 공기 방울을 넣으면 어떻게 될까요? 배율 ×10 에서는 정점이 10 m 를 넘으면 끊깁니다.</div>'+
   '<div class="grid2"><div>'+
   '<div class="row"><button type="button" class="btn sm pri" id="L3-pump">💉 주사기로 시동</button><button type="button" class="btn sm" id="L3-bub">🫧 공기 방울 넣기(+5 cm)</button><button type="button" class="btn sm" id="L3-unb">방울 빼기</button><button type="button" class="btn sm" id="L3-refill">🔄 물 채우기 · 처음으로</button></div>'+
   '<div class="row" role="group" aria-label="배율"><span class="tiny">배율 :</span><button type="button" class="btn sm pri" id="L3-f1">×1 (실험실 모형)</button><button type="button" class="btn sm" id="L3-f10">×10 (실제 건물 규모)</button></div>'+
   '<div class="easy"><div class="et">🤔 예측 — 출구를 위 통의 수면보다 높이 올리면?</div><div class="row"><label class="chk"><input type="radio" name="L3p" value="flow"> 정점만 넘으면 계속 흐른다</label><label class="chk"><input type="radio" name="L3p" value="stop"> 흐름이 멈춘다</label><label class="chk"><input type="radio" name="L3p" value="rev"> 반대 방향으로 흐른다</label></div><div class="tiny" id="L3-predmsg">고른 뒤 분홍 점을 위로 끌어 보세요.</div></div>'+
   '<div class="kv">'+['실제 높이차 h','정점 높이 H꜀','정점 압력 p꜀','유속 v','유량 Q','상태'].map(function(k,i){ return '<div class="cell '+['a','g','v2','r','a','g'][i]+'"><span class="k">'+k+'</span><span class="v" id="L3-k'+i+'">—</span></div>'; }).join('')+'</div>'+
   '<p class="tiny">모형 : 관 지름 12 mm · 길이 1 + 2H꜀ · 위 통 300 cm² · 시간은 약 30 배 빠르게 보임 · 입구는 통 바닥에서 3 cm · 증기압은 20 °C(2.3 kPa). 용존 기체 · 응집력은 고려하지 않은 교육용 모형입니다.</p></div>'+
   '<div><div class="cv-wrap"><canvas id="L3-cv" role="img" aria-label="사이펀 만들기 실험 장면" style="height:380px;width:100%;touch-action:pan-y"></canvas><div class="cv-cap">정점 · 출구 점을 끌어 높이를 바꿉니다. 흰 네모는 공기 방울, 파란 점은 흐르는 물입니다.</div></div></div></div>';
  var after=host.querySelector('.grid2'); if(after&&after.parentNode===host) after.insertAdjacentElement('afterend',card); else host.appendChild(card);
  var cv=document.getElementById('L3-cv'), ZR=[-5,150], F=1, st={zU:60,zU0:60,zo:5,zc:85,prime:0,bub:0,msg:'',cav:false,drag:null,geo:null,t:0,pred:false};
  function phys(){ var h=(st.zU-st.zo)*F/100, Hc=Math.max(0,(st.zc-st.zU))*F/100, hEff=h-st.bub/100, L=1+2*Hc, r=siphon(Math.max(0,hEff),0.012,L,1e-3,1.5), pc=pCrest(Hc,r.v), inlet=st.zU0-30+3;
    return {h:h,Hc:Hc,hEff:hEff,v:r.v,Q:r.Q,pc:pc,inletUp:st.zU>inlet,ok:false}; }
  function status(p){ if(st.prime<1) return '시동 필요(주사기 '+Math.round(st.prime*100)+' %)'; if(p.Hc<=0&&st.zc<st.zU) return '정점이 수위 아래 — 그냥 관 흐름';
    if(p.hEff<=0) return st.bub>0&&p.h>0? '정지: 공기 방울이 구동 높이차를 먹었다' : '정지: 출구가 위 수면보다 높거나 같다'; if(!p.inletUp) return '정지: 입구가 공기에 드러남'; if(p.pc<=pvap(20)) return '끊김: 정점 압력 ≤ 증기압(기포)'; return '흐르는 중'; }
  function setF(k){ F=k; document.getElementById('L3-f1').className='btn sm'+(k===1?' pri':''); document.getElementById('L3-f10').className='btn sm'+(k===10?' pri':''); }
  document.getElementById('L3-pump').addEventListener('click',function(){ st.prime=Math.min(1,st.prime+0.34); });
  document.getElementById('L3-bub').addEventListener('click',function(){ st.bub=Math.min(30,st.bub+5); });
  document.getElementById('L3-unb').addEventListener('click',function(){ st.bub=0; });
  document.getElementById('L3-refill').addEventListener('click',function(){ st.zU=st.zU0; st.prime=0; st.bub=0; st.zo=5; st.zc=85; st.cav=false; });
  document.getElementById('L3-f1').addEventListener('click',function(){ setF(1); }); document.getElementById('L3-f10').addEventListener('click',function(){ setF(10); });
  function toZ(ev){ var b=cv.getBoundingClientRect(), g=st.geo; if(!g) return 0; return g.zmin+((b.height-12-26+0)-(ev.clientY-b.top)+26*0)/g.sc*1; }
  cv.addEventListener('pointerdown',function(ev){ var g=st.geo; if(!g) return; var b=cv.getBoundingClientRect(), x=ev.clientX-b.left, y=ev.clientY-b.top, hs=[['crest',(g.xin+g.xout)/2,g.yc],['outlet',g.xout,g.yo]], i, best=null; for(i=0;i<2;i++){ var d=Math.hypot(x-hs[i][1],y-hs[i][2]); if(d<22&&(!best||d<best.d)) best={k:hs[i][0],d:d}; } if(best){ st.drag=best.k; try{ cv.setPointerCapture(ev.pointerId); }catch(e){} } });
  cv.addEventListener('pointermove',function(ev){ if(!st.drag) return; var g=st.geo, b=cv.getBoundingClientRect(), y=ev.clientY-b.top, z=g.zmin+(26+(b.height-30)-12-y)/g.sc; if(st.drag==='crest') st.zc=Math.max(5,Math.min(ZR[1]-4,z)); else { st.zo=Math.max(0,Math.min(ZR[1]-30,z)); if(!st.pred){ var rd=document.querySelector('input[name="L3p"]:checked'); if(st.zo>=st.zU){ st.pred=true; setTxt('L3-predmsg',(rd&&rd.value==='stop'?'✅ 맞아요! ':'❌ 아쉬워요. ')+'출구가 위 수면보다 높으면 구동 높이차 h 가 0 이하 — 흐름이 멈춥니다(반대로 흐르지는 않고, 정점을 넘지 못합니다).'); } } } });
  function up(){ st.drag=null; } cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
  var last=performance.now(); (function loop(now){ var dt=Math.min(0.05,(now-last)/1000); last=now; var pan=document.getElementById('tab3');
    if(pan&&pan.classList.contains('on')){ try{ st.t+=dt; var p=phys(), s=status(p), flowing=(s==='흐르는 중'||s.indexOf('그냥 관')>=0);
      if(flowing){ var rate=Math.min(40,p.Q/3e-2*100/F*30); st.zU-=p.Q/0.03*100/F*30*dt/100*0+ (p.Q/0.03)*100/F*dt*30; if(st.zU<st.zo+0.5) st.zU=st.zo+0.5; }
      if(s.indexOf('끊김')===0||s.indexOf('드러남')>=0){ st.prime=Math.max(0.3,st.prime-dt*2); if(st.prime<1&&st.prime>0.3) {} }
      if(s.indexOf('드러남')>=0) st.prime=Math.min(st.prime,0.5);
      draw(p,s); }catch(e){ if(!st.err){ st.err=1; console.error('실험실 오류',e); } } }
    requestAnimationFrame(loop); })(last);
  function draw(p,s){ var sd=setupCanvas(cv), ctx=sd.ctx, W=sd.w, H=sd.h; ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    var flowing=(s==='흐르는 중'||s.indexOf('그냥 관')>=0), prime=flowing?1:st.prime, bubs=[]; if(st.bub>0) bubs.push({s:0.78,len:Math.max(0.6,st.bub/6)}); if(s.indexOf('끊김')===0) bubs.push({s:0.42,len:1.6},{s:0.5,len:1.1});
    var g=siphonDraw(ctx,0,26,W,H-30,{hU:st.zU-st.zo,Hc:Math.max(0,st.zc-st.zU),hL:null,v:flowing?Math.min(2.5,p.v):0,on:flowing,prime:prime,tankH:30,bubbles:bubs,pTop:p.pc,zrange:ZR,zoff:st.zo},performance.now()/1000);
    st.geo={zmin:g.zmin,sc:g.sc,xin:g.xin,xout:g.xout,yc:g.yc,yo:g.yo};
    function handle(x,y,col,lab){ cvCirc(ctx,x,y,9,col,COL.white,2); cvText(ctx,lab,x+14,y,col,'bold 11.5px system-ui,sans-serif'); }
    handle((g.xin+g.xout)/2,g.yc,'#fbbf24','정점 끌기'); handle(g.xout,g.yo,'#fb7185','출구 끌기');
    cvText(ctx,s,12,16,flowing?COL.ok:COL.grav,'bold 12.5px system-ui,sans-serif'); cvText(ctx,'배율 ×'+F+(F===10?' (그림 1 cm = 실제 10 cm)':''),W-10,16,COL.tick,'11px system-ui,sans-serif','right');
    setTxt('L3-k0',(p.h*100).toFixed(0)+' cm'+(st.bub>0?' (유효 '+(Math.max(0,p.hEff)*100).toFixed(0)+')':'')); setTxt('L3-k1',p.Hc.toFixed(2)+' m'); setTxt('L3-k2',p.pc.toFixed(1)+' kPa'); setTxt('L3-k3',flowing?p.v.toFixed(2)+' m/s':'0'); setTxt('L3-k4',flowing?(p.Q*1e6).toFixed(1)+' mL/s':'0'); setTxt('L3-k5',s); }
}
(function(){ var old=TabInit[3]; TabInit[3]=function(){ if(old) old(); siphLab(); if(typeof typesetPanel==='function'){ try{ typesetPanel(document.getElementById('tab3')); }catch(e){} } }; })();
