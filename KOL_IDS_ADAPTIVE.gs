/**
 * KOL IDS™ V7.0 — ADAPTIVE INTELLIGENCE / LONG-RUN LEARNING ENGINE
 *
 * Pipeline:
 * Creator Data -> Audience Signals -> Campaign Fit -> Prediction
 * -> Actual -> Error Decomposition -> Calibration -> Learn -> Next Prediction
 *
 * Principles:
 * - No fabricated data; missing stays missing.
 * - No target leakage: an actual campaign never teaches its own prediction.
 * - Historical evidence is goal-matched, recency KOL_IDS_LEARNING_LEGACY_weighted and quality KOL_IDS_LEARNING_LEGACY_weighted.
 * - Small samples shrink toward neutral; outliers are winsorized.
 * - Predictions are stored as point-in-time snapshots.
 * - Model drift and creator drift are visible and bounded.
 * - Every learning action is auditable.
 */

KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  HALF_LIFE_DAYS:180,
  MIN_RECENCY:0.15,
  PRIOR_MEAN:50,
  PRIOR_STRENGTH:4,
  MAX_LEARNING_ADJUSTMENT:12,
  MAX_CALIBRATION_ADJUSTMENT:8,
  MAX_DRIFT_ADJUSTMENT:5,
  MIN_STRONG_SAMPLE:5,
  OUTLIER_Z:2.5
});

function KOL_IDS_ADAPTIVE_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 if(v===''||v===null||v===undefined)return null; const n=Number(v); return isFinite(n)?n:null; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_clamp_(v,lo,hi){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const n=Number(v);return isFinite(n)?Math.max(lo,Math.min(hi,n)):lo;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_days_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_days_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!v)return 9999;const d=new Date(v);return isNaN(d.getTime())?9999:Math.max(0,(Date.now()-d.getTime())/86400000);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_days_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_days_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_recency_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_recency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.max(KOL_IDS.MIN_RECENCY,Math.pow(.5,KOL_IDS_ADAPTIVE_days_(v)/KOL_IDS.HALF_LIFE_DAYS));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_recency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_recency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_mean_(KOL_IDS_ADAPTIVE_a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=KOL_IDS_ADAPTIVE_a.filter(v=>isFinite(Number(v))).map(Number);return x.length?x.reduce((s,v)=>s+v,0)/x.length:50;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_median_(KOL_IDS_ADAPTIVE_a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=KOL_IDS_ADAPTIVE_a.filter(v=>isFinite(Number(v))).map(Number).sort((KOL_IDS_ADAPTIVE_a,b)=>KOL_IDS_ADAPTIVE_a-b);if(!x.length)return 50;const m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_std_(KOL_IDS_ADAPTIVE_a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_std_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=KOL_IDS_ADAPTIVE_a.filter(v=>isFinite(Number(v))).map(Number);if(x.length<2)return 0;const m=KOL_IDS_ADAPTIVE_mean_(x);return Math.sqrt(x.reduce((s,v)=>s+Math.pow(v-m,2),0)/(x.length-1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_std_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_std_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_quantile_(KOL_IDS_ADAPTIVE_a,q){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_quantile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=KOL_IDS_ADAPTIVE_a.filter(v=>isFinite(Number(v))).map(Number).sort((KOL_IDS_ADAPTIVE_a,b)=>KOL_IDS_ADAPTIVE_a-b);if(!x.length)return null;const p=(x.length-1)*q,b=Math.floor(p),f=p-b;return x[b]+(x[b+1]!==undefined?(x[b+1]-x[b])*f:0);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_quantile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_quantile_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_winsor_(v,KOL_IDS_ADAPTIVE_a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_winsor_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const lo=KOL_IDS_ADAPTIVE_quantile_(KOL_IDS_ADAPTIVE_a,.10),hi=KOL_IDS_ADAPTIVE_quantile_(KOL_IDS_ADAPTIVE_a,.90);return lo===null?Number(v):KOL_IDS_ADAPTIVE_clamp_(v,lo,hi);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_winsor_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_winsor_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0],m={};h.forEach((x,i)=>m[String(x).trim()]=i);return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ADAPTIVE_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_validate_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_validate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const reach=KOL_IDS_ADAPTIVE_num_(r[5]),imp=KOL_IDS_ADAPTIVE_num_(r[6]),views=KOL_IDS_ADAPTIVE_num_(r[7]),eng=KOL_IDS_ADAPTIVE_num_(r[8]),clicks=KOL_IDS_ADAPTIVE_num_(r[9]),conv=KOL_IDS_ADAPTIVE_num_(r[10]),rev=KOL_IDS_ADAPTIVE_num_(r[11]);
  const e=[];[4,5,6,7,8,9,10,11].forEach(i=>{const n=KOL_IDS_ADAPTIVE_num_(r[i]);if(n!==null&&n<0)e.push('negative_metric');});
  if(reach!==null&&imp!==null&&reach>imp)e.push('reach_gt_impressions');
  if(views!==null&&imp!==null&&views>imp)e.push('views_gt_impressions');
  if(eng!==null&&imp!==null&&eng>imp)e.push('engagements_gt_impressions');
  if(eng!==null&&views!==null&&eng>views)e.push('engagements_gt_views');
  if(clicks!==null&&imp!==null&&clicks>imp)e.push('clicks_gt_impressions');
  if(clicks!==null&&views!==null&&clicks>views)e.push('clicks_gt_views');
  if(conv!==null&&clicks!==null&&conv>clicks)e.push('conversions_gt_clicks');
  return {valid:!e.length,errors:e};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_validate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_validate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_evidence_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_evidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const status=String(r[12]||'').toUpperCase(), ev=String(r[13]||'').toUpperCase();
  let KOL_IDS_PLATFORM_w=.50;if(status==='COMPLETED')KOL_IDS_PLATFORM_w+=.15;if(ev==='VERIFIED')KOL_IDS_PLATFORM_w+=.30;else if(ev==='SELF-REPORTED')KOL_IDS_PLATFORM_w+=.15;
  const coverage=[4,5,6,7,8,9,10,11].filter(i=>KOL_IDS_ADAPTIVE_num_(r[i])!==null).length/8;
  return KOL_IDS_ADAPTIVE_clamp_(KOL_IDS_PLATFORM_w*(.60+.40*coverage),.05,1);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_evidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_evidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_goal_(ss,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_goal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const cs=ss.getSheetByName('ENT_CAMPAIGNS');
  if(cs){const m=KOL_IDS_ADAPTIVE_map_(cs);const row=KOL_IDS_ADAPTIVE_rows_(cs).find(r=>String(r[0])===String(campaignId));if(row){for(const h of ['Campaign Goal','Objective','Goal'])if(m[h]!=null&&row[m[h]])return String(row[m[h]]).trim().toUpperCase();}}
  const ds=ss.getSheetByName('ENT_DECISIONS');
  if(ds){const m=KOL_IDS_ADAPTIVE_map_(ds);const rows=KOL_IDS_ADAPTIVE_rows_(ds).filter(r=>String(r[1])===String(campaignId)&&String(r[2])===String(creatorId));if(rows.length){for(const h of ['Campaign Goal','Goal'])if(m[h]!=null&&rows[rows.length-1][m[h]])return String(rows[rows.length-1][m[h]]).trim().toUpperCase();}}
  return '';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_goal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_goal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_raw_(r,goal,peerRows){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_raw_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const spend=KOL_IDS_ADAPTIVE_num_(r[4]),reach=KOL_IDS_ADAPTIVE_num_(r[5]),imp=KOL_IDS_ADAPTIVE_num_(r[6]),views=KOL_IDS_ADAPTIVE_num_(r[7]),eng=KOL_IDS_ADAPTIVE_num_(r[8]),clicks=KOL_IDS_ADAPTIVE_num_(r[9]),conv=KOL_IDS_ADAPTIVE_num_(r[10]),rev=KOL_IDS_ADAPTIVE_num_(r[11]);
  const er=imp>0?eng/imp*100:(reach>0?eng/reach*100:null),ctr=imp>0?clicks/imp*100:(views>0?clicks/views*100:null),cvr=clicks>0?conv/clicks*100:null,roas=spend>0&&rev!==null?rev/spend:null;
  const g=String(goal||'AWARENESS').toUpperCase();
  const peers=peerRows||[];
  const vals=(field)=>peers.map(x=>field(x)).filter(v=>v!==null&&isFinite(v));
  function KOL_IDS_ADAPTIVE_pct(v,field,fallback){if(v===null||!isFinite(v))return null;const KOL_IDS_ADAPTIVE_a=vals(field);if(KOL_IDS_ADAPTIVE_a.length>=5){const KOL_IDS_PLATFORM_w=KOL_IDS_ADAPTIVE_winsor_(v,KOL_IDS_ADAPTIVE_a);const below=KOL_IDS_ADAPTIVE_a.filter(x=>x<=KOL_IDS_PLATFORM_w).length;return KOL_IDS_ADAPTIVE_clamp_(below/Math.max(1,KOL_IDS_ADAPTIVE_a.length-1)*100,0,100);}return fallback(v);}
  const KOL_IDS_LEARNING_LEGACY_norm=(v,hi)=>v===null?null:KOL_IDS_ADAPTIVE_clamp_(v/hi*100,0,100);
  const pReach=KOL_IDS_ADAPTIVE_pct(reach,x=>{const z=KOL_IDS_ADAPTIVE_num_(x[5]);return z;},v=>KOL_IDS_LEARNING_LEGACY_norm(v,2000000));
  const pViews=KOL_IDS_ADAPTIVE_pct(views,x=>KOL_IDS_ADAPTIVE_num_(x[7]),v=>KOL_IDS_LEARNING_LEGACY_norm(v,2000000));
  const pEr=KOL_IDS_ADAPTIVE_pct(er,x=>{const z=KOL_IDS_ADAPTIVE_num_(x[6]),e=KOL_IDS_ADAPTIVE_num_(x[8]);return z>0?e/z*100:null;},v=>KOL_IDS_LEARNING_LEGACY_norm(v,8));
  const pCtr=KOL_IDS_ADAPTIVE_pct(ctr,x=>{const z=KOL_IDS_ADAPTIVE_num_(x[6]),c=KOL_IDS_ADAPTIVE_num_(x[9]);return z>0?c/z*100:null;},v=>KOL_IDS_LEARNING_LEGACY_norm(v,5));
  const pCvr=KOL_IDS_ADAPTIVE_pct(cvr,x=>{const c=KOL_IDS_ADAPTIVE_num_(x[9]),v=KOL_IDS_ADAPTIVE_num_(x[10]);return c>0?v/c*100:null;},v=>KOL_IDS_LEARNING_LEGACY_norm(v,8));
  const pRoas=KOL_IDS_ADAPTIVE_pct(roas,x=>{const s=KOL_IDS_ADAPTIVE_num_(x[4]),v=KOL_IDS_ADAPTIVE_num_(x[11]);return s>0&&v!==null?v/s:null;},v=>KOL_IDS_LEARNING_LEGACY_norm(v,6));
  const pRev=KOL_IDS_ADAPTIVE_pct(rev,x=>KOL_IDS_ADAPTIVE_num_(x[11]),v=>KOL_IDS_LEARNING_LEGACY_norm(v,500000));
  const parts=g.indexOf('CONVERSION')>=0?[[pRoas,.50],[pCvr,.25],[pCtr,.15],[pRev,.10]]:g.indexOf('ENGAGEMENT')>=0?[[pEr,.65],[KOL_IDS_ADAPTIVE_pct(reach>0?eng/reach*100:null,x=>{const KOL_IDS_ADAPTIVE_a=KOL_IDS_ADAPTIVE_num_(x[5]),b=KOL_IDS_ADAPTIVE_num_(x[8]);return KOL_IDS_ADAPTIVE_a>0?b/KOL_IDS_ADAPTIVE_a*100:null;},v=>KOL_IDS_LEARNING_LEGACY_norm(v,12)),.20],[pViews,.15]]:g.indexOf('CONSIDERATION')>=0?[[pCtr,.40],[pEr,.35],[pCvr,.25]]:g.indexOf('LAUNCH')>=0?[[pReach,.45],[pViews,.25],[pEr,.20],[pCtr,.10]]:[[pReach,.55],[pViews,.20],[pEr,.25]];
  const valid=parts.filter(x=>x[0]!==null);if(!valid.length)return null;const tw=valid.reduce((s,x)=>s+x[1],0);return KOL_IDS_ADAPTIVE_clamp_(valid.reduce((s,x)=>s+x[0]*x[1],0)/tw,0,100);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_raw_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_raw_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_comparableRows_(ss,creatorId,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_comparableRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh=KOL_IDS_PA_legacyProjection_(ss);if(!sh)return[];const rows=KOL_IDS_ADAPTIVE_rows_(sh);return rows.filter(r=>String(r[2])===String(creatorId)&&String(r[1])!==String(excludeCampaignId)&&String(r[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_ADAPTIVE_validate_(r).valid&&KOL_IDS_ADAPTIVE_goal_(ss,r[1],creatorId)===String(goal||'').toUpperCase());

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_comparableRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_comparableRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_history_(ss,creatorId,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_history_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const rows=KOL_IDS_ADAPTIVE_comparableRows_(ss,creatorId,goal,excludeCampaignId),samples=[];rows.forEach(r=>{const raw=KOL_IDS_ADAPTIVE_raw_(r,goal,rows.filter(x=>String(x[1])!==String(r[1])));if(raw===null)return;samples.push({score:raw,KOL_IDS_PLATFORM_w:KOL_IDS_ADAPTIVE_recency_(r[14]||r[16])*KOL_IDS_ADAPTIVE_evidence_(r),date:r[14]||r[16]});});
  if(!samples.length)return {score:50,adjustment:0,sampleSize:0,effectiveN:0,confidence:0,stability:0,status:'NO_HISTORY'};
  const tw=samples.reduce((s,x)=>s+x.KOL_IDS_PLATFORM_w,0),mean=samples.reduce((s,x)=>s+x.score*x.KOL_IDS_PLATFORM_w,0)/Math.max(.0001,tw),med=KOL_IDS_ADAPTIVE_median_(samples.map(x=>x.score)),sd=KOL_IDS_ADAPTIVE_std_(samples.map(x=>x.score));
  const blended=.65*mean+.35*med,effN=Math.min(12,tw),shrink=effN/(effN+KOL_IDS.PRIOR_STRENGTH),score=50+(blended-50)*shrink,stability=KOL_IDS_ADAPTIVE_clamp_(100-sd*1.2,20,100),conf=Math.round(KOL_IDS_ADAPTIVE_clamp_(20+effN*10,20,80)*.65+stability*.35),adj=KOL_IDS_ADAPTIVE_clamp_((score-50)*.35,-KOL_IDS.MAX_LEARNING_ADJUSTMENT,KOL_IDS.MAX_LEARNING_ADJUSTMENT);
  return {score:Math.round(score),adjustment:Math.round(adj*100)/100,sampleSize:samples.length,effectiveN:Math.round(effN*100)/100,confidence:conf,stability:Math.round(stability),status:samples.length>=KOL_IDS.MIN_STRONG_SAMPLE?'LEARNING_ACTIVE':'EARLY_SIGNAL'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_history_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_history_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_findPrediction_(ss,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_findPrediction_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ds=ss.getSheetByName('ENT_DECISIONS');if(!ds)return null;const m=KOL_IDS_ADAPTIVE_map_(ds),rows=KOL_IDS_ADAPTIVE_rows_(ds).filter(r=>String(r[1])===String(campaignId)&&String(r[2])===String(creatorId));if(!rows.length)return null;const r=rows[rows.length-1];for(const h of ['Decision Score','Score'])if(m[h]!=null){const n=KOL_IDS_ADAPTIVE_num_(r[m[h]]);if(n!==null)return n;}return KOL_IDS_ADAPTIVE_num_(r[5]);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_findPrediction_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_findPrediction_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_calibration_(ss,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_calibration_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh=ss.getSheetByName('ENT_LEARNING_LOOP');if(!sh)return {bias:0,count:0,confidence:0};const m=KOL_IDS_ADAPTIVE_map_(sh),rows=KOL_IDS_ADAPTIVE_rows_(sh),e=[];
  rows.forEach(r=>{if(String(r[m['Goal']]||'').toUpperCase()!==String(goal||'').toUpperCase())return;if(String(r[m['Campaign ID']])===String(excludeCampaignId))return;const er=KOL_IDS_ADAPTIVE_num_(r[m['Prediction Error']]);if(er!==null)e.push({v:er,KOL_IDS_PLATFORM_w:KOL_IDS_ADAPTIVE_recency_(r[m['Observed At']])});});
  if(!e.length)return {bias:0,count:0,confidence:0};const tw=e.reduce((s,x)=>s+x.KOL_IDS_PLATFORM_w,0),bias=e.reduce((s,x)=>s+x.v*x.KOL_IDS_PLATFORM_w,0)/tw;return {bias:KOL_IDS_ADAPTIVE_clamp_(bias,-20,20),count:e.length,confidence:KOL_IDS_ADAPTIVE_clamp_(20+e.length*12,20,90)};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_calibration_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_calibration_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_learningSignal_(ss,creatorId,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_learningSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const h=KOL_IDS_ADAPTIVE_history_(ss,creatorId,goal,excludeCampaignId),c=KOL_IDS_ADAPTIVE_calibration_(ss,goal,excludeCampaignId);
  const cal=KOL_IDS_ADAPTIVE_clamp_(c.bias*.25,-KOL_IDS.MAX_CALIBRATION_ADJUSTMENT,KOL_IDS.MAX_CALIBRATION_ADJUSTMENT);
  return Object.assign({},h,{calibrationBias:Math.round(c.bias*100)/100,calibrationAdjustment:Math.round(cal*100)/100,totalAdjustment:Math.round((h.adjustment+cal)*100)/100});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_learningSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_learningSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_getLearningSignal_(ss,creatorId,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_getLearningSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_ADAPTIVE_learningSignal_==='function')return KOL_IDS_ADAPTIVE_learningSignal_(ss,creatorId,goal,'');
  return {score:50,adjustment:0,sampleSize:0,confidence:0,status:'NO_HISTORY'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_getLearningSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_getLearningSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_ensureSheet_(ss,name,headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_ensureSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
let sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);const current=sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]:[];if(!current.length||!current[0])sh.getRange(1,1,1,headers.length).setValues([headers]);else{const missing=headers.filter(h=>current.indexOf(h)<0);if(missing.length)sh.getRange(1,current.length+1,1,missing.length).setValues([missing]);}sh.setFrozenRows(1);return sh;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_ensureSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_ensureSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_syncActualLearning(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_syncActualLearning');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps||ps.getLastRow()<2)return {success:true,processed:0};
  const ledger=KOL_IDS_ADAPTIVE_ensureSheet_(ss,'ENT_LEARNING_LOOP',['Learning ID','Campaign ID','Creator ID','Goal','Raw Outcome Score','Predicted Score','Prediction Error','Absolute Error','Evidence Weight','Recency Weight','Learning Adjustment','Calibration Adjustment','Sample Size','Historical Confidence','Model Confidence','Data Valid','Observed At','Model Version','Learning Status']);
  const lm=KOL_IDS_ADAPTIVE_map_(ledger),existing=KOL_IDS_ADAPTIVE_rows_(ledger),rows=KOL_IDS_ADAPTIVE_rows_(ps);let processed=0;
  rows.forEach(r=>{
    if(String(r[12]||'').toUpperCase()!=='COMPLETED')return;const v=KOL_IDS_ADAPTIVE_validate_(r);if(!v.valid)return;const cid=r[1],crid=r[2],goal=KOL_IDS_ADAPTIVE_goal_(ss,cid,crid);if(!goal)return;
    const peers=KOL_IDS_ADAPTIVE_comparableRows_(ss,crid,goal,cid),raw=KOL_IDS_ADAPTIVE_raw_(r,goal,peers);if(raw===null)return;const pred=KOL_IDS_ADAPTIVE_findPrediction_(ss,cid,crid),sig=KOL_IDS_ADAPTIVE_learningSignal_(ss,crid,goal,cid),abs=pred===null?null:Math.abs(raw-pred),modelConf=Math.round(.55*sig.confidence+.45*KOL_IDS_ADAPTIVE_evidence_(r)*100);
    const data={'Campaign ID':cid,'Creator ID':crid,'Goal':goal,'Raw Outcome Score':Math.round(raw*100)/100,'Predicted Score':pred===null?'':pred,'Prediction Error':pred===null?'':Math.round((raw-pred)*100)/100,'Absolute Error':abs===null?'':Math.round(abs*100)/100,'Evidence Weight':Math.round(KOL_IDS_ADAPTIVE_evidence_(r)*1000)/1000,'Recency Weight':Math.round(KOL_IDS_ADAPTIVE_recency_(r[14]||r[16])*1000)/1000,'Learning Adjustment':sig.adjustment,'Calibration Adjustment':sig.calibrationAdjustment,'Sample Size':sig.sampleSize,'Historical Confidence':sig.confidence,'Model Confidence':modelConf,'Data Valid':'YES','Observed At':r[14]||r[16]||new Date(),'Model Version':KOL_IDS.VERSION,'Learning Status':sig.status};
    const key=String(cid)+'|'+String(crid),idx=existing.findIndex(x=>String(x[lm['Campaign ID']])+'|'+String(x[lm['Creator ID']])===key),vals=KOL_IDS_ADAPTIVE_set_(ledger,Object.assign({'Learning ID':idx>=0?existing[idx][lm['Learning ID']]:'V7-'+Utilities.getUuid().slice(0,8).toUpperCase()},data));
    if(idx>=0)ledger.getRange(idx+2,1,1,vals.length).setValues([vals]);else ledger.appendRow(vals);processed++;
  });
  KOL_IDS_ADAPTIVE_rebuildIntelligence();return {success:true,processed:processed,version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_syncActualLearning', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_syncActualLearning', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_set_(sh,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_set_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];return h.map(x=>Object.prototype.hasOwnProperty.call(data,x)?data[x]:'');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_set_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_set_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_rebuildIntelligence(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_rebuildIntelligence');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),cs=ss.getSheetByName('ENT_CREATORS'),ps=KOL_IDS_PA_legacyProjection_(ss);if(!cs)return {success:true,creators:0};
  const cm=KOL_IDS_ADAPTIVE_map_(cs),rows=KOL_IDS_ADAPTIVE_rows_(cs),projectionRows=ps?KOL_IDS_ADAPTIVE_rows_(ps):[],sh=KOL_IDS_ADAPTIVE_ensureSheet_(ss,'ENT_CREATOR_INTELLIGENCE',['Snapshot ID','Creator ID','Creator Name','Platform','Followers','ER','ER Source','Audience Coverage','Audience Quality','Data Quality','Historical Campaigns','Historical Outcome','Outcome Stability','Learning Confidence','Creator Health','Observed At','Model Version']);
  rows.forEach(r=>{const id=r[0],hist=ps?projectionRows.filter(x=>String(x[2])===String(id)&&String(x[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_ADAPTIVE_validate_(x).valid):[],out=hist.map(x=>KOL_IDS_ADAPTIVE_raw_(x,KOL_IDS_ADAPTIVE_goal_(ss,x[1],id),hist)).filter(x=>x!==null),er=cm['ER %']!=null?KOL_IDS_ADAPTIVE_num_(r[cm['ER %']]):null,followers=cm['Followers']!=null?KOL_IDS_ADAPTIVE_num_(r[cm['Followers']]):null,age=cm['Audience Age Range']!=null?String(r[cm['Audience Age Range']]||''):'';const audienceFields=['Gender','Locations','Interests','Content Styles','Category','Audience Age Range'].filter(h=>cm[h]!=null&&String(r[cm[h]]||'').trim()!=='').length;const aq=Math.round(audienceFields/6*100),dq=cm['Data Confidence']!=null?String(r[cm['Data Confidence']]||'').toUpperCase()==='HIGH'?90:String(r[cm['Data Confidence']]||'').toUpperCase()==='MEDIUM'?70:50:Math.round((audienceFields/6)*60+(er!==null?20:0)+(followers!==null?20:0));const stability=out.length>1?KOL_IDS_ADAPTIVE_clamp_(100-KOL_IDS_ADAPTIVE_std_(out)*1.3,20,100):50;const health=Math.round(.25*aq+.25*dq+.25*stability+.25*(hist.length>=3?90:hist.length?65:40));
    const data={'Snapshot ID':'SNAP-'+Utilities.getUuid().slice(0,8).toUpperCase(),'Creator ID':id,'Creator Name':r[1],'Platform':r[2],'Followers':followers===null?'':followers,'ER':er===null?'':er,'ER Source':cm['ER Source']!=null?r[cm['ER Source']]:'','Audience Coverage':aq,'Audience Quality':aq,'Data Quality':dq,'Historical Campaigns':hist.length,'Historical Outcome':out.length?Math.round(KOL_IDS_ADAPTIVE_mean_(out)*100)/100:'','Outcome Stability':Math.round(stability),'Learning Confidence':Math.round(hist.length?KOL_IDS_ADAPTIVE_clamp_(20+hist.length*12,20,90):0),'Creator Health':health,'Observed At':new Date(),'Model Version':KOL_IDS.VERSION};sh.appendRow(KOL_IDS_ADAPTIVE_set_(sh,data));
  });
  return {success:true,creators:rows.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_rebuildIntelligence', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_rebuildIntelligence', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ADAPTIVE_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ADAPTIVE_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const f=[];function KOL_IDS_ADAPTIVE_a(n,ok){if(!ok)f.push(n);}const valid=['','','C','N',100,1000,800,700,80,40,4,500,'COMPLETED','VERIFIED',new Date()];const bad=['','','C','N',100,2000,1000,700,80,40,4,500,'COMPLETED','VERIFIED',new Date()];KOL_IDS_ADAPTIVE_a('validation accepts valid',KOL_IDS_ADAPTIVE_validate_(valid).valid);KOL_IDS_ADAPTIVE_a('validation rejects impossible reach',!KOL_IDS_ADAPTIVE_validate_(bad).valid);KOL_IDS_ADAPTIVE_a('winsor bounded',KOL_IDS_ADAPTIVE_winsor_(999,[1,2,3,4,5])<=5);KOL_IDS_ADAPTIVE_a('recency bounded',KOL_IDS_ADAPTIVE_recency_(new Date())<=1);KOL_IDS_ADAPTIVE_a('quantile',KOL_IDS_ADAPTIVE_quantile_([0,50,100],.5)===50);return {success:!f.length,failures:f,tests:5,version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ADAPTIVE_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ADAPTIVE_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
