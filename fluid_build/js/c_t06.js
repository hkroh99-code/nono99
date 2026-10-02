/* ───────────────────────────────────────────────────────────────────────────
   TAB 6 — 원리⑤ 측정 · 오차 · 안전 : 부력으로 물체 밀도 재기  ρ = ρ_물 · m / (m − m')  (m : 공기 중, m' : 물속 저울 값)
   물체 부피 50 cm³ 고정. 저울 읽기 오차 σ(g) 가 두 값 모두에 독립으로 들어간다. 물의 밀도는 온도 T 에 따라 변한다.
   검증(손계산) : ρ물체=7.8 g/cm³(V=50) → m=390 g · m'=340 g · σ=0.5 g → δρ/ρ ≈ √[(m'σ)²+(mσ)²]/(m(m−m')) = 0.5·√(340²+390²)/(390·50)=0.0135 (1.4 %)
   ─────────────────────────────────────────────────────────────────────────── */
function dens(rho,T,V){ var rw=rhoWater(T)/1000, m=rho*V, m2=m-rw*V; return {m:m,m2:m2,rw:rw}; }
function relErr(rho,T,sig,V){ var d=dens(rho,T,V), den=d.m-d.m2; if(den<=1e-6) return 9.99; return sig*Math.sqrt(d.m2*d.m2+d.m*d.m)/(d.m*den); }
var T6=mkTab(6,{ state:{rho:7.8,V:50,sig:0.5,T:20}, unit:{rho:' g/cm³',V:' cm³',sig:' g',T:' ℃'},
  readout:function(S){ var re=relErr(S.rho,S.T,S.sig,S.V), bias=(1000/rhoWater(S.T)-1)*100; setTxt('t6-oR',S.rho.toFixed(2)+' g/cm³'); setTxt('t6-oE',(re*100).toFixed(1)+' %'); setTxt('t6-oS',(S.rho*(re)).toFixed(2)+' g/cm³'); setTxt('t6-oB',(bias>=0?'+':'')+bias.toFixed(2)+' %'); setTxt('t6-oJ',re>0.05?'오차 큼 — 저울을 정밀하게 · 부피를 키워서':'양호'); },
  anim:function(ctx,w,h,t,S){
    var N=40, r=rng32(8), i, d=dens(S.rho,S.T,S.V), pts=[], top=44, bot=h-40, cx0=50, cw=w-90, rho=S.rho, rw=d.rw;
    cvText(ctx,'같은 물체를 40 번 재어 얻은 밀도 추정값 (참 '+rho.toFixed(2)+' g/cm³ · 물의 밀도 '+(rw*1000).toFixed(1)+' kg/m³)',12,18,COL.text,'bold 12px system-ui,sans-serif');
    for(i=0;i<N;i++){ var m=d.m+S.sig*gaussR(r), m2=d.m2+S.sig*gaussR(r), est=(m-m2)>0.01? 1*m/(m-m2) : 99; pts.push(est); }
    var lo=Math.max(0,rho-Math.max(1.2,rho*0.25)), hi=rho+Math.max(1.2,rho*0.25), shown=Math.min(N,Math.floor(t/10*N*1.6)+1), gx=function(v){ return cx0+(Math.min(hi,Math.max(lo,v))-lo)/(hi-lo)*cw; };
    ctx.strokeStyle=COL.axis2; ctx.beginPath(); ctx.moveTo(cx0,bot); ctx.lineTo(cx0+cw,bot); ctx.stroke();
    for(i=0;i<=4;i++){ var vv=lo+(hi-lo)*i/4; cvText(ctx,vv.toFixed(1),gx(vv),bot+14,COL.tick,'10.5px system-ui,sans-serif','center'); }
    cvLine(ctx,[[gx(rho),top],[gx(rho),bot]],COL.ok,2,[5,4]); cvLine(ctx,[[gx(rw*rho/(rw)*1),top],[gx(rho),top]],COL.ok,0.1);
    var rows=Math.ceil(N/10); for(i=0;i<shown;i++){ var colr=Math.floor(i/1), px=gx(pts[i]); var lvl=0, cnt=0, j; for(j=0;j<i;j++) if(Math.abs(gx(pts[j])-px)<7) cnt++; var py=bot-9-cnt*9; ctx.fillStyle=COL.blue; ctx.beginPath(); ctx.arc(px,py,3.5,0,6.283); ctx.fill(); }
    var est=pts.slice(0,shown), me=mean(est); cvLine(ctx,[[gx(me),top+10],[gx(me),bot]],COL.amber,2); cvText(ctx,'평균 '+me.toFixed(2),gx(me)+6,top+14,COL.amber,'bold 11.5px system-ui,sans-serif');
    cvText(ctx,'표준편차 '+stdev(est).toFixed(2)+' g/cm³ ('+(stdev(est)/Math.max(me,1e-6)*100).toFixed(1)+' %)',12,h-8,COL.tick,'11.5px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.55), i;
    subPlot(ctx,0,0,w,hh,{xmin:5,xmax:200,ymin:0,ymax:0.3,ylabel:'상대 오차 δρ/ρ',title:'물체 부피 → 상대 불확도 (작을수록 오차 큼)',left:56,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return (v*100).toFixed(0)+'%'; }}, function(P){
      [[0.1,COL.ok],[0.5,COL.amber],[2,COL.grav]].forEach(function(q){ var pts=[]; for(i=5;i<=200;i+=3) pts.push([i,Math.min(0.3,relErr(S.rho,S.T,q[0],i))]); plotLine(ctx,P,pts,q[1],1.4,[4,3]); });
      var pts2=[]; for(i=5;i<=200;i+=3) pts2.push([i,Math.min(0.3,relErr(S.rho,S.T,S.sig,i))]); plotLine(ctx,P,pts2,COL.blue,2.6); plotPoints(ctx,P,[[S.V,Math.min(0.3,relErr(S.rho,S.T,S.sig,S.V))]],COL.amber,7); legend(ctx,P.x1-130,P.y1+14,[['σ 0.1 g',COL.ok],['σ 0.5 g',COL.amber],['σ 2 g',COL.grav],['지금 σ',COL.blue]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:100,ymin:955,ymax:1002,xlabel:'온도 T (℃)  ·  위 그래프 가로축 = 부피 5 ~ 200 cm³',ylabel:'물의 밀도 (kg/m³)',title:'온도에 따라 달라지는 물의 밀도',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){
      var pts=[]; for(i=0;i<=100;i+=2) pts.push([i,rhoWater(i)]); plotLine(ctx,P,pts,COL.blue,2.2); plotPoints(ctx,P,[[S.T,rhoWater(S.T)]],COL.amber,7); });
  }
});
