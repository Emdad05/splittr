// api/app.js — serve app HTML, only if authenticated or guest
const fs   = require('fs');
const path = require('path');
const { getSession } = require('../lib/session');
const appHTML = fs.readFileSync(path.join(__dirname,'../public/app.html'),'utf8');
module.exports = (req, res) => {
  const session = getSession(req);
  const cookies = req.headers.cookie || '';
  const isGuest = cookies.includes('splittr_has_session=1');
  if(!session && !isGuest){ res.writeHead(302,{Location:'/'}); return res.end(); }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  // Anti-scrape: block robots, disable embedding, strict CSP on fetching
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

