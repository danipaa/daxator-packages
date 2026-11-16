// GET/POST /api/logout -> clears the session cookie and goes back to the sign-in page
export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'dx_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', '/login/');
  res.end();
}
