/* Vendored from https://github.com/range-et/monad_system (build/monad.js @ 358d055).
 * MIT License, Copyright (c) 2025 Indrajeet Haldar. Do not edit; re-copy to update. */
/**
 * Monad System — Runtime
 * Generated from the Monad System build. Do not edit directly.
 *
 * Handles:
 *   Strata  — theme toggle ([data-mn-theme-toggle]), persists to localStorage
 *   Threshold — nav toggle ([data-mn-threshold-toggle]) + rail drawer ([data-mn-rail-toggle])
 *
 * No dependencies. Drop in <script src="monad.js"></script> before </body>.
 */
(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // Strata — theme toggle
  // data-strata="light|dark" on <html>, persists via localStorage
  // Respects prefers-color-scheme as OS fallback.
  // -----------------------------------------------------------------------
  function initStrata() {
    var root = document.documentElement;
    var stored = localStorage.getItem('mn-strata');

    function syncThemeToggleState() {
      var isLight = root.dataset.strata === 'light';
      document.querySelectorAll('[data-mn-theme-toggle]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(isLight));
      });
    }

    if (stored) {
      root.dataset.strata = stored;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      root.dataset.strata = 'light';
    }

    syncThemeToggleState();

    document.querySelectorAll('[data-mn-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = root.dataset.strata === 'light' ? 'dark' : 'light';
        root.dataset.strata = next;
        localStorage.setItem('mn-strata', next);
        syncThemeToggleState();
      });
    });
  }

  // -----------------------------------------------------------------------
  // Threshold — nav toggle
  // Trigger: [data-mn-threshold-toggle]
  // Target:  [data-mn-threshold-nav]
  // -----------------------------------------------------------------------
  function initThresholdNav() {
    var controls = [];

    document.querySelectorAll('[data-mn-threshold-toggle]').forEach(function (btn, index) {
      var nav = document.querySelector('[data-mn-threshold-nav]');
      if (!nav) return;

      if (!nav.id) {
        nav.id = 'mn-threshold-nav-' + (index + 1);
      }

      btn.setAttribute('aria-controls', nav.id);
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');

      function closeNav() {
        nav.classList.remove('is-open');
        nav.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
      }

      btn.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        nav.setAttribute('aria-hidden', String(!isOpen));
        btn.setAttribute('aria-expanded', String(isOpen));
      });

      controls.push({ btn: btn, nav: nav, closeNav: closeNav });
    });

    if (!controls.length) return;

    document.addEventListener('click', function (e) {
      controls.forEach(function (control) {
        if (!control.btn.contains(e.target) && !control.nav.contains(e.target)) {
          control.closeNav();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      controls.forEach(function (control) {
        control.closeNav();
      });
    });
  }

  // -----------------------------------------------------------------------
  // Threshold — rail drawer (off-canvas sidenav)
  // Trigger: [data-mn-rail-toggle]
  // Target:  [data-mn-rail] (or .monad-rail fallback)
  // -----------------------------------------------------------------------
  function initRail() {
    var rail = document.querySelector('[data-mn-rail]') || document.querySelector('.monad-rail');
    if (!rail) return;

    var railToggles = document.querySelectorAll('[data-mn-rail-toggle]');
    if (!railToggles.length) return;

    var overlay = document.querySelector('[data-mn-rail-overlay]') || document.querySelector('.threshold-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'threshold-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    function openRail() {
      rail.classList.add('is-open');
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      rail.setAttribute('aria-hidden', 'false');
      railToggles.forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'true');
      });
    }

    function closeRail() {
      rail.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      rail.setAttribute('aria-hidden', 'true');
      railToggles.forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    }

    if (!rail.id) {
      rail.id = 'mn-rail';
    }

    railToggles.forEach(function (btn) {
      btn.setAttribute('aria-controls', rail.id);
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        rail.classList.contains('is-open') ? closeRail() : openRail();
      });
    });

    overlay.addEventListener('click', closeRail);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeRail();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1056) closeRail();
    });
  }


  // -----------------------------------------------------------------------
  // Motion tokens
  // -----------------------------------------------------------------------
  var MN = window.MN || {};
  MN.motion = {
    duration: {
      fast: 80,
      base: 160,
      slow: 280,
      slower: 440
    },
    easing: {
      linear: 'linear',
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)'
    }
  };
  window.MN = MN;

  // -----------------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------------
  function init() {
    initStrata();
    initThresholdNav();
    initRail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
