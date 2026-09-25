/****************************************************
 * KOL IDS™ — SELF-SERVICE WORKSPACE
 * Product layer: Google-account based workspace isolation.
 * Customer workspace is authenticated by Client ID + Access Key; Google Account identity remains the execution identity.
 ****************************************************/

var KOL_IDS_SELF_ACTIVE = false;

const KOL_IDS_SELF = {
  VERSION: '3.0.0',
  WORKSPACE_PROPERTY: 'KOL_IDS_WORKSPACE_ID',
  WORKSPACE_PREFIX: 'KOL IDS™ — Workspace — '
};

function KOL_IDS_SELF_GET_USER_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_GET_USER_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  if (email) return email;

  // In a public USER_ACCESSING Web App Apps Script may legitimately expose no
  // ActiveUser email. A verified ACTIVE SaaS session is then the authoritative
  // customer identity for this request. Return the bound Google email when it
  // exists; otherwise return an empty string and let the session-aware layers
  // authorize by Client ID + Access Key + workspace ID.
  try {
    const raw = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    const session = raw ? JSON.parse(raw) : null;
    if (session && session.clientId && session.spreadsheetId && String(session.status || '').toUpperCase() === 'ACTIVE') {
      return String(session.googleEmail || '').trim().toLowerCase();
    }
  } catch (ignoreSessionIdentity) {}

  throw new Error('KOL IDS™ ต้องเข้าสู่ระบบด้วย Google Account ก่อนใช้งาน หรือใช้ Client ID + Access Key ที่ได้รับสำหรับ Workspace');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_GET_USER_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_GET_USER_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_SERVICE_BOOTSTRAP() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SERVICE_BOOTSTRAP');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SECURITY_ASSERT_USER_();
  const email = KOL_IDS_SELF_GET_USER_();
  const props = PropertiesService.getUserProperties();
  const activeSaasSessionRaw = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
  let activeSaasSession = null;
  try {
    const parsed = activeSaasSessionRaw ? JSON.parse(activeSaasSessionRaw) : null;
    if (parsed && parsed.clientId && parsed.spreadsheetId && String(parsed.status || '').toUpperCase() === 'ACTIVE') {
      if (parsed.expiresAt) {
        var sessionExp = new Date(parsed.expiresAt);
        if (!isNaN(sessionExp.getTime()) && sessionExp.getTime() <= Date.now()) {
          // Expired sessions must never become a valid bootstrap entitlement.
          try { KOL_IDS_SAAS_SCOPE_DEL_('SESSION'); } catch (ignoreExpiredSession) {}
        } else {
          activeSaasSession = parsed;
        }
      } else {
        activeSaasSession = parsed;
      }
    }
  } catch (ignoreBootstrapSession) {}
  if (!email && !activeSaasSession) throw new Error('KOL IDS™: No authenticated customer session is available.');

  /*
   * Customer Client ID + Access Key sign-in is the authoritative entitlement
   * for the SaaS workspace. Do not require a second Google-email license gate
   * after KOL_IDS_SYSTEM_SAAS_SIGN_IN has created an ACTIVE customer session.
   * The session is server-side UserProperties and is never supplied by the UI.
   */
  let access = null;
  let saasSession = null;
  try {
    const rawSession = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      if (parsed && parsed.clientId && parsed.spreadsheetId && String(parsed.status || '').toUpperCase() === 'ACTIVE') {
        if (parsed.expiresAt) {
          const sessionExp = new Date(parsed.expiresAt);
          if (!isNaN(sessionExp.getTime()) && sessionExp.getTime() <= Date.now()) {
            try { KOL_IDS_SAAS_SCOPE_DEL_('SESSION'); } catch (ignoreExpiredSession2) {}
            throw new Error('KOL IDS™: Trial or customer session has expired. Please renew or activate a paid plan.');
          }
        }
        const sessionEmail = String(parsed.googleEmail || '').trim().toLowerCase();
        if (sessionEmail && sessionEmail !== email) throw new Error('KOL IDS™: Customer session identity mismatch.');
        saasSession = parsed;
      }
    }
  } catch (sessionError) {
    if (sessionError && /identity mismatch/i.test(String(sessionError.message || sessionError))) throw sessionError;
    saasSession = null;
  }

  if (saasSession) {
    access = {
      allowed: true,
      source: 'CLIENT_SESSION',
      email: email,
      licenseId: '',
      plan: saasSession.plan || 'PROFESSIONAL',
      planName: saasSession.plan || 'Professional',
      price: 0,
      currency: 'THB',
      workspaceId: String(saasSession.spreadsheetId),
      expiresAt: String(saasSession.expiresAt || ''),
      entitlements: {
        maxBrands: 9999,
        maxCampaigns: 9999,
        maxCreatorsPerCampaign: 9999,
        features: ['decision','shortlist','report','attribution','learning','benchmark','portfolio','multi_brand','priority']
      },
      customerSession: true
    };
  } else {
    // No customer session: retain the existing commercial email entitlement gate.
    access = KOL_IDS_COMMERCIAL_GET_ACCESS_(email);
    if (!access.allowed) {
      throw new Error(access.message || 'KOL IDS access is not active for this account.');
    }
  }
  // Paid licenses already own a dedicated workspace. Bind the customer to
  // that workspace instead of silently creating a second one. Demo access
  // keeps the per-Google-account self-test workspace behavior.
  let workspaceId = String((access.source === 'CLIENT_SESSION' && access.workspaceId) || (access.source === 'PAID' && access.workspaceId) || KOL_IDS_SAAS_SCOPE_GET_('WORKSPACE') || '').trim();
  let workspaceCreated = false;
  let workspace = null;

  if (workspaceId) {
    try { workspace = SpreadsheetApp.openById(workspaceId); } catch (e) { workspace = null; }
  }

  if (!workspace) {
    const lock = LockService.getUserLock();
    lock.waitLock(30000);
    try {
      workspaceId = String(KOL_IDS_SAAS_SCOPE_GET_('WORKSPACE') || '').trim();
      if (workspaceId) {
        try { workspace = SpreadsheetApp.openById(workspaceId); } catch (e) { workspace = null; }
      }
      if (!workspace) {
        workspace = SpreadsheetApp.create(KOL_IDS_SELF.WORKSPACE_PREFIX + (email || ('Client ' + String(activeSaasSession && activeSaasSession.clientId || 'Customer'))));
        workspaceId = workspace.getId();
        KOL_IDS_SAAS_SCOPE_SET_('WORKSPACE', workspaceId);
        workspaceCreated = true;
      }
    } finally {
      lock.releaseLock();
    }
  }

  // If this is a newly issued paid license, bind it to the workspace created
  // under the customer's Google Account. Never trust a seller-owned workspace.
  if (access.source === 'PAID' && access.licenseId && workspaceId) {
    if (!access.workspaceId || String(access.workspaceId) !== String(workspaceId)) {
      if (typeof KOL_IDS_CORE_bindLicenseWorkspace_ === 'function') {
        KOL_IDS_CORE_bindLicenseWorkspace_(access.licenseId, email, workspaceId);
        access.workspaceId = workspaceId;
      }
    }
  }

  // Every request explicitly binds the current execution to this user's workspace.
  KOL_IDS_SECURITY_BIND_WORKSPACE_(workspaceId, email);
  KOL_IDS_SELF_ACTIVE = true;
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(workspaceId);

  // Sheet setup is expensive. A workspace is immutable at schema level after
  // its first successful initialization, so avoid rebuilding it on every click.
  const readyKey = 'KOL_IDS_WORKSPACE_READY_' + workspaceId;
  if (props.getProperty(readyKey) !== '1') {
    KOL_IDS_SYSTEM_initialize();
    KOL_IDS_PRODUCT_SETUP();
    props.setProperty(readyKey, '1');
  }

  return {
    success: true,
    email: email,
    workspaceId: workspaceId,
    workspaceName: workspace.getName(),
    workspaceCreated: workspaceCreated,
    access: access,
    version: KOL_IDS_SELF.VERSION
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SERVICE_BOOTSTRAP', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SERVICE_BOOTSTRAP', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_SERVICE_GET_CONTEXT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SERVICE_GET_CONTEXT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SECURITY_ASSERT_USER_();
  const boot = KOL_IDS_SELF_SERVICE_BOOTSTRAP();
  return boot;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SERVICE_GET_CONTEXT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SERVICE_GET_CONTEXT', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_SERVICE_RESET() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SERVICE_RESET');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_ENT_EXECUTE_BRIDGE_('RESET', true, function(){
    KOL_IDS_SELF_ROUTE_();
    return (typeof KOL_IDS_PRODUCT_RESET_NEW_ === 'function') ? KOL_IDS_PRODUCT_RESET_NEW_() : KOL_IDS_PRODUCT_UI_RESET_NEW();
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SERVICE_RESET', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SERVICE_RESET', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_SERVICE_EXPORT_ALL() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SERVICE_EXPORT_ALL');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SECURITY_ASSERT_USER_();
  KOL_IDS_SELF_ROUTE_();
  return {
    email: KOL_IDS_SELF_GET_USER_(),
    history: KOL_IDS_PRODUCT_UI_GET_HISTORY(),
    current: KOL_IDS_PRODUCT_UI_EXPORT_CURRENT()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SERVICE_EXPORT_ALL', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SERVICE_EXPORT_ALL', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_ROUTE_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_ROUTE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const boot = KOL_IDS_SELF_SERVICE_BOOTSTRAP();
  KOL_IDS_SELF_ACTIVE = true;
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(boot.workspaceId);
  return boot;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_ROUTE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_ROUTE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return (typeof KOL_IDS_SELF_ACTIVE !== 'undefined' && KOL_IDS_SELF_ACTIVE)
    ? PropertiesService.getUserProperties()
    : PropertiesService.getDocumentProperties();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_GET_STATE_LEGACY_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_GET_STATE_LEGACY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('GET_STATE', false, function(){ KOL_IDS_SELF_ROUTE_(); return KOL_IDS_PRODUCT_UI_GET_STATE(); }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_GET_STATE_LEGACY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_GET_STATE_LEGACY_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_SAVE_LEGACY_(p) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_LEGACY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 var idemKey = '';
 try {
   var rawPayload = JSON.stringify(p || {});
   var ws = String(KOL_IDS_SAAS_SCOPE_GET_('WORKSPACE') || '');
   var digest = (typeof KOL_IDS_HARDENING_RUNTIME_hash_ === 'function') ? KOL_IDS_HARDENING_RUNTIME_hash_(['SAVE', ws, rawPayload].join('|')) : '';
   idemKey = 'SAVE-' + String(digest || Utilities.getUuid().replace(/-/g,''));
 } catch(ignoreIdem) {}
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('SAVE', true, function(){ KOL_IDS_SELF_ROUTE_(); KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_(p); const result = KOL_IDS_PRODUCT_SAVE(p); KOL_IDS_ENT_DATA_RECORD_('ANALYSIS_SAVED', { validation:KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_(p), savedAt:new Date().toISOString() }); return result; }, idemKey); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_LEGACY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_LEGACY_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_RUN_LEGACY_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_RUN_LEGACY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('RUN', true, function(){ KOL_IDS_SELF_ROUTE_(); const reconciliation = KOL_IDS_ENT_DATA_ASSERT_READY_(); const result = KOL_IDS_PRODUCT_RUN(); if (typeof KOL_IDS_IDI_syncDecisions_ === 'function') { try { KOL_IDS_IDI_syncDecisions_(); } catch (e) {} } KOL_IDS_ENT_DATA_RECORD_('ANALYSIS_RUN', { reconciliation:reconciliation, report:KOL_IDS_PRODUCT_UI_GET_REPORT(), completedAt:new Date().toISOString() }); return result; }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_RUN_LEGACY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_RUN_LEGACY_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_SAVE_SELECTION_LEGACY_(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_SELECTION_LEGACY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_ENT_EXECUTE_BRIDGE_('SAVE_SELECTION', true, function(){ KOL_IDS_SELF_ROUTE_();
  const state = KOL_IDS_PRODUCT_UI_GET_STATE();
  const available = (state.kols || []).map(k => String(k.name || '').trim()).filter(Boolean);
  const selected = Array.isArray(payload && payload.selectedCreators) ? payload.selectedCreators.map(x => String(x || '').trim()).filter(Boolean) : [];
  const unique = selected.filter((x, i, a) => a.indexOf(x) === i);
  const invalid = unique.filter(name => available.indexOf(name) < 0);
  if (invalid.length) throw new Error('Selected Creator is not in this workspace: ' + invalid.join(', '));
  if (!unique.length) throw new Error('Select at least one Creator.');
  // Compatibility route: canonical selection storage owns persistence in 1.0.0.
  if(typeof KOL_IDS_SELF_SAVE_SELECTION==='function'){
    return KOL_IDS_SELF_SAVE_SELECTION({selectedCreators:unique});
  }
  return { success:true, creators:unique, count:unique.length, storage:'CANONICAL_STATE' };
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_SELECTION_LEGACY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_SELECTION_LEGACY_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT_LEGACY_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT_LEGACY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_ENT_EXECUTE_BRIDGE_('GET_WORKFLOW_SNAPSHOT', false, function(){ KOL_IDS_SELF_ROUTE_();
  const props = KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_(); let selected=[];
  try { selected=JSON.parse(props.getProperty('KOL_IDS_SELECTED_CREATORS') || props.getProperty('KBIS_SELECTED_CREATORS') || '[]'); } catch (ignore) {}
  return { success:true, selectedCreators:Array.isArray(selected)?selected:[], state:KOL_IDS_PRODUCT_UI_GET_STATE(), report:KOL_IDS_PRODUCT_UI_GET_REPORT(), updatedAt:props.getProperty('KOL_IDS_SELECTED_CREATORS_UPDATED_AT') || props.getProperty('KBIS_SELECTED_CREATORS_UPDATED_AT') || '' };
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT_LEGACY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT_LEGACY_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_SAVE_PERFORMANCE_LEGACY_(p) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_PERFORMANCE_LEGACY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('SAVE_PERFORMANCE', true, function(){ KOL_IDS_SELF_ROUTE_(); KOL_IDS_ENT_VALIDATE_PERFORMANCE_(p); const result = KOL_IDS_RUNTIME_PRODUCT_SAVE_PERFORMANCE(p); if (typeof KOL_IDS_IDI_syncOutcomes_ === 'function') { try { KOL_IDS_IDI_syncOutcomes_(); } catch (e) {} } KOL_IDS_ENT_DATA_RECORD_('PERFORMANCE_SAVED', { validation:KOL_IDS_ENT_VALIDATE_PERFORMANCE_(p), health:KOL_IDS_ENT_BUSINESS_HEALTH(), savedAt:new Date().toISOString() }); return result; }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_PERFORMANCE_LEGACY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_PERFORMANCE_LEGACY_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_GET_REPORT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_GET_REPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('GET_REPORT', false, function(){
    try{ if(typeof KOL_IDS_COMMERCIAL_GET_ACCESS==='function') KOL_IDS_COMMERCIAL_GET_ACCESS(); }catch(ignoreCommercialReconcile){}
    KOL_IDS_SELF_ROUTE_();
    var raw=KOL_IDS_SAAS_SCOPE_GET_('SESSION'),session=raw?JSON.parse(raw):null;
    if(session&&String(session.accessType||'').toUpperCase()==='TRIAL'){
      var err=new Error('Report access is available after subscribing to a paid plan. Your trial workspace and analysis data are preserved.');
      err.code='REPORT_SUBSCRIPTION_REQUIRED';
      throw err;
    }
    return KOL_IDS_PRODUCT_UI_GET_REPORT();
  }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_GET_REPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_GET_REPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_EXPORT_REPORT(type, format) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_EXPORT_REPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_ENT_EXECUTE_BRIDGE_('EXPORT_REPORT', true, function(){
    try{ if(typeof KOL_IDS_COMMERCIAL_GET_ACCESS==='function') KOL_IDS_COMMERCIAL_GET_ACCESS(); }catch(ignoreCommercialReconcile){}
    KOL_IDS_SELF_ROUTE_();
    var raw=KOL_IDS_SAAS_SCOPE_GET_('SESSION'),session=raw?JSON.parse(raw):null;
    if(session&&String(session.accessType||'').toUpperCase()==='TRIAL') var err = new Error('Report export is a paid feature. Please choose a KOL IDS paid plan to download JSON/CSV. Your 7-day trial data will be preserved.'); err.code='REPORT_EXPORT_SUBSCRIPTION_REQUIRED'; err.upgradeRequired=true; throw err;
    if (type && typeof type === 'object') { format = type.fileType; type = type.reportType; }
    return KOL_IDS_PRODUCT_UI_EXPORT_REPORT(type, format);
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_EXPORT_REPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_EXPORT_REPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_GET_HISTORY() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_GET_HISTORY');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('GET_HISTORY', false, function(){ KOL_IDS_SELF_ROUTE_(); return KOL_IDS_PRODUCT_UI_GET_HISTORY(); }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_GET_HISTORY', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_GET_HISTORY', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_EXPORT_CURRENT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_EXPORT_CURRENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('EXPORT_CURRENT', true, function(){ KOL_IDS_SELF_ROUTE_(); var raw=KOL_IDS_SAAS_SCOPE_GET_('SESSION'),session=raw?JSON.parse(raw):null; if(session&&String(session.accessType||'').toUpperCase()==='TRIAL')var err = new Error('Report export is a paid feature. Please choose a KOL IDS paid plan to download JSON/CSV. Your 7-day trial data will be preserved.'); err.code='REPORT_EXPORT_SUBSCRIPTION_REQUIRED'; err.upgradeRequired=true; throw err; return KOL_IDS_PRODUCT_UI_EXPORT_CURRENT(); }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_EXPORT_CURRENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_EXPORT_CURRENT', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_EXPORT_HISTORY(id) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_EXPORT_HISTORY');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('EXPORT_HISTORY', true, function(){ KOL_IDS_SELF_ROUTE_(); var raw=KOL_IDS_SAAS_SCOPE_GET_('SESSION'),session=raw?JSON.parse(raw):null; if(session&&String(session.accessType||'').toUpperCase()==='TRIAL')var err = new Error('Report export is a paid feature. Please choose a KOL IDS paid plan to download JSON/CSV. Your 7-day trial data will be preserved.'); err.code='REPORT_EXPORT_SUBSCRIPTION_REQUIRED'; err.upgradeRequired=true; throw err; return KOL_IDS_SELF_SERVICE_PRODUCT_exportHistorySafe_(id); }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_EXPORT_HISTORY', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_EXPORT_HISTORY', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_OPEN_SHEET(name) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_OPEN_SHEET');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_EXECUTE_BRIDGE_('OPEN_SHEET', true, function(){ KOL_IDS_SELF_ROUTE_(); return KOL_IDS_SELF_SERVICE_PRODUCT_openSheetSafe_(name); }); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_OPEN_SHEET', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_OPEN_SHEET', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_RESET() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_RESET');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_SELF_SERVICE_RESET(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_RESET', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_RESET', Date.now() - __kolIdsTraceStartedAt);
  }
}

// Safe wrappers avoid exposing another user's workspace through arbitrary sheet/id input.
function KOL_IDS_SELF_SERVICE_PRODUCT_exportHistorySafe_(id) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SERVICE_PRODUCT_exportHistorySafe_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_PRODUCT_UI_EXPORT_HISTORY(id);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SERVICE_PRODUCT_exportHistorySafe_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SERVICE_PRODUCT_exportHistorySafe_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SELF_SERVICE_PRODUCT_openSheetSafe_(name) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SERVICE_PRODUCT_openSheetSafe_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const allowed = [
    '00_START','01_INPUT','02_BRAND_PROFILE','03_CAMPAIGN','04_KOL_DATABASE',
    '05_BRAND_FIT','06_BRAND_IMPACT','07_KOL_DECISION','08_KOL_MANAGEMENT',
    '09_PERFORMANCE','10_LEARNING','11_EXECUTIVE','12_PORTFOLIO',
    '16_KOL_PROFILE','17_KOL_TRACK_RECORD','18_KOL_VALUE','19_CREATOR_ANALYSIS_REPORT','22_CAMPAIGN_PERFORMANCE_REPORT',
    '20_ANALYSIS_HISTORY','21_DECISION_LOG','HOW_TO_USE','KOL_IDS_GUIDE'
  ];
  const sheet = String(name || '').trim();
  if (allowed.indexOf(sheet) < 0) throw new Error('KOL IDS: Sheet access is not allowed.');
  return KOL_IDS_PRODUCT_UI_OPEN_SHEET(sheet);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SERVICE_PRODUCT_openSheetSafe_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SERVICE_PRODUCT_openSheetSafe_', Date.now() - __kolIdsTraceStartedAt);
  }
}
