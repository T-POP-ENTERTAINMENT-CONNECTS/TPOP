/**
 * KOL IDS™ — Enterprise Runtime Compatibility Bridge
 *
 * Purpose:
 * - Prevent cross-file runtime failures when an Enterprise implementation file
 *   has not been loaded/compiled in the current Apps Script project.
 * - Preserve the canonical KOL_IDS_ENT_EXECUTE_ implementation whenever it exists.
 * - Keep DATA / IMPACT / SELF-SERVICE callers on one transaction contract.
 *
 * This bridge does NOT redefine KOL_IDS_ENT_EXECUTE_. It uses it when available.
 * If the canonical implementation is unavailable, it fails closed through the
 * available Enterprise gate instead of silently bypassing security.
 */
function KOL_IDS_ENT_EXECUTE_BRIDGE_(action, isWrite, fn, idempotencyKey) {
  if (typeof KOL_IDS_ENT_EXECUTE_ === 'function') {
    return KOL_IDS_ENT_EXECUTE_(action, isWrite, fn, idempotencyKey);
  }

  if (typeof KOL_IDS_ENT_GATE_ !== 'function') {
    throw new Error(
      'Enterprise runtime unavailable: KOL_IDS_ENT_EXECUTE_ and KOL_IDS_ENT_GATE_ are both missing. ' +
      'Import/restore KOL_IDS_ENTERPRISE.gs before running Enterprise DATA/IMPACT/SELF-SERVICE functions.'
    );
  }

  // Fail closed through the Enterprise authorization gate.
  var context = KOL_IDS_ENT_GATE_(action, !!isWrite);
  var lock = isWrite ? LockService.getUserLock() : null;
  try {
    if (lock) lock.waitLock(25000);
    var result = fn(context);
    if (typeof KOL_IDS_ENT_AUDIT_ === 'function') {
      try { KOL_IDS_ENT_AUDIT_(action, 'SUCCESS', {workspaceId: context && context.workspaceId}); } catch (auditError) {}
    }
    return result;
  } catch (error) {
    if (typeof KOL_IDS_ENT_AUDIT_ === 'function') {
      try { KOL_IDS_ENT_AUDIT_(action, 'FAILURE', {message:String(error && error.message || error).slice(0,500)}); } catch (auditError) {}
    }
    throw error;
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function KOL_IDS_ENTERPRISE_RUNTIME_DEPENDENCY_QA() {
  var canonical = typeof KOL_IDS_ENT_EXECUTE_ === 'function';
  var gate = typeof KOL_IDS_ENT_GATE_ === 'function';
  var audit = typeof KOL_IDS_ENT_AUDIT_ === 'function';
  var data = typeof KOL_IDS_ENT_DATA_RECONCILE_ === 'function';
  var systemSpreadsheet = typeof KOL_IDS_SYSTEM_getSpreadsheet_ === 'function';
  var result = {
    success: canonical && gate && data && systemSpreadsheet,
    canonicalExecute: canonical,
    enterpriseGate: gate,
    enterpriseAudit: audit,
    enterpriseDataReconcile: data,
    systemSpreadsheet: systemSpreadsheet,
    bridge: true,
    checkedAt: new Date().toISOString()
  };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}
