/**
 * KOL IDS Intelligence Hardened 1.2.0
 * Decision Trace + Attribution + Learning
 * Namespaced to avoid collisions with legacy modules.
 */
var KOL_IDS_INTEL_V120 = (function () {
  var VERSION = '1.2.0';
  var PREFIX = 'KOL_IDS_INTEL_V120_';
  var SHEETS = { TRACE: PREFIX+'TRACE', ATTR: PREFIX+'ATTRIBUTION', LEARN: PREFIX+'LEARNING' };

  function now_() { return new Date().toISOString(); }
  function id_(kind) { return PREFIX + kind + '_' + Utilities.getUuid().replace(/-/g,''); }
  function json_(v) { return JSON.stringify(v == null ? null : v); }
  function parse_(v, fallback) { try { return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; } }
  function hash_(v) { var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, json_(v), Utilities.Charset.UTF_8); return raw.map(function(b){var n=b<0?b+256:b;return ('0'+n.toString(16)).slice(-2);}).join(''); }
  function clean_(v) { return v == null ? '' : String(v).slice(0, 5000); }
  function num_(v) { var n=Number(v); return isFinite(n) ? n : 0; }
  function getSheet_(name) { var ss=SpreadsheetApp.getActive(); var sh=ss.getSheetByName(name); if(!sh) sh=ss.insertSheet(name); return sh; }
  function ensure_(name, headers) { var sh=getSheet_(name); if(sh.getLastRow()===0) sh.getRange(1,1,1,headers.length).setValues([headers]); return sh; }
  function append_(name, headers, row) { var sh=ensure_(name,headers); sh.appendRow(row); return sh.getLastRow(); }
  function actor_() { try{return Session.getActiveUser().getEmail()||'anonymous';}catch(e){return 'anonymous';} }
  function workspace_() { try{return PropertiesService.getUserProperties().getProperty('WORKSPACE_ID')||'default';}catch(e){return 'default';} }
  function assert_(o, keys) { keys.forEach(function(k){if(o[k]===undefined||o[k]===null||o[k]==='') throw new Error('Missing required field: '+k);}); }

  var TRACE_HEADERS=['traceId','workspaceId','campaignId','creatorId','eventType','engineVersion','inputHash','inputSnapshot','featureContributions','decisionReasons','constraintsApplied','score','confidence','parentTraceId','actor','createdAt'];
  var ATTR_HEADERS=['attributionId','workspaceId','campaignId','creatorId','channel','model','eventId','eventType','value','currency','touches','evidence','confidence','createdAt'];
  var LEARN_HEADERS=['learningId','workspaceId','campaignId','creatorId','segmentKey','metric','value','sampleSize','sourceTraceIds','sourceAttributionIds','method','confidence','createdAt'];

  function recordTrace(input) {
    input=input||{}; assert_(input,['campaignId','creatorId']);
    var snapshot=input.inputSnapshot||{};
    var trace={traceId:id_('TRACE'),workspaceId:input.workspaceId||workspace_(),campaignId:clean_(input.campaignId),creatorId:clean_(input.creatorId),eventType:input.eventType||'DECISION_EVALUATED',engineVersion:input.engineVersion||VERSION,inputHash:hash_(snapshot),inputSnapshot:snapshot,featureContributions:input.featureContributions||{},decisionReasons:input.decisionReasons||[],constraintsApplied:input.constraintsApplied||[],score:num_(input.score),confidence:num_(input.confidence),parentTraceId:input.parentTraceId||'',actor:actor_(),createdAt:now_()};
    append_(SHEETS.TRACE,TRACE_HEADERS,[trace.traceId,trace.workspaceId,trace.campaignId,trace.creatorId,trace.eventType,trace.engineVersion,trace.inputHash,json_(trace.inputSnapshot),json_(trace.featureContributions),json_(trace.decisionReasons),json_(trace.constraintsApplied),trace.score,trace.confidence,trace.parentTraceId,trace.actor,trace.createdAt]);
    return trace;
  }

  function recordAttribution(input) {
    input=input||{}; assert_(input,['campaignId','creatorId','channel','model','eventType']);
    var a={attributionId:id_('ATTR'),workspaceId:input.workspaceId||workspace_(),campaignId:clean_(input.campaignId),creatorId:clean_(input.creatorId),channel:clean_(input.channel),model:clean_(input.model),eventId:clean_(input.eventId||''),eventType:clean_(input.eventType),value:num_(input.value),currency:input.currency||'THB',touches:input.touches||[],evidence:input.evidence||[],confidence:num_(input.confidence),createdAt:now_()};
    append_(SHEETS.ATTR,ATTR_HEADERS,[a.attributionId,a.workspaceId,a.campaignId,a.creatorId,a.channel,a.model,a.eventId,a.eventType,a.value,a.currency,json_(a.touches),json_(a.evidence),a.confidence,a.createdAt]);
    return a;
  }

  function recordLearning(input) {
    input=input||{}; assert_(input,['segmentKey','metric']);
    var l={learningId:id_('LEARN'),workspaceId:input.workspaceId||workspace_(),campaignId:input.campaignId||'',creatorId:input.creatorId||'',segmentKey:clean_(input.segmentKey),metric:clean_(input.metric),value:num_(input.value),sampleSize:num_(input.sampleSize),sourceTraceIds:input.sourceTraceIds||[],sourceAttributionIds:input.sourceAttributionIds||[],method:input.method||'DESCRIPTIVE',confidence:num_(input.confidence),createdAt:now_()};
    append_(SHEETS.LEARN,LEARN_HEADERS,[l.learningId,l.workspaceId,l.campaignId,l.creatorId,l.segmentKey,l.metric,l.value,l.sampleSize,json_(l.sourceTraceIds),json_(l.sourceAttributionIds),l.method,l.confidence,l.createdAt]);
    return l;
  }

  function getRecent_(sheetName, limit) { var sh=SpreadsheetApp.getActive().getSheetByName(sheetName); if(!sh||sh.getLastRow()<2)return []; var n=Math.min(limit||50,sh.getLastRow()-1); var vals=sh.getRange(sh.getLastRow()-n+1,1,n,sh.getLastColumn()).getValues(); return vals; }
  function summary(campaignId) { return {version:VERSION,campaignId:campaignId||'',traceRows:getRecent_(SHEETS.TRACE,500).filter(function(r){return !campaignId||r[2]===campaignId;}).length,attributionRows:getRecent_(SHEETS.ATTR,500).filter(function(r){return !campaignId||r[2]===campaignId;}).length,learningRows:getRecent_(SHEETS.LEARN,500).filter(function(r){return !campaignId||r[2]===campaignId;}).length}; }

  return {VERSION:VERSION,SHEETS:SHEETS,recordTrace:recordTrace,recordAttribution:recordAttribution,recordLearning:recordLearning,summary:summary};
})();

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_recordDecisionTrace_v120(input){ return KOL_IDS_INTEL_V120.recordTrace(input); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_recordAttribution_v120(input){ return KOL_IDS_INTEL_V120.recordAttribution(input); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_recordLearning_v120(input){ return KOL_IDS_INTEL_V120.recordLearning(input); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_summary_v120(campaignId){ return KOL_IDS_INTEL_V120.summary(campaignId); }


function KOL_IDS_INTEL_recordDecisionTrace_v120() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_INTEL_recordDecisionTrace_v120', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_recordDecisionTrace_v120, this, arguments);
}


function KOL_IDS_INTEL_recordAttribution_v120() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_INTEL_recordAttribution_v120', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_recordAttribution_v120, this, arguments);
}


function KOL_IDS_INTEL_recordLearning_v120() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_INTEL_recordLearning_v120', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_recordLearning_v120, this, arguments);
}


function KOL_IDS_INTEL_summary_v120() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_INTEL_summary_v120', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL_summary_v120, this, arguments);
}
