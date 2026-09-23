
/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * KBIS V2 — PORTFOLIO INTELLIGENCE ENGINE
 *
 * FILE:
 * KOL_IDS_SYSTEM_Portfolio.gs
 *
 * VERSION:
 * 3.0.0
 *
 * PURPOSE:
 *
 * Move KBIS from:
 *
 * KOL RANKING
 *
 * into:
 *
 * CAMPAIGN-LEVEL PORTFOLIO INTELLIGENCE
 *
 * CORE QUESTION:
 *
 * "Which combination of KOLs creates the strongest
 * strategic portfolio for this campaign,
 * within budget, risk and evidence constraints?"
 *
 *
 * INTELLIGENCE LAYERS:
 *
 * 1. Brand Fit
 * 2. Brand Impact
 * 3. Confidence
 * 4. Evidence
 * 5. Risk
 * 6. Objective Alignment
 * 7. Role Diversity
 * 8. Impact Coverage
 * 9. Budget Efficiency
 * 10. Portfolio Synergy
 * 11. Data Quality
 * 12. Opportunity Cost
 * 13. Portfolio Confidence
 * 14. Coverage Gap
 * 15. Swap Intelligence
 *
 ****************************************************/


const KOL_IDS_PORTFOLIO_CONFIG = {

  VERSION:
    '3.1.0',

  SHEET_NAME:
    '12_PORTFOLIO',

  DEFAULT_TARGET_SIZE:
    5,

  MIN_IMPORTANCE:
    50,

  MIN_CANDIDATE_SCORE:
    45,

  HIGH_RISK_PENALTY:
    18,

  MEDIUM_RISK_PENALTY:
    6,

  REVIEW_PENALTY:
    8,

  NOT_RECOMMENDED_PENALTY:
    30,

  OVERLAP_PENALTY:
    4,

  SYNERGY_BONUS:
    5,

  BUDGET_UTILIZATION_LIMIT:
    0.95,

  BUDGET_LOW_UTILIZATION:
    0.70,

  BUDGET_EFFICIENCY_HIGH:
    80,

  BUDGET_EFFICIENCY_MEDIUM:
    55,

  SCORE_STRONG:
    80,

  SCORE_VIABLE:
    65,

  SCORE_ATTENTION:
    50,

  CONFIDENCE_STRONG:
    80,

  DATA_QUALITY_STRONG:
    85,

  COVERAGE_GOOD:
    0.70,

  SWAP_GAIN_THRESHOLD:
    3,

  OBJECTIVE_WEIGHTS: {

    AWARENESS: {
      awareness: 0.40,
      credibility: 0.10,
      relevance: 0.15,
      perception: 0.10,
      purchase: 0.10,
      community: 0.15
    },

    CREDIBILITY: {
      awareness: 0.10,
      credibility: 0.40,
      relevance: 0.20,
      perception: 0.15,
      purchase: 0.05,
      community: 0.10
    },

    CONSIDERATION: {
      awareness: 0.10,
      credibility: 0.15,
      relevance: 0.30,
      perception: 0.20,
      purchase: 0.15,
      community: 0.10
    },

    CONVERSION: {
      awareness: 0.05,
      credibility: 0.10,
      relevance: 0.20,
      perception: 0.10,
      purchase: 0.45,
      community: 0.10
    },

    COMMUNITY: {
      awareness: 0.10,
      credibility: 0.10,
      relevance: 0.20,
      perception: 0.10,
      purchase: 0.05,
      community: 0.45
    },

    BRAND: {
      awareness: 0.15,
      credibility: 0.20,
      relevance: 0.15,
      perception: 0.25,
      purchase: 0.10,
      community: 0.15
    }

  }

};


/* ==================================================
 * MASTER RUNNER
 * ================================================== */

function KOL_IDS_PORTFOLIO_runPortfolioOptimization() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_runPortfolioOptimization');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const lock =
    LockService.getScriptLock();

  if (!lock.tryLock(10000)) {

    throw new Error(
      'KBIS: Portfolio Intelligence Engine is already running.'
    );

  }

  try {

    const ss =
      KOL_IDS_SYSTEM_getSpreadsheet_();

    const decisionSheet =
      ss.getSheetByName(
        '07_KOL_DECISION'
      );

    if (!decisionSheet) {

      throw new Error(
        'KBIS: 07_KOL_DECISION sheet not found.'
      );

    }

    const campaign =
      KOL_IDS_PORTFOLIO_portfolioReadCampaign_(
        ss
      );

    let decisions =
      KOL_IDS_PORTFOLIO_portfolioRead_(
        decisionSheet,
        17
      );

    /*
     * SELF HEAL
     */

    if (!decisions.length) {

      if (
        typeof KOL_IDS_ENGINE_runDecisionEngine !==
        'function'
      ) {

        throw new Error(
          'KBIS: Decision Engine not found.'
        );

      }

      KOL_IDS_ENGINE_runDecisionEngine();

      decisions =
        KOL_IDS_PORTFOLIO_portfolioRead_(
          decisionSheet,
          17
        );

    }

    if (!decisions.length) {

      throw new Error(
        'KBIS: No KOL decision records available.'
      );

    }

    /*
     * NORMALIZE
     */

    let candidates =
      KOL_IDS_PORTFOLIO_portfolioNormalizeCandidates_(
        decisions,
        campaign
      );

    /*
     * COST
     */

    candidates =
      KOL_IDS_PORTFOLIO_portfolioAttachCostData_(
        ss,
        candidates
      );

    /*
     * OBJECTIVE ALIGNMENT
     */

    candidates.forEach(
      candidate => {

        candidate.objectiveAlignment =
          KOL_IDS_PORTFOLIO_portfolioObjectiveAlignment_(
            candidate,
            campaign
          );

        candidate.finalCandidateScore =
          KOL_IDS_PORTFOLIO_portfolioCandidateScore_(
            candidate
          );

      }
    );

    /*
     * PORTFOLIO BUILD
     */

    const portfolio =
      KOL_IDS_PORTFOLIO_portfolioBuild_(
        candidates,
        campaign
      );

    /*
     * OUTPUT
     */

    const sheet =
      KOL_IDS_PORTFOLIO_portfolioGetOrCreateSheet_(
        ss
      );

    KOL_IDS_PORTFOLIO_portfolioReset_(
      sheet
    );

    KOL_IDS_PORTFOLIO_portfolioBuildSummary_(
      sheet,
      portfolio,
      campaign
    );

    KOL_IDS_PORTFOLIO_portfolioBuildSelected_(
      sheet,
      portfolio
    );

    KOL_IDS_PORTFOLIO_portfolioBuildAlternatives_(
      sheet,
      portfolio
    );

    KOL_IDS_PORTFOLIO_portfolioBuildCoverage_(
      sheet,
      portfolio,
      campaign
    );

    KOL_IDS_PORTFOLIO_portfolioBuildRiskWatch_(
      sheet,
      portfolio
    );

    KOL_IDS_PORTFOLIO_portfolioBuildSwapIntelligence_(
      sheet,
      portfolio
    );

    KOL_IDS_PORTFOLIO_portfolioBuildDecision_(
      sheet,
      portfolio,
      campaign
    );

    KOL_IDS_PORTFOLIO_portfolioFormat_(
      sheet
    );

    SpreadsheetApp.flush();

    ss.toast(
      'KBIS Portfolio Intelligence completed.',
      'KBIS',
      4
    );

    return {

      success:
        true,

      version:
        KOL_IDS_PORTFOLIO_CONFIG.VERSION,

      portfolioScore:
        portfolio.score,

      portfolioConfidence:
        portfolio.portfolioConfidence,

      dataQuality:
        portfolio.dataQuality,

      selectedCount:
        portfolio.selected.length,

      totalCandidates:
        candidates.length,

      budget:
        campaign.budget,

      plannedSpend:
        portfolio.plannedSpend,

      budgetRemaining:
        portfolio.budgetRemaining,

      budgetStatus:
        portfolio.budgetStatus,

      coverageScore:
        portfolio.coverageScore,

      synergyScore:
        portfolio.synergyScore,

      riskExposure:
        portfolio.riskExposure,

      selected:
        portfolio.selected.map(function(x, i) {
          return {
            rank: i + 1,
            creatorId: String(x.creatorId || x.kolId || ''),
            name: x.name || '',
            score: KOL_IDS_PORTFOLIO_portfolioRound_(x.finalCandidateScore),
            objectiveAlignment: KOL_IDS_PORTFOLIO_portfolioRound_(x.objectiveAlignment),
            impact: KOL_IDS_PORTFOLIO_portfolioRound_(x.impact),
            confidence: KOL_IDS_PORTFOLIO_portfolioRound_(x.confidence),
            cost: KOL_IDS_PORTFOLIO_portfolioRound_(x.cost || 0),
            reason: x._selectionReason || ''
          };
        }),

      status:
        portfolio.status,

      decision:
        portfolio.executiveDecision,

      timestamp:
        new Date()

    };

  }
  finally {

    lock.releaseLock();

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_runPortfolioOptimization', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_runPortfolioOptimization', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CAMPAIGN READER
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioReadCampaign_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioReadCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '03_CAMPAIGN'
    );

  if (!sheet) {

    throw new Error(
      'KBIS: 03_CAMPAIGN sheet not found.'
    );

  }

  const lastColumn =
    Math.max(
      sheet.getLastColumn(),
      19
    );

  const values =
    sheet
      .getRange(
        2,
        1,
        1,
        lastColumn
      )
      .getValues()[0];

  const campaign = {

    campaignId:
      values[0] || '',

    campaignName:
      values[1] || '',

    brandId:
      values[2] || '',

    objective:
      values[3] || '',

    targetAudience:
      values[4] || '',

    primaryKpi:
      values[5] || '',

    secondaryKpi:
      values[6] || '',

    budget:
      KOL_IDS_PORTFOLIO_portfolioParseMoney_(
        values[7]
      ),

    currency:
      values[8] || '',

    startDate:
      values[9] || '',

    endDate:
      values[10] || '',

    awarenessWeight:
      KOL_IDS_PORTFOLIO_portfolioNumber_(
        values[11]
      ),

    credibilityWeight:
      KOL_IDS_PORTFOLIO_portfolioNumber_(
        values[12]
      ),

    relevanceWeight:
      KOL_IDS_PORTFOLIO_portfolioNumber_(
        values[13]
      ),

    perceptionWeight:
      KOL_IDS_PORTFOLIO_portfolioNumber_(
        values[14]
      ),

    purchaseWeight:
      KOL_IDS_PORTFOLIO_portfolioNumber_(
        values[15]
      ),

    communityWeight:
      KOL_IDS_PORTFOLIO_portfolioNumber_(
        values[16]
      ),

    status:
      values[17] || '',

    targetKOLs:
      KOL_IDS_PORTFOLIO_portfolioNumber_(
        values[18]
      )

  };

  /*
   * If explicit weights exist,
   * normalize them.
   */

  campaign.objectiveWeights =
    KOL_IDS_PORTFOLIO_portfolioBuildCampaignWeights_(
      campaign
    );

  /*
   * If no target size,
   * use default.
   */

  /* Agency-scale selection guardrail: support real agency portfolios while
   * retaining a deliberate upper bound. */
  var scaleMaxTarget =
    (typeof KOL_IDS !== 'undefined' && Number(KOL_IDS.AGENCY_MAX_SELECTED_KOLS)) ||
    150;

  campaign.targetKOLs =
    campaign.targetKOLs > 0
      ?
        Math.min(
          campaign.targetKOLs,
          scaleMaxTarget
        )
      :
        KOL_IDS_PORTFOLIO_CONFIG
          .DEFAULT_TARGET_SIZE;

  return campaign;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioReadCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioReadCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CAMPAIGN WEIGHTS
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildCampaignWeights_(
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildCampaignWeights_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const explicit = {

    awareness:
      campaign.awarenessWeight,

    credibility:
      campaign.credibilityWeight,

    relevance:
      campaign.relevanceWeight,

    perception:
      campaign.perceptionWeight,

    purchase:
      campaign.purchaseWeight,

    community:
      campaign.communityWeight

  };

  const total =
    Object.keys(explicit)
      .reduce(
        (sum, key) =>
          sum +
          KOL_IDS_PORTFOLIO_portfolioNumber_(
            explicit[key]
          ),
        0
      );

  if (total > 0) {

    const normalized = {};

    Object.keys(explicit)
      .forEach(
        key => {

          normalized[key] =
            explicit[key] /
            total;

        }
      );

    return normalized;

  }

  const objective =
    String(
      campaign.objective || ''
    )
    .toUpperCase();

  let selectedWeights =
    KOL_IDS_PORTFOLIO_CONFIG
      .OBJECTIVE_WEIGHTS
      .BRAND;

  if (
    objective.indexOf(
      'AWARE'
    ) !== -1
  ) {

    selectedWeights =
      KOL_IDS_PORTFOLIO_CONFIG
        .OBJECTIVE_WEIGHTS
        .AWARENESS;

  }
  else if (
    objective.indexOf(
      'CRED'
    ) !== -1
  ) {

    selectedWeights =
      KOL_IDS_PORTFOLIO_CONFIG
        .OBJECTIVE_WEIGHTS
        .CREDIBILITY;

  }
  else if (
    objective.indexOf(
      'CONSIDER'
    ) !== -1
  ) {

    selectedWeights =
      KOL_IDS_PORTFOLIO_CONFIG
        .OBJECTIVE_WEIGHTS
        .CONSIDERATION;

  }
  else if (
    objective.indexOf(
      'CONVERT'
    ) !== -1 ||
    objective.indexOf(
      'SALES'
    ) !== -1
  ) {

    selectedWeights =
      KOL_IDS_PORTFOLIO_CONFIG
        .OBJECTIVE_WEIGHTS
        .CONVERSION;

  }
  else if (
    objective.indexOf(
      'COMMUNITY'
    ) !== -1
  ) {

    selectedWeights =
      KOL_IDS_PORTFOLIO_CONFIG
        .OBJECTIVE_WEIGHTS
        .COMMUNITY;

  }

  return selectedWeights;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildCampaignWeights_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildCampaignWeights_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * NORMALIZE CANDIDATES
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioNormalizeCandidates_(
  rows,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioNormalizeCandidates_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  return rows

    .map(
      row => {

        const kolId =
          String(
            row[1] || ''
          ).trim();

        const name =
          String(
            row[2] || ''
          ).trim();

        if (!name) {

          return null;

        }

        const fit =
          KOL_IDS_PORTFOLIO_portfolioClamp_(
            KOL_IDS_PORTFOLIO_portfolioNumber_(
              row[3]
            )
          );

        const impact =
          KOL_IDS_PORTFOLIO_portfolioClamp_(
            KOL_IDS_PORTFOLIO_portfolioNumber_(
              row[4]
            )
          );

        const confidence =
          KOL_IDS_PORTFOLIO_portfolioClamp_(
            KOL_IDS_PORTFOLIO_portfolioNumber_(
              row[5]
            )
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
          String(
            row[8] || ''
          )
          .trim();

        const primary =
          String(
            row[9] || ''
          )
          .trim();

        const secondary =
          String(
            row[10] || ''
          )
          .trim();

        const evidenceRaw =
          row[14];

        const evidenceScore =
          KOL_IDS_PORTFOLIO_portfolioEvidenceScore_(
            evidenceRaw
          );

        /*
         * Core contribution.
         */

        const contribution =

          fit * 0.30

          +

          impact * 0.35

          +

          confidence * 0.20

          +

          evidenceScore * 0.15;

        /*
         * Risk-adjusted importance.
         */

        let importance =
          contribution;

        if (
          risk === 'MEDIUM'
        ) {

          importance *= 0.92;

        }

        if (
          risk === 'HIGH'
        ) {

          importance *= 0.65;

        }

        if (
          decision ===
          'REVIEW REQUIRED'
        ) {

          importance *= 0.88;

        }

        if (
          decision ===
          'NOT RECOMMENDED'
        ) {

          importance *= 0.55;

        }

        importance =
          KOL_IDS_PORTFOLIO_portfolioRound_(
            importance
          );

        const strategicValue =

          importance * 0.45

          +

          impact * 0.20

          +

          confidence * 0.15

          +

          evidenceScore * 0.10

          +

          fit * 0.10;

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

          contribution,

          strategicValue,

          objectiveAlignment:
            0,

          cost:
            0,

          costSource:
            'NOT FOUND',

          budgetEfficiency:
            0,

          dataQuality:
            KOL_IDS_PORTFOLIO_portfolioCandidateDataQuality_(
              {
                fit,
                impact,
                confidence,
                evidenceScore,
                role,
                primary,
                cost: 0
              }
            ),

          selected:
            false,

          _portfolioValue:
            0,

          _selectionReason:
            '',

          _alternativeReason:
            ''

        };

      }
    )

    .filter(
      Boolean
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioNormalizeCandidates_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioNormalizeCandidates_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * OBJECTIVE ALIGNMENT
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioObjectiveAlignment_(
  candidate,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioObjectiveAlignment_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const weights =
    campaign.objectiveWeights;

  /*
   * We map available KOL impact dimensions
   * using the candidate's primary / secondary
   * impact labels.
   */

  const primary =
    KOL_IDS_PORTFOLIO_portfolioImpactKey_(
      candidate.primary
    );

  const secondary =
    KOL_IDS_PORTFOLIO_portfolioImpactKey_(
      candidate.secondary
    );

  let score =
    50;

  if (
    primary &&
    weights[primary] !== undefined
  ) {

    score +=
      weights[primary] *
      50;

  }

  if (
    secondary &&
    weights[secondary] !== undefined
  ) {

    score +=
      weights[secondary] *
      25;

  }

  /*
   * Primary KPI signal.
   */

  const kpi =
    String(
      campaign.primaryKpi || ''
    )
    .toUpperCase();

  if (
    primary &&
    kpi.indexOf(
      primary.toUpperCase()
    ) !== -1
  ) {

    score += 10;

  }

  return KOL_IDS_PORTFOLIO_portfolioClamp_(
    score
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioObjectiveAlignment_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioObjectiveAlignment_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * IMPACT KEY
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioImpactKey_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioImpactKey_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const text =
    String(
      value || ''
    )
    .trim()
    .toUpperCase();

  if (!text) {

    return '';

  }

  if (
    text.indexOf(
      'AWARE'
    ) !== -1 ||
    text.indexOf(
      'REACH'
    ) !== -1
  ) {

    return 'awareness';

  }

  if (
    text.indexOf(
      'CRED'
    ) !== -1 ||
    text.indexOf(
      'TRUST'
    ) !== -1
  ) {

    return 'credibility';

  }

  if (
    text.indexOf(
      'RELEV'
    ) !== -1 ||
    text.indexOf(
      'CONSIDER'
    ) !== -1
  ) {

    return 'relevance';

  }

  if (
    text.indexOf(
      'PERCEP'
    ) !== -1 ||
    text.indexOf(
      'IMAGE'
    ) !== -1
  ) {

    return 'perception';

  }

  if (
    text.indexOf(
      'PURCHASE'
    ) !== -1 ||
    text.indexOf(
      'CONVERT'
    ) !== -1 ||
    text.indexOf(
      'SALES'
    ) !== -1
  ) {

    return 'purchase';

  }

  if (
    text.indexOf(
      'COMMUNITY'
    ) !== -1 ||
    text.indexOf(
      'ENGAGE'
    ) !== -1
  ) {

    return 'community';

  }

  return '';


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioImpactKey_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioImpactKey_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * COST DATA
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioAttachCostData_(
  ss,
  candidates
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioAttachCostData_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const sheet =
    ss.getSheetByName(
      '04_KOL_DATABASE'
    );

  if (!sheet) {

    return candidates;

  }

  const lastRow =
    sheet.getLastRow();

  const lastColumn =
    sheet.getLastColumn();

  if (
    lastRow < 2 ||
    lastColumn < 1
  ) {

    return candidates;

  }

  const values =
    sheet
      .getRange(
        1,
        1,
        lastRow,
        lastColumn
      )
      .getValues();

  const headers =
    values[0]
      .map(
        x =>
          String(
            x || ''
          )
          .trim()
          .toUpperCase()
      );

  const idIndex =
    KOL_IDS_PORTFOLIO_portfolioFindHeader_(
      headers,
      [
        'KOL ID',
        'KOL_ID',
        'ID'
      ]
    );

  const nameIndex =
    KOL_IDS_PORTFOLIO_portfolioFindHeader_(
      headers,
      [
        'KOL NAME',
        'NAME',
        'KOL',
        'CREATOR NAME'
      ]
    );

  const costIndex =
    KOL_IDS_PORTFOLIO_portfolioFindHeader_(
      headers,
      [
        'KOL COST',
        'KOL FEE',
        'FEE',
        'RATE',
        'COST',
        'PRICE',
        'BUDGET',
        'CAMPAIGN FEE'
      ]
    );

  const idMap = {};
  const nameMap = {};

  if (costIndex >= 0) {

    for (
      let i = 1;
      i < values.length;
      i++
    ) {

      const row =
        values[i];

      const id =
        idIndex >= 0
          ?
            String(
              row[idIndex] || ''
            ).trim()
          :
            '';

      const name =
        nameIndex >= 0
          ?
            String(
              row[nameIndex] || ''
            ).trim()
          :
            '';

      const cost =
        KOL_IDS_PORTFOLIO_portfolioParseMoney_(
          row[costIndex]
        );

      if (id) {

        idMap[id] =
          cost;

      }

      if (name) {

        nameMap[
          name.toUpperCase()
        ] =
          cost;

      }

    }

  }

  candidates.forEach(
    candidate => {

      let cost =
        0;

      if (
        candidate.kolId &&
        Object.prototype.hasOwnProperty.call(
          idMap,
          candidate.kolId
        )
      ) {

        cost =
          idMap[
            candidate.kolId
          ];

        candidate.costSource =
          'KOL ID';

      }
      else if (
        candidate.name &&
        Object.prototype.hasOwnProperty.call(
          nameMap,
          candidate.name.toUpperCase()
        )
      ) {

        cost =
          nameMap[
            candidate.name.toUpperCase()
          ];

        candidate.costSource =
          'KOL NAME';

      }
      else {

        candidate.costSource =
          'NOT FOUND';

      }

      candidate.cost =
        KOL_IDS_PORTFOLIO_portfolioNumber_(
          cost
        );

      /*
       * Efficiency is normalized relative
       * to candidate value.
       */

      if (
        candidate.cost > 0
      ) {

        candidate.budgetEfficiency =
          (
            candidate.strategicValue /
            candidate.cost
          ) * 10000;

      }
      else {

        /*
         * Unknown cost must NOT receive
         * an artificial "perfect" efficiency.
         */

        candidate.budgetEfficiency =
          0;

      }

      candidate.dataQuality =
        KOL_IDS_PORTFOLIO_portfolioCandidateDataQuality_(
          candidate
        );

      candidate.finalCandidateScore =
        KOL_IDS_PORTFOLIO_portfolioCandidateScore_(
          candidate
        );

    }
  );

  return candidates;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioAttachCostData_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioAttachCostData_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CANDIDATE SCORE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCandidateScore_(
  candidate
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCandidateScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let score =

    candidate.importance * 0.30

    +

    candidate.strategicValue * 0.20

    +

    candidate.objectiveAlignment * 0.20

    +

    candidate.evidenceScore * 0.10

    +

    candidate.confidence * 0.10

    +

    candidate.dataQuality * 0.10;

  if (
    candidate.risk ===
    'HIGH'
  ) {

    score -=
      KOL_IDS_PORTFOLIO_CONFIG
        .HIGH_RISK_PENALTY;

  }
  else if (
    candidate.risk ===
    'MEDIUM'
  ) {

    score -=
      KOL_IDS_PORTFOLIO_CONFIG
        .MEDIUM_RISK_PENALTY;

  }

  if (
    candidate.decision ===
    'REVIEW REQUIRED'
  ) {

    score -=
      KOL_IDS_PORTFOLIO_CONFIG
        .REVIEW_PENALTY;

  }

  if (
    candidate.decision ===
    'NOT RECOMMENDED'
  ) {

    score -=
      KOL_IDS_PORTFOLIO_CONFIG
        .NOT_RECOMMENDED_PENALTY;

  }

  return KOL_IDS_PORTFOLIO_portfolioClamp_(
    score
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCandidateScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCandidateScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * BUILD PORTFOLIO
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuild_(
  candidates,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuild_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const budget =
    KOL_IDS_PORTFOLIO_portfolioNumber_(
      campaign.budget
    );

  const hasBudget =
    budget > 0;

  const maxSpend =
    hasBudget
      ?
        budget *
        KOL_IDS_PORTFOLIO_CONFIG
          .BUDGET_UTILIZATION_LIMIT
      :
        0;

  /*
   * Candidate eligibility.
   */

  const viable =
    candidates
      .filter(
        candidate => {

          if (
            candidate.decision ===
            'NOT RECOMMENDED'
          ) {

            return false;

          }

          return (
            candidate.finalCandidateScore >=
            KOL_IDS_PORTFOLIO_CONFIG
              .MIN_CANDIDATE_SCORE
          );

        }
      );

  const budgetViable =
    viable.filter(
      candidate => {

        if (!hasBudget) {

          return true;

        }

        if (
          candidate.cost <= 0
        ) {

          return true;

        }

        return (
          candidate.cost <=
          maxSpend
        );

      }
    );

  /*
   * Sort by intelligence score.
   */

  budgetViable.sort(
    (a, b) =>
      b.finalCandidateScore -
      a.finalCandidateScore
  );

  const selected = [];

  /* Compact counters remove the repeated selected[] scans from the hot path.
   * This matters for 200 candidates × 100 selections. */
  const selectedState = {
    count: 0,
    roles: Object.create(null),
    primaries: Object.create(null),
    secondaryToPrimary: Object.create(null),
    primaryToSecondary: Object.create(null)
  };

  let spent =
    0;

  /*
   * Greedy marginal optimization.
   */

  while (
    selected.length <
    campaign.targetKOLs
  ) {

    let best =
      null;

    let bestValue =
      -Infinity;

    budgetViable.forEach(
      candidate => {

        if (
          candidate.selected
        ) {

          return;

        }

        if (
          hasBudget &&
          candidate.cost > 0 &&
          spent +
          candidate.cost >
          maxSpend
        ) {

          return;

        }

        const value =
          KOL_IDS_PORTFOLIO_portfolioMarginalValue_(
            candidate,
            selected,
            campaign,
            spent,
            maxSpend,
            selectedState
          );

        if (
          value >
          bestValue
        ) {

          bestValue =
            value;

          best =
            candidate;

        }

      }
    );

    if (!best) {

      break;

    }

    best.selected =
      true;

    best._portfolioValue =
      bestValue;

    best._selectionReason =
      KOL_IDS_PORTFOLIO_portfolioSelectionReason_(
        best,
        selected,
        campaign
      );

    selected.push(
      best
    );

    KOL_IDS_PORTFOLIO_portfolioUpdateSelectionState_(
      selectedState,
      best
    );

    spent +=
      best.cost || 0;

  }

  /*
   * Portfolio metrics.
   */

  const coverage =
    KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_(
      selected,
      campaign
    );

  const synergy =
    KOL_IDS_PORTFOLIO_portfolioCalculateSynergy_(
      selected
    );

  const riskExposure =
    KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_(
      selected
    );

  const dataQuality =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.dataQuality
      )
    );

  const portfolioConfidence =
    KOL_IDS_PORTFOLIO_portfolioCalculatePortfolioConfidence_(
      selected,
      dataQuality,
      riskExposure
    );

  const score =
    KOL_IDS_PORTFOLIO_portfolioCalculateScore_(
      selected,
      budget,
      coverage,
      synergy,
      portfolioConfidence,
      riskExposure
    );

  let status =
    'AT RISK';

  if (
    score >=
    KOL_IDS_PORTFOLIO_CONFIG
      .SCORE_STRONG
  ) {

    status =
      'STRONG';

  }
  else if (
    score >=
    KOL_IDS_PORTFOLIO_CONFIG
      .SCORE_VIABLE
  ) {

    status =
      'VIABLE';

  }
  else if (
    score >=
    KOL_IDS_PORTFOLIO_CONFIG
      .SCORE_ATTENTION
  ) {

    status =
      'ATTENTION';

  }

  const highRisk =
    selected.filter(
      x =>
        x.risk === 'HIGH'
    );

  const reviewRequired =
    selected.filter(
      x =>
        x.decision ===
        'REVIEW REQUIRED'
    );

  const budgetRemaining =
    hasBudget
      ?
        Math.max(
          0,
          budget - spent
        )
      :
        null;

  const utilization =
    hasBudget
      ?
        (
          spent /
          budget
        ) * 100
      :
        null;

  const budgetStatus =
    KOL_IDS_PORTFOLIO_portfolioBudgetStatus_(
      hasBudget,
      utilization
    );

  const alternatives =
    budgetViable
      .filter(
        x =>
          !x.selected
      )
      .map(
        candidate => {

          candidate._alternativeReason =
            KOL_IDS_PORTFOLIO_portfolioAlternativeReason_(
              candidate,
              selected,
              campaign
            );

          return candidate;

        }
      )
      .sort(
        (a, b) =>
          b.finalCandidateScore -
          a.finalCandidateScore
      )
      .slice(
        0,
        5
      );

  const missingCost =
    candidates.filter(
      x =>
        x.cost <= 0
    ).length;

  /*
   * Swap intelligence.
   */

  const swaps =
    KOL_IDS_PORTFOLIO_portfolioFindBestSwaps_(
      selected,
      alternatives,
      campaign
    );

  /*
   * Coverage gaps.
   */

  const coverageGaps =
    KOL_IDS_PORTFOLIO_portfolioFindCoverageGaps_(
      selected,
      campaign
    );

  const executiveDecision =
    KOL_IDS_PORTFOLIO_portfolioExecutiveDecision_(
      score,
      status,
      coverage,
      riskExposure,
      dataQuality,
      budgetStatus,
      swaps,
      coverageGaps
    );

  return {

    selected,

    alternatives,

    swaps,

    coverageGaps,

    score,

    status,

    executiveDecision,

    highRisk,

    reviewRequired,

    candidateCount:
      candidates.length,

    budget,

    maxSpend,

    plannedSpend:
      spent,

    budgetRemaining,

    utilization,

    budgetStatus,

    missingCost,

    coverageScore:
      coverage.score,

    coverage,

    synergyScore:
      synergy.score,

    synergy,

    riskExposure,

    dataQuality,

    portfolioConfidence

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuild_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuild_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SELECTION STATE — AGENCY SCALE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioUpdateSelectionState_(state, candidate) {
  if (!state || !candidate) return state;
  var role = String(candidate.role || '').trim().toUpperCase();
  var primary = String(candidate.primary || '').trim().toUpperCase();
  var secondary = String(candidate.secondary || '').trim().toUpperCase();
  state.count += 1;
  if (role) state.roles[role] = Number(state.roles[role] || 0) + 1;
  if (primary) state.primaries[primary] = Number(state.primaries[primary] || 0) + 1;
  if (secondary && primary) {
    state.secondaryToPrimary[primary] = Number(state.secondaryToPrimary[primary] || 0) + 1;
    state.primaryToSecondary[secondary] = Number(state.primaryToSecondary[secondary] || 0) + 1;
  }
  return state;
}

/* ==================================================
 * MARGINAL VALUE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioMarginalValue_(
  candidate,
  selected,
  campaign,
  spent,
  maxSpend,
  selectedState
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioMarginalValue_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let value =
    candidate.finalCandidateScore;

  /*
   * Objective alignment.
   */

  value +=
    candidate.objectiveAlignment *
    0.20;

  /*
   * Diversity.
   */

  var roleKey = String(candidate.role || '').trim().toUpperCase();
  var primaryKey = String(candidate.primary || '').trim().toUpperCase();
  var roleOverlap;
  var primaryOverlap;

  if (selectedState) {
    roleOverlap = roleKey ? Number(selectedState.roles[roleKey] || 0) : 0;
    primaryOverlap = primaryKey ? Number(selectedState.primaries[primaryKey] || 0) : 0;
  } else {
    roleOverlap = selected.filter(function(x){
      return KOL_IDS_PORTFOLIO_portfolioSame_(x.role, candidate.role);
    }).length;
    primaryOverlap = selected.filter(function(x){
      return KOL_IDS_PORTFOLIO_portfolioSame_(x.primary, candidate.primary);
    }).length;
  }

  value -= roleOverlap * KOL_IDS_PORTFOLIO_CONFIG.OVERLAP_PENALTY;
  value -= primaryOverlap * KOL_IDS_PORTFOLIO_CONFIG.OVERLAP_PENALTY;

  /*
   * New coverage bonus.
   */

  if (
    candidate.primary
  ) {

    const alreadyCovered =
      selected.some(
        x =>
          KOL_IDS_PORTFOLIO_portfolioSame_(
            x.primary,
            candidate.primary
          )
      );

    if (!alreadyCovered) {

      value += 8;

    }

  }

  /*
   * Synergy.
   */

  if (selected.length) {
    var synergy;
    if (selectedState) {
      var n = selectedState.count;
      var sameRole = roleKey ? Number(selectedState.roles[roleKey] || 0) : 0;
      var samePrimary = primaryKey ? Number(selectedState.primaries[primaryKey] || 0) : 0;
      var secondary = String(candidate.secondary || '').trim().toUpperCase();
      var secondaryMatch = secondary ? Number(selectedState.primaryToSecondary[secondary] || 0) : 0;
      var primaryAsSecondary = primaryKey ? Number(selectedState.secondaryToPrimary[primaryKey] || 0) : 0;
      synergy = Math.min(
        12,
        Math.max(0, (n - sameRole) * 2) +
        Math.max(0, (n - samePrimary) * 2) +
        secondaryMatch * 4 +
        primaryAsSecondary * 4
      );
    } else {
      synergy = KOL_IDS_PORTFOLIO_portfolioPairSynergy_(candidate, selected);
    }
    value += synergy;
  }

  /*
   * Budget efficiency.
   */

  if (
    candidate.cost > 0
  ) {

    if (
      candidate.budgetEfficiency >=
      KOL_IDS_PORTFOLIO_CONFIG
        .BUDGET_EFFICIENCY_HIGH
    ) {

      value += 7;

    }
    else if (
      candidate.budgetEfficiency >=
      KOL_IDS_PORTFOLIO_CONFIG
        .BUDGET_EFFICIENCY_MEDIUM
    ) {

      value += 3;

    }

  }
  else {

    /*
     * Missing cost is uncertainty,
     * not free value.
     */

    value -= 5;

  }

  /*
   * Budget pressure.
   */

  if (
    maxSpend > 0 &&
    candidate.cost > 0
  ) {

    const remaining =
      Math.max(
        0,
        maxSpend - spent
      );

    if (
      remaining > 0
    ) {

      const ratio =
        candidate.cost /
        remaining;

      if (
        ratio > 0.75
      ) {

        value -= 10;

      }
      else if (
        ratio > 0.50
      ) {

        value -= 5;

      }

    }

  }

  /*
   * Risk.
   */

  if (
    candidate.risk ===
    'HIGH'
  ) {

    value -=
      KOL_IDS_PORTFOLIO_CONFIG
        .HIGH_RISK_PENALTY;

  }

  if (
    candidate.risk ===
    'MEDIUM'
  ) {

    value -=
      KOL_IDS_PORTFOLIO_CONFIG
        .MEDIUM_RISK_PENALTY;

  }

  if (
    candidate.decision ===
    'REVIEW REQUIRED'
  ) {

    value -=
      KOL_IDS_PORTFOLIO_CONFIG
        .REVIEW_PENALTY;

  }

  return value;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioMarginalValue_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioMarginalValue_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PORTFOLIO SCORE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCalculateScore_(
  selected,
  budget,
  coverage,
  synergy,
  portfolioConfidence,
  riskExposure
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCalculateScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    !selected.length
  ) {

    return 0;

  }

  const avgFit =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.fit
      )
    );

  const avgImpact =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.impact
      )
    );

  const avgImportance =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.importance
      )
    );

  const avgObjective =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.objectiveAlignment
      )
    );

  const evidence =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.evidenceScore
      )
    );

  let budgetScore =
    50;

  if (
    budget > 0
  ) {

    const spend =
      selected.reduce(
        (sum, x) =>
          sum +
          (
            x.cost || 0
          ),
        0
      );

    const utilization =
      spend /
      budget;

    if (
      utilization >= 0.70 &&
      utilization <= 0.95
    ) {

      budgetScore =
        90;

    }
    else if (
      utilization < 0.70
    ) {

      budgetScore =
        70;

    }
    else {

      budgetScore =
        35;

    }

  }

  /*
   * Risk score.
   *
   * riskExposure is 0-100,
   * where lower is better.
   */

  const riskScore =
    Math.max(
      0,
      100 -
      riskExposure
    );

  let score =

    avgFit * 0.12

    +

    avgImpact * 0.18

    +

    avgImportance * 0.15

    +

    avgObjective * 0.15

    +

    evidence * 0.08

    +

    coverage.score * 0.12

    +

    synergy.score * 0.08

    +

    budgetScore * 0.05

    +

    portfolioConfidence * 0.05

    +

    riskScore * 0.02;

  return KOL_IDS_PORTFOLIO_portfolioRound_(
    KOL_IDS_PORTFOLIO_portfolioClamp_(
      score
    )
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCalculateScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCalculateScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * COVERAGE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_(
  selected,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const weights =
    campaign.objectiveWeights;

  const covered = {};

  Object.keys(weights)
    .forEach(
      key => {

        covered[key] =
          0;

      }
    );

  selected.forEach(
    candidate => {

      const primary =
        KOL_IDS_PORTFOLIO_portfolioImpactKey_(
          candidate.primary
        );

      const secondary =
        KOL_IDS_PORTFOLIO_portfolioImpactKey_(
          candidate.secondary
        );

      if (
        primary &&
        covered[primary] !== undefined
      ) {

        covered[primary] =
          Math.max(
            covered[primary],
            candidate.objectiveAlignment
          );

      }

      if (
        secondary &&
        covered[secondary] !== undefined
      ) {

        covered[secondary] =
          Math.max(
            covered[secondary],
            candidate.objectiveAlignment *
            0.70
          );

      }

    }
  );

  let weightedCoverage =
    0;

  let totalWeight =
    0;

  Object.keys(weights)
    .forEach(
      key => {

        totalWeight +=
          weights[key];

        const normalized =
          Math.min(
            1,
            covered[key] / 100
          );

        weightedCoverage +=
          normalized *
          weights[key];

      }
    );

  const score =
    totalWeight > 0
      ?
        weightedCoverage /
        totalWeight *
        100
      :
        0;

  return {

    score:
      KOL_IDS_PORTFOLIO_portfolioRound_(
        score
      ),

    covered

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SYNERGY
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCalculateSynergy_(
  selected
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCalculateSynergy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    selected.length < 2
  ) {

    return {

      score:
        0,

      pairs:
        0

    };

  }

  let pairCount =
    0;

  let synergyTotal =
    0;

  for (
    let i = 0;
    i < selected.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < selected.length;
      j++
    ) {

      pairCount++;

      synergyTotal +=
        KOL_IDS_PORTFOLIO_portfolioPairSynergy_(
          selected[i],
          [selected[j]]
        );

    }

  }

  const average =
    pairCount > 0
      ?
        synergyTotal /
        pairCount
      :
        0;

  return {

    score:
      KOL_IDS_PORTFOLIO_portfolioClamp_(
        50 +
        average
      ),

    pairs:
      pairCount

  };


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCalculateSynergy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCalculateSynergy_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PAIR SYNERGY
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioPairSynergy_(
  candidate,
  selected
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioPairSynergy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let score =
    0;

  selected.forEach(
    x => {

      if (
        !KOL_IDS_PORTFOLIO_portfolioSame_(
          x.role,
          candidate.role
        )
      ) {

        score +=
          2;

      }

      if (
        !KOL_IDS_PORTFOLIO_portfolioSame_(
          x.primary,
          candidate.primary
        )
      ) {

        score +=
          2;

      }

      if (
        candidate.secondary &&
        x.primary &&
        KOL_IDS_PORTFOLIO_portfolioSame_(
          candidate.secondary,
          x.primary
        )
      ) {

        score +=
          4;

      }

      if (
        x.secondary &&
        candidate.primary &&
        KOL_IDS_PORTFOLIO_portfolioSame_(
          x.secondary,
          candidate.primary
        )
      ) {

        score +=
          4;

      }

    }
  );

  return Math.min(
    12,
    score
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioPairSynergy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioPairSynergy_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * RISK EXPOSURE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_(
  selected
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    !selected.length
  ) {

    return 100;

  }

  let risk =
    0;

  selected.forEach(
    candidate => {

      if (
        candidate.risk ===
        'HIGH'
      ) {

        risk +=
          25;

      }
      else if (
        candidate.risk ===
        'MEDIUM'
      ) {

        risk +=
          10;

      }
      else {

        risk +=
          2;

      }

      if (
        candidate.decision ===
        'REVIEW REQUIRED'
      ) {

        risk +=
          8;

      }

    }
  );

  return KOL_IDS_PORTFOLIO_portfolioClamp_(
    risk /
    selected.length
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * PORTFOLIO CONFIDENCE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCalculatePortfolioConfidence_(
  selected,
  dataQuality,
  riskExposure
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCalculatePortfolioConfidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    !selected.length
  ) {

    return 0;

  }

  const avgConfidence =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.confidence
      )
    );

  const avgEvidence =
    KOL_IDS_PORTFOLIO_portfolioAverage_(
      selected.map(
        x =>
          x.evidenceScore
      )
    );

  const riskAdjusted =
    Math.max(
      0,
      100 -
      riskExposure
    );

  return KOL_IDS_PORTFOLIO_portfolioRound_(
    KOL_IDS_PORTFOLIO_portfolioClamp_(
      avgConfidence * 0.35
      +
      avgEvidence * 0.25
      +
      dataQuality * 0.25
      +
      riskAdjusted * 0.15
    )
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCalculatePortfolioConfidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCalculatePortfolioConfidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * DATA QUALITY
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCandidateDataQuality_(
  candidate
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCandidateDataQuality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let score =
    0;

  let total =
    0;

  const checks = [

    candidate.fit > 0,

    candidate.impact > 0,

    candidate.confidence > 0,

    candidate.evidenceScore > 20,

    Boolean(candidate.role),

    Boolean(candidate.primary),

    candidate.cost > 0

  ];

  checks.forEach(
    check => {

      total++;

      if (check) {

        score++;

      }

    }
  );

  return KOL_IDS_PORTFOLIO_portfolioRound_(
    score /
    total *
    100
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCandidateDataQuality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCandidateDataQuality_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SELECTION REASON
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioSelectionReason_(
  candidate,
  selected,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioSelectionReason_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const reasons = [];

  if (
    candidate.objectiveAlignment >=
    75
  ) {

    reasons.push(
      'Strong objective alignment'
    );

  }

  if (
    candidate.fit >= 80
  ) {

    reasons.push(
      'Strong brand fit'
    );

  }

  if (
    candidate.impact >= 80
  ) {

    reasons.push(
      'High expected brand impact'
    );

  }

  if (
    candidate.evidenceScore >= 80
  ) {

    reasons.push(
      'Strong evidence confidence'
    );

  }

  const newRole =
    !selected.some(
      x =>
        KOL_IDS_PORTFOLIO_portfolioSame_(
          x.role,
          candidate.role
        )
    );

  if (newRole) {

    reasons.push(
      'Adds portfolio role diversity'
    );

  }

  const newImpact =
    !selected.some(
      x =>
        KOL_IDS_PORTFOLIO_portfolioSame_(
          x.primary,
          candidate.primary
        )
    );

  if (newImpact) {

    reasons.push(
      'Adds new impact coverage'
    );

  }

  if (
    candidate.budgetEfficiency >=
    KOL_IDS_PORTFOLIO_CONFIG
      .BUDGET_EFFICIENCY_HIGH
  ) {

    reasons.push(
      'Strong budget efficiency'
    );

  }

  if (!reasons.length) {

    reasons.push(
      'Highest marginal strategic value available'
    );

  }

  return reasons.join(
    ' • '
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioSelectionReason_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioSelectionReason_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * ALTERNATIVE REASON
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioAlternativeReason_(
  candidate,
  selected,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioAlternativeReason_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const reasons = [];

  const sameRole =
    selected.filter(
      x =>
        KOL_IDS_PORTFOLIO_portfolioSame_(
          x.role,
          candidate.role
        )
    ).length;

  const sameImpact =
    selected.filter(
      x =>
        KOL_IDS_PORTFOLIO_portfolioSame_(
          x.primary,
          candidate.primary
        )
    ).length;

  if (
    sameRole
  ) {

    reasons.push(
      'Role KOL_IDS_DECISION_SCIENCE_overlap'
    );

  }

  if (
    sameImpact
  ) {

    reasons.push(
      'Impact KOL_IDS_DECISION_SCIENCE_overlap'
    );

  }

  if (
    candidate.cost > 0 &&
    candidate.budgetEfficiency <
    KOL_IDS_PORTFOLIO_CONFIG
      .BUDGET_EFFICIENCY_MEDIUM
  ) {

    reasons.push(
      'Lower budget efficiency'
    );

  }

  if (
    candidate.objectiveAlignment <
    60
  ) {

    reasons.push(
      'Lower objective alignment'
    );

  }

  if (
    candidate.risk ===
    'HIGH'
  ) {

    reasons.push(
      'Higher risk'
    );

  }

  if (!reasons.length) {

    reasons.push(
      'Strong backup option'
    );

  }

  return reasons.join(
    ' • '
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioAlternativeReason_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioAlternativeReason_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * COVERAGE GAPS
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioFindCoverageGaps_(
  selected,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioFindCoverageGaps_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const coverage =
    KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_(
      selected,
      campaign
    );

  const gaps = [];

  Object.keys(
    campaign.objectiveWeights
  )
  .forEach(
    key => {

      const weight =
        campaign.objectiveWeights[key];

      if (
        weight < 0.10
      ) {

        return;

      }

      const value =
        coverage.covered[key] || 0;

      if (
        value < 60
      ) {

        gaps.push({

          area:
            key,

          priority:
            KOL_IDS_PORTFOLIO_portfolioRound_(
              weight * 100
            ),

          coverage:
            KOL_IDS_PORTFOLIO_portfolioRound_(
              value
            )

        });

      }

    }
  );

  gaps.sort(
    (a, b) =>
      b.priority -
      a.priority
  );

  return gaps;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioFindCoverageGaps_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioFindCoverageGaps_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SWAP INTELLIGENCE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioFindBestSwaps_(
  selected,
  alternatives,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioFindBestSwaps_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const swaps = [];

  if (
    !selected.length ||
    !alternatives.length
  ) {

    return swaps;

  }

  const currentScore =
    KOL_IDS_PORTFOLIO_portfolioCalculateScore_(
      selected,
      campaign.budget,
      KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_(
        selected,
        campaign
      ),
      KOL_IDS_PORTFOLIO_portfolioCalculateSynergy_(
        selected
      ),
      KOL_IDS_PORTFOLIO_portfolioCalculatePortfolioConfidence_(
        selected,
        KOL_IDS_PORTFOLIO_portfolioAverage_(
          selected.map(
            x =>
              x.dataQuality
          )
        ),
        KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_(
          selected
        )
      ),
      KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_(
        selected
      )
    );

  /* For large agency portfolios, swaps are an exception-analysis tool, not
   * an exhaustive N×M search. Evaluate the lowest-scoring selected KOLs first;
   * this keeps 100-KOL portfolios responsive while preserving useful swap
   * intelligence. Small portfolios retain the original exhaustive behavior. */
  var swapCurrentPool = selected;
  if (selected.length > 30) {
    swapCurrentPool = selected.slice().sort(function(a,b){
      return Number(a.finalCandidateScore || 0) - Number(b.finalCandidateScore || 0);
    }).slice(0, 20);
  }

  swapCurrentPool.forEach(
    current => {

      alternatives.forEach(
        alternative => {

          const simulated =
            selected
              .filter(
                x =>
                  x !== current
              )
              .concat(
                alternative
              );

          const simulatedCoverage =
            KOL_IDS_PORTFOLIO_portfolioCalculateCoverage_(
              simulated,
              campaign
            );

          const simulatedSynergy =
            KOL_IDS_PORTFOLIO_portfolioCalculateSynergy_(
              simulated
            );

          const simulatedRisk =
            KOL_IDS_PORTFOLIO_portfolioCalculateRiskExposure_(
              simulated
            );

          const simulatedQuality =
            KOL_IDS_PORTFOLIO_portfolioAverage_(
              simulated.map(
                x =>
                  x.dataQuality
              )
            );

          const simulatedConfidence =
            KOL_IDS_PORTFOLIO_portfolioCalculatePortfolioConfidence_(
              simulated,
              simulatedQuality,
              simulatedRisk
            );

          const simulatedScore =
            KOL_IDS_PORTFOLIO_portfolioCalculateScore_(
              simulated,
              campaign.budget,
              simulatedCoverage,
              simulatedSynergy,
              simulatedConfidence,
              simulatedRisk
            );

          const gain =
            simulatedScore -
            currentScore;

          if (
            gain >=
            KOL_IDS_PORTFOLIO_CONFIG
              .SWAP_GAIN_THRESHOLD
          ) {

            swaps.push({

              remove:
                current,

              add:
                alternative,

              gain:
                KOL_IDS_PORTFOLIO_portfolioRound_(
                  gain
                ),

              newScore:
                simulatedScore,

              budgetDelta:
                (
                  alternative.cost || 0
                ) -
                (
                  current.cost || 0
                )

            });

          }

        }
      );

    }
  );

  swaps.sort(
    (a, b) =>
      b.gain -
      a.gain
  );

  return swaps.slice(
    0,
    5
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioFindBestSwaps_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioFindBestSwaps_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * EXECUTIVE DECISION
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioExecutiveDecision_(
  score,
  status,
  coverage,
  riskExposure,
  dataQuality,
  budgetStatus,
  swaps,
  gaps
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioExecutiveDecision_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    status === 'STRONG' &&
    coverage.score >= 70 &&
    riskExposure < 20 &&
    dataQuality >= 85
  ) {

    return 'ACTIVATE';

  }

  if (
    status === 'VIABLE' &&
    coverage.score >= 55
  ) {

    return 'ACTIVATE WITH REVIEW';

  }

  if (
    swaps.length &&
    swaps[0].gain >= 5
  ) {

    return 'OPTIMIZE BEFORE ACTIVATION';

  }

  if (
    gaps.length &&
    gaps[0].priority >= 25
  ) {

    return 'COVER STRATEGIC GAP';

  }

  if (
    riskExposure >= 30
  ) {

    return 'RISK REVIEW REQUIRED';

  }

  if (
    budgetStatus ===
    'OVER LIMIT'
  ) {

    return 'REBALANCE BUDGET';

  }

  return 'DO NOT ACTIVATE YET';


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioExecutiveDecision_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioExecutiveDecision_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * BUDGET STATUS
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBudgetStatus_(
  hasBudget,
  utilization
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBudgetStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (!hasBudget) {

    return 'NO BUDGET DATA';

  }

  if (
    utilization > 95
  ) {

    return 'OVER LIMIT';

  }

  if (
    utilization >= 70
  ) {

    return 'OPTIMIZED';

  }

  return 'UNDER-ALLOCATED';


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBudgetStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBudgetStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SUMMARY
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildSummary_(
  sheet,
  portfolio,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildSummary_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  sheet
    .getRange(
      'A1:H1'
    )
    .merge();

  sheet
    .getRange(
      'A1'
    )
    .setValue(
      'KOL PORTFOLIO INTELLIGENCE™'
    )
    .setFontSize(
      20
    )
    .setFontWeight(
      'bold'
    );

  sheet
    .getRange(
      'A2:H2'
    )
    .merge();

  sheet
    .getRange(
      'A2'
    )
    .setValue(
      (
        campaign.campaignName ||
        'Campaign'
      )
      +
      ' • '
      +
      (
        campaign.objective ||
        'Strategic Portfolio'
      )
    );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'A4:B6',
    'PORTFOLIO SCORE',
    portfolio.score +
    '/100'
  );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'C4:D6',
    'STATUS',
    portfolio.status
  );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'E4:F6',
    'PORTFOLIO CONFIDENCE',
    portfolio.portfolioConfidence +
    '%'
  );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'G4:H6',
    'RISK EXPOSURE',
    portfolio.riskExposure +
    '%'
  );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'A8:B10',
    'STRATEGIC COVERAGE',
    portfolio.coverageScore +
    '%'
  );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'C8:D10',
    'PORTFOLIO SYNERGY',
    portfolio.synergyScore +
    '/100'
  );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'E8:F10',
    'DATA QUALITY',
    portfolio.dataQuality +
    '%'
  );

  KOL_IDS_PORTFOLIO_portfolioCard_(
    sheet,
    'G8:H10',
    'EXECUTIVE DECISION',
    portfolio.executiveDecision
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildSummary_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildSummary_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SELECTED
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildSelected_(
  sheet,
  portfolio
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildSelected_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const startRow =
    12;

  sheet
    .getRange(
      startRow,
      1,
      1,
      8
    )
    .merge();

  sheet
    .getRange(
      startRow,
      1
    )
    .setValue(
      'RECOMMENDED KOL PORTFOLIO'
    )
    .setFontWeight(
      'bold'
    )
    .setFontSize(
      14
    );

  sheet
    .getRange(
      startRow + 1,
      1,
      1,
      8
    )
    .setValues([

      [
        'Rank',
        'KOL',
        'Score',
        'Objective Fit',
        'Impact',
        'Confidence',
        'Cost',
        'Why Selected'
      ]

    ])
    .setFontWeight(
      'bold'
    );

  const rows =
    portfolio.selected.map(
      (x, i) => [

        i + 1,

        x.name,

        KOL_IDS_PORTFOLIO_portfolioRound_(
          x.finalCandidateScore
        ),

        KOL_IDS_PORTFOLIO_portfolioRound_(
          x.objectiveAlignment
        ),

        x.impact,

        x.confidence,

        x.cost || 0,

        x._selectionReason

      ]
    );

  if (rows.length) {

    sheet
      .getRange(
        startRow + 2,
        1,
        rows.length,
        8
      )
      .setValues(
        rows
      );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildSelected_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildSelected_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * ALTERNATIVES
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildAlternatives_(
  sheet,
  portfolio
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildAlternatives_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const startRow =
    14 +
    portfolio.selected.length;

  sheet
    .getRange(
      startRow,
      1,
      1,
      8
    )
    .merge();

  sheet
    .getRange(
      startRow,
      1
    )
    .setValue(
      'ALTERNATIVE / BACKUP KOLs'
    )
    .setFontWeight(
      'bold'
    )
    .setFontSize(
      14
    );

  sheet
    .getRange(
      startRow + 1,
      1,
      1,
      8
    )
    .setValues([

      [
        'Rank',
        'KOL',
        'Score',
        'Objective Fit',
        'Impact',
        'Confidence',
        'Cost',
        'Why Not Selected'
      ]

    ])
    .setFontWeight(
      'bold'
    );

  const rows =
    portfolio.alternatives.map(
      (x, i) => [

        i + 1,

        x.name,

        KOL_IDS_PORTFOLIO_portfolioRound_(
          x.finalCandidateScore
        ),

        KOL_IDS_PORTFOLIO_portfolioRound_(
          x.objectiveAlignment
        ),

        x.impact,

        x.confidence,

        x.cost || 0,

        x._alternativeReason

      ]
    );

  if (rows.length) {

    sheet
      .getRange(
        startRow + 2,
        1,
        rows.length,
        8
      )
      .setValues(
        rows
      );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildAlternatives_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildAlternatives_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * COVERAGE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildCoverage_(
  sheet,
  portfolio,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildCoverage_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const startRow =

    17 +

    portfolio.selected.length +

    portfolio.alternatives.length;

  sheet
    .getRange(
      startRow,
      1,
      1,
      8
    )
    .merge();

  sheet
    .getRange(
      startRow,
      1
    )
    .setValue(
      'STRATEGIC COVERAGE & GAPS'
    )
    .setFontWeight(
      'bold'
    )
    .setFontSize(
      14
    );

  sheet
    .getRange(
      startRow + 1,
      1,
      1,
      8
    )
    .setValues([

      [
        'Impact Area',
        'Priority',
        'Coverage',
        'Status',
        '',
        '',
        '',
        ''
      ]

    ])
    .setFontWeight(
      'bold'
    );

  const rows = [];

  Object.keys(
    campaign.objectiveWeights
  )
  .forEach(
    key => {

      const coverage =
        portfolio.coverage.covered[key] ||
        0;

      const priority =
        campaign.objectiveWeights[key] *
        100;

      let status =
        'COVERED';

      if (
        coverage < 60
      ) {

        status =
          'GAP';

      }
      else if (
        coverage < 75
      ) {

        status =
          'ATTENTION';

      }

      rows.push([

        key.toUpperCase(),

        KOL_IDS_PORTFOLIO_portfolioRound_(
          priority
        ),

        KOL_IDS_PORTFOLIO_portfolioRound_(
          coverage
        ),

        status,

        '',
        '',
        '',
        ''

      ]);

    }
  );

  if (rows.length) {

    sheet
      .getRange(
        startRow + 2,
        1,
        rows.length,
        8
      )
      .setValues(
        rows
      );

  }


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildCoverage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildCoverage_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * RISK WATCH
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildRiskWatch_(
  sheet,
  portfolio
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildRiskWatch_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const startRow =

    19 +

    portfolio.selected.length +

    portfolio.alternatives.length;

  sheet
    .getRange(
      startRow,
      1,
      1,
      8
    )
    .merge();

  sheet
    .getRange(
      startRow,
      1
    )
    .setValue(
      'PORTFOLIO RISK WATCH'
    )
    .setFontWeight(
      'bold'
    )
    .setFontSize(
      14
    );

  const risks = [];

  portfolio.highRisk.forEach(
    x => {

      risks.push([

        x.name,

        'HIGH RISK',

        x.importance,

        x.fit,

        x.impact,

        x.confidence,

        x.decision,

        'Review before activation'

      ]);

    }
  );

  portfolio.reviewRequired.forEach(
    x => {

      if (
        !portfolio.highRisk.includes(
          x
        )
      ) {

        risks.push([

          x.name,

          'REVIEW REQUIRED',

          x.importance,

          x.fit,

          x.impact,

          x.confidence,

          x.decision,

          'Evidence / decision review'

        ]);

      }

    }
  );

  if (
    portfolio.missingCost > 0
  ) {

    risks.push([

      portfolio.missingCost +
      ' KOL(s)',

      'COST DATA MISSING',

      '',
      '',
      '',
      '',
      '',
      'Budget optimization partially estimated'

    ]);

  }

  if (!risks.length) {

    risks.push([

      'No major portfolio risk detected',

      'CLEAR',

      '',
      '',
      '',
      '',
      '',
      'Portfolio currently stable'

    ]);

  }

  sheet
    .getRange(
      startRow + 1,
      1,
      risks.length,
      8
    )
    .setValues(
      risks
    )
    .setWrap(
      true
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildRiskWatch_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildRiskWatch_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SWAP INTELLIGENCE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildSwapIntelligence_(
  sheet,
  portfolio
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildSwapIntelligence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const startRow =

    21 +

    portfolio.selected.length +

    portfolio.alternatives.length +

    portfolio.coverageGaps.length;

  sheet
    .getRange(
      startRow,
      1,
      1,
      8
    )
    .merge();

  sheet
    .getRange(
      startRow,
      1
    )
    .setValue(
      'PORTFOLIO SWAP INTELLIGENCE'
    )
    .setFontWeight(
      'bold'
    )
    .setFontSize(
      14
    );

  sheet
    .getRange(
      startRow + 1,
      1,
      1,
      8
    )
    .setValues([

      [
        'REMOVE',
        'ADD',
        'Score Gain',
        'New Score',
        'Budget Δ',
        '',
        '',
        ''
      ]

    ])
    .setFontWeight(
      'bold'
    );

  const rows =
    portfolio.swaps.map(
      swap => [

        swap.remove.name,

        swap.add.name,

        swap.gain,

        swap.newScore,

        swap.budgetDelta,

        '',
        '',
        ''

      ]
    );

  if (!rows.length) {

    rows.push([

      'No superior swap detected',

      '',

      '',

      portfolio.score,

      '',

      '',
      '',
      ''

    ]);

  }

  sheet
    .getRange(
      startRow + 2,
      1,
      rows.length,
      8
    )
    .setValues(
      rows
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildSwapIntelligence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildSwapIntelligence_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * EXECUTIVE DECISION
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildDecision_(
  sheet,
  portfolio,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildDecision_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const startRow =

    24 +

    portfolio.selected.length +

    portfolio.alternatives.length +

    portfolio.coverageGaps.length +

    portfolio.swaps.length;

  sheet
    .getRange(
      startRow,
      1,
      1,
      8
    )
    .merge();

  sheet
    .getRange(
      startRow,
      1
    )
    .setValue(
      'EXECUTIVE PORTFOLIO DECISION'
    )
    .setFontWeight(
      'bold'
    )
    .setFontSize(
      14
    );

  const explanation =
    KOL_IDS_PORTFOLIO_portfolioBuildExplanation_(
      portfolio,
      campaign
    );

  sheet
    .getRange(
      startRow + 1,
      1,
      4,
      4
    )
    .merge();

  sheet
    .getRange(
      startRow + 1,
      1
    )
    .setValue(

      'DECISION\n\n' +

      portfolio.executiveDecision

    )
    .setFontSize(
      15
    )
    .setFontWeight(
      'bold'
    )
    .setHorizontalAlignment(
      'center'
    )
    .setVerticalAlignment(
      'middle'
    );

  sheet
    .getRange(
      startRow + 1,
      5,
      4,
      4
    )
    .merge();

  sheet
    .getRange(
      startRow + 1,
      5
    )
    .setValue(

      'WHY\n\n' +

      explanation +

      '\n\n' +

      'Portfolio Score: ' +
      portfolio.score +

      '\nCoverage: ' +
      portfolio.coverageScore +
      '%' +

      '\nConfidence: ' +
      portfolio.portfolioConfidence +
      '%' +

      '\nRisk Exposure: ' +
      portfolio.riskExposure +
      '%'

    )
    .setWrap(
      true
    )
    .setVerticalAlignment(
      'middle'
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildDecision_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildDecision_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * EXPLANATION
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioBuildExplanation_(
  portfolio,
  campaign
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioBuildExplanation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const reasons = [];

  if (
    portfolio.coverageScore >= 75
  ) {

    reasons.push(
      'Strategic coverage is strong'
    );

  }
  else if (
    portfolio.coverageScore < 60
  ) {

    reasons.push(
      'Portfolio has a strategic coverage gap'
    );

  }

  if (
    portfolio.synergyScore >= 65
  ) {

    reasons.push(
      'Selected KOLs provide complementary roles / impact'
    );

  }

  if (
    portfolio.riskExposure < 20
  ) {

    reasons.push(
      'Risk exposure is controlled'
    );

  }
  else if (
    portfolio.riskExposure >= 30
  ) {

    reasons.push(
      'Risk exposure requires review'
    );

  }

  if (
    portfolio.portfolioConfidence >= 80
  ) {

    reasons.push(
      'Evidence and confidence support the recommendation'
    );

  }

  if (
    portfolio.dataQuality < 70
  ) {

    reasons.push(
      'Data quality is limiting decision confidence'
    );

  }

  if (
    portfolio.swaps.length
  ) {

    reasons.push(
      'A higher-value portfolio configuration may exist'
    );

  }

  if (
    portfolio.coverageGaps.length
  ) {

    reasons.push(
      'The portfolio should be checked against uncovered strategic priorities'
    );

  }

  if (!reasons.length) {

    reasons.push(
      'Portfolio is balanced under current campaign data'
    );

  }

  return reasons.join(
    '. '
  ) + '.';


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioBuildExplanation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioBuildExplanation_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CARD
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioCard_(
  sheet,
  rangeA1,
  title,
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioCard_');
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
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioCard_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioCard_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * RESET
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioReset_(
  sheet
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioReset_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const mergedRanges =
    sheet
      .getRange(
        1,
        1,
        Math.max(
          sheet.getMaxRows(),
          1
        ),
        Math.max(
          sheet.getMaxColumns(),
          1
        )
      )
      .getMergedRanges();

  mergedRanges.forEach(
    range =>
      range.breakApart()
  );

  sheet.clear();

  sheet.setColumnWidths(
    1,
    8,
    145
  );

  sheet.setFrozenRows(
    2
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioReset_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioReset_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * FORMAT
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioFormat_(sheet) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioFormat_'); var __kolIdsTraceStartedAt=Date.now();
  try {
    /* KOL IDS CI — portfolio executive visual system. Presentation only. */
    var burgundy='#173247', burgundy2='#2E6B8A', burgundy3='#A9D8EE';
    var cyan='#EAF7FF', mint='#EFFBF6', rose='#FFF5F8', navy='#294A60';
    var neutral='#EEF3F7', line='#D5E2EB', grey='#6B7782', white='#FFFFFF', black='#1B2730';
    var lastRow=Math.max(sheet.getLastRow(),1);
    // Presentation only: isolate tab-color formatting so a Sheets runtime
    // return-value quirk cannot fail portfolio generation.
    sheet.setHiddenGridlines(true);
    sheet.setFrozenRows(3);
    sheet.setFrozenColumns(0);
    try { sheet.setTabColor(burgundy); } catch (tabColorError) {
      KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_tabColor_', tabColorError);
    }
    sheet.getRange(1,1,Math.max(sheet.getMaxRows(),lastRow),8).setFontFamily('Arial').setFontColor(black).setBackground('#FBFCFD').setVerticalAlignment('middle').setWrap(true);
    [72,220,125,135,125,125,125,230].forEach(function(w,i){sheet.setColumnWidth(i+1,w);});
    sheet.setRowHeight(1,50); sheet.setRowHeight(2,30); sheet.setRowHeight(3,7);
    sheet.getRange('A1:H1').setBackground(burgundy).setFontColor(white).setFontSize(22).setFontWeight('bold').setHorizontalAlignment('left');
    sheet.getRange('A2:H2').setBackground(burgundy).setFontColor(cyan).setFontSize(11).setFontWeight('bold');
    sheet.getRange('A3:H3').setBackground(cyan);

    /* KPI cards */
    ['A4:B6','C4:D6','E4:F6','G4:H6','A8:B10','C8:D10','E8:F10','G8:H10'].forEach(function(a){
      sheet.getRange(a).setBackground(white).setBorder(true,true,true,true,false,false,line,SpreadsheetApp.BorderStyle.SOLID_MEDIUM).setVerticalAlignment('middle');
    });
    sheet.getRange('A4:B6').setBackground(cyan); sheet.getRange('C4:D6').setBackground(mint);
    sheet.getRange('E4:F6').setBackground(cyan); sheet.getRange('G4:H6').setBackground(mint);
    sheet.getRange('A8:B10').setBackground(cyan); sheet.getRange('C8:D10').setBackground(mint);
    sheet.getRange('E8:F10').setBackground(cyan); sheet.getRange('G8:H10').setBackground(mint);
    ['A5','C5','E5','G5','A9','C9','E9','G9'].forEach(function(a){sheet.getRange(a).setFontSize(10).setFontWeight('bold').setFontColor(burgundy2);});
    ['A6','C6','E6','G6','A10','C10','E10','G10'].forEach(function(a){sheet.getRange(a).setFontSize(24).setFontWeight('bold').setFontColor(black);});

    var vals=sheet.getRange(1,1,lastRow,1).getValues();
    var sections={'RECOMMENDED KOL PORTFOLIO':1,'ALTERNATIVE / BACKUP KOLS':1,'STRATEGIC COVERAGE & GAPS':1,'PORTFOLIO RISK WATCH':1,'SWAP INTELLIGENCE':1,'EXECUTIVE DECISION':1};
    for(var r=1;r<=lastRow;r++){
      var t=String(vals[r-1][0]||'').trim().toUpperCase();
      if(sections[t]){
        sheet.getRange(r,1,1,8).setBackground(burgundy).setFontColor(cyan).setFontWeight('bold').setFontSize(13)
          .setHorizontalAlignment('left').setBorder(false,false,false,false,false,false);
        sheet.setRowHeight(r,34);
        if(r<lastRow && !sections[String(vals[r][0]||'').trim().toUpperCase()]){
          sheet.getRange(r+1,1,1,8).setBackground(navy).setFontColor('#EAF7FF').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');
          sheet.setRowHeight(r+1,27);
        }
      }
    }
    sheet.getRange(1,3,lastRow,4).setHorizontalAlignment('center');
    if(lastRow>=14) sheet.getRange(14,3,lastRow-13,4).setNumberFormat('0.00');

    var sh=-1; for(var q=1;q<=lastRow;q++) if(String(vals[q-1][0]||'').trim().toUpperCase()==='RECOMMENDED KOL PORTFOLIO'){sh=q;break;}
    if(sh>0&&sh+2<=lastRow){
      sheet.getRange(sh+2,1,1,8).setBackground(mint).setFontWeight('bold').setBorder(true,true,true,true,false,false,burgundy3,SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
      sheet.getRange(sh+2,3,1,4).setFontSize(14);
    }
    for(var x=1;x<=lastRow;x++) if(String(vals[x-1][0]||'').trim().toUpperCase()==='EXECUTIVE DECISION'&&x+1<=lastRow){
      sheet.getRange(x+1,1,Math.min(4,lastRow-x),8).setBackground(white).setFontSize(12).setBorder(true,true,true,true,false,false,line,SpreadsheetApp.BorderStyle.SOLID);
      sheet.getRange(x+1,1,1,8).setFontWeight('bold');
    }
    sheet.autoResizeRows(1,lastRow); SpreadsheetApp.flush();
  }catch(e){KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioFormat_',e);throw e;}
  finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioFormat_',Date.now()-__kolIdsTraceStartedAt);}
}

/* ==================================================
 * GET / CREATE SHEET
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioGetOrCreateSheet_(
  ss
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioGetOrCreateSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  let sheet =
    ss.getSheetByName(
      KOL_IDS_PORTFOLIO_CONFIG.SHEET_NAME
    );

  if (!sheet) {

    sheet =
      ss.insertSheet(
        KOL_IDS_PORTFOLIO_CONFIG.SHEET_NAME
      );

  }

  return sheet;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioGetOrCreateSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioGetOrCreateSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * READ
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioRead_(
  sheet,
  columns
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioRead_');
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
      columns
    )
    .getValues()
    .filter(
      row =>
        String(
          row[0] || ''
        )
        .trim()
    );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioRead_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioRead_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * HEADER FINDER
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioFindHeader_(
  headers,
  possibleNames
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioFindHeader_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  for (
    let i = 0;
    i < possibleNames.length;
    i++
  ) {

    const index =
      headers.indexOf(
        possibleNames[i]
      );

    if (
      index !== -1
    ) {

      return index;

    }

  }

  return -1;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioFindHeader_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioFindHeader_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * EVIDENCE SCORE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioEvidenceScore_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioEvidenceScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const text =
    String(
      value || ''
    )
    .toUpperCase();

  if (
    text.indexOf(
      'VERY HIGH'
    ) !== -1
  ) {

    return 100;

  }

  if (
    text.indexOf(
      'HIGH'
    ) !== -1
  ) {

    return 90;

  }

  if (
    text.indexOf(
      'MEDIUM'
    ) !== -1
  ) {

    return 70;

  }

  if (
    text.indexOf(
      'LOW'
    ) !== -1
  ) {

    return 45;

  }

  if (
    text.indexOf(
      'INSUFFICIENT'
    ) !== -1
  ) {

    return 20;

  }

  return 20;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioEvidenceScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioEvidenceScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * MONEY PARSER
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioParseMoney_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioParseMoney_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {

    return 0;

  }

  if (
    typeof value ===
    'number'
  ) {

    return isNaN(value)
      ?
        0
      :
        value;

  }

  const cleaned =
    String(value)
      .replace(
        /[^0-9.-]/g,
        ''
      );

  const number =
    Number(
      cleaned
    );

  return isNaN(
    number
  )
    ?
      0
    :
      number;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioParseMoney_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioParseMoney_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * NUMBER
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioNumber_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioNumber_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const number =
    Number(
      value
    );

  return isNaN(
    number
  )
    ?
      0
    :
      number;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioNumber_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioNumber_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * AVERAGE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioAverage_(
  values
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioAverage_');
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
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioAverage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioAverage_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * CLAMP
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioClamp_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioClamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const number =
    KOL_IDS_PORTFOLIO_portfolioNumber_(
      value
    );

  return Math.max(
    0,
    Math.min(
      100,
      number
    )
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioClamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioClamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * SAME VALUE
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioSame_(
  a,
  b
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioSame_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const x =
    String(
      a || ''
    )
    .trim()
    .toUpperCase();

  const y =
    String(
      b || ''
    )
    .trim()
    .toUpperCase();

  return (
    x &&
    y &&
    x === y
  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioSame_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioSame_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * ROUND
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioRound_(
  value
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioRound_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  return Math.round(
    Number(value) *
    100
  ) / 100;


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioRound_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioRound_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* ==================================================
 * MONEY FORMAT
 * ================================================== */

function KOL_IDS_PORTFOLIO_portfolioMoney_(
  value,
  currency
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_PORTFOLIO_portfolioMoney_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  if (
    value === null ||
    value === undefined
  ) {

    return 'N/A';

  }

  const number =
    KOL_IDS_PORTFOLIO_portfolioNumber_(
      value
    );

  const formatted =
    number.toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    );

  return (

    (
      currency
        ?
          currency + ' '
        :
          ''
    )

    +

    formatted

  );


  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_PORTFOLIO_portfolioMoney_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_PORTFOLIO_portfolioMoney_', Date.now() - __kolIdsTraceStartedAt);
  }
}
