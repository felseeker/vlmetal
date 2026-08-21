# Изолированная версия сайта

Эта папка разрабатывается отдельно от текущего сайта. Она не подключает корневой `style.css` и не заменяет production-файлы до визуального одобрения.

Запуск из корня проекта:

```powershell
python -m http.server 8090
```

Просмотр:

`http://localhost:8090/redesign/`

Форма использует тот же CRM endpoint и payload, что текущий сайт. Во время визуальной проверки реальные заявки не отправлять.

## Контент и CRM

- Локальный каталог: `data/catalog.json`.
- Локальное портфолио: `data/portfolio.json`.
- Проверка данных: `node scripts/validate-content.js` из корня проекта.
- Локальная проверка sync: `node scripts/sync-content.js --local`.
- Remote sync требует `CRM_SYNC_TOKEN` и запускается только вручную:

```powershell
$env:CRM_SYNC_TOKEN = "<служебный токен>"
node scripts/sync-content.js
```

Скрипт только обновляет статические JSON-файлы и не выполняет deploy. Поля портфолио: `title`, `category`, `direction`, `images`, `description`, `date`, `featured`. Поля каталога: `name`, `category`, `price`, `unit`, `description`, `direction`.
