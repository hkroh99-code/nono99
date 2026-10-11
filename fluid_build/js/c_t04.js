/* ───────────────────────────────────────────────────────────────────────────
   TAB 4 — 원리③ 아르키메데스의 원리 : B = ρ_유체 V_잠긴 g. 겉보기 무게 = W − B
   검증(손계산) : 쇠공 ρ=7800 · V=100 cm³ · 물 → W=7.64 N · B=0.98 N · 겉보기 6.66 N (저울 679 g) · 나무 ρ=600 → 60 % 잠겨 뜸
   ─────────────────────────────────────────────────────────────────────────── */
var T4=mkTab(4,{ state:{ro:7800,V:100,rf:1000}, unit:{ro:' kg/m³',V:' cm³',rf:' kg/m³'},
  readout:function(S){ var o=buoy(S.ro,S.V*1e-6,S.rf); setTxt('t4-oW',o.W.toFixed(2)+' N'); setTxt('t4-oB',o.B.toFixed(2)+' N'); setTxt('t4-oA',o.floats? '0 (떠 있음)' : o.app.toFixed(2)+' N ('+(o.app/G*1000).toFixed(0)+' g)'); setTxt('t4-oF',(o.frac*100).toFixed(0)+' %'); setTxt('t4-oJ',o.floats?'뜬다 (ρ물체 < ρ유체)': (Math.abs(S.ro-S.rf)<1?'부유(중성)':'가라앉는다')); },
  anim:function(ctx,w,h,t,S){
    var o=buoy(S.ro,S.V*1e-6,S.rf), tx=w*0.34, tw=Math.min(190,w*0.4), top=60, ttop=top+60, tbot=h-30, wl=ttop+50, s=Math.cbrt(S.V)/Math.cbrt(500)*70+22, bob=o.floats? Math.sin(t*1.8)*3*(1-Math.min(1,t/6)) : 0;
    ctx.fillStyle='rgba(56,189,248,.22)'; var gr=ctx.createLinearGradient(0,wl,0,tbot); gr.addColorStop(0,'rgba(56,189,248,.22)'); gr.addColorStop(1,'rgba(30,64,175,.55)'); ctx.fillStyle=gr; ctx.fillRect(tx-tw/2,wl,tw,tbot-wl); vessel(ctx,tx-tw/2,ttop,tw,tbot-ttop);
    var by; if(o.floats){ by=wl-s*(1-o.frac)+bob; } else { var u=Math.min(1,t/2.2); by=wl-s*0.5+(tbot-4-s-(wl-s*0.5))*u; }
    ctx.fillStyle=o.floats?'#c4a46a':'#94a3b8'; ctx.fillRect(tx-s/2,by,s,s); ctx.strokeStyle=COL.white; ctx.strokeRect(tx-s/2,by,s,s);
    /* 힘 화살표 */
    var sc=Math.min(60,260/Math.max(o.W,1e-3)*0.2)*0+ 7, cxo=tx, cyo=by+s/2, Wl=Math.min(70,o.W*sc), Bl=Math.min(70,o.B*sc);
    cvArrow(ctx,cxo+s/2+14,cyo,cxo+s/2+14,cyo+Wl,COL.grav,2.6); cvText(ctx,'W '+o.W.toFixed(2)+' N',cxo+s/2+22,cyo+Wl,COL.grav,'bold 11.5px system-ui,sans-serif');
    cvArrow(ctx,cxo-s/2-14,cyo,cxo-s/2-14,cyo-Bl,COL.ok,2.6); cvText(ctx,'B '+o.B.toFixed(2)+' N',cxo-s/2-22,cyo-Bl,COL.ok,'bold 11.5px system-ui,sans-serif','right');
    /* 스프링 저울 (매달린 경우) */
    var sx=w*0.76; ctx.strokeStyle=COL.axis2; ctx.lineWidth=2; ctx.strokeRect(sx-26,top-26,52,150); ctx.lineWidth=1; var rd=o.floats?0:o.app; var mxs=Math.max(o.W,1), pos=top-20+ (rd/mxs)*110; ctx.fillStyle=COL.amber; ctx.fillRect(sx-30,pos,60,4);
    cvText(ctx,'스프링 저울',sx,top+140,COL.tick,'11px system-ui,sans-serif','center'); cvText(ctx,(rd/G*1000).toFixed(0)+' g',sx,top+158,COL.amber,'bold 13px system-ui,sans-serif','center'); cvText(ctx,'(공기 중 '+(o.W/G*1000).toFixed(0)+' g)',sx,top+174,COL.tick,'10.5px system-ui,sans-serif','center');
    cvText(ctx,'ρ물체 '+S.ro+' · ρ액체 '+S.rf+' kg/m³ · V '+S.V+' cm³ → '+(o.floats?'뜬다 · 잠긴 비율 '+(o.frac*100).toFixed(0)+' %':'가라앉는다 · 부력은 완전 잠김 값 '),12,18,COL.text,'bold 12px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.52), Vm=S.V*1e-6, o=buoy(S.ro,Vm,S.rf), i;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:S.V,ymin:0,ymax:Math.max(o.W,S.rf*Vm*G)*1.15,ylabel:'힘 (N)',title:'잠긴 부피 → 부력 (직선, 기울기 = ρ액체·g) 과 무게',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){
      plotLine(ctx,P,[[0,0],[S.V,S.rf*Vm*G]],COL.ok,2.4); plotLine(ctx,P,[[0,o.W],[S.V,o.W]],COL.grav,2,[6,4]); var vs=o.floats? o.frac*S.V : S.V; plotPoints(ctx,P,[[vs,o.B]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['부력 B',COL.ok],['무게 W',COL.grav],['평형점',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:200,xmax:8000,ymin:0,ymax:Math.max(0.5,(8000-S.rf)*Vm*G*1.05),xlabel:'물체 밀도 (kg/m³)',ylabel:'겉보기 무게 (N)',title:'밀도가 클수록 물속에서 더 무겁게 느껴진다',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){
      var pts=[]; for(i=200;i<=8000;i+=100) pts.push([i,buoy(i,Vm,S.rf).app]); plotLine(ctx,P,pts,COL.blue,2.4); cvLine(ctx,[[P.X(S.rf),P.y0],[P.X(S.rf),P.y1]],COL.dim,1.3,[4,4]); plotPoints(ctx,P,[[S.ro,o.app]],COL.amber,7); });
  }
});
