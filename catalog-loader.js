/* Public catalog reader. Writes remain available only through the authenticated CRM. */
(function () {
  var API_URL = 'https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/catalog';

  function escape(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[character];
    });
  }

  function render(items) {
    var rows = items.map(function (item) {
      return '<tr><td><strong>' + escape(item.name) + '</strong><small>' + escape(item.description || '') + '</small></td><td>' + escape(item.unit || 'шт') + '</td><td>' + escape(item.price) + '</td></tr>';
    }).join('');
    return '<div class="catalog-live__scroll"><table class="catalog-live__table"><thead><tr><th>Наименование</th><th>Ед.</th><th>Цена</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function init() {
    var target = document.querySelector('[data-catalog-live]');
    if (!target) return;
    fetch(API_URL, { headers: { Accept: 'application/json' } })
      .then(function (response) { if (!response.ok) throw new Error('Catalog request failed: ' + response.status); return response.json(); })
      .then(function (items) {
        if (!Array.isArray(items) || !items.length) throw new Error('Catalog is empty');
        target.innerHTML = render(items);
        target.classList.add('is-loaded');
        var fallback = document.querySelector('[data-catalog-fallback]');
        if (fallback) fallback.hidden = true;
      })
      .catch(function (error) {
        target.innerHTML = '<p class="catalog-live__status">Актуальный прайс временно недоступен. Показан сохранённый прайс-лист.</p>';
        target.classList.add('is-error');
        console.warn(error.message);
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
