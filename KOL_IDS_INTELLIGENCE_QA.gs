/**
 * KOL IDS™ V15.8 — Deep Decision Intelligence QA
 * Deterministic checks for scoring integrity and end-to-end decision wiring.
 */
function KOL_IDS_INTELLIGENCE_QA_DEEP_INTELLIGENCE_QA(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_QA_DEEP_INTELLIGENCE_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var out={success:true,version:'15.8.0',tests:[],timestamp:new Date().toISOString()};
  function KOL_IDS_INTELLIGENCE_QA_qaT_(name,fn){try{var r=fn();var pass=r===true||r===undefined||!!(r&&r.pass===true);out.tests.push({name:name,pass:pass,message:pass?'PASS':String(r&&r.message||'FAIL')});if(!pass)out.success=false;}catch(e){out.tests.push({name:name,pass:false,message:e&&e.message?e.message:String(e)});out.success=false;}}
  KOL_IDS_INTELLIGENCE_QA_qaT_('Goal weights sum to 1',function(){return ['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'].every(function(g){var KOL_IDS_PLATFORM_w=KOL_IDS_CORE_goalWeights_(g),s=KOL_IDS_PLATFORM_w.persona+KOL_IDS_PLATFORM_w.audience+KOL_IDS_PLATFORM_w.content+KOL_IDS_PLATFORM_w.objective+KOL_IDS_PLATFORM_w.brand+KOL_IDS_PLATFORM_w.efficiency;return Math.abs(s-1)<0.00001;});});
  KOL_IDS_INTELLIGENCE_QA_qaT_('Introvert and Extrovert remain distinct signals',function(){var a=KOL_IDS_CORE_semanticOverlap_('Introvert','Extrovert');return a===0;});
  KOL_IDS_INTELLIGENCE_QA_qaT_('Semantic matching recognizes equivalent behavior concepts',function(){return KOL_IDS_CORE_semanticOverlap_('expert trust education','Expert-led Trust-based Educational')>0;});
  KOL_IDS_INTELLIGENCE_QA_qaT_('Behavior fit is bounded 0-100',function(){var x=KOL_IDS_CORE_behavioralFit_({behaviors:'research oriented',goalsNeeds:'trust',painPoints:'uncertainty',interests:'beauty'},{socialBehavior:'Research-oriented',psychology:'Trust-seeking',relationship:'Expert–Follower',communication:'Expert-led'},'CONSIDERATION');return x>=0&&x<=100;});
  KOL_IDS_INTELLIGENCE_QA_qaT_('Content recommendation returns ranked actionable formats',function(){var x=KOL_IDS_CORE_contentRecommendation_('CONSIDERATION',{styles:'review tutorial',contentFunction:'Education Trust Building',contentBehavior:'Save-driven',contentPersonality:'Expert',communication:'Expert-led'},['B','Brand','beauty','THAILAND','premium beauty','quality','gambling'],{});return Array.isArray(x)&&x.length>=3&&x[0].rank===1&&x.every(function(v){return v.fit>=0&&v.fit<=100;});});
  KOL_IDS_INTELLIGENCE_QA_qaT_('Learning adjustment is bounded',function(){return Math.abs(KOL_IDS_CORE_boundedLearning_(100,0,100))<=5&&Math.abs(KOL_IDS_CORE_boundedLearning_(0,100,20))<=2;});
  KOL_IDS_INTELLIGENCE_QA_qaT_('Evidence coverage is bounded',function(){var x=KOL_IDS_CORE_evidenceCoverage({followers:100,ageMin:18,ageMax:34,gender:'ANY',locations:'Thailand',interests:'beauty',styles:'review'},{goalsNeeds:'quality',painPoints:'price'},true,true,true);return x>=0&&x<=100;});
  KOL_IDS_INTELLIGENCE_QA_qaT_('Confidence is bounded',function(){var x=KOL_IDS_CORE_confidence({followers:100},{},'LOW',true,true,90,{count:3});return x>=0&&x<=100;});
  try{Logger.log(JSON.stringify(out,null,2));}catch(e){}
  return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_QA_DEEP_INTELLIGENCE_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_QA_DEEP_INTELLIGENCE_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
