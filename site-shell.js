/* Shared navigation for every static page. Keep the five destination links identical. */
(function () {
  var links = [
    ['/', 'ГЛАВНАЯ'],
    ['/otdelka/', 'ВНУТРЕННЯЯ ОТДЕЛКА'],
    ['/metallokonstrukcii/', 'МЕТАЛЛ'],
    ['/portfolio/', 'ПРИМЕРЫ РАБОТ'],
    ['/about/', 'О НАС']
  ];

  function isCurrent(href) {
    var path = window.location.pathname.replace(/index\.html$/, '');
    return href === '/' ? path === '/' : path.indexOf(href) === 0;
  }

  function render(target, mobile) {
    if (!target) return;
    target.innerHTML = links.map(function (item) {
      var active = isCurrent(item[0]);
      return '<a href="' + item[0] + '" class="' + (mobile ? 'mobile-menu__link' : 'nav__link') + (active ? ' ' + (mobile ? 'mobile-menu__link--active' : 'nav__link--active') : '') + (active ? '" aria-current="page">' : '">') + item[1] + '</a>';
    }).join('');
  }

  function init() {
    render(document.querySelector('.nav, .ot-nav'), false);
    render(document.querySelector('.mobile-menu, .ot-mobile-menu'), true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
