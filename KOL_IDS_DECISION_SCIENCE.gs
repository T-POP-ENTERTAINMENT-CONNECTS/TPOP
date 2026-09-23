/**
 * KOL IDS™ V8 — DECISION SCIENCE / CONTINUOUS EVIDENCE ENGINE
 *
 * V8 is deliberately stronger than a conventional intelligence dashboard.
 * It treats every prediction as a point-in-time experiment and learns from
 * out-of-sample actuals. It adds cohort similarity, hierarchical shrinkage,
 * calibration, prediction intervals, drift detection, model registry,
 * backtesting and an auditable feature/prediction/learning ledger.
 *
 * Important: this is a transparent statistical learning layer for Apps Script,
 * not a claim of an opaque ML model. It never invents missing observations.
 */

KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  HALF_LIFE_DAYS:120,
  PRIOR_MEAN:50,
  PRIOR_STRENGTH:8,
  MAX_TOTAL_ADJUSTMENT:15,
  MAX_CALIBRATION:6,
  MAX_DRIFT:5,
  MIN_COHORT:4,
  MAX_COHORT:30,
  MIN_BACKTEST:6,
  MODEL_NAME:'KOL_IDS_DECISION_SCIENCE',
  EPS:0.000001
});

function KOL_IDS_DECISION_SCIENCE_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 if(v===''||v===null||v===undefined)return null; const n=Number(v); return isFinite(n)?n:null; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const n=Number(v);return isFinite(n)?Math.max(a,Math.min(b,n)):a;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_days_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_days_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!v)return 9999;const d=new Date(v);return isNaN(d.getTime())?9999:Math.max(0,(Date.now()-d.getTime())/86400000);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_days_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_days_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_recency_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_recency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.pow(.5,KOL_IDS_DECISION_SCIENCE_days_(v)/KOL_IDS.HALF_LIFE_DAYS);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_recency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_recency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_mean_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=a.filter(v=>isFinite(Number(v))).map(Number);return x.length?x.reduce((s,v)=>s+v,0)/x.length:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_std_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_std_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=a.filter(v=>isFinite(Number(v))).map(Number);if(x.length<2)return 0;const m=KOL_IDS_DECISION_SCIENCE_mean_(x);return Math.sqrt(x.reduce((s,v)=>s+Math.pow(v-m,2),0)/(x.length-1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_std_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_std_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_quantile_(a,q){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_quantile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=a.filter(v=>isFinite(Number(v))).map(Number).sort((a,b)=>a-b);if(!x.length)return null;const p=(x.length-1)*q,i=Math.floor(p),f=p-i;return x[i]+(x[i+1]===undefined?0:(x[i+1]-x[i])*f);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_quantile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_quantile_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_header_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_header_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]:[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_header_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_header_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const h=KOL_IDS_DECISION_SCIENCE_header_(sh),m={};h.forEach((x,i)=>m[String(x).trim()]=i);return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_ensure_(ss,name,headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
let sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);const h=KOL_IDS_DECISION_SCIENCE_header_(sh);if(!h.length||!h[0])sh.getRange(1,1,1,headers.length).setValues([headers]);else{const miss=headers.filter(x=>h.indexOf(x)<0);if(miss.length)sh.getRange(1,h.length+1,1,miss.length).setValues([miss]);}sh.setFrozenRows(1);return sh;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_set_(sh,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_set_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const h=KOL_IDS_DECISION_SCIENCE_header_(sh);return h.map(k=>Object.prototype.hasOwnProperty.call(obj,k)?obj[k]:'');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_set_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_set_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_perfValid_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_perfValid_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const e=[]; const idx=[4,5,6,7,8,9,10,11];
  idx.forEach(i=>{const n=KOL_IDS_DECISION_SCIENCE_num_(r[i]);if(n!==null&&n<0)e.push('negative_metric');});
  const reach=KOL_IDS_DECISION_SCIENCE_num_(r[5]),imp=KOL_IDS_DECISION_SCIENCE_num_(r[6]),views=KOL_IDS_DECISION_SCIENCE_num_(r[7]),eng=KOL_IDS_DECISION_SCIENCE_num_(r[8]),clicks=KOL_IDS_DECISION_SCIENCE_num_(r[9]),conv=KOL_IDS_DECISION_SCIENCE_num_(r[10]);
  if(reach!==null&&imp!==null&&reach>imp)e.push('reach_gt_impressions');
  if(views!==null&&imp!==null&&views>imp)e.push('views_gt_impressions');
  if(eng!==null&&imp!==null&&eng>imp)e.push('engagements_gt_impressions');
  if(clicks!==null&&imp!==null&&clicks>imp)e.push('clicks_gt_impressions');
  if(conv!==null&&clicks!==null&&conv>clicks)e.push('conversions_gt_clicks');
  return {valid:e.length===0,errors:e};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_perfValid_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_perfValid_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_evidence_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_evidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let KOL_IDS_PLATFORM_w=.35; const status=String(r[12]||'').toUpperCase(), ev=String(r[13]||'').toUpperCase();
  if(status==='COMPLETED')KOL_IDS_PLATFORM_w+=.15;
  if(ev==='VERIFIED')KOL_IDS_PLATFORM_w+=.40; else if(ev==='SELF-REPORTED')KOL_IDS_PLATFORM_w+=.20; else if(ev==='ESTIMATED')KOL_IDS_PLATFORM_w+=.05;
  const cov=[4,5,6,7,8,9,10,11].filter(i=>KOL_IDS_DECISION_SCIENCE_num_(r[i])!==null).length/8;
  return KOL_IDS_DECISION_SCIENCE_clamp_(KOL_IDS_PLATFORM_w*(.55+.45*cov),.05,1);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_evidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_evidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_goal_(ss,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_goal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const cs=ss.getSheetByName('ENT_CAMPAIGNS');
  if(cs){const m=KOL_IDS_DECISION_SCIENCE_map_(cs);const r=KOL_IDS_DECISION_SCIENCE_rows_(cs).find(x=>String(x[0])===String(campaignId));if(r){for(const h of ['Campaign Goal','Objective','Goal'])if(m[h]!=null&&r[m[h]])return String(r[m[h]]).trim().toUpperCase();}}
  const ds=ss.getSheetByName('ENT_DECISIONS');
  if(ds){const m=KOL_IDS_DECISION_SCIENCE_map_(ds);const rr=KOL_IDS_DECISION_SCIENCE_rows_(ds).filter(x=>String(x[1])===String(campaignId)&&String(x[2])===String(creatorId));if(rr.length){for(const h of ['Campaign Goal','Goal'])if(m[h]!=null&&rr[rr.length-1][m[h]])return String(rr[rr.length-1][m[h]]).trim().toUpperCase();}}
  return '';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_goal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_goal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_outcome_(r,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_outcome_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const spend=KOL_IDS_DECISION_SCIENCE_num_(r[4]),imp=KOL_IDS_DECISION_SCIENCE_num_(r[6]),views=KOL_IDS_DECISION_SCIENCE_num_(r[7]),eng=KOL_IDS_DECISION_SCIENCE_num_(r[8]),clicks=KOL_IDS_DECISION_SCIENCE_num_(r[9]),conv=KOL_IDS_DECISION_SCIENCE_num_(r[10]),rev=KOL_IDS_DECISION_SCIENCE_num_(r[11]);
  const er=imp>0?eng/imp*100:null,ctr=imp>0?clicks/imp*100:null,cvr=clicks>0?conv/clicks*100:null,roas=spend>0&&rev!==null?rev/spend:null;
  const g=String(goal||'AWARENESS').toUpperCase();
  const KOL_IDS_LEARNING_LEGACY_norm=(v,cap)=>v===null?null:KOL_IDS_DECISION_SCIENCE_clamp_(v/cap*100,0,100);
  const p=[];
  if(g.indexOf('CONVERSION')>=0){p.push([KOL_IDS_LEARNING_LEGACY_norm(roas,6),.45],[KOL_IDS_LEARNING_LEGACY_norm(cvr,8),.25],[KOL_IDS_LEARNING_LEGACY_norm(ctr,5),.15],[KOL_IDS_LEARNING_LEGACY_norm(rev,500000),.15]);}
  else if(g.indexOf('ENGAGEMENT')>=0){p.push([KOL_IDS_LEARNING_LEGACY_norm(er,8),.65],[KOL_IDS_LEARNING_LEGACY_norm(views,2000000),.15],[KOL_IDS_LEARNING_LEGACY_norm(eng,100000),.20]);}
  else if(g.indexOf('CONSIDERATION')>=0){p.push([KOL_IDS_LEARNING_LEGACY_norm(ctr,5),.40],[KOL_IDS_LEARNING_LEGACY_norm(er,8),.35],[KOL_IDS_LEARNING_LEGACY_norm(cvr,8),.25]);}
  else if(g.indexOf('LAUNCH')>=0){p.push([KOL_IDS_LEARNING_LEGACY_norm(r[5],2000000),.45],[KOL_IDS_LEARNING_LEGACY_norm(views,2000000),.25],[KOL_IDS_LEARNING_LEGACY_norm(er,8),.20],[KOL_IDS_LEARNING_LEGACY_norm(ctr,5),.10]);}
  else {p.push([KOL_IDS_LEARNING_LEGACY_norm(r[5],2000000),.55],[KOL_IDS_LEARNING_LEGACY_norm(views,2000000),.20],[KOL_IDS_LEARNING_LEGACY_norm(er,8),.25]);}
  const v=p.filter(x=>x[0]!==null); if(!v.length)return null;const tw=v.reduce((s,x)=>s+x[1],0);return v.reduce((s,x)=>s+x[0]*x[1],0)/tw;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_outcome_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_outcome_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_creatorRow_(ss,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_creatorRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const sh=ss.getSheetByName('ENT_CREATORS');if(!sh)return null;return KOL_IDS_DECISION_SCIENCE_rows_(sh).find(r=>String(r[0])===String(creatorId))||null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_creatorRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_creatorRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DECISION_SCIENCE_campaignRow_(ss,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_campaignRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const sh=ss.getSheetByName('ENT_CAMPAIGNS');if(!sh)return null;return KOL_IDS_DECISION_SCIENCE_rows_(sh).find(r=>String(r[0])===String(campaignId))||null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_campaignRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_campaignRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Similarity is intentionally explainable. We match objective first, then
 * creator platform/category/audience fields where the schema contains them. */
function KOL_IDS_DECISION_SCIENCE_similarity_(ss,a,b,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_similarity_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let s=0,KOL_IDS_PLATFORM_w=0; if(String(a.goal)===String(b.goal))s+=.40,KOL_IDS_PLATFORM_w+=.40;
  if(a.platform&&b.platform){s+=(String(a.platform).toLowerCase()===String(b.platform).toLowerCase()?.15:0);KOL_IDS_PLATFORM_w+=.15;}
  if(a.category&&b.category){s+=(String(a.category).toLowerCase()===String(b.category).toLowerCase()?.15:0);KOL_IDS_PLATFORM_w+=.15;}
  function KOL_IDS_DECISION_SCIENCE_overlap(x,y){const A=String(x||'').toLowerCase().split(/[,|;]+/).map(z=>z.trim()).filter(Boolean),B=String(y||'').toLowerCase().split(/[,|;]+/).map(z=>z.trim()).filter(Boolean);if(!A.length||!B.length)return null;const set={};A.forEach(z=>set[z]=1);return B.filter(z=>set[z]).length/Math.max(1,Math.min(A.length,B.length));}
  [['locations',.10],['interests',.10]].forEach(pair=>{const q=KOL_IDS_DECISION_SCIENCE_overlap(a[pair[0]],b[pair[0]]);if(q!==null){s+=q*pair[1];KOL_IDS_PLATFORM_w+=pair[1];}});
  return KOL_IDS_PLATFORM_w?s/KOL_IDS_PLATFORM_w:0;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_similarity_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_similarity_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_comparable_(ss,creatorId,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_comparable_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return[];const cr=KOL_IDS_DECISION_SCIENCE_creatorRow_(ss,creatorId)||[];
  const cm=KOL_IDS_DECISION_SCIENCE_creatorRow_; const out=[];
  KOL_IDS_DECISION_SCIENCE_rows_(ps).forEach(r=>{
    if(String(r[2])!==String(creatorId)||String(r[1])===String(excludeCampaignId)||String(r[12]||'').toUpperCase()!=='COMPLETED'||!KOL_IDS_DECISION_SCIENCE_perfValid_(r).valid)return;
    const g=KOL_IDS_DECISION_SCIENCE_goal_(ss,r[1],creatorId);if(String(g).toUpperCase()!==String(goal||'').toUpperCase())return;
    const camp=KOL_IDS_DECISION_SCIENCE_campaignRow_(ss,r[1])||[]; out.push({row:r,goal:g,score:KOL_IDS_DECISION_SCIENCE_outcome_(r,g),similarity:1,date:r[14]||r[16],evidence:KOL_IDS_DECISION_SCIENCE_evidence_(r),platform:cr[2]||'',category:cr[12]||''});
  });
  return out.filter(x=>x.score!==null);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_comparable_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_comparable_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Build a feature snapshot without manufacturing values. */
function KOL_IDS_DECISION_SCIENCE_features_(ss,creatorId,goal,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_features_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const r=KOL_IDS_DECISION_SCIENCE_creatorRow_(ss,creatorId)||[], ps=KOL_IDS_PA_legacyProjection_(ss);
  const m=ps?KOL_IDS_DECISION_SCIENCE_map_(ps):{};
  const hist=KOL_IDS_DECISION_SCIENCE_comparable_(ss,creatorId,goal,campaignId);
  const followers=KOL_IDS_DECISION_SCIENCE_num_(r[4]),er=KOL_IDS_DECISION_SCIENCE_num_(r[5]);
  const audienceFields=['Gender','Locations','Interests','Content Styles','Category','Age Min','Age Max'].filter(h=>r.length && KOL_IDS_DECISION_SCIENCE_map_(ss.getSheetByName('ENT_CREATORS'))[h]!=null && String(r[KOL_IDS_DECISION_SCIENCE_map_(ss.getSheetByName('ENT_CREATORS'))[h]]||'').trim()!=='').length;
  return {followers:followers,er:er,audienceCoverage:Math.round(audienceFields/7*100),historyCount:hist.length,platform:r[2]||'',category:r[12]||'',historyMean:KOL_IDS_DECISION_SCIENCE_mean_(hist.map(x=>x.score)),historyStd:KOL_IDS_DECISION_SCIENCE_std_(hist.map(x=>x.score)),goal:String(goal||'').toUpperCase()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_features_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_features_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_hierarchicalSignal_(ss,creatorId,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_hierarchicalSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const creator=KOL_IDS_DECISION_SCIENCE_comparable_(ss,creatorId,goal,excludeCampaignId);
  const ps=KOL_IDS_PA_legacyProjection_(ss); const all=[];
  if(ps){KOL_IDS_DECISION_SCIENCE_rows_(ps).forEach(r=>{if(String(r[1])===String(excludeCampaignId))return;if(String(r[12]||'').toUpperCase()!=='COMPLETED'||!KOL_IDS_DECISION_SCIENCE_perfValid_(r).valid)return;const g=KOL_IDS_DECISION_SCIENCE_goal_(ss,r[1],r[2]);if(String(g).toUpperCase()!==String(goal||'').toUpperCase())return;const sc=KOL_IDS_DECISION_SCIENCE_outcome_(r,g);if(sc===null)return;all.push({score:sc,date:r[14]||r[16],evidence:KOL_IDS_DECISION_SCIENCE_evidence_(r),creatorId:r[2]});});}
  const pool=creator.map(x=>Object.assign({},x,{sim:1}));
  const cr=KOL_IDS_DECISION_SCIENCE_creatorRow_(ss,creatorId)||[];
  const similar=[];
  all.filter(x=>String(x.creatorId)!==String(creatorId)).forEach(x=>{
    const xr=KOL_IDS_DECISION_SCIENCE_creatorRow_(ss,x.creatorId)||[];
    const sim=KOL_IDS_DECISION_SCIENCE_similarity_(ss,{goal:goal,platform:cr[2],category:cr[12],locations:cr[9],interests:cr[10]},{goal:goal,platform:xr[2],category:xr[12],locations:xr[9],interests:xr[10]},goal);
    if(sim>=.35)similar.push(Object.assign({},x,{sim:sim}));
  });
  const evidence=pool.concat(similar).sort((a,b)=>((b.sim||1)*(b.evidence||.1))-((a.sim||1)*(a.evidence||.1))).slice(0,KOL_IDS.MAX_COHORT);
  if(!evidence.length)return {score:50,lower:35,upper:65,confidence:10,effectiveN:0,creatorN:0,cohortN:0,status:'NO_EVIDENCE'};
  let tw=0,sum=0; evidence.forEach(x=>{const KOL_IDS_PLATFORM_w=(x.sim||1)*x.evidence*KOL_IDS_DECISION_SCIENCE_recency_(x.date);tw+=KOL_IDS_PLATFORM_w;sum+=x.score*KOL_IDS_PLATFORM_w;});
  const mean=sum/Math.max(KOL_IDS.EPS,tw), vals=evidence.map(x=>x.score),sd=KOL_IDS_DECISION_SCIENCE_std_(vals),eff=Math.min(20,tw);
  /* Hierarchical shrinkage: creator evidence gets more weight as it accumulates;
   * the broader matched cohort acts as a second-level prior. */
  const creatorN=creator.reduce((s,x)=>s+x.evidence*KOL_IDS_DECISION_SCIENCE_recency_(x.date),0),creatorMean=KOL_IDS_DECISION_SCIENCE_mean_(creator.map(x=>x.score));
  const creatorWeight=Math.min(0.80,creatorN/(creatorN+4));
  const pooled=creatorMean===null?mean:(creatorMean*creatorWeight+mean*(1-creatorWeight));
  const shrink=eff/(eff+KOL_IDS.PRIOR_STRENGTH); const score=50+(pooled-50)*shrink;
  const se=sd/Math.sqrt(Math.max(1,eff));
  const margin=KOL_IDS_DECISION_SCIENCE_clamp_(1.28*se+8/Math.sqrt(Math.max(1,eff)),4,20);
  const confidence=Math.round(KOL_IDS_DECISION_SCIENCE_clamp_(20+eff*4+Math.min(25,creatorN*4)+(100-Math.min(100,sd*2))*.25,10,92));
  return {score:Math.round(score*100)/100,lower:Math.round(KOL_IDS_DECISION_SCIENCE_clamp_(score-margin,0,100)*100)/100,upper:Math.round(KOL_IDS_DECISION_SCIENCE_clamp_(score+margin,0,100)*100)/100,confidence:confidence,effectiveN:Math.round(eff*100)/100,creatorN:Math.round(creatorN*100)/100,cohortN:evidence.length,dispersion:Math.round(sd*100)/100,status:evidence.length>=KOL_IDS.MIN_COHORT?'COHORT_ACTIVE':'EARLY_SIGNAL'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_hierarchicalSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_hierarchicalSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_calibration_(ss,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_calibration_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh=ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!sh)return {bias:0,mae:null,count:0,confidence:0};const m=KOL_IDS_DECISION_SCIENCE_map_(sh),arr=[];
  KOL_IDS_DECISION_SCIENCE_rows_(sh).forEach(r=>{if(String(r[m['Goal']]||'').toUpperCase()!==String(goal||'').toUpperCase())return;if(String(r[m['Campaign ID']])===String(excludeCampaignId))return;const err=KOL_IDS_DECISION_SCIENCE_num_(r[m['Error']]);if(err!==null)arr.push({err:err,abs:Math.abs(err),date:r[m['Actual At']]||r[m['Created At']]});});
  if(!arr.length)return {bias:0,mae:null,count:0,confidence:0};let tw=0,b=0,ae=0;arr.forEach(x=>{const KOL_IDS_PLATFORM_w=KOL_IDS_DECISION_SCIENCE_recency_(x.date);tw+=KOL_IDS_PLATFORM_w;b+=x.err*KOL_IDS_PLATFORM_w;ae+=x.abs*KOL_IDS_PLATFORM_w;});return {bias:b/tw,mae:ae/tw,count:arr.length,confidence:KOL_IDS_DECISION_SCIENCE_clamp_(20+arr.length*8,20,90)};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_calibration_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_calibration_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_drift_(ss,creatorId,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_drift_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const hist=KOL_IDS_DECISION_SCIENCE_comparable_(ss,creatorId,goal,'');if(hist.length<4)return {score:0,status:'INSUFFICIENT_DATA'};
  const sorted=hist.slice().sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));const n=sorted.length;const old=sorted.slice(0,Math.max(2,Math.floor(n/2))).map(x=>x.score),recent=sorted.slice(Math.floor(n/2)).map(x=>x.score);const delta=KOL_IDS_DECISION_SCIENCE_mean_(recent)-KOL_IDS_DECISION_SCIENCE_mean_(old);return {score:Math.round(KOL_IDS_DECISION_SCIENCE_clamp_(delta/2,-100,100)*100)/100,status:Math.abs(delta)>=12?'DRIFT_DETECTED':'STABLE'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_drift_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_drift_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_getDecisionSignal_(ss,creatorId,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_getDecisionSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const h=KOL_IDS_DECISION_SCIENCE_hierarchicalSignal_(ss,creatorId,goal,excludeCampaignId),c=KOL_IDS_DECISION_SCIENCE_calibration_(ss,goal,excludeCampaignId),d=KOL_IDS_DECISION_SCIENCE_drift_(ss,creatorId,goal);
  const cal=KOL_IDS_DECISION_SCIENCE_clamp_(c.bias*.20,-KOL_IDS.MAX_CALIBRATION,KOL_IDS.MAX_CALIBRATION);
  const drift=KOL_IDS_DECISION_SCIENCE_clamp_(d.score*.05,-KOL_IDS.MAX_DRIFT,KOL_IDS.MAX_DRIFT);
  const adj=KOL_IDS_DECISION_SCIENCE_clamp_((h.score-50)*.30+cal+drift,-KOL_IDS.MAX_TOTAL_ADJUSTMENT,KOL_IDS.MAX_TOTAL_ADJUSTMENT);
  return {score:h.score,lower:h.lower,upper:h.upper,adjustment:Math.round(adj*100)/100,totalAdjustment:Math.round(adj*100)/100,confidence:h.confidence,sampleSize:h.creatorN,effectiveSampleSize:h.effectiveN,cohortSize:h.cohortN,calibrationBias:Math.round(c.bias*100)/100,calibrationMAE:c.mae===null?null:Math.round(c.mae*100)/100,drift:drift,driftStatus:d.status,status:h.status,modelVersion:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_getDecisionSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_getDecisionSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Replace the old bridge semantically without changing the V5 UI contract. */
function KOL_IDS_DECISION_SCIENCE_learningBridgeLegacy_(ss,creatorId,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_learningBridgeLegacy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_DECISION_SCIENCE_getDecisionSignal_(ss,creatorId,goal,'');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_learningBridgeLegacy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_learningBridgeLegacy_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_syncActuals(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_syncActuals');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps||ps.getLastRow()<2)return {success:true,processed:0};
  const led=KOL_IDS_DECISION_SCIENCE_ensure_(ss,'ENT_PREDICTION_LEDGER',['Prediction ID','Campaign ID','Creator ID','Goal','Predicted Score','Lower Bound','Upper Bound','Actual Score','Error','Absolute Error','Coverage Hit','Data Quality','Evidence Weight','Effective Sample Size','Confidence At Prediction','Model Version','Actual At','Created At','Learning Status']);
  const m=KOL_IDS_DECISION_SCIENCE_map_(led),rows=KOL_IDS_DECISION_SCIENCE_rows_(ps),existing=KOL_IDS_DECISION_SCIENCE_rows_(led);let processed=0;
  rows.forEach(r=>{if(String(r[12]||'').toUpperCase()!=='COMPLETED'||!KOL_IDS_DECISION_SCIENCE_perfValid_(r).valid)return;const cid=r[1],crid=r[2],goal=KOL_IDS_DECISION_SCIENCE_goal_(ss,cid,crid);if(!goal)return;const actual=KOL_IDS_DECISION_SCIENCE_outcome_(r,goal);if(actual===null)return;const pred=KOL_IDS_DECISION_SCIENCE_getPointPrediction_(ss,cid,crid);const sig=KOL_IDS_DECISION_SCIENCE_getDecisionSignal_(ss,crid,goal,cid);const key=String(cid)+'|'+String(crid);const idx=existing.findIndex(x=>String(x[m['Campaign ID']])+'|'+String(x[m['Creator ID']])===key);const data={'Campaign ID':cid,'Creator ID':crid,'Goal':goal,'Predicted Score':pred===null?'':pred,'Lower Bound':pred===null?'':sig.lower,'Upper Bound':pred===null?'':sig.upper,'Actual Score':Math.round(actual*100)/100,'Error':pred===null?'':Math.round((actual-pred)*100)/100,'Absolute Error':pred===null?'':Math.round(Math.abs(actual-pred)*100)/100,'Coverage Hit':pred===null?'':(actual>=sig.lower&&actual<=sig.upper?'YES':'NO'),'Data Quality':KOL_IDS_DECISION_SCIENCE_perfValid_(r).valid?'VALID':'INVALID','Evidence Weight':KOL_IDS_DECISION_SCIENCE_evidence_(r),'Effective Sample Size':sig.effectiveSampleSize,'Confidence At Prediction':sig.confidence,'Model Version':KOL_IDS.VERSION,'Actual At':r[14]||r[16]||new Date(),'Created At':new Date(),'Learning Status':sig.status};
    const vals=KOL_IDS_DECISION_SCIENCE_set_(led,Object.assign({'Prediction ID':idx>=0?existing[idx][m['Prediction ID']]:'PRED-'+Utilities.getUuid().slice(0,8).toUpperCase()},data));if(idx>=0)led.getRange(idx+2,1,1,vals.length).setValues([vals]);else led.appendRow(vals);processed++;});
  KOL_IDS_DECISION_SCIENCE_rebuildFeatures();KOL_IDS_DECISION_SCIENCE_rebuildModelRegistry();return {success:true,processed:processed,version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_syncActuals', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_syncActuals', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_getPointPrediction_(ss,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_getPointPrediction_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const ds=ss.getSheetByName('ENT_DECISIONS');if(!ds)return null;const m=KOL_IDS_DECISION_SCIENCE_map_(ds),r=KOL_IDS_DECISION_SCIENCE_rows_(ds).filter(x=>String(x[1])===String(campaignId)&&String(x[2])===String(creatorId));if(!r.length)return null;for(const h of ['Decision Score','Score'])if(m[h]!=null){const n=KOL_IDS_DECISION_SCIENCE_num_(r[r.length-1][m[h]]);if(n!==null)return n;}return KOL_IDS_DECISION_SCIENCE_num_(r[r.length-1][5]);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_getPointPrediction_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_getPointPrediction_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_rebuildFeatures(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_rebuildFeatures');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),cs=ss.getSheetByName('ENT_CREATORS');if(!cs)return {success:true,rows:0};
  const sh=KOL_IDS_DECISION_SCIENCE_ensure_(ss,'ENT_FEATURE_STORE',['Snapshot ID','Creator ID','Goal','Followers','ER','Audience Coverage','History Count','History Mean','History Std','Platform','Category','Observed At','Model Version']);
  const goals=['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'];let count=0;
  KOL_IDS_DECISION_SCIENCE_rows_(cs).forEach(r=>{goals.forEach(g=>{const f=KOL_IDS_DECISION_SCIENCE_features_(ss,r[0],g,'');sh.appendRow(KOL_IDS_DECISION_SCIENCE_set_(sh,{'Snapshot ID':'FS-'+Utilities.getUuid().slice(0,8).toUpperCase(),'Creator ID':r[0],'Goal':g,'Followers':f.followers===null?'':f.followers,'ER':f.er===null?'':f.er,'Audience Coverage':f.audienceCoverage,'History Count':f.historyCount,'History Mean':f.historyMean===null?'':f.historyMean,'History Std':f.historyStd,'Platform':f.platform,'Category':f.category,'Observed At':new Date(),'Model Version':KOL_IDS.VERSION}));count++;});});
  return {success:true,rows:count};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_rebuildFeatures', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_rebuildFeatures', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_rebuildModelRegistry(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_rebuildModelRegistry');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),sh=KOL_IDS_DECISION_SCIENCE_ensure_(ss,'ENT_MODEL_REGISTRY',['Model Version','Model Name','Goal','Observations','MAE','Bias','Interval Coverage','Calibration Confidence','Drift Status','Updated At']);const led=ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!led)return {success:true};const m=KOL_IDS_DECISION_SCIENCE_map_(led),groups={};
  KOL_IDS_DECISION_SCIENCE_rows_(led).forEach(r=>{const g=String(r[m['Goal']]||'');if(!groups[g])groups[g]=[];if(KOL_IDS_DECISION_SCIENCE_num_(r[m['Absolute Error']])!==null)groups[g].push(r);});
  Object.keys(groups).forEach(g=>{const a=groups[g],mae=KOL_IDS_DECISION_SCIENCE_mean_(a.map(r=>KOL_IDS_DECISION_SCIENCE_num_(r[m['Absolute Error']]))),bias=KOL_IDS_DECISION_SCIENCE_mean_(a.map(r=>KOL_IDS_DECISION_SCIENCE_num_(r[m['Error']]))),cov=KOL_IDS_DECISION_SCIENCE_mean_(a.map(r=>String(r[m['Coverage Hit']])==='YES'?1:0));sh.appendRow(KOL_IDS_DECISION_SCIENCE_set_(sh,{'Model Version':KOL_IDS.VERSION,'Model Name':KOL_IDS.MODEL_NAME,'Goal':g,'Observations':a.length,'MAE':mae===null?'':Math.round(mae*100)/100,'Bias':bias===null?'':Math.round(bias*100)/100,'Interval Coverage':cov===null?'':Math.round(cov*1000)/10,'Calibration Confidence':KOL_IDS_DECISION_SCIENCE_clamp_(20+a.length*8,20,90),'Drift Status':Math.abs(bias||0)>10?'REVIEW':'STABLE','Updated At':new Date()}));});
  return {success:true,goals:Object.keys(groups).length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_rebuildModelRegistry', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_rebuildModelRegistry', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_backtest(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_backtest');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return {success:true,observations:0,message:'No performance sheet.'};const rows=KOL_IDS_DECISION_SCIENCE_rows_(ps),out=[];
  rows.forEach(r=>{if(String(r[12]||'').toUpperCase()!=='COMPLETED'||!KOL_IDS_DECISION_SCIENCE_perfValid_(r).valid)return;const goal=KOL_IDS_DECISION_SCIENCE_goal_(ss,r[1],r[2]),actual=KOL_IDS_DECISION_SCIENCE_outcome_(r,goal);if(!goal||actual===null)return;const sig=KOL_IDS_DECISION_SCIENCE_getDecisionSignal_(ss,r[2],goal,r[1]);const pred=KOL_IDS_DECISION_SCIENCE_getPointPrediction_(ss,r[1],r[2]);if(pred!==null)out.push({goal:goal,error:actual-pred,abs:Math.abs(actual-pred),covered:actual>=sig.lower&&actual<=sig.upper});});
  const mae=out.length?KOL_IDS_DECISION_SCIENCE_mean_(out.map(x=>x.abs)):null,bias=out.length?KOL_IDS_DECISION_SCIENCE_mean_(out.map(x=>x.error)):null,cov=out.length?KOL_IDS_DECISION_SCIENCE_mean_(out.map(x=>x.covered?1:0)):null;return {success:true,observations:out.length,mae:mae,bias:bias,intervalCoverage:cov,minimumForStrongModel:KOL_IDS.MIN_BACKTEST,status:out.length>=KOL_IDS.MIN_BACKTEST?'BACKTEST_READY':'INSUFFICIENT_HISTORY'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_backtest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_backtest', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DECISION_SCIENCE_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DECISION_SCIENCE_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const fail=[];function KOL_IDS_DECISION_SCIENCE_t(n,v){if(!v)fail.push(n);}const r=['','','C','N',100,1000,1200,800,80,40,4,500,'COMPLETED','VERIFIED',new Date()];const bad=['','','C','N',100,100,1200,800,80,40,4,500,'COMPLETED','VERIFIED',new Date()];
  KOL_IDS_DECISION_SCIENCE_t('valid metrics accepted',KOL_IDS_DECISION_SCIENCE_perfValid_(r).valid);KOL_IDS_DECISION_SCIENCE_t('impossible metrics rejected',!KOL_IDS_DECISION_SCIENCE_perfValid_(bad).valid);KOL_IDS_DECISION_SCIENCE_t('quantile',KOL_IDS_DECISION_SCIENCE_quantile_([0,50,100],.5)===50);KOL_IDS_DECISION_SCIENCE_t('recency now',Math.abs(KOL_IDS_DECISION_SCIENCE_recency_(new Date())-1)<.0001);KOL_IDS_DECISION_SCIENCE_t('outcome bounded',KOL_IDS_DECISION_SCIENCE_outcome_(r,'AWARENESS')<=100);return {success:!fail.length,tests:5,failures:fail,version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DECISION_SCIENCE_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DECISION_SCIENCE_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
