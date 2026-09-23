/**
 * KOL IDS — Automated retention enforcement and campaign compliance.
 *
 * This control intentionally clears governed row data rather than deleting sheet
 * rows.  That preserves sheet/table shape and makes an execution auditable while
 * preventing an expired record from remaining readable in its source entity.
 * It is an engineering control; retention schedules and legal holds still need
 * customer counsel/DPO ownership.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, { MAX_PER_RUN:100, MAX_RETRIES:5, TRIGGER_HANDLER:'KOL_IDS_COMPLIANCE_retentionScheduledRun_',
  SHEETS:{HOLDS:'ENT_LEGAL_HOLDS',EXCEPTIONS:'ENT_RETENTION_EXCEPTIONS',JOBS:'ENT_RETENTION_JOBS',ACTIONS:'ENT_RETENTION_ACTIONS',ARCHIVE:'ENT_RETENTION_ARCHIVE'},
  SAFE_ENTITIES:['ENT_CREATOR_DATA','ENT_OUTCOMES','ENT_RECOMMENDATIONS','ENT_MATCH_DECISIONS','ENT_CREATOR_MARKETPLACE','ENT_DISCOVERY_EVENTS'],
  ACTIVE_STATES:['ACTIVE','OPEN','PENDING','IN_PROGRESS','PROCESSING','DRAFT','PLANNED','TRACKING','RECONCILIATION']
});

function KOL_IDS_COMPLIANCE_headers_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return {
  ENT_LEGAL_HOLDS:['Hold ID','Org ID','Brand ID','Entity Type','Record ID','Reason','Status','Effective At','Released At','Created At','Updated At'],
  ENT_RETENTION_EXCEPTIONS:['Exception ID','Org ID','Brand ID','Entity Type','Record ID','Reason','Status','Expires At','Created At','Updated At'],
  ENT_RETENTION_JOBS:['Job ID','Run Key','Mode','Status','Started At','Completed At','Candidates','Executed','Skipped','Failed','Retry Count','Last Error','Created At','Updated At'],
  ENT_RETENTION_ACTIONS:['Action ID','Action Key','Job ID','Org ID','Brand ID','Policy ID','Entity Type','Record Ref Hash','Action','Status','Reason','Attempt','Occurred At','Details JSON'],
  ENT_RETENTION_ARCHIVE:['Archive ID','Action Key','Org ID','Brand ID','Entity Type','Record Ref Hash','Policy ID','Archived At','Snapshot Hash','Headers JSON']
};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_ensure_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ss=KOL_IDS_GOVERNANCE_govEnsure_(),h=KOL_IDS_COMPLIANCE_headers_();Object.keys(h).forEach(function(n){KOL_IDS_PLATFORM_ensureSheet_(ss,n,h[n]);});return ss;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_text_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_text_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(v==null?'':v).trim();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_text_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_text_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_hash_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(v)).map(function(b){var n=(b+256)%256;return(n<16?'0':'')+n.toString(16);}).join('');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_append_(name,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_append_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sh=KOL_IDS_COMPLIANCE_ensure_().getSheetByName(name),r=KOL_IDS_PLATFORM_row_(sh,obj);sh.getRange(sh.getLastRow()+1,1,1,r.length).setValues([r]);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_append_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_append_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_rows_(name){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sh=KOL_IDS_COMPLIANCE_ensure_().getSheetByName(name);return {sh:sh,map:KOL_IDS_PLATFORM_map_(sh),rows:KOL_IDS_PLATFORM_values_(sh)};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_active_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_active_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS.ACTIVE_STATES.indexOf(KOL_IDS_COMPLIANCE_text_(v).toUpperCase())>=0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_active_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_active_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_entityNames_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_entityNames_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_COMPLIANCE_text_(v).split(/[;,]/).map(function(x){return x.trim().toUpperCase();}).filter(function(x){return KOL_IDS.SAFE_ENTITIES.indexOf(x)>=0;});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_entityNames_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_entityNames_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_idHeader_(m){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_idHeader_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var preferred=['Record ID','Outcome ID','Recommendation ID','Match ID','Marketplace ID','Event ID'];for(var i=0;i<preferred.length;i++)if(m[preferred[i]]!=null)return preferred[i];return Object.keys(m).filter(function(k){return / ID$/.test(k)&&k!=='Org ID'&&k!=='Brand ID'&&k!=='Campaign ID';})[0]||'';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_idHeader_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_idHeader_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_anchor_(row,m){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_anchor_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var keys=['End At','Observed At','Updated At','Created At','Recommended At','Generated At'];for(var i=0;i<keys.length;i++){var v=row[m[keys[i]]];if(v&&isFinite(new Date(v).getTime()))return new Date(v);}return null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_anchor_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_anchor_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_legalHold_(orgId,brandId,entity,id){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_legalHold_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_COMPLIANCE_rows_(KOL_IDS.SHEETS.HOLDS);return x.rows.some(function(r){return String(r[x.map['Org ID']])===String(orgId)&&String(r[x.map['Brand ID']])===String(brandId)&&String(r[x.map['Entity Type']]).toUpperCase()===entity&&String(r[x.map['Record ID']])===String(id)&&KOL_IDS_COMPLIANCE_active_(r[x.map['Status']]);});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_legalHold_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_legalHold_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_exception_(orgId,brandId,entity,id){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_exception_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_COMPLIANCE_rows_(KOL_IDS.SHEETS.EXCEPTIONS),now=Date.now();return x.rows.some(function(r){var expiry=r[x.map['Expires At']]?new Date(r[x.map['Expires At']]).getTime():0;return String(r[x.map['Org ID']])===String(orgId)&&String(r[x.map['Brand ID']])===String(brandId)&&String(r[x.map['Entity Type']]).toUpperCase()===entity&&(String(r[x.map['Record ID']])===String(id)||String(r[x.map['Record ID']])==='*')&&KOL_IDS_COMPLIANCE_active_(r[x.map['Status']])&&(!expiry||expiry>now);});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_exception_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_exception_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_campaignActive_(orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_campaignActive_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!campaignId)return false;try{var sh=KOL_IDS_SYSTEM_getSpreadsheet_().getSheetByName(KOL_IDS.SHEETS.CAMPAIGNS),m=KOL_IDS_PLATFORM_map_(sh),r=KOL_IDS_PLATFORM_values_(sh).filter(function(x){return String(x[m['Org ID']])===String(orgId)&&String(x[m['Brand ID']])===String(brandId)&&String(x[m['Campaign ID']])===String(campaignId);})[0];return !!r&&['COMPLETED','CANCELLED'].indexOf(String(r[m['Status']]||'').toUpperCase())<0;}catch(e){return false;}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_campaignActive_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_campaignActive_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_actionExists_(key){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_actionExists_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_COMPLIANCE_rows_(KOL_IDS.SHEETS.ACTIONS);return x.rows.some(function(r){return String(r[x.map['Action Key']])===key&&String(r[x.map['Status']]).toUpperCase()==='COMPLETED';});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_actionExists_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_actionExists_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_actionAttempts_(key){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_actionAttempts_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_COMPLIANCE_rows_(KOL_IDS.SHEETS.ACTIONS);return x.rows.filter(function(r){return String(r[x.map['Action Key']])===key;}).length;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_actionAttempts_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_actionAttempts_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_action_(obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_action_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
KOL_IDS_COMPLIANCE_append_(KOL_IDS.SHEETS.ACTIONS,obj);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_action_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_action_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_policies_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_policies_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_COMPLIANCE_rows_(KOL_IDS_GOVERNANCE_GOV.SHEETS.RETENTION);return x.rows.filter(function(r){return String(r[x.map['Org ID']])===String(orgId)&&String(r[x.map['Brand ID']])===String(brandId)&&String(r[x.map['Status']]).toUpperCase()==='ACTIVE';}).map(function(r){return {id:String(r[x.map['Retention Policy ID']]),entities:KOL_IDS_COMPLIANCE_entityNames_(r[x.map['Entity Types']]),days:Number(r[x.map['Retention Days']]),method:String(r[x.map['Deletion Method']]||'DELETE').toUpperCase()};}).filter(function(p){return p.entities.length&&isFinite(p.days)&&p.days>0;});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_policies_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_policies_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_candidates_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_candidates_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var now=Date.now(),out=[];KOL_IDS_COMPLIANCE_policies_(orgId,brandId).forEach(function(policy){policy.entities.forEach(function(entity){var sh=KOL_IDS_SYSTEM_getSpreadsheet_().getSheetByName(entity);if(!sh)return;var m=KOL_IDS_PLATFORM_map_(sh),idHeader=KOL_IDS_COMPLIANCE_idHeader_(m);if(!idHeader||m['Org ID']==null||m['Brand ID']==null)return;KOL_IDS_PLATFORM_values_(sh).forEach(function(r,i){if(String(r[m['Org ID']])!==String(orgId)||String(r[m['Brand ID']])!==String(brandId))return;var id=KOL_IDS_COMPLIANCE_text_(r[m[idHeader]]),anchor=KOL_IDS_COMPLIANCE_anchor_(r,m);if(!id||!anchor||now-anchor.getTime()<policy.days*86400000)return;out.push({policy:policy,entity:entity,sh:sh,m:m,row:r,rowNumber:i+2,id:id,idHeader:idHeader,anchor:anchor});});});});return out;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_candidates_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_candidates_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_eligibility_(c){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_eligibility_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(KOL_IDS_COMPLIANCE_legalHold_(c.orgId,c.brandId,c.entity,c.id))return {eligible:false,reason:'LEGAL_HOLD'};if(KOL_IDS_COMPLIANCE_exception_(c.orgId,c.brandId,c.entity,c.id))return {eligible:false,reason:'RETENTION_EXCEPTION'};if(c.m['Status']!=null&&KOL_IDS_COMPLIANCE_active_(c.row[c.m['Status']]))return {eligible:false,reason:'ACTIVE_PROCESSING'};if(c.m['Campaign ID']!=null&&KOL_IDS_COMPLIANCE_campaignActive_(c.orgId,c.brandId,c.row[c.m['Campaign ID']]))return {eligible:false,reason:'ACTIVE_CAMPAIGN_PROCESSING'};return {eligible:true};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_eligibility_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_eligibility_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_execute_(c,jobId,dryRun){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_execute_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ref=KOL_IDS_COMPLIANCE_hash_(c.orgId+'|'+c.brandId+'|'+c.entity+'|'+c.id),key=KOL_IDS_COMPLIANCE_hash_(c.policy.id+'|'+c.entity+'|'+ref),attempt=KOL_IDS_COMPLIANCE_actionAttempts_(key)+1,base={"Action ID":KOL_IDS_PLATFORM_uuid_('RTA'),"Action Key":key,"Job ID":jobId,"Org ID":c.orgId,"Brand ID":c.brandId,"Policy ID":c.policy.id,"Entity Type":c.entity,"Record Ref Hash":ref,"Action":c.policy.method,"Attempt":attempt,"Occurred At":new Date()};if(KOL_IDS_COMPLIANCE_actionExists_(key))return {state:'SKIPPED',reason:'IDEMPOTENT_REPLAY'};if(attempt>KOL_IDS.MAX_RETRIES){KOL_IDS_COMPLIANCE_action_(Object.assign(base,{Status:'RETRY_EXHAUSTED',Reason:'MAX_RETRIES','Details JSON':'{}'}));return {state:'FAILED',reason:'MAX_RETRIES'};}var e=KOL_IDS_COMPLIANCE_eligibility_(c);if(!e.eligible){KOL_IDS_COMPLIANCE_action_(Object.assign(base,{Status:'SKIPPED',Reason:e.reason,'Details JSON':'{}'}));return {state:'SKIPPED',reason:e.reason};}if(dryRun){KOL_IDS_COMPLIANCE_action_(Object.assign(base,{Status:'DRY_RUN',Reason:'ELIGIBLE','Details JSON':JSON.stringify({anchor:c.anchor.toISOString()})}));return {state:'DRY_RUN'};}try{var snapshot=JSON.stringify(c.row);if(c.policy.method.indexOf('ARCHIVE')>=0)KOL_IDS_COMPLIANCE_append_(KOL_IDS.SHEETS.ARCHIVE,{"Archive ID":KOL_IDS_PLATFORM_uuid_('ARC'),"Action Key":key,"Org ID":c.orgId,"Brand ID":c.brandId,"Entity Type":c.entity,"Record Ref Hash":ref,"Policy ID":c.policy.id,"Archived At":new Date(),"Snapshot Hash":KOL_IDS_COMPLIANCE_hash_(snapshot),"Headers JSON":JSON.stringify(c.sh.getRange(1,1,1,c.sh.getLastColumn()).getValues()[0])});c.sh.getRange(c.rowNumber,1,1,c.sh.getLastColumn()).clearContent();KOL_IDS_COMPLIANCE_action_(Object.assign(base,{Status:'COMPLETED',Reason:'RETENTION_EXPIRED','Details JSON':JSON.stringify({anchor:c.anchor.toISOString(),cleared:true})}));return {state:'EXECUTED'};}catch(err){KOL_IDS_COMPLIANCE_action_(Object.assign(base,{Status:'RETRY_PENDING',Reason:'EXECUTION_ERROR','Details JSON':JSON.stringify({error:String(err&&err.message||err)})}));return {state:'FAILED',error:String(err&&err.message||err)};}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_execute_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_execute_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_retentionRun_(options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_retentionRun_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var o=options||{},dry=!!o.dryRun,max=Math.max(1,Math.min(Number(o.maxItems)||KOL_IDS.MAX_PER_RUN,KOL_IDS.MAX_PER_RUN)),lock=LockService.getScriptLock();if(!lock.tryLock(5000))return {success:false,code:'LOCKED',message:'Retention job already running.'};try{KOL_IDS_COMPLIANCE_ensure_();var jobId=KOL_IDS_PLATFORM_uuid_('RTJ'),job={"Job ID":jobId,"Run Key":KOL_IDS_COMPLIANCE_hash_((dry?'DRY':'LIVE')+'|'+Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy-MM-dd-HH')),"Mode":dry?'DRY_RUN':'LIVE',"Status":'RUNNING',"Started At":new Date(),"Completed At":'',"Candidates":0,"Executed":0,"Skipped":0,"Failed":0,"Retry Count":0,"Last Error":'',"Created At":new Date(),"Updated At":new Date()};KOL_IDS_COMPLIANCE_append_(KOL_IDS.SHEETS.JOBS,job);var candidates=[];var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),cfg=ss.getSheetByName(KOL_IDS_GOVERNANCE_GOV.SHEETS.CONFIG),cm=KOL_IDS_PLATFORM_map_(cfg);KOL_IDS_PLATFORM_values_(cfg).filter(function(r){return String(r[cm['Status']]).toUpperCase()==='ACTIVE'&&(!o.orgId||String(r[cm['Org ID']])===String(o.orgId))&&(!o.brandId||String(r[cm['Brand ID']])===String(o.brandId));}).forEach(function(r){candidates=candidates.concat(KOL_IDS_COMPLIANCE_candidates_(r[cm['Org ID']],r[cm['Brand ID']]));});job.Candidates=candidates.length;var res={executed:0,skipped:0,failed:0,dryRun:0};candidates.slice(0,max).forEach(function(c){c.orgId=String(c.row[c.m['Org ID']]);c.brandId=String(c.row[c.m['Brand ID']]);var z=KOL_IDS_COMPLIANCE_execute_(c,jobId,dry);if(z.state==='EXECUTED')res.executed++;else if(z.state==='FAILED')res.failed++;else if(z.state==='DRY_RUN')res.dryRun++;else res.skipped++;});job.Executed=res.executed;job.Skipped=res.skipped;job.Failed=res.failed;job.Status=res.failed?'COMPLETED_WITH_RETRIES':'COMPLETED';job['Completed At']=new Date();job['Updated At']=new Date();var j=KOL_IDS_COMPLIANCE_rows_(KOL_IDS.SHEETS.JOBS),row=j.rows.findIndex(function(r){return String(r[j.map['Job ID']])===jobId;})+2;j.sh.getRange(row,1,1,j.sh.getLastColumn()).setValues([KOL_IDS_PLATFORM_row_(j.sh,job)]);return {success:res.failed===0,jobId:jobId,mode:job.Mode,candidates:job.Candidates,executed:res.executed,skipped:res.skipped,failed:res.failed,dryRun:res.dryRun,limited:candidates.length>max};}finally{lock.releaseLock();}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_retentionRun_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_retentionRun_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_retentionScheduledRun_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_retentionScheduledRun_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_COMPLIANCE_retentionRun_({dryRun:false,maxItems:KOL_IDS.MAX_PER_RUN});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_retentionScheduledRun_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_retentionScheduledRun_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_installRetentionTrigger_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_installRetentionTrigger_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()===KOL_IDS.TRIGGER_HANDLER;}).forEach(function(t){ScriptApp.deleteTrigger(t);});ScriptApp.newTrigger(KOL_IDS.TRIGGER_HANDLER).timeBased().everyDays(1).atHour(2).create();return {success:true,handler:KOL_IDS.TRIGGER_HANDLER,schedule:'daily around 02:00 project time zone'};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_installRetentionTrigger_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_installRetentionTrigger_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_legalHoldCreate_(orgId,brandId,d){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_legalHoldCreate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var x=d||{},entity=KOL_IDS_COMPLIANCE_text_(x.entityType).toUpperCase();if(KOL_IDS.SAFE_ENTITIES.indexOf(entity)<0)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Unsupported legal-hold entity type.');var id=KOL_IDS_COMPLIANCE_text_(x.recordId);if(!id)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','recordId is required.');var now=new Date(),holdId=KOL_IDS_PLATFORM_uuid_('HOLD');KOL_IDS_COMPLIANCE_append_(KOL_IDS.SHEETS.HOLDS,{"Hold ID":holdId,"Org ID":orgId,"Brand ID":brandId,"Entity Type":entity,"Record ID":id,"Reason":KOL_IDS_GOVERNANCE_govText_(x.reason,500),"Status":'ACTIVE',"Effective At":now,"Released At":'',"Created At":now,"Updated At":now});return {success:true,holdId:holdId,status:'ACTIVE'};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_legalHoldCreate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_legalHoldCreate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_campaignCompliance_(orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_campaignCompliance_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var g=KOL_IDS_GOVERNANCE_governanceStatus_(orgId,brandId),actions=KOL_IDS_COMPLIANCE_rows_(KOL_IDS.SHEETS.ACTIONS),a=actions.rows.filter(function(r){return String(r[actions.map['Org ID']])===String(orgId)&&String(r[actions.map['Brand ID']])===String(brandId);}),blocks=[];if(!g.configured||!g.ready)blocks.push('GOVERNANCE_NOT_READY');if(g.automatedDecisionMode!=='ASSISTIVE_ONLY')blocks.push('AUTOMATION_POLICY');if(a.some(function(r){return String(r[actions.map['Status']]).toUpperCase()==='RETRY_PENDING';}))blocks.push('RETENTION_RETRY_PENDING');var level=blocks.length?'BLOCK':a.some(function(r){return String(r[actions.map['Status']]).toUpperCase()==='SKIPPED';})?'WATCH':'PASS';return {success:true,campaignId:campaignId,level:level,eligible:level!=='BLOCK',blocks:blocks,governance:g,retention:{pendingRetries:a.filter(function(r){return String(r[actions.map['Status']]).toUpperCase()==='RETRY_PENDING';}).length,protectedSkips:a.filter(function(r){return String(r[actions.map['Status']]).toUpperCase()==='SKIPPED';}).length},evaluatedAt:new Date().toISOString()};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_campaignCompliance_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_campaignCompliance_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_requireCampaignCompliance_(orgId,brandId,campaignId,operation){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_requireCampaignCompliance_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var c=KOL_IDS_COMPLIANCE_campaignCompliance_(orgId,brandId,campaignId);if(!c.eligible)throw KOL_IDS_PLATFORM_error_('CAMPAIGN_COMPLIANCE_BLOCKED',String(operation||'operation')+' is blocked: '+c.blocks.join(','));return c;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_requireCampaignCompliance_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_requireCampaignCompliance_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_retentionContractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_retentionContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var h=KOL_IDS_COMPLIANCE_headers_(),ss=KOL_IDS_COMPLIANCE_ensure_(),checks=[];Object.keys(h).forEach(function(n){var sh=ss.getSheetByName(n),m=sh&&KOL_IDS_PLATFORM_map_(sh);checks.push({name:n+' schema',pass:!!sh&&h[n].every(function(x){return m[x]!=null;})});});checks.push({name:'Trigger-safe lock',pass:String(KOL_IDS_COMPLIANCE_retentionRun_).indexOf('tryLock')>=0},{name:'Legal hold gate',pass:String(KOL_IDS_COMPLIANCE_eligibility_).indexOf('LEGAL_HOLD')>=0},{name:'Active processing gate',pass:String(KOL_IDS_COMPLIANCE_eligibility_).indexOf('ACTIVE_PROCESSING')>=0},{name:'Dry-run contract',pass:String(KOL_IDS_COMPLIANCE_execute_).indexOf('DRY_RUN')>=0},{name:'Idempotency contract',pass:String(KOL_IDS_COMPLIANCE_actionExists_).indexOf('COMPLETED')>=0},{name:'Campaign propagation contract',pass:typeof KOL_IDS_COMPLIANCE_campaignCompliance_==='function'});return {success:checks.every(function(c){return c.pass;}),version:KOL_IDS.VERSION,checks:checks};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_retentionContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_retentionContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_COMPLIANCE_endToEndQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_endToEndQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var q=KOL_IDS_COMPLIANCE_retentionContractQA_(),checks=q.checks.slice();checks.push({name:'Retry ceiling',pass:String(KOL_IDS_COMPLIANCE_execute_).indexOf('MAX_RETRIES')>=0},{name:'Deletion clears source row',pass:String(KOL_IDS_COMPLIANCE_execute_).indexOf('clearContent')>=0},{name:'Archive stores only metadata/hash',pass:String(KOL_IDS_COMPLIANCE_execute_).indexOf('Snapshot Hash')>=0&&String(KOL_IDS_COMPLIANCE_execute_).indexOf('Snapshot JSON')<0},{name:'Campaign control tower propagation',pass:String(KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_).indexOf('campaignCompliance_')>=0||String(KOL_IDS_PLATFORM_api_).indexOf('tower.compliance')>=0},{name:'Decision gate propagation',pass:String(KOL_IDS_PLATFORM_api_).indexOf("'CREATOR_MATCH'")>=0&&String(KOL_IDS_PLATFORM_api_).indexOf('requireCampaignCompliance_')>=0},{name:'Outcome gate propagation',pass:String(KOL_IDS_PLATFORM_api_).indexOf("'OUTCOME_RECORD'")>=0&&String(KOL_IDS_PLATFORM_api_).indexOf('requireCampaignCompliance_')>=0},{name:'Learning gate propagation',pass:String(KOL_IDS_PLATFORM_api_).indexOf("'LEARNING_REBUILD'")>=0&&String(KOL_IDS_PLATFORM_api_).indexOf('requireCampaignCompliance_')>=0});return {success:checks.every(function(c){return c.pass;}),version:KOL_IDS.VERSION,checks:checks,notes:['Run RETENTION_DRY_RUN before RETENTION_RUN in each deployed tenant.','The test intentionally does not create or delete customer data.']};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_endToEndQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_endToEndQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** Public Apps Script runner for 1.0.0 compliance contract QA. */
function KOL_IDS_COMPLIANCE_RUN_QA_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_COMPLIANCE_RUN_QA_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_COMPLIANCE_endToEndQA_();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_COMPLIANCE_RUN_QA_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_COMPLIANCE_RUN_QA_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
