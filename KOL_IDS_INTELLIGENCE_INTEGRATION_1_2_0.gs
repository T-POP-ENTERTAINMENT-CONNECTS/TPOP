/**
 * KOL IDS 1.2.0.5 — CLEAN COHESION HARDENED
 * Single-authority integration for Decision Trace, Attribution and Learning.
 * Keeps Engine / Performance Authority / Report as upstream authorities.
 */
var KOL_IDS_INTEL120_VERSION='1.2.0.5';
var KOL_IDS_INTEL120_SHEETS={TRACE:'INTEL_DECISION_TRACE',ATTRIBUTION:'INTEL_ATTRIBUTION',LEARNING:'INTEL_LEARNING'};
var KOL_IDS_INTEL120_LOCK_MS=10000;

function KOL_IDS_INTEL120_ss_(){
  if(typeof KOL_IDS_PRODUCT_getSpreadsheet_==='function') return KOL_IDS_PRODUCT_getSpreadsheet_();
  if(typeof KOL_IDS_SYSTEM_getSpreadsheet_==='function') return KOL_IDS_SYSTEM_getSpreadsheet_();
  return SpreadsheetApp.getActiveSpreadsheet();
}
function KOL_IDS_INTEL120_uuid_(p){return (p||'ID')+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,20).toUpperCase();}
function KOL_IDS_INTEL120_hash_(v){
  var raw=typeof v==='string'?v:JSON.stringify(v||{}),d=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,raw),s='';
  d.forEach(function(b){s+=(b<0?b+256:b).toString(16).padStart(2,'0');});
  return s;
}
function KOL_IDS_INTEL120_sheet_(name,headers){
  var ss=KOL_IDS_INTEL120_ss_(),sh=ss.getSheetByName(name)||ss.insertSheet(name),last=sh.getLastColumn();
  if(last===0){sh.getRange(1,1,1,headers.length).setValues([headers]);return sh;}
  var h=sh.getRange(1,1,1,last).getValues()[0].map(String),changed=false;
  headers.forEach(function(x){if(h.indexOf(x)<0){h.push(x);changed=true;}});
  if(changed)sh.getRange(1,1,1,h.length).setValues([h]);
  return sh;
}
function KOL_IDS_INTEL120_map_(h){var m={};h.forEach(function(x,i){m[String(x)]=i;});return m;}
function KOL_IDS_INTEL120_upsert_(sh,row,keyHeader){
  var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String),m=KOL_IDS_INTEL120_map_(h),key=String(row[m[keyHeader]]||'');
  if(!key)return sh.appendRow(row);
  var last=sh.getLastRow();
  if(last>=2){
    var col=m[keyHeader]+1,vals=sh.getRange(2,col,last-1,1).getValues();
    for(var i=0;i<vals.length;i++)if(String(vals[i][0])===key){sh.getRange(i+2,1,1,h.length).setValues([row]);return i+2;}
  }
  sh.getRange(sh.getLastRow()+1,1,1,h.length).setValues([row]);
  return sh.getLastRow();
}
function KOL_IDS_INTEL120_val_(r,m,k){return m[k]!=null?r[m[k]]:'';}
function KOL_IDS_INTEL120_str_(r,m,k,def){var v=KOL_IDS_INTEL120_val_(r,m,k);return v==null||v===''?(def||''):String(v);}

function KOL_IDS_INTEL120_recordDecision_(decision,context){
  try{
    var d=decision||{},c=context||{},headers=['Trace ID','Recorded At','Campaign ID','Analysis ID','Creator ID','Creator Name','Engine Version','Decision','Score','Base Score','Confidence Score','Decision Tier','Fit Score','Impact Score','Evidence Score','Data Quality Score','Learning Adjustment','Calibration Adjustment','Opportunity Score','Investment Strength','Risk Level','Decision Class','Data State','Input Hash','Feature Contributions','Decision Reasons','Limitations','Supersedes Trace ID','Event Type','Revision'];
    var sh=KOL_IDS_INTEL120_sheet_(KOL_IDS_INTEL120_SHEETS.TRACE,headers),m=KOL_IDS_INTEL120_map_(sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String)),row=new Array(sh.getLastColumn()).fill('');
    var put=function(k,v){if(m[k]!=null)row[m[k]]=v==null?'':v;};
    var hash=KOL_IDS_INTEL120_hash_({decision:d,context:c}),trace=d.decisionId||KOL_IDS_INTEL120_uuid_('TRACE');
    put('Trace ID',trace);put('Recorded At',new Date());put('Campaign ID',d.campaignId||c.campaignId||'');put('Analysis ID',d.analysisId||c.analysisId||'');
    put('Creator ID',d.creatorId||'');put('Creator Name',d.name||d.creatorName||'');put('Engine Version',typeof KOL_IDS_ENGINE_CONFIG!=='undefined'?KOL_IDS_ENGINE_CONFIG.VERSION:KOL_IDS_INTEL120_VERSION);
    put('Decision',d.decision);put('Score',d.score);put('Base Score',d.baseScore);put('Confidence Score',d.confidenceScore);put('Decision Tier',d.decisionTier);
    put('Fit Score',d.fitScore!=null?d.fitScore:d.personaFit);put('Impact Score',c.impactScore!=null?c.impactScore:d.impactScore);put('Evidence Score',d.evidenceScore);put('Data Quality Score',d.dataQualityScore);
    put('Learning Adjustment',d.learningAdjustment);put('Calibration Adjustment',d.calibrationAdjustment);put('Opportunity Score',d.opportunityScore);put('Investment Strength',d.investmentStrength);
    put('Risk Level',d.riskLevel);put('Decision Class',d.decisionClass);put('Data State',d.dataState);put('Input Hash',hash);
    put('Feature Contributions',JSON.stringify(d.featureContributions||{}));put('Decision Reasons',d.why||d.reasons||'');put('Limitations',d.dataLimitation||'');
    put('Event Type','DECISION_RECORDED');put('Revision',1);KOL_IDS_INTEL120_upsert_(sh,row,'Trace ID');
    return {success:true,traceId:String(trace),inputHash:hash};
  }catch(e){Logger.log('[INTEL][TRACE_ERROR] '+e.message);return {success:false,error:String(e.message||e)};}
}
function KOL_IDS_INTEL120_recordDecisions_(results,context){var out=[];(results||[]).forEach(function(r){out.push(KOL_IDS_INTEL120_recordDecision_(r,context||{}));});return out;}

function KOL_IDS_INTEL120_recordPerformanceRows_(rows){
  try{
    var headers=['Attribution ID','Recorded At','Analysis ID','Campaign ID','Brand ID','Creator ID','Creator Name','Channel','Objective','Model','Source','Source ID','Source Key','Evidence Status','Spend','Revenue','Net Revenue','Conversions','Orders','Code Uses','Clicks','Leads','QR Scans','Attribution Value','Attribution Confidence','Assisted Flag','Canonical Performance ID','Idempotency Key'];
    var sh=KOL_IDS_INTEL120_sheet_(KOL_IDS_INTEL120_SHEETS.ATTRIBUTION,headers),h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String),m=KOL_IDS_INTEL120_map_(h),existing={};
    if(sh.getLastRow()>1)sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues().forEach(function(r){var k=String(r[m['Idempotency Key']]||'');if(k)existing[k]=true;});
    var processed=0;
    (rows||[]).forEach(function(r){
      r=r||{};
      var creatorId=String(r.creatorId||r.kolId||''),pid=String(r.performanceId||r.canonicalPerformanceId||r.id||''),
          key=KOL_IDS_INTEL120_hash_({pid:pid,analysisId:r.analysisId,campaignId:r.campaignId,brandId:r.brandId,creatorId:creatorId,channel:r.channel,sourceId:r.sourceId,sourceKey:r.sourceKey});
      if(!creatorId||existing[key])return;
      var code=Number(r.codeUses||0),clicks=Number(r.clicks||r.linkClicks||0),conv=Number(r.conversions||r.orders||0),rev=Number(r.netRevenue||r.revenue||0);
      if(!(rev||conv||code||clicks))return;
      var model=code>0?'DIRECT_CODE':clicks>0?'DIRECT_CLICK':'DIRECT_EVENT',row=new Array(h.length).fill(''),put=function(k,v){if(m[k]!=null)row[m[k]]=v==null?'':v;};
      put('Attribution ID',KOL_IDS_INTEL120_uuid_('ATTR'));put('Recorded At',new Date());put('Analysis ID',r.analysisId);put('Campaign ID',r.campaignId);put('Brand ID',r.brandId);put('Creator ID',creatorId);put('Creator Name',r.creatorName||r.name||r.kolName);
      put('Channel',r.channel);put('Objective',r.objective);put('Model',model);put('Source',r.source);put('Source ID',r.sourceId);put('Source Key',r.sourceKey||key);put('Evidence Status',r.verificationStatus||'UNVERIFIED');
      put('Spend',Number(r.spend||0));put('Revenue',Number(r.revenue||0));put('Net Revenue',Number(r.netRevenue||0));put('Conversions',conv);put('Orders',Number(r.orders||0));put('Code Uses',code);put('Clicks',clicks);put('Leads',Number(r.leads||0));put('QR Scans',Number(r.qrScans||0));
      put('Attribution Value',rev||conv||code||clicks);put('Attribution Confidence',String(r.verificationStatus||'').toUpperCase()==='VERIFIED'?1:.6);put('Assisted Flag',model==='DIRECT_CLICK'&&conv>0?'POSSIBLE_ASSIST':'DIRECT');put('Canonical Performance ID',pid);put('Idempotency Key',key);
      sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]);existing[key]=true;processed++;
    });
    return {success:true,processed:processed,idempotent:true};
  }catch(e){Logger.log('[INTEL][ATTR_ERROR] '+e.message);return {success:false,error:String(e.message||e)};}
}

function KOL_IDS_INTEL120_refreshLearning_(context){
  var lock=LockService.getScriptLock();
  if(!lock.tryLock(KOL_IDS_INTEL120_LOCK_MS))throw new Error('INTELLIGENCE_SYNC_BUSY');
  try{
    var ss=KOL_IDS_INTEL120_ss_(),ph=ss.getSheetByName('09_PERFORMANCE'),headers=['Learning Key','Updated At','Campaign Scope','Brand Scope','Creator ID','Channel','Objective','Sample Size','Observed Score','Revenue','Spend','Conversions','ROAS','Evidence Rate','Confidence','Method','Source Performance IDs','Learning Version'];
    var lh=KOL_IDS_INTEL120_sheet_(KOL_IDS_INTEL120_SHEETS.LEARNING,headers);
    if(!ph||ph.getLastRow()<2)return {success:true,samples:0,version:KOL_IDS_INTEL120_VERSION};
    var vals=ph.getDataRange().getValues(),h=vals.shift().map(String),m=KOL_IDS_INTEL120_map_(h),groups={};
    var scopeCampaign=context&&context.campaignId?String(context.campaignId):'',scopeBrand=context&&context.brandId?String(context.brandId):'';
    vals.forEach(function(r){
      var rowCampaign=KOL_IDS_INTEL120_str_(r,m,'Campaign ID'),rowBrand=KOL_IDS_INTEL120_str_(r,m,'Brand ID');
      if(scopeCampaign&&rowCampaign!==scopeCampaign)return;if(scopeBrand&&rowBrand!==scopeBrand)return;
      var cid=KOL_IDS_INTEL120_str_(r,m,'Creator ID');if(!cid)return;
      var campaignScope=rowCampaign||'UNSCOPED',brandScope=rowBrand||'UNSCOPED',channel=KOL_IDS_INTEL120_str_(r,m,'Channel','UNKNOWN'),objective=KOL_IDS_INTEL120_str_(r,m,'Objective','AWARENESS');
      var key=[campaignScope,brandScope,cid,channel,objective].join('|'),g=groups[key]||(groups[key]={campaignId:campaignScope,brandId:brandScope,creatorId:cid,channel:channel,objective:objective,rows:[]});g.rows.push(r);
    });
    var learningHeaders=lh.getRange(1,1,1,lh.getLastColumn()).getValues()[0].map(String),lm=KOL_IDS_INTEL120_map_(learningHeaders),count=0;
    Object.keys(groups).forEach(function(key){
      var g=groups[key],revenue=0,spend=0,conv=0,scores=[],verified=0,ids=[];
      g.rows.forEach(function(r){var sc=Number(KOL_IDS_INTEL120_val_(r,m,'Normalized Performance Score'));if(isFinite(sc))scores.push(sc);revenue+=Number(KOL_IDS_INTEL120_val_(r,m,'Net Revenue')||KOL_IDS_INTEL120_val_(r,m,'Revenue')||0);spend+=Number(KOL_IDS_INTEL120_val_(r,m,'Spend')||0);conv+=Number(KOL_IDS_INTEL120_val_(r,m,'Conversions')||KOL_IDS_INTEL120_val_(r,m,'Orders')||0);if(KOL_IDS_INTEL120_str_(r,m,'Verification Status').toUpperCase()==='VERIFIED')verified++;var pid=KOL_IDS_INTEL120_str_(r,m,'Performance ID');if(pid)ids.push(pid);});
      var n=g.rows.length,observed=scores.length?scores.reduce(function(a,b){return a+b;},0)/scores.length:null,roas=spend>0?revenue/spend:null,confidence=Math.max(0,Math.min(100,(Math.min(n,10)/10)*60+(verified/Math.max(1,n))*40)),row=new Array(learningHeaders.length).fill(''),put=function(k,v){if(lm[k]!=null)row[lm[k]]=v==null?'':v;};
      put('Learning Key',key);put('Updated At',new Date());put('Campaign Scope',g.campaignId);put('Brand Scope',g.brandId);put('Creator ID',g.creatorId);put('Channel',g.channel);put('Objective',g.objective);put('Sample Size',n);put('Observed Score',observed==null?'':Math.round(observed*100)/100);put('Revenue',revenue);put('Spend',spend);put('Conversions',conv);put('ROAS',roas==null?'':Math.round(roas*100)/100);put('Evidence Rate',Math.round(verified/Math.max(1,n)*100));put('Confidence',Math.round(confidence));put('Method','EMPIRICAL_PERFORMANCE_V2');put('Source Performance IDs',ids.join(','));put('Learning Version',KOL_IDS_INTEL120_VERSION);
      KOL_IDS_INTEL120_upsert_(lh,row,'Learning Key');count++;
    });
    return {success:true,samples:count,version:KOL_IDS_INTEL120_VERSION,scope:{campaignId:scopeCampaign||'ALL',brandId:scopeBrand||'ALL'}};
  }catch(e){Logger.log('[INTEL][LEARNING_ERROR] '+e.message);return {success:false,error:String(e.message||e)};}
  finally{lock.releaseLock();}
}
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL120_runAll(context){return {success:true,learning:KOL_IDS_INTEL120_refreshLearning_(context||{}),version:KOL_IDS_INTEL120_VERSION};}

function KOL_IDS_INTEL120_report_(analysisId,campaignId,brandId){
  var ss=KOL_IDS_INTEL120_ss_(),out={version:KOL_IDS_INTEL120_VERSION,trace:[],attribution:[],learning:[]},cid=campaignId?String(campaignId):'',bid=brandId?String(brandId):'';
  ['INTEL_DECISION_TRACE','INTEL_ATTRIBUTION','INTEL_LEARNING'].forEach(function(n,i){
    var sh=ss.getSheetByName(n);if(!sh||sh.getLastRow()<2)return;
    var vals=sh.getDataRange().getValues(),h=vals.shift().map(String),m=KOL_IDS_INTEL120_map_(h),bucket=['trace','attribution','learning'][i];
    vals.forEach(function(r){
      if(analysisId&&m['Analysis ID']!=null&&String(r[m['Analysis ID']]||'')!==String(analysisId))return;
      if(cid){var rowCampaign=m['Campaign ID']!=null?String(r[m['Campaign ID']]||''):'';var rowScope=m['Campaign Scope']!=null?String(r[m['Campaign Scope']]||''):'';if(rowCampaign!==cid&&rowScope!==cid)return;}
      if(bid&&m['Brand ID']!=null&&String(r[m['Brand ID']]||'')!==bid)return;
      if(bid&&m['Brand Scope']!=null&&String(r[m['Brand Scope']]||'')!==bid)return;
      var o={};h.forEach(function(k,j){o[k]=r[j];});out[bucket].push(o);
    });
  });
  return out;
}


function KOL_IDS_INTEL120_runAll() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_INTEL120_runAll', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_INTEL120_runAll, this, arguments);
}
