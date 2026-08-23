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
    document.querySelectorAll('.header .btn--header, .ot-header .ot-btn--header').forEach(function (button) {
      button.remove();
    });
    addSharedContact();
  }

  function addSharedContact() {
    if (window.location.pathname.indexOf('/privacy') !== -1 || document.querySelector('.contacts__map, .ot-contacts')) return;
    var footer = document.querySelector('footer');
    if (!footer) return;
    var section = document.createElement('section');
    section.className = 'section section--dark shared-contact';
    section.id = 'shared-contact';
    section.innerHTML = '<div class="container"><p class="section__label">КОНТАКТЫ</p><h2 class="section__title">СВЯЖИТЕСЬ С НАМИ</h2><div class="shared-contact__grid"><form class="contacts__form shared-contact__form" data-shared-lead><label for="shared-name">Имя</label><input id="shared-name" class="form__input" name="name" required><label for="shared-phone">Телефон</label><input id="shared-phone" class="form__input" name="phone" type="tel" required><label for="shared-message">Сообщение</label><textarea id="shared-message" class="form__input form__textarea" name="message" rows="4"></textarea><label class="form__checkbox"><input type="checkbox" name="consent" required><span>Согласен(на) на <a href="/privacy/">обработку персональных данных</a></span></label><button class="btn btn--primary" type="submit">ОТПРАВИТЬ ЗАЯВКУ</button><p class="shared-contact__status" role="status" aria-live="polite"></p></form><div class="shared-contact__info"><iframe src="https://yandex.ru/map-widget/v1/?ll=131.8994%2C43.1735&z=17&l=map&pt=131.8994%2C43.1735%2Cpm2rdl" title="Карта: Владивосток, ул. Татарская, 11" loading="lazy"></iframe><p>г. Владивосток, ул. Татарская, 11</p><p><a href="tel:+79242310478">+7 (924) 231-04-78</a></p><p><a href="https://t.me/KCTROOO">Telegram</a> · <a href="https://wa.me/message/VJAZDFZV5M5SF1">WhatsApp</a> · <a href="https://max.ru/u/f9LHodD0cOIhWz1pJrinOgTwp9A1PMQgZc584VIY2YQQNypJtIwFR183NDM">MAX</a></p></div></div></div>';
    footer.parentNode.insertBefore(section, footer);
    section.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      var button = form.querySelector('button');
      var status = form.querySelector('.shared-contact__status');
      button.disabled = true;
      fetch('https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/website-lead', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), message: form.elements.message.value.trim(), consent: form.elements.consent.checked}) })
        .then(function (response) { if (!response.ok) throw new Error('submit failed'); status.textContent = 'Заявка отправлена.'; form.reset(); })
        .catch(function () { status.textContent = 'Не удалось отправить. Позвоните нам.'; })
        .finally(function () { button.disabled = false; });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
