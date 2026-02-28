// api/auth/url.js — redirect to Google OAuth consent
module.exports = (req, res) => {
  const base = process.env.APP_URL || `https://${req.headers.host}`;
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  `${base}/api/auth/callback`,
    response_type: 'code',
    scope:         'openid email profile https://www.googleapis.com/auth/drive.appdata',
    access_type:   'offline',
    prompt:        'consent', // force consent to always get refresh_token
  });
  res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  res.end();
};
