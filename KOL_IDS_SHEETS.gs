/*
 * KOL IDS — Google Sheets Enterprise Resilience Layer
 *
 * Google Sheets remains the operational store, so the emphasis is on
 * deterministic state, reconciliation, bounded reads, command traceability,
 * and recovery—not on pretending Sheets is a limitless database.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  COMMANDS: 'ENT_COMMAND_LEDGER',
  INCIDENTS: 'ENT_DATA_INCIDENTS',
  MAX_HISTORY_PAGE: 500
});

function KOL_IDS_SHEETS_ensure_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var commands=ss.getSheetByName(KOL_IDS.COMMANDS);
  if(!commands){commands=ss.insertSheet(KOL_IDS.COMMANDS);commands.appendRow(['Command ID','Operation','Campaign ID','Actor','Request Hash','Status','Result JSON','Created At','Completed At']);}
  var incidents=ss.getSheetByName(KOL_IDS.INCIDENTS);
  if(!incidents){incidents=ss.insertSheet(KOL_IDS.INCIDENTS);incidents.appendRow(['Incident ID','Campaign ID','Severity','Code','Message','Detected At','Resolved At','Resolution']);}
  KOL_IDS_WORKFLOW_ensure_(ss);
  KOL_IDS_WORKFLOW_headers_(ss, 'ENT_CAMPAIGNS', ['Decision Version','Decision Input Hash','Decision Updated At','Invalidated At','Invalidated Reason']);
  return {commands:commands,incidents:incidents};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_number_(value){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_number_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(value===''||value===null||value===undefined)return '';
  var n=Number(String(value).replace(/,/g,''));if(!isFinite(n)||n<0)throw new Error('Performance metrics must be non-negative numbers.');return n;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_number_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_number_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_writeDecision_(sheet,row,index,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_writeDecision_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var map=KOL_IDS_CORE_colMap_(sheet);Object.keys(data).forEach(function(key){if(map[key]!=null)row[map[key]]=data[key];});
  if(index==null)sheet.appendRow(KOL_IDS_CORE_setByHeader_(sheet,data));else KOL_IDS_WORKFLOW_put_(sheet,index,row);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_writeDecision_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_writeDecision_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/** Re-runs decision scoring against an existing campaign instead of creating an orphaned campaign.
 * Existing decision IDs and selection are retained when still valid; downstream state is refreshed.
 */
function KOL_IDS_SHEETS_reanalyzeCampaign(token,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_reanalyzeCampaign');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{};var campaignId=String(payload.campaignId||'').trim();if(!campaignId)throw new Error('Campaign is required for re-analysis.');
  var lock=LockService.getScriptLock();lock.waitLock(30000);
  try{var c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_SHEETS_ensure_(ss);
    return KOL_IDS_SHEETS_command_(ss,c.token.email||'UNKNOWN','REANALYZE_CAMPAIGN',campaignId,payload,function(){
      var goal=String(payload.goal||payload.objective||'').trim().toUpperCase(),allowed=['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'];
      if(allowed.indexOf(goal)<0)throw new Error('Choose a supported Campaign Goal.');
      var persona=KOL_IDS_CORE_resolveRowByIdOrName_(ss.getSheetByName('ENT_PERSONAS'),payload.personaId,1),brand=KOL_IDS_CORE_resolveRowByIdOrName_(ss.getSheetByName('ENT_BRANDS'),payload.brandId,1);
      if(!persona||!brand)throw new Error('A valid Brand and Persona are required.');
      var creators=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CREATORS'));if(!creators.length)throw new Error('Add at least one Creator before re-analysis.');
      var campaign=KOL_IDS_WORKFLOW_campaign_(ss,campaignId),m=campaign.map,profile=KOL_IDS_CORE_goalProfile_(goal),now=new Date(),decisionSh=KOL_IDS_CORE_ensureColumns_(ss,'ENT_DECISIONS',['Campaign ID','Creator ID','Creator Name','Decision','Decision Score','Persona Fit','Audience Fit','Behavior Fit','Content Fit','Objective Fit','Brand Fit','Confidence','Confidence Score','Content Recommendation','Evidence','Data Limitation','Created At']);
      var dm=KOL_IDS_CORE_colMap_(decisionSh),old=KOL_IDS_CORE_values_(decisionSh),version=Number(campaign.row[m['Decision Version']]||0)+1;
      var results=creators.map(function(row){var x=KOL_IDS_CORE_scoreCreator_(persona,brand,row,goal,ss);x.campaignId=campaignId;return x;}).sort(function(a,b){return b.score-a.score;});
      var existingByCreator={};
      old.forEach(function(row,i){
        var cid=String(row[dm['Campaign ID']]||''), kid=String(row[dm['Creator ID']]||'');
        if(cid!==campaignId||!kid)return;
        var candidate={row:row,index:i};
        var prev=existingByCreator[kid];
        if(!prev || new Date(row[dm['Created At']]||0).getTime()>new Date(prev.row[dm['Created At']]||0).getTime()) existingByCreator[kid]=candidate;
      });
      results.forEach(function(x){var existing=existingByCreator[String(x.creatorId)]||null;var data={'Decision ID':existing&&dm['Decision ID']!=null?existing.row[dm['Decision ID']]:x.decisionId,'Campaign ID':campaignId,'Creator ID':x.creatorId,'Creator Name':x.name,'Decision':x.decision,'Decision Score':x.score,'Persona Fit':x.personaFit,'Audience Fit':x.audienceFit,'Behavior Fit':x.behaviorFit,'Content Fit':x.contentFit,'Objective Fit':x.objectiveFit,'Brand Fit':x.brandFit,'Confidence':x.confidence,'Confidence Score':x.confidenceScore,'Why':x.why,'Data Limitation':x.dataLimitation,'Content Recommendation':JSON.stringify(x.contentRecommendation||[]),'Evidence':x.evidence,'Efficiency Score':x.efficiencyScore,'Commercial Efficiency':x.commercialEfficiency,'ER Value':x.erValue,'ER Source':x.erSource,'Rate Value':x.rateValue,'Rate Source':x.rateSource,'Learning Adjustment':x.learningAdjustment,'Campaign Goal':x.campaignGoal,'Goal Profile':x.goalProfile,'Decision Tier':x.decisionTier,'Preference Status':x.preferenceStatus,'Brand Fit Gap':x.brandFitGap,'Recovery Strategy':JSON.stringify(x.recoveryStrategy),'Calibration Adjustment':x.calibrationAdjustment,'Calibration Basis':x.calibrationBasis,'History Calibration':x.historyCalibration,'Peer Calibration':x.peerCalibration,'Peer Benchmark':JSON.stringify(x.peerBenchmark||null),'Fair Rate':x.fairRate,'Price Value':x.priceValue,'Opportunity Score':x.opportunityScore,'Data State':x.dataState,'Creator Role':x.creatorRole,'Investment Strength':x.investmentStrength,'Data Reliability':x.dataReliability,'Price Risk':x.priceRisk,'Decision Class':x.decisionClass,'Created At':now};KOL_IDS_SHEETS_writeDecision_(decisionSh,existing?existing.row:null,existing?existing.index:null,data);});
      var selected=KOL_IDS_WORKFLOW_stringIds_(KOL_IDS_CORE_getSelectedCreators_(ss,campaignId)),creatorIds={};creators.forEach(function(row){creatorIds[String(row[0])]=true;});var retained=selected.filter(function(id){return creatorIds[id];});
      campaign.row[m['Campaign Name']]=KOL_IDS_CORE_req_(payload.campaignName,'Campaign Name');campaign.row[m['Brand ID']]=brand[0];campaign.row[m['Persona ID']]=persona[0];campaign.row[m['Objective']]=goal;campaign.row[m['Campaign Goal']]=goal;campaign.row[m['Success Metric']]=String(payload.successMetric||profile.primary);campaign.row[m['Goal Profile']]=profile.label;campaign.row[m['Budget']]=KOL_IDS_CORE_numOrBlank_(payload.budget);campaign.row[m['Currency']]=payload.currency||'THB';campaign.row[m['Start Date']]=payload.startDate||'';campaign.row[m['End Date']]=payload.endDate||'';campaign.row[m['Duration Days']]=payload.durationDays||'';campaign.row[m['Selected Creator IDs']]=retained.join(',');campaign.row[m['Decision Version']]=version;campaign.row[m['Decision Input Hash']]=KOL_IDS_SHEETS_hash_(JSON.stringify(payload));campaign.row[m['Decision Updated At']]=now;campaign.row[m['Invalidated At']]=now;campaign.row[m['Invalidated Reason']]='Decision inputs changed; downstream read models refreshed.';campaign.row[m['State Version']]=Number(campaign.row[m['State Version']]||1)+1;campaign.row[m['Workflow Version']]=Number(campaign.row[m['Workflow Version']]||1)+1;campaign.row[m['Updated At']]=now;KOL_IDS_WORKFLOW_put_(campaign.sh,campaign.index,campaign.row);
      KOL_IDS_WORKFLOW_syncPerformance_(ss,campaignId,retained,now);KOL_IDS_CORE_audit_(ss,'V21_REANALYZE',campaignId,'OK','Decision v'+version+' recalculated; '+retained.length+' selected creators retained.');
      return {success:true,campaignId:campaignId,rows:results,retainedCreatorIds:retained,decisionVersion:version,workflow:KOL_IDS_WORKFLOW_getWorkflow(token,campaignId)};
    });
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_reanalyzeCampaign', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_reanalyzeCampaign', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_getWorkflow(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_getWorkflow');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_WORKFLOW_getWorkflow(token,campaignId);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_getWorkflow', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_getWorkflow', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_getCampaignReport(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_getCampaignReport');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_WORKFLOW_getCampaignReport(token,campaignId);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_getCampaignReport', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_getCampaignReport', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_savePerformanceBatch(token,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_savePerformanceBatch');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{};if(!Array.isArray(payload.records)||!payload.records.length)throw new Error('Enter at least one performance record.');
  var ids={},clean=[];payload.records.forEach(function(record){record=record||{};var id=String(record.creatorId||'').trim();if(!id||ids[id])throw new Error('Each selected Creator may appear only once per save.');ids[id]=true;var row={creatorId:id};['spend','reach','impressions','views','likes','comments','shares','saves','engagements','clicks','conversions','revenue'].forEach(function(key){row[key]=KOL_IDS_SHEETS_number_(record[key]);});row.evidence=['VERIFIED','SELF-REPORTED','LIMITED'].indexOf(String(record.evidence||'LIMITED'))>=0?String(record.evidence||'LIMITED'):'LIMITED';row.notes=String(record.notes||'').slice(0,5000);row.reportedDate=record.reportedDate||new Date();clean.push(row);});
  payload.records=clean;return KOL_IDS_WORKFLOW_savePerformanceBatch(token,payload);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_savePerformanceBatch', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_savePerformanceBatch', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_hash_(value){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_WORKFLOW_hash_(value);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_addIncident_(ss,campaignId,severity,code,message){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_addIncident_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_SHEETS_ensure_(ss).incidents;
  sh.appendRow(['INC-'+Utilities.getUuid().slice(0,12).toUpperCase(),campaignId,severity,code,String(message||''),new Date(),'','']);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_addIncident_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_addIncident_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_command_(ss,actor,operation,campaignId,request,work){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_command_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var env=KOL_IDS_SHEETS_ensure_(ss),hash=KOL_IDS_SHEETS_hash_(JSON.stringify(request||{}));
  var rows=KOL_IDS_CORE_values_(env.commands),existing=rows.find(function(r){return String(r[1])===operation&&String(r[2])===String(campaignId)&&String(r[3])===String(actor)&&String(r[4])===hash&&String(r[5])==='COMPLETED';});
  if(existing){var replay=JSON.parse(String(existing[6]||'{}'));replay.idempotentReplay=true;return replay;}
  var commandId='CMD-'+Utilities.getUuid().slice(0,12).toUpperCase(),row=env.commands.getLastRow()+1;
  env.commands.appendRow([commandId,operation,campaignId,actor,hash,'STARTED','',new Date(),'']);
  try{
    var result=work();
    env.commands.getRange(row,6,1,4).setValues([['COMPLETED',JSON.stringify(result),env.commands.getRange(row,8).getValue(),new Date()]]);
    result.commandId=commandId;return result;
  }catch(error){
    env.commands.getRange(row,6,1,4).setValues([['FAILED',JSON.stringify({message:String(error&&error.message||error)}),env.commands.getRange(row,8).getValue(),new Date()]]);
    throw error;
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_command_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_command_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_validateCampaign_(ss,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_validateCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var campaign=KOL_IDS_WORKFLOW_campaign_(ss,campaignId),m=campaign.map,selected=KOL_IDS_CORE_getSelectedCreators_(ss,campaignId),unique=KOL_IDS_WORKFLOW_stringIds_(selected);
  var decisions=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_DECISIONS')),decisionIds={};decisions.forEach(function(row){if(String(row[1])===String(campaignId))decisionIds[String(row[2])]=true;});
  var creators=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CREATORS')),creatorIds={};creators.forEach(function(row){creatorIds[String(row[0])]=true;});
  var issues=[];
  if(!unique.length)issues.push({severity:'HIGH',code:'EMPTY_SELECTION',message:'Campaign has no selected Creator.'});
  if(unique.length!==selected.length)issues.push({severity:'MEDIUM',code:'DUPLICATE_SELECTION',message:'Duplicate Creator IDs detected in selection.'});
  unique.forEach(function(id){if(!creatorIds[id])issues.push({severity:'HIGH',code:'MISSING_CREATOR',message:'Selected Creator '+id+' does not exist.'});else if(!decisionIds[id])issues.push({severity:'HIGH',code:'MISSING_DECISION',message:'Selected Creator '+id+' has no Decision row.'});});
  return {campaign:campaign,selected:unique,issues:issues,valid:issues.filter(function(i){return i.severity==='HIGH';}).length===0};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_validateCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_validateCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/** Rebuilds downstream tracking rows from canonical selected IDs, without deleting history. */
function KOL_IDS_SHEETS_reconcileCampaign(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_reconcileCampaign');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock();lock.waitLock(30000);
  try{var c=KOL_IDS_CORE_ctx_(token),ss=c.ss,actor=c.token.email||'UNKNOWN';
    var current=KOL_IDS_WORKFLOW_campaign_(ss,campaignId),currentMap=current.map;
    return KOL_IDS_SHEETS_command_(ss,actor,'RECONCILE_CAMPAIGN',campaignId,{campaignId:campaignId,stateVersion:Number(current.row[currentMap['State Version']]||1),selectionVersion:Number(current.row[currentMap['Selection Version']]||0)},function(){
      var check=KOL_IDS_SHEETS_validateCampaign_(ss,campaignId),campaign=check.campaign,m=campaign.map;
      check.issues.forEach(function(issue){KOL_IDS_SHEETS_addIncident_(ss,campaignId,issue.severity,issue.code,issue.message);});
      if(!check.valid)throw new Error('Campaign integrity check failed: '+check.issues.filter(function(i){return i.severity==='HIGH';}).map(function(i){return i.code;}).join(', '));
      campaign.row[m['Selected Creator IDs']]=check.selected.join(',');
      if(m['State Version']!=null)campaign.row[m['State Version']]=Number(campaign.row[m['State Version']]||1)+1;
      if(m['Updated At']!=null)campaign.row[m['Updated At']]=new Date();
      KOL_IDS_WORKFLOW_put_(campaign.sh,campaign.index,campaign.row);
      KOL_IDS_WORKFLOW_syncPerformance_(ss,campaignId,check.selected,new Date());
      KOL_IDS_CORE_audit_(ss,'V21_RECONCILE',campaignId,'OK','Canonical selection restored; '+check.selected.length+' Creator(s) tracked.');
      return {success:true,campaignId:String(campaignId),selectedCount:check.selected.length,issues:check.issues,workflow:KOL_IDS_WORKFLOW_getWorkflow(token,campaignId)};
    });
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_reconcileCampaign', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_reconcileCampaign', Date.now() - __kolIdsTraceStartedAt);
  }
}
/** The only selection mutation endpoint used by the V21 UI. */
function KOL_IDS_SHEETS_setSelection(token,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_setSelection');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{};var campaignId=String(payload.campaignId||'').trim();if(!campaignId)throw new Error('Campaign is required.');
  var result=KOL_IDS_WORKFLOW_setSelection(token,payload);
  var reconcile=KOL_IDS_SHEETS_reconcileCampaign(token,campaignId);
  result.reconciliation={selectedCount:reconcile.selectedCount,commandId:reconcile.commandId};return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_setSelection', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_setSelection', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_controlTower(token,cursor,options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_controlTower');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_SHEETS_ensure_(ss);
  var history=KOL_IDS_PRODUCTION_STREAM_LIST_CAMPAIGNS(token,cursor,{pageSize:Math.min(Number(options&&options.pageSize)||100,KOL_IDS.MAX_HISTORY_PAGE)});
  var incidents=KOL_IDS_CORE_values_(ss.getSheetByName(KOL_IDS.INCIDENTS)).filter(function(row){return !row[6];}).slice(-100).reverse().map(function(row){return {id:row[0],campaignId:row[1],severity:row[2],code:row[3],message:row[4],detectedAt:row[5]};});
  return {success:true,version:KOL_IDS.VERSION,campaigns:history.campaigns,nextCursor:history.nextCursor,openIncidents:incidents,checkedAt:new Date().toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_controlTower', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_controlTower', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SHEETS_smokeTest(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SHEETS_smokeTest');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var normalized=KOL_IDS_WORKFLOW_stringIds_(['A','A','','B']);
  return {success:JSON.stringify(normalized)==='["A","B"]',version:KOL_IDS.VERSION,tests:1,failures:JSON.stringify(normalized)==='["A","B"]'?[]:['Selection normalization failed']};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SHEETS_smokeTest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SHEETS_smokeTest', Date.now() - __kolIdsTraceStartedAt);
  }
}
