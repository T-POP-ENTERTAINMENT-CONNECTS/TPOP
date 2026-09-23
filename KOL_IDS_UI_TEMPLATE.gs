/** KOL IDS™ 1.1.0 — UI template include helper. */
function KOL_IDS_EXEC_ORIGINAL_include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function include() {
  return KOL_IDS_EXECUTION_LOG_run_('include', KOL_IDS_EXEC_ORIGINAL_include, this, arguments);
}
