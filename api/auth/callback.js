// api/auth/callback.js — Google sends user here after sign-in
// FIX: stores refresh_token in session so server can refresh silently forever
const { setCookie } = require('../../lib/session');

module.exports = async (req, res) => {
  const base = process.env.APP_URL || `https://${req.headers.host}`;
  const { code, error } = Object.fromEntries(new URL(req.url, base).searchParams);

  if (error || !code){
    res.writeHead(302, { Location: `${base}/app?auth=error` });
    return res.end();
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:  `${base}/api/auth/callback`,
        grant_type:    'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();
    if (tokens.error) throw new Error(tokens.error);

    // Fetch user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    // Store everything in session cookie (httpOnly — JS can't read it)
    setCookie(res, {
      id:            profile.sub,
      email:         profile.email,
      name:          profile.name,
      picture:       profile.picture,
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token, // FIX: stored server-side, never in browser
      expires_at:    Date.now() + (tokens.expires_in - 60) * 1000,
    });

    res.writeHead(302, { Location: `${base}/app?auth=success` });
    res.end();
  } catch(e) {
    console.error('OAuth callback error:', e);
    res.writeHead(302, { Location: `${base}/app?auth=error` });
    res.end();
  }
};
