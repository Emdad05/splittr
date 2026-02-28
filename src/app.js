/* ─── PROTECTION LAYER ───────────────────────────── */
(function _protect(){
  /* ── Disable right-click context menu ── */
  document.addEventListener('contextmenu', e => e.preventDefault());

  /* ── Disable common copy/view-source keyboard shortcuts ── */
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    // Ctrl/Cmd + U (view source), S (save), P (print)
    if ((e.ctrlKey || e.metaKey) && ['u','s','p'].includes(k)) { e.preventDefault(); return false; }
    // Ctrl/Cmd + Shift + I / J / C (DevTools), E (sources)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i','j','c','e'].includes(k)) { e.preventDefault(); return false; }
    // F12 DevTools
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl/Cmd + A (select all on non-input elements)
    if ((e.ctrlKey || e.metaKey) && k === 'a' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
      e.preventDefault(); return false;
    }
  });

  /* ── Disable drag-and-drop to extract assets ── */
  document.addEventListener('dragstart', e => e.preventDefault());

  /* ── Disable text selection via mouse on non-input elements ── */
  document.addEventListener('selectstart', e => {
    const t = e.target;
    if (!['INPUT','TEXTAREA'].includes(t.tagName)) e.preventDefault();
  });

  /* ── Disable printing ── */
  window.addEventListener('beforeprint', e => e.preventDefault());
  if (window.matchMedia) {
    window.matchMedia('print').addListener(mq => { if (mq.matches) window.stop(); });
  }

  /* ── DevTools size-detect: desktop only (mobile browsers have huge chrome offset) ── */
  const _isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
  if (!_isMobile) {
    let _dtCheck = setInterval(() => {
      const wt = window.outerWidth - window.innerWidth > 200;
      const ht = window.outerHeight - window.innerHeight > 200;
      if (wt || ht) {
        clearInterval(_dtCheck);
        document.body.innerHTML = '';
        window.location.replace('/');
      }
    }, 2000);
  }

  /* ── Console trap: poison the console ── */
  const _noop = () => {};
  const _trap = { log:_noop, warn:_noop, error:_noop, info:_noop, debug:_noop, table:_noop, dir:_noop };
  try { Object.defineProperty(window, 'console', { get: () => _trap, configurable: false }); } catch(e) {}

  /* ── Disable copy/cut events ── */
  document.addEventListener('copy',  e => { if (!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) e.preventDefault(); });
  document.addEventListener('cut',   e => { if (!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) e.preventDefault(); });

})();

/* ─── ICON THEMES ─────────────────────────────────── */
const THEMES=[
  {id:'none',   mi:'category',       label:'None',     bg:'#eceff1',fg:'#607d8b'},
  {id:'trip',   mi:'flight',         label:'Trip',     bg:'#e8f4fd',fg:'#1565c0'},
  {id:'food',   mi:'restaurant',     label:'Dining',   bg:'#fff3e0',fg:'#e65100'},
  {id:'home',   mi:'home',           label:'Home',     bg:'#e8f5e9',fg:'#2e7d32'},
  {id:'party',  mi:'celebration',    label:'Party',    bg:'#fce4ec',fg:'#c2185b'},
  {id:'road',   mi:'directions_car', label:'Road',     bg:'#f3e5f5',fg:'#7b1fa2'},
  {id:'hotel',  mi:'hotel',          label:'Hotel',    bg:'#e0f7fa',fg:'#00695c'},
  {id:'hostel', mi:'cottage',        label:'Hostel',   bg:'#e8f5e9',fg:'#1b5e20'},
  {id:'mess',   mi:'dinner_dining',  label:'Mess',     bg:'#fff8e1',fg:'#e65100'},
  {id:'shop',   mi:'shopping_bag',   label:'Shopping', bg:'#fffde7',fg:'#f57f17'},
  {id:'sport',  mi:'sports_soccer',  label:'Sports',   bg:'#e8eaf6',fg:'#283593'},
  {id:'health', mi:'medication',     label:'Health',   bg:'#fbe9e7',fg:'#bf360c'},
  {id:'money',  mi:'savings',        label:'Savings',  bg:'#f9fbe7',fg:'#558b2f'},
  {id:'camp',   mi:'cabin',          label:'Camping',  bg:'#e0f2f1',fg:'#004d40'},
  {id:'music',  mi:'music_note',     label:'Events',   bg:'#ede7f6',fg:'#4527a0'},
  {id:'pet',    mi:'pets',           label:'Pets',     bg:'#fff3e0',fg:'#bf360c'},
  {id:'work',   mi:'work',           label:'Work',     bg:'#eceff1',fg:'#37474f'},
  {id:'gift',   mi:'card_giftcard',  label:'Gifts',    bg:'#fce4ec',fg:'#880e4f'},
];
const getTheme=g=>THEMES.find(t=>t.id===g.theme)||THEMES[0];
const EXPENSE_CATS=[
  {id:'food',     mi:'restaurant',       label:'Food & Drink',  color:'#e65100',bg:'#fff3e0'},
  {id:'transport',mi:'directions_car',   label:'Transport',     color:'#1565c0',bg:'#e3f2fd'},
  {id:'stay',     mi:'hotel',            label:'Accommodation', color:'#00695c',bg:'#e0f7fa'},
  {id:'activity', mi:'local_activity',   label:'Activities',    color:'#4527a0',bg:'#ede7f6'},
  {id:'shopping', mi:'shopping_bag',     label:'Shopping',      color:'#f57f17',bg:'#fffde7'},
  {id:'health',   mi:'medication',       label:'Health',        color:'#bf360c',bg:'#fbe9e7'},
  {id:'fuel',     mi:'local_gas_station',label:'Fuel',          color:'#2e7d32',bg:'#e8f5e9'},
  {id:'other',    mi:'category',         label:'Other',         color:'#607d8b',bg:'#eceff1'},
];
const getCat=id=>EXPENSE_CATS.find(c=>c.id===id)||EXPENSE_CATS[EXPENSE_CATS.length-1];
function buildIthGrid(elId,selectedId,onSel){const el=Q(elId);el.innerHTML=THEMES.map(t=>`<button class="ith ${selectedId===t.id?'sel':''}" data-tid="${t.id}" style="border:none"><div class="ith-b" style="background:${t.bg}"><span class="mi" style="font-size:22px;color:${t.fg}">${t.mi}</span></div><span class="ith-l">${t.label}</span></button>`).join('');el.querySelectorAll('.ith').forEach(b=>b.onclick=()=>{el.querySelectorAll('.ith').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');onSel(b.dataset.tid);});}
const CURRENCIES={USD:{sym:'$',locale:'en-US'},EUR:{sym:'€',locale:'de-DE'},GBP:{sym:'£',locale:'en-GB'},INR:{sym:'₹',locale:'en-IN'},JPY:{sym:'¥',locale:'ja-JP'},CAD:{sym:'C$',locale:'en-CA'},AUD:{sym:'A$',locale:'en-AU'},SGD:{sym:'S$',locale:'en-SG'},CHF:{sym:'Fr',locale:'de-CH'},MXN:{sym:'$',locale:'es-MX'}};
const COLS=['#006874','#b5006e','#6750a4','#e67100','#37693c','#8b4513','#00658a','#984062','#4a6267','#525e7d'];
const Q=id=>document.getElementById(id);
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);
const td=()=>new Date().toISOString().slice(0,10);
const fd=d=>new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const mc=i=>COLS[i%COLS.length];
function fmt(n,c='INR'){const info=CURRENCIES[c]||{sym:'₹',locale:'en-IN'};const v=Math.round(Number(n||0)*100)/100;try{return new Intl.NumberFormat(info.locale,{style:'currency',currency:c,minimumFractionDigits:c==='JPY'?0:2,maximumFractionDigits:c==='JPY'?0:2}).format(v);}catch(e){return info.sym+(c==='JPY'?Math.round(v):v.toFixed(2));}}
let S={groups:[],activeId:null};
let expFilter={category:'all',payer:'all'};
let expSort='date-desc';

/* ═══════════════════════════════════════════════════════════════════
   AUTH — server-side cookie session + Drive via /api endpoints
   No Google scripts loaded in browser. No tokens in JS.
   ═══════════════════════════════════════════════════════════════════ */
let _currentUser = null;
let _guestMode   = false;
let _syncTimer   = null;

/* ── Wire up Google sign-in button → redirect to OAuth ── */
(function(){
  const btn = document.getElementById('google-signin-btn');
  if(btn) btn.onclick = () => {
    // Show loading state on the button
    btn.disabled = true;
    const lbl = document.getElementById('google-btn-label');
    if(lbl) lbl.textContent = 'Signing in…';
    const loading = document.getElementById('auth-loading');
    if(loading) loading.classList.add('show');
    window.location.href = '/api/auth/url';
  };
})();

/* ── earlyRestore: render from localStorage cache instantly ──────── */
(function earlyRestore(){
  const isGuest = localStorage.getItem('splittr_guest')==='1' || document.cookie.includes('splittr_guest=1');
  const hasSess = document.cookie.includes('splittr_has_session=1');
  if (!isGuest && !hasSess) return;
  try{ const d=localStorage.getItem('split-v4'); if(d)S.groups=_migrateGroups(JSON.parse(d)); }catch(e){}
  _guestMode = isGuest;
  try{ _currentUser=JSON.parse(localStorage.getItem('splittr_user')||'null'); }catch(e){}
  const app=document.getElementById('app');
  if(app) app.classList.add('unlocked');
  if(isGuest){
    const gw=document.getElementById('guest-warning'); if(gw)gw.classList.add('show');
  }
  try{ renderHome(); }catch(e){}
  try{ showFab('home'); }catch(e){}
  // Only attempt Drive sync if we have a real session cookie (not just guest)
  if(!isGuest && hasSess){
    // Hide auth overlay and mark as authed immediately so the login screen
    // doesn't flash on reload (the real data is synced in background below)
    const ao=document.getElementById('auth-overlay'); if(ao) ao.classList.add('hidden');
    document.documentElement.classList.add('splittr-authed');
    requestAnimationFrame(()=>{ try{_renderUserChip();}catch(e){} });
    setTimeout(()=>_driveSync(), 1000); // background Drive sync
  }
})();

/* ── Handle OAuth redirect back from Google ── */
(function handleRedirect(){
  const p=new URLSearchParams(location.search);
  if(p.get('auth')==='success'){ history.replaceState({},'','/app'); _initFromServer(); }
  else if(p.get('auth')==='error'){ history.replaceState({},'','/app'); snack('Sign-in failed. Please try again.'); }
})();

/* ── Full init after sign-in: fetch user + load Drive data ── */
async function _initFromServer(){
  try{
    const me=await fetch('/api/auth/me',{credentials:'include'}).then(r=>r.json());
    if(me.error) return;
    _currentUser={name:me.name,email:me.email,picture:me.picture};
    localStorage.setItem('splittr_user',JSON.stringify(_currentUser));
    const res=await fetch('/api/data',{credentials:'include'});
    const data=await res.json();

    /* Always grab any locally stored data (from guest usage) */
    let localGroups=[];
    try{
      const local=localStorage.getItem('split-v4');
      if(local) localGroups=_migrateGroups(JSON.parse(local));
    }catch(e){}

    const hadLocalData=localGroups.length>0;

    if(data.groups&&data.groups.length){
      /* Merge local groups into Drive groups — add any local group whose id
         doesn't already exist in Drive so guest data is never lost */
      const driveIds=new Set(data.groups.map(g=>g.id));
      const newLocalGroups=localGroups.filter(g=>!driveIds.has(g.id));
      const merged=[...data.groups, ...newLocalGroups];
      S.groups=_migrateGroups(merged);
      localStorage.setItem('split-v4',JSON.stringify(S.groups));
      if(newLocalGroups.length){
        await _apiSave(true); // upload merged data
        setTimeout(()=>snack(`✓ ${newLocalGroups.length} local list${newLocalGroups.length!==1?'s':''} synced to Drive`),800);
      }
    } else {
      /* Drive has nothing — upload whatever local data exists */
      S.groups=localGroups;
      if(S.groups.length){
        await _apiSave(true);
        setTimeout(()=>snack(`✓ ${S.groups.length} list${S.groups.length!==1?'s':''} backed up to Drive`),800);
      }
    }
    _guestMode=false; localStorage.removeItem('splittr_guest');
    document.cookie='splittr_guest=; Max-Age=0; path=/; SameSite=Lax';
    const gw=Q('guest-warning'); if(gw) gw.classList.remove('show');
    _renderUserChip(); renderHome(); showFab('home');
    Q('app').classList.add('unlocked');
    const ao=Q('auth-overlay'); if(ao) ao.classList.add('hidden');
  }catch(e){ console.warn('_initFromServer:',e); }
}

/* ── Background Drive sync (called on reload, non-blocking) ── */
async function _driveSync(){
  if(_guestMode) return;
  try{
    const res=await fetch('/api/data',{credentials:'include'});
    if(!res.ok){
      /* Session expired — redirect to home so user can re-authenticate */
      if(res.status===401){
        localStorage.removeItem('splittr_user');
        window.location.href='/';
      }
      return;
    }
    const data=await res.json();
    if(data.groups&&data.groups.length){
      S.groups=_migrateGroups(data.groups);
      localStorage.setItem('split-v4',JSON.stringify(S.groups));
      renderHome();
    } else {
      /* Drive is empty but we have local data — upload it */
      const local=localStorage.getItem('split-v4');
      if(local) try{
        const localGroups=_migrateGroups(JSON.parse(local));
        if(localGroups.length){ S.groups=localGroups; await _apiSave(true); renderHome(); }
      }catch(e){}
    }
    try{_renderUserChip();}catch(e){}
  }catch(e){}
}

/* ── Guest mode (kept for backward compatibility, no longer accessible from UI) ── */
const _guestOv=()=>Q('guest-confirm-ov');
const _guestBtn=Q('guest-btn');
if(_guestBtn) _guestBtn.onclick=()=>_guestOv()&&_guestOv().classList.add('open');
const _guestConfirmOk=Q('guest-confirm-ok');
if(_guestConfirmOk) _guestConfirmOk.onclick=()=>{ _guestOv()&&_guestOv().classList.remove('open'); localStorage.setItem('splittr_guest','1'); _enterGuestMode(); };
const _guestConfirmCancel=Q('guest-confirm-cancel');
if(_guestConfirmCancel) _guestConfirmCancel.onclick=()=>_guestOv()&&_guestOv().classList.remove('open');
if(_guestOv()) _guestOv().addEventListener('click',e=>{ if(e.target===_guestOv()) _guestOv().classList.remove('open'); });

function _enterGuestMode(){
  _guestMode=true; load(); renderHome(); showFab('home');
  const app=Q('app');
  if(app) app.classList.add('unlocked');
  const ao=Q('auth-overlay'); if(ao) ao.classList.add('hidden');
  document.documentElement.classList.add('splittr-authed');
  const gw=Q('guest-warning'); if(gw) gw.classList.add('show');
  setSyncDone();
}

Q('guest-warning-signin').onclick=()=>{
  /* Do NOT remove split-v4 here — _initFromServer will merge it with Drive data */
  const btn=Q('guest-warning-signin');
  btn.textContent='Uploading & signing in…';
  btn.style.opacity='.6';btn.style.pointerEvents='none';
  localStorage.removeItem('splittr_guest');
  document.cookie='splittr_guest=; Max-Age=0; path=/; SameSite=Lax';
  window.location.href='/api/auth/url';
};

/* ── Sign out ── */
async function _doSignOut(){
  try{ await fetch('/api/auth/logout',{method:'POST',credentials:'include'}); }catch(e){}
  /* Clear ALL local storage so no stale data persists after sign-out */
  localStorage.removeItem('splittr_user');
  localStorage.removeItem('splittr_guest');
  localStorage.removeItem('split-v4');
  /* Clear all cookies */
  document.cookie = 'splittr_guest=; Max-Age=0; path=/; SameSite=Lax';
  document.cookie = 'splittr_has_session=; Max-Age=0; path=/; SameSite=Lax';
  document.cookie = 'splittr_sess=; Max-Age=0; path=/; SameSite=Lax';
  /* Reset in-memory state */
  _currentUser=null; _guestMode=false; S={groups:[],activeId:null};
  /* Redirect home — full page reload ensures clean slate */
  window.location.href='/';
}
Q('signout-confirm-ok').onclick=()=>{ Q('signout-confirm-ov').classList.remove('open'); _doSignOut(); };
Q('signout-confirm-cancel').onclick=()=>Q('signout-confirm-ov').classList.remove('open');
Q('signout-confirm-ov').addEventListener('click',e=>{ if(e.target===Q('signout-confirm-ov')) Q('signout-confirm-ov').classList.remove('open'); });
Q('force-sync-btn').onclick=async()=>{ Q('user-menu').classList.remove('open'); await _apiSave(true); snack('Synced to Drive ✓'); };

/* ── User chip → toggle profile menu ── */
Q('user-chip').onclick=(e)=>{ e.stopPropagation(); Q('user-menu').classList.toggle('open'); };
Q('signout-btn').onclick=()=>{ Q('user-menu').classList.remove('open'); Q('signout-confirm-ov').classList.add('open'); };
document.addEventListener('click',(e)=>{ const m=Q('user-menu'); if(m&&m.classList.contains('open')&&!m.contains(e.target)) m.classList.remove('open'); });

/* ══════════════════════════════════════════════════════════════════
   DRIVE SYNC — server handles tokens + refresh automatically
   FIX: tokens never expire from user's perspective (server refreshes)
   FIX: quota saved via 500ms debounce batching
   FIX: localStorage written first so offline always works
   ══════════════════════════════════════════════════════════════════ */
function setSyncing(l='Syncing…'){const el=Q('sync-indicator');el.className='sync-indicator syncing';el.querySelector('.mi').textContent='sync';Q('sync-label').textContent=l;}
function setSyncDone(){Q('sync-indicator').className='sync-indicator';}
function setSyncError(l='Sync failed'){const el=Q('sync-indicator');el.className='sync-indicator error';el.querySelector('.mi').textContent='sync_problem';Q('sync-label').textContent=l;setTimeout(setSyncDone,4000);}

async function _apiSave(immediate=false){
  try{ localStorage.setItem('split-v4',JSON.stringify(S.groups)); }catch(e){}
  if(_guestMode) return;
  const doSave=async()=>{
    setSyncing();
    try{
      const res=await fetch('/api/data',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({groups:S.groups})});
      if(!res.ok) throw new Error('Save failed');
      setSyncDone();
    }catch(e){ setSyncError(); }
  };
  if(immediate){ await doSave(); return; }
  clearTimeout(_syncTimer); _syncTimer=setTimeout(doSave,500);
}

/* ── User chip ── */
function _renderUserChip(){
  const chip=Q('user-chip'); if(!chip) return;
  chip.style.display='flex';
  const firstName=(_currentUser?.name||'').split(' ')[0]||'';
  Q('user-display-name').textContent=firstName||'Me';
  Q('um-name').textContent=_currentUser?.name||'—';
  Q('um-email').textContent=_currentUser?.email||'—';
  const fallback=Q('user-avatar-fallback'),img=Q('user-avatar-img');
  const umFallback=Q('um-avatar-fallback'),umImg=Q('um-avatar-img');
  if(_currentUser?.picture){
    img.src=_currentUser.picture;img.style.display='block';fallback.style.display='none';
    umImg.src=_currentUser.picture;umImg.style.display='block';umFallback.style.display='none';
  } else if(firstName){
    img.style.display='none';fallback.className='user-avatar-fallback';fallback.innerHTML=firstName[0].toUpperCase();fallback.style.display='flex';
    umImg.style.display='none';umFallback.className='um-avatar-fallback';umFallback.innerHTML=firstName[0].toUpperCase();umFallback.style.display='flex';
  } else {
    img.style.display='none';fallback.style.display='none';umImg.style.display='none';
    umFallback.innerHTML='<span class="mi">account_circle</span>';umFallback.style.display='flex';
  }
}

/* ─── Data helpers ───────────────────────────────── */
function _migrateGroups(groups){
  groups.forEach(g=>{
    if(!g.joinDates)g.joinDates={};
    if(!g.settlements)g.settlements=[];
    const fallback=g.createdAt||td();
    g.members.forEach(m=>{if(!g.joinDates[m])g.joinDates[m]=fallback;});
    g.expenses.forEach(e=>{if(!e.category)e.category='other';if(!e.splitMode)e.splitMode='equal';});
  });
  return groups;
}
const load=()=>{ try{const d=localStorage.getItem('split-v4');if(d)S.groups=_migrateGroups(JSON.parse(d));}catch(e){} };
const save=()=>_apiSave();
const getG=id=>S.groups.find(g=>g.id===id);
const act=()=>getG(S.activeId);
const getJoinDate=(g,m)=>g.joinDates?.[m]||g.createdAt||td();
load();
/* ─── SYNC SPLIT AMONG by join dates ────────────── */
function syncMemberSplits(g,memberName){
  const jd=getJoinDate(g,memberName);
  g.expenses.forEach(exp=>{
    const inList=exp.splitAmong.includes(memberName);
    const shouldInclude=exp.date>=jd;
    if(shouldInclude&&!inList) exp.splitAmong.push(memberName);
    if(!shouldInclude&&inList) exp.splitAmong=exp.splitAmong.filter(x=>x!==memberName);
  });
}

/* ─── MATH ───────────────────────────────────────── */
function calcStats(g){
  if(!g.expenses.length)return null;
  const tot=g.expenses.reduce((s,e)=>s+Number(e.amount),0);
  const dates=g.expenses.map(e=>e.date).sort();
  const[s,e]=[dates[0],dates[dates.length-1]];
  const days=Math.max(1,Math.round((new Date(e)-new Date(s))/86400000)+1);
  const paid={};g.members.forEach(m=>paid[m]=0);
  g.expenses.forEach(e=>{paid[e.payer]=(paid[e.payer]||0)+Number(e.amount)});
  return{total:tot,startDate:s,endDate:e,days,avgPerDay:tot/days,paid};
}

function calcSettle(g){
  const bal={};g.members.forEach(m=>bal[m]=0);
  g.expenses.forEach(exp=>{
    bal[exp.payer]=(bal[exp.payer]||0)+Number(exp.amount);
    if(exp.splitMode==='unequal'&&exp.customAmounts){
      Object.entries(exp.customAmounts).forEach(([m,amt])=>{
        if(g.members.includes(m)) bal[m]=(bal[m]||0)-Number(amt);
      });
    }else{
      const sp=exp.splitAmong.filter(m=>g.members.includes(m)).length;
      if(!sp)return;
      const sh=Number(exp.amount)/sp;
      exp.splitAmong.forEach(m=>{if(g.members.includes(m))bal[m]=(bal[m]||0)-sh});
    }
  });
  // Apply recorded settlements
  (g.settlements||[]).forEach(s=>{
    if(g.members.includes(s.from))bal[s.from]=(bal[s.from]||0)+Number(s.amount);
    if(g.members.includes(s.to))bal[s.to]=(bal[s.to]||0)-Number(s.amount);
  });
  const pos=Object.entries(bal).filter(([,v])=>v>0.01).map(([n,v])=>({n,v})).sort((a,b)=>b.v-a.v);
  const neg=Object.entries(bal).filter(([,v])=>v<-0.01).map(([n,v])=>({n,v:-v})).sort((a,b)=>b.v-a.v);
  const txns=[];let i=0,j=0;
  while(i<pos.length&&j<neg.length){
    const a=Math.min(pos[i].v,neg[j].v);
    if(a>0.01)txns.push({from:neg[j].n,to:pos[i].n,amount:Math.round(a*100)/100});
    pos[i].v-=a;neg[j].v-=a;
    if(pos[i].v<0.01)i++;if(neg[j].v<0.01)j++;
  }
  return{bal,txns};
}

/* ─── PAGE TRANSITIONS ───────────────────────────── */
function goTo(pageId,dir='fwd'){
  const from=document.querySelector('.page.active'),to=Q('page-'+pageId);
  if(!to||from===to)return;
  to.classList.remove('hidden');to.classList.add(dir==='fwd'?'slide-right':'slide-left');
  to.getBoundingClientRect();
  requestAnimationFrame(()=>{
    from.classList.remove('active');from.classList.add(dir==='fwd'?'slide-left':'slide-right');
    to.classList.remove('slide-right','slide-left');to.classList.add('active');
    setTimeout(()=>{from.classList.add('hidden');from.classList.remove('slide-left','slide-right','active')},400);
  });
}

/* ─── FAB ────────────────────────────────────────── */
function showFab(which){
  Q('fab-home').classList.toggle('fab-hidden',which!=='home');
  Q('fab-exp').classList.toggle('fab-hidden',which!=='exp');
}

/* ─── OVERLAYS ───────────────────────────────────── */
const openOv=id=>Q(id).classList.add('open');
const closeOv=id=>Q(id).classList.remove('open');
document.querySelectorAll('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open')}));

/* ─── CONFIRM DIALOG ─────────────────────────────── */
let cfRes=null;
function confirmDlg(title,text,okLbl='Confirm',danger=true){
  return new Promise(r=>{
    cfRes=r;Q('cft').textContent=title;Q('cft2').textContent=text;
    const ok=Q('cfok');ok.textContent=okLbl;ok.className='btn '+(danger?'btn-ef':'btn-t');
    const iw=Q('cfi');
    iw.style.background=danger?'var(--md-error-container)':'var(--md-secondary-container)';
    iw.style.color=danger?'var(--md-on-error-container)':'var(--md-on-secondary-container)';
    iw.innerHTML=danger?'<span class="mi">warning</span>':'<span class="mi">info</span>';
    openOv('conf-ov');
  });
}
Q('cfcancel').onclick=()=>{closeOv('conf-ov');cfRes&&cfRes(false);cfRes=null};
Q('cfok').onclick=()=>{closeOv('conf-ov');cfRes&&cfRes(true);cfRes=null};

/* ─── CAPTCHA ─────────────────────────────────────── */
let capRes=null,capAnswer=0;
function captchaDlg(title,msg){
  return new Promise(r=>{
    capRes=r;
    const a=Math.floor(Math.random()*9)+1,b=Math.floor(Math.random()*9)+1;
    const ops=[{q:`${a} + ${b}`,ans:a+b},{q:`${a+b} − ${b}`,ans:a},{q:`${a} × ${b}`,ans:a*b}];
    const pick=ops[Math.floor(Math.random()*ops.length)];
    capAnswer=pick.ans;
    Q('cap-title').textContent=title;Q('cap-msg').textContent=msg;Q('cap-q').textContent=pick.q+' = ?';
    Q('cap-ans').value='';openOv('captcha-ov');setTimeout(()=>Q('cap-ans').focus(),300);
  });
}
Q('cap-cancel').onclick=()=>{closeOv('captcha-ov');capRes&&capRes(false);capRes=null};
Q('cap-ok').onclick=()=>{
  const v=parseInt(Q('cap-ans').value);
  if(v!==capAnswer){Q('cap-ans').classList.add('err');Q('cap-ans').value='';Q('cap-ans').placeholder='Wrong! Try again';setTimeout(()=>{Q('cap-ans').classList.remove('err');Q('cap-ans').placeholder='Your answer'},1400);return}
  closeOv('captcha-ov');capRes&&capRes(true);capRes=null;
};
Q('cap-ans').addEventListener('keydown',e=>{if(e.key==='Enter')Q('cap-ok').click()});

/* ─── JOIN DATE DIALOG ───────────────────────────── */
let jdRes=null,jdOrigDate='';
function joinDateDlg(memberName,currentDate,groupName){
  return new Promise(async r=>{
    const proceed=await confirmDlg('Change Join Date?',`You're about to change ${memberName}'s join date in "${groupName}". This will recalculate which expenses they are included in. Continue?`,'Yes, Change',true);
    if(!proceed){r(null);return}
    jdRes=r;jdOrigDate=currentDate;
    Q('jd-title').textContent=`Change Join Date — ${memberName}`;Q('jd-lbl').textContent=`New Join Date for ${memberName}`;
    Q('jd-inp').value=currentDate;Q('jd-warn').innerHTML=`<strong>⚠ Major Change:</strong> Changing <strong>${memberName}</strong>'s join date will immediately recalculate which expenses they are split into.`;
    Q('jd-ok').disabled=true;openOv('jd-ov');setTimeout(()=>Q('jd-inp').focus(),200);
  });
}
Q('jd-inp').addEventListener('input',()=>{Q('jd-ok').disabled=!(Q('jd-inp').value&&Q('jd-inp').value!==jdOrigDate)});
Q('jd-cancel').onclick=()=>{closeOv('jd-ov');jdRes&&jdRes(null);jdRes=null};
Q('jd-ok').onclick=async()=>{
  const d=Q('jd-inp').value;if(!d||d===jdOrigDate)return;
  closeOv('jd-ov');
  const ok=await confirmDlg('Are you sure?','This will recalculate all split data for this member. This cannot be undone easily.','Yes, Change Date',true);
  if(ok){jdRes&&jdRes(d);jdRes=null}else{jdRes&&jdRes(null);jdRes=null}
};

/* ─── SNACKBAR + UNDO ────────────────────────────── */
let snkT,undoPending=null;
function snack(m,undoFn=null){
  const el=Q('snk'),msg=Q('snk-msg'),btn=Q('snk-undo');
  msg.textContent=m;btn.style.display=undoFn?'inline-block':'none';
  el.classList.add('show');clearTimeout(snkT);
  if(undoPending?.commit){undoPending.commit();undoPending=null}
  if(undoFn){
    let committed=false;
    undoPending={commit:()=>{if(!committed){committed=true;undoFn.commit()}}};
    btn.onclick=()=>{committed=true;undoPending=null;undoFn.undo();el.classList.remove('show');snack(undoFn.undoMsg||'Undone')};
    snkT=setTimeout(()=>{el.classList.remove('show');undoPending?.commit();undoPending=null},5000);
  }else{undoPending=null;snkT=setTimeout(()=>el.classList.remove('show'),3000)}
}
Q('snk-close').onclick=()=>{Q('snk').classList.remove('show');undoPending?.commit();undoPending=null;clearTimeout(snkT)};

/* ─── RIPPLE ─────────────────────────────────────── */
document.addEventListener('click',e=>{
  const h=e.target.closest('.rh');if(!h)return;
  const r=document.createElement('div');r.className='re';
  const rect=h.getBoundingClientRect(),sz=Math.max(rect.width,rect.height);
  r.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px`;
  h.appendChild(r);setTimeout(()=>r.remove(),600);
});

/* ─── ACTIONS SIDE SHEET ─────────────────────────── */
function openActsSheet(){Q('acts-sheet').classList.add('open');Q('acts-bd').classList.add('open')}
function closeActsSheet(){Q('acts-sheet').classList.remove('open');Q('acts-bd').classList.remove('open')}
Q('more-btn').onclick=()=>openActsSheet();
Q('acts-close').onclick=closeActsSheet;
Q('acts-bd').onclick=closeActsSheet;

/* ─── OFFLINE DETECTION ──────────────────────────── */
function updateOnlineStatus(){document.body.classList.toggle('offline',!navigator.onLine)}
window.addEventListener('online',updateOnlineStatus);
window.addEventListener('offline',updateOnlineStatus);
updateOnlineStatus();

/* ─── RENDER HOME ────────────────────────────────── */
function renderHome(){
  const el=Q('gc');
  if(!S.groups.length){
    el.innerHTML=`<div class="es" style="grid-column:1/-1"><span class="mi">receipt_long</span><div class="es-t">No expense lists yet</div><p class="es-s">Tap "New List" to create your first shared expense tracker.</p></div>`;return;
  }
  el.innerHTML=S.groups.map(g=>{
    const st=calcStats(g),{txns}=calcSettle(g),c=g.currency||'INR',th=getTheme(g);
    const days=st?st.days:0;
    const isDark=document.documentElement.classList.contains('dark');
    const cardBg=isDark?`linear-gradient(135deg, ${th.fg}28 0%, ${th.fg}10 100%)`:`linear-gradient(135deg, ${th.bg}cc 0%, ${th.bg}55 100%)`;
    const cardBorder=isDark?th.fg+'55':th.fg+'40';
    const iconBg=isDark?th.fg+'22':th.bg;
    const iconShadow=isDark?`0 2px 8px ${th.fg}20`:`0 2px 8px ${th.fg}30`;
    const cnStyle=isDark?`color:#e8eaeb`:'';
    const cmStyle=isDark?`color:rgba(255,255,255,.55)`:'';
    return `<div class="card" data-gid="${g.id}" style="background:${cardBg};border-color:${cardBorder}">
      <div class="ct">
        <div class="ci" style="background:${iconBg};box-shadow:${iconShadow}"><span class="mi" style="font-size:26px;color:${th.fg}">${th.mi}</span></div>
        <div class="card-actions">
          <button class="icon-btn" data-cedit="${g.id}" title="Settings" style="color:${th.fg}"><span class="mi">edit</span></button>
          <button class="icon-btn err" data-cdel="${g.id}" title="Delete"><span class="mi">delete</span></button>
        </div>
      </div>
      <div class="cn" style="${cnStyle}">${esc(g.name)}</div>
      <div class="cm" style="${cmStyle}">${g.members.length} member${g.members.length!==1?'s':''} · ${g.expenses.length} expense${g.expenses.length!==1?'s':''} · ${c}</div>
      <div class="cs">
        <div class="cv"><div class="cvl">Total</div><div class="cvv">${st?fmt(st.total,c):'—'}</div></div>
        <div class="cv"><div class="cvl">Days</div><div class="cvv" style="color:${th.fg}">${days>0?days:'—'}</div></div>
        <div class="cv"><div class="cvl">Status</div><div class="cvv" style="font-size:12px;color:${txns.length?'var(--md-error)':'var(--md-success)'}">${txns.length?txns.length+' pending':'Settled ✓'}</div></div>
      </div>
    </div>`;
  }).join('');
}

/* ─── HOME EVENTS ────────────────────────────────── */
Q('gc').addEventListener('click',async e=>{
  const cedit=e.target.closest('[data-cedit]');
  if(cedit){e.stopPropagation();S.activeId=cedit.dataset.cedit;setActiveTab('expenses');renderGroupPage();goTo('group','fwd');showFab('exp');setTimeout(()=>openSettings(),420);return}
  const cdel=e.target.closest('[data-cdel]');
  if(cdel){
    e.stopPropagation();const g=getG(cdel.dataset.cdel);
    const passed=await captchaDlg('Verify Deletion',`Solve the math to confirm deleting "${g.name}".`);if(!passed)return;
    const ok=await confirmDlg('Final Confirmation',`Permanently delete "${g.name}" and all its data?`,'Delete Forever');
    if(ok){const snap=JSON.stringify(S.groups);S.groups=S.groups.filter(x=>x.id!==g.id);renderHome();snack(`"${g.name}" deleted`,{commit:()=>save(),undo:()=>{try{S.groups=JSON.parse(snap)}catch(e){}renderHome()},undoMsg:`"${g.name}" restored`})}
    return;
  }
  const card=e.target.closest('.card');
  if(card&&!e.target.closest('.card-actions')){S.activeId=card.dataset.gid;setActiveTab('expenses');renderGroupPage();goTo('group','fwd');showFab('exp')}
});

function setActiveTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('act',b.dataset.tab===tab));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('act',p.id==='p-'+tab));
}

/* ─── WIZARD ─────────────────────────────────────── */
let wMems=[],wTheme='none';
function openWizard(){
  wMems=[];wTheme='none';Q('wn').value='';Q('wcur').value='INR';Q('wmi').value='';Q('wmi-date').value=td();
  renderWizChips();setWizStep(0);buildIthGrid('wiz-ith','none',id=>{wTheme=id});openOv('wiz-ov');setTimeout(()=>Q('wn').focus(),300);
}
function setWizStep(n){
  document.querySelectorAll('.wz').forEach((s,i)=>s.classList.toggle('act',i===n));
  ['wd0','wd1','wd2'].forEach((id,i)=>{Q(id).classList.toggle('act',i===n);Q(id).classList.toggle('done',i<n)});
  Q('wiz-title').textContent=['Create Expense List','Choose Icon & Theme','Add Members'][n];
  if(n===2)Q('wmi-date').value=td();
}
function renderWizChips(){
  Q('wmc').innerHTML=wMems.map((m,i)=>`<div class="chip sel"><span style="width:20px;height:20px;border-radius:50%;background:${mc(i)};display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700">${m.name[0].toUpperCase()}</span>${esc(m.name)}<span class="ts tm" style="font-size:10px">${fd(m.date)}</span><span class="mi" style="font-size:16px;cursor:pointer" data-rwm="${i}">close</span></div>`).join('')||'<span class="ts tm">No members yet — add them later</span>';
  Q('wmcnt').textContent=wMems.length;
}
function wizAM(){const inp=Q('wmi'),n=inp.value.trim(),d=Q('wmi-date').value||td();if(!n||wMems.find(m=>m.name===n)){inp.focus();return}wMems.push({name:n,date:d});inp.value='';Q('wmi-date').value=td();renderWizChips();inp.focus()}
Q('wiz-cancel').onclick=()=>closeOv('wiz-ov');
Q('wn0').onclick=()=>{const n=Q('wn').value.trim();if(!n){Q('wn').classList.add('err');Q('wn').focus();return}Q('wn').classList.remove('err');setWizStep(1)};
Q('wb0').onclick=()=>setWizStep(0);Q('wn1').onclick=()=>{setWizStep(2);setTimeout(()=>Q('wmi').focus(),100)};Q('wb1').onclick=()=>setWizStep(1);
Q('wam').onclick=wizAM;Q('wmi').onkeydown=e=>{if(e.key==='Enter')Q('wmi-date').focus()};Q('wmi-date').onkeydown=e=>{if(e.key==='Enter')wizAM()};
Q('wmc').addEventListener('click',e=>{const i=e.target.closest('[data-rwm]')?.dataset.rwm;if(i!==undefined){wMems.splice(+i,1);renderWizChips()}});
Q('wcreate').onclick=()=>{
  const name=Q('wn').value.trim(),currency=Q('wcur').value;if(!name){setWizStep(0);Q('wn').focus();return}
  const today=td(),joinDates={};wMems.forEach(m=>joinDates[m.name]=m.date||today);
  const g={id:uid(),name,currency,theme:wTheme,members:wMems.map(m=>m.name),joinDates,expenses:[],settlements:[],createdAt:today};
  S.groups.push(g);save();renderHome();closeOv('wiz-ov');snack(`"${name}" created!`);
};
Q('fab-home').onclick=openWizard;

/* ─── TABS ───────────────────────────────────────── */
Q('gtabs').addEventListener('click',e=>{
  const btn=e.target.closest('.tab-btn');if(!btn)return;
  const tab=btn.dataset.tab;
  setActiveTab(tab);showFab(tab==='expenses'?'exp':'none');
});

/* ─── RENDER GROUP ───────────────────────────────── */
function renderGroupPage(){
  const g=act();if(!g)return;
  Q('gbar-title').textContent=g.name;
  rExpenses(g);rMembers(g);rStats(g);rSettle(g);
}

/* ─── CATEGORY BADGE HTML ────────────────────────── */
function catBadge(catId){
  if(!catId||catId==='other')return'';
  const cat=getCat(catId);
  return `<span class="cat-badge" style="background:${cat.bg};color:${cat.color}"><span class="mi">${cat.mi}</span>${cat.label}</span>`;
}

/* ─── SWIPE TO DELETE ────────────────────────────── */
let activeSwipe=null;
function attachSwipe(wrap,onDelete){
  const inner=wrap.querySelector('.er-inner');
  let startX=0,startY=0,dx=0,swiping=false,locked=false;
  wrap.addEventListener('touchstart',e=>{
    if(activeSwipe&&activeSwipe!==wrap){closeActiveSwipe();return}
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;dx=0;swiping=true;locked=false;
  },{passive:true});
  wrap.addEventListener('touchmove',e=>{
    if(!swiping)return;
    const cx=e.touches[0].clientX,cy=e.touches[0].clientY;
    dx=cx-startX;const dy=cy-startY;
    if(!locked&&Math.abs(dy)>Math.abs(dx)){swiping=false;return}
    locked=true;
    if(dx<0){
      inner.style.transition='none';
      inner.style.transform=`translateX(${Math.max(-88,dx)}px)`;
      if(dx<-10)e.preventDefault();
    }else if(inner.classList.contains('swiped-open')){
      inner.style.transition='none';
      inner.style.transform=`translateX(${Math.min(0,-88+dx)}px)`;
    }
  },{passive:false});
  wrap.addEventListener('touchend',()=>{
    if(!swiping)return;swiping=false;
    inner.style.transition='';
    if(dx<-44){
      inner.classList.add('swiped-open');inner.style.transform='';
      activeSwipe=wrap;
    }else if(dx>20&&inner.classList.contains('swiped-open')){
      inner.classList.remove('swiped-open');inner.style.transform='';activeSwipe=null;
    }else{inner.style.transform='';inner.classList.remove('swiped-open');activeSwipe=null}
  },{passive:true});
  // Tap the red delete bg to delete
  const delBg=wrap.querySelector('.er-del-bg');
  if(delBg)delBg.addEventListener('click',onDelete);
}
function closeActiveSwipe(){
  if(!activeSwipe)return;
  const inner=activeSwipe.querySelector('.er-inner');
  if(inner){inner.classList.remove('swiped-open');inner.style.transform=''}
  activeSwipe=null;
}
document.addEventListener('touchstart',e=>{if(activeSwipe&&!activeSwipe.contains(e.target))closeActiveSwipe()},{passive:true});

/* ─── RENDER EXPENSES ────────────────────────────── */
function rExpenses(g){
  const el=Q('p-expenses'),c=g.currency||'USD';
  let expenses=[...g.expenses];

  // Build filter bar
  const allCatsUsed=[...new Set(expenses.map(e=>e.category||'other'))];
  const allPayers=[...new Set(expenses.map(e=>e.payer))];

  let filterHtml=`<span class="filter-chip ${expFilter.category==='all'?'sel':''}" data-fcat="all"><span class="mi">apps</span>All</span>`;
  allCatsUsed.forEach(cid=>{
    const cat=getCat(cid);
    filterHtml+=`<span class="filter-chip ${expFilter.category===cid?'sel':''}" data-fcat="${cid}"><span class="mi">${cat.mi}</span>${cat.label}</span>`;
  });
  filterHtml+=`<div class="filter-divider"></div>`;
  filterHtml+=`<select class="sort-select" id="exp-sort-sel">
    <option value="date-desc" ${expSort==='date-desc'?'selected':''}>Newest first</option>
    <option value="date-asc" ${expSort==='date-asc'?'selected':''}>Oldest first</option>
    <option value="amount-desc" ${expSort==='amount-desc'?'selected':''}>Highest amount</option>
    <option value="amount-asc" ${expSort==='amount-asc'?'selected':''}>Lowest amount</option>
    <option value="category" ${expSort==='category'?'selected':''}>By category</option>
  </select>`;

  // Apply filter
  if(expFilter.category!=='all')expenses=expenses.filter(e=>(e.category||'other')===expFilter.category);
  if(expFilter.payer!=='all')expenses=expenses.filter(e=>e.payer===expFilter.payer);

  // Apply sort
  if(expSort==='date-desc')expenses.sort((a,b)=>b.date.localeCompare(a.date));
  else if(expSort==='date-asc')expenses.sort((a,b)=>a.date.localeCompare(b.date));
  else if(expSort==='amount-desc')expenses.sort((a,b)=>Number(b.amount)-Number(a.amount));
  else if(expSort==='amount-asc')expenses.sort((a,b)=>Number(a.amount)-Number(b.amount));
  else if(expSort==='category')expenses.sort((a,b)=>(a.category||'other').localeCompare(b.category||'other'));

  filterHtml+=`<span class="filter-count">${expenses.length} expense${expenses.length!==1?'s':''}</span>`;

  if(!g.expenses.length){
    el.innerHTML=`<div class="es"><span class="mi">receipt</span><div class="es-t">No expenses yet</div><p class="es-s">${g.members.length===0?'Add members in Settings first.':'Tap "Add Expense" to start.'}</p></div>`;return;
  }

  let html=`<div class="filter-bar">${filterHtml}</div>`;

  if(!expenses.length){
    html+=`<div class="es" style="padding:50px 24px"><span class="mi">filter_list</span><div class="es-t">No matches</div><p class="es-s">Try a different filter.</p></div>`;
    el.innerHTML=html;bindFilterBar(el,g);return;
  }

  if(expSort==='date-desc'||expSort==='date-asc'){
    const byD={};expenses.forEach(e=>{(byD[e.date]=byD[e.date]||[]).push(e)});
    html+=Object.entries(byD).sort((a,b)=>expSort==='date-asc'?a[0].localeCompare(b[0]):b[0].localeCompare(a[0])).map(([date,exps])=>`
      <div class="dh2">${fd(date)}</div>${exps.map(exp=>expRow(exp,g,c)).join('')}`).join('');
  }else{
    html+=expenses.map(exp=>expRow(exp,g,c)).join('');
  }
  el.innerHTML=html;
  bindFilterBar(el,g);
  // Attach swipe
  el.querySelectorAll('.er-wrap').forEach(wrap=>{
    const expId=wrap.dataset.expid;
    attachSwipe(wrap,()=>deleteExpenseWithConfirm(expId));
  });
}

function expRow(exp,g,c){
  const mi=g.members.indexOf(exp.payer);
  let perPerson='';
  if(exp.splitMode==='unequal'&&exp.customAmounts){
    perPerson='Custom split';
  }else{
    const pp=Number(exp.amount)/Math.max(1,exp.splitAmong.length);
    perPerson=fmt(pp,c)+'/person';
  }
  const sl=exp.splitMode==='unequal'?Object.keys(exp.customAmounts||{}).join(', '):exp.splitAmong.length===g.members.length?'Everyone':exp.splitAmong.join(', ');
  const badge=catBadge(exp.category);
  return `<div class="er-wrap" data-expid="${exp.id}">
    <div class="er-del-bg"><span class="mi">delete</span><span>Delete</span></div>
    <div class="er-inner">
      <div class="av" style="background:${mc(mi<0?0:mi)}">${(exp.payer||'?')[0].toUpperCase()}</div>
      <div class="ei">
        <div class="et">${badge}${esc(exp.note||'Expense')}</div>
        <div class="em">Paid by <strong>${esc(exp.payer)}</strong> · ${esc(sl)} · ${perPerson}</div>
      </div>
      <div class="erv">
        <div class="ea">${fmt(exp.amount,c)}</div>
        <div class="eab">
          <button class="icon-btn" data-eedit="${exp.id}" title="Edit" style="color:var(--md-primary)"><span class="mi" style="font-size:20px">edit</span></button>
          <button class="icon-btn err" data-edel="${exp.id}" title="Delete"><span class="mi" style="font-size:20px">delete</span></button>
        </div>
      </div>
    </div>
  </div>`;
}

function bindFilterBar(el,g){
  el.querySelectorAll('[data-fcat]').forEach(chip=>{
    chip.addEventListener('click',()=>{expFilter.category=chip.dataset.fcat;rExpenses(g)});
  });
  const sortSel=el.querySelector('#exp-sort-sel');
  if(sortSel)sortSel.addEventListener('change',()=>{expSort=sortSel.value;rExpenses(g)});
}

async function deleteExpenseWithConfirm(expId){
  const g=act();if(!g)return;
  const exp=g.expenses.find(x=>x.id===expId);if(!exp)return;
  const ok=await confirmDlg('Delete Expense?',`Delete "${exp.note||'this expense'}" (${fmt(exp.amount,g.currency||'INR')})?`,'Delete');
  if(ok){
    const snap=JSON.stringify(g.expenses);
    g.expenses=g.expenses.filter(x=>x.id!==expId);
    renderGroupPage();
    snack('Expense deleted',{commit:()=>save(),undo:()=>{try{g.expenses=JSON.parse(snap)}catch(e){}renderGroupPage()},undoMsg:'Expense restored'});
  }else{closeActiveSwipe()}
}

/* ─── EXPENSE CLICK EVENTS ───────────────────────── */
Q('p-expenses').addEventListener('click',async e=>{
  const eb=e.target.closest('[data-eedit]'),db=e.target.closest('[data-edel]');
  if(eb){
    const g=act(),exp=g.expenses.find(x=>x.id===eb.dataset.eedit);
    const ok=await confirmDlg('Edit Expense?',`Edit "${exp?.note||'this expense'}" (${fmt(exp?.amount,g.currency||'INR')})?`,'Edit',false);
    if(ok)openExpDlg(eb.dataset.eedit);return;
  }
  if(db){deleteExpenseWithConfirm(db.dataset.edel);return}
});

/* ─── EXPENSE DIALOG ─────────────────────────────── */
let editExpId=null;
let splitModeState='equal';

// Build category options
function buildCatSelect(){
  Q('ecat').innerHTML=EXPENSE_CATS.map(c=>`<option value="${c.id}">${c.label}</option>`).join('');
}

function buildCustomSplitRows(members,amounts={}){
  const g=act();const c=g?.currency||'INR';
  Q('custom-split-rows').innerHTML=members.map((m,i)=>`
    <div class="csr">
      <div class="csr-av" style="background:${mc(i)}">${m[0].toUpperCase()}</div>
      <div class="csr-name">${esc(m)}</div>
      <input class="csr-inp" type="number" min="0" step="0.01" placeholder="0.00" data-csm="${esc(m)}" value="${amounts[m]||''}">
    </div>`).join('');
  Q('custom-split-rows').querySelectorAll('.csr-inp').forEach(inp=>inp.addEventListener('input',updateSplitTotal));
  updateSplitTotal();
}

function updateSplitTotal(){
  const g=act();const c=g?.currency||'INR';
  const total=parseFloat(Q('ea').value)||0;
  const assigned=[...Q('custom-split-rows').querySelectorAll('.csr-inp')].reduce((s,i)=>s+(parseFloat(i.value)||0),0);
  const disp=Q('split-total-display');
  const rounded=Math.round(assigned*100)/100,rtotal=Math.round(total*100)/100;
  const ok=Math.abs(rounded-rtotal)<0.01;
  disp.textContent=`${fmt(assigned,c)} / ${fmt(total,c)}`;
  disp.className=ok?'split-total-ok':'split-total-err';
}

Q('ea').addEventListener('input',()=>{if(splitModeState==='unequal')updateSplitTotal()});

function openExpDlg(expId=null){
  const g=act();if(!g||!g.members.length){openOv('nomem-ov');return}
  buildCatSelect();
  editExpId=expId;const exp=expId?g.expenses.find(e=>e.id===expId):null;
  Q('exp-title').textContent=expId?'Edit Expense':'Add Expense';
  Q('ea').value=exp?exp.amount:'';Q('ed').value=exp?exp.date:td();Q('en').value=exp?exp.note:'';
  Q('ecat').value=exp?.category||'other';

  // Payer chips
  const sp=exp?exp.payer:g.members[0];
  Q('epc').innerHTML=g.members.map((m,i)=>`<button class="chip ${m===sp?'sel':''}" data-p="${esc(m)}"><span style="width:18px;height:18px;border-radius:50%;background:${mc(i)};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0">${m[0].toUpperCase()}</span>${esc(m)}</button>`).join('');

  // Split mode
  splitModeState=(exp?.splitMode==='unequal')?'unequal':'equal';
  updateSplitModeUI(g,exp);

  openOv('exp-ov');setTimeout(()=>Q('ea').focus(),300);
}

function updateSplitModeUI(g,exp){
  const g2=g||act();
  const isEq=splitModeState==='equal';
  Q('split-eq').classList.toggle('act',isEq);
  Q('split-uneq').classList.toggle('act',!isEq);
  Q('eq-split-section').style.display=isEq?'':'none';
  Q('uneq-split-section').style.display=isEq?'none':'';
  if(isEq){
    const ss=exp?exp.splitAmong:[...g2.members];
    Q('esc').innerHTML=g2.members.map((m,i)=>`<button class="chip ${ss.includes(m)?'sel':''}" data-s="${esc(m)}"><span style="width:18px;height:18px;border-radius:50%;background:${mc(i)};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0">${m[0].toUpperCase()}</span>${esc(m)}</button>`).join('');
  }else{
    const amounts=(exp?.splitMode==='unequal'&&exp?.customAmounts)||{};
    buildCustomSplitRows(g2.members,amounts);
  }
}

Q('split-eq').onclick=()=>{splitModeState='equal';updateSplitModeUI()};
Q('split-uneq').onclick=()=>{splitModeState='unequal';updateSplitModeUI()};
Q('epc').addEventListener('click',e=>{const c=e.target.closest('[data-p]');if(!c)return;Q('epc').querySelectorAll('.chip').forEach(x=>x.classList.remove('sel'));c.classList.add('sel')});
Q('esc').addEventListener('click',e=>{const c=e.target.closest('[data-s]');if(c)c.classList.toggle('sel')});
Q('esa').onclick=()=>Q('esc').querySelectorAll('.chip').forEach(c=>c.classList.add('sel'));
Q('ecancel').onclick=()=>closeOv('exp-ov');

Q('esave').addEventListener('click',async()=>{
  const g=act();
  const amount=parseFloat(Q('ea').value),date=Q('ed').value,note=Q('en').value.trim(),category=Q('ecat').value;
  const payer=Q('epc').querySelector('.chip.sel')?.dataset.p;
  if(!amount||amount<=0||!date||!payer){snack('Please fill in all required fields');return}

  let splitMode,splitAmong=[],customAmounts=null;
  if(splitModeState==='unequal'){
    splitMode='unequal';
    customAmounts={};
    let total=0;
    Q('custom-split-rows').querySelectorAll('.csr-inp').forEach(inp=>{
      const v=parseFloat(inp.value)||0;
      if(v>0){customAmounts[inp.dataset.csm]=v;splitAmong.push(inp.dataset.csm);total+=v}
    });
    if(Math.abs(total-amount)>0.01){snack(`Amounts don't add up! (${fmt(total,g.currency||'INR')} ≠ ${fmt(amount,g.currency||'INR')})`);return}
    if(!splitAmong.length){snack('Assign at least one person an amount');return}
  }else{
    splitMode='equal';
    splitAmong=[...Q('esc').querySelectorAll('.chip.sel')].map(c=>c.dataset.s);
    if(!splitAmong.length){snack('Please select at least one person to split with');return}
  }

  if(editExpId){
    const ok=await confirmDlg('Save Changes?','Save the updated expense details?','Save',false);if(!ok)return;
    const idx=g.expenses.findIndex(e=>e.id===editExpId);
    if(idx!==-1)g.expenses[idx]={...g.expenses[idx],amount,date,note,payer,category,splitMode,splitAmong,customAmounts};
    snack('Expense updated');
  }else{
    g.expenses.push({id:uid(),amount,date,note,payer,category,splitMode,splitAmong,customAmounts});
    snack('Expense added');
  }
  save();closeOv('exp-ov');renderGroupPage();
});
Q('fab-exp').onclick=()=>openExpDlg();

/* ─── RENDER MEMBERS ─────────────────────────────── */
function rMembers(g){
  const el=Q('p-members'),{bal}=calcSettle(g),st=calcStats(g),c=g.currency||'INR';
  if(!g.members.length){
    el.innerHTML=`<div class="no-mem-empty"><span class="mi">group_add</span><div><div style="font-size:20px;font-weight:600;margin-bottom:6px">No members yet</div><div class="ts tm">Add people to start splitting expenses</div></div><button class="btn btn-f" id="mem-add-first" style="height:48px;font-size:15px;border-radius:var(--r-lg);box-shadow:var(--e2)"><span class="mi" style="font-size:18px">group_add</span>Add Member</button></div>`;
    Q('mem-add-first').onclick=()=>openAddMemDlg();return;
  }
  el.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 4px">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--md-primary)">${g.members.length} Member${g.members.length!==1?'s':''}</div>
    <button class="btn btn-x btn-sm" id="add-mem-btn"><span class="mi" style="font-size:16px">person_add</span>Add</button>
  </div>
  <div id="inline-add-bar" style="display:none;padding:4px 16px 8px;background:color-mix(in srgb,var(--md-primary) 5%,transparent);border-radius:var(--r-md);margin:0 16px 8px">
    <div style="display:flex;flex-direction:column;gap:8px;padding:8px 0">
      <input class="fi" id="inline-mi2" placeholder="Member name" maxlength="40" autocomplete="off" autocapitalize="words" style="height:48px">
      <div style="display:flex;gap:8px;align-items:flex-end">
        <div style="flex:1"><label class="fl" style="margin-bottom:4px">Join Date</label><input class="fi" id="inline-date2" type="date"></div>
        <button class="btn btn-f btn-sm" id="inline-am2" style="flex-shrink:0;margin-bottom:1px"><span class="mi">check</span>Add</button>
        <button class="icon-btn" id="inline-cancel2" style="flex-shrink:0;margin-bottom:1px"><span class="mi">close</span></button>
      </div>
    </div>
  </div>
  <div class="mg">${g.members.map((m,i)=>{
    const paid=st?.paid[m]||0,b=bal[m]||0,jd=getJoinDate(g,m);
    return `<div class="mc"><div class="mct"><div class="av" style="background:${mc(i)};width:44px;height:44px;font-size:16px">${m[0].toUpperCase()}</div>
    <div><div style="font-size:16px;font-weight:600">${esc(m)}</div><button class="jd-badge" data-jdedit="${esc(m)}"><span class="mi">calendar_today</span>Joined ${fd(jd)}</button></div></div>
    <div class="mbg">
      <div class="mbt"><div class="bl">Paid</div><div class="bv">${fmt(paid,c)}</div></div>
      <div class="mbt" style="background:${b>0.01?'rgba(55,105,60,.12)':b<-0.01?'rgba(186,26,26,.1)':'var(--md-surface-variant)'}">
        <div class="bl">Balance</div><div class="bv ${b>0.01?'bp':b<-0.01?'bn':'bz'}">${b>0?'+':''}${fmt(b,c)}</div>
      </div>
    </div></div>`;
  }).join('')}</div>`;
  const addBar=Q('inline-add-bar');
  Q('add-mem-btn').onclick=()=>{const isOpen=addBar.style.display!=='none';addBar.style.display=isOpen?'none':'block';if(!isOpen){Q('inline-date2').value=td();setTimeout(()=>Q('inline-mi2').focus(),50)}};
  Q('inline-am2').onclick=inlineAddMember2;Q('inline-mi2').onkeydown=e=>{if(e.key==='Enter')Q('inline-date2').focus()};Q('inline-date2').onkeydown=e=>{if(e.key==='Enter')inlineAddMember2()};Q('inline-cancel2').onclick=()=>{addBar.style.display='none'};
}

function openAddMemDlg(){Q('addmem-name').value='';Q('addmem-date').value=td();openOv('addmem-ov');setTimeout(()=>Q('addmem-name').focus(),300)}
Q('addmem-cancel').onclick=()=>closeOv('addmem-ov');
Q('addmem-ok').onclick=()=>{
  const name=Q('addmem-name').value.trim(),date=Q('addmem-date').value||td(),g=act();
  if(!name){Q('addmem-name').classList.add('err');Q('addmem-name').focus();return}
  Q('addmem-name').classList.remove('err');
  if(g.members.includes(name)){snack('Member already exists');return}
  g.members.push(name);if(!g.joinDates)g.joinDates={};g.joinDates[name]=date;
  save();closeOv('addmem-ov');renderGroupPage();snack(`${name} added`);
};
Q('addmem-name').onkeydown=e=>{if(e.key==='Enter')Q('addmem-date').focus()};Q('addmem-date').onkeydown=e=>{if(e.key==='Enter')Q('addmem-ok').click()};
Q('nomem-cancel').onclick=()=>closeOv('nomem-ov');Q('nomem-add').onclick=()=>{closeOv('nomem-ov');openAddMemDlg()};

async function inlineAddMember2(){
  const inp=Q('inline-mi2'),name=inp.value.trim(),date=Q('inline-date2').value||td(),g=act();
  if(!name){inp.focus();return}if(g.members.includes(name)){snack('Already exists');return}
  g.members.push(name);if(!g.joinDates)g.joinDates={};g.joinDates[name]=date;
  save();inp.value='';Q('inline-date2').value=td();Q('inline-add-bar').style.display='none';renderGroupPage();snack(`${name} added`);
}

Q('p-members').addEventListener('click',async e=>{
  const jb=e.target.closest('[data-jdedit]');if(!jb)return;
  const mName=jb.dataset.jdedit,g=act();const cur=getJoinDate(g,mName);
  const newDate=await joinDateDlg(mName,cur,g.name);if(!newDate)return;
  if(!g.joinDates)g.joinDates={};g.joinDates[mName]=newDate;syncMemberSplits(g,mName);
  save();renderGroupPage();snack(`${mName}'s join date updated to ${fd(newDate)}`);
});

/* ─── RENDER STATS ───────────────────────────────── */
function rStats(g){
  const el=Q('p-stats'),st=calcStats(g),c=g.currency||'INR';
  if(!st){el.innerHTML=`<div class="es"><span class="mi">bar_chart</span><div class="es-t">No data yet</div><p class="es-s">Add expenses to see statistics.</p></div>`;return}
  // Category breakdown
  const catTotals={};g.expenses.forEach(e=>{const cid=e.category||'other';catTotals[cid]=(catTotals[cid]||0)+Number(e.amount)});
  const catRows=Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).map(([cid,amt])=>{
    const cat=getCat(cid);const pct=st.total>0?amt/st.total*100:0;
    return `<div class="crr"><div class="crh">
      <div class="crn"><span class="mi" style="font-size:18px;color:${cat.color}">${cat.mi}</span>${cat.label}</div>
      <div class="cra">${fmt(amt,c)} <span class="tm ts">(${pct.toFixed(1)}%)</span></div>
    </div><div class="pt"><div class="pf" style="width:${pct}%;background:${cat.color}"></div></div></div>`;
  }).join('');

  el.innerHTML=`<div class="stg">${[
    {l:'Total Expenses',v:fmt(st.total,c)},{l:'Duration',v:st.days+' days',s:fd(st.startDate)+' → '+fd(st.endDate)},
    {l:'Avg / Day',v:fmt(st.avgPerDay,c)},{l:'Avg / Person',v:fmt(st.total/Math.max(1,g.members.length),c)},
  ].map(x=>`<div class="stc"><div class="stl">${x.l}</div><div class="stv">${x.v}</div>${x.s?`<div class="sts">${x.s}</div>`:''}</div>`).join('')}</div>
  <div style="padding:8px 16px 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--md-primary)">By Category</div>
  <div class="crs">${catRows}</div>
  <div style="padding:8px 16px 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--md-primary)">Paid by each person</div>
  <div class="crs">${g.members.map((m,i)=>{
    const p=st.paid[m]||0,pct=st.total>0?p/st.total*100:0;
    return `<div class="crr"><div class="crh">
      <div class="crn"><div class="av" style="width:28px;height:28px;font-size:12px;background:${mc(i)}">${m[0].toUpperCase()}</div>${esc(m)}</div>
      <div class="cra">${fmt(p,c)} <span class="tm ts">(${pct.toFixed(1)}%)</span></div>
    </div><div class="pt"><div class="pf" style="width:${pct}%;background:${mc(i)}"></div></div></div>`;
  }).join('')}</div>`;
}

/* ─── RENDER SETTLE ──────────────────────────────── */
function rSettle(g){
  const el=Q('p-settle'),{bal,txns}=calcSettle(g),c=g.currency||'INR';
  if(!g.expenses.length&&!(g.settlements||[]).length){el.innerHTML=`<div class="es"><span class="mi">handshake</span><div class="es-t">Nothing to settle</div><p class="es-s">Add expenses to see who owes who.</p></div>`;return}

  const settlementsHtml=(g.settlements||[]).length?`
    <div style="padding:8px 16px 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--md-success)">Recorded Settlements</div>
    <div style="display:flex;flex-direction:column;gap:8px;padding:0 16px 16px">
      ${(g.settlements||[]).map(s=>`<div class="sett-card">
        <div>
          <div style="font-size:14px;font-weight:600">${esc(s.from)} → ${esc(s.to)}</div>
          <div class="ts tm">${fd(s.date)}${s.note?` · ${esc(s.note)}`:''}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:18px;font-weight:700;color:var(--md-success)">${fmt(s.amount,c)}</div>
          <button class="sett-del" data-dsett="${s.id}"><span class="mi">delete</span></button>
        </div>
      </div>`).join('')}
    </div>`:'';

  el.innerHTML=`
  <div style="padding:12px 16px 4px;display:flex;justify-content:flex-end">
    <button class="btn btn-su btn-sm" id="record-sett-btn"><span class="mi">payments</span>Record Settlement</button>
  </div>
  <div style="padding:8px 16px 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--md-primary)">Net Balances</div>
  <div class="bmg">${g.members.map((m,i)=>{const b=bal[m]||0,jd=getJoinDate(g,m);return`<div class="bmc">
    <div class="row" style="gap:8px;margin-bottom:6px"><div class="av" style="width:34px;height:34px;font-size:13px;background:${mc(i)}">${m[0].toUpperCase()}</div><span style="font-size:14px;font-weight:500">${esc(m)}</span></div>
    <div style="font-size:20px;font-weight:600;color:${b>0.01?'var(--md-success)':b<-0.01?'var(--md-error)':'var(--md-on-surface-variant)'}">${b>0?'+':''}${fmt(b,c)}</div>
    <div class="ts tm" style="margin-bottom:4px">${b>0.01?'gets back':b<-0.01?'owes':'settled ✓'}</div>
    <div style="display:flex;align-items:center;gap:3px;font-size:10px;color:var(--md-primary);opacity:.8"><span class="mi" style="font-size:12px">calendar_today</span>Joined ${fd(jd)}</div>
  </div>`}).join('')}</div>
  <div style="padding:8px 16px 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--md-primary)">Suggested Settlements</div>
  <div style="display:flex;flex-direction:column;gap:8px;padding:0 16px 16px">
    ${txns.length===0?`<div class="sbanner"><span class="mi" style="font-size:36px;color:var(--md-on-success-container)">task_alt</span><div style="font-size:17px;font-weight:600;color:var(--md-on-success-container);margin-top:8px">Everyone is settled up!</div></div>`:
    txns.map(t=>{const fi=g.members.indexOf(t.from),ti=g.members.indexOf(t.to);return`<div class="scard">
      <div class="sf">
        <div class="sp"><div class="av" style="width:38px;height:38px;font-size:14px;background:${mc(fi<0?0:fi)}">${t.from[0].toUpperCase()}</div>
          <div><div style="font-size:14px;font-weight:600;color:var(--md-error)">${esc(t.from)}</div><div class="ts tm">pays</div></div>
        </div>
        <span class="mi" style="color:var(--md-outline)">arrow_forward</span>
        <div class="sp"><div class="av" style="width:38px;height:38px;font-size:14px;background:${mc(ti<0?0:ti)}">${t.to[0].toUpperCase()}</div>
          <div><div style="font-size:14px;font-weight:600;color:var(--md-success)">${esc(t.to)}</div><div class="ts tm">receives</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="sam">${fmt(t.amount,c)}</div>
        <button class="btn btn-su btn-sm" style="font-size:12px;height:30px;padding:0 12px" data-quick-sett="${t.from}|${t.to}|${t.amount}"><span class="mi" style="font-size:14px">check</span>Mark Paid</button>
      </div>
    </div>`}).join('')}
  </div>
  ${settlementsHtml}`;

  Q('record-sett-btn').onclick=openSettDialog;

  el.querySelectorAll('[data-quick-sett]').forEach(btn=>{
    btn.onclick=()=>{
      const [from,to,amount]=btn.dataset.quickSett.split('|');
      Q('sett-from').value=from;Q('sett-to').value=to;Q('sett-amount').value=amount;Q('sett-date').value=td();Q('sett-note').value='';
      openOv('sett-ov');
    };
  });

  el.querySelectorAll('[data-dsett]').forEach(btn=>{
    btn.onclick=async()=>{
      const ok=await confirmDlg('Delete Settlement?','Remove this recorded settlement?','Delete');
      if(ok){
        const id=btn.dataset.dsett;g.settlements=(g.settlements||[]).filter(s=>s.id!==id);
        save();renderGroupPage();snack('Settlement removed');
      }
    };
  });
}

/* ─── SETTLEMENT DIALOG ──────────────────────────── */
function openSettDialog(){
  const g=act();if(!g||g.members.length<2){snack('Need at least 2 members');return}
  const opts=g.members.map((m,i)=>`<option value="${esc(m)}">${m}</option>`).join('');
  Q('sett-from').innerHTML=opts;Q('sett-to').innerHTML=opts;
  if(g.members.length>1)Q('sett-to').selectedIndex=1;
  Q('sett-amount').value='';Q('sett-date').value=td();Q('sett-note').value='';
  openOv('sett-ov');setTimeout(()=>Q('sett-amount').focus(),300);
}
Q('sett-cancel').onclick=()=>closeOv('sett-ov');
Q('sett-save').onclick=()=>{
  const g=act();
  const from=Q('sett-from').value,to=Q('sett-to').value;
  const amount=parseFloat(Q('sett-amount').value),date=Q('sett-date').value,note=Q('sett-note').value.trim();
  if(!amount||amount<=0){snack('Enter a valid amount');return}
  if(from===to){snack('From and To must be different people');return}
  if(!date){snack('Please select a date');return}
  if(!g.settlements)g.settlements=[];
  g.settlements.push({id:uid(),from,to,amount,date,note});
  save();closeOv('sett-ov');renderGroupPage();snack(`Settlement recorded: ${from} paid ${to} ${fmt(amount,g.currency||'INR')}`);
};

/* ─── BACK ───────────────────────────────────────── */
Q('back-btn').onclick=()=>{goTo('home','back');S.activeId=null;renderHome();showFab('home');expFilter={category:'all',payer:'all'};expSort='date-desc'};

/* ─── SETTINGS ───────────────────────────────────── */
let sTh='none';
function openSettings(){
  const g=act();if(!g)return;
  sTh=g.theme||'none';Q('sn').value=g.name;Q('scur').value=g.currency||'INR';
  Q('smi').value='';Q('smi-date').value=td();buildIthGrid('s-ith',sTh,id=>{sTh=id});renderSettingsMembers();
  Q('ssheet').classList.add('open');Q('sbd').classList.add('open');
}
function closeSettings(){Q('ssheet').classList.remove('open');Q('sbd').classList.remove('open')}
Q('set-btn').onclick=()=>{closeActsSheet();openSettings()};Q('ssclose').onclick=closeSettings;Q('sbd').onclick=closeSettings;
Q('ssave').addEventListener('click',async()=>{
  const g=act(),nn=Q('sn').value.trim(),nc=Q('scur').value,nt=sTh;
  if(!nn){Q('sn').focus();return}
  if(nn===g.name&&nc===g.currency&&nt===g.theme){snack('No changes to save');return}
  const ok=await confirmDlg('Save Changes?',`Update settings for "${g.name}"?`,'Save',false);
  if(ok){g.name=nn;g.currency=nc;g.theme=nt;save();Q('gbar-title').textContent=nn;renderGroupPage();snack('Settings saved')}
});
Q('sam').onclick=sAM;Q('smi').onkeydown=e=>{if(e.key==='Enter')Q('smi-date').focus()};Q('smi-date').onkeydown=e=>{if(e.key==='Enter')sAM()};
async function sAM(){
  const g=act(),inp=Q('smi'),name=inp.value.trim(),date=Q('smi-date').value||td();
  if(!name){inp.focus();return}if(g.members.includes(name)){snack('Member already exists');return}
  const ok=await confirmDlg('Add Member?',`Add "${name}" to "${g.name}"?`,'Add',false);
  if(ok){g.members.push(name);if(!g.joinDates)g.joinDates={};g.joinDates[name]=date;save();inp.value='';Q('smi-date').value=td();renderSettingsMembers();renderGroupPage();snack(`${name} added`)}
}
function renderSettingsMembers(){
  const g=act();if(!g)return;const el=Q('sml');
  if(!g.members.length){el.innerHTML='<div class="ts tm" style="padding:12px 0;text-align:center">No members yet</div>';return}
  const hasAct=m=>g.expenses.some(e=>e.payer===m||e.splitAmong.includes(m));
  el.innerHTML=g.members.map((m,i)=>{
    const jd=getJoinDate(g,m);
    return `<div class="mr"><div class="av" style="width:36px;height:36px;font-size:13px;flex-shrink:0;background:${mc(i)}">${m[0].toUpperCase()}</div>
      <div class="mr-i"><div class="mr-n">${esc(m)}</div><button class="jd-badge" data-sjdedit="${esc(m)}" style="font-size:11px"><span class="mi">edit_calendar</span>Joined ${fd(jd)}</button></div>
      ${!hasAct(m)?`<button class="icon-btn err" data-rmm="${esc(m)}" title="Remove"><span class="mi">person_remove</span></button>`:''}</div>`;
  }).join('');
}

Q('sml').addEventListener('click',async e=>{
  const jb=e.target.closest('[data-sjdedit]');
  if(jb){const mName=jb.dataset.sjdedit,g=act();const cur=getJoinDate(g,mName);const newDate=await joinDateDlg(mName,cur,g.name);if(!newDate)return;if(!g.joinDates)g.joinDates={};g.joinDates[mName]=newDate;syncMemberSplits(g,mName);save();renderSettingsMembers();renderGroupPage();snack(`${mName}'s join date updated`);return}
  const b=e.target.closest('[data-rmm]');if(!b)return;
  const name=b.dataset.rmm,g=act();
  const ok=await confirmDlg('Remove Member?',`Remove "${name}" from the list?`,'Remove');
  if(ok){g.members=g.members.filter(m=>m!==name);if(g.joinDates)delete g.joinDates[name];save();renderSettingsMembers();renderGroupPage();snack(`${name} removed`)}
});
Q('sdel').addEventListener('click',async()=>{
  const g=act();const passed=await captchaDlg('Verify Deletion',`Solve the math to confirm deleting "${g.name}".`);if(!passed)return;
  const ok=await confirmDlg('Final Confirmation',`Permanently delete "${g.name}" and all its data?`,'Delete Forever');
  if(ok){const snap=JSON.stringify(S.groups);S.groups=S.groups.filter(x=>x.id!==g.id);closeSettings();goTo('home','back');renderHome();showFab('home');snack(`"${g.name}" deleted`,{commit:()=>save(),undo:()=>{try{S.groups=JSON.parse(snap)}catch(e){}renderHome();snack(`"${g.name}" restored`)},undoMsg:`"${g.name}" restored`})}
});

/* ─── SCROLL ELEVATION ───────────────────────────── */
document.querySelectorAll('.page').forEach(p=>{
  p.addEventListener('scroll',()=>{const b=p.querySelector('.top-bar');if(b)b.classList.toggle('elevated',p.scrollTop>2)})
});

/* ─── CSV EXPORT ─────────────────────────────────── */
Q('csv-btn').onclick=()=>{closeActsSheet();exportCSV(act())};
function exportCSV(g){
  if(!g)return;const c=g.currency||'INR';
  const headers=['Date','Description','Category','Paid By','Split Among','Split Mode','Amount','Per Person'];
  const rows=g.expenses.map(e=>{
    const perPerson=e.splitMode==='unequal'?'Custom':Number(e.amount)/Math.max(1,e.splitAmong.length);
    const perPersonStr=e.splitMode==='unequal'?'Custom':fmt(perPerson,c);
    const cat=getCat(e.category||'other').label;
    return [e.date,e.note||'',cat,e.payer,(e.splitAmong||[]).join(' + '),e.splitMode==='unequal'?'Custom':'Equal',e.amount,perPersonStr];
  });
  // Settlement rows
  const settRows=(g.settlements||[]).map(s=>['[Settlement] '+s.date,s.note||'','Settlement',s.from,s.to,'N/A',s.amount,'N/A']);
  const allRows=[...rows,...settRows];
  const csv=[headers,...allRows].map(r=>r.map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${g.name.replace(/\s+/g,'_')}_expenses.csv`;a.click();URL.revokeObjectURL(a.href);
  snack('CSV exported!');
}

/* ─── BACKUP / IMPORT JSON ───────────────────────── */
Q('backup-btn').onclick=()=>{closeActsSheet();backupJSON(act())};
function backupJSON(g){
  if(!g)return;
  const blob=new Blob([JSON.stringify(g,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${g.name.replace(/\s+/g,'_')}_backup.json`;a.click();URL.revokeObjectURL(a.href);
  snack('Backup saved!');
}
Q('import-json-btn').onclick=()=>Q('import-json-file').click();
Q('import-json-file').addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=async ev=>{
    try{
      const data=JSON.parse(ev.target.result);
      if(!data.id||!data.members||!data.expenses)throw new Error('Invalid backup');
      const exists=S.groups.find(g=>g.id===data.id);
      if(exists){const ok=await confirmDlg('Replace Group?',`A group named "${exists.name}" already exists. Replace it?`,'Replace');if(!ok)return;S.groups=S.groups.filter(g=>g.id!==data.id)}
      if(!data.settlements)data.settlements=[];
      S.groups.push(data);save();renderHome();closeSettings();snack(`"${data.name}" imported!`);
    }catch(err){snack('Invalid backup file')}
  };
  reader.readAsText(file);
  e.target.value='';
});

/* ─── PDF EXPORT ─────────────────────────────────── */
Q('pdf-btn').onclick=()=>{closeActsSheet();exportPDF(act())};
function exportPDF(g){
  if(!g)return;
  const st=calcStats(g),{bal,txns}=calcSettle(g),c=g.currency||'USD',th=getTheme(g);
  const exps=[...g.expenses].sort((a,b)=>a.date.localeCompare(b.date));
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${esc(g.name)} – Report</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;background:#fff;color:#191c1d;font-size:13px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{max-width:780px;margin:0 auto;padding:40px}.hdr{background:linear-gradient(135deg,#001f24,#006874);color:#fff;padding:36px;border-radius:14px;margin-bottom:28px;position:relative;overflow:hidden}.hdr::before{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;background:rgba(151,240,255,.12);border-radius:50%}.hdr h1{font-size:28px;font-weight:300;letter-spacing:-.5px;position:relative}.hdr .sub{color:rgba(255,255,255,.55);font-size:12px;margin-top:5px;position:relative}.hdr .badge{display:inline-block;background:rgba(151,240,255,.18);border:1px solid rgba(151,240,255,.35);color:#97f0ff;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:500;margin-top:14px;position:relative}.sr{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}.sb{background:#f0f9fa;border:1px solid #cde7ec;border-radius:10px;padding:14px 16px}.sb .l{font-size:9px;text-transform:uppercase;letter-spacing:.8px;color:#4a6267;margin-bottom:4px}.sb .v{font-size:20px;font-weight:600;color:#001f24}.sb .s{font-size:10px;color:#4a6267;margin-top:2px}.sec{margin-bottom:24px}.st{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:#006874;padding-bottom:6px;border-bottom:2px solid #97f0ff;margin-bottom:12px}.mr{display:flex;flex-wrap:wrap;gap:6px}.mc{display:flex;align-items:center;gap:6px;background:#f0f9fa;border:1px solid #cde7ec;padding:5px 10px;border-radius:99px;font-size:12px}.dot{width:8px;height:8px;border-radius:50%}table{width:100%;border-collapse:collapse}th{background:#f0f9fa;text-align:left;padding:7px 10px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#4a6267;border-bottom:1px solid #cde7ec}td{padding:8px 10px;border-bottom:1px solid #f4fafb;vertical-align:top}.pb{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600;color:#fff}.br{display:flex;justify-content:space-between;background:#f0f9fa;border:1px solid #cde7ec;border-radius:8px;padding:9px 14px;margin-bottom:6px}.srow{display:flex;align-items:center;justify-content:space-between;background:#f0f9fa;border:1px solid #cde7ec;border-radius:8px;padding:11px 16px;margin-bottom:7px}.sf{color:#ba1a1a;font-weight:600}.st2{color:#37693c;font-weight:600}.sa{font-size:17px;font-weight:600}.foot{text-align:center;color:#bfc8ca;font-size:10px;margin-top:32px;padding-top:16px;border-top:1px solid #f0f9fa}.pos{color:#37693c;font-weight:600}.neg{color:#ba1a1a;font-weight:600}.zer{color:#6f797a}</style>
</head><body><div class="page">
<div class="hdr"><h1>${th.label} ${esc(g.name)}</h1><div class="sub">Expense Report · Generated ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div><div class="badge">${g.members.length} Members · ${g.expenses.length} Expenses · ${c}</div></div>
${st?`<div class="sr"><div class="sb"><div class="l">Total Expenses</div><div class="v">${fmt(st.total,c)}</div></div><div class="sb"><div class="l">Duration</div><div class="v">${st.days} days</div><div class="s">${fd(st.startDate)} → ${fd(st.endDate)}</div></div><div class="sb"><div class="l">Average / Day</div><div class="v">${fmt(st.avgPerDay,c)}</div></div></div>`:''}
<div class="sec"><div class="st">Members &amp; Contributions</div><div class="mr">${g.members.map((m,i)=>`<div class="mc"><div class="dot" style="background:${COLS[i%COLS.length]}"></div>${esc(m)}${st?` · ${fmt(st.paid[m]||0,c)} paid`:''}</div>`).join('')}</div></div>
<div class="sec"><div class="st">All Expenses</div><table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Paid By</th><th>Split</th><th style="text-align:right">Amount</th></tr></thead><tbody>${exps.map(e=>`<tr><td style="white-space:nowrap;color:#4a6267">${fd(e.date)}</td><td>${esc(e.note||'—')}</td><td style="color:#4a6267;font-size:11px">${getCat(e.category||'other').label}</td><td><span class="pb" style="background:${COLS[g.members.indexOf(e.payer)%COLS.length]||'#006874'}">${esc(e.payer)}</span></td><td style="color:#4a6267;font-size:11px">${e.splitMode==='unequal'?'Custom':e.splitAmong.join(', ')}</td><td style="text-align:right;font-weight:600">${fmt(e.amount,c)}</td></tr>`).join('')}</tbody></table></div>
<div class="sec"><div class="st">Net Balances</div>${g.members.map(m=>{const v=bal[m]||0;return`<div class="br"><span>${esc(m)}</span><span class="${v>0.01?'pos':v<-0.01?'neg':'zer'}">${v>0?'+':''}${fmt(v,c)}</span></div>`}).join('')}</div>
<div class="sec"><div class="st">Suggested Settlements</div>${txns.length===0?'<p style="color:#37693c;font-weight:500">✓ Everyone is settled up!</p>':txns.map(t=>`<div class="srow"><div><span class="sf">${esc(t.from)}</span><span style="color:#bfc8ca"> → pays → </span><span class="st2">${esc(t.to)}</span></div><div class="sa">${fmt(t.amount,c)}</div></div>`).join('')}</div>
${(g.settlements||[]).length?`<div class="sec"><div class="st">Recorded Settlements</div>${(g.settlements||[]).map(s=>`<div class="srow"><div>${esc(s.from)} paid ${esc(s.to)}${s.note?' ('+esc(s.note)+')':''}</div><div class="sa" style="color:#37693c">${fmt(s.amount,c)}</div></div>`).join('')}</div>`:''}
<div class="foot">Generated by <strong>Splittr V3</strong> — Split expenses, settle fairly · ${new Date().getFullYear()}</div>
</div><script>window.onload=()=>{window.print()}<\/script></body></html>`;
  const w=window.open('','_blank');if(w){w.document.write(html);w.document.close()}
}

/* ─── SHARE CARD ─────────────────────────────────── */
Q('share-btn').onclick=()=>{closeActsSheet();openShareCard(act())};
Q('share-close').onclick=()=>closeOv('share-ov');
Q('share-copy').onclick=()=>{
  const g=act();if(!g)return;
  const {bal,txns}=calcSettle(g),st=calcStats(g),c=g.currency||'INR';
  let text=`📊 ${g.name} — Expense Summary\n`;
  if(st)text+=`Total: ${fmt(st.total,c)} over ${st.days} days\n`;
  text+=`\n👥 Members: ${g.members.join(', ')}\n\n💰 Balances:\n`;
  g.members.forEach(m=>{const b=bal[m]||0;text+=`  ${m}: ${b>0?'+':''}${fmt(b,c)}\n`});
  if(txns.length){text+=`\n🤝 Settlements needed:\n`;txns.forEach(t=>{text+=`  ${t.from} → ${t.to}: ${fmt(t.amount,c)}\n`})}
  else text+='\n✅ Everyone is settled up!\n';
  text+='\n— via Splittr';
  navigator.clipboard.writeText(text).then(()=>snack('Copied to clipboard!')).catch(()=>snack('Copy failed'));
};

async function captureShareCard(){
  const el=Q('share-card-preview');
  // Temporarily hide the .mi (Material Symbol) spans — replace with emoji equivalents
  try{
    const canvas=await html2canvas(el,{scale:2,backgroundColor:null,logging:false,useCORS:true});
    return canvas;
  }catch(e){return null}
}

Q('share-save-img').onclick=async()=>{
  const btn=Q('share-save-img');
  btn.disabled=true;btn.innerHTML='<span class="mi">hourglass_empty</span>Saving…';
  const canvas=await captureShareCard();
  btn.disabled=false;btn.innerHTML='<span class="mi">image</span>Save Image';
  if(!canvas){snack('Could not capture image');return}
  const a=document.createElement('a');a.download=(act()?.name||'splittr')+'_summary.png';a.href=canvas.toDataURL('image/png');a.click();
  snack('Image saved!');
};

Q('share-native').onclick=async()=>{
  const g=act();if(!g)return;
  const {txns}=calcSettle(g),st=calcStats(g),c=g.currency||'INR';
  let text=`📊 ${g.name}: Total ${st?fmt(st.total,c):'—'}`;
  if(txns.length)text+=` · ${txns.length} settlement${txns.length!==1?'s':''} pending`;
  else text+=' · All settled!';
  text+=' (via Splittr)';

  // Try to share as image first
  if(navigator.share){
    const btn=Q('share-native');
    btn.disabled=true;btn.innerHTML='<span class="mi">hourglass_empty</span>Sharing…';
    const canvas=await captureShareCard();
    btn.disabled=false;btn.innerHTML='<span class="mi">share</span>Share';
    if(canvas&&navigator.canShare){
      try{
        canvas.toBlob(async blob=>{
          const file=new File([blob],`${g.name}_summary.png`,{type:'image/png'});
          if(navigator.canShare({files:[file]})){
            await navigator.share({title:g.name+' — Splittr',text,files:[file]});
          }else{await navigator.share({title:g.name+' — Splittr',text})}
        },'image/png');
        return;
      }catch(e){}
    }
    navigator.share({title:g.name+' — Splittr',text}).catch(()=>{});
  }else{snack('Web Share not supported — use "Save Image" instead')}
};

function openShareCard(g){
  if(!g)return;
  const {bal,txns}=calcSettle(g),st=calcStats(g),c=g.currency||'INR',th=getTheme(g);
  const preview=Q('share-card-preview');
  const membersHtml=g.members.map(m=>`<div class="sc-mem">${esc(m)}</div>`).join('');
  const settleHtml=txns.length===0?`<div style="font-size:14px;opacity:.8">✅ Everyone is settled up!</div>`:
    txns.slice(0,4).map(t=>`<div class="sc-srow"><span>${esc(t.from)} → ${esc(t.to)}</span><strong>${fmt(t.amount,c)}</strong></div>`).join('')+
    (txns.length>4?`<div style="font-size:12px;opacity:.6">+${txns.length-4} more...</div>`:'');
  preview.innerHTML=`
    <div class="sc-icon-row">
      <div class="sc-icon-box"><span class="mi" style="font-size:22px">${th.mi}</span></div>
      <div class="sc-head">${esc(g.name)}</div>
    </div>
    <div class="sc-sub">${g.members.length} members · ${g.expenses.length} expenses · ${c}</div>
    <div class="sc-stats">
      <div class="sc-stat"><div class="sc-stat-v">${st?fmt(st.total,c):'—'}</div><div class="sc-stat-l">Total</div></div>
      <div class="sc-stat"><div class="sc-stat-v">${st?st.days:'—'}</div><div class="sc-stat-l">Days</div></div>
      <div class="sc-stat"><div class="sc-stat-v" style="color:${txns.length?'#ffb4ab':'#9cd49f'}">${txns.length?txns.length+' due':'Settled'}</div><div class="sc-stat-l">Status</div></div>
    </div>
    <div class="sc-members">${membersHtml}</div>
    <div class="sc-settle">${settleHtml}</div>
    <div class="sc-foot">Generated with Splittr · ${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'})}</div>`;
  openOv('share-ov');
}

/* ─── DARK MODE ──────────────────────────────────── */
(function(){
  const chk=Q('theme-chk'),icon=Q('theme-icon');
  const saved=localStorage.getItem('splittr-theme');
  if(saved==='dark'){document.documentElement.classList.add('dark');chk.checked=true;icon.textContent='dark_mode'}
  chk.addEventListener('change',()=>{
    const dark=chk.checked;
    document.documentElement.classList.toggle('dark',dark);
    icon.textContent=dark?'dark_mode':'light_mode';
    localStorage.setItem('splittr-theme',dark?'dark':'light');
    renderHome();
  });
})();

/* ─── INIT ───────────────────────────────────────── */
// App is visually locked (#app has opacity:0) until Google auth completes.
// The auth overlay is visible by default.
// _tryInit() is called by the Google API script onload callbacks.
// Once both gapi + gis are ready, it enables the Sign-in button
// (or auto-resumes a cached session).
/* ─── CUSTOM DATE PICKER ───────────────────────── */
(function(){
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOWS=['Su','Mo','Tu','We','Th','Fr','Sa'];

function formatDisplay(y,m,d){
  if(!y)return'Select date';
  return`${d} ${MONTHS[m-1].slice(0,3)} ${y}`;
}

function parseDateStr(s){
  if(!s)return null;
  const parts=s.split('-');
  if(parts.length!==3)return null;
  return{y:+parts[0],m:+parts[1],d:+parts[2]};
}

class DatePicker{
  constructor(hiddenInput){
    this.inp=hiddenInput;
    this.open=false;
    this.viewY=0;this.viewM=0;
    this.showYear=false;
    this.build();
    this.attach();
  }

  build(){
    const wrap=document.createElement('div');
    wrap.className='date-wrap';
    wrap.style.position='relative';

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='date-btn';
    btn.innerHTML=`<span class="mi date-icon">calendar_today</span><span class="dp-label"></span><span class="mi date-chevron" style="position:absolute;right:14px;top:50%;transform:translateY(-50%)">expand_more</span>`;
    this.btn=btn;
    this.label=btn.querySelector('.dp-label');
    this.chevron=btn.querySelector('.date-chevron');

    this.popup=document.createElement('div');
    this.popup.className='dp-popup';
    this.popup.style.display='none';

    wrap.appendChild(btn);
    wrap.appendChild(this.popup);
    this.wrap=wrap;

    // Replace hidden input in DOM
    this.inp.style.display='none';
    this.inp.insertAdjacentElement('afterend',wrap);

    this.updateDisplay();
  }

  attach(){
    this.btn.addEventListener('click',e=>{e.stopPropagation();this.toggle()});
    document.addEventListener('click',e=>{
      if(!this.wrap.contains(e.target))this.close();
    });
    // Watch for programmatic changes to hidden input
    const obs=new MutationObserver(()=>this.updateDisplay());
    // also override value setter
    const orig=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
    const self=this;
    Object.defineProperty(this.inp,'value',{
      get(){return orig.get.call(this)},
      set(v){orig.set.call(self.inp,v);self.updateDisplay();}
    });
  }

  updateDisplay(){
    const v=this.inp.value;
    const p=parseDateStr(v);
    if(p){
      this.label.textContent=formatDisplay(p.y,p.m,p.d);
      this.btn.style.color='';
    } else {
      this.label.textContent='Select date';
      this.btn.style.color='var(--md-on-surface-variant)';
    }
  }

  toggle(){
    if(this.open)this.close(); else this.openPicker();
  }

  openPicker(){
    this.open=true;
    this.showYear=false;
    const v=this.inp.value;
    const p=parseDateStr(v)||{y:new Date().getFullYear(),m:new Date().getMonth()+1,d:new Date().getDate()};
    this.viewY=p.y;this.viewM=p.m;
    this.popup.style.display='';
    this.chevron.style.transform='translateY(-50%) rotate(180deg)';
    this.btn.classList.add('focused');
    this.render();
  }

  close(){
    this.open=false;
    this.popup.style.display='none';
    this.chevron.style.transform='';
    this.btn.classList.remove('focused');
  }

  render(){
    if(this.showYear){this.renderYears();return;}
    const v=this.inp.value;
    const sel=parseDateStr(v);
    const today=new Date();
    const tY=today.getFullYear(),tM=today.getMonth()+1,tD=today.getDate();
    const y=this.viewY,m=this.viewM;
    const firstDay=new Date(y,m-1,1).getDay();
    const daysInMonth=new Date(y,m,0).getDate();
    const prevDays=new Date(y,m-1,0).getDate();

    let cells='';
    // Prev month days
    for(let i=firstDay-1;i>=0;i--){
      const d=prevDays-i;
      cells+=`<button class="dp-day other-month" disabled>${d}</button>`;
    }
    // Current month
    for(let d=1;d<=daysInMonth;d++){
      const isSel=sel&&sel.y===y&&sel.m===m&&sel.d===d;
      const isToday=tY===y&&tM===m&&tD===d;
      cells+=`<button class="dp-day${isSel?' sel':''}${isToday&&!isSel?' today':''}" data-y="${y}" data-m="${m}" data-d="${d}">${d}</button>`;
    }
    // Next month fill
    const total=firstDay+daysInMonth;
    const remaining=(total%7===0)?0:7-(total%7);
    for(let d=1;d<=remaining;d++){
      cells+=`<button class="dp-day other-month" disabled>${d}</button>`;
    }

    this.popup.innerHTML=`
      <div class="dp-header">
        <button type="button" class="dp-nav" id="dp-prev"><span class="mi" style="font-size:20px">chevron_left</span></button>
        <button type="button" class="dp-month-year" id="dp-my">${MONTHS[m-1]} ${y}</button>
        <button type="button" class="dp-nav" id="dp-next"><span class="mi" style="font-size:20px">chevron_right</span></button>
      </div>
      <div class="dp-grid">
        ${DOWS.map(d=>`<div class="dp-dow">${d}</div>`).join('')}
        ${cells}
      </div>
    `;

    this.popup.querySelector('#dp-prev').onclick=e=>{e.stopPropagation();this.viewM--;if(this.viewM<1){this.viewM=12;this.viewY--;}this.render()};
    this.popup.querySelector('#dp-next').onclick=e=>{e.stopPropagation();this.viewM++;if(this.viewM>12){this.viewM=1;this.viewY++;}this.render()};
    this.popup.querySelector('#dp-my').onclick=e=>{e.stopPropagation();this.showYear=true;this.render()};
    this.popup.querySelectorAll('.dp-day[data-y]').forEach(b=>{
      b.onclick=e=>{
        e.stopPropagation();
        const y=b.dataset.y,m=b.dataset.m.padStart(2,'0'),d=b.dataset.d.padStart(2,'0');
        this.inp.value=`${y}-${m}-${d}`;
        this.inp.dispatchEvent(new Event('change',{bubbles:true}));
        this.inp.dispatchEvent(new Event('input',{bubbles:true}));
        this.updateDisplay();
        this.close();
      };
    });
  }

  renderYears(){
    const curY=this.viewY;
    const startY=curY-10;
    let btns='';
    for(let y=startY;y<=curY+10;y++){
      btns+=`<button type="button" class="dp-yr-btn${y===curY?' sel':''}" data-y="${y}">${y}</button>`;
    }
    this.popup.innerHTML=`
      <div class="dp-header">
        <button type="button" class="dp-nav" id="dp-ydec"><span class="mi" style="font-size:20px">chevron_left</span></button>
        <span class="dp-month-year" style="cursor:default">Select Year</span>
        <button type="button" class="dp-nav" id="dp-yinc"><span class="mi" style="font-size:20px">chevron_right</span></button>
      </div>
      <div class="dp-year-grid">${btns}</div>
    `;
    this.popup.querySelector('#dp-ydec').onclick=e=>{e.stopPropagation();this.viewY-=10;this.renderYears()};
    this.popup.querySelector('#dp-yinc').onclick=e=>{e.stopPropagation();this.viewY+=10;this.renderYears()};
    this.popup.querySelectorAll('.dp-yr-btn').forEach(b=>{
      b.onclick=e=>{e.stopPropagation();this.viewY=+b.dataset.y;this.showYear=false;this.render()};
    });
    // scroll selected into view
    setTimeout(()=>{const sel=this.popup.querySelector('.dp-yr-btn.sel');if(sel)sel.scrollIntoView({block:'center'})},10);
  }
}

function initDatePickers(){
  document.querySelectorAll('input[type="date"]').forEach(inp=>{
    if(!inp.dataset.dpInit){
      inp.dataset.dpInit='1';
      new DatePicker(inp);
    }
  });
}

// Init on load and watch for dialogs opening
initDatePickers();
const _dpObs=new MutationObserver(()=>initDatePickers());
_dpObs.observe(document.body,{childList:true,subtree:true});
})();
