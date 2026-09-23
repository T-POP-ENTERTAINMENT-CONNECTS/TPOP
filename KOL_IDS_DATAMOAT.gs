/**
 * KOL IDS™ 1.1.0 — DATA MOAT / OUTCOME INTELLIGENCE LAYER
 *
 * Purpose:
 * - Capture the decision -> execution -> outcome feedback loop.
 * - Preserve point-in-time snapshots so later model changes do not rewrite history.
 * - Create a tamper-evident lineage chain for material decision/outcome events.
 * - Support aggregated/anonymized benchmarking without storing unnecessary PII.
 *
 * Data principles:
 * 1) Customer raw data remains scoped by Org ID + Brand ID.
 * 2) Do not store personal contact details in these tables.
 * 3) Data rights must be explicit: CUSTOMER_ONLY, AGGREGATED_ALLOWED, or RESTRICTED.
 * 4) Predictions are immutable observations: never overwrite historical model inputs.
 */

var KOL_IDS_DATA_MOAT = Object.freeze({
  VERSION:'1.0.0',
  SCHEMA_VERSION:'DM1',
  RIGHTS:['CUSTOMER_ONLY','AGGREGATED_ALLOWED','RESTRICTED'],
  MAX_JSON_BYTES:50000,
  MAX_TEXT:1000
});

function KOL_IDS_DATAMOAT_DM_now_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_now_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return new Date(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_now_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_now_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DATAMOAT_DM_str_(v,max){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_str_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 var s=String(v==null?'':v).trim(); return max&&s.length>max?s.slice(0,max):s; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_str_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_str_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DATAMOAT_DM_json_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_json_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var s=typeof v==='string'?v:JSON.stringify(v==null?{}:v);
  if(s.length>KOL_IDS_DATA_MOAT.MAX_JSON_BYTES) throw KOL_IDS_PLATFORM_error_('PAYLOAD_TOO_LARGE','Data moat JSON payload is too large.');
  try{ JSON.parse(s); }catch(e){ throw KOL_IDS_PLATFORM_error_('INVALID_JSON','Data moat JSON is invalid.'); }
  return s;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_json_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_json_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DATAMOAT_DM_rights_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_rights_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var r=KOL_IDS_DATAMOAT_DM_str_(v,40).toUpperCase()||'CUSTOMER_ONLY';
  if(KOL_IDS_DATA_MOAT.RIGHTS.indexOf(r)<0) throw KOL_IDS_PLATFORM_error_('INVALID_DATA_RIGHTS','Unsupported data rights classification.');
  return r;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_rights_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_rights_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DATAMOAT_DM_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(v===''||v==null)return '';
  var n=Number(v); if(!isFinite(n))throw KOL_IDS_PLATFORM_error_('INVALID_NUMBER','Invalid numeric data.');
  return n;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DATAMOAT_DM_hash_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_PLATFORM_hash_(typeof v==='string'?v:JSON.stringify(v==null?{}:v));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DATAMOAT_DM_ctx_(orgId,brandId,role){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_ctx_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,role||'ANALYST');
  KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);
  return ctx;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_ctx_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_ctx_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DATAMOAT_DM_append_(sheetName,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_append_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss=KOL_IDS_PLATFORM_ensure_(),sh=ss.getSheetByName(sheetName);
    if(!sh) throw KOL_IDS_PLATFORM_error_('SCHEMA_ERROR','Data Moat sheet is missing: '+sheetName);
    var row=KOL_IDS_PLATFORM_row_(sh,obj);
    if(!row||!row.length) throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Data Moat row is empty.');
    var target=sh.getLastRow()+1;
    sh.getRange(target,1,1,row.length).setValues([row]);
    return target;
  } finally { try{lock.releaseLock();}catch(e){} }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_append_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_append_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Create a campaign record that becomes the anchor for later predictions and outcomes. */
function KOL_IDS_DATAMOAT_DM_createCampaign_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_createCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_DATAMOAT_DM_ctx_(orgId,brandId,'ANALYST'),d=data||{},id=KOL_IDS_PLATFORM_uuid_('CMP'),now=KOL_IDS_DATAMOAT_DM_now_();
  var objective=KOL_IDS_DATAMOAT_DM_str_(d.objective,200); if(!objective)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign objective is required.');
  var budget=KOL_IDS_DATAMOAT_DM_num_(d.budget);
  if(budget!==''&&budget<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign budget cannot be negative.');
  KOL_IDS_DATAMOAT_DM_append_('ENT_CAMPAIGNS',{
    'Campaign ID':id,'Org ID':orgId,'Brand ID':brandId,'Objective':objective,
    'Platform':KOL_IDS_DATAMOAT_DM_str_(d.platform,80).toUpperCase(),'Start At':d.startAt?new Date(d.startAt):now,
    'End At':d.endAt?new Date(d.endAt):'','Budget':budget,'Currency':KOL_IDS_DATAMOAT_DM_str_(d.currency,8).toUpperCase(),
    'Status':'PLANNED','Created At':now,'Updated At':now
  });
  KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,'CAMPAIGN',id,'CREATED',{'objective':objective,'platform':d.platform});
  return {success:true,campaignId:id,status:'PLANNED'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_createCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_createCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Store a point-in-time creator snapshot. This is the raw intelligence observation. */
function KOL_IDS_DATAMOAT_DM_recordCreatorSnapshot_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_recordCreatorSnapshot_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_DATAMOAT_DM_ctx_(orgId,brandId,'ANALYST'),d=data||{},creatorId=KOL_IDS_DATAMOAT_DM_str_(d.creatorId,200);
  if(!creatorId)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Creator ID is required.');
  var observed=d.observedAt?new Date(d.observedAt):KOL_IDS_DATAMOAT_DM_now_(),payload={
    platform:KOL_IDS_DATAMOAT_DM_str_(d.platform,40).toUpperCase(),
    handle:KOL_IDS_DATAMOAT_DM_str_(d.handle,200),
    followers:KOL_IDS_DATAMOAT_DM_num_(d.followers),er:KOL_IDS_DATAMOAT_DM_num_(d.er),
    audience:d.audience||{},content:d.content||{},rate:KOL_IDS_DATAMOAT_DM_num_(d.rate),
    currency:KOL_IDS_DATAMOAT_DM_str_(d.currency,8).toUpperCase(),source:KOL_IDS_DATAMOAT_DM_str_(d.source,200)
  };
  var rawHash=KOL_IDS_DATAMOAT_DM_hash_(payload),id=KOL_IDS_PLATFORM_uuid_('SNP'),now=KOL_IDS_DATAMOAT_DM_now_(),rights=KOL_IDS_DATAMOAT_DM_rights_(d.dataRights);
  KOL_IDS_DATAMOAT_DM_append_('ENT_CREATOR_SNAPSHOTS',{
    'Snapshot ID':id,'Org ID':orgId,'Brand ID':brandId,'Creator ID':creatorId,'Platform':payload.platform,
    'Observed At':observed,'Followers':payload.followers,'ER':payload.er,'Audience JSON':KOL_IDS_DATAMOAT_DM_json_(payload.audience),
    'Content JSON':KOL_IDS_DATAMOAT_DM_json_(payload.content),'Rate':payload.rate,'Currency':payload.currency,'Source':payload.source,
    'Confidence':KOL_IDS_DATAMOAT_DM_num_(d.confidence),'Raw Hash':rawHash,'Data Rights':rights,'Created At':now
  });
  KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,'CREATOR_SNAPSHOT',id,'OBSERVED',{rawHash:rawHash,creatorId:creatorId,rights:rights});
  return {success:true,snapshotId:id,creatorId:creatorId,rawHash:rawHash};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_recordCreatorSnapshot_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_recordCreatorSnapshot_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Record exactly what the decision engine recommended, including model/input versioning. */
function KOL_IDS_DATAMOAT_DM_recordRecommendation_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_recordRecommendation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_DATAMOAT_DM_ctx_(orgId,brandId,'ANALYST'),d=data||{},campaignId=KOL_IDS_DATAMOAT_DM_str_(d.campaignId,100),creatorId=KOL_IDS_DATAMOAT_DM_str_(d.creatorId,200);
  if(!campaignId||!creatorId)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign ID and Creator ID are required.');
  var modelVersion=KOL_IDS_DATAMOAT_DM_str_(d.modelVersion,80)||'BASELINE',inputHash=KOL_IDS_DATAMOAT_DM_str_(d.inputSnapshotHash,100);
  var id=KOL_IDS_PLATFORM_uuid_('REC');
  KOL_IDS_DATAMOAT_DM_append_('ENT_RECOMMENDATIONS',{
    'Recommendation ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':campaignId,'Creator ID':creatorId,
    'Model ID':KOL_IDS_DATAMOAT_DM_str_(d.modelId,100),'Model Version':modelVersion,'Recommended At':d.recommendedAt?new Date(d.recommendedAt):KOL_IDS_DATAMOAT_DM_now_(),
    'Score':KOL_IDS_DATAMOAT_DM_num_(d.score),'Expected Impact':KOL_IDS_DATAMOAT_DM_num_(d.expectedImpact),
    'Expected Risk':KOL_IDS_DATAMOAT_DM_num_(d.expectedRisk),'Confidence':KOL_IDS_DATAMOAT_DM_num_(d.confidence),
    'Reason JSON':KOL_IDS_DATAMOAT_DM_json_(d.reason||{}),'Decision':KOL_IDS_DATAMOAT_DM_str_(d.decision,40).toUpperCase()||'RECOMMENDED',
    'Actual Outcome ID':'','Input Snapshot Hash':inputHash
  });
  KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,'RECOMMENDATION',id,'RECOMMENDED',{
    campaignId:campaignId,creatorId:creatorId,modelId:d.modelId||'',modelVersion:modelVersion,inputSnapshotHash:inputHash
  });
  return {success:true,recommendationId:id};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_recordRecommendation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_recordRecommendation_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Record post-campaign outcome. Outcome data is the training/evaluation signal. */
function KOL_IDS_DATAMOAT_DM_recordOutcome_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_recordOutcome_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_DATAMOAT_DM_ctx_(orgId,brandId,'ANALYST'),d=data||{},campaignId=KOL_IDS_DATAMOAT_DM_str_(d.campaignId,100),creatorId=KOL_IDS_DATAMOAT_DM_str_(d.creatorId,200);
  if(!campaignId||!creatorId)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign ID and Creator ID are required.');
  var spend=KOL_IDS_DATAMOAT_DM_num_(d.spend),revenue=KOL_IDS_DATAMOAT_DM_num_(d.revenue),clicks=KOL_IDS_DATAMOAT_DM_num_(d.clicks),impressions=KOL_IDS_DATAMOAT_DM_num_(d.impressions),conversions=KOL_IDS_DATAMOAT_DM_num_(d.conversions);
  var ctr=impressions!==''&&impressions>0&&clicks!==''?clicks/impressions:null;
  var cvr=clicks!==''&&clicks>0&&conversions!==''?conversions/clicks:null;
  var cpa=conversions!==''&&conversions>0&&spend!==''?spend/conversions:null;
  var roas=spend!==''&&spend>0&&revenue!==''?revenue/spend:null;
  var id=KOL_IDS_PLATFORM_uuid_('OUT'),now=KOL_IDS_DATAMOAT_DM_now_(),rights=KOL_IDS_DATAMOAT_DM_rights_(d.dataRights);
  var evidence=d.evidence||{};
  KOL_IDS_DATAMOAT_DM_append_('ENT_OUTCOMES',{
    'Outcome ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':campaignId,'Creator ID':creatorId,
    'Observed At':d.observedAt?new Date(d.observedAt):now,'Spend':spend,'Currency':KOL_IDS_DATAMOAT_DM_str_(d.currency,8).toUpperCase(),
    'Impressions':impressions,'Reach':KOL_IDS_DATAMOAT_DM_num_(d.reach),'Clicks':clicks,'Conversions':conversions,'Revenue':revenue,
    'CTR':ctr===null?'':ctr,'CVR':cvr===null?'':cvr,'CPA':cpa===null?'':cpa,'ROAS':roas===null?'':roas,
    'Engagement':KOL_IDS_DATAMOAT_DM_num_(d.engagement),'Outcome Status':KOL_IDS_DATAMOAT_DM_str_(d.status,40).toUpperCase()||'FINAL',
    'Source':KOL_IDS_DATAMOAT_DM_str_(d.source,200),'Evidence JSON':KOL_IDS_DATAMOAT_DM_json_(evidence),'Data Rights':rights,'Created At':now
  });
  KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,'OUTCOME',id,'OUTCOME_RECORDED',{campaignId:campaignId,creatorId:creatorId,rights:rights});
  return {success:true,outcomeId:id,metrics:{ctr:ctr,cvr:cvr,cpa:cpa,roas:roas}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_recordOutcome_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_recordOutcome_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Immutable lineage record with a per-org/brand hash chain. */
function KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,entityType,entityId,eventType,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_lineage_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock(); lock.waitLock(10000);
  try {
  var props=PropertiesService.getScriptProperties();
  var scope=String(ctx.orgId)+'|'+String(brandId),key='KOL_IDS_DM_LAST_HASH:'+KOL_IDS_DATAMOAT_DM_hash_(scope).slice(0,48);
  var previous=String(props.getProperty(key)||''),now=KOL_IDS_DATAMOAT_DM_now_();
  var payloadHash=KOL_IDS_DATAMOAT_DM_hash_(payload||{}),eventHash=KOL_IDS_DATAMOAT_DM_hash_({
    orgId:ctx.orgId,brandId:brandId,entityType:entityType,entityId:entityId,eventType:eventType,
    eventAt:now.toISOString(),source:'KOL_IDS',schema:KOL_IDS_DATA_MOAT.SCHEMA_VERSION,
    payloadHash:payloadHash,previousHash:previous
  });
  // We already hold the script lock here; do not call KOL_IDS_DATAMOAT_DM_append_(),
  // which would attempt to acquire the same lock again. This direct append keeps
  // the hash-chain write atomic without recursive lock acquisition.
  var sh=KOL_IDS_PLATFORM_ensure_().getSheetByName('ENT_DATA_LINEAGE');
  if(!sh)throw KOL_IDS_PLATFORM_error_('SCHEMA_ERROR','Data lineage sheet is missing.');
  var row=KOL_IDS_PLATFORM_row_(sh,{
    'Lineage ID':KOL_IDS_PLATFORM_uuid_('LIN'),'Org ID':ctx.orgId,'Brand ID':brandId,'Entity Type':entityType,'Entity ID':entityId,
    'Event Type':eventType,'Event At':now,'Source':'KOL_IDS','Source Record ID':entityId,
    'Schema Version':KOL_IDS_DATA_MOAT.SCHEMA_VERSION,'Model Version':payload&&payload.modelVersion||'',
    'Payload Hash':payloadHash,'Previous Hash':previous,'Event Hash':eventHash,
    'Data Rights':KOL_IDS_DATAMOAT_DM_rights_(payload&&payload.dataRights),'Created At':now
  });
  sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]);
  props.setProperty(key,eventHash);
  return eventHash;
  } finally { try{lock.releaseLock();}catch(e){} }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_lineage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_lineage_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Link a completed outcome back to a recommendation and store prediction calibration. */
function KOL_IDS_DATAMOAT_DM_evaluateRecommendation_(orgId,brandId,recommendationId,outcomeId,actualValue){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_evaluateRecommendation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_DATAMOAT_DM_ctx_(orgId,brandId,'ANALYST'),ss=ctx.ss,rs=ss.getSheetByName('ENT_RECOMMENDATIONS'),os=ss.getSheetByName('ENT_OUTCOMES');
  var rm=KOL_IDS_PLATFORM_map_(rs),om=KOL_IDS_PLATFORM_map_(os),rr=KOL_IDS_PLATFORM_values_(rs).filter(function(r){return String(r[rm['Recommendation ID']])===String(recommendationId)&&String(r[rm['Org ID']])===String(orgId)&&String(r[rm['Brand ID']])===String(brandId);})[0];
  var or=KOL_IDS_PLATFORM_values_(os).filter(function(r){return String(r[om['Outcome ID']])===String(outcomeId)&&String(r[om['Org ID']])===String(orgId)&&String(r[om['Brand ID']])===String(brandId);})[0];
  if(!rr||!or)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Recommendation or outcome was not found in the authorized brand.');
  var predicted=KOL_IDS_DATAMOAT_DM_num_(rr[rm['Expected Impact']]),actual=KOL_IDS_DATAMOAT_DM_num_(actualValue);
  if(predicted===''||actual==='')throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Predicted and actual values are required for calibration.');
  var error=actual-predicted,absError=Math.abs(error),pctError=predicted!==0?absError/Math.abs(predicted):'';
  var sh=ss.getSheetByName('ENT_PREDICTION_EVAL'),now=KOL_IDS_DATAMOAT_DM_now_();
  var evaluationRow=KOL_IDS_DATAMOAT_DM_append_('ENT_PREDICTION_EVAL',{
    'Evaluation ID':KOL_IDS_PLATFORM_uuid_('EVAL'),'Org ID':orgId,'Brand ID':brandId,'Recommendation ID':recommendationId,
    'Outcome ID':outcomeId,'Campaign ID':rr[rm['Campaign ID']],'Creator ID':rr[rm['Creator ID']],
    'Model ID':rr[rm['Model ID']],'Model Version':rr[rm['Model Version']],'Predicted Value':predicted,'Actual Value':actual,
    'Error':error,'Absolute Error':absError,'Absolute Percentage Error':pctError,'Evaluated At':now
  });
  // Targeted update by row; evaluation is an offline/post-campaign path, not a hot request path.
  var rowIndex=KOL_IDS_PLATFORM_values_(rs).findIndex(function(r){return String(r[rm['Recommendation ID']])===String(recommendationId);});
  if(rowIndex>=0 && rm['Actual Outcome ID']!=null) rs.getRange(rowIndex+2,rm['Actual Outcome ID']+1).setValue(outcomeId);
  KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,'RECOMMENDATION',recommendationId,'EVALUATED',{modelVersion:rr[rm['Model Version']],predicted:predicted,actual:actual,dataRights:'CUSTOMER_ONLY'});
  var em=KOL_IDS_PLATFORM_map_(sh);
  return {success:true,evaluationId:sh.getRange(evaluationRow,em['Evaluation ID']+1).getValue(),predicted:predicted,actual:actual,error:error,absoluteError:absError,absolutePercentageError:pctError};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_evaluateRecommendation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_evaluateRecommendation_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Validate the moat contract without modifying production data. */
function KOL_IDS_DATAMOAT_DM_contractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_contractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var required=[
    'ENT_CAMPAIGNS','ENT_CREATOR_SNAPSHOTS','ENT_RECOMMENDATIONS','ENT_OUTCOMES','ENT_PREDICTION_EVAL','ENT_DATA_LINEAGE'
  ];
  var ss=KOL_IDS_PLATFORM_ensure_(),missing=required.filter(function(n){return !ss.getSheetByName(n);});
  var checks=[
    {name:'Moat sheets exist',pass:missing.length===0},
    {name:'Data rights are explicit',pass:KOL_IDS_DATA_MOAT.RIGHTS.length===3},
    {name:'Snapshot has raw hash',pass:true},
    {name:'Recommendation stores model version',pass:true},
    {name:'Outcome stores measurable metrics',pass:true},
    {name:'Lineage stores hash chain',pass:true},
    {name:'No personal contact fields in moat schema',pass:required.every(function(n){var headers=KOL_IDS_PLATFORM_headers_(); var keyMap={ENT_CAMPAIGNS:'ENT_CAMPAIGNS',ENT_CREATOR_SNAPSHOTS:'ENT_CREATOR_SNAPSHOTS',ENT_RECOMMENDATIONS:'ENT_RECOMMENDATIONS',ENT_OUTCOMES:'ENT_OUTCOMES',ENT_PREDICTION_EVAL:'ENT_PREDICTION_EVAL',ENT_DATA_LINEAGE:'ENT_DATA_LINEAGE'}; var h=headers[keyMap[n]]||[]; return Array.isArray(h)&&h.join('|').toLowerCase().indexOf('email')<0;})}
  ];
  return {success:checks.every(function(c){return c.pass;})&&missing.length===0,version:KOL_IDS_DATA_MOAT.VERSION,checks:checks,missing:missing};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_contractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_contractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Aggregate benchmark-ready rows while keeping customer identity out of the output. */
function KOL_IDS_DATAMOAT_DM_benchmarkAggregate_(orgId,brandId,metric,rows){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATAMOAT_DM_benchmarkAggregate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_DATAMOAT_DM_ctx_(orgId,brandId,'ANALYST'),allowed=(rows||[]).filter(function(r){return r&&String(r.dataRights||'').toUpperCase()==='AGGREGATED_ALLOWED'&&isFinite(Number(r.value));});
  if(allowed.length<5) return {success:false,reason:'INSUFFICIENT_CONSENTED_SAMPLE',sampleSize:allowed.length};
  var vals=allowed.map(function(r){return Number(r.value);}).sort(function(a,b){return a-b;});
  var mid=Math.floor(vals.length/2),median=vals.length%2?vals[mid]:(vals[mid-1]+vals[mid])/2;
  var p25=vals[Math.floor((vals.length-1)*.25)],p75=vals[Math.floor((vals.length-1)*.75)];
  KOL_IDS_PLATFORM_rebuildBenchmarksCore_();
  return {success:true,metric:String(metric||''),sampleSize:vals.length,p25:p25,median:median,p75:p75,scope:'ANONYMIZED_AGGREGATE'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATAMOAT_DM_benchmarkAggregate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATAMOAT_DM_benchmarkAggregate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
