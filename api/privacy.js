const fs = require('fs');
const path = require('path');
const HTML_PATH = path.join(__dirname, '../public/privacy.html');
module.exports = (req, res) => {
  let html;
  try { html = fs.readFileSync(HTML_PATH, 'utf8'); }
  catch(e) { res.statusCode = 500; return res.end('<h2>Build error: privacy.html not found.</h2>'); }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('X-Frame-Options', 'DENY');
  res.end(html);
};
