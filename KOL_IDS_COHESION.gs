/**
 * KOL IDS™ — UNIFIED COHESION / INTELLIGENCE ORCHESTRATOR
 *
 * Purpose:
 * - Make the major intelligence modules execute as one controlled pipeline.
 * - Preserve existing authorities; this file orchestrates, it does not replace them.
 * - Fail closed on missing dependencies and hard integrity violations.
 * - Treat optional downstream data (performance/attribution/learning) as SKIPPED
 *   when there is no data yet, rather than pretending a campaign has outcomes.
 *
 * Canonical flow:
 * AUTH → WORKSPACE → SAVE → DECISION → SELECTION → PORTFOLIO → PERFORMANCE
 * → ATTRIBUTION → OUTCOME → LEARNING → ADAPTIVE → REPORT → DASHBOARD → QA
 */

var KOL_IDS_COHESION_VERSION = '1.0.0';

/*
 * CORE dependencies are the minimum required to run a decision safely.
 * Downstream intelligence modules are deliberately optional because a new
 * workspace may have no performance, attribution or learning data yet.
 *
 * IMPORTANT: Do not put optional modules in the hard dependency gate.
 * Otherwise a perfectly valid first-time analysis becomes RED before any
 * outcome data exists.
 */
var KOL_IDS_COHESION_REQUIRED = Object.freeze([
  'KOL_IDS_PRODUCT_ENSURE_STRUCTURE',
  'KOL_IDS_PRODUCT_SAVE',
  'KOL_IDS_PRODUCT_RUN',
  'KOL_IDS_PRODUCT_UI_GET_STATE',
  'KOL_IDS_PRODUCT_UI_GET_REPORT',
  'KOL_IDS_ENGINE_runDecisionEngine',
  'KOL_IDS_CANONICAL_getContext_',
  'KOL_IDS_CANONICAL_mutate_'
]);

var KOL_IDS_COHESION_OPTIONAL = Object.freeze([
  'KOL_IDS_PERF_AUTHORITY_SAVE',
  'KOL_IDS_ATTRIBUTION_HEALTH',
  'KOL_IDS_GENCODE_registry_',
  'KOL_IDS_LEARNING_learningHealth_',
  'KOL_IDS_ADAPTIVE_QA',
  'KOL_IDS_PORTFOLIO_runPortfolioOptimization'
]);

function KOL_IDS_COHESION_has_(name) {
  return typeof globalThis[name] === 'function';
}

function KOL_IDS_COHESION_require_(names) {
  var missing = (names || []).filter(function(name) {
    return !KOL_IDS_COHESION_has_(name);
  });
  if (missing.length) {
    throw new Error('COHESION_DEPENDENCY_MISSING:' + missing.join(','));
  }
  return true;
}

function KOL_IDS_COHESION_context_() {
  var ctx = KOL_IDS_COHESION_has_('KOL_IDS_CANONICAL_getContext_')
    ? KOL_IDS_CANONICAL_getContext_() : {};
  ctx = ctx || {};
  ctx.analysisId = String(ctx.analysisId || '').trim();
  ctx.campaignId = String(ctx.campaignId || '').trim();
  ctx.brandId = String(ctx.brandId || '').trim();
  ctx.orgId = String(ctx.orgId || '').trim();
  ctx.selectedCreatorIds = Array.isArray(ctx.selectedCreatorIds) ? ctx.selectedCreatorIds.map(String) : [];
  return ctx;
}

function KOL_IDS_COHESION_step_(steps, name, fn, optional) {
  var started = Date.now();
  try {
    var result = fn();
    var ok = result === true || (result && result.success === true);
    if (!ok && !optional) throw new Error(String(result && (result.error || result.message) || 'Step returned unsuccessful result.'));
    steps.push({name:name, status:ok ? 'PASS' : 'SKIPPED', optional:!!optional, durationMs:Date.now()-started, result:result});
    return {ok:ok, result:result};
  } catch (e) {
    steps.push({name:name, status:optional ? 'SKIPPED' : 'FAIL', optional:!!optional, durationMs:Date.now()-started, error:String(e && e.message || e)});
    if (!optional) throw e;
    return {ok:false, error:String(e && e.message || e)};
  }
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_COHESION_HEALTH() {
  var required = KOL_IDS_COHESION_REQUIRED.slice();
  var missing = required.filter(function(name){ return !KOL_IDS_COHESION_has_(name); });
  var checks = [];
  checks.push({name:'Core dependencies', pass:missing.length===0, missing:missing});

  /*
   * Optional capabilities are reported, not promoted to hard failures.
   * This keeps health useful on a fresh workspace while still making
   * degraded capability visible to operators.
   */
  var optionalMissing = KOL_IDS_COHESION_OPTIONAL.filter(function(name){
    return !KOL_IDS_COHESION_has_(name);
  });
  checks.push({
    name:'Optional intelligence capabilities',
    pass:true,
    missing:optionalMissing,
    status:optionalMissing.length ? 'DEGRADED_OPTIONAL' : 'READY'
  });

  var context = null;
  if (!missing.length && KOL_IDS_COHESION_has_('KOL_IDS_CANONICAL_getContext_')) {
    try {
      context = KOL_IDS_COHESION_context_();
      checks.push({name:'Canonical context readable', pass:true});
    } catch(e) {
      checks.push({name:'Canonical context readable', pass:false, error:String(e.message||e)});
    }
  }
  return {
    success: checks.every(function(x){return x.pass;}),
    status: checks.every(function(x){return x.pass;}) ? 'GREEN' : 'RED',
    version: KOL_IDS_COHESION_VERSION,
    productVersion: typeof KOL_IDS !== 'undefined' ? KOL_IDS.VERSION : '',
    required: required,
    checks: checks,
    context: context,
    checkedAt: new Date()
  };
}

function KOL_IDS_COHESION_VERIFY_INVARIANTS_() {
  var ctx = KOL_IDS_COHESION_context_();
  var failures = [];
  if (ctx.analysisId && !ctx.campaignId) failures.push('ANALYSIS_WITHOUT_CAMPAIGN');
  if (ctx.analysisId && !ctx.brandId) failures.push('ANALYSIS_WITHOUT_BRAND');
  if (ctx.selectedCreatorIds.length && !ctx.campaignId) failures.push('SELECTION_WITHOUT_CAMPAIGN');
  var state = KOL_IDS_PRODUCT_UI_GET_STATE();
  if (ctx.analysisId && String(state.analysisId||'') && String(state.analysisId) !== ctx.analysisId) failures.push('PRODUCT_CANONICAL_ANALYSIS_MISMATCH');
  if (ctx.campaignId && String(state.campaignId||'') && String(state.campaignId) !== ctx.campaignId) failures.push('PRODUCT_CANONICAL_CAMPAIGN_MISMATCH');
  if (ctx.brandId && String(state.brandId||'') && String(state.brandId) !== ctx.brandId) failures.push('PRODUCT_CANONICAL_BRAND_MISMATCH');
  if (Number(state.decisionRows||0) < 0) failures.push('NEGATIVE_DECISION_COUNT');
  return {success:failures.length===0, failures:failures, context:ctx, state:state};
}

/**
 * Full product intelligence run. Pass {savePayload:<payload>} when a new
 * analysis should be saved before running. Downstream outcome steps are
 * optional and require real supplied data; no fake performance is generated.
 */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_COHESION_RUN_FULL(options) {
  options = options || {};
  KOL_IDS_COHESION_require_([
    'KOL_IDS_PRODUCT_ENSURE_STRUCTURE',
    'KOL_IDS_PRODUCT_RUN',
    'KOL_IDS_PRODUCT_UI_GET_STATE',
    'KOL_IDS_PRODUCT_UI_GET_REPORT',
    'KOL_IDS_CANONICAL_getContext_'
  ]);

  /*
   * Use a USER lock at orchestration level.
   *
   * Several downstream authorities (Portfolio, Canonical Mutation,
   * Performance, etc.) intentionally use the SCRIPT lock themselves.
   * Holding the SCRIPT lock here would deadlock those nested calls and
   * cause optional steps to be skipped or fail with LOCK_BUSY.
   *
   * User lock still prevents accidental double-click / duplicate runs by
   * the same operator while allowing independent customer workspaces to
   * execute concurrently.
   */
  var lock = LockService.getUserLock();
  if (!lock.tryLock(15000)) throw new Error('COHESION_LOCK_BUSY: another intelligence run is in progress for this user.');
  var started = Date.now();
  var steps = [];
  try {
    KOL_IDS_PRODUCT_ENSURE_STRUCTURE();

    if (options.savePayload) {
      KOL_IDS_COHESION_step_(steps, 'SAVE / persist current analysis', function(){
        return KOL_IDS_PRODUCT_SAVE(options.savePayload);
      }, false);
    }

    var run = KOL_IDS_COHESION_step_(steps, 'DECISION / Fit + Impact + Evidence + Confidence + Learning', function(){
      return KOL_IDS_PRODUCT_RUN();
    }, false).result;

    /*
     * IMPORTANT: Product Run returns the authoritative execution context,
     * while the Cohesion layer reads the canonical context store. Older
     * deployments could complete Product Run successfully but leave the
     * canonical context without campaignId/brandId, causing a false
     * COHESION_CONTEXT_INCOMPLETE failure immediately after a valid run.
     *
     * Bridge the two layers explicitly. Do not invent/fallback IDs: only
     * accept IDs returned by Product Run and verify them against any existing
     * canonical analysis context. This keeps one identity across modules.
     */
    var contextBeforeRun = KOL_IDS_COHESION_context_();
    var runAnalysisId = String(run && run.analysisId || '').trim();
    var runCampaignId = String(run && run.campaignId || '').trim();
    var runBrandId = String(run && run.brandId || '').trim();

    if (!runAnalysisId || !runCampaignId || !runBrandId) {
      throw new Error('COHESION_RUN_CONTEXT_INCOMPLETE: Product Run did not return analysisId, campaignId and brandId.');
    }

    if (contextBeforeRun.analysisId && contextBeforeRun.analysisId !== runAnalysisId) {
      throw new Error(
        'COHESION_STALE_CONTEXT: canonical analysisId=' +
        contextBeforeRun.analysisId +
        ' but Product Run returned analysisId=' + runAnalysisId + '.'
      );
    }

    if (contextBeforeRun.campaignId && contextBeforeRun.campaignId !== runCampaignId) {
      throw new Error(
        'COHESION_CONTEXT_MISMATCH: canonical campaignId=' +
        contextBeforeRun.campaignId +
        ' but Product Run returned campaignId=' + runCampaignId + '.'
      );
    }

    if (contextBeforeRun.brandId && contextBeforeRun.brandId !== runBrandId) {
      throw new Error(
        'COHESION_CONTEXT_MISMATCH: canonical brandId=' +
        contextBeforeRun.brandId +
        ' but Product Run returned brandId=' + runBrandId + '.'
      );
    }

    var context = contextBeforeRun;
    if (typeof KOL_IDS_CANONICAL_mutate_ === 'function') {
      context = KOL_IDS_CANONICAL_mutate_(context, 'COHESION_SYNC_PRODUCT_RUN_CONTEXT', 'RUN', function(c) {
        c.analysisId = runAnalysisId;
        c.campaignId = runCampaignId;
        c.brandId = runBrandId;
        if (run && run.orgId && !c.orgId) c.orgId = String(run.orgId).trim();
        c.stage = 'RUN_COMPLETE';
        c.run = c.run || {};
        c.run.executionContext = {
          analysisId: runAnalysisId,
          campaignId: runCampaignId,
          brandId: runBrandId
        };
        return c;
      });
    } else {
      /* Required dependency gate should normally prevent this path. */
      throw new Error('COHESION_CANONICAL_MUTATION_UNAVAILABLE');
    }

    /* Re-read after the bridge so every downstream step uses one canonical context. */
    context = KOL_IDS_COHESION_context_();
    if (context.analysisId !== runAnalysisId ||
        context.campaignId !== runCampaignId ||
        context.brandId !== runBrandId) {
      throw new Error('COHESION_CONTEXT_SYNC_FAILED: canonical context does not match Product Run context.');
    }

    KOL_IDS_COHESION_step_(steps, 'PORTFOLIO / budget + coverage + risk + synergy', function(){
      return KOL_IDS_PORTFOLIO_runPortfolioOptimization();
    }, true);

    if (options.performancePayload) {
      KOL_IDS_COHESION_step_(steps, 'PERFORMANCE / canonical Performance Authority', function(){
        return KOL_IDS_SELF_SAVE_PERFORMANCE(options.performancePayload);
      }, false);
    } else {
      steps.push({name:'PERFORMANCE / canonical Performance Authority',status:'SKIPPED',optional:true,reason:'No real performance payload supplied; no outcome is fabricated.'});
    }

    if (options.attributionPayload) {
      KOL_IDS_COHESION_step_(steps, 'ATTRIBUTION / transactions + refunds + attribution', function(){
        return KOL_IDS_ATTRIBUTION_RUN_ATTRIBUTION(options.attributionPayload);
      }, false);
    } else {
      steps.push({name:'ATTRIBUTION / transactions + refunds + attribution',status:'SKIPPED',optional:true,reason:'No transaction/refund payload supplied.'});
    }

    if (context.orgId && context.brandId && context.campaignId && KOL_IDS_COHESION_has_('KOL_IDS_LEARNING_learnCampaign_')) {
      KOL_IDS_COHESION_step_(steps, 'LEARNING / outcome → recommendation learning', function(){
        return KOL_IDS_LEARNING_learnCampaign_(context.orgId,context.brandId,context.campaignId);
      }, true);
    } else {
      steps.push({name:'LEARNING / outcome → recommendation learning',status:'SKIPPED',optional:true,reason:'No orgId or no learning function available.'});
    }

    if (KOL_IDS_COHESION_has_('KOL_IDS_ADAPTIVE_rebuildIntelligence')) {
      KOL_IDS_COHESION_step_(steps, 'ADAPTIVE / refresh creator intelligence', function(){
        return KOL_IDS_ADAPTIVE_rebuildIntelligence();
      }, true);
    }

    KOL_IDS_COHESION_step_(steps, 'REPORT / current decision report integrity', function(){
      var report = KOL_IDS_PRODUCT_UI_GET_REPORT();
      var state = KOL_IDS_PRODUCT_UI_GET_STATE();
      if (!report || Number(report.count||0) !== Number(state.decisionRows||0)) {
        throw new Error('REPORT_DECISION_MISMATCH');
      }
      return {success:true,count:Number(report.count||0)};
    }, false);

    if (KOL_IDS_COHESION_has_('KOL_IDS_DASHBOARD_buildExecutiveDashboard')) {
      KOL_IDS_COHESION_step_(steps, 'DASHBOARD / executive refresh', function(){
        return KOL_IDS_DASHBOARD_buildExecutiveDashboard() || {success:true};
      }, true);
    }

    var invariants = KOL_IDS_COHESION_VERIFY_INVARIANTS_();
    steps.push({name:'FINAL / cross-module invariants',status:invariants.success?'PASS':'FAIL',result:invariants});
    if (!invariants.success) throw new Error('COHESION_INVARIANT_FAILURE:' + invariants.failures.join(','));

    return {
      success:true,
      status:'COHESION_PASSED',
      version:KOL_IDS_COHESION_VERSION,
      analysisId:context.analysisId,
      campaignId:context.campaignId,
      brandId:context.brandId,
      selectedCreatorIds:context.selectedCreatorIds,
      steps:steps,
      run:run,
      durationMs:Date.now()-started
    };
  } finally {
    lock.releaseLock();
  }
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_COHESION_QA() {
  var health = KOL_IDS_COHESION_HEALTH();
  var duplicateNames = [];
  var required = KOL_IDS_COHESION_REQUIRED.slice();
  var checks = [{name:'Dependencies',pass:health.success}];
  if (typeof KOL_IDS_RELEASE_ASSERT_MANIFEST_ === 'function') {
    try { checks.push({name:'Release manifest',pass:KOL_IDS_RELEASE_ASSERT_MANIFEST_()===true}); } catch(e) { checks.push({name:'Release manifest',pass:false,error:String(e.message||e)}); }
  }
  if (typeof KOL_IDS_RELEASE_QA_ASSERT_NO_COMPETING_PRODUCT_AUTHORITY_ === 'function') {
    try { checks.push({name:'Single product authority',pass:KOL_IDS_RELEASE_QA_ASSERT_NO_COMPETING_PRODUCT_AUTHORITY_()===true}); } catch(e) { checks.push({name:'Single product authority',pass:false,error:String(e.message||e)}); }
  }
  try {
    var inv = KOL_IDS_COHESION_VERIFY_INVARIANTS_();
    checks.push({name:'Cross-module invariants',pass:inv.success,result:inv});
  } catch(e) {
    checks.push({name:'Cross-module invariants',pass:false,error:String(e.message||e)});
  }
  return {success:checks.every(function(x){return x.pass;}),version:KOL_IDS_COHESION_VERSION,required:required,checks:checks,duplicateNames:duplicateNames,health:health};
}


function KOL_IDS_COHESION_HEALTH() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_COHESION_HEALTH', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_COHESION_HEALTH, this, arguments);
}


function KOL_IDS_COHESION_RUN_FULL() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_COHESION_RUN_FULL', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_COHESION_RUN_FULL, this, arguments);
}


function KOL_IDS_COHESION_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_COHESION_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_COHESION_QA, this, arguments);
}
