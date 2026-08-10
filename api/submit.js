export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, message, consent } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }
  if (consent !== true) return res.status(422).json({ error: 'Consent required' });

  const crmUrl = (process.env.CRM_WEBSITE_LEAD_URL || '').trim();
  const crmToken = (process.env.CRM_WEBSITE_LEAD_TOKEN || '').trim();
  if (!crmUrl || !crmToken) return res.status(503).json({ error: 'CRM lead endpoint is not configured' });

  try {
    const crmRes = await fetch(
      crmUrl,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${crmToken}` },
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
        })
      }
    );

    if (!crmRes.ok) return res.status(502).json({ error: 'CRM unavailable' });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
