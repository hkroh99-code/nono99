/* ───────────────────────────────────────────────────────────────────────────
   TAB 3 — 원리② 파스칼의 원리 : 유압 잭. P=F₁/A₁ 이 모든 곳에 같다 → F₂ = P·A₂·η, d₂ = d₁A₁/A₂ (일 보존)
   검증(손계산) : F₁=100 N · A₁=2 cm² · 면적비 10 · η=100 % → P=500 kPa · F₂=1000 N · d₁=10 cm → d₂=1 cm · 일 10 J = 10 J
   ─────────────────────────────────────────────────────────────────────────── */
var A1=2e-4;
var T3=mkTab(3,{ state:{F1:100,r:10,eta:90,d1:10}, unit:{F1:' N',r:' : 1',eta:' %',d1:' cm'},
  readout:function(S){ var o=hydr(S.F1,A1,A1*S.r,S.eta/100,S.d1/100); setTxt('t3-oP',(o.p/1000).toFixed(0)+' kPa'); setTxt('t3-oF',o.F2.toFixed(0)+' N ('+(o.F2/G).toFixed(0)+' kgf)'); setTxt('t3-oG',o.gain.toFixed(1)+' 배'); setTxt('t3-oD',(o.d2*100).toFixed(2)+' cm'); setTxt('t3-oW',o.Win.toFixed(1)+' J → '+o.Wout.toFixed(1)+' J'); },
  anim:function(ctx,w,h,t,S){
    var o=hydr(S.F1,A1,A1*S.r,S.eta/100,S.d1/100), ph=(t%5)/5, u=ph<0.5? ph*2 : 1-(ph-0.5)*2, base=h-60, cx1=w*0.22, cx2=w*0.66, wid1=Math.max(20,Math.min(50,w*0.08)), wid2=Math.min(130,wid1*Math.sqrt(S.r)*1.15), top=50, trav=Math.min(60,S.d1*3), y1=top+30+u*trav, y2=top+30+(trav*0.55)*(1-u)*(1/Math.sqrt(S.r))*3+0;
    /* 유체 통로 */
    ctx.fillStyle='rgba(56,189,248,.28)'; ctx.fillRect(cx1-wid1/2,top+40,wid1,base-top-40); ctx.fillRect(cx1-wid1/2,base-30,cx2-cx1+wid2/2+wid1/2,30); ctx.fillRect(cx2-wid2/2,top+40,wid2,base-top-40);
    ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.strokeRect(cx1-wid1/2,top+40,wid1,base-top-40); ctx.strokeRect(cx2-wid2/2,top+40,wid2,base-top-40); ctx.lineWidth=1;
    /* 피스톤 */
    var yp1=top+40+u*trav, yp2=top+40+(trav/S.r)*(1-u)*0+ (trav/S.r)*(1-u)*0; var up2=Math.max(4,trav/S.r)*u; yp2=top+40-up2+ (0);
    ctx.fillStyle=COL.white; ctx.fillRect(cx1-wid1/2-2,yp1-8,wid1+4,8); ctx.fillRect(cx1-3,yp1-48,6,40);
    ctx.fillRect(cx2-wid2/2-2,yp2-8,wid2+4,8);
    /* 힘 화살표와 짐 */
    cvArrow(ctx,cx1,yp1-64,cx1,yp1-50,COL.amber,2.6); cvText(ctx,'F₁ = '+S.F1+' N',cx1+10,yp1-66,COL.amber,'bold 12px system-ui,sans-serif');
    var ld=Math.min(80,30+o.F2/G*0.08); ctx.fillStyle=COL.blue; ctx.fillRect(cx2-ld/2,yp2-8-ld*0.5,ld,ld*0.5); cvText(ctx,(o.F2/G).toFixed(0)+' kg',cx2,yp2-8-ld*0.25+4,'#07101f','bold 12px system-ui,sans-serif','center');
    cvArrow(ctx,cx2+wid2/2+18,yp2-4,cx2+wid2/2+18,yp2-26,COL.ok,2.6); cvText(ctx,'F₂ = '+o.F2.toFixed(0)+' N',cx2+wid2/2+24,yp2-30,COL.ok,'bold 12px system-ui,sans-serif');
    cvText(ctx,'압력 P = '+(o.p/1000).toFixed(0)+' kPa (모든 곳에 같다)',w*0.44,base-10,COL.white,'11.5px system-ui,sans-serif','center');
    cvText(ctx,'A₁ = 2 cm² · A₂ = '+(2*S.r)+' cm² · 이동 d₁ = '+S.d1+' cm → d₂ = '+(o.d2*100).toFixed(2)+' cm',12,18,COL.text,'bold 12px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.52), o=hydr(S.F1,A1,A1*S.r,S.eta/100,S.d1/100);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:400,ymin:0,ymax:Math.max(1000,400*S.r*S.eta/100*1.05),ylabel:'출력 힘 F₂ (N)',title:'입력 힘 → 출력 힘 : 기울기 = (A₂/A₁)·η',left:60,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      plotLine(ctx,P,[[0,0],[400,400*S.r]],COL.dim,1.4,[5,4]); plotLine(ctx,P,[[0,0],[400,400*S.r*S.eta/100]],COL.ok,2.4); plotPoints(ctx,P,[[S.F1,o.F2]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['이상(η=100 %)',COL.dim],['실제',COL.ok],['지금',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.5,xmax:3.5,ymin:0,ymax:Math.max(o.Win,o.Wout)*1.2+0.01,xlabel:'1 입력 일 · 2 출력 일 · 3 손실',ylabel:'일 (J)',title:'힘은 커져도 일은 늘지 않는다 (W = Fd)',left:60,top:24,bottom:40,xfmt:function(v){ return Math.abs(v-Math.round(v))<0.01? v.toFixed(0):''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){
      [[1,o.Win,COL.amber],[2,o.Wout,COL.ok],[3,o.Win-o.Wout,COL.grav]].forEach(function(q){ ctx.fillStyle=q[2]; ctx.fillRect(P.X(q[0]-0.3),P.Y(q[1]),P.X(q[0]+0.3)-P.X(q[0]-0.3),P.y0-P.Y(q[1])); cvText(ctx,q[1].toFixed(2),P.X(q[0]),P.Y(q[1])-8,COL.text,'11px system-ui,sans-serif','center'); }); });
  }
});
