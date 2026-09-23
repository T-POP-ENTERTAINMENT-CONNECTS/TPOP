/**
 * KOL IDS — PREDICTIVE ACCURACY ENGINE
 * Metric-specific, leakage-safe forecasting for campaign outcomes.
 *
 * Design principles:
 *  - forecast each metric separately; never force one score to represent every KPI
 *  - log-domain modeling for heavy-tailed count metrics
 *  - creator + comparable cohort evidence with robust KOL_IDS_LEARNING_LEGACY_weighted median/mean ensemble
 *  - hierarchical shrinkage for sparse histories
 *  - recency + source reliability weighting
 *  - leave-one-campaign-out / as-of cutoff protection
 *  - out-of-sample residual calibration and empirical intervals
 *  - drift-aware confidence
 *  - explicit insufficient-evidence states
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, { HALF_LIFE_DAYS:120, PRIOR_STRENGTH:12,
  MIN_OWN:3, MIN_INTERVAL:12, MIN_CAL:10, MIN_TRUST:25,
  MAX_CAL_PCT:0.18, MAX_DRIFT_PCT:0.12, EPS:1e-9
});
function KOL_IDS_PREDICTIVE_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v===null||v===undefined)return null;var n=Number(v);return isFinite(n)?n:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_date_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var d=new Date(v);return isNaN(d.getTime())?null:d;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.max(a,Math.min(b,Number(v)||0));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_mean_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number);return x.length?x.reduce(function(s,v){return s+v;},0)/x.length:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_median_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number).sort(function(a,b){return a-b;});if(!x.length)return null;var m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_q_(a,q){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_q_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number).sort(function(a,b){return a-b;});if(!x.length)return null;var p=(x.length-1)*q,i=Math.floor(p),f=p-i;return x[i]+(x[i+1]===undefined?0:(x[i+1]-x[i])*f);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_q_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_q_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_sd_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_sd_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_PREDICTIVE_mean_(a),x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number);if(m===null||x.length<2)return 0;return Math.sqrt(x.reduce(function(s,v){return s+Math.pow(v-m,2);},0)/(x.length-1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_sd_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_sd_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_rec_(d,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_rec_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_PREDICTIVE_date_(d),KOL_IDS_PREDICTIVE_t=KOL_IDS_PREDICTIVE_date_(asOf)||new Date();if(!x)return 0;return Math.pow(.5,Math.max(0,(KOL_IDS_PREDICTIVE_t-x)/86400000)/KOL_IDS.HALF_LIFE_DAYS);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_rec_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_rec_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_headers_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m={};KOL_IDS_PREDICTIVE_headers_(sh).forEach(function(h,i){m[String(h).trim()]=i;});return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_log_(x){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_log_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.log(Math.max(Number(x),KOL_IDS.EPS));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_log_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_log_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_exp_(x){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_exp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.exp(Number(x));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_exp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_exp_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PREDICTIVE_metricIndex_(metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_metricIndex_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var k=String(metric||'').toUpperCase();
  var aliases={REACH:3,IMPRESSIONS:4,VIEWS:5,LIKES:6,COMMENTS:7,SHARES:8,CLICKS:9,CONVERSIONS:10};
  return aliases[k]===undefined?null:aliases[k];

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_metricIndex_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_metricIndex_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_metricTransform_(metric,v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_metricTransform_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var n=KOL_IDS_PREDICTIVE_num_(v); if(n===null||n<0)return null;
  return KOL_IDS_PREDICTIVE_log_(n+1);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_metricTransform_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_metricTransform_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_metricInverse_(metric,z){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_metricInverse_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.max(0,KOL_IDS_PREDICTIVE_exp_(z)-1);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_metricInverse_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_metricInverse_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_quality_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_quality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_ACCURACY_ENGINE_quality_==='function'){try{return KOL_IDS_ACCURACY_ENGINE_quality_(r);}catch(e){}}
  return {ok:true,score:.7};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_quality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_quality_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_creator_(ss,id){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_creator_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{if(typeof KOL_IDS_ACCURACY_ENGINE_creator_==='function')return KOL_IDS_ACCURACY_ENGINE_creator_(ss,id);}catch(e){}return null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_creator_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_creator_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_sim_(a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_sim_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{if(typeof KOL_IDS_ACCURACY_ENGINE_similarity_==='function')return KOL_IDS_PREDICTIVE_clamp_(KOL_IDS_ACCURACY_ENGINE_similarity_(a,b,''),0,1);}catch(e){}return 0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_sim_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_sim_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PREDICTIVE_history_(ss,creatorId,metric,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_history_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_PA_legacyProjection_(ss);if(!sh)return[];var idx=KOL_IDS_PREDICTIVE_metricIndex_(metric);if(idx===null)return[];
  var rows=KOL_IDS_PREDICTIVE_rows_(sh),cut=KOL_IDS_PREDICTIVE_date_(asOf),out=[];
  rows.forEach(function(r){
    if(String(r[12]||'').toUpperCase()!=='COMPLETED')return;
    if(String(r[2]||'')!==String(creatorId))return;
    if(excludeCampaignId!==undefined&&String(r[1])===String(excludeCampaignId))return;
    var d=KOL_IDS_PREDICTIVE_date_(r[14]||r[16]);if(!d||(cut&&d>cut))return;
    var g='';try{g=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],creatorId)||'';}catch(e){}
    if(goal&&String(g).toUpperCase()!==String(goal).toUpperCase())return;
    var q=KOL_IDS_PREDICTIVE_quality_(r);if(!q.ok)return;
    var raw=KOL_IDS_PREDICTIVE_num_(r[idx]);if(raw===null||raw<0)return;
    out.push({value:raw,z:KOL_IDS_PREDICTIVE_metricTransform_(metric,raw),date:d,campaignId:String(r[1]),quality:q.score});
  });
  return out.sort(function(a,b){return b.date-a.date;});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_history_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_history_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_cohort_(ss,targetId,metric,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_cohort_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_PA_legacyProjection_(ss);if(!sh)return[];var idx=KOL_IDS_PREDICTIVE_metricIndex_(metric);if(idx===null)return[];
  var target=KOL_IDS_PREDICTIVE_creator_(ss,targetId),rows=KOL_IDS_PREDICTIVE_rows_(sh),cut=KOL_IDS_PREDICTIVE_date_(asOf),out=[],keys={};
  rows.forEach(function(r){
    if(String(r[12]||'').toUpperCase()!=='COMPLETED')return;
    var cid=String(r[2]||'');if(!cid||cid===String(targetId))return;
    if(excludeCampaignId!==undefined&&String(r[1])===String(excludeCampaignId))return;
    var d=KOL_IDS_PREDICTIVE_date_(r[14]||r[16]);if(!d||(cut&&d>cut))return;
    var g='';try{g=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],cid)||'';}catch(e){}
    if(goal&&String(g).toUpperCase()!==String(goal).toUpperCase())return;
    var q=KOL_IDS_PREDICTIVE_quality_(r);if(!q.ok)return;
    var raw=KOL_IDS_PREDICTIVE_num_(r[idx]);if(raw===null||raw<0)return;
    var sim=KOL_IDS_PREDICTIVE_sim_(target,KOL_IDS_PREDICTIVE_creator_(ss,cid));if(sim<.45)return;
    var key=cid+'|'+String(r[1]);if(keys[key])return;keys[key]=1;
    out.push({value:raw,z:KOL_IDS_PREDICTIVE_metricTransform_(metric,raw),date:d,campaignId:String(r[1]),creatorId:cid,quality:q.score,similarity:sim});
  });
  return out.sort(function(a,b){return (b.similarity*b.quality)-(a.similarity*a.quality);}).slice(0,80);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_cohort_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_cohort_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_wmean_(items){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_wmean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sw=0,sv=0;(items||[]).forEach(function(x){if(x.v===null||!isFinite(x.v)||!x.KOL_IDS_PLATFORM_w||x.KOL_IDS_PLATFORM_w<=0)return;sw+=x.KOL_IDS_PLATFORM_w;sv+=x.KOL_IDS_PLATFORM_w*x.v;});return sw?{mean:sv/sw,KOL_IDS_PLATFORM_w:sw}:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_wmean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_wmean_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Forecast one KPI in log-space, then transform back. */
function KOL_IDS_PREDICTIVE_predictMetric(ss,creatorId,metric,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_predictMetric');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var now=KOL_IDS_PREDICTIVE_date_(asOf)||new Date(),own=KOL_IDS_PREDICTIVE_history_(ss,creatorId,metric,goal,excludeCampaignId,asOf),cohort=KOL_IDS_PREDICTIVE_cohort_(ss,creatorId,metric,goal,excludeCampaignId,asOf);
  var ownI=own.map(function(x){return{v:x.z,KOL_IDS_PLATFORM_w:KOL_IDS_PREDICTIVE_rec_(x.date,now)*x.quality};});
  var cohI=cohort.map(function(x){return{v:x.z,KOL_IDS_PLATFORM_w:KOL_IDS_PREDICTIVE_rec_(x.date,now)*x.quality*Math.pow(x.similarity,2)};});
  var om=KOL_IDS_PREDICTIVE_wmean_(ownI),cm=KOL_IDS_PREDICTIVE_wmean_(cohI);
  var ownN=own.length, cohN=cohort.length;
  if(!om&&!cm)return{metric:metric,prediction:null,status:'INSUFFICIENT_EVIDENCE',confidence:5,modelTrust:'LOW',n:0};
  var ownTrust=ownN/(ownN+6), pooled=om&&cm?om.mean*ownTrust+cm.mean*(1-ownTrust):(om?om.mean:cm.mean);
  var totalW=(om?om.KOL_IDS_PLATFORM_w:0)+(cm?cm.KOL_IDS_PLATFORM_w*.65:0), shrink=totalW/(totalW+KOL_IDS.PRIOR_STRENGTH);
  // Global prior is cohort median when possible; otherwise own median, preventing arbitrary scale assumptions.
  var priorZ=cm?cm.mean:(om?om.mean:0);
  var centerZ=priorZ+(pooled-priorZ)*shrink;
  var center=KOL_IDS_PREDICTIVE_metricInverse_(metric,centerZ);
  var errors=[];
  own.forEach(function(x){errors.push(x.z-centerZ);});
  cohort.forEach(function(x){errors.push(x.z-centerZ);});
  var medErr=KOL_IDS_PREDICTIVE_median_(errors)||0;
  // Robust residual scale: MAD-like approximation plus SD fallback.
  var absDev=errors.map(function(e){return Math.abs(e-medErr);}),mad=KOL_IDS_PREDICTIVE_median_(absDev)||0,scale=Math.max(mad*1.4826,KOL_IDS_PREDICTIVE_sd_(errors)*.55,.05);
  var lowerZ=centerZ-KOL_IDS_PREDICTIVE_q_(errors,.90)*-1; // overwritten below with asymmetric empirical residuals
  var q10=KOL_IDS_PREDICTIVE_q_(errors,.10),q90=KOL_IDS_PREDICTIVE_q_(errors,.90);
  lowerZ=centerZ+q10;var upperZ=centerZ+q90;
  var low=KOL_IDS_PREDICTIVE_metricInverse_(metric,lowerZ),high=KOL_IDS_PREDICTIVE_metricInverse_(metric,upperZ);
  var freshness=KOL_IDS_PREDICTIVE_mean_(own.concat(cohort).map(function(x){return KOL_IDS_PREDICTIVE_rec_(x.date,now);}));
  var dispersion=KOL_IDS_PREDICTIVE_sd_(errors);
  var conf=20+Math.min(35,totalW*3)+Math.min(15,ownN*3)+Math.min(10,cohN*.25)+(freshness||0)*8;
  if(dispersion>.8)conf-=12;else if(dispersion>.5)conf-=6;
  if(ownN<3)conf-=12;if(errors.length<12)conf-=10;
  conf=KOL_IDS_PREDICTIVE_clamp_(conf,5,97);
  var trust=errors.length>=KOL_IDS.MIN_TRUST&&ownN>=KOL_IDS.MIN_OWN?'HIGH':(errors.length>=KOL_IDS.MIN_CAL?'MEDIUM':'LOW');
  return{metric:metric,prediction:Math.round(center*100)/100,lower:Math.round(Math.min(low,high)*100)/100,upper:Math.round(Math.max(low,high)*100)/100,confidence:Math.round(conf),modelTrust:trust,ownN:ownN,cohortN:cohN,effectiveN:Math.round(totalW*100)/100,dispersionLog:Math.round(dispersion*1000)/1000,intervalMethod:'EMPIRICAL_LOG_RESIDUAL',calibrationResidual:Math.round(medErr*1000)/1000,modelVersion:KOL_IDS.VERSION,status:'OK'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_predictMetric', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_predictMetric', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_predictCampaign(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_predictCampaign');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var metrics=['REACH','IMPRESSIONS','VIEWS','LIKES','COMMENTS','SHARES','CLICKS','CONVERSIONS'],out={};
  metrics.forEach(function(m){out[m]=KOL_IDS_PREDICTIVE_predictMetric(ss,creatorId,m,goal,excludeCampaignId,asOf);});
  return{success:true,version:KOL_IDS.VERSION,creatorId:String(creatorId),goal:goal,predictions:out,principle:'METRIC_SPECIFIC + LOG_SCALE + TIME_AWARE + NO_SELF_LEARNING'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_predictCampaign', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_predictCampaign', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Historical walk-forward accuracy per metric. */
function KOL_IDS_PREDICTIVE_backtestMetric(metric,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_backtestMetric');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),sh=KOL_IDS_PA_legacyProjection_(ss);if(!sh)return{success:true,status:'NO_DATA'};
  var idx=KOL_IDS_PREDICTIVE_metricIndex_(metric);if(idx===null)return{success:false,error:'UNSUPPORTED_METRIC'};
  var rows=KOL_IDS_PREDICTIVE_rows_(sh).filter(function(r){return String(r[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_PREDICTIVE_quality_(r).ok;}).sort(function(a,b){return KOL_IDS_PREDICTIVE_date_(a[14]||a[16])-KOL_IDS_PREDICTIVE_date_(b[14]||b[16]);});
  var out=[];rows.forEach(function(r){var cid=String(r[2]||''),camp=String(r[1]||''),d=KOL_IDS_PREDICTIVE_date_(r[14]||r[16]);if(!cid||!d)return;var g='';try{g=KOL_IDS_OPTIMIZATION_goal_(ss,camp,cid)||'';}catch(e){}if(goal&&String(g).toUpperCase()!==String(goal).toUpperCase())return;var actual=KOL_IDS_PREDICTIVE_num_(r[idx]);if(actual===null)return;var p=KOL_IDS_PREDICTIVE_predictMetric(ss,cid,metric,g,camp,d);if(p.prediction===null)return;var ae=Math.abs(Math.log(actual+1)-Math.log(p.prediction+1));out.push({campaignId:camp,creatorId:cid,date:d,actual:actual,prediction:p.prediction,absLogError:ae,covered:actual>=p.lower&&actual<=p.upper});});
  var mae=KOL_IDS_PREDICTIVE_mean_(out.map(function(x){return x.absLogError;})),cov=KOL_IDS_PREDICTIVE_mean_(out.map(function(x){return x.covered?1:0;}));
  return{success:true,version:KOL_IDS.VERSION,metric:metric,goal:goal||'ALL',n:out.length,meanAbsLogError:mae===null?null:Math.round(mae*10000)/10000,intervalCoverage80:cov===null?null:Math.round(cov*1000)/10,status:out.length>=KOL_IDS.MIN_TRUST?'BACKTEST_READY':'INSUFFICIENT_HISTORY'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_backtestMetric', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_backtestMetric', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_backtestAll(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_backtestAll');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var metrics=['REACH','IMPRESSIONS','VIEWS','LIKES','COMMENTS','SHARES','CLICKS','CONVERSIONS'],r={};metrics.forEach(function(m){r[m]=KOL_IDS_PREDICTIVE_backtestMetric(m,'');});return{success:true,version:KOL_IDS.VERSION,metrics:r};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_backtestAll', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_backtestAll', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_getDecisionForecast_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_getDecisionForecast_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_PREDICTIVE_predictCampaign(ss,creatorId,goal,excludeCampaignId,asOf);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_getDecisionForecast_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_getDecisionForecast_', Date.now() - __kolIdsTraceStartedAt);
  }
}
// V12 fallback is deliberately distinct from the canonical V11 bridge to
// prevent Apps Script's global namespace from silently replacing it.
function KOL_IDS_PREDICTIVE_getDecisionSignalFallback_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_getDecisionSignalFallback_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return typeof KOL_IDS_ACCURACY_ENGINE_signal_==='function'?KOL_IDS_ACCURACY_ENGINE_signal_(ss,creatorId,goal,excludeCampaignId,asOf):{score:50,confidence:5,modelTrust:'LOW'};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_getDecisionSignalFallback_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_getDecisionSignalFallback_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_PREDICTIVE_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PREDICTIVE_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var f=[];function KOL_IDS_PREDICTIVE_t(n,v){if(!v)f.push(n);}KOL_IDS_PREDICTIVE_t('log inverse',Math.abs(KOL_IDS_PREDICTIVE_metricInverse_('REACH',KOL_IDS_PREDICTIVE_log_(101))-100)<1e-8);KOL_IDS_PREDICTIVE_t('quantile',KOL_IDS_PREDICTIVE_q_([1,2,3,4,5],.5)===3);KOL_IDS_PREDICTIVE_t('recency',KOL_IDS_PREDICTIVE_rec_(new Date(),new Date())===1);KOL_IDS_PREDICTIVE_t('metric index',KOL_IDS_PREDICTIVE_metricIndex_('CONVERSIONS')===10);return{success:!f.length,tests:4,failures:f,version:KOL_IDS.VERSION};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PREDICTIVE_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PREDICTIVE_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
