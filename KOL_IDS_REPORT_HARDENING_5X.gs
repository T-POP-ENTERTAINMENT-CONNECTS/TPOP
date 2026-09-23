/**
 * KOL IDS 1.1.0 — REPORT HARDENING 5X
 * Scope: report build, retrieval, integrity, recovery, dedupe and traceability.
 * This layer wraps the existing product report implementation without changing
 * the canonical decision engine.
 */

var KOL_IDS_REPORT_HARDENING_VERSION = '5X-REPORT-HARDENING-1.0';

function KOL_IDS_REPORT_H5_string_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_string_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return v === null || v === undefined ? '' : String(v).trim();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_string_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_string_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_REPORT_H5_headers_(headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var out = {};
  (headers || []).forEach(function(h,i){
    var k = KOL_IDS_REPORT_H5_string_(h);
    if(k && out[k] === undefined) out[k] = i;
  });
  return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_REPORT_H5_requiredHeaders_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_requiredHeaders_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return ['Analysis ID','Campaign ID','KOL ID','KOL Name','Decision','Confidence Score','Generated At'];

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_requiredHeaders_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_requiredHeaders_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_REPORT_H5_activeAnalysis_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_activeAnalysis_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    return KOL_IDS_REPORT_H5_string_(KOL_IDS_PRODUCT_getActiveAnalysisId_(KOL_IDS_PRODUCT_getSpreadsheet_()));
  } catch(e) { return ''; }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_activeAnalysis_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_activeAnalysis_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_REPORT_H5_snapshot_(sheet){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_snapshot_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!sheet || sheet.getLastRow() < 1) return null;
  var rows = Math.max(1, sheet.getLastRow());
  var cols = Math.max(1, sheet.getLastColumn());
  return {rows:rows, cols:cols, values:sheet.getRange(1,1,rows,cols).getValues()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_snapshot_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_snapshot_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_REPORT_H5_restore_(sheet,snapshot){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_restore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!sheet || !snapshot) return;
  var maxRows = sheet.getMaxRows();
  var maxCols = sheet.getMaxColumns();
  if(snapshot.rows > maxRows) sheet.insertRowsAfter(maxRows, snapshot.rows-maxRows);
  if(snapshot.cols > maxCols) sheet.insertColumnsAfter(maxCols, snapshot.cols-maxCols);
  var currentRows = Math.max(1, sheet.getLastRow());
  var currentCols = Math.max(1, sheet.getLastColumn());
  if(currentRows > 1) sheet.getRange(2,1,currentRows-1,currentCols).clearContent();
  sheet.getRange(1,1,snapshot.rows,snapshot.cols).setValues(snapshot.values);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_restore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_restore_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_REPORT_H5_validate_(ss, expectedAnalysisId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_validate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sheet = ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.REPORT);
  if(!sheet || sheet.getLastRow() < 2) {
    return {ok:true,count:0,duplicates:[],foreignRows:[],missingKeys:[],headers:sheet?sheet.getRange(1,1,1,Math.max(1,sheet.getLastColumn())).getValues()[0]:[]};
  }
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idx = KOL_IDS_REPORT_H5_headers_(headers);
  var missing = KOL_IDS_REPORT_H5_requiredHeaders_().filter(function(h){return idx[h]===undefined;});
  if(missing.length) return {ok:false,count:values.length-1,duplicates:[],foreignRows:[],missingKeys:missing,headers:headers};
  var seen={}, duplicates=[], foreignRows=[], missingKeys=[];
  values.slice(1).forEach(function(r,n){
    var rowNo=n+2, aid=KOL_IDS_REPORT_H5_string_(r[idx['Analysis ID']]), cid=KOL_IDS_REPORT_H5_string_(r[idx['Campaign ID']]), kid=KOL_IDS_REPORT_H5_string_(r[idx['KOL ID']]);
    if(!aid || !cid || !kid) missingKeys.push(rowNo);
    if(expectedAnalysisId && aid && aid!==expectedAnalysisId) foreignRows.push({row:rowNo,analysisId:aid});
    var key=aid+'|'+cid+'|'+kid;
    if(kid){ if(seen[key]) duplicates.push({row:rowNo,key:key,firstRow:seen[key]}); else seen[key]=rowNo; }
  });
  return {ok:missing.length===0 && !duplicates.length && !foreignRows.length && !missingKeys.length,count:values.length-1,duplicates:duplicates,foreignRows:foreignRows,missingKeys:missingKeys,headers:headers};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_validate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_validate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCT_BUILD_REPORT(context){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCT_BUILD_REPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock();
  if(!lock.tryLock(15000)) throw new Error('REPORT_BUILD_LOCK_TIMEOUT: another report build is in progress.');
  var ss=KOL_IDS_PRODUCT_getSpreadsheet_();
  var sheet=ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.REPORT);
  var snapshot=KOL_IDS_REPORT_H5_snapshot_(sheet);
  try {
    var ctx=context||{};
    var result=KOL_IDS_PRODUCT_BUILD_REPORT_LEGACY_(ctx);
    SpreadsheetApp.flush();
    var analysisId=KOL_IDS_REPORT_H5_string_(result&&result.analysisId)||KOL_IDS_REPORT_H5_activeAnalysis_();
    var check=KOL_IDS_REPORT_H5_validate_(ss,analysisId);
    var expected=Number(result&&result.decisionRows||0);
    if(expected>0 && check.count!==expected) throw new Error('REPORT_INTEGRITY_MISMATCH: expected '+expected+' rows, generated '+check.count+'.');
    if(!check.ok) throw new Error('REPORT_INTEGRITY_FAILED: missing='+check.missingKeys.length+', duplicates='+check.duplicates.length+', foreignRows='+check.foreignRows.length+'.');
    return Object.assign({},result,{reportHardening:KOL_IDS_REPORT_HARDENING_VERSION,integrity:check,atomic:true});
  } catch(e) {
    try { if(!sheet) sheet=ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.REPORT); KOL_IDS_REPORT_H5_restore_(sheet,snapshot); SpreadsheetApp.flush(); } catch(re){
      throw new Error('REPORT_BUILD_FAILED_AND_RECOVERY_FAILED: '+String(e&&e.message||e)+' | recovery='+String(re&&re.message||re));
    }
    throw e;
  } finally { try{lock.releaseLock();}catch(ignore){} }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCT_BUILD_REPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCT_BUILD_REPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Canonical performance-report compatibility endpoint.
 * The current report hardening engine owns report construction; this
 * explicit public function keeps the strict production contract stable
 * without creating a second report authority.
 */
function KOL_IDS_PRODUCT_BUILD_PERFORMANCE_REPORT(context){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCT_BUILD_PERFORMANCE_REPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    if (typeof KOL_IDS_PRODUCT_BUILD_REPORT !== 'function') {
      throw new Error('REPORT_BUILD_AUTHORITY_MISSING');
    }
    return KOL_IDS_PRODUCT_BUILD_REPORT(context || {});
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCT_BUILD_PERFORMANCE_REPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCT_BUILD_PERFORMANCE_REPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCT_UI_GET_REPORT(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCT_UI_GET_REPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) throw new Error('REPORT_READ_LOCK_TIMEOUT: report is being updated.');
  try {
    var ss=KOL_IDS_PRODUCT_getSpreadsheet_();
    var raw=KOL_IDS_PRODUCT_UI_GET_REPORT_LEGACY_();
    var headers=raw.headers||[];
    var idx=KOL_IDS_REPORT_H5_headers_(headers);
    var active=KOL_IDS_REPORT_H5_activeAnalysis_();
    var rows=raw.rows||[];
    var scoped=rows;
    var hasAnalysis=idx['Analysis ID']!==undefined;
    if(active && hasAnalysis){
      var matching=rows.filter(function(r){return KOL_IDS_REPORT_H5_string_(r[idx['Analysis ID']])===active;});
      if(matching.length || rows.length===0) scoped=matching;
      else throw new Error('REPORT_CONTEXT_MISMATCH: active Analysis ID '+active+' is not represented in 14_CREATOR_REPORT.');
    }
    var check=KOL_IDS_REPORT_H5_validate_(ss,active);
    if(!check.ok) throw new Error('REPORT_INTEGRITY_FAILED: missing='+check.missingKeys.length+', duplicates='+check.duplicates.length+', foreignRows='+check.foreignRows.length+'.');
    var perf = (typeof KOL_IDS_PERF_AUTHORITY_READ === 'function') ?
      KOL_IDS_PERF_AUTHORITY_READ({analysisId:active,maxRows:1000}) :
      {headers:[],rows:[],summary:{},source:'09_PERFORMANCE'};
    var intelligence = (typeof KOL_IDS_INTEL120_report_ === 'function') ? KOL_IDS_INTEL120_report_(active, '') : {version:'0.0.0',trace:[],attribution:[],learning:[]};
    if (typeof KOL_IDS_INTEL120_refreshLearning_ === 'function') { try { KOL_IDS_INTEL120_refreshLearning_({analysisId:active}); intelligence.learning = KOL_IDS_INTEL120_report_(active, '').learning; } catch(ignoreIntel) {} }
    return {success:true,headers:headers,rows:scoped,count:scoped.length,sourceSheet:KOL_IDS_PRODUCT_SHEETS.REPORT,activeAnalysisId:active,reportHardening:KOL_IDS_REPORT_HARDENING_VERSION,integrity:{ok:true,physicalRows:check.count,returnedRows:scoped.length,scopedByAnalysisId:!!(active&&hasAnalysis)},performance:perf,channelPerformance:perf.summary,performanceRows:perf.rows,intelligence:intelligence,decisionTrace:intelligence.trace,attribution:intelligence.attribution,learning:intelligence.learning};
  } finally { try{lock.releaseLock();}catch(ignore){} }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCT_UI_GET_REPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCT_UI_GET_REPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_REPORT_H5_RUN_TESTS(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_REPORT_H5_RUN_TESTS');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var out=[], ok=function(n,v){out.push({name:n,pass:v===true});};
  ok('required headers non-empty',KOL_IDS_REPORT_H5_requiredHeaders_().length>=7);
  ok('header map',KOL_IDS_REPORT_H5_headers_(['Analysis ID','KOL ID'])['KOL ID']===1);
  ok('string normalization',KOL_IDS_REPORT_H5_string_('  X  ')==='X');
  return {success:out.every(function(x){return x.pass;}),version:KOL_IDS_REPORT_HARDENING_VERSION,tests:out};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_REPORT_H5_RUN_TESTS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_REPORT_H5_RUN_TESTS', Date.now() - __kolIdsTraceStartedAt);
  }
}
