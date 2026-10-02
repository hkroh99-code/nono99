/* ───────────────────────────────────────────────────────────────────────────
   TAB 2 — 원리① 유체의 압력과 깊이 : p = p₀ + ρgh, 모든 방향 · 용기 모양과 무관(파스칼의 역설)
   검증(손계산) : 물 ρ=1000 · h=10 m → ρgh=98 kPa(0.97 기압) · 절대 1.97 기압 · 바닥 1 m² 의 힘 98 kN
   ─────────────────────────────────────────────────────────────────────────── */
var SHAPES=['곧은 통','위로 넓어지는 통','위로 좁아지는 통','가운데 불룩한 통'], SH_F=[1,1.8,0.45,1.3];
var T2=mkTab(2,{ state:{h:10,rho:1000,sh:1}, unit:{h:' m',rho:' kg/m³'}, fmt:{sh:function(v){ return SHAPES[v-1]; }},
  readout:function(S){ var pg=S.rho*G*S.h; setTxt('t2-oG',(pg/1000).toFixed(1)+' kPa'); setTxt('t2-oA',(toAtm(P0+pg)).toFixed(2)+' 기압'); setTxt('t2-oF',(pg*1/1000).toFixed(0)+' kN'); setTxt('t2-oW',(S.rho*G*S.h*SH_F[S.sh-1]/1000).toFixed(0)+' kN'); setTxt('t2-oR',(SH_F[S.sh-1]).toFixed(2)+' 배'); },
  anim:function(ctx,w,h,t,S){
    var top=36, bot=h-34, cx=w*0.36, W0=Math.min(150,w*0.3), hmax=40, hh=(bot-top-20)*Math.min(1,Math.sqrt(S.h/hmax))+20, y0=bot-hh, k=SH_F[S.sh-1];
    function wid(y){ var u=(bot-y)/hh; // 아래(0) → 위(1)
      return W0*(S.sh===1?1:S.sh===2?(0.8+1.0*u):S.sh===3?(1.25-0.9*u):(0.9+0.55*Math.sin(Math.PI*u))); }
    ctx.beginPath(); ctx.moveTo(cx-wid(bot)/2,bot); var u,y; for(u=0;u<=1.001;u+=0.05){ y=bot-u*hh; ctx.lineTo(cx-wid(y)/2,y); } for(u=1;u>=-0.001;u-=0.05){ y=bot-u*hh; ctx.lineTo(cx+wid(y)/2,y); } ctx.closePath();
    var gr=ctx.createLinearGradient(0,y0,0,bot); gr.addColorStop(0,'rgba(56,189,248,.22)'); gr.addColorStop(1,'rgba(30,64,175,.6)'); ctx.fillStyle=gr; ctx.fill(); ctx.strokeStyle=COL.axis2; ctx.lineWidth=2.2; ctx.stroke(); ctx.lineWidth=1;
    cvText(ctx,'수면 (p₀ = 1기압)',cx+wid(y0)/2+8,y0+4,COL.tick,'11px system-ui,sans-serif');
    /* 깊이 눈금과 압력 화살표(모든 방향) */
    var n=4, i, d, pg, len;
    for(i=1;i<=n;i++){ d=i/n; y=y0+d*hh*0.92; pg=S.rho*G*S.h*d*0.92; len=Math.max(6,Math.min(46,pg/(S.rho*G*hmax)*46*(hmax/Math.max(S.h,1))*0.35+8));
      var xc=cx; ctx.fillStyle=COL.amber; ctx.beginPath(); ctx.arc(xc,y,3,0,6.283); ctx.fill();
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(function(dv){ cvArrow(ctx,xc-dv[0]*len,y-dv[1]*len,xc-dv[0]*4,y-dv[1]*4,'rgba(251,191,36,.85)',1.6); });
      cvText(ctx,(pg/1000).toFixed(0)+' kPa',xc+len+8,y+4,COL.amber,'10.5px system-ui,sans-serif'); }
    cvText(ctx,'h = '+S.h+' m',cx-wid(bot)/2-10,(y0+bot)/2,COL.ok,'bold 11.5px system-ui,sans-serif','right'); cvLine(ctx,[[cx-wid(bot)/2-6,y0],[cx-wid(bot)/2-6,bot]],COL.ok,1.4);
    /* 오른쪽 : 힘 비교 막대 */
    var bx=w*0.68, bw=Math.min(54,(w-bx-40)/2), bh=bot-top-30, mx=Math.max(S.rho*G*S.h*1.8,1), fb=S.rho*G*S.h, wt=fb*k;
    [[fb,COL.ok,'바닥이 받는 힘'],[wt,COL.blue,'액체의 무게']].forEach(function(q,m){ var hh2=bh*q[0]/mx, x=bx+m*(bw+16); ctx.fillStyle=q[1]; ctx.fillRect(x,top+bh-hh2+16,bw,hh2); ctx.strokeStyle=COL.axis2; ctx.strokeRect(x,top+16,bw,bh); cvText(ctx,(q[0]/1000).toFixed(0)+' kN',x+bw/2,top+bh-hh2+10,COL.text,'bold 11px system-ui,sans-serif','center'); cvText(ctx,q[2],x+bw/2,top+bh+30,COL.tick,'10.5px system-ui,sans-serif','center'); });
    cvText(ctx,'용기 : '+SHAPES[S.sh-1]+' · 바닥 면적 1 m² · ρ = '+S.rho+' kg/m³',12,18,COL.text,'bold 12px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.55), i;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:40,ymin:0,ymax:Math.max(450,S.rho*G*40/1000*1.05),ylabel:'게이지 압력 (kPa)',title:'깊이 → 압력 (직선, 기울기 = ρg)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      [[1000,COL.ok,'물'],[1025,COL.blue,'해수'],[S.rho,COL.amber,'지금']].forEach(function(q,k){ plotLine(ctx,P,[[0,0],[40,q[0]*G*40/1000]],q[1],k===2?2.6:1.4,k===2?null:[4,3]); }); plotPoints(ctx,P,[[S.h,S.rho*G*S.h/1000]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['물 1000',COL.ok],['해수 1025',COL.blue],['지금 ρ',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.5,xmax:4.5,ymin:0,ymax:2.4,xlabel:'용기 모양 (1 곧음 · 2 위로 넓음 · 3 위로 좁음 · 4 불룩)',ylabel:'바닥 힘 · 무게 (상대)',title:'같은 수심이면 바닥 힘은 같다 (무게는 모양마다 다름)',left:56,top:24,bottom:40,xfmt:function(v){ return Math.abs(v-Math.round(v))<0.01? v.toFixed(0):''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){
      for(i=1;i<=4;i++){ var x0=P.X(i-0.3), x1=P.X(i), x2=P.X(i+0.3); ctx.fillStyle=COL.ok; ctx.fillRect(x0,P.Y(1),x1-x0-2,P.y0-P.Y(1)); ctx.fillStyle=(i===S.sh)?COL.amber:COL.blue; ctx.fillRect(x1,P.Y(SH_F[i-1]),x2-x1-2,P.y0-P.Y(SH_F[i-1])); }
      legend(ctx,P.x1-150,P.y1+14,[['바닥 힘(=1)',COL.ok],['액체 무게',COL.blue]]); });
  }
});
