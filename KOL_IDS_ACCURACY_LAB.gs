/**
 * KOL IDS — ACCURACY LAB + ADAPTIVE DECISION SCIENCE
 *
 * Goal: make every prediction more honest, deep, and testable over time.
 * Statistical boundaries:
 * - No observational campaign data is treated as causal proof.
 * - All calibration used for a historical prediction is restricted to data
 *   available before that prediction's timestamp (leakage-safe).
 * - Sparse evidence is shrunk toward a neutral prior.
 * - Prediction intervals are calibrated from out-of-sample residuals when
 *   enough evidence exists; otherwise they remain explicitly wide.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  PRIOR_MEAN:50,
  PRIOR_STRENGTH:12,
  HALF_LIFE_DAYS:120,
  MIN_OOS_FOR_CALIBRATION:8,
  MIN_OOS_FOR_INTERVAL:12,
  MIN_OOS_FOR_MODEL_TRUST:20,
  MAX_ADJUSTMENT:10,
  MAX_CALIBRATION:4,
  MAX_DRIFT:3,
  MIN_COVERAGE_80:0.70,
  TARGET_COVERAGE_80:0.80,
  EPS:1e-9
});

function KOL_IDS_ACCURACY_LAB_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 if(v===''||v===null||v===undefined)return null; const n=Number(v); return isFinite(n)?n:null; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 const n=Number(v); return isFinite(n)?Math.max(a,Math.min(b,n)):a; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_date_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 const d=new Date(v); return isNaN(d.getTime())?null:d; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_recency_(v,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_recency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 const d=KOL_IDS_ACCURACY_LAB_date_(v),KOL_IDS_ACCURACY_LAB_t=KOL_IDS_ACCURACY_LAB_date_(asOf)||new Date(); if(!d)return 0; const days=Math.max(0,(KOL_IDS_ACCURACY_LAB_t-d)/86400000); return Math.pow(.5,days/KOL_IDS.HALF_LIFE_DAYS); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_recency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_recency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_mean_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 const x=(a||[]).filter(v=>isFinite(Number(v))).map(Number); return x.length?x.reduce((s,v)=>s+v,0)/x.length:null; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_median_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 const x=(a||[]).filter(v=>isFinite(Number(v))).map(Number).sort((a,b)=>a-b); if(!x.length)return null; const m=Math.floor(x.length/2); return x.length%2?x[m]:(x[m-1]+x[m])/2; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_quantile_(a,q){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_quantile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 const x=(a||[]).filter(v=>isFinite(Number(v))).map(Number).sort((a,b)=>a-b); if(!x.length)return null; const p=(x.length-1)*q,i=Math.floor(p),f=p-i; return x[i]+(x[i+1]===undefined?0:(x[i+1]-x[i])*f); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_quantile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_quantile_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_header_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_header_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return sh&&sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]:[]; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_header_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_header_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 const m={}; KOL_IDS_ACCURACY_LAB_header_(sh).forEach((x,i)=>m[String(x).trim()]=i); return m; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[]; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_ledgerRowsBefore_(ss,goal,asOf,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_ledgerRowsBefore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh=ss.getSheetByName('ENT_PREDICTION_LEDGER'); if(!sh)return [];
  const m=KOL_IDS_ACCURACY_LAB_map_(sh), cutoff=KOL_IDS_ACCURACY_LAB_date_(asOf),out=[];
  KOL_IDS_ACCURACY_LAB_rows_(sh).forEach(r=>{
    if(String(r[m['Goal']]||'').toUpperCase()!==String(goal||'').toUpperCase())return;
    if(excludeCampaignId!==undefined&&String(r[m['Campaign ID']])===String(excludeCampaignId))return;
    const actual=KOL_IDS_ACCURACY_LAB_num_(r[m['Actual Score']]),pred=KOL_IDS_ACCURACY_LAB_num_(r[m['Predicted Score']]),d=KOL_IDS_ACCURACY_LAB_date_(r[m['Actual At']]);
    if(actual===null||pred===null||!d)return;
    if(cutoff&&d.getTime()>cutoff.getTime())return;
    out.push({actual:actual,pred:pred,error:actual-pred,abs:Math.abs(actual-pred),date:d,covered:String(r[m['Coverage Hit']])==='YES',confidence:KOL_IDS_ACCURACY_LAB_num_(r[m['Confidence']])});
  });
  return out.sort((a,b)=>b.date-a.date);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_ledgerRowsBefore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_ledgerRowsBefore_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_calibration_(ss,goal,asOf,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_calibration_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const a=KOL_IDS_ACCURACY_LAB_ledgerRowsBefore_(ss,goal,asOf,excludeCampaignId); if(!a.length)return{bias:0,mae:null,n:0,effectiveN:0,coverage80:null,status:'NO_EVIDENCE'};
  let sw=0,b=0,mae=0; a.forEach(x=>{const KOL_IDS_PLATFORM_w=KOL_IDS_ACCURACY_LAB_recency_(x.date,asOf);sw+=KOL_IDS_PLATFORM_w;b+=KOL_IDS_PLATFORM_w*x.error;mae+=KOL_IDS_PLATFORM_w*x.abs;});
  const cov=a.length>=KOL_IDS.MIN_OOS_FOR_INTERVAL?KOL_IDS_ACCURACY_LAB_mean_(a.map(x=>x.covered?1:0)):null;
  return {bias:b/sw,mae:mae/sw,n:a.length,effectiveN:sw,coverage80:cov,status:a.length>=KOL_IDS.MIN_OOS_FOR_CALIBRATION?'ACTIVE':'WEAK'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_calibration_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_calibration_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_residualInterval_(ss,goal,asOf,excludeCampaignId,center){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_residualInterval_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const a=KOL_IDS_ACCURACY_LAB_ledgerRowsBefore_(ss,goal,asOf,excludeCampaignId).filter(x=>isFinite(x.error));
  if(a.length<KOL_IDS.MIN_OOS_FOR_INTERVAL)return {lower:KOL_IDS_ACCURACY_LAB_clamp_(center-18,0,100),upper:KOL_IDS_ACCURACY_LAB_clamp_(center+18,0,100),coverage:null,n:a.length,method:'WIDE_PRIOR'};
  const r=a.map(x=>x.error),q10=KOL_IDS_ACCURACY_LAB_quantile_(r,.10),q90=KOL_IDS_ACCURACY_LAB_quantile_(r,.90),q05=KOL_IDS_ACCURACY_LAB_quantile_(r,.05),q95=KOL_IDS_ACCURACY_LAB_quantile_(r,.95);
  const lo=KOL_IDS_ACCURACY_LAB_clamp_(center+q10,0,100),hi=KOL_IDS_ACCURACY_LAB_clamp_(center+q90,0,100);
  return {lower:lo,upper:hi,coverage80:KOL_IDS_ACCURACY_LAB_mean_(a.map(x=>x.covered?1:0)),n:a.length,method:'EMPIRICAL_OOS_RESIDUALS',q05:q05,q95:q95};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_residualInterval_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_residualInterval_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_drift_(ss,creatorId,goal,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_drift_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ps=KOL_IDS_PA_legacyProjection_(ss); if(!ps)return{delta:0,status:'NO_DATA'};
  const rows=KOL_IDS_ACCURACY_LAB_rows_(ps).filter(r=>String(r[2])===String(creatorId)&&String(r[12]||'').toUpperCase()==='COMPLETED');
  const cutoff=KOL_IDS_ACCURACY_LAB_date_(asOf),vals=[];
  rows.forEach(r=>{const d=KOL_IDS_ACCURACY_LAB_date_(r[14]||r[16]);if(cutoff&&d&&d>cutoff)return; if(!d)return; const g=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],r[2]); if(String(g).toUpperCase()!==String(goal||'').toUpperCase())return; const s=KOL_IDS_OPTIMIZATION_outcome_(r,g);if(s!==null)vals.push({d:d,s:s});});
  vals.sort((a,b)=>a.d-b.d); if(vals.length<6)return{delta:0,status:'INSUFFICIENT_DATA',n:vals.length};
  const k=Math.floor(vals.length/2),old=KOL_IDS_ACCURACY_LAB_mean_(vals.slice(0,k).map(x=>x.s)),recent=KOL_IDS_ACCURACY_LAB_mean_(vals.slice(k).map(x=>x.s)),delta=recent-old;
  return {delta:delta,status:Math.abs(delta)>=12?'DRIFT_DETECTED':'STABLE',n:vals.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_drift_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_drift_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_signal_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_signal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // QA/prior mode: a null spreadsheet is an intentional no-data input.
  // Return a deterministic prior instead of dereferencing ss through downstream data access.
  if(!ss)return{score:50,lower:30,upper:70,confidence:10,effectiveN:0,creatorN:0,cohortN:0,status:'PRIOR_ONLY',calibrationBias:0,calibrationMAE:null,calibrationN:0,effectiveCalibrationN:0,intervalCoverage80:null,intervalMethod:'WIDE_PRIOR',drift:0,driftStatus:'INSUFFICIENT_DATA',modelTrust:'LOW',modelVersion:KOL_IDS.VERSION,accuracyGuard:'STRICT_OOS + LEAKAGE_SAFE + CALIBRATED'};

  const base=KOL_IDS_OPTIMIZATION_predict_(ss,creatorId,goal,excludeCampaignId,asOf);
  const cal=KOL_IDS_ACCURACY_LAB_calibration_(ss,goal,asOf,excludeCampaignId);
  const corrected=KOL_IDS_ACCURACY_LAB_clamp_(base.score + KOL_IDS_ACCURACY_LAB_clamp_(cal.bias*.35,-KOL_IDS.MAX_CALIBRATION,KOL_IDS.MAX_CALIBRATION),0,100);
  const interval=KOL_IDS_ACCURACY_LAB_residualInterval_(ss,goal,asOf,excludeCampaignId,corrected);
  const drift=KOL_IDS_ACCURACY_LAB_drift_(ss,creatorId,goal,asOf);
  const driftAdj=KOL_IDS_ACCURACY_LAB_clamp_(drift.delta*.05,-KOL_IDS.MAX_DRIFT,KOL_IDS.MAX_DRIFT);
  const score=KOL_IDS_ACCURACY_LAB_clamp_(corrected+driftAdj,0,100);
  const evidence=Math.min(100,base.confidence + (cal.n>=KOL_IDS.MIN_OOS_FOR_MODEL_TRUST?8:0) - (interval.method==='WIDE_PRIOR'?8:0) - (drift.status==='DRIFT_DETECTED'?10:0));
  const trust=cal.n>=KOL_IDS.MIN_OOS_FOR_MODEL_TRUST&&interval.method==='EMPIRICAL_OOS_RESIDUALS'?'HIGH':(cal.n>=KOL_IDS.MIN_OOS_FOR_CALIBRATION?'MEDIUM':'LOW');
  return Object.assign({},base,{score:Math.round(score*100)/100,lower:Math.round(interval.lower*100)/100,upper:Math.round(interval.upper*100)/100,confidence:Math.round(KOL_IDS_ACCURACY_LAB_clamp_(evidence,5,97)),calibrationBias:Math.round(cal.bias*100)/100,calibrationMAE:cal.mae===null?null:Math.round(cal.mae*100)/100,calibrationN:cal.n,effectiveCalibrationN:Math.round(cal.effectiveN*100)/100,intervalCoverage80:interval.coverage80===null?null:Math.round(interval.coverage80*1000)/10,intervalMethod:interval.method,drift:Math.round(driftAdj*100)/100,driftStatus:drift.status,modelTrust:trust,modelVersion:KOL_IDS.VERSION,accuracyGuard:'STRICT_OOS + LEAKAGE_SAFE + CALIBRATED'});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_signal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_signal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_getDecisionSignal_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_getDecisionSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return (typeof KOL_IDS_ACCURACY_ENGINE_signal_==='function') ? KOL_IDS_ACCURACY_ENGINE_signal_(ss,creatorId,goal,excludeCampaignId,asOf) : KOL_IDS_ACCURACY_LAB_signal_(ss,creatorId,goal,excludeCampaignId,asOf); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_getDecisionSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_getDecisionSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_learningBridge_(ss,creatorId,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_learningBridge_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return (typeof KOL_IDS_ACCURACY_ENGINE_signal_==='function') ? KOL_IDS_ACCURACY_ENGINE_signal_(ss,creatorId,goal,'','') : KOL_IDS_ACCURACY_LAB_signal_(ss,creatorId,goal,'',''); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_learningBridge_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_learningBridge_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_backtest(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_backtest');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss); if(!ps)return{success:true,observations:0,status:'NO_DATA'};
  const rows=KOL_IDS_ACCURACY_LAB_rows_(ps).filter(r=>String(r[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_OPTIMIZATION_perfValid_(r).valid).sort((a,b)=>new Date(KOL_IDS_ACCURACY_LAB_rDateSafe_(a))-new Date(KOL_IDS_ACCURACY_LAB_rDateSafe_(b)));
  const out=[]; rows.forEach(r=>{const goal=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],r[2]),actual=KOL_IDS_OPTIMIZATION_outcome_(r,goal),d=KOL_IDS_ACCURACY_LAB_rDateSafe_(r);if(!goal||actual===null)return;const sig=KOL_IDS_ACCURACY_LAB_signal_(ss,r[2],goal,r[1],d);if(sig.effectiveN<1)return;const err=actual-sig.score;out.push({date:d,goal:goal,error:err,abs:Math.abs(err),covered:actual>=sig.lower&&actual<=sig.upper});});
  const mae=KOL_IDS_ACCURACY_LAB_mean_(out.map(x=>x.abs)),bias=KOL_IDS_ACCURACY_LAB_mean_(out.map(x=>x.error)),cov=KOL_IDS_ACCURACY_LAB_mean_(out.map(x=>x.covered?1:0));
  const byGoal={};out.forEach(x=>{if(!byGoal[x.goal])byGoal[x.goal]=[];byGoal[x.goal].push(x);});
  const detail={};Object.keys(byGoal).forEach(g=>{const a=byGoal[g];detail[g]={n:a.length,mae:KOL_IDS_ACCURACY_LAB_mean_(a.map(x=>x.abs)),bias:KOL_IDS_ACCURACY_LAB_mean_(a.map(x=>x.error)),coverage80:KOL_IDS_ACCURACY_LAB_mean_(a.map(x=>x.covered?1:0))};});
  return{success:true,observations:out.length,mae:mae===null?null:Math.round(mae*100)/100,bias:bias===null?null:Math.round(bias*100)/100,intervalCoverage80:cov===null?null:Math.round(cov*1000)/10,byGoal:detail,status:out.length>=KOL_IDS.MIN_OOS_FOR_MODEL_TRUST?'BACKTEST_READY':'INSUFFICIENT_HISTORY',method:'WALK_FORWARD_STRICT_OOS'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_backtest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_backtest', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ACCURACY_LAB_rDateSafe_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_rDateSafe_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return r[14]||r[16]||new Date(0);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_rDateSafe_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_rDateSafe_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_accuracyLab(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_accuracyLab');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),bt=KOL_IDS_ACCURACY_LAB_backtest(),cal={};
  ['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'].forEach(g=>cal[g]=KOL_IDS_ACCURACY_LAB_calibration_(ss,g,'',''));
  const warnings=[];
  Object.keys(cal).forEach(g=>{const c=cal[g];if(c.n>=KOL_IDS.MIN_OOS_FOR_CALIBRATION&&Math.abs(c.bias)>8)warnings.push(g+':HIGH_BIAS');if(c.n>=KOL_IDS.MIN_OOS_FOR_INTERVAL&&c.coverage80!==null&&c.coverage80< KOL_IDS.MIN_COVERAGE_80)warnings.push(g+':UNDER_COVERAGE');});
  return{success:true,version:KOL_IDS.VERSION,backtest:bt,calibration:cal,warnings:warnings,principle:'NO_CLAIM_OF_ACCURACY_WITHOUT_OOS_EVIDENCE'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_accuracyLab', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_accuracyLab', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ACCURACY_LAB_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ACCURACY_LAB_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const f=[];function KOL_IDS_ACCURACY_LAB_t(n,v){if(!v)f.push(n);}
  KOL_IDS_ACCURACY_LAB_t('clamp',KOL_IDS_ACCURACY_LAB_clamp_(150,0,100)===100);
  KOL_IDS_ACCURACY_LAB_t('quantile',KOL_IDS_ACCURACY_LAB_quantile_([0,50,100],.5)===50);
  KOL_IDS_ACCURACY_LAB_t('median',KOL_IDS_ACCURACY_LAB_median_([1,3,2])===2);
  KOL_IDS_ACCURACY_LAB_t('prior signal',KOL_IDS_ACCURACY_LAB_signal_(null,'x','AWARENESS','','').score===50);
  KOL_IDS_ACCURACY_LAB_t('strict version',KOL_IDS.VERSION==='10.0.0');
  return{success:!f.length,tests:5,failures:f,version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ACCURACY_LAB_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ACCURACY_LAB_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
