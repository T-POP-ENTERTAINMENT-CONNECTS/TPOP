/**
 * KOL IDS™ 1.1.0 — SINGLE RELEASE IDENTITY
 *
 * This file is the only customer-facing release identity and commercial price authority.
 * Module implementation versions are internal metadata only.
 */
var KOL_IDS_RELEASE_MANIFEST = Object.freeze({
  PRODUCT: 'KOL IDS',
  BRAND: 'KOL IDS',
  RELEASE_ID: '1.1.0',
  RELEASE_FINGERPRINT: 'KOLIDS-1.1.0-CANONICAL-RUNTIME-GENCODE-SALES-PRICING-39000-73900-139000',
  STATUS: 'PRODUCTION_CANDIDATE',
  RUNTIME: 'V8 / USER_ACCESSING',
  ENTRYPOINTS: Object.freeze({GET:'doGet',POST:'doPost'}),
  AUTHORITIES: Object.freeze({
    AUTH: 'KOL_IDS_SECURITY.gs',
    COMMERCIAL: 'KOL_IDS_COMMERCIAL.gs',
    WORKSPACE: 'KOL_IDS_SYSTEM.gs',
    ROUTER: 'KOL_IDS_ROUTER.gs',
    CANONICAL_STATE: 'KOL_IDS_CANONICAL.gs',
    MUTATION: 'KOL_IDS_CANONICAL_MUTATION.gs',
    PRODUCT_EXECUTION: 'KOL_IDS_PRODUCT.gs',
    DECISION: 'KOL_IDS_ENGINE.gs',
    REPORT: 'KOL_IDS_REPORT_HARDENING_5X.gs',
    GENCODE: 'KOL_IDS_GENCODE.gs',
    ATTRIBUTION: 'KOL_IDS_ATTRIBUTION.gs',
    HARDENING: 'KOL_IDS_ENTERPRISE_HARDENING.gs',
    ARCHITECTURE: 'KOL_IDS_ARCHITECTURE_HARDENING.gs',
    LEARNING: 'KOL_IDS_LEARNING.gs',
    API: 'KOL_IDS_PLATFORM.gs',
    QA: 'KOL_IDS_RELEASE_QA.gs'
  }),
  COMPATIBILITY: Object.freeze({
    LEGACY_UI: 'KOL_IDS_UI_LEGACY.html?legacy=1',
    LEGACY_PROPERTY_READS: true,
    LEGACY_PRODUCT_API: false,
    LEGACY_SCORING_AUTHORITY: false
  }),
  GENCODE: Object.freeze({
    REGISTRY_SHEET: 'ENT_GENCODE_REGISTRY',
    REGISTRY_SCOPE: 'WORKSPACE',
    CONCURRENCY: 'SCRIPT_LOCK',
    LEGACY_USER_PROPERTY_READ: 'MIGRATION_ONLY'
  }),
  COMMERCIAL: Object.freeze({
    CURRENCY: 'THB',
    TRIAL_DAYS: 7,
    PLANS: Object.freeze({THREE_MONTHS:39000,SIX_MONTHS:73900,TWELVE_MONTHS:139000}),
    ACCOUNT_LIMITS: Object.freeze({THREE_MONTHS:1,SIX_MONTHS:2,TWELVE_MONTHS:3})
  })
});

function KOL_IDS_RELEASE_getManifest_(){return JSON.parse(JSON.stringify(KOL_IDS_RELEASE_MANIFEST));}
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_getFingerprint(){
  var raw=[KOL_IDS_RELEASE_MANIFEST.PRODUCT,KOL_IDS_RELEASE_MANIFEST.RELEASE_ID,KOL_IDS_RELEASE_MANIFEST.RELEASE_FINGERPRINT,KOL_IDS_RELEASE_MANIFEST.RUNTIME].join('|');
  var bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,raw,Utilities.Charset.UTF_8);
  var hash=bytes.map(function(b){b=(b+256)%256;return ('0'+b.toString(16)).slice(-2);}).join('');
  return {releaseId:KOL_IDS_RELEASE_MANIFEST.RELEASE_ID,fingerprint:KOL_IDS_RELEASE_MANIFEST.RELEASE_FINGERPRINT,hash:hash};
}
function KOL_IDS_RELEASE_ASSERT_MANIFEST_(){
  if(typeof KOL_IDS_RELEASE_MANIFEST==='undefined')throw new Error('RELEASE_MANIFEST_MISSING');
  if(String(KOL_IDS_RELEASE_MANIFEST.RELEASE_ID)!=='1.1.0')throw new Error('RELEASE_ID_MISMATCH');
  if(typeof KOL_IDS==='undefined'||String(KOL_IDS.VERSION)!=='1.1.0')throw new Error('CORE_VERSION_MISMATCH');
  if(typeof KOL_IDS_RELEASE==='undefined'||String(KOL_IDS_RELEASE.VERSION)!=='1.1.0')throw new Error('RELEASE_CONTRACT_MISMATCH');
  return true;
}


function KOL_IDS_RELEASE_getFingerprint() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RELEASE_getFingerprint', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_getFingerprint, this, arguments);
}
