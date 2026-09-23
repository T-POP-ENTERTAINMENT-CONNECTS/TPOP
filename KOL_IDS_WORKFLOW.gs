/*
 * KOL IDS — Enterprise Workflow Orchestrator
 *
 * Canonical workflow state lives in Sheets.  This module never deletes an
 * operational record: changed selections supersede downstream rows and are
 * rebuilt deterministically.  That makes retries safe and preserves audit
 * evidence for high-value campaign decisions.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, { IDEMPOTENCY_SHEET: 'ENT_IDEMPOTENCY' });

function KOL_IDS_WORKFLOW_headers_(ss, sheet, headers) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_headers_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_CORE_ensureColumns_(ss, sheet, headers);
  return KOL_IDS_CORE_colMap_(ss.getSheetByName(sheet));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_headers_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_headers_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_values_(sheet) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_values_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return KOL_IDS_CORE_values_(sheet); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_values_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_values_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_id_(prefix) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_id_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return prefix + '-' + Utilities.getUuid().slice(0, 12).toUpperCase(); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_id_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_id_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_stringIds_(ids) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_stringIds_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var seen = {}, out = [];
  (ids || []).forEach(function(id) { id = String(id || '').trim(); if (id && !seen[id]) { seen[id] = true; out.push(id); } });
  return out;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_stringIds_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_stringIds_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_hash_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_hash_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value));
  return bytes.map(function(b) { var n = b < 0 ? b + 256 : b; return ('0' + n.toString(16)).slice(-2); }).join('');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_hash_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_hash_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_ensure_(ss) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_ensure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_WORKFLOW_headers_(ss, 'ENT_CAMPAIGNS', ['Workflow Version','Selection Version','State Version','Updated At','Last Reprocess At','Last Idempotency Key']);
  KOL_IDS_WORKFLOW_headers_(ss, 'ENT_PERFORMANCE', ['Workflow Version','Selection Version','Updated At','Superseded At','Superseded Reason']);
  var sh = ss.getSheetByName(KOL_IDS.IDEMPOTENCY_SHEET);
  if (!sh) sh = ss.insertSheet(KOL_IDS.IDEMPOTENCY_SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(['Idempotency Key','Operation','Campaign ID','Request Hash','Result JSON','Created At']);
  return sh;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_ensure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_ensure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_idempotent_(ss, operation, campaignId, key, request, work) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_idempotent_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh = KOL_IDS_WORKFLOW_ensure_(ss), safeKey = String(key || '').trim();
  if (!safeKey) return work();
  if (safeKey.length > 160) throw new Error('Idempotency key is too long.');
  var rows = KOL_IDS_WORKFLOW_values_(sh), existing = rows.find(function(r) { return String(r[0]) === safeKey && String(r[1]) === operation; });
  var requestHash = KOL_IDS_WORKFLOW_hash_(JSON.stringify(request || {}));
  if (existing) {
    if (String(existing[3]) !== requestHash) throw new Error('Idempotency key was already used with a different request.');
    var replay = JSON.parse(String(existing[4] || '{}')); replay.idempotentReplay = true; return replay;
  }
  var result = work();
  sh.appendRow([safeKey, operation, campaignId, requestHash, JSON.stringify(result), new Date()]);
  return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_idempotent_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_idempotent_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_campaign_(ss, campaignId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_campaign_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh = ss.getSheetByName('ENT_CAMPAIGNS'), rows = KOL_IDS_WORKFLOW_values_(sh), index = rows.findIndex(function(r) { return String(r[0]) === String(campaignId); });
  if (index < 0) throw new Error('Campaign not found.');
  return { sh: sh, rows: rows, index: index, row: rows[index], map: KOL_IDS_CORE_colMap_(sh) };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_campaign_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_campaign_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_put_(sheet, index, row) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_put_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 sheet.getRange(index + 2, 1, 1, row.length).setValues([row]); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_put_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_put_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_getWorkflow(token, campaignId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_getWorkflow');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c = KOL_IDS_CORE_ctx_(token), ss = c.ss; KOL_IDS_WORKFLOW_ensure_(ss); var campaign = KOL_IDS_WORKFLOW_campaign_(ss, campaignId);
  var selected = KOL_IDS_CORE_getSelectedCreators_(ss, campaignId), creators = KOL_IDS_WORKFLOW_values_(ss.getSheetByName('ENT_CREATORS'));
  var creatorMap = {}; creators.forEach(function(r) { creatorMap[String(r[0])] = r; });
  var pm = KOL_IDS_CORE_colMap_(KOL_IDS_PA_legacyProjection_(ss));
  /* Only active tracking rows belong to the canonical selection. Historical
     superseded rows stay in Sheets for audit, but must never leak back into
     Step 6/7 after a creator is removed and later re-added. */
  var performance = KOL_IDS_WORKFLOW_values_(KOL_IDS_PA_legacyProjection_(ss)).filter(function(r) {
    return String(r[pm['Campaign ID'] != null ? pm['Campaign ID'] : 1]) === String(campaignId) &&
      String(pm['Status'] != null ? r[pm['Status']] : '').toUpperCase() !== 'SUPERSEDED';
  });
  var m = campaign.map, value = function(h, fallback) { return m[h] != null ? campaign.row[m[h]] : fallback; };
  return { success:true, version:KOL_IDS.VERSION, campaignId:String(campaignId), campaignName:campaign.row[1], selectedCreatorIds:selected,
    selectedCreators:selected.map(function(id) {
      var r=creatorMap[id] || [], p=performance.filter(function(x) { return String(x[pm['Creator ID'] != null ? pm['Creator ID'] : 2]) === id; }).sort(function(a,b) {
        return new Date(pm['Updated At'] != null ? b[pm['Updated At']] : 0) - new Date(pm['Updated At'] != null ? a[pm['Updated At']] : 0);
      })[0] || [];
      var pv=function(header, fallback) { return pm[header] != null ? p[pm[header]] : fallback; };
      return {id:id,name:r[1] || id,platform:r[2] || '',category:r[12] || '',performanceStatus:pv('Status','WAITING_FOR_PERFORMANCE'),
        performance:{spend:pv('Spend',''),reach:pv('Reach',''),impressions:pv('Impressions',''),views:pv('Views',''),likes:pv('Likes',''),comments:pv('Comments',''),shares:pv('Shares',''),saves:pv('Saves',''),engagements:pv('Engagements',''),clicks:pv('Clicks',''),conversions:pv('Conversions',''),revenue:pv('Revenue',''),evidence:pv('Evidence','LIMITED'),notes:pv('Notes',''),reportedDate:pv('Reported Date','')}
      };
    }),
    workflowVersion:Number(value('Workflow Version', 1) || 1), selectionVersion:Number(value('Selection Version', 0) || 0), stateVersion:Number(value('State Version', 1) || 1), status:value('Status','PLANNING'), updatedAt:value('Updated At','') };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_getWorkflow', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_getWorkflow', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_setSelection(token, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_setSelection');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload = payload || {}; var campaignId = String(payload.campaignId || '').trim(); if (!campaignId) throw new Error('Campaign is required.');
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try { var c = KOL_IDS_CORE_ctx_(token), ss = c.ss;
    return KOL_IDS_WORKFLOW_idempotent_(ss, 'SET_SELECTION', campaignId, payload.idempotencyKey, payload, function() {
      var campaign = KOL_IDS_WORKFLOW_campaign_(ss, campaignId), ids = KOL_IDS_WORKFLOW_stringIds_(payload.creatorIds);
      if (!ids.length) throw new Error('Select at least one Creator before continuing.');
      var decisions = KOL_IDS_WORKFLOW_values_(ss.getSheetByName('ENT_DECISIONS')), valid = {};
      decisions.forEach(function(r) { if (String(r[1]) === campaignId) valid[String(r[2])] = true; });
      ids.forEach(function(id) { if (!valid[id]) throw new Error('Creator ' + id + ' has not been analyzed for this Campaign. Re-run Decision first.'); });
      var m = campaign.map, previous = KOL_IDS_CORE_getSelectedCreators_(ss, campaignId), changed = previous.join('|') !== ids.join('|'), now = new Date();
      campaign.row[m['Selected Creator IDs']] = ids.join(',');
      if (m['Status'] != null) campaign.row[m['Status']] = 'SELECTED';
      if (m['Decision Status'] != null) campaign.row[m['Decision Status']] = 'SELECTED';
      if (m['Selection Version'] != null) campaign.row[m['Selection Version']] = Number(campaign.row[m['Selection Version']] || 0) + (changed ? 1 : 0);
      if (m['Workflow Version'] != null) campaign.row[m['Workflow Version']] = Number(campaign.row[m['Workflow Version']] || 1) + (changed ? 1 : 0);
      if (m['State Version'] != null) campaign.row[m['State Version']] = Number(campaign.row[m['State Version']] || 1) + 1;
      if (m['Updated At'] != null) campaign.row[m['Updated At']] = now;
      if (m['Last Reprocess At'] != null) campaign.row[m['Last Reprocess At']] = now;
      if (m['Last Idempotency Key'] != null) campaign.row[m['Last Idempotency Key']] = String(payload.idempotencyKey || '');
      KOL_IDS_WORKFLOW_put_(campaign.sh, campaign.index, campaign.row);
      KOL_IDS_WORKFLOW_syncPerformance_(ss, campaignId, ids, now);
      KOL_IDS_CORE_audit_(ss, 'V16_SET_SELECTION', campaignId, 'OK', 'Selection v' + (campaign.row[m['Selection Version']] || 0) + ': ' + ids.join(','));
      return {success:true,campaignId:campaignId,campaignName:campaign.row[m['Campaign Name']!=null?m['Campaign Name']:1],creatorIds:ids,count:ids.length,changed:changed,selectionVersion:Number(campaign.row[m['Selection Version']] || 0),workflowVersion:Number(campaign.row[m['Workflow Version']] || 1),reprocessed:true};
    });
  } finally { lock.releaseLock(); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_setSelection', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_setSelection', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_syncPerformance_(ss, campaignId, ids, now) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_syncPerformance_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_PA_legacyProjection_(ss), rows=KOL_IDS_WORKFLOW_values_(sh), pm=KOL_IDS_CORE_colMap_(sh), creators=KOL_IDS_WORKFLOW_values_(ss.getSheetByName('ENT_CREATORS')), cm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CAMPAIGNS'));
  var camp=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CAMPAIGNS'),campaignId), currency=camp && cm['Currency']!=null ? camp[cm['Currency']] || 'THB' : 'THB';
  rows.forEach(function(row,index) { var id=String(row[pm['Creator ID'] != null ? pm['Creator ID'] : 2]); if (String(row[pm['Campaign ID'] != null ? pm['Campaign ID'] : 1]) !== String(campaignId)) return; if (ids.indexOf(id) < 0 && pm['Status'] != null) { row[pm['Status']]='SUPERSEDED'; if(pm['Superseded At']!=null)row[pm['Superseded At']]=now; if(pm['Superseded Reason']!=null)row[pm['Superseded Reason']]='Creator removed from canonical selection'; if(pm['Updated At']!=null)row[pm['Updated At']]=now; KOL_IDS_WORKFLOW_put_(sh,index,row); } });
  ids.forEach(function(id) { var matches=rows.map(function(row,i){return {row:row,index:i};}).filter(function(x) { return String(x.row[pm['Campaign ID'] != null ? pm['Campaign ID'] : 1])===String(campaignId) && String(x.row[pm['Creator ID'] != null ? pm['Creator ID'] : 2])===id; }).sort(function(a,b){return new Date(pm['Updated At'] != null ? b.row[pm['Updated At']] : 0)-new Date(pm['Updated At'] != null ? a.row[pm['Updated At']] : 0);}), found=matches[0], creator=creators.find(function(r){return String(r[0])===id;}); if(found) { var row=found.row; if(pm['Status']!=null && String(row[pm['Status']]).toUpperCase()==='SUPERSEDED')row[pm['Status']]='WAITING_FOR_PERFORMANCE'; if(pm['Superseded At']!=null)row[pm['Superseded At']]=''; if(pm['Superseded Reason']!=null)row[pm['Superseded Reason']]=''; if(pm['Updated At']!=null)row[pm['Updated At']]=now;KOL_IDS_WORKFLOW_put_(sh,found.index,row); } else { sh.appendRow(KOL_IDS_CORE_setByHeader_(sh,{'Performance ID':KOL_IDS_WORKFLOW_id_('PF'),'Campaign ID':campaignId,'Creator ID':id,'Creator Name':creator?creator[1]:id,'Currency':currency,'Status':'WAITING_FOR_PERFORMANCE','Evidence':'LIMITED','Notes':'Created from canonical selection workflow.','Created At':now,'Updated At':now})); } });
  if(typeof KOL_IDS_SCALE_INVALIDATE_READ_MODEL_==='function')KOL_IDS_SCALE_INVALIDATE_READ_MODEL_(sh);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_syncPerformance_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_syncPerformance_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_savePerformanceBatch(token, payload) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_savePerformanceBatch');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  payload=payload||{}; var campaignId=String(payload.campaignId||'').trim(), records=payload.records||[]; if(!campaignId||!records.length)throw new Error('Campaign and at least one performance record are required.');
  var c=KOL_IDS_CORE_ctx_(token), ss=c.ss;
  return KOL_IDS_WORKFLOW_idempotent_(ss,'SAVE_PERFORMANCE_BATCH',campaignId,payload.idempotencyKey,payload,function(){
    var selected=KOL_IDS_CORE_getSelectedCreators_(ss,campaignId), results=[];
    records.forEach(function(record){ if(selected.indexOf(String(record.creatorId))<0)throw new Error('Creator '+record.creatorId+' is not selected for this Campaign.'); results.push(KOL_IDS_CORE_savePerformance(token,Object.assign({},record,{campaignId:campaignId}))); });
    return {success:true,campaignId:campaignId,processed:results.length,results:results};
  });

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_savePerformanceBatch', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_savePerformanceBatch', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_WORKFLOW_getCampaignReport(token,campaignId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_getCampaignReport');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 var report=KOL_IDS_CORE_getCampaignReport(token,campaignId); report.workflow=KOL_IDS_WORKFLOW_getWorkflow(token,campaignId); var selected={};report.workflow.selectedCreatorIds.forEach(function(id){selected[String(id)]=true;}); report.performance=(report.performance||[]).filter(function(row){return selected[String(row.creatorId)] && String(row.status||'').toUpperCase()!=='SUPERSEDED';}); report.decisions=(report.decisions||[]).filter(function(row){return selected[String(row.creatorId)];}); report.businessImpact=KOL_IDS_WORKFLOW_getBusinessImpact(token,campaignId); report.version=KOL_IDS.VERSION; return report; 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_getCampaignReport', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_getCampaignReport', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** A compact history read for the "Use Existing Data" home screen. */
function KOL_IDS_WORKFLOW_getCampaignHistory(token) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_getCampaignHistory');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_WORKFLOW_ensure_(ss);
  var sh=ss.getSheetByName('ENT_CAMPAIGNS'),m=KOL_IDS_CORE_colMap_(sh),rows=KOL_IDS_WORKFLOW_values_(sh);
  var value=function(r,h,f){return m[h]!=null?r[m[h]]:f;};
  return {success:true,campaigns:rows.map(function(r){
    var ids=String(value(r,'Selected Creator IDs','')).split(',').map(function(x){return x.trim();}).filter(Boolean);
    return {id:String(value(r,'Campaign ID',r[0])),name:value(r,'Campaign Name',r[1]),goal:value(r,'Campaign Goal',value(r,'Objective',r[4])),status:value(r,'Status','PLANNING'),selectedCount:ids.length,selectedCreatorIds:ids,updatedAt:value(r,'Updated At',value(r,'Created At','')),workflowVersion:Number(value(r,'Workflow Version',1)||1),selectionVersion:Number(value(r,'Selection Version',0)||0)};
  }).sort(function(a,b){return new Date(b.updatedAt||0)-new Date(a.updatedAt||0);})};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_getCampaignHistory', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_getCampaignHistory', Date.now() - __kolIdsTraceStartedAt);
  }
}

/** Finance-safe business impact: returns actual observed ratios only; it never invents revenue or profit. */
function KOL_IDS_WORKFLOW_getBusinessImpact(token,campaignId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_WORKFLOW_getBusinessImpact');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_WORKFLOW_ensure_(ss);
  var selected={};KOL_IDS_CORE_getSelectedCreators_(ss,campaignId).forEach(function(id){selected[String(id)]=true;}); var sh=KOL_IDS_PA_legacyProjection_(ss),m=KOL_IDS_CORE_colMap_(sh),rows=KOL_IDS_WORKFLOW_values_(sh).filter(function(r){return selected[String(r[m['Creator ID']!=null?m['Creator ID']:2])]&&String(r[m['Campaign ID']!=null?m['Campaign ID']:1])===String(campaignId)&&String(r[m['Status']]||'').toUpperCase()==='COMPLETED';});
  var number=function(r,h){var n=Number(m[h]!=null?r[m[h]]:'');return isFinite(n)?n:0;};
  var sum=function(h){return rows.reduce(function(total,row){return total+number(row,h);},0);};
  var spend=sum('Spend'),revenue=sum('Revenue'),conversions=sum('Conversions'),reach=sum('Reach'),views=sum('Views'),engagements=sum('Engagements'),clicks=sum('Clicks');
  var completeness=rows.length?Math.round(rows.reduce(function(total,row){return total+['Spend','Revenue','Conversions','Reach','Views','Engagements','Clicks'].filter(function(h){return m[h]!=null&&row[m[h]]!==''&&row[m[h]]!=null;}).length/7;},0)/rows.length*100):0;
  return {success:true,campaignId:String(campaignId),creatorRecords:rows.length,spend:spend,revenue:revenue,conversions:conversions,reach:reach,views:views,engagements:engagements,clicks:clicks,
    roas:spend>0&&revenue>0?Math.round(revenue/spend*100)/100:null,cpa:spend>0&&conversions>0?Math.round(spend/conversions*100)/100:null,cpc:spend>0&&clicks>0?Math.round(spend/clicks*100)/100:null,cpe:spend>0&&engagements>0?Math.round(spend/engagements*100)/100:null,ctr:views>0&&clicks>0?Math.round(clicks/views*10000)/100:null,conversionRate:clicks>0&&conversions>0?Math.round(conversions/clicks*10000)/100:null,dataCompleteness:completeness,disclaimer:'Observed business impact only. Revenue, profit, incrementality and attribution must be supplied or verified before investment decisions.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_WORKFLOW_getBusinessImpact', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_WORKFLOW_getBusinessImpact', Date.now() - __kolIdsTraceStartedAt);
  }
}
