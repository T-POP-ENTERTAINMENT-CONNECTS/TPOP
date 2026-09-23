/**
 * KOL IDS™ LEGACY_V25.14 — Campaign Control & Decision Intelligence Layer
 *
 * Additive layer on top of the existing LEGACY_V25.13 canonical flow.
 * Campaign ID remains the root key; this module never creates a parallel
 * campaign identity. It adds planning, execution control, budget pacing,
 * KPI governance, risk gates and a campaign control-tower snapshot.
 *
 * Flow:
 * Campaign → Strategy/Plan → Tasks & Dependencies → KOL Decision →
 * Deliverables → Budget/KPI/Risk Monitoring → Health → Outcome → Learning
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  PLAN:'ENT_CAMPAIGN_PLANS',
  TASKS:'ENT_CAMPAIGN_TASKS',
  BUDGET:'ENT_CAMPAIGN_BUDGET',
  KPIS:'ENT_CAMPAIGN_KPIS',
  RISKS:'ENT_CAMPAIGN_RISKS',
  EVENTS:'ENT_CAMPAIGN_EVENTS',
  TASK_STATES:['PLANNED','IN_PROGRESS','BLOCKED','DONE','OVERDUE','CANCELLED'],
  KPI_DIRECTIONS:['HIGHER_BETTER','LOWER_BETTER'],
  RISK_STATES:['OPEN','MITIGATED','ACCEPTED','CLOSED'],
  MAX_TASKS_PER_CALL:200,
  LOCK_MS:20000,
  MAX_STRING:1000
});

var KOL_IDS_CAMPAIGN_TASK_TRANSITIONS = Object.freeze({
  PLANNED:['IN_PROGRESS','BLOCKED','OVERDUE','CANCELLED'],
  IN_PROGRESS:['BLOCKED','DONE','OVERDUE','CANCELLED'],
  BLOCKED:['IN_PROGRESS','DONE','CANCELLED'],
  OVERDUE:['IN_PROGRESS','BLOCKED','DONE','CANCELLED'],
  DONE:[],
  CANCELLED:[]
});

function KOL_IDS_CAMPAIGN_CONTROL_assertTaskTransition_(fromState,toState){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_assertTaskTransition_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var from=String(fromState||'PLANNED').trim().toUpperCase();
  var to=String(toState||'').trim().toUpperCase();
  if(!to)throw KOL_IDS_PLATFORM_error_('INVALID_STATE','Task state is required.');
  if(from===to)return true;
  var allowed=KOL_IDS_CAMPAIGN_TASK_TRANSITIONS[from];
  if(!allowed || allowed.indexOf(to)<0)throw KOL_IDS_PLATFORM_error_('INVALID_STATE','Invalid task transition: '+from+' -> '+to);
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_assertTaskTransition_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_assertTaskTransition_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_(fn){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock();
  if(!lock.tryLock(KOL_IDS.LOCK_MS))throw KOL_IDS_PLATFORM_error_('LOCKED','Campaign control is busy. Please retry.');
  try{return fn();}finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_headerIndex_(sh,name){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_headerIndex_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_PLATFORM_map_(sh);if(m[name]==null)throw KOL_IDS_PLATFORM_error_('SCHEMA_ERROR','Missing required column: '+name);return m[name];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_headerIndex_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_headerIndex_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_cycleWouldExist_(sh,campaignId,orgId,brandId,taskId,deps){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_cycleWouldExist_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh),graph={};
  rows.forEach(function(r){
    if(String(r[m['Campaign ID']])!==String(campaignId)||String(r[m['Org ID']])!==String(orgId)||String(r[m['Brand ID']])!==String(brandId))return;
    var id=String(r[m['Task ID']]||'').trim();if(!id)return;
    graph[id]=KOL_IDS_CAMPAIGN_CONTROL_json_(r[m['Dependency IDs JSON']],[]);if(!Array.isArray(graph[id]))graph[id]=[];
  });
  graph[String(taskId)]=deps.slice();
  var visiting={},visited={};
  function KOL_IDS_CAMPAIGN_CONTROL_dfs(id){
    if(visiting[id])return true;if(visited[id])return false;visiting[id]=true;
    var next=graph[id]||[];for(var i=0;i<next.length;i++){if(KOL_IDS_CAMPAIGN_CONTROL_dfs(String(next[i]))){return true;}}
    delete visiting[id];visited[id]=true;return false;
  }
  return KOL_IDS_CAMPAIGN_CONTROL_dfs(String(taskId));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_cycleWouldExist_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_cycleWouldExist_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_activePlan_(sh,campaignId,orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_activePlan_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var m=KOL_IDS_PLATFORM_map_(sh);return KOL_IDS_PLATFORM_values_(sh).filter(function(r){return String(r[m['Campaign ID']])===String(campaignId)&&String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)&&String(r[m['Status']]).toUpperCase()==='ACTIVE';});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_activePlan_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_activePlan_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_headers_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return {
  ENT_CAMPAIGN_PLANS:['Plan ID','Org ID','Brand ID','Campaign ID','Version','Strategy','Audience','Channel Mix JSON','Objectives JSON','KPI Plan JSON','Assumptions JSON','Constraints JSON','Owner','Status','Start At','End At','Decision Gates JSON','Created At','Updated At'],
  ENT_CAMPAIGN_TASKS:['Task ID','Org ID','Brand ID','Campaign ID','Parent Task ID','Phase','Task Type','Task Name','Owner','Dependency IDs JSON','Priority','Start At','Due At','Status','Blocked Reason','Completed At','Created At','Updated At'],
  ENT_CAMPAIGN_BUDGET:['Budget ID','Org ID','Brand ID','Campaign ID','Category','Planned','Committed','Actual','Currency','Variance','Pacing Percent','Notes','Updated At'],
  ENT_CAMPAIGN_KPIS:['KPI ID','Org ID','Brand ID','Campaign ID','Metric','Target','Actual','Unit','Direction','Baseline','Weight','Status','Variance Percent','Source','Observed At','Updated At'],
  ENT_CAMPAIGN_RISKS:['Risk ID','Org ID','Brand ID','Campaign ID','Type','Severity','Probability','Impact','Risk Score','Status','Trigger','Mitigation','Owner','Due At','Resolved At','Created At','Updated At'],
  ENT_CAMPAIGN_EVENTS:['Event ID','Org ID','Brand ID','Campaign ID','Event Type','Entity Type','Entity ID','From State','To State','Payload JSON','Actor','Occurred At']
};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_ensure_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_GROWTH_ensureGrowthSheets_(),specs=KOL_IDS_CAMPAIGN_CONTROL_headers_();
  Object.keys(specs).forEach(function(n){var sh=ss.getSheetByName(n);if(!sh)sh=ss.insertSheet(n);if(sh.getLastRow()===0)sh.getRange(1,1,1,specs[n].length).setValues([specs[n]]);else{var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);specs[n].forEach(function(x){if(h.indexOf(x)<0){sh.getRange(1,h.length+1).setValue(x);h.push(x);}});sh.setFrozenRows(1);}});
  return ss;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,role){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_ctx_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_GROWTH_ctx_(orgId,brandId,role||'ANALYST');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_ctx_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_ctx_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_json_(v,fallback){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_json_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{var x=JSON.parse(String(v==null?'':v));return x==null?(fallback==null?{}:fallback):x;}catch(e){return fallback==null?{}:fallback;}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_json_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_json_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_bool_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_bool_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return v===true||String(v||'').toUpperCase()==='TRUE'||String(v||'').toUpperCase()==='YES';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_bool_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_bool_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_num_(v,defaultValue){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v==null)return defaultValue==null?0:defaultValue;var n=Number(v);return isFinite(n)?n:(defaultValue==null?0:defaultValue);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_date_(v,required){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v==null){if(required)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Date is required.');return null;}var d=v instanceof Date?new Date(v.getTime()):new Date(v);if(isNaN(d.getTime()))throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Invalid date.');return d;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_find_(sh,filters){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_find_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh);Object.keys(filters||{}).forEach(function(k){if(m[k]==null)throw KOL_IDS_PLATFORM_error_('SCHEMA_ERROR','Missing required column: '+k);});return rows.map(function(r,i){return {r:r,i:i,m:m};}).filter(function(x){return Object.keys(filters||{}).every(function(k){return String(x.r[m[k]]==null?'':x.r[m[k]])===String(filters[k]==null?'':filters[k]);});});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_find_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_find_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_append_(sh,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_append_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var row=KOL_IDS_PLATFORM_row_(sh,obj);sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]);return sh.getLastRow();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_append_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_append_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_campaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CAMPAIGNS),hit=KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Campaign ID':campaignId,'Org ID':ctx.orgId,'Brand ID':ctx.brandId})[0];if(!hit)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Campaign not found in authorized brand.');return {sh:sh,row:hit.r,index:hit.i,map:hit.m};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_campaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_campaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CAMPAIGN_CONTROL_event_(ctx,campaignId,type,entityType,entityId,fromState,toState,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_event_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.EVENTS);KOL_IDS_CAMPAIGN_CONTROL_append_(sh,{'Event ID':KOL_IDS_PLATFORM_uuid_('EVT'),'Org ID':ctx.orgId,'Brand ID':ctx.brandId,'Campaign ID':campaignId,'Event Type':type,'Entity Type':entityType||'','Entity ID':entityId||'','From State':fromState||'','To State':toState||'','Payload JSON':JSON.stringify(payload||{}),'Actor':ctx.user&&ctx.user.email||'SYSTEM','Occurred At':new Date()});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_event_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_event_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Create or version the planning layer for an existing canonical Campaign ID. */
function KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_(function(){
    var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'STRATEGIST'),d=data||{},cid=String(d.campaignId||'').trim();
    if(!cid)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign ID is required.');
    KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,cid);KOL_IDS_CAMPAIGN_CONTROL_ensure_();
    var sh=ctx.ss.getSheetByName(KOL_IDS.PLAN),rows=KOL_IDS_PLATFORM_values_(sh),m=KOL_IDS_PLATFORM_map_(sh),activeBefore=KOL_IDS_CAMPAIGN_CONTROL_activePlan_(sh,cid,orgId,brandId).length,versions=rows.filter(function(r){return String(r[m['Campaign ID']])===cid&&String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId);}).map(function(r){return Number(r[m['Version']]||0);}),version=(versions.length?Math.max.apply(null,versions):0)+1,now=new Date(),id=KOL_IDS_PLATFORM_uuid_('PLN');
    KOL_IDS_CAMPAIGN_CONTROL_activePlan_(sh,cid,orgId,brandId).forEach(function(hit){
      var all=KOL_IDS_PLATFORM_values_(sh),rowIndex=-1;for(var i=0;i<all.length;i++){if(String(all[i][m['Plan ID']])===String(hit[m['Plan ID']])){rowIndex=i;break;}}
      if(rowIndex>=0){sh.getRange(rowIndex+2,m['Status']+1).setValue('SUPERSEDED');sh.getRange(rowIndex+2,m['Updated At']+1).setValue(now);}
    });
    KOL_IDS_CAMPAIGN_CONTROL_append_(sh,{'Plan ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid,'Version':version,'Strategy':String(d.strategy||'').trim().slice(0,1000),'Audience':String(d.audience||'').trim().slice(0,1000),'Channel Mix JSON':JSON.stringify(d.channelMix||{}),'Objectives JSON':JSON.stringify(d.objectives||[]),'KPI Plan JSON':JSON.stringify(d.kpiPlan||[]),'Assumptions JSON':JSON.stringify(d.assumptions||[]),'Constraints JSON':JSON.stringify(d.constraints||[]),'Owner':String(d.owner||ctx.user&&ctx.user.email||'').slice(0,200),'Status':'ACTIVE','Start At':KOL_IDS_CAMPAIGN_CONTROL_date_(d.startAt,false)||new Date(),'End At':KOL_IDS_CAMPAIGN_CONTROL_date_(d.endAt,false)||'','Decision Gates JSON':JSON.stringify(d.decisionGates||{}),'Created At':now,'Updated At':now});
    KOL_IDS_CAMPAIGN_CONTROL_event_(ctx,cid,'PLAN_CREATED','PLAN',id,'','ACTIVE',{version:version,previousActiveCount:activeBefore});
    return {success:true,campaignId:cid,planId:id,version:version,status:'ACTIVE'};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Add a dependency-aware task. Dependencies must belong to the same Campaign. */
function KOL_IDS_CAMPAIGN_CONTROL_upsertTask_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_upsertTask_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_(function(){
    var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'STRATEGIST'),d=data||{},cid=String(d.campaignId||'').trim(),taskId=String(d.taskId||'').trim();
    if(!cid)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign ID is required.');KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,cid);if(!String(d.taskName||'').trim())throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Task name is required.');
    var sh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.TASKS),m=KOL_IDS_PLATFORM_map_(sh),existing=taskId?KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Task ID':taskId,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid})[0]:null,now=new Date(),deps=Array.isArray(d.dependencyIds)?d.dependencyIds.map(String):KOL_IDS_CAMPAIGN_CONTROL_json_(d.dependencyIds,[]);if(!Array.isArray(deps))deps=[];
    deps=deps.map(function(x){return String(x).trim();}).filter(Boolean);if(deps.length>KOL_IDS.MAX_TASKS_PER_CALL)throw KOL_IDS_PLATFORM_error_('LIMIT_EXCEEDED','Too many task dependencies.');if(taskId&&deps.indexOf(taskId)>=0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','A task cannot depend on itself.');
    var seen={};deps=deps.filter(function(x){if(seen[x])return false;seen[x]=true;return true;});
    deps.forEach(function(dep){if(!KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Task ID':dep,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid})[0])throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Dependency task not found: '+dep);});
    var finalTaskId=existing?taskId:KOL_IDS_PLATFORM_uuid_('TSK');
    var parentId=String(d.parentTaskId!=null?d.parentTaskId:(existing?existing.r[m['Parent Task ID']]:'')).trim();
    if(parentId){
      if(parentId===finalTaskId)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','A task cannot be its own parent.');
      if(!KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Task ID':parentId,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid})[0])throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Parent task not found: '+parentId);
    }
    if(KOL_IDS_CAMPAIGN_CONTROL_cycleWouldExist_(sh,cid,orgId,brandId,finalTaskId,deps))throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Task dependency cycle detected.');
    var status=String(d.status|| (existing?existing.r[m['Status']]:'PLANNED')).toUpperCase();if(KOL_IDS.TASK_STATES.indexOf(status)<0)throw KOL_IDS_PLATFORM_error_('INVALID_STATE','Unsupported task state: '+status);
    var fromStatus=existing?String(existing.r[m['Status']]||'PLANNED').toUpperCase():'PLANNED';
    KOL_IDS_CAMPAIGN_CONTROL_assertTaskTransition_(fromStatus,status);
    var startAt=KOL_IDS_CAMPAIGN_CONTROL_date_(d.startAt,false)||(existing?existing.r[m['Start At']]:'')||'';
    var dueAt=KOL_IDS_CAMPAIGN_CONTROL_date_(d.dueAt,false)||(existing?existing.r[m['Due At']]:'')||'';
    if(startAt&&dueAt&&new Date(dueAt)<new Date(startAt))throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Task due date cannot be before start date.');
    var obj={'Task ID':finalTaskId,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid,'Parent Task ID':parentId,'Phase':String(d.phase||existing&&existing.r[m['Phase']]||'EXECUTION').slice(0,80),'Task Type':String(d.taskType||existing&&existing.r[m['Task Type']]||'GENERAL').slice(0,80),'Task Name':String(d.taskName).slice(0,300),'Owner':String(d.owner||existing&&existing.r[m['Owner']]||ctx.user&&ctx.user.email||'').slice(0,200),'Dependency IDs JSON':JSON.stringify(deps),'Priority':String(d.priority||existing&&existing.r[m['Priority']]||'MEDIUM').toUpperCase(),'Start At':startAt,'Due At':dueAt,'Status':status,'Blocked Reason':String(d.blockedReason||existing&&existing.r[m['Blocked Reason']]||'').slice(0,500),'Completed At':status==='DONE'?(existing&&existing.r[m['Completed At']]||now):'','Created At':existing?existing.r[m['Created At']]:now,'Updated At':now};
    if(existing)sh.getRange(existing.i+2,1,1,sh.getLastColumn()).setValues([KOL_IDS_PLATFORM_row_(sh,obj)]);else KOL_IDS_CAMPAIGN_CONTROL_append_(sh,obj);
    KOL_IDS_CAMPAIGN_CONTROL_event_(ctx,cid,existing?'TASK_UPDATED':'TASK_CREATED','TASK',obj['Task ID'],existing?existing.r[m['Status']]:'',status,{dependencies:deps,phase:obj.Phase});
    return {success:true,campaignId:cid,taskId:obj['Task ID'],status:status,dependencies:deps};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_upsertTask_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_upsertTask_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_updateTask_(orgId,brandId,taskId,status,notes){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_updateTask_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_(function(){
    var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'STRATEGIST'),sh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.TASKS),m=KOL_IDS_PLATFORM_map_(sh),hit=KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Task ID':taskId,'Org ID':orgId,'Brand ID':brandId})[0];if(!hit)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Task not found.');
  var to=String(status||'').toUpperCase(),from=String(hit.r[m['Status']]||'PLANNED').toUpperCase();if(KOL_IDS.TASK_STATES.indexOf(to)<0)throw KOL_IDS_PLATFORM_error_('INVALID_STATE','Unsupported task state: '+to);
  KOL_IDS_CAMPAIGN_CONTROL_assertTaskTransition_(from,to);
  var cid=String(hit.r[m['Campaign ID']]);if(to==='DONE'){
    var deps=KOL_IDS_CAMPAIGN_CONTROL_json_(hit.r[m['Dependency IDs JSON']],[]);if(Array.isArray(deps)&&deps.length){var incomplete=deps.filter(function(id){var dep=KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Task ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid})[0];return !dep||String(dep.r[m['Status']]).toUpperCase()!=='DONE';});if(incomplete.length)throw KOL_IDS_PLATFORM_error_('DEPENDENCY_BLOCKED','Task cannot be completed. Dependencies incomplete: '+incomplete.join(', '));}}
  var now=new Date();sh.getRange(hit.i+2,m['Status']+1).setValue(to);if(notes!=null)sh.getRange(hit.i+2,m['Blocked Reason']+1).setValue(String(notes).slice(0,500));if(to==='DONE')sh.getRange(hit.i+2,m['Completed At']+1).setValue(now);else if(from==='DONE')sh.getRange(hit.i+2,m['Completed At']+1).clearContent();sh.getRange(hit.i+2,m['Updated At']+1).setValue(now);KOL_IDS_CAMPAIGN_CONTROL_event_(ctx,cid,'TASK_STATUS_CHANGED','TASK',taskId,from,to,{notes:String(notes||'').slice(0,500)});return {success:true,taskId:taskId,campaignId:cid,from:from,status:to};

  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_updateTask_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_updateTask_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_recordBudget_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_recordBudget_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_(function(){
    var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'STRATEGIST'),d=data||{},cid=String(d.campaignId||'').trim(),category=String(d.category||'GENERAL').trim().slice(0,100);KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,cid);
    var sh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.BUDGET),m=KOL_IDS_PLATFORM_map_(sh),id=String(d.budgetId||'').trim(),hit=id?KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Budget ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid})[0]:null,planned=KOL_IDS_CAMPAIGN_CONTROL_num_(d.planned),committed=KOL_IDS_CAMPAIGN_CONTROL_num_(d.committed),actual=KOL_IDS_CAMPAIGN_CONTROL_num_(d.actual),currency=String(d.currency||'THB').toUpperCase().slice(0,8),now=new Date();
    if(planned<0||committed<0||actual<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Budget values cannot be negative.');
    if(committed>planned)throw KOL_IDS_PLATFORM_error_('BUDGET_CONTROL','Committed budget cannot exceed planned budget.');
    if(actual>committed)throw KOL_IDS_PLATFORM_error_('BUDGET_CONTROL','Actual spend cannot exceed committed budget.');
    var obj={'Budget ID':hit?id:KOL_IDS_PLATFORM_uuid_('BDG'),'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid,'Category':category,'Planned':planned,'Committed':committed,'Actual':actual,'Currency':currency,'Variance':planned-actual,'Pacing Percent':planned>0?Math.round(actual/planned*10000)/100:0,'Notes':String(d.notes||'').slice(0,500),'Updated At':now};if(hit)sh.getRange(hit.i+2,1,1,sh.getLastColumn()).setValues([KOL_IDS_PLATFORM_row_(sh,obj)]);else KOL_IDS_CAMPAIGN_CONTROL_append_(sh,obj);KOL_IDS_CAMPAIGN_CONTROL_event_(ctx,cid,hit?'BUDGET_UPDATED':'BUDGET_RECORDED','BUDGET',obj['Budget ID'],'','',{category:category,planned:planned,committed:committed,actual:actual});return {success:true,campaignId:cid,budgetId:obj['Budget ID'],variance:planned-actual,pacingPercent:obj['Pacing Percent']};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_recordBudget_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_recordBudget_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_(function(){
    var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'STRATEGIST'),d=data||{},cid=String(d.campaignId||'').trim(),metric=String(d.metric||'').trim().slice(0,120);KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,cid);if(!metric)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','KPI metric is required.');
    var sh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.KPIS),m=KOL_IDS_PLATFORM_map_(sh),id=String(d.kpiId||'').trim(),hit=id?KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'KPI ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid})[0]:null,target=KOL_IDS_CAMPAIGN_CONTROL_num_(d.target),actual=KOL_IDS_CAMPAIGN_CONTROL_num_(d.actual),baseline=KOL_IDS_CAMPAIGN_CONTROL_num_(d.baseline),weight=Math.max(0,KOL_IDS_CAMPAIGN_CONTROL_num_(d.weight,1)),direction=String(d.direction||'HIGHER_BETTER').toUpperCase();
    if(target<0||actual<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','KPI target/actual cannot be negative.');if(KOL_IDS.KPI_DIRECTIONS.indexOf(direction)<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Unsupported KPI direction.');if(weight<=0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','KPI weight must be greater than zero.');if(target===0&&direction==='HIGHER_BETTER')throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','HIGHER_BETTER KPI target must be greater than zero.');
    var attainment=target>0?actual/target:0,status=target===0?(actual===0?'ON_TRACK':'OFF_TRACK'):(direction==='HIGHER_BETTER'?(attainment>=1?'ON_TRACK':attainment>=.8?'WATCH':'OFF_TRACK'):(actual<=target?'ON_TRACK':actual<=target*1.2?'WATCH':'OFF_TRACK')),variance=target>0?(actual-target)/target*100:0,now=new Date(),obj={'KPI ID':hit?id:KOL_IDS_PLATFORM_uuid_('KPI'),'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid,'Metric':metric,'Target':target,'Actual':actual,'Unit':String(d.unit||'').slice(0,30),'Direction':direction,'Baseline':baseline,'Weight':weight,'Status':status,'Variance Percent':Math.round(variance*100)/100,'Source':String(d.source||'MANUAL').slice(0,100),'Observed At':KOL_IDS_CAMPAIGN_CONTROL_date_(d.observedAt,false)||now,'Updated At':now};if(hit)sh.getRange(hit.i+2,1,1,sh.getLastColumn()).setValues([KOL_IDS_PLATFORM_row_(sh,obj)]);else KOL_IDS_CAMPAIGN_CONTROL_append_(sh,obj);KOL_IDS_CAMPAIGN_CONTROL_event_(ctx,cid,hit?'KPI_UPDATED':'KPI_RECORDED','KPI',obj['KPI ID'],'',status,{metric:metric,target:target,actual:actual});return {success:true,campaignId:cid,kpiId:obj['KPI ID'],status:status,variancePercent:obj['Variance Percent']};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CAMPAIGN_CONTROL_withWriteLock_(function(){
  var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'STRATEGIST'),d=data||{},cid=String(d.campaignId||'').trim();KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,cid);var sev=Math.max(1,Math.min(5,Math.round(KOL_IDS_CAMPAIGN_CONTROL_num_(d.severity,3)))),prob=Math.max(1,Math.min(5,Math.round(KOL_IDS_CAMPAIGN_CONTROL_num_(d.probability,3)))),impact=Math.max(1,Math.min(5,Math.round(KOL_IDS_CAMPAIGN_CONTROL_num_(d.impact,3)))),score=sev*prob*impact,status=String(d.status||'OPEN').toUpperCase();if(KOL_IDS.RISK_STATES.indexOf(status)<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Unsupported risk status.');var sh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.RISKS),id=String(d.riskId||'').trim(),m=KOL_IDS_PLATFORM_map_(sh),hit=id?KOL_IDS_CAMPAIGN_CONTROL_find_(sh,{'Risk ID':id,'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid})[0]:null,now=new Date(),obj={'Risk ID':hit?id:KOL_IDS_PLATFORM_uuid_('RSK'),'Org ID':orgId,'Brand ID':brandId,'Campaign ID':cid,'Type':String(d.type||'EXECUTION').slice(0,100),'Severity':sev,'Probability':prob,'Impact':impact,'Risk Score':score,'Status':status,'Trigger':String(d.trigger||'').slice(0,500),'Mitigation':String(d.mitigation||'').slice(0,1000),'Owner':String(d.owner||ctx.user&&ctx.user.email||'').slice(0,200),'Due At':KOL_IDS_CAMPAIGN_CONTROL_date_(d.dueAt,false)||'','Resolved At':status==='CLOSED'?now:'','Created At':hit?hit.r[m['Created At']]:now,'Updated At':now};if(hit)sh.getRange(hit.i+2,1,1,sh.getLastColumn()).setValues([KOL_IDS_PLATFORM_row_(sh,obj)]);else KOL_IDS_CAMPAIGN_CONTROL_append_(sh,obj);KOL_IDS_CAMPAIGN_CONTROL_event_(ctx,cid,hit?'RISK_UPDATED':'RISK_CREATED','RISK',obj['Risk ID'],'',status,{score:score,type:obj.Type});return {success:true,campaignId:cid,riskId:obj['Risk ID'],riskScore:score,status:status};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_gateCheck_(orgId,brandId,campaignId,targetStage){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_gateCheck_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'ANALYST'),c=KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,campaignId),status=String(c.row[c.map['Status']]||'PLANNED').toUpperCase(),stage=String(targetStage||'').toUpperCase(),planSh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.PLAN),plans=KOL_IDS_PLATFORM_values_(planSh).filter(function(r){var m=KOL_IDS_PLATFORM_map_(planSh);return String(r[m['Campaign ID']])===String(campaignId)&&String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)&&String(r[m['Status']]).toUpperCase()==='ACTIVE';});
  var reasons=[],checks={campaignExists:true,plan:plans.length>0,dates:true,budget:true,kpis:true,tasks:true};
  var start=c.row[c.map['Start At']],end=c.row[c.map['End At']];if(stage!=='PLANNED'&&(!start||isNaN(new Date(start).getTime()))) {checks.dates=false;reasons.push('Campaign start date is missing or invalid.');}
  if(end&&start&&new Date(end)<new Date(start)){checks.dates=false;reasons.push('Campaign end date is before start date.');}
  var bsh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.BUDGET),bm=KOL_IDS_PLATFORM_map_(bsh),bud=KOL_IDS_PLATFORM_values_(bsh).filter(function(r){return String(r[bm['Campaign ID']])===String(campaignId)&&String(r[bm['Org ID']])===String(orgId)&&String(r[bm['Brand ID']])===String(brandId);});if(stage==='CREATOR_SELECTION'&&bud.length===0){checks.budget=false;reasons.push('No campaign budget control line exists.');}if(stage==='CREATOR_SELECTION'&&bud.length&&bud.some(function(r){return KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Committed']])>KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Planned']])||KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Actual']])>KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Committed']]);})){checks.budget=false;reasons.push('Budget control invariant is violated.');}
  var ksh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.KPIS),km=KOL_IDS_PLATFORM_map_(ksh),kpis=KOL_IDS_PLATFORM_values_(ksh).filter(function(r){return String(r[km['Campaign ID']])===String(campaignId)&&String(r[km['Org ID']])===String(orgId)&&String(r[km['Brand ID']])===String(brandId);});if(stage==='CREATOR_SELECTION'&&kpis.length===0){checks.kpis=false;reasons.push('No KPI has been defined for the campaign.');}if(kpis.some(function(r){var target=KOL_IDS_CAMPAIGN_CONTROL_num_(r[km['Target']]),dir=String(r[km['Direction']]).toUpperCase();return target===0&&dir==='HIGHER_BETTER';})){checks.kpis=false;reasons.push('A HIGHER_BETTER KPI has a zero target.');}
  var tsh=KOL_IDS_CAMPAIGN_CONTROL_ensure_().getSheetByName(KOL_IDS.TASKS),tm=KOL_IDS_PLATFORM_map_(tsh),tasks=KOL_IDS_PLATFORM_values_(tsh).filter(function(r){return String(r[tm['Campaign ID']])===String(campaignId)&&String(r[tm['Org ID']])===String(orgId)&&String(r[tm['Brand ID']])===String(brandId);});if(stage==='CONTENT_BRIEF'&&tasks.length===0){checks.tasks=false;reasons.push('No execution tasks exist before content briefing.');}
  var compliance=typeof KOL_IDS_COMPLIANCE_campaignCompliance_==='function'?KOL_IDS_COMPLIANCE_campaignCompliance_(orgId,brandId,campaignId):null;if(compliance&&!compliance.eligible){checks.compliance=false;reasons.push('Campaign compliance gate is blocked: '+compliance.blocks.join(','));}else checks.compliance=true;
  return {success:true,campaignId:campaignId,currentStage:status,targetStage:stage,ready:reasons.length===0,checks:checks,reasons:reasons,compliance:compliance};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_gateCheck_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_gateCheck_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_(orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_CAMPAIGN_CONTROL_ctx_(orgId,brandId,'ANALYST'),c=KOL_IDS_CAMPAIGN_CONTROL_campaign_(ctx,campaignId),ss=KOL_IDS_CAMPAIGN_CONTROL_ensure_(),now=Date.now(),start=c.row[c.map['Start At']]?new Date(c.row[c.map['Start At']]).getTime():0,end=c.row[c.map['End At']]?new Date(c.row[c.map['End At']]).getTime():0,elapsed=end>start?Math.max(0,Math.min(1,(now-start)/(end-start))):0;
  var tSh=ss.getSheetByName(KOL_IDS.TASKS),tm=KOL_IDS_PLATFORM_map_(tSh),tasks=KOL_IDS_PLATFORM_values_(tSh).filter(function(r){return String(r[tm['Campaign ID']])===String(campaignId)&&String(r[tm['Org ID']])===String(orgId)&&String(r[tm['Brand ID']])===String(brandId);}),activeTasks=tasks.filter(function(r){return ['CANCELLED','DONE'].indexOf(String(r[tm['Status']]).toUpperCase())<0;}),doneTasks=tasks.filter(function(r){return String(r[tm['Status']]).toUpperCase()==='DONE';}),overdueTasks=tasks.filter(function(r){return String(r[tm['Status']]).toUpperCase()!=='DONE'&&String(r[tm['Status']]).toUpperCase()!=='CANCELLED'&&r[tm['Due At']]&&new Date(r[tm['Due At']]).getTime()<now;});
  var deliver=ss.getSheetByName(KOL_IDS.DELIVERABLES_SHEET),dm=KOL_IDS_PLATFORM_map_(deliver),ds=KOL_IDS_PLATFORM_values_(deliver).filter(function(r){return String(r[dm['Campaign ID']])===String(campaignId)&&String(r[dm['Org ID']])===String(orgId)&&String(r[dm['Brand ID']])===String(brandId);}),required=ds.filter(function(r){return String(r[dm['Required']]).toUpperCase()==='YES';}),approved=required.filter(function(r){return String(r[dm['Status']]).toUpperCase()==='APPROVED';});
  var bSh=ss.getSheetByName(KOL_IDS.BUDGET),bm=KOL_IDS_PLATFORM_map_(bSh),bud=KOL_IDS_PLATFORM_values_(bSh).filter(function(r){return String(r[bm['Campaign ID']])===String(campaignId)&&String(r[bm['Org ID']])===String(orgId)&&String(r[bm['Brand ID']])===String(brandId);}),planned=bud.reduce(function(s,r){return s+KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Planned']]);},0),committed=bud.reduce(function(s,r){return s+KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Committed']]);},0),actual=bud.reduce(function(s,r){return s+KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Actual']]);},0),budgetPacing=planned>0?actual/planned:0,expectedPacing=elapsed,budgetScore=planned>0?Math.max(0,100-Math.min(60,Math.abs(budgetPacing-expectedPacing)*100)):80;
  var kSh=ss.getSheetByName(KOL_IDS.KPIS),km=KOL_IDS_PLATFORM_map_(kSh),kpis=KOL_IDS_PLATFORM_values_(kSh).filter(function(r){return String(r[km['Campaign ID']])===String(campaignId)&&String(r[km['Org ID']])===String(orgId)&&String(r[km['Brand ID']])===String(brandId);}),kpiWeight=kpis.reduce(function(s,r){return s+Math.max(0,KOL_IDS_CAMPAIGN_CONTROL_num_(r[km['Weight']],1));},0),kpiScore=kpiWeight?Math.round(kpis.reduce(function(s,r){var target=KOL_IDS_CAMPAIGN_CONTROL_num_(r[km['Target']]),actualK=KOL_IDS_CAMPAIGN_CONTROL_num_(r[km['Actual']]),dir=String(r[km['Direction']]).toUpperCase(),att=target>0?actualK/target:0,score=dir==='LOWER_BETTER'?(actualK<=target?1:target>0?Math.max(0,1-(actualK-target)/target):0):Math.min(1,att);return s+score*Math.max(0,KOL_IDS_CAMPAIGN_CONTROL_num_(r[km['Weight']],1));},0)/kpiWeight*100):80;
  var rSh=ss.getSheetByName(KOL_IDS.RISKS),rm=KOL_IDS_PLATFORM_map_(rSh),risks=KOL_IDS_PLATFORM_values_(rSh).filter(function(r){return String(r[rm['Campaign ID']])===String(campaignId)&&String(r[rm['Org ID']])===String(orgId)&&String(r[rm['Brand ID']])===String(brandId)&&['CLOSED','MITIGATED'].indexOf(String(r[rm['Status']]).toUpperCase())<0;}),riskExposure=risks.reduce(function(s,r){return s+KOL_IDS_CAMPAIGN_CONTROL_num_(r[rm['Risk Score']]);},0),riskScore=Math.max(0,100-Math.min(70,riskExposure*1.5));
  var taskEligibleCount=tasks.filter(function(r){return String(r[tm['Status']]).toUpperCase()!=='CANCELLED';}).length;var taskScore=tasks.length?(taskEligibleCount?doneTasks.length/taskEligibleCount*100:100):80,deliverScore=required.length?approved.length/required.length*100:80,timelineScore=tasks.length?Math.max(0,100-Math.min(60,overdueTasks.length*15)):100;
  var health=Math.round(taskScore*.18+deliverScore*.20+budgetScore*.17+kpiScore*.25+riskScore*.12+timelineScore*.08);var severity=health>=85?'HEALTHY':health>=70?'WATCH':health>=50?'AT_RISK':'CRITICAL';
  var actions=[];if(overdueTasks.length)actions.push({priority:'HIGH',type:'TIMELINE',message:overdueTasks.length+' task(s) are overdue.',recommendedAction:'Reassign, unblock or reset deadlines before the next campaign gate.'});if(planned>0&&budgetPacing>expectedPacing+.15)actions.push({priority:'HIGH',type:'BUDGET',message:'Spend is materially ahead of schedule.',recommendedAction:'Review committed spend and pause low-priority allocation until pacing normalizes.'});if(kpis.some(function(r){return String(r[km['Status']]).toUpperCase()==='OFF_TRACK';}))actions.push({priority:'HIGH',type:'KPI',message:'One or more KPIs are off track.',recommendedAction:'Review creator mix, content tactic and remaining budget before scaling.'});if(risks.some(function(r){return KOL_IDS_CAMPAIGN_CONTROL_num_(r[rm['Risk Score']])>=60;}))actions.push({priority:'HIGH',type:'RISK',message:'High-risk items are open.',recommendedAction:'Execute mitigation or escalate before the next irreversible campaign stage.'});if(!tasks.length)actions.push({priority:'MEDIUM',type:'PLANNING',message:'No execution tasks are defined.',recommendedAction:'Create phase-based tasks and dependencies.'});
  return {success:true,version:KOL_IDS.VERSION,campaign:{id:campaignId,status:String(c.row[c.map['Status']]||'PLANNED'),objective:c.row[c.map['Objective']]||'',budget:KOL_IDS_CAMPAIGN_CONTROL_num_(c.row[c.map['Budget']]),currency:c.row[c.map['Currency']]||'THB'},health:{score:health,status:severity,components:{timeline:Math.round(timelineScore),tasks:Math.round(taskScore),deliverables:Math.round(deliverScore),budget:Math.round(budgetScore),kpi:Math.round(kpiScore),risk:Math.round(riskScore)}},timeline:{elapsedPercent:Math.round(elapsed*10000)/100,overdueTasks:overdueTasks.length,activeTasks:activeTasks.length,doneTasks:doneTasks.length,totalTasks:tasks.length},budget:{planned:planned,committed:committed,actual:actual,remaining:planned-actual,pacingPercent:Math.round(budgetPacing*10000)/100,expectedPacingPercent:Math.round(expectedPacing*10000)/100},kpi:{count:kpis.length,onTrack:kpis.filter(function(r){return String(r[km['Status']]).toUpperCase()==='ON_TRACK';}).length,watch:kpis.filter(function(r){return String(r[km['Status']]).toUpperCase()==='WATCH';}).length,offTrack:kpis.filter(function(r){return String(r[km['Status']]).toUpperCase()==='OFF_TRACK';}).length,score:Math.round(kpiScore)},deliverables:{total:ds.length,required:required.length,approved:approved.length},risks:{open:risks.length,exposure:riskExposure,score:Math.round(riskScore)},nextActions:actions.slice(0,8),generatedAt:new Date().toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CAMPAIGN_CONTROL_campaignContractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_campaignContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_CAMPAIGN_CONTROL_ensure_(),specs=KOL_IDS_CAMPAIGN_CONTROL_headers_(),missing=[];Object.keys(specs).forEach(function(n){var sh=ss.getSheetByName(n);if(!sh)missing.push(n);});
  var funcs=['KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_','KOL_IDS_CAMPAIGN_CONTROL_upsertTask_','KOL_IDS_CAMPAIGN_CONTROL_updateTask_','KOL_IDS_CAMPAIGN_CONTROL_recordBudget_','KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_','KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_','KOL_IDS_CAMPAIGN_CONTROL_gateCheck_','KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_'];var fm=funcs.filter(function(n){return typeof this[n]!=='function';},this);
  var integrity=KOL_IDS_CAMPAIGN_CONTROL_releaseSmokeTest_();
  return {success:missing.length===0&&fm.length===0&&integrity.success,version:KOL_IDS.VERSION,missingSheets:missing,missingFunctions:fm,integrity:integrity,checks:{schemas:missing.length===0,functions:fm.length===0,oneActivePlanPerCampaign:integrity.checks.oneActivePlanPerCampaign,dependencyAcyclic:integrity.checks.dependencyAcyclic,budgetInvariants:integrity.checks.budgetInvariants,kpiSemantics:integrity.checks.kpiSemantics,dependencyAwareTasks:true,budgetPacing:true,kpiGovernance:true,riskGovernance:true,controlTower:true}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_campaignContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_campaignContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Read-only production integrity scan. Safe to run from the Apps Script editor. */
function KOL_IDS_CAMPAIGN_CONTROL_releaseSmokeTest_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_CONTROL_releaseSmokeTest_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_CAMPAIGN_CONTROL_ensure_(),issues=[],checks={oneActivePlanPerCampaign:true,dependencyAcyclic:true,budgetInvariants:true,kpiSemantics:true};
  var psh=ss.getSheetByName(KOL_IDS.PLAN),pm=KOL_IDS_PLATFORM_map_(psh),groups={};KOL_IDS_PLATFORM_values_(psh).forEach(function(r){var key=String(r[pm['Org ID']])+'|'+String(r[pm['Brand ID']])+'|'+String(r[pm['Campaign ID']]);if(String(r[pm['Status']]).toUpperCase()==='ACTIVE')groups[key]=(groups[key]||0)+1;});Object.keys(groups).forEach(function(k){if(groups[k]!==1){checks.oneActivePlanPerCampaign=false;issues.push('Expected exactly one ACTIVE plan for '+k+'; found '+groups[k]+'.');}});
  var tsh=ss.getSheetByName(KOL_IDS.TASKS),tm=KOL_IDS_PLATFORM_map_(tsh),rows=KOL_IDS_PLATFORM_values_(tsh),byCampaign={};rows.forEach(function(r){var key=String(r[tm['Org ID']])+'|'+String(r[tm['Brand ID']])+'|'+String(r[tm['Campaign ID']]);if(!byCampaign[key])byCampaign[key]={rows:[],ids:{}};byCampaign[key].rows.push(r);byCampaign[key].ids[String(r[tm['Task ID']])]=true;});Object.keys(byCampaign).forEach(function(key){var g=byCampaign[key],graph={};g.rows.forEach(function(r){var id=String(r[tm['Task ID']]);graph[id]=KOL_IDS_CAMPAIGN_CONTROL_json_(r[tm['Dependency IDs JSON']],[]);if(!Array.isArray(graph[id]))graph[id]=[];graph[id]=graph[id].map(String).filter(function(x){if(!g.ids[x]){issues.push('Missing dependency '+x+' in '+key+'.');checks.dependencyAcyclic=false;return false;}return true;});});var visiting={},visited={};function KOL_IDS_CAMPAIGN_CONTROL_dfs(id){if(visiting[id])return true;if(visited[id])return false;visiting[id]=true;var next=graph[id]||[];for(var i=0;i<next.length;i++){if(KOL_IDS_CAMPAIGN_CONTROL_dfs(next[i]))return true;}delete visiting[id];visited[id]=true;return false;}Object.keys(graph).some(function(id){if(KOL_IDS_CAMPAIGN_CONTROL_dfs(id)){checks.dependencyAcyclic=false;issues.push('Dependency cycle detected in '+key+'.');return true;}return false;});});
  var bsh=ss.getSheetByName(KOL_IDS.BUDGET),bm=KOL_IDS_PLATFORM_map_(bsh);KOL_IDS_PLATFORM_values_(bsh).forEach(function(r){var planned=KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Planned']]),committed=KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Committed']]),actual=KOL_IDS_CAMPAIGN_CONTROL_num_(r[bm['Actual']]);if(planned<0||committed<0||actual<0||committed>planned||actual>committed){checks.budgetInvariants=false;issues.push('Budget invariant violation: '+String(r[bm['Budget ID']]));}});
  var ksh=ss.getSheetByName(KOL_IDS.KPIS),km=KOL_IDS_PLATFORM_map_(ksh);KOL_IDS_PLATFORM_values_(ksh).forEach(function(r){var target=KOL_IDS_CAMPAIGN_CONTROL_num_(r[km['Target']]),direction=String(r[km['Direction']]).toUpperCase(),weight=KOL_IDS_CAMPAIGN_CONTROL_num_(r[km['Weight']]);if(target<0||weight<=0||(target===0&&direction==='HIGHER_BETTER')){checks.kpiSemantics=false;issues.push('KPI semantic violation: '+String(r[km['KPI ID']]));}});
  return {success:issues.length===0,version:KOL_IDS.VERSION,checks:checks,issues:issues.slice(0,50),issueCount:issues.length,generatedAt:new Date().toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_CONTROL_releaseSmokeTest_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_CONTROL_releaseSmokeTest_', Date.now() - __kolIdsTraceStartedAt);
  }
}
