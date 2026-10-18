/* CERN 탐구 교실 — 공통 스크립트
   - 주제 목록(TOPICS): 모든 페이지의 내비게이션·이전/다음 링크의 단일 출처
   - 상단 바/푸터 삽입, 테마 전환, 학습지 자동 저장, 답안 복사 */
(function () {
  "use strict";

  var TOPICS = [
    { n: 1, level: "basic", title: "CERN과 물질의 기본 구성", short: "물질의 구성", hours: 2 },
    { n: 2, level: "basic", title: "러더퍼드 산란: 보이지 않는 핵을 보는 법", short: "러더퍼드 산란", hours: 2 },
    { n: 3, level: "basic", title: "전기장으로 입자 가속하기", short: "입자 가속", hours: 2 },
    { n: 4, level: "basic", title: "자기장으로 입자 휘기", short: "자기장과 원운동", hours: 2 },
    { n: 5, level: "basic", title: "입자 검출기: 보이지 않는 흔적 찾기", short: "입자 검출기", hours: 2 },
    { n: 6, level: "adv", title: "특수 상대성이론과 우주선 뮤온", short: "상대성과 뮤온", hours: 2 },
    { n: 7, level: "adv", title: "보존 법칙과 불변질량", short: "불변질량", hours: 2 },
    { n: 8, level: "int", title: "나만의 LHC 설계하기", short: "LHC 설계", hours: 2 },
    { n: 9, level: "int", title: "사건 분석가 되기: W·Z 보손 찾기", short: "사건 분석", hours: 2 },
    { n: 10, level: "int", title: "실제 CERN 데이터로 발견하기", short: "실제 데이터 분석", hours: 2 }
  ];
  var LEVELS = {
    basic: { name: "기본과정", cls: "badge--basic" },
    adv: { name: "심화과정", cls: "badge--adv" },
    int: { name: "종합과정", cls: "badge--int" },
    up: { name: "업그레이드", cls: "badge--up" }
  };
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var body = document.body;
  var root = body.getAttribute("data-root") || "";
  var kind = body.getAttribute("data-page") || "";          // home | student | teacher | sim | upgrade | data | guide
  var topicN = parseInt(body.getAttribute("data-topic") || "0", 10);

  /* ---------- 테마 ---------- */
  var THEME_KEY = "cern-class-theme";
  function storedTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  applyTheme(storedTheme());
  function currentTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  /* ---------- 상단 바 ---------- */
  var MARK = '<svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M16 16 C 21 9, 28 8, 30 10" fill="none" stroke="var(--track)" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M16 16 C 10 22, 4 21, 2 19" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M16 16 L 22 28" stroke="var(--lv-basic)" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="2.4" fill="currentColor"/></svg>';

  function link(href, text, current) {
    return '<a href="' + root + href + '"' + (current ? ' aria-current="page"' : "") + ">" + text + "</a>";
  }
  if (kind !== "sim") {
    var bar = document.createElement("header");
    bar.className = "topbar no-print";
    bar.innerHTML = '<div class="topbar__inner">' +
      '<a class="brand" href="' + root + 'index.html">' + MARK + '<span class="brand__name">CERN 탐구 교실</span></a>' +
      '<nav class="topnav" aria-label="주요 메뉴">' +
      link("index.html#map", "차시 지도", kind === "home") +
      link("students/index.html", "학생용", kind === "student") +
      link("teachers/index.html", "교사용", kind === "teacher") +
      link("sims/index.html", "3D 모의실험", false) +
      link("upgrade/index.html", "업그레이드", kind === "upgrade") +
      link("data/index.html", "실제 데이터", kind === "data") +
      "</nav>" +
      '<button class="theme-btn" type="button" id="theme-toggle" aria-label="화면 테마 바꾸기">테마</button>' +
      "</div>";
    body.insertBefore(bar, body.firstChild);
    if (kind === "teacher") {
      var band = document.createElement("div");
      band.className = "teacher-band";
      band.innerHTML = '<div class="teacher-band__inner">교사용 지도서 · 학생에게 배포하지 마세요 (정답·해설 포함)</div>';
      bar.insertAdjacentElement("afterend", band);
    }
    var tbtn = document.getElementById("theme-toggle");
    function label() { tbtn.textContent = currentTheme() === "dark" ? "밝게" : "어둡게"; }
    label();
    tbtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      label();
    });

    var foot = document.createElement("footer");
    foot.className = "footer";
    foot.innerHTML = '<div class="footer__inner">' +
      "<p>CERN 탐구 교실 · 고등학교 입자물리 20시간 프로젝트 수업 자료. 실제 데이터: CMS Open Data(opendata.cern.ch, CC0).</p>" +
      "<p>이 자료는 CERN의 공식 자료가 아닌 교사 제작 수업 자료입니다. 수치와 사실은 CERN 공개 자료를 기준으로 했습니다.</p>" +
      "</div>";
    body.appendChild(foot);
  }

  /* ---------- 이전/다음 ---------- */
  var pagerEl = document.querySelector("[data-pager]");
  if (pagerEl && topicN) {
    var dir = kind === "teacher" ? "teachers/" : "students/";
    var prev = TOPICS[topicN - 2], next = TOPICS[topicN];
    var html = "";
    if (prev) html += '<a class="prev" href="' + root + dir + "t" + pad(prev.n) + '.html"><span>← 이전 주제 ' + prev.n + "</span>" + prev.title + "</a>";
    if (next) html += '<a class="next" href="' + root + dir + "t" + pad(next.n) + '.html"><span>다음 주제 ' + next.n + " →</span>" + next.title + "</a>";
    pagerEl.className = "pager no-print";
    pagerEl.innerHTML = html;
  }

  /* ---------- 학습지 자동 저장 ----------
     .worksheet 안의 입력칸(id 필수)을 이 브라우저에만 저장합니다. */
  var SAVE_PREFIX = "cern-class:" + location.pathname.replace(/^.*\/(students|teachers|upgrade|sims)\//, "$1/") + ":";
  function fields() { return Array.prototype.slice.call(document.querySelectorAll(".worksheet input[id], .worksheet textarea[id], .worksheet select[id]")); }
  fields().forEach(function (el) {
    try {
      var v = localStorage.getItem(SAVE_PREFIX + el.id);
      if (v !== null) { if (el.type === "checkbox") el.checked = v === "1"; else el.value = v; }
    } catch (e) {}
    el.addEventListener("input", function () {
      try { localStorage.setItem(SAVE_PREFIX + el.id, el.type === "checkbox" ? (el.checked ? "1" : "0") : el.value); } catch (e) {}
    });
  });

  function fieldLabel(el) {
    if (el.getAttribute("aria-label")) return el.getAttribute("aria-label");
    var l = document.querySelector('label[for="' + el.id + '"]');
    if (l) return l.textContent.trim();
    var wrap = el.closest("label, .answer-field");
    if (wrap) { var s = wrap.querySelector("span"); if (s) return s.textContent.trim(); }
    return el.id;
  }
  function collectAnswers() {
    var title = document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : document.title;
    var lines = [title, ""];
    fields().forEach(function (el) {
      var v = el.type === "checkbox" ? (el.checked ? "✔" : "") : el.value.trim();
      if (v) lines.push("■ " + fieldLabel(el) + "\n" + v);
    });
    return lines.join("\n");
  }
  function flash(btn, msg) {
    var old = btn.textContent; btn.textContent = msg;
    setTimeout(function () { btn.textContent = old; }, 1800);
  }
  document.querySelectorAll("[data-copy-answers]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = collectAnswers();
      var done = function () { flash(btn, "복사했어요. 과제 제출란에 붙여 넣으세요"); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { showText(text); });
      } else showText(text);
    });
  });
  document.querySelectorAll("[data-clear-answers]").forEach(function (btn) {
    var armed = false;
    btn.addEventListener("click", function () {
      if (!armed) { armed = true; flash(btn, "한 번 더 누르면 모두 지워져요"); setTimeout(function () { armed = false; }, 2500); return; }
      fields().forEach(function (el) {
        if (el.type === "checkbox") el.checked = false; else el.value = "";
        try { localStorage.removeItem(SAVE_PREFIX + el.id); } catch (e) {}
      });
      armed = false; flash(btn, "모두 지웠어요");
    });
  });
  function showText(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.minHeight = "12rem"; ta.setAttribute("aria-label", "복사할 답안");
    var box = document.querySelector("[data-copy-target]") || document.body;
    box.appendChild(ta); ta.focus(); ta.select();
  }

  /* 표 복사 (기록표 → 스프레드시트에 붙여 넣기) */
  document.querySelectorAll("[data-copy-table]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var t = document.getElementById(btn.getAttribute("data-copy-table"));
      if (!t) return;
      var rows = Array.prototype.map.call(t.rows, function (r) {
        return Array.prototype.map.call(r.cells, function (c) {
          var inp = c.querySelector("input, textarea, select");
          return (inp ? inp.value : c.textContent).trim().replace(/\s+/g, " ");
        }).join("\t");
      });
      var text = rows.join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash(btn, "표를 복사했어요"); }, function () { showText(text); });
      } else showText(text);
    });
  });

  window.CERNClass = { TOPICS: TOPICS, LEVELS: LEVELS, pad: pad, root: root };
})();
