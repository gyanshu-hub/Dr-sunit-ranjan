/* =========================================================
   DR. SANDIP KUMAR GUPTA – Main JavaScript
   ========================================================= */

'use strict';

/* ─── Sticky Header ─── */
const header = document.getElementById('main-header');
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  highlightNavLink();
}
window.addEventListener('scroll', handleScroll, { passive: true });

/* ─── Mobile Nav (Hamburger) ─── */
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
const overlay = document.getElementById('mobile-nav-overlay');

function openNav() {
  mainNav.classList.add('open');
  overlay.classList.add('active');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  mainNav.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (mainNav.classList.contains('open')) {
    closeNav();
  } else {
    openNav();
  }
});
overlay.addEventListener('click', closeNav);

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

/* ─── Active Nav Link Highlight on Scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

/* ─── Smooth Scroll for Anchor Links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ─── Intersection Observer – Fade-in Animations ─── */
const animatedElements = document.querySelectorAll(
  '.fade-in-up, .fade-in-left, .fade-in-right'
);

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      observer.unobserve(el);
    }
  });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

/* ─── Counter Animation (Hero Stats) ─── */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const startTime = performance.now();
  const isPercent = el.dataset.suffix === '%';
  const hasPlus = el.dataset.suffix === '+';

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
  }
  requestAnimationFrame(update);
}

// Observe hero stats for counter animation
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(el => {
          const text = el.textContent.trim();
          const num = parseInt(text.replace(/[^0-9]/g, ''));
          const suffix = text.replace(/[0-9,]/g, '');
          el.dataset.suffix = suffix;
          if (!isNaN(num)) animateCounter(el, num);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(statsSection);
}

/* ─── Appointment Form Submission ─── */
const apptForm = document.getElementById('appointment-form');
const apptSuccess = document.getElementById('form-success');

if (apptForm) {
  apptForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = this.querySelector('#appt-name').value.trim();
    const phone = this.querySelector('#appt-phone').value.trim();

    if (!name) {
      showFieldError(this.querySelector('#appt-name'), 'Please enter your full name.');
      return;
    }
    if (!phone) {
      showFieldError(this.querySelector('#appt-phone'), 'Please enter your phone number.');
      return;
    }

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      apptForm.style.display = 'none';
      apptSuccess.style.display = 'block';

      // WhatsApp redirect with details
      const date = document.getElementById('appt-date').value;
      const time = document.getElementById('appt-time').value;
      const reason = document.getElementById('appt-reason').value;
      const msg = encodeURIComponent(
        `Hello Dr. Sandip,\n\nI'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}${date ? '\nDate: ' + date : ''}${time ? '\nTime: ' + time : ''}${reason ? '\nReason: ' + reason : ''}`
      );

      // Optional: open WhatsApp after short delay
      setTimeout(() => {
        window.open(`https://wa.me/919661784780?text=${msg}`, '_blank');
      }, 1500);

      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1200);
  });
}

/* ─── Contact Form Submission ─── */
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const inputs = this.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        showFieldError(input, 'This field is required.');
        valid = false;
      }
    });
    if (!valid) return;

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      contactSuccess.style.display = 'block';
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1000);
  });
}

/* ─── Field Validation Helper ─── */
function showFieldError(input, message) {
  input.focus();
  input.style.borderColor = '#e74c3c';
  input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';

  // Remove error style after typing
  input.addEventListener('input', function () {
    this.style.borderColor = '';
    this.style.boxShadow = '';
  }, { once: true });
}

/* ─── Set min date for appointment date picker ─── */
const dateInput = document.getElementById('appt-date');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/* ─── Floating Buttons – Show after scroll ─── */
const floatingButtons = document.querySelectorAll('.floating-btn');
function toggleFloatingButtons() {
  if (window.scrollY > 300) {
    floatingButtons.forEach(btn => {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    });
  } else {
    floatingButtons.forEach(btn => {
      btn.style.opacity = '0.85';
    });
  }
}
window.addEventListener('scroll', toggleFloatingButtons, { passive: true });

/* ─── Service Cards – stagger on mobile ─── */
function initServiceCards() {
  const cards = document.querySelectorAll('.service-card, .testimonial-card');
  cards.forEach((card, i) => {
    if (!card.dataset.delay) {
      card.dataset.delay = i * 80;
    }
  });
}
initServiceCards();

/* ─── Page Load Init ─── */
window.addEventListener('DOMContentLoaded', () => {
  handleScroll();
  toggleFloatingButtons();

  // Trigger visible for elements already in viewport
  setTimeout(() => {
    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 100);
});

/* ─── Keyboard Navigation Support ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mainNav.classList.contains('open')) {
    closeNav();
  }
});
