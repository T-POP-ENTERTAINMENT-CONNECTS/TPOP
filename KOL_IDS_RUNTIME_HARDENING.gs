/**
 * KOL IDS 1.1.0 — Runtime Cohesion / Production Hardening
 *
 * Purpose: strengthen lifecycle reliability without changing scoring,
 * matching, attribution, campaign, learning, or governance contracts.
 * This layer is additive and intentionally uses existing ensure/QA functions.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  RUNTIME_HARDENING: {
    VERSION: '1.0.0',
    MAX_DIAGNOSTIC_ERRORS: 50,
    REQUIRED_MODULES: [
      'KOL_IDS_PLATFORM_ensure_',
      'KOL_IDS_CAMPAIGN_CONTROL_ensure_',
      'KOL_IDS_ATTRIBUTION_ensure_',
      'KOL_IDS_GROWTH_ensureGrowthSheets_'
    ]
  }
});

function KOL_IDS_RUNTIME_HARDENING_resetCaches_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_HARDENING_resetCaches_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    if (typeof KOL_IDS_PLATFORM_RUNTIME_CACHE !== 'undefined' && KOL_IDS_PLATFORM_RUNTIME_CACHE) {
      KOL_IDS_PLATFORM_RUNTIME_CACHE.maps = {};
      KOL_IDS_PLATFORM_RUNTIME_CACHE.rows = {};
    }
  } catch (e) {}
  try {
    if (typeof CacheService !== 'undefined') CacheService.getScriptCache().removeAll(['KOL_IDS_RUNTIME_HEALTH']);
  } catch (e2) {}
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_HARDENING_resetCaches_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_HARDENING_resetCaches_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_RUNTIME_HARDENING_requiredSheetNames_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_HARDENING_requiredSheetNames_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var names = {};
  try {
    if (KOL_IDS && KOL_IDS.SHEETS) Object.keys(KOL_IDS.SHEETS).forEach(function(k) {
      var v = String(KOL_IDS.SHEETS[k] || '').trim();
      if (v) names[v] = true;
    });
  } catch (e) {}
  // Explicit contractual sheets that are not guaranteed to be enumerable in every legacy layer.
  [
    'ENT_ATTRIBUTION_PLANS','ENT_TRANSACTIONS','ENT_REFUNDS','ENT_ATTRIBUTION_EVENTS','ENT_GENCODE_LEDGER',
    'ENT_CAMPAIGN_PLANS','ENT_CAMPAIGN_TASKS','ENT_CAMPAIGN_BUDGET','ENT_CAMPAIGN_KPIS','ENT_CAMPAIGN_RISKS','ENT_CAMPAIGN_EVENTS'
  ].forEach(function(n){ names[n] = true; });
  return Object.keys(names);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_HARDENING_requiredSheetNames_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_HARDENING_requiredSheetNames_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_RUNTIME_HARDENING_sheetHealth_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_HARDENING_sheetHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  var required = KOL_IDS_RUNTIME_HARDENING_requiredSheetNames_();
  var missing = [], present = 0;
  required.forEach(function(name) {
    if (ss.getSheetByName(name)) present++; else missing.push(name);
  });
  return {success: missing.length === 0, requiredCount: required.length, presentCount: present, missing: missing};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_HARDENING_sheetHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_HARDENING_sheetHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_RUNTIME_HARDENING_moduleHealth_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_HARDENING_moduleHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var required = (KOL_IDS.RUNTIME_HARDENING && KOL_IDS.RUNTIME_HARDENING.REQUIRED_MODULES) || [];
  var missing = required.filter(function(name){ return typeof this[name] !== 'function'; }, this);
  return {success: missing.length === 0, required: required, missing: missing};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_HARDENING_moduleHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_HARDENING_moduleHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Idempotent runtime repair. Existing data is never overwritten or deleted.
 * This is the single lifecycle repair entry point for deployment preparation.
 */
function KOL_IDS_RUNTIME_HARDENING_prepareRuntime_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_HARDENING_prepareRuntime_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var started = Date.now(), steps = [], errors = [];

  // 1.0.0 runtime compatibility bridge:
  // Some Apps Script deployments can expose the PLATFORM helpers but fail to
  // bind the public ensure entry point. Restore the entry point at runtime
  // before any dependent module (Campaign Control / Growth / Learning /
  // Compliance) is initialized. The bridge is idempotent and delegates to
  // the canonical platform schema/helpers when they are available.
  var platformBridgeInstalled = false;
  if (typeof KOL_IDS_PLATFORM_ensure_ !== 'function') {
    if (typeof KOL_IDS_PLATFORM_headers_ === 'function' &&
        typeof KOL_IDS_PLATFORM_ensureSheet_ === 'function' &&
        typeof KOL_IDS_SYSTEM_getSpreadsheet_ === 'function') {
      KOL_IDS_PLATFORM_ensure_ = function() {
        KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_ensure_[RUNTIME_BRIDGE]');
        var __started = Date.now();
        try {
          var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
          var specs = KOL_IDS_PLATFORM_headers_();
          Object.keys(specs).forEach(function(name) {
            KOL_IDS_PLATFORM_ensureSheet_(ss, name, specs[name]);
          });
          return ss;
        } catch (e) {
          KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_ensure_[RUNTIME_BRIDGE]', e);
          throw e;
        } finally {
          KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_ensure_[RUNTIME_BRIDGE]', Date.now() - __started);
        }
      };
      platformBridgeInstalled = true;
    }
  }

  var run = function(name, fn) {
    try { if (typeof fn === 'function') { fn(); steps.push({name:name,status:'PASS'}); }
    else steps.push({name:name,status:'SKIP'}); }
    catch (e) { errors.push({name:name,message:String(e && e.message ? e.message : e)}); steps.push({name:name,status:'FAIL'}); }
  };

  run('PLATFORM', typeof KOL_IDS_PLATFORM_ensure_ === 'function' ? KOL_IDS_PLATFORM_ensure_ : null);
  run('WORKFLOW', typeof KOL_IDS_WORKFLOW_ensure_ === 'function' ? function(){ KOL_IDS_WORKFLOW_ensure_(KOL_IDS_SYSTEM_getSpreadsheet_()); } : null);
  run('SHEETS', typeof KOL_IDS_SHEETS_ensure_ === 'function' ? function(){ KOL_IDS_SHEETS_ensure_(KOL_IDS_SYSTEM_getSpreadsheet_()); } : null);
  run('CAMPAIGN_CONTROL', typeof KOL_IDS_CAMPAIGN_CONTROL_ensure_ === 'function' ? KOL_IDS_CAMPAIGN_CONTROL_ensure_ : null);
  run('ATTRIBUTION', typeof KOL_IDS_ATTRIBUTION_ensure_ === 'function' ? KOL_IDS_ATTRIBUTION_ensure_ : null);
  run('GROWTH', typeof KOL_IDS_GROWTH_ensureGrowthSheets_ === 'function' ? KOL_IDS_GROWTH_ensureGrowthSheets_ : null);
  run('LEARNING', typeof KOL_IDS_LEARNING_ensure_ === 'function' ? KOL_IDS_LEARNING_ensure_ : null);
  run('COMPLIANCE', typeof KOL_IDS_COMPLIANCE_ensure_ === 'function' ? KOL_IDS_COMPLIANCE_ensure_ : null);
  run('RUNTIME_CACHE_RESET', KOL_IDS_RUNTIME_HARDENING_resetCaches_);

  var health = KOL_IDS_RUNTIME_HARDENING_sheetHealth_();
  var modules = KOL_IDS_RUNTIME_HARDENING_moduleHealth_();
  return {
    success: errors.length === 0 && health.success && modules.success,
    version: KOL_IDS.VERSION,
    hardeningVersion: KOL_IDS.RUNTIME_HARDENING.VERSION,
    status: errors.length ? 'REPAIR_ERRORS' : (health.success ? 'READY' : 'REPAIR_REQUIRED'),
    steps: steps,
    errors: errors,
    platformBridgeInstalled: platformBridgeInstalled,
    sheets: health,
    modules: modules,
    durationMs: Date.now() - started,
    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_HARDENING_prepareRuntime_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_HARDENING_prepareRuntime_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Full non-destructive certification. Does not create/repair anything.
 * The existing module QA remains authoritative; this layer adds lifecycle,
 * sheet, dependency and diagnostic visibility around it.
 */
function KOL_IDS_RUNTIME_HARDENING_certifyRuntime_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_HARDENING_certifyRuntime_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var started = Date.now(), checks = {}, errors = [];
  var safe = function(name, fn) {
    try { var r = fn(); checks[name] = r; if (r && r.success === false) errors.push(name); }
    catch (e) { checks[name] = {success:false,error:String(e && e.message ? e.message : e)}; errors.push(name); }
  };
  safe('modules', KOL_IDS_RUNTIME_HARDENING_moduleHealth_);
  safe('sheets', KOL_IDS_RUNTIME_HARDENING_sheetHealth_);
  safe('requiredFunctions', function(){ return KOL_IDS_ORCHESTRATOR_requiredFunctionQA_(); });
  safe('moduleContracts', function(){ return KOL_IDS_ORCHESTRATOR_moduleContractQA_(); });
  safe('schemaContracts', function(){ return KOL_IDS_ORCHESTRATOR_schemaQA_(); });
  safe('sheetContracts', function(){ return KOL_IDS_ORCHESTRATOR_sheetContractQA_(); });
  safe('apiContracts', function(){ return KOL_IDS_HARDENING_RUNTIME_operationContractQA_(); });
  safe('integration', function(){ return typeof KOL_IDS_PLATFORM_INTEGRATION_QA === 'function' ? KOL_IDS_PLATFORM_INTEGRATION_QA() : {success:true,status:'NOT_AVAILABLE'}; });
  safe('transitionParity', function(){ return KOL_IDS_ORCHESTRATOR_transitionParityQA_(); });
  safe('deliverableParity', function(){ return KOL_IDS_ORCHESTRATOR_deliverableParityQA_(); });
  return {
    success: errors.length === 0,
    version: KOL_IDS.VERSION,
    hardeningVersion: KOL_IDS.RUNTIME_HARDENING.VERSION,
    status: errors.length ? 'FAILED' : 'GREEN',
    checks: checks,
    failedChecks: errors,
    readOnly: true,
    durationMs: Date.now() - started,
    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_HARDENING_certifyRuntime_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_HARDENING_certifyRuntime_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** One command for deployment preparation: repair/ensure, then certify. */
function KOL_IDS_RUNTIME_HARDENING_DEPLOY_READY() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_RUNTIME_HARDENING_DEPLOY_READY');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var startedAt = Date.now();
  Logger.log('========================================');
  Logger.log('KOL IDS 1.1.0 RUNTIME HARDENING');
  Logger.log('DEPLOY READINESS CHECK START');
  Logger.log('========================================');

  // Fail with a diagnostic instead of throwing an opaque ReferenceError when
  // this file was not imported/saved into the Apps Script project.
  var prepareFnLoaded = typeof KOL_IDS_RUNTIME_HARDENING_prepareRuntime_ === 'function';
  var certifyFnLoaded = typeof KOL_IDS_RUNTIME_HARDENING_certifyRuntime_ === 'function';

  Logger.log('[0/2] HARDENING MODULE CHECK');
  Logger.log(prepareFnLoaded && certifyFnLoaded
    ? 'OK: Runtime hardening helpers loaded.'
    : 'WARNING: One or more Runtime hardening helpers are not loaded.');

  if (!prepareFnLoaded) {
    Logger.log('❌ PREPARE STATUS: NOT LOADED');
    Logger.log('Missing function: KOL_IDS_RUNTIME_HARDENING_prepareRuntime_');
    Logger.log('Action: make sure KOL_IDS_RUNTIME_HARDENING.gs is present in this Apps Script project, saved, and run again.');
    Logger.log('========================================');
    Logger.log('❌ FINAL STATUS: NOT READY');
    Logger.log('========================================');
    return {
      success: false,
      status: 'MODULE_NOT_LOADED',
      missingFunctions: ['KOL_IDS_RUNTIME_HARDENING_prepareRuntime_'],
      durationMs: Date.now() - startedAt
    };
  }

  Logger.log('[1/2] PREPARING RUNTIME...');
  var preparation;
  try {
    preparation = KOL_IDS_RUNTIME_HARDENING_prepareRuntime_();
    if (!preparation || preparation.success !== true) {
      Logger.log('❌ PREPARE STATUS: FAILED');
      Logger.log(JSON.stringify(preparation || {success:false,status:'NO_RESULT'}, null, 2));
      Logger.log('========================================');
      Logger.log('❌ FINAL STATUS: NOT READY');
      Logger.log('========================================');
      return {
        success: false,
        status: 'PREPARE_FAILED',
        preparation: preparation || null,
        durationMs: Date.now() - startedAt
      };
    }
    Logger.log('✅ PREPARE STATUS: GREEN');
    Logger.log('Runtime preparation completed successfully.');
  } catch (e) {
    Logger.log('❌ PREPARE STATUS: EXCEPTION');
    Logger.log(String(e && e.stack ? e.stack : e));
    Logger.log('========================================');
    Logger.log('❌ FINAL STATUS: NOT READY');
    Logger.log('========================================');
    return {
      success: false,
      status: 'PREPARE_FAILED',
      error: String(e && e.message ? e.message : e),
      durationMs: Date.now() - startedAt
    };
  }

  if (!certifyFnLoaded) {
    Logger.log('❌ CERTIFICATION STATUS: NOT LOADED');
    Logger.log('Missing function: KOL_IDS_RUNTIME_HARDENING_certifyRuntime_');
    Logger.log('========================================');
    Logger.log('❌ FINAL STATUS: NOT READY');
    Logger.log('========================================');
    return {
      success: false,
      status: 'MODULE_NOT_LOADED',
      preparation: preparation,
      missingFunctions: ['KOL_IDS_RUNTIME_HARDENING_certifyRuntime_'],
      durationMs: Date.now() - startedAt
    };
  }

  Logger.log('[2/2] CERTIFYING RUNTIME...');
  var certification;
  try {
    certification = KOL_IDS_RUNTIME_HARDENING_certifyRuntime_();
    if (!certification || certification.success !== true) {
      Logger.log('❌ CERTIFICATION STATUS: FAILED');
      Logger.log(JSON.stringify(certification || {success:false,status:'NO_RESULT'}, null, 2));
      Logger.log('========================================');
      Logger.log('❌ FINAL STATUS: NOT READY');
      Logger.log('========================================');
      return {
        success: false,
        status: 'CERTIFICATION_FAILED',
        preparation: preparation,
        certification: certification || null,
        durationMs: Date.now() - startedAt
      };
    }
    Logger.log('✅ CERTIFICATION STATUS: GREEN');
  } catch (e2) {
    Logger.log('❌ CERTIFICATION STATUS: EXCEPTION');
    Logger.log(String(e2 && e2.stack ? e2.stack : e2));
    Logger.log('========================================');
    Logger.log('❌ FINAL STATUS: NOT READY');
    Logger.log('========================================');
    return {
      success: false,
      status: 'CERTIFICATION_FAILED',
      preparation: preparation,
      error: String(e2 && e2.message ? e2.message : e2),
      durationMs: Date.now() - startedAt
    };
  }

  var cohesion = null;
  if (typeof KOL_IDS_RUNTIME_COHESION_CERTIFY === 'function') {
    try {
      cohesion = KOL_IDS_RUNTIME_COHESION_CERTIFY();
      if (!cohesion || cohesion.success !== true) {
        Logger.log('❌ COHESION STATUS: FAILED');
        Logger.log(JSON.stringify(cohesion || {success:false,status:'NO_RESULT'}, null, 2));
        return {success:false,status:'COHESION_FAILED',preparation:preparation,certification:certification,cohesion:cohesion||null,durationMs:Date.now()-startedAt};
      }
      Logger.log('✅ COHESION STATUS: GREEN');
    } catch (e3) {
      Logger.log('❌ COHESION STATUS: EXCEPTION');
      Logger.log(String(e3 && e3.stack ? e3.stack : e3));
      return {success:false,status:'COHESION_FAILED',preparation:preparation,certification:certification,error:String(e3 && e3.message ? e3.message : e3),durationMs:Date.now()-startedAt};
    }
  }

  var durationMs = Date.now() - startedAt;
  Logger.log('========================================');
  Logger.log('✅ FINAL STATUS: GREEN');
  Logger.log('🚀 RUNTIME DEPLOY READY');
  Logger.log('Duration: ' + durationMs + ' ms');
  Logger.log('Next: Deploy a NEW Web App version, then test /exec.');
  Logger.log('========================================');

  return {
    success: true,
    status: 'GREEN',
    version: KOL_IDS.VERSION,
    preparation: preparation,
    certification: certification,
    cohesion: cohesion,
    nextStep: 'Deploy a NEW Web App version and run the /exec smoke test.',
    durationMs: durationMs
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_RUNTIME_HARDENING_DEPLOY_READY', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_RUNTIME_HARDENING_DEPLOY_READY', Date.now() - __kolIdsTraceStartedAt);
  }
}
