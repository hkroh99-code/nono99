# -*- coding: utf-8 -*-
"""교과서형 SVG 도해 생성기 — 의료영상진단기. 색 규약 : 장치 #475569/#94a3b8 · 빔·입자 #7dd3fc/#fbbf24 ·
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

# ── 그림 1-1 : 세 가지 장면 ────────────────────────────────────────────
def flow():
    o=[panel(10,40,250,222,'① 깊이와 압력 — 잠수')]
    o.append(WATER(30,92,210,150)); o.append(L(30,92,240,92,'#7dd3fc',1.5)); o.append(T(135,86,'수면 (1기압)','#7dd3fc',10.5))
    for i,(y,l) in enumerate([(130,'2기압'),(170,'3기압'),(210,'4기압')]):
        o.append(AR(60,y,60,y+0.1,'#fbbf24',1)); 
        for dx,dy in [(-1,0),(1,0),(0,1)]: o.append(AR(135-dx*18-dy*0,y-dy*18,135-dx*5,y-dy*5,'#fbbf24',1.6))
        o.append(C(135,y,3,'#fbbf24','#fbbf24')); o.append(T(190,y+4,'p = p₀ + ρgh','#cfe0f5',10.5) if i==0 else T(190,y+4,l,'#fbbf24',11))
    o.append(panel(270,40,250,222,'② 밀폐 유체의 압력 전달 — 유압'))
    o.append(R(290,170,210,30,0,'rgba(56,189,248,.3)','none',0)); o.append(R(290,120,28,50,0,'rgba(56,189,248,.3)','none',0)); o.append(R(430,100,70,70,0,'rgba(56,189,248,.3)','none',0))
    o.append(R(288,112,32,8,2,'#e2e8f0','#e2e8f0',1)); o.append(R(428,92,74,8,2,'#e2e8f0','#e2e8f0',1)); o.append(AR(304,78,304,106,'#fbbf24',2.4)); o.append(T(330,84,'F₁ (작은 힘)','#fbbf24',10.5,'start')); o.append(AR(465,84,465,52+0,'#34d399',2.4)); o.append(T(465,48,'F₂ (큰 힘)','#34d399',11)); o.append(T(395,228,'P = F₁/A₁ = F₂/A₂ (같은 압력)','#cfe0f5',11.5)); o.append(T(395,246,'F₂ = F₁ · A₂/A₁','#34d399',12,'middle','700'))
    o.append(panel(530,40,240,222,'③ 밀어낸 유체의 무게 — 부력'))
    o.append(WATER(545,130,210,115)); o.append(L(545,130,755,130,'#7dd3fc',1.5)); o.append(R(610,108,60,50,4,'#c4a46a','#e2e8f0',1.5)); o.append(AR(640,170,640,140,'#34d399',2.4)); o.append(T(690,152,'B (부력)','#34d399',11,'start')); o.append(AR(640,108,640,128,'#fb7185',2.4)); o.append(T(690,114,'W (무게)','#fb7185',11,'start')); o.append(T(650,230,'B = ρ유체 · V잠긴 · g','#fbbf24',12,'middle','700'))
    return ''.join(o)

# ── 그림 2-1 : 정수압 ───────────────────────────────────────────────────
def hydro():
    o=[panel(10,40,250,222,'① 깊을수록 커지는 압력 (모든 방향)')]
    o.append(WATER(40,80,190,160)); o.append(L(40,80,230,80,'#7dd3fc',1.5))
    for i,y in enumerate([110,160,210]):
        n=14+i*9
        o.append(C(135,y,3,'#fbbf24','#fbbf24'))
        for dx,dy in [(-1,0),(1,0),(0,1),(0,-1)]: o.append(AR(135-dx*n,y-dy*n,135-dx*4,y-dy*4,'#fbbf24',1.6))
    o.append(L(46,80,46,240,'#34d399',1.4)); o.append(T(36,170,'h','#34d399',13,'end','700'))
    o.append(panel(270,40,250,222,'② 모양이 달라도 같은 깊이면 같은 압력'))
    for k,(x,wa,wb) in enumerate([(285,36,36),(345,56,18),(400,18,56),(450,26,26)]):
        top=90; bt=222
        o.append(P('M%g %g L%g %g L%g %g L%g %g Z'%(x+(56-wb)/2,top,x+(56-wa)/2,bt,x+(56+wa)/2,bt,x+(56+wb)/2,top),'#94a3b8',2,'rgba(56,189,248,.25)'))
    o.append(L(280,90,500,90,'#7dd3fc',1.3,'4 3')); o.append(T(395,236,'바닥 압력 p = ρgh 모두 같다','#fbbf24',12,'middle','700'))
    o.append(panel(530,40,240,222,'③ 깊이 → 압력 (직선)'))
    o.append(L(560,230,750,230,'#5b7099',1.3)); o.append(L(560,230,560,80,'#5b7099',1.3)); o.append(L(560,230,740,100,'#38bdf8',2.4)); o.append(T(650,252,'깊이 h','#9db0cc',10.5)); o.append(T(576,92,'p','#9db0cc',11)); o.append(T(690,126,'기울기 = ρg','#fbbf24',11.5,'middle','700'))
    return ''.join(o)

# ── 그림 3-1 : 파스칼 원리 ─────────────────────────────────────────────
def pascal():
    o=[panel(10,40,250,222,'① 밀폐 유체 — 압력은 사방으로 똑같이')]
    o.append(C(135,150,56,'rgba(56,189,248,.25)','#94a3b8',2)); o.append(R(118,76,34,8,2,'#e2e8f0','#e2e8f0',1)); o.append(AR(135,50+4,135,74,'#fbbf24',2.4))
    for a in range(0,360,45):
        r=math.radians(a); o.append(AR(135+30*math.cos(r),150+30*math.sin(r),135+52*math.cos(r),150+52*math.sin(r),'#7dd3fc',1.4))
    o.append(T(135,232,'한 곳에 가한 압력 → 모든 곳에 같은 크기','#cfe0f5',11))
    o.append(panel(270,40,250,222,'② 유압 잭 : F₂ = F₁ · A₂/A₁'))
    o.append(R(290,190,210,30,0,'rgba(56,189,248,.3)','none',0)); o.append(R(300,140,26,50,0,'rgba(56,189,248,.3)','none',0)); o.append(R(430,100,60,90,0,'rgba(56,189,248,.3)','none',0)); o.append(TANK(300,110,26,110)); o.append(TANK(430,80,60,140))
    o.append(R(298,132,30,7,2,'#e2e8f0','#e2e8f0',1)); o.append(R(428,92,64,7,2,'#e2e8f0','#e2e8f0',1)); o.append(R(436,60,48,32,4,'#475569','#94a3b8',1.3)); o.append(T(460,80,'짐','#cfe0f5',11)); o.append(AR(313,92,313,128,'#fbbf24',2.4)); o.append(T(313,86,'F₁','#fbbf24',11.5)); o.append(T(313,252,'A₁(작다)','#9db0cc',10.5)); o.append(T(460,252,'A₂(크다)','#9db0cc',10.5)); o.append(T(395,176,'P','#7dd3fc',13,'middle','700'))
    o.append(panel(530,40,240,222,'③ 힘은 커져도 일은 같다'))
    o.append(R(550,150,50,30,3,'#fbbf24','#fbbf24',1)); o.append(T(575,200,'F₁ × d₁','#fbbf24',11.5)); o.append(R(660,100,50,80,3,'#34d399','#34d399',1)); o.append(T(685,200,'F₂ × d₂','#34d399',11.5)); o.append(T(650,110,'=','#cfe0f5',22)); o.append(T(650,232,'큰 힘 = 짧은 거리','#cfe0f5',11.5))
    return ''.join(o)

# ── 그림 4-1 : 아르키메데스 원리 ───────────────────────────────────────
def archi():
    o=[panel(10,40,250,222,'① 위·아래 면의 압력 차이 = 부력')]
    o.append(WATER(30,80,210,162)); o.append(L(30,80,240,80,'#7dd3fc',1.5)); o.append(R(95,120,80,60,3,'#94a3b8','#e2e8f0',1.5))
    o.append(AR(135,100,135,118,'#fbbf24',1.8)); o.append(T(135,96,'위 면 : 작은 압력','#fbbf24',10.5)); o.append(AR(135,222,135,184,'#34d399',3.2)); o.append(T(135,236,'아래 면 : 큰 압력 → 위로 B','#34d399',10.5))
    o.append(panel(270,40,250,222,'② 겉보기 무게 = W − B'))
    o.append(R(300,60,48,80,4,'#0b1424','#94a3b8',1.4)); o.append(T(324,160,'공기 중','#9db0cc',10.5)); o.append(R(318,150,12,30,2,'#94a3b8','#94a3b8',1)); o.append(T(324,196,'W','#fb7185',12))
    o.append(R(410,60,48,80,4,'#0b1424','#94a3b8',1.4)); o.append(WATER(375,170,120,70)); o.append(R(425,172,18,26,2,'#94a3b8','#e2e8f0',1)); o.append(T(434,152,'물속','#9db0cc',10.5)); o.append(T(434,256,'W − B (가벼워진다)','#34d399',10.5))
    o.append(panel(530,40,240,222,'③ 밀어낸 물의 무게 = 부력'))
    o.append(WATER(550,170,100,70)); o.append(R(580,164,30,36,3,'#94a3b8','#e2e8f0',1.5)); o.append(R(660,200,50,50,3,'rgba(56,189,248,.28)','#7dd3fc',1.5)); o.append(T(685,236,'넘친 물','#7dd3fc',10.5)); o.append(T(650,120,'B = ρ유체 V잠긴 g','#fbbf24',12,'middle','700')); o.append(T(650,142,'= 넘친(밀어낸) 물의 무게','#cfe0f5',11))
    return ''.join(o)

# ── 그림 5-1 : 배 ────────────────────────────────────────────────────────
def ship():
    o=[panel(10,40,250,222,'① 평균 밀도가 물보다 작으면 뜬다')]
    o.append(WATER(30,150,210,92)); o.append(L(30,150,240,150,'#7dd3fc',1.5)); o.append(C(70,205,16,'#94a3b8','#e2e8f0',1.5)); o.append(T(70,238,'쇠공 ρ 7800','#cfe0f5',10)); o.append(P('M120 128 L130 150 L220 150 L232 128 Z','#94a3b8',1.6,'rgba(148,163,184,.55)')); o.append(T(176,120,'쇠로 만든 배','#cfe0f5',10.5)); o.append(T(135,100,'평균 밀도 = 질량 ÷ 전체 부피','#fbbf24',11,'middle','700'))
    o.append(panel(270,40,250,222,'② 안정 : 기울면 바로 세우는 힘'))
    o.append(WATER(290,150,210,92)); o.append(P('M340 118 L350 156 L440 156 L450 118 Z','#94a3b8',1.6,'rgba(148,163,184,.5)')); o.append(C(395,140,5,'#fb7185','#fb7185')); o.append(T(412,138,'G','#fb7185',11,'start')); o.append(C(395,160,5,'#34d399','#34d399')); o.append(T(412,168,'B','#34d399',11,'start')); o.append(C(395,100,4,'#fbbf24','#fbbf24')); o.append(T(412,98,'M','#fbbf24',11,'start')); o.append(T(395,236,'M 이 G 위 (GM>0) → 안정','#cfe0f5',11))
    o.append(panel(530,40,240,222,'④ 만재흘수선 : 과적 방지'))
    o.append(P('M560 120 L575 200 L725 200 L740 120 Z','#94a3b8',1.6,'rgba(148,163,184,.45)')); o.append(WATER(545,168,210,72)); o.append(L(545,168,755,168,'#7dd3fc',1.4)); o.append(C(648,176,10,'none','#fbbf24',1.6)); o.append(L(636,176,660,176,'#fbbf24',1.6)); o.append(T(690,180,'담수선','#fbbf24',10)); o.append(T(648,232,'해수 · 담수 · 계절별 표시','#cfe0f5',10.5))
    return ''.join(o)

# ── 그림 6-1 : 측정 ─────────────────────────────────────────────────────
def measure():
    o=[panel(10,40,250,222,'① 공기 중에서 저울 읽기 m')]
    o.append(R(80,70,110,26,4,'#475569','#94a3b8',1.3)); o.append(T(135,88,'390.0 g','#fbbf24',13,'middle','700')); o.append(L(135,96,135,150,'#94a3b8',1.4)); o.append(R(112,150,46,46,4,'#94a3b8','#e2e8f0',1.5)); o.append(T(135,222,'m = ρ물체 · V','#cfe0f5',11.5))
    o.append(panel(270,40,250,222,'② 물속에서 저울 읽기 m′'))
    o.append(R(340,70,110,26,4,'#475569','#94a3b8',1.3)); o.append(T(395,88,'340.0 g','#fbbf24',13,'middle','700')); o.append(L(395,96,395,160,'#94a3b8',1.4)); o.append(WATER(320,150,150,92)); o.append(L(320,150,470,150,'#7dd3fc',1.4)); o.append(R(372,170,46,46,4,'#94a3b8','#e2e8f0',1.5)); o.append(T(395,252,'m′ = m − ρ물 V','#cfe0f5',11.5))
    o.append(panel(530,40,240,222,'③ 밀도 계산과 오차'))
    o.append(T(650,100,'ρ = ρ물 · m / (m − m′)','#fbbf24',13,'middle','700')); o.append(T(650,132,'m − m′ = ρ물 V (작은 차이)','#cfe0f5',11)); o.append(T(650,156,'→ 읽기 오차가 크게 증폭','#fb7185',11)); o.append(T(650,196,'ρ물(T) : 온도 보정','#7dd3fc',11)); o.append(T(650,228,'안전 : 뜨거운 물 · 미끄러움 주의','#9db0cc',10.5))
    return ''.join(o)

# ── 그림 7-1 : 활용 현황 ───────────────────────────────────────────────
def eco():
    o=[]
    cards=[('한국','건설기계(유압) · 조선 · 해양 R&D','해양과학기술원 「해미래」(6,000 m급 무인잠수정)','HD한국조선해양 등 조선 3사'),
           ('미국','건설기계 · 심해 연구 · 해군','WHOI 「앨빈」(6,500 m급, 2021 개량)','Caterpillar(건설기계 세계 1위권)'),
           ('일본','건설기계 · 선박 · 심해 연구','JAMSTEC 「신카이 6500」(1989년 건조)','Komatsu · 히타치건기 · 고베제강')]
    for i,(c,a,b,d) in enumerate(cards):
        ox=12+256*i
        o.append(R(ox,40,244,206,9,'#0b1424','#3d5480',1.3)); o.append(T(ox+122,66,c,'#cfe0f5',15,'middle','700'))
        o.append(T(ox+122,100,'🏗 유압 · 건설기계','#fbbf24',11.5)); o.append(T(ox+122,120,d,'#cfe0f5',10.5))
        o.append(T(ox+122,152,'🌊 심해 · 해양','#7dd3fc',11.5)); o.append(T(ox+122,172,b,'#cfe0f5',10))
        o.append(T(ox+122,204,'🛟 안전 · 규정','#34d399',11.5)); o.append(T(ox+122,224,'구명 장비 · 선박 만재흘수선 · 압력용기 규정','#cfe0f5',9.5))
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
