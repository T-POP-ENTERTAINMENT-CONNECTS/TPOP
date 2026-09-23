/**
 * KOL IDS™ — GLOBAL DETAILED EXECUTION TRACE
 * Additive observability layer.
 *
 * Default: ON
 * Logs every named server-side function ENTER / EXIT / ERROR.
 * Does not log argument values or secrets.
 *
 * Controls:
 *   KOL_IDS_TRACE_SET_ENABLED(true/false)
 *   KOL_IDS_TRACE_STATUS()
 */
var KOL_IDS_TRACE_VERSION = '1.2.0';
var KOL_IDS_TRACE_ENABLED_CACHE_ = null;
var KOL_IDS_TRACE_HOT_PATH_SKIP_ = {
  'KOL_IDS_PORTFOLIO_portfolioMarginalValue_': true,
  'KOL_IDS_PORTFOLIO_portfolioPairSynergy_': true,
  'KOL_IDS_PORTFOLIO_portfolioSame_': true
};

function KOL_IDS_TRACE_hotPathSkipped_(fn) {
  // Load-order safe: top-level module initialization can call trace before
  // KOL_IDS_TRACE_HOT_PATH_SKIP_ has been initialized by the runtime.
  var skip = (typeof KOL_IDS_TRACE_HOT_PATH_SKIP_ !== 'undefined' && KOL_IDS_TRACE_HOT_PATH_SKIP_)
    ? KOL_IDS_TRACE_HOT_PATH_SKIP_
    : {};
  return !!skip[String(fn || '')];
}

function KOL_IDS_TRACE_enabled_() {
  if (typeof KOL_IDS_TRACE_ENABLED_CACHE_ !== 'undefined' && KOL_IDS_TRACE_ENABLED_CACHE_ !== null) return KOL_IDS_TRACE_ENABLED_CACHE_;
  try {
    var p = PropertiesService.getScriptProperties();
    var v = p.getProperty('KOL_IDS_TRACE_ENABLED');
    KOL_IDS_TRACE_ENABLED_CACHE_ = (v === null ? true : String(v).toLowerCase() !== 'false');
  } catch (e) {
    KOL_IDS_TRACE_ENABLED_CACHE_ = true;
  }
  return KOL_IDS_TRACE_ENABLED_CACHE_;
}

function KOL_IDS_TRACE_SET_ENABLED(enabled) {
  var value = !!enabled;
  PropertiesService.getScriptProperties().setProperty('KOL_IDS_TRACE_ENABLED', String(value));
  KOL_IDS_TRACE_ENABLED_CACHE_ = value;
  Logger.log('[TRACE][CONFIG] enabled=' + value);
  return { success: true, enabled: value, version: KOL_IDS_TRACE_VERSION };
}

function KOL_IDS_TRACE_STATUS() {
  var status = {
    success: true,
    enabled: KOL_IDS_TRACE_enabled_(),
    version: KOL_IDS_TRACE_VERSION,
    timestamp: new Date().toISOString()
  };
  Logger.log('[TRACE][STATUS] ' + JSON.stringify(status));
  return status;
}

function KOL_IDS_TRACE_ENTER_(fn) {
  if (KOL_IDS_TRACE_hotPathSkipped_(fn)) return;
  if (!KOL_IDS_TRACE_enabled_()) return;
  Logger.log('[TRACE][ENTER] ' + fn);
}

function KOL_IDS_TRACE_EXIT_(fn, elapsedMs) {
  if (KOL_IDS_TRACE_hotPathSkipped_(fn)) return;
  if (!KOL_IDS_TRACE_enabled_()) return;
  Logger.log('[TRACE][EXIT] ' + fn + ' | ' + Math.max(0, Number(elapsedMs) || 0) + 'ms');
}

function KOL_IDS_TRACE_INFO_(fn, message, data) {
  if (!KOL_IDS_TRACE_enabled_()) return;
  var suffix = '';
  try {
    if (data !== undefined && data !== null) {
      suffix = ' | ' + JSON.stringify(data);
    }
  } catch (ignore) {
    suffix = '';
  }
  Logger.log('[TRACE][INFO] ' + fn + ' | ' + String(message || '') + suffix);
}

function KOL_IDS_TRACE_ERROR_(fn, err) {
  if (KOL_IDS_TRACE_hotPathSkipped_(fn)) return;
  if (!KOL_IDS_TRACE_enabled_()) return;
  var message = '';
  try {
    message = err && err.message ? String(err.message) : String(err);
  } catch (ignore) {
    message = 'Unknown error';
  }
  Logger.log('[TRACE][ERROR] ' + fn + ' | ' + message);
}
