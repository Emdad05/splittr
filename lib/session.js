// lib/session.js — server-side JWT sessions via httpOnly cookie
const crypto = require('crypto');
const SECRET  = process.env.SESSION_SECRET;
const COOKIE  = 'splittr_sess';
const DAYS    = 30;
function b64(s){ return Buffer.from(s).toString('base64url'); }
function unb64(s){ return Buffer.from(s,'base64url').toString(); }
function signJWT(payload){
  if(!SECRET) throw new Error('SESSION_SECRET not set');
  const h=b64(JSON.stringify({alg:'HS256',typ:'JWT'}));
  const b=b64(JSON.stringify({...payload,iat:Math.floor(Date.now()/1000)}));
  const s=crypto.createHmac('sha256',SECRET).update(`${h}.${b}`).digest('base64url');
  return `${h}.${b}.${s}`;
}
function verifyJWT(token){
  if(!SECRET) throw new Error('SESSION_SECRET not set');
  const [h,b,s]=(token||'').split('.');
  if(!h||!b||!s) throw new Error('Bad token');
  const exp=crypto.createHmac('sha256',SECRET).update(`${h}.${b}`).digest('base64url');
  const sb=Buffer.from(s,'base64url'),eb=Buffer.from(exp,'base64url');
  if(sb.length!==eb.length||!crypto.timingSafeEqual(sb,eb)) throw new Error('Bad sig');
  return JSON.parse(unb64(b));
}
function setCookie(res,payload){
  const token=signJWT(payload);
  const maxAge=DAYS*24*60*60;
  const secure=process.env.NODE_ENV==='production'?'; Secure':'';
  res.setHeader('Set-Cookie',[
    `${COOKIE}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax${secure}`,
    `splittr_has_session=1; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`,
  ]);
}
function clearCookie(res){
  res.setHeader('Set-Cookie',[
    `${COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`,
    `splittr_has_session=; Max-Age=0; Path=/; SameSite=Lax`,
  ]);
}
function getSession(req){
  const raw=(req.headers.cookie||'').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if(!raw) return null;
  try{ return verifyJWT(raw[1]); }catch(e){ return null; }
}
module.exports={setCookie,clearCookie,getSession};
