/**
 * KOL IDS™ LEGACY_V25.9 — PRODUCTION ROUTER CONTRACT
 *
 * This file documents and validates the single-entry routing contract.
 * It intentionally does NOT define doGet/doPost to avoid Apps Script
 * duplicate-entry collisions with the legacy master file.
 */

var KOL_IDS_HARDENING_ROUTER = {
  VERSION: '1.0.0',
  DEFAULT_UI: 'KOL_IDS_UI',
  LEGACY_UI: 'KOL_IDS_UI_LEGACY',
  ADMIN_UI: 'KOL_IDS_ADMIN_UI',
  ENTERPRISE_UI: 'KOL_IDS_ENTERPRISE_UI'
};

function KOL_IDS_ROUTER_routerHealth_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ROUTER_routerHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var required = [
    KOL_IDS_HARDENING_ROUTER.DEFAULT_UI,
    KOL_IDS_HARDENING_ROUTER.ADMIN_UI,
    KOL_IDS_HARDENING_ROUTER.ENTERPRISE_UI,
    KOL_IDS_HARDENING_ROUTER.LEGACY_UI
  ];

  var missing = [];
  required.forEach(function(name) {
    try {
      HtmlService.createHtmlOutputFromFile(name);
    } catch (e) {
      missing.push(name);
    }
  });

  return {
    success: missing.length === 0,
    version: KOL_IDS_HARDENING_ROUTER.VERSION,
    entryPoint: 'doGet',
    missingViews: missing,
    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ROUTER_routerHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ROUTER_routerHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_ROUTER_entryContract_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ROUTER_entryContract_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var required = ['doGet','doPost','KOL_IDS_PLATFORM_api_','KOL_IDS_PLATFORM_auth_','KOL_IDS_PLATFORM_requireBrand_','KOL_IDS_PLATFORM_featureContract_','KOL_IDS_PLATFORM_validateApiFeatures_','KOL_IDS_PLATFORM_rebuildBenchmarksCore_','KOL_IDS_HARDENING_RUNTIME_apiGate_','KOL_IDS_HARDENING_RUNTIME_operationRegistry_','KOL_IDS_HARDENING_RUNTIME_operationContractQA_','KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_','KOL_IDS_HARDENING_RUNTIME_dependencyHealth_','KOL_IDS_HARDENING_RUNTIME_releaseContract_'];
  var missing = required.filter(function(name){ return typeof this[name] !== 'function'; }, this);
  return {success:missing.length===0,version:KOL_IDS_HARDENING_ROUTER.VERSION,required:required,missingFunctions:missing,timestamp:new Date().toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ROUTER_entryContract_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ROUTER_entryContract_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** Public Apps Script runner for 1.0.0 router contract QA. */
function KOL_IDS_ROUTER_RUN_QA_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ROUTER_RUN_QA_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return {
    success: !!KOL_IDS_ROUTER_routerHealth_().success &&
             !!KOL_IDS_ROUTER_entryContract_().success,
    version: '1.0.0',
    routerHealth: KOL_IDS_ROUTER_routerHealth_(),
    entryContract: KOL_IDS_ROUTER_entryContract_()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ROUTER_RUN_QA_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ROUTER_RUN_QA_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
