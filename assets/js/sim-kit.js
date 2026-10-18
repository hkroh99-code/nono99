/* CERN 탐구 교실 — 3D 모의실험 공통 도구 (SimKit)
   필요: assets/vendor/three/three.min.js, OrbitControls.js 를 먼저 불러올 것.
   모든 모의실험은 이 파일의 API만 사용해 일관된 조작감·기록 방식을 유지합니다.

   주요 API
     SimKit.create({stage, cameraPos, target, fov, background, grid}) → sim
       sim.scene / sim.camera / sim.renderer / sim.controls
       sim.onFrame(fn(dt, t))  dt: 실제 경과 초(최대 0.05) × sim.timeScale
       sim.start() / sim.stop() / sim.toggle() / sim.running / sim.resetCamera()
     SimKit.label(text, {color, size, bg, height}) → THREE.Sprite
     SimKit.Trail(scene, {max, color, opacity}) → {push(v3), clear(), line}
     SimKit.arrow(origin, dir, length, color) → THREE.ArrowHelper
     SimKit.ui.section / slider / select / toggle / button / readouts
     SimKit.Recorder(container, {id, columns}) → {add(obj), clear(), rows}
     SimKit.Mission(container, {id, steps}) → {complete(i), reset()}
     SimKit.plot.hist(canvas, opts) / SimKit.plot.xy(canvas, opts)
     SimKit.data.load(name, root) → Promise<rows>   (data/js/<name>.js 를 script 태그로 불러옴: file:// 에서도 동작)
     SimKit.data.parseCSV(text) → rows(객체 배열, 숫자는 Number)
     SimKit.toast(msg) / SimKit.fmt(x, digits) / SimKit.C (물리 상수) / SimKit.COLORS (입자 색) */
(function () {
  "use strict";
  var THREE = window.THREE;

  /* ---------- 물리 상수(SI) ---------- */
  var C = {
    c: 2.99792458e8, e: 1.602176634e-19, me: 9.1093837e-31, mp: 1.67262192e-27,
    mmu: 1.883531627e-28, eps0: 8.8541878128e-12, k: 8.9875517923e9,
    MeV: 1.602176634e-13, GeV: 1.602176634e-10,
    me_MeV: 0.51099895, mp_MeV: 938.272, mmu_MeV: 105.658, tau_mu: 2.1969811e-6,
    mZ: 91.1876, mW: 80.377, mH: 125.1, mJpsi: 3.0969, mUps: 9.4603
  };

  /* 입자 색: 모든 모의실험에서 같은 입자는 같은 색 */
  var COLORS = {
    electron: 0x3fb6ff, positron: 0x8fd6ff, muon: 0xff5d8f, photon: 0xffd23f,
    hadron: 0xff9f43, jet: 0xff9f43, neutrino: 0xb9bfd3, proton: 0xff6b6b, neutron: 0xa0a8c0,
    alpha: 0xffb347, quark_u: 0xff6b6b, quark_d: 0x4dabf7, gluon: 0x9ae66e, field: 0x7f9cff, track: 0xf0a35e,
    detector: 0x3a4670, ok: 0x5fd08a
  };

  function fmt(x, d) {
    if (x === null || x === undefined || isNaN(x)) return "–";
    d = d === undefined ? 3 : d;
    var a = Math.abs(x);
    if (a !== 0 && (a >= 1e5 || a < 1e-3)) {
      var p = Math.floor(Math.log10(a)); var m = x / Math.pow(10, p);
      return m.toFixed(Math.max(0, d - 1)) + "×10" + sup(p);
    }
    return Number(x.toPrecision(d)).toLocaleString("ko-KR", { maximumFractionDigits: 6 });
  }
  function sup(n) {
    var map = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
    return String(n).split("").map(function (ch) { return map[ch] || ch; }).join("");
  }

  /* ---------- 장면 만들기 ---------- */
  function create(opts) {
    opts = opts || {};
    var stage = opts.stage;
    if (!THREE) { stage.innerHTML = '<p style="padding:1rem">3D 엔진(three.js)을 불러오지 못했습니다. 파일 위치를 확인하세요.</p>'; throw new Error("THREE missing"); }
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: !!opts.preserve });
    } catch (e) {
      stage.innerHTML = '<p style="padding:1rem;color:#ffb4a8">이 기기에서는 3D(WebGL)를 사용할 수 없습니다. 다른 브라우저(크롬·엣지·사파리 최신판)로 열어 주세요.</p>';
      throw e;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    stage.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(opts.background !== undefined ? opts.background : 0x070b16);
    var camera = new THREE.PerspectiveCamera(opts.fov || 50, 1, opts.near || 0.1, opts.far || 5000);
    var camPos = opts.cameraPos || [8, 6, 10];
    var target = opts.target || [0, 0, 0];
    camera.position.set(camPos[0], camPos[1], camPos[2]);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(target[0], target[1], target[2]);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(5, 10, 7);
    scene.add(dl);
    if (opts.grid !== false) {
      var g = opts.grid || {};
      var grid = new THREE.GridHelper(g.size || 20, g.divisions || 20, 0x2a3458, 0x161d33);
      grid.position.y = g.y || 0;
      scene.add(grid);
    }

    var frameFns = [];
    var sim = {
      THREE: THREE, scene: scene, camera: camera, renderer: renderer, controls: controls, stage: stage,
      running: opts.autostart !== false, timeScale: 1, time: 0,
      onFrame: function (fn) { frameFns.push(fn); return sim; },
      start: function () { sim.running = true; return sim; },
      stop: function () { sim.running = false; return sim; },
      toggle: function () { sim.running = !sim.running; return sim.running; },
      resetCamera: function () {
        camera.position.set(camPos[0], camPos[1], camPos[2]);
        controls.target.set(target[0], target[1], target[2]); controls.update();
      },
      setView: function (pos, tgt) {
        camera.position.set(pos[0], pos[1], pos[2]);
        if (tgt) controls.target.set(tgt[0], tgt[1], tgt[2]);
        controls.update();
      },
      resize: resize
    };
    function resize() {
      var w = stage.clientWidth || 300, h = stage.clientHeight || 300;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize);

    var last = performance.now();
    function loop(now) {
      var real = Math.min(0.05, (now - last) / 1000); last = now;
      var dt = sim.running ? real * sim.timeScale : 0;
      if (sim.running) sim.time += dt;
      for (var i = 0; i < frameFns.length; i++) {
        try { frameFns[i](dt, sim.time, real); } catch (err) { console.error(err); frameFns.splice(i, 1); i--; }
      }
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    return sim;
  }

  /* ---------- 글자 스프라이트 ---------- */
  function label(text, o) {
    o = o || {};
    var size = o.size || 48, pad = size * 0.35;
    var cv = document.createElement("canvas"); var ctx = cv.getContext("2d");
    var font = (o.weight || "600") + " " + size + "px " + (o.font || '"IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif');
    ctx.font = font;
    var lines = String(text).split("\n");
    var w = 0; lines.forEach(function (l) { w = Math.max(w, ctx.measureText(l).width); });
    cv.width = Math.ceil(w + pad * 2); cv.height = Math.ceil(lines.length * size * 1.25 + pad * 1.2);
    ctx.font = font;
    if (o.bg !== false) {
      ctx.fillStyle = o.bg || "rgba(10,15,30,0.78)";
      var r = size * 0.3; roundRect(ctx, 0, 0, cv.width, cv.height, r); ctx.fill();
    }
    ctx.fillStyle = o.color || "#e6e9f4"; ctx.textBaseline = "top";
    lines.forEach(function (l, i) { ctx.fillText(l, pad, pad * 0.6 + i * size * 1.25); });
    var tex = new THREE.CanvasTexture(cv);
    tex.minFilter = THREE.LinearFilter;
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: o.depthTest !== undefined ? o.depthTest : false });
    var sp = new THREE.Sprite(mat);
    var hgt = o.height || 0.6;
    sp.scale.set(hgt * cv.width / cv.height, hgt, 1);
    sp.renderOrder = 10;
    return sp;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /* ---------- 궤적 ---------- */
  function Trail(scene, o) {
    o = o || {};
    var max = o.max || 2000;
    var pos = new Float32Array(max * 3);
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setDrawRange(0, 0);
    var mat = o.dashed
      ? new THREE.LineDashedMaterial({ color: o.color || COLORS.track, dashSize: o.dashSize || 0.2, gapSize: o.gapSize || 0.12, transparent: true, opacity: o.opacity || 1 })
      : new THREE.LineBasicMaterial({ color: o.color || COLORS.track, transparent: true, opacity: o.opacity || 1 });
    var line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    scene.add(line);
    var n = 0;
    return {
      line: line,
      push: function (v) {
        if (n >= max) { pos.copyWithin(0, 3); n = max - 1; }
        pos[n * 3] = v.x; pos[n * 3 + 1] = v.y; pos[n * 3 + 2] = v.z; n++;
        geo.attributes.position.needsUpdate = true; geo.setDrawRange(0, n);
        if (o.dashed) line.computeLineDistances();
      },
      clear: function () { n = 0; geo.setDrawRange(0, 0); },
      setColor: function (c) { mat.color.set(c); },
      dispose: function () { scene.remove(line); geo.dispose(); mat.dispose(); },
      get count() { return n; }
    };
  }

  function arrow(origin, dir, len, color) {
    var d = dir.clone().normalize();
    return new THREE.ArrowHelper(d, origin, len, color || 0xffffff, Math.min(len * 0.25, 0.6), Math.min(len * 0.12, 0.3));
  }

  /* ---------- UI ---------- */
  var ui = {
    section: function (parent, title, intro) {
      var s = document.createElement("section"); s.className = "panel-sec";
      if (title) { var h = document.createElement("h2"); h.textContent = title; s.appendChild(h); }
      if (intro) { var p = document.createElement("p"); p.innerHTML = intro; s.appendChild(p); }
      parent.appendChild(s); return s;
    },
    slider: function (parent, o) {
      var wrap = document.createElement("div"); wrap.className = "ctl";
      var id = o.id || ("s" + Math.random().toString(36).slice(2, 8));
      var format = o.format || function (v) { return fmt(v, 3); };
      wrap.innerHTML = '<div class="ctl-row"><label for="' + id + '">' + o.label + '</label><span class="val" id="' + id + '-val"></span></div>' +
        '<input type="range" id="' + id + '" min="' + o.min + '" max="' + o.max + '" step="' + (o.step || "any") + '" value="' + o.value + '">';
      parent.appendChild(wrap);
      var input = wrap.querySelector("input"), out = wrap.querySelector(".val");
      function show() { out.textContent = format(parseFloat(input.value)) + (o.unit ? " " + o.unit : ""); }
      input.addEventListener("input", function () { show(); if (o.onInput) o.onInput(parseFloat(input.value)); });
      show();
      return { el: input, get: function () { return parseFloat(input.value); }, set: function (v) { input.value = v; show(); }, refresh: show };
    },
    select: function (parent, o) {
      var wrap = document.createElement("div"); wrap.className = "ctl";
      var id = o.id || ("q" + Math.random().toString(36).slice(2, 8));
      var html = '<label for="' + id + '" class="ctl-row"><span>' + o.label + '</span></label><select id="' + id + '">';
      o.options.forEach(function (op) { html += '<option value="' + op.value + '"' + (String(op.value) === String(o.value) ? " selected" : "") + ">" + op.label + "</option>"; });
      wrap.innerHTML = html + "</select>";
      parent.appendChild(wrap);
      var sel = wrap.querySelector("select");
      sel.addEventListener("change", function () { if (o.onChange) o.onChange(sel.value); });
      return { el: sel, get: function () { return sel.value; }, set: function (v) { sel.value = v; } };
    },
    toggle: function (parent, o) {
      var id = o.id || ("t" + Math.random().toString(36).slice(2, 8));
      var l = document.createElement("label"); l.className = "ctl-check";
      l.innerHTML = '<input type="checkbox" id="' + id + '"' + (o.checked ? " checked" : "") + "> <span>" + o.label + "</span>";
      parent.appendChild(l);
      var cb = l.querySelector("input");
      cb.addEventListener("change", function () { if (o.onChange) o.onChange(cb.checked); });
      return { el: cb, get: function () { return cb.checked; }, set: function (v) { cb.checked = !!v; } };
    },
    button: function (parent, o) {
      var row = parent.classList && parent.classList.contains("btn-row") ? parent : null;
      if (!row) { row = document.createElement("div"); row.className = "btn-row"; parent.appendChild(row); }
      var b = document.createElement("button"); b.type = "button";
      b.className = "sbtn" + (o.kind ? " sbtn--" + o.kind : "");
      b.textContent = o.label;
      if (o.id) b.id = o.id;
      b.addEventListener("click", function (e) { if (o.onClick) o.onClick(e); });
      row.appendChild(b);
      return b;
    },
    buttonRow: function (parent) { var r = document.createElement("div"); r.className = "btn-row"; parent.appendChild(r); return r; },
    /* readouts: [{key, label, unit}] → {set(key, value, digits)} */
    readouts: function (parent, items) {
      var grid = document.createElement("div"); grid.className = "readouts";
      var map = {};
      items.forEach(function (it) {
        var d = document.createElement("div"); d.className = "readout";
        d.innerHTML = '<span class="k">' + it.label + '</span><span class="v">–</span><span class="u">' + (it.unit || "") + "</span>";
        grid.appendChild(d); map[it.key] = d.querySelector(".v");
      });
      parent.appendChild(grid);
      return {
        set: function (key, v, d) { if (map[key]) map[key].textContent = typeof v === "string" ? v : fmt(v, d === undefined ? 4 : d); }
      };
    },
    html: function (parent, html, cls) { var d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; parent.appendChild(d); return d; }
  };

  /* ---------- 기록표 ---------- */
  function Recorder(parent, o) {
    var cols = o.columns;
    var key = "cern-class:rec:" + (o.id || location.pathname);
    var rows = [];
    try { var saved = localStorage.getItem(key); if (saved) rows = JSON.parse(saved) || []; } catch (e) { rows = []; }
    var wrap = document.createElement("div"); wrap.className = "rec-wrap";
    var table = document.createElement("table"); table.className = "rec";
    if (o.tableId) table.id = o.tableId;
    wrap.appendChild(table); parent.appendChild(wrap);
    var btns = ui.buttonRow(parent);
    ui.button(btns, { label: "표 복사(엑셀 붙여넣기)", onClick: copy });
    var clearBtn = ui.button(btns, { label: "기록 지우기", kind: "warn", onClick: function () {
      if (clearBtn.dataset.armed) { api.clear(); clearBtn.textContent = "기록 지우기"; delete clearBtn.dataset.armed; return; }
      clearBtn.dataset.armed = "1"; clearBtn.textContent = "한 번 더 누르면 지워짐";
      setTimeout(function () { clearBtn.textContent = "기록 지우기"; delete clearBtn.dataset.armed; }, 2500);
    } });
    function head() {
      return "<tr><th>#</th>" + cols.map(function (c) { return "<th>" + c.label + (c.unit ? " (" + c.unit + ")" : "") + "</th>"; }).join("") + "</tr>";
    }
    function render() {
      var h = head();
      if (!rows.length) h += '<tr><td class="empty" colspan="' + (cols.length + 1) + '">아직 기록이 없습니다. 측정 후 [기록]을 누르세요.</td></tr>';
      rows.forEach(function (r, i) {
        h += "<tr><td>" + (i + 1) + "</td>" + cols.map(function (c) {
          var v = r[c.key];
          return "<td>" + (typeof v === "number" ? fmt(v, c.digits || 4) : (v === undefined ? "" : v)) + "</td>";
        }).join("") + "</tr>";
      });
      table.innerHTML = h;
      wrap.scrollTop = wrap.scrollHeight;
    }
    function persist() { try { localStorage.setItem(key, JSON.stringify(rows)); } catch (e) {} }
    function copy() {
      var lines = [cols.map(function (c) { return c.label + (c.unit ? " (" + c.unit + ")" : ""); }).join("\t")];
      rows.forEach(function (r) { lines.push(cols.map(function (c) { return r[c.key] === undefined ? "" : r[c.key]; }).join("\t")); });
      var text = lines.join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("기록표를 복사했어요. 엑셀·구글 시트에 붙여 넣으세요."); }, function () { fallback(text); });
      else fallback(text);
    }
    function fallback(text) {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "width:100%;min-height:8rem;background:#172038;color:#e6e9f4;border:1px solid #26304d;border-radius:6px";
      parent.appendChild(ta); ta.focus(); ta.select();
    }
    render();
    var api = {
      rows: rows,
      add: function (obj) { rows.push(obj); persist(); render(); if (o.onChange) o.onChange(rows); return rows.length; },
      clear: function () { rows.length = 0; persist(); render(); if (o.onChange) o.onChange(rows); },
      render: render
    };
    return api;
  }

  /* ---------- 미션 ---------- */
  function Mission(parent, o) {
    var key = "cern-class:mission:" + (o.id || location.pathname);
    var done = {};
    try { done = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch (e) { done = {}; }
    var bar = document.createElement("div"); bar.className = "progress"; bar.innerHTML = "<i></i>";
    var ol = document.createElement("ol"); ol.className = "mission";
    o.steps.forEach(function (s, i) {
      var li = document.createElement("li"); li.innerHTML = "<span>" + s + "</span>"; if (done[i]) li.className = "done"; ol.appendChild(li);
    });
    parent.appendChild(bar); parent.appendChild(ol);
    function update() {
      var n = Object.keys(done).filter(function (k) { return done[k]; }).length;
      bar.firstChild.style.width = (100 * n / o.steps.length) + "%";
    }
    update();
    return {
      complete: function (i, msg) {
        if (done[i]) return false;
        done[i] = true; ol.children[i].className = "done"; update();
        try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {}
        toast(msg || ("미션 " + (i + 1) + " 완료!"));
        return true;
      },
      isDone: function (i) { return !!done[i]; },
      reset: function () { done = {}; Array.prototype.forEach.call(ol.children, function (li) { li.className = ""; }); update(); try { localStorage.removeItem(key); } catch (e) {} }
    };
  }

  /* ---------- 알림 ---------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  /* ---------- 그래프 (캔버스, 라이브러리 없음) ---------- */
  function setupCanvas(cv) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = cv.clientWidth || 320, h = cv.clientHeight || 200;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }
  function niceTicks(lo, hi, n) {
    var span = hi - lo; if (span <= 0) return [lo];
    var step = Math.pow(10, Math.floor(Math.log10(span / n)));
    var err = (n * step) / span;
    if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2;
    var t = [], s = Math.ceil(lo / step) * step;
    for (var v = s; v <= hi + step * 1e-9; v += step) t.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return t;
  }
  function tickLabel(v) {
    var a = Math.abs(v);
    if (a >= 1e4 || (a > 0 && a < 1e-2)) return v.toExponential(0);
    return String(Number(v.toPrecision(4)));
  }
  var PLOT_THEME = { bg: "#172038", grid: "#26304d", axis: "#7880a0", text: "#a9b0c8", bar: "#7f9cff", curve: "#f0a35e" };

  var plot = {
    theme: PLOT_THEME,
    /* hist: {lo, hi, counts[], xlabel, ylabel, log, color, curve(x)->y (막대 높이 단위), marks:[{x,label,color}], highlight:[a,b]} */
    hist: function (cv, o) {
      var S = setupCanvas(cv), ctx = S.ctx, W = S.w, H = S.h, T = o.theme || PLOT_THEME;
      var m = { l: 48, r: 12, t: 12, b: 36 };
      ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
      var n = o.counts.length, bw = (o.hi - o.lo) / n;
      var ymax = 0; o.counts.forEach(function (c) { if (c > ymax) ymax = c; });
      if (o.curve) for (var k = 0; k <= 200; k++) { var cy = o.curve(o.lo + (o.hi - o.lo) * k / 200); if (cy > ymax) ymax = cy; }
      if (ymax <= 0) ymax = 1;
      var log = !!o.log, ymin = log ? 0.5 : 0, ytop = log ? ymax * 2 : ymax * 1.12;
      function X(x) { return m.l + (x - o.lo) / (o.hi - o.lo) * (W - m.l - m.r); }
      function Y(y) {
        if (log) { y = Math.max(y, ymin); return H - m.b - (Math.log10(y) - Math.log10(ymin)) / (Math.log10(ytop) - Math.log10(ymin)) * (H - m.t - m.b); }
        return H - m.b - (y - ymin) / (ytop - ymin) * (H - m.t - m.b);
      }
      ctx.font = "11px " + '"IBM Plex Mono", monospace'; ctx.fillStyle = T.text; ctx.strokeStyle = T.grid; ctx.lineWidth = 1;
      var yt = log ? (function () { var a = []; for (var p = 0; Math.pow(10, p) <= ytop; p++) a.push(Math.pow(10, p)); return a; })() : niceTicks(0, ytop, 4);
      yt.forEach(function (v) { var y = Y(v); ctx.beginPath(); ctx.moveTo(m.l, y); ctx.lineTo(W - m.r, y); ctx.stroke(); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(tickLabel(v), m.l - 5, y); });
      niceTicks(o.lo, o.hi, Math.max(3, Math.floor((W - 60) / 70))).forEach(function (v) { var x = X(v); ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(tickLabel(v), x, H - m.b + 5); });
      if (o.highlight) { ctx.fillStyle = "rgba(240,163,94,0.12)"; ctx.fillRect(X(o.highlight[0]), m.t, X(o.highlight[1]) - X(o.highlight[0]), H - m.t - m.b); }
      ctx.fillStyle = o.color || T.bar;
      for (var i = 0; i < n; i++) {
        var c = o.counts[i]; if (!c) continue;
        var x0 = X(o.lo + i * bw), x1 = X(o.lo + (i + 1) * bw), y = Y(c);
        ctx.fillRect(x0, y, Math.max(1, x1 - x0 - (x1 - x0 > 3 ? 1 : 0)), H - m.b - y);
      }
      if (o.curve) {
        ctx.strokeStyle = o.curveColor || T.curve; ctx.lineWidth = 2; ctx.beginPath();
        for (var j = 0; j <= 300; j++) { var xv = o.lo + (o.hi - o.lo) * j / 300, yy = Y(o.curve(xv)); if (j) ctx.lineTo(X(xv), yy); else ctx.moveTo(X(xv), yy); }
        ctx.stroke();
      }
      (o.marks || []).forEach(function (mk) {
        if (mk.x < o.lo || mk.x > o.hi) return;
        var x = X(mk.x); ctx.strokeStyle = mk.color || "#5fd08a"; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x, m.t); ctx.lineTo(x, H - m.b); ctx.stroke(); ctx.setLineDash([]);
        if (mk.label) { ctx.fillStyle = mk.color || "#5fd08a"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(mk.label, x + 3, m.t + 2); }
      });
      ctx.strokeStyle = T.axis; ctx.beginPath(); ctx.moveTo(m.l, m.t); ctx.lineTo(m.l, H - m.b); ctx.lineTo(W - m.r, H - m.b); ctx.stroke();
      ctx.fillStyle = T.text; ctx.font = "12px " + '"IBM Plex Sans KR", sans-serif';
      if (o.xlabel) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(o.xlabel, (m.l + W - m.r) / 2, H - 2); }
      if (o.ylabel) { ctx.save(); ctx.translate(11, (m.t + H - m.b) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.ylabel, 0, 0); ctx.restore(); }
      return { X: X, Y: Y, margin: m, width: W, height: H };
    },
    /* xy: {series:[{points:[[x,y]], color, line, dots, label, dash}], xr:[a,b], yr:[a,b], xlabel, ylabel} */
    xy: function (cv, o) {
      var S = setupCanvas(cv), ctx = S.ctx, W = S.w, H = S.h, T = o.theme || PLOT_THEME;
      var m = { l: 50, r: 12, t: 12, b: 36 };
      ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
      var xs = [], ys = [];
      o.series.forEach(function (s) { s.points.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
      var xr = o.xr || [Math.min.apply(null, xs.concat([0])), Math.max.apply(null, xs.concat([1]))];
      var yr = o.yr || [Math.min.apply(null, ys.concat([0])), Math.max.apply(null, ys.concat([1])) * 1.1];
      if (xr[1] === xr[0]) xr[1] = xr[0] + 1; if (yr[1] === yr[0]) yr[1] = yr[0] + 1;
      function X(x) { return m.l + (x - xr[0]) / (xr[1] - xr[0]) * (W - m.l - m.r); }
      function Y(y) { return H - m.b - (y - yr[0]) / (yr[1] - yr[0]) * (H - m.t - m.b); }
      ctx.font = "11px " + '"IBM Plex Mono", monospace'; ctx.fillStyle = T.text; ctx.strokeStyle = T.grid; ctx.lineWidth = 1;
      niceTicks(yr[0], yr[1], 4).forEach(function (v) { var y = Y(v); ctx.beginPath(); ctx.moveTo(m.l, y); ctx.lineTo(W - m.r, y); ctx.stroke(); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(tickLabel(v), m.l - 5, y); });
      niceTicks(xr[0], xr[1], Math.max(3, Math.floor((W - 60) / 70))).forEach(function (v) { ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(tickLabel(v), X(v), H - m.b + 5); });
      ctx.save(); ctx.beginPath(); ctx.rect(m.l, m.t, W - m.l - m.r, H - m.t - m.b); ctx.clip();
      o.series.forEach(function (s) {
        ctx.strokeStyle = ctx.fillStyle = s.color || T.bar; ctx.lineWidth = s.width || 2;
        if (s.dash) ctx.setLineDash(s.dash); else ctx.setLineDash([]);
        if (s.line) { ctx.beginPath(); s.points.forEach(function (p, i) { if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); }); ctx.stroke(); }
        if (s.dots !== false && !s.line || s.dots) s.points.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), s.r || 3.2, 0, Math.PI * 2); ctx.fill(); });
      });
      ctx.restore(); ctx.setLineDash([]);
      ctx.strokeStyle = T.axis; ctx.beginPath(); ctx.moveTo(m.l, m.t); ctx.lineTo(m.l, H - m.b); ctx.lineTo(W - m.r, H - m.b); ctx.stroke();
      ctx.fillStyle = T.text; ctx.font = "12px " + '"IBM Plex Sans KR", sans-serif';
      if (o.xlabel) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(o.xlabel, (m.l + W - m.r) / 2, H - 2); }
      if (o.ylabel) { ctx.save(); ctx.translate(11, (m.t + H - m.b) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.ylabel, 0, 0); ctx.restore(); }
      var lx = m.l + 8, ly = m.t + 6;
      o.series.forEach(function (s) { if (!s.label) return; ctx.fillStyle = s.color || T.bar; ctx.fillRect(lx, ly + 4, 12, 3); ctx.fillStyle = T.text; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(s.label, lx + 16, ly - 1); ly += 15; });
      return { X: X, Y: Y };
    },
    /* 배열 → 히스토그램 도수 */
    bin: function (values, lo, hi, n) {
      var c = new Array(n).fill(0), w = (hi - lo) / n;
      for (var i = 0; i < values.length; i++) { var v = values[i]; if (v >= lo && v < hi) c[Math.floor((v - lo) / w)]++; }
      return c;
    }
  };

  /* ---------- 데이터 ---------- */
  function parseCSV(text) {
    var lines = text.replace(/\r/g, "").split("\n").filter(function (l) { return l.length; });
    var head = lines[0].split(",");
    var out = new Array(lines.length - 1);
    for (var i = 1; i < lines.length; i++) {
      var p = lines[i].split(","), o = {};
      for (var j = 0; j < head.length; j++) { var v = p[j], nv = Number(v); o[head[j]] = v !== "" && !isNaN(nv) ? nv : v; }
      out[i - 1] = o;
    }
    return out;
  }
  var DATA_KEYS = {
    cms_dimuon_2011_mass: "dimuonMass", cms_dimuon_2011_events: "dimuonEvents", cms_zmumu_2011: "zmumu",
    cms_higgs4l_2011_2012: "higgs4l", cms_wmunu_2011: "wmunu"
  };
  var data = {
    parseCSV: parseCSV,
    load: function (name, root) {
      var key = DATA_KEYS[name];
      return new Promise(function (resolve, reject) {
        window.CMSDATA = window.CMSDATA || {};
        if (window.CMSDATA[key]) return resolve(parseCSV(window.CMSDATA[key]));
        var s = document.createElement("script");
        s.src = (root || "../") + "data/js/" + name + ".js";
        s.onload = function () { window.CMSDATA[key] ? resolve(parseCSV(window.CMSDATA[key])) : reject(new Error("데이터가 비어 있습니다")); };
        s.onerror = function () { reject(new Error("데이터 파일을 찾을 수 없습니다: " + s.src)); };
        document.head.appendChild(s);
      });
    },
    /* 사용자가 고른 CSV 파일 읽기 */
    readFile: function (file) {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () { try { resolve(parseCSV(String(r.result))); } catch (e) { reject(e); } };
        r.onerror = reject; r.readAsText(file);
      });
    }
  };

  /* 4-벡터 불변질량: E, px, py, pz 배열 합 */
  function invariantMass(parts) {
    var E = 0, px = 0, py = 0, pz = 0;
    parts.forEach(function (p) { E += p.E; px += p.px; py += p.py; pz += p.pz; });
    var m2 = E * E - px * px - py * py - pz * pz;
    return m2 > 0 ? Math.sqrt(m2) : 0;
  }
  /* 가우스 난수 */
  function gauss(mu, sigma) {
    var u = 1 - Math.random(), v = Math.random();
    return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  window.SimKit = {
    create: create, label: label, Trail: Trail, arrow: arrow, ui: ui, Recorder: Recorder, Mission: Mission,
    toast: toast, plot: plot, data: data, fmt: fmt, C: C, COLORS: COLORS, invariantMass: invariantMass, gauss: gauss
  };
})();
