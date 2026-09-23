/**
 * KOL IDS™ — RELEASE COMPATIBILITY BRIDGE
 *
 * Historical V5–V25 module versions remain metadata only. They never define
 * the active product release. The active release is owned by
 * KOL_IDS_RELEASE_MANIFEST in KOL_IDS_01_RELEASE_MANIFEST.gs.
 */
var KOL_IDS_LEGACY_RELEASE = Object.freeze({
  PRODUCT: 'KOL IDS',
  STATUS: 'COMPATIBILITY_METADATA_ONLY',
  VERSIONS: ['V5','V6','V7','V8','V9','V10','V11','V12','V14','V15','V16','LEGACY_V25.10'],
  RULES: Object.freeze({
    STRICT_AS_OF: true,
    OOS_ONLY_CALIBRATION: true,
    DUPLICATE_SAFE_LEARNING: true,
    DATA_QUALITY_GATE: true,
    INSUFFICIENT_EVIDENCE_ABSTAIN: true,
    METRIC_SPECIFIC_PREDICTION: true,
    DECISION_USES_UNCERTAINTY: true
  })
});

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_getLegacyReleaseInfo(){
  return {
    success:true,
    product:KOL_IDS_LEGACY_RELEASE.PRODUCT,
    status:KOL_IDS_LEGACY_RELEASE.STATUS,
    versions:KOL_IDS_LEGACY_RELEASE.VERSIONS.slice(),
    activeRelease:KOL_IDS_RELEASE_MANIFEST.RELEASE_ID,
    rules:KOL_IDS_LEGACY_RELEASE.RULES
  };
}

function KOL_IDS_RELEASE_assertUnifiedRelease_(){
  return KOL_IDS_RELEASE_ASSERT_MANIFEST_();
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_RUN_UNIFIED_QA(){
  return KOL_IDS_RELEASE_QA_RUNTIME_CONTRACT_();
}


function KOL_IDS_RELEASE_getLegacyReleaseInfo() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RELEASE_getLegacyReleaseInfo', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_getLegacyReleaseInfo, this, arguments);
}


function KOL_IDS_RELEASE_RUN_UNIFIED_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_RELEASE_RUN_UNIFIED_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_RELEASE_RUN_UNIFIED_QA, this, arguments);
}
