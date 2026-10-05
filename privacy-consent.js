(function () {
  'use strict';

  var CONSENT_KEY = 'vlmetal.privacy-consent';
  var CONSENT_VERSION = '2026-10-05';
  var CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
  var METRIKA_ID = 109981508;
  var analyticsStarted = false;
  var memoryConsent = null;
  var currentConsent = readConsent();
  var sourceScript = document.currentScript;
  var scriptUrl = sourceScript && sourceScript.src ? new URL(sourceScript.src) : new URL('privacy-consent.js', document.baseURI);
  var styleUrl = new URL('privacy-consent.css', scriptUrl);
  var stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = styleUrl.href;
  stylesheet.dataset.privacyConsentStyles = 'true';
  document.head.appendChild(stylesheet);

  function readConsent() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || 'null');
      if (!saved || saved.version !== CONSENT_VERSION || !saved.savedAt || Date.now() - saved.savedAt > CONSENT_LIFETIME) return null;
      return { analytics: saved.analytics === true, version: saved.version, savedAt: saved.savedAt };
    } catch (error) {
      return memoryConsent;
    }
  }

  function saveConsent(analytics) {
    var saved = { analytics: analytics === true, version: CONSENT_VERSION, savedAt: Date.now() };
    memoryConsent = saved;
    currentConsent = saved;
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(saved));
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadAnalytics() {
    if (analyticsStarted || !currentConsent || currentConsent.analytics !== true) return;
    analyticsStarted = true;

    window.dataLayer = window.dataLayer || [];
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = window.ym.l || Date.now();
    window.ym(METRIKA_ID, 'init', {
      clickmap: false,
      trackLinks: false,
      accurateTrackBounce: false,
      webvisor: false,
      ecommerce: false
    });
    var metrika = document.createElement('script');
    metrika.async = true;
    metrika.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID;
    document.head.appendChild(metrika);


  }

  function clearAnalyticsIdentifiers() {
    var cookies = document.cookie ? document.cookie.split(';') : [];
    cookies.forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (/^(_ym|_tmr|tmr_)/i.test(name)) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.hostname + '; SameSite=Lax';
      }
    });
    try {
      var keys = [];
      for (var i = 0; i < window.localStorage.length; i += 1) keys.push(window.localStorage.key(i));
      keys.forEach(function (key) {
        if (key && /^(?:_?ym|_?tmr|tmr_)/i.test(key)) window.localStorage.removeItem(key);
      });
    } catch (error) {
      // Storage may be disabled by the browser.
    }
    try {
      var sessionKeys = [];
      for (var j = 0; j < window.sessionStorage.length; j += 1) sessionKeys.push(window.sessionStorage.key(j));
      sessionKeys.forEach(function (key) {
        if (key && /^(?:_?ym|_?tmr|tmr_)/i.test(key)) window.sessionStorage.removeItem(key);
      });
    } catch (error) {
      // Storage may be disabled by the browser.
    }
  }

  function addFooterControl(openSettings) {
    var footer = document.querySelector('.footer-bottom');
    if (!footer || footer.querySelector('[data-cookie-settings-trigger]')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'privacy-consent__footer-trigger';
    button.dataset.cookieSettingsTrigger = 'true';
    button.textContent = 'Настройки cookies';
    button.addEventListener('click', openSettings);
    footer.appendChild(button);
  }

  function mountBanner() {
    if (document.getElementById('privacyConsent')) return;
    var root = document.createElement('aside');
    root.id = 'privacyConsent';
    root.className = 'privacy-consent';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Настройки конфиденциальности');
    root.hidden = Boolean(currentConsent);
    root.innerHTML =
      '<div class="privacy-consent__card">' +
        '<div class="privacy-consent__mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.8-2.8 8-7 10-4.2-2-7-5.2-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg></div>' +
        '<div class="privacy-consent__body">' +
          '<p class="privacy-consent__eyebrow">Конфиденциальность</p>' +
          '<h2 id="privacyConsentTitle">Выберите настройки cookies</h2>' +
          '<p class="privacy-consent__copy">Для сохранения вашего выбора сайт использует локальное хранилище браузера. Аналитика Яндекс Метрики включается только с вашего разрешения. Отказ не ограничивает работу сайта.</p>' +
          '<p class="privacy-consent__links"><a href="' + new URL('privacy/', scriptUrl).href + '">Политика конфиденциальности</a><a href="' + new URL('consent/', scriptUrl).href + '">Согласие на обработку персональных данных</a></p>' +
          '<div class="privacy-consent__settings" data-consent-settings hidden>' +
            '<label class="privacy-consent__toggle"><input type="checkbox" data-analytics-toggle /><span><strong>Аналитика</strong><small>Яндекс Метрика: посещения страниц сайта</small></span></label>' +
            '<p>Выбор сохраняется в этом браузере на 6 месяцев. Его можно изменить внизу страницы.</p>' +
          '</div>' +
          '<p class="privacy-consent__status" data-consent-status role="status" aria-live="polite"></p>' +
        '</div>' +
        '<div class="privacy-consent__actions">' +
          '<button type="button" class="privacy-consent__button privacy-consent__button--quiet" data-consent-settings-button>Настроить</button>' +
          '<button type="button" class="privacy-consent__button privacy-consent__button--outline" data-consent-reject>Только необходимые</button>' +
          '<button type="button" class="privacy-consent__button privacy-consent__button--primary" data-consent-save>Разрешить аналитику</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    var settingsPanel = root.querySelector('[data-consent-settings]');
    var analyticsToggle = root.querySelector('[data-analytics-toggle]');
    var settingsButton = root.querySelector('[data-consent-settings-button]');
    var saveButton = root.querySelector('[data-consent-save]');
    var rejectButton = root.querySelector('[data-consent-reject]');
    var status = root.querySelector('[data-consent-status]');
    var oldConsent = currentConsent;

    function showSettings() {
      root.hidden = false;
      settingsPanel.hidden = false;
      analyticsToggle.checked = Boolean(currentConsent && currentConsent.analytics);
      settingsButton.hidden = true;
      saveButton.textContent = 'Сохранить выбор';
      analyticsToggle.focus();
    }

    function closeBanner() {
      root.hidden = true;
      settingsPanel.hidden = true;
      settingsButton.hidden = false;
      saveButton.textContent = 'Разрешить аналитику';
    }

    function setChoice(analytics) {
      var saved = saveConsent(analytics);
      if (!saved) {
        status.textContent = 'Браузер не сохранил выбор. Аналитика останется выключенной в этой вкладке.';
        if (analytics) {
          currentConsent.analytics = false;
          closeBanner();
          return;
        }
      }
      if (!analytics) clearAnalyticsIdentifiers();
      closeBanner();
      if (analytics) loadAnalytics();
      if (oldConsent && oldConsent.analytics !== analytics) window.location.reload();
      oldConsent = currentConsent;
    }

    settingsButton.addEventListener('click', showSettings);
    saveButton.addEventListener('click', function () {
      setChoice(settingsPanel.hidden ? true : analyticsToggle.checked);
    });
    rejectButton.addEventListener('click', function () { setChoice(false); });
    root.querySelectorAll('.privacy-consent__links a').forEach(function (link) {
      link.addEventListener('click', function () { link.target = '_blank'; link.rel = 'noopener'; });
    });
    addFooterControl(showSettings);
  }

  if (currentConsent && currentConsent.analytics) loadAnalytics();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountBanner, { once: true });
  else mountBanner();
}());
