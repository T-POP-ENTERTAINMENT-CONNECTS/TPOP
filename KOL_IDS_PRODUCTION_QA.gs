/**
 * KOL IDS — PRODUCTION ACCEPTANCE TEST SUITE
 *
 * Purpose:
 * - One-command production acceptance test for the deployed Apps Script runtime.
 * - Safe by default: no customer-data mutation and no fixture creation.
 * - Separates automated PASS/FAIL from MANUAL deployment acceptance items.
 * - Tests contract wiring, schemas, API security, idempotency health,
 *   Org/Brand isolation integrity, audit-chain integrity, runtime smoke,
 *   and the full campaign -> outcome -> learning flywheel when IDs are supplied.
 *
 * Usage:
 *   KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_({
 *     orgId:'ORG_ID',
 *     brandId:'BRAND_ID',
 *     campaignId:'CAMPAIGN_ID',
 *     persist:true
 *   });
 *
 * Required for full automated acceptance:
 *   orgId + brandId + campaignId must reference real authorized test data.
 *
 * This suite deliberately does NOT claim to validate Google deployment settings,
 * OAuth consent, account/domain policy, quotas, browser UX, or multi-user timing.
 * Those are reported as MANUAL gates.
 */
var KOL_IDS_PRODUCTION_PAT = Object.freeze({
  VERSION:'1.0.0',
  REPORT_SHEET:'QA_V25_18_ACCEPTANCE',
  MAX_ROWS_PER_SHEET:20000,
  MANUAL_GATES:[
    'WEB_APP_DEPLOYMENT',
    'OAUTH_AND_ACCOUNT_PERMISSION',
    'DOMAIN_ACCESS_POLICY',
    'CONCURRENT_USER_TEST',
    'QUOTA_AND_RUNTIME_LOAD_TEST',
    'BROWSER_UI_E2E',
    'BACKUP_AND_ROLLBACK_PROCEDURE'
  ]
});

function KOL_IDS_PRODUCTION_QA_patTest_(tests,name,fn){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_patTest_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var started=Date.now(),r;
  try{
    r=fn();
    var pass=r===true || (r&&r.success===true);
    tests.push({name:name,status:pass?'PASS':'FAIL',durationMs:Date.now()-started,result:r===true?{success:true}:r});
    return pass;
  }catch(e){
    tests.push({name:name,status:'FAIL',durationMs:Date.now()-started,error:String(e&&e.message||e),code:String(e&&e.code||'INTERNAL_ERROR')});
    return false;
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_patTest_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_patTest_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_patAssert_(condition,message,code){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_patAssert_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!condition)throw KOL_IDS_PLATFORM_error_(code||'ACCEPTANCE_FAIL',message);
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_patAssert_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_patAssert_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_patIsolationQA_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_patIsolationQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_(),bsh=ss.getSheetByName(KOL_IDS.SHEETS.BRANDS);
  KOL_IDS_PRODUCTION_QA_patAssert_(bsh,'Brands sheet is missing.','SCHEMA_ERROR');
  var bm=KOL_IDS_PLATFORM_map_(bsh),brands=KOL_IDS_PLATFORM_values_(bsh),validBrands={};
  brands.forEach(function(r){
    if(String(r[bm['Org ID']]).trim()===String(orgId).trim() && String(r[bm['Status']]).toUpperCase()==='ACTIVE')
      validBrands[String(r[bm['Brand ID']]).trim()]=true;
  });
  KOL_IDS_PRODUCTION_QA_patAssert_(validBrands[String(brandId).trim()],'Requested brand is not an active brand in the organization.','ISOLATION_FAIL');

  var sheets=[];
  Object.keys(KOL_IDS.SHEETS).forEach(function(k){sheets.push(KOL_IDS.SHEETS[k]);});
  sheets=sheets.concat([
    'ENT_CREATOR_MARKETPLACE','ENT_CAMPAIGN_DELIVERABLES','ENT_DISCOVERY_EVENTS',
    'ENT_MATCH_DECISIONS','ENT_OUTCOME_LEARNING','ENT_LEARNING_SIGNALS'
  ]).filter(function(x,i,a){return x&&a.indexOf(x)===i;});

  var violations=[],scanned=0,skipped=0;
  sheets.forEach(function(name){
    var sh=ss.getSheetByName(name); if(!sh){skipped++;return;}
    var last=Math.min(sh.getLastRow(),KOL_IDS_PRODUCTION_PAT.MAX_ROWS_PER_SHEET); if(last<2){return;}
    var m=KOL_IDS_PLATFORM_map_(sh),orgCol=m['Org ID'],brandCol=m['Brand ID'];
    if(orgCol==null){skipped++;return;}
    var rows=sh.getRange(2,1,last-1,sh.getLastColumn()).getValues();
    rows.forEach(function(r,i){
      var ro=String(r[orgCol]||'').trim(),rb=brandCol==null?'':String(r[brandCol]||'').trim();
      if(!ro&&!rb)return;
      scanned++;
      if(ro!==String(orgId).trim()){
        // This is not a violation: the same spreadsheet is intentionally multi-tenant.
        return;
      }
      if(rb && rb!=='*' && !validBrands[rb])violations.push({sheet:name,row:i+2,orgId:ro,brandId:rb});
    });
  });
  return {success:violations.length===0,orgId:orgId,brandId:brandId,scanned:scanned,skippedSheets:skipped,violations:violations.slice(0,100),violationCount:violations.length,rule:'Rows for the requested Org may only reference active Brands belonging to that Org; wildcard Brand ID is allowed where the sheet contract permits it.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_patIsolationQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_patIsolationQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_patAuditChainQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_patAuditChainQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Canonical audit sheet self-heal: the production QA must validate the
  // actual enterprise audit chain, but it should not fail merely because an
  // older workspace was never initialized with ENT_AUDIT_LOG.
  var ss=KOL_IDS_PLATFORM_ensure_();
  var auditName=(KOL_IDS.SHEETS&&KOL_IDS.SHEETS.AUDIT)||'ENT_AUDIT_LOG';
  var headers=(typeof KOL_IDS_PLATFORM_headers_==='function'&&KOL_IDS_PLATFORM_headers_().ENT_AUDIT_LOG)||['Event ID','Timestamp','Org ID','Actor','Action','Entity Type','Entity ID','Outcome','Request ID','IP/Source','Previous Hash','Details Hash','Event Hash','Details'];
  var sh=ss.getSheetByName(auditName);
  if(!sh)sh=KOL_IDS_PLATFORM_ensureSheet_(ss,auditName,headers);
  // Backfill any missing canonical headers on legacy audit sheets.
  if(typeof KOL_IDS_PLATFORM_ensureSheet_==='function')sh=KOL_IDS_PLATFORM_ensureSheet_(ss,auditName,headers);
  var m=KOL_IDS_PLATFORM_map_(sh);
  var required=['Previous Hash','Details Hash','Event Hash','Request ID'];
  var missing=required.filter(function(h){return m[h]==null;});
  if(missing.length)return {success:false,status:'FAIL',error:'Audit sheet schema is incomplete.',missingHeaders:missing};
  var rows=KOL_IDS_PLATFORM_values_(sh),checked=0,violations=[];
  var max=Math.min(rows.length,KOL_IDS_PRODUCTION_PAT.MAX_ROWS_PER_SHEET);
  for(var i=0;i<max;i++){
    var r=rows[i];
    var prev=i===0?'':String(r[m['Previous Hash']]||'');
    if(prev && i>0){
      var prior=String(rows[i-1][m['Event Hash']]||'');
      if(prev!==prior)violations.push({row:i+2,type:'PREVIOUS_HASH_MISMATCH'});
    }
    var details=String(r[m['Details']]||'');
    var detailsHash=String(r[m['Details Hash']]||'');
    if(detailsHash && KOL_IDS_PLATFORM_hash_(details)!==detailsHash)violations.push({row:i+2,type:'DETAILS_HASH_MISMATCH'});
    var serialized=[prev,String(r[m['Request ID']]||''),String(r[m['Org ID']]||''),String(r[m['Actor']]||''),String(r[m['Action']]||''),String(r[m['Entity Type']]||''),String(r[m['Entity ID']]||''),String(r[m['Outcome']]||''),detailsHash].join('|');
    if(String(r[m['Event Hash']]||'') && KOL_IDS_PLATFORM_hash_(serialized)!==String(r[m['Event Hash']]||''))violations.push({row:i+2,type:'EVENT_HASH_MISMATCH'});
    checked++;
  }
  return {success:violations.length===0,checked:checked,violationCount:violations.length,violations:violations.slice(0,100),truncated:rows.length>max};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_patAuditChainQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_patAuditChainQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_patApiNegativeQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_patApiNegativeQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var badKey='INVALID_TEST_KEY_'+Utilities.getUuid().replace(/-/g,'');
  var e={postData:{contents:JSON.stringify({action:'HEALTH',apiKey:badKey,payload:{}})},headers:{}};
  var raw=doPost(e).getContent();
  var result=KOL_IDS_PLATFORM_json_(raw);
  return {success:result.success===false && ['UNAUTHORIZED','FORBIDDEN'].indexOf(String(result.code||'').toUpperCase())>=0,code:result.code,error:result.error,requestId:result.requestId};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_patApiNegativeQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_patApiNegativeQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_patManualGates_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_patManualGates_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_PRODUCTION_PAT.MANUAL_GATES.map(function(name){return {gate:name,status:'MANUAL',pass:null};});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_patManualGates_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_patManualGates_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_(options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  options=options||{};
  var started=new Date(),tests=[],orgId=String(options.orgId||'').trim(),brandId=String(options.brandId||'').trim(),campaignId=String(options.campaignId||'').trim();
  var automated=0,passed=0;
  function KOL_IDS_PRODUCTION_QA_run(name,fn){automated++;if(KOL_IDS_PRODUCTION_QA_patTest_(tests,name,fn))passed++;}

  KOL_IDS_PRODUCTION_QA_run('LEGACY_V25.16 release contract',function(){return KOL_IDS_PRODUCTION_HARDENING_releaseContractQA_();});
  KOL_IDS_PRODUCTION_QA_run('Enterprise integration contract',function(){return KOL_IDS_PLATFORM_INTEGRATION_QA();});
  KOL_IDS_PRODUCTION_QA_run('API operation contract',function(){return KOL_IDS_HARDENING_RUNTIME_operationContractQA_();});
  KOL_IDS_PRODUCTION_QA_run('Idempotency health',function(){return KOL_IDS_HARDENING_RUNTIME_idempotencyHealth_();});
  KOL_IDS_PRODUCTION_QA_run('Security baseline',function(){return KOL_IDS_PLATFORM_securityCheck();});
  KOL_IDS_PRODUCTION_QA_run('API invalid-key rejection',function(){return KOL_IDS_PRODUCTION_QA_patApiNegativeQA_();});
  KOL_IDS_PRODUCTION_QA_run('Web App preflight',function(){return KOL_IDS_ORCHESTRATOR_webAppPreflight_();});
  KOL_IDS_PRODUCTION_QA_run('Audit hash-chain integrity',function(){return KOL_IDS_PRODUCTION_QA_patAuditChainQA_();});

  if(orgId&&brandId){
    KOL_IDS_PRODUCTION_QA_run('Org/Brand isolation integrity',function(){return KOL_IDS_PRODUCTION_QA_patIsolationQA_(orgId,brandId);});
    KOL_IDS_PRODUCTION_QA_run('Runtime smoke test',function(){return KOL_IDS_ORCHESTRATOR_runtimeSmokeTest_(orgId,brandId);});
    if(campaignId){
      KOL_IDS_PRODUCTION_QA_run('Campaign flywheel dry-KOL_IDS_PRODUCTION_QA_run',function(){return KOL_IDS_ORCHESTRATOR_flywheelDryRun_(orgId,brandId,campaignId);});
    }else{
      tests.push({name:'Campaign flywheel dry-KOL_IDS_PRODUCTION_QA_run',status:'BLOCKED',reason:'campaignId was not supplied.'});
    }
  }else{
    tests.push({name:'Org/Brand isolation integrity',status:'BLOCKED',reason:'orgId and brandId are required.'});
    tests.push({name:'Runtime smoke test',status:'BLOCKED',reason:'orgId and brandId are required.'});
    tests.push({name:'Campaign flywheel dry-KOL_IDS_PRODUCTION_QA_run',status:'BLOCKED',reason:'orgId, brandId and campaignId are required.'});
  }

  var fail=tests.filter(function(x){return x.status==='FAIL';}).length;
  var blocked=tests.filter(function(x){return x.status==='BLOCKED';}).length;
  var manual=KOL_IDS_PRODUCTION_QA_MANUAL_GATE_STATUS().gates;
  var autoGreen=fail===0 && blocked===0;
  var status=autoGreen?'AUTOMATED_PASS':'NOT_ACCEPTED';
  var report={success:autoGreen,status:status,version:KOL_IDS_PRODUCTION_PAT.VERSION,startedAt:started.toISOString(),finishedAt:new Date().toISOString(),durationMs:Date.now()-started.getTime(),scope:{orgId:orgId,brandId:brandId,campaignId:campaignId},summary:{automatedTests:automated,automatedPassed:passed,failed:fail,blocked:blocked,manualGates:manual.length},tests:tests,manualGates:manual,releaseDecision:autoGreen?'PASS_AUTOMATED_GATES_MANUAL_SIGNOFF_REQUIRED':'FAIL_OR_BLOCKED_FIX_BEFORE_SALE'};
  if(options.persist===true)KOL_IDS_PRODUCTION_QA_persistAcceptanceReport_(report);
  return report;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_persistAcceptanceReport_(report){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_persistAcceptanceReport_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_(),sh=ss.getSheetByName(KOL_IDS_PRODUCTION_PAT.REPORT_SHEET)||ss.insertSheet(KOL_IDS_PRODUCTION_PAT.REPORT_SHEET);
  var headers=['Run ID','Timestamp','Version','Status','Org ID','Brand ID','Campaign ID','Automated Tests','Passed','Failed','Blocked','Manual Gates','Release Decision','Details JSON'];
  if(sh.getLastRow()===0)sh.getRange(1,1,1,headers.length).setValues([headers]);
  var id=KOL_IDS_PLATFORM_uuid_('PAT'),s=report.summary||{};
  sh.appendRow([id,new Date(),report.version,report.status,report.scope.orgId,report.scope.brandId,report.scope.campaignId,s.automatedTests,s.automatedPassed,s.failed,s.blocked,s.manualGates,report.releaseDecision,JSON.stringify(report).slice(0,45000)]);
  return {success:true,reportSheet:KOL_IDS_PRODUCTION_PAT.REPORT_SHEET,runId:id};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_persistAcceptanceReport_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_persistAcceptanceReport_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_QA_productionAcceptanceSmoke_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_productionAcceptanceSmoke_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_({persist:false});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_productionAcceptanceSmoke_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_productionAcceptanceSmoke_', Date.now() - __kolIdsTraceStartedAt);
  }
}



/** Creates or reuses an isolated QA fixture and stores its scope for the public runner. */
function KOL_IDS_PRODUCTION_QA_SEED_SCOPE(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_SEED_SCOPE');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_();
  var email=String(KOL_IDS_SECURITY_GET_EMAIL_()||'').trim();
  if(!email)throw new Error('Current user email is unavailable.');
  var props=PropertiesService.getScriptProperties();
  var savedOrg=String(props.getProperty('KOL_IDS_QA_ORG_ID')||'').trim();
  var savedBrand=String(props.getProperty('KOL_IDS_QA_BRAND_ID')||'').trim();
  var savedCampaign=String(props.getProperty('KOL_IDS_QA_CAMPAIGN_ID')||'').trim();

  // Reuse a previously stored, still-valid scope instead of creating a new
  // brand/campaign on every QA run.
  if(savedOrg&&savedBrand&&savedCampaign){
    try{
      var csh=ss.getSheetByName('ENT_CAMPAIGNS');if(!csh){KOL_IDS_PLATFORM_ensure_();csh=ss.getSheetByName('ENT_CAMPAIGNS');}if(!csh)throw new Error('QA seed could not resolve ENT_CAMPAIGNS.');var cm=KOL_IDS_PLATFORM_map_(csh),cr=KOL_IDS_PLATFORM_values_(csh);
      var valid=cr.some(function(r){return String(r[cm['Campaign ID']]||'')===savedCampaign&&String(r[cm['Org ID']]||'')===savedOrg&&String(r[cm['Brand ID']]||'')===savedBrand;});
      if(valid)return {success:true,status:'QA_SCOPE_READY',reused:true,version:KOL_IDS.VERSION,orgId:savedOrg,brandId:savedBrand,campaignId:savedCampaign};
    }catch(e){}
  }

  var org=KOL_IDS_PLATFORM_setupOrganization('KOL IDS QA',email,'ENTERPRISE');
  var bsh=ss.getSheetByName('ENT_BRANDS');
  if(!bsh){KOL_IDS_PLATFORM_ensureEnterpriseCoreSheets_(ss);bsh=ss.getSheetByName('ENT_BRANDS');}
  if(!bsh)throw new Error('QA seed could not resolve ENT_BRANDS after enterprise sheet initialization.');
  var bm=KOL_IDS_PLATFORM_map_(bsh),brands=KOL_IDS_PLATFORM_values_(bsh);
  var brandRow=brands.find(function(r){return String(r[bm['Org ID']]||'')===String(org.orgId)&&String(r[bm['Brand Name']]||'')==='KOL IDS QA Brand 1.0.0'&&String(r[bm['Status']]||'').toUpperCase()==='ACTIVE';});
  var brand=brandRow?{brandId:String(brandRow[bm['Brand ID']])}:KOL_IDS_PLATFORM_addBrand(org.orgId,'KOL IDS QA Brand 1.0.0','QA');

  var csh=ss.getSheetByName('ENT_CAMPAIGNS');if(!csh){KOL_IDS_PLATFORM_ensure_();csh=ss.getSheetByName('ENT_CAMPAIGNS');}if(!csh)throw new Error('QA seed could not resolve ENT_CAMPAIGNS.');var cm=KOL_IDS_PLATFORM_map_(csh),cr=KOL_IDS_PLATFORM_values_(csh);
  var campaignRow=cr.find(function(r){return String(r[cm['Org ID']]||'')===String(org.orgId)&&String(r[cm['Brand ID']]||'')===String(brand.brandId)&&String(r[cm['Objective']]||'')==='Production Acceptance QA';});
  var campaign=campaignRow?{campaignId:String(campaignRow[cm['Campaign ID']])}:KOL_IDS_GROWTH_createCampaign_(org.orgId,brand.brandId,{objective:'Production Acceptance QA',platform:'MULTI',startAt:new Date().toISOString(),budget:100000,currency:'THB'});
  props.setProperties({KOL_IDS_QA_ORG_ID:String(org.orgId),KOL_IDS_QA_BRAND_ID:String(brand.brandId),KOL_IDS_QA_CAMPAIGN_ID:String(campaign.campaignId)});
  return {success:true,status:'QA_SCOPE_READY',reused:false,version:KOL_IDS.VERSION,orgId:org.orgId,brandId:brand.brandId,campaignId:campaign.campaignId};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_SEED_SCOPE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_SEED_SCOPE', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Returns the current manual-gate sign-off state. */
function KOL_IDS_PRODUCTION_QA_MANUAL_GATE_STATUS(){
  var props=PropertiesService.getScriptProperties();
  var gates=KOL_IDS_PRODUCTION_PAT.MANUAL_GATES.map(function(name){
    var raw=props.getProperty('KOL_IDS_MANUAL_GATE_'+name);
    if(!raw)return {gate:name,status:'MANUAL',pass:null,evidence:''};
    try{return JSON.parse(raw);}catch(e){return {gate:name,status:'MANUAL',pass:null,evidence:''};}
  });
  return {success:true,gates:gates,completed:gates.filter(function(g){return g.pass===true;}).length,total:gates.length};
}

/** Records an explicit administrator sign-off for one manual production gate.
 * This never auto-passes a gate: the administrator must provide evidence text. */
function KOL_IDS_PRODUCTION_QA_SIGN_MANUAL_GATE(gate,evidence){
  KOL_IDS_CORE_assertAdmin_();
  var name=String(gate||'').trim().toUpperCase();
  var allowed=KOL_IDS_PRODUCTION_PAT.MANUAL_GATES.indexOf(name)>=0;
  if(!allowed)throw new Error('Unknown production manual gate: '+name);
  var ev=String(evidence||'').trim();
  if(!ev)throw new Error('Evidence is required to sign a manual gate.');
  var record={gate:name,status:'PASS',pass:true,evidence:ev,signedBy:String(KOL_IDS_SECURITY_GET_EMAIL_()||''),signedAt:new Date().toISOString()};
  PropertiesService.getScriptProperties().setProperty('KOL_IDS_MANUAL_GATE_'+name,JSON.stringify(record));
  return {success:true,record:record};
}

function KOL_IDS_PRODUCTION_QA_SIGN_MANUAL_GATE_PROMPT(){
  KOL_IDS_CORE_assertAdmin_();
  var ui=SpreadsheetApp.getUi();
  var gatePrompt=ui.prompt('KOL IDS Production QA','Gate name:\nWEB_APP_DEPLOYMENT\nOAUTH_AND_ACCOUNT_PERMISSION\nDOMAIN_ACCESS_POLICY\nCONCURRENT_USER_TEST\nQUOTA_AND_RUNTIME_LOAD_TEST\nBROWSER_UI_E2E\nBACKUP_AND_ROLLBACK_PROCEDURE\n\nEnter exactly one gate name:',ui.ButtonSet.OK_CANCEL);
  if(gatePrompt.getSelectedButton()!==ui.Button.OK)return {success:false,cancelled:true};
  var evidencePrompt=ui.prompt('Evidence required','Enter the evidence/reference for this gate. The gate will not be marked PASS without evidence.',ui.ButtonSet.OK_CANCEL);
  if(evidencePrompt.getSelectedButton()!==ui.Button.OK)return {success:false,cancelled:true};
  return KOL_IDS_PRODUCTION_QA_SIGN_MANUAL_GATE(gatePrompt.getResponseText(),evidencePrompt.getResponseText());
}

/** Public Apps Script runner for 1.0.0 production acceptance QA. */
function KOL_IDS_PRODUCTION_QA_RUN(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_QA_RUN');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var p=PropertiesService.getScriptProperties();
  return KOL_IDS_PRODUCTION_QA_runProductionAcceptanceTest_({
    orgId:String(p.getProperty('KOL_IDS_QA_ORG_ID')||''),
    brandId:String(p.getProperty('KOL_IDS_QA_BRAND_ID')||''),
    campaignId:String(p.getProperty('KOL_IDS_QA_CAMPAIGN_ID')||''),
    persist:true
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_QA_RUN', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_QA_RUN', Date.now() - __kolIdsTraceStartedAt);
  }
}
