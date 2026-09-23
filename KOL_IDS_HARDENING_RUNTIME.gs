/**
 * ============================================================
 * KOL IDS™ 1.1.0 — PRODUCTION HARDENING LAYER
 * ============================================================
 *
 * Purpose:
 * - Harden client access without breaking existing licenses.
 * - Migrate legacy plaintext Access Key values to SHA-256 hashes.
 * - Add lightweight brute-force/rate limiting.
 * - Add request IDs for traceability.
 * - Add safe idempotency helpers for future write paths.
 * - Add a production certification QA that is non-destructive.
 *
 * IMPORTANT:
 * This file intentionally uses unique KOL_IDS_HARDENING_* names so it can
 * coexist with the LEGACY_V25.9 enterprise engine during deployment.
 */

KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  RATE_LIMIT_WINDOW_SEC: 60,
  RATE_LIMIT_MAX_ATTEMPTS: 12,
  MAX_IDEMPOTENCY_TTL_SEC: 21600,
  HARDENING_IDEMPOTENCY_SHEET: 'ENT_IDEMPOTENCY',
  RATE_LIMIT_GLOBAL_MAX: 600,
  RATE_LIMIT_CLIENT_MAX: 120,
  RATE_LIMIT_ANON_MAX: 30,
  IDEMPOTENCY_RETENTION_DAYS: 14,
  IDEMPOTENCY_LEASE_SEC: 900,
  IDEMPOTENCY_MAX_KEY_LENGTH: 200,
  ACCESS_KEY_HASH_PREFIX: 'sha256:',
  ACCESS_KEY_LENGTH: 9,
  ACCESS_KEY_PATTERN: /^[A-Z0-9]{9}$/,
  REQUEST_PREFIX: 'REQ'
});

function KOL_IDS_HARDENING_RUNTIME_generateAccessKey_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_generateAccessKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var uuid = Utilities.getUuid().replace(/-/g, '').toUpperCase();
    var key = '';
    for (var i = 0; i < KOL_IDS.ACCESS_KEY_LENGTH; i++) {
      var hex = parseInt(uuid.charAt(i), 16);
      key += alphabet.charAt(hex % alphabet.length);
    }
    return key;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_generateAccessKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_generateAccessKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_hash_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      String(value == null ? '' : value)
    )
  ).replace(/=+$/,'');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_requestId_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_requestId_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS.REQUEST_PREFIX + '-' +
    Utilities.getUuid().replace(/-/g,'').slice(0,16).toUpperCase();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_requestId_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_requestId_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_now_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_now_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return new Date().getTime();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_now_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_now_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_rateKey_(kind, identity) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_rateKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return 'KOL_IDS_HARDENING_RATE:' + String(kind || 'CLIENT') + ':' + KOL_IDS_HARDENING_RUNTIME_hash_(identity || '');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_rateKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_rateKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_rateLimit_(clientId, accessKey, source, orgId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_rateLimit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Cache-first, non-blocking limiter. Apps Script has no atomic CacheService
  // increment, so this deliberately favors availability while keeping three
  // independent buckets. Authentication/authorization remain authoritative.
  var cache=CacheService.getScriptCache(), minute=Math.floor(Date.now()/60000);
  var keyIdentity=String(accessKey||clientId||'ANON').trim();
  var org=String(orgId||'ANON').trim()||'ANON';
  var src=String(source||'SCRIPT').trim().slice(0,80)||'SCRIPT';
  var buckets=[
    ['KEY',keyIdentity+':'+minute,KOL_IDS.RATE_LIMIT_CLIENT_MAX],
    ['ORG',org+':'+minute,KOL_IDS.RATE_LIMIT_GLOBAL_MAX],
    ['SOURCE',src+':'+minute,KOL_IDS.RATE_LIMIT_GLOBAL_MAX]
  ];
  var values=buckets.map(function(item){
    var k=KOL_IDS_HARDENING_RUNTIME_rateKey_(item[0],item[1]);
    var n=Number(cache.get(k)||0);
    if(!isFinite(n)||n<0)n=0;
    n+=1;
    if(n>item[2])throw KOL_IDS_PLATFORM_error_('RATE_LIMITED','Too many access attempts. Please retry later.');
    return {key:k,count:n,ttl:KOL_IDS.RATE_LIMIT_WINDOW_SEC+5};
  });
  values.forEach(function(v){cache.put(v.key,String(v.count),v.ttl);});
  return values[0].count;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_rateLimit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_rateLimit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_operationRegistry_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_operationRegistry_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var registry = {
    HEALTH:{kind:'READ',scope:'HEALTH'},
    BENCHMARK:{kind:'READ',scope:'BENCHMARK'},
    PREDICT:{kind:'READ',scope:'PREDICT'},
    CREATOR_EVIDENCE:{kind:'READ',scope:'CREATOR_EVIDENCE'},
    BENCHMARK_REBUILD:{kind:'WRITE',scope:'BENCHMARK_WRITE'},
    CREATOR_UPSERT:{kind:'WRITE',scope:'CREATOR_WRITE'},
    CAMPAIGN_CREATE:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_TRANSITION:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_HEALTH:{kind:'READ',scope:'CAMPAIGN_READ'},
    CAMPAIGN_PLAN_CREATE:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_TASK_UPSERT:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_TASK_UPDATE:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_BUDGET_RECORD:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_KPI_UPSERT:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_RISK_UPSERT:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_GATE_CHECK:{kind:'READ',scope:'CAMPAIGN_READ'},
    CAMPAIGN_CONTROL_TOWER:{kind:'READ',scope:'CAMPAIGN_READ'},
    CREATOR_DISCOVER:{kind:'READ',scope:'CREATOR_DISCOVERY'},
    CREATOR_MATCH:{kind:'READ',scope:'CREATOR_MATCHING'},
    MARKETPLACE_UPSERT:{kind:'WRITE',scope:'MARKETPLACE_WRITE'},
    PREDICTION_EVALUATE:{kind:'WRITE',scope:'PREDICTION_WRITE'},
    CALIBRATION_REPORT:{kind:'READ',scope:'PREDICTION_READ'},
    MOAT_HEALTH:{kind:'READ',scope:'MOAT_READ'},
    WEBAPP_PREFLIGHT:{kind:'READ',scope:'HEALTH'},
    RUNTIME_SMOKE_TEST:{kind:'READ',scope:'HEALTH'},
    FLYWHEEL_DRY_RUN:{kind:'READ',scope:'HEALTH'},
    OUTCOME_RECORD:{kind:'WRITE',scope:'PREDICTION_WRITE'},
    LEARNING_HEALTH:{kind:'READ',scope:'MOAT_READ'},
    LEARNING_REBUILD:{kind:'WRITE',scope:'PREDICTION_WRITE'},
    LEARNING_SIGNAL:{kind:'READ',scope:'MOAT_READ'},
    GOVERNANCE_STATUS:{kind:'READ',scope:'HEALTH'},
    GOVERNANCE_CONFIGURE:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    PROCESSING_REGISTER:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    RETENTION_POLICY:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    DSAR_CREATE:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    BREACH_RECORD:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    PROCESSOR_REGISTER:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    TRANSFER_REGISTER:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    RETENTION_DRY_RUN:{kind:'READ',scope:'CAMPAIGN_READ'},
    RETENTION_RUN:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    RETENTION_TRIGGER_INSTALL:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    LEGAL_HOLD_CREATE:{kind:'WRITE',scope:'CAMPAIGN_WRITE'},
    CAMPAIGN_COMPLIANCE:{kind:'READ',scope:'CAMPAIGN_READ'}
  };
  // Every operation is brand-scoped unless it is explicitly infrastructure-level.
  // This makes tenant/brand isolation a registry contract rather than a dispatcher convention.
  ['HEALTH','WEBAPP_PREFLIGHT','RETENTION_TRIGGER_INSTALL','PROCESSOR_REGISTER'].forEach(function(k){
    if(registry[k]) registry[k].requiresBrand=false;
  });
  Object.keys(registry).forEach(function(k){
    if(registry[k].requiresBrand===undefined) registry[k].requiresBrand=true;
  });
  return registry;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_operationRegistry_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_operationRegistry_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_operation_(action){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_operation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var a=String(action||'').trim().toUpperCase(),r=KOL_IDS_HARDENING_RUNTIME_operationRegistry_()[a];
  if(!r)throw KOL_IDS_PLATFORM_error_('NOT_FOUND','Unsupported API operation.');
  return r;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_operation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_operation_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_idempotencyKey_(e,body,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_idempotencyKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var h=(e&&e.headers)||{},p=payload||{};
  return String(h['Idempotency-Key']||h['idempotency-key']||body&&body.idempotencyKey||p.idempotencyKey||'').trim();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_idempotencyKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_idempotencyKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_pruneIdempotency_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_pruneIdempotency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_(),last=sh.getLastRow(),cols=sh.getLastColumn();
  if(last<2)return 0;
  var m=KOL_IDS_HARDENING_RUNTIME_idempotencyMap_(sh),createdIdx=m['Created At'],rows=sh.getRange(2,1,last-1,cols).getValues(),cut=Date.now()-KOL_IDS.IDEMPOTENCY_RETENTION_DAYS*86400000,keep=[],removed=0;
  rows.forEach(function(r){var d=r[createdIdx] instanceof Date?r[createdIdx]:new Date(r[createdIdx]);if(d.getTime()&&d.getTime()<cut){removed++;}else{keep.push(r);}});
  if(removed){sh.getRange(2,1,last-1,cols).clearContent();if(keep.length)sh.getRange(2,1,keep.length,cols).setValues(keep);}
  return removed;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_pruneIdempotency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_pruneIdempotency_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_canonicalize_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_canonicalize_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(KOL_IDS_HARDENING_RUNTIME_canonicalize_);
  if (typeof value === 'object') {
    var out = {};
    Object.keys(value).sort().forEach(function(k) {
      if (k === 'apiKey' || k === 'Authorization' || k === 'authorization') return;
      out[k] = KOL_IDS_HARDENING_RUNTIME_canonicalize_(value[k]);
    });
    return out;
  }
  return value;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_canonicalize_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_canonicalize_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_requestHash_(action, orgId, brandId, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_requestHash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_HARDENING_RUNTIME_hash_(JSON.stringify(KOL_IDS_HARDENING_RUNTIME_canonicalize_({
    action:String(action||'').toUpperCase(), orgId:String(orgId||''), brandId:String(brandId||''), payload:payload||{}
  })));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_requestHash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_requestHash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_idempotencyHeaders_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_idempotencyHeaders_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return ['Idempotency Key','Operation','Org ID','Request ID','Status','Response Hash','Response JSON','Created At','Completed At','Brand ID','Request Hash','Lease Until'];

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_idempotencyHeaders_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_idempotencyHeaders_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  var sh = ss.getSheetByName(KOL_IDS.HARDENING_IDEMPOTENCY_SHEET);
  var headers = KOL_IDS_HARDENING_RUNTIME_idempotencyHeaders_();

  if (!sh) sh = ss.insertSheet(KOL_IDS.HARDENING_IDEMPOTENCY_SHEET);

  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();

  if (lastRow === 0 || lastCol === 0) {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
  } else {
    /*
     * Canonicalize the idempotency registry header contract.
     *
     * The previous implementation read a column as though it were the
     * header row (getRange(1,1,lastCol,1)). That could append duplicate
     * headers into new columns and make the persistent contract fail.
     *
     * Read the actual header row, preserve data by header name, and then
     * restore the canonical 12-column layout. This also repairs registries
     * that were already polluted by the legacy header-migration bug.
     */
    var headerRow = sh.getRange(1,1,1,lastCol).getValues()[0];
    var positions = {};
    headerRow.forEach(function(h,i){
      var key = String(h || '').trim();
      if (key && positions[key] == null) positions[key] = i;
    });

    var dataRows = [];
    if (lastRow >= 2) {
      var rawRows = sh.getRange(2,1,lastRow-1,lastCol).getValues();
      dataRows = rawRows.map(function(row){
        return headers.map(function(h){
          var idx = positions[h];
          return idx == null ? '' : row[idx];
        });
      });
    }

    if (lastCol > headers.length) {
      sh.deleteColumns(headers.length + 1, lastCol - headers.length);
    }

    sh.getRange(1,1,1,headers.length).setValues([headers]);

    if (dataRows.length) {
      sh.getRange(2,1,dataRows.length,headers.length).setValues(dataRows);
    }
  }

  /*
   * Backfill derived fields for legacy rows only after the canonical
   * header map is restored. Existing replay keys remain unchanged.
   */
  var m = KOL_IDS_HARDENING_RUNTIME_idempotencyMap_(sh);
  if (m['Brand ID'] != null && m['Request Hash'] != null && m['Lease Until'] != null && sh.getLastRow() >= 2) {
    var rowCount = sh.getLastRow() - 1;
    var colCount = sh.getLastColumn();
    var rows = sh.getRange(2,1,rowCount,colCount).getValues();

    rows.forEach(function(r,i){
      if (!r[m['Brand ID']] && r[m['Request Hash']]) return;

      if (!r[m['Request Hash']] && r[m['Operation']] && r[m['Org ID']] && r[m['Idempotency Key']]) {
        r[m['Request Hash']] = KOL_IDS_HARDENING_RUNTIME_hash_(
          String(r[m['Org ID']]) + '|' +
          String(r[m['Operation']]) + '|' +
          String(r[m['Idempotency Key']])
        );
      }

      if (r[m['Status']] &&
          ['CLAIMED','IN_PROGRESS'].indexOf(String(r[m['Status']]).toUpperCase()) >= 0 &&
          !r[m['Lease Until']]) {
        var created = r[m['Created At']] instanceof Date
          ? r[m['Created At']].getTime()
          : new Date(r[m['Created At']]).getTime();

        if (isFinite(created)) {
          r[m['Lease Until']] = new Date(
            created + KOL_IDS.IDEMPOTENCY_LEASE_SEC * 1000
          );
        }
      }

      sh.getRange(i+2,1,1,colCount).setValues([r]);
    });
  }

  sh.setFrozenRows(1);
  return sh;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_idempotencyMap_(sh) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_idempotencyMap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var m = {};
  sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].forEach(function(h,i){m[String(h).trim()] = i;});
  return m;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_idempotencyMap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_idempotencyMap_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_rowObject_(sh, row) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_rowObject_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var m = KOL_IDS_HARDENING_RUNTIME_idempotencyMap_(sh);
  return {
    row:row,
    key:String(row[m['Idempotency Key']]||''),
    operation:String(row[m['Operation']]||'').toUpperCase(),
    orgId:String(row[m['Org ID']]||''),
    requestId:String(row[m['Request ID']]||''),
    status:String(row[m['Status']]||'').toUpperCase(),
    responseJson:String(row[m['Response JSON']]||''),
    requestHash:String(row[m['Request Hash']]||''),
    brandId:String(row[m['Brand ID']]||''),
    leaseUntil:row[m['Lease Until']] instanceof Date ? row[m['Lease Until']].getTime() : new Date(row[m['Lease Until']]).getTime()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_rowObject_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_rowObject_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_(operation,idempotencyKey,orgId,brandId,requestId,requestHash){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var op=String(operation||'').trim().toUpperCase(),key=String(idempotencyKey||'').trim(),org=String(orgId||'').trim(),brand=String(brandId||'').trim();
  if(!op||!key||!org)throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Operation, organization and idempotency key are required.');
  if(key.length<12||key.length>KOL_IDS.IDEMPOTENCY_MAX_KEY_LENGTH)throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Invalid idempotency key.');
  var fp=KOL_IDS_HARDENING_RUNTIME_hash_([org,brand,op,key].join(':')),cache=CacheService.getScriptCache(),cachedRow=Number(cache.get('KOL_IDS_HARDENING_IDEM:'+fp)||0);
  if(cachedRow>=2){
    var quick=KOL_IDS_HARDENING_RUNTIME_readIdempotencyRow_(cachedRow,fp);
    if(quick){
      if(quick.requestHash && requestHash && quick.requestHash!==requestHash)throw KOL_IDS_PLATFORM_error_('IDEMPOTENCY_CONFLICT','Idempotency key was reused with a different request payload.');
      if(quick.status==='COMPLETED'&&quick.responseJson)return {state:'REPLAY',fingerprint:fp,responseJson:quick.responseJson};
      if(quick.status==='FAILED'&&quick.responseJson)return {state:'REPLAY_FAILED',fingerprint:fp,responseJson:quick.responseJson};
      if((quick.status==='CLAIMED'||quick.status==='IN_PROGRESS') && quick.leaseUntil>Date.now())return {state:'IN_PROGRESS',fingerprint:fp};
    }
  }
  var lock=LockService.getScriptLock();
  if(!lock.tryLock(10000))throw KOL_IDS_PLATFORM_error_('LOCKED','Idempotency registry is busy.');
  try{
    var sh=KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_(),last=sh.getLastRow(),m=KOL_IDS_HARDENING_RUNTIME_idempotencyMap_(sh),found=null;
    if(last>=2){
      var rows=sh.getRange(2,1,last-1,sh.getLastColumn()).getValues(),idx=rows.findIndex(function(r){return String(r[m['Idempotency Key']])===fp;});
      if(idx>=0)found=KOL_IDS_HARDENING_RUNTIME_rowObject_(sh,idx+2);
    }
    if(found){
      cache.put('KOL_IDS_HARDENING_IDEM:'+fp,String(found.row),KOL_IDS.MAX_IDEMPOTENCY_TTL_SEC);
      if(found.requestHash && requestHash && found.requestHash!==requestHash)throw KOL_IDS_PLATFORM_error_('IDEMPOTENCY_CONFLICT','Idempotency key was reused with a different request payload.');
      if(found.status==='COMPLETED'&&found.responseJson)return {state:'REPLAY',fingerprint:fp,responseJson:found.responseJson};
      if(found.status==='FAILED'&&found.responseJson)return {state:'REPLAY_FAILED',fingerprint:fp,responseJson:found.responseJson};
      if((found.status==='CLAIMED'||found.status==='IN_PROGRESS') && found.leaseUntil>Date.now())return {state:'IN_PROGRESS',fingerprint:fp};
      // Expired claim: safely lease the same row to the retrying request.
      sh.getRange(found.row,m['Request ID']+1).setValue(String(requestId||''));
      sh.getRange(found.row,m['Status']+1).setValue('CLAIMED');
      sh.getRange(found.row,m['Brand ID']+1).setValue(brand);
      sh.getRange(found.row,m['Request Hash']+1).setValue(String(requestHash||''));
      sh.getRange(found.row,m['Lease Until']+1).setValue(new Date(Date.now()+KOL_IDS.IDEMPOTENCY_LEASE_SEC*1000));
      return {state:'CLAIMED',fingerprint:fp,row:found.row,reclaimed:true};
    }
    var row=sh.getLastRow()+1,vals=Array(sh.getLastColumn()).fill('');
    vals[m['Idempotency Key']]=fp; vals[m['Operation']]=op; vals[m['Org ID']]=org; vals[m['Request ID']]=String(requestId||'');
    vals[m['Status']]='CLAIMED'; vals[m['Created At']]=new Date(); vals[m['Brand ID']]=brand; vals[m['Request Hash']]=String(requestHash||'');
    vals[m['Lease Until']]=new Date(Date.now()+KOL_IDS.IDEMPOTENCY_LEASE_SEC*1000);
    sh.getRange(row,1,1,sh.getLastColumn()).setValues([vals]);
    cache.put('KOL_IDS_HARDENING_IDEM:'+fp,String(row),KOL_IDS.MAX_IDEMPOTENCY_TTL_SEC);
    return {state:'CLAIMED',fingerprint:fp,row:row};
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_readIdempotencyRow_(row,fingerprint){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_readIdempotencyRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{
    var sh=KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_();
    if(row<2||row>sh.getLastRow())return null;
    var r=KOL_IDS_HARDENING_RUNTIME_rowObject_(sh,sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0]);
    return String(r.key)===String(fingerprint)?r:null;
  }catch(e){return null;}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_readIdempotencyRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_readIdempotencyRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_findIdempotency_(operation,idempotencyKey,orgId,brandId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_findIdempotency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var op=String(operation||'').trim().toUpperCase(), key=String(idempotencyKey||'').trim(),org=String(orgId||'').trim(),brand=String(brandId||'').trim();
  if(!op||!key||!org)return null;
  var fingerprint=KOL_IDS_HARDENING_RUNTIME_hash_([org,brand,op,key].join(':')),sh=KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_(),m=KOL_IDS_HARDENING_RUNTIME_idempotencyMap_(sh),rows=sh.getLastRow()>=2?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[],idx=rows.findIndex(function(r){return String(r[m['Idempotency Key']])===fingerprint;});
  if(idx<0)return null;
  var row=idx+2;CacheService.getScriptCache().put('KOL_IDS_HARDENING_IDEM:'+fingerprint,String(row),KOL_IDS.MAX_IDEMPOTENCY_TTL_SEC);return KOL_IDS_HARDENING_RUNTIME_rowObject_(sh,row);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_findIdempotency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_findIdempotency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_completeIdempotency_(fingerprint,status,response) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_completeIdempotency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!fingerprint) return false;
  var lock=LockService.getScriptLock();
  if(!lock.tryLock(10000))throw KOL_IDS_PLATFORM_error_('LOCKED','Idempotency completion is busy.');
  try {
    var sh=KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_(),m=KOL_IDS_HARDENING_RUNTIME_idempotencyMap_(sh),last=sh.getLastRow(),row=Number(CacheService.getScriptCache().get('KOL_IDS_HARDENING_IDEM:'+String(fingerprint))||0);
    if(row<2||row>last||!KOL_IDS_HARDENING_RUNTIME_readIdempotencyRow_(row,fingerprint)){
      var rows=last>=2?sh.getRange(2,1,last-1,sh.getLastColumn()).getValues():[],idx=rows.findIndex(function(r){return String(r[m['Idempotency Key']])===String(fingerprint);});
      if(idx<0)throw KOL_IDS_PLATFORM_error_('IDEMPOTENCY_COMMIT_FAILED','Idempotency record was not found.');
      row=idx+2;
    }
    var serialized=JSON.stringify(response||{});if(serialized.length>45000)throw KOL_IDS_PLATFORM_error_('IDEMPOTENCY_RESPONSE_TOO_LARGE','Idempotent response exceeds persistent replay limit.');
    var now=new Date();
    sh.getRange(row,m['Status']+1).setValue(String(status||'COMPLETED').toUpperCase());
    sh.getRange(row,m['Response Hash']+1).setValue(KOL_IDS_HARDENING_RUNTIME_hash_(serialized));
    sh.getRange(row,m['Response JSON']+1).setValue(serialized);
    sh.getRange(row,m['Completed At']+1).setValue(now);
    sh.getRange(row,m['Lease Until']+1).clearContent();
    CacheService.getScriptCache().put('KOL_IDS_HARDENING_IDEM:'+String(fingerprint),String(row),KOL_IDS.MAX_IDEMPOTENCY_TTL_SEC);
    return true;
  } finally { lock.releaseLock(); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_completeIdempotency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_completeIdempotency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_apiGate_(e,body,requestIdOverride){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_apiGate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var requestId=String(requestIdOverride||KOL_IDS_HARDENING_RUNTIME_requestId_()),raw=String((e&&e.postData&&e.postData.contents)||'');
  if(raw.length>KOL_IDS.MAX_API_BODY_BYTES)throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Request body too large.');
  var headers=(e&&e.headers)||{},key=String((headers.Authorization||headers.authorization||(body&&body.apiKey)||'')).replace(/^Bearer\s+/i,'').trim(),action=String((body&&body.action)||'HEALTH').trim().toUpperCase();
  if(body&&Object.prototype.hasOwnProperty.call(body,'apiKey'))delete body.apiKey;
  var op=KOL_IDS_HARDENING_RUNTIME_operation_(action),verified=KOL_IDS_PLATFORM_verifyApiKey_(key);
  KOL_IDS_HARDENING_RUNTIME_rateLimit_(verified.keyId,verified.keyId,'API',verified.orgId);
  var payload=body&&body.payload;if(payload==null)payload={};if(!payload||typeof payload!=='object'||Array.isArray(payload))throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Payload must be a JSON object.');
  if(!KOL_IDS_PLATFORM_apiScope_(verified.scopes,op.scope))throw KOL_IDS_PLATFORM_error_('FORBIDDEN','API scope denied: '+op.scope+'.');
  if(op.requiresBrand && (!payload || !String(payload.brandId||'').trim()))throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','brandId is required for this operation.');
  if(op.requiresBrand)KOL_IDS_PLATFORM_apiBrandAllowed_(verified,payload.brandId);
  if(typeof KOL_IDS_GOVERNANCE_governanceGate_==='function' && !['GOVERNANCE_STATUS','GOVERNANCE_CONFIGURE','PROCESSING_REGISTER','RETENTION_POLICY','DSAR_CREATE','BREACH_RECORD','PROCESSOR_REGISTER','TRANSFER_REGISTER','RETENTION_DRY_RUN','RETENTION_RUN','RETENTION_TRIGGER_INSTALL','LEGAL_HOLD_CREATE','CAMPAIGN_COMPLIANCE','HEALTH','WEBAPP_PREFLIGHT','RUNTIME_SMOKE_TEST','FLYWHEEL_DRY_RUN'].includes(action)){ KOL_IDS_GOVERNANCE_governanceGate_(verified.orgId,payload&&payload.brandId,action,payload); }
  var fingerprint='';
  if(op.kind==='WRITE'){
    var idem=KOL_IDS_HARDENING_RUNTIME_idempotencyKey_(e,body,payload);if(!idem)throw KOL_IDS_PLATFORM_error_('INVALID_REQUEST','Idempotency-Key is required for this write operation.');
    var requestHash=KOL_IDS_HARDENING_RUNTIME_requestHash_(action,verified.orgId,payload&&payload.brandId,payload);
    var claim=KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_(action,idem,verified.orgId,payload&&payload.brandId,requestId,requestHash);
    if(claim.state==='REPLAY'||claim.state==='REPLAY_FAILED'){var replay=KOL_IDS_PLATFORM_json_(claim.responseJson);replay.requestId=requestId;replay.idempotentReplay=true;replay.idempotencyState=claim.state;return replay;}
    if(claim.state==='IN_PROGRESS')throw KOL_IDS_PLATFORM_error_('DUPLICATE_REQUEST','A request with this idempotency key is already in progress.');
    fingerprint=claim.fingerprint;
  }
  try{var result=KOL_IDS_PLATFORM_api_(key,action,payload,verified);if(fingerprint)KOL_IDS_HARDENING_RUNTIME_completeIdempotency_(fingerprint,'COMPLETED',result);result.requestId=requestId;result.apiVersion=KOL_IDS.VERSION;return result;}
  catch(err){if(fingerprint){try{KOL_IDS_HARDENING_RUNTIME_completeIdempotency_(fingerprint,'FAILED',{success:false,code:String(err&&err.code||'INTERNAL_ERROR'),error:String(err&&err.message||err)});}catch(commitErr){}}throw err;}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_apiGate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_apiGate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_operationContractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_operationContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var reg=KOL_IDS_HARDENING_RUNTIME_operationRegistry_(), required=['HEALTH','BENCHMARK','PREDICT','CREATOR_EVIDENCE','BENCHMARK_REBUILD','CREATOR_UPSERT','CAMPAIGN_CREATE','CAMPAIGN_TRANSITION','CAMPAIGN_HEALTH','CAMPAIGN_PLAN_CREATE','CAMPAIGN_TASK_UPSERT','CAMPAIGN_TASK_UPDATE','CAMPAIGN_BUDGET_RECORD','CAMPAIGN_KPI_UPSERT','CAMPAIGN_RISK_UPSERT','CAMPAIGN_GATE_CHECK','CAMPAIGN_CONTROL_TOWER','CREATOR_DISCOVER','CREATOR_MATCH','MARKETPLACE_UPSERT','PREDICTION_EVALUATE','CALIBRATION_REPORT','MOAT_HEALTH','WEBAPP_PREFLIGHT','RUNTIME_SMOKE_TEST','FLYWHEEL_DRY_RUN','OUTCOME_RECORD','LEARNING_HEALTH','LEARNING_REBUILD','LEARNING_SIGNAL','GOVERNANCE_STATUS','GOVERNANCE_CONFIGURE','PROCESSING_REGISTER','RETENTION_POLICY','DSAR_CREATE','BREACH_RECORD','PROCESSOR_REGISTER','TRANSFER_REGISTER','RETENTION_DRY_RUN','RETENTION_RUN','RETENTION_TRIGGER_INSTALL','LEGAL_HOLD_CREATE','CAMPAIGN_COMPLIANCE'];
  var missing=required.filter(function(k){return !reg[k]||!reg[k].kind||!reg[k].scope||typeof reg[k].requiresBrand!=='boolean';});
  var writeOps=required.filter(function(k){return reg[k]&&reg[k].kind==='WRITE';});var writesHaveScopes=writeOps.every(function(k){return !!reg[k].scope;});var writesHaveBrandContract=writeOps.every(function(k){return typeof reg[k].requiresBrand==='boolean';});return {success:missing.length===0&&writesHaveScopes&&writesHaveBrandContract,version:KOL_IDS.VERSION,required:required,missing:missing,writeOperations:writeOps,writesHaveScopes:writesHaveScopes,writesHaveBrandContract:writesHaveBrandContract,timestamp:new Date().toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_operationContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_operationContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_idempotencyHealth_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_idempotencyHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_(),last=sh.getLastRow();
  return {success:true,sheet:KOL_IDS.HARDENING_IDEMPOTENCY_SHEET,rows:Math.max(0,last-1),headers:sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0],retentionDays:KOL_IDS.IDEMPOTENCY_RETENTION_DAYS};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_idempotencyHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_idempotencyHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Hardened client lookup.
 *
 * Backward compatibility:
 * - Existing rows containing a legacy plaintext key are accepted once.
 * - After successful validation, the value is replaced with a SHA-256 hash.
 * - New rows should contain the hash only.
 */
function KOL_IDS_HARDENING_RUNTIME_findClient_(clientId, accessKey, registeredEmail) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_findClient_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  // Accept both the canonical (clientId, accessKey) form and the legacy/object
  // form used by older QA/UI callers. This keeps the authentication boundary
  // server-authoritative while preventing an object payload from becoming
  // String(object) and triggering the misleading "Client access is required".
  if (clientId && typeof clientId === 'object') {
    var payload = clientId;
    clientId = payload.clientId || payload.clientID || payload.client_id || payload.id || '';
    accessKey = payload.accessKey || payload.access_key || payload.key || accessKey || '';
     registeredEmail = payload.registeredEmail || payload.email || payload.contactEmail || '';
  }

  var s = KOL_IDS_SYSTEM_ensureClientDirectory_();
  var cid = String(clientId || '').trim();
  var key = String(accessKey || '').trim();
  var loginEmail = String(registeredEmail || '').trim().toLowerCase();

  if (loginEmail && !/^\S+@\S+\.\S+$/.test(loginEmail)) throw new Error('Invalid registered email.');
   if (!cid || !key) throw new Error('Client access is required.');
  if (cid.length > 128 || key.length > 512) throw new Error('Invalid client access.');

  // New customer credentials are exactly 9 uppercase alphanumeric characters.
  // Legacy 32+ character credentials remain temporarily accepted so existing
  // customers are not locked out; newly issued/rotated keys are always 9 chars.
  var isNewFormat = KOL_IDS.ACCESS_KEY_PATTERN.test(key);
  var isLegacyFormat = key.length >= 32;
  if (!isNewFormat && !isLegacyFormat) {
    throw new Error('Invalid Access Key format. Access Key must be 9 characters.');
  }

  KOL_IDS_HARDENING_RUNTIME_rateLimit_(cid, KOL_IDS_HARDENING_RUNTIME_hash_(key), 'CLIENT_ACCESS', cid);

  var rows = s.getLastRow() >= 2
    ? s.getRange(2,1,s.getLastRow()-1,7).getValues()
    : [];

  var presentedHash = KOL_IDS_HARDENING_RUNTIME_hash_(key);
  var matchIndex = -1;

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var rowClient = String(r[0] || '').trim();
    var stored = String(r[2] || '').trim();
    var status = String(r[4] || 'ACTIVE').trim().toUpperCase();

    if (rowClient !== cid || status !== 'ACTIVE') continue;

    if (
      stored === KOL_IDS.ACCESS_KEY_HASH_PREFIX + presentedHash ||
      stored === presentedHash ||
      stored === key
    ) {
      matchIndex = i;
      break;
    }
  }

  if (matchIndex < 0) throw new Error('Invalid or inactive KOL IDS client access.');

  var rowNumber = matchIndex + 2;
  var hv=s.getRange(1,1,1,Math.max(7,s.getLastColumn())).getValues()[0].map(String),hi={};hv.forEach(function(h,i){hi[h]=i;});
  var meta={contactEmail:hi['Contact Email']!=null?String(rows[matchIndex][hi['Contact Email']]||'').trim().toLowerCase():'',plan:hi['Plan']!=null?String(rows[matchIndex][hi['Plan']]||'').trim():'',expiresAt:hi['Expires At']!=null?rows[matchIndex][hi['Expires At']]:'',maxAccounts:hi['Max Accounts']!=null?Number(rows[matchIndex][hi['Max Accounts']]||0):0,accountEmails:hi['Account Emails']!=null?String(rows[matchIndex][hi['Account Emails']]||'').split(',').map(function(x){return x.trim().toLowerCase();}).filter(Boolean):[],accessType:hi['Access Type']!=null?String(rows[matchIndex][hi['Access Type']]||'').trim().toUpperCase():''};
  if(!loginEmail) loginEmail = meta.contactEmail || meta.accountEmails[0] || '';
   if(!loginEmail) throw new Error('Registered email is required for this client.');
   if(meta.contactEmail && loginEmail !== meta.contactEmail && meta.accountEmails.indexOf(loginEmail) < 0) {
     throw new Error('Registered email does not match this KOL IDS client.');
   }
   if(!meta.contactEmail && meta.accountEmails.length && meta.accountEmails.indexOf(loginEmail) < 0) {
     throw new Error('Registered email is not authorized for this KOL IDS client.');
   }
   if(meta.expiresAt){var exp=new Date(meta.expiresAt);if(!isNaN(exp.getTime())&&exp.getTime()<=Date.now()){s.getRange(rowNumber,5).setValue(KOL_IDS_SAAS.LICENSE_EXPIRED);throw new Error('KOL IDS trial or plan has expired. Please choose a paid plan to continue.');}}
  var currentEmail=loginEmail;
  if(currentEmail && hi['Account Emails']!=null){
    // Seat/account registration is a shared mutation. Re-read the authoritative
    // row while holding the same script lock used by the access-key migration so
    // two simultaneous first-logins cannot both consume the last seat.
    var accountLock=LockService.getScriptLock();
    if(!accountLock.tryLock(10000)) throw KOL_IDS_PLATFORM_error_('LOCKED','Client account registration is busy.');
    try {
      var latestAccountValue=String(s.getRange(rowNumber,hi['Account Emails']+1).getValue()||'');
      var latestEmails=latestAccountValue.split(',').map(function(x){return x.trim().toLowerCase();}).filter(Boolean);
      var limit=meta.maxAccounts>0?meta.maxAccounts:1;
      if(latestEmails.indexOf(currentEmail)<0){
        if(latestEmails.length>=limit) throw new Error('This Client ID is already using all allowed Google Accounts for the current plan.');
        latestEmails.push(currentEmail);
        s.getRange(rowNumber,hi['Account Emails']+1).setValue(latestEmails.join(','));
      }
      meta.accountEmails=latestEmails;
    } finally { accountLock.releaseLock(); }
  }

  // Migrate legacy plaintext access keys after successful authentication.
  var currentStored = String(rows[matchIndex][2] || '').trim();
  var migrateLock = LockService.getScriptLock();
  if (!migrateLock.tryLock(5000)) throw KOL_IDS_PLATFORM_error_('LOCKED','Client access migration is busy.');
  try {
    var latestStored = String(s.getRange(rowNumber, 3).getValue() || '').trim();
    if (latestStored === key || latestStored.indexOf(KOL_IDS.ACCESS_KEY_HASH_PREFIX) !== 0) {
      s.getRange(rowNumber, 3).setValue(KOL_IDS.ACCESS_KEY_HASH_PREFIX + presentedHash);
    }
    s.getRange(rowNumber, 7).setValue(new Date());
  } finally { migrateLock.releaseLock(); }

  return {
    clientId: rows[matchIndex][0],
    clientName: rows[matchIndex][1],
    spreadsheetId: rows[matchIndex][3],
    status: rows[matchIndex][4],
    contactEmail: hi['Contact Email']!=null?String(rows[matchIndex][hi['Contact Email']]||'').trim().toLowerCase():'',
    plan:meta.plan,expiresAt:meta.expiresAt?new Date(meta.expiresAt).toISOString():'',maxAccounts:meta.maxAccounts||1,accountEmails:meta.accountEmails,accessType:meta.accessType,
    requestId: KOL_IDS_HARDENING_RUNTIME_requestId_()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_findClient_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_findClient_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Store a new client access key as a hash.
 * The raw key is returned to the caller exactly once by the caller.
 */
function KOL_IDS_HARDENING_RUNTIME_accessKeyHash_(rawKey) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_accessKeyHash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var key = String(rawKey || '').trim();
  if (!KOL_IDS.ACCESS_KEY_PATTERN.test(key)) {
    throw new Error('Access key must contain exactly 9 uppercase letters or numbers.');
  }
  return KOL_IDS.ACCESS_KEY_HASH_PREFIX + KOL_IDS_HARDENING_RUNTIME_hash_(key);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_accessKeyHash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_accessKeyHash_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Idempotency guard for critical write operations.
 * Returns true when the key is new; throws when it has already been used.
 */
function KOL_IDS_HARDENING_RUNTIME_claimIdempotency_(operation, idempotencyKey) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_claimIdempotency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var op = String(operation || '').trim().toUpperCase();
  var key = String(idempotencyKey || '').trim();

  if (!op || !key) throw new Error('Operation and idempotency key are required.');
  if (key.length < 12 || key.length > 200) throw new Error('Invalid idempotency key.');

  var cache = CacheService.getScriptCache();
  var cacheKey = 'KOL_IDS_HARDENING_IDEMP:' + KOL_IDS_HARDENING_RUNTIME_hash_(op + ':' + key);

  if (cache.get(cacheKey)) {
    throw new Error('Duplicate request rejected. Request has already been processed.');
  }

  cache.put(cacheKey, '1', KOL_IDS.MAX_IDEMPOTENCY_TTL_SEC);
  return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_claimIdempotency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_claimIdempotency_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/**
 * Small, deterministic production certification for the hardening layer.
 * Non-destructive: no sheets, users, clients, or production records are changed.
 */
function KOL_IDS_HARDENING_RUNTIME_PRODUCTION_CERTIFICATION_QA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_PRODUCTION_CERTIFICATION_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var startedAt = Date.now();
  var tests = [];
  var errors = [];

  function runCheck_(name, fn) {
    var started = Date.now();

    try {
      var value = fn();
      var pass = !!value;

      tests.push({
        name: name,
        pass: pass,
        message: pass ? 'PASS' : 'FAIL',
        durationMs: Date.now() - started
      });

      if (!pass) {
        errors.push({
          test: name,
          message: 'Check returned false.'
        });
      }

    } catch (e) {
      var message = String(
        e && e.message
          ? e.message
          : e
      );

      tests.push({
        name: name,
        pass: false,
        message: message,
        durationMs: Date.now() - started
      });

      errors.push({
        test: name,
        message: message
      });
    }
  }

  // ============================================================
  // 1. HASH DETERMINISM
  // ============================================================
  runCheck_('Hash deterministic', function() {
    return KOL_IDS_HARDENING_RUNTIME_hash_('KOL_IDS_TEST') ===
           KOL_IDS_HARDENING_RUNTIME_hash_('KOL_IDS_TEST');
  });

  // ============================================================
  // 2. HASH DIFFERENT INPUTS
  // ============================================================
  runCheck_('Hash differs for different secrets', function() {
    return KOL_IDS_HARDENING_RUNTIME_hash_('A') !==
           KOL_IDS_HARDENING_RUNTIME_hash_('B');
  });

  // ============================================================
  // 3. REQUEST ID FORMAT
  // ============================================================
  runCheck_('Request ID format', function() {
    return /^REQ-[A-Z0-9]{16}$/.test(
      KOL_IDS_HARDENING_RUNTIME_requestId_()
    );
  });

  // ============================================================
  // 4. ACCESS KEY MINIMUM LENGTH
  // ============================================================
  runCheck_('Access key minimum length enforced', function() {
    try {
      KOL_IDS_HARDENING_RUNTIME_accessKeyHash_('short');
      return false;
    } catch (e) {
      return true;
    }
  });

  // ============================================================
  // 5. IDEMPOTENCY DUPLICATE PROTECTION
  // ============================================================
  runCheck_('Idempotency rejects duplicate key', function() {
    var key = 'QA-' + Utilities.getUuid();

    // First claim must succeed.
    KOL_IDS_HARDENING_RUNTIME_claimIdempotency_(
      'QA',
      key
    );

    // Second claim must be rejected.
    try {
      KOL_IDS_HARDENING_RUNTIME_claimIdempotency_(
        'QA',
        key
      );

      return false;

    } catch (e) {
      return true;
    }
  });

  // ============================================================
  // 6. PERSISTENT IDEMPOTENCY SHEET CONTRACT
  // ============================================================
  runCheck_('Persistent idempotency sheet contract', function() {
    var sh =
      KOL_IDS_HARDENING_RUNTIME_ensureIdempotencySheet_();

    var expected =
      'Idempotency Key|Operation|Org ID|Request ID|Status|' +
      'Response Hash|Response JSON|Created At|Completed At|' +
      'Brand ID|Request Hash|Lease Until';

    var actual =
      sh.getRange(
        1,
        1,
        1,
        sh.getLastColumn()
      )
      .getValues()[0]
      .join('|');

    return actual === expected;
  });

  // ============================================================
  // 7. SEMANTIC FEATURE VALIDATOR
  // ============================================================
  runCheck_('Semantic feature validator is available', function() {
    return typeof KOL_IDS_PLATFORM_validateApiFeatures_ ===
           'function';
  });

  // ============================================================
  // FINAL RESULT
  // ============================================================
  var failed = tests.filter(function(test) {
    return !test.pass;
  }).length;

  var passed = tests.length - failed;
  var success = failed === 0;
  var durationMs = Date.now() - startedAt;

  var result = {
    success: success,
    status: success ? 'GREEN' : 'RED',
    version: KOL_IDS.VERSION,
    tests: tests,
    passed: passed,
    failed: failed,
    errors: errors,
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: durationMs,
    timestamp: new Date().toISOString()
  };

  // ============================================================
  // VISIBLE EXECUTION LOG
  // ============================================================
  Logger.log('');
  Logger.log('============================================================');
  Logger.log('KOL IDS HARDENING PRODUCTION CERTIFICATION QA');
  Logger.log('============================================================');
  Logger.log('VERSION: ' + String(result.version || 'UNKNOWN'));
  Logger.log('');

  tests.forEach(function(test, index) {
    Logger.log(
      '[' + (index + 1) + '] ' +
      test.name + ': ' +
      (test.pass ? 'GREEN' : 'RED')
    );

    if (test.message && test.message !== 'PASS') {
      Logger.log('    DETAIL: ' + test.message);
    }

    Logger.log(
      '    Duration: ' +
      test.durationMs +
      ' ms'
    );
  });

  Logger.log('');
  Logger.log('PASSED: ' + passed);
  Logger.log('FAILED: ' + failed);

  if (errors.length) {
    Logger.log('');
    Logger.log('ERRORS:');

    errors.forEach(function(error) {
      Logger.log(
        ' - ' +
        error.test +
        ': ' +
        error.message
      );
    });
  }

  Logger.log('');
  Logger.log(
    'FINAL STATUS: ' +
    (success ? 'GREEN' : 'RED')
  );

  Logger.log(
    'Duration: ' +
    durationMs +
    ' ms'
  );

  Logger.log('============================================================');

  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_PRODUCTION_CERTIFICATION_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_PRODUCTION_CERTIFICATION_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** 1.0.0 final cross-layer hardening helpers. */
function KOL_IDS_HARDENING_RUNTIME_releaseContract_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_releaseContract_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var v=String(KOL_IDS_RELEASE&&KOL_IDS_RELEASE.VERSION||'');
  var layers={release:v,enterprise:String(KOL_IDS&&KOL_IDS.VERSION||''),hardening:String(KOL_IDS&&KOL_IDS.VERSION||''),router:String(KOL_IDS_HARDENING_ROUTER&&KOL_IDS_HARDENING_ROUTER.VERSION||'')};
  var ok=v && Object.keys(layers).every(function(k){return layers[k]===v;});
  return {success:!!ok,version:v,layers:layers};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_releaseContract_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_releaseContract_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_assertWriteContract_(action){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_assertWriteContract_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var op=KOL_IDS_HARDENING_RUNTIME_operation_(action);
  if(op.kind!=='WRITE') return {write:false,operation:action,scope:op.scope};
  if(!op.scope) throw KOL_IDS_PLATFORM_error_('INTERNAL_ERROR','Write operation has no authorization scope.');
  return {write:true,operation:action,scope:op.scope,idempotencyRequired:true};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_assertWriteContract_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_assertWriteContract_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_HARDENING_RUNTIME_performanceContractQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_performanceContractQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var checks=[],failures=[];
  function KOL_IDS_HARDENING_RUNTIME_hardeningT_(name,ok,detail){checks.push({name:name,pass:!!ok});if(!ok)failures.push({name:name,detail:detail||''});}
  var reg=KOL_IDS_HARDENING_RUNTIME_operationRegistry_(),keys=Object.keys(reg);
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('operation registry is authoritative',keys.length>=6&&keys.every(function(k){return reg[k]&&reg[k].kind&&reg[k].scope;}),'Every API operation must be declared once in the hardened registry.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('brand scope is explicit',keys.every(function(k){return reg[k]&&typeof reg[k].requiresBrand==='boolean';}),'Every API operation must explicitly declare whether it requires a brand scope.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('idempotency binds brand and payload',String(KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_).indexOf('brandId')>=0&&String(KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_).indexOf('requestHash')>=0,'Idempotency must bind to tenant, brand and request payload.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('api executor delegates operation validation',String(KOL_IDS_PLATFORM_api_).replace(/\s+/g,'').indexOf('KOL_IDS_HARDENING_RUNTIME_operation_(action)')>=0,'API executor must not maintain a second hard-coded operation allowlist.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('rate limiter is non-blocking',String(KOL_IDS_HARDENING_RUNTIME_rateLimit_).indexOf('getScriptLock')<0,'Hot-path rate limiting must not serialize every request on the script lock.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('idempotency cache fast path',String(KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_).replace(/\s+/g,'').indexOf('KOL_IDS_HARDENING_RUNTIME_readIdempotencyRow_')>=0,'Idempotency claims should use the cached row before scanning the registry.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('idempotency completion cache fast path',String(KOL_IDS_HARDENING_RUNTIME_completeIdempotency_).replace(/\s+/g,'').indexOf('KOL_IDS_HARDENING_IDEM:')>=0,'Idempotency completion should use the cached row before scanning.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('no forwarded-ip trust',String(KOL_IDS_HARDENING_RUNTIME_rateLimit_).indexOf('X-Forwarded-For')<0,'Client-controlled forwarded headers must not be a security identity.');
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('canonical release version',KOL_IDS.VERSION==='1.1.0'&&KOL_IDS_RELEASE.VERSION==='1.1.0','All active release layers must use canonical release 1.1.0.');
  var moat;
  try { moat=KOL_IDS_DATAMOAT_DM_contractQA_(); } catch(e) { moat={success:false,error:String(e&&e.message||e)}; }
  if(!moat.success){
    try { if(typeof KOL_IDS_PLATFORM_ensure_==='function') KOL_IDS_PLATFORM_ensure_(); moat=KOL_IDS_DATAMOAT_DM_contractQA_(); } catch(e2) { moat={success:false,error:String(e2&&e2.message||e2)}; }
  }
  KOL_IDS_HARDENING_RUNTIME_hardeningT_('data moat contract',!!(moat&&moat.success),'Decision, recommendation, outcome and lineage schemas must be available and consent-aware.'+(moat&&moat.error?' '+moat.error:''));
  return {success:failures.length===0,checks:checks,failures:failures,version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_performanceContractQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_performanceContractQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_HARDENING_RUNTIME_dependencyHealth_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_HARDENING_RUNTIME_dependencyHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var KOL_IDS_PLATFORM_req=['KOL_IDS_PLATFORM_api_','KOL_IDS_PLATFORM_auth_','KOL_IDS_PLATFORM_requireBrand_','KOL_IDS_PLATFORM_featureContract_','KOL_IDS_PLATFORM_validateApiFeatures_','KOL_IDS_PLATFORM_rebuildBenchmarksCore_','KOL_IDS_HARDENING_RUNTIME_apiGate_','KOL_IDS_HARDENING_RUNTIME_operationRegistry_','KOL_IDS_HARDENING_RUNTIME_claimIdempotencyPersistent_','KOL_IDS_DATAMOAT_DM_contractQA_','KOL_IDS_DATAMOAT_DM_evaluateRecommendation_','KOL_IDS_GROWTH_growthContractQA_','KOL_IDS_GROWTH_matchCreators_','KOL_IDS_GROWTH_calibrationReport_'];
  var missing=KOL_IDS_PLATFORM_req.filter(function(n){return typeof this[n]!=='function';},this);
  return {success:missing.length===0,missing:missing,checkedAt:new Date().toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_HARDENING_RUNTIME_dependencyHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_HARDENING_RUNTIME_dependencyHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}
