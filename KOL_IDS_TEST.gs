
/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * KBIS V1 — CONTROLLED TEST DATA
 *
 * FILE:
 * KOL_IDS_Test.gs
 *
 * PURPOSE:
 * Create:
 * - 1 Brand
 * - 1 Campaign
 * - 5 KOL profiles
 *
 * TEST OBJECTIVE:
 * Validate:
 * Brand Fit™
 * Brand Impact™
 * Confidence™
 * Risk Override
 * Decision Logic
 ****************************************************/


function KOL_IDS_TEST_seedControlledTestData() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_TEST_seedControlledTestData');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();

  /*
   * ================================================
   * TEST IDENTIFIERS
   * ================================================
   */

  const BRAND_ID = 'BRAND-TEST-001';
  const CAMPAIGN_ID = 'KBIS-TEST-CAMP-001';


  /*
   * ================================================
   * 1. BRAND
   * ================================================
   *
   * Fictional test brand:
   * Premium modern lifestyle brand
   */

  const brandSheet =
    ss.getSheetByName(
      '02_BRAND_PROFILE'
    );

  const brandRow = [

    BRAND_ID,

    'AURA LIFE',

    'Lifestyle',

    'Thailand',

    'Urban Gen Z & Young Millennials',

    'Premium accessible lifestyle brand',

    'Modern / Confident / Aspirational',

    'Smart / Premium / Human',

    'Quality / Creativity / Self-expression',

    'Modern lifestyle with credible cultural relevance',

    'premium, lifestyle, modern, creative, authentic',

    'controversy, excessive promotion, low credibility',

    'VERIFIED',

    new Date()

  ];

  brandSheet
    .getRange(
      2,
      1,
      1,
      brandRow.length
    )
    .setValues([brandRow]);


  /*
   * ================================================
   * 2. CAMPAIGN
   * ================================================
   */

  const campaignSheet =
    ss.getSheetByName(
      '03_CAMPAIGN'
    );

  const campaignRow = [

    CAMPAIGN_ID,

    'AURA LIFE — Summer Brand Launch',

    BRAND_ID,

    'Build brand awareness and strengthen premium lifestyle perception',

    'Urban Gen Z & Young Millennials',

    'Brand Awareness',

    'Brand Consideration',

    500000,

    'THB',

    new Date(2026, 7, 1),

    new Date(2026, 8, 30),

    30, // Awareness

    20, // Credibility

    20, // Brand Relevance

    15, // Perception

    10, // Purchase Influence

    5,  // Community

    'ACTIVE',

    new Date()

  ];

  campaignSheet
    .getRange(
      2,
      1,
      1,
      campaignRow.length
    )
    .setValues([campaignRow]);


  /*
   * ================================================
   * 3. KOL TEST DATA
   * ================================================
   *
   * Five deliberately different profiles.
   *
   * A = Strong overall fit
   * B = Huge followers but poor brand fit
   * C = Strong fit but weak evidence
   * D = Strong impact but high risk
   * E = Moderate / balanced
   */


  const kolSheet =
    ss.getSheetByName(
      '04_KOL_DATABASE'
    );


  const rows = [

    /*
     * --------------------------------------------
     * KOL A
     * STRONG FIT / HIGH CONFIDENCE
     * Expected:
     * RECOMMENDED
     * --------------------------------------------
     */

    [

      'KOL-TEST-001',

      'MAYA ARIN',

      'Instagram',

      'https://example.com/maya-arin',

      'Lifestyle',

      1090000,

      5.8,

      '22-34',

      'Female',

      'Bangkok / Chiang Mai',

      'Lifestyle / Fashion / Beauty / Travel',

      'Premium lifestyle storytelling',

      65000,

      'THB',

      'Premium lifestyle / beauty campaigns',

      'Strong engagement and positive brand response',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'LOW',

      95,

      94, // Audience Fit
      92, // Brand Image
      90, // Content
      93, // Category
      91, // Value
      88, // Performance

      90, // Awareness
      88, // Credibility
      94, // Brand Relevance
      91, // Perception
      78, // Purchase
      84, // Community

      'ACTIVE',

      new Date()

    ],


    /*
     * --------------------------------------------
     * KOL B
     * HUGE FOLLOWERS / LOW BRAND FIT
     * Expected:
     * NOT RECOMMENDED or CONSIDER
     *
     * This tests whether followers alone
     * can incorrectly dominate the decision.
     * --------------------------------------------
     */

    [

      'KOL-TEST-002',

      'MAX RAY',

      'TikTok',

      'https://example.com/max-ray',

      'Entertainment',

      3200000,

      2.1,

      '16-24',

      'Mixed',

      'Thailand',

      'Comedy / Entertainment / Viral',

      'Mass entertainment',

      120000,

      'THB',

      'Mass-market campaigns',

      'High reach but inconsistent brand relevance',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'SELF_REPORTED',

      'VERIFIED',

      'LOW',

      90,

      42, // Audience Fit
      38, // Brand Image
      45, // Content
      30, // Category
      40, // Value
      50, // Performance

      95, // Awareness
      45, // Credibility
      35, // Brand Relevance
      40, // Perception
      55, // Purchase
      70, // Community

      'ACTIVE',

      new Date()

    ],


    /*
     * --------------------------------------------
     * KOL C
     * STRONG FIT / LOW EVIDENCE
     * Expected:
     * REVIEW REQUIRED
     *
     * This tests Confidence Gate.
     * --------------------------------------------
     */

    [

      'KOL-TEST-003',

      'NINA VEE',

      'Instagram',

      'https://example.com/nina-vee',

      'Fashion / Lifestyle',

      180000,

      7.4,

      '21-32',

      'Female',

      'Bangkok',

      'Fashion / Lifestyle / Design',

      'Editorial / aesthetic',

      45000,

      'THB',

      'Limited previous commercial work',

      'No verified campaign performance data',

      'SELF_REPORTED',

      'ESTIMATED',

      'VERIFIED',

      'MISSING',

      'ESTIMATED',

      'LOW',

      90,

      92,
      91,
      94,
      95,
      92,
      35,

      82,
      86,
      94,
      93,
      65,
      80,

      'ACTIVE',

      new Date()

    ],


    /*
     * --------------------------------------------
     * KOL D
     * HIGH IMPACT / HIGH RISK
     * Expected:
     * REVIEW REQUIRED
     *
     * Risk must override high scores.
     * --------------------------------------------
     */

    [

      'KOL-TEST-004',

      'JAY STORM',

      'TikTok',

      'https://example.com/jay-storm',

      'Entertainment / Lifestyle',

      1100000,

      6.9,

      '18-30',

      'Mixed',

      'Thailand',

      'Entertainment / Fashion / Lifestyle',

      'High-energy viral content',

      90000,

      'THB',

      'Multiple major campaigns',

      'Very high reach and engagement',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'HIGH',

      15,

      88,
      82,
      90,
      86,
      80,
      92,

      96,
      85,
      84,
      80,
      91,
      88,

      'ACTIVE',

      new Date()

    ],


    /*
     * --------------------------------------------
     * KOL E
     * MODERATE / BALANCED
     * Expected:
     * CONSIDER
     * --------------------------------------------
     */

    [

      'KOL-TEST-005',

      'PLOY MIN',

      'Instagram',

      'https://example.com/ploy-min',

      'Lifestyle',

      95000,

      4.9,

      '24-35',

      'Female',

      'Bangkok / Phuket',

      'Lifestyle / Food / Travel',

      'Friendly lifestyle content',

      18000,

      'THB',

      'Small lifestyle campaigns',

      'Moderate campaign performance',

      'VERIFIED',

      'VERIFIED',

      'VERIFIED',

      'SELF_REPORTED',

      'VERIFIED',

      'LOW',

      90,

      72,
      70,
      75,
      68,
      73,
      65,

      70,
      68,
      75,
      72,
      62,
      80,

      'ACTIVE',

      new Date()

    ]

  ];


  /*
   * ================================================
   * CLEAR OLD TEST DATA
   * ================================================
   *
   * We only clear the data rows in the three
   * controlled test sheets.
   */

  if (brandSheet.getLastRow() > 1) {

    brandSheet
      .getRange(
        2,
        1,
        brandSheet.getLastRow() - 1,
        14
      )
      .clearContent();

    brandSheet
      .getRange(
        2,
        1,
        1,
        brandRow.length
      )
      .setValues([brandRow]);

  }


  if (campaignSheet.getLastRow() > 1) {

    campaignSheet
      .getRange(
        2,
        1,
        campaignSheet.getLastRow() - 1,
        19
      )
      .clearContent();

    campaignSheet
      .getRange(
        2,
        1,
        1,
        campaignRow.length
      )
      .setValues([campaignRow]);

  }


  if (kolSheet.getLastRow() > 1) {

    kolSheet
      .getRange(
        2,
        1,
        kolSheet.getLastRow() - 1,
        37
      )
      .clearContent();

  }


  /*
   * ================================================
   * WRITE KOL DATA
   * ================================================
   */

  kolSheet
    .getRange(
      2,
      1,
      rows.length,
      37
    )
    .setValues(rows);


  /*
   * ================================================
   * FORMAT
   * ================================================
   */

  KOL_IDS_TEST_testFormat_(
    brandSheet,
    campaignSheet,
    kolSheet
  );


  SpreadsheetApp.flush();


  KOL_IDS_SYSTEM_safeAlert_(

    '✅ KOL IDS™ CONTROLLED TEST DATA READY\n\n' +

    'Brand: AURA LIFE\n' +

    'Campaign: AURA LIFE — Summer Brand Launch\n\n' +

    'KOL Profiles: 5\n\n' +

    'A = Strong Fit / High Confidence\n' +
    'B = High Reach / Low Fit\n' +
    'C = Strong Fit / Weak Evidence\n' +
    'D = High Impact / High Risk\n' +
    'E = Moderate / Balanced\n\n' +

    'Next:\n' +
    'Run → KOL IDS™ →\n' +
    '🧮 Run Decision Engine'

  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_TEST_seedControlledTestData', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_TEST_seedControlledTestData', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * TEST FORMATTING
 * ================================================== */

function KOL_IDS_TEST_testFormat_(
  brandSheet,
  campaignSheet,
  kolSheet
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_TEST_testFormat_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  /*
   * Number formats
   */

  brandSheet
    .getRange(
      2,
      14,
      Math.max(
        brandSheet.getLastRow() - 1,
        1
      ),
      1
    )
    .setNumberFormat(
      'dd/mm/yyyy hh:mm'
    );


  campaignSheet
    .getRange(
      2,
      8,
      Math.max(
        campaignSheet.getLastRow() - 1,
        1
      ),
      1
    )
    .setNumberFormat(
      '#,##0'
    );


  campaignSheet
    .getRange(
      2,
      10,
      Math.max(
        campaignSheet.getLastRow() - 1,
        1
      ),
      2
    )
    .setNumberFormat(
      'dd/mm/yyyy'
    );


  kolSheet
    .getRange(
      2,
      6,
      Math.max(
        kolSheet.getLastRow() - 1,
        1
      ),
      1
    )
    .setNumberFormat(
      '#,##0'
    );


  kolSheet
    .getRange(
      2,
      7,
      Math.max(
        kolSheet.getLastRow() - 1,
        1
      ),
      1
    )
    .setNumberFormat(
      '0.0%'
    );


  kolSheet
    .getRange(
      2,
      13,
      Math.max(
        kolSheet.getLastRow() - 1,
        1
      ),
      1
    )
    .setNumberFormat(
      '#,##0'
    );


  kolSheet
    .getRange(
      2,
      37,
      Math.max(
        kolSheet.getLastRow() - 1,
        1
      ),
      1
    )
    .setNumberFormat(
      'dd/mm/yyyy hh:mm'
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_TEST_testFormat_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_TEST_testFormat_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * TEST REPORT
 * ================================================== */

function KOL_IDS_TEST_showTestDatasetSummary() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_TEST_showTestDatasetSummary');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();

  const sheet =
    ss.getSheetByName(
      '04_KOL_DATABASE'
    );

  const rows =
    Math.max(
      sheet.getLastRow() - 1,
      0
    );


  KOL_IDS_SYSTEM_safeAlert_(

    'KBIS TEST DATASET\n\n' +

    'KOL Records: ' +
    rows +
    '\n\n' +

    'Expected test behavior:\n\n' +

    'KOL A\n' +
    '→ Strong Fit\n' +
    '→ High Confidence\n' +
    '→ Recommended\n\n' +

    'KOL B\n' +
    '→ Large Audience\n' +
    '→ Low Brand Fit\n' +
    '→ Should NOT win simply because of followers\n\n' +

    'KOL C\n' +
    '→ Strong Fit\n' +
    '→ Weak Evidence\n' +
    '→ Review Required\n\n' +

    'KOL D\n' +
    '→ Strong Impact\n' +
    '→ HIGH Risk\n' +
    '→ Review Required\n\n' +

    'KOL E\n' +
    '→ Moderate Fit\n' +
    '→ Consider'

  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_TEST_showTestDatasetSummary', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_TEST_showTestDatasetSummary', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * ONE-CLICK CONTROLLED QA RUNNER
 * ==================================================
 *
 * Run this function for a complete controlled test:
 * Seed -> verify Brand/Campaign/KOL -> flush -> Engine.
 *
 * This runner intentionally calls the Decision Engine directly.
 * It does not call the Dashboard, so QA can distinguish an
 * Engine problem from a Dashboard hand-off problem.
 * ================================================== */
function KOL_IDS_TEST_RUN_ALL_QA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_TEST_RUN_ALL_QA');
  var startedAt = Date.now();

  try {
    KOL_IDS_TEST_seedControlledTestData();

    var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
    if (!ss) {
      throw new Error('QA: Runtime spreadsheet could not be resolved.');
    }

    var campaignSheet = ss.getSheetByName('03_CAMPAIGN');
    if (!campaignSheet) {
      throw new Error('QA: 03_CAMPAIGN not found.');
    }

    var campaignId = String(campaignSheet.getRange('A2').getDisplayValue()).trim();
    var campaignBrandId = String(campaignSheet.getRange('C2').getDisplayValue()).trim();

    if (!campaignId) {
      throw new Error('QA: 03_CAMPAIGN!A2 is empty.');
    }
    if (!campaignBrandId) {
      throw new Error('QA: 03_CAMPAIGN!C2 is empty.');
    }

    var brandSheet = ss.getSheetByName('02_BRAND_PROFILE');
    if (!brandSheet) {
      throw new Error('QA: 02_BRAND_PROFILE not found.');
    }

    var brandId = String(brandSheet.getRange('A2').getDisplayValue()).trim();
    if (!brandId) {
      throw new Error('QA: 02_BRAND_PROFILE!A2 is empty.');
    }

    if (campaignBrandId !== brandId) {
      throw new Error(
        'QA: Campaign Brand ID does not match Brand Profile. ' +
        'Campaign=' + campaignBrandId + ', Brand=' + brandId
      );
    }

    var kolSheet = ss.getSheetByName('04_KOL_DATABASE');
    if (!kolSheet) {
      throw new Error('QA: 04_KOL_DATABASE not found.');
    }

    var kolRows = Math.max(kolSheet.getLastRow() - 1, 0);
    if (!kolRows) {
      throw new Error('QA: 04_KOL_DATABASE contains no test records.');
    }

    SpreadsheetApp.flush();

    Logger.log('QA Campaign ID = ' + campaignId);
    Logger.log('QA Brand ID = ' + brandId);
    Logger.log('QA KOL Rows = ' + kolRows);
    Logger.log('QA Spreadsheet ID = ' + ss.getId());

    var result = KOL_IDS_ENGINE_runDecisionEngine();

    var decisionSheet = ss.getSheetByName('07_KOL_DECISION');
    var decisionRows = decisionSheet ? Math.max(decisionSheet.getLastRow() - 1, 0) : 0;

    if (!decisionRows) {
      throw new Error(
        'QA: Decision Engine returned but 07_KOL_DECISION contains no records.'
      );
    }

    Logger.log('================================');
    Logger.log('KBIS QA SUCCESS');
    Logger.log('Campaign ID: ' + campaignId);
    Logger.log('Brand ID: ' + brandId);
    Logger.log('KOL Rows: ' + kolRows);
    Logger.log('Decision Rows: ' + decisionRows);
    Logger.log('Spreadsheet ID: ' + ss.getId());
    Logger.log('Elapsed: ' + (Date.now() - startedAt) + ' ms');
    Logger.log('================================');

    return {
      success: true,
      campaignId: campaignId,
      brandId: brandId,
      kolRows: kolRows,
      decisionRows: decisionRows,
      spreadsheetId: ss.getId(),
      result: result,
      elapsedMs: Date.now() - startedAt
    };

  } catch (err) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_TEST_RUN_ALL_QA', err);
    Logger.log('KBIS QA FAILED: ' + err.message);
    throw err;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_TEST_RUN_ALL_QA', Date.now() - startedAt);
  }
}
