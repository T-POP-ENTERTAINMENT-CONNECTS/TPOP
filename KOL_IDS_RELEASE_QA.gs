/**
 * KOL IDS™ 1.1.0 — MASTER RELEASE QA
 *
 * Static/runtime contract gate. Safe by default: no customer business data is
 * created, deleted, or modified by the read-only gate.
 *
 * Live E2E note: a real deployed Apps Script /exec invocation is required to
 * certify OAuth, Session, Sheet permissions, quotas, and concurrency. This
 * runner prepares the exact gate; it does not fake a live certification.
 */
function KOL_IDS_RELEASE_QA_REQUIRED_FUNCTIONS_(){
  return [
    'doGet','doPost','KOL_IDS_SELF_SERVICE_BOOTSTRAP','KOL_IDS_SELF_GET_STATE',
    'KOL_IDS_SELF_SAVE','KOL_IDS_SELF_SAVE_SELECTION','KOL_IDS_SELF_RUN',
    'KOL_IDS_SELF_GET_REPORT','KOL_IDS_SELF_GET_HISTORY','KOL_IDS_SELF_EXPORT_REPORT',
    'KOL_IDS_SELF_RESET','KOL_IDS_PRODUCT_SETUP','KOL_IDS_PRODUCT_SAVE','KOL_IDS_PRODUCT_RUN',
    'KOL_IDS_PRODUCT_UI_GET_STATE','KOL_IDS_PRODUCT_UI_GET_REPORT',
    'KOL_IDS_PRODUCT_BUILD_REPORT','KOL_IDS_ENGINE_runDecisionEngine',
    'KOL_IDS_CANONICAL_getContext_','KOL_IDS_CANONICAL_mutate_',
    'KOL_IDS_CANONICAL_persist_','KOL_IDS_CANONICAL_MUTATION_mutationLock_',
    'KOL_IDS_GENCODE_registry_','KOL_IDS_SELF_SAVE_GEN_CODES',
    'KOL_IDS_ATTRIBUTION_HEALTH','KOL_IDS_SECURITY_ASSERT_USER_',
    'KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_',
    'KOL_IDS_E2E_CERTIFICATION_STATIC_QA','KOL_IDS_E2E_CERTIFICATION_RECOVERY_MATRIX'
  ];
}

function KOL_IDS_RELEASE_QA_ASSERT_NO_COMPETING_PRODUCT_AUTHORITY_(){
  if(typeof KOL_IDS_PRODUCT_SETUP!=='function' || typeof KOL_IDS_PRODUCT_SAVE!=='function' || typeof KOL_IDS_PRODUCT_RUN!=='function') {
    throw new Error('PRODUCT_EXECUTION_AUTHORITY_MISSING');
  }
  if(typeof KBIS_PRODUCT_OPEN_GUIDE==='function') throw new Error('LEGACY_PRODUCT_GUIDE_AUTHORITY_STILL_EXPOSED');
  if(typeof KBIS_PRODUCT_RUN==='function' || typeof KBIS_PRODUCT_SAVE==='function') throw new Error('LEGACY_PRODUCT_EXECUTION_AUTHORITY_STILL_EXPOSED');
  return true;
}


function KOL_IDS_RELEASE_QA_COMMERCIAL_CONTRACT_(){
  var c=KOL_IDS_COMMERCIAL_CONFIG;
  if(!c) throw new Error('COMMERCIAL_CONFIG_MISSING');
  var plans=c.PRICING||{};
  var canonical=KOL_IDS_PRICING_AUTHORITY_();
  var expected={THREE_MONTHS:Number(canonical.PLANS.THREE_MONTHS.price),SIX_MONTHS:Number(canonical.PLANS.SIX_MONTHS.price),ONE_YEAR:Number(canonical.PLANS.ONE_YEAR.price)};
  var accounts={THREE_MONTHS:1,SIX_MONTHS:2,ONE_YEAR:3};
  Object.keys(expected).forEach(function(k){
    if(!plans[k] || Number(plans[k].price)!==expected[k]) throw new Error('PRICE_MISMATCH:'+k);
    if(Number(plans[k].maxAccounts||0)!==accounts[k]) throw new Error('ACCOUNT_ENTITLEMENT_MISMATCH:'+k);
  });
  var trial=KOL_IDS_COMMERCIAL_TRIAL_POLICY();
  if(Number(trial.days)!==7 || Number(trial.maxAccounts)!==1 || trial.reportExport!==false) throw new Error('TRIAL_POLICY_MISMATCH');
  return true;
}

function KOL_IDS_RELEASE_QA_CANONICAL_CHAIN_(){
  var chain=[
    'KOL_IDS_SELF_SERVICE_BOOTSTRAP','KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT',
    'KOL_IDS_SELF_SAVE_AUDIENCE_CONTEXT','KOL_IDS_SELF_SAVE_DECISION_CONTEXT',
    'KOL_IDS_SELF_SAVE','KOL_IDS_SELF_SAVE_SELECTION','KOL_IDS_SELF_RUN',
    'KOL_IDS_SELF_SAVE_GEN_CODES','KOL_IDS_SELF_SAVE_PERFORMANCE',
    'KOL_IDS_SELF_GET_REPORT','KOL_IDS_SELF_GET_HISTORY'
  ];
  var missing=chain.filter(function(n){return typeof globalThis[n]!=='function';});
  if(missing.length) throw new Error('CANONICAL_CHAIN_MISSING:'+missing.join(','));
  return true;
}

function KOL_IDS_RELEASE_QA_RUNTIME_CONTRACT_(){
  var checks=[];
  var check=function(name,fn){
    try{
      var value=fn();
      var pass=value===true || (value && value.success===true);
      checks.push({name:name,pass:pass,detail:pass?'':String((value&&value.error)||'Contract returned false')});
    }catch(e){
      checks.push({name:name,pass:false,detail:String(e&&e.message||e),error:String(e&&e.stack||'')});
    }
  };
  check('Release manifest',function(){return KOL_IDS_RELEASE_ASSERT_MANIFEST_();});
  check('Required functions',function(){var missing=KOL_IDS_RELEASE_QA_REQUIRED_FUNCTIONS_().filter(function(name){return typeof globalThis[name]!=='function';});if(missing.length)throw new Error('REQUIRED_FUNCTIONS_MISSING:'+missing.join(','));return true;});
  check('Single product execution authority',function(){return KOL_IDS_RELEASE_QA_ASSERT_NO_COMPETING_PRODUCT_AUTHORITY_();});
  check('Canonical mutation lock',function(){if(typeof KOL_IDS_CANONICAL_MUTATION_mutationLock_!=='function')throw new Error('CANONICAL_MUTATION_LOCK_MISSING');return true;});
  check('Canonical customer chain',function(){return KOL_IDS_RELEASE_QA_CANONICAL_CHAIN_();});
  check('Commercial contract',function(){return KOL_IDS_RELEASE_QA_COMMERCIAL_CONTRACT_();});
  check('Pricing authority',function(){return KOL_IDS_PRICING_ASSERT_CANONICAL_();});
  check('Gen Code workspace registry',function(){if(KOL_IDS_GENCODE_GENCODE.REGISTRY_SHEET!=='ENT_GENCODE_REGISTRY')throw new Error('GENCODE_REGISTRY_SCOPE_MISMATCH');return true;});
  check('Report hardening',function(){if(typeof KOL_IDS_PRODUCT_BUILD_REPORT!=='function'||typeof KOL_IDS_PRODUCT_UI_GET_REPORT!=='function')throw new Error('REPORT_AUTHORITY_MISSING');return true;});
  check('Security gate',function(){if(typeof KOL_IDS_SECURITY_ASSERT_USER_!=='function')throw new Error('SECURITY_GATE_MISSING');return true;});
  check('Runtime boundary',function(){if(typeof doGet!=='function'||typeof doPost!=='function')throw new Error('WEB_ENTRYPOINT_MISSING');return true;});
  check('E2E certification static contract',function(){return KOL_IDS_E2E_CERTIFICATION_STATIC_QA().success===true;});
  check('E2E recovery matrix contract',function(){return KOL_IDS_E2E_CERTIFICATION_RECOVERY_MATRIX().success===true;});
  var failed=checks.filter(function(x){return !x.pass;});
  return {success:failed.length===0,status:failed.length?'FAILED':'PASSED',release:KOL_IDS_RELEASE_getFingerprint(),checks:checks,summary:{passed:checks.filter(function(x){return x.pass;}).length,failed:failed.length,total:checks.length}};
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_LIVE_E2E_QA(){
  KOL_IDS_SECURITY_ASSERT_USER_();
  var checks=[],failures=[],warnings=[];
  var check=function(name,fn){try{var r=fn();var pass=r===true || (r&&r.success===true);checks.push({name:name,pass:pass,result:r});if(!pass)failures.push(name);}catch(e){checks.push({name:name,pass:false,error:String(e&&e.message||e)});failures.push(name);}};
  check('Release manifest',function(){return KOL_IDS_RELEASE_ASSERT_MANIFEST_();});
  check('Workspace resolution',function(){return !!KOL_IDS_SYSTEM_getSpreadsheet_();});
  check('Product setup',function(){return KOL_IDS_PRODUCT_SETUP().success===true;});
  check('Runtime health',function(){return KOL_IDS_RUNTIME_ENTERPRISE_RUNTIME_HEALTH_().success===true;});
  check('Gen Code health',function(){return KOL_IDS_GENCODE_HEALTH().success===true;});
  check('Attribution health',function(){return KOL_IDS_ATTRIBUTION_HEALTH().success===true;});
  check('Strict production QA',function(){return KOL_IDS_FULL_LOOP_QA_STRICT_PRODUCTION_QA().success===true;});
  warnings.push('A true live certification still requires an actual deployed /exec URL and controlled test accounts for login/session, multi-account isolation, concurrency, trial conversion, renewal and upgrade.');
  var liveReady=failures.length===0; return {success:liveReady,status:failures.length?'FAILED':'PASSED_WITH_LIVE_GATES_PENDING',release:KOL_IDS_RELEASE_getFingerprint(),checks:checks,failures:failures,warnings:warnings,liveCertification:false,certificationGate:'BROWSER_AND_RECOVERY_EVIDENCE_REQUIRED'};
}


function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_QA_PRICING_COHESION(){
  var a=KOL_IDS_PRICING_AUTHORITY_();
  var canonical=KOL_IDS_PRICING_AUTHORITY_();
  var expected={THREE_MONTHS:Number(canonical.PLANS.THREE_MONTHS.price),SIX_MONTHS:Number(canonical.PLANS.SIX_MONTHS.price),ONE_YEAR:Number(canonical.PLANS.ONE_YEAR.price)};
  var out={currency:a.CURRENCY,plans:{},upgrade:{}};
  Object.keys(expected).forEach(function(k){
    var p=a.PLANS[k];
    if(!p||Number(p.price)!==expected[k]) throw new Error('PRICING_COHESION_MISMATCH_'+k);
    out.plans[k]={key:p.key,months:p.months,price:p.price};
  });
  if(a.CURRENCY!=='THB') throw new Error('PRICING_CURRENCY_MISMATCH');
  out.upgrade={
    THREE_TO_SIX:a.PLANS.SIX_MONTHS.price-a.PLANS.THREE_MONTHS.price,
    THREE_TO_TWELVE:a.PLANS.ONE_YEAR.price-a.PLANS.THREE_MONTHS.price,
    SIX_TO_TWELVE:a.PLANS.ONE_YEAR.price-a.PLANS.SIX_MONTHS.price
  };
  if(out.upgrade.THREE_TO_SIX!==a.PLANS.SIX_MONTHS.price-a.PLANS.THREE_MONTHS.price||out.upgrade.THREE_TO_TWELVE!==a.PLANS.ONE_YEAR.price-a.PLANS.THREE_MONTHS.price||out.upgrade.SIX_TO_TWELVE!==a.PLANS.ONE_YEAR.price-a.PLANS.SIX_MONTHS.price) throw new Error('PRICING_UPGRADE_COHESION_MISMATCH');
  return {success:true,status:'GREEN',pricing:out,note:'Canonical pricing is owned by KOL_IDS_PRICING_AUTHORITY and synchronized from the release manifest.'};
}


/** Browser-independent production UI contract inventory. It verifies the canonical
 * served UI contains explicit action bindings for every transactional control.
 * It does not pretend to be a browser click test. */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_QA_UI_BUTTON_INVENTORY(){
  var html=HtmlService.createHtmlOutputFromFile('KOL_IDS_UI').getContent();
  var required=[
    ['campaign-draft','btnCampaignDraft'],['campaign-continue','btnCampaignContinue'],
    ['audience-back','btnAudienceBack'],['audience-continue','btnAudienceContinue'],
    ['add-kol','btnAddKOL'],['persona-back','btnPersonaBack'],['analyze-kols','btnAnalyzeKOLs'],
    ['decision-back','btnDecisionBack'],['decision-save','btnDecisionSave'],
    ['review-back','btnReviewBack'],['run-decision','btnRunDecision'],
    ['gen-codes','btnGenerateCodes'],['regen-codes','btnRegenerateCodes'],
    ['impact-back','btnImpactBack'],['save-performance','btnSavePerformance']
  ];
  var checks=[],missing=[];
  required.forEach(function(x){var action=x[0],id=x[1],hasId=html.indexOf('id="'+id+'"')>=0,hasAction=html.indexOf('data-kol-action="'+action+'"')>=0;var pass=hasId&&hasAction;checks.push({name:action+' / '+id,pass:pass,detail:pass?'bound':'missing '+(!hasId?'id ':'')+(!hasAction?'action':'')});if(!pass)missing.push(action);});
  var canonical=html.indexOf("include('KOL_IDS_UI_RPC')")>=0&&html.indexOf("include('KOL_IDS_UI_RENDER')")>=0;
  checks.push({name:'Canonical UI includes RPC + Render',pass:canonical});if(!canonical)missing.push('canonical-includes');
  return {success:missing.length===0,status:missing.length?'FAILED':'PASSED',checks:checks,summary:{passed:checks.filter(function(x){return x.pass;}).length,failed:checks.filter(function(x){return !x.pass;}).length,total:checks.length},note:'Static UI contract only; real /exec browser clicking remains a live deployment gate.'};
}


function KOL_IDS_RELEASE_LIVE_E2E_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RELEASE_LIVE_E2E_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_LIVE_E2E_QA, this, arguments);
}


function KOL_IDS_RELEASE_QA_PRICING_COHESION() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RELEASE_QA_PRICING_COHESION', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_QA_PRICING_COHESION, this, arguments);
}


function KOL_IDS_RELEASE_QA_UI_BUTTON_INVENTORY() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RELEASE_QA_UI_BUTTON_INVENTORY', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_QA_UI_BUTTON_INVENTORY, this, arguments);
}
