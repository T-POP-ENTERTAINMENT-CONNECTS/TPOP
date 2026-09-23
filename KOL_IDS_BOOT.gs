/**
 * KOL IDS™ LEGACY_V25.11 — FAST BOOT V2 END PATCH
 *
 * Purpose:
 * 1) Keep the existing UI exactly as-is.
 * 2) Remove the heavy KOL_IDS_PRODUCT_UI_GET_STATE() call from login.
 * 3) Prevent SpreadsheetApp.getUi().alert()/toast() from blocking a Web App request.
 * 4) Keep first-workspace initialization safe and idempotent.
 * 5) Return a lightweight state packet so the UI can enter the workspace quickly.
 *
 * APPEND THIS FILE AT THE VERY END OF THE APPS SCRIPT PROJECT.
 */

var KOL_IDS_FAST_BOOT_VERSION = '25.11.4-fast-boot-v2';

function KOL_IDS_SELF_FAST_BOOT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_FAST_BOOT');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    /*
     * 1.0.0 CUSTOMER PRODUCTION BOOT V2
     * ----------------------------------
     * FAST_BOOT is deliberately transport/authentication only.
     * It MUST NOT create/open/bind a spreadsheet, initialize schema, run
     * PRODUCT_SETUP, or scan campaign/KOL state. Those operations belong to
     * INIT_WORKSPACE after the customer shell is visible.
     *
     * This makes first paint independent of spreadsheet cold-start latency.
     */
    return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('FAST_BOOT', false, function(identity) {
      var started = Date.now();
      var props = PropertiesService.getUserProperties();
      var email = String((identity && identity.email) || '').trim().toLowerCase();
      var authenticatedCustomerSession = !!(identity && identity.customerSession);
      if (!email && !authenticatedCustomerSession) {
        throw new Error('KOL IDS™: Google Account identity is unavailable and no verified customer session exists.');
      }

      /* Prefer the authoritative SaaS customer session workspace. The
         sign-in layer writes this session before FAST_BOOT is called. Falling
         back to the legacy workspace property preserves demo/self-service. */
      var sessionWorkspaceId = '';
      try {
        var rawSession = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
        if (rawSession) {
          var parsedSession = JSON.parse(rawSession);
          if (parsedSession && String(parsedSession.status || '').toUpperCase() === 'ACTIVE') {
            sessionWorkspaceId = String(parsedSession.spreadsheetId || '').trim();
          }
        }
      } catch (ignoreSession) {}
      var workspaceId = sessionWorkspaceId || String(props.getProperty('KOL_IDS_WORKSPACE_ID') || '').trim();
      var ready = workspaceId ? props.getProperty('KOL_IDS_WORKSPACE_READY_' + workspaceId) === '1' : false;

      return {
        success: true,
        boot: {
          success: true,
          email: email,
          workspaceId: workspaceId,
          workspaceName: '',
          workspaceCreated: false,
          version: (typeof KOL_IDS_SELF !== 'undefined' ? KOL_IDS_SELF.VERSION : KOL_IDS_FAST_BOOT_VERSION),
          fastBootVersion: '25.18-customer-production-boot-v2',
          ready: ready,
          serverElapsedMs: new Date().getTime() - started,
          deferredInitialization: true
        },
        state: {
          success: true,
          analysisId: String(props.getProperty('KOL_IDS_ACTIVE_ANALYSIS_ID') || props.getProperty('KBIS_ACTIVE_ANALYSIS_ID') || '').trim(),
          campaignId: '',
          brandId: '',
          kols: [],
          selectedCreators: [],
          decisionParameters: null,
          context: {brand:{},campaign:{},audience:{}},
          workspaceId: workspaceId,
          email: email,
          workspaceName: ''
        },
        serverMs: new Date().getTime()
      };
    });
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_FAST_BOOT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_FAST_BOOT', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_BOOT_FAST_BOOT_READ_CONTEXT_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_BOOT_FAST_BOOT_READ_CONTEXT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var brand = {id:'',name:'',category:'',market:'',positioning:''};
  var campaign = {id:'',name:'',brandId:'',objective:'',audience:'',primaryKpi:'',secondaryKpi:'',budget:0,currency:'THB',startDate:'',endDate:''};
  var audience = {description:'',age:'',gender:'',location:'',behavior:'',goalsNeeds:'',painPoints:'',lifestyle:''};

  var bs = ss.getSheetByName('02_BRAND_PROFILE');
  if (bs && bs.getLastRow() >= 2) {
    var bLast = Math.min(Math.max(bs.getLastColumn(), 5), 15);
    var b = bs.getRange(2, 1, 1, bLast).getValues()[0];
    brand.id = String(b[0] || '');
    brand.name = String(b[1] || '');
    brand.category = String(b[2] || '');
    brand.market = String(b[3] || '');
    brand.positioning = String(b[5] || b[4] || '');
  }

  var cs = ss.getSheetByName('03_CAMPAIGN');
  if (cs && cs.getLastRow() >= 2) {
    var c = cs.getRange(2, 1, 1, Math.min(Math.max(cs.getLastColumn(), 11), 19)).getValues()[0];
    campaign.id = String(c[0] || '');
    campaign.name = String(c[1] || '');
    campaign.brandId = String(c[2] || '');
    campaign.objective = String(c[3] || '');
    campaign.audience = String(c[4] || '');
    campaign.primaryKpi = String(c[5] || '');
    campaign.secondaryKpi = String(c[6] || '');
    campaign.budget = Number(c[7] || 0) || 0;
    campaign.currency = String(c[8] || 'THB');
    campaign.startDate = c[9] || '';
    campaign.endDate = c[10] || '';
    audience.description = campaign.audience;
  }

  return {brand:brand, campaign:campaign, audience:audience};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_BOOT_FAST_BOOT_READ_CONTEXT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_BOOT_FAST_BOOT_READ_CONTEXT_', Date.now() - __kolIdsTraceStartedAt);
  }
}
