/* ═══════════════════════════════════════════════════════════════════════════
   창의 프로젝트 C01 ~ C05 : 나의 X선 사진 그리기 · 사이노그램 아트 · 거리를 소리로 · MRI 자기장 안전 · 검사 선택 게임
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── C01 : 손 X선 사진(투명 종이 겹침) ─────────────────────────────── */
var C01 = { W:120, H:84, soft:null, bone:null };
(function(){ var W=C01.W, H=C01.H, soft=new Float32Array(W*H), bone=new Float32Array(W*H), i, j, k;
  function rr(x,y,cx,cy,hw,hh,r){ var dx=Math.max(Math.abs(x-cx)-(hw-r),0), dy=Math.max(Math.abs(y-cy)-(hh-r),0); return Math.hypot(dx,dy)<=r; }
  for(j=0;j<H;j++) for(i=0;i<W;i++){ var x=i, y=j; var s=0, b=0;
    if(rr(x,y,60,62,30,19,10)) s=3.2; if(rr(x,y,60,76,20,6,6)) s=2.6;                                   // 손바닥 · 손목
    var fx=[24,43,60,77,96], fl=[34,44,48,44,34], fa=[-0.35,-0.12,0,0.12,0.35];
    for(k=0;k<5;k++){ var cx=fx[k]+(60-fx[k])*0.0, topy=62-19-fl[k]; var ang=fa[k]; var dx=(x-fx[k])*Math.cos(ang)+(y-45)*Math.sin(ang), dy=-(x-fx[k])*Math.sin(ang)+(y-45)*Math.cos(ang); if(Math.abs(dx)<6.5 && dy>-fl[k] && dy<12){ s=Math.max(s,2.0); if(Math.abs(dx)<2.6 && dy>-fl[k]+4 && dy<10) b=0.85; } }
    if(Math.abs(x-60)<5 && y>56 && y<84) b=Math.max(b,0.9); if(rr(x,y,60,66,22,10,6)&&Math.abs((x-60))%11<2.2) b=Math.max(b,0.5);
    soft[j*W+i]=s; bone[j*W+i]=b; } C01.soft=soft; C01.bone=bone; })();
function c01img(E,mAs){ var W=C01.W, H=C01.H, out=new Float32Array(W*H), ms=muE('muscle',E), mb=muE('bone',E), K=mAs/100, i; for(i=0;i<out.length;i++){ var s=C01.soft[i], b=C01.bone[i], T=(s>0)? Math.exp(-ms*Math.max(0,s-b)-mb*b) : 1; out[i]=1-Math.min(1,K*T); } return out; }
function c01stat(E,mAs){ var ms=muE('muscle',E), mb=muE('bone',E), K=mAs/100, Ts=Math.exp(-ms*2.0), Tb=Math.exp(-ms*1.15-mb*0.85); return {Ds:1-Math.min(1,K*Ts), Db:1-Math.min(1,K*Tb), Ts:Ts, Tb:Tb}; }
(function(){
  var a=c01stat(55,120), b=c01stat(35,120), c=c01stat(100,120), d=c01stat(55,40);
  PROJ.C01={ id:'C01', t:'나의 X선 사진 그리기 — 투명 종이를 겹쳐 만드는 손 사진', icon:'🖐️', type:'창의 · 작품', lv:1, dur:'1 주', cost:'약 1 ~ 2만 원',
    one:'투명 종이(트레이싱지) · 셀로판에 손의 뼈와 살을 층별로 그려 겹치고 뒤에서 빛을 비춘다. 층을 많이 겹칠수록 어둡게 보이는 「감약」을 이용해 X선 사진처럼 보이는 작품을 만들고, 에너지(밝기 · 대조)를 조절하는 원리를 설명한다.',
    q:'뼈와 살을 어느 층에 어떻게 그려야 X선 사진처럼 보일까? 빛을 세게 / 약하게 하면 대조가 어떻게 달라질까?',
    why:'X선 사진을 <b>예술 작품의 재료</b>로 삼아 보세요. 겹침(감약)의 원리를 이해해야 뼈가 하얗게, 살이 회색으로 보이게 만들 수 있습니다. 과학과 미술이 만나는 가장 쉬운 창의 프로젝트입니다.',
    link:'원리① X선 감약(2번 탭) · R01 · 교과서 빛의 투과 · 미술(명암 · 층 구성).',
    fig:FIGS.C01.fig, tg:FIGS.C01.tg,
    cap:'LED 뒷빛(왼쪽) → 투명 종이 층(가운데: 뼈 층 · 살 층) → 스크린(오른쪽). 투명 종이 = 조직(왼쪽 아래) · 겹 수 = 두께(가운데 아래) · 밝기 조절 = 에너지(오른쪽 아래)',
    parts:[['뒷빛','LED 라이트박스 · 태블릿 흰 화면','균일한 밝기','뒷빛이 균일해야 감약 차이가 그대로 보인다. 확산지를 한 장 덮는다.'],
           ['투명 종이 층','트레이싱지 · OHP · 셀로판','뼈 층 3 장 · 살 층 1 장 등','검은 사인펜으로 칠한 농도가 짙을수록 감약이 크다. 뼈는 진하게.'],
           ['스크린','반투명 스크린 · 흰 종이','관람 쪽','층을 모두 겹친 뒤 스크린 앞에서 보는 것이 「X선 사진」이다.'],
           ['조직 = 종이 종류','뼈 = 진한 칠 · 살 = 연한 칠','μ 비율을 정한다','뼈 : 살 = 약 3 : 1 의 감약(진하기)이 되도록 연습한다.'],
           ['겹 수 = 두께','층 수 N','투과율 $T^N$','손바닥은 두꺼워 겹이 많고 손가락 끝은 얇다. 겹 수를 달리한다.'],
           ['밝기 조절 = 에너지','뒷빛 세기 · 노출','높은 kVp ≈ 뒷빛 세게(대조 ↓)','밝기를 바꾸어 뼈와 살의 대조가 어떻게 달라지는지 기록한다.']],
    budget:[['트레이싱지 · OHP','1 묶음','약 5천 원','셀로판'],['검은 펜(굵기 다양)','1 세트','약 3천 원','—'],['LED 라이트박스','1','약 5천 원','태블릿 흰 화면'],['스크린 종이 · 틀','1','약 2천 원','—'],['사진 촬영(스마트폰)','1','보유','—']],
    steps:['손을 종이에 대고 윤곽(살)과 뼈의 위치를 연필로 그린다(인체 도감 참고).','뼈 층(진한 칠) · 살 층(연한 칠) · 손가락 끝 층(연한 칠)을 서로 다른 투명 종이에 그린다.','뒷빛 위에 층을 순서대로 겹치고 겹 수를 바꾸며 뼈와 살의 대조를 관찰한다.','뒷빛을 약하게 / 세게 바꾸어 같은 작품의 대조 변화를 사진으로 찍는다.','작품 설명문 : 「뼈가 하얗게 보이는 까닭」을 감약 식으로 적는다.'],
    vars:['겹 수 · 칠의 진하기 · 뒷빛 세기','뼈와 살의 명암 대조','종이 종류 · 광원 균일도'],
    predict:[['E 55 keV · 노출 120','살 밝기 '+fx(a.Ds,2)+' · 뼈 밝기 '+fx(a.Db,2)+' (뼈가 더 밝다)','뼈가 X선을 더 흡수 → 도달 적음 → 하얗게 표시'],
             ['E 35 keV(낮은 에너지)','살 '+fx(b.Ds,2)+' · 뼈 '+fx(b.Db,2)+' → 대조 큼','낮은 에너지는 뼈 · 살 대조가 크다'],
             ['E 100 keV(높은 에너지)','살 '+fx(c.Ds,2)+' · 뼈 '+fx(c.Db,2)+' → 대조 작음','높은 에너지는 잘 투과 · 대조 낮다'],
             ['노출 40(어둡게)','살 '+fx(d.Ds,2)+' · 뼈 '+fx(d.Db,2)+' → 전체가 흐림','노출이 부족하면 영상이 어둡고 거칠다']],
    data:{cols:['E (keV)','노출','살 밝기','뼈 밝기','대조(뼈−살)'],
          rows:[[35,120],[55,120],[75,120],[100,120],[55,60],[55,200]].map(function(q){ var s=c01stat(q[0],q[1]); return [q[0],q[1],fx(s.Ds,2),fx(s.Db,2),fx(s.Db-s.Ds,2)]; })},
    analysis:'작품의 각 부분에서 밝기를 사진으로 읽어(스마트폰 갤러리 · 이미지 분석 앱) 뼈 / 살 영역의 평균 밝기와 대조를 구한다. 뒷빛 세기(노출)와 겹 수에 따라 대조가 어떻게 변하는지 그래프로 정리하고 시뮬레이션과 비교한다.',
    special:['🎨 작품 기획서',[['작품 이름','「빛으로 그린 나의 손」 — 투명 종이 X선 사진'],['표현 아이디어','손뼈 위에 이름 · 반지 같은 소품을 얹은 개성 있는 X선 사진 연작'],['과학 근거','$T=e^{-\\mu x}$ · 뼈 : 살 감약 비 · 에너지와 대조'],['전시 구성','층별 종이 + 완성 사진 + 감약 그래프 + 안전 문구(방사선 장비는 쓰지 않음)']]],
    fails:[['뼈가 안 도드라진다','칠을 더 진하게 하고 살 층은 아주 연하게'],['빛이 새서 윤곽이 번진다','층 사이 틈 · 배경광 차단 — 종이 틀로 눌러 고정'],['사진을 찍으면 색이 달라진다','수동 노출 · 흰 균형 고정']],
    up:['<b>C09</b> — 창 폭 · 창 수준 뷰어로 사진 처리.','<b>C07</b> — 팬텀으로 조직을 실제 재료로.','<b>R01</b> — 층 수와 밝기를 측정.'],
    next:['원리① X선 감약',2],
    eval:[['창의성','표현 · 구성의 독창성'],['과학 근거','감약 · 에너지 대조 설명'],['제작','층 · 칠 진하기 조절'],['안전 · 정직','실제 X선이 아닌 유사 작품임을 표기']],
    tip:'완성 작품 옆에 「겹 수–밝기 그래프」 한 장을 놓으면 미술 작품이 과학 전시가 됩니다.' };
})();
SIMS.C01={ q:'X선 에너지(뒷빛)와 노출을 바꾸면 손 X선 사진의 뼈와 살 대조는 어떻게 변할까?',
  a:{nm:'X선 에너지 E',min:30,max:110,step:5,val:55,unit:'keV',d:0}, b:{nm:'노출(밝기)',min:20,max:300,step:10,val:120,unit:'',d:0},
  cap1:'가상 손 X선 사진(밝음 = 많이 흡수). 뼈가 가장 하얗고 살은 회색, 손 바깥(공기)은 검게 나옵니다.',
  cap2:'📊 손가락 한 줄의 밝기 단면 — 파랑(지금) · 초록 30 → 흰 100 keV. 에너지가 낮을수록 뼈가 높이 솟는(대조 ↑) 모양.',
  note:'모형 : 손 두께 지도(살 2 ~ 3.2 cm · 뼈 약 0.85 cm) · $T=\\exp(-\\mu_s x_s-\\mu_b x_b)$ · 표시 밝기 = 1 − min(1, 노출/100 · T). 단색 X선 · 산란 무시한 교육용 어림.',
  anim:function(ctx,w,h,t,E,mAs,S){ var img=c01img(E,mAs), s=Math.min(w-180,h-40)*1, ww=Math.min(w-200,(h-40)*C01.W/C01.H), hh=ww*C01.H/C01.W, x0=20, y0=26; grayImage2(ctx,img,C01.W,C01.H,x0,y0,ww,hh,0,1,true); ctx.strokeStyle=COL.dim; ctx.strokeRect(x0,y0,ww,hh);
    var st=c01stat(E,mAs), xr=x0+ww+16; cvText(ctx,'E '+E+' keV · 노출 '+mAs,12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'살 밝기 '+st.Ds.toFixed(2),xr,y0+20,COL.ok,'12px system-ui,sans-serif'); cvText(ctx,'뼈 밝기 '+st.Db.toFixed(2),xr,y0+42,COL.white,'12px system-ui,sans-serif'); cvText(ctx,'대조 '+(st.Db-st.Ds).toFixed(2),xr,y0+64,COL.amber,'bold 12.5px system-ui,sans-serif'); var yl=y0+hh*0.55; ctx.strokeStyle=COL.amber; ctx.setLineDash([4,3]); ctx.beginPath(); ctx.moveTo(x0,yl); ctx.lineTo(x0+ww,yl); ctx.stroke(); ctx.setLineDash([]); },
  graph:function(ctx,w,h,E,mAs,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:C01.W,ymin:0,ymax:1.05,xlabel:'가로 위치(화소)',ylabel:'표시 밝기',title:'손 사진의 한 줄 단면(뼈 위로 솟음)',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(1); }}), row=Math.round(C01.H*0.55), i;
    [[30,COL.ok],[100,COL.white],[E,COL.blue]].forEach(function(q,k){ var im=c01img(q[0],mAs), pts=[]; for(i=0;i<C01.W;i++) pts.push([i,im[row*C01.W+i]]); plotLine(ctx,P,pts,q[1],k===2?2.4:1.3,k===2?null:[4,3]); }); legend(ctx,P.x1-130,P.y1+14,[['30 keV',COL.ok],['100 keV',COL.white],['지금 '+E+' keV',COL.blue]]); },
  kv:function(E,mAs,S){ var s=c01stat(E,mAs); return [['살 밝기',s.Ds.toFixed(2),'a'],['뼈 밝기',s.Db.toFixed(2),'g'],['대조(뼈−살)',(s.Db-s.Ds).toFixed(2),'v2'],['살 투과율',(s.Ts*100).toFixed(0)+' %'],['뼈 경로 투과율',(s.Tb*100).toFixed(0)+' %','r']]; } };

/* ── C02 : 사이노그램 아트 ─────────────────────────────────────────── */
function c02(r,phi,th){ var p=phi*Math.PI/180; return {A:r*Math.cos(th-p), B:0.55*r*Math.cos(th-(p+2.1))}; }
(function(){
  PROJ.C02={ id:'C02', t:'사이노그램 아트 — 점 하나가 사인 곡선이 되는 그림', icon:'〰️', type:'창의 · 작품', lv:2, dur:'1 ~ 2주', cost:'약 0 ~ 1만 원',
    one:'점 · 도형을 회전하며 한 방향으로 투영한 위치를 각도마다 그리면 사인 곡선(사이노그램)이 된다. 여러 점으로 이루어진 그림(이니셜 · 로고)의 사이노그램을 그리고, 거꾸로 사이노그램에서 그림을 알아맞히는 퍼즐 카드를 만든다.',
    q:'중심에서 멀리 있는 점과 가까운 점의 사인 곡선은 어떻게 다를까? 곡선의 높이와 위상은 점의 무엇을 알려 줄까?',
    why:'CT 의 원자료 사이노그램은 「어렵고 지루한 그림」이 아니라 <b>점들이 그리는 아름다운 곡선의 합</b>입니다. 직접 그려 보면 재구성의 의미(곡선을 거꾸로 점으로 되돌리기)가 보입니다.',
    link:'원리② CT(3번 탭) · 삼각함수 $r\\cos(\\theta-\\phi)$ · R03.',
    fig:FIGS.C02.fig, tg:FIGS.C02.tg,
    cap:'원 안의 점(왼쪽)을 각도 θ 마다 한 방향으로 투영하면 사인 곡선(가운데)이 된다. 점 → 곡선(왼쪽 아래) · 식 $s=r\\cos(\\theta-\\phi)$ (가운데 아래) · 스케치 카드(오른쪽 아래)',
    parts:[['점 그림','방 · 원 위의 점','반지름 r · 각 φ','점의 위치를 극좌표 $(r,\\phi)$ 로 쓴다.'],
           ['투영선','각도 θ 의 직선','점의 투영 위치 $s$','각도 θ 방향의 직선에 점을 수직으로 내린 위치.'],
           ['사이노그램','가로 θ · 세로 s','점 하나 = 사인 곡선','진폭 r, 위상 φ — 두 값이 점의 위치를 알려 준다.'],
           ['곡선 그리기','방안지 · 코딩','$s=r\\cos(\\theta-\\phi)$','방안지로 θ 를 15° 씩 계산해 점을 찍거나 스프레드시트로 그린다.'],
           ['퍼즐 카드','사이노그램만 보여 주고 점 위치 맞히기','난이도 조절','점이 2 ~ 4 개인 카드부터. 겹치는 곡선을 구별하는 연습.'],
           ['작품화','곡선들의 합 = 줄무늬 그림','색 · 굵기 표현','곡선 하나하나를 다른 색으로 그려 포스터로.']],
    budget:[['방안지 · 투명자','1 세트','약 2천 원','—'],['색연필','1 세트','약 3천 원','—'],['파이썬/스프레드시트','1','무료','—'],['카드 용지','1 묶음','약 2천 원','—'],['—','—','—','—']],
    steps:['원 위에 점 하나를 정하고 $(r,\\phi)$ 를 쓴다.','θ 를 0°, 15°, …, 180° 로 바꾸며 $s=r\\cos(\\theta-\\phi)$ 를 구해 점을 찍는다.','곡선을 이어 그려 진폭과 위상이 점의 위치와 어떻게 관련되는지 정리한다.','점 3 개의 사이노그램을 겹쳐 그리고 친구에게 점 위치를 맞히게 한다(퍼즐).','이니셜 모양(점 10 ~ 20 개)의 사이노그램 포스터를 만든다.'],
    vars:['점의 반지름 r · 위상 φ','곡선의 진폭 · 위상','각도 간격 · 점 개수'],
    predict:[['r = 4 · φ = 40°','진폭 4, 최대 위치 θ = 40°','진폭 = 중심에서 거리'],
             ['r = 4 · φ = 130°','같은 진폭, 최대 위치만 이동','위상 = 점이 있는 방향'],
             ['r = 8(가장자리)','진폭 최대(8)','멀수록 곡선이 크게 흔들린다'],
             ['r = 0(중심)','곡선이 0 인 직선','중심의 점은 모든 각도에서 같은 위치']],
    data:{cols:['θ (°)','점 A (r 4)','점 B (r 2.2)','합성(A+B)'],
          rows:[0,30,60,90,120,150,180].map(function(d){ var q=c02(4,40,d*Math.PI/180); return [d,fx(q.A,2),fx(q.B,2),fx(q.A+q.B,2)]; })},
    analysis:'사이노그램의 진폭에서 $r$, 위상에서 $\\phi$ 를 읽어 점의 원래 위치를 복원한다(「역변환」). 여러 점이 겹칠 때 곡선을 분리하는 어려움이 CT 재구성에 수학(필터 역투영)이 필요한 이유임을 논의한다.',
    special:['🎨 작품 기획서',[['작품 이름','「나의 이니셜 사이노그램」'],['표현 아이디어','이름 첫 글자를 점으로 찍고 그 곡선 포스터와 퍼즐 카드를 함께 전시'],['과학 근거','$s=r\\cos(\\theta-\\phi)$ · 진폭 = 반지름 · 위상 = 방향'],['전시 구성','포스터 + 퍼즐 카드 + 정답 + 3 번 탭 시뮬레이션 QR']]],
    fails:[['곡선이 한쪽으로만 치우친다','$\\cos$ 의 위상(φ 도 · 라디안 단위) 확인'],['점 여러 개가 어느 곡선인지 구분 안 된다','점 개수를 줄이고 색을 달리한다'],['세로 눈금이 뒤집힌다','투영선 방향 정의를 통일']],
    up:['<b>R03</b> — 실제 사진으로 사이노그램.','<b>3번 탭</b> — 필터 역투영으로 복원.','<b>C09</b> — 창 폭 조정으로 보이기.'],
    next:['원리② CT',3],
    eval:[['창의성','포스터 · 퍼즐 설계'],['정확성','곡선 계산의 정확성'],['이해','진폭 · 위상의 의미 설명'],['전시','관람자가 이해하는가']],
    tip:'퍼즐 카드(곡선 → 점 맞히기)를 관객이 풀게 하면 CT 의 「재구성」을 몸으로 이해시킬 수 있습니다.' };
})();
SIMS.C02={ q:'점의 반지름과 방향(위상)을 바꾸면 사이노그램의 사인 곡선은 어떻게 달라질까?',
  a:{nm:'점 A 의 반지름 r',min:0,max:8,step:0.5,val:4,unit:'cm',d:1}, b:{nm:'점 A 의 방향 φ',min:0,max:360,step:10,val:40,unit:'°',d:0},
  cap1:'왼쪽 : 점 A(노랑) · B(빨강)와 회전하는 투영선. 오른쪽 : 각도에 따라 쌓이는 사이노그램 곡선(10 초에 0 → 180°).',
  cap2:'📊 완성된 사이노그램(0 ~ 180°) : 점 A, 점 B, 합. 점 = 지금 각도. 곡선의 높이(진폭)가 반지름, 어긋남(위상)이 방향.',
  note:'모형 : 투영 위치 $s=r\\cos(\\theta-\\phi)$. 점 B 는 반지름 0.55 r, 방향 φ + 120° 로 고정. 평행 빔 모형.',
  anim:function(ctx,w,h,t,r,phi,S){ var R=Math.min(w*0.4,h)*0.42, cx=w*0.25, cy=h/2+4, th=Math.PI*Math.min(1,t/9), p=phi*Math.PI/180, i; cvCirc(ctx,cx,cy,R,null,COL.dim,1.2); cvCirc(ctx,cx,cy,R*0.5,null,COL.dim,0.8);
    var ptA=[cx+R*(r/8)*Math.cos(p), cy-R*(r/8)*Math.sin(p)], rb=0.55*r, pb=p+2.1, ptB=[cx+R*(rb/8)*Math.cos(pb), cy-R*(rb/8)*Math.sin(pb)]; cvCirc(ctx,ptA[0],ptA[1],6,COL.amber,null,0); cvCirc(ctx,ptB[0],ptB[1],5,COL.grav,null,0);
    var dxl=Math.cos(th), dyl=Math.sin(th); cvLine(ctx,[[cx-dxl*R*1.2,cy+dyl*R*1.2],[cx+dxl*R*1.2,cy-dyl*R*1.2]],COL.blue,1.6); [ptA,ptB].forEach(function(q,k){ var s=(q[0]-cx)*dxl-(q[1]-cy)*dyl; cvLine(ctx,[[q[0],q[1]],[cx+s*dxl,cy-s*dyl]],k?COL.grav:COL.amber,1,[3,3]); });
    var sx0=w*0.5, sw=w*0.46, sy=cy, sa=R; cvLine(ctx,[[sx0,sy],[sx0+sw,sy]],COL.axis2,1); cvLine(ctx,[[sx0,sy-sa],[sx0,sy+sa]],COL.axis2,1); cvText(ctx,'θ 0 → 180°',sx0+sw,sy+sa+12,COL.tick,'10.5px system-ui,sans-serif','right'); cvText(ctx,'s',sx0-8,sy-sa,COL.tick,'11px system-ui,sans-serif','right');
    var pa=[], pbb=[]; for(i=0;i<=60;i++){ var tq=Math.PI*i/60; if(tq>th) break; var q=c02(r,phi,tq); pa.push([sx0+sw*tq/Math.PI,sy-sa*q.A/8]); pbb.push([sx0+sw*tq/Math.PI,sy-sa*q.B/8]); } cvLine(ctx,pa,COL.amber,2); cvLine(ctx,pbb,COL.grav,2);
    cvText(ctx,'θ = '+(th*180/Math.PI).toFixed(0)+'° · 점 A 진폭 '+r.toFixed(1)+' · 위상 '+phi+'°',12,16,COL.text,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,r,phi,S){ var P=makePlot(ctx,w,h,{xmin:0,xmax:180,ymin:-9,ymax:9,xlabel:'투영 각도 θ (°)',ylabel:'투영 위치 s (cm)',title:'사이노그램 = 점마다 하나의 사인 곡선',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }}), A=[], B=[], Sm=[], i, th=Math.PI*Math.min(1,Anim.time(10)/9);
    for(i=0;i<=90;i++){ var d=i*2, q=c02(r,phi,d*Math.PI/180); A.push([d,q.A]); B.push([d,q.B]); Sm.push([d,q.A+q.B]); } plotLine(ctx,P,Sm,COL.dim,1.2,[4,3]); plotLine(ctx,P,A,COL.amber,2.2); plotLine(ctx,P,B,COL.grav,2); plotPoints(ctx,P,[[Math.max(0,Math.min(180,th*180/Math.PI)),c02(r,phi,th).A]],COL.ok,6); legend(ctx,P.x1-120,P.y1+14,[['점 A',COL.amber],['점 B',COL.grav],['합(겹침)',COL.dim]]); },
  kv:function(r,phi,S){ return [['진폭(= 반지름)',r.toFixed(1)+' cm','a'],['최대가 되는 θ',(phi%180)+'°','g'],['점 B 진폭',(0.55*r).toFixed(1)+' cm'],['점 B 위상',((phi+120)%180)+'°','v2'],['주기','180° 마다 부호 반전(0 ~ 180° 범위)','r']]; } };

/* ── C03 : 거리를 소리로 — 초음파 지팡이 ────────────────────────────── */
var NOTE_N=['도','도♯','레','레♯','미','파','파♯','솔','솔♯','라','라♯','시'];
function noteName(f){ var n=Math.round(69+12*Math.log2(f/440)); return NOTE_N[((n%12)+12)%12]+(Math.floor(n/12)-1); }
function c03f(d,oct){ return 220*Math.pow(2,oct*(4-Math.min(4,Math.max(0.2,d)))/3.8); }
(function(){
  var a=c03f(0.5,2), b=c03f(2,2), c=c03f(3.5,2), d=c03f(1,3);
  PROJ.C03={ id:'C03', t:'소리로 보는 거리 — 초음파 센서로 만드는 소리 지팡이', icon:'🦯', type:'창의 · 작품', lv:2, dur:'2 주', cost:'약 2 ~ 3만 원',
    one:'초음파 거리 센서의 거리 $d$ 를 부저의 음높이로 바꾸어(가까울수록 높은 음) 눈을 가리고도 장애물까지의 거리를 알 수 있는 「소리 지팡이」를 만든다. 지수 매핑(같은 거리 차 = 같은 음정 차)이 귀에 자연스러운지 시험한다.',
    q:'거리를 음높이로 바꿀 때 직선 매핑과 지수(음정) 매핑 중 어느 쪽이 더 거리를 느끼기 좋을까? 몇 cm 차이까지 구별할 수 있을까?',
    why:'초음파 진단기의 「거리 = 시간」 아이디어를 <b>다른 감각으로 번역</b>해 시각장애 보조 · 안전 장치로 바꿉니다. 사람이 감각하는 음높이는 로그(음정)라는 사실도 함께 체험합니다.',
    link:'원리③ 초음파(4번 탭) · R04 · 소리의 높이와 진동수 · 로그 · 아두이노 tone().',
    fig:FIGS.C03.fig, tg:FIGS.C03.tg,
    cap:'초음파 센서(왼쪽)가 장애물까지 거리를 재고 부저(오른쪽)가 거리에 따라 음높이를 낸다. 장애물 · 에코(가운데) · 거리–음높이 식(왼쪽 아래) · 매핑 곡선(가운데 아래) · 가까울수록 높은 음(오른쪽 아래)',
    parts:[['센서','HC-SR04 · 아두이노','거리 d 측정','10 Hz 로 읽는다. 중앙값 필터로 튀는 값을 제거.'],
           ['장애물','벽 · 사람 · 의자','반사가 좋은 면','천 · 비스듬한 면은 감지가 약하다. 시험 장소를 정한다.'],
           ['부저','수동형 부저 · 스피커','tone() 함수','주파수를 바꿀 수 있는 수동형 부저를 쓴다(능동형은 음높이 고정).'],
           ['매핑 함수','$f=f_0\\cdot2^{N(d_{\\max}-d)/\\Delta d}$','지수 매핑','같은 거리 차가 같은 음정 차 → 귀에 자연스럽다.'],
           ['시험 설계','눈 가리고 거리 맞히기','10 명 · 5 거리','정답률 · 오차(cm)를 기록. 선형 vs 지수 매핑을 비교한다.'],
           ['안전','진짜 시각장애 보조 장치가 아님','교육용 시제품','실제 길 안내에 쓰지 않고 시제품 시험만 한다.']],
    budget:[['HC-SR04 · 아두이노','1 세트','약 7천 원','—'],['수동 부저','1','약 500원','스피커'],['배터리 · 케이스','1 세트','약 5천 원','—'],['지팡이 · 손잡이 소재','1','약 3천 원','막대'],['—','—','—','—']],
    steps:['센서와 부저를 아두이노에 연결하고 거리를 시리얼로 확인한다.','선형 매핑(거리 → 주파수 직선)과 지수 매핑을 각각 구현한다(14번 탭 코드 참고).','눈을 가린 시험자가 장애물까지 거리를 소리만으로 추정하게 하고 정답률을 기록한다.','주파수 범위(옥타브 수)를 바꾸어 변별력(몇 cm 차이를 구별하는지)을 구한다.','잡음 필터 · 갱신 주기를 조정해 소리가 부드럽게 변하게 하고 작품 발표를 준비한다.'],
    vars:['매핑 방식(선형 · 지수) · 옥타브 수','시험자의 거리 오차 · 정답률','센서 잡음 · 갱신 주기 · 소리 크기'],
    predict:[['거리 0.5 m · 2 옥타브','음높이 '+noteName(a)+' ('+fx(a,0)+' Hz)','가까울수록 높은 음'],
             ['거리 2 m',''+noteName(b)+' ('+fx(b,0)+' Hz)','중간'],
             ['거리 3.5 m',''+noteName(c)+' ('+fx(c,0)+' Hz)','멀면 낮은 음'],
             ['옥타브 3 · 1 m',''+noteName(d)+' ('+fx(d,0)+' Hz) — 변별력 더 좋음','음역이 넓을수록 거리 변화를 더 잘 구별']],
    data:{cols:['거리 (m)','f 2 옥타브 (Hz)','음이름','f 3 옥타브 (Hz)','10 cm 당 음정 변화(센트)'],
          rows:[0.3,0.5,1,2,3,4].map(function(dd){ var f2=c03f(dd,2); return [dd,fx(f2,0),noteName(f2),fx(c03f(dd,3),0),fx(1200*2/3.8*0.1,0)]; })},
    analysis:'시험 결과(정답 거리 대 추정 거리) 산점도를 그려 매핑 방식별 평균 오차 ± 표준편차를 비교한다. 지수 매핑에서 10 cm 당 음정 변화는 일정(약 $1200\\cdot N\\cdot0.1/3.8$ 센트)해 가까운 곳과 먼 곳에서 같은 감도를 준다는 점이 장점이다.',
    special:['🎨 작품 기획서',[['작품 이름','「귀로 보는 길」 — 초음파 소리 지팡이'],['표현 아이디어','시각 없이 거리를 느끼는 체험 전시(눈 가리고 장애물 맞히기)'],['과학 근거','$d=ct/2$ · 지수 매핑 · 센트(음정)'],['전시 구성','지팡이 + 체험 코너 + 정답률 그래프 + 한계(실제 보조 장치 아님)']]],
    fails:[['소리가 계속 떨린다','이동 평균 · 중앙값 필터 · 갱신 주기 낮추기'],['가까운 곳에서 소리가 끊긴다','센서 최소 거리 약 2 cm 이하는 무시 처리'],['귀가 아프다','최고 주파수 · 음량 제한']],
    up:['<b>R07</b> — 스캐너로 각도별 지도를 소리로.','<b>R04</b> — 음속 보정으로 거리 정확도 향상.','<b>I07</b> — 탐촉자 가이드와 연결.'],
    next:['원리③ 초음파',4],
    eval:[['창의성','체험 설계 · 스토리'],['과학 근거','매핑 · 센서 원리'],['시험','사용자 시험 · 통계'],['안전 · 윤리','보조 장치로 오해되지 않게 표기']],
    tip:'지수 매핑과 선형 매핑의 정답률을 한 막대그래프로 비교해 보이면 설계 선택의 근거가 분명해집니다.' };
})();
SIMS.C03={ q:'거리와 옥타브 폭을 바꾸면 소리 지팡이의 음높이와 구별하기 쉬운 거리 차는 어떻게 달라질까?',
  a:{nm:'장애물까지 거리 d',min:0.2,max:4,step:0.1,val:1.5,unit:'m',d:1}, b:{nm:'음역 폭',min:1,max:4,step:0.5,val:2,unit:'옥타브',d:1},
  cap1:'지팡이(왼쪽)가 장애물(오른쪽 벽)로 접근하는 모습. 가까워질수록 음높이가 올라갑니다(소리 파문 · 음이름).',
  cap2:'📊 위 : 거리 대 음높이(로그 눈금) — 지수 매핑은 직선 · 아래 : 거리 10 cm 당 음정 변화(센트).',
  note:'모형 : $f=220\\cdot2^{N(4-d)/3.8}$ Hz (거리 0.2 ~ 4 m → 최저 220 Hz · N 옥타브 위). 사람이 구별하는 최소 음정 차는 약 5 ~ 10 센트(개인차). 교육용 시제품 모형입니다.',
  anim:function(ctx,w,h,t,d,oct,S){ var wallx=w-60, p=(t%10)/10, dd=Math.max(0.2,d*(1-0.8*Math.abs(Math.sin(Math.PI*p)))), sc=(wallx-90)/4, x=wallx-dd*sc, y0=h/2, f=c03f(dd,oct), i; skyBg(ctx,w,h); groundBg(ctx,w,h,y0+34);
    cvRect(ctx,wallx,y0-60,16,94,COL.dim,COL.dev,1); cvRect(ctx,x-34,y0-12,34,24,COL.metal||'#475569',COL.dev,1.2); cvCirc(ctx,x-24,y0,6,COL.plotbg,COL.blue,1.2); cvCirc(ctx,x-10,y0,6,COL.plotbg,COL.blue,1.2); cvLine(ctx,[[x-34,y0+12],[x-60,y0+34]],COL.dim,3);
    for(i=1;i<=3;i++){ ctx.strokeStyle='rgba(125,211,252,'+(0.7-i*0.18)+')'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.arc(x,y0,i*14+((t*30)%14),-0.9,0.9); ctx.stroke(); }
    cvText(ctx,'거리 '+dd.toFixed(2)+' m',(x+wallx)/2,y0-30,COL.violet||COL.amber,'bold 12px system-ui,sans-serif','center'); cvText(ctx,'♪ '+noteName(f)+' · '+f.toFixed(0)+' Hz',12,16,COL.amber,'bold 14px system-ui,sans-serif'); },
  graph:function(ctx,w,h,d,oct,S){ var hh=Math.floor(h/2), ds=[], i; for(i=0.2;i<=4.001;i+=0.1) ds.push(i);
    subPlot(ctx,0,0,w,hh,{xmin:0.2,xmax:4,ymin:200,ymax:3600,ylog:true,ylabel:'음높이 f (Hz)',title:'거리 대 음높이 (옥타브 1 · 2 · 3 · 지금)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [[1,COL.blue],[2,COL.ok],[3,COL.violet||COL.amber]].forEach(function(q){ plotLine(ctx,P,ds.map(function(x){ return [x,c03f(x,q[0])]; }),q[1],1.4); }); plotLine(ctx,P,ds.map(function(x){ return [x,c03f(x,oct)]; }),COL.amber,2.6); plotPoints(ctx,P,[[d,c03f(d,oct)]],COL.amber,6.5); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.2,xmax:4,ymin:0,ymax:100,xlabel:'거리 d (m)',ylabel:'10 cm 당 센트',title:'10 cm 거리 차에 해당하는 음정 차 (지수 매핑 = 일정)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toFixed(0); }}, function(P){ [1,2,3,4].forEach(function(o,k){ plotLine(ctx,P,[[0.2,1200*o*0.1/3.8],[4,1200*o*0.1/3.8]],[COL.blue,COL.ok,COL.violet||COL.amber,COL.grav][k],o===oct?2.6:1.2); }); cvText(ctx,'옥타브 N 이 클수록 같은 10 cm 가 더 큰 음정 차 → 구별 쉬움',P.x1-6,P.y1+14,COL.tick,'10.5px system-ui,sans-serif','right'); }); },
  kv:function(d,oct,S){ var f=c03f(d,oct); return [['음높이',f.toFixed(0)+' Hz','a'],['음이름',noteName(f),'g'],['10 cm 당 음정',(1200*oct*0.1/3.8).toFixed(0)+' 센트','v2'],['구별 가능(≥10 센트)?',(1200*oct*0.1/3.8)>=10?'✅ 가능':'⚠ 어려움'],['센서 최소 거리','약 2 cm','r']]; } };

/* ── C04 : MRI 자기장 안전 — 끌림 가속도와 5 가우스 선 ───────────────── */
function c04b(r,B0){ return B0/(1+Math.pow(r/0.25,3)); }
function c04a(r,B0){ var x=r/0.25, db=B0*3*x*x/(0.25*Math.pow(1+x*x*x,2)); return 192*db; }
function c04r5(B0){ return 0.25*Math.pow(B0/0.0005-1,1/3); }
(function(){
  var a=c04a(0.5,3), b=c04a(1.0,3), c=c04a(0.5,7), d=c04r5(3);
  PROJ.C04={ id:'C04', t:'MRI 자기장 안전 전시 — 금속은 얼마나 위험한가?', icon:'🧲', type:'창의 · 전시', lv:1, dur:'1 주', cost:'약 0 ~ 1만 원',
    one:'MRI 검사실의 안전 구역(자기장 경계 · 5 가우스 선)과 금속 물체가 끌려오는 위험을 그림 · 카드 · 간단한 시뮬레이션으로 알리는 전시를 만든다. 거리에 따른 자기장 세기와 끌림 가속도의 그래프를 근거로 쓴다(실제 강자석은 쓰지 않는다).',
    q:'MRI 자석에서 몇 m 떨어져야 금속이 끌려오지 않을까? 자기장이 2 배면 위험 반경은 얼마나 늘어날까?',
    why:'MRI 의 가장 큰 위험은 <b>방사선이 아니라 자기장</b>입니다. 안전 선(5 가우스)과 투사체 효과를 눈으로 보여 주는 전시는 병원 안전 교육에도 쓰일 만큼 중요합니다. 숫자 하나가 안전 구역 설계를 정합니다.',
    link:'원리④ MRI(5번 탭) · 원리⑤ 안전(6번 탭) · I05 · 교과서 자기장 · 자기력.',
    fig:FIGS.C04.fig, tg:FIGS.C04.tg,
    cap:'자석(왼쪽)에서 멀어질수록 자기장이 약해지고(가운데) 금속이 끌려오는 위험은 거리에 따라 급격히 줄어든다(경고 표지, 오른쪽). 자기장 · 가속도(왼쪽 아래) · 5 가우스 선(가운데 아래) · 안전 점검표 게임(오른쪽 아래)',
    parts:[['MRI 자석','1.5 T · 3 T 초전도 자석','항상 켜져 있음','전원을 꺼도 자기장은 유지된다(초전도). 위험은 24 시간 있다.'],
           ['금속 물체','클립 · 열쇠 · 휠체어 · 산소통','강자성 재료가 위험','알루미늄 · 구리는 끌리지 않고 철 · 니켈이 위험. 모르면 반입 금지.'],
           ['안전 구역 표지','구역 I ~ IV · 5 가우스 선','출입 통제','일반인이 5 가우스(0.5 mT) 안으로 들어오지 않게 통제한다.'],
           ['점검표','금속 · 이식물 · 심박조율기 질문','검사 전 필수','질문에 모두 답해야 들어간다. 모르면 의사에게 확인.'],
           ['거리–자기장 그림','$B(r)$ 곡선','거리 3 승 감소(쌍극 근사)','거리가 2 배면 자기장은 약 ⅛, 그러나 가까운 곳은 급경사.'],
           ['전시 도구','포스터 · 카드 · 인형 · 자석 없이 로프','안전한 시연','실제 강자석 · 금속 던지기는 하지 않는다. 그림 · 줄 · 종이 물체로 시연.']],
    budget:[['포스터 용지 · 펜','1 세트','약 5천 원','—'],['카드 용지','1 묶음','약 2천 원','—'],['줄 · 표지 스티커','1 세트','약 2천 원','—'],['컴퓨터(그래프)','1','보유','—'],['—','—','—','—']],
    steps:['MRI 안전 점검표를 조사해(병원 · 학회 안내) 질문 10 개를 정리한다.','5 가우스 선까지의 거리를 3 T · 1.5 T 자석에 대해 계산(시뮬레이션 사용)하고 바닥에 줄로 표시하는 그림을 그린다.','금속 물체 카드(클립 · 의료용 산소통 · 알루미늄 컵 …)를 만들고 「반입 가능 / 불가」 분류 게임을 만든다.','관람객에게 게임을 하게 하고 정답률을 기록한다.','발표 : 「MRI 의 위험은 방사선이 아니다」 한 문장을 중심으로 전시를 구성한다.'],
    vars:['자기장 세기 B₀ · 거리 r','자기장 B(r) · 끌림 가속도 a(r)','금속 종류 · 차폐 유무'],
    predict:[['3 T · r = 0.5 m','B = '+fx(c04b(0.5,3),2)+' T · 끌림 약 '+fx(a/9.8,0)+' g (교육용 어림)','가까우면 중력의 수십 배'],
             ['3 T · r = 1 m','끌림 약 '+fx(b/9.8,1)+' g','거리가 2 배 되면 급감'],
             ['7 T · r = 0.5 m','끌림 약 '+fx(c/9.8,0)+' g','자기장 2 배 이상 → 위험이 비례해 증가'],
             ['3 T · 5 가우스 선','자석 중심에서 약 '+fx(d,1)+' m(차폐 없는 모형 · 실제는 차폐 설계에 따라 다름)','자기장이 클수록 안전 반경이 커진다']],
    data:{cols:['B₀ (T)','5 가우스선 r (m)','r = 0.5 m 끌림 (g)','r = 1 m 끌림 (g)','r = 2 m 끌림 (g)'],
          rows:[0.5,1.5,3,7].map(function(B){ return [B,fx(c04r5(B),1),fx(c04a(0.5,B)/9.8,1),fx(c04a(1,B)/9.8,2),fx(c04a(2,B)/9.8,3)]; })},
    analysis:'거리 대 자기장(로그) · 거리 대 끌림 가속도(로그) 그래프에서 기울기(약 −3, −4)를 읽고 5 가우스 선 반경을 B₀ 의 1/3 제곱에 비례하는 식으로 표현한다. 차폐 설계로 같은 B₀ 에서도 안전 반경이 훨씬 작아질 수 있음을 설명한다.',
    special:['🎨 작품 기획서',[['작품 이름','「자석은 항상 켜져 있다」 — MRI 안전 교육 전시'],['표현 아이디어','줄로 구역을 표시하고 종이 금속 카드를 분류하는 체험 게임'],['과학 근거','$B(r)$ 감소 · 끌림 가속도 · 5 가우스 선'],['전시 구성','포스터 + 분류 게임 + 그래프 + 안전 점검표 + 실제 자석 사용 금지 안내']]],
    fails:[['관람객이 「방사선은 없으니 안전」이라고 오해','방사선 · 자기장 · 소음 · 가열 위험을 구분해 설명'],['숫자 값이 실제 병원과 다르다','차폐 · 설계에 따라 다름을 반드시 밝힌다(교육용 어림)'],['금속 종류를 헷갈린다','철 · 니켈 = 강자성, 알루미늄 · 구리 = 아님 표']],
    up:['<b>I05</b> — 금속 안전 게이트 발명.','<b>5번 탭</b> — 라모어와 자기장 이해.','<b>R08</b> — 세차운동으로 MRI 비유.'],
    next:['원리⑤ 영상 품질 · 선량 · 안전',6],
    eval:[['정확성','안전 정보의 정확성 · 출처'],['창의성','체험 설계'],['근거','그래프 · 식으로 설득'],['책임','실제 위험 행동을 따라 하지 않도록 안내']],
    tip:'「방사선이 없는데 왜 위험할까?」라는 질문을 첫 장에 두면 관람객이 가장 오래 기억합니다.' };
})();
SIMS.C04={ q:'MRI 자기장 세기와 거리를 바꾸면 자기장과 금속이 끌려오는 가속도는 어떻게 달라질까?',
  a:{nm:'자기장 세기 B₀',min:0.5,max:7,step:0.5,val:3,unit:'T',d:1}, b:{nm:'자석 중심에서 거리 r',min:0.3,max:4,step:0.1,val:1,unit:'m',d:1},
  cap1:'자석(왼쪽 원통)과 금속 물체(오른쪽). 화살표 길이 = 끌림 가속도(로그), 점선 원 = 5 가우스 선 반경. 가까울수록 위험이 크게 늘어납니다.',
  cap2:'📊 위 : 거리 대 자기장 B(로그) · 5 가우스 선(빨간 점선) · 아래 : 거리 대 끌림 가속도(g 단위, 로그).',
  note:'모형(교육용) : $B(r)=B_0/(1+(r/0.25)^3)$ (차폐 없는 쌍극 근사), 포화 자화 강자성 물체의 가속도 $a\\approx192\\,|dB/dr|$ (m/s²). 실제 값은 자석 설계 · 차폐 · 물체 종류에 따라 크게 달라지므로 안전 판단에 쓰지 마세요.',
  anim:function(ctx,w,h,t,B0,r,S){ var sc=(w-120)/4.2, x0=70, y0=h/2, R0=0.25*sc, i; skyBg(ctx,w,h); cvRect(ctx,6,y0-60,64,120,COL.metal||'#475569',COL.dev,2); cvCirc(ctx,38,y0,20,COL.plotbg,COL.dim,1.5); cvText(ctx,'MRI',38,y0+44,COL.text,'bold 11px system-ui,sans-serif','center');
    var r5=c04r5(B0); for(i=0;i<4;i++){ var rr=0.35+i*0.55; ctx.strokeStyle='rgba(52,211,153,'+Math.max(0.1,0.5-i*0.1)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(38,y0,rr*sc+20,-1.3,1.3); ctx.stroke(); }
    ctx.strokeStyle=COL.grav; ctx.setLineDash([5,4]); ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(38,y0,r5*sc+20,-1.2,1.2); ctx.stroke(); ctx.setLineDash([]); cvText(ctx,'5 가우스 선 '+r5.toFixed(1)+' m',38+r5*sc+24,y0-r5*sc*0.7,COL.grav,'11px system-ui,sans-serif');
    var ox=70+r*sc, a=c04a(r,B0), len=Math.min(90,10+14*Math.log10(1+a)); var shake=Math.sin(t*20)*Math.min(3,a/400); cvRect(ctx,ox,y0-6+shake,20,12,COL.dim,COL.dev,1); cvText(ctx,'금속',ox+10,y0-16,COL.tick,'10.5px system-ui,sans-serif','center'); cvLine(ctx,[[ox,y0+22],[ox-len,y0+22]],COL.grav,3); cvText(ctx,'끌림 '+(a/9.8).toFixed(1)+' g',ox,y0+40,COL.grav,'bold 11.5px system-ui,sans-serif','center');
    cvText(ctx,'B₀ '+B0.toFixed(1)+' T · 거리 '+r.toFixed(1)+' m · B(r) '+(c04b(r,B0)*1000).toFixed(1)+' mT',12,16,COL.text,'bold 12px system-ui,sans-serif'); cvText(ctx,'교육용 모형 — 실제 안전 판단에 사용 금지',w-10,h-8,COL.tick,'10.5px system-ui,sans-serif','right'); },
  graph:function(ctx,w,h,B0,r,S){ var hh=Math.floor(h/2), rs=[], i; for(i=0.3;i<=4.001;i+=0.1) rs.push(i);
    subPlot(ctx,0,0,w,hh,{xmin:0.3,xmax:4,ymin:1e-5,ymax:10,ylog:true,ylabel:'자기장 B (T)',title:'거리 대 자기장 (5 가우스 = 0.5 mT 선)',left:56,top:24,bottom:20,xfmt:function(){ return ''; },yfmt:function(v){ return v.toExponential(0); }}, function(P){ [[1.5,COL.blue],[3,COL.ok],[7,COL.violet||COL.amber]].forEach(function(q){ plotLine(ctx,P,rs.map(function(x){ return [x,c04b(x,q[0])]; }),q[1],1.4); }); plotLine(ctx,P,rs.map(function(x){ return [x,c04b(x,B0)]; }),COL.amber,2.6); plotLine(ctx,P,[[0.3,0.0005],[4,0.0005]],COL.grav,1.4,[5,4]); plotPoints(ctx,P,[[r,c04b(r,B0)]],COL.amber,6.5); legend(ctx,P.x1-110,P.y1+14,[['1.5 T',COL.blue],['3 T',COL.ok],['7 T',COL.violet||COL.amber],['지금',COL.amber]]); });
    subPlot(ctx,0,hh,w,h-hh,{xmin:0.3,xmax:4,ymin:1e-4,ymax:1000,ylog:true,xlabel:'거리 r (m)',ylabel:'끌림 가속도 (g)',title:'거리 대 끌림 가속도 (1 g = 중력)',left:56,top:24,bottom:38,xfmt:function(v){ return v.toFixed(1); },yfmt:function(v){ return v.toExponential(0); }}, function(P){ plotLine(ctx,P,rs.map(function(x){ return [x,c04a(x,B0)/9.8]; }),COL.amber,2.2); plotLine(ctx,P,[[0.3,1],[4,1]],COL.grav,1.2,[4,3]); plotPoints(ctx,P,[[r,c04a(r,B0)/9.8]],COL.amber,6.5); cvText(ctx,'1 g 선 = 중력과 같은 끌림',P.x1-6,P.y1+14,COL.grav,'10.5px system-ui,sans-serif','right'); }); },
  kv:function(B0,r,S){ var a=c04a(r,B0)/9.8; return [['자기장 B(r)',(c04b(r,B0)*1000).toFixed(1)+' mT','a'],['끌림 가속도',a.toFixed(2)+' g','g'],['5 가우스 선 반경',c04r5(B0).toFixed(1)+' m','v2'],['판정',a>1?'🚫 위험(>1 g)':(c04b(r,B0)>0.0005?'⚠ 자기장 안(5 가우스 이내)':'✅ 바깥'),'r'],['모형 주의','차폐 없음 · 교육용']]; } };

/* ── C05 : 검사 선택 카드 게임(진단 탐정) ───────────────────────────── */
var C05={TG:['골절(뼈)','폐렴 · 폐결절','급성 뇌출혈(응급)','무릎 인대 · 연골','태아 성장(임신)','심장 판막의 움직임'], MOD:['X선','CT','초음파','MRI'], V:[[9,9,3,6],[7,10,2,2],[1,10,0,7],[3,2,5,10],[0,1,10,3],[1,3,10,5]], WS:[[.15,.15],[.2,.15],[.5,0],[.05,.1],[.1,.1],[.2,.1]], SP:[9,8,9,3], CO:[9,5,10,2], SA:[4,2,10,9], COST:[1,5,2,10]};
function c05(k,bud){ var i=Math.round(k)-1, ws=C05.WS[i][0], wc=C05.WS[i][1], r=[], m; for(m=0;m<4;m++){ var s=C05.V[i][m]+ws*C05.SP[m]+wc*C05.CO[m]+0.28*C05.SA[m]; r.push({m:m,s:s,cost:C05.COST[m],ok:C05.COST[m]<=bud}); } var feas=r.filter(function(q){ return q.ok; }); feas.sort(function(a,b){ return b.s-a.s; }); return {r:r, best:feas[0]||null}; }
(function(){
  var a=c05(1,6), b=c05(4,6), c=c05(4,3), d=c05(3,3);
  PROJ.C05={ id:'C05', t:'진단 탐정 — 검사 선택 카드 게임', icon:'🕵️', type:'창의 · 게임', lv:2, dur:'2 주', cost:'약 0 ~ 1만 원',
    one:'환자 사례 카드(증상 · 나이 · 상황)와 검사 카드(X선 · CT · 초음파 · MRI)로 「가장 알맞은 검사」를 고르는 보드 · 카드 게임을 만든다. 진단 가치 · 속도 · 비용 · 방사선 · 예산 한도로 점수를 매기는 규칙을 설계한다.',
    q:'예산 한도가 있을 때 가장 알맞은 검사는 달라질까? 어떤 규칙이 「좋은 의사 결정」을 가장 공정하게 점수화할까?',
    why:'의료영상은 기술만이 아니라 <b>상황에 맞는 선택</b>이 중요합니다. 게임으로 만들면 장단점 · 안전 · 비용의 균형을 즐겁게 배우고, 점수 규칙을 설계하며 의사 결정 과정을 구조화하는 능력이 길러집니다.',
    link:'도입(1번 탭: 검사 선택 도우미) · 7번 탭 · 확률 · 통계 · 의사결정 · 보드게임 설계.',
    fig:FIGS.C05.fig, tg:FIGS.C05.tg,
    cap:'사례 카드(왼쪽) 한 장을 뽑아 검사 카드(가운데 · 오른쪽 : X선 · CT · 초음파 · MRI)를 고른다. 질환 카드 6 장(왼쪽 아래) · 예산 한도(가운데 아래) · 점수와 비용 비교(오른쪽 아래)',
    parts:[['사례 카드','질환 · 나이 · 임신 여부 · 응급 여부','6 ~ 12 장','정확한 의학 정보를 쓰고 교사 · 의학 자료로 확인한다. 실제 환자 사례를 쓰지 않는다.'],
           ['검사 카드','X선 · CT · 초음파 · MRI','각 카드의 특성 점수','진단 가치 · 속도 · 비용 · 방사선 · 주의사항을 한 장에.'],
           ['점수 규칙','진단 가치 + 가중 × 특성','가중은 사례마다 다름','응급이면 속도 가중 ↑, 임신이면 방사선 가중 ↑.'],
           ['예산 한도','1 ~ 10 점 자원','비용 초과 시 선택 불가','자원 제약이 있어 「가장 좋은 검사」가 항상 가능한 것은 아니다.'],
           ['정답 해설','선택 이유 설명','학습 목표','왜 이 검사가 알맞은지 한 줄씩 해설을 카드 뒷면에.'],
           ['안전 · 윤리','실제 의료 판단 아님','교육용 게임','게임의 규칙은 간단화한 것임을 규칙서에 밝힌다.']],
    budget:[['카드 용지(두꺼운)','1 묶음','약 3천 원','—'],['색 펜 · 가위','1 세트','약 3천 원','—'],['주사위 · 말','1 세트','약 2천 원','—'],['규칙서 인쇄','1','보유','—'],['—','—','—','—']],
    steps:['사례 6 장 · 검사 4 장의 특성 점수표를 만든다(1번 탭 모형 참고, 교사 검토).','가중(응급 · 방사선 · 비용)을 사례별로 정하고 점수 규칙을 규칙서에 쓴다.','게임 규칙(차례 · 예산 · 점수 계산)을 정하고 시험 플레이를 한다.','친구 10 명이 해 보고 「직관과 규칙 점수가 다른 사례」를 기록해 규칙을 개선한다.','최종 규칙서 · 카드 세트 · 해설을 완성하고 발표한다.'],
    vars:['사례 · 예산 한도','검사 점수 · 순위 · 정답률','가중 규칙 · 비용 정의'],
    predict:[['골절 · 예산 6','1위 '+C05.MOD[a.best.m]+' (점수 '+fx(a.best.s,1)+')','뼈 사례는 X선이 먼저'],
             ['인대 · 예산 6','1위 '+C05.MOD[b.best.m]+' (비용 '+b.best.cost+')','연조직 정밀 = MRI'],
             ['인대 · 예산 3','1위 '+(c.best?C05.MOD[c.best.m]:'없음')+' — MRI(비용 10) 선택 불가','예산이 부족하면 차선 선택(초음파 · X선)'],
             ['응급 뇌출혈 · 예산 3','1위 '+(d.best?C05.MOD[d.best.m]:'없음 — 예산 부족(CT 비용 5)'),'응급 검사는 예산이 부족하면 문제가 된다 → 규칙 고민']],
    data:{cols:['사례','예산 4','예산 6','예산 10','1위(예산 10)'],
          rows:[1,2,3,4,5,6].map(function(k){ function nm(b){ var q=c05(k,b); return q.best? C05.MOD[q.best.m] : '선택 불가'; } return [C05.TG[k-1],nm(4),nm(6),nm(10),nm(10)]; })},
    analysis:'예산 한도별 최선 검사 표를 만들어 「예산이 부족한 경우 규칙이 현실적인가」를 점검한다. 사례 수 · 가중 변경에 따른 순위 변화(민감도 분석)를 정리하고 규칙의 한계(실제 진료는 더 많은 요인이 있음)를 서술한다.',
    special:['🎨 작품 기획서',[['작품 이름','「진단 탐정 — 가장 알맞은 눈을 찾아라」'],['표현 아이디어','탐정 콘셉트 카드 게임 + 해설 영상'],['과학 근거','검사별 원리 · 장단점 · 선량 · 비용'],['전시 구성','카드 세트 + 규칙서 + 시연 + 정답률 통계']]],
    fails:[['항상 같은 검사가 이긴다','사례 · 가중 다양화 · 예산 제약 강화'],['규칙이 복잡해 재미가 없다','계산을 단순화(점수 표 · 주사위)'],['의학적 오류','교사 · 의료인 검토 · 단순화 표시']],
    up:['<b>I09</b> — 유병률과 확률 개념 도입.','<b>C10</b> — 검사 대기열(시간 자원) 게임.','<b>7번 탭</b> — 나라별 제도 카드.'],
    next:['도입 — 네 가지 눈',1],
    eval:[['창의성','게임 설계 · 스토리'],['정확성','의학 · 물리 정보 정확성'],['공정성','규칙의 일관성'],['안전 · 윤리','교육용 표기']],
    tip:'카드 뒷면 해설에 「왜 이 검사?」를 한 줄씩 적으면 게임이 곧 학습 자료가 됩니다.' };
})();
SIMS.C05={ q:'환자 사례와 예산 한도를 바꾸면 가장 알맞은 검사는 어떻게 달라질까?',
  a:{nm:'환자 사례 번호',min:1,max:6,step:1,val:1,unit:'',d:0,fmt:pick(C05.TG)}, b:{nm:'예산 한도(자원 점수)',min:1,max:10,step:1,val:6,unit:'점',d:0},
  cap1:'검사 카드 4 장(점수 막대). 비용이 예산을 넘으면 카드가 회색으로 잠기고, 선택 가능한 것 중 1위가 초록으로 강조됩니다.',
  cap2:'📊 비용(가로) 대 점수(세로) — 점선 = 예산 한도. 한도 오른쪽 점은 선택 불가.',
  note:'모형 : 점수 = 진단 가치 + 가중(속도 · 저비용) + 방사선 없음(0.28). 비용 = X선 1 · CT 5 · 초음파 2 · MRI 10(상대 점수). 교육용 어림이며 실제 비용 · 선택과 다릅니다.',
  anim:function(ctx,w,h,t,k,bud,S){ var q=c05(k,bud), mx=Math.max.apply(null,q.r.map(function(x){ return x.s; }))*1.1, frac=Math.min(1,t/2.5), bw=Math.min(90,(w-60)/4-14), gx=(w-(4*bw+42))/2, i;
    cvText(ctx,'사례 : '+C05.TG[k-1]+' · 예산 '+bud,12,16,COL.text,'bold 12.5px system-ui,sans-serif');
    q.r.forEach(function(c,i){ var x=gx+i*(bw+14), y0=h-70, hh=(y0-44)*c.s/mx*frac, isb=q.best&&q.best.m===i; ctx.globalAlpha=c.ok?1:0.35; ctx.fillStyle=isb?COL.ok:['#fbbf24','#fb7185','#7dd3fc','#a78bfa'][i]; ctx.fillRect(x,y0-hh,bw,hh); ctx.globalAlpha=1; ctx.strokeStyle=isb?COL.ok:COL.axis2; ctx.lineWidth=isb?2.5:1; ctx.strokeRect(x,44,bw,y0-44);
      cvText(ctx,C05.MOD[i]+(isb?' ★':''),x+bw/2,y0+14,isb?COL.ok:COL.tick,'bold 12.5px system-ui,sans-serif','center'); cvText(ctx,'비용 '+c.cost+(c.ok?'':' ✖'),x+bw/2,y0+32,c.ok?COL.tick:COL.grav,'11px system-ui,sans-serif','center'); cvText(ctx,(c.s*frac).toFixed(1),x+bw/2,y0-hh-8,COL.text,'bold 11.5px system-ui,sans-serif','center'); });
    cvText(ctx,q.best?'선택 : '+C05.MOD[q.best.m]+' (예산 안에서 최선)':'예산이 부족해 선택 가능한 검사가 없음',12,h-10,q.best?COL.ok:COL.grav,'bold 12px system-ui,sans-serif'); },
  graph:function(ctx,w,h,k,bud,S){ var q=c05(k,bud), P=makePlot(ctx,w,h,{xmin:0,xmax:11,ymin:0,ymax:Math.max(16,Math.max.apply(null,q.r.map(function(x){ return x.s; }))*1.15),xlabel:'비용 (자원 점수)',ylabel:'검사 점수',title:'비용 대 점수 — 점선 오른쪽은 예산 초과',left:56,xfmt:function(v){ return v.toFixed(0); },yfmt:function(v){ return v.toFixed(0); }});
    ctx.fillStyle='rgba(251,113,133,.08)'; ctx.fillRect(P.X(bud),P.y1,P.x1-P.X(bud),P.y0-P.y1); plotLine(ctx,P,[[bud,0],[bud,100]],COL.grav,1.6,[5,4]); q.r.forEach(function(c){ plotPoints(ctx,P,[[c.cost,c.s]],c.ok?['#fbbf24','#fb7185','#7dd3fc','#a78bfa'][c.m]:COL.dim,8); cvText(ctx,C05.MOD[c.m],P.X(c.cost)+10,P.Y(c.s),c.ok?COL.text:COL.dim,'12px system-ui,sans-serif'); }); },
  kv:function(k,bud,S){ var q=c05(k,bud), s=q.r.slice().sort(function(a,b){ return b.s-a.s; }); return [['선택(예산 안)',q.best?C05.MOD[q.best.m]:'불가','a'],['점수',q.best?q.best.s.toFixed(1):'—','g'],['전체 1위',C05.MOD[s[0].m]+(s[0].ok?'':' (예산 초과)'),'v2'],['예산 초과 검사',q.r.filter(function(c){ return !c.ok; }).map(function(c){ return C05.MOD[c.m]; }).join(' · ')||'없음'],['규칙 한계','단순화 모형','r']]; } };
