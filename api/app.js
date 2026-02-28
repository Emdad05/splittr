// api/app.js — serve app HTML, only if authenticated or guest
const fs   = require('fs');
const path = require('path');
const { getSession } = require('../lib/session');

const HTML_PATH = path.join(__dirname,'../public/app.html');

module.exports = (req, res) => {
  const session = getSession(req);
  const cookies = req.headers.cookie || '';
  const isGuest = cookies.includes('splittr_has_session=1') || cookies.includes('splittr_guest=1');
  if(!session && !isGuest){ res.writeHead(302,{Location:'/'}); return res.end(); }

  let appHTML;
  try {
    appHTML = fs.readFileSync(HTML_PATH,'utf8');
  } catch(e) {
    console.error('Could not read app.html:', e.message);
    res.statusCode = 500;
    return res.end('<h2>Build error: app.html not found. Please redeploy.</h2>');
  }

  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive, nosnippet, noimageindex');
  res.setHeader('Content-Security-Policy',
    "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src https://fonts.gstatic.com; " +
    "img-src 'self' data: https://www.gstatic.com https://lh3.googleusercontent.com; " +
    "connect-src 'self'; frame-ancestors 'none';"
  );
  res.setHeader('Permissions-Policy','clipboard-read=(), clipboard-write=()');
  res.end(appHTML);
};
