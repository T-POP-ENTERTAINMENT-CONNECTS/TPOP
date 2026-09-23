
/**
 * KOL IDS™ V6.1 — DATA QUALITY, OUTCOME CALIBRATION & REAL LEARNING LOOP
 *
 * Design:
 *   raw evidence -> validation -> outcome normalization -> peer context
 *   -> time-decayed creator/goal history -> reliability shrinkage
 *   -> bounded learning adjustment -> next decision
 *
 * This module never fabricates missing metrics. It explicitly separates:
 * - data validity
 * - evidence quality
 * - outcome strength
 * - historical confidence
 * - model adjustment
 *
 * Compatible with the existing V5/V6 sheets. A new V6_LEARNING_LOOP sheet
 * is created only when there is real completed performance data to persist.
 */

KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  MAX_ADJUSTMENT: 12,
  MIN_SAMPLE_FOR_STRONG_LEARNING: 3,
  HALF_LIFE_DAYS: 180,
  RECENCY_FLOOR: 0.25,
  OUTCOME_MIN: 0,
  OUTCOME_MAX: 100
});

function KOL_IDS_LEARNING_LEGACY_clamp_(v, lo, hi) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const n = Number(v);
  if (!isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_num_(v) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return isFinite(n) ? n : null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_daysSince_(dateValue) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_daysSince_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!dateValue) return 9999;
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return 9999;
  return Math.max(0, (Date.now() - d.getTime()) / 86400000);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_daysSince_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_daysSince_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_recencyWeight_(dateValue) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_recencyWeight_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const days = KOL_IDS_LEARNING_LEGACY_daysSince_(dateValue);
  const KOL_IDS_PLATFORM_w = Math.pow(0.5, days / KOL_IDS.HALF_LIFE_DAYS);
  return Math.max(KOL_IDS.RECENCY_FLOOR, KOL_IDS_PLATFORM_w);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_recencyWeight_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_recencyWeight_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_median_(arr) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const KOL_IDS_LEARNING_LEGACY_a = arr.filter(x => isFinite(Number(x))).map(Number).sort((x,y)=>x-y);
  if (!KOL_IDS_LEARNING_LEGACY_a.length) return 50;
  const m = Math.floor(KOL_IDS_LEARNING_LEGACY_a.length / 2);
  return KOL_IDS_LEARNING_LEGACY_a.length % 2 ? KOL_IDS_LEARNING_LEGACY_a[m] : (KOL_IDS_LEARNING_LEGACY_a[m-1] + KOL_IDS_LEARNING_LEGACY_a[m]) / 2;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_mean_(arr) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const KOL_IDS_LEARNING_LEGACY_a = arr.filter(x => isFinite(Number(x))).map(Number);
  return KOL_IDS_LEARNING_LEGACY_a.length ? KOL_IDS_LEARNING_LEGACY_a.reduce((x,y)=>x+y,0)/KOL_IDS_LEARNING_LEGACY_a.length : 50;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_std_(arr) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_std_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const KOL_IDS_LEARNING_LEGACY_a = arr.filter(x => isFinite(Number(x))).map(Number);
  if (KOL_IDS_LEARNING_LEGACY_a.length < 2) return 0;
  const mean = KOL_IDS_LEARNING_LEGACY_mean_(KOL_IDS_LEARNING_LEGACY_a);
  return Math.sqrt(KOL_IDS_LEARNING_LEGACY_a.reduce((s,x)=>s+Math.pow(x-mean,2),0)/(KOL_IDS_LEARNING_LEGACY_a.length-1));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_std_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_std_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Strict validation: only impossible relationships are rejected. */
function KOL_IDS_LEARNING_LEGACY_validatePerformance_(r) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_validatePerformance_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const reach = KOL_IDS_LEARNING_LEGACY_num_(r[5]);
  const imp = KOL_IDS_LEARNING_LEGACY_num_(r[6]);
  const views = KOL_IDS_LEARNING_LEGACY_num_(r[7]);
  const eng = KOL_IDS_LEARNING_LEGACY_num_(r[8]);
  const clicks = KOL_IDS_LEARNING_LEGACY_num_(r[9]);
  const conv = KOL_IDS_LEARNING_LEGACY_num_(r[10]);
  const errors = [];
  [4,5,6,7,8,9,10,11].forEach(i => {
    const n = KOL_IDS_LEARNING_LEGACY_num_(r[i]);
    if (n !== null && n < 0) errors.push('negative_metric');
  });
  if (reach !== null && imp !== null && reach > imp) errors.push('reach_gt_impressions');
  if (views !== null && imp !== null && views > imp) errors.push('views_gt_impressions');
  if (eng !== null && imp !== null && eng > imp) errors.push('engagements_gt_impressions');
  if (eng !== null && views !== null && eng > views) errors.push('engagements_gt_views');
  if (clicks !== null && imp !== null && clicks > imp) errors.push('clicks_gt_impressions');
  if (clicks !== null && views !== null && clicks > views) errors.push('clicks_gt_views');
  if (conv !== null && clicks !== null && conv > clicks) errors.push('conversions_gt_clicks');
  return {valid: errors.length === 0, errors: errors};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_validatePerformance_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_validatePerformance_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/*
 * Raw outcome score. The existing system used fixed ceilings, which can be
 * distorted by market/creator scale. We therefore calculate KOL_IDS_LEARNING_LEGACY_a goal-specific
 * raw score, then calibrate it against the creator's historical goal peers.
 */
function KOL_IDS_LEARNING_LEGACY_rawOutcome_(r, goal) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_rawOutcome_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const spend = KOL_IDS_LEARNING_LEGACY_num_(r[4]) || 0;
  const reach = KOL_IDS_LEARNING_LEGACY_num_(r[5]) || 0;
  const imp = KOL_IDS_LEARNING_LEGACY_num_(r[6]) || 0;
  const views = KOL_IDS_LEARNING_LEGACY_num_(r[7]) || 0;
  const eng = KOL_IDS_LEARNING_LEGACY_num_(r[8]) || 0;
  const clicks = KOL_IDS_LEARNING_LEGACY_num_(r[9]) || 0;
  const conv = KOL_IDS_LEARNING_LEGACY_num_(r[10]) || 0;
  const revenue = KOL_IDS_LEARNING_LEGACY_num_(r[11]) || 0;
  const er = imp > 0 ? eng / imp * 100 : (reach > 0 ? eng / reach * 100 : null);
  const ctr = imp > 0 ? clicks / imp * 100 : (views > 0 ? clicks / views * 100 : null);
  const cvr = clicks > 0 ? conv / clicks * 100 : null;
  const roas = spend > 0 ? revenue / spend : null;
  const g = String(goal || 'AWARENESS').toUpperCase();

  function KOL_IDS_LEARNING_LEGACY_norm(v, hi) {
    if (v === null || !isFinite(Number(v)) || hi <= 0) return null;
    return KOL_IDS_LEARNING_LEGACY_clamp_(Number(v) / hi * 100, 0, 100);
  }
  function KOL_IDS_LEARNING_LEGACY_weighted(parts) {
    const valid = parts.filter(x => x.v !== null && isFinite(Number(x.v)));
    if (!valid.length) return null;
    const total = valid.reduce((s,x)=>s+x.KOL_IDS_PLATFORM_w,0);
    return valid.reduce((s,x)=>s+Number(x.v)*x.KOL_IDS_PLATFORM_w,0)/total;
  }

  if (g.indexOf('CONVERSION') >= 0) {
    return KOL_IDS_LEARNING_LEGACY_weighted([
      {v:KOL_IDS_LEARNING_LEGACY_norm(roas,6),KOL_IDS_PLATFORM_w:.50},{v:KOL_IDS_LEARNING_LEGACY_norm(cvr,8),KOL_IDS_PLATFORM_w:.25},{v:KOL_IDS_LEARNING_LEGACY_norm(ctr,5),KOL_IDS_PLATFORM_w:.15},{v:KOL_IDS_LEARNING_LEGACY_norm(revenue,500000),KOL_IDS_PLATFORM_w:.10}
    ]);
  }
  if (g.indexOf('ENGAGEMENT') >= 0) {
    return KOL_IDS_LEARNING_LEGACY_weighted([
      {v:KOL_IDS_LEARNING_LEGACY_norm(er,10),KOL_IDS_PLATFORM_w:.65},{v:KOL_IDS_LEARNING_LEGACY_norm(reach ? eng/reach*100 : null,12),KOL_IDS_PLATFORM_w:.20},{v:KOL_IDS_LEARNING_LEGACY_norm(views,2000000),KOL_IDS_PLATFORM_w:.15}
    ]);
  }
  if (g.indexOf('CONSIDERATION') >= 0) {
    return KOL_IDS_LEARNING_LEGACY_weighted([
      {v:KOL_IDS_LEARNING_LEGACY_norm(ctr,5),KOL_IDS_PLATFORM_w:.40},{v:KOL_IDS_LEARNING_LEGACY_norm(er,8),KOL_IDS_PLATFORM_w:.35},{v:KOL_IDS_LEARNING_LEGACY_norm(cvr,8),KOL_IDS_PLATFORM_w:.25}
    ]);
  }
  if (g.indexOf('LAUNCH') >= 0) {
    return KOL_IDS_LEARNING_LEGACY_weighted([
      {v:KOL_IDS_LEARNING_LEGACY_norm(reach,2000000),KOL_IDS_PLATFORM_w:.45},{v:KOL_IDS_LEARNING_LEGACY_norm(views,2000000),KOL_IDS_PLATFORM_w:.25},{v:KOL_IDS_LEARNING_LEGACY_norm(er,8),KOL_IDS_PLATFORM_w:.20},{v:KOL_IDS_LEARNING_LEGACY_norm(ctr,5),KOL_IDS_PLATFORM_w:.10}
    ]);
  }
  return KOL_IDS_LEARNING_LEGACY_weighted([
    {v:KOL_IDS_LEARNING_LEGACY_norm(reach,2000000),KOL_IDS_PLATFORM_w:.55},{v:KOL_IDS_LEARNING_LEGACY_norm(views,2000000),KOL_IDS_PLATFORM_w:.20},{v:KOL_IDS_LEARNING_LEGACY_norm(er,8),KOL_IDS_PLATFORM_w:.25}
  ]);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_rawOutcome_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_rawOutcome_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Evidence quality for KOL_IDS_LEARNING_LEGACY_a completed performance record. */
function KOL_IDS_LEARNING_LEGACY_performanceEvidenceWeight_(r) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_performanceEvidenceWeight_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const status = String(r[12] || '').trim().toUpperCase();
  const ev = String(r[13] || '').trim().toUpperCase();
  let KOL_IDS_PLATFORM_w = 0.55;
  if (status === 'COMPLETED') KOL_IDS_PLATFORM_w += 0.15;
  if (ev === 'VERIFIED') KOL_IDS_PLATFORM_w += 0.30;
  else if (ev === 'SELF-REPORTED') KOL_IDS_PLATFORM_w += 0.15;
  else if (ev === 'ESTIMATED') KOL_IDS_PLATFORM_w += 0.00;
  const coverage = [4,5,6,7,8,9,10,11].filter(i => KOL_IDS_LEARNING_LEGACY_num_(r[i]) !== null).length / 8;
  return KOL_IDS_LEARNING_LEGACY_clamp_(KOL_IDS_PLATFORM_w * (0.65 + coverage * 0.35), 0, 1);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_performanceEvidenceWeight_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_performanceEvidenceWeight_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_getPerformanceRows_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_getPerformanceRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh = KOL_IDS_PA_legacyProjection_(ss);
  if (!sh || sh.getLastRow() < 2) return [];
  const rows = KOL_IDS_LEARNING_LEGACY_values_(sh);
  return rows.filter(r => String(r[0] || '').trim() !== '');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_getPerformanceRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_getPerformanceRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_values_(sh) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_values_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_values_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_values_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/*
 * Resolve Campaign Goal using the V5_CAMPAIGNS header map first, then
 * the V5_DECISIONS row. This avoids hard-coded column drift.
 */
function KOL_IDS_LEARNING_LEGACY_getGoalForCampaign_(ss, campaignId, creatorId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_getGoalForCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const camp = ss.getSheetByName('ENT_CAMPAIGNS');
  if (camp && camp.getLastRow() >= 2) {
    const cm = KOL_IDS_LEARNING_LEGACY_colMap_(camp);
    const rows = KOL_IDS_LEARNING_LEGACY_values_(camp);
    const row = rows.find(r => String(r[0]) === String(campaignId));
    if (row && cm['Campaign Goal'] != null && row[cm['Campaign Goal']]) return String(row[cm['Campaign Goal']]).toUpperCase();
    if (row && cm['Goal'] != null && row[cm['Goal']]) return String(row[cm['Goal']]).toUpperCase();
  }
  const dec = ss.getSheetByName('ENT_DECISIONS');
  if (dec && dec.getLastRow() >= 2) {
    const dm = KOL_IDS_LEARNING_LEGACY_colMap_(dec);
    const rows = KOL_IDS_LEARNING_LEGACY_values_(dec);
    const row = rows.filter(r => String(r[1]) === String(campaignId) && String(r[2]) === String(creatorId))
      .sort((KOL_IDS_LEARNING_LEGACY_a,b)=>new Date(b[15])-new Date(KOL_IDS_LEARNING_LEGACY_a[15]))[0];
    if (row && dm['Campaign Goal'] != null && row[dm['Campaign Goal']]) return String(row[dm['Campaign Goal']]).toUpperCase();
  }
  return '';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_getGoalForCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_getGoalForCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_colMap_(sh) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_colMap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  const m = {};
  h.forEach((x,i)=>{m[String(x).trim()] = i;});
  return m;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_colMap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_colMap_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/*
 * Robust cross-campaign signal:
 * - goal-matched only
 * - invalid rows excluded
 * - recency KOL_IDS_LEARNING_LEGACY_weighted
 * - outcome variance reduces confidence
 * - small samples are shrunk toward neutral 50
 */
function KOL_IDS_LEARNING_LEGACY_historicalSignal_(ss, creatorId, goal) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_historicalSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const rows = KOL_IDS_LEARNING_LEGACY_getPerformanceRows_(ss);
  const g = String(goal || '').toUpperCase();
  const samples = [];

  rows.forEach(r => {
    if (String(r[2]) !== String(creatorId)) return;
    if (String(r[12] || '').toUpperCase() !== 'COMPLETED') return;
    const validation = KOL_IDS_LEARNING_LEGACY_validatePerformance_(r);
    if (!validation.valid) return;
    const cg = KOL_IDS_LEARNING_LEGACY_getGoalForCampaign_(ss, r[1], creatorId);
    if (cg && g && cg !== g) return;
    if (!cg && g) return; // never assume an unknown goal matches
    const raw = KOL_IDS_LEARNING_LEGACY_rawOutcome_(r, g || cg);
    if (raw === null) return;
    const recency = KOL_IDS_LEARNING_LEGACY_recencyWeight_(r[14] || r[15] || r[16]);
    const evidence = KOL_IDS_LEARNING_LEGACY_performanceEvidenceWeight_(r);
    samples.push({score:raw, weight:recency*evidence, date:r[14] || r[15] || r[16]});
  });

  if (!samples.length) return {score:50, adjustment:0, sampleSize:0, confidence:0, status:'NO_HISTORY'};

  const weights = samples.map(x=>x.weight);
  const totalW = weights.reduce((KOL_IDS_LEARNING_LEGACY_a,b)=>KOL_IDS_LEARNING_LEGACY_a+b,0);
  const mean = samples.reduce((s,x)=>s+x.score*x.weight,0)/Math.max(totalW,0.0001);
  const median = KOL_IDS_LEARNING_LEGACY_median_(samples.map(x=>x.score));
  const dispersion = KOL_IDS_LEARNING_LEGACY_std_(samples.map(x=>x.score));

  /* Median/mean blend is more robust than using either alone. */
  const outcome = KOL_IDS_LEARNING_LEGACY_clamp_(mean*0.60 + median*0.40, 0, 100);
  const effectiveN = Math.min(10, totalW);
  const sampleConfidence = 25 + Math.min(50, effectiveN * 12);
  const stability = KOL_IDS_LEARNING_LEGACY_clamp_(100 - dispersion * 1.25, 25, 100);
  const confidence = Math.round(sampleConfidence * 0.65 + stability * 0.35);

  /* Shrink aggressively until enough real observations exist. */
  const shrink = Math.min(0.85, effectiveN / (effectiveN + 4));
  const shrunkScore = 50 + (outcome - 50) * shrink;
  const adjustment = KOL_IDS_LEARNING_LEGACY_clamp_((shrunkScore - 50) * 0.35, -KOL_IDS.MAX_ADJUSTMENT, KOL_IDS.MAX_ADJUSTMENT);

  return {
    score: Math.round(shrunkScore),
    adjustment: Math.round(adjustment * 100) / 100,
    sampleSize: samples.length,
    effectiveSampleSize: Math.round(effectiveN*100)/100,
    confidence: confidence,
    dispersion: Math.round(dispersion*100)/100,
    status: samples.length >= KOL_IDS.MIN_SAMPLE_FOR_STRONG_LEARNING ? 'LEARNING_ACTIVE' : 'EARLY_SIGNAL'
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_historicalSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_historicalSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/*
 * Public internal bridge used by KBIS V6 engine.
 */
// Legacy V6.1 implementation retained under an explicit name. V7 owns the
// canonical KOL_IDS_ADAPTIVE_getLearningSignal_ bridge used by the current engine.
function KOL_IDS_LEARNING_LEGACY_getLearningSignalLegacy_(ss, creatorId, goal) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_getLearningSignalLegacy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_LEARNING_LEGACY_historicalSignal_(ss, creatorId, goal);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_getLearningSignalLegacy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_getLearningSignalLegacy_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/*
 * Persist KOL_IDS_LEARNING_LEGACY_a transparent learning ledger. This is not used to secretly alter
 * scores; it is an audit trail of exactly what the learning layer observed.
 */
function KOL_IDS_LEARNING_LEGACY_ensureLearningSheet_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_ensureLearningSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let sh = ss.getSheetByName('ENT_LEARNING_LOOP');
  if (!sh) sh = ss.insertSheet('ENT_LEARNING_LOOP');
  const headers = [
    'Learning ID','Campaign ID','Creator ID','Goal','Raw Outcome Score',
    'Predicted Score','Prediction Error','Evidence Weight','Recency Weight',
    'Learning Adjustment','Sample Size','Historical Confidence','Data Valid',
    'Observed At','Model Version'
  ];
  const existing = sh.getLastColumn() ? sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0] : [];
  const missing = headers.filter(h => existing.indexOf(h) < 0);
  if (!existing.length || !existing[0]) sh.getRange(1,1,1,headers.length).setValues([headers]);
  else if (missing.length) {
    sh.getRange(1,existing.length+1,1,missing.length).setValues([missing]);
  }
  sh.setFrozenRows(1);
  return sh;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_ensureLearningSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_ensureLearningSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_syncLearningLedger() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_syncLearningLedger');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss = KOL_IDS_SYSTEM_getSpreadsheet_();
  const sh = KOL_IDS_PA_legacyProjection_(ss);
  if (!sh || sh.getLastRow() < 2) return {success:true, processed:0, message:'No completed performance data yet.'};
  const rows = KOL_IDS_LEARNING_LEGACY_getPerformanceRows_(ss);
  const ledger = KOL_IDS_LEARNING_LEGACY_ensureLearningSheet_(ss);
  const lm = KOL_IDS_LEARNING_LEGACY_colMap_(ledger);
  const existing = KOL_IDS_LEARNING_LEGACY_values_(ledger);
  let processed = 0;

  rows.forEach(r => {
    if (String(r[12] || '').toUpperCase() !== 'COMPLETED') return;
    const valid = KOL_IDS_LEARNING_LEGACY_validatePerformance_(r);
    if (!valid.valid) return;
    const campaignId = r[1], creatorId = r[2];
    const goal = KOL_IDS_LEARNING_LEGACY_getGoalForCampaign_(ss, campaignId, creatorId);
    if (!goal) return;
    const raw = KOL_IDS_LEARNING_LEGACY_rawOutcome_(r, goal);
    if (raw === null) return;
    const signal = KOL_IDS_LEARNING_LEGACY_historicalSignal_(ss, creatorId, goal);
    const prediction = KOL_IDS_LEARNING_LEGACY_getPrediction_(ss, campaignId, creatorId);
    const rowData = {
      'Campaign ID':campaignId,'Creator ID':creatorId,'Goal':goal,
      'Raw Outcome Score':Math.round(raw*100)/100,
      'Predicted Score':prediction,
      'Prediction Error':prediction===null?'':Math.round((raw-prediction)*100)/100,
      'Evidence Weight':KOL_IDS_LEARNING_LEGACY_performanceEvidenceWeight_(r),
      'Recency Weight':KOL_IDS_LEARNING_LEGACY_recencyWeight_(r[14] || r[15] || r[16]),
      'Learning Adjustment':signal.adjustment,
      'Sample Size':signal.sampleSize,
      'Historical Confidence':signal.confidence,
      'Data Valid':'YES',
      'Observed At':r[14] || r[15] || r[16] || new Date(),
      'Model Version':KOL_IDS.VERSION
    };
    const key = String(campaignId)+'|'+String(creatorId);
    const i = existing.findIndex(x=>String(x[lm['Campaign ID']])+'|'+String(x[lm['Creator ID']])===key);
    const vals = KOL_IDS_LEARNING_LEGACY_setByHeader_(ledger, Object.assign({'Learning ID': i>=0 ? existing[i][lm['Learning ID']] : 'V61-'+Utilities.getUuid().slice(0,8).toUpperCase()}, rowData));
    if (i>=0) ledger.getRange(i+2,1,1,vals.length).setValues([vals]);
    else ledger.appendRow(vals);
    processed++;
  });

  return {success:true, processed:processed, sheet:'ENT_LEARNING_LOOP', version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_syncLearningLedger', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_syncLearningLedger', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_getPrediction_(ss, campaignId, creatorId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_getPrediction_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh = ss.getSheetByName('ENT_DECISIONS');
  if (!sh || sh.getLastRow() < 2) return null;
  const dm = KOL_IDS_LEARNING_LEGACY_colMap_(sh);
  const rows = KOL_IDS_LEARNING_LEGACY_values_(sh);
  const r = rows.filter(x=>String(x[1])===String(campaignId)&&String(x[2])===String(creatorId))
    .sort((KOL_IDS_LEARNING_LEGACY_a,b)=>new Date(b[15])-new Date(KOL_IDS_LEARNING_LEGACY_a[15]))[0];
  if (!r) return null;
  if (dm['Score'] != null) return KOL_IDS_LEARNING_LEGACY_num_(r[dm['Score']]);
  return KOL_IDS_LEARNING_LEGACY_num_(r[5]);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_getPrediction_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_getPrediction_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_LEARNING_LEGACY_setByHeader_(sh, data) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_setByHeader_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  return headers.map(h => Object.prototype.hasOwnProperty.call(data,h) ? data[h] : '');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_setByHeader_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_setByHeader_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/*
 * QA:
 * Pure logic checks can run in Apps Script without customer data.
 */
function KOL_IDS_LEARNING_LEGACY_ACCURACY_QA() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_LEARNING_LEGACY_ACCURACY_QA');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const failures = [];
  function KOL_IDS_LEARNING_LEGACY_a(name, ok, detail) { if (!ok) failures.push(name+': '+(detail||'failed')); }

  const valid = ['', '', 'C', 'Name', 1000, 1000, 2000, 1500, 100, 50, 5, 5000, 'COMPLETED', 'VERIFIED', new Date()];
  const invalid = ['', '', 'C', 'Name', 1000, 2000, 1000, 1500, 100, 50, 5, 5000, 'COMPLETED', 'VERIFIED', new Date()];
  KOL_IDS_LEARNING_LEGACY_a('valid performance relationships', KOL_IDS_LEARNING_LEGACY_validatePerformance_(valid).valid);
  KOL_IDS_LEARNING_LEGACY_a('invalid reach/impression relationship detected', !KOL_IDS_LEARNING_LEGACY_validatePerformance_(invalid).valid);
  KOL_IDS_LEARNING_LEGACY_a('raw outcome bounded', KOL_IDS_LEARNING_LEGACY_rawOutcome_(valid,'CONVERSION') >= 0 && KOL_IDS_LEARNING_LEGACY_rawOutcome_(valid,'CONVERSION') <= 100);
  KOL_IDS_LEARNING_LEGACY_a('recency bounded', KOL_IDS_LEARNING_LEGACY_recencyWeight_(new Date()) <= 1 && KOL_IDS_LEARNING_LEGACY_recencyWeight_(new Date()) > 0);
  KOL_IDS_LEARNING_LEGACY_a('small sample shrinks toward neutral', Math.abs(KOL_IDS_LEARNING_LEGACY_historicalSignal_({getSheetByName:function(){return null;}},'x','AWARENESS').score-50)===0);
  return {success:failures.length===0, failures:failures, tests:5, version:KOL_IDS.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_LEARNING_LEGACY_ACCURACY_QA', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_LEARNING_LEGACY_ACCURACY_QA', Date.now() - __kolIdsTraceStartedAt);
  }
}
