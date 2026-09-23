/**
 * KOL IDS — FUNCTION HARDENING ENGINE
 * Goal: make existing product functions reliable, evidence-aware, efficient,
 * leakage-safe and useful in production. This layer prefers honest abstention
 * over fabricated precision and keeps compatibility with the existing V5-V14 stack.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, { HALF_LIFE_DAYS:120, PRIOR_STRENGTH:10,
  MIN_CREATOR_EVIDENCE:3, MIN_COHORT_EVIDENCE:5, MIN_OOS:8,
  MIN_INTERVAL_OOS:12, MIN_HIGH_TRUST:25, SIMILARITY_FLOOR:.45,
  MAX_COHORT:80, MAX_CACHE_ROWS:5000, EPS:1e-9,
  MAX_CALIBRATION_LOG:0.35, MAX_DRIFT_LOG:0.30,
  SOURCE_WEIGHT:{VERIFIED:1,API:1,SELF_REPORTED:.72,ESTIMATED:.45,IMPUTED:.25,UNKNOWN:.55}
});

function KOL_IDS_HARDENING_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v===null||v===undefined)return null;var n=Number(v);return isFinite(n)?n:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_date_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v instanceof Date&&!isNaN(v.getTime()))return v;var d=new Date(v);return isNaN(d.getTime())?null:d;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?Math.max(a,Math.min(b,n)):a;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_mean_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number);return x.length?x.reduce(function(s,v){return s+v;},0)/x.length:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_median_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number).sort(function(a,b){return a-b;});if(!x.length)return null;var m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_q_(a,q){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_q_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number).sort(function(a,b){return a-b;});if(!x.length)return null;q=KOL_IDS_HARDENING_clamp_(q,0,1);var p=(x.length-1)*q,i=Math.floor(p),f=p-i;return x[i]+(x[i+1]===undefined?0:(x[i+1]-x[i])*f);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_q_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_q_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_sd_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_sd_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number),m=KOL_IDS_HARDENING_mean_(x);if(m===null||x.length<2)return 0;return Math.sqrt(x.reduce(function(s,v){return s+Math.pow(v-m,2);},0)/(x.length-1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_sd_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_sd_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_mad_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_mad_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_HARDENING_median_(a);if(m===null)return 0;return KOL_IDS_HARDENING_median_((a||[]).map(function(v){return Math.abs(Number(v)-m);}));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_mad_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_mad_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_log_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_log_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.log(Math.max(0,Number(v))+1);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_log_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_log_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_exp_(z){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_exp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.max(0,Math.exp(Number(z))-1);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_exp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_exp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_recency_(d,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_recency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_HARDENING_date_(d),KOL_IDS_HARDENING_t=KOL_IDS_HARDENING_date_(asOf)||new Date();if(!x)return 0;return Math.pow(.5,Math.max(0,(KOL_IDS_HARDENING_t-x)/86400000)/KOL_IDS.HALF_LIFE_DAYS);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_recency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_recency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_headers_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]:[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m={};KOL_IDS_HARDENING_headers_(sh).forEach(function(h,i){m[String(h).trim()]=i;});return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!sh||sh.getLastRow()<=1)return[];
  var c=KOL_IDS_HARDENING_cache_(),key=KOL_IDS_HARDENING_cacheKey_(['rows',sh.getSheetId(),sh.getLastRow(),sh.getLastColumn()]);
  if(c[key])return c[key];
  var rows=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  if(rows.length<=KOL_IDS.MAX_CACHE_ROWS)c[key]=rows;
  return rows;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_clearCache(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_clearCache');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var c=KOL_IDS_HARDENING_cache_();Object.keys(c).forEach(function(k){delete c[k];});return{success:true,status:'CACHE_CLEARED'};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_clearCache', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_clearCache', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_safeString_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_safeString_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(v===null||v===undefined?'':v).trim();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_safeString_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_safeString_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_cache_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_cache_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!this.__KOL_IDS_HARDENING_CACHE)this.__KOL_IDS_HARDENING_CACHE={};return this.__KOL_IDS_HARDENING_CACHE;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_cache_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_cache_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_cacheKey_(parts){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_cacheKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return parts.map(function(x){return String(x===undefined?'':x);}).join('¦');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_cacheKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_cacheKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Dynamic performance schema: avoids hard-coding columns when headers exist. */
function KOL_IDS_HARDENING_perfSchema_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_perfSchema_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var m=KOL_IDS_HARDENING_map_(sh), pick=function(names,fallback){for(var i=0;i<names.length;i++){if(m[names[i]]!==undefined)return m[names[i]];}return fallback;};
  return {id:pick(['Performance ID','ID'],0),campaign:pick(['Campaign ID'],1),creator:pick(['Creator ID'],2),name:pick(['Creator Name','Name'],3),spend:pick(['Spend','Cost'],4),reach:pick(['Reach'],5),impressions:pick(['Impressions'],6),views:pick(['Views'],7),engagements:pick(['Engagements','Engagement'],8),clicks:pick(['Clicks'],9),conversions:pick(['Conversions'],10),revenue:pick(['Revenue'],11),status:pick(['Status'],12),evidence:pick(['Evidence','Evidence Type','Source'],13),reportedAt:pick(['Reported Date','Reported At'],14),notes:pick(['Notes'],15),createdAt:pick(['Created At'],16)};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_perfSchema_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_perfSchema_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_perfDate_(r,s){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_perfDate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_HARDENING_date_(r[s.reportedAt]||r[s.createdAt]);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_perfDate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_perfDate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_goal_(ss,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_goal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{if(typeof KOL_IDS_OPTIMIZATION_goal_==='function')return KOL_IDS_OPTIMIZATION_goal_(ss,campaignId,creatorId)||'';}catch(e){}return '';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_goal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_goal_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_creator_(ss,id){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_creator_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{if(typeof KOL_IDS_OPTIMIZATION_creator_==='function')return KOL_IDS_OPTIMIZATION_creator_(ss,id);}catch(e){}return null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_creator_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_creator_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_similarity_(a,b,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_similarity_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{if(typeof KOL_IDS_ACCURACY_ENGINE_similarity_==='function')return KOL_IDS_HARDENING_clamp_(KOL_IDS_ACCURACY_ENGINE_similarity_(a,b,goal),0,1);}catch(e){}try{if(typeof KOL_IDS_OPTIMIZATION_similarity_==='function')return KOL_IDS_HARDENING_clamp_(KOL_IDS_OPTIMIZATION_similarity_(a,b,goal),0,1);}catch(e){}return 0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_similarity_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_similarity_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Quality gate: invalid rows never enter evidence. */
function KOL_IDS_HARDENING_quality_(r,s){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_quality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var errors=[], vals=['spend','reach','impressions','views','engagements','clicks','conversions','revenue'];
  vals.forEach(function(k){var n=KOL_IDS_HARDENING_num_(r[s[k]]);if(n!==null&&n<0)errors.push(k+'_negative');});
  var reach=KOL_IDS_HARDENING_num_(r[s.reach]),imp=KOL_IDS_HARDENING_num_(r[s.impressions]),views=KOL_IDS_HARDENING_num_(r[s.views]),eng=KOL_IDS_HARDENING_num_(r[s.engagements]),clicks=KOL_IDS_HARDENING_num_(r[s.clicks]),conv=KOL_IDS_HARDENING_num_(r[s.conversions]);
  if(reach!==null&&imp!==null&&reach>imp)errors.push('reach_gt_impressions');
  if(views!==null&&imp!==null&&views>imp*1.25)errors.push('views_implausible');
  if(eng!==null&&views!==null&&eng>views)errors.push('engagement_gt_views');
  if(clicks!==null&&views!==null&&clicks>views)errors.push('clicks_gt_views');
  if(conv!==null&&clicks!==null&&conv>clicks)errors.push('conversions_gt_clicks');
  if(errors.length)return{ok:false,score:0,reason:errors.join('|')};
  var source=KOL_IDS_HARDENING_safeString_(r[s.evidence]).toUpperCase(), sw=KOL_IDS.SOURCE_WEIGHT[source]===undefined?KOL_IDS.SOURCE_WEIGHT.UNKNOWN:KOL_IDS.SOURCE_WEIGHT[source];
  var present=vals.filter(function(k){return KOL_IDS_HARDENING_num_(r[s[k]])!==null;}).length;
  var coverage=.55+.45*(present/vals.length);
  var status=KOL_IDS_HARDENING_safeString_(r[s.status]).toUpperCase();if(status&&status!=='COMPLETED')return{ok:false,score:0,reason:'NOT_COMPLETED'};
  return{ok:true,score:KOL_IDS_HARDENING_clamp_(sw*coverage,.15,1),reason:'PASS',source:source||'UNKNOWN',coverage:coverage};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_quality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_quality_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Audience fields are explicitly classified, never silently fabricated. */
function KOL_IDS_HARDENING_audience_(creator){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_audience_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  creator=creator||{};
  var keys=['ageMin','ageMax','locations','interests','styles','gender','language','audienceGender','audienceAge','audienceLocations','audienceInterests'];
  var observed={},estimated={},missing={};
  keys.forEach(function(k){var v=creator[k];if(v===null||v===undefined||v==='')missing[k]=true;else if(String(v).toUpperCase().indexOf('ESTIMAT')>=0)estimated[k]=v;else observed[k]=v;});
  var n=keys.length, present=Object.keys(observed).length+Object.keys(estimated).length;
  return{observed:observed,estimated:estimated,missing:Object.keys(missing),coverage:Math.round(present/n*1000)/10,observedCount:Object.keys(observed).length,estimatedCount:Object.keys(estimated).length,missingCount:Object.keys(missing).length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_audience_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_audience_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Historical creator profile: compact enough for UI, deep enough for learning. */
function KOL_IDS_HARDENING_getCreatorProfile(ss,creatorId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_getCreatorProfile');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss&&KOL_IDS_PA_legacyProjection_(ss);if(!sh)return{success:false,status:'NO_DATA'};
  var key=KOL_IDS_HARDENING_cacheKey_(['profile',creatorId,asOf||'']),cache=KOL_IDS_HARDENING_cache_();if(cache[key])return cache[key];
  var s=KOL_IDS_HARDENING_perfSchema_(sh),rows=KOL_IDS_HARDENING_rows_(sh),cut=KOL_IDS_HARDENING_date_(asOf),items=[];
  rows.forEach(function(r){if(String(r[s.creator])!==String(creatorId)||String(r[s.status]||'').toUpperCase()!=='COMPLETED')return;var d=KOL_IDS_HARDENING_perfDate_(r,s);if(!d||(cut&&d>cut))return;var q=KOL_IDS_HARDENING_quality_(r,s);if(!q.ok)return;var g=KOL_IDS_HARDENING_goal_(ss,r[s.campaign],r[s.creator]);items.push({campaignId:String(r[s.campaign]),date:d,goal:g,quality:q.score,source:q.source,reach:KOL_IDS_HARDENING_num_(r[s.reach]),impressions:KOL_IDS_HARDENING_num_(r[s.impressions]),views:KOL_IDS_HARDENING_num_(r[s.views]),engagements:KOL_IDS_HARDENING_num_(r[s.engagements]),clicks:KOL_IDS_HARDENING_num_(r[s.clicks]),conversions:KOL_IDS_HARDENING_num_(r[s.conversions]),spend:KOL_IDS_HARDENING_num_(r[s.spend]),revenue:KOL_IDS_HARDENING_num_(r[s.revenue])});});
  items.sort(function(a,b){return b.date-a.date;});
  var cr=KOL_IDS_HARDENING_creator_(ss,creatorId),aud=KOL_IDS_HARDENING_audience_(cr), latest=items[0]||null;
  var result={success:true,status:items.length?'ACTIVE_HISTORY':'NO_HISTORY',creatorId:String(creatorId),creator:cr,audience:aud,history:items.slice(0,100),historyN:items.length,latest:latest,quality:items.length?KOL_IDS_HARDENING_mean_(items.map(function(x){return x.quality;})):0};
  cache[key]=result;return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_getCreatorProfile', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_getCreatorProfile', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_history_(ss,creatorId,metric,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_history_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss&&KOL_IDS_PA_legacyProjection_(ss);if(!sh)return[];var s=KOL_IDS_HARDENING_perfSchema_(sh),cut=KOL_IDS_HARDENING_date_(asOf),idx=s[metric.toLowerCase()];if(idx===undefined)return[];
  var key=KOL_IDS_HARDENING_cacheKey_(['hist',creatorId,metric,goal,excludeCampaignId||'',asOf||'']),cache=KOL_IDS_HARDENING_cache_();if(cache[key])return cache[key];var out=[];
  KOL_IDS_HARDENING_rows_(sh).forEach(function(r){if(String(r[s.creator])!==String(creatorId)||String(r[s.status]||'').toUpperCase()!=='COMPLETED')return;if(excludeCampaignId!==undefined&&String(r[s.campaign])===String(excludeCampaignId))return;var d=KOL_IDS_HARDENING_perfDate_(r,s);if(!d||(cut&&d>=cut))return;var g=KOL_IDS_HARDENING_goal_(ss,r[s.campaign],r[s.creator]);if(goal&&String(g).toUpperCase()!==String(goal).toUpperCase())return;var q=KOL_IDS_HARDENING_quality_(r,s);if(!q.ok)return;var raw=KOL_IDS_HARDENING_num_(r[idx]);if(raw===null)return;out.push({value:raw,z:KOL_IDS_HARDENING_log_(raw),date:d,campaignId:String(r[s.campaign]),creatorId:String(creatorId),quality:q.score,source:q.source});});
  out.sort(function(a,b){return b.date-a.date;});cache[key]=out;return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_history_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_history_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_cohort_(ss,targetId,metric,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_cohort_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss&&KOL_IDS_PA_legacyProjection_(ss);if(!sh)return[];var s=KOL_IDS_HARDENING_perfSchema_(sh),idx=s[metric.toLowerCase()];if(idx===undefined)return[];var target=KOL_IDS_HARDENING_creator_(ss,targetId),cut=KOL_IDS_HARDENING_date_(asOf),best={},out=[];
  KOL_IDS_HARDENING_rows_(sh).forEach(function(r){var cid=String(r[s.creator]||'');if(!cid||cid===String(targetId)||String(r[s.status]||'').toUpperCase()!=='COMPLETED')return;if(excludeCampaignId!==undefined&&String(r[s.campaign])===String(excludeCampaignId))return;var d=KOL_IDS_HARDENING_perfDate_(r,s);if(!d||(cut&&d>=cut))return;var g=KOL_IDS_HARDENING_goal_(ss,r[s.campaign],cid);if(goal&&String(g).toUpperCase()!==String(goal).toUpperCase())return;var q=KOL_IDS_HARDENING_quality_(r,s);if(!q.ok)return;var raw=KOL_IDS_HARDENING_num_(r[idx]);if(raw===null)return;var sim=KOL_IDS_HARDENING_similarity_(target,KOL_IDS_HARDENING_creator_(ss,cid),goal);if(sim<KOL_IDS.SIMILARITY_FLOOR)return;var key=cid+'|'+String(r[s.campaign]);if(best[key])return;best[key]=1;out.push({value:raw,z:KOL_IDS_HARDENING_log_(raw),date:d,campaignId:String(r[s.campaign]),creatorId:cid,quality:q.score,similarity:sim});});
  return out.sort(function(a,b){return (b.similarity*b.quality)-(a.similarity*a.quality);}).slice(0,KOL_IDS.MAX_COHORT);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_cohort_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_cohort_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_weightedMedian_(items){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_weightedMedian_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var a=(items||[]).filter(function(x){return x&&isFinite(x.v)&&x.KOL_IDS_PLATFORM_w>0;}).sort(function(x,y){return x.v-y.v;}),sw=a.reduce(function(s,x){return s+x.KOL_IDS_PLATFORM_w;},0),acc=0;if(!sw)return null;for(var i=0;i<a.length;i++){acc+=a[i].KOL_IDS_PLATFORM_w;if(acc>=sw/2)return a[i].v;}return a[a.length-1].v;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_weightedMedian_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_weightedMedian_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_weightedMean_(items){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_weightedMean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sw=0,sv=0;(items||[]).forEach(function(x){if(x&&isFinite(x.v)&&isFinite(x.KOL_IDS_PLATFORM_w)&&x.KOL_IDS_PLATFORM_w>0){sw+=x.KOL_IDS_PLATFORM_w;sv+=x.KOL_IDS_PLATFORM_w*x.v;}});return sw?{mean:sv/sw,weight:sw}:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_weightedMean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_weightedMean_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_oosStats_(oos){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_oosStats_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var r=(oos||[]).filter(function(x){return x&&isFinite(x.residual);}).map(function(x){return Number(x.residual);});
  if(!r.length)return{n:0,bias:0,mae:null,mad:0,q10:null,q90:null};
  var med=KOL_IDS_HARDENING_median_(r),mae=KOL_IDS_HARDENING_mean_(r.map(Math.abs));
  return{n:r.length,bias:KOL_IDS_HARDENING_clamp_(med||0,-KOL_IDS.MAX_CALIBRATION_LOG,KOL_IDS.MAX_CALIBRATION_LOG),mae:mae,mad:KOL_IDS_HARDENING_mad_(r),q10:KOL_IDS_HARDENING_q_(r,.10),q90:KOL_IDS_HARDENING_q_(r,.90)};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_oosStats_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_oosStats_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Metric-specific robust prediction. Interval is ONLY from prior OOS residuals. */
function KOL_IDS_HARDENING_predictMetric(ss,creatorId,metric,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_predictMetric');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  metric=String(metric||'').toUpperCase();var now=KOL_IDS_HARDENING_date_(asOf)||new Date(),own=KOL_IDS_HARDENING_history_(ss,creatorId,metric,goal,excludeCampaignId,asOf),cohort=KOL_IDS_HARDENING_cohort_(ss,creatorId,metric,goal,excludeCampaignId,asOf);
  var ownI=own.map(function(x){return{v:x.z,KOL_IDS_PLATFORM_w:KOL_IDS_HARDENING_recency_(x.date,now)*x.quality};}),cohI=cohort.map(function(x){return{v:x.z,KOL_IDS_PLATFORM_w:KOL_IDS_HARDENING_recency_(x.date,now)*x.quality*Math.pow(x.similarity,2)};});
  var om=KOL_IDS_HARDENING_weightedMean_(ownI),cm=KOL_IDS_HARDENING_weightedMean_(cohI),ownN=own.length,cohortN=cohort.length;
  if(!om&&!cm)return{metric:metric,prediction:null,lower:null,upper:null,status:'INSUFFICIENT_EVIDENCE',confidence:5,modelTrust:'LOW',reason:'NO_PRIOR_EVIDENCE'};
  var ownTrust=ownN/(ownN+6),pooled=om&&cm?om.mean*ownTrust+cm.mean*(1-ownTrust):(om?om.mean:cm.mean),weight=(om?om.weight:0)+(cm?cm.weight*.65:0),shrink=weight/(weight+KOL_IDS.PRIOR_STRENGTH),prior=cm?cm.mean:om.mean,centerZ=prior+(pooled-prior)*shrink;
  var creatorMedian=KOL_IDS_HARDENING_weightedMedian_(ownI),cohortMedian=KOL_IDS_HARDENING_weightedMedian_(cohI),candidates=[];if(om)candidates.push({name:'OWN_MEAN',z:om.mean});if(creatorMedian!==null)candidates.push({name:'OWN_MEDIAN',z:creatorMedian});if(cm)candidates.push({name:'COHORT_MEAN',z:cm.mean});if(cohortMedian!==null)candidates.push({name:'COHORT_MEDIAN',z:cohortMedian});candidates.push({name:'SHRUNK_ENSEMBLE',z:centerZ});
  var oos=KOL_IDS_HARDENING_oosResiduals_(ss,metric,goal,asOf,excludeCampaignId),model=KOL_IDS_HARDENING_chooseCandidate_(candidates,oos,centerZ),stats=KOL_IDS_HARDENING_oosStats_(oos);
  var calibrationBias=stats.n>=KOL_IDS.MIN_OOS?stats.bias:0;
  var predZ=model.z+calibrationBias;
  var residuals=oos.filter(function(x){return isFinite(x.residual);}).map(function(x){return x.residual;});
  var q10=stats.q10,q90=stats.q90,prediction=KOL_IDS_HARDENING_exp_(predZ),lower=null,upper=null,intervalMethod='UNAVAILABLE';
  if(residuals.length>=KOL_IDS.MIN_INTERVAL_OOS&&q10!==null&&q90!==null){lower=KOL_IDS_HARDENING_exp_(predZ+q10);upper=KOL_IDS_HARDENING_exp_(predZ+q90);intervalMethod='OOS_RESIDUALS';}
  var dispersion=KOL_IDS_HARDENING_mad_(residuals),fresh=KOL_IDS_HARDENING_mean_(own.concat(cohort).map(function(x){return KOL_IDS_HARDENING_recency_(x.date,now);})),evidence=weight;
  var conf=15+Math.min(30,evidence*4)+Math.min(18,ownN*3)+Math.min(12,cohortN*.3)+Math.min(10,oos.length*.5)+(fresh||0)*8;if(dispersion>.8)conf-=12;else if(dispersion>.45)conf-=6;if(intervalMethod!=='OOS_RESIDUALS')conf-=12;if(oos.length< KOL_IDS.MIN_OOS)conf-=8;conf=KOL_IDS_HARDENING_clamp_(conf,5,97);
  var trust=oos.length>=KOL_IDS.MIN_HIGH_TRUST&&intervalMethod==='OOS_RESIDUALS'&&ownN>=KOL_IDS.MIN_CREATOR_EVIDENCE?'HIGH':(oos.length>=KOL_IDS.MIN_OOS?'MEDIUM':'LOW');
  if(ownN<2&&cohortN<5)trust='LOW';
  return{metric:metric,prediction:Math.round(prediction*100)/100,lower:lower===null?null:Math.round(lower*100)/100,upper:upper===null?null:Math.round(upper*100)/100,status:'OK',confidence:Math.round(conf),modelTrust:trust,ownN:ownN,cohortN:cohortN,oosN:oos.length,effectiveN:Math.round(evidence*100)/100,model:model.name,dispersionLog:Math.round(dispersion*1000)/1000,intervalMethod:intervalMethod,calibrationBiasLog:Math.round(calibrationBias*1000)/1000,priorOOS:oos.length,modelOOS:model.n||0,modelMAE:model.mae===null?null:Math.round(model.mae*10000)/10000,modelVersion:KOL_IDS.VERSION,accuracyGuard:'STRICT_AS_OF + PRIOR_OOS_ONLY + QUALITY_GATE + SHRINKAGE + CALIBRATION'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_predictMetric', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_predictMetric', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** OOS residuals are read only from predictions made before their actual outcome. */
function KOL_IDS_HARDENING_oosResiduals_(ss,metric,goal,asOf,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_oosResiduals_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss&&ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!sh)return[];var m=KOL_IDS_HARDENING_map_(sh),cut=KOL_IDS_HARDENING_date_(asOf),out=[];
  if(m['Metric']===undefined||m['Predicted Log']===undefined||m['Actual At']===undefined)return[];
  KOL_IDS_HARDENING_rows_(sh).forEach(function(r){if(String(r[m['Metric']]||'').toUpperCase()!==String(metric).toUpperCase())return;if(goal&&String(r[m['Goal']]||'').toUpperCase()!==String(goal).toUpperCase())return;if(excludeCampaignId!==undefined&&String(r[m['Campaign ID']])===String(excludeCampaignId))return;var predAt=KOL_IDS_HARDENING_date_(r[m['Predicted At']]),actualAt=KOL_IDS_HARDENING_date_(r[m['Actual At']]);if(!predAt||!actualAt)return;if(cut&&actualAt>=cut)return;if(predAt>=actualAt)return;var p=KOL_IDS_HARDENING_num_(r[m['Predicted Log']]),a=KOL_IDS_HARDENING_num_(r[m['Actual Log']]);if(p===null||a===null)return;out.push({residual:a-p,date:actualAt,model:String(r[m['Model']]||'UNKNOWN')});});
  return out.sort(function(a,b){return b.date-a.date;});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_oosResiduals_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_oosResiduals_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_chooseCandidate_(candidates,oos,fallback){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_chooseCandidate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var groups={};(oos||[]).forEach(function(x){if(!x||!x.model||!isFinite(x.residual))return;var k=x.model;if(!groups[k])groups[k]=[];groups[k].push(x);});
  var best=null;(candidates||[]).forEach(function(c){
    var a=groups[c.name]||[];
    if(a.length<KOL_IDS.MIN_OOS)return;
    var mae=KOL_IDS_HARDENING_mean_(a.map(function(x){return Math.abs(x.residual);}));
    var recent=KOL_IDS_HARDENING_mean_(a.slice(0,Math.min(a.length,12)).map(function(x){return Math.abs(x.residual);}));
    var score=.65*mae+.35*(recent===null?mae:recent);
    if(!best||score<best.score)best={name:c.name,z:c.z,mae:mae,n:a.length,score:score};
  });
  if(best)return best;
  var c=(candidates||[]).filter(function(x){return x.name==='SHRUNK_ENSEMBLE';})[0]||(candidates||[])[0];
  return{name:c?c.name:'FALLBACK',z:c&&isFinite(c.z)?c.z:fallback,mae:null,n:0,score:null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_chooseCandidate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_chooseCandidate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_predictCampaign(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_predictCampaign');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var metrics=['REACH','IMPRESSIONS','VIEWS','ENGAGEMENTS','CLICKS','CONVERSIONS','REVENUE'];
  var out={};metrics.forEach(function(m){out[m]=KOL_IDS_HARDENING_predictMetric(ss,creatorId,m,goal,excludeCampaignId,asOf);});
  return{success:true,version:KOL_IDS.VERSION,creatorId:String(creatorId),goal:goal,predictions:out,principle:'FUNCTION_HARDENED + METRIC_SPECIFIC + STRICT_OOS'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_predictCampaign', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_predictCampaign', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Campaign fit: objective + audience + platform + evidence; no single score dominates. */
function KOL_IDS_HARDENING_campaignFit(ss,creatorId,context){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_campaignFit');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  context=context||{};var cr=KOL_IDS_HARDENING_creator_(ss,creatorId)||{},aud=KOL_IDS_HARDENING_audience_(cr),goal=String(context.objective||context.goal||'AWARENESS').toUpperCase();
  var platform=context.platform?String(context.platform).toLowerCase():'';var category=context.category?String(context.category).toLowerCase():'';var pf=platform&&cr.platform?String(cr.platform).toLowerCase()===platform:platform?null:.6;var cf=category&&cr.category?String(cr.category).toLowerCase()===category:.6;
  var hist=KOL_IDS_HARDENING_getCreatorProfile(ss,creatorId,context.asOf),evidence=hist.historyN;var stability=hist.historyN>=4?KOL_IDS_HARDENING_clamp_(1/(1+KOL_IDS_HARDENING_sd_(hist.history.map(function(x){return x.quality*100;}))/20),.25,1):.4;
  var audience=aud.coverage/100, objectiveEvidence=hist.history.filter(function(x){return String(x.goal).toUpperCase()===goal;}).length;var objectiveFit=objectiveEvidence>=3?1:(objectiveEvidence?0.7:.5);
  var fit=100*(.30*(pf===null?.6:pf)+.20*(cf===null?.6:cf)+.25*audience+.25*objectiveFit);fit*=.75+.25*stability;
  return{success:true,creatorId:String(creatorId),objective:goal,score:Math.round(KOL_IDS_HARDENING_clamp_(fit,0,100)*100)/100,components:{platform:pf===null?60:Math.round(pf*100),category:cf===null?60:Math.round(cf*100),audience:Math.round(audience*100),objective:Math.round(objectiveFit*100)},evidenceN:evidence,audience:aud,status:evidence>=4?'EVIDENCE_BACKED':'LIMITED_EVIDENCE'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_campaignFit', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_campaignFit', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Record a prediction before a campaign runs. This is the preferred path for true Actual → Learn. */
function KOL_IDS_HARDENING_recordPrediction(ss,campaignId,creatorId,goal,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_recordPrediction');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss&&ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!sh)sh=ss.insertSheet('ENT_PREDICTION_LEDGER');
  var headers=['Prediction ID','Campaign ID','Creator ID','Goal','Metric','Predicted','Predicted Log','Lower Bound','Upper Bound','Actual','Actual Log','Error Log','Absolute Error Log','Confidence','Model','Model Version','Predicted At','Actual At','Learning Status'];
  if(sh.getLastRow()<1)sh.getRange(1,1,1,headers.length).setValues([headers]);
  var m=KOL_IDS_HARDENING_map_(sh),metrics=['REACH','IMPRESSIONS','VIEWS','ENGAGEMENTS','CLICKS','CONVERSIONS','REVENUE'],pred=KOL_IDS_HARDENING_predictCampaign(ss,creatorId,goal,campaignId,asOf||new Date()),existing=KOL_IDS_HARDENING_rows_(sh),index={};
  existing.forEach(function(r,i){var key=String(r[m['Campaign ID']])+'|'+String(r[m['Creator ID']])+'|'+String(r[m['Metric']]);if(key!=='||'&&String(r[m['Learning Status']])!=='BACKFILLED_OOS')index[key]=i+2;});
  var written=0,at=KOL_IDS_HARDENING_date_(asOf)||new Date();
  metrics.forEach(function(metric){var p=pred.predictions[metric];if(!p||p.prediction===null)return;var key=String(campaignId)+'|'+String(creatorId)+'|'+metric,row=index[key],obj={'Prediction ID':row?sh.getRange(row,m['Prediction ID']+1).getValue():'P15-'+Utilities.getUuid().slice(0,10).toUpperCase(),'Campaign ID':String(campaignId),'Creator ID':String(creatorId),'Goal':goal,'Metric':metric,'Predicted':p.prediction,'Predicted Log':KOL_IDS_HARDENING_log_(p.prediction),'Lower Bound':p.lower,'Upper Bound':p.upper,'Actual':'','Actual Log':'','Error Log':'','Absolute Error Log':'','Confidence':p.confidence,'Model':p.model,'Model Version':p.modelVersion,'Predicted At':at,'Actual At':'','Learning Status':'PENDING_ACTUAL'};var vals=headers.map(function(h){return obj[h]===undefined?'':obj[h];});if(row)sh.getRange(row,1,1,headers.length).setValues([vals]);else{sh.appendRow(vals);index[key]=sh.getLastRow();}written++;});
  return{success:true,written:written,status:'PREDICTION_RECORDED',campaignId:String(campaignId),creatorId:String(creatorId),version:KOL_IDS.VERSION,learningStatus:'PENDING_ACTUAL'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_recordPrediction', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_recordPrediction', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Idempotent actual sync. One campaign+creator+metric key can only be updated, never duplicated. */
function KOL_IDS_HARDENING_syncActuals(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_syncActuals');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return{success:true,processed:0,status:'NO_DATA'};var s=KOL_IDS_HARDENING_perfSchema_(ps),rows=KOL_IDS_HARDENING_rows_(ps),sh=ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!sh)sh=ss.insertSheet('ENT_PREDICTION_LEDGER');
  var headers=['Prediction ID','Campaign ID','Creator ID','Goal','Metric','Predicted','Predicted Log','Lower Bound','Upper Bound','Actual','Actual Log','Error Log','Absolute Error Log','Confidence','Model','Model Version','Predicted At','Actual At','Learning Status'];if(sh.getLastRow()<1)sh.getRange(1,1,1,headers.length).setValues([headers]);else if(KOL_IDS_HARDENING_headers_(sh).indexOf('Metric')<0)sh.getRange(1,1,1,headers.length).setValues([headers]);
  var m=KOL_IDS_HARDENING_map_(sh),existing=KOL_IDS_HARDENING_rows_(sh),index={};existing.forEach(function(r,i){var key=String(r[m['Campaign ID']])+'|'+String(r[m['Creator ID']])+'|'+String(r[m['Metric']]);if(key!=='||')index[key]=i+2;});
  var metrics=['REACH','IMPRESSIONS','VIEWS','ENGAGEMENTS','CLICKS','CONVERSIONS','REVENUE'],processed=0;
  rows.forEach(function(r){if(String(r[s.status]||'').toUpperCase()!=='COMPLETED')return;var q=KOL_IDS_HARDENING_quality_(r,s);if(!q.ok)return;var cid=String(r[s.creator]),camp=String(r[s.campaign]),d=KOL_IDS_HARDENING_perfDate_(r,s),goal=KOL_IDS_HARDENING_goal_(ss,camp,cid);if(!cid||!camp||!d||!goal)return;var pred=KOL_IDS_HARDENING_predictCampaign(ss,cid,goal,camp,d);metrics.forEach(function(metric){var idx=s[metric.toLowerCase()],actual=idx===undefined?null:KOL_IDS_HARDENING_num_(r[idx]);if(actual===null)return;var p=pred.predictions[metric];if(!p||p.prediction===null)return;var key=camp+'|'+cid+'|'+metric,rowIndex=index[key];var obj={'Prediction ID':rowIndex?sh.getRange(rowIndex,m['Prediction ID']+1).getValue():'P15-'+Utilities.getUuid().slice(0,10).toUpperCase(),'Campaign ID':camp,'Creator ID':cid,'Goal':goal,'Metric':metric,'Predicted':p.prediction,'Predicted Log':KOL_IDS_HARDENING_log_(p.prediction),'Lower Bound':p.lower,'Upper Bound':p.upper,'Actual':actual,'Actual Log':KOL_IDS_HARDENING_log_(actual),'Error Log':KOL_IDS_HARDENING_log_(actual)-KOL_IDS_HARDENING_log_(p.prediction),'Absolute Error Log':Math.abs(KOL_IDS_HARDENING_log_(actual)-KOL_IDS_HARDENING_log_(p.prediction)),'Confidence':p.confidence,'Model':p.model,'Model Version':p.modelVersion,'Predicted At':new Date(d.getTime()-1),'Actual At':d,'Learning Status':'BACKFILLED_OOS'};var vals=headers.map(function(h){return obj[h]===undefined?'':obj[h];});if(rowIndex)sh.getRange(rowIndex,1,1,headers.length).setValues([vals]);else{sh.appendRow(vals);index[key]=sh.getLastRow();}processed++;});});
  KOL_IDS_HARDENING_clearCache();return{success:true,processed:processed,version:KOL_IDS.VERSION,idempotency:'CAMPAIGN|CREATOR|METRIC',learning:'IDEMPOTENT'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_syncActuals', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_syncActuals', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Decision uses prediction + uncertainty + cost + risk. Explicitly non-causal. */
function KOL_IDS_HARDENING_decision(ss,creatorId,goal,options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_decision');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  options=options||{};var forecast=KOL_IDS_HARDENING_predictCampaign(ss,creatorId,goal,options.excludeCampaignId,options.asOf),fit=KOL_IDS_HARDENING_campaignFit(ss,creatorId,{objective:goal,platform:options.platform,category:options.category,asOf:options.asOf}),budget=KOL_IDS_HARDENING_num_(options.budget),cost=KOL_IDS_HARDENING_num_(options.cost)||0;
  var p=forecast.predictions[options.metric||'CONVERSIONS'];
  if(!p||p.status!=='OK')return{success:true,status:'NON_CAUSAL_DECISION',creatorId:String(creatorId),goal:goal,metric:options.metric||'CONVERSIONS',prediction:null,range:null,confidence:5,risk:1,fit:fit,expectedEfficiency:0,decisionScore:Math.round(fit.score*.25*100)/100,decision:'INSUFFICIENT_EVIDENCE',reason:'Evidence is not strong enough for a reliable prediction.'};
  var unc=p.lower!==null&&p.upper!==null?Math.max(0,p.upper-p.lower)/Math.max(p.prediction,1):1,risk=KOL_IDS_HARDENING_clamp_(.55*(1-p.confidence/100)+.45*unc,0,1),value=p.prediction,eff=cost>0?value/cost:0,score=KOL_IDS_HARDENING_clamp_(.55*fit.score+.30*p.confidence+.15*(1-risk)*100,0,100);
  var action=p.confidence>=60&&fit.score>=65&&risk<=.55?'RECOMMEND':'REVIEW';if(budget!==null&&cost>budget)action='DO_NOT_SELECT';
  return{success:true,status:'NON_CAUSAL_DECISION',creatorId:String(creatorId),goal:goal,metric:p?p.metric:null,prediction:p?p.prediction:null,range:p&&p.lower!==null?{lower:p.lower,upper:p.upper}:null,confidence:p?p.confidence:5,risk:Math.round(risk*1000)/10,fit:fit,expectedEfficiency:Math.round(eff*100000)/100000,decisionScore:Math.round(score*100)/100,decision:action,reason:action==='INSUFFICIENT_EVIDENCE'?'Evidence is not strong enough for a reliable prediction.':action==='DO_NOT_SELECT'?'Cost exceeds available budget.':'Decision combines predicted outcome, uncertainty, evidence, fit and cost; it is not a causal claim.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_decision', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_decision', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_backtest(metric,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_backtest');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return{success:true,status:'NO_DATA'};var s=KOL_IDS_HARDENING_perfSchema_(ps),rows=KOL_IDS_HARDENING_rows_(ps).filter(function(r){return String(r[s.status]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_HARDENING_quality_(r,s).ok&&KOL_IDS_HARDENING_num_(r[s[metric.toLowerCase()]])!==null;}).sort(function(a,b){return KOL_IDS_HARDENING_perfDate_(a,s)-KOL_IDS_HARDENING_perfDate_(b,s);}),out=[];
  rows.forEach(function(r){var d=KOL_IDS_HARDENING_perfDate_(r,s),g=KOL_IDS_HARDENING_goal_(ss,r[s.campaign],r[s.creator]);if(goal&&String(g).toUpperCase()!==String(goal).toUpperCase())return;if(!d)return;var p=KOL_IDS_HARDENING_predictMetric(ss,r[s.creator],metric,g,r[s.campaign],d),actual=KOL_IDS_HARDENING_num_(r[s[metric.toLowerCase()]]);if(p.prediction===null)return;var e=Math.abs(KOL_IDS_HARDENING_log_(actual)-KOL_IDS_HARDENING_log_(p.prediction));out.push({campaignId:String(r[s.campaign]),creatorId:String(r[s.creator]),date:d,error:e,covered:p.lower!==null&&actual>=p.lower&&actual<=p.upper});});
  var mae=KOL_IDS_HARDENING_mean_(out.map(function(x){return x.error;})),cov=KOL_IDS_HARDENING_mean_(out.map(function(x){return x.covered?1:0;}));return{success:true,version:KOL_IDS.VERSION,metric:metric,goal:goal||'ALL',n:out.length,meanAbsLogError:mae===null?null:Math.round(mae*10000)/10000,intervalCoverage80:cov===null?null:Math.round(cov*1000)/10,status:out.length>=KOL_IDS.MIN_OOS?'BACKTEST_READY':'INSUFFICIENT_HISTORY',method:'STRICT_CHRONOLOGICAL_AS_OF'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_backtest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_backtest', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_accuracyLab(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_accuracyLab');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var metrics=['REACH','IMPRESSIONS','VIEWS','ENGAGEMENTS','CLICKS','CONVERSIONS','REVENUE'],out={};metrics.forEach(function(m){out[m]=KOL_IDS_HARDENING_backtest(m,'');});return{success:true,version:KOL_IDS.VERSION,metrics:out,principle:'MEASURE_EACH_FUNCTION_BY_OUT_OF_SAMPLE_ERROR'};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_accuracyLab', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_accuracyLab', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var f=[];function KOL_IDS_HARDENING_t(n,v){if(!v)f.push(n);}KOL_IDS_HARDENING_t('clamp',KOL_IDS_HARDENING_clamp_(150,0,100)===100);KOL_IDS_HARDENING_t('median',KOL_IDS_HARDENING_median_([3,1,2])===2);KOL_IDS_HARDENING_t('quantile',KOL_IDS_HARDENING_q_([0,50,100],.5)===50);KOL_IDS_HARDENING_t('log inverse',Math.abs(KOL_IDS_HARDENING_exp_(KOL_IDS_HARDENING_log_(100))-100)<1e-8);KOL_IDS_HARDENING_t('recency',KOL_IDS_HARDENING_recency_(new Date(),new Date())===1);KOL_IDS_HARDENING_t('mad',KOL_IDS_HARDENING_mad_([1,1,2,2,100])===1);KOL_IDS_HARDENING_t('KOL_IDS_LEARNING_LEGACY_weighted median',KOL_IDS_HARDENING_weightedMedian_([{v:1,KOL_IDS_PLATFORM_w:1},{v:2,KOL_IDS_PLATFORM_w:10}])===2);KOL_IDS_HARDENING_t('clamp calibration',KOL_IDS_HARDENING_clamp_(.9,-.35,.35)===.35);return{success:!f.length,tests:8,failures:f,version:KOL_IDS.VERSION};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Compatibility bridges: old UI keeps its contract while V15 becomes the active layer. */
function KOL_IDS_HARDENING_getDecisionSignal_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_getDecisionSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var d=KOL_IDS_HARDENING_decision(ss,creatorId,goal,{excludeCampaignId:excludeCampaignId,asOf:asOf,metric:'CONVERSIONS'});return{score:d.decisionScore,lower:d.range?d.range.lower:null,upper:d.range?d.range.upper:null,confidence:d.confidence,modelTrust:d.confidence>=80?'HIGH':d.confidence>=60?'MEDIUM':'LOW',decision:d.decision,modelVersion:KOL_IDS.VERSION,fit:d.fit,forecast:d.prediction,risk:d.risk};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_getDecisionSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_getDecisionSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_predictCampaign_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_predictCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_HARDENING_predictCampaign(ss,creatorId,goal,excludeCampaignId,asOf);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_predictCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_predictCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
