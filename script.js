/* ============================================================
   VIDEO EDITOR PORTFOLIO — script.js
   Handles: Loader, Custom Cursor, Navbar, Mobile Menu,
            Scroll Reveal, Portfolio Filter, Video Modal,
            Contact Form, Smooth Scroll
   ============================================================ */

'use strict';

// ============================================================
// UTILITY: Wait for DOM
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. LOADING SCREEN
  // ============================================================
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Trigger hero animations after load
      triggerHeroReveal();
    }, 1800);
  });

  document.body.classList.add('loading');

  // ============================================================
  // 2. CUSTOM CURSOR (desktop only)
  // ============================================================
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    // Smooth ring follow with lerp
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .service-card, .filter-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // ============================================================
  // 3. NAVBAR — Scroll behavior
  // ============================================================
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ============================================================
  // 4. MOBILE MENU
  // ============================================================
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ============================================================
  // 5. SCROLL REVEAL ANIMATION
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  function triggerHeroReveal() {
    // Animate hero elements with stagger
    const heroReveals = document.querySelectorAll('#hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 150);
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings if in a grid/flex container
          const parent = entry.target.parentElement;
          const siblings = parent ? parent.querySelectorAll('.reveal') : [];
          let delay = 0;

          siblings.forEach((sib, i) => {
            if (sib === entry.target) delay = i * 80;
          });

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(delay, 400));

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach(el => {
    // Skip hero — handled by triggerHeroReveal
    if (!el.closest('#hero')) {
      revealObserver.observe(el);
    }
  });

  // ============================================================
  // 6. PORTFOLIO FILTER
  // ============================================================
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach((card, i) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Re-animate revealed cards
          card.style.animationDelay = `${i * 50}ms`;
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20 + i * 40);
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ============================================================
  // 7. VIDEO MODAL
  // ============================================================
  const videoModal    = document.getElementById('videoModal');
  const modalIframe   = document.getElementById('modalIframe');
  const modalTitle    = document.getElementById('modalTitle');
  const modalClose    = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openModal(videoUrl, title = '') {
    // Add autoplay param
    const separator = videoUrl.includes('?') ? '&' : '?';
    modalIframe.src = videoUrl + separator + 'autoplay=1';
    modalTitle.textContent = title;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    videoModal.classList.remove('open');
    // Stop video by clearing src
    setTimeout(() => { modalIframe.src = ''; }, 400);
    document.body.style.overflow = '';
  }

  // Portfolio play buttons
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const video = btn.dataset.video;
      const title = btn.dataset.title;
      if (video) openModal(video, title);
    });
  });

  // Featured work play button
  const featuredPlayBtn = document.getElementById('featuredPlayBtn');
  if (featuredPlayBtn) {
    featuredPlayBtn.addEventListener('click', () => {
      const video = featuredPlayBtn.dataset.video;
      const title = featuredPlayBtn.dataset.title;
      if (video) openModal(video, title);
    });
  }

  // Hero reel overlay button
  const reelPlayBtn = document.getElementById('reelPlayBtn');
  const reelOverlay = document.querySelector('.reel-overlay');
  if (reelPlayBtn && reelOverlay) {
    // NOTE: Hero reel plays inline; click overlay to open full modal
    reelOverlay.addEventListener('click', () => {
      // REPLACE THIS: Update with your actual showreel URL
      openModal('https://www.youtube.com/embed/dQw4w9WgXcQ', 'Showreel 2024');
    });
  }

  // Close modal
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) {
      closeModal();
    }
  });

  // ============================================================
  // 8. CONTACT FORM
  // ============================================================
  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
      submitBtn.disabled = true;

      // ============================================================
      // TO MAKE THIS FORM WORK:
      // Option A — Formspree (free):
      //   1. Go to https://formspree.io and create an account
      //   2. Create a new form, get your form ID
      //   3. Replace the fetch URL below with: https://formspree.io/f/YOUR_FORM_ID
      //   4. Remove the simulate setTimeout below
      //
      // Option B — EmailJS (free):
      //   1. Go to https://emailjs.com
      //   2. Set up a service + template
      //   3. Use emailjs.sendForm() instead of fetch
      // ============================================================

      // SIMULATED SUBMIT — replace with real API call
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1500);

      /* UNCOMMENT THIS for Formspree:
      fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
      })
      .catch(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Something went wrong. Please email me directly.');
      });
      */
    });
  }

  // ============================================================
  // 9. ACTIVE NAV LINK ON SCROLL (highlight current section)
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-links a');

  function setActiveNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinksList.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });

  // ============================================================
  // 10. PARALLAX EFFECT — Hero grid on scroll
  // ============================================================
  const gridOverlay = document.querySelector('.grid-overlay');

  if (gridOverlay) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      gridOverlay.style.transform = `translateY(${scrollY * 0.2}px)`;
    }, { passive: true });
  }

  // ============================================================
  // 11. DYNAMIC YEAR IN FOOTER
  // ============================================================
  // NOTE: If you have a year in footer copyright, this keeps it updated
  const yearEl = document.querySelector('.footer-bottom span:first-child');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.textContent = yearEl.textContent.replace(/\d{4}/, year);
  }

  // ============================================================
  // 12. SMOOTH HOVER EFFECT — Portfolio cards
  // ============================================================
  portfolioCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });

  // ============================================================
  // Done!
  // ============================================================
  console.log('%c Video Editor Portfolio Loaded ✓', 'color: #4ade80; font-weight: bold; font-size: 14px;');

});
