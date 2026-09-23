/**
 * KOL IDS — Canonical Data Moat lifecycle adapter.
 * All dispatches use the authoritative Data Moat signatures.
 * No silent hook skipping is allowed.
 */
function KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_(eventType, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var p = payload || {};
  eventType = String(eventType || '').toUpperCase();
  if (!eventType) throw new Error('INVALID_DATA_MOAT_EVENT');

  var orgId = String(p.orgId || p['Org ID'] || '').trim();
  var brandId = String(p.brandId || p['Brand ID'] || '').trim();
  if (!orgId || !brandId) throw new Error('ORG_BRAND_REQUIRED');

  var result;
  switch (eventType) {
    case 'CREATE':
      result = KOL_IDS_DATAMOAT_DM_createCampaign_(orgId, brandId, p.data || p);
      break;
    case 'RECOMMENDATION':
      result = KOL_IDS_DATAMOAT_DM_recordRecommendation_(orgId, brandId, p.data || p);
      break;
    case 'UPDATE':
      throw new Error('UNSUPPORTED_DATA_MOAT_EVENT_UPDATE_USE_EXPLICIT_OPERATION');
    case 'OUTCOME':
      result = typeof KOL_IDS_LEARNING_recordOutcome_ === 'function' ? KOL_IDS_LEARNING_recordOutcome_(orgId, brandId, p.data || p) : KOL_IDS_DATAMOAT_DM_recordOutcome_(orgId, brandId, p.data || p);
      break;
    case 'EVALUATE':
      result = KOL_IDS_DATAMOAT_DM_evaluateRecommendation_(
        orgId, brandId,
        String(p.recommendationId || '').trim(),
        String(p.outcomeId || '').trim(),
        p.actualValue
      );
      break;
    case 'BENCHMARK':
      result = KOL_IDS_DATAMOAT_DM_benchmarkAggregate_(
        orgId, brandId,
        String(p.metric || '').trim(),
        Array.isArray(p.rows) ? p.rows : []
      );
      break;
    default:
      throw new Error('INVALID_DATA_MOAT_EVENT');
  }
  return {ok:true, skipped:false, eventType:eventType, result:result};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Strict contract probe: every canonical hook must exist before release. */
function KOL_IDS_DATAMOAT_ADAPTER_dataMoatHookQA_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_ADAPTER_dataMoatHookQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var names = [
    'KOL_IDS_DATAMOAT_DM_createCampaign_',
    'KOL_IDS_DATAMOAT_DM_recordRecommendation_',
    'KOL_IDS_DATAMOAT_DM_recordOutcome_',
    'KOL_IDS_DATAMOAT_DM_evaluateRecommendation_',
    'KOL_IDS_DATAMOAT_DM_benchmarkAggregate_',
    'KOL_IDS_LEARNING_recordOutcome_',
    'KOL_IDS_LEARNING_rebuildLearning_',
    'KOL_IDS_LEARNING_learningHealth_'
  ];
  var missing = names.filter(function(n){ return typeof this[n] !== 'function'; }, this);
  if (missing.length) throw new Error('DATA_MOAT_HOOKS_MISSING:' + missing.join(','));
  return {ok:true, hooks:names};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_ADAPTER_dataMoatHookQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_ADAPTER_dataMoatHookQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** Public Apps Script runner for 1.0.0 Data Moat adapter QA. */
function KOL_IDS_DATAMOAT_ADAPTER_RUN_QA_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_ADAPTER_RUN_QA_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_DATAMOAT_ADAPTER_dataMoatHookQA_();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_ADAPTER_RUN_QA_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_ADAPTER_RUN_QA_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
