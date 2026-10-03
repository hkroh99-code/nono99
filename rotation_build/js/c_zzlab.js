/* ═══════════════════════════════════════════════════════════════════════════
   인터랙티브 실험실 2종 (직접 만져 보며 예측 → 확인)
     탭5 「각운동량 보존 실험실」 : ① 스케이터(팔 벌림을 직접 조절 · 마찰 · 자동 시연)  ② 회전판에 점토 떨어뜨리기(캔버스를 클릭)
     탭6 「구르기 실험실」       : 경사면 꼭대기를 끌어 각도 조절 · 마찰 한계(미끄러짐) · 내가 설계한 물체와 경주 · 에너지 막대
   모든 값은 교육용 어림(공기 저항 · 변형 무시).
   ═══════════════════════════════════════════════════════════════════════════ */
function labCard(n, id, title, goal, left, right){
  var host=document.getElementById('tab'+n); if(!host||document.getElementById(id)) return null;
  var card=document.createElement('div'); card.className='card'; card.id=id;
  card.innerHTML='<div class="h3">🧪 '+title+' <span class="badge b-high">직접 만져 보기</span></div><div class="goal">🎯 '+goal+'</div><div class="grid2"><div>'+left+'</div><div>'+right+'</div></div>';
  var after=host.querySelector('.grid2'); if(after&&after.parentNode===host) after.insertAdjacentElement('afterend',card); else host.appendChild(card);
  return card;
}
function labSlider(pre,id,label,min,max,step,val){ return '<div class="ctrl"><div class="ctrl-top"><span class="nm">'+label+'</span><span class="vl" id="'+pre+'-'+id+'V">—</span></div><input type="range" id="'+pre+'-'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" aria-label="'+label+'"></div>'; }
function labKV(pre,items){ return '<div class="kv">'+items.map(function(k,i){ return '<div class="cell '+k[1]+'"><span class="k">'+k[0]+'</span><span class="v" id="'+pre+'-k'+i+'">—</span></div>'; }).join('')+'</div>'; }
var LABS=[];
function labLoop(){ if(labLoop.on) return; labLoop.on=true; var last=performance.now();
  (function f(now){ var dt=Math.min(0.05,(now-last)/1000); last=now;
    LABS.forEach(function(L){ var pan=document.getElementById('tab'+L.n); if(!pan||!pan.classList.contains('on')) return; try{ L.step(dt); L.draw(); }catch(e){ if(!L.err){ L.err=1; console.error('실험실 오류 탭'+L.n,e); } } });
    requestAnimationFrame(f); })(last); }

/* ═══ 탭 5 : 각운동량 보존 실험실 ═══════════════════════════════════════ */
function lab5(){
  var pre='L5', I0=1.2, IT=0.06, mode=1, st={e:1,m:1.0,fr:0,w0:2,L:0,ang:0,t:0,hist:[],auto:false,at:0,clays:[],mc:200,K0:0,L0:0,Eloss:0,pred:null,done:false,minE:1,sample:0};
  function r(e){ return 0.15+0.55*e; }
  function Iskater(){ return I0+2*st.m*r(st.e)*r(st.e); }
  function Itable(){ var s=IT; st.clays.forEach(function(c){ s+=c.m*c.r*c.r; }); return s; }
  function Icur(){ return mode===1? Iskater() : Itable(); }
  function restart(){ st.L=Icur()*st.w0; st.ang=0; st.t=0; st.hist=[]; st.L0=st.L; st.K0=0.5*st.L*st.L/Icur(); st.Eloss=0; st.done=false; st.minE=st.e; if(mode===2){ st.clays=[]; st.L=IT*st.w0; st.L0=st.L; st.K0=0.5*st.L*st.L/IT; } }
  var sl=labSlider(pre,'w0','처음 각속도 ω₀ (다시 시작할 때 적용)',0.5,4,0.1,2)+labSlider(pre,'e','① 팔 벌림 (0 = 오므림 · 100 % = 활짝)',0,100,1,100)+labSlider(pre,'m','② 아령 질량(한 손) / 점토 질량',0.5,3,0.25,1)+labSlider(pre,'fr','바닥 마찰 토크 (0 = 없음)',0,0.15,0.01,0);
  var left='<div class="row" role="group" aria-label="실험 종류"><button type="button" class="btn sm pri" id="'+pre+'-m1">① 스케이터 (팔 벌림)</button><button type="button" class="btn sm" id="'+pre+'-m2">② 회전판에 점토 떨어뜨리기</button></div>'+sl+
    '<div class="row"><button type="button" class="btn sm pri" id="'+pre+'-re">↺ 다시 시작</button><button type="button" class="btn sm" id="'+pre+'-auto">🎬 자동 시연 (오므렸다 벌렸다)</button><button type="button" class="btn sm rd" id="'+pre+'-clr">점토 모두 치우기</button></div>'+
    '<div class="easy" id="'+pre+'-pred"><div class="et">🤔 예측해 보세요 — 팔을 끝까지 오므리면 운동 에너지 K 는?</div><div class="row"><label class="chk"><input type="radio" name="'+pre+'p" value="same"> 변하지 않는다</label><label class="chk"><input type="radio" name="'+pre+'p" value="up"> 늘어난다</label><label class="chk"><input type="radio" name="'+pre+'p" value="down"> 줄어든다</label></div><div class="tiny" id="'+pre+'-predmsg">고른 뒤 팔 벌림 슬라이더를 0 쪽으로 내려 보세요.</div></div>'+
    labKV(pre,[['각운동량 L','a'],['관성 모멘트 I','g'],['각속도 ω','v2'],['운동 에너지 K','r'],['L / L₀','a'],['K / K₀','r']])+
    '<p class="tiny" id="'+pre+'-note"></p>';
  var right='<div class="cv-wrap"><canvas id="'+pre+'-cv" role="img" aria-label="각운동량 보존 실험 장면" style="height:300px;width:100%"></canvas><div class="cv-cap" id="'+pre+'-cap"></div></div><div class="cv-wrap" style="margin-top:9px"><canvas id="'+pre+'-cv2" role="img" aria-label="시간에 따른 ω · L · K" style="height:230px;width:100%"></canvas><div class="cv-cap">📊 최근 10 초 : L/L₀(파랑, 마찰이 없으면 수평선) · ω/ω₀(초록)와 K/K₀(분홍). 스케이터에서는 L 이 같아 K/K₀ = ω/ω₀ 로 겹쳐 보입니다.</div></div>';
  var card=labCard(5,'lab5','각운동량 보존 실험실','팔 벌림 슬라이더를 <b>직접 움직여</b> 각속도가 어떻게 변하는지 보고, 파란 L/L₀ 선이 <b>수평으로 유지</b>되는 것을 확인하세요. 마찰을 켜면 L 이 서서히 줄어듭니다. ②번 모드에서는 <b>회전판을 직접 클릭</b>해 점토를 떨어뜨립니다 — 가장자리일수록 ω 가 많이 줄고 에너지가 사라집니다.',left,right);
  if(!card) return;
  var cv=document.getElementById(pre+'-cv'), cv2=document.getElementById(pre+'-cv2');
  function val(id){ return +document.getElementById(pre+'-'+id).value; }
  function sync(){ st.e=val('e')/100; st.m=val('m'); st.fr=val('fr'); st.w0=val('w0');
    setTxt(pre+'-w0V',st.w0.toFixed(1)+' rad/s'); setTxt(pre+'-eV',Math.round(st.e*100)+' % (r = '+(r(st.e)*100).toFixed(0)+' cm)'); setTxt(pre+'-mV',st.m.toFixed(2)+' kg'); setTxt(pre+'-frV',st.fr.toFixed(2)+' N·m'); }
  ['w0','e','fr'].forEach(function(id){ document.getElementById(pre+'-'+id).addEventListener('input',sync); });
  document.getElementById(pre+'-m').addEventListener('input',function(){ if(mode===1){ var w=st.L/Icur(); sync(); st.L=w*Icur(); st.L0=st.L; st.K0=0.5*st.L*st.L/Icur(); st.hist=[]; } else { sync(); st.mc=Math.round(200+(st.m-0.5)*160); } });
  /* 팔 벌림을 바꿀 때 L 은 그대로 → ω = L/I 로 자동 변화 (st.L 은 보존) */
  function setMode(k){ mode=k; document.getElementById(pre+'-m1').className='btn sm'+(k===1?' pri':''); document.getElementById(pre+'-m2').className='btn sm'+(k===2?' pri':'');
    document.getElementById(pre+'-pred').style.display=k===1?'':'none'; document.getElementById(pre+'-e').parentNode.style.display=k===1?'':'none'; document.getElementById(pre+'-auto').style.display=k===1?'':'none'; document.getElementById(pre+'-clr').style.display=k===2?'':'none'; st.auto=false; restart();
    setTxt(pre+'-note', k===1? '모형 : 몸 I₀ = 1.2 kg·m² + 아령 2 개(반지름 15 ~ 70 cm). 팔을 바꾸는 동안 외부 토크가 없으면 L = Iω 가 일정하고, K 는 몸이 한 일만큼 변합니다.' : '모형 : 회전판 I = 0.06 kg·m² (반지름 50 cm). 점토는 닿는 순간 판과 함께 돌며(완전 비탄성) L 은 보존되고 운동 에너지 일부가 열로 사라집니다. 캔버스를 클릭하세요.');
    setTxt(pre+'-cap', k===1? '위에서 본 스케이터 : 회색 원 = 몸, 빨강 = 아령. 아래 막대는 처음(점선)과 지금의 값.' : '위에서 본 회전판 : 클릭한 자리에 점토가 붙습니다. 가운데에 가까울수록 영향이 작습니다.'); }
  document.getElementById(pre+'-m1').addEventListener('click',function(){ setMode(1); });
  document.getElementById(pre+'-m2').addEventListener('click',function(){ setMode(2); });
  document.getElementById(pre+'-re').addEventListener('click',function(){ sync(); restart(); });
  document.getElementById(pre+'-clr').addEventListener('click',function(){ if(mode===2){ sync(); restart(); } });
  document.getElementById(pre+'-auto').addEventListener('click',function(){ st.auto=!st.auto; st.at=0; this.className='btn sm'+(st.auto?' pri':''); });
  var scale=function(){ return Math.min(cv.clientHeight*0.42,cv.clientWidth*0.2)/0.7; };
  cv.addEventListener('pointerdown',function(ev){ if(mode!==2) return; var b=cv.getBoundingClientRect(), s=scale(), cx=b.width*0.3, cy=b.height*0.5, x=ev.clientX-b.left-cx, y=ev.clientY-b.top-cy, rr=Math.sqrt(x*x+y*y)/s;
    if(rr>0.5||rr<0.02) return; var th=Math.atan2(y,x)-st.ang, Iold=Itable(); st.clays.push({r:rr,th:th,m:st.mc/1000}); var Inew=Itable(), w=st.L/Iold, Kb=0.5*Iold*w*w, Ka=0.5*Inew*(st.L/Inew)*(st.L/Inew); st.Eloss+=Kb-Ka; });
  function step(dt){ if(!document.getElementById(pre+'-cv')) return;
    if(st.auto&&mode===1){ st.at+=dt; var ph=(st.at%6)/6, e=ph<0.5? 1-ph*2*0.95: 0.05+(ph-0.5)*2*0.95; document.getElementById(pre+'-e').value=Math.round(e*100); sync(); }
    var I=Icur(); if(st.fr>0){ var w=st.L/I; st.L-=Math.sign(w)*st.fr*dt*(Math.abs(w)>0.01?1:0); if(st.L<0) st.L=0; }
    var om=st.L/I; st.ang+=om*dt; st.t+=dt; st.sample+=dt; if(st.sample>0.05){ st.sample=0; st.hist.push({t:st.t,w:om/(st.w0||1),L:st.L/(st.L0||1),K:(0.5*st.L*st.L/I)/(st.K0||1)}); if(st.hist.length>200) st.hist.shift(); }
    st.minE=Math.min(st.minE,st.e);
    if(mode===1&&st.minE<0.15&&!st.done){ var rd=document.querySelector('input[name="'+pre+'p"]:checked'); st.done=true; var Kr=(0.5*st.L*st.L/I)/(st.K0||1);
      setTxt(pre+'-predmsg', (rd? ((rd.value==='up')?'✅ 맞아요! ':'❌ 아쉬워요. ') : '')+'K 는 처음의 '+Kr.toFixed(2)+' 배 — L 이 같고 I 가 작아져 K = L²/2I 가 커졌습니다. 늘어난 에너지는 팔을 당기는 몸이 한 일(구심력에 맞선 일)입니다.'); }
    if(mode===1&&st.e>0.9) st.done=false; }
  function draw(){
    var s0=setupCanvas(cv), ctx=s0.ctx, W=s0.w, H=s0.h, I=Icur(), om=st.L/I, K=0.5*st.L*st.L/I; ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,W,H);
    var sc=Math.min(H*0.42,W*0.2)/0.7, cx=W*0.3, cy=H*0.5;
    if(mode===1){ var rr=r(st.e)*sc; cvCirc(ctx,cx,cy,0.2*sc,'rgba(148,163,184,.5)',COL.white,1.5); [0,Math.PI].forEach(function(a0){ var ex=cx+rr*Math.cos(st.ang+a0), ey=cy+rr*Math.sin(st.ang+a0); cvLine(ctx,[[cx,cy],[ex,ey]],COL.tick,5); cvCirc(ctx,ex,ey,7+st.m*3,COL.grav,COL.white,1.3); });
      ctx.strokeStyle='rgba(148,163,184,.35)'; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.arc(cx,cy,0.7*sc,0,6.2832); ctx.stroke(); ctx.setLineDash([]);
      cvLine(ctx,[[cx,cy],[cx+0.2*sc*Math.cos(st.ang-0.6),cy+0.2*sc*Math.sin(st.ang-0.6)]],COL.amber,3); }
    else { cvCirc(ctx,cx,cy,0.5*sc,'rgba(148,163,184,.25)',COL.white,1.6); for(var k=0;k<4;k++){ var a=st.ang+k*Math.PI/2; cvLine(ctx,[[cx,cy],[cx+0.5*sc*Math.cos(a),cy+0.5*sc*Math.sin(a)]],'rgba(148,163,184,.4)',1); }
      st.clays.forEach(function(c){ var a=st.ang+c.th; cvCirc(ctx,cx+c.r*sc*Math.cos(a),cy+c.r*sc*Math.sin(a),4+c.m*14,'#fb923c',COL.white,1); }); cvText(ctx,'판을 클릭 → 점토 '+st.mc+' g 투하',cx,cy+0.5*sc+16,COL.tick,'12px system-ui,sans-serif','center'); }
    cvText(ctx,'ω = '+om.toFixed(2)+' rad/s ('+(om*60/6.2832).toFixed(0)+' rpm)',12,16,COL.text,'bold 12px system-ui,sans-serif');
    var base=[['L',st.L,COL.blue,st.L0],['I',I,COL.ok,mode===1?Iskater():IT+0],['ω',om,COL.amber,st.w0],['K',K,COL.grav,st.K0]], bx=W*0.58, bw=W*0.38, y0=H*0.12;
    var mx=[Math.max(st.L0,st.L)*1.15,Math.max(I0+2*3*0.7*0.7,I)*1.05,Math.max(st.w0*4,om)*1.05,Math.max(st.K0*4,K)*1.05];
    base.forEach(function(b,i){ var y=y0+i*(H*0.2); cvText(ctx,b[0],bx-6,y+14,COL.tick,'bold 13px system-ui,sans-serif','right'); cvRect(ctx,bx,y+4,bw,20,'rgba(148,163,184,.14)',null); cvRect(ctx,bx,y+4,Math.max(2,bw*Math.min(1,b[1]/mx[i])),20,b[2],null); if(b[3]){ var gx=bx+bw*Math.min(1,b[3]/mx[i]); cvLine(ctx,[[gx,y],[gx,y+28]],COL.white,1.5,[3,3]); } cvText(ctx,b[1].toFixed(2),bx+bw*Math.min(1,b[1]/mx[i])+6,y+14,COL.text,'11.5px system-ui,sans-serif'); });
    var h=st.hist, P0=document.getElementById(pre+'-cv2'); var s2=setupCanvas(P0), c2=s2.ctx; c2.fillStyle=COL.cvbg; c2.fillRect(0,0,s2.w,s2.h);
    var tmax=Math.max(10,st.t), tmin=tmax-10, ymx=1.5; h.forEach(function(q){ ymx=Math.max(ymx,Math.min(q.w,12),Math.min(q.K,12)); }); ymx=Math.ceil(ymx*1.1); var P=makePlot(c2,s2.w,s2.h,{xmin:tmin,xmax:tmax,ymin:0,ymax:ymx,xlabel:'시간 (s)',ylabel:'처음 값에 대한 비율',title:'ω/ω₀(초록) · L/L₀(파랑) · K/K₀(분홍)',left:52,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }});
    function ser(key,mulp){ return h.filter(function(q){ return q.t>=tmin; }).map(function(q){ return [q.t,Math.min(q[key]*(mulp||1),ymx)]; }); }
    plotLine(c2,P,ser('K'),COL.grav,3.5); plotLine(c2,P,ser('w'),COL.ok,1.8); plotLine(c2,P,ser('L'),COL.blue,2.2);
    setTxt(pre+'-k0',st.L.toFixed(3)+' kg·m²/s'); setTxt(pre+'-k1',I.toFixed(3)+' kg·m²'); setTxt(pre+'-k2',om.toFixed(2)+' rad/s'); setTxt(pre+'-k3',K.toFixed(3)+' J'); setTxt(pre+'-k4',(st.L/(st.L0||1)).toFixed(3)); setTxt(pre+'-k5',(K/(st.K0||1)).toFixed(2)+(mode===2? ' (손실 '+(st.Eloss/(st.K0||1)*100).toFixed(0)+' %)':'')); }
  LABS.push({n:5,step:step,draw:draw}); sync(); setMode(1); labLoop();
}

/* ═══ 탭 6 : 구르기 실험실 ═══════════════════════════════════════════════ */
function lab6(){
  var pre='L6', Gg=9.8, Ltot=1.5, R=0.06, th=15*Math.PI/180, mus=0.5, kc=0.7, sp=0.5, run=false, T=0, fin=[], pred=null, drag=false;
  var BODY=[{n:'구',k:0.4,col:'#38bdf8',on:true},{n:'원통',k:0.5,col:'#34d399',on:true},{n:'고리',k:1,col:'#fb7185',on:true},{n:'내 물체',k:0.7,col:'#fbbf24',on:true}];
  function init(){ BODY.forEach(function(b){ b.s=0; b.v=0; b.w=0; b.ang=0; b.slip=false; b.t=null; b.hist=[[0,0]]; }); T=0; fin=[]; run=false; setTxt(pre+'-predmsg','예측을 고르고 ▶ 출발을 누르세요.'); }
  var left='<div class="row" role="group" aria-label="경주할 물체">'+BODY.map(function(b,i){ return '<label class="chk"><input type="checkbox" id="'+pre+'-c'+i+'" checked> <span style="color:'+b.col+'">■</span> '+b.n+'</label>'; }).join('')+'</div>'+
    labSlider(pre,'th','경사각 θ (캔버스 꼭대기의 노란 점을 끌어도 됩니다)',3,35,1,15)+labSlider(pre,'mu','바닥과의 정지 마찰 계수 μ',0.05,0.9,0.05,0.5)+labSlider(pre,'kc','내 물체의 k (0.2 = 중심에 질량 · 1 = 가장자리에 질량)',0.2,1,0.05,0.7)+labSlider(pre,'sp','재생 속도',0.25,1.5,0.25,0.5)+
    '<div class="row"><button type="button" class="btn sm pri" id="'+pre+'-go">▶ 출발</button><button type="button" class="btn sm" id="'+pre+'-re">↺ 처음으로</button></div>'+
    '<div class="easy"><div class="et">🤔 예측 — 가장 먼저 도착할 물체는? (같은 높이에서 동시에 출발, 미끄러지지 않는다고 가정)</div><div class="row">'+['구','원통','고리','내 물체'].map(function(n,i){ return '<label class="chk"><input type="radio" name="'+pre+'p" value="'+i+'"> '+n+'</label>'; }).join('')+'</div><div class="tiny" id="'+pre+'-predmsg"></div></div>'+
    labKV(pre,[['구 가속도','a'],['원통 가속도','g'],['고리 가속도','r'],['내 물체 a','v2'],['필요한 μ (구/원통/고리)','a'],['상태','g']])+'<p class="tiny">모형 : 질량 1 kg, 반지름 6 cm, 경사 길이 1.5 m. 미끄러지지 않고 구르려면 $\\mu\\ge\\dfrac{k}{1+k}\\tan\\theta$ 가 필요합니다(그렇지 않으면 운동 마찰 μ_k = 0.8μ 로 미끄러지며 내려옴).</p>';
  var right='<div class="cv-wrap"><canvas id="'+pre+'-cv" role="img" aria-label="구르기 경주 경사면" style="height:340px;width:100%;touch-action:pan-y"></canvas><div class="cv-cap">노란 점을 끌어 경사각을 바꾸세요. 빨간 글씨 「미끄러짐」은 마찰이 부족해 구르지 못하는 물체입니다. 막대 = 위치 에너지 중 병진 · 회전 · 열로 쓰인 몫(내 물체).</div></div><div class="cv-wrap" style="margin-top:9px"><canvas id="'+pre+'-cv2" role="img" aria-label="시간 대 이동 거리" style="height:230px;width:100%"></canvas><div class="cv-cap">📊 이동 거리 s(t) — 기울기가 클수록 빠른 물체</div></div>';
  var card=labCard(6,'lab6','구르기 실험실','경사각을 끌어 바꾸고 <b>마찰 계수 μ 를 줄여</b> 보세요. μ 가 필요한 값보다 작아지면 물체가 <b>미끄러지며</b> 가속도가 커지고 회전은 느려집니다. 「내 물체」의 k 를 바꿔 구·원통·고리와 경주하며 $a=g\\sin\\theta/(1+k)$ 를 직접 확인하세요.',left,right);
  if(!card) return;
  var cv=document.getElementById(pre+'-cv');
  function val(id){ return +document.getElementById(pre+'-'+id).value; }
  function sync(){ th=val('th')*Math.PI/180; mus=val('mu'); kc=val('kc'); sp=val('sp'); BODY[3].k=kc;
    setTxt(pre+'-thV',(th*180/Math.PI).toFixed(0)+'°'); setTxt(pre+'-muV',mus.toFixed(2)); setTxt(pre+'-kcV',kc.toFixed(2)); setTxt(pre+'-spV','× '+sp); BODY.forEach(function(b,i){ b.on=document.getElementById(pre+'-c'+i).checked; }); }
  ['th','mu','kc','sp'].forEach(function(id){ document.getElementById(pre+'-'+id).addEventListener('input',function(){ sync(); if(id!=='sp'&&!run) init(); }); });
  BODY.forEach(function(b,i){ document.getElementById(pre+'-c'+i).addEventListener('change',function(){ sync(); init(); }); });
  document.getElementById(pre+'-go').addEventListener('click',function(){ sync(); init(); var rd=document.querySelector('input[name="'+pre+'p"]:checked'); pred=rd? +rd.value : null; run=true; });
  document.getElementById(pre+'-re').addEventListener('click',function(){ sync(); init(); });
  function geom(){ var W=cv.clientWidth, H=cv.clientHeight, ext=Math.min(W*0.72,H*0.5/Math.tan(35*Math.PI/180)), x0=W*0.1, yb=H*0.9; return {W:W,H:H,ext:ext,x0:x0,yb:yb,x1:x0+ext,y0:yb-ext*Math.tan(th)}; }
  function hset(ev){ var b=cv.getBoundingClientRect(), g=geom(), py=ev.clientY-b.top, drop=Math.max(0,g.yb-py), t=Math.atan2(drop,g.ext)*180/Math.PI; t=Math.max(3,Math.min(35,Math.round(t))); document.getElementById(pre+'-th').value=t; sync(); init(); }
  cv.addEventListener('pointerdown',function(ev){ var b=cv.getBoundingClientRect(), g=geom(), dx=ev.clientX-b.left-g.x0, dy=ev.clientY-b.top-g.y0; if(dx*dx+dy*dy<26*26){ drag=true; try{ cv.setPointerCapture(ev.pointerId); }catch(e){} hset(ev); } });
  cv.addEventListener('pointermove',function(ev){ if(drag) hset(ev); }); cv.addEventListener('pointerup',function(){ drag=false; }); cv.addEventListener('pointercancel',function(){ drag=false; });
  function phys(b,dt){ var need=b.k/(1+b.k)*Math.tan(th), roll=mus>=need, a, al; if(roll){ a=Gg*Math.sin(th)/(1+b.k); b.slip=false; b.v+=a*dt; b.w=b.v/R; }
    else { b.slip=true; var mk=0.8*mus; a=Math.max(0,Gg*(Math.sin(th)-mk*Math.cos(th))); al=mk*Gg*Math.cos(th)/(b.k*R); b.v+=a*dt; b.w=Math.min(b.v/R,b.w+al*dt); }
    b.s+=b.v*dt; b.ang+=b.w*dt; }
  function step(dt){ if(!run) return; var d=dt*sp, sub=4, i; for(i=0;i<sub;i++){ T+=d/sub; BODY.forEach(function(b){ if(!b.on||b.t!=null) return; phys(b,d/sub); if(b.s>=Ltot){ b.s=Ltot; b.t=T; fin.push(b); } }); }
    BODY.forEach(function(b){ if(b.on&&b.t==null){ var l=b.hist[b.hist.length-1]; if(T-l[0]>0.04) b.hist.push([T,b.s]); } });
    var act=BODY.filter(function(b){ return b.on; });
    if(act.length&&act.every(function(b){ return b.t!=null; })){ run=false; var f=fin[0], msg='🏁 1 등 : '+f.n+' ('+f.t.toFixed(2)+' s)'; if(pred!=null&&BODY[pred].on) msg=(fin[0]===BODY[pred]?'✅ 예측 적중! ':'❌ 예측과 달랐어요. ')+msg; setTxt(pre+'-predmsg',msg+' — k 가 작을수록 회전에 쓰는 에너지가 적어 빠릅니다(미끄러지는 물체는 예외).'); }
    else if(act.length&&!act.some(function(b){ return b.t==null&&(b.v>0.001||T<0.2); })&&T>0.5){ run=false; setTxt(pre+'-predmsg','마찰이 너무 커서(또는 경사가 너무 작아서) 미끄러지지 못하고 멈춰 있습니다.'); } }
  function draw(){
    var s0=setupCanvas(cv), ctx=s0.ctx, g=geom(); ctx.fillStyle=COL.cvbg; ctx.fillRect(0,0,s0.w,s0.h);
    var pxm=g.ext/(Ltot*Math.cos(th)), ux=Math.cos(th), uy=Math.sin(th), nx=uy, ny=-ux, Rp=Math.max(9,Math.min(16,R*pxm*1.3)), gap=2*Rp+8, lanes=BODY.filter(function(b){ return b.on; }), li=0;
    ctx.fillStyle='rgba(148,163,184,.14)'; ctx.beginPath(); ctx.moveTo(g.x0,g.y0); ctx.lineTo(g.x1,g.yb); ctx.lineTo(g.x0,g.yb); ctx.closePath(); ctx.fill();
    lanes.forEach(function(b,i){ cvLine(ctx,[[g.x0,g.y0-i*gap],[g.x1,g.yb-i*gap]],i===0?COL.tick:'rgba(148,163,184,.55)',i===0?3:1.5); });
    cvLine(ctx,[[g.x1,g.yb-(lanes.length)*gap],[g.x1,g.yb+4]],COL.amber,3); cvText(ctx,'결승',g.x1,g.yb+14,COL.amber,'11px system-ui,sans-serif','center');
    cvCirc(ctx,g.x0,g.y0,9,COL.amber,COL.white,2); cvText(ctx,'끌기',g.x0,g.y0+20,COL.amber,'11px system-ui,sans-serif','center'); cvText(ctx,'θ = '+(th*180/Math.PI).toFixed(0)+'°',g.x0+36,g.yb-8,COL.text,'bold 12px system-ui,sans-serif');
    lanes.forEach(function(b,i){ var pos=[g.x0+b.s*ux*pxm, g.y0-i*gap+b.s*uy*pxm], cx=pos[0]+nx*(Rp+2), cy=pos[1]+ny*(Rp+2);
      drawWheel(ctx,cx,cy,Rp,b.ang,b.k>=0.9?1:0.5,b.col);
      cvText(ctx,b.n+(b.slip?' · 미끄러짐!':'')+(b.t!=null?' ✔ '+b.t.toFixed(2)+'s':''),Math.min(cx+Rp+6,g.W-110),cy-Rp-4,b.slip?'#ef4444':b.col,'bold 11px system-ui,sans-serif','left'); });
    var my=BODY[3].on?BODY[3]:(lanes[0]||BODY[0]), h=my.s*Math.sin(th), Etot=Gg*h, Kt=0.5*my.v*my.v, Kr=0.5*my.k*R*R*my.w*my.w, heat=Math.max(0,Etot-Kt-Kr);
    var bx=g.W*0.62, by=g.H*0.1, bw=g.W*0.34; cvText(ctx,my.n+' : 잃은 위치 에너지 '+Etot.toFixed(2)+' J의 행방',bx,by,COL.tick,'bold 11.5px system-ui,sans-serif');
    var tot=Math.max(0.01,Etot), parts=[['병진',Kt,COL.ok],['회전',Kr,COL.blue],['열',heat,COL.grav]], xx=bx; parts.forEach(function(p){ var w=bw*p[1]/Math.max(tot,Gg*Ltot*Math.sin(th)); cvRect(ctx,xx,by+10,Math.max(0,w),18,p[2],null); xx+=w; });
    cvRect(ctx,bx,by+10,bw*Etot/Math.max(Gg*Ltot*Math.sin(th),0.01),18,null,COL.white,1); parts.forEach(function(p,i){ cvText(ctx,p[0]+' '+p[1].toFixed(2),bx+i*bw/3,by+44,p[2],'11.5px system-ui,sans-serif'); });
    var s2=setupCanvas(document.getElementById(pre+'-cv2')), c2=s2.ctx; c2.fillStyle=COL.cvbg; c2.fillRect(0,0,s2.w,s2.h);
    var tmax=Math.max(1.5,T*1.1,Math.sqrt(2*Ltot*2.0/(Gg*Math.sin(th)))*1.05), P=makePlot(c2,s2.w,s2.h,{xmin:0,xmax:tmax,ymin:0,ymax:Ltot*1.05,xlabel:'시간 (s)',ylabel:'이동 거리 (m)',title:'s(t)',left:52,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(1); }});
    BODY.forEach(function(b){ if(b.on&&b.hist.length>1) plotLine(c2,P,b.hist,b.col,2.2); });
    BODY.forEach(function(b,i){ var need=b.k/(1+b.k)*Math.tan(th), roll=mus>=need, a=roll? Gg*Math.sin(th)/(1+b.k) : Math.max(0,Gg*(Math.sin(th)-0.8*mus*Math.cos(th)));
      if(i<4) setTxt(pre+'-k'+i,(b.on? a.toFixed(2)+' m/s²'+(roll?'':' ⚠'):'(제외)')); });
    var nd=[0.4,0.5,1].map(function(k){ return (k/(1+k)*Math.tan(th)).toFixed(2); }); setTxt(pre+'-k4',nd.join(' / '));
    setTxt(pre+'-k5',run? '진행 중 '+T.toFixed(2)+' s' : (fin.length? '완료':'대기')); }
  LABS.push({n:6,step:step,draw:draw}); sync(); init(); labLoop();
}
[[5,lab5],[6,lab6]].forEach(function(q){ var old=TabInit[q[0]]; TabInit[q[0]]=function(){ if(old) old(); q[1](); if(typeof typesetPanel==='function'){ try{ typesetPanel(document.getElementById('tab'+q[0])); }catch(e){} } }; });
