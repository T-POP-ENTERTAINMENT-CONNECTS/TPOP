/**
 * 1.0.0 Campaign Save diagnostic.
 * Read-only: verifies the active customer session/workspace and the runtime
 * support sheet required by Campaign save. Does not mutate campaign data.
 */
function KOL_IDS_CAMPAIGN_SAVE_DIAGNOSTIC() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CAMPAIGN_SAVE_DIAGNOSTIC');
  var started = Date.now();
  try {
    var props = PropertiesService.getUserProperties();
    var raw = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    var session = raw ? JSON.parse(raw) : null;
    if (!session || String(session.status || '').toUpperCase() !== 'ACTIVE') {
      throw new Error('No ACTIVE SaaS customer session.');
    }
    var workspaceId = String(session.spreadsheetId || '').trim();
    if (!workspaceId) throw new Error('Customer workspace ID is missing.');
    var ss = SpreadsheetApp.openById(workspaceId);
    var sheet = ss.getSheetByName('15_WORKFLOW_MEMORY');
    return {
      success: true,
      workspaceId: workspaceId,
      workspaceName: ss.getName(),
      workflowMemorySheetExists: !!sheet,
      workflowMemoryRows: sheet ? sheet.getLastRow() : 0,
      workflowMemoryColumns: sheet ? sheet.getLastColumn() : 0,
      elapsedMs: Date.now() - started
    };
  } catch (e) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CAMPAIGN_SAVE_DIAGNOSTIC', e);
    return { success:false, error:String(e && e.message || e), elapsedMs:Date.now()-started };
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CAMPAIGN_SAVE_DIAGNOSTIC', Date.now() - started);
  }
}
