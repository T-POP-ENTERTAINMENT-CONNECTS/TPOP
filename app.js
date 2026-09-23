/* KOL IDS™ Production Cloud App
 * Architecture: GitHub source -> Cloudflare Pages/Functions -> Supabase Auth/DB/Storage.
 * No Google Apps Script runtime dependency.
 */
(() => {
  'use strict';

  const CONFIG = window.KOL_IDS_CONFIG || {};
  const root = document.getElementById('app');
  const state = {
    session: null, org: null, brands: [], campaigns: [], creators: [],
    page: 'dashboard', loading: false, selectedCampaign: '', selectedCreator: null
  };
  let db = null;

  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const num = v => v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v);
  const fmt = v => v == null || v === '' ? '—' : new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(Number(v));
  const arr = v => Array.isArray(v) ? v : [];
  const csv = v => arr(v).join(', ');
  const parseList = v => String(v||'').split(',').map(x=>x.trim()).filter(Boolean);
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const sleep = ms => new Promise(r=>setTimeout(r,ms));

  function toast(message,type='info'){
    let el=$('#toast'); if(!el){el=document.createElement('div');el.id='toast';document.body.appendChild(el);}
    el.className=`toast show ${type}`; el.textContent=message;
    clearTimeout(toast.t); toast.t=setTimeout(()=>el.className='toast',3500);
  }

  function busy(btn,on,label='Processing…'){
    if(!btn)return;
    if(on){btn.disabled=true;btn.dataset.busyOriginal=btn.textContent;btn.textContent=label;}
    else {btn.disabled=false;btn.textContent=btn.dataset.busyOriginal||btn.textContent;}
  }

  function requireDb(){
    if(!db) throw new Error('KOL IDS is not configured. Supabase configuration is missing.');
  }

  function pageTitle(){
    return ({dashboard:'Decision workspace',brands:'Brand intelligence',campaigns:'Campaign workspace',creators:'KOL database',analysis:'KOL intelligence'})[state.page]||'Workspace';
  }

  function loginView(mode='login'){
    root.innerHTML=`<div class="auth-wrap">
      <div class="auth-card">
        <div class="brandmark large"><div class="brand-dot"></div><div><strong>KOL IDS™</strong><span>Culture & KOL Intelligence</span></div></div>
        <div class="auth-copy"><span class="eyebrow">SECURE CLOUD WORKSPACE</span>
          <h1>${mode==='login'?'Welcome back':'Create your KOL IDS account'}</h1>
          <p>${mode==='login'?'Sign in to your workspace.':'Create an independent KOL IDS identity — no Google account switching required.'}</p>
        </div>
        ${mode==='recovery'?`<form id="authForm" novalidate>
          <label>New password<input name="password" type="password" minlength="8" required autocomplete="new-password" placeholder="8+ characters"></label>
          <label>Confirm password<input name="confirm" type="password" minlength="8" required autocomplete="new-password" placeholder="Repeat password"></label>
          <button class="primary full" type="submit">Update password</button>
        </form><button class="link-btn" id="backLogin">Back to sign in</button>`:`<form id="authForm" novalidate>
          <label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@company.com"></label>
          <label>Password<input name="password" type="password" minlength="8" required autocomplete="${mode==='login'?'current-password':'new-password'}" placeholder="8+ characters"></label>
          <button class="primary full" type="submit">${mode==='login'?'Sign in':'Create account'}</button>
        </form>
        ${mode==='login'?'<button class="link-btn" id="forgotBtn">Forgot password?</button>':''}
        <button class="link-btn" id="toggleAuth">${mode==='login'?'Create a new account':'I already have an account'}</button>`}
        <div class="auth-note">Your customer session is owned by KOL IDS + Supabase, not the Google account currently open in your browser.</div>
      </div>
      <div class="auth-side"><span class="eyebrow">KOL IDS™ CLOUD</span><h2>People + Culture + Market + Outcome Intelligence</h2><p>A production decision workspace for brands, creators, campaigns and measurable outcomes.</p><div class="auth-proof"><span>AUTH</span><span>RLS</span><span>CLOUD</span></div></div>
    </div>`;

    $('#toggleAuth')?.addEventListener('click',()=>loginView(mode==='login'?'signup':'login'));
    $('#backLogin')?.addEventListener('click',()=>loginView('login'));
    $('#forgotBtn')?.addEventListener('click', forgotPassword);
    $('#authForm').onsubmit=async e=>{
      e.preventDefault(); const btn=$('button[type=submit]',e.currentTarget); const fd=new FormData(e.currentTarget);
      busy(btn,true); try {
        if(mode==='login') await signIn(fd.get('email'),fd.get('password'));
        else if(mode==='signup') await signUp(fd.get('email'),fd.get('password'));
        else { const password=String(fd.get('password')||''); const confirm=String(fd.get('confirm')||''); if(password!==confirm) throw new Error('Passwords do not match.'); const {error}=await db.auth.updateUser({password}); if(error)throw error; toast('Password updated. Please sign in again.','success'); await db.auth.signOut(); loginView('login'); }
      } catch(err){toast(cleanError(err),'error');} finally{busy(btn,false);}
    };
  }

  async function signIn(email,password){
    requireDb();
    const {error}=await db.auth.signInWithPassword({email:String(email).trim(),password:String(password)});
    if(error)throw error;
    await boot();
  }
  async function signUp(email,password){
    requireDb();
    const {data,error}=await db.auth.signUp({email:String(email).trim(),password:String(password)});
    if(error)throw error;
    if(data.session) await boot();
    else toast('Account created. Check your email to confirm your account.','success');
  }
  async function forgotPassword(){
    const email=prompt('Enter the email used for your KOL IDS account:');
    if(!email)return;
    try{
      const {error}=await db.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${location.origin}/`});
      if(error)throw error; toast('Password reset email sent.','success');
    }catch(e){toast(cleanError(e),'error');}
  }
  async function logout(){
    if(db) await db.auth.signOut();
    state.session=null;state.org=null;state.brands=[];state.campaigns=[];state.creators=[];
    loginView();
  }

  async function ensureWorkspace(){
    requireDb();
    const uid=state.session.user.id;
    const {data:members,error}=await db.from('organization_members')
      .select('organization_id,role,status,organizations(id,name,status,plan_code)')
      .eq('user_id',uid).eq('status','ACTIVE').limit(1);
    if(error)throw error;
    if(members?.length){state.org=members[0].organizations;return;}
    const name=`${(state.session.user.email||'KOL IDS Client').split('@')[0]} Workspace`;
    const {data,error:rpcError}=await db.rpc('create_workspace',{workspace_name:name});
    if(rpcError)throw rpcError;
    state.org=data;
  }

  async function loadData(){
    const oid=state.org.id;
    const [b,c,k]=await Promise.all([
      db.from('brands').select('*').eq('organization_id',oid).order('created_at',{ascending:false}),
      db.from('campaigns').select('*').eq('organization_id',oid).order('created_at',{ascending:false}),
      db.from('creators').select('*').eq('organization_id',oid).order('created_at',{ascending:false})
    ]);
    for(const r of [b,c,k])if(r.error)throw r.error;
    state.brands=b.data||[];state.campaigns=c.data||[];state.creators=k.data||[];
    if(!state.selectedCampaign && state.campaigns[0])state.selectedCampaign=state.campaigns[0].id;
  }

  async function boot(){
    requireDb();
    const {data:{session}}=await db.auth.getSession();
    state.session=session;
    if(!session){loginView();return;}
    try{
      await ensureWorkspace(); await loadData(); render();
    }catch(e){
      console.error(e);
      root.innerHTML=`<div class="setup"><span class="eyebrow">STARTUP ERROR</span><h1>KOL IDS could not start</h1><p>${esc(cleanError(e))}</p><button class="primary" onclick="location.reload()">Retry</button></div>`;
    }
  }

  function shell(content){
    const email=state.session?.user?.email||'';
    root.innerHTML=`<div class="app-shell">
      <aside class="sidebar">
        <div class="brandmark"><div class="brand-dot"></div><div><strong>KOL IDS™</strong><span>Intelligence Workspace</span></div></div>
        <nav>
          ${nav('dashboard','Overview')}
          ${nav('brands','Brands')}
          ${nav('campaigns','Campaigns')}
          ${nav('creators','KOL Database')}
          ${nav('analysis','KOL Intelligence')}
        </nav>
        <div class="sidebar-foot"><span class="cloud-pill">CLOUD</span><small>${esc(state.org?.name||'Workspace')}</small><small>${esc(state.org?.plan_code||'TRIAL')} PLAN</small></div>
      </aside>
      <main class="main">
        <header class="topbar"><div><span class="eyebrow">WORKSPACE</span><h1>${esc(pageTitle())}</h1></div>
          <div class="top-actions"><span class="user-email">${esc(email)}</span><button class="ghost" id="logoutBtn">Log out</button></div>
        </header>
        <section class="content">${content}</section>
      </main>
    </div><div id="toast" class="toast"></div>`;
    $('#logoutBtn').onclick=logout;
    $$('[data-nav]').forEach(b=>b.onclick=()=>{state.page=b.dataset.nav;render();});
  }
  function nav(id,label){return `<button data-nav="${id}" class="nav-item ${state.page===id?'active':''}">${esc(label)}</button>`;}

  function render(){
    if(!state.session){loginView();return;}
    const views={dashboard:dashboardView,brands:brandsView,campaigns:campaignsView,creators:creatorsView,analysis:analysisView};
    shell((views[state.page]||dashboardView)());
    bindPage();
  }

  function dashboardView(){
    const active=state.campaigns.filter(x=>x.status!=='ARCHIVED').length;
    return `<div class="hero"><div><span class="eyebrow">KOL IDS™ CLOUD</span><h2>Make the next marketing decision with evidence.</h2>
      <p>Your customer workspace is independent from Google accounts and protected by organization-level access control.</p></div>
      <button class="primary" data-action="new-brand">Build your first brand</button></div>
      <div class="stat-grid"><div class="stat"><span>Brands</span><strong>${state.brands.length}</strong></div><div class="stat"><span>Campaigns</span><strong>${active}</strong></div><div class="stat"><span>KOLs</span><strong>${state.creators.length}</strong></div><div class="stat"><span>Plan</span><strong>${esc(state.org?.plan_code||'TRIAL')}</strong></div></div>
      <div class="section-card"><div class="section-head"><div><span class="eyebrow">CORE DECISION FLOW</span><h3>One connected data model</h3></div></div>
      <div class="flow"><span>Brand</span><i>→</i><span>Campaign</span><i>→</i><span>KOL Intelligence</span><i>→</i><span>Decision</span><i>→</i><span>Outcome</span></div></div>
      <div class="section-card"><div class="section-head"><div><span class="eyebrow">PRODUCTION STATUS</span><h3>Cloud runtime</h3></div></div>
      <div class="status-grid"><div><b>Identity</b><span>Supabase Auth</span></div><div><b>Database</b><span>Postgres + RLS</span></div><div><b>Files</b><span>Supabase Storage</span></div><div><b>Delivery</b><span>Cloudflare Pages</span></div></div></div>`;
  }

  function brandsView(){
    return `<div class="section-card"><div class="section-head"><div><span class="eyebrow">BRANDS</span><h3>Your brands</h3></div><button class="primary" data-action="new-brand">+ Add brand</button></div>
      <div class="table-wrap"><table><thead><tr><th>Brand</th><th>Category</th><th>Market</th><th>Status</th><th></th></tr></thead><tbody>
      ${state.brands.length?state.brands.map(b=>`<tr><td><strong>${esc(b.name)}</strong><small>${esc(b.brand_code||'')}</small></td><td>${esc(b.category||'—')}</td><td>${esc(b.market||'—')}</td><td><span class="status">ACTIVE</span></td><td><button class="table-btn" data-edit-brand="${b.id}">Edit</button></td></tr>`).join(''):`<tr><td colspan="5" class="empty">No brands yet. Add your first brand to begin.</td></tr>`}</tbody></table></div></div>`;
  }

  function campaignsView(){
    return `<div class="section-card"><div class="section-head"><div><span class="eyebrow">CAMPAIGNS</span><h3>Campaign workspace</h3></div><button class="primary" data-action="new-campaign">+ Add campaign</button></div>
      <div class="table-wrap"><table><thead><tr><th>Campaign</th><th>Brand</th><th>Objective</th><th>Budget</th><th>Status</th><th></th></tr></thead><tbody>
      ${state.campaigns.length?state.campaigns.map(c=>`<tr><td><strong>${esc(c.name)}</strong><small>${esc(c.campaign_code||'')}</small></td><td>${esc(state.brands.find(b=>b.id===c.brand_id)?.name||'—')}</td><td>${esc(c.objective||'—')}</td><td>${c.budget==null?'—':`${fmt(c.budget)} ${esc(c.currency||'THB')}`}</td><td><span class="status">${esc(c.status)}</span></td><td><button class="table-btn" data-edit-campaign="${c.id}">Edit</button></td></tr>`).join(''):`<tr><td colspan="6" class="empty">No campaigns yet.</td></tr>`}</tbody></table></div></div>`;
  }

  function creatorsView(){
    return `<div class="section-card"><div class="section-head"><div><span class="eyebrow">KOL DATABASE</span><h3>Creator intelligence profiles</h3></div><button class="primary" data-action="new-creator">+ Add KOL</button></div>
      <div class="table-wrap"><table><thead><tr><th>KOL</th><th>Primary channel</th><th>Secondary</th><th>Followers</th><th>Intelligence</th><th></th></tr></thead><tbody>
      ${state.creators.length?state.creators.map(k=>`<tr><td><div class="person-cell">${k.image_url?`<img src="${esc(k.image_url)}" alt="">`:`<span class="avatar sm">${esc((k.name||'?')[0].toUpperCase())}</span>`}<span><strong>${esc(k.name)}</strong><small>${esc(k.kol_code)}</small></span></div></td>
      <td>${esc(k.platform||'—')}</td><td>${esc(csv(k.secondary_channels)||'—')}</td><td>${fmt(k.followers)}</td><td><span class="status">${intelligenceCount(k)}/8 complete</span></td><td><button class="table-btn" data-edit-creator="${k.id}">Edit</button></td></tr>`).join(''):`<tr><td colspan="6" class="empty">No KOLs yet.</td></tr>`}</tbody></table></div></div>`;
  }

  function analysisView(){
    const c=state.campaigns.find(x=>x.id===state.selectedCampaign);
    return `<div class="hero"><div><span class="eyebrow">KOL INTELLIGENCE</span><h2>Compare creator evidence against the campaign.</h2><p>This production build only displays stored inputs. It does not invent a score when evidence is absent.</p></div></div>
      <div class="section-card"><div class="section-head"><div><span class="eyebrow">CAMPAIGN</span><h3>${c?esc(c.name):'Select a campaign'}</h3></div>
      <select id="analysisCampaign" class="compact-select"><option value="">Select campaign</option>${state.campaigns.map(x=>`<option value="${x.id}" ${x.id===state.selectedCampaign?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>
      ${c?`<div class="analysis-grid">${state.creators.map(k=>creatorCard(k)).join('')||'<div class="empty">Add KOLs to start intelligence analysis.</div>'}</div>`:'<div class="empty">Create a campaign first.</div>'}</div>`;
  }
  function creatorCard(k){
    const complete=intelligenceCount(k);
    return `<article class="creator-card"><div class="creator-head">${k.image_url?`<img class="creator-image" src="${esc(k.image_url)}" alt="">`:`<div class="avatar">${esc((k.name||'?')[0].toUpperCase())}</div>`}<div><h3>${esc(k.name)}</h3><p>${esc(k.platform||'—')}</p></div></div>
      <div class="score-row"><span>Creator Intelligence</span><strong>${complete}/8</strong></div>
      <div class="chip-line">${arr(k.personality).slice(0,3).map(x=>`<span>${esc(x)}</span>`).join('')||'<em>No signals</em>'}</div>
      <div class="score-row"><span>Engagement</span><strong>${k.engagement_rate==null?'—':fmt(k.engagement_rate)+'%'}</strong></div>
      <div class="score-row"><span>Risk</span><strong>${esc(k.risk_level||'Not assessed')}</strong></div>
      <button class="ghost full" data-edit-creator="${k.id}">Open profile</button></article>`;
  }

  const intelligenceFields=[
    ['personality','Personality',['Warm','Confident','Playful','Thoughtful','Bold']],
    ['communication','Communication',['Conversational','Storytelling','Educational','Direct','Humorous']],
    ['audience_relationship','Audience Relationship',['Trust-based','Community-led','Aspirational','Expert-led','Interactive']],
    ['social_behavior','Social Behavior',['Trend-aware','Interactive','Community-active','Fast-moving','Selective']],
    ['content_personality','Content Personality',['Authentic','Editorial','Playful','Premium','Documentary']],
    ['content_function','Content Function',['Educate','Review','Inspire','Entertain','Convert']],
    ['content_behavior','Content Behavior',['Consistent','Experiment-driven','Series-led','Reactive','Evergreen']],
    ['audience_psychology','Audience Psychology',['Trust-seeking','Discovery-led','Value-seeking','Identity-led','Purchase-ready']]
  ];
  function intelligenceCount(k){
    return intelligenceFields.filter(([key])=>key==='audience_relationship'?String(k[key]||'').trim():arr(k[key]).length).length;
  }
  function chipField(key,label,examples,value){
    const values=key==='audience_relationship'?(value?[value]:[]):arr(value);
    return `<div class="intel-field"><label>${esc(label)} <span class="required">*</span></label><div class="chips">${examples.map(x=>`<button type="button" class="chip ${values.includes(x)?'selected':''}" data-chip-key="${key}" data-chip-value="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <input class="chip-custom" data-chip-input="${key}" placeholder="Add custom signal…" autocomplete="off">
      <div class="selected-chips" data-selected="${key}">${values.map(x=>`<span>${esc(x)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(x)}">×</button></span>`).join('')}</div></div>`;
  }

  function creatorForm(k){
    const x=k||{};
    return `<form id="creatorForm" class="form-grid" novalidate>
      <div class="form-section full-span"><div class="section-head"><div><span class="eyebrow">CREATOR PROFILE</span><h3>${x.id?'Edit KOL':'Add KOL'}</h3><p class="subtle">Structured inputs used by campaign ↔ KOL matching.</p></div></div>
        <div class="two-col"><label>KOL code<input name="kol_code" required value="${esc(x.kol_code||'')}" placeholder="KOL-001"></label><label>Name<input name="name" required value="${esc(x.name||'')}" placeholder="Creator name"></label>
        <label>Primary channel<select name="platform"><option value="">Select</option>${['Instagram','TikTok','YouTube','Facebook','X','Twitch','Other'].map(v=>`<option ${x.platform===v?'selected':''}>${v}</option>`).join('')}</select></label>
        <label>Secondary channels<input name="secondary_channels" value="${esc(csv(x.secondary_channels))}" placeholder="TikTok, YouTube"></label>
        <label>Platform URL<input name="platform_url" type="url" value="${esc(x.platform_url||'')}" placeholder="https://"></label>
        <label>Followers<input name="followers" type="number" min="0" value="${esc(x.followers??'')}"></label>
        <label>Engagement rate %<input name="engagement_rate" type="number" min="0" step="0.01" value="${esc(x.engagement_rate??'')}"></label>
        <label>Audience age<input name="audience_age" value="${esc(x.audience_age||'')}"></label>
        <label>Audience gender<select name="audience_gender"><option value="">Select</option>${['Female','Male','Mixed','Not disclosed'].map(v=>`<option ${x.audience_gender===v?'selected':''}>${v}</option>`).join('')}</select></label>
        <label>Audience location<input name="audience_location" value="${esc(x.audience_location||'')}"></label>
        <label>Audience interest<input name="audience_interest" value="${esc(x.audience_interest||'')}"></label></div>
      </div>
      <div class="form-section full-span"><div class="section-head"><div><span class="eyebrow">CREATOR INTELLIGENCE <span class="required">*</span></span><h3>Build the creator's intelligence profile.</h3><p class="subtle">Every category is required. Example chips remain available after selection; add your own signal when needed.</p></div></div>
      ${intelligenceFields.map(([key,label,examples])=>chipField(key,label,examples,x[key])).join('')}</div>
      <div class="form-section full-span"><div class="section-head"><div><span class="eyebrow">EVIDENCE</span><h3>Evidence inputs</h3><p class="subtle">Performance Evidence · Optional</p></div></div>
      <div class="two-col"><label>Audience evidence<textarea name="audience_evidence">${esc(x.audience_evidence||'')}</textarea></label><label>Engagement evidence<textarea name="engagement_evidence">${esc(x.engagement_evidence||'')}</textarea></label><label>Content evidence<textarea name="content_evidence">${esc(x.content_evidence||'')}</textarea></label><label>Performance evidence<textarea name="performance_evidence">${esc(x.performance_evidence||'')}</textarea></label><label>Reputation evidence<textarea name="reputation_evidence">${esc(x.reputation_evidence||'')}</textarea></label><label>Risk level<select name="risk_level"><option value="">Not assessed</option>${['LOW','MEDIUM','HIGH'].map(v=>`<option ${x.risk_level===v?'selected':''}>${v}</option>`).join('')}</select></label></div></div>
      <div class="form-section full-span"><div class="section-head"><div><span class="eyebrow">PROFILE IMAGE</span><h3>Persistent creator preview</h3><p class="subtle">Stored in Supabase Storage so refreshes do not remove the image.</p></div></div>
        <div class="upload-row">${x.image_url?`<img id="creatorPreview" class="upload-preview" src="${esc(x.image_url)}" alt="">`:`<div id="creatorPreview" class="upload-preview empty-preview">No image</div>`}<div><input id="creatorImage" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG or WebP · max 5 MB</small></div></div>
      </div>
      <div class="modal-actions full-span"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Save KOL</button></div>
    </form>`;
  }

  function brandForm(b){
    const x=b||{};
    return `<form id="brandForm" class="form-grid" novalidate><div class="form-section full-span"><div class="section-head"><div><span class="eyebrow">BRAND INTELLIGENCE</span><h3>${x.id?'Edit brand':'Add brand'}</h3></div></div>
      <div class="two-col"><label>Brand name<input name="name" required value="${esc(x.name||'')}"></label><label>Brand code<input name="brand_code" value="${esc(x.brand_code||'')}"></label><label>Category<input name="category" value="${esc(x.category||'')}"></label><label>Market<input name="market" value="${esc(x.market||'')}"></label>
      <label>Target audience<textarea name="target_audience">${esc(x.target_audience||'')}</textarea></label><label>Brand positioning<textarea name="brand_positioning">${esc(x.brand_positioning||'')}</textarea></label><label>Brand personality<textarea name="brand_personality">${esc(x.brand_personality||'')}</textarea></label><label>Brand tone<textarea name="brand_tone">${esc(x.brand_tone||'')}</textarea></label><label>Brand values<textarea name="brand_values">${esc(x.brand_values||'')}</textarea></label><label>Desired perception<textarea name="desired_perception">${esc(x.desired_perception||'')}</textarea></label></div></div>
      <div class="modal-actions full-span"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Save brand</button></div></form>`;
  }

  function campaignForm(c){
    const x=c||{};
    return `<form id="campaignForm" class="form-grid" novalidate><div class="form-section full-span"><div class="section-head"><div><span class="eyebrow">CAMPAIGN INTELLIGENCE</span><h3>${x.id?'Edit campaign':'Add campaign'}</h3></div></div>
      <div class="two-col"><label>Campaign name<input name="name" required value="${esc(x.name||'')}"></label><label>Campaign code<input name="campaign_code" value="${esc(x.campaign_code||'')}"></label>
      <label>Brand<select name="brand_id" required><option value="">Select brand</option>${state.brands.map(b=>`<option value="${b.id}" ${x.brand_id===b.id?'selected':''}>${esc(b.name)}</option>`).join('')}</select></label>
      <label>Primary KPI<input name="primary_kpi" value="${esc(x.primary_kpi||'')}"></label><label>Secondary KPI<input name="secondary_kpi" value="${esc(x.secondary_kpi||'')}"></label>
      <label>Budget<input name="budget" type="number" min="0" value="${esc(x.budget??'')}"></label><label>Currency<select name="currency">${['THB','USD','SGD','EUR','GBP'].map(v=>`<option ${x.currency===v||(!x.currency&&v==='THB')?'selected':''}>${v}</option>`).join('')}</select></label>
      <label>Start date<input name="start_date" type="date" value="${esc(x.start_date||'')}"></label><label>End date<input name="end_date" type="date" value="${esc(x.end_date||'')}"></label>
      <label>Status<select name="status">${['DRAFT','ACTIVE','PAUSED','COMPLETED','ARCHIVED'].map(v=>`<option ${x.status===v||(!x.status&&v==='DRAFT')?'selected':''}>${v}</option>`).join('')}</select></label>
      <label>Objective<textarea name="objective">${esc(x.objective||'')}</textarea></label><label>Target audience<textarea name="target_audience">${esc(x.target_audience||'')}</textarea></label></div></div>
      <div class="modal-actions full-span"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Save campaign</button></div></form>`;
  }

  function openModal(title,body){
    const wrap=document.createElement('div');wrap.className='modal-backdrop';wrap.innerHTML=`<div class="modal large"><div class="modal-head"><div><span class="eyebrow">KOL IDS™</span><h2>${esc(title)}</h2></div><button class="icon" data-close-modal>×</button></div>${body}</div>`;
    document.body.appendChild(wrap);
    $$('[data-close-modal]',wrap).forEach(b=>b.onclick=()=>wrap.remove());
    wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove();});
    return wrap;
  }

  function bindPage(){
    $$('[data-action="new-brand"]').forEach(b=>b.onclick=()=>openBrand());
    $$('[data-action="new-campaign"]').forEach(b=>b.onclick=()=>openCampaign());
    $$('[data-action="new-creator"]').forEach(b=>b.onclick=()=>openCreator());
    $$('[data-edit-brand]').forEach(b=>b.onclick=()=>openBrand(state.brands.find(x=>x.id===b.dataset.editBrand)));
    $$('[data-edit-campaign]').forEach(b=>b.onclick=()=>openCampaign(state.campaigns.find(x=>x.id===b.dataset.editCampaign)));
    $$('[data-edit-creator]').forEach(b=>b.onclick=()=>openCreator(state.creators.find(x=>x.id===b.dataset.editCreator)));
    $('#analysisCampaign')?.addEventListener('change',e=>{state.selectedCampaign=e.target.value;render();});
  }

  function openBrand(b){
    const modal=openModal(b?'Edit brand':'Add brand',brandForm(b));
    $('#brandForm',modal).onsubmit=async e=>{
      e.preventDefault();const btn=$('button[type=submit]',e.currentTarget);busy(btn,true);
      try{const fd=new FormData(e.currentTarget);const payload={organization_id:state.org.id,name:fd.get('name').trim(),brand_code:fd.get('brand_code').trim()||null,category:fd.get('category')||null,market:fd.get('market')||null,target_audience:fd.get('target_audience')||null,brand_positioning:fd.get('brand_positioning')||null,brand_personality:fd.get('brand_personality')||null,brand_tone:fd.get('brand_tone')||null,brand_values:fd.get('brand_values')||null,desired_perception:fd.get('desired_perception')||null};
        const r=b?await db.from('brands').update(payload).eq('id',b.id).eq('organization_id',state.org.id):await db.from('brands').insert(payload);if(r.error)throw r.error;
        await loadData();modal.remove();render();toast('Brand saved.','success');
      }catch(err){toast(cleanError(err),'error');}finally{busy(btn,false);}
    };
  }

  function openCampaign(c){
    if(!state.brands.length){toast('Create a brand before creating a campaign.','error');return;}
    const modal=openModal(c?'Edit campaign':'Add campaign',campaignForm(c));
    $('#campaignForm',modal).onsubmit=async e=>{
      e.preventDefault();const btn=$('button[type=submit]',e.currentTarget);busy(btn,true);
      try{const fd=new FormData(e.currentTarget);const payload={organization_id:state.org.id,brand_id:fd.get('brand_id'),name:fd.get('name').trim(),campaign_code:fd.get('campaign_code').trim()||null,objective:fd.get('objective')||null,target_audience:fd.get('target_audience')||null,primary_kpi:fd.get('primary_kpi')||null,secondary_kpi:fd.get('secondary_kpi')||null,budget:num(fd.get('budget')),currency:fd.get('currency'),start_date:fd.get('start_date')||null,end_date:fd.get('end_date')||null,status:fd.get('status')};
        const r=c?await db.from('campaigns').update(payload).eq('id',c.id).eq('organization_id',state.org.id):await db.from('campaigns').insert(payload);if(r.error)throw r.error;
        await loadData();state.selectedCampaign=c?.id||state.campaigns[0]?.id||'';modal.remove();render();toast('Campaign saved.','success');
      }catch(err){toast(cleanError(err),'error');}finally{busy(btn,false);}
    };
  }

  function openCreator(k){
    const modal=openModal(k?'Edit KOL':'Add KOL',creatorForm(k));
    const file=$('#creatorImage',modal), preview=$('#creatorPreview',modal);
    file?.addEventListener('change',()=>{const f=file.files?.[0];if(!f)return;if(!/^image\/(jpeg|png|webp)$/i.test(f.type)){file.value='';toast('Use JPG, PNG or WebP images only.','error');return;}if(f.size>5*1024*1024){file.value='';toast('Image must be 5 MB or smaller.','error');return;}const url=URL.createObjectURL(f);preview.outerHTML=`<img id="creatorPreview" class="upload-preview" src="${url}" alt="">`;});
    $$('.chip',modal).forEach(ch=>ch.onclick=()=>toggleChip(ch,modal));
    $$('[data-remove-chip]',modal).forEach(b=>b.onclick=()=>removeChip(b,modal));
    $$('.chip-custom',modal).forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addCustomChip(inp,modal);}}));
    $('#creatorForm',modal).onsubmit=async e=>{
      e.preventDefault();const btn=$('button[type=submit]',e.currentTarget);busy(btn,true);
      try{
        const fd=new FormData(e.currentTarget);
        const signals={};
        for(const [key,label,examples] of intelligenceFields){
          const values=getChipValues(key,modal);
          if(!values.length)throw new Error(`${label} is required.`);
          signals[key]=key==='audience_relationship'?values[0]:values;
        }
        const payload={organization_id:state.org.id,kol_code:fd.get('kol_code').trim(),name:fd.get('name').trim(),platform:fd.get('platform')||null,secondary_channels:parseList(fd.get('secondary_channels')),platform_url:fd.get('platform_url')||null,followers:num(fd.get('followers')),engagement_rate:num(fd.get('engagement_rate')),audience_age:fd.get('audience_age')||null,audience_gender:fd.get('audience_gender')||null,audience_location:fd.get('audience_location')||null,audience_interest:fd.get('audience_interest')||null,audience_relationship:signals.audience_relationship,personality:signals.personality,communication:signals.communication,social_behavior:signals.social_behavior,content_personality:signals.content_personality,content_function:signals.content_function,content_behavior:signals.content_behavior,audience_psychology:signals.audience_psychology,audience_evidence:fd.get('audience_evidence')||null,engagement_evidence:fd.get('engagement_evidence')||null,content_evidence:fd.get('content_evidence')||null,performance_evidence:fd.get('performance_evidence')||null,reputation_evidence:fd.get('reputation_evidence')||null,risk_level:fd.get('risk_level')||null};
        let r=k?await db.from('creators').update(payload).eq('id',k.id).eq('organization_id',state.org.id).select().single():await db.from('creators').insert(payload).select().single();
        if(r.error)throw r.error;
        const creator=r.data;
        const image=file?.files?.[0];
        if(image){
          const ext=({ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' }[image.type]||'jpg');
          const path=`${state.org.id}/${creator.id}/${uid()}.${ext}`;
          const up=await db.storage.from('kol-profile-images').upload(path,image,{upsert:false,contentType:image.type,cacheControl:'31536000'});
          if(up.error)throw up.error;
          const {data:pub}=db.storage.from('kol-profile-images').getPublicUrl(path);
          const ur=await db.from('creators').update({image_url:pub.publicUrl}).eq('id',creator.id).eq('organization_id',state.org.id);
          if(ur.error)throw ur.error;
        }
        await loadData();modal.remove();render();toast('KOL profile saved.','success');
      }catch(err){toast(cleanError(err),'error');}finally{busy(btn,false);}
    };
  }

  function getChipValues(key,modal){
    return $$(`[data-selected="${key}"] > span`,modal).map(x=>x.firstChild?.textContent?.trim()).filter(Boolean);
  }
  function renderSelected(key,modal){
    const box=$(`[data-selected="${key}"]`,modal);if(!box)return;
    box.innerHTML=getChipValues(key,modal).map(v=>`<span>${esc(v)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(v)}">×</button></span>`).join('');
    $$(`[data-remove-chip="${key}"]`,modal).forEach(b=>b.onclick=()=>removeChip(b,modal));
    $$(`[data-chip-key="${key}"]`,modal).forEach(ch=>ch.classList.toggle('selected',getChipValues(key,modal).includes(ch.dataset.chipValue)));
  }
  function toggleChip(ch,modal){
    const key=ch.dataset.chipKey,val=ch.dataset.chipValue;const box=$(`[data-selected="${key}"]`,modal);
    const current=getChipValues(key,modal);if(key==='audience_relationship'){box.innerHTML=`<span>${esc(val)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(val)}">×</button></span>`;}
    else if(current.includes(val)){box.innerHTML=current.filter(x=>x!==val).map(v=>`<span>${esc(v)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(v)}">×</button></span>`).join('');}
    else{box.insertAdjacentHTML('beforeend',`<span>${esc(val)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(val)}">×</button></span>`);}
    renderSelected(key,modal);
  }
  function removeChip(btn,modal){
    const key=btn.dataset.removeChip,val=btn.dataset.removeValue;const values=getChipValues(key,modal).filter(x=>x!==val);
    const box=$(`[data-selected="${key}"]`,modal);box.innerHTML=values.map(v=>`<span>${esc(v)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(v)}">×</button></span>`).join('');
    renderSelected(key,modal);
  }
  function addCustomChip(inp,modal){
    const key=inp.dataset.chipInput,val=inp.value.trim();if(!val)return;
    const box=$(`[data-selected="${key}"]`,modal);const values=getChipValues(key,modal);
    if(!values.includes(val)){
      if(key==='audience_relationship')box.innerHTML=`<span>${esc(val)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(val)}">×</button></span>`;
      else box.insertAdjacentHTML('beforeend',`<span>${esc(val)}<button type="button" data-remove-chip="${key}" data-remove-value="${esc(val)}">×</button></span>`);
    }
    inp.value='';renderSelected(key,modal);
  }

  function cleanError(e){
    const msg=String(e?.message||e||'Unknown error');
    return msg.includes('duplicate key')?'This code already exists in this workspace.':msg.replace(/^Error:\s*/,'');
  }

  // Boot after config is injected by Cloudflare Pages Function.
  if(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && window.supabase){
    db=window.supabase.createClient(CONFIG.SUPABASE_URL,CONFIG.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    db.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT'){state.session=null;loginView();}
      if(event==='PASSWORD_RECOVERY'){loginView('recovery');}
      if(event==='SIGNED_IN' && !state.session){state.session=session;boot();}
    });
    boot();
  }else{
    root.innerHTML='<div class="setup"><span class="eyebrow">CONFIGURATION</span><h1>KOL IDS™ Cloud</h1><p>Runtime configuration is missing. Deploy through Cloudflare Pages and set the Supabase environment variables.</p></div>';
  }
})();
