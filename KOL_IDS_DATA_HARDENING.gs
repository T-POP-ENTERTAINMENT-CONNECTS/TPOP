/**
 * KOL IDS™ 1.1.0 — DATA HARDENING / RECOVERY FOUNDATION
 *
 * Purpose:
 * - Keep Google Sheets as the operational store without treating it as an unlimited DB.
 * - Add deterministic row lookup, bounded reads, safe writes, integrity checks and backups.
 * - Provide a migration boundary so a future SQL/managed DB can replace Sheets without rewriting UI.
 * - NON-DESTRUCTIVE by default. No customer rows are deleted or rewritten by the installer.
 */

var KOL_IDS_DATA_HARDENING = {
  VERSION: '1.0.0',
  BACKUP_FOLDER_PROP: 'KOL_IDS_DATA_BACKUP_FOLDER_ID',
  BACKUP_TRIGGER_PROP: 'KOL_IDS_DATA_BACKUP_TRIGGER',
  BACKUP_KEEP: 12,
  MAX_READ_ROWS: 50000,
  LOCK_MS: 30000,
  INDEX_SHEET: '_KOL_IDS_DATA_INDEX',
  HEALTH_SHEET: '_KOL_IDS_DATA_HEALTH'
};

function KOL_IDS_DATA_findByColumn_(sheet, column, value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_findByColumn_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!sheet || sheet.getLastRow() < 2 || column < 1) return null;
  var needle = String(value == null ? '' : value).trim();
  if (!needle) return null;
  var range = sheet.getRange(2, column, sheet.getLastRow() - 1, 1);
  var cell = range.createTextFinder(needle).matchEntireCell(true).matchCase(false).findNext();
  if (!cell) return null;
  return {
    rowNumber: cell.getRow(),
    dataIndex: cell.getRow() - 2,
    row: sheet.getRange(cell.getRow(), 1, 1, sheet.getLastColumn()).getValues()[0]
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_findByColumn_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_findByColumn_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_findAllByColumn_(sheet, column, value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_findAllByColumn_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!sheet || sheet.getLastRow() < 2 || column < 1) return [];
  var needle = String(value == null ? '' : value).trim();
  if (!needle) return [];
  var cells = sheet.getRange(2, column, sheet.getLastRow() - 1, 1)
    .createTextFinder(needle).matchEntireCell(true).matchCase(false).findAll();
  return cells.map(function(cell) {
    return { rowNumber: cell.getRow(), dataIndex: cell.getRow() - 2,
      row: sheet.getRange(cell.getRow(), 1, 1, sheet.getLastColumn()).getValues()[0] };
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_findAllByColumn_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_findAllByColumn_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_writeRow_(sheet, rowNumber, row, expectedVersionColumn) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_writeRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!sheet || rowNumber < 2) throw new Error('Invalid target row.');
  var lastColumn = Math.max(sheet.getLastColumn(), row.length);
  var values = row.slice(0, lastColumn);
  while (values.length < lastColumn) values.push('');
  if (expectedVersionColumn) {
    var current = sheet.getRange(rowNumber, expectedVersionColumn).getValue();
    var supplied = row[expectedVersionColumn - 1];
    if (supplied !== '' && supplied != null && current !== '' && String(current) !== String(supplied)) {
      throw new Error('Concurrent update detected. Reload the workspace and retry.');
    }
  }
  sheet.getRange(rowNumber, 1, 1, lastColumn).setValues([values]);
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_writeRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_writeRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_appendRows_(sheet, rows) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_appendRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!sheet || !Array.isArray(rows) || !rows.length) return 0;
  var width = sheet.getLastColumn();
  var values = rows.map(function(r) {
    var x = Array.isArray(r) ? r.slice(0, width) : [];
    while (x.length < width) x.push('');
    return x;
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, width).setValues(values);
  return values.length;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_appendRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_appendRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_hash_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value == null ? '' : value), Utilities.Charset.UTF_8);
  return bytes.map(function(b) { var n = b < 0 ? b + 256 : b; return ('0' + n.toString(16)).slice(-2); }).join('');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_lock_(name, work) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_lock_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var lock = name === 'USER' ? LockService.getUserLock() : LockService.getScriptLock();
  if (!lock.tryLock(KOL_IDS_DATA_HARDENING.LOCK_MS)) throw new Error('System is busy processing another request. Please retry.');
  try { return work(); } finally { lock.releaseLock(); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_lock_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_lock_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_ensureSupportSheets_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_ensureSupportSheets_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var index = ss.getSheetByName(KOL_IDS_DATA_HARDENING.INDEX_SHEET);
  if (!index) index = ss.insertSheet(KOL_IDS_DATA_HARDENING.INDEX_SHEET);
  if (index.getLastRow() === 0) index.getRange(1,1,1,7).setValues([['Entity','Record ID','Sheet','Row','Updated At','Version','Record Hash']]);
  var health = ss.getSheetByName(KOL_IDS_DATA_HARDENING.HEALTH_SHEET);
  if (!health) health = ss.insertSheet(KOL_IDS_DATA_HARDENING.HEALTH_SHEET);
  if (health.getLastRow() === 0) health.getRange(1,1,1,6).setValues([['Checked At','Check','Status','Count','Details','Version']]);
  [index, health].forEach(function(s) { s.setFrozenRows(1); try { s.hideSheet(); } catch (e) {} });
  return {index:index, health:health};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_ensureSupportSheets_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_ensureSupportSheets_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_healthCheck(token) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_healthCheck');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = token ? KOL_IDS_CORE_ctx_(token).ss : KOL_IDS_SYSTEM_getSpreadsheet_();
  KOL_IDS_DATA_ensureSupportSheets_(ss);
  var checks = [], now = new Date();
  function check(name, fn) {
    try { var r = fn(); checks.push({check:name,status:r.ok?'PASS':'FAIL',count:r.count||0,details:r.details||''}); }
    catch (e) { checks.push({check:name,status:'FAIL',count:0,details:String(e&&e.message||e)}); }
  }
  var names = ['ENT_BRANDS','ENT_PERSONAS','ENT_CREATORS','ENT_CAMPAIGNS','ENT_DECISIONS','ENT_PERFORMANCE','ENT_LEARNING','ENT_MEMORY'];
  names.forEach(function(name) { check(name+' exists', function(){ var s=ss.getSheetByName(name); return {ok:!!s,count:s?s.getLastRow()-1:0,details:s?'':'Missing sheet'}; }); });
  check('Duplicate IDs', function(){
    var dup=[]; names.forEach(function(name){var s=ss.getSheetByName(name);if(!s||s.getLastRow()<2)return;var vals=s.getRange(2,1,s.getLastRow()-1,1).getValues().map(function(r){return String(r[0]||'').trim();}).filter(Boolean),seen={};vals.forEach(function(id){seen[id]=(seen[id]||0)+1;});Object.keys(seen).forEach(function(id){if(seen[id]>1)dup.push(name+':'+id+' x'+seen[id]);});});
    return {ok:dup.length===0,count:dup.length,details:dup.slice(0,20).join(' | ')};
  });
  check('Decision → Campaign integrity', function(){
    var c=ss.getSheetByName('ENT_CAMPAIGNS'),d=ss.getSheetByName('ENT_DECISIONS'); if(!c||!d||d.getLastRow()<2)return {ok:true,count:0};
    var campaigns={};c.getRange(2,1,Math.max(0,c.getLastRow()-1),1).getValues().forEach(function(r){if(r[0])campaigns[String(r[0])]=1;});
    var dm=KOL_IDS_CORE_colMap_(d), bad=0;d.getRange(2,1,Math.max(0,d.getLastRow()-1),d.getLastColumn()).getValues().forEach(function(r){var id=dm['Campaign ID']!=null?r[dm['Campaign ID']]:r[1];if(id&&!campaigns[String(id)])bad++;});
    return {ok:bad===0,count:bad,details:bad?'Decision rows reference missing campaigns.':''};
  });
  check('Performance → Campaign integrity', function(){
    var c=ss.getSheetByName('ENT_CAMPAIGNS'),p=KOL_IDS_PA_legacyProjection_(ss); if(!c||!p||p.getLastRow()<2)return {ok:true,count:0};
    var campaigns={};c.getRange(2,1,Math.max(0,c.getLastRow()-1),1).getValues().forEach(function(r){if(r[0])campaigns[String(r[0])]=1;});
    var pm=KOL_IDS_CORE_colMap_(p),bad=0;p.getRange(2,1,Math.max(0,p.getLastRow()-1),p.getLastColumn()).getValues().forEach(function(r){var id=pm['Campaign ID']!=null?r[pm['Campaign ID']]:r[1];if(id&&!campaigns[String(id)])bad++;});
    return {ok:bad===0,count:bad,details:bad?'Performance rows reference missing campaigns.':''};
  });
  var support=ss.getSheetByName(KOL_IDS_DATA_HARDENING.HEALTH_SHEET);
  if (support) { var rows=checks.map(function(c){return [now,c.check,c.status,c.count,c.details,KOL_IDS_DATA_HARDENING.VERSION];}); if(rows.length)support.getRange(support.getLastRow()+1,1,rows.length,6).setValues(rows); }
  return {success:checks.every(function(c){return c.status==='PASS';}),version:KOL_IDS_DATA_HARDENING.VERSION,checkedAt:now.toISOString(),checks:checks};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_healthCheck', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_healthCheck', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_pruneBackups_(folder, workspaceId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_pruneBackups_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    if (!folder) return {success:false,deleted:0,reason:'NO_FOLDER'};
    var prefix = 'KOL_IDS_BACKUP_' + String(workspaceId || '').slice(0,8) + '_';
    var files = [];
    var it = folder.getFiles();
    while (it.hasNext()) {
      var f = it.next();
      var n = String(f.getName() || '');
      if (n.indexOf(prefix) === 0) files.push({file:f,name:n,created:f.getDateCreated().getTime()});
    }
    files.sort(function(a,b){ return b.created - a.created; });
    var keep = Math.max(1, Number(KOL_IDS_DATA_HARDENING.BACKUP_KEEP) || 12);
    var deleted = 0;
    for (var i = keep; i < files.length; i++) {
      try { files[i].file.setTrashed(true); deleted++; } catch (e) { console.warn('KOL IDS backup prune failed: '+String(e && e.message || e)); }
    }
    return {success:true,deleted:deleted,remaining:Math.min(files.length,keep)};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_pruneBackups_', __kolIdsTraceError);
    return {success:false,deleted:0,error:String(__kolIdsTraceError && __kolIdsTraceError.message || __kolIdsTraceError)};
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_pruneBackups_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_backupWorkspace(token, reason) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_backupWorkspace');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = token ? KOL_IDS_CORE_ctx_(token).ss : KOL_IDS_SYSTEM_getSpreadsheet_();
  if (!ss || !ss.getId) throw new Error('Backup workspace could not be resolved.');
  var props = PropertiesService.getUserProperties();
  var folderId = props.getProperty(KOL_IDS_DATA_HARDENING.BACKUP_FOLDER_PROP);
  var folder = null;
  if (folderId) {
    try { folder = DriveApp.getFolderById(folderId); } catch (e) { folder = null; }
  }
  if (!folder) {
    folder = DriveApp.createFolder('KOL IDS — Data Backups');
    props.setProperty(KOL_IDS_DATA_HARDENING.BACKUP_FOLDER_PROP, folder.getId());
  }
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  var name = 'KOL_IDS_BACKUP_' + ss.getId().slice(0,8) + '_' + stamp;
  var copy = DriveApp.getFileById(ss.getId()).makeCopy(name, folder);
  var prune = KOL_IDS_DATA_pruneBackups_(folder, ss.getId());
  return {success:true,backupId:copy.getId(),name:copy.getName(),url:copy.getUrl(),reason:String(reason||'MANUAL'),retention:prune};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_backupWorkspace', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_backupWorkspace', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_installBackup() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_installBackup');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_();
  KOL_IDS_DATA_ensureSupportSheets_(ss);
  var props=PropertiesService.getUserProperties();
  props.setProperty('KOL_IDS_DATA_BACKUP_WORKSPACE_ID', ss.getId());
  if(!props.getProperty(KOL_IDS_DATA_HARDENING.BACKUP_FOLDER_PROP)){
    var folder=DriveApp.createFolder('KOL IDS — Data Backups');
    props.setProperty(KOL_IDS_DATA_HARDENING.BACKUP_FOLDER_PROP,folder.getId());
  }
  // Trigger state is verified from Apps Script itself; the property is only a cache.
  // This makes reinstall/repair safe if a customer deletes the trigger manually.
  var handler='KOL_IDS_DATA_scheduledBackup';
  var triggers=ScriptApp.getProjectTriggers().filter(function(t){
    return String(t.getHandlerFunction()||'')===handler;
  });
  if(triggers.length>1){
    for(var i=1;i<triggers.length;i++){
      try{ScriptApp.deleteTrigger(triggers[i]);}catch(e){console.warn('KOL IDS duplicate backup trigger cleanup failed: '+String(e&&e.message||e));}
    }
    triggers=ScriptApp.getProjectTriggers().filter(function(t){return String(t.getHandlerFunction()||'')===handler;});
  }
  if(triggers.length===0){
    ScriptApp.newTrigger(handler)
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.SUNDAY)
      .atHour(3)
      .everyWeeks(1)
      .create();
  }
  // Verify the trigger actually exists before reporting success.
  var verified=ScriptApp.getProjectTriggers().some(function(t){return String(t.getHandlerFunction()||'')===handler;});
  if(!verified) throw new Error('Backup trigger could not be verified after installation.');
  props.setProperty(KOL_IDS_DATA_HARDENING.BACKUP_TRIGGER_PROP,'1');
  return {success:true,version:KOL_IDS_DATA_HARDENING.VERSION,backupFolderId:props.getProperty(KOL_IDS_DATA_HARDENING.BACKUP_FOLDER_PROP),triggerInstalled:true,triggerVerified:true,schedule:'weekly Sunday around 03:00 project time'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_installBackup', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_installBackup', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_scheduledBackup() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_scheduledBackup');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try {
    var props=PropertiesService.getUserProperties();
    var workspaceId=String(props.getProperty('KOL_IDS_DATA_BACKUP_WORKSPACE_ID')||'').trim();
    if(!workspaceId) throw new Error('Backup workspace is not configured for this user.');
    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(workspaceId);
    return KOL_IDS_DATA_backupWorkspace(null,'WEEKLY');
  }
  catch(e) { console.error('KOL_IDS weekly backup failed: '+String(e&&e.stack||e)); return {success:false,error:String(e&&e.message||e)}; }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_scheduledBackup', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_scheduledBackup', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_DATA_preflight() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DATA_preflight');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_();
  var issues=[];
  if(!ss) issues.push('Spreadsheet unavailable');
  if(typeof KOL_IDS_CORE_values_!=='function') issues.push('Core data reader missing');
  if(typeof KOL_IDS_CORE_ctx_!=='function') issues.push('Core context guard missing');
  if(typeof KOL_IDS_SECURITY_ASSERT_USER_!=='function') issues.push('Identity guard missing');
  if(typeof KOL_IDS_COMMERCIAL_PACKAGES!=='function') issues.push('Commercial package layer missing');
  var health=null; if(!issues.length) health=KOL_IDS_DATA_healthCheck(null);
  return {success:issues.length===0 && (!health || health.success),version:KOL_IDS_DATA_HARDENING.VERSION,issues:issues,health:health};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DATA_preflight', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DATA_preflight', Date.now() - __kolIdsTraceStartedAt);
  }
}
