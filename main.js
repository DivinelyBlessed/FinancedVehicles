/* ─── NAV / PAGE ROUTING ─── */

function getHeaderOffset() {
  const nav = document.getElementById('mainNav') || document.querySelector('.fv-nav');
  return nav ? nav.offsetHeight : 64;
}

function scrollToId(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const home = document.getElementById('page-home');
  if (home) home.classList.add('active');
  closeMobile();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + name);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function showPageAndScroll(name, id) {
  const currentPage = document.getElementById('page-' + name);
  const isAlreadyActive = currentPage && currentPage.classList.contains('active');
  if (!isAlreadyActive) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    if (currentPage) currentPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  closeMobile();
  setTimeout(function () {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, isAlreadyActive ? 0 : 80);
}

function scrollToSection(id) { scrollToId(id); }

function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  const h = document.querySelector('.hamburger');
  if (!m) return;
  const isOpen = m.style.display === 'flex';
  m.style.display = isOpen ? 'none' : 'flex';
  if (h) h.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}

function closeMobile() {
  const m = document.getElementById('mobileMenu');
  const h = document.querySelector('.hamburger');
  if (!m) return;
  m.style.display = 'none';
  if (h) h.setAttribute('aria-expanded', 'false');
}

/* ─── FAQ & LOAN ACCORDIONS ─── */

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    const b = i.querySelector('.faq-q');
    if (b) b.setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function toggleLoan(event, card) {
  if (event) event.stopPropagation();
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.loan-card').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}

window.addEventListener('click', function (e) {
  if (!e.target.closest('.loan-card')) {
    document.querySelectorAll('.loan-card').forEach(c => c.classList.remove('open'));
  }
});

/* ─── QUIZ MODAL ─── */

document.addEventListener('DOMContentLoaded', function () {
  const cfg = window.quizConfig;
  if (!cfg) return;

  // Build modal DOM
  const modal = document.createElement('div');
  modal.id = 'quiz-modal';
  modal.innerHTML =
    '<div class="quiz-overlay"></div>' +
    '<div class="quiz-box">' +
      '<button class="quiz-close" aria-label="Close">✕</button>' +
      '<div class="quiz-body"></div>' +
    '</div>';
  document.body.appendChild(modal);

  let step = 0;

  function renderStep() {
    const body = modal.querySelector('.quiz-body');
    if (step < cfg.steps.length) {
      const s = cfg.steps[step];
      body.innerHTML =
        '<p class="quiz-step-label">Step ' + (step + 1) + ' of ' + cfg.steps.length + '</p>' +
        '<h3 class="quiz-question">' + s.question + '</h3>' +
        '<div class="quiz-options">' +
          s.options.map(function (o) {
            return '<button class="quiz-opt">' + o + '</button>';
          }).join('') +
        '</div>';
      body.querySelectorAll('.quiz-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          body.querySelectorAll('.quiz-opt').forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          setTimeout(function () { step++; renderStep(); }, 380);
        });
      });
    } else {
      body.innerHTML =
        '<div class="quiz-tip">💡 ' + cfg.tip + '</div>' +
        '<p class="quiz-redirecting">Finding your best options…</p>';
      setTimeout(function () { window.location.href = cfg.redirectUrl; }, 1800);
    }
  }

  window.openQuiz = function () {
    step = 0;
    renderStep();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeQuiz = function () {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modal.querySelector('.quiz-overlay').addEventListener('click', closeQuiz);
  modal.querySelector('.quiz-close').addEventListener('click', closeQuiz);

  // Wire all [data-open-quiz] triggers
  document.querySelectorAll('[data-open-quiz]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openQuiz();
    });
  });
});
