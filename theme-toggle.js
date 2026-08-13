// Theme toggle (light/dark) with localStorage persistence.
// Works with any element carrying the class "theme-toggle" (there can be
// multiple instances on one page, e.g. desktop header + mobile menu).
(function() {
  var root = document.documentElement;
  var STORAGE_KEY = 'site-theme';

  function getTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme, animate) {
    if (animate) {
      document.body.classList.add('theme-animated');
      window.setTimeout(function() {
        document.body.classList.remove('theme-animated');
      }, 400);
    }
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    document.querySelectorAll('.theme-toggle').forEach(function(b) {
      b.setAttribute('aria-pressed', theme === 'light');
    });
  }

  function init() {
    var btns = document.querySelectorAll('.theme-toggle');
    if (!btns.length) return;
    btns.forEach(function(btn) {
      btn.setAttribute('aria-pressed', getTheme() === 'light');
      btn.addEventListener('click', function() {
        var next = getTheme() === 'light' ? 'dark' : 'light';
        setTheme(next, true);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
