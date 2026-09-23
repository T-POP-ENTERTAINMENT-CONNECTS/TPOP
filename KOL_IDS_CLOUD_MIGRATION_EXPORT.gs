/**
 * KOL IDS Cloud Migration Export
 *
 * Safe first-stage migration utility.
 * It READS canonical KOL IDS sheets and returns JSON payloads for migration.
 * It does not delete, rewrite, or alter the current production workbook.
 */
function KOL_IDS_CLOUD_EXPORT_CANONICAL_DATA() {
  var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  if (!ss) throw new Error('KOL_IDS: production spreadsheet not found.');

  var names = [
    '01_SYSTEM','02_BRAND_PROFILE','03_CAMPAIGN','04_KOL_DATABASE',
    '05_BRAND_FIT','06_BRAND_IMPACT','07_KOL_DECISION','08_KOL_MANAGEMENT',
    '09_PERFORMANCE','10_LEARNING','12_PORTFOLIO'
  ];
  var out = {exportedAt:new Date().toISOString(), spreadsheetId:ss.getId(), sheets:{}};

  names.forEach(function(name){
    var sh = ss.getSheetByName(name);
    if (!sh) { out.sheets[name] = {present:false,headers:[],rows:[]}; return; }
    var values = sh.getDataRange().getValues();
    var headers = values.length ? values[0].map(String) : [];
    out.sheets[name] = {
      present:true,
      headers:headers,
      rows:values.length > 1 ? values.slice(1) : []
    };
  });
  return out;
}

function KOL_IDS_CLOUD_EXPORT_CANONICAL_DATA_JSON() {
  return JSON.stringify(KOL_IDS_CLOUD_EXPORT_CANONICAL_DATA());
}
