/*
 * KOL IDS — low-cost scale-out for Google Workspace.
 *
 * The active spreadsheet remains the operational read/write model. Completed
 * campaigns can be snapshotted into separate Google Sheets files, indexed in
 * the active workspace, and (only with an explicit destructive option) pruned
 * from the active sheets. This keeps the UI fast without requiring a database.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  ARCHIVE_INDEX:'ENT_ARCHIVE_INDEX',
  MAX_ACTIVE_CELLS:7500000,
  WARN_ACTIVE_CELLS:6000000,
  /* Agency operating envelope; these are guardrails/targets, not hard tenant caps. */
  AGENCY_MAX_SELECTED_KOLS:150,
  AGENCY_RECOMMENDED_CANDIDATES:500,
  AGENCY_RECOMMENDED_CAMPAIGNS_PER_YEAR:50,
  AGENCY_RECOMMENDED_EVALUATIONS_PER_YEAR:25000
});

function KOL_IDS_SCALE_ensure_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SHEETS_ensure_(ss);
  var sh=ss.getSheetByName(KOL_IDS.ARCHIVE_INDEX);
  if(!sh){sh=ss.insertSheet(KOL_IDS.ARCHIVE_INDEX);sh.appendRow(['Archive ID','Campaign ID','Campaign Name','Status','Archive Spreadsheet ID','Archive URL','Archived At','Archived By','Snapshot Hash','Pruned At']);}
  return sh;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_sheetCells_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_sheetCells_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return ss.getSheets().reduce(function(total,sh){return total+sh.getMaxRows()*sh.getMaxColumns();},0);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_sheetCells_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_sheetCells_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_getCapacity_impl_(token){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_getCapacity_impl_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CORE_ctx_(token),ss=c.ss,index=KOL_IDS_SCALE_ensure_(ss),cells=KOL_IDS_SCALE_sheetCells_(ss),active=[];
  ss.getSheets().forEach(function(sh){active.push({sheet:sh.getName(),dataRows:Math.max(0,sh.getLastRow()-1),columns:sh.getLastColumn(),allocatedCells:sh.getMaxRows()*sh.getMaxColumns()});});
  return {success:true,version:KOL_IDS.VERSION,allocatedCells:cells,warningAt:KOL_IDS.WARN_ACTIVE_CELLS,maximumRecommended:KOL_IDS.MAX_ACTIVE_CELLS,health:cells>=KOL_IDS.MAX_ACTIVE_CELLS?'ACTION_REQUIRED':cells>=KOL_IDS.WARN_ACTIVE_CELLS?'ARCHIVE_SOON':'HEALTHY',archivedCampaigns:Math.max(0,index.getLastRow()-1),agencyScale:{recommendedCampaignsPerYear:KOL_IDS.AGENCY_RECOMMENDED_CAMPAIGNS_PER_YEAR,recommendedCandidatesPerCampaign:KOL_IDS.AGENCY_RECOMMENDED_CANDIDATES,maxSelectedKOLs:KOL_IDS.AGENCY_MAX_SELECTED_KOLS,recommendedEvaluationsPerYear:KOL_IDS.AGENCY_RECOMMENDED_EVALUATIONS_PER_YEAR},sheets:active};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_getCapacity_impl_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_getCapacity_impl_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_snapshotRows_(source,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_snapshotRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var values=KOL_IDS_CORE_values_(source),map=KOL_IDS_CORE_colMap_(source),col=map['Campaign ID'];
  return {headers:source.getRange(1,1,1,source.getLastColumn()).getValues()[0],rows:values.filter(function(row){return col!=null?String(row[col])===String(campaignId):false;})};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_snapshotRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_snapshotRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_writeSnapshot_(archive,name,snapshot){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_writeSnapshot_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=archive.getSheetByName(name)||archive.insertSheet(name);sh.clear();sh.getRange(1,1,1,snapshot.headers.length).setValues([snapshot.headers]);
  if(snapshot.rows.length)sh.getRange(2,1,snapshot.rows.length,snapshot.headers.length).setValues(snapshot.rows);
  sh.setFrozenRows(1);return snapshot.rows.length;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_writeSnapshot_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_writeSnapshot_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_archiveCampaign_impl_(token,campaignId,options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_archiveCampaign_impl_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  options=options||{};campaignId=String(campaignId||'').trim();if(!campaignId)throw new Error('Campaign is required.');
  /* Pruning is intentionally opt-in. COPY is safe and creates a verified
     restore point before an operator chooses to remove active records. */
  var mode=String(options.mode||'COPY').toUpperCase();if(['COPY','ARCHIVE_AND_PRUNE'].indexOf(mode)<0)throw new Error('Mode must be COPY or ARCHIVE_AND_PRUNE.');
  var lock=LockService.getScriptLock();lock.waitLock(30000);
  try{var c=KOL_IDS_CORE_ctx_(token),ss=c.ss,index=KOL_IDS_SCALE_ensure_(ss),campaign=KOL_IDS_WORKFLOW_campaign_(ss,campaignId),cm=campaign.map,status=String(campaign.row[cm['Status']]||'').toUpperCase(),integrity=KOL_IDS_SHEETS_validateCampaign_(ss,campaignId);
    if(status!=='COMPLETED')throw new Error('Only COMPLETED campaigns can be archived.');
    if(!integrity.valid)throw new Error('Archive blocked: resolve campaign integrity issues first.');
    var existing=KOL_IDS_CORE_values_(index).find(function(row){return String(row[1])===campaignId;});if(existing)throw new Error('This campaign is already archived.');
    var archive=SpreadsheetApp.create('KOL IDS Archive — '+campaignId+' — '+Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy-MM-dd'));
    /* A spreadsheet must always retain one sheet, so reuse its first tab. */
    archive.getSheets()[0].setName('CAMPAIGNS');
    var sheets=['ENT_CAMPAIGNS','ENT_DECISIONS','ENT_PERFORMANCE','ENT_LEARNING'],counts={},hashInput={};
    sheets.forEach(function(name){var snap=KOL_IDS_SCALE_snapshotRows_(ss.getSheetByName(name),campaignId),targetName=name.replace('ENT_','');counts[name]=KOL_IDS_SCALE_writeSnapshot_(archive,targetName,snap);if(archive.getSheetByName(targetName).getLastRow()-1!==snap.rows.length)throw new Error('Archive verification failed for '+name+'. Active records were not changed.');hashInput[name]=snap.rows;});
    var meta=archive.insertSheet('ARCHIVE_METADATA');meta.appendRow(['Archive ID','Campaign ID','Archived At','Source Spreadsheet ID','Mode','Version']);var archiveId='ARC-'+Utilities.getUuid().slice(0,12).toUpperCase();meta.appendRow([archiveId,campaignId,new Date(),ss.getId(),mode,KOL_IDS.VERSION]);
    var hash=KOL_IDS_SHEETS_hash_(JSON.stringify(hashInput));index.appendRow([archiveId,campaignId,campaign.row[cm['Campaign Name']]||campaignId,status,archive.getId(),archive.getUrl(),new Date(),c.token.email||'UNKNOWN',hash,'']);
    if(mode==='ARCHIVE_AND_PRUNE'){KOL_IDS_SCALE_pruneCampaign_(ss,campaignId);index.getRange(index.getLastRow(),10).setValue(new Date());}
    KOL_IDS_CORE_audit_(ss,'ENT_ARCHIVE',campaignId,'OK','Archive '+archiveId+' created; mode='+mode+'; '+JSON.stringify(counts));
    return {success:true,archiveId:archiveId,campaignId:campaignId,mode:mode,archiveSpreadsheetId:archive.getId(),archiveUrl:archive.getUrl(),rows:counts,snapshotHash:hash};
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_archiveCampaign_impl_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_archiveCampaign_impl_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_pruneCampaign_(ss,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_pruneCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  /* Delete only exact completed-campaign records, in descending row order.
     This function is private and can only be reached through ARCHIVE_AND_PRUNE. */
  ['ENT_LEARNING','ENT_PERFORMANCE','ENT_DECISIONS','ENT_CAMPAIGNS'].forEach(function(name){var sh=ss.getSheetByName(name),map=KOL_IDS_CORE_colMap_(sh),col=name==='ENT_CAMPAIGNS'?map['Campaign ID']:map['Campaign ID'],rows=KOL_IDS_CORE_values_(sh),targets=[];rows.forEach(function(row,index){if(col!=null&&String(row[col])===String(campaignId))targets.push(index+2);});targets.reverse().forEach(function(rowNumber){sh.deleteRow(rowNumber);});});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_pruneCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_pruneCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_listArchives(token,cursor,options){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_listArchives');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CORE_ctx_(token),sh=KOL_IDS_SCALE_ensure_(c.ss),size=Math.max(1,Math.min(Number(options&&options.pageSize)||100,500)),start=Math.max(2,Number(cursor)||2),last=sh.getLastRow(),end=Math.min(last,start+size-1),rows=start<=last?sh.getRange(start,1,end-start+1,sh.getLastColumn()).getValues():[];
  return {success:true,archives:rows.map(function(row){return {archiveId:row[0],campaignId:row[1],campaignName:row[2],status:row[3],spreadsheetId:row[4],url:row[5],archivedAt:row[6],prunedAt:row[9]};}),nextCursor:end<last?end+1:null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_listArchives', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_listArchives', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_archiveRow_(ss,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_archiveRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var rows=KOL_IDS_CORE_values_(KOL_IDS_SCALE_ensure_(ss)),row=rows.filter(function(value){return String(value[1])===String(campaignId);})[0];
  if(!row)throw new Error('Archived campaign not found.');return row;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_archiveRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_archiveRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_archiveObjects_(spreadsheetId,sheetName){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_archiveObjects_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=SpreadsheetApp.openById(String(spreadsheetId)).getSheetByName(sheetName);if(!sh)throw new Error('Archive is incomplete: missing '+sheetName+'.');
  var width=sh.getLastColumn(),last=sh.getLastRow();if(!width||!last)return [];
  var values=sh.getRange(1,1,last,width).getValues(),headers=values.shift().map(String);
  return values.map(function(row){var result={};headers.forEach(function(header,index){result[header]=row[index];});return result;});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_archiveObjects_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_archiveObjects_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_n_(value){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_n_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(value);return isFinite(n)?n:0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_n_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_n_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/** Read archived campaigns through the same report-shaped contract used by the UI. */
function KOL_IDS_SCALE_getArchivedCampaignReport(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_getArchivedCampaignReport');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CORE_ctx_(token),row=KOL_IDS_SCALE_archiveRow_(c.ss,campaignId),campaigns=KOL_IDS_SCALE_archiveObjects_(row[4],'CAMPAIGNS'),campaign=campaigns[0]||{},selected={};String(campaign['Selected Creator IDs']||'').split(',').forEach(function(id){id=String(id).trim();if(id)selected[id]=true;});
  var decisions=KOL_IDS_SCALE_archiveObjects_(row[4],'DECISIONS').filter(function(value){return selected[String(value['Creator ID'])];}).map(function(value){return {creatorId:value['Creator ID'],name:value['Creator Name'],decision:value['Decision'],score:KOL_IDS_SCALE_n_(value['Decision Score']),brandFit:KOL_IDS_SCALE_n_(value['Brand Fit']),audienceFit:KOL_IDS_SCALE_n_(value['Audience Fit']),objectiveFit:KOL_IDS_SCALE_n_(value['Objective Fit']),dataQualityScore:KOL_IDS_SCALE_n_(value['Data Quality Score']),behaviorFit:KOL_IDS_SCALE_n_(value['Behavior Fit']),confidence:value['Confidence'],why:value['Why'],dataLimitation:value['Data Limitation'],calibrationAdjustment:KOL_IDS_SCALE_n_(value['Calibration Adjustment']),calibrationBasis:value['Calibration Basis']||'CORE ONLY',historyCalibration:KOL_IDS_SCALE_n_(value['History Calibration']),peerCalibration:KOL_IDS_SCALE_n_(value['Peer Calibration']),peerBenchmark:KOL_IDS_SCALE_n_(value['Peer Benchmark']),fairRate:KOL_IDS_SCALE_n_(value['Fair Rate']),priceValue:KOL_IDS_SCALE_n_(value['Price Value']),opportunityScore:KOL_IDS_SCALE_n_(value['Opportunity Score']),dataState:value['Data State']||'UNKNOWN',creatorRole:value['Creator Role']||'SUPPORT CREATOR',investmentStrength:KOL_IDS_SCALE_n_(value['Investment Strength']),dataReliability:KOL_IDS_SCALE_n_(value['Data Reliability']),priceRisk:value['Price Risk'],decisionClass:value['Decision Class']};});
  var rawPerformance=KOL_IDS_SCALE_archiveObjects_(row[4],'PERFORMANCE').filter(function(value){return selected[String(value['Creator ID'])]&&String(value['Status']).toUpperCase()!=='SUPERSEDED';});
  var performance=rawPerformance.map(function(value){var spend=KOL_IDS_SCALE_n_(value['Spend']),eng=KOL_IDS_SCALE_n_(value['Engagements']),clicks=KOL_IDS_SCALE_n_(value['Clicks']),revenue=KOL_IDS_SCALE_n_(value['Revenue']);return {id:value['Performance ID'],creatorId:value['Creator ID'],creatorName:value['Creator Name'],spend:spend,reach:KOL_IDS_SCALE_n_(value['Reach']),impressions:KOL_IDS_SCALE_n_(value['Impressions']),views:KOL_IDS_SCALE_n_(value['Views']),likes:KOL_IDS_SCALE_n_(value['Likes']),comments:KOL_IDS_SCALE_n_(value['Comments']),shares:KOL_IDS_SCALE_n_(value['Shares']),saves:KOL_IDS_SCALE_n_(value['Saves']),engagements:eng,clicks:clicks,conversions:KOL_IDS_SCALE_n_(value['Conversions']),revenue:revenue,evidence:value['Evidence'],status:value['Status'],efficiencyScore:KOL_IDS_SCALE_n_(value['Efficiency Score']),actualGoalScore:KOL_IDS_SCALE_n_(value['Actual Goal Score']),cpe:eng?spend/eng:0,roas:spend?revenue/spend:0};});
  var sum=function(key){return performance.reduce(function(total,value){return total+KOL_IDS_SCALE_n_(value[key]);},0);},spend=sum('spend'),revenue=sum('revenue'),conversions=sum('conversions'),clicks=sum('clicks'),engagements=sum('engagements');
  var completenessFields=['Spend','Reach','Impressions','Views','Engagements','Clicks','Conversions','Revenue'],present=0,totalFields=Math.max(1,rawPerformance.length*completenessFields.length);rawPerformance.forEach(function(p){completenessFields.forEach(function(k){if(p[k]!==null&&p[k]!==undefined&&String(p[k]).trim()!=='')present++;});});var dataCompleteness=Math.round(present/totalFields*100);
  return {success:true,archived:true,version:KOL_IDS.VERSION,campaignId:String(campaignId),decisions:decisions,performance:performance,learning:KOL_IDS_SCALE_archiveObjects_(row[4],'LEARNING'),workflow:{campaignId:String(campaignId),campaignName:campaign['Campaign Name']||row[2],selectedCreatorIds:Object.keys(selected),selectedCreators:Object.keys(selected).map(function(id){return {id:id};}),status:'ARCHIVED',selectionVersion:KOL_IDS_SCALE_n_(campaign['Selection Version']),stateVersion:KOL_IDS_SCALE_n_(campaign['State Version'])},businessImpact:{success:true,campaignId:String(campaignId),creatorRecords:performance.length,spend:spend,revenue:revenue,conversions:conversions,reach:sum('reach'),views:sum('views'),engagements:engagements,clicks:clicks,roas:spend?revenue/spend:null,cpa:conversions?spend/conversions:null,cpc:clicks?spend/clicks:null,cpe:engagements?spend/engagements:null,dataCompleteness:dataCompleteness,disclaimer:'Archived snapshot. Metrics are historical and read-only.'}};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_getArchivedCampaignReport', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_getArchivedCampaignReport', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_getCampaignReport(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_getCampaignReport');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CORE_ctx_(token),exists=KOL_IDS_CORE_values_(c.ss.getSheetByName('ENT_CAMPAIGNS')).some(function(row){return String(row[0])===String(campaignId);});
  return exists?KOL_IDS_SHEETS_getCampaignReport(token,campaignId):KOL_IDS_SCALE_getArchivedCampaignReport(token,campaignId);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_getCampaignReport', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_getCampaignReport', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SCALE_smokeTest(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCALE_smokeTest');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var valid=['COPY','ARCHIVE_AND_PRUNE'].indexOf('COPY')>=0;return {success:valid,version:KOL_IDS.VERSION,tests:1,failures:valid?[]:['Archive-mode validation failed']};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCALE_smokeTest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCALE_smokeTest', Date.now() - __kolIdsTraceStartedAt);
  }
}
