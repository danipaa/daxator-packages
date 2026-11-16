// POST /api/login  { password, remember }  -> sets a signed, HttpOnly session cookie
import crypto from 'node:crypto';

const DAY = 86400;

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(String(value)).digest('base64url');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const pass = process.env.APP_PASSWORD;
  if (!pass) return res.status(500).json({ error: 'APP_PASSWORD is not set in Vercel yet.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const given = String((body && body.password) || '');

  // compare fixed-length hashes so timing doesn't leak anything
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(pass).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    await new Promise(r => setTimeout(r, 900)); // slow down guessing
    return res.status(401).json({ error: 'Wrong password' });
  }

  const remember = !!(body && body.remember);
  const exp = Date.now() + (remember ? 30 : 1) * DAY * 1000;
  const secret = process.env.SESSION_SECRET || ('dx:' + pass);
  const token = `${exp}.${sign(exp, secret)}`;
  const cookie = [`dx_session=${token}`, 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax'];
  if (remember) cookie.push(`Max-Age=${30 * DAY}`);
  res.setHeader('Set-Cookie', cookie.join('; '));
  return res.status(200).json({ ok: true });
}
