
/**
 * KOL IDS™ — Dashboard Sheet Layout Premium Patch
 * UI-only / layout-only. Does not modify business logic, formulas, schema,
 * Decision Engine, Performance Authority, or data values.
 *
 * Baseline:
 * - minimum font size: 10 pt
 * - standard column width: ~100 px
 * - wider columns for long text / IDs / narrative fields
 * - consistent wrapping and alignment
 */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_applyPremiumSheetLayout() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();

  sheets.forEach(function(sh) {
    if (!sh || sh.getMaxRows() < 1 || sh.getMaxColumns() < 1) return;

    var name = sh.getName();
    var rows = sh.getMaxRows();
    var cols = sh.getMaxColumns();

    // Universal minimum font size and clean baseline.
    sh.getRange(1, 1, rows, cols)
      .setFontSize(10)
      .setVerticalAlignment('middle');

    // Baseline width ~100 px.
    sh.setColumnWidths(1, cols, 100);

    // Headers: compact, readable, wrapped.
    sh.getRange(1, 1, Math.min(rows, 3), cols)
      .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
      .setVerticalAlignment('middle');

    // Dashboard/report sheets get more breathing room.
    var isDashboard = /DASHBOARD|CONTROL.?CENTER|EXECUTIVE|REPORT|PERFORMANCE/i.test(name);
    if (isDashboard) {
      sh.setRowHeight(1, 34);
      if (rows >= 2) sh.setRowHeight(2, 28);
      if (rows >= 3) sh.setRowHeight(3, 24);
      sh.getRange(1, 1, Math.min(rows, 3), cols)
        .setFontSize(10)
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    }

    // Give long/narrative columns additional room without making the whole
    // sheet excessively wide.
    var headerRows = Math.min(5, rows);
    var values = sh.getRange(1, 1, headerRows, cols).getDisplayValues();
    var longCols = {};
    for (var r = 0; r < values.length; r++) {
      for (var c = 0; c < cols; c++) {
        var h = String(values[r][c] || '').toLowerCase();
        if (/(name|title|description|summary|notes|reason|recommend|strategy|insight|comment|message|pain|goal|need|audience|content|objective|source|status)/.test(h)) {
          longCols[c + 1] = true;
        }
      }
    }
    Object.keys(longCols).forEach(function(c) {
      sh.setColumnWidth(Number(c), 180);
    });

    // IDs / dates stay compact.
    for (var c = 1; c <= cols; c++) {
      var top = '';
      for (var rr = 0; rr < headerRows; rr++) {
        top += ' ' + String(values[rr][c - 1] || '');
      }
      if (/(^|\\s)(id|date|time|at|code|currency|score|rate|ctr|count|rank)(\\s|$)/i.test(top)) {
        sh.setColumnWidth(c, 100);
      }
    }

    // Freeze the first row on data/report surfaces where appropriate.
    if (rows > 5 && !/SETTINGS|CONFIG|SCHEMA/i.test(name)) {
      sh.setFrozenRows(Math.max(sh.getFrozenRows(), 1));
    }
  });

  SpreadsheetApp.flush();
}


function KOL_IDS_applyPremiumSheetLayout() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_applyPremiumSheetLayout', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_applyPremiumSheetLayout, this, arguments);
}
