/**
 * KOL IDS — SYSTEM ORCHESTRATOR / WEB-APP RUNTIME HARDENING
 *
 * Runtime-facing contract for the Growth Intelligence flywheel.
 *
 * Production guarantees in this orchestrator:
 * - required dependencies are checked explicitly
 * - preflight is read-only: it never creates or repairs sheets
 * - runtime smoke is read-only
 * - flywheel dry-run is read-only: it NEVER calls matchCreators_()
 * - all workspace reads are scoped to Org + Brand
 * - cross-module checks are reported with deterministic status
 *
 * IMPORTANT:
 * A dry-run must not call a function that persists Match Decisions or
 * Recommendations. Real matching belongs to the controlled E2E acceptance test.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  REQUIRED_FUNCTIONS:[
    'KOL_IDS_GROWTH_createCampaign_',
    'KOL_IDS_GROWTH_transitionCampaign_',
    'KOL_IDS_GROWTH_addDeliverable_',
    'KOL_IDS_GROWTH_updateDeliverable_',
    'KOL_IDS_GROWTH_campaignHealth_',
    'KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_',
    'KOL_IDS_CAMPAIGN_CONTROL_upsertTask_',
    'KOL_IDS_CAMPAIGN_CONTROL_updateTask_',
    'KOL_IDS_CAMPAIGN_CONTROL_recordBudget_',
    'KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_',
    'KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_',
    'KOL_IDS_CAMPAIGN_CONTROL_gateCheck_',
    'KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_',
    'KOL_IDS_GROWTH_upsertMarketplaceCreator_',
    'KOL_IDS_GROWTH_discoverCreators_',
    'KOL_IDS_GROWTH_matchCreators_',
    'KOL_IDS_GROWTH_evaluate_',
    'KOL_IDS_GROWTH_calibrationReport_',
    'KOL_IDS_GROWTH_moatHealth_',
    'KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_',
    'KOL_IDS_LEARNING_recordOutcome_',
    'KOL_IDS_LEARNING_rebuildLearning_',
    'KOL_IDS_LEARNING_learningHealth_',
    'KOL_IDS_LEARNING_applyLearningToMatch_'
  ]
});

function KOL_IDS_ORCHESTRATOR_error_(code,message){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_error_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_PLATFORM_error_==='function')return KOL_IDS_PLATFORM_error_(code,message);
  var e=new Error(message||code||'Runtime error');e.code=code||'INTERNAL_ERROR';return e;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_error_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_error_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_resolveRequiredFunction_(name){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_resolveRequiredFunction_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Apps Script V8 does not guarantee that top-level functions are enumerable
  // on the global object. Resolve the contractual entrypoints explicitly.
  var registry={
    'KOL_IDS_GROWTH_createCampaign_':typeof KOL_IDS_GROWTH_createCampaign_==='function'?KOL_IDS_GROWTH_createCampaign_:null,
    'KOL_IDS_GROWTH_transitionCampaign_':typeof KOL_IDS_GROWTH_transitionCampaign_==='function'?KOL_IDS_GROWTH_transitionCampaign_:null,
    'KOL_IDS_GROWTH_addDeliverable_':typeof KOL_IDS_GROWTH_addDeliverable_==='function'?KOL_IDS_GROWTH_addDeliverable_:null,
    'KOL_IDS_GROWTH_updateDeliverable_':typeof KOL_IDS_GROWTH_updateDeliverable_==='function'?KOL_IDS_GROWTH_updateDeliverable_:null,
    'KOL_IDS_GROWTH_campaignHealth_':typeof KOL_IDS_GROWTH_campaignHealth_==='function'?KOL_IDS_GROWTH_campaignHealth_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_':typeof KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_==='function'?KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_upsertTask_':typeof KOL_IDS_CAMPAIGN_CONTROL_upsertTask_==='function'?KOL_IDS_CAMPAIGN_CONTROL_upsertTask_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_updateTask_':typeof KOL_IDS_CAMPAIGN_CONTROL_updateTask_==='function'?KOL_IDS_CAMPAIGN_CONTROL_updateTask_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_recordBudget_':typeof KOL_IDS_CAMPAIGN_CONTROL_recordBudget_==='function'?KOL_IDS_CAMPAIGN_CONTROL_recordBudget_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_':typeof KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_==='function'?KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_':typeof KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_==='function'?KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_gateCheck_':typeof KOL_IDS_CAMPAIGN_CONTROL_gateCheck_==='function'?KOL_IDS_CAMPAIGN_CONTROL_gateCheck_:null,
    'KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_':typeof KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_==='function'?KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_:null,
    'KOL_IDS_GROWTH_upsertMarketplaceCreator_':typeof KOL_IDS_GROWTH_upsertMarketplaceCreator_==='function'?KOL_IDS_GROWTH_upsertMarketplaceCreator_:null,
    'KOL_IDS_GROWTH_discoverCreators_':typeof KOL_IDS_GROWTH_discoverCreators_==='function'?KOL_IDS_GROWTH_discoverCreators_:null,
    'KOL_IDS_GROWTH_matchCreators_':typeof KOL_IDS_GROWTH_matchCreators_==='function'?KOL_IDS_GROWTH_matchCreators_:null,
    'KOL_IDS_GROWTH_evaluate_':typeof KOL_IDS_GROWTH_evaluate_==='function'?KOL_IDS_GROWTH_evaluate_:null,
    'KOL_IDS_GROWTH_calibrationReport_':typeof KOL_IDS_GROWTH_calibrationReport_==='function'?KOL_IDS_GROWTH_calibrationReport_:null,
    'KOL_IDS_GROWTH_moatHealth_':typeof KOL_IDS_GROWTH_moatHealth_==='function'?KOL_IDS_GROWTH_moatHealth_:null,
    'KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_':typeof KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_==='function'?KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_:null,
    'KOL_IDS_LEARNING_recordOutcome_':typeof KOL_IDS_LEARNING_recordOutcome_==='function'?KOL_IDS_LEARNING_recordOutcome_:null,
    'KOL_IDS_LEARNING_rebuildLearning_':typeof KOL_IDS_LEARNING_rebuildLearning_==='function'?KOL_IDS_LEARNING_rebuildLearning_:null,
    'KOL_IDS_LEARNING_learningHealth_':typeof KOL_IDS_LEARNING_learningHealth_==='function'?KOL_IDS_LEARNING_learningHealth_:null,
    'KOL_IDS_LEARNING_applyLearningToMatch_':typeof KOL_IDS_LEARNING_applyLearningToMatch_==='function'?KOL_IDS_LEARNING_applyLearningToMatch_:null
  };
  return registry[name]||null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_resolveRequiredFunction_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_resolveRequiredFunction_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_requiredFunctionQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_requiredFunctionQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var missing=KOL_IDS.REQUIRED_FUNCTIONS.filter(function(n){return !KOL_IDS_ORCHESTRATOR_resolveRequiredFunction_(n);});
  if(missing.length)throw KOL_IDS_ORCHESTRATOR_error_('DEPENDENCY_MISSING','Required Growth function(s) missing: '+missing.join(','));
  return {success:true,missing:[],count:KOL_IDS.REQUIRED_FUNCTIONS.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_requiredFunctionQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_requiredFunctionQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_transitionParityQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_transitionParityQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS==='undefined'||!KOL_IDS.TRANSITIONS)throw KOL_IDS_ORCHESTRATOR_error_('DEPENDENCY_MISSING','KOL_IDS transition contract is unavailable.');
  var growth=KOL_IDS.TRANSITIONS;
  var canonical={
    PLANNED:['PLANNING','CREATOR_SELECTION','CANCELLED'],
    DRAFT:['PLANNING','CANCELLED'],
    PLANNING:['CREATOR_SELECTION','CANCELLED'],
    CREATOR_SELECTION:['INVITATION','CANCELLED'],
    INVITATION:['NEGOTIATION','CONTRACTED','CANCELLED'],
    NEGOTIATION:['CONTRACTED','CANCELLED'],
    CONTRACTED:['CONTENT_BRIEF','CANCELLED'],
    CONTENT_BRIEF:['CONTENT_SUBMITTED','CANCELLED'],
    CONTENT_SUBMITTED:['REVIEW','CANCELLED'],
    REVIEW:['APPROVED','CONTENT_SUBMITTED','CANCELLED'],
    APPROVED:['PUBLISHED','CANCELLED'],
    PUBLISHED:['TRACKING'],
    TRACKING:['RECONCILIATION','CANCELLED'],
    RECONCILIATION:['COMPLETED','CANCELLED'],
    COMPLETED:[],CANCELLED:[]
  };
  var keys=Object.keys(canonical),mismatch=[];
  keys.forEach(function(k){
    var a=(growth[k]||[]).slice().sort().join('|'),b=canonical[k].slice().sort().join('|');
    if(a!==b)mismatch.push(k);
  });
  if(mismatch.length)throw KOL_IDS_ORCHESTRATOR_error_('CONTRACT_MISMATCH','Campaign transition contract mismatch: '+mismatch.join(','));
  return {success:true,mismatches:[]};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_transitionParityQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_transitionParityQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_deliverableParityQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_deliverableParityQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_GROWTH_DELIVERABLE_TRANSITIONS==='undefined')throw KOL_IDS_ORCHESTRATOR_error_('DEPENDENCY_MISSING','Deliverable transition contract is unavailable.');
  var a=KOL_IDS_GROWTH_DELIVERABLE_TRANSITIONS||{};
  var b={PENDING:['SUBMITTED','CANCELLED','OVERDUE'],SUBMITTED:['IN_REVIEW','REJECTED','CANCELLED'],IN_REVIEW:['APPROVED','REJECTED','CANCELLED'],REJECTED:['SUBMITTED','CANCELLED'],APPROVED:['CANCELLED'],OVERDUE:['SUBMITTED','CANCELLED'],CANCELLED:[]};
  var mismatch=[];Object.keys(b).forEach(function(k){if((a[k]||[]).slice().sort().join('|')!==b[k].slice().sort().join('|'))mismatch.push(k);});
  if(mismatch.length)throw KOL_IDS_ORCHESTRATOR_error_('CONTRACT_MISMATCH','Deliverable transition contract mismatch: '+mismatch.join(','));
  return {success:true,mismatches:[]};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_deliverableParityQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_deliverableParityQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Read-only schema inspector. Never calls an ensure/create/repair function. */
function KOL_IDS_ORCHESTRATOR_schemaQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_schemaQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS==='undefined'||typeof KOL_IDS_PLATFORM_map_!=='function'||typeof SpreadsheetApp==='undefined')throw KOL_IDS_ORCHESTRATOR_error_('DEPENDENCY_MISSING','Core V25 spreadsheet runtime is unavailable.');
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss)throw KOL_IDS_ORCHESTRATOR_error_('WORKSPACE_MISSING','Active spreadsheet is unavailable.');
  var expected={
    ENT_CREATOR_MARKETPLACE:['Marketplace ID','Org ID','Brand ID','Creator ID','Platform','Category','Availability','Min Rate','Max Rate','Currency','Reliability Score','Response SLA Hours','Cancellation Rate','Content Quality','Audience Fit','Updated At'],
    ENT_CAMPAIGN_DELIVERABLES:['Deliverable ID','Org ID','Brand ID','Campaign ID','Creator ID','Type','Due At','Status','Required','Submitted At','Approved At','Revision Count','Notes','Created At','Updated At'],
    ENT_DISCOVERY_EVENTS:['Event ID','Org ID','Brand ID','Creator ID','Campaign ID','Event Type','Query JSON','Source','Observed At'],
    ENT_MATCH_DECISIONS:['Match ID','Org ID','Brand ID','Campaign ID','Creator ID','Rank','Fit Score','Impact Score','Evidence Score','Risk Score','Cost Efficiency','Confidence','Decision','Reason JSON','Model Version','Created At']
  };
  var missingSheets=[],mismatch=[];
  Object.keys(expected).forEach(function(n){
    var sh=ss.getSheetByName(n);
    if(!sh){missingSheets.push(n);return;}
    var h=sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String):[];
    if(h.join('|')!==expected[n].join('|'))mismatch.push(n);
  });
  if(missingSheets.length||mismatch.length)throw KOL_IDS_ORCHESTRATOR_error_('SCHEMA_ERROR','Growth schema invalid. Missing: '+missingSheets.join(',')+'; mismatch: '+mismatch.join(','));
  return {success:true,missingSheets:[],mismatches:[]};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_schemaQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_schemaQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_sheetContractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_sheetContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var required=[];
  if(typeof KOL_IDS!=='undefined'&&KOL_IDS.SHEETS){
    Object.keys(KOL_IDS.SHEETS).forEach(function(k){if(KOL_IDS.SHEETS[k])required.push(KOL_IDS.SHEETS[k]);});
  }
  if(typeof KOL_IDS!=='undefined')required=required.concat([KOL_IDS.PLAN,KOL_IDS.TASKS,KOL_IDS.BUDGET,KOL_IDS.KPIS,KOL_IDS.RISKS,KOL_IDS.EVENTS]);
  if(typeof KOL_IDS!=='undefined')required=required.concat([KOL_IDS.SHEETS.LEARNING,KOL_IDS.SHEETS.SIGNALS]);
  required=required.concat(['ENT_CREATOR_MARKETPLACE','ENT_CAMPAIGN_DELIVERABLES','ENT_DISCOVERY_EVENTS','ENT_MATCH_DECISIONS']).filter(function(n,i,a){return n&&a.indexOf(n)===i;});
  var missing=required.filter(function(n){return !ss.getSheetByName(n);});
  return {success:missing.length===0,requiredCount:required.length,missing:missing};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_sheetContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_sheetContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_moduleContractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_moduleContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var groups={
    campaign:['KOL_IDS_GROWTH_createCampaign_','KOL_IDS_GROWTH_transitionCampaign_','KOL_IDS_GROWTH_campaignHealth_'],
    campaignControl:['KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_','KOL_IDS_CAMPAIGN_CONTROL_upsertTask_','KOL_IDS_CAMPAIGN_CONTROL_updateTask_','KOL_IDS_CAMPAIGN_CONTROL_recordBudget_','KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_','KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_','KOL_IDS_CAMPAIGN_CONTROL_gateCheck_','KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_'],
    intelligence:['KOL_IDS_GROWTH_discoverCreators_','KOL_IDS_GROWTH_matchCreators_','KOL_IDS_GROWTH_evaluate_','KOL_IDS_GROWTH_calibrationReport_'],
    moat:['KOL_IDS_GROWTH_moatHealth_','KOL_IDS_DATAMOAT_ADAPTER_dataMoatDispatch_'],
    outcomeLearning:['KOL_IDS_LEARNING_recordOutcome_','KOL_IDS_LEARNING_rebuildLearning_','KOL_IDS_LEARNING_learningHealth_','KOL_IDS_LEARNING_applyLearningToMatch_']
  };
  var missing={};Object.keys(groups).forEach(function(g){var m=groups[g].filter(function(n){return typeof this[n]!=='function';},this);if(m.length)missing[g]=m;},this);
  var ok=Object.keys(missing).length===0;
  if(!ok)throw KOL_IDS_ORCHESTRATOR_error_('DEPENDENCY_MISSING','Module contract missing functions: '+JSON.stringify(missing));
  return {success:true,missing:{},groups:groups};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_moduleContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_moduleContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Strict, non-destructive Web App preflight.
 * This function intentionally avoids all *_ensure_* and *_repair_* calls.
 */
function KOL_IDS_ORCHESTRATOR_webAppPreflight_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_webAppPreflight_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var started=Date.now();
  KOL_IDS_ORCHESTRATOR_requiredFunctionQA_();
  KOL_IDS_ORCHESTRATOR_moduleContractQA_();
  KOL_IDS_ORCHESTRATOR_transitionParityQA_();
  KOL_IDS_ORCHESTRATOR_deliverableParityQA_();
  KOL_IDS_ORCHESTRATOR_schemaQA_();
  var sheets=KOL_IDS_ORCHESTRATOR_sheetContractQA_();
  if(!sheets.success)throw KOL_IDS_ORCHESTRATOR_error_('SCHEMA_ERROR','Required runtime sheets are missing: '+sheets.missing.join(','));
  if(typeof KOL_IDS_HARDENING_RUNTIME_operationContractQA_!=='function')throw KOL_IDS_ORCHESTRATOR_error_('DEPENDENCY_MISSING','API operation contract QA is unavailable.');
  var op=KOL_IDS_HARDENING_RUNTIME_operationContractQA_();
  if(!op.success)throw KOL_IDS_ORCHESTRATOR_error_('CONTRACT_MISMATCH','API operation contract failed.');
  var integration=typeof KOL_IDS_PLATFORM_INTEGRATION_QA==='function'?KOL_IDS_PLATFORM_INTEGRATION_QA():{success:true,status:'NOT_AVAILABLE'};
  if(integration&&integration.success===false)throw KOL_IDS_ORCHESTRATOR_error_('CONTRACT_MISMATCH','Enterprise integration contract failed.');
  return {
    success:true,version:KOL_IDS.VERSION,status:'GREEN',readOnly:true,
    checks:{functions:true,moduleContracts:true,transitionParity:true,deliverableParity:true,schemas:true,runtimeSheets:true,apiOperations:true,enterpriseIntegration:integration.success!==false},
    durationMs:Date.now()-started,
    timestamp:new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_webAppPreflight_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_webAppPreflight_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_assertWorkspace_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_assertWorkspace_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!String(orgId||'').trim()||!String(brandId||'').trim())throw KOL_IDS_ORCHESTRATOR_error_('INVALID_INPUT','orgId and brandId are required.');
  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'ANALYST');
  if(!ctx||!ctx.ss)throw KOL_IDS_ORCHESTRATOR_error_('WORKSPACE_MISSING','Authorized workspace is unavailable.');
  return ctx;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_assertWorkspace_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_assertWorkspace_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Non-destructive runtime smoke test. Reads only the current workspace.
 */
function KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_ORCHESTRATOR_assertWorkspace_(orgId,brandId);
  var preflight=KOL_IDS_ORCHESTRATOR_webAppPreflight_();
  var campaignSh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CAMPAIGNS);
  var creatorSh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA);
  if(!campaignSh||!creatorSh)throw KOL_IDS_ORCHESTRATOR_error_('SCHEMA_ERROR','Core campaign or creator sheet is missing.');
  var moat=KOL_IDS_GROWTH_moatHealth_(orgId,brandId);
  var learning=typeof KOL_IDS_LEARNING_learningHealth_==='function'?KOL_IDS_LEARNING_learningHealth_(orgId,brandId):{success:false,status:'UNAVAILABLE'};
  var calibration=KOL_IDS_GROWTH_calibrationReport_(orgId,brandId,'');
  return {
    success:true,version:KOL_IDS.VERSION,status:'GREEN',readOnly:true,
    workspaceId:ctx.ss.getId(),preflight:preflight,moat:moat,learning:learning,calibration:calibration,
    timestamp:new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_findCampaignReadOnly_(ctx,orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_findCampaignReadOnly_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var csh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CAMPAIGNS);
  if(!csh)throw KOL_IDS_ORCHESTRATOR_error_('SCHEMA_ERROR','Campaign sheet is missing.');
  var cm=KOL_IDS_PLATFORM_map_(csh),rows=KOL_IDS_PLATFORM_values_(csh),hit=null;
  rows.some(function(r,i){
    if(String(r[cm['Campaign ID']]||'')===String(campaignId)&&String(r[cm['Org ID']]||'')===String(orgId)&&String(r[cm['Brand ID']]||'')===String(brandId)){
      hit={row:r,index:i,map:cm};return true;
    }
    return false;
  });
  if(!hit)throw KOL_IDS_ORCHESTRATOR_error_('NOT_FOUND','Campaign not found in authorized brand.');
  return {sheet:csh,map:cm,row:hit.row,index:hit.index};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_findCampaignReadOnly_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_findCampaignReadOnly_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ORCHESTRATOR_creatorPoolReadOnly_(ctx,orgId,brandId,platform){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_creatorPoolReadOnly_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA);
  if(!sh)return {success:false,count:0,reason:'CREATOR_SHEET_MISSING'};
  var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh),orgCol=m['Org ID'],brandCol=m['Brand ID'],platformCol=m['Platform'];
  var scoped=rows.filter(function(r){
    if(orgCol!=null&&String(r[orgCol]||'')!==String(orgId))return false;
    if(brandCol!=null&&String(r[brandCol]||'')!==String(brandId))return false;
    if(platform&&platformCol!=null&&String(r[platformCol]||'').toLowerCase()!==String(platform).toLowerCase())return false;
    return r.some(function(v){return v!==''&&v!=null;});
  });
  return {success:true,count:scoped.length,platform:platform||'',readOnly:true};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_creatorPoolReadOnly_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_creatorPoolReadOnly_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * TRUE read-only deterministic dry-run.
 *
 * Previous implementation called KOL_IDS_GROWTH_matchCreators_(), which persists
 * ENT_MATCH_DECISIONS and LEGACY_V25.15 recommendations. That violated the dry-run
 * contract. This implementation only resolves IDs, schemas, health, and the
 * candidate pool. No mutation-capable matching function is called.
 */
function KOL_IDS_ORCHESTRATOR_flywheelDryRun_(orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_flywheelDryRun_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var started=Date.now(),ctx=KOL_IDS_ORCHESTRATOR_assertWorkspace_(orgId,brandId);
  var preflight=KOL_IDS_ORCHESTRATOR_webAppPreflight_();
  var campaign=KOL_IDS_ORCHESTRATOR_findCampaignReadOnly_(ctx,orgId,brandId,campaignId);
  var cm=campaign.map,objective=String(campaign.row[cm['Objective']]||''),platform=String(campaign.row[cm['Platform']]||''),budget=campaign.row[cm['Budget']];
  var stage=String(campaign.row[cm['Status']]||'PLANNED').toUpperCase();
  var health=KOL_IDS_GROWTH_campaignHealth_(orgId,brandId,campaignId);
  var pool=KOL_IDS_ORCHESTRATOR_creatorPoolReadOnly_(ctx,orgId,brandId,platform);
  var moat=KOL_IDS_GROWTH_moatHealth_(orgId,brandId);
  var learning=typeof KOL_IDS_LEARNING_learningHealth_==='function'?KOL_IDS_LEARNING_learningHealth_(orgId,brandId):{success:false,status:'UNAVAILABLE'};
  var requiredStages={campaign:true,campaignControl:typeof KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_==='function',marketplace:typeof KOL_IDS_GROWTH_upsertMarketplaceCreator_==='function',discovery:typeof KOL_IDS_GROWTH_discoverCreators_==='function',matching:typeof KOL_IDS_GROWTH_matchCreators_==='function',outcomeReady:typeof KOL_IDS_LEARNING_recordOutcome_==='function',evaluation:typeof KOL_IDS_GROWTH_evaluate_==='function',learning:typeof KOL_IDS_LEARNING_learningHealth_==='function'};
  var missing=Object.keys(requiredStages).filter(function(k){return !requiredStages[k];});
  if(missing.length)throw KOL_IDS_ORCHESTRATOR_error_('DEPENDENCY_MISSING','Flywheel stage(s) unavailable: '+missing.join(','));
  return {
    success:true,dryRun:true,readOnly:true,version:KOL_IDS.VERSION,
    durationMs:Date.now()-started,preflight:preflight,
    flow:{campaign:true,campaignControl:true,marketplace:true,discovery:true,matching:true,outcomeReady:true,evaluation:true,learning:learning.readyForLearning===true},
    campaign:{id:campaignId,status:stage,objective:objective,budget:budget,platform:platform,health:health.healthScore},
    creatorPool:pool,
    matching:{executable:true,mutationSuppressed:true,candidatePool:pool.count,recommendationsNotGenerated:true},
    moat:moat,learningHealth:learning,
    timestamp:new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_flywheelDryRun_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_flywheelDryRun_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Explicit aliases used by the API/QA layer. */
function KOL_IDS_ORCHESTRATOR_readOnlyPreflight_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_readOnlyPreflight_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ORCHESTRATOR_webAppPreflight_();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_readOnlyPreflight_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_readOnlyPreflight_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ORCHESTRATOR_readOnlyRuntimeSmokeTest_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_readOnlyRuntimeSmokeTest_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_(orgId,brandId);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_readOnlyRuntimeSmokeTest_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_readOnlyRuntimeSmokeTest_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ORCHESTRATOR_readOnlyFlywheelDryRun_(orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_readOnlyFlywheelDryRun_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ORCHESTRATOR_flywheelDryRun_(orgId,brandId,campaignId);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_readOnlyFlywheelDryRun_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_readOnlyFlywheelDryRun_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* ============================================================
 * LEGACY_V25.16 TEST RUNNERS — APPEND AT END
 * ------------------------------------------------------------
 * ใช้สำหรับกด Run จาก Apps Script Editor
 * ไม่แก้ business logic หลัก
 * ============================================================ */

/**
 * TEST 01 — Web App Preflight
 * Read-only
 */
function KOL_IDS_ORCHESTRATOR_TEST_01_Preflight() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_01_Preflight');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var result = KOL_IDS_ORCHESTRATOR_webAppPreflight_();

    Logger.log(JSON.stringify(result, null, 2));

    return {
      success: true,
      test: 'WEB_APP_PREFLIGHT',
      result: result,
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    Logger.log(err && err.stack ? err.stack : err);

    return {
      success: false,
      test: 'WEB_APP_PREFLIGHT',
      error: String(err && err.message ? err.message : err),
      timestamp: new Date().toISOString()
    };
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_01_Preflight', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_01_Preflight', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 02 — Release Contract QA
 */
function KOL_IDS_ORCHESTRATOR_TEST_02_ReleaseContract() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_02_ReleaseContract');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var result = KOL_IDS_PRODUCTION_HARDENING_releaseContractQA_();

    Logger.log(JSON.stringify(result, null, 2));

    return {
      success: !!result.success,
      test: 'RELEASE_CONTRACT',
      result: result,
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    Logger.log(err && err.stack ? err.stack : err);

    return {
      success: false,
      test: 'RELEASE_CONTRACT',
      error: String(err && err.message ? err.message : err),
      timestamp: new Date().toISOString()
    };
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_02_ReleaseContract', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_02_ReleaseContract', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 03 — Runtime Smoke Test
 *
 * ใส่ค่าทดสอบใน Script Properties:
 *
 * KOL_IDS_TEST_ORG_ID
 * KOL_IDS_TEST_BRAND_ID
 */
function KOL_IDS_ORCHESTRATOR_TEST_03_RuntimeSmoke() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_03_RuntimeSmoke');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var props = PropertiesService.getScriptProperties();

    var orgId = String(
      props.getProperty('KOL_IDS_TEST_ORG_ID') || ''
    ).trim();

    var brandId = String(
      props.getProperty('KOL_IDS_TEST_BRAND_ID') || ''
    ).trim();

    /*
     * 1.0.1 FIX:
     * Do not fail merely because TEST_08 has not been run manually.
     * TEST_08 already contains the canonical, read-only discovery logic
     * for resolving a real Org/Brand from the current QA workspace.
     * Reuse that resolver here, then re-read Script Properties so TEST_03
     * can run as a standalone smoke test.
     */
    if (!orgId || !brandId) {
      var setupResult = KOL_IDS_ORCHESTRATOR_TEST_08_SetTestProperties();
      if (!setupResult || setupResult.success !== true) {
        throw new Error(
          'Unable to initialize test properties for Runtime Smoke: ' +
          JSON.stringify(setupResult || {})
        );
      }

      orgId = String(
        props.getProperty('KOL_IDS_TEST_ORG_ID') || ''
      ).trim();

      brandId = String(
        props.getProperty('KOL_IDS_TEST_BRAND_ID') || ''
      ).trim();
    }

    if (!orgId || !brandId) {
      throw new Error(
        'Runtime Smoke could not resolve valid test properties. ' +
        'Run KOL_IDS_ORCHESTRATOR_TEST_08_SetTestProperties() and verify ' +
        'ENT_CAMPAIGNS contains Org ID and Brand ID.'
      );
    }

    var result =
      KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_(orgId, brandId);

    Logger.log(JSON.stringify(result, null, 2));

    return {
      success: true,
      test: 'RUNTIME_SMOKE',
      orgId: orgId,
      brandId: brandId,
      result: result,
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    Logger.log(err && err.stack ? err.stack : err);

    return {
      success: false,
      test: 'RUNTIME_SMOKE',
      error: String(err && err.message ? err.message : err),
      timestamp: new Date().toISOString()
    };
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_03_RuntimeSmoke', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_03_RuntimeSmoke', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 04 — Flywheel Dry Run
 *
 * ใช้ Script Properties:
 *
 * KOL_IDS_TEST_ORG_ID
 * KOL_IDS_TEST_BRAND_ID
 * KOL_IDS_TEST_CAMPAIGN_ID
 *
 * IMPORTANT:
 * ต้องเป็น Dry Run / Read Only
 * ไม่ควรสร้าง Match Decision / Recommendation
 */
function KOL_IDS_ORCHESTRATOR_TEST_04_FlywheelDryRun() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_04_FlywheelDryRun');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var props = PropertiesService.getScriptProperties();

    var orgId = String(
      props.getProperty('KOL_IDS_TEST_ORG_ID') || ''
    ).trim();

    var brandId = String(
      props.getProperty('KOL_IDS_TEST_BRAND_ID') || ''
    ).trim();

    var campaignId = String(
      props.getProperty('KOL_IDS_TEST_CAMPAIGN_ID') || ''
    ).trim();

    if (!orgId || !brandId || !campaignId) {
      throw new Error(
        'Missing Script Properties: ' +
        'KOL_IDS_TEST_ORG_ID, ' +
        'KOL_IDS_TEST_BRAND_ID, ' +
        'KOL_IDS_TEST_CAMPAIGN_ID'
      );
    }

    var result =
      KOL_IDS_ORCHESTRATOR_flywheelDryRun_(
        orgId,
        brandId,
        campaignId
      );

    Logger.log(JSON.stringify(result, null, 2));

    return {
      success: true,
      test: 'FLYWHEEL_DRY_RUN',
      orgId: orgId,
      brandId: brandId,
      campaignId: campaignId,
      result: result,
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    Logger.log(err && err.stack ? err.stack : err);

    return {
      success: false,
      test: 'FLYWHEEL_DRY_RUN',
      error: String(err && err.message ? err.message : err),
      timestamp: new Date().toISOString()
    };
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_04_FlywheelDryRun', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_04_FlywheelDryRun', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 05 — Full Production Acceptance Test
 *
 * ใช้ค่าจาก Script Properties ถ้ามี
 */
function KOL_IDS_ORCHESTRATOR_TEST_05_ProductionAcceptance() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_05_ProductionAcceptance');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var props = PropertiesService.getScriptProperties();

    var orgId = String(
      props.getProperty('KOL_IDS_TEST_ORG_ID') || ''
    ).trim();

    var brandId = String(
      props.getProperty('KOL_IDS_TEST_BRAND_ID') || ''
    ).trim();

    var campaignId = String(
      props.getProperty('KOL_IDS_TEST_CAMPAIGN_ID') || ''
    ).trim();

    var options = {
      persist: true
    };

    if (orgId) {
      options.orgId = orgId;
    }

    if (brandId) {
      options.brandId = brandId;
    }

    if (campaignId) {
      options.campaignId = campaignId;
    }

    var result =
      KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_(options);

    Logger.log(JSON.stringify(result, null, 2));

    return {
      success: !!(
        result &&
        (
          result.success === true ||
          result.status === 'AUTOMATED_PASS' ||
          result.status ===
            'PASS_AUTOMATED_GATES_MANUAL_SIGNOFF_REQUIRED'
        )
      ),
      test: 'PRODUCTION_ACCEPTANCE',
      result: result,
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    Logger.log(err && err.stack ? err.stack : err);

    return {
      success: false,
      test: 'PRODUCTION_ACCEPTANCE',
      error: String(err && err.message ? err.message : err),
      timestamp: new Date().toISOString()
    };
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_05_ProductionAcceptance', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_05_ProductionAcceptance', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 06 — Run all automated tests
 *
 * ไม่รวม Production Acceptance ที่อาจ persist report
 */
function KOL_IDS_ORCHESTRATOR_TEST_06_RunAutomatedSuite() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_06_RunAutomatedSuite');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var results = [];

  results.push(
    KOL_IDS_ORCHESTRATOR_TEST_01_Preflight()
  );

  results.push(
    KOL_IDS_ORCHESTRATOR_TEST_02_ReleaseContract()
  );

  results.push(
    KOL_IDS_ORCHESTRATOR_TEST_03_RuntimeSmoke()
  );

  results.push(
    KOL_IDS_ORCHESTRATOR_TEST_04_FlywheelDryRun()
  );

  var passed = results.filter(function (r) {
    return r && r.success === true;
  }).length;

  var failed = results.length - passed;

  var output = {
    success: failed === 0,
    test: 'LEGACY_V25.16_AUTOMATED_SUITE',
    total: results.length,
    passed: passed,
    failed: failed,
    results: results,
    timestamp: new Date().toISOString()
  };

  Logger.log(JSON.stringify(output, null, 2));

  return output;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_06_RunAutomatedSuite', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_06_RunAutomatedSuite', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 07 — Function Availability
 *
 * เอาไว้ตรวจว่าฟังก์ชันหลักของ LEGACY_V25.16
 * ถูกโหลดใน runtime หรือไม่
 */
function KOL_IDS_ORCHESTRATOR_TEST_07_FunctionAvailability() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_07_FunctionAvailability');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var checks = {
    preflight:
      typeof KOL_IDS_ORCHESTRATOR_webAppPreflight_ === 'function',

    runtimeSmoke:
      typeof KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_ === 'function',

    flywheelDryRun:
      typeof KOL_IDS_ORCHESTRATOR_flywheelDryRun_ === 'function',

    releaseContract:
      typeof KOL_IDS_PRODUCTION_HARDENING_releaseContractQA_ === 'function',

    acceptanceTest:
      typeof KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_ === 'function',

    creatorMatch:
      typeof KOL_IDS_GROWTH_matchCreators_ === 'function',

    outcomeRecord:
      typeof KOL_IDS_LEARNING_recordOutcome_ === 'function',

    learningHealth:
      typeof KOL_IDS_LEARNING_learningHealth_ === 'function',

    learningRebuild:
      typeof KOL_IDS_LEARNING_rebuildLearning_ === 'function',

    api:
      typeof KOL_IDS_PLATFORM_api_ === 'function'
  };

  var keys = Object.keys(checks);

  var missing = keys.filter(function (k) {
    return checks[k] !== true;
  });

  var output = {
    success: missing.length === 0,
    test: 'FUNCTION_AVAILABILITY',
    checks: checks,
    missing: missing,
    timestamp: new Date().toISOString()
  };

  Logger.log(JSON.stringify(output, null, 2));

  return output;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_07_FunctionAvailability', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_07_FunctionAvailability', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 08 — Set Test IDs
 *
 * แก้ค่าตรงนี้ครั้งเดียว แล้วใช้ TEST 03/04/05 ได้
 *
 * *** เปลี่ยนค่าตัวอย่างด้านล่างก่อน Run ***
 */
function KOL_IDS_ORCHESTRATOR_TEST_08_SetTestProperties() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_08_SetTestProperties');
  var __kolIdsTraceStartedAt = Date.now();
  try {

    /*
     * 1.0.0 FIX:
     * Auto-discover a valid test ORG / BRAND / CAMPAIGN from the
     * current workspace instead of requiring placeholder IDs.
     *
     * This is a read-only discovery step. It does not create, update,
     * or delete business data.
     */
    var props = PropertiesService.getScriptProperties();

    var existingOrgId = String(props.getProperty('KOL_IDS_TEST_ORG_ID') || '').trim();
    var existingBrandId = String(props.getProperty('KOL_IDS_TEST_BRAND_ID') || '').trim();
    var existingCampaignId = String(props.getProperty('KOL_IDS_TEST_CAMPAIGN_ID') || '').trim();

    var ORG_ID = existingOrgId;
    var BRAND_ID = existingBrandId;
    var CAMPAIGN_ID = existingCampaignId;
    var discovery = 'EXISTING_PROPERTIES';

    /*
     * 1.0.2 FIX:
     * Prefer the canonical Production-QA scope when TEST properties are
     * missing. A freshly-created QA workspace can legitimately have an
     * empty ENT_CAMPAIGNS sheet, while KOL_IDS_PRODUCTION_QA_SEED_SCOPE
     * may already have created and persisted the real QA Org/Brand IDs.
     * Reusing those IDs avoids creating duplicate test data just to make
     * Runtime Smoke start.
     */
    if (!ORG_ID || !BRAND_ID) {
      var qaOrgId = String(props.getProperty('KOL_IDS_QA_ORG_ID') || '').trim();
      var qaBrandId = String(props.getProperty('KOL_IDS_QA_BRAND_ID') || '').trim();
      var qaCampaignId = String(props.getProperty('KOL_IDS_QA_CAMPAIGN_ID') || '').trim();
      if (qaOrgId && qaBrandId) {
        ORG_ID = qaOrgId;
        BRAND_ID = qaBrandId;
        if (!CAMPAIGN_ID && qaCampaignId) CAMPAIGN_ID = qaCampaignId;
        discovery = 'EXISTING_PRODUCTION_QA_PROPERTIES';
      }
    }

    /*
     * If properties are still missing, discover a real campaign row from
     * ENT_CAMPAIGNS. This guarantees that RuntimeSmoke receives IDs
     * that actually belong to the current workspace.
     */
    if (!ORG_ID || !BRAND_ID) {
      var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
      var campaignSheetName = (KOL_IDS.SHEETS && KOL_IDS.SHEETS.CAMPAIGNS)
        ? KOL_IDS.SHEETS.CAMPAIGNS
        : 'ENT_CAMPAIGNS';
      var sh = ss.getSheetByName(campaignSheetName);

      if (!sh) {
        throw new Error(
          'Cannot auto-discover test properties: missing sheet ' +
          campaignSheetName
        );
      }

      var values = sh.getDataRange().getValues();
      if (!values || values.length < 2) {
        throw new Error(
          'Cannot auto-discover test properties: ' +
          campaignSheetName + ' has no data rows. ' +
          'No KOL_IDS_QA_ORG_ID/KOL_IDS_QA_BRAND_ID scope is available either. ' +
          'Run KOL_IDS_PRODUCTION_QA_SEED_SCOPE() once to create the canonical QA scope, ' +
          'then Runtime Smoke can reuse it without creating duplicate scopes.'
        );
      }

      var headers = values[0].map(function(h) {
        return String(h || '').trim();
      });

      var orgCol = headers.indexOf('Org ID');
      var brandCol = headers.indexOf('Brand ID');
      var campaignCol = headers.indexOf('Campaign ID');

      if (orgCol < 0 || brandCol < 0) {
        throw new Error(
          'Cannot auto-discover test properties: ' +
          campaignSheetName +
          ' must contain Org ID and Brand ID headers.'
        );
      }

      var found = null;
      for (var i = 1; i < values.length; i++) {
        var row = values[i];
        var org = String(row[orgCol] || '').trim();
        var brand = String(row[brandCol] || '').trim();
        var campaign = campaignCol >= 0
          ? String(row[campaignCol] || '').trim()
          : '';

        if (org && brand) {
          found = {
            orgId: org,
            brandId: brand,
            campaignId: campaign
          };
          break;
        }
      }

      if (!found) {
        throw new Error(
          'Cannot auto-discover test properties: no valid Org ID / Brand ID row found in ' +
          campaignSheetName
        );
      }

      ORG_ID = found.orgId;
      BRAND_ID = found.brandId;
      if (!CAMPAIGN_ID && found.campaignId) {
        CAMPAIGN_ID = found.campaignId;
      }
      discovery = 'AUTO_DISCOVERED_FROM_' + campaignSheetName;
    }

    /*
     * Campaign ID is only required by FlywheelDryRun, not RuntimeSmoke.
     * If it is absent, keep the two required smoke-test properties valid
     * and report the campaign ID as unavailable rather than inventing one.
     */
    props.setProperties({
      KOL_IDS_TEST_ORG_ID: ORG_ID,
      KOL_IDS_TEST_BRAND_ID: BRAND_ID,
      KOL_IDS_TEST_CAMPAIGN_ID: CAMPAIGN_ID
    });

    var result = {
      success: true,
      message: 'Test properties saved',
      discovery: discovery,
      orgId: ORG_ID,
      brandId: BRAND_ID,
      campaignId: CAMPAIGN_ID || '',
      runtimeSmokeReady: !!(ORG_ID && BRAND_ID),
      flywheelDryRunReady: !!(ORG_ID && BRAND_ID && CAMPAIGN_ID),
      timestamp: new Date().toISOString()
    };

    Logger.log(JSON.stringify(result, null, 2));
    return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_08_SetTestProperties', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_08_SetTestProperties', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* ============================================================
 * LEGACY_V25.16 GROWTH SCHEMA REPAIR + DIAGNOSTIC
 * ------------------------------------------------------------
 * เติมต่อท้าย KOL_IDS_PLATFORM_10_8_SYSTEM_ORCHESTRATOR.gs
 *
 * PURPOSE:
 * - ตรวจ Growth schema
 * - สร้างเฉพาะ Growth sheets ที่ขาด
 * - ใส่ header ตาม contract
 * - ไม่แตะข้อมูลเดิม
 * - ไม่ลบ sheet
 * - ไม่ลบข้อมูล
 * - ไม่สร้าง duplicate sheet
 * ============================================================ */

var KOL_IDS_PRODUCTION_GROWTH_SCHEMA = Object.freeze({

  VERSION: '25.16.0',

  SHEETS: {

    ENT_CREATOR_MARKETPLACE: [
      'Marketplace ID',
      'Org ID',
      'Brand ID',
      'Creator ID',
      'Platform',
      'Category',
      'Availability',
      'Min Rate',
      'Max Rate',
      'Currency',
      'Reliability Score',
      'Response SLA Hours',
      'Cancellation Rate',
      'Content Quality',
      'Audience Fit',
      'Updated At'
    ],

    ENT_CAMPAIGN_DELIVERABLES: [
      'Deliverable ID',
      'Org ID',
      'Brand ID',
      'Campaign ID',
      'Creator ID',
      'Type',
      'Due At',
      'Status',
      'Required',
      'Submitted At',
      'Approved At',
      'Revision Count',
      'Notes',
      'Created At',
      'Updated At'
    ],

    ENT_DISCOVERY_EVENTS: [
      'Event ID',
      'Org ID',
      'Brand ID',
      'Creator ID',
      'Campaign ID',
      'Event Type',
      'Query JSON',
      'Source',
      'Observed At'
    ],

    ENT_MATCH_DECISIONS: [
      'Match ID',
      'Org ID',
      'Brand ID',
      'Campaign ID',
      'Creator ID',
      'Rank',
      'Fit Score',
      'Impact Score',
      'Evidence Score',
      'Risk Score',
      'Cost Efficiency',
      'Confidence',
      'Decision',
      'Reason JSON',
      'Model Version',
      'Created At'
    ]

  }

});


/**
 * Internal helper
 */
function KOL_IDS_ORCHESTRATOR_growthSchemaSs_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_growthSchemaSs_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (typeof SpreadsheetApp === 'undefined') {
    throw KOL_IDS_ORCHESTRATOR_error_(
      'DEPENDENCY_MISSING',
      'SpreadsheetApp is unavailable.'
    );
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw KOL_IDS_ORCHESTRATOR_error_(
      'WORKSPACE_MISSING',
      'Active spreadsheet is unavailable.'
    );
  }

  return ss;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_growthSchemaSs_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_growthSchemaSs_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Inspect Growth sheets without mutation.
 */
function KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var ss = KOL_IDS_ORCHESTRATOR_growthSchemaSs_();

  var expected = KOL_IDS_PRODUCTION_GROWTH_SCHEMA.SHEETS;

  var report = {
    success: true,
    version: KOL_IDS_PRODUCTION_GROWTH_SCHEMA.VERSION,
    sheets: {},
    missing: [],
    mismatch: [],
    healthy: []
  };

  Object.keys(expected).forEach(function(name) {

    var sh = ss.getSheetByName(name);

    if (!sh) {

      report.sheets[name] = {
        exists: false,
        valid: false,
        headers: [],
        expected: expected[name]
      };

      report.missing.push(name);
      return;
    }

    var lastColumn = sh.getLastColumn();

    var headers = lastColumn > 0
      ? sh.getRange(
          1,
          1,
          1,
          lastColumn
        ).getValues()[0].map(function(v) {
          return String(v || '').trim();
        })
      : [];

    var exact =
      headers.join('|') === expected[name].join('|');

    report.sheets[name] = {
      exists: true,
      valid: exact,
      headers: headers,
      expected: expected[name],
      rowCount: Math.max(0, sh.getLastRow() - 1)
    };

    if (exact) {
      report.healthy.push(name);
    } else {
      report.mismatch.push(name);
    }

  });

  report.success =
    report.missing.length === 0 &&
    report.mismatch.length === 0;

  return report;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Repair only missing Growth sheets.
 *
 * IMPORTANT:
 * - Creates missing sheets only.
 * - Does NOT overwrite existing sheets.
 * - Does NOT delete data.
 * - Does NOT modify existing headers.
 */
function KOL_IDS_ORCHESTRATOR_repairMissingGrowthSheets_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_repairMissingGrowthSheets_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var ss = KOL_IDS_ORCHESTRATOR_growthSchemaSs_();

  var expected = KOL_IDS_PRODUCTION_GROWTH_SCHEMA.SHEETS;

  var created = [];
  var existing = [];

  Object.keys(expected).forEach(function(name) {

    var sh = ss.getSheetByName(name);

    if (sh) {
      existing.push(name);
      return;
    }

    sh = ss.insertSheet(name);

    sh.getRange(
      1,
      1,
      1,
      expected[name].length
    ).setValues([
      expected[name]
    ]);

    sh.setFrozenRows(1);

    created.push(name);

  });

  return {
    success: true,
    version: KOL_IDS_PRODUCTION_GROWTH_SCHEMA.VERSION,
    created: created,
    existing: existing,
    createdCount: created.length,
    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_repairMissingGrowthSheets_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_repairMissingGrowthSheets_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Repair runner.
 *
 * Flow:
 * diagnostic
 *    ↓
 * missing sheets only
 *    ↓
 * repair
 *    ↓
 * diagnostic again
 */
function KOL_IDS_ORCHESTRATOR_TEST_09_RepairGrowthSchema() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_09_RepairGrowthSchema');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var before =
    KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  var repair =
    KOL_IDS_ORCHESTRATOR_repairMissingGrowthSheets_();

  var after =
    KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  var result = {
    success: after.success,
    test: 'GROWTH_SCHEMA_REPAIR',
    before: before,
    repair: repair,
    after: after,
    timestamp: new Date().toISOString()
  };

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_09_RepairGrowthSchema', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_09_RepairGrowthSchema', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Diagnostic runner only.
 *
 * SAFE / READ ONLY
 */
function KOL_IDS_ORCHESTRATOR_TEST_10_GrowthSchemaDiagnostic() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_10_GrowthSchemaDiagnostic');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var result =
    KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_10_GrowthSchemaDiagnostic', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_10_GrowthSchemaDiagnostic', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Strict validation after repair.
 */
function KOL_IDS_ORCHESTRATOR_TEST_11_GrowthSchemaValidation() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_11_GrowthSchemaValidation');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var result =
    KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  if (!result.success) {

    throw KOL_IDS_ORCHESTRATOR_error_(
      'SCHEMA_ERROR',
      'Growth schema still invalid. ' +
      'Missing: ' +
      result.missing.join(',') +
      '; mismatch: ' +
      result.mismatch.join(',')
    );

  }

  return {
    success: true,
    test: 'GROWTH_SCHEMA_VALIDATION',
    status: 'GREEN',
    sheets: result.healthy,
    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_11_GrowthSchemaValidation', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_11_GrowthSchemaValidation', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ============================================================
 * LEGACY_V25.16 SAFE PRELIGHT
 * ============================================================ */

/**
 * Diagnostic preflight.
 *
 * Unlike production preflight:
 * - This does NOT throw immediately on Growth schema missing.
 * - It reports exact repair requirement.
 */
function KOL_IDS_ORCHESTRATOR_TEST_12_PreflightDiagnostic() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_12_PreflightDiagnostic');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var result = {
    success: true,
    test: 'PREFLIGHT_DIAGNOSTIC',
    timestamp: new Date().toISOString()
  };

  try {

    result.functionAvailability =
      KOL_IDS_ORCHESTRATOR_TEST_07_FunctionAvailability();

  } catch (e) {

    result.functionAvailability = {
      success: false,
      error: String(
        e && e.message ? e.message : e
      )
    };

  }

  try {

    result.growthSchema =
      KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  } catch (e2) {

    result.growthSchema = {
      success: false,
      error: String(
        e2 && e2.message ? e2.message : e2
      )
    };

  }

  result.readyForPreflight =
    !!(
      result.functionAvailability &&
      result.functionAvailability.success &&
      result.growthSchema &&
      result.growthSchema.success
    );

  result.status =
    result.readyForPreflight
      ? 'GREEN'
      : 'REPAIR_REQUIRED';

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_12_PreflightDiagnostic', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_12_PreflightDiagnostic', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ============================================================
 * LEGACY_V25.16 ONE-CLICK SCHEMA + PREFLIGHT
 * ============================================================ */

/**
 * ONE CLICK:
 *
 * 1. Diagnose
 * 2. Repair missing Growth sheets
 * 3. Validate Growth schema
 * 4. Run real read-only preflight
 *
 * Existing sheets are NEVER overwritten.
 */
function KOL_IDS_ORCHESTRATOR_TEST_13_RepairAndPreflight() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_13_RepairAndPreflight');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var started = Date.now();

  var before =
    KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  var repair = {
    success: true,
    skipped: true,
    reason: 'NO_REPAIR_REQUIRED'
  };

  if (
    before.missing.length > 0
  ) {

    repair =
      KOL_IDS_ORCHESTRATOR_repairMissingGrowthSheets_();

  }

  var schema =
    KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  if (!schema.success) {

    var failed = {
      success: false,
      test: 'REPAIR_AND_PREFLIGHT',
      status: 'SCHEMA_REPAIR_INCOMPLETE',
      before: before,
      repair: repair,
      schema: schema,
      durationMs: Date.now() - started,
      timestamp: new Date().toISOString()
    };

    Logger.log(
      JSON.stringify(failed, null, 2)
    );

    return failed;
  }

  var preflight =
    KOL_IDS_ORCHESTRATOR_webAppPreflight_();

  var result = {
    success: !!preflight.success,
    test: 'REPAIR_AND_PREFLIGHT',
    status: preflight.success
      ? 'GREEN'
      : 'FAILED',
    before: before,
    repair: repair,
    schema: schema,
    preflight: preflight,
    durationMs: Date.now() - started,
    timestamp: new Date().toISOString()
  };

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_13_RepairAndPreflight', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_13_RepairAndPreflight', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ============================================================
 * LEGACY_V25.16 FINAL GROWTH SCHEMA CONTRACT
 * ============================================================ */

/**
 * Contract QA:
 * validates exact Growth headers.
 */
function KOL_IDS_ORCHESTRATOR_growthContractQA_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_growthContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var diagnostic =
    KOL_IDS_ORCHESTRATOR_growthSchemaDiagnostic_();

  if (!diagnostic.success) {

    throw KOL_IDS_ORCHESTRATOR_error_(
      'SCHEMA_ERROR',
      'Growth contract failed. ' +
      'Missing: ' +
      diagnostic.missing.join(',') +
      '; mismatch: ' +
      diagnostic.mismatch.join(',')
    );

  }

  return {
    success: true,
    version: KOL_IDS_PRODUCTION_GROWTH_SCHEMA.VERSION,
    status: 'GREEN',
    validatedSheets: diagnostic.healthy,
    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_growthContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_growthContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Final test runner.
 */
function KOL_IDS_ORCHESTRATOR_TEST_14_GrowthContractQA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_14_GrowthContractQA');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  try {

    var result =
      KOL_IDS_ORCHESTRATOR_growthContractQA_();

    Logger.log(
      JSON.stringify(result, null, 2)
    );

    return result;

  } catch (err) {

    var output = {
      success: false,
      test: 'GROWTH_CONTRACT_QA',
      status: 'FAILED',
      error: String(
        err && err.message ? err.message : err
      ),
      timestamp: new Date().toISOString()
    };

    Logger.log(
      JSON.stringify(output, null, 2)
    );

    return output;
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_14_GrowthContractQA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_14_GrowthContractQA', Date.now() - __kolIdsTraceStartedAt);
  }
}
/**
 * LEGACY_V25.16 CORE RUNTIME BOOTSTRAP
 *
 * Purpose:
 * - One-time initialization of all required runtime sheets.
 * - Delegates schema creation to the canonical system ensure function.
 * - Never deletes sheets.
 * - Never clears existing data.
 * - Never overwrites existing headers intentionally.
 *
 * IMPORTANT:
 * This is a MUTATING setup operation.
 * Do NOT call from Preflight.
 */
function KOL_IDS_ORCHESTRATOR_bootstrapRuntimeSchema_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_bootstrapRuntimeSchema_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var started = new Date();

  try {
    if (typeof KOL_IDS_PLATFORM_ensure_ !== 'function') {
      throw KOL_IDS_ORCHESTRATOR_error_(
        'Canonical runtime schema initializer KOL_IDS_PLATFORM_ensure_() is unavailable.'
      );
    }

    // Canonical initializer.
    // This is intentionally separate from read-only Preflight.
    KOL_IDS_PLATFORM_ensure_();

    // Validate after initialization.
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (!ss) {
      throw KOL_IDS_ORCHESTRATOR_error_(
        'No active spreadsheet found. Run this bootstrap from the bound Apps Script project.'
      );
    }

    var required = [
      'ENT_ORGS',
      'ENT_USERS',
      'ENT_BRANDS',
      'ENT_CREATOR_DATA',
      'ENT_BENCHMARKS',
      'ENT_MODEL_REGISTRY',
      'ENT_MODEL_METRICS',
      'ENT_INTEGRATIONS',
      'ENT_INGEST_JOBS',
      'ENT_API_KEYS',
      'ENT_AUDIT_LOG',
      'ENT_ONBOARDING',
      'ENT_SLA',
      'ENT_CONSULTING',
      'ENT_DASHBOARD_CONFIG',
      'ENT_CAMPAIGNS',
      'ENT_CREATOR_SNAPSHOTS',
      'ENT_RECOMMENDATIONS',
      'ENT_OUTCOMES',
      'ENT_PREDICTION_EVAL',
      'ENT_DATA_LINEAGE',
      'ENT_CAMPAIGN_PLANS',
      'ENT_CAMPAIGN_TASKS',
      'ENT_CAMPAIGN_BUDGET',
      'ENT_CAMPAIGN_KPIS',
      'ENT_CAMPAIGN_RISKS',
      'ENT_CAMPAIGN_EVENTS',
      'ENT_OUTCOME_LEARNING',
      'ENT_LEARNING_SIGNALS',

      // LEGACY_V25.14 / LEGACY_V25.16 Growth layer
      'ENT_CREATOR_MARKETPLACE',
      'ENT_CAMPAIGN_DELIVERABLES',
      'ENT_DISCOVERY_EVENTS',
      'ENT_MATCH_DECISIONS'
    ];

    var missing = [];
    var present = [];

    required.forEach(function(name) {
      if (ss.getSheetByName(name)) {
        present.push(name);
      } else {
        missing.push(name);
      }
    });

    return {
      success: missing.length === 0,
      version: '25.16.0',
      operation: 'RUNTIME_SCHEMA_BOOTSTRAP',
      createdOrPresent: present.length,
      missing: missing,
      requiredCount: required.length,
      timestamp: new Date().toISOString(),
      durationMs: new Date().getTime() - started.getTime()
    };

  } catch (err) {
    return {
      success: false,
      version: '25.16.0',
      operation: 'RUNTIME_SCHEMA_BOOTSTRAP',
      error: err && err.message
        ? err.message
        : String(err),
      timestamp: new Date().toISOString(),
      durationMs: new Date().getTime() - started.getTime()
    };
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_bootstrapRuntimeSchema_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_bootstrapRuntimeSchema_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Manual test runner.
 */
function KOL_IDS_ORCHESTRATOR_TEST_15_RuntimeSchemaBootstrap() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_15_RuntimeSchemaBootstrap');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var result = KOL_IDS_ORCHESTRATOR_bootstrapRuntimeSchema_();

  Logger.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    throw new Error(
      'Runtime schema bootstrap failed: ' +
      JSON.stringify(result)
    );
  }

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_15_RuntimeSchemaBootstrap', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_15_RuntimeSchemaBootstrap', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Read-only diagnostic.
 *
 * Does NOT create or modify anything.
 */
function KOL_IDS_ORCHESTRATOR_runtimeSchemaDiagnostic_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_runtimeSchemaDiagnostic_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    return {
      success: false,
      version: '25.16.0',
      error: 'No active spreadsheet.',
      timestamp: new Date().toISOString()
    };
  }

  var required = [
    'ENT_ORGS',
    'ENT_USERS',
    'ENT_BRANDS',
    'ENT_CREATOR_DATA',
    'ENT_BENCHMARKS',
    'ENT_MODEL_REGISTRY',
    'ENT_MODEL_METRICS',
    'ENT_INTEGRATIONS',
    'ENT_INGEST_JOBS',
    'ENT_API_KEYS',
    'ENT_AUDIT_LOG',
    'ENT_ONBOARDING',
    'ENT_SLA',
    'ENT_CONSULTING',
    'ENT_DASHBOARD_CONFIG',
    'ENT_CAMPAIGNS',
    'ENT_CREATOR_SNAPSHOTS',
    'ENT_RECOMMENDATIONS',
    'ENT_OUTCOMES',
    'ENT_PREDICTION_EVAL',
    'ENT_DATA_LINEAGE',
    'ENT_CAMPAIGN_PLANS',
    'ENT_CAMPAIGN_TASKS',
    'ENT_CAMPAIGN_BUDGET',
    'ENT_CAMPAIGN_KPIS',
    'ENT_CAMPAIGN_RISKS',
    'ENT_CAMPAIGN_EVENTS',
    'ENT_OUTCOME_LEARNING',
    'ENT_LEARNING_SIGNALS',
    'ENT_CREATOR_MARKETPLACE',
    'ENT_CAMPAIGN_DELIVERABLES',
    'ENT_DISCOVERY_EVENTS',
    'ENT_MATCH_DECISIONS'
  ];

  var missing = [];
  var existing = [];

  required.forEach(function(name) {
    if (ss.getSheetByName(name)) {
      existing.push(name);
    } else {
      missing.push(name);
    }
  });

  return {
    success: missing.length === 0,
    version: '25.16.0',
    requiredCount: required.length,
    existingCount: existing.length,
    missingCount: missing.length,
    existing: existing,
    missing: missing,
    readOnly: true,
    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_runtimeSchemaDiagnostic_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_runtimeSchemaDiagnostic_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Test read-only runtime schema diagnostic.
 */
function KOL_IDS_ORCHESTRATOR_TEST_16_RuntimeSchemaDiagnostic() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_16_RuntimeSchemaDiagnostic');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var result = KOL_IDS_ORCHESTRATOR_runtimeSchemaDiagnostic_();

  Logger.log(JSON.stringify(result, null, 2));

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_16_RuntimeSchemaDiagnostic', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_16_RuntimeSchemaDiagnostic', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* ============================================================
 * LEGACY_V25.16 CANONICAL RUNTIME SCHEMA BOOTSTRAP
 * ------------------------------------------------------------
 * Purpose:
 * - Bootstrap missing Core Runtime sheets.
 * - Reuse canonical V25 sheet/header contracts whenever available.
 * - Never overwrite existing sheets.
 * - Never delete data.
 * - Never modify existing headers.
 * - Fail closed when canonical header contract is unavailable.
 * ============================================================ */

function KOL_IDS_ORCHESTRATOR_runtimeRequiredSheets_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_runtimeRequiredSheets_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var names = [];

  /* Core V25 sheets */
  if (
    typeof KOL_IDS !== 'undefined' &&
    KOL_IDS.SHEETS
  ) {

    Object.keys(KOL_IDS.SHEETS).forEach(function (key) {

      var name = KOL_IDS.SHEETS[key];

      if (
        name &&
        names.indexOf(name) === -1
      ) {
        names.push(name);
      }

    });

  }

  /* LEGACY_V25.14 Campaign Control */
  if (typeof KOL_IDS !== 'undefined') {

    [
      KOL_IDS.PLAN,
      KOL_IDS.TASKS,
      KOL_IDS.BUDGET,
      KOL_IDS.KPIS,
      KOL_IDS.RISKS,
      KOL_IDS.EVENTS
    ].forEach(function (name) {

      if (
        name &&
        names.indexOf(name) === -1
      ) {
        names.push(name);
      }

    });

  }

  /* LEGACY_V25.15 Outcome Learning */
  if (typeof KOL_IDS !== 'undefined') {

    [
      KOL_IDS.SHEETS.LEARNING,
      KOL_IDS.SHEETS.SIGNALS
    ].forEach(function (name) {

      if (
        name &&
        names.indexOf(name) === -1
      ) {
        names.push(name);
      }

    });

  }

  /* LEGACY_V25.16 Growth */
  [
    'ENT_CREATOR_MARKETPLACE',
    'ENT_CAMPAIGN_DELIVERABLES',
    'ENT_DISCOVERY_EVENTS',
    'ENT_MATCH_DECISIONS'
  ].forEach(function (name) {

    if (names.indexOf(name) === -1) {
      names.push(name);
    }

  });

  return names;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_runtimeRequiredSheets_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_runtimeRequiredSheets_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Attempts to resolve canonical headers from known schema contracts.
 *
 * IMPORTANT:
 * This function NEVER invents headers.
 */
function KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_(sheetName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  /*
   * LEGACY_V25.16 CANONICAL SCHEMA RESOLVER
   *
   * Resolution order:
   *  1) LEGACY_V25.16 Growth contract
   *  2) LEGACY_V25.15 Outcome Learning contract
   *  3) LEGACY_V25.14 Campaign Control contract
   *  4) V25 Core Enterprise contract
   *  5) Explicit registry objects (compatibility fallback)
   *
   * IMPORTANT:
   * - Never invent headers.
   * - Prefer the actual canonical module functions shipped in this build.
   * - Return a KOL_IDS_PRODUCT_copy so callers cannot mutate the source contract.
   */

  var name = String(sheetName || '').trim();
  if (!name) return null;

  /* LEGACY_V25.16 Growth */
  try {
    if (
      typeof KOL_IDS_PRODUCTION_GROWTH_SCHEMA !== 'undefined' &&
      KOL_IDS_PRODUCTION_GROWTH_SCHEMA.SHEETS &&
      Array.isArray(KOL_IDS_PRODUCTION_GROWTH_SCHEMA.SHEETS[name]) &&
      KOL_IDS_PRODUCTION_GROWTH_SCHEMA.SHEETS[name].length
    ) {
      return KOL_IDS_PRODUCTION_GROWTH_SCHEMA.SHEETS[name].slice();
    }
  } catch (e) {}

  /* LEGACY_V25.15 Outcome Learning */
  try {
    if (typeof KOL_IDS_LEARNING_headers_ === 'function') {
      var v15 = KOL_IDS_LEARNING_headers_();
      if (v15 && Array.isArray(v15[name]) && v15[name].length) {
        return v15[name].slice();
      }
    }
  } catch (e) {}

  /* LEGACY_V25.14 Campaign Control */
  try {
    if (typeof KOL_IDS_CAMPAIGN_CONTROL_headers_ === 'function') {
      var v14 = KOL_IDS_CAMPAIGN_CONTROL_headers_();
      if (v14 && Array.isArray(v14[name]) && v14[name].length) {
        return v14[name].slice();
      }
    }
  } catch (e) {}

  /* V25 Core Enterprise */
  try {
    if (typeof KOL_IDS_PLATFORM_headers_ === 'function') {
      var core = KOL_IDS_PLATFORM_headers_();
      if (core && Array.isArray(core[name]) && core[name].length) {
        return core[name].slice();
      }
    }
  } catch (e) {}

  /* Compatibility registry fallback */
  var registries = [
    'KOL_IDS_PLATFORM_SCHEMA',
    'KOL_IDS_PLATFORM_SCHEMAS',
    'KOL_IDS_PLATFORM_HEADERS',
    'KOL_IDS_PLATFORM_SHEET_HEADERS'
  ];

  for (var i = 0; i < registries.length; i++) {
    try {
      var obj = this[registries[i]];
      if (
        obj &&
        Array.isArray(obj[name]) &&
        obj[name].length
      ) {
        return obj[name].slice();
      }
    } catch (e) {}
  }

  return null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Diagnostic:
 * determines which required sheets are missing and whether
 * their canonical headers are resolvable.
 */
function KOL_IDS_ORCHESTRATOR_runtimeSchemaBootstrapDiagnostic_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_runtimeSchemaBootstrapDiagnostic_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw KOL_IDS_ORCHESTRATOR_error_(
      'WORKSPACE_MISSING',
      'Active spreadsheet is unavailable.'
    );
  }

  var required =
    KOL_IDS_ORCHESTRATOR_runtimeRequiredSheets_();

  var missing = [];
  var existing = [];
  var unresolvedSchema = [];

  required.forEach(function (name) {

    if (ss.getSheetByName(name)) {

      existing.push(name);

    } else {

      missing.push(name);

      var headers =
        KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_(name);

      if (
        !headers ||
        !headers.length
      ) {

        unresolvedSchema.push(name);

      }

    }

  });

  return {
    success:
      missing.length === 0 &&
      unresolvedSchema.length === 0,

    version: '25.16.0',

    requiredCount: required.length,

    existingCount: existing.length,

    missingCount: missing.length,

    unresolvedSchemaCount:
      unresolvedSchema.length,

    existing: existing,

    missing: missing,

    unresolvedSchema: unresolvedSchema,

    readOnly: true,

    timestamp: new Date().toISOString()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_runtimeSchemaBootstrapDiagnostic_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_runtimeSchemaBootstrapDiagnostic_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Actual bootstrap.
 *
 * Creates ONLY missing sheets whose canonical headers are known.
 *
 * If even one required sheet has an unresolved canonical schema,
 * the operation FAILS CLOSED before creating anything.
 */
function KOL_IDS_ORCHESTRATOR_bootstrapCanonicalRuntimeSchema_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_bootstrapCanonicalRuntimeSchema_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var lock =
    LockService.getScriptLock();

  lock.waitLock(30000);

  try {

    var ss =
      SpreadsheetApp.getActiveSpreadsheet();

    if (!ss) {

      throw KOL_IDS_ORCHESTRATOR_error_(
        'WORKSPACE_MISSING',
        'Active spreadsheet is unavailable.'
      );

    }

    var diagnostic =
      KOL_IDS_ORCHESTRATOR_runtimeSchemaBootstrapDiagnostic_();

    if (
      diagnostic.unresolvedSchemaCount > 0
    ) {

      throw KOL_IDS_ORCHESTRATOR_error_(
        'SCHEMA_CONTRACT_UNRESOLVED',
        'Cannot safely bootstrap runtime schema. ' +
        'Canonical headers unavailable for: ' +
        diagnostic.unresolvedSchema.join(',')
      );

    }

    var created = [];
    var existing = [];

    diagnostic.missing.forEach(function (name) {

      /*
       * Re-check under lock.
       */
      var existingSheet =
        ss.getSheetByName(name);

      if (existingSheet) {

        existing.push(name);
        return;

      }

      var headers =
        KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_(name);

      if (
        !headers ||
        !headers.length
      ) {

        throw KOL_IDS_ORCHESTRATOR_error_(
          'SCHEMA_CONTRACT_UNRESOLVED',
          'Canonical headers unavailable for ' +
          name
        );

      }

      var sh =
        ss.insertSheet(name);

      sh
        .getRange(
          1,
          1,
          1,
          headers.length
        )
        .setValues([headers]);

      sh.setFrozenRows(1);

      created.push(name);

    });

    /*
     * Final verification.
     */
    var finalDiagnostic =
      KOL_IDS_ORCHESTRATOR_runtimeSchemaBootstrapDiagnostic_();

    return {
      success:
        finalDiagnostic.missingCount === 0 &&
        finalDiagnostic.unresolvedSchemaCount === 0,

      version: '25.16.0',

      operation:
        'CANONICAL_RUNTIME_SCHEMA_BOOTSTRAP',

      created: created,

      createdCount:
        created.length,

      existing: existing,

      final:
        finalDiagnostic,

      timestamp:
        new Date().toISOString()
    };

  } finally {

    lock.releaseLock();

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_bootstrapCanonicalRuntimeSchema_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_bootstrapCanonicalRuntimeSchema_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 17
 *
 * Read-only diagnostic.
 */
function KOL_IDS_ORCHESTRATOR_TEST_17_RuntimeSchemaBootstrapDiagnostic() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_17_RuntimeSchemaBootstrapDiagnostic');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var result =
    KOL_IDS_ORCHESTRATOR_runtimeSchemaBootstrapDiagnostic_();

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_17_RuntimeSchemaBootstrapDiagnostic', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_17_RuntimeSchemaBootstrapDiagnostic', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * TEST 18
 *
 * Canonical runtime bootstrap.
 */
function KOL_IDS_ORCHESTRATOR_TEST_18_CanonicalRuntimeBootstrap() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_18_CanonicalRuntimeBootstrap');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var result =
    KOL_IDS_ORCHESTRATOR_bootstrapCanonicalRuntimeSchema_();

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  if (!result.success) {

    throw new Error(
      'Canonical runtime schema bootstrap failed: ' +
      JSON.stringify(result)
    );

  }

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_18_CanonicalRuntimeBootstrap', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_18_CanonicalRuntimeBootstrap', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * LEGACY_V25.16 TEST 19 — Canonical Schema Resolver QA
 *
 * Read-only. Verifies every required runtime sheet has a resolvable
 * canonical header contract from the actual shipped modules.
 */
function KOL_IDS_ORCHESTRATOR_TEST_19_CanonicalSchemaResolverQA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_19_CanonicalSchemaResolverQA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var required = KOL_IDS_ORCHESTRATOR_runtimeRequiredSheets_();
  var resolved = [];
  var unresolved = [];

  required.forEach(function(name) {
    var headers = KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_(name);
    if (headers && headers.length) {
      resolved.push({
        sheet: name,
        columns: headers.length,
        first: headers[0],
        last: headers[headers.length - 1]
      });
    } else {
      unresolved.push(name);
    }
  });

  var result = {
    success: unresolved.length === 0,
    version: '25.16.0',
    operation: 'CANONICAL_SCHEMA_RESOLVER_QA',
    requiredCount: required.length,
    resolvedCount: resolved.length,
    unresolvedCount: unresolved.length,
    unresolved: unresolved,
    resolved: resolved,
    readOnly: true,
    timestamp: new Date().toISOString()
  };

  Logger.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    throw new Error(
      'Canonical schema resolver QA failed: ' +
      JSON.stringify(result)
    );
  }

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_19_CanonicalSchemaResolverQA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_19_CanonicalSchemaResolverQA', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * LEGACY_V25.16 TEST 20 — Repair + Full Runtime Schema Verification
 *
 * Mutation is limited to missing runtime sheets with canonical schemas.
 * Existing sheet data/header order is never deleted or rewritten.
 */
function KOL_IDS_ORCHESTRATOR_TEST_20_RepairAndVerifyCanonicalRuntimeSchema() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_20_RepairAndVerifyCanonicalRuntimeSchema');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var bootstrap = KOL_IDS_ORCHESTRATOR_bootstrapCanonicalRuntimeSchema_();

  if (!bootstrap.success) {
    throw new Error(
      'Canonical runtime schema bootstrap failed: ' +
      JSON.stringify(bootstrap)
    );
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var required = KOL_IDS_ORCHESTRATOR_runtimeRequiredSheets_();
  var missing = [];
  var mismatch = [];

  required.forEach(function(name) {
    var sh = ss.getSheetByName(name);
    if (!sh) {
      missing.push(name);
      return;
    }

    var expected = KOL_IDS_ORCHESTRATOR_resolveCanonicalHeaders_(name);
    if (!expected || !expected.length) return;

    var actual = sh.getLastColumn()
      ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String)
      : [];

    if (actual.join('|') !== expected.join('|')) {
      mismatch.push({
        sheet: name,
        expected: expected,
        actual: actual
      });
    }
  });

  var result = {
    success: missing.length === 0 && mismatch.length === 0,
    version: '25.16.0',
    operation: 'REPAIR_AND_VERIFY_CANONICAL_RUNTIME_SCHEMA',
    requiredCount: required.length,
    missing: missing,
    mismatchCount: mismatch.length,
    mismatches: mismatch,
    timestamp: new Date().toISOString()
  };

  Logger.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    throw new Error(
      'Canonical runtime schema verification failed: ' +
      JSON.stringify(result)
    );
  }

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_20_RepairAndVerifyCanonicalRuntimeSchema', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_20_RepairAndVerifyCanonicalRuntimeSchema', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * LEGACY_V25.16 TEST 21 — System Cohesion QA
 * Read-only. Verifies the shared internal cohesion primitives are callable.
 */
function KOL_IDS_ORCHESTRATOR_TEST_21_SystemCohesionQA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ORCHESTRATOR_TEST_21_SystemCohesionQA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sample={
    orgId:'QA_ORG',brandId:'QA_BRAND',campaignId:'QA_CAMPAIGN',
    creatorId:'QA_CREATOR',objective:'ROAS',modelVersion:'25.16'
  };
  var ctx=KOL_IDS_GROWTH_cohesionContext_(sample);
  var corr=KOL_IDS_GROWTH_cohesionCorrelation_(ctx);
  var ev=KOL_IDS_GROWTH_cohesionEvidence_({
    source:'QA',externalId:'QA1',quality:0.9,completeness:1,
    observedAt:new Date().toISOString()
  });
  var score=KOL_IDS_GROWTH_cohesionScore_(75,ev.confidence,0.1,0.05);
  var result={
    success:!!ctx.orgId && !!ctx.campaignId && !!corr &&
             ev.confidence>=0.05 && score>=0 && score<=100,
    version:'25.16.0',
    contextReady:true,
    correlationReady:!!corr,
    evidenceReady:true,
    boundedScore:score>=0 && score<=100,
    readOnly:true,
    timestamp:new Date().toISOString()
  };
  Logger.log(JSON.stringify(result,null,2));
  if(!result.success) throw new Error('System cohesion QA failed');
  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ORCHESTRATOR_TEST_21_SystemCohesionQA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ORCHESTRATOR_TEST_21_SystemCohesionQA', Date.now() - __kolIdsTraceStartedAt);
  }
}
