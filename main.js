/* ============================================================
   PORTFOLIO v2 — SANDI ANDIKA PUTRA
   File  : js/main.js
   Revisi: v2.1 — Bug fixes & refactoring

   DAFTAR FITUR (Ctrl+F untuk cari):
   1.  LOADING SCREEN
   2.  CUSTOM CURSOR
   3.  NAVBAR — Scroll & active link
   4.  SCROLL PROGRESS BAR
   5.  SCROLL REVEAL (IntersectionObserver)
   6.  TYPED TEXT — Hero
   7.  COUNTER ANIMATION — Hero stats
   8.  PARTICLE CANVAS — Hero background
   9.  SKILL TAB FILTER
   10. PROJECT FILTER + BENTO GRID FIX
   11. EXPERIENCE TABS
   12. PROJECT MODALS
   13. CONTACT FORM
   14. THEME TOGGLE
   15. BACK TO TOP
   16. SMOOTH SCROLL
   17. FOOTER YEAR
============================================================ */

'use strict';

/* ════════════════════════════════════════════
   HELPERS — Fungsi bantu internal
════════════════════════════════════════════ */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function isInViewport(el) {
  var rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - 60;
}


/* ════════════════════════════════════════════
   1. LOADING SCREEN
════════════════════════════════════════════ */
window.addEventListener('load', function () {
  setTimeout(function () {
    var loader = $('#loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(function () { loader.style.display = 'none'; }, 500);
    }
    // Trigger reveal untuk elemen yang langsung terlihat
    $$('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
      if (isInViewport(el)) el.classList.add('visible');
    });
  }, 1600);
});


/* ════════════════════════════════════════════
   2. CUSTOM CURSOR (Removed)
════════════════════════════════════════════ */


/* ════════════════════════════════════════════
   3. NAVBAR — Scroll behavior & active link
════════════════════════════════════════════ */
(function () {
  var navbar    = $('#navbar');
  var navLinks  = $$('.nav-link');
  var sections  = $$('section[id]');
  var navHeight = 72; // sama dengan --nav-h di CSS

  function onScroll() {
    // Sticky style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight nav link aktif berdasarkan posisi scroll
    var scrollPos = window.scrollY + navHeight + 20;
    sections.forEach(function (sec) {
      var top    = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        var match = $('[href="#' + sec.id + '"]', navbar);
        if (match) match.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger menu
  var hamburger  = $('#hamburger');
  var navLinksEl = $('#navLinks');
  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinksEl.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    $$('a', navLinksEl).forEach(function (a) {
      a.addEventListener('click', function () {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    // Tutup menu jika tekan Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }
})();


/* ════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
════════════════════════════════════════════ */
(function () {
  var el = $('#scrollProgress');
  if (!el) return;
  window.addEventListener('scroll', function () {
    var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    el.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();


/* ════════════════════════════════════════════
   5. SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════════ */
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);

      // Animasi skill bar saat skill-card masuk viewport
      if (entry.target.classList.contains('skill-card')) {
        animateSkillBar(entry.target);
      }
      // Animasi counter saat hero stats masuk viewport
      if (entry.target.classList.contains('hero-stats')) {
        animateCounters();
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal-up, .reveal-left, .reveal-right, .skill-card, .hero-stats').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ════════════════════════════════════════════
   6. TYPED TEXT (Hero)
════════════════════════════════════════════ */
(function () {
  var el = $('#typedText');
  if (!el) return;

  // ── Tambah/ubah kata-kata di sini ──
  var words = ['Web Developer', 'UI/UX Designer', 'Problem Solver', 'Educator & Coder', 'Tech Enthusiast'];
  var idx = 0, charIdx = 0, deleting = false, delay = 120;

  function type() {
    var current = words[idx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      delay = charIdx === current.length ? 1800 : 110;
      if (charIdx === current.length) deleting = true;
    } else {
      el.textContent = current.slice(0, --charIdx);
      delay = charIdx === 0 ? 400 : 60;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % words.length;
      }
    }
    setTimeout(type, delay);
  }

  setTimeout(type, 1900); // Mulai setelah loading screen selesai
})();


/* ════════════════════════════════════════════
   7. COUNTER ANIMATION (Hero Stats)
════════════════════════════════════════════ */
var countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  $$('.stat-num[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var start  = 0;
    var step   = Math.ceil(target / 40);
    var timer  = setInterval(function () {
      start = Math.min(start + step, target);
      el.textContent = start;
      if (start >= target) clearInterval(timer);
    }, 40);
  });
}

/* ════════════════════════════════════════════
   SKILL BAR ANIMATION — Helper
════════════════════════════════════════════ */
function animateSkillBar(card) {
  var bar = card.querySelector('.skill-bar-fill');
  if (bar) bar.style.width = (bar.getAttribute('data-width') || '0') + '%';
}

function animateAllVisibleSkillBars() {
  $$('.skill-card:not(.filtered-out)').forEach(function (card) {
    if (isInViewport(card)) animateSkillBar(card);
  });
}


/* ════════════════════════════════════════════
   8. PARTICLE CANVAS (Hero Background)
════════════════════════════════════════════ */
(function () {
  var canvas = $('#particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = $('#hero') ? $('#hero').offsetHeight : window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
  }

  // ── Ubah angka 60 untuk jumlah partikel ──
  for (var i = 0; i < 60; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,255,' + p.alpha + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ════════════════════════════════════════════
   9. SKILL TAB FILTER
════════════════════════════════════════════ */
(function () {
  var tabs  = $$('.skill-tab');
  var cards = $$('.skill-card');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      var filter = tab.getAttribute('data-tab');
      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('filtered-out', !show);
        // Re-animasikan skill bar untuk card yang baru ditampilkan
        if (show) {
          setTimeout(function () { animateSkillBar(card); }, 50);
        }
      });
    });
  });
})();


/* ════════════════════════════════════════════
   10. PROJECT FILTER + BENTO GRID FIX
        BUGFIX: Grid bento-card nth-child
        tidak berfungsi dengan benar saat filter
        aktif karena hidden items masih di-count.
        Solusi: tambahkan kelas "bento-filtered"
        untuk switch ke auto-fill grid.
════════════════════════════════════════════ */
(function () {
  var btns  = $$('.filter-btn');
  var cards = $$('.bento-card');
  var grid  = $('#projectGrid');
  if (!btns.length || !grid) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      var isAll  = filter === 'all';

      // Toggle class yang mengubah layout grid
      grid.classList.toggle('bento-filtered', !isAll);

      cards.forEach(function (card) {
        var show = isAll || card.getAttribute('data-category') === filter;
        card.classList.toggle('hide', !show);
      });
    });
  });
})();


/* ════════════════════════════════════════════
   11. EXPERIENCE TABS
════════════════════════════════════════════ */
(function () {
  var tabs = $$('.exp-tab');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      var targetId = 'exp-' + tab.getAttribute('data-exp');

      $$('.timeline-wrap').forEach(function (tw) {
        tw.classList.add('hidden');
      });

      var panel = $('#' + targetId);
      if (panel) {
        panel.classList.remove('hidden');
        // Re-trigger animasi reveal untuk item yang baru tampil
        $$('.reveal-up', panel).forEach(function (el) {
          el.classList.remove('visible');
          // Paksa reflow agar transisi CSS berjalan ulang
          void el.offsetHeight;
          setTimeout(function () { el.classList.add('visible'); }, 60);
        });
      }
    });
  });
})();


/* ════════════════════════════════════════════
   12. PROJECT MODALS
        REFACTOR: Gunakan data-modal attribute
        di HTML, bukan onclick inline.
        Ini lebih bersih dan mudah dikembangkan.
════════════════════════════════════════════ */
(function () {
  var overlay = $('#modalOverlay');
  if (!overlay) return;

  function openModal(modalId) {
    $$('.modal', overlay).forEach(function (m) { m.classList.add('hidden'); });
    var target = $('#' + modalId, overlay);
    if (target) {
      target.classList.remove('hidden');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Fokus ke tombol tutup untuk aksesibilitas
      var closeBtn = target.querySelector('.modal-close');
      if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 100);
    }
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Kembalikan fokus ke card yang membuka modal
    if (lastFocusedCard) lastFocusedCard.focus();
    lastFocusedCard = null;
  }

  var lastFocusedCard = null;

  // Event pada setiap bento card
  $$('.bento-card[data-modal]').forEach(function (card) {
    function activate() {
      lastFocusedCard = card;
      openModal(card.getAttribute('data-modal'));
    }
    card.addEventListener('click', activate);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  // Event pada tombol modal-close
  $$('.modal-close', overlay).forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });

  // Tutup jika klik di luar modal
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Tutup dengan Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // Expose ke global jika masih diperlukan (backward compat)
  window.openModal  = openModal;
  window.closeModal = closeModal;
})();


/* ════════════════════════════════════════════
   13. CONTACT FORM — Validasi & Pengiriman
════════════════════════════════════════════ */
(function () {
  var form = $('#contactForm');
  if (!form) return;

  var textarea  = $('#fmessage');
  var charCount = $('#charCount');
  var MAX_CHARS = 500;

  // Live character counter
  if (textarea && charCount) {
    textarea.addEventListener('input', function () {
      var len = Math.min(textarea.value.length, MAX_CHARS);
      if (textarea.value.length > MAX_CHARS) {
        textarea.value = textarea.value.slice(0, MAX_CHARS);
      }
      charCount.textContent = len + ' / ' + MAX_CHARS;
      charCount.style.color = len >= MAX_CHARS ? 'var(--error)' : '';
    });
  }

  // Helpers validasi
  function setError(fieldId, msg) {
    var errEl  = $('#err-' + fieldId);
    var input  = $('#f' + fieldId);
    if (errEl) errEl.textContent = msg;
    if (input) input.classList.toggle('error', !!msg);
  }
  function clearErrors() {
    ['fname','femail','fsubject','fmessage'].forEach(function (id) { setError(id, ''); });
  }
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  // Submit handler
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var fname    = $('#fname').value.trim();
    var femail   = $('#femail').value.trim();
    var fsubject = $('#fsubject').value.trim();
    var fmessage = $('#fmessage').value.trim();
    var valid    = true;

    if (!fname || fname.length < 3) {
      setError('fname', !fname ? 'Nama tidak boleh kosong.' : 'Nama minimal 3 karakter.');
      valid = false;
    }
    if (!femail || !isValidEmail(femail)) {
      setError('femail', !femail ? 'Email tidak boleh kosong.' : 'Format email tidak valid.');
      valid = false;
    }
    if (!fsubject) { setError('fsubject', 'Subjek tidak boleh kosong.'); valid = false; }
    if (!fmessage || fmessage.length < 10) {
      setError('fmessage', !fmessage ? 'Pesan tidak boleh kosong.' : 'Pesan minimal 10 karakter.');
      valid = false;
    }
    if (!valid) return;

    var btn     = $('#submitBtn');
    var btnText = btn.querySelector('.btn-text');
    var btnLoad = btn.querySelector('.btn-loading');
    var success = $('#formSuccess');

    btn.disabled = true;
    btnText.classList.add('hidden');
    btnLoad.classList.remove('hidden');

    setTimeout(function () {
      btn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoad.classList.add('hidden');
      success.classList.remove('hidden');
      form.reset();
      if (charCount) charCount.textContent = '0 / ' + MAX_CHARS;

      // Buka klien email (fallback)
      var mailto = 'mailto:sandiandikaputra@email.com'
        + '?subject=' + encodeURIComponent(fsubject)
        + '&body=' + encodeURIComponent('Dari: ' + fname + ' (' + femail + ')\n\n' + fmessage);
      window.location.href = mailto;

      setTimeout(function () { success.classList.add('hidden'); }, 6000);
    }, 1800);
  });

  // Validasi saat blur
  ['fname','femail','fsubject','fmessage'].forEach(function (id) {
    var el = $('#f' + id);
    if (!el) return;
    el.addEventListener('blur', function () {
      if (!el.value.trim()) setError(id, 'Field ini wajib diisi.');
    });
    el.addEventListener('input', function () {
      if (el.value.trim()) setError(id, '');
    });
  });
})();


/* ════════════════════════════════════════════
   14. THEME TOGGLE (Dark / Light)
════════════════════════════════════════════ */
(function () {
  var btn  = $('#themeToggle');
  var icon = btn && btn.querySelector('.theme-icon');
  if (!btn) return;

  var saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', 'Ganti ke tema ' + (theme === 'dark' ? 'terang' : 'gelap'));
  }
})();


/* ════════════════════════════════════════════
   15. BACK TO TOP
════════════════════════════════════════════ */
(function () {
  var btn = $('#backToTop');
  if (!btn) return;

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  }, { passive: true });
})();


/* ════════════════════════════════════════════
   16. SMOOTH SCROLL (anchor links)
════════════════════════════════════════════ */
(function () {
  var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = $(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


/* ════════════════════════════════════════════
   17. FOOTER YEAR — Update otomatis setiap tahun
════════════════════════════════════════════ */
(function () {
  var el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();
