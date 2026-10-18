/* 주제 9 사건 카드 생성기 (공용)
   students/t09-cards.html(카드 인쇄)과 teachers/t09.html(정답표)이 이 파일 하나를 함께 씁니다.
   씨앗값(seed)이 고정된 난수로 만들기 때문에 같은 세트는 언제 열어도 똑같은 40장이 나옵니다.
   세트 A~F는 서로 다른 씨앗값 → 모둠마다 다른 세트를 주면 학급 합산이 독립 사건 240개가 됩니다.

   물리 모형(단순화)
   - W: 질량 브라이트-비그너(80.37 GeV, 폭 2.09 GeV), 정지계에서 두 몸 붕괴 후 실험실계로 로런츠 변환
   - Z: 질량 브라이트-비그너(91.19 GeV, 폭 2.50 GeV), 렙톤 운동량 분해능 약 3 % (질량 분해능 약 2 GeV)
   - 배경: 두 제트(QCD), 제트 속에 묻힌(고립되지 않은) 렙톤 + 작은 MET
   - 카드 그림은 보기 쉽도록 트래커 안의 휘어짐을 크게 과장했습니다(실제 40 GeV 트랙은 거의 직선). */
(function (global) {
  "use strict";

  var SETS = ["A", "B", "C", "D", "E", "F"];
  var SEEDS = { A: 92357, B: 92264, C: 91127, D: 90700, E: 92130, F: 91573 };
  var N_CARDS = 40;
  var CATS = [
    { key: "wpe", label: "W⁺ → e⁺ν", sym: "e⁺ν", boson: "W+", flav: "e" },
    { key: "wme", label: "W⁻ → e⁻ν̄", sym: "e⁻ν̄", boson: "W-", flav: "e" },
    { key: "wpm", label: "W⁺ → μ⁺ν", sym: "μ⁺ν", boson: "W+", flav: "mu" },
    { key: "wmm", label: "W⁻ → μ⁻ν̄", sym: "μ⁻ν̄", boson: "W-", flav: "mu" },
    { key: "zee", label: "Z → e⁺e⁻", sym: "ee", boson: "Z", flav: "e" },
    { key: "zmm", label: "Z → μ⁺μ⁻", sym: "μμ", boson: "Z", flav: "mu" },
    { key: "bg", label: "배경", sym: "배경", boson: "", flav: "" }
  ];
  var CAT = {};
  CATS.forEach(function (c) { CAT[c.key] = c; });
  /* 카드 묶음의 기대 구성: W⁺:W⁻ = 1.4:1, e:μ = 1:1. 수업용으로 Z와 배경을 실제보다 많이 넣었다(실제 W:Z ≈ 10:1). */
  var PROB = [["wpe", 0.175], ["wme", 0.125], ["wpm", 0.175], ["wmm", 0.125], ["zee", 0.075], ["zmm", 0.075], ["bg", 0.25]];

  var MW = 80.37, GW = 2.085, MZ = 91.19, GZ = 2.50, ETA_MAX = 1.2;
  var TWO_PI = Math.PI * 2;

  /* ---------- 씨앗 난수 ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function Rand(seed) {
    var u = mulberry32(seed);
    var R = {
      u: u,
      uni: function (a, b) { return a + (b - a) * u(); },
      int: function (a, b) { return a + Math.floor(u() * (b - a + 1)); },
      gauss: function (m, s) {
        var x = 1 - u(), y = u();
        return m + s * Math.sqrt(-2 * Math.log(x)) * Math.cos(TWO_PI * y);
      },
      exp: function (mean) { return -mean * Math.log(1 - u()); },
      sign: function () { return u() < 0.5 ? -1 : 1; }
    };
    return R;
  }

  /* ---------- 운동학 ---------- */
  function wrap(phi) { while (phi <= -Math.PI) phi += TWO_PI; while (phi > Math.PI) phi -= TWO_PI; return phi; }
  function bw(R, m, g, lo, hi) {
    for (var i = 0; i < 1000; i++) { var x = m + 0.5 * g * Math.tan(Math.PI * (R.u() - 0.5)); if (x > lo && x < hi) return x; }
    return m;
  }
  function boost(v, bx, by, bz, g) {
    var b2 = bx * bx + by * by + bz * bz, bp = bx * v.px + by * v.py + bz * v.pz;
    var k = b2 > 0 ? (g - 1) * bp / b2 + g * v.E : 0;
    return { E: g * (v.E + bp), px: v.px + k * bx, py: v.py + k * by, pz: v.pz + k * bz };
  }
  /* 질량 M, 횡운동량 pT, 빠르기 y, 방위각 phi인 보손 → 질량 없는 두 딸 입자(4-벡터) */
  function decay2(R, M, pT, y, phi) {
    var mT = Math.sqrt(M * M + pT * pT);
    var E = mT * Math.cosh(y), px = pT * Math.cos(phi), py = pT * Math.sin(phi), pz = mT * Math.sinh(y);
    var c = R.uni(-1, 1), s = Math.sqrt(1 - c * c), f = R.uni(0, TWO_PI), p = M / 2;
    var d1 = { E: p, px: p * s * Math.cos(f), py: p * s * Math.sin(f), pz: p * c };
    var d2 = { E: p, px: -d1.px, py: -d1.py, pz: -d1.pz };
    var g = E / M;
    return [boost(d1, px / E, py / E, pz / E, g), boost(d2, px / E, py / E, pz / E, g)];
  }
  function ptEtaPhi(v) {
    var pt = Math.sqrt(v.px * v.px + v.py * v.py);
    return { pt: pt, eta: Math.asinh(v.pz / pt), phi: Math.atan2(v.py, v.px) };
  }
  /* 질량을 무시한 두 렙톤의 불변질량: M² = 2·pT1·pT2·(cosh Δη − cos Δφ) */
  function pairMass(a, b) {
    return Math.sqrt(Math.max(0, 2 * a.pt * b.pt * (Math.cosh(a.eta - b.eta) - Math.cos(a.phi - b.phi))));
  }
  function vec(pt, phi) { return { x: pt * Math.cos(phi), y: pt * Math.sin(phi) }; }

  /* ---------- 사건 구성 요소 ---------- */
  function pileup(R, ev) {
    var n = R.int(4, 7);
    for (var i = 0; i < n; i++) {
      ev.tracks.push({ pt: Math.min(0.9, 0.3 + R.exp(0.3)), eta: R.uni(-2.4, 2.4), phi: R.uni(-Math.PI, Math.PI), q: R.sign(), kind: "pu", lab: "" });
    }
    var m = R.int(3, 6);
    for (var j = 0; j < m; j++) ev.noise.push({ phi: R.uni(-Math.PI, Math.PI), ecal: R.uni(0.3, 1.5), hcal: R.uni(0.5, 2.5) });
  }
  /* 제트: 전하를 띤 강입자 트랙 몇 개 + 중성 입자 에너지(칼로리미터) */
  function jet(R, ev, pt, eta, phi) {
    var n = R.int(4, 7), w = [], sw = 0, i;
    for (i = 0; i < n; i++) { var x = 0.3 + R.u(); w.push(x); sw += x; }
    var charged = 0.55 * pt;
    for (i = 0; i < n; i++) {
      var tp = Math.min(12, Math.max(2.2, charged * w[i] / sw));
      ev.tracks.push({ pt: tp, eta: eta + R.gauss(0, 0.08), phi: wrap(phi + R.gauss(0, 0.09)), q: R.sign(), kind: "h", lab: "" });
    }
    ev.jets.push({ pt: pt, eta: eta, phi: phi });
  }
  function lepton(flav, q, v, lab) {
    var k = ptEtaPhi(v);
    return { pt: k.pt, eta: k.eta, phi: k.phi, q: q, kind: flav, lab: lab };
  }

  function makeW(R, ev, q, flav) {
    for (var tries = 0; tries < 500; tries++) {
      var M = bw(R, MW, GW, 60, 100), pTW = Math.min(30, R.exp(6)), y = R.uni(-2, 2), phiW = R.uni(-Math.PI, Math.PI);
      var d = decay2(R, M, pTW, y, phiW);
      var l = lepton(flav, q, d[0], "A"), nu = ptEtaPhi(d[1]);
      l.pt *= 1 + R.gauss(0, 0.02);
      var mv = vec(nu.pt, nu.phi);
      mv.x += R.gauss(0, 3.5); mv.y += R.gauss(0, 3.5);
      var met = Math.sqrt(mv.x * mv.x + mv.y * mv.y);
      if (Math.abs(l.eta) < ETA_MAX && l.pt > 25 && met > 20) {
        ev.tracks.push(l);
        ev.met = { pt: met, phi: Math.atan2(mv.y, mv.x) };
        ev.truth = { M: M, pTV: pTW, nuPt: nu.pt };
        if (pTW > 12) jet(R, ev, pTW * R.uni(0.75, 1.0), R.uni(-ETA_MAX, ETA_MAX), wrap(phiW + Math.PI + R.gauss(0, 0.2)));
        return;
      }
    }
  }
  function makeZ(R, ev, flav) {
    for (var tries = 0; tries < 500; tries++) {
      var M = bw(R, MZ, GZ, 70, 112), pTZ = Math.min(25, R.exp(5)), y = R.uni(-1.4, 1.4), phiZ = R.uni(-Math.PI, Math.PI);
      var d = decay2(R, M, pTZ, y, phiZ);
      var a = lepton(flav, -1, d[0], ""), b = lepton(flav, +1, d[1], "");
      a.pt *= 1 + R.gauss(0, 0.031); b.pt *= 1 + R.gauss(0, 0.031);
      if (Math.abs(a.eta) < ETA_MAX && Math.abs(b.eta) < ETA_MAX && a.pt > 20 && b.pt > 20) {
        if (a.pt >= b.pt) { a.lab = "A"; b.lab = "B"; ev.tracks.push(a, b); } else { b.lab = "A"; a.lab = "B"; ev.tracks.push(b, a); }
        var mx = R.gauss(0, 3.5), my = R.gauss(0, 3.5);
        ev.met = { pt: Math.sqrt(mx * mx + my * my), phi: Math.atan2(my, mx) };
        ev.truth = { M: M, pTV: pTZ };
        return;
      }
    }
  }
  function makeBg(R, ev) {
    var lepJet = R.u() < 0.4;
    for (var tries = 0; tries < 500; tries++) {
      var save = { t: ev.tracks.length, j: ev.jets.length };
      var p1 = 25 + Math.min(45, R.exp(12)), e1 = R.uni(-ETA_MAX, ETA_MAX), f1 = R.uni(-Math.PI, Math.PI);
      var k = R.uni(0.84, 1.0), p2 = p1 * k, e2 = R.uni(-ETA_MAX, ETA_MAX), f2 = wrap(f1 + Math.PI + R.gauss(0, 0.12));
      var vis = { x: 0, y: 0 };
      if (lepJet) {
        var flav = R.u() < 0.5 ? "e" : "mu", q = R.sign();
        var lp = R.uni(15, 24);
        ev.tracks.push({ pt: lp, eta: e1 + R.gauss(0, 0.04), phi: wrap(f1 + R.gauss(0, 0.05)), q: q, kind: flav, lab: "A" });
        jet(R, ev, p1 - lp * 0.3, e1, f1);
        ev.bgType = flav === "e" ? "제트 속 전자(고립 안 됨)" : "제트 속 뮤온(고립 안 됨)";
      } else {
        jet(R, ev, p1, e1, f1);
        ev.bgType = "두 제트(QCD)";
      }
      jet(R, ev, p2, e2, f2);
      var a = vec(p1, f1), b = vec(p2, f2);
      vis.x = a.x + b.x; vis.y = a.y + b.y;
      var mx = -vis.x + R.gauss(0, 3.5), my = -vis.y + R.gauss(0, 3.5), met = Math.sqrt(mx * mx + my * my);
      if (met < 15) { ev.met = { pt: met, phi: Math.atan2(my, mx) }; return; }
      ev.tracks.length = save.t; ev.jets.length = save.j;
    }
  }

  function pickCat(R) {
    var x = R.u(), acc = 0;
    for (var i = 0; i < PROB.length; i++) { acc += PROB[i][1]; if (x < acc) return PROB[i][0]; }
    return "bg";
  }

  /* 세트 하나(카드 40장) 만들기 */
  function generate(set) {
    set = SETS.indexOf(set) >= 0 ? set : "A";
    var R = Rand(SEEDS[set]);
    var out = [];
    for (var i = 0; i < N_CARDS; i++) {
      var cat = pickCat(R);
      var ev = { set: set, n: i + 1, id: set + "-" + (i < 9 ? "0" : "") + (i + 1), cat: cat, tracks: [], jets: [], noise: [], met: { pt: 0, phi: 0 }, bgType: "" };
      if (cat === "wpe") makeW(R, ev, +1, "e");
      else if (cat === "wme") makeW(R, ev, -1, "e");
      else if (cat === "wpm") makeW(R, ev, +1, "mu");
      else if (cat === "wmm") makeW(R, ev, -1, "mu");
      else if (cat === "zee") makeZ(R, ev, "e");
      else if (cat === "zmm") makeZ(R, ev, "mu");
      else makeBg(R, ev);
      pileup(R, ev);
      var labs = ev.tracks.filter(function (t) { return t.lab; });
      ev.labeled = labs;
      ev.mass = labs.length === 2 ? pairMass(labs[0], labs[1]) : null;
      out.push(ev);
    }
    return out;
  }
  function counts(events) {
    var c = {}; CATS.forEach(function (k) { c[k.key] = 0; });
    events.forEach(function (e) { c[e.cat]++; });
    return c;
  }

  /* ---------- 표시용 숫자 ---------- */
  function deg(phi) { var d = phi * 180 / Math.PI; if (d < 0) d += 360; return Math.round(d) % 360; }
  function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  function f2s(x) { return (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(2); }

  /* ---------- 카드 그림(횡단면, SVG 문자열) ----------
     좌표: 검출기 바깥 반지름 = 100. 자기장은 종이 면에서 나오는 방향(⊙) → 양전하는 시계 방향으로 휜다. */
  var G = { trk: 40, e0: 42, e1: 50, h0: 52, h1: 68, sol: 70.5, mu: [77, 84, 91, 98] };
  /* 표시용 곡률 반지름(실제보다 크게 과장): 높은 pT일수록 덜 휜다 */
  function rDisp(pt) {
    if (pt >= 2) return 60 * Math.pow(pt / 40, 0.25);
    return 60 * Math.pow(2 / 40, 0.25) * Math.pow(pt / 2, 1.5);
  }
  /* 원점에서 방향 phi로 출발한 전하 q 트랙: 반지름 rmax에 닿거나 한 바퀴를 돌 때까지 */
  function path(t, rmax) {
    var r = rDisp(t.pt), x = 0, y = 0, a = t.phi, ds = 0.6, s = 0, pts = [[0, 0]];
    var maxS = TWO_PI * r * 0.97, out = false;
    while (s < maxS) {
      a -= t.q * ds / r;      /* 양전하: 방위각이 줄어듦(시계 방향) */
      x += ds * Math.cos(a); y += ds * Math.sin(a); s += ds;
      pts.push([x, y]);
      if (x * x + y * y >= rmax * rmax) { out = true; break; }
    }
    return { pts: pts, out: out, dir: a, x: x, y: y };
  }
  function P(x, y) { return x.toFixed(1) + "," + (-y).toFixed(1); }  /* SVG는 y축이 아래 방향 */
  function polyline(pts, cls) { return '<polyline class="' + cls + '" points="' + pts.map(function (p) { return P(p[0], p[1]); }).join(" ") + '"/>'; }
  function wedge(phi, r0, len, halfDeg, cls) {
    var h = halfDeg * Math.PI / 180, r1 = r0 + len;
    var a = [[r0, phi - h], [r1, phi - h], [r1, phi + h], [r0, phi + h]];
    return '<polygon class="' + cls + '" points="' + a.map(function (q) { return P(q[0] * Math.cos(q[1]), q[0] * Math.sin(q[1])); }).join(" ") + '"/>';
  }
  function arc(r, a0, a1) {
    var x0 = r * Math.cos(a0), y0 = r * Math.sin(a0), x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
    return "M" + P(x0, y0) + " A" + r + "," + r + " 0 0 0 " + P(x1, y1);
  }
  var BIN = TWO_PI / 72;
  function binOf(phi) { var b = Math.floor((phi + Math.PI) / BIN); return ((b % 72) + 72) % 72; }
  function binPhi(b) { return -Math.PI + (b + 0.5) * BIN; }

  function cardSVG(ev, opt) {
    opt = opt || {};
    var s = [], i, b;
    s.push('<svg class="evsvg" viewBox="-104 -104 208 208" role="img" aria-label="사건 ' + ev.id + ' 횡단면 그림">');
    /* 검출기 */
    s.push('<circle class="d-bg" r="101"/>');
    G.mu.forEach(function (r) {
      for (var k = 0; k < 12; k++) s.push('<path class="d-mu" d="' + arc(r, k * Math.PI / 6 + 0.05, (k + 1) * Math.PI / 6 - 0.05) + '"/>');
    });
    s.push('<circle class="d-sol" r="' + G.sol + '"/>');
    s.push('<circle class="d-hcal" r="' + ((G.h0 + G.h1) / 2) + '" stroke-width="' + (G.h1 - G.h0) + '"/>');
    s.push('<circle class="d-ecal" r="' + ((G.e0 + G.e1) / 2) + '" stroke-width="' + (G.e1 - G.e0) + '"/>');
    s.push('<circle class="d-trk" r="' + G.trk + '"/>');
    [13, 26].forEach(function (r) { s.push('<circle class="d-lay" r="' + r + '"/>'); });

    /* 칼로리미터 에너지(가로 에너지 E_T, 5° 구간) */
    var ecal = new Array(72).fill(0), hcal = new Array(72).fill(0);
    ev.noise.forEach(function (n) { ecal[binOf(n.phi)] += n.ecal; hcal[binOf(n.phi)] += n.hcal; });
    ev.jets.forEach(function (j) {
      var c = binOf(j.phi), neu = 0.45 * j.pt;
      [[0, 0.6], [-1, 0.2], [1, 0.2]].forEach(function (w) { var k = (c + w[0] + 72) % 72; ecal[k] += neu * 0.55 * w[1]; hcal[k] += neu * 0.45 * w[1]; });
    });
    var trackSvg = [], refSvg = [], labSvg = [], hitSvg = [];
    ev.tracks.forEach(function (t) {
      var isLep = t.kind === "e" || t.kind === "mu";
      var p = path(t, t.kind === "e" ? G.e0 - 1 : G.trk);
      var cls = t.lab ? "tk tk-hi" : (t.kind === "pu" ? "tk tk-pu" : "tk");
      var pts = p.pts;
      if (p.out) {
        var posPhi = Math.atan2(p.y, p.x);
        if (t.kind === "e") ecal[binOf(posPhi)] += t.pt;
        else if (t.kind === "h") { ecal[binOf(posPhi)] += 0.25 * t.pt; hcal[binOf(posPhi)] += 0.75 * t.pt; }
        else if (t.kind === "mu") {
          /* 뮤온: 트래커 밖에서는 직선으로 그림(카드 단순화), 칼로리미터에 아주 작은 흔적 */
          hcal[binOf(posPhi)] += 1.2;
          var x = p.x, y = p.y, dx = Math.cos(p.dir), dy = Math.sin(p.dir), ext = [];
          var st = 0;
          for (var k = 0; k < 400; k++) {
            x += dx * 0.5; y += dy * 0.5; ext.push([x, y]);
            var rr = Math.sqrt(x * x + y * y);
            if (st < G.mu.length && rr >= G.mu[st]) {
              var ph = Math.atan2(y, x);
              hitSvg.push(wedge(ph, G.mu[st] - 2.2, 4.4, 2.6, "hit-mu"));
              st++;
            }
            if (rr >= 100) break;
          }
          pts = pts.concat(ext);
        }
      }
      trackSvg.push(polyline(pts, cls));
      if (t.lab) {
        var L = G.trk;
        refSvg.push('<line class="tk-ref" x1="0" y1="0" x2="' + (L * Math.cos(t.phi)).toFixed(1) + '" y2="' + (-L * Math.sin(t.phi)).toFixed(1) + '"/>');
        /* 이름표: 트랙이 반지름 30을 지나는 곳 바깥쪽 */
        var lp = null;
        for (var m = 0; m < p.pts.length; m++) { var q2 = p.pts[m]; if (q2[0] * q2[0] + q2[1] * q2[1] >= 30 * 30) { lp = q2; break; } }
        if (!lp) lp = p.pts[p.pts.length - 1];
        var la = Math.atan2(lp[1], lp[0]), nx = Math.cos(la - t.q * 0.35) * 8, ny = Math.sin(la - t.q * 0.35) * 8;
        labSvg.push('<text class="tk-lab" x="' + (lp[0] + nx).toFixed(1) + '" y="' + (-(lp[1] + ny) + 2.5).toFixed(1) + '" text-anchor="middle">' + t.lab + "</text>");
      }
      void isLep;
    });
    for (b = 0; b < 72; b++) {
      if (hcal[b] > 0.8) s.push(wedge(binPhi(b), G.h0, Math.min(34, 1.5 + 0.55 * hcal[b]), 2.4, "dep-h"));
    }
    for (b = 0; b < 72; b++) {
      if (ecal[b] > 0.6) s.push(wedge(binPhi(b), G.e0, Math.min(40, 1.5 + 0.6 * ecal[b]), 2.4, "dep-e"));
    }
    s.push(hitSvg.join(""));
    s.push(refSvg.join(""));
    s.push(trackSvg.join(""));
    /* MET 화살표(회색 점선) */
    var ml = Math.min(92, 4 + 1.45 * ev.met.pt), mp = ev.met.phi;
    var hx = ml * Math.cos(mp), hy = ml * Math.sin(mp);
    s.push('<line class="met" x1="0" y1="0" x2="' + (hx * 0.94).toFixed(1) + '" y2="' + (-hy * 0.94).toFixed(1) + '"/>');
    var ah = 6, aw = 3.2, bx = hx - ah * Math.cos(mp), by = hy - ah * Math.sin(mp);
    s.push('<polygon class="met-head" points="' + P(hx, hy) + " " + P(bx - aw * Math.sin(mp), by + aw * Math.cos(mp)) + " " + P(bx + aw * Math.sin(mp), by - aw * Math.cos(mp)) + '"/>');
    s.push(labSvg.join(""));
    s.push('<circle class="d-ip" r="1.6"/>');
    s.push('<text class="d-b" x="-100" y="-92">B ⊙</text>');
    if (opt.showId !== false) s.push('<text class="d-id" x="100" y="-92" text-anchor="end">' + ev.id + "</text>");
    s.push("</svg>");
    return s.join("");
  }

  /* 카드 아래 글자 정보 */
  function cardText(ev) {
    var rows = ev.labeled.map(function (t) {
      return "<tr><th>" + t.lab + "</th><td>" + f1(t.pt) + "</td><td>" + f2s(t.eta) + "</td><td>" + deg(t.phi) + "°</td></tr>";
    });
    if (!rows.length) rows.push('<tr><td colspan="4">p<sub>T</sub> 15 GeV 넘는 트랙 없음</td></tr>');
    rows.push("<tr><th>MET</th><td>" + f1(ev.met.pt) + "</td><td></td><td>" + deg(ev.met.phi) + "°</td></tr>");
    return '<table class="cardtab"><tr><th></th><th>p<sub>T</sub>(GeV)</th><th>η</th><th>φ</th></tr>' + rows.join("") + "</table>";
  }

  /* 교사용 정답 근거 */
  function reason(ev) {
    var parts = ev.labeled.map(function (t) {
      var who = t.kind === "e" ? (t.q > 0 ? "e⁺" : "e⁻") : (t.q > 0 ? "μ⁺" : "μ⁻");
      var sig = t.kind === "e" ? "ECAL 탑에서 멈춤" : "뮤온 챔버 신호";
      var turn = t.q > 0 ? "시계 방향" : "반시계 방향";
      return t.lab + ": " + who + "(" + sig + ", " + turn + ")";
    });
    var met = "MET " + f1(ev.met.pt) + " GeV";
    if (ev.cat === "bg") return (ev.bgType || "배경") + (parts.length ? " · " + parts.join(", ") + " 제트 안에 있음" : "") + " · " + met + "(작음)";
    if (ev.cat.charAt(0) === "w") return parts.join(", ") + " · " + met + "(큼, 렙톤과 거의 반대쪽)";
    return parts.join(", ") + " · " + met + "(작음)";
  }

  global.T09Cards = {
    SETS: SETS, SEEDS: SEEDS, N: N_CARDS, CATS: CATS, CAT: CAT,
    generate: generate, counts: counts, cardSVG: cardSVG, cardText: cardText, reason: reason,
    pairMass: pairMass, deg: deg, f1: f1, f2s: f2s
  };
})(typeof window !== "undefined" ? window : globalThis);
