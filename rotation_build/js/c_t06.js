/* ───────────────────────────────────────────────────────────────────────────
   TAB 6 — 원리⑤ 회전 에너지 · 구르기 · 측정 · 안전. a = g sinθ/(1+k) · v² = 2gh/(1+k) · 회전 몫 = k/(1+k)
   검증(손계산) : 원판(k=0.5) θ=15° L=2 m → a=9.8·0.2588/1.5=1.69 m/s² · v=√(2·1.69·2)=2.60 m/s · t=√(2·2/1.69)=1.54 s · 회전 몫 33 %
   ─────────────────────────────────────────────────────────────────────────── */
var SH6=[null,{n:'속 빈 고리',k:1,c:'#fb7185'},{n:'속이 찬 원판(원통)',k:0.5,c:'#fbbf24'},{n:'속이 찬 구',k:0.4,c:'#34d399'},{n:'속 빈 구',k:2/3,c:'#38bdf8'},{n:'미끄러지는 상자(마찰 0)',k:0,c:'#a78bfa'}];
function i6(S,k){ var a=rollA(k,S.th), v=Math.sqrt(2*a*S.L), t=Math.sqrt(2*S.L/a); return {a:a,v:v,t:t,rot:k/(1+k)}; }
var T6=mkTab(6,{ state:{sh:2,th:15,L:2,m:1}, fmt:{sh:function(v){ return SH6[v].n; }}, unit:{th:'°',L:' m',m:' kg'},
  readout:function(S){ var o=i6(S,SH6[S.sh].k), sl=i6(S,0); setTxt('t6-oA',o.a.toFixed(2)+' m/s²'); setTxt('t6-oV',o.v.toFixed(2)+' m/s'); setTxt('t6-oT',o.t.toFixed(2)+' s ('+(o.t/sl.t).toFixed(2)+' 배, 미끄러짐 대비)'); setTxt('t6-oR',(o.rot*100).toFixed(0)+' % (회전 몫)'); setTxt('t6-oK',(0.5*S.m*o.v*o.v).toFixed(2)+' J + '+(0.5*S.m*o.v*o.v*SH6[S.sh].k).toFixed(2)+' J'); },
  anim:function(ctx,w,h,t,S){ var th=S.th*PI/180, x0=40, x1=w*0.7, len=x1-x0, Hp=Math.min(h*0.55,len*Math.tan(th)), y1=h*0.8, y0=y1-Hp, sc=len/S.L, tt=(t%6)/6*1.4*i6(S,0).t*1.0;
    ctx.fillStyle='rgba(148,163,184,.14)'; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.lineTo(x0,y1); ctx.closePath(); ctx.fill(); cvLine(ctx,[[x0,y0],[x1,y1]],COL.axis2,2.4);
    var ids=[S.sh,5,1,3].filter(function(v,i,a){ return a.indexOf(v)===i; }).slice(0,4), R=12;
    ids.forEach(function(id,i){ var o=i6(S,SH6[id].k), s=Math.min(S.L,0.5*o.a*tt*tt), fx=s/S.L, px=x0+fx*len, py=y0+fx*(y1-y0)-R-4-i*0; var off=(i-1)*0; cvCirc(ctx,px+ (-i*0)-R*Math.sin(th),py-R*Math.cos(th)+2-0,R,SH6[id].c,COL.white,1.2);
      if(id!==5){ var an=s/(R/ sc*100)*0; var rot=s*sc/R; cvLine(ctx,[[px-R*Math.sin(th),py-R*Math.cos(th)+2],[px-R*Math.sin(th)+R*Math.cos(rot),py-R*Math.cos(th)+2+R*Math.sin(rot)]],'#0b1424',2); }
      cvText(ctx,SH6[id].n,w*0.74,24+i*18,SH6[id].c,'11px system-ui,sans-serif'); });
    cvText(ctx,'θ = '+S.th+'° · 경사 길이 '+S.L+' m',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'선택 모양: a = '+i6(S,SH6[S.sh].k).a.toFixed(2)+' m/s² · 질량이 달라도 같은 모양이면 같은 시간',12,h-10,COL.tick,'11px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.52), T=i6(S,0).t*1.5;
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:T,ymin:0,ymax:S.L*1.05,ylabel:'내려온 거리 s (m)',title:'시간 대 이동 거리 — 모양이 다르면 늦는다',left:60,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(1); }}, function(P){ var leg=[]; [1,2,3,4,5].forEach(function(id){ var a=i6(S,SH6[id].k).a, pts=[], k; for(k=0;k<=T;k+=T/40){ pts.push([k,Math.min(S.L,0.5*a*k*k)]); } plotLine(ctx,P,pts,SH6[id].c,id===S.sh?3:1.4); leg.push([SH6[id].n,SH6[id].c]); }); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.5,xmax:5.5,ymin:0,ymax:55,xlabel:'1 고리 · 2 원판 · 3 구 · 4 속 빈 구 · 5 미끄러짐',ylabel:'회전 몫 (%)',title:'에너지 중 회전으로 가는 몫 k/(1+k)',left:60,top:24,bottom:40,xfmt:function(v){ return Math.abs(v-Math.round(v))<0.01? v.toFixed(0):''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [1,2,3,4,5].forEach(function(id){ var v=SH6[id].k/(1+SH6[id].k)*100; ctx.fillStyle=SH6[id].c; ctx.globalAlpha=(id===S.sh)?1:0.55; ctx.fillRect(P.X(id-0.3),P.Y(v),P.X(id+0.3)-P.X(id-0.3),P.y0-P.Y(v)); ctx.globalAlpha=1; }); }); }
});
