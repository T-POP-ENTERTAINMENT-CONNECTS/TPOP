/**
 * KOL IDS — ENT CANONICAL DATA NAMESPACE
 *
 * One data namespace for the whole product. Legacy V* sheet names are migrated
 * into ENT_* names. Existing data is preserved; canonical sheets are merged by
 * header name and primary ID where possible. No legacy sheet is deleted when a
 * collision occurs; it is renamed to an ENT_LEGACY_* archive name.
 *
 * IMPORTANT: persisted Script Property keys are intentionally NOT renamed.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  ENT_CANONICAL: {
    VERSION: '1.0',
    MIGRATION_PROP: 'KOL_IDS_ENT_CANONICAL_MIGRATION_DONE'
  }
});

function KOL_IDS_ENT_CANONICAL_MAP_() {
  return {
    'V5_SYSTEM':'ENT_SYSTEM',
    'V5_BRAND':'ENT_BRANDS',
    'V5_PERSONA':'ENT_PERSONAS',
    'V5_CREATORS':'ENT_CREATORS',
    'V5_DECISIONS':'ENT_DECISIONS',
    'V5_CAMPAIGNS':'ENT_CAMPAIGNS',
    'V5_PERFORMANCE':'ENT_PERFORMANCE',
    'V5_LEARNING':'ENT_LEARNING',
    'V5_MEMORY':'ENT_MEMORY',
    'V5_BENCHMARKS':'ENT_BENCHMARKS',
    'V5_AUDIT':'ENT_AUDIT_LOG',
    'V5_STRATEGIES':'ENT_STRATEGIES',
    'V5_GOAL_RULES':'ENT_GOAL_RULES',
    'V5_LICENSES':'ENT_LICENSES',
    'V5_ORDERS':'ENT_ORDERS',
    'V6_LEARNING_LOOP':'ENT_LEARNING_LOOP',
    'V7_CREATOR_INTELLIGENCE':'ENT_CREATOR_INTELLIGENCE',
    'V8_FEATURE_STORE':'ENT_FEATURE_STORE',
    'V8_MODEL_REGISTRY':'ENT_MODEL_REGISTRY',
    'V8_PREDICTION_LEDGER':'ENT_PREDICTION_LEDGER',
    'V9_PREDICTION_LEDGER':'ENT_PREDICTION_LEDGER',
    'V15_PREDICTION_LEDGER':'ENT_PREDICTION_LEDGER',
    'V16_IDEMPOTENCY':'ENT_IDEMPOTENCY',
    'V21_COMMAND_LEDGER':'ENT_COMMAND_LEDGER',
    'V21_DATA_INCIDENTS':'ENT_DATA_INCIDENTS',
    'V22_ARCHIVE':'ENT_ARCHIVE',
    'V22_ARCHIVE_INDEX':'ENT_ARCHIVE_INDEX'
  };
}

function KOL_IDS_ENT_CANONICAL_HEADERS_() {
  return {
    'ENT_SYSTEM':['License ID','Customer Name','Email','Expires At','Status','Version','Initialized At'],
    'ENT_BRANDS':['Brand ID','Brand Name','Category','Market','Positioning','Values','Avoid','Created At','Updated At','Org ID','Status','Industry','Legacy Brand ID','Model ID'],
    'ENT_PERSONAS':['Persona ID','Persona Name','Age Min','Age Max','Gender','Locations','Interests','Behaviors','Description','Created At','Audience Age Range','Goals & Needs','Pain Points'],
    'ENT_CREATORS':['Creator ID','Creator Name','Platform','Platform URL','Followers','ER %','Age Min','Age Max','Gender','Locations','Interests','Content Styles','Category','Rate','Currency','Historical Campaigns','Historical Notes','Risk Level','Created At','Photo URL','Social Links','ER Source','Rate Source','Profile Type','Audience Age Range','Data Confidence','Org ID','Brand ID','Status'],
    'ENT_DECISIONS':['Decision ID','Campaign ID','Creator ID','Creator Name','Decision','Decision Score','Persona Fit','Audience Fit','Content Fit','Objective Fit','Brand Fit','Confidence','Confidence Score','Why','Data Limitation','Created At','Behavior Fit','Content Recommendation','Evidence','Efficiency Score','Commercial Efficiency','ER Value','ER Source','Rate Value','Rate Source','Learning Adjustment','Campaign Goal','Goal Profile','Decision Tier','Preference Status','Brand Fit Gap','Recovery Strategy','Calibration Adjustment','Calibration Basis','History Calibration','Peer Calibration','Peer Benchmark','Fair Rate','Price Value','Opportunity Score','Data State','Creator Role','Investment Strength','Data Reliability','Price Risk','Decision Class'],
    'ENT_CAMPAIGNS':['Campaign ID','Campaign Name','Brand ID','Persona ID','Objective','Budget','Currency','Start Date','End Date','Selected Creator IDs','Status','Created At','Workflow Version','Selection Version','State Version','Updated At','Last Reprocess At','Last Idempotency Key','Campaign Goal','Success Metric','Goal Profile','Decision Status','Benchmark Status','Plan Summary','Duration Days','Org ID','Platform','Start At','End At','Updated At'],
    'ENT_PERFORMANCE':['Performance ID','Campaign ID','Creator ID','Creator Name','Spend','Reach','Impressions','Views','Engagements','Clicks','Conversions','Revenue','Currency','Evidence','Reported Date','Notes','Created At','Status','Efficiency Score','CPM','CPE','CPC','ROAS','Actual Goal Score','Goal KPI','Performance Confidence','Likes','Comments','Shares','Saves'],
    'ENT_LEARNING':['Learning ID','Campaign ID','Creator ID','Creator Name','Predicted Score','Actual Score','Variance','Performance Summary','What Worked','What Did Not','Next Action','Created At','Commercial Efficiency','Efficiency Signal','Goal KPI','Prediction Error','Calibration Weight'],
    'ENT_MEMORY':['Memory ID','Scope','Key','Value','Confidence','Source Campaign','Updated At'],
    'ENT_BENCHMARKS':['Benchmark ID','Campaign ID','Campaign Goal','Peer Count','Metric','Actual','Benchmark','Delta %','Percentile','Confidence','Peer Definition','Created At','Org ID','Brand ID','Cohort Key','Platform','Category','Sample Size','P25','Median','P75','Mean','Updated At'],
    'ENT_AUDIT_LOG':['Timestamp','Action','Entity ID','Status','Message','Event ID','Org ID','Actor','Entity Type','Outcome','Request ID','IP/Source','Previous Hash','Details Hash','Event Hash','Details'],
    'ENT_STRATEGIES':['Strategy ID','Campaign ID','Creator ID','Creator Name','Goal','Original Score','Decision Tier','Preferred','Recommended Role','Gap','Actions','Projected Fit','Confidence','Created At'],
    'ENT_GOAL_RULES':['Goal','Weight Persona','Weight Audience','Weight Content','Weight Objective','Weight Brand','Weight Efficiency','Primary KPI','Secondary KPI','Strategy'],
    'ENT_LICENSES':[], 'ENT_ORDERS':[],
    'ENT_LEARNING_LOOP':['Learning ID','Campaign ID','Creator ID','Goal','Raw Outcome Score','Predicted Score','Prediction Error','Absolute Error','Evidence Weight','Recency Weight','Learning Adjustment','Calibration Adjustment','Sample Size','Historical Confidence','Model Confidence','Data Valid','Observed At','Model Version','Learning Status'],
    'ENT_CREATOR_INTELLIGENCE':['Snapshot ID','Creator ID','Creator Name','Platform','Followers','ER','ER Source','Audience Coverage','Audience Quality','Data Quality','Historical Campaigns','Historical Outcome','Outcome Stability','Learning Confidence','Creator Health','Observed At','Model Version'],
    'ENT_FEATURE_STORE':['Snapshot ID','Creator ID','Goal','Followers','ER','Audience Coverage','History Count','History Mean','History Std','Platform','Category','Observed At','Model Version'],
    'ENT_MODEL_REGISTRY':['Model Version','Model Name','Goal','Observations','MAE','Bias','Interval Coverage','Calibration Confidence','Drift Status','Updated At','Model ID','Org ID','Brand ID','Model Type','Version','Status','Features JSON','Coefficients JSON','Intercept','Train Rows','Validation Rows','RMSE','R2','Created At','Activated At','Deactivated At','Baseline MAE','Baseline RMSE','Baseline R2','Validation Method','Dataset Hash'],
    'ENT_PREDICTION_LEDGER':['Prediction ID','Campaign ID','Creator ID','Goal','Predicted Score','Lower Bound','Upper Bound','Actual Score','Error','Absolute Error','Coverage Hit','Data Quality','Evidence Weight','Effective Sample Size','Confidence At Prediction','Model Version','Actual At','Created At','Learning Status','Org ID','Brand ID','Recommendation ID','Model ID','Predicted Value','Actual Value','Absolute Percentage Error','Evaluated At'],
    'ENT_IDEMPOTENCY':['Idempotency Key','Command','Entity ID','Result Hash','Created At','Expires At'],
    'ENT_COMMAND_LEDGER':['Command ID','Timestamp','Org ID','Actor','Command','Entity Type','Entity ID','Status','Request ID','Payload Hash','Result Hash'],
    'ENT_DATA_INCIDENTS':['Incident ID','Timestamp','Org ID','Severity','Status','Entity Type','Entity ID','Description','Resolution','Resolved At'],
    'ENT_ARCHIVE':['Archive ID','Campaign ID','Mode','Created At','Counts JSON','Hash'],
    'ENT_ARCHIVE_INDEX':['Archive ID','Campaign ID','Created At','Mode','Status','Counts JSON','Hash']
  };
}

function KOL_IDS_ENT_CANONICAL_read_(sh) {
  if (!sh || sh.getLastRow() < 1 || sh.getLastColumn() < 1) return {headers:[],rows:[]};
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  var rows = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  rows = rows.filter(function(r){ return r.some(function(v){ return v !== '' && v != null; }); });
  return {headers:headers,rows:rows};
}

function KOL_IDS_ENT_CANONICAL_writeUnion_(ss, canonical, sourceData, canonicalHeaders) {
  var sh = ss.getSheetByName(canonical);
  if (!sh) sh = ss.insertSheet(canonical);
  var current = KOL_IDS_ENT_CANONICAL_read_(sh);
  var headers = [];
  (canonicalHeaders || []).concat(current.headers || [], sourceData.headers || []).forEach(function(h){
    h = String(h || '').trim();
    if (h && headers.indexOf(h) < 0) headers.push(h);
  });
  if (!headers.length) return sh;

  var all = [];
  function pushMapped(data) {
    var idx = {}; data.headers.forEach(function(h,i){idx[String(h)]=i;});
    data.rows.forEach(function(row){
      var out = headers.map(function(h){ return idx[h] != null ? row[idx[h]] : ''; });
      all.push(out);
    });
  }
  pushMapped(current);
  pushMapped(sourceData);

  // Deduplicate by first ID-like header. Keep the first row and fill blanks from later rows.
  var idHeader = headers.find(function(h){ return /^(Brand|Persona|Creator|Decision|Campaign|Performance|Learning|Memory|Benchmark|Strategy|License|Order|Learning|Snapshot|Prediction|Idempotency|Command|Incident|Archive|Model|Event|Record) ID$/i.test(h); });
  if (idHeader) {
    var idIdx = headers.indexOf(idHeader), seen = {}, dedup=[];
    all.forEach(function(row){
      var key = String(row[idIdx] == null ? '' : row[idIdx]).trim();
      if (!key) { dedup.push(row); return; }
      if (seen[key] == null) { seen[key]=dedup.length; dedup.push(row); return; }
      var target=dedup[seen[key]];
      row.forEach(function(v,i){ if ((target[i] === '' || target[i] == null) && v !== '' && v != null) target[i]=v; });
    });
    all=dedup;
  }

  sh.clearContents();
  sh.getRange(1,1,1,headers.length).setValues([headers]);
  if (all.length) sh.getRange(2,1,all.length,headers.length).setValues(all);
  sh.setFrozenRows(1);
  return sh;
}

function KOL_IDS_ENT_CANONICAL_legacyName_(oldName, ss) {
  var base = 'ENT_LEGACY_' + oldName.replace(/^V[0-9]+_?/, '');
  base = base.slice(0,99);
  var name=base, n=2;
  while(ss.getSheetByName(name)) { name=(base+'_'+n).slice(0,99); n++; }
  return name;
}

function KOL_IDS_ENT_CANONICAL_MIGRATE() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_CANONICAL_MIGRATE');
  var started=Date.now();
  try {
    var ss=KOL_IDS_SYSTEM_getSpreadsheet_();
    var map=KOL_IDS_ENT_CANONICAL_MAP_(), specs=KOL_IDS_ENT_CANONICAL_HEADERS_(), report=[];
    Object.keys(map).forEach(function(oldName){
      var canonical=map[oldName], oldSh=ss.getSheetByName(oldName), newSh=ss.getSheetByName(canonical);
      if(!oldSh) { report.push({from:oldName,to:canonical,status:'NOT_PRESENT'}); return; }
      var source=KOL_IDS_ENT_CANONICAL_read_(oldSh);
      if(!newSh) {
        oldSh.setName(canonical);
        newSh=oldSh;
        if(specs[canonical] && specs[canonical].length) KOL_IDS_ENT_CANONICAL_writeUnion_(ss,canonical,KOL_IDS_ENT_CANONICAL_read_(newSh),specs[canonical]);
        report.push({from:oldName,to:canonical,status:'RENAMED',rows:source.rows.length});
        return;
      }
      KOL_IDS_ENT_CANONICAL_writeUnion_(ss,canonical,source,specs[canonical]||[]);
      var legacy=KOL_IDS_ENT_CANONICAL_legacyName_(oldName,ss);
      oldSh.setName(legacy);
      report.push({from:oldName,to:canonical,status:'MERGED',legacy:legacy,rows:source.rows.length});
    });
    PropertiesService.getScriptProperties().setProperty(KOL_IDS.ENT_CANONICAL.MIGRATION_PROP,new Date().toISOString());
    return {success:true,status:'GREEN',version:KOL_IDS.ENT_CANONICAL.VERSION,report:report,durationMs:Date.now()-started};
  } catch(e) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_CANONICAL_MIGRATE',e); throw e;
  } finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_CANONICAL_MIGRATE',Date.now()-started); }
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_ENT_CANONICAL_AUDIT() {
  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),bad=[],names=ss.getSheets().map(function(s){return s.getName();});
  names.forEach(function(n){ if(/^V[0-9]+(?:_|$)/.test(n)) bad.push(n); });
  return {success:bad.length===0,status:bad.length?'RED':'GREEN',legacyVersionNamedSheets:bad,count:bad.length};
}


function KOL_IDS_ENT_CANONICAL_AUDIT() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_ENT_CANONICAL_AUDIT', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_ENT_CANONICAL_AUDIT, this, arguments);
}
