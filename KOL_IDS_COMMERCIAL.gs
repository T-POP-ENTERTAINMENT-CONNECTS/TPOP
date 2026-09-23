/**
 * KOL IDS™ — Commercial Access & Entitlement Layer
 * Customer-facing access is tied to Google Account email + an active paid license.
 * No product/version identifiers are shown in the customer UI.
 *
 * Commercial pricing is intentionally aligned with the canonical V5 license model:
 * Account entitlement is derived ONLY from the selected commercial plan.
 * 3 MONTHS      — 1 Google Account
 * 6 MONTHS      — 2 Google Accounts
 * 12 MONTHS     — 3 Google Accounts
 * 7-DAY TRIAL   FREE — 1 Google Account; report export locked
 *
 * KOL IDS is sold as one enterprise-grade product; duration is the commercial
 * dimension. This prevents the access layer and the license layer from exposing
 * incompatible plan names, prices, and entitlements.
 *
 * Amount is a commercial entitlement signal; the payment itself is still verified
 * by the seller before an account is activated.
 */
function KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(planName){
  var raw=String(planName||'').trim().toUpperCase();
  if(raw==='3 MONTHS'||raw==='3_MONTHS') return 1;
  if(raw==='6 MONTHS'||raw==='6_MONTHS') return 2;
  if(raw==='1 YEAR'||raw==='1_YEAR'||raw==='12 MONTHS'||raw==='12_MONTHS'||raw==='ANNUAL') return 3;
  if(raw==='7-DAY FREE TRIAL'||raw==='TRIAL') return 1;
  return 0;
}

var KOL_IDS_COMMERCIAL_CONFIG = {
  CURRENCY: KOL_IDS_PRICING_AUTHORITY_().CURRENCY,
  DEMO_PROPERTY: 'KOL_IDS_COMMERCIAL_DEMO',
  PRICING: (function(){
    var a=KOL_IDS_PRICING_AUTHORITY_().PLANS;
    var features=['decision','shortlist','report','attribution','learning','benchmark','portfolio','multi_brand','priority'];
    var out={};
    Object.keys(a).forEach(function(k){var p=a[k];var seats=KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(p.name)||1;out[k]={key:p.key,name:p.name,months:p.months,price:p.price,maxBrands:9999,maxCampaigns:9999,maxCreatorsPerCampaign:100,maxAccounts:seats,features:features.slice()};});
    return out;
  })()
};

function KOL_IDS_COMMERCIAL_PACKAGES() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_PACKAGES');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return Object.keys(KOL_IDS_COMMERCIAL_CONFIG.PRICING).map(function(k){
    var p=KOL_IDS_COMMERCIAL_CONFIG.PRICING[k];
    return {key:p.key,name:p.name,months:p.months,price:p.price,currency:KOL_IDS_COMMERCIAL_CONFIG.CURRENCY,maxAccounts:p.maxAccounts||1,maxBrands:p.maxBrands,maxCampaigns:p.maxCampaigns,maxCreatorsPerCampaign:p.maxCreatorsPerCampaign,features:p.features.slice()};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_PACKAGES', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_PACKAGES', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_(planName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var raw=String(planName||'').trim().toUpperCase();
  if(raw==='3 MONTHS'||raw==='3_MONTHS') return KOL_IDS_COMMERCIAL_CONFIG.PRICING.THREE_MONTHS;
  if(raw==='6 MONTHS'||raw==='6_MONTHS') return KOL_IDS_COMMERCIAL_CONFIG.PRICING.SIX_MONTHS;
  if(raw==='1 YEAR'||raw==='1_YEAR'||raw==='12 MONTHS'||raw==='12_MONTHS'||raw==='ANNUAL') return KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR;
  return null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_(amount) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var n=Number(amount);
  var packs=KOL_IDS_COMMERCIAL_CONFIG.PRICING;
  var keys=Object.keys(packs);
  for(var i=0;i<keys.length;i++) if(n===Number(packs[keys[i]].price)) return packs[keys[i]];
  return null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_COMMERCIAL_FIND_LICENSE_BY_EMAIL_(email) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_FIND_LICENSE_BY_EMAIL_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var e=String(email||'').trim().toLowerCase();
  if(!e) return null;
  try {
    var ss=KOL_IDS_CORE_salesSS_();
    var sh=ss.getSheetByName(KOL_IDS.SHEETS.LICENSES);
    if(!sh || sh.getLastRow()<2) return null;
    var headers=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
    var rows=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
    var idx={}; headers.forEach(function(h,i){idx[h]=i;});
    var candidates=rows.filter(function(r){
      return String(r[idx['Email']]||'').trim().toLowerCase()===e && String(r[idx['Status']]||'').toUpperCase()==='ACTIVE';
    });
    if(!candidates.length) return null;
    candidates.sort(function(a,b){return new Date(b[idx['Expires At']]||0).getTime()-new Date(a[idx['Expires At']]||0).getTime();});
    var r=candidates[0], planName=String(r[idx['Plan']]||'');
    var p=KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_(planName);
    if(!p){
      // Legacy/unknown plans remain usable only through the canonical annual
      // entitlement, preserving access without inventing a third product tier.
      p=KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR;
      planName=p.name;
    }
    var exp=new Date(r[idx['Expires At']]);
    if(isNaN(exp.getTime()) || exp.getTime()<=Date.now()) return null;
    return {allowed:true,source:'PAID',email:e,licenseId:String(r[idx['License ID']]||''),plan:p.key,planName:p.name,price:p.price,currency:KOL_IDS_COMMERCIAL_CONFIG.CURRENCY,workspaceId:String(r[idx['Workspace ID']]||''),expiresAt:exp.toISOString(),entitlements:{maxBrands:p.maxBrands,maxCampaigns:p.maxCampaigns,maxCreatorsPerCampaign:p.maxCreatorsPerCampaign,maxAccounts:p.maxAccounts||1,features:p.features.slice()}};
  } catch(err) {
    // Do not fail open. If sales storage is unavailable, customer access is denied.
    return {allowed:false,code:'ACCESS_LOOKUP_FAILED',message:'Customer access could not be verified. Please contact support.'};
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_FIND_LICENSE_BY_EMAIL_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_FIND_LICENSE_BY_EMAIL_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_COMMERCIAL_START_TRIAL() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_START_TRIAL');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    KOL_IDS_SECURITY_ASSERT_USER_();
    var email = String(KOL_IDS_SELF_GET_USER_() || '').trim().toLowerCase();
    if (!email) throw new Error('Google Account email is required to start the free trial.');

    var name = email.split('@')[0].replace(/[._-]+/g,' ').replace(/\s+/g,' ').trim();
    name = name ? name.replace(/\b\w/g,function(c){return c.toUpperCase();}) : 'Trial Customer';

    /* If the account already owns a paid entitlement, open that workspace.
       If it already has a trial, reuse the same trial workspace rather than
       creating a second one. */
    var paid = KOL_IDS_COMMERCIAL_FIND_LICENSE_BY_EMAIL_(email);
    var client = null;
    if (paid && paid.allowed) {
      client = {clientId:'',clientName:paid.planName||'KOL IDS Workspace',spreadsheetId:paid.workspaceId,plan:paid.planName||paid.plan,expiresAt:paid.expiresAt||'',maxAccounts:paid.entitlements&&paid.entitlements.maxAccounts||1,accessType:'PAID',licenseId:paid.licenseId||''};
    } else {
      client = KOL_IDS_SYSTEM_CREATE_TRIAL_CLIENT_(name,email);
    }

    if (!client || !client.spreadsheetId) throw new Error('Trial workspace could not be created.');
    var session = {
      clientId: String(client.clientId||''),
      clientName: String(client.clientName||name),
      spreadsheetId: String(client.spreadsheetId),
      status: 'ACTIVE',
      plan: String(client.plan||'TRIAL'),
      googleEmail: email,
      expiresAt: String(client.expiresAt||''),
      maxAccounts: Number(client.maxAccounts||1),
      accountEmails: client.accountEmails||[],
      accessType: String(client.accessType||'TRIAL'),
      licenseId: String(client.licenseId||''),
      signedInAt: new Date().toISOString()
    };
    KOL_IDS_SAAS_SCOPE_SET_('SESSION', JSON.stringify(session));
    KOL_IDS_SAAS_SCOPE_SET_('CLIENT_ID', String(client.clientId||''));
    KOL_IDS_SAAS_SCOPE_SET_('WORKSPACE', String(client.spreadsheetId));
    KOL_IDS_SECURITY_BIND_WORKSPACE_(String(client.spreadsheetId), email);
    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(String(client.spreadsheetId));

    return {
      success:true,
      trial: String(client.accessType||'TRIAL').toUpperCase()==='TRIAL',
      clientId:String(client.clientId||''),
      clientName:String(client.clientName||name),
      workspaceId:String(client.spreadsheetId),
      plan:String(client.plan||'TRIAL'),
      accessType:String(client.accessType||'TRIAL'),
      expiresAt:String(client.expiresAt||''),
      message:String(client.accessType||'TRIAL').toUpperCase()==='TRIAL'
        ? '7-day free trial started. Opening your workspace.'
        : 'Paid workspace found. Opening your workspace.'
    };
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_START_TRIAL', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_START_TRIAL', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_COMMERCIAL_TRIAL_POLICY(){return {days:7,price:0,maxAccounts:1,reportExport:false};}
function KOL_IDS_COMMERCIAL_TRIAL_INFO(){var props=PropertiesService.getScriptProperties();var url=props.getProperty('KOL_IDS_CORE_TRIAL_FORM_URL')||props.getProperty('KOL_IDS_CORE_PUBLIC_SALES_FORM_URL_V10')||props.getProperty((typeof KOL_IDS!=='undefined'&&KOL_IDS.FORM_URL)?KOL_IDS.FORM_URL:'KOL_IDS_CORE_FORM_URL')||'';return {success:true,days:7,maxAccounts:1,reportExport:false,url:url,price:0,currency:'THB'};}

/** Returns the canonical commercial form URL, with each paid plan preselected when possible. */
function KOL_IDS_COMMERCIAL_PLAN_FORM_URLS(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_PLAN_FORM_URLS');
  var started=Date.now();
  try{
    var info=KOL_IDS_COMMERCIAL_TRIAL_INFO();
    var generic=String(info&&info.url||'').trim(), urls={}, trialUrls={}, trialUrl='';
    if(!generic)return {success:true,urls:urls,trialUrls:trialUrls,trialUrl:'',genericUrl:''};
    try{
      var form=FormApp.openByUrl(generic), byTitle={};
      form.getItems().forEach(function(item){byTitle[String(item.getTitle()||'')]=item;});
      var requestItem=byTitle['Request Type'], planItem=byTitle['Plan'], accountsItem=byTitle['Google Accounts Needed'];
      var customerNameItem=byTitle['Customer Name'], emailItem=byTitle['Google Account Email'], clientIdItem=byTitle['Existing Client ID'];
      var paymentStatusItem=byTitle['Payment Status'], billingRequestItem=byTitle['Billing Documents Requested'];
      var sessionRaw=KOL_IDS_SAAS_SCOPE_GET_('SESSION');
      var session=null;try{session=sessionRaw?JSON.parse(sessionRaw):null;}catch(ignoreSessionPrefill){}
      var prefillEmail=String((session&&session.googleEmail)||'').trim().toLowerCase();
      if(!prefillEmail){try{prefillEmail=String(KOL_IDS_SELF_GET_USER_()||'').trim().toLowerCase();}catch(ignoreEmailPrefill){}}
      var prefillName=String((session&&session.clientName)||'').trim();
      var prefillClientId=String((session&&session.clientId)||'').trim();
      var plans=KOL_IDS_COMMERCIAL_CONFIG.PRICING;

      // Build one canonical 7-day Trial URL. Trial is not a paid duration;
      // the 3/6/12 month choices remain paid subscription choices.
      try{
        var trialResponse=form.createResponse();
        if(customerNameItem&&customerNameItem.getType()===FormApp.ItemType.TEXT&&prefillName)trialResponse.withItemResponse(customerNameItem.asTextItem().createResponse(prefillName));
        if(emailItem&&emailItem.getType()===FormApp.ItemType.TEXT&&prefillEmail)trialResponse.withItemResponse(emailItem.asTextItem().createResponse(prefillEmail));
        if(clientIdItem&&clientIdItem.getType()===FormApp.ItemType.TEXT&&prefillClientId)trialResponse.withItemResponse(clientIdItem.asTextItem().createResponse(prefillClientId));
        if(requestItem&&requestItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(requestItem.asListItem().createResponse('7-Day Free Trial'));
        if(planItem&&planItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(planItem.asListItem().createResponse('7-Day Free Trial — FREE'));
        if(accountsItem&&accountsItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(accountsItem.asListItem().createResponse('1'));
        if(paymentStatusItem&&paymentStatusItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(paymentStatusItem.asListItem().createResponse('Trial / Not paying yet'));
        if(billingRequestItem&&billingRequestItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(billingRequestItem.asListItem().createResponse('No — ไม่ต้องการเอกสารออกบิล'));
        trialUrl=trialResponse.toPrefilledUrl();
      }catch(trialUrlErr){trialUrl='';}

      Object.keys(plans).forEach(function(k){
        var p=plans[k], response=form.createResponse();
        if(customerNameItem&&customerNameItem.getType()===FormApp.ItemType.TEXT&&prefillName)response.withItemResponse(customerNameItem.asTextItem().createResponse(prefillName));
        if(emailItem&&emailItem.getType()===FormApp.ItemType.TEXT&&prefillEmail)response.withItemResponse(emailItem.asTextItem().createResponse(prefillEmail));
        if(clientIdItem&&clientIdItem.getType()===FormApp.ItemType.TEXT&&prefillClientId)response.withItemResponse(clientIdItem.asTextItem().createResponse(prefillClientId));
        if(requestItem&&requestItem.getType()===FormApp.ItemType.LIST)response.withItemResponse(requestItem.asListItem().createResponse('Paid Subscription'));
        if(planItem&&planItem.getType()===FormApp.ItemType.LIST){
          var choice=String(p.name||'')+' — THB '+Number(p.price||0).toLocaleString('en-US')+' — '+Number(p.maxAccounts||1)+' Google Account'+(Number(p.maxAccounts||1)===1?'':'s');
          response.withItemResponse(planItem.asListItem().createResponse(choice));
        }
        if(accountsItem&&accountsItem.getType()===FormApp.ItemType.LIST)response.withItemResponse(accountsItem.asListItem().createResponse(String(p.maxAccounts||1)));
        urls[p.key]=response.toPrefilledUrl();

        // Trial uses the same canonical sales form, but preselects the chosen
        // package while keeping Request Type = Trial and payment = not required.
        var trialResponse=form.createResponse();
        if(customerNameItem&&customerNameItem.getType()===FormApp.ItemType.TEXT&&prefillName)trialResponse.withItemResponse(customerNameItem.asTextItem().createResponse(prefillName));
        if(emailItem&&emailItem.getType()===FormApp.ItemType.TEXT&&prefillEmail)trialResponse.withItemResponse(emailItem.asTextItem().createResponse(prefillEmail));
        if(clientIdItem&&clientIdItem.getType()===FormApp.ItemType.TEXT&&prefillClientId)trialResponse.withItemResponse(clientIdItem.asTextItem().createResponse(prefillClientId));
        if(requestItem&&requestItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(requestItem.asListItem().createResponse('7-Day Free Trial'));
        if(planItem&&planItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(planItem.asListItem().createResponse(choice));
        if(accountsItem&&accountsItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(accountsItem.asListItem().createResponse(String(p.maxAccounts||1)));
        if(paymentStatusItem&&paymentStatusItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(paymentStatusItem.asListItem().createResponse('Trial / Not paying yet'));
        if(billingRequestItem&&billingRequestItem.getType()===FormApp.ItemType.LIST)trialResponse.withItemResponse(billingRequestItem.asListItem().createResponse('No — ไม่ต้องการเอกสารออกบิล'));
        trialUrls[p.key]=trialResponse.toPrefilledUrl();
      });
    }catch(formErr){urls={};trialUrls={};trialUrl='';}
    return {success:true,urls:urls,trialUrls:trialUrls,trialUrl:trialUrl,genericUrl:generic};
  }catch(e){KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_PLAN_FORM_URLS',e);throw e;}
  finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_PLAN_FORM_URLS',Date.now()-started);}
}


function KOL_IDS_COMMERCIAL_GET_ACCESS_(email) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_GET_ACCESS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var e=String(email||'').trim().toLowerCase();
  if(!e) return {allowed:false,code:'NO_ACCOUNT',message:'Please sign in with a Google Account.'};
  // Explicit demo access is checked first so the customer can test the product
  // even before the seller has configured the paid-license storage.
  var demoRaw=PropertiesService.getUserProperties().getProperty(KOL_IDS_COMMERCIAL_CONFIG.DEMO_PROPERTY);
  if(demoRaw) {
    var demoPlan=KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_(demoRaw) || KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR;
    return {allowed:true,source:'DEMO',email:e,licenseId:'DEMO',plan:demoPlan.key,planName:demoPlan.name,price:0,currency:KOL_IDS_COMMERCIAL_CONFIG.CURRENCY,expiresAt:'',workspaceId:'',entitlements:{maxBrands:demoPlan.maxBrands,maxCampaigns:demoPlan.maxCampaigns,maxCreatorsPerCampaign:demoPlan.maxCreatorsPerCampaign,features:demoPlan.features.slice()},demo:true};
  }
  var paid=KOL_IDS_COMMERCIAL_FIND_LICENSE_BY_EMAIL_(e);
  if(paid && paid.allowed) return paid;
  if(paid && paid.code==='ACCESS_LOOKUP_FAILED') return paid;
  return {allowed:false,code:'NO_ACTIVE_LICENSE',message:'This Google Account does not have an active KOL IDS plan. Please activate a paid plan first.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_GET_ACCESS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_GET_ACCESS_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_COMMERCIAL_RECONCILE_TRIAL_SESSION_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_RECONCILE_TRIAL_SESSION_');
  var started=Date.now();
  try{
    var props=PropertiesService.getUserProperties();
    var raw=KOL_IDS_SAAS_SCOPE_GET_('SESSION'),session=raw?JSON.parse(raw):null;
    if(!session||!session.clientId||!session.spreadsheetId||String(session.status||'').toUpperCase()!=='ACTIVE')return null;
    if(String(session.accessType||'').toUpperCase()!=='TRIAL')return session;
    var email=String(session.googleEmail||'').trim().toLowerCase();
    if(!email)return session;
    var paid=KOL_IDS_COMMERCIAL_FIND_LICENSE_BY_EMAIL_(email);
    if(!paid||!paid.allowed||!paid.licenseId)return session;

    // A trial is converted only when the paid license belongs to the same
    // customer workspace that was upgraded. This prevents one paid license
    // from unlocking an unrelated trial workspace for the same email.
    var sameWorkspace=false;
    if(paid.workspaceId && String(paid.workspaceId)===String(session.spreadsheetId)) sameWorkspace=true;
    if(!sameWorkspace){
      try{
        var dir=KOL_IDS_SYSTEM_ensureClientDirectory_(),last=dir.getLastRow(),width=Math.max(13,dir.getLastColumn());
        if(last>=2){
          var h=dir.getRange(1,1,1,width).getValues()[0].map(String),idx={};h.forEach(function(x,i){idx[x]=i;});
          var rows=dir.getRange(2,1,last-1,width).getValues();
          for(var i=0;i<rows.length;i++){
            if(String(rows[i][idx['Client ID']]||'').trim()!==String(session.clientId))continue;
            if(String(rows[i][idx['Spreadsheet ID']]||'').trim()!==String(session.spreadsheetId))continue;
            if(String(rows[i][idx['Status']]||'').toUpperCase()!=='ACTIVE')continue;
            if(String(rows[i][idx['Access Type']]||'').toUpperCase()!=='PAID')continue;
            var contact=idx['Contact Email']!=null?String(rows[i][idx['Contact Email']]||'').trim().toLowerCase():'';
            var accounts=idx['Account Emails']!=null?String(rows[i][idx['Account Emails']]||'').toLowerCase().split(',').map(function(x){return x.trim();}).filter(Boolean):[];
            if(contact===email||accounts.indexOf(email)>=0){sameWorkspace=true;break;}
          }
        }
      }catch(ignoreDirectoryLookup){}
    }
    if(!sameWorkspace)return session;

    // A converted trial keeps the exact same workspace/data and credentials.
    // Bind the canonical license to that workspace before switching the
    // server-side session from TRIAL to PAID.
    if(!paid.workspaceId || String(paid.workspaceId)!==String(session.spreadsheetId)){
      if(typeof KOL_IDS_CORE_bindLicenseWorkspace_==='function'){
        KOL_IDS_CORE_bindLicenseWorkspace_(paid.licenseId,email,String(session.spreadsheetId));
        paid.workspaceId=String(session.spreadsheetId);
      }
    }
    var p=KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_(paid.planName||paid.plan)||KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR;
    session.accessType='PAID';
    session.licenseId=String(paid.licenseId||'');
    session.plan=p.name;
    session.expiresAt=String(paid.expiresAt||'');
    session.maxAccounts=Number(paid.entitlements&&paid.entitlements.maxAccounts||p.maxAccounts||1);
    session.status='ACTIVE';
    props.setProperty(sessionKey,JSON.stringify(session));
    return session;
  }catch(e){
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_RECONCILE_TRIAL_SESSION_',e);
    return null;
  }finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_RECONCILE_TRIAL_SESSION_',Date.now()-started);}
}

function KOL_IDS_COMMERCIAL_ASSERT_SESSION_LICENSE_(session) {
  if (!session || !session.clientId || !session.spreadsheetId || String(session.status || '').toUpperCase() !== 'ACTIVE') {
    throw new Error('KOL IDS™: Invalid customer session.');
  }
  var sessionExp = new Date(session.expiresAt || '');
  var sessionMs = sessionExp.getTime();
  if (!isFinite(sessionMs)) throw new Error('KOL IDS™: Customer session expiry is invalid.');

  // Trial sessions are self-contained but are still checked on every request.
  if (String(session.accessType || '').toUpperCase() === 'TRIAL') return sessionMs;

  var licenseId = String(session.licenseId || '').trim();
  if (!licenseId) throw new Error('KOL IDS™: Paid session has no License ID.');
  var sales = KOL_IDS_CORE_salesSS_();
  var sh = sales.getSheetByName(KOL_IDS.SHEETS.LICENSES);
  var lic = sh ? KOL_IDS_CORE_findLicense_(licenseId, String(session.googleEmail || '').trim().toLowerCase()) : null;
  if (!lic) throw new Error('KOL IDS™: License not found.');
  var status = String(lic.row[7] || '').trim().toUpperCase();
  if (status !== 'ACTIVE') throw new Error('KOL IDS™: License is not active.');
  var canonicalExp = new Date(lic.row[6]).getTime();
  if (!isFinite(canonicalExp)) throw new Error('KOL IDS™: License expiry is invalid.');
  if (canonicalExp <= Date.now()) throw new Error('KOL IDS™: License expired. Please renew or activate a paid plan.');
  if (String(lic.row[4] || '') !== String(session.spreadsheetId)) throw new Error('KOL IDS™: Workspace binding mismatch.');

  // Never allow a stale session to extend entitlement beyond the canonical license.
  return Math.min(sessionMs, canonicalExp);
}

function KOL_IDS_COMMERCIAL_GET_ACCESS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_GET_ACCESS');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var identity = KOL_IDS_SECURITY_ASSERT_USER_();
  // Once Client ID + Access Key authentication has established the active
  // SaaS session, that session is the entitlement source. Do not fall through
  // to an email-only license lookup when ActiveUser email is unavailable.
  var props = PropertiesService.getUserProperties();
  var rawSession = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
  try {
    var session = rawSession ? JSON.parse(rawSession) : null;
    if (session && session.clientId && session.spreadsheetId && String(session.status || '').toUpperCase() === 'ACTIVE') {
      // If an active trial was upgraded, reconcile the existing session in-place
      // so the customer can unlock the report without losing the trial workspace.
      if(String(session.accessType||'').toUpperCase()==='TRIAL') session=KOL_IDS_COMMERCIAL_RECONCILE_TRIAL_SESSION_()||session;
      // Canonical server-side entitlement check on EVERY request. Never trust a
      // cached/session expiry alone: the Sales license row is authoritative.
      var sessionExpiry = KOL_IDS_COMMERCIAL_ASSERT_SESSION_LICENSE_(session);
      if (sessionExpiry <= Date.now()) {
        try { KOL_IDS_SAAS_SCOPE_DEL_('SESSION'); } catch (ignoreExpiredCommercialSession) {}
        throw new Error('KOL IDS™: Customer session has expired. Please renew or activate a paid plan.');
      }
      if(String(session.accessType||'').toUpperCase()==='TRIAL') return {allowed:true,source:'CLIENT_SESSION',email:String(session.googleEmail||identity.email||'').trim().toLowerCase(),licenseId:'',plan:'TRIAL',planName:'7-Day Free Trial',price:0,currency:'THB',workspaceId:String(session.spreadsheetId),expiresAt:new Date(sessionExpiry).toISOString(),entitlements:{maxBrands:9999,maxCampaigns:9999,maxCreatorsPerCampaign:100,maxAccounts:1,features:['decision','shortlist','attribution','learning','benchmark','portfolio','multi_brand','priority'],reportExport:false},customerSession:true};
      var plan = KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR;
      var requestedPlan = String(session.plan || '').trim().toUpperCase();
      Object.keys(KOL_IDS_COMMERCIAL_CONFIG.PRICING).some(function(k) {
        var p = KOL_IDS_COMMERCIAL_CONFIG.PRICING[k];
        if (String(p.key).toUpperCase() === requestedPlan || String(p.name).toUpperCase() === requestedPlan) { plan = p; return true; }
        return false;
      });
      return {
        allowed: true,
        source: 'CLIENT_SESSION',
        email: String(session.googleEmail || identity.email || '').trim().toLowerCase(),
        licenseId: String(session.licenseId || ''),
        plan: plan.key,
        planName: plan.name,
        price: plan.price,
        currency: KOL_IDS_COMMERCIAL_CONFIG.CURRENCY,
        workspaceId: String(session.spreadsheetId),
        expiresAt: String(session.expiresAt || ''),
        entitlements: {maxBrands:plan.maxBrands,maxCampaigns:plan.maxCampaigns,maxCreatorsPerCampaign:plan.maxCreatorsPerCampaign,maxAccounts:plan.maxAccounts||1,features:plan.features.slice()},
        customerSession: true
      };
    }
  } catch (ignoreSession) {}

  return KOL_IDS_COMMERCIAL_GET_ACCESS_(KOL_IDS_SELF_GET_USER_());

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_GET_ACCESS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_GET_ACCESS', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Seller/admin: preview exactly what a customer receives for a paid amount.
 * This does not activate payment and does not create a license.
 */
function KOL_IDS_COMMERCIAL_QUOTE(amount) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_QUOTE');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SYSTEM_requireAdmin_();
  var p=KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_(amount);
  if(!p) throw new Error('Amount does not match a commercial plan.');
  return {success:true,plan:p.key,planName:p.name,price:p.price,currency:KOL_IDS_COMMERCIAL_CONFIG.CURRENCY,entitlements:{maxBrands:p.maxBrands,maxCampaigns:p.maxCampaigns,maxCreatorsPerCampaign:p.maxCreatorsPerCampaign,maxAccounts:p.maxAccounts||1,features:p.features.slice()}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_QUOTE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_QUOTE', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Self-test: grants a clearly-marked demo entitlement to the current Google Account.
 * It is intentionally separate from paid licensing and can be revoked immediately.
 */
function KOL_IDS_COMMERCIAL_ENABLE_SELF_TEST(planKey) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_ENABLE_SELF_TEST');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SECURITY_ASSERT_USER_();
  var email=KOL_IDS_SELF_GET_USER_();
  var requested=String(planKey||'12 Months').trim();
  var demoPlan=KOL_IDS_COMMERCIAL_PLAN_FROM_LICENSE_(requested) || KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR;
  PropertiesService.getUserProperties().setProperty(KOL_IDS_COMMERCIAL_CONFIG.DEMO_PROPERTY,demoPlan.name);
  return {success:true,source:'DEMO',email:email,access:KOL_IDS_COMMERCIAL_GET_ACCESS_(email),message:'Self-test access enabled. This is demo access and is not a paid license.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_ENABLE_SELF_TEST', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_ENABLE_SELF_TEST', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_COMMERCIAL_DISABLE_SELF_TEST() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_DISABLE_SELF_TEST');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SECURITY_ASSERT_USER_();
  PropertiesService.getUserProperties().deleteProperty(KOL_IDS_COMMERCIAL_CONFIG.DEMO_PROPERTY);
  return {success:true,source:'DEMO',message:'Self-test access disabled.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_DISABLE_SELF_TEST', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_DISABLE_SELF_TEST', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Seller helper: create a pending commercial order from a quoted amount. */
function KOL_IDS_COMMERCIAL_CREATE_ORDER(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMMERCIAL_CREATE_ORDER');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SYSTEM_requireAdmin_();
  payload=payload||{};
  var p=KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_(payload.amount);
  if(!p) throw new Error('Amount must exactly match one of the commercial plan prices.');
  var ss=KOL_IDS_CORE_salesSS_();
  var sh=KOL_IDS_CORE_ensureColumns_(ss,KOL_IDS.SHEETS.ORDERS,['Order ID','Timestamp','Customer Name','Email','Phone','Company','Order Type','Plan','Product','Amount','Currency','Slip URL','Existing License ID','Status','License ID','Customer Message','Approved At','Approved By']);
  var id='ORD-COM-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
  sh.appendRow([id,new Date(),String(payload.customerName||''),String(payload.email||'').trim().toLowerCase(),String(payload.phone||''),String(payload.company||''),'NEW',p.name,'KOL IDS',p.price,KOL_IDS_COMMERCIAL_CONFIG.CURRENCY,String(payload.slipUrl||''),'','PENDING','','','','']);
  return {success:true,orderId:id,plan:p.key,planName:p.name,amount:p.price,currency:KOL_IDS_COMMERCIAL_CONFIG.CURRENCY,status:'PENDING'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMMERCIAL_CREATE_ORDER', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMMERCIAL_CREATE_ORDER', Date.now() - __kolIdsTraceStartedAt);
  }
}
