// api/auth/callback.js
const { setCookie } = require('../../lib/session');

module.exports = async (req, res) => {
  const base = process.env.APP_URL || `https://${req.headers.host}`;
  const params = Object.fromEntries(new URL(req.url, base).searchParams);
  const { code, error, state } = params;

  // Parse how many times Drive was already refused (passed via state)
  const driveRefusals = parseInt((state || '').replace('drive_refused_', '') || '0', 10);

  if (error || !code){
    res.writeHead(302, { Location: `${base}/login?auth=error` });
    return res.end();
  }

  try {
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

    // ── SCOPE CHECK ──────────────────────────────────────────────────────
    const grantedScopes = (tokens.scope || '').split(' ');
    const hasDrive = grantedScopes.some(s => s.includes('drive'));

    if (!hasDrive) {
      const refusals = driveRefusals + 1;

      if (refusals >= 2) {
        // They've refused twice — stop looping, send to login with "give up" flag
        res.writeHead(302, { Location: `${base}/login?drive=refused` });
        return res.end();
      }

      // First refusal — send back to Google once more with explanation in state
      const reAuthParams = new URLSearchParams({
        client_id:     process.env.GOOGLE_CLIENT_ID,
        redirect_uri:  `${base}/api/auth/callback`,
        response_type: 'code',
        scope:         'openid email profile https://www.googleapis.com/auth/drive.appdata',
        access_type:   'offline',
        prompt:        'consent',
        state:         `drive_refused_${refusals}`,
      });
      res.writeHead(302, {
        Location: `https://accounts.google.com/o/oauth2/v2/auth?${reAuthParams}`
      });
      return res.end();
    }
    // ────────────────────────────────────────────────────────────────────

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    setCookie(res, {
      id:            profile.sub,
      email:         profile.email,
      name:          profile.name,
      picture:       profile.picture,
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at:    Date.now() + (tokens.expires_in - 60) * 1000,
    });

    res.writeHead(302, { Location: `${base}/app?auth=success` });
    res.end();
  } catch(e) {
    console.error('OAuth callback error:', e);
    res.writeHead(302, { Location: `${base}/login?auth=error` });
    res.end();
  }
};
