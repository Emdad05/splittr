const fs = require('fs');
const path = require('path');
const HTML_PATH = path.join(__dirname, '../public/login.html');
module.exports = (req, res) => {
  const cookies = req.headers.cookie || '';
  const p = new URL(req.url, 'http://localhost').searchParams;
  if (p.get('auth') !== 'error') {
    if (cookies.includes('splittr_has_session=1') || cookies.includes('splittr_guest=1')) {
      res.writeHead(302, { Location: '/app' });
      return res.end();
    }
  }
  let html;
  try { html = fs.readFileSync(HTML_PATH, 'utf8'); }
  catch(e) { res.statusCode = 500; return res.end('<h2>Build error: login.html not found.</h2>'); }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Frame-Options', 'DENY');
  res.end(html);
};
