/**
 * KOL IDS — ENTERPRISE PLATFORM + FINAL INTELLIGENCE
 *
 * Adds an integrated enterprise layer on top of the production path:
 * V5 -> V16 -> V21 -> V22 -> V24.
 *
 * Capabilities:
 * 1. Multi-brand organization
 * 2. Multi-user / brand-scoped permissions
 * 3. Hashed bearer API keys + JSON API
 * 4. Live creator-data provider adapters
 * 5. Automated ingestion jobs / triggers
 * 6. Benchmark warehouse + peer cohorts
 * 7. Transparent predictive model + holdout validation
 * 8. Custom model per brand (validated before activation)
 * 9. SLA/incident tracking
 * 10. Dedicated onboarding workflow
 * 11. Consulting / strategy workspace
 * 12. Configurable enterprise dashboard
 * 13. Security + tamper-evident hash-chain audit log
 * 14. Marketing-stack integration adapters / webhooks
 *
 * Important: external provider integrations require the customer's API
 * credentials/endpoints. This file never hard-codes third-party secrets.
 */

KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  SHEETS: {
    ORGS:'ENT_ORGS', USERS:'ENT_USERS', BRANDS:'ENT_BRANDS', CREATOR_DATA:'ENT_CREATOR_DATA',
    BENCHMARKS:'ENT_BENCHMARKS', MODELS:'ENT_MODEL_REGISTRY', MODEL_METRICS:'ENT_MODEL_METRICS',
    INTEGRATIONS:'ENT_INTEGRATIONS', INGEST:'ENT_INGEST_JOBS', API_KEYS:'ENT_API_KEYS',
    AUDIT:'ENT_AUDIT_LOG', ONBOARDING:'ENT_ONBOARDING', SLA:'ENT_SLA', CONSULTING:'ENT_CONSULTING',
    DASHBOARD:'ENT_DASHBOARD_CONFIG', CAMPAIGNS:'ENT_CAMPAIGNS', CREATOR_SNAPSHOTS:'ENT_CREATOR_SNAPSHOTS',
    RECOMMENDATIONS:'ENT_RECOMMENDATIONS', OUTCOMES:'ENT_OUTCOMES', PREDICTION_EVAL:'ENT_PREDICTION_EVAL', DATA_LINEAGE:'ENT_DATA_LINEAGE'
  },
  ROLES:{OWNER:'OWNER', ADMIN:'ADMIN', STRATEGIST:'STRATEGIST', ANALYST:'ANALYST', VIEWER:'VIEWER'},
  WRITE_ROLES:['OWNER','ADMIN','STRATEGIST','ANALYST'],
  ADMIN_ROLES:['OWNER','ADMIN'],
  MAX_API_PER_MINUTE:120,
  MODEL_MIN_TRAIN_ROWS:20,
  MODEL_MIN_VALIDATION_ROWS:8,
  MAX_CALIBRATION:8,
  MODEL_MIN_R2:0.15,
  MODEL_MIN_BASELINE_IMPROVEMENT:0.05,
  MODEL_MIN_UNIQUE_CAMPAIGNS:12,
  MODEL_MIN_UNIQUE_CREATORS:8,
  MODEL_MAX_ABS_FEATURE:100,
  MODEL_MAX_ROWS:5000,
  MODEL_MAX_FEATURE:100,
  MODEL_MIN_TIME_SPAN_DAYS:7,
  API_KEY_MIN_SECRET_LENGTH:48,
  MAX_API_BODY_BYTES:100000,
  MAX_WEBHOOK_PAYLOAD_BYTES:50000,
  MAX_API_SCOPE_COUNT:10,
  MAX_BRAND_SCOPE_COUNT:100
});

function KOL_IDS_PLATFORM_headers_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return {
  ENT_ORGS:['Org ID','Org Name','Owner Email','Plan','Status','Created At','Updated At'],
  ENT_USERS:['User ID','Org ID','Email','Role','Brand Scope','Status','Created At','Updated At'],
  ENT_BRANDS:['Brand ID','Org ID','Brand Name','Status','Industry','Legacy Brand ID','Model ID','Created At','Updated At'],
  ENT_CREATOR_DATA:['Record ID','Org ID','Creator ID','Platform','Handle','Followers','ER','Rate','Currency','Category','Audience JSON','Content JSON','Source','Observed At','Confidence','Raw Hash','Status','Brand ID'],
  ENT_BENCHMARKS:['Benchmark ID','Org ID','Brand ID','Cohort Key','Platform','Category','Metric','Sample Size','P25','Median','P75','Mean','Updated At','Confidence'],
  ENT_MODEL_REGISTRY:['Model ID','Org ID','Brand ID','Model Type','Version','Status','Features JSON','Coefficients JSON','Intercept','Train Rows','Validation Rows','MAE','RMSE','R2','Created At','Activated At','Deactivated At','Baseline MAE','Baseline RMSE','Baseline R2','Validation Method','Dataset Hash'],
  ENT_MODEL_METRICS:['Metric ID','Model ID','Dataset','Rows','MAE','RMSE','R2','Created At','Notes','Baseline MAE','Improvement','Validation Method','Dataset Hash'],
  ENT_INTEGRATIONS:['Integration ID','Org ID','Brand ID','Provider','Type','Base URL','Auth Type','Secret Property','Status','Config JSON','Created At','Updated At'],
  ENT_INGEST_JOBS:['Job ID','Org ID','Brand ID','Integration ID','Schedule','Status','Last Run','Next Run','Rows Imported','Last Error','Created At','Updated At'],
  ENT_API_KEYS:['Key ID','Org ID','Name','Key Prefix','Secret Hash','Scopes JSON','Brand Scope','Status','Created At','Last Used At','Revoked At'],
  ENT_AUDIT_LOG:['Event ID','Timestamp','Org ID','Actor','Action','Entity Type','Entity ID','Outcome','Request ID','IP/Source','Previous Hash','Details Hash','Event Hash','Details'],
  ENT_ONBOARDING:['Onboarding ID','Org ID','Brand ID','Owner','Status','Step','Checklist JSON','Started At','Target Date','Completed At','Notes'],
  ENT_SLA:['Ticket ID','Org ID','Brand ID','Severity','Status','Opened At','First Response At','Resolved At','Target Minutes','Actual Minutes','Breach','Owner','Summary'],
  ENT_CONSULTING:['Engagement ID','Org ID','Brand ID','Type','Status','Lead','Start Date','End Date','Objective','Deliverable','Recommendation','Created At','Updated At'],
  ENT_DASHBOARD_CONFIG:['Config ID','Org ID','Brand ID','Widget Key','Position','Visible','Config JSON','Updated At'],
  ENT_CAMPAIGNS:['Campaign ID','Org ID','Brand ID','Objective','Platform','Start At','End At','Budget','Currency','Status','Created At','Updated At'],
  ENT_CREATOR_SNAPSHOTS:['Snapshot ID','Org ID','Brand ID','Creator ID','Platform','Observed At','Followers','ER','Audience JSON','Content JSON','Rate','Currency','Source','Confidence','Raw Hash','Data Rights','Created At'],
  ENT_RECOMMENDATIONS:['Recommendation ID','Org ID','Brand ID','Campaign ID','Creator ID','Model ID','Model Version','Recommended At','Score','Expected Impact','Expected Risk','Confidence','Reason JSON','Decision','Actual Outcome ID','Input Snapshot Hash'],
  ENT_OUTCOMES:['Outcome ID','Org ID','Brand ID','Campaign ID','Creator ID','Observed At','Spend','Currency','Impressions','Reach','Clicks','Conversions','Revenue','CTR','CVR','CPA','ROAS','Engagement','Outcome Status','Source','Evidence JSON','Data Rights','Created At'],
  ENT_PREDICTION_EVAL:['Evaluation ID','Org ID','Brand ID','Recommendation ID','Outcome ID','Campaign ID','Creator ID','Model ID','Model Version','Predicted Value','Actual Value','Error','Absolute Error','Absolute Percentage Error','Evaluated At'],
  ENT_DATA_LINEAGE:['Lineage ID','Org ID','Brand ID','Entity Type','Entity ID','Event Type','Event At','Source','Source Record ID','Schema Version','Model Version','Payload Hash','Previous Hash','Event Hash','Data Rights','Created At']
};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ss){
  var specs=KOL_IDS_PLATFORM_headers_();
  var names=['ENT_ORGS','ENT_USERS','ENT_BRANDS'];
  names.forEach(function(name){KOL_IDS_PLATFORM_ensureSheet_(ss,name,specs[name]);});
  return {
    orgs:ss.getSheetByName('ENT_ORGS'),
    users:ss.getSheetByName('ENT_USERS'),
    brands:ss.getSheetByName('ENT_BRANDS')
  };
}

function KOL_IDS_PLATFORM_ensure_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),specs=KOL_IDS_PLATFORM_headers_();
  Object.keys(specs).forEach(function(name){KOL_IDS_PLATFORM_ensureSheet_(ss,name,specs[name]);});
  return ss;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_ensureSheet_(ss,name,headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_ensureSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss.getSheetByName(name); if(!sh)sh=ss.insertSheet(name);
  var last=sh.getLastColumn();
  if(sh.getLastRow()===0){sh.getRange(1,1,1,headers.length).setValues([headers]);}
  else{
    var cur=sh.getRange(1,1,1,Math.max(1,last)).getValues()[0].map(String);
    // Customer-facing schema hardening: ENT_BRANDS must expose only
    // "Legacy Brand ID". Older deployments may contain "V5 Brand ID".
    // Migrate its values into the canonical column, then remove the old
    // customer-facing column so it cannot reappear on subsequent runs.
    if(name==='ENT_BRANDS'){
      var legacyIdx=cur.indexOf('V5 Brand ID');
      var publicIdx=cur.indexOf('Legacy Brand ID');
      if(legacyIdx>=0){
        if(publicIdx<0){
          sh.getRange(1,legacyIdx+1).setValue('Legacy Brand ID');
          cur[legacyIdx]='Legacy Brand ID';
          publicIdx=legacyIdx;
        }else if(legacyIdx!==publicIdx){
          // Preserve an existing canonical value; only backfill blanks from
          // the legacy V5 column before deleting that old column.
          var dataRows=sh.getLastRow()-1;
          if(dataRows>0){
            var oldValues=sh.getRange(2,legacyIdx+1,dataRows,1).getValues();
            var canonicalValues=sh.getRange(2,publicIdx+1,dataRows,1).getValues();
            var changed=false;
            for(var ri=0;ri<dataRows;ri++){
              if(String(canonicalValues[ri][0]||'').trim()==='' && String(oldValues[ri][0]||'').trim()!==''){
                canonicalValues[ri][0]=oldValues[ri][0];
                changed=true;
              }
            }
            if(changed)sh.getRange(2,publicIdx+1,dataRows,1).setValues(canonicalValues);
          }
          // Deleting the old column also removes the obsolete header from the
          // actual sheet, not just from the in-memory schema definition.
          sh.deleteColumn(legacyIdx+1);
          cur.splice(legacyIdx,1);
          if(legacyIdx<publicIdx)publicIdx--;
        }
        if(typeof KOL_IDS_PLATFORM_RUNTIME_CACHE!=='undefined'){
          KOL_IDS_PLATFORM_RUNTIME_CACHE.maps={};
          KOL_IDS_PLATFORM_RUNTIME_CACHE.rows={};
        }
      }
    }
    headers.forEach(function(h){if(cur.indexOf(h)<0){sh.getRange(1,cur.length+1).setValue(h);cur.push(h);}});
  }
  sh.setFrozenRows(1); return sh;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_ensureSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_ensureSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}
var KOL_IDS_PLATFORM_RUNTIME_CACHE = KOL_IDS_PLATFORM_RUNTIME_CACHE || {maps:{},rows:{}};

function KOL_IDS_PLATFORM_values_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_values_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!sh)return [];
  var lr=sh.getLastRow(),lc=sh.getLastColumn();
  if(lr<2||lc<1)return [];
  return sh.getRange(2,1,lr-1,lc).getValues().filter(function(r){
    for(var i=0;i<r.length;i++){if(r[i]!==''&&r[i]!=null)return true;}
    return false;
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_values_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_values_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!sh||!sh.getLastColumn())return {};
  var key=String(sh.getSheetId())+':'+String(sh.getLastColumn());
  var cached=KOL_IDS_PLATFORM_RUNTIME_CACHE.maps[key];
  if(cached)return cached;
  var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String),m={};
  h.forEach(function(x,i){m[x]=i;});
  KOL_IDS_PLATFORM_RUNTIME_CACHE.maps[key]=m;
  return m;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_row_(sh,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_row_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_PLATFORM_map_(sh),r=Array(sh.getLastColumn()).fill('');Object.keys(obj||{}).forEach(function(k){if(m[k]!=null)r[m[k]]=obj[k];});return r;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_row_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_row_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_uuid_(prefix){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_uuid_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(prefix||'ID')+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_uuid_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_uuid_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_hash_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(v))).slice(0,43);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_json_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_json_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{return JSON.parse(String(v||'{}'));}catch(e){return {};}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_json_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_json_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?n:0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_normList_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_normList_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var a=Array.isArray(v)?v:String(v||'').split(',');
  return a.map(function(x){return String(x||'').trim();}).filter(Boolean).filter(function(x,i,self){return self.indexOf(x)===i;});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_normList_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_normList_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_validateBrandScope_(ctx,scope){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_validateBrandScope_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var s=String(scope==null?'*':scope).trim()||'*';
  if(s==='*')return '*';
  var ids=KOL_IDS_PLATFORM_normList_(s);
  if(!ids.length||ids.length>KOL_IDS.MAX_BRAND_SCOPE_COUNT)throw new Error('Invalid Brand Scope.');
  var bsh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.BRANDS),bm=KOL_IDS_PLATFORM_map_(bsh),rows=KOL_IDS_PLATFORM_values_(bsh);
  if(!ids.every(function(id){return rows.some(function(r){return String(r[bm['Brand ID']]).trim()===id&&String(r[bm['Org ID']]).trim()===String(ctx.orgId).trim()&&String(r[bm['Status']]).toUpperCase()==='ACTIVE';});}))throw new Error('Brand Scope contains a brand outside the organization.');
  return ids.join(',');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_validateBrandScope_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_validateBrandScope_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_validateUrl_(url){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_validateUrl_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var u=String(url||'').trim();
  if(!u)throw new Error('URL is required.');
  if(u.length>2048)throw new Error('URL is too long.');
  var m=u.match(/^https:\/\/([^/?:#]+)(?::\d+)?(?:[/?#].*)?$/i);
  if(!m)throw new Error('Only HTTPS integration URLs are allowed.');
  var host=String(m[1]).toLowerCase();
  if(host==='localhost'||host==='0.0.0.0'||host==='127.0.0.1'||host==='::1'||host.endsWith('.local'))throw new Error('Private/local integration hosts are blocked.');
  var parts=host.split('.').map(Number);
  if(parts.length===4&&parts.every(function(n){return isFinite(n)&&n>=0&&n<=255;})){
    var a=parts[0],b=parts[1];
    if(a===10||a===127||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&b===168))throw new Error('Private IP integration hosts are blocked.');
  }
  return u;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_validateUrl_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_validateUrl_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_validateApiFeatures_(features,strict){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_validateApiFeatures_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var f=features||{},names=KOL_IDS_PLATFORM_featureContract_();
  names.forEach(function(n){
    var raw=f[n];
    if(raw==null||raw===''){if(strict)throw new Error('Missing model feature: '+n);return;}
    var v=Number(raw);
    if(!isFinite(v)||Math.abs(v)>KOL_IDS.MODEL_MAX_ABS_FEATURE)throw new Error('Invalid model feature: '+n);
    if(v<0||v>100)throw new Error('Model feature out of semantic range 0..100: '+n);
  });
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_validateApiFeatures_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_validateApiFeatures_', Date.now() - __kolIdsTraceStartedAt);
  }
}
// Enterprise audit is authoritative for the production platform.
KOL_IDS.SHEETS = KOL_IDS.SHEETS || {};
KOL_IDS.SHEETS.AUDIT = 'ENT_AUDIT_LOG';

function KOL_IDS_PLATFORM_error_(code,message){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_error_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var e=new Error(String(message||code));e.code=String(code||'INTERNAL_ERROR');return e;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_error_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_error_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_apiBrandAllowed_(a,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_apiBrandAllowed_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var id=String(brandId||'').trim();if(!id||id==='*')throw new Error('A specific Brand ID is required.');
  var scope=String(a.brandScope||'*').trim()||'*';if(scope!=='*'&&KOL_IDS_PLATFORM_normList_(scope).indexOf(id)<0)throw new Error('API brand scope denied.');
  KOL_IDS_PLATFORM_assertOrgBrand_({ss:a.ss,user:{brandScope:'*'},orgId:a.orgId},id);return id;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_apiBrandAllowed_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_apiBrandAllowed_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- Decision-chain compatibility -------------------- */
function KOL_IDS_PLATFORM_analyze(token,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_analyze');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_CORE_analyze!=='function')throw KOL_IDS_PLATFORM_error_('INTERNAL_ERROR','V5 decision engine is unavailable.');
  return KOL_IDS_CORE_analyze(token,payload||{});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_analyze', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_analyze', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_reanalyzeCampaign(token,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_reanalyzeCampaign');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_SHEETS_reanalyzeCampaign!=='function')throw KOL_IDS_PLATFORM_error_('INTERNAL_ERROR','V21 re-analysis engine is unavailable.');
  return KOL_IDS_SHEETS_reanalyzeCampaign(token,payload||{});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_reanalyzeCampaign', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_reanalyzeCampaign', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- Organization / RBAC -------------------- */
function KOL_IDS_PLATFORM_setupOrganization(name,ownerEmail,plan){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_setupOrganization');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_();
  KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ss);
  var actor=String(KOL_IDS_SECURITY_GET_EMAIL_()||'').trim().toLowerCase();
  var owner=String(ownerEmail||actor).trim().toLowerCase();
  if(!actor)throw new Error('Current user email is unavailable.');
  if(actor!==owner&&KOL_IDS_ENT_ROLE_(actor)!=='ADMIN')throw new Error('Only an administrator can create an organization for another owner.');
  var sh=ss.getSheetByName('ENT_ORGS'),us=ss.getSheetByName('ENT_USERS');
  if(!sh||!us)throw new Error('Enterprise organization sheets are unavailable.');
  var orgName=String(name||'').trim()||'KOL IDS Organization';
  var orgPlan=String(plan||'ENTERPRISE').trim().toUpperCase();
  var om=KOL_IDS_PLATFORM_map_(sh),um=KOL_IDS_PLATFORM_map_(us),rows=KOL_IDS_PLATFORM_values_(sh);
  var existing=rows.find(function(r){return String(r[om['Org Name']]||'').trim()===orgName&&String(r[om['Owner Email']]||'').trim().toLowerCase()===owner&&String(r[om['Status']]||'').trim().toUpperCase()==='ACTIVE';});
  var now=new Date();
  if(existing){
    var existingId=String(existing[om['Org ID']]||'').trim();
    var users=KOL_IDS_PLATFORM_values_(us);
    var hasOwner=users.some(function(r){return String(r[um['Org ID']]||'').trim()===existingId&&String(r[um['Email']]||'').trim().toLowerCase()===owner&&String(r[um['Role']]||'').trim().toUpperCase()==='OWNER'&&String(r[um['Status']]||'').trim().toUpperCase()==='ACTIVE';});
    if(!hasOwner)us.appendRow(KOL_IDS_PLATFORM_row_(us,{'User ID':KOL_IDS_PLATFORM_uuid_('USR'),'Org ID':existingId,'Email':owner,'Role':'OWNER','Brand Scope':'*','Status':'ACTIVE','Created At':now,'Updated At':now}));
    return {success:true,reused:true,orgId:existingId,ownerEmail:owner,plan:orgPlan};
  }
  var id=KOL_IDS_PLATFORM_uuid_('ORG'),uid=KOL_IDS_PLATFORM_uuid_('USR');
  sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Org ID':id,'Org Name':orgName,'Owner Email':owner,'Plan':orgPlan,'Status':'ACTIVE','Created At':now,'Updated At':now}));
  us.appendRow(KOL_IDS_PLATFORM_row_(us,{'User ID':uid,'Org ID':id,'Email':owner,'Role':'OWNER','Brand Scope':'*','Status':'ACTIVE','Created At':now,'Updated At':now}));
  if(typeof KOL_IDS_PLATFORM_audit_==='function'){
    try{KOL_IDS_PLATFORM_audit_(id,'ORG_CREATE','Organization',id,'SUCCESS',{name:orgName,plan:orgPlan});}catch(e){console.warn('Organization audit skipped: '+String(e.message||e));}
  }
  return {success:true,reused:false,orgId:id,ownerEmail:owner,plan:orgPlan};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_setupOrganization', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_setupOrganization', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_addUser(orgId,email,role,brandScope){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_addUser');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN');var target=String(email||'').trim().toLowerCase(),r=String(role||'ANALYST').toUpperCase();
  if(!target)throw new Error('Email is required.'); if(!KOL_IDS.ROLES[r])throw new Error('Invalid role.');
  if(r==='OWNER'&&ctx.role!=='OWNER')throw new Error('Only the organization owner can assign the OWNER role.');
  var scope=KOL_IDS_PLATFORM_validateBrandScope_(ctx,brandScope||'*');
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.USERS),um=KOL_IDS_PLATFORM_map_(sh),users=KOL_IDS_PLATFORM_values_(sh);
  if(users.some(function(u){return String(u[um['Org ID']])===String(orgId)&&String(u[um['Email']]).trim().toLowerCase()===target&&String(u[um['Status']]).toUpperCase()==='ACTIVE';}))throw new Error('An active user with this email already exists in the organization.');
  if(r==='OWNER'&&users.some(function(u){return String(u[um['Org ID']])===String(orgId)&&String(u[um['Role']]).toUpperCase()==='OWNER'&&String(u[um['Status']]).toUpperCase()==='ACTIVE';}))throw new Error('An active OWNER already exists for this organization.');
  var now=new Date();
  sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'User ID':KOL_IDS_PLATFORM_uuid_('USR'),'Org ID':orgId,'Email':target,'Role':r,'Brand Scope':scope,'Status':'ACTIVE','Created At':now,'Updated At':now}));
  KOL_IDS_PLATFORM_audit_(orgId,'USER_ADD','User',target,'SUCCESS',{'role':r,'brandScope':scope});
  return {success:true,email:target,role:r,brandScope:brandScope||'*'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_addUser', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_addUser', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_addBrand(orgId,name,industry,v5BrandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_addBrand');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'STRATEGIST'),brandName=String(name||'').trim();if(!brandName)throw new Error('Brand name is required.');
  var v5id=String(v5BrandId||'').trim();if(v5id){KOL_IDS_PLATFORM_assertBrandBinding_(ctx,v5id,'');}
  // Always resolve the canonical enterprise brand sheet on the authenticated
  // spreadsheet. Other modules may extend KOL_IDS.SHEETS, so never allow a
  // missing/overridden BRANDS alias to produce a null sheet here.
  var sh=ctx.ss.getSheetByName('ENT_BRANDS');
  if(!sh){KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ctx.ss);sh=ctx.ss.getSheetByName('ENT_BRANDS');}
  if(!sh)throw new Error('Enterprise brand sheet ENT_BRANDS is unavailable.');
  var id=KOL_IDS_PLATFORM_uuid_('BRD'),now=new Date();
  sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Brand ID':id,'Org ID':orgId,'Brand Name':brandName,'Status':'ACTIVE','Industry':industry||'','Legacy Brand ID':v5id,'Model ID':'','Created At':now,'Updated At':now}));
  KOL_IDS_PLATFORM_audit_(orgId,'BRAND_CREATE','Brand',id,'SUCCESS',{'name':brandName,'v5BrandId':v5id});
  return {success:true,brandId:id,brandName:brandName,v5BrandId:v5id};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_addBrand', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_addBrand', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_linkBrandToBrand_(orgId,brandId,v5BrandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_linkBrandToBrand_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var id=String(v5BrandId||'').trim();if(!id)throw new Error('Legacy Brand ID is required.');KOL_IDS_PLATFORM_assertBrandBinding_(ctx,id,brandId);var sh=ctx.ss.getSheetByName('ENT_BRANDS');if(!sh){KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ctx.ss);sh=ctx.ss.getSheetByName('ENT_BRANDS');}if(!sh)throw new Error('Enterprise brand sheet ENT_BRANDS is unavailable.');var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh),idx=rows.findIndex(function(r){return String(r[m['Brand ID']])===String(brandId)&&String(r[m['Org ID']])===String(orgId);});if(idx<0)throw new Error('Enterprise brand not found.');sh.getRange(idx+2,m['Legacy Brand ID']+1).setValue(id);sh.getRange(idx+2,m['Updated At']+1).setValue(new Date());KOL_IDS_PLATFORM_audit_(orgId,'BRAND_V5_LINK','Brand',brandId,'SUCCESS',{'v5BrandId':id});return {success:true,brandId:brandId,v5BrandId:id};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_linkBrandToBrand_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_linkBrandToBrand_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_getContext(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_getContext');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'VIEWER');if(brandId)KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);return {success:true,orgId:orgId,brandId:brandId||'',user:ctx.user,role:ctx.role};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_getContext', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_getContext', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_auth_(orgId,minimumRole){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_auth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var requestedOrg=String(orgId||'').trim();if(!requestedOrg)throw new Error('Organization ID is required.');
  var ss=KOL_IDS_PLATFORM_ensure_(),email=String(KOL_IDS_SECURITY_GET_EMAIL_()||'').trim().toLowerCase();
  if(!email)throw new Error('Current user email is unavailable.');
  // Enterprise auth must use the canonical enterprise sheet names directly.
  // Other KOL_IDS modules extend KOL_IDS.SHEETS, so a partial/legacy config
  // must never make ORGS/USERS resolve to undefined during QA seeding.
  var coreSheets=KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ss);
  var ush=coreSheets.users,osh=coreSheets.orgs;
  if(!ush||!osh)throw new Error('Enterprise organization sheets are unavailable.');
  var um=KOL_IDS_PLATFORM_map_(ush),om=KOL_IDS_PLATFORM_map_(osh),users=KOL_IDS_PLATFORM_values_(ush),orgs=KOL_IDS_PLATFORM_values_(osh);
  var u=users.find(function(r){return String(r[um['Org ID']]||'').trim()===requestedOrg&&String(r[um['Email']]||'').trim().toLowerCase()===email&&String(r[um['Status']]||'').trim().toUpperCase()==='ACTIVE';});
  if(!u)throw new Error('Enterprise organization access denied.');
  var org=orgs.find(function(r){return String(r[om['Org ID']]||'').trim()===requestedOrg&&String(r[om['Status']]||'').trim().toUpperCase()==='ACTIVE';});
  if(!org)throw new Error('Organization not found or inactive.');
  var order={VIEWER:1,ANALYST:2,STRATEGIST:3,ADMIN:4,OWNER:5},role=String(u[um['Role']]||'').toUpperCase(),required=String(minimumRole||'VIEWER').toUpperCase();
  if(!order[role]||!order[required]||order[role]<order[required])throw new Error('Insufficient enterprise permission.');
  return {ss:ss,email:email,role:role,orgId:requestedOrg,user:{id:String(u[um['User ID']]||''),email:email,role:role,brandScope:String(u[um['Brand Scope']]||'*').trim()||'*'},securityContext:{organizationVerified:true,userVerified:true,brandScopeVerified:false}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_auth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_auth_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_canBrand_(ctx,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_canBrand_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return !brandId||ctx.user.brandScope==='*'||String(ctx.user.brandScope).split(',').map(function(x){return x.trim();}).indexOf(String(brandId))>=0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_canBrand_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_canBrand_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_requireBrand_(ctx,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_requireBrand_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var id=String(brandId||'').trim();if(!id||id==='*')throw new Error('A specific Brand ID is required for this operation.');if(!KOL_IDS_PLATFORM_canBrand_(ctx,id))throw new Error('Brand scope denied.');var sh=ctx.ss.getSheetByName('ENT_BRANDS');if(!sh){KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ctx.ss);sh=ctx.ss.getSheetByName('ENT_BRANDS');}if(!sh)throw new Error('Enterprise brand sheet ENT_BRANDS is unavailable.');var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh),b=rows.find(function(r){return String(r[m['Brand ID']]||'')===id&&String(r[m['Org ID']]||'')===String(ctx.orgId||'')&&String(r[m['Status']]||'').toUpperCase()==='ACTIVE';});if(!b)throw new Error('Brand not found or inactive in the requested organization.');return id;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_requireBrand_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_requireBrand_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_brandIndex_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_brandIndex_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_PLATFORM_map_(sh);return m['Brand ID']==null?-1:m['Brand ID'];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_brandIndex_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_brandIndex_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_assertOrgBrand_(ctx,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_assertOrgBrand_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var id=String(brandId||'').trim();if(!id||id==='*')return true;if(!KOL_IDS_PLATFORM_canBrand_(ctx,id))throw new Error('Brand scope denied.');var sh=ctx.ss.getSheetByName('ENT_BRANDS');if(!sh){KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ctx.ss);sh=ctx.ss.getSheetByName('ENT_BRANDS');}if(!sh)throw new Error('Enterprise brand sheet ENT_BRANDS is unavailable.');var m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh);var ok=rows.some(function(r){return String(r[m['Brand ID']]||'')===id&&String(r[m['Org ID']]||'')===String(ctx.orgId||'')&&String(r[m['Status']]||'').toUpperCase()==='ACTIVE';});if(!ok)throw new Error('Brand not found or inactive in the requested organization.');return true;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_assertOrgBrand_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_assertOrgBrand_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_assertBrandBinding_(ctx,v5BrandId,enterpriseBrandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_assertBrandBinding_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var id=String(v5BrandId||'').trim(); if(!id) throw new Error('Legacy Brand ID is required.');
  var v5=ctx.ss.getSheetByName('ENT_BRANDS'); if(!v5) throw new Error('ENT_BRANDS sheet not found.');
  var vm=KOL_IDS_PLATFORM_map_(v5),vr=KOL_IDS_PLATFORM_values_(v5),v5idx=vm['Brand ID'];
  if(v5idx==null||!vr.some(function(r){return String(r[v5idx]).trim()===id;})) throw new Error('Legacy Brand ID not found.');
  var bs=ctx.ss.getSheetByName(KOL_IDS.SHEETS.BRANDS),bm=KOL_IDS_PLATFORM_map_(bs),rows=KOL_IDS_PLATFORM_values_(bs);
  var conflict=rows.some(function(r){return String(r[bm['Legacy Brand ID']]).trim()===id && String(r[bm['Org ID']]).trim()!==String(ctx.orgId).trim() && String(r[bm['Status']]).toUpperCase()==='ACTIVE';});
  if(conflict) throw new Error('Legacy Brand ID is already bound to another active organization. Cross-organization binding is blocked.');
  var duplicate=rows.some(function(r){return String(r[bm['Legacy Brand ID']]).trim()===id && String(r[bm['Org ID']]).trim()===String(ctx.orgId).trim() && String(r[bm['Brand ID']]).trim()!==String(enterpriseBrandId||'').trim() && String(r[bm['Status']]).toUpperCase()==='ACTIVE';});
  if(duplicate) throw new Error('Legacy Brand ID is already bound to another active Enterprise Brand in this organization.');
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_assertBrandBinding_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_assertBrandBinding_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_getBrandForOrg_(ctx,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_getBrandForOrg_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_PLATFORM_requireBrand_(ctx,brandId); var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.BRANDS),m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh);
  var r=rows.find(function(x){return String(x[m['Brand ID']])===String(brandId)&&String(x[m['Org ID']])===String(ctx.orgId)&&String(x[m['Status']]).toUpperCase()==='ACTIVE';});
  var id=r?String(r[m['Legacy Brand ID']]||'').trim():''; if(!id) throw new Error('Enterprise Brand is not linked to a V5 Brand. Link it before using historical intelligence.');
  KOL_IDS_PLATFORM_assertBrandBinding_(ctx,id,brandId); return id;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_getBrandForOrg_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_getBrandForOrg_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_featureContract_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_featureContract_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return ['fit','audience','content','objective','confidence'];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_featureContract_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_featureContract_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* -------------------- Creator data warehouse -------------------- */
function KOL_IDS_PLATFORM_creatorPayload_(orgId,brandId,r,source,now){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_creatorPayload_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  r=r||{}; now=now||new Date();
  var creatorId=String(r.creatorId||'').trim();
  if(!creatorId)throw new Error('Creator ID is required.');
  var platform=String(r.platform||'').trim().toUpperCase();
  if(!platform)throw new Error('Platform is required.');
  var observed=r.observedAt||now;
  var raw={creatorId:creatorId,platform:platform,handle:r.handle||'',followers:r.followers,er:r.er,rate:r.rate,currency:r.currency||'THB',category:r.category||'',audience:r.audience||{},content:r.content||{},confidence:r.confidence};
  return {'Record ID':KOL_IDS_PLATFORM_uuid_('CDR'),'Org ID':String(orgId),'Creator ID':creatorId,'Platform':platform,'Handle':r.handle||'',
    'Followers':KOL_IDS_PLATFORM_num_(r.followers),'ER':r.er===''?'':KOL_IDS_PLATFORM_num_(r.er),'Rate':r.rate===''?'':KOL_IDS_PLATFORM_num_(r.rate),'Currency':r.currency||'THB',
    'Category':r.category||'','Audience JSON':JSON.stringify(r.audience||{}),'Content JSON':JSON.stringify(r.content||{}),'Source':String(source||'MANUAL').toUpperCase(),
    'Observed At':observed,'Confidence':r.confidence===''?'':KOL_IDS_PLATFORM_num_(r.confidence),'Raw Hash':KOL_IDS_PLATFORM_hash_(JSON.stringify(raw)),'Status':'ACTIVE','Brand ID':String(brandId||'*')};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_creatorPayload_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_creatorPayload_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_appendCreatorRows_(ss,orgId,brandId,records,source){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_appendCreatorRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock();lock.waitLock(15000);try{
  var sh=ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA),rows=KOL_IDS_PLATFORM_values_(sh),m=KOL_IDS_PLATFORM_map_(sh),existing={};
  rows.forEach(function(r){var h=String(r[m['Raw Hash']]||'');if(String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)&&String(r[m['Status']]).toUpperCase()==='ACTIVE'&&h)existing[h]=true;});
  var out=[],skipped=0;(records||[]).forEach(function(x){if(!x||!x.creatorId)return;var payload=KOL_IDS_PLATFORM_creatorPayload_(orgId,brandId,x,source,new Date()),hash=String(payload['Raw Hash']);if(existing[hash]){skipped++;return;}existing[hash]=true;out.push(payload);});
  if(out.length){var matrix=out.map(function(x){return KOL_IDS_PLATFORM_row_(sh,x);});sh.getRange(sh.getLastRow()+1,1,matrix.length,sh.getLastColumn()).setValues(matrix);}
  return {inserted:out.length,skipped:skipped,recordIds:out.map(function(x){return x['Record ID'];})};
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_appendCreatorRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_appendCreatorRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_upsertCreatorData(orgId,brandId,record){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_upsertCreatorData');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ANALYST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);
  var result=KOL_IDS_PLATFORM_appendCreatorRows_(ctx.ss,orgId,brandId,[record||{}],record&&record.source||'MANUAL');
  KOL_IDS_PLATFORM_audit_(orgId,'CREATOR_DATA_UPSERT','Creator',record&&record.creatorId||'',result.inserted?'SUCCESS':'SKIPPED',{'brandId':brandId,'source':record&&record.source||'MANUAL','skippedDuplicate':!result.inserted});
  return {success:true,recordId:result.recordIds[0]||'',creatorId:record&&record.creatorId||'',source:String(record&&record.source||'MANUAL').toUpperCase(),inserted:result.inserted,skippedDuplicate:result.skipped>0};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_upsertCreatorData', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_upsertCreatorData', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_getCreatorEvidence(orgId,brandId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_getCreatorEvidence');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'VIEWER');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA),m=KOL_IDS_PLATFORM_map_(sh),bi=m['Brand ID'];
  if(bi==null)throw new Error('ENT_CREATOR_DATA is missing Brand ID.');
  var rows=KOL_IDS_PLATFORM_values_(sh).filter(function(r){return String(r[m['Org ID']])===String(orgId)&&String(r[m['Creator ID']])===String(creatorId)&&String(r[m['Status']]).toUpperCase()==='ACTIVE'&&String(r[bi])===String(brandId);});
  rows.sort(function(a,b){var ta=m['Observed At']!=null?new Date(a[m['Observed At']]).getTime():0,tb=m['Observed At']!=null?new Date(b[m['Observed At']]).getTime():0;return tb-ta;});
  return {success:true,creatorId:creatorId,records:rows.map(function(r){return {platform:r[m['Platform']],handle:r[m['Handle']],followers:r[m['Followers']],er:r[m['ER']],rate:r[m['Rate']],currency:r[m['Currency']],category:r[m['Category']],audience:KOL_IDS_PLATFORM_json_(r[m['Audience JSON']]),content:KOL_IDS_PLATFORM_json_(r[m['Content JSON']]),source:r[m['Source']],observedAt:r[m['Observed At']],confidence:r[m['Confidence']],recordId:r[m['Record ID']]};})};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_getCreatorEvidence', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_getCreatorEvidence', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- Benchmarks -------------------- */
function KOL_IDS_PLATFORM_rebuildBenchmarksCore_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_rebuildBenchmarksCore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ANALYST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_PLATFORM_getBrandForOrg_(ctx,brandId);
    var csh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA),cm0=KOL_IDS_PLATFORM_map_(csh);if(cm0['Brand ID']==null)throw KOL_IDS_PLATFORM_error_('SCHEMA','ENT_CREATOR_DATA is missing Brand ID.');
    var data=KOL_IDS_PLATFORM_values_(csh).filter(function(r){return String(r[cm0['Org ID']])===String(orgId)&&String(r[cm0['Status']]).toUpperCase()==='ACTIVE'&&String(r[cm0['Brand ID']])===String(brandId);});
    var groups={};data.forEach(function(r){var key=[r[cm0['Platform']],String(r[cm0['Category']]||'').toLowerCase()].join('|');(groups[key]||(groups[key]=[])).push(r);});
    var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.BENCHMARKS),existing=KOL_IDS_PLATFORM_values_(sh),m=KOL_IDS_PLATFORM_map_(sh),keep=[];
    existing.forEach(function(r){if(!(String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)))keep.push(r);});
    var now=new Date(),out=[];
    Object.keys(groups).forEach(function(key){var g=groups[key],platform=g[0][cm0['Platform']],cat=g[0][cm0['Category']],metrics=[['Followers',cm0['Followers']],['ER',cm0['ER']],['Rate',cm0['Rate']]];
      metrics.forEach(function(mm){var vals=g.map(function(r){return Number(r[mm[1]]);}).filter(function(n){return isFinite(n)&&n>=0;}).sort(function(a,b){return a-b;});if(!vals.length)return;
        var p25=KOL_IDS_PLATFORM_percentile_(vals,.25),med=KOL_IDS_PLATFORM_percentile_(vals,.5),p75=KOL_IDS_PLATFORM_percentile_(vals,.75),mean=vals.reduce(function(a,b){return a+b;},0)/vals.length;
        out.push(KOL_IDS_PLATFORM_row_(sh,{'Benchmark ID':KOL_IDS_PLATFORM_uuid_('BMR'),'Org ID':orgId,'Brand ID':brandId,'Cohort Key':key,'Platform':platform,'Category':cat,'Metric':mm[0],'Sample Size':vals.length,'P25':p25,'Median':med,'P75':p75,'Mean':mean,'Updated At':now,'Confidence':Math.min(100,Math.round(40+Math.log(vals.length+1)*15))}));
      });
    });
    var matrix=keep.concat(out);
    var oldRows=Math.max(sh.getLastRow()-1,0),cols=sh.getLastColumn();if(oldRows>0)sh.getRange(2,1,oldRows,cols).clearContent();if(matrix.length)sh.getRange(2,1,matrix.length,cols).setValues(matrix);
    KOL_IDS_PLATFORM_audit_(orgId,'BENCHMARK_REBUILD','Benchmark',brandId||'*','SUCCESS',{groups:Object.keys(groups).length,rows:out.length,retainedOtherRows:keep.length});
    return {success:true,groups:Object.keys(groups).length,rows:out.length,retainedOtherRows:keep.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_rebuildBenchmarksCore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_rebuildBenchmarksCore_', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_PLATFORM_rebuildBenchmarks(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_rebuildBenchmarks');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var lock=LockService.getScriptLock();if(!lock.tryLock(20000))throw KOL_IDS_PLATFORM_error_('LOCKED','Benchmark rebuild is already running.');try{return KOL_IDS_PLATFORM_rebuildBenchmarksCore_(orgId,brandId);}finally{lock.releaseLock();}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_rebuildBenchmarks', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_rebuildBenchmarks', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_percentile_(a,p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_percentile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!a.length)return 0;var i=(a.length-1)*p,l=Math.floor(i),h=Math.ceil(i);return l===h?a[l]:a[l]+(a[h]-a[l])*(i-l);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_percentile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_percentile_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_getBenchmark(orgId,brandId,platform,category,metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_getBenchmark');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'VIEWER');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.BENCHMARKS),m=KOL_IDS_PLATFORM_map_(sh),bi=m['Brand ID'];
  if(bi==null)throw new Error('ENT_BENCHMARKS is missing Brand ID.');
  var rows=KOL_IDS_PLATFORM_values_(sh).filter(function(r){return String(r[m['Org ID']])===String(orgId)&&String(r[bi])===String(brandId)&&String(r[m['Platform']]).toUpperCase()===String(platform||'').toUpperCase()&&String(r[m['Category']]).toLowerCase()===String(category||'').toLowerCase()&&String(r[m['Metric']]).toUpperCase()===String(metric||'').toUpperCase();});
  rows.sort(function(a,b){return new Date(b[m['Updated At']])-new Date(a[m['Updated At']]);});var r=rows[0];return {success:true,found:!!r,metric:metric,brandId:brandId,benchmark:r?{p25:r[m['P25']],median:r[m['Median']],p75:r[m['P75']],mean:r[m['Mean']],sampleSize:r[m['Sample Size']],confidence:r[m['Confidence']]}:null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_getBenchmark', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_getBenchmark', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- Transparent predictive model -------------------- */
function KOL_IDS_PLATFORM_buildModel(orgId,brandId,options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_buildModel');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'STRATEGIST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_PLATFORM_getBrandForOrg_(ctx,brandId);
  var data=KOL_IDS_PLATFORM_modelDataset_(ctx.ss,orgId,brandId),min=KOL_IDS.MODEL_MIN_TRAIN_ROWS+KOL_IDS.MODEL_MIN_VALIDATION_ROWS;var quality=KOL_IDS_PLATFORM_modelDataQuality_(data);if(!quality.ok)throw new Error('Model blocked by data-quality gate: '+quality.invalidRows+' invalid observations.');
  if(data.length>KOL_IDS.MODEL_MAX_ROWS)data=data.slice(data.length-KOL_IDS.MODEL_MAX_ROWS);
  quality=KOL_IDS_PLATFORM_modelDataQuality_(data);if(!quality.ok)throw new Error('Model blocked after dataset cap: '+quality.reason+'.');
  if(data.length<min)throw new Error('Not enough completed campaign evidence. Need at least '+min+' observations; found '+data.length+'.');
  var campaigns={},creators={};data.forEach(function(d){campaigns[String(d.__campaign||'')]=true;creators[String(d.__creator||'')]=true;});
  if(Object.keys(campaigns).length<KOL_IDS.MODEL_MIN_UNIQUE_CAMPAIGNS)throw new Error('Model blocked: need at least '+KOL_IDS.MODEL_MIN_UNIQUE_CAMPAIGNS+' unique campaigns; found '+Object.keys(campaigns).length+'.');
  if(Object.keys(creators).length<KOL_IDS.MODEL_MIN_UNIQUE_CREATORS)throw new Error('Model blocked: need at least '+KOL_IDS.MODEL_MIN_UNIQUE_CREATORS+' unique creators; found '+Object.keys(creators).length+'.');
  var groups=[];data.forEach(function(d){var id=String(d.__campaign||'');var g=groups.length?groups[groups.length-1]:null;if(!g||g.id!==id){g={id:id,rows:[]};groups.push(g);}g.rows.push(d);});
  var holdoutGroups=Math.max(1,Math.ceil(groups.length*.2)),selected=[],rowsCount=0;for(var gi=groups.length-1;gi>=0&&selected.length<holdoutGroups;gi--){selected.unshift(groups[gi]);rowsCount+=groups[gi].rows.length;if(rowsCount>=KOL_IDS.MODEL_MIN_VALIDATION_ROWS&&selected.length>=holdoutGroups)break;}
  if(selected.length===groups.length)throw new Error('Model blocked: temporal holdout would consume the entire dataset.');
  var holdIds={};selected.forEach(function(g){holdIds[g.id]=true;});var train=data.filter(function(d){return !holdIds[String(d.__campaign||'')];}),test=data.filter(function(d){return !!holdIds[String(d.__campaign||'')];}),features=KOL_IDS_PLATFORM_featureContract_();
  if(test.length<KOL_IDS.MODEL_MIN_VALIDATION_ROWS||train.length<KOL_IDS.MODEL_MIN_TRAIN_ROWS)throw new Error('Model blocked: temporal campaign holdout does not leave enough train/validation rows.');
  var X=train.map(function(d){return features.map(function(f){return KOL_IDS_PLATFORM_num_(d[f]);});}),y=train.map(function(d){return KOL_IDS_PLATFORM_num_(d.target);});
  var coef=KOL_IDS_PLATFORM_ridge_(X,y,.1),pred=function(d){var z=coef.intercept;features.forEach(function(f,i){z+=coef.weights[i]*KOL_IDS_PLATFORM_num_(d[f]);});return Math.max(0,Math.min(100,z));};
  var errors=test.map(function(d){return {actual:d.target,pred:pred(d)};}),mae=errors.reduce(function(s,e){return s+Math.abs(e.actual-e.pred);},0)/errors.length,rmse=Math.sqrt(errors.reduce(function(s,e){return s+Math.pow(e.actual-e.pred,2);},0)/errors.length),r2=KOL_IDS_PLATFORM_r2_(errors);
  var baseline=train.reduce(function(s,d){return s+KOL_IDS_PLATFORM_num_(d.target);},0)/train.length,baselineErrors=test.map(function(d){return {actual:d.target,pred:baseline};}),baselineMae=baselineErrors.reduce(function(s,e){return s+Math.abs(e.actual-e.pred);},0)/baselineErrors.length,baselineRmse=Math.sqrt(baselineErrors.reduce(function(s,e){return s+Math.pow(e.actual-e.pred,2);},0)/baselineErrors.length),baselineR2=KOL_IDS_PLATFORM_r2_(baselineErrors),improvement=baselineMae?1-mae/baselineMae:0;
  var modelId=KOL_IDS_PLATFORM_uuid_('MOD'),now=new Date(),status=(mae<=15&&r2>=KOL_IDS.MODEL_MIN_R2&&improvement>=KOL_IDS.MODEL_MIN_BASELINE_IMPROVEMENT)?'VALIDATED':'RESEARCH',datasetHash=KOL_IDS_PLATFORM_hash_(JSON.stringify(data));
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.MODELS);sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Model ID':modelId,'Org ID':orgId,'Brand ID':brandId||'*','Model Type':'RIDGE_LINEAR','Version':'1.0','Status':status,'Features JSON':JSON.stringify(features),'Coefficients JSON':JSON.stringify(coef.weights),'Intercept':coef.intercept,'Train Rows':train.length,'Validation Rows':test.length,'MAE':mae,'RMSE':rmse,'R2':r2,'Created At':now,'Activated At':status==='VALIDATED'?now:'','Deactivated At':'','Baseline MAE':baselineMae,'Baseline RMSE':baselineRmse,'Baseline R2':baselineR2,'Validation Method':'TEMPORAL_HOLDOUT','Dataset Hash':datasetHash}));
  if(status==='VALIDATED'){var lock=LockService.getScriptLock();lock.waitLock(15000);try{var existing=KOL_IDS_PLATFORM_values_(sh),mm=KOL_IDS_PLATFORM_map_(sh);existing.forEach(function(er,ei){if(String(er[mm['Org ID']])===String(orgId)&&String(er[mm['Brand ID']])===String(brandId)&&String(er[mm['Status']]).toUpperCase()==='VALIDATED'&&String(er[mm['Model ID']])!==String(modelId)){sh.getRange(ei+2,mm['Status']+1).setValue('DEACTIVATED');sh.getRange(ei+2,mm['Deactivated At']+1).setValue(now);}});var bsh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.BRANDS),bbm=KOL_IDS_PLATFORM_map_(bsh),brs=KOL_IDS_PLATFORM_values_(bsh),bidx=brs.findIndex(function(br){return String(br[bbm['Brand ID']])===String(brandId)&&String(br[bbm['Org ID']])===String(orgId);});if(bidx>=0){bsh.getRange(bidx+2,bbm['Model ID']+1).setValue(modelId);bsh.getRange(bidx+2,bbm['Updated At']+1).setValue(now);}}finally{lock.releaseLock();}}
  ctx.ss.getSheetByName(KOL_IDS.SHEETS.MODEL_METRICS).appendRow(KOL_IDS_PLATFORM_row_(ctx.ss.getSheetByName(KOL_IDS.SHEETS.MODEL_METRICS),{'Metric ID':KOL_IDS_PLATFORM_uuid_('MET'),'Model ID':modelId,'Dataset':'HOLDOUT','Rows':test.length,'MAE':mae,'RMSE':rmse,'R2':r2,'Created At':now,'Notes':'Transparent ridge model; activation requires validation gate.','Baseline MAE':baselineMae,'Improvement':improvement,'Validation Method':'TEMPORAL_HOLDOUT','Dataset Hash':datasetHash}));
  KOL_IDS_PLATFORM_audit_(orgId,'MODEL_BUILD','Model',modelId,'SUCCESS',{brandId:brandId,status:status,mae:mae,rmse:rmse,r2:r2});
  return {success:true,modelId,status,trainRows:train.length,validationRows:test.length,mae:mae,rmse:rmse,r2:r2,baselineMae:baselineMae,baselineRmse:baselineRmse,baselineR2:baselineR2,improvement:improvement,validationMethod:'TEMPORAL_HOLDOUT',datasetHash:datasetHash,features:features};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_buildModel', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_buildModel', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_validPerformanceRow_(p,pm,campaignTs){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_validPerformanceRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var cols=['Spend','Reach','Impressions','Views','Engagements','Clicks','Conversions','Revenue'];
  var v={};
  for(var i=0;i<cols.length;i++){
    var c=pm[cols[i]];
    if(c!=null&&p[c]!==''&&p[c]!=null){var n=Number(p[c]);if(!isFinite(n)||n<0)return false;v[cols[i]]=n;}
  }
  if(v.Engagements!=null&&v.Impressions!=null&&v.Engagements>v.Impressions)return false;
  if(v.Clicks!=null&&v.Impressions!=null&&v.Clicks>v.Impressions)return false;
  if(v.Conversions!=null&&v.Clicks!=null&&v.Conversions>v.Clicks)return false;
  if(v.Views!=null&&v.Impressions!=null&&v.Views>v.Impressions*1.25)return false;
  var reported=pm['Reported Date']!=null?new Date(p[pm['Reported Date']]).getTime():0;
  if(reported&&isNaN(reported))return false;
  if(reported&&campaignTs&&reported<campaignTs)return false;
  if(reported&&reported>Date.now()+86400000)return false;
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_validPerformanceRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_validPerformanceRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_modelDataQuality_(data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_modelDataQuality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!data.length)return {ok:false,reason:'No model observations.',invalidRows:0,uniquePairs:0};
  var bad=0,unique={},campaigns={},creators={},minT=Infinity,maxT=0;
  data.forEach(function(d){
    var vals=KOL_IDS_PLATFORM_featureContract_().map(function(n){return Number(d[n]);});
    var invalid=!isFinite(Number(d.target))||Number(d.target)<0||Number(d.target)>100||!isFinite(Number(d.__time))||d.__time<=0||vals.some(function(v){return !isFinite(v)||v<0||v>100;})||!String(d.__campaign||'').trim()||!String(d.__creator||'').trim();
    if(invalid)bad++;
    if(String(d.__campaign||'').trim())campaigns[String(d.__campaign)] = true;
    if(String(d.__creator||'').trim())creators[String(d.__creator)] = true;
    if(isFinite(Number(d.__time))&&d.__time>0){minT=Math.min(minT,Number(d.__time));maxT=Math.max(maxT,Number(d.__time));}
    unique[String(d.__campaign)+'|'+String(d.__creator)]=true;
  });
  var spanDays=isFinite(minT)&&maxT>0?Math.floor((maxT-minT)/86400000):0;
  var ok=bad===0&&Object.keys(campaigns).length>=2&&Object.keys(creators).length>=2&&spanDays>=KOL_IDS.MODEL_MIN_TIME_SPAN_DAYS;
  return {ok:ok,invalidRows:bad,uniquePairs:Object.keys(unique).length,uniqueCampaigns:Object.keys(campaigns).length,uniqueCreators:Object.keys(creators).length,timeSpanDays:spanDays,reason:bad?'Invalid observations':spanDays<KOL_IDS.MODEL_MIN_TIME_SPAN_DAYS?'Insufficient temporal coverage':''};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_modelDataQuality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_modelDataQuality_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_modelDataset_(ss,orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_modelDataset_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var dec=ss.getSheetByName('ENT_DECISIONS'),perf=KOL_IDS_PA_legacyProjection_(ss),camps=ss.getSheetByName('ENT_CAMPAIGNS'),brands=ss.getSheetByName(KOL_IDS.SHEETS.BRANDS);if(!dec||!perf||!camps||!brands)return [];
  var bm=KOL_IDS_PLATFORM_map_(brands),bv=KOL_IDS_PLATFORM_values_(brands),eb=bv.find(function(r){return String(r[bm['Brand ID']])===String(brandId)&&String(r[bm['Org ID']])===String(orgId)&&String(r[bm['Status']]).toUpperCase()==='ACTIVE';});if(!eb)return [];
  var v5BrandId=String(eb[bm['Legacy Brand ID']]||'').trim();if(!v5BrandId)return [];
  var dm=KOL_IDS_PLATFORM_map_(dec),pm=KOL_IDS_PLATFORM_map_(perf),cm=KOL_IDS_PLATFORM_map_(camps),dv=KOL_IDS_PLATFORM_values_(dec),pv=KOL_IDS_PLATFORM_values_(perf),cv=KOL_IDS_PLATFORM_values_(camps),allowed={},campaignTime={},campaignGoal={};
  if(cm['Brand ID']==null||cm['Campaign ID']==null||dm['Campaign ID']==null||dm['Creator ID']==null||pm['Campaign ID']==null||pm['Creator ID']==null)return [];
  cv.forEach(function(c){if(String(c[cm['Brand ID']]||'')===v5BrandId){var id=String(c[cm['Campaign ID']]||'').trim();if(!id)return;allowed[id]=true;var raw=cm['Start Date']!=null?c[cm['Start Date']]:cm['Created At']!=null?c[cm['Created At']]:'';campaignTime[id]=raw?new Date(raw).getTime():0;campaignGoal[id]=String((cm['Campaign Goal']!=null?c[cm['Campaign Goal']]:c[cm['Objective']])||'AWARENESS').trim().toUpperCase();}});
  var by={};pv.forEach(function(p){var status=String(p[pm['Status']]||'').toUpperCase();if(status==='SUPERSEDED'||status==='WAITING_FOR_PERFORMANCE')return;var cid=String(p[pm['Campaign ID']]||'').trim(),cr=String(p[pm['Creator ID']]||'').trim();if(!cid||!cr)return;var key=cid+'|'+cr,ts=pm['Updated At']!=null?new Date(p[pm['Updated At']]).getTime():0;if(!by[key]||ts>=by[key].__time)by[key]=Object.assign({},p,{__time:ts});});
  var out=[];dv.forEach(function(d){var cid=String(d[dm['Campaign ID']]||'').trim(),cr=String(d[dm['Creator ID']]||'').trim();if(!allowed[cid]||!cr)return;var p=by[cid+'|'+cr];if(!p)return;if(!KOL_IDS_PLATFORM_validPerformanceRow_(p,pm,campaignTime[cid]||0))return;var actual=KOL_IDS_PLATFORM_actualGoalScore_(p,campaignGoal[cid]||'AWARENESS',pm);if(actual==null)return;out.push({fit:(KOL_IDS_PLATFORM_num_(d[dm['Brand Fit']])+KOL_IDS_PLATFORM_num_(d[dm['Audience Fit']])+KOL_IDS_PLATFORM_num_(d[dm['Content Fit']])+KOL_IDS_PLATFORM_num_(d[dm['Objective Fit']]))/4,audience:KOL_IDS_PLATFORM_num_(d[dm['Audience Fit']]),content:KOL_IDS_PLATFORM_num_(d[dm['Content Fit']]),objective:KOL_IDS_PLATFORM_num_(d[dm['Objective Fit']]),confidence:KOL_IDS_PLATFORM_num_(d[dm['Confidence Score']]),target:actual,__campaign:cid,__creator:cr,__time:campaignTime[cid]||p.__time||0});});
  out.sort(function(a,b){return a.__time-b.__time;});return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_modelDataset_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_modelDataset_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_actualGoalScore_(p,goal,pm){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_actualGoalScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!pm)return null;
  var spend=KOL_IDS_PLATFORM_num_(pm['Spend']!=null?p[pm['Spend']]:0),reach=KOL_IDS_PLATFORM_num_(pm['Reach']!=null?p[pm['Reach']]:0),imp=KOL_IDS_PLATFORM_num_(pm['Impressions']!=null?p[pm['Impressions']]:0),views=KOL_IDS_PLATFORM_num_(pm['Views']!=null?p[pm['Views']]:0),eng=KOL_IDS_PLATFORM_num_(pm['Engagements']!=null?p[pm['Engagements']]:0),clicks=KOL_IDS_PLATFORM_num_(pm['Clicks']!=null?p[pm['Clicks']]:0),conv=KOL_IDS_PLATFORM_num_(pm['Conversions']!=null?p[pm['Conversions']]:0),rev=KOL_IDS_PLATFORM_num_(pm['Revenue']!=null?p[pm['Revenue']]:0);
  if([spend,reach,imp,views,eng,clicks,conv,rev].some(function(v){return !isFinite(v)||v<0;}))return null;
  if(!(spend>0||reach>0||imp>0||views>0||eng>0||clicks>0||conv>0||rev>0))return null;
  if((imp>0&&eng>imp)||(imp>0&&clicks>imp)||(clicks>0&&conv>clicks)||(imp>0&&views>imp*1.25))return null;
  var g=String(goal||'AWARENESS').toUpperCase(),er=imp>0?eng/imp*100:(reach>0?eng/reach*100:0),ctr=imp>0?clicks/imp*100:(views>0?clicks/views*100:0),cvr=clicks>0?conv/clicks*100:0;
  var reachScore=Math.min(100,reach/2000000*100),viewScore=Math.min(100,views/2000000*100),erScore=Math.min(100,er/8*100),ctrScore=Math.min(100,ctr/5*100),cvrScore=Math.min(100,cvr/8*100);
  var revenueScore=spend>0?Math.min(100,(rev/spend)/6*100):Math.min(100,rev/50000*100);
  if(g==='CONVERSION')return Math.round(revenueScore*.55+cvrScore*.25+ctrScore*.20);
  if(g==='ENGAGEMENT')return Math.round(Math.min(100,erScore*.7+Math.min(100,eng/Math.max(1,reach)*100/.12)*.3));
  if(g==='CONSIDERATION')return Math.round(ctrScore*.4+erScore*.35+cvrScore*.25);
  if(g==='LAUNCH')return Math.round(reachScore*.6+erScore*.25+viewScore*.15);
  return Math.round(reachScore*.7+erScore*.3);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_actualGoalScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_actualGoalScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_ridge_(X,y,lambda){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_ridge_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var p=X[0].length,A=Array.from({length:p+1},function(){return Array(p+1).fill(0);}),b=Array(p+1).fill(0);for(var i=0;i<X.length;i++){var row=[1].concat(X[i]);for(var j=0;j<row.length;j++){b[j]+=row[j]*y[i];for(var k=0;k<row.length;k++)A[j][k]+=row[j]*row[k];}}for(var d=1;d<A.length;d++)A[d][d]+=lambda;var sol=KOL_IDS_PLATFORM_gauss_(A,b);return {intercept:sol[0],weights:sol.slice(1)};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_ridge_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_ridge_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_gauss_(A,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_gauss_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=b.length,M=A.map(function(r,i){return r.slice().concat([b[i]]);});for(var c=0;c<n;c++){var pivot=c;for(var r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[pivot][c]))pivot=r;var tmp=M[c];M[c]=M[pivot];M[pivot]=tmp;var v=M[c][c];if(Math.abs(v)<1e-10)continue;for(var j=c;j<=n;j++)M[c][j]/=v;for(var r2=0;r2<n;r2++){if(r2===c)continue;var f=M[r2][c];for(var j2=c;j2<=n;j2++)M[r2][j2]-=f*M[c][j2];}}return M.map(function(r){return r[n];});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_gauss_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_gauss_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_r2_(errors){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_r2_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!errors.length)return 0;var mean=errors.reduce(function(s,e){return s+e.actual;},0)/errors.length,ssr=errors.reduce(function(s,e){return s+Math.pow(e.actual-e.pred,2);},0),sst=errors.reduce(function(s,e){return s+Math.pow(e.actual-mean,2);},0);return sst?1-ssr/sst:0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_r2_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_r2_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_predict(orgId,brandId,features){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_predict');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'VIEWER'); KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);
  var models=KOL_IDS_PLATFORM_modelIndex_(ctx.ss,orgId,brandId);
  if(!models.length)return {success:true,available:false,reason:'No validated brand model.'};
  var f={};KOL_IDS_PLATFORM_featureContract_().forEach(function(n){f[n]=KOL_IDS_PLATFORM_num_(features&&features[n]);});
  var r=models[0],score=KOL_IDS_PLATFORM_predictWithModel_(r,f);
  return {success:true,available:true,modelId:r[0],score:score,mae:r[11],rmse:r[12],r2:r[13],features:KOL_IDS_PLATFORM_featureContract_()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_predict', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_predict', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_setCurrentOrg(orgId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_setCurrentOrg');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var id=String(orgId||'').trim();if(!id)throw new Error('Organization ID is required.');var ctx=KOL_IDS_PLATFORM_auth_(id,'VIEWER');PropertiesService.getUserProperties().setProperty('KOL_IDS_PLATFORM_CURRENT_ORG',id);return {success:true,orgId:ctx.orgId};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_setCurrentOrg', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_setCurrentOrg', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_currentOrg_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_currentOrg_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ss=KOL_IDS_PLATFORM_ensure_(),email=String(KOL_IDS_SECURITY_GET_EMAIL_()||'').trim().toLowerCase(),users=KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.USERS)),ids=users.filter(function(r){return String(r[2]).trim().toLowerCase()===email&&String(r[5]).toUpperCase()==='ACTIVE';}).map(function(r){return String(r[1]).trim();}).filter(Boolean).filter(function(v,i,a){return a.indexOf(v)===i;});if(!ids.length)return '';var selected=String(PropertiesService.getUserProperties().getProperty('KOL_IDS_PLATFORM_CURRENT_ORG')||'').trim();if(selected){if(ids.indexOf(selected)<0)throw new Error('Selected organization is no longer accessible.');return selected;}if(ids.length===1){PropertiesService.getUserProperties().setProperty('KOL_IDS_PLATFORM_CURRENT_ORG',ids[0]);return ids[0];}throw new Error('Multiple enterprise organizations are available. Set the current organization with KOL_IDS_PLATFORM_setCurrentOrg(orgId) before analyzing.');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_currentOrg_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_currentOrg_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_creatorIndex_(ss,orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_creatorIndex_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA); if(!sh)return {};
  var m=KOL_IDS_PLATFORM_map_(sh), rows=KOL_IDS_PLATFORM_values_(sh), bi=m['Brand ID'], out={};
  rows.forEach(function(r){
    if(String(r[m['Org ID']]||'')!==String(orgId)||String(r[bi]||'')!==String(brandId)||String(r[m['Status']]||'').toUpperCase()!=='ACTIVE')return;
    var id=String(r[m['Creator ID']]||'').trim(); if(!id)return;
    var ts=m['Observed At']!=null?new Date(r[m['Observed At']]).getTime():0;
    if(!out[id]||ts>=out[id].__time){var recency=isFinite(ts)&&ts>0?Math.max(0,Math.min(100,100*Math.exp(-Math.max(0,(Date.now()-ts)/86400000)/180))):0;out[id]=Object.assign({},r,{__time:ts,__recencyScore:Number(recency.toFixed(2))});}
  });
  return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_creatorIndex_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_creatorIndex_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_validateModelRecord_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_validateModelRecord_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!r)throw new Error('Model record is required.');
  if(String(r[5]||'').toUpperCase()!=='VALIDATED')return false;
  var names=KOL_IDS_PLATFORM_json_(r[6]),coefs=KOL_IDS_PLATFORM_json_(r[7]),contract=KOL_IDS_PLATFORM_featureContract_();
  if(!Array.isArray(names)||!Array.isArray(coefs)||names.length!==contract.length||coefs.length!==contract.length)throw new Error('Model feature contract mismatch.');
  if(names.some(function(n,i){return n!==contract[i]||!isFinite(Number(coefs[i]));}))throw new Error('Model feature contract is invalid.');
  if(!isFinite(Number(r[8]))||!isFinite(Number(r[9]))||!isFinite(Number(r[10]))||!isFinite(Number(r[11]))||!isFinite(Number(r[12]))||!isFinite(Number(r[13])))throw new Error('Model metrics are invalid.');
  if(Number(r[9])<KOL_IDS.MODEL_MIN_TRAIN_ROWS||Number(r[10])<KOL_IDS.MODEL_MIN_VALIDATION_ROWS)return false;
  if(Number(r[11])<0||Number(r[12])<0||Number(r[11])>15||Number(r[13])<KOL_IDS.MODEL_MIN_R2)return false;
  var improvement=Number(r[17])>0?1-Number(r[11])/Number(r[17]):0;
  if(Number(r[17])>0&&improvement<KOL_IDS.MODEL_MIN_BASELINE_IMPROVEMENT)return false;
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_validateModelRecord_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_validateModelRecord_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_modelIndex_(ss,orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_modelIndex_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss.getSheetByName(KOL_IDS.SHEETS.MODELS),rows=KOL_IDS_PLATFORM_values_(sh),out=[];
  rows.forEach(function(r){if(String(r[1])===String(orgId)&&String(r[2])===String(brandId)&&String(r[5]).toUpperCase()==='VALIDATED'){try{if(KOL_IDS_PLATFORM_validateModelRecord_(r))out.push(r);}catch(e){}}});
  out.sort(function(a,b){return new Date(b[14])-new Date(a[14]);}); return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_modelIndex_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_modelIndex_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_modelFeaturesFromDecision_(x){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_modelFeaturesFromDecision_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return {fit:(KOL_IDS_PLATFORM_num_(x.brandFit)+KOL_IDS_PLATFORM_num_(x.audienceFit)+KOL_IDS_PLATFORM_num_(x.contentFit)+KOL_IDS_PLATFORM_num_(x.objectiveFit))/4,audience:KOL_IDS_PLATFORM_num_(x.audienceFit),content:KOL_IDS_PLATFORM_num_(x.contentFit),objective:KOL_IDS_PLATFORM_num_(x.objectiveFit),confidence:KOL_IDS_PLATFORM_num_(x.confidenceScore)};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_modelFeaturesFromDecision_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_modelFeaturesFromDecision_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_predictWithModel_(model,features){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_predictWithModel_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_PLATFORM_validateApiFeatures_(features||{},true); KOL_IDS_PLATFORM_validateModelRecord_(model);
  var names=KOL_IDS_PLATFORM_json_(model[6]),coefs=KOL_IDS_PLATFORM_json_(model[7]),score=KOL_IDS_PLATFORM_num_(model[8]);
  names.forEach(function(n,i){score+=KOL_IDS_PLATFORM_num_(coefs[i])*KOL_IDS_PLATFORM_num_(features[n]);});
  if(!isFinite(score))throw new Error('Model prediction is not finite.');
  return Math.max(0,Math.min(100,score));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_predictWithModel_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_predictWithModel_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_enrichDecisionResults_(orgId,brandId,results){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_enrichDecisionResults_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ANALYST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_PLATFORM_getBrandForOrg_(ctx,brandId);
  var ss=ctx.ss,models=KOL_IDS_PLATFORM_modelIndex_(ss,orgId,brandId),model=models[0]||null,creatorIndex=KOL_IDS_PLATFORM_creatorIndex_(ss,orgId,brandId),benchCache={};
  var hasModel=!!model,hasAnyBenchmark=false;
  var rows=(results||[]).map(function(x){
    var category='',platform='',followers=0,rate=KOL_IDS_PLATFORM_num_(x.rateValue),cr=creatorIndex[String(x.creatorId||'').trim()];
    if(cr){platform=cr[3];category=cr[9];followers=KOL_IDS_PLATFORM_num_(cr[5]);if(!rate)rate=KOL_IDS_PLATFORM_num_(cr[7]);}
    var bk=platform+'|'+category,bench=benchCache[bk];
    if(!bench){bench=KOL_IDS_PLATFORM_getBenchmark(orgId,brandId,platform,category,'Rate');benchCache[bk]=bench;}
    if(bench.found)hasAnyBenchmark=true;
    var fair=bench.found?KOL_IDS_PLATFORM_num_(bench.benchmark.median):0,priceRisk='UNKNOWN',priceValue=0;
    if(rate&&fair){priceValue=Math.max(0,Math.min(100,100-Math.abs(rate-fair)/fair*100));priceRisk=rate<=fair*1.1?'LOW':rate<=fair*1.35?'MEDIUM':'HIGH';}
    else if(rate)priceRisk='NO_BENCHMARK';
    var features=KOL_IDS_PLATFORM_modelFeaturesFromDecision_(x);KOL_IDS_PLATFORM_validateApiFeatures_(features,true);var prediction=null;
    if(model)prediction=KOL_IDS_PLATFORM_predictWithModel_(model,features);
    var base=KOL_IDS_PLATFORM_num_(x.score),enterprise=base,parts=1;
    if(priceValue){enterprise+=priceValue*.12;parts+=.12;}if(prediction!=null){enterprise=(enterprise+prediction*.18)/(parts+.18);}
    enterprise=Math.max(0,Math.min(100,Math.round(enterprise*10)/10));
    var cls=enterprise>=75?'STRONG_INVESTMENT':enterprise>=60?'INVESTMENT_CANDIDATE':enterprise>=45?'REVIEW_REQUIRED':'WEAK_INVESTMENT';
    var state=(hasModel?'VALIDATED_MODEL':'RULE_BASED')+(bench.found?' + RATE_BENCHMARK':' + NO_RATE_BENCHMARK');
    return Object.assign({},x,{enterpriseDecisionScore:enterprise,investmentScore:enterprise,enterpriseDecisionClass:cls,fairRate:fair||null,priceValue:Math.round(priceValue*10)/10,priceRisk:priceRisk,benchmarkSampleSize:bench.found?bench.benchmark.sampleSize:0,predictiveScore:prediction,predictiveModelId:model?model[0]:'',enterpriseEvidence:(x.evidence||'')+(model?' | Validated brand model':' | No validated brand model')+(bench.found?' | Peer rate benchmark':' | No peer rate benchmark'),enterpriseDataState:state});
  });
  var status=hasModel&&hasAnyBenchmark?'READY':hasModel||hasAnyBenchmark?'PARTIAL':'DEGRADED';
  return rows.map(function(r){return Object.assign({},r,{enterpriseStatus:status,enterpriseDecisionAvailable:status!=='DEGRADED'||r.enterpriseDecisionScore!=null});});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_enrichDecisionResults_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_enrichDecisionResults_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_revokeApiKey(orgId,keyId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_revokeApiKey');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS),rows=KOL_IDS_PLATFORM_values_(sh),idx=rows.findIndex(function(r){return String(r[0])===String(keyId)&&String(r[1])===String(orgId);});if(idx<0)throw new Error('API key not found.');var m=KOL_IDS_PLATFORM_map_(sh);sh.getRange(idx+2,m['Status']+1).setValue('REVOKED');sh.getRange(idx+2,m['Revoked At']+1).setValue(new Date());KOL_IDS_PLATFORM_audit_(orgId,'API_KEY_REVOKE','API_KEY',keyId,'SUCCESS',{});return {success:true,keyId:keyId};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_revokeApiKey', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_revokeApiKey', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_verifyApiKey_(key){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_verifyApiKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var raw=String(key||'').replace(/^kolid_/i,'').trim();
  if(!raw||raw.length<KOL_IDS.API_KEY_MIN_SECRET_LENGTH||!/^[A-Za-z0-9]+$/.test(raw))throw KOL_IDS_PLATFORM_error_('UNAUTHORIZED','Invalid API key format.');
  var ss=KOL_IDS_PLATFORM_ensure_(),sh=ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS),m=KOL_IDS_PLATFORM_map_(sh),rows=KOL_IDS_PLATFORM_values_(sh),hash=KOL_IDS_PLATFORM_hash_(raw),r=rows.find(function(x){return String(x[m['Secret Hash']])===hash&&String(x[m['Status']]).toUpperCase()==='ACTIVE';});
  if(!r)throw KOL_IDS_PLATFORM_error_('UNAUTHORIZED','Invalid API key.');
  var scopes=KOL_IDS_PLATFORM_json_(r[m['Scopes JSON']]);
  if(!Array.isArray(scopes)||!scopes.length)throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API key has no scopes.');
  return {ss:ss,orgId:String(r[m['Org ID']]),keyId:String(r[m['Key ID']]),scopes:scopes.map(function(x){return String(x).toUpperCase();}),brandScope:String(r[m['Brand Scope']]||'*').trim()||'*'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_verifyApiKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_verifyApiKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_createApiKey(orgId,name,scopes,brandScope){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_createApiKey');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN');
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS),m=KOL_IDS_PLATFORM_map_(sh);
  var requested=KOL_IDS_PLATFORM_normList_(scopes&&scopes.length?scopes:['HEALTH','BENCHMARK','PREDICT','CREATOR_EVIDENCE']).map(function(x){return String(x).toUpperCase();});
  if(!requested.length||requested.length>KOL_IDS.MAX_API_SCOPE_COUNT)throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Invalid API scopes.');
  var allowed=['*','HEALTH','BENCHMARK','PREDICT','CREATOR_EVIDENCE','BENCHMARK_WRITE','CREATOR_WRITE','CAMPAIGN_WRITE','CAMPAIGN_READ','CREATOR_DISCOVERY','CREATOR_MATCHING','MARKETPLACE_WRITE','PREDICTION_WRITE','PREDICTION_READ','MOAT_READ'];
  if(!requested.every(function(x){return allowed.indexOf(x)>=0;}))throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Unsupported API scope.');
  if(requested.indexOf('*')>=0)requested=['*'];
  var scope=KOL_IDS_PLATFORM_validateBrandScope_(ctx,brandScope==null?'*':brandScope);
  var raw=(Utilities.getUuid()+Utilities.getUuid()).replace(/-/g,'').toLowerCase();
  var keyId=KOL_IDS_PLATFORM_uuid_('KEY'),prefix=raw.slice(0,10),now=new Date();
  sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Key ID':keyId,'Org ID':orgId,'Name':String(name||'API Key').trim().slice(0,120),'Key Prefix':'kolid_'+prefix,'Secret Hash':KOL_IDS_PLATFORM_hash_(raw),'Scopes JSON':JSON.stringify(requested),'Brand Scope':scope,'Status':'ACTIVE','Created At':now,'Last Used At':'','Revoked At':''}));
  KOL_IDS_PLATFORM_audit_(orgId,'API_KEY_CREATE','API_KEY',keyId,'SUCCESS',{name:name,scopes:requested,brandScope:scope,keyPrefix:'kolid_'+prefix});
  return {success:true,keyId:keyId,keyPrefix:'kolid_'+prefix,secret:'kolid_'+raw,scopes:requested,brandScope:scope,warning:'Store this secret now. It will not be returned again.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_createApiKey', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_createApiKey', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_listApiKeys(orgId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_listApiKeys');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS),m=KOL_IDS_PLATFORM_map_(sh);
  return {success:true,keys:KOL_IDS_PLATFORM_values_(sh).filter(function(r){return String(r[m['Org ID']])===String(orgId);}).map(function(r){return {keyId:r[m['Key ID']],name:r[m['Name']],keyPrefix:r[m['Key Prefix']],scopes:KOL_IDS_PLATFORM_json_(r[m['Scopes JSON']]),brandScope:r[m['Brand Scope']]||'*',status:r[m['Status']],createdAt:r[m['Created At']],lastUsedAt:r[m['Last Used At']],revokedAt:r[m['Revoked At']]};})};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_listApiKeys', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_listApiKeys', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_PLATFORM_apiScope_(scopes,needed){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_apiScope_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return scopes.indexOf('*')>=0||scopes.map(function(x){return String(x).toUpperCase();}).indexOf(String(needed).toUpperCase())>=0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_apiScope_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_apiScope_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_api_(key,action,payload,verifiedContext){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_api_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var a=verifiedContext||KOL_IDS_PLATFORM_verifyApiKey_(key),p=payload||{},ss=a.ss;
  action=String(action||'').trim().toUpperCase();
  KOL_IDS_HARDENING_RUNTIME_operation_(action);
  if(action==='HEALTH')return {success:true,version:KOL_IDS.VERSION,orgId:a.orgId};
  if(action==='BENCHMARK'){
    if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'BENCHMARK'))throw new Error('API scope denied: BENCHMARK.');KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId);
    var br=KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.BENCHMARKS)).filter(function(r){return String(r[1])===String(a.orgId)&&String(r[4]).toUpperCase()===String(p.platform||'').toUpperCase()&&String(r[5]).toLowerCase()===String(p.category||'').toLowerCase()&&String(r[6]).toUpperCase()===String(p.metric||'').toUpperCase()&&String(r[2])===String(p.brandId);}).sort(function(x,y){return new Date(y[12])-new Date(x[12]);});
    var b=br[0];return {success:true,found:!!b,metric:p.metric,benchmark:b?{p25:b[8],median:b[9],p75:b[10],mean:b[11],sampleSize:b[7],confidence:b[13]}:null};
  }
  if(action==='PREDICT'){
    if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'PREDICT'))throw new Error('API scope denied: PREDICT.');KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId);KOL_IDS_PLATFORM_validateApiFeatures_(p.features||{},true);
    var models=KOL_IDS_PLATFORM_modelIndex_(ss,a.orgId,p.brandId); if(!models.length)return {success:true,available:false,reason:'No validated brand model.'}; var mr=models[0],ff={}; KOL_IDS_PLATFORM_featureContract_().forEach(function(n){ff[n]=KOL_IDS_PLATFORM_num_(p.features&&p.features[n]);}); var score=KOL_IDS_PLATFORM_predictWithModel_(mr,ff); return {success:true,available:true,modelId:mr[0],score:score,mae:mr[11],rmse:mr[12],r2:mr[13],features:KOL_IDS_PLATFORM_featureContract_()};
  }
  if(action==='BENCHMARK_REBUILD'){
    if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'BENCHMARK_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: BENCHMARK_WRITE.');
    KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); KOL_IDS_PLATFORM_requireBrand_({ss:ss,orgId:a.orgId,user:{brandScope:a.brandScope||'*'}},p.brandId);
    var rb=KOL_IDS_PLATFORM_rebuildBenchmarks(a.orgId,p.brandId);
    return {success:true,action:action,orgId:a.orgId,brandId:p.brandId,result:rb};
  }
  if(action==='CREATOR_UPSERT'){
    if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CREATOR_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CREATOR_WRITE.');
    KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); if(!p.record||typeof p.record!=='object'||Array.isArray(p.record))throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','record is required.');
    var up=KOL_IDS_PLATFORM_upsertCreatorData(a.orgId,p.brandId,p.record);
    return Object.assign({success:true,action:action,orgId:a.orgId,brandId:p.brandId},up||{});
  }
  if(action==='CAMPAIGN_CREATE'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GROWTH_createCampaign_(a.orgId,p.brandId,p); }
  if(action==='CAMPAIGN_TRANSITION'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId);if(typeof KOL_IDS_COMPLIANCE_requireCampaignCompliance_==='function')KOL_IDS_COMPLIANCE_requireCampaignCompliance_(a.orgId,p.brandId,p.campaignId,'CAMPAIGN_TRANSITION'); return KOL_IDS_GROWTH_transitionCampaign_(a.orgId,p.brandId,p.campaignId,p.status,p.meta); }
  if(action==='CAMPAIGN_HEALTH'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); var legacyHealth=KOL_IDS_GROWTH_campaignHealth_(a.orgId,p.brandId,p.campaignId); try { legacyHealth.controlTower=KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_(a.orgId,p.brandId,p.campaignId); } catch(controlErr) { legacyHealth.controlTower={success:false,error:String(controlErr&&controlErr.message||controlErr)}; } if(typeof KOL_IDS_COMPLIANCE_campaignCompliance_==='function')legacyHealth.compliance=KOL_IDS_COMPLIANCE_campaignCompliance_(a.orgId,p.brandId,p.campaignId); return legacyHealth; }
  if(action==='CAMPAIGN_PLAN_CREATE'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_CAMPAIGN_CONTROL_createCampaignPlan_(a.orgId,p.brandId,p); }
  if(action==='CAMPAIGN_TASK_UPSERT'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_CAMPAIGN_CONTROL_upsertTask_(a.orgId,p.brandId,p); }
  if(action==='CAMPAIGN_TASK_UPDATE'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_CAMPAIGN_CONTROL_updateTask_(a.orgId,p.brandId,p.taskId,p.status,p.notes); }
  if(action==='CAMPAIGN_BUDGET_RECORD'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_CAMPAIGN_CONTROL_recordBudget_(a.orgId,p.brandId,p); }
  if(action==='CAMPAIGN_KPI_UPSERT'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_CAMPAIGN_CONTROL_upsertKPI_(a.orgId,p.brandId,p); }
  if(action==='CAMPAIGN_RISK_UPSERT'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_CAMPAIGN_CONTROL_upsertRisk_(a.orgId,p.brandId,p); }
  if(action==='CAMPAIGN_GATE_CHECK'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_CAMPAIGN_CONTROL_gateCheck_(a.orgId,p.brandId,p.campaignId,p.targetStage); }
  if(action==='CAMPAIGN_CONTROL_TOWER'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); var tower=KOL_IDS_CAMPAIGN_CONTROL_campaignControlTower_(a.orgId,p.brandId,p.campaignId);if(typeof KOL_IDS_COMPLIANCE_campaignCompliance_==='function')tower.compliance=KOL_IDS_COMPLIANCE_campaignCompliance_(a.orgId,p.brandId,p.campaignId);return tower; }
  if(action==='CREATOR_DISCOVER'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GROWTH_discoverCreators_(a.orgId,p.brandId,p); }
  if(action==='CREATOR_MATCH'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId);if(typeof KOL_IDS_COMPLIANCE_requireCampaignCompliance_==='function')KOL_IDS_COMPLIANCE_requireCampaignCompliance_(a.orgId,p.brandId,p.campaignId,'CREATOR_MATCH'); return KOL_IDS_GROWTH_matchCreators_(a.orgId,p.brandId,p.campaignId,p); }
  if(action==='MARKETPLACE_UPSERT'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'MARKETPLACE_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: MARKETPLACE_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GROWTH_upsertMarketplaceCreator_(a.orgId,p.brandId,p); }
  if(action==='PREDICTION_EVALUATE'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'PREDICTION_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: PREDICTION_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GROWTH_evaluate_(a.orgId,p.brandId,p.recommendationId,p.outcomeId,p.actualValue); }
  if(action==='CALIBRATION_REPORT'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GROWTH_calibrationReport_(a.orgId,p.brandId,p.modelVersion); }
  if(action==='MOAT_HEALTH'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GROWTH_moatHealth_(a.orgId,p.brandId); }
  if(action==='OUTCOME_RECORD'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'PREDICTION_WRITE')&&!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: OUTCOME_RECORD.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId);if(typeof KOL_IDS_COMPLIANCE_requireCampaignCompliance_==='function')KOL_IDS_COMPLIANCE_requireCampaignCompliance_(a.orgId,p.brandId,p.campaignId,'OUTCOME_RECORD'); return KOL_IDS_LEARNING_recordOutcome_(a.orgId,p.brandId,p); }
  if(action==='LEARNING_HEALTH'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_LEARNING_learningHealth_(a.orgId,p.brandId); }
  if(action==='LEARNING_REBUILD'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'PREDICTION_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: LEARNING_REBUILD.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId);if(typeof KOL_IDS_COMPLIANCE_requireCampaignCompliance_==='function')KOL_IDS_COMPLIANCE_requireCampaignCompliance_(a.orgId,p.brandId,p.campaignId||'','LEARNING_REBUILD'); return KOL_IDS_LEARNING_rebuildLearning_(a.orgId,p.brandId); }
  if(action==='LEARNING_SIGNAL'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_LEARNING_applyLearningToMatch_(a.orgId,p.brandId,p.creatorId,p.baseScore,p.objective); }
  if(action==='GOVERNANCE_STATUS'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GOVERNANCE_governanceStatus_(a.orgId,p.brandId); }
  if(action==='GOVERNANCE_CONFIGURE'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GOVERNANCE_governanceConfigure_(a.orgId,p.brandId,p); }
  if(action==='PROCESSING_REGISTER'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GOVERNANCE_processingRegister_(a.orgId,p.brandId,p); }
  if(action==='RETENTION_POLICY'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GOVERNANCE_retentionPolicy_(a.orgId,p.brandId,p); }
  if(action==='DSAR_CREATE'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GOVERNANCE_dsarCreate_(a.orgId,p.brandId,p); }
  if(action==='BREACH_RECORD'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GOVERNANCE_breachRecord_(a.orgId,p.brandId,p); }
  if(action==='PROCESSOR_REGISTER'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); return KOL_IDS_GOVERNANCE_processorRegister_(a.orgId,p); }
  if(action==='TRANSFER_REGISTER'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_GOVERNANCE_transferRegister_(a.orgId,p.brandId,p); }
  if(action==='RETENTION_DRY_RUN'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_COMPLIANCE_retentionRun_({dryRun:true,maxItems:p.maxItems,orgId:a.orgId,brandId:p.brandId}); }
  if(action==='RETENTION_RUN'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_COMPLIANCE_retentionRun_({dryRun:false,maxItems:p.maxItems,orgId:a.orgId,brandId:p.brandId}); }
  if(action==='RETENTION_TRIGGER_INSTALL'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); return KOL_IDS_COMPLIANCE_installRetentionTrigger_(); }
  if(action==='LEGAL_HOLD_CREATE'){ if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CAMPAIGN_WRITE'))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: CAMPAIGN_WRITE.'); KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_COMPLIANCE_legalHoldCreate_(a.orgId,p.brandId,p); }
  if(action==='CAMPAIGN_COMPLIANCE'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_COMPLIANCE_campaignCompliance_(a.orgId,p.brandId,p.campaignId); }
  if(action==='WEBAPP_PREFLIGHT'){ return KOL_IDS_ORCHESTRATOR_webAppPreflight_(); }
  if(action==='RUNTIME_SMOKE_TEST'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_(a.orgId,p.brandId); }
  if(action==='FLYWHEEL_DRY_RUN'){ KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId); return KOL_IDS_ORCHESTRATOR_flywheelDryRun_(a.orgId,p.brandId,p.campaignId); }
  if(action==='CREATOR_EVIDENCE'){
    if(!KOL_IDS_PLATFORM_apiScope_(a.scopes,'CREATOR_EVIDENCE'))throw new Error('API scope denied: CREATOR_EVIDENCE.');KOL_IDS_PLATFORM_apiBrandAllowed_(a,p.brandId);var csh=ss.getSheetByName('ENT_CREATOR_DATA'),cmm=KOL_IDS_PLATFORM_map_(csh);
    var cr=KOL_IDS_PLATFORM_values_(csh).filter(function(r){return String(r[cmm['Org ID']])===String(a.orgId)&&String(r[cmm['Creator ID']])===String(p.creatorId)&&String(r[cmm['Status']]).toUpperCase()==='ACTIVE'&&String(r[cmm['Brand ID']])===String(p.brandId);}).sort(function(x,y){return new Date(y[cmm['Observed At']])-new Date(x[cmm['Observed At']]);});return {success:true,creatorId:p.creatorId,records:cr.map(function(r){return {recordId:r[cmm['Record ID']],platform:r[cmm['Platform']],handle:r[cmm['Handle']],followers:r[cmm['Followers']],er:r[cmm['ER']],rate:r[cmm['Rate']],currency:r[cmm['Currency']],category:r[cmm['Category']],audience:KOL_IDS_PLATFORM_json_(r[cmm['Audience JSON']]),content:KOL_IDS_PLATFORM_json_(r[cmm['Content JSON']]),source:r[cmm['Source']],observedAt:r[cmm['Observed At']],confidence:r[cmm['Confidence']]};})};
  }
  throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Unsupported API action.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_api_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_api_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function doPost(e){
  KOL_IDS_TRACE_ENTER_('doPost');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var requestId=KOL_IDS_HARDENING_RUNTIME_requestId_();
  try{
    var rawBody=String((e&&e.postData&&e.postData.contents)||'');
    if(rawBody.length>KOL_IDS.MAX_API_BODY_BYTES)throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Request body too large.');
    var body=JSON.parse(rawBody||'{}');
    if(!body||typeof body!=='object'||Array.isArray(body))throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Request body must be a JSON object.');
    var result=KOL_IDS_HARDENING_RUNTIME_apiGate_(e,body,requestId);
    result.requestId=requestId;
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    var msg=String(err&&err.message||err),code=String(err&&err.code||'INTERNAL_ERROR');
    if(!err.code)code=/rate limit|quota/i.test(msg)?'RATE_LIMITED':/scope denied|permission|access denied|forbidden/i.test(msg)?'FORBIDDEN':/invalid api key|authentication|unauthorized/i.test(msg)?'UNAUTHORIZED':/request body|JSON|too large|invalid request/i.test(msg)?'INVALID_REQUEST':/not found/i.test(msg)?'NOT_FOUND':'INTERNAL_ERROR';
    return ContentService.createTextOutput(JSON.stringify({success:false,code:code,error:msg,requestId:requestId,apiVersion:KOL_IDS.VERSION})).setMimeType(ContentService.MimeType.JSON);
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('doPost', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('doPost', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- Ingestion / scheduling -------------------- */
function KOL_IDS_PLATFORM_scheduleMinutes_(schedule){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_scheduleMinutes_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var s=String(schedule||'').trim().toUpperCase();
  var map={EVERY_15_MINUTES:15,EVERY_30_MINUTES:30,EVERY_HOUR:60,EVERY_6_HOURS:360,EVERY_12_HOURS:720,DAILY:1440,WEEKLY:10080};
  if(map[s])return map[s];
  var m=s.match(/^EVERY_(\d+)_MINUTES?$/);if(m&&Number(m[1])>0&&Number(m[1])<=10080)return Number(m[1]);
  var h=s.match(/^EVERY_(\d+)_HOURS?$/);if(h&&Number(h[1])>0&&Number(h[1])<=168)return Number(h[1])*60;
  throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Unsupported ingestion schedule: '+s);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_scheduleMinutes_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_scheduleMinutes_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_nextRun_(from,schedule){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_nextRun_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var base=from instanceof Date&&!isNaN(from.getTime())?new Date(from.getTime()):new Date();
  return new Date(base.getTime()+KOL_IDS_PLATFORM_scheduleMinutes_(schedule)*60000);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_nextRun_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_nextRun_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_createIntegration(orgId,brandId,provider,type,baseUrl,authType,secret,config){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_createIntegration');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);
  var url=KOL_IDS_PLATFORM_validateUrl_(baseUrl),at=String(authType||'NONE').trim().toUpperCase();
  if(['NONE','BEARER','API_KEY','HEADER'].indexOf(at)<0)throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Unsupported integration auth type.');
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.INTEGRATIONS),id=KOL_IDS_PLATFORM_uuid_('INT'),secretProperty='';
  if(secret){secretProperty='KOL_IDS_INT_SECRET_'+id;PropertiesService.getScriptProperties().setProperty(secretProperty,String(secret));}
  var safeConfig=config&&typeof config==='object'&&!Array.isArray(config)?Object.assign({},config):{};
  delete safeConfig.secret;delete safeConfig.apiKey;delete safeConfig.token;delete safeConfig.password;
  var now=new Date();
  sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Integration ID':id,'Org ID':orgId,'Brand ID':brandId,'Provider':String(provider||'GENERIC').trim().slice(0,80),'Type':String(type||'CREATOR_DATA').trim().toUpperCase(),'Base URL':url,'Auth Type':at,'Secret Property':secretProperty,'Status':'ACTIVE','Config JSON':JSON.stringify(safeConfig),'Created At':now,'Updated At':now}));
  KOL_IDS_PLATFORM_audit_(orgId,'INTEGRATION_CREATE','Integration',id,'SUCCESS',{brandId:brandId,provider:provider,type:type,authType:at});
  return {success:true,integrationId:id,brandId:brandId,provider:provider,type:type,authType:at,secretConfigured:!!secret};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_createIntegration', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_createIntegration', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_normalizeIngestionRecords_(payload,config){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_normalizeIngestionRecords_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  config=config&&typeof config==='object'?config:{};var value=payload,path=String(config.recordsPath||'').trim();
  if(path){path.split('.').filter(Boolean).forEach(function(k){if(value!=null)value=value[k];});}
  if(value&&Array.isArray(value.records))value=value.records;else if(value&&Array.isArray(value.data))value=value.data;else if(value&&Array.isArray(value.creators))value=value.creators;else if(value&&Array.isArray(value.items))value=value.items;
  if(!Array.isArray(value))value=[value];
  return value.map(function(x){x=x&&typeof x==='object'?x:{};return {
    creatorId:String(x.creatorId!=null?x.creatorId:(x.id!=null?x.id:(x.creator_id!=null?x.creator_id:''))).trim(),
    platform:String(x.platform!=null?x.platform:(x.network!=null?x.network:(x.channel!=null?x.channel:''))).trim().toUpperCase(),
    handle:x.handle!=null?x.handle:(x.username!=null?x.username:(x.screenName||'')),followers:x.followers!=null?x.followers:(x.followerCount!=null?x.followerCount:x.followers_count),
    er:x.er!=null?x.er:(x.engagementRate!=null?x.engagementRate:x.engagement_rate),rate:x.rate!=null?x.rate:(x.price!=null?x.price:x.fee),currency:x.currency||config.defaultCurrency||'THB',
    category:x.category||x.niche||'',audience:x.audience||x.audienceProfile||{},content:x.content||x.contentProfile||{},confidence:x.confidence==null?'':x.confidence,observedAt:x.observedAt||x.observed_at||new Date()
  };}).filter(function(x){return !!x.creatorId&&!!x.platform;});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_normalizeIngestionRecords_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_normalizeIngestionRecords_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_runIngestionInternal_(jobId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_runIngestionInternal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_(),jsh=ss.getSheetByName(KOL_IDS.SHEETS.INGEST),jm=KOL_IDS_PLATFORM_map_(jsh),jobs=KOL_IDS_PLATFORM_values_(jsh),ji=jobs.findIndex(function(r){return String(r[jm['Job ID']])===String(jobId);});
  if(ji<0)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Ingestion job not found.');
  var job=jobs[ji],orgId=String(job[jm['Org ID']]),brandId=String(job[jm['Brand ID']]),integrationId=String(job[jm['Integration ID']]);
  if(String(job[jm['Status']]).toUpperCase()!=='ACTIVE')throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Ingestion job is not active.');
  var ish=ss.getSheetByName(KOL_IDS.SHEETS.INTEGRATIONS),im=KOL_IDS_PLATFORM_map_(ish),ints=KOL_IDS_PLATFORM_values_(ish),ir=ints.find(function(r){return String(r[im['Integration ID']])===integrationId&&String(r[im['Org ID']])===orgId&&String(r[im['Brand ID']])===brandId&&String(r[im['Status']]).toUpperCase()==='ACTIVE';});
  if(!ir)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Active integration not found for ingestion job.');
  var url=KOL_IDS_PLATFORM_validateUrl_(ir[im['Base URL']]),auth=String(ir[im['Auth Type']]||'NONE').toUpperCase(),secret=ir[im['Secret Property']]?PropertiesService.getScriptProperties().getProperty(String(ir[im['Secret Property']]))||'':'';
  var cfg=KOL_IDS_PLATFORM_json_(ir[im['Config JSON']]),headers=Object.assign({},cfg.headers||{});delete headers.Authorization;delete headers.authorization;
  if(auth==='BEARER'&&secret)headers.Authorization='Bearer '+secret;if(auth==='API_KEY'&&secret)headers['X-API-Key']=secret;
  if(auth==='HEADER'&&secret){var h=String(cfg.secretHeader||'X-API-Key').trim();if(!/^[A-Za-z0-9-]{1,64}$/.test(h))throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Invalid integration secret header.');headers[h]=secret;}
  var method=String(cfg.method||'get').toLowerCase()==='post'?'post':'get',options={method:method,contentType:'application/json',headers:headers,muteHttpExceptions:true,followRedirects:false};
  if(method==='post'&&cfg.requestBody!==undefined)options.payload=JSON.stringify(cfg.requestBody);
  var resp=UrlFetchApp.fetch(url,options),code=resp.getResponseCode(),text=resp.getContentText();if(code<200||code>=300)throw KOL_IDS_PLATFORM_error_('UPSTREAM_ERROR','Integration returned HTTP '+code+'.');
  var parsed;try{parsed=JSON.parse(text||'{}');}catch(e){throw KOL_IDS_PLATFORM_error_('UPSTREAM_ERROR','Integration response was not valid JSON.');}
  var records=KOL_IDS_PLATFORM_normalizeIngestionRecords_(parsed,cfg),result=KOL_IDS_PLATFORM_appendCreatorRows_(ss,orgId,brandId,records,'API'),now=new Date(),next=KOL_IDS_PLATFORM_nextRun_(now,job[jm['Schedule']]);
  jsh.getRange(ji+2,jm['Last Run']+1).setValue(now);jsh.getRange(ji+2,jm['Next Run']+1).setValue(next);jsh.getRange(ji+2,jm['Rows Imported']+1).setValue(result.inserted);jsh.getRange(ji+2,jm['Last Error']+1).setValue('');jsh.getRange(ji+2,jm['Updated At']+1).setValue(now);
  KOL_IDS_PLATFORM_audit_(orgId,'INGEST_RUN','IngestionJob',jobId,'SUCCESS',{brandId:brandId,integrationId:integrationId,received:records.length,inserted:result.inserted,skipped:result.skipped});return {success:true,jobId:jobId,received:records.length,inserted:result.inserted,skipped:result.skipped,nextRun:next};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_runIngestionInternal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_runIngestionInternal_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_createIngestionJob(orgId,brandId,integrationId,schedule){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_createIngestionJob');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ANALYST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var normalized=String(schedule||'').toUpperCase();KOL_IDS_PLATFORM_scheduleMinutes_(normalized);
  var ish=ctx.ss.getSheetByName(KOL_IDS.SHEETS.INTEGRATIONS),im=KOL_IDS_PLATFORM_map_(ish),ir=KOL_IDS_PLATFORM_values_(ish).find(function(r){return String(r[im['Integration ID']])===String(integrationId)&&String(r[im['Org ID']])===String(orgId)&&String(r[im['Brand ID']])===String(brandId)&&String(r[im['Status']]).toUpperCase()==='ACTIVE';});if(!ir)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Active integration not found.');
  var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.INGEST),id=KOL_IDS_PLATFORM_uuid_('JOB'),now=new Date(),next=KOL_IDS_PLATFORM_nextRun_(now,normalized);sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Job ID':id,'Org ID':orgId,'Brand ID':brandId,'Integration ID':integrationId,'Schedule':normalized,'Status':'ACTIVE','Last Run':'','Next Run':next,'Rows Imported':0,'Last Error':'','Created At':now,'Updated At':now}));KOL_IDS_PLATFORM_audit_(orgId,'INGEST_JOB_CREATE','IngestionJob',id,'SUCCESS',{brandId:brandId,integrationId:integrationId,schedule:normalized});return {success:true,jobId:id,nextRun:next,schedule:normalized};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_createIngestionJob', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_createIngestionJob', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_runIngestion(orgId,jobId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_runIngestion');
  var __kolIdsTraceStartedAt = Date.now();
  try {
KOL_IDS_PLATFORM_auth_(orgId,'ANALYST');var result=KOL_IDS_PLATFORM_runIngestionInternal_(jobId);if(String(result.jobId)!==String(jobId))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','Ingestion job mismatch.');return result;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_runIngestion', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_runIngestion', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_runScheduledIngestion(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_runScheduledIngestion');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_(),sh=ss.getSheetByName(KOL_IDS.SHEETS.INGEST),m=KOL_IDS_PLATFORM_map_(sh),now=new Date(),jobs=KOL_IDS_PLATFORM_values_(sh),results=[];
  jobs.forEach(function(r){if(results.length>=10)return;if(String(r[m['Status']]).toUpperCase()!=='ACTIVE')return;var next=r[m['Next Run']]?new Date(r[m['Next Run']]):now;if(isNaN(next.getTime())||next<=now){var id=String(r[m['Job ID']]);try{results.push(KOL_IDS_PLATFORM_runIngestionInternal_(id));}catch(e){var idx=jobs.indexOf(r);sh.getRange(idx+2,m['Last Run']+1).setValue(now);sh.getRange(idx+2,m['Last Error']+1).setValue(String(e.message||e).slice(0,500));sh.getRange(idx+2,m['Next Run']+1).setValue(KOL_IDS_PLATFORM_nextRun_(now,r[m['Schedule']]||'EVERY_6_HOURS'));results.push({success:false,jobId:id,error:String(e.message||e)});}}});
  return {success:results.every(function(x){return x.success!==false;}),processed:results.length,results:results,runAt:now};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_runScheduledIngestion', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_runScheduledIngestion', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- Marketing-stack integrations -------------------- */
function KOL_IDS_PLATFORM_sendWebhook(orgId,brandId,event,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_sendWebhook');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ANALYST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var rows=KOL_IDS_PLATFORM_values_(ctx.ss.getSheetByName(KOL_IDS.SHEETS.INTEGRATIONS)).filter(function(r){return String(r[1])===String(orgId)&&String(r[2])===String(brandId||'*')&&String(r[4]).toUpperCase()==='WEBHOOK'&&String(r[8]).toUpperCase()==='ACTIVE';});
  var sent=0,errors=[];(rows.length?rows:[null]).forEach(function(r){if(!r)return;try{var cfg=KOL_IDS_PLATFORM_json_(r[9]),url=KOL_IDS_PLATFORM_validateUrl_(r[5]),body=JSON.stringify({event:event,orgId:orgId,brandId:brandId||'',sentAt:new Date().toISOString(),data:payload||{}});if(body.length>KOL_IDS.MAX_WEBHOOK_PAYLOAD_BYTES)throw new Error('Webhook payload too large.');var headers=Object.assign({},cfg.headers||{}),secret=PropertiesService.getScriptProperties().getProperty(String(r[7]||''))||'';if(String(r[6]).toUpperCase()==='BEARER'&&secret)headers.Authorization='Bearer '+secret;var resp=UrlFetchApp.fetch(url,{method:'post',contentType:'application/json',headers:headers,payload:body,muteHttpExceptions:true,followRedirects:false});if(resp.getResponseCode()>=200&&resp.getResponseCode()<300)sent++;else errors.push('HTTP '+resp.getResponseCode());}catch(e){errors.push(String(e.message||e));}});
  KOL_IDS_PLATFORM_audit_(orgId,'WEBHOOK_SEND','Integration',event,errors.length?'PARTIAL':'SUCCESS',{brandId:brandId,sent:sent,errors:errors});return {success:errors.length===0,sent:sent,errors:errors};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_sendWebhook', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_sendWebhook', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_integrationTest(orgId,integrationId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_integrationTest');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),rows=KOL_IDS_PLATFORM_values_(ctx.ss.getSheetByName(KOL_IDS.SHEETS.INTEGRATIONS)),r=rows.find(function(x){return String(x[0])===String(integrationId)&&String(x[1])===String(orgId);});if(!r)throw new Error('Integration not found.');KOL_IDS_PLATFORM_requireBrand_(ctx,r[2]);var secret=PropertiesService.getScriptProperties().getProperty(String(r[7])||'')||'',headers={'Accept':'application/json'};if(String(r[6]).toUpperCase()==='BEARER'&&secret)headers.Authorization='Bearer '+secret;var resp=UrlFetchApp.fetch(KOL_IDS_PLATFORM_validateUrl_(r[5]),{method:'get',headers:headers,muteHttpExceptions:true,followRedirects:false});return {success:resp.getResponseCode()>=200&&resp.getResponseCode()<300,integrationId:integrationId,httpStatus:resp.getResponseCode()};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_integrationTest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_integrationTest', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- SLA / onboarding / consulting / dashboard -------------------- */
function KOL_IDS_PLATFORM_createOnboarding(orgId,brandId,owner,targetDate){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_createOnboarding');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'STRATEGIST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.ONBOARDING),id=KOL_IDS_PLATFORM_uuid_('ONB'),check=['Organization configured','Users configured','Brand profile complete','Creator data connected','Benchmarks built','First decision completed','Performance tracking configured','Report reviewed'];sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Onboarding ID':id,'Org ID':orgId,'Brand ID':brandId||'*','Owner':owner||ctx.email,'Status':'IN_PROGRESS','Step':1,'Checklist JSON':JSON.stringify(check.map(function(x){return {item:x,done:false};})),'Started At':new Date(),'Target Date':targetDate||'','Completed At':'','Notes':''}));return {success:true,onboardingId:id,steps:check};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_createOnboarding', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_createOnboarding', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_updateOnboarding(orgId,id,completedIndexes,notes){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_updateOnboarding');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'STRATEGIST'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.ONBOARDING),rows=KOL_IDS_PLATFORM_values_(sh),idx=rows.findIndex(function(r){return String(r[0])===String(id)&&String(r[1])===String(orgId);});if(idx<0)throw new Error('Onboarding not found.');KOL_IDS_PLATFORM_requireBrand_(ctx,rows[idx][2]);var items=KOL_IDS_PLATFORM_json_(rows[idx][6]);(completedIndexes||[]).forEach(function(i){if(items[i])items[i].done=true;});var done=items.filter(function(x){return x.done;}).length,complete=done===items.length;sh.getRange(idx+2,KOL_IDS_PLATFORM_map_(sh)['Step']+1).setValue(Math.min(items.length,done+1));sh.getRange(idx+2,KOL_IDS_PLATFORM_map_(sh)['Checklist JSON']+1).setValue(JSON.stringify(items));sh.getRange(idx+2,KOL_IDS_PLATFORM_map_(sh)['Status']+1).setValue(complete?'COMPLETED':'IN_PROGRESS');if(complete)sh.getRange(idx+2,KOL_IDS_PLATFORM_map_(sh)['Completed At']+1).setValue(new Date());if(notes!=null)sh.getRange(idx+2,KOL_IDS_PLATFORM_map_(sh)['Notes']+1).setValue(notes);return {success:true,completed:done,total:items.length,status:complete?'COMPLETED':'IN_PROGRESS'};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_updateOnboarding', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_updateOnboarding', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_createSLATicket(orgId,brandId,severity,summary,targetMinutes){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_createSLATicket');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.SLA),id=KOL_IDS_PLATFORM_uuid_('SLA'),mins=Number(targetMinutes)||({P1:60,P2:240,P3:1440,P4:4320}[String(severity||'P3').toUpperCase()]||1440);sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Ticket ID':id,'Org ID':orgId,'Brand ID':brandId||'*','Severity':String(severity||'P3').toUpperCase(),'Status':'OPEN','Opened At':new Date(),'First Response At':'','Resolved At':'','Target Minutes':mins,'Actual Minutes':'','Breach':'NO','Owner':'','Summary':summary||''}));return {success:true,ticketId:id,targetMinutes:mins};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_createSLATicket', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_createSLATicket', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_resolveSLA(orgId,ticketId,owner){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_resolveSLA');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.SLA),rows=KOL_IDS_PLATFORM_values_(sh),idx=rows.findIndex(function(r){return String(r[0])===String(ticketId)&&String(r[1])===String(orgId);});if(idx<0)throw new Error('SLA ticket not found.');var m=KOL_IDS_PLATFORM_map_(sh),opened=new Date(rows[idx][m['Opened At']]),now=new Date(),actual=Math.max(0,Math.round((now-opened)/60000)),target=Number(rows[idx][m['Target Minutes']])||0;sh.getRange(idx+2,m['Status']+1).setValue('RESOLVED');sh.getRange(idx+2,m['Resolved At']+1).setValue(now);sh.getRange(idx+2,m['Actual Minutes']+1).setValue(actual);sh.getRange(idx+2,m['Breach']+1).setValue(actual>target?'YES':'NO');sh.getRange(idx+2,m['Owner']+1).setValue(owner||ctx.email);return {success:true,ticketId:ticketId,actualMinutes:actual,breach:actual>target};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_resolveSLA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_resolveSLA', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_createConsulting(orgId,brandId,type,objective,deliverable){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_createConsulting');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'STRATEGIST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CONSULTING),id=KOL_IDS_PLATFORM_uuid_('CON'),now=new Date();sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Engagement ID':id,'Org ID':orgId,'Brand ID':brandId||'*','Type':type||'STRATEGY','Status':'OPEN','Lead':ctx.email,'Start Date':now,'End Date':'','Objective':objective||'','Deliverable':deliverable||'','Recommendation':'','Created At':now,'Updated At':now}));return {success:true,engagementId:id};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_createConsulting', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_createConsulting', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_configDashboard(orgId,brandId,widgets){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_configDashboard');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.DASHBOARD),now=new Date();(widgets||[]).forEach(function(w,i){sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Config ID':KOL_IDS_PLATFORM_uuid_('DASH'),'Org ID':orgId,'Brand ID':brandId||'*','Widget Key':w.key,'Position':w.position==null?i:w.position,'Visible':w.visible!==false,'Config JSON':JSON.stringify(w.config||{}),'Updated At':now}));});return {success:true,count:(widgets||[]).length};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_configDashboard', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_configDashboard', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_enterpriseDashboard(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_enterpriseDashboard');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,'VIEWER');if(brandId)KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);var result={success:true,version:KOL_IDS.VERSION,orgId:orgId,brandId:brandId||'',user:ctx.user,widgets:{}};var benches=KOL_IDS_PLATFORM_values_(ctx.ss.getSheetByName(KOL_IDS.SHEETS.BENCHMARKS)).filter(function(r){return String(r[1])===String(orgId)&&(brandId?String(r[2])===String(brandId):true);});var models=KOL_IDS_PLATFORM_values_(ctx.ss.getSheetByName(KOL_IDS.SHEETS.MODELS)).filter(function(r){return String(r[1])===String(orgId)&&(brandId?String(r[2])===String(brandId):true);});result.widgets.benchmarkCoverage={rows:benches.length};result.widgets.validatedModels=models.filter(function(r){return String(r[5]).toUpperCase()==='VALIDATED';}).length;result.widgets.openSLA=KOL_IDS_PLATFORM_values_(ctx.ss.getSheetByName(KOL_IDS.SHEETS.SLA)).filter(function(r){return String(r[1])===String(orgId)&&String(r[4]).toUpperCase()!=='RESOLVED';}).length;result.widgets.onboarding=KOL_IDS_PLATFORM_values_(ctx.ss.getSheetByName(KOL_IDS.SHEETS.ONBOARDING)).filter(function(r){return String(r[1])===String(orgId)&&(brandId?String(r[2])===String(brandId):true)&&String(r[4]).toUpperCase()!=='COMPLETED';}).length;return result;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_enterpriseDashboard', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_enterpriseDashboard', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* -------------------- Security audit -------------------- */
function KOL_IDS_PLATFORM_audit_(orgId,action,entityType,entityId,outcome,details){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_audit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{
    var ss=KOL_IDS_PLATFORM_ensure_(),sh=ss.getSheetByName('ENT_AUDIT_LOG');
    if(!sh)sh=KOL_IDS_PLATFORM_ensureSheet_(ss,'ENT_AUDIT_LOG',KOL_IDS_PLATFORM_headers_().ENT_AUDIT_LOG);
    var m=KOL_IDS_PLATFORM_map_(sh),email='SYSTEM';try{email=KOL_IDS_SECURITY_GET_EMAIL_();}catch(e){}
    var safe=JSON.stringify(details||{}),requestId=Utilities.getUuid(),rows=KOL_IDS_PLATFORM_values_(sh),prev=rows.length?String(rows[rows.length-1][m['Event Hash']]||''):'',detailsHash=KOL_IDS_PLATFORM_hash_(safe),eventHash=KOL_IDS_PLATFORM_hash_([prev,requestId,orgId||'',email,action,entityType,entityId||'',outcome,detailsHash].join('|'));
    sh.appendRow(KOL_IDS_PLATFORM_row_(sh,{'Event ID':KOL_IDS_PLATFORM_uuid_('AUD'),'Timestamp':new Date(),'Org ID':orgId||'','Actor':email,'Action':action,'Entity Type':entityType,'Entity ID':entityId||'','Outcome':outcome,'Request ID':requestId,'IP/Source':'Apps Script','Previous Hash':prev,'Details Hash':detailsHash,'Event Hash':eventHash,'Details':safe.slice(0,8000)}));
  }catch(ignore){console.warn('Enterprise audit failed: '+ignore.message);}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_audit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_audit_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_securityCheck(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_securityCheck');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ss=KOL_IDS_PLATFORM_ensure_(),props=PropertiesService.getScriptProperties(),ash=ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS),am=KOL_IDS_PLATFORM_map_(ash),keys=KOL_IDS_PLATFORM_values_(ash),active=keys.filter(function(r){return String(r[am['Status']]).toUpperCase()==='ACTIVE';}).length;return {success:true,version:KOL_IDS.VERSION,identity:KOL_IDS_SECURITY_GET_EMAIL_(),apiKeysActive:active,secretConfigured:!!props.getProperty('KOL_IDS_CORE_SECRET'),sheets:Object.keys(KOL_IDS.SHEETS).length};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_securityCheck', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_securityCheck', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_repairDataIsolation(options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_repairDataIsolation');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  options=options||{};var dryRun=options.dryRun===true,ss=KOL_IDS_PLATFORM_ensure_(),lock=LockService.getScriptLock();
  if(!lock.tryLock(20000))throw KOL_IDS_PLATFORM_error_('LOCKED','Another Enterprise migration is already running.');
  var changed=[];
  try{
    var csh=ss.getSheetByName(KOL_IDS.SHEETS.CREATOR_DATA),cm=KOL_IDS_PLATFORM_map_(csh),brandCol=cm['Brand ID'];
    if(brandCol==null){if(dryRun)return {success:true,dryRun:true,assigned:0,quarantined:0,skipped:0,rebuildRequired:false,warning:'Brand ID column is missing and dry-run cannot mutate schema.'};csh.getRange(1,csh.getLastColumn()+1).setValue('Brand ID');cm=KOL_IDS_PLATFORM_map_(csh);brandCol=cm['Brand ID'];}
    var rows=KOL_IDS_PLATFORM_values_(csh),dec=ss.getSheetByName('ENT_DECISIONS'),camp=ss.getSheetByName('ENT_CAMPAIGNS'),v5ToEnterprise={},brandByCampaign={},creatorBrands={};
    var bsh=ss.getSheetByName(KOL_IDS.SHEETS.BRANDS),bm=KOL_IDS_PLATFORM_map_(bsh),brows=KOL_IDS_PLATFORM_values_(bsh);
    brows.forEach(function(r){var v5=String(r[bm['Legacy Brand ID']]||'').trim(),org=String(r[bm['Org ID']]||'').trim(),eid=String(r[bm['Brand ID']]||'').trim();if(v5&&org&&eid&&String(r[bm['Status']]).toUpperCase()==='ACTIVE'){var key=org+'|'+v5;(v5ToEnterprise[key]||(v5ToEnterprise[key]=[])).push(eid);}});
    if(dec&&camp){var dm=KOL_IDS_PLATFORM_map_(dec),cpm=KOL_IDS_PLATFORM_map_(camp),campRows=KOL_IDS_PLATFORM_values_(camp),decRows=KOL_IDS_PLATFORM_values_(dec);if(cpm['Brand ID']==null||cpm['Campaign ID']==null||dm['Campaign ID']==null||dm['Creator ID']==null)throw KOL_IDS_PLATFORM_error_('MIGRATION_SCHEMA','Required V5 campaign/decision columns are missing.');campRows.forEach(function(r){var cid=String(r[cpm['Campaign ID']]||'').trim(),v5b=String(r[cpm['Brand ID']]||'').trim();if(cid&&v5b)brandByCampaign[cid]=v5b;});decRows.forEach(function(d){var creator=String(d[dm['Creator ID']]||'').trim(),v5b=brandByCampaign[String(d[dm['Campaign ID']]||'').trim()];if(creator&&v5b)(creatorBrands[creator]||(creatorBrands[creator]={}))[v5b]=true;});}
    var assigned=0,quarantined=0,skipped=0,plan=[],affectedBrands={};
    rows.forEach(function(r,i){var current=String(r[brandCol]||'').trim();if(current){skipped++;return;}var org=String(r[cm['Org ID']]||'').trim(),creator=String(r[cm['Creator ID']]||'').trim(),v5ids=Object.keys(creatorBrands[creator]||{}),candidates=[];v5ids.forEach(function(v5){(v5ToEnterprise[org+'|'+v5]||[]).forEach(function(eid){if(candidates.indexOf(eid)<0)candidates.push(eid);});});var value=candidates.length===1?candidates[0]:'*';plan.push({row:i+2,value:value,orgId:org,brandId:value,old:r[brandCol]||''});if(value==='*')quarantined++;else{assigned++;affectedBrands[org+'|'+value]=true;}});
    if(dryRun){return {success:true,dryRun:true,assigned:assigned,quarantined:quarantined,skipped:skipped,creatorRows:rows.length,purgedBenchmarks:0,rebuildRequired:assigned>0,rebuildBrands:Object.keys(affectedBrands).length,planSample:plan.slice(0,25),rule:'Only uniquely provable Org+Brand mappings are assigned; ambiguous/unverifiable records remain quarantined.'};}
    // Two-phase commit: snapshot changed cells, mutate, rebuild, verify; rollback Creator Data on failure.
    plan.forEach(function(x){if(String(rows[x.row-2][brandCol]||'').trim()!==String(x.value).trim()){changed.push({row:x.row,old:rows[x.row-2][brandCol]||'',value:x.value});csh.getRange(x.row,brandCol+1).setValue(x.value);}});
    var rebuildResults=[],rebuildErrors=[];Object.keys(affectedBrands).forEach(function(key){var parts=key.split('|');try{rebuildResults.push(KOL_IDS_PLATFORM_rebuildBenchmarksCore_(parts[0],parts.slice(1).join('|')));}catch(e){rebuildErrors.push({orgId:parts[0],brandId:parts.slice(1).join('|'),error:String(e.message||e)});}});
    if(rebuildErrors.length){changed.reverse().forEach(function(x){csh.getRange(x.row,brandCol+1).setValue(x.old);});KOL_IDS_PLATFORM_audit_('', 'DATA_ISOLATION_REPAIR','CreatorData','ENT_CREATOR_DATA','ROLLED_BACK',{assigned:assigned,quarantined:quarantined,skipped:skipped,rebuildErrors:rebuildErrors.length});throw KOL_IDS_PLATFORM_error_('MIGRATION_ROLLBACK','Migration rolled back because one or more affected benchmark rebuilds failed.');}
    KOL_IDS_PLATFORM_audit_('', 'DATA_ISOLATION_REPAIR','CreatorData','ENT_CREATOR_DATA','SUCCESS',{assigned:assigned,quarantined:quarantined,skipped:skipped,rebuildBrands:Object.keys(affectedBrands).length,dryRun:false});
    return {success:true,dryRun:false,assigned:assigned,quarantined:quarantined,skipped:skipped,creatorRows:rows.length,purgedBenchmarks:0,rebuildRequired:assigned>0,rebuildBrands:Object.keys(affectedBrands).length,rebuildResults:rebuildResults,rebuildErrors:[]};
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_repairDataIsolation', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_repairDataIsolation', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PLATFORM_INTEGRATION_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_INTEGRATION_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var required={
    foundation:['KOL_IDS_SYSTEM_getSpreadsheet_','KOL_IDS_SECURITY_GET_EMAIL_'],
    decision:['KOL_IDS_CORE_analyze','KOL_IDS_SHEETS_reanalyzeCampaign'],
    enterprise:['KOL_IDS_PLATFORM_auth_','KOL_IDS_PLATFORM_requireBrand_','KOL_IDS_PLATFORM_enrichDecisionResults_','KOL_IDS_PLATFORM_analyze','KOL_IDS_PLATFORM_reanalyzeCampaign'],
    data:['KOL_IDS_PLATFORM_upsertCreatorData','KOL_IDS_PLATFORM_getCreatorEvidence','KOL_IDS_PLATFORM_rebuildBenchmarks'],
    model:['KOL_IDS_PLATFORM_buildModel','KOL_IDS_PLATFORM_predict','KOL_IDS_PLATFORM_modelDataset_','KOL_IDS_PLATFORM_predictWithModel_'],
    platform:['KOL_IDS_PLATFORM_createIntegration','KOL_IDS_PLATFORM_createIngestionJob','KOL_IDS_PLATFORM_runIngestion','KOL_IDS_PLATFORM_runScheduledIngestion','KOL_IDS_PLATFORM_normalizeIngestionRecords_','KOL_IDS_PLATFORM_scheduleMinutes_','KOL_IDS_PLATFORM_nextRun_','KOL_IDS_PLATFORM_api_','doPost','KOL_IDS_PLATFORM_sendWebhook'],
    ops:['KOL_IDS_PLATFORM_createOnboarding','KOL_IDS_PLATFORM_updateOnboarding','KOL_IDS_PLATFORM_createSLATicket','KOL_IDS_PLATFORM_resolveSLA','KOL_IDS_PLATFORM_createConsulting','KOL_IDS_PLATFORM_enterpriseDashboard']
  };
  var checks=[],passed=0,total=0;
  Object.keys(required).forEach(function(group){required[group].forEach(function(name){total++;var ok=typeof this[name]==='function';if(ok)passed++;checks.push({group:group,name:name,pass:ok});},this);});
  var specs=KOL_IDS_PLATFORM_headers_(),schemaOk=Object.keys(specs).every(function(name){return specs[name]&&specs[name].length>0;});total++;if(schemaOk)passed++;checks.push({group:'schema',name:'enterprise schema definitions',pass:schemaOk});
  return {success:passed===total,version:KOL_IDS.VERSION,passed:passed,tests:total,checks:checks};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_INTEGRATION_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_INTEGRATION_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PLATFORM_PRODUCTION_READINESS(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_PRODUCTION_READINESS');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_(),failures=[],notices=[];
  function req(cond,code,msg){if(!cond)failures.push({code:code,message:msg});}
  try{
    var specs=KOL_IDS_PLATFORM_headers_();Object.keys(specs).forEach(function(n){var sh=ss.getSheetByName(n);req(!!sh,'MISSING_SHEET',n);if(sh){var m=KOL_IDS_PLATFORM_map_(sh);specs[n].forEach(function(h){req(m[h]!=null,'MISSING_HEADER',n+':'+h);});}});
    req(KOL_IDS.MODEL_MIN_TRAIN_ROWS>=20,'MODEL_TRAIN_GATE','Training minimum is below production floor.');
    req(KOL_IDS.MODEL_MIN_VALIDATION_ROWS>=8,'MODEL_VALIDATION_GATE','Validation minimum is below production floor.');
    req(KOL_IDS.MODEL_MIN_R2>=0.15,'MODEL_R2_GATE','R2 gate is below production floor.');
    req(KOL_IDS.MODEL_MIN_BASELINE_IMPROVEMENT>=0.05,'MODEL_BASELINE_GATE','Baseline improvement gate is below production floor.');
    req(KOL_IDS.MODEL_MIN_UNIQUE_CAMPAIGNS>=12,'MODEL_CAMPAIGN_GATE','Unique campaign gate is below production floor.');
    req(KOL_IDS.MODEL_MIN_UNIQUE_CREATORS>=8,'MODEL_CREATOR_GATE','Unique creator gate is below production floor.');
    req(KOL_IDS.MAX_API_BODY_BYTES<=1000000,'API_BODY_GATE','API body limit is unexpectedly high.');
    req(KOL_IDS.MAX_WEBHOOK_PAYLOAD_BYTES<=1000000,'WEBHOOK_BODY_GATE','Webhook payload limit is unexpectedly high.');
    req(typeof KOL_IDS_LEARNING_contractQA_==='function'&&typeof KOL_IDS_LEARNING_recordOutcome_==='function'&&typeof KOL_IDS_LEARNING_learningHealth_==='function','OUTCOME_LEARNING_CONTRACT','Outcome Learning Engine is not fully wired.');
    req(KOL_IDS_PLATFORM_featureContract_().length===5,'FEATURE_CONTRACT','Unexpected model feature contract length.');
    try{KOL_IDS_PLATFORM_validateApiFeatures_({fit:50,audience:50,content:50,objective:50,confidence:50},true);}catch(e){req(false,'FEATURE_VALIDATION','Semantic feature validation failed: '+e.message);}
    try{KOL_IDS_PLATFORM_validateApiFeatures_({fit:-1,audience:50,content:50,objective:50,confidence:50},true);req(false,'FEATURE_NEGATIVE_GATE','Negative feature unexpectedly accepted.');}catch(e){}
    try{KOL_IDS_PLATFORM_validateUrl_('http://localhost');req(false,'URL_GATE','Unsafe URL unexpectedly accepted.');}catch(e){}
  }catch(e){failures.push({code:'QA_RUNTIME',message:String(e.message||e)});}
  return {success:failures.length===0,version:KOL_IDS.VERSION,failures:failures,notices:notices,checkedAt:new Date()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_PRODUCTION_READINESS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_PRODUCTION_READINESS', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * PUBLIC one-click platform schema migration/verification.
 * Run this from the Apps Script editor after installing the release.
 */
function KOL_IDS_PLATFORM_SCHEMA_MIGRATE(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_SCHEMA_MIGRATE');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    var ss = KOL_IDS_PLATFORM_ensure_();
    var sh = ss.getSheetByName('ENT_BRANDS');
    if (!sh) throw new Error('ENT_BRANDS was not created.');
    var last = Math.max(1, sh.getLastColumn());
    var headers = sh.getRange(1,1,1,last).getValues()[0].map(String);
    var hasLegacy = headers.indexOf('Legacy Brand ID') >= 0;
    var hasOld = headers.indexOf('V5 Brand ID') >= 0;
    if (!hasLegacy || hasOld) {
      throw new Error('ENT_BRANDS schema migration incomplete. Legacy Brand ID='+hasLegacy+', old customer-facing header present='+hasOld);
    }
    var result = {
      success: true,
      status: 'GREEN',
      sheet: 'ENT_BRANDS',
      legacyBrandIdHeader: true,
      oldCustomerHeaderRemoved: true,
      headers: headers,
      durationMs: Date.now() - __kolIdsTraceStartedAt
    };
    Logger.log('[PLATFORM_SCHEMA_MIGRATE_RESULT] '+JSON.stringify(result));
    return result;
  } catch (e) {
    var result = {success:false,status:'RED',error:String(e.message||e),durationMs:Date.now()-__kolIdsTraceStartedAt};
    Logger.log('[PLATFORM_SCHEMA_MIGRATE_RESULT] '+JSON.stringify(result));
    throw e;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_SCHEMA_MIGRATE', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Backward-compatible internal alias retained for enterprise static QA and older callers. */
function KOL_IDS_HARDENING_rateLimit_(clientId, accessKey, source, orgId){
  return KOL_IDS_HARDENING_RUNTIME_rateLimit_(clientId, accessKey, source, orgId);
}

function KOL_IDS_HARDENING_findIdempotency_(operation,idempotencyKey,orgId,brandId){
  return KOL_IDS_HARDENING_RUNTIME_findIdempotency_(operation,idempotencyKey,orgId,brandId);
}

function KOL_IDS_HARDENING_ensureIdempotencySheet_(){
  return KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_();
}

function KOL_IDS_PLATFORM_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PLATFORM_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var failures=[],notices=[],ss,checks=0,passed=0;
  function KOL_IDS_PLATFORM_enterpriseT_(name,value,detail){checks++;if(value)passed++;else failures.push({name:name,detail:detail||''});}
  function w(name,value,detail){if(!value)notices.push({name:name,detail:detail||''});}
  try{
    ss=KOL_IDS_PLATFORM_ensure_();var specs=KOL_IDS_PLATFORM_headers_();Object.keys(specs).forEach(function(name){KOL_IDS_PLATFORM_ensureSheet_(ss,name,specs[name]);});
    KOL_IDS_PLATFORM_enterpriseT_('enterprise sheets',Object.keys(specs).every(function(k){return !!ss.getSheetByName(k);}),'Missing one or more required enterprise sheets.');
    Object.keys(specs).forEach(function(name){var sh=ss.getSheetByName(name),m=KOL_IDS_PLATFORM_map_(sh);specs[name].forEach(function(h){KOL_IDS_PLATFORM_enterpriseT_('schema:'+name+':'+h,m[h]!=null,'Sheet: '+name+' | Header: '+h);});});
    KOL_IDS_PLATFORM_enterpriseT_('roles',Object.keys(KOL_IDS.ROLES).length===5,'Expected 5 enterprise roles.');
    KOL_IDS_PLATFORM_enterpriseT_('write/admin role hierarchy',KOL_IDS.WRITE_ROLES.indexOf('ANALYST')>=0&&KOL_IDS.ADMIN_ROLES.indexOf('ADMIN')>=0,'RBAC role sets are incomplete.');
    KOL_IDS_PLATFORM_enterpriseT_('model thresholds',KOL_IDS.MODEL_MIN_TRAIN_ROWS>=20&&KOL_IDS.MODEL_MIN_VALIDATION_ROWS>=8&&KOL_IDS.MODEL_MIN_R2>=0.15&&KOL_IDS.MODEL_MIN_BASELINE_IMPROVEMENT>=0.05,'Model validation thresholds are too weak.');
    KOL_IDS_PLATFORM_enterpriseT_('api rate limit',KOL_IDS.MAX_API_PER_MINUTE>0&&KOL_IDS.MAX_API_PER_MINUTE<=600,'API rate limit must be positive and bounded.');
    KOL_IDS_PLATFORM_enterpriseT_('hash',KOL_IDS_PLATFORM_hash_('qa').length>=40,'SHA-256 hash helper failed.');
    var csh=ss.getSheetByName('ENT_CREATOR_DATA'),cm=KOL_IDS_PLATFORM_map_(csh),cr=KOL_IDS_PLATFORM_values_(csh),bi=cm['Brand ID'];KOL_IDS_PLATFORM_enterpriseT_('creator brand isolation column',bi!=null,'Sheet: ENT_CREATOR_DATA | Header: Brand ID');
    var unscoped=bi==null?cr.length:cr.filter(function(r){return !String(r[bi]||'').trim()||String(r[bi]).trim()==='*';}).length;w('legacy creator rows quarantined',unscoped===0,'Unscoped legacy creator rows: '+unscoped+'; they are excluded from brand benchmarks.');
    var bsh=ss.getSheetByName('ENT_BENCHMARKS'),br=KOL_IDS_PLATFORM_values_(bsh),badBench=br.filter(function(r){return !String(r[2]||'').trim()||String(r[2]).trim()==='*';}).length;w('benchmark rows brand-scoped',badBench===0,'Unscoped benchmark rows: '+badBench+'. Rebuild benchmarks per brand after migration.');
    var models=KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.MODELS));KOL_IDS_PLATFORM_enterpriseT_('no invalid active models',models.filter(function(r){return String(r[5]).toUpperCase()==='VALIDATED'&&(!isFinite(Number(r[11]))||!isFinite(Number(r[13]))||Number(r[11])>15||Number(r[13])<KOL_IDS.MODEL_MIN_R2);}).length===0,'A validated model violates the current validation gate.');
    var apish=ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS),apim=KOL_IDS_PLATFORM_map_(apish),dupApi={};KOL_IDS_PLATFORM_values_(apish).filter(function(r){return String(r[apim['Status']]).toUpperCase()==='ACTIVE';}).forEach(function(r){var k=String(r[apim['Secret Hash']]||'');if(k)dupApi[k]=(dupApi[k]||0)+1;});KOL_IDS_PLATFORM_enterpriseT_('api key hash uniqueness',Object.keys(dupApi).every(function(k){return dupApi[k]===1;}),'Duplicate active API key hashes detected.');
    var audit=ss.getSheetByName('ENT_AUDIT_LOG');var ah=audit&&audit.getLastColumn()>0?audit.getRange(1,1,1,audit.getLastColumn()).getValues()[0].map(String):[];var ahs={};ah.forEach(function(h){ahs[String(h||'').trim()]=true;});KOL_IDS_PLATFORM_enterpriseT_('audit integrity',!!audit&&['Request ID','Details Hash','Event Hash','Previous Hash'].every(function(h){return ahs[h]===true;}),'ENT_AUDIT_LOG must retain Request ID, Details Hash, Event Hash and Previous Hash.');
    var dashboard=ss.getSheetByName(KOL_IDS.SHEETS.ONBOARDING),od=dashboard?KOL_IDS_PLATFORM_values_(dashboard):[];KOL_IDS_PLATFORM_enterpriseT_('onboarding status column',!dashboard||KOL_IDS_PLATFORM_map_(dashboard)['Status']!=null,'Sheet: ENT_ONBOARDING | Header: Status');
    var bm=KOL_IDS_PLATFORM_map_(bsh);KOL_IDS_PLATFORM_enterpriseT_('benchmark schema brand column',bm['Brand ID']!=null,'Sheet: ENT_BENCHMARKS | Header: Brand ID');
    KOL_IDS_PLATFORM_enterpriseT_('benchmark rows never wildcard',br.every(function(r){return String(r[bm['Brand ID']]||'').trim()!=='*';}),'Derived benchmark rows must always belong to one specific Brand ID.');
    KOL_IDS_PLATFORM_enterpriseT_('brand scoped integration rows',KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.INTEGRATIONS)).every(function(r){return !String(r[0]||'').trim()||String(r[2]||'').trim()!=='*';}),'Enterprise integrations must be attached to a specific Brand ID.');
    KOL_IDS_PLATFORM_enterpriseT_('brand scoped ingestion rows',KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.INGEST)).every(function(r){return !String(r[0]||'').trim()||String(r[2]||'').trim()!=='*';}),'Enterprise ingestion jobs must target a specific Brand ID.');
    KOL_IDS_PLATFORM_enterpriseT_('onboarding rows brand scoped',od.every(function(r){return !String(r[0]||'').trim()||String(r[2]||'').trim()!=='*';}),'Onboarding records must target a specific Brand ID.');
    KOL_IDS_PLATFORM_enterpriseT_('security hardening helpers',typeof KOL_IDS_PLATFORM_requireBrand_==='function'&&typeof KOL_IDS_PLATFORM_assertOrgBrand_==='function','Brand enforcement helpers are missing.');
    KOL_IDS_PLATFORM_enterpriseT_('schedule dispatcher helpers',typeof KOL_IDS_PLATFORM_scheduleMinutes_==='function'&&typeof KOL_IDS_PLATFORM_nextRun_==='function','Schedule helpers are missing.');
    KOL_IDS_PLATFORM_enterpriseT_('schedule values valid',KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.INGEST)).filter(function(r){return String(r[5]).toUpperCase()==='ACTIVE';}).every(function(r){try{KOL_IDS_PLATFORM_scheduleMinutes_(r[4]||'EVERY_6_HOURS');return true;}catch(e){return false;}}),'One or more active ingestion jobs have an unsupported Schedule.');
    var creatorHashes={};cr.forEach(function(r){var h=String(r[cm['Raw Hash']]||'');if(h){var key=[r[cm['Org ID']],r[bi],h].join('|');creatorHashes[key]=(creatorHashes[key]||0)+1;}});
    KOL_IDS_PLATFORM_enterpriseT_('creator duplicate snapshots',Object.keys(creatorHashes).every(function(k){return creatorHashes[k]===1;}),'Duplicate active creator snapshots detected for the same organization/brand/hash.');
    KOL_IDS_PLATFORM_enterpriseT_('api key scopes normalized',KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS)).every(function(r){if(!String(r[0]||'').trim())return true;var s=KOL_IDS_PLATFORM_json_(r[5]);return Array.isArray(s)&&s.length>0&&s.every(function(x){return ['*','HEALTH','BENCHMARK','PREDICT','CREATOR_EVIDENCE','BENCHMARK_WRITE','CREATOR_WRITE','CAMPAIGN_WRITE','CAMPAIGN_READ','CREATOR_DISCOVERY','CREATOR_MATCHING','MARKETPLACE_WRITE','PREDICTION_WRITE','PREDICTION_READ','MOAT_READ'].indexOf(String(x).toUpperCase())>=0;});}),'API key scopes contain invalid values.');
    KOL_IDS_PLATFORM_enterpriseT_('api key brand scopes valid',KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.API_KEYS)).every(function(r){if(!String(r[0]||'').trim())return true;var bs=String(r[6]||'*').trim();return bs==='*'||bs.split(',').every(function(id){return KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.BRANDS)).some(function(b){return String(b[0])===id&&String(b[1])===String(r[1])&&String(b[3]).toUpperCase()==='ACTIVE';});});}),'API key references a brand outside its organization.');
    KOL_IDS_PLATFORM_enterpriseT_('integration urls hardened',KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.INTEGRATIONS)).every(function(r){if(!String(r[0]||'').trim())return true;try{KOL_IDS_PLATFORM_validateUrl_(r[5]);return true;}catch(e){return false;}}),'One or more integration URLs are not allowed.');
    KOL_IDS_PLATFORM_enterpriseT_('audit hash chain fields',!!audit&&ahs['Previous Hash']===true&&ahs['Event Hash']===true,'ENT_AUDIT_LOG must expose Previous Hash and Event Hash.');
    KOL_IDS_PLATFORM_enterpriseT_('feature contract order stable',JSON.stringify(KOL_IDS_PLATFORM_featureContract_())===JSON.stringify(['fit','audience','content','objective','confidence']),'Training and inference feature contract must be identical.');
    KOL_IDS_PLATFORM_enterpriseT_('active model registry consistency',KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.MODELS)).filter(function(r){return String(r[5]).toUpperCase()==='VALIDATED';}).every(function(r){try{return KOL_IDS_PLATFORM_validateModelRecord_(r);}catch(e){return false;}}),'One or more validated models fail contract/metric validation.');
    var activeV5={};KOL_IDS_PLATFORM_values_(ss.getSheetByName(KOL_IDS.SHEETS.BRANDS)).forEach(function(r){if(String(r[3]).toUpperCase()==='ACTIVE'&&String(r[5]||'').trim()){var k=String(r[1])+'|'+String(r[5]).trim();activeV5[k]=(activeV5[k]||0)+1;}});KOL_IDS_PLATFORM_enterpriseT_('v5 binding uniqueness',Object.keys(activeV5).every(function(k){return activeV5[k]===1;}),'A V5 Brand ID is bound more than once within the same organization.');
    KOL_IDS_PLATFORM_enterpriseT_('integration chain',typeof KOL_IDS_PLATFORM_enrichDecisionResults_==='function'&&typeof KOL_IDS_PLATFORM_predictWithModel_==='function'&&typeof KOL_IDS_PLATFORM_creatorIndex_==='function','Enterprise enrichment dependencies are incomplete.');
    KOL_IDS_PLATFORM_enterpriseT_('outcome learning engine',typeof KOL_IDS_LEARNING_contractQA_==='function'&&typeof KOL_IDS_LEARNING_recordOutcome_==='function'&&typeof KOL_IDS_LEARNING_learningHealth_==='function','Outcome Learning engine dependencies are incomplete.');
    KOL_IDS_PLATFORM_enterpriseT_('feature contract bounded',KOL_IDS_PLATFORM_featureContract_().length===5&&KOL_IDS_PLATFORM_featureContract_().every(function(x){return typeof x==='string'&&x.length>0;}),'Feature contract is invalid.');
    KOL_IDS_PLATFORM_enterpriseT_('semantic feature validator',KOL_IDS_PLATFORM_validateApiFeatures_({fit:0,audience:50,content:100,objective:75,confidence:80},true)===true,'Semantic feature range validation is unavailable.');
    KOL_IDS_PLATFORM_enterpriseT_('migration is non-destructive',(/purgedBenchmarks\s*[:=]\s*0/.test(String(KOL_IDS_PLATFORM_repairDataIsolation))&&String(KOL_IDS_PLATFORM_repairDataIsolation).indexOf('affectedBrands')>=0),'Migration must rebuild only affected brands and never purge an entire organization.');
    KOL_IDS_PLATFORM_enterpriseT_('webhook redirects disabled',String(KOL_IDS_PLATFORM_sendWebhook).indexOf('followRedirects:false')>=0,'Webhook requests must not follow redirects.');
    KOL_IDS_PLATFORM_enterpriseT_('structured api errors',String(doPost).indexOf('err&&err.code')>=0,'API errors should prefer structured error codes.');
    KOL_IDS_PLATFORM_enterpriseT_('release version contract',typeof KOL_IDS==='object'&&typeof KOL_IDS_RELEASE==='object'&&KOL_IDS.VERSION==='1.1.0'&&KOL_IDS_RELEASE.VERSION==='1.1.0','All active release layers must share one canonical release version.');
    KOL_IDS_PLATFORM_enterpriseT_('api gate authenticates once',String(KOL_IDS_HARDENING_RUNTIME_apiGate_).replace(/\s+/g,'').indexOf('KOL_IDS_PLATFORM_api_(key,action,payload,verified)')>=0,'API gate must pass verified auth context into the API executor.');
    KOL_IDS_PLATFORM_enterpriseT_('api surface explicit',String(KOL_IDS_PLATFORM_api_).indexOf('KOL_IDS_HARDENING_RUNTIME_operation_(action)')>=0,'Public API action allowlist is missing.');
    KOL_IDS_PLATFORM_enterpriseT_('no spoofable forwarded IP dependency',String((typeof KOL_IDS_HARDENING_RUNTIME_rateLimit_==='function')?KOL_IDS_HARDENING_RUNTIME_rateLimit_:function(){}).indexOf('X-Forwarded-For')<0,'Rate limiting must not trust a client-controlled forwarded IP header.');
    var idemHeaders=[];try{if(typeof KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_==='function'){var idemSh=KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_();idemHeaders=idemSh&&idemSh.getLastColumn()>0?idemSh.getRange(1,1,1,idemSh.getLastColumn()).getValues()[0].map(String):[];}}catch(idemErr){idemHeaders=[];}var idemSet={};idemHeaders.forEach(function(h){idemSet[String(h||'').trim()]=true;});var idemRequired=['Idempotency Key','Operation','Org ID','Request ID','Status','Response Hash','Response JSON','Created At','Completed At','Brand ID','Request Hash','Lease Until'];KOL_IDS_PLATFORM_enterpriseT_('idempotency registry schema hardened',idemRequired.every(function(h){return idemSet[h]===true;}),'Persistent ENT_IDEMPOTENCY registry must support response replay and lease tracking.');
    var perf=KOL_IDS_HARDENING_RUNTIME_performanceContractQA_();KOL_IDS_PLATFORM_enterpriseT_('performance hardening contract',perf.success,'Performance and hot-path hardening contract failed.');
    
  }catch(e){failures.push({name:'exception',detail:String(e.message||e)});}
  KOL_IDS_PLATFORM_enterpriseT_('ingestion internal executor',typeof KOL_IDS_PLATFORM_runIngestionInternal_==='function','Ingestion executor is missing.');
  KOL_IDS_PLATFORM_enterpriseT_('ingestion job creator',typeof KOL_IDS_PLATFORM_createIngestionJob==='function','Ingestion job creation function is missing.');
  KOL_IDS_PLATFORM_enterpriseT_('ingestion normalizer',typeof KOL_IDS_PLATFORM_normalizeIngestionRecords_==='function','Ingestion response normalizer is missing.');
  KOL_IDS_PLATFORM_enterpriseT_('direct prediction strict mode',String(KOL_IDS_PLATFORM_predictWithModel_).indexOf('validateApiFeatures_(features||{},true)')>=0,'Direct prediction must fail closed on missing features.');
  KOL_IDS_PLATFORM_enterpriseT_('schema-driven creator warehouse',String(KOL_IDS_PLATFORM_appendCreatorRows_).indexOf("KOL_IDS_PLATFORM_map_(sh)")>=0,'Creator warehouse writes must be schema-driven.');
    return {success:failures.length===0,ready:failures.length===0,tests:checks,passed:passed,failures:failures,notices:notices,version:KOL_IDS.VERSION,remediation:'Run KOL_IDS_PLATFORM_repairDataIsolation() once, then rebuild each brand benchmark. Unscoped legacy creator records are intentionally excluded from brand-specific intelligence.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PLATFORM_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PLATFORM_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
