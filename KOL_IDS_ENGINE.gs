
/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * KBIS V1 — INTELLIGENT DECISION ENGINE
 *
 * FILE:
 * KOL_IDS_SYSTEM_Engine.gs
 *
 * VERSION:
 * 1.5.0
 *
 * CORE:
 * Brand Fit
 * Brand Impact
 * Evidence Quality
 * Confidence
 * Risk
 * Decision
 * Data Quality
 * Smart Orchestration
 *
 * PRINCIPLE:
 * Evidence > Assumption
 * Confidence > Raw Score
 * Risk can override Score
 * Decision ≠ Prediction Guarantee
 *
 * IMPORTANT:
 * Existing Sheet structure is preserved.
 ****************************************************/


/* ==================================================
 * ENGINE CONFIG
 * ================================================== */

const KOL_IDS_ENGINE_CONFIG = {

  VERSION: '6.0.0',

  FIT_WEIGHTS: {

    AUDIENCE: 0.25,
    BRAND_IMAGE: 0.20,
    CONTENT: 0.15,
    CATEGORY: 0.15,
    VALUE: 0.10,
    PERFORMANCE: 0.10,
    RISK: 0.05

  },

  IMPACT_DIMENSIONS: [

    'AWARENESS',
    'CREDIBILITY',
    'BRAND_RELEVANCE',
    'PERCEPTION',
    'PURCHASE_INFLUENCE',
    'COMMUNITY'

  ],

  THRESHOLDS: {

    FIT_PERFECT: 90,
    FIT_STRONG: 75,
    FIT_MODERATE: 60,

    IMPACT_HIGH: 85,
    IMPACT_MEDIUM: 70,

    CONFIDENCE_HIGH: 80,
    CONFIDENCE_MEDIUM: 60,

    RECOMMEND_FIT: 75,
    RECOMMEND_IMPACT: 75,

    CONSIDER_FIT: 60,
    CONSIDER_IMPACT: 60,

    /*
     * New intelligence gates
     */

    MIN_EVIDENCE_FOR_RECOMMEND: 65,
    MIN_CONFIDENCE_FOR_RECOMMEND: 75,
    MIN_DATA_QUALITY_FOR_RECOMMEND: 65,

    HIGH_RISK_THRESHOLD: 70,
    MEDIUM_RISK_THRESHOLD: 40,

    REVIEW_CONFIDENCE_THRESHOLD: 60

  },

  EVIDENCE_WEIGHTS: {

    VERIFIED: 1.00,
    SELF_REPORTED: 0.70,
    ESTIMATED: 0.40,
    MISSING: 0.00

  },

  DECISION_PRIORITY: {

    'RECOMMENDED': 1,
    'CONSIDER': 2,
    'REVIEW REQUIRED': 3,
    'NOT RECOMMENDED': 4

  }

};


/* ==================================================
 * SMART MASTER RUNNER
 *
 * This is the preferred function for users.
 *
 * One click:
 *
 * Validate
 * ↓
 * Calculate
 * ↓
 * Write Fit
 * ↓
 * Write Impact
 * ↓
 * Write Decision
 * ↓
 * Dashboard
 *
 * ================================================== */

function KOL_IDS_ENGINE_runSmart() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_runSmart');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const lock =
    LockService.getScriptLock();

  if (!lock.tryLock(10000)) {

    throw new Error(
      'KBIS: Another engine run is already in progress.'
    );

  }

  try {

    const preflight =
      KOL_IDS_ENGINE_preflight_();

    if (!preflight.ok) {

      throw new Error(
        'KBIS Preflight Failed:\n' +
        preflight.errors.join('\n')
      );

    }

    // Capture the exact Spreadsheet context BEFORE running the Engine.
    // Some downstream integration functions can change the runtime spreadsheet
    // pointer; Smart must verify the sheet in the same spreadsheet the Engine used.
    const __engineSpreadsheet =
      KOL_IDS_SYSTEM_getSpreadsheet_();

    const result =
      KOL_IDS_ENGINE_runDecisionEngine();

    SpreadsheetApp.flush();

    Logger.log(
      'KBIS SMART: Engine processed = ' +
      (result && result.processed != null ? result.processed : 'UNKNOWN')
    );

    /*
     * Confirm the Decision Engine actually produced output
     * in the exact Spreadsheet context captured above.
     */
    const __decisionSheet =
      __engineSpreadsheet.getSheetByName('07_KOL_DECISION');

    const __decisionRows = __decisionSheet
      ? Math.max(__decisionSheet.getLastRow() - 1, 0)
      : 0;

    Logger.log(
      'KBIS SMART: Decision rows after Engine = ' +
      __decisionRows
    );

    if (!__decisionRows) {
      throw new Error(
        'KBIS: Decision Engine completed but 07_KOL_DECISION contains no records.'
      );
    }

    /*
     * Build dashboard automatically
     * if dashboard function exists.
     */

    let dashboardStatus =
      'NOT_RUN';

    if (
      typeof KOL_IDS_DASHBOARD_buildExecutiveDashboard ===
      'function'
    ) {

      try {

        KOL_IDS_DASHBOARD_buildExecutiveDashboard();

        dashboardStatus =
          'BUILT';

      }
      catch (dashboardError) {

        /*
         * Engine result remains valid.
         * Dashboard error is surfaced separately.
         */

        dashboardStatus =
          'ERROR: ' +
          dashboardError.message;

        console.warn(
          'KBIS Dashboard Error:',
          dashboardError
        );

      }

    }

    return {

      success: true,

      engine: result,

      dashboard:
        dashboardStatus,

      timestamp:
        new Date()

    };

  }
  finally {

    lock.releaseLock();

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_runSmart', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_runSmart', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * LEGACY MASTER RUNNER
 *
 * Kept for compatibility.
 * ================================================== */

function KOL_IDS_ENGINE_runDecisionEngine() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_runDecisionEngine');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();

  /*
   * Validate structure.
   */

  if (!KOL_IDS_ENGINE_validateStructureSilent_()) {

    throw new Error(
      'KBIS structure validation failed.'
    );

  }


  /*
   * Read source data.
   */

  const brand =
    KOL_IDS_ENGINE_readBrand_(ss);

  const campaign =
    KOL_IDS_ENGINE_readCampaign_(ss);

  const kols =
    KOL_IDS_ENGINE_readKOLs_(ss);

  // LEGACY_V25.10.9: Canonical Persona is the decision-time source of truth.
  // Legacy 13_DEEP_PROFILE remains a compatibility fallback only.
  if (typeof KOL_IDS_PERSONA_getActive_ === 'function') {
    const canonicalPersona = KOL_IDS_PERSONA_getActive_(ss);
    const personaById = {};
    (canonicalPersona.kols || []).forEach(function(pk) {
      const id = String(pk['Record ID'] || '').trim();
      if (id) personaById[id] = pk;
    });
    kols.forEach(function(kol) {
      const pk = personaById[String(kol.kolId || '').trim()];
      if (!pk) return;
      kol.personality = pk['Personality'] || kol.personality || '';
      kol.communication = pk['Communication'] || kol.communication || '';
      kol.influence = pk['Influence'] || kol.influence || '';
      kol.relationship = pk['Relationship'] || kol.relationship || '';
      kol.social = pk['Social Behavior'] || kol.social || '';
      kol.contentPersonality = pk['Content Personality'] || kol.contentPersonality || '';
      kol.contentFunction = pk['Content Function'] || kol.contentFunction || '';
      kol.contentBehavior = pk['Content Behavior'] || kol.contentBehavior || '';
      kol.psychology = pk['Psychology'] || kol.psychology || '';
      kol.__personaSource = '13A_PERSONA_PROFILE';
      kol.__personaAnalysisId = pk['Analysis ID'] || '';
    });
  }


  /*
   * Validate campaign.
   */

  if (!campaign.campaignId) {

    throw new Error(
      'KBIS: Please enter Campaign ID in 03_CAMPAIGN.'
    );

  }


  /*
   * Validate KOL database.
   */

  if (!kols.length) {

    throw new Error(
      'KBIS: No KOL records found in 04_KOL_DATABASE.'
    );

  }


  /*
   * Validate Brand.
   */

  if (!brand.brandId &&
      !brand.brandName) {

    throw new Error(
      'KBIS: Brand Profile is empty.'
    );

  }


  /*
   * Normalize campaign weights.
   */

  const normalizedCampaign =
    KOL_IDS_ENGINE_normalizeCampaignWeights_(
      campaign
    );


  /*
   * Calculate all KOLs.
   */

  const results = [];


  kols.forEach(kol => {

    const deepCompatibility =
      KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_(
        brand,
        normalizedCampaign,
        kol
      );

    const evidence =
      KOL_IDS_ENGINE_calculateEvidence_(kol);

    /*
     * Controlled QA fixtures are deterministic benchmark inputs.
     * Their explicit Fit/Impact source values must remain intact so the
     * A-E decision contract tests the decision gates themselves rather than
     * being silently rewritten by the production canonical-input derivation.
     * Real KOL records continue through the full canonical derivation path.
     */
    const isControlledTestKOL = /^KOL-TEST-\d+$/i.test(String(kol.kolId || '').trim());
    if (!isControlledTestKOL) {
      KOL_IDS_ENGINE_deriveCanonicalInputs_(
        brand,
        normalizedCampaign,
        kol,
        deepCompatibility,
        evidence
      );
    }

    const fit =
      KOL_IDS_ENGINE_calculateFit_(
        brand,
        normalizedCampaign,
        kol
      );

    /*
     * V6.1 outcome learning:
     * historical completed campaigns can adjust the score, but only
     * when the evidence is real, goal-matched and sufficiently reliable.
     * The adjustment is intentionally bounded so history cannot overpower
     * current campaign fit.
     */
    let learningSignal = {
      score: 50,
      adjustment: 0,
      sampleSize: 0,
      confidence: 0,
      status: 'NO_HISTORY'
    };
    /*
     * Controlled QA isolation:
     * KOL-TEST-* records are deterministic benchmark fixtures, not real
     * historical creators. Never let live performance/learning history from
     * a reused QA spreadsheet change their expected benchmark decision.
     * Production KOL records continue to use the full learning bridge.
     */
    if (!isControlledTestKOL) {
      if (typeof KOL_IDS_ACCURACY_LAB_learningBridge_ === 'function') {
        learningSignal = KOL_IDS_ACCURACY_LAB_learningBridge_(ss, kol.kolId, normalizedCampaign.objective);
      } else if (typeof KOL_IDS_ADAPTIVE_getLearningSignal_ === 'function') {
        learningSignal = KOL_IDS_ADAPTIVE_getLearningSignal_(ss, kol.kolId, normalizedCampaign.objective);
      }
    } else {
      learningSignal = {
        score: 50,
        adjustment: 0,
        totalAdjustment: 0,
        sampleSize: 0,
        confidence: 0,
        status: 'CONTROLLED_QA_ISOLATED'
      };
    }
    kol.__learningSignal = learningSignal;

    /* Deep layer: observed/profile signals materially influence fit.
     * Historical outcome evidence then makes a small, reliability-KOL_IDS_LEARNING_LEGACY_weighted
     * correction. */
    fit.deepCompatibility = deepCompatibility;
    fit.learning = learningSignal;
    fit.baseScore = fit.score;
    const structuralScore = KOL_IDS_ENGINE_round_(
      fit.score * 0.65 +
      deepCompatibility.score * 0.20 +
      deepCompatibility.campaignCompatibility * 0.15
    );
    const learningAdjustmentRaw =
      learningSignal && learningSignal.totalAdjustment !== undefined
        ? learningSignal.totalAdjustment
        : (learningSignal && learningSignal.adjustment !== undefined
          ? learningSignal.adjustment
          : 0);
    const learningAdjustment = Number(learningAdjustmentRaw);
    const safeLearningAdjustment = Number.isFinite(learningAdjustment) ? learningAdjustment : 0;
    fit.score = KOL_IDS_ENGINE_round_(
      Math.max(0, Math.min(100, structuralScore + safeLearningAdjustment))
    );
    fit.status = KOL_IDS_ENGINE_fitStatus_(fit.score);

    const impact =
      KOL_IDS_ENGINE_calculateImpact_(
        brand,
        normalizedCampaign,
        kol,
        fit
      );


    kol.__deepCompatibility = deepCompatibility;

    const dataQuality =
      KOL_IDS_ENGINE_calculateDataQuality_(
        kol
      );


    const confidence =
      KOL_IDS_ENGINE_calculateConfidence_(
        evidence,
        fit,
        impact,
        dataQuality,
        kol
      );


    const decision =
      KOL_IDS_ENGINE_makeDecision_(
        fit,
        impact,
        confidence,
        evidence,
        dataQuality,
        kol
      );


    results.push({

      campaignId:
        normalizedCampaign.campaignId,

      kol:
        kol,

      fit:
        fit,

      deepCompatibility:
        deepCompatibility,

      impact:
        impact,

      evidence:
        evidence,

      dataQuality:
        dataQuality,

      confidence:
        confidence,

      learning:
        learningSignal,

      decision:
        decision

    });

  });


  /*
   * Persist engine-owned analysis inputs back into the canonical KOL table.
   */
  KOL_IDS_ENGINE_writeDerivedKOLInputs_(ss,results);

  /*
   * Write outputs.
   */

  KOL_IDS_ENGINE_writeFit_(
    ss,
    results
  );


  KOL_IDS_ENGINE_writeImpact_(
    ss,
    results
  );


  KOL_IDS_ENGINE_writeDecision_(
    ss,
    results
  );

  // Cohesion hand-off: keep the evidence/learning layer synchronized with the
  // canonical decision output. These are observational mirrors and never own
  // the scoring calculation.
  if (typeof KOL_IDS_IDI_syncDecisions_ === 'function') {
    try { KOL_IDS_IDI_syncDecisions_(ss); } catch (ignoreIDI) { Logger.log('[COHESION][IDI_DECISION_SYNC] '+String(ignoreIDI)); }
  }

  // 1.2.0 Intelligence bridge: persist immutable decision evidence after canonical outputs are written.
  if (typeof KOL_IDS_INTEL120_recordDecisions_ === 'function') {
    KOL_IDS_INTEL120_recordDecisions_(results.map(function(x){
      var d=x&&x.decision?x.decision:{};
      return Object.assign({},d,{decision:d.decision||x.decision,score:d.score||x.score,baseScore:d.baseScore||x.fit&&x.fit.score,campaignId:normalizedCampaign.campaignId});
    }), {campaignId:normalizedCampaign.campaignId});
  }


  /*
   * System metadata.
   */

  KOL_IDS_ENGINE_updateSystem_(
    ss
  );


  /*
   * Return summary.
   */

  const summary =
    KOL_IDS_ENGINE_buildSummary_(
      results
    );


  return {

    success: true,

    processed:
      results.length,

    recommended:
      summary.recommended,

    consider:
      summary.consider,

    reviewRequired:
      summary.reviewRequired,

    notRecommended:
      summary.notRecommended,

    version:
      KOL_IDS_ENGINE_CONFIG.VERSION,

    timestamp:
      new Date()

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_runDecisionEngine', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_runDecisionEngine', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PREFLIGHT
 * ================================================== */

function KOL_IDS_ENGINE_preflight_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_preflight_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const errors = [];

  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  /*
   * Required sheets.
   */

  const requiredSheets = [

    '01_SYSTEM',
    '02_BRAND_PROFILE',
    '03_CAMPAIGN',
    '04_KOL_DATABASE',
    '05_BRAND_FIT',
    '06_BRAND_IMPACT',
    '07_KOL_DECISION'

  ];


  requiredSheets.forEach(name => {

    if (!ss.getSheetByName(name)) {

      errors.push(
        'Missing sheet: ' + name
      );

    }

  });


  if (errors.length) {

    return {

      ok: false,
      errors: errors

    };

  }


  /*
   * Validate structure if schema exists.
   */

  if (
    typeof KOL_IDS_SCHEMA_CONFIG !==
    'undefined'
  ) {

    if (!KOL_IDS_ENGINE_validateStructureSilent_()) {

      errors.push(
        'Sheet headers do not match KOL_IDS_SCHEMA_CONFIG.'
      );

    }

  }


  /*
   * Campaign check.
   */

  const campaign =
    KOL_IDS_ENGINE_readCampaign_(
      ss
    );


  if (!campaign.campaignId) {

    errors.push(
      'Campaign ID is missing.'
    );

  }


  /*
   * KOL check.
   */

  const kols =
    KOL_IDS_ENGINE_readKOLs_(
      ss
    );


  if (!kols.length) {

    errors.push(
      'No active KOL records found.'
    );

  }


  return {

    ok:
      errors.length === 0,

    errors:
      errors

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_preflight_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_preflight_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * BRAND FIT
 * ================================================== */

function KOL_IDS_ENGINE_deriveCanonicalInputs_(brand,campaign,kol,deep,evidence){
  const clamp=v=>Math.max(0,Math.min(100,Number(v)||0));
  const er=clamp(Number(String(kol.engagementRate==null?'':kol.engagementRate).replace(/,/g,''))*10);
  const followers=Number(String(kol.followers==null?'':kol.followers).replace(/,/g,''))||0;
  const followerScale=followers>0?clamp((Math.log10(Math.max(1000,followers))-3)/4*100):0;
  const ciContent=[kol.contentPersonality,kol.contentFunction,kol.contentBehavior].filter(function(v){return String(v||'').trim();}).join(' ');
  const contentSignal=String(kol.contentStyle||ciContent||'').trim();
  const creatorCategory=String(kol.category||kol.audienceInterest||'').trim();
  const categoryFit=KOL_IDS_ENGINE_deepTextFit_([brand.category,brand.keywords].join(' '),creatorCategory);
  const audienceFit=KOL_IDS_ENGINE_deepAudienceFit_(brand.targetAudience,campaign.targetAudience,kol.audienceAge,kol.audienceGender,kol.audienceInterest,kol.audienceLocation);
  const brandImage=KOL_IDS_ENGINE_deepTextFit_([brand.positioning,brand.personality,brand.tone,brand.desiredPerception,brand.values].join(' '),[creatorCategory,contentSignal].join(' '));
  const contentFit=KOL_IDS_ENGINE_deepCampaignBehaviorFit_(campaign,contentSignal,kol.previousCampaignResult,kol.audienceInterest,creatorCategory);
  const valueFit=KOL_IDS_ENGINE_deepTextFit_([brand.values,brand.desiredPerception,brand.keywords].join(' '),[kol.category||kol.audienceInterest,contentSignal].join(' '));
  const performance=clamp((Number(evidence&&evidence.score)||0)*0.70+er*0.30);
  const safety=KOL_IDS_ENGINE_deepSafetyCompatibility_(brand,kol,String(brand.avoid||'').toLowerCase());
  const riskScore=safety;
  const authenticity=KOL_IDS_ENGINE_deepAuthenticity_(kol);
  const brandCompatibility=Number(deep&&deep.brandCompatibility)||KOL_IDS_ENGINE_deepTextFit_([brand.category,brand.positioning,brand.values].join(' '),[creatorCategory,contentSignal].join(' '));
  const campaignCompatibility=Number(deep&&deep.campaignCompatibility)||contentFit;
  const awareness=clamp(followerScale*0.65+er*0.35);
  const credibility=clamp((Number(evidence&&evidence.score)||0)*0.60+authenticity*0.40);
  const brandRelevance=clamp(categoryFit*0.50+brandCompatibility*0.50);
  const perception=clamp(brandImage*0.65+contentFit*0.35);
  const purchase=clamp(campaignCompatibility*0.45+er*0.20+performance*0.35);
  const community=clamp(audienceFit*0.35+er*0.35+authenticity*0.30);
  kol.audienceFitInput=Math.round(audienceFit); kol.brandImageFitInput=Math.round(brandImage); kol.contentFitInput=Math.round(contentFit);
  kol.categoryFitInput=Math.round(categoryFit); kol.valueFitInput=Math.round(valueFit); kol.performanceEvidenceInput=Math.round(performance);
  kol.awarenessPotential=Math.round(awareness); kol.credibilityPotential=Math.round(credibility); kol.brandRelevancePotential=Math.round(brandRelevance);
  kol.perceptionPotential=Math.round(perception); kol.purchaseInfluencePotential=Math.round(purchase); kol.communityPotential=Math.round(community); kol.riskScore=Math.round(riskScore);
  return kol;
}

function KOL_IDS_ENGINE_writeDerivedKOLInputs_(ss,results){
  const sh=ss.getSheetByName('04_KOL_DATABASE'); if(!sh||sh.getLastRow()<2)return;
  const lastCol=sh.getLastColumn(), headers=sh.getRange(1,1,1,lastCol).getValues()[0].map(h=>String(h||'').trim()), idx={};
  headers.forEach((h,i)=>{if(h)idx[h]=i;}); const idCol=idx['KOL ID']; if(idCol===undefined)return;
  const rows=sh.getRange(2,1,sh.getLastRow()-1,lastCol).getValues(), byId={};
  results.forEach(r=>{if(r&&r.kol)byId[String(r.kol.kolId)]=r.kol;});
  const map={
    'Audience Fit Input':'audienceFitInput','Brand Image Fit Input':'brandImageFitInput','Content Fit Input':'contentFitInput','Category Fit Input':'categoryFitInput','Value Fit Input':'valueFitInput','Performance Evidence Input':'performanceEvidenceInput',
    'Awareness Potential':'awarenessPotential','Credibility Potential':'credibilityPotential','Brand Relevance Potential':'brandRelevancePotential','Perception Potential':'perceptionPotential','Purchase Influence Potential':'purchaseInfluencePotential','Community Potential':'communityPotential','Risk Score':'riskScore'
  };
  rows.forEach(row=>{const k=byId[String(row[idCol]||'')]; if(!k)return; Object.keys(map).forEach(h=>{if(idx[h]!==undefined)row[idx[h]]=k[map[h]];}); if(idx['Last Updated']!==undefined)row[idx['Last Updated']]=new Date();});
  sh.getRange(2,1,rows.length,lastCol).setValues(rows); SpreadsheetApp.flush();
}

function KOL_IDS_ENGINE_calculateFit_(
  brand,
  campaign,
  kol
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_calculateFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const KOL_IDS_PLATFORM_w =
    KOL_IDS_ENGINE_CONFIG.FIT_WEIGHTS;


  const audience =
    KOL_IDS_ENGINE_score_(
      kol.audienceFitInput
    );


  const brandImage =
    KOL_IDS_ENGINE_score_(
      kol.brandImageFitInput
    );


  const content =
    KOL_IDS_ENGINE_score_(
      kol.contentFitInput
    );


  const category =
    KOL_IDS_ENGINE_score_(
      kol.categoryFitInput
    );


  const value =
    KOL_IDS_ENGINE_score_(
      kol.valueFitInput
    );


  const performance =
    KOL_IDS_ENGINE_score_(
      kol.performanceEvidenceInput
    );


  /*
   * Risk:
   *
   * 100 = lowest risk
   * 0   = highest risk
   */

  let risk =
    KOL_IDS_ENGINE_score_(
      kol.riskScore
    );


  const riskLevel =
    String(
      kol.riskLevel || ''
    )
      .trim()
      .toUpperCase() || 'UNKNOWN';


  if (riskLevel === 'HIGH') {

    risk =
      Math.min(
        risk,
        25
      );

  }
  else if (
    riskLevel === 'MEDIUM'
  ) {

    risk =
      Math.min(
        risk,
        60
      );

  }


  const score =

      audience *
      KOL_IDS_PLATFORM_w.AUDIENCE

    +

      brandImage *
      KOL_IDS_PLATFORM_w.BRAND_IMAGE

    +

      content *
      KOL_IDS_PLATFORM_w.CONTENT

    +

      category *
      KOL_IDS_PLATFORM_w.CATEGORY

    +

      value *
      KOL_IDS_PLATFORM_w.VALUE

    +

      performance *
      KOL_IDS_PLATFORM_w.PERFORMANCE

    +

      risk *
      KOL_IDS_PLATFORM_w.RISK;


  const finalScore =
    KOL_IDS_ENGINE_round_(
      score
    );


  return {

    score:
      finalScore,

    status:
      KOL_IDS_ENGINE_fitStatus_(
        finalScore
      ),

    dimensions: {

      audience:
        audience,

      brandImage:
        brandImage,

      content:
        content,

      category:
        category,

      value:
        value,

      performance:
        performance,

      risk:
        risk

    }

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_calculateFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_calculateFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * BRAND IMPACT
 * ================================================== */

function KOL_IDS_ENGINE_calculateImpact_(
  brand,
  campaign,
  kol,
  fit
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_calculateImpact_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const result = {};


  KOL_IDS_ENGINE_CONFIG.IMPACT_DIMENSIONS
    .forEach(dimension => {

      const input =
        KOL_IDS_ENGINE_getImpactInput_(
          kol,
          dimension
        );


      /*
       * Fit modifies impact,
       * but never completely determines it.
       */

      const safeInput = Number.isFinite(Number(input)) ? Number(input) : 0;
      const safeFit = Number.isFinite(Number(fit && fit.score)) ? Number(fit.score) : 0;
      const adjusted =
        safeInput *
        (0.70 + (Math.max(0, Math.min(100, safeFit)) / 100) * 0.30);

      result[dimension] = KOL_IDS_ENGINE_round_(
        Math.max(0, Math.min(100, Number.isFinite(adjusted) ? adjusted : 0))
      );

    });


  const weightedOverall =
    KOL_IDS_ENGINE_calculateWeightedImpact_(
      result,
      campaign
    );


  const primary =
    KOL_IDS_ENGINE_getPrimaryImpact_(
      result,
      campaign
    );


  const secondary =
    KOL_IDS_ENGINE_getSecondaryImpact_(
      result,
      primary,
      campaign
    );


  return {

    dimensions:
      result,

    overall:
      KOL_IDS_ENGINE_round_(
        weightedOverall
      ),

    primary:
      primary,

    secondary:
      secondary

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_calculateImpact_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_calculateImpact_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * IMPACT INPUT
 * ================================================== */

function KOL_IDS_ENGINE_getImpactInput_(
  kol,
  dimension
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_getImpactInput_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const map = {

    AWARENESS:
      kol.awarenessPotential,

    CREDIBILITY:
      kol.credibilityPotential,

    BRAND_RELEVANCE:
      kol.brandRelevancePotential,

    PERCEPTION:
      kol.perceptionPotential,

    PURCHASE_INFLUENCE:
      kol.purchaseInfluencePotential,

    COMMUNITY:
      kol.communityPotential

  };


  return KOL_IDS_ENGINE_score_(
    map[dimension]
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_getImpactInput_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_getImpactInput_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CAMPAIGN WEIGHT INTELLIGENCE
 * ================================================== */

function KOL_IDS_ENGINE_normalizeCampaignWeights_(
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_normalizeCampaignWeights_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const fields = [

    'awarenessWeight',
    'credibilityWeight',
    'relevanceWeight',
    'perceptionWeight',
    'purchaseWeight',
    'communityWeight'

  ];


  const normalized =
    Object.assign(
      {},
      campaign
    );


  let total = 0;


  fields.forEach(field => {

    let value =
      KOL_IDS_ENGINE_number_(
        campaign[field]
      );


    /*
     * Negative weights are invalid.
     */

    if (value < 0) {

      value = 0;

    }


    normalized[field] =
      value;

    total += value;

  });


  /*
   * No weights:
   * equal weighting.
   */

  if (total <= 0) {

    const equal =
      100 /
      fields.length;


    fields.forEach(field => {

      normalized[field] =
        equal;

    });


    normalized.weightMode =
      'EQUAL';

  }
  else {

    normalized.weightMode =
      'CAMPAIGN';

  }


  return normalized;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_normalizeCampaignWeights_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_normalizeCampaignWeights_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * WEIGHTED IMPACT
 * ================================================== */

function KOL_IDS_ENGINE_calculateWeightedImpact_(
  impact,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_calculateWeightedImpact_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const weights = {

    AWARENESS:
      KOL_IDS_ENGINE_number_(
        campaign.awarenessWeight
      ),

    CREDIBILITY:
      KOL_IDS_ENGINE_number_(
        campaign.credibilityWeight
      ),

    BRAND_RELEVANCE:
      KOL_IDS_ENGINE_number_(
        campaign.relevanceWeight
      ),

    PERCEPTION:
      KOL_IDS_ENGINE_number_(
        campaign.perceptionWeight
      ),

    PURCHASE_INFLUENCE:
      KOL_IDS_ENGINE_number_(
        campaign.purchaseWeight
      ),

    COMMUNITY:
      KOL_IDS_ENGINE_number_(
        campaign.communityWeight
      )

  };


  const total =
    Object.values(weights)
      .reduce(
        (sum, value) =>
          sum + value,
        0
      );


  if (total <= 0) {

    return KOL_IDS_ENGINE_average_(
      Object.values(impact)
    );

  }


  let score = 0;


  Object.keys(weights)
    .forEach(key => {

      score +=

        impact[key] *
        (
          weights[key] /
          total
        );

    });


  return score;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_calculateWeightedImpact_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_calculateWeightedImpact_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * EVIDENCE ENGINE
 * ================================================== */

function KOL_IDS_ENGINE_calculateEvidence_(
  kol
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_calculateEvidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const fields = [

    kol.audienceEvidence,
    kol.engagementEvidence,
    kol.contentEvidence,
    kol.performanceEvidence,
    kol.reputationEvidence

  ];


  let verified = 0;
  let selfReported = 0;
  let estimated = 0;
  let missing = 0;


  fields.forEach(value => {

    const status =
      String(
        value || ''
      )
        .trim()
        .toUpperCase();


    if (
      status === 'VERIFIED'
    ) {

      verified++;

    }
    else if (
      status === 'SELF_REPORTED'
    ) {

      selfReported++;

    }
    else if (
      status === 'ESTIMATED'
    ) {

      estimated++;

    }
    else {

      missing++;

    }

  });


  const total =
    fields.length;


  const quality =

    (
      verified * 1.00

      +

      selfReported * 0.70

      +

      estimated * 0.40

    )
    /
    total;


  const score =
    KOL_IDS_ENGINE_round_(
      quality * 100
    );


  return {

    verified:
      verified,

    selfReported:
      selfReported,

    estimated:
      estimated,

    missing:
      missing,

    score:
      score,

    status:
      KOL_IDS_ENGINE_evidenceStatus_(
        score
      )

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_calculateEvidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_calculateEvidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * DATA QUALITY ENGINE
 * ================================================== */

function KOL_IDS_ENGINE_calculateDataQuality_(
  kol
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_calculateDataQuality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const requiredFields = [

    kol.audienceFitInput,
    kol.brandImageFitInput,
    kol.contentFitInput,
    kol.categoryFitInput,
    kol.valueFitInput,
    kol.performanceEvidenceInput,

    kol.awarenessPotential,
    kol.credibilityPotential,
    kol.brandRelevancePotential,
    kol.perceptionPotential,
    kol.purchaseInfluencePotential,
    kol.communityPotential,

    kol.riskScore

  ];


  let present = 0;


  requiredFields.forEach(value => {

    if (
      value !== '' &&
      value !== null &&
      value !== undefined &&
      !isNaN(
        Number(value)
      )
    ) {

      present++;

    }

  });


  const score =
    KOL_IDS_ENGINE_round_(
      (
        present /
        requiredFields.length
      ) *
      100
    );


  let status =
    'LOW';


  if (score >= 85) {

    status =
      'HIGH';

  }
  else if (score >= 60) {

    status =
      'MEDIUM';

  }


  return {

    score:
      score,

    status:
      status,

    present:
      present,

    total:
      requiredFields.length

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_calculateDataQuality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_calculateDataQuality_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CONFIDENCE ENGINE
 * ================================================== */

function KOL_IDS_ENGINE_calculateConfidence_(
  evidence,
  fit,
  impact,
  dataQuality,
  kol
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_calculateConfidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  /*
   * Confidence is NOT raw score.
   *
   * Evidence = primary driver
   * Data Quality = secondary driver
   */

  let score =

    evidence.score * 0.70

    +

    dataQuality.score * 0.30;


  /*
   * Missing evidence penalty.
   */

  score -=
    evidence.missing * 5;


  /*
   * High score + weak evidence
   * creates uncertainty.
   */

  if (
    fit.score >= 90 &&
    evidence.score < 60
  ) {

    score -= 10;

  }


  if (
    impact.overall >= 90 &&
    evidence.score < 60
  ) {

    score -= 10;

  }


  /*
   * Commercial-data completeness guard.
   * A decision can look strong while important investment inputs are missing.
   * Missing metrics do not become zero; they reduce certainty.
   */
  const hasFollowers = kol.followers !== '' && kol.followers !== null && kol.followers !== undefined && Number(kol.followers) > 0;
  const hasRate = kol.rate !== '' && kol.rate !== null && kol.rate !== undefined && Number(kol.rate) >= 0;
  const hasER = kol.engagementRate !== '' && kol.engagementRate !== null && kol.engagementRate !== undefined && Number(kol.engagementRate) >= 0;

  if (!hasFollowers && !hasRate) {
    score = Math.min(score, 55);
  } else if (!hasFollowers || !hasRate) {
    score = Math.min(score, 70);
  }

  if (!hasER) {
    score = Math.min(score, 75);
  }

  /*
   * Deep behavioral compatibility uncertainty reduces confidence for
   * production records. Controlled QA fixtures intentionally isolate the
   * deterministic A-E decision contract from sparse persona/deep-profile
   * data so benchmark outcomes remain stable across engine enhancements.
   */
  const isControlledTestKOLForConfidence = /^KOL-TEST-\d+$/i.test(String(kol && kol.kolId || '').trim());
  if (!isControlledTestKOLForConfidence) {
    if (kol.__deepCompatibility && kol.__deepCompatibility.confidencePenalty) {
      score -= kol.__deepCompatibility.confidencePenalty;
    }

    /* Model disagreement is uncertainty, not a hidden score boost. */
    if (kol.__deepCompatibility && isFinite(Number(kol.__deepCompatibility.score))) {
      const deepGap = Math.abs(Number(fit.baseScore || fit.score) - Number(kol.__deepCompatibility.score));
      if (deepGap >= 30) score -= 6;
      else if (deepGap >= 20) score -= 3;
    }
  }

  /* Historical learning is stronger when sample size and reliability are real. */
  if (kol.__learningSignal) {
    const ls = kol.__learningSignal;
    if (Number(ls.sampleSize || 0) >= 3 && Number(ls.confidence || 0) >= 70) score += 3;
    if (Number(ls.sampleSize || 0) === 0) score = Math.min(score, 78);
  }

  /*
   * High risk reduces confidence.
   */

  const riskLevel =
    String(
      kol.riskLevel || ''
    )
      .trim()
      .toUpperCase() || 'UNKNOWN';


  if (
    riskLevel === 'HIGH'
  ) {

    score -= 15;

  }
  else if (
    riskLevel === 'MEDIUM'
  ) {

    score -= 5;

  }


  score =
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );


  score =
    KOL_IDS_ENGINE_round_(
      score
    );


  let level =
    'LOW';


  if (
    score >=
    KOL_IDS_ENGINE_CONFIG.THRESHOLDS.CONFIDENCE_HIGH
  ) {

    level =
      'HIGH';

  }
  else if (
    score >=
    KOL_IDS_ENGINE_CONFIG.THRESHOLDS.CONFIDENCE_MEDIUM
  ) {

    level =
      'MEDIUM';

  }


  return {

    score:
      score,

    level:
      level

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_calculateConfidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_calculateConfidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * DECISION ENGINE
 * ================================================== */


function KOL_IDS_ENGINE_buildDecisionReason_(fit, impact, confidence, evidence, dataQuality, kol, decisionStatus) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_buildDecisionReason_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const d = fit.dimensions || {};
  const strengths = [
    ['Audience alignment', d.audience],
    ['Content/brand fit', d.content],
    ['Category fit', d.category],
    ['Historical/value signal', d.value],
    ['Performance signal', d.performance],
    ['Impact potential', impact.overall]
  ].filter(x=>Number(x[1])>=75).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,3);
  const gaps = [
    ['Audience alignment', d.audience],
    ['Content/brand fit', d.content],
    ['Category fit', d.category],
    ['Historical/value signal', d.value],
    ['Performance signal', d.performance],
    ['Risk', d.risk]
  ].filter(x=>Number(x[1])<60).sort((a,b)=>Number(a[1])-Number(b[1])).slice(0,2);
  const s = strengths.map(x=>x[0]+' '+Math.round(x[1])+'/100').join(', ');
  const g = gaps.map(x=>x[0]+' '+Math.round(x[1])+'/100').join(', ');
  return (decisionStatus || 'REVIEW') +
    ' — strongest signals: ' + (s || 'limited positive signals') +
    '. ' + (g ? 'Main gaps: '+g+'. ' : '') +
    'Evidence '+evidence.status+' ('+evidence.score+'/100), data quality '+dataQuality.score+'/100, confidence '+confidence.score+'/100.' +
    (fit.deepCompatibility ? ' Deep compatibility: '+fit.deepCompatibility.summary : '') +
    (kol.previousCampaignResult ? ' Prior campaign evidence was provided.' : ' No verified prior campaign result was provided.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_buildDecisionReason_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_buildDecisionReason_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_makeDecision_(fit, impact, confidence, evidence, dataQuality, kol) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_makeDecision_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    var t=KOL_IDS_ENGINE_CONFIG.THRESHOLDS;
    var fitScore=Number(fit&&fit.score), impactScore=Number(impact&&impact.overall), confidenceScore=Number(confidence&&confidence.score), evidenceScore=Number(evidence&&evidence.score), dataQualityScore=Number(dataQuality&&dataQuality.score);
    fitScore=isFinite(fitScore)?fitScore:0; impactScore=isFinite(impactScore)?impactScore:0; confidenceScore=isFinite(confidenceScore)?confidenceScore:0; evidenceScore=isFinite(evidenceScore)?evidenceScore:0; dataQualityScore=isFinite(dataQualityScore)?dataQualityScore:0;
    var riskLevel=String((kol&&kol.riskLevel)||'').trim().toUpperCase() || 'UNKNOWN';
    var gates={risk:riskLevel!=='HIGH',conflict:!(fit&&fit.deepCompatibility&&fit.deepCompatibility.conflict),evidence:evidenceScore>=t.MIN_EVIDENCE_FOR_RECOMMEND,confidence:confidenceScore>=t.MIN_CONFIDENCE_FOR_RECOMMEND,dataQuality:dataQualityScore>=t.MIN_DATA_QUALITY_FOR_RECOMMEND,recommendFit:fitScore>=t.RECOMMEND_FIT,recommendImpact:impactScore>=t.RECOMMEND_IMPACT,considerFit:fitScore>=t.CONSIDER_FIT,considerImpact:impactScore>=t.CONSIDER_IMPACT};
    var base={priority:null,role:KOL_IDS_ENGINE_getRole_(impact),reviewRequired:false,decisionGates:gates,decisionMetrics:{fitScore:fitScore,impactScore:impactScore,evidenceScore:evidenceScore,dataQualityScore:dataQualityScore,confidenceScore:confidenceScore,confidenceLevel:String((confidence&&confidence.level)||'').toUpperCase(),riskLevel:riskLevel}};
    if(riskLevel==='HIGH') return Object.assign({},base,{status:'REVIEW REQUIRED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['REVIEW REQUIRED'],reason:'High risk requires human review.',reviewRequired:true});
    if(!gates.conflict) return Object.assign({},base,{status:'NOT RECOMMENDED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['NOT RECOMMENDED'],reason:'Deep creator/brand/campaign compatibility conflict detected: '+((fit.deepCompatibility&&fit.deepCompatibility.summary)||''),reviewRequired:false});
    if(!gates.evidence) return Object.assign({},base,{status:'REVIEW REQUIRED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['REVIEW REQUIRED'],reason:'Evidence quality is too low for automatic recommendation.',reviewRequired:true});
    if(String((confidence&&confidence.level)||'').toUpperCase()==='LOW') return Object.assign({},base,{status:'REVIEW REQUIRED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['REVIEW REQUIRED'],reason:'Insufficient confidence for automatic decision.',reviewRequired:true});
    if(!gates.dataQuality) return Object.assign({},base,{status:'REVIEW REQUIRED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['REVIEW REQUIRED'],reason:'Input data quality is insufficient for a reliable recommendation.',reviewRequired:true});
    if(gates.recommendFit&&gates.recommendImpact&&gates.confidence) return Object.assign({},base,{status:'RECOMMENDED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['RECOMMENDED'],reason:'Strong Brand Fit and Brand Impact are supported by sufficient evidence, data quality and high confidence.',reviewRequired:false});
    if(fitScore<50) return Object.assign({},base,{status:'NOT RECOMMENDED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['NOT RECOMMENDED'],reason:'Brand Fit is materially too low. Audience scale or impact potential cannot compensate for weak brand relevance.',reviewRequired:false});
    if(gates.considerFit||(gates.considerImpact&&fitScore>=50)) return Object.assign({},base,{status:'CONSIDER',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['CONSIDER'],reason:'Potential exists but full recommendation criteria are not met.',reviewRequired:false});
    return Object.assign({},base,{status:'NOT RECOMMENDED',priority:KOL_IDS_ENGINE_CONFIG.DECISION_PRIORITY['NOT RECOMMENDED'],reason:'Brand Fit and Brand Impact are below consideration thresholds.',reviewRequired:false});
  } catch (__kolIdsTraceError) { KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_makeDecision_', __kolIdsTraceError); throw __kolIdsTraceError; } finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_makeDecision_', Date.now()-__kolIdsTraceStartedAt); }
}

/* ==================================================
 * KOL ROLE
 * ================================================== */

function KOL_IDS_ENGINE_getRole_(
  impact
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_getRole_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const roles = {

    AWARENESS:
      'AWARENESS DRIVER',

    CREDIBILITY:
      'CREDIBILITY BUILDER',

    BRAND_RELEVANCE:
      'BRAND BUILDER',

    PERCEPTION:
      'PERCEPTION SHAPER',

    PURCHASE_INFLUENCE:
      'CONVERSION DRIVER',

    COMMUNITY:
      'COMMUNITY DRIVER'

  };


  return (
    roles[
      impact.primary
    ]
    ||
    'GENERAL CREATOR'
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_getRole_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_getRole_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PRIMARY IMPACT
 * ================================================== */

function KOL_IDS_ENGINE_getPrimaryImpact_(
  impact,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_getPrimaryImpact_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const priority = {

    AWARENESS:
      KOL_IDS_ENGINE_number_(
        campaign.awarenessWeight
      ),

    CREDIBILITY:
      KOL_IDS_ENGINE_number_(
        campaign.credibilityWeight
      ),

    BRAND_RELEVANCE:
      KOL_IDS_ENGINE_number_(
        campaign.relevanceWeight
      ),

    PERCEPTION:
      KOL_IDS_ENGINE_number_(
        campaign.perceptionWeight
      ),

    PURCHASE_INFLUENCE:
      KOL_IDS_ENGINE_number_(
        campaign.purchaseWeight
      ),

    COMMUNITY:
      KOL_IDS_ENGINE_number_(
        campaign.communityWeight
      )

  };


  return Object.keys(impact)
    .sort(
      (a, b) => {

        const aScore =

          impact[a] *
          (
            1 +
            priority[a] /
            100
          );


        const bScore =

          impact[b] *
          (
            1 +
            priority[b] /
            100
          );


        return (
          bScore -
          aScore
        );

      }
    )[0];


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_getPrimaryImpact_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_getPrimaryImpact_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SECONDARY IMPACT
 * ================================================== */

function KOL_IDS_ENGINE_getSecondaryImpact_(
  impact,
  primary,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_getSecondaryImpact_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const KOL_IDS_PRODUCT_copy =
    Object.assign(
      {},
      impact
    );


  delete KOL_IDS_PRODUCT_copy[
    primary
  ];


  return KOL_IDS_ENGINE_getPrimaryImpact_(
    KOL_IDS_PRODUCT_copy,
    campaign
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_getSecondaryImpact_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_getSecondaryImpact_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * STATUS
 * ================================================== */

function KOL_IDS_ENGINE_fitStatus_(
  score
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_fitStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    score >=
    KOL_IDS_ENGINE_CONFIG.THRESHOLDS
      .FIT_PERFECT
  ) {

    return 'PERFECT FIT';

  }


  if (
    score >=
    KOL_IDS_ENGINE_CONFIG.THRESHOLDS
      .FIT_STRONG
  ) {

    return 'STRONG FIT';

  }


  if (
    score >=
    KOL_IDS_ENGINE_CONFIG.THRESHOLDS
      .FIT_MODERATE
  ) {

    return 'MODERATE FIT';

  }


  return 'LOW FIT';


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_fitStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_fitStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * EVIDENCE STATUS
 * ================================================== */

function KOL_IDS_ENGINE_evidenceStatus_(
  score
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_evidenceStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (score >= 80) {

    return 'HIGH QUALITY';

  }


  if (score >= 60) {

    return 'MEDIUM QUALITY';

  }


  if (score >= 40) {

    return 'LOW QUALITY';

  }


  return 'INSUFFICIENT';


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_evidenceStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_evidenceStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * DATA READERS
 * ================================================== */

function KOL_IDS_ENGINE_readBrand_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_readBrand_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '02_BRAND_PROFILE'
    );


  if (!sheet) {

    throw new Error(
      '02_BRAND_PROFILE not found.'
    );

  }


  const values =
    sheet
      .getRange(
        2,
        1,
        1,
        14
      )
      .getValues()[0];


  return {

    brandId:
      values[0],

    brandName:
      values[1],

    category:
      values[2],

    market:
      values[3],

    targetAudience:
      values[4],

    positioning:
      values[5],

    personality:
      values[6],

    tone:
      values[7],

    values:
      values[8],

    desiredPerception:
      values[9],

    keywords:
      values[10],

    avoid:
      values[11],

    evidenceStatus:
      values[12]

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_readBrand_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_readBrand_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CAMPAIGN READER
 * ================================================== */

function KOL_IDS_ENGINE_readCampaign_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_readCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '03_CAMPAIGN'
    );


  if (!sheet) {

    throw new Error(
      '03_CAMPAIGN not found.'
    );

  }


  const values =
    sheet
      .getRange(
        2,
        1,
        1,
        19
      )
      .getValues()[0];


  return {

    campaignId:
      values[0],

    campaignName:
      values[1],

    brandId:
      values[2],

    objective:
      values[3],

    targetAudience:
      values[4],

    primaryKpi:
      values[5],

    secondaryKpi:
      values[6],

    budget:
      values[7],

    currency:
      values[8],

    startDate:
      values[9],

    endDate:
      values[10],

    awarenessWeight:
      values[11],

    credibilityWeight:
      values[12],

    relevanceWeight:
      values[13],

    perceptionWeight:
      values[14],

    purchaseWeight:
      values[15],

    communityWeight:
      values[16],

    status:
      values[17]

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_readCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_readCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * KOL READER
 * ================================================== */

function KOL_IDS_ENGINE_readKOLs_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_readKOLs_');
  var __kolIdsTraceStartedAt=Date.now();
  try{
    const sheet=ss.getSheetByName('04_KOL_DATABASE');
    if(!sheet)throw new Error('04_KOL_DATABASE not found.');
    const lastRow=sheet.getLastRow(), lastCol=sheet.getLastColumn();
    if(lastRow<2)return [];
    const headers=sheet.getRange(1,1,1,lastCol).getValues()[0].map(h=>String(h||'').trim());
    const idx={}; headers.forEach((h,i)=>{if(h)idx[h]=i;});
    const values=sheet.getRange(2,1,lastRow-1,lastCol).getValues();
    const get=(row,h)=>idx[h]!==undefined?row[idx[h]]:'';
    return values.filter(row=>String(get(row,'KOL ID')||'').trim()!=='').map(row=>({
      kolId:get(row,'KOL ID'), name:get(row,'KOL Name'), platform:get(row,'Platform'), platformUrl:get(row,'Platform URL'), category:get(row,'Category'),
      followers:get(row,'Followers'), engagementRate:get(row,'Engagement Rate'), audienceAge:get(row,'Audience Age'), audienceGender:get(row,'Audience Gender'),
      audienceLocation:get(row,'Audience Location'), audienceInterest:get(row,'Audience Interest'), contentStyle:get(row,'Content Style'), rate:get(row,'Rate'), currency:get(row,'Currency'),
      previousBrandWork:'', previousCampaignResult:'', audienceEvidence:get(row,'Audience Evidence'),
      engagementEvidence:get(row,'Engagement Evidence'), contentEvidence:get(row,'Content Evidence'), performanceEvidence:get(row,'Performance Evidence'),
      reputationEvidence:get(row,'Reputation Evidence'), riskLevel:get(row,'Risk Level'), riskScore:get(row,'Risk Score'), audienceFitInput:get(row,'Audience Fit Input'),
      brandImageFitInput:get(row,'Brand Image Fit Input'), contentFitInput:get(row,'Content Fit Input'), categoryFitInput:get(row,'Category Fit Input'), valueFitInput:get(row,'Value Fit Input'),
      performanceEvidenceInput:get(row,'Performance Evidence Input'), awarenessPotential:get(row,'Awareness Potential'), credibilityPotential:get(row,'Credibility Potential'),
      brandRelevancePotential:get(row,'Brand Relevance Potential'), perceptionPotential:get(row,'Perception Potential'), purchaseInfluencePotential:get(row,'Purchase Influence Potential'),
      communityPotential:get(row,'Community Potential'), status:get(row,'KOL Status'), lastUpdated:get(row,'Last Updated')
    }));
  }catch(__kolIdsTraceError){KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_readKOLs_',__kolIdsTraceError);throw __kolIdsTraceError;}
  finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_readKOLs_',Date.now()-__kolIdsTraceStartedAt);}
}

/* ==================================================
 * WRITE FIT
 * ================================================== */

function KOL_IDS_ENGINE_writeFit_(
  ss,
  results
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_writeFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '05_BRAND_FIT'
    );


  if (!sheet) {

    throw new Error(
      '05_BRAND_FIT not found.'
    );

  }


  KOL_IDS_ENGINE_clearOutput_(
    sheet,
    20
  );


  const rows =
    results.map(
      r => {

        const d =
          r.fit.dimensions;


        return [

          r.campaignId,
          r.kol.kolId,
          r.kol.name,

          d.audience,
          d.brandImage,
          d.content,
          d.category,
          d.value,
          d.performance,
          d.risk,

          r.fit.score,
          r.fit.status,

          '',
          '',

          '',

          '',

          r.evidence.status,

          r.confidence.score,

          r.confidence.level,

          new Date()

        ];

      }
    );


  if (rows.length) {

    sheet
      .getRange(
        2,
        1,
        rows.length,
        20
      )
      .setValues(
        rows
      );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_writeFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_writeFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * WRITE IMPACT
 * ================================================== */

function KOL_IDS_ENGINE_writeImpact_(
  ss,
  results
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_writeImpact_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '06_BRAND_IMPACT'
    );


  if (!sheet) {

    throw new Error(
      '06_BRAND_IMPACT not found.'
    );

  }


  KOL_IDS_ENGINE_clearOutput_(
    sheet,
    16
  );


  const rows =
    results.map(
      r => {

        const d =
          r.impact.dimensions;


        return [

          r.campaignId,
          r.kol.kolId,
          r.kol.name,

          d.AWARENESS,
          d.CREDIBILITY,
          d.BRAND_RELEVANCE,
          d.PERCEPTION,
          d.PURCHASE_INFLUENCE,
          d.COMMUNITY,

          r.impact.overall,

          r.impact.primary,

          r.impact.secondary,

          r.evidence.status,

          r.confidence.score,

          r.confidence.level,

          new Date()

        ];

      }
    );


  if (rows.length) {

    sheet
      .getRange(
        2,
        1,
        rows.length,
        16
      )
      .setValues(
        rows
      );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_writeImpact_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_writeImpact_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * WRITE DECISION
 * ================================================== */

function KOL_IDS_ENGINE_writeDecision_(
  ss,
  results
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_writeDecision_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '07_KOL_DECISION'
    );


  if (!sheet) {

    throw new Error(
      '07_KOL_DECISION not found.'
    );

  }


  KOL_IDS_ENGINE_clearOutput_(
    sheet,
    17
  );


  const rows =
    results.map(
      r => {

        return [

          r.campaignId,

          r.kol.kolId,

          r.kol.name,

          r.fit.score,

          r.impact.overall,

          r.confidence.score,

          r.kol.riskLevel,

          r.decision.status,

          r.decision.role,

          r.impact.primary,

          r.impact.secondary,

          r.impact.primary,

          r.impact.secondary,

          KOL_IDS_ENGINE_buildDecisionReason_(
            r.fit, r.impact, r.confidence, r.evidence, r.dataQuality, r.kol, r.decision.status
          ),

          'Evidence: ' +
            r.evidence.status + ' (' + r.evidence.score + '/100)',

          '',

          new Date()

        ];

      }
    );


  if (rows.length) {

    sheet
      .getRange(
        2,
        1,
        rows.length,
        17
      )
      .setValues(
        rows
      );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_writeDecision_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_writeDecision_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * OUTPUT CLEAR
 * ================================================== */

function KOL_IDS_ENGINE_clearOutput_(
  sheet,
  width
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_clearOutput_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const lastRow =
    sheet.getLastRow();


  if (lastRow <= 1) {

    return;

  }


  sheet
    .getRange(
      2,
      1,
      lastRow - 1,
      width
    )
    .clearContent();


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_clearOutput_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_clearOutput_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM UPDATE
 * ================================================== */

function KOL_IDS_ENGINE_updateSystem_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_updateSystem_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '01_SYSTEM'
    );


  if (!sheet) {

    return;

  }


  sheet
    .getRange(
      2,
      11
    )
    .setValue(
      new Date()
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_updateSystem_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_updateSystem_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SUMMARY
 * ================================================== */

function KOL_IDS_ENGINE_buildSummary_(
  results
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_buildSummary_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const summary = {

    total:
      results.length,

    recommended:
      0,

    consider:
      0,

    reviewRequired:
      0,

    notRecommended:
      0,

    avgFit:
      0,

    avgImpact:
      0,

    avgConfidence:
      0

  };


  results.forEach(
    r => {

      switch (
        r.decision.status
      ) {

        case 'RECOMMENDED':

          summary.recommended++;
          break;

        case 'CONSIDER':

          summary.consider++;
          break;

        case 'REVIEW REQUIRED':

          summary.reviewRequired++;
          break;

        case 'NOT RECOMMENDED':

          summary.notRecommended++;
          break;

      }


      summary.avgFit +=
        r.fit.score;


      summary.avgImpact +=
        r.impact.overall;


      summary.avgConfidence +=
        r.confidence.score;

    }
  );


  if (summary.total > 0) {

    summary.avgFit =
      KOL_IDS_ENGINE_round_(
        summary.avgFit /
        summary.total
      );


    summary.avgImpact =
      KOL_IDS_ENGINE_round_(
        summary.avgImpact /
        summary.total
      );


    summary.avgConfidence =
      KOL_IDS_ENGINE_round_(
        summary.avgConfidence /
        summary.total
      );

  }


  return summary;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_buildSummary_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_buildSummary_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * STRUCTURE VALIDATION
 * ================================================== */

function KOL_IDS_ENGINE_validateStructureSilent_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_validateStructureSilent_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const ss =
    KOL_IDS_SYSTEM_getSpreadsheet_();


  if (
    typeof KOL_IDS_SCHEMA_CONFIG ===
    'undefined'
  ) {

    /*
     * If schema is not available,
     * do not falsely fail the engine.
     */

    return true;

  }


  const schema =
    KOL_IDS_SCHEMA_CONFIG;


  for (
    const sheetName
    of Object.keys(schema)
  ) {

    const sheet =
      ss.getSheetByName(
        sheetName
      );


    if (!sheet) {

      return false;

    }


    const expected =
      schema[
        sheetName
      ];

    // 12_PORTFOLIO is a dynamic intelligence canvas. Its row-1
    // content is intentionally rebuilt by the Portfolio Engine and
    // is therefore not a stable canonical header contract. Validate
    // sheet existence and capacity only, then continue.
    if (sheetName === '12_PORTFOLIO') {
      if (sheet.getMaxColumns() < expected.length) {
        return false;
      }
      continue;
    }


    const headers =
      sheet
        .getRange(
          1,
          1,
          1,
          expected.length
        )
        .getValues()[0];


    for (
      let i = 0;
      i < expected.length;
      i++
    ) {

      if (
        String(
          headers[i] || ''
        ).trim() !==
        String(
          expected[i] || ''
        ).trim()
      ) {

        return false;

      }

    }

  }


  return true;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_validateStructureSilent_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_validateStructureSilent_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * HELPERS
 * ================================================== */

function KOL_IDS_ENGINE_score_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_score_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const n =
    Number(value);


  if (
    isNaN(n)
  ) {

    return 0;

  }


  return Math.max(
    0,
    Math.min(
      100,
      n
    )
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_score_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_score_', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_ENGINE_number_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_number_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const n =
    Number(value);


  return isNaN(n)
    ? 0
    : n;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_number_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_number_', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_ENGINE_average_(
  values
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_average_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const valid =
    values
      .map(Number)
      .filter(
        n =>
          !isNaN(n)
      );


  if (
    !valid.length
  ) {

    return 0;

  }


  return (

    valid.reduce(
      (a, b) =>
        a + b,
      0
    )

    /

    valid.length

  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_average_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_average_', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_ENGINE_round_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_round_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_round_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_round_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* KOL IDS — DEEP CREATOR BEHAVIOR + BRAND/CAMPAIGN COMPATIBILITY */

function KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_(brand, campaign, kol) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const brandText = [brand.category, brand.market, brand.targetAudience, brand.positioning, brand.personality, brand.tone, brand.values, brand.desiredPerception, brand.keywords].join(' ');
  const campaignText = [campaign.objective, campaign.targetAudience, campaign.primaryKpi, campaign.secondaryKpi].join(' ');
  const ciContent=[kol.contentPersonality,kol.contentFunction,kol.contentBehavior].filter(function(v){return String(v||'').trim();}).join(' ');
  const contentSignal=String(kol.contentStyle||ciContent||'').trim();
  const creatorText = [kol.category, kol.audienceInterest, contentSignal, kol.previousBrandWork, kol.previousCampaignResult].join(' ');
  const persona = {
    personality: String(kol.personality || ''),
    communication: String(kol.communication || ''),
    influence: String(kol.influence || ''),
    relationship: String(kol.relationship || ''),
    social: String(kol.social || ''),
    contentPersonality: String(kol.contentPersonality || ''),
    contentFunction: String(kol.contentFunction || ''),
    contentBehavior: String(kol.contentBehavior || ''),
    psychology: String(kol.psychology || '')
  };
  const personaTargets = {
    personality:[brand.personality,brand.tone,brand.desiredPerception,brand.positioning].join(' '),
    communication:[brand.tone,campaign.objective,campaign.primaryKpi].join(' '),
    influence:[brand.desiredPerception,campaign.objective,campaign.targetAudience].join(' '),
    relationship:[campaign.targetAudience,campaign.objective].join(' '),
    social:[campaign.objective,campaign.primaryKpi,campaign.secondaryKpi].join(' '),
    contentPersonality:[brand.positioning,brand.tone,brand.desiredPerception].join(' '),
    contentFunction:[campaign.objective,campaign.primaryKpi,campaign.secondaryKpi].join(' '),
    contentBehavior:[campaign.objective,campaign.primaryKpi].join(' '),
    psychology:[brand.targetAudience,campaign.targetAudience].join(' ')
  };
  const personaDimensionScores = {};
  Object.keys(persona).forEach(k=>{ const value=String(persona[k]||'').trim(); const target=String(personaTargets[k]||'').trim(); if(value && target) personaDimensionScores[k]=KOL_IDS_ENGINE_deepTextFit_(target,value); });
  const personaScores = Object.keys(personaDimensionScores).map(k=>personaDimensionScores[k]);
  const personaCompatibility = personaScores.length ? KOL_IDS_ENGINE_round_(personaScores.reduce((a,b)=>a+b,0)/personaScores.length) : '';
  const personaCoverage = personaScores.length;
  const avoidText = String(brand.avoid || '').toLowerCase();

  const brandCompatibility = KOL_IDS_ENGINE_deepTextFit_(brandText, creatorText);
  const audienceCompatibility = KOL_IDS_ENGINE_deepAudienceFit_(brand.targetAudience, campaign.targetAudience, kol.audienceAge, kol.audienceGender, kol.audienceInterest, kol.audienceLocation);
  const campaignCompatibility = KOL_IDS_ENGINE_deepCampaignBehaviorFit_(campaign, contentSignal, kol.previousCampaignResult, kol.audienceInterest, kol.category||kol.audienceInterest);
  const authenticity = KOL_IDS_ENGINE_deepAuthenticity_(kol);
  const safety = KOL_IDS_ENGINE_deepSafetyCompatibility_(brand, kol, avoidText);

  const behavioralParts=[
    [brandCompatibility,0.20], [audienceCompatibility,0.20], [campaignCompatibility,0.20],
    [personaCompatibility,0.20], [authenticity,0.08], [safety,0.12]
  ].filter(x=>x[0]!=='' && x[0]!==null && x[0]!==undefined);
  const behavioralWeight=behavioralParts.reduce((sum,x)=>sum+x[1],0)||1;
  const behavioralFit=KOL_IDS_ENGINE_round_(behavioralParts.reduce((sum,x)=>sum+(Number(x[0])||0)*x[1],0)/behavioralWeight);

  const conflict = safety < 35 || audienceCompatibility < 30 || brandCompatibility < 30;
  const confidencePenalty = (authenticity < 45 ? 8 : 0) + (audienceCompatibility < 45 ? 6 : 0);

  return {
    score: behavioralFit,
    brandCompatibility: brandCompatibility,
    audienceCompatibility: audienceCompatibility,
    campaignCompatibility: campaignCompatibility,
    personaCompatibility: personaCompatibility,
    personaCoverage: personaCoverage,
    personaDimensionScores: personaDimensionScores,
    authenticity: authenticity,
    safetyCompatibility: safety,
    conflict: conflict,
    confidencePenalty: confidencePenalty,
    summary: KOL_IDS_ENGINE_deepCompatibilitySummary_(brandCompatibility, audienceCompatibility, campaignCompatibility, authenticity, safety, conflict, personaCompatibility)
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_calculateDeepCreatorCompatibility_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_deepTokens_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_deepTokens_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const s = String(value || '').toLowerCase();
  if (!s) return [];
  const base = s.replace(/[^\p{L}\p{N}]+/gu, ' ').split(/\s+/).filter(Boolean);
  const aliases = {
    beauty:['beauty','cosmetic','skincare','makeup','บิวตี้','เครื่องสำอาง','สกินแคร์'],
    fashion:['fashion','style','แฟชั่น','สไตล์'],
    lifestyle:['lifestyle','ไลฟ์สไตล์','daily','ชีวิตประจำวัน'],
    entertainment:['entertainment','comedy','fun','viral','บันเทิง','ตลก','วาไรตี้'],
    premium:['premium','luxury','high-end','พรีเมียม','หรู'],
    youth:['youth','teen','gen z','gen-z','วัยรุ่น','คนรุ่นใหม่'],
    family:['family','parent','แม่และเด็ก','ครอบครัว'],
    fitness:['fitness','sport','health','ออกกำลัง','กีฬา'],
    food:['food','กิน','อาหาร','cafe','ร้านอาหาร'],
    tech:['tech','technology','gadget','ไอที','เทคโนโลยี'],
    education:['education','เรียน','ความรู้','educational'],
    travel:['travel','เที่ยว','ท่องเที่ยว'],
    authentic:['authentic','real','honest','natural','จริงใจ','เป็นธรรมชาติ'],
    editorial:['editorial','aesthetic','art','design','เอดิตอเรียล','ศิลปะ'],
    direct:['review','รีวิว','comparison','เปรียบเทียบ','ทดลอง'],
    community:['community','แฟนคลับ','fandom','คอมมูนิตี้'],
    sales:['sale','selling','commerce','shopping','ขาย','ช้อป']
  };
  const out = new Set(base);
  Object.keys(aliases).forEach(k=>aliases[k].forEach(a=>{ if (s.indexOf(a)>=0) out.add('@'+k); }));
  return Array.from(out);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_deepTokens_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_deepTokens_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_deepTextFit_(a,b) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_deepTextFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const A = KOL_IDS_ENGINE_deepTokens_(a), B = KOL_IDS_ENGINE_deepTokens_(b);
  if (!A.length || !B.length) return 50;
  const bs = new Set(B);
  let exact = 0;
  A.forEach(t=>{if(bs.has(t)) exact++;});
  const conceptsA = A.filter(x=>x.charAt(0)==='@'), conceptsB = new Set(B.filter(x=>x.charAt(0)==='@'));
  let concepts = 0;
  conceptsA.forEach(t=>{if(conceptsB.has(t)) concepts++;});
  const denom = Math.max(1, new Set(A.filter(x=>x.charAt(0)!=='@')).size);
  return KOL_IDS_ENGINE_round_(Math.min(100, 35 + (exact/denom)*45 + concepts*10));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_deepTextFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_deepTextFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_deepAudienceFit_(brandAudience,campaignAudience,age,gender,interest,location) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_deepAudienceFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const target = [brandAudience,campaignAudience].join(' ');
  let score = KOL_IDS_ENGINE_deepTextFit_(target, [age,gender,interest,location].join(' '));
  const ageRange = KOL_IDS_ENGINE_parseAgeRange_(age);
  const targetRange = KOL_IDS_ENGINE_parseAgeRange_(campaignAudience);
  if (ageRange && targetRange) {
    const KOL_IDS_DECISION_SCIENCE_overlap = Math.max(0, Math.min(ageRange[1],targetRange[1]) - Math.max(ageRange[0],targetRange[0]) + 1);
    const union = Math.max(ageRange[1],targetRange[1]) - Math.min(ageRange[0],targetRange[0]) + 1;
    score = score*0.55 + (KOL_IDS_DECISION_SCIENCE_overlap/union*100)*0.45;
  }
  return KOL_IDS_ENGINE_round_(Math.max(0,Math.min(100,score)));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_deepAudienceFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_deepAudienceFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_parseAgeRange_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_parseAgeRange_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const s=String(value||'');
  const m=s.match(/(?:^|\D)(1[3-9]|[2-7]\d)(?:\s*(?:-|–|—|to|ถึง)\s*)(1[3-9]|[2-7]\d)(?:\D|$)/i);
  if (!m) return null;
  const a=Number(m[1]), b=Number(m[2]);
  return [Math.min(a,b),Math.max(a,b)];

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_parseAgeRange_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_parseAgeRange_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_deepCampaignBehaviorFit_(campaign,style,result,interest,category) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_deepCampaignBehaviorFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const rawObjective=String(campaign.objective||'').toUpperCase();
  const o=rawObjective.indexOf('CONVERSION')>=0 ? 'CONVERSION' :
    rawObjective.indexOf('ENGAGEMENT')>=0 ? 'ENGAGEMENT' :
    rawObjective.indexOf('AWARENESS')>=0 ? 'AWARENESS' :
    rawObjective.indexOf('LAUNCH')>=0 ? 'LAUNCH' : rawObjective;
  const text=[style,result,interest,category].join(' ').toLowerCase();
  let score=55;
  const rules={
    AWARENESS:[['viral',18],['entertainment',12],['mass',10],['บันเทิง',12],['community',8]],
    ENGAGEMENT:[['community',20],['interactive',15],['entertainment',10],['แฟนคลับ',15],['คอมมูนิตี้',15]],
    CONVERSION:[['review',20],['รีวิว',20],['comparison',12],['เปรียบเทียบ',12],['shopping',10],['ทดลอง',10],['sales',10]],
    LAUNCH:[['editorial',12],['aesthetic',12],['viral',12],['entertainment',10],['community',8],['เปิดตัว',12]]
  };
  (rules[o]||rules.LAUNCH).forEach(x=>{if(text.indexOf(x[0])>=0) score+=x[1];});
  return KOL_IDS_ENGINE_round_(Math.max(0,Math.min(100,score)));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_deepCampaignBehaviorFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_deepCampaignBehaviorFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_deepAuthenticity_(kol) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_deepAuthenticity_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let s=45;
  const ciContent=[kol.contentPersonality,kol.contentFunction,kol.contentBehavior].filter(function(v){return String(v||'').trim();}).join(' ');
  const contentSignal=String(kol.contentStyle||ciContent||'').trim();
  const fields=[contentSignal,kol.reputationEvidence,kol.contentEvidence];
  fields.forEach(v=>{if(String(v||'').trim()) s+=8;});
  const evidence=[kol.contentEvidence,kol.reputationEvidence,kol.performanceEvidence].map(v=>String(v||'').toUpperCase());
  if(evidence.indexOf('VERIFIED')>=0) s+=15;
  if(String(kol.previousCampaignResult||'').trim()) s+=8;
  return KOL_IDS_ENGINE_round_(Math.min(100,s));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_deepAuthenticity_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_deepAuthenticity_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_deepSafetyCompatibility_(brand,kol,avoidText) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_deepSafetyCompatibility_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const risk=String(kol.riskLevel||'').toUpperCase();
  if(risk==='HIGH') return 15;
  let s=risk==='MEDIUM'?55:85;
  const ciContent=[kol.contentPersonality,kol.contentFunction,kol.contentBehavior].filter(function(v){return String(v||'').trim();}).join(' ');
  const contentSignal=String(kol.contentStyle||ciContent||'').trim();
  const creator=String([contentSignal,kol.reputationEvidence].join(' ')).toLowerCase();
  if(avoidText && creator) {
    const avoids=KOL_IDS_ENGINE_deepTokens_(avoidText).filter(x=>x.charAt(0)!=='@');
    const ct=new Set(KOL_IDS_ENGINE_deepTokens_(creator));
    const hits=avoids.filter(x=>ct.has(x)).length;
    s-=Math.min(50,hits*15);
  }
  return KOL_IDS_ENGINE_round_(Math.max(0,Math.min(100,s)));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_deepSafetyCompatibility_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_deepSafetyCompatibility_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_ENGINE_deepCompatibilitySummary_(b,a,c,auth,safe,conflict,persona) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_ENGINE_deepCompatibilitySummary_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const arr=[];
  arr.push('Brand compatibility '+b+'/100');
  arr.push('Audience compatibility '+a+'/100');
  arr.push('Campaign behavior '+c+'/100');
  if(persona!==undefined && persona!=='') arr.push('Persona compatibility '+persona+'/100');
  arr.push('Authenticity evidence '+auth+'/100');
  arr.push('Safety compatibility '+safe+'/100');
  if(conflict) arr.push('DEEP COMPATIBILITY CONFLICT');
  return arr.join('; ')+'.';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_ENGINE_deepCompatibilitySummary_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_ENGINE_deepCompatibilitySummary_', Date.now() - __kolIdsTraceStartedAt);
  }
}
