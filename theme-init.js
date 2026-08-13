// Applies saved theme before first paint to avoid flash of wrong theme (FOUC)
// Must be loaded synchronously in <head>, before any CSS renders.
(function() {
  try {
    var saved = localStorage.getItem('site-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {}
})();
