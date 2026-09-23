
/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * KBIS V1 — CONTROL CENTER
 *
 * FILE:
 * KOL_IDS_SYSTEM_ControlCenter.gs
 *
 * VERSION:
 * 1.1.0 FINAL PRODUCTION
 *
 * PURPOSE:
 * MASTER ORCHESTRATOR
 *
 * FLOW:
 *
 * INPUT
 *   
 * VALIDATION
 *   
 * DECISION ENGINE
 *   
 * PORTFOLIO OPTIMIZATION
 *   
 * HEALTH
 *   
 * EXECUTIVE DASHBOARD
 *   
 * QA
 *
 ****************************************************/

const KOL_IDS_CONTROL_CONFIG = {

  VERSION: '1.1.0',

  CONTROL_SHEET: '13_CONTROL_CENTER',

  CAMPAIGN_SHEET: '03_CAMPAIGN',

  DECISION_SHEET: '07_KOL_DECISION',

  PORTFOLIO_SHEET: '12_PORTFOLIO',

  DASHBOARD_SHEET: '11_EXECUTIVE',

  QA_SHEET: '15_SYSTEM_QA'

};



/* ==================================================
 * MASTER RUNNER
 * ================================================== */

function KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const lock =
    LockService.getScriptLock();

  if (
    !lock.tryLock(15000)
  ) {

    throw new Error(
      'KBIS: Another process is currently running.'
    );

  }

  const started =
    new Date();

  let portfolioResult =
    null;

  let qaResult =
    null;

  try {

    const ss =
      KOL_IDS_SYSTEM_getSpreadsheet_();


    KOL_IDS_CONTROL_prepareControlCenter_(
      ss
    );


    KOL_IDS_CONTROL_logControl_(
      ss,
      'START',
      'KBIS Full Intelligence started.'
    );


    /*
     * ==============================================
     * 1. SYSTEM QA / VALIDATION
     * ==============================================
     */

    const preQA =
      KOL_IDS_CONTROL_validateSystem_(
        ss
      );


    if (
      !preQA.ok
    ) {

      KOL_IDS_CONTROL_writeControlStatus_(
        ss,
        'BLOCKED',
        'SYSTEM VALIDATION FAILED'
      );

      KOL_IDS_CONTROL_logControl_(
        ss,
        'BLOCKED',
        preQA.message
      );

      throw new Error(
        preQA.message
      );

    }


    /*
     * ==============================================
     * 2. DECISION ENGINE
     * ==============================================
     */

    if (
      typeof KOL_IDS_ENGINE_runDecisionEngine ===
      'function'
    ) {

      KOL_IDS_CONTROL_logControl_(
        ss,
        'ENGINE',
        'Running Decision Engine.'
      );

      KOL_IDS_ENGINE_runDecisionEngine();

    }
    else {

      KOL_IDS_CONTROL_logControl_(
        ss,
        'SKIP',
        'Decision Engine function not found. Existing decision data will be used.'
      );

    }


    /*
     * ==============================================
     * 3. PORTFOLIO
     * ==============================================
     */

    if (
      typeof KOL_IDS_PORTFOLIO_runPortfolioOptimization !==
      'function'
    ) {

      throw new Error(
        'KBIS: KOL_IDS_PORTFOLIO_runPortfolioOptimization() not found.'
      );

    }


    KOL_IDS_CONTROL_logControl_(
      ss,
      'ENGINE',
      'Running Portfolio Optimization.'
    );


    portfolioResult =
      KOL_IDS_PORTFOLIO_runPortfolioOptimization();


    /*
     * ==============================================
     * 4. EXECUTIVE DASHBOARD
     * ==============================================
     */

    KOL_IDS_CONTROL_logControl_(
      ss,
      'ENGINE',
      'Building Executive Dashboard.'
    );


    KOL_IDS_DASHBOARD_buildExecutiveDashboard(
      portfolioResult
    );


    /*
     * ==============================================
     * 5. FINAL QA
     * ==============================================
     */

    KOL_IDS_CONTROL_logControl_(
      ss,
      'ENGINE',
      'Running final system QA.'
    );


    qaResult =
      KOL_IDS_SYSTEM_runSystemQA(
        true
      );


    /*
     * ==============================================
     * 6. FINAL STATUS
     * ==============================================
     */

    const elapsed =
      (
        new Date().getTime() -
        started.getTime()
      ) / 1000;


    const finalStatus =
      (
        qaResult &&
        qaResult.status === 'PASS'
      )
        ? 'READY'
        : 'ATTENTION';


    KOL_IDS_CONTROL_writeControlStatus_(
      ss,
      finalStatus,
      'FULL INTELLIGENCE COMPLETED'
    );


    KOL_IDS_CONTROL_writeControlMetrics_(
      ss,
      portfolioResult,
      qaResult,
      elapsed
    );


    KOL_IDS_CONTROL_logControl_(
      ss,
      'COMPLETE',
      'KBIS Full Intelligence completed in ' +
      elapsed.toFixed(2) +
      ' seconds.'
    );


    SpreadsheetApp.flush();


    ss.toast(
      'KBIS Full Intelligence completed.',
      'KOL IDS™',
      5
    );


    return {

      success: true,

      status: finalStatus,

      portfolio:
        portfolioResult,

      qa:
        qaResult,

      elapsedSeconds:
        elapsed

    };


  }
  catch (error) {

    const ss =
      KOL_IDS_SYSTEM_getSpreadsheet_();


    KOL_IDS_CONTROL_writeControlStatus_(
      ss,
      'ERROR',
      error.message
    );


    KOL_IDS_CONTROL_logControl_(
      ss,
      'ERROR',
      error.message
    );


    ss.toast(
      'KBIS ERROR: ' +
      error.message,
      'KOL IDS™',
      8
    );


    throw error;

  }
  finally {

    lock.releaseLock();

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CONTROL CENTER
 * ================================================== */

function KOL_IDS_CONTROL_prepareControlCenter_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_prepareControlCenter_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let sheet =
    ss.getSheetByName(
      KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET
    );


  if (!sheet) {

    sheet =
      ss.insertSheet(
        KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET
      );

  }


  /*
   * Safe reset.
   */

  const merged =
    sheet
      .getDataRange()
      .getMergedRanges();


  merged.forEach(
    r =>
      r.breakApart()
  );


  sheet.clear();


  sheet.setColumnWidths(
    1,
    8,
    145
  );


  sheet.setFrozenRows(
    2
  );


  /*
   * Title
   */

  sheet
    .getRange(
      'A1:H1'
    )
    .merge();


  sheet
    .getRange(
      'A1'
    )
    .setValue(
      'KOL IDS™ CONTROL CENTER'
    )
    .setFontSize(
      20
    )
    .setFontWeight(
      'bold'
    )
    .setHorizontalAlignment(
      'center'
    );


  sheet
    .getRange(
      'A2:H2'
    )
    .merge();


  sheet
    .getRange(
      'A2'
    )
    .setValue(
      'KOL Investment Decision System™ • Master Intelligence Layer'
    )
    .setHorizontalAlignment(
      'center'
    );


  sheet
    .getRange(
      'A4:B10'
    )
    .setValues([

      [
        'SYSTEM',
        'KOL IDS'
      ],

      [
        'ENGINE',
        'FULL INTELLIGENCE'
      ],

      [
        'STATUS',
        'INITIALIZING'
      ],

      [
        'PORTFOLIO',
        '-'
      ],

      [
        'SCORE',
        '-'
      ],

      [
        'QA',
        '-'
      ],

      [
        'LAST RUN',
        new Date()
      ]

    ]);


  sheet
    .getRange(
      'D4:H4'
    )
    .merge();


  sheet
    .getRange(
      'D4'
    )
    .setValue(
      'SYSTEM FLOW'
    )
    .setFontWeight(
      'bold'
    );


  sheet
    .getRange(
      'D5:H10'
    )
    .setValues([

      [
        '01',
        'Validate',
        '',
        '',
        ''
      ],

      [
        '02',
        'Decision Engine',
        '',
        '',
        ''
      ],

      [
        '03',
        'Portfolio Optimization',
        '',
        '',
        ''
      ],

      [
        '04',
        'Executive Dashboard',
        '',
        '',
        ''
      ],

      [
        '05',
        'System QA',
        '',
        '',
        ''
      ],

      [
        '06',
        'Executive Decision',
        '',
        '',
        ''
      ]

    ]);


  sheet
    .getRange(
      'A4:H10'
    )
    .setVerticalAlignment(
      'middle'
    )
    .setWrap(
      true
    );


  sheet
    .getRange(
      'A4:B10'
    )
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true
    );


  sheet
    .getRange(
      'D4:H10'
    )
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true
    );


  sheet
    .getRange(
      'A12:H12'
    )
    .merge();


  sheet
    .getRange(
      'A12'
    )
    .setValue(
      'ACTIVITY LOG'
    )
    .setFontWeight(
      'bold'
    );


  sheet
    .getRange(
      'A13:D13'
    )
    .setValues([

      [
        'Time',
        'Type',
        'Message',
        'Status'
      ]

    ])
    .setFontWeight(
      'bold'
    );



    KOL_IDS_CONTROL_applyPremiumStyle_(sheet);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_prepareControlCenter_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_prepareControlCenter_', Date.now() - __kolIdsTraceStartedAt);
  }
}



function KOL_IDS_CONTROL_applyPremiumStyle_(sheet) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_applyPremiumStyle_'); var __kolIdsTraceStartedAt=Date.now();
  try {
    /* KOL IDS CI — control tower visual system. Presentation only. */
    var burgundy='#173247', burgundy2='#2E6B8A', cyan='#EAF7FF', mint='#EFFBF6', rose='#FFF5F8', navy='#294A60';
    var neutral='#EEF3F7', line='#D5E2EB', grey='#6B7782', white='#FFFFFF', black='#1B2730';
    // Keep presentation formatting non-blocking. Do not chain Sheet methods
    // because Apps Script can return null from a formatting call in some
    // non-interactive execution contexts.
    sheet.setHiddenGridlines(true);
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(0);
    try { sheet.setTabColor(burgundy); } catch (tabColorError) {
      KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_tabColor_', tabColorError);
    }
    sheet.getRange(1,1,Math.max(sheet.getMaxRows(),20),8).setFontFamily('Arial').setFontColor(black).setBackground('#FBFCFD').setVerticalAlignment('middle');
    [125,205,105,200,105,105,105,210].forEach(function(w,i){sheet.setColumnWidth(i+1,w);});
    sheet.setRowHeight(1,50); sheet.setRowHeight(2,30); sheet.setRowHeight(3,7);
    for(var r=4;r<=10;r++) sheet.setRowHeight(r,33); sheet.setRowHeight(11,9); sheet.setRowHeight(12,35); sheet.setRowHeight(13,28);
    sheet.getRange('A1:H1').setBackground(burgundy).setFontColor(white).setFontSize(22).setFontWeight('bold').setHorizontalAlignment('left');
    sheet.getRange('A2:H2').setBackground(burgundy).setFontColor(cyan).setFontSize(11).setFontWeight('bold').setHorizontalAlignment('left');
    sheet.getRange('A3:H3').setBackground(cyan);

    sheet.getRange('A4:B10').setBackground(white).setBorder(true,true,true,true,false,false,line,SpreadsheetApp.BorderStyle.SOLID_MEDIUM).setWrap(true);
    sheet.getRange('A4:A10').setBackground(neutral).setFontColor(burgundy2).setFontWeight('bold');
    sheet.getRange('B4:B10').setFontWeight('bold').setFontSize(14);
    sheet.getRange('B6').setBackground(cyan).setFontSize(24).setFontWeight('bold').setFontColor(navy);

    sheet.getRange('D4:H10').setBackground(white).setBorder(true,true,true,true,false,false,line,SpreadsheetApp.BorderStyle.SOLID_MEDIUM).setWrap(true);
    sheet.getRange('D4:H4').setBackground(navy).setFontColor(white).setFontWeight('bold');
    for(var rr=5;rr<=10;rr++){
      sheet.getRange(rr,4,1,5).setBackground(rr%2===0?'#F8FBFD':white);
      sheet.getRange(rr,4).setFontWeight('bold').setHorizontalAlignment('center');
    }
    sheet.getRange('A12:H12').setBackground(burgundy).setFontColor(cyan).setFontWeight('bold').setFontSize(13)
      .setBorder(false,false,false,false,false,false);
    sheet.getRange('A13:H13').setBackground(navy).setFontColor(cyan).setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');
  }catch(e){KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_applyPremiumStyle_',e);throw e;}
  finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_applyPremiumStyle_',Date.now()-__kolIdsTraceStartedAt);}
}

/* ==================================================
 * CONTROL STATUS
 * ================================================== */

function KOL_IDS_CONTROL_writeControlStatus_(
  ss,
  status,
  message
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_writeControlStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET
    );


  if (!sheet) {

    return;

  }


  sheet
    .getRange(
      'B6'
    )
    .setValue(
      status
    );


  sheet
    .getRange(
      'B10'
    )
    .setValue(
      new Date()
    );


  sheet
    .getRange(
      'D11:H11'
    )
    .merge();


  sheet
    .getRange(
      'D11'
    )
    .setValue(
      message
    )
    .setWrap(
      true
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_writeControlStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_writeControlStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * METRICS
 * ================================================== */

function KOL_IDS_CONTROL_writeControlMetrics_(
  ss,
  portfolio,
  qa,
  elapsed
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_writeControlMetrics_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET
    );


  if (!sheet) {

    return;

  }


  if (portfolio) {

    sheet
      .getRange(
        'B7'
      )
      .setValue(
        portfolio.status ||
        '-'
      );


    sheet
      .getRange(
        'B8'
      )
      .setValue(
        portfolio.score !== undefined
          ? portfolio.score
          : '-'
      );

  }


  sheet
    .getRange(
      'B9'
    )
    .setValue(
      qa
        ? qa.status
        : '-'
    );


  sheet
    .getRange(
      'D13:H13'
    )
    .setValues([

      [
        'Runtime',
        elapsed.toFixed(2) + ' sec',
        'Portfolio',
        portfolio
          ? portfolio.selectedCount
          : '-',
        'QA'
      ]

    ]);


  sheet
    .getRange(
      'A4:H13'
    )
    .setVerticalAlignment(
      'middle'
    )
    .setWrap(
      true
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_writeControlMetrics_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_writeControlMetrics_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * LOG
 * ================================================== */

function KOL_IDS_CONTROL_logControl_(
  ss,
  type,
  message
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_logControl_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET
    );


  if (!sheet) {

    return;

  }


  const row =
    Math.max(
      sheet.getLastRow() + 1,
      14
    );


  sheet
    .getRange(
      row,
      1,
      1,
      4
    )
    .setValues([

      [
        new Date(),
        type,
        message,
        type === 'ERROR'
          ? 'ERROR'
          : 'OK'
      ]

    ]);


  sheet
    .getRange(
      row,
      1,
      1,
      4
    )
    .setWrap(
      true
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_logControl_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_logControl_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * OPEN CONTROL CENTER
 * ================================================== */

function KOL_IDS_CONTROL_openControlCenter() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_openControlCenter');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  const sheet =
    ss.getSheetByName(
      KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET
    );


  if (!sheet) {

    KOL_IDS_CONTROL_prepareControlCenter_(
      ss
    );

  }


  ss.setActiveSheet(
    ss.getSheetByName(
      KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET
    )
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_openControlCenter', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_openControlCenter', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM VALIDATION
 * ================================================== */

function KOL_IDS_CONTROL_validateSystem_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_validateSystem_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const requiredSheets = [

    '03_CAMPAIGN',

    '04_KOL_DATABASE',

    '07_KOL_DECISION'

  ];


  const missing = [];


  requiredSheets.forEach(
    name => {

      if (
        !ss.getSheetByName(
          name
        )
      ) {

        missing.push(
          name
        );

      }

    }
  );


  if (
    missing.length
  ) {

    return {

      ok: false,

      message:
        'Missing required sheet(s): ' +
        missing.join(', ')

    };

  }


  /*
   * Campaign data check.
   */

  const campaign =
    ss.getSheetByName(
      '03_CAMPAIGN'
    );


  if (
    campaign.getLastRow() < 2
  ) {

    return {

      ok: false,

      message:
        '03_CAMPAIGN contains no campaign data.'

    };

  }


  return {

    ok: true,

    message:
      'System validation passed.'

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_validateSystem_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_validateSystem_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * LEGACY CONTROL CENTER COMPATIBILITY SHIMS
 * Keep old QA/UI contracts executable without creating a second engine.
 * ================================================== */
function KOL_IDS_CONTROL_buildControlCenter() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_buildControlCenter');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  KOL_IDS_CONTROL_prepareControlCenter_(ss);
  return {success:true, action:'BUILD_CONTROL_CENTER', sheet:KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_buildControlCenter', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_buildControlCenter', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CONTROL_refreshControlCenter() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_refreshControlCenter');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  KOL_IDS_CONTROL_prepareControlCenter_(ss);
  return {success:true, action:'REFRESH_CONTROL_CENTER', sheet:KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_refreshControlCenter', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_refreshControlCenter', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CONTROL_updateControlCenter() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_updateControlCenter');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  KOL_IDS_CONTROL_prepareControlCenter_(ss);
  return {success:true, action:'UPDATE_CONTROL_CENTER', sheet:KOL_IDS_CONTROL_CONFIG.CONTROL_SHEET};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_updateControlCenter', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_updateControlCenter', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CONTROL_runControlCenter() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CONTROL_runControlCenter');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_CONTROL_RUN_FULL_INTELLIGENCE();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CONTROL_runControlCenter', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CONTROL_runControlCenter', Date.now() - __kolIdsTraceStartedAt);
  }
}
