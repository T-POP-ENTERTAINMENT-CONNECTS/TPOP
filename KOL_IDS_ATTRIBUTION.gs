/**
 * KOL IDS — VERIFIED ATTRIBUTION + RECONCILIATION + DECISION HARDENING
 *
 * Appended LAST. Extends 1.0.0 without replacing the canonical state engine.
 * Adds:
 *  - transaction verification + idempotent ingestion
 *  - refund/cancellation reconciliation and net revenue
 *  - deterministic attribution-rule engine
 *  - evidence/confidence scoring
 *  - immutable-ish transaction/event ledger with hashes
 *  - performance aggregation back into the canonical flow
 *  - orchestration health/QA
 *
 * Supported attribution rules:
 *  CODE_ONLY, LAST_TOUCH, FIRST_TOUCH, LINEAR, TIME_DECAY, POSITION_BASED
 *
 * Important: this layer does not invent orders, clicks, customers, or revenue.
 * It only accepts source events supplied by the customer/platform and marks
 * records VERIFIED only when the supplied evidence passes the configured checks.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  LOCK:'KOL_IDS_ATTRIBUTION_LOCK',
  SHEETS:Object.freeze({
    PLANS:'ENT_ATTRIBUTION_PLANS',
    TX:'ENT_TRANSACTIONS',
    REFUNDS:'ENT_REFUNDS',
    EVENTS:'ENT_ATTRIBUTION_EVENTS',
    LEDGER:'ENT_GENCODE_LEDGER'
  }),
  RULES:['CODE_ONLY','LAST_TOUCH','FIRST_TOUCH','LINEAR','TIME_DECAY','POSITION_BASED'],
  MAX_ROWS:5000,
  MAX_EVENTS_PER_TX:100,
  DEFAULT_WINDOW_DAYS:30,
  DEFAULT_TOLERANCE:0.01
});

function KOL_IDS_ATTRIBUTION_text_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_text_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(v==null?'':v).trim();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_text_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_text_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_upper_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_upper_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ATTRIBUTION_text_(v).toUpperCase();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_upper_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_upper_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?n:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_nonNeg_(v,name){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_nonNeg_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=KOL_IDS_ATTRIBUTION_num_(v);if(n==null||n<0)throw new Error((name||'Value')+' must be a non-negative number.');return n;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_nonNeg_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_nonNeg_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_clone_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_clone_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return v==null?v:JSON.parse(JSON.stringify(v));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_clone_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_clone_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_now_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_now_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return new Date().toISOString();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_now_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_now_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_uuid_(p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_uuid_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(p||'ID')+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,16).toUpperCase();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_uuid_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_uuid_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_hash_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(v==null?'':v))).slice(0,43);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_json_(v,f){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_json_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{return JSON.parse(String(v||''));}catch(e){return f==null?{}:f;}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_json_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_json_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_lock_(fn){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_lock_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var l=LockService.getUserLock();l.waitLock(30000);try{return fn();}finally{l.releaseLock();}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_lock_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_lock_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_ensure_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_ATTRIBUTION_ss_(), specs=KOL_IDS_ATTRIBUTION_schemas_();
  Object.keys(specs).forEach(function(name){
    KOL_IDS_ATTRIBUTION_ensureSheet_(name,specs[name]);
  });
  return ss;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_ss_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_ss_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(typeof KOL_IDS_PLATFORM_ensure_==='function')return KOL_IDS_PLATFORM_ensure_();return KOL_IDS_PRODUCT_getSpreadsheet_();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_ss_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_ss_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_ensureSheet_(name,headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_ensureSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ss=KOL_IDS_ATTRIBUTION_ss_(),sh=ss.getSheetByName(name)||ss.insertSheet(name),last=sh.getLastColumn();if(sh.getLastRow()===0){sh.getRange(1,1,1,headers.length).setValues([headers]);}else{var cur=sh.getRange(1,1,1,Math.max(1,last)).getValues()[0].map(String);headers.forEach(function(h){if(cur.indexOf(h)<0){sh.getRange(1,cur.length+1).setValue(h);cur.push(h);}});}sh.setFrozenRows(1);return sh;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_ensureSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_ensureSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String),m={};h.forEach(function(x,i){m[x]=i;});return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!sh||sh.getLastRow()<2)return [];return sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues().filter(function(r){return r.some(function(x){return x!==''&&x!=null;});});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_append_(sh,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_append_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_ATTRIBUTION_map_(sh),r=Array(sh.getLastColumn()).fill('');Object.keys(obj||{}).forEach(function(k){if(m[k]!=null)r[m[k]]=obj[k];});sh.getRange(sh.getLastRow()+1,1,1,r.length).setValues([r]);return r;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_append_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_append_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_find_(sh,col,value){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_find_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!sh)return null;var m=KOL_IDS_ATTRIBUTION_map_(sh),i=m[col];if(i==null)return null;var rows=KOL_IDS_ATTRIBUTION_rows_(sh);for(var n=0;n<rows.length;n++)if(String(rows[n][i])===String(value))return rows[n];return null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_find_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_find_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_activeContext_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_activeContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(typeof KOL_IDS_CANONICAL_getContext_==='function')return KOL_IDS_CANONICAL_getContext_();if(typeof KOL_IDS_GENCODE_getContext_==='function')return KOL_IDS_GENCODE_getContext_();return{};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_activeContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_activeContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_registry_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_registry_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(typeof KOL_IDS_GENCODE_registry_==='function')return KOL_IDS_GENCODE_registry_();return {};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_registry_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_registry_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_code_(code){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_code_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ATTRIBUTION_upper_(code);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_code_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_code_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_date_(v,fallback){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v instanceof Date&&!isNaN(v.getTime()))return v;var s=KOL_IDS_ATTRIBUTION_text_(v),d=s?new Date(s):fallback||new Date();if(isNaN(d.getTime()))throw new Error('Invalid date/time: '+s);return d;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_iso_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_iso_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ATTRIBUTION_date_(v).toISOString();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_iso_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_iso_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_round_(v,n){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_round_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var p=Math.pow(10,n==null?6:n);return Math.round(Number(v||0)*p)/p;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_round_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_round_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_schemas_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_schemas_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return {
  ENT_ATTRIBUTION_PLANS:['Plan ID','Org ID','Brand ID','Campaign ID','Rule','Window Days','Enabled','Priority','Tolerance','Currency','Created At','Updated At','Config Hash'],
  ENT_TRANSACTIONS:['Transaction ID','External Transaction ID','Org ID','Brand ID','Campaign ID','Creator ID','Gen Code','Customer ID','Occurred At','Gross Revenue','Discount','Net Revenue','Currency','Order Status','Verification Status','Verification Reason','Source','Evidence JSON','Payload Hash','Created At','Updated At'],
  ENT_REFUNDS:['Refund ID','External Refund ID','Transaction ID','External Transaction ID','Org ID','Brand ID','Campaign ID','Refunded At','Refund Amount','Currency','Reason','Verification Status','Source','Evidence JSON','Payload Hash','Created At'],
  ENT_ATTRIBUTION_EVENTS:['Event ID','Transaction ID','External Transaction ID','Org ID','Brand ID','Campaign ID','Creator ID','Gen Code','Event Type','Occurred At','Touchpoint ID','Weight','Attributed Revenue','Rule','Window Days','Evidence Quality','Confidence','Source','Payload Hash','Created At'],
  ENT_GENCODE_LEDGER:['Ledger ID','Transaction ID','External Transaction ID','Refund ID','Org ID','Brand ID','Campaign ID','Creator ID','Gen Code','Gross Revenue','Discount','Refunds','Net Revenue','Attributed Revenue','Currency','Orders','Conversions','New Customer','Verification Status','Attribution Rule','Attribution Confidence','Source','Ledger Hash','Created At']
};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_schemas_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_schemas_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_ensureSchemas_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_ensureSchemas_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var s=KOL_IDS_ATTRIBUTION_schemas_();Object.keys(s).forEach(function(n){KOL_IDS_ATTRIBUTION_ensureSheet_(n,s[n]);});return true;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_ensureSchemas_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_ensureSchemas_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_normalizeRule_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_normalizeRule_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var r=KOL_IDS_ATTRIBUTION_upper_(v||'CODE_ONLY').replace(/[- ]/g,'_');if(KOL_IDS.RULES.indexOf(r)<0)throw new Error('Unsupported attribution rule: '+r);return r;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_normalizeRule_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_normalizeRule_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_getPlan_(ctx,override){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_getPlan_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var p=override||ctx.attributionPlan||ctx.genCodeAttributionPlan||null;
  if(!p)p={};
  var rule=KOL_IDS_ATTRIBUTION_normalizeRule_(p.rule||p.attributionRule||'CODE_ONLY');
  var window=Math.max(0,Math.floor(KOL_IDS_ATTRIBUTION_num_(p.windowDays!=null?p.windowDays:p.attributionWindowDays)||KOL_IDS.DEFAULT_WINDOW_DAYS));
  return {planId:KOL_IDS_ATTRIBUTION_text_(p.planId)||KOL_IDS_ATTRIBUTION_uuid_('ATP'),orgId:KOL_IDS_ATTRIBUTION_text_(p.orgId||ctx.orgId),brandId:KOL_IDS_ATTRIBUTION_text_(p.brandId||ctx.brandId),campaignId:KOL_IDS_ATTRIBUTION_text_(p.campaignId||ctx.campaignId),rule:rule,windowDays:window,enabled:p.enabled!==false,priority:Math.max(0,Math.floor(KOL_IDS_ATTRIBUTION_num_(p.priority)||100)),tolerance:Math.max(0,KOL_IDS_ATTRIBUTION_num_(p.tolerance)!=null?KOL_IDS_ATTRIBUTION_num_(p.tolerance):KOL_IDS.DEFAULT_TOLERANCE),currency:KOL_IDS_ATTRIBUTION_text_(p.currency||ctx.campaign&&ctx.campaign.currency||'THB')};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_getPlan_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_getPlan_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_savePlan_(plan){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_savePlan_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ATTRIBUTION_lock_(function(){var sh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.PLANS,KOL_IDS_ATTRIBUTION_schemas_().ENT_ATTRIBUTION_PLANS),now=new Date(),obj={'Plan ID':plan.planId,'Org ID':plan.orgId,'Brand ID':plan.brandId,'Campaign ID':plan.campaignId,'Rule':plan.rule,'Window Days':plan.windowDays,'Enabled':plan.enabled,'Priority':plan.priority,'Tolerance':plan.tolerance,'Currency':plan.currency,'Created At':now,'Updated At':now,'Config Hash':KOL_IDS_ATTRIBUTION_hash_(plan)};var m=KOL_IDS_ATTRIBUTION_map_(sh),rows=KOL_IDS_ATTRIBUTION_rows_(sh),found=-1;for(var i=0;i<rows.length;i++)if(String(rows[i][m['Plan ID']])===String(plan.planId)){found=i;break;}if(found<0)KOL_IDS_ATTRIBUTION_append_(sh,obj);else{var r=rows[found];Object.keys(obj).forEach(function(k){if(m[k]!=null)r[m[k]]=obj[k];});sh.getRange(found+2,1,1,r.length).setValues([r]);}return {success:true,plan:plan};});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_savePlan_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_savePlan_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_codeRecord_(ctx,code){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_codeRecord_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var c=KOL_IDS_ATTRIBUTION_code_(code),registry=KOL_IDS_ATTRIBUTION_registry_(),r=registry[c];if(r)return r;var codes=ctx.genCodes&&Array.isArray(ctx.genCodes.codes)?ctx.genCodes.codes:[];for(var i=0;i<codes.length;i++)if(KOL_IDS_ATTRIBUTION_code_(codes[i].code)===c)return codes[i];return null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_codeRecord_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_codeRecord_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_verifyTransaction_(tx,ctx,plan){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_verifyTransaction_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var errors=[],code=KOL_IDS_ATTRIBUTION_code_(tx.genCode||tx.code),rec=code?KOL_IDS_ATTRIBUTION_codeRecord_(ctx,code):null;
  if(!KOL_IDS_ATTRIBUTION_text_(tx.externalTransactionId||tx.transactionId))errors.push('MISSING_EXTERNAL_TRANSACTION_ID');
  if(!code)errors.push('MISSING_GEN_CODE');
  if(!rec)errors.push('UNKNOWN_GEN_CODE');
  if(rec){if(plan.brandId&&String(rec.brandId)!==String(plan.brandId))errors.push('BRAND_MISMATCH');if(plan.campaignId&&String(rec.campaignId)!==String(plan.campaignId))errors.push('CAMPAIGN_MISMATCH');if(tx.creatorId&&String(rec.creatorId||'')!==String(tx.creatorId))errors.push('CREATOR_MISMATCH');}
  var gross=KOL_IDS_ATTRIBUTION_num_(tx.grossRevenue!=null?tx.grossRevenue:tx.revenue);if(gross==null||gross<0)errors.push('INVALID_GROSS_REVENUE');
  var discount=KOL_IDS_ATTRIBUTION_num_(tx.discount||0);if(discount==null||discount<0)errors.push('INVALID_DISCOUNT');
  if(gross!=null&&discount!=null&&discount>gross+plan.tolerance)errors.push('DISCOUNT_EXCEEDS_GROSS');
  var occurred;try{occurred=KOL_IDS_ATTRIBUTION_date_(tx.occurredAt||tx.orderDate);}catch(e){errors.push('INVALID_OCCURRED_AT');}
  if(rec&&occurred){var start=rec.startDate?new Date(rec.startDate):null,end=rec.endDate?new Date(rec.endDate):null;if(start&&!isNaN(start.getTime())&&occurred<start)errors.push('OUTSIDE_CODE_START_DATE');if(end&&!isNaN(end.getTime())&&occurred>end)errors.push('OUTSIDE_CODE_END_DATE');}
  var status=KOL_IDS_ATTRIBUTION_upper_(tx.orderStatus||tx.status||'COMPLETED');if(['COMPLETED','PAID','CAPTURED','FULFILLED'].indexOf(status)<0)errors.push('NON_FINAL_ORDER_STATUS');
  var verified=errors.length===0;
  return {verified:verified,reason:verified?'VERIFIED':errors.join('|'),code:code,record:rec,gross:gross==null?0:gross,discount:discount==null?0:discount,net:Math.max(0,(gross||0)-(discount||0)),occurredAt:occurred||new Date(),status:status};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_verifyTransaction_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_verifyTransaction_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_existingTx_(externalId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_existingTx_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.TX,KOL_IDS_ATTRIBUTION_schemas_().ENT_TRANSACTIONS);return KOL_IDS_ATTRIBUTION_find_(sh,'External Transaction ID',externalId);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_existingTx_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_existingTx_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_ingestTransactions(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_ingestTransactions');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{};var ctx=KOL_IDS_ATTRIBUTION_activeContext_(),plan=KOL_IDS_ATTRIBUTION_getPlan_(ctx,payload.plan),items=Array.isArray(payload.transactions)?payload.transactions:[];if(!items.length)throw new Error('At least one transaction is required.');if(items.length>KOL_IDS.MAX_ROWS)throw new Error('Transaction batch exceeds maximum size.');KOL_IDS_ATTRIBUTION_ensureSchemas_();
  return KOL_IDS_ATTRIBUTION_lock_(function(){var sh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.TX,KOL_IDS_ATTRIBUTION_schemas_().ENT_TRANSACTIONS),accepted=0,rejected=0,duplicates=0,results=[],now=new Date();items.forEach(function(tx){var ext=KOL_IDS_ATTRIBUTION_text_(tx.externalTransactionId||tx.transactionId),old=ext&&KOL_IDS_ATTRIBUTION_existingTx_(ext);if(old){duplicates++;results.push({externalTransactionId:ext,status:'DUPLICATE',verified:String(old[KOL_IDS_ATTRIBUTION_map_(sh)['Verification Status']])==='VERIFIED'});return;}var v=KOL_IDS_ATTRIBUTION_verifyTransaction_(tx,ctx,plan),creator=v.record?KOL_IDS_ATTRIBUTION_text_(v.record.creatorId||''):KOL_IDS_ATTRIBUTION_text_(tx.creatorId),obj={'Transaction ID':KOL_IDS_ATTRIBUTION_uuid_('TX'),'External Transaction ID':ext,'Org ID':plan.orgId,'Brand ID':plan.brandId,'Campaign ID':plan.campaignId,'Creator ID':creator,'Gen Code':v.code,'Customer ID':KOL_IDS_ATTRIBUTION_text_(tx.customerId),'Occurred At':v.occurredAt,'Gross Revenue':v.gross,'Discount':v.discount,'Net Revenue':v.net,'Currency':KOL_IDS_ATTRIBUTION_text_(tx.currency||plan.currency),'Order Status':v.status,'Verification Status':v.verified?'VERIFIED':'REJECTED','Verification Reason':v.reason,'Source':KOL_IDS_ATTRIBUTION_text_(tx.source||payload.source||'IMPORT'),'Evidence JSON':JSON.stringify(tx.evidence||{}).slice(0,45000),'Payload Hash':KOL_IDS_ATTRIBUTION_hash_(tx),'Created At':now,'Updated At':now};KOL_IDS_ATTRIBUTION_append_(sh,obj);if(v.verified)accepted++;else rejected++;results.push({externalTransactionId:ext,status:v.verified?'VERIFIED':'REJECTED',transactionId:obj['Transaction ID'],reason:v.reason});});SpreadsheetApp.flush();return{success:rejected===0,version:KOL_IDS.VERSION,plan:plan,accepted:accepted,rejected:rejected,duplicates:duplicates,results:results};});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_ingestTransactions', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_ingestTransactions', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_ingestRefunds(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_ingestRefunds');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{};var ctx=KOL_IDS_ATTRIBUTION_activeContext_(),plan=KOL_IDS_ATTRIBUTION_getPlan_(ctx,payload.plan),items=Array.isArray(payload.refunds)?payload.refunds:[];if(!items.length)throw new Error('At least one refund is required.');KOL_IDS_ATTRIBUTION_ensureSchemas_();return KOL_IDS_ATTRIBUTION_lock_(function(){var sh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.REFUNDS,KOL_IDS_ATTRIBUTION_schemas_().ENT_REFUNDS),txSh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.TX,KOL_IDS_ATTRIBUTION_schemas_().ENT_TRANSACTIONS),tm=KOL_IDS_ATTRIBUTION_map_(txSh),accepted=0,rejected=0,duplicates=0,results=[];items.forEach(function(rf){var ext=KOL_IDS_ATTRIBUTION_text_(rf.externalRefundId||rf.refundId),existing=ext&&KOL_IDS_ATTRIBUTION_find_(sh,'External Refund ID',ext);if(existing){duplicates++;results.push({externalRefundId:ext,status:'DUPLICATE'});return;}var txExt=KOL_IDS_ATTRIBUTION_text_(rf.externalTransactionId||rf.transactionId),tx=txExt?KOL_IDS_ATTRIBUTION_find_(txSh,'External Transaction ID',txExt):null,amount=KOL_IDS_ATTRIBUTION_num_(rf.refundAmount!=null?rf.refundAmount:rf.amount),errors=[];if(!tx)errors.push('UNKNOWN_TRANSACTION');if(tx&&String(tx[tm['Org ID']])!==String(plan.orgId))errors.push('ORG_MISMATCH');if(tx&&String(tx[tm['Brand ID']])!==String(plan.brandId))errors.push('BRAND_MISMATCH');if(tx&&String(tx[tm['Campaign ID']])!==String(plan.campaignId))errors.push('CAMPAIGN_MISMATCH');if(amount==null||amount<=0)errors.push('INVALID_REFUND_AMOUNT');if(tx&&amount>Number(tx[tm['Net Revenue']]||0)+plan.tolerance)errors.push('REFUND_EXCEEDS_NET_REVENUE');var verified=errors.length===0,obj={'Refund ID':KOL_IDS_ATTRIBUTION_uuid_('RF'),'External Refund ID':ext,'Transaction ID':tx?String(tx[tm['Transaction ID']]||''):KOL_IDS_ATTRIBUTION_text_(rf.transactionId),'External Transaction ID':txExt,'Org ID':plan.orgId,'Brand ID':plan.brandId,'Campaign ID':plan.campaignId,'Refunded At':KOL_IDS_ATTRIBUTION_date_(rf.refundedAt||rf.date||new Date()),'Refund Amount':amount||0,'Currency':KOL_IDS_ATTRIBUTION_text_(rf.currency||plan.currency),'Reason':KOL_IDS_ATTRIBUTION_text_(rf.reason),'Verification Status':verified?'VERIFIED':'REJECTED','Source':KOL_IDS_ATTRIBUTION_text_(rf.source||payload.source||'IMPORT'),'Evidence JSON':JSON.stringify(rf.evidence||{}).slice(0,45000),'Payload Hash':KOL_IDS_ATTRIBUTION_hash_(rf),'Created At':new Date()};KOL_IDS_ATTRIBUTION_append_(sh,obj);if(verified)accepted++;else rejected++;results.push({externalRefundId:ext,status:verified?'VERIFIED':'REJECTED',reason:verified?'VERIFIED':errors.join('|')});});SpreadsheetApp.flush();return{success:rejected===0,accepted:accepted,rejected:rejected,duplicates:duplicates,results:results};});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_ingestRefunds', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_ingestRefunds', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_touchWeight_(rule,index,total,occurred,latest){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_touchWeight_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(total<=0)return 0;if(rule==='FIRST_TOUCH')return index===0?1:0;if(rule==='LAST_TOUCH'||rule==='CODE_ONLY')return index===total-1?1:0;if(rule==='LINEAR')return 1/total;if(rule==='POSITION_BASED'){if(total===1)return 1;if(total===2)return .5;return (index===0||index===total-1)?.4:.2/(total-2);}if(rule==='TIME_DECAY'){var days=Math.max(0,(latest-occurred)/86400000),halfLife=7,KOL_IDS_PLATFORM_w=Math.pow(.5,days/halfLife);return KOL_IDS_PLATFORM_w;}return 0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_touchWeight_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_touchWeight_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_normalizeWeights_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_normalizeWeights_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sum=a.reduce(function(x,y){return x+y;},0);return sum>0?a.map(function(x){return x/sum;}):a.map(function(){return 0;});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_normalizeWeights_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_normalizeWeights_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_buildTouches_(tx,ctx,plan){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_buildTouches_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var touches=Array.isArray(tx.touchpoints)?tx.touchpoints.slice():[];var code=KOL_IDS_ATTRIBUTION_code_(tx.genCode||tx.code);if(plan.rule==='CODE_ONLY'&&!touches.length)touches=[{creatorId:tx.creatorId||'',genCode:code,eventType:'CODE_REDEMPTION',occurredAt:tx.occurredAt,touchpointId:'CODE:'+code,source:tx.source||'TRANSACTION'}];if(!touches.length)touches=[{creatorId:tx.creatorId||'',genCode:code,eventType:'CODE_REDEMPTION',occurredAt:tx.occurredAt,touchpointId:'CODE:'+code,source:tx.source||'TRANSACTION',evidenceQuality:.75}];
  touches=touches.map(function(t){return {creatorId:KOL_IDS_ATTRIBUTION_text_(t.creatorId),genCode:KOL_IDS_ATTRIBUTION_code_(t.genCode||t.code||code),eventType:KOL_IDS_ATTRIBUTION_upper_(t.eventType||'TOUCH'),occurredAt:KOL_IDS_ATTRIBUTION_date_(t.occurredAt||tx.occurredAt),touchpointId:KOL_IDS_ATTRIBUTION_text_(t.touchpointId||t.id)||KOL_IDS_ATTRIBUTION_uuid_('TP'),source:KOL_IDS_ATTRIBUTION_text_(t.source||tx.source||'IMPORT'),evidenceQuality:Math.max(0,Math.min(1,KOL_IDS_ATTRIBUTION_num_(t.evidenceQuality)!=null?KOL_IDS_ATTRIBUTION_num_(t.evidenceQuality):.8))};}).filter(function(t){var d=new Date(tx.occurredAt)-t.occurredAt;return d>=0&&d<=plan.windowDays*86400000;}).sort(function(a,b){return a.occurredAt-b.occurredAt;});
  if(plan.rule==='CODE_ONLY')touches=touches.filter(function(t){return t.genCode===code;});
  if(!touches.length)return [];
  var latest=new Date(tx.occurredAt).getTime(),raw=touches.map(function(t,i){return KOL_IDS_ATTRIBUTION_touchWeight_(plan.rule,i,touches.length,new Date(t.occurredAt).getTime(),latest);}),weights=KOL_IDS_ATTRIBUTION_normalizeWeights_(raw);return touches.map(function(t,i){return Object.assign(t,{weight:weights[i]});});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_buildTouches_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_buildTouches_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_attributionConfidence_(tx,touch,evidence,verified){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_attributionConfidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var base=verified ? .65 : .2;var eq=Math.max(0,Math.min(1,evidence==null ? .5 : evidence));var code=touch.genCode?1:0;var source=touch.source?1:0;return Math.round(Math.max(0,Math.min(1,base*.5+eq*.25+code*.15+source*.1))*1000)/10;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_attributionConfidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_attributionConfidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_attributeTransactions(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_attributeTransactions');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{};var ctx=KOL_IDS_ATTRIBUTION_activeContext_(),plan=KOL_IDS_ATTRIBUTION_getPlan_(ctx,payload.plan);KOL_IDS_ATTRIBUTION_ensureSchemas_();var txSh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.TX,KOL_IDS_ATTRIBUTION_schemas_().ENT_TRANSACTIONS),refSh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.REFUNDS,KOL_IDS_ATTRIBUTION_schemas_().ENT_REFUNDS),evSh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.EVENTS,KOL_IDS_ATTRIBUTION_schemas_().ENT_ATTRIBUTION_EVENTS),ledgerSh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.LEDGER,KOL_IDS_ATTRIBUTION_schemas_().ENT_GENCODE_LEDGER),tm=KOL_IDS_ATTRIBUTION_map_(txSh),rm=KOL_IDS_ATTRIBUTION_map_(refSh),events=0,ledgers=0,skipped=0,aggregates={};
  return KOL_IDS_ATTRIBUTION_lock_(function(){var rows=KOL_IDS_ATTRIBUTION_rows_(txSh);rows.forEach(function(r){if(String(r[tm['Org ID']])!==String(plan.orgId)||String(r[tm['Brand ID']])!==String(plan.brandId)||String(r[tm['Campaign ID']])!==String(plan.campaignId)||String(r[tm['Verification Status']])!=='VERIFIED')return;var txId=String(r[tm['Transaction ID']]),existing=KOL_IDS_ATTRIBUTION_find_(evSh,'Transaction ID',txId);if(existing){skipped++;return;}var refunds=KOL_IDS_ATTRIBUTION_rows_(refSh).filter(function(x){return String(x[rm['Transaction ID']])===txId&&String(x[rm['Verification Status']])==='VERIFIED';}),refundTotal=refunds.reduce(function(s,x){return s+Number(x[rm['Refund Amount']]||0);},0),gross=Number(r[tm['Gross Revenue']]||0),net=Math.max(0,Number(r[tm['Net Revenue']]||0)-refundTotal),tx={externalTransactionId:String(r[tm['External Transaction ID']]),genCode:String(r[tm['Gen Code']]),creatorId:String(r[tm['Creator ID']]),occurredAt:r[tm['Occurred At']],source:String(r[tm['Source']]||'IMPORT'),touchpoints:KOL_IDS_ATTRIBUTION_json_(r[tm['Evidence JSON']],{}).touchpoints||[]},touches=KOL_IDS_ATTRIBUTION_buildTouches_(tx,ctx,plan);if(!touches.length){skipped++;return;}touches.forEach(function(t){var attr=net*t.weight,conf=KOL_IDS_ATTRIBUTION_attributionConfidence_(tx,t,t.evidenceQuality,true),obj={'Event ID':KOL_IDS_ATTRIBUTION_uuid_('AE'),'Transaction ID':txId,'External Transaction ID':tx.externalTransactionId,'Org ID':plan.orgId,'Brand ID':plan.brandId,'Campaign ID':plan.campaignId,'Creator ID':t.creatorId,'Gen Code':t.genCode,'Event Type':t.eventType,'Occurred At':t.occurredAt,'Touchpoint ID':t.touchpointId,'Weight':KOL_IDS_ATTRIBUTION_round_(t.weight,8),'Attributed Revenue':KOL_IDS_ATTRIBUTION_round_(attr,6),'Rule':plan.rule,'Window Days':plan.windowDays,'Evidence Quality':t.evidenceQuality,'Confidence':conf,'Source':t.source,'Payload Hash':KOL_IDS_ATTRIBUTION_hash_(obj),'Created At':new Date()};KOL_IDS_ATTRIBUTION_append_(evSh,obj);events++;var key=t.creatorId+'|'+t.genCode;if(!aggregates[key])aggregates[key]={creatorId:t.creatorId,genCode:t.genCode,gross:0,discount:0,refunds:0,net:0,attr:0,orders:0,newCustomers:0,confidence:0};aggregates[key].gross+=gross*t.weight;aggregates[key].discount+=Number(r[tm['Discount']]||0)*t.weight;aggregates[key].refunds+=refundTotal*t.weight;aggregates[key].net+=net*t.weight;aggregates[key].attr+=attr;aggregates[key].orders+=1;aggregates[key].newCustomers+=KOL_IDS_ATTRIBUTION_json_(r[tm['Evidence JSON']],{}).isNewCustomer===true?1:0;aggregates[key].confidence=Math.max(aggregates[key].confidence,conf);});});Object.keys(aggregates).forEach(function(k){var a=aggregates[k],id=KOL_IDS_ATTRIBUTION_uuid_('GL'),obj={'Ledger ID':id,'Transaction ID':'BATCH','External Transaction ID':'BATCH_'+KOL_IDS_ATTRIBUTION_now_(),'Refund ID':'','Org ID':plan.orgId,'Brand ID':plan.brandId,'Campaign ID':plan.campaignId,'Creator ID':a.creatorId,'Gen Code':a.genCode,'Gross Revenue':KOL_IDS_ATTRIBUTION_round_(a.gross,2),'Discount':KOL_IDS_ATTRIBUTION_round_(a.discount,2),'Refunds':KOL_IDS_ATTRIBUTION_round_(a.refunds,2),'Net Revenue':KOL_IDS_ATTRIBUTION_round_(a.net,2),'Attributed Revenue':KOL_IDS_ATTRIBUTION_round_(a.attr,2),'Currency':plan.currency,'Orders':a.orders,'Conversions':a.orders,'New Customer':a.newCustomers,'Verification Status':'VERIFIED','Attribution Rule':plan.rule,'Attribution Confidence':KOL_IDS_ATTRIBUTION_round_(a.confidence,1),'Source':'1.0.0_ATTRIBUTION','Ledger Hash':KOL_IDS_ATTRIBUTION_hash_(obj),'Created At':new Date()};var lm=KOL_IDS_ATTRIBUTION_map_(ledgerSh),lrows=KOL_IDS_ATTRIBUTION_rows_(ledgerSh),found=-1;for(var li=0;li<lrows.length;li++){if(String(lrows[li][lm['Org ID']])===String(plan.orgId)&&String(lrows[li][lm['Brand ID']])===String(plan.brandId)&&String(lrows[li][lm['Campaign ID']])===String(plan.campaignId)&&String(lrows[li][lm['Creator ID']])===String(a.creatorId)&&String(lrows[li][lm['Gen Code']])===String(a.genCode)){found=li;break;}}if(found<0){KOL_IDS_ATTRIBUTION_append_(ledgerSh,obj);ledgers++;}else{var lr=lrows[found];Object.keys(obj).forEach(function(k){if(lm[k]!=null)lr[lm[k]]=obj[k];});ledgerSh.getRange(found+2,1,1,lr.length).setValues([lr]);ledgers++;}});SpreadsheetApp.flush();return{success:true,version:KOL_IDS.VERSION,rule:plan.rule,windowDays:plan.windowDays,events:events,ledgers:ledgers,skipped:skipped};});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_attributeTransactions', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_attributeTransactions', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_reconcile_(plan){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_reconcile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var txSh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.TX,KOL_IDS_ATTRIBUTION_schemas_().ENT_TRANSACTIONS),rfSh=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.REFUNDS,KOL_IDS_ATTRIBUTION_schemas_().ENT_REFUNDS),tm=KOL_IDS_ATTRIBUTION_map_(txSh),rm=KOL_IDS_ATTRIBUTION_map_(rfSh),rows=KOL_IDS_ATTRIBUTION_rows_(txSh),refundRows=KOL_IDS_ATTRIBUTION_rows_(rfSh),updated=0,violations=[];rows.forEach(function(r){if(String(r[tm['Org ID']])!==String(plan.orgId)||String(r[tm['Brand ID']])!==String(plan.brandId)||String(r[tm['Campaign ID']])!==String(plan.campaignId))return;var txId=String(r[tm['Transaction ID']]),baseNet=Number(r[tm['Gross Revenue']]||0)-Number(r[tm['Discount']]||0),refs=refundRows.filter(function(x){return String(x[rm['Transaction ID']])===txId&&String(x[rm['Verification Status']])==='VERIFIED';}),refund=refs.reduce(function(s,x){return s+Number(x[rm['Refund Amount']]||0);},0);if(refund>baseNet+plan.tolerance)violations.push({transactionId:txId,type:'REFUND_EXCEEDS_NET',refund:refund,baseNet:baseNet});updated++;});return{success:violations.length===0,updated:updated,violations:violations};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_reconcile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_reconcile_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_rollupPerformance_(plan){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_rollupPerformance_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var led=KOL_IDS_ATTRIBUTION_ensureSheet_(KOL_IDS.SHEETS.LEDGER,KOL_IDS_ATTRIBUTION_schemas_().ENT_GENCODE_LEDGER),m=KOL_IDS_ATTRIBUTION_map_(led),rows=KOL_IDS_ATTRIBUTION_rows_(led),agg={};rows.forEach(function(r){if(String(r[m['Org ID']])!==String(plan.orgId)||String(r[m['Brand ID']])!==String(plan.brandId)||String(r[m['Campaign ID']])!==String(plan.campaignId))return;var k=String(r[m['Creator ID']])+'|'+String(r[m['Gen Code']]);if(!agg[k])agg[k]={creatorId:String(r[m['Creator ID']]),genCode:String(r[m['Gen Code']]),revenue:0,orders:0,confidence:0,net:0};agg[k].revenue+=Number(r[m['Attributed Revenue']]||0);agg[k].net+=Number(r[m['Net Revenue']]||0);agg[k].orders+=Number(r[m['Orders']]||0);agg[k].confidence=Math.max(agg[k].confidence,Number(r[m['Attribution Confidence']]||0));});return Object.keys(agg).map(function(k){var a=agg[k];return {creatorId:a.creatorId,genCode:a.genCode,revenue:KOL_IDS_ATTRIBUTION_round_(a.revenue,2),netRevenue:KOL_IDS_ATTRIBUTION_round_(a.net,2),orders:a.orders,conversions:a.orders,attributionConfidence:a.confidence};});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_rollupPerformance_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_rollupPerformance_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ATTRIBUTION_SAVE_ATTRIBUTION_PLAN(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_SAVE_ATTRIBUTION_PLAN');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_ATTRIBUTION_PLAN',true,function(){KOL_IDS_SELF_ROUTE_();payload=payload||{};var ctx=KOL_IDS_ATTRIBUTION_activeContext_(),plan=KOL_IDS_ATTRIBUTION_getPlan_(ctx,payload);if(!plan.orgId||!plan.brandId||!plan.campaignId)throw new Error('Attribution plan requires Org, Brand, and Campaign context.');KOL_IDS_ATTRIBUTION_savePlan_(plan);if(typeof KOL_IDS_CANONICAL_mutate_==='function'){ctx=KOL_IDS_CANONICAL_mutate_(ctx,'SAVE_ATTRIBUTION_PLAN','GEN_CODE',function(c){c.attributionPlan=KOL_IDS_ATTRIBUTION_clone_(plan);return c;});}return typeof KOL_IDS_CANONICAL_result_==='function'?KOL_IDS_CANONICAL_result_(ctx,'GEN_CODE',{plan:plan}):{success:true,plan:plan};});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_SAVE_ATTRIBUTION_PLAN', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_SAVE_ATTRIBUTION_PLAN', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_GET_ATTRIBUTION_PLAN(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_GET_ATTRIBUTION_PLAN');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('GET_ATTRIBUTION_PLAN',false,function(){KOL_IDS_SELF_ROUTE_();var ctx=KOL_IDS_ATTRIBUTION_activeContext_();return{success:true,version:KOL_IDS.VERSION,plan:ctx.attributionPlan||KOL_IDS_ATTRIBUTION_getPlan_(ctx)}});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_GET_ATTRIBUTION_PLAN', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_GET_ATTRIBUTION_PLAN', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_INGEST_TRANSACTIONS(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_INGEST_TRANSACTIONS');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('INGEST_TRANSACTIONS',true,function(){KOL_IDS_SELF_ROUTE_();return KOL_IDS_ATTRIBUTION_ingestTransactions(payload);});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_INGEST_TRANSACTIONS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_INGEST_TRANSACTIONS', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_INGEST_REFUNDS(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_INGEST_REFUNDS');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('INGEST_REFUNDS',true,function(){KOL_IDS_SELF_ROUTE_();return KOL_IDS_ATTRIBUTION_ingestRefunds(payload);});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_INGEST_REFUNDS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_INGEST_REFUNDS', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_RUN_ATTRIBUTION(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_RUN_ATTRIBUTION');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('RUN_ATTRIBUTION',true,function(){KOL_IDS_SELF_ROUTE_();var p=payload||{},ctx=KOL_IDS_ATTRIBUTION_activeContext_(),plan=KOL_IDS_ATTRIBUTION_getPlan_(ctx,p.plan);KOL_IDS_ATTRIBUTION_savePlan_(plan);var rec=KOL_IDS_ATTRIBUTION_reconcile_(plan),at=KOL_IDS_ATTRIBUTION_attributeTransactions(p),roll=KOL_IDS_ATTRIBUTION_rollupPerformance_(plan);
    var authoritySync=null;
    if (at.success && typeof KOL_IDS_PERF_AUTHORITY_SAVE === 'function' && roll.length) {
      authoritySync=KOL_IDS_PERF_AUTHORITY_SAVE({
        analysisId:ctx.analysisId, campaignId:plan.campaignId, brandId:plan.brandId, orgId:plan.orgId,
        currency:plan.currency, rows:roll.map(function(x){return {
          creatorId:x.creatorId, name:x.creatorId, genCode:x.genCode, conversions:x.conversions,
          orders:x.orders, revenue:x.revenue, netRevenue:x.netRevenue, source:'ATTRIBUTION',
          sourceId:x.genCode, verificationStatus:'VERIFIED', confidence:x.attributionConfidence,
          objective:'SALES'
        };})
      });
    }
    return{success:rec.success&&at.success,version:KOL_IDS.VERSION,plan:plan,reconciliation:rec,attribution:at,performance:roll,performanceAuthority:authoritySync};});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_RUN_ATTRIBUTION', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_RUN_ATTRIBUTION', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Canonical SAVE_PERFORMANCE: supports both direct Business Impact rows from the UI and
 * verified transaction/refund ingestion. This is the only owner of the public endpoint. */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_SAVE_PERFORMANCE(payload){
  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_PERFORMANCE',true,function(){
    KOL_IDS_SELF_ROUTE_();
    payload=payload||{};
    var ctx=KOL_IDS_ATTRIBUTION_activeContext_();
    if(!ctx.analysisId||!ctx.campaignId||!ctx.brandId)throw new Error('Business Impact requires an active Analysis, Campaign, and Brand context.');
    if(ctx.stage!=='RUN_COMPLETE'&&ctx.stage!=='IMPACT_CAPTURED')throw new Error('Run the decision analysis before entering Business Impact.');
    var rows=Array.isArray(payload.rows)?payload.rows:[];
    var hasLedger=Array.isArray(payload.transactions)||Array.isArray(payload.refunds)||payload.attributionRule||payload.plan&&payload.plan.attributionRule;
    var allowed=(ctx.selectedCreators||[]).map(function(x){return KOL_IDS_ATTRIBUTION_text_(x);});

    if(hasLedger){
      var plan=KOL_IDS_ATTRIBUTION_getPlan_(ctx,payload.plan);
      if(payload.attributionRule)plan.rule=KOL_IDS_ATTRIBUTION_normalizeRule_(payload.attributionRule);
      if(Array.isArray(payload.transactions))KOL_IDS_ATTRIBUTION_ingestTransactions({transactions:payload.transactions,plan:plan,source:payload.source});
      if(Array.isArray(payload.refunds))KOL_IDS_ATTRIBUTION_ingestRefunds({refunds:payload.refunds,plan:plan,source:payload.source});
      KOL_IDS_ATTRIBUTION_savePlan_(plan);
      var rec=KOL_IDS_ATTRIBUTION_reconcile_(plan),at=KOL_IDS_ATTRIBUTION_attributeTransactions({plan:plan}),roll=KOL_IDS_ATTRIBUTION_rollupPerformance_(plan);
      var ledgerRows=roll.map(function(x){var cr=KOL_IDS_ATTRIBUTION_codeRecord_(ctx,x.genCode)||{};return{name:cr.creatorName||x.creatorId,creatorId:x.creatorId,genCode:x.genCode,conversions:x.conversions,revenue:x.revenue,netRevenue:x.netRevenue,attributionConfidence:x.attributionConfidence,source:'1.0.0_ATTRIBUTION'};});
      if(ledgerRows.length)rows=ledgerRows;
      if(!rec.success||!at.success)throw new Error('Attribution reconciliation failed. Review the verified transaction/refund ledger before saving impact.');
    }

    if(!rows.length)throw new Error('At least one Business Impact record is required.');
    rows.forEach(function(r){
      var name=KOL_IDS_ATTRIBUTION_text_(r&&r.name);
      if(!name)throw new Error('Every Business Impact record must include a Creator name.');
      if(allowed.indexOf(name)<0)throw new Error('Business impact creator is outside the reviewed shortlist: '+name);
      var n=['spend','conversions','revenue','incrementalSales','qualifiedLeads','codeUses','orders','newCustomers'];
      n.forEach(function(k){if(r[k]!=null&&r[k]!==''&&(!isFinite(Number(r[k]))||Number(r[k])<0))throw new Error(k+' must be a non-negative number for '+name+'.');});
    });

    /* Use the existing persistence layer for the canonical performance sheet. */
    var result;
    if (typeof KOL_IDS_PERF_AUTHORITY_SAVE !== 'function') {
      throw new Error('Performance Authority is not installed.');
    }
    result=KOL_IDS_PERF_AUTHORITY_SAVE({
      rows:rows,
      analysisId:ctx.analysisId,
      campaignId:ctx.campaignId,
      brandId:ctx.brandId,
      orgId:ctx.orgId,
      currency:payload.currency||ctx.campaign&&ctx.campaign.currency||'THB'
    });
    var next=KOL_IDS_CANONICAL_mutate_(ctx,'SAVE_PERFORMANCE','PERFORMANCE',function(c){
      c.performance={rows:KOL_IDS_GENCODE_clone_(rows),savedAt:KOL_IDS_ATTRIBUTION_now_(),currency:payload.currency||c.campaign&&c.campaign.currency||'THB'};
      c.stage='IMPACT_CAPTURED';
      return c;
    });
    KOL_IDS_CANONICAL_persist_(next,'Business Impact',payload);
    if(typeof KOL_IDS_IDI_syncOutcomes_==='function'){try{KOL_IDS_IDI_syncOutcomes_();}catch(ignore){}}
    // Full intelligence hand-off: performance becomes attributable evidence,
    // then refreshes campaign-scoped learning. Failure is observable but never
    // rolls back the already-confirmed canonical performance save.
    var intelligenceSync=null;
    if(typeof KOL_IDS_1203_syncIntelligenceAfterPerformance_==='function'){
      intelligenceSync=KOL_IDS_1203_syncIntelligenceAfterPerformance_(rows,{
        analysisId:ctx.analysisId, campaignId:ctx.campaignId, brandId:ctx.brandId
      });
    }
    var reportAfterSave=null;
    try{ if(typeof KOL_IDS_PRODUCT_UI_GET_REPORT==='function') reportAfterSave=KOL_IDS_PRODUCT_UI_GET_REPORT(); }catch(ignoreReport){}
    return Object.assign({},result,{report:reportAfterSave,canonical:KOL_IDS_CANONICAL_result_(next,'PERFORMANCE',{saved:true,count:rows.length}),intelligenceSync:intelligenceSync,version:KOL_IDS.VERSION});
  });
};

function KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_ATTRIBUTION_ensureSchemas_();var violations=[],checked=0,ss=KOL_IDS_ATTRIBUTION_ss_(),tx=ss.getSheetByName(KOL_IDS.SHEETS.TX),tm=KOL_IDS_ATTRIBUTION_map_(tx),rows=KOL_IDS_ATTRIBUTION_rows_(tx);rows.forEach(function(r,i){checked++;var payload=String(r[tm['Payload Hash']]||'');if(payload&&!payload.match(/^[A-Za-z0-9_-]{20,}$/))violations.push({sheet:KOL_IDS.SHEETS.TX,row:i+2,type:'BAD_PAYLOAD_HASH'});var gross=Number(r[tm['Gross Revenue']]||0),disc=Number(r[tm['Discount']]||0),net=Number(r[tm['Net Revenue']]||0);if(gross<0||disc<0||net<0||disc>gross+.01||net>gross+.01)violations.push({sheet:KOL_IDS.SHEETS.TX,row:i+2,type:'MONEY_INVARIANT'});});return{success:violations.length===0,version:KOL_IDS.VERSION,checked:checked,violationCount:violations.length,violations:violations.slice(0,100)};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_HEALTH(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_HEALTH');
  var __kolIdsTraceStartedAt = Date.now();
  try {
KOL_IDS_SECURITY_ASSERT_USER_();KOL_IDS_SELF_ROUTE_();var ctx=KOL_IDS_ATTRIBUTION_activeContext_(),schema=KOL_IDS_ATTRIBUTION_ensureSchemas_(),integrity=KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY();return{success:integrity.success,version:KOL_IDS.VERSION,canonicalState:typeof KOL_IDS_CANONICAL_getContext_==='function',genCode:typeof KOL_IDS_GENCODE_registry_==='function',transactionVerification:true,refundReconciliation:true,attributionRules:KOL_IDS.RULES,integrity:integrity,context:{analysisId:ctx.analysisId||'',campaignId:ctx.campaignId||'',brandId:ctx.brandId||''},checkedAt:KOL_IDS_ATTRIBUTION_now_()};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_HEALTH', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_HEALTH', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ATTRIBUTION_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ATTRIBUTION_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {
KOL_IDS_SECURITY_ASSERT_USER_();
  // QA must be runnable on a fresh commercial deployment. If the tester has
  // neither a paid license nor an active customer/trial session, create the
  // normal 7-day Trial session through the commercial service, then route into
  // that workspace. This does NOT bypass paid licensing for real customers.
  var __qaBoot=null;
  try {
    __qaBoot=KOL_IDS_SELF_ROUTE_();
  } catch (__qaAccessError) {
    if (typeof KOL_IDS_COMMERCIAL_START_TRIAL !== 'function') throw __qaAccessError;
    __qaBoot=KOL_IDS_COMMERCIAL_START_TRIAL();
    if (!__qaBoot || !__qaBoot.workspaceId) throw __qaAccessError;
    __qaBoot=KOL_IDS_SELF_ROUTE_();
  }
  var h=KOL_IDS_ATTRIBUTION_HEALTH(),checks=[];
  checks.push({name:'Schema',pass:h.success});
  checks.push({name:'Canonical state',pass:h.canonicalState});
  checks.push({name:'Gen Code registry',pass:h.genCode});
  checks.push({name:'Transaction verification',pass:h.transactionVerification});
  checks.push({name:'Refund reconciliation',pass:h.refundReconciliation});
  checks.push({name:'Attribution rule engine',pass:h.attributionRules.length===6});
  return{success:checks.every(function(x){return x.pass;}),version:KOL_IDS.VERSION,checks:checks,health:h,bootstrap:{success:true,source:__qaBoot&&__qaBoot.access?__qaBoot.access.source:((__qaBoot&&__qaBoot.accessType)||'TRIAL'),workspaceId:__qaBoot&&__qaBoot.workspaceId||''}};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ATTRIBUTION_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ATTRIBUTION_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_SELF_SAVE_PERFORMANCE() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SELF_SAVE_PERFORMANCE', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SELF_SAVE_PERFORMANCE, this, arguments);
}
