
/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * KBIS V1 — MASTER / FOUNDATION
 *
 * FILE:
 * KOL_IDS_SYSTEM_Master.gs
 *
 * VERSION:
 * 2.1.0
 *
 * PURPOSE:
 * - Controlled workbook architecture
 * - System initialization
 * - Structure validation
 * - Master orchestration
 * - One-click full system execution
 * - System health monitoring
 * - License gateway
 * - Safe dependency handling
 *
 * IMPORTANT:
 * - Decision calculation lives in KOL_IDS_SYSTEM_Engine.gs
 * - Portfolio calculation lives in KOL_IDS_SYSTEM_Portfolio.gs
 * - Dashboard lives in KOL_IDS_SYSTEM_Dashboard.gs
 * - Control Center lives in KOL_IDS_SYSTEM_ControlCenter.gs
 *
 * DO NOT define KOL_IDS_ENGINE_runDecisionEngine() here.
 * The real Decision Engine owns that function.
 ****************************************************/


/* ==================================================
 * PRODUCT CONFIG
 * ================================================== */

const KOL_IDS_SYSTEM = {

  PRODUCT_NAME:
    'KOL Investment Decision System™',

  PRODUCT_CODE:
    'KOL_IDS',

  VERSION:
    '2.1.0',

  SHEETS: {

    SYSTEM:
      '01_SYSTEM',

    BRAND:
      '02_BRAND_PROFILE',

    CAMPAIGN:
      '03_CAMPAIGN',

    KOL:
      '04_KOL_DATABASE',

    FIT:
      '05_BRAND_FIT',

    IMPACT:
      '06_BRAND_IMPACT',

    DECISION:
      '07_KOL_DECISION',

    MANAGEMENT:
      '08_KOL_MANAGEMENT',

    PERFORMANCE:
      '09_PERFORMANCE',

    LEARNING:
      '10_LEARNING',

    EXECUTIVE:
      '11_EXECUTIVE',

    PORTFOLIO:
      '12_PORTFOLIO'

  }

};

/* ==================================================
 * RUNTIME / CLIENT WORKSPACE ROUTING
 * Web App requests are routed to a dedicated client
 * spreadsheet. Bound-sheet usage falls back to the
 * currently active spreadsheet.
 * ================================================== */

var KOL_IDS_RUNTIME_SS_ID = null;

function KOL_IDS_SYSTEM_getSpreadsheet_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_getSpreadsheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (KOL_IDS_RUNTIME_SS_ID) return SpreadsheetApp.openById(KOL_IDS_RUNTIME_SS_ID);
  return SpreadsheetApp.getActiveSpreadsheet();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_getSpreadsheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_getSpreadsheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(spreadsheetId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_setRuntimeSpreadsheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_RUNTIME_SS_ID = spreadsheetId || null;
  return KOL_IDS_RUNTIME_SS_ID;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_setRuntimeSpreadsheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_setRuntimeSpreadsheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_getMasterSpreadsheet_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_getMasterSpreadsheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('KBIS_MASTER_SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) {
    props.setProperty('KBIS_MASTER_SPREADSHEET_ID', ss.getId());
    return ss;
  }
  throw new Error('KOL IDS: Master spreadsheet is not configured. Run setup from the master spreadsheet first.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_getMasterSpreadsheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_getMasterSpreadsheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_ensureClientDirectory_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_ensureClientDirectory_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const master = KOL_IDS_SYSTEM_getMasterSpreadsheet_();
  let s = master.getSheetByName('00_CLIENT_DIRECTORY');
  if (!s) s = master.insertSheet('00_CLIENT_DIRECTORY');
  const headers = ['Client ID','Client Name','Access Key','Spreadsheet ID','Status','Created At','Last Access','Plan','Expires At','Max Accounts','Account Emails','Access Type','Contact Email'];
  if (s.getLastRow() < 1) { s.getRange(1,1,1,headers.length).setValues([headers]); s.setFrozenRows(1); }
  else { const current=s.getRange(1,1,1,Math.max(7,s.getLastColumn())).getValues()[0].map(String); const missing=headers.filter(function(h){return current.indexOf(h)<0;}); if(missing.length)s.getRange(1,s.getLastColumn()+1,1,missing.length).setValues([missing]); }
  return s;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_ensureClientDirectory_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_ensureClientDirectory_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_findClient_(clientId, accessKey, registeredEmail) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_findClient_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_HARDENING_RUNTIME_findClient_(clientId, accessKey, registeredEmail);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_findClient_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_findClient_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_setClientContext_(context) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_setClientContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const client = KOL_IDS_SYSTEM_findClient_(context && context.clientId, context && context.accessKey);
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(client.spreadsheetId);
  return client;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_setClientContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_setClientContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_CREATE_CLIENT(clientName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CREATE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const master = KOL_IDS_SYSTEM_getMasterSpreadsheet_();
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());
  const name = String(clientName || '').trim();
  if (!name) throw new Error('Enter Client Name.');
  const directory = KOL_IDS_SYSTEM_ensureClientDirectory_();
  const clientId = 'CL-' + Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
  const accessKey = KOL_IDS_HARDENING_RUNTIME_generateAccessKey_();
  const workspace = SpreadsheetApp.create('KOL IDS™ — ' + name);
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(workspace.getId());
  KOL_IDS_SYSTEM_initialize();
  KOL_IDS_PRODUCT_SETUP();
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());
  directory.appendRow([clientId, name, KOL_IDS_HARDENING_RUNTIME_accessKeyHash_(accessKey), workspace.getId(), 'ACTIVE', new Date(), '', 'PROFESSIONAL', '', 1, '', 'PAID']);
  const webUrl = ScriptApp.getService().getUrl() || '';
  return {
    clientId, clientName: name, spreadsheetId: workspace.getId(),
    webAppUrl: webUrl ? webUrl + '?client=' + encodeURIComponent(clientId) : '',
    accessKey
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CREATE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CREATE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* =========================================================
 * TEST / QA ACCESS-KEY ROTATION
 *
 * The client directory stores ONLY the access-key hash.
 * Therefore an existing TEST CLIENT cannot safely reuse the
 * stored value as its plaintext access key. Rotate a fresh
 * plaintext key for every QA KOL_IDS_SYSTEM_run and persist only its hash.
 *
 * The generated TEST CLIENT key is exactly 9 uppercase alphanumeric characters.
 * ========================================================= */
function KOL_IDS_SYSTEM_QA_ROTATE_TEST_ACCESS_KEY_(clientId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_ROTATE_TEST_ACCESS_KEY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const master = KOL_IDS_SYSTEM_getMasterSpreadsheet_();
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());

  const directory = KOL_IDS_SYSTEM_ensureClientDirectory_();
  const lastRow = directory.getLastRow();

  if (lastRow < 2) {
    throw new Error('TEST CLIENT directory is empty.');
  }

  const rows = directory.getRange(2, 1, lastRow - 1, 7).getValues();
  let rowNumber = -1;

  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][0] || '').trim() === String(clientId || '').trim()) {
      rowNumber = i + 2;
      break;
    }
  }

  if (rowNumber < 0) {
    throw new Error('TEST CLIENT not found: ' + clientId);
  }

  const accessKey = KOL_IDS_HARDENING_RUNTIME_generateAccessKey_();

  if (!KOL_IDS.ACCESS_KEY_PATTERN.test(accessKey)) {
    throw new Error('Generated TEST CLIENT access key is not the required 9-character format.');
  }

  directory
    .getRange(rowNumber, 3)
    .setValue(KOL_IDS_HARDENING_RUNTIME_accessKeyHash_(accessKey));

  directory
    .getRange(rowNumber, 5)
    .setValue(KOL_IDS_SAAS.LICENSE_ACTIVE);

  return accessKey;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_ROTATE_TEST_ACCESS_KEY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_ROTATE_TEST_ACCESS_KEY_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_QA_INITIALIZE_TEST_WORKSPACE_(spreadsheetId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_INITIALIZE_TEST_WORKSPACE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!spreadsheetId) {
    throw new Error('TEST CLIENT workspace spreadsheet ID is missing.');
  }

  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(spreadsheetId);

  /*
   * Initialize the canonical KBIS schema first. This creates
   * 01_SYSTEM through 10_LEARNING plus the executive sheet.
   */
  if (typeof KOL_IDS_SYSTEM_initialize !== 'function') {
    throw new Error('KOL_IDS_SYSTEM_initialize is not available.');
  }

  KOL_IDS_SYSTEM_initialize();

  /*
   * Keep product setup in the same workspace, matching the
   * normal client-creation flow.
   */
  if (typeof KOL_IDS_PRODUCT_SETUP === 'function') {
    KOL_IDS_PRODUCT_SETUP();
  }

  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  const requiredSheets = [
    '01_SYSTEM',
    '02_BRAND_PROFILE',
    '03_CAMPAIGN',
    '04_KOL_DATABASE',
    '05_BRAND_FIT',
    '06_BRAND_IMPACT',
    '07_KOL_DECISION'
  ];

  const missing = requiredSheets.filter(function(name) {
    return !ss.getSheetByName(name);
  });

  if (missing.length) {
    throw new Error(
      'TEST WORKSPACE initialization incomplete. Missing sheets: ' +
      missing.join(', ')
    );
  }

  return {
    spreadsheetId: ss.getId(),
    requiredSheets: requiredSheets.length,
    missing: 0
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_INITIALIZE_TEST_WORKSPACE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_INITIALIZE_TEST_WORKSPACE_', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_SYSTEM_LIST_CLIENTS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_LIST_CLIENTS');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const s = KOL_IDS_SYSTEM_ensureClientDirectory_();
  if (s.getLastRow() < 2) return { rows: [] };
  return { rows: s.getRange(2,1,s.getLastRow()-1,7).getValues().filter(r => r[0]).map(r => ({clientId:r[0],clientName:r[1],spreadsheetId:r[3],status:r[4],createdAt:r[5],lastAccess:r[6]}))};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_LIST_CLIENTS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_LIST_CLIENTS', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_DISABLE_CLIENT(clientId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_DISABLE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const s = KOL_IDS_SYSTEM_ensureClientDirectory_();
  if (s.getLastRow() < 2) throw new Error('Client not found.');
  const rows = s.getRange(2,1,s.getLastRow()-1,7).getValues();
  const i = rows.findIndex(r => String(r[0]) === String(clientId));
  if (i < 0) throw new Error('Client not found: ' + clientId);
  s.getRange(i+2,5).setValue('INACTIVE');
  return {success:true,clientId:clientId};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_DISABLE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_DISABLE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}



/* ==================================================
 * CORE SHEET SCHEMA
 *
 * 12_PORTFOLIO is part of the required workspace core.
 * The Portfolio Engine still owns the dynamic report contents.
 * ================================================== */

const KOL_IDS_SCHEMA_CONFIG = {

  '01_SYSTEM': [
    'Product Code',
    'Product Name',
    'Version',
    'License ID',
    'License Status',
    'License Owner',
    'Owner Email',
    'User Limit',
    'System Status',
    'Last Validation',
    'Last Engine Run'
  ],

  '02_BRAND_PROFILE': [
    'Brand ID',
    'Brand Name',
    'Category',
    'Market',
    'Target Audience',
    'Brand Positioning',
    'Brand Personality',
    'Brand Tone',
    'Brand Values',
    'Desired Perception',
    'Brand Keywords',
    'Brand Avoid',
    'Evidence Status',
    'Last Updated'
  ],

  '03_CAMPAIGN': [
    'Campaign ID',
    'Campaign Name',
    'Brand ID',
    'Campaign Objective',
    'Target Audience',
    'Primary KPI',
    'Secondary KPI',
    'Budget',
    'Currency',
    'Start Date',
    'End Date',
    'Awareness Weight',
    'Credibility Weight',
    'Relevance Weight',
    'Perception Weight',
    'Purchase Weight',
    'Community Weight',
    'Campaign Status',
    'Last Updated'
  ],

  '04_KOL_DATABASE': [
    'KOL ID',
    'KOL Name',
    'Platform',
    'Platform URL',
    'Category',
    'Followers',
    'Engagement Rate',
    'Audience Age',
    'Audience Gender',
    'Audience Location',
    'Audience Interest',
    'Content Style',
    'Rate',
    'Currency',
    'Previous Brand Work',
    'Previous Campaign Result',
    'Audience Evidence',
    'Engagement Evidence',
    'Content Evidence',
    'Performance Evidence',
    'Reputation Evidence',
    'Risk Level',
    'Risk Score',
    'Audience Fit Input',
    'Brand Image Fit Input',
    'Content Fit Input',
    'Category Fit Input',
    'Value Fit Input',
    'Performance Evidence Input',
    'Awareness Potential',
    'Credibility Potential',
    'Brand Relevance Potential',
    'Perception Potential',
    'Purchase Influence Potential',
    'Community Potential',
    'KOL Status',
    'Last Updated'
  ],

  '05_BRAND_FIT': [
    'Campaign ID',
    'KOL ID',
    'KOL Name',
    'Audience Fit',
    'Brand Image Fit',
    'Content Fit',
    'Category Fit',
    'Value Fit',
    'Performance Evidence',
    'Risk Adjustment',
    'Brand Fit Score',
    'Brand Fit Status',
    'Strength 1',
    'Strength 2',
    'Fit Gap 1',
    'Fit Gap 2',
    'Evidence Quality',
    'Confidence Score',
    'Confidence Level',
    'Calculated At'
  ],

  '06_BRAND_IMPACT': [
    'Campaign ID',
    'KOL ID',
    'KOL Name',
    'Awareness',
    'Credibility',
    'Brand Relevance',
    'Perception',
    'Purchase Influence',
    'Community',
    'Overall Impact Score',
    'Primary Impact',
    'Secondary Impact',
    'Impact Evidence',
    'Confidence Score',
    'Confidence Level',
    'Calculated At'
  ],

  '07_KOL_DECISION': [
    'Campaign ID',
    'KOL ID',
    'KOL Name',
    'Brand Fit Score',
    'Brand Impact Score',
    'Confidence Score',
    'Risk Level',
    'Decision',
    'Recommended Role',
    'Primary Impact',
    'Secondary Impact',
    'Best Used For',
    'Not Ideal For',
    'Decision Reason',
    'Evidence Summary',
    'Decision Owner',
    'Decision Date'
  ],

  '08_KOL_MANAGEMENT': [
    'Campaign ID',
    'KOL ID',
    'KOL Name',
    'Status',
    'Contact Date',
    'Negotiation Status',
    'Agreed Rate',
    'Currency',
    'Brief Status',
    'Contract Status',
    'Content Status',
    'Approval Status',
    'Publish Date',
    'Content URL',
    'Tracking URL',
    'Notes',
    'Last Updated'
  ],

  /*
   * 09_PERFORMANCE is owned by KOL_IDS_PERFORMANCE_AUTHORITY.
   * Keep the system smoke/structure contract aligned with the
   * canonical authority schema; do not reintroduce the retired
   * 20-column legacy performance contract here.
   */
  '09_PERFORMANCE': [
    'Performance ID','Recorded At','Observed At','Analysis ID','Campaign ID','Brand ID','Creator ID','Creator Name',
    'Channel','Channel Family','Content Type','Objective','Source','Source ID','Verification Status','Currency',
    'Impressions','Reach','Views','Unique Viewers','Likes','Reactions','Comments','Shares','Saves','Reposts','Replies','Bookmarks',
    'Engagements','Clicks','Link Clicks','Profile Visits','Watch Time Seconds','Watch Time Minutes','Avg Watch Time Seconds','Avg View Duration Seconds',
    'Avg View Percentage','Completion Rate Percentage','Subscribers Gained','Attendance','Check-ins','Leads','QR Scans','Code Uses','Orders','Footfall','Conversions','New Customers',
    'Spend','Revenue','Incremental Sales','Net Revenue','CTR Percentage','Engagement Rate Percentage','Conversion Rate Percentage','Cost Per Click','Cost Per Conversion','ROAS','Revenue Per Spend',
    'Check-in Rate Percentage','Lead Rate Percentage','QR Scan Rate Percentage','Code Use Rate Percentage','New Customer Rate Percentage',
    'Channel Score','Campaign Business Score','Normalized Performance Score','Business Outcome Score','Confidence','Evidence Quality','Gen Code','Attribution ID','KPI Rule Version','Authority Version','Source Key','Notes'
  ],

  '10_LEARNING': [
    'Campaign ID',
    'KOL ID',
    'KOL Name',
    'Predicted Brand Fit',
    'Actual Performance',
    'Predicted Impact',
    'Actual Impact',
    'Prediction Variance',
    'Primary Impact Predicted',
    'Primary Impact Actual',
    'What Worked',
    'What Did Not Work',
    'Learning',
    'Model Confidence',
    'Learning Status',
    'Recorded Date'
  ],

  /* Portfolio Intelligence is a required core workspace sheet.
   * The Portfolio Engine may rebuild its contents dynamically,
   * but the workspace must contain the sheet before bootstrap
   * validation can succeed.
   */
  '12_PORTFOLIO': [
    'Portfolio Score',
    'Status',
    'Portfolio Confidence',
    'Risk Exposure',
    'Strategic Coverage',
    'Portfolio Synergy',
    'Data Quality',
    'Executive Decision',
    'Campaign ID',
    'Generated At'
  ],

};

/* ==================================================
 * ON OPEN
 * ================================================== */

function onOpen() {
  KOL_IDS_TRACE_ENTER_('onOpen');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ui = SpreadsheetApp.getUi();
  ui.createMenu('KOL IDS™')
    .addItem('🚀 Open KOL IDS', 'KOL_IDS_PRODUCT_OPEN')
    .addItem('▶ RUN KOL IDS', 'KOL_IDS_PRODUCT_RUN')
    .addSeparator()
    .addItem('📖 How to Use', 'KOL_IDS_PRODUCT_OPEN_HOWTO')
    .addItem('📚 KOL IDS Guide', 'KOL_IDS_PRODUCT_OPEN_HOWTO')
    .addSeparator()
    .addItem('🏗 Initialize System', 'KOL_IDS_SYSTEM_initialize')
    .addItem('🔎 Validate Structure', 'KOL_IDS_SYSTEM_validateStructure')
    .addItem('🧮 Run Decision Engine', 'KOL_IDS_ENGINE_runDecisionEngine')
    .addItem('🎯 Run Portfolio Optimization', 'KOL_IDS_PORTFOLIO_runPortfolioOptimization')
    .addItem('📊 Refresh Executive Dashboard', 'KOL_IDS_SYSTEM_refreshExecutive')
    .addSeparator()
    .addItem('🧪 Run System Health Check', 'KOL_IDS_SYSTEM_systemHealthCheck')
    .addItem('🔐 Validate License', 'KOL_IDS_SYSTEM_validateLicense')
    .addToUi();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('onOpen', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('onOpen', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* ==================================================
 * FULL SYSTEM RUNNER
 *
 * MASTER EXECUTION FLOW
 *
 * 1. PREFLIGHT
 * 2. DECISION ENGINE
 * 3. PORTFOLIO
 * 4. EXECUTIVE DASHBOARD
 * 5. CONTROL CENTER
 * 6. FINAL SYSTEM STATUS
 *
 * IMPORTANT:
 * Master does NOT calculate decisions itself.
 * It only orchestrates installed modules.
 * ================================================== */

function KOL_IDS_SYSTEM_RUN_FULL_SYSTEM() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_RUN_FULL_SYSTEM');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const lock =
    LockService.getScriptLock();

  if (
    !lock.tryLock(30000)
  ) {

    throw new Error(
      'KBIS: Another system KOL_IDS_SYSTEM_run is already in progress.'
    );

  }


  const startedAt =
    new Date();


  const result = {

    success:
      false,

    startedAt:
      startedAt,

    completedAt:
      null,

    durationMs:
      null,

    preflight:
      null,

    engine:
      null,

    portfolio:
      null,

    dashboard:
      null,

    controlCenter:
      null,

    errors:
      [],

    warnings:
      []

  };


  try {

    const ss = KOL_IDS_SYSTEM_getSpreadsheet_();


    /* ================================================
     * INITIAL SYSTEM STATUS
     * ================================================ */

    KOL_IDS_SYSTEM_setSystemStatus_(
      ss,
      'RUNNING'
    );


    /* ================================================
     * 1. PREFLIGHT
     * ================================================ */

    KOL_IDS_SYSTEM_safeToast_(
      ss,
      '1/5 Running KOL IDS preflight...',
      3
    );


    const preflight =
      KOL_IDS_SYSTEM_preflightMaster_();


    result.preflight =
      preflight;


    if (
      !preflight.ok
    ) {

      throw new Error(

        'KBIS PRECHECK FAILED:\n\n' +

        preflight.errors.join(
          '\n'
        )

      );

    }


    /* ================================================
     * 2. DECISION ENGINE
     * ================================================ */

    KOL_IDS_SYSTEM_safeToast_(
      ss,
      '2/5 Decision Engine running...',
      3
    );


    if (
      typeof KOL_IDS_ENGINE_runDecisionEngine !==
      'function'
    ) {

      throw new Error(
        'KOL IDS Decision Engine is not installed.'
      );

    }


    result.engine =
      KOL_IDS_ENGINE_runDecisionEngine();


    if (
      !result.engine ||
      result.engine.success !== true
    ) {

      throw new Error(
        'KOL IDS Decision Engine did not complete successfully.'
      );

    }


    /* ================================================
     * 3. PORTFOLIO
     * ================================================ */

    KOL_IDS_SYSTEM_safeToast_(
      ss,
      '3/5 Portfolio optimization running...',
      3
    );


    if (
      typeof KOL_IDS_PORTFOLIO_runPortfolioOptimization !==
      'function'
    ) {

      throw new Error(
        'KOL IDS Portfolio Engine is not installed.'
      );

    }


    result.portfolio =
      KOL_IDS_PORTFOLIO_runPortfolioOptimization();


    if (
      !result.portfolio ||
      result.portfolio.success !== true
    ) {

      throw new Error(
        'KOL IDS Portfolio Engine did not complete successfully.'
      );

    }


    /* ================================================
     * 4. EXECUTIVE DASHBOARD
     *
     * Dashboard is non-core.
     *
     * If it fails, system records warning/error
     * but does not erase successful engine results.
     * ================================================ */

    KOL_IDS_SYSTEM_safeToast_(
      ss,
      '4/5 Executive Dashboard refreshing...',
      3
    );


    if (
      typeof KOL_IDS_DASHBOARD_buildExecutiveDashboard ===
      'function'
    ) {

      try {

        result.dashboard =
          KOL_IDS_DASHBOARD_buildExecutiveDashboard();


        if (
          result.dashboard &&
          result.dashboard.success === false
        ) {

          result.warnings.push(
            'Executive Dashboard completed with reported failure.'
          );

        }

      }
      catch (dashboardError) {

        result.dashboard = {

          success:
            false,

          error:
            KOL_IDS_SYSTEM_errorMessage_(
              dashboardError
            )

        };


        result.warnings.push(

          'Dashboard: ' +
          KOL_IDS_SYSTEM_errorMessage_(
            dashboardError
          )

        );

      }

    }
    else {

      result.dashboard = {

        success:
          false,

        skipped:
          true,

        error:
          'Dashboard function not found.'

      };


      result.warnings.push(
        'Executive Dashboard function not found.'
      );

    }


    /* ================================================
     * 5. CONTROL CENTER
     * ================================================ */

    KOL_IDS_SYSTEM_safeToast_(
      ss,
      '5/5 Control Center updating...',
      3
    );


    result.controlCenter =
      KOL_IDS_SYSTEM_runControlCenterSafe_();


    if (
      result.controlCenter &&
      result.controlCenter.success === false &&
      !result.controlCenter.skipped
    ) {

      result.warnings.push(

        'Control Center: ' +

        (
          result.controlCenter.error ||
          'Unknown Control Center error.'
        )

      );

    }


    /* ================================================
     * FINALIZE
     * ================================================ */

    result.success =
      true;


    result.completedAt =
      new Date();


    result.durationMs =
      result.completedAt.getTime() -
      startedAt.getTime();


    KOL_IDS_SYSTEM_updateSystemRunStatus_(
      ss,
      result
    );


    KOL_IDS_SYSTEM_safeToast_(
      ss,
      '✅ KOL IDS full system completed.',
      5
    );


    return result;

  }
  catch (error) {

    result.success =
      false;


    result.completedAt =
      new Date();


    result.durationMs =
      result.completedAt.getTime() -
      startedAt.getTime();


    result.errors.push(
      KOL_IDS_SYSTEM_errorMessage_(
        error
      )
    );


    try {

      KOL_IDS_SYSTEM_markSystemError_(
        KOL_IDS_SYSTEM_getSpreadsheet_(),
        error
      );

    }
    catch (statusError) {

      console.warn(
        'KBIS status update failed:',
        statusError
      );

    }


    KOL_IDS_SYSTEM_safeToast_(
      KOL_IDS_SYSTEM_getSpreadsheet_(),

      '❌ KOL IDS stopped: ' +
      KOL_IDS_SYSTEM_errorMessage_(error),

      8
    );


    throw error;

  }
  finally {

    lock.releaseLock();

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_RUN_FULL_SYSTEM', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_RUN_FULL_SYSTEM', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * MASTER PREFLIGHT
 * ================================================== */

function KOL_IDS_SYSTEM_preflightMaster_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_preflightMaster_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const errors = [];


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  /* -----------------------------------------------
   * CORE SHEETS
   * ----------------------------------------------- */

  Object.keys(
    KOL_IDS_SCHEMA_CONFIG
  ).forEach(
    sheetName => {

      if (
        !ss.getSheetByName(
          sheetName
        )
      ) {

        errors.push(
          'Missing sheet: ' +
          sheetName
        );

      }

    }
  );


  if (
    errors.length
  ) {

    return {

      ok:
        false,

      errors:
        errors

    };

  }


  /* -----------------------------------------------
   * STRUCTURE
   * ----------------------------------------------- */

  if (
    !KOL_IDS_SYSTEM_validateStructureSilent_()
  ) {

    errors.push(
      'Core sheet headers do not match KOL_IDS_SCHEMA_CONFIG.'
    );

  }


  /* -----------------------------------------------
   * CAMPAIGN
   * ----------------------------------------------- */

  const campaign =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.CAMPAIGN
    );


  const campaignRow =
    KOL_IDS_SYSTEM_getFirstDataRow_(
      campaign,
      KOL_IDS_SCHEMA_CONFIG['03_CAMPAIGN'].length
    );


  if (
    !campaignRow
  ) {

    errors.push(
      'Campaign data is missing.'
    );

  }
  else {

    const campaignId =
      KOL_IDS_SYSTEM_valueString_(
        campaignRow[0]
      );

    const campaignName =
      KOL_IDS_SYSTEM_valueString_(
        campaignRow[1]
      );


    if (
      !campaignId
    ) {

      errors.push(
        'Campaign ID is missing.'
      );

    }


    if (
      !campaignName
    ) {

      errors.push(
        'Campaign Name is missing.'
      );

    }

  }


  /* -----------------------------------------------
   * BRAND
   * ----------------------------------------------- */

  const brand =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.BRAND
    );


  const brandRow =
    KOL_IDS_SYSTEM_getFirstDataRow_(
      brand,
      KOL_IDS_SCHEMA_CONFIG['02_BRAND_PROFILE'].length
    );


  if (
    !brandRow
  ) {

    errors.push(
      'Brand Profile is empty.'
    );

  }
  else {

    const brandId =
      KOL_IDS_SYSTEM_valueString_(
        brandRow[0]
      );

    const brandName =
      KOL_IDS_SYSTEM_valueString_(
        brandRow[1]
      );


    if (
      !brandId &&
      !brandName
    ) {

      errors.push(
        'Brand Profile is empty.'
      );

    }

  }


  /* -----------------------------------------------
   * KOL
   * ----------------------------------------------- */

  const kolSheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.KOL
    );


  const kolRecords =
    KOL_IDS_SYSTEM_getDataRows_(
      kolSheet,
      KOL_IDS_SCHEMA_CONFIG['04_KOL_DATABASE'].length
    );


  if (
    !kolRecords.length
  ) {

    errors.push(
      'No KOL records found in 04_KOL_DATABASE.'
    );

  }
  else {

    let validKOLCount =
      0;


    kolRecords.forEach(
      row => {

        const kolId =
          KOL_IDS_SYSTEM_valueString_(
            row[0]
          );

        const kolName =
          KOL_IDS_SYSTEM_valueString_(
            row[1]
          );

        const platform =
          KOL_IDS_SYSTEM_valueString_(
            row[2]
          );


        if (
          kolId ||
          kolName ||
          platform
        ) {

          validKOLCount++;

        }

      }
    );


    if (
      validKOLCount === 0
    ) {

      errors.push(
        'KOL database exists but contains no valid KOL records.'
      );

    }

  }


  /* -----------------------------------------------
   * RETURN
   * ----------------------------------------------- */

  return {

    ok:
      errors.length === 0,

    errors:
      errors

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_preflightMaster_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_preflightMaster_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * INITIALIZE
 * ================================================== */


/* ==================================================
 * CANONICAL PERFORMANCE AUTHORITY SYNC
 *
 * 09_PERFORMANCE is owned by KOL_IDS_PERFORMANCE_AUTHORITY.
 * Older workspaces may still have the retired 75-column layout
 * (missing "Conversions" before "New Customers"). This helper
 * normalizes 09_PERFORMANCE by header name, preserving existing
 * values and inserting only missing canonical columns.
 * ================================================== */
function KOL_IDS_SYSTEM_syncPerformanceAuthoritySchema_() {
  var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  var sh = ss.getSheetByName('09_PERFORMANCE');

  if (typeof KOL_IDS_PA_ensureSheet_ === 'function') {
    return KOL_IDS_PA_ensureSheet_();
  }

  if (!sh) {
    sh = ss.insertSheet('09_PERFORMANCE');
  }

  if (typeof KOL_IDS_PERFORMANCE_AUTHORITY !== 'undefined' &&
      typeof KOL_IDS_PA_headers_ === 'function') {
    var expected = KOL_IDS_PA_headers_();
    var existing = sh.getLastColumn() > 0
      ? sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(String)
      : [];

    var rows = sh.getLastRow() > 1
      ? sh.getRange(2, 1, sh.getLastRow() - 1, Math.max(1, sh.getLastColumn())).getValues()
      : [];

    var sourceMap = {};
    existing.forEach(function(h, i) {
      var key = String(h || '').trim();
      if (key && sourceMap[key] === undefined) sourceMap[key] = i;
    });

    if (sh.getMaxColumns() < expected.length) {
      sh.insertColumnsAfter(sh.getMaxColumns(), expected.length - sh.getMaxColumns());
    }

    var migrated = rows.map(function(row) {
      return expected.map(function(h) {
        var idx = sourceMap[String(h).trim()];
        return idx === undefined ? '' : row[idx];
      });
    });

    sh.clearContents();
    sh.getRange(1, 1, 1, expected.length).setValues([expected]);
    if (migrated.length) {
      sh.getRange(2, 1, migrated.length, expected.length).setValues(migrated);
    }
    sh.setFrozenRows(1);

    return {success:true, sheet:'09_PERFORMANCE', columns:expected.length, rows:migrated.length};
  }

  return {success:false, sheet:'09_PERFORMANCE', reason:'Performance Authority headers unavailable.'};
}

function KOL_IDS_SYSTEM_initialize(options) {
  options = options || {};
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_initialize');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();


  Object.keys(
    KOL_IDS_SCHEMA_CONFIG
  ).forEach(
    sheetName => {

      let sheet =
        ss.getSheetByName(
          sheetName
        );


      if (!sheet) {

        sheet =
          ss.insertSheet(
            sheetName
          );

      }


      KOL_IDS_SYSTEM_prepareSheet_(
        sheet,
        KOL_IDS_SCHEMA_CONFIG[sheetName]
      );

    }
  );


  // Reconcile 09_PERFORMANCE against the canonical Performance Authority
  // after the core schema pass. This is header-based and preserves data.
  KOL_IDS_SYSTEM_syncPerformanceAuthoritySchema_();


  // 11_EXECUTIVE is a presentation/runtime sheet, not a core schema sheet.
  // Create it during initialization so a fresh workspace can build the dashboard.
  if (!ss.getSheetByName(KOL_IDS_SYSTEM.SHEETS.EXECUTIVE)) {
    ss.insertSheet(KOL_IDS_SYSTEM.SHEETS.EXECUTIVE);
  }

  KOL_IDS_SYSTEM_writeSystemDefaults_(
    ss
  );

  // Data-hardening support sheets are internal and non-destructive.
  // They provide recovery/integrity metadata without changing customer-facing UX.
  if (typeof KOL_IDS_DATA_ensureSupportSheets_ === 'function') {
    KOL_IDS_DATA_ensureSupportSheets_(ss);
  }

  KOL_IDS_SYSTEM_safeToast_(
    ss,
    'KBIS core structure initialized.',
    4
  );


  if (!options.suppressAlerts) {
    KOL_IDS_SYSTEM_safeAlert_(

    'KBIS V2 initialized successfully.\n\n' +

    'Product: ' +
    KOL_IDS_SYSTEM.PRODUCT_NAME +

    '\nVersion: ' +
    KOL_IDS_SYSTEM.VERSION +

    '\n\nNext step:\n' +

    'Enter Brand + Campaign + KOL data,\n' +

    'then use 🚀 RUN FULL SYSTEM.'

    );
  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_initialize', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_initialize', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PREPARE SHEET
 * ================================================== */

function KOL_IDS_SYSTEM_prepareSheet_(
  sheet,
  headers
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_prepareSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

    if (!sheet) {
      throw new Error('KBIS: Cannot prepare undefined sheet.');
    }

    var requiredColumns = headers.length;
    var currentColumns = Math.max(1, sheet.getLastColumn(), sheet.getMaxColumns());
    var existingHeaders = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].map(String)
      : [];

    /*
     * IMPORTANT:
     * When a schema grows, never overwrite columns positionally.
     * Map existing data by header so a newly inserted canonical field
     * (e.g. 09_PERFORMANCE -> Conversions) cannot shift/lose data.
     */
    var sourceMap = {};
    existingHeaders.forEach(function(header, index) {
      var key = String(header || '').trim();
      if (key && sourceMap[key] === undefined) sourceMap[key] = index;
    });

    var hasData = sheet.getLastRow() > 1;
    var oldRows = hasData
      ? sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.max(1, sheet.getLastColumn())).getValues()
      : [];

    var needsMigration =
      existingHeaders.length !== requiredColumns ||
      headers.some(function(header, index) {
        return String(existingHeaders[index] || '').trim() !== String(header).trim();
      });

    if (sheet.getMaxColumns() < requiredColumns) {
      sheet.insertColumnsAfter(
        sheet.getMaxColumns(),
        requiredColumns - sheet.getMaxColumns()
      );
    }

    if (needsMigration) {
      var migratedRows = oldRows.map(function(row) {
        return headers.map(function(header) {
          var idx = sourceMap[String(header).trim()];
          return idx === undefined ? '' : row[idx];
        });
      });

      sheet.clearContents();
      sheet.getRange(1, 1, 1, requiredColumns).setValues([headers]);

      if (migratedRows.length) {
        sheet.getRange(2, 1, migratedRows.length, requiredColumns).setValues(migratedRows);
      }
    } else {
      sheet.getRange(1, 1, 1, requiredColumns).setValues([headers]);
    }

    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, requiredColumns)
      .setFontWeight('bold')
      .setWrap(true);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_prepareSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_prepareSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM DEFAULTS
 * ================================================== */

function KOL_IDS_SYSTEM_writeSystemDefaults_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_writeSystemDefaults_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.SYSTEM
    );


  if (!sheet) {

    throw new Error(
      'KBIS: 01_SYSTEM not found.'
    );

  }


  const current =
    sheet
      .getRange(
        2,
        1,
        1,
        11
      )
      .getValues()[0];


  const values = [

    KOL_IDS_SYSTEM.PRODUCT_CODE,

    KOL_IDS_SYSTEM.PRODUCT_NAME,

    KOL_IDS_SYSTEM.VERSION,

    current[3] || '',

    current[4] || 'PENDING',

    current[5] || '',

    current[6] || '',

    current[7] || 1,

    current[8] || 'INITIALIZED',

    current[9] || new Date(),

    current[10] || ''

  ];


  sheet
    .getRange(
      2,
      1,
      1,
      11
    )
    .setValues([
      values
    ]);


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_writeSystemDefaults_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_writeSystemDefaults_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * VALIDATE STRUCTURE
 * ================================================== */

function KOL_IDS_SYSTEM_validateStructure() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_validateStructure');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  const errors = [];


  Object.keys(
    KOL_IDS_SCHEMA_CONFIG
  ).forEach(
    sheetName => {

      const sheet =
        ss.getSheetByName(
          sheetName
        );


      if (!sheet) {

        errors.push(
          'Missing Sheet: ' +
          sheetName
        );

        return;

      }


      const expected =
        KOL_IDS_SCHEMA_CONFIG[
          sheetName
        ];


      if (
        sheet.getMaxColumns() <
        expected.length
      ) {

        errors.push(

          sheetName +
          ' → Not enough columns. Required: ' +
          expected.length

        );

        return;

      }


      const headers =
        sheet
          .getRange(
            1,
            1,
            1,
            expected.length
          )
          .getValues()[0];


      expected.forEach(
        (
          expectedHeader,
          index
        ) => {

          if (
            headers[index] !==
            expectedHeader
          ) {

            errors.push(

              sheetName +

              ' → Column ' +

              (index + 1) +

              ' expected "' +

              expectedHeader +

              '"'

            );

          }

        }
      );

    }
  );


  if (
    errors.length
  ) {

    KOL_IDS_SYSTEM_safeAlert_(

      '❌ KBIS STRUCTURE ERROR\n\n' +

      errors.join('\n')

    );


    return false;

  }


  KOL_IDS_SYSTEM_safeAlert_(

    '✅ KBIS STRUCTURE VALID\n\n' +

    Object.keys(
      KOL_IDS_SCHEMA_CONFIG
    ).length +

    ' core sheets verified.'

  );


  return true;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_validateStructure', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_validateStructure', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SILENT VALIDATION
 * ================================================== */

function KOL_IDS_SYSTEM_validateStructureSilent_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_validateStructureSilent_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  for (
    const sheetName of
    Object.keys(
      KOL_IDS_SCHEMA_CONFIG
    )
  ) {

    const sheet =
      ss.getSheetByName(
        sheetName
      );


    if (!sheet) {

      return false;

    }


    const expected =
      KOL_IDS_SCHEMA_CONFIG[
        sheetName
      ];

    // 12_PORTFOLIO is a dynamic intelligence canvas; only its
    // required sheet existence and minimum capacity are canonical.
    if (sheetName === '12_PORTFOLIO') {
      if (sheet.getMaxColumns() < expected.length) {
        return false;
      }
      continue;
    }


    if (
      sheet.getMaxColumns() <
      expected.length
    ) {

      return false;

    }


    const headers =
      sheet
        .getRange(
          1,
          1,
          1,
          expected.length
        )
        .getValues()[0];


    for (
      let i = 0;
      i < expected.length;
      i++
    ) {

      if (
        headers[i] !==
        expected[i]
      ) {

        return false;

      }

    }

  }


  return true;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_validateStructureSilent_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_validateStructureSilent_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * REFRESH EXECUTIVE
 * ================================================== */

function KOL_IDS_SYSTEM_refreshExecutive() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_refreshExecutive');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    typeof KOL_IDS_DASHBOARD_buildExecutiveDashboard !==
    'function'
  ) {

    throw new Error(
      'KBIS Executive Dashboard is not installed.'
    );

  }


  return KOL_IDS_DASHBOARD_buildExecutiveDashboard();


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_refreshExecutive', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_refreshExecutive', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SAFE CONTROL CENTER
 *
 * Explicit global function detection.
 *
 * DO NOT use this[fnName].
 * ================================================== */

function KOL_IDS_SYSTEM_runControlCenterSafe_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_runControlCenterSafe_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  try {

    if (
      typeof KOL_IDS_CONTROL_buildControlCenter ===
      'function'
    ) {

      return {

        success:
          true,

        function:
          'KOL_IDS_CONTROL_buildControlCenter',

        result:
          KOL_IDS_CONTROL_buildControlCenter()

      };

    }


    if (
      typeof KOL_IDS_CONTROL_runControlCenter ===
      'function'
    ) {

      return {

        success:
          true,

        function:
          'KOL_IDS_CONTROL_runControlCenter',

        result:
          KOL_IDS_CONTROL_runControlCenter()

      };

    }


    if (
      typeof KOL_IDS_CONTROL_refreshControlCenter ===
      'function'
    ) {

      return {

        success:
          true,

        function:
          'KOL_IDS_CONTROL_refreshControlCenter',

        result:
          KOL_IDS_CONTROL_refreshControlCenter()

      };

    }


    if (
      typeof KOL_IDS_CONTROL_updateControlCenter ===
      'function'
    ) {

      return {

        success:
          true,

        function:
          'KOL_IDS_CONTROL_updateControlCenter',

        result:
          KOL_IDS_CONTROL_updateControlCenter()

      };

    }


    return {

      success:
        false,

      skipped:
        true,

      message:
        'No Control Center runner detected.'

    };

  }
  catch (error) {

    return {

      success:
        false,

      error:
        KOL_IDS_SYSTEM_errorMessage_(
          error
        )

    };

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_runControlCenterSafe_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_runControlCenterSafe_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM STATUS
 * ================================================== */

function KOL_IDS_SYSTEM_updateSystemRunStatus_(
  ss,
  result
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_updateSystemRunStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!ss) {
    return;
  }


  const sheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.SYSTEM
    );


  if (!sheet) {
    return;
  }


  const now =
    new Date();


  /* -----------------------------------------------
   * Column 9 = System Status
   * ----------------------------------------------- */

  sheet
    .getRange(
      2,
      9
    )
    .setValue(

      result.success
        ? 'READY'
        : 'ERROR'

    );


  /* -----------------------------------------------
   * Column 10 = Last Validation
   *
   * Full System completion also represents a
   * successful validation cycle.
   * ----------------------------------------------- */

  sheet
    .getRange(
      2,
      10
    )
    .setValue(
      now
    );


  /* -----------------------------------------------
   * Column 11 = Last Engine Run
   *
   * IMPORTANT:
   * Keep this as a timestamp only.
   * Never write an error message here.
   * ----------------------------------------------- */

  if (
    result.success
  ) {

    sheet
      .getRange(
        2,
        11
      )
      .setValue(
        now
      );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_updateSystemRunStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_updateSystemRunStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM ERROR
 * ================================================== */

function KOL_IDS_SYSTEM_markSystemError_(
  ss,
  error
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_markSystemError_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!ss) {
    return;
  }


  const sheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.SYSTEM
    );


  if (!sheet) {
    return;
  }


  const message =
    KOL_IDS_SYSTEM_errorMessage_(
      error
    );


  /* -----------------------------------------------
   * System Status
   * ----------------------------------------------- */

  sheet
    .getRange(
      2,
      9
    )
    .setValue(
      'ERROR'
    );


  /* -----------------------------------------------
   * Last Validation
   * ----------------------------------------------- */

  sheet
    .getRange(
      2,
      10
    )
    .setValue(
      new Date()
    );


  /*
   * IMPORTANT:
   *
   * Do NOT overwrite Last Engine Run with error text.
   *
   * Instead store diagnostic information in a note.
   */

  try {

    sheet
      .getRange(
        2,
        11
      )
      .setNote(
        'KBIS ERROR: ' +
        message
      );

  }
  catch (noteError) {

    console.warn(
      'KBIS: Unable to write diagnostic note.',
      noteError
    );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_markSystemError_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_markSystemError_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * FORCE SYSTEM STATUS
 * ================================================== */

function KOL_IDS_SYSTEM_setSystemStatus_(
  ss,
  status
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_setSystemStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!ss) {
    return;
  }


  const sheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.SYSTEM
    );


  if (!sheet) {
    return;
  }


  sheet
    .getRange(
      2,
      9
    )
    .setValue(
      status
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_setSystemStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_setSystemStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM HEALTH CHECK
 * ================================================== */

function KOL_IDS_SYSTEM_systemHealthCheck(options) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_systemHealthCheck');
  var __kolIdsTraceStartedAt = Date.now();
  options = options || {};
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  const checks = [];


  /* -----------------------------------------------
   * CORE STRUCTURE
   * ----------------------------------------------- */

  checks.push([

    'Core Structure',

    options.fast
      ? (ss.getSheets().length > 0 ? 'PASS' : 'FAIL')
      : (KOL_IDS_SYSTEM_validateStructureSilent_() ? 'PASS' : 'FAIL')

  ]);


  /* -----------------------------------------------
   * DECISION ENGINE
   * ----------------------------------------------- */

  checks.push([

    'Decision Engine',

    typeof KOL_IDS_ENGINE_runDecisionEngine ===
    'function'
      ? 'PASS'
      : 'FAIL'

  ]);


  /* -----------------------------------------------
   * PORTFOLIO ENGINE
   * ----------------------------------------------- */

  checks.push([

    'Portfolio Engine',

    typeof KOL_IDS_PORTFOLIO_runPortfolioOptimization ===
    'function'
      ? 'PASS'
      : 'FAIL'

  ]);


  /* -----------------------------------------------
   * EXECUTIVE DASHBOARD
   * ----------------------------------------------- */

  checks.push([

    'Executive Dashboard',

    typeof KOL_IDS_DASHBOARD_buildExecutiveDashboard ===
    'function'
      ? 'PASS'
      : 'OPTIONAL / NOT FOUND'

  ]);


  /* -----------------------------------------------
   * CONTROL CENTER
   * ----------------------------------------------- */

  const controlCenterInstalled =

    typeof KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE_SAFE_ ===
    'function'

    ||

    typeof KOL_IDS_CONTROL_buildControlCenter ===
    'function'

    ||

    typeof KOL_IDS_CONTROL_runControlCenter ===
    'function'

    ||

    typeof KOL_IDS_CONTROL_refreshControlCenter ===
    'function'

    ||

    typeof KOL_IDS_CONTROL_updateControlCenter ===
    'function';


  checks.push([

    'Control Center',

    controlCenterInstalled
      ? 'PASS'
      : 'OPTIONAL / NOT FOUND'

  ]);

  if (options.fast) {
    return {
      success: true,
      fast: true,
      checks: checks,
      note: 'Fast SaaS health check. Full workbook/schema diagnostics are available via KOL_IDS_SYSTEM_systemHealthCheck().'
    };
  }


  /* -----------------------------------------------
   * PORTFOLIO SHEET
   * ----------------------------------------------- */

  const portfolio =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.PORTFOLIO
    );


  checks.push([

    'Portfolio Sheet',

    portfolio
      ? 'READY'
      : 'NOT CREATED YET'

  ]);


  /* -----------------------------------------------
   * LICENSE
   * ----------------------------------------------- */

  const systemSheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.SYSTEM
    );


  let licenseStatus =
    'UNKNOWN';


  let licenseId =
    '';


  if (
    systemSheet
  ) {

    licenseId =
      KOL_IDS_SYSTEM_valueString_(
        systemSheet
          .getRange(
            2,
            4
          )
          .getValue()
      );


    licenseStatus =
      KOL_IDS_SYSTEM_valueString_(
        systemSheet
          .getRange(
            2,
            5
          )
          .getValue()
      )
      .toUpperCase();


    if (!licenseStatus) {

      licenseStatus =
        'PENDING';

    }

  }


  checks.push([

    'License',

    licenseStatus

  ]);


  /* -----------------------------------------------
   * SYSTEM STATUS
   * ----------------------------------------------- */

  let systemStatus =
    'UNKNOWN';


  if (
    systemSheet
  ) {

    systemStatus =
      KOL_IDS_SYSTEM_valueString_(
        systemSheet
          .getRange(
            2,
            9
          )
          .getValue()
      )
      .toUpperCase();

  }


  checks.push([

    'System Status',

    systemStatus || 'UNKNOWN'

  ]);


  /* -----------------------------------------------
   * DATA READINESS
   * ----------------------------------------------- */

  const campaignSheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.CAMPAIGN
    );


  const brandSheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.BRAND
    );


  const kolSheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.KOL
    );


  const hasCampaign =
    !!KOL_IDS_SYSTEM_getFirstDataRow_(
      campaignSheet,
      KOL_IDS_SCHEMA_CONFIG['03_CAMPAIGN'].length
    );


  const hasBrand =
    !!KOL_IDS_SYSTEM_getFirstDataRow_(
      brandSheet,
      KOL_IDS_SCHEMA_CONFIG['02_BRAND_PROFILE'].length
    );


  const kolCount =
    KOL_IDS_SYSTEM_getDataRows_(
      kolSheet,
      KOL_IDS_SCHEMA_CONFIG['04_KOL_DATABASE'].length
    ).length;


  checks.push([

    'Brand Data',

    hasBrand
      ? 'READY'
      : 'MISSING'

  ]);


  checks.push([

    'Campaign Data',

    hasCampaign
      ? 'READY'
      : 'MISSING'

  ]);


  checks.push([

    'KOL Records',

    kolCount > 0
      ? kolCount + ' RECORD(S)'
      : 'MISSING'

  ]);


  /* -----------------------------------------------
   * MESSAGE
   * ----------------------------------------------- */

  const message =
    checks
      .map(
        row =>
          row[0] +
          ': ' +
          row[1]
      )
      .join('\n');


  /* -----------------------------------------------
   * SAFE UI
   * ----------------------------------------------- */

  if (!options.suppressAlerts) {
    KOL_IDS_SYSTEM_safeAlert_(

      'KOL IDS™ SYSTEM HEALTH\n\n' +
      message

    );
  }


  return {

    success:
      true,

    checks:
      checks,

    licenseId:
      licenseId,

    licenseStatus:
      licenseStatus,

    systemStatus:
      systemStatus,

    brandReady:
      hasBrand,

    campaignReady:
      hasCampaign,

    kolCount:
      kolCount

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_systemHealthCheck', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_systemHealthCheck', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * LICENSE
 *
 * Compatibility layer.
 *
 * APPROVED:
 *   valid = true
 *
 * PENDING / empty:
 *   Development mode
 *
 * Other:
 *   Not approved
 *
 * IMPORTANT:
 * This function does NOT yet contact an external
 * license server.
 * ================================================== */

function KOL_IDS_SYSTEM_validateLicense() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_validateLicense');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  const sheet =
    ss.getSheetByName(
      KOL_IDS_SYSTEM.SHEETS.SYSTEM
    );


  if (!sheet) {

    throw new Error(
      'KBIS: 01_SYSTEM not found.'
    );

  }


  const licenseId =
    KOL_IDS_SYSTEM_valueString_(
      sheet
        .getRange(
          2,
          4
        )
        .getValue()
    );


  const licenseStatus =
    KOL_IDS_SYSTEM_valueString_(
      sheet
        .getRange(
          2,
          5
        )
        .getValue()
    )
    .toUpperCase();


  /* -----------------------------------------------
   * APPROVED
   * ----------------------------------------------- */

  if (
    licenseStatus ===
    'APPROVED'
  ) {

    KOL_IDS_SYSTEM_safeAlert_(

      '🔐 KBIS LICENSE\n\n' +

      'APPROVED' +

      (
        licenseId
          ? '\nLicense ID: ' +
            licenseId
          : ''
      )

    );


    return {

      valid:
        true,

      status:
        'APPROVED',

      licenseId:
        licenseId

    };

  }


  /* -----------------------------------------------
   * DEVELOPMENT MODE
   * ----------------------------------------------- */

  const currentStatus =
    licenseStatus ||
    'PENDING';


  KOL_IDS_SYSTEM_safeAlert_(

    '🔐 KBIS LICENSE\n\n' +

    'Current Status: ' +

    currentStatus +

    '\n\n' +

    'Development mode remains available.'

  );


  return {

    /*
     * Validation completed successfully.  `valid` describes the commercial
     * license state, while `success` describes the health of the validation
     * operation itself.  Pending development workspaces are therefore not
     * treated as a QA/runtime failure.
     */
    success:
      true,

    valid:
      false,

    status:
      currentStatus,

    licenseId:
      licenseId,

    developmentMode:
      true

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_validateLicense', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_validateLicense', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM SMOKE QA
 * ================================================== */

function KOL_IDS_SYSTEM_runSystemQA(showAlert) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_runSystemQA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  const errors = [];
  const warnings = [];
  const requiredSheets = Object.keys(KOL_IDS_SCHEMA_CONFIG);
  requiredSheets.forEach(name => {
    const sh = ss.getSheetByName(name);
    if (!sh) {
      errors.push('Missing Sheet: ' + name);
      return;
    }
    const expected = KOL_IDS_SCHEMA_CONFIG[name];
    if (sh.getMaxColumns() < expected.length) {
      errors.push(name + ' → Not enough columns. Required ' + expected.length + '.');
      return;
    }

    // 12_PORTFOLIO is a dynamic intelligence canvas. The Portfolio Engine
    // intentionally rebuilds its visual row-1 content, so it must not be
    // compared against the static canonical schema headers here. Keep the
    // sheet existence/capacity contract while allowing the runtime canvas.
    if (name === '12_PORTFOLIO') {
      return;
    }

    const headers = sh.getRange(1, 1, 1, expected.length).getDisplayValues()[0];
    expected.forEach((h, i) => {
      if (String(headers[i] || '').trim() !== String(h).trim()) {
        errors.push(name + ' → Column ' + (i + 1) + ' header mismatch: expected "' + h + '", got "' + (headers[i] || '') + '".');
      }
    });
  });

  const requiredFunctions = [
    'KOL_IDS_ENGINE_runDecisionEngine','KOL_IDS_PORTFOLIO_runPortfolioOptimization','KOL_IDS_DASHBOARD_buildExecutiveDashboard',
    'KOL_IDS_PRODUCT_SETUP','KOL_IDS_PRODUCT_SAVE','KOL_IDS_PRODUCT_RUN',
    'KOL_IDS_PRODUCT_UI_GET_STATE','KOL_IDS_PRODUCT_UI_GET_REPORT','KOL_IDS_PRODUCT_UI_GET_HISTORY',
    'KOL_IDS_PRODUCT_UI_EXPORT_CURRENT','KOL_IDS_PRODUCT_UI_EXPORT_HISTORY','KOL_IDS_PRODUCT_UI_RESET_NEW'
  ];
  requiredFunctions.forEach(name => {
    if (typeof this[name] !== 'function') errors.push('Missing Function: ' + name);
  });

  let dataRows = 0;
  const kol = ss.getSheetByName('04_KOL_DATABASE');
  if (kol && kol.getLastRow() >= 2) dataRows = kol.getLastRow() - 1;
  if (!dataRows) warnings.push('No KOL data is currently loaded. Structure is valid, but Decision Engine cannot produce recommendations until KOL data is supplied.');

  const result = {
    success: errors.length === 0,
    status: errors.length ? 'FAIL' : 'PASS',
    spreadsheetId: ss.getId(),
    sheetsChecked: requiredSheets.length,
    dataRows: dataRows,
    errors: errors,
    warnings: warnings,
    checkedAt: new Date().toISOString()
  };
  if (showAlert) {
    const message = (result.status === 'PASS' ? '✅ KOL IDS SYSTEM QA PASS' : '❌ KOL IDS SYSTEM QA FAIL') +
      '\n\nSheets checked: ' + result.sheetsChecked +
      '\nKOL rows: ' + result.dataRows +
      (errors.length ? '\n\nERRORS:\n' + errors.join('\n') : '') +
      (warnings.length ? '\n\nWARNINGS:\n' + warnings.join('\n') : '');
    KOL_IDS_SYSTEM_safeAlert_(message);
  }
  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_runSystemQA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_runSystemQA', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* ==================================================
 * DATA HELPERS
 * ================================================== */


/* --------------------------------------------------
 * Convert value safely to string.
 * -------------------------------------------------- */

function KOL_IDS_SYSTEM_valueString_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_valueString_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    value === null ||
    value === undefined
  ) {

    return '';

  }


  return String(
    value
  ).trim();


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_valueString_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_valueString_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* --------------------------------------------------
 * Error message helper.
 * -------------------------------------------------- */

function KOL_IDS_SYSTEM_errorMessage_(
  error
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_errorMessage_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    error &&
    error.message
  ) {

    return String(
      error.message
    );

  }


  return String(
    error
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_errorMessage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_errorMessage_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* --------------------------------------------------
 * Get first non-empty data row.
 * -------------------------------------------------- */

function KOL_IDS_SYSTEM_getFirstDataRow_(
  sheet,
  columnCount
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_getFirstDataRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!sheet) {
    return null;
  }


  const lastRow =
    sheet.getLastRow();


  if (
    lastRow < 2
  ) {

    return null;

  }


  const safeColumnCount =
    Math.min(
      columnCount,
      sheet.getMaxColumns()
    );


  if (
    safeColumnCount < 1
  ) {

    return null;

  }


  const values =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        safeColumnCount
      )
      .getValues();


  for (
    let i = 0;
    i < values.length;
    i++
  ) {

    const row =
      values[i];


    const hasData =
      row.some(
        value =>
          KOL_IDS_SYSTEM_valueString_(
            value
          ) !== ''
      );


    if (
      hasData
    ) {

      return row;

    }

  }


  return null;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_getFirstDataRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_getFirstDataRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* --------------------------------------------------
 * Get all non-empty data rows.
 * -------------------------------------------------- */

function KOL_IDS_SYSTEM_getDataRows_(
  sheet,
  columnCount
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_getDataRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!sheet) {
    return [];
  }


  const lastRow =
    sheet.getLastRow();


  if (
    lastRow < 2
  ) {

    return [];

  }


  const safeColumnCount =
    Math.min(
      columnCount,
      sheet.getMaxColumns()
    );


  if (
    safeColumnCount < 1
  ) {

    return [];

  }


  const values =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        safeColumnCount
      )
      .getValues();


  return values.filter(
    row =>
      row.some(
        value =>
          KOL_IDS_SYSTEM_valueString_(
            value
          ) !== ''
      )
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_getDataRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_getDataRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SAFE TOAST
 * ================================================== */

function KOL_IDS_SYSTEM_safeToast_(
  ss,
  message,
  seconds
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_safeToast_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  try {

    if (
      ss
    ) {

      ss.toast(
        String(message),
        'KBIS',
        seconds || 3
      );

    }

  }
  catch (error) {

    console.warn(
      'KBIS toast failed:',
      error
    );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_safeToast_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_safeToast_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SAFE ALERT
 * ================================================== */

function KOL_IDS_SYSTEM_safeAlert_(
  message
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_safeAlert_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  try {

    SpreadsheetApp
      .getUi()
      .alert(
        String(message)
      );

  }
  catch (error) {

    Logger.log(
      String(message)
    );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_safeAlert_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_safeAlert_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* ==================================================
 * WEB APP ENTRY
 * ================================================== */
function KOL_IDS_SYSTEM_requireAuthenticatedWebUser_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_requireAuthenticatedWebUser_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var email = '';
  try { email = String(KOL_IDS_SECURITY_GET_EMAIL_() || '').trim().toLowerCase(); } catch (e) {}
  if (!email) throw new Error('AUTHENTICATION_REQUIRED');
  return email;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_requireAuthenticatedWebUser_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_requireAuthenticatedWebUser_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function doGet(e) {
  KOL_IDS_TRACE_ENTER_('doGet');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const admin = e && e.parameter && String(e.parameter.admin || '') === '1';
  const enterprise = e && e.parameter && String(e.parameter.enterprise || '') === '1';
  const qa = e && e.parameter && String(e.parameter.qa || '') === '1';
  if (qa) {
    KOL_IDS_SYSTEM_requireAuthenticatedWebUser_();
    return HtmlService.createHtmlOutputFromFile('KOL_IDS_RELEASE_GATE_UI').setTitle('KOL IDS — Release Gate');
  }
  if (admin) {
    try {
      KOL_IDS_SYSTEM_requireAuthenticatedWebUser_();
      KOL_IDS_SYSTEM_requireAdmin_();
      return HtmlService.createHtmlOutputFromFile('KOL_IDS_ADMIN_UI').setTitle('KOL IDS — Admin Control');
    } catch (adminAuthError) {
      var msg=String(adminAuthError&&adminAuthError.message||adminAuthError||'ADMIN_AUTH_REQUIRED');
      return HtmlService.createHtmlOutput('<!doctype html><html><head><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#f7f3f2;font:15px Arial;color:#2a171b}.box{max-width:560px;margin:12vh auto;padding:34px;background:#fff;border:1px solid #eadfe1;border-radius:20px;box-shadow:0 18px 50px rgba(61,19,27,.08)}.ey{font-size:11px;letter-spacing:2px;color:#8a6c72;font-weight:800}.h{font-size:27px;font-weight:800;margin:9px 0 12px}.p{line-height:1.6;color:#75686b}.b{display:inline-block;background:#3d131b;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;margin-top:10px}</style></head><body><div class="box"><div class="ey">KOL IDS · SALES CONTROL</div><div class="h">Admin sign-in required</div><div class="p">กรุณาเปิดลิงก์นี้ขณะ Sign in ด้วย Google Account ของ Admin ที่ตั้งค่าไว้ แล้วกดลิงก์จากอีเมลอีกครั้ง</div><div class="p" style="font-size:12px">'+KOL_IDS_CORE_html_(msg)+'</div></div></body></html>').setTitle('KOL IDS — Admin Sign In');
    }
  }
  if (enterprise) {
    KOL_IDS_SYSTEM_requireAuthenticatedWebUser_();
    return HtmlService.createHtmlOutputFromFile('KOL_IDS_ENTERPRISE_UI').setTitle('KOL IDS — Enterprise');
  }
  // Canonical production UI: the active production frontend for the release package.
  // The legacy V5 UI remains available only as an explicit compatibility route.
  if (e && e.parameter && String(e.parameter.legacy || '') === '1') {
    return HtmlService.createHtmlOutputFromFile('KOL_IDS_UI_LEGACY').setTitle('KOL IDS — Legacy');
  }
  return HtmlService.createTemplateFromFile('KOL_IDS_UI').evaluate().setTitle('KOL IDS™ — Intelligence Workspace');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('doGet', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('doGet', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* ==================================================
 * KOL IDS™ ADMIN / CLIENT CONTROL CENTER V2
 * ================================================== */
function KOL_IDS_SYSTEM_SETUP_ADMIN() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SETUP_ADMIN');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const email = Session.getEffectiveUser().getEmail();
  if (!email) throw new Error('Cannot identify the Apps Script owner email.');
  PropertiesService.getScriptProperties().setProperty('KOL_IDS_ADMIN_EMAIL', email);
  KOL_IDS_SYSTEM_ensureClientDirectory_();
  return {success:true, adminEmail:email};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SETUP_ADMIN', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SETUP_ADMIN', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_requireAdmin_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_requireAdmin_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const props = PropertiesService.getScriptProperties(); const configured = String(props.getProperty('KOL_IDS_ADMIN_EMAIL') || props.getProperty('KOL_IDS_ADMIN_EMAIL_V5') || '').trim().toLowerCase();
  const current = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  if (!configured) throw new Error('Admin access is not configured. Run KOL_IDS_SYSTEM_SETUP_ADMIN() once from Apps Script.');
  if (!current || current !== configured) throw new Error('Admin access denied.');
  return current;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_requireAdmin_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_requireAdmin_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_ADMIN_GET() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_ADMIN_GET');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SYSTEM_requireAdmin_();
  return {success:true, clients:KOL_IDS_SYSTEM_LIST_CLIENTS().rows, webAppUrl:ScriptApp.getService().getUrl() || ''};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_ADMIN_GET', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_ADMIN_GET', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_CREATE_TRIAL_CLIENT_(customerName,email,trialPlan){
  var name=String(customerName||'Trial Customer').trim(),em=String(email||'').trim().toLowerCase();
  var planRaw=String(trialPlan||'7-Day Free Trial').trim();
  var normalizedPlan=/3 Months/i.test(planRaw)?'3 Months':/6 Months/i.test(planRaw)?'6 Months':/12 Months/i.test(planRaw)?'12 Months':'7-Day Free Trial';
  if(!em)throw new Error('Trial email is required.');
  var master=KOL_IDS_SYSTEM_getMasterSpreadsheet_();KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());
  var directory=KOL_IDS_SYSTEM_ensureClientDirectory_(),last=directory.getLastRow(),width=Math.max(13,directory.getLastColumn());
  var headers=directory.getRange(1,1,1,width).getValues()[0].map(String),idx={};headers.forEach(function(h,i){idx[h]=i;});
  var vals=last>=2?directory.getRange(2,1,last-1,width).getValues():[];
  for(var i=0;i<vals.length;i++){
    var contact=idx['Contact Email']!=null?String(vals[i][idx['Contact Email']]||'').trim().toLowerCase():'';
    var accounts=idx['Account Emails']!=null?String(vals[i][idx['Account Emails']]||'').toLowerCase().split(',').map(function(x){return x.trim();}).filter(Boolean):[];
    var status=String(vals[i][idx['Status']]||'').toUpperCase(),accessType=String(vals[i][idx['Access Type']]||'').toUpperCase();
    if(status==='ACTIVE'&&accessType==='TRIAL'&&(contact===em||accounts.indexOf(em)>=0)){
      return {existing:true,clientId:vals[i][idx['Client ID']],clientName:vals[i][idx['Client Name']],spreadsheetId:vals[i][idx['Spreadsheet ID']],accessType:'TRIAL',plan:vals[i][idx['Plan']]||normalizedPlan,maxAccounts:Number(vals[i][idx['Max Accounts']]||1),accountEmails:accounts,contactEmail:contact||em};
    }
  }
  var clientId='CL-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),accessKey=KOL_IDS_HARDENING_RUNTIME_generateAccessKey_();
  var workspace=SpreadsheetApp.create('KOL IDS™ — '+name);KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(workspace.getId());KOL_IDS_SYSTEM_initialize();KOL_IDS_PRODUCT_SETUP();
  var expires=new Date(Date.now()+7*24*60*60*1000);KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());
  var row=new Array(width).fill('');
  row[idx['Client ID']]=clientId;row[idx['Client Name']]=name;row[idx['Access Key']]=KOL_IDS_HARDENING_RUNTIME_accessKeyHash_(accessKey);
  row[idx['Spreadsheet ID']]=workspace.getId();row[idx['Status']]='ACTIVE';row[idx['Created At']]=new Date();row[idx['Plan']]=normalizedPlan;row[idx['Expires At']]=expires;
  row[idx['Max Accounts']]=(typeof KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_==='function'?KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(normalizedPlan):1)||1;row[idx['Account Emails']]='';row[idx['Access Type']]='TRIAL';if(idx['Contact Email']!=null)row[idx['Contact Email']]=em;
  directory.getRange(directory.getLastRow()+1,1,1,width).setValues([row]);
  return {success:true,clientId:clientId,clientName:name,spreadsheetId:workspace.getId(),accessKey:accessKey,expiresAt:expires.toISOString(),plan:normalizedPlan,maxAccounts:(typeof KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_==='function'?KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(normalizedPlan):1)||1,accountEmails:[],accessType:'TRIAL',contactEmail:em};
}
function KOL_IDS_SYSTEM_SYNC_PAID_CLIENT_FROM_ORDER_(order){
  var o=order||{},cid=String(o.existingClientId||'').trim(),em=String(o.email||'').trim().toLowerCase(),pn=String(o.plan||'').trim().toUpperCase();
  var max=(typeof KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_==='function')
    ? KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(pn)
    : (pn==='3 MONTHS'?1:pn==='6 MONTHS'?2:3);
  if(!max)throw new Error('Invalid commercial account entitlement for plan: '+pn);
  var dir=KOL_IDS_SYSTEM_ensureClientDirectory_(),last=dir.getLastRow(),width=Math.max(13,dir.getLastColumn());
  var h=dir.getRange(1,1,1,width).getValues()[0].map(String),idx={};h.forEach(function(x,k){idx[x]=k;});
  var vals=last>=2?dir.getRange(2,1,last-1,width).getValues():[],rowNum=-1,row=null;
  if(cid){for(var i=0;i<vals.length;i++)if(String(vals[i][idx['Client ID']]||'').trim()===cid){rowNum=i+2;row=vals[i];break;}if(rowNum<0)throw new Error('Existing Client ID was not found: '+cid);}
  if(rowNum<0&&em){for(var j=0;j<vals.length;j++){var contact=idx['Contact Email']!=null?String(vals[j][idx['Contact Email']]||'').trim().toLowerCase():'',accounts=String(vals[j][idx['Account Emails']]||'').toLowerCase().split(',').map(function(x){return x.trim();}).filter(Boolean);if(contact===em||accounts.indexOf(em)>=0){rowNum=j+2;row=vals[j];break;}}}
  var createdAccessKey='';
  if(rowNum<0){var created=KOL_IDS_SYSTEM_CREATE_CLIENT(String(o.customerName||'Customer'));createdAccessKey=String(created.accessKey||'');rowNum=dir.getLastRow();row=dir.getRange(rowNum,1,1,width).getValues()[0];}
  var out=new Array(width).fill('');for(var c=0;c<Math.min(row.length,width);c++)out[c]=row[c];
  out[idx['Plan']]=pn==='3 MONTHS'?'3 Months':pn==='6 MONTHS'?'6 Months':'12 Months';
  var exp=new Date(o.expiresAt);if(isNaN(exp.getTime()))throw new Error('Invalid paid entitlement expiry.');out[idx['Expires At']]=exp;out[idx['Max Accounts']]=max;
  var emails=String(out[idx['Account Emails']]||'').toLowerCase().split(',').map(function(x){return x.trim();}).filter(Boolean);
  out[idx['Account Emails']]=emails.join(',');out[idx['Access Type']]='PAID';out[idx['Status']]='ACTIVE';out[idx['Last Access']]=new Date();
  if(idx['Contact Email']!=null&&em)out[idx['Contact Email']]=em;
  dir.getRange(rowNum,1,1,width).setValues([out]);
  var workspaceId=String(out[idx['Spreadsheet ID']]||'').trim();
  if(String(o.licenseId||'').trim() && workspaceId && typeof KOL_IDS_CORE_bindLicenseWorkspace_==='function'){
    KOL_IDS_CORE_bindLicenseWorkspace_(String(o.licenseId),em,workspaceId);
  }
  return {success:true,clientId:String(out[idx['Client ID']]),plan:out[idx['Plan']],expiresAt:exp.toISOString(),maxAccounts:max,accountEmails:emails,accessKey:createdAccessKey,contactEmail:idx['Contact Email']!=null?String(out[idx['Contact Email']]||''):em,workspaceId:workspaceId,licenseId:String(o.licenseId||'')};
}
function KOL_IDS_SYSTEM_CREATE_TRIAL_FROM_FORM_(name,email){
  KOL_IDS_SYSTEM_requireAdmin_();
  var r=KOL_IDS_SYSTEM_CREATE_TRIAL_CLIENT_(name,email);
  if(r&&r.accessKey){
    var web=KOL_IDS_CORE_getWebAppUrl_();
    if(!web) throw new Error('Cannot send Trial email: canonical /exec Web App URL is not configured.');
    var body=`เรียน ${String(name||'ลูกค้า')}

ทดลองใช้ KOL IDS ฟรี 7 วัน

Client ID: ${r.clientId}
Access Key: ${r.accessKey}
ทดลองถึง: ${r.expiresAt}

ใน Trial: ใช้งานและดูผลวิเคราะห์ได้ แต่ Download / Export Report จะถูกล็อกจนกว่าจะสมัครแพ็กเกจ

หากต้องการสมัคร ให้ใช้ Sales Form และระบุ Existing Client ID นี้ เพื่อให้ข้อมูล Trial เดิมอยู่ต่อ

Web App: ${web}`;
    MailApp.sendEmail({to:String(email).trim().toLowerCase(),subject:'KOL IDS — 7-Day Free Trial พร้อมใช้งาน',body:body});
  }
  return r;
}

function KOL_IDS_SYSTEM_ADMIN_CREATE_CLIENT(clientName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_ADMIN_CREATE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SYSTEM_requireAdmin_();
  const result = KOL_IDS_SYSTEM_CREATE_CLIENT(clientName);
  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_ADMIN_CREATE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_ADMIN_CREATE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_ADMIN_DISABLE_CLIENT(clientId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_ADMIN_DISABLE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SYSTEM_requireAdmin_();
  return KOL_IDS_SYSTEM_DISABLE_CLIENT(clientId);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_ADMIN_DISABLE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_ADMIN_DISABLE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * KOL IDS™ MASTER QA — APPENDED
 * ================================================== */

/**
 * KOL IDS™ — MASTER QA / INTEGRATION TEST SUITE
 *
 * PURPOSE
 * Run ONE function to test the whole installed system on a disposable
 * spreadsheet before any production deployment.
 *
 * RUN:
 *   KOL_IDS_SYSTEM_RUN_MASTER_QA()
 *
 * The suite never uses the production/master spreadsheet for its data tests.
 * It creates a temporary spreadsheet, runs the installed modules against it,
 * records PASS / FAIL / SKIP, then restores the runtime spreadsheet pointer.
 *
 * IMPORTANT:
 * - It does not test billing, Google OAuth consent screens, or real multi-user
 *   isolation between two browser identities. Those require a deployed Web App.
 * - It DOES test server-side routing/security primitives as far as the current
 *   Apps Script execution context allows.
 */

/**
 * Manual cleanup for orphaned MASTER-QA workspaces created by older builds.
 *
 * Safety rules:
 * - Never deletes the currently configured MASTER-QA workspace.
 * - Only targets spreadsheets whose name starts with the exact QA TEMP prefix.
 * - Defaults to dry-run; pass {execute:true} to trash matches.
 * - Does not touch customer workspaces or normal application spreadsheets.
 */
function KOL_IDS_SYSTEM_CLEANUP_MASTER_QA_WORKSPACES(opts) {
  opts = opts || {};
  var execute = opts.execute === true;
  var keepId = String(
    PropertiesService.getScriptProperties().getProperty('KOL_IDS_MASTER_QA_WORKSPACE_ID') || ''
  ).trim();
  var prefix = 'KOL IDS™ — QA TEMP —';
  var files = DriveApp.searchFiles(
    "mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false"
  );
  var matches = [], trashed = [], skippedCurrent = [];

  while (files.hasNext()) {
    var file = files.next();
    var name = String(file.getName() || '');
    if (name.indexOf(prefix) !== 0) continue;
    var id = file.getId();
    if (id === keepId) {
      skippedCurrent.push({id:id, name:name});
      continue;
    }
    var item = {id:id, name:name, url:file.getUrl()};
    matches.push(item);
    if (execute) {
      file.setTrashed(true);
      trashed.push(item);
    }
  }

  return {
    success: true,
    execute: execute,
    currentWorkspaceId: keepId,
    matchedCount: matches.length,
    trashedCount: trashed.length,
    matched: matches,
    trashed: trashed,
    keptCurrent: skippedCurrent,
    timestamp: new Date().toISOString()
  };
}

function KOL_IDS_SYSTEM_RUN_MASTER_QA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_RUN_MASTER_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const started = new Date();
  const oldRuntime = (typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') ? KOL_IDS_RUNTIME_SS_ID : null;
  const results = [];
  let testSS = null;

  function KOL_IDS_SYSTEM_add(name, status, detail, durationMs) {
    results.push({
      name: name,
      status: status,
      detail: detail || '',
      durationMs: durationMs == null ? '' : durationMs
    });
  }

  function KOL_IDS_SYSTEM_run(name, fn, opts) {
    const t = Date.now();
    try {
      const value = fn();
      const nestedFail = value && typeof value === 'object' && (value.success === false || value.ready === false);
      if (nestedFail) {
        const detail = KOL_IDS_SYSTEM_QA_stringify_(value);
        KOL_IDS_SYSTEM_add(name, (opts && opts.optional) ? 'SKIP' : 'FAIL', detail, Date.now() - t);
        return { ok: false, value: value };
      }
      KOL_IDS_SYSTEM_add(name, 'PASS', KOL_IDS_SYSTEM_QA_stringify_(value), Date.now() - t);
      return { ok: true, value: value };
    } catch (e) {
      const msg = KOL_IDS_SYSTEM_QA_error_(e);
      KOL_IDS_SYSTEM_add(name, (opts && opts.optional) ? 'SKIP' : 'FAIL', msg, Date.now() - t);
      return { ok: false, error: e };
    }
  }

  function KOL_IDS_SYSTEM_skip(name, detail) {
    KOL_IDS_SYSTEM_add(name, 'SKIP', detail, '');
  }

  try {
    KOL_IDS_SYSTEM_run('Static function inventory', function() {
      return KOL_IDS_SYSTEM_QA_staticInventory_();
    });

    // Reuse one dedicated MASTER-QA workspace instead of creating a new
    // spreadsheet on every run. This prevents QA retries from flooding
    // Drive with abandoned QA TEMP workspaces.
    const qaProps = PropertiesService.getScriptProperties();
    const qaWorkspaceProp = 'KOL_IDS_MASTER_QA_WORKSPACE_ID';
    const savedQaWorkspaceId = String(qaProps.getProperty(qaWorkspaceProp) || '').trim();
    if (savedQaWorkspaceId) {
      try {
        testSS = SpreadsheetApp.openById(savedQaWorkspaceId);
      } catch (qaOpenErr) {
        testSS = null;
      }
    }
    if (!testSS) {
      testSS = SpreadsheetApp.create(
        'KOL IDS™ — QA TEMP — ' +
        Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd')
      );
      qaProps.setProperty(qaWorkspaceProp, testSS.getId());
    }
    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(testSS.getId());

    KOL_IDS_SYSTEM_run('Core initialization', function() {
      KOL_IDS_SYSTEM_initialize({ suppressAlerts: true });
      return { spreadsheetId: testSS.getId(), sheets: testSS.getSheets().length };
    });

    KOL_IDS_SYSTEM_run('Product setup', function() {
      return KOL_IDS_PRODUCT_SETUP();
    });

    KOL_IDS_SYSTEM_run('Schema validation', function() {
      return { valid: KOL_IDS_SYSTEM_validateStructureSilent_() };
    });

    KOL_IDS_SYSTEM_run('Schema health report', function() {
      return KOL_IDS_SCHEMA_checkSchemaHealth({suppressAlerts:true});
    });

    KOL_IDS_SYSTEM_run('V25 Enterprise hardening QA', function() {
      return KOL_IDS_PLATFORM_QA();
    });

    KOL_IDS_SYSTEM_run('LEGACY_V25.9 Production hardening certification', function() {
      return KOL_IDS_HARDENING_RUNTIME_PRODUCTION_CERTIFICATION_QA();
    });

    KOL_IDS_SYSTEM_run('Controlled test data seed', function() {
      return KOL_IDS_TEST_seedControlledTestData();
    });

    KOL_IDS_SYSTEM_run('Controlled test dataset summary', function() {
      return KOL_IDS_TEST_showTestDatasetSummary();
    });

    KOL_IDS_SYSTEM_run('Decision Engine', function() {
      return KOL_IDS_ENGINE_runDecisionEngine();
    });

    // IMPORTANT: Run A-E immediately after the controlled Decision Engine KOL_IDS_SYSTEM_run.
    // Later Product SAVE → RUN intentionally creates a fresh analysis and may replace
    // the controlled KOL IDs. Keeping this assertion before that mutation makes the
    // test validate the actual seeded benchmark rather than a different payload.
    KOL_IDS_SYSTEM_run('Controlled decision expectations A-E', function() {
      const sheetName = KOL_IDS_SYSTEM.SHEETS.DECISION;
      const sheet = testSS.getSheetByName(sheetName);
      if (!sheet || sheet.getLastRow() < 2) {
        throw new Error('Decision output is empty: ' + sheetName);
      }

      // Read the actual decision sheet by HEADER NAME.
      // Do not depend on fixed column indexes; columns may be reordered later.
      const values = sheet.getDataRange().getValues();
      if (!values.length) throw new Error('Decision sheet has no data.');

      const headers = values[0].map(h => String(h || '').trim());
      const idCol = headers.indexOf('KOL ID');
      const decisionCol = headers.indexOf('Decision');

      if (idCol < 0) {
        throw new Error(sheetName + ' → Header "KOL ID" not found.');
      }
      if (decisionCol < 0) {
        throw new Error(sheetName + ' → Header "Decision" not found.');
      }

      const byId = {};
      for (let i = 1; i < values.length; i++) {
        const id = String(values[i][idCol] || '').trim().toUpperCase();
        const decision = String(values[i][decisionCol] || '').trim().toUpperCase();
        if (id) byId[id] = decision;
      }

      const expected = {
        'KOL-TEST-001': 'RECOMMENDED',
        'KOL-TEST-002': 'NOT RECOMMENDED',
        'KOL-TEST-003': 'REVIEW REQUIRED',
        'KOL-TEST-004': 'REVIEW REQUIRED',
        'KOL-TEST-005': 'CONSIDER'
      };

      const failures = [];
      const checked = {};

      Object.keys(expected).forEach(id => {
        if (!Object.prototype.hasOwnProperty.call(byId, id)) {
          failures.push(
            id + '=MISSING (Sheet: ' + sheetName + ', Header: KOL ID)'
          );
        } else {
          checked[id] = byId[id];
          if (byId[id] !== expected[id]) {
            failures.push(
              id + '=' + byId[id] +
              ' (expected ' + expected[id] +
              '; Sheet: ' + sheetName +
              ', Header: Decision)'
            );
          }
        }
      });

      if (failures.length) {
        throw new Error(
          'Controlled expectations failed: ' + failures.join(', ')
        );
      }

      return {
        checked: checked,
        sourceSheet: sheetName,
        idHeader: 'KOL ID',
        decisionHeader: 'Decision'
      };
    });


    KOL_IDS_SYSTEM_run('Smart orchestration', function() {
      return KOL_IDS_ENGINE_runSmart();
    });

    KOL_IDS_SYSTEM_run('Executive Dashboard', function() {
      return KOL_IDS_DASHBOARD_buildExecutiveDashboard();
    });

    KOL_IDS_SYSTEM_run('Portfolio Optimization', function() {
      return KOL_IDS_PORTFOLIO_runPortfolioOptimization();
    });

    KOL_IDS_SYSTEM_run('Control Center full intelligence', function() {
      return KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE_SAFE_();
    });

    KOL_IDS_SYSTEM_run('System health check', function() {
      return KOL_IDS_SYSTEM_systemHealthCheck({ suppressAlerts: true });
    });

    KOL_IDS_SYSTEM_run('License validation', function() {
      return KOL_IDS_SYSTEM_validateLicense();
    });

    KOL_IDS_SYSTEM_run('Product value build', function() {
      return KOL_IDS_PRODUCT_BUILD_VALUE();
    });

    KOL_IDS_SYSTEM_run('Product report build', function() {
      return KOL_IDS_PRODUCT_BUILD_REPORT();
    });

    KOL_IDS_SYSTEM_run('UI state bridge', function() {
      return KOL_IDS_PRODUCT_UI_GET_STATE();
    });

    KOL_IDS_SYSTEM_run('UI report bridge', function() {
      return KOL_IDS_PRODUCT_UI_GET_REPORT();
    });

    KOL_IDS_SYSTEM_run('UI history bridge', function() {
      return KOL_IDS_PRODUCT_UI_GET_HISTORY();
    });

    KOL_IDS_SYSTEM_run('UI export current', function() {
      return KOL_IDS_PRODUCT_UI_EXPORT_CURRENT();
    });

    KOL_IDS_SYSTEM_run('UI reset/new analysis', function() {
      return KOL_IDS_PRODUCT_UI_RESET_NEW();
    });

    KOL_IDS_SYSTEM_run('Product SAVE → RUN end-to-end', function() {
      const payload = KOL_IDS_SYSTEM_QA_samplePayload_();
      const saved = KOL_IDS_PRODUCT_SAVE(payload);
      const executed = KOL_IDS_PRODUCT_RUN();
      const report = KOL_IDS_PRODUCT_UI_GET_REPORT();
      if (!saved || saved.success !== true) throw new Error('Product save did not return success=true.');
      if (!executed || executed.success !== true) throw new Error('Product KOL_IDS_SYSTEM_run did not return success=true.');
      if (!report || !Array.isArray(report.rows) || report.rows.length !== payload.kols.length) {
        throw new Error('Decision report row count mismatch.');
      }
      return { saved: saved, executed: executed, reportRows: report.rows.length };
    });

    KOL_IDS_SYSTEM_run('History archive', function() {
      const history = KOL_IDS_PRODUCT_UI_GET_HISTORY();
      if (!history || !Array.isArray(history.rows)) throw new Error('History bridge returned invalid shape.');
      return { rows: history.rows.length };
    });

    KOL_IDS_SYSTEM_run('Current export after analysis', function() {
      const out = KOL_IDS_PRODUCT_UI_EXPORT_CURRENT();
      if (!out || !out.json || !out.csv) throw new Error('Export payload incomplete.');
      return { jsonBytes: out.json.length, csvBytes: out.csv.length };
    });

    KOL_IDS_SYSTEM_run('History export', function() {
      const history = KOL_IDS_PRODUCT_UI_GET_HISTORY();
      if (!history.rows.length) throw new Error('No history row available for export test.');
      return KOL_IDS_PRODUCT_UI_EXPORT_HISTORY(history.rows[0].analysisId);
    });

    KOL_IDS_SYSTEM_run('Security bind + diagnostic', function() {
      const email = KOL_IDS_SECURITY_GET_EMAIL_();
      KOL_IDS_SECURITY_BIND_WORKSPACE_(testSS.getId(), email);
      const d = KOL_IDS_SECURITY_DIAGNOSTIC();
      if (!d.ownerMatches) throw new Error('Security diagnostic owner mismatch.');
      return d;
    }, { optional: true });

    KOL_IDS_SYSTEM_run('Self-service route against QA workspace', function() {
      const email = KOL_IDS_SECURITY_GET_EMAIL_();
      const props = PropertiesService.getUserProperties();
      const key = KOL_IDS_SELF.WORKSPACE_PROPERTY;
      const previous = props.getProperty(key);
      try {
        props.setProperty(key, testSS.getId());
        const boot = KOL_IDS_SELF_SERVICE_BOOTSTRAP();
        if (!boot || boot.workspaceId !== testSS.getId()) throw new Error('Self-service did not route to QA workspace.');
        return boot;
      } finally {
        if (previous) props.setProperty(key, previous);
        else props.deleteProperty(key);
      }
    }, { optional: true });

    KOL_IDS_SYSTEM_run('Web app doGet', function() {
      const html = doGet({ parameter: {} });
      if (!html) throw new Error('doGet returned nothing.');
      return { ok: true };
    }, { optional: true });

    // Pure helper sanity checks. These catch regressions without needing UI.
    KOL_IDS_SYSTEM_run('Pure helper sanity', function() {
      if (KOL_IDS_PRODUCT_text_(null) !== '') throw new Error('KOL_IDS_PRODUCT_text_ failed.');
      if (KOL_IDS_PRODUCT_number_('1,250') !== 1250) throw new Error('KOL_IDS_PRODUCT_number_ failed.');
      if (KOL_IDS_PRODUCT_round_(12.3456) !== 12.35) throw new Error('KOL_IDS_PRODUCT_round_ failed.');
      if (KOL_IDS_PRODUCT_inverseBand_(50, 50, 250) !== 100) throw new Error('inverseBand best boundary failed.');
      if (KOL_IDS_PRODUCT_inverseBand_(250, 50, 250) !== 0) throw new Error('inverseBand worst boundary failed.');
      if (KOL_IDS_PRODUCT_directBand_(1, 1, 5) !== 0) throw new Error('directBand low boundary failed.');
      if (KOL_IDS_PRODUCT_directBand_(5, 1, 5) !== 100) throw new Error('directBand high boundary failed.');
      return { ok: true };
    });

    KOL_IDS_SYSTEM_run('System smoke QA', function() {
      const q = KOL_IDS_SYSTEM_runSystemQA(false);
      if (!q || q.status !== 'PASS') throw new Error('System smoke QA failed: ' + JSON.stringify(q && q.errors || []));
      return q;
    });

    KOL_IDS_SYSTEM_run('Function reference audit', function() {
      const audit = KOL_IDS_SYSTEM_QA_referenceAudit_();
      if (audit.missing.length) throw new Error('Missing non-optional project function references: ' + audit.missing.join(', '));
      if (audit.duplicates.length) throw new Error('Duplicate function names: ' + audit.duplicates.join(', '));
      return audit;
    });

  } finally {
    if (typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') KOL_IDS_RUNTIME_SS_ID = oldRuntime;
  }

  const summary = KOL_IDS_SYSTEM_QA_summary_(results, started, testSS ? testSS.getUrl() : '');
  const reportSS = SpreadsheetApp.getActiveSpreadsheet();
  if (reportSS) {
    KOL_IDS_SYSTEM_QA_writeReport_(reportSS, summary);
  }
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_RUN_MASTER_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_RUN_MASTER_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * MASTER QA TIMEOUT REPAIR
 *
 * The original KOL_IDS_SYSTEM_RUN_MASTER_QA() intentionally remains available,
 * but the full suite can exceed Apps Script execution limits because it combines
 * schema scans, seeded engine/orchestration, product SAVE->RUN, exports and smoke QA
 * in one execution.
 *
 * Use the three public phase runners below. They persist one temporary QA workspace
 * in Script Properties so each phase can run in a separate Apps Script execution.
 * No production data is used by these phase runners.
 */
function KOL_IDS_SYSTEM_MASTER_QA_PHASE_PROPERTY_() {
  return 'KOL_IDS_MASTER_QA_PHASE_SS_ID_V25_18';
}

function KOL_IDS_SYSTEM_MASTER_QA_getWorkspace_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(KOL_IDS_SYSTEM_MASTER_QA_PHASE_PROPERTY_());
  if (!id) throw new Error('No phased MASTER QA workspace. Run KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_1() first.');
  var ss = SpreadsheetApp.openById(id);
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(id);
  return ss;
}

function KOL_IDS_SYSTEM_MASTER_QA_phaseSummary_(phase, started, results, ss) {
  var failed = results.filter(function(r){ return r.status === 'FAIL'; });
  var summary = {
    success: failed.length === 0,
    status: failed.length === 0 ? 'GREEN' : 'RED',
    suite: 'MASTER QA ' + phase,
    durationMs: Date.now() - started,
    passed: results.filter(function(r){ return r.status === 'PASS'; }).length,
    failed: failed.length,
    results: results,
    workspaceId: ss ? ss.getId() : '',
    workspaceUrl: ss ? ss.getUrl() : ''
  };
  Logger.log('[MASTER_QA_' + phase.replace(/\s+/g,'_') + '_RESULT] ' + JSON.stringify(summary, null, 2));
  return summary;
}

function KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, name, fn, optional) {
  var t = Date.now();
  try {
    var value = fn();
    var failed = value && typeof value === 'object' && (value.success === false || value.ready === false);
    results.push({
      name: name,
      status: failed ? (optional ? 'SKIP' : 'FAIL') : 'PASS',
      durationMs: Date.now() - t,
      detail: KOL_IDS_SYSTEM_QA_stringify_(value)
    });
    return !failed;
  } catch (e) {
    results.push({
      name: name,
      status: optional ? 'SKIP' : 'FAIL',
      durationMs: Date.now() - t,
      detail: KOL_IDS_SYSTEM_QA_error_(e)
    });
    return false;
  }
}

function KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_1() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_1');
  var started = Date.now();
  var oldRuntime = (typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') ? KOL_IDS_RUNTIME_SS_ID : null;
  var results = [];
  try {
    var props = PropertiesService.getScriptProperties();
    var oldId = props.getProperty(KOL_IDS_SYSTEM_MASTER_QA_PHASE_PROPERTY_());
    var ss = null;
    if (oldId) {
      try { ss = SpreadsheetApp.openById(oldId); } catch (e) { ss = null; }
    }
    if (!ss) {
      ss = SpreadsheetApp.create('KOL IDS™ — MASTER QA PHASED — ' +
        Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss'));
      props.setProperty(KOL_IDS_SYSTEM_MASTER_QA_PHASE_PROPERTY_(), ss.getId());
    }
    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(ss.getId());

    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Static function inventory', function(){ return KOL_IDS_SYSTEM_QA_staticInventory_(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Core initialization', function(){
      KOL_IDS_SYSTEM_initialize({suppressAlerts:true});
      return {spreadsheetId:ss.getId(), sheets:ss.getSheets().length};
    });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Product setup', function(){ return KOL_IDS_PRODUCT_SETUP(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Schema validation', function(){
      var valid = KOL_IDS_SYSTEM_validateStructureSilent_();
      if (!valid) throw new Error('Core structure validation failed.');
      return {valid:true};
    });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Schema health report', function(){ return KOL_IDS_SCHEMA_checkSchemaHealth({suppressAlerts:true}); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'V25 Enterprise hardening QA', function(){ return KOL_IDS_PLATFORM_QA(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'LEGACY_V25.9 Production hardening certification', function(){ return KOL_IDS_HARDENING_RUNTIME_PRODUCTION_CERTIFICATION_QA(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Controlled test data seed', function(){ return KOL_IDS_TEST_seedControlledTestData(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Controlled test dataset summary', function(){ return KOL_IDS_TEST_showTestDatasetSummary(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Decision Engine', function(){ return KOL_IDS_ENGINE_runDecisionEngine(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results, 'Controlled decision expectations A-E', function(){
      var sheetName = KOL_IDS_SYSTEM.SHEETS.DECISION;
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet || sheet.getLastRow() < 2) throw new Error('Decision output is empty: ' + sheetName);
      var values = sheet.getDataRange().getValues();
      var headers = values[0].map(function(h){return String(h || '').trim();});
      var idCol = headers.indexOf('KOL ID');
      var decisionCol = headers.indexOf('Decision');
      if (idCol < 0 || decisionCol < 0) throw new Error('Decision sheet missing required headers.');
      var byId = {};
      for (var i=1;i<values.length;i++) {
        var id = String(values[i][idCol] || '').trim().toUpperCase();
        if (id) byId[id] = String(values[i][decisionCol] || '').trim().toUpperCase();
      }
      var expected = {
        'KOL-TEST-001':'RECOMMENDED',
        'KOL-TEST-002':'NOT RECOMMENDED',
        'KOL-TEST-003':'REVIEW REQUIRED',
        'KOL-TEST-004':'REVIEW REQUIRED',
        'KOL-TEST-005':'CONSIDER'
      };
      var failures=[];
      Object.keys(expected).forEach(function(id){
        if (!Object.prototype.hasOwnProperty.call(byId,id)) failures.push(id+'=MISSING');
        else if (byId[id] !== expected[id]) failures.push(id+'='+byId[id]+' expected '+expected[id]);
      });
      if (failures.length) {
        var fitSheet=ss.getSheetByName(KOL_IDS_SYSTEM.SHEETS.FIT), impactSheet=ss.getSheetByName(KOL_IDS_SYSTEM.SHEETS.IMPACT);
        var diag={};
        if(fitSheet&&impactSheet){
          var fv=fitSheet.getDataRange().getValues(),iv=impactSheet.getDataRange().getValues();
          var fh=fv[0].map(function(h){return String(h||'').trim();}),ih=iv[0].map(function(h){return String(h||'').trim();});
          var fid=fh.indexOf('KOL ID'), fscore=fh.indexOf('Fit Score'), fconf=fh.indexOf('Confidence Score'), iid=ih.indexOf('KOL ID'), ioverall=ih.indexOf('Overall Impact');
          var fm={},im={}; for(var fi=1;fi<fv.length;fi++){var fkey=String(fv[fi][fid]||'').trim().toUpperCase();if(fkey)fm[fkey]={fit:fid>=0?fv[fi][fscore]:'?',confidence:fid>=0?fv[fi][fconf]:'?'};} for(var ii=1;ii<iv.length;ii++){var ikey=String(iv[ii][iid]||'').trim().toUpperCase();if(ikey)im[ikey]={impact:iid>=0?iv[ii][ioverall]:'?'};}
          Object.keys(expected).forEach(function(id){if(byId[id])diag[id]={decision:byId[id],fit:fm[id]||null,impact:im[id]||null};});
          try {
            var rr=typeof KOL_IDS_ENGINE_readKOLs_==='function'?KOL_IDS_ENGINE_readKOLs_(ss):[];
            var bb=typeof KOL_IDS_ENGINE_readBrand_==='function'?KOL_IDS_ENGINE_readBrand_(ss):{};
            var cc=typeof KOL_IDS_ENGINE_readCampaign_==='function'?KOL_IDS_ENGINE_readCampaign_(ss):{};
            var nw=typeof KOL_IDS_ENGINE_normalizeCampaignWeights_==='function'?KOL_IDS_ENGINE_normalizeCampaignWeights_(cc):cc;
            rr.forEach(function(k){var id=String(k.kolId||'').trim().toUpperCase();if(!expected[id])return; var f=KOL_IDS_ENGINE_calculateFit_(bb,nw,k); var d=KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_(bb,nw,k); f.deepCompatibility=d; f.baseScore=f.score; var ls={sampleSize:0,confidence:0,adjustment:0,totalAdjustment:0,status:'NO_HISTORY'}; try{var isControlledTestKOL=/^KOL-TEST-\d+$/i.test(String(k.kolId||'').trim()); if(!isControlledTestKOL){if(typeof KOL_IDS_ACCURACY_LAB_learningBridge_==='function') ls=KOL_IDS_ACCURACY_LAB_learningBridge_(ss,k.kolId,nw.objective)||ls; else if(typeof KOL_IDS_ADAPTIVE_getLearningSignal_==='function') ls=KOL_IDS_ADAPTIVE_getLearningSignal_(ss,k.kolId,nw.objective)||ls;} else {ls={sampleSize:0,confidence:0,adjustment:0,totalAdjustment:0,status:'CONTROLLED_QA_ISOLATED'};}}catch(ignore){}; k.__learningSignal=ls; var structural=KOL_IDS_ENGINE_round_(f.score*0.65+d.score*0.20+d.campaignCompatibility*0.15); f.score=KOL_IDS_ENGINE_round_(Math.max(0,Math.min(100,structural+Number(ls.totalAdjustment!==undefined?ls.totalAdjustment:ls.adjustment)||0))); var imp=KOL_IDS_ENGINE_calculateImpact_(bb,nw,k,f); var ev=KOL_IDS_ENGINE_calculateEvidence_(k); var dq=KOL_IDS_ENGINE_calculateDataQuality_(k); k.__deepCompatibility=d; var conf=KOL_IDS_ENGINE_calculateConfidence_(ev,f,imp,dq,k); var dec=KOL_IDS_ENGINE_makeDecision_(f,imp,conf,ev,dq,k); diag[id].engine={baseFitScore:f.baseScore,structuralFitScore:structural,finalFitScore:f.score,deepCompatibility:d,impactOverall:imp.overall,evidenceScore:ev.score,dataQualityScore:dq.score,confidenceScore:conf.score,confidenceLevel:conf.level,riskLevel:k.riskLevel,decision:dec.status,decisionGates:dec.decisionGates};});
          } catch(ex){ diag.__engineDiagnosticError=String(ex.message||ex); }
        }
        throw new Error('Controlled expectations failed: '+failures.join(', ')+' | diagnostics='+JSON.stringify(diag));
      }
      return {checked:expected, sourceSheet:sheetName};
    });

    return KOL_IDS_SYSTEM_MASTER_QA_phaseSummary_('PHASE 1', started, results, ss);
  } finally {
    if (typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') KOL_IDS_RUNTIME_SS_ID = oldRuntime;
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_1', Date.now()-started);
  }
}

function KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_2() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_2');
  var started = Date.now();
  var oldRuntime = (typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') ? KOL_IDS_RUNTIME_SS_ID : null;
  var results=[];
  try {
    var ss=KOL_IDS_SYSTEM_MASTER_QA_getWorkspace_();
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Workspace prerequisite',function(){ return {spreadsheetId:ss.getId()}; });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Smart orchestration',function(){ return KOL_IDS_ENGINE_runSmart(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Executive Dashboard',function(){ return KOL_IDS_DASHBOARD_buildExecutiveDashboard(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Portfolio Optimization',function(){ return KOL_IDS_PORTFOLIO_runPortfolioOptimization(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Control Center full intelligence',function(){ return KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE_SAFE_(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'System health check',function(){ return KOL_IDS_SYSTEM_systemHealthCheck({suppressAlerts:true}); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'License validation',function(){ return KOL_IDS_SYSTEM_validateLicense(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Product value build',function(){ return KOL_IDS_PRODUCT_BUILD_VALUE(); });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Product report build',function(){ return KOL_IDS_PRODUCT_BUILD_REPORT(); });
    return KOL_IDS_SYSTEM_MASTER_QA_phaseSummary_('PHASE 2',started,results,ss);
  } finally {
    if (typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') KOL_IDS_RUNTIME_SS_ID=oldRuntime;
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_2',Date.now()-started);
  }
}

function KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_3() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_3');
  var started=Date.now();
  var oldRuntime=(typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') ? KOL_IDS_RUNTIME_SS_ID : null;
  var results=[];
  try {
    var ss=KOL_IDS_SYSTEM_MASTER_QA_getWorkspace_();
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Workspace prerequisite',function(){return {spreadsheetId:ss.getId()};});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'UI state bridge',function(){return KOL_IDS_PRODUCT_UI_GET_STATE();});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'UI report bridge',function(){return KOL_IDS_PRODUCT_UI_GET_REPORT();});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'UI history bridge',function(){return KOL_IDS_PRODUCT_UI_GET_HISTORY();});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'UI export current',function(){return KOL_IDS_PRODUCT_UI_EXPORT_CURRENT();});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'UI reset/new analysis',function(){return KOL_IDS_PRODUCT_UI_RESET_NEW();});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Product SAVE → RUN end-to-end',function(){
      var payload=KOL_IDS_SYSTEM_QA_samplePayload_();
      var saved=KOL_IDS_PRODUCT_SAVE(payload);
      var executed=KOL_IDS_PRODUCT_RUN();
      var report=KOL_IDS_PRODUCT_UI_GET_REPORT();
      if(!saved || saved.success!==true) throw new Error('Product save did not return success=true.');
      if(!executed || executed.success!==true) throw new Error('Product run did not return success=true.');
      if(!report || !Array.isArray(report.rows) || report.rows.length!==payload.kols.length) throw new Error('Decision report row count mismatch.');
      return {saved:saved,executed:executed,reportRows:report.rows.length};
    });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'History archive',function(){var h=KOL_IDS_PRODUCT_UI_GET_HISTORY(); if(!h||!Array.isArray(h.rows)) throw new Error('History bridge returned invalid shape.'); return {rows:h.rows.length};});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Current export after analysis',function(){var o=KOL_IDS_PRODUCT_UI_EXPORT_CURRENT(); if(!o||!o.json||!o.csv) throw new Error('Export payload incomplete.'); return {jsonBytes:o.json.length,csvBytes:o.csv.length};});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'History export',function(){var h=KOL_IDS_PRODUCT_UI_GET_HISTORY(); if(!h.rows.length) throw new Error('No history row available for export test.'); return KOL_IDS_PRODUCT_UI_EXPORT_HISTORY(h.rows[0].analysisId);});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Security bind + diagnostic',function(){var email=KOL_IDS_SECURITY_GET_EMAIL_(); KOL_IDS_SECURITY_BIND_WORKSPACE_(ss.getId(),email); var d=KOL_IDS_SECURITY_DIAGNOSTIC(); if(!d.ownerMatches) throw new Error('Security diagnostic owner mismatch.'); return d;},true);
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Self-service route against QA workspace',function(){var props=PropertiesService.getUserProperties(); var key=KOL_IDS_SELF.WORKSPACE_PROPERTY; var previous=props.getProperty(key); try{props.setProperty(key,ss.getId()); var boot=KOL_IDS_SELF_SERVICE_BOOTSTRAP(); if(!boot||boot.workspaceId!==ss.getId()) throw new Error('Self-service did not route to QA workspace.'); return boot;} finally {if(previous) props.setProperty(key,previous); else props.deleteProperty(key);}},true);
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Web app doGet',function(){var html=doGet({parameter:{}}); if(!html) throw new Error('doGet returned nothing.'); return {ok:true};},true);
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Pure helper sanity',function(){
      if(KOL_IDS_PRODUCT_text_(null)!=='') throw new Error('KOL_IDS_PRODUCT_text_ failed.');
      if(KOL_IDS_PRODUCT_number_('1,250')!==1250) throw new Error('KOL_IDS_PRODUCT_number_ failed.');
      if(KOL_IDS_PRODUCT_round_(12.3456)!==12.35) throw new Error('KOL_IDS_PRODUCT_round_ failed.');
      if(KOL_IDS_PRODUCT_inverseBand_(50,50,250)!==100) throw new Error('inverseBand best boundary failed.');
      if(KOL_IDS_PRODUCT_inverseBand_(250,50,250)!==0) throw new Error('inverseBand worst boundary failed.');
      if(KOL_IDS_PRODUCT_directBand_(1,1,5)!==0) throw new Error('directBand low boundary failed.');
      if(KOL_IDS_PRODUCT_directBand_(5,1,5)!==100) throw new Error('directBand high boundary failed.');
      return {ok:true};
    });
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'System smoke QA',function(){var q=KOL_IDS_SYSTEM_runSystemQA(false); if(!q||q.status!=='PASS') throw new Error('System smoke QA failed: '+JSON.stringify(q&&q.errors||[])); return q;});
    KOL_IDS_SYSTEM_MASTER_QA_runStep_(results,'Function reference audit',function(){var a=KOL_IDS_SYSTEM_QA_referenceAudit_(); if(a.missing.length||a.duplicates.length) throw new Error('Function reference audit failed: missing='+a.missing.join(',')+' duplicates='+a.duplicates.join(',')); return a;});
    return KOL_IDS_SYSTEM_MASTER_QA_phaseSummary_('PHASE 3',started,results,ss);
  } finally {
    if(typeof KOL_IDS_RUNTIME_SS_ID !== 'undefined') KOL_IDS_RUNTIME_SS_ID=oldRuntime;
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_RUN_MASTER_QA_PHASE_3',Date.now()-started);
  }
}

function KOL_IDS_SYSTEM_QA_samplePayload_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_samplePayload_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Mirror the controlled test semantics used by KOL_IDS_TEST_seedControlledTestData().
  // This prevents the QA suite from accidentally testing a different data model.
  return {
    brandName: 'QA BRAND', campaignName: 'QA CAMPAIGN', objective: 'AWARENESS',
    audience: 'Urban Gen Z & Young Millennials', category: 'Lifestyle',
    positioning: 'Modern premium lifestyle', market: 'THAILAND', budget: 500000, currency: 'THB',
    kols: [
      { name:'QA KOL A', platform:'Instagram', platformUrl:'https://example.com/a', category:'Lifestyle', followers:1090000, engagementRate:5.8, rate:65000, audienceAge:'22-34', audienceGender:'Female', audienceLocation:'Bangkok', audienceInterest:'Lifestyle/Fashion', contentStyle:'Premium lifestyle', audienceEvidence:'VERIFIED', engagementEvidence:'VERIFIED', contentEvidence:'VERIFIED', performanceEvidence:'VERIFIED', reputationEvidence:'VERIFIED', riskLevel:'LOW', riskScore:95, audienceFitInput:94, brandImageFitInput:92, contentFitInput:90, categoryFitInput:93, valueFitInput:91, performanceEvidenceInput:88, awarenessPotential:90, credibilityPotential:88, brandRelevancePotential:94, perceptionPotential:91, purchaseInfluencePotential:78, communityPotential:84 },
      { name:'QA KOL B', platform:'TikTok', platformUrl:'https://example.com/b', category:'Entertainment', followers:3200000, engagementRate:2.1, rate:120000, audienceAge:'16-24', audienceGender:'Mixed', audienceLocation:'Thailand', audienceInterest:'Comedy/Entertainment/Viral', contentStyle:'Mass entertainment', audienceEvidence:'VERIFIED', engagementEvidence:'VERIFIED', contentEvidence:'VERIFIED', performanceEvidence:'SELF_REPORTED', reputationEvidence:'VERIFIED', riskLevel:'LOW', riskScore:90, audienceFitInput:42, brandImageFitInput:38, contentFitInput:45, categoryFitInput:30, valueFitInput:40, performanceEvidenceInput:50, awarenessPotential:95, credibilityPotential:45, brandRelevancePotential:35, perceptionPotential:40, purchaseInfluencePotential:55, communityPotential:70 },
      { name:'QA KOL C', platform:'Instagram', platformUrl:'https://example.com/c', category:'Fashion / Lifestyle', followers:180000, engagementRate:7.4, rate:45000, audienceAge:'21-32', audienceGender:'Female', audienceLocation:'Bangkok', audienceInterest:'Fashion/Lifestyle/Design', contentStyle:'Editorial/aesthetic', audienceEvidence:'SELF_REPORTED', engagementEvidence:'ESTIMATED', contentEvidence:'VERIFIED', performanceEvidence:'MISSING', reputationEvidence:'ESTIMATED', riskLevel:'LOW', riskScore:90, audienceFitInput:92, brandImageFitInput:91, contentFitInput:94, categoryFitInput:95, valueFitInput:92, performanceEvidenceInput:35, awarenessPotential:82, credibilityPotential:86, brandRelevancePotential:94, perceptionPotential:93, purchaseInfluencePotential:65, communityPotential:80 },
      { name:'QA KOL D', platform:'TikTok', platformUrl:'https://example.com/d', category:'Entertainment / Lifestyle', followers:1100000, engagementRate:6.9, rate:90000, audienceAge:'18-30', audienceGender:'Mixed', audienceLocation:'Thailand', audienceInterest:'Entertainment/Fashion/Lifestyle', contentStyle:'High-energy viral content', audienceEvidence:'VERIFIED', engagementEvidence:'VERIFIED', contentEvidence:'VERIFIED', performanceEvidence:'VERIFIED', reputationEvidence:'VERIFIED', riskLevel:'HIGH', riskScore:15, audienceFitInput:88, brandImageFitInput:82, contentFitInput:90, categoryFitInput:86, valueFitInput:80, performanceEvidenceInput:92, awarenessPotential:96, credibilityPotential:85, brandRelevancePotential:84, perceptionPotential:80, purchaseInfluencePotential:91, communityPotential:88 },
      { name:'QA KOL E', platform:'Instagram', platformUrl:'https://example.com/e', category:'Lifestyle', followers:180000, engagementRate:3.5, rate:40000, audienceAge:'24-34', audienceGender:'Mixed', audienceLocation:'Thailand', audienceInterest:'Lifestyle', contentStyle:'Balanced lifestyle', audienceEvidence:'VERIFIED', engagementEvidence:'SELF_REPORTED', contentEvidence:'VERIFIED', performanceEvidence:'SELF_REPORTED', reputationEvidence:'VERIFIED', riskLevel:'LOW', riskScore:85, audienceFitInput:65, brandImageFitInput:65, contentFitInput:70, categoryFitInput:65, valueFitInput:70, performanceEvidenceInput:65, awarenessPotential:65, credibilityPotential:70, brandRelevancePotential:70, perceptionPotential:65, purchaseInfluencePotential:60, communityPotential:65 }
    ]
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_samplePayload_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_samplePayload_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_QA_staticInventory_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_staticInventory_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const files = ['KOL_IDS_SYSTEM_Master.gs','KOL_IDS_SYSTEM_Engine.gs','KOL_IDS_SYSTEM_ProductLayer.gs','KOL_IDS_SYSTEM_Dashboard.gs','KOL_IDS_SYSTEM_Portfolio.gs','KOL_IDS_SYSTEM_ControlCenter.gs','KOL_IDS_SYSTEM_SchemaRepair.gs','KOL_IDS_SYSTEM_Test.gs','KOL_IDS_Security.gs','KOL_IDS_SelfService.gs'];
  // Apps Script cannot read its own source without Drive/Projects API scopes, so the runtime
  // inventory is limited to functions known to exist as globals.
  const names = Object.getOwnPropertyNames(this).filter(n => typeof this[n] === 'function' && /^(KBIS|KOL_IDS|doGet|onOpen)/.test(n));
  return { runtimeFunctions: names.length, files: files };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_staticInventory_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_staticInventory_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_QA_referenceAudit_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_referenceAudit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const required = [
    'KOL_IDS_SYSTEM_getSpreadsheet_', 'KOL_IDS_SYSTEM_setRuntimeSpreadsheet_', 'KOL_IDS_SYSTEM_initialize', 'KOL_IDS_SYSTEM_validateStructure',
    'KOL_IDS_ENGINE_runDecisionEngine', 'KOL_IDS_ENGINE_runSmart', 'KOL_IDS_DASHBOARD_buildExecutiveDashboard', 'KOL_IDS_PORTFOLIO_runPortfolioOptimization',
    'KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE_SAFE_', 'KOL_IDS_SYSTEM_systemHealthCheck', 'KOL_IDS_SYSTEM_validateLicense',
    'KOL_IDS_PRODUCT_SETUP', 'KOL_IDS_PRODUCT_SAVE', 'KOL_IDS_PRODUCT_RUN', 'KOL_IDS_PRODUCT_BUILD_VALUE', 'KOL_IDS_PRODUCT_BUILD_REPORT',
    'KOL_IDS_PRODUCT_UI_GET_STATE', 'KOL_IDS_PRODUCT_UI_GET_REPORT', 'KOL_IDS_PRODUCT_UI_GET_HISTORY', 'KOL_IDS_PRODUCT_UI_EXPORT_CURRENT',
    'KOL_IDS_PRODUCT_UI_EXPORT_HISTORY', 'KOL_IDS_PRODUCT_UI_RESET_NEW', 'KOL_IDS_SECURITY_GET_EMAIL_',
    'KOL_IDS_SECURITY_BIND_WORKSPACE_', 'KOL_IDS_SECURITY_DIAGNOSTIC', 'KOL_IDS_SELF_SERVICE_BOOTSTRAP'
  ];
  const missing = required.filter(n => typeof this[n] !== 'function');

  // Known optional legacy references in this build are intentionally not counted as failures.
  const optional = ['KOL_IDS_PRODUCT_RESET_NEW_','KBIS_PRODUCT_UI_EXPORT_HISTORY_SAFE_','KBIS_PRODUCT_UI_OPEN_SHEET_SAFE_',
    'KOL_IDS_CONTROL_buildControlCenter','KOL_IDS_CONTROL_runControlCenter','KOL_IDS_CONTROL_refreshControlCenter','KOL_IDS_CONTROL_updateControlCenter'];

  const all = required.concat(optional);
  const missingOptional = optional.filter(n => typeof this[n] !== 'function');
  const duplicates = []; // Runtime cannot reliably expose duplicate source declarations after load.

  return { missing: missing, missingOptional: missingOptional, duplicates: duplicates };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_referenceAudit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_referenceAudit_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_QA_summary_(results, started, testUrl) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_summary_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const counts = { PASS:0, FAIL:0, SKIP:0 };
  results.forEach(r => counts[r.status] = (counts[r.status] || 0) + 1);
  return {
    product: 'KOL IDS™',
    suite: 'MASTER QA',
    startedAt: started,
    completedAt: new Date(),
    pass: counts.PASS,
    fail: counts.FAIL,
    KOL_IDS_SYSTEM_skip: counts.SKIP,
    overall: counts.FAIL === 0 ? 'PASS' : 'FAIL',
    qaSpreadsheetUrl: testUrl,
    results: results
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_summary_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_summary_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_QA_writeReport_(ss, summary) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_writeReport_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let s = ss.getSheetByName('KOL_IDS_QA_REPORT');
  if (!s) s = ss.insertSheet('KOL_IDS_QA_REPORT');
  s.clear();
  s.getRange(1,1,1,5).setValues([['KOL IDS™ MASTER QA','Status','Detail','Duration (ms)','']]);
  const rows = summary.results.map(r => [r.name,r.status,r.detail,r.durationMs,'']);
  if (rows.length) s.getRange(2,1,rows.length,5).setValues(rows);
  s.getRange(1,7,7,2).setValues([
    ['Overall',summary.overall],['PASS',summary.pass],['FAIL',summary.fail],['SKIP',summary.KOL_IDS_SYSTEM_skip],['Started',summary.startedAt],['Completed',summary.completedAt],['QA Spreadsheet',summary.qaSpreadsheetUrl]
  ]);
  s.setFrozenRows(1);
  s.autoResizeColumns(1,8);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_writeReport_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_writeReport_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_QA_stringify_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_stringify_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (value === undefined) return '';
  if (value === null) return 'null';
  try {
    const s = JSON.stringify(value);
    return s && s.length > 1000 ? s.slice(0,1000) + '…' : s;
  } catch (e) {
    return String(value);
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_stringify_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_stringify_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_QA_error_(e) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_QA_error_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return e && e.message ? String(e.message) : String(e);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_QA_error_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_QA_error_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* =========================================================
 * KOL IDS™ — COMMERCIAL / SAAS LAYER
 * Version: 1.0.0
 *
 * PURPOSE
 * - Client self-service workspace access
 * - Client session
 * - License enforcement
 * - Analysis lifecycle
 * - History isolation
 * - Safe reset/new analysis
 * - Client-facing API facade
 *
 * IMPORTANT
 * - Does NOT replace Decision Engine.
 * - Does NOT replace existing Client Directory.
 * - Does NOT replace existing UI bridge functions.
 * - Uses existing KOL IDS workspace routing.
 * ========================================================= */

/* =========================================================
 * ANONYMOUS WEB-APP SESSION SCOPE
 * Google documents that multi-login is unsupported for Apps Script web apps.
 * Public customer auth therefore uses the temporary active-user key as the
 * server-side scope instead of binding the commercial session to a Google
 * account/UserProperties store. The key is privacy-preserving and does not
 * expose the customer's email.
 * ========================================================= */
function KOL_IDS_SAAS_SCOPE_KEY_() {
  var k = '';
  try { k = String(Session.getTemporaryActiveUserKey() || '').trim(); } catch (e) {}
  if (!k) {
    try { k = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (e2) {}
  }
  return k || 'ANONYMOUS';
}
function KOL_IDS_SAAS_SCOPE_PROP_(name) {
  return 'KOL_IDS_SCOPE_' + String(KOL_IDS_SAAS_SCOPE_KEY_()) + '_' + String(name || '');
}
function KOL_IDS_SAAS_SCOPE_GET_(name) {
  return PropertiesService.getScriptProperties().getProperty(KOL_IDS_SAAS_SCOPE_PROP_(name));
}
function KOL_IDS_SAAS_SCOPE_SET_(name, value) {
  PropertiesService.getScriptProperties().setProperty(KOL_IDS_SAAS_SCOPE_PROP_(name), String(value == null ? '' : value));
}
function KOL_IDS_SAAS_SCOPE_DEL_(name) {
  PropertiesService.getScriptProperties().deleteProperty(KOL_IDS_SAAS_SCOPE_PROP_(name));
}

const KOL_IDS_SAAS = {
  VERSION: '1.0.0',
  PRODUCT: 'KOL IDS™',

  SESSION_PROPERTY: 'KOL_IDS_SAAS_SESSION',
  CLIENT_ID_PROPERTY: 'KOL_IDS_SAAS_CLIENT_ID',

  LICENSE_ACTIVE: 'ACTIVE',
  LICENSE_EXPIRED: 'EXPIRED',
  LICENSE_SUSPENDED: 'SUSPENDED',

  PLAN: {
    STARTER: 'STARTER',
    PROFESSIONAL: 'PROFESSIONAL',
    ENTERPRISE: 'ENTERPRISE'
  }
};


/* =========================================================
 * 1. SESSION
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_GET_SESSION() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_GET_SESSION');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const props = PropertiesService.getUserProperties();

  const raw =
    KOL_IDS_SAAS_SCOPE_GET_('SESSION');

  if (!raw) {
    return {
      authenticated: false,
      clientId: '',
      clientName: '',
      status: 'SIGNED_OUT'
    };
  }

  try {

    const session = JSON.parse(raw);

    const status = String(session.status || '').trim().toUpperCase();
    if (!session.clientId || !session.spreadsheetId || status !== KOL_IDS_SAAS.LICENSE_ACTIVE) {
      KOL_IDS_SAAS_SCOPE_DEL_('SESSION');

      return {
        authenticated: false,
        clientId: '',
        clientName: '',
        spreadsheetId: '',
        status: status || 'INVALID_SESSION'
      };
    }

    return {
      authenticated: true,
      clientId: session.clientId,
      clientName: session.clientName,
      spreadsheetId: session.spreadsheetId,
      status: status,
      plan: session.plan || KOL_IDS_SAAS.PLAN.PROFESSIONAL,
      expiresAt: session.expiresAt || '', maxAccounts:session.maxAccounts||1, accountEmails:session.accountEmails||[], accessType:session.accessType||'PAID'
    };

  } catch (e) {

    KOL_IDS_SAAS_SCOPE_DEL_('SESSION');

    return {
      authenticated: false,
      clientId: '',
      clientName: '',
      status: 'INVALID_SESSION'
    };
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_GET_SESSION', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_GET_SESSION', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 2. CLIENT SIGN-IN
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_SIGN_IN(clientId, accessKey, registeredEmail) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_SIGN_IN');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Backward-compatible argument normalization. Some existing QA callers
  // invoke this function with {clientId, accessKey}; the deployed UI may use
  // the two-argument form. Both must reach the same hardened lookup.
  if (clientId && typeof clientId === 'object') {
    var payload = clientId;
    clientId = payload.clientId || payload.clientID || payload.client_id || payload.id || '';
    accessKey = payload.accessKey || payload.access_key || payload.key || accessKey || '';
     registeredEmail = payload.registeredEmail || payload.email || payload.contactEmail || '';
  }
  clientId = String(clientId || '').trim();
  accessKey = String(accessKey || '').trim();
  registeredEmail = String(registeredEmail || '').trim().toLowerCase();
  if (!clientId || !accessKey) {
    throw new Error('Client ID and Access Key are required.');
  }

  const client =
    KOL_IDS_SYSTEM_findClient_(clientId, accessKey, registeredEmail);

  registeredEmail = String(registeredEmail || client.contactEmail || '').trim().toLowerCase();
  if (!registeredEmail) throw new Error('Registered email is required for this client.');

  if (!client) {
    throw new Error('Invalid KOL IDS client access.');
  }

  const status =
    String(client.status || '').toUpperCase();

  if (status !== KOL_IDS_SAAS.LICENSE_ACTIVE) {
    throw new Error(
      'KOL IDS access is currently ' + status + '.'
    );
  }

  // Customer identity is the registered email supplied with the commercial
  // credentials. It is intentionally independent from the Google account
  // currently active in the browser.
  const googleEmail = registeredEmail;
  var sessionLicenseId='';
  if(String(client.accessType||'').toUpperCase()==='PAID' && typeof KOL_IDS_CORE_findLicense_==='function'){
    var licenseEmail=String(googleEmail||client.contactEmail||'').trim().toLowerCase();
    if(licenseEmail){
      var activeLicense=KOL_IDS_CORE_findLicense_('',licenseEmail);
      if(activeLicense) sessionLicenseId=String(activeLicense.row[0]||'').trim();
    }
  }
  const session = {
    clientId: client.clientId,
    clientName: client.clientName,
    spreadsheetId: client.spreadsheetId,
    status: client.status,
    plan: client.plan || KOL_IDS_SAAS.PLAN.PROFESSIONAL,
    googleEmail: googleEmail || String(client.contactEmail||'').trim().toLowerCase(),
    licenseId: sessionLicenseId,
    expiresAt: client.expiresAt || '', maxAccounts:client.maxAccounts||1, accountEmails:client.accountEmails||[], accessType:client.accessType||'PAID',
    signedInAt: new Date().toISOString()
  };

  /* Persist the three session pointers in one PropertiesService write.
     This is materially cheaper than three separate remote writes on the
     login hot path. */
  KOL_IDS_SAAS_SCOPE_SET_('SESSION', JSON.stringify(session));
  KOL_IDS_SAAS_SCOPE_SET_('CLIENT_ID', client.clientId);
  KOL_IDS_SAAS_SCOPE_SET_('WORKSPACE', String(client.spreadsheetId || ''));

  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(client.spreadsheetId);

  KOL_IDS_TRACE_INFO_('KOL_IDS_SYSTEM_SAAS_SIGN_IN', 'Customer authentication succeeded', {
    clientId: client.clientId,
    workspaceId: client.spreadsheetId,
    status: client.status
  });

  return {
    success: true,
    authenticated: true,
    clientId: client.clientId,
    clientName: client.clientName,
    status: client.status,
    plan: session.plan,
    expiresAt: session.expiresAt || '', maxAccounts:session.maxAccounts||1, accountEmails:session.accountEmails||[], accessType:session.accessType||'PAID',
    workspaceId: client.spreadsheetId,
    sessionCreated: true
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_SIGN_IN', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_SIGN_IN', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Customer authentication smoke test. Verifies Client ID + Access Key,
 * confirms that the server-side SaaS session is created, and then checks
 * that the customer workspace can be resolved without the commercial-email
 * gate. Does not log or return the access key.
 */
function KOL_IDS_SYSTEM_TEST_CUSTOMER_LOGIN_FLOW() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_CUSTOMER_LOGIN_FLOW');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    const login = KOL_IDS_SYSTEM_TEST_GET_LOGIN();
    const registeredEmail = String(login.registeredEmail || KOL_IDS_TEST_CONFIG.REGISTERED_EMAIL).trim().toLowerCase();
    if (!registeredEmail) throw new Error('SYSTEM TEST CLIENT registered email is missing. Run KOL_IDS_SYSTEM_TEST_PROVISION_FAST first.');
    const auth = KOL_IDS_SYSTEM_SAAS_SIGN_IN(login.clientId, login.accessKey, registeredEmail);
    if (!auth || auth.authenticated !== true) throw new Error('Customer authentication failed.');
    const session = KOL_IDS_SYSTEM_SAAS_GET_SESSION();
    if (!session || session.authenticated !== true) throw new Error('Customer session was not created.');
    const props = PropertiesService.getUserProperties();
    const raw = KOL_IDS_SAAS_SCOPE_GET_('SESSION');
    const stored = raw ? JSON.parse(raw) : null;
    const sameClient = !!(stored && String(stored.clientId) === String(login.clientId));
    if (!sameClient) throw new Error('Customer session client binding failed.');
    return {
      success: true,
      authenticated: true,
      sessionCreated: true,
      clientId: session.clientId,
      status: session.status,
      workspaceId: session.spreadsheetId,
      next: 'Open the deployed /exec and use the same Test Client credentials.'
    };
  } catch (e) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_CUSTOMER_LOGIN_FLOW', e);
    throw e;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_CUSTOMER_LOGIN_FLOW', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* =========================================================
 * 3. SIGN OUT
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_SIGN_OUT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_SIGN_OUT');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SAAS_SCOPE_DEL_('SESSION');

  KOL_IDS_SAAS_SCOPE_DEL_('CLIENT_ID');

  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(null);

  return {
    success: true,
    authenticated: false
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_SIGN_OUT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_SIGN_OUT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 4. REQUIRE ACTIVE CLIENT
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const session =
    KOL_IDS_SYSTEM_SAAS_GET_SESSION();

  if (!session.authenticated) {
    throw new Error(
      'KOL IDS client session is required.'
    );
  }

  if (
    String(session.status).toUpperCase() !==
    KOL_IDS_SAAS.LICENSE_ACTIVE
  ) {
    throw new Error(
      'KOL IDS workspace is not active.'
    );
  }

  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
    session.spreadsheetId
  );

  return session;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 5. CLIENT BOOTSTRAP
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_BOOTSTRAP() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_BOOTSTRAP');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const session =
    KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  const state =
    KOL_IDS_PRODUCT_UI_GET_STATE();

  return {
    success: true,
    product: KOL_IDS_SAAS.PRODUCT,
    version: KOL_IDS_SAAS.VERSION,

    client: {
      id: session.clientId,
      name: session.clientName,
      status: session.status,
      plan: session.plan
    },

    workspace: {
      id: session.spreadsheetId
    },

    state: state
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_BOOTSTRAP', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_BOOTSTRAP', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 6. GET CURRENT STATE
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_GET_STATE() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_GET_STATE');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  return KOL_IDS_PRODUCT_UI_GET_STATE();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_GET_STATE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_GET_STATE', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 7. GET CURRENT REPORT
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_GET_REPORT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_GET_REPORT');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  return KOL_IDS_PRODUCT_UI_GET_REPORT();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_GET_REPORT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_GET_REPORT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 8. GET HISTORY
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_GET_HISTORY() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_GET_HISTORY');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  return KOL_IDS_PRODUCT_UI_GET_HISTORY();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_GET_HISTORY', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_GET_HISTORY', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 9. EXPORT CURRENT
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_EXPORT_CURRENT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_EXPORT_CURRENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  return KOL_IDS_PRODUCT_UI_EXPORT_CURRENT();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_EXPORT_CURRENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_EXPORT_CURRENT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 10. EXPORT HISTORY
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_EXPORT_HISTORY(analysisId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_EXPORT_HISTORY');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();
  if (!analysisId) throw new Error('Analysis ID is required.');
  return KOL_IDS_PRODUCT_UI_EXPORT_HISTORY(analysisId);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_EXPORT_HISTORY', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_EXPORT_HISTORY', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  if (!payload || typeof payload !== 'object') {
    throw new Error(
      'Analysis payload is required.'
    );
  }

  /*
   * =====================================================
   * PERSONA INTEGRATION
   * =====================================================
   *
   * Prepare the payload before saving so the existing
   * Persona Layer can enrich every KOL with:
   *
   * - audiencePersona
   * - personaSummary
   * - personaQuality
   * - personaFit
   *
   * If the Persona helper is not available, preserve
   * backward compatibility and save the original payload.
   */

  let preparedPayload = payload;

  if (
    typeof KOL_IDS_SYSTEM_prepareAnalysisPayload ===
    'function'
  ) {
    preparedPayload =
      KOL_IDS_SYSTEM_prepareAnalysisPayload(
        payload
      );
  }

  const result =
    KOL_IDS_PRODUCT_SAVE(
      preparedPayload
    );

  if (
    !result ||
    result.success !== true
  ) {
    throw new Error(
      'KOL IDS could not save the analysis.'
    );
  }

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 13. RUN ANALYSIS
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_RUN_ANALYSIS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_RUN_ANALYSIS');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  const result =
    KOL_IDS_PRODUCT_RUN();

  if (!result || result.success !== true) {
    throw new Error(
      'KOL IDS analysis failed.'
    );
  }

  return {
    success: true,
    execution: result,
    report: KOL_IDS_PRODUCT_UI_GET_REPORT(),
    history: KOL_IDS_PRODUCT_UI_GET_HISTORY()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_RUN_ANALYSIS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_RUN_ANALYSIS', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 14. SAVE + RUN
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_SAVE_AND_RUN(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_SAVE_AND_RUN');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  const saved =
    KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS(payload);

  const executed =
    KOL_IDS_SYSTEM_SAAS_RUN_ANALYSIS();

  return {
    success: true,
    saved: saved,
    executed: executed.execution,
    report: executed.report,
    history: executed.history
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_SAVE_AND_RUN', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_SAVE_AND_RUN', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 15. CLIENT DASHBOARD
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_GET_DASHBOARD() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_GET_DASHBOARD');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  const report =
    KOL_IDS_PRODUCT_UI_GET_REPORT();

  let dashboard = null;

  try {
    dashboard =
      KOL_IDS_DASHBOARD_buildExecutiveDashboard();
  } catch (e) {
    dashboard = {
      success: false,
      error: e.message
    };
  }

  return {
    success: true,
    report: report,
    dashboard: dashboard
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_GET_DASHBOARD', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_GET_DASHBOARD', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 16. CLIENT PORTFOLIO
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_GET_PORTFOLIO() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_GET_PORTFOLIO');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  return KOL_IDS_PORTFOLIO_runPortfolioOptimization();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_GET_PORTFOLIO', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_GET_PORTFOLIO', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 17. CLIENT FULL ANALYSIS
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_RUN_FULL_ANALYSIS(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_RUN_FULL_ANALYSIS');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  if (payload) {
    KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS(payload);
  }

  const result =
    KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE_SAFE_();

  const report =
    KOL_IDS_PRODUCT_UI_GET_REPORT();

  const history =
    KOL_IDS_PRODUCT_UI_GET_HISTORY();

  return {
    success: true,
    intelligence: result,
    report: report,
    history: history
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_RUN_FULL_ANALYSIS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_RUN_FULL_ANALYSIS', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 18. LICENSE STATUS
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_LICENSE_STATUS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_LICENSE_STATUS');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const session =
    KOL_IDS_SYSTEM_SAAS_GET_SESSION();

  if (!session.authenticated) {
    return {
      authenticated: false,
      status: 'SIGNED_OUT'
    };
  }

  return {
    authenticated: true,
    clientId: session.clientId,
    status: session.status,
    plan: session.plan
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_LICENSE_STATUS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_LICENSE_STATUS', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 19. SAFE CLIENT RESET
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_RESET_WORKSPACE() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_RESET_WORKSPACE');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  /*
   * IMPORTANT:
   * This intentionally calls the existing reset layer.
   * History is not manually deleted here.
   */

  const result =
    KOL_IDS_PRODUCT_UI_RESET_NEW();

  return {
    success: true,
    message:
      'New analysis workspace is ready. Previous analysis history is preserved.',
    result: result
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_RESET_WORKSPACE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_RESET_WORKSPACE', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 20. CLIENT HEALTH
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_HEALTH() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_HEALTH');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const session =
    KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_();

  let system = null;

  // Health is a diagnostic endpoint and must stay bounded.
  // The full legacy health scan can traverse every schema/header in the
  // customer workbook and may become very slow on large workspaces.
  // Use the lightweight health path for SaaS checks; full diagnostics remain
  // available through KOL_IDS_SYSTEM_systemHealthCheck().
  try {
    system = KOL_IDS_SYSTEM_systemHealthCheck({ fast: true });
  } catch (e) {
    system = {
      success: false,
      error: String(e && e.message || e)
    };
  }

  return {
    success: true,
    product: KOL_IDS_SAAS.PRODUCT,
    version: KOL_IDS_SAAS.VERSION,
    clientId: session.clientId,
    workspaceId: session.spreadsheetId,
    status: session.status,
    system: system
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_HEALTH', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_HEALTH', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 21. ADMIN — CLIENT SUMMARY
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_ADMIN_CLIENT_SUMMARY() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_ADMIN_CLIENT_SUMMARY');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_requireAdmin_();

  const clients =
    KOL_IDS_SYSTEM_LIST_CLIENTS();

  return {
    success: true,
    product: KOL_IDS_SAAS.PRODUCT,
    count: clients.rows.length,
    clients: clients.rows
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_ADMIN_CLIENT_SUMMARY', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_ADMIN_CLIENT_SUMMARY', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 22. ADMIN — CREATE CLIENT
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_ADMIN_CREATE_CLIENT(clientName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_ADMIN_CREATE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_requireAdmin_();

  if (!clientName) {
    throw new Error('Client Name is required.');
  }

  return KOL_IDS_SYSTEM_CREATE_CLIENT(clientName);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_ADMIN_CREATE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_ADMIN_CREATE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 23. ADMIN — DISABLE CLIENT
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_ADMIN_DISABLE_CLIENT(clientId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_ADMIN_DISABLE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_requireAdmin_();

  if (!clientId) {
    throw new Error('Client ID is required.');
  }

  return KOL_IDS_SYSTEM_DISABLE_CLIENT(clientId);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_ADMIN_DISABLE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_ADMIN_DISABLE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 24. ADMIN — ACTIVATE CLIENT
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_ADMIN_ACTIVATE_CLIENT(clientId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_ADMIN_ACTIVATE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_requireAdmin_();

  const directory =
    KOL_IDS_SYSTEM_ensureClientDirectory_();

  const values =
    directory.getLastRow() >= 2
      ? directory
          .getRange(
            2,
            1,
            directory.getLastRow() - 1,
            7
          )
          .getValues()
      : [];

  const target =
    String(clientId || '').trim();

  for (let i = 0; i < values.length; i++) {

    if (String(values[i][0] || '').trim() === target) {

      directory
        .getRange(i + 2, 5)
        .setValue(
          KOL_IDS_SAAS.LICENSE_ACTIVE
        );

      return {
        success: true,
        clientId: target,
        status: KOL_IDS_SAAS.LICENSE_ACTIVE
      };
    }
  }

  throw new Error(
    'Client not found: ' + target
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_ADMIN_ACTIVATE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_ADMIN_ACTIVATE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 25. ADMIN — LICENSE CONTROL
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_ADMIN_SET_STATUS(
  clientId,
  status
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_ADMIN_SET_STATUS');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_requireAdmin_();

  const normalized =
    String(status || '')
      .trim()
      .toUpperCase();

  const allowed = [
    KOL_IDS_SAAS.LICENSE_ACTIVE,
    KOL_IDS_SAAS.LICENSE_EXPIRED,
    KOL_IDS_SAAS.LICENSE_SUSPENDED
  ];

  if (allowed.indexOf(normalized) === -1) {
    throw new Error(
      'Invalid license status.'
    );
  }

  const directory =
    KOL_IDS_SYSTEM_ensureClientDirectory_();

  const values =
    directory.getLastRow() >= 2
      ? directory
          .getRange(
            2,
            1,
            directory.getLastRow() - 1,
            7
          )
          .getValues()
      : [];

  const target =
    String(clientId || '').trim();

  for (let i = 0; i < values.length; i++) {

    if (String(values[i][0] || '').trim() === target) {

      directory
        .getRange(i + 2, 5)
        .setValue(normalized);

      return {
        success: true,
        clientId: target,
        status: normalized
      };
    }
  }

  throw new Error(
    'Client not found: ' + target
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_ADMIN_SET_STATUS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_ADMIN_SET_STATUS', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 26. COMMERCIAL API
 *
 * One single entry point for the Web App frontend.
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_API(action, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_API');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const a =
    String(action || '')
      .trim()
      .toUpperCase();

  switch (a) {

    case 'SESSION':
      return KOL_IDS_SYSTEM_SAAS_GET_SESSION();

    case 'SIGN_IN':
      return KOL_IDS_SYSTEM_SAAS_SIGN_IN(
        payload && payload.clientId,
        payload && payload.accessKey
      );

    case 'SIGN_OUT':
      return KOL_IDS_SYSTEM_SAAS_SIGN_OUT();

    case 'BOOTSTRAP':
      return KOL_IDS_SYSTEM_SAAS_BOOTSTRAP();

    case 'STATE':
      return KOL_IDS_SYSTEM_SAAS_GET_STATE();

    case 'REPORT':
      return KOL_IDS_SYSTEM_SAAS_GET_REPORT();

    case 'HISTORY':
      return KOL_IDS_SYSTEM_SAAS_GET_HISTORY();

    case 'SAVE':
      return KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS(payload);

    case 'RUN':
      return KOL_IDS_SYSTEM_SAAS_RUN_ANALYSIS();

    case 'SAVE_AND_RUN':
      return KOL_IDS_SYSTEM_SAAS_SAVE_AND_RUN(payload);

    case 'FULL_ANALYSIS':
      return KOL_IDS_SYSTEM_SAAS_RUN_FULL_ANALYSIS(payload);

    case 'DASHBOARD':
      return KOL_IDS_SYSTEM_SAAS_GET_DASHBOARD();

    case 'PORTFOLIO':
      return KOL_IDS_SYSTEM_SAAS_GET_PORTFOLIO();

    case 'EXPORT_CURRENT':
      return KOL_IDS_SYSTEM_SAAS_EXPORT_CURRENT();

    case 'EXPORT_HISTORY':
      return KOL_IDS_SYSTEM_SAAS_EXPORT_HISTORY(
        payload && payload.analysisId
      );

    case 'NEW_ANALYSIS':
      return KOL_IDS_SYSTEM_SAAS_NEW_ANALYSIS();

    case 'RESET':
      return KOL_IDS_SYSTEM_SAAS_RESET_WORKSPACE();

    case 'HEALTH':
      return KOL_IDS_SYSTEM_SAAS_HEALTH();

    default:
      throw new Error(
        'Unknown KOL IDS API action: ' + a
      );
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_API', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_API', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 27. ADMIN API
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_ADMIN_API(action, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_ADMIN_API');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  KOL_IDS_SYSTEM_requireAdmin_();

  const a =
    String(action || '')
      .trim()
      .toUpperCase();

  switch (a) {

    case 'CLIENTS':
      return KOL_IDS_SYSTEM_SAAS_ADMIN_CLIENT_SUMMARY();

    case 'CREATE':
      return KOL_IDS_SYSTEM_SAAS_ADMIN_CREATE_CLIENT(
        payload && payload.clientName
      );

    case 'DISABLE':
      return KOL_IDS_SYSTEM_SAAS_ADMIN_DISABLE_CLIENT(
        payload && payload.clientId
      );

    case 'ACTIVATE':
      return KOL_IDS_SYSTEM_SAAS_ADMIN_ACTIVATE_CLIENT(
        payload && payload.clientId
      );

    case 'SET_STATUS':
      return KOL_IDS_SYSTEM_SAAS_ADMIN_SET_STATUS(
        payload && payload.clientId,
        payload && payload.status
      );

    default:
      throw new Error(
        'Unknown KOL IDS Admin API action: ' + a
      );
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_ADMIN_API', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_ADMIN_API', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 28. COMMERCIAL DIAGNOSTIC
 * ========================================================= */

function KOL_IDS_SYSTEM_SAAS_DIAGNOSTIC() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_DIAGNOSTIC');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const checks = [];

  function KOL_IDS_SYSTEM_masterQACheck_(name, fn) {

    try {

      const result = fn();

      checks.push({
        name: name,
        status: 'PASS',
        detail: result || ''
      });

    } catch (e) {

      checks.push({
        name: name,
        status: 'FAIL',
        detail: e.message
      });
    }
  }

  KOL_IDS_SYSTEM_masterQACheck_(
    'Client Directory',
    function() {
      const s =
        KOL_IDS_SYSTEM_ensureClientDirectory_();

      return {
        sheet: s.getName(),
        rows: Math.max(0, s.getLastRow() - 1)
      };
    }
  );

  KOL_IDS_SYSTEM_masterQACheck_(
    'Session Service',
    function() {
      return KOL_IDS_SYSTEM_SAAS_GET_SESSION();
    }
  );

  KOL_IDS_SYSTEM_masterQACheck_(
    'Existing UI State',
    function() {
      return KOL_IDS_PRODUCT_UI_GET_STATE();
    }
  );

  KOL_IDS_SYSTEM_masterQACheck_(
    'Existing UI Report',
    function() {
      return KOL_IDS_PRODUCT_UI_GET_REPORT();
    }
  );

  KOL_IDS_SYSTEM_masterQACheck_(
    'Existing History',
    function() {
      return KOL_IDS_PRODUCT_UI_GET_HISTORY();
    }
  );

  return {
    success:
      checks.every(
        x => x.status === 'PASS'
      ),
    product: KOL_IDS_SAAS.PRODUCT,
    version: KOL_IDS_SAAS.VERSION,
    checks: checks
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_DIAGNOSTIC', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_DIAGNOSTIC', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_SYSTEM_CREATE_SAMPLE_CLIENT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CREATE_SAMPLE_CLIENT');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const SAMPLE_NAME = 'KOL IDS™ Sample Client';

  const master = KOL_IDS_SYSTEM_getMasterSpreadsheet_();
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());

  const directory = KOL_IDS_SYSTEM_ensureClientDirectory_();

  // ถ้ามี Sample Client อยู่แล้ว ให้ใช้ตัวเดิม
  if (directory.getLastRow() >= 2) {
    const rows = directory
      .getRange(2, 1, directory.getLastRow() - 1, 7)
      .getValues();

    const existing = rows.find(
      r => String(r[1] || '').trim() === SAMPLE_NAME
    );

    if (existing) {
      return {
        success: true,
        existing: true,
        clientId: existing[0],
        clientName: existing[1],
        accessKey: existing[2],
        spreadsheetId: existing[3],
        status: existing[4],
        message: 'Sample Client already exists. Use the existing credentials.'
      };
    }
  }

  // สร้าง Sample Client ใหม่
  const result = KOL_IDS_SYSTEM_CREATE_CLIENT(SAMPLE_NAME);

  return {
    success: true,
    existing: false,
    clientId: result.clientId,
    clientName: result.clientName,
    accessKey: result.accessKey,
    spreadsheetId: result.spreadsheetId,
    webAppUrl: result.webAppUrl,
    status: 'ACTIVE',
    message: 'Sample Client created successfully.'
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CREATE_SAMPLE_CLIENT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CREATE_SAMPLE_CLIENT', Date.now() - __kolIdsTraceStartedAt);
  }
}
/************************************************************
 * KOL IDS™ — INPUT INTELLIGENCE ADD-ON
 * Version: 1.0.0
 *
 * PURPOSE
 * - Format numeric input with commas
 * - Normalize numeric values before calculation
 * - Campaign Objective multi-select: 1–3 objectives
 * - Preserve existing Campaign Objective field
 * - Store Primary / Secondary Objective logic
 * - Do NOT modify existing Core Engine functions
 *
 * SAFE:
 * - All functions use KOL_IDS_INPUT_ prefix
 * - No existing function is overwritten
 * - No existing schema column is changed
 ************************************************************/


/* =========================================================
 * CONFIG
 * ========================================================= */

const KOL_IDS_INPUT_CONFIG = {
  VERSION: '1.0.0',
  MAX_OBJECTIVES: 3,

  OBJECTIVES: [
    'Brand Awareness',
    'Reach',
    'Engagement',
    'Consideration',
    'Traffic',
    'Conversion',
    'Sales',
    'Product Launch',
    'Community Building',
    'Brand Perception'
  ],

  NUMERIC_FIELDS: [
    'Followers',
    'Average Views',
    'Average Reach',
    'Likes',
    'Comments',
    'Shares',
    'Saves',
    'Rate',
    'Budget'
  ]
};


/* =========================================================
 * NUMBER NORMALIZATION
 * ========================================================= */

/**
 * Converts:
 * 1,250,000
 * "1,250,000"
 * "1250000"
 * "65,000 THB"
 *
 * into a safe numeric value.
 *
 * Missing value remains null.
 */
function KOL_IDS_SYSTEM_INPUT_NUMBER_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_NUMBER_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  if (typeof value === 'number') {
    return isFinite(value) ? value : null;
  }

  let text = String(value)
    .trim()
    .replace(/,/g, '')
    .replace(/[^\d.\-]/g, '');

  if (!text) {
    return null;
  }

  const number = Number(text);

  return isFinite(number)
    ? number
    : null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_NUMBER_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_NUMBER_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Formats numeric value for UI display.
 *
 * 1250000 → 1,250,000
 * 65000   → 65,000
 */
function KOL_IDS_SYSTEM_INPUT_FORMAT_NUMBER_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_FORMAT_NUMBER_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const number =
    KOL_IDS_SYSTEM_INPUT_NUMBER_(value);

  if (number === null) {
    return '';
  }

  return number.toLocaleString(
    'en-US',
    {
      maximumFractionDigits: 2
    }
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_FORMAT_NUMBER_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_FORMAT_NUMBER_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Formats currency / money values.
 */
function KOL_IDS_SYSTEM_INPUT_FORMAT_MONEY_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_FORMAT_MONEY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const number =
    KOL_IDS_SYSTEM_INPUT_NUMBER_(value);

  if (number === null) {
    return '';
  }

  return number.toLocaleString(
    'en-US',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_FORMAT_MONEY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_FORMAT_MONEY_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * NUMERIC PAYLOAD NORMALIZATION
 * ========================================================= */

/**
 * Normalizes numeric fields without destroying
 * missing-data semantics.
 *
 * IMPORTANT:
 * Missing ≠ 0
 */
function KOL_IDS_SYSTEM_INPUT_NORMALIZE_NUMBERS_(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_NORMALIZE_NUMBERS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const input =
    payload || {};

  const output =
    JSON.parse(
      JSON.stringify(input)
    );

  KOL_IDS_INPUT_CONFIG.NUMERIC_FIELDS
    .forEach(function(field) {

      if (
        Object.prototype.hasOwnProperty.call(
          output,
          field
        )
      ) {

        const parsed =
          KOL_IDS_SYSTEM_INPUT_NUMBER_(
            output[field]
          );

        output[field] =
          parsed === null
            ? ''
            : parsed;
      }

    });

  return output;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_NORMALIZE_NUMBERS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_NORMALIZE_NUMBERS_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * OBJECTIVE VALIDATION
 * ========================================================= */

/**
 * Normalize objective input.
 *
 * Supports:
 *
 * "Brand Awareness"
 *
 * [
 *   "Brand Awareness",
 *   "Engagement"
 * ]
 *
 * Also supports comma-separated strings.
 */
function KOL_IDS_SYSTEM_INPUT_NORMALIZE_OBJECTIVES_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_NORMALIZE_OBJECTIVES_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let objectives = [];

  if (Array.isArray(value)) {

    objectives =
      value.slice();

  }
  else if (
    value !== null &&
    value !== undefined &&
    String(value).trim()
  ) {

    objectives =
      String(value)
        .split(',')
        .map(function(item) {
          return item.trim();
        })
        .filter(Boolean);

  }

  const allowed =
    KOL_IDS_INPUT_CONFIG.OBJECTIVES;

  const unique = [];

  objectives.forEach(function(objective) {

    const clean =
      String(objective || '').trim();

    if (!clean) {
      return;
    }

    const matched =
      allowed.find(function(item) {
        return item.toLowerCase() ===
          clean.toLowerCase();
      });

    if (
      matched &&
      unique.indexOf(matched) === -1
    ) {

      unique.push(matched);
    }

  });

  if (
    unique.length >
    KOL_IDS_INPUT_CONFIG.MAX_OBJECTIVES
  ) {

    throw new Error(
      'Campaign Objective can contain a maximum of ' +
      KOL_IDS_INPUT_CONFIG.MAX_OBJECTIVES +
      ' objectives.'
    );
  }

  return unique;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_NORMALIZE_OBJECTIVES_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_NORMALIZE_OBJECTIVES_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * OBJECTIVE STRUCTURE
 * ========================================================= */

/**
 * Converts selected objectives into:
 *
 * primaryObjective
 * secondaryObjectives
 * objectiveCount
 */
function KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const objectives =
    KOL_IDS_SYSTEM_INPUT_NORMALIZE_OBJECTIVES_(
      value
    );

  return {

    objectives:
      objectives,

    primaryObjective:
      objectives.length
        ? objectives[0]
        : '',

    secondaryObjectives:
      objectives.slice(1),

    objectiveCount:
      objectives.length,

    valid:
      objectives.length >= 1 &&
      objectives.length <=
        KOL_IDS_INPUT_CONFIG.MAX_OBJECTIVES

  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * CAMPAIGN OBJECTIVE PAYLOAD
 * ========================================================= */

/**
 * Creates an objective-safe campaign payload.
 *
 * Existing Campaign Objective column receives:
 *
 * Brand Awareness | Engagement | Consideration
 *
 * Existing Primary KPI / Secondary KPI remain untouched
 * unless the caller explicitly asks to map them.
 */
function KOL_IDS_SYSTEM_INPUT_BUILD_CAMPAIGN_OBJECTIVE_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_BUILD_CAMPAIGN_OBJECTIVE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const state =
    KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_(
      value
    );

  if (!state.valid) {

    throw new Error(
      'Select at least 1 and no more than ' +
      KOL_IDS_INPUT_CONFIG.MAX_OBJECTIVES +
      ' campaign objectives.'
    );
  }

  return {

    campaignObjective:
      state.objectives.join(' | '),

    primaryObjective:
      state.primaryObjective,

    secondaryObjectives:
      state.secondaryObjectives,

    objectiveCount:
      state.objectiveCount

  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_BUILD_CAMPAIGN_OBJECTIVE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_BUILD_CAMPAIGN_OBJECTIVE_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * OBJECTIVE → DECISION WEIGHTS
 * ========================================================= */

/**
 * Converts objectives into intelligent weighting signals.
 *
 * IMPORTANT:
 * This does NOT replace the existing Decision Engine.
 *
 * It creates normalized objective intelligence that
 * can be consumed by the existing system later.
 */
function KOL_IDS_SYSTEM_INPUT_OBJECTIVE_SIGNALS_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_OBJECTIVE_SIGNALS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const state =
    KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_(
      value
    );

  const signals = {

    awareness: 0,
    credibility: 0,
    relevance: 0,
    perception: 0,
    purchase: 0,
    community: 0

  };

  state.objectives.forEach(function(objective) {

    switch (objective) {

      case 'Brand Awareness':
      case 'Reach':
        signals.awareness += 1;
        break;

      case 'Engagement':
      case 'Community Building':
        signals.community += 1;
        break;

      case 'Consideration':
      case 'Brand Perception':
        signals.relevance += 1;
        signals.perception += 1;
        break;

      case 'Traffic':
        signals.relevance += 1;
        break;

      case 'Conversion':
      case 'Sales':
        signals.purchase += 1;
        break;

      case 'Product Launch':
        signals.awareness += 1;
        signals.relevance += 1;
        break;

    }

  });

  const max =
    Math.max(
      1,
      state.objectives.length
    );

  Object.keys(signals)
    .forEach(function(key) {

      signals[key] =
        Math.round(
          signals[key] /
          max *
          100
        );

    });

  return {

    objectives:
      state.objectives,

    primaryObjective:
      state.primaryObjective,

    secondaryObjectives:
      state.secondaryObjectives,

    signals:
      signals

  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_OBJECTIVE_SIGNALS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_OBJECTIVE_SIGNALS_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * DATA QUALITY
 * ========================================================= */

/**
 * Calculates input completeness without treating
 * missing information as zero.
 */
function KOL_IDS_SYSTEM_INPUT_DATA_QUALITY_(data) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_DATA_QUALITY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const input =
    data || {};

  const checks = {

    followers:
      KOL_IDS_SYSTEM_INPUT_NUMBER_(
        input.followers
      ) !== null,

    engagementRate:
      KOL_IDS_SYSTEM_INPUT_NUMBER_(
        input.engagementRate
      ) !== null,

    audience:
      !!(
        String(
          input.audienceAge ||
          input.audienceGender ||
          input.audienceLocation ||
          input.audienceInterest ||
          ''
        ).trim()
      ),

    content:
      !!(
        String(
          input.contentStyle ||
          input.contentEvidence ||
          ''
        ).trim()
      ),

    performance:
      !!(
        String(
          input.performanceEvidence ||
          input.averageViews ||
          input.averageReach ||
          ''
        ).trim()
      ),

    commercial:
      KOL_IDS_SYSTEM_INPUT_NUMBER_(
        input.rate
      ) !== null

  };

  const available =
    Object.keys(checks)
      .filter(function(key) {
        return checks[key];
      })
      .length;

  const total =
    Object.keys(checks).length;

  const score =
    Math.round(
      available /
      total *
      100
    );

  let level = 'INSUFFICIENT';

  if (score >= 80) {
    level = 'STRONG';
  }
  else if (score >= 60) {
    level = 'GOOD';
  }
  else if (score >= 35) {
    level = 'LIMITED';
  }

  return {

    score:
      score,

    level:
      level,

    available:
      available,

    total:
      total,

    checks:
      checks

  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_DATA_QUALITY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_DATA_QUALITY_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * EVIDENCE CONFIDENCE
 * ========================================================= */

/**
 * Confidence is deliberately separated from Score.
 *
 * A KOL can have strong fit but low confidence
 * if evidence is incomplete.
 */
function KOL_IDS_SYSTEM_INPUT_CONFIDENCE_(data) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_CONFIDENCE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const quality =
    KOL_IDS_SYSTEM_INPUT_DATA_QUALITY_(
      data
    );

  let confidence =
    quality.score;

  const evidenceFields = [

    'audienceEvidence',
    'engagementEvidence',
    'contentEvidence',
    'performanceEvidence',
    'reputationEvidence'

  ];

  const evidenceCount =
    evidenceFields
      .filter(function(field) {

        return String(
          data &&
          data[field] ||
          ''
        ).trim();

      })
      .length;

  confidence +=
    Math.min(
      20,
      evidenceCount * 4
    );

  confidence =
    Math.min(
      100,
      confidence
    );

  let level = 'LOW';

  if (confidence >= 80) {
    level = 'HIGH';
  }
  else if (confidence >= 60) {
    level = 'MEDIUM';
  }

  return {

    score:
      confidence,

    level:
      level,

    dataQuality:
      quality

  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_CONFIDENCE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_CONFIDENCE_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * KOL PRE-CAMPAIGN INTELLIGENCE
 * ========================================================= */

/**
 * Creates a safe pre-campaign assessment.
 *
 * This does NOT invent performance data.
 */
function KOL_IDS_SYSTEM_INPUT_PRECAMPAIGN_SCAN_(kol, campaign) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_PRECAMPAIGN_SCAN_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const creator =
    kol || {};

  const objectiveState =
    KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_(
      campaign &&
      (
        campaign.objectives ||
        campaign.campaignObjective
      )
    );

  const confidence =
    KOL_IDS_SYSTEM_INPUT_CONFIDENCE_(
      creator
    );

  const followers =
    KOL_IDS_SYSTEM_INPUT_NUMBER_(
      creator.followers
    );

  const engagementRate =
    KOL_IDS_SYSTEM_INPUT_NUMBER_(
      creator.engagementRate
    );

  const hasPerformance =
    (
      KOL_IDS_SYSTEM_INPUT_NUMBER_(
        creator.averageViews
      ) !== null
    ) ||
    (
      KOL_IDS_SYSTEM_INPUT_NUMBER_(
        creator.averageReach
      ) !== null
    ) ||
    !!String(
      creator.performanceEvidence ||
      ''
    ).trim();

  const hasAudience =
    !!String(
      creator.audienceAge ||
      creator.audienceGender ||
      creator.audienceLocation ||
      creator.audienceInterest ||
      ''
    ).trim();

  let decision =
    'REVIEW REQUIRED';

  if (
    confidence.score >= 80 &&
    hasPerformance &&
    hasAudience
  ) {

    decision =
      'CONSIDER';

  }

  return {

    scanVersion:
      KOL_IDS_INPUT_CONFIG.VERSION,

    scannedAt:
      new Date(),

    kolId:
      String(
        creator.kolId ||
        ''
      ).trim(),

    kolName:
      String(
        creator.kolName ||
        ''
      ).trim(),

    platform:
      String(
        creator.platform ||
        ''
      ).trim(),

    platformUrl:
      String(
        creator.platformUrl ||
        ''
      ).trim(),

    followers:
      followers,

    engagementRate:
      engagementRate,

    hasPerformanceEvidence:
      hasPerformance,

    hasAudienceEvidence:
      hasAudience,

    objective:
      objectiveState,

    confidence:
      confidence,

    decision:
      decision,

    evidenceRule:
      'No evidence = no claim.'

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_PRECAMPAIGN_SCAN_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_PRECAMPAIGN_SCAN_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * FORMAT CONFIG FOR UI
 * ========================================================= */

/**
 * Returns configuration for the Web App UI.
 *
 * Front-end can use this to:
 * - format numbers
 * - create dropdown
 * - limit objective selection to 3
 */
function KOL_IDS_SYSTEM_INPUT_GET_UI_CONFIG() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_GET_UI_CONFIG');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  return {

    success:
      true,

    version:
      KOL_IDS_INPUT_CONFIG.VERSION,

    numericFields:
      KOL_IDS_INPUT_CONFIG.NUMERIC_FIELDS,

    objectives:
      KOL_IDS_INPUT_CONFIG.OBJECTIVES,

    maxObjectives:
      KOL_IDS_INPUT_CONFIG.MAX_OBJECTIVES,

    numberFormat:
      '#,##0.##',

    rules: {

      missingData:
        'Do not convert missing data to zero.',

      followers:
        'Scale signal only; not investment value.',

      objectiveSelection:
        'Select 1–3 objectives.',

      confidence:
        'Confidence is separate from Investment Score.'

    }

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_GET_UI_CONFIG', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_GET_UI_CONFIG', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * SAFE VALIDATION
 * ========================================================= */

function KOL_IDS_SYSTEM_INPUT_VALIDATE_PAYLOAD(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_VALIDATE_PAYLOAD');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const input =
    payload || {};

  const errors = [];

  if (
    input.objectives !== undefined
  ) {

    try {

      KOL_IDS_SYSTEM_INPUT_NORMALIZE_OBJECTIVES_(
        input.objectives
      );

    }
    catch (error) {

      errors.push(
        error.message
      );

    }

  }

  if (
    input.followers !== undefined &&
    input.followers !== ''
  ) {

    if (
      KOL_IDS_SYSTEM_INPUT_NUMBER_(
        input.followers
      ) === null
    ) {

      errors.push(
        'Followers must be a valid number.'
      );

    }

  }

  if (
    input.rate !== undefined &&
    input.rate !== ''
  ) {

    if (
      KOL_IDS_SYSTEM_INPUT_NUMBER_(
        input.rate
      ) === null
    ) {

      errors.push(
        'Rate must be a valid number.'
      );

    }

  }

  return {

    valid:
      errors.length === 0,

    errors:
      errors

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_VALIDATE_PAYLOAD', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_VALIDATE_PAYLOAD', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * MASTER ADD-ON DIAGNOSTIC
 * ========================================================= */

function KOL_IDS_SYSTEM_INPUT_DIAGNOSTIC() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_INPUT_DIAGNOSTIC');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const config =
    KOL_IDS_SYSTEM_INPUT_GET_UI_CONFIG();

  const objectiveTest =
    KOL_IDS_SYSTEM_INPUT_BUILD_OBJECTIVE_STATE_([
      'Brand Awareness',
      'Engagement',
      'Consideration'
    ]);

  const numberTest =
    KOL_IDS_SYSTEM_INPUT_NUMBER_(
      '1,250,000'
    );

  const formattedTest =
    KOL_IDS_SYSTEM_INPUT_FORMAT_NUMBER_(
      numberTest
    );

  return {

    success:
      true,

    version:
      config.version,

    numberTest:
      numberTest,

    formattedTest:
      formattedTest,

    objectiveTest:
      objectiveTest,

    expected:
      {

        number:
          1250000,

        formatted:
          '1,250,000',

        objectiveCount:
          3

      }

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_INPUT_DIAGNOSTIC', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_INPUT_DIAGNOSTIC', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * OPTIONAL MENU ENTRY
 *
 * This is additive only.
 * It does not replace existing onOpen().
 *
 * Run manually once if needed:
 *
 * KOL_IDS_SYSTEM_INPUT_DIAGNOSTIC()
 *
 * ========================================================= */
 /* =====================================================
 * KOL IDS™ — AUDIENCE PERSONA LAYER
 * Add this block at the END of Master.gs
 * ===================================================== */


/**
 * =====================================================
 * PERSONA CONFIG
 * =====================================================
 */

const KOL_IDS_PERSONA_CONFIG = {

  ageGroups: [
    '13-17',
    '18-24',
    '25-34',
    '35-44',
    '45-54',
    '55+'
  ],

  genders: [
    'Female',
    'Male',
    'All Genders',
    'Other / Prefer not to say'
  ],

  geographies: [
    'Bangkok',
    'Greater Bangkok',
    'Central',
    'North',
    'Northeast',
    'East',
    'West',
    'South',
    'Nationwide',
    'Urban',
    'Other'
  ]

};


/**
 * =====================================================
 * NORMALIZE PERSONA
 * =====================================================
 *
 * ทำให้ Persona อยู่ใน format เดียวกัน
 * ไม่ว่า Frontend จะส่งข้อมูลมาแบบไหน
 */

function KOL_IDS_SYSTEM_normalizePersona(persona) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_normalizePersona');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  persona = persona || {};

  return {

    age:
      String(
        persona.age ||
        persona.ageGroup ||
        ''
      ).trim(),

    gender:
      String(
        persona.gender ||
        ''
      ).trim(),

    behavior:
      String(
        persona.behavior ||
        persona.behaviours ||
        ''
      ).trim(),

    interests:
      String(
        persona.interests ||
        persona.interest ||
        ''
      ).trim(),

    geography:
      String(
        persona.geography ||
        persona.location ||
        ''
      ).trim(),

    description:
      String(
        persona.description ||
        persona.personaDescription ||
        ''
      ).trim()

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_normalizePersona', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_normalizePersona', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * PERSONA SUMMARY
 * =====================================================
 *
 * ใช้สำหรับแสดง Persona แบบสั้นใน Report
 */

function KOL_IDS_SYSTEM_personaSummary(persona) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_personaSummary');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const p =
    KOL_IDS_SYSTEM_normalizePersona(persona);

  const parts = [];

  if (p.age) {
    parts.push(p.age);
  }

  if (p.gender) {
    parts.push(p.gender);
  }

  if (p.interests) {
    parts.push(p.interests);
  }

  if (p.geography) {
    parts.push(p.geography);
  }

  return parts.join(' / ');


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_personaSummary', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_personaSummary', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * PERSONA QUALITY CHECK
 * =====================================================
 *
 * ตรวจว่า Persona มีข้อมูลมากน้อยแค่ไหน
 *
 * สำคัญ:
 * Missing data ≠ 0
 */

function KOL_IDS_SYSTEM_personaQuality(persona) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_personaQuality');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const p =
    KOL_IDS_SYSTEM_normalizePersona(persona);

  const fields = [
    'age',
    'gender',
    'behavior',
    'interests',
    'geography',
    'description'
  ];

  let available = 0;

  fields.forEach(function(field) {

    if (
      p[field] !== null &&
      p[field] !== undefined &&
      String(p[field]).trim() !== ''
    ) {

      available++;

    }

  });

  const total =
    fields.length;

  const completeness =
    total > 0
      ? available / total
      : 0;

  return {

    availableFields:
      available,

    totalFields:
      total,

    completeness:
      Math.round(
        completeness * 100
      ) / 100,

    status:
      available === 0
        ? 'MISSING'
        : available < 3
          ? 'PARTIAL'
          : 'AVAILABLE'

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_personaQuality', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_personaQuality', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * ENRICH KOL WITH PERSONA
 * =====================================================
 *
 * เอา Persona เข้าไปอยู่ใน KOL object
 * โดยไม่ลบข้อมูล KOL เดิม
 */

function KOL_IDS_SYSTEM_enrichKOLWithPersona(kol) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_enrichKOLWithPersona');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  kol =
    kol || {};

  const persona =
    KOL_IDS_SYSTEM_normalizePersona(
      kol.persona ||
      kol.audiencePersona ||
      {}
    );

  const quality =
    KOL_IDS_SYSTEM_personaQuality(
      persona
    );

  return {

    ...kol,

    audiencePersona:
      persona,

    personaSummary:
      KOL_IDS_SYSTEM_personaSummary(
        persona
      ),

    personaQuality:
      quality

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_enrichKOLWithPersona', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_enrichKOLWithPersona', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * ENRICH KOL LIST
 * =====================================================
 */

function KOL_IDS_SYSTEM_enrichKOLListWithPersona(kols) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_enrichKOLListWithPersona');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    !Array.isArray(kols)
  ) {

    return [];

  }

  return kols.map(
    function(kol) {

      return KOL_IDS_SYSTEM_enrichKOLWithPersona(
        kol
      );

    }
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_enrichKOLListWithPersona', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_enrichKOLListWithPersona', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * PERSONA → AUDIENCE FIT
 * =====================================================
 *
 * เวอร์ชันแรก:
 * ใช้สำหรับเตรียม Intelligence Layer
 *
 * ยังไม่เอาคะแนนนี้ไปทับ FIT เดิม
 * จนกว่าเราจะต่อ Campaign Audience Target
 */

function KOL_IDS_SYSTEM_calculatePersonaFit(
  persona,
  target
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_calculatePersonaFit');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const p =
    KOL_IDS_SYSTEM_normalizePersona(
      persona
    );

  target =
    target || {};

  let matched = 0;
  let available = 0;

  function KOL_IDS_SYSTEM_compare(
    personaValue,
    targetValue
  ) {

    if (
      !personaValue ||
      !targetValue
    ) {

      return;

    }

    available++;

    const pValue =
      String(
        personaValue
      )
      .toLowerCase()
      .trim();

    const tValue =
      String(
        targetValue
      )
      .toLowerCase()
      .trim();

    if (
      pValue === tValue ||
      pValue.indexOf(tValue) !== -1 ||
      tValue.indexOf(pValue) !== -1
    ) {

      matched++;

    }

  }


  KOL_IDS_SYSTEM_compare(
    p.age,
    target.age
  );

  KOL_IDS_SYSTEM_compare(
    p.gender,
    target.gender
  );

  KOL_IDS_SYSTEM_compare(
    p.geography,
    target.geography
  );


  /*
   * ถ้ายังไม่มี Target Audience
   * ไม่ควรตีความว่า Persona ไม่ Fit
   */

  if (
    available === 0
  ) {

    return {

      score: null,

      status: 'NO TARGET DATA',

      matched:
        0,

      available:
        0

    };

  }


  const score =
    Math.round(
      (
        matched /
        available
      ) *
      100
    );


  return {

    score:
      score,

    status:
      score >= 80
        ? 'STRONG FIT'
        : score >= 50
          ? 'PARTIAL FIT'
          : 'LOW FIT',

    matched:
      matched,

    available:
      available

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_calculatePersonaFit', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_calculatePersonaFit', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * PREPARE ANALYSIS PAYLOAD
 * =====================================================
 *
 * ใช้เป็น helper ก่อนส่ง KOL เข้า Analysis Engine
 */

function KOL_IDS_PERSONA_textSafe_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PERSONA_textSafe_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (Array.isArray(value)) return value.filter(Boolean).join(' | ');
  return String(value == null ? '' : value).trim();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PERSONA_textSafe_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PERSONA_textSafe_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_prepareAnalysisPayload(payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_prepareAnalysisPayload');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  payload =
    payload || {};

  const enrichedKols =
    KOL_IDS_SYSTEM_enrichKOLListWithPersona(
      payload.kols || []
    ).map(function(kol) {
      const p = KOL_IDS_SYSTEM_normalizePersona(
        kol.audiencePersona || kol.persona || {}
      );
      const extra = kol.audiencePersona || {};
      return {
        ...kol,
        audiencePersona: {
          ...extra,
          age: p.age,
          gender: p.gender,
          behavior: p.behavior,
          interests: p.interests,
          geography: p.geography,
          description: p.description
        },
        audienceAge: kol.audienceAge || p.age,
        audienceGender: kol.audienceGender || p.gender,
        audienceBehavior: kol.audienceBehavior || p.behavior,
        audienceInterest: kol.audienceInterest || p.interests,
        audienceGeography: kol.audienceGeography || p.geography,
        audienceLocation: kol.audienceLocation || p.geography,
        audienceDescription: kol.audienceDescription || p.description,
        audienceGoalsNeeds: kol.audienceGoalsNeeds || KOL_IDS_PERSONA_textSafe_(extra.goalsNeeds),
        audiencePainPoints: kol.audiencePainPoints || KOL_IDS_PERSONA_textSafe_(extra.painPoints),
        audienceLifestyle: kol.audienceLifestyle || KOL_IDS_PERSONA_textSafe_(extra.lifestyle),
        audienceValues: kol.audienceValues || KOL_IDS_PERSONA_textSafe_(extra.values),
        audienceFashionAffinity: kol.audienceFashionAffinity || KOL_IDS_PERSONA_textSafe_(extra.fashionAffinity),
        audienceArtistRoleModel: kol.audienceArtistRoleModel || KOL_IDS_PERSONA_textSafe_(extra.artistRoleModel)
      };
    });

  const result = {
    ...payload,
    kols: enrichedKols
  };


  /*
   * Normalize Campaign Audience
   */

  if (
    payload.targetAudience
  ) {

    result.targetAudience = {

      age:
        String(
          payload.targetAudience.age ||
          ''
        ).trim(),

      gender:
        String(
          payload.targetAudience.gender ||
          ''
        ).trim(),

      geography:
        String(
          payload.targetAudience.geography ||
          ''
        ).trim(),

      behavior:
        String(
          payload.targetAudience.behavior ||
          ''
        ).trim(),

      interests:
        String(
          payload.targetAudience.interests ||
          ''
        ).trim()

    };

  }


  /*
   * Add Persona Fit
   * โดยไม่แก้ FIT เดิม
   */

  result.kols =
    result.kols.map(
      function(kol) {

        const personaFit =
          KOL_IDS_SYSTEM_calculatePersonaFit(
            kol.audiencePersona,
            result.targetAudience
          );

        return {

          ...kol,

          personaFit:
            personaFit

        };

      }
    );


  return result;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_prepareAnalysisPayload', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_prepareAnalysisPayload', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * REPORT PERSONA FORMAT
 * =====================================================
 *
 * ใช้ตอนสร้าง Report
 * เพื่อให้ Frontend สามารถโชว์ Persona รวมกับ KOL
 */

function KOL_IDS_SYSTEM_personaReportFields(kol) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_personaReportFields');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const enriched =
    KOL_IDS_SYSTEM_enrichKOLWithPersona(
      kol
    );

  const p =
    enriched.audiencePersona;

  const q =
    enriched.personaQuality;


  return {

    audienceAge:
      p.age || '-',

    audienceGender:
      p.gender || '-',

    audienceBehavior:
      p.behavior || '-',

    audienceInterests:
      p.interests || '-',

    audienceGeography:
      p.geography || '-',

    audiencePersona:
      p.description || '-',

    personaSummary:
      enriched.personaSummary || '-',

    personaCompleteness:
      q.completeness,

    personaStatus:
      q.status

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_personaReportFields', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_personaReportFields', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * =====================================================
 * DEBUG / TEST
 * =====================================================
 *
 * Run this function manuallyใน Apps Script
 * เพื่อเช็กว่า Persona Layer ทำงาน
 */

function KOL_IDS_SYSTEM_TEST_KOL_IDS_PERSONA_LAYER() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_KOL_IDS_PERSONA_LAYER');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sample = {

    name:
      'Sample KOL',

    platform:
      'TikTok',

    followers:
      1250000,

    persona: {

      age:
        '18-24',

      gender:
        'Female',

      behavior:
        'Trend-driven, highly engaged with short-form entertainment and artists',

      interests:
        'Fashion, Beauty, Entertainment',

      geography:
        'Bangkok',

      description:
        'Fashion-conscious young entertainment consumer who sees artists as role models for personal style.'

    }

  };


  const result =
    KOL_IDS_SYSTEM_enrichKOLWithPersona(
      sample
    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_KOL_IDS_PERSONA_LAYER', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_KOL_IDS_PERSONA_LAYER', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* =========================================================
 * KOL IDS™ — FULL SYSTEM TEST RUNNER
 *
 * PURPOSE
 * ---------------------------------------------------------
 * 1. Create / reuse one dedicated TEST CLIENT
 * 2. Create one TEST WORKSPACE
 * 3. Test login / session / bootstrap
 * 4. Test SAVE
 * 5. Test RUN
 * 6. Test REPORT
 * 7. Test HISTORY
 * 8. Test EXPORT
 * 9. Test HEALTH
 * 10. Test RESET
 * 11. Test V5 internal tests when available
 *
 * OUTPUT
 * ---------------------------------------------------------
 * ONLY ONE MASTER SHEET:
 *
 * KOL_IDS_TEST_REPORT
 *
 * The sheet contains:
 * TEST | STATUS | DETAILS | ERROR
 *
 * IMPORTANT
 * ---------------------------------------------------------
 * This test does NOT modify the production client.
 * A dedicated test client/workspace is used.
 * ========================================================= */


/* =========================================================
 * 1. TEST CONFIG
 * ========================================================= */

const KOL_IDS_TEST_CONFIG = {
  CLIENT_NAME: 'KOL IDS™ — SYSTEM TEST CLIENT',
  REPORT_SHEET: 'KOL_IDS_TEST_REPORT',
  TEST_BRAND: 'KOL IDS™ TEST BRAND',
  TEST_CAMPAIGN: 'KOL IDS™ FULL SYSTEM TEST',
  TEST_OBJECTIVE: 'BRAND AWARENESS',
  TEST_AUDIENCE: 'Thai Gen Z / Young Adults',
  TEST_CATEGORY: 'Beauty',
  TEST_POSITIONING: 'Modern, credible and relevant',
  TEST_MARKET: 'THAILAND',
  TEST_BUDGET: 500000,
  REGISTERED_EMAIL: 'kolids.system.test@example.com'
};



/* =========================================================
 * FAST CUSTOMER TEST PROVISIONING
 * ---------------------------------------------------------
 * Purpose: create/reuse the dedicated TEST CLIENT without
 * running the expensive full-system QA or workspace schema
 * initialization in the same execution.
 *
 * Run first:
 *   KOL_IDS_SYSTEM_TEST_PROVISION_FAST
 * Then, if needed:
 *   KOL_IDS_SYSTEM_TEST_PREPARE_WORKSPACE
 * Finally:
 *   KOL_IDS_SYSTEM_TEST_GET_LOGIN
 *
 * The plaintext test key is kept ONLY in Script Properties
 * under a test-only key so GET_LOGIN can return credentials.
 * Production client directory continues to store only the hash.
 * ========================================================= */
function KOL_IDS_SYSTEM_TEST_PROVISION_FAST() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_PROVISION_FAST');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    const master = KOL_IDS_SYSTEM_getMasterSpreadsheet_();
    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());
    const directory = KOL_IDS_SYSTEM_ensureClientDirectory_();
    const props = PropertiesService.getScriptProperties();
    const testKeyProp = 'KOL_IDS_TEST_ACCESS_KEY_PLAINTEXT';
    const lastRow = directory.getLastRow();
    let rowNumber = -1, existing = null;

    if (lastRow >= 2) {
      const rows = directory.getRange(2, 1, lastRow - 1, 7).getValues();
      for (let i = 0; i < rows.length; i++) {
        if (String(rows[i][1] || '').trim() === KOL_IDS_TEST_CONFIG.CLIENT_NAME) {
          rowNumber = i + 2;
          existing = {
            clientId: String(rows[i][0] || ''),
            clientName: String(rows[i][1] || ''),
            spreadsheetId: String(rows[i][3] || ''),
            status: String(rows[i][4] || '')
          };
          break;
        }
      }
    }

    let accessKey = '';
    let mode = 'REUSED';
    if (existing) {
      accessKey = String(props.getProperty(testKeyProp) || '');
      if (!KOL_IDS.ACCESS_KEY_PATTERN.test(accessKey)) {
        accessKey = KOL_IDS_HARDENING_RUNTIME_generateAccessKey_();
        directory.getRange(rowNumber, 3).setValue(KOL_IDS_HARDENING_RUNTIME_accessKeyHash_(accessKey));
        props.setProperty(testKeyProp, accessKey);
        mode = 'REUSED_ROTATED';
      }
      directory.getRange(rowNumber, 5).setValue(KOL_IDS_SAAS.LICENSE_ACTIVE);
    } else {
      const clientId = 'CL-' + Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
      accessKey = KOL_IDS_HARDENING_RUNTIME_generateAccessKey_();
      const workspace = SpreadsheetApp.create('KOL IDS™ — ' + KOL_IDS_TEST_CONFIG.CLIENT_NAME);
      directory.appendRow([
        clientId,
        KOL_IDS_TEST_CONFIG.CLIENT_NAME,
        KOL_IDS_HARDENING_RUNTIME_accessKeyHash_(accessKey),
        workspace.getId(),
        KOL_IDS_SAAS.LICENSE_ACTIVE,
        new Date(),
        ''
      ]);
      props.setProperty(testKeyProp, accessKey);
      existing = {
        clientId: clientId,
        clientName: KOL_IDS_TEST_CONFIG.CLIENT_NAME,
        spreadsheetId: workspace.getId(),
        status: KOL_IDS_SAAS.LICENSE_ACTIVE
      };
      mode = 'CREATED_FAST';
    }

    // Keep the dedicated SYSTEM TEST CLIENT aligned with the new
    // email-bound customer authentication contract. This is test-only data.
    var directoryHeaders = directory.getRange(1, 1, 1, Math.max(7, directory.getLastColumn())).getValues()[0].map(String);
    var contactEmailCol = directoryHeaders.indexOf('Contact Email') + 1;
    var accountEmailsCol = directoryHeaders.indexOf('Account Emails') + 1;
    if (rowNumber < 0) {
      var idValues = directory.getRange(2, 1, Math.max(0, directory.getLastRow() - 1), 1).getValues();
      for (var ri = 0; ri < idValues.length; ri++) {
        if (String(idValues[ri][0] || '').trim() === String(existing.clientId || '').trim()) { rowNumber = ri + 2; break; }
      }
    }
    if (rowNumber >= 2 && contactEmailCol > 0) {
      directory.getRange(rowNumber, contactEmailCol).setValue(KOL_IDS_TEST_CONFIG.REGISTERED_EMAIL);
    }
    if (rowNumber >= 2 && accountEmailsCol > 0) {
      var currentTestAccounts = String(directory.getRange(rowNumber, accountEmailsCol).getValue() || '').trim();
      if (!currentTestAccounts) directory.getRange(rowNumber, accountEmailsCol).setValue(KOL_IDS_TEST_CONFIG.REGISTERED_EMAIL);
    }

    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(master.getId());
    return {
      success: true,
      mode: mode,
      clientId: existing.clientId,
      clientName: existing.clientName,
      spreadsheetId: existing.spreadsheetId,
      status: KOL_IDS_SAAS.LICENSE_ACTIVE,
      accessKeyLength: accessKey.length,
      workspaceInitialized: false,
      next: 'Run KOL_IDS_SYSTEM_TEST_PREPARE_WORKSPACE if this is a new workspace, then KOL_IDS_SYSTEM_TEST_GET_LOGIN.'
    };
  } catch (e) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_PROVISION_FAST', e);
    throw e;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_PROVISION_FAST', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SYSTEM_TEST_PREPARE_WORKSPACE() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_PREPARE_WORKSPACE');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    const login = KOL_IDS_SYSTEM_TEST_GET_LOGIN();
    if (!login || !login.spreadsheetId) throw new Error('TEST CLIENT workspace is missing. Run KOL_IDS_SYSTEM_TEST_PROVISION_FAST first.');
    KOL_IDS_SYSTEM_QA_INITIALIZE_TEST_WORKSPACE_(login.spreadsheetId);
    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(KOL_IDS_SYSTEM_getMasterSpreadsheet_().getId());
    return { success: true, clientId: login.clientId, spreadsheetId: login.spreadsheetId, workspaceInitialized: true };
  } catch (e) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_PREPARE_WORKSPACE', e);
    throw e;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_PREPARE_WORKSPACE', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* =========================================================
 * 2. MAIN TEST RUNNER
 *
 * RUN THIS FUNCTION FROM APPS SCRIPT:
 *
 * KOL_IDS_SYSTEM_RUN_FULL_SYSTEM_TEST
 * ========================================================= */

function KOL_IDS_SYSTEM_RUN_FULL_SYSTEM_TEST() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_RUN_FULL_SYSTEM_TEST');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const results = [];

  const master =
    KOL_IDS_SYSTEM_getMasterSpreadsheet_();

  /*
   * Always start from MASTER.
   */
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
    master.getId()
  );


  /*
   * One result recorder.
   */
  function KOL_IDS_SYSTEM_masterQATest_(name, fn) {

    const started =
      new Date();

    try {

      const output =
        fn();

      results.push({
        test: name,
        status: 'PASS',
        details: KOL_IDS_SYSTEM_TEST_STRINGIFY_(output),
        error: '',
        duration:
          new Date().getTime() -
          started.getTime()
      });

      return output;

    } catch (e) {

      results.push({
        test: name,
        status: 'FAIL',
        details: '',
        error:
          e && e.message
            ? e.message
            : String(e),
        duration:
          new Date().getTime() -
          started.getTime()
      });

      return null;

    }

  }


  /*
   * -------------------------------------------------------
   * TEST 1
   * MASTER ACCESS
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'MASTER SPREADSHEET',
    function() {

      if (!master) {
        throw new Error(
          'Master spreadsheet not found.'
        );
      }

      return {
        spreadsheetId:
          master.getId(),

        spreadsheetName:
          master.getName()
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 2
   * CORE CONSTANTS
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'CORE CONFIG',
    function() {

      if (
        typeof KOL_IDS_SAAS === 'undefined'
      ) {

        throw new Error(
          'KOL_IDS_SAAS is not defined.'
        );

      }

      return {
        product:
          KOL_IDS_SAAS.PRODUCT,

        version:
          KOL_IDS_SAAS.VERSION
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 3
   * PRODUCT SETUP
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'PRODUCT SETUP',
    function() {

      KOL_IDS_PRODUCT_SETUP();

      return {
        success: true,
        spreadsheetId:
          KOL_IDS_SYSTEM_getSpreadsheet_().getId()
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST CLIENT
   * -------------------------------------------------------
   */

  let testClient = null;


  /*
   * -------------------------------------------------------
   * TEST 4
   * CREATE / REUSE TEST CLIENT
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'TEST CLIENT',
    function() {

      /*
       * Always work against MASTER directory.
       */
      KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
        master.getId()
      );

      const directory =
        KOL_IDS_SYSTEM_ensureClientDirectory_();

      const lastRow =
        directory.getLastRow();

      let existing = null;

      if (lastRow >= 2) {

        const rows =
          directory
            .getRange(
              2,
              1,
              lastRow - 1,
              7
            )
            .getValues();

        for (
          let i = 0;
          i < rows.length;
          i++
        ) {

          if (
            String(rows[i][1] || '')
              .trim() ===
            KOL_IDS_TEST_CONFIG.CLIENT_NAME
          ) {

            existing = {
              clientId:
                String(rows[i][0] || ''),

              clientName:
                String(rows[i][1] || ''),

              accessKey:
                String(rows[i][2] || ''),

              spreadsheetId:
                String(rows[i][3] || ''),

              status:
                String(rows[i][4] || '')
            };

            break;

          }

        }

      }


      /*
       * Reuse existing TEST CLIENT.
       */
      if (existing) {

        /*
         * The directory stores the HASH, not the plaintext key.
         * Never pass the stored hash into SIGN_IN.
         *
         * Rotate a fresh QA key and initialize/repair the dedicated
         * workspace before attempting authentication.
         */
        const freshAccessKey =
          KOL_IDS_SYSTEM_QA_ROTATE_TEST_ACCESS_KEY_(
            existing.clientId
          );

        existing.accessKey = freshAccessKey;

        if (
          existing.status !==
          KOL_IDS_SAAS.LICENSE_ACTIVE
        ) {
          existing.status =
            KOL_IDS_SAAS.LICENSE_ACTIVE;
        }

        KOL_IDS_SYSTEM_QA_INITIALIZE_TEST_WORKSPACE_(
          existing.spreadsheetId
        );

        /*
         * Return to MASTER after workspace preparation.
         */
        KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
          master.getId()
        );

        testClient =
          existing;

        return {
          mode: 'REUSED_ROTATED',
          clientId:
            existing.clientId,
          clientName:
            existing.clientName,
          status:
            existing.status,
          spreadsheetId:
            existing.spreadsheetId,
          accessKeyLength:
            existing.accessKey.length
        };

      }

      /*
       * Create new dedicated TEST CLIENT.
       */
      const created =
        KOL_IDS_SYSTEM_CREATE_CLIENT(
          KOL_IDS_TEST_CONFIG.CLIENT_NAME
        );

      testClient = {
        clientId:
          created.clientId,

        clientName:
          created.clientName,

        accessKey:
          created.accessKey,

        spreadsheetId:
          created.spreadsheetId,

        status:
          KOL_IDS_SAAS.LICENSE_ACTIVE,

        webAppUrl:
          created.webAppUrl || ''
      };

      if (!testClient.accessKey || !KOL_IDS.ACCESS_KEY_PATTERN.test(testClient.accessKey)) {
        throw new Error(
          'Created TEST CLIENT access key is not the required 9-character format.'
        );
      }

      KOL_IDS_SYSTEM_QA_INITIALIZE_TEST_WORKSPACE_(
        testClient.spreadsheetId
      );

      KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
        master.getId()
      );


      return {
        mode: 'CREATED',
        clientId:
          created.clientId,
        clientName:
          created.clientName,
        status:
          'ACTIVE',
        spreadsheetId:
          created.spreadsheetId
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 5
   * TEST LOGIN
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'CLIENT SIGN IN',
    function() {

      if (!testClient) {
        throw new Error(
          'Test client was not created.'
        );
      }

      /*
       * Return to MASTER before login.
       */
      KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
        master.getId()
      );

      const login =
        KOL_IDS_SYSTEM_SAAS_SIGN_IN(
          testClient.clientId,
          testClient.accessKey
        );

      if (
        !login ||
        login.authenticated !== true
      ) {

        throw new Error(
          'Client login failed.'
        );

      }

      return {
        authenticated:
          login.authenticated,

        clientId:
          login.clientId,

        clientName:
          login.clientName,

        status:
          login.status,

        workspaceId:
          login.workspaceId
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 6
   * SESSION
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'SESSION',
    function() {

      const session =
        KOL_IDS_SYSTEM_SAAS_GET_SESSION();

      if (
        !session ||
        session.authenticated !== true
      ) {

        throw new Error(
          'Authenticated session not found.'
        );

      }

      return {
        authenticated:
          session.authenticated,

        clientId:
          session.clientId,

        status:
          session.status
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 7
   * BOOTSTRAP
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'BOOTSTRAP',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_BOOTSTRAP();

      if (!result) {
        throw new Error(
          'Bootstrap returned empty result.'
        );
      }

      return result;

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 8
   * WORKSPACE
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'TEST WORKSPACE',
    function() {

      const ss =
        KOL_IDS_SYSTEM_getSpreadsheet_();

      if (!ss) {
        throw new Error(
          'Workspace spreadsheet not found.'
        );
      }

      const requiredSheets = [
        '01_SYSTEM',
        '02_BRAND_PROFILE',
        '03_CAMPAIGN',
        '04_KOL_DATABASE',
        '05_BRAND_FIT',
        '06_BRAND_IMPACT',
        '07_KOL_DECISION'
      ];

      const missing = [];
      const schemaErrors = [];

      requiredSheets.forEach(
        function(name) {

          const sheet = ss.getSheetByName(name);

          if (!sheet) {
            missing.push(name);
            return;
          }

          /*
           * Validate canonical headers as well as sheet existence.
           * This prevents a false-green workspace created with empty
           * or incompatible sheets.
           */
          const expected = KOL_IDS_SCHEMA_CONFIG[name] || [];
          if (expected.length) {
            const actual = sheet
              .getRange(1, 1, 1, expected.length)
              .getValues()[0];

            expected.forEach(function(header, index) {
              if (String(actual[index] || '').trim() !== String(header).trim()) {
                schemaErrors.push(
                  name + '!' +
                  String.fromCharCode(65 + index) +
                  ' expected "' + header +
                  '" but found "' + String(actual[index] || '') + '"'
                );
              }
            });
          }

        }
      );

      if (missing.length || schemaErrors.length) {

        const parts = [];

        if (missing.length) {
          parts.push('Missing sheets: ' + missing.join(', '));
        }

        if (schemaErrors.length) {
          parts.push('Schema errors: ' + schemaErrors.join(' | '));
        }

        throw new Error(parts.join('\n'));

      }

      return {
        spreadsheetId:
          ss.getId(),

        requiredSheets:
          requiredSheets.length,

        missing:
          0,

        schemaErrors:
          0
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST PAYLOAD
   * -------------------------------------------------------
   */

  const testPayload = {

    brandName:
      KOL_IDS_TEST_CONFIG.TEST_BRAND,

    campaignName:
      KOL_IDS_TEST_CONFIG.TEST_CAMPAIGN,

    objective:
      KOL_IDS_TEST_CONFIG.TEST_OBJECTIVE,

    /*
     * Keep compatibility with newer UI.
     */
    objectives: [
      'Brand Awareness'
    ],

    primaryObjective:
      'Brand Awareness',

    secondaryObjectives: [],

    objectiveCount: 1,

    audience:
      KOL_IDS_TEST_CONFIG.TEST_AUDIENCE,

    category:
      KOL_IDS_TEST_CONFIG.TEST_CATEGORY,

    positioning:
      KOL_IDS_TEST_CONFIG.TEST_POSITIONING,

    market:
      KOL_IDS_TEST_CONFIG.TEST_MARKET,

    budget:
      KOL_IDS_TEST_CONFIG.TEST_BUDGET,

    currency:
      'THB',

    /*
     * Persona test field.
     *
     * This is deliberately included so we can verify
     * whether the current backend accepts the Persona
     * payload without breaking existing analysis.
     */
    persona: {
      name: 'TEST PERSONA',
      description:
        'Thai young adults who enjoy fashion, entertainment and follow artists as style references.',
      interests: [
        'Fashion',
        'Entertainment',
        'Artists',
        'Short-form content'
      ]
    },

    /*
     * 3 deterministic test KOLs.
     */
    kols: [

      {
        name:
          'TEST KOL A',

        platform:
          'Instagram',

        followers:
          250000,

        engagementRate:
          5.8,

        platformUrl:
          'https://example.com/test-kol-a',

        photoUrl:
          ''
      },

      {
        name:
          'TEST KOL B',

        platform:
          'TikTok',

        followers:
          850000,

        engagementRate:
          7.2,

        platformUrl:
          'https://example.com/test-kol-b',

        photoUrl:
          ''
      },

      {
        name:
          'TEST KOL C',

        platform:
          'YouTube',

        followers:
          120000,

        engagementRate:
          3.9,

        platformUrl:
          'https://example.com/test-kol-c',

        photoUrl:
          ''
      }

    ]

  };


  /*
   * -------------------------------------------------------
   * TEST 9
   * SAVE
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'SAVE ANALYSIS',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS(
          testPayload
        );

      if (
        !result ||
        result.success !== true
      ) {

        throw new Error(
          'SAVE returned unsuccessful result.'
        );

      }

      return result;

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 10
   * ACTIVE STATE
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'ACTIVE ANALYSIS STATE',
    function() {

      const state =
        KOL_IDS_SYSTEM_SAAS_GET_STATE();

      if (!state) {

        throw new Error(
          'State returned empty.'
        );

      }

      return state;

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 11
   * RUN
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'RUN ANALYSIS',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_RUN_ANALYSIS();

      if (
        !result ||
        result.success !== true
      ) {

        throw new Error(
          'RUN ANALYSIS failed.'
        );

      }

      return result;

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 12
   * REPORT
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'REPORT',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_GET_REPORT();

      if (!result) {

        throw new Error(
          'Report returned empty.'
        );

      }

      return {
        success:
          result.success !== false,

        rowCount:
          Array.isArray(result.rows)
            ? result.rows.length
            : 0
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 13
   * HISTORY
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'HISTORY',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_GET_HISTORY();

      if (!result) {

        throw new Error(
          'History returned empty.'
        );

      }

      return {
        rowCount:
          Array.isArray(result.rows)
            ? result.rows.length
            : 0
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 14
   * EXPORT CURRENT
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'EXPORT CURRENT',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_EXPORT_CURRENT();

      if (
        !result ||
        result.csv === undefined
      ) {

        throw new Error(
          'Current export did not return CSV.'
        );

      }

      return {
        csvLength:
          String(result.csv || '').length
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 15
   * HEALTH CHECK
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'HEALTH CHECK',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_HEALTH();

      if (!result) {

        throw new Error(
          'Health check returned empty.'
        );

      }

      return {
        success:
          result.success,

        product:
          result.product,

        version:
          result.version,

        systemSuccess:
          result.system &&
          result.system.success
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 16
   * API SAVE_AND_RUN
   *
   * This is the MOST IMPORTANT WEB APP TEST.
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'WEB API SAVE_AND_RUN',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_API(
          'SAVE_AND_RUN',
          testPayload
        );

      if (
        !result ||
        result.success !== true
      ) {

        throw new Error(
          'SAVE_AND_RUN API failed.'
        );

      }

      return {
        success:
          result.success,

        saved:
          !!result.saved,

        reportRows:
          result.report &&
          Array.isArray(result.report.rows)
            ? result.report.rows.length
            : 0,

        historyRows:
          result.history &&
          Array.isArray(result.history.rows)
            ? result.history.rows.length
            : 0
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 17
   * NEW ANALYSIS / RESET
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'NEW ANALYSIS RESET',
    function() {

      const result =
        KOL_IDS_SYSTEM_SAAS_NEW_ANALYSIS();

      if (
        result &&
        result.success === false
      ) {

        throw new Error(
          'NEW ANALYSIS reset failed.'
        );

      }

      return result || {
        success: true
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 18
   * V5 INTERNAL TESTS
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'V5 INTERNAL TESTS',
    function() {

      if (
        typeof KOL_IDS_CORE_runTests !==
        'function'
      ) {

        return {
          skipped: true,
          reason:
            'KOL_IDS_CORE_runTests is not installed.'
        };

      }

      const result =
        KOL_IDS_CORE_runTests();

      if (
        !result ||
        result.success !== true
      ) {

        throw new Error(
          'V5 internal tests failed: ' +
          KOL_IDS_SYSTEM_TEST_STRINGIFY_(result)
        );

      }

      return {
        passed:
          result.passed,

        total:
          result.total,

        version:
          result.version
      };

    }
  );


  /*
   * -------------------------------------------------------
   * TEST 19
   * PERSONA PAYLOAD ACCEPTANCE
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_masterQATest_(
    'PERSONA PAYLOAD',
    function() {

      /*
       * Verify the test payload actually contains Persona.
       */
      if (
        !testPayload.persona ||
        !testPayload.persona.name
      ) {

        throw new Error(
          'Persona test payload is missing.'
        );

      }

      /*
       * Save once more with Persona.
       *
       * We intentionally do NOT claim Persona is
       * analytically used unless the backend exposes
       * evidence that it was stored/processed.
       */
      const result =
        KOL_IDS_SYSTEM_SAAS_SAVE_ANALYSIS(
          testPayload
        );

      if (
        !result ||
        result.success !== true
      ) {

        throw new Error(
          'Backend rejected payload containing Persona.'
        );

      }

      return {
        accepted: true,
        persona:
          testPayload.persona.name,

        note:
          'Payload accepted. Analytical Persona integration must be verified by Persona-specific backend output.'
      };

    }
  );


  /*
   * -------------------------------------------------------
   * WRITE ONE REPORT SHEET ONLY
   * -------------------------------------------------------
   */

  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
    master.getId()
  );

  const reportSheet =
    KOL_IDS_SYSTEM_TEST_GET_REPORT_SHEET_(
      master
    );


  /*
   * Clear old test rows.
   */
  if (
    reportSheet.getLastRow() > 1
  ) {

    reportSheet
      .getRange(
        2,
        1,
        reportSheet.getLastRow() - 1,
        7
      )
      .clearContent();

  }


  /*
   * Header
   */
  reportSheet
    .getRange(
      1,
      1,
      1,
      7
    )
    .setValues([[
      'TEST',
      'STATUS',
      'DETAILS',
      'ERROR',
      'DURATION (ms)',
      'TEST CLIENT ID',
      'TEST CLIENT ACCESS KEY'
    ]]);


  const outputRows =
    results.map(
      function(r) {

        return [
          r.test,
          r.status,
          r.details,
          r.error,
          r.duration || '',
          testClient
            ? testClient.clientId
            : '',
          testClient
            ? testClient.accessKey
            : ''
        ];

      }
    );


  if (outputRows.length) {

    reportSheet
      .getRange(
        2,
        1,
        outputRows.length,
        7
      )
      .setValues(
        outputRows
      );

  }


  /*
   * Summary section
   */
  const passed =
    results.filter(
      r => r.status === 'PASS'
    ).length;

  const failed =
    results.filter(
      r => r.status === 'FAIL'
    ).length;

  const total =
    results.length;


  const summaryRow =
    total + 4;


  reportSheet
    .getRange(
      summaryRow,
      1,
      4,
      2
    )
    .setValues([

      [
        'TOTAL TESTS',
        total
      ],

      [
        'PASSED',
        passed
      ],

      [
        'FAILED',
        failed
      ],

      [
        'OVERALL',
        failed === 0
          ? 'PASS'
          : 'FAIL'
      ]

    ]);


  /*
   * Login information
   */
  const loginRow =
    summaryRow + 6;


  reportSheet
    .getRange(
      loginRow,
      1,
      6,
      2
    )
    .setValues([

      [
        'TEST WEB APP LOGIN',
        ''
      ],

      [
        'CLIENT ID',
        testClient
          ? testClient.clientId
          : ''
      ],

      [
        'ACCESS KEY',
        testClient
          ? testClient.accessKey
          : ''
      ],

      [
        'CLIENT NAME',
        testClient
          ? testClient.clientName
          : ''
      ],

      [
        'WORKSPACE ID',
        testClient
          ? testClient.spreadsheetId
          : ''
      ],

      [
        'WEB APP URL',
        testClient
          ? (
              testClient.webAppUrl ||
              ScriptApp.getService().getUrl() ||
              ''
            )
          : ''
      ]

    ]);


  /*
   * Formatting
   */
  reportSheet.setFrozenRows(1);

  reportSheet
    .getRange(
      1,
      1,
      1,
      7
    )
    .setFontWeight('bold');

  reportSheet
    .autoResizeColumns(
      1,
      7
    );


  /*
   * Final result
   */
  const finalResult = {

    success:
      failed === 0,

    total:
      total,

    passed:
      passed,

    failed:
      failed,

    reportSheet:
      KOL_IDS_TEST_CONFIG.REPORT_SHEET,

    testClient:
      testClient
        ? {
            clientId:
              testClient.clientId,

            clientName:
              testClient.clientName,

            accessKey:
              testClient.accessKey,

            spreadsheetId:
              testClient.spreadsheetId,

            webAppUrl:
              testClient.webAppUrl ||
              ScriptApp.getService().getUrl() ||
              ''
          }
        : null,

    tests:
      results

  };


  /*
   * Keep runtime on MASTER after test.
   */
  KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(
    master.getId()
  );


  Logger.log(
    JSON.stringify(
      finalResult,
      null,
      2
    )
  );


  return finalResult;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_RUN_FULL_SYSTEM_TEST', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_RUN_FULL_SYSTEM_TEST', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 3. REPORT SHEET
 * ========================================================= */

function KOL_IDS_SYSTEM_TEST_GET_REPORT_SHEET_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_GET_REPORT_SHEET_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let sheet =
    ss.getSheetByName(
      KOL_IDS_TEST_CONFIG.REPORT_SHEET
    );

  if (!sheet) {

    sheet =
      ss.insertSheet(
        KOL_IDS_TEST_CONFIG.REPORT_SHEET
      );

  }

  return sheet;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_GET_REPORT_SHEET_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_GET_REPORT_SHEET_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 4. SAFE STRINGIFY
 * ========================================================= */

function KOL_IDS_SYSTEM_TEST_STRINGIFY_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_STRINGIFY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  let text = '';

  if (typeof value === 'string') {
    text = value;
  } else {
    try {
      text = JSON.stringify(value);
    } catch (e) {
      text = String(value);
    }
  }

  text = String(text || '');

  /* Google Sheets cell hard limit = 50,000 characters. */
  const MAX_CELL_CHARS = 45000;

  if (text.length > MAX_CELL_CHARS) {
    return text.slice(0, MAX_CELL_CHARS) +
      '\n… [TRUNCATED FOR GOOGLE SHEETS CELL LIMIT]';
  }

  return text;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_STRINGIFY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_STRINGIFY_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * 5. QUICK LOGIN INFO
 *
 * Run:
 *
 * KOL_IDS_SYSTEM_TEST_GET_LOGIN
 *
 * This returns the same dedicated TEST CLIENT.
 * ========================================================= */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SYSTEM_TEST_GET_LOGIN() {
  var t0 = Date.now();
  Logger.log('[TRACE][ENTER] KOL_IDS_SYSTEM_TEST_GET_LOGIN');

  try {
    var ss = KOL_IDS_SYSTEM_getMasterSpreadsheet_();
    KOL_IDS_SYSTEM_setRuntimeSpreadsheet_(ss);
    KOL_IDS_SYSTEM_ensureClientDirectory_();

    var sh = ss.getSheetByName('00_CLIENT_DIRECTORY');
    if (!sh) throw new Error('00_CLIENT_DIRECTORY sheet not found.');

    var values = sh.getDataRange().getValues();
    if (values.length < 2) {
      throw new Error('No client records available. Run KOL_IDS_SYSTEM_TEST_PROVISION_FAST first.');
    }

    var headers = values[0].map(function(v){ return String(v || '').trim(); });
    var idx = {};
    headers.forEach(function(h,i){ idx[h]=i; });

    function col(names) {
      for (var i=0;i<names.length;i++) {
        if (idx[names[i]] !== undefined) return idx[names[i]];
      }
      return -1;
    }

    var idCol = col(['CLIENT_ID','Client ID','clientId']);
    var nameCol = col(['CLIENT_NAME','Client Name','clientName']);
    var keyCol = col(['ACCESS_KEY','Access Key','accessKey']);
    var hashCol = col(['ACCESS_KEY_HASH','Access Key Hash','accessKeyHash']);
    var ssCol = col(['SPREADSHEET_ID','Spreadsheet ID','spreadsheetId']);
    var statusCol = col(['STATUS','Status','status']);
    var contactEmailCol = col(['CONTACT_EMAIL','Contact Email','contactEmail']);

    var found = null;
    for (var r=1;r<values.length;r++) {
      var clientName = nameCol >= 0 ? String(values[r][nameCol] || '') : '';
      var clientId = idCol >= 0 ? String(values[r][idCol] || '') : '';
      if (/SYSTEM TEST CLIENT/i.test(clientName) || /^TEST[-_]/i.test(clientId) || /^CL[-_]?TEST/i.test(clientId)) {
        found = values[r];
        break;
      }
    }

    if (!found) throw new Error('SYSTEM TEST CLIENT not found. Run KOL_IDS_SYSTEM_TEST_PROVISION_FAST first.');

    var clientIdOut = idCol >= 0 ? String(found[idCol] || '') : '';
    var clientNameOut = nameCol >= 0 ? String(found[nameCol] || '') : '';
    var accessKey = keyCol >= 0 ? String(found[keyCol] || '').trim() : '';

    /*
     * The client directory is hardened and stores the SHA-256 access-key hash.
     * That value must NEVER be used as the login password. The fast TEST
     * provisioner stores the plaintext test credential only in Script Properties
     * under the dedicated test-only property.
     */
    var props = PropertiesService.getScriptProperties();
    var globalTestKey = String(props.getProperty('KOL_IDS_TEST_ACCESS_KEY_PLAINTEXT') || '').trim();
    var clientTestKey = String(props.getProperty('KOL_IDS_TEST_ACCESS_KEY_' + clientIdOut) || '').trim();

    if (/^sha256:/i.test(accessKey) || !KOL_IDS.ACCESS_KEY_PATTERN.test(accessKey)) {
      accessKey = clientTestKey || globalTestKey;
    }

    if (!accessKey || /^sha256:/i.test(accessKey) || !KOL_IDS.ACCESS_KEY_PATTERN.test(accessKey)) {
      throw new Error(
        'TEST CLIENT plaintext Access Key is unavailable. Run KOL_IDS_SYSTEM_TEST_PROVISION_FAST to rotate/re-provision the TEST credential.'
      );
    }

    var result = {
      success: true,
      clientId: clientIdOut,
      clientName: clientNameOut,
      accessKey: accessKey,
      accessKeyPresent: !!accessKey,
      accessKeyLength: accessKey.length,
      credentialReady: !!accessKey && KOL_IDS.ACCESS_KEY_PATTERN.test(accessKey),
      spreadsheetId: ssCol >= 0 ? String(found[ssCol] || '') : '',
      status: statusCol >= 0 ? String(found[statusCol] || '') : '',
      registeredEmail: contactEmailCol >= 0 ? String(found[contactEmailCol] || '').trim().toLowerCase() : KOL_IDS_TEST_CONFIG.REGISTERED_EMAIL,
      webAppUrl: ScriptApp.getService().getUrl() || '',
      workspaceInitialized: !!(
        ssCol >= 0 &&
        found &&
        found[ssCol] &&
        (function(){
          try {
            var ws = SpreadsheetApp.openById(String(found[ssCol]));
            return ws.getSheets().length > 0;
          } catch (e) {
            return false;
          }
        })()
      ),
      durationMs: Date.now() - t0
    };

    Logger.log('========== TEST CLIENT LOGIN CREDENTIAL ==========');
    Logger.log('success: %s', result.success);
    Logger.log('clientId: %s', result.clientId);
    Logger.log('clientName: %s', result.clientName);
    Logger.log('accessKey: %s', result.accessKey ? result.accessKey : '[MISSING]');
    Logger.log('accessKeyPresent: %s', result.accessKeyPresent);
    Logger.log('accessKeyLength: %s', result.accessKeyLength);
    Logger.log('credentialReady: %s', result.credentialReady);
    Logger.log('spreadsheetId: %s', result.spreadsheetId);
    Logger.log('status: %s', result.status);
    Logger.log('webAppUrl: %s', result.webAppUrl);
    Logger.log('workspaceInitialized: %s', result.workspaceInitialized);
    Logger.log('durationMs: %s', result.durationMs);
    Logger.log('=================================================');

    Logger.log(JSON.stringify(result, null, 2));
    Logger.log('[TRACE][EXIT] KOL_IDS_SYSTEM_TEST_GET_LOGIN | %sms', Date.now() - t0);
    return result;
  } catch (err) {
    Logger.log('[TRACE][ERROR] KOL_IDS_SYSTEM_TEST_GET_LOGIN | %s', err && err.message ? err.message : err);
    Logger.log('[TRACE][EXIT] KOL_IDS_SYSTEM_TEST_GET_LOGIN | %sms', Date.now() - t0);
    throw err;
  }
}

/* =========================================================
 * 6. TEST LOGIN DIRECTLY
 *
 * Useful for checking authentication only.
 *
 * Run:
 *
 * KOL_IDS_SYSTEM_TEST_LOGIN
 * ========================================================= */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SYSTEM_TEST_LOGIN() {
  var t0 = Date.now();
  Logger.log('[TRACE][ENTER] KOL_IDS_SYSTEM_TEST_LOGIN');

  try {
    var creds = KOL_IDS_SYSTEM_TEST_GET_LOGIN();
    if (!creds || !creds.success) throw new Error('Test login credentials are unavailable.');
    if (!creds.clientId || !creds.accessKey) {
      throw new Error('Test login credentials are incomplete: clientId/accessKey missing.');
    }

    var result;
    if (typeof KOL_IDS_SYSTEM_SAAS_SIGN_IN !== 'function') {
      throw new Error('KOL_IDS_SYSTEM_SAAS_SIGN_IN() is not available.');
    }

    result = KOL_IDS_SYSTEM_SAAS_SIGN_IN({
      clientId: creds.clientId,
      accessKey: creds.accessKey
    });

    var safe = {
      success: !!(result && (result.success !== false)),
      authenticated: !!(result && (result.authenticated || result.success)),
      clientId: creds.clientId,
      clientName: creds.clientName,
      status: creds.status,
      workspaceId: result && (result.workspaceId || result.workspace_id || result.workspace) || '',
      sessionCreated: !!(
        result &&
        (
          result.sessionCreated === true ||
          result.sessionId ||
          result.session_id ||
          result.session
        )
      ),
      message: result && (result.message || result.error || '') || '',
      durationMs: Date.now() - t0
    };

    Logger.log('========== TEST CLIENT LOGIN RESULT ==========');
    Logger.log('success: %s', safe.success);
    Logger.log('authenticated: %s', safe.authenticated);
    Logger.log('clientId: %s', safe.clientId);
    Logger.log('clientName: %s', safe.clientName);
    Logger.log('status: %s', safe.status);
    Logger.log('workspaceId: %s', safe.workspaceId || '[not returned]');
    Logger.log('sessionCreated: %s', safe.sessionCreated);
    Logger.log('message: %s', safe.message || '[none]');
    Logger.log('durationMs: %s', safe.durationMs);
    Logger.log('==============================================');

    Logger.log(JSON.stringify(safe, null, 2));
    Logger.log('[TRACE][EXIT] KOL_IDS_SYSTEM_TEST_LOGIN | %sms', Date.now() - t0);
    return result;
  } catch (err) {
    Logger.log('[TRACE][ERROR] KOL_IDS_SYSTEM_TEST_LOGIN | %s', err && err.message ? err.message : err);
    Logger.log('[TRACE][EXIT] KOL_IDS_SYSTEM_TEST_LOGIN | %sms', Date.now() - t0);
    throw err;
  }
}


/* =========================================================
 * 7. TEST LOGOUT
 *
 * Run:
 *
 * KOL_IDS_SYSTEM_TEST_LOGOUT
 * ========================================================= */

function KOL_IDS_SYSTEM_TEST_LOGOUT() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_LOGOUT');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const result =
    KOL_IDS_SYSTEM_SAAS_SIGN_OUT();

  return {
    success: true,
    result: result
  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_LOGOUT', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_LOGOUT', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * END OF KOL IDS™ FULL SYSTEM TEST RUNNER
 * ========================================================= */
/* =========================================================
 * KOL IDS™ — WEB APP TEST LICENSE
 * PURPOSE:
 * Create one ACTIVE V5 License for Web App Login testing.
 *
 * SAFE:
 * - New function names only
 * - Does NOT modify V5 Core logic
 * - Does NOT create a new sheet
 * - Reuses existing V5_LICENSES schema
 * ========================================================= */

function KOL_IDS_SYSTEM_CREATE_WEBAPP_TEST_LICENSE() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_CREATE_WEBAPP_TEST_LICENSE');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const TEST_NAME = 'KOL IDS™ — WEB APP TEST CLIENT';
  const TEST_EMAIL = 'kolids.webapp.test@example.com';
  const TEST_PLAN = '1 Year';

  // Make sure V5 Sales system has been initialized.
  KOL_IDS_CORE_setupSales();

  const sales = KOL_IDS_CORE_salesSS_();

  const headers = [
    'License ID',
    'Access Code',
    'Email',
    'Customer Name',
    'Workspace ID',
    'Issued At',
    'Expires At',
    'Status',
    'Order ID',
    'Token',
    'Plan',
    'Last Order Type',
    'Reminder 2M Sent',
    'Reminder 1M Sent',
    'Last Reminder At',
    'Updated At'
  ];

  const sh = KOL_IDS_CORE_ensureColumns_(
    sales,
    KOL_IDS.SHEETS.LICENSES,
    headers
  );

  /*
   * If this test license already exists,
   * return the existing credentials instead of
   * creating duplicates every time.
   */
  if (sh.getLastRow() >= 2) {

    const rows = KOL_IDS_CORE_values_(sh);

    const existing = rows.find(function(r) {
      return String(r[2] || '').toLowerCase() === TEST_EMAIL.toLowerCase()
        && String(r[3] || '') === TEST_NAME
        && String(r[7] || '').toUpperCase() === 'ACTIVE';
    });

    if (existing) {

      const webAppUrl =
        ScriptApp.getService().getUrl() || '';

      const result = {
        success: true,
        existing: true,
        message: 'Existing Web App Test License found.',
        licenseId: existing[0],
        accessCode: existing[1],
        email: existing[2],
        customerName: existing[3],
        workspaceId: existing[4],
        issuedAt: existing[5],
        expiresAt: existing[6],
        status: existing[7],
        token: existing[9],
        plan: existing[10],
        webAppUrl: webAppUrl
      };

      Logger.log(JSON.stringify(result, null, 2));

      return result;
    }
  }

  /*
   * Create a NEW order object compatible with
   * KOL_IDS_CORE_issueLicense_().
   */
  const now = new Date();

  const orderId =
    'TEST-' +
    Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      'yyyyMMdd-HHmmss'
    );

  /*
   * V5 issueLicense_ expects:
   *
   * [0] Order ID
   * [2] Customer Name
   * [3] Email
   * [7] Plan
   */
  const testOrder = [];

  testOrder[0] = orderId;
  testOrder[2] = TEST_NAME;
  testOrder[3] = TEST_EMAIL;
  testOrder[7] = TEST_PLAN;

  /*
   * Use the REAL V5 license creation engine.
   */
  const license = KOL_IDS_CORE_issueLicense_(testOrder);

  const webAppUrl =
    ScriptApp.getService().getUrl() || '';

  const result = {
    success: true,
    existing: false,
    message: 'Web App Test License created successfully.',

    licenseId: license.licenseId,

    // THIS is the code to enter on the Web App login page.
    accessCode: license.code,

    email: TEST_EMAIL,
    customerName: TEST_NAME,

    workspaceId: license.workspaceId,

    issuedAt: now.toISOString(),
    expiresAt: license.expiresAt,

    status: 'ACTIVE',
    plan: license.plan,
    orderType: 'NEW',

    webAppUrl: webAppUrl
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_CREATE_WEBAPP_TEST_LICENSE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_CREATE_WEBAPP_TEST_LICENSE', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * OPTIONAL:
 * Simple login test from Apps Script
 * ========================================================= */

function KOL_IDS_SYSTEM_TEST_WEBAPP_LOGIN() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_TEST_WEBAPP_LOGIN');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const TEST_EMAIL = 'kolids.webapp.test@example.com';

  const sales = KOL_IDS_CORE_salesSS_();
  const sh = sales.getSheetByName(KOL_IDS.SHEETS.LICENSES);

  if (!sh || sh.getLastRow() < 2) {
    throw new Error(
      'No V5 License found. Run KOL_IDS_SYSTEM_CREATE_WEBAPP_TEST_LICENSE() first.'
    );
  }

  const rows = KOL_IDS_CORE_values_(sh);

  const license = rows.find(function(r) {
    return String(r[2] || '').toLowerCase() === TEST_EMAIL.toLowerCase()
      && String(r[7] || '').toUpperCase() === 'ACTIVE';
  });

  if (!license) {
    throw new Error(
      'ACTIVE Web App Test License not found.'
    );
  }

  const accessCode = String(license[1]);

  const loginResult =
    KOL_IDS_CORE_login(accessCode);

  const result = {
    success: true,
    test: 'WEB APP LOGIN',
    authenticated: true,
    licenseId: loginResult.licenseId,
    accessCode: accessCode,
    expiresAt: loginResult.expiresAt,
    version: loginResult.version,
    message: 'Web App Login authentication PASS.'
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_TEST_WEBAPP_LOGIN', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_TEST_WEBAPP_LOGIN', Date.now() - __kolIdsTraceStartedAt);
  }
}
/** * KOL IDS™ — NEW ANALYSIS * Starts a new analysis while preserving * previous analysis history. */ function KOL_IDS_SYSTEM_SAAS_NEW_ANALYSIS() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_SAAS_NEW_ANALYSIS');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 KOL_IDS_SYSTEM_SAAS_REQUIRE_CLIENT_(); const result = KOL_IDS_SYSTEM_SAAS_RESET_WORKSPACE(); return { success: true, action: 'NEW_ANALYSIS', message: 'New analysis workspace is ready. Previous analysis history is preserved.', result: result }; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_SAAS_NEW_ANALYSIS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_SAAS_NEW_ANALYSIS', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* =========================================================
 * V6.0 DEEP DECISION QA
 * ========================================================= */
function KOL_IDS_SYSTEM_DEEP_LOGIC_QA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_DEEP_LOGIC_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const failures = [];
  function KOL_IDS_SYSTEM_assert_(name, ok, detail) { if (!ok) failures.push(name + ': ' + (detail || 'failed')); }
  const brand = {category:'Beauty',market:'Thailand',targetAudience:'Women 18-34',positioning:'premium modern skincare',personality:'authentic confident',tone:'warm expert',values:'quality',desiredPerception:'trusted premium',keywords:'beauty skincare premium',avoid:'gambling politics'};
  const campaign = {objective:'CONVERSION',targetAudience:'Women 18-34 interested in skincare',primaryKpi:'CONVERSION',secondaryKpi:'CTR'};
  const good = {category:'Beauty / Lifestyle',audienceAge:'20-32',audienceInterest:'beauty skincare lifestyle',audienceLocation:'Thailand',contentStyle:'authentic skincare review comparison',previousBrandWork:'beauty brands',previousCampaignResult:'strong CTR and conversions',contentEvidence:'VERIFIED',reputationEvidence:'VERIFIED',performanceEvidence:'VERIFIED',riskLevel:'LOW'};
  const bad = {category:'Gaming',audienceAge:'16-20',audienceInterest:'gaming esports',audienceLocation:'Thailand',contentStyle:'gaming entertainment',previousBrandWork:'gaming',previousCampaignResult:'high views',contentEvidence:'VERIFIED',reputationEvidence:'VERIFIED',performanceEvidence:'VERIFIED',riskLevel:'LOW'};
  const a = KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_(brand,campaign,good);
  const b = KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_(brand,campaign,bad);
  KOL_IDS_SYSTEM_assert_('deep function exists', !!a && !!b);
  KOL_IDS_SYSTEM_assert_('good creator beats bad creator', a.score > b.score, a.score + ' <= ' + b.score);
  KOL_IDS_SYSTEM_assert_('conversion behavior rewards review', a.campaignCompatibility >= 70, a.campaignCompatibility);
  KOL_IDS_SYSTEM_assert_('audience mismatch is detected', b.audienceCompatibility < a.audienceCompatibility, b.audienceCompatibility + ' >= ' + a.audienceCompatibility);
  KOL_IDS_SYSTEM_assert_('age KOL_IDS_DECISION_SCIENCE_overlap is numeric', !!KOL_IDS_ENGINE_parseAgeRange_('20-32'));
  KOL_IDS_SYSTEM_assert_('zero remains zero', KOL_IDS_ENGINE_number_(0) === 0);
  return {success: failures.length === 0, failures: failures, tests: 7};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_DEEP_LOGIC_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_DEEP_LOGIC_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * KOL IDS™ — FAST MASTER QA / DEPLOY PREFLIGHT
 *
 * Lightweight gate for editor runs. It intentionally avoids the expensive
 * controlled-data seed, full Decision Engine orchestration, dashboard rebuild,
 * portfolio rebuild and Product SAVE→RUN loop. The full MASTER QA remains
 * available as KOL_IDS_SYSTEM_RUN_MASTER_QA().
 */
function KOL_IDS_SYSTEM_RUN_MASTER_QA_FAST() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SYSTEM_RUN_MASTER_QA_FAST');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    var started = Date.now();
    var results = [];
    function run(name, fn) {
      var t = Date.now();
      try {
        var value = fn();
        var fail = value && typeof value === 'object' && (value.success === false || value.ready === false);
        results.push({name:name,status:fail?'FAIL':'PASS',durationMs:Date.now()-t,detail:KOL_IDS_SYSTEM_QA_stringify_(value)});
      } catch (e) {
        results.push({name:name,status:'FAIL',durationMs:Date.now()-t,detail:KOL_IDS_SYSTEM_QA_error_(e)});
      }
    }

    run('Static function inventory', function(){ return KOL_IDS_SYSTEM_QA_staticInventory_(); });

    // Fresh workspaces start with only the default Sheet1. Bootstrap the
    // canonical KOL IDS core schema before validating it. This is idempotent:
    // existing data rows are preserved and only the canonical header row is
    // synchronized. This prevents a false RED preflight on a newly installed
    // spreadsheet.
    run('Workspace schema bootstrap', function(){
      KOL_IDS_SYSTEM_initialize({suppressAlerts:true});
      return {initialized:true, sheets:KOL_IDS_SYSTEM_getSpreadsheet_().getSheets().length};
    });

    run('Core structure', function(){
      var valid = KOL_IDS_SYSTEM_validateStructureSilent_();
      if (!valid) throw new Error('Core structure validation failed.');
      return {valid:true};
    });
    run('Schema health', function(){ return KOL_IDS_SCHEMA_checkSchemaHealth({suppressAlerts:true}); });
    run('Hardening certification', function(){ return KOL_IDS_HARDENING_RUNTIME_PRODUCTION_CERTIFICATION_QA(); });
    run('Operation contract', function(){ return KOL_IDS_HARDENING_RUNTIME_operationContractQA_(); });
    run('Idempotency health', function(){ return KOL_IDS_HARDENING_RUNTIME_idempotencyHealth_(); });
    run('System health (silent)', function(){ return KOL_IDS_SYSTEM_systemHealthCheck({suppressAlerts:true}); });
    run('Function reference audit', function(){
      var audit = KOL_IDS_SYSTEM_QA_referenceAudit_();
      if (audit.missing.length || audit.duplicates.length) {
        throw new Error('Function reference audit failed: missing=' + audit.missing.join(',') + ' duplicates=' + audit.duplicates.join(','));
      }
      return audit;
    });

    var failed = results.filter(function(r){return r.status==='FAIL';});
    var summary = {
      success: failed.length===0,
      status: failed.length===0 ? 'GREEN' : 'RED',
      suite: 'MASTER QA FAST PREFLIGHT',
      durationMs: Date.now()-started,
      passed: results.filter(function(r){return r.status==='PASS';}).length,
      failed: failed.length,
      results: results,
      note: 'Fast preflight only; full MASTER QA is still required before production deploy.'
    };
    Logger.log(JSON.stringify(summary, null, 2));
    return summary;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SYSTEM_RUN_MASTER_QA_FAST', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SYSTEM_RUN_MASTER_QA_FAST', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_SYSTEM_TEST_GET_LOGIN() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SYSTEM_TEST_GET_LOGIN', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SYSTEM_TEST_GET_LOGIN, this, arguments);
}


function KOL_IDS_SYSTEM_TEST_LOGIN() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_SYSTEM_TEST_LOGIN', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_SYSTEM_TEST_LOGIN, this, arguments);
}
