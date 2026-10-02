/* ───────────────────────────────────────────────────────────────────────────
   TAB 3 — 원리② 베르누이 방정식 : p + ½ρv² + ρgz = 일정 (같은 유선 · 정상 · 비점성 · 비압축성)
   검증(손계산) : v₁=2 m/s · 면적비 4 → v₂=8 m/s · p₁=40 kPa · z 같음 → p₂=40+½·1000·(4−64)/1000 = 10 kPa
                 목 높이 +20 cm → p₂ = 10 − 1000·9.8·0.2/1000 = 8.04 kPa
   ─────────────────────────────────────────────────────────────────────────── */
function aProf(x,r){ var D=dProf(x,1,1/Math.sqrt(r)); return D*D; } // A/A₁
function sProf(x,r){ var a=aProf(x,r); return (1-a)/(1-1/r); } // 0(넓은 곳) … 1(목)
var T3=mkTab(3,{ state:{v1:2.0,r:4,dz:0,p1:40}, unit:{v1:' m/s',r:' : 1',dz:' cm',p1:' kPa'},
  readout:function(S){ var v2=S.v1*S.r, p2=bernP2(S.p1*1000,S.v1,0,v2,S.dz/100,RHO_W)/1000;
    setTxt('t3-oV',v2.toFixed(2)+' m/s'); setTxt('t3-oP',p2.toFixed(1)+' kPa'); setTxt('t3-oD',(S.p1-p2).toFixed(1)+' kPa'); setTxt('t3-oH',(p2*1000/(RHO_W*G)*100).toFixed(0)+' cm 수주'); setTxt('t3-oC', p2<-99? '⚠ 절대 압력 ≈ 0 — 기포(캐비테이션)·식 불성립' : (p2<0?'게이지 음압(대기압보다 낮음)':'정상 범위')); },
  anim:function(ctx,w,h,t,S){
    var x0=24, x1=w-24, L=x1-x0, cy=h*0.6, sc=h*0.2, r=S.r, v2=S.v1*r, p2=bernP2(S.p1*1000,S.v1,0,v2,S.dz/100,RHO_W)/1000, tb, i, n=70, k;
    var top=[], bot=[]; for(k=0;k<=60;k++){ var x=k/60, d=Math.sqrt(aProf(x,r)), zz=S.dz/100*sProf(x,r)*h*0.5/0.5; top.push([x0+x*L,cy-d*sc-zz*0.6]); bot.push([x0+x*L,cy+d*sc-zz*0.6]); }
    ctx.beginPath(); top.forEach(function(p,j){ if(j) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); for(k=bot.length-1;k>=0;k--) ctx.lineTo(bot[k][0],bot[k][1]); ctx.closePath(); ctx.fillStyle='rgba(56,189,248,.2)'; ctx.fill(); cvLine(ctx,top,COL.axis2,2.4); cvLine(ctx,bot,COL.axis2,2.4);
    var N=200, cum=[0], tot=0; for(i=1;i<=N;i++){ var xm=(i-0.5)/N; tot+=aProf(xm,r)/N; cum.push(tot); } var rate=tot*0.35*S.v1/2;
    for(i=0;i<n;i++){ var V=((i/n)*tot+t*rate)%tot, lo=0, hi=N; while(hi-lo>1){ var m=(lo+hi)>>1; if(cum[m]<=V) lo=m; else hi=m; } var x=(lo+(V-cum[lo])/(cum[hi]-cum[lo]+1e-12))/N, d=Math.sqrt(aProf(x,r)), fy=(((i*37)%17)/17-0.5)*0.86, zz=S.dz/100*sProf(x,r)*h*0.5/0.5; cvCirc(ctx,x0+x*L,cy+fy*d*sc-zz*0.6,2.6,COL.blue,null); }
    // 압력관(마노미터) : 지점 1 (x=0.12), 지점 2 (x=0.5)
    function man(xp,pk,lab,zz){ var xx=x0+xp*L, y0c=cy-Math.sqrt(aProf(xp,r))*sc-zz*0.6, hcm=Math.max(-0.1,pk*1000/(RHO_W*G)), ph=Math.max(-18,Math.min(h*0.42,hcm*h*0.06)); ctx.strokeStyle=COL.tick; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(xx-7,y0c); ctx.lineTo(xx-7,y0c-h*0.45); ctx.moveTo(xx+7,y0c); ctx.lineTo(xx+7,y0c-h*0.45); ctx.stroke(); ctx.lineWidth=1; ctx.fillStyle='rgba(56,189,248,.5)'; ctx.fillRect(xx-6,y0c-ph,12,ph+1); cvLine(ctx,[[xx-24,y0c-ph],[xx+24,y0c-ph]],COL.amber,1.4,[4,3]); cvText(ctx,lab+' '+pk.toFixed(1)+' kPa',xx,y0c-h*0.45-8,COL.amber,'bold 11.5px system-ui,sans-serif','center'); }
    man(0.12,S.p1,'p₁',0); man(0.5,p2,'p₂',S.dz/100*h*0.5/0.5);
    cvText(ctx,'v₁ = '+S.v1.toFixed(1)+' m/s  →  목 v₂ = '+v2.toFixed(1)+' m/s',x0,16,COL.text,'bold 12px system-ui,sans-serif');
    if(p2<-99) cvText(ctx,'⚠ 압력이 거의 0 — 기포가 생기는 한계',x0+L*0.5,h-10,COL.grav,'bold 12px system-ui,sans-serif','center');
  },
  graph:function(ctx,w,h,S){ var r=S.r, v2=S.v1*r, hh=Math.floor(h*0.52), pp=[], k;
    for(k=0;k<=80;k++){ var x=k/80, a=aProf(x,r), v=S.v1/a, z=S.dz/100*sProf(x,r); pp.push([x,bernP2(S.p1*1000,S.v1,0,v,z,RHO_W)/1000]); }
    var mn=Math.min.apply(null,pp.map(function(q){ return q[1]; })), mx=Math.max(S.p1,mn)+5, lo=Math.min(0,mn-5);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:1,ymin:lo,ymax:mx,ylabel:'게이지 압력 p (kPa)',title:'관을 따라 압력 p(x) — 목에서 가장 낮다',left:60,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,[[0,0],[1,0]],COL.dim,1,[4,3]); plotLine(ctx,P,pp,COL.ok,2.4); });
    var p2=bernP2(S.p1*1000,S.v1,0,v2,S.dz/100,RHO_W)/1000, E=[[S.p1,0.5*RHO_W*S.v1*S.v1/1000,0],[p2,0.5*RHO_W*v2*v2/1000,RHO_W*G*S.dz/100/1000]], Ht=S.p1+0.5*RHO_W*S.v1*S.v1/1000;
    var ymax=Math.max(Ht,0.5*RHO_W*v2*v2/1000,1)*1.15, ymin=Math.min(0,p2,-1)*1.1;
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.5,xmax:2.5,ymin:ymin,ymax:ymax,xlabel:'지점 1(넓은 곳) · 지점 2(목) — 압력 / 운동 / 위치',ylabel:'kPa',title:'항목별 값 — 합(점선)은 두 지점에서 같다',left:60,top:24,bottom:40,xfmt:function(v){ return Math.abs(v-Math.round(v))<0.01? v.toFixed(0):''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      var cols=[COL.blue,COL.amber,COL.ok]; E.forEach(function(e,j){ e.forEach(function(val,q){ var xa=P.X(j+1+(q-1)*0.26-0.11), xb=P.X(j+1+(q-1)*0.26+0.11), y0z=P.Y(0), yv=P.Y(val); ctx.fillStyle=cols[q]; ctx.fillRect(xa,Math.min(y0z,yv),xb-xa,Math.abs(yv-y0z)); }); });
      plotLine(ctx,P,[[0.5,Ht],[2.5,Ht]],COL.white,1.4,[5,4]); legend(ctx,P.x1-150,P.y1+14,[['압력 p',COL.blue],['운동 ½ρv²',COL.amber],['위치 ρgz',COL.ok]]); });
  }
});
