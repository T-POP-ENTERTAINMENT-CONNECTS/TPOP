/**
 * KOL IDS™ — Control Center Runtime Recovery Bridge
 * V11: keeps MASTER QA executable when an Apps Script project was imported
 * without the primary control runner file. Uses the canonical runner first;
 * compatibility shims are only fallback entrypoints.
 */
function KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE_SAFE_() {
  if (typeof KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE === 'function') {
    return KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE();
  }
  if (typeof KOL_IDS_CONTROL_runControlCenter === 'function') {
    return KOL_IDS_CONTROL_runControlCenter();
  }
  if (typeof KOL_IDS_CONTROL_buildControlCenter === 'function') {
    return KOL_IDS_CONTROL_buildControlCenter();
  }
  if (typeof KOL_IDS_CONTROL_prepareControlCenter_ === 'function') {
    var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
    KOL_IDS_CONTROL_prepareControlCenter_(ss);
    return {success:true, status:'READY', action:'PREPARE_CONTROL_CENTER_RECOVERY', sheet:'13_CONTROL_CENTER'};
  }
  throw new Error('KOL_IDS Control Center runtime is not installed. Import KOL_IDS_CONTROL.gs from the release ZIP.');
}
