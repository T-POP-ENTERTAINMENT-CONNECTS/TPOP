
/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * KBIS V1 — INTELLIGENT EXECUTIVE DASHBOARD
 *
 * FILE:
 * KOL_IDS_SYSTEM_Dashboard.gs
 *
 * VERSION:
 * 1.8.1
 *
 * PURPOSE:
 * - Executive Summary
 * - Campaign Decision Health
 * - KOL Importance Ranking
 * - Brand Fit
 * - Brand Impact
 * - Confidence
 * - Evidence
 * - Risk
 * - Decision
 * - Strategic Importance
 * - Exact-reference Executive presentation: Top 10 / black-white / restrained accents
 *
 * PRINCIPLE:
 * Dashboard is NOT a passive report.
 * It is the Executive Decision Layer.
 ****************************************************/


const KOL_IDS_DASHBOARD_CONFIG = {

  VERSION: '1.9.0',

  SHEET_NAME:
    '11_EXECUTIVE',

  COLORS: {

    HEADER:
      '#0B0C0E',

    CARD:
      '#FFFFFF',

    BORDER:
      '#E6E7E9'

  },

  THRESHOLDS: {

    HEALTH_STRONG:
      80,

    HEALTH_ATTENTION:
      65,

    HEALTH_RISK:
      50,

    CONFIDENCE_STRONG:
      80,

    CONFIDENCE_ATTENTION:
      60

  }

};


/* ==================================================
 * MAIN DASHBOARD
 *
 * Can be run directly.
 *
 * If Decision data does not exist,
 * automatically runs Decision Engine.
 * ================================================== */

function KOL_IDS_DASHBOARD_buildExecutiveDashboard() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_buildExecutiveDashboard');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const lock =
    LockService.getScriptLock();

  if (!lock.tryLock(10000)) {

    throw new Error(
      'KBIS: Dashboard is already being built.'
    );

  }

  try {

    const ss =
      KOL_IDS_SYSTEM_getSpreadsheet_();


    let executive =
      ss.getSheetByName(
        KOL_IDS_DASHBOARD_CONFIG.SHEET_NAME
      );


    /* Self-heal the executive surface if it has not been created yet. */
    if (!executive) {
      executive = ss.insertSheet(
        KOL_IDS_DASHBOARD_CONFIG.SHEET_NAME
      );
    }


    /*
     * ================================================
     * REQUIRED SHEETS
     * ================================================
     */

    const decisionSheet =
      ss.getSheetByName(
        '07_KOL_DECISION'
      );

    const fitSheet =
      ss.getSheetByName(
        '05_BRAND_FIT'
      );

    const impactSheet =
      ss.getSheetByName(
        '06_BRAND_IMPACT'
      );

    const campaignSheet =
      ss.getSheetByName(
        '03_CAMPAIGN'
      );

    const brandSheet =
      ss.getSheetByName(
        '02_BRAND_PROFILE'
      );


    if (
      !decisionSheet ||
      !fitSheet ||
      !impactSheet ||
      !campaignSheet
    ) {

      throw new Error(
        'KBIS: Required decision sheets are missing.'
      );

    }


    /*
     * ================================================
     * READ DECISION OUTPUT
     * ================================================
     */

    let decisions =
      KOL_IDS_DASHBOARD_dashboardRead_(
        decisionSheet,
        17
      );


    /*
     * ================================================
     * DECISION OUTPUT VALIDATION
     * ================================================
     *
     * IMPORTANT:
     * The Smart Engine already runs the Decision Engine
     * before entering the Dashboard.
     *
     * Do NOT run the Decision Engine again from inside
     * the Dashboard. Doing so can create a recursive /
     * re-entrant execution path and can surface misleading
     * Campaign ID errors even when 03_CAMPAIGN!A2 is valid.
     */

    if (!decisions.length) {

      throw new Error(
        'KBIS: 07_KOL_DECISION contains no decision records. ' +
        'Run the Decision Engine before building the Dashboard.'
      );

    }


    /*
     * ================================================
     * READ SUPPORTING OUTPUT
     * ================================================
     */

    const fits =
      KOL_IDS_DASHBOARD_dashboardRead_(
        fitSheet,
        20
      );


    const impacts =
      KOL_IDS_DASHBOARD_dashboardRead_(
        impactSheet,
        16
      );


    /*
     * ================================================
     * READ CAMPAIGN
     * ================================================
     */

    const campaign =
      KOL_IDS_DASHBOARD_dashboardReadCampaign_(
        campaignSheet
      );


    /*
     * ================================================
     * READ BRAND
     * ================================================
     */

    const brand =
      KOL_IDS_DASHBOARD_dashboardReadBrand_(
        brandSheet
      );


    /*
     * ================================================
     * BUILD DATA MAPS
     * ================================================
     */

    const fitMap = {};

    fits.forEach(
      row => {

        fitMap[
          String(row[1])
        ] = row;

      }
    );


    const impactMap = {};

    impacts.forEach(
      row => {

        impactMap[
          String(row[1])
        ] = row;

      }
    );


    /*
     * ================================================
     * BUILD EXECUTIVE DATA
     * ================================================
     */

    const ranked =
      KOL_IDS_DASHBOARD_dashboardBuildRanking_(
        decisions,
        fitMap,
        impactMap
      );


    /*
     * ================================================
     * CAMPAIGN INTELLIGENCE
     * ================================================
     */

    const campaignHealth =
      KOL_IDS_DASHBOARD_dashboardCalculateCampaignHealth_(
        ranked
      );


    /*
     * ================================================
     * STRATEGIC INSIGHTS
     * ================================================
     */

    const insights =
      KOL_IDS_DASHBOARD_dashboardBuildInsights_(
        ranked,
        campaignHealth
      );


    /*
     * ================================================
     * RESET SAFELY
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardReset_(
      executive
    );


    /*
     * ================================================
     * BUILD TITLE
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardBuildHeader_(
      executive,
      brand,
      campaign
    );


    /*
     * ================================================
     * EXECUTIVE HEALTH
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardBuildHealthCards_(
      executive,
      campaignHealth,
      ranked
    );


    /*
     * ================================================
     * PRIMARY DECISION
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardBuildPrimaryDecision_(
      executive,
      ranked,
      campaignHealth
    );


    /*
     * ================================================
     * STRATEGIC SIGNALS
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardBuildStrategicSignals_(
      executive,
      insights
    );


    /*
     * ================================================
     * KOL RANKING
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardBuildRankingTable_(
      executive,
      ranked
    );


    /*
     * ================================================
     * DECISION PRINCIPLE
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardBuildDecisionPrinciple_(
      executive,
      ranked
    );


    /*
     * ================================================
     * SYSTEM UPDATE
     * ================================================
     */

    KOL_IDS_DASHBOARD_dashboardUpdateSystem_(
      ss
    );

    /* Final presentation pass: the data remains canonical, while the
       executive surface is formatted as a premium decision dashboard. */
    KOL_IDS_DASHBOARD_dashboardApplyPremiumStyle_(
      executive,
      ranked,
      campaignHealth,
      brand,
      campaign
    );


    SpreadsheetApp.flush();


    /*
     * ================================================
     * NON-BLOCKING FEEDBACK
     * ================================================
     */

    ss.toast(
      'KOL IDS Executive Dashboard refreshed.',
      'KOL IDS',
      4
    );


    return {

      success:
        true,

      version:
        KOL_IDS_DASHBOARD_CONFIG.VERSION,

      totalKOLs:
        ranked.length,

      campaignHealth:
        campaignHealth.status,

      healthScore:
        campaignHealth.score,

      recommended:
        campaignHealth.recommended,

      reviewRequired:
        campaignHealth.reviewRequired,

      topKOL:
        ranked.length
          ? ranked[0].name
          : '',

      timestamp:
        new Date()

    };

  }
  finally {

    lock.releaseLock();

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_buildExecutiveDashboard', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_buildExecutiveDashboard', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * BUILD RANKING
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildRanking_(
  decisions,
  fitMap,
  impactMap
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildRanking_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  return decisions
    .map(
      row => {

        const kolId =
          String(
            row[1] || ''
          );


        const name =
          row[2] || '';


        const fit =
          KOL_IDS_DASHBOARD_dashboardNumber_(
            row[3]
          );


        const impact =
          KOL_IDS_DASHBOARD_dashboardNumber_(
            row[4]
          );


        const confidence =
          KOL_IDS_DASHBOARD_dashboardNumber_(
            row[5]
          );


        const risk =
          String(
            row[6] || ''
          )
            .trim()
            .toUpperCase();


        const decision =
          String(
            row[7] || ''
          )
            .trim()
            .toUpperCase();


        const role =
          row[8] || '';


        const primary =
          row[9] || '';


        const secondary =
          row[10] || '';


        /*
         * Evidence signal.
         *
         * Decision output column O
         * contains Evidence status.
         */

        const evidenceText =
          String(
            row[14] || ''
          )
            .trim();


        /*
         * ============================================
         * IMPORTANCE MODEL
         *
         * Fit        30%
         * Impact     35%
         * Confidence 20%
         * Evidence   15%
         *
         * Risk is a modifier.
         * ============================================
         */

        let evidenceScore =
          KOL_IDS_DASHBOARD_dashboardEvidenceScore_(
            evidenceText
          );


        let importance =

          fit * 0.30

          +

          impact * 0.35

          +

          confidence * 0.20

          +

          evidenceScore * 0.15;


        /*
         * Risk modifier.
         */

        if (
          risk === 'MEDIUM'
        ) {

          importance *= 0.90;

        }


        if (
          risk === 'HIGH'
        ) {

          importance *= 0.60;

        }


        /*
         * Decision modifier.
         *
         * This prevents a KOL that is
         * strategically interesting but
         * not decision-approved from
         * appearing falsely dominant.
         */

        if (
          decision ===
          'REVIEW REQUIRED'
        ) {

          importance *= 0.85;

        }


        if (
          decision ===
          'NOT RECOMMENDED'
        ) {

          importance *= 0.65;

        }


        importance =
          KOL_IDS_DASHBOARD_dashboardRound_(
            importance
          );


        /*
         * Strategic value.
         */

        const strategicValue =
          KOL_IDS_DASHBOARD_dashboardCalculateStrategicValue_(
            fit,
            impact,
            confidence
          );


        /*
         * Decision strength.
         */

        const decisionStrength =
          KOL_IDS_DASHBOARD_dashboardDecisionStrength_(
            decision
          );


        /*
         * Review flag.
         */

        const reviewRequired =
          (
            decision ===
            'REVIEW REQUIRED'
          )
          ||
          risk === 'HIGH'
          ||
          confidence <
          KOL_IDS_DASHBOARD_CONFIG
            .THRESHOLDS
            .CONFIDENCE_ATTENTION;


        return {

          kolId,
          name,

          fit,
          impact,
          confidence,

          evidenceScore,

          risk,

          decision,

          role,

          primary,

          secondary,

          importance,

          strategicValue,

          decisionStrength,

          reviewRequired

        };

      }
    )
    .sort(
      (a, b) =>
        b.importance -
        a.importance
    )
    .map(
      (item, index) => {

        item.rank =
          index + 1;

        return item;

      }
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildRanking_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildRanking_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CAMPAIGN HEALTH
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardCalculateCampaignHealth_(
  ranked
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardCalculateCampaignHealth_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const total =
    ranked.length;


  if (!total) {

    return {

      score: 0,

      status:
        'NO DATA',

      recommended: 0,

      consider: 0,

      reviewRequired: 0,

      notRecommended: 0,

      avgFit: 0,

      avgImpact: 0,

      avgConfidence: 0,

      avgImportance: 0

    };

  }


  const recommended =
    ranked.filter(
      x =>
        x.decision ===
        'RECOMMENDED'
    ).length;


  const consider =
    ranked.filter(
      x =>
        x.decision ===
        'CONSIDER'
    ).length;


  const reviewRequired =
    ranked.filter(
      x =>
        x.decision ===
        'REVIEW REQUIRED'
    ).length;


  const notRecommended =
    ranked.filter(
      x =>
        x.decision ===
        'NOT RECOMMENDED'
    ).length;


  const avgFit =
    KOL_IDS_DASHBOARD_dashboardAverage_(
      ranked.map(
        x => x.fit
      )
    );


  const avgImpact =
    KOL_IDS_DASHBOARD_dashboardAverage_(
      ranked.map(
        x => x.impact
      )
    );


  const avgConfidence =
    KOL_IDS_DASHBOARD_dashboardAverage_(
      ranked.map(
        x => x.confidence
      )
    );


  const avgImportance =
    KOL_IDS_DASHBOARD_dashboardAverage_(
      ranked.map(
        x => x.importance
      )
    );


  /*
   * Campaign Health Model
   *
   * Fit        25%
   * Impact     30%
   * Confidence 20%
   * Importance 15%
   * Decision   10%
   */

  let score =

    avgFit * 0.25

    +

    avgImpact * 0.30

    +

    avgConfidence * 0.20

    +

    avgImportance * 0.15

    +

    (
      (
        recommended / total
      ) * 100
    ) * 0.10;


  /*
   * Review penalty.
   */

  score -=
    (
      reviewRequired /
      total
    ) *
    10;


  /*
   * High risk penalty.
   */

  const highRisk =
    ranked.filter(
      x =>
        x.risk ===
        'HIGH'
    ).length;


  score -=
    (
      highRisk /
      total
    ) *
    15;


  score =
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );


  score =
    KOL_IDS_DASHBOARD_dashboardRound_(
      score
    );


  let status =
    'AT RISK';


  if (
    score >=
    KOL_IDS_DASHBOARD_CONFIG
      .THRESHOLDS
      .HEALTH_STRONG
  ) {

    status =
      'ON TRACK';

  }
  else if (
    score >=
    KOL_IDS_DASHBOARD_CONFIG
      .THRESHOLDS
      .HEALTH_ATTENTION
  ) {

    status =
      'ATTENTION';

  }


  return {

    score,

    status,

    total,

    recommended,

    consider,

    reviewRequired,

    notRecommended,

    avgFit,

    avgImpact,

    avgConfidence,

    avgImportance,

    highRisk

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardCalculateCampaignHealth_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardCalculateCampaignHealth_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * STRATEGIC VALUE
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardCalculateStrategicValue_(
  fit,
  impact,
  confidence
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardCalculateStrategicValue_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  /*
   * Strategic value rewards:
   *
   * strong fit
   * strong impact
   * reliable evidence
   */

  const score =

    fit * 0.35

    +

    impact * 0.40

    +

    confidence * 0.25;


  return KOL_IDS_DASHBOARD_dashboardRound_(
    score
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardCalculateStrategicValue_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardCalculateStrategicValue_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * DECISION STRENGTH
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardDecisionStrength_(
  decision
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardDecisionStrength_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const map = {

    'RECOMMENDED':
      100,

    'CONSIDER':
      70,

    'REVIEW REQUIRED':
      45,

    'NOT RECOMMENDED':
      20

  };


  return (
    map[decision] ||
    0
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardDecisionStrength_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardDecisionStrength_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * STRATEGIC INSIGHTS
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildInsights_(
  ranked,
  health
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildInsights_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!ranked.length) {

    return {

      strongestFit:
        'No data',

      highestImpact:
        'No data',

      highestRisk:
        'No data',

      strongestConfidence:
        'No data',

      biggestOpportunity:
        'No data',

      biggestConcern:
        'No data'

    };

  }


  const strongestFit =
    ranked
      .slice()
      .sort(
        (a, b) =>
          b.fit -
          a.fit
      )[0];


  const highestImpact =
    ranked
      .slice()
      .sort(
        (a, b) =>
          b.impact -
          a.impact
      )[0];


  const strongestConfidence =
    ranked
      .slice()
      .sort(
        (a, b) =>
          b.confidence -
          a.confidence
      )[0];


  const highestRisk =
    ranked
      .slice()
      .sort(
        (a, b) => {

          const order = {

            HIGH: 3,
            MEDIUM: 2,
            LOW: 1

          };

          return (
            (
              order[b.risk] ||
              0
            )
            -
            (
              order[a.risk] ||
              0
            )
          );

        }
      )[0];


  /*
   * Opportunity:
   *
   * high impact + high fit
   * but not yet recommended
   */

  const opportunityCandidates =
    ranked.filter(
      x =>

        x.impact >= 75

        &&

        x.fit >= 60

        &&

        x.decision !==
        'RECOMMENDED'

    );


  const biggestOpportunity =
    opportunityCandidates.length

      ?

        opportunityCandidates
          .slice()
          .sort(
            (a, b) =>
              b.strategicValue -
              a.strategicValue
          )[0]

      :

        null;


  /*
   * Concern:
   *
   * high importance but
   * review required.
   */

  const concernCandidates =
    ranked.filter(
      x =>
        x.reviewRequired
    );


  const biggestConcern =
    concernCandidates.length

      ?

        concernCandidates
          .slice()
          .sort(
            (a, b) =>
              b.importance -
              a.importance
          )[0]

      :

        null;


  return {

    strongestFit:

      strongestFit.name +
      ' (' +
      strongestFit.fit +
      '/100)',


    highestImpact:

      highestImpact.name +
      ' (' +
      highestImpact.impact +
      '/100)',


    highestRisk:

      highestRisk.name +
      ' (' +
      (
        highestRisk.risk ||
        'UNKNOWN'
      ) +
      ')',


    strongestConfidence:

      strongestConfidence.name +
      ' (' +
      strongestConfidence.confidence +
      '/100)',


    biggestOpportunity:

      biggestOpportunity

        ?

          biggestOpportunity.name +
          ' — ' +
          biggestOpportunity.role

        :

          'No major opportunity detected',


    biggestConcern:

      biggestConcern

        ?

          biggestConcern.name +
          ' — ' +
          biggestConcern.decision

        :

          'No major review concern'

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildInsights_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildInsights_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * HEADER
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildHeader_(sheet, brand, campaign) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildHeader_');
  var __started=Date.now();
  try {
    sheet.getRange('A1:H1').merge().setValue('KOL IDS™');
    sheet.getRange('A2:H2').merge().setValue('Executive Dashboard • '+(brand.brandName||'')+' — '+(campaign.campaignName||''));
    sheet.getRange('A3:H3').merge().setValue('Brand: '+(brand.brandName||'')+'  |  Objective: '+(campaign.objective||''));
  } catch(e){ KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildHeader_',e); throw e; }
  finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildHeader_',Date.now()-__started); }
}


/* ==================================================
 * HEALTH CARDS
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildHealthCards_(sheet, health, ranked) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildHealthCards_');
  var __started=Date.now();
  try {
    var cards=[
      ['A5:B5','A6:B7','CAMPAIGN HEALTH',String(health.status||'')+' • '+String(health.score||0)+'/100'],
      ['C5:D5','C6:D7','RECOMMENDED',health.recommended||0],
      ['E5:F5','E6:F7','AVG BRAND FIT',health.avgFit||0],
      ['G5:H5','G6:H7','AVG BRAND IMPACT',health.avgImpact||0],
      ['A9:B9','A10:B11','AVG CONFIDENCE',health.avgConfidence||0],
      ['C9:D9','C10:D11','CONSIDER',health.consider||0],
      ['E9:F9','E10:F11','REVIEW REQUIRED',health.reviewRequired||0],
      ['G9:H9','G10:H11','HIGH RISK',health.highRisk||0]
    ];
    cards.forEach(function(c){
      sheet.getRange(c[0]).merge().setValue(c[2]);
      sheet.getRange(c[1]).merge().setValue(c[3]);
    });
  } catch(e){ KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildHealthCards_',e); throw e; }
  finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildHealthCards_',Date.now()-__started); }
}


/* ==================================================
 * PRIMARY DECISION
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildPrimaryDecision_(sheet, ranked, health) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildPrimaryDecision_');
  var __started=Date.now();
  try {
    var top=ranked[0]||{};
    sheet.getRange('A13:H13').merge().setValue('EXECUTIVE DECISION');
    sheet.getRange('A14:D17').merge().setValue('MOST IMPORTANT KOL\n'+String(top.name||'—')+'\nImportance: '+String(top.importance||'—')+'/100\nDecision: '+String(top.decision||'—'));
    sheet.getRange('E14:H17').merge().setValue('STRATEGIC PROFILE\nBrand Fit: '+String(top.fit||'—')+'/100\nBrand Impact: '+String(top.impact||'—')+'/100\nConfidence: '+String(top.confidence||'—')+'/100\nEvidence: '+String(top.evidenceScore||'—')+'/100\nRisk: '+String(top.risk||'UNKNOWN')+'\nRole: '+String(top.role||'—')+'\nPrimary Impact: '+String(top.primary||'—'));
  } catch(e){ KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildPrimaryDecision_',e); throw e; }
  finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildPrimaryDecision_',Date.now()-__started); }
}


/* ==================================================
 * STRATEGIC SIGNALS
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildStrategicSignals_(sheet, insights) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildStrategicSignals_');
  var __started=Date.now();
  try {
    sheet.getRange('A19:H19').merge().setValue('STRATEGIC SIGNALS');
    var rows=[
      ['Strongest Brand Fit', insights.strongestFit||'—'],
      ['Highest Brand Impact', insights.highestImpact||'—'],
      ['Strongest Confidence', insights.strongestConfidence||'—'],
      ['Highest Risk', insights.highestRisk||'—'],
      ['Biggest Opportunity', insights.biggestOpportunity||'—'],
      ['Biggest Concern', insights.biggestConcern||'—']
    ];
    sheet.getRange('A20:B25').setValues(rows);
  } catch(e){ KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildStrategicSignals_',e); throw e; }
  finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildStrategicSignals_',Date.now()-__started); }
}


/* ==================================================
 * RANKING TABLE
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildRankingTable_(sheet, ranked) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildRankingTable_');
  var __started=Date.now();
  try {
    var displayRanked=(ranked||[]).slice(0,10);
    sheet.getRange('A28:H28').merge().setValue('KOL IMPORTANCE RANKING');
    var headers=['Rank','KOL','Importance','Brand Fit','Brand Impact','Confidence','Risk','Decision'];
    sheet.getRange('A29:H29').setValues([headers]);
    var rows=displayRanked.map(function(x){return [x.rank,x.name,x.importance,x.fit,x.impact,x.confidence,x.risk,x.decision];});
    if(rows.length) sheet.getRange(30,1,rows.length,8).setValues(rows);
    displayRanked.forEach(function(item,index){
      sheet.getRange(30+index,2).setNote('Role: '+(item.role||'')+'\nPrimary Impact: '+(item.primary||'')+'\nSecondary Impact: '+(item.secondary||'')+'\nEvidence Score: '+(item.evidenceScore||'')+'\nStrategic Value: '+(item.strategicValue||'')+'\nReview Required: '+(item.reviewRequired||''));
    });
  } catch(e){ KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildRankingTable_',e); throw e; }
  finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildRankingTable_',Date.now()-__started); }
}


/* ==================================================
 * DECISION PRINCIPLE
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardBuildDecisionPrinciple_(sheet, ranked) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardBuildDecisionPrinciple_');
  var __started=Date.now();
  try {
    var n=Math.min((ranked||[]).length,10);
    var row=30+n+1;
    sheet.getRange(row,1,1,8).merge().setValue('Decision Principle: Brand Fit + Brand Impact + Evidence + Confidence + Risk');
    sheet.getRange(row+1,1,1,8).merge().setValue('KOL IDS does not treat a high raw score as an automatic recommendation. Evidence quality, confidence and risk can override apparent performance.');
  } catch(e){ KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardBuildDecisionPrinciple_',e); throw e; }
  finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardBuildDecisionPrinciple_',Date.now()-__started); }
}


/* ==================================================
 * RESET DASHBOARD SAFELY
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardReset_(sheet) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardReset_');
  var __started=Date.now();
  try {
    sheet.getRange(1,1,Math.max(sheet.getMaxRows(),1),Math.max(sheet.getMaxColumns(),1)).getMergedRanges().forEach(function(r){r.breakApart();});
    sheet.clear();
    if(sheet.getMaxColumns()<8) sheet.insertColumnsAfter(sheet.getMaxColumns(),8-sheet.getMaxColumns());
    if(sheet.getMaxRows()<50) sheet.insertRowsAfter(sheet.getMaxRows(),50-sheet.getMaxRows());
    sheet.setFrozenRows(3);
  } catch(e){ KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardReset_',e); throw e; }
  finally { KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardReset_',Date.now()-__started); }
}


/* ==================================================
 * CARD
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardCard_(
  sheet,
  rangeA1,
  title,
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardCard_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const range =
    sheet.getRange(
      rangeA1
    );


  range.merge();


  range
    .setValue(
      title +
      '\n\n' +
      value
    )
    .setHorizontalAlignment(
      'center'
    )
    .setVerticalAlignment(
      'middle'
    )
    .setFontWeight(
      'bold'
    )
    .setWrap(
      true
    )
    .setBackground(
      KOL_IDS_DASHBOARD_CONFIG
        .COLORS
        .CARD
    )
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardCard_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardCard_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * READ DECISION DATA
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardRead_(
  sheet,
  columnCount
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardRead_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const lastRow =
    sheet.getLastRow();


  if (
    lastRow < 2
  ) {

    return [];

  }


  return sheet

    .getRange(
      2,
      1,
      lastRow - 1,
      columnCount
    )

    .getValues()

    .filter(
      row =>
        String(
          row[0] || ''
        )
        .trim() !== ''
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardRead_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardRead_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * READ CAMPAIGN
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardReadCampaign_(
  sheet
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardReadCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const row =
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
      row[0] || '',

    campaignName:
      row[1] || '',

    brandId:
      row[2] || '',

    objective:
      row[3] || '',

    targetAudience:
      row[4] || '',

    primaryKpi:
      row[5] || '',

    status:
      row[17] || ''

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardReadCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardReadCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * READ BRAND
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardReadBrand_(
  sheet
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardReadBrand_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!sheet) {

    return {

      brandId: '',
      brandName: ''

    };

  }


  const row =
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
      row[0] || '',

    brandName:
      row[1] || '',

    category:
      row[2] || '',

    market:
      row[3] || '',

    positioning:
      row[5] || ''

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardReadBrand_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardReadBrand_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * EVIDENCE SCORE
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardEvidenceScore_(
  text
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardEvidenceScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const value =
    String(
      text || ''
    )
      .toUpperCase();


  if (
    value.indexOf(
      'HIGH'
    ) !== -1
  ) {

    return 90;

  }


  if (
    value.indexOf(
      'MEDIUM'
    ) !== -1
  ) {

    return 70;

  }


  if (
    value.indexOf(
      'LOW'
    ) !== -1
  ) {

    return 45;

  }


  if (
    value.indexOf(
      'INSUFFICIENT'
    ) !== -1
  ) {

    return 20;

  }


  /*
   * If no evidence text exists,
   * treat as weak evidence.
   */

  return 20;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardEvidenceScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardEvidenceScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * NUMBER
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardNumber_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardNumber_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const n =
    Number(value);


  return isNaN(n)
    ? 0
    : n;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardNumber_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardNumber_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * ROUND
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardRound_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardRound_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  return Math.round(
    Number(value) * 100
  ) / 100;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardRound_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardRound_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * AVERAGE
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardAverage_(
  values
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardAverage_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const valid =
    values
      .map(Number)
      .filter(
        x =>
          !isNaN(x)
      );


  if (
    !valid.length
  ) {

    return 0;

  }


  return KOL_IDS_DASHBOARD_dashboardRound_(
    valid.reduce(
      (a, b) =>
        a + b,
      0
    )
    /
    valid.length
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardAverage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardAverage_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYSTEM UPDATE
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardUpdateSystem_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardUpdateSystem_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const system =
    ss.getSheetByName(
      '01_SYSTEM'
    );


  if (!system) {

    return;

  }


  system
    .getRange(
      2,
      11
    )
    .setValue(
      new Date()
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardUpdateSystem_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_DASHBOARD_dashboardUpdateSystem_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PREMIUM EXECUTIVE PRESENTATION
 *
 * Presentation-only layer. Does not alter the
 * canonical decision values or their schema.
 * ================================================== */

function KOL_IDS_DASHBOARD_dashboardApplyPremiumStyle_(sheet, ranked, health, brand, campaign) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_DASHBOARD_dashboardApplyPremiumStyle_');
  var __started=Date.now();
  try {
    /*
     * PRESENTATION-ONLY LAYER
     * ------------------------
     * This function MUST NOT change Decision / Ranking / Core Engine values.
     * It only formats the canonical 11_EXECUTIVE surface.
     */
    var BLACK='#0B1624',
        WHITE='#FFFFFF',
        BLUE='#DDF2FF',
        MINT='#E7FFF4',
        CYAN='#9EDCFF',
        PINK='#FFF0F5',
        GRAY='#F4F8FB',
        LINE='#C9E4F5',
        MID='#5F6B76',
        SOFT='#F8FCFF';

    var displayCount=Math.min((ranked||[]).length,10);
    var footer=31+displayCount+2;

    // Apps Script formatting calls are intentionally split. Some execution
    // contexts can return null from a chained formatting call; that must never
    // abort the canonical dashboard build.
    sheet.setHiddenGridlines(true);
    sheet.setFrozenRows(3);
    try { sheet.setTabColor(BLACK); } catch (tabColorError) {
      KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_tabColor_', tabColorError);
    }

    if(sheet.getMaxColumns()<8) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(),8-sheet.getMaxColumns());
    }
    if(sheet.getMaxRows()<Math.max(48,footer+1)) {
      sheet.insertRowsAfter(
        sheet.getMaxRows(),
        Math.max(48,footer+1)-sheet.getMaxRows()
      );
    }

    /* Global canvas */
    sheet.getRange(1,1,sheet.getMaxRows(),8)
      .setFontFamily('Arial')
      .setFontColor(BLACK)
      .setBackground(WHITE)
      .setVerticalAlignment('middle');

    /*
     * Wider information canvas.
     * B/H carry the longest labels; metric columns remain comfortably readable.
     */
    [72,360,160,160,160,160,145,230].forEach(function(w,i){
      sheet.setColumnWidth(i+1,w);
    });

    /* Compact but premium rhythm */
    sheet.setRowHeights(1,48,21);
    sheet.setRowHeight(1,38);
    sheet.setRowHeight(2,22);
    sheet.setRowHeight(3,18);
    [4,8,12,18,26,27].forEach(function(r){sheet.setRowHeight(r,10);});
    [5,9,13,19,28].forEach(function(r){sheet.setRowHeight(r,30);});
    [6,7,10,11].forEach(function(r){sheet.setRowHeight(r,38);});
    for(var r=14;r<=17;r++) sheet.setRowHeight(r,36);
    for(var r2=20;r2<=25;r2++) sheet.setRowHeight(r2,31);
    sheet.setRowHeight(29,23);
    for(var r3=30;r3<40;r3++) sheet.setRowHeight(r3,26);
    sheet.setRowHeight(41,20);
    sheet.setRowHeight(42,34);

    /* Header / masthead */
    sheet.getRange('A1:H3')
      .setBackground(BLACK)
      .setFontColor(WHITE)
      .setWrap(false);

    sheet.getRange('A1')
      .setFontSize(21)
      .setFontWeight('bold')
      .setHorizontalAlignment('left');

    sheet.getRange('A2')
      .setFontSize(9)
      .setFontWeight('bold')
      .setFontColor('#BDBFC3')
      .setHorizontalAlignment('left');

    sheet.getRange('A3')
      .setFontSize(7.5)
      .setFontColor('#DADADA')
      .setHorizontalAlignment('left');

    /* KPI cards */
    var cards=[
      ['A5:B7',BLUE], ['C5:D7',MINT], ['E5:F7',BLUE], ['G5:H7',MINT],
      ['A9:B11',BLUE], ['C9:D11',MINT], ['E9:F11',BLUE], ['G9:H11',MINT]
    ];

    cards.forEach(function(c){
      sheet.getRange(c[0])
        .setBackground(c[1])
        .setBorder(true,true,true,true,false,false,LINE,SpreadsheetApp.BorderStyle.SOLID)
        .setVerticalAlignment('middle');
    });

    [
      ['A5','A6'],['C5','C6'],['E5','E6'],['G5','G6'],
      ['A9','A10'],['C9','C10'],['E9','E10'],['G9','G10']
    ].forEach(function(x){
      sheet.getRange(x[0])
        .setFontSize(10)
        .setFontWeight('bold')
        .setFontColor(BLACK)
        .setHorizontalAlignment('center');

      sheet.getRange(x[1])
        .setFontSize(24)
        .setFontWeight('bold')
        .setFontColor(BLACK)
        .setHorizontalAlignment('center')
        .setNumberFormat('0.00');
    });

    sheet.getRange('A5').setFontColor('#0C4F7A');
    sheet.getRange('A6').setFontColor('#0C4F7A').setFontSize(24).setWrap(false);
    sheet.getRange('A5:B7').setBorder(true,true,true,true,false,false,'#8ACCF0',SpreadsheetApp.BorderStyle.SOLID);
    /* Section bars */
    ['A13:H13','A19:H19','A28:H28'].forEach(function(a){
      sheet.getRange(a)
        .setBackground(BLACK)
        .setFontColor(WHITE)
        .setFontWeight('bold')
        .setFontSize(10)
        .setFontColor(CYAN)
        .setHorizontalAlignment('left')
        .setVerticalAlignment('middle');
    });

    /* Make the ranking surface explicitly Top 10 without touching ranking logic. */
    sheet.getRange('A28')
      .setValue('KOL IMPORTANCE RANKING  •  TOP 10');

    /* Executive decision */
    sheet.getRange('A14:D17')
      .setBackground(WHITE)
      .setBorder(true,true,true,true,false,false,LINE,SpreadsheetApp.BorderStyle.SOLID)
      .setWrap(true)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle');

    sheet.getRange('E14:H17')
      .setBackground(PINK)
      .setBorder(true,true,true,true,false,false,LINE,SpreadsheetApp.BorderStyle.SOLID)
      .setWrap(true)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle');

    sheet.getRange('A14')
      .setFontSize(18)
      .setFontWeight('bold')
      .setFontColor(BLACK);

    sheet.getRange('E14')
      .setFontSize(10)
      .setFontWeight('bold')
      .setFontColor(BLACK);

    /* Strategic signals */
    sheet.getRange('A20:B25')
      .setBorder(true,true,true,true,false,false,LINE,SpreadsheetApp.BorderStyle.SOLID)
      .setWrap(true)
      .setBackground(WHITE)
      .setVerticalAlignment('middle');

    sheet.getRange('A20:A25')
      .setBackground(GRAY)
      .setFontSize(10)
      .setFontWeight('bold')
      .setFontColor(BLACK);

    sheet.getRange('B20:B25')
      .setFontSize(8)
      .setFontWeight('bold')
      .setFontColor(BLACK);

    /* Ranking header */
    sheet.getRange('A29:H29')
      .setBackground(BLACK)
      .setFontColor(WHITE)
      .setFontWeight('bold')
      .setFontSize(7.5)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    if(displayCount){
      sheet.getRange(30,1,displayCount,8)
        .setFontSize(10)
        .setBackground(WHITE)
        .setBorder(false,false,true,false,false,false,LINE,SpreadsheetApp.BorderStyle.SOLID)
        .setWrap(false)
        .setVerticalAlignment('middle');

      sheet.getRange(30,1,displayCount,1)
        .setHorizontalAlignment('center')
        .setFontWeight('bold')
        .setFontColor(BLACK);

      sheet.getRange(30,2,displayCount,1)
        .setHorizontalAlignment('left')
        .setFontWeight('bold')
        .setFontColor(BLACK);

      sheet.getRange(30,3,displayCount,4)
        .setHorizontalAlignment('center')
        .setNumberFormat('0.00');

      sheet.getRange(30,7,displayCount,2)
        .setHorizontalAlignment('center');

      /* Subtle hierarchy: Rank #1 gets the light pink emphasis; #2 gets cyan. */
      sheet.getRange(30,1,1,8).setBackground(BLUE);
      if(displayCount>1) sheet.getRange(31,1,1,8).setBackground(PINK);
      for(var i=2;i<displayCount;i+=2){
        sheet.getRange(30+i,1,1,8).setBackground(SOFT);
      }

      var rules=[];
      var dRange=sheet.getRange(30,8,displayCount,1);
      var rRange=sheet.getRange(30,7,displayCount,1);

      ['RECOMMENDED','CONSIDER','REVIEW REQUIRED','NOT RECOMMENDED'].forEach(function(v){
        rules.push(
          SpreadsheetApp.newConditionalFormatRule()
            .whenTextEqualTo(v)
            .setFontColor(BLACK)
            .setRanges([dRange])
            .build()
        );
      });

      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo('HIGH')
          .setFontColor(BLACK)
          .setRanges([rRange])
          .build()
      );

      sheet.setConditionalFormatRules(rules);
    } else {
      sheet.getRange('A30:H30')
        .merge()
        .setValue('No KOL ranking records are available for this dashboard.')
        .setFontSize(8)
        .setFontColor(MID)
        .setHorizontalAlignment('left')
        .setBackground(GRAY);
    }

    /*
     * Footer is explicitly based on the number of rows DISPLAYED on the
     * dashboard, never on the total KOL population in the engine.
     */
    sheet.getRange(footer,1,1,8)
      .merge()
      .setValue(
        'Showing Top '+displayCount+' KOL'+(displayCount===1?'':'s')+
        ' on this dashboard • Decision Principle: Brand Fit + Brand Impact + Evidence + Confidence + Risk'
      )
      .setFontSize(10)
      .setFontWeight('bold')
      .setFontColor(BLACK)
      .setHorizontalAlignment('left')
      .setBackground(WHITE)
      .setVerticalAlignment('middle');

    sheet.getRange(footer+1,1,1,8)
      .merge()
      .setValue(
        'KOL IDS does not treat a high raw score as an automatic recommendation. Evidence quality, confidence and risk can override apparent performance.'
      )
      .setFontSize(10)
      .setFontColor(MID)
      .setWrap(true)
      .setBackground(WHITE)
      .setVerticalAlignment('middle');

    SpreadsheetApp.flush();
  } catch(e){
    KOL_IDS_TRACE_ERROR_('KOL_IDS_DASHBOARD_dashboardApplyPremiumStyle_',e);
    throw e;
  } finally {
    KOL_IDS_TRACE_EXIT_(
      'KOL_IDS_DASHBOARD_dashboardApplyPremiumStyle_',
      Date.now()-__started
    );
  }
}
