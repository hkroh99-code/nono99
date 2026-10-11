/* ───────────────────────────────────────────────────────────────────────────
   TAB 7 — 활용 현황 : 일상 · 산업의 속력과 동압 q=½ρv². 공개 대표 속력(어림). 각 항목 ρ 는 그 항목의 대표 고도의 공기 밀도.
   검증(손계산) : KTX 83 m/s(≈300 km/h) · ρ 1.2 → q=4.1 kPa(1 m² 당 약 420 kgf) · 순항 여객기 250 m/s · ρ 0.364 → q=11.4 kPa
   ─────────────────────────────────────────────────────────────────────────── */
var VEH=[ {n:'달리는 사람', v:10, rho:1.2, a:343}, {n:'경주용 자전거', v:15, rho:1.2, a:343}, {n:'고속도로 자동차', v:30, rho:1.2, a:343}, {n:'강한 태풍(풍속)', v:50, rho:1.2, a:343},
  {n:'KTX · 신칸센', v:83, rho:1.2, a:343}, {n:'여객기 이륙', v:80, rho:1.2, a:343}, {n:'여객기 순항(고도 11 km)', v:250, rho:0.364, a:295}, {n:'풍력 터빈 날개 끝', v:80, rho:1.2, a:343} ];
var T7=mkTab(7,{ state:{k:5,rho:120}, fmt:{k:function(v){ return VEH[v-1].n; },rho:function(v){ return (v/100).toFixed(2)+' kg/m³'; }},
  readout:function(S){ var q=VEH[S.k-1], r=S.rho/100, dp=dynP(r,q.v); setTxt('t7-oV',q.v+' m/s ('+(q.v*3.6).toFixed(0)+' km/h)'); setTxt('t7-oQ',dp>=1000? (dp/1000).toFixed(2)+' kPa':dp.toFixed(0)+' Pa'); setTxt('t7-oF',(dp/G).toFixed(0)+' kgf'); setTxt('t7-oM',(q.v/q.a).toFixed(2)); setTxt('t7-oN',(q.v/q.a>0.3)? '압축성 보정 필요(마하 > 0.3)' : '비압축성 근사 가능'); },
  anim:function(ctx,w,h,t,S){ var mx=0, x0=190, rh=(h-46)/VEH.length, fr=Math.min(1,t/2); VEH.forEach(function(q){ mx=Math.max(mx,dynP(q.rho,q.v)); });
    cvText(ctx,'동압 q = ½ρv² (각 항목의 대표 고도 밀도)',12,18,COL.text,'bold 12.5px system-ui,sans-serif');
    VEH.forEach(function(q,i){ var y=34+i*rh, sel=(i===S.k-1), dp=dynP(q.rho,q.v), bw=(w-x0-110)*dp/mx*fr;
      cvText(ctx,q.n,x0-8,y+rh*0.5,sel?COL.amber:COL.tick,(sel?'bold ':'')+'12px system-ui,sans-serif','right'); ctx.fillStyle=sel?COL.amber:COL.blue; ctx.globalAlpha=sel?1:0.6; ctx.fillRect(x0,y+4,Math.max(2,bw),rh-10); ctx.globalAlpha=1;
      cvText(ctx,(dp>=1000?(dp/1000).toFixed(1)+' kPa':dp.toFixed(0)+' Pa')+' · '+q.v+' m/s',x0+Math.max(2,bw)+6,y+rh*0.5,sel?COL.amber:COL.tick,'11px system-ui,sans-serif'); }); },
  graph:function(ctx,w,h,S){ var q=VEH[S.k-1], r=S.rho/100, pts=[], k, hh=Math.floor(h*0.55);
    for(k=0;k<=260;k+=4) pts.push([k,dynP(r,k)/1000]);
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:260,ymin:0,ymax:dynP(r,260)/1000*1.05,ylabel:'동압 q (kPa)',title:'속력 대 동압 — 포물선(공기 밀도 '+r.toFixed(2)+')',left:60,top:24,bottom:22,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,pts,COL.blue,2.4); plotPoints(ctx,P,VEH.map(function(e){ return [e.v,dynP(r,e.v)/1000]; }),COL.dim,3); plotPoints(ctx,P,[[q.v,dynP(r,q.v)/1000]],COL.amber,7); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.5,xmax:8.5,ymin:0,ymax:1.1,xlabel:'항목 번호(1 ~ 8)',ylabel:'q / q_최대',title:'항목별 상대 동압',left:60,top:24,bottom:40,xfmt:function(v){ return Math.abs(v-Math.round(v))<0.01? v.toFixed(0):''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ var mx=0; VEH.forEach(function(e){ mx=Math.max(mx,dynP(e.rho,e.v)); }); VEH.forEach(function(e,i){ var v=dynP(e.rho,e.v)/mx; ctx.fillStyle=(i===S.k-1)?COL.amber:COL.blue; ctx.fillRect(P.X(i+1-0.32),P.Y(v),P.X(i+1+0.32)-P.X(i+1-0.32),P.y0-P.Y(v)); }); });
  }
});
