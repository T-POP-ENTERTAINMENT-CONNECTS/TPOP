var KOL_IDS_GROWTH_HIST_LIFT_CACHE = KOL_IDS_GROWTH_HIST_LIFT_CACHE || {};
/**
 * KOL IDS — Growth Intelligence / Campaign OS / Marketplace layer.
 * Canonical, additive layer: reuses V25 enterprise auth + existing Data Moat sheets.
 * No PII/contact data is stored here.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  CAMPAIGN_STAGES:['PLANNED','DRAFT','PLANNING','CREATOR_SELECTION','INVITATION','NEGOTIATION','CONTRACTED','CONTENT_BRIEF','CONTENT_SUBMITTED','REVIEW','APPROVED','PUBLISHED','TRACKING','RECONCILIATION','COMPLETED','CANCELLED'],
  TERMINAL:['COMPLETED','CANCELLED'],
  TRANSITIONS:{PLANNED:['PLANNING','CREATOR_SELECTION','CANCELLED'],DRAFT:['PLANNING','CANCELLED'],PLANNING:['CREATOR_SELECTION','CANCELLED'],CREATOR_SELECTION:['INVITATION','CANCELLED'],INVITATION:['NEGOTIATION','CONTRACTED','CANCELLED'],NEGOTIATION:['CONTRACTED','CANCELLED'],CONTRACTED:['CONTENT_BRIEF','CANCELLED'],CONTENT_BRIEF:['CONTENT_SUBMITTED','CANCELLED'],CONTENT_SUBMITTED:['REVIEW','CANCELLED'],REVIEW:['APPROVED','CONTENT_SUBMITTED','CANCELLED'],APPROVED:['PUBLISHED','CANCELLED'],PUBLISHED:['TRACKING'],TRACKING:['RECONCILIATION','CANCELLED'],RECONCILIATION:['COMPLETED','CANCELLED'],COMPLETED:[],CANCELLED:[]},
  MARKETPLACE_SHEET:'ENT_CREATOR_MARKETPLACE',
  DELIVERABLES_SHEET:'ENT_CAMPAIGN_DELIVERABLES',
  DISCOVERY_SHEET:'ENT_DISCOVERY_EVENTS',
  MATCH_SHEET:'ENT_MATCH_DECISIONS',
  MAX_RESULTS:100
});

function KOL_IDS_GROWTH_ensureGrowthSheets_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_ensureGrowthSheets_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_(), specs={
    ENT_CREATOR_MARKETPLACE:['Marketplace ID','Org ID','Brand ID','Creator ID','Platform','Category','Availability','Min Rate','Max Rate','Currency','Reliability Score','Response SLA Hours','Cancellation Rate','Content Quality','Audience Fit','Updated At'],
    ENT_CAMPAIGN_DELIVERABLES:['Deliverable ID','Org ID','Brand ID','Campaign ID','Creator ID','Type','Due At','Status','Required','Submitted At','Approved At','Revision Count','Notes','Created At','Updated At'],
    ENT_DISCOVERY_EVENTS:['Event ID','Org ID','Brand ID','Creator ID','Campaign ID','Event Type','Query JSON','Source','Observed At'],
    ENT_MATCH_DECISIONS:['Match ID','Org ID','Brand ID','Campaign ID','Creator ID','Rank','Fit Score','Impact Score','Evidence Score','Risk Score','Cost Efficiency','Confidence','Decision','Reason JSON','Model Version','Created At']
  };
  Object.keys(specs).forEach(function(n){
    var sh=ss.getSheetByName(n); if(!sh)sh=ss.insertSheet(n);
    if(sh.getLastRow()===0)sh.getRange(1,1,1,specs[n].length).setValues([specs[n]]);
    else {var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String); if(h.join('|')!==specs[n].join('|'))throw KOL_IDS_PLATFORM_error_('SCHEMA_ERROR','Growth sheet header mismatch: '+n);}
  });
  return ss;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_ensureGrowthSheets_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_ensureGrowthSheets_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_ctx_(orgId,brandId,role){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_ctx_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,role||'ANALYST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);return ctx;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_ctx_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_ctx_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_str_(v,max){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_str_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var s=String(v==null?'':v).trim();return max&&s.length>max?s.slice(0,max):s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_str_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_str_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v==null)return '';var n=Number(v);if(!isFinite(n))throw KOL_IDS_PLATFORM_error_('INVALID_NUMBER','Invalid numeric value.');return n;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_date_(v,required){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v==null){if(required)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Date is required.');return '';}var d=v instanceof Date?new Date(v.getTime()):new Date(v);if(isNaN(d.getTime()))throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Invalid date.');return d;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_rowAppend_(sh,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_rowAppend_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var row=KOL_IDS_PLATFORM_row_(sh,obj);sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]);return sh.getLastRow();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_rowAppend_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_rowAppend_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_find_(sh,filters){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_find_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh);return rows.map(function(r,i){return {r:r,i:i,m:m};}).filter(function(x){return Object.keys(filters||{}).every(function(k){return String(x.r[x.m[k]]==null?'':x.r[x.m[k]])===String(filters[k]==null?'':filters[k]);});});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_find_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_find_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Campaign OS */
function KOL_IDS_GROWTH_createCampaign_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_createCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_DATAMOAT_DM_createCampaign_(orgId,brandId,data);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_createCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_createCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_transitionCampaign_(orgId,brandId,campaignId,nextStage,meta){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_transitionCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'STRATEGIST'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CAMPAIGNS),m=KOL_IDS_PLATFORM_map_(sh),hit=KOL_IDS_GROWTH_find_(sh,{'Campaign ID':campaignId,'Org ID':orgId,'Brand ID':brandId})[0];
  if(!hit)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Campaign not found in authorized brand.');
  var from=String(hit.r[m['Status']]||'PLANNED').toUpperCase(),to=String(nextStage||'').trim().toUpperCase();
  if(to==='PLANNED'&&from==='PLANNED')return {success:true,campaignId:campaignId,status:from,unchanged:true};
  if(KOL_IDS_GROWTH_TERMINAL_BLOCK_(from,to))throw KOL_IDS_PLATFORM_error_('INVALID_STATE','Invalid campaign transition: '+from+' -> '+to+'.');if(typeof KOL_IDS_CANONICAL_MUTATION_assertTransition_==='function')KOL_IDS_CANONICAL_MUTATION_assertTransition_('CAMPAIGN',from,to);else if(!KOL_IDS_GROWTH_allowedTransition_(from,to))throw KOL_IDS_PLATFORM_error_('INVALID_STATE','Invalid campaign transition: '+from+' -> '+to+'.');
  var now=new Date();sh.getRange(hit.i+2,m['Status']+1).setValue(to);sh.getRange(hit.i+2,m['Updated At']+1).setValue(now);
  KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,'CAMPAIGN',campaignId,'STATUS_CHANGED',{from:from,to:to,dataRights:'CUSTOMER_ONLY'});
  return {success:true,campaignId:campaignId,from:from,status:to,updatedAt:now,meta:meta||{}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_transitionCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_transitionCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_TERMINAL_BLOCK_(from,to){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_TERMINAL_BLOCK_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS.TERMINAL.indexOf(from)>=0&&from!==to;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_TERMINAL_BLOCK_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_TERMINAL_BLOCK_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_allowedTransition_(from,to){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_allowedTransition_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return (KOL_IDS.TRANSITIONS[from]||[]).indexOf(to)>=0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_allowedTransition_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_allowedTransition_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_addDeliverable_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_addDeliverable_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'STRATEGIST'),d=data||{},cid=KOL_IDS_GROWTH_str_(d.campaignId,100),cr=KOL_IDS_GROWTH_str_(d.creatorId,200),type=KOL_IDS_GROWTH_str_(d.type,80);
  if(!cid||!cr||!type)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign ID, Creator ID and deliverable type are required.');
  var sh=KOL_IDS_GROWTH_ensureGrowthSheets_().getSheetByName(KOL_IDS.DELIVERABLES_SHEET),id=KOL_IDS_PLATFORM_uuid_('DLV'),now=new Date();
  KOL_IDS_GROWTH_rowAppend_(sh,{'Deliverable ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid,'Creator ID':cr,'Type':type,'Due At':KOL_IDS_GROWTH_date_(d.dueAt,true),'Status':'PENDING','Required':d.required===false?'NO':'YES','Submitted At':'','Approved At':'','Revision Count':0,'Notes':KOL_IDS_GROWTH_str_(d.notes,500),'Created At':now,'Updated At':now});
  return {success:true,deliverableId:id,status:'PENDING'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_addDeliverable_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_addDeliverable_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_updateDeliverable_(orgId,brandId,deliverableId,status,notes){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_updateDeliverable_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'STRATEGIST'),sh=ctx.ss.getSheetByName(KOL_IDS.DELIVERABLES_SHEET),m=KOL_IDS_PLATFORM_map_(sh),hit=KOL_IDS_GROWTH_find_(sh,{'Deliverable ID':deliverableId,'Org ID':orgId,'Brand ID':brandId})[0];
  if(!hit)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Deliverable not found.');
  var from=String(hit.r[m['Status']]||'PENDING').toUpperCase(),s=String(status||'').trim().toUpperCase();
  KOL_IDS_DELIVERABLE_validateDeliverableTransition_(from,s);
  var now=new Date();
  sh.getRange(hit.i+2,m['Status']+1).setValue(s);
  if(notes!=null)sh.getRange(hit.i+2,m['Notes']+1).setValue(KOL_IDS_GROWTH_str_(notes,500));
  if(s==='SUBMITTED')sh.getRange(hit.i+2,m['Submitted At']+1).setValue(now);
  if(s==='APPROVED')sh.getRange(hit.i+2,m['Approved At']+1).setValue(now);
  if(s==='REJECTED'){
    var rev=Number(hit.r[m['Revision Count']]||0);
    sh.getRange(hit.i+2,m['Revision Count']+1).setValue(isFinite(rev)?rev+1:1);
  }
  sh.getRange(hit.i+2,m['Updated At']+1).setValue(now);
  KOL_IDS_DATAMOAT_DM_lineage_(ctx,brandId,'DELIVERABLE',deliverableId,'STATUS_CHANGED',{from:from,to:s,dataRights:'CUSTOMER_ONLY'});
  return {success:true,deliverableId:deliverableId,from:from,status:s,updatedAt:now};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_updateDeliverable_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_updateDeliverable_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_evaluate_(orgId,brandId,recommendationId,outcomeId,actualValue){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_evaluate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_DATAMOAT_DM_evaluateRecommendation_!=='function') throw KOL_IDS_PLATFORM_error_('DEPENDENCY_MISSING','Evaluation engine is unavailable.');
  return KOL_IDS_DATAMOAT_DM_evaluateRecommendation_(orgId,brandId,recommendationId,outcomeId,actualValue);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_evaluate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_evaluate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_campaignHealth_(orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_campaignHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'ANALYST'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CAMPAIGNS),cm=KOL_IDS_PLATFORM_map_(sh),c=KOL_IDS_GROWTH_find_(sh,{'Campaign ID':campaignId,'Org ID':orgId,'Brand ID':brandId})[0];if(!c)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Campaign not found.');
  var ds=ctx.ss.getSheetByName(KOL_IDS.DELIVERABLES_SHEET),dm=KOL_IDS_PLATFORM_map_(ds),dr=KOL_IDS_PLATFORM_values_(ds).filter(function(r){return String(r[dm['Campaign ID']])===String(campaignId)&&String(r[dm['Org ID']])===String(orgId)&&String(r[dm['Brand ID']])===String(brandId);});
  var overdue=dr.filter(function(r){return r[dm['Status']]!=='APPROVED'&&r[dm['Status']]!=='CANCELLED'&&r[dm['Due At']]&&new Date(r[dm['Due At']]).getTime()<Date.now();}).length,required=dr.filter(function(r){return String(r[dm['Required']]).toUpperCase()==='YES';}),approved=required.filter(function(r){return String(r[dm['Status']]).toUpperCase()==='APPROVED';}).length;
  var execution=100-Math.min(50,overdue*15)-Math.max(0,(required.length-approved)*10);
  var outcome={count:0,spend:0,revenue:0,conversions:0,roas:null,latestAt:null};try{var os=ctx.ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),om=KOL_IDS_PLATFORM_map_(os);KOL_IDS_PLATFORM_values_(os).forEach(function(r){if(String(r[om['Org ID']])===String(orgId)&&String(r[om['Brand ID']])===String(brandId)&&String(r[om['Campaign ID']])===String(campaignId)){outcome.count++;outcome.spend+=Number(r[om['Spend']])||0;outcome.revenue+=Number(r[om['Revenue']])||0;outcome.conversions+=Number(r[om['Conversions']])||0;var dt=r[om['Observed At']];if(dt&&(!outcome.latestAt||new Date(dt)>new Date(outcome.latestAt)))outcome.latestAt=dt;}});if(outcome.spend>0)outcome.roas=outcome.revenue/outcome.spend;}catch(e){}
  var learning={available:false,coverage:0};try{learning=KOL_IDS_LEARNING_learningHealth_(orgId,brandId);}catch(e){}
  var learningHealth=learning&&learning.success?Math.max(0,Math.min(100,Number(learning.coverageScore!=null?learning.coverageScore:learning.learningCoverage!=null?learning.learningCoverage:0))):0;
  var score=Math.round(Math.max(0,Math.min(100,execution*.55+Math.min(100,50+outcome.count*10)*.15+learningHealth*.15+(outcome.roas==null?50:Math.max(0,Math.min(100,outcome.roas*50)))*.15))*100)/100;
  return {success:true,campaignId:campaignId,status:c.r[cm['Status']],healthScore:score,dimensions:{execution:Math.round(execution),outcomeMaturity:Math.min(100,50+outcome.count*10),learningHealth:Math.round(learningHealth),commercialEfficiency:outcome.roas==null?50:Math.round(Math.max(0,Math.min(100,outcome.roas*50)))},deliverables:dr.length,required:required.length,approved:approved,overdue:overdue,outcome:outcome,decisionState:score>=80?'HEALTHY':score>=60?'WATCH':'INTERVENTION'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_campaignHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_campaignHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Marketplace */
function KOL_IDS_GROWTH_upsertMarketplaceCreator_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_upsertMarketplaceCreator_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'STRATEGIST'),d=data||{},creatorId=KOL_IDS_GROWTH_str_(d.creatorId,200);if(!creatorId)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Creator ID is required.');var minRate=KOL_IDS_GROWTH_num_(d.minRate),maxRate=KOL_IDS_GROWTH_num_(d.maxRate),currency=KOL_IDS_GROWTH_str_(d.currency,8).toUpperCase();if(minRate!==''&&minRate<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Min rate cannot be negative.');if(maxRate!==''&&maxRate<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Max rate cannot be negative.');if(minRate!==''&&maxRate!==''&&minRate>maxRate)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Min rate cannot exceed max rate.');var bounded=['reliabilityScore','cancellationRate','contentQuality','audienceFit'].map(function(k){return [k,KOL_IDS_GROWTH_num_(d[k])];});bounded.forEach(function(pair){if(pair[1]!==''&&(pair[1]<0||pair[1]>100))throw KOL_IDS_PLATFORM_error_('INVALID_INPUT',pair[0]+' must be between 0 and 100.');});var sla=KOL_IDS_GROWTH_num_(d.responseSlaHours);if(sla!==''&&sla<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Response SLA cannot be negative.');
  var sh=KOL_IDS_GROWTH_ensureGrowthSheets_().getSheetByName(KOL_IDS.MARKETPLACE_SHEET),m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh),idx=rows.findIndex(function(r){return String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)&&String(r[m['Creator ID']])===creatorId&&String(r[m['Platform']]).toUpperCase()===String(d.platform||'').toUpperCase();});
  var now=new Date(),obj={'Marketplace ID':idx>=0?rows[idx][m['Marketplace ID']]:KOL_IDS_PLATFORM_uuid_('MKT'),'Org ID':orgId,'Brand ID':brandId,'Creator ID':creatorId,'Platform':KOL_IDS_GROWTH_str_(d.platform,40).toUpperCase(),'Category':KOL_IDS_GROWTH_str_(d.category,100),'Availability':KOL_IDS_GROWTH_str_(d.availability,30).toUpperCase()||'UNKNOWN','Min Rate':minRate,'Max Rate':maxRate,'Currency':currency,'Reliability Score':bounded[0][1],'Response SLA Hours':sla,'Cancellation Rate':bounded[1][1],'Content Quality':bounded[2][1],'Audience Fit':bounded[3][1],'Updated At':now};
  if(idx<0)KOL_IDS_GROWTH_rowAppend_(sh,obj);else sh.getRange(idx+2,1,1,sh.getLastColumn()).setValues([KOL_IDS_PLATFORM_row_(sh,obj)]);return {success:true,marketplaceId:obj['Marketplace ID'],created:idx<0,updatedAt:now};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_upsertMarketplaceCreator_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_upsertMarketplaceCreator_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_creatorReliability_(orgId,brandId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_creatorReliability_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'ANALYST'),
      dsh=ctx.ss.getSheetByName(KOL_IDS.DELIVERABLES_SHEET),dm=KOL_IDS_PLATFORM_map_(dsh),
      drows=KOL_IDS_PLATFORM_values_(dsh).filter(function(r){return String(r[dm['Org ID']])===String(orgId)&&String(r[dm['Brand ID']])===String(brandId)&&String(r[dm['Creator ID']])===String(creatorId);});
  var mkt=ctx.ss.getSheetByName(KOL_IDS.MARKETPLACE_SHEET), mm=KOL_IDS_PLATFORM_map_(mkt), mr=KOL_IDS_PLATFORM_values_(mkt).filter(function(r){return String(r[mm['Org ID']])===String(orgId)&&String(r[mm['Brand ID']])===String(brandId)&&String(r[mm['Creator ID']])===String(creatorId);});
  var csh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA), cm=KOL_IDS_PLATFORM_map_(csh), cr=KOL_IDS_PLATFORM_values_(csh).filter(function(r){return String(r[cm['Org ID']])===String(orgId)&&String(r[cm['Brand ID']])===String(brandId)&&String(r[cm['Creator ID']])===String(creatorId)&&String(r[cm['Status']]).toUpperCase()==='ACTIVE';}).sort(function(a,b){return new Date(b[cm['Observed At']])-new Date(a[cm['Observed At']]);});
  var latest=cr[0]||null, followers=latest?Number(latest[cm['Followers']]):0, er=latest?Number(latest[cm['ER']]):NaN, conf=latest?Number(latest[cm['Confidence']]):0;
  var done=drows.filter(function(r){return ['APPROVED','CANCELLED'].indexOf(String(r[dm['Status']]).toUpperCase())>=0;}), approved=done.filter(function(r){return String(r[dm['Status']]).toUpperCase()==='APPROVED';}).length,
      overdue=drows.filter(function(r){return r[dm['Due At']]&&new Date(r[dm['Due At']]).getTime()<Date.now()&&['APPROVED','CANCELLED'].indexOf(String(r[dm['Status']]).toUpperCase())<0;}).length,
      completion=done.length?approved/done.length:0;
  var mrow=mr[0]||[], relInput=mrow.length?Number(mrow[mm['Reliability Score']]):NaN, cancel=mrow.length?Number(mrow[mm['Cancellation Rate']]):NaN, sla=mrow.length?Number(mrow[mm['Response SLA Hours']]):NaN;
  var socialSignals={engagementQuality:50,audienceQuality:50,contentQuality:mrow.length?Number(mrow[mm['Content Quality']]):60,authenticity:70};
  if(latest){
    try{var aj=JSON.parse(String(latest[cm['Audience JSON']]||'{}')); if(aj&&typeof aj==='object'){['fit','quality','relevance','affinity','authenticity'].forEach(function(k){if(aj[k]!=null&&isFinite(Number(aj[k])))socialSignals.audienceQuality=Math.max(0,Math.min(100,Number(aj[k])));});}}catch(e){}
    try{var cj=JSON.parse(String(latest[cm['Content JSON']]||'{}')); if(cj&&typeof cj==='object'){['engagementQuality','engagement','quality','sentiment','contentQuality'].forEach(function(k){if(cj[k]!=null&&isFinite(Number(cj[k])))socialSignals.engagementQuality=Math.max(0,Math.min(100,Number(cj[k])));}); if(cj.authenticity!=null&&isFinite(Number(cj.authenticity)))socialSignals.authenticity=Math.max(0,Math.min(100,Number(cj.authenticity)));}}catch(e){}
  }
  var fraudFlags=[], fraudRisk=0;
  if(isFinite(er)&&er>25) {fraudRisk+=20;fraudFlags.push('ER_OUTLIER');}
  if(isFinite(er)&&followers>0&&followers<1000&&er>15) {fraudRisk+=15;fraudFlags.push('SMALL_AUDIENCE_HIGH_ER');}
  if(isFinite(cancel)&&cancel>=20) {fraudRisk+=25;fraudFlags.push('HIGH_CANCELLATION');}
  if(isFinite(relInput)&&relInput<45) {fraudRisk+=20;fraudFlags.push('LOW_MARKETPLACE_RELIABILITY');}
  if(isFinite(sla)&&sla>72) {fraudRisk+=5;fraudFlags.push('SLOW_RESPONSE');}
  if(isFinite(conf)&&conf<40) {fraudRisk+=10;fraudFlags.push('LOW_DATA_CONFIDENCE');}
  fraudRisk=Math.max(0,Math.min(100,fraudRisk));
  var base=70+(completion*25)-(overdue*8);
  if(isFinite(relInput))base=base*.55+relInput*.45;
  base=base*.65+(socialSignals.engagementQuality*.15)+(socialSignals.audienceQuality*.10)+(socialSignals.authenticity*.10)-fraudRisk*.35;
  var score=Math.max(0,Math.min(100,base));
  return {success:true,creatorId:creatorId,reliabilityScore:Math.round(score*100)/100,sampleSize:drows.length,approved:approved,overdue:overdue,
    socialIntelligence:{engagementQuality:Math.round(socialSignals.engagementQuality),audienceQuality:Math.round(socialSignals.audienceQuality),contentQuality:Math.round(socialSignals.contentQuality),authenticity:Math.round(socialSignals.authenticity)},
    fraudIntelligence:{riskScore:Math.round(fraudRisk),riskLevel:fraudRisk>=60?'HIGH':fraudRisk>=30?'MEDIUM':'LOW',flags:fraudFlags},
    evidence:{creatorSnapshots:cr.length,confidence:isFinite(conf)?conf:null,marketplaceRecords:mr.length}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_creatorReliability_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_creatorReliability_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Discovery + objective-aware matching. Deterministic and explainable; no fabricated metrics. */
function KOL_IDS_GROWTH_discoverCreators_(orgId,brandId,query){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_discoverCreators_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'ANALYST'),q=query||{},sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA),m=KOL_IDS_PLATFORM_map_(sh),now=Date.now();
  var rows=KOL_IDS_PLATFORM_values_(sh).filter(function(r){return String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)&&String(r[m['Status']]).toUpperCase()==='ACTIVE';});
  var platform=KOL_IDS_GROWTH_str_(q.platform,40).toUpperCase(),category=KOL_IDS_GROWTH_str_(q.category,100).toLowerCase(),minF=KOL_IDS_GROWTH_num_(q.minFollowers),maxF=KOL_IDS_GROWTH_num_(q.maxFollowers),limit=Math.min(KOL_IDS.MAX_RESULTS,Math.max(1,Number(q.limit||25)));
  var out=rows.filter(function(r){var f=Number(r[m['Followers']]);return (!platform||String(r[m['Platform']]).toUpperCase()===platform)&&(!category||String(r[m['Category']]).toLowerCase().indexOf(category)>=0)&&(minF===''||f>=minF)&&(maxF===''||f<=maxF);}).map(function(r){
    var audience={},content={};try{audience=JSON.parse(String(r[m['Audience JSON']]||'{}'));}catch(e){}try{content=JSON.parse(String(r[m['Content JSON']]||'{}'));}catch(e){}
    function KOL_IDS_GROWTH_pick(o,ks,d){for(var i=0;i<ks.length;i++){var v=o[ks[i]];if(v!=null&&isFinite(Number(v)))return Number(v);}return d;}
    var social=KOL_IDS_GROWTH_pick(content,['engagementQuality','engagement','quality','sentiment','authenticity'],50),aud=KOL_IDS_GROWTH_pick(audience,['fit','quality','relevance','affinity','audienceFit'],50),auth=KOL_IDS_GROWTH_pick(content,['authenticity','originality','trust'],70),cq=KOL_IDS_GROWTH_pick(content,['contentQuality','quality','productionQuality'],60);
    var er=Number(r[m['ER']]),followers=Number(r[m['Followers']]),conf=Number(r[m['Confidence']]),ts=new Date(r[m['Observed At']]).getTime(),anomaly=0,flags=[];
    if(isFinite(er)&&er>25){anomaly+=25;flags.push('ER_OUTLIER');} if(isFinite(er)&&followers>0&&followers<1000&&er>15){anomaly+=20;flags.push('SMALL_AUDIENCE_HIGH_ER');} if(isFinite(er)&&followers>1000000&&er<0.3){anomaly+=15;flags.push('LOW_ER_LARGE_AUDIENCE');} if(!isFinite(conf)||conf<40){anomaly+=10;flags.push('LOW_CONFIDENCE');}
    var age=isFinite(ts)?Math.max(0,(now-ts)/86400000):365,fresh=Math.max(0,Math.min(100,100*Math.exp(-age/120))),evidence=Math.max(0,Math.min(100,(isFinite(conf)?conf:50)*.55+fresh*.20+auth*.10+cq*.15)),disc=Math.max(0,Math.min(100,evidence*.45+social*.25+aud*.20+(100-anomaly)*.10));
    return {creatorId:r[m['Creator ID']],platform:r[m['Platform']],handle:r[m['Handle']],followers:followers,er:r[m['ER']],rate:r[m['Rate']],category:r[m['Category']],confidence:r[m['Confidence']],source:r[m['Source']],observedAt:r[m['Observed At']],socialScore:Math.max(0,Math.min(100,social)),audienceSignal:Math.max(0,Math.min(100,aud)),anomalyRisk:Math.max(0,Math.min(100,anomaly)),fraudFlags:flags,freshnessScore:Number(fresh.toFixed(2)),evidenceScore:Number(evidence.toFixed(2)),discoveryScore:Number(disc.toFixed(2))};
  }).sort(function(a,b){return b.discoveryScore-a.discoveryScore||b.evidenceScore-a.evidenceScore||a.anomalyRisk-b.anomalyRisk;}).slice(0,limit);
  var dsh=KOL_IDS_GROWTH_ensureGrowthSheets_().getSheetByName(KOL_IDS.DISCOVERY_SHEET);KOL_IDS_GROWTH_rowAppend_(dsh,{'Event ID':KOL_IDS_PLATFORM_uuid_('DSC'),'Org ID':orgId,'Brand ID':brandId,'Creator ID':'','Campaign ID':q.campaignId||'','Event Type':'SEARCH','Query JSON':JSON.stringify({platform:platform,category:category,minFollowers:minF,maxFollowers:maxF,objective:q.objective||''}),'Source':q.source||'KOL_IDS','Observed At':new Date()});
  return {success:true,count:out.length,results:out};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_discoverCreators_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_discoverCreators_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_historicalOutcomeLift_(ctx,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_historicalOutcomeLift_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var key=String(ctx.orgId)+'|'+String(ctx.brandId)+'|'+String(creatorId);
  var cache=KOL_IDS_GROWTH_HIST_LIFT_CACHE || (KOL_IDS_GROWTH_HIST_LIFT_CACHE={});
  if(cache[key]!=null)return cache[key];
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.PREDICTION_EVAL);
  if(!sh)return cache[key]=0;
  var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh),sum=0,abs=0,n=0;
  rows.forEach(function(r){
    if(String(r[m['Org ID']])!==String(ctx.orgId)||String(r[m['Brand ID']])!==String(ctx.brandId)||String(r[m['Creator ID']])!==String(creatorId))return;
    var v=Number(r[m['Error']]);if(!isFinite(v))return;sum+=v;abs+=Math.abs(v);n++;
  });
  if(!n)return cache[key]=0;
  var bias=sum/n,scale=abs/n||1;
  return cache[key]=Math.max(-25,Math.min(25,(bias/scale)*25));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_historicalOutcomeLift_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_historicalOutcomeLift_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_matchCreators_(orgId,brandId,campaignId,criteria){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_matchCreators_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'ANALYST'),q=criteria||{},dis=KOL_IDS_GROWTH_discoverCreators_(orgId,brandId,Object.assign({},q,{campaignId:campaignId,limit:KOL_IDS.MAX_RESULTS})),mkt=ctx.ss.getSheetByName(KOL_IDS.MARKETPLACE_SHEET),mm=KOL_IDS_PLATFORM_map_(mkt),mr=KOL_IDS_PLATFORM_values_(mkt),mp={};
  mr.forEach(function(r){if(String(r[mm['Org ID']])===String(orgId)&&String(r[mm['Brand ID']])===String(brandId))mp[String(r[mm['Creator ID']])]=r;});
  var objective=KOL_IDS_GROWTH_str_(q.objective,200).toLowerCase(),budget=KOL_IDS_GROWTH_num_(q.budget);
  var results=dis.results.map(function(c){
    var r=mp[String(c.creatorId)]||[],rel=Number(r[mm['Reliability Score']]);if(!isFinite(rel))rel=70,aud=Number(r[mm['Audience Fit']]);if(!isFinite(aud))aud=Number(c.audienceSignal||50);var quality=Number(r[mm['Content Quality']]);if(!isFinite(quality))quality=60;
    var rate=Number(c.rate||r[mm['Min Rate']]||0),cost=budget!==''&&budget>0&&rate>0?Math.max(0,100-(rate/budget*100)):70,fair=null;try{var b=KOL_IDS_INTELLIGENCE_FINAL_priceBenchmark_(ctx,{id:c.creatorId,platform:c.platform,category:c.category,followers:c.followers,rate:rate});fair=b&&b.fairRate?Number(b.fairRate):null;}catch(e){}if(fair&&rate>0)cost=Math.max(0,Math.min(100,100-Math.max(0,(rate/fair-1)*100)));
    var fresh=Number(c.freshnessScore||50),evid=Number(c.evidenceScore||c.confidence||50),social=Number(c.socialScore||50),audSig=Number(c.audienceSignal||50),fraud=Number(c.anomalyRisk||0);
    var fit=Math.max(0,Math.min(100,Number(c.confidence||50)*.18+aud*.20+audSig*.16+quality*.16+social*.12+fresh*.08+evid*.10)),impact=Math.max(0,Math.min(100,Number(c.er||0)*100*.14+quality*.14+rel*.18+social*.14+audSig*.10+evid*.10+(100-fraud)*.10+fresh*.10)),risk=Math.max(0,Math.min(100,100-rel+fraud*.65+(100-evid)*.20));
    var historical=0;try{historical=KOL_IDS_GROWTH_historicalOutcomeLift_(ctx,c.creatorId)||0;}catch(e){}var base=Math.max(0,Math.min(100,fit*.30+impact*.30+cost*.15+(100-risk)*.15+historical*.10-fraud*.18)),learning=typeof KOL_IDS_LEARNING_applyLearningToMatch_==='function'?KOL_IDS_LEARNING_applyLearningToMatch_(orgId,brandId,c.creatorId,base,objective):{score:base,learningAdjustment:0,metric:'',signal:{available:false,status:'NO_LEARNING'}},score=Math.max(0,Math.min(100,Number(learning.score||base)));
    return Object.assign({},c,{fitScore:Number(fit.toFixed(2)),impactScore:Number(impact.toFixed(2)),evidenceScore:Number(evid.toFixed(2)),riskScore:Number(risk.toFixed(2)),costEfficiency:Number(cost.toFixed(2)),confidence:Number(Math.max(0,Math.min(100,fit*.30+evid*.25+rel*.15+social*.10+audSig*.10+fresh*.10)).toFixed(2)),score:Number(score.toFixed(2)),baseScore:Number(base.toFixed(2)),learningAdjustment:learning.learningAdjustment||0,learningMetric:learning.metric||'',learningSignal:learning.signal||{},rate:rate,objective:objective,marketplaceFairRate:fair,fraudRisk:fraud,socialScore:social,audienceSignal:audSig,historicalLift:Number(historical.toFixed(2)),freshnessScore:fresh});
  }).sort(function(a,b){return b.score-a.score||b.confidence-a.confidence||a.riskScore-b.riskScore||a.rate-b.rate;});
  var sh=KOL_IDS_GROWTH_ensureGrowthSheets_().getSheetByName(KOL_IDS.MATCH_SHEET),now=new Date(),top=results.slice(0,Math.min(50,results.length)),rows=[];
  top.forEach(function(c,i){rows.push(KOL_IDS_PLATFORM_row_(sh,{'Match ID':KOL_IDS_PLATFORM_uuid_('MAT'),'Org ID':orgId,'Brand ID':brandId,'Campaign ID':campaignId,'Creator ID':c.creatorId,'Rank':i+1,'Fit Score':c.fitScore,'Impact Score':c.impactScore,'Evidence Score':c.evidenceScore,'Risk Score':c.riskScore,'Cost Efficiency':c.costEfficiency,'Confidence':c.confidence,'Decision':i<10?'RECOMMENDED':'ALTERNATIVE','Reason JSON':JSON.stringify({objective:objective,fit:c.fitScore,impact:c.impactScore,evidence:c.evidenceScore,risk:c.riskScore,costEfficiency:c.costEfficiency,baseScore:c.baseScore,learningAdjustment:c.learningAdjustment,learningMetric:c.learningMetric,learningSignal:c.learningSignal,socialIntelligence:c.socialScore,audienceSignal:c.audienceSignal,fraudRisk:c.fraudRisk,marketplaceFairRate:c.marketplaceFairRate,historicalLift:c.historicalLift,freshness:c.freshnessScore}),'Model Version':'MATCH_V25_16_DEEP_10X','Created At':now}));});
  if(rows.length)sh.getRange(sh.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);
  var persisted=0,failed=[];if(typeof KOL_IDS_LEARNING_recordRecommendation_==='function'){results.slice(0,10).forEach(function(c){try{KOL_IDS_LEARNING_recordRecommendation_(orgId,brandId,{campaignId:campaignId,creatorId:c.creatorId,objective:objective,score:c.score,expectedImpact:(c.learningSignal&&c.learningSignal.benchmarkMedian!=null)?c.learningSignal.benchmarkMedian:c.impactScore,expectedRisk:c.riskScore,confidence:c.confidence,learningAdjustment:c.learningAdjustment,learningConfidence:c.learningSignal&&c.learningSignal.confidence||0,reason:{fit:c.fitScore,impact:c.impactScore,socialIntelligence:c.socialScore,audienceSignal:c.audienceSignal,fraudRisk:c.fraudRisk,marketplaceFairRate:c.marketplaceFairRate,historicalLift:c.historicalLift,freshness:c.freshnessScore,learningSignal:c.learningSignal},decision:'RECOMMENDED'});persisted++;}catch(e){failed.push({creatorId:c.creatorId,error:String(e.message||e)});}});}
  return {success:true,campaignId:campaignId,count:results.length,recommendations:results.slice(0,10),recommendationPersistence:{attempted:Math.min(10,results.length),persisted:persisted,failed:failed},intelligence:{creator:true,social:true,fraud:true,marketplace:true,learning:true,historical:true,evidence:true,freshness:true,version:KOL_IDS.VERSION}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_matchCreators_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_matchCreators_', Date.now() - __kolIdsTraceStartedAt);
  }
}var KOL_IDS_GROWTH_HIST_LIFT_CACHE = KOL_IDS_GROWTH_HIST_LIFT_CACHE || {};
/**
 * KOL IDS — Growth Intelligence / Campaign OS / Marketplace layer.
 * Canonical, additive layer: reuses V25 enterprise auth + existing Data Moat sheets.
 * No PII/contact data is stored here.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  CAMPAIGN_STAGES:['PLANNED','DRAFT','PLANNING','CREATOR_SELECTION','INVITATION','NEGOTIATION','CONTRACTED','CONTENT_BRIEF','CONTENT_SUBMITTED','REVIEW','APPROVED','PUBLISHED','TRACKING','RECONCILIATION','COMPLETED','CANCELLED'],
  TERMINAL:['COMPLETED','CANCELLED'],
  TRANSITIONS:{PLANNED:['PLANNING','CREATOR_SELECTION','CANCELLED'],DRAFT:['PLANNING','CANCELLED'],PLANNING:['CREATOR_SELECTION','CANCELLED'],CREATOR_SELECTION:['INVITATION','CANCELLED'],INVITATION:['NEGOTIATION','CONTRACTED','CANCELLED'],NEGOTIATION:['CONTRACTED','CANCELLED'],CONTRACTED:['CONTENT_BRIEF','CANCELLED'],CONTENT_BRIEF:['CONTENT_SUBMITTED','CANCELLED'],CONTENT_SUBMITTED:['REVIEW','CANCELLED'],REVIEW:['APPROVED','CONTENT_SUBMITTED','CANCELLED'],APPROVED:['PUBLISHED','CANCELLED'],PUBLISHED:['TRACKING'],TRACKING:['RECONCILIATION','CANCELLED'],RECONCILIATION:['COMPLETED','CANCELLED'],COMPLETED:[],CANCELLED:[]},
  MARKETPLACE_SHEET:'ENT_CREATOR_MARKETPLACE',
  DELIVERABLES_SHEET:'ENT_CAMPAIGN_DELIVERABLES',
  DISCOVERY_SHEET:'ENT_DISCOVERY_EVENTS',
  MATCH_SHEET:'ENT_MATCH_DECISIONS',
  MAX_RESULTS:100
});

function KOL_IDS_GROWTH_calibrationReport_(orgId,brandId,modelVersion){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_calibrationReport_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'ANALYST'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.PREDICTION_EVAL),m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh).filter(function(r){return String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)&&(!modelVersion||String(r[m['Model Version']])===String(modelVersion));});
  if(!rows.length)return {success:true,sampleSize:0,mae:null,mape:null,bias:null,calibration:'NO_DATA'};var ae=rows.map(function(r){return Math.abs(Number(r[m['Error']]||0));}),ape=rows.map(function(r){return Number(r[m['Absolute Percentage Error']]||0);}).filter(isFinite),bias=rows.reduce(function(s,r){return s+Number(r[m['Error']]||0);},0)/rows.length,mae=ae.reduce(function(a,b){return a+b;},0)/ae.length,mape=ape.length?ape.reduce(function(a,b){return a+b;},0)/ape.length:null;return {success:true,sampleSize:rows.length,mae:mae,mape:mape,bias:bias,calibration:mape===null?'UNKNOWN':mape<=.1?'GOOD':mape<=.2?'WATCH':'NEEDS_RECALIBRATION'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_calibrationReport_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_calibrationReport_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Moat health: validates the flywheel without exposing customer rows. */
function KOL_IDS_GROWTH_moatHealth_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_moatHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_GROWTH_ctx_(orgId,brandId,'ANALYST'),names=[KOL_IDS.SHEETS.CAMPAIGNS,KOL_IDS.SHEETS.RECOMMENDATIONS,KOL_IDS.SHEETS.OUTCOMES,KOL_IDS.SHEETS.PREDICTION_EVAL,KOL_IDS.SHEETS.DATA_LINEAGE,KOL_IDS.MARKETPLACE_SHEET,KOL_IDS.MATCH_SHEET];
  var counts={};names.forEach(function(n){var sh=ctx.ss.getSheetByName(n);counts[n]=sh?Math.max(0,sh.getLastRow()-1):0;});
  var learning=typeof KOL_IDS_LEARNING_learningHealth_==='function'?KOL_IDS_LEARNING_learningHealth_(orgId,brandId):{success:false,readyForLearning:false};
  var checks=[counts[KOL_IDS.SHEETS.CAMPAIGNS]>0,counts[KOL_IDS.SHEETS.RECOMMENDATIONS]>0,counts[KOL_IDS.SHEETS.OUTCOMES]>0,counts[KOL_IDS.SHEETS.PREDICTION_EVAL]>0,counts[KOL_IDS.SHEETS.DATA_LINEAGE]>0];
  return {success:true,flywheelCoverage:checks.filter(Boolean).length+'/'+checks.length,counts:counts,readyForLearning:learning.readyForLearning,learning:learning};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_moatHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_moatHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_growthContractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_growthContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_GROWTH_ensureGrowthSheets_(),required=['ENT_CREATOR_MARKETPLACE','ENT_CAMPAIGN_DELIVERABLES','ENT_DISCOVERY_EVENTS','ENT_MATCH_DECISIONS'],missing=required.filter(function(n){return !ss.getSheetByName(n);});
  var transitions=Object.keys(KOL_IDS.TRANSITIONS).every(function(k){return Array.isArray(KOL_IDS.TRANSITIONS[k]);});
  var canonicalParity=typeof KOL_IDS_CANONICAL_MUTATION_assertTransition_==='function' && String(KOL_IDS_GROWTH_transitionCampaign_).indexOf('KOL_IDS_CANONICAL_MUTATION_assertTransition_')>=0;
  var deliverableGuard=String(KOL_IDS_GROWTH_updateDeliverable_).indexOf('KOL_IDS_DELIVERABLE_validateDeliverableTransition_')>=0;
  var historicalLearning=typeof KOL_IDS_GROWTH_historicalOutcomeLift_==='function' && String(KOL_IDS_GROWTH_matchCreators_).indexOf('historicalOutcomeLift')>=0;
  var schemasOk=required.every(function(n){var h=KOL_IDS_PLATFORM_map_(ss.getSheetByName(n));return h.Email==null&&h.Phone==null;});
  return {success:missing.length===0&&transitions&&canonicalParity&&deliverableGuard&&historicalLearning&&schemasOk,version:KOL_IDS.VERSION,checks:{growthSheets:missing.length===0,transitionGraph:transitions,canonicalTransitionHook:canonicalParity,deliverableStateEnforced:deliverableGuard,historicalOutcomeLearning:historicalLearning,noContactFields:schemasOk},missing:missing};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_growthContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_growthContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ================= LEGACY_V25.16 DEEP 20X INTERNAL INTELLIGENCE LAYER =================
 * Internal-only helpers. No new product/API surface.
 * Goals: evidence fusion, freshness decay, confidence calibration,
 * risk-aware scoring, continuity, and deterministic decision context.
 */
var KOL_IDS_PRODUCTION_DEEP20X = Object.freeze({
  VERSION: '25.16.20',
  EPS: 1e-9,
  MAX_BONUS: 0.20,
  MAX_PENALTY: 0.35,
  FRESHNESS_HALF_LIFE_DAYS: 30,
  OUTLIER_FLOOR: 0.15,
  OUTLIER_CEIL: 6.0
});

function KOL_IDS_GROWTH_deep20x_num_(v, fallback) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var n = Number(v);
  return isFinite(n) ? n : (fallback == null ? 0 : fallback);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_clamp_(v, lo, hi) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  v = KOL_IDS_GROWTH_deep20x_num_(v, 0);
  return Math.max(lo, Math.min(hi, v));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_freshness_(dateValue) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_freshness_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!dateValue) return 0.5;
  var t = new Date(dateValue).getTime();
  if (!isFinite(t)) return 0.5;
  var days = Math.max(0, (Date.now() - t) / 86400000);
  return Math.pow(0.5, days / KOL_IDS_PRODUCTION_DEEP20X.FRESHNESS_HALF_LIFE_DAYS);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_freshness_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_freshness_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_confidence_(sampleSize, evidenceQuality, freshness) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_confidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var n = Math.max(0, KOL_IDS_GROWTH_deep20x_num_(sampleSize, 0));
  var volume = 1 - Math.exp(-n / 5);
  var eq = KOL_IDS_GROWTH_deep20x_clamp_(evidenceQuality, 0, 1);
  var fr = KOL_IDS_GROWTH_deep20x_clamp_(freshness, 0, 1);
  return KOL_IDS_GROWTH_deep20X_clamp_(0.10 + 0.55 * volume + 0.20 * eq + 0.15 * fr, 0, 1);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_confidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_confidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20X_clamp_(v, lo, hi) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20X_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_GROWTH_deep20x_clamp_(v, lo, hi);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20X_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20X_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_robustRatio_(actual, benchmark) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_robustRatio_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  actual = KOL_IDS_GROWTH_deep20x_num_(actual, 0);
  benchmark = KOL_IDS_GROWTH_deep20x_num_(benchmark, 0);
  if (benchmark <= KOL_IDS_PRODUCTION_DEEP20X.EPS) return actual > 0 ? 1 : 0;
  return KOL_IDS_GROWTH_deep20x_clamp_(
    actual / benchmark,
    KOL_IDS_PRODUCTION_DEEP20X.OUTLIER_FLOOR,
    KOL_IDS_PRODUCTION_DEEP20X.OUTLIER_CEIL
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_robustRatio_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_robustRatio_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_percentile_(ratio) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_percentile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  ratio = KOL_IDS_GROWTH_deep20x_clamp_(ratio, 0.15, 6);
  return KOL_IDS_GROWTH_deep20x_clamp_(
    0.5 + Math.log(ratio) / (2 * Math.log(6)),
    0, 1
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_percentile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_percentile_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_riskPenalty_(risk, fraud, reliability) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_riskPenalty_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var r = KOL_IDS_GROWTH_deep20x_clamp_(risk, 0, 1);
  var f = KOL_IDS_GROWTH_deep20x_clamp_(fraud, 0, 1);
  var rel = KOL_IDS_GROWTH_deep20x_clamp_(reliability, 0, 1);
  var penalty = 0.55 * r + 0.35 * f + 0.10 * (1 - rel);
  return KOL_IDS_GROWTH_deep20x_clamp_(
    penalty * KOL_IDS_PRODUCTION_DEEP20X.MAX_PENALTY,
    0,
    KOL_IDS_PRODUCTION_DEEP20X.MAX_PENALTY
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_riskPenalty_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_riskPenalty_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_fuse_(baseScore, evidence, learning, risk) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_fuse_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var base = KOL_IDS_GROWTH_deep20x_clamp_(baseScore, 0, 100);
  var ev = KOL_IDS_GROWTH_deep20x_clamp_(evidence, 0, 1);
  var learn = KOL_IDS_GROWTH_deep20x_clamp_(learning, -1, 1);
  var rp = KOL_IDS_GROWTH_deep20x_clamp_(risk, 0, 1);

  // Evidence raises conviction; learning adjusts only with bounded impact;
  // risk is multiplicative so high-risk creators cannot be rescued by fit alone.
  var evidenceBonus = (ev - 0.5) * 12;
  var learningAdj = learn * 10;
  var riskPenalty = rp * 18;

  return KOL_IDS_GROWTH_deep20x_clamp_(
    base + evidenceBonus + learningAdj - riskPenalty,
    0,
    100
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_fuse_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_fuse_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GROWTH_deep20x_contextHash_(ctx) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_deep20x_contextHash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var raw = JSON.stringify(ctx || {});
    var bytes = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      raw,
      Utilities.Charset.UTF_8
    );
    return bytes.map(function(b) {
      var x = (b < 0 ? b + 256 : b).toString(16);
      return x.length === 1 ? '0' + x : x;
    }).join('');
  } catch (e) {
    return '';
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_deep20x_contextHash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_deep20x_contextHash_', Date.now() - __kolIdsTraceStartedAt);
  }
}



/* ================= LEGACY_V25.16 50X INTEGRATION / 30X INTELLIGENCE =================
 * Internal capability layer. Preserves existing public contracts.
 *
 * Integration:
 * UX continuity / data integration / ingestion normalization / external moat /
 * ecosystem adapter readiness / marketplace continuity.
 *
 * Intelligence:
 * stronger evidence fusion, lineage, freshness, confidence, risk, commerce,
 * campaign context and outcome feedback.
 */
var KOL_IDS_PRODUCTION_DEEP50X = Object.freeze({
  VERSION:'25.16.50',
  INTEGRATION_VERSION:'INT50',
  INTELLIGENCE_VERSION:'INT30',
  EPS:1e-9,
  MAX_STALENESS_DAYS:90,
  MAX_CONFIDENCE:1,
  MIN_CONFIDENCE:0.05
});

function KOL_IDS_GROWTH_d50_num_(v, d) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var n = Number(v);
  return isFinite(n) ? n : (d == null ? 0 : d);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_d50_clamp_(v, lo, hi) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return Math.max(lo, Math.min(hi, KOL_IDS_GROWTH_d50_num_(v, 0)));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_d50_normText_(v) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_normText_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return String(v == null ? '' : v).trim();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_normText_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_normText_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_d50_freshness_(v) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_freshness_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var t = new Date(v).getTime();
  if (!isFinite(t)) return 0.5;
  var days = Math.max(0, (Date.now() - t) / 86400000);
  return Math.pow(0.5, days / 30);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_freshness_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_freshness_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_d50_confidence_(sample, quality, freshness) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_confidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var n = Math.max(0, KOL_IDS_GROWTH_d50_num_(sample, 0));
  var volume = 1 - Math.exp(-n / 5);
  return KOL_IDS_GROWTH_d50_clamp_(
    0.08 + 0.52 * volume +
    0.25 * KOL_IDS_GROWTH_d50_clamp_(quality,0,1) +
    0.15 * KOL_IDS_GROWTH_d50_clamp_(freshness,0,1),
    0.05, 1
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_confidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_confidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* UX continuity: preserve the same decision context across screens/calls. */
function KOL_IDS_GROWTH_d50_context_(a) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_context_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  a = a || {};
  return {
    orgId: KOL_IDS_GROWTH_d50_normText_(a.orgId),
    brandId: KOL_IDS_GROWTH_d50_normText_(a.brandId),
    campaignId: KOL_IDS_GROWTH_d50_normText_(a.campaignId),
    creatorId: KOL_IDS_GROWTH_d50_normText_(a.creatorId),
    objective: KOL_IDS_GROWTH_d50_normText_(a.objective),
    modelVersion: KOL_IDS_GROWTH_d50_normText_(a.modelVersion)
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_context_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_context_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Data integration / ingestion normalization. */
function KOL_IDS_GROWTH_d50_normalizeRecord_(record) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_normalizeRecord_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  record = record || {};
  var out = {};
  Object.keys(record).forEach(function(k) {
    var v = record[k];
    if (typeof v === 'string') v = v.trim();
    out[k] = v;
  });
  if (!out.Source && out.source) out.Source = out.source;
  if (!out.ObservedAt && out.observedAt) out.ObservedAt = out.observedAt;
  if (!out.ExternalId && out.externalId) out.ExternalId = out.externalId;
  if (!out.UpdatedAt && out.updatedAt) out.UpdatedAt = out.updatedAt;
  return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_normalizeRecord_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_normalizeRecord_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* External data moat: canonical source + freshness + provenance. */
function KOL_IDS_GROWTH_d50_provenance_(record, source) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_provenance_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  record = record || {};
  return {
    source: KOL_IDS_GROWTH_d50_normText_(source || record.Source || record.source),
    externalId: KOL_IDS_GROWTH_d50_normText_(record.ExternalId || record.externalId),
    observedAt: record.ObservedAt || record.observedAt || '',
    updatedAt: record.UpdatedAt || record.updatedAt || '',
    freshness: KOL_IDS_GROWTH_d50_freshness_(
      record.UpdatedAt || record.updatedAt ||
      record.ObservedAt || record.observedAt
    )
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_provenance_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_provenance_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Ecosystem compatibility: deterministic source identity without credentials. */
function KOL_IDS_GROWTH_d50_sourceKey_(source, externalId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_sourceKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return [
    KOL_IDS_GROWTH_d50_normText_(source).toLowerCase(),
    KOL_IDS_GROWTH_d50_normText_(externalId).toLowerCase()
  ].join(':');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_sourceKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_sourceKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Marketplace capability: normalize rate / currency / reliability evidence. */
function KOL_IDS_GROWTH_d50_marketSignal_(rate, benchmarkRate, reliability) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_marketSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var r = KOL_IDS_GROWTH_d50_num_(rate, 0);
  var b = KOL_IDS_GROWTH_d50_num_(benchmarkRate, 0);
  var rel = KOL_IDS_GROWTH_d50_clamp_(reliability, 0, 1);
  var efficiency = b > KOL_IDS_PRODUCTION_DEEP50X.EPS
    ? KOL_IDS_GROWTH_d50_clamp_(b / Math.max(r, KOL_IDS_PRODUCTION_DEEP50X.EPS), 0, 2)
    : 1;
  return {
    efficiency: efficiency,
    reliability: rel,
    commerceConfidence: KOL_IDS_GROWTH_d50_clamp_(0.5 * rel + 0.5 * KOL_IDS_GROWTH_d50_clamp_(efficiency/2,0,1),0,1)
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_marketSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_marketSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Integration quality gate: incomplete records remain usable but lose confidence. */
function KOL_IDS_GROWTH_d50_quality_(record) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_quality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  record = record || {};
  var keys = ['orgId','brandId','campaignId','creatorId'];
  var present = keys.filter(function(k){ return KOL_IDS_GROWTH_d50_normText_(record[k]); }).length;
  var prov = KOL_IDS_GROWTH_d50_provenance_(record);
  return KOL_IDS_GROWTH_d50_clamp_(
    present / keys.length * 0.7 + prov.freshness * 0.3,
    0, 1
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_quality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_quality_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Cross-layer intelligence fusion. Risk is multiplicative; weak provenance
 * cannot be fully rescued by a high raw score. */
function KOL_IDS_GROWTH_d50_fuseScore_(base, evidence, learning, risk, freshness) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_fuseScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var b = KOL_IDS_GROWTH_d50_clamp_(base,0,100);
  var e = KOL_IDS_GROWTH_d50_clamp_(evidence,0,1);
  var l = KOL_IDS_GROWTH_d50_clamp_(learning,-1,1);
  var r = KOL_IDS_GROWTH_d50_clamp_(risk,0,1);
  var f = KOL_IDS_GROWTH_d50_clamp_(freshness,0,1);

  var conviction = 1 + (e - 0.5) * 0.16 + (f - 0.5) * 0.10;
  var learningAdj = l * 8;
  var riskPenalty = r * 20;

  return KOL_IDS_GROWTH_d50_clamp_(
    b * conviction + learningAdj - riskPenalty,
    0, 100
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_fuseScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_fuseScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Deterministic context hash for continuity / audit correlation. */
function KOL_IDS_GROWTH_d50_hash_(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_d50_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var raw = JSON.stringify(payload || {});
    var bytes = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8
    );
    return bytes.map(function(b) {
      b = b < 0 ? b + 256 : b;
      var x = b.toString(16);
      return x.length === 1 ? '0' + x : x;
    }).join('');
  } catch (e) { return ''; }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_d50_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_d50_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}



/* ================= LEGACY_V25.16 SYSTEM COHESION / FLOW HARDENING =================
 * Internal-only. Strengthens existing execution without changing public
 * function signatures or adding product-facing endpoints.
 *
 * Principles:
 *  - one normalized context
 *  - one evidence envelope
 *  - one confidence/risk discipline
 *  - deterministic idempotency correlation
 *  - fail-soft optional intelligence
 *  - bounded score changes
 *  - downstream-safe payloads
 */
var KOL_IDS_PRODUCTION_COHESION = Object.freeze({
  VERSION:'25.16.COHESION',
  MAX_SCORE:100,
  MIN_SCORE:0,
  MAX_ADJUSTMENT:20,
  MAX_RISK_PENALTY:25,
  DEFAULT_CONFIDENCE:0.35,
  FRESHNESS_HALF_LIFE_DAYS:30
});

function KOL_IDS_GROWTH_cohesionNum_(v,d){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionNum_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var n=Number(v); return isFinite(n)?n:(d==null?0:d);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionNum_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionNum_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_cohesionClamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionClamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return Math.max(a,Math.min(b,KOL_IDS_GROWTH_cohesionNum_(v,0)));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionClamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionClamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_cohesionText_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionText_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return String(v==null?'':v).trim();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionText_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionText_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GROWTH_cohesionFreshness_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionFreshness_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var t=new Date(v).getTime();
  if(!isFinite(t)) return 0.5;
  var days=Math.max(0,(Date.now()-t)/86400000);
  return Math.pow(0.5,days/KOL_IDS_PRODUCTION_COHESION.FRESHNESS_HALF_LIFE_DAYS);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionFreshness_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionFreshness_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Canonical context envelope: modules can safely pass the same identity. */
function KOL_IDS_GROWTH_cohesionContext_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  a=a||{};
  return {
    orgId:KOL_IDS_GROWTH_cohesionText_(a.orgId),
    brandId:KOL_IDS_GROWTH_cohesionText_(a.brandId),
    campaignId:KOL_IDS_GROWTH_cohesionText_(a.campaignId),
    creatorId:KOL_IDS_GROWTH_cohesionText_(a.creatorId),
    objective:KOL_IDS_GROWTH_cohesionText_(a.objective),
    modelVersion:KOL_IDS_GROWTH_cohesionText_(a.modelVersion),
    source:KOL_IDS_GROWTH_cohesionText_(a.source),
    correlationId:KOL_IDS_GROWTH_cohesionText_(a.correlationId)
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Stable correlation key used to keep stages attached to the same decision. */
function KOL_IDS_GROWTH_cohesionCorrelation_(ctx){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionCorrelation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  ctx=KOL_IDS_GROWTH_cohesionContext_(ctx);
  var raw=[ctx.orgId,ctx.brandId,ctx.campaignId,ctx.creatorId,
           ctx.objective,ctx.modelVersion].join('|');
  try{
    var b=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,raw,
                                  Utilities.Charset.UTF_8);
    return b.map(function(x){
      x=x<0?x+256:x; var h=x.toString(16); return h.length===1?'0'+h:h;
    }).join('');
  }catch(e){return raw;}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionCorrelation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionCorrelation_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Evidence envelope: makes provenance/freshness/quality portable downstream. */
function KOL_IDS_GROWTH_cohesionEvidence_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionEvidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  v=v||{};
  var freshness=KOL_IDS_GROWTH_cohesionFreshness_(
    v.updatedAt||v.updated_at||v.observedAt||v.observed_at
  );
  var quality=KOL_IDS_GROWTH_cohesionClamp_(
    v.quality==null?0.5:v.quality,0,1
  );
  var completeness=KOL_IDS_GROWTH_cohesionClamp_(
    v.completeness==null?1:v.completeness,0,1
  );
  return {
    source:KOL_IDS_GROWTH_cohesionText_(v.source),
    externalId:KOL_IDS_GROWTH_cohesionText_(v.externalId||v.external_id),
    freshness:freshness,
    quality:quality,
    completeness:completeness,
    confidence:KOL_IDS_GROWTH_cohesionClamp_(
      0.45*quality+0.30*completeness+0.25*freshness,
      0.05,1
    )
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionEvidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionEvidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Bounded intelligence fusion: no single layer can dominate. */
function KOL_IDS_GROWTH_cohesionScore_(base,evidence,learning,risk){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var b=KOL_IDS_GROWTH_cohesionClamp_(base,0,100);
  var e=KOL_IDS_GROWTH_cohesionClamp_(evidence,0,1);
  var l=KOL_IDS_GROWTH_cohesionClamp_(learning,-1,1);
  var r=KOL_IDS_GROWTH_cohesionClamp_(risk,0,1);
  var evidenceAdj=(e-0.5)*10;
  var learningAdj=l*10;
  var riskPenalty=r*KOL_IDS_PRODUCTION_COHESION.MAX_RISK_PENALTY;
  return KOL_IDS_GROWTH_cohesionClamp_(
    b+evidenceAdj+learningAdj-riskPenalty,0,100
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Downstream-safe serialization: never let circular/undefined payloads break flow. */
function KOL_IDS_GROWTH_cohesionSafeJSON_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionSafeJSON_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{return JSON.stringify(v==null?{}:v);}
  catch(e){return JSON.stringify({error:'SERIALIZATION_FAILED'});}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionSafeJSON_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionSafeJSON_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Optional intelligence should enrich, not become a single point of failure. */
function KOL_IDS_GROWTH_cohesionTry_(fn,fallback){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GROWTH_cohesionTry_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{
    return typeof fn==='function'?fn():fallback;
  }catch(e){return fallback;}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GROWTH_cohesionTry_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GROWTH_cohesionTry_', Date.now() - __kolIdsTraceStartedAt);
  }
}
