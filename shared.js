/* ═══════════════════════════════════════════════════
   FINANCEDVEHICLES — shared.js
   Global JS for all pillar pages
   ═══════════════════════════════════════════════════ */

const AFFILIATE_URL = 'https://superpersonalfinder.com/?aff143428';

/* ─── Mobile Menu ─── */
function toggleMenu() {
  const menu = document.querySelector('.mobile-menu');
  if (menu) menu.classList.toggle('open');
}

/* ─── FAQ Toggle ─── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ═══════════════════════════════════════════════════
   QUIZ SYSTEM
   Pages define window.quizConfig = { steps:[], tip:'', redirectUrl:'' }
   ═══════════════════════════════════════════════════ */

(function () {
  var currentStep = 0;
  var config = null;

  /* Build modal HTML and inject into body */
  function injectQuizModal() {
    var el = document.createElement('div');
    el.id = 'quiz-overlay';
    el.className = 'quiz-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Loan eligibility quiz');
    el.innerHTML = [
      '<div class="quiz-modal">',
        '<button class="quiz-close" id="quiz-close-btn" aria-label="Close">&times;</button>',
        '<div class="quiz-header">',
          '<p class="quiz-label">QUICK ELIGIBILITY QUIZ</p>',
          '<div class="quiz-progress-track"><div class="quiz-progress-bar" id="quiz-bar"></div></div>',
          '<p class="quiz-step-count" id="quiz-count"></p>',
        '</div>',
        '<div class="quiz-body" id="quiz-body"></div>',
      '</div>'
    ].join('');
    document.body.appendChild(el);

    document.getElementById('quiz-close-btn').addEventListener('click', closeQuiz);
    el.addEventListener('click', function (e) { if (e.target === el) closeQuiz(); });
  }

  /* Render a question step */
  function renderStep(index) {
    config = window.quizConfig || defaultConfig();
    var step = config.steps[index];
    var total = config.steps.length;
    var pct = Math.round((index / total) * 100);

    document.getElementById('quiz-bar').style.width = pct + '%';
    document.getElementById('quiz-count').textContent = 'Question ' + (index + 1) + ' of ' + total;

    var opts = step.options.map(function (opt) {
      var safe = opt.replace(/'/g, '&#39;');
      return '<button class="quiz-option" data-value="' + safe + '">' + opt + '</button>';
    }).join('');

    document.getElementById('quiz-body').innerHTML =
      '<p class="quiz-question">' + step.question + '</p>' +
      '<div class="quiz-options">' + opts + '</div>';

    /* Wire option clicks */
    document.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.quiz-option').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        setTimeout(function () {
          currentStep++;
          if (currentStep < config.steps.length) {
            renderStep(currentStep);
          } else {
            renderTip();
          }
        }, 280);
      });
    });
  }

  /* Render final tip then redirect */
  function renderTip() {
    document.getElementById('quiz-bar').style.width = '100%';
    document.getElementById('quiz-count').textContent = 'All done!';

    document.getElementById('quiz-body').innerHTML =
      '<div class="quiz-tip-step">' +
        '<div class="quiz-tip-icon">&#128161;</div>' +
        '<p class="quiz-tip-label">One Tip Before You Apply</p>' +
        '<p class="quiz-tip-text">' + config.tip + '</p>' +
        '<div class="quiz-redirecting">' +
          '<div class="quiz-spinner"></div>' +
          '<p>Finding your best options&hellip;</p>' +
        '</div>' +
      '</div>';

    setTimeout(function () {
      window.location.href = config.redirectUrl || AFFILIATE_URL;
    }, 3200);
  }

  /* Open / close */
  window.openQuiz = function () {
    currentStep = 0;
    config = window.quizConfig || defaultConfig();
    var overlay = document.getElementById('quiz-overlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderStep(0);
  };

  function closeQuiz() {
    var overlay = document.getElementById('quiz-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* Fallback config if page hasn't defined one */
  function defaultConfig() {
    return {
      steps: [
        {
          question: 'What best describes your income?',
          options: ['Employed full-time', 'Self-employed / Freelance', 'Benefits or Pension', 'Other / Mixed income']
        },
        {
          question: "What's your main goal today?",
          options: ['Get a car despite bad credit', 'Finance with no credit history', 'Find the lowest payment', 'Urgently need a car']
        }
      ],
      tip: 'Most lenders focus on whether you can afford repayments today — not what happened to your credit in the past. A stable income, even from benefits, is often enough to get approved.',
      redirectUrl: AFFILIATE_URL
    };
  }

  /* ─── DOM Ready ─── */
  document.addEventListener('DOMContentLoaded', function () {

    /* Inject quiz modal */
    injectQuizModal();

    /* Wire all CTA buttons that carry data-open-quiz */
    document.querySelectorAll('[data-open-quiz]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.openQuiz();
      });
    });

    /* Close mobile menu on outside click */
    document.addEventListener('click', function (e) {
      var menu = document.querySelector('.mobile-menu');
      var hamburger = document.querySelector('.hamburger');
      if (menu && menu.classList.contains('open')) {
        if (!menu.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
          menu.classList.remove('open');
        }
      }
    });

  });

})();
