/**
 * KOL IDS — CANONICAL STATE + DEPENDENCY ENGINE
 *
 * One source of truth for the customer workflow.
 * - Every mutation is serialized with a revision.
 * - Downstream stages are marked stale instead of silently retaining invalid results.
 * - Edits merge into the same campaign context; they never create a new island.
 * - A mutation response always returns the complete canonical context.
 * - Selection is stored as a snapshot of the selected creator objects, not only names.
 *
 * This file is intended to be appended LAST and is the final authority for the
 * self-service endpoints it overrides.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  CONTEXT_KEY:'KOL_IDS_CANONICAL_FLOW_CONTEXT',
  META_KEY:'KOL_IDS_CANONICAL_META',
  STAGES:['CAMPAIGN','AUDIENCE','PERSONA','DECISION','SELECTION','RUN','GEN_CODE','PERFORMANCE','REPORT'],
  DOWNSTREAM:Object.freeze({
    CAMPAIGN:['AUDIENCE','PERSONA','DECISION','SELECTION','RUN','PERFORMANCE','REPORT'],
    AUDIENCE:['PERSONA','DECISION','SELECTION','RUN','PERFORMANCE','REPORT'],
    PERSONA:['DECISION','SELECTION','RUN','PERFORMANCE','REPORT'],
    DECISION:['SELECTION','RUN','PERFORMANCE','REPORT'],
    SELECTION:['RUN','GEN_CODE','PERFORMANCE','REPORT'],
    RUN:['GEN_CODE','PERFORMANCE','REPORT'],
    GEN_CODE:['PERFORMANCE','REPORT'],
    PERFORMANCE:['REPORT']
  })
});

function KOL_IDS_CANONICAL_text_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_text_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(v==null?'':v).trim();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_text_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_text_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_json_(v,f){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_json_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{return JSON.parse(v);}catch(e){return f;}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_json_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_json_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_props_(){
  // UserProperties is pointer/session metadata only. Canonical objects live in ENT_CANONICAL_STATE.
  return PropertiesService.getUserProperties();
}
function KOL_IDS_CANONICAL_now_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_now_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return new Date().toISOString();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_now_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_now_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_clone_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_clone_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return v==null?v:JSON.parse(JSON.stringify(v));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_clone_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_clone_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_hash_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var raw=JSON.stringify(v==null?null:v);
  var d=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,raw);
  return d.map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_unique_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_unique_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var out=[],seen={}; (Array.isArray(a)?a:[]).forEach(function(x){var s=KOL_IDS_CANONICAL_text_(x);if(s&&!seen[s]){seen[s]=1;out.push(s);}}); return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_unique_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_unique_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_getContext_(){
  var stored=(typeof KOL_IDS_ARCH_getCanonicalContext_==='function')?KOL_IDS_ARCH_getCanonicalContext_():null;
  var c=stored;
  if(!c){
    c={analysisId:'',campaignId:'',brandId:'',orgId:'',brand:{},campaign:{},audience:{},persona:null,kols:[],decisionParameters:null,selection:{creators:[],names:[],creatorIds:[]},selectedCreators:[],selectedCreatorIds:[],genCodePlan:null,genCodes:{codes:[]},performance:null};
  }
  c.meta=c.meta||{};
  c.meta.revision=Number(c.meta.revision||0);
  c.meta.staleStages=Array.isArray(c.meta.staleStages)?KOL_IDS_CANONICAL_unique_(c.meta.staleStages):[];
  c.meta.stageRevision=c.meta.stageRevision||{};
  c.meta.lastMutation=c.meta.lastMutation||'';
  c.meta.updatedAt=c.meta.updatedAt||'';
  c.selectedCreators=Array.isArray(c.selectedCreators)?c.selectedCreators:[];
  c.selectedCreatorIds=Array.isArray(c.selectedCreatorIds)?KOL_IDS_CANONICAL_unique_(c.selectedCreatorIds):[];
  c.genCodes=c.genCodes&&typeof c.genCodes==='object'?c.genCodes:{codes:[]};
  c.genCodes.codes=Array.isArray(c.genCodes.codes)?c.genCodes.codes:[];
  c.genCodePlan=c.genCodePlan&&typeof c.genCodePlan==='object'?c.genCodePlan:null;
  c.performance=c.performance&&typeof c.performance==='object'?c.performance:null;
  c.selection=c.selection&&typeof c.selection==='object'?c.selection:{creators:[],names:[],creatorIds:[]};
  c.selection.creators=Array.isArray(c.selection.creators)?c.selection.creators:[];
  c.selection.names=Array.isArray(c.selection.names)?c.selection.names:[];
  c.selection.creatorIds=Array.isArray(c.selection.creatorIds)?KOL_IDS_CANONICAL_unique_(c.selection.creatorIds):[];
  return c;
}
function KOL_IDS_CANONICAL_setContext_(ctx){
  if(typeof KOL_IDS_ARCH_writeCanonical_==='function')return KOL_IDS_ARCH_writeCanonical_(ctx);
  throw new Error('KOL IDS™: Canonical state store is unavailable.');
}
function KOL_IDS_CANONICAL_markStale_(ctx,stage){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_markStale_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ds=KOL_IDS.DOWNSTREAM[stage]||[];
  ctx.meta.staleStages=KOL_IDS_CANONICAL_unique_((ctx.meta.staleStages||[]).concat(ds));
  return ctx;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_markStale_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_markStale_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_clearStageStale_(ctx,stage){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_clearStageStale_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
ctx.meta.staleStages=(ctx.meta.staleStages||[]).filter(function(x){return x!==stage;});return ctx;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_clearStageStale_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_clearStageStale_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_mutate_(ctx,operation,stage,mutator){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_mutate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof mutator!=='function')throw new Error('MUTATOR_REQUIRED');
  return KOL_IDS_SYSTEM_CONTRACT_withMutationLock_(function(){
    var current=KOL_IDS_CANONICAL_getContext_();
    if(ctx&&ctx.analysisId&&current.analysisId&&ctx.analysisId!==current.analysisId)throw new Error('STALE_ANALYSIS_CONTEXT');
    current=mutator(current)||current;
    /* Every mutation invalidates downstream calculations in the same canonical flow. */
    KOL_IDS_CANONICAL_markStale_(current,stage);
    current.meta.revision=Number(current.meta.revision||0)+1;
    current.meta.stageRevision=current.meta.stageRevision||{};
    current.meta.stageRevision[stage]=current.meta.revision;
    current.meta.lastMutation=operation;
    current.meta.updatedAt=KOL_IDS_CANONICAL_now_();
    current.meta.contextHash=KOL_IDS_CANONICAL_hash_({analysisId:current.analysisId,campaignId:current.campaignId,brandId:current.brandId,brand:current.brand,campaign:current.campaign,audience:current.audience,persona:current.persona,decisionParameters:current.decisionParameters,selection:current.selection,genCodePlan:current.genCodePlan,genCodes:current.genCodes,performance:current.performance});
    KOL_IDS_CANONICAL_clearStageStale_(current,stage);
    KOL_IDS_CANONICAL_setContext_(current);
    return current;
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_mutate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_mutate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_persist_(ctx,stage,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_persist_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  /*
   * 1.0.0 compatibility fix: the current production package owns workspace
   * routing in KOL_IDS_SYSTEM_getSpreadsheet_().  The legacy
   * KOL_IDS_PRODUCT_getSpreadsheet_() symbol is not guaranteed to exist
   * because KOL_IDS_PRODUCT.gs is intentionally only a compatibility stub.
   * Resolve the active customer workspace through the canonical system router.
   */
  var ss = (typeof KOL_IDS_SYSTEM_getSpreadsheet_ === 'function')
    ? KOL_IDS_SYSTEM_getSpreadsheet_()
    : (typeof KOL_IDS_PRODUCT_getSpreadsheet_ === 'function' ? KOL_IDS_PRODUCT_getSpreadsheet_() : null);
  if(!ss) throw new Error('KOL IDS™: Active customer workspace is unavailable.');
  if(typeof KOL_IDS_PRODUCT_persistActiveContext_==='function')KOL_IDS_PRODUCT_persistActiveContext_(ss,{analysisId:ctx.analysisId,campaignId:ctx.campaignId,brandId:ctx.brandId,brand:ctx.brand,campaign:ctx.campaign,audience:ctx.audience},ctx.analysisId,ctx.campaignId,ctx.brandId);
  if(stage!=='Campaign' && typeof KOL_IDS_FLOW_writeStage_==='function')KOL_IDS_FLOW_writeStage_(ss,ctx,stage,stage,ctx.campaignId||ctx.analysisId,payload||ctx);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_persist_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_persist_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_result_(ctx,stage,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_result_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return {success:true,ok:true,verified:true,version:KOL_IDS.VERSION,stage:stage,analysisId:ctx.analysisId,campaignId:ctx.campaignId,brandId:ctx.brandId,revision:ctx.meta.revision,staleStages:ctx.meta.staleStages.slice(),context:KOL_IDS_CANONICAL_clone_(ctx),data:data||null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_result_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_result_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CANONICAL_selectionObjects_(ctx,names){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_selectionObjects_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var wanted={};KOL_IDS_CANONICAL_unique_(names).forEach(function(n){wanted[n]=1;});
  return (Array.isArray(ctx.kols)?ctx.kols:[]).filter(function(k){return wanted[KOL_IDS_CANONICAL_text_(k&&k.name)] && k.analyzed!==false;}).map(KOL_IDS_CANONICAL_clone_);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_selectionObjects_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_selectionObjects_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Campaign edit: preserves the same IDs and invalidates every affected downstream result. */
function KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_CAMPAIGN_CONTEXT',true,function(){
    KOL_IDS_SELF_ROUTE_(); payload=payload||{};
    KOL_IDS_FLOW_validateCampaign_(payload);
    var existing=KOL_IDS_CANONICAL_getContext_();
    var ctx=KOL_IDS_CANONICAL_mutate_(existing,'SAVE_CAMPAIGN_CONTEXT','CAMPAIGN',function(c){
      var merged=KOL_IDS_FLOW_buildCampaignContext_(payload,c);
      merged.analysisId=c.analysisId||merged.analysisId;
      merged.campaignId=c.campaignId||merged.campaignId;
      merged.brandId=c.brandId||merged.brandId;
      merged.meta=c.meta;
      merged.kols=c.kols||[]; merged.persona=c.persona||null;
      return merged;
    });
    if(typeof KOL_IDS_PRODUCT_setActiveAnalysisId_==='function')KOL_IDS_PRODUCT_setActiveAnalysisId_(ctx.analysisId);
    KOL_IDS_CANONICAL_persist_(ctx,'Campaign',{brand:ctx.brand,campaign:ctx.campaign});
    return KOL_IDS_CANONICAL_result_(ctx,'CAMPAIGN',{changed:true,recalculationRequired:ctx.meta.staleStages.slice()});
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT', Date.now() - __kolIdsTraceStartedAt);
  }
};

/* Campaign draft save: allows incomplete campaign foundations to be preserved without
 * blocking the customer on required fields. Continue still uses the strict
 * campaign validator, so a draft can never be mistaken for an analysis-ready context. */
function KOL_IDS_SELF_SAVE_CAMPAIGN_DRAFT(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_CAMPAIGN_DRAFT');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_CAMPAIGN_DRAFT',true,function(){
      KOL_IDS_SELF_ROUTE_(); payload=payload||{};
      var existing=KOL_IDS_CANONICAL_getContext_();
      var ctx=KOL_IDS_CANONICAL_mutate_(existing,'SAVE_CAMPAIGN_DRAFT','CAMPAIGN',function(c){
        var merged=KOL_IDS_FLOW_buildCampaignContext_(payload,c);
        merged.analysisId=c.analysisId||merged.analysisId;
        merged.campaignId=c.campaignId||merged.campaignId;
        merged.brandId=c.brandId||merged.brandId;
        merged.meta=c.meta;
        merged.kols=c.kols||[]; merged.persona=c.persona||null;
        merged.meta=Object.assign({},merged.meta||{}, {draft:true, draftSavedAt:new Date().toISOString()});
        return merged;
      });
      if(typeof KOL_IDS_PRODUCT_setActiveAnalysisId_==='function' && ctx.analysisId) KOL_IDS_PRODUCT_setActiveAnalysisId_(ctx.analysisId);
      KOL_IDS_CANONICAL_persist_(ctx,'Campaign Draft',{brand:ctx.brand,campaign:ctx.campaign});
      return KOL_IDS_CANONICAL_result_(ctx,'CAMPAIGN',{changed:true,draft:true,recalculationRequired:ctx.meta.staleStages.slice()});
    });
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_CAMPAIGN_DRAFT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_CAMPAIGN_DRAFT', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_SAVE_AUDIENCE_CONTEXT(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_AUDIENCE_CONTEXT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_AUDIENCE_CONTEXT',true,function(){
    KOL_IDS_SELF_ROUTE_(); payload=payload||{}; var ctx=KOL_IDS_CANONICAL_getContext_();
    if(!ctx.analysisId||!ctx.campaignId||!ctx.brandId)throw new Error('Campaign context must be saved before Audience.');
    var a=payload.audience&&typeof payload.audience==='object'?payload.audience:payload;
    if(!KOL_IDS_CANONICAL_text_(a.description))throw new Error('Audience description is required.');
    var next=KOL_IDS_CANONICAL_mutate_(ctx,'SAVE_AUDIENCE_CONTEXT','AUDIENCE',function(c){
      c.audience=Object.assign({},c.audience||{},a); c.campaign=Object.assign({},c.campaign||{},{audience:KOL_IDS_CANONICAL_text_(c.audience.description)}); return c;
    });
    KOL_IDS_CANONICAL_persist_(next,'Audience',next.audience); return KOL_IDS_CANONICAL_result_(next,'AUDIENCE',{changed:true,recalculationRequired:next.meta.staleStages.slice()});
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_AUDIENCE_CONTEXT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_AUDIENCE_CONTEXT', Date.now() - __kolIdsTraceStartedAt);
  }
};

function KOL_IDS_SELF_SAVE_DECISION_CONTEXT(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_DECISION_CONTEXT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_DECISION_CONTEXT',true,function(){
    KOL_IDS_SELF_ROUTE_(); payload=payload||{}; var ctx=KOL_IDS_CANONICAL_getContext_();
    if(!ctx.analysisId)throw new Error('No active campaign analysis. Start from Campaign.');
    var d=payload.decisionParameters||payload, keys=['brand','audience','campaign','confidence','value','risk'];
    var total=keys.reduce(function(s,k){return s+Number(d[k]||0);},0); if(Math.abs(total-100)>.01)throw new Error('Decision weights must total 100.');
    if(Number(d.threshold)<0||Number(d.threshold)>100||Number(d.ceiling)<0||Number(d.ceiling)>100)throw new Error('Decision threshold and risk ceiling must be 0–100.');
    var next=KOL_IDS_CANONICAL_mutate_(ctx,'SAVE_DECISION_CONTEXT','DECISION',function(c){c.decisionParameters=Object.assign({},d,{savedAt:KOL_IDS_CANONICAL_now_()});return c;});
    KOL_IDS_CANONICAL_persist_(next,'Decision Parameters',next.decisionParameters); return KOL_IDS_CANONICAL_result_(next,'DECISION',{changed:true,recalculationRequired:next.meta.staleStages.slice()});
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_DECISION_CONTEXT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_DECISION_CONTEXT', Date.now() - __kolIdsTraceStartedAt);
  }
};

/* KOL analysis save: preserve prior analysis but establish the same canonical context. */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_SAVE(payload){
  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE',true,function(){
    KOL_IDS_SELF_ROUTE_(); payload=payload||{}; var ctx=KOL_IDS_CANONICAL_getContext_();
    var merged=KOL_IDS_FLOW_buildCampaignContext_(payload,ctx); merged.analysisId=ctx.analysisId||merged.analysisId; merged.campaignId=ctx.campaignId||merged.campaignId; merged.brandId=ctx.brandId||merged.brandId;
    payload.analysisId=merged.analysisId; payload.campaignId=merged.campaignId; payload.brandId=merged.brandId; payload.brand=merged.brand; payload.campaign=merged.campaign; payload.audience=merged.audience; payload.objectives=merged.campaign.objectives; payload.objective=merged.campaign.objective;
    if(Array.isArray(payload.kols))payload.kols=payload.kols.map(function(k,i){return typeof KOL_IDS_ARCH_normalizeCreator_==='function'?KOL_IDS_ARCH_normalizeCreator_(KOL_IDS_CANONICAL_clone_(k),i):k;});
    var result=KOL_IDS_PRODUCT_SAVE(payload);
    var next=KOL_IDS_CANONICAL_mutate_(ctx,'SAVE_KOL_ANALYSIS','PERSONA',function(c){c.analysisId=merged.analysisId;c.campaignId=merged.campaignId;c.brandId=merged.brandId;c.brand=merged.brand;c.campaign=merged.campaign;c.audience=merged.audience;c.kols=Array.isArray(payload.kols)?payload.kols:c.kols;c.persona=payload.persona||c.persona||null;return c;});
    KOL_IDS_CANONICAL_persist_(next,'Persona',next.persona||{kols:next.kols});
    return Object.assign({},result,KOL_IDS_CANONICAL_result_(next,'PERSONA',{changed:true,recalculationRequired:next.meta.staleStages.slice()}));
  });
}

/* Selection stores IDs/names plus the analyzed object snapshot. Multiple creators are first-class. */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_SAVE_SELECTION(payload){
  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_SELECTION',true,function(){
    KOL_IDS_SELF_ROUTE_(); payload=payload||{}; var ctx=KOL_IDS_CANONICAL_getContext_();
    if(!ctx.analysisId||!ctx.campaignId)throw new Error('No active campaign context.');
    /* IMPORTANT: the canonical analysis is the authority for creator identity.
     * The UI/product-state reader can contain legacy/generated IDs that differ from
     * the IDs stored with the active analysis. Validate and resolve against ctx.kols
     * first, then use the UI state only as a compatibility fallback. This prevents
     * a false 'Selected Creator ID is not in this analysis' error after analysis
     * results have been rehydrated.
     */
    var canonicalKols=Array.isArray(ctx.kols)?ctx.kols:[];
    var state=KOL_IDS_PRODUCT_UI_GET_STATE();
    var stateKols=(state&&Array.isArray(state.kols))?state.kols:[];
    var available=canonicalKols.length?canonicalKols:stateKols;
    available=available.filter(function(k){return k&&k.analyzed!==false;}).map(function(k,i){return typeof KOL_IDS_ARCH_normalizeCreator_==='function'?KOL_IDS_ARCH_normalizeCreator_(KOL_IDS_CANONICAL_clone_(k),i):k;});
    var rawIds=Array.isArray(payload.selectedCreatorIds)?payload.selectedCreatorIds:[];
    var rawNames=Array.isArray(payload.selectedCreators)?payload.selectedCreators:[];
    var ids=KOL_IDS_CANONICAL_unique_(rawIds.map(function(x){return KOL_IDS_CANONICAL_text_(x).trim();}).filter(Boolean));

    function nameKey_(x){
      return KOL_IDS_CANONICAL_text_(x).trim().toLowerCase().replace(/\s+/g,' ');
    }
    function creatorKey_(k){
      return KOL_IDS_CANONICAL_text_(KOL_IDS_ARCH_creatorId_(k)||k.creatorId||k.id).trim();
    }

    /* First resolve exact IDs against the canonical active analysis. */
    var canonicalIds=available.map(creatorKey_).filter(Boolean);
    var resolvedIds=[];
    ids.forEach(function(id){
      if(canonicalIds.indexOf(id)>=0)resolvedIds.push(id);
    });

    /* If the browser supplied a stale/generated ID, resolve that selected row by
     * its accompanying creator name. Names are only a compatibility bridge; the
     * canonical creator ID remains the persisted authority.
     */
    rawNames.forEach(function(name){
      var nk=nameKey_(name);
      if(!nk)return;
      var hit=available.find(function(k){return nameKey_(k.name)===nk;});
      if(hit){var cid=creatorKey_(hit);if(cid&&resolvedIds.indexOf(cid)<0)resolvedIds.push(cid);}
    });

    /* Legacy payloads may contain names without IDs. Resolve those as well. */
    if(!resolvedIds.length&&rawNames.length){
      resolvedIds=KOL_IDS_CANONICAL_unique_(rawNames.map(function(name){
        var hit=available.find(function(k){return nameKey_(k.name)===nameKey_(name);});
        return hit?creatorKey_(hit):'';
      }).filter(Boolean));
    }
    if(!resolvedIds.length)throw new Error('Select at least one analyzed Creator.');

    var selectedObjects=available.filter(function(k){return resolvedIds.indexOf(creatorKey_(k))>=0;}).map(KOL_IDS_CANONICAL_clone_);
    var foundIds=selectedObjects.map(creatorKey_);
    if(!foundIds.length)throw new Error('Selected Creator is not present in the active analysis.');
    var names=selectedObjects.map(function(k){return KOL_IDS_CANONICAL_text_(k.name);});
    var next=KOL_IDS_CANONICAL_mutate_(ctx,'SAVE_SELECTION','SELECTION',function(c){
      c.kols=Array.isArray(c.kols)&&c.kols.length?c.kols:available.map(KOL_IDS_CANONICAL_clone_);
      c.selection={names:names,creatorIds:foundIds,creators:selectedObjects,selectedAt:KOL_IDS_CANONICAL_now_()};
      c.selectedCreators=names; c.selectedCreatorIds=foundIds;
      if(payload.decisionParameters)c.decisionParameters=KOL_IDS_CANONICAL_clone_(payload.decisionParameters); return c;
    });
    KOL_IDS_CANONICAL_persist_(next,'Selected Creators',next.selection);
    return KOL_IDS_CANONICAL_result_(next,'SELECTION',{count:foundIds.length,creatorIds:foundIds,creators:selectedObjects,recalculationRequired:next.meta.staleStages.slice()});
  });
};

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_RUN(options){
  /*
   * One server endpoint serves two deliberately separate stages:
   *   1) CANDIDATE_ANALYSIS — analyze every saved creator before selection.
   *   2) RUN                — final decision run after a shortlist exists.
   *
   * The previous implementation always enforced the final-selection gate,
   * which made the UI's Analyze KOLs action fail before users could shortlist.
   */
  var mode=typeof options==='string' ? options : String(options&&options.mode||'RUN').trim().toUpperCase();

  if(mode==='CANDIDATE_ANALYSIS'){
    return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('CANDIDATE_ANALYSIS',true,function(){
      KOL_IDS_SELF_ROUTE_();
      var ctx=KOL_IDS_CANONICAL_getContext_();
      if(!ctx.analysisId||!ctx.campaignId||!ctx.brandId)throw new Error('Campaign context is incomplete.');
      if(!Array.isArray(ctx.kols)||!ctx.kols.length)throw new Error('Add at least one KOL before analysis.');

      /* Candidate analysis intentionally does NOT require selection, but it does require
       * the raw inputs that the Decision Engine actually uses to derive Fit/Impact/Confidence.
       * Evidence fields accept MISSING so the user can explicitly declare unavailable proof.
       */
      var analysisInputErrors=[];
      if((ctx.kols||[]).length>100)throw new Error('A maximum of 100 creators is allowed per analysis.');
      (ctx.kols||[]).forEach(function(k,i){
        var n=i+1, text=function(v){return String(v==null?'':v).trim();};
        /* Creator identity + audience evidence are the minimum decision inputs.
         * Commercial/history fields are output-only and are never accepted here. */
        if(!text(k.name))analysisInputErrors.push('KOL '+n+': Name is required.');
        [['audienceAge','Audience age'],['audienceGender','Audience gender'],['audienceLocation','Audience geography'],['audienceInterest','Audience interests']].forEach(function(pair){if(!text(k[pair[0]]))analysisInputErrors.push('KOL '+n+': '+pair[1]+' is required.');});
        if(!text(k.platform))analysisInputErrors.push('KOL '+n+': Primary platform is required.');
        var ci=k.creatorIntelligence||{}; var ciDims=['personality','communication','audienceRelationship','socialBehavior','contentPersonality','contentFunction','contentBehavior','audiencePsychology']; ciDims.forEach(function(key){var arr=Array.isArray(ci[key])?ci[key]:String(ci[key]||'').split(/[|,\n]+/).map(function(x){return x.trim();}).filter(Boolean); if(!arr.length)analysisInputErrors.push('KOL '+n+': Creator Intelligence · '+key+' is required.');});
        var erText=text(k.engagementRate);
        if(erText!=='' ){var er=Number(erText);if(!isFinite(er)||er<0||er>100)analysisInputErrors.push('KOL '+n+': Engagement rate must be 0–100 when provided.');}
        var followersText=text(k.followers).replace(/,/g,'');
        if(followersText!=='' ){var followers=Number(followersText);if(!isFinite(followers)||followers<0)analysisInputErrors.push('KOL '+n+': Followers must be 0 or greater when provided.');}
        var rateText=text(k.rate).replace(/,/g,'');
        if(rateText!=='' ){var rate=Number(rateText);if(!isFinite(rate)||rate<0)analysisInputErrors.push('KOL '+n+': Commercial rate must be 0 or greater when provided.');}
        ['audienceEvidence','engagementEvidence','contentEvidence','performanceEvidence','reputationEvidence'].forEach(function(f){var v=text(k[f]).toUpperCase();if(v!==''&&['VERIFIED','SELF_REPORTED','ESTIMATED','MISSING'].indexOf(v)<0)analysisInputErrors.push('KOL '+n+': '+f+' status must be VERIFIED, SELF_REPORTED, ESTIMATED, or MISSING when provided.');});
        var risk=text(k.riskLevel).toUpperCase();
        if(risk!==''&&['LOW','MEDIUM','HIGH','UNKNOWN'].indexOf(risk)<0)analysisInputErrors.push('KOL '+n+': Risk level must be LOW, MEDIUM, HIGH, or UNKNOWN when provided.');
      });
      if(analysisInputErrors.length)throw new Error('Complete the required KOL analysis inputs before Analyze KOLs:\n\n'+analysisInputErrors.join('\n'));
      if(typeof KOL_IDS_ENT_DATA_ASSERT_READY_==='function')KOL_IDS_ENT_DATA_ASSERT_READY_();
      KOL_IDS_CANONICAL_persist_(ctx,'Candidate Analysis Context',{kols:ctx.kols,analysisId:ctx.analysisId,campaignId:ctx.campaignId,brandId:ctx.brandId});

      var result=KOL_IDS_PRODUCT_RUN();
      if(!result||result.success!==true)throw new Error('Candidate analysis did not complete successfully.');

      /* Read the freshly generated report and attach the calculated evidence
       * back to the canonical creator records. This makes the next Selection
       * step consume the same persisted analysis that the UI displays. */
      var report;
      try {
        report=KOL_IDS_PRODUCT_UI_GET_REPORT();
      } catch(reportReadError) {
        /* Compatibility fallback for deployments where the report hardening
         * reader is ahead of the active report schema. The product run has
         * already completed and remains the source of truth. */
        if(typeof KOL_IDS_PRODUCT_UI_GET_REPORT_LEGACY_==='function') report=KOL_IDS_PRODUCT_UI_GET_REPORT_LEGACY_();
        else throw reportReadError;
      }
      if(!report||!Array.isArray(report.rows)||!report.rows.length)throw new Error('Candidate analysis completed but produced no creator results.');
      var headers=Array.isArray(report.headers)?report.headers:[];
      var index={}; headers.forEach(function(h,i){index[String(h||'').trim().toLowerCase()]=i;});
      var idxId=index['kol id'],idxName=index['kol name'],idxBrand=index['brand fit score'],idxImpact=index['brand impact score'],idxConf=index['confidence score'],idxRisk=index['risk level'],idxDecision=index['decision'],idxAudience=index['audience fit'],idxContent=index['content fit'],idxValue=index['value fit'],idxNotIdeal=index['not ideal for'],idxWhy=index['decision reason'],idxRole=index['preferred use strategy'],idxGap=index['primary fit gap'],idxActions=index['recovery actions'],idxContentRec=index['content recommendation'],idxPair=index['compensating creator strategy'];
      function cell(row,idx){return idx===undefined?'':row[idx];}
      function num(v){var n=Number(String(v==null?'':v).replace(/,/g,''));return isFinite(n)?n:0;}
      var analyzed=ctx.kols.map(function(k){
        var row=report.rows.find(function(r){return (idxId!==undefined&&String(cell(r,idxId)||'')===String(k.id||''))||(idxName!==undefined&&String(cell(r,idxName)||'')===String(k.name||''));});
        if(!row)return k;
        var next=KOL_IDS_CANONICAL_clone_(k);
        next.analyzed=true;
        var recoveryActions=String(cell(row,idxActions)||'').split(' | ').map(function(x){return x.trim();}).filter(Boolean);
        var contentRecommendation=String(cell(row,idxContentRec)||'').split(' | ').map(function(x){var parts=x.split(' — '),head=parts.shift()||'',m=head.match(/\s·\sFit\s+([^\s]+)/i);return {format:head.replace(/\s·\sFit\s+[^\s]+/i,''),fit:m?m[1]:'',reason:parts.join(' — ')};}).filter(function(x){return x.format;});
        next.analysis={fit:num(cell(row,idxBrand)),impact:num(cell(row,idxImpact)),confidence:num(cell(row,idxConf)),risk:cell(row,idxRisk)||'',decision:cell(row,idxDecision)||'Review',brandFit:num(cell(row,idxBrand)),audienceFit:num(cell(row,idxAudience)),campaignFit:num(cell(row,idxContent)),contentFit:num(cell(row,idxContent)),valueFit:num(cell(row,idxValue)),safety:100,remediation:cell(row,idxNotIdeal)||'',why:cell(row,idxWhy)||'',decisionReason:cell(row,idxWhy)||'',preferredUseStrategy:cell(row,idxRole)||'',primaryFitGap:cell(row,idxGap)||'',recoveryActions:recoveryActions,contentRecommendation:contentRecommendation,compensatingCreatorStrategy:cell(row,idxPair)||'',recoveryStrategy:{role:cell(row,idxRole)||'',primaryGap:cell(row,idxGap)||'',actions:recoveryActions}};
        return next;
      });

      var next=KOL_IDS_CANONICAL_mutate_(ctx,'CANDIDATE_ANALYSIS','PERSONA',function(c){
        c.kols=analyzed;
        c.persona=c.persona||{kols:analyzed};
        c.stage='CANDIDATE_ANALYSIS_COMPLETE';
        c.candidateAnalysis={completedAt:KOL_IDS_CANONICAL_now_(),count:report.rows.length,analysisId:c.analysisId};
        return c;
      });
      KOL_IDS_CANONICAL_persist_(next,'Candidate Analysis',{report:report,analysisId:next.analysisId,campaignId:next.campaignId,brandId:next.brandId});
      return Object.assign({},result,{mode:'CANDIDATE_ANALYSIS',candidateAnalysis:true,runComplete:false,reportCount:report.rows.length,reportRows:report.rows.length,decisionRows:result.decisionRows||report.rows.length,report:report,canonical:KOL_IDS_CANONICAL_result_(next,'CANDIDATE_ANALYSIS',{candidateAnalysis:true,count:report.rows.length,report:report,analyzedCreators:analyzed}),data:{report:report,analyzedCreators:analyzed}});
    });
  }

  if(mode!=='RUN')throw new Error('Unsupported SELF_RUN mode: '+mode);
  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('RUN',true,function(){
    KOL_IDS_SELF_ROUTE_(); var ctx=KOL_IDS_CANONICAL_getContext_();
    if(!ctx.analysisId||!ctx.campaignId||!ctx.brandId)throw new Error('Campaign context is incomplete.');
    if(!ctx.selection||!Array.isArray(ctx.selection.creatorIds)||!ctx.selection.creatorIds.length)throw new Error('Select at least one analyzed Creator before running.');
    if(ctx.meta.staleStages.indexOf('SELECTION')>=0)throw new Error('Creator selection is stale. Save the updated selection before running.');
    if(typeof KOL_IDS_ENT_DATA_ASSERT_READY_==='function')KOL_IDS_ENT_DATA_ASSERT_READY_();
    KOL_IDS_CANONICAL_persist_(ctx,'Run Context',{selection:ctx.selection,decisionParameters:ctx.decisionParameters});
    var result=KOL_IDS_PRODUCT_RUN();
    if(!result || result.success!==true){
      throw new Error('Decision Engine run returned an unconfirmed result.');
    }
    var next=KOL_IDS_CANONICAL_mutate_(ctx,'RUN','RUN',function(c){c.stage='RUN_COMPLETE';c.run={completedAt:KOL_IDS_CANONICAL_now_(),result:KOL_IDS_CANONICAL_clone_(result)};return c;});
    /* RUN is confirmed only after the result and canonical state are both persisted. */
    KOL_IDS_CANONICAL_persist_(next,'Run Complete',result);
    return Object.assign({},result,{
      success:true,
      ok:true,
      verified:true,
      stage:'RUN',
      runComplete:true,
      completedAt:next.run.completedAt,
      decisionRows:Number(result.decisionRows||0),
      reportRows:Number(result.reportRows||0),
      canonical:KOL_IDS_CANONICAL_result_(next,'RUN',{
        runComplete:true,
        stage:'RUN',
        decisionRows:Number(result.decisionRows||0),
        reportRows:Number(result.reportRows||0)
      })
    });
  });
}

function KOL_IDS_SELF_GET_STATE(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_GET_STATE');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('GET_STATE',false,function(){
    KOL_IDS_SELF_ROUTE_(); var state=KOL_IDS_PRODUCT_UI_GET_STATE(),ctx=KOL_IDS_CANONICAL_getContext_(),props=KOL_IDS_CANONICAL_props_();
    var selected=Array.isArray(ctx.selectedCreators)?ctx.selectedCreators:[];
    state.selectedCreators=selected; state.selectedCreatorIds=Array.isArray(ctx.selectedCreatorIds)?ctx.selectedCreatorIds.slice():(ctx.selection&&Array.isArray(ctx.selection.creatorIds)?ctx.selection.creatorIds.slice():[]); state.decisionParameters=ctx.decisionParameters||null; state.flowContext=ctx; state.stage=ctx.stage||''; state.runComplete=(String(ctx.stage||'').toUpperCase()==='RUN_COMPLETE'); state.genCodePlan=ctx.genCodePlan||null; state.genCodes=ctx.genCodes&&Array.isArray(ctx.genCodes.codes)?ctx.genCodes.codes:[]; state.flowVersion=(typeof KOL_IDS!=='undefined'?KOL_IDS.VERSION:KOL_IDS.VERSION); state.canonical={revision:ctx.meta.revision,staleStages:ctx.meta.staleStages,stageRevision:ctx.meta.stageRevision,lastMutation:ctx.meta.lastMutation,updatedAt:ctx.meta.updatedAt,contextHash:ctx.meta.contextHash};
    return state;
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_GET_STATE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_GET_STATE', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CANONICAL_HEALTH(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CANONICAL_HEALTH');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CANONICAL_getContext_(); return {success:true,version:KOL_IDS.VERSION,revision:c.meta.revision,stage:c.stage||'',staleStages:c.meta.staleStages,hasCampaign:!!c.campaignId,hasAudience:!!(c.audience&&c.audience.description),creatorCount:Array.isArray(c.kols)?c.kols.length:0,selectedCount:Array.isArray(c.selectedCreators)?c.selectedCreators.length:0,contextHash:c.meta.contextHash||''};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CANONICAL_HEALTH', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CANONICAL_HEALTH', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_SELF_SAVE() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SELF_SAVE', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_SAVE, this, arguments);
}


function KOL_IDS_SELF_SAVE_SELECTION() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SELF_SAVE_SELECTION', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_SAVE_SELECTION, this, arguments);
}


function KOL_IDS_SELF_RUN() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SELF_RUN', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_RUN, this, arguments);
}
