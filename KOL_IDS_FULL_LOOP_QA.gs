/** KOL IDS — FULL LOOP QA / CONTINUITY GATE
 * Read-only by default. Validates that the same Campaign ID and Creator ID
 * remain connected across analysis, selection, performance and both reports.
 */
function KOL_IDS_FULL_LOOP_QA_FULL_LOOP_QA(token,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FULL_LOOP_QA_FULL_LOOP_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!token){
    // QA may be invoked directly from Apps Script / UI without an argument.
    // Resolve an active, workspace-bound license and issue a fresh token using
    // the current project secret so QA never depends on a stale stored token.
    if(typeof KOL_IDS_CORE_resolveQAToken_==='function') token=KOL_IDS_CORE_resolveQAToken_();
    else throw new Error('QA access token is required.');
  }
  const ss=KOL_IDS_CORE_ctx_(token).ss;KOL_IDS_CORE_upgradeSchema_(token);
  const fail=[];const pass=[];const check=(name,ok,detail)=>{(ok?pass:fail).push({name,detail:detail||''});};
  const campSh=ss.getSheetByName('ENT_CAMPAIGNS'),decSh=ss.getSheetByName('ENT_DECISIONS'),perfSh=KOL_IDS_PA_legacyProjection_(ss);
  const camp=KOL_IDS_CORE_findRow_(campSh,campaignId),creator=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CREATORS'),creatorId);
  check('Campaign exists',!!camp,'Campaign ID '+campaignId);check('Creator exists',!!creator,'Creator ID '+creatorId);if(!camp||!creator)return{success:false,status:'BLOCKED',campaignId,creatorId,passed:pass,failures:fail};
  const cm=KOL_IDS_CORE_colMap_(campSh),dm=KOL_IDS_CORE_colMap_(decSh),pm=KOL_IDS_CORE_colMap_(perfSh);
  const decisions=KOL_IDS_CORE_values_(decSh).filter(r=>String(dm['Campaign ID']!=null?r[dm['Campaign ID']]:r[1])===String(campaignId)&&String(dm['Creator ID']!=null?r[dm['Creator ID']]:r[2])===String(creatorId));
  const selected=KOL_IDS_CORE_getSelectedCreators_(ss,campaignId).map(String),perfs=KOL_IDS_CORE_values_(perfSh).filter(r=>String(pm['Campaign ID']!=null?r[pm['Campaign ID']]:r[1])===String(campaignId)&&String(pm['Creator ID']!=null?r[pm['Creator ID']]:r[2])===String(creatorId));
  check('Decision exists',decisions.length>0,'Creator was analyzed for this campaign');
  check('Selection continuity',selected.indexOf(String(creatorId))>=0,'Selected Creator IDs contains creator');
  check('Performance continuity',perfs.length>0,'Performance row exists for campaign + creator');
  const campStart=cm['Start Date']!=null?camp[cm['Start Date']]:'' ,campEnd=cm['End Date']!=null?camp[cm['End Date']]:'' ,duration=cm['Duration Days']!=null?Number(camp[cm['Duration Days']]):0;
  if(campStart&&campEnd){const expected=Math.round((new Date(campEnd).getTime()-new Date(campStart).getTime())/86400000)+1;check('Duration continuity',duration===expected,'Stored '+duration+' vs calculated '+expected+' days');}
  if(perfs.length){const r=perfs[perfs.length-1],n=h=>{const v=pm[h]!=null?r[pm[h]]:'';return v===''?null:Number(v);},likes=n('Likes'),comments=n('Comments'),shares=n('Shares'),saves=n('Saves'),eng=n('Engagements');const sum=(likes||0)+(comments||0)+(shares||0)+(saves||0);check('Engagement continuity',eng===null||sum<=eng,'Components '+sum+' / Engagements '+eng);check('Metric sanity',!(n('Reach')!==null&&n('Impressions')!==null&&n('Reach')>n('Impressions')),'Reach <= Impressions');check('Click sanity',!(n('Clicks')!==null&&n('Views')!==null&&n('Clicks')>n('Views')),'Clicks <= Views');check('Conversion sanity',!(n('Conversions')!==null&&n('Clicks')!==null&&n('Conversions')>n('Clicks')),'Conversions <= Clicks');}
  let report=null,plan=null;try{report=KOL_IDS_CORE_getCampaignReport(token,campaignId);check('Report 01 generated',!!report&&Array.isArray(report.decisions),'Creator Analysis report generated');check('Report 02 generated',!!report&&Array.isArray(report.performance),'Campaign Performance report generated');check('Report creator continuity',!!report&&report.performance.some(x=>String(x.creatorId)===String(creatorId)),'Performance report contains selected creator');}catch(e){check('Reports generated',false,String(e&&e.message||e));}
  try{plan=KOL_IDS_CORE_getCampaignPlan(token,campaignId);check('Campaign plan generated',!!plan&&Array.isArray(plan.allocations),'Campaign plan generated');check('Plan creator continuity',!!plan&&(!selected.length||plan.selectedCreatorIds.map(String).indexOf(String(creatorId))>=0),'Plan preserves selected creator IDs');}catch(e){check('Campaign plan generated',false,String(e&&e.message||e));}
  return {success:fail.length===0,status:fail.length?'FAILED':'PASSED',campaignId:String(campaignId),creatorId:String(creatorId),passed:pass,failures:fail,summary:{passed:pass.length,failed:fail.length},next:fail.length?'Fix failed continuity gates before production use.':'Full read-only loop continuity passed.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FULL_LOOP_QA_FULL_LOOP_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FULL_LOOP_QA_FULL_LOOP_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_FULL_LOOP_QA_SYSTEM_QA(token){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FULL_LOOP_QA_SYSTEM_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    // Direct Apps Script execution normally provides no argument. Resolve a
    // fresh QA token from the authoritative ACTIVE, workspace-bound license.
    // If a stale token is explicitly supplied, repair it from its payload.
    if(!token){
      if(typeof KOL_IDS_CORE_resolveQAToken_==='function') token=KOL_IDS_CORE_resolveQAToken_();
      else throw new Error('QA access token is required.');
    }

    const ss=KOL_IDS_CORE_ctx_(token).ss;KOL_IDS_CORE_upgradeSchema_(token);const required=['ENT_BRANDS','ENT_PERSONAS','ENT_CREATORS','ENT_CAMPAIGNS','ENT_DECISIONS','ENT_PERFORMANCE','ENT_LEARNING','ENT_MEMORY','ENT_STRATEGIES'];const missing=required.filter(n=>!ss.getSheetByName(n));const duplicateNames={};return {success:missing.length===0,status:missing.length?'FAILED':'PASSED',missingSheets:missing,requiredSheets:required,coreVersion:typeof KOL_IDS!=='undefined'?KOL_IDS.VERSION:'unknown',note:'Use KOL_IDS_FULL_LOOP_QA_FULL_LOOP_QA for a specific Campaign + Creator continuity check.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FULL_LOOP_QA_SYSTEM_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FULL_LOOP_QA_SYSTEM_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** KOL IDS — STRICT PRODUCTION GATE
 * Read-only. Run this after deployment. It does not create or mutate business data.
 * It verifies the executable surface, required sheets/headers, deterministic primitives,
 * and the active analysis chain when one exists.
 */
function KOL_IDS_FULL_LOOP_QA_STRICT_PRODUCTION_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FULL_LOOP_QA_STRICT_PRODUCTION_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const failures=[],warnings=[],checks=[];
  const ok=(name,cond,detail)=>{checks.push({name,ok:!!cond,detail:detail||''});if(!cond)failures.push({name,detail:detail||''});};
  const has=(n)=>typeof globalThis[n]==='function';
  ['KOL_IDS_SELF_SERVICE_BOOTSTRAP','KOL_IDS_SELF_GET_STATE','KOL_IDS_SELF_SAVE','KOL_IDS_SELF_RUN','KOL_IDS_SELF_SAVE_PERFORMANCE','KOL_IDS_SELF_GET_REPORT','KOL_IDS_SELF_GET_HISTORY','KOL_IDS_SELF_EXPORT_REPORT','KOL_IDS_SELF_RESET','KOL_IDS_PRODUCT_SAVE','KOL_IDS_PRODUCT_RUN','KOL_IDS_RUNTIME_PRODUCT_SAVE_PERFORMANCE','KOL_IDS_PRODUCT_BUILD_REPORT','KOL_IDS_PRODUCT_BUILD_PERFORMANCE_REPORT','KOL_IDS_SYSTEM_RUN_FULL_SYSTEM','KOL_IDS_ENGINE_runDecisionEngine','KOL_IDS_PORTFOLIO_runPortfolioOptimization'].forEach(n=>ok('Function '+n,has(n),'Executable server function'));
  const ss=KOL_IDS_SYSTEM_getSpreadsheet_();
  const required={
    '00_START':[],
    '01_INPUT':['FIELD','VALUE'],
    '02_BRAND_PROFILE':[],
    '03_CAMPAIGN':[],
    '04_KOL_DATABASE':[],
    '05_BRAND_FIT':[],
    '06_BRAND_IMPACT':[],
    '07_KOL_DECISION':[],
    '08_KOL_MANAGEMENT':[],
    '09_PERFORMANCE':[],
    '10_LEARNING':[],
    '11_EXECUTIVE':[],
    '12_PORTFOLIO':[],
    '13_DEEP_PROFILE':['Record Type','Record ID','Name','Audience Age','Audience Gender','Audience Location','Audience Interests','Goals & Needs','Pain Points','Personality','Communication','Influence Style','Audience Relationship','Social Behavior','Content Personality','Content Function','Content Behavior','Audience Psychology','Description','Updated At'],
    '14_PERFORMANCE_DETAIL':['Campaign ID','KOL ID','KOL Name','Platform','Spend','Currency','Reach','Impressions','Views','Likes','Comments','Shares','Saves','Engagements','Clicks','Conversions','Revenue','Engagement Rate','CTR','Conversion Rate','Reported Date','Evidence Status'],
    '16_KOL_PROFILE':['KOL ID','KOL Name','Photo URL','Photo Status','Notes','Last Updated'],
    '17_KOL_TRACK_RECORD':[],'18_KOL_VALUE':[],'19_CREATOR_ANALYSIS_REPORT':[],'20_ANALYSIS_HISTORY':[],'21_DECISION_LOG':[],'22_CAMPAIGN_PERFORMANCE_REPORT':[]
  };
  Object.keys(required).forEach(name=>{
    const sh=ss.getSheetByName(name);ok('Sheet '+name,!!sh,'Required product sheet');
    if(sh && required[name].length){const h=sh.getRange(1,1,1,Math.max(sh.getLastColumn(),required[name].length)).getValues()[0].map(String);required[name].forEach(x=>ok('Header '+name+' :: '+x,h.indexOf(x)>=0,'Required header'));}
  });
  ok('Number parser',KOL_IDS_PRODUCT_number_('1.5k')===1500,'1.5k => 1500');
  ok('Percent parser',KOL_IDS_PRODUCT_normalizePercent_('5%')===5,'5% => 5');
  ok('Age parser',!!KOL_IDS_PRODUCT_parseAgeRange_('18-24'),'18-24 parsed');
  ok('Overlap score',KOL_IDS_PRODUCT_overlapScore_('fashion beauty','fashion')===100,'Exact KOL_IDS_DECISION_SCIENCE_overlap');
  ok('Band clamp',KOL_IDS_PRODUCT_directBand_(1000000,5000,1000000)===100,'Upper band');
  ok('Inverse clamp',KOL_IDS_PRODUCT_inverseBand_(30,30,500)===100,'Best cost');
  const props=KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_();
  const campaignId=props.getProperty('KOL_IDS_ACTIVE_CAMPAIGN_ID')||props.getProperty('KBIS_ACTIVE_CAMPAIGN_ID')||'';
  const analysisId=props.getProperty('KOL_IDS_ACTIVE_ANALYSIS_ID')||props.getProperty('KBIS_ACTIVE_ANALYSIS_ID')||'';
  if(campaignId){
    const c=ss.getSheetByName('03_CAMPAIGN');const k=ss.getSheetByName('04_KOL_DATABASE');
    ok('Active campaign persisted',!!c && KOL_IDS_PRODUCT_readData_(c).some(r=>String(r[0])===String(campaignId)),'Active Campaign ID exists in 03_CAMPAIGN');
    ok('Active KOL data persisted',!!k && KOL_IDS_PRODUCT_readData_(k).some(r=>r[0]&&r[1]),'04_KOL_DATABASE contains KOL rows');
  } else warnings.push('No active campaign yet; runtime full-loop gates require a real analysis.');
  if(analysisId){const h=ss.getSheetByName((typeof KOL_IDS_PRODUCT_SHEETS!=='undefined' && KOL_IDS_PRODUCT_SHEETS.MEMORY) || '15_WORKFLOW_MEMORY');ok('Analysis ID state',!!h,'History sheet available');}
  return {success:failures.length===0,status:failures.length?'FAILED':'PASSED',checks,failures,warnings,summary:{passed:checks.filter(x=>x.ok).length,failed:failures.length,warnings:warnings.length},next:failures.length?'Fix every failed gate and run again.':(campaignId?'Run KOL_IDS_FULL_LOOP_QA_FULL_LOOP_QA for a real Campaign + Creator continuity check.':'Create one analysis, then run the full-loop QA gate.')};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FULL_LOOP_QA_STRICT_PRODUCTION_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FULL_LOOP_QA_STRICT_PRODUCTION_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * KOL IDS — DEEP DECISION QA
 * Read-only. Verifies the new behavioral/content intelligence layer and
 * the actionable Step 4 -> Step 5 -> Step 6 chain for one analyzed creator.
 */
function KOL_IDS_FULL_LOOP_QA_DEEP_DECISION_QA(token,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FULL_LOOP_QA_DEEP_DECISION_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Direct Apps Script execution provides no token argument. Resolve a fresh,
  // authoritative QA token before entering ctx_, exactly like the other QA gates.
  if(!token){
    if(typeof KOL_IDS_CORE_resolveQAToken_==='function') token=KOL_IDS_CORE_resolveQAToken_();
    else throw new Error('QA access token is required.');
  }
  const ss=KOL_IDS_CORE_ctx_(token).ss;KOL_IDS_CORE_upgradeSchema_(token);
  const fail=[],pass=[];const check=(name,ok,detail)=>{(ok?pass:fail).push({name,detail:detail||''});};
  const dsh=ss.getSheetByName('ENT_DECISIONS'),dm=KOL_IDS_CORE_colMap_(dsh);
  const rows=KOL_IDS_CORE_values_(dsh).filter(r=>String(r[dm['Campaign ID']!=null?dm['Campaign ID']:1])===String(campaignId)&&String(r[dm['Creator ID']!=null?dm['Creator ID']:2])===String(creatorId));
  const r=rows[rows.length-1];
  check('Decision exists',!!r,'Analyzed creator decision exists');
  if(!r)return{success:false,status:'FAILED',campaignId,creatorId,passed:pass,failures:fail};
  const bounded=(h)=>dm[h]!=null&&isFinite(Number(r[dm[h]]) )&&Number(r[dm[h]])>=0&&Number(r[dm[h]])<=100;
  ['Decision Score','Persona Fit','Audience Fit','Behavior Fit','Content Fit','Objective Fit','Brand Fit','Confidence Score'].forEach(h=>check(h+' bounded',bounded(h),'0–100'));
  check('Behavior Fit persisted',dm['Behavior Fit']!=null,'Behavior Fit column exists and is persisted');
  check('Content Recommendation persisted',dm['Content Recommendation']!=null&&String(r[dm['Content Recommendation']]||'').trim()!=='','Content recommendation exists');
  check('Evidence persisted',dm['Evidence']!=null&&String(r[dm['Evidence']]||'').indexOf('AudienceBehavior=')>=0,'Evidence includes behavioral calculation');
  try{
    const s=KOL_IDS_CORE_getPreferredStrategy(token,{campaignId:String(campaignId),creatorId:String(creatorId)});
    check('Preferred strategy executes',!!s&&!!s.strategy,'Strategy response returned');
    check('Recovery actions returned',!!s.strategy&&Array.isArray(s.strategy.strategies)&&s.strategy.strategies.length>0,'At least one actionable recovery instruction');
    check('Recommended content returned',!!s.strategy&&Array.isArray(s.strategy.contentRecommendation)&&s.strategy.contentRecommendation.length>0,'Content recommendation returned');
  }catch(e){check('Preferred strategy executes',false,String(e&&e.message||e));}
  try{
    const plan=KOL_IDS_CORE_getCampaignPlan(token,campaignId);
    check('Campaign plan executes',!!plan&&Array.isArray(plan.allocations),'Plan returned');
  }catch(e){check('Campaign plan executes',false,String(e&&e.message||e));}
  return {success:fail.length===0,status:fail.length?'FAILED':'PASSED',campaignId:String(campaignId),creatorId:String(creatorId),passed:pass,failures:fail,summary:{passed:pass.length,failed:fail.length},note:'Read-only deep QA for Behavior Fit, Content Recommendation, Recovery Strategy and Campaign Plan.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FULL_LOOP_QA_DEEP_DECISION_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FULL_LOOP_QA_DEEP_DECISION_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
