// api/auth/logout.js — clear session
const { clearCookie } = require('../../lib/session');
module.exports = (req, res) => {
  clearCookie(res);
  res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify({ok:true}));
};
