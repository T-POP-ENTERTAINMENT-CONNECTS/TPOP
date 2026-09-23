/**
 * KOL IDS™ — INVESTMENT DECISION INTELLIGENCE HARDENING
 *
 * Turns the existing decision/report/performance stack into a measurable loop:
 * Decision → Prediction → Actual → Variance → Proof → Learning → Next Decision.
 *
 * Design rules:
 * - never overwrite historical decisions;
 * - never fabricate outcomes or causal ROI claims;
 * - every derived metric is traceable to source rows;
 * - confidence decreases when evidence is thin;
 * - all calculations are deterministic and bounded.
 */
const KOL_IDS_IDI = Object.freeze({
  VERSION:'IDI-1.0',
  SHEETS:{
    LEDGER:'IDI_DECISION_LEDGER',
    OUTCOMES:'IDI_OUTCOME_LEDGER',
    DNA:'IDI_DECISION_DNA',
    PROOF:'IDI_IMPACT_PROOF',
    AUDIT:'IDI_AUDIT_TRAIL'
  },
  EPS:1e-9,
  MAX_ROWS:10000
});

function KOL_IDS_IDI_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(v===''||v==null)return null;
  var n=Number(String(v).replace(/,/g,''));
  return isFinite(n)?n:null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_str_(v,max){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_str_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var s=String(v==null?'':v).trim();return max?s.slice(0,max):s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_str_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_str_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_now_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_now_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return new Date();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_now_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_now_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_uuid_(p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_uuid_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return (p||'IDI')+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,14).toUpperCase();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_uuid_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_uuid_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?Math.max(a,Math.min(b,n)):a;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_headers_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return {
  IDI_DECISION_LEDGER:['Ledger ID','Analysis ID','Campaign ID','Brand ID','Creator ID','Creator Name','Platform','Decision','Decision Score','Investment Score','Confidence Score','Risk','Expected Outcome Index','Expected Risk Index','Evidence Grade','Objective','Budget','Decision Snapshot Hash','Source Decision ID','Decision At','Created At'],
  IDI_OUTCOME_LEDGER:['Outcome Ledger ID','Analysis ID','Campaign ID','Brand ID','Creator ID','Creator Name','Spend','Conversions','Revenue','ROAS','Incremental Sales','Qualified Leads','Actual Outcome Index','Decision Score','Prediction Error','Absolute Error','Outcome Rank','Outcome Percentile','Evidence Grade','Source Performance Row','Observed At','Created At'],
  IDI_DECISION_DNA:['DNA ID','Brand ID','Market','Category','Objective','Creator Type','Platform','Observations','Avg Decision Score','Avg Actual Outcome Index','Avg ROAS','Decision Accuracy','Confidence','Pattern','Last Observed','Created At'],
  IDI_IMPACT_PROOF:['Proof ID','Analysis ID','Campaign ID','Brand ID','Metric','Value','Baseline','Delta','Delta Percent','Evidence Level','Causal Status','Sample Size','Source Rows','Generated At'],
  IDI_AUDIT_TRAIL:['Audit ID','Analysis ID','Campaign ID','Event Type','Entity ID','Before Hash','After Hash','Actor','Event At','Source','Details JSON']
};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_sheet_(ss,name,headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_sheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss.getSheetByName(name)||ss.insertSheet(name);
  if(sh.getLastRow()===0){sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);}
  else{
    var have=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String),changed=false;
    headers.forEach(function(h){if(have.indexOf(h)<0){sh.getRange(1,sh.getLastColumn()+1).setValue(h);have.push(h);changed=true;}});
  }
  return sh;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_sheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_sheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var m={};if(!sh||!sh.getLastColumn())return m;sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].forEach(function(h,i){m[String(h)]=i;});return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues().filter(function(r){return r.some(function(v){return v!==''&&v!=null;});}):[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_init_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_init_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var h=KOL_IDS_IDI_headers_();Object.keys(h).forEach(function(n){KOL_IDS_IDI_sheet_(ss,n,h[n]);});return ss;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_init_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_init_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_hash_(obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var raw=JSON.stringify(obj||{});var bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,raw,Utilities.Charset.UTF_8);return bytes.map(function(b){var x=(b<0?b+256:b).toString(16);return x.length===1?'0'+x:x;}).join('').slice(0,32);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_actor_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_actor_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
try{return String(Session.getActiveUser().getEmail()||Session.getEffectiveUser().getEmail()||'system').toLowerCase();}catch(e){return'system';}
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_actor_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_actor_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_evidenceGrade_(sample,complete){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_evidenceGrade_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(sample)||0,c=Number(complete)||0;if(n>=20&&c>=90)return'A';if(n>=10&&c>=80)return'B';if(n>=5&&c>=65)return'C';if(n>=2&&c>=40)return'D';return'E';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_evidenceGrade_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_evidenceGrade_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_percentile_(v,vals){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_percentile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(vals||[]).filter(function(n){return isFinite(n);}).sort(function(a,b){return a-b;});if(!x.length||v==null)return null;if(x.length===1)return 50;var rank=x.reduce(function(s,n){return s+(n<v?1:n===v?.5:0);},0);return Number((rank/(x.length)*100).toFixed(1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_percentile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_percentile_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_spearman_(pairs){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_spearman_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var p=(pairs||[]).filter(function(x){return x&&isFinite(x.a)&&isFinite(x.b);});if(p.length<3)return null;var rank=function(arr){var s=arr.slice().sort(function(a,b){return a-b;}),o={};s.forEach(function(v,i){if(o[v]==null)o[v]=i+1;});return arr.map(function(v){return o[v];});};var a=rank(p.map(function(x){return x.a;})),b=rank(p.map(function(x){return x.b;})),ma=a.reduce(function(s,v){return s+v;},0)/a.length,mb=b.reduce(function(s,v){return s+v;},0)/b.length;var num=0,da=0,db=0;for(var i=0;i<a.length;i++){var x=a[i]-ma,y=b[i]-mb;num+=x*y;da+=x*x;db+=y*y;}return da&&db?Number((num/Math.sqrt(da*db)).toFixed(3)):0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_spearman_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_spearman_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_IDI_campaignContext_(ss,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_campaignContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss.getSheetByName('ENT_CAMPAIGNS'),m=KOL_IDS_IDI_map_(sh),rows=KOL_IDS_IDI_rows_(sh),r=null;
  rows.some(function(x){if(String(x[m['Campaign ID']])===String(campaignId)){r=x;return true;}return false;});
  if(!r)return {objective:'',budget:null,brandId:'',market:'',category:'',analysisId:''};
  return {objective:KOL_IDS_IDI_str_(m['Campaign Goal']!=null?r[m['Campaign Goal']]:r[4],120),budget:KOL_IDS_IDI_num_(m['Budget']!=null?r[m['Budget']]:r[5]),brandId:KOL_IDS_IDI_str_(m['Brand ID']!=null?r[m['Brand ID']]:''),market:KOL_IDS_IDI_str_(m['Market']!=null?r[m['Market']]:''),category:KOL_IDS_IDI_str_(m['Category']!=null?r[m['Category']]:''),analysisId:KOL_IDS_IDI_str_(m['Analysis ID']!=null?r[m['Analysis ID']]: '')};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_campaignContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_campaignContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_syncDecisions_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_syncDecisions_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // When called by the Decision Engine, use the exact same spreadsheet
  // context that the engine just wrote. Do not self-route here.
  if (!ss) {
    KOL_IDS_SELF_ROUTE_();
    ss=KOL_IDS_PRODUCT_getSpreadsheet_();
  }
  KOL_IDS_IDI_init_(ss);
  var ds=ss.getSheetByName('ENT_DECISIONS'),ps=KOL_IDS_PA_legacyProjection_(ss);
  if(!ds)return{success:true,decisions:0};
  var dm=KOL_IDS_IDI_map_(ds),rows=KOL_IDS_IDI_rows_(ds),ls=ss.getSheetByName(KOL_IDS_IDI.SHEETS.LEDGER),lm=KOL_IDS_IDI_map_(ls),existing=KOL_IDS_IDI_rows_(ls),keys={};
  existing.forEach(function(r){var k=String(r[lm['Source Decision ID']]||'');if(k)keys[k]=true;});
  var added=0;
  rows.forEach(function(r){
    var did=String(r[dm['Decision ID']!=null?dm['Decision ID']:0]||'');if(!did||keys[did])return;
    var cid=String(r[dm['Campaign ID']!=null?dm['Campaign ID']:1]||''),ctx=KOL_IDS_IDI_campaignContext_(ss,cid),score=KOL_IDS_IDI_num_(dm['Decision Score']!=null?r[dm['Decision Score']]:r[5])||0,conf=KOL_IDS_IDI_num_(dm['Confidence Score']!=null?r[dm['Confidence Score']]:r[12])||KOL_IDS_IDI_num_(dm['Confidence']!=null?r[dm['Confidence']]:r[11])||0;
    var creator=String(r[dm['Creator ID']!=null?dm['Creator ID']:2]||''),name=String(r[dm['Creator Name']!=null?dm['Creator Name']:3]||''),decision=String(r[dm['Decision']!=null?dm['Decision']:4]||''),risk=String(dm['Risk']!=null?r[dm['Risk']]:'');
    var historical=[],os=ss.getSheetByName(KOL_IDS_IDI.SHEETS.OUTCOMES),orm=KOL_IDS_IDI_map_(os);
    if(os){KOL_IDS_IDI_rows_(os).forEach(function(or){if(String(or[orm['Creator Name']]||'').trim().toLowerCase()===name.trim().toLowerCase() && String(or[orm['Brand ID']]||'')===String(ctx.brandId) && String(or[orm['Campaign ID']]||'')!==cid){var av=KOL_IDS_IDI_num_(or[orm['Actual Outcome Index']]);if(av!=null)historical.push(av);}});}
    var histAvg=historical.length?historical.reduce(function(a,b){return a+b;},0)/historical.length:null;
    var learningAdj=histAvg==null?0:KOL_IDS_IDI_clamp_((histAvg-50)*0.10,-7.5,7.5);
    var investmentScore=Number(KOL_IDS_IDI_clamp_(score+learningAdj,0,100).toFixed(2));
    var hash=KOL_IDS_IDI_hash_({analysisId:ctx.analysisId,campaignId:cid,creatorId:creator,score:score,investmentScore:investmentScore,conf:conf,historicalCount:historical.length,objective:ctx.objective,decision:decision});
    ls.appendRow([KOL_IDS_IDI_uuid_('LED'),ctx.analysisId,cid,ctx.brandId,creator,name,'',decision,score,investmentScore,conf,risk,investmentScore,0,KOL_IDS_IDI_evidenceGrade_(historical.length,conf),ctx.objective,ctx.budget,hash,did,r[dm['Created At']!=null?dm['Created At']:15]||new Date(),new Date()]);
    KOL_IDS_IDI_audit_('DECISION_CAPTURED',did,'',hash,{creatorId:creator,score:score,confidence:conf});added++;
  });
  SpreadsheetApp.flush();
  return{success:true,decisions:rows.length,captured:added,ledgerRows:KOL_IDS_IDI_rows_(ls).length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_syncDecisions_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_syncDecisions_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_IDI_syncOutcomes_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_syncOutcomes_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // When called by the Decision Engine, use the exact same spreadsheet
  // context that the engine just wrote. Do not self-route here.
  if (!ss) {
    KOL_IDS_SELF_ROUTE_();
    ss=KOL_IDS_PRODUCT_getSpreadsheet_();
  }
  KOL_IDS_IDI_init_(ss);
  var perf=ss.getSheetByName('09_PERFORMANCE'),led=ss.getSheetByName(KOL_IDS_IDI.SHEETS.LEDGER),out=ss.getSheetByName(KOL_IDS_IDI.SHEETS.OUTCOMES);if(!perf||!led)return{success:true,outcomes:0};
  var pm=KOL_IDS_IDI_map_(perf),lm=KOL_IDS_IDI_map_(led),om=KOL_IDS_IDI_map_(out),prows=KOL_IDS_IDI_rows_(perf),lrows=KOL_IDS_IDI_rows_(led),orows=KOL_IDS_IDI_rows_(out),existing={};
  orows.forEach(function(r){existing[String(r[om['Source Performance Row']]||'')]=true;});
  var byCampaign={};lrows.forEach(function(r){var k=String(r[lm['Campaign ID']]||'')+'|'+String(r[lm['Creator ID']]||'');byCampaign[k]=r;});
  var added=0;
  prows.forEach(function(r,i){
    var source=String(i+2),name=String(r[pm['KOL Name']]||'');if(!name||existing[source])return;
    var campaign=String(r[pm['Campaign ID']]||''),brand=String(r[pm['Brand ID']]||''),creatorKey=campaign+'|'+name,decision=null;
    lrows.some(function(lr){if(String(lr[lm['Campaign ID']]||'')===campaign && String(lr[lm['Creator Name']]||'').trim().toLowerCase()===name.trim().toLowerCase()){decision=lr;return true;}return false;});
    var spend=KOL_IDS_IDI_num_(r[pm['Spend']]),rev=KOL_IDS_IDI_num_(r[pm['Revenue']]),conv=KOL_IDS_IDI_num_(r[pm['Conversions']]),inc=KOL_IDS_IDI_num_(r[pm['Incremental Sales']]),leads=KOL_IDS_IDI_num_(r[pm['Qualified Leads']]);
    var roas=spend!=null&&spend>0&&rev!=null?rev/spend:null;
    // Actual Outcome Index is a normalized within-campaign signal; it is never presented as causal ROI.
    var campaignVals=prows.filter(function(x){return String(x[pm['Campaign ID']]||'')===campaign;}).map(function(x){var s=KOL_IDS_IDI_num_(x[pm['Spend']]),v=KOL_IDS_IDI_num_(x[pm['Revenue']]);return s!=null&&s>0&&v!=null?v/s:null;}).filter(function(v){return v!=null;});
    var KOL_IDS_ADAPTIVE_pct=KOL_IDS_IDI_percentile_(roas,campaignVals),actualIndex=KOL_IDS_ADAPTIVE_pct==null?null:KOL_IDS_ADAPTIVE_pct,decisionScore=decision?KOL_IDS_IDI_num_(decision[lm['Investment Score']!=null?lm['Investment Score']:lm['Decision Score']]):null,error=actualIndex!=null&&decisionScore!=null?actualIndex-decisionScore:null,abs=error==null?null:Math.abs(error),grade=KOL_IDS_IDI_evidenceGrade_(campaignVals.length,roas!=null?100:40);
    out.appendRow([KOL_IDS_IDI_uuid_('OUT'),String(r[pm['Analysis ID']]||''),campaign,brand,String(r[pm['KOL Name']]||''),name,spend,conv,rev,roas,inc,leads,actualIndex,decisionScore,error,abs,null,KOL_IDS_ADAPTIVE_pct,grade,source,r[pm['Recorded At']]||new Date(),new Date()]);
    KOL_IDS_IDI_audit_('OUTCOME_CAPTURED',source,'',KOL_IDS_IDI_hash_({campaign:campaign,name:name,spend:spend,revenue:rev,roas:roas}),{roas:roas,actualOutcomeIndex:actualIndex});added++;
  });
  KOL_IDS_IDI_recomputeCampaignRanks_(ss);
  SpreadsheetApp.flush();
  return{success:true,performanceRows:prows.length,captured:added,outcomeRows:KOL_IDS_IDI_rows_(out).length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_syncOutcomes_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_syncOutcomes_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_recomputeCampaignRanks_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_recomputeCampaignRanks_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=ss.getSheetByName(KOL_IDS_IDI.SHEETS.OUTCOMES);if(!sh)return;var m=KOL_IDS_IDI_map_(sh),rows=KOL_IDS_IDI_rows_(sh),groups={};
  rows.forEach(function(r,i){var k=String(r[m['Campaign ID']]||'');(groups[k]||(groups[k]=[])).push({r:r,i:i});});
  Object.keys(groups).forEach(function(k){var g=groups[k].filter(function(x){return KOL_IDS_IDI_num_(x.r[m['Actual Outcome Index']])!=null;}).sort(function(a,b){return KOL_IDS_IDI_num_(b.r[m['Actual Outcome Index']])-KOL_IDS_IDI_num_(a.r[m['Actual Outcome Index']]);});g.forEach(function(x,idx){x.r[m['Outcome Rank']]=idx+1;});});
  if(rows.length)sh.getRange(2,1,rows.length,sh.getLastColumn()).setValues(rows);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_recomputeCampaignRanks_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_recomputeCampaignRanks_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_IDI_buildDNA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_buildDNA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SELF_ROUTE_();
  var ss=KOL_IDS_PRODUCT_getSpreadsheet_();
  KOL_IDS_IDI_init_(ss);
  var out=ss.getSheetByName(KOL_IDS_IDI.SHEETS.OUTCOMES);
  var dna=ss.getSheetByName(KOL_IDS_IDI.SHEETS.DNA);
  var om=KOL_IDS_IDI_map_(out);
  var rows=KOL_IDS_IDI_rows_(out);
  var groups={};
  rows.forEach(function(r){
    var campaignId=String(r[om['Campaign ID']]||'');
    var ctx=KOL_IDS_IDI_campaignContext_(ss,campaignId);
    var key=[String(r[om['Brand ID']]||''),ctx.market,ctx.category,ctx.objective].join('|');
    if(!groups[key]) groups[key]={brandId:String(r[om['Brand ID']]||''),market:ctx.market,category:ctx.category,objective:ctx.objective,rows:[]};
    groups[key].rows.push(r);
  });
  if(dna.getLastRow()>1) dna.getRange(2,1,dna.getLastRow()-1,dna.getLastColumn()).clearContent();
  var emitted=0;
  Object.keys(groups).forEach(function(key){
    var g=groups[key], n=g.rows.length;
    var decisions=[], actuals=[], roas=[], pairs=[];
    g.rows.forEach(function(r){
      var d=KOL_IDS_IDI_num_(r[om['Decision Score']]);
      var a=KOL_IDS_IDI_num_(r[om['Actual Outcome Index']]);
      var rr=KOL_IDS_IDI_num_(r[om['ROAS']]);
      if(d!=null) decisions.push(d);
      if(a!=null) actuals.push(a);
      if(rr!=null) roas.push(rr);
      if(d!=null&&a!=null) pairs.push({a:d,b:a});
    });
    var accurate=pairs.filter(function(p){return Math.abs(p.a-p.b)<=15;}).length;
    var avg=function(a){return a.length?a.reduce(function(x,y){return x+y;},0)/a.length:null;};
    var last=0;
    g.rows.forEach(function(r){var d=new Date(r[om['Observed At']]);if(!isNaN(d.getTime()))last=Math.max(last,d.getTime());});
    dna.appendRow([
      KOL_IDS_IDI_uuid_('DNA'),g.brandId,g.market,g.category,g.objective,'CREATOR','',n,
      avg(decisions),avg(actuals),avg(roas),pairs.length?Number((accurate/pairs.length*100).toFixed(1)):'',
      Math.round(KOL_IDS_IDI_clamp_((Math.min(1,n/20)*60+Math.min(1,actuals.length/10)*40),0,100)),
      'Observed outcome pattern; not a causal guarantee.',last?new Date(last):'',new Date()
    ]);
    emitted++;
  });
  return{success:true,patterns:emitted,observations:rows.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_buildDNA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_buildDNA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_IDI_buildProof_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_buildProof_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SELF_ROUTE_();var ss=KOL_IDS_PRODUCT_getSpreadsheet_();KOL_IDS_IDI_init_(ss);var out=ss.getSheetByName(KOL_IDS_IDI.SHEETS.OUTCOMES),proof=ss.getSheetByName(KOL_IDS_IDI.SHEETS.PROOF),m=KOL_IDS_IDI_map_(out),rows=KOL_IDS_IDI_rows_(out),groups={};
  rows.forEach(function(r){var k=String(r[m['Campaign ID']]||'');(groups[k]||(groups[k]=[])).push(r);});
  if(proof.getLastRow()>1)proof.getRange(2,1,proof.getLastRow()-1,proof.getLastColumn()).clearContent();
  var emitted=0;
  Object.keys(groups).forEach(function(cid){var g=groups[cid],roas=g.map(function(r){return KOL_IDS_IDI_num_(r[m['ROAS']]);}).filter(function(v){return v!=null;}),errs=g.map(function(r){return KOL_IDS_IDI_num_(r[m['Absolute Error']]);}).filter(function(v){return v!=null;}),spend=g.map(function(r){return KOL_IDS_IDI_num_(r[m['Spend']]);}).filter(function(v){return v!=null;}).reduce(function(a,b){return a+b;},0),lowSpend=g.filter(function(r){var s=KOL_IDS_IDI_num_(r[m['Decision Score']]);return s!=null&&s<60;}).map(function(r){return KOL_IDS_IDI_num_(r[m['Spend']]);}).filter(function(v){return v!=null;}).reduce(function(a,b){return a+b;},0),baseline=roas.length?roas.reduce(function(a,b){return a+b;},0)/roas.length:null,decisionAccuracy=errs.length?errs.filter(function(v){return v<=15;}).length/errs.length*100:null;
    var add=function(metric,value,base,delta,evidence,causal){proof.appendRow([KOL_IDS_IDI_uuid_('PRF'),'',''+cid,'',metric,value,base,delta,base&&base!==0?delta/base*100:'',evidence,causal,g.length,String(g.length),new Date()]);emitted++;};
    if(baseline!=null)add('Observed Avg ROAS',baseline,null,null,KOL_IDS_IDI_evidenceGrade_(roas.length,100),'DESCRIPTIVE_NOT_CAUSAL');
    if(decisionAccuracy!=null)add('Decision Accuracy (±15 index points)',decisionAccuracy,50,decisionAccuracy-50,KOL_IDS_IDI_evidenceGrade_(errs.length,100),'DESCRIPTIVE_NOT_CAUSAL');
    if(spend>0)add('Potentially Inefficient Spend Identified',lowSpend,spend,lowSpend,KOL_IDS_IDI_evidenceGrade_(g.length,80),'NOT_A_SAVINGS_CLAIM');
    if(roas.length>=2){var sorted=roas.slice().sort(function(a,b){return b-a;}),gap=sorted[0]-sorted[sorted.length-1];add('Observed Best-to-Lowest ROAS Gap',gap,sorted[sorted.length-1],gap,KOL_IDS_IDI_evidenceGrade_(roas.length,100),'DESCRIPTIVE_NOT_CAUSAL');}
  });
  return{success:true,campaigns:Object.keys(groups).length,proofRows:emitted};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_buildProof_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_buildProof_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_IDI_audit_(eventType,entityId,beforeHash,afterHash,details){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_audit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{var ss=KOL_IDS_PRODUCT_getSpreadsheet_(),sh=KOL_IDS_IDI_sheet_(ss,KOL_IDS_IDI.SHEETS.AUDIT,KOL_IDS_IDI_headers_().IDI_AUDIT_TRAIL),ctx=(typeof KOL_IDS_PRODUCT_UI_GET_STATE==='function'?KOL_IDS_PRODUCT_UI_GET_STATE():{});sh.appendRow([KOL_IDS_IDI_uuid_('AUD'),String(ctx.analysisId||''),String(ctx.campaignId||''),KOL_IDS_IDI_str_(eventType,80),KOL_IDS_IDI_str_(entityId,120),KOL_IDS_IDI_str_(beforeHash,64),KOL_IDS_IDI_str_(afterHash,64),KOL_IDS_IDI_actor_(),new Date(),'KOL_IDS_IDI',JSON.stringify(details||{})]);}catch(e){}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_audit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_audit_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_IDI_getDashboard(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_getDashboard');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('GET_IDI_DASHBOARD',false,function(){KOL_IDS_SELF_ROUTE_();var ss=KOL_IDS_PRODUCT_getSpreadsheet_();KOL_IDS_IDI_init_(ss);KOL_IDS_IDI_syncDecisions_();KOL_IDS_IDI_syncOutcomes_();KOL_IDS_IDI_buildDNA_();KOL_IDS_IDI_buildProof_();var lm=KOL_IDS_IDI_map_(ss.getSheetByName(KOL_IDS_IDI.SHEETS.LEDGER)),om=KOL_IDS_IDI_map_(ss.getSheetByName(KOL_IDS_IDI.SHEETS.OUTCOMES)),pm=KOL_IDS_IDI_map_(ss.getSheetByName(KOL_IDS_IDI.SHEETS.PROOF)),ls=KOL_IDS_IDI_rows_(ss.getSheetByName(KOL_IDS_IDI.SHEETS.LEDGER)),os=KOL_IDS_IDI_rows_(ss.getSheetByName(KOL_IDS_IDI.SHEETS.OUTCOMES)),prs=KOL_IDS_IDI_rows_(ss.getSheetByName(KOL_IDS_IDI.SHEETS.PROOF));var paired=os.filter(function(r){return KOL_IDS_IDI_num_(r[om['Decision Score']])!=null&&KOL_IDS_IDI_num_(r[om['Actual Outcome Index']])!=null;}),errs=paired.map(function(r){return Math.abs(KOL_IDS_IDI_num_(r[om['Prediction Error']]));}),accuracy=errs.length?errs.filter(function(v){return v<=15;}).length/errs.length*100:null,spend=os.map(function(r){return KOL_IDS_IDI_num_(r[om['Spend']]);}).filter(function(v){return v!=null;}).reduce(function(a,b){return a+b;},0),potential=os.filter(function(r){var s=KOL_IDS_IDI_num_(r[om['Decision Score']]);return s!=null&&s<60;}).map(function(r){return KOL_IDS_IDI_num_(r[om['Spend']]);}).filter(function(v){return v!=null;}).reduce(function(a,b){return a+b;},0),roas=os.map(function(r){return KOL_IDS_IDI_num_(r[om['ROAS']]);}).filter(function(v){return v!=null;}),avgRoas=roas.length?roas.reduce(function(a,b){return a+b;},0)/roas.length:null,correlation=KOL_IDS_IDI_spearman_(paired.map(function(r){return{a:KOL_IDS_IDI_num_(r[om['Decision Score']]),b:KOL_IDS_IDI_num_(r[om['Actual Outcome Index']])};}));var grade=KOL_IDS_IDI_evidenceGrade_(paired.length,paired.length?100:0);return{success:true,version:KOL_IDS_IDI.VERSION,metrics:{decisions:ls.length,outcomes:os.length,pairedOutcomes:paired.length,decisionAccuracy:accuracy==null?null:Number(accuracy.toFixed(1)),avgObservedROAS:avgRoas==null?null:Number(avgRoas.toFixed(2)),potentiallyInefficientSpend:potential,totalSpend:spend,predictionRankCorrelation:correlation,evidenceGrade:grade},proof:prs.slice(-20).map(function(r){return{metric:r[pm['Metric']],value:r[pm['Value']],baseline:r[pm['Baseline']],delta:r[pm['Delta']],deltaPercent:r[pm['Delta Percent']],evidenceLevel:r[pm['Evidence Level']],causalStatus:r[pm['Causal Status']],sampleSize:r[pm['Sample Size']]};}),nextActions:paired.length<5?['Capture more verified outcomes before treating the learning signal as strong.']:accuracy!=null&&accuracy<60?['Review decision weights and evidence gaps; prediction error is currently high.']:['Continue capturing actual outcomes; the evidence loop is active.']};});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_getDashboard', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_getDashboard', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_REFRESH(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_REFRESH');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_IDI_getDashboard();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_REFRESH', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_REFRESH', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_IDI_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var ss=KOL_IDS_PRODUCT_getSpreadsheet_(),s=KOL_IDS_IDI_init_(ss),checks=[];Object.keys(KOL_IDS_IDI_headers_()).forEach(function(n){var sh=s.getSheetByName(n),m=KOL_IDS_IDI_map_(sh),ok=KOL_IDS_IDI_headers_()[n].every(function(h){return m[h]!=null;});checks.push({sheet:n,pass:ok});});var d=KOL_IDS_IDI_getDashboard();return{success:checks.every(function(x){return x.pass;})&&!!d.success,checks:checks,dashboard:d};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_IDI_GET_DASHBOARD(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_IDI_GET_DASHBOARD');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_IDI_getDashboard(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_IDI_GET_DASHBOARD', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_IDI_GET_DASHBOARD', Date.now() - __kolIdsTraceStartedAt);
  }
}
