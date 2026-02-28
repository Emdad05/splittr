// api/auth/me.js — return current user (public fields only, no tokens)
const { getSession } = require('../../lib/session');
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const s = getSession(req);
  if (!s){ res.statusCode=401; return res.end(JSON.stringify({error:'Not authenticated'})); }
  res.end(JSON.stringify({ id:s.id, email:s.email, name:s.name, picture:s.picture }));
};
