/**
 * KOL IDS™ — DETAILED EXECUTION LOG / OBSERVABILITY
 * Version: 1.0.0
 *
 * Purpose:
 * - Make manually-run server functions show real execution details in
 *   Apps Script Execution log, not only "Execution started/completed".
 * - Log START / RESULT / ERROR / END with elapsed time.
 * - Never log arguments, access keys, PINs, tokens, passwords, or full
 *   customer payloads.
 *
 * Existing KOL_IDS_TRACE_* remains the low-level function trace.
 * This layer adds the missing result-level boundary for public entrypoints
 * that did not previously have a trace wrapper.
 */

var KOL_IDS_EXECUTION_LOG_VERSION = '1.0.0';

function KOL_IDS_EXECUTION_LOG_sanitize_(value, depth) {
  depth = Number(depth || 0);
  if (depth > 3) return '[MAX_DEPTH]';

  if (value === null || value === undefined) return value;

  var type = typeof value;
  if (type === 'string') {
    var s = String(value);
    return s.length > 500 ? s.slice(0, 500) + '…[TRUNCATED]' : s;
  }
  if (type === 'number' || type === 'boolean') return value;

  if (Object.prototype.toString.call(value) === '[object Date]') {
    try { return value.toISOString(); } catch (e) { return String(value); }
  }

  if (Array.isArray(value)) {
    var arr = value.slice(0, 5).map(function(x) {
      return KOL_IDS_EXECUTION_LOG_sanitize_(x, depth + 1);
    });
    if (value.length > 5) arr.push('…[' + value.length + ' items total]');
    return arr;
  }

  if (type === 'object') {
    var out = {};
    var sensitive = {
      accesskey:true, accesscode:true, accesstoken:true, token:true,
      pin:true, password:true, secret:true, authorization:true,
      credential:true, credentials:true
    };
    Object.keys(value).slice(0, 40).forEach(function(k) {
      var lk = String(k).toLowerCase().replace(/[\s_-]/g, '');
      if (sensitive[lk]) {
        out[k] = '[REDACTED]';
      } else {
        out[k] = KOL_IDS_EXECUTION_LOG_sanitize_(value[k], depth + 1);
      }
    });
    if (Object.keys(value).length > 40) out.__moreKeys = Object.keys(value).length - 40;
    return out;
  }

  return String(value);
}

function KOL_IDS_EXECUTION_LOG_resultSummary_(result) {
  var safe = KOL_IDS_EXECUTION_LOG_sanitize_(result, 0);

  // Keep Execution log useful and bounded.
  var text = '';
  try { text = JSON.stringify(safe); } catch (e) { text = String(safe); }
  if (text.length > 7000) text = text.slice(0, 7000) + '…[RESULT_TRUNCATED]';

  var status = 'SUCCESS';
  if (result && typeof result === 'object') {
    if (result.success === false) status = 'FAIL';
    else if (String(result.status || '').toUpperCase() === 'FAIL') status = 'FAIL';
    else if (String(result.status || '').toUpperCase() === 'ERROR') status = 'ERROR';
  }

  return { status: status, result: text };
}

function KOL_IDS_EXECUTION_LOG_run_(name, fn, receiver, argsLike) {
  var started = Date.now();
  var argsCount = argsLike && typeof argsLike.length === 'number' ? argsLike.length : 0;

  Logger.log('============================================================');
  Logger.log('[EXECUTION][START] ' + name);
  Logger.log('[EXECUTION][INFO] version=' + KOL_IDS_EXECUTION_LOG_VERSION + ' | args=' + argsCount);

  try {
    var result = fn.apply(receiver, Array.prototype.slice.call(argsLike || []));
    var summary = KOL_IDS_EXECUTION_LOG_resultSummary_(result);

    Logger.log('[EXECUTION][RESULT] ' + name + ' | status=' + summary.status);
    Logger.log('[EXECUTION][RESULT_DATA] ' + summary.result);
    Logger.log('[EXECUTION][END] ' + name + ' | elapsedMs=' + (Date.now() - started));
    Logger.log('============================================================');

    return result;
  } catch (e) {
    var message = '';
    try { message = e && e.message ? String(e.message) : String(e); }
    catch (ignore) { message = 'Unknown error'; }

    Logger.log('[EXECUTION][ERROR] ' + name + ' | ' + message);
    if (e && e.stack) Logger.log('[EXECUTION][STACK] ' + String(e.stack).slice(0, 7000));
    Logger.log('[EXECUTION][END] ' + name + ' | status=ERROR | elapsedMs=' + (Date.now() - started));
    Logger.log('============================================================');

    throw e;
  }
}

/**
 * Manual diagnostic:
 * Run this function once to verify that detailed Execution logging is active.
 */
function KOL_IDS_EXECUTION_LOG_TEST() {
  var result = {
    success: true,
    logger: 'ACTIVE',
    version: KOL_IDS_EXECUTION_LOG_VERSION,
    timestamp: new Date().toISOString(),
    message: 'Detailed execution logging is active. Public entrypoints patched in this release will also emit RESULT_DATA.'
  };
  Logger.log('[EXECUTION][TEST_RESULT] ' + JSON.stringify(result));
  return result;
}
