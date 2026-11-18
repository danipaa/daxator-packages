// GET /api/data?since=<rev>  -> { rev, state } (or { rev, same:true } when nothing changed)
// PUT /api/data  { baseRev, state } -> { rev }  |  409 { rev, state } when another device saved first
// Data lives in Upstash Redis (added from Vercel → Storage), compressed, behind the login cookie.
import crypto from 'node:crypto';
import zlib from 'node:zlib';

const K_STATE = 'dx:state', K_REV = 'dx:rev';

function authed(req) {
  const pass = process.env.APP_PASSWORD;
  if (!pass) return false;
  const secret = process.env.SESSION_SECRET || ('dx:' + pass);
  const m = String(req.headers.cookie || '').match(/(?:^|;\s*)dx_session=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || +exp < Date.now()) return false;
  const mac = crypto.createHmac('sha256', secret).update(exp).digest('base64url');
  const a = Buffer.from(mac), b = Buffer.from(sig);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function store() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return async (cmds) => {
    const r = await fetch(url.replace(/\/$/, '') + '/pipeline', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds),
    });
    if (!r.ok) throw new Error('store ' + r.status + ' ' + (await r.text()).slice(0, 200));
    const out = await r.json();
    out.forEach(x => { if (x && x.error) throw new Error(x.error); });
    return out.map(x => x.result);
  };
}

const pack = (obj) => zlib.gzipSync(Buffer.from(JSON.stringify(obj))).toString('base64');
const unpack = (s) => (s ? JSON.parse(zlib.gunzipSync(Buffer.from(s, 'base64')).toString()) : null);

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authed(req)) return res.status(401).json({ error: 'login' });
  const db = store();
  if (!db) return res.status(503).json({ error: 'nostore' });
  try {
    if (req.method === 'GET') {
      const since = Number(new URL(req.url, 'http://x').searchParams.get('since'));
      const [rev] = await db([['GET', K_REV]]);
      const cur = Number(rev) || 0;
      if (Number.isFinite(since) && since === cur && cur > 0) return res.status(200).json({ rev: cur, same: true });
      const [s] = await db([['GET', K_STATE]]);
      return res.status(200).json({ rev: cur, state: unpack(s) });
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await readBody(req);
      if (!body || typeof body.state !== 'object' || !body.state) return res.status(400).json({ error: 'bad body' });
      const [rev] = await db([['GET', K_REV]]);
      const cur = Number(rev) || 0;
      if (Number(body.baseRev) !== cur) {
        const [s] = await db([['GET', K_STATE]]);
        return res.status(409).json({ rev: cur, state: unpack(s) });
      }
      const next = cur + 1;
      await db([['SET', K_STATE, pack(body.state)], ['SET', K_REV, String(next)], ['SET', 'dx:updated', new Date().toISOString()]]);
      return res.status(200).json({ rev: next });
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'store', detail: String(e.message || e).slice(0, 200) });
  }
}
