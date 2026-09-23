/****************************************************
 * KOL INVESTMENT DECISION SYSTEM™
 * 1.1.0 — PRODUCT EXECUTION LAYER
 *
 * FILE:
 * KOL_IDS_PRODUCT.gs
 *
 * PURPOSE:
 * - Web/Product-facing orchestration
 * - Reliable SAVE → RUN flow
 * - Auto-create required product sheets
 * - Persist Brand / Campaign / KOL / Persona
 * - Prevent "No KOL records available after save"
 * - Prevent missing 04_KOL_DATABASE / 07_KOL_DECISION
 * - Build creator report from Decision output
 * - Persist canonical persona
 * - Preserve workflow memory
 * - Protect current Analysis from stale Decision/Report data
 * - Provide detailed product health / integrity diagnostics
 *
 * IMPORTANT:
 * - Does NOT replace Decision Engine.
 * - Does NOT calculate decision logic.
 * - Uses KOL_IDS_ENGINE_runDecisionEngine() as the source of truth.
 ****************************************************/


/* ==================================================
 * PRODUCT CONFIG
 * ================================================== */

var KOL_IDS_PRODUCT_VERSION =
  '1.0.0';


/* ==================================================
 * PRODUCT SHEETS
 * ================================================== */

var KOL_IDS_PRODUCT_SHEETS = {
  SYSTEM: '01_SYSTEM',
  BRAND: '02_BRAND_PROFILE',
  CAMPAIGN: '03_CAMPAIGN',
  KOL: '04_KOL_DATABASE',
  FIT: '05_BRAND_FIT',
  IMPACT: '06_BRAND_IMPACT',
  DECISION: '07_KOL_DECISION',
  MANAGEMENT: '08_KOL_MANAGEMENT',
  PERFORMANCE: '09_PERFORMANCE',
  LEARNING: '10_LEARNING',
  PORTFOLIO: '12_PORTFOLIO',
  PERSONA: '13_CANONICAL_PERSONA',
  REPORT: '14_CREATOR_REPORT',
  MEMORY: '15_WORKFLOW_MEMORY'
};


/* ==================================================
 * REQUIRED HEADERS
 * ================================================== */

var KOL_IDS_PRODUCT_HEADERS = {

  PERSONA: [
    'Persona ID',
    'Persona Name',
    'Age Min',
    'Age Max',
    'Gender',
    'Locations',
    'Interests',
    'Behaviors',
    'Description',
    'Brand Fit',
    'Source',
    'Analysis ID',
    'Campaign ID',
    'Created At',
    'Last Updated'
  ],

  REPORT: [
    'Analysis ID',
    'Campaign ID',
    'Brand ID',
    'KOL ID',
    'KOL Name',
    'Platform',
    'Platform URL',
    'Category',
    'Followers',
    'Engagement Rate',
    'Audience Fit',
    'Brand Image Fit',
    'Content Fit',
    'Category Fit',
    'Value Fit',
    'Performance Evidence',
    'Brand Fit Score',
    'Brand Impact Score',
    'Confidence Score',
    'Risk Level',
    'Decision',
    'Recommended Role',
    'Primary Impact',
    'Secondary Impact',
    'Best Used For',
    'Not Ideal For',
    'Decision Reason',
    'Evidence Summary',
    'Persona Fit',
    'Persona Name',
    'Creator Intelligence Fit',
    'Creator Intelligence Coverage',
    'Creator Intelligence Summary',
    'Preferred Use Strategy',
    'Primary Fit Gap',
    'Recovery Actions',
    'Content Recommendation',
    'Compensating Creator Strategy',
    'Generated At'
  ],

  MEMORY: [
    'Memory ID',
    'Analysis ID',
    'Campaign ID',
    'Brand ID',
    'Stage',
    'Entity Type',
    'Entity ID',
    'Payload JSON',
    'Created At',
    'Updated At'
  ]
};


/* ==================================================
 * CORE FALLBACK HEADERS
 * ================================================== */

var KOL_IDS_PRODUCT_FALLBACK_HEADERS = {

  KOL: [
    'KOL ID',
    'KOL Name',
    'Platform',
    'Platform URL',
    'Category',
    'Followers',
    'Engagement Rate',
    'Audience Age',
    'Audience Gender',
    'Audience Location',
    'Audience Interest',
    'Content Style',
    'Rate',
    'Currency',
    'Previous Brand Work',
    'Previous Campaign Result',
    'Audience Evidence',
    'Engagement Evidence',
    'Content Evidence',
    'Performance Evidence',
    'Reputation Evidence',
    'Risk Level',
    'Risk Score',
    'Audience Fit Input',
    'Brand Image Fit Input',
    'Content Fit Input',
    'Category Fit Input',
    'Value Fit Input',
    'Performance Evidence Input',
    'Awareness Potential',
    'Credibility Potential',
    'Brand Relevance Potential',
    'Perception Potential',
    'Purchase Influence Potential',
    'Community Potential',
    'KOL Status',
    'Last Updated'
  ],

  DECISION: [
    'Campaign ID',
    'KOL ID',
    'KOL Name',
    'Brand Fit Score',
    'Brand Impact Score',
    'Confidence Score',
    'Risk Level',
    'Decision',
    'Recommended Role',
    'Primary Impact',
    'Secondary Impact',
    'Best Used For',
    'Not Ideal For',
    'Decision Reason',
    'Evidence Summary',
    'Decision Owner',
    'Decision Date'
  ]

};


/* ==================================================
 * UTILITIES
 * ================================================== */

function KOL_IDS_PRODUCT_string_(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}


function KOL_IDS_PRODUCT_num_(value, fallback) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return fallback === undefined
      ? 0
      : fallback;
  }

  var normalized = typeof value === 'string' ? value.replace(/,/g,'').trim() : value;
  var n = Number(normalized);

  return isNaN(n)
    ? (
        fallback === undefined
          ? 0
          : fallback
      )
    : n;
}


function KOL_IDS_PRODUCT_round_(value) {
  return Math.round(
    KOL_IDS_PRODUCT_num_(value, 0) * 100
  ) / 100;
}


function KOL_IDS_PRODUCT_now_() {
  return new Date();
}


function KOL_IDS_PRODUCT_uuid_(prefix) {
  return (
    String(prefix || 'ID') +
    '-' +
    Utilities
      .getUuid()
      .replace(/-/g, '')
      .substring(0, 12)
      .toUpperCase()
  );
}


function KOL_IDS_PRODUCT_json_(value) {
  try {
    return JSON.stringify(
      value === undefined
        ? null
        : value
    );
  }
  catch (e) {
    return JSON.stringify({
      error: String(e)
    });
  }
}


function KOL_IDS_PRODUCT_clone_(value) {
  try {
    return JSON.parse(
      JSON.stringify(value)
    );
  }
  catch (e) {
    throw new Error(
      'KBIS Product Layer: payload cannot be serialized. ' +
      e.message
    );
  }
}


function KOL_IDS_PRODUCT_safeHeaderMap_(
  sheet
) {
  if (!sheet) {
    return {};
  }

  var lastColumn =
    Math.max(
      1,
      sheet.getLastColumn()
    );

  var headers =
    sheet
      .getRange(
        1,
        1,
        1,
        lastColumn
      )
      .getValues()[0];

  return KOL_IDS_PRODUCT_headerIndex_(
    headers
  );
}


function KOL_IDS_PRODUCT_getCellByHeaders_(
  sheet,
  row,
  aliases
) {

  if (!sheet || !row) {
    return '';
  }

  var idx =
    KOL_IDS_PRODUCT_safeHeaderMap_(
      sheet
    );

  for (
    var i = 0;
    i < aliases.length;
    i++
  ) {

    var key =
      KOL_IDS_PRODUCT_string_(
        aliases[i]
      );

    if (
      idx[key] !== undefined &&
      idx[key] < row.length
    ) {
      return row[idx[key]];
    }

  }

  return '';
}


function KOL_IDS_PRODUCT_getSheetFirstRowValue_(
  ss,
  sheetName,
  aliases
) {

  var sheet =
    ss.getSheetByName(
      sheetName
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    return '';
  }

  var lastColumn =
    Math.max(
      1,
      sheet.getLastColumn()
    );

  var row =
    sheet
      .getRange(
        2,
        1,
        1,
        lastColumn
      )
      .getValues()[0];

  return KOL_IDS_PRODUCT_getCellByHeaders_(
    sheet,
    row,
    aliases
  );
}


function KOL_IDS_PRODUCT_getCurrentKOLIds_(
  ss
) {

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.KOL
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    return {};
  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (values.length < 2) {
    return {};
  }

  var headers =
    values[0].map(
      function(h) {
        return KOL_IDS_PRODUCT_string_(h);
      }
    );

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  var map = {};

  values
    .slice(1)
    .forEach(
      function(row) {

        if (
          idx['KOL ID'] === undefined
        ) {
          return;
        }

        var id =
          KOL_IDS_PRODUCT_string_(
            row[idx['KOL ID']]
          );

        if (id) {
          map[id] = true;
        }

      }
    );

  return map;
}


/* ==================================================
 * SPREADSHEET ROUTING
 * ================================================== */

function KOL_IDS_PRODUCT_getSpreadsheet_() {

  if (
    typeof KOL_IDS_SYSTEM_getSpreadsheet_ ===
    'function'
  ) {
    return KOL_IDS_SYSTEM_getSpreadsheet_();
  }

  return SpreadsheetApp
    .getActiveSpreadsheet();
}


/* ==================================================
 * SHEET CREATION
 * ================================================== */

function KOL_IDS_PRODUCT_ensureSheet_(
  ss,
  sheetName,
  headers
) {

  if (!ss) {
    throw new Error(
      'KBIS Product Layer: Spreadsheet unavailable.'
    );
  }

  var sheet =
    ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet =
      ss.insertSheet(sheetName);
  }

  if (
    headers &&
    headers.length
  ) {

    if (
      sheet.getMaxColumns() <
      headers.length
    ) {

      sheet.insertColumnsAfter(
        sheet.getMaxColumns(),
        headers.length -
        sheet.getMaxColumns()
      );

    }

    var existing =
      sheet
        .getRange(
          1,
          1,
          1,
          headers.length
        )
        .getValues()[0];

    var different =
      headers.some(
        function(header, index) {
          return String(
            existing[index] || ''
          ).trim() !==
          String(header).trim();
        }
      );

    if (different) {

      sheet
        .getRange(
          1,
          1,
          1,
          headers.length
        )
        .setValues([headers]);

    }

    sheet.setFrozenRows(1);
  }

  return sheet;
}


/* ==================================================
 * CORE BOOTSTRAP (SAFE / EXPLICIT)
 *
 * The Decision Engine may need its core sheets.
 * Bootstrap them only when a required core sheet is
 * actually missing. Never run the initializer on every
 * SAVE/RUN because it may mutate current working data.
 * ================================================== */

function KOL_IDS_PRODUCT_BOOTSTRAP_CORE_(ss) {

  var requiredCore = [
    KOL_IDS_PRODUCT_SHEETS.SYSTEM,
    KOL_IDS_PRODUCT_SHEETS.BRAND,
    KOL_IDS_PRODUCT_SHEETS.CAMPAIGN,
    KOL_IDS_PRODUCT_SHEETS.KOL,
    KOL_IDS_PRODUCT_SHEETS.FIT,
    KOL_IDS_PRODUCT_SHEETS.IMPACT,
    KOL_IDS_PRODUCT_SHEETS.DECISION,
    KOL_IDS_PRODUCT_SHEETS.MANAGEMENT,
    KOL_IDS_PRODUCT_SHEETS.PERFORMANCE,
    KOL_IDS_PRODUCT_SHEETS.LEARNING,
    KOL_IDS_PRODUCT_SHEETS.PORTFOLIO
  ];

  var missing =
    requiredCore.filter(
      function(name) {
        return !ss.getSheetByName(name);
      }
    );

  if (!missing.length) {
    return {
      success: true,
      initialized: false,
      missingBefore: []
    };
  }

  if (typeof KOL_IDS_SYSTEM_initialize !== 'function') {
    throw new Error(
      'Core bootstrap required but KOL_IDS_SYSTEM_initialize() is not installed. Missing sheets: ' +
      missing.join(', ')
    );
  }

  try {
    KOL_IDS_SYSTEM_initialize();
  }
  catch (e) {
    throw new Error(
      'Core initialization failed while creating missing sheets: ' +
      e.message
    );
  }

  var stillMissing =
    requiredCore.filter(
      function(name) {
        return !ss.getSheetByName(name);
      }
    );

  if (stillMissing.length) {
    throw new Error(
      'Core initialization incomplete. Missing sheets: ' +
      stillMissing.join(', ')
    );
  }

  return {
    success: true,
    initialized: true,
    missingBefore: missing
  };
}


/* ==================================================
 * ENSURE PRODUCT STRUCTURE
 * ================================================== */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_ENSURE_STRUCTURE() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  /*
   * IMPORTANT: Do NOT call KOL_IDS_SYSTEM_initialize() here.
   *
   * This function is called by RUN as well as SAVE.
   * Some core initializers recreate/normalize sheets and
   * can clear or replace current working rows. Calling the
   * core initializer on every RUN can therefore erase
   * 04_KOL_DATABASE immediately before the KOL count check.
   *
   * Core bootstrap is handled separately by
   * KOL_IDS_PRODUCT_BOOTSTRAP_CORE_() only when required.
   */

  // 09_PERFORMANCE has its own canonical authority schema. Keep SAVE/RUN
  // resilient to workspaces that still contain the retired 75-column layout.
  // The authority migrator is header-based and preserves existing values.
  if (typeof KOL_IDS_SYSTEM_syncPerformanceAuthoritySchema_ === 'function') {
    KOL_IDS_SYSTEM_syncPerformanceAuthoritySchema_();
  } else if (typeof KOL_IDS_PA_ensureSheet_ === 'function') {
    KOL_IDS_PA_ensureSheet_();
  }

  var kolHeaders =
    KOL_IDS_PRODUCT_FALLBACK_HEADERS.KOL;

  var decisionHeaders =
    KOL_IDS_PRODUCT_FALLBACK_HEADERS.DECISION;

  try {

    if (
      typeof KOL_IDS_SCHEMA_CONFIG !==
      'undefined' &&
      KOL_IDS_SCHEMA_CONFIG &&
      KOL_IDS_SCHEMA_CONFIG[
        KOL_IDS_PRODUCT_SHEETS.KOL
      ] &&
      KOL_IDS_SCHEMA_CONFIG[
        KOL_IDS_PRODUCT_SHEETS.KOL
      ].length
    ) {
      kolHeaders =
        KOL_IDS_SCHEMA_CONFIG[
          KOL_IDS_PRODUCT_SHEETS.KOL
        ];
    }

    if (
      typeof KOL_IDS_SCHEMA_CONFIG !==
      'undefined' &&
      KOL_IDS_SCHEMA_CONFIG &&
      KOL_IDS_SCHEMA_CONFIG[
        KOL_IDS_PRODUCT_SHEETS.DECISION
      ] &&
      KOL_IDS_SCHEMA_CONFIG[
        KOL_IDS_PRODUCT_SHEETS.DECISION
      ].length
    ) {
      decisionHeaders =
        KOL_IDS_SCHEMA_CONFIG[
          KOL_IDS_PRODUCT_SHEETS.DECISION
        ];
    }

  }
  catch (e) {
    console.warn(
      'KBIS Product Layer: schema read warning',
      e
    );
  }


  KOL_IDS_PRODUCT_ensureSheet_(
    ss,
    KOL_IDS_PRODUCT_SHEETS.KOL,
    kolHeaders
  );

  KOL_IDS_PRODUCT_ensureSheet_(
    ss,
    KOL_IDS_PRODUCT_SHEETS.DECISION,
    decisionHeaders
  );

  KOL_IDS_PRODUCT_ensureSheet_(
    ss,
    KOL_IDS_PRODUCT_SHEETS.PERSONA,
    KOL_IDS_PRODUCT_HEADERS.PERSONA
  );

  KOL_IDS_PRODUCT_ensureSheet_(
    ss,
    KOL_IDS_PRODUCT_SHEETS.REPORT,
    KOL_IDS_PRODUCT_HEADERS.REPORT
  );

  KOL_IDS_PRODUCT_ensureSheet_(
    ss,
    KOL_IDS_PRODUCT_SHEETS.MEMORY,
    KOL_IDS_PRODUCT_HEADERS.MEMORY
  );


  return {
    success: true,
    spreadsheetId:
      ss.getId(),
    sheets: {
      kol:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.KOL
        ),
      decision:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.DECISION
        ),
      persona:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.PERSONA
        ),
      report:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.REPORT
        ),
      memory:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.MEMORY
        )
    }
  };
}


/* ==================================================
 * HEADER INDEX
 * ================================================== */

function KOL_IDS_PRODUCT_headerIndex_(
  headers
) {

  var map = {};

  (headers || []).forEach(
    function(header, index) {

      var key =
        KOL_IDS_PRODUCT_string_(
          header
        );

      if (key) {
        map[key] = index;
      }

    }
  );

  return map;
}


/* ==================================================
 * PAYLOAD ARRAY NORMALIZATION
 * ================================================== */

function KOL_IDS_PRODUCT_array_(
  value
) {

  if (Array.isArray(value)) {
    return value;
  }

  if (
    value &&
    typeof value === 'object'
  ) {

    if (
      Array.isArray(value.rows)
    ) {
      return value.rows;
    }

    if (
      Array.isArray(value.items)
    ) {
      return value.items;
    }

    if (
      Array.isArray(value.data)
    ) {
      return value.data;
    }

  }

  return [];
}


/* ==================================================
 * NORMALIZE KOL
 * ================================================== */

function KOL_IDS_PRODUCT_normalizeKOL_(
  kol,
  index
) {

  kol =
    kol || {};

  var id =
    KOL_IDS_PRODUCT_string_(
      kol.kolId ||
      kol.creatorId ||
      kol.id ||
      kol['KOL ID']
    );

  var name =
    KOL_IDS_PRODUCT_string_(
      kol.kolName ||
      kol.creatorName ||
      kol.name ||
      kol['KOL Name']
    );

  var platform =
    KOL_IDS_PRODUCT_string_(
      kol.platform ||
      kol.Platform
    );

  if (!id) {
    id =
      'KOL-' +
      Utilities
        .getUuid()
        .substring(0, 8)
        .toUpperCase();
  }

  if (!name) {
    name =
      'Creator ' +
      (index + 1);
  }

  return {

    id: id,
    name: name,

    platform:
      platform || 'Unknown',

    platformUrl:
      KOL_IDS_PRODUCT_string_(
        kol.platformUrl ||
        kol.platformURL ||
        kol.url ||
        kol['Platform URL']
      ),

    category:
      KOL_IDS_PRODUCT_string_(
        kol.category ||
        kol.Category
      ),

    followers:
      KOL_IDS_PRODUCT_num_(
        kol.followers !== undefined && kol.followers !== null && kol.followers !== '' ? kol.followers : kol.Followers,
        ''
      ),

    engagementRate:
      KOL_IDS_PRODUCT_num_(
        kol.engagementRate !== undefined && kol.engagementRate !== null && kol.engagementRate !== '' ? kol.engagementRate : (kol.engagement !== undefined && kol.engagement !== null && kol.engagement !== '' ? kol.engagement : kol['Engagement Rate']),
        ''
      ),

    audienceAge:
      KOL_IDS_PRODUCT_string_(
        kol.audienceAge ||
        kol.age ||
        kol['Audience Age']
      ),

    audienceGender:
      KOL_IDS_PRODUCT_string_(
        kol.audienceGender ||
        kol.gender ||
        kol['Audience Gender']
      ),

    audienceLocation:
      KOL_IDS_PRODUCT_string_(
        kol.audienceLocation ||
        kol.location ||
        kol['Audience Location']
      ),

    audienceInterest:
      KOL_IDS_PRODUCT_string_(
        kol.audienceInterest ||
        kol.interests ||
        kol['Audience Interest']
      ),

    contentStyle:
      KOL_IDS_PRODUCT_string_(
        kol.contentStyle ||
        kol.styles ||
        kol['Content Style']
      ),

    rate:
      KOL_IDS_PRODUCT_num_(
        kol.rate !== undefined && kol.rate !== null && kol.rate !== '' ? kol.rate : (kol.fee !== undefined && kol.fee !== null && kol.fee !== '' ? kol.fee : kol['Rate']),
        ''
      ),

    currency: 'THB',

    /* Historical brand/campaign work is an analysis/output signal.
     It is never accepted from the creator-entry form. */
    previousBrandWork: '',
    previousCampaignResult: '',

    audienceEvidence:
      KOL_IDS_PRODUCT_string_(
        kol.audienceEvidence ||
        kol['Audience Evidence']
      ),

    engagementEvidence:
      KOL_IDS_PRODUCT_string_(
        kol.engagementEvidence ||
        kol['Engagement Evidence']
      ),

    contentEvidence:
      KOL_IDS_PRODUCT_string_(
        kol.contentEvidence ||
        kol['Content Evidence']
      ),

    performanceEvidence:
      KOL_IDS_PRODUCT_string_(
        kol.performanceEvidence ||
        kol['Performance Evidence']
      ),

    reputationEvidence:
      KOL_IDS_PRODUCT_string_(
        kol.reputationEvidence ||
        kol['Reputation Evidence']
      ),

    riskLevel:
      KOL_IDS_PRODUCT_string_(
        kol.riskLevel ||
        kol.risk ||
        kol['Risk Level']
      ),

    riskScore:
      KOL_IDS_PRODUCT_num_(
        kol.riskScore ||
        kol['Risk Score'],
        ''
      ),

    audienceFitInput:
      KOL_IDS_PRODUCT_num_(
        kol.audienceFitInput ||
        kol.audienceFit ||
        kol['Audience Fit Input'],
        ''
      ),

    brandImageFitInput:
      KOL_IDS_PRODUCT_num_(
        kol.brandImageFitInput ||
        kol.brandImageFit ||
        kol['Brand Image Fit Input'],
        ''
      ),

    contentFitInput:
      KOL_IDS_PRODUCT_num_(
        kol.contentFitInput ||
        kol.contentFit ||
        kol['Content Fit Input'],
        ''
      ),

    categoryFitInput:
      KOL_IDS_PRODUCT_num_(
        kol.categoryFitInput ||
        kol['Category Fit Input'],
        ''
      ),

    valueFitInput:
      KOL_IDS_PRODUCT_num_(
        kol.valueFitInput ||
        kol['Value Fit Input'],
        ''
      ),

    performanceEvidenceInput:
      KOL_IDS_PRODUCT_num_(
        kol.performanceEvidenceInput ||
        kol['Performance Evidence Input'],
        ''
      ),

    awarenessPotential:
      KOL_IDS_PRODUCT_num_(
        kol.awarenessPotential ||
        kol['Awareness Potential'],
        ''
      ),

    credibilityPotential:
      KOL_IDS_PRODUCT_num_(
        kol.credibilityPotential ||
        kol['Credibility Potential'],
        ''
      ),

    brandRelevancePotential:
      KOL_IDS_PRODUCT_num_(
        kol.brandRelevancePotential ||
        kol['Brand Relevance Potential'],
        ''
      ),

    perceptionPotential:
      KOL_IDS_PRODUCT_num_(
        kol.perceptionPotential ||
        kol['Perception Potential'],
        ''
      ),

    purchaseInfluencePotential:
      KOL_IDS_PRODUCT_num_(
        kol.purchaseInfluencePotential ||
        kol['Purchase Influence Potential'],
        ''
      ),

    communityPotential:
      KOL_IDS_PRODUCT_num_(
        kol.communityPotential ||
        kol['Community Potential'],
        ''
      ),

    status:
      KOL_IDS_PRODUCT_string_(
        kol.status ||
        kol.kolStatus ||
        kol['KOL Status'] ||
        'ACTIVE'
      )

  };
}


/* ==================================================
 * NORMALIZE PERSONA
 * ================================================== */

function KOL_IDS_PRODUCT_normalizePersona_(
  persona
) {

  persona =
    persona || {};

  var name =
    KOL_IDS_PRODUCT_string_(
      persona.name ||
      persona.personaName ||
      persona['Persona Name']
    );

  var id =
    KOL_IDS_PRODUCT_string_(
      persona.personaId ||
      persona.id ||
      persona['Persona ID']
    );

  if (!id) {
    id =
      KOL_IDS_PRODUCT_uuid_(
        'PER'
      );
  }

  return {

    id: id,

    name:
      name ||
      'Canonical Audience Persona',

    ageMin:
      KOL_IDS_PRODUCT_num_(
        persona.ageMin ||
        persona.minAge ||
        persona['Age Min'],
        0
      ),

    ageMax:
      KOL_IDS_PRODUCT_num_(
        persona.ageMax ||
        persona.maxAge ||
        persona['Age Max'],
        0
      ),

    gender:
      KOL_IDS_PRODUCT_string_(
        persona.gender ||
        persona['Gender'] ||
        'ANY'
      ),

    locations:
      KOL_IDS_PRODUCT_string_(
        persona.locations ||
        persona.location ||
        persona['Locations']
      ),

    interests:
      KOL_IDS_PRODUCT_string_(
        persona.interests ||
        persona.audienceInterest ||
        persona['Interests']
      ),

    behaviors:
      KOL_IDS_PRODUCT_string_(
        persona.behaviors ||
        persona.behaviour ||
        persona['Behaviors']
      ),

    description:
      KOL_IDS_PRODUCT_string_(
        persona.description ||
        persona.summary ||
        persona.personaSummary ||
        persona['Description']
      ),

    brandFit:
      KOL_IDS_PRODUCT_string_(
        persona.brandFit ||
        persona['Brand Fit']
      ),

    source:
      KOL_IDS_PRODUCT_string_(
        persona.source ||
        'PRODUCT_INPUT'
      )

  };
}


/* ==================================================
 * ACTIVE ANALYSIS ID
 * ================================================== */

function KOL_IDS_PRODUCT_getActiveAnalysisId_(
  ss
) {

  var props =
    PropertiesService
      .getUserProperties();

  var stored =
    KOL_IDS_PRODUCT_string_(
      props.getProperty(
        'KOL_IDS_ACTIVE_ANALYSIS_ID'
      )
    );

  // Read-only compatibility fallback for older workspaces.
  if (!stored) {
    stored = KOL_IDS_PRODUCT_string_(props.getProperty('KBIS_ACTIVE_ANALYSIS_ID'));
    if (stored) props.setProperty('KOL_IDS_ACTIVE_ANALYSIS_ID', stored);
  }

  if (stored) {
    return stored;
  }

  var id =
    KOL_IDS_PRODUCT_uuid_(
      'AN'
    );

  props.setProperty(
    'KOL_IDS_ACTIVE_ANALYSIS_ID',
    id
  );

  return id;
}


function KOL_IDS_PRODUCT_setActiveAnalysisId_(
  analysisId
) {

  analysisId =
    KOL_IDS_PRODUCT_string_(
      analysisId
    );

  if (!analysisId) {
    throw new Error(
      'Cannot set empty Active Analysis ID.'
    );
  }

  PropertiesService
    .getUserProperties()
    .setProperty(
      'KOL_IDS_ACTIVE_ANALYSIS_ID',
      analysisId
    );

  var verified =
    KOL_IDS_PRODUCT_string_(
      PropertiesService
        .getUserProperties()
        .getProperty(
          'KOL_IDS_ACTIVE_ANALYSIS_ID'
        )
    );

  if (verified !== analysisId) {
    throw new Error(
      'Active Analysis ID persistence mismatch. ' +
      'Expected=' + analysisId +
      ', Actual=' + verified
    );
  }

  return analysisId;
}


/* ==================================================
 * WRITE KOL DATABASE
 * ================================================== */

function KOL_IDS_PRODUCT_writeKOLs_(
  ss,
  kols
) {

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.KOL
    );

  if (!sheet) {
    throw new Error(
      'Product Layer could not create 04_KOL_DATABASE.'
    );
  }

  var headers =
    sheet
      .getRange(
        1,
        1,
        1,
        Math.max(
          1,
          sheet.getLastColumn()
        )
      )
      .getValues()[0];

  var index =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  /* Previous Brand Work / Previous Campaign Result are output-only history.
   * Preserve already-derived sheet values across a new analysis SAVE; the UI
   * never supplies these fields. */
  var derivedHistoryById = {};
  if (sheet.getLastRow() > 1) {
    var existingValues = sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues();
    existingValues.forEach(function(r){
      var id = index['KOL ID'] !== undefined ? KOL_IDS_PRODUCT_string_(r[index['KOL ID']]) : '';
      if (!id) return;
      derivedHistoryById[id] = {
        previousBrandWork: index['Previous Brand Work'] !== undefined ? r[index['Previous Brand Work']] : '',
        previousCampaignResult: index['Previous Campaign Result'] !== undefined ? r[index['Previous Campaign Result']] : ''
      };
    });
    sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).clearContent();
  }

  var now =
    KOL_IDS_PRODUCT_now_();

  var rows =
    kols.map(
      function(kol) {

        var row =
          new Array(
            headers.length
          ).fill('');

        function KOL_IDS_PRODUCT_put(
          header,
          value
        ) {

          if (
            index[header] !==
            undefined
          ) {
            row[index[header]] =
              value;
          }

        }

        KOL_IDS_PRODUCT_put('KOL ID', kol.id);
        KOL_IDS_PRODUCT_put('KOL Name', kol.name);
        KOL_IDS_PRODUCT_put('Platform', kol.platform);
        KOL_IDS_PRODUCT_put('Platform URL', kol.platformUrl);
        KOL_IDS_PRODUCT_put('Category', kol.category);
        KOL_IDS_PRODUCT_put('Followers', kol.followers);
        KOL_IDS_PRODUCT_put('Engagement Rate', kol.engagementRate);
        KOL_IDS_PRODUCT_put('Audience Age', kol.audienceAge);
        KOL_IDS_PRODUCT_put('Audience Gender', kol.audienceGender);
        KOL_IDS_PRODUCT_put('Audience Location', kol.audienceLocation);
        KOL_IDS_PRODUCT_put('Audience Interest', kol.audienceInterest);
        KOL_IDS_PRODUCT_put('Content Style', kol.contentStyle);
        KOL_IDS_PRODUCT_put('Rate', kol.rate);
        KOL_IDS_PRODUCT_put('Currency', kol.currency);
        KOL_IDS_PRODUCT_put('Previous Brand Work', kol.previousBrandWork || (derivedHistoryById[kol.id] && derivedHistoryById[kol.id].previousBrandWork) || '');
        KOL_IDS_PRODUCT_put('Previous Campaign Result', kol.previousCampaignResult || (derivedHistoryById[kol.id] && derivedHistoryById[kol.id].previousCampaignResult) || '');
        KOL_IDS_PRODUCT_put('Audience Evidence', kol.audienceEvidence);
        KOL_IDS_PRODUCT_put('Engagement Evidence', kol.engagementEvidence);
        KOL_IDS_PRODUCT_put('Content Evidence', kol.contentEvidence);
        KOL_IDS_PRODUCT_put('Performance Evidence', kol.performanceEvidence);
        KOL_IDS_PRODUCT_put('Reputation Evidence', kol.reputationEvidence);
        KOL_IDS_PRODUCT_put('Risk Level', kol.riskLevel);
        KOL_IDS_PRODUCT_put('Risk Score', kol.riskScore);
        KOL_IDS_PRODUCT_put('Audience Fit Input', kol.audienceFitInput);
        KOL_IDS_PRODUCT_put('Brand Image Fit Input', kol.brandImageFitInput);
        KOL_IDS_PRODUCT_put('Content Fit Input', kol.contentFitInput);
        KOL_IDS_PRODUCT_put('Category Fit Input', kol.categoryFitInput);
        KOL_IDS_PRODUCT_put('Value Fit Input', kol.valueFitInput);
        KOL_IDS_PRODUCT_put('Performance Evidence Input', kol.performanceEvidenceInput);
        KOL_IDS_PRODUCT_put('Awareness Potential', kol.awarenessPotential);
        KOL_IDS_PRODUCT_put('Credibility Potential', kol.credibilityPotential);
        KOL_IDS_PRODUCT_put('Brand Relevance Potential', kol.brandRelevancePotential);
        KOL_IDS_PRODUCT_put('Perception Potential', kol.perceptionPotential);
        KOL_IDS_PRODUCT_put('Purchase Influence Potential', kol.purchaseInfluencePotential);
        KOL_IDS_PRODUCT_put('Community Potential', kol.communityPotential);
        KOL_IDS_PRODUCT_put('KOL Status', kol.status);
        KOL_IDS_PRODUCT_put('Last Updated', now);

        return row;
      }
    );

  if (rows.length) {

    sheet
      .getRange(
        2,
        1,
        rows.length,
        headers.length
      )
      .setValues(rows);

  }

  SpreadsheetApp.flush();

  var savedCount =
    KOL_IDS_PRODUCT_countKOLs_(
      ss
    );

  if (
    savedCount !==
    kols.length
  ) {

    throw new Error(
      'KOL persistence mismatch: expected ' +
      kols.length +
      ', saved ' +
      savedCount +
      ' in 04_KOL_DATABASE.'
    );

  }

  return {
    success: true,
    count: savedCount,
    sheet:
      KOL_IDS_PRODUCT_SHEETS.KOL
  };
}


/* ==================================================
 * COUNT KOL
 * ================================================== */

function KOL_IDS_PRODUCT_countKOLs_(
  ss
) {

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.KOL
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    return 0;
  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (values.length < 2) {
    return 0;
  }

  var headers =
    values[0].map(
      function(h) {
        return KOL_IDS_PRODUCT_string_(h);
      }
    );

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  var identityColumns = [
    'KOL ID',
    'KOL Name',
    'Platform URL'
  ];

  return values
    .slice(1)
    .filter(
      function(row) {

        return identityColumns.some(
          function(header) {

            return (
              idx[header] !== undefined &&
              KOL_IDS_PRODUCT_string_(
                row[idx[header]]
              ) !== ''
            );

          }
        );

      }
    ).length;
}


/* ==================================================
 * WRITE CANONICAL PERSONA
 * ================================================== */

function KOL_IDS_PRODUCT_writePersona_(
  ss,
  persona,
  analysisId,
  campaignId,
  brandId
) {

  if (!persona) {
    return {
      success: true,
      count: 0,
      skipped: true
    };
  }

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.PERSONA
    );

  if (!sheet) {
    throw new Error(
      'Canonical Persona sheet could not be created.'
    );
  }

  var headers =
    sheet
      .getRange(
        1,
        1,
        1,
        Math.max(
          1,
          sheet.getLastColumn()
        )
      )
      .getValues()[0];

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  var row =
    new Array(
      headers.length
    ).fill('');

  function KOL_IDS_PRODUCT_put(
    header,
    value
  ) {

    if (
      idx[header] !==
      undefined
    ) {
      row[idx[header]] =
        value;
    }

  }

  var now =
    KOL_IDS_PRODUCT_now_();

  KOL_IDS_PRODUCT_put('Persona ID', persona.id);
  KOL_IDS_PRODUCT_put('Persona Name', persona.name);
  KOL_IDS_PRODUCT_put('Age Min', persona.ageMin);
  KOL_IDS_PRODUCT_put('Age Max', persona.ageMax);
  KOL_IDS_PRODUCT_put('Gender', persona.gender);
  KOL_IDS_PRODUCT_put('Locations', persona.locations);
  KOL_IDS_PRODUCT_put('Interests', persona.interests);
  KOL_IDS_PRODUCT_put('Behaviors', persona.behaviors);
  KOL_IDS_PRODUCT_put('Description', persona.description);
  KOL_IDS_PRODUCT_put('Brand Fit', persona.brandFit);
  KOL_IDS_PRODUCT_put('Source', persona.source);
  KOL_IDS_PRODUCT_put('Analysis ID', analysisId);
  KOL_IDS_PRODUCT_put('Campaign ID', campaignId);
  KOL_IDS_PRODUCT_put('Created At', now);
  KOL_IDS_PRODUCT_put('Last Updated', now);

  if (
    sheet.getLastRow() > 1
  ) {

    sheet
      .getRange(
        2,
        1,
        sheet.getLastRow() - 1,
        sheet.getLastColumn()
      )
      .clearContent();

  }

  sheet
    .getRange(
      2,
      1,
      1,
      headers.length
    )
    .setValues([row]);

  SpreadsheetApp.flush();

  if (
    sheet.getLastRow() < 2
  ) {

    throw new Error(
      'Canonical Persona could not be persisted.'
    );

  }

  var savedPersona =
    KOL_IDS_PRODUCT_getCanonicalPersona_(
      ss
    );

  if (
    !savedPersona ||
    savedPersona.id !== persona.id
  ) {

    throw new Error(
      'Canonical Persona persistence mismatch.'
    );

  }

  return {
    success: true,
    count: 1,
    personaId:
      persona.id
  };
}


/* ==================================================
 * WRITE WORKFLOW MEMORY
 *
 * History is append-only.
 * Current analysis IDs are always preserved.
 * ================================================== */

function KOL_IDS_PRODUCT_persistActiveContext_(
  ss,
  payload,
  analysisId,
  campaignId,
  brandId
) {

  /* 1.0.0 SAVE/CONTINUE HARDENING: a workspace can exist while its
   * product sheets are incomplete (for example after an interrupted first
   * bootstrap). Repair the product structure before writing the canonical
   * campaign record. This makes Save as draft and Continue self-healing
   * instead of silently depending on a one-time READY flag. */
  if (!ss) throw new Error('Active customer workspace is unavailable.');
  var requiredProductSheets = [KOL_IDS_PRODUCT_SHEETS.BRAND, KOL_IDS_PRODUCT_SHEETS.CAMPAIGN];
  var missingProductSheet = requiredProductSheets.some(function(name){ return !ss.getSheetByName(name); });
  if (missingProductSheet && typeof KOL_IDS_PRODUCT_SETUP === 'function') {
    KOL_IDS_PRODUCT_SETUP();
  }
  requiredProductSheets.forEach(function(name){
    if (!ss.getSheetByName(name)) throw new Error('Required context sheet missing after repair: ' + name);
  });

  var brand =
    payload && payload.brand && typeof payload.brand === 'object'
      ? payload.brand
      : (payload && payload.brandProfile && typeof payload.brandProfile === 'object'
          ? payload.brandProfile
          : {});

  var campaign =
    payload && payload.campaign && typeof payload.campaign === 'object'
      ? payload.campaign
      : {};

  function KOL_IDS_PRODUCT_pick(obj, keys, fallback) {
    obj = obj || {};
    for (var i = 0; i < keys.length; i++) {
      var v = obj[keys[i]];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return fallback === undefined ? '' : fallback;
  }

  function KOL_IDS_PRODUCT_upsertFirstRow(sheetName, idHeader, idValue, aliases) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Required context sheet missing: ' + sheetName);

    var lastCol = Math.max(1, sheet.getLastColumn());
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h){ return String(h || '').trim(); });
    var row = new Array(headers.length).fill('');

    headers.forEach(function(h, i) {
      var key = h.toLowerCase();
      var value = '';
      if (key === idHeader.toLowerCase()) {
        value = idValue;
      } else if (aliases[h]) {
        value = aliases[h];
      }
      row[i] = value === undefined || value === null ? '' : value;
    });

    // Engine readers use the first data row as the active record.
    sheet.getRange(2, 1, 1, row.length).setValues([row]);
    return true;
  }

  var brandName = KOL_IDS_PRODUCT_pick(brand, ['brandName','name','Brand Name'], KOL_IDS_PRODUCT_pick(payload, ['brandName','Brand Name'], ''));
  var category = KOL_IDS_PRODUCT_pick(brand, ['category','Category'], KOL_IDS_PRODUCT_pick(payload, ['category','Category'], ''));
  var market = KOL_IDS_PRODUCT_pick(brand, ['market','Market'], KOL_IDS_PRODUCT_pick(payload, ['market','Market'], ''));
  var targetAudience = KOL_IDS_PRODUCT_pick(brand, ['targetAudience','audience','Target Audience'], KOL_IDS_PRODUCT_pick(payload, ['audience','targetAudience','Target Audience'], ''));
  var positioning = KOL_IDS_PRODUCT_pick(brand, ['brandPositioning','positioning','Brand Positioning'], KOL_IDS_PRODUCT_pick(payload, ['positioning','brandPositioning','Brand Positioning'], ''));
  var personality = KOL_IDS_PRODUCT_pick(brand, ['brandPersonality','personality','Brand Personality'], KOL_IDS_PRODUCT_pick(payload, ['brandPersonality','Brand Personality'], ''));
  var tone = KOL_IDS_PRODUCT_pick(brand, ['brandTone','tone','Brand Tone'], KOL_IDS_PRODUCT_pick(payload, ['brandTone','tone','Brand Tone'], ''));
  var values = KOL_IDS_PRODUCT_pick(brand, ['brandValues','values','Brand Values'], KOL_IDS_PRODUCT_pick(payload, ['brandValues','values','Brand Values'], ''));
  var perception = KOL_IDS_PRODUCT_pick(brand, ['desiredPerception','perception','Desired Perception'], KOL_IDS_PRODUCT_pick(payload, ['desiredPerception','perception','Desired Perception'], ''));
  var keywords = KOL_IDS_PRODUCT_pick(brand, ['brandKeywords','keywords','Brand Keywords'], KOL_IDS_PRODUCT_pick(payload, ['brandKeywords','keywords','Brand Keywords'], ''));
  var avoid = KOL_IDS_PRODUCT_pick(brand, ['brandAvoid','avoid','Brand Avoid'], KOL_IDS_PRODUCT_pick(payload, ['brandAvoid','avoid','Brand Avoid'], ''));

  KOL_IDS_PRODUCT_upsertFirstRow(
    KOL_IDS_PRODUCT_SHEETS.BRAND,
    'Brand ID',
    brandId,
    {
      'Brand Name': brandName,
      'Category': category,
      'Market': market,
      'Target Audience': targetAudience,
      'Brand Positioning': positioning,
      'Brand Personality': personality,
      'Brand Tone': tone,
      'Brand Values': values,
      'Desired Perception': perception,
      'Brand Keywords': keywords,
      'Brand Avoid': avoid,
      'Evidence Status': KOL_IDS_PRODUCT_pick(brand, ['evidenceStatus','Evidence Status'], 'PRODUCT_INPUT'),
      'Last Updated': new Date()
    }
  );

  var campaignName = KOL_IDS_PRODUCT_pick(campaign, ['campaignName','name','Campaign Name'], KOL_IDS_PRODUCT_pick(payload, ['campaignName','Campaign Name'], ''));
  var objective = KOL_IDS_PRODUCT_pick(campaign, ['campaignObjective','objective','Campaign Objective'], KOL_IDS_PRODUCT_pick(payload, ['campaignObjective','objective','Campaign Objective'], ''));
  var campaignAudience = KOL_IDS_PRODUCT_pick(campaign, ['targetAudience','audience','Target Audience'], targetAudience);
  var primaryKpi = KOL_IDS_PRODUCT_pick(campaign, ['primaryKPI','primaryKpi','Primary KPI'], KOL_IDS_PRODUCT_pick(payload, ['primaryKPI','primaryKpi','Primary KPI'], ''));
  var secondaryKpi = KOL_IDS_PRODUCT_pick(campaign, ['secondaryKPI','secondaryKpi','Secondary KPI'], KOL_IDS_PRODUCT_pick(payload, ['secondaryKPI','secondaryKpi','Secondary KPI'], ''));
  var budget = KOL_IDS_PRODUCT_pick(campaign, ['budget','Budget'], KOL_IDS_PRODUCT_pick(payload, ['budget','Budget'], ''));
  var currency = KOL_IDS_PRODUCT_pick(campaign, ['currency','Currency'], KOL_IDS_PRODUCT_pick(payload, ['currency','Currency'], 'THB'));
  var startDate = KOL_IDS_PRODUCT_pick(campaign, ['startDate','Start Date'], KOL_IDS_PRODUCT_pick(payload, ['startDate','Start Date'], ''));
  var endDate = KOL_IDS_PRODUCT_pick(campaign, ['endDate','End Date'], KOL_IDS_PRODUCT_pick(payload, ['endDate','End Date'], ''));
  var status = KOL_IDS_PRODUCT_pick(campaign, ['campaignStatus','status','Campaign Status'], 'ACTIVE');

  KOL_IDS_PRODUCT_upsertFirstRow(
    KOL_IDS_PRODUCT_SHEETS.CAMPAIGN,
    'Campaign ID',
    campaignId,
    {
      'Campaign Name': campaignName,
      'Brand ID': brandId,
      'Campaign Objective': objective,
      'Target Audience': campaignAudience,
      'Primary KPI': primaryKpi,
      'Secondary KPI': secondaryKpi,
      'Budget': budget,
      'Currency': currency,
      'Start Date': startDate,
      'End Date': endDate,
      'Awareness Weight': KOL_IDS_PRODUCT_pick(campaign, ['awarenessWeight','Awareness Weight'], ''),
      'Credibility Weight': KOL_IDS_PRODUCT_pick(campaign, ['credibilityWeight','Credibility Weight'], ''),
      'Relevance Weight': KOL_IDS_PRODUCT_pick(campaign, ['relevanceWeight','Relevance Weight'], ''),
      'Perception Weight': KOL_IDS_PRODUCT_pick(campaign, ['perceptionWeight','Perception Weight'], ''),
      'Purchase Weight': KOL_IDS_PRODUCT_pick(campaign, ['purchaseWeight','Purchase Weight'], ''),
      'Community Weight': KOL_IDS_PRODUCT_pick(campaign, ['communityWeight','Community Weight'], ''),
      'Campaign Status': status,
      'Last Updated': new Date()
    }
  );

  SpreadsheetApp.flush();

  // Hard assertion: the same IDs must now be visible to the Engine.
  var savedCampaignId = KOL_IDS_PRODUCT_string_(KOL_IDS_PRODUCT_getSheetFirstRowValue_(ss, KOL_IDS_PRODUCT_SHEETS.CAMPAIGN, ['Campaign ID','campaignId','ID']));
  var savedBrandId = KOL_IDS_PRODUCT_string_(KOL_IDS_PRODUCT_getSheetFirstRowValue_(ss, KOL_IDS_PRODUCT_SHEETS.BRAND, ['Brand ID','brandId','ID']));
  if (savedCampaignId !== campaignId) {
    throw new Error('Canonical Campaign persistence mismatch. Expected=' + campaignId + ', Actual=' + savedCampaignId + '.');
  }
  if (savedBrandId !== brandId) {
    throw new Error('Canonical Brand persistence mismatch. Expected=' + brandId + ', Actual=' + savedBrandId + '.');
  }

  return {
    success: true,
    analysisId: analysisId,
    campaignId: savedCampaignId,
    brandId: savedBrandId
  };
}


function KOL_IDS_PRODUCT_writeMemory_(
  ss,
  payload,
  analysisId,
  campaignId,
  brandId,
  persona
) {

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.MEMORY
    );

  if (!sheet) {
    throw new Error(
      'Workflow Memory sheet could not be created.'
    );
  }

  var headers =
    sheet
      .getRange(
        1,
        1,
        1,
        Math.max(
          1,
          sheet.getLastColumn()
        )
      )
      .getValues()[0];

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  var now =
    KOL_IDS_PRODUCT_now_();

  var stages = [
    [
      'Brand',
      'BRAND',
      brandId,
      payload.brand ||
      payload.brandProfile ||
      {}
    ],
    [
      'Campaign',
      'CAMPAIGN',
      campaignId,
      payload.campaign ||
      {}
    ],
    [
      'Persona',
      'PERSONA',
      persona && persona.id
        ? persona.id
        : '',
      persona ||
      {}
    ],
    [
      'Selected Creators',
      'KOL',
      '',
      payload.kols ||
      payload.creators ||
      payload.selectedCreators ||
      []
    ]
  ];

  var rows = [];

  stages.forEach(
    function(stage) {

      var row =
        new Array(
          headers.length
        ).fill('');

      function KOL_IDS_PRODUCT_put(
        header,
        value
      ) {

        if (
          idx[header] !==
          undefined
        ) {
          row[idx[header]] =
            value;
        }

      }

      KOL_IDS_PRODUCT_put(
        'Memory ID',
        KOL_IDS_PRODUCT_uuid_('MEM')
      );

      KOL_IDS_PRODUCT_put('Analysis ID', analysisId);
      KOL_IDS_PRODUCT_put('Campaign ID', campaignId);
      KOL_IDS_PRODUCT_put('Brand ID', brandId);
      KOL_IDS_PRODUCT_put('Stage', stage[0]);
      KOL_IDS_PRODUCT_put('Entity Type', stage[1]);
      KOL_IDS_PRODUCT_put('Entity ID', stage[2]);

      KOL_IDS_PRODUCT_put(
        'Payload JSON',
        KOL_IDS_PRODUCT_json_(
          stage[3]
        )
      );

      KOL_IDS_PRODUCT_put('Created At', now);
      KOL_IDS_PRODUCT_put('Updated At', now);

      rows.push(row);

    }
  );

  if (rows.length) {

    sheet
      .getRange(
        sheet.getLastRow() + 1,
        1,
        rows.length,
        headers.length
      )
      .setValues(rows);

  }

  SpreadsheetApp.flush();

  return {
    success: true,
    count: rows.length
  };
}


/* ==================================================
 * READ DECISION OUTPUT
 *
 * Optional context:
 * {
 *   analysisId,
 *   campaignId,
 *   kolIds
 * }
 *
 * Because older Decision schemas may not have
 * Analysis ID, current KOL IDs are also used as
 * a hard boundary.
 * ================================================== */

function KOL_IDS_PRODUCT_parseJsonSafe_(value,fallback){
  try{
    if(value===null||value===undefined||String(value).trim()==='')return fallback;
    var parsed=JSON.parse(String(value));
    return parsed===null||parsed===undefined?fallback:parsed;
  }catch(e){return fallback;}
}

function KOL_IDS_PRODUCT_readDecisions_(
  ss,
  context
) {

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.DECISION
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    return [];
  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (
    values.length < 2
  ) {
    return [];
  }

  var headers =
    values[0].map(
      function(h) {
        return KOL_IDS_PRODUCT_string_(h);
      }
    );

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  context =
    context || {};

  var currentAnalysisId =
    KOL_IDS_PRODUCT_string_(
      context.analysisId
    );

  var currentCampaignId =
    KOL_IDS_PRODUCT_string_(
      context.campaignId
    );

  var currentKOLIds =
    context.kolIds ||
    KOL_IDS_PRODUCT_getCurrentKOLIds_(
      ss
    );

  var hasAnalysisColumn =
    idx['Analysis ID'] !== undefined;

  var hasCampaignColumn =
    idx['Campaign ID'] !== undefined;

  var hasKOLColumn =
    idx['KOL ID'] !== undefined;

  var filtered =
    values
      .slice(1)
      .filter(
        function(row) {

          var kolId =
            hasKOLColumn
              ? KOL_IDS_PRODUCT_string_(
                  row[idx['KOL ID']]
                )
              : '';

          var kolName =
            idx['KOL Name'] !== undefined
              ? KOL_IDS_PRODUCT_string_(
                  row[idx['KOL Name']]
                )
              : '';

          if (!kolId && !kolName) {
            return false;
          }

          /*
           * If Analysis ID exists, it is authoritative.
           */
          if (hasAnalysisColumn) {

            var rowAnalysisId =
              KOL_IDS_PRODUCT_string_(
                row[idx['Analysis ID']]
              );

            /*
             * Analysis ID is authoritative only when the source row is
             * actually analysis-scoped.  Legacy Decision sheets may expose
             * an Analysis ID header while existing engine rows are still
             * campaign/KOL scoped.  In that case, do not turn a valid
             * decision set into an empty result merely because the current
             * UI pointer belongs to a newer analysis.
             *
             * If the row carries an Analysis ID, enforce it.
             * If the row does not, continue to Campaign ID / KOL ID
             * compatibility filtering below.
             */
            if (currentAnalysisId && rowAnalysisId) {
              return (
                rowAnalysisId ===
                currentAnalysisId
              );
            }

          }

          /*
           * If Campaign ID exists, use it next.
           */
          if (
            hasCampaignColumn &&
            currentCampaignId
          ) {

            var rowCampaignId =
              KOL_IDS_PRODUCT_string_(
                row[idx['Campaign ID']]
              );

            if (rowCampaignId) {
              return (
                rowCampaignId ===
                currentCampaignId
              );
            }

          }

          /*
           * Final protection for legacy Decision sheets:
           * only current KOL IDs are allowed.
           */
          if (
            kolId &&
            currentKOLIds &&
            Object.keys(
              currentKOLIds
            ).length
          ) {

            return !!currentKOLIds[kolId];

          }

          /*
           * If there is no current context at all,
           * preserve legacy behavior.
           */
          return !currentAnalysisId &&
            !currentCampaignId;

        }
      );

  return filtered.map(
    function(row) {

      function KOL_IDS_PRODUCT_get(
        header
      ) {

        return idx[header] !==
          undefined
          ? row[idx[header]]
          : '';

      }

      return {

        analysisId:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Analysis ID')
          ),

        campaignId:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Campaign ID')
          ),

        kolId:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('KOL ID')
          ),

        kolName:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('KOL Name')
          ),

        brandFitScore:
          KOL_IDS_PRODUCT_num_(
            KOL_IDS_PRODUCT_get('Brand Fit Score'),
            0
          ),

        brandImpactScore:
          KOL_IDS_PRODUCT_num_(
            KOL_IDS_PRODUCT_get('Brand Impact Score'),
            0
          ),

        confidenceScore:
          KOL_IDS_PRODUCT_num_(
            KOL_IDS_PRODUCT_get('Confidence Score'),
            0
          ),

        riskLevel:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Risk Level')
          ),

        decision:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Decision')
          ),

        recommendedRole:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Recommended Role')
          ),

        primaryImpact:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Primary Impact')
          ),

        secondaryImpact:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Secondary Impact')
          ),

        bestUsedFor:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Best Used For')
          ),

        notIdealFor:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Not Ideal For')
          ),

        decisionReason:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Decision Reason')
          ),

        evidenceSummary:
          KOL_IDS_PRODUCT_string_(
            KOL_IDS_PRODUCT_get('Evidence Summary')
          ),

        recoveryStrategy:
          KOL_IDS_PRODUCT_parseJsonSafe_(
            KOL_IDS_PRODUCT_get('Recovery Strategy'),
            {}
          ),

        contentRecommendation:
          KOL_IDS_PRODUCT_parseJsonSafe_(
            KOL_IDS_PRODUCT_get('Content Recommendation'),
            []
          )

      };

    }
  );
}


/* ==================================================
 * READ KOL MAP
 * ================================================== */

function KOL_IDS_PRODUCT_readKOLMap_(
  ss
) {

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.KOL
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    return {};
  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (values.length < 2) {
    return {};
  }

  var headers =
    values[0].map(
      function(h) {
        return KOL_IDS_PRODUCT_string_(h);
      }
    );

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  var map = {};

  values
    .slice(1)
    .forEach(
      function(row) {

        if (
          idx['KOL ID'] === undefined
        ) {
          return;
        }

        var id =
          KOL_IDS_PRODUCT_string_(
            row[idx['KOL ID']]
          );

        if (!id) {
          return;
        }

        map[id] = {

          name:
            KOL_IDS_PRODUCT_string_(
              row[idx['KOL Name']]
            ),

          platform:
            KOL_IDS_PRODUCT_string_(
              row[idx['Platform']]
            ),

          platformUrl:
            KOL_IDS_PRODUCT_string_(
              row[idx['Platform URL']]
            ),

          category:
            KOL_IDS_PRODUCT_string_(
              row[idx['Category']]
            ),

          followers:
            KOL_IDS_PRODUCT_num_(
              row[idx['Followers']],
              0
            ),

          engagementRate:
            KOL_IDS_PRODUCT_num_(
              row[idx['Engagement Rate']],
              0
            )

        };

      }
    );

  return map;
}


/* ==================================================
 * BUILD CREATOR REPORT
 * ================================================== */

function KOL_IDS_PRODUCT_getCreatorIntelligenceSnapshot_(ss, kolId){
  var blank={fit:'',coverage:'',summary:''};
  try{
    if(typeof KOL_IDS_PERSONA_getActive_!=='function')return blank;
    var p=KOL_IDS_PERSONA_getActive_(ss), hit=(p.kols||[]).find(function(x){return String(x['Record ID']||'')===String(kolId||'');});
    if(!hit)return blank;
    var fields=[['Personality','Personality'],['Communication','Communication'],['Relationship','Audience Relationship'],['Social Behavior','Social Behavior'],['Content Personality','Content Personality'],['Content Function','Content Function'],['Content Behavior','Content Behavior'],['Psychology','Audience Psychology']];
    var present=[]; fields.forEach(function(pair){if(String(hit[pair[0]]||'').trim())present.push(pair[1]);});
    if(!present.length)return blank;
    var campaign=KOL_IDS_ENGINE_readCampaign_(ss),brand=KOL_IDS_ENGINE_readBrand_(ss);
    var normalized={personality:String(hit['Personality']||''),communication:String(hit['Communication']||''),relationship:String(hit['Relationship']||''),social:String(hit['Social Behavior']||''),contentPersonality:String(hit['Content Personality']||''),contentFunction:String(hit['Content Function']||''),contentBehavior:String(hit['Content Behavior']||''),psychology:String(hit['Psychology']||'')};
    var targets={personality:[brand.personality,brand.tone,brand.desiredPerception,brand.positioning].join(' '),communication:[brand.tone,campaign.objective,campaign.primaryKpi].join(' '),relationship:[campaign.targetAudience,campaign.objective].join(' '),social:[campaign.objective,campaign.primaryKpi,campaign.secondaryKpi].join(' '),contentPersonality:[brand.positioning,brand.tone,brand.desiredPerception].join(' '),contentFunction:[campaign.objective,campaign.primaryKpi,campaign.secondaryKpi].join(' '),contentBehavior:[campaign.objective,campaign.primaryKpi].join(' '),psychology:[brand.targetAudience,campaign.targetAudience].join(' ')};
    var scores=[]; Object.keys(targets).forEach(function(key){if(normalized[key] && String(targets[key]||'').trim())scores.push(KOL_IDS_ENGINE_deepTextFit_(targets[key],normalized[key]));});
    return {fit:scores.length?Math.round(scores.reduce(function(a,b){return a+b},0)/scores.length):'',coverage:present.length+'/8',summary:present.join(' · ')};
  }catch(e){return blank;}
}

function KOL_IDS_PRODUCT_BUILD_REPORT_LEGACY_(
  context
) {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  context =
    context || {};

  var analysisId =
    KOL_IDS_PRODUCT_string_(
      context.analysisId
    ) ||
    KOL_IDS_PRODUCT_getActiveAnalysisId_(
      ss
    );

  var campaignId =
    KOL_IDS_PRODUCT_string_(
      context.campaignId
    );

  var brandId =
    KOL_IDS_PRODUCT_string_(
      context.brandId
    );

  var decisions =
    KOL_IDS_PRODUCT_readDecisions_(
      ss,
      {
        analysisId: analysisId,
        campaignId: campaignId,
        kolIds:
          KOL_IDS_PRODUCT_getCurrentKOLIds_(
            ss
          )
      }
    );

  var kolMap =
    KOL_IDS_PRODUCT_readKOLMap_(
      ss
    );

  var reportSheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.REPORT
    );

  if (!reportSheet) {

    reportSheet =
      KOL_IDS_PRODUCT_ensureSheet_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.REPORT,
        KOL_IDS_PRODUCT_HEADERS.REPORT
      );

  }

  if (
    reportSheet.getLastRow() > 1
  ) {

    reportSheet
      .getRange(
        2,
        1,
        reportSheet.getLastRow() - 1,
        reportSheet.getLastColumn()
      )
      .clearContent();

  }

  var persona =
    context.persona ||
    KOL_IDS_PRODUCT_getCanonicalPersona_(
      ss
    );

  var personaName =
    persona
      ? persona.name
      : '';

  var reportHeaders =
    reportSheet
      .getRange(
        1,
        1,
        1,
        Math.max(
          1,
          reportSheet.getLastColumn()
        )
      )
      .getValues()[0];

  KOL_IDS_PRODUCT_HEADERS.REPORT.forEach(function(header){
    if(reportHeaders.indexOf(header)===-1){
      reportSheet.getRange(1,reportHeaders.length+1).setValue(header);
      reportHeaders.push(header);
    }
  });

  var reportIdx =
    KOL_IDS_PRODUCT_headerIndex_(
      reportHeaders
    );

  var rows =
    decisions.map(
      function(decision) {

        var kol =
          kolMap[
            decision.kolId
          ] || {};

        var row =
          new Array(
            reportHeaders.length
          ).fill('');

        function KOL_IDS_PRODUCT_put(
          header,
          value
        ) {

          if (
            reportIdx[header] !==
            undefined
          ) {
            row[reportIdx[header]] =
              value;
          }

        }

        KOL_IDS_PRODUCT_put(
          'Analysis ID',
          analysisId
        );

        KOL_IDS_PRODUCT_put(
          'Campaign ID',
          campaignId ||
          decision.campaignId
        );

        KOL_IDS_PRODUCT_put(
          'Brand ID',
          brandId
        );

        KOL_IDS_PRODUCT_put(
          'KOL ID',
          decision.kolId
        );

        KOL_IDS_PRODUCT_put(
          'KOL Name',
          decision.kolName ||
          kol.name
        );

        KOL_IDS_PRODUCT_put(
          'Platform',
          kol.platform
        );

        KOL_IDS_PRODUCT_put(
          'Platform URL',
          kol.platformUrl
        );

        KOL_IDS_PRODUCT_put(
          'Category',
          kol.category
        );

        KOL_IDS_PRODUCT_put(
          'Followers',
          kol.followers
        );

        KOL_IDS_PRODUCT_put(
          'Engagement Rate',
          kol.engagementRate
        );

        KOL_IDS_PRODUCT_put(
          'Brand Fit Score',
          decision.brandFitScore
        );

        KOL_IDS_PRODUCT_put(
          'Brand Impact Score',
          decision.brandImpactScore
        );

        KOL_IDS_PRODUCT_put(
          'Confidence Score',
          decision.confidenceScore
        );

        KOL_IDS_PRODUCT_put(
          'Risk Level',
          decision.riskLevel
        );

        KOL_IDS_PRODUCT_put(
          'Decision',
          decision.decision
        );

        KOL_IDS_PRODUCT_put(
          'Recommended Role',
          decision.recommendedRole
        );

        KOL_IDS_PRODUCT_put(
          'Primary Impact',
          decision.primaryImpact
        );

        KOL_IDS_PRODUCT_put(
          'Secondary Impact',
          decision.secondaryImpact
        );

        KOL_IDS_PRODUCT_put(
          'Best Used For',
          decision.bestUsedFor
        );

        KOL_IDS_PRODUCT_put(
          'Not Ideal For',
          decision.notIdealFor
        );

        KOL_IDS_PRODUCT_put(
          'Decision Reason',
          decision.decisionReason
        );

        KOL_IDS_PRODUCT_put(
          'Evidence Summary',
          decision.evidenceSummary
        );

        KOL_IDS_PRODUCT_put(
          'Persona Name',
          personaName
        );

        KOL_IDS_PRODUCT_put(
          'Persona Fit',
          persona
            ? (
                persona.brandFit ||
                ''
              )
            : ''
        );

        var intelligence = KOL_IDS_PRODUCT_getCreatorIntelligenceSnapshot_(ss, decision.kolId);
        KOL_IDS_PRODUCT_put('Creator Intelligence Fit', intelligence.fit);
        KOL_IDS_PRODUCT_put('Creator Intelligence Coverage', intelligence.coverage);
        KOL_IDS_PRODUCT_put('Creator Intelligence Summary', intelligence.summary);

        var recovery = decision.recoveryStrategy || {};
        var recoveryActions = Array.isArray(recovery.actions) ? recovery.actions : (Array.isArray(recovery.strategies) ? recovery.strategies : []);
        var recoveryActionText = recoveryActions.map(function(a){
          if(typeof a==='string') return a;
          return a.th || a.en || a.key || '';
        }).filter(Boolean).join(' | ');
        var contentRec = Array.isArray(decision.contentRecommendation) ? decision.contentRecommendation : [];
        var contentRecText = contentRec.map(function(x){
          if(typeof x==='string') return x;
          var fit = x.fit!==undefined && x.fit!=='' ? ' · Fit '+x.fit : '';
          var reason = x.reason ? ' — '+x.reason : '';
          return (x.format||'Recommended format') + fit + reason;
        }).filter(Boolean).join(' | ');
        var partner = recovery.partner || null;
        var partnerText = partner ? ('Pair with '+String(partner.name||'a stronger primary-goal creator')+' as the primary-goal driver.') : '';

        KOL_IDS_PRODUCT_put('Preferred Use Strategy', recovery.role || decision.recommendedRole || '');
        KOL_IDS_PRODUCT_put('Primary Fit Gap', recovery.primaryGap || (recoveryActions.length ? 'Fit / role optimization' : ''));
        KOL_IDS_PRODUCT_put('Recovery Actions', recoveryActionText);
        KOL_IDS_PRODUCT_put('Content Recommendation', contentRecText);
        KOL_IDS_PRODUCT_put('Compensating Creator Strategy', partnerText);

        KOL_IDS_PRODUCT_put(
          'Generated At',
          KOL_IDS_PRODUCT_now_()
        );

        return row;

      }
    );

  /*
   * Map source fit inputs into report.
   */
  if (rows.length) {

    var kolSheet =
      ss.getSheetByName(
        KOL_IDS_PRODUCT_SHEETS.KOL
      );

    if (kolSheet) {

      var kolValues =
        kolSheet
          .getDataRange()
          .getValues();

      if (kolValues.length) {

        var kolHeaders =
          kolValues[0].map(
            function(h) {
              return KOL_IDS_PRODUCT_string_(h);
            }
          );

        var kolIdx =
          KOL_IDS_PRODUCT_headerIndex_(
            kolHeaders
          );

        var kolRows = {};

        kolValues
          .slice(1)
          .forEach(
            function(krow) {

              if (
                kolIdx['KOL ID'] ===
                undefined
              ) {
                return;
              }

              var id =
                KOL_IDS_PRODUCT_string_(
                  krow[
                    kolIdx['KOL ID']
                  ]
                );

              if (id) {
                kolRows[id] =
                  krow;
              }

            }
          );

        rows.forEach(
          function(row) {

            var id =
              reportIdx['KOL ID'] !== undefined
                ? KOL_IDS_PRODUCT_string_(
                    row[
                      reportIdx['KOL ID']
                    ]
                  )
                : '';

            var krow =
              kolRows[id];

            if (!krow) {
              return;
            }

            function KOL_IDS_PRODUCT_copy(
              reportHeader,
              kolHeader
            ) {

              if (
                reportIdx[
                  reportHeader
                ] !== undefined &&
                kolIdx[
                  kolHeader
                ] !== undefined
              ) {

                row[
                  reportIdx[
                    reportHeader
                  ]
                ] =
                  krow[
                    kolIdx[
                      kolHeader
                    ]
                  ];

              }

            }

            KOL_IDS_PRODUCT_copy(
              'Audience Fit',
              'Audience Fit Input'
            );

            KOL_IDS_PRODUCT_copy(
              'Brand Image Fit',
              'Brand Image Fit Input'
            );

            KOL_IDS_PRODUCT_copy(
              'Content Fit',
              'Content Fit Input'
            );

            KOL_IDS_PRODUCT_copy(
              'Category Fit',
              'Category Fit Input'
            );

            KOL_IDS_PRODUCT_copy(
              'Value Fit',
              'Value Fit Input'
            );

            KOL_IDS_PRODUCT_copy(
              'Performance Evidence',
              'Performance Evidence Input'
            );

          }
        );

      }

    }

    reportSheet
      .getRange(
        2,
        1,
        rows.length,
        reportHeaders.length
      )
      .setValues(rows);

  }

  SpreadsheetApp.flush();

  var finalRows =
    Math.max(
      0,
      reportSheet.getLastRow() - 1
    );

  if (
    decisions.length > 0 &&
    finalRows === 0
  ) {

    throw new Error(
      'No creator report rows generated.'
    );

  }

  return {
    success: true,
    rows: finalRows,
    decisionRows:
      decisions.length,
    analysisId:
      analysisId,
    campaignId:
      campaignId,
    sheet:
      KOL_IDS_PRODUCT_SHEETS.REPORT
  };
}


/* ==================================================
 * PRODUCT SETUP
 * ================================================== */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_SETUP() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var core =
    KOL_IDS_PRODUCT_BOOTSTRAP_CORE_(ss);

  var structure =
    KOL_IDS_PRODUCT_ENSURE_STRUCTURE();

  return {
    success: true,
    product:
      'KOL Investment Decision System™',
    version:
      KOL_IDS_PRODUCT_VERSION,
    core:
      core,
    structure:
      structure
  };
}


/* ==================================================
 * CURRENT-ANALYSIS POINTER
 *
 * UserProperties stores only compact pointers. Canonical objects live in
 * ENT_CANONICAL_STATE and are the recovery source.
 * ================================================== */
function KOL_IDS_PRODUCT_cacheCurrentAnalysis_(analysisId,campaignId,brandId,kols,persona){
  var props=PropertiesService.getUserProperties();
  if(analysisId)props.setProperty('KOL_IDS_ACTIVE_ANALYSIS_ID',String(analysisId));
  if(campaignId)props.setProperty('KOL_IDS_ACTIVE_CAMPAIGN_ID',String(campaignId));
  if(brandId)props.setProperty('KOL_IDS_ACTIVE_BRAND_ID',String(brandId));
  return {success:true,count:Array.isArray(kols)?kols.length:0,storage:'CANONICAL_STATE'};
}

function KOL_IDS_PRODUCT_readCurrentAnalysisCache_(){
  try{
    if(typeof KOL_IDS_CANONICAL_getContext_==='function'){
      var ctx=KOL_IDS_CANONICAL_getContext_();
      if(ctx&&ctx.analysisId)return ctx;
    }
  }catch(ignoreCanonical){}
  return null;
}


function KOL_IDS_PRODUCT_recoverKOLsFromCache_(
  ss,
  analysisId
) {

  var cached =
    KOL_IDS_PRODUCT_readCurrentAnalysisCache_();

  if (!cached) {
    return {
      success: false,
      count: 0,
      source: 'USER_PROPERTIES',
      error: 'Current analysis cache is unavailable.'
    };
  }

  if (
    KOL_IDS_PRODUCT_string_(cached.analysisId) !==
    KOL_IDS_PRODUCT_string_(analysisId)
  ) {
    return {
      success: false,
      count: 0,
      source: 'USER_PROPERTIES',
      error:
        'Current analysis cache belongs to Analysis=' +
        KOL_IDS_PRODUCT_string_(cached.analysisId) +
        ', not active Analysis=' +
        KOL_IDS_PRODUCT_string_(analysisId) +
        '.'
    };
  }

  var rawKOLs =
    KOL_IDS_PRODUCT_array_(
      cached.kols
    );

  if (!rawKOLs.length) {
    return {
      success: false,
      count: 0,
      source: 'USER_PROPERTIES',
      error: 'Current analysis cache contains zero KOL records.'
    };
  }

  var kols =
    rawKOLs.map(
      KOL_IDS_PRODUCT_normalizeKOL_
    );

  KOL_IDS_PRODUCT_writeKOLs_(
    ss,
    kols
  );

  var verified =
    KOL_IDS_PRODUCT_countKOLs_(
      ss
    );

  if (verified !== kols.length) {
    return {
      success: false,
      count: verified,
      source: 'USER_PROPERTIES',
      error:
        'Cache recovery persistence mismatch: expected=' +
        kols.length +
        ', actual=' +
        verified
    };
  }

  return {
    success: true,
    count: verified,
    source: 'USER_PROPERTIES'
  };
}


/* ==================================================
 * PRODUCT SAVE
 * ================================================== */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_SAVE(
  payload
) {

  if (
    !payload ||
    typeof payload !==
    'object'
  ) {

    throw new Error(
      'KBIS Product SAVE: payload is required.'
    );

  }

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var startedAt =
    KOL_IDS_PRODUCT_now_();

  /*
   * 1. GUARANTEE STRUCTURE
   */
  KOL_IDS_PRODUCT_ENSURE_STRUCTURE();


  /*
   * 2. IDENTIFIERS
   */
  var analysisId =
    KOL_IDS_PRODUCT_string_(
      payload.analysisId ||
      payload.id
    ) ||
    KOL_IDS_PRODUCT_uuid_(
      'AN'
    );

  var campaignId =
    KOL_IDS_PRODUCT_string_(
      payload.campaignId ||
      (
        payload.campaign &&
        (
          payload.campaign.campaignId ||
          payload.campaign.id ||
          payload.campaign['Campaign ID']
        )
      )
    ) ||
    KOL_IDS_PRODUCT_uuid_(
      'CP'
    );

  var brandId =
    KOL_IDS_PRODUCT_string_(
      payload.brandId ||
      (
        payload.brand &&
        (
          payload.brand.brandId ||
          payload.brand.id ||
          payload.brand['Brand ID']
        )
      )
    ) ||
    KOL_IDS_PRODUCT_uuid_(
      'BR'
    );


  /*
   * IMPORTANT:
   * SAVE establishes the active analysis immediately.
   * This prevents SAVE/RUN/Memory from using an old ID.
   */
  KOL_IDS_PRODUCT_setActiveAnalysisId_(
    analysisId
  );

  /*
   * Bootstrap core sheets only if genuinely missing.
   * Never re-run the core initializer merely because SAVE
   * is being called.
   */
  KOL_IDS_PRODUCT_BOOTSTRAP_CORE_(ss);


  /*
   * 3. KOL SOURCE
   */
  var rawKOLs =
    KOL_IDS_PRODUCT_array_(
      payload.kols ||
      payload.creators ||
      payload.selectedCreators ||
      payload.selectedKOLs ||
      payload['KOLs']
    );

  if (
    !rawKOLs.length &&
    payload.kol &&
    typeof payload.kol ===
    'object'
  ) {
    rawKOLs = [
      payload.kol
    ];
  }

  var kols =
    rawKOLs.map(
      KOL_IDS_PRODUCT_normalizeKOL_
    );

  if (kols.length > 100) {
    throw new Error('A maximum of 100 creators is allowed per analysis.');
  }

  if (!kols.length) {

    throw new Error(
      'No KOL records supplied to Product SAVE. ' +
      'Expected payload.kols / creators / selectedCreators.'
    );

  }


  /*
   * Reject duplicate KOL IDs.
   */
  var seenKOLIds = {};

  kols.forEach(
    function(kol) {

      if (
        seenKOLIds[kol.id]
      ) {
        throw new Error(
          'Duplicate KOL ID detected during SAVE: ' +
          kol.id
        );
      }

      seenKOLIds[kol.id] =
        true;

    }
  );


  /*
   * 4. PERSONA
   */
  var persona =
    null;

  if (
    payload.persona &&
    typeof payload.persona ===
    'object'
  ) {

    persona =
      KOL_IDS_PRODUCT_normalizePersona_(
        payload.persona
      );

  }
  else if (
    payload.personaName ||
    payload.targetAudience
  ) {

    persona =
      KOL_IDS_PRODUCT_normalizePersona_({
        name:
          payload.personaName ||
          'Canonical Audience Persona',
        description:
          payload.targetAudience
      });

  }


  /*
   * 5. BUILD A SAFE DOWNSTREAM PAYLOAD.
   *
   * We preserve the original payload but guarantee
   * canonical IDs and KOL/Persona aliases.
   */
  var downstreamPayload =
    KOL_IDS_PRODUCT_clone_(
      payload
    );

  downstreamPayload.analysisId =
    analysisId;

  downstreamPayload.campaignId =
    campaignId;

  downstreamPayload.brandId =
    brandId;

  downstreamPayload.kols =
    kols;

  if (persona) {
    downstreamPayload.persona =
      persona;
  }

  /*
   * Durable recovery point. This is written BEFORE any
   * downstream/core operation can mutate product sheets.
   */
  var currentAnalysisCache =
    KOL_IDS_PRODUCT_cacheCurrentAnalysis_(
      analysisId,
      campaignId,
      brandId,
      kols,
      persona
    );


  /*
   * 5A. CANONICAL BRAND / CAMPAIGN CONTEXT
   *
   * SAVE creates canonical IDs, but the Decision Engine reads
   * 02_BRAND_PROFILE / 03_CAMPAIGN directly. Therefore those
   * sheets must be persisted BEFORE KOL_IDS_ENGINE_runDecisionEngine().
   * Keep row 2 as the active/current context because the Engine's
   * canonical readers intentionally read the first data row.
   */
  KOL_IDS_PRODUCT_persistActiveContext_(
    ss,
    downstreamPayload,
    analysisId,
    campaignId,
    brandId
  );

  /*
   * 6. CORE / DOWNSTREAM SAVE
   *
   * Run first so the Product Layer becomes the final
   * canonical persistence pass for KOL/Persona.
   */
  var downstreamSave =
    null;

  try {

    if (
      typeof KOL_IDS_PRODUCT_saveAnalysisPayload_ ===
      'function'
    ) {

      downstreamSave =
        KOL_IDS_PRODUCT_saveAnalysisPayload_(
          downstreamPayload
        );

    }

  }
  catch (e) {

    /*
     * A core save failure is not silently converted
     * into Product SAVE success.
     */
    throw new Error(
      'Downstream analysis save failed: ' +
      e.message
    );

  }


  /*
   * 7. CANONICAL KOL DATABASE
   */
  var kolSave =
    KOL_IDS_PRODUCT_writeKOLs_(
      ss,
      kols
    );


  /*
   * 8. CANONICAL PERSONA
   */
  var personaSave = {
    success: true,
    count: 0,
    skipped: true
  };

  if (persona) {

    personaSave =
      KOL_IDS_PRODUCT_writePersona_(
        ss,
        persona,
        analysisId,
        campaignId,
        brandId
      );

  }

  /*
   * 8A. CREATOR INTELLIGENCE CANONICAL PROFILE
   * The premium creator-input surface writes the same KOL snapshot into
   * 13A_PERSONA_PROFILE so Creator Intelligence is a first-class canonical
   * source for the Decision Engine and survives edit/save/load/re-run.
   */
  var creatorIntelligenceSave = {success:true, skipped:true};
  if (typeof KOL_IDS_PERSONA_write_ === 'function') {
    var personaPayload = KOL_IDS_PRODUCT_clone_(downstreamPayload);
    /* Keep the rich creator-intelligence arrays from the UI payload. Product
       normalization intentionally stays lean for 04_KOL_DATABASE, while
       13A_PERSONA_PROFILE is the canonical behavioral/content-DNA store. */
    personaPayload.kols = Array.isArray(payload.kols) ? KOL_IDS_PRODUCT_clone_(payload.kols) : personaPayload.kols;
    var a = personaPayload.audience || {};
    personaPayload.audienceAge = a.age || '';
    personaPayload.audienceGender = a.gender || '';
    personaPayload.audienceBehavior = a.behavior || '';
    personaPayload.audienceInterest = a.interests || a.interest || '';
    personaPayload.audienceGeography = a.location || '';
    personaPayload.audienceLocation = a.location || '';
    personaPayload.audienceGoalsNeeds = a.goalsNeeds || '';
    personaPayload.audiencePainPoints = a.painPoints || '';
    personaPayload.audienceLifestyle = a.lifestyle || '';
    creatorIntelligenceSave = KOL_IDS_PERSONA_write_(ss, personaPayload, analysisId, campaignId, brandId);
  }


  /*
   * 9. WORKFLOW MEMORY
   */
  var memorySave =
    KOL_IDS_PRODUCT_writeMemory_(
      ss,
      downstreamPayload,
      analysisId,
      campaignId,
      brandId,
      persona
    );

  /* Re-assert the durable cache after downstream persistence. */
  currentAnalysisCache =
    KOL_IDS_PRODUCT_cacheCurrentAnalysis_(
      analysisId,
      campaignId,
      brandId,
      kols,
      persona
    );


  SpreadsheetApp.flush();


  /*
   * 10. FINAL PERSISTENCE ASSERTIONS
   */
  var actualKOLCount =
    KOL_IDS_PRODUCT_countKOLs_(
      ss
    );

  if (
    actualKOLCount !==
    kols.length
  ) {

    var kolSheet =
      ss.getSheetByName(
        KOL_IDS_PRODUCT_SHEETS.KOL
      );

    var kolHeaders =
      kolSheet
        ? kolSheet
            .getRange(
              1,
              1,
              1,
              Math.max(
                1,
                kolSheet.getLastColumn()
              )
            )
            .getValues()[0]
            .map(
              function(h) {
                return KOL_IDS_PRODUCT_string_(h);
              }
            )
        : [];

    throw new Error(
      'No KOL records available after save. ' +
      'Expected=' +
      kols.length +
      ', Actual=' +
      actualKOLCount +
      '. Sheet=' +
      KOL_IDS_PRODUCT_SHEETS.KOL +
      '. KOL ID Header=' +
      (
        kolHeaders.indexOf('KOL ID') >= 0
          ? 'Column ' +
            (
              kolHeaders.indexOf('KOL ID') +
              1
            )
          : 'MISSING'
      ) +
      '.'
    );

  }


  if (persona) {

    var savedPersona =
      KOL_IDS_PRODUCT_getCanonicalPersona_(
        ss
      );

    if (
      !savedPersona ||
      savedPersona.id !==
      persona.id
    ) {

      throw new Error(
        'Canonical Persona persistence assertion failed.'
      );

    }

  }


  var verifiedActiveAnalysisId =
    KOL_IDS_PRODUCT_getActiveAnalysisId_(
      ss
    );

  if (
    verifiedActiveAnalysisId !==
    analysisId
  ) {

    throw new Error(
      'Active Analysis ID mismatch after SAVE. ' +
      'Expected=' +
      analysisId +
      ', Actual=' +
      verifiedActiveAnalysisId
    );

  }


  return {

    success: true,
    saved: true,

    analysisId:
      analysisId,

    campaignId:
      campaignId,

    brandId:
      brandId,

    kolCount:
      actualKOLCount,

    persona:
      personaSave,

    creatorIntelligence:
      creatorIntelligenceSave,

    memory:
      memorySave,

    downstream:
      downstreamSave,

    durationMs:
      KOL_IDS_PRODUCT_now_()
        .getTime() -
      startedAt.getTime()

  };

}


/* ==================================================
 * RECOVER KOL DATABASE FROM WORKFLOW MEMORY
 *
 * If another layer clears/replaces 04_KOL_DATABASE
 * between SAVE and RUN, recover the canonical KOL
 * payload from 15_WORKFLOW_MEMORY before failing.
 * ================================================== */

function KOL_IDS_PRODUCT_recoverKOLsFromMemory_(
  ss,
  analysisId
) {

  var result = {
    success: false,
    count: 0,
    source: '15_WORKFLOW_MEMORY',
    error: ''
  };

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.MEMORY
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    result.error =
      'Workflow memory is unavailable or empty.';
    return result;
  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (values.length < 2) {
    result.error =
      'Workflow memory has no data rows.';
    return result;
  }

  var headers =
    values[0].map(
      function(h) {
        return KOL_IDS_PRODUCT_string_(h);
      }
    );

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  if (
    idx['Analysis ID'] === undefined ||
    idx['Stage'] === undefined ||
    idx['Payload JSON'] === undefined
  ) {
    result.error =
      '15_WORKFLOW_MEMORY is missing Analysis ID, Stage, or Payload JSON header.';
    return result;
  }

  /*
   * Search newest memory first.
   * We only recover the Selected Creators stage
   * belonging to the active analysis.
   */
  for (
    var i = values.length - 1;
    i >= 1;
    i--
  ) {

    var row =
      values[i];

    var rowAnalysisId =
      KOL_IDS_PRODUCT_string_(
        row[idx['Analysis ID']]
      );

    var stage =
      KOL_IDS_PRODUCT_string_(
        row[idx['Stage']]
      );

    if (
      rowAnalysisId !== analysisId ||
      stage !== 'Selected Creators'
    ) {
      continue;
    }

    var rawPayload =
      KOL_IDS_PRODUCT_string_(
        row[idx['Payload JSON']]
      );

    if (!rawPayload) {
      result.error =
        'Selected Creators memory row has empty Payload JSON.';
      return result;
    }

    var payload;

    try {
      payload =
        JSON.parse(
          rawPayload
        );
    }
    catch (e) {
      result.error =
        'Selected Creators memory Payload JSON is invalid: ' +
        e.message;
      return result;
    }

    var rawKOLs =
      KOL_IDS_PRODUCT_array_(
        payload
      );

    /*
     * Memory normally stores the KOL array directly.
     * Also accept wrapped legacy payloads.
     */
    if (!rawKOLs.length) {
      rawKOLs =
        KOL_IDS_PRODUCT_array_(
          payload.kols ||
          payload.creators ||
          payload.selectedCreators ||
          payload.selectedKOLs ||
          payload['KOLs']
        );
    }

    if (!rawKOLs.length) {
      result.error =
        'Selected Creators memory exists but contains zero KOL records.';
      return result;
    }

    var kols =
      rawKOLs.map(
        KOL_IDS_PRODUCT_normalizeKOL_
      );

    /*
     * Re-persist into the canonical KOL sheet.
     * writeKOLs_ performs its own persistence assertion.
     */
    var saveResult =
      KOL_IDS_PRODUCT_writeKOLs_(
        ss,
        kols
      );

    var verified =
      KOL_IDS_PRODUCT_countKOLs_(
        ss
      );

    if (
      verified !==
      kols.length
    ) {
      result.error =
        'KOL recovery persistence mismatch: expected=' +
        kols.length +
        ', actual=' +
        verified;
      return result;
    }

    result.success = true;
    result.count = verified;
    result.analysisId = analysisId;

    return result;
  }

  result.error =
    'No Selected Creators memory row found for active analysis ' +
    analysisId +
    '.';

  return result;
}


/* ==================================================
 * PRODUCT RUN
 * ================================================== */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_RUN() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var startedAt =
    KOL_IDS_PRODUCT_now_();

  KOL_IDS_PRODUCT_ENSURE_STRUCTURE();


  /*
   * Current analysis is always the active analysis.
   */
  var analysisId =
    KOL_IDS_PRODUCT_getActiveAnalysisId_(
      ss
    );


  /*
   * Verify KOL data before engine.
   */
  var kolCount =
    KOL_IDS_PRODUCT_countKOLs_(
      ss
    );

  /*
   * SELF-HEAL:
   * If 04_KOL_DATABASE was cleared/replaced after SAVE,
   * recover the canonical creator payload from workflow
   * memory before aborting the RUN.
   */
  if (
    kolCount === 0
  ) {

    /*
     * Recovery priority:
     * 1) durable UserProperties cache
     * 2) append-only Workflow Memory sheet
     */
    var kolRecovery =
      KOL_IDS_PRODUCT_recoverKOLsFromCache_(
        ss,
        analysisId
      );

    if (
      kolRecovery &&
      kolRecovery.success === true &&
      kolRecovery.count > 0
    ) {

      kolCount =
        kolRecovery.count;

    }
    else {

      var memoryRecovery =
        KOL_IDS_PRODUCT_recoverKOLsFromMemory_(
          ss,
          analysisId
        );

      if (
        memoryRecovery &&
        memoryRecovery.success === true &&
        memoryRecovery.count > 0
      ) {

        kolCount =
          memoryRecovery.count;

      }
      else {

        throw new Error(
          'No KOL records available after save. ' +
          'Active Analysis=' +
          analysisId +
          '. Cache=' +
          (
            kolRecovery && kolRecovery.error
              ? kolRecovery.error
              : 'unavailable'
          ) +
          '. Memory=' +
          (
            memoryRecovery && memoryRecovery.error
              ? memoryRecovery.error
              : 'unavailable'
          ) +
          '.'
        );

      }

    }

  }


  /*
   * Current context from headers.
   */
  var campaignId =
    KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.CAMPAIGN,
        [
          'Campaign ID',
          'campaignId',
          'ID'
        ]
      )
    );

  var brandId =
    KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.BRAND,
        [
          'Brand ID',
          'brandId',
          'ID'
        ]
      )
    );


  /*
   * If Campaign/Brand sheets do not expose IDs,
   * recover them from workflow memory for this analysis.
   */
  if (
    !campaignId ||
    !brandId
  ) {

    var recovered =
      KOL_IDS_PRODUCT_recoverContextFromMemory_(
        ss,
        analysisId
      );

    if (!campaignId) {
      campaignId =
        recovered.campaignId;
    }

    if (!brandId) {
      brandId =
        recovered.brandId;
    }

  }


  /*
   * Decision Engine remains authoritative.
   */
  if (
    typeof KOL_IDS_ENGINE_runDecisionEngine !==
    'function'
  ) {

    throw new Error(
      'KBIS Decision Engine is not installed.'
    );

  }

  var engineResult;

  try {

    engineResult =
      KOL_IDS_ENGINE_runDecisionEngine();

  }
  catch (e) {

    throw new Error(
      'Decision Engine failed: ' +
      e.message
    );

  }


  if (
    !engineResult ||
    engineResult.success !==
    true
  ) {

    throw new Error(
      'Decision Engine did not complete successfully.'
    );

  }


  SpreadsheetApp.flush();


  /*
   * Read ONLY current decisions.
   */
  var currentKOLIds =
    KOL_IDS_PRODUCT_getCurrentKOLIds_(
      ss
    );

  var decisions =
    KOL_IDS_PRODUCT_readDecisions_(
      ss,
      {
        analysisId:
          analysisId,
        campaignId:
          campaignId,
        kolIds:
          currentKOLIds
      }
    );

  if (
    decisions.length === 0
  ) {

    throw new Error(
      'No decision rows generated for current analysis ' +
      analysisId +
      '.'
    );

  }


  /*
   * Canonical persona.
   */
  var persona =
    KOL_IDS_PRODUCT_getCanonicalPersona_(
      ss
    );


  /*
   * Build creator-facing report.
   */
  var report =
    KOL_IDS_PRODUCT_BUILD_REPORT({

      analysisId:
        analysisId,

      campaignId:
        campaignId,

      brandId:
        brandId,

      persona:
        persona

    });


  if (
    !report ||
    report.rows === 0
  ) {

    throw new Error(
      'No creator report rows generated.'
    );

  }


  /*
   * Current decision/report integrity.
   */
  var reportState =
    KOL_IDS_PRODUCT_UI_GET_REPORT();

  if (
    reportState.count !==
    decisions.length
  ) {

    throw new Error(
      'Current report/decision mismatch. ' +
      'DecisionRows=' +
      decisions.length +
      ', ReportRows=' +
      reportState.count
    );

  }


  SpreadsheetApp.flush();


  return {

    success: true,

    analysisId:
      analysisId,

    campaignId:
      campaignId,

    brandId:
      brandId,

    kolCount:
      kolCount,

    decisionRows:
      decisions.length,

    reportRows:
      report.rows,

    engine:
      engineResult,

    durationMs:
      KOL_IDS_PRODUCT_now_()
        .getTime() -
      startedAt.getTime()

  };

}


/* ==================================================
 * RECOVER CONTEXT FROM MEMORY
 * ================================================== */

function KOL_IDS_PRODUCT_recoverContextFromMemory_(
  ss,
  analysisId
) {

  var result = {
    campaignId: '',
    brandId: ''
  };

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.MEMORY
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    return result;
  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (values.length < 2) {
    return result;
  }

  var headers =
    values[0].map(
      function(h) {
        return KOL_IDS_PRODUCT_string_(h);
      }
    );

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  if (
    idx['Analysis ID'] === undefined
  ) {
    return result;
  }

  for (
    var i = values.length - 1;
    i >= 1;
    i--
  ) {

    var row =
      values[i];

    if (
      KOL_IDS_PRODUCT_string_(
        row[idx['Analysis ID']]
      ) !==
      analysisId
    ) {
      continue;
    }

    if (
      !result.campaignId &&
      idx['Campaign ID'] !== undefined
    ) {
      result.campaignId =
        KOL_IDS_PRODUCT_string_(
          row[idx['Campaign ID']]
        );
    }

    if (
      !result.brandId &&
      idx['Brand ID'] !== undefined
    ) {
      result.brandId =
        KOL_IDS_PRODUCT_string_(
          row[idx['Brand ID']]
        );
    }

    if (
      result.campaignId &&
      result.brandId
    ) {
      break;
    }

  }

  return result;
}


/* ==================================================
 * CANONICAL PERSONA READER
 * ================================================== */

function KOL_IDS_PRODUCT_getCanonicalPersona_(
  ss
) {

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.PERSONA
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {
    return null;
  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (
    values.length < 2
  ) {
    return null;
  }

  var headers =
    values[0].map(
      function(h) {
        return KOL_IDS_PRODUCT_string_(h);
      }
    );

  var idx =
    KOL_IDS_PRODUCT_headerIndex_(
      headers
    );

  var row =
    values[1];

  function KOL_IDS_PRODUCT_get(
    header
  ) {

    return idx[header] !==
      undefined
      ? row[idx[header]]
      : '';

  }

  return {

    id:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Persona ID')
      ),

    name:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Persona Name')
      ),

    ageMin:
      KOL_IDS_PRODUCT_num_(
        KOL_IDS_PRODUCT_get('Age Min'),
        0
      ),

    ageMax:
      KOL_IDS_PRODUCT_num_(
        KOL_IDS_PRODUCT_get('Age Max'),
        0
      ),

    gender:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Gender')
      ),

    locations:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Locations')
      ),

    interests:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Interests')
      ),

    behaviors:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Behaviors')
      ),

    description:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Description')
      ),

    brandFit:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Brand Fit')
      ),

    source:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Source')
      ),

    analysisId:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Analysis ID')
      ),

    campaignId:
      KOL_IDS_PRODUCT_string_(
        KOL_IDS_PRODUCT_get('Campaign ID')
      )

  };

}


/* ==================================================
 * GET PRODUCT STATE
 * ================================================== */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_UI_GET_STATE() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var kolCount =
    KOL_IDS_PRODUCT_countKOLs_(
      ss
    );

  var analysisId =
    KOL_IDS_PRODUCT_getActiveAnalysisId_(
      ss
    );

  var campaignId =
    KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.CAMPAIGN,
        [
          'Campaign ID',
          'campaignId',
          'ID'
        ]
      )
    );

  var brandId =
    KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.BRAND,
        [
          'Brand ID',
          'brandId',
          'ID'
        ]
      )
    );

  var decisions =
    KOL_IDS_PRODUCT_readDecisions_(
      ss,
      {
        analysisId:
          analysisId,
        campaignId:
          campaignId,
        kolIds:
          KOL_IDS_PRODUCT_getCurrentKOLIds_(
            ss
          )
      }
    );

  var persona =
    KOL_IDS_PRODUCT_getCanonicalPersona_(
      ss
    );

  return {

    success: true,

    product:
      'KOL Investment Decision System™',

    version:
      KOL_IDS_PRODUCT_VERSION,

    analysisId:
      analysisId,

    campaignId:
      campaignId,

    brandId:
      brandId,

    kolCount:
      kolCount,

    decisionRows:
      decisions.length,

    persona:
      persona,

    sheets: {

      kol:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.KOL
        ),

      decision:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.DECISION
        ),

      persona:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.PERSONA
        ),

      report:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.REPORT
        ),

      memory:
        !!ss.getSheetByName(
          KOL_IDS_PRODUCT_SHEETS.MEMORY
        )

    }

  };

}


/* ==================================================
 * GET REPORT
 * ================================================== */

function KOL_IDS_PRODUCT_UI_GET_REPORT_LEGACY_() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.REPORT
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {

    return {
      success: true,
      headers:
        KOL_IDS_PRODUCT_HEADERS.REPORT,
      rows: [],
      count: 0
    };

  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  if (values.length < 1) {
    return {
      success: true,
      headers: [],
      rows: [],
      count: 0
    };
  }

  var headers =
    values[0];

  var rows =
    values
      .slice(1)
      .filter(
        function(row) {

          return row.some(
            function(value) {

              return (
                KOL_IDS_PRODUCT_string_(
                  value
                ) !== ''
              );

            }
          );

        }
      );

  return {

    success: true,

    headers:
      headers,

    rows:
      rows,

    count:
      rows.length

  };

}


/* ==================================================
 * GET HISTORY
 * ================================================== */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_UI_GET_HISTORY() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var sheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.MEMORY
    );

  if (
    !sheet ||
    sheet.getLastRow() < 2
  ) {

    return {

      success: true,

      rows: [],

      count: 0

    };

  }

  var values =
    sheet
      .getDataRange()
      .getValues();

  return {

    success: true,

    headers:
      values[0],

    rows:
      values
        .slice(1)
        .filter(
          function(row) {

            return row.some(
              function(value) {

                return (
                  KOL_IDS_PRODUCT_string_(
                    value
                  ) !== ''
                );

              }
            );

          }
        ),

    count:
      Math.max(
        0,
        values.length - 1
      )

  };

}


/* ==================================================
 * EXPORT CURRENT
 * ================================================== */

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_UI_EXPORT_CURRENT() {

  var report =
    KOL_IDS_PRODUCT_UI_GET_REPORT();

  var headers =
    report.headers ||
    [];

  var rows =
    report.rows ||
    [];

  var json =
    JSON.stringify({

      exportedAt:
        new Date(),

      product:
        'KOL Investment Decision System™',

      version:
        KOL_IDS_PRODUCT_VERSION,

      analysisId:
        KOL_IDS_PRODUCT_getActiveAnalysisId_(
          KOL_IDS_PRODUCT_getSpreadsheet_()
        ),

      headers:
        headers,

      rows:
        rows

    });

  var csvRows = [];

  if (headers.length) {

    csvRows.push(
      headers
        .map(
          KOL_IDS_PRODUCT_csvEscape_
        )
        .join(',')
    );

  }

  rows.forEach(
    function(row) {

      csvRows.push(
        row
          .map(
            KOL_IDS_PRODUCT_csvEscape_
          )
          .join(',')
      );

    }
  );

  return {

    success: true,

    json:
      json,

    csv:
      csvRows.join('\n')

  };

}


function KOL_IDS_PRODUCT_csvEscape_(
  value
) {

  var text =
    KOL_IDS_PRODUCT_string_(
      value
    );

  return '"' +
    text
      .replace(
        /"/g,
        '""'
      ) +
    '"';

}


/* ==================================================
 * RESET NEW ANALYSIS
 *
 * History is preserved.
 * Current decision/report/KOL/persona data is cleared.
 * Brand/Campaign core sheets are deliberately preserved
 * because their schema/ownership belongs to the core layer.
 * ================================================== */

function KOL_IDS_PRODUCT_UI_RESET_NEW() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var analysisId =
    KOL_IDS_PRODUCT_uuid_(
      'AN'
    );

  KOL_IDS_PRODUCT_setActiveAnalysisId_(
    analysisId
  );

  [
    KOL_IDS_PRODUCT_SHEETS.KOL,
    KOL_IDS_PRODUCT_SHEETS.DECISION,
    KOL_IDS_PRODUCT_SHEETS.PERSONA,
    KOL_IDS_PRODUCT_SHEETS.REPORT
  ].forEach(
    function(name) {

      var sheet =
        ss.getSheetByName(
          name
        );

      if (
        sheet &&
        sheet.getLastRow() > 1
      ) {

        sheet
          .getRange(
            2,
            1,
            sheet.getLastRow() - 1,
            sheet.getLastColumn()
          )
          .clearContent();

      }

    }
  );

  SpreadsheetApp.flush();

  return {

    success: true,

    analysisId:
      analysisId,

    message:
      'New analysis workspace is ready. Previous workflow memory is preserved.'

  };

}


/* ==================================================
 * PRODUCT VALUE
 * ================================================== */

function KOL_IDS_PRODUCT_BUILD_VALUE() {

  var state =
    KOL_IDS_PRODUCT_UI_GET_STATE();

  var report =
    KOL_IDS_PRODUCT_UI_GET_REPORT();

  return {

    success: true,

    product:
      'KOL Investment Decision System™',

    version:
      KOL_IDS_PRODUCT_VERSION,

    value: {

      creatorsAnalyzed:
        state.kolCount,

      decisionsGenerated:
        state.decisionRows,

      reportRows:
        report.count,

      personaPersisted:
        !!state.persona,

      workflowMemory:
        true,

      decisionSource:
        'KBIS Decision Engine'

    }

  };

}


/* ==================================================
 * SAFE PRODUCT OPEN
 * ================================================== */

function KOL_IDS_PRODUCT_OPEN() {

  var url = '';

  try {
    url =
      ScriptApp
        .getService()
        .getUrl() ||
      '';
  }
  catch (e) {
    url = '';
  }

  return {

    success: true,

    url:
      url,

    state:
      KOL_IDS_PRODUCT_UI_GET_STATE()

  };

}


/* ==================================================
 * HOW TO USE
 * ================================================== */

function KOL_IDS_PRODUCT_OPEN_HOWTO() {

  return {

    success: true,

    steps: [

      '1. Enter Brand data.',
      '2. Enter Campaign data.',
      '3. Submit Persona when available.',
      '4. Submit KOL / Creator records.',
      '5. Product SAVE establishes the active Analysis ID.',
      '6. Product SAVE persists 04_KOL_DATABASE.',
      '7. Product RUN executes the Decision Engine.',
      '8. Only current-analysis/current-KOL Decision rows are read.',
      '9. Decisions are exposed through 07_KOL_DECISION.',
      '10. Creator report is generated from current Decision output.',
      '11. Workflow memory preserves Brand / Campaign / Persona / KOL context.',
      '12. Product Health validates structure and cross-stage integrity.'

    ]

  };

}


/* ==================================================
 * PRODUCT DIAGNOSTIC
 *
 * Detailed:
 * - Sheet
 * - Header
 * - Column
 * - Data
 * - Cross-stage IDs
 * ================================================== */

function KOL_IDS_PRODUCT_DIAGNOSTIC() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var errors = [];
  var warnings = [];
  var sheetDiagnostics = [];

  var requiredSheetHeaders = {

    '04_KOL_DATABASE':
      KOL_IDS_PRODUCT_FALLBACK_HEADERS.KOL,

    '07_KOL_DECISION':
      KOL_IDS_PRODUCT_FALLBACK_HEADERS.DECISION,

    '13_CANONICAL_PERSONA':
      KOL_IDS_PRODUCT_HEADERS.PERSONA,

    '14_CREATOR_REPORT':
      KOL_IDS_PRODUCT_HEADERS.REPORT,

    '15_WORKFLOW_MEMORY':
      KOL_IDS_PRODUCT_HEADERS.MEMORY

  };


  /*
   * 1. Sheet + Header diagnostics.
   */
  Object.keys(
    requiredSheetHeaders
  ).forEach(
    function(sheetName) {

      var sheet =
        ss.getSheetByName(
          sheetName
        );

      if (!sheet) {

        errors.push(
          'Missing sheet: ' +
          sheetName
        );

        sheetDiagnostics.push({
          sheet: sheetName,
          status: 'FAIL',
          error:
            'Sheet does not exist.'
        });

        return;

      }

      var expected =
        requiredSheetHeaders[
          sheetName
        ];

      var actual =
        sheet
          .getRange(
            1,
            1,
            1,
            Math.max(
              expected.length,
              sheet.getLastColumn()
            )
          )
          .getValues()[0]
          .map(
            function(h) {
              return KOL_IDS_PRODUCT_string_(h);
            }
          );

      var actualMap =
        KOL_IDS_PRODUCT_headerIndex_(
          actual
        );

      var missingHeaders = [];

      expected.forEach(
        function(header, expectedIndex) {

          var actualIndex =
            actualMap[header];

          if (
            actualIndex === undefined
          ) {

            missingHeaders.push({
              header: header,
              expectedColumn:
                expectedIndex + 1
            });

            errors.push(
              'Header mismatch: Sheet=' +
              sheetName +
              ', Column=' +
              (expectedIndex + 1) +
              ', Header="' +
              header +
              '" is missing.'
            );

          }

        }
      );

      sheetDiagnostics.push({
        sheet: sheetName,
        status:
          missingHeaders.length
            ? 'FAIL'
            : 'PASS',
        missingHeaders:
          missingHeaders
      });

    }
  );


  /*
   * 2. Current IDs.
   */
  var analysisId =
    KOL_IDS_PRODUCT_getActiveAnalysisId_(
      ss
    );

  var campaignId =
    KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.CAMPAIGN,
        [
          'Campaign ID',
          'campaignId',
          'ID'
        ]
      )
    );

  var brandId =
    KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.BRAND,
        [
          'Brand ID',
          'brandId',
          'ID'
        ]
      )
    );

  var recovered =
    KOL_IDS_PRODUCT_recoverContextFromMemory_(
      ss,
      analysisId
    );

  if (!campaignId) {
    campaignId =
      recovered.campaignId;
  }

  if (!brandId) {
    brandId =
      recovered.brandId;
  }


  /*
   * 3. KOL integrity.
   */
  var kolCount =
    KOL_IDS_PRODUCT_countKOLs_(
      ss
    );

  var currentKOLIds =
    KOL_IDS_PRODUCT_getCurrentKOLIds_(
      ss
    );

  if (
    kolCount === 0
  ) {

    warnings.push(
      '04_KOL_DATABASE contains no KOL records.'
    );

  }


  /*
   * 4. Decision integrity.
   */
  var decisions =
    KOL_IDS_PRODUCT_readDecisions_(
      ss,
      {
        analysisId:
          analysisId,
        campaignId:
          campaignId,
        kolIds:
          currentKOLIds
      }
    );

  var decisionRows =
    decisions.length;

  if (
    kolCount > 0 &&
    decisionRows === 0
  ) {

    warnings.push(
      'Current KOL data exists but no current Decision rows were found.'
    );

  }

  decisions.forEach(
    function(decision) {

      if (
        decision.kolId &&
        !currentKOLIds[
          decision.kolId
        ]
      ) {

        errors.push(
          'Decision references stale KOL ID: ' +
          decision.kolId
        );

      }

      if (
        campaignId &&
        decision.campaignId &&
        decision.campaignId !==
        campaignId
      ) {

        errors.push(
          'Decision Campaign ID mismatch: ' +
          'Expected=' +
          campaignId +
          ', Actual=' +
          decision.campaignId +
          ', KOL=' +
          decision.kolId
        );

      }

    }
  );


  /*
   * 5. Persona integrity.
   */
  var persona =
    KOL_IDS_PRODUCT_getCanonicalPersona_(
      ss
    );

  if (!persona) {

    warnings.push(
      'Canonical Persona has no records.'
    );

  }
  else {

    if (
      persona.analysisId &&
      persona.analysisId !==
      analysisId
    ) {

      errors.push(
        'Persona Analysis ID mismatch: ' +
        'Expected=' +
        analysisId +
        ', Actual=' +
        persona.analysisId
      );

    }

    if (
      campaignId &&
      persona.campaignId &&
      persona.campaignId !==
      campaignId
    ) {

      errors.push(
        'Persona Campaign ID mismatch: ' +
        'Expected=' +
        campaignId +
        ', Actual=' +
        persona.campaignId
      );

    }

  }


  /*
   * 6. Report integrity.
   */
  var report =
    KOL_IDS_PRODUCT_UI_GET_REPORT();

  if (
    decisionRows > 0 &&
    report.count === 0
  ) {

    errors.push(
      'No creator report rows generated for current decisions.'
    );

  }

  if (
    decisionRows > 0 &&
    report.count !==
    decisionRows
  ) {

    errors.push(
      'Report/Decision row mismatch: ' +
      'DecisionRows=' +
      decisionRows +
      ', ReportRows=' +
      report.count
    );

  }


  /*
   * Verify report IDs.
   */
  if (
    report.count > 0
  ) {

    var reportIdx =
      KOL_IDS_PRODUCT_headerIndex_(
        report.headers || []
      );

    report.rows.forEach(
      function(row, index) {

        var rowNumber =
          index + 2;

        var rowAnalysisId =
          reportIdx['Analysis ID'] !== undefined
            ? KOL_IDS_PRODUCT_string_(
                row[
                  reportIdx['Analysis ID']
                ]
              )
            : '';

        var rowKOLId =
          reportIdx['KOL ID'] !== undefined
            ? KOL_IDS_PRODUCT_string_(
                row[
                  reportIdx['KOL ID']
                ]
              )
            : '';

        if (
          rowAnalysisId &&
          rowAnalysisId !==
          analysisId
        ) {

          errors.push(
            'Report Analysis ID mismatch: ' +
            'Sheet=14_CREATOR_REPORT, Row=' +
            rowNumber +
            ', Column=' +
            (
              reportIdx['Analysis ID'] +
              1
            ) +
            ', Header="Analysis ID", Expected=' +
            analysisId +
            ', Actual=' +
            rowAnalysisId
          );

        }

        if (
          rowKOLId &&
          !currentKOLIds[rowKOLId]
        ) {

          errors.push(
            'Report references stale KOL ID: ' +
            rowKOLId
          );

        }

      }
    );

  }


  /*
   * 7. Memory integrity.
   */
  var memorySheet =
    ss.getSheetByName(
      KOL_IDS_PRODUCT_SHEETS.MEMORY
    );

  var currentMemoryRows = [];

  if (
    memorySheet &&
    memorySheet.getLastRow() >= 2
  ) {

    var memoryValues =
      memorySheet
        .getDataRange()
        .getValues();

    var memoryHeaders =
      memoryValues[0].map(
        function(h) {
          return KOL_IDS_PRODUCT_string_(h);
        }
      );

    var memoryIdx =
      KOL_IDS_PRODUCT_headerIndex_(
        memoryHeaders
      );

    currentMemoryRows =
      memoryValues
        .slice(1)
        .filter(
          function(row) {

            return (
              memoryIdx['Analysis ID'] !== undefined &&
              KOL_IDS_PRODUCT_string_(
                row[
                  memoryIdx['Analysis ID']
                ]
              ) ===
              analysisId
            );

          }
        );

    if (
      kolCount > 0 &&
      currentMemoryRows.length === 0
    ) {

      errors.push(
        'No workflow memory rows found for current Analysis ID: ' +
        analysisId
      );

    }

    currentMemoryRows.forEach(
      function(row) {

        var entityType =
          memoryIdx['Entity Type'] !== undefined
            ? KOL_IDS_PRODUCT_string_(
                row[
                  memoryIdx['Entity Type']
                ]
              )
            : '';

        var entityId =
          memoryIdx['Entity ID'] !== undefined
            ? KOL_IDS_PRODUCT_string_(
                row[
                  memoryIdx['Entity ID']
                ]
              )
            : '';

        if (
          entityType === 'PERSONA' &&
          persona &&
          entityId !== persona.id
        ) {

          errors.push(
            'Memory Persona Entity ID mismatch: ' +
            'Expected=' +
            persona.id +
            ', Actual=' +
            entityId
          );

        }

        if (
          entityType === 'CAMPAIGN' &&
          campaignId &&
          entityId !== campaignId
        ) {

          errors.push(
            'Memory Campaign Entity ID mismatch: ' +
            'Expected=' +
            campaignId +
            ', Actual=' +
            entityId
          );

        }

        if (
          entityType === 'BRAND' &&
          brandId &&
          entityId !== brandId
        ) {

          errors.push(
            'Memory Brand Entity ID mismatch: ' +
            'Expected=' +
            brandId +
            ', Actual=' +
            entityId
          );

        }

      }
    );

  }


  /*
   * 8. Cross-stage minimum checks.
   */
  if (
    kolCount > 0 &&
    decisionRows > 0
  ) {

    var decisionKOLSet = {};

    decisions.forEach(
      function(decision) {

        if (decision.kolId) {
          decisionKOLSet[
            decision.kolId
          ] = true;
        }

      }
    );

    Object.keys(
      currentKOLIds
    ).forEach(
      function(kolId) {

        if (
          !decisionKOLSet[kolId]
        ) {

          warnings.push(
            'Current KOL has no Decision row: ' +
            kolId
          );

        }

      }
    );

  }


  return {

    success:
      errors.length === 0,

    status:
      errors.length === 0
        ? 'PASS'
        : 'FAIL',

    product:
      'KOL Investment Decision System™',

    version:
      KOL_IDS_PRODUCT_VERSION,

    analysisId:
      analysisId,

    campaignId:
      campaignId,

    brandId:
      brandId,

    kolCount:
      kolCount,

    decisionRows:
      decisionRows,

    reportRows:
      report.count,

    persona:
      !!persona,

    currentMemoryRows:
      currentMemoryRows.length,

    sheetDiagnostics:
      sheetDiagnostics,

    errors:
      errors,

    warnings:
      warnings

  };

}


/* ==================================================
 * BACKWARD COMPATIBILITY
 * ================================================== */

function KOL_IDS_PRODUCT_getWorkflowMemory_() {

  var ss =
    KOL_IDS_PRODUCT_getSpreadsheet_();

  var history =
    KOL_IDS_PRODUCT_UI_GET_HISTORY();

  var persona =
    KOL_IDS_PRODUCT_getCanonicalPersona_(
      ss
    );

  var state =
    KOL_IDS_PRODUCT_UI_GET_STATE();

  return {

    success: true,

    brand:
      !!state.brandId,

    campaign:
      !!state.campaignId,

    persona:
      persona,

    selectedCreators:
      state.kolCount,

    creators:
      state.kolCount,

    decision:
      state.decisionRows,

    report:
      KOL_IDS_PRODUCT_UI_GET_REPORT(),

    history:
      history,

    learning:
      true,

    performance:
      true,

    benchmark:
      true

  };

}


/* ==================================================
 * OPTIONAL SAFE ALIASES
 * ================================================== */

function KOL_IDS_PRODUCT_getState() {
  return KOL_IDS_PRODUCT_UI_GET_STATE();
}


function KOL_IDS_PRODUCT_getReport() {
  return KOL_IDS_PRODUCT_UI_GET_REPORT();
}


function KOL_IDS_PRODUCT_getHistory() {
  return KOL_IDS_PRODUCT_UI_GET_HISTORY();
}


/* ==================================================
 * FINAL PRODUCT HEALTH
 * ================================================== */

function KOL_IDS_PRODUCT_HEALTH() {

  var diagnostic =
    KOL_IDS_PRODUCT_DIAGNOSTIC();

  return {

    success:
      diagnostic.success,

    status:
      diagnostic.status,

    product:
      'KOL Investment Decision System™',

    version:
      KOL_IDS_PRODUCT_VERSION,

    analysisId:
      diagnostic.analysisId,

    campaignId:
      diagnostic.campaignId,

    brandId:
      diagnostic.brandId,

    kolCount:
      diagnostic.kolCount,

    reportRows:
      diagnostic.reportRows,

    decisionRows:
      diagnostic.decisionRows,

    canonicalPersona:
      diagnostic.persona,

    currentMemoryRows:
      diagnostic.currentMemoryRows,

    sheetDiagnostics:
      diagnostic.sheetDiagnostics,

    errors:
      diagnostic.errors,

    warnings:
      diagnostic.warnings

  };

}

/* ==================================================
 * KOL IDS FINAL HOTFIX — CONTEXT RESTORE BEFORE RUN
 *
 * PURPOSE:
 * The Decision Engine is authoritative and reads the
 * active Campaign/Brand directly from row 2 of:
 *   03_CAMPAIGN
 *   02_BRAND_PROFILE
 *
 * SAVE already stores the normalized payload in
 * 15_WORKFLOW_MEMORY. If another layer leaves the core
 * sheets empty, restore the active context from that
 * durable memory immediately before the Engine runs.
 *
 * IMPORTANT:
 * This patch is intentionally appended at the END of the
 * file. It does not modify the Decision Engine.
 * ================================================== */

function KOL_IDS_PRODUCT_FINAL_HOTFIX_RESTORE_CONTEXT_() {
  var ss = KOL_IDS_PRODUCT_getSpreadsheet_();
  var analysisId = '';

  try {
    analysisId = KOL_IDS_PRODUCT_getActiveAnalysisId_(ss) || '';
  } catch (e) {
    analysisId = '';
  }

  if (!analysisId) {
    throw new Error('HOTFIX: Active Analysis ID is missing before RUN.');
  }

  var campaignId = '';
  var brandId = '';
  var brandPayload = {};
  var campaignPayload = {};

  /* --------------------------------------------------
   * 1. Read current canonical sheets first.
   * -------------------------------------------------- */
  try {
    campaignId = KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.CAMPAIGN,
        ['Campaign ID', 'campaignId', 'ID']
      )
    );
  } catch (e1) {}

  try {
    brandId = KOL_IDS_PRODUCT_string_(
      KOL_IDS_PRODUCT_getSheetFirstRowValue_(
        ss,
        KOL_IDS_PRODUCT_SHEETS.BRAND,
        ['Brand ID', 'brandId', 'ID']
      )
    );
  } catch (e2) {}

  /* --------------------------------------------------
   * 2. Recover exact saved payload from Workflow Memory.
   * -------------------------------------------------- */
  var memory = ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.MEMORY);
  if (memory && memory.getLastRow() >= 2) {
    var values = memory.getDataRange().getValues();
    var headers = values[0].map(function(h) {
      return String(h || '').trim();
    });

    var idx = {};
    headers.forEach(function(h, i) { idx[h] = i; });

    var analysisCol = idx['Analysis ID'];
    var stageCol = idx['Stage'];
    var payloadCol = idx['Payload JSON'];
    var campaignCol = idx['Campaign ID'];
    var brandCol = idx['Brand ID'];

    if (analysisCol !== undefined) {
      for (var r = values.length - 1; r >= 1; r--) {
        var row = values[r];
        if (String(row[analysisCol] || '').trim() !== analysisId) continue;

        if (!campaignId && campaignCol !== undefined) {
          campaignId = String(row[campaignCol] || '').trim();
        }
        if (!brandId && brandCol !== undefined) {
          brandId = String(row[brandCol] || '').trim();
        }

        var stage = stageCol !== undefined
          ? String(row[stageCol] || '').trim().toUpperCase()
          : '';

        if (payloadCol !== undefined && row[payloadCol]) {
          try {
            var parsed = JSON.parse(String(row[payloadCol]));
            if (stage === 'CAMPAIGN' && !Object.keys(campaignPayload).length) {
              campaignPayload = parsed || {};
            }
            if (stage === 'BRAND' && !Object.keys(brandPayload).length) {
              brandPayload = parsed || {};
            }
          } catch (parseErr) {}
        }
      }
    }
  }

  /* --------------------------------------------------
   * 3. Recover from durable UserProperties cache too.
   * -------------------------------------------------- */
  if (!campaignId || !brandId) {
    try {
      var cache = KOL_IDS_PRODUCT_readCurrentAnalysisCache_();
      if (cache && String(cache.analysisId || '') === analysisId) {
        campaignId = campaignId || String(cache.campaignId || '').trim();
        brandId = brandId || String(cache.brandId || '').trim();
      }
    } catch (cacheErr) {}
  }

  if (!campaignId) {
    throw new Error(
      'HOTFIX: Cannot restore Campaign ID for active analysis ' +
      analysisId + '. Workflow Memory and cache are both empty.'
    );
  }

  if (!brandId) {
    throw new Error(
      'HOTFIX: Cannot restore Brand ID for active analysis ' +
      analysisId + '. Workflow Memory and cache are both empty.'
    );
  }

  /* --------------------------------------------------
   * 4. Re-persist the complete context using the existing
   *    hardened writer when available.
   * -------------------------------------------------- */
  var payload = {
    analysisId: analysisId,
    campaignId: campaignId,
    brandId: brandId,
    brand: brandPayload || {},
    campaign: campaignPayload || {}
  };

  if (typeof KOL_IDS_PRODUCT_persistActiveContext_ === 'function') {
    KOL_IDS_PRODUCT_persistActiveContext_(
      ss,
      payload,
      analysisId,
      campaignId,
      brandId
    );
  } else {
    /* Fallback for deployments where the hardened helper
     * was not included. At minimum restore the IDs that
     * the authoritative Engine requires. */
    var campaignSheet = ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.CAMPAIGN);
    var brandSheet = ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.BRAND);

    if (!campaignSheet || !brandSheet) {
      throw new Error('HOTFIX: Canonical Brand/Campaign sheets are missing.');
    }

    campaignSheet.getRange(2, 1).setValue(campaignId);
    campaignSheet.getRange(2, 3).setValue(brandId);
    brandSheet.getRange(2, 1).setValue(brandId);
    SpreadsheetApp.flush();
  }

  /* --------------------------------------------------
   * 5. HARD VERIFY — read exactly what the Engine reads.
   * -------------------------------------------------- */
  var verifyCampaign = KOL_IDS_PRODUCT_string_(
    ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.CAMPAIGN)
      .getRange(2, 1)
      .getValue()
  );

  var verifyBrand = KOL_IDS_PRODUCT_string_(
    ss.getSheetByName(KOL_IDS_PRODUCT_SHEETS.BRAND)
      .getRange(2, 1)
      .getValue()
  );

  if (verifyCampaign !== campaignId) {
    throw new Error(
      'HOTFIX: 03_CAMPAIGN row 2 was not persisted. Expected=' +
      campaignId + ', Actual=' + verifyCampaign + '.'
    );
  }

  if (verifyBrand !== brandId) {
    throw new Error(
      'HOTFIX: 02_BRAND_PROFILE row 2 was not persisted. Expected=' +
      brandId + ', Actual=' + verifyBrand + '.'
    );
  }

  SpreadsheetApp.flush();

  return {
    success: true,
    analysisId: analysisId,
    campaignId: verifyCampaign,
    brandId: verifyBrand,
    source: '15_WORKFLOW_MEMORY/CACHE',
    verifiedAgainstEngineRow2: true
  };
}

/* --------------------------------------------------
 * Wrap the existing RUN function.
 *
 * We keep the original Product Run untouched. The wrapper
 * only guarantees canonical context immediately before it.
 * This also fixes WEB API SAVE_AND_RUN because that path
 * ultimately calls KOL_IDS_PRODUCT_RUN().
 * -------------------------------------------------- */
var KOL_IDS_FINAL_HOTFIX_ORIGINAL_RUN_ = KOL_IDS_PRODUCT_RUN;
KOL_IDS_PRODUCT_RUN = function() {
  KOL_IDS_PRODUCT_FINAL_HOTFIX_RESTORE_CONTEXT_();
  return KOL_IDS_FINAL_HOTFIX_ORIGINAL_RUN_();
};


/* ==================================================
 * COMPATIBILITY EXPORT/OPEN HELPERS
 * Canonical self-service endpoints call these helpers.
 * ================================================== */
function KOL_IDS_PRODUCT_UI_EXPORT_REPORT(type, format) {
  var report = KOL_IDS_PRODUCT_UI_GET_REPORT();
  var normalizedFormat = String(format || 'JSON').trim().toUpperCase();
  var normalizedType = String(type || 'CURRENT').trim().toUpperCase();
  var headers = report.headers || [];
  var rows = report.rows || [];
  var csvRows = headers.length ? [headers.map(KOL_IDS_PRODUCT_csvEscape_).join(',')] : [];
  rows.forEach(function(row){ csvRows.push(row.map(KOL_IDS_PRODUCT_csvEscape_).join(',')); });
  var payload = {success:true, reportType:normalizedType, format:normalizedFormat, exportedAt:new Date().toISOString(), product:'KOL Investment Decision System™', version:KOL_IDS_PRODUCT_VERSION, headers:headers, rows:rows, count:rows.length};
  if(normalizedFormat==='CSV') return {success:true, reportType:normalizedType, format:'CSV', filename:'kol-ids-report-'+Date.now()+'.csv', content:csvRows.join('\n'), csv:csvRows.join('\n'), count:rows.length};
  return {success:true, reportType:normalizedType, format:'JSON', filename:'kol-ids-report-'+Date.now()+'.json', content:JSON.stringify(payload), json:JSON.stringify(payload), count:rows.length};
}

function KOL_IDS_PRODUCT_UI_EXPORT_HISTORY(analysisId) {
  var history = KOL_IDS_PRODUCT_UI_GET_HISTORY();
  var id = String(analysisId || '').trim();
  var headers = history.headers || [];
  var rows = history.rows || [];
  if(id && headers.length) {
    var idx = headers.map(function(h){return String(h).trim().toLowerCase();}).indexOf('analysis id');
    if(idx >= 0) rows = rows.filter(function(r){return String(r[idx] == null ? '' : r[idx]).trim() === id;});
  }
  var csvRows = headers.length ? [headers.map(KOL_IDS_PRODUCT_csvEscape_).join(',')] : [];
  rows.forEach(function(row){ csvRows.push(row.map(KOL_IDS_PRODUCT_csvEscape_).join(',')); });
  var payload = {success:true, analysisId:id, exportedAt:new Date().toISOString(), headers:headers, rows:rows, count:rows.length};
  return {success:true, analysisId:id, filename:'kol-ids-history-'+(id||'all')+'-'+Date.now()+'.csv', csv:csvRows.join('\n'), json:JSON.stringify(payload), count:rows.length};
}

function KOL_IDS_PRODUCT_UI_OPEN_SHEET(name) {
  var sheetName = String(name || '').trim();
  if(!sheetName) throw new Error('Sheet name is required.');
  var ss = KOL_IDS_PRODUCT_getSpreadsheet_();
  var sheet = ss.getSheetByName(sheetName);
  if(!sheet) throw new Error('Sheet not found: ' + sheetName);
  ss.setActiveSheet(sheet);
  return {success:true, sheetName:sheetName, gid:sheet.getSheetId(), url:ss.getUrl()+'#gid='+sheet.getSheetId()};
}

/* ==================================================
 * LEGACY_V25.15 COMPATIBILITY BRIDGE
 * Legacy QA/helper names are mapped to the canonical Product Layer helpers.
 * No second implementation is introduced.
 * ================================================== */
function KOL_IDS_PRODUCT_text_(value){ return KOL_IDS_PRODUCT_string_(value); }
function KOL_IDS_PRODUCT_number_(value){
  if(value===null||value===undefined||value==='') return 0;
  var s=String(value).trim().replace(/,/g,'').toLowerCase(),mult=1;
  if(/k$/.test(s)){mult=1000;s=s.slice(0,-1);}else if(/m$/.test(s)){mult=1000000;s=s.slice(0,-1);}else if(/b$/.test(s)){mult=1000000000;s=s.slice(0,-1);}
  var n=Number(s);return isFinite(n)?n*mult:0;
}
function KOL_IDS_PRODUCT_normalizePercent_(value){
  if(value===null||value===undefined||value==='') return 0;
  var n=Number(String(value).trim().replace(/%/g,''));return isFinite(n)?n:0;
}
function KOL_IDS_PRODUCT_parseAgeRange_(value){
  if(typeof KOL_IDS_CORE_parseAgeRange_==='function') return KOL_IDS_CORE_parseAgeRange_(value);
  var m=String(value||'').match(/(\d+)\s*[-–]\s*(\d+)/);return m?{min:Number(m[1]),max:Number(m[2])}:null;
}
function KOL_IDS_PRODUCT_overlapScore_(a,b){
  var A=String(a||'').toLowerCase().split(/[,;|\s]+/).filter(Boolean),B=String(b||'').toLowerCase().split(/[,;|\s]+/).filter(Boolean);
  if(!A.length||!B.length)return 0;var set={};A.forEach(function(x){set[x]=true;});var hit=B.filter(function(x){return set[x];}).length;return Math.round(hit/Math.max(1,B.length)*100);
}
function KOL_IDS_PRODUCT_directBand_(value,min,max){var v=Number(value),a=Number(min),b=Number(max);if(!isFinite(v)||!isFinite(a)||!isFinite(b)||b<=a)return 0;return Math.max(0,Math.min(100,(v-a)/(b-a)*100));}
function KOL_IDS_PRODUCT_inverseBand_(value,min,max){return 100-KOL_IDS_PRODUCT_directBand_(value,min,max);}
function KOL_IDS_PRODUCT_readData_(sheet){if(!sheet||sheet.getLastRow()<2)return[];return sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues();}
function KOL_IDS_PRODUCT_saveAnalysisPayload_(payload){
  /*
   * NON-RECURSIVE DOWNSTREAM SAVE CONTRACT
   *
   * KOL_IDS_PRODUCT_SAVE() is the canonical persistence owner.  Calling
   * KOL_IDS_PRODUCT_SAVE() again from this helper creates an infinite
   * recursion (SAVE -> saveAnalysisPayload_ -> SAVE -> ...), which can
   * eventually surface as a generic Spreadsheet service failure.
   *
   * The outer SAVE already persists the canonical Brand/Campaign context,
   * KOL database, Persona and Workflow Memory.  This helper therefore only
   * validates the downstream payload and returns an acknowledgement.  It is
   * intentionally side-effect free so legacy/internal callers can keep the
   * helper name without creating a second persistence implementation.
   */
  if(!payload || typeof payload !== 'object'){
    throw new Error('Downstream analysis payload is required.');
  }
  var kols = Array.isArray(payload.kols) ? payload.kols : [];
  if(!kols.length){
    throw new Error('Downstream analysis payload contains no KOL records.');
  }
  return {
    success:true,
    saved:true,
    delegated:true,
    source:'KOL_IDS_PRODUCT_SAVE_CANONICAL',
    analysisId:KOL_IDS_PRODUCT_string_(payload.analysisId || payload.id),
    campaignId:KOL_IDS_PRODUCT_string_(payload.campaignId),
    brandId:KOL_IDS_PRODUCT_string_(payload.brandId),
    kolCount:kols.length
  };
}
function KOL_IDS_PRODUCT_RESET_NEW_(){return KOL_IDS_PRODUCT_UI_RESET_NEW();}


function KOL_IDS_PRODUCT_ENSURE_STRUCTURE() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PRODUCT_ENSURE_STRUCTURE', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_ENSURE_STRUCTURE, this, arguments);
}


function KOL_IDS_PRODUCT_SETUP() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PRODUCT_SETUP', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_SETUP, this, arguments);
}


function KOL_IDS_PRODUCT_SAVE() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PRODUCT_SAVE', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_SAVE, this, arguments);
}


function KOL_IDS_PRODUCT_RUN() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PRODUCT_RUN', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_RUN, this, arguments);
}


function KOL_IDS_PRODUCT_UI_GET_STATE() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PRODUCT_UI_GET_STATE', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_UI_GET_STATE, this, arguments);
}


function KOL_IDS_PRODUCT_UI_GET_HISTORY() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PRODUCT_UI_GET_HISTORY', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_UI_GET_HISTORY, this, arguments);
}


function KOL_IDS_PRODUCT_UI_EXPORT_CURRENT() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PRODUCT_UI_EXPORT_CURRENT', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PRODUCT_UI_EXPORT_CURRENT, this, arguments);
}
