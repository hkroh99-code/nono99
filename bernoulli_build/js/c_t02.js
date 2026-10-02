/* ───────────────────────────────────────────────────────────────────────────
   TAB 2 — 원리① 연속 방정식 : A₁v₁ = A₂v₂ = Q. 입자는 「부피 좌표」를 따라 움직이게 해 실제 속력 분포가 나온다.
   검증(손계산) : D₁=6 cm → A₁=28.3 cm² · D₂=2 cm → A₂=3.14 cm² · v₁=1 m/s → v₂=9 m/s · Q=2.83 L/s
   ─────────────────────────────────────────────────────────────────────────── */
function dProf(x,D1,D2){ // x∈[0,1] 관 지름 분포(cm)
  if(x<0.3||x>0.7) return D1; if(x<0.45) return D1+(D2-D1)*(x-0.3)/0.15; if(x<=0.55) return D2; return D2+(D1-D2)*(x-0.55)/0.15; }
function t2tab(D1,D2){ var N=240, i, tot=0, cum=[0]; for(i=1;i<=N;i++){ var xm=(i-0.5)/N, d=dProf(xm,D1,D2); tot+=Math.PI*d*d/4/N; cum.push(tot); } return {cum:cum,tot:tot,N:N}; }
function t2xAt(tb,V){ var lo=0, hi=tb.N; while(hi-lo>1){ var m=(lo+hi)>>1; if(tb.cum[m]<=V) lo=m; else hi=m; } var f=(V-tb.cum[lo])/(tb.cum[hi]-tb.cum[lo]+1e-12); return (lo+f)/tb.N; }
var T2=mkTab(2,{ state:{D1:6,D2:2,v1:1.0}, unit:{D1:' cm',D2:' cm',v1:' m/s'}, fmt:{D2:function(v,S){ return Math.min(v,S.D1).toFixed(1)+' cm'; }},
  readout:function(S){ var D2=Math.min(S.D2,S.D1), A1=Math.PI*S.D1*S.D1/4, A2=Math.PI*D2*D2/4, v2=S.v1*A1/A2;
    setTxt('t2-oA',A1.toFixed(1)+' → '+A2.toFixed(1)+' cm²'); setTxt('t2-oV',v2.toFixed(2)+' m/s'); setTxt('t2-oQ',(A1*1e-4*S.v1*1000).toFixed(2)+' L/s'); setTxt('t2-oR',(v2/S.v1).toFixed(1)+' 배'); setTxt('t2-oT',(A1*1e-4*S.v1*60*1000).toFixed(0)+' L/min'); },
  anim:function(ctx,w,h,t,S){
    var D2=Math.min(S.D2,S.D1), x0=24, x1=w-24, L=x1-x0, cy=h*0.52, sc=(h*0.56)/Math.max(S.D1,1), tb=t2tab(S.D1,D2), n=90, i, A1=Math.PI*S.D1*S.D1/4, rate=A1*S.v1*0.09;
    var top=[], bot=[], k; for(k=0;k<=60;k++){ var x=k/60, d=dProf(x,S.D1,D2); top.push([x0+x*L,cy-d*sc/2]); bot.push([x0+x*L,cy+d*sc/2]); }
    ctx.beginPath(); top.forEach(function(p,j){ if(j) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); for(k=bot.length-1;k>=0;k--) ctx.lineTo(bot[k][0],bot[k][1]); ctx.closePath(); ctx.fillStyle='rgba(56,189,248,.2)'; ctx.fill();
    cvLine(ctx,top,COL.axis2,2.4); cvLine(ctx,bot,COL.axis2,2.4);
    for(i=0;i<n;i++){ var V=((i/n)*tb.tot+t*rate)%tb.tot, x=t2xAt(tb,V), d=dProf(x,S.D1,D2), fy=(((i*37)%17)/17-0.5)*0.86, vv=S.v1*A1/(Math.PI*d*d/4); cvCirc(ctx,x0+x*L,cy+fy*d*sc,Math.max(1.8,Math.min(3.6,1.6+vv*0.12)),vv>S.v1*1.5?COL.amber:COL.blue,null); }
    cvText(ctx,'A₁ = '+A1.toFixed(1)+' cm² · v₁ = '+S.v1.toFixed(1)+' m/s',x0,18,COL.tick,'11.5px system-ui,sans-serif'); var A2=Math.PI*D2*D2/4;
    cvText(ctx,'목 : A₂ = '+A2.toFixed(1)+' cm² · v₂ = '+(S.v1*A1/A2).toFixed(2)+' m/s',x0+L*0.5,cy-S.D1*sc/2-12,COL.amber,'bold 12px system-ui,sans-serif','center');
    cvText(ctx,'입자가 빨리 지나가는 곳(노랑) = 속력이 큰 곳. 같은 시간에 같은 부피가 통과한다(Q 일정).',x0,h-12,COL.tick,'11px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var D2=Math.min(S.D2,S.D1), A1=Math.PI*S.D1*S.D1/4, hh=Math.floor(h*0.52), pv=[], pq=[], k;
    for(k=0;k<=80;k++){ var x=k/80, d=dProf(x,S.D1,D2), A=Math.PI*d*d/4; pv.push([x,S.v1*A1/A]); pq.push([x,A1*1e-4*S.v1*1000]); }
    var vmax=Math.max(S.v1*A1/(Math.PI*D2*D2/4)*1.1,1);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:1,ymin:0,ymax:vmax,ylabel:'속력 v (m/s)',title:'관을 따라 속력 v(x) — 좁은 곳에서 크다',left:60,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(vmax>20?0:1); }}, function(P){ plotLine(ctx,P,pv,COL.amber,2.4); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:1,ymin:0,ymax:A1*1e-4*S.v1*1000*1.6+0.01,xlabel:'입구 → 출구 (관을 따른 위치)',ylabel:'유량 Q (L/s)',title:'유량 Q = Av 는 어디서나 같다',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(2); }}, function(P){ plotLine(ctx,P,pq,COL.ok,2.4); });
  }
});
