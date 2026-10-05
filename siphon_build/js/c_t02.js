/* ───────────────────────────────────────────────────────────────────────────
   TAB 2 — 원리① 높이차와 유속 : v = √(2gh/K) , K = 1 + K_m + f L/D (L = 1 m 고정)
   검증(손계산) : h=50 cm → 이상 v=√(2·9.8·0.5)=3.13 m/s · D=10 mm · K_m=1 → 실제 v 는 마찰 때문에 작다 · Q=A v
   ─────────────────────────────────────────────────────────────────────────── */
var T2=mkTab(2,{ state:{h:50,K:1,D:10}, unit:{h:' cm',K:'',D:' mm'}, fmt:{K:function(v){ return v.toFixed(1); }},
  readout:function(S){ var r=siphon(S.h/100,S.D/1000,1,1e-3,S.K);
    setTxt('t2-oI',r.ideal.toFixed(2)+' m/s'); setTxt('t2-oV',r.v.toFixed(2)+' m/s'); setTxt('t2-oQ',(r.Q*1000).toFixed(3)+' L/s ('+(r.Q*6e4).toFixed(1)+' L/분)'); setTxt('t2-oR',Math.round(r.Re)+' · '+r.reg); setTxt('t2-oT',(1e-3/r.Q).toFixed(1)+' s (1 L)'); },
  anim:function(ctx,w,h,t,S){ var r=siphon(S.h/100,S.D/1000,1,1e-3,S.K);
    siphonDraw(ctx,0,10,w,h-24,{hU:S.h,Hc:25,hL:null,v:r.v,on:true,tankH:35},t);
    cvText(ctx,'v = √(2gh/K) = '+r.v.toFixed(2)+' m/s  (이상 √(2gh) = '+r.ideal.toFixed(2)+' m/s · K = '+r.K.toFixed(2)+')',12,16,COL.text,'bold 12px system-ui,sans-serif');
    var bw=w*0.3, bx=w*0.66, by=h*0.14; cvRect(ctx,bx,by,bw,12,'rgba(148,163,184,.2)',null); cvRect(ctx,bx,by,bw*Math.min(1,r.v/Math.max(r.ideal,0.001)),12,COL.ok,null); cvText(ctx,'실제 / 이상 = '+(100*r.v/Math.max(r.ideal,1e-6)).toFixed(0)+' %',bx,by+26,COL.tick,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.5), pv=[], pi=[], k, pq=[], pqi=[];
    for(k=5;k<=100;k+=5){ var q=siphon(k/100,S.D/1000,1,1e-3,S.K); pv.push([k,q.v]); pi.push([k,q.ideal]); }
    subPlot(ctx,0,0,w,hh,{xmin:5,xmax:100,ymin:0,ymax:Math.sqrt(2*G*1.0)*1.05,ylabel:'유속 v (m/s)',title:'높이차 대 유속 — 이상(흰 점선) 대 실제(초록): √h 곡선',left:60,top:24,bottom:22,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,pi,COL.white,1.4,[5,4]); plotLine(ctx,P,pv,COL.ok,2.4); plotPoints(ctx,P,[[S.h,siphon(S.h/100,S.D/1000,1,1e-3,S.K).v]],COL.amber,7); });
    for(k=4;k<=30;k+=1){ var q2=siphon(S.h/100,k/1000,1,1e-3,S.K); pq.push([k,q2.Q*1000]); pqi.push([k,q2.ideal*PI*k*k/4e6*1000]); }
    subPlot(ctx,0,hh,w,h-hh,{xmin:4,xmax:30,ymin:0,ymax:Math.max(0.05,pqi[pqi.length-1][1]*1.05),xlabel:'관 지름 D (mm)',ylabel:'유량 Q (L/s)',title:'관 지름 대 유량 — 거의 D² 에 비례(마찰이 커지면 덜 늘어남)',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(2); }}, function(P){ plotLine(ctx,P,pqi,COL.white,1.4,[5,4]); plotLine(ctx,P,pq,COL.blue,2.4); plotPoints(ctx,P,[[S.D,siphon(S.h/100,S.D/1000,1,1e-3,S.K).Q*1000]],COL.amber,7); }); }
});
