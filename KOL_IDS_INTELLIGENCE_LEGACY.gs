/* Compatibility shim: V23 callers remain valid while production intelligence is V24. */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {DELEGATES_TO:'24.0.0'});
function KOL_IDS_INTELLIGENCE_LEGACY_intelligence_(ss,creator,target,goal,baseScore,confidence,hist,erActual,rateActual){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_LEGACY_intelligence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_INTELLIGENCE_FINAL_intelligence_(ss,creator,target,goal,baseScore,confidence,hist,erActual,rateActual,70,70,50);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_LEGACY_intelligence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_LEGACY_intelligence_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_INTELLIGENCE_LEGACY_runTests(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_INTELLIGENCE_LEGACY_runTests');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_INTELLIGENCE_FINAL_runTests();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_INTELLIGENCE_LEGACY_runTests', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_INTELLIGENCE_LEGACY_runTests', Date.now() - __kolIdsTraceStartedAt);
  }
}
