// api/index.js — serve landing page (public-facing homepage)
const fs   = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname,'../public/index.html');

module.exports = (req, res) => {
  let html;
  try {
    html = fs.readFileSync(HTML_PATH,'utf8');
  } catch(e) {
    console.error('Could not read index.html:', e.message);
    res.statusCode = 500;
    return res.end('<h2>Build error: index.html not found. Please redeploy.</h2>');
  }

  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=3600');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.end(html);
};
