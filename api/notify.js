/**
 * BackBone — LIFF 予約通知 API
 *
 * POST /api/notify
 * Body: { name, d1, d2, sy }
 *
 * 環境変数（Vercel ダッシュボードで設定）:
 *   LINE_CHANNEL_ACCESS_TOKEN  — Messaging API チャンネルアクセストークン
 *   LINE_ADMIN_USER_ID         — 通知を受け取る管理者の LINE User ID
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token   = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const adminId = process.env.LINE_ADMIN_USER_ID;

  if (!token || !adminId) {
    console.error('Missing env vars: LINE_CHANNEL_ACCESS_TOKEN or LINE_ADMIN_USER_ID');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { name, d1, d2, sy } = req.body || {};

  if (!name || !d1) {
    return res.status(400).json({ error: 'name and d1 are required' });
  }

  // 管理者へ送る LINE メッセージ
  const lines = [
    '📋 新しい予約リクエスト（BackBone LP）',
    '─────────────────',
    `👤 お名前　　：${name}`,
    `📅 第一希望　：${d1}`,
  ];
  if (d2) lines.push(`📅 第二希望　：${d2}`);
  if (sy) lines.push(`🩺 お悩み　　：${sy}`);
  lines.push('─────────────────');
  lines.push('※ 紹介カードからのご予約');

  const text = lines.join('\n');

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: adminId,
        messages: [{ type: 'text', text }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('LINE API error:', err);
      return res.status(502).json({ error: err });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Fetch error:', e);
    return res.status(500).json({ error: e.message });
  }
}
