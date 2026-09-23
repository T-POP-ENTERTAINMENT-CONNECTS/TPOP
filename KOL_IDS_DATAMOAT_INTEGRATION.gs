/**
 * KOL IDS — Canonical Data Moat Integration Bridge
 *
 * Strong integration contract:
 * - Validates hook availability at release/health time.
 * - Dispatches canonical arguments (orgId, brandId, data) instead of
 *   passing a payload object to functions with incompatible signatures.
 * - CREATE/UPDATE/OUTCOME/EVALUATE/BENCHMARK are deterministic and auditable.
 */
function KOL_IDS_DATAMOAT_INTEGRATION_dataMoatEvent_(eventType, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatEvent_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var allowed = {CREATE:true,UPDATE:true,OUTCOME:true,EVALUATE:true,BENCHMARK:true};
  eventType = String(eventType || '').toUpperCase();
  if (!allowed[eventType]) throw new Error('INVALID_DATA_MOAT_EVENT');
  var p = payload || {}, orgId = String(p.orgId || ''), brandId = String(p.brandId || '');
  if (!orgId || !brandId) throw new Error('DATA_MOAT_SCOPE_REQUIRED');

  var fnMap = {
    CREATE: 'KOL_IDS_DATAMOAT_DM_createCampaign_',
    UPDATE: 'KOL_IDS_DATAMOAT_DM_recordRecommendation_',
    OUTCOME: 'KOL_IDS_DATAMOAT_DM_recordOutcome_',
    EVALUATE: 'KOL_IDS_DATAMOAT_DM_evaluateRecommendation_',
    BENCHMARK: 'KOL_IDS_DATAMOAT_DM_benchmarkAggregate_'
  };
  var fnName = fnMap[eventType], fn = (typeof this[fnName] === 'function') ? this[fnName] : null;
  if (!fn) throw new Error('DATA_MOAT_HOOK_NOT_AVAILABLE:' + fnName);

  try {
    var result;
    if (eventType === 'EVALUATE') {
      result = fn(orgId, brandId, String(p.recommendationId || ''), String(p.outcomeId || ''), p.actualValue);
    } else if (eventType === 'BENCHMARK') {
      result = fn(orgId, brandId, p.metric, Array.isArray(p.rows) ? p.rows : []);
    } else {
      result = fn(orgId, brandId, p.data || p);
    }
    return {ok:true, skipped:false, eventType:eventType, result:result};
  } catch (e) {
    try {
      if (typeof KOL_IDS_PRODUCTION_HARDENING_audit_ === 'function') {
        KOL_IDS_PRODUCTION_HARDENING_audit_('DATA_MOAT_HOOK_FAILURE', {
          eventType:eventType, orgId:orgId, brandId:brandId,
          error:String(e && e.message || e)
        });
      }
    } catch (ignore) {}
    throw e;
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatEvent_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatEvent_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATAMOAT_INTEGRATION_dataMoatHealth_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var names = [
    'KOL_IDS_DATAMOAT_DM_createCampaign_',
    'KOL_IDS_DATAMOAT_DM_recordRecommendation_',
    'KOL_IDS_DATAMOAT_DM_recordOutcome_',
    'KOL_IDS_DATAMOAT_DM_evaluateRecommendation_',
    'KOL_IDS_DATAMOAT_DM_benchmarkAggregate_'
  ];
  var available = {};
  for (var i=0;i<names.length;i++) available[names[i]] = typeof ((typeof globalThis !== 'undefined') ? globalThis[names[i]] : this[names[i]]) === 'function';
  var allAvailable = names.every(function(n){return available[n];});
  return {version:KOL_IDS.VERSION, available:available, success:allAvailable};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATAMOAT_INTEGRATION_dataMoatContractQA_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var h = KOL_IDS_DATAMOAT_INTEGRATION_dataMoatHealth_();
  if (!h.success) throw new Error('DATA_MOAT_INTEGRATION_INCOMPLETE');
  return {success:true, version:KOL_IDS.VERSION, hooks:h.available};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_INTEGRATION_dataMoatContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** Public Apps Script runner for 1.0.0 Data Moat integration QA. */
function KOL_IDS_DATAMOAT_INTEGRATION_RUN_QA_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_INTEGRATION_RUN_QA_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_DATAMOAT_INTEGRATION_dataMoatContractQA_();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_INTEGRATION_RUN_QA_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_INTEGRATION_RUN_QA_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
