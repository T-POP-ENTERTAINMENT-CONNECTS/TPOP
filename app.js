(function(){
'use strict';
const C=window.KOL_IDS_CONFIG||{}, root=document.getElementById('app'); let sb=null;
const S={session:null,org:null,license:null,brands:[],campaigns:[],creators:[],decisions:[],performance:[],outcomes:[],learning:[],page:'dashboard'};
const ready=C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&!C.SUPABASE_URL.includes('YOUR_');
if(ready&&window.supabase) sb=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const esc=x=>String(x??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const num=x=>x==null||x===''?'—':new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(x);
function toast(m,t='info'){let e=document.getElementById('toast');if(e){e.textContent=m;e.className='toast show '+t;setTimeout(()=>e.className='toast',3000)}}
function auth(mode='login', notice=''){
  root.innerHTML=`<div class="entry-page">
    <div class="entry-shell">
      <div class="entry-brand"><div class="entry-brand-identity"><span class="entry-brand-mark">K</span><div><strong>KOL IDS™</strong><small>SECURE CUSTOMER ACCESS</small></div></div><a class="entry-home-btn" href="https://tpopconnects.com/" aria-label="Back to T POP Entertainment Connects"><span>tpopconnects.com</span></a></div>
      <div class="entry-heading">
        <span class="entry-eyebrow">KOL IDS™ · SECURE CUSTOMER ACCESS</span>
        <h1>Sign in to your intelligence workspace</h1>
        <p>Enter the Client ID and 9-character Access Key issued for your KOL IDS™ workspace.</p>
      </div>
      ${notice?`<div class="entry-notice">${esc(notice)}</div>`:''}
      <section class="sales-panel">
        <div class="sales-kicker">CREATOR DECISION INTELLIGENCE</div>
        <h2>Stop choosing creators by instinct.</h2>
        <p>KOL IDS turns creator selection into an evidence-based decision process — combining fit, impact, commercial efficiency, confidence, risk and post-campaign learning in one intelligence workspace.</p>
        <div class="sales-grid">
          <article><b>WHO should we choose?</b><span>Rank creators against the campaign context, not follower count alone.</span></article>
          <article><b>WHY should we choose them?</b><span>Expose decision signals, evidence gaps and confidence instead of hiding the reasoning.</span></article>
          <article><b>WHAT did we learn?</b><span>Compare predicted decisions with actual outcomes and feed the learning loop.</span></article>
        </div>
      </section>
      <section class="demo-panel">
        <div class="panel-head"><div><span>DECISION DEMO</span><h3>See the decision logic before using your own campaign data.</h3></div><b>Illustrative example</b></div>
        <div class="demo-actions"><button type="button" class="demo-btn" id="run-demo">Show how KOL IDS decides</button><span>No customer data is used in this demo.</span></div>
        <div id="demo-result" class="demo-result show"></div>
      </section>
      <section class="exposure-panel">
        <div class="panel-head"><div><span>DECISION EXPOSURE ILLUSTRATION</span><h3>Make the budget exposure around creator-decision uncertainty visible.</h3></div><b>Illustrative only</b></div>
        <div class="exposure-grid">
          <div class="exposure-card"><h4>Use your own campaign assumptions</h4><div class="exposure-fields"><label>Campaign budget (THB)<input id="entry-budget" type="number" min="0" step="1000" value="300000"></label><label>Illustrative uncertainty %<input id="entry-risk" type="number" min="0" max="100" step="1" value="10"></label></div></div>
          <div class="exposure-card"><h4>What the number means</h4><div class="exposure-metrics"><div><span>Illustrative budget exposure</span><strong id="entry-exposure">THB 30,000</strong></div><div><span>Assumption used</span><strong id="entry-assumption">10%</strong></div></div></div>
        </div>
        <p class="exposure-note">This is <b>not business value, ROI, savings, revenue uplift, or a forecast</b>. It is a transparent scenario calculation: campaign budget × the user-selected uncertainty assumption.</p>
        <div class="plan-strip"><button type="button" class="plan-card" data-plan="3 Months"><span>3 MONTHS</span><strong>THB 39,000</strong><small>1 Google Account · full workspace</small><em>Open order form →</em></button><button type="button" class="plan-card" data-plan="6 Months"><span>6 MONTHS</span><strong>THB 73,900</strong><small>2 Google Accounts · full workspace</small><em>Open order form →</em></button><button type="button" class="plan-card featured" data-plan="12 Months"><span>12 MONTHS</span><strong>THB 139,000</strong><small>3 Google Accounts · full workspace</small><em>Open order form →</em></button></div>
      </section>
      <section class="access-panel">
        <div class="panel-head compact"><div><span>CLIENT ACCESS</span><h3>Open your workspace</h3></div><b>Client ID + Access Key</b></div>
        <form id="auth" class="access-form client-access-form">
          <label>Client ID<input id="entry-client-id" name="clientId" type="text" required autocomplete="username" autocapitalize="characters" spellcheck="false" placeholder="CL-XXXXXXXXXX"></label>
          <label>Access Key · 9 characters<input id="entry-access-key" name="accessKey" type="password" required minlength="9" maxlength="9" pattern="[A-Za-z0-9]{9}" autocomplete="current-password" autocapitalize="characters" spellcheck="false" placeholder="XXXXXXXXX"></label>
          <div class="access-key-meta"><span>Format: 9 letters / numbers · case-insensitive</span><span id="entry-key-count">0 / 9</span></div>
          <div class="access-actions"><button id="entry-submit" class="entry-primary" type="submit">Sign in</button><button id="entry-view-key" type="button" class="entry-ghost" aria-pressed="false">View Access Key</button></div>
          <div id="entry-status" class="entry-status" aria-live="polite">Your workspace opens only after the server verifies both credentials.</div>
        </form>
        <div class="entry-note">Your Client ID identifies the workspace. The 9-character Access Key is the secret credential. Customer sign-in does not depend on the Google account currently active in the browser.</div>
        <div class="entry-help"><span>Already have a workspace?</span><span>Use the same Client ID + Access Key on every device.</span></div>
      </section>
      <section class="trial-offer trial-offer-primary">
        <div class="trial-offer-copy">
          <span class="trial-kicker">KOL IDS™ · 7-DAY FREE TRIAL</span>
          <h2>Start Free Trial / Request Access</h2>
          <p>Explore the KOL IDS intelligence workspace for 7 days. Start with your own workspace, then choose a paid plan when you are ready.</p>
        </div>
        <button id="entry-trial" type="button" class="trial-hero-btn">Start Free Trial →</button>
      </section>
    </div>
  </div>`;

  const status=document.getElementById('entry-status');
  const submit=document.getElementById('entry-submit');
  const key=document.getElementById('entry-access-key');
  const client=document.getElementById('entry-client-id');
  const count=document.getElementById('entry-key-count');
  const setStatus=(msg,type='busy')=>{if(status){status.className='entry-status '+type;status.innerHTML=`<span class="status-dot"></span>${esc(msg)}`}};
  const setBusy=(busy,label)=>{if(submit){submit.disabled=busy;submit.textContent=busy?label:'Sign in';} if(key)key.disabled=busy;if(client)client.disabled=busy;};
  const normalize=()=>{if(client)client.value=client.value.toUpperCase().replace(/\s+/g,'');if(key)key.value=key.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,9);if(count)count.textContent=`${key?.value.length||0} / 9`;};
  client?.addEventListener('input',normalize); key?.addEventListener('input',normalize);
  document.getElementById('entry-view-key')?.addEventListener('click',()=>{if(!key)return;const show=key.type==='password';key.type=show?'text':'password';const b=document.getElementById('entry-view-key');b.textContent=show?'Hide Access Key':'View Access Key';b.setAttribute('aria-pressed',show?'true':'false');key.focus()});
  document.getElementById('entry-trial')?.addEventListener('click',()=>openCommercialModal('trial')); document.querySelectorAll('.plan-card').forEach(btn=>btn.addEventListener('click',()=>openOrderForm(btn.dataset.plan||'')));
  function openOrderForm(plan){const u=String(C.ORDER_FORM_URL||C.TRIAL_URL||'').trim();if(!u){toast('Order form is not configured yet.','error');return;}window.open(u,'_blank','noopener,noreferrer');}
function closeCommercialModal(){const m=document.getElementById('kolIdsCommercialModal');if(m)m.remove();}
function openCommercialModal(mode='trial'){
  closeCommercialModal();
  const m=document.createElement('div');m.id='kolIdsCommercialModal';m.className='commercial-modal';
  m.innerHTML=`<div class="commercial-modal-card" role="dialog" aria-modal="true" aria-labelledby="commercial-modal-title">
    <div class="commercial-modal-head">
      <div><span class="modal-kicker">KOL IDS · COMMERCIAL ACCESS</span>
      <h2 id="commercial-modal-title">${mode==='trial'?'Choose how you want to start':'Continue with a paid KOL IDS plan'}</h2>
      <p>${mode==='trial'?'Start with a 7-day free trial, or go directly to a 3 / 6 / 12-month subscription form. Your Client ID + Access Key stay with the same workspace.':'Choose the plan you want to purchase. Your existing Client ID will be preserved when upgrading a Trial workspace.'}</p></div>
      <button type="button" class="modal-close" aria-label="Close">×</button>
    </div>
    <div class="commercial-plan-grid commercial-plan-grid-four">
      ${mode==='trial'?`<article class="commercial-plan trial trial-primary"><span>FREE TRIAL</span><h3>7-Day Trial</h3><strong>FREE</strong><p>Start your KOL IDS workspace for 7 days.</p><small>Client ID + Access Key are created for your workspace. Report Export stays locked until upgrade.</small><button type="button" class="modal-cta trial-cta trial-modal-cta" data-trial="1">Start Free Trial →</button></article>`:''}
      <article class="commercial-plan"><span>3 MONTHS</span><h3>3 Months</h3><strong>THB 39,000</strong><p>3 months · full workspace.</p><button type="button" class="modal-cta" data-order="3 Months">Open Order Form →</button></article>
      <article class="commercial-plan"><span>6 MONTHS</span><h3>6 Months</h3><strong>THB 73,900</strong><p>6 months · full workspace.</p><button type="button" class="modal-cta" data-order="6 Months">Open Order Form →</button></article>
      <article class="commercial-plan featured"><span>12 MONTHS</span><h3>12 Months</h3><strong>THB 139,000</strong><p>12 months · full workspace.</p><button type="button" class="modal-cta" data-order="12 Months">Open Order Form →</button></article>
    </div>
  </div>`;
  document.body.appendChild(m);requestAnimationFrame(()=>m.classList.add('show'));
  m.querySelector('.modal-close')?.addEventListener('click',closeCommercialModal);
  m.addEventListener('click',e=>{if(e.target===m)closeCommercialModal()});
  m.querySelector('[data-trial]')?.addEventListener('click',()=>{const u=String(C.TRIAL_URL||C.ORDER_FORM_URL||'').trim();if(!u){toast('Trial form is not configured yet.','error');return;}window.open(u,'_blank','noopener,noreferrer')});
  m.querySelectorAll('[data-order]').forEach(b=>b.addEventListener('click',()=>openOrderForm(b.dataset.order||'')));
}
document.getElementById('run-demo')?.addEventListener('click',()=>renderEntryDemo());
  const calcExposure=()=>{const b=Math.max(0,Number(document.getElementById('entry-budget')?.value||0));const r=Math.max(0,Math.min(100,Number(document.getElementById('entry-risk')?.value||0)));const e=b*r/100;const f=new Intl.NumberFormat('en-US',{maximumFractionDigits:0});const out=document.getElementById('entry-exposure');const ass=document.getElementById('entry-assumption');if(out)out.textContent='THB '+f.format(e);if(ass)ass.textContent=r.toFixed(0)+'%';};
  ['entry-budget','entry-risk'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcExposure)); calcExposure(); renderEntryDemo(); normalize();
  document.getElementById('auth').onsubmit=async e=>{
    e.preventDefault(); if(!sb){setStatus('Supabase is not configured.','bad');return;} if(window.__KOL_IDS_ENTRY_BUSY__)return;
    normalize();
    const clientId=String(client?.value||'').trim(); const accessKey=String(key?.value||'').trim();
    if(!/^CL-[A-Z0-9]{10}$/.test(clientId)){setStatus('Enter a valid Client ID in the CL-XXXXXXXXXX format.','bad');client?.focus();return;}
    if(!/^[A-Z0-9]{9}$/.test(accessKey)){setStatus('Access Key must contain exactly 9 letters / numbers.','bad');key?.focus();return;}
    window.__KOL_IDS_ENTRY_BUSY__=true; setBusy(true,'Verifying…'); setStatus('Verifying Client ID and Access Key securely…','busy');
    try{
      const endpoint=String(C.CLIENT_SIGNIN_URL||`${String(C.SUPABASE_URL||'').replace(/\/$/,'')}/functions/v1/client-sign-in`).trim();
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:String(C.SUPABASE_ANON_KEY||'')},body:JSON.stringify({clientId,accessKey})});
      const r=await response.json().catch(()=>({}));
      if(!response.ok||!r?.success||!r?.session)throw new Error(r?.message||'Client authentication failed.');
      setStatus('Verified. Creating your secure workspace session…','good');
      const sessionResult=await sb.auth.setSession({access_token:r.session.access_token,refresh_token:r.session.refresh_token});
      if(sessionResult.error)throw sessionResult.error;
      S.session=sessionResult.data.session||r.session;
      sessionStorage.setItem('KOL_IDS_CLIENT_ID',clientId);
      await boot();
    }catch(x){setStatus(x.message||'Authentication failed. Check your Client ID and 9-character Access Key.','bad');setBusy(false);window.__KOL_IDS_ENTRY_BUSY__=false;}
  };
}
function renderEntryDemo(){const host=document.getElementById('demo-result');if(!host)return;const data=[['Creator A',92,88,94,'STRONG CONSIDER','High campaign fit + strong commercial efficiency + high evidence confidence.'],['Creator B',87,73,82,'CONSIDER','Strong audience/content alignment, but efficiency evidence is less certain.'],['Creator C',76,91,68,'REVIEW','Commercially attractive, but fit evidence needs additional validation.'],['Creator D',61,59,74,'NOT PRIORITY','Lower campaign fit and weaker efficiency signal.']];host.innerHTML=`<div class="demo-logic"><div><span>DECISION SIGNAL</span><b>Fit + Efficiency</b></div><div><span>EVIDENCE</span><b>Weighted</b></div><div><span>CONFIDENCE</span><b>Separate</b></div><div><span>OUTPUT</span><b>Action</b></div></div><p class="demo-explain">The score is not the recommendation by itself. KOL IDS combines decision signals, evidence quality, confidence and risk to explain what should happen next.</p>${data.map(x=>`<div class="demo-row"><strong>${x[0]}</strong><span>${x[1]} Fit</span><span>${x[2]} Eff.</span><span>${x[3]} Conf.</span><b>${x[4]}</b></div><div class="demo-why">${x[5]}</div>`).join('')}<div class="demo-point"><b>The point:</b>&nbsp; KOL IDS does not only rank creators. It explains the decision.</div>`;}

async function boot(){
  if(!sb){root.innerHTML='<div class="setup"><h1>KOL IDS</h1><p>Configure config.js before deployment.</p></div>';return}
  let {data:{session}}=await sb.auth.getSession();
  S.session=session;
  if(!session){auth();return}
  showWorkspaceProcessing();
  try{
    setWorkspaceProgress(1,'Secure access','Verified account session');
    let r=await sb.rpc('bootstrap_workspace',{p_name:null});
    if(r.error)throw r.error;
    setWorkspaceProgress(2,'Workspace','Loading private workspace');
    await load();
    setWorkspaceProgress(3,'Context','Loading saved campaign and intelligence context');
    await new Promise(resolve=>setTimeout(resolve,220));
    if(window.__KOL_IDS_PROCESS_TIMER__)clearInterval(window.__KOL_IDS_PROCESS_TIMER__);
    render();
  }catch(e){
    root.innerHTML='';
    auth('login',e.message||'We could not open the workspace. Please sign in again.');
  }
}
function showWorkspaceProcessing(){root.innerHTML=`<div class="processing-page"><div class="processing-box"><div class="entry-eyebrow">KOL IDS™ · SECURE WORKSPACE</div><h1>Preparing your intelligence workspace</h1><p id="processing-message">Connecting to your private workspace…</p><div class="processing-live"><span class="processing-spinner"></span><div><b id="processing-title">PROCESSING…</b><small id="processing-detail">Verifying secure access</small></div><strong id="processing-elapsed">0s</strong></div><div class="processing-track"><div id="processing-bar"></div></div><div class="processing-hint"><span class="status-dot"></span><b>System is working</b><span>Please wait — do not close this page</span></div><div class="processing-steps"><div class="processing-step active" id="processing-step-1"><i>1</i><div><b>Secure access</b><small>Verifying secure access…</small></div><span>Processing</span></div><div class="processing-step" id="processing-step-2"><i>2</i><div><b>Workspace</b><small>Waiting for workspace…</small></div><span>Waiting</span></div><div class="processing-step" id="processing-step-3"><i>3</i><div><b>Context</b><small>Waiting for saved context…</small></div><span>Waiting</span></div></div></div></div>`;let started=Date.now();window.__KOL_IDS_PROCESS_TIMER__=setInterval(()=>{const e=document.getElementById('processing-elapsed');if(e)e.textContent=Math.max(0,Math.floor((Date.now()-started)/1000))+'s'},250)}
function setWorkspaceProgress(n,title,detail){for(let i=1;i<=3;i++){const el=document.getElementById('processing-step-'+i);if(!el)continue;el.classList.toggle('active',i===n);el.classList.toggle('done',i<n);const st=el.querySelector('span');if(st)st.textContent=i<n?'Complete':i===n?'Processing':'Waiting';const sm=el.querySelector('small');if(sm)sm.textContent=i<n?'Complete':i===n?detail:'Waiting for '+(i===2?'workspace':'saved context')+'…'}const t=document.getElementById('processing-title');const d=document.getElementById('processing-detail');const m=document.getElementById('processing-message');const bar=document.getElementById('processing-bar');if(t)t.textContent=title.toUpperCase();if(d)d.textContent=detail;if(m)m.textContent=detail+'…';if(bar)bar.style.width=((n/3)*100)+'%';}
if(sb) sb.auth.onAuthStateChange((e,s)=>{if(e==='SIGNED_OUT'){S.session=null;auth()}});
boot();

})();
