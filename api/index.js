// api/index.js — serve login page, redirect to /app if already logged in
const fs   = require('fs');
const path = require('path');
const { getSession } = require('../lib/session');

const HTML_PATH = path.join(__dirname,'../public/login.html');

module.exports = (req, res) => {
  const session = getSession(req);
  if(session){ res.writeHead(302,{Location:'/app'}); return res.end(); }

  let loginHTML;
  try {
    loginHTML = fs.readFileSync(HTML_PATH,'utf8');
  } catch(e) {
    console.error('Could not read login.html:', e.message);
    res.statusCode = 500;
    return res.end('<h2>Build error: login.html not found. Please redeploy.</h2>');
  }

  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive, nosnippet');
  res.end(loginHTML);
};
