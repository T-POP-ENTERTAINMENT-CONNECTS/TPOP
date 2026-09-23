/**
 * KOL IDS — ACCURACY + EVIDENCE + DECISION ENGINE
 *
 * Purpose: make every decision more evidence-aware and more honest over time.
 * Core guarantees:
 *  - strict time-aware evidence: no future observations for a prediction
 *  - no self-training: target campaign excluded from all learning paths
 *  - data-quality gating before evidence enters a model
 *  - hierarchical shrinkage for sparse creator histories
 *  - cohort evidence with similarity weighting
 *  - recency decay + reliability weighting
 *  - residual-based prediction intervals when enough OOS evidence exists
 *  - confidence reflects evidence, dispersion, freshness, drift and data quality
 *  - decision optimization is bounded and explicitly non-causal
 *  - idempotent learning ledger
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  PRIOR_MEAN:50,
  PRIOR_STRENGTH:16,
  HALF_LIFE_DAYS:120,
  MIN_CREATOR_EVIDENCE:3,
  MIN_COHORT_EVIDENCE:5,
  MIN_INTERVAL_EVIDENCE:15,
  MIN_CALIBRATION_EVIDENCE:10,
  MIN_TRUST_EVIDENCE:25,
  MAX_CALIBRATION:5,
  MAX_DRIFT_ADJ:4,
  MAX_LEARNING_ADJ:8,
  SIMILARITY_FLOOR:.45,
  MAX_COHORT:60,
  EPS:1e-9
});

function KOL_IDS_ACCURACY_ENGINE_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v===null||v===undefined)return null;var n=Number(v);return isFinite(n)?n:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?Math.max(a,Math.min(b,n)):a;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_date_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var d=new Date(v);return isNaN(d.getTime())?null:d;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_mean_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number);return x.length?x.reduce(function(s,v){return s+v;},0)/x.length:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_median_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number).sort(function(a,b){return a-b;});if(!x.length)return null;var m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_quantile_(a,q){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_quantile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number).sort(function(a,b){return a-b;});if(!x.length)return null;var p=(x.length-1)*q,i=Math.floor(p),f=p-i;return x[i]+(x[i+1]===undefined?0:(x[i+1]-x[i])*f);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_quantile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_quantile_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_sd_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_sd_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_ACCURACY_ENGINE_mean_(a);if(m===null)return null;var x=(a||[]).filter(function(v){return isFinite(Number(v));}).map(Number);if(x.length<2)return 0;return Math.sqrt(x.reduce(function(s,v){return s+Math.pow(v-m,2);},0)/(x.length-1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_sd_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_sd_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_recency_(d,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_recency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=KOL_IDS_ACCURACY_ENGINE_date_(d),KOL_IDS_ACCURACY_ENGINE_t=KOL_IDS_ACCURACY_ENGINE_date_(asOf)||new Date();if(!x)return 0;var days=Math.max(0,(KOL_IDS_ACCURACY_ENGINE_t-x)/86400000);return Math.pow(.5,days/KOL_IDS.HALF_LIFE_DAYS);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_recency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_recency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_header_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_header_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]:[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_header_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_header_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m={};KOL_IDS_ACCURACY_ENGINE_header_(sh).forEach(function(x,i){m[String(x).trim()]=i;});return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastRow()>1?(typeof KOL_IDS_SCALE_READ_MODEL_==='function'&&String(sh.getName())==='ENT_PERFORMANCE'?KOL_IDS_SCALE_READ_MODEL_(sh,12):sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues()):[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Quality gate: invalid/inconsistent rows never become evidence. */
function KOL_IDS_ACCURACY_ENGINE_quality_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_quality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_OPTIMIZATION_perfValid_==='function'){
    try{var q=KOL_IDS_OPTIMIZATION_perfValid_(r);if(!q||!q.valid)return{ok:false,score:.0,reason:'V5_VALIDATION_FAILED'};}catch(e){}
  }
  var reach=KOL_IDS_ACCURACY_ENGINE_num_(r[3]),impr=KOL_IDS_ACCURACY_ENGINE_num_(r[4]),views=KOL_IDS_ACCURACY_ENGINE_num_(r[5]),likes=KOL_IDS_ACCURACY_ENGINE_num_(r[6]),comments=KOL_IDS_ACCURACY_ENGINE_num_(r[7]),shares=KOL_IDS_ACCURACY_ENGINE_num_(r[8]),clicks=KOL_IDS_ACCURACY_ENGINE_num_(r[9]),conv=KOL_IDS_ACCURACY_ENGINE_num_(r[10]);
  if(impr!==null&&reach!==null&&reach>impr)return{ok:false,score:0,reason:'REACH_GT_IMPRESSIONS'};
  if(views!==null&&impr!==null&&views>impr*1.25)return{ok:false,score:0,reason:'VIEWS_INCONSISTENT'};
  if(likes!==null&&views!==null&&likes>views)return{ok:false,score:0,reason:'LIKES_GT_VIEWS'};
  if(comments!==null&&views!==null&&comments>views)return{ok:false,score:0,reason:'COMMENTS_GT_VIEWS'};
  if(shares!==null&&views!==null&&shares>views)return{ok:false,score:0,reason:'SHARES_GT_VIEWS'};
  if(clicks!==null&&views!==null&&clicks>views)return{ok:false,score:0,reason:'CLICKS_GT_VIEWS'};
  if(conv!==null&&clicks!==null&&conv>clicks)return{ok:false,score:0,reason:'CONVERSIONS_GT_CLICKS'};
  var source=String(r[13]||'').toUpperCase();
  var s=source==='VERIFIED'||source==='API'?1:source==='SELF-REPORTED'?0.72:source==='ESTIMATED'?0.45:0.60;
  var present=[reach,impr,views,likes,comments,shares,clicks,conv].filter(function(x){return x!==null;}).length;
  s*=Math.min(1,.55+present*.055);
  return{ok:true,score:KOL_IDS_ACCURACY_ENGINE_clamp_(s,0.25,1),reason:'PASS'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_quality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_quality_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_perfHistory_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_perfHistory_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_PA_legacyProjection_(ss);if(!sh)return[];
  var rows=KOL_IDS_ACCURACY_ENGINE_rows_(sh),out=[],cut=KOL_IDS_ACCURACY_ENGINE_date_(asOf);
  rows.forEach(function(r){
    if(String(r[12]||'').toUpperCase()!=='COMPLETED')return;
    if(excludeCampaignId!==undefined&&String(r[1])===String(excludeCampaignId))return;
    if(String(r[2])!==String(creatorId))return;
    var d=KOL_IDS_ACCURACY_ENGINE_date_(r[14]||r[16]);if(!d||(cut&&d.getTime()>cut.getTime()))return;
    var g=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],r[2]);if(String(g).toUpperCase()!==String(goal||'').toUpperCase())return;
    var q=KOL_IDS_ACCURACY_ENGINE_quality_(r);if(!q.ok)return;
    var score=KOL_IDS_OPTIMIZATION_outcome_(r,g);if(score===null||!isFinite(score))return;
    out.push({score:Number(score),date:d,campaignId:String(r[1]),creatorId:String(r[2]),quality:q.score});
  });
  return out.sort(function(a,b){return b.date-a.date;});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_perfHistory_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_perfHistory_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_creator_(ss,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_creator_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{if(typeof KOL_IDS_OPTIMIZATION_creator_==='function')return KOL_IDS_OPTIMIZATION_creator_(ss,creatorId);}catch(e){}
  return null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_creator_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_creator_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_similarity_(a,b,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_similarity_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_OPTIMIZATION_similarity_==='function'){
    try{return KOL_IDS_ACCURACY_ENGINE_clamp_(KOL_IDS_OPTIMIZATION_similarity_(a,b,goal),0,1);}catch(e){}
  }
  if(!a||!b)return 0;
  var score=0,n=0;
  ['platform','category','country','language'].forEach(function(k){if(a[k]!==undefined&&b[k]!==undefined){n++;if(String(a[k]).toLowerCase()===String(b[k]).toLowerCase())score++;}});
  return n?score/n:0;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_similarity_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_similarity_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Cohort evidence: comparable creators, never future observations. */
function KOL_IDS_ACCURACY_ENGINE_cohort_(ss,targetId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_cohort_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_PA_legacyProjection_(ss);if(!sh)return[];
  var target=KOL_IDS_ACCURACY_ENGINE_creator_(ss,targetId),rows=KOL_IDS_ACCURACY_ENGINE_rows_(sh),seen={},out=[],cut=KOL_IDS_ACCURACY_ENGINE_date_(asOf);
  rows.forEach(function(r){
    var cid=String(r[2]||'');if(!cid||cid===String(targetId)||seen[cid])return;
    if(String(r[12]||'').toUpperCase()!=='COMPLETED')return;
    if(excludeCampaignId!==undefined&&String(r[1])===String(excludeCampaignId))return;
    var d=KOL_IDS_ACCURACY_ENGINE_date_(r[14]||r[16]);if(!d||(cut&&d.getTime()>cut.getTime()))return;
    var g=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],cid);if(String(g).toUpperCase()!==String(goal||'').toUpperCase())return;
    var q=KOL_IDS_ACCURACY_ENGINE_quality_(r);if(!q.ok)return;
    var score=KOL_IDS_OPTIMIZATION_outcome_(r,g);if(score===null)return;
    var other=KOL_IDS_ACCURACY_ENGINE_creator_(ss,cid),sim=KOL_IDS_ACCURACY_ENGINE_similarity_(target,other,goal);if(sim<KOL_IDS.SIMILARITY_FLOOR)return;
    var key=cid+'|'+String(r[1]);
    if(seen[key])return;seen[key]=1;
    out.push({score:Number(score),date:d,campaignId:String(r[1]),creatorId:cid,similarity:sim,quality:q.score});
  });
  return out.sort(function(a,b){return (b.similarity*b.quality)-(a.similarity*a.quality);}).slice(0,KOL_IDS.MAX_COHORT);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_cohort_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_cohort_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_weightedMean_(items){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_weightedMean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sw=0,sv=0;(items||[]).forEach(function(x){var KOL_IDS_PLATFORM_w=KOL_IDS_ACCURACY_ENGINE_num_(x.KOL_IDS_PLATFORM_w)||0,v=KOL_IDS_ACCURACY_ENGINE_num_(x.v);if(v===null||KOL_IDS_PLATFORM_w<=0)return;sw+=KOL_IDS_PLATFORM_w;sv+=KOL_IDS_PLATFORM_w*v;});return sw>0?{mean:sv/sw,weight:sw}:null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_weightedMean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_weightedMean_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_predict_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_predict_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var now=KOL_IDS_ACCURACY_ENGINE_date_(asOf)||new Date(),own=KOL_IDS_ACCURACY_ENGINE_perfHistory_(ss,creatorId,goal,excludeCampaignId,asOf),cohort=KOL_IDS_ACCURACY_ENGINE_cohort_(ss,creatorId,goal,excludeCampaignId,asOf);
  var ownItems=own.map(function(x){return{v:x.score,KOL_IDS_PLATFORM_w:KOL_IDS_ACCURACY_ENGINE_recency_(x.date,now)*x.quality};});
  var cohortItems=cohort.map(function(x){return{v:x.score,KOL_IDS_PLATFORM_w:KOL_IDS_ACCURACY_ENGINE_recency_(x.date,now)*x.quality*x.similarity*x.similarity};});
  var om=KOL_IDS_ACCURACY_ENGINE_weightedMean_(ownItems),cm=KOL_IDS_ACCURACY_ENGINE_weightedMean_(cohortItems);
  var ownN=own.length,cohortN=cohort.length;
  var ownMean=om?om.mean:null,cohortMean=cm?cm.mean:null;
  var creatorTrust=ownN/(ownN+6), pooled=ownMean!==null&&cohortMean!==null?ownMean*creatorTrust+cohortMean*(1-creatorTrust):(ownMean!==null?ownMean:(cohortMean!==null?cohortMean:50));
  var totalWeight=(om?om.weight:0)+(cm?cm.weight:0)*.65;
  var shrink=totalWeight/(totalWeight+KOL_IDS.PRIOR_STRENGTH);
  var score=KOL_IDS_ACCURACY_ENGINE_clamp_(50+(pooled-50)*shrink,0,100);
  var evidence=own.concat(cohort).map(function(x){return x.score;});
  var dispersion=KOL_IDS_ACCURACY_ENGINE_sd_(evidence);if(dispersion===null)dispersion=18;
  var freshness=KOL_IDS_ACCURACY_ENGINE_mean_(own.concat(cohort).map(function(x){return KOL_IDS_ACCURACY_ENGINE_recency_(x.date,now);}));if(freshness===null)freshness=0;
  var effectiveN=Math.max(0,totalWeight);
  return{score:Math.round(score*100)/100,ownN:ownN,cohortN:cohortN,effectiveN:Math.round(effectiveN*100)/100,dispersion:Math.round(dispersion*100)/100,freshness:Math.round(freshness*1000)/1000,status:ownN>=KOL_IDS.MIN_CREATOR_EVIDENCE?'CREATOR_EVIDENCE':(cohortN>=KOL_IDS.MIN_COHORT_EVIDENCE?'COHORT_EVIDENCE':'PRIOR_SHRUNK')};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_predict_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_predict_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_ledger_(ss,goal,asOf,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_ledger_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!sh)return[];
  var m=KOL_IDS_ACCURACY_ENGINE_map_(sh),cut=KOL_IDS_ACCURACY_ENGINE_date_(asOf),out=[];
  KOL_IDS_ACCURACY_ENGINE_rows_(sh).forEach(function(r){
    if(String(r[m['Goal']]||'').toUpperCase()!==String(goal||'').toUpperCase())return;
    if(excludeCampaignId!==undefined&&String(r[m['Campaign ID']])===String(excludeCampaignId))return;
    var d=KOL_IDS_ACCURACY_ENGINE_date_(r[m['Actual At']]);if(!d||(cut&&d.getTime()>cut.getTime()))return;
    var actual=KOL_IDS_ACCURACY_ENGINE_num_(r[m['Actual Score']]),pred=KOL_IDS_ACCURACY_ENGINE_num_(r[m['Predicted Score']]);if(actual===null||pred===null)return;
    var lo=KOL_IDS_ACCURACY_ENGINE_num_(r[m['Lower Bound']]),hi=KOL_IDS_ACCURACY_ENGINE_num_(r[m['Upper Bound']]);
    out.push({actual:actual,pred:pred,error:actual-pred,abs:Math.abs(actual-pred),date:d,covered:lo!==null&&hi!==null&&actual>=lo&&actual<=hi});
  });
  return out.sort(function(a,b){return b.date-a.date;});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_ledger_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_ledger_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_calibration_(ss,goal,asOf,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_calibration_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var a=KOL_IDS_ACCURACY_ENGINE_ledger_(ss,goal,asOf,excludeCampaignId);if(!a.length)return{bias:0,mae:null,n:0,effectiveN:0,coverage80:null};
  var sw=0,b=0,mae=0;a.forEach(function(x){var KOL_IDS_PLATFORM_w=KOL_IDS_ACCURACY_ENGINE_recency_(x.date,asOf);sw+=KOL_IDS_PLATFORM_w;b+=KOL_IDS_PLATFORM_w*x.error;mae+=KOL_IDS_PLATFORM_w*x.abs;});
  return{bias:b/sw,mae:mae/sw,n:a.length,effectiveN:sw,coverage80:a.length>=KOL_IDS.MIN_INTERVAL_EVIDENCE?KOL_IDS_ACCURACY_ENGINE_mean_(a.map(function(x){return x.covered?1:0;})):null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_calibration_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_calibration_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_interval_(ss,goal,asOf,excludeCampaignId,center){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_interval_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var a=KOL_IDS_ACCURACY_ENGINE_ledger_(ss,goal,asOf,excludeCampaignId),res=a.map(function(x){return x.error;});
  if(res.length<KOL_IDS.MIN_INTERVAL_EVIDENCE)return{lower:KOL_IDS_ACCURACY_ENGINE_clamp_(center-20,0,100),upper:KOL_IDS_ACCURACY_ENGINE_clamp_(center+20,0,100),method:'WIDE_PRIOR',n:res.length,coverage80:null};
  var q10=KOL_IDS_ACCURACY_ENGINE_quantile_(res,.10),q90=KOL_IDS_ACCURACY_ENGINE_quantile_(res,.90),q05=KOL_IDS_ACCURACY_ENGINE_quantile_(res,.05),q95=KOL_IDS_ACCURACY_ENGINE_quantile_(res,.95);
  return{lower:KOL_IDS_ACCURACY_ENGINE_clamp_(center+q10,0,100),upper:KOL_IDS_ACCURACY_ENGINE_clamp_(center+q90,0,100),q05:q05,q95:q95,n:res.length,coverage80:KOL_IDS_ACCURACY_ENGINE_mean_(a.map(function(x){return x.covered?1:0;})),method:'OOS_RESIDUALS'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_interval_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_interval_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_drift_(ss,creatorId,goal,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_drift_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var h=KOL_IDS_ACCURACY_ENGINE_perfHistory_(ss,creatorId,goal,'',asOf).sort(function(a,b){return a.date-b.date;});
  if(h.length<8)return{delta:0,status:'INSUFFICIENT_DATA',n:h.length};
  var n=Math.floor(h.length/2),old=KOL_IDS_ACCURACY_ENGINE_mean_(h.slice(0,n).map(function(x){return x.score;})),recent=KOL_IDS_ACCURACY_ENGINE_mean_(h.slice(n).map(function(x){return x.score;})),delta=recent-old;
  return{delta:delta,status:Math.abs(delta)>=10?'DRIFT_DETECTED':'STABLE',n:h.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_drift_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_drift_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_confidence_(p,cal,intv,drift){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_confidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var e=20+Math.min(35,p.effectiveN*4)+Math.min(15,p.ownN*3)+Math.min(10,p.cohortN*.5)+Math.min(8,p.freshness*8);
  if(p.dispersion>18)e-=10;else if(p.dispersion>12)e-=5;
  if(cal.n>=KOL_IDS.MIN_CALIBRATION_EVIDENCE)e+=8;else e-=8;
  if(intv.method!=='OOS_RESIDUALS')e-=12;
  if(drift.status==='DRIFT_DETECTED')e-=12;
  if(cal.coverage80!==null&&cal.coverage80<.70)e-=6;
  return Math.round(KOL_IDS_ACCURACY_ENGINE_clamp_(e,5,97));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_confidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_confidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_signal_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_signal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!ss)return{score:50,lower:30,upper:70,confidence:5,modelTrust:'LOW',modelVersion:KOL_IDS.VERSION};
  var p=KOL_IDS_ACCURACY_ENGINE_predict_(ss,creatorId,goal,excludeCampaignId,asOf),cal=KOL_IDS_ACCURACY_ENGINE_calibration_(ss,goal,asOf,excludeCampaignId),drift=KOL_IDS_ACCURACY_ENGINE_drift_(ss,creatorId,goal,asOf);
  var guard=typeof KOL_IDS_ACCURACY_ENGINE_calibrationGuard_==='function' ? KOL_IDS_ACCURACY_ENGINE_calibrationGuard_(cal) : {adjustment:cal.n>=KOL_IDS.MIN_CALIBRATION_EVIDENCE?KOL_IDS_ACCURACY_ENGINE_clamp_(cal.bias*.30,-KOL_IDS.MAX_CALIBRATION,KOL_IDS.MAX_CALIBRATION):0,status:cal.n>=KOL_IDS.MIN_CALIBRATION_EVIDENCE?'CALIBRATED':'INSUFFICIENT_CALIBRATION_EVIDENCE',n:cal.n,effectiveN:cal.effectiveN};
  var calAdj=guard.adjustment;
  var driftAdj=drift.n>=8?KOL_IDS_ACCURACY_ENGINE_clamp_(drift.delta*.06,-KOL_IDS.MAX_DRIFT_ADJ,KOL_IDS.MAX_DRIFT_ADJ):0;
  var corrected=KOL_IDS_ACCURACY_ENGINE_clamp_(p.score+calAdj+driftAdj,0,100),intv=KOL_IDS_ACCURACY_ENGINE_interval_(ss,goal,asOf,excludeCampaignId,corrected),confidence=KOL_IDS_ACCURACY_ENGINE_confidence_(p,cal,intv,drift);
  if(guard.status==='UNSTABLE_CALIBRATION'||guard.status==='INVALID_CALIBRATION_EVIDENCE') confidence=Math.max(5,confidence-10);
  var trust=guard.status==='CALIBRATED'&&cal.n>=KOL_IDS.MIN_TRUST_EVIDENCE&&intv.method==='OOS_RESIDUALS'&&p.ownN>=KOL_IDS.MIN_CREATOR_EVIDENCE?'HIGH':(guard.status==='CALIBRATED'&&cal.n>=KOL_IDS.MIN_CALIBRATION_EVIDENCE?'MEDIUM':'LOW');
  return Object.assign({},p,{score:Math.round(corrected*100)/100,lower:Math.round(intv.lower*100)/100,upper:Math.round(intv.upper*100)/100,confidence:confidence,calibrationBias:Math.round(cal.bias*100)/100,calibrationMAE:cal.mae===null?null:Math.round(cal.mae*100)/100,calibrationN:cal.n,effectiveCalibrationN:Math.round(cal.effectiveN*100)/100,intervalCoverage80:intv.coverage80===null?null:Math.round(intv.coverage80*1000)/10,intervalMethod:intv.method,drift:Math.round(driftAdj*100)/100,driftStatus:drift.status,modelTrust:trust,modelVersion:KOL_IDS.VERSION,calibrationStatus:guard.status,calibrationGuard:guard,accuracyGuard:'STRICT_TIME + NO_SELF_LEARNING + DATA_QUALITY + SHRINKAGE + OOS_CALIBRATION + SPARSE_CALIBRATION_GUARD'});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_signal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_signal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Compatibility bridge: existing UI can keep calling V10 entrypoint. */
// Kept for direct V11 migration callers. The canonical V10 bridge remains in
// KOL_IDS_ACCURACYLAB_ACCURACY_LAB.gs, avoiding a duplicate global declaration.
function KOL_IDS_ACCURACY_ENGINE_getDecisionSignalFromHistorical_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_getDecisionSignalFromHistorical_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ACCURACY_ENGINE_signal_(ss,creatorId,goal,excludeCampaignId,asOf);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_getDecisionSignalFromHistorical_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_getDecisionSignalFromHistorical_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_ENGINE_getDecisionSignal_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_getDecisionSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_ACCURACY_ENGINE_signal_(ss,creatorId,goal,excludeCampaignId,asOf);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_getDecisionSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_getDecisionSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Strict chronological backtest with target campaign excluded. */
function KOL_IDS_ACCURACY_ENGINE_backtest(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_backtest');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return{success:true,observations:0,status:'NO_DATA'};
  var rows=KOL_IDS_ACCURACY_ENGINE_rows_(ps).filter(function(r){return String(r[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_ACCURACY_ENGINE_quality_(r).ok;}).sort(function(a,b){return new Date(KOL_IDS_ACCURACY_ENGINE_date_(a[14]||a[16]))-new Date(KOL_IDS_ACCURACY_ENGINE_date_(b[14]||b[16]));});
  var out=[];rows.forEach(function(r){var goal=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],r[2]),actual=KOL_IDS_OPTIMIZATION_outcome_(r,goal),d=KOL_IDS_ACCURACY_ENGINE_date_(r[14]||r[16]);if(!goal||actual===null||!d)return;var sig=KOL_IDS_ACCURACY_ENGINE_signal_(ss,r[2],goal,r[1],d);var err=actual-sig.score;out.push({campaignId:String(r[1]),creatorId:String(r[2]),goal:goal,date:d,error:err,abs:Math.abs(err),covered:actual>=sig.lower&&actual<=sig.upper,confidence:sig.confidence});});
  var mae=KOL_IDS_ACCURACY_ENGINE_mean_(out.map(function(x){return x.abs;})),bias=KOL_IDS_ACCURACY_ENGINE_mean_(out.map(function(x){return x.error;})),cov=KOL_IDS_ACCURACY_ENGINE_mean_(out.map(function(x){return x.covered?1:0;}));
  var byGoal={};out.forEach(function(x){if(!byGoal[x.goal])byGoal[x.goal]=[];byGoal[x.goal].push(x);});
  var detail={};Object.keys(byGoal).forEach(function(g){var a=byGoal[g];detail[g]={n:a.length,mae:KOL_IDS_ACCURACY_ENGINE_mean_(a.map(function(x){return x.abs;})),bias:KOL_IDS_ACCURACY_ENGINE_mean_(a.map(function(x){return x.error;})),coverage80:KOL_IDS_ACCURACY_ENGINE_mean_(a.map(function(x){return x.covered?1:0;}))};});
  return{success:true,version:KOL_IDS.VERSION,observations:out.length,mae:mae===null?null:Math.round(mae*100)/100,bias:bias===null?null:Math.round(bias*100)/100,intervalCoverage80:cov===null?null:Math.round(cov*1000)/10,byGoal:detail,status:out.length>=KOL_IDS.MIN_TRUST_EVIDENCE?'BACKTEST_READY':'INSUFFICIENT_HISTORY',method:'STRICT_WALK_FORWARD_OOS'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_backtest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_backtest', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Accuracy lab: identifies where the model is trustworthy and where it is not. */
function KOL_IDS_ACCURACY_ENGINE_accuracyLab(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_accuracyLab');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),bt=KOL_IDS_ACCURACY_ENGINE_backtest(),goals=['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'],cal={},warnings=[];
  goals.forEach(function(g){cal[g]=KOL_IDS_ACCURACY_ENGINE_calibration_(ss,g,'','');var c=cal[g];if(c.n>=KOL_IDS.MIN_CALIBRATION_EVIDENCE&&Math.abs(c.bias)>8)warnings.push(g+':HIGH_BIAS');if(c.n>=KOL_IDS.MIN_INTERVAL_EVIDENCE&&c.coverage80!==null&&c.coverage80<.70)warnings.push(g+':LOW_INTERVAL_COVERAGE');});
  return{success:true,version:KOL_IDS.VERSION,backtest:bt,calibration:cal,warnings:warnings,principle:'NO_ACCURACY_CLAIM_WITHOUT_OOS_EVIDENCE'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_accuracyLab', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_accuracyLab', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Portfolio optimization: bounded heuristic, not causal, with risk penalty. */
function KOL_IDS_ACCURACY_ENGINE_optimizePortfolio(ss,creatorIds,totalBudget,costs,objective){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_optimizePortfolio');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ids=(creatorIds||[]).map(String),budget=KOL_IDS_ACCURACY_ENGINE_num_(totalBudget)||0,map=costs||{},items=ids.map(function(id){var s=KOL_IDS_ACCURACY_ENGINE_signal_(ss,id,objective||'AWARENESS','',''),cost=KOL_IDS_ACCURACY_ENGINE_num_(map[id])||0,risk=(100-s.confidence)/100;return{id:id,cost:cost,score:s.score,lower:s.lower,upper:s.upper,confidence:s.confidence,risk:risk,value:cost?((s.score*(s.confidence/100))/cost):0};}).filter(function(x){return x.cost>0;});
  items.sort(function(a,b){return b.value-a.value;});var spent=0,selected=[];items.forEach(function(x){if(spent+x.cost<=budget){var sat=Math.max(.55,1-selected.length*.035);selected.push(Object.assign({},x,{marginalValue:Math.round(x.value*sat*100000)/100000,saturationFactor:sat}));spent+=x.cost;}});
  var expected=selected.reduce(function(s,x,i){return s+x.score*Math.max(.55,1-i*.035);},0),risk=selected.length?selected.reduce(function(s,x){return s+x.risk;},0)/selected.length:1;
  return{success:true,status:'SCENARIO_ESTIMATE_NOT_CAUSAL',objective:objective||'AWARENESS',budget:budget,spent:spent,remaining:budget-spent,selected:selected,expectedIndex:Math.round(expected*100)/100,portfolioRisk:Math.round(risk*1000)/10,method:'RISK_ADJUSTED_GREEDY_WITH_SATURATION'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_optimizePortfolio', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_optimizePortfolio', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_ENGINE_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var f=[];function KOL_IDS_ACCURACY_ENGINE_t(n,v){if(!v)f.push(n);} 
  KOL_IDS_ACCURACY_ENGINE_t('clamp',KOL_IDS_ACCURACY_ENGINE_clamp_(150,0,100)===100);
  KOL_IDS_ACCURACY_ENGINE_t('median',KOL_IDS_ACCURACY_ENGINE_median_([3,1,2])===2);
  KOL_IDS_ACCURACY_ENGINE_t('quantile',KOL_IDS_ACCURACY_ENGINE_quantile_([0,50,100],.5)===50);
  KOL_IDS_ACCURACY_ENGINE_t('quality good',KOL_IDS_ACCURACY_ENGINE_quality_(['','','C','N',100,1000,1200,800,80,40,4,500,'COMPLETED','VERIFIED',new Date()]).ok);
  KOL_IDS_ACCURACY_ENGINE_t('quality bad',!KOL_IDS_ACCURACY_ENGINE_quality_(['','','C','N',100,100,1200,800,80,40,4,500,'COMPLETED','VERIFIED',new Date()]).ok);
  KOL_IDS_ACCURACY_ENGINE_t('prior signal',KOL_IDS_ACCURACY_ENGINE_signal_(null,'x','AWARENESS','','').score===50);
  KOL_IDS_ACCURACY_ENGINE_t('version',typeof KOL_IDS.VERSION==='string'&&KOL_IDS.VERSION.indexOf('1.1.0')===0);
  return{success:!f.length,tests:7,failures:f,version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** V12 compatibility: metric-specific predictive forecast. */
function KOL_IDS_ACCURACY_ENGINE_predictCampaign_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_ENGINE_predictCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_PREDICTIVE_predictCampaign(ss,creatorId,goal,excludeCampaignId,asOf);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_ENGINE_predictCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_ENGINE_predictCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
