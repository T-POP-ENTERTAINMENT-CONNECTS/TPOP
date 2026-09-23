
/**
 * KOL IDS — CANONICAL SYSTEM CONTRACT
 * One execution contract for cross-system mutations.
 *
 * Order:
 * context -> idempotency -> lock -> state validation -> domain write
 * -> lineage/audit -> verified response.
 */
var KOL_IDS_GROWTH_CANONICAL = Object.freeze({
  VERSION: '1.0.0',
  STATUS: 'ALL_GREEN_CANONICAL',
  CONTRACT: 'CONTEXT>IDEMPOTENCY>LOCK>STATE>WRITE>LINEAGE>VERIFY'
});

function KOL_IDS_SYSTEM_CONTRACT_requireContext_(ctx) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CONTRACT_requireContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  ctx = ctx || {};
  var orgId = String(ctx.orgId == null ? '' : ctx.orgId).trim();
  var brandId = String(ctx.brandId == null ? '' : ctx.brandId).trim();
  if (!orgId) throw new Error('ORG_ID_REQUIRED');
  if (!brandId) throw new Error('BRAND_ID_REQUIRED');
  return {
    orgId: orgId,
    brandId: brandId,
    userId: String(ctx.userId == null ? '' : ctx.userId).trim(),
    requestId: String(ctx.requestId == null ? '' : ctx.requestId).trim()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CONTRACT_requireContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CONTRACT_requireContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_CONTRACT_idempotencyKey_(operation, ctx, clientKey) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CONTRACT_idempotencyKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c = KOL_IDS_SYSTEM_CONTRACT_requireContext_(ctx);
  var op = String(operation == null ? '' : operation).trim();
  var key = String(clientKey == null ? '' : clientKey).trim();
  if (!op) throw new Error('OPERATION_REQUIRED');
  if (!key) throw new Error('IDEMPOTENCY_KEY_REQUIRED');
  if (key.length > 200) throw new Error('IDEMPOTENCY_KEY_TOO_LONG');
  var raw = [op, c.orgId, c.brandId, key].join('|');
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(function(b) {
    return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
  }).join('');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CONTRACT_idempotencyKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CONTRACT_idempotencyKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_CONTRACT_withMutationLock_(callback) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CONTRACT_withMutationLock_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (typeof callback !== 'function') throw new Error('MUTATION_CALLBACK_REQUIRED');
  var lock = LockService.getScriptLock();
  if(!lock.tryLock(8000))throw new Error('KOL IDS™: Another write operation is in progress. Please try Save again in a few seconds.');
  try {
    return callback();
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CONTRACT_withMutationLock_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CONTRACT_withMutationLock_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_CONTRACT_assertTransition_(currentState, nextState, transitions) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CONTRACT_assertTransition_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var cur = String(currentState == null ? '' : currentState).trim().toUpperCase();
  var next = String(nextState == null ? '' : nextState).trim().toUpperCase();
  if (!cur || !next) throw new Error('STATE_REQUIRED');
  if (cur === next) return true;
  var allowed = transitions && transitions[cur];
  if (!allowed || allowed.indexOf(next) === -1) {
    throw new Error('INVALID_STATE_TRANSITION:' + cur + '->' + next);
  }
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CONTRACT_assertTransition_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CONTRACT_assertTransition_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_CONTRACT_verifiedResult_(data, meta) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CONTRACT_verifiedResult_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return {
    ok: true,
    verified: true,
    version: '1.0.0',
    data: data == null ? null : data,
    meta: meta || {}
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CONTRACT_verifiedResult_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CONTRACT_verifiedResult_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_CONTRACT_safeAudit_(eventName, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CONTRACT_safeAudit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    if (typeof KOL_IDS_PRODUCTION_HARDENING_audit_ === 'function') {
      KOL_IDS_PRODUCTION_HARDENING_audit_(eventName, payload || {});
    }
  } catch (ignore) {}
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CONTRACT_safeAudit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CONTRACT_safeAudit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
