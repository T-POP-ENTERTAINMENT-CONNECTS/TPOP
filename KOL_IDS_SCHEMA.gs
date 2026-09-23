
/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * KBIS V1 — SAFE SCHEMA AUTO REPAIR V2.1
 *
 * FILE:
 * KOL_IDS_SYSTEM_SchemaRepair.gs
 *
 * VERSION:
 * 2.1.0
 *
 * PURPOSE:
 * - Detect schema mismatch
 * - Detect duplicate headers
 * - Detect merged header cells
 * - Safely repair schema
 * - Preserve existing data by header
 * - Restore missing headers
 * - Reorder headers to KOL_IDS_SCHEMA_CONFIG
 * - Backup ONLY sheets that actually need repair
 * - Validate after repair
 *
 * IMPORTANT:
 * - Does NOT delete data rows.
 * - Does NOT define onOpen().
 * - Does NOT define KOL_IDS_SCHEMA_CONFIG.
 * - KOL_IDS_SCHEMA_CONFIG belongs to KOL_IDS_SYSTEM_Master.gs.
 *
 * SAFE PRINCIPLE:
 * Never guess.
 * Never silently destroy data.
 ****************************************************/


/* ==================================================
 * CONFIG
 * ================================================== */

const KOL_IDS_SCHEMA_REPAIR_CONFIG = {

  VERSION:
    '2.1.0',

  BACKUP_SHEET_PREFIX:
    '_KBIS_SCHEMA_BACKUP_',

  MAX_HEADER_SCAN_COLUMNS:
    200,

  CREATE_BACKUP:
    true,

  PRESERVE_DATA:
    true,

  UNMERGE_HEADER_ROW:
    true,

  DELETE_DUPLICATE_COLUMNS:
    false

};


/* ==================================================
 * MAIN
 * ================================================== */

function KOL_IDS_SCHEMA_autoRepairSchema() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_autoRepairSchema');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();

  if (!ss) {

    throw new Error(
      'KBIS: Active spreadsheet not found.'
    );

  }


  if (
    typeof KOL_IDS_SCHEMA_CONFIG ===
    'undefined'
  ) {

    throw new Error(
      'KOL_IDS_SCHEMA_CONFIG is not available. Check KOL_IDS_SYSTEM_Master.gs.'
    );

  }


  const lock =
    LockService.getScriptLock();


  if (
    !lock.tryLock(30000)
  ) {

    throw new Error(
      'KBIS: Schema repair is already running.'
    );

  }


  const report = {

    success:
      false,

    version:
      KOL_IDS_SCHEMA_REPAIR_CONFIG.VERSION,

    startedAt:
      new Date(),

    completedAt:
      null,

    sheetsChecked:
      0,

    sheetsRepaired:
      0,

    sheetsCreated:
      0,

    backupsCreated:
      0,

    duplicateHeaders:
      [],

    missingHeaders:
      [],

    mergedHeaders:
      [],

    repairedSheets:
      [],

    warnings:
      [],

    errors:
      [],

    backupSheets:
      []

  };


  try {

    Object.keys(
      KOL_IDS_SCHEMA_CONFIG
    ).forEach(
      sheetName => {

        report.sheetsChecked++;


        try {

          const result =
            KOL_IDS_SCHEMA_repairSchemaSheet_(
              ss,
              sheetName,
              KOL_IDS_SCHEMA_CONFIG[sheetName],
              report
            );


          if (
            result.created
          ) {

            report.sheetsCreated++;

          }


          if (
            result.repaired
          ) {

            report.sheetsRepaired++;

            report.repairedSheets.push(
              sheetName
            );

          }

        }
        catch (error) {

          report.errors.push(

            sheetName +
            ' → ' +
            KOL_IDS_SCHEMA_SCHEMA_errorMessage_(
              error
            )

          );

        }

      }
    );


    /* ----------------------------------------------
     * FINAL VALIDATION
     * ---------------------------------------------- */

    const validation =
      KOL_IDS_SCHEMA_validateSchema_();


    if (
      !validation.valid
    ) {

      report.errors =
        report.errors.concat(
          validation.errors
        );

    }


    report.success =
      report.errors.length === 0;


    report.completedAt =
      new Date();


    Logger.log(
      JSON.stringify(
        report,
        null,
        2
      )
    );


    KOL_IDS_SCHEMA_showSchemaRepairReport_(
      report
    );


    return report;

  }
  finally {

    lock.releaseLock();

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_autoRepairSchema', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_autoRepairSchema', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * REPAIR ONE SHEET
 * ================================================== */

function KOL_IDS_SCHEMA_repairSchemaSheet_(
  ss,
  sheetName,
  expectedHeaders,
  report
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_repairSchemaSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let sheet =
    ss.getSheetByName(
      sheetName
    );


  /* ----------------------------------------------
   * CREATE MISSING SHEET
   * ---------------------------------------------- */

  if (!sheet) {

    sheet =
      ss.insertSheet(
        sheetName
      );


    KOL_IDS_SCHEMA_prepareSchemaSheet_(
      sheet,
      expectedHeaders
    );


    return {

      sheetName:
        sheetName,

      created:
        true,

      repaired:
        true,

      action:
        'CREATED MISSING SHEET'

    };

  }


  /* ----------------------------------------------
   * READ CURRENT HEADERS
   * ---------------------------------------------- */

  const maxColumns =
    Math.min(

      sheet.getMaxColumns(),

      KOL_IDS_SCHEMA_REPAIR_CONFIG
        .MAX_HEADER_SCAN_COLUMNS

    );


  const currentHeaders =
    sheet
      .getRange(
        1,
        1,
        1,
        maxColumns
      )
      .getDisplayValues()[0]
      .map(
        KOL_IDS_SCHEMA_normalizeHeader_
      );


  /* ----------------------------------------------
   * CHECK MERGED HEADER
   * ---------------------------------------------- */

  const mergedRanges =
    sheet
      .getRange(
        1,
        1,
        1,
        maxColumns
      )
      .getMergedRanges();


  if (
    mergedRanges.length
  ) {

    report.mergedHeaders.push({

      sheetName:
        sheetName,

      ranges:
        mergedRanges.map(
          range =>
            range.getA1Notation()
        )

    });

  }


  /* ----------------------------------------------
   * DETERMINE WHETHER REPAIR IS NEEDED
   * ---------------------------------------------- */

  const duplicateInfo =
    KOL_IDS_SCHEMA_findDuplicateHeaders_(
      currentHeaders
    );


  const sourceMap =
    KOL_IDS_SCHEMA_buildSourceMap_(
      currentHeaders
    );


  const missingHeaders =
    expectedHeaders.filter(
      header =>

        sourceMap[
          KOL_IDS_SCHEMA_normalizeHeader_(
            header
          )
        ] === undefined

    );


  const headerMismatch =
    KOL_IDS_SCHEMA_headersMismatch_(
      currentHeaders,
      expectedHeaders
    );


  const needsMergeRepair =
    mergedRanges.length > 0;


  const needsRepair =
    duplicateInfo.length > 0 ||
    missingHeaders.length > 0 ||
    headerMismatch ||
    needsMergeRepair;


  /* ----------------------------------------------
   * NOTHING TO REPAIR
   * ---------------------------------------------- */

  if (
    !needsRepair
  ) {

    return {

      sheetName:
        sheetName,

      created:
        false,

      repaired:
        false,

      action:
        'ALREADY VALID'

    };

  }


  /* ----------------------------------------------
   * REPORT ISSUES
   * ---------------------------------------------- */

  if (
    duplicateInfo.length
  ) {

    report.duplicateHeaders.push({

      sheetName:
        sheetName,

      duplicates:
        duplicateInfo

    });

  }


  if (
    missingHeaders.length
  ) {

    report.missingHeaders.push({

      sheetName:
        sheetName,

      missing:
        missingHeaders

    });

  }


  /* ----------------------------------------------
   * BACKUP ONLY THIS SHEET
   * ---------------------------------------------- */

  if (
    KOL_IDS_SCHEMA_REPAIR_CONFIG
      .CREATE_BACKUP
  ) {

    const backup =
      KOL_IDS_SCHEMA_createBackup_(
        ss,
        sheet,
        sheetName
      );


    if (
      backup
    ) {

      report.backupsCreated++;

      report.backupSheets.push(
        backup.getName()
      );

    }

  }


  /* ----------------------------------------------
   * CAPTURE DATA BY HEADER
   * BEFORE ANY STRUCTURAL CHANGE
   * ---------------------------------------------- */

  const lastRow =
    sheet.getLastRow();


  const dataRows =
    lastRow >= 2
      ? lastRow - 1
      : 0;


  const dataByHeader =
    {};


  expectedHeaders.forEach(
    expectedHeader => {

      const normalized =
        KOL_IDS_SCHEMA_normalizeHeader_(
          expectedHeader
        );


      const sourceColumn =
        sourceMap[
          normalized
        ];


      if (
        sourceColumn &&
        dataRows > 0
      ) {

        dataByHeader[
          normalized
        ] =
          sheet
            .getRange(
              2,
              sourceColumn,
              dataRows,
              1
            )
            .getValues();

      }
      else {

        dataByHeader[
          normalized
        ] =
          [];

      }

    }
  );


  /* ----------------------------------------------
   * UNMERGE HEADER ROW ONLY
   * ---------------------------------------------- */

  if (
    mergedRanges.length &&
    KOL_IDS_SCHEMA_REPAIR_CONFIG
      .UNMERGE_HEADER_ROW
  ) {

    mergedRanges.forEach(
      range => {

        try {

          range.breakApart();

        }
        catch (error) {

          throw new Error(

            'Unable to unmerge header range ' +

            range.getA1Notation() +

            ': ' +

            KOL_IDS_SCHEMA_SCHEMA_errorMessage_(
              error
            )

          );

        }

      }
    );

  }


  /* ----------------------------------------------
   * ENSURE COLUMN COUNT
   * ---------------------------------------------- */

  if (
    sheet.getMaxColumns() <
    expectedHeaders.length
  ) {

    sheet.insertColumnsAfter(

      sheet.getMaxColumns(),

      expectedHeaders.length -
      sheet.getMaxColumns()

    );

  }


  /* ----------------------------------------------
   * WRITE CANONICAL HEADER
   * ---------------------------------------------- */

  sheet
    .getRange(
      1,
      1,
      1,
      expectedHeaders.length
    )
    .setValues([
      expectedHeaders
    ]);


  /* ----------------------------------------------
   * RESTORE DATA BY HEADER
   * ---------------------------------------------- */

  if (
    dataRows > 0 &&
    KOL_IDS_SCHEMA_REPAIR_CONFIG
      .PRESERVE_DATA
  ) {

    expectedHeaders.forEach(
      (
        header,
        index
      ) => {

        const normalized =
          KOL_IDS_SCHEMA_normalizeHeader_(
            header
          );


        const values =
          dataByHeader[
            normalized
          ];


        if (
          values &&
          values.length === dataRows
        ) {

          sheet
            .getRange(
              2,
              index + 1,
              dataRows,
              1
            )
            .setValues(
              values
            );

        }

      }
    );

  }


  /* ----------------------------------------------
   * FORMAT
   * ---------------------------------------------- */

  KOL_IDS_SCHEMA_prepareSchemaSheet_(
    sheet,
    expectedHeaders
  );


  /* ----------------------------------------------
   * POST REPAIR CHECK
   * ---------------------------------------------- */

  const finalHeaders =
    sheet
      .getRange(
        1,
        1,
        1,
        expectedHeaders.length
      )
      .getDisplayValues()[0]
      .map(
        KOL_IDS_SCHEMA_normalizeHeader_
      );


  const expectedNormalized =
    expectedHeaders.map(
      KOL_IDS_SCHEMA_normalizeHeader_
    );


  if (
    finalHeaders.join('|') !==
    expectedNormalized.join('|')
  ) {

    throw new Error(

      'Post-repair header validation failed.'

    );

  }


  return {

    sheetName:
      sheetName,

    created:
      false,

    repaired:
      true,

    action:
      'SAFE REPAIRED',

    duplicates:
      duplicateInfo,

    missing:
      missingHeaders,

    merged:
      mergedRanges.length

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_repairSchemaSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_repairSchemaSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SOURCE MAP
 * ================================================== */

function KOL_IDS_SCHEMA_buildSourceMap_(
  headers
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_buildSourceMap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const map =
    {};


  headers.forEach(
    (
      header,
      index
    ) => {

      if (
        !header
      ) {

        return;

      }


      if (
        map[header] ===
        undefined
      ) {

        map[header] =
          index + 1;

      }

    }
  );


  return map;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_buildSourceMap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_buildSourceMap_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * DUPLICATE HEADER DETECTION
 * ================================================== */

function KOL_IDS_SCHEMA_findDuplicateHeaders_(
  headers
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_findDuplicateHeaders_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const seen =
    {};

  const duplicates =
    [];


  headers.forEach(
    (
      header,
      index
    ) => {

      if (
        !header
      ) {

        return;

      }


      if (
        seen[header]
      ) {

        duplicates.push({

          header:
            header,

          firstColumn:
            seen[header],

          duplicateColumn:
            index + 1

        });

      }
      else {

        seen[header] =
          index + 1;

      }

    }
  );


  return duplicates;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_findDuplicateHeaders_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_findDuplicateHeaders_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * HEADER MISMATCH
 * ================================================== */

function KOL_IDS_SCHEMA_headersMismatch_(
  actual,
  expected
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_headersMismatch_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    actual.length <
    expected.length
  ) {

    return true;

  }


  for (
    let i = 0;
    i < expected.length;
    i++
  ) {

    if (

      KOL_IDS_SCHEMA_normalizeHeader_(
        actual[i]
      ) !==

      KOL_IDS_SCHEMA_normalizeHeader_(
        expected[i]
      )

    ) {

      return true;

    }

  }


  return false;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_headersMismatch_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_headersMismatch_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * VALIDATION
 * ================================================== */

function KOL_IDS_SCHEMA_validateSchema_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_validateSchema_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();

  const errors =
    [];


  if (
    typeof KOL_IDS_SCHEMA_CONFIG ===
    'undefined'
  ) {

    errors.push(
      'KOL_IDS_SCHEMA_CONFIG is undefined.'
    );


    return {

      valid:
        false,

      errors:
        errors

    };

  }


  Object.keys(
    KOL_IDS_SCHEMA_CONFIG
  ).forEach(
    sheetName => {

      const sheet =
        ss.getSheetByName(
          sheetName
        );


      if (
        !sheet
      ) {

        errors.push(

          sheetName +
          ' → MISSING SHEET'

        );

        return;

      }


      const expected =
        KOL_IDS_SCHEMA_CONFIG[
          sheetName
        ];

      // 12_PORTFOLIO is a dynamic intelligence canvas.
      // Its contents are rebuilt by the Portfolio Engine, so its
      // visual header rows must NOT be treated as the canonical
      // row-1 schema. The sheet itself remains required and must
      // retain the canonical minimum column capacity.
      if (sheetName === '12_PORTFOLIO') {
        if (sheet.getMaxColumns() < expected.length) {
          errors.push(
            sheetName +
            ' → NOT ENOUGH COLUMNS'
          );
        }
        return;
      }


      if (
        sheet.getMaxColumns() <
        expected.length
      ) {

        errors.push(

          sheetName +
          ' → NOT ENOUGH COLUMNS'

        );

        return;

      }


      const actual =
        sheet
          .getRange(
            1,
            1,
            1,
            expected.length
          )
          .getDisplayValues()[0];


      for (
        let i = 0;
        i < expected.length;
        i++
      ) {

        const actualHeader =
          KOL_IDS_SCHEMA_normalizeHeader_(
            actual[i]
          );


        const expectedHeader =
          KOL_IDS_SCHEMA_normalizeHeader_(
            expected[i]
          );


        if (
          actualHeader !==
          expectedHeader
        ) {

          errors.push(

            sheetName +
            ' → Column ' +
            (i + 1) +
            ' → Expected "' +
            expected[i] +
            '" → Found "' +
            (
              actual[i] ||
              ''
            ) +
            '"'

          );

        }

      }

    }
  );


  return {

    valid:
      errors.length === 0,

    errors:
      errors

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_validateSchema_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_validateSchema_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PUBLIC HEALTH CHECK
 * ================================================== */

function KOL_IDS_SCHEMA_checkSchemaHealth(options) {
  options = options || {};
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_checkSchemaHealth');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const validation =
    KOL_IDS_SCHEMA_validateSchema_();


  if (!options.suppressAlerts) {
    if (
      validation.valid
    ) {

      KOL_IDS_SCHEMA_safeAlert_(

        '✅ KBIS SCHEMA HEALTHY\n\n' +

        'All core sheet headers match KOL_IDS_SCHEMA_CONFIG.'

      );

    }
    else {

      KOL_IDS_SCHEMA_safeAlert_(

        '❌ KBIS SCHEMA ERROR\n\n' +

        validation.errors
          .slice(
            0,
            30
          )
          .join('\n')

      );

    }
  }


  return {

    valid:
      validation.valid,

    errors:
      validation.errors

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_checkSchemaHealth', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_checkSchemaHealth', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PREPARE SHEET
 * ================================================== */

function KOL_IDS_SCHEMA_prepareSchemaSheet_(
  sheet,
  headers
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_prepareSchemaSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    !sheet
  ) {

    throw new Error(
      'KBIS: Cannot prepare undefined sheet.'
    );

  }


  if (
    sheet.getMaxColumns() <
    headers.length
  ) {

    sheet.insertColumnsAfter(

      sheet.getMaxColumns(),

      headers.length -
      sheet.getMaxColumns()

    );

  }


  sheet.setFrozenRows(
    1
  );


  sheet
    .getRange(
      1,
      1,
      1,
      headers.length
    )
    .setFontWeight(
      'bold'
    )
    .setWrap(
      true
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_prepareSchemaSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_prepareSchemaSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * BACKUP
 * ================================================== */

function KOL_IDS_SCHEMA_createBackup_(
  ss,
  sourceSheet,
  sheetName
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_createBackup_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  try {

    const timestamp =
      Utilities.formatDate(

        new Date(),

        Session.getScriptTimeZone(),

        'yyyyMMdd_HHmmss'

      );


    let backupName =

      KOL_IDS_SCHEMA_REPAIR_CONFIG
        .BACKUP_SHEET_PREFIX +

      sheetName +
      '_' +
      timestamp;


    backupName =
      backupName.substring(
        0,
        100
      );


    const backup =
      sourceSheet.copyTo(
        ss
      );


    backup.setName(
      backupName
    );


    return backup;

  }
  catch (error) {

    /*
     * Backup failure is NOT silently ignored.
     */

    throw new Error(

      'Backup failed for ' +
      sheetName +
      ': ' +
      KOL_IDS_SCHEMA_SCHEMA_errorMessage_(
        error
      )

    );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_createBackup_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_createBackup_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * HEADER NORMALIZATION
 * ================================================== */

function KOL_IDS_SCHEMA_normalizeHeader_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_normalizeHeader_');
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
  )
    .replace(
      /\u00A0/g,
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    )
    .trim()
    .toLowerCase();


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_normalizeHeader_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_normalizeHeader_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * ERROR HELPER
 * ================================================== */

function KOL_IDS_SCHEMA_SCHEMA_errorMessage_(
  error
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_SCHEMA_errorMessage_');
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
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_SCHEMA_errorMessage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_SCHEMA_errorMessage_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * REPORT
 * ================================================== */

function KOL_IDS_SCHEMA_showSchemaRepairReport_(
  report
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_showSchemaRepairReport_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let message =

    report.success

      ? '✅ KBIS SAFE SCHEMA REPAIR V2.1 COMPLETE\n\n'

      : '⚠️ KBIS SAFE SCHEMA REPAIR V2.1 FINISHED WITH ERRORS\n\n';


  message +=

    'Sheets Checked: ' +
    report.sheetsChecked +
    '\n';


  message +=

    'Sheets Repaired: ' +
    report.sheetsRepaired +
    '\n';


  message +=

    'Sheets Created: ' +
    report.sheetsCreated +
    '\n';


  message +=

    'Backups Created: ' +
    report.backupsCreated +
    '\n';


  if (
    report.repairedSheets.length
  ) {

    message +=

      '\nRepaired:\n' +

      report.repairedSheets.join(
        '\n'
      );

  }


  if (
    report.mergedHeaders.length
  ) {

    message +=

      '\n\nMerged Headers Detected:\n';

    report.mergedHeaders
      .forEach(
        item => {

          message +=

            item.sheetName +
            ': ' +
            item.ranges.join(', ') +
            '\n';

        }
      );

  }


  if (
    report.warnings.length
  ) {

    message +=

      '\nWARNINGS:\n' +

      report.warnings
        .slice(
          0,
          20
        )
        .join('\n');

  }


  if (
    report.errors.length
  ) {

    message +=

      '\n\nERRORS:\n' +

      report.errors
        .slice(
          0,
          30
        )
        .join('\n');

  }


  KOL_IDS_SCHEMA_safeAlert_(
    message
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_showSchemaRepairReport_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_showSchemaRepairReport_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SAFE ALERT
 * ================================================== */

function KOL_IDS_SCHEMA_safeAlert_(
  message
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SCHEMA_safeAlert_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  try {

    SpreadsheetApp
      .getUi()
      .alert(
        String(
          message
        )
      );

  }
  catch (error) {

    Logger.log(
      String(
        message
      )
    );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SCHEMA_safeAlert_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SCHEMA_safeAlert_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/****************************************************
 * END OF KOL_IDS_SYSTEM_SchemaRepair.gs V2.1
 ****************************************************/
