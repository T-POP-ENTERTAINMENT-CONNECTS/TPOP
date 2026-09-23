/**
 * KOL IDS™ LEGACY_V25.13 — CANONICAL END-TO-END FLOW
 *
 * Design contract:
 * Campaign is the root context. Every later stage must consume the active
 * campaign context instead of creating an independent data island.
 *
 * Flow:
 * Campaign → Audience → KOL Persona/Analysis → Decision Parameters →
 * Review/Run → Business Impact → Reports/Evidence
 *
 * This patch is intentionally appended last so it becomes the final authority
 * for customer-facing self-service workflow endpoints.
 */
var KOL_IDS_CANONICAL_FLOW_VERSION = '25.13.0-canonical-flow';
var KOL_IDS_FLOW_CONTEXT_KEY_ = 'KOL_IDS_CANONICAL_FLOW_CONTEXT';

function KOL_IDS_FLOW_text_(v) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_text_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return String(v == null ? '' : v).trim(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_text_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_text_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_FLOW_array_(v) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_array_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (Array.isArray(v)) return v.map(KOL_IDS_FLOW_text_).filter(Boolean);
  if (v == null || v === '') return [];
  return String(v).split(/[,\n|]/).map(KOL_IDS_FLOW_text_).filter(Boolean);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_array_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_array_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_FLOW_json_(v, fallback) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_json_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try { return JSON.parse(v); } catch (e) { return fallback; }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_json_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_json_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_FLOW_props_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_props_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return PropertiesService.getUserProperties(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_props_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_props_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_FLOW_getContext_() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_getContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var props = KOL_IDS_FLOW_props_();
  var saved = KOL_IDS_FLOW_json_(props.getProperty(KOL_IDS_FLOW_CONTEXT_KEY_) || '', null);
  if (saved && typeof saved === 'object') return saved;
  return { analysisId:'', campaignId:'', brandId:'', brand:{}, campaign:{}, audience:{}, kols:[], decisionParameters:null, selectedCreators:[] };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_getContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_getContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_FLOW_setContext_(ctx) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_setContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_FLOW_props_().setProperty(KOL_IDS_FLOW_CONTEXT_KEY_, JSON.stringify(ctx || {}));
  return ctx;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_setContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_setContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_FLOW_latestMemory_(ss, analysisId, stage) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_latestMemory_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sheet = ss && ss.getSheetByName('15_WORKFLOW_MEMORY');
  if (!sheet || sheet.getLastRow() < 2) return null;
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;
  var headers = values[0].map(KOL_IDS_FLOW_text_);
  var idx = {};
  headers.forEach(function(h,i){ idx[h.toLowerCase()] = i; });
  if (idx['analysis id'] == null || idx['stage'] == null || idx['payload json'] == null) return null;
  for (var i=values.length-1;i>=1;i--) {
    if (KOL_IDS_FLOW_text_(values[i][idx['analysis id']]) !== KOL_IDS_FLOW_text_(analysisId)) continue;
    if (KOL_IDS_FLOW_text_(values[i][idx['stage']]).toUpperCase() !== String(stage || '').toUpperCase()) continue;
    return KOL_IDS_FLOW_json_(KOL_IDS_FLOW_text_(values[i][idx['payload json']]), null);
  }
  return null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_latestMemory_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_latestMemory_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_FLOW_writeStage_(ss, ctx, stage, entityType, entityId, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_writeStage_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if (!ss) throw new Error('Active customer workspace is unavailable.');
  var sheet = ss.getSheetByName('15_WORKFLOW_MEMORY');
  /*
   * 1.0.0 workflow persistence hardening:
   * 15_WORKFLOW_MEMORY is a runtime support sheet, not part of the legacy
   * core schema config. A fresh customer workspace can therefore legitimately
   * reach this writer without the sheet existing. Create it lazily here
   * instead of failing the Campaign save/Continue flow.
   */
  if (!sheet) {
    sheet = ss.insertSheet('15_WORKFLOW_MEMORY');
    sheet.getRange(1,1,1,9).setValues([[
      'Memory ID','Analysis ID','Campaign ID','Brand ID','Stage',
      'Entity Type','Entity ID','Payload JSON','Created At'
    ]]);
    sheet.setFrozenRows(1);
  }
  var lastCol = Math.max(9, sheet.getLastColumn());
  var headers = sheet.getRange(1,1,1,lastCol).getValues()[0].map(KOL_IDS_FLOW_text_);
  /*
   * Repair an incomplete runtime-created header row without rewriting
   * customer data. New columns are appended only when absent.
   */
  var requiredHeaders = ['Memory ID','Analysis ID','Campaign ID','Brand ID','Stage','Entity Type','Entity ID','Payload JSON','Created At','Updated At'];
  var headerSet = {};
  headers.forEach(function(h){ if (h) headerSet[h] = true; });
  var missingHeaders = requiredHeaders.filter(function(h){ return !headerSet[h]; });
  if (missingHeaders.length) {
    var start = headers.length + 1;
    sheet.getRange(1,start,1,missingHeaders.length).setValues([missingHeaders]);
    headers = headers.concat(missingHeaders);
  }
  var idx = {}; headers.forEach(function(h,i){ idx[h] = i; });
  var row = new Array(headers.length).fill('');
  function KOL_IDS_FLOW_put(h,v){ if (idx[h] !== undefined) row[idx[h]] = v == null ? '' : v; }
  var now = new Date();
  var json = JSON.stringify(payload || {});
  if (json.length > 45000) json = json.slice(0,45000) + '\n… [TRUNCATED FOR GOOGLE SHEETS CELL LIMIT]';
  KOL_IDS_FLOW_put('Memory ID', typeof KOL_IDS_PRODUCT_uuid_ === 'function' ? KOL_IDS_PRODUCT_uuid_('MEM') : 'MEM-' + Utilities.getUuid().slice(0,8));
  KOL_IDS_FLOW_put('Analysis ID', ctx.analysisId);
  KOL_IDS_FLOW_put('Campaign ID', ctx.campaignId);
  KOL_IDS_FLOW_put('Brand ID', ctx.brandId);
  KOL_IDS_FLOW_put('Stage', stage);
  KOL_IDS_FLOW_put('Entity Type', entityType);
  KOL_IDS_FLOW_put('Entity ID', entityId || '');
  KOL_IDS_FLOW_put('Payload JSON', json);
  KOL_IDS_FLOW_put('Created At', now);
  KOL_IDS_FLOW_put('Updated At', now);
  sheet.getRange(sheet.getLastRow()+1,1,1,headers.length).setValues([row]);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_writeStage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_writeStage_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_FLOW_validateCampaign_(p) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_validateCampaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  p = p || {};
  var brand = p.brand || {};
  var campaign = p.campaign || {};
  var brandName = KOL_IDS_FLOW_text_(p.brandName || brand.name);
  var campaignName = KOL_IDS_FLOW_text_(p.campaignName || campaign.name);
  var category = KOL_IDS_FLOW_text_(p.category || brand.category);
  var market = KOL_IDS_FLOW_text_(p.market || brand.market || campaign.market);
  var goal = KOL_IDS_FLOW_text_(p.goal || campaign.goal);
  var objectives = KOL_IDS_FLOW_array_(p.objectives || campaign.objectives || p.objective || campaign.objective);
  var budget = Number(String(p.budget != null ? p.budget : campaign.budget || '').replace(/,/g,''));
  if (!brandName) throw new Error('Brand name is required.');
  if (!campaignName) throw new Error('Campaign name is required.');
  if (!category) throw new Error('Category is required.');
  if (!market) throw new Error('Market is required.');
  if (!goal) throw new Error('Commercial goal is required.');
  if (!objectives.length) throw new Error('Select at least one campaign objective.');
  if (!isFinite(budget) || budget <= 0) throw new Error('Budget must be greater than 0.');
  if (!KOL_IDS_FLOW_text_(p.currency || campaign.currency)) throw new Error('Currency is required.');
  if (!KOL_IDS_FLOW_text_(p.startDate || campaign.startDate)) throw new Error('Start date is required.');
  if (!KOL_IDS_FLOW_text_(p.endDate || campaign.endDate)) throw new Error('End date is required.');
  if (!KOL_IDS_FLOW_text_(brand.positioning || p.positioning)) throw new Error('Brand positioning is required.');
  if (!KOL_IDS_FLOW_text_(brand.values || p.brandValues)) throw new Error('Brand values are required.');
  if (!KOL_IDS_FLOW_text_(brand.avoid || p.brandAvoid)) throw new Error('Brand avoid rules are required.');
  if (!KOL_IDS_FLOW_text_(brand.keyMessages || p.keyMessages)) throw new Error('Key messages are required.');
  return { brandName:brandName, campaignName:campaignName, category:category, market:market, goal:goal, objectives:objectives, budget:budget };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_validateCampaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_validateCampaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_FLOW_buildCampaignContext_(p, existing) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_FLOW_buildCampaignContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  existing = existing || {};
  var brandIn = p.brand || {};
  var campaignIn = p.campaign || {};
  var ctx = JSON.parse(JSON.stringify(existing));
  ctx.analysisId = KOL_IDS_FLOW_text_(p.analysisId || ctx.analysisId) || (typeof KOL_IDS_PRODUCT_uuid_ === 'function' ? KOL_IDS_PRODUCT_uuid_('AN') : 'AN-' + Utilities.getUuid().slice(0,8).toUpperCase());
  ctx.campaignId = KOL_IDS_FLOW_text_(p.campaignId || campaignIn.id || ctx.campaignId) || (typeof KOL_IDS_PRODUCT_uuid_ === 'function' ? KOL_IDS_PRODUCT_uuid_('CP') : 'CP-' + Utilities.getUuid().slice(0,8).toUpperCase());
  ctx.brandId = KOL_IDS_FLOW_text_(p.brandId || brandIn.id || ctx.brandId) || (typeof KOL_IDS_PRODUCT_uuid_ === 'function' ? KOL_IDS_PRODUCT_uuid_('BR') : 'BR-' + Utilities.getUuid().slice(0,8).toUpperCase());
  ctx.brand = Object.assign({}, ctx.brand || {}, brandIn, {
    id:ctx.brandId,
    name:KOL_IDS_FLOW_text_(brandIn.name || p.brandName || (ctx.brand||{}).name),
    category:KOL_IDS_FLOW_text_(brandIn.category || p.category || (ctx.brand||{}).category),
    market:KOL_IDS_FLOW_text_(brandIn.market || p.market || (ctx.brand||{}).market),
    positioning:KOL_IDS_FLOW_text_(brandIn.positioning || p.positioning || (ctx.brand||{}).positioning),
    promise:KOL_IDS_FLOW_text_(brandIn.promise || p.brandPromise || (ctx.brand||{}).promise),
    personality:KOL_IDS_FLOW_text_(brandIn.personality || p.brandPersonality || (ctx.brand||{}).personality),
    tone:KOL_IDS_FLOW_text_(brandIn.tone || p.brandTone || (ctx.brand||{}).tone),
    values:KOL_IDS_FLOW_text_(brandIn.values || p.brandValues || (ctx.brand||{}).values),
    avoid:KOL_IDS_FLOW_text_(brandIn.avoid || p.brandAvoid || (ctx.brand||{}).avoid),
    desiredPerception:KOL_IDS_FLOW_text_(brandIn.desiredPerception || p.desiredPerception || (ctx.brand||{}).desiredPerception),
    keyMessages:KOL_IDS_FLOW_text_(brandIn.keyMessages || p.keyMessages || (ctx.brand||{}).keyMessages),
    keywords:KOL_IDS_FLOW_text_(brandIn.keywords || p.keywords || [brandIn.promise,p.brandPromise,brandIn.keyMessages,p.keyMessages].filter(Boolean).join('\n'))
  });
  var objectives = KOL_IDS_FLOW_array_(campaignIn.objectives || p.objectives || campaignIn.objective || p.objective || (ctx.campaign||{}).objectives);
  ctx.campaign = Object.assign({}, ctx.campaign || {}, campaignIn, {
    id:ctx.campaignId,
    name:KOL_IDS_FLOW_text_(campaignIn.name || p.campaignName || (ctx.campaign||{}).name),
    goal:KOL_IDS_FLOW_text_(campaignIn.goal || p.goal || (ctx.campaign||{}).goal),
    objectives:objectives,
    primaryObjective:objectives[0] || KOL_IDS_FLOW_text_(campaignIn.primaryObjective || p.primaryObjective || ''),
    secondaryObjectives:objectives.slice(1),
    objectiveCount:objectives.length,
    objective:objectives[0] || KOL_IDS_FLOW_text_(campaignIn.objective || p.objective || ''),
    audience:KOL_IDS_FLOW_text_(campaignIn.audience || p.audience && p.audience.description || (ctx.campaign||{}).audience),
    budget:Number(String(campaignIn.budget != null ? campaignIn.budget : p.budget != null ? p.budget : (ctx.campaign||{}).budget || 0).replace(/,/g,'')) || 0,
    currency:KOL_IDS_FLOW_text_(campaignIn.currency || p.currency || (ctx.campaign||{}).currency || 'THB'),
    startDate:campaignIn.startDate || p.startDate || (ctx.campaign||{}).startDate || '',
    endDate:campaignIn.endDate || p.endDate || (ctx.campaign||{}).endDate || '',
    category:KOL_IDS_FLOW_text_(campaignIn.category || p.category || ctx.brand.category),
    subCategory:KOL_IDS_FLOW_text_(campaignIn.subCategory || p.subCategory || (ctx.campaign||{}).subCategory),
    campaignType:KOL_IDS_FLOW_text_(campaignIn.campaignType || p.campaignType || (ctx.campaign||{}).campaignType)
  });
  ctx.audience = Object.assign({}, ctx.audience || {}, (p.audience && typeof p.audience === 'object') ? p.audience : {}, {
    description:KOL_IDS_FLOW_text_(p.audience && p.audience.description || p.targetAudience || ctx.audience.description || ctx.campaign.audience),
    age:KOL_IDS_FLOW_text_(p.audience && p.audience.age || ctx.audience.age),
    gender:KOL_IDS_FLOW_text_(p.audience && p.audience.gender || ctx.audience.gender),
    location:KOL_IDS_FLOW_text_(p.audience && p.audience.location || ctx.audience.location),
    behavior:KOL_IDS_FLOW_text_(p.audience && p.audience.behavior || ctx.audience.behavior),
    goalsNeeds:KOL_IDS_FLOW_text_(p.audience && p.audience.goalsNeeds || ctx.audience.goalsNeeds),
    painPoints:KOL_IDS_FLOW_text_(p.audience && p.audience.painPoints || ctx.audience.painPoints),
    lifestyle:KOL_IDS_FLOW_text_(p.audience && p.audience.lifestyle || ctx.audience.lifestyle)
  });
  ctx.campaign.audience = ctx.audience.description;
  return ctx;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_FLOW_buildCampaignContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_FLOW_buildCampaignContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* Multi-objective validation replaces the legacy single-objective requirement. */
KOL_IDS_ENT_DATA_VALIDATE_ANALYSIS_ = function(payload) {
  var p=payload||{}, brand=p.brand||{}, campaign=p.campaign||{};
  var brandName=KOL_IDS_FLOW_text_(p.brandName||brand.name), campaignName=KOL_IDS_FLOW_text_(p.campaignName||campaign.name);
  var objectives=KOL_IDS_FLOW_array_(p.objectives||campaign.objectives||p.objective||campaign.objective);
  var kols=Array.isArray(p.kols)?p.kols:[];
  if(!brandName||!campaignName||!objectives.length) throw new Error('Brand, campaign, and at least one objective are required for a reliable analysis.');
  var names=kols.map(function(k){return KOL_IDS_FLOW_text_(k&&k.name).toLocaleLowerCase();}).filter(Boolean);
  if(!names.length) throw new Error('At least one Creator is required.');
  if(names.some(function(name,i){return names.indexOf(name)!==i;})) throw new Error('Creator names must be unique within an analysis.');
  return {success:true,creators:names.length,objectiveCount:objectives.length,objectives:objectives,checksum:typeof KOL_IDS_ENT_DATA_HASH_==='function'?KOL_IDS_ENT_DATA_HASH_({brand:brandName,campaign:campaignName,objectives:objectives,creators:names}):''};
};

/* Endpoint ownership note: V26_CANONICAL_STATE_ENGINE.gs is the sole owner of customer flow endpoints in this release.
 * This file retains the V25 flow helpers/contracts only. */
