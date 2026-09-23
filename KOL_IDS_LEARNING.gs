var KOL_IDS_LEARNING_SIGNAL_CACHE = KOL_IDS_LEARNING_SIGNAL_CACHE || {};
/**
 * KOL IDS — OUTCOME INTELLIGENCE / BENCHMARK / LEARNING ENGINE
 * Full flywheel: Decision -> Execution -> Outcome -> Evaluation -> Benchmark -> Learning -> Next Decision.
 * Deterministic/statistical first; bounded, evidence-KOL_IDS_LEARNING_LEGACY_weighted, privacy-aware and model-ready.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, { SCHEMA_VERSION:'OL1',
  SHEETS:{LEARNING:'ENT_OUTCOME_LEARNING',SIGNALS:'ENT_LEARNING_SIGNALS'},
  METRICS:['CTR','CVR','CPA','ROAS','ENGAGEMENT','REACH','IMPRESSIONS','CLICKS','CONVERSIONS','REVENUE'],
  MIN_SAMPLE:3, MIN_BENCHMARK:5, MAX_ADJUSTMENT:15, MAX_ROWS:5000, EPS:1e-9,
  NETWORK_RIGHTS:'AGGREGATED_ALLOWED'
});
function KOL_IDS_LEARNING_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v==null)return null;var n=Number(v);return isFinite(n)?n:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?Math.max(a,Math.min(b,n)):a;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_headers_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return {
  ENT_OUTCOME_LEARNING:['Learning ID','Org ID','Brand ID','Campaign ID','Creator ID','Metric','Predicted','Actual','Error','Absolute Percentage Error','Outcome Score','Benchmark Median','Benchmark Sample Size','Percentile','Evidence Count','Calibration Adjustment','Learning Confidence','Learning Status','Model Version','Learned At','Source'],
  ENT_LEARNING_SIGNALS:['Signal ID','Org ID','Brand ID','Campaign ID','Creator ID','Metric','Cohort Key','Actual Value','Benchmark Median','Benchmark P25','Benchmark P75','Percentile','Uplift Percent','Evidence Count','Confidence','Signal','Recommendation','Generated At','Source']
};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_ensure_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ss=KOL_IDS_PLATFORM_ensure_(),specs=KOL_IDS_LEARNING_headers_();Object.keys(specs).forEach(function(n){KOL_IDS_PLATFORM_ensureSheet_(ss,n,specs[n]);});return ss;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_withLock_(fn){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_withLock_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var lock=LockService.getScriptLock();if(!lock.tryLock(20000))throw KOL_IDS_PLATFORM_error_('LOCKED','Outcome learning is busy. Please retry.');try{return fn();}finally{lock.releaseLock();}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_withLock_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_withLock_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_ctx_(orgId,brandId,role){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_ctx_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_PLATFORM_auth_(orgId,role||'ANALYST');KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);return ctx;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_ctx_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_ctx_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues().filter(function(r){return r.some(function(v){return v!==''&&v!=null;});}):[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m={};if(!sh||!sh.getLastColumn())return m;sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].forEach(function(h,i){m[String(h)]=i;});return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_append_(sh,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_append_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var r=KOL_IDS_PLATFORM_row_(sh,obj);sh.getRange(sh.getLastRow()+1,1,1,r.length).setValues([r]);return sh.getLastRow();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_append_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_append_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_upsert_(sh,keyHeaders,keyValues,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_upsert_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_LEARNING_map_(sh),rows=KOL_IDS_LEARNING_rows_(sh),hit=-1;rows.some(function(r,i){var ok=keyHeaders.every(function(h){return String(r[m[h]]==null?'':r[m[h]])===String(keyValues[h]==null?'':keyValues[h]);});if(ok){hit=i+2;return true;}return false;});var row=KOL_IDS_PLATFORM_row_(sh,obj);if(hit>0){sh.getRange(hit,1,1,row.length).setValues([row]);return hit;}return KOL_IDS_LEARNING_append_(sh,obj);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_upsert_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_upsert_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_metric_(metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_metric_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=String(metric||'').trim().toUpperCase();if(KOL_IDS.METRICS.indexOf(m)<0)throw KOL_IDS_PLATFORM_error_('INVALID_METRIC','Unsupported learning metric: '+m);return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_metric_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_metric_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_logRatio_(actual,predicted){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_logRatio_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var a=KOL_IDS_LEARNING_num_(actual),p=KOL_IDS_LEARNING_num_(predicted);if(a==null||p==null)return null;return Math.log((Math.max(0,a)+1)/(Math.max(0,p)+1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_logRatio_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_logRatio_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_stats_(vals){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_stats_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(vals||[]).filter(function(v){return isFinite(v);}).sort(function(a,b){return a-b;}),n=x.length;if(!n)return null;var q=function(p){var i=(n-1)*p,l=Math.floor(i),h=Math.ceil(i);return l===h?x[l]:x[l]+(x[h]-x[l])*(i-l);};return{n:n,p25:q(.25),median:q(.5),p75:q(.75),mean:x.reduce(function(a,b){return a+b;},0)/n};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_stats_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_stats_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_percentileApprox_(value,stats){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_percentileApprox_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!stats||!stats.n||value==null)return null;if(stats.n<4)return 50;if(value<=stats.p25)return 25;if(value>=stats.p75)return 75;if(value<=stats.median)return 25+25*(value-stats.p25)/Math.max(KOL_IDS.EPS||1e-9,stats.median-stats.p25);return 50+25*(value-stats.median)/Math.max(KOL_IDS.EPS||1e-9,stats.p75-stats.median);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_percentileApprox_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_percentileApprox_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_outcomeSchema_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_outcomeSchema_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_LEARNING_map_(sh);return {id:m['Outcome ID'],org:m['Org ID'],brand:m['Brand ID'],campaign:m['Campaign ID'],creator:m['Creator ID'],observed:m['Observed At'],impressions:m['Impressions'],reach:m['Reach'],clicks:m['Clicks'],conversions:m['Conversions'],revenue:m['Revenue'],ctr:m['CTR'],cvr:m['CVR'],cpa:m['CPA'],roas:m['ROAS'],engagement:m['Engagement'],rights:m['Data Rights'],status:m['Outcome Status']};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_outcomeSchema_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_outcomeSchema_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_outcomeMetric_(r,s,metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_outcomeMetric_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var idx=s[String(metric).toLowerCase()];return idx==null?null:KOL_IDS_LEARNING_num_(r[idx]);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_outcomeMetric_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_outcomeMetric_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_getOutcomes_(orgId,brandId,opts){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_getOutcomes_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'ANALYST'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES);if(!sh)throw KOL_IDS_PLATFORM_error_('SCHEMA_ERROR','ENT_OUTCOMES is missing.');var s=KOL_IDS_LEARNING_outcomeSchema_(sh),o=opts||{},metric=o.metric?KOL_IDS_LEARNING_metric_(o.metric):null,network=!!o.network,rows=KOL_IDS_LEARNING_rows_(sh);return rows.filter(function(r){if(network){if(String(r[s.rights]||'CUSTOMER_ONLY').toUpperCase()!==KOL_IDS.NETWORK_RIGHTS)return false;}else{if(String(r[s.org]||'')!==String(orgId)||String(r[s.brand]||'')!==String(brandId))return false;}if(o.campaignId&&String(r[s.campaign])!==String(o.campaignId))return false;if(o.creatorId&&String(r[s.creator])!==String(o.creatorId))return false;if(String(r[s.status]||'FINAL').toUpperCase()==='VOID')return false;return !metric||KOL_IDS_LEARNING_outcomeMetric_(r,s,metric)!=null;});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_getOutcomes_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_getOutcomes_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_brandBenchmark_(orgId,brandId,metric,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_brandBenchmark_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_LEARNING_metric_(metric),rows=KOL_IDS_LEARNING_getOutcomes_(orgId,brandId,{metric:m}),sh=KOL_IDS_LEARNING_ctx_(orgId,brandId,'VIEWER').ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),s=KOL_IDS_LEARNING_outcomeSchema_(sh),vals=rows.filter(function(r){return !excludeCampaignId||String(r[s.campaign])!==String(excludeCampaignId);}).map(function(r){return KOL_IDS_LEARNING_outcomeMetric_(r,s,m);}).filter(function(v){return v!=null;});return KOL_IDS_LEARNING_stats_(vals)||{n:0,scope:'BRAND',metric:m};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_brandBenchmark_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_brandBenchmark_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_networkBenchmark_(orgId,brandId,metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_networkBenchmark_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m=KOL_IDS_LEARNING_metric_(metric),rows=KOL_IDS_LEARNING_getOutcomes_(orgId,brandId,{metric:m,network:true}),sh=KOL_IDS_LEARNING_ctx_(orgId,brandId,'VIEWER').ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),s=KOL_IDS_LEARNING_outcomeSchema_(sh),vals=rows.map(function(r){return KOL_IDS_LEARNING_outcomeMetric_(r,s,m);}).filter(function(v){return v!=null;});var st=KOL_IDS_LEARNING_stats_(vals);return st?Object.assign(st,{scope:'NETWORK',metric:m,rights:KOL_IDS.NETWORK_RIGHTS}):{n:0,scope:'NETWORK',metric:m,rights:KOL_IDS.NETWORK_RIGHTS};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_networkBenchmark_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_networkBenchmark_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_benchmark_(orgId,brandId,metric,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_benchmark_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var b=KOL_IDS_LEARNING_brandBenchmark_(orgId,brandId,metric,excludeCampaignId);if(b.n>=KOL_IDS.MIN_BENCHMARK)return b;var n=KOL_IDS_LEARNING_networkBenchmark_(orgId,brandId,metric);return n.n>=KOL_IDS.MIN_BENCHMARK?n:b;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_benchmark_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_benchmark_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_signal_(orgId,brandId,campaignId,creatorId,metric,value){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_signal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'ANALYST'),m=KOL_IDS_LEARNING_metric_(metric),bench=KOL_IDS_LEARNING_benchmark_(orgId,brandId,m,campaignId),v=KOL_IDS_LEARNING_num_(value);if(v==null)return{success:false,available:false,reason:'INVALID_VALUE'};if(!bench.n)return{success:true,available:false,reason:'INSUFFICIENT_BENCHMARK_EVIDENCE',metric:m};var uplift=bench.median!=null&&bench.median!==0?(v-bench.median)/Math.abs(bench.median)*100:0,evidence=KOL_IDS_LEARNING_getOutcomes_(orgId,brandId,{creatorId:creatorId,metric:m}).length,confidence=KOL_IDS_LEARNING_clamp_((Math.min(1,bench.n/30)*.55+Math.min(1,evidence/10)*.45)*100,0,100),KOL_IDS_ADAPTIVE_pct=KOL_IDS_LEARNING_percentileApprox_(v,bench),signal=uplift>=25?'STRONG_POSITIVE':uplift>=10?'POSITIVE':uplift<=-25?'STRONG_NEGATIVE':uplift<=-10?'NEGATIVE':'NEUTRAL',recommendation=signal==='STRONG_POSITIVE'?'INCREASE_WEIGHT':signal==='POSITIVE'?'PREFER':signal==='STRONG_NEGATIVE'?'DEPRIORITIZE':signal==='NEGATIVE'?'CAUTION':'NEUTRAL',sh=KOL_IDS_LEARNING_ensure_().getSheetByName(KOL_IDS.SHEETS.SIGNALS),signalObj={'Signal ID':KOL_IDS_PLATFORM_uuid_('SIG'),'Org ID':orgId,'Brand ID':brandId,'Campaign ID':campaignId||'','Creator ID':creatorId||'','Metric':m,'Cohort Key':bench.scope+'|'+m,'Actual Value':v,'Benchmark Median':bench.median,'Benchmark P25':bench.p25,'Benchmark P75':bench.p75,'Percentile':KOL_IDS_ADAPTIVE_pct,'Uplift Percent':Number(uplift.toFixed(2)),'Evidence Count':evidence,'Confidence':Number(confidence.toFixed(1)),'Signal':signal,'Recommendation':recommendation,'Generated At':new Date(),'Source':'LEGACY_V25.15_OUTCOME_LEARNING'};KOL_IDS_LEARNING_withLock_(function(){KOL_IDS_LEARNING_upsert_(sh,['Org ID','Brand ID','Campaign ID','Creator ID','Metric'],{'Org ID':orgId,'Brand ID':brandId,'Campaign ID':campaignId||'','Creator ID':creatorId||'','Metric':m},signalObj);});return{success:true,available:true,metric:m,value:v,benchmark:bench,percentile:KOL_IDS_ADAPTIVE_pct,upliftPercent:Number(uplift.toFixed(2)),evidenceCount:evidence,confidence:Number(confidence.toFixed(1)),signal:signal,recommendation:recommendation};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_signal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_signal_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_learnCreator_(orgId,brandId,creatorId,metric,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_learnCreator_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'ANALYST'),m=KOL_IDS_LEARNING_metric_(metric),rs=ctx.ss.getSheetByName(KOL_IDS.SHEETS.RECOMMENDATIONS),rm=KOL_IDS_LEARNING_map_(rs),os=ctx.ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),om=KOL_IDS_LEARNING_outcomeSchema_(os),recs=KOL_IDS_LEARNING_rows_(rs).filter(function(r){return String(r[rm['Org ID']])===String(orgId)&&String(r[rm['Brand ID']])===String(brandId)&&String(r[rm['Creator ID']])===String(creatorId)&&(!excludeCampaignId||String(r[rm['Campaign ID']])!==String(excludeCampaignId));}),outcomes=KOL_IDS_LEARNING_getOutcomes_(orgId,brandId,{creatorId:creatorId,metric:m}),logs=[],actuals=[];recs.forEach(function(r){var reason={};try{reason=JSON.parse(String(r[rm['Reason JSON']]||'{}'));}catch(e){}var targetMetric=String(reason.metric||m).toUpperCase();if(targetMetric!==m)return;var pred=KOL_IDS_LEARNING_num_(r[rm['Expected Impact']]);if(pred==null)return;var camp=String(r[rm['Campaign ID']]),match=outcomes.filter(function(o){return String(o[om.campaign])===camp;}).sort(function(a,b){return new Date(b[om.observed])-new Date(a[om.observed]);})[0];if(match){var actual=KOL_IDS_LEARNING_outcomeMetric_(match,om,m),lr=KOL_IDS_LEARNING_logRatio_(actual,pred);if(lr!=null)logs.push(lr);if(actual!=null)actuals.push(actual);}});var bench=KOL_IDS_LEARNING_benchmark_(orgId,brandId,m,excludeCampaignId),sortedLogs=logs.slice().sort(function(a,b){return a-b;}),trim=sortedLogs.length>=5?sortedLogs.slice(1,sortedLogs.length-1):sortedLogs,meanLog=trim.length?trim.reduce(function(a,b){return a+b;},0)/trim.length:0,rawAdj=(Math.exp(meanLog)-1)*100,shrink=logs.length/(logs.length+5),adjust=KOL_IDS_LEARNING_clamp_(rawAdj*shrink,-KOL_IDS.MAX_ADJUSTMENT,KOL_IDS.MAX_ADJUSTMENT),confidence=KOL_IDS_LEARNING_clamp_((Math.min(1,logs.length/10)*.55+Math.min(1,actuals.length/10)*.20+Math.min(1,(bench.n||0)/20)*.15+Math.min(1,(trim.length||0)/10)*.10)*100,0,100),latest=actuals.length?actuals[actuals.length-1]:null,status=logs.length>=KOL_IDS.MIN_SAMPLE?'LEARNED':(actuals.length>=KOL_IDS.MIN_SAMPLE?'OBSERVED_ONLY':'INSUFFICIENT_EVIDENCE'),score=latest!=null&&bench.median!=null?KOL_IDS_LEARNING_clamp_(latest/Math.max(bench.median,1)*100,0,200):'';var obj={'Learning ID':KOL_IDS_PLATFORM_uuid_('LRN'),'Org ID':orgId,'Brand ID':brandId,'Campaign ID':excludeCampaignId||'','Creator ID':creatorId,'Metric':m,'Predicted':logs.length?'':null,'Actual':latest==null?'':latest,'Error':meanLog?Number(meanLog.toFixed(6)):'','Absolute Percentage Error':'','Outcome Score':score,'Benchmark Median':bench.median==null?'':bench.median,'Benchmark Sample Size':bench.n||0,'Percentile':latest==null?'':KOL_IDS_LEARNING_percentileApprox_(latest,bench),'Evidence Count':logs.length,'Calibration Adjustment':Number(adjust.toFixed(2)),'Learning Confidence':Number(confidence.toFixed(1)),'Learning Status':status,'Model Version':KOL_IDS.VERSION,'Learned At':new Date(),'Source':'LEGACY_V25.15_OUTCOME_LEARNING'};var lsh=KOL_IDS_LEARNING_ensure_().getSheetByName(KOL_IDS.SHEETS.LEARNING);KOL_IDS_LEARNING_withLock_(function(){KOL_IDS_LEARNING_upsert_(lsh,['Org ID','Brand ID','Creator ID','Metric'],{'Org ID':orgId,'Brand ID':brandId,'Creator ID':creatorId,'Metric':m},obj);});return{success:true,creatorId:creatorId,metric:m,adjustment:Number(adjust.toFixed(2)),confidence:Number(confidence.toFixed(1)),status:status,evidenceCount:logs.length,benchmark:bench};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_learnCreator_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_learnCreator_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_getLearningSignal_(orgId,brandId,creatorId,metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_getLearningSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var m=KOL_IDS_LEARNING_metric_(metric),key=String(orgId)+'|'+String(brandId)+'|'+String(creatorId)+'|'+m;
  var cache=KOL_IDS_LEARNING_SIGNAL_CACHE || (KOL_IDS_LEARNING_SIGNAL_CACHE={});
  if(cache[key])return cache[key];
  var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'VIEWER'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.LEARNING);
  if(!sh)return cache[key]={available:false,metric:m,adjustment:0,confidence:0,status:'NO_LEARNING'};
  var rows=KOL_IDS_LEARNING_rows_(sh),lm=KOL_IDS_LEARNING_map_(sh),best=null,bestTs=0;
  rows.forEach(function(x){
    if(String(x[lm['Org ID']])!==String(orgId)||String(x[lm['Brand ID']])!==String(brandId)||String(x[lm['Creator ID']])!==String(creatorId)||String(x[lm['Metric']]).toUpperCase()!==m)return;
    var ts=new Date(x[lm['Learned At']]).getTime()||0;if(ts>=bestTs){best=x;bestTs=ts;}
  });
  if(!best)return cache[key]={available:false,metric:m,adjustment:0,confidence:0,status:'NO_LEARNING'};
  return cache[key]={available:true,metric:m,adjustment:KOL_IDS_LEARNING_num_(best[lm['Calibration Adjustment']])||0,confidence:KOL_IDS_LEARNING_num_(best[lm['Learning Confidence']])||0,status:String(best[lm['Learning Status']]||'UNKNOWN'),evidenceCount:KOL_IDS_LEARNING_num_(best[lm['Evidence Count']])||0,benchmarkMedian:KOL_IDS_LEARNING_num_(best[lm['Benchmark Median']]),percentile:KOL_IDS_LEARNING_num_(best[lm['Percentile']])};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_getLearningSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_getLearningSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_metricForObjective_(objective){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_metricForObjective_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var o=String(objective||'').toLowerCase();if(/sales|sale|revenue|conversion|commerce|roas|ซื้อ|ยอดขาย|รายได้/.test(o))return'ROAS';if(/traffic|click|ctr|visit|เว็บ|คลิก/.test(o))return'CTR';if(/engage|engagement|awareness|reach|view|engagement|รับรู้|เข้าถึง/.test(o))return'ENGAGEMENT';return'ENGAGEMENT';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_metricForObjective_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_metricForObjective_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_applyLearningToMatch_(orgId,brandId,creatorId,baseScore,objective){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_applyLearningToMatch_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var metric=KOL_IDS_LEARNING_metricForObjective_(objective),sig=KOL_IDS_LEARNING_getLearningSignal_(orgId,brandId,creatorId,metric),adj=0;if(sig.available&&sig.status==='LEARNED')adj=sig.adjustment;var score=KOL_IDS_LEARNING_clamp_(Number(baseScore||0)*(1+adj/100),0,100);return{metric:metric,baseScore:Number(baseScore||0),learningAdjustment:adj,score:Number(score.toFixed(2)),signal:sig};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_applyLearningToMatch_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_applyLearningToMatch_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_recordRecommendation_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_recordRecommendation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var d=data||{},ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'ANALYST'),campaignId=String(d.campaignId||''),creatorId=String(d.creatorId||'');if(!campaignId||!creatorId)throw KOL_IDS_PLATFORM_error_('INVALID_INPUT','Campaign ID and Creator ID are required.');var metric=KOL_IDS_LEARNING_metricForObjective_(d.objective||d.goal||''),bench=KOL_IDS_LEARNING_benchmark_(orgId,brandId,metric,campaignId),reason=Object.assign({},d.reason||{},{metric:metric,learningAdjustment:d.learningAdjustment||0,learningConfidence:d.learningConfidence||0});return KOL_IDS_DATAMOAT_DM_recordRecommendation_(orgId,brandId,{campaignId:campaignId,creatorId:creatorId,modelId:d.modelId||'MATCH_V25_15',modelVersion:d.modelVersion||KOL_IDS.VERSION,recommendedAt:d.recommendedAt||new Date(),score:d.score,expectedImpact:d.expectedImpact!=null?d.expectedImpact:(bench.median==null?0:bench.median),expectedRisk:d.expectedRisk,confidence:d.confidence,reason:reason,decision:d.decision||'RECOMMENDED',inputSnapshotHash:d.inputSnapshotHash||''});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_recordRecommendation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_recordRecommendation_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_campaignObjective_(ctx,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_campaignObjective_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{var sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.CAMPAIGNS),m=KOL_IDS_PLATFORM_map_(sh),r=KOL_IDS_PLATFORM_values_(sh).filter(function(x){return String(x[m['Campaign ID']])===String(campaignId)&&String(x[m['Org ID']])===String(ctx.orgId)&&String(x[m['Brand ID']])===String(ctx.brandId);})[0];return r?String(r[m['Objective']]||''):'';}catch(e){return'';}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_campaignObjective_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_campaignObjective_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_coreMetrics_(objective){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_coreMetrics_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var primary=KOL_IDS_LEARNING_metricForObjective_(objective),map={ROAS:['ROAS','CVR','CPA'],CTR:['CTR','CLICKS','CVR'],ENGAGEMENT:['ENGAGEMENT','REACH','IMPRESSIONS']};return map[primary]||['ENGAGEMENT','REACH','IMPRESSIONS'];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_coreMetrics_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_coreMetrics_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_learnCampaign_(orgId,brandId,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_learnCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'ANALYST'),os=ctx.ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),s=KOL_IDS_LEARNING_outcomeSchema_(os),rows=KOL_IDS_LEARNING_getOutcomes_(orgId,brandId,{campaignId:campaignId}),creators={};rows.forEach(function(r){var c=String(r[s.creator]||'');if(c)creators[c]=true;});var metrics=KOL_IDS_LEARNING_coreMetrics_(KOL_IDS_LEARNING_campaignObjective_(ctx,campaignId)),results=[];Object.keys(creators).forEach(function(c){metrics.forEach(function(m){var vals=rows.filter(function(r){return String(r[s.creator])===c;}).map(function(r){return KOL_IDS_LEARNING_outcomeMetric_(r,s,m);}).filter(function(v){return v!=null;});if(!vals.length)return;try{KOL_IDS_LEARNING_signal_(orgId,brandId,campaignId,c,m,vals[vals.length-1]);results.push(KOL_IDS_LEARNING_learnCreator_(orgId,brandId,c,m,campaignId));}catch(e){}});});return{success:true,campaignId:campaignId,creators:Object.keys(creators).length,metrics:metrics,learningRows:results.length};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_learnCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_learnCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_autoEvaluate_(orgId,brandId,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_autoEvaluate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'ANALYST'),rs=ctx.ss.getSheetByName(KOL_IDS.SHEETS.RECOMMENDATIONS),rm=KOL_IDS_LEARNING_map_(rs),os=ctx.ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),om=KOL_IDS_LEARNING_outcomeSchema_(os),out=KOL_IDS_LEARNING_getOutcomes_(orgId,brandId,{campaignId:campaignId,creatorId:creatorId}),rlist=KOL_IDS_LEARNING_rows_(rs).filter(function(r){return String(r[rm['Org ID']])===String(orgId)&&String(r[rm['Brand ID']])===String(brandId)&&String(r[rm['Campaign ID']])===String(campaignId)&&String(r[rm['Creator ID']])===String(creatorId)&&!String(r[rm['Actual Outcome ID']]||'');}),evaluated=0;var latest=out.sort(function(a,b){return new Date(b[om.observed])-new Date(a[om.observed]);})[0];if(!latest)return 0;rlist.forEach(function(r){try{var reason={};try{reason=JSON.parse(String(r[rm['Reason JSON']]||'{}'));}catch(e){}var metric=KOL_IDS_LEARNING_metricForObjective_(reason.objective||'');if(reason.metric)metric=KOL_IDS_LEARNING_metric_(reason.metric);var actual=KOL_IDS_LEARNING_outcomeMetric_(latest,om,metric);if(actual!=null){KOL_IDS_DATAMOAT_DM_evaluateRecommendation_(orgId,brandId,String(r[rm['Recommendation ID']]),String(latest[om.id]||latest[om.creator]||''),actual);evaluated++;}}catch(e){}});return evaluated;}catch(e){return 0;}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_autoEvaluate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_autoEvaluate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_recordOutcome_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_recordOutcome_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var r=KOL_IDS_DATAMOAT_DM_recordOutcome_(orgId,brandId,data),campaignId=String(data&&data.campaignId||''),creatorId=String(data&&data.creatorId||'');try{r.autoEvaluated=KOL_IDS_LEARNING_autoEvaluate_(orgId,brandId,campaignId,creatorId);r.learning=KOL_IDS_LEARNING_learnCampaign_(orgId,brandId,campaignId);}catch(e){r.learning={success:false,error:String(e.message||e)};}return r;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_recordOutcome_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_recordOutcome_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_rebuildLearning_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_rebuildLearning_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'STRATEGIST'),sh=ctx.ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),s=KOL_IDS_LEARNING_outcomeSchema_(sh),rows=KOL_IDS_LEARNING_rows_(sh),campaigns={};rows.forEach(function(r){if(String(r[s.org])===String(orgId)&&String(r[s.brand])===String(brandId)&&String(r[s.status]||'FINAL').toUpperCase()!=='VOID')campaigns[String(r[s.campaign])]=true;});var results=[];Object.keys(campaigns).forEach(function(c){results.push(KOL_IDS_LEARNING_learnCampaign_(orgId,brandId,c));});return{success:true,version:KOL_IDS.VERSION,campaigns:Object.keys(campaigns).length,results:results};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_rebuildLearning_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_rebuildLearning_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_learningHealth_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_learningHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ctx=KOL_IDS_LEARNING_ctx_(orgId,brandId,'VIEWER'),ss=ctx.ss,os=ss.getSheetByName(KOL_IDS.SHEETS.OUTCOMES),ls=ss.getSheetByName(KOL_IDS.SHEETS.LEARNING),om=KOL_IDS_LEARNING_outcomeSchema_(os),out=KOL_IDS_LEARNING_rows_(os).filter(function(r){return String(r[om.org])===String(orgId)&&String(r[om.brand])===String(brandId)&&String(r[om.status]||'FINAL').toUpperCase()!=='VOID';}),learn=KOL_IDS_LEARNING_rows_(ls),lm=KOL_IDS_LEARNING_map_(ls),brandLearn=learn.filter(function(r){return String(r[lm['Org ID']])===String(orgId)&&String(r[lm['Brand ID']])===String(brandId);}),learned=brandLearn.filter(function(r){return String(r[lm['Learning Status']])==='LEARNED';}).length;return{success:true,version:KOL_IDS.VERSION,outcomes:out.length,learningRows:brandLearn.length,learnedRows:learned,learningCoverage:out.length?Number((learned/out.length*100).toFixed(1)):0,readyForLearning:out.length>=KOL_IDS.MIN_SAMPLE};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_learningHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_learningHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_LEARNING_contractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_contractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ss=KOL_IDS_LEARNING_ensure_(),specs=KOL_IDS_LEARNING_headers_(),checks=[],ok=true;Object.keys(specs).forEach(function(n){var sh=ss.getSheetByName(n),m=KOL_IDS_LEARNING_map_(sh),pass=!!sh&&specs[n].every(function(h){return m[h]!=null;});checks.push({name:n,pass:pass});if(!pass)ok=false;});['KOL_IDS_DATAMOAT_DM_recordOutcome_','KOL_IDS_DATAMOAT_DM_evaluateRecommendation_','KOL_IDS_PLATFORM_getBenchmark','KOL_IDS_GROWTH_matchCreators_'].forEach(function(n){var pass=typeof this[n]==='function';checks.push({name:n,pass:pass});if(!pass)ok=false;},this);return{success:ok,version:KOL_IDS.VERSION,checks:checks};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_contractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_contractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* LEGACY_V25.16 50X: freshness-aware learning confidence */
function KOL_IDS_LEARNING_d50_learningConfidence_(sampleSize, evidenceQuality, observedAt) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_d50_learningConfidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var freshness = KOL_IDS_GROWTH_d50_freshness_(observedAt);
  return KOL_IDS_GROWTH_d50_confidence_(sampleSize, evidenceQuality, freshness);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_d50_learningConfidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_d50_learningConfidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* LEGACY_V25.16 COHESION LEARNING CONTRACT
 * Keep outcome evidence comparable with recommendation evidence.
 */
function KOL_IDS_LEARNING_cohesionLearningWeight_(sampleSize, evidenceQuality, observedAt){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_cohesionLearningWeight_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var freshness=KOL_IDS_GROWTH_cohesionFreshness_(observedAt);
  var n=Math.max(0,KOL_IDS_GROWTH_cohesionNum_(sampleSize,0));
  var volume=1-Math.exp(-n/5);
  return KOL_IDS_GROWTH_cohesionClamp_(
    0.10+0.55*volume+0.20*KOL_IDS_GROWTH_cohesionClamp_(evidenceQuality,0,1)+0.15*freshness,
    0.05,1
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_cohesionLearningWeight_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_cohesionLearningWeight_', Date.now() - __kolIdsTraceStartedAt);
  }
}
