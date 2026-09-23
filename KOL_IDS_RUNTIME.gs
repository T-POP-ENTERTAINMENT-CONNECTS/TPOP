/**
 * KOL IDS™ LEGACY_V25.13 — Enterprise Runtime / Canonical Public Boundary
 *
 * This file is the single runtime boundary for customer self-service mutations
 * that need Google-account isolation, per-user locking, and audit logging.
 *
 * IMPORTANT:
 * - Decision/Scoring logic remains in the existing Engine / Intelligence files.
 * - This layer does not alter scoring formulas.
 * - Legacy LEGACY_V25.11 self-service and workflow bridge overrides are intentionally removed.
 */

const KOL_IDS_ENTERPRISE_RUNTIME = {
  VERSION: '25.13.0-enterprise-runtime',
  MAX_IMAGE_BYTES: 5 * 1024 * 1024,
  REQUEST_ID_PROPERTY: 'KOL_IDS_LAST_REQUEST_ID',
  REQUEST_AT_PROPERTY: 'KOL_IDS_LAST_REQUEST_AT'
};

/**
 * Resolve the authenticated KOL IDS customer session, when one exists.
 * Client ID + Access Key authentication is the customer access boundary;
 * Google Account identity remains the execution identity, not the commercial
 * license lookup key.
 */
function KOL_IDS_RUNTIME_ACTIVE_SAAS_SESSION_() {
  try {
    const raw = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.clientId || !session.spreadsheetId) return null;
    if (String(session.status || '').toUpperCase() !== 'ACTIVE') return null;
    if (session.expiresAt) { var exp=new Date(session.expiresAt); if (!isNaN(exp.getTime()) && exp.getTime()<=Date.now()) return null; }
    return session;
  } catch (e) {
    return null;
  }
}

/** Canonical customer executor used by the LEGACY_V25.13 flow boundary. */
function KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_(action, isWrite, fn) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (typeof KOL_IDS_SECURITY_ASSERT_USER_ !== 'function') {
    throw new Error('KOL IDS™ security layer is missing.');
  }

  const identity = KOL_IDS_SECURITY_ASSERT_USER_();

  /*
   * Customer authentication is established by KOL_IDS_SYSTEM_SAAS_SIGN_IN.
   * Once that session exists, do not immediately re-gate the same request by
   * Google Account email. The previous implementation did exactly that, so a
   * valid Client ID + Access Key could authenticate successfully and then
   * FAST_BOOT / INIT_WORKSPACE would fail on the commercial email gate.
   *
   * No session => retain the original commercial entitlement boundary.
   */
  const saasSession = KOL_IDS_RUNTIME_ACTIVE_SAAS_SESSION_();
  if (saasSession) {
    const sessionEmail = String(saasSession.googleEmail || '').trim().toLowerCase();
    if (sessionEmail && sessionEmail !== String(identity.email || '').trim().toLowerCase()) {
      throw new Error('KOL IDS™: Customer session identity mismatch.');
    }
    const sessionWorkspaceId = String(saasSession.spreadsheetId || '').trim();
    if (!sessionWorkspaceId) throw new Error('KOL IDS™: Customer workspace is missing.');
    let sessionWorkspace = null;
    try { sessionWorkspace = SpreadsheetApp.openById(sessionWorkspaceId); }
    catch (e) { throw new Error('KOL IDS™: Customer workspace could not be opened.'); }
    let ownerEmail = '';
    try { ownerEmail = String(sessionWorkspace.getOwner().getEmail() || '').trim().toLowerCase(); } catch (ignore) {}
    const customerWorkspaceAuthorized =
      identity.customerSession === true &&
      String(identity.workspaceId || sessionWorkspaceId) === sessionWorkspaceId;
    if (
      ownerEmail &&
      ownerEmail !== String(identity.email || '').trim().toLowerCase() &&
      !customerWorkspaceAuthorized
    ) {
      throw new Error('KOL IDS™: Customer workspace authorization failed.');
    }
    identity.workspaceId = sessionWorkspaceId;
    identity.workspace = sessionWorkspace;
    identity.customerSession = true;
  } else if (typeof KOL_IDS_COMMERCIAL_GET_ACCESS_ === 'function') {
    const access = KOL_IDS_COMMERCIAL_GET_ACCESS_(identity.email);
    if (!access || access.allowed !== true) {
      throw new Error((access && access.message) || 'KOL IDS access is not active for this Google Account.');
    }
  }
  const lock = isWrite ? LockService.getUserLock() : null;
  const requestId = Utilities.getUuid();
  const startedAt = new Date().toISOString();

  try {
    if (lock) lock.waitLock(25000);

    const result = fn(identity, requestId);

    try {
      PropertiesService.getUserProperties().setProperties({
        [KOL_IDS_ENTERPRISE_RUNTIME.REQUEST_ID_PROPERTY]: requestId,
        [KOL_IDS_ENTERPRISE_RUNTIME.REQUEST_AT_PROPERTY]: startedAt
      }, false);
    } catch (ignore) {}

    try {
      if (typeof KOL_IDS_ENT_AUDIT_ === 'function') {
        KOL_IDS_ENT_AUDIT_(action, 'SUCCESS', {
          requestId: requestId,
          workspaceId: identity.workspaceId || '',
          runtimeVersion: KOL_IDS_ENTERPRISE_RUNTIME.VERSION
        });
      }
    } catch (ignore2) {}

    return result;
  } catch (error) {
    try {
      if (typeof KOL_IDS_ENT_AUDIT_ === 'function') {
        KOL_IDS_ENT_AUDIT_(action, 'FAILURE', {
          requestId: requestId,
          workspaceId: identity.workspaceId || '',
          message: String(error && error.message || error).slice(0, 500),
          runtimeVersion: KOL_IDS_ENTERPRISE_RUNTIME.VERSION
        });
      }
    } catch (ignore3) {}
    throw error;
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Read-only workflow snapshot for reporting / support diagnostics. */
function KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('GET_WORKFLOW_SNAPSHOT', false, function() {
    KOL_IDS_SELF_ROUTE_();
    const props = KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_();
    let selected = [];
    let decision = null;
    try { selected = JSON.parse(props.getProperty('KOL_IDS_SELECTED_CREATORS') || props.getProperty('KBIS_SELECTED_CREATORS') || '[]'); } catch (ignore) {}
    try { decision = JSON.parse(props.getProperty('KOL_IDS_DECISION_PARAMETERS') || 'null'); } catch (ignore2) {}

    return {
      success: true,
      selectedCreators: Array.isArray(selected) ? selected : [],
      decisionParameters: decision,
      state: KOL_IDS_PRODUCT_UI_GET_STATE(),
      report: KOL_IDS_PRODUCT_UI_GET_REPORT(),
      updatedAt: props.getProperty('KOL_IDS_SELECTED_CREATORS_UPDATED_AT') || props.getProperty('KBIS_SELECTED_CREATORS_UPDATED_AT') || '',
      runtimeVersion: KOL_IDS_ENTERPRISE_RUNTIME.VERSION
    };
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_GET_WORKFLOW_SNAPSHOT', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Creator-image upload kept as a customer-facing capability from LEGACY_V25.11,
 * but now routed through the canonical LEGACY_V25.13 runtime boundary.
 */
function KOL_IDS_SELF_UPLOAD_IMAGE(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_UPLOAD_IMAGE');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('UPLOAD_IMAGE', true, function() {
    KOL_IDS_SELF_ROUTE_();
    payload = payload || {};

    let data = String(payload.data || '');
    if (!data) throw new Error('Image data is required.');
    if (data.indexOf('data:') === 0) data = data.split(',')[1] || '';

    const bytes = Utilities.base64Decode(data);
    if (bytes.length > KOL_IDS_ENTERPRISE_RUNTIME.MAX_IMAGE_BYTES) {
      throw new Error('Image must be 5 MB or smaller.');
    }

    const mime = String(payload.mimeType || 'image/jpeg').toLowerCase();
    if (mime.indexOf('image/') !== 0) throw new Error('Only image files are allowed.');

    const props = PropertiesService.getUserProperties();
    const folderKey = 'KOL_IDS_PHOTO_FOLDER_ID';
    let folderId = String(props.getProperty(folderKey) || '');
    let folder = null;

    if (folderId) {
      try { folder = DriveApp.getFolderById(folderId); } catch (ignore) { folder = null; }
    }
    if (!folder) {
      folder = DriveApp.createFolder('KOL IDS™ — Creator Images');
      props.setProperty(folderKey, folder.getId());
    }

    const safeName = String(payload.name || 'creator-image').replace(/[^a-zA-Z0-9._-]/g, '_');
    const file = folder.createFile(Utilities.newBlob(bytes, mime, safeName));

    // Preserve the existing product behavior: the UI needs a directly renderable image URL.
    try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (ignore2) {}

    return {
      success: true,
      fileId: file.getId(),
      url: 'https://drive.google.com/uc?export=view&id=' + file.getId(),
      name: file.getName(),
      size: bytes.length
    };
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_UPLOAD_IMAGE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_UPLOAD_IMAGE', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Canonical Business Impact persistence. It is deliberately constrained to
 * the active LEGACY_V25.13 workspace and active analysis context.
 */
function KOL_IDS_RUNTIME_PRODUCT_SAVE_PERFORMANCE(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_PRODUCT_SAVE_PERFORMANCE');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_PERFORMANCE', true, function() {
      KOL_IDS_SELF_ROUTE_();
      if (typeof KOL_IDS_PERF_AUTHORITY_SAVE !== 'function') {
        throw new Error('Performance Authority is not installed.');
      }
      return KOL_IDS_PERF_AUTHORITY_SAVE(payload || {});
    });
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_PRODUCT_SAVE_PERFORMANCE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_PRODUCT_SAVE_PERFORMANCE', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Small operational contract used by deployment QA. */
function KOL_IDS_RUNTIME_ENTERPRISE_RUNTIME_HEALTH_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_ENTERPRISE_RUNTIME_HEALTH_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return {
    success: true,
    runtimeVersion: KOL_IDS_ENTERPRISE_RUNTIME.VERSION,
    canonicalFlowVersion: typeof KOL_IDS_CANONICAL_FLOW_VERSION !== 'undefined' ? KOL_IDS_CANONICAL_FLOW_VERSION : '',
    securityLayer: typeof KOL_IDS_SECURITY_ASSERT_USER_ === 'function',
    selfServiceLayer: typeof KOL_IDS_SELF_ROUTE_ === 'function',
    productLayer: typeof KOL_IDS_PRODUCT_RUN === 'function',
    decisionEngine: typeof KOL_IDS_ENGINE_runDecisionEngine === 'function',
    campaignControl: typeof KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_ === 'function' && typeof KOL_IDS_CAMPAIGN_CONTROL_gateCheck_ === 'function',
    checkedAt: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_ENTERPRISE_RUNTIME_HEALTH_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_ENTERPRISE_RUNTIME_HEALTH_', Date.now() - __kolIdsTraceStartedAt);
  }
}
