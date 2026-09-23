
/**
 * KOL_IDS 1.1.0 — Canonical Mutation / State / Idempotency Contract
 */
var KOL_IDS_GROWTH_MUTATION_CONTRACT_ = Object.freeze({
  VERSION: '1.0.0',
  STATES: Object.freeze({
    CAMPAIGN: ['PLANNED','DRAFT','PLANNING','CREATOR_SELECTION','INVITATION','NEGOTIATION','CONTRACTED','CONTENT_BRIEF','CONTENT_SUBMITTED','REVIEW','APPROVED','PUBLISHED','TRACKING','RECONCILIATION','COMPLETED','CANCELLED'],
    DELIVERABLE: ['PENDING','SUBMITTED','IN_REVIEW','APPROVED','REJECTED','OVERDUE','CANCELLED']
  })
});

function KOL_IDS_CANONICAL_MUTATION_normalizeIdempotencyKey_(key) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_MUTATION_normalizeIdempotencyKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  key = String(key == null ? '' : key).trim();
  if (!key) throw new Error('IDEMPOTENCY_KEY_REQUIRED');
  if (key.length > 200) throw new Error('IDEMPOTENCY_KEY_TOO_LONG');
  return key;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_MUTATION_normalizeIdempotencyKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_MUTATION_normalizeIdempotencyKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CANONICAL_MUTATION_assertTransition_(entity, fromState, toState) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_MUTATION_assertTransition_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var allowed = {
    CAMPAIGN: {
      PLANNED:['PLANNING','CREATOR_SELECTION','CANCELLED'],
      DRAFT:['PLANNING','CANCELLED'],
      PLANNING:['CREATOR_SELECTION','CANCELLED'],
      CREATOR_SELECTION:['INVITATION','CANCELLED'],
      INVITATION:['NEGOTIATION','CONTRACTED','CANCELLED'],
      NEGOTIATION:['CONTRACTED','CANCELLED'],
      CONTRACTED:['CONTENT_BRIEF','CANCELLED'],
      CONTENT_BRIEF:['CONTENT_SUBMITTED','CANCELLED'],
      CONTENT_SUBMITTED:['REVIEW','CANCELLED'],
      REVIEW:['APPROVED','CONTENT_SUBMITTED','CANCELLED'],
      APPROVED:['PUBLISHED','CANCELLED'],
      PUBLISHED:['TRACKING'],
      TRACKING:['RECONCILIATION','CANCELLED'],
      RECONCILIATION:['COMPLETED','CANCELLED'],
      COMPLETED:[],
      CANCELLED:[]
    },
    DELIVERABLE: {
      PENDING:['SUBMITTED','OVERDUE','CANCELLED'],
      SUBMITTED:['IN_REVIEW','REJECTED','CANCELLED'],
      IN_REVIEW:['APPROVED','REJECTED','CANCELLED'],
      APPROVED:['CANCELLED'],
      REJECTED:['SUBMITTED','CANCELLED'],
      OVERDUE:['SUBMITTED','CANCELLED'],
      CANCELLED:[]
    }
  };
  entity=String(entity||'').toUpperCase();
  fromState=String(fromState||'').toUpperCase();
  toState=String(toState||'').toUpperCase();
  if (!allowed[entity] || !allowed[entity][fromState] ||
      allowed[entity][fromState].indexOf(toState) < 0) {
    throw new Error('INVALID_STATE_TRANSITION');
  }
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_MUTATION_assertTransition_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_MUTATION_assertTransition_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CANONICAL_MUTATION_mutationLock_(fn) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_MUTATION_mutationLock_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_MUTATION_mutationLock_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_MUTATION_mutationLock_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Deterministic mutation fingerprint. Callers can persist/use it as the
 * unique identity for a logical mutation.
 */
/**
 * Canonical critical-write boundary. Every customer-facing write routed through
 * KOL_IDS_ENT_EXECUTE_() uses this single script-level transaction lock.
 * The callback is deliberately kept side-effect-only; state validation and
 * persistent idempotency are handled by the caller/boundary.
 */
function KOL_IDS_CANONICAL_MUTATION_withCriticalWrite_(operation, fn) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_MUTATION_withCriticalWrite_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    operation = String(operation || 'WRITE').trim().toUpperCase();
    if (!operation) throw new Error('MUTATION_OPERATION_REQUIRED');
    return KOL_IDS_CANONICAL_MUTATION_mutationLock_(function(){
      return fn();
    });
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_MUTATION_withCriticalWrite_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_MUTATION_withCriticalWrite_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CANONICAL_MUTATION_mutationFingerprint_(operation, orgId, brandId, idempotencyKey) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_MUTATION_mutationFingerprint_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var raw=[operation,orgId,brandId,idempotencyKey].map(function(v){
    return String(v==null?'':v).trim();
  }).join('|');
  var digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest.map(function(b){
    var n=(b+256)%256; return ('0'+n.toString(16)).slice(-2);
  }).join('');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_MUTATION_mutationFingerprint_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_MUTATION_mutationFingerprint_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** Public Apps Script runner for 1.0.0 canonical mutation/state contract QA. */
function KOL_IDS_CANONICAL_MUTATION_RUN_QA_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_MUTATION_RUN_QA_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var campaign = KOL_IDS_CANONICAL_MUTATION_assertTransition_(
    'CAMPAIGN', 'PLANNED', 'PLANNING'
  );
  var deliverable = KOL_IDS_CANONICAL_MUTATION_assertTransition_(
    'DELIVERABLE', 'PENDING', 'SUBMITTED'
  );
  return {
    success: campaign === true && deliverable === true,
    version: '1.0.0',
    campaignTransition: campaign,
    deliverableTransition: deliverable
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_MUTATION_RUN_QA_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_MUTATION_RUN_QA_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
