/**
 * Yandex Cloud Function — Обработка заявок с сайта vlmetal.ru
 * 
 * Заменяет Vercel submit.js для соответствия ФЗ-152.
 * Данные хранятся в Яндекс Таблице (сервер в РФ).
 * 
 * Переменные окружения:
 * - YANDEX_SPREADSHEET_ID — ID Google таблицы для хранения заявок
 * - YANDEX_SPREADSHEET_TOKEN — OAuth токен Яндекс
 * - VK_TOKEN — Токен VK бота ( сообщества)
 * - VK_PEER_IDS — ID получателей VK через запятую
 * - TG_BOT_TOKEN — Токен Telegram бота
 * - TG_CHAT_ID — ID чата Telegram для уведомлений
 * - TG_THREAD_ID — ID топика Telegram (опционально)
 * - CRM_WEBSITE_LEAD_URL — URL POST /api/requests в CRM Gateway
 * - CRM_WEBSITE_LEAD_TOKEN — серверный JWT с ролью super_admin
 */

module.exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://xn----8sbfkbqbmookekqofldd0ec6lnc.xn--p1ai',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, phone, message } = data;
  if (!name || !phone) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name and phone required' }) };
  }

  const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' });

  // 1. Сохраняем в Яндекс Таблицу
  try {
    await saveToYandexSheet(name, phone, message, timestamp);
  } catch (err) {
    console.error('Yandex Sheet error:', err);
    // Продолжаем даже если таблица не сохранилась — уведомления всё равно отправим
  }

  // 2. Создаём заявку в CRM. Персональные данные не отправляются в Telegram.
  try {
    await sendCRMRequest(name, phone, message, timestamp);
  } catch (err) {
    console.error('CRM error:', err);
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'CRM unavailable' }) };
  }

  // 3. Отправляем короткое уведомление в Telegram (БЕЗ персональных данных)
  try {
    await sendTGNotification();
  } catch (err) {
    console.error('TG error:', err);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true })
  };
};

/**
 * Сохранение заявки в Яндекс Таблицу
 */
async function saveToYandexSheet(name, phone, message, timestamp) {
  const spreadsheetId = process.env.YANDEX_SPREADSHEET_ID;
  const token = process.env.YANDEX_SPREADSHEET_TOKEN;

  if (!spreadsheetId || !token) {
    console.log('Yandex Sheet not configured, skipping');
    return;
  }

  // Добавляем строку в таблицу
  const url = `https://api-sheets.yandex.ru/v2/spreadsheets/${spreadsheetId}/values/Лист1!A:E`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [[timestamp, name, phone, message || '', 'Новая']]
    })
  });
  if (!response.ok) throw new Error(`Yandex Sheets returned ${response.status}`);
}

async function sendCRMRequest(name, phone, message, timestamp) {
  const url = (process.env.CRM_WEBSITE_LEAD_URL || '').trim();
  const token = (process.env.CRM_WEBSITE_LEAD_TOKEN || '').trim();
  if (!url || !token) throw new Error('CRM lead endpoint is not configured');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: `web_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: `Заявка с сайта: ${name}`,
      text: `Телефон: ${phone}\n${message || ''}`.trim(),
      managerName: 'Администратор',
      managerEmail: '',
      source: 'website',
      contact: { name, phone },
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      websiteTimestamp: timestamp
    })
  });

  if (!response.ok) throw new Error(`CRM returned ${response.status}`);
}

/**
 * Уведомление в VK (обоим пользователям)
 */
async function sendVKNotification(name, phone, message, timestamp) {
  const vkToken = process.env.VK_TOKEN;
  const vkPeerIds = process.env.VK_PEER_IDS;

  if (!vkToken || !vkPeerIds) {
    console.log('VK not configured, skipping');
    return;
  }

  const text = [
    '✅ Новая заявка — Концепция строительства',
    '',
    '👤 Имя: ' + name,
    '📞 Телефон: ' + phone,
    message ? '📝 Сообщение: ' + message : '',
    '',
    '⏰ ' + timestamp,
    '—',
    'Отправлено с сайта'
  ].filter(Boolean).join('\n');

  // Отправляем каждому пользователю
  const peerIds = vkPeerIds.split(',').map(id => id.trim()).filter(id => id);
  for (const peerId of peerIds) {
    const randomId = Math.floor(Math.random() * 1000000);
    await fetch('https://api.vk.com/method/messages.send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        access_token: vkToken,
        peer_id: peerId,
        message: text,
        random_id: randomId,
        v: '5.199'
      })
    });
  }
}

/**
 * Короткое уведомление в Telegram (БЕЗ персональных данных)
 */
async function sendTGNotification() {
  const tgToken = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  const threadId = process.env.TG_THREAD_ID;

  if (!tgToken || !chatId) {
    console.log('TG not configured, skipping');
    return;
  }

  const text = '🔔 Новая заявка на сайте!\n\nПроверьте VK — там подробности.\n\n@felseeker @KGLOVEPUSSY';

  const payload = {
    chat_id: chatId,
    text: text
  };

  if (threadId) {
    payload.message_thread_id = Number(threadId);
  }

  await fetch('https://api.telegram.org/bot' + tgToken + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
