/**
 * KOL IDS™ — Executive Premium / Cohesion Guard
 * Non-invasive integration guard for the canonical production UI.
 * It does not replace business logic, scoring, persistence or RPC contracts.
 */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_EXECUTIVE_COHESION_QA() {
  var required = [
    'KOL_IDS_SELF_FAST_BOOT',
    'KOL_IDS_SELF_INIT_WORKSPACE',
    'KOL_IDS_SELF_GET_STATE',
    'KOL_IDS_SELF_SAVE',
    'KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT',
    'KOL_IDS_SELF_SAVE_CAMPAIGN_DRAFT',
    'KOL_IDS_SELF_SAVE_SELECTION',
    'KOL_IDS_SELF_SAVE_PERFORMANCE',
    'KOL_IDS_SELF_RUN',
    'KOL_IDS_SELF_GET_REPORT',
    'KOL_IDS_SELF_GET_HISTORY',
    'KOL_IDS_SELF_EXPORT_CURRENT'
  ];
  var missing = [];
  required.forEach(function(name) {
    if (typeof this[name] !== 'function') missing.push(name);
  });

  var views = [
    'KOL_IDS_UI',
    'KOL_IDS_UI_TEMPLATE',
    'KOL_IDS_UI_RPC',
    'KOL_IDS_UI_STATE',
    'KOL_IDS_UI_RENDER',
    'KOL_IDS_UI_SALES',
    'KOL_IDS_UI_ANALYTICS',
    'KOL_IDS_UI_COMPONENTS',
    'KOL_IDS_UI_PREMIUM'
  ];
  var viewStatus = {};
  views.forEach(function(name) {
    try {
      HtmlService.createHtmlOutputFromFile(name);
      viewStatus[name] = true;
    } catch (e) {
      viewStatus[name] = false;
    }
  });

  var missingViews = views.filter(function(name) { return !viewStatus[name]; });
  var ok = missing.length === 0 && missingViews.length === 0;
  return {
    ok: ok,
    status: ok ? 'PASSED' : 'FAILED',
    version: '1.1.0-executive-premium-cohesive',
    canonicalUi: 'KOL_IDS_UI',
    rpcContract: missing.length ? 'INCOMPLETE' : 'CONNECTED',
    missingFunctions: missing,
    views: viewStatus,
    missingViews: missingViews,
    timestamp: new Date().toISOString()
  };
}


function KOL_IDS_EXECUTIVE_COHESION_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_EXECUTIVE_COHESION_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_EXECUTIVE_COHESION_QA, this, arguments);
}
