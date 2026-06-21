export default async function handler(req, res) {
  const token = process.env.TG_BOT_TOKEN;
  const webhookUrl = 'https://vlmetal.vercel.app/api/bot';

  if (!token) {
    return res.status(500).json({ error: 'TG_BOT_TOKEN not set' });
  }

  try {
    const tgRes = await fetch(
      'https://api.telegram.org/bot' + token + '/setWebhook?url=' + encodeURIComponent(webhookUrl),
      { method: 'POST' }
    );
    const data = await tgRes.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
