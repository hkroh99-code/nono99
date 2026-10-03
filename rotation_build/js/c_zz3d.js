/* ═══════════════════════════════════════════════════════════════════════════
   3D 보기 — 외부 라이브러리 없이 캔버스 2D 로 그리는 작은 3D 엔진(원근 투영 + 깊이 정렬)
   입체(벡터의 방향)가 학습 효과를 높이는 다섯 곳에만 붙인다.
     탭2 원운동 벡터 ω · v · a_c     탭3 토크 벡터 τ = r × F (오른손 법칙 · 평행사변형 넓이)
     탭4 모양별 관성 모멘트(회전축)   탭5 자이로 세차 L · τ        탭6 구르기 경주(구 · 원통 · 고리)
   드래그 = 돌려 보기 · 휠 = 확대/축소 · 버튼 = 시점 바꾸기. 모든 값은 교육용 어림.
   ═══════════════════════════════════════════════════════════════════════════ */
var M3 = (function(){
  var C = { blue:'#38bdf8', green:'#34d399', amber:'#fbbf24', red:'#fb7185', vio:'#a78bfa', gray:'#94a3b8', white:'#e2e8f0' };
  function hex(c){ var m=/^#([0-9a-f]{6})$/i.exec(c); if(!m) return [148,163,184]; var n=parseInt(m[1],16); return [n>>16&255,n>>8&255,n&255]; }
  function shade(c,k,a){ var r=hex(c); return 'rgba('+Math.min(255,Math.round(r[0]*k))+','+Math.min(255,Math.round(r[1]*k))+','+Math.min(255,Math.round(r[2]*k))+','+(a==null?1:a)+')'; }
  function sub(a,b){ return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
  function add(a,b){ return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }
  function mul(a,k){ return [a[0]*k,a[1]*k,a[2]*k]; }
  function dot(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
  function cross(a,b){ return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; }
  function len(a){ return Math.sqrt(dot(a,a)); }
  function nrm(a){ var l=len(a)||1; return [a[0]/l,a[1]/l,a[2]/l]; }
  /** 축 a 에 수직인 두 단위벡터 */
  function frame(a){ a=nrm(a); var t=Math.abs(a[2])<0.9? [0,0,1]:[1,0,0], u=nrm(cross(a,t)), v=cross(a,u); return [u,v,a]; }
  var LIGHT = nrm([0.45,-0.55,0.8]);

  function View(cv, o){
    this.cv=cv; this.yaw=o.yaw==null?0.9:o.yaw; this.pitch=o.pitch==null?0.5:o.pitch; this.dist=o.dist||4; this.target=o.target||[0,0,0];
    this.q=[]; this.auto=!!o.auto; this.drag=null; var me=this;
    cv.style.touchAction='pan-y'; cv.style.cursor='grab';
    cv.addEventListener('pointerdown',function(e){ me.drag={x:e.clientX,y:e.clientY,yaw:me.yaw,pitch:me.pitch}; try{ cv.setPointerCapture(e.pointerId); }catch(x){} cv.style.cursor='grabbing'; });
    cv.addEventListener('pointermove',function(e){ if(!me.drag) return; me.yaw=me.drag.yaw-(e.clientX-me.drag.x)*0.01; me.pitch=Math.max(-1.4,Math.min(1.4,me.drag.pitch+(e.clientY-me.drag.y)*0.01)); me.auto=false; });
    function up(){ me.drag=null; cv.style.cursor='grab'; }
    cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
    cv.addEventListener('wheel',function(e){ e.preventDefault(); me.dist=Math.max(1.5,Math.min(12,me.dist*(e.deltaY>0?1.08:0.92))); },{passive:false});
  }
  View.prototype.begin=function(){ var s=setupCanvas(this.cv); this.ctx=s.ctx; this.W=s.w; this.H=s.h; this.q=[];
    var cp=Math.cos(this.pitch); this.cam=add(this.target,[this.dist*cp*Math.cos(this.yaw),this.dist*cp*Math.sin(this.yaw),this.dist*Math.sin(this.pitch)]);
    this.f=nrm(sub(this.target,this.cam)); this.r=nrm(cross(this.f,[0,0,1])); this.u=cross(this.r,this.f); this.fl=Math.min(this.W,this.H*1.6)*0.9;
    this.ctx.fillStyle=COL.cvbg; this.ctx.fillRect(0,0,this.W,this.H); };
  View.prototype.p=function(P){ var d=sub(P,this.cam), z=dot(d,this.f); if(z<0.05) z=0.05; return [this.W/2+dot(d,this.r)*this.fl/z, this.H/2-dot(d,this.u)*this.fl/z, z]; };
  View.prototype.line=function(a,b,col,w,bias){ var pa=this.p(a), pb=this.p(b); this.q.push({t:'l',a:pa,b:pb,col:col,w:w||1.5,z:(pa[2]+pb[2])/2-(bias||0)}); };
  View.prototype.poly=function(pts,col,o){ o=o||{}; var s=pts.map(this.p,this), z=0, i; for(i=0;i<s.length;i++) z+=s[i][2]; z/=s.length;
    var n=nrm(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0]))), k=0.55+0.45*Math.abs(dot(n,LIGHT));
    this.q.push({t:'p',s:s,fill:o.nofill?null:shade(col,k,o.alpha),stroke:o.stroke||null,z:z-(o.bias||0)}); };
  View.prototype.dot=function(P,rw,col,o){ var s=this.p(P); this.q.push({t:'d',s:s,r:Math.max(2,rw*this.fl/s[2]),col:col,z:s[2]-(o&&o.bias||0)}); };
  View.prototype.text=function(P,str,col,sz,al){ var s=this.p(P); this.q.push({t:'t',s:s,str:str,col:col||COL.text,sz:sz||12,al:al||'center',z:s[2]-5}); };
  View.prototype.arrow=function(a,b,col,w){ var d=sub(b,a), l=len(d); if(l<1e-4) return; var fr=frame(d), hl=Math.min(l*0.35,0.2), hw=hl*0.38, base=sub(b,mul(fr[2],hl)), k, pts=[];
    this.line(a,base,col,w||3); for(k=0;k<6;k++){ var an=k*Math.PI/3; pts.push(add(base,add(mul(fr[0],hw*Math.cos(an)),mul(fr[1],hw*Math.sin(an))))); }
    for(k=0;k<6;k++) this.poly([b,pts[k],pts[(k+1)%6]],col,{bias:0.02}); };
  /** 점들을 이은 선(닫힌 곡선 가능) */
  View.prototype.path=function(pts,col,w,closed){ var i, n=pts.length-(closed?0:1); for(i=0;i<n;i++) this.line(pts[i],pts[(i+1)%pts.length],col,w); };
  /** 중심 c, 축 ax, 반지름 R, 반 두께 h 의 원통(또는 고리: ri>0). spin 은 표식 막대의 회전각 */
  View.prototype.cyl=function(c,ax,R,h,spin,col,o){ o=o||{}; var fr=frame(ax), u=fr[0], v=fr[1], a=fr[2], N=o.N||28, ri=o.ri||0, i, top=[], bot=[], itop=[], ibot=[];
    function ring(r,z){ var out=[]; for(i=0;i<N;i++){ var an=i*2*Math.PI/N; out.push(add(c,add(mul(a,z),add(mul(u,r*Math.cos(an)),mul(v,r*Math.sin(an)))))); } return out; }
    top=ring(R,h); bot=ring(R,-h); if(ri){ itop=ring(ri,h); ibot=ring(ri,-h); }
    for(i=0;i<N;i++){ var j=(i+1)%N;
      this.poly([bot[i],bot[j],top[j],top[i]],col,{alpha:o.alpha});
      if(ri){ this.poly([ibot[i],ibot[j],itop[j],itop[i]],col,{alpha:o.alpha}); this.poly([top[i],top[j],itop[j],itop[i]],col,{alpha:o.alpha}); this.poly([bot[i],bot[j],ibot[j],ibot[i]],col,{alpha:o.alpha}); } }
    if(!ri){ this.poly(top,col,{alpha:o.alpha,bias:0.001}); this.poly(bot,col,{alpha:o.alpha}); }
    var rr=ri? (R+ri)/2:R*0.92, m1=add(c,add(mul(a,h+0.003),mul(add(mul(u,Math.cos(spin)),mul(v,Math.sin(spin))),ri||0))), m2=add(c,add(mul(a,h+0.003),mul(add(mul(u,Math.cos(spin)),mul(v,Math.sin(spin))),rr)));
    this.line(m1,m2,o.mark||C.amber,3,0.05); this.dot(m2,R*0.07,o.mark||C.amber,{bias:0.05}); };
  /** 구 : 그림자 있는 원 + 보이는 쪽 자오선/위도선 */
  View.prototype.sphere=function(c,R,ax,spin,col,o){ o=o||{}; var s=this.p(c), fr=frame(ax), u=fr[0], v=fr[1], a=fr[2], me=this, i, k;
    this.q.push({t:'s',s:s,r:R*this.fl/s[2],col:col,alpha:o.alpha==null?1:o.alpha,z:s[2]});
    function vis(P){ return dot(sub(P,c),sub(me.cam,P))>0; }
    function seg(P,Q,cc){ if(vis(P)&&vis(Q)) me.line(P,Q,cc,1.2,-0.001); }
    var NS=24, mer=o.hollow?6:4;
    for(k=0;k<mer;k++){ var ph=spin+k*Math.PI/mer, e=add(mul(u,Math.cos(ph)),mul(v,Math.sin(ph)));
      for(i=0;i<NS;i++){ var t0=i*2*Math.PI/NS, t1=(i+1)*2*Math.PI/NS;
        seg(add(c,mul(add(mul(e,Math.cos(t0)),mul(a,Math.sin(t0))),R)),add(c,mul(add(mul(e,Math.cos(t1)),mul(a,Math.sin(t1))),R)),k===0?C.amber:'rgba(226,232,240,.55)'); } }
    [-0.5,0,0.5].forEach(function(z){ var rr=Math.sqrt(1-z*z); for(i=0;i<NS;i++){ var t0=i*2*Math.PI/NS, t1=(i+1)*2*Math.PI/NS;
      seg(add(c,mul(add(mul(a,z),add(mul(u,rr*Math.cos(t0+spin)),mul(v,rr*Math.sin(t0+spin)))),R)),add(c,mul(add(mul(a,z),add(mul(u,rr*Math.cos(t1+spin)),mul(v,rr*Math.sin(t1+spin)))),R)),'rgba(226,232,240,.4)'); } }); };
  View.prototype.floor=function(half,step,z,col){ var k; z=z||0; for(k=-half;k<=half+1e-6;k+=step){ this.line([k,-half,z],[k,half,z],col||'rgba(148,163,184,.22)',1,-1); this.line([-half,k,z],[half,k,z],col||'rgba(148,163,184,.22)',1,-1); } };
  View.prototype.end=function(){ var ctx=this.ctx, q=this.q; q.sort(function(a,b){ return b.z-a.z; });
    q.forEach(function(o){ if(o.t==='l'){ ctx.strokeStyle=o.col; ctx.lineWidth=o.w; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(o.a[0],o.a[1]); ctx.lineTo(o.b[0],o.b[1]); ctx.stroke(); }
      else if(o.t==='p'){ ctx.beginPath(); o.s.forEach(function(p,i){ if(i) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); ctx.closePath(); if(o.fill){ ctx.fillStyle=o.fill; ctx.fill(); } ctx.strokeStyle=o.stroke||'rgba(7,12,24,.35)'; ctx.lineWidth=0.6; ctx.stroke(); }
      else if(o.t==='d'){ ctx.fillStyle=o.col; ctx.beginPath(); ctx.arc(o.s[0],o.s[1],o.r,0,6.2832); ctx.fill(); }
      else if(o.t==='s'){ var g=ctx.createRadialGradient(o.s[0]-o.r*0.35,o.s[1]-o.r*0.35,o.r*0.1,o.s[0],o.s[1],o.r); g.addColorStop(0,shade(o.col,1.25,o.alpha)); g.addColorStop(1,shade(o.col,0.55,o.alpha)); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(o.s[0],o.s[1],o.r,0,6.2832); ctx.fill(); }
      else { ctx.fillStyle=o.col; ctx.font='bold '+o.sz+'px system-ui,sans-serif'; ctx.textAlign=o.al; ctx.textBaseline='middle'; ctx.fillText(o.str,o.s[0],o.s[1]); } });
    ctx.textBaseline='alphabetic'; };
  return { C:C, View:View, add:add, sub:sub, mul:mul, dot:dot, cross:cross, len:len, nrm:nrm, frame:frame };
})();

/* ── 3D 카드 공통 : 탭 안에 「🧊 3D로 보기」 카드를 만들어 붙인다 ───────── */
var S3 = {};      // 장면 등록소 : S3[탭] = {title, cap, ctrls, cam, kv, draw}
var R3 = { running:false, list:[] };
function make3D(n){
  var sc=S3[n], host=document.getElementById('tab'+n); if(!sc||!host||document.getElementById('d3-'+n)) return;
  var card=document.createElement('div'); card.className='card'; card.id='d3-'+n;
  var ctr=sc.ctrls.map(function(c){ return '<div class="ctrl"><div class="ctrl-top"><span class="nm">'+c.label+'</span><span class="vl" id="d3-'+n+'-'+c.id+'V">—</span></div><input type="range" id="d3-'+n+'-'+c.id+'" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+c.val+'" aria-label="'+c.label+'"></div>'; }).join('');
  var kv=sc.kv.map(function(k,i){ return '<div class="cell '+k[1]+'"><span class="k">'+k[0]+'</span><span class="v" id="d3-'+n+'-k'+i+'">—</span></div>'; }).join('');
  card.innerHTML='<div class="h3">🧊 3D로 보기 — '+sc.title+' <span class="badge b-high">드래그로 돌려 보기</span></div>'+
    '<div class="goal">🎯 '+sc.goal+'</div>'+
    '<div class="grid2"><div>'+ctr+'<div class="row"><button type="button" class="btn sm pri" id="d3-'+n+'-auto">⟲ 자동 회전</button><button type="button" class="btn sm" id="d3-'+n+'-v1">정면</button><button type="button" class="btn sm" id="d3-'+n+'-v2">위에서</button><button type="button" class="btn sm" id="d3-'+n+'-v3">옆에서</button><button type="button" class="btn sm" id="d3-'+n+'-pause">⏸ 멈춤</button></div><div class="kv">'+kv+'</div><p class="tiny">'+sc.note+'</p></div>'+
    '<div><div class="cv-wrap"><canvas id="d3-'+n+'-cv" role="img" aria-label="'+sc.title+' 3D 장면" style="height:380px;width:100%"></canvas><div class="cv-cap">'+sc.cap+' (마우스 드래그 = 회전, 휠 = 확대 · 축소, 휴대폰은 좌우로 밀기)</div></div></div></div>';
  var after=host.querySelector('.grid2'); if(after&&after.parentNode===host) after.insertAdjacentElement('afterend',card); else host.appendChild(card);
  var cv=document.getElementById('d3-'+n+'-cv'), view=new M3.View(cv,sc.cam), st={t:0,pause:false,p:{},view:view,n:n};
  sc.ctrls.forEach(function(c){ st.p[c.id]=c.val; var el=document.getElementById('d3-'+n+'-'+c.id); function upd(){ st.p[c.id]=+el.value; setTxt('d3-'+n+'-'+c.id+'V', c.fmt? c.fmt(+el.value) : el.value+(c.unit||'')); }
    el.addEventListener('input',upd); upd(); });
  function setView(y,p){ view.yaw=y; view.pitch=p; view.auto=false; }
  var ab=document.getElementById('d3-'+n+'-auto'); ab.addEventListener('click',function(){ view.auto=!view.auto; });
  document.getElementById('d3-'+n+'-v1').addEventListener('click',function(){ setView(sc.cam.front!=null?sc.cam.front:0,0.12); });
  document.getElementById('d3-'+n+'-v2').addEventListener('click',function(){ setView(view.yaw,1.5); });
  document.getElementById('d3-'+n+'-v3').addEventListener('click',function(){ setView(sc.cam.side!=null?sc.cam.side:-1.57,0.12); });
  var pb=document.getElementById('d3-'+n+'-pause'); pb.addEventListener('click',function(){ st.pause=!st.pause; pb.textContent=st.pause?'▶ 계속':'⏸ 멈춤'; });
  R3.list.push(st); if(typeof typesetPanel==='function'){ try{ typesetPanel(card); }catch(e){} }
  if(!R3.running){ R3.running=true; var last=performance.now(); (function loop(now){ var dt=Math.min(0.05,(now-last)/1000); last=now;
      R3.list.forEach(function(s){ var pan=document.getElementById('tab'+s.n); if(!pan||!pan.classList.contains('on')) return; var v=s.view; if(v.auto) v.yaw+=dt*0.5; if(!s.pause) s.t+=dt;
        try{ v.begin(); S3[s.n].draw(v,s.t,s.pause?0:dt,s.p,s); v.end();
          S3[s.n].kv.forEach(function(k,i){ setTxt('d3-'+s.n+'-k'+i, k[2](s.p,s)); }); }catch(e){ if(!s.err){ s.err=1; console.error('3D 오류 탭'+s.n, e); } } });
      requestAnimationFrame(loop); })(last); }
}
function with3D(n){ var old=TabInit[n]; TabInit[n]=function(){ if(old) old(); make3D(n); }; }

/* ═══ 탭 2 : 원운동 벡터 ═══════════════════════════════════════════════ */
S3[2]={ title:'원운동의 ω · v · a_c 벡터', cam:{yaw:0.9,pitch:0.62,dist:4.4,auto:true,front:0.9,side:-1.57},
  goal:'각속도 벡터 ω 는 <b>회전축 방향</b>(오른손 법칙), 속도 v = ω × r 는 <b>접선</b>, 구심 가속도 a_c 는 <b>중심</b>을 향합니다. 세 벡터가 서로 수직인 것을 돌려서 확인하세요.',
  cap:'파랑 = ω(위쪽 회전축) · 초록 = v(접선) · 빨강 = a_c(중심 방향) · 회색 선 = 반지름 r',
  note:'ω 화살표 길이는 ω 에 비례, v 는 v=ωr, a_c 는 a_c=ω²r 에 비례하도록 줄여 그렸습니다. 반시계 방향(위에서 볼 때)이 +ω.',
  ctrls:[{id:'w',label:'각속도 ω',min:0.5,max:6,step:0.1,val:2,unit:' rad/s'},{id:'r',label:'반지름 r',min:0.3,max:1.6,step:0.1,val:1,unit:' m'}],
  kv:[['속력 v = ωr','a',function(p){ return (p.w*p.r).toFixed(2)+' m/s'; }],['a_c = ω²r','r',function(p){ return (p.w*p.w*p.r).toFixed(2)+' m/s²'; }],['주기 T','g',function(p){ return (2*Math.PI/p.w).toFixed(2)+' s'; }]],
  draw:function(g,t,dt,p,s){ var ph=(s.ph=(s.ph||0)+p.w*dt*0.5), r=p.r, P=[r*Math.cos(ph),r*Math.sin(ph),0], T=[-Math.sin(ph),Math.cos(ph),0], i, circ=[];
    g.target=[0,0,0.4]; g.floor(2,0.5);
    for(i=0;i<48;i++) circ.push([r*Math.cos(i*Math.PI/24),r*Math.sin(i*Math.PI/24),0]); g.path(circ,'rgba(148,163,184,.7)',1.5,true);
    g.line([0,0,0],P,M3.C.gray,2); g.dot([0,0,0],0.04,M3.C.white);
    g.arrow([0,0,0],[0,0,0.35*p.w],M3.C.blue,4); g.text([0.12,0,0.35*p.w+0.12],'ω',M3.C.blue,15);
    g.arrow(P,M3.add(P,M3.mul(T,0.28*p.w*r)),M3.C.green,4); g.text(M3.add(P,M3.mul(T,0.28*p.w*r+0.14)),'v',M3.C.green,14);
    g.arrow(P,M3.add(P,M3.mul(P,-0.085*p.w*p.w)),M3.C.red,4); g.text(M3.add(P,M3.mul(P,-0.085*p.w*p.w-0.14)),'a_c',M3.C.red,13);
    g.sphere(P,0.11,[0,0,1],0,M3.C.amber); g.text([r*0.5*Math.cos(ph),r*0.5*Math.sin(ph),0.12],'r',M3.C.gray,13); } };

/* ═══ 탭 3 : 토크 벡터 τ = r × F ═══════════════════════════════════════ */
S3[3]={ title:'토크는 벡터 — τ = r × F', cam:{yaw:0.6,pitch:0.7,dist:4.6,auto:false,front:0.6,side:-1.57},
  goal:'토크는 <b>r 에서 F 쪽으로 오른손을 감을 때 엄지 방향</b>의 벡터입니다. 크기 |τ| = rF sinθ 는 두 벡터가 만드는 <b>평행사변형의 넓이</b>이므로, θ 를 바꾸며 넓이와 초록 화살표가 함께 변하는 것을 보세요.',
  cap:'파랑 = 팔 r · 노랑 = 힘 F · 초록 = 토크 τ(막대가 놓인 면에 수직) · 연한 면 = 평행사변형(넓이 ∝ τ)',
  note:'r 은 3배, F 는 0.05 배, τ 는 0.06 배로 줄여 그렸습니다. θ 는 r 에서 F 까지 반시계로 잰 각입니다. 0° · 180° 이면 τ = 0.',
  ctrls:[{id:'F',label:'힘 F',min:5,max:50,step:1,val:25,unit:' N'},{id:'r',label:'팔 길이 r',min:0.1,max:0.6,step:0.05,val:0.4,unit:' m'},{id:'th',label:'힘의 각도 θ',min:0,max:180,step:5,val:90,unit:'°'}],
  kv:[['토크 τ = rF sinθ','a',function(p){ return (p.r*p.F*Math.sin(p.th*Math.PI/180)).toFixed(2)+' N·m'; }],['방향','g',function(p){ var q=Math.sin(p.th*Math.PI/180); return q<0.02?'0 (회전 없음)':'+z (위, 반시계)'; }],['수직 팔 r sinθ','v2',function(p){ return (p.r*Math.sin(p.th*Math.PI/180)*100).toFixed(1)+' cm'; }]],
  draw:function(g,t,dt,p){ var th=p.th*Math.PI/180, rv=[p.r*3,0,0], Fd=[Math.cos(th),Math.sin(th),0], Fv=M3.mul(Fd,p.F*0.05), tau=p.r*p.F*Math.sin(th), i, arc=[];
    g.target=[0.8,0.3,0.5]; g.floor(2,0.5);
    g.poly([[0,0,0.002],rv,M3.add(rv,Fv),Fv],M3.C.vio,{alpha:0.28,bias:-0.001});
    g.line([0,0,0],rv,M3.C.blue,6); g.dot([0,0,0],0.07,M3.C.white); g.arrow([0,0,0.001],rv,M3.C.blue,3); g.text(M3.add(M3.mul(rv,0.5),[0,-0.18,0]),'r',M3.C.blue,15);
    g.arrow(rv,M3.add(rv,Fv),M3.C.amber,4); g.text(M3.add(M3.add(rv,Fv),M3.mul(M3.nrm(Fv),0.16)),'F',M3.C.amber,15);
    if(tau>0.01){ g.arrow([0,0,0],[0,0,tau*0.06],M3.C.green,5); g.text([0.15,0,tau*0.06+0.12],'τ = r×F',M3.C.green,14);
      for(i=0;i<=16;i++){ var a=0.25+i*(Math.PI*1.2)/16; arc.push([0.45*Math.cos(a),0.45*Math.sin(a),0.02]); } g.path(arc,M3.C.green,2); g.arrow(arc[14],arc[16],M3.C.green,2); } } };

/* ═══ 탭 4 : 모양별 관성 모멘트 ════════════════════════════════════════ */
var SH3=[null,{n:'속 빈 고리',k:1},{n:'속이 찬 원판',k:0.5},{n:'속이 찬 구',k:0.4},{n:'속 빈 구',k:2/3},{n:'막대(가운데 축)',k:1/3},{n:'막대(끝 축)',k:4/3}];
S3[4]={ title:'같은 질량 · 같은 R, 모양에 따라 달라지는 I', cam:{yaw:0.8,pitch:0.45,dist:4.2,auto:true,front:0.8,side:-1.57},
  goal:'같은 질량이라도 <b>질량이 축에서 멀리 분포할수록</b> I = k m R² 의 k 가 커집니다. 노란 축을 중심으로 같은 ω 로 돌 때 같은 모양에서 축을 옮기면(막대 가운데 ↔ 끝) I 가 4 배 차이 나는 것을 확인하세요.',
  cap:'노랑 선 = 회전축 · 주황 표식 = 회전 상태 · 막대는 길이 2R',
  note:'ω = 3 rad/s 로 고정. 고리 k=1, 원판 0.5, 구 0.4, 속 빈 구 2/3, 막대(가운데) 1/3 (L=2R), 막대(끝) 4/3.',
  ctrls:[{id:'sh',label:'모양',min:1,max:6,step:1,val:1,fmt:function(v){ return SH3[v].n; }},{id:'m',label:'질량 m',min:0.5,max:5,step:0.5,val:2,unit:' kg'},{id:'R',label:'반지름 R',min:5,max:30,step:1,val:20,unit:' cm'}],
  kv:[['k (I = k m R²)','a',function(p){ return SH3[p.sh].k.toFixed(3); }],['관성 모멘트 I','g',function(p){ return (SH3[p.sh].k*p.m*Math.pow(p.R/100,2)*1000).toFixed(1)+' ×10⁻³ kg·m²'; }],['L = Iω','v2',function(p){ return (SH3[p.sh].k*p.m*Math.pow(p.R/100,2)*3).toFixed(3)+' kg·m²/s'; }],['K = ½Iω²','r',function(p){ return (0.5*SH3[p.sh].k*p.m*Math.pow(p.R/100,2)*9).toFixed(3)+' J'; }]],
  draw:function(g,t,dt,p,s){ var sp=(s.sp=(s.sp||0)+3*dt), sh=p.sh, R=p.R/20*1.0, z=[0,0,1]; g.target=[0,0,0.3]; g.floor(2,0.5,-0.6);
    if(sh===1) g.cyl([0,0,0],z,R,0.14,sp,M3.C.blue,{ri:R*0.86});
    else if(sh===2) g.cyl([0,0,0],z,R,0.1,sp,M3.C.blue);
    else if(sh===3) g.sphere([0,0,0],R,z,sp,M3.C.blue);
    else if(sh===4) g.sphere([0,0,0],R,z,sp,M3.C.blue,{alpha:0.4,hollow:true});
    else { var rot=[Math.cos(sp),Math.sin(sp),0], A=M3.mul(rot,R), B=M3.mul(rot,-R), a0=sh===5?B:[0,0,0], a1=sh===5?A:M3.mul(rot,2*R);
      var q=[a0,a1]; g.line(a0,a1,M3.C.blue,9); g.dot(a0,0.05,M3.C.amber); g.dot(a1,0.05,M3.C.amber); }
    g.line([0,0,-0.6],[0,0,0.9],M3.C.amber,3); g.dot([0,0,0.9],0.04,M3.C.amber);
    g.text([0,0,1.05],'회전축',M3.C.amber,12);
    g.text([0,0,-0.78],SH3[sh].n+' · k = '+SH3[sh].k.toFixed(2),M3.C.white,13); } };

/* ═══ 탭 5 : 자이로 세차 ═══════════════════════════════════════════════ */
S3[5]={ title:'자이로(팽이)가 쓰러지지 않고 도는 까닭', cam:{yaw:0.7,pitch:0.4,dist:4.2,auto:false,front:0.7,side:-1.57},
  goal:'빨강 L = Iω 는 <b>축 방향</b>이고 중력 토크 τ(초록)는 <b>L 에 수직인 수평 방향</b>이라, L 의 끝이 τ 쪽으로 돌아갑니다(dL/dt = τ). 그래서 쓰러지는 대신 <b>수평으로 천천히 도는 세차</b>가 됩니다. 스핀을 줄이면 세차가 빨라지는 것도 확인하세요.',
  cap:'바퀴(스핀) · 빨강 = 각운동량 L · 초록 = 중력 토크 τ(수평) · 주황 = 중력 mg · 노랑 점 = 받침점',
  note:'질량 0.8 kg, I = 0.05 kg·m² 고정. Ω = mgd/(Iω). 장동(nutation)은 무시한 이상적인 규칙 세차이며 시간 흐름은 실제보다 느리게 보입니다.',
  ctrls:[{id:'rpm',label:'스핀 회전수',min:60,max:300,step:10,val:200,unit:' rpm'},{id:'d',label:'받침점–바퀴 거리 d',min:10,max:40,step:1,val:25,unit:' cm'}],
  kv:[['L = Iω','a',function(p){ return (0.05*p.rpm*Math.PI/30).toFixed(2)+' kg·m²/s'; }],['토크 τ = mgd','g',function(p){ return (0.8*9.8*p.d/100).toFixed(2)+' N·m'; }],['세차 Ω = τ/L','v2',function(p){ return (0.8*9.8*(p.d/100)/(0.05*p.rpm*Math.PI/30)).toFixed(2)+' rad/s'; }],['세차 한 바퀴','r',function(p){ return (2*Math.PI/(0.8*9.8*(p.d/100)/(0.05*p.rpm*Math.PI/30))).toFixed(1)+' s'; }]],
  draw:function(g,t,dt,p,s){ var w=p.rpm*Math.PI/30, Om=0.8*9.8*(p.d/100)/(0.05*w), ph=(s.ph=(s.ph||0)+Om*dt*0.6), ps=(s.ps=(s.ps||0)+w*dt*0.12), d=p.d/100*4, e=[Math.cos(ph),Math.sin(ph),0], W=M3.mul(e,d), tg=[-Math.sin(ph),Math.cos(ph),0];
    g.target=[0,0,0]; g.floor(2,0.5,-0.9); g.line([0,0,-0.9],[0,0,0],M3.C.gray,5); g.dot([0,0,0],0.06,M3.C.amber);
    g.line([0,0,0],W,M3.C.gray,4); g.cyl(W,e,0.5,0.06,ps,M3.C.blue);
    g.arrow(W,M3.add(W,M3.mul(e,0.9)),M3.C.red,4); g.text(M3.add(W,M3.mul(e,1.08)),'L',M3.C.red,15);
    g.arrow(W,M3.add(W,[0,0,-0.7]),M3.C.amber,3); g.text(M3.add(W,[0,0,-0.85]),'mg',M3.C.amber,13);
    g.arrow([0,0,0],M3.mul(tg,0.9),M3.C.green,4); g.text(M3.mul(tg,1.08),'τ',M3.C.green,15);
    var ring=[],i; for(i=0;i<=40;i++) ring.push([d*0.35*Math.cos(i*Math.PI/20),d*0.35*Math.sin(i*Math.PI/20),0.02]); g.path(ring,'rgba(167,139,250,.6)',1.3,true); } };

/* ═══ 탭 6 : 구르기 경주 ═══════════════════════════════════════════════ */
S3[6]={ title:'구 · 원통 · 고리 구르기 경주', cam:{yaw:-0.95,pitch:0.4,dist:3.1,auto:false,front:-1.05,side:-1.57},
  goal:'같은 경사면에서 같은 높이로 출발해도 <b>질량이 축에서 먼 물체(고리)가 가장 늦게</b> 도착합니다. a = g sinθ/(1+k) 에서 k 가 작을수록 빠르며, 질량과 반지름은 상관이 없습니다. 돌려서 세 물체의 회전을 비교하세요.',
  cap:'파랑 = 속이 찬 구(k=0.4) · 초록 = 속이 찬 원통(k=0.5) · 분홍 = 고리(k=1) · 주황 표식 = 구르는 정도',
  note:'경사면 길이 1.5 m 를 미끄러짐 없이 구름. 출발 후 약 6 초마다 반복. 시간 배율로 느리게 볼 수 있습니다.',
  ctrls:[{id:'th',label:'경사각 θ',min:5,max:30,step:1,val:15,unit:'°'},{id:'sp',label:'재생 속도',min:0.25,max:2,step:0.25,val:0.5,unit:' 배'}],
  kv:[['구 도착 시간','a',function(p){ return Math.sqrt(2*1.5*1.4/(9.8*Math.sin(p.th*Math.PI/180))).toFixed(2)+' s'; }],['원통','g',function(p){ return Math.sqrt(2*1.5*1.5/(9.8*Math.sin(p.th*Math.PI/180))).toFixed(2)+' s'; }],['고리','r',function(p){ return Math.sqrt(2*1.5*2/(9.8*Math.sin(p.th*Math.PI/180))).toFixed(2)+' s'; }]],
  draw:function(g,t,dt,p,s){ var th=p.th*Math.PI/180, L=1.5, X=L*Math.cos(th), H=L*Math.sin(th), ks=[0.4,0.5,1], cols=[M3.C.blue,M3.C.green,M3.C.red], names=['구','원통','고리'], R=0.11, T=Math.max(3,Math.sqrt(2*L*2/(9.8*Math.sin(th)))+2);
    s.cl=((s.cl||0)+dt*p.sp); var tt=s.cl%T; g.target=[X/2,0,H/2]; var ys=[-0.7,0,0.7], i;
    g.poly([[0,-1.05,H],[X,-1.05,0],[X,1.05,0],[0,1.05,H]],M3.C.gray,{alpha:0.25});
    g.line([X,-1.05,0.002],[X,1.05,0.002],M3.C.amber,3); g.text([X+0.12,1.1,0],'결승선',M3.C.amber,11);
    for(i=0;i<3;i++){ var a=G*Math.sin(th)/(1+ks[i]), sdist=Math.min(L,0.5*a*tt*tt); var pos=[sdist*Math.cos(th), ys[i], H-sdist*Math.sin(th)], nrm=[Math.sin(th),0,Math.cos(th)], c=M3.add(pos,M3.mul(nrm,R)), spin=-sdist/R;
      if(i===0) g.sphere(c,R,[0,1,0],spin,cols[i]); else if(i===1) g.cyl(c,[0,1,0],R,0.2,spin,cols[i]); else g.cyl(c,[0,1,0],R,0.2,spin,cols[i],{ri:R*0.82});
      g.text([pos[0]-0.05,ys[i],pos[2]+0.34],names[i]+(sdist>=L?' 도착!':''),cols[i],12); } } };

[2,3,4,5,6].forEach(with3D);
