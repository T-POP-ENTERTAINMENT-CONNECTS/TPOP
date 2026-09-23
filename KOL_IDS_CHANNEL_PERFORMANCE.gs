/**
 * KOL IDS™ 1.1.0 — Channel Performance compatibility facade.
 * Canonical performance authority is KOL_IDS_PERFORMANCE_AUTHORITY / 09_PERFORMANCE.
 * This file contains no independent storage or scoring authority.
 */
var KOL_IDS_PERFORMANCE_ENGINE_VERSION = '1.1.0-AUTHORITY-FACADE';
var KOL_IDS_PERFORMANCE_CHANNELS = {
  TIKTOK:{label:'TikTok',family:'SOCIAL_VIDEO'},
  INSTAGRAM:{label:'Instagram',family:'SOCIAL'},
  FACEBOOK:{label:'Facebook',family:'SOCIAL'},
  YOUTUBE:{label:'YouTube',family:'LONG_VIDEO'},
  X:{label:'X',family:'SOCIAL'},
  ONLINE_ADS:{label:'Online Ads',family:'PAID_MEDIA'},
  OFFLINE_EVENT:{label:'Offline Event',family:'OFFLINE'},
  RETAIL_O2O:{label:'Retail / O2O',family:'OFFLINE_COMMERCE'}
};
function KOL_IDS_PERF_num_(v){var n=Number(v);return isFinite(n)&&n>=0?n:0;}
function KOL_IDS_PERF_str_(v){return v===null||v===undefined?'':String(v).trim();}
function KOL_IDS_PERF_channel_(v){var c=KOL_IDS_PERF_str_(v).toUpperCase();return KOL_IDS_PERFORMANCE_CHANNELS[c]?c:'';}
function KOL_IDS_PERF_ratio_(n,d){return d>0?Math.round(n/d*10000)/100:null;}
function KOL_IDS_PERF_HEADERS_(){return typeof KOL_IDS_PA_headers_==='function'?KOL_IDS_PA_headers_():[];}
function KOL_IDS_PERF_calculate_(row){
  if(typeof KOL_IDS_PA_calculate_==='function')return KOL_IDS_PA_calculate_(row||{});
  return row||{};
}
function KOL_IDS_PERF_validateRows_(payload){
  var rows=payload&&Array.isArray(payload.rows)?payload.rows:[];
  if(!rows.length)throw new Error('At least one performance record is required.');
  return {success:true,rows:rows.length,engineVersion:KOL_IDS_PERFORMANCE_ENGINE_VERSION};
}
function KOL_IDS_PERF_saveRows_(payload){
  KOL_IDS_PERF_validateRows_(payload);
  if(typeof KOL_IDS_PERF_AUTHORITY_SAVE!=='function')throw new Error('Performance Authority is unavailable.');
  return KOL_IDS_PERF_AUTHORITY_SAVE(payload||{});
}
function KOL_IDS_PERF_read_(analysisId){
  if(typeof KOL_IDS_PERF_AUTHORITY_READ!=='function')return {headers:KOL_IDS_PERF_HEADERS_(),rows:[],summary:{}};
  var r=KOL_IDS_PERF_AUTHORITY_READ({analysisId:analysisId,maxRows:1000});
  return {headers:KOL_IDS_PERF_HEADERS_(),rows:r.rows||[],summary:{},source:'09_PERFORMANCE',authorityVersion:r.authorityVersion};
}
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_QA(){
  var a=KOL_IDS_PERF_calculate_({channel:'YOUTUBE',objective:'AWARENESS',impressions:1000,views:500,avgViewPercentage:50,likes:40,comments:10,shares:5,clicks:20,conversions:2,spend:1000,revenue:3000});
  return {success:!!a&&a.channel==='YOUTUBE'&&(a.channelScore===null||a.channelScore>=0&&a.channelScore<=100),source:'09_PERFORMANCE',engineVersion:KOL_IDS_PERFORMANCE_ENGINE_VERSION};
}


function KOL_IDS_PERF_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERF_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_QA, this, arguments);
}
