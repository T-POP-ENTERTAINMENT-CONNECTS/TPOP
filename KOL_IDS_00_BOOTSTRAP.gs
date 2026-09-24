/**
 * KOL IDS — GLOBAL BOOTSTRAP
 * Single owner for the shared KOL IDS namespace.
 * All modules extend this object; none redeclare or replace it.
 */
var KOL_IDS = {};

/**
 * RUNTIME COMPATIBILITY GUARD
 *
 * Some imported/deployed project states may not expose the legacy system
 * spreadsheet resolver even though modules still depend on its public name.
 * Install a fallback only when the canonical resolver is absent. This keeps
 * the canonical implementation in KOL_IDS_SYSTEM.gs authoritative whenever
 * it is present, while preventing bootstrap-time ReferenceError in partial
 * imports / deployments.
 */
if (typeof KOL_IDS_SYSTEM_getSpreadsheet_ !== 'function') {
  KOL_IDS_SYSTEM_getSpreadsheet_ = function() {
    var runtimeId = (typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined')
      ? KOL_IDS_RUNTIME_SS_ID
      : null;
    if (runtimeId) return SpreadsheetApp.openById(runtimeId);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('KOL IDS: Active spreadsheet is not available.');
    return ss;
  };
}


/**
 * RUNTIME COMPATIBILITY GUARD — CORE INITIALIZER
 *
 * Apps Script imports can occasionally leave a project in a partial runtime
 * state where KOL_IDS_SYSTEM.gs exists in source but its public initializer
 * is not exposed to the executing runtime. Do not replace the canonical
 * initializer when it is available. Only install this exact-schema fallback
 * when the public symbol is genuinely absent.
 */
if (typeof KOL_IDS_SYSTEM_initialize !== 'function') {
  KOL_IDS_SYSTEM_initialize = function(options) {
    options = options || {};
    if (typeof KOL_IDS_TRACE_ENTER_ === 'function') KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_initialize[compat]');
    var started = Date.now();
    try {
      var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
      if (!ss) throw new Error('KOL IDS: Spreadsheet runtime is not available.');

      if (typeof KOL_IDS_SCHEMA_CONFIG === 'undefined' || !KOL_IDS_SCHEMA_CONFIG) {
        throw new Error('KOL IDS runtime is missing KOL_IDS_SCHEMA_CONFIG; import KOL_IDS_SYSTEM.gs before running bootstrap.');
      }

      Object.keys(KOL_IDS_SCHEMA_CONFIG).forEach(function(sheetName) {
        var sheet = ss.getSheetByName(sheetName);
        if (!sheet) sheet = ss.insertSheet(sheetName);
        if (typeof KOL_IDS_SYSTEM_prepareSheet_ !== 'function') {
          throw new Error('KOL IDS runtime is missing KOL_IDS_SYSTEM_prepareSheet_; KOL_IDS_SYSTEM.gs is not fully loaded.');
        }
        KOL_IDS_SYSTEM_prepareSheet_(sheet, KOL_IDS_SCHEMA_CONFIG[sheetName]);
      });

      if (typeof KOL_IDS_SYSTEM_syncPerformanceAuthoritySchema_ === 'function') {
        KOL_IDS_SYSTEM_syncPerformanceAuthoritySchema_();
      }

      var executiveName = (typeof KOL_IDS_SYSTEM !== 'undefined' && KOL_IDS_SYSTEM &&
        KOL_IDS_SYSTEM.SHEETS && KOL_IDS_SYSTEM.SHEETS.EXECUTIVE)
        ? KOL_IDS_SYSTEM.SHEETS.EXECUTIVE : '11_EXECUTIVE';
      if (!ss.getSheetByName(executiveName)) ss.insertSheet(executiveName);

      if (typeof KOL_IDS_SYSTEM_writeSystemDefaults_ === 'function') {
        KOL_IDS_SYSTEM_writeSystemDefaults_(ss);
      }
      if (typeof KOL_IDS_DATA_ensureSupportSheets_ === 'function') {
        KOL_IDS_DATA_ensureSupportSheets_(ss);
      }
      if (typeof KOL_IDS_SYSTEM_safeToast_ === 'function') {
        KOL_IDS_SYSTEM_safeToast_(ss, 'KBIS core structure initialized.', 4);
      }

      if (!options.suppressAlerts && typeof KOL_IDS_SYSTEM_safeAlert_ === 'function') {
        var productName = (typeof KOL_IDS_SYSTEM !== 'undefined' && KOL_IDS_SYSTEM && KOL_IDS_SYSTEM.PRODUCT_NAME) || 'KOL IDS';
        var version = (typeof KOL_IDS_SYSTEM !== 'undefined' && KOL_IDS_SYSTEM && KOL_IDS_SYSTEM.VERSION) || '';
        KOL_IDS_SYSTEM_safeAlert_(
          'KBIS V2 initialized successfully.\n\n' +
          'Product: ' + productName + '\nVersion: ' + version +
          '\n\nNext step:\nEnter Brand + Campaign + KOL data,\nthen use 🚀 RUN FULL SYSTEM.'
        );
      }
      return {ok:true, compatibilityFallback:true, spreadsheetId:ss.getId(), durationMs:Date.now()-started};
    } catch (e) {
      if (typeof KOL_IDS_TRACE_ERROR_ === 'function') KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_initialize[compat]', e);
      throw e;
    } finally {
      if (typeof KOL_IDS_TRACE_EXIT_ === 'function') KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_initialize[compat]', Date.now()-started);
    }
  };
}

/** Deep merge for shared configuration namespaces. Arrays and primitives replace;
 * nested objects merge so one module cannot erase another module's configuration. */
function KOL_IDS_MERGE_(target, source) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_MERGE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  target = target || {};
  source = source || {};
  Object.keys(source).forEach(function(key) {
    var sv = source[key], tv = target[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) &&
        tv && typeof tv === 'object' && !Array.isArray(tv)) {
      target[key] = KOL_IDS_MERGE_(tv, sv);
    } else {
      target[key] = sv;
    }
  });
  return target;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_MERGE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_MERGE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * PUBLIC RUNNER
 * Run this function once after importing the project to verify that
 * the shared KOL_IDS namespace has been bootstrapped correctly.
 */
function KOL_IDS_00_BOOTSTRAP_RUN_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_00_BOOTSTRAP_RUN_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Canonical data namespace migration must run before runtime hardening so every module sees ENT_* sheets.
  if (typeof KOL_IDS_ENT_CANONICAL_MIGRATE === 'function') {
    var canonical = KOL_IDS_ENT_CANONICAL_MIGRATE();
    Logger.log(JSON.stringify(canonical, null, 2));
  }

  if (typeof KOL_IDS_RUNTIME_HARDENING_DEPLOY_READY === 'function') {
    var hardened = KOL_IDS_RUNTIME_HARDENING_DEPLOY_READY();
    Logger.log(JSON.stringify(hardened, null, 2));
    return hardened;
  }

  // Compatibility fallback if the hardening layer was not imported yet.
  if (typeof KOL_IDS === 'undefined' || !KOL_IDS) throw new Error('KOL_IDS namespace is not initialized.');
  if (typeof KOL_IDS_PLATFORM_ensure_ === 'function') KOL_IDS_PLATFORM_ensure_();
  if (typeof KOL_IDS_GROWTH_ensureGrowthSheets_ === 'function') KOL_IDS_GROWTH_ensureGrowthSheets_();
  if (typeof KOL_IDS_CAMPAIGN_CONTROL_ensure_ === 'function') KOL_IDS_CAMPAIGN_CONTROL_ensure_();
  if (typeof KOL_IDS_ATTRIBUTION_ensure_ === 'function') KOL_IDS_ATTRIBUTION_ensure_();
  return {ok:true,version:KOL_IDS.VERSION,namespaceReady:true,timestamp:new Date().toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_00_BOOTSTRAP_RUN_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_00_BOOTSTRAP_RUN_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
