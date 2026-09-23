/**
 * KOL IDS™ 1.1.0 — Enterprise Hardening
 *
 * Single owner for commercial pricing, runtime cohesion, scalable read paths,
 * and conservative decision calibration.
 */
function KOL_IDS_PRICING_AUTHORITY_(){
  /* Single immutable commercial source of truth. Prices are read from the
     release manifest so the catalog cannot silently diverge from release data. */
  if (!KOL_IDS_PRICING_AUTHORITY_._catalog) {
    var m=KOL_IDS_RELEASE_MANIFEST.COMMERCIAL;
    KOL_IDS_PRICING_AUTHORITY_._catalog = Object.freeze({
      CURRENCY:'THB',
      VERSION:'KOL_IDS_PRICING_CANONICAL',
      PLANS:Object.freeze({
        THREE_MONTHS:Object.freeze({key:'3_MONTHS',name:'3 Months',months:3,price:Number(m.PLANS.THREE_MONTHS)}),
        SIX_MONTHS:Object.freeze({key:'6_MONTHS',name:'6 Months',months:6,price:Number(m.PLANS.SIX_MONTHS)}),
        ONE_YEAR:Object.freeze({key:'1_YEAR',name:'12 Months',months:12,price:Number(m.PLANS.TWELVE_MONTHS)})
      }),
    });
  }
  return KOL_IDS_PRICING_AUTHORITY_._catalog;
}

function KOL_IDS_PRICING_PUBLIC_(){
  var a=KOL_IDS_PRICING_AUTHORITY_();
  return {
    currency:a.CURRENCY,
    version:a.VERSION,
    plans:Object.keys(a.PLANS).map(function(k){
      var p=a.PLANS[k];
      return {key:p.key,name:p.name,months:p.months,price:p.price};
    }),
    upgrade6MTo1Y:a.PLANS.ONE_YEAR.price-a.PLANS.SIX_MONTHS.price
  };
}

function KOL_IDS_PRICING_ASSERT_CANONICAL_(){
  var a=KOL_IDS_PRICING_AUTHORITY_();
  var m=KOL_IDS_RELEASE_MANIFEST.COMMERCIAL;
  var expected={THREE_MONTHS:Number(m.PLANS.THREE_MONTHS),SIX_MONTHS:Number(m.PLANS.SIX_MONTHS),ONE_YEAR:Number(m.PLANS.TWELVE_MONTHS)};
  Object.keys(expected).forEach(function(k){
    if(!a.PLANS[k] || Number(a.PLANS[k].price)!==expected[k]) throw new Error('PRICING_CANONICAL_MISMATCH_'+k);
  });
  if(a.CURRENCY!==m.CURRENCY) throw new Error('PRICING_CURRENCY_MISMATCH');
  if(a.PLANS.THREE_MONTHS.months!==3||a.PLANS.SIX_MONTHS.months!==6||a.PLANS.ONE_YEAR.months!==12) throw new Error('PRICING_DURATION_MISMATCH');
  if(Object.isFrozen && (!Object.isFrozen(a)||!Object.isFrozen(a.PLANS))) throw new Error('PRICING_CATALOG_NOT_IMMUTABLE');
  var upgrade3to6=a.PLANS.SIX_MONTHS.price-a.PLANS.THREE_MONTHS.price;
  var upgrade3to12=a.PLANS.ONE_YEAR.price-a.PLANS.THREE_MONTHS.price;
  var upgrade6to12=a.PLANS.ONE_YEAR.price-a.PLANS.SIX_MONTHS.price;
  return {success:true,owner:'KOL_IDS_PRICING_AUTHORITY',version:a.VERSION,pricing:KOL_IDS_PRICING_PUBLIC_(),upgrade3MTo6M:upgrade3to6,upgrade3MTo1Y:upgrade3to12,upgrade6MTo1Y:upgrade6to12};
}

/* ---------------------------------------------------------
 * Runtime cohesion certification: structural, deterministic, fail-closed.
 * This does not pretend to be a live browser acceptance test.
 * --------------------------------------------------------- */
/* -------------------------------------------------------------------------
 * Canonical SCALE contract adapters.
 *
 * The 1.1.0 release cohesion contract owns these two public entry points. The
 * implementation remains in KOL_IDS_SCALE.gs under private names so the
 * public contract has one deterministic owner and cannot be shadowed by
 * Apps Script multi-file load order.
 * ------------------------------------------------------------------------- */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SCALE_getCapacity(token){
  if(typeof KOL_IDS_SCALE_getCapacity_impl_!=='function'){
    throw new Error('Scale implementation is not loaded: KOL_IDS_SCALE_getCapacity_impl_');
  }
  return KOL_IDS_SCALE_getCapacity_impl_(token);
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SCALE_archiveCampaign(token,campaignId,options){
  if(typeof KOL_IDS_SCALE_archiveCampaign_impl_!=='function'){
    throw new Error('Scale implementation is not loaded: KOL_IDS_SCALE_archiveCampaign_impl_');
  }
  return KOL_IDS_SCALE_archiveCampaign_impl_(token,campaignId,options);
}



function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_ARCHITECTURE_QA(){
  var failures=[],checks=[];
  function t(name,ok,detail){checks.push({name:name,pass:!!ok,detail:detail||''});if(!ok)failures.push({name:name,detail:detail||''});}
  var release=String(KOL_IDS_RELEASE_MANIFEST.RELEASE_ID);
  t('single release identity',typeof KOL_IDS!=='undefined'&&String(KOL_IDS.VERSION)===release&&typeof KOL_IDS_RELEASE!=='undefined'&&String(KOL_IDS_RELEASE.VERSION)===release,'Active release layers must resolve to '+release+'.');
  var pricing=KOL_IDS_PRICING_AUTHORITY_(),p=pricing.PLANS;
  t('pricing authority',p.THREE_MONTHS.price===39000&&p.SIX_MONTHS.price===73900&&p.ONE_YEAR.price===139000,'Commercial authority must be THB 39,000 / 73,900 / 139,000.');
  t('pricing upgrade deltas',p.SIX_MONTHS.price-p.THREE_MONTHS.price===34900&&p.ONE_YEAR.price-p.THREE_MONTHS.price===100000&&p.ONE_YEAR.price-p.SIX_MONTHS.price===65100,'Upgrade deltas must be THB 34,900 / 100,000 / 65,100.');
  t('creator id authority',typeof KOL_IDS_ARCH_creatorId_==='function'&&typeof KOL_IDS_ARCH_normalizeCreator_==='function','Creator identity helpers are required.');
  t('canonical state authority',typeof KOL_IDS_ARCH_getCanonicalContext_==='function'&&typeof KOL_IDS_ARCH_writeCanonical_==='function','Canonical context must be stored in ENT_CANONICAL_STATE.');
  t('admin dual control',typeof KOL_IDS_ARCH_assertAdminIdentityAndPin_==='function','Admin mutation must require identity and PIN.');
  t('batch write helper',typeof KOL_IDS_ARCH_batchAppend_==='function','Batch append helper must be available for write-heavy paths.');
  t('bounded/indexed read helper',typeof KOL_IDS_ARCH_findRowByColumnValue_==='function'&&typeof KOL_IDS_ARCH_readIndex_==='function','Hot paths must support indexed/bounded reads.');
  return {success:failures.length===0,release:release,checks:checks,failures:failures,pricing:KOL_IDS_PRICING_PUBLIC_(),storage:{canonical:'ENT_CANONICAL_STATE',userProperties:'POINTER_SESSION_REVISION_HASH_ONLY'}};
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RUNTIME_COHESION_CERTIFY(){
  var required=[
    'KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_',
    'KOL_IDS_COMMERCIAL_GET_ACCESS',
    'KOL_IDS_WORKFLOW_getWorkflow',
    'KOL_IDS_WORKFLOW_savePerformanceBatch',
    'KOL_IDS_WORKFLOW_getCampaignReport',
    'KOL_IDS_ACCURACY_ENGINE_signal_',
    'KOL_IDS_ACCURACY_ENGINE_backtest',
    'KOL_IDS_ACCURACY_ENGINE_accuracyLab',
    'KOL_IDS_SCALE_getCapacity',
    'KOL_IDS_SCALE_archiveCampaign',
    'KOL_IDS_CANONICAL_getContext_',
    'KOL_IDS_CANONICAL_mutate_'
  ];
  var availability={
    KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_:typeof KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_==='function',
    KOL_IDS_COMMERCIAL_GET_ACCESS:typeof KOL_IDS_COMMERCIAL_GET_ACCESS==='function',
    KOL_IDS_WORKFLOW_getWorkflow:typeof KOL_IDS_WORKFLOW_getWorkflow==='function',
    KOL_IDS_WORKFLOW_savePerformanceBatch:typeof KOL_IDS_WORKFLOW_savePerformanceBatch==='function',
    KOL_IDS_WORKFLOW_getCampaignReport:typeof KOL_IDS_WORKFLOW_getCampaignReport==='function',
    KOL_IDS_ACCURACY_ENGINE_signal_:typeof KOL_IDS_ACCURACY_ENGINE_signal_==='function',
    KOL_IDS_ACCURACY_ENGINE_backtest:typeof KOL_IDS_ACCURACY_ENGINE_backtest==='function',
    KOL_IDS_ACCURACY_ENGINE_accuracyLab:typeof KOL_IDS_ACCURACY_ENGINE_accuracyLab==='function',
    KOL_IDS_SCALE_getCapacity:typeof KOL_IDS_SCALE_getCapacity==='function',
    KOL_IDS_SCALE_archiveCampaign:typeof KOL_IDS_SCALE_archiveCampaign==='function',
    KOL_IDS_CANONICAL_getContext_:typeof KOL_IDS_CANONICAL_getContext_==='function',
    KOL_IDS_CANONICAL_mutate_:typeof KOL_IDS_CANONICAL_mutate_==='function'
  };
  var missing=required.filter(function(name){return availability[name]!==true;});
  var pricing=KOL_IDS_PRICING_ASSERT_CANONICAL_();
  return {
    success:missing.length===0,
    version:typeof KOL_IDS!=='undefined'&&KOL_IDS.VERSION?KOL_IDS.VERSION:'UNKNOWN',
    runtimeVersion:typeof KOL_IDS_ENTERPRISE_RUNTIME!=='undefined'?KOL_IDS_ENTERPRISE_RUNTIME.VERSION:'UNKNOWN',
    pricingOwner:'KOL_IDS_PRICING_AUTHORITY',
    pricingVersion:pricing.version,
    missingFunctions:missing,
    liveAcceptanceRequired:true,
    checks:['FUNCTION_BOUNDARY','PRICING_SINGLE_OWNER','DECISION_ENGINE_BOUNDARY','LEARNING_BOUNDARY','SCALE_BOUNDARY','CANONICAL_FLOW_BOUNDARY']
  };
}


function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_ENTERPRISE_HEALTHCHECK(){
  var pricing=KOL_IDS_PRICING_ASSERT_CANONICAL_();
  var runtime=KOL_IDS_RUNTIME_COHESION_CERTIFY();
  var critical=[
    'KOL_IDS_CORE_analyze',
    'KOL_IDS_CORE_selectCreator',
    'KOL_IDS_CORE_savePerformance',
    'KOL_IDS_CORE_getCampaignReport',
    'KOL_IDS_ACCURACY_ENGINE_signal_',
    'KOL_IDS_ACCURACY_ENGINE_backtest',
    'KOL_IDS_WORKFLOW_getWorkflow',
    'KOL_IDS_WORKFLOW_savePerformanceBatch',
    'KOL_IDS_SCALE_getCapacity',
    'KOL_IDS_CANONICAL_getContext_',
    'KOL_IDS_CANONICAL_mutate_'
  ];
  var missing=critical.filter(function(name){return typeof this[name]!=='function';},this);
  return {
    success:pricing.success===true&&runtime.success===true&&missing.length===0,
    pricing:pricing,
    runtime:runtime,
    missingFunctions:missing,
    release:'1.1.0-ENTERPRISE-HARDENING'
  };
}


/* ---------------------------------------------------------
 * Scalable read model: short-lived cache for read-heavy intelligence paths.
 * Never cache writes; explicit invalidation is performed after mutations.
 * --------------------------------------------------------- */
function KOL_IDS_SCALE_CACHE_KEY_(sheet){
  try{
    var ss=sheet&&sheet.getParent?sheet.getParent():null;
    return 'KIDS:RM:V8:'+String(typeof KOL_IDS!=='undefined'&&KOL_IDS.VERSION?KOL_IDS.VERSION:'UNKNOWN')+':'+String(ss?ss.getId():'NO_SS')+':'+String(sheet?sheet.getName():'NO_SHEET');
  }catch(e){return 'KIDS:RM:UNKNOWN';}
}
function KOL_IDS_SCALE_READ_MODEL_(sheet,ttlSeconds){
  if(!sheet||sheet.getLastRow()<2)return [];
  var ttl=Math.max(1,Math.min(Number(ttlSeconds)||15,60));
  var cache=CacheService.getScriptCache(),key=KOL_IDS_SCALE_CACHE_KEY_(sheet),raw=null;
  try{raw=cache.get(key);}catch(ignore){}
  if(raw){try{return JSON.parse(raw);}catch(ignore2){}}
  var rows=sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues().filter(function(r){return r.some(function(v){return v!==''&&v!=null;});});
  try{cache.put(key,JSON.stringify(rows),ttl);}catch(ignore3){}
  return rows;
}
function KOL_IDS_SCALE_INVALIDATE_READ_MODEL_(sheet){
  if(!sheet)return false;
  try{CacheService.getScriptCache().remove(KOL_IDS_SCALE_CACHE_KEY_(sheet));}catch(ignore){}
  return true;
}
function KOL_IDS_SCALE_BATCH_READ_(ss,sheetNames,ttlSeconds){
  var out={};(sheetNames||[]).forEach(function(name){var sh=ss.getSheetByName(name);out[name]=sh?KOL_IDS_SCALE_READ_MODEL_(sh,ttlSeconds):[];});return out;
}

/* Conservative calibration: sparse data never changes the decision score. */
function KOL_IDS_ACCURACY_ENGINE_calibrationGuard_(cal){
  cal=cal||{};
  var n=Number(cal.n||0),effectiveN=Number(cal.effectiveN||0),mae=Number(cal.mae);
  if(!isFinite(n)||!isFinite(effectiveN)||n<0||effectiveN<0){
    return {adjustment:0,status:'INVALID_CALIBRATION_EVIDENCE',n:0,effectiveN:0};
  }
  if(n<KOL_IDS.MIN_CALIBRATION_EVIDENCE||effectiveN<Math.max(3,KOL_IDS.MIN_CALIBRATION_EVIDENCE*.6)){
    return {adjustment:0,status:'INSUFFICIENT_CALIBRATION_EVIDENCE',n:n,effectiveN:effectiveN};
  }
  if(!isFinite(mae)||mae>25){
    return {adjustment:0,status:'UNSTABLE_CALIBRATION',n:n,effectiveN:effectiveN,mae:isFinite(mae)?mae:null};
  }
  var bias=Number(cal.bias||0);
  if(!isFinite(bias))bias=0;
  var strength=Math.min(1,effectiveN/Math.max(1,KOL_IDS.MIN_TRUST_EVIDENCE));
  var adjustment=KOL_IDS_ACCURACY_ENGINE_clamp_(bias*.30*strength,-KOL_IDS.MAX_CALIBRATION,KOL_IDS.MAX_CALIBRATION);
  return {adjustment:adjustment,status:Math.abs(bias)>=8?'BIASED':'CALIBRATED',n:n,effectiveN:effectiveN,mae:mae};
}


function KOL_IDS_SCALE_getCapacity() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SCALE_getCapacity', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SCALE_getCapacity, this, arguments);
}


function KOL_IDS_SCALE_archiveCampaign() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SCALE_archiveCampaign', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SCALE_archiveCampaign, this, arguments);
}


function KOL_IDS_ARCHITECTURE_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_ARCHITECTURE_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_ARCHITECTURE_QA, this, arguments);
}


function KOL_IDS_RUNTIME_COHESION_CERTIFY() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RUNTIME_COHESION_CERTIFY', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RUNTIME_COHESION_CERTIFY, this, arguments);
}


function KOL_IDS_ENTERPRISE_HEALTHCHECK() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_ENTERPRISE_HEALTHCHECK', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_ENTERPRISE_HEALTHCHECK, this, arguments);
}
