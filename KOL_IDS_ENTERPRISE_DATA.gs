/**
 * Enterprise Data Reliability Layer
 * One canonical set of normalization, retrieval, reconciliation and memory rules.
 */
const KOL_IDS_ENT_DATA = {
  VERSION: '1.0.0',
  MEMORY_SHEET: '91_DATA_MEMORY',
  MAX_MEMORY_VALUE_LENGTH: 45000,
  REQUIRED_SHEETS: ['02_BRAND_PROFILE','03_CAMPAIGN','04_KOL_DATABASE'],
  REQUIRED_HEADERS: {
    '02_BRAND_PROFILE': ['Brand ID','Brand Name'],
    '03_CAMPAIGN': ['Campaign ID','Campaign Name'],
    '04_KOL_DATABASE': ['KOL ID','KOL Name']
  }
};

function KOL_IDS_ENT_DATA_TEXT_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_TEXT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return value === null || value === undefined ? '' : String(value).trim().replace(/\s+/g, ' '); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_TEXT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_TEXT_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ENT_DATA_KEY_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_KEY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_ENT_DATA_TEXT_(value).toLocaleLowerCase(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_KEY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_KEY_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ENT_DATA_NUMBER_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_NUMBER_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (value === '' || value === null || value === undefined) return null;
  const n = typeof value === 'number' ? value : Number(String(value).replace(/,/g, '').trim());
  return isFinite(n) ? n : null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_NUMBER_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_NUMBER_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_ENT_DATA_HASH_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_HASH_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(value));
  return bytes.map(function(b) { const n = (b + 256) % 256; return ('0' + n.toString(16)).slice(-2); }).join('');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_HASH_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_HASH_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_DATA_READ_(sheetName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_READ_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Required data source is missing: ' + sheetName + '.');
  const values = sheet.getDataRange().getValues();
  if (!values.length) return { headers: [], rows: [], rowCount: 0, sheetName: sheetName };
  const headers = values[0].map(KOL_IDS_ENT_DATA_TEXT_);
  const duplicateHeaders = headers.filter(function(h, i) { return h && headers.indexOf(h) !== i; });
  if (duplicateHeaders.length) throw new Error('Duplicate headers in ' + sheetName + ': ' + duplicateHeaders.join(', ') + '.');
  return { sheetName: sheetName, headers: headers, rows: values.slice(1), rowCount: Math.max(0, values.length - 1) };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_READ_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_READ_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_DATA_RECONCILE_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_RECONCILE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const report = { success: true, version: KOL_IDS_ENT_DATA.VERSION, checkedAt: new Date().toISOString(), sheets: [], issues: [] };
  KOL_IDS_ENT_DATA.REQUIRED_SHEETS.forEach(function(name) {
    try {
      const data = KOL_IDS_ENT_DATA_READ_(name);
      const required = KOL_IDS_ENT_DATA.REQUIRED_HEADERS[name] || [];
      const missing = required.filter(function(header) { return data.headers.indexOf(header) < 0; });
      const first = data.rows.map(function(row) { return KOL_IDS_ENT_DATA_KEY_(row[0]); }).filter(Boolean);
      const duplicateIds = first.filter(function(id, i) { return first.indexOf(id) !== i; });
      const item = { sheet: name, rows: data.rowCount, missingHeaders: missing, duplicateIds: Array.from(new Set(duplicateIds)).slice(0, 25) };
      report.sheets.push(item);
      if (missing.length || duplicateIds.length) report.issues.push(item);
    } catch (error) { report.success = false; report.issues.push({ sheet: name, error: String(error.message || error) }); }
  });
  report.success = report.success && report.issues.length === 0;
  return report;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_RECONCILE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_RECONCILE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_DATA_ASSERT_READY_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_ASSERT_READY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const result = KOL_IDS_ENT_DATA_RECONCILE_();
  if (!result.success) throw new Error('Data reliability check failed. Resolve the schema or duplicate-ID issues before running an analysis.');
  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_ASSERT_READY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_ASSERT_READY_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const p = payload || {};
  const brand = KOL_IDS_ENT_DATA_TEXT_(p.brandName || p.brand && p.brand.name);
  const campaign = KOL_IDS_ENT_DATA_TEXT_(p.campaignName || p.campaign && p.campaign.name);
  const objective = KOL_IDS_ENT_DATA_TEXT_(p.objective || p.campaign && p.campaign.objective);
  const kols = Array.isArray(p.kols) ? p.kols : [];
  if (!brand || !campaign || !objective) throw new Error('Brand, campaign, and objective are required for a reliable analysis.');
  const names = kols.map(function(k) { return KOL_IDS_ENT_DATA_KEY_(k && k.name); }).filter(Boolean);
  if (!names.length) throw new Error('At least one Creator is required.');
  if (kols.length > 100) throw new Error('A maximum of 100 creators is allowed per analysis.');
  if (names.some(function(name, i) { return names.indexOf(name) !== i; })) throw new Error('Creator names must be unique within an analysis.');
  return { success: true, creators: names.length, checksum: KOL_IDS_ENT_DATA_HASH_({ brand:brand, campaign:campaign, objective:objective, creators:names }) };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_DATA_RECORD_(event, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_RECORD_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  let sheet = ss.getSheetByName(KOL_IDS_ENT_DATA.MEMORY_SHEET);
  if (!sheet) { sheet = ss.insertSheet(KOL_IDS_ENT_DATA.MEMORY_SHEET); sheet.appendRow(['Timestamp','Actor','Event','Checksum','Payload JSON']); sheet.setFrozenRows(1); }
  const safe = JSON.stringify(payload || {});
  const compact = safe.length > KOL_IDS_ENT_DATA.MAX_MEMORY_VALUE_LENGTH ? safe.slice(0, KOL_IDS_ENT_DATA.MAX_MEMORY_VALUE_LENGTH) : safe;
  sheet.appendRow([new Date(), KOL_IDS_SECURITY_GET_EMAIL_(), String(event || ''), KOL_IDS_ENT_DATA_HASH_(payload || {}), compact]);
  return { event: event, checksum: KOL_IDS_ENT_DATA_HASH_(payload || {}) };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_RECORD_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_RECORD_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_DATA_HEALTHCHECK() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_HEALTHCHECK');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_ENT_EXECUTE_BRIDGE_('DATA_HEALTHCHECK', false, function() { KOL_IDS_SELF_ROUTE_(); return KOL_IDS_ENT_DATA_RECONCILE_(); });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_HEALTHCHECK', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_HEALTHCHECK', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENT_DATA_QA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENT_DATA_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const hashStable = KOL_IDS_ENT_DATA_HASH_({a:1}) === KOL_IDS_ENT_DATA_HASH_({a:1});
  let duplicateRejected = false;
  try { KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_({brandName:'A',campaignName:'B',objective:'AWARENESS',kols:[{name:'X'},{name:'x'}]}); } catch (e) { duplicateRejected = true; }
  return { success: hashStable && duplicateRejected, tests: 2, failures: hashStable && duplicateRejected ? [] : ['data validation'], version: KOL_IDS_ENT_DATA.VERSION };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENT_DATA_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENT_DATA_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
