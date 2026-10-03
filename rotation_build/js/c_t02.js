/* ───────────────────────────────────────────────────────────────────────────
   TAB 2 — 원리① 각운동학 : θ=θ₀+ω₀t+½αt² · ω=ω₀+αt · v=rω · a_t=rα · a_c=rω²
   검증(손계산) : ω₀=2 rad/s · α=1.5 rad/s² · t=4 s → ω=8 rad/s · θ=2·4+0.5·1.5·16=20 rad(3.18 회전) · r=0.3 m → v=2.4 m/s · a_c=19.2 · a_t=0.45
   ─────────────────────────────────────────────────────────────────────────── */
var T2=mkTab(2,{ state:{w0:2,al:1.5,r:30,tt:4}, unit:{w0:' rad/s',al:' rad/s²',r:' cm',tt:' s'},
  readout:function(S){ var w=S.w0+S.al*S.tt, th=S.w0*S.tt+0.5*S.al*S.tt*S.tt, r=S.r/100;
    setTxt('t2-oW',w.toFixed(2)+' rad/s ('+w2rpm(w).toFixed(0)+' rpm)'); setTxt('t2-oT',th.toFixed(1)+' rad ('+(th/TAU).toFixed(2)+' 회전)'); setTxt('t2-oV',(r*w).toFixed(2)+' m/s'); setTxt('t2-oA',(r*S.al).toFixed(2)+' m/s²'); setTxt('t2-oC',acent(w,r).toFixed(1)+' m/s² ('+(acent(w,r)/G).toFixed(1)+' g)'); },
  anim:function(ctx,w,h,t,S){
    var cx=w*0.3, cy=h*0.52, R=Math.min(h*0.36,w*0.24), tt=(t%10)/10*S.tt*2, tc=Math.min(tt,S.tt), om=S.w0+S.al*tc, th=S.w0*tc+0.5*S.al*tc*tc, r=S.r/100;
    ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,R,0,TAU); ctx.stroke(); ctx.lineWidth=1; cvCirc(ctx,cx,cy,4,COL.dim,null);
    var px=cx+R*Math.cos(-th), py=cy+R*Math.sin(-th); cvLine(ctx,[[cx,cy],[px,py]],COL.tick,1.5); cvCirc(ctx,px,py,9,COL.amber,COL.white,1.5);
    var vs=Math.min(60,r*om*18), ax=-Math.sin(-th), ay=Math.cos(-th); cvArrow(ctx,px,py,px+ax*vs*-1,py+ay*vs*-1,COL.ok,2.6);
    var ac=Math.min(60,acent(om,r)*1.2); cvArrow(ctx,px,py,px+(cx-px)/R*ac,py+(cy-py)/R*ac,COL.grav,2.6);
    cvText(ctx,'t = '+tc.toFixed(1)+' s · θ = '+th.toFixed(1)+' rad · ω = '+om.toFixed(2)+' rad/s',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'초록 = 속도 v=rω (접선) · 빨강 = 구심 가속도 rω² (중심 향함)',12,h-12,COL.tick,'11px system-ui,sans-serif');
    // 각도–시간 막대
    var bx=w*0.62, bw=w*0.34, by=h*0.2; cvText(ctx,'지금까지 돈 횟수',bx,by,COL.tick,'11px system-ui,sans-serif'); var full=(S.w0*S.tt+0.5*S.al*S.tt*S.tt)/TAU; cvRect(ctx,bx,by+10,bw,16,'rgba(148,163,184,.2)',null); cvRect(ctx,bx,by+10,bw*Math.min(1,Math.max(0,th/TAU/Math.max(full,0.01))),16,COL.blue,null); cvText(ctx,(th/TAU).toFixed(2)+' / '+full.toFixed(2)+' 회전',bx,by+44,COL.text,'11.5px system-ui,sans-serif');
    var cy2=h*0.64; cvText(ctx,'ω 의 변화',bx,cy2,COL.tick,'11px system-ui,sans-serif'); var wmax=Math.max(1,S.w0,S.w0+S.al*S.tt)*1.1; cvRect(ctx,bx,cy2+10,bw,16,'rgba(148,163,184,.2)',null); cvRect(ctx,bx,cy2+10,bw*Math.max(0,om)/wmax,16,COL.ok,null); cvText(ctx,om.toFixed(2)+' rad/s',bx,cy2+44,COL.text,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.5), pw=[], pt=[], k, T=Math.max(S.tt*1.4,2);
    for(k=0;k<=T+0.001;k+=T/40){ pw.push([k,S.w0+S.al*k]); pt.push([k,S.w0*k+0.5*S.al*k*k]); }
    var wmx=Math.max(Math.abs(S.w0),Math.abs(S.w0+S.al*T),1)*1.1, wmn=Math.min(0,S.w0,S.w0+S.al*T)*1.1;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:T,ymin:wmn,ymax:wmx,ylabel:'ω (rad/s)',title:'각속도 ω(t) — 기울기 = α',left:60,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,pw,COL.ok,2.4); plotPoints(ctx,P,[[S.tt,S.w0+S.al*S.tt]],COL.amber,7); });
    var tmx=Math.max(Math.abs(S.w0*T+0.5*S.al*T*T),1)*1.1, tmn=Math.min(0,S.w0*T+0.5*S.al*T*T)*1.1;
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:T,ymin:tmn,ymax:tmx,xlabel:'시간 t (s)',ylabel:'θ (rad)',title:'회전각 θ(t) — 면적 = ∫ω dt',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,pt,COL.blue,2.4); plotPoints(ctx,P,[[S.tt,S.w0*S.tt+0.5*S.al*S.tt*S.tt]],COL.amber,7); }); }
});
