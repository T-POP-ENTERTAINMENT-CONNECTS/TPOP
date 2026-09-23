/****************************************************
 * KOL IDS™ — PRODUCTION SECURITY LAYER
 * Drop-in file for the existing Self-Service architecture.
 *
 * Security model:
 * 1) Google Account identity is the user identity.
 * 2) UserProperties stores only that user's workspace ID.
 * 3) The workspace spreadsheet is stamped with its owner email.
 * 4) Every public self-service action must pass the guard first.
 * 5) Client-supplied workspace IDs are never trusted.
 ****************************************************/

const KOL_IDS_SECURITY = {
  VERSION: '1.5.0',
  WORKSPACE_PROPERTY: 'KOL_IDS_WORKSPACE_ID',
  OWNER_PROPERTY: 'KOL_IDS_WORKSPACE_OWNER',
  USER_EMAIL_PROPERTY: 'KOL_IDS_USER_EMAIL'
};

function KOL_IDS_SECURITY_GET_EMAIL_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SECURITY_GET_EMAIL_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // A verified commercial customer session is authoritative for KOL IDS.
  // Do not bind the workspace to whichever Google account happens to be
  // active in the browser; customers may use multiple Google accounts.
  try {
    const raw = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    const session = raw ? JSON.parse(raw) : null;
    if (session && String(session.status || '').toUpperCase() === 'ACTIVE') {
      const sessionEmail = String(session.googleEmail || '').trim().toLowerCase();
      if (sessionEmail) return sessionEmail;
    }
  } catch (ignoreSessionIdentity) {}

  const email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  if (email) return email;

  throw new Error('KOL IDS™: Google Account identity is unavailable. Open the deployed Web App while signed in to Google, then sign in with your Client ID and Access Key.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SECURITY_GET_EMAIL_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SECURITY_GET_EMAIL_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SECURITY_ASSERT_USER_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SECURITY_ASSERT_USER_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const email = KOL_IDS_SECURITY_GET_EMAIL_();
  const props = PropertiesService.getUserProperties();
  const workspaceId = String(props.getProperty(KOL_IDS_SECURITY.WORKSPACE_PROPERTY) || '').trim();
  const boundEmail = String(props.getProperty(KOL_IDS_SECURITY.USER_EMAIL_PROPERTY) || '').trim().toLowerCase();
  if (boundEmail && boundEmail !== email) throw new Error('KOL IDS™: User identity binding failed.');
  if (!workspaceId) return { email: email, workspaceId: '' };
  let ss;
  try { ss = SpreadsheetApp.openById(workspaceId); } catch (e) { throw new Error('KOL IDS™: Your workspace could not be opened. Please contact support.'); }
  let ownerEmail = '';
  try { ownerEmail = String(ss.getOwner().getEmail() || '').trim().toLowerCase(); } catch (e) {}

  /*
   * A customer workspace may be owned by the seller/admin account. The
   * authoritative customer boundary is the active Client ID + Access Key
   * session and its bound spreadsheet ID, not the Drive owner email.
   */
  let saasSession = null;
  try {
    const rawSession = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    const parsed = rawSession ? JSON.parse(rawSession) : null;
    const sessionEmail = String(parsed && parsed.googleEmail || '').trim().toLowerCase();
    if (
      parsed &&
      parsed.clientId &&
      String(parsed.status || '').toUpperCase() === 'ACTIVE' &&
      String(parsed.spreadsheetId || '').trim() === workspaceId &&
      (!sessionEmail || sessionEmail === email)
    ) {
      saasSession = parsed;
    }
  } catch (ignoreSession) {}
  const customerSession = !!saasSession;
  if (ownerEmail && ownerEmail !== email && !customerSession) {
    throw new Error('KOL IDS™: Workspace authorization failed.');
  }
  return {
    email: email,
    workspaceId: workspaceId,
    workspace: ss,
    identityVerified: true,
    customerSession: customerSession,
    ownerVerified: !ownerEmail || ownerEmail === email || customerSession
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SECURITY_ASSERT_USER_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SECURITY_ASSERT_USER_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SECURITY_BIND_WORKSPACE_(workspaceId, email) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SECURITY_BIND_WORKSPACE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const id = String(workspaceId || '').trim();
  if (!id) throw new Error('KOL IDS™: Workspace ID is missing.');

  const props = PropertiesService.getUserProperties();
  let activeEmail = '';
  try { activeEmail = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) {}

  // A verified Client ID + Access Key session is the commercial/customer
  // boundary. In a public USER_ACCESSING Web App, Apps Script may expose no
  // active email (or expose the execution account), so do not force a Google
  // owner-email match after the customer session has already been verified.
  let session = null;
  try {
    const sessionRaw = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    const parsed = sessionRaw ? JSON.parse(sessionRaw) : null;
    if (parsed && parsed.clientId && String(parsed.status || '').toUpperCase() === 'ACTIVE') {
      session = parsed;
    }
  } catch (ignoreSession) {}

  const sessionWorkspaceId = String(session && session.spreadsheetId || '').trim();
  const customerSessionOwnsWorkspace = !!(session && sessionWorkspaceId === id);
  const sessionEmail = String(session && session.googleEmail || '').trim().toLowerCase();

  // Once Client ID + Access Key + registered email have created a verified
  // customer session, the registered email is the customer identity. Do not
  // require it to match the browser's currently active Google account.
  const verifiedCustomerIdentity = customerSessionOwnsWorkspace && !!sessionEmail;
  if (!verifiedCustomerIdentity && activeEmail && email && String(email).trim().toLowerCase() !== activeEmail) {
    throw new Error('KOL IDS™: Workspace binding identity mismatch.');
  }

  const user = verifiedCustomerIdentity
    ? sessionEmail
    : (activeEmail || String(email || sessionEmail).trim().toLowerCase());
  if (!customerSessionOwnsWorkspace && !activeEmail) {
    throw new Error('KOL IDS™: Identity is unavailable and no verified customer workspace session exists.');
  }

  let ss;
  try { ss = SpreadsheetApp.openById(id); } catch (e) { throw new Error('KOL IDS™: Workspace could not be opened.'); }
  let ownerEmail = '';
  try { ownerEmail = String(ss.getOwner().getEmail() || '').trim().toLowerCase(); } catch (e) {}

  // Seller-owned workspaces are valid only when the exact workspace ID was
  // already verified by Client ID + Access Key. All other cross-account binds
  // remain denied.
  if (ownerEmail && activeEmail && ownerEmail !== activeEmail && !customerSessionOwnsWorkspace) {
    throw new Error('KOL IDS™: Cannot bind a workspace owned by another Google Account.');
  }

  props.setProperty(KOL_IDS_SECURITY.WORKSPACE_PROPERTY, id);
  if (user) props.setProperty(KOL_IDS_SECURITY.USER_EMAIL_PROPERTY, user);
  props.setProperty(KOL_IDS_SECURITY.OWNER_PROPERTY, ownerEmail || user || 'CUSTOMER_SESSION');
  return ss;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SECURITY_BIND_WORKSPACE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SECURITY_BIND_WORKSPACE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SECURITY_CLEAR_WORKSPACE_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SECURITY_CLEAR_WORKSPACE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  PropertiesService.getUserProperties().deleteProperty(KOL_IDS_SECURITY.WORKSPACE_PROPERTY);
  PropertiesService.getUserProperties().deleteProperty(KOL_IDS_SECURITY.USER_EMAIL_PROPERTY);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SECURITY_CLEAR_WORKSPACE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SECURITY_CLEAR_WORKSPACE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Optional one-time diagnostic. Safe to run from the Apps Script editor while
 * authenticated as the intended account. It does not create or modify data.
 */
function KOL_IDS_SECURITY_DIAGNOSTIC() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SECURITY_DIAGNOSTIC');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const email = KOL_IDS_SECURITY_GET_EMAIL_();
  const props = PropertiesService.getUserProperties();
  const workspaceId = String(props.getProperty(KOL_IDS_SECURITY.WORKSPACE_PROPERTY) || '').trim();
  let ownerEmail = '';
  if (workspaceId) {
    try { ownerEmail = String(SpreadsheetApp.openById(workspaceId).getOwner().getEmail() || '').trim().toLowerCase(); } catch (e) {}
  }
  return {
    success: true,
    email: email,
    workspaceId: workspaceId,
    workspaceOwner: ownerEmail,
    ownerMatches: !ownerEmail || ownerEmail === email,
    securityVersion: KOL_IDS_SECURITY.VERSION
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SECURITY_DIAGNOSTIC', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SECURITY_DIAGNOSTIC', Date.now() - __kolIdsTraceStartedAt);
  }
}
