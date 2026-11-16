// Vercel Routing Middleware: every page except the public ones needs a valid session.
// Public: /login, /share (client packages page), /api, static assets.
export const config = {
  matcher: ['/((?!login|share|api|assets|icons|favicon\\.ico|manifest\\.webmanifest|robots\\.txt).*)'],
};

const enc = new TextEncoder();

function b64url(buf) {
  let s = '';
  const b = new Uint8Array(buf);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function isValid(token, secret, now = Date.now()) {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || +exp < now) return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = b64url(await crypto.subtle.sign('HMAC', key, enc.encode(exp)));
  if (mac.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < mac.length; i++) diff |= mac.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const pass = process.env.APP_PASSWORD;
  if (!pass) return Response.redirect(new URL('/login/?setup=1', url), 307);

  const secret = process.env.SESSION_SECRET || ('dx:' + pass);
  const m = (request.headers.get('cookie') || '').match(/(?:^|;\s*)dx_session=([^;]+)/);
  if (await isValid(m && m[1], secret)) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } }); // continue to the page
  }
  const to = new URL('/login/', url);
  if (url.pathname !== '/') to.searchParams.set('next', url.pathname + url.search);
  return Response.redirect(to, 307);
}
