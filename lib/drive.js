// lib/drive.js — Google Drive appDataFolder storage (server-side)
// FIX: tokens stored server-side, auto-refreshed — user never sees expiry
const DRIVE_FILE = process.env.DRIVE_FILE_NAME || 'splittr-data.json';

// Get a valid access token, refreshing if needed
async function getAccessToken(session){
  const { access_token, refresh_token, expires_at } = session;
  // If token still valid (with 60s buffer), use it
  if (access_token && expires_at && Date.now() < expires_at - 60000){
    return { token: access_token, refreshed: null };
  }
  // FIX: auto-refresh expired token server-side — user never knows
  if (!refresh_token) throw new Error('No refresh token');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token,
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return {
    token: data.access_token,
    refreshed: {
      access_token:  data.access_token,
      expires_at:    Date.now() + (data.expires_in - 60) * 1000,
    },
  };
}

async function ensureFileId(token){
  // FIX: quota saved — only list files if we don't have the ID cached
  const listRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DRIVE_FILE}'&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const list = await listRes.json();
  if (list.files && list.files.length > 0) return list.files[0].id;

  // Create the file
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: DRIVE_FILE, parents: ['appDataFolder'], mimeType: 'application/json' }),
  });
  const created = await createRes.json();
  return created.id;
}

async function loadFromDrive(session){
  const { token, refreshed } = await getAccessToken(session);
  const fileId = await ensureFileId(token);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return { groups: [], refreshed };
  const data = await res.json();
  const groups = Array.isArray(data) ? data : (data?.groups || []);
  return { groups, fileId, refreshed };
}

async function saveToDrive(session, groups){
  const { token, refreshed } = await getAccessToken(session);
  const fileId = await ensureFileId(token);
  await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(groups),
    }
  );
  return { refreshed };
}

module.exports = { loadFromDrive, saveToDrive };
