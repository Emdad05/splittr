// api/data.js — GET load groups from Drive, POST save groups to Drive
// FIX: server handles token refresh — user never sees expiry errors
// FIX: if token refreshed, we update the session cookie transparently
const { getSession, setCookie } = require('../lib/session');
const { loadFromDrive, saveToDrive } = require('../lib/drive');

function readBody(req){
  return new Promise((resolve,reject)=>{
    let raw='';
    req.on('data',c=>raw+=c);
    req.on('end',()=>{ try{resolve(JSON.parse(raw));}catch(e){reject(e);} });
    req.on('error',reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type','application/json');
  const session = getSession(req);
  if(!session){ res.statusCode=401; return res.end(JSON.stringify({error:'Not authenticated'})); }

  if(req.method==='GET'){
    try{
      const { groups, refreshed } = await loadFromDrive(session);
      // FIX: transparently update cookie if token was refreshed
      if(refreshed) setCookie(res, {...session, ...refreshed});
      res.end(JSON.stringify({ groups }));
    }catch(e){
      console.error('loadFromDrive error:',e);
      res.statusCode=500;
      res.end(JSON.stringify({error:'Failed to load from Drive'}));
    }
    return;
  }

  if(req.method==='POST'){
    try{
      const body = await readBody(req);
      if(!Array.isArray(body.groups)) throw new Error('Invalid payload');
      const { refreshed } = await saveToDrive(session, body.groups);
      if(refreshed) setCookie(res, {...session, ...refreshed});
      res.end(JSON.stringify({ok:true}));
    }catch(e){
      console.error('saveToDrive error:',e);
      res.statusCode=500;
      res.end(JSON.stringify({error:'Failed to save to Drive'}));
    }
    return;
  }

  res.statusCode=405; res.end(JSON.stringify({error:'Method not allowed'}));
};
