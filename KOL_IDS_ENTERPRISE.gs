/**
 * KOL IDS Enterprise Edition V16
 * Governance, tenancy protection, auditability, and operational guardrails.
 *
 * Configure once after deployment by running:
 *   KOL_IDS_ENT_SETUP({admins:['admin@company.com'], allowedDomain:'company.com'});
 */
const KOL_IDS_ENT = {
  VERSION: '16.0.0',
  ROLES_PROPERTY: 'KOL_IDS_ENT_ROLES_JSON',
  DOMAIN_PROPERTY: 'KOL_IDS_ENT_ALLOWED_DOMAIN',
  AUDIT_SHEET: '90_AUDIT_LOG',
  MAX_REQUESTS_PER_MINUTE: 60,
  ROLES: { ADMIN: 'ADMIN', ANALYST: 'ANALYST', VIEWER: 'VIEWER' },
  WRITE_ACTIONS: ['SAVE','SAVE_SELECTION','RUN','SAVE_PERFORMANCE','RESET','EXPORT_REPORT','EXPORT_CURRENT','EXPORT_HISTORY','OPEN_SHEET']
};

function KOL_IDS_ENT_SETUP(config) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_SETUP');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    const caller = KOL_IDS_SECURITY_GET_EMAIL_();
    if (!caller) throw new Error('Enterprise setup requires an authenticated Google account.');

    const props = PropertiesService.getScriptProperties();
    const existingRaw = props.getProperty(KOL_IDS_ENT.ROLES_PROPERTY) || '';
    var existingRoles = {};
    if (existingRaw) {
      try { existingRoles = JSON.parse(existingRaw) || {}; }
      catch (e) { throw new Error('Enterprise role configuration is invalid.'); }
    }

    // Secure bootstrap: the first authenticated setup caller becomes ADMIN.
    // Once initialized, only an existing ADMIN may change enterprise configuration.
    const initialized = Object.keys(existingRoles).length > 0;
    if (initialized && existingRoles[caller] !== KOL_IDS_ENT.ROLES.ADMIN) {
      throw new Error('Administrator role required to change Enterprise configuration.');
    }

    const cfg = config || {};
    const admins = (cfg.admins || (initialized ? Object.keys(existingRoles).filter(function(email) {
      return existingRoles[email] === KOL_IDS_ENT.ROLES.ADMIN;
    }) : [caller]))
      .map(function(email) { return String(email || '').trim().toLowerCase(); })
      .filter(Boolean);

    if (admins.indexOf(caller) < 0 && !initialized) admins.push(caller);
    if (!admins.length) throw new Error('At least one Enterprise administrator is required.');

    const roles = initialized ? existingRoles : {};
    admins.forEach(function(email) { roles[email] = KOL_IDS_ENT.ROLES.ADMIN; });
    props.setProperty(KOL_IDS_ENT.ROLES_PROPERTY, JSON.stringify(roles));

    const domain = String(cfg.allowedDomain || '').trim().toLowerCase().replace(/^@/, '');
    if (domain) props.setProperty(KOL_IDS_ENT.DOMAIN_PROPERTY, domain);
    else if (Object.prototype.hasOwnProperty.call(cfg, 'allowedDomain')) props.deleteProperty(KOL_IDS_ENT.DOMAIN_PROPERTY);

    KOL_IDS_ENT_AUDIT_('ENTERPRISE_SETUP', 'SUCCESS', {
      initializedFromExistingConfig: initialized,
      admins: admins,
      allowedDomain: domain
    });

    return {
      success: true,
      initialized: true,
      configuredBy: caller,
      admins: admins,
      allowedDomain: domain || String(props.getProperty(KOL_IDS_ENT.DOMAIN_PROPERTY) || ''),
      version: KOL_IDS_ENT.VERSION
    };
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_SETUP', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_SETUP', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * One-time deployment bootstrap. Run this manually as the intended Enterprise
 * administrator after deploying the script. It is safe to run again only if
 * the current account is already an ADMIN.
 */
function KOL_IDS_ENT_INITIALIZE_ADMIN() {
  return KOL_IDS_ENT_SETUP({ admins: [KOL_IDS_SECURITY_GET_EMAIL_()] });
}

/**
 * Non-throwing Enterprise configuration diagnostic. Useful immediately after
 * deployment, before a role has been assigned.
 */
function KOL_IDS_ENT_STATUS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_STATUS');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    const email = KOL_IDS_SECURITY_GET_EMAIL_();
    const props = PropertiesService.getScriptProperties();
    const raw = props.getProperty(KOL_IDS_ENT.ROLES_PROPERTY) || '';
    var roles = {};
    if (raw) {
      try { roles = JSON.parse(raw) || {}; }
      catch (e) { return { success: false, initialized: false, configurationError: true, message: 'Enterprise role configuration is invalid.', email: email, version: KOL_IDS_ENT.VERSION }; }
    }
    const role = roles[String(email || '').toLowerCase()] || '';
    const domain = String(props.getProperty(KOL_IDS_ENT.DOMAIN_PROPERTY) || '');
    return {
      success: true,
      initialized: Object.keys(roles).length > 0,
      authenticated: !!email,
      email: email,
      role: role,
      assigned: !!role,
      allowedDomain: domain,
      version: KOL_IDS_ENT.VERSION
    };
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_STATUS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_STATUS', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ENT_SET_ROLE(email, role) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_SET_ROLE');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_ENT_REQUIRE_ADMIN_();
  const target = String(email || '').trim().toLowerCase();
  const normalized = String(role || '').trim().toUpperCase();
  if (!target || [KOL_IDS_ENT.ROLES.ADMIN, KOL_IDS_ENT.ROLES.ANALYST, KOL_IDS_ENT.ROLES.VIEWER].indexOf(normalized) < 0) throw new Error('Use a valid email and role: ADMIN, ANALYST, or VIEWER.');
  const roles = KOL_IDS_ENT_ROLES_(); roles[target] = normalized;
  PropertiesService.getScriptProperties().setProperty(KOL_IDS_ENT.ROLES_PROPERTY, JSON.stringify(roles));
  KOL_IDS_ENT_AUDIT_('ROLE_CHANGED', 'SUCCESS', { target: target, role: normalized });
  return { success: true, email: target, role: normalized };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_SET_ROLE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_SET_ROLE', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_GET_ACCESS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_GET_ACCESS');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const email = KOL_IDS_SECURITY_GET_EMAIL_();
  return { email: email, role: KOL_IDS_ENT_ROLE_(email), version: KOL_IDS_ENT.VERSION };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_GET_ACCESS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_GET_ACCESS', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_GATE_(action, isWrite) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_GATE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const identity = KOL_IDS_SECURITY_ASSERT_USER_();
  const email = identity.email;
  const domain = String(PropertiesService.getScriptProperties().getProperty(KOL_IDS_ENT.DOMAIN_PROPERTY) || '').trim().toLowerCase();
  if (domain && email.split('@').pop() !== domain) throw new Error('Access is restricted to the configured organization domain.');
  const role = KOL_IDS_ENT_ROLE_(email);
  if (!role) throw new Error('Enterprise access denied: user is not assigned a role.');
  if (isWrite && role === KOL_IDS_ENT.ROLES.VIEWER) throw new Error('Your Viewer role does not allow this action.');
  KOL_IDS_ENT_RATE_LIMIT_(email, action);
  return { email: email, role: role, workspaceId: identity.workspaceId || '' };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_GATE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_GATE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_ROLE_(email) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_ROLE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const roles = KOL_IDS_ENT_ROLES_();
  var role = roles[String(email || '').toLowerCase()];
  return role || '';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_ROLE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_ROLE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_ROLES_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_ROLES_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty(KOL_IDS_ENT.ROLES_PROPERTY) || '{}') || {}; }
  catch (e) { throw new Error('Enterprise role configuration is invalid.'); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_ROLES_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_ROLES_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_REQUIRE_ADMIN_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_REQUIRE_ADMIN_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const email = KOL_IDS_SECURITY_GET_EMAIL_();
  if (KOL_IDS_ENT_ROLE_(email) !== KOL_IDS_ENT.ROLES.ADMIN) throw new Error('Administrator role required.');
  return email;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_REQUIRE_ADMIN_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_REQUIRE_ADMIN_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_RATE_LIMIT_(email, action) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_RATE_LIMIT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const cache = CacheService.getUserCache();
  const key = 'ent_rate_' + Utilities.base64EncodeWebSafe(email + ':' + Math.floor(Date.now() / 60000));
  const count = Number(cache.get(key) || '0') + 1;
  if (count > KOL_IDS_ENT.MAX_REQUESTS_PER_MINUTE) throw new Error('Too many requests. Please wait one minute and try again.');
  cache.put(key, String(count), 65);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_RATE_LIMIT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_RATE_LIMIT_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_AUDIT_(action, outcome, details) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_AUDIT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
    if (!ss) return;
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      let sheet = ss.getSheetByName(KOL_IDS_ENT.AUDIT_SHEET);
      if (!sheet) {
        sheet = ss.insertSheet(KOL_IDS_ENT.AUDIT_SHEET);
        sheet.appendRow(['Timestamp','Actor','Role','Action','Outcome','Request ID','Details']);
        sheet.setFrozenRows(1);
      }
      const email = KOL_IDS_SECURITY_GET_EMAIL_();
      const safeDetails = JSON.stringify(details || {}).slice(0, 5000);
      sheet.appendRow([new Date(), email, KOL_IDS_ENT_ROLE_(email), String(action || ''), String(outcome || ''), Utilities.getUuid(), safeDetails]);
    } finally { lock.releaseLock(); }
  } catch (ignore) { console.warn('Audit write failed: ' + ignore.message); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_AUDIT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_AUDIT_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_EXECUTE_(action, isWrite, fn, idempotencyKey) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_EXECUTE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const context = KOL_IDS_ENT_GATE_(action, isWrite);
  const lock = isWrite ? LockService.getUserLock() : null;
  var idemFingerprint = '';
  var idemClaim = null;
  try {
    // Optional persistent idempotency for customer writes. API writes already
    // pass through the stronger platform gate; this covers the legacy/UI path.
    if (isWrite && idempotencyKey && typeof KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_ === 'function') {
      var idemOrg = String(context.workspaceId || '');
      var idemBrand = String(context.brandId || '');
      var idemHash = (typeof KOL_IDS_HARDENING_RUNTIME_requestHash_ === 'function')
        ? KOL_IDS_HARDENING_RUNTIME_requestHash_(action, idemOrg, idemBrand, {idempotencyKey:String(idempotencyKey)}) : '';
      idemClaim = KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_(action, String(idempotencyKey), idemOrg, idemBrand, Utilities.getUuid(), idemHash);
      if (idemClaim.state === 'REPLAY' || idemClaim.state === 'REPLAY_FAILED') {
        var replay = typeof KOL_IDS_PLATFORM_json_ === 'function' ? KOL_IDS_PLATFORM_json_(idemClaim.responseJson) : JSON.parse(idemClaim.responseJson || '{}');
        replay.idempotentReplay = true;
        return replay;
      }
      if (idemClaim.state === 'IN_PROGRESS') throw new Error('DUPLICATE_REQUEST');
      idemFingerprint = idemClaim.fingerprint || '';
    }
    if (lock) lock.waitLock(25000);
    const executeMutation = function(){ return fn(context); };
    const result = isWrite && typeof KOL_IDS_CANONICAL_MUTATION_withCriticalWrite_ === 'function'
      ? KOL_IDS_CANONICAL_MUTATION_withCriticalWrite_(action, executeMutation)
      : executeMutation();
    if (idemFingerprint && typeof KOL_IDS_HARDENING_RUNTIME_completeIdempotency_ === 'function') {
      try { KOL_IDS_HARDENING_RUNTIME_completeIdempotency_(idemFingerprint, 'COMPLETED', result); } catch(ignoreCommit) {}
    }
    KOL_IDS_ENT_AUDIT_(action, 'SUCCESS', { workspaceId: context.workspaceId });
    return result;
  } catch (error) {
    if (idemFingerprint && typeof KOL_IDS_HARDENING_RUNTIME_completeIdempotency_ === 'function') {
      try { KOL_IDS_HARDENING_RUNTIME_completeIdempotency_(idemFingerprint, 'FAILED', {success:false,code:String(error && error.code || 'INTERNAL_ERROR'),error:String(error && error.message || error)}); } catch(ignoreCommit) {}
    }
    KOL_IDS_ENT_AUDIT_(action, 'FAILURE', { message: String(error && error.message || error).slice(0, 500) });
    throw error;
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_EXECUTE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_EXECUTE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_HEALTHCHECK() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_HEALTHCHECK');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    // Healthcheck must diagnose an uninitialized deployment without throwing a
    // misleading "access denied" error. Once initialized, use the real gate.
    const status = KOL_IDS_ENT_STATUS();
    if (!status.initialized) {
      return {
        success: true,
        status: 'NOT_INITIALIZED',
        version: KOL_IDS_ENT.VERSION,
        access: status,
        auditLog: KOL_IDS_ENT.AUDIT_SHEET,
        nextStep: 'Run KOL_IDS_ENT_INITIALIZE_ADMIN once as the intended Enterprise administrator.',
        checkedAt: new Date().toISOString()
      };
    }
    const access = KOL_IDS_ENT_EXECUTE_('HEALTHCHECK', false, function() { return KOL_IDS_ENT_GET_ACCESS(); });
    return { success: true, status: 'HEALTHY', version: KOL_IDS_ENT.VERSION, access: access, auditLog: KOL_IDS_ENT.AUDIT_SHEET, checkedAt: new Date().toISOString() };
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_HEALTHCHECK', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_HEALTHCHECK', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ENT_QA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const failures = [];
  function KOL_IDS_ENTERPRISE_EnterpriseTest_(name, value) { if (!value) failures.push(name); }
  KOL_IDS_ENTERPRISE_EnterpriseTest_('roles parse', typeof KOL_IDS_ENT_ROLES_() === 'object');
  KOL_IDS_ENTERPRISE_EnterpriseTest_('viewer role exists', KOL_IDS_ENT.ROLES.VIEWER === 'VIEWER');
  KOL_IDS_ENTERPRISE_EnterpriseTest_('write allowlist defined', KOL_IDS_ENT.WRITE_ACTIONS.indexOf('RUN') >= 0);
  KOL_IDS_ENTERPRISE_EnterpriseTest_('rate limit configured', KOL_IDS_ENT.MAX_REQUESTS_PER_MINUTE >= 1);
  return { success: failures.length === 0, tests: 4, failures: failures, version: KOL_IDS_ENT.VERSION };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
