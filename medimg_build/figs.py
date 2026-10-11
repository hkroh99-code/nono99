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
def head(cx,cy,r=22):
    """머리 단면(타원 + 뇌 + 뼈)"""
    return E(cx,cy,r*0.85,r,'rgba(56,189,248,.05)','#94a3b8',1.5)+E(cx,cy,r*0.72,r*0.87,'rgba(148,163,184,.12)','#cbd5e1',1.2)+E(cx,cy,r*0.18,r*0.4,'#0b1424','#5b7099',1)

# ── 그림 1-1 : 네 가지 영상 장비 ────────────────────────────────────────
def flow():
    o=[]
    mods=[('① X선','X선이 몸을 통과한 세기','뼈 · 폐 · 응급 선별'),('② CT','여러 각도 X선 → 단면 재구성','뇌출혈 · 폐 · 복부'),
          ('③ 초음파','소리의 반사 시간 · 세기','태아 · 심장 · 복부'),('④ MRI','자기장 속 수소 핵의 공명','뇌 · 척추 · 인대')]
    for i,(t,a,b) in enumerate(mods):
        ox=12+192*i; cx=ox+90
        o.append(R(ox,40,180,206,9,'#0b1424','#3d5480',1.3)); o.append(T(cx,62,t,'#cfe0f5',14,'middle','700'))
        if i==0:   # X선 : 선원 → 몸 → 검출기
            o.append(C(cx,84,5,'#fbbf24','#fbbf24')); o.append(P('M%g 88 L%g 160 L%g 160 Z'%(cx,cx-38,cx+38),'#fbbf24',1,'rgba(251,191,36,.12)'))
            o.append(E(cx,122,30,18,'rgba(251,113,133,.15)','#94a3b8')); o.append(R(cx-6,114,12,16,2,'#e2e8f0','#e2e8f0',1)); o.append(R(cx-42,164,84,8,2,'#34d399','#34d399',1))
        elif i==1: # CT : 링 + 몸
            o.append(C(cx,126,48,'none','#5b7099',1.4)); o.append(C(cx,126,24,'rgba(148,163,184,.14)','#94a3b8',1.4)); o.append(R(cx-6,73,12,10,2,'#fbbf24','#fbbf24',1)); o.append(R(cx-14,169,28,8,2,'#34d399','#34d399',1))
            o.append(P('M%g 83 L%g 169 L%g 169 Z'%(cx,cx-14,cx+14),'#fbbf24',1,'rgba(251,191,36,.10)')); o.append(P('M%g 92 A40 40 0 0 1 %g 108'%(cx+34,cx+44),'#a78bfa',1.3))
        elif i==2: # 초음파 : 탐촉자 + 에코 호
            o.append(R(cx-16,76,32,14,3,'#475569','#94a3b8')); o.append(R(cx-60,92,120,70,6,'rgba(148,163,184,.10)','#5b7099',1.2))
            for k in (1,2,3): o.append(P('M%g %g A%g %g 0 0 0 %g %g'%(cx-12*k,96+8*k,14*k,14*k,cx+12*k,96+8*k),'#7dd3fc',1.4,'none'))
            o.append(E(cx+22,140,12,8,'rgba(251,113,133,.25)','#fb7185'))
        else:      # MRI : 자석 통 + 환자
            o.append(R(cx-62,92,124,70,16,'#475569','#94a3b8',1.5)); o.append(R(cx-50,106,100,42,8,'#0b1424','#5b7099',1.2)); o.append(E(cx,127,26,8,'rgba(148,163,184,.25)','#cbd5e1',1.2))
            o.append(AR(cx-40,84,cx+40,84,'#34d399',1.8)); o.append(T(cx,76,'B₀','#34d399',11,'middle','700'))
        o.append(T(cx,196,a,'#9db0cc',10.5)); o.append(T(cx,220,b,'#fbbf24',11,'middle','700'))
    return ''.join(o)

# ── 그림 2-1 : X선 감약 ────────────────────────────────────────────────
def xray():
    o=[panel(10,40,250,222,'① 투영 : 몸 뒤의 그림자')]
    o.append(C(135,78,5,'#fbbf24','#fbbf24')); o.append(P('M135 82 L60 190 L210 190 Z','#fbbf24',1,'rgba(251,191,36,.10)'))
    o.append(R(95,118,80,40,6,'rgba(251,113,133,.14)','#94a3b8',1.3)); o.append(R(125,128,20,22,3,'#e2e8f0','#e2e8f0',1)); o.append(T(135,170,'살 · 뼈','#9db0cc',10.5))
    o.append(R(55,196,160,8,2,'#34d399','#34d399',1)); o.append(R(55,196,160,8,2,'none','#34d399')); o.append(R(122,196,26,8,2,'#0f172a','#0f172a',1)); o.append(T(135,222,'뼈 뒤 = 도달 적음 (그림자)','#cfe0f5',11)); o.append(T(135,238,'도달 세기 = I₀ e^(−μx)','#fbbf24',11.5,'middle','700'))
    o.append(panel(270,40,250,222,'② 두께가 2배면 세기는 제곱으로'))
    pts=' '.join('%g,%g'%(300+x*190/6, 210-150*math.exp(-0.55*x)) for x in [i*0.25 for i in range(25)])
    o.append(L(300,210,500,210,'#5b7099',1.3)); o.append(L(300,210,300,70,'#5b7099',1.3)); o.append('<polyline points="%s" fill="none" stroke="#38bdf8" stroke-width="2.2"/>'%pts)
    o.append(T(400,230,'조직 두께 x','#9db0cc',10.5)); o.append(T(290,140,'I','#9db0cc',11,'end')); o.append(T(450,100,'지수적으로 줄어든다','#38bdf8',11)); o.append(L(300,135,412,135,'#a78bfa',1,'3 3')); o.append(T(430,150,'반가층(HVL)','#a78bfa',10.5))
    o.append(panel(530,40,240,222,'③ 에너지가 높으면 투과 ↑'))
    o.append(L(556,210,752,210,'#5b7099',1.3)); o.append(L(556,210,556,70,'#5b7099',1.3))
    a=' '.join('%g,%g'%(560+i*10, 80+ (i*i*0.0)+ 120*(1-1/(1+ (30/(25+i*5))**3*8))) for i in range(18))
    for col,k,lab in (('#fb7185',9,'뼈'),('#34d399',2.2,'연조직')):
        pts=' '.join('%g,%g'%(560+i*10.5, 200-130*(1-math.exp(-0.18*i))/(1+k*0.0)* (1/(1+k*math.exp(-0.28*i)))) for i in range(18))
        o.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2.2"/>'%(pts,col))
    o.append(T(655,230,'X선 에너지(kVp) →','#9db0cc',10.5)); o.append(T(740,120,'연조직','#34d399',10.5,'end')); o.append(T(740,172,'뼈','#fb7185',10.5,'end')); o.append(T(655,250,'낮은 에너지 = 뼈 · 살 대조 큼 / 선량 큼','#9db0cc',10))
    return ''.join(o)

# ── 그림 3-1 : CT 재구성 ──────────────────────────────────────────────
def ct():
    o=[]; xs=[10,205,400,595]; ttl=['① 여러 각도에서 투영','② 사이노그램','③ 단순 역투영 → 번짐','④ 필터 역투영 → 선명']
    for x,t in zip(xs,ttl): o.append(panel(x,40,175,222,t))
    cx=97
    o.append(C(cx,140,58,'none','#5b7099',1.2,)); o.append(head(cx,140,26))
    for a in (0,50,100):
        r=math.radians(a); sx,sy=cx+58*math.sin(r),140-58*math.cos(r); dx,dy=cx-58*math.sin(r),140+58*math.cos(r)
        o.append(C(sx,sy,4,'#fbbf24','#fbbf24')); o.append(L(sx,sy,dx,dy,'#fbbf24',0.8,'2 3')); o.append(R(dx-5,dy-5,10,10,2,'#34d399','#34d399',1))
    o.append(T(cx,238,'선원 · 검출기가 몸 둘레를 돈다','#9db0cc',10.5))
    # sinogram
    o.append(R(225,70,135,135,2,'#0f172a','#3d5480',1)); 
    for (A,ph,col) in ((45,0.0,'#e2e8f0'),(30,1.6,'#94a3b8'),(18,3.2,'#94a3b8')):
        pts=' '.join('%g,%g'%(225+i, 137+A*math.sin(i/135*2*math.pi+ph)) for i in range(0,136,3)); o.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2"/>'%(pts,col))
    o.append(T(292,222,'가로 : 검출기 위치 · 세로 : 각도','#9db0cc',10)); o.append(T(292,238,'점 하나 = 사인 곡선 하나','#fbbf24',11,'middle','700'))
    # backproj blurry
    o.append(R(420,70,135,135,2,'#0f172a','#3d5480',1))
    for k in range(10):
        a=math.radians(18*k); o.append(L(487-60*math.cos(a),137-60*math.sin(a),487+60*math.cos(a),137+60*math.sin(a),'rgba(226,232,240,.35)',3))
    o.append(C(487,137,10,'#f8fafc','#f8fafc',1)); o.append(T(487,222,'점이 별 모양으로 번진다','#9db0cc',10.5)); o.append(T(487,238,'(1/r 번짐)','#fb7185',11,'middle','700'))
    o.append(R(615,70,135,135,2,'#0f172a','#3d5480',1)); o.append(head(682,137,52)); o.append(C(695,125,6,'#f8fafc','#f8fafc',1)); o.append(T(682,222,'램프 필터로 번짐을 상쇄','#9db0cc',10.5)); o.append(T(682,238,'→ 단면 영상 (HU)','#34d399',11.5,'middle','700'))
    return ''.join(o)

# ── 그림 4-1 : 초음파 ─────────────────────────────────────────────────
def us():
    o=[panel(10,40,250,222,'① 탐촉자 · 젤 · 조직')]
    o.append(R(95,64,80,18,4,'#475569','#94a3b8')); o.append(R(85,86,100,6,2,'rgba(125,211,252,.35)','#7dd3fc',1)); o.append(T(195,92,'젤','#7dd3fc',10,'start'))
    o.append(R(60,94,150,26,2,'rgba(251,191,36,.10)','#5b7099',1)); o.append(R(60,120,150,50,2,'rgba(251,113,133,.10)','#5b7099',1)); o.append(R(60,170,150,26,2,'rgba(226,232,240,.18)','#94a3b8',1))
    o.append(T(135,110,'지방','#9db0cc',10)); o.append(T(135,148,'장기','#9db0cc',10)); o.append(T(135,188,'뼈 (큰 반사)','#e2e8f0',10))
    for y,c in ((120,'#fbbf24'),(170,'#fb7185'),(196,'#fb7185')): o.append(AR(145,70,145,y,'#7dd3fc',1.2)); o.append(AR(125,y,125,72,c,1.2))
    o.append(T(135,222,'경계마다 일부는 반사, 일부는 투과','#9db0cc',10.5)); o.append(T(135,238,'R = ((Z₂−Z₁)/(Z₂+Z₁))²','#fbbf24',11.5,'middle','700'))
    o.append(panel(270,40,250,222,'② A-모드 : 시간 = 깊이'))
    o.append(L(295,210,500,210,'#5b7099',1.3)); o.append(L(295,210,295,70,'#5b7099',1.3)); 
    for t,h in ((305,70),(370,38),(430,30),(480,56)): o.append(L(t,210,t,210-h*1.6,'#34d399',2.2))
    o.append(T(398,230,'시간 t (μs) →','#9db0cc',10.5)); o.append(T(398,247,'깊이 d = c·t / 2  (c ≈ 1540 m/s)','#fbbf24',11.5,'middle','700')); o.append(T(305,64,'송신','#7dd3fc',10)); o.append(T(370,102,'에코1','#9db0cc',10)); o.append(T(430,114,'에코2','#9db0cc',10))
    o.append(panel(530,40,240,222,'③ B-모드 : 줄을 쌓아 영상'))
    o.append(P('M650 72 L572 215 L728 215 Z','#5b7099',1.3,'#0f172a'))
    for k in range(7):
        a=math.radians(-30+10*k); o.append(L(650,72,650+170*math.sin(a),72+170*math.cos(a)*0.84,'rgba(125,211,252,.30)',0.8))
    o.append(E(650,150,14,9,'#0f172a','#5b7099',1)); o.append(E(626,176,6,5,'rgba(226,232,240,.8)','#e2e8f0',1)); o.append(T(650,232,'낭종(검은 원) · 뒤쪽 밝아짐','#9db0cc',10.5)); o.append(T(650,248,'뼈 뒤 그림자','#fb7185',11,'middle','700'))
    return ''.join(o)

# ── 그림 5-1 : MRI ───────────────────────────────────────────────────
def mri():
    o=[]; xs=[10,205,400,595]; ttl=['① 자기장 속 정렬','② 라모어 세차','③ RF 펄스 → 신호','④ 이완 T₁ · T₂']
    for x,t in zip(xs,ttl): o.append(panel(x,40,175,222,t))
    cx=97
    o.append(AR(cx-58,200,cx-58,90,'#34d399',2)); o.append(T(cx-58,84,'B₀','#34d399',11,'middle','700'))
    for i in range(3):
        for j in range(3): o.append(AR(cx-22+i*26,190-j*30,cx-22+i*26,162-j*30,'#fbbf24',1.6))
    o.append(T(cx,236,'스핀 대부분이 B₀ 방향 정렬','#9db0cc',10.5))
    cx=292
    o.append(L(cx,200,cx,90,'#34d399',1.4,'4 3')); o.append(E(cx,120,34,10,'none','#5b7099',1)); o.append(AR(cx,200,cx+30,125,'#fbbf24',2.2)); o.append(P('M%g 120 A34 10 0 0 1 %g 118'%(cx+30,cx-22),'#a78bfa',1.4)); o.append(T(cx,226,'f = γB (수소 : 42.58 MHz/T)','#fbbf24',11,'middle','700')); o.append(T(cx,242,'1.5 T → 약 64 MHz','#9db0cc',10.5))
    cx=487
    o.append(L(cx-70,170,cx+70,170,'#5b7099',1)); pts=' '.join('%g,%g'%(cx-70+i, 170-60*math.exp(-i/70)*math.sin(i/4.0)) for i in range(0,140,2)); o.append('<polyline points="%s" fill="none" stroke="#38bdf8" stroke-width="2"/>'%pts)
    o.append(AR(cx-70,110,cx-30,110,'#fb7185',2)); o.append(T(cx-50,100,'RF 펄스','#fb7185',10.5)); o.append(T(cx,226,'코일이 되돌아오는 신호를 받는다','#9db0cc',10.5)); o.append(T(cx,242,'감쇠 = 이완','#fbbf24',11,'middle','700'))
    cx=682
    o.append(L(cx-70,200,cx+70,200,'#5b7099',1.2)); o.append(L(cx-70,200,cx-70,80,'#5b7099',1.2))
    p1=' '.join('%g,%g'%(cx-70+i, 200-110*(1-math.exp(-i/45))) for i in range(0,140,3)); p2=' '.join('%g,%g'%(cx-70+i, 90+ (110)*(1-math.exp(-i/25))) for i in range(0,140,3))
    o.append('<polyline points="%s" fill="none" stroke="#34d399" stroke-width="2"/>'%p1); o.append('<polyline points="%s" fill="none" stroke="#fb7185" stroke-width="2"/>'%p2)
    o.append(T(cx+40,128,'T₁ 회복 ↑','#34d399',10.5,'start')); o.append(T(cx+10,170,'T₂ 감소 ↓','#fb7185',10.5,'start')); o.append(T(cx,226,'조직마다 T₁ · T₂ 가 다르다','#9db0cc',10.5)); o.append(T(cx,242,'→ TR · TE 로 대조 선택','#fbbf24',11,'middle','700'))
    return ''.join(o)

# ── 그림 6-1 : 선량 비교(로그) ────────────────────────────────────────
def dose():
    o=[T(390,32,'유효선량(mSv) — 세로 로그 눈금 · 어림값(검사 · 장비 · 환자에 따라 다름)','#9db0cc',12)]
    items=[('치과 X선',0.005,'#34d399'),('흉부 X선',0.1,'#34d399'),('자연방사선(연)',2.4,'#a78bfa'),('두부 CT',2,'#fbbf24'),('흉부 CT',7,'#fbbf24'),('복부 CT',9,'#fb7185'),('초음파 · MRI',0,'#7dd3fc')]
    base=232; top=56
    def Y(v): return base-(math.log10(v)-math.log10(0.003))/(math.log10(30)-math.log10(0.003))*(base-top)
    o.append(L(80,base,760,base,'#5b7099',1.3)); o.append(L(80,base,80,top,'#5b7099',1.3))
    for v in (0.01,0.1,1,10): o.append(L(76,Y(v),760,Y(v),'#223455',0.8)); o.append(T(70,Y(v)+4,str(v),'#9db0cc',10.5,'end'))
    for i,(n,v,c) in enumerate(items):
        x=100+i*92
        if v>0: o.append(R(x,Y(v),52,base-Y(v),2,c,c,1)); o.append(T(x+26,Y(v)-5,str(v),'#cfe0f5',11,'middle','700'))
        else: o.append(T(x+26,base-30,'이온화','#7dd3fc',11)); o.append(T(x+26,base-16,'방사선 0','#7dd3fc',11,'middle','700'))
        o.append(T(x+26,250,n,'#9db0cc',10.5))
    return ''.join(o)

# ── 그림 7-1 : 의료영상 생태계 ─────────────────────────────────────────
def eco():
    o=[]
    cols=[('① 연구 · 개발',['대학 · 연구원 · 영상 AI 기업','대학 · NIH · 기업 연구소','대학 · 장비 기업 연구소']),
          ('② 허가 · 표준',['식품의약품안전처','FDA','PMDA · 후생노동성']),
          ('③ 장비 산업',['초음파 · 디지털 X선 · AI','GE 헬스케어 등','캐논 메디컬 · 후지필름 · 시마즈']),
          ('④ 보급 · 검사',['CT 검사 건수 최상위권','MRI 보급 많음','인구당 CT · MRI 1위(OECD)']),
          ('⑤ 판독 · 데이터',['PACS · DICOM · AI 보조','PACS · DICOM · AI 허가 활발','PACS · DICOM · 고령화 대응'])]
    flags=['한국','미국','일본']; fc=['#34d399','#7dd3fc','#fbbf24']
    for i,(t,rows) in enumerate(cols):
        ox=10+154*i
        o.append(R(ox,40,146,216,9,'#0b1424','#3d5480',1.3)); o.append(T(ox+73,62,t,'#cfe0f5',12.5,'middle','700'))
        for j,r in enumerate(rows):
            y=76+j*58
            o.append(R(ox+6,y,134,50,6,'rgba(148,163,184,.08)',fc[j],1))
            o.append(T(ox+14,y+14,flags[j],fc[j],10.5,'start','700'))
            # 두 줄로 나눈다
            words=r.split(' '); line=''; lines=[]
            for w in words:
                if len(line+w)>11: lines.append(line.strip()); line=''
                line+=w+' '
            lines.append(line.strip())
            for k,l in enumerate(lines[:3]): o.append(T(ox+14,y+27+k*11,l,'#cfe0f5',9.5,'start'))
        if i<4: o.append(L(ox+146,148,ox+154,148,'#fbbf24',1.6))
    return ''.join(o)

PLACE={'flow':flow,'xray':xray,'ct':ct,'us':us,'mri':mri,'dose':dose,'eco':eco}

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
