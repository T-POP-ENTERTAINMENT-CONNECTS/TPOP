/**
 * KOL IDS — DECISION OPTIMIZATION + CALIBRATED PREDICTION
 *
 * Design goal: improve long-run accuracy without pretending that sparse data is
 * more certain than it is. V9 adds leakage-safe chronological backtesting,
 * empirical residual intervals, hierarchical evidence, drift guards, and
 * budget/portfolio scenario simulation.
 *
 * Important statistical boundary:
 * - Observational campaign data does NOT prove causality.
 * - "Uplift" here is a scenario estimate unless the account has randomized /
 *   controlled experiments. The output is explicitly marked accordingly.
 */

KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  HALF_LIFE_DAYS:120,
  PRIOR_MEAN:50,
  PRIOR_STRENGTH:10,
  MIN_HISTORY:4,
  MIN_INTERVAL_RESIDUALS:8,
  MAX_ADJUSTMENT:12,
  MAX_CALIBRATION:5,
  MAX_DRIFT:4,
  MAX_COHORT:40,
  SIMILARITY_FLOOR:.35,
  EPS:1e-9
});

function KOL_IDS_OPTIMIZATION_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v===null||v===undefined)return null;const n=Number(v);return isFinite(n)?n:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const n=Number(v);return isFinite(n)?Math.max(a,Math.min(b,n)):a;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_days_(v,now){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_days_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!v)return 9999;const d=new Date(v);return isNaN(d.getTime())?9999:Math.max(0,((now||new Date()).getTime()-d.getTime())/86400000);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_days_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_days_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_recency_(v,now){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_recency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.pow(.5,KOL_IDS_OPTIMIZATION_days_(v,now)/KOL_IDS.HALF_LIFE_DAYS);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_recency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_recency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_mean_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=a.filter(v=>isFinite(Number(v))).map(Number);return x.length?x.reduce((s,v)=>s+v,0)/x.length:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_wmean_(items){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_wmean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
let sw=0,s=0;items.forEach(x=>{const KOL_IDS_PLATFORM_w=KOL_IDS_OPTIMIZATION_num_(x.KOL_IDS_PLATFORM_w);const v=KOL_IDS_OPTIMIZATION_num_(x.v);if(KOL_IDS_PLATFORM_w!==null&&v!==null&&KOL_IDS_PLATFORM_w>0){sw+=KOL_IDS_PLATFORM_w;s+=KOL_IDS_PLATFORM_w*v;}});return sw?{mean:s/sw,weight:sw}:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_wmean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_wmean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_quantile_(a,q){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_quantile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const x=a.filter(v=>isFinite(Number(v))).map(Number).sort((a,b)=>a-b);if(!x.length)return null;const p=(x.length-1)*q,i=Math.floor(p),f=p-i;return x[i]+(x[i+1]===undefined?0:(x[i+1]-x[i])*f);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_quantile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_quantile_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_header_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_header_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]:[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_header_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_header_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_map_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_map_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const m={};KOL_IDS_OPTIMIZATION_header_(sh).forEach((x,i)=>m[String(x).trim()]=i);return m;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_map_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_map_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_rows_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_rows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_rows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_rows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_perfValid_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_perfValid_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const e=[];for(const i of [4,5,6,7,8,9,10,11]){const n=KOL_IDS_OPTIMIZATION_num_(r[i]);if(n!==null&&n<0)e.push('negative_metric');}
  const reach=KOL_IDS_OPTIMIZATION_num_(r[5]),imp=KOL_IDS_OPTIMIZATION_num_(r[6]),views=KOL_IDS_OPTIMIZATION_num_(r[7]),eng=KOL_IDS_OPTIMIZATION_num_(r[8]),clicks=KOL_IDS_OPTIMIZATION_num_(r[9]),conv=KOL_IDS_OPTIMIZATION_num_(r[10]);
  if(reach!==null&&imp!==null&&reach>imp)e.push('reach_gt_impressions');
  if(views!==null&&imp!==null&&views>imp)e.push('views_gt_impressions');
  if(eng!==null&&imp!==null&&eng>imp)e.push('engagement_gt_impressions');
  if(clicks!==null&&imp!==null&&clicks>imp)e.push('clicks_gt_impressions');
  if(conv!==null&&clicks!==null&&conv>clicks)e.push('conversions_gt_clicks');
  return {valid:!e.length,errors:e};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_perfValid_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_perfValid_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_goal_(ss,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_goal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  for(const name of ['ENT_CAMPAIGNS','ENT_DECISIONS']){const sh=ss.getSheetByName(name);if(!sh)continue;const m=KOL_IDS_OPTIMIZATION_map_(sh);const rows=KOL_IDS_OPTIMIZATION_rows_(sh).filter(r=>String(r[m['Campaign ID']!=null?'Campaign ID':0])===String(campaignId));for(let i=rows.length-1;i>=0;i--){for(const h of ['Campaign Goal','Objective','Goal'])if(m[h]!=null&&rows[i][m[h]])return String(rows[i][m[h]]).trim().toUpperCase();}}
  return '';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_goal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_goal_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_outcome_(r,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_outcome_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const imp=KOL_IDS_OPTIMIZATION_num_(r[6]),views=KOL_IDS_OPTIMIZATION_num_(r[7]),eng=KOL_IDS_OPTIMIZATION_num_(r[8]),clicks=KOL_IDS_OPTIMIZATION_num_(r[9]),conv=KOL_IDS_OPTIMIZATION_num_(r[10]),rev=KOL_IDS_OPTIMIZATION_num_(r[11]),spend=KOL_IDS_OPTIMIZATION_num_(r[4]);
  const er=imp>0?eng/imp*100:null,ctr=imp>0?clicks/imp*100:null,cvr=clicks>0?conv/clicks*100:null,roas=spend>0&&rev!==null?rev/spend:null;
  const KOL_IDS_LEARNING_LEGACY_norm=(v,cap)=>v===null?null:KOL_IDS_OPTIMIZATION_clamp_(v/cap*100,0,100),g=String(goal||'AWARENESS').toUpperCase(),p=[];
  if(g.includes('CONVERSION'))p.push([KOL_IDS_LEARNING_LEGACY_norm(roas,6),.45],[KOL_IDS_LEARNING_LEGACY_norm(cvr,8),.25],[KOL_IDS_LEARNING_LEGACY_norm(ctr,5),.15],[KOL_IDS_LEARNING_LEGACY_norm(rev,500000),.15]);
  else if(g.includes('ENGAGEMENT'))p.push([KOL_IDS_LEARNING_LEGACY_norm(er,8),.65],[KOL_IDS_LEARNING_LEGACY_norm(views,2000000),.15],[KOL_IDS_LEARNING_LEGACY_norm(eng,100000),.20]);
  else if(g.includes('CONSIDERATION'))p.push([KOL_IDS_LEARNING_LEGACY_norm(ctr,5),.40],[KOL_IDS_LEARNING_LEGACY_norm(er,8),.35],[KOL_IDS_LEARNING_LEGACY_norm(cvr,8),.25]);
  else if(g.includes('LAUNCH'))p.push([KOL_IDS_LEARNING_LEGACY_norm(r[5],2000000),.45],[KOL_IDS_LEARNING_LEGACY_norm(views,2000000),.25],[KOL_IDS_LEARNING_LEGACY_norm(er,8),.20],[KOL_IDS_LEARNING_LEGACY_norm(ctr,5),.10]);
  else p.push([KOL_IDS_LEARNING_LEGACY_norm(r[5],2000000),.55],[KOL_IDS_LEARNING_LEGACY_norm(views,2000000),.20],[KOL_IDS_LEARNING_LEGACY_norm(er,8),.25]);
  const v=p.filter(x=>x[0]!==null),tw=v.reduce((s,x)=>s+x[1],0);return tw?v.reduce((s,x)=>s+x[0]*x[1],0)/tw:null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_outcome_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_outcome_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_creator_(ss,id){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_creator_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const sh=ss.getSheetByName('ENT_CREATORS');if(!sh)return null;const m=KOL_IDS_OPTIMIZATION_map_(sh),r=KOL_IDS_OPTIMIZATION_rows_(sh).find(x=>String(x[0])===String(id));if(!r)return null;const get=(names)=>{for(const h of names)if(m[h]!=null&&r[m[h]]!=='')return r[m[h]];return '';};return {id:id,platform:get(['Platform']),category:get(['Category','Niche']),followers:KOL_IDS_OPTIMIZATION_num_(get(['Followers','Follower Count'])),er:KOL_IDS_OPTIMIZATION_num_(get(['ER','Engagement Rate'])),locations:get(['Locations','Audience Locations']),interests:get(['Interests','Audience Interests']),styles:get(['Content Styles','Content Style']),ageMin:KOL_IDS_OPTIMIZATION_num_(get(['Age Min'])),ageMax:KOL_IDS_OPTIMIZATION_num_(get(['Age Max']))};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_creator_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_creator_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_tokens_(x){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_tokens_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(x||'').toLowerCase().split(/[,|;]+/).map(s=>s.trim()).filter(Boolean);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_tokens_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_tokens_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_jaccard_(a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_jaccard_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const A=KOL_IDS_OPTIMIZATION_tokens_(a),B=KOL_IDS_OPTIMIZATION_tokens_(b);if(!A.length||!B.length)return null;const sa={};A.forEach(x=>sa[x]=1);let inter=0;B.forEach(x=>{if(sa[x])inter++;});const uni=Object.keys(sa).length+B.filter(x=>!sa[x]).length;return uni?inter/uni:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_jaccard_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_jaccard_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_similarity_(a,b,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_similarity_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
let s=0,KOL_IDS_PLATFORM_w=0;if(String(goal).toUpperCase()){};if(a.platform&&b.platform){s+=(String(a.platform).toLowerCase()===String(b.platform).toLowerCase()?.15:0);KOL_IDS_PLATFORM_w+=.15;}if(a.category&&b.category){s+=(String(a.category).toLowerCase()===String(b.category).toLowerCase()?.15:0);KOL_IDS_PLATFORM_w+=.15;}for(const [k,wt] of [['locations',.12],['interests',.12],['styles',.08]]){const q=KOL_IDS_OPTIMIZATION_jaccard_(a[k],b[k]);if(q!==null){s+=q*wt;KOL_IDS_PLATFORM_w+=wt;}}if(a.followers&&b.followers){const d=Math.abs(Math.log10(a.followers)-Math.log10(b.followers));s+=Math.max(0,1-d/2)*.18;KOL_IDS_PLATFORM_w+=.18;}if(a.er!==null&&b.er!==null){s+=Math.max(0,1-Math.abs(a.er-b.er)/10)*.10;KOL_IDS_PLATFORM_w+=.10;}return KOL_IDS_PLATFORM_w?s/KOL_IDS_PLATFORM_w:0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_similarity_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_similarity_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_evidence_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_evidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
let KOL_IDS_PLATFORM_w=.35;const status=String(r[12]||'').toUpperCase(),ev=String(r[13]||'').toUpperCase();if(status==='COMPLETED')KOL_IDS_PLATFORM_w+=.15;if(ev==='VERIFIED')KOL_IDS_PLATFORM_w+=.40;else if(ev==='SELF-REPORTED')KOL_IDS_PLATFORM_w+=.20;else if(ev==='ESTIMATED')KOL_IDS_PLATFORM_w+=.05;const cov=[4,5,6,7,8,9,10,11].filter(i=>KOL_IDS_OPTIMIZATION_num_(r[i])!==null).length/8;return KOL_IDS_OPTIMIZATION_clamp_(KOL_IDS_PLATFORM_w*(.55+.45*cov),.05,1);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_evidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_evidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_date_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_date_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return r[14]||r[16]||new Date(0);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_date_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_date_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_history_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_history_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return[];const target=KOL_IDS_OPTIMIZATION_creator_(ss,creatorId)||{id:creatorId};const rows=KOL_IDS_OPTIMIZATION_rows_(ps),out=[];rows.forEach(r=>{if(String(r[2])===String(creatorId)&&String(r[1])!==String(excludeCampaignId)&&String(r[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_OPTIMIZATION_perfValid_(r).valid){const g=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],r[2]);if(String(g).toUpperCase()===String(goal).toUpperCase()){const d=new Date(KOL_IDS_OPTIMIZATION_date_(r));if(!asOf||d.getTime()<=new Date(asOf).getTime())out.push({score:KOL_IDS_OPTIMIZATION_outcome_(r,g),date:d,evidence:KOL_IDS_OPTIMIZATION_evidence_(r),creatorId:r[2],campaignId:r[1],similarity:1});}}
    if(String(r[2])!==String(creatorId)&&String(r[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_OPTIMIZATION_perfValid_(r).valid){const g=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],r[2]);if(String(g).toUpperCase()!==String(goal).toUpperCase())return;const other=KOL_IDS_OPTIMIZATION_creator_(ss,r[2]);if(!other)return;const sim=KOL_IDS_OPTIMIZATION_similarity_(target,other,goal);if(sim>=KOL_IDS.SIMILARITY_FLOOR){const d=new Date(KOL_IDS_OPTIMIZATION_date_(r));if(!asOf||d.getTime()<=new Date(asOf).getTime())out.push({score:KOL_IDS_OPTIMIZATION_outcome_(r,g),date:d,evidence:KOL_IDS_OPTIMIZATION_evidence_(r),creatorId:r[2],campaignId:r[1],similarity:sim});}}});return out.filter(x=>x.score!==null).sort((a,b)=>b.similarity-a.similarity).slice(0,KOL_IDS.MAX_COHORT);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_history_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_history_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_predict_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_predict_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Null spreadsheet means no evidence source; use the model prior safely.
  if(!ss)return {score:50,lower:30,upper:70,confidence:10,effectiveN:0,creatorN:0,cohortN:0,status:'PRIOR_ONLY'};

  const hist=KOL_IDS_OPTIMIZATION_history_(ss,creatorId,goal,excludeCampaignId,asOf),now=asOf?new Date(asOf):new Date();
  if(!hist.length)return {score:50,lower:30,upper:70,confidence:10,effectiveN:0,creatorN:0,cohortN:0,status:'PRIOR_ONLY'};
  const items=hist.map(x=>({v:x.score,KOL_IDS_PLATFORM_w:KOL_IDS_OPTIMIZATION_recency_(x.date,now)*x.evidence*(x.similarity||1)})),wm=KOL_IDS_OPTIMIZATION_wmean_(items),creator=hist.filter(x=>String(x.creatorId)===String(creatorId));
  const cw=Math.min(.82,creator.length/(creator.length+5)),cm=creator.length?KOL_IDS_OPTIMIZATION_wmean_(creator.map(x=>({v:x.score,KOL_IDS_PLATFORM_w:KOL_IDS_OPTIMIZATION_recency_(x.date,now)*x.evidence}))):null;
  const pooled=cm?cm.mean*cw+wm.mean*(1-cw):wm.mean,eff=items.reduce((s,x)=>s+x.KOL_IDS_PLATFORM_w,0),shrink=eff/(eff+KOL_IDS.PRIOR_STRENGTH),score=50+(pooled-50)*shrink;
  const residuals=hist.map(x=>x.score-score),q10=KOL_IDS_OPTIMIZATION_quantile_(residuals,.10),q90=KOL_IDS_OPTIMIZATION_quantile_(residuals,.90),sd=Math.sqrt(Math.max(0,KOL_IDS_OPTIMIZATION_wmean_(residuals.map((v,i)=>({v:v*v,KOL_IDS_PLATFORM_w:items[i].KOL_IDS_PLATFORM_w}))||[] )?.mean||0));
  const empiricalReady=residuals.length>=KOL_IDS.MIN_INTERVAL_RESIDUALS,lo=empiricalReady?score+q10:score-(8+1.8*sd),hi=empiricalReady?score+q90:score+(8+1.8*sd);
  const confidence=KOL_IDS_OPTIMIZATION_clamp_(Math.round(18+eff*5+creator.length*4-(sd>15?15:0)),8,93);
  return {score:Math.round(score*100)/100,lower:Math.round(KOL_IDS_OPTIMIZATION_clamp_(lo,0,100)*100)/100,upper:Math.round(KOL_IDS_OPTIMIZATION_clamp_(hi,0,100)*100)/100,confidence:confidence,effectiveN:Math.round(eff*100)/100,creatorN:creator.length,cohortN:hist.length,dispersion:Math.round(sd*100)/100,status:hist.length>=KOL_IDS.MIN_HISTORY?'EVIDENCE_ACTIVE':'EARLY_SIGNAL'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_predict_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_predict_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_calibration_(ss,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_calibration_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const sh=ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!sh)return{bias:0,mae:null,n:0};const m=KOL_IDS_OPTIMIZATION_map_(sh),a=[];KOL_IDS_OPTIMIZATION_rows_(sh).forEach(r=>{if(String(r[m['Goal']]||'').toUpperCase()!==String(goal||'').toUpperCase())return;if(String(r[m['Campaign ID']])===String(excludeCampaignId))return;const e=KOL_IDS_OPTIMIZATION_num_(r[m['Error']]);if(e!==null)a.push({e:e,d:r[m['Actual At']]||r[m['Created At']]});});if(!a.length)return{bias:0,mae:null,n:0};let sw=0,b=0,mae=0;a.forEach(x=>{const KOL_IDS_PLATFORM_w=KOL_IDS_OPTIMIZATION_recency_(x.d);sw+=KOL_IDS_PLATFORM_w;b+=KOL_IDS_PLATFORM_w*x.e;mae+=KOL_IDS_PLATFORM_w*Math.abs(x.e);});return{bias:b/sw,mae:mae/sw,n:a.length};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_calibration_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_calibration_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_drift_(ss,creatorId,goal,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_drift_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const h=KOL_IDS_OPTIMIZATION_history_(ss,creatorId,goal,'',asOf).sort((a,b)=>a.date-b.date);if(h.length<6)return{delta:0,status:'INSUFFICIENT_DATA'};const n=Math.floor(h.length/2),old=KOL_IDS_OPTIMIZATION_mean_(h.slice(0,n).map(x=>x.score)),recent=KOL_IDS_OPTIMIZATION_mean_(h.slice(n).map(x=>x.score)),d=recent-old;return{delta:d,status:Math.abs(d)>=12?'DRIFT_DETECTED':'STABLE'};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_drift_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_drift_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_OPTIMIZATION_getDecisionSignal_(ss,creatorId,goal,excludeCampaignId,asOf){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_getDecisionSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const p=KOL_IDS_OPTIMIZATION_predict_(ss,creatorId,goal,excludeCampaignId,asOf),c=KOL_IDS_OPTIMIZATION_calibration_(ss,goal,excludeCampaignId),d=KOL_IDS_OPTIMIZATION_drift_(ss,creatorId,goal,asOf);const cal=KOL_IDS_OPTIMIZATION_clamp_(c.bias*.25,-KOL_IDS.MAX_CALIBRATION,KOL_IDS.MAX_CALIBRATION),dr=KOL_IDS_OPTIMIZATION_clamp_(d.delta*.05,-KOL_IDS.MAX_DRIFT,KOL_IDS.MAX_DRIFT),raw=(p.score-50)*.30+cal+dr,adj=KOL_IDS_OPTIMIZATION_clamp_(raw,-KOL_IDS.MAX_ADJUSTMENT,KOL_IDS.MAX_ADJUSTMENT);return Object.assign({},p,{adjustment:Math.round(adj*100)/100,calibrationBias:Math.round(c.bias*100)/100,calibrationMAE:c.mae===null?null:Math.round(c.mae*100)/100,drift:Math.round(dr*100)/100,driftStatus:d.status,modelVersion:KOL_IDS.VERSION,accuracyGuard:'LEAKAGE_SAFE + CALIBRATED'});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_getDecisionSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_getDecisionSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Return a decision signal for existing V5 UI contracts. */
function KOL_IDS_OPTIMIZATION_getDecisionSignalLegacy_(ss,creatorId,goal,excludeCampaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_getDecisionSignalLegacy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_OPTIMIZATION_getDecisionSignal_(ss,creatorId,goal,excludeCampaignId);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_getDecisionSignalLegacy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_getDecisionSignalLegacy_', Date.now() - __kolIdsTraceStartedAt);
  }
}
// V10 override is defined in KOL_IDS_ACCURACYLAB_ACCURACY_LAB.gs and is the active bridge.


/**
 * Chronological backtest. Each test point is predicted using only records
 * strictly earlier than the target date and excluding the target campaign.
 */
function KOL_IDS_OPTIMIZATION_backtest(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_backtest');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return{success:true,observations:0,status:'NO_DATA'};const rows=KOL_IDS_OPTIMIZATION_rows_(ps).map((r,i)=>({r:r,i:i})).filter(x=>String(x.r[12]||'').toUpperCase()==='COMPLETED'&&KOL_IDS_OPTIMIZATION_perfValid_(x.r).valid).sort((a,b)=>new Date(KOL_IDS_OPTIMIZATION_date_(a.r))-new Date(KOL_IDS_OPTIMIZATION_date_(b.r)));const out=[];
  rows.forEach(x=>{const r=x.r,goal=KOL_IDS_OPTIMIZATION_goal_(ss,r[1],r[2]),actual=KOL_IDS_OPTIMIZATION_outcome_(r,goal);if(!goal||actual===null)return;const sig=KOL_IDS_ACCURACY_LAB_getDecisionSignal_(ss,r[2],goal,r[1],KOL_IDS_OPTIMIZATION_date_(r));if(sig.effectiveN<1)return;const err=actual-sig.score;out.push({goal:goal,error:err,abs:Math.abs(err),covered:actual>=sig.lower&&actual<=sig.upper});});
  const mae=KOL_IDS_OPTIMIZATION_mean_(out.map(x=>x.abs)),bias=KOL_IDS_OPTIMIZATION_mean_(out.map(x=>x.error)),coverage=KOL_IDS_OPTIMIZATION_mean_(out.map(x=>x.covered?1:0));return{success:true,observations:out.length,mae:mae===null?null:Math.round(mae*100)/100,bias:bias===null?null:Math.round(bias*100)/100,intervalCoverage:coverage===null?null:Math.round(coverage*1000)/10,status:out.length>=10?'BACKTEST_READY':'INSUFFICIENT_HISTORY',minimumRecommended:10,method:'CHRONOLOGICAL_OOS'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_backtest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_backtest', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Stores actuals without allowing the same campaign's actual to train its own
 * prediction. Idempotency key = campaign + creator.
 */
function KOL_IDS_OPTIMIZATION_syncActuals(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_syncActuals');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_SYSTEM_getSpreadsheet_(),ps=KOL_IDS_PA_legacyProjection_(ss);if(!ps)return{success:true,processed:0};let sh=ss.getSheetByName('ENT_PREDICTION_LEDGER');if(!sh)sh=ss.insertSheet('ENT_PREDICTION_LEDGER');const headers=['Prediction ID','Campaign ID','Creator ID','Goal','Predicted Score','Lower Bound','Upper Bound','Actual Score','Error','Absolute Error','Coverage Hit','Confidence','Effective Sample Size','Model Version','Actual At','Created At','Learning Status'];const h=KOL_IDS_OPTIMIZATION_header_(sh);if(!h.length||!h[0])sh.getRange(1,1,1,headers.length).setValues([headers]);const m=KOL_IDS_OPTIMIZATION_map_(sh),existing=KOL_IDS_OPTIMIZATION_rows_(sh),rows=KOL_IDS_OPTIMIZATION_rows_(ps);let processed=0;
  rows.forEach(r=>{if(String(r[12]||'').toUpperCase()!=='COMPLETED'||!KOL_IDS_OPTIMIZATION_perfValid_(r).valid)return;const cid=r[1],crid=r[2],goal=KOL_IDS_OPTIMIZATION_goal_(ss,cid,crid);if(!goal)return;const actual=KOL_IDS_OPTIMIZATION_outcome_(r,goal);if(actual===null)return;const sig=KOL_IDS_ACCURACY_LAB_getDecisionSignal_(ss,crid,goal,cid,KOL_IDS_OPTIMIZATION_date_(r));const key=String(cid)+'|'+String(crid),idx=existing.findIndex(x=>String(x[m['Campaign ID']])+'|'+String(x[m['Creator ID']])===key);const pred=sig.score+sig.adjustment;const obj={'Prediction ID':idx>=0?existing[idx][m['Prediction ID']]:'P9-'+Utilities.getUuid().slice(0,8).toUpperCase(),'Campaign ID':cid,'Creator ID':crid,'Goal':goal,'Predicted Score':Math.round(pred*100)/100,'Lower Bound':sig.lower,'Upper Bound':sig.upper,'Actual Score':Math.round(actual*100)/100,'Error':Math.round((actual-pred)*100)/100,'Absolute Error':Math.round(Math.abs(actual-pred)*100)/100,'Coverage Hit':actual>=sig.lower&&actual<=sig.upper?'YES':'NO','Confidence':sig.confidence,'Effective Sample Size':sig.effectiveN,'Model Version':KOL_IDS.VERSION,'Actual At':KOL_IDS_OPTIMIZATION_date_(r),'Created At':new Date(),'Learning Status':sig.status};const vals=KOL_IDS_OPTIMIZATION_header_(sh).map(k=>Object.prototype.hasOwnProperty.call(obj,k)?obj[k]:'');if(idx>=0)sh.getRange(idx+2,1,1,vals.length).setValues([vals]);else sh.appendRow(vals);processed++;});return{success:true,processed:processed,version:KOL_IDS.VERSION};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_syncActuals', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_syncActuals', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Budget/portfolio simulator. Not causal: scenario estimate from learned scores. */
function KOL_IDS_OPTIMIZATION_simulatePortfolio(ss,creatorIds,totalBudget,costs,objective){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_simulatePortfolio');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const ids=(creatorIds||[]).map(String),budget=KOL_IDS_OPTIMIZATION_num_(totalBudget)||0,costMap=costs||{},items=ids.map(id=>{const sig=KOL_IDS_ACCURACY_LAB_getDecisionSignal_(ss,id,objective||'AWARENESS','');const cost=KOL_IDS_OPTIMIZATION_num_(costMap[id])||0;return{id:id,cost:cost,score:sig.score+sig.adjustment,lower:sig.lower,upper:sig.upper,confidence:sig.confidence};}).filter(x=>x.cost>0);items.sort((a,b)=>(b.score/b.cost)-(a.score/a.cost));let spent=0,selected=[];items.forEach(x=>{if(spent+x.cost<=budget){const saturation=1-Math.min(.35,selected.length*.04);selected.push(Object.assign({},x,{marginalEfficiency:Math.round((x.score/x.cost*saturation)*100000)/100000}));spent+=x.cost;}});const expected=selected.reduce((s,x)=>s+x.score*(1-Math.min(.35,(selected.length-1)*.04)),0);return{status:'SCENARIO_ESTIMATE_NOT_CAUSAL',objective:objective||'AWARENESS',budget:budget,spent:spent,remaining:budget-spent,selected:selected,expectedIndex:Math.round(expected*100)/100};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_simulatePortfolio', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_simulatePortfolio', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_OPTIMIZATION_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_OPTIMIZATION_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const f=[];function KOL_IDS_OPTIMIZATION_t(n,v){if(!v)f.push(n);}const good=['','','C','N',100,1000,1200,800,80,40,4,500,'COMPLETED','VERIFIED',new Date()];const bad=['','','C','N',100,100,1200,800,80,40,4,500,'COMPLETED','VERIFIED',new Date()];KOL_IDS_OPTIMIZATION_t('metric validation',KOL_IDS_OPTIMIZATION_perfValid_(good).valid);KOL_IDS_OPTIMIZATION_t('impossible metric rejection',!KOL_IDS_OPTIMIZATION_perfValid_(bad).valid);KOL_IDS_OPTIMIZATION_t('quantile',KOL_IDS_OPTIMIZATION_quantile_([0,50,100],.5)===50);KOL_IDS_OPTIMIZATION_t('prior prediction bounded',KOL_IDS_OPTIMIZATION_predict_(null,'x','AWARENESS','').score===50);KOL_IDS_OPTIMIZATION_t('similarity bounded',KOL_IDS_OPTIMIZATION_similarity_({platform:'ig',category:'beauty'},{platform:'ig',category:'beauty'},'AWARENESS')<=1);return{success:!f.length,tests:5,failures:f,version:KOL_IDS.VERSION};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_OPTIMIZATION_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_OPTIMIZATION_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
