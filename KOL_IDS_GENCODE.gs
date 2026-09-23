/**
 * KOL IDS — GEN CODE + ATTRIBUTION ENGINE
 *
 * Adds a canonical performance-marketing layer to the V26 state engine.
 * Creator -> unique code -> tracked conversion -> revenue -> commission -> ROI.
 *
 * This is intentionally platform-neutral: the system generates and stores codes
 * and accepts actual conversion data from the brand/e-commerce platform.
 * No fake orders or conversions are created by the engine.
 */
var KOL_IDS_GENCODE_GENCODE = Object.freeze({
  VERSION:'1.0.0',
  REGISTRY_KEY:'KOL_IDS_GENCODE_REGISTRY_V100',
  REGISTRY_SHEET:'ENT_GENCODE_REGISTRY',
  REGISTRY_HEADERS:['Code','Record JSON','Org ID','Brand ID','Campaign ID','Creator ID','Updated At']
});

function KOL_IDS_GENCODE_now_(){
  return new Date().toISOString();
}
function KOL_IDS_GENCODE_slug_(v){
  var s=KOL_IDS_GENCODE_text_(v).toUpperCase();
  s=s.normalize ? s.normalize('NFKD') : s;
  s=s.replace(/[^A-Z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  return s.slice(0,64);
}
function KOL_IDS_GENCODE_json_(v,fallback){
  if(v==null||v==='') return fallback;
  if(typeof v==='object') return KOL_IDS_GENCODE_clone_(v);
  try { return JSON.parse(String(v)); } catch(e) { return fallback; }
}
function KOL_IDS_GENCODE_text_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_text_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(v==null?'':v).trim();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_text_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_text_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var n=Number(v);return Number.isFinite(n)?n:0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_clone_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_clone_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return v==null?v:JSON.parse(JSON.stringify(v));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_clone_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_clone_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_props_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_props_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    return PropertiesService.getUserProperties();
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_props_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_props_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_sheet_(){
  var ss = typeof KOL_IDS_PRODUCT_getSpreadsheet_==='function'
    ? KOL_IDS_PRODUCT_getSpreadsheet_()
    : (typeof KOL_IDS_SYSTEM_getSpreadsheet_==='function' ? KOL_IDS_SYSTEM_getSpreadsheet_() : null);
  if(!ss) throw new Error('KOL IDS™: Active workspace is unavailable for Gen Code registry.');
  var sh = ss.getSheetByName(KOL_IDS_GENCODE_GENCODE.REGISTRY_SHEET);
  if(!sh) sh=ss.insertSheet(KOL_IDS_GENCODE_GENCODE.REGISTRY_SHEET);
  var h=KOL_IDS_GENCODE_GENCODE.REGISTRY_HEADERS;
  if(sh.getLastRow()===0){sh.getRange(1,1,1,h.length).setValues([h]);sh.setFrozenRows(1);}
  else if(sh.getLastColumn()<h.length){sh.insertColumnsAfter(sh.getLastColumn(),h.length-sh.getLastColumn());sh.getRange(1,1,1,h.length).setValues([h]);}
  return sh;
}
function KOL_IDS_GENCODE_registry_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_registry_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    var sh=KOL_IDS_GENCODE_sheet_(), last=sh.getLastRow(), out={};
    if(last>=2){
      var rows=sh.getRange(2,1,last-1,KOL_IDS_GENCODE_GENCODE.REGISTRY_HEADERS.length).getValues();
      rows.forEach(function(r){
        var code=KOL_IDS_GENCODE_text_(r[0]).toUpperCase();
        if(!code)return;
        var item=KOL_IDS_GENCODE_json_(String(r[1]||''),null);
        if(item&&typeof item==='object')out[code]=item;
      });
    }
    // One-time compatibility migration from the old per-user registry.
    if(!Object.keys(out).length){
      var legacy=KOL_IDS_GENCODE_json_(KOL_IDS_GENCODE_props_().getProperty(KOL_IDS_GENCODE_GENCODE.REGISTRY_KEY)||'',null);
      if(legacy&&typeof legacy==='object'&&Object.keys(legacy).length){
        KOL_IDS_GENCODE_saveRegistry_(legacy);
        out=legacy;
      }
    }
    return out;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_registry_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_registry_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_saveRegistry_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_saveRegistry_');
  var __kolIdsTraceStartedAt = Date.now();
  var lock=LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var sh=KOL_IDS_GENCODE_sheet_(), headers=KOL_IDS_GENCODE_GENCODE.REGISTRY_HEADERS;
    var existing=(typeof KOL_IDS_ARCH_readIndex_==='function')?KOL_IDS_ARCH_readIndex_(sh,1,2):{};
    var updates=[], inserts=[];
    Object.keys(r||{}).forEach(function(code){
      var item=r[code]; if(!item||typeof item!=='object')return;
      var row=[code,JSON.stringify(item),item.orgId||item.orgID||'',item.brandId||'',item.campaignId||'',item.creatorId||'',item.updatedAt||KOL_IDS_GENCODE_now_()];
      if(existing[code])updates.push({row:existing[code],values:row}); else inserts.push(row);
    });
    updates.forEach(function(x){sh.getRange(x.row,1,1,headers.length).setValues([x.values]);});
    if(inserts.length && typeof KOL_IDS_ARCH_batchAppend_==='function')KOL_IDS_ARCH_batchAppend_(sh,inserts); else inserts.forEach(function(row){sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]);});
    SpreadsheetApp.flush();
    return true;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_saveRegistry_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    try{if(lock.hasLock())lock.releaseLock();}catch(ignore){}
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_saveRegistry_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_codeExists_(registry,code){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_codeExists_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return !!registry[KOL_IDS_GENCODE_text_(code).toUpperCase()];
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_codeExists_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_codeExists_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_makeCode_(prefix,creator,campaignId,registry){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_makeCode_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var base=(KOL_IDS_GENCODE_slug_(prefix)||'KOL')+'_'+KOL_IDS_GENCODE_slug_(creator).slice(0,8);
  var seed=KOL_IDS_GENCODE_slug_(campaignId).slice(-6)||Utilities.getUuid().replace(/-/g,'').slice(0,6).toUpperCase();
  for(var i=0;i<100;i++){
    var suffix=(Utilities.getUuid().replace(/-/g,'').slice(0,4)+String(i)).slice(0,5).toUpperCase();
    var code=(base+'_'+seed+'_'+suffix).replace(/_+/g,'_').slice(0,40);
    if(!KOL_IDS_GENCODE_codeExists_(registry,code))return code;
  }
  throw new Error('Unable to generate a unique Creator Gen Code.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_makeCode_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_makeCode_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_getContext_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_getContext_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_CANONICAL_getContext_==='function')return KOL_IDS_CANONICAL_getContext_();
  throw new Error('V26 canonical state engine is required before Gen Code.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_getContext_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_getContext_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_mutate_(ctx,operation,stage,mutator){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_mutate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_CANONICAL_mutate_==='function')return KOL_IDS_CANONICAL_mutate_(ctx,operation,stage,mutator);
  throw new Error('V26 mutation engine is required before Gen Code.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_mutate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_mutate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_persist_(ctx,stage,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_persist_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(typeof KOL_IDS_CANONICAL_persist_==='function')KOL_IDS_CANONICAL_persist_(ctx,stage,payload);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_persist_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_persist_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GENCODE_refreshExpiryStatus_(codes){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_refreshExpiryStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var now=new Date();
  return (Array.isArray(codes)?codes:[]).map(function(c){
    var x=KOL_IDS_GENCODE_clone_(c)||{};
    if(x.status!=='PAUSED'&&x.expiresAt){
      var d=new Date(String(x.expiresAt)+'T23:59:59');
      if(!isNaN(d.getTime())&&now.getTime()>d.getTime())x.status='EXPIRED';
      else if(x.status==='EXPIRED')x.status='ACTIVE';
    }
    return x;
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_refreshExpiryStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_refreshExpiryStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GENCODE_result_(ctx,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_result_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return typeof KOL_IDS_CANONICAL_result_==='function'
    ? KOL_IDS_CANONICAL_result_(ctx,'GEN_CODE',data)
    : {success:true,ok:true,version:KOL_IDS_GENCODE_GENCODE.VERSION,
    registrySheet:KOL_IDS_GENCODE_GENCODE.REGISTRY_SHEET,context:KOL_IDS_GENCODE_clone_(ctx),data:data||null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_result_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_result_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GENCODE_normalizePlan_(payload,ctx){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_normalizePlan_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{};
  var plan=payload.plan&&typeof payload.plan==='object'?payload.plan:payload;
  var discountType=KOL_IDS_GENCODE_text_(plan.discountType||'PERCENT').toUpperCase();
  if(['PERCENT','FIXED','NONE'].indexOf(discountType)<0)throw new Error('Discount type must be PERCENT, FIXED, or NONE.');
  var discountValue=KOL_IDS_GENCODE_num_(plan.discountValue);
  var commissionRate=KOL_IDS_GENCODE_num_(plan.commissionRate);
  if(discountType==='PERCENT'&&(discountValue<0||discountValue>100))throw new Error('Percent discount must be between 0 and 100.');
  if(discountType==='FIXED'&&discountValue<0)throw new Error('Fixed discount cannot be negative.');
  if(commissionRate<0||commissionRate>100)throw new Error('Commission rate must be between 0 and 100.');
  var startDate=KOL_IDS_GENCODE_text_(plan.startDate||ctx.campaign&&ctx.campaign.startDate||'');
  var endDate=KOL_IDS_GENCODE_text_(plan.endDate||ctx.campaign&&ctx.campaign.endDate||'');
  var validityMode=KOL_IDS_GENCODE_text_(plan.validityMode||'DAYS').toUpperCase();
  if(['DAYS','CAMPAIGN_END','CUSTOM_DATE'].indexOf(validityMode)<0)validityMode='DAYS';
  var validityDays=Math.max(1,Math.floor(KOL_IDS_GENCODE_num_(plan.validityDays||30)));
  if(validityMode==='DAYS'&&validityDays>3650)throw new Error('Code validity cannot exceed 3650 days.');
  var customExpiry=KOL_IDS_GENCODE_text_(plan.expiresAt||'');
  var generatedAt=KOL_IDS_GENCODE_now_();
  var expiresAt='';
  if(validityMode==='CAMPAIGN_END'){
    expiresAt=endDate||'';
    if(!expiresAt)throw new Error('Campaign End validity requires an End date.');
  }else if(validityMode==='CUSTOM_DATE'){
    expiresAt=customExpiry;
    if(!expiresAt)throw new Error('Custom expiry requires an expiry date.');
  }else{
    var baseDate=startDate?new Date(startDate+'T00:00:00'):new Date(generatedAt);
    if(isNaN(baseDate.getTime()))baseDate=new Date(generatedAt);
    baseDate.setDate(baseDate.getDate()+validityDays);
    expiresAt=Utilities.formatDate(baseDate,Session.getScriptTimeZone()||'Asia/Bangkok','yyyy-MM-dd');
  }
  if(expiresAt&&startDate&&expiresAt<startDate)throw new Error('Code expiry cannot be before the Start date.');
  return {
    enabled:plan.enabled!==false,
    prefix:KOL_IDS_GENCODE_slug_(plan.prefix||'KOL'),
    discountType:discountType,
    discountValue:discountValue,
    commissionRate:commissionRate,
    startDate:startDate,
    endDate:endDate,
    validityMode:validityMode,
    validityDays:validityDays,
    expiresAt:expiresAt,
    maxUses:Math.max(0,Math.floor(KOL_IDS_GENCODE_num_(plan.maxUses))),
    attributionWindowDays:Math.max(0,Math.floor(KOL_IDS_GENCODE_num_(plan.attributionWindowDays||30))),
    notes:KOL_IDS_GENCODE_text_(plan.notes),
    savedAt:KOL_IDS_GENCODE_now_()
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_normalizePlan_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_normalizePlan_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_SELF_SAVE_GEN_CODES(payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_SELF_SAVE_GEN_CODES');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('SAVE_GEN_CODES',true,function(){
    KOL_IDS_SELF_ROUTE_();
    payload=payload||{};
    var ctx=KOL_IDS_GENCODE_getContext_();
    if(!ctx.analysisId||!ctx.campaignId||!ctx.brandId)throw new Error('Campaign context is incomplete.');
    if(!ctx.selection||!Array.isArray(ctx.selection.creators)||!ctx.selection.creators.length)throw new Error('Select at least one Creator before generating Gen Codes.');
    if(typeof KOL_IDS_CANONICAL_markStale_==='function')KOL_IDS_CANONICAL_markStale_(ctx,'GEN_CODE');
    var plan=KOL_IDS_GENCODE_normalizePlan_(payload,ctx);
    var selected=ctx.selection.creators.map(function(k){var c=KOL_IDS_GENCODE_clone_(k);c.creatorId=String(c.creatorId||c.id||'').trim();if(!c.creatorId)throw new Error('Creator ID is required in canonical selection.');return c;});
    var registry=KOL_IDS_GENCODE_registry_();
    var existing=ctx.genCodes&&Array.isArray(ctx.genCodes.codes)?ctx.genCodes.codes:[];
    var byCreator={}; existing.forEach(function(x){var cid=String(x&&x.creatorId||'').trim();if(cid)byCreator[cid]=x;});
    var forceNew=payload.forceNew===true;
    var codes=selected.map(function(k){
      var creatorId=String(k&&((k.creatorId||k.id)||'')).trim();
      if(!creatorId)throw new Error('Creator ID is required before generating a Gen Code.');
      var name=KOL_IDS_GENCODE_text_(k.name);
      if(!forceNew&&byCreator[creatorId]){
        var keep=KOL_IDS_GENCODE_clone_(byCreator[creatorId]);
        keep.creatorId=creatorId;
        keep.planSnapshot=KOL_IDS_GENCODE_clone_(plan);
        keep.startDate=plan.startDate;
        keep.endDate=plan.endDate;
        keep.validityMode=plan.validityMode;
        keep.validityDays=plan.validityDays;
        keep.expiresAt=plan.expiresAt;
        keep.updatedAt=KOL_IDS_GENCODE_now_();
        registry[KOL_IDS_GENCODE_text_(keep.code).toUpperCase()]=keep;
        return keep;
      }
      var code=KOL_IDS_GENCODE_makeCode_(plan.prefix,name,ctx.campaignId,registry);
      var item={
        id:'GC-'+Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase(),
        code:code,
        creatorId:creatorId,
        creatorName:name,
        platform:k.platform||'',
        campaignId:ctx.campaignId,
        analysisId:ctx.analysisId,
        brandId:ctx.brandId,
        discountType:plan.discountType,
        discountValue:plan.discountValue,
        commissionRate:plan.commissionRate,
        startDate:plan.startDate,
        endDate:plan.endDate,
        validityMode:plan.validityMode,
        validityDays:plan.validityDays,
        expiresAt:plan.expiresAt,
        maxUses:plan.maxUses,
        attributionWindowDays:plan.attributionWindowDays,
        uses:0,
        orders:0,
        conversions:0,
        revenue:0,
        newCustomers:0,
        commission:0,
        status:plan.enabled?'ACTIVE':'PAUSED',
        planSnapshot:KOL_IDS_GENCODE_clone_(plan),
        createdAt:KOL_IDS_GENCODE_now_(),
        updatedAt:KOL_IDS_GENCODE_now_()
      };
      registry[code]=item;
      return item;
    });
    var next=KOL_IDS_GENCODE_mutate_(ctx,'SAVE_GEN_CODES','GEN_CODE',function(c){
      c.genCodePlan=plan;
      c.genCodes={codes:codes,generatedAt:KOL_IDS_GENCODE_now_(),forceNew:forceNew};
      return c;
    });
    KOL_IDS_GENCODE_saveRegistry_(registry);
    KOL_IDS_GENCODE_persist_(next,'Gen Code',next.genCodes);
    return KOL_IDS_GENCODE_result_(next,{plan:plan,codes:codes,count:codes.length,recalculationRequired:next.meta.staleStages||[]});
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_SELF_SAVE_GEN_CODES', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_SELF_SAVE_GEN_CODES', Date.now() - __kolIdsTraceStartedAt);
  }
};

function KOL_IDS_SELF_GET_GEN_CODES(){
  return KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_('GET_GEN_CODES',false,function(){
    KOL_IDS_SELF_ROUTE_();
    var ctx=KOL_IDS_GENCODE_getContext_();
    var codes=KOL_IDS_GENCODE_refreshExpiryStatus_(ctx.genCodes&&ctx.genCodes.codes||[]);
    return KOL_IDS_GENCODE_result_(ctx,{plan:ctx.genCodePlan||null,codes:codes});
  });
}

/* SAVE_PERFORMANCE ownership is centralized in 1.0.0 attribution hardening. */

/* GET_STATE ownership is centralized in V26 canonical state engine. */

function KOL_IDS_GENCODE_HEALTH(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GENCODE_HEALTH');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var started=Date.now();
  var out={
    success:false,
    status:'UNKNOWN',
    version:KOL_IDS_GENCODE_GENCODE.VERSION,
    registrySheet:KOL_IDS_GENCODE_GENCODE.REGISTRY_SHEET,
    codeCount:0,
    hasPlan:false,
    checks:{},
    warnings:[],
    errors:[],
    durationMs:0
  };

  try{
    /* 1) Canonical context */
    var c=KOL_IDS_GENCODE_getContext_();
    out.checks.context={status:'GREEN',message:'V26 canonical context loaded.'};

    /* 2) Registry */
    var registry=KOL_IDS_GENCODE_registry_();
    var registryOk=registry&&typeof registry==='object'&&!Array.isArray(registry);
    out.checks.registry={
      status:registryOk?'GREEN':'RED',
      message:registryOk?'Gen Code registry is readable.':'Gen Code registry is invalid.',
      entryCount:registryOk?Object.keys(registry).length:0
    };
    if(!registryOk)out.errors.push('Gen Code registry is invalid.');

    /* 3) Current Gen Code state */
    var codes=c.genCodes&&Array.isArray(c.genCodes.codes)?c.genCodes.codes:[];
    out.codeCount=codes.length;
    out.hasPlan=!!c.genCodePlan;
    out.checks.data={
      status:'GREEN',
      message:codes.length?'Gen Code data is available.':'No Gen Codes exist yet; this is a valid empty state.',
      codeCount:codes.length,
      hasPlan:out.hasPlan
    };

    /* 4) Validity / expiry engine */
    var refreshed=KOL_IDS_GENCODE_refreshExpiryStatus_(codes);
    var validityOk=Array.isArray(refreshed);
    var expired=0;
    refreshed.forEach(function(x){
      if(x&&x.status==='EXPIRED')expired++;
    });
    out.checks.validity={
      status:validityOk?'GREEN':'RED',
      message:validityOk?'Validity and expiry status engine is operational.':'Validity engine returned an invalid result.',
      expiredCount:expired
    };
    if(!validityOk)out.errors.push('Validity engine returned an invalid result.');

    /* 5) Function dependencies */
    var deps={
      canonicalContext:typeof KOL_IDS_CANONICAL_getContext_==='function',
      canonicalMutation:typeof KOL_IDS_CANONICAL_mutate_==='function',
      canonicalResult:typeof KOL_IDS_CANONICAL_result_==='function',
      runtimeExecutor:typeof KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_==='function',
      selfRoute:typeof KOL_IDS_SELF_ROUTE_==='function'
    };
    var missing=[];
    Object.keys(deps).forEach(function(k){if(!deps[k])missing.push(k);});
    out.checks.dependencies={
      status:missing.length?'RED':'GREEN',
      message:missing.length?'Required Gen Code dependencies are missing.':'Required Gen Code dependencies are loaded.',
      missing:missing
    };
    if(missing.length)out.errors.push('Missing dependencies: '+missing.join(', '));

    /* Final */
    out.success=out.errors.length===0;
    out.status=out.success?'GREEN':'RED';
    out.durationMs=Date.now()-started;

    Logger.log('========================================');
    Logger.log('KOL IDS GENCODE HEALTH');
    Logger.log('========================================');
    Logger.log('VERSION: '+out.version);
    Logger.log('[1] CANONICAL CONTEXT: '+out.checks.context.status);
    Logger.log('[2] REGISTRY: '+out.checks.registry.status+' | entries='+out.checks.registry.entryCount);
    Logger.log('[3] GENCODE DATA: '+out.checks.data.status+' | codes='+out.codeCount+' | hasPlan='+out.hasPlan);
    Logger.log('[4] VALIDITY ENGINE: '+out.checks.validity.status+' | expired='+out.checks.validity.expiredCount);
    Logger.log('[5] DEPENDENCIES: '+out.checks.dependencies.status);
    if(out.checks.dependencies.missing.length)Logger.log('    MISSING: '+out.checks.dependencies.missing.join(', '));
    if(out.warnings.length)Logger.log('WARNINGS: '+out.warnings.join(' | '));
    if(out.errors.length)Logger.log('ERRORS: '+out.errors.join(' | '));
    Logger.log('========================================');
    Logger.log('FINAL STATUS: '+out.status);
    Logger.log('Duration: '+out.durationMs+' ms');
    Logger.log('========================================');
    return out;
  }catch(e){
    out.status='RED';
    out.errors.push(String(e&&e.message||e));
    out.durationMs=Date.now()-started;
    Logger.log('========================================');
    Logger.log('KOL IDS GENCODE HEALTH');
    Logger.log('FINAL STATUS: RED');
    Logger.log('ERROR: '+out.errors.join(' | '));
    Logger.log('Duration: '+out.durationMs+' ms');
    Logger.log('========================================');
    return out;
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GENCODE_HEALTH', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GENCODE_HEALTH', Date.now() - __kolIdsTraceStartedAt);
  }
}
