export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, message } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }

  const botToken = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Bot not configured' });
  }

  const text = [
    '**\u2705 Новая заявка — Концепция строительства**',
    '',
    '**\uD83D\uDC64 Имя:** ' + name,
    '**\uD83D\uDCDE Телефон:** ' + phone,
    message ? '**\uD83D\uDCDD Сообщение:** ' + message : '',
    '',
    '\u2014',
    'Отправлено с сайта'
  ].filter(Boolean).join('\n');

  try {
    const tgRes = await fetch(
      'https://api.telegram.org/bot' + botToken + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      return res.status(500).json({ error: 'Telegram error', detail: err });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
