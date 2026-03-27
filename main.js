/* ─── NAV / PAGE ROUTING ─── */

function getHeaderOffset() {
  const nav = document.getElementById('mainNav') || document.querySelector('.fv-nav');
  return nav ? nav.offsetHeight : 64;
}

function scrollToId(id) {
  // Ensure home page is active
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const home = document.getElementById('page-home');
  if (home) home.classList.add('active');
  // Close any open mobile menus
  const mob1 = document.getElementById('mobileMenu');
  if (mob1) mob1.style.display = 'none';
  const mob2 = document.getElementById('fvMob');
  if (mob2) mob2.style.display = 'none';
  // Scroll with header offset after paint
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
  const mob1 = document.getElementById('mobileMenu');
  if (mob1) mob1.style.display = 'none';
  const mob2 = document.getElementById('fvMob');
  if (mob2) mob2.style.display = 'none';
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
  const o = document.getElementById('mobileOverlay');
  const h = document.querySelector('.hamburger');
  if (!m) return;
  // Support both class-based pattern (about page) and display pattern (home page)
  if (m.classList.contains('open') !== undefined && o) {
    // Class-based pattern: toggle .open on menu, overlay, and hamburger
    const isOpen = m.classList.contains('open');
    if (isOpen) {
      m.classList.remove('open');
      if (o) o.classList.remove('open');
      if (h) h.classList.remove('open');
    } else {
      m.classList.add('open');
      if (o) o.classList.add('open');
      if (h) h.classList.add('open');
    }
  } else {
    // Display-based pattern
    m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
  }
}

function closeMobile() {
  const m = document.getElementById('mobileMenu');
  const o = document.getElementById('mobileOverlay');
  const h = document.querySelector('.hamburger');
  if (!m) return;
  // Support both patterns
  if (o) {
    m.classList.remove('open');
    if (o) o.classList.remove('open');
    if (h) h.classList.remove('open');
  } else {
    m.style.display = 'none';
  }
}

/* ─── FAQ & LOAN ACCORDIONS ─── */

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
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

/* ─── IFRAME: MOBILE SWITCHER & RESIZE ─── */

document.addEventListener('DOMContentLoaded', function () {
  const f = document.getElementById('application-form');
  const mobileCta = document.getElementById('mobile-apply-cta');
  const wrap = document.getElementById('iframe-wrap');

  if (!f || !mobileCta || !wrap) return;

  // On mobile, hide the iframe and show the direct CTA link instead
  const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    f.style.display = 'none';
    mobileCta.style.display = 'block';
    wrap.style.border = 'none';
    wrap.style.boxShadow = 'none';
    wrap.style.background = 'transparent';
  }

  // Resize iframe via postMessage from the iframe provider
  window.addEventListener('message', function (e) {
    if (!f) return;
    var h = 0;
    if (e.data && e.data.type === 'setHeight' && typeof e.data.height === 'number') h = e.data.height;
    if (e.data && e.data.frameHeight) h = e.data.frameHeight;
    if (e.data && e.data.height) h = e.data.height;
    if (h > 100 && h < 1200) f.style.height = h + 'px';
  });
});

/* ─── IFRAME HEIGHT REPORTER (to parent window) ─── */

function sendHeight() {
  const h = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: 'setHeight', height: h }, '*');
}
const ro = new ResizeObserver(sendHeight);
ro.observe(document.body);
sendHeight();
