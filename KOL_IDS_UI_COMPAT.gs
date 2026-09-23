/** KOL IDS — UI compatibility runtime */
function KOL_IDS_SELF_INIT_WORKSPACE() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_INIT_WORKSPACE');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('INIT_WORKSPACE', false, function() {
    // Bootstrap is the only initialization operation here. GET_STATE is a
    // separate RPC from the UI so initialization cannot recursively invoke the
    // full runtime guard and spreadsheet state loader.
    var boot = KOL_IDS_SELF_ROUTE_();
    return {success:true, boot:boot, state:null, context:null, initialized:true};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_INIT_WORKSPACE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_INIT_WORKSPACE', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_CTX_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_CTX_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SELF_ROUTE_();
  if (typeof KOL_IDS_CANONICAL_getContext_ === 'function') return KOL_IDS_CANONICAL_getContext_();
  var state = (typeof KOL_IDS_SELF_GET_STATE === 'function') ? KOL_IDS_SELF_GET_STATE() : {};
  return state.flowContext || state.context || state || {};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_CTX_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_CTX_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?n:0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(v==null?'':v).trim();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.max(0,Math.min(100,Math.round(KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(v))));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_CREATORS_(ctx){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_CREATORS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var list=[];if(ctx&&ctx.selection&&Array.isArray(ctx.selection.creators))list=ctx.selection.creators;if(!list.length&&ctx&&Array.isArray(ctx.kols))list=ctx.kols;if(!list.length){try{var state=KOL_IDS_PRODUCT_UI_GET_STATE();list=Array.isArray(state.kols)?state.kols:[];}catch(ignore){}}return list||[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_CREATORS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_CREATORS_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_ANALYSIS_(k){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_ANALYSIS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return (k&&k.analysis&&typeof k.analysis==='object')?k.analysis:(k||{});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_ANALYSIS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_ANALYSIS_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_EVIDENCE_(k,a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_EVIDENCE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var fields=['audienceEvidence','engagementEvidence','contentEvidence','performanceEvidence','reputationEvidence'],present=0;fields.forEach(function(f){if(KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(k&&k[f]))present++;});var confidence=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(a&&a.confidence);if(present>=4||confidence>=80)return'STRONG';if(present>=2||confidence>=60)return'PARTIAL';return'LIMITED';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_EVIDENCE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_EVIDENCE_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_UI_COMPAT_UI_COMPAT_BOARD_(scenario){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_UI_COMPAT_UI_COMPAT_BOARD_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_UI_COMPAT_UI_COMPAT_CTX_(),creators=KOL_IDS_UI_COMPAT_UI_COMPAT_CREATORS_(ctx),weights=(scenario&&scenario.weights)||{},hasScenario=!!(scenario&&typeof scenario==='object');
  var wb=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(weights.brand),wa=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(weights.audience),wc=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(weights.campaign),wconf=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(weights.confidence),wv=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(weights.value),wr=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(weights.risk),total=wb+wa+wc+wconf+wv+wr;
  var ranked=creators.map(function(k){var a=KOL_IDS_UI_COMPAT_UI_COMPAT_ANALYSIS_(k),brand=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(a.brandFit!=null?a.brandFit:a.fit),audience=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(a.audienceFit!=null?a.audienceFit:a.fit),campaign=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(a.campaignFit!=null?a.campaignFit:(a.contentFit!=null?a.contentFit:a.fit)),confidence=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(a.confidence),value=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(a.valueFit!=null?a.valueFit:a.impact),riskText=KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(a.risk||k.riskLevel||'LOW').toUpperCase(),riskScore=riskText==='HIGH'?25:riskText==='MEDIUM'?60:90,fit=KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_(a.fit!=null?a.fit:(brand+audience+campaign)/3),impact=KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_(a.impact!=null?a.impact:value),score=KOL_IDS_UI_COMPAT_UI_COMPAT_NUM_(a.decisionScore!=null?a.decisionScore:fit);if(hasScenario&&total>0)score=(brand*wb+audience*wa+campaign*wc+confidence*wconf+value*wv+riskScore*wr)/total;score=KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_(score);var evidence=KOL_IDS_UI_COMPAT_UI_COMPAT_EVIDENCE_(k,a),rec=riskText==='HIGH'?'HOLD':(score>=70&&confidence>=60?'PROCEED':(evidence==='LIMITED'?'REQUEST_EVIDENCE':'REVIEW')),gaps=[];if(confidence<60)gaps.push('Increase confidence with verified audience and performance evidence.');if(evidence==='LIMITED')gaps.push('Add creator evidence before final selection.');if(riskText==='HIGH')gaps.push('Resolve the high-risk signal before proceeding.');return{name:KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(k.name)||'Creator',platform:KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(k.platform),recommendation:rec,decisionScore:score,fit:fit,impact:impact,confidence:KOL_IDS_UI_COMPAT_UI_COMPAT_CLAMP_(confidence),risk:riskText,evidenceStatus:evidence,gaps:gaps,reasons:[{signal:'Brand fit',value:brand},{signal:'Audience fit',value:audience},{signal:'Campaign fit',value:campaign}]};});
  ranked.sort(function(a,b){return b.decisionScore-a.decisionScore;});ranked.forEach(function(r,i){r.rank=i+1;});var actions=[];if(!ranked.length)actions.push('Analyze creators before using Decision Intelligence.');if(ranked.some(function(r){return r.evidenceStatus==='LIMITED';}))actions.push('Add missing evidence for creators with limited evidence.');if(ranked.some(function(r){return r.risk==='HIGH';}))actions.push('Resolve high-risk creator signals before approval.');return{success:true,decisionReady:ranked.length>0&&!ranked.some(function(r){return r.risk==='HIGH';}),rankedCreators:ranked,nextBestActions:actions,simulation:hasScenario,contextRevision:ctx&&ctx.meta?ctx.meta.revision:null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_UI_COMPAT_UI_COMPAT_BOARD_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_UI_COMPAT_UI_COMPAT_BOARD_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_GET_DECISION_BOARD(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_GET_DECISION_BOARD');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('GET_DECISION_BOARD',false,function(){return KOL_IDS_UI_COMPAT_UI_COMPAT_BOARD_(null);});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_GET_DECISION_BOARD', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_GET_DECISION_BOARD', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SIMULATE(scenario){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SIMULATE');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SIMULATE_DECISION',false,function(){return KOL_IDS_UI_COMPAT_UI_COMPAT_BOARD_(scenario||{});});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SIMULATE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SIMULATE', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_GET_READINESS(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_GET_READINESS');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('GET_READINESS',false,function(){var ctx=KOL_IDS_UI_COMPAT_UI_COMPAT_CTX_(),creators=KOL_IDS_UI_COMPAT_UI_COMPAT_CREATORS_(ctx),checks=[];function KOL_IDS_UI_COMPAT_add(label,pass,detail,warn){checks.push({label:label,level:pass?'PASS':(warn?'WARN':'FAIL'),detail:detail});}KOL_IDS_UI_COMPAT_add('Workspace',!!(ctx&&ctx.analysisId),'Active campaign workspace is available.');KOL_IDS_UI_COMPAT_add('Campaign context',!!(ctx&&ctx.campaign&&KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(ctx.campaign.name)),'Campaign name and canonical context are stored.');KOL_IDS_UI_COMPAT_add('Audience context',!!(ctx&&ctx.audience&&KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(ctx.audience.description)),'Audience intelligence is available.',true);KOL_IDS_UI_COMPAT_add('Creator analysis',creators.some(function(k){var a=KOL_IDS_UI_COMPAT_UI_COMPAT_ANALYSIS_(k);return a&&((a.fit!=null)||(a.decisionScore!=null));}),'At least one creator has analysis evidence.');KOL_IDS_UI_COMPAT_add('Shortlist',!!(ctx&&ctx.selection&&Array.isArray(ctx.selection.creators)&&ctx.selection.creators.length),'A reviewed creator shortlist is stored.',true);KOL_IDS_UI_COMPAT_add('Attribution plan',!!(ctx&&ctx.genCodes&&Array.isArray(ctx.genCodes.codes)&&ctx.genCodes.codes.length),'Creator attribution codes are available.',true);var failed=checks.filter(function(c){return c.level==='FAIL';}).length,warned=checks.filter(function(c){return c.level==='WARN';}).length,passed=checks.filter(function(c){return c.level==='PASS';}).length;return{success:failed===0,status:failed?'SETUP_REQUIRED':(warned?'READY_WITH_ACTIONS':'READY'),checks:checks,summary:{passed:passed,warned:warned,failed:failed}};});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_GET_READINESS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_GET_READINESS', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_VALIDATE_PERFORMANCE_IMPORT(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_VALIDATE_PERFORMANCE_IMPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('VALIDATE_PERFORMANCE_IMPORT',false,function(){payload=payload||{};var rows=Array.isArray(payload.rows)?payload.rows:[],errors=[];rows.forEach(function(r,i){if(!KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(r&&r.name))errors.push('Row '+(i+1)+': creator name is required.');});return{success:errors.length===0,valid:errors.length===0,count:rows.length,errors:errors};});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_VALIDATE_PERFORMANCE_IMPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_VALIDATE_PERFORMANCE_IMPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_SAVE_VERIFIED_PERFORMANCE(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_SAVE_VERIFIED_PERFORMANCE');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var check=KOL_IDS_ATTRIBUTION_VALIDATE_PERFORMANCE_IMPORT(payload);if(!check.valid)throw new Error(check.errors.join(' '));return KOL_IDS_SELF_SAVE_PERFORMANCE(payload||{});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_SAVE_VERIFIED_PERFORMANCE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_SAVE_VERIFIED_PERFORMANCE', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SAVE_DECISION_MEMO(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SAVE_DECISION_MEMO');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_DECISION_MEMO',true,function(){KOL_IDS_SELF_ROUTE_();var props=KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_(),memo={text:KOL_IDS_UI_COMPAT_UI_COMPAT_TEXT_(payload&&(payload.memo||payload.text||payload.note)),savedAt:new Date().toISOString()};props.setProperty('KOL_IDS_DECISION_MEMO',JSON.stringify(memo));return{success:true,memo:memo};});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SAVE_DECISION_MEMO', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SAVE_DECISION_MEMO', Date.now() - __kolIdsTraceStartedAt);
  }
}


// Canonical public endpoint aliases — version-free KOL IDS contract.
function KOL_IDS_GET_READINESS(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GET_READINESS');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ATTRIBUTION_GET_READINESS(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GET_READINESS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GET_READINESS', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GET_DECISION_BOARD(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GET_DECISION_BOARD');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_DECISION_GET_DECISION_BOARD(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GET_DECISION_BOARD', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GET_DECISION_BOARD', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SIMULATE_DECISION(scenario){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SIMULATE_DECISION');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_DECISION_SIMULATE(scenario); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SIMULATE_DECISION', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SIMULATE_DECISION', Date.now() - __kolIdsTraceStartedAt);
  }
}

// Public UI aliases — keep frontend contract stable.
function KOL_IDS_VALIDATE_PERFORMANCE_IMPORT(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_VALIDATE_PERFORMANCE_IMPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ATTRIBUTION_VALIDATE_PERFORMANCE_IMPORT(payload||{}); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_VALIDATE_PERFORMANCE_IMPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_VALIDATE_PERFORMANCE_IMPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SAVE_VERIFIED_PERFORMANCE(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SAVE_VERIFIED_PERFORMANCE');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ATTRIBUTION_SAVE_VERIFIED_PERFORMANCE(payload||{}); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SAVE_VERIFIED_PERFORMANCE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SAVE_VERIFIED_PERFORMANCE', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** V25/V5 compatibility bridge: legacy UI names delegate to the current commercial core. */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V5_setupSales(){ return KOL_IDS_CORE_setupSales.apply(this, arguments); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V5_adminOrders(){ return KOL_IDS_CORE_adminOrders(); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V5_adminApprove(orderId){ return KOL_IDS_CORE_adminApprove(orderId); }

/** Enterprise UI compatibility bridge: legacy public names delegate to platform authority. */
function KOL_IDS_V25_currentOrg_(){ return KOL_IDS_PLATFORM_currentOrg_.apply(this, arguments); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V25_enterpriseDashboard(orgId, brandId){ return KOL_IDS_PLATFORM_enterpriseDashboard(orgId, brandId); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V25_QA(){
  if(typeof KOL_IDS_RELEASE_QA==='function') return KOL_IDS_RELEASE_QA();
  if(typeof KOL_IDS_FULL_LOOP_QA_SYSTEM_QA==='function') return KOL_IDS_FULL_LOOP_QA_SYSTEM_QA();
  if(typeof KOL_IDS_HARDENING_QA==='function') return KOL_IDS_HARDENING_QA();
  return {success:false,passed:0,tests:0,failures:[{name:'QA',detail:'No canonical QA runner is installed.'}]};
}


/** Public compatibility entrypoint used by the Enterprise QA button. */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_QA(){
  return KOL_IDS_RELEASE_QA_RUNTIME_CONTRACT_();
}


function KOL_IDS_V5_setupSales() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_V5_setupSales', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V5_setupSales, this, arguments);
}


function KOL_IDS_V5_adminOrders() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_V5_adminOrders', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V5_adminOrders, this, arguments);
}


function KOL_IDS_V5_adminApprove() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_V5_adminApprove', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V5_adminApprove, this, arguments);
}


function KOL_IDS_V25_enterpriseDashboard() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_V25_enterpriseDashboard', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V25_enterpriseDashboard, this, arguments);
}


function KOL_IDS_V25_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_V25_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_V25_QA, this, arguments);
}


function KOL_IDS_RELEASE_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RELEASE_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_QA, this, arguments);
}
