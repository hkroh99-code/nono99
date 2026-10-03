/* ───────────────────────────────────────────────────────────────────────────
   TAB 4 — 원리③ 관성 모멘트와 τ = Iα. 모양 1 고리 · 2 원판 · 3 구 · 4 속 빈 구 · 5 막대(끝 축)
   검증(손계산) : 원판 m=2 kg · R=0.2 m → I=½·2·0.04=0.04 kg·m² · τ=0.4 N·m → α=10 rad/s² · 고리는 I=0.08 → α=5
   ─────────────────────────────────────────────────────────────────────────── */
var SH4=[null,{n:'속 빈 고리',k:1},{n:'속이 찬 원판',k:0.5},{n:'속이 찬 구',k:0.4},{n:'속 빈 구',k:2/3},{n:'막대(끝 축, L=2R)',k:4/3}];
function i4(S){ var o=SH4[S.sh], m=S.m, R=S.R/100, I=o.k*m*R*R; return {I:I,al:S.tau/I,k:o.k}; }
var T4=mkTab(4,{ state:{sh:2,tau:0.4,m:2,R:20}, fmt:{sh:function(v){ return SH4[v].n; }}, unit:{tau:' N·m',m:' kg',R:' cm'},
  readout:function(S){ var o=i4(S); setTxt('t4-oK',o.k.toFixed(2)); setTxt('t4-oI',o.I.toFixed(4)+' kg·m²'); setTxt('t4-oA',o.al.toFixed(2)+' rad/s²'); setTxt('t4-oT',(10/o.al).toFixed(2)+' s'); setTxt('t4-oR',(o.I/ (0.5*S.m*(S.R/100)*(S.R/100))).toFixed(2)+' 배'); },
  anim:function(ctx,w,h,t,S){ var o=i4(S), cx=w*0.32, cy=h*0.5, R=Math.min(h*0.34,70+S.R*0.9), tt=(t%6), om=Math.min(o.al*tt,60), th=0.5*o.al*tt*tt*0.3, sh=S.sh; ctx.save(); ctx.translate(cx,cy); ctx.rotate(th);
    if(sh===1){ ctx.strokeStyle='rgba(203,213,225,.9)'; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(0,0,R,0,TAU); ctx.stroke(); for(var k=0;k<6;k++){ ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(R*Math.cos(k*TAU/6),R*Math.sin(k*TAU/6)); ctx.stroke(); } }
    else if(sh===2||sh===3||sh===4){ ctx.fillStyle=sh===4?'rgba(148,163,184,.25)':'rgba(148,163,184,.65)'; ctx.beginPath(); ctx.arc(0,0,R,0,TAU); ctx.fill(); ctx.strokeStyle=COL.white; ctx.lineWidth=sh===4?5:1.5; ctx.stroke(); ctx.fillStyle=COL.amber; ctx.fillRect(R*0.5,-3,R*0.45,6); }
    else { ctx.strokeStyle='rgba(203,213,225,.95)'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(2*R*0.9,0); ctx.stroke(); }
    ctx.restore(); cvCirc(ctx,cx,cy,5,COL.amber,COL.white,1.2); cvArrow(ctx,cx+R+16,cy+10,cx+R+16,cy-24,COL.grav,2.6); cvText(ctx,'τ = '+S.tau+' N·m',cx+R+22,cy-30,COL.grav,'bold 12px system-ui,sans-serif');
    var bx=w*0.62, bw=w*0.34; cvText(ctx,'관성 모멘트 I',bx,h*0.24,COL.tick,'11px system-ui,sans-serif'); var Imax=SH4[1].k*S.m*Math.pow(S.R/100,2)*1.4; cvRect(ctx,bx,h*0.24+8,bw,16,'rgba(148,163,184,.2)',null); cvRect(ctx,bx,h*0.24+8,bw*Math.min(1,o.I/Imax),16,COL.blue,null); cvText(ctx,o.I.toFixed(3)+' kg·m²',bx,h*0.24+40,COL.text,'11.5px system-ui,sans-serif');
    cvText(ctx,'각가속도 α',bx,h*0.52,COL.tick,'11px system-ui,sans-serif'); cvRect(ctx,bx,h*0.52+8,bw,16,'rgba(148,163,184,.2)',null); cvRect(ctx,bx,h*0.52+8,bw*Math.min(1,o.al/40),16,COL.ok,null); cvText(ctx,o.al.toFixed(2)+' rad/s²',bx,h*0.52+40,COL.text,'11.5px system-ui,sans-serif');
    cvText(ctx,SH4[sh].n+' · k = I/mR² = '+o.k.toFixed(2)+' · ω = '+om.toFixed(1)+' rad/s',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,S){ var hh=Math.floor(h*0.5), o=i4(S), k, curves=[];
    subPlot(ctx,0,0,w,hh,{xmin:0,xmax:5,ymin:0,ymax:Math.max(5,5/o.I*1.05),ylabel:'α (rad/s²)',title:'토크 대 각가속도 — 기울기 = 1/I',left:60,top:24,bottom:22,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [1,2,3].forEach(function(i){ var Ii=SH4[i].k*S.m*Math.pow(S.R/100,2); plotLine(ctx,P,[[0,0],[5,5/Ii]],i===S.sh?COL.ok:COL.dim,i===S.sh?2.6:1.2,i===S.sh?null:[4,3]); }); plotLine(ctx,P,[[0,0],[5,5/o.I]],COL.ok,2.6); plotPoints(ctx,P,[[S.tau,o.al]],COL.amber,7); legend(ctx,P.x0+10,P.y1+14,[['지금 모양',COL.ok],['고리 · 원판 · 구(점선)',COL.dim],['지금',COL.amber]]); });
    var pr=[]; for(k=5;k<=30;k+=1) pr.push([k,SH4[S.sh].k*S.m*Math.pow(k/100,2)]);
    subPlot(ctx,0,hh,w,h-hh,{xmin:5,xmax:30,ymin:0,ymax:SH4[S.sh].k*S.m*0.09*1.1,xlabel:'반지름 R (cm)',ylabel:'I (kg·m²)',title:'반지름 대 관성 모멘트 — R² 에 비례(2 배면 4 배)',left:60,top:24,bottom:40,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(3); }}, function(P){ plotLine(ctx,P,pr,COL.blue,2.4); plotPoints(ctx,P,[[S.R,o.I]],COL.amber,7); }); }
});
