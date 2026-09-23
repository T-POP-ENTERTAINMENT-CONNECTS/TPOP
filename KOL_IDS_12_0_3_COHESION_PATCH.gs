/**
 * KOL IDS 1.2.0.3 — Full System Cohesion Patch
 *
 * Non-invasive integration hardening. Existing authority layers remain owners.
 * This module only verifies and closes missing cross-layer hand-offs:
 * RUN -> Intelligence Trace -> IDI decision evidence
 * PERFORMANCE -> Attribution -> IDI outcome -> Intelligence Learning
 * REPORT -> Intelligence evidence
 */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_1203_COHESION_QA(){
  var names=[
    'KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_',
    'KOL_IDS_CANONICAL_getContext_',
    'KOL_IDS_CANONICAL_mutate_',
    'KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT',
    'KOL_IDS_SELF_SAVE_AUDIENCE_CONTEXT',
    'KOL_IDS_SELF_SAVE',
    'KOL_IDS_SELF_SAVE_SELECTION',
    'KOL_IDS_SELF_RUN',
    'KOL_IDS_SELF_SAVE_PERFORMANCE',
    'KOL_IDS_ENGINE_runDecisionEngine',
    'KOL_IDS_ATTRIBUTION_RUN_ATTRIBUTION',
    'KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY',
    'KOL_IDS_INTEL120_recordDecisions_',
    'KOL_IDS_INTEL120_recordPerformanceRows_',
    'KOL_IDS_INTEL120_refreshLearning_',
    'KOL_IDS_INTEL120_report_',
    'KOL_IDS_IDI_syncDecisions_',
    'KOL_IDS_IDI_syncOutcomes_',
    'KOL_IDS_PRODUCT_UI_GET_REPORT'
  ];
  var checks=names.map(function(n){return {name:n,pass:typeof globalThis[n]==='function'};});
  var fail=checks.filter(function(x){return !x.pass;});
  return {success:fail.length===0,status:fail.length?'RED':'GREEN',suite:'1.2.0.3 FULL SYSTEM COHESION',checks:checks,failed:fail.length};
}

/** Called by performance authority hand-off. Never blocks a successful save. */
function KOL_IDS_1203_syncIntelligenceAfterPerformance_(rows, context){
  var out={success:true,processed:0,learning:null,errors:[]};
  try {
    if(typeof KOL_IDS_INTEL120_recordPerformanceRows_==='function'){
      var normalized=(rows||[]).map(function(r){
        r=r||{};
        return Object.assign({},r,{
          analysisId:r.analysisId||context.analysisId||'',
          campaignId:r.campaignId||context.campaignId||'',
          brandId:r.brandId||context.brandId||'',
          creatorId:r.creatorId||r.kolId||'',
          creatorName:r.creatorName||r.name||r.kolName||''
        });
      });
      var recorded=KOL_IDS_INTEL120_recordPerformanceRows_(normalized);
      out.processed=Number(recorded&&recorded.processed||0);
    }
    if(typeof KOL_IDS_INTEL120_refreshLearning_==='function'){
      out.learning=KOL_IDS_INTEL120_refreshLearning_({
        analysisId:context.analysisId||'',
        campaignId:context.campaignId||'',
        brandId:context.brandId||''
      });
    }
  } catch(e) {
    out.success=false;
    out.errors.push(String(e&&e.message||e));
    Logger.log('[COHESION][INTELLIGENCE_HANDOFF] '+out.errors[0]);
  }
  return out;
}


function KOL_IDS_1203_COHESION_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_1203_COHESION_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_1203_COHESION_QA, this, arguments);
}
