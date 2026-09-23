/* KOL IDS Cloud App - deploy-ready core workspace.
 * No Google Apps Script dependency. Identity and workspace state are owned by Supabase.
 */
(function () {
  const cfg = window.KOL_IDS_CONFIG || {};
  const root = document.getElementById('app');
  const hasConfig = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes('YOUR_PROJECT') && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes('YOUR_');
  let supabase = null;
  let state = { session: null, profile: null, org: null, brands: [], campaigns: [], creators: [], loading: false, page: 'dashboard' };

  if (hasConfig && window.supabase) supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const fmt = n => n == null || n === '' ? '—' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n);
  const notify = (msg, type='info') => { const el = document.getElementById('toast'); if (!el) return; el.textContent = msg; el.className = 'toast show ' + type; setTimeout(() => el.className='toast', 3200); };

  function shell(content='') {
    const userEmail = state.session?.user?.email || '';
    root.innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="brandmark"><div class="brand-dot"></div><div><strong>KOL IDS™</strong><span>Intelligence Workspace</span></div></div>
          <nav>
            ${nav('dashboard','Overview')}
            ${nav('brands','Brands')}
            ${nav('campaigns','Campaigns')}
            ${nav('creators','KOL Database')}
            ${nav('analysis','KOL Intelligence')}
          </nav>
          <div class="sidebar-foot"><span class="cloud-pill">CLOUD</span><small>${esc(state.org?.name || 'Workspace')}</small></div>
        </aside>
        <main class="main">
          <header class="topbar"><div><span class="eyebrow">WORKSPACE</span><h1>${esc(pageTitle())}</h1></div><div class="top-actions"><span class="user-email">${esc(userEmail)}</span><button class="ghost" id="logoutBtn">Log out</button></div></header>
          <section class="content">${content}</section>
        </main>
      </div>
      <div id="toast" class="toast"></div>`;
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => { state.page=b.dataset.nav; renderPage(); }));
  }
  function nav(id,label){ return `<button data-nav="${id}" class="nav-item ${state.page===id?'active':''}"><span>${label}</span></button>`; }
  function pageTitle(){ return ({dashboard:'Decision workspace',brands:'Brand intelligence',campaigns:'Campaigns',creators:'KOL database',analysis:'KOL intelligence'})[state.page] || 'Workspace'; }

  function loginView(mode='login') {
    root.innerHTML = `<div class="auth-wrap"><div class="auth-card"><div class="brandmark large"><div class="brand-dot"></div><div><strong>KOL IDS™</strong><span>Culture & KOL Intelligence</span></div></div>
      <div class="auth-copy"><h1>${mode==='login'?'Welcome back':'Create your KOL IDS account'}</h1><p>${mode==='login'?'Sign in to your KOL IDS workspace.':'Your KOL IDS identity is independent of the Google account currently open in your browser.'}</p></div>
      <form id="authForm"><label>Email<input type="email" name="email" required autocomplete="email"></label><label>Password<input type="password" name="password" minlength="6" required autocomplete="${mode==='login'?'current-password':'new-password'}"></label><button class="primary" type="submit">${mode==='login'?'Sign in':'Create account'}</button></form>
      <button class="link-btn" id="toggleAuth">${mode==='login'?'Create a new account':'I already have an account'}</button>
      <div class="auth-note">No Google Workspace dependency. Your session is stored by KOL IDS.</div>
      </div><div class="auth-side"><div><span class="eyebrow">KOL IDS™</span><h2>People + Culture + Market + Outcome Intelligence</h2><p>A decision workspace for brands, KOL selection, campaigns and outcomes.</p></div></div></div>`;
    document.getElementById('toggleAuth').onclick=()=>loginView(mode==='login'?'signup':'login');
    document.getElementById('authForm').onsubmit=async e=>{ e.preventDefault(); const fd=new FormData(e.currentTarget); setBusy(e.currentTarget.querySelector('button'), true); try { if(mode==='login') await signIn(fd.get('email'),fd.get('password')); else await signUp(fd.get('email'),fd.get('password')); } catch(err){ notify(err.message,'error'); } finally { setBusy(e.currentTarget.querySelector('button'), false); } };
  }
  function setBusy(btn,busy){ if(!btn)return; btn.disabled=busy; btn.dataset.original ??= btn.textContent; btn.textContent=busy?'Processing…':btn.dataset.original; }
  async function signIn(email,password){ const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; await boot(); }
  async function signUp(email,password){ const {data,error}=await supabase.auth.signUp({email,password}); if(error) throw error; if(data.session) await boot(); else notify('Account created. Check your email to confirm your account.','success'); }
  async function logout(){ await supabase.auth.signOut(); state={session:null,profile:null,org:null,brands:[],campaigns:[],creators:[],loading:false,page:'dashboard'}; loginView(); }

  async function boot(){
    if(!supabase){ root.innerHTML='<div class="setup"><h1>KOL IDS Cloud App</h1><p>Supabase is not configured yet.</p><p>Copy <code>config.example.js</code> to <code>config.js</code>, add your Supabase URL and anon/publishable key, then deploy again.</p></div>'; return; }
    const {data:{session}}=await supabase.auth.getSession();
    state.session=session;
    if(!session){ loginView(); return; }
    await ensureWorkspace();
    await loadData();
    renderPage();
  }

  async function ensureWorkspace(){
    const uid=state.session.user.id; const email=state.session.user.email || '';
    let {data: memberships,error}=await supabase.from('organization_members').select('organization_id,role,status,organizations(id,name,status)').eq('user_id',uid).eq('status','ACTIVE').limit(1);
    if(error) throw error;
    if(!memberships?.length){
      const orgName=(email.split('@')[0] || 'KOL IDS Client') + ' Workspace';
      const {data:org,error:oe}=await supabase.from('organizations').insert({name:orgName}).select().single(); if(oe) throw oe;
      const {error:me}=await supabase.from('organization_members').insert({organization_id:org.id,user_id:uid,role:'OWNER',status:'ACTIVE'}); if(me) throw me;
      state.org=org;
    } else state.org=memberships[0].organizations;
  }
  async function loadData(){
    const oid=state.org.id;
    const [b,c,k]=await Promise.all([
      supabase.from('brands').select('*').eq('organization_id',oid).order('created_at',{ascending:false}),
      supabase.from('campaigns').select('*').eq('organization_id',oid).order('created_at',{ascending:false}),
      supabase.from('creators').select('*').eq('organization_id',oid).order('created_at',{ascending:false})
    ]);
    for(const r of [b,c,k]) if(r.error) throw r.error;
    state.brands=b.data||[]; state.campaigns=c.data||[]; state.creators=k.data||[];
  }
  function renderPage(){ if(!state.session){loginView();return;} const body={dashboard:dashboardView,brands:brandsView,campaigns:campaignsView,creators:creatorsView,analysis:analysisView}[state.page]||dashboardView; shell(body()); bindPage(); }

  function dashboardView(){
    const activeCampaigns=state.campaigns.filter(x=>x.status!=='ARCHIVED').length;
    return `<div class="hero"><div><span class="eyebrow">KOL IDS CLOUD</span><h2>Make the next marketing decision with evidence.</h2><p>Your workspace is now independent from the Google account currently open in your browser.</p></div><button class="primary" data-nav="brands">Build your first brand</button></div>
      <div class="stat-grid"><div class="stat"><span>Brands</span><strong>${state.brands.length}</strong></div><div class="stat"><span>Campaigns</span><strong>${activeCampaigns}</strong></div><div class="stat"><span>KOLs</span><strong>${state.creators.length}</strong></div><div class="stat"><span>Workspace</span><strong>Cloud</strong></div></div>
      <div class="section-card"><div class="section-head"><div><span class="eyebrow">WORKFLOW</span><h3>Core decision flow</h3></div></div><div class="flow"><span>Brand</span><i>→</i><span>Persona</span><i>→</i><span>KOL Intelligence</span><i>→</i><span>Campaign</span><i>→</i><span>Outcome</span></div></div>`;
  }
  function brandsView(){return `<div class="section-card"><div class="section-head"><div><span class="eyebrow">BRANDS</span><h3>Your brands</h3></div><button class="primary" id="addBrand">+ Add brand</button></div><div class="table-wrap"><table><thead><tr><th>Brand</th><th>Category</th><th>Market</th><th>Status</th></tr></thead><tbody>${state.brands.length?state.brands.map(b=>`<tr><td><strong>${esc(b.name)}</strong><small>${esc(b.brand_code||'')}</small></td><td>${esc(b.category)}</td><td>${esc(b.market)}</td><td><span class="status">ACTIVE</span></td></tr>`).join(''):`<tr><td colspan="4" class="empty">No brands yet. Add your first brand to begin.</td></tr>`}</tbody></table></div></div>`}
  function campaignsView(){return `<div class="section-card"><div class="section-head"><div><span class="eyebrow">CAMPAIGNS</span><h3>Campaign workspace</h3></div><button class="primary" id="addCampaign">+ Add campaign</button></div><div class="table-wrap"><table><thead><tr><th>Campaign</th><th>Brand</th><th>Objective</th><th>Status</th></tr></thead><tbody>${state.campaigns.length?state.campaigns.map(c=>`<tr><td><strong>${esc(c.name)}</strong></td><td>${esc(state.brands.find(b=>b.id===c.brand_id)?.name||'—')}</td><td>${esc(c.objective)}</td><td><span class="status">${esc(c.status)}</span></td></tr>`).join(''):`<tr><td colspan="4" class="empty">No campaigns yet.</td></tr>`}</tbody></table></div></div>`}
  function creatorsView(){return `<div class="section-card"><div class="section-head"><div><span class="eyebrow">KOL DATABASE</span><h3>Creators</h3></div><button class="primary" id="addCreator">+ Add KOL</button></div><div class="table-wrap"><table><thead><tr><th>KOL</th><th>Platform</th><th>Category</th><th>Followers</th><th>Risk</th></tr></thead><tbody>${state.creators.length?state.creators.map(k=>`<tr><td><strong>${esc(k.name)}</strong><small>${esc(k.kol_code)}</small></td><td>${esc(k.platform)}</td><td>${esc(k.category)}</td><td>${fmt(k.followers)}</td><td>${esc(k.risk_level||'—')}</td></tr>`).join(''):`<tr><td colspan="5" class="empty">No KOLs yet.</td></tr>`}</tbody></table></div></div>`}
  function analysisView(){return `<div class="hero"><div><span class="eyebrow">KOL INTELLIGENCE</span><h2>Turn creator data into a decision.</h2><p>Select a campaign and compare KOLs using the same structured fields carried by the legacy KOL IDS model.</p></div></div><div class="analysis-grid">${state.creators.slice(0,12).map(k=>`<article class="creator-card"><div class="avatar">${esc((k.name||'?').slice(0,1).toUpperCase())}</div><div><h3>${esc(k.name)}</h3><p>${esc(k.platform||'')} · ${esc(k.category||'')}</p></div><div class="score-row"><span>Brand fit input</span><strong>${fmt(k.brand_image_fit_input)}</strong></div><div class="score-row"><span>Engagement</span><strong>${k.engagement_rate==null?'—':fmt(k.engagement_rate)+'%'}</strong></div><div class="score-row"><span>Risk</span><strong>${esc(k.risk_level||'Not assessed')}</strong></div></article>`).join('') || '<div class="empty">Add KOLs to start intelligence analysis.</div>'}</div>`}

  function bindPage(){
    document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{state.page=b.dataset.nav;renderPage();});
    document.getElementById('addBrand')?.addEventListener('click',()=>modal('Add brand',`<label>Brand name<input name="name" required></label><label>Category<input name="category"></label><label>Market<input name="market"></label><label>Target audience<textarea name="target_audience"></textarea></label>`,async fd=>{const {error}=await supabase.from('brands').insert({organization_id:state.org.id,name:fd.get('name'),category:fd.get('category'),market:fd.get('market'),target_audience:fd.get('target_audience')});if(error)throw error;await loadData();renderPage();notify('Brand saved.','success');}));
    document.getElementById('addCampaign')?.addEventListener('click',()=>modal('Add campaign',`<label>Campaign name<input name="name" required></label><label>Brand<select name="brand_id" required><option value="">Select brand</option>${state.brands.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select></label><label>Objective<textarea name="objective"></textarea></label><label>Primary KPI<input name="primary_kpi"></label>`,async fd=>{const {error}=await supabase.from('campaigns').insert({organization_id:state.org.id,brand_id:fd.get('brand_id'),name:fd.get('name'),objective:fd.get('objective'),primary_kpi:fd.get('primary_kpi')});if(error)throw error;await loadData();renderPage();notify('Campaign saved.','success');}));
    document.getElementById('addCreator')?.addEventListener('click',()=>modal('Add KOL',`<label>KOL code<input name="kol_code" required placeholder="KOL-001"></label><label>Name<input name="name" required></label><label>Platform<input name="platform" placeholder="Instagram / TikTok / YouTube"></label><label>Category<input name="category"></label><label>Followers<input name="followers" type="number" min="0"></label><label>Engagement rate %<input name="engagement_rate" type="number" step="0.01" min="0"></label><label>Risk level<select name="risk_level"><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select></label>`,async fd=>{const {error}=await supabase.from('creators').insert({organization_id:state.org.id,kol_code:fd.get('kol_code'),name:fd.get('name'),platform:fd.get('platform'),category:fd.get('category'),followers:Number(fd.get('followers')||0),engagement_rate:Number(fd.get('engagement_rate')||0),risk_level:fd.get('risk_level')});if(error)throw error;await loadData();renderPage();notify('KOL saved.','success');}));
  }
  function modal(title,fields,onSubmit){const wrap=document.createElement('div');wrap.className='modal-backdrop';wrap.innerHTML=`<div class="modal"><div class="modal-head"><h2>${esc(title)}</h2><button class="icon" data-close>×</button></div><form id="modalForm">${fields}<div class="modal-actions"><button type="button" class="ghost" data-close>Cancel</button><button type="submit" class="primary">Save</button></div></form></div>`;document.body.appendChild(wrap);wrap.querySelectorAll('[data-close]').forEach(x=>x.onclick=()=>wrap.remove());wrap.querySelector('form').onsubmit=async e=>{e.preventDefault();const btn=e.currentTarget.querySelector('button[type=submit]');setBusy(btn,true);try{await onSubmit(new FormData(e.currentTarget));wrap.remove();}catch(err){notify(err.message,'error');}finally{setBusy(btn,false);}};}

  if(supabase) supabase.auth.onAuthStateChange((event,session)=>{ if(event==='SIGNED_OUT'){loginView();} });
  boot().catch(err=>{console.error(err);root.innerHTML=`<div class="setup"><h1>KOL IDS could not start</h1><p>${esc(err.message)}</p><p>Check the Supabase SQL setup, Auth configuration and RLS policies.</p></div>`;});
})();
