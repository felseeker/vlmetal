const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const YM_TOKEN = process.env.YM_OAUTH_TOKEN;
const YM_COUNTER = '109981508';
const CHAT_ID = -5408984431;

function dateRange(period) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const today = `${y}-${m}-${d}`;

  const past = new Date(now);
  if (period === 'day') past.setDate(past.getDate() - 1);
  else if (period === 'week') past.setDate(past.getDate() - 7);
  else past.setDate(past.getDate() - 30);

  const py = past.getFullYear();
  const pm = String(past.getMonth() + 1).padStart(2, '0');
  const pd = String(past.getDate()).padStart(2, '0');
  return { date1: `${py}-${pm}-${pd}`, date2: today };
}

async function fetchMetrika(date1, date2) {
  const url = 'https://api-metrika.yandex.net/stat/v1/data?' + new URLSearchParams({
    ids: YM_COUNTER,
    metrics: 'ym:s:visits,ym:s:pageviews,ym:s:users',
    date1, date2,
    accuracy: 'full'
  });

  const res = await fetch(url, {
    headers: { Authorization: 'OAuth ' + YM_TOKEN }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Metrika API error: ' + res.status + ' ' + err);
  }
  return res.json();
}

async function fetchMetrikaSources(date1, date2) {
  const url = 'https://api-metrika.yandex.net/stat/v1/data?' + new URLSearchParams({
    ids: YM_COUNTER,
    metrics: 'ym:s:visits,ym:s:pageviews',
    dimensions: 'ym:s:searchEngine',
    date1, date2,
    limit: 10,
    accuracy: 'full'
  });

  const res = await fetch(url, {
    headers: { Authorization: 'OAuth ' + YM_TOKEN }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Metrika sources error: ' + res.status + ' ' + err);
  }
  return res.json();
}

function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU');
}

function buildStatsMessage(period, totals, sources) {
  const periodNames = { day: 'За вчера', week: 'За последние 7 дней', month: 'За последние 30 дней' };
  const header = periodNames[period] || 'За период';
  const total = totals.data[0] || {};
  const metrics = total.metrics || [0, 0, 0];

  let msg = '';
  msg += '\uD83D\uDCCA *Статистика сайта*\n';
  msg += header + '\n\n';
  msg += '\uD83D\uDC65 Визиты: *' + formatNumber(metrics[0]) + '*\n';
  msg += '\uD83D\uDCF1 Просмотры: *' + formatNumber(metrics[1]) + '*\n';
  msg += '\uD83D\uDC64 Посетители: *' + formatNumber(metrics[2]) + '*\n';

  if (sources && sources.data && sources.data.length > 0) {
    msg += '\n*Поисковые системы:*\n';
    let otherVisits = 0;
    for (const row of sources.data) {
      const name = row.dimensions[0].name;
      const visits = row.metrics[0];
      if (name === 'Другие') {
        otherVisits = visits;
      } else {
        msg += '\uD83D\uDD0D ' + name + ': *' + formatNumber(visits) + '*\n';
      }
    }
    if (otherVisits > 0) {
      msg += '\uD83D\uDD0D Другие: *' + formatNumber(otherVisits) + '*\n';
    }
  }

  msg += '\n\u2014\n';
  msg += 'Яндекс.Метрика \u2022 концепция-строительства.рф';
  return msg;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const update = req.body;

    if (!update || !update.message) {
      return res.status(200).json({ ok: true });
    }

    const msg = update.message;
    const text = (msg.text || '').trim();
    const chatId = msg.chat.id;

    if (!text.startsWith('/')) {
      return res.status(200).json({ ok: true });
    }

    const parts = text.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = (parts[1] || '').toLowerCase();

    if (command !== '/stats') {
      return res.status(200).json({ ok: true });
    }

    const period = ['day', 'week', 'month'].includes(arg) ? arg : 'week';

    if (!YM_TOKEN) {
      await sendMessage(chatId,
        '\u26A0\uFE0F Яндекс.Метрика ещё не подключена.\n\n' +
        'Установи переменную YM_OAUTH_TOKEN в Vercel.\n\n' +
        'Инструкция: https://oauth.yandex.ru/ \u2014 создать приложение, ' +
        'запросить доступ к Metrika, получить токен.'
      );
      return res.status(200).json({ ok: true });
    }

    try {
      const [totals, sources] = await Promise.all([
        fetchMetrika(period === 'day' ? dateRange('day').date1 : dateRange(period).date1,
                     period === 'day' ? dateRange('day').date2 : dateRange(period).date2),
        fetchMetrikaSources(period === 'day' ? dateRange('day').date1 : dateRange(period).date1,
                            period === 'day' ? dateRange('day').date2 : dateRange(period).date2)
      ]);

      const message = buildStatsMessage(period, totals, sources);
      await sendMessage(chatId, message);
    } catch (err) {
      await sendMessage(chatId, '\u274C Ошибка: ' + err.message);
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    const p = req.query.period || 'week';
    const period = ['day', 'week', 'month'].includes(p) ? p : 'week';
    const dr = dateRange(period);

    if (!YM_TOKEN) {
      return res.json({ error: 'YM_OAUTH_TOKEN not set' });
    }

    try {
      const [totals, sources] = await Promise.all([
        fetchMetrika(dr.date1, dr.date2),
        fetchMetrikaSources(dr.date1, dr.date2)
      ]);
      return res.json({
        period,
        date1: dr.date1,
        date2: dr.date2,
        totals: totals.data[0]?.metrics || [0, 0, 0],
        sources: (sources.data || []).map(r => ({
          engine: r.dimensions[0].name,
          visits: r.metrics[0],
          pageviews: r.metrics[1]
        }))
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function sendMessage(chatId, text) {
  await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}
