# -*- coding: utf-8 -*-
"""교과서형 SVG 도해 생성기 — 베르누이 원리. 색 규약 : 장치 #475569/#94a3b8 · 빔·입자 #7dd3fc/#fbbf24 ·
   정답 #34d399 · 경고 #fb7185 · 치수 #a78bfa · 눈금 #3d5480"""
import math
DEV='fill="#475569" stroke="#94a3b8" stroke-width="1.3"'

def T(x,y,s,c='#cfe0f5',sz=12,anc='middle',w=None):
    return '<text x="%g" y="%g" fill="%s" font-size="%g" text-anchor="%s"%s>%s</text>'%(x,y,c,sz,anc,(' font-weight="%s"'%w if w else ''),s)
def L(x1,y1,x2,y2,c='#94a3b8',w=1.2,dash=None):
    return '<path d="M%g %g L%g %g" stroke="%s" stroke-width="%g"%s/>'%(x1,y1,x2,y2,c,w,(' stroke-dasharray="%s"'%dash if dash else ''))
def P(d,c='#94a3b8',w=1.3,f='none',dash=None):
    return '<path d="%s" stroke="%s" stroke-width="%g" fill="%s"%s/>'%(d,c,w,f,(' stroke-dasharray="%s"'%dash if dash else ''))
def R(x,y,w,h,rx=4,f='#475569',s='#94a3b8',sw=1.3):
    return '<rect x="%g" y="%g" width="%g" height="%g" rx="%g" fill="%s" stroke="%s" stroke-width="%g"/>'%(x,y,w,h,rx,f,s,sw)
def C(cx,cy,r,f='none',s='#94a3b8',sw=1.3):
    return '<circle cx="%g" cy="%g" r="%g" fill="%s" stroke="%s" stroke-width="%g"/>'%(cx,cy,r,f,s,sw)
def E(cx,cy,rx,ry,f='none',s='#94a3b8',sw=1.3):
    return '<ellipse cx="%g" cy="%g" rx="%g" ry="%g" fill="%s" stroke="%s" stroke-width="%g"/>'%(cx,cy,rx,ry,f,s,sw)
def AR(x1,y1,x2,y2,c='#fbbf24',w=2):
    dx,dy=x2-x1,y2-y1; n=math.hypot(dx,dy) or 1; ux,uy=dx/n,dy/n
    return L(x1,y1,x2,y2,c,w)+'<path d="M%g %g L%g %g L%g %g Z" fill="%s"/>'%(x2,y2,x2-ux*9-uy*4.5,y2-uy*9+ux*4.5,x2-ux*9+uy*4.5,y2-uy*9-ux*4.5,c)
def panel(x,y,w,h,title):
    return R(x,y,w,h,9,'#0b1424','#3d5480',1.3)+T(x+w/2,y+20,title,'#cfe0f5',13,'middle','700')

def WATER(x,y,w,h,a=0.28):
    return R(x,y,w,h,0,'rgba(56,189,248,%g)'%a,'none',0)
def TANK(x,y,w,h,col='#94a3b8'):
    return P('M%g %g V%g H%g V%g'%(x,y,y+h,x+w,y),col,2.2)
def GAUGE(cx,cy,r=18,v=0.6):
    a=-2.4+3.4*v
    return C(cx,cy,r,'#0b1424','#94a3b8',1.6)+L(cx,cy,cx+r*0.8*math.cos(a),cy+r*0.8*math.sin(a),'#fb7185',2)

# 공용 부품
def AIRFOIL(cx,cy,w=120,t=16,ang=0,fill='rgba(148,163,184,.55)'):
    d='M%g %g C%g %g %g %g %g %g C%g %g %g %g %g %g Z'%(cx-w/2,cy, cx-w/2+8,cy-t*1.3, cx+w*0.1,cy-t*1.2, cx+w/2,cy+1, cx+w*0.1,cy+t*0.35, cx-w/2+10,cy+t*0.6, cx-w/2,cy)
    return '<g transform="rotate(%g %g %g)">%s</g>'%(-ang,cx,cy,P(d,'#e2e8f0',1.6,fill))
def STREAM(pts,c='#7dd3fc',w=1.3):
    return P('M'+' L'.join('%g %g'%p for p in pts),c,w)
def PIPE(x,y,w,h1,h2,hm=None,col='#94a3b8'):
    """수평 벤투리관 : 왼쪽 높이 h1, 가운데 목 h2, 오른쪽 h1. 중심선 y"""
    hm=h2 if hm is None else hm
    top=P('M%g %g L%g %g L%g %g L%g %g L%g %g'%(x,y-h1/2,x+w*0.3,y-h1/2,x+w*0.45,y-hm/2,x+w*0.55,y-hm/2,x+w*0.7,y-h1/2)+' L%g %g'%(x+w,y-h1/2),col,2.2)
    bot=P('M%g %g L%g %g L%g %g L%g %g L%g %g'%(x,y+h1/2,x+w*0.3,y+h1/2,x+w*0.45,y+hm/2,x+w*0.55,y+hm/2,x+w*0.7,y+h1/2)+' L%g %g'%(x+w,y+h1/2),col,2.2)
    fl=P('M%g %g L%g %g L%g %g L%g %g L%g %g L%g %g L%g %g L%g %g L%g %g L%g %g Z'%(x,y-h1/2,x+w*0.3,y-h1/2,x+w*0.45,y-hm/2,x+w*0.55,y-hm/2,x+w*0.7,y-h1/2,x+w,y-h1/2,x+w,y+h1/2,x+w*0.7,y+h1/2,x+w*0.55,y+hm/2,x+w*0.45,y+hm/2)+' L%g %g L%g %g Z'%(x+w*0.3,y+h1/2,x,y+h1/2),'none',0,'rgba(56,189,248,.18)')
    return fl+top+bot

# ── 그림 1-1 : 세 가지 장면 ────────────────────────────────────────────
def flow():
    o=[panel(10,40,250,222,'① 날개 — 위가 빠르고 압력이 낮다')]
    o.append(AIRFOIL(135,150,130,20,6))
    for k,(y0,dy) in enumerate([(100,-0),(116,-0),(190,0),(206,0)]):
        top=(y0<150)
        pts=[(24,y0),(70,y0),(100,y0-(26 if top else -10)*0.6),(135,y0-(34 if top else -14)*0.6),(170,y0-(24 if top else -8)*0.6),(215,y0),(246,y0)]
        o.append(STREAM(pts,'#7dd3fc',1.3))
    o.append(AR(135,118,135,92,'#34d399',2.4)); o.append(T(135,84,'압력 작음 · 빠름','#34d399',10.5)); o.append(AR(135,222,135,190,'#fbbf24',2.0)); o.append(T(135,238,'압력 큼 · 느림 → 양력 L ↑','#fbbf24',10.5))
    o.append(panel(270,40,250,222,'② 좁은 관 — 속력 ↑ 압력 ↓'))
    o.append(PIPE(284,150,222,70,34)); o.append(AR(292,150,326,150,'#7dd3fc',1.6)); o.append(AR(380,150,430,150,'#fbbf24',3)); o.append(T(330,198,'느림 · 압력 큼','#9db0cc',10)); o.append(T(395,214,'빠름 · 압력 작음','#34d399',10.5,'middle','700'))
    o.append(P('M310 108 V86','#94a3b8',2)); o.append(P('M395 118 V98','#94a3b8',2)); o.append(T(395,80,'목','#9db0cc',10)); o.append(T(310,80,'p₁','#9db0cc',10.5))
    o.append(panel(530,40,240,222,'③ 회전하는 공 — 옆으로 휜다'))
    o.append(C(650,150,22,'#e2e8f0','#94a3b8',1.5)); o.append(P('M635 142 Q650 132 665 142','#fb7185',1.4)); o.append(P('M628 160 Q650 172 672 160','#fb7185',1.4))
    o.append(AR(560,120,616,132,'#7dd3fc',1.6)); o.append(AR(560,184,616,172,'#7dd3fc',1.6)); o.append(AR(650,128,650,84,'#34d399',3)); o.append(T(650,76,'휘는 힘(마그누스)','#34d399',11)); o.append(T(650,228,'회전 → 양쪽 속력 차 → 압력 차','#cfe0f5',10.5))
    return ''.join(o)

# ── 그림 2-1 : 연속 방정식 ──────────────────────────────────────────────
def hydro():
    o=[panel(10,40,250,222,'① 호스 끝을 좁히면 물이 빨라진다')]
    o.append(P('M30 170 L150 170 L190 160 L240 156','#94a3b8',3)); o.append(P('M30 190 L150 190 L190 178 L240 172','#94a3b8',3)); o.append(WATER(30,171,160,18,0.3))
    o.append(AR(60,180,90,180,'#7dd3fc',1.8)); o.append(AR(205,166,244,150,'#fbbf24',3)); o.append(P('M246 148 Q262 128 270 150','#7dd3fc',1.6)); o.append(T(135,226,'A 작게 → v 크게','#cfe0f5',11))
    o.append(panel(270,40,250,222,'② 단면적 A 와 속력 v'))
    o.append(PIPE(284,150,222,80,36)); o.append(T(310,100,'A₁ , v₁','#9db0cc',11)); o.append(T(395,128,'A₂ , v₂','#34d399',11)); o.append(AR(292,150,332,150,'#7dd3fc',1.6)); o.append(AR(366,150,424,150,'#fbbf24',3)); o.append(T(395,214,'A₁v₁ = A₂v₂','#fbbf24',13,'middle','700'))
    o.append(panel(530,40,240,222,'③ 유량 Q = Av 는 어디서나 같다'))
    for i,(y,w,n) in enumerate([(100,70,2),(140,34,4),(180,16,8)]):
        o.append(R(580,y-w/2,60,w,3,'rgba(56,189,248,.25)','#94a3b8',1.3)); o.append(T(560,y+4,'A','#9db0cc',10,'end')); o.append(T(690,y+4,'v ×%d'%n,'#fbbf24',11,'start')); o.append(AR(650,y,680,y,'#fbbf24',1.6+i*0.5))
    o.append(T(650,238,'면적 ↓ → 속력 ↑ (유량 같음)','#cfe0f5',10.5))
    return ''.join(o)

# ── 그림 3-1 : 베르누이 방정식 ───────────────────────────────────────────
def pascal():
    o=[panel(10,40,250,222,'① 벤투리 관과 압력 관 (마노미터)')]
    o.append(PIPE(24,170,222,60,28))
    o.append(P('M60 140 V96','#94a3b8',2)); o.append(R(52,108,16,32,0,'rgba(56,189,248,.35)','none',0)); o.append(P('M135 156 V118','#94a3b8',2)); o.append(R(127,132,16,24,0,'rgba(56,189,248,.35)','none',0))
    o.append(T(60,88,'h₁ 큼','#9db0cc',10)); o.append(T(135,110,'h₂ 작음','#34d399',10)); o.append(AR(32,170,52,170,'#7dd3fc',1.5)); o.append(AR(106,170,164,170,'#fbbf24',2.6)); o.append(T(135,234,'좁은 곳 : 속력 ↑ → 수주(압력) ↓','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 에너지 보존 : p + ½ρv² + ρgz'))
    for k,(x,p,v,z) in enumerate([(300,0.62,0.2,0.18),(400,0.28,0.66,0.06)]):
        o.append(R(x,214-p*130,22,p*130,1,'#38bdf8','none',0)); o.append(R(x+24,214-p*130-v*130,22,v*130,1,'#fbbf24','none',0)); 
        o.append(R(x+24,214-p*130-v*130-z*130,22,z*130,1,'#34d399','none',0))
        o.append(R(x,214-(p+v+z)*130,0.1,0.1,0,'none','none',0))
    o.append(L(290,214,500,214,'#5b7099',1.3)); o.append(L(290,214-1.0*130,500,214-1.0*130,'#a78bfa',1.2,'4 3')); o.append(T(330,232,'점 1 (넓은 곳)','#9db0cc',10)); o.append(T(432,232,'점 2 (목)','#9db0cc',10)); o.append(T(515,84,'합계 일정','#a78bfa',10,'end'))
    o.append(T(300,56+12,'■ 압력  ■ 운동  ■ 위치','#cfe0f5',10,'start'))
    o.append(panel(530,40,240,222,'③ 종이 두 장 사이로 불기'))
    o.append(P('M610 100 Q618 150 612 200','#e2e8f0',2.4)); o.append(P('M690 100 Q682 150 688 200','#e2e8f0',2.4)); o.append(AR(650,92,650,196,'#7dd3fc',2.6)); o.append(AR(578,150,606,150,'#fbbf24',1.8)); o.append(AR(722,150,694,150,'#fbbf24',1.8)); o.append(T(650,228,'사이 : 빠름 → 압력 ↓ → 서로 모인다','#cfe0f5',10))
    return ''.join(o)

# ── 그림 4-1 : 양력과 날개 ──────────────────────────────────────────────
def archi():
    o=[panel(10,40,250,222,'① 날개 둘레의 흐름')]
    o.append(AIRFOIL(135,150,130,20,8))
    for dy in (-46,-30,-14,26,42,58):
        pts=[(26,150+dy),(70,150+dy),(100,150+dy*(0.5 if dy<0 else 0.9)),(135,150+dy*(0.35 if dy<0 else 0.9)),(172,150+dy*(0.55 if dy<0 else 0.95)),(220,150+dy+(14 if dy<0 else 4)),(246,150+dy+(18 if dy<0 else 5))]
        o.append(STREAM(pts,'#7dd3fc',1.2))
    o.append(T(135,236,'공기가 아래로 꺾인다 (내리흐름)','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 압력 분포 = 양력'))
    o.append(AIRFOIL(395,160,130,20,5))
    for x in (350,375,400,425,450):
        o.append(AR(x,142,x,118,'#34d399',1.8))
    for x in (360,395,430): o.append(AR(x,190,x,172,'#fbbf24',1.5))
    o.append(AR(395,160,395,80,'#fb7185',3.2)); o.append(T(420,92,'양력 L','#fb7185',12,'start','700')); o.append(AR(395,160,395,224,'#a78bfa',2.4)); o.append(T(420,226,'무게 W','#a78bfa',11,'start'))
    o.append(panel(530,40,240,222,'③ 받음각 α 와 양력 계수'))
    o.append(L(560,230,750,230,'#5b7099',1.3)); o.append(L(560,230,560,80,'#5b7099',1.3)); o.append(P('M560 200 L650 110 Q672 98 690 112 L740 160','#38bdf8',2.4)); o.append(T(690,100,'실속','#fb7185',11,'middle','700')); o.append(T(655,250,'α (받음각)','#9db0cc',10.5)); o.append(T(574,92,'C_L','#9db0cc',11))
    return ''.join(o)

# ── 그림 5-1 : 응용 ──────────────────────────────────────────────────────
def ship():
    o=[panel(10,40,250,222,'① 피토관 — 속도계')]
    o.append(P('M60 150 H168 V120 H212','#94a3b8',3)); o.append(P('M60 160 H160 V190 H204','#94a3b8',3)); o.append(C(214,120,4,'#fbbf24','none',0)); o.append(R(150,118,30,16,2,'#0b1424','#94a3b8',1)); o.append(T(165,130,'Δp','#fbbf24',10,'middle'))
    o.append(AR(24,128,60,128,'#7dd3fc',1.8)); o.append(AR(24,148,60,148,'#7dd3fc',1.8)); o.append(T(80,108,'전압(정체)','#fbbf24',10,'start')); o.append(T(80,214,'정압(옆 구멍)','#9db0cc',10,'start')); o.append(T(135,238,'Δp = ½ρv² → v = √(2Δp/ρ)','#cfe0f5',10.5))
    o.append(panel(270,40,250,222,'② 벤투리 유량계'))
    o.append(PIPE(284,160,222,64,30)); o.append(P('M312 128 V98','#94a3b8',2)); o.append(P('M395 146 V114','#94a3b8',2)); o.append(R(307,108,10,20,0,'rgba(56,189,248,.35)','none',0)); o.append(R(390,128,10,18,0,'rgba(56,189,248,.35)','none',0)); o.append(L(300,108,340,108,'#fbbf24',1,'3 3')); o.append(T(430,110,'Δp 읽기','#fbbf24',10,'start')); o.append(T(395,214,'Q = Cd A₂ √(2Δp/ρ(1−β⁴))','#cfe0f5',10.5))
    o.append(panel(530,40,240,222,'③ 분무기 · 토리첼리'))
    o.append(P('M560 200 H590 V120','#94a3b8',3)); o.append(R(560,152,30,48,0,'rgba(56,189,248,.35)','none',0)); o.append(P('M590 120 H660','#94a3b8',3)); o.append(AR(700,126,640,120,'#fbbf24',2.2)); o.append(T(700,108,'빠른 공기','#fbbf24',10)); o.append(T(610,100,'압력 ↓ → 액체 상승','#34d399',10,'start'))
    o.append(R(660,170,64,70,0,'rgba(56,189,248,.28)','none',0)); o.append(P('M660 130 V240 H724 V130','#94a3b8',2)); o.append(JET(724,205,760,236)); o.append(T(680,252,'v = √(2gh)','#cfe0f5',10.5))
    return ''.join(o)
def JET(x0,y0,x1,y1,col='#7dd3fc'): return P('M%g %g Q%g %g %g %g'%(x0,y0,(x0+x1)/2+8,y0-6,x1,y1),col,2)

# ── 그림 6-1 : 적용 한계 ────────────────────────────────────────────────
def measure():
    o=[panel(10,40,250,222,'① 같은 유선 · 정상 흐름')]
    o.append(STREAM([(24,110),(100,104),(180,120),(246,112)],'#7dd3fc',1.6)); o.append(STREAM([(24,150),(100,150),(180,150),(246,150)],'#38bdf8',1.6)); o.append(C(70,106,4,'#fbbf24','none',0)); o.append(C(190,119,4,'#fbbf24','none',0)); o.append(T(70,92,'점 1','#fbbf24',10)); o.append(T(190,138,'점 2','#fbbf24',10))
    o.append(T(135,186,'같은 유선 위의 두 점에만 적용','#cfe0f5',10.5)); o.append(T(135,204,'정상 · 비점성 · 비압축성','#9db0cc',10.5)); o.append(T(135,238,'펌프 · 마찰 · 소용돌이 → 보정 필요','#fb7185',10))
    o.append(panel(270,40,250,222,'② 층류에서 난류로 (Re)'))
    o.append(STREAM([(284,100),(380,100),(506,100)],'#7dd3fc',1.6)); o.append(STREAM([(284,118),(380,118),(506,118)],'#7dd3fc',1.6)); o.append(T(395,86,'층류 Re < 약 2300 (관)','#34d399',10.5))
    o.append(STREAM([(284,170),(330,176),(380,162),(430,180),(470,166),(506,176)],'#fbbf24',1.5)); o.append(STREAM([(284,194),(340,186),(390,200),(440,188),(506,198)],'#fbbf24',1.5)); o.append(T(395,224,'난류 Re > 약 4000 — 에너지 손실 ↑','#fbbf24',10.5)); o.append(T(395,244,'Re = ρvD/μ','#cfe0f5',11,'middle','700'))
    o.append(panel(530,40,240,222,'③ 압축성 : 마하 0.3 이상'))
    o.append(L(560,230,750,230,'#5b7099',1.3)); o.append(L(560,230,560,80,'#5b7099',1.3)); o.append(P('M560 228 Q640 222 690 190 T750 100','#fb7185',2.4)); o.append(L(626,230,626,200,'#a78bfa',1.2,'3 3')); o.append(T(626,246,'M 0.3','#a78bfa',10)); o.append(T(655,110,'오차 ≈ M²/4','#fb7185',11,'middle','700')); o.append(T(574,92,'오차','#9db0cc',11))
    return ''.join(o)

# ── 그림 7-1 : 활용 현황 ───────────────────────────────────────────────
def eco():
    o=[]
    cards=[('한국','항공 · 철도 · 자동차 공력','KF-21(2022 첫 비행) · KTX · Ioniq 6(Cd 0.21)','KARI(1989 설립) 풍동 · 누리호'),
           ('미국','항공 · 우주 · 스포츠 과학','NASA · FAA · 보잉 · 라이트 형제(1903)','풍동 · 전산유체(CFD) · 풍력 터빈'),
           ('일본','철도 · 항공 · 자동차','신칸센 500계(1997) 코 · JAXA · HondaJet','터널 미기압파 · 풍동 시험')]
    for i,(c,a,b,d) in enumerate(cards):
        ox=12+256*i
        o.append(R(ox,40,244,206,9,'#0b1424','#3d5480',1.3)); o.append(T(ox+122,66,c,'#cfe0f5',15,'middle','700'))
        o.append(T(ox+122,100,'✈ 분야','#fbbf24',11.5)); o.append(T(ox+122,120,a,'#cfe0f5',10.5))
        o.append(T(ox+122,152,'🏭 대표 사례','#7dd3fc',11.5)); o.append(T(ox+122,172,b,'#cfe0f5',9.5))
        o.append(T(ox+122,204,'🔬 시험 · 연구','#34d399',11.5)); o.append(T(ox+122,224,d,'#cfe0f5',9.5))
    return ''.join(o)

PLACE={'flow':flow,'hydro':hydro,'pascal':pascal,'archi':archi,'ship':ship,'measure':measure,'eco':eco}

def workflow(kind):
    """공방 안내 도해 : 6단계 흐름 (kind = RE · CR · IN). viewBox 780×262"""
    W={'RE':[('① 질문','🎯','측정할 수 있는 한 문장'),('② 선행 연구','📚','이미 아는 것 · 모르는 것'),('③ 예측','🔮','모의실험으로 먼저 예측'),
             ('④ 실험','🧪','3 회 이상 반복'),('⑤ 분석','📈','그래프 · 오차 · 통계'),('⑥ 발표','🎤','소논문 · 포스터')],
       'CR':[('① 영감','👀','관찰 · 자연 · 이야기'),('② 스케치','✏️','아이디어를 그림으로'),('③ 시제품','🛠','가장 작은 것부터'),
             ('④ 시험','🧪','시험해 보기'),('⑤ 전시','🖼','보여 주기 · 공연'),('⑥ 성찰','💬','무엇이 달랐나')],
       'IN':[('① 문제','❓','불편 · 실패 찾기'),('② 아이디어','💡','SCAMPER 로 바꿔 보기'),('③ 설계','📐','계산 · 시뮬레이션'),
             ('④ 시제품','🔧','작게 만들기'),('⑤ 성능 시험','📊','숫자로 증명'),('⑥ 명세서','📝','새로운 점 · 한계')]}[kind]
    o=[]
    for i,(t,ic,c) in enumerate(W):
        ox=12+128*i
        o.append('<rect x="%d" y="40" width="116" height="160" rx="9" fill="#0b1424" stroke="#3d5480" stroke-width="1.3"/>'%ox)
        o.append('<text x="%d" y="64" fill="#cfe0f5" font-size="13" font-weight="700" text-anchor="middle">%s</text>'%(ox+58,t))
        o.append('<text x="%d" y="128" font-size="38" text-anchor="middle">%s</text>'%(ox+58,ic))
        o.append('<text x="%d" y="182" fill="#9db0cc" font-size="10.5" text-anchor="middle">%s</text>'%(ox+58,c))
        if i<5:
            x=ox+116
            o.append('<path d="M%d 120 H%d" stroke="#fbbf24" stroke-width="1.6"/><path d="M%d 116 L%d 120 L%d 124 Z" fill="#fbbf24"/>'%(x+1,x+10,x+7,x+11,x+7))
    o.append('<path d="M70 214 Q390 250 710 214" stroke="#34d399" stroke-width="1.4" fill="none" stroke-dasharray="4 4"/><path d="M66 218 L70 211 L76 217 Z" fill="#34d399"/>')
    o.append('<text x="390" y="246" fill="#7ee0a8" font-size="11.5" text-anchor="middle">되돌아가 고친다 — 실패한 데이터도 기록한다</text>')
    return ''.join(o)

PLACE.update({'wf_re':lambda: workflow('RE'),'wf_cr':lambda: workflow('CR'),'wf_in':lambda: workflow('IN')})
