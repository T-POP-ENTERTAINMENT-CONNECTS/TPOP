/* =========================================================
 * KOL IDS™ 1.1.0 — PERSONA INTEGRATION LAYER
 * Additive adapter: does not alter legacy positional schemas.
 * Flow: Input Persona -> Persistent Persona Profile -> Analysis Context -> Report/History.
 * ========================================================= */

const KOL_IDS_PERSONA = {
  VERSION: '25.10.9',
  SHEET: '13A_PERSONA_PROFILE',
  HEADERS: [
    'Analysis ID','Campaign ID','Brand ID','Record Type','Record ID','Name',
    'Age','Gender','Behavior','Interests','Geography','Location Detail',
    'Goals & Needs','Pain Points','Lifestyle','Values','Fashion Affinity',
    'Artist Role Model','Description','Personality','Communication','Influence',
    'Relationship','Social Behavior','Content Personality','Content Function',
    'Content Behavior','Psychology','Source','Updated At'
  ]
};

function KOL_IDS_PERSONA_SETUP_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PERSONA_SETUP_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let sh = ss.getSheetByName(KOL_IDS_PERSONA.SHEET);
  if (!sh) sh = ss.insertSheet(KOL_IDS_PERSONA.SHEET);
  const current = sh.getLastColumn() ? sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0] : [];
  if (current.join('|') !== KOL_IDS_PERSONA.HEADERS.join('|')) {
    sh.clear();
    sh.getRange(1,1,1,KOL_IDS_PERSONA.HEADERS.length).setValues([KOL_IDS_PERSONA.HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PERSONA_SETUP_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PERSONA_SETUP_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PERSONA_text_(v) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PERSONA_text_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (Array.isArray(v)) return v.filter(Boolean).join(' | ');
  return String(v == null ? '' : v).trim();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PERSONA_text_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PERSONA_text_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PERSONA_write_(ss, payload, analysisId, campaignId, brandId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PERSONA_write_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh = KOL_IDS_PERSONA_SETUP_(ss);
  const rows = [];
  const a = payload || {};

  rows.push([
    analysisId, campaignId, brandId, 'AUDIENCE', 'AUDIENCE', 'Target Audience',
    KOL_IDS_PERSONA_text_(a.audienceAge), KOL_IDS_PERSONA_text_(a.audienceGender),
    KOL_IDS_PERSONA_text_(a.audienceBehavior), KOL_IDS_PERSONA_text_(a.audienceInterest),
    KOL_IDS_PERSONA_text_(a.audienceGeography || a.audienceLocation),
    KOL_IDS_PERSONA_text_(a.audienceLocationDetail), KOL_IDS_PERSONA_text_(a.audienceGoalsNeeds),
    KOL_IDS_PERSONA_text_(a.audiencePainPoints), KOL_IDS_PERSONA_text_(a.audienceLifestyle),
    KOL_IDS_PERSONA_text_(a.audienceValues), KOL_IDS_PERSONA_text_(a.audienceFashionAffinity),
    KOL_IDS_PERSONA_text_(a.audienceArtistRoleModel), KOL_IDS_PERSONA_text_(a.audienceDescription || a.audience),
    '', '', '', '', '', '', '', '', '', 'USER_INPUT', new Date()
  ]);

  (a.kols || []).forEach(function(k, i) {
    rows.push([
      analysisId, campaignId, brandId, 'KOL', KOL_IDS_PERSONA_text_(k.kolId || k.id || ('KOL-' + String(i + 1).padStart(4,'0'))), KOL_IDS_PERSONA_text_(k.name),
      KOL_IDS_PERSONA_text_(k.audienceAge || (k.audiencePersona && k.audiencePersona.age)),
      KOL_IDS_PERSONA_text_(k.audienceGender || (k.audiencePersona && k.audiencePersona.gender)),
      KOL_IDS_PERSONA_text_(k.audienceBehavior || (k.audiencePersona && k.audiencePersona.behavior)),
      KOL_IDS_PERSONA_text_(k.audienceInterest || (k.audiencePersona && k.audiencePersona.interests)),
      KOL_IDS_PERSONA_text_(k.audienceGeography || k.audienceLocation || (k.audiencePersona && k.audiencePersona.geography)),
      KOL_IDS_PERSONA_text_(k.audienceLocationDetail),
      KOL_IDS_PERSONA_text_(k.audienceGoalsNeeds || (k.audiencePersona && k.audiencePersona.goalsNeeds)),
      KOL_IDS_PERSONA_text_(k.audiencePainPoints || (k.audiencePersona && k.audiencePersona.painPoints)),
      KOL_IDS_PERSONA_text_(k.audienceLifestyle || (k.audiencePersona && k.audiencePersona.lifestyle)),
      KOL_IDS_PERSONA_text_(k.audienceValues || (k.audiencePersona && k.audiencePersona.values)),
      KOL_IDS_PERSONA_text_(k.audienceFashionAffinity || (k.audiencePersona && k.audiencePersona.fashionAffinity)),
      KOL_IDS_PERSONA_text_(k.audienceArtistRoleModel || (k.audiencePersona && k.audiencePersona.artistRoleModel)),
      KOL_IDS_PERSONA_text_(k.description || (k.audiencePersona && k.audiencePersona.description)),
      KOL_IDS_PERSONA_text_(k.personality), KOL_IDS_PERSONA_text_(k.communication), KOL_IDS_PERSONA_text_(k.influence),
      KOL_IDS_PERSONA_text_(k.relationship), KOL_IDS_PERSONA_text_(k.social), KOL_IDS_PERSONA_text_(k.contentPersonality),
      KOL_IDS_PERSONA_text_(k.contentFunction), KOL_IDS_PERSONA_text_(k.contentBehavior), KOL_IDS_PERSONA_text_(k.psychology),
      'USER_INPUT', new Date()
    ]);
  });

  // Replace only this analysis snapshot; preserve all previous analyses for learning/history.
  const existing = sh.getLastRow() >= 2
    ? sh.getRange(2,1,sh.getLastRow()-1,KOL_IDS_PERSONA.HEADERS.length).getValues()
    : [];
  const keep = existing.filter(function(r) {
    return String(r[0] || '') !== String(analysisId || '');
  });
  if (sh.getLastRow() > 1) sh.getRange(2,1,sh.getLastRow()-1,KOL_IDS_PERSONA.HEADERS.length).clearContent();
  const all = keep.concat(rows);
  if (all.length) sh.getRange(2,1,all.length,KOL_IDS_PERSONA.HEADERS.length).setValues(all);
  return {success:true, sheet:KOL_IDS_PERSONA.SHEET, rows:rows.length, preservedHistory:keep.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PERSONA_write_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PERSONA_write_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PERSONA_getActive_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PERSONA_getActive_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh = ss.getSheetByName(KOL_IDS_PERSONA.SHEET);
  if (!sh || sh.getLastRow() < 2) return {audience:null, kols:[]};
  const values = sh.getRange(2,1,sh.getLastRow()-1,KOL_IDS_PERSONA.HEADERS.length).getValues();
  const idx = {}; KOL_IDS_PERSONA.HEADERS.forEach((h,i)=>idx[h]=i);
  const props = KOL_IDS_SELF_SERVICE_PRODUCT_getStateProperties_();
  let activeAnalysis = String(props.getProperty('KOL_IDS_ACTIVE_ANALYSIS_ID') || props.getProperty('KBIS_ACTIVE_ANALYSIS_ID') || '');
  if (!activeAnalysis) {
    for (let i=values.length-1;i>=0;i--) {
      if (values[i][0]) { activeAnalysis = String(values[i][0]); break; }
    }
  }
  const out = {audience:null,kols:[],analysisId:activeAnalysis};
  values.forEach(function(r){
    if (activeAnalysis && String(r[idx['Analysis ID']] || '') !== activeAnalysis) return;
    const obj = {};
    KOL_IDS_PERSONA.HEADERS.forEach(function(h){ obj[h] = r[idx[h]]; });
    if (obj['Record Type'] === 'AUDIENCE') out.audience = obj;
    else if (obj['Record Type'] === 'KOL') out.kols.push(obj);
  });
  return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PERSONA_getActive_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PERSONA_getActive_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PERSONA_getReportContext() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PERSONA_getReportContext');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  const p = KOL_IDS_PERSONA_getActive_(ss);
  return {success:true, version:KOL_IDS_PERSONA.VERSION, persona:p};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PERSONA_getReportContext', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PERSONA_getReportContext', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_PERSONA_validate_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PERSONA_validate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  const sh = ss.getSheetByName(KOL_IDS_PERSONA.SHEET);
  if (!sh) return {success:false,error:'Persona sheet missing',sheet:KOL_IDS_PERSONA.SHEET};
  const headers = sh.getRange(1,1,1,KOL_IDS_PERSONA.HEADERS.length).getValues()[0];
  const missing = KOL_IDS_PERSONA.HEADERS.filter(function(h){return headers.indexOf(h)===-1;});
  return {success:missing.length===0, sheet:KOL_IDS_PERSONA.SHEET, missing:missing};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PERSONA_validate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PERSONA_validate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
