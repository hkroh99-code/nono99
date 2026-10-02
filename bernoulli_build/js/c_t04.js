/* ───────────────────────────────────────────────────────────────────────────
   TAB 4 — 원리③ 양력과 날개 : L = ½ρv²·S·C_L(α). 교육용 CL 곡선(실속 15°), 날개 면적 S = 16 m²(경비행기급).
   검증(손계산) : v=50 m/s · 해수면 ρ=1.225 · α=5° → CL=0.7 → L=½·1.225·2500·16·0.7=17.2 kN (질량 1100 kg → W=10.8 kN)
   ─────────────────────────────────────────────────────────────────────────── */
var WSPAN=16;
var T4=mkTab(4,{ state:{v:50,al:5,alt:0,m:1100}, unit:{v:' m/s',al:'°',alt:' km',m:' kg'},
  readout:function(S){ var a=isa(S.alt), CL=clAlpha(S.al), L=liftF(a.rho,S.v,WSPAN,CL), W=S.m*G, CLmax=clAlpha(15), vs=Math.sqrt(2*W/(a.rho*WSPAN*CLmax));
    setTxt('t4-oR',a.rho.toFixed(3)+' kg/m³'); setTxt('t4-oC',CL.toFixed(2)+(S.al>15?' (실속)':'')); setTxt('t4-oL',(L/1000).toFixed(1)+' kN'); setTxt('t4-oW',(W/1000).toFixed(1)+' kN'); setTxt('t4-oS',(L/W).toFixed(2)+' · 실속 속력 '+(vs*3.6).toFixed(0)+' km/h'); },
  anim:function(ctx,w,h,t,S){
    var a=isa(S.alt), CL=clAlpha(S.al), L=liftF(a.rho,S.v,WSPAN,CL), W=S.m*G, cx=w*0.5, cy=h*0.5, ch=Math.min(w*0.5,230), stall=S.al>15, i, ang=S.al*Math.PI/180, sp=0.4+S.v/40;
    // 날개 단면(NACA 비슷) : 윗면 · 아랫면 곡선, 받음각 회전
    function pt(u,up){ var x=(u-0.5)*ch, th=0.12*ch*5*(0.2969*Math.sqrt(u)-0.126*u-0.3516*u*u+0.2843*u*u*u-0.1015*u*u*u*u)*0.5, cam=0.04*ch*Math.sin(Math.PI*u*0.95)*0.6, y=-(up? th : -th)-cam; var c=Math.cos(-ang), s=Math.sin(-ang); return [cx+x*c-y*s, cy+x*s+y*c]; }
    // 유선 : 윗면 근처는 압축(빠름), 아래는 덜
    for(i=-6;i<=6;i++){ if(i===0) continue; var off=i*h*0.045, pts=[], u; for(u=0;u<=40;u++){ var x=-w*0.48+u*(w*0.96/40), dist=Math.abs(x-0), bump=Math.exp(-dist*dist/(ch*ch*0.12)), sgn=(i<0?-1:1), y=cy+off*(1-(i<0?0.45:-0.05)*bump)+(i<0?-bump*h*0.06:bump*h*0.012)*Math.sign(1); pts.push([cx+x,y]); } if(stall&&i<0) pts=pts.map(function(p,j){ return j>28? [p[0],p[1]+Math.sin(t*6+j)*4*(j-28)/10] : p; }); cvLine(ctx,pts,i<0?COL.blue:'#38bdf8',1.2); }
    // 날개
    var up=[], dn=[]; for(i=0;i<=24;i++){ up.push(pt(i/24,true)); dn.push(pt(i/24,false)); }
    ctx.beginPath(); up.forEach(function(p,j){ if(j) ctx.lineTo(p[0],p[1]); else ctx.moveTo(p[0],p[1]); }); for(i=dn.length-1;i>=0;i--) ctx.lineTo(dn[i][0],dn[i][1]); ctx.closePath(); ctx.fillStyle='rgba(148,163,184,.6)'; ctx.fill(); ctx.strokeStyle=COL.white; ctx.stroke();
    // 흐르는 입자
    for(i=0;i<40;i++){ var yy=cy+((i*13)%11-5)*h*0.045*1.1, xx=(-w*0.5+((i*53+t*sp*60)%(w))); cvCirc(ctx,cx+xx+w*0.5-w*0.5,yy,1.8,'rgba(125,211,252,.8)',null); }
    // 힘 화살표
    var Lp=Math.min(h*0.38,L/W*h*0.16), Wp=h*0.16; cvArrow(ctx,cx,cy,cx,cy-Lp,COL.grav,3); cvText(ctx,'양력 L '+(L/1000).toFixed(1)+' kN',cx+10,cy-Lp,COL.grav,'bold 12px system-ui,sans-serif'); cvArrow(ctx,cx,cy,cx,cy+Wp,COL.purple||'#a78bfa',3); cvText(ctx,'무게 W '+(W/1000).toFixed(1)+' kN',cx+10,cy+Wp,'#a78bfa','bold 12px system-ui,sans-serif');
    cvText(ctx,'α = '+S.al+'° · v = '+S.v+' m/s · '+(stall?'⚠ 실속 — 흐름이 날개 윗면에서 떨어진다':(L>=W?'상승 가능 (L ≥ W)':'아직 이륙 못 함 (L < W)')),12,16,stall?COL.grav:(L>=W?COL.ok:COL.amber),'bold 12px system-ui,sans-serif');
  },
  graph:function(ctx,w,h,S){ var a=isa(S.alt), W=S.m*G, hh=Math.floor(h*0.5), pc=[], pl=[], k;
    for(k=-4;k<=22;k+=0.5) pc.push([k,clAlpha(k)]);
    subPlot(ctx,0,0,w,hh,{xmin:-4,xmax:22,ymin:-0.4,ymax:2.0,xlabel:'',ylabel:'양력 계수 C_L',title:'받음각 α 대 C_L — 15° 부근에서 실속',left:60,top:24,bottom:22,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}, function(P){ plotLine(ctx,P,pc,COL.blue,2.4); plotPoints(ctx,P,[[S.al,clAlpha(S.al)]],COL.amber,7); });
    for(k=0;k<=120;k+=2) pl.push([k,liftF(a.rho,k,WSPAN,clAlpha(S.al))/1000]);
    subPlot(ctx,0,hh,w,h-hh,{xmin:0,xmax:120,ymin:0,ymax:Math.max(W/1000*2.2,liftF(a.rho,120,WSPAN,clAlpha(S.al))/1000*1.05,1),xlabel:'속력 v (m/s)',ylabel:'양력 L (kN)',title:'속력 대 양력 — v² 로 늘어난다(무게선과 만나는 속력 = 이륙 속력)',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ plotLine(ctx,P,pl,COL.ok,2.4); plotLine(ctx,P,[[0,W/1000],[120,W/1000]],COL.grav,1.6,[6,4]); plotPoints(ctx,P,[[S.v,liftF(a.rho,S.v,WSPAN,clAlpha(S.al))/1000]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['양력 L',COL.ok],['무게 W',COL.grav],['지금',COL.amber]]); });
  }
});
