/**
 * KOL IDS™ — PRE-DEPLOYMENT GATE
 * V13
 *
 * Purpose: make the deployment sequence explicit and prevent operators from
 * running the Decision Engine against an empty 03_CAMPAIGN by accident.
 * This file is orchestration/diagnostic only; it does not alter scoring,
 * pricing, schemas, or canonical decision logic.
 */

function KOL_IDS_PREDEPLOY_STATUS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDEPLOY_STATUS');
  var started = Date.now();
  try {
    var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
    var requiredSheets = [
      '01_SYSTEM','02_BRAND_PROFILE','03_CAMPAIGN','04_KOL_DATABASE',
      '05_BRAND_FIT','06_BRAND_IMPACT','07_KOL_DECISION','08_KOL_MANAGEMENT',
      '09_PERFORMANCE','10_LEARNING','12_PORTFOLIO','13_CONTROL_CENTER',
      '11_EXECUTIVE','15_SYSTEM_QA'
    ];
    var missingSheets = requiredSheets.filter(function(name){ return !ss.getSheetByName(name); });
    var campaignSheet = ss.getSheetByName('03_CAMPAIGN');
    var campaignId = '';
    if (campaignSheet && campaignSheet.getLastRow() >= 2) {
      var vals = campaignSheet.getDataRange().getValues();
      var headers = vals[0].map(function(x){ return String(x || '').trim(); });
      var ci = headers.indexOf('Campaign ID');
      if (ci >= 0) {
        for (var i = 1; i < vals.length; i++) {
          if (String(vals[i][ci] || '').trim()) { campaignId = String(vals[i][ci]).trim(); break; }
        }
      }
    }
    var requiredFunctions = [
      'KOL_IDS_SYSTEM_RUN_MASTER_QA_FAST',
      'KOL_IDS_SYSTEM_RUN_MASTER_QA',
      'KOL_IDS_ENGINE_runDecisionEngine',
      'KOL_IDS_PORTFOLIO_runPortfolioOptimization',
      'KOL_IDS_DASHBOARD_buildExecutiveDashboard',
      'KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE_SAFE_'
    ];
    var missingFunctions = requiredFunctions.filter(function(name){ return typeof globalThis[name] !== 'function'; });
    return {
      success: missingSheets.length === 0 && missingFunctions.length === 0,
      status: missingSheets.length || missingFunctions.length ? 'NOT_READY' : (campaignId ? 'READY' : 'READY_INPUT_REQUIRED'),
      spreadsheetId: ss.getId(),
      missingSheets: missingSheets,
      missingFunctions: missingFunctions,
      campaignId: campaignId,
      campaignInputRequiredForDirectEngineRun: !campaignId,
      recommendedNext: campaignId ? 'Run KOL_IDS_SYSTEM_RUN_MASTER_QA_FAST, then KOL_IDS_SYSTEM_RUN_MASTER_QA.' : 'For QA, run KOL_IDS_SYSTEM_RUN_MASTER_QA. For a real campaign, enter Campaign ID in 03_CAMPAIGN before running the Decision Engine.'
    };
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDEPLOY_STATUS', Date.now() - started);
  }
}

function KOL_IDS_PREDEPLOY_BOOTSTRAP() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDEPLOY_BOOTSTRAP');
  var started = Date.now();
  try {
    if (typeof KOL_IDS_SYSTEM_getSpreadsheet_ !== 'function') {
      throw new Error('PREDEPLOY dependency missing: KOL_IDS_SYSTEM_getSpreadsheet_.');
    }
    if (typeof KOL_IDS_SYSTEM_initialize !== 'function') {
      throw new Error('PREDEPLOY dependency missing: KOL_IDS_SYSTEM_initialize. Import the patched KOL_IDS_00_BOOTSTRAP.gs before running PREDEPLOY.');
    }
    KOL_IDS_SYSTEM_initialize({suppressAlerts:true});
    var status = KOL_IDS_PREDEPLOY_STATUS();
    status.bootstrap = true;
    status.durationMs = Date.now() - started;
    return status;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDEPLOY_BOOTSTRAP', Date.now() - started);
  }
}

function KOL_IDS_PREDEPLOY_RUN_FAST() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDEPLOY_RUN_FAST');
  var started = Date.now();
  try {
    KOL_IDS_PREDEPLOY_BOOTSTRAP();
    var result = KOL_IDS_SYSTEM_RUN_MASTER_QA_FAST();
    result.predeployGate = true;
    result.durationMs = Date.now() - started;
    return result;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDEPLOY_RUN_FAST', Date.now() - started);
  }
}

function KOL_IDS_PREDEPLOY_RUN_FULL() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDEPLOY_RUN_FULL');
  var started = Date.now();
  try {
    KOL_IDS_PREDEPLOY_BOOTSTRAP();
    var result = KOL_IDS_SYSTEM_RUN_MASTER_QA();
    result.predeployGate = true;
    result.durationMs = Date.now() - started;
    return result;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDEPLOY_RUN_FULL', Date.now() - started);
  }
}
