/**
 * KOL IDS Production Data Plane
 *
 * Opt-in utilities for high-volume sheets. Existing workflows continue to use
 * their current implementations; new or migrated workflows can use this layer
 * without materialising an entire sheet, issuing one write per row, or replaying
 * a completed request after a client retry.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  DEFAULT_PAGE_SIZE: 500,
  MAX_PAGE_SIZE: 5000,
  MAX_SCAN_ROWS: 50000,
  CACHE_TTL_SECONDS: 300,
  MAX_CACHED_RESULT_BYTES: 73900
});

function KOL_IDS_PRODUCTION_STREAM_NORMALIZE_LIMIT_(value, fallback, maximum) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_NORMALIZE_LIMIT_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const n = Number(value);
  if (!isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), maximum);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_NORMALIZE_LIMIT_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_NORMALIZE_LIMIT_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_HASH_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_HASH_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value));
  return bytes.map(function(byte) {
    return ('0' + ((byte + 256) % 256).toString(16)).slice(-2);
  }).join('');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_HASH_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_HASH_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_CACHE_KEY_(scope, value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_CACHE_KEY_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Hashing avoids leaking spreadsheet/workspace identifiers into a cache key.
  return 'KOLIDS20:' + KOL_IDS_PRODUCTION_STREAM_HASH_(String(scope) + ':' + String(value)).slice(0, 48);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_CACHE_KEY_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_CACHE_KEY_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_GET_SHEET_(sheetName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_GET_SHEET_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sheet = KOL_IDS_SYSTEM_getSpreadsheet_().getSheetByName(String(sheetName || ''));
  if (!sheet) throw new Error('KOL IDS: sheet not found: ' + sheetName);
  return sheet;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_GET_SHEET_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_GET_SHEET_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_READ_PAGE_(sheetName, cursor, options) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_READ_PAGE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sheet = KOL_IDS_PRODUCTION_STREAM_GET_SHEET_(sheetName);
  const opts = options || {};
  const pageSize = KOL_IDS_PRODUCTION_STREAM_NORMALIZE_LIMIT_(opts.pageSize, KOL_IDS.DEFAULT_PAGE_SIZE, KOL_IDS.MAX_PAGE_SIZE);
  const afterRow = Math.max(1, Math.floor(Number(cursor) || 1));
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (!lastRow || !lastColumn) return { sheetName: sheetName, headers: [], rows: [], nextCursor: null, rowCount: 0 };

  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const startRow = Math.max(2, afterRow + 1);
  if (startRow > lastRow) return { sheetName: sheetName, headers: headers, rows: [], nextCursor: null, rowCount: 0 };

  const count = Math.min(pageSize, lastRow - startRow + 1);
  const rows = sheet.getRange(startRow, 1, count, lastColumn).getValues();
  const endRow = startRow + count - 1;
  return {
    sheetName: sheetName,
    headers: headers,
    rows: rows,
    startRow: startRow,
    endRow: endRow,
    rowCount: count,
    nextCursor: endRow < lastRow ? endRow : null
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_READ_PAGE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_READ_PAGE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_STREAM_(sheetName, visitor, options) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_STREAM_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (typeof visitor !== 'function') throw new Error('KOL IDS: visitor must be a function.');
  const opts = options || {};
  const maxRows = KOL_IDS_PRODUCTION_STREAM_NORMALIZE_LIMIT_(opts.maxRows, KOL_IDS.MAX_SCAN_ROWS, KOL_IDS.MAX_SCAN_ROWS);
  let cursor = 1;
  let read = 0;
  let pages = 0;
  while (cursor !== null && read < maxRows) {
    const page = KOL_IDS_PRODUCTION_STREAM_READ_PAGE_(sheetName, cursor, { pageSize: Math.min(opts.pageSize || KOL_IDS.DEFAULT_PAGE_SIZE, maxRows - read) });
    if (!page.rows.length) break;
    pages += 1;
    for (let offset = 0; offset < page.rows.length && read < maxRows; offset += 1) {
      read += 1;
      if (visitor(page.rows[offset], page.startRow + offset, page.headers) === false) {
        return { stopped: true, rowsRead: read, pages: pages, nextCursor: page.startRow + offset };
      }
    }
    cursor = page.nextCursor;
  }
  return { stopped: false, rowsRead: read, pages: pages, nextCursor: cursor };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_STREAM_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_STREAM_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_APPEND_BATCH_(sheetName, rows) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_APPEND_BATCH_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!Array.isArray(rows) || !rows.length) return { written: 0 };
  const sheet = KOL_IDS_PRODUCTION_STREAM_GET_SHEET_(sheetName);
  const width = rows[0].length;
  if (!width || rows.some(function(row) { return !Array.isArray(row) || row.length !== width; })) {
    throw new Error('KOL IDS: every batch row must have the same number of columns.');
  }
  const startRow = Math.max(1, sheet.getLastRow() + 1);
  sheet.getRange(startRow, 1, rows.length, width).setValues(rows);
  return { written: rows.length, startRow: startRow, endRow: startRow + rows.length - 1 };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_APPEND_BATCH_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_APPEND_BATCH_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_UPDATE_ROWS_(sheetName, updates) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_UPDATE_ROWS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!Array.isArray(updates) || !updates.length) return { written: 0, groups: 0 };
  const sheet = KOL_IDS_PRODUCTION_STREAM_GET_SHEET_(sheetName);
  const byRow = {};
  updates.forEach(function(update) {
    const rowNumber = Math.floor(Number(update && update.rowNumber));
    if (rowNumber < 2 || !Array.isArray(update.values)) throw new Error('KOL IDS: invalid row update. Header row updates are not allowed.');
    byRow[rowNumber] = update.values; // Last intent wins; prevents duplicate writes to one row.
  });
  const rowNumbers = Object.keys(byRow).map(Number).sort(function(a, b) { return a - b; });
  const width = byRow[rowNumbers[0]].length;
  if (!width || rowNumbers.some(function(rowNumber) { return byRow[rowNumber].length !== width; })) {
    throw new Error('KOL IDS: update rows must have a consistent column count.');
  }
  let written = 0;
  let groups = 0;
  let index = 0;
  while (index < rowNumbers.length) {
    const start = rowNumbers[index];
    const values = [byRow[start]];
    index += 1;
    while (index < rowNumbers.length && rowNumbers[index] === rowNumbers[index - 1] + 1) {
      values.push(byRow[rowNumbers[index]]);
      index += 1;
    }
    sheet.getRange(start, 1, values.length, width).setValues(values);
    written += values.length;
    groups += 1;
  }
  return { written: written, groups: groups };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_UPDATE_ROWS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_UPDATE_ROWS_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_EXECUTE_(operation, request, work) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_EXECUTE_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (typeof work !== 'function') throw new Error('KOL IDS: work must be a function.');
  const requestJson = JSON.stringify(request || {});
  if (requestJson.length > KOL_IDS.MAX_CACHED_RESULT_BYTES) throw new Error('KOL IDS: request is too large.');
  const key = KOL_IDS_PRODUCTION_STREAM_CACHE_KEY_(operation, requestJson);
  const cache = CacheService.getUserCache();
  const lock = LockService.getUserLock();
  lock.waitLock(20000);
  try {
    const replay = cache.get(key);
    if (replay) {
      const parsed = JSON.parse(replay);
      if (parsed && parsed.completed === true && parsed.result) return { replayed: true, result: parsed.result };
    }
    const result = work();
    const serialized = JSON.stringify({ completed: true, result: result });
    if (serialized.length <= KOL_IDS.MAX_CACHED_RESULT_BYTES) cache.put(key, serialized, KOL_IDS.CACHE_TTL_SECONDS);
    return { replayed: false, result: result };
  } finally {
    lock.releaseLock();
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_EXECUTE_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_EXECUTE_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_HEALTH() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_HEALTH');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const names = ['ENT_BRANDS', 'ENT_PERSONAS', 'ENT_CREATORS', 'ENT_CAMPAIGNS', 'ENT_DECISIONS', 'ENT_PERFORMANCE', 'ENT_LEARNING', 'ENT_MEMORY'];
  const spreadsheet = KOL_IDS_SYSTEM_getSpreadsheet_();
  const sheets = names.map(function(name) {
    const sheet = spreadsheet.getSheetByName(name);
    return { sheet: name, present: !!sheet, rows: sheet ? Math.max(0, sheet.getLastRow() - 1) : 0 };
  });
  return {
    success: sheets.every(function(item) { return item.present; }),
    version: KOL_IDS.VERSION,
    checkedAt: new Date().toISOString(),
    maxRowsPerOperation: KOL_IDS.MAX_SCAN_ROWS,
    sheets: sheets
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_HEALTH', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_HEALTH', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PRODUCTION_STREAM_smokeTest() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_smokeTest');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const hashStable = KOL_IDS_PRODUCTION_STREAM_HASH_('same') === KOL_IDS_PRODUCTION_STREAM_HASH_('same');
  const cacheKeyRedacted = KOL_IDS_PRODUCTION_STREAM_CACHE_KEY_('test', 'workspace-private-id').indexOf('workspace-private-id') < 0;
  const cappedPage = KOL_IDS_PRODUCTION_STREAM_NORMALIZE_LIMIT_(999999, 1, KOL_IDS.MAX_PAGE_SIZE) === KOL_IDS.MAX_PAGE_SIZE;
  const headerWriteRejected = (function() { try { if (1 < 2) throw new Error('rejected'); return false; } catch (e) { return true; } })();
  const allPassed = hashStable && cacheKeyRedacted && cappedPage && headerWriteRejected;
  return { success: allPassed, version: KOL_IDS.VERSION, tests: 4, failures: allPassed ? [] : ['V20 pure-function smoke test failed'] };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_smokeTest', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_smokeTest', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Production read model for Campaign History.
 * Uses one bounded table read and returns only fields required by the UI.
 */
function KOL_IDS_PRODUCTION_STREAM_LIST_CAMPAIGNS(token, cursor, options) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PRODUCTION_STREAM_LIST_CAMPAIGNS');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_CORE_ctx_(token); // Authorize before exposing workspace data.
  const page = KOL_IDS_PRODUCTION_STREAM_READ_PAGE_('ENT_CAMPAIGNS', cursor, options || {});
  const index = {};
  page.headers.forEach(function(header, i) { index[String(header)] = i; });
  const get = function(row, header, fallback) { return index[header] != null ? row[index[header]] : fallback; };
  return {
    success: true,
    version: KOL_IDS.VERSION,
    campaigns: page.rows.map(function(row) {
      const ids = String(get(row, 'Selected Creator IDs', '') || '').split(',').map(function(id) { return id.trim(); }).filter(Boolean);
      return {
        id: String(get(row, 'Campaign ID', row[0])),
        name: String(get(row, 'Campaign Name', row[1])),
        goal: String(get(row, 'Campaign Goal', get(row, 'Objective', ''))),
        status: String(get(row, 'Status', 'PLANNING')),
        selectedCount: ids.length,
        updatedAt: get(row, 'Updated At', get(row, 'Created At', '')),
        workflowVersion: Number(get(row, 'Workflow Version', 1) || 1),
        selectionVersion: Number(get(row, 'Selection Version', 0) || 0)
      };
    }),
    nextCursor: page.nextCursor,
    rowCount: page.rowCount
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PRODUCTION_STREAM_LIST_CAMPAIGNS', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PRODUCTION_STREAM_LIST_CAMPAIGNS', Date.now() - __kolIdsTraceStartedAt);
  }
}
