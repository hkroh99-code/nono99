/* ───────────────────────────────────────────────────────────────────────────
   TAB 6 — 원리⑤ 적용 한계 · 측정 · 안전. 레이놀즈 수 · 마하 수 · 압축성 오차(M²/4) · 점성 손실(관 마찰 f·L/D).
   검증(손계산) : 공기 20 ℃ v=30 m/s D=5 cm → Re=1.204·30·0.05/1.81e-5=99,800(난류) · M=30/343=0.087 → 오차 ≈ M²/4=0.19 % · 물 v=1 m/s D=2 cm → Re=19,950
   ─────────────────────────────────────────────────────────────────────────── */
var FL6=[null,{n:'공기 20 ℃',rho:1.204,mu:1.81e-5,c:343},{n:'물 20 ℃',rho:998.2,mu:1.002e-3,c:1482},{n:'글리세린 20 ℃',rho:1260,mu:1.41,c:1920}];
function fric(Re){ if(Re<2300) return 64/Math.max(Re,1); if(Re<4000){ var f1=64/2300, f2=0.316*Math.pow(4000,-0.25); return f1+(f2-f1)*(Re-2300)/1700; } return 0.316*Math.pow(Re,-0.25); }
function t6(S){ var f=FL6[S.fl], Re=reyn(f.rho,S.v,S.D/100,f.mu), M=S.v/f.c, fr=fric(Re), loss=fr*(S.L/(S.D/100)); return {f:f,Re:Re,M:M,fr:fr,loss:loss,err:(qcRatio(M)-1)*100}; }
var T6=mkTab(6,{ state:{fl:1,v:30,D:5,L:2}, fmt:{fl:function(v){ return FL6[v].n; }}, unit:{v:' m/s',D:' cm',L:' m'},
  readout:function(S){ var o=t6(S); setTxt('t6-oR',o.Re>=1000? o.Re.toFixed(0):o.Re.toFixed(1)); setTxt('t6-oT', o.Re<2300?'층류':(o.Re<4000?'전이':'난류')); setTxt('t6-oM',o.M.toFixed(3)); setTxt('t6-oE',o.err.toFixed(2)+' %'); setTxt('t6-oL',(o.loss*100).toFixed(1)+' % of ½ρv²'+(o.loss>0.3?' — 베르누이 단독 사용 부적절':'')); },
  anim:function(ctx,w,h,t,S){ var o=t6(S), x0=20, L=w-2*x0, cy=h*0.45, hw=h*0.2, i, turb=o.Re>=3000;
    ctx.fillStyle='rgba(56,189,248,.14)'; ctx.fillRect(x0,cy-hw,L,2*hw); cvLine(ctx,[[x0,cy-hw],[x0+L,cy-hw]],COL.axis2,2.4); cvLine(ctx,[[x0,cy+hw],[x0+L,cy+hw]],COL.axis2,2.4);
    for(i=-4;i<=4;i++){ var pts=[], u; for(u=0;u<=60;u++){ var x=u/60, yy=cy+i*hw/4.6+(turb? Math.sin(x*18+i*1.7+t*4)*hw*0.09*(1+Math.abs(i)*0.3)+Math.sin(x*41+i*3.1-t*7)*hw*0.05 : 0); pts.push([x0+x*L,yy]); } cvLine(ctx,pts,turb?COL.amber:COL.blue,1.3); }
    for(i=0;i<26;i++){ var rel=((i*7)%9-4)/4.6, fast=turb? 0.85+0.15*(1-rel*rel) : 1.2*(1-rel*rel*0.9), x=x0+((i*53+t*60*fast*Math.min(2,0.4+Math.log10(1+S.v)*0.5))%L); cvCirc(ctx,x,cy+rel*hw*0.92+(turb? Math.sin(x*0.06+t*6+i)*hw*0.08:0),2.4,turb?'#fde68a':'#bae6fd',null); }
    cvText(ctx,o.f.n+' · Re = '+o.Re.toFixed(0)+' → '+(o.Re<2300?'층류(매끄러운 층)':(o.Re<4000?'전이':'난류(소용돌이)')),x0,16,turb?COL.amber:COL.ok,'bold 12.5px system-ui,sans-serif');
    cvText(ctx,'마하 '+o.M.toFixed(3)+' · 압축성 오차 ≈ '+o.err.toFixed(2)+' % · 관 마찰 손실 '+(o.loss*100).toFixed(1)+' % of ½ρv²',x0,h-14,COL.tick,'11.5px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var o=t6(S), hh=Math.floor(h*0.5), pe=[], pa=[], pl=[], k;
    for(k=0;k<=1.0001;k+=0.02){ pe.push([k,(qcRatio(k)-1)*100]); pa.push([k,k*k/4*100]); }
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:1,ymin:0,ymax:30,xlabel:'',ylabel:'오차 (%)',title:'비압축성 근사의 오차 대 마하 수 (M²/4 점선)',left:60,top:24,bottom:22,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,pe,COL.grav,2.4); plotLine(ctx,P,pa,COL.dim,1.4,[5,4]); plotLine(ctx,P,[[0.3,0],[0.3,30]],COL.purple||'#a78bfa',1.2,[3,3]); if(o.M<=1) plotPoints(ctx,P,[[o.M,Math.min(30,o.err)]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['정확한 값',COL.grav],['M²/4',COL.dim],['마하 0.3',COL.purple||'#a78bfa']]); });
    for(k=0.1;k<=50;k*=1.12) pl.push([k,Math.min(100,fric(o.Re)*(k/(S.D/100))*100)]);
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:50,ymin:0,ymax:100,xlabel:'관 길이 L (m)',ylabel:'손실 / ½ρv² (%)',title:'관 마찰 손실 — 길수록 베르누이 식(손실 무시)이 어긋난다',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,pl,COL.blue,2.4); plotPoints(ctx,P,[[S.L,Math.min(100,o.loss*100)]],COL.amber,7); });
  }
});
