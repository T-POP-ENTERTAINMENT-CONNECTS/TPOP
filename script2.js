
(function(){
'use strict';
const C=window.KOL_IDS_CONFIG||{}, root=document.getElementById('app'); let sb=null;
const S={session:null,org:null,license:null,brands:[],campaigns:[],creators:[],decisions:[],performance:[],outcomes:[],learning:[],page:'dashboard'};
const ready=C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&!C.SUPABASE_URL.includes('YOUR_');
if(ready&&window.supabase) sb=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const esc=x=>String(x??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const num=x=>x==null||x===''?'·':new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(x);
function toast(m,t='info'){let e=document.getElementById('toast');if(e){e.textContent=m;e.className='toast show '+t;setTimeout(()=>e.className='toast',3000)}}
function auth(mode='login', notice=''){
  root.innerHTML=`<div class="entry-page">
    <div class="entry-shell">
      <div class="entry-brand"><div class="entry-brand-identity"><span class="entry-brand-mark">K</span><div><strong>KOL IDS™</strong><small>CREATOR DECISION INTELLIGENCE</small></div></div><a class="entry-home-btn" href="https://tpopconnects.com/" aria-label="Back to T POP Entertainment Connects"><span>tpopconnects.com</span></a></div>
      <div class="entry-heading">
        <span class="entry-eyebrow">KOL IDS™ · CREATOR DECISION INTELLIGENCE</span>
        <h1>Sign in to your intelligence workspace</h1>
        <p>Use your KOL IDS account Email + Password. Your organization workspace, plan and user seats are managed securely in the cloud.</p>
      </div>
      ${notice?`<div class="entry-notice">${esc(notice)}</div>`:''}
      <section class="sales-panel">
        <div class="sales-kicker">CREATOR DECISION INTELLIGENCE</div>
        <h2>Stop choosing creators by instinct.</h2>
        <p>KOL IDS turns creator selection into an evidence based decision process · combining fit, impact, commercial efficiency, confidence, risk and post campaign learning in one intelligence workspace.</p>
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
        <div class="panel-head"><div><span>DECISION EXPOSURE ILLUSTRATION</span><h3>Make the budget exposure around creator decision uncertainty visible.</h3></div><b>Illustrative only</b></div>
        <div class="exposure-grid">
          <div class="exposure-card"><h4>Use your own campaign assumptions</h4><div class="exposure-fields"><label>Campaign budget (THB)<input id="entry-budget" type="number" min="0" step="1000" value="300000"></label><label>Illustrative uncertainty %<input id="entry-risk" type="number" min="0" max="100" step="1" value="10"></label></div></div>
          <div class="exposure-card"><h4>What the number means</h4><div class="exposure-metrics"><div><span>Illustrative budget exposure</span><strong id="entry-exposure">THB 30,000</strong></div><div><span>Assumption used</span><strong id="entry-assumption">10%</strong></div></div></div>
        </div>
        <p class="exposure-note">This is <b>not business value, ROI, savings, revenue uplift, or a forecast</b>. It is a transparent scenario calculation: campaign budget × the user-selected uncertainty assumption.</p>
        <div class="plan-strip">
          <button type="button" class="plan-card" data-plan="3 Months" aria-label="Open order for 3 month plan">
            <span>SELECTED PLAN</span>
            <strong>3 Months</strong>
            <small>1 user · Flexible starting point · Focused teams.</small>
            <em>OPEN ORDER →</em>
          </button>
          <button type="button" class="plan-card" data-plan="6 Months" aria-label="Open order for 6 month plan">
            <span>SELECTED PLAN</span>
            <strong>6 Months</strong>
            <small>2 users · More room to collaborate · Growing teams.</small>
            <em>OPEN ORDER →</em>
          </button>
          <button type="button" class="plan-card featured" data-plan="12 Months" aria-label="Open order for 12 month plan">
            <span>SELECTED PLAN</span>
            <strong>12 Months</strong>
            <small>3 users · Best value · Continuous access.</small>
            <em>OPEN ORDER →</em>
          </button>
        </div>
      </section>
      <section class="access-panel">
        <div class="panel-head compact"><div><span>ACCOUNT LOGIN</span><h3>Open your organization workspace</h3></div><b>Supabase Auth</b></div>
        <form id="auth" class="access-form account-login-form">
          <label>Email<input id="entry-email" name="email" type="email" required autocomplete="email" spellcheck="false" placeholder="you@company.com"></label>
          <label>Password<input id="entry-password" name="password" type="password" required autocomplete="current-password" placeholder="••••••••"></label>
          <div class="access-actions"><button id="entry-submit" class="entry-primary" type="submit">Sign in</button><button id="entry-view-password" type="button" class="entry-ghost" aria-pressed="false">Show Password</button></div>
          <div id="entry-status" class="entry-status" aria-live="polite">Your organization workspace opens after Supabase verifies your account.</div>
        </form>
        <div class="entry-note">Google Account is not a KOL IDS credential. Login uses the Email + Password stored in Supabase Auth.</div>
        <div class="entry-help"><span>Organization Workspace</span><span>Owner/Admin can invite members. Available seats are verified from cloud data.</span></div>
      </section>
      <section class="trial-offer trial-offer-primary">
        <div class="trial-offer-copy">
          <span class="trial-kicker">KOL IDS™ · 7 DAY FREE TRIAL</span>
          <h2>Start Free Trial / Request Access</h2>
          <p>7 days · 1 user seat. Your organization workspace and account are created in the cloud.</p>
        </div>
        <button id="entry-trial" type="button" class="trial-hero-btn">Start Free Trial →</button>
      </section>
    </div>
  </div>`;

  const status=document.getElementById('entry-status');
  const submit=document.getElementById('entry-submit');
  const email=document.getElementById('entry-email');
  const password=document.getElementById('entry-password');
  const setStatus=(msg,type='busy')=>{if(status){status.className='entry-status '+type;status.innerHTML=`<span class="status-dot"></span>${esc(msg)}`}};
  const setBusy=(busy,label)=>{if(submit){submit.disabled=busy;submit.textContent=busy?label:'Sign in';} if(email)email.disabled=busy;if(password)password.disabled=busy;};

  document.getElementById('entry-view-password')?.addEventListener('click',()=>{
    if(!password)return;
    const show=password.type==='password';
    password.type=show?'text':'password';
    const b=document.getElementById('entry-view-password');
    b.textContent=show?'Hide Password':'Show Password';
    b.setAttribute('aria-pressed',show?'true':'false');
    password.focus();
  });

  document.getElementById('entry-trial')?.addEventListener('click',()=>openCommercialModal('trial'));
  document.querySelectorAll('.plan-card').forEach(btn=>btn.addEventListener('click',()=>openOrderForm(btn.dataset.plan||'')));

  function openOrderForm(plan){ openSignupModal(plan || 'PLAN_3M'); }
  function planCode(plan){ const v=String(plan||'').trim(); if(['TRIAL_7','PLAN_3M','PLAN_6M','PLAN_12M'].includes(v)) return v; return v==='3 Months'?'PLAN_3M':v==='6 Months'?'PLAN_6M':v==='12 Months'?'PLAN_12M':'TRIAL_7'; }
  function planLabel(code){ return ({TRIAL_7:'7 Day Trial',PLAN_3M:'3 Months',PLAN_6M:'6 Months',PLAN_12M:'12 Months'})[code]||code; }
  function planPrice(code){ return ({PLAN_3M:'THB 29,900',PLAN_6M:'THB 55,900',PLAN_12M:'THB 105,900'})[code]||''; }
  function openSignupModal(plan, options={}){
    closeCommercialModal();
    const existingAccount=Boolean(options?.existingAccount);
    const code=planCode(plan), label=planLabel(code), isTrial=code==='TRIAL_7';
    if(existingAccount && isTrial){ options.existingAccount=false; }
    const accountEmail=String(S.session?.user?.email||'').trim().toLowerCase();
    const accountName=String(S.session?.user?.user_metadata?.name||S.session?.user?.user_metadata?.full_name||'').trim();
    const accountCompany=String(S.session?.user?.user_metadata?.company_name||'').trim();
    const billingFields=isTrial?'':`<section class="signup-billing" id="signup-billing-section">
      <div class="signup-billing-head"><div><span>BILLING / DOCUMENT REQUEST</span><b>Do you need a quotation, tax invoice or receipt?</b></div><small>We collect these details before payment so your billing document can be prepared correctly.</small></div>
      <div class="signup-billing-docs">
        <label><input type="checkbox" name="billingDoc" value="QUOTATION"> Quotation</label>
        <label><input type="checkbox" name="billingDoc" value="TAX_INVOICE"> Tax Invoice</label>
        <label><input type="checkbox" name="billingDoc" value="RECEIPT"> Receipt</label>
      </div>
      <div class="signup-billing-details" id="signup-billing-details" hidden>
        <div class="signup-billing-type"><span>Billing entity</span><label><input type="radio" name="billingType" value="INDIVIDUAL" checked> Individual / บุคคลธรรมดา</label><label><input type="radio" name="billingType" value="JURISTIC"> Juristic / นิติบุคคล</label></div>
        <div class="signup-billing-grid">
          <label>Legal name / ชื่อสำหรับออกเอกสาร<input id="billing-legal-name" type="text" placeholder="Full legal name / company legal name"></label>
          <label>Tax ID / เลขประจำตัวผู้เสียภาษี<input id="billing-tax-id" type="text" inputmode="numeric" placeholder="Optional for individual"></label>
          <label id="billing-branch-wrap" hidden>Branch / สาขา<input id="billing-branch" type="text" placeholder="สำนักงานใหญ่ / Branch number"></label>
          <label>Phone / โทรศัพท์<input id="billing-phone" type="tel" placeholder="08x-xxx-xxxx"></label>
          <label class="full">Billing address / ที่อยู่สำหรับออกเอกสาร<textarea id="billing-address" rows="3" placeholder="Full billing address"></textarea></label>
        </div>
      </div>
    </section>`;
    const paymentFields=isTrial?'':`<section class="signup-payment" id="signup-payment-section">
      <div class="signup-payment-head"><div><span>PAYMENT</span><b>Complete your payment</b></div><small>Your payment proof is submitted directly with this account application. No separate form is required.</small></div>
      <div class="payment-account-card"><div><span>Kasikornbank (KBank)</span><b>บจก. ที ป็อป เอนเตอร์เทนเมนท์ คอนเนคส์</b><strong>215-182-2269</strong><small>Savings Account / บัญชีออมทรัพย์</small></div><div class="payment-account-note">Your workspace will be activated after we verify your payment.</div></div>
      <div class="signup-payment-grid">
        <label>Payment method / วิธีชำระ<select id="payment-method"><option value="BANK_TRANSFER_KBANK">Bank Transfer · KBank</option><option value="CHEQUE">Cheque</option></select></label>
        <label>Payment date / วันที่ชำระ<input id="payment-date" type="date" required></label>
        <label>Payment reference / เลขที่อ้างอิง<input id="payment-reference" type="text" placeholder="Optional"></label>
        <label class="payment-proof-file">Payment proof / หลักฐานการชำระ<input id="payment-proof-file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf"><small>Upload JPG, PNG, WEBP or PDF · max 8 MB.</small></label>
        <label class="full">Payment proof URL / ลิงก์หลักฐาน<input id="payment-proof-url" type="url" placeholder="https://…"><small>Use this only if the proof is hosted elsewhere.</small></label>
      </div>
    </section>`;

    const m=document.createElement('div');m.id='kolIdsSignupModal';m.className='commercial-modal';
    m.innerHTML=`<div class="commercial-modal-card" role="dialog" aria-modal="true" aria-labelledby="signup-title">
      <div class="commercial-modal-head"><div><span class="modal-kicker">KOL IDS · ${existingAccount?'EXISTING ACCOUNT':'CREATE ACCOUNT'}</span><h2 id="signup-title">${existingAccount?`Continue with ${esc(label)}`:`Create your ${esc(label)} account`}</h2><p>${existingAccount?'Continue with your existing KOL IDS account.':(isTrial?'Your 7 day trial is activated immediately after account creation.':'Your account and organization are created now. Paid workspace access is activated after payment confirmation.')}</p></div><button type="button" class="modal-close" aria-label="Close">×</button></div>
      <form id="kolIdsSignupForm" class="kol-signup-form">
        <label>Work email<input id="signup-email" type="email" required autocomplete="email" placeholder="you@company.com" value="${esc(existingAccount?accountEmail:'')}" ${existingAccount?'readonly':''}></label>
        <label>Full name<input id="signup-name" type="text" ${existingAccount?'':'required'} autocomplete="name" placeholder="Your name" value="${esc(existingAccount?accountName:'')}"></label>
        <label>Organization / company<input id="signup-company" type="text" autocomplete="organization" placeholder="Company name" value="${esc(existingAccount?accountCompany:'')}"></label>
        <label>Password / รหัสผ่าน<div class="signup-password-wrap"><input id="signup-password" type="password" required minlength="8" autocomplete="new-password" placeholder="At least 8 characters"><button type="button" class="signup-password-toggle" id="signup-view-password" aria-pressed="false">Show</button></div></label>
        <div class="signup-plan"><span>SELECTED PLAN</span><b>${esc(label)}</b><strong class="signup-plan-price">${esc(planPrice(code))}</strong><small>${isTrial?'7 days · 1 seat · FREE':'Organization workspace · payment required before activation'}</small></div>
        ${billingFields}
        ${paymentFields}
        <div id="signup-status" class="entry-status" aria-live="polite"></div>
        <div class="access-actions"><button class="entry-primary" id="signup-submit" type="submit">${existingAccount?'Continue with this plan →':(isTrial?'Create Account →':'Create Account & Submit Payment →')}</button><button class="entry-ghost" type="button" id="signup-back">Back</button></div>
      </form>
    </div>`;
    document.body.appendChild(m);requestAnimationFrame(()=>m.classList.add('show'));
    const close=()=>m.remove();
    m.querySelector('.modal-close')?.addEventListener('click',close);
    m.querySelector('#signup-back')?.addEventListener('click',()=>{m.remove();openCommercialModal(isTrial?'trial':'plans')});
    m.addEventListener('click',e=>{if(e.target===m)close()});
    m.querySelector('#signup-view-password')?.addEventListener('click',()=>{
      const input=m.querySelector('#signup-password');
      const btn=m.querySelector('#signup-view-password');
      if(!input||!btn)return;
      const show=input.type==='password';
      input.type=show?'text':'password';
      btn.textContent=show?'Hide':'Show';
      btn.setAttribute('aria-pressed',show?'true':'false');
      input.focus();
    });
    if(!isTrial){
      const docs=[...m.querySelectorAll('input[name="billingDoc"]')],details=m.querySelector('#signup-billing-details'),branch=m.querySelector('#billing-branch-wrap');
      const syncBilling=()=>{if(details)details.hidden=!docs.some(x=>x.checked)};
      docs.forEach(x=>x.addEventListener('change',syncBilling));syncBilling();
      m.querySelectorAll('input[name="billingType"]').forEach(x=>x.addEventListener('change',()=>{if(branch)branch.hidden=x.value!=='JURISTIC'||!x.checked;}));
    }
    async function signupApprovalCall_(action,payload,session){
      const url=String(C.SIGNUP_APPROVAL_URL||'').trim();
      if(!url) throw new Error('Signup approval service is not configured yet.');
      const token=session?.access_token;
      if(!token) throw new Error('Your secure session is missing. Please sign in again.');
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),25000);
      try{
        const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify(Object.assign({action},payload||{})),signal:controller.signal});
        const raw=await r.text();let data={};try{data=raw?JSON.parse(raw):{}}catch(_){data={}};
        if(!r.ok||!data.ok) throw new Error(data.error||`Signup approval service failed (${r.status||'unknown'}).`);
        return data;
      }catch(err){
        if(err?.name==='AbortError') throw new Error('Payment submission timed out. Please try again.');
        throw err;
      }finally{clearTimeout(timer)}
    }

    let createdOrderNo='';
    let createdSession=null;
    async function uploadPaymentProof_(orderNo,file,session){
      if(!file) return null;
      if(file.size>8*1024*1024) throw new Error('Payment proof must be 8 MB or smaller.');
      const prepared=await signupApprovalCall_('prepare_upload',{order_number:orderNo,file_name:file.name,content_type:file.type||'application/octet-stream'},session);
      const up=await sb.storage.from('payment-proofs').uploadToSignedUrl(prepared.path,prepared.token,file);
      if(up.error) throw new Error(up.error.message||'Payment proof upload failed.');
      return {path:prepared.path,file_name:file.name,content_type:file.type||'application/octet-stream'};
    }

    m.querySelector('#kolIdsSignupForm')?.addEventListener('submit',async e=>{
      e.preventDefault();
      const status=m.querySelector('#signup-status'), submit=m.querySelector('#signup-submit');
      const email=String(m.querySelector('#signup-email')?.value||'').trim().toLowerCase();
      const name=String(m.querySelector('#signup-name')?.value||'').trim();
      const company=String(m.querySelector('#signup-company')?.value||'').trim();
      const password=String(m.querySelector('#signup-password')?.value||'');
      const set=(msg,type='busy')=>{if(status){status.className='entry-status '+type;status.textContent=msg}};
      let billing=null;
      let payment=null;
      if(!isTrial){
        const documents=[...m.querySelectorAll('input[name="billingDoc"]:checked')].map(x=>x.value);
        const billingType=String(m.querySelector('input[name="billingType"]:checked')?.value||'INDIVIDUAL');
        const legalName=String(m.querySelector('#billing-legal-name')?.value||'').trim();
        const taxId=String(m.querySelector('#billing-tax-id')?.value||'').trim();
        const branch=String(m.querySelector('#billing-branch')?.value||'').trim();
        const phone=String(m.querySelector('#billing-phone')?.value||'').trim();
        const address=String(m.querySelector('#billing-address')?.value||'').trim();
        if(documents.length){
          if(!legalName||!phone||!address){set('Please complete the billing name, phone and billing address.','bad');return}
          if(billingType==='JURISTIC'&&(!taxId||!branch)){set('For a juristic entity, Tax ID and Branch are required.','bad');return}
          billing={documents,billingType,legalName,taxId,branch,phone,address};
        }
        const paymentDate=String(m.querySelector('#payment-date')?.value||'').trim();
        const paymentMethod=String(m.querySelector('#payment-method')?.value||'BANK_TRANSFER_KBANK').trim();
        const paymentReference=String(m.querySelector('#payment-reference')?.value||'').trim();
        const paymentProofUrl=String(m.querySelector('#payment-proof-url')?.value||'').trim();
        const paymentFile=m.querySelector('#payment-proof-file')?.files?.[0]||null;
        if(!paymentDate){set('Please enter the payment date.','bad');return}
        if(!paymentFile&&!paymentProofUrl){set('Please upload payment proof or provide a proof URL.','bad');return}
        payment={method:paymentMethod,date:paymentDate,reference:paymentReference,proof_url:paymentProofUrl};
        payment.file=paymentFile;
      }
      if(!email||!name||password.length<8){set('Please enter your email, name and an 8+ character password.','bad');return}
      submit.disabled=true;set(isTrial?'Creating your secure KOL IDS account…':'Creating your secure account and payment application…','busy');
      try{
        let session=existingAccount ? (S.session||createdSession) : createdSession;
        if(existingAccount){
          if(!session?.access_token) throw new Error('Your secure session has expired. Please sign in again.');
          set('Saving your password and continuing with this plan…','busy');
          const passwordUpdate=await sb.auth.updateUser({password});
          if(passwordUpdate.error) throw new Error(passwordUpdate.error.message||'We could not save your new password. Please try again.');
          const fresh=await sb.auth.getSession();
          if(fresh.error||!fresh.data?.session?.access_token) throw new Error('Your secure session could not be refreshed. Please sign in again.');
          session=fresh.data.session;
          S.session=session;
          if(!isTrial){
            set('Preparing your renewal…','busy');
            const renewal=await signupApprovalCall_('renewal_order',{email,name,organization_name:company,plan:code,billing},session);
            orderNo=String(renewal.order?.order_number||'');
            if(!orderNo) throw new Error('We could not create the renewal order. Please try again.');
            createdOrderNo=orderNo;
            createdSession=session;
          }
        }
        if(!isTrial && orderNo && session){
          set(`Preparing payment submission for ${orderNo}…`,'busy');
        }else{
          const endpoint=String(C.CLIENT_SIGNUP_URL||'').trim();
          if(!endpoint) throw new Error('Account service is not configured yet.');
          const controller=new AbortController();
          const timer=setTimeout(()=>controller.abort(),20000);
          let r;
          try{
            const headers={'Content-Type':'application/json'};
            if(existingAccount && session?.access_token) headers.Authorization=`Bearer ${session.access_token}`;
            r=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify({email,password:existingAccount?'':password,name,organization_name:company,plan:code,billing}),signal:controller.signal});
          }catch(fetchErr){
            if(fetchErr?.name==='AbortError') throw new Error('Account creation timed out. Please try again.');
            throw new Error('Unable to reach the account service. Please check your connection and try again.');
          }finally{clearTimeout(timer)}
          const raw=await r.text();let data={};try{data=raw?JSON.parse(raw):{}}catch(_){data={}}
          if(!r.ok||!data.ok){
            // An existing account is expected when a customer returns after an expired trial.
            // For paid plans, authenticate that existing account and retry the same provisioning
            // request with the authenticated session so a new organization/account is never created.
            throw new Error(data.error||`Account creation failed (${r.status||'unknown'}). Please try again.`);
          }else{
            orderNo=String(data.order?.order_number||'');
            if(!isTrial&&!orderNo) throw new Error('Account was created but no order number was returned. Please contact support before paying again.');
            if(existingAccount){
              session=S.session||session;
              if(!session?.access_token) throw new Error('Your secure session has expired. Please sign in again.');
            }else{
              const login=await sb.auth.signInWithPassword({email,password});
              if(login.error) throw login.error;
              session=login.data?.session||null;
            }
            createdOrderNo=orderNo;createdSession=session;
          }
        }
        if(isTrial){
          set('Account created. Trial activated. Opening your workspace…','good');
          await boot();
          return;
        }
        const proofFile=payment?.file||null;
        if(proofFile){
          set('Uploading payment proof securely…','busy');
          const uploaded=await uploadPaymentProof_(orderNo,proofFile,session);
          payment.proof_path=uploaded.path;
          delete payment.file;
        }else{delete payment.file}
        set('Submitting payment for review…','busy');
        const result=await signupApprovalCall_('submit_payment',{order_number:orderNo,payment},session);
        set(`Upgrade complete. Your ${planLabel(code)} plan is now active.`,'good');
        submit.textContent='Upgrade completed ✓';
        submit.disabled=true;
        // The customer is already authenticated. No logout, no second sign-in,
        // and no extra confirmation page: open the renewed workspace directly.
        setTimeout(()=>launchWorkspace(),450);
      }catch(err){
        set(err.message||'Could not submit the account application.','bad');
        submit.disabled=false;
        if(createdOrderNo) submit.textContent='Retry Payment Submission →';
      }
    });
  }
  function closeCommercialModal(){let m=document.getElementById('kolIdsCommercialModal');if(m)m.remove();}
  function openCommercialModal(mode='trial'){
    closeCommercialModal();
    const m=document.createElement('div');m.id='kolIdsCommercialModal';m.className='commercial-modal';
    m.innerHTML=`<div class="commercial-modal-card" role="dialog" aria-modal="true" aria-labelledby="commercial-modal-title">
      <div class="commercial-modal-head">
        <div><span class="modal-kicker">KOL IDS · ORGANIZATION WORKSPACE</span>
        <h2 id="commercial-modal-title">${mode==='trial'?'Choose how you want to start':'Choose a KOL IDS plan'}</h2>
        <p>${mode==='trial'?'Start with a 7 day trial for 1 user, then upgrade the same organization workspace when ready.':'Your plan controls the number of user seats available in the organization workspace. Seat entitlement is verified from cloud data.'}</p></div>
        <button type="button" class="modal-close" aria-label="Close">×</button>
      </div>
      <div class="commercial-plan-grid commercial-plan-grid-four">
        ${mode==='trial'?`<article class="commercial-plan trial trial-primary"><span>FREE TRIAL</span><h3>7 Day Trial</h3><strong>FREE</strong><p>1 user · organization workspace.</p><small>Supabase Auth account + cloud workspace. No customer access code.</small><button type="button" class="modal-cta trial-cta trial-modal-cta" data-trial="1">Start Free Trial →</button></article>`:''}
        <article class="commercial-plan"><span>SELECTED PLAN</span><h3>3 Months</h3><p>1 user · Flexible starting point.</p><small>Focused teams can start with a clear workspace and a lower commitment.</small><button type="button" class="modal-cta" data-order="3 Months">OPEN ORDER →</button></article>
        <article class="commercial-plan"><span>SELECTED PLAN</span><h3>6 Months</h3><p>2 users · More room to collaborate.</p><small>Built for growing teams that want more time to build and optimize.</small><button type="button" class="modal-cta" data-order="6 Months">OPEN ORDER →</button></article>
        <article class="commercial-plan featured"><span>SELECTED PLAN</span><h3>12 Months</h3><p>3 users · Best value.</p><small>Continuous access for teams that want the full year to build, learn and optimize.</small><button type="button" class="modal-cta" data-order="12 Months">OPEN ORDER →</button></article>
      </div>
    </div>`;
    document.body.appendChild(m);requestAnimationFrame(()=>m.classList.add('show'));
    m.querySelector('.modal-close')?.addEventListener('click',closeCommercialModal);
    m.addEventListener('click',e=>{if(e.target===m)closeCommercialModal()});
    m.querySelector('[data-trial]')?.addEventListener('click',()=>openSignupModal('TRIAL_7'));
    m.querySelectorAll('[data-order]').forEach(b=>b.addEventListener('click',()=>openOrderForm(b.dataset.order||'')));
  }

  document.getElementById('run-demo')?.addEventListener('click',()=>renderEntryDemo());
  const calcExposure=()=>{const b=Math.max(0,Number(document.getElementById('entry-budget')?.value||0));const r=Math.max(0,Math.min(100,Number(document.getElementById('entry-risk')?.value||0)));const e=b*r/100;const f=new Intl.NumberFormat('en-US',{maximumFractionDigits:0});const out=document.getElementById('entry-exposure');const ass=document.getElementById('entry-assumption');if(out)out.textContent='THB '+f.format(e);if(ass)ass.textContent=r.toFixed(0)+'%';};
  ['entry-budget','entry-risk'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcExposure)); calcExposure(); renderEntryDemo();

  document.getElementById('auth').onsubmit=async e=>{
    e.preventDefault();
    if(!sb){setStatus('Supabase is not configured.','bad');return;}
    if(window.__KOL_IDS_ENTRY_BUSY__)return;
    const userEmail=String(email?.value||'').trim().toLowerCase();
    const userPassword=String(password?.value||'');
    if(!userEmail||!userEmail.includes('@')){setStatus('Enter a valid account Email.','bad');email?.focus();return;}
    if(!userPassword){setStatus('Enter your Password.','bad');password?.focus();return;}
    window.__KOL_IDS_ENTRY_BUSY__=true;
    setBusy(true,'Signing in…');
    setStatus('Verifying Email + Password with Supabase Auth…','busy');
    try{
      const result=await sb.auth.signInWithPassword({email:userEmail,password:userPassword});
      if(result.error)throw result.error;
      S.session=result.data.session;
      // If the customer was redirected here because the email already exists,
      // resume the paid-plan order after successful sign-in instead of opening
      // the workspace immediately. This keeps the existing account and avoids
      // creating a duplicate account/order.
      let pendingPlan='';
      try{pendingPlan=String(sessionStorage.getItem('kolids_pending_paid_plan')||'').trim();sessionStorage.removeItem('kolids_pending_paid_plan');}catch(_){ }
      if(pendingPlan && /^PLAN_(3M|6M|12M)$/.test(pendingPlan)){
        openSignupModal(pendingPlan,{existingAccount:true});
        return;
      }
      // Public product page stays at /KOLIDS. After successful sign-in,
      // move the authenticated user into the private 7-Step workspace.
      window.location.assign('/KOLIDSworkspace');
    }catch(x){
      setStatus(x.message||'Authentication failed. Check your Email and Password.','bad');
      setBusy(false);
      window.__KOL_IDS_ENTRY_BUSY__=false;
    }
  };
}
function renderEntryDemo(){const host=document.getElementById('demo-result');if(!host)return;const data=[['Creator A',92,88,94,'STRONG CONSIDER','High campaign fit + strong commercial efficiency + high evidence confidence.'],['Creator B',87,73,82,'CONSIDER','Strong audience/content alignment, but efficiency evidence is less certain.'],['Creator C',76,91,68,'REVIEW','Commercially attractive, but fit evidence needs additional validation.'],['Creator D',61,59,74,'NOT PRIORITY','Lower campaign fit and weaker efficiency signal.']];host.innerHTML=`<div class="demo-logic"><div><span>DECISION SIGNAL</span><b>Fit + Efficiency</b></div><div><span>EVIDENCE</span><b>Weighted</b></div><div><span>CONFIDENCE</span><b>Separate</b></div><div><span>OUTPUT</span><b>Action</b></div></div><p class="demo-explain">The score is not the recommendation by itself. KOL IDS combines decision signals, evidence quality, confidence and risk to explain what should happen next.</p>${data.map(x=>`<div class="demo-row"><strong>${x[0]}</strong><span>${x[1]} Fit</span><span>${x[2]} Eff.</span><span>${x[3]} Conf.</span><b>${x[4]}</b></div><div class="demo-why">${x[5]}</div>`).join('')}<div class="demo-point"><b>The point:</b>&nbsp; KOL IDS does not only rank creators. It explains the decision.</div>`;}

async function boot(){
  if(!sb){auth('Supabase is not configured.');return}
  const {data:{session}}=await sb.auth.getSession();
  S.session=session;
  // /KOLIDS is ALWAYS the public product / pricing / trial / sign-in page.
  // Never redirect to the workspace just because a session already exists.
  // The workspace opens only after the user explicitly completes Sign in.
  auth();
  return;
  try{
    const r=await sb.rpc('bootstrap_workspace',{p_name:null});
    if(r.error)throw r.error;
    const ctx=r.data||{};
    if(!ctx.access_granted){
      const reason=String(ctx.access_reason||'NO_ACTIVE_SUBSCRIPTION');
      root.innerHTML=`<div class="entry-page"><div class="entry-shell"><div class="entry-heading"><span class="entry-eyebrow">KOL IDS™ · ACCESS CONTROL</span><h1>Account verified · workspace access is not active yet</h1><p>${esc(reason==='PAYMENT_PENDING'?'Your account is ready. Complete payment and wait for payment approval; your same account and organization will then open the workspace.':reason==='SUBSCRIPTION_EXPIRED'?'Your subscription has expired. Renew the organization plan to continue analysis.':'Your account does not currently have an active KOL IDS subscription.')}</p><div class="access-actions"><button class="entry-primary" id="go-login" type="button">Back to Login</button><button class="entry-ghost" id="go-home" type="button">T POP Connects</button></div></div></div></div>`;
      document.getElementById('go-login')?.addEventListener('click',()=>{sb.auth.signOut();auth()});
      document.getElementById('go-home')?.addEventListener('click',()=>window.location.href='https://tpopconnects.com/');
      return;
    }
    launchWorkspace();
  }catch(e){
    root.innerHTML='';
    auth('login',e.message||'We could not verify workspace access. Please sign in again.');
  }
}

async function launchWorkspace(){
  if(window.__KOL_IDS_WORKSPACE_LOADING__) return;
  if(window.location.pathname!=='/KOLIDSworkspace') window.history.replaceState({},'', '/KOLIDSworkspace');
  window.__KOL_IDS_WORKSPACE_LOADING__=true;
  if(window.__KOL_IDS_PROCESS_TIMER__)clearInterval(window.__KOL_IDS_PROCESS_TIMER__);
  if(!document.querySelector('script[data-kol-ids-app]')){
    const script=document.createElement('script');
    script.src='/app.js?v=20261004-existing-account-renewal-v2';
    script.async=false;
    script.dataset.kolIdsApp='1';
    document.body.appendChild(script);
  }
}

if(sb) sb.auth.onAuthStateChange((e,s)=>{if(e==='SIGNED_OUT'){S.session=null;auth()}});
boot();

})();

  
<style id="KOL_IDS_EXISTING_ACCOUNT_PASSWORD_V2">
#kolIdsSignupModal .signup-password-help{display:block;margin-top:7px;color:#8d9aa6;font-size:11px;line-height:1.55;max-width:760px}
#kolIdsSignupModal .signup-password-wrap input{padding-right:78px!important}
</style>
