var LIQ=[null,{n:'물 20 °C',mu:1.0e-3,rho:998},{n:'물 50 °C',mu:0.55e-3,rho:988},{n:'설탕물 20 %',mu:1.95e-3,rho:1080},{n:'설탕물 40 %',mu:6.2e-3,rho:1176},{n:'식용유(대략)',mu:60e-3,rho:920}];
/* ───────────────────────────────────────────────────────────────────────────
   TAB 4 — 원리③ 마찰과 점성 : g h = (1 + K_m + f L/D) v²/2 · Re = ρvD/μ · 층류 f=64/Re · 난류 f=0.316 Re^-¼
   검증(손계산) : 물 20 °C · D=10 mm · L=1 m · h=50 cm → Re ≈ 1.8×10⁴ (난류) · f≈0.027 · K=1+1+2.7=4.7 → v≈2.0 m/s
   ─────────────────────────────────────────────────────────────────────────── */
var T4=mkTab(4,{ state:{D:10,L:1,h:50,ld:1}, unit:{D:' mm',L:' m',h:' cm'}, fmt:{L:function(v){ return v.toFixed(1)+' m'; },ld:function(v){ return LIQ[v].n; }},
  readout:function(S){ var q=LIQ[S.ld], r=siphon(S.h/100,S.D/1000,S.L,q.mu,1.0,q.rho);
    setTxt('t4-oQ',(r.Q*6e7).toFixed(1)+' mL/분 ('+(r.Q*1e6).toFixed(1)+' mL/s)'); setTxt('t4-oR',Math.round(r.Re)+' · '+r.reg); setTxt('t4-oF',r.f.toFixed(3)); setTxt('t4-oE',(100*r.v/r.ideal).toFixed(0)+' % (이상 대비)'); setTxt('t4-oM',(q.mu*1000).toFixed(2)+' mPa·s'); },
  anim:function(ctx,w,h,t,S){ var q=LIQ[S.ld], r=siphon(S.h/100,S.D/1000,S.L,q.mu,1.0,q.rho), cy=h*0.45, x0=30, x1=w-30, R=Math.min(34,8+S.D*1.4), i, lam=r.Re<2300;
    ctx.fillStyle='rgba(56,189,248,.14)'; ctx.fillRect(x0,cy-R,x1-x0,2*R); cvLine(ctx,[[x0,cy-R],[x1,cy-R]],COL.tick,3); cvLine(ctx,[[x0,cy+R],[x1,cy+R]],COL.tick,3);
    for(i=-5;i<=5;i++){ var yy=i/5.5, u=lam? (1-yy*yy) : (1-Math.pow(Math.abs(yy),8)), sp=Math.min(240,r.v*50)*u; var ln=Math.max(4,sp*0.35); var xs=(x0+((t*sp*0.9+(i+6)*37)%(x1-x0-ln))); cvLine(ctx,[[xs,cy+yy*R*0.95],[xs+ln,cy+yy*R*0.95]],lam?COL.blue:COL.grav,2.4); }
    var px=w*0.82; for(i=-8;i<=8;i++){ var yy2=i/8, u2=lam? (1-yy2*yy2) : (1-Math.pow(Math.abs(yy2),8)); cvArrow(ctx,px-u2*60,cy+yy2*R*0.95+h*0.2,px,cy+yy2*R*0.95+h*0.2,lam?COL.blue:COL.grav,1.3); }
    cvText(ctx,lam?'층류 — 속도 분포가 포물선(가운데가 가장 빠름)':'난류 — 속도 분포가 납작하고 소용돌이가 섞인다',12,16,lam?COL.blue:COL.grav,'bold 12.5px system-ui,sans-serif');
    cvText(ctx,q.n+' · Re = '+Math.round(r.Re)+' · v = '+r.v.toFixed(2)+' m/s · f = '+r.f.toFixed(3),12,36,COL.text,'12px system-ui,sans-serif');
    cvText(ctx,'(오른쪽 화살표 : 관 단면의 속도 분포)',px,cy+R+h*0.32,COL.dim,'10.5px system-ui,sans-serif','center'); },
  graph:function(ctx,w,h,S){ var q=LIQ[S.ld], hh=Math.floor(h*0.5), pd=[], pl=[], k;
    for(k=3;k<=20;k+=0.5) pd.push([k,siphon(S.h/100,k/1000,S.L,q.mu,1.0,q.rho).Q*6e7]);
    var dm=pd[pd.length-1][1]*1.05; subPlot(ctx,0,0,w,hh,{xmin:3,xmax:20,ymin:0,ymax:dm,ylabel:'유량 (mL/분)',title:'관 지름 대 유량 — 가는 관은 D⁴(층류), 굵은 관은 약 D²·⁵',left:60,top:24,bottom:22,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,pd,COL.ok,2.4); plotPoints(ctx,P,[[S.D,siphon(S.h/100,S.D/1000,S.L,q.mu,1.0,q.rho).Q*6e7]],COL.amber,7); });
    for(k=0.3;k<=5.01;k+=0.1) pl.push([k,siphon(S.h/100,S.D/1000,k,q.mu,1.0,q.rho).Q*6e7]);
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.3,xmax:5,ymin:0,ymax:pl[0][1]*1.05,xlabel:'관 길이 L (m)',ylabel:'유량 (mL/분)',title:'관 길이 대 유량 — 길수록 줄어든다',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,pl,COL.blue,2.4); plotPoints(ctx,P,[[S.L,siphon(S.h/100,S.D/1000,S.L,q.mu,1.0,q.rho).Q*6e7]],COL.amber,7); }); }
});
