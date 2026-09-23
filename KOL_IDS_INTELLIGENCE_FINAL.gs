/* KOL IDS — Final Investment Intelligence Layer
 * Production-safe, deterministic, evidence-aware. No external API dependency.
 * Adds: fair-price benchmarking, creator quality calibration, opportunity value,
 * portfolio role, decision confidence, and explicit unknown-data handling.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {MAX_TOTAL_ADJ:10,MAX_HISTORY_ADJ:5,MAX_PEER_ADJ:3,MAX_PRICE_ADJ:2});
function KOL_IDS_INTELLIGENCE_FINAL_clamp_(v,min,max){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);if(!isFinite(n))n=0;return Math.max(min,Math.min(max,n));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_median_(arr){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var a=(arr||[]).map(Number).filter(isFinite).sort(function(x,y){return x-y;});if(!a.length)return null;var m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return isFinite(n)?n:null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_completed_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_completed_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sh=KOL_IDS_PA_legacyProjection_(ss);if(!sh||sh.getLastRow()<2)return {rows:[],map:{}};var m=KOL_IDS_CORE_colMap_(sh),rows=KOL_IDS_CORE_values_(sh).filter(function(r){return String(m['Status']!=null?r[m['Status']]:'COMPLETED').toUpperCase()==='COMPLETED';});return {rows:rows,map:m};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_completed_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_completed_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_creatorMap_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_creatorMap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var sh=ss.getSheetByName('ENT_CREATORS');if(!sh)return {rows:[],map:{},byId:{}};var rows=KOL_IDS_CORE_values_(sh),m=KOL_IDS_CORE_colMap_(sh),byId={};rows.forEach(function(r){var id=m['Creator ID']!=null?r[m['Creator ID']]:r[0];byId[String(id)]=r;});return {rows:rows,map:m,byId:byId};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_creatorMap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_creatorMap_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_actualRate_(r,m){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_actualRate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var v=m['Rate']!=null?r[m['Rate']]:r[13];return v!==''&&v!=null&&isFinite(Number(v))?Number(v):null;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_actualRate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_actualRate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_followers_(r,m){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_followers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var v=m['Followers']!=null?r[m['Followers']]:r[4];return v!==''&&v!=null&&isFinite(Number(v))?Number(v):0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_followers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_followers_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_platform_(r,m){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_platform_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(m['Platform']!=null?r[m['Platform']]:r[2]||'UNKNOWN').trim().toUpperCase();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_platform_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_platform_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_category_(r,m){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_category_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(m['Category']!=null?r[m['Category']]:r[12]||'UNKNOWN').trim().toLowerCase();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_category_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_category_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_priceBenchmark_(ss,creator){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_priceBenchmark_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var cm=KOL_IDS_INTELLIGENCE_FINAL_creatorMap_(ss),platform=String(creator.platform||'UNKNOWN').toUpperCase(),category=String(creator.category||'UNKNOWN').toLowerCase(),creatorId=String(creator.id||''),rows=cm.rows,actual=[];
  rows.forEach(function(r){var p=KOL_IDS_INTELLIGENCE_FINAL_platform_(r,cm.map),cat=KOL_IDS_INTELLIGENCE_FINAL_category_(r,cm.map),rate=KOL_IDS_INTELLIGENCE_FINAL_actualRate_(r,cm.map),fol=KOL_IDS_INTELLIGENCE_FINAL_followers_(r,cm.map),rowId=String(cm.map['Creator ID']!=null?r[cm.map['Creator ID']]:r[0]);if(rowId===creatorId)return;if(rate&&rate>0&&p===platform){var exact=cat&&cat!=='unknown'&&cat===category;actual.push({rate:rate,followers:fol,exact:exact});}});
  if(!actual.length)return null;
  var exact=actual.filter(function(x){return x.exact;});
  var pool=exact.length>=3?exact:actual, rates=pool.map(function(x){return x.rate;}), median=KOL_IDS_INTELLIGENCE_FINAL_median_(rates), fol=Number(creator.followers)||0;
  var ratios=pool.filter(function(x){return x.followers>0;}).map(function(x){return x.rate/x.followers*100000;});
  var ratePer100k=KOL_IDS_INTELLIGENCE_FINAL_median_(ratios),scaled=ratePer100k&&fol?ratePer100k*fol/100000:null;
  var fair=median!=null&&scaled!=null?median*.5+scaled*.5:(median!=null?median:scaled);
  var low=KOL_IDS_INTELLIGENCE_FINAL_median_(rates.slice().sort(function(a,b){return a-b;}).slice(0,Math.max(1,Math.ceil(rates.length*.35))));
  var high=KOL_IDS_INTELLIGENCE_FINAL_median_(rates.slice().sort(function(a,b){return a-b;}).slice(Math.floor(rates.length*.65)));
  return {fairRate:fair!=null?Math.round(fair):null,lowRate:low!=null?Math.round(low):null,highRate:high!=null?Math.round(high):null,sampleSize:pool.length,basis:exact.length>=3?'same platform + category':'same platform',platform:platform,category:category};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_priceBenchmark_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_priceBenchmark_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_peerPerformance_(ss,creator,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_peerPerformance_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var pack=KOL_IDS_INTELLIGENCE_FINAL_completed_(ss),cm=KOL_IDS_INTELLIGENCE_FINAL_creatorMap_(ss);if(!pack.rows.length)return null;
  var platform=String(creator.platform||'UNKNOWN').toUpperCase(),category=String(creator.category||'UNKNOWN').toLowerCase(),vals=[],same=[];
  pack.rows.forEach(function(r){var id=String(pack.map['Creator ID']!=null?r[pack.map['Creator ID']]:r[2]),cr=cm.byId[id];if(!cr)return;var p=KOL_IDS_INTELLIGENCE_FINAL_platform_(cr,cm.map),cat=KOL_IDS_INTELLIGENCE_FINAL_category_(cr,cm.map);if(p!==platform)return;var actual=Number(KOL_IDS_CORE_actualGoalScoreFromRow_(r,goal));if(!isFinite(actual))return;vals.push(actual);if(category&&category!=='unknown'&&cat===category)same.push(actual);});
  var chosen=same.length>=3?same:vals;if(chosen.length<3)return null;var median=KOL_IDS_INTELLIGENCE_FINAL_median_(chosen),sorted=chosen.slice().sort(function(a,b){return a-b;}),KOL_IDS_ADAPTIVE_pct=Math.round(sorted.filter(function(v){return v<=median;}).length/sorted.length*100);
  return {median:Math.round(median),sampleSize:chosen.length,percentile:KOL_IDS_ADAPTIVE_pct,basis:same.length>=3?'same platform + category':'same platform'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_peerPerformance_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_peerPerformance_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_opportunity_(baseScore,confidence,price,benchmark,creator){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_opportunity_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var current=Number(price),fair=benchmark&&Number(benchmark.fairRate)>0?Number(benchmark.fairRate):null;
  var priceValue=50,priceRisk='UNKNOWN';
  if(current>0&&fair){var ratio=current/fair;priceValue=ratio<=.8?100:ratio<=1?85:ratio<=1.2?70:ratio<=1.5?50:25;priceRisk=ratio<=1.2?'LOW':ratio<=1.5?'MEDIUM':'HIGH';}
  else if(current>0)priceRisk='MEDIUM';
  else priceRisk='HIGH';
  var expected=KOL_IDS_INTELLIGENCE_FINAL_clamp_(Number(baseScore)*.65+Number(confidence)*.20+priceValue*.15,0,100);
  return {priceValue:Math.round(priceValue),priceRisk:priceRisk,opportunityScore:Math.round(expected),fairRate:fair};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_opportunity_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_opportunity_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_role_(goal,score,brandFit,contentFit,efficiency){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_role_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var g=String(goal||'').toUpperCase(),s=Number(score)||0,b=Number(brandFit)||0,c=Number(contentFit)||0,e=Number(efficiency)||0;
  if(g==='CONVERSION'&&e>=65)return 'CONVERSION DRIVER';
  if(g==='CONSIDERATION'&&(b>=70||c>=70))return 'TRUST / CONSIDERATION DRIVER';
  if(g==='ENGAGEMENT'&&c>=65)return 'COMMUNITY / ENGAGEMENT DRIVER';
  if((g==='AWARENESS'||g==='LAUNCH')&&s>=75)return 'AWARENESS / DISCOVERY DRIVER';
  return s>=70?'SUPPORT CREATOR':'TEST / CONDITIONAL CREATOR';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_role_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_role_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_intelligence_(ss,creator,target,goal,baseScore,confidence,hist,erActual,rateActual,brandFit,contentFit,efficiency){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_intelligence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var peer=KOL_IDS_INTELLIGENCE_FINAL_peerPerformance_(ss,creator,goal),price=KOL_IDS_INTELLIGENCE_FINAL_priceBenchmark_(ss,creator),priceInfo=KOL_IDS_INTELLIGENCE_FINAL_opportunity_(baseScore,confidence,creator.rate,price,creator),
      social=50,audience=50,auth=70,content=Number(contentFit)||50;
  try{var a=creator&&creator.audience?creator.audience:{};['fit','quality','relevance','affinity','audienceFit'].some(function(k){if(a[k]!=null&&isFinite(Number(a[k]))){audience=Number(a[k]);return true;}return false;});}catch(e){}
  try{var c=creator&&creator.content?creator.content:{};['engagementQuality','engagement','quality','sentiment','contentQuality'].some(function(k){if(c[k]!=null&&isFinite(Number(c[k]))){social=Number(c[k]);return true;}return false;});if(c.authenticity!=null&&isFinite(Number(c.authenticity)))auth=Number(c.authenticity);}catch(e){}
  var historyAdj=0,peerAdj=0,basis=[];
  if(hist&&Number(hist.count)>=2&&isFinite(Number(hist.score))){historyAdj=KOL_IDS_INTELLIGENCE_FINAL_clamp_((Number(hist.score)-Number(baseScore))*.16,-KOL_IDS.MAX_HISTORY_ADJ,KOL_IDS.MAX_HISTORY_ADJ);basis.push('creator historical performance');}
  if(peer){peerAdj=KOL_IDS_INTELLIGENCE_FINAL_clamp_((Number(peer.median)-Number(baseScore))*.06,-KOL_IDS.MAX_PEER_ADJ,KOL_IDS.MAX_PEER_ADJ);basis.push(peer.basis+' benchmark');}
  var anomaly=(isFinite(Number(erActual))&&Number(erActual)>25)?25:0, fraudRisk=anomaly+(isFinite(Number(confidence))&&Number(confidence)<40?10:0);
  var total=KOL_IDS_INTELLIGENCE_FINAL_clamp_(historyAdj+peerAdj+((social-50)*.05)+((audience-50)*.04)+((auth-50)*.03)-fraudRisk*.10,-KOL_IDS.MAX_TOTAL_ADJ,KOL_IDS.MAX_TOTAL_ADJ),
      reliability=KOL_IDS_INTELLIGENCE_FINAL_clamp_(confidence+(erActual?3:-3)+(rateActual?2:-2)+(peer?3:0)+((social-50)*.08)+((audience-50)*.06)-fraudRisk*.10,0,100),
      role=KOL_IDS_INTELLIGENCE_FINAL_role_(goal,baseScore,brandFit,content,efficiency),dataState=confidence>=80?'HIGH EVIDENCE':confidence>=60?'MEDIUM EVIDENCE':'LOW EVIDENCE';
  if(!erActual||!rateActual)dataState+=' · ESTIMATED INPUTS';
  return {scoreAdjustment:Number(total.toFixed(2)),historyAdjustment:Number(historyAdj.toFixed(2)),peerAdjustment:Number(peerAdj.toFixed(2)),basis:basis.length?basis.join(' + '):'CORE ONLY',peerBenchmark:peer,priceBenchmark:price,priceValue:priceInfo.priceValue,priceRisk:priceInfo.priceRisk,fairRate:priceInfo.fairRate,opportunityScore:priceInfo.opportunityScore,investmentStrength:Math.round(KOL_IDS_INTELLIGENCE_FINAL_clamp_(baseScore*.45+confidence*.20+priceInfo.priceValue*.15+social*.10+audience*.10-fraudRisk*.20,0,100)),dataReliability:Math.round(reliability),dataState:dataState,role:role,decisionClass:total>=2?'CALIBRATED UP':total<=-2?'CALIBRATED DOWN':basis.length?'EVIDENCE STABLE':'CORE ONLY',socialIntelligence:{engagementQuality:Math.round(social),audienceQuality:Math.round(audience),authenticity:Math.round(auth)},fraudIntelligence:{riskScore:Math.round(Math.min(100,fraudRisk)),flags:fraudRisk>=25?['DATA_OR_ENGAGEMENT_ANOMALY']:[]}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_intelligence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_intelligence_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_FINAL_runTests(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_FINAL_runTests');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var t=[],ok=function(n,v){t.push({name:n,pass:!!v});};ok('clamp',KOL_IDS_INTELLIGENCE_FINAL_clamp_(200,0,100)===100&&KOL_IDS_INTELLIGENCE_FINAL_clamp_(-2,0,100)===0);ok('median',KOL_IDS_INTELLIGENCE_FINAL_median_([4,1,3,2])===2.5);ok('role conversion',KOL_IDS_INTELLIGENCE_FINAL_role_('CONVERSION',80,70,60,70)==='CONVERSION DRIVER');ok('unknown price safe',KOL_IDS_INTELLIGENCE_FINAL_opportunity_(70,60,0,null,{}).priceRisk==='HIGH');return {success:t.every(function(x){return x.pass;}),version:KOL_IDS.VERSION,tests:t};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_FINAL_runTests', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_FINAL_runTests', Date.now() - __kolIdsTraceStartedAt);
  }
}
