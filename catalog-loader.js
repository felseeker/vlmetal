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

  function renderFallback() {
    var rows = [];
    document.querySelectorAll('.tabs__panel').forEach(function (panel) {
      var category = panel.querySelector('.tabs__desc');
      var title = panel.id.replace('tab-', '').toUpperCase();
      rows.push('<tr class="price-table__category"><td colspan="3">' + escape(title) + '</td></tr>');
      panel.querySelectorAll('.card--product').forEach(function (card) {
        var name = card.querySelector('.card__title');
        var description = card.querySelector('.card__text');
        var price = card.querySelector('.card__price');
        if (name) rows.push('<tr><td><strong>' + escape(name.textContent) + '</strong><small>' + escape(description ? description.textContent : '') + '</small></td><td>шт</td><td>' + escape(price ? price.textContent : 'По запросу') + '</td></tr>');
      });
    });
    return '<div class="catalog-live__scroll"><table class="catalog-live__table"><thead><tr><th>Наименование</th><th>Ед.</th><th>Цена</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>';
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
        target.innerHTML = '<p class="catalog-live__status">Сохранённый прайс-лист</p>' + renderFallback();
        var fallback = document.querySelector('[data-catalog-fallback]');
        if (fallback) fallback.hidden = true;
        target.classList.add('is-error');
        console.warn(error.message);
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
