/* =====================================================================
   AMAN — Portfolio interactions
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('aman-theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('aman-theme', next); } catch (e) {}
  });

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  if (menuBtn) menuBtn.addEventListener('click', function () { navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navLinks.classList.remove('open'); });
  });

  /* ---------- Year ---------- */
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Marquee (duplicate for seamless loop) ---------- */
  var mq = document.getElementById('marquee');
  if (mq) mq.innerHTML += mq.innerHTML;

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var countUp = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else { counters.forEach(function (el) { el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); }); }

  /* ---------- Role tabs ---------- */
  var roleTabs = document.querySelectorAll('.role-tab');
  var rolePanels = document.querySelectorAll('.role-panel');
  roleTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var r = tab.getAttribute('data-role');
      roleTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      rolePanels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== r; });
    });
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  /* ---------- Gallery ---------- */
  var GROUPS = [
    { cat: 'aman',              label: 'Aman Mobile',      web: false, count: 33 },
    { cat: 'org-mobile',        label: 'Organization App', web: false, count: 11 },
    { cat: 'superadmin-mobile', label: 'Super-Admin App',  web: false, count: 17 },
    { cat: 'org-web',           label: 'Org Dashboard',    web: true,  count: 6,  prefix: 'org-web' },
    { cat: 'superadmin-web',    label: 'Super-Admin Web',  web: true,  count: 13, prefix: 'sa-web' }
  ];
  var PREFIX = { 'aman': 'aman', 'org-mobile': 'org-mobile', 'superadmin-mobile': 'sa-mobile', 'org-web': 'org-web', 'superadmin-web': 'sa-web' };

  var gallery = document.getElementById('galleryGrid');
  var shots = [];
  // Interleave so "All" view looks varied but grouped nicely: list mobile groups then web
  GROUPS.forEach(function (g) {
    for (var i = 1; i <= g.count; i++) {
      var n = (i < 10 ? '0' : '') + i;
      var src = 'assets/screenshots/' + g.cat + '/' + PREFIX[g.cat] + '-' + n + '.jpg';
      shots.push({ src: src, cat: g.cat, label: g.label, web: g.web });
    }
  });

  var frag = document.createDocumentFragment();
  shots.forEach(function (s, idx) {
    var d = document.createElement('div');
    d.className = 'shot' + (s.web ? ' web' : '');
    d.setAttribute('data-cat', s.cat);
    d.setAttribute('data-idx', idx);
    d.innerHTML = '<img loading="lazy" src="' + s.src + '" alt="' + s.label + ' screen"><span class="cap">' + s.label + '</span>';
    frag.appendChild(d);
  });
  gallery.appendChild(frag);

  /* filters */
  var filters = document.getElementById('galleryFilters');
  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('.gf'); if (!btn) return;
    filters.querySelectorAll('.gf').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var f = btn.getAttribute('data-filter');
    gallery.querySelectorAll('.shot').forEach(function (sh) {
      sh.hidden = !(f === 'all' || sh.getAttribute('data-cat') === f);
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var current = 0;

  function visibleShots() {
    return Array.prototype.filter.call(gallery.querySelectorAll('.shot'), function (s) { return !s.hidden; });
  }
  function openLb(shotEl) {
    var vis = visibleShots();
    current = vis.indexOf(shotEl);
    render(vis);
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function render(vis) {
    var el = vis[current]; if (!el) return;
    var idx = el.getAttribute('data-idx');
    lbImg.src = shots[idx].src;
    lbCap.textContent = shots[idx].label + ' · ' + (current + 1) + ' / ' + vis.length;
  }
  function step(dir) {
    var vis = visibleShots();
    current = (current + dir + vis.length) % vis.length;
    render(vis);
  }
  function closeLb() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  gallery.addEventListener('click', function (e) {
    var sh = e.target.closest('.shot'); if (sh) openLb(sh);
  });
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbNext').addEventListener('click', function () { step(1); });
  document.getElementById('lbPrev').addEventListener('click', function () { step(-1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });

  /* ---------- Dashboard shot rotation (subtle) ---------- */
  var dashShots = ['sa-web-05', 'sa-web-02', 'sa-web-08', 'sa-web-11'];
  var dashEl = document.getElementById('dashShot');
  if (dashEl) {
    var di = 0;
    setInterval(function () {
      di = (di + 1) % dashShots.length;
      dashEl.style.opacity = '0';
      setTimeout(function () {
        dashEl.src = 'assets/screenshots/superadmin-web/' + dashShots[di] + '.jpg';
        dashEl.style.opacity = '1';
      }, 300);
    }, 4200);
    dashEl.style.transition = 'opacity .3s';
  }
})();
