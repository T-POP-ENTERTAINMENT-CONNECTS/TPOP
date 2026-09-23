
/**
 * LEGACY_V25.10.8 Deliverable transition contract.
 * Keeps the lifecycle deterministic; domain writers can call this before mutation.
 */
var KOL_IDS_GROWTH_5_DELIVERABLE_TRANSITIONS = Object.freeze({
  PENDING: ['SUBMITTED','CANCELLED','OVERDUE'],
  SUBMITTED: ['IN_REVIEW','REJECTED','CANCELLED'],
  IN_REVIEW: ['APPROVED','REJECTED','CANCELLED'],
  REJECTED: ['SUBMITTED','CANCELLED'],
  APPROVED: ['CANCELLED'],
  OVERDUE: ['SUBMITTED','CANCELLED'],
  CANCELLED: []
});

function KOL_IDS_DELIVERABLE_validateDeliverableTransition_(currentState, nextState) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DELIVERABLE_validateDeliverableTransition_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CANONICAL_MUTATION_assertTransition_(
    'DELIVERABLE',
    currentState,
    nextState
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DELIVERABLE_validateDeliverableTransition_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DELIVERABLE_validateDeliverableTransition_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** Public Apps Script runner for 1.0.0 deliverable lifecycle contract QA. */
function KOL_IDS_DELIVERABLE_RUN_QA_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DELIVERABLE_RUN_QA_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return {
    success: KOL_IDS_DELIVERABLE_validateDeliverableTransition_('PENDING', 'SUBMITTED') === true,
    version: '1.0.0',
    transition: 'PENDING -> SUBMITTED'
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DELIVERABLE_RUN_QA_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DELIVERABLE_RUN_QA_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
