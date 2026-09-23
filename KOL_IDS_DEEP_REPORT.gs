/* KOL IDS 1.1.0 — HARDENED 4X DECISION INTELLIGENCE
 * Deterministic, evidence-aware, non-causal by default.
 * Adds: robust numeric parsing, behavioral signals, uncertainty, scenario modeling,
 * structured recommendations and aggregate prediction calibration.
 */
function KOL_IDS_DEEP_REPORT_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(v===null||v===undefined||v==='')return null;
  if(typeof v==='string'){
    var t=v.trim().replace(/,/g,'').replace(/%$/,'');
    if(t==='')return null;
    if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(t))return null;
    v=t;
  }
  var n=Number(v);return isFinite(n)?n:null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_clamp_(v,a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=KOL_IDS_DEEP_REPORT_num_(v);if(n===null)return null;return Math.max(a,Math.min(b,n));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_avg_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_avg_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).map(KOL_IDS_DEEP_REPORT_num_).filter(function(v){return v!==null;});return x.length?x.reduce(function(s,v){return s+v;},0)/x.length:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_avg_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_avg_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_median_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).map(KOL_IDS_DEEP_REPORT_num_).filter(function(v){return v!==null;}).sort(function(a,b){return a-b;});if(!x.length)return null;var m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_std_(a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_std_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var x=(a||[]).map(KOL_IDS_DEEP_REPORT_num_).filter(function(v){return v!==null;});if(x.length<2)return null;var m=KOL_IDS_DEEP_REPORT_avg_(x);return Math.sqrt(x.reduce(function(s,v){return s+Math.pow(v-m,2);},0)/(x.length-1));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_std_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_std_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_pct_(v,a){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_pct_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=KOL_IDS_DEEP_REPORT_num_(v),x=(a||[]).map(KOL_IDS_DEEP_REPORT_num_).filter(function(v){return v!==null;});if(n===null||!x.length)return null;return Math.round(x.filter(function(z){return z<=n;}).length/x.length*100);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_pct_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_pct_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_band_(score){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_band_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=KOL_IDS_DEEP_REPORT_num_(score);if(n===null)return 'UNKNOWN';var s=KOL_IDS_DEEP_REPORT_clamp_(n,0,100);return s>=85?'EXCEPTIONAL':s>=75?'STRONG':s>=65?'PROMISING':s>=50?'CONDITIONAL':'WEAK';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_band_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_band_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_evidence_(decision){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_evidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var d=decision||{},parts=[];
  if(KOL_IDS_DEEP_REPORT_num_(d.dataQualityScore)!==null)parts.push('DATA_QUALITY='+Math.round(d.dataQualityScore));
  if(KOL_IDS_DEEP_REPORT_num_(d.evidenceScore)!==null)parts.push('EVIDENCE='+Math.round(d.evidenceScore));
  if(d.erSource)parts.push('ER_SOURCE='+String(d.erSource));
  if(d.rateSource)parts.push('RATE_SOURCE='+String(d.rateSource));
  if(d.dataState)parts.push('STATE='+String(d.dataState));
  return parts.join(' | ');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_evidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_evidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_isActual_(p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_isActual_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var e=String((p||{}).evidence||'').toUpperCase(),s=String((p||{}).status||'').toUpperCase();
  return !!(e&&e.indexOf('ESTIMATED')<0&&e.indexOf('MODEL')<0&&e.indexOf('BENCHMARK')<0)||s==='ACTUAL'||s==='VERIFIED';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_isActual_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_isActual_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_behavior_(decision,rows,learning){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_behavior_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var d=decision||{},ps=rows||[],ls=learning||[];
  var eff=ps.map(function(x){return KOL_IDS_DEEP_REPORT_num_(x.efficiencyScore);}).filter(function(x){return x!==null;});
  var actual=ps.map(function(x){return KOL_IDS_DEEP_REPORT_num_(x.actualGoalScore);}).filter(function(x){return x!==null;});
  var views=ps.map(function(x){return KOL_IDS_DEEP_REPORT_num_(x.views);}).filter(function(x){return x!==null&&x>=0;});
  var eng=ps.map(function(x){return KOL_IDS_DEEP_REPORT_num_(x.engagements);}).filter(function(x){return x!==null&&x>=0;});
  var spend=ps.map(function(x){return KOL_IDS_DEEP_REPORT_num_(x.spend);}).filter(function(x){return x!==null&&x>0;});
  var consistency=eff.length<2?null:KOL_IDS_DEEP_REPORT_clamp_(100-(KOL_IDS_DEEP_REPORT_std_(eff)||0)*2,0,100);
  var outcomeStability=actual.length<2?null:KOL_IDS_DEEP_REPORT_clamp_(100-(KOL_IDS_DEEP_REPORT_std_(actual)||0)*2,0,100);
  var volumeSignal=views.length?KOL_IDS_DEEP_REPORT_clamp_(Math.log(1+KOL_IDS_DEEP_REPORT_avg_(views))/Math.log(10000001)*100,0,100):null;
  var engagementSignal=eng.length&&views.length&&KOL_IDS_DEEP_REPORT_avg_(views)>0?KOL_IDS_DEEP_REPORT_clamp_((KOL_IDS_DEEP_REPORT_avg_(eng)/KOL_IDS_DEEP_REPORT_avg_(views))*1000,0,100):null;
  var actualRate=ps.length?ps.filter(KOL_IDS_DEEP_REPORT_isActual_).length/ps.length*100:null;
  var learningCount=ls.length;
  var behaviorScore=KOL_IDS_DEEP_REPORT_avg_([consistency,outcomeStability,volumeSignal,engagementSignal,actualRate,learningCount?KOL_IDS_DEEP_REPORT_clamp_(learningCount*25,0,100):null]);
  var flags=[];
  if(consistency!==null&&consistency<60)flags.push('HIGH_EFFICIENCY_VOLATILITY');
  if(outcomeStability!==null&&outcomeStability<60)flags.push('HIGH_OUTCOME_VOLATILITY');
  if(actualRate!==null&&actualRate<50)flags.push('LOW_ACTUAL_EVIDENCE_RATIO');
  if(!ps.length)flags.push('NO_PERFORMANCE_HISTORY');
  return {score:behaviorScore===null?null:Math.round(behaviorScore),signals:{efficiencyConsistency:consistency===null?null:Math.round(consistency),outcomeStability:outcomeStability===null?null:Math.round(outcomeStability),volumeSignal:volumeSignal===null?null:Math.round(volumeSignal),engagementQualitySignal:engagementSignal===null?null:Math.round(engagementSignal),actualEvidenceRatio:actualRate===null?null:Math.round(actualRate),learningDepth:learningCount},flags:flags,interpretation:flags.length?'Behavior evidence is incomplete or volatile; use controlled allocation and monitor actual KPI.':'Behavior appears sufficiently stable for evidence-backed testing, subject to sample size.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_behavior_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_behavior_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_uncertainty_(d,behavior,sampleCount){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_uncertainty_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var dims=['personaFit','audienceFit','behaviorFit','contentFit','objectiveFit','brandFit','efficiencyScore'].map(function(k){return KOL_IDS_DEEP_REPORT_num_(d&&d[k]);}).filter(function(x){return x!==null;});
  var dispersion=KOL_IDS_DEEP_REPORT_std_(dims);
  var evidence=KOL_IDS_DEEP_REPORT_avg_([d&&d.dataQualityScore,d&&d.evidenceScore,d&&d.confidenceScore]);
  var n=Math.max(0,Number(sampleCount)||0);
  var width=12+(dispersion||0)*0.55+(evidence===null?18:(100-evidence)*0.12);
  if(n>=10)width*=0.75;else if(n>=5)width*=0.85;else if(n===0)width*=1.25;
  width=KOL_IDS_DEEP_REPORT_clamp_(width,5,35);
  var score=KOL_IDS_DEEP_REPORT_num_(d&&d.score);
  return {sampleSize:n,method:'HEURISTIC_UNCERTAINTY_BAND',lower:score===null?null:Math.round(KOL_IDS_DEEP_REPORT_clamp_(score-width,0,100)),upper:score===null?null:Math.round(KOL_IDS_DEEP_REPORT_clamp_(score+width,0,100)),width:Math.round(width),reliability:width<=10?'HIGH':width<=18?'MEDIUM':'LOW',note:'Directional uncertainty range; not a statistical confidence interval.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_uncertainty_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_uncertainty_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_scenarios_(d,behavior){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_scenarios_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var score=KOL_IDS_DEEP_REPORT_num_(d&&d.score),eff=KOL_IDS_DEEP_REPORT_num_(d&&d.efficiencyScore),price=KOL_IDS_DEEP_REPORT_num_(d&&d.priceValue);
  if(score===null)return {status:'INSUFFICIENT_EVIDENCE',scenarios:[]};
  var base=score,behaviorAdj=behavior&&behavior.score!==null?(behavior.score-50)*0.12:0;
  var quality=KOL_IDS_DEEP_REPORT_clamp_(base+behaviorAdj,0,100);
  return {status:'MODELED',nonCausal:true,scenarios:[
    {name:'BASE',score:Math.round(base),allocation:'NORMAL',assumption:'Current decision inputs remain similar.'},
    {name:'UPSIDE',score:Math.round(KOL_IDS_DEEP_REPORT_clamp_(quality+8,0,100)),allocation:'SCALE_IF_KPI_HOLDS',assumption:'Behavior stability and actual KPI improve.'},
    {name:'DOWNSIDE',score:Math.round(KOL_IDS_DEEP_REPORT_clamp_(quality-10,0,100)),allocation:'TEST_ONLY',assumption:'Efficiency volatility or weak KPI appears.'}
  ],drivers:{behavior:behavior&&behavior.score!==null?Math.round(behavior.score):null,efficiency:eff===null?null:Math.round(eff),priceValue:price===null?null:Math.round(price)},note:'Scenario scores are decision simulations, not causal or guaranteed outcomes.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_scenarios_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_scenarios_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_recommendation_(d,behavior,uncertainty){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_recommendation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var score=KOL_IDS_DEEP_REPORT_num_(d&&d.score),conf=KOL_IDS_DEEP_REPORT_num_(d&&d.confidenceScore),risk=String((d&&d.risk)||'').toUpperCase(),decision=String((d&&d.decision)||'').toUpperCase();
  var gate='TEST';
  if(score!==null&&score>=85&&conf!==null&&conf>=75&&risk!=='HIGH'&&uncertainty.reliability!=='LOW')gate='SCALE';
  else if(score!==null&&score>=75&&conf!==null&&conf>=60&&risk!=='HIGH')gate='PILOT';
  var actions=[];
  if(gate==='SCALE')actions.push('Scale within the creator role while monitoring the primary campaign KPI.');
  else if(gate==='PILOT')actions.push('Run a controlled pilot before committing a large allocation.');
  else actions.push('Keep allocation test-sized until evidence or fit improves.');
  if(behavior&&behavior.flags.length)actions.push('Resolve behavior flags: '+behavior.flags.join(', ')+'.');
  if(uncertainty.reliability==='LOW')actions.push('Collect more actual observations before treating the score as stable.');
  if(decision.indexOf('SELECT')<0&&gate==='SCALE')actions.push('Respect the core decision state; scenario output must not override governance.');
  return {gate:gate,priority:gate==='SCALE'?'HIGH':gate==='PILOT'?'MEDIUM':'CONTROLLED',actions:actions,monitoring:['Primary goal KPI','Spend efficiency','Actual vs predicted score','Evidence state'],rationale:'Gate combines core score/confidence, risk, behavior signals and uncertainty; it does not override the canonical decision engine.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_recommendation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_recommendation_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_buildCreatorAnalysis_(decision,performance,learning,context){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_buildCreatorAnalysis_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var d=decision||{},pp=performance||{},ll=learning||[],goal=String(context&&context.goal||d.campaignGoal||'AWARENESS').toUpperCase();
  var rows=Array.isArray(pp)?pp:(pp&&Object.keys(pp).length?[pp]:[]);
  var dims={persona:KOL_IDS_DEEP_REPORT_num_(d.personaFit),audience:KOL_IDS_DEEP_REPORT_num_(d.audienceFit),behavior:KOL_IDS_DEEP_REPORT_num_(d.behaviorFit),content:KOL_IDS_DEEP_REPORT_num_(d.contentFit),objective:KOL_IDS_DEEP_REPORT_num_(d.objectiveFit),brand:KOL_IDS_DEEP_REPORT_num_(d.brandFit),efficiency:KOL_IDS_DEEP_REPORT_num_(d.efficiencyScore),confidence:KOL_IDS_DEEP_REPORT_num_(d.confidenceScore)};
  var vals=Object.keys(dims).filter(function(k){return dims[k]!==null&&k!=='confidence';}).map(function(k){return dims[k];});
  var minKey=null,maxKey=null;Object.keys(dims).forEach(function(k){if(k==='confidence'||dims[k]===null)return;if(minKey===null||dims[k]<dims[minKey])minKey=k;if(maxKey===null||dims[k]>dims[maxKey])maxKey=k;});
  var gaps=[];Object.keys(dims).forEach(function(k){if(k!=='confidence'&&dims[k]!==null&&dims[k]<65)gaps.push({dimension:k,score:Math.round(dims[k]),gap:Math.round(65-dims[k])});});gaps.sort(function(a,b){return b.gap-a.gap;});
  var risk=[];if(dims.confidence!==null&&dims.confidence<60)risk.push('LOW_DECISION_CONFIDENCE');if(d.dataState&&String(d.dataState).toUpperCase().indexOf('ESTIMATED')>=0)risk.push('ESTIMATED_INPUTS');if(String(d.priceRisk||'').toUpperCase()==='HIGH')risk.push('HIGH_PRICE_RISK');if(String(d.risk||'').toUpperCase()==='HIGH')risk.push('HIGH_DECISION_RISK');
  var actual=rows.length?KOL_IDS_DEEP_REPORT_num_(rows[rows.length-1].actualGoalScore):null,pred=KOL_IDS_DEEP_REPORT_num_(d.score),error=actual!==null&&pred!==null?actual-pred:null;
  var behavior=KOL_IDS_DEEP_REPORT_behavior_(d,rows,ll);if(behavior.flags.indexOf('NO_PERFORMANCE_HISTORY')>=0)risk.push('NO_BEHAVIOR_HISTORY');
  var uncertainty=KOL_IDS_DEEP_REPORT_uncertainty_(d,behavior,rows.length),scenarios=KOL_IDS_DEEP_REPORT_scenarios_(d,behavior),recommendation=KOL_IDS_DEEP_REPORT_recommendation_(d,behavior,uncertainty);
  return {analysisVersion:'4X-INTELLIGENCE-2.0',creatorId:String(d.creatorId||''),creatorName:String(d.name||''),goal:goal,score:{decision:pred,band:KOL_IDS_DEEP_REPORT_band_(pred),confidence:dims.confidence,confidenceBand:KOL_IDS_DEEP_REPORT_band_(dims.confidence)},dimensionScores:dims,strongestDimension:maxKey,weakestDimension:minKey,gaps:gaps.slice(0,5),behaviorIntelligence:behavior,uncertainty:uncertainty,scenarioAnalysis:scenarios,decisionExplanation:{decision:d.decision||'',why:d.why||d.decisionRationale||'',evidence:KOL_IDS_DEEP_REPORT_evidence_(d),calibrationBasis:d.calibrationBasis||'CORE_ONLY'},commercial:{opportunityScore:KOL_IDS_DEEP_REPORT_num_(d.opportunityScore),investmentStrength:KOL_IDS_DEEP_REPORT_num_(d.investmentStrength),fairRate:KOL_IDS_DEEP_REPORT_num_(d.fairRate),priceValue:KOL_IDS_DEEP_REPORT_num_(d.priceValue),priceRisk:d.priceRisk||'UNKNOWN',commercialEfficiency:KOL_IDS_DEEP_REPORT_num_(d.commercialEfficiency)},outcomeComparison:{predictedScore:pred,actualGoalScore:actual,error:error,absoluteError:error===null?null:Math.abs(error),status:error===null?'NO_ACTUAL_OUTCOME':Math.abs(error)<=10?'CALIBRATED':Math.abs(error)<=20?'WATCH':'MIS-CALIBRATED'},risk:{level:d.risk||'UNKNOWN',flags:risk},recommendation:recommendation,evidenceState:d.dataState||'UNKNOWN'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_buildCreatorAnalysis_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_buildCreatorAnalysis_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_calibration_(decisions,performance,learning){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_calibration_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var map={};(decisions||[]).forEach(function(d){map[String(d.creatorId)]=KOL_IDS_DEEP_REPORT_num_(d.score);});
  var pairs=[];(performance||[]).forEach(function(p){var pred=map[String(p.creatorId)],actual=KOL_IDS_DEEP_REPORT_num_(p.actualGoalScore);if(pred!==null&&pred!==undefined&&actual!==null&&KOL_IDS_DEEP_REPORT_isActual_(p))pairs.push({pred:pred,actual:actual,error:actual-pred,abs:Math.abs(actual-pred)});});
  var errors=pairs.map(function(x){return x.error;}),abs=pairs.map(function(x){return x.abs;});
  return {sampleSize:pairs.length,mae:KOL_IDS_DEEP_REPORT_avg_(abs),medianAbsoluteError:KOL_IDS_DEEP_REPORT_median_(abs),bias:KOL_IDS_DEEP_REPORT_avg_(errors),calibrationRate:pairs.length?pairs.filter(function(x){return x.abs<=10;}).length/pairs.length*100:null,biasDirection:errors.length?(KOL_IDS_DEEP_REPORT_avg_(errors)>2?'UNDERPREDICTED':KOL_IDS_DEEP_REPORT_avg_(errors)<-2?'OVERPREDICTED':'BALANCED'):'UNKNOWN',status:pairs.length>=5?'USABLE_DIRECTIONAL':pairs.length?'EARLY_SIGNAL':'INSUFFICIENT_EVIDENCE',note:'Calibration is measured against recorded actual observations only.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_calibration_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_calibration_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_buildCampaignIntelligence_(decisions,performance,learning,benchmark,context){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_buildCampaignIntelligence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ds=decisions||[],ps=performance||[],ls=learning||[],goal=String(context&&context.goal||'AWARENESS').toUpperCase();
  var scores=ds.map(function(d){return KOL_IDS_DEEP_REPORT_num_(d.score);}).filter(function(v){return v!==null;}),confs=ds.map(function(d){return KOL_IDS_DEEP_REPORT_num_(d.confidenceScore);}).filter(function(v){return v!==null;});
  var actual=ps.map(function(p){return KOL_IDS_DEEP_REPORT_num_(p.actualGoalScore);}).filter(function(v){return v!==null;}),spend=ps.map(function(p){return KOL_IDS_DEEP_REPORT_num_(p.spend);}).filter(function(v){return v!==null&&v>=0;}),revenue=ps.map(function(p){return KOL_IDS_DEEP_REPORT_num_(p.revenue);}).filter(function(v){return v!==null&&v>=0;});
  var selected=ds.filter(function(d){return /SELECT|YES|RECOMMEND/i.test(String(d.decision||''));}).length,highRisk=ds.filter(function(d){return /HIGH/i.test(String(d.risk||d.priceRisk||''));}).length;
  var dataFlags=ds.filter(function(d){var c=KOL_IDS_DEEP_REPORT_num_(d.confidenceScore);return String(d.dataState||'').toUpperCase().indexOf('ESTIMATED')>=0||(c!==null&&c<60);}).length;
  var analyses=ds.map(function(d){var rows=ps.filter(function(p){return String(p.creatorId)===String(d.creatorId);}),ll=ls.filter(function(l){return String(l.creatorId)===String(d.creatorId);});return KOL_IDS_DEEP_REPORT_buildCreatorAnalysis_(d,rows,ll,context);});
  var behaviorScores=analyses.map(function(a){return a.behaviorIntelligence.score;}).filter(function(v){return v!==null;}),uncertain=analyses.filter(function(a){return a.uncertainty.reliability==='LOW';}).length;
  var totalSpend=spend.length?spend.reduce(function(a,b){return a+b;},0):null,totalRevenue=revenue.length?revenue.reduce(function(a,b){return a+b;},0):null,observedRoas=totalSpend!==null&&totalSpend>0&&totalRevenue!==null?totalRevenue/totalSpend:null;
  var calibration=KOL_IDS_DEEP_REPORT_calibration_(ds,ps,ls),insights=[],actions=[];
  if(ds.length){insights.push('Decision spread: '+Math.round(Math.min.apply(null,scores||[0]))+'–'+Math.round(Math.max.apply(null,scores||[0]))+' / 100.');insights.push('Average decision confidence: '+Math.round(KOL_IDS_DEEP_REPORT_avg_(confs)||0)+' / 100.');}
  if(behaviorScores.length)insights.push('Average observed behavior intelligence: '+Math.round(KOL_IDS_DEEP_REPORT_avg_(behaviorScores))+' / 100.');
  if(actual.length)insights.push('Observed outcome data exists for '+actual.length+' performance row(s).');
  if(dataFlags)insights.push(dataFlags+' creator decision(s) require stronger evidence or contain estimated inputs.');
  if(highRisk)insights.push(highRisk+' creator decision(s) carry high-risk signals.');
  if(uncertain)insights.push(uncertain+' creator(s) have wide directional uncertainty and should not be scaled on score alone.');
  if(calibration.sampleSize)insights.push('Prediction calibration: MAE '+Math.round(calibration.mae||0)+' points; calibration rate '+Math.round(calibration.calibrationRate||0)+'%.');
  if(selected===0&&ds.length)actions.push('No clear positive selection state; review objective fit and evidence gaps.');
  if(selected>0)actions.push('Prioritize the strongest evidence-backed role, then validate actual KPI before scaling.');
  if(benchmark&&benchmark.metrics)actions.push('Use benchmark deltas as directional context; small peer samples are not market truth.');
  if(calibration.sampleSize<5)actions.push('Accumulate at least 5 verified outcome observations before relying on campaign-level calibration trends.');
  actions.push('Keep Actual, Estimated, Learned and Insufficient Evidence states separate in client-facing interpretation.');
  var coverage=(Math.min(1,ds.length/5)*25)+(Math.min(1,ps.length/5)*25)+(Math.min(1,ls.length/5)*15)+(benchmark&&benchmark.peerCount>=3?15:0)+(calibration.sampleSize>=5?20:0);
  return {analysisVersion:'4X-INTELLIGENCE-2.0',goal:goal,coverage:{decisions:ds.length,performanceRows:ps.length,learningRows:ls.length,selected:selected,highRisk:highRisk,evidenceFlags:dataFlags,behaviorRows:behaviorScores.length,uncertainCreators:uncertain},decisionSummary:{averageScore:KOL_IDS_DEEP_REPORT_avg_(scores),medianScore:KOL_IDS_DEEP_REPORT_median_(scores),averageConfidence:KOL_IDS_DEEP_REPORT_avg_(confs),selectionRate:ds.length?selected/ds.length*100:0},behaviorSummary:{averageBehaviorScore:KOL_IDS_DEEP_REPORT_avg_(behaviorScores),medianBehaviorScore:KOL_IDS_DEEP_REPORT_median_(behaviorScores)},outcomeSummary:{actualGoalScoreAverage:KOL_IDS_DEEP_REPORT_avg_(actual),observedRoas:observedRoas,totalSpend:totalSpend,totalRevenue:totalRevenue},predictionCalibration:calibration,benchmarkSummary:benchmark||null,confidence:{score:Math.round(KOL_IDS_DEEP_REPORT_clamp_(coverage,0,100)),basis:'Evidence coverage + behavior depth + verified outcome calibration + benchmark depth'},insights:insights,actions:actions,limitations:['Behavior signals require enough longitudinal observations; otherwise they remain directional.','Uncertainty ranges are heuristic and are not statistical confidence intervals.','Scenario analysis is non-causal simulation and must not be presented as guaranteed lift.','Small samples increase uncertainty; benchmark and percentile outputs remain directional.','Missing or estimated inputs are never silently converted into facts.']};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_buildCampaignIntelligence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_buildCampaignIntelligence_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_build_(report){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_build_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  report=report||{};var decisions=report.decisions||[],performance=report.performance||[],learning=report.learning||[],context={goal:report.goal||((decisions[0]||{}).campaignGoal)||'AWARENESS'};
  var perfBy={},learnBy={};performance.forEach(function(p){var k=String(p.creatorId);(perfBy[k]||(perfBy[k]=[])).push(p);});learning.forEach(function(l){var k=String(l.creatorId);(learnBy[k]||(learnBy[k]=[])).push(l);});
  var creatorAnalyses=decisions.map(function(d){return KOL_IDS_DEEP_REPORT_buildCreatorAnalysis_(d,perfBy[String(d.creatorId)]||[],learnBy[String(d.creatorId)]||[],context);});
  creatorAnalyses.sort(function(a,b){return Number(b.score.decision||0)-Number(a.score.decision||0);});
  var priority=creatorAnalyses.slice().sort(function(a,b){return Number((b.gaps[0]||{}).gap||0)-Number((a.gaps[0]||{}).gap||0);}).slice(0,5).map(function(x){return {creatorId:x.creatorId,creatorName:x.creatorName,weakestDimension:x.weakestDimension,gap:x.gaps.length?x.gaps[0].gap:0,gate:x.recommendation.gate,action:x.recommendation.actions[0]};});
  var campaign=KOL_IDS_DEEP_REPORT_buildCampaignIntelligence_(decisions,performance,learning,report.benchmark,context);
  return {version:'4X-INTELLIGENCE-2.0',executive:{headline:creatorAnalyses.length?'Hardened decision intelligence completed for '+creatorAnalyses.length+' creator(s).':'No creator decisions available.',confidence:campaign.confidence,topCreator:creatorAnalyses.length?creatorAnalyses[0]:null,priorityActions:priority,calibration:campaign.predictionCalibration},creatorAnalysis:creatorAnalyses,campaignIntelligence:campaign};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_build_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_build_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_DEEP_REPORT_runTests(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DEEP_REPORT_runTests');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var t=[],ok=function(n,v){t.push({name:n,pass:!!v,message:v?'PASS':'FAIL'});};
  ok('clamp',KOL_IDS_DEEP_REPORT_clamp_(120,0,100)===100);
  ok('strict numeric rejects junk',KOL_IDS_DEEP_REPORT_num_('abc')===null);
  ok('median',KOL_IDS_DEEP_REPORT_median_([1,4,2,3])===2.5);
  ok('percentile',KOL_IDS_DEEP_REPORT_pct_(8,[1,2,4,8,10])===80);
  var x=KOL_IDS_DEEP_REPORT_buildCreatorAnalysis_({creatorId:'C1',name:'Test',score:80,personaFit:90,audienceFit:80,behaviorFit:70,contentFit:75,objectiveFit:85,brandFit:88,efficiencyScore:70,confidenceScore:82,decision:'SELECT',dataQualityScore:90,evidenceScore:85,dataState:'HIGH EVIDENCE'},{actualGoalScore:78,performanceConfidence:80,status:'ACTUAL',evidence:'ACTUAL'},{},{goal:'AWARENESS'});
  ok('creator analysis',x&&x.gaps&&x.outcomeComparison.status==='CALIBRATED'&&x.behaviorIntelligence&&x.uncertainty&&x.scenarioAnalysis&&x.recommendation);
  var c=KOL_IDS_DEEP_REPORT_buildCampaignIntelligence_([x&&{creatorId:'C1',score:x.score.decision,confidenceScore:x.score.confidence,decision:'SELECT'}],[{creatorId:'C1',actualGoalScore:78,spend:1000,revenue:2000,status:'ACTUAL',evidence:'ACTUAL'}],[],null,{goal:'AWARENESS'});
  ok('campaign intelligence',c&&c.coverage.decisions===1&&c.outcomeSummary.observedRoas===2&&c.predictionCalibration.sampleSize===1);
  return {success:t.every(function(x){return x.pass;}),tests:t};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DEEP_REPORT_runTests', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DEEP_REPORT_runTests', Date.now() - __kolIdsTraceStartedAt);
  }
}
