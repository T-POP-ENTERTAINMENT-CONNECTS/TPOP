/**
 * KOL IDS™ 1.1.0 — PERFORMANCE AUTHORITY
 *
 * Single source of truth for performance + business outcome data.
 *
 * Rules:
 *  1. 09_PERFORMANCE is the canonical product-layer performance authority.
 *  2. ENT_PERFORMANCE is legacy input only and is migrated, never treated as a
 *     second live authority.
 *  3. Channel KPI formulas are selected by Objective + Channel.
 *  4. Scores are bounded 0..100 and calculated in two layers:
 *       Channel Score -> campaign/business outcome score.
 *  5. Reads are index-first and bounded; callers must provide context and
 *     maxRows instead of scanning an entire workbook by default.
 *  6. Attribution/Gen Code revenue is written back with stable source keys,
 *     so report, performance, attribution and revenue share one lineage.
 */

var KOL_IDS_PERFORMANCE_AUTHORITY = Object.freeze({
  VERSION: '1.1.0',
  SHEET: '09_PERFORMANCE',
  INDEX_SHEET: 'ENT_PERFORMANCE_INDEX',
  LEGACY_SHEET: 'ENT_PERFORMANCE',
  MAX_READ_ROWS: 1000,
  INDEX_MAX_ROWS: 50000,
  SCORE_MIN: 0,
  SCORE_MAX: 100
});

var KOL_IDS_PERFORMANCE_KPI_RULES = Object.freeze({
  AWARENESS: {
    TIKTOK: {primary:['views','reach','impressions'], secondary:['engagementRatePct','completionRatePct'], weights:[.45,.20,.20,.15]},
    INSTAGRAM: {primary:['reach','impressions','views'], secondary:['engagementRatePct','profileVisits'], weights:[.40,.20,.20,.20]},
    FACEBOOK: {primary:['reach','impressions','views'], secondary:['engagementRatePct','clicks'], weights:[.40,.20,.20,.20]},
    YOUTUBE: {primary:['views','uniqueViewers','impressions'], secondary:['avgViewPercentage','subscribersGained'], weights:[.40,.20,.25,.15]},
    X: {primary:['impressions'], secondary:['engagementRatePct','reposts','replies'], weights:[.45,.25,.15,.15]},
    ONLINE_ADS: {primary:['impressions','reach'], secondary:['ctrPct','clicks'], weights:[.40,.20,.25,.15]},
    OFFLINE_EVENT: {primary:['attendance','checkIns'], secondary:['leads','qrScans'], weights:[.35,.25,.25,.15]},
    RETAIL_O2O: {primary:['footfall'], secondary:['qrScans','newCustomers'], weights:[.40,.25,.35]}
  },
  ENGAGEMENT: {
    TIKTOK: {primary:['engagementRatePct','views'], secondary:['completionRatePct','shares','saves'], weights:[.40,.20,.20,.10,.10]},
    INSTAGRAM: {primary:['engagementRatePct','views'], secondary:['shares','saves','comments'], weights:[.45,.15,.15,.15,.10]},
    FACEBOOK: {primary:['engagementRatePct','views'], secondary:['shares','comments','reactions'], weights:[.45,.15,.20,.20]},
    YOUTUBE: {primary:['engagementRatePct','views'], secondary:['avgViewPercentage','comments','shares'], weights:[.35,.20,.25,.10,.10]},
    X: {primary:['engagementRatePct','impressions'], secondary:['replies','reposts','bookmarks'], weights:[.45,.20,.15,.10,.10]},
    ONLINE_ADS: {primary:['ctrPct'], secondary:['clicks','conversionRatePct'], weights:[.55,.20,.25]},
    OFFLINE_EVENT: {primary:['checkInRatePct','leadRatePct'], secondary:['qrScanRatePct'], weights:[.55,.30,.15]},
    RETAIL_O2O: {primary:['qrScanRatePct','newCustomerRatePct'], secondary:['conversionRatePct'], weights:[.50,.30,.20]}
  },
  TRAFFIC: {
    TIKTOK: {primary:['ctrPct','clicks'], secondary:['views','engagementRatePct'], weights:[.45,.20,.20,.15]},
    INSTAGRAM: {primary:['ctrPct','linkClicks'], secondary:['profileVisits','engagementRatePct'], weights:[.45,.20,.20,.15]},
    FACEBOOK: {primary:['ctrPct','linkClicks'], secondary:['clicks','engagementRatePct'], weights:[.45,.20,.20,.15]},
    YOUTUBE: {primary:['ctrPct','clicks'], secondary:['views','avgViewPercentage'], weights:[.45,.20,.20,.15]},
    X: {primary:['ctrPct','linkClicks'], secondary:['engagementRatePct'], weights:[.55,.25,.20]},
    ONLINE_ADS: {primary:['ctrPct','clicks'], secondary:['cpc','conversionRatePct'], weights:[.40,.20,.20,.20]},
    OFFLINE_EVENT: {primary:['qrScanRatePct','checkInRatePct'], secondary:['codeUseRatePct','leads'], weights:[.35,.25,.20,.20]},
    RETAIL_O2O: {primary:['qrScanRatePct','footfall'], secondary:['codeUseRatePct','newCustomerRatePct'], weights:[.35,.20,.20,.25]}
  },
  CONVERSION: {
    TIKTOK: {primary:['conversionRatePct','conversions'], secondary:['roas','revenue'], weights:[.35,.20,.25,.20]},
    INSTAGRAM: {primary:['conversionRatePct','conversions'], secondary:['roas','revenue'], weights:[.35,.20,.25,.20]},
    FACEBOOK: {primary:['conversionRatePct','conversions'], secondary:['roas','revenue'], weights:[.35,.20,.25,.20]},
    YOUTUBE: {primary:['conversionRatePct','conversions'], secondary:['roas','revenue'], weights:[.35,.20,.25,.20]},
    X: {primary:['conversionRatePct','conversions'], secondary:['roas','revenue'], weights:[.35,.20,.25,.20]},
    ONLINE_ADS: {primary:['conversionRatePct','conversions'], secondary:['roas','revenue'], weights:[.35,.20,.30,.15]},
    OFFLINE_EVENT: {primary:['conversionRatePct','orders'], secondary:['roas','revenue'], weights:[.35,.20,.25,.20]},
    RETAIL_O2O: {primary:['conversionRatePct','orders'], secondary:['roas','revenue'], weights:[.35,.20,.25,.20]}
  },
  SALES: {
    TIKTOK: {primary:['roas','revenue'], secondary:['conversions','conversionRatePct'], weights:[.40,.25,.20,.15]},
    INSTAGRAM: {primary:['roas','revenue'], secondary:['conversions','conversionRatePct'], weights:[.40,.25,.20,.15]},
    FACEBOOK: {primary:['roas','revenue'], secondary:['conversions','conversionRatePct'], weights:[.40,.25,.20,.15]},
    YOUTUBE: {primary:['roas','revenue'], secondary:['conversions','conversionRatePct'], weights:[.40,.25,.20,.15]},
    X: {primary:['roas','revenue'], secondary:['conversions','conversionRatePct'], weights:[.40,.25,.20,.15]},
    ONLINE_ADS: {primary:['roas','revenue'], secondary:['conversions','conversionRatePct'], weights:[.45,.25,.20,.10]},
    OFFLINE_EVENT: {primary:['roas','revenue'], secondary:['orders','conversionRatePct'], weights:[.40,.25,.20,.15]},
    RETAIL_O2O: {primary:['roas','revenue'], secondary:['orders','newCustomerRatePct'], weights:[.40,.25,.20,.15]}
  }
});

function KOL_IDS_PA_text_(v){ return v==null?'':String(v).trim(); }
function KOL_IDS_PA_upper_(v){ return KOL_IDS_PA_text_(v).toUpperCase(); }
function KOL_IDS_PA_num_(v){ var n=Number(v); return isFinite(n)&&n>=0?n:0; }
function KOL_IDS_PA_clamp_(v,a,b){ v=Number(v); if(!isFinite(v))return null; return Math.max(a,Math.min(b,v)); }
function KOL_IDS_PA_round_(v,n){ var p=Math.pow(10,n||2); return Math.round(Number(v||0)*p)/p; }
function KOL_IDS_PA_ratio_(n,d){ return d>0?KOL_IDS_PA_round_(Number(n||0)/d*100,4):null; }
function KOL_IDS_PA_key_(r){
  return [r.orgId,r.brandId,r.campaignId,r.creatorId,r.channel,r.source,r.sourceId||r.performanceId].map(KOL_IDS_PA_text_).join('|').toUpperCase();
}
function KOL_IDS_PA_ss_(){ return KOL_IDS_PRODUCT_getSpreadsheet_(); }

function KOL_IDS_PA_headers_(){
  return [
    'Performance ID','Recorded At','Observed At','Analysis ID','Campaign ID','Brand ID','Creator ID','Creator Name',
    'Channel','Channel Family','Content Type','Objective','Source','Source ID','Verification Status','Currency',
    'Impressions','Reach','Views','Unique Viewers','Likes','Reactions','Comments','Shares','Saves','Reposts','Replies','Bookmarks',
    'Engagements','Clicks','Link Clicks','Profile Visits','Watch Time Seconds','Watch Time Minutes','Avg Watch Time Seconds','Avg View Duration Seconds',
    'Avg View Percentage','Completion Rate Percentage','Subscribers Gained','Attendance','Check-ins','Leads','QR Scans','Code Uses','Orders','Footfall','Conversions','New Customers',
    'Spend','Revenue','Incremental Sales','Net Revenue','CTR Percentage','Engagement Rate Percentage','Conversion Rate Percentage','Cost Per Click','Cost Per Conversion','ROAS','Revenue Per Spend',
    'Check-in Rate Percentage','Lead Rate Percentage','QR Scan Rate Percentage','Code Use Rate Percentage','New Customer Rate Percentage',
    'Channel Score','Campaign Business Score','Normalized Performance Score','Business Outcome Score','Confidence','Evidence Quality','Gen Code','Attribution ID','KPI Rule Version','Authority Version','Source Key','Notes'
  ];
}

function KOL_IDS_PA_ensureSheet_(){
  var ss=KOL_IDS_PA_ss_(), sh=ss.getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.SHEET);
  var headers=KOL_IDS_PA_headers_();
  if(!sh)sh=ss.insertSheet(KOL_IDS_PERFORMANCE_AUTHORITY.SHEET);
  var existing=sh.getLastRow()>0?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String):[];
  if(existing.join('\u001f')!==headers.join('\u001f')){
    var old=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,Math.max(1,sh.getLastColumn())).getValues():[];
    var map={}; existing.forEach(function(h,i){if(h)map[h]=i;});
    var migrated=old.map(function(row){return headers.map(function(h){return map[h]!==undefined?row[map[h]]:'';});});
    sh.clearContents(); sh.getRange(1,1,1,headers.length).setValues([headers]);
    if(migrated.length)sh.getRange(2,1,migrated.length,headers.length).setValues(migrated);
  } else if(sh.getLastRow()===0) sh.getRange(1,1,1,headers.length).setValues([headers]);
  sh.setFrozenRows(1);
  return sh;
}

function KOL_IDS_PA_indexSheet_(){
  var ss=KOL_IDS_PA_ss_(),sh=ss.getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.INDEX_SHEET);
  var headers=['Index Key','Org ID','Brand ID','Campaign ID','Analysis ID','Creator ID','Channel','First Row','Last Row','Record Count','Updated At','Version'];
  if(!sh)sh=ss.insertSheet(KOL_IDS_PERFORMANCE_AUTHORITY.INDEX_SHEET);
  if(sh.getLastRow()===0)sh.getRange(1,1,1,headers.length).setValues([headers]);
  return sh;
}

function KOL_IDS_PA_numField_(r,k){
  return KOL_IDS_PA_num_(r[k]);
}

function KOL_IDS_PA_normalizeObjective_(v){
  var x=KOL_IDS_PA_upper_(v).replace(/[^A-Z0-9]+/g,'_');
  if(x.indexOf('AWARE')>=0||x.indexOf('REACH')>=0||x.indexOf('IMPRESS')>=0)return 'AWARENESS';
  if(x.indexOf('ENGAGE')>=0||x.indexOf('COMMUNITY')>=0)return 'ENGAGEMENT';
  if(x.indexOf('TRAFFIC')>=0||x.indexOf('CLICK')>=0||x.indexOf('VISIT')>=0)return 'TRAFFIC';
  if(x.indexOf('CONVERT')>=0||x.indexOf('LEAD')>=0)return 'CONVERSION';
  if(x.indexOf('SALE')>=0||x.indexOf('REVENUE')>=0||x.indexOf('COMMERCE')>=0||x.indexOf('PURCHASE')>=0)return 'SALES';
  return 'AWARENESS';
}
function KOL_IDS_PA_normalizeChannel_(v){
  var x=KOL_IDS_PA_upper_(v);
  return KOL_IDS_PERFORMANCE_CHANNELS[x]?x:'UNKNOWN';
}
function KOL_IDS_PA_family_(channel){
  return KOL_IDS_PERFORMANCE_CHANNELS[channel]?KOL_IDS_PERFORMANCE_CHANNELS[channel].family:'UNKNOWN';
}

function KOL_IDS_PA_metricValue_(r,m){
  var v=KOL_IDS_PA_num_(r[m]);
  var base=KOL_IDS_PA_num_(r.reach)||KOL_IDS_PA_num_(r.impressions)||KOL_IDS_PA_num_(r.views);
  if(m==='engagementRatePct')return KOL_IDS_PA_ratio_(r.engagements||((r.likes||0)+(r.reactions||0)+(r.comments||0)+(r.shares||0)+(r.saves||0)+(r.reposts||0)+(r.replies||0)+(r.bookmarks||0)),base);
  if(m==='ctrPct')return KOL_IDS_PA_ratio_(r.clicks||r.linkClicks,r.impressions||r.views||r.reach);
  if(m==='conversionRatePct')return KOL_IDS_PA_ratio_(r.conversions,r.clicks||r.linkClicks||base);
  if(m==='checkInRatePct')return KOL_IDS_PA_ratio_(r.checkIns,r.attendance);
  if(m==='leadRatePct')return KOL_IDS_PA_ratio_(r.leads,r.checkIns||r.attendance);
  if(m==='qrScanRatePct')return KOL_IDS_PA_ratio_(r.qrScans,r.attendance||r.footfall||base);
  if(m==='codeUseRatePct')return KOL_IDS_PA_ratio_(r.codeUses,r.qrScans||r.clicks||r.footfall||base);
  if(m==='newCustomerRatePct')return KOL_IDS_PA_ratio_(r.newCustomers,r.orders||r.footfall||base);
  if(m==='roas')return KOL_IDS_PA_num_(r.spend)>0?KOL_IDS_PA_num_(r.revenue)/KOL_IDS_PA_num_(r.spend):null;
  if(m==='cpc')return KOL_IDS_PA_num_(r.clicks||r.linkClicks)>0?KOL_IDS_PA_num_(r.spend)/KOL_IDS_PA_num_(r.clicks||r.linkClicks):null;
  return v;
}

/* Bounded, monotonic transforms. Percent metrics are naturally bounded.
 * Ratios such as ROAS are saturated rather than allowed to dominate. */
function KOL_IDS_PA_metricScore_(metric,value){
  if(value===null||value===undefined||!isFinite(Number(value)))return null;
  value=Number(value);
  if(/RatePct|ctrPct|engagementRatePct|completionRatePct|avgViewPercentage/.test(metric))return KOL_IDS_PA_clamp_(value,0,100);
  if(metric==='roas')return KOL_IDS_PA_clamp_(value/3*100,0,100);
  if(metric==='cpc')return KOL_IDS_PA_clamp_(100/(1+value/10),0,100);
  /* Volume metrics use conservative diminishing-return anchors. */
  var anchors={impressions:100000,reach:50000,views:50000,uniqueViewers:40000,likes:5000,comments:1000,shares:1000,saves:1000,
    clicks:3000,linkClicks:3000,profileVisits:5000,conversions:100,orders:100,leads:200,qrScans:500,codeUses:100,
    attendance:1000,checkIns:800,footfall:2000,newCustomers:100,subscribersGained:500,revenue:100000,incrementalSales:100000};
  var a=anchors[metric]||1000;
  return KOL_IDS_PA_clamp_(Math.log10(1+Math.max(0,value))/Math.log10(1+a)*100,0,100);
}
function KOL_IDS_PA_rule_(objective,channel){
  var o=KOL_IDS_PERFORMANCE_KPI_RULES[objective]||KOL_IDS_PERFORMANCE_KPI_RULES.AWARENESS;
  return o[channel]||o.TIKTOK||{primary:['views'],secondary:[],weights:[1]};
}
function KOL_IDS_PA_score_(r,objective,channel){
  var rule=KOL_IDS_PA_rule_(objective,channel), metrics=(rule.primary||[]).concat(rule.secondary||[]), weights=rule.weights||[];
  var got=[],sumW=0;
  metrics.forEach(function(m,i){var val=KOL_IDS_PA_metricValue_(r,m),sc=KOL_IDS_PA_metricScore_(m,val);if(sc!==null){var w=Number(weights[i]||1);got.push({metric:m,score:sc,weight:w});sumW+=w;}});
  if(!got.length)return {score:null,evidence:[],rule:objective+'|'+channel};
  var score=got.reduce(function(a,x){return a+x.score*x.weight;},0)/Math.max(.0001,sumW);
  return {score:KOL_IDS_PA_round_(KOL_IDS_PA_clamp_(score,0,100),2),evidence:got,rule:objective+'|'+channel};
}
function KOL_IDS_PA_businessScore_(r,objective){
  var hasRevenue=KOL_IDS_PA_num_(r.revenue)>0||KOL_IDS_PA_num_(r.netRevenue)>0;
  var hasConv=KOL_IDS_PA_num_(r.conversions)>0||KOL_IDS_PA_num_(r.orders)>0||KOL_IDS_PA_num_(r.leads)>0;
  var outcome=[];
  if(objective==='SALES'||objective==='CONVERSION'){
    if(KOL_IDS_PA_num_(r.roas)>0)outcome.push({s:KOL_IDS_PA_metricScore_('roas',r.roas),w:.45});
    if(hasRevenue)outcome.push({s:KOL_IDS_PA_metricScore_('revenue',r.netRevenue||r.revenue),w:.25});
    if(hasConv)outcome.push({s:KOL_IDS_PA_metricScore_('conversions',r.conversions||r.orders||r.leads),w:.30});
  } else if(objective==='TRAFFIC'){
    outcome.push({s:KOL_IDS_PA_metricScore_('ctrPct',KOL_IDS_PA_metricValue_(r,'ctrPct')),w:.55});
    outcome.push({s:KOL_IDS_PA_metricScore_('clicks',r.clicks||r.linkClicks),w:.45});
  } else if(objective==='ENGAGEMENT'){
    outcome.push({s:KOL_IDS_PA_metricScore_('engagementRatePct',KOL_IDS_PA_metricValue_(r,'engagementRatePct')),w:.65});
    outcome.push({s:KOL_IDS_PA_metricScore_('comments',r.comments),w:.15});
    outcome.push({s:KOL_IDS_PA_metricScore_('shares',r.shares),w:.20});
  } else {
    outcome.push({s:KOL_IDS_PA_metricScore_('reach',r.reach||r.impressions||r.views),w:.55});
    outcome.push({s:KOL_IDS_PA_metricScore_('views',r.views||r.impressions),w:.25});
    outcome.push({s:KOL_IDS_PA_metricScore_('engagementRatePct',KOL_IDS_PA_metricValue_(r,'engagementRatePct')),w:.20});
  }
  outcome=outcome.filter(function(x){return x.s!==null;});
  if(!outcome.length)return null;
  return KOL_IDS_PA_round_(outcome.reduce(function(a,x){return a+x.s*x.w;},0)/outcome.reduce(function(a,x){return a+x.w;},0),2);
}

function KOL_IDS_PA_calculate_(input){
  var r={}; Object.keys(input||{}).forEach(function(k){r[k]=input[k];});
  var ch=KOL_IDS_PA_normalizeChannel_(r.channel), objective=KOL_IDS_PA_normalizeObjective_(r.objective);
  ['impressions','reach','views','uniqueViewers','likes','reactions','comments','shares','saves','reposts','replies','bookmarks','engagements','clicks','linkClicks','profileVisits',
   'watchTimeSeconds','watchTimeMinutes','avgWatchTimeSeconds','avgViewDurationSeconds','avgViewPercentage','completionRatePct','subscribersGained',
   'attendance','checkIns','leads','qrScans','codeUses','orders','footfall','conversions','newCustomers','spend','revenue','incrementalSales','netRevenue'].forEach(function(k){r[k]=KOL_IDS_PA_num_(r[k]);});
  if(!r.engagements)r.engagements=r.likes+r.reactions+r.comments+r.shares+r.saves+r.reposts+r.replies+r.bookmarks;
  var clicks=r.clicks||r.linkClicks, base=r.reach||r.impressions||r.views;
  r.ctrPct=KOL_IDS_PA_ratio_(clicks,r.impressions||r.views||r.reach);
  r.engagementRatePct=KOL_IDS_PA_ratio_(r.engagements,base);
  r.conversionRatePct=KOL_IDS_PA_ratio_(r.conversions,clicks||r.orders||r.leads||base);
  r.cpc=clicks>0?r.spend/clicks:null; r.cpa=r.conversions>0?r.spend/r.conversions:null; var revenueForEfficiency=r.netRevenue>0?r.netRevenue:r.revenue; r.roas=r.spend>0?revenueForEfficiency/r.spend:null; r.revenuePerSpend=r.roas;
  r.checkInRatePct=KOL_IDS_PA_ratio_(r.checkIns,r.attendance); r.leadRatePct=KOL_IDS_PA_ratio_(r.leads,r.checkIns||r.attendance);
  r.qrScanRatePct=KOL_IDS_PA_ratio_(r.qrScans,r.attendance||r.footfall||base); r.codeUseRatePct=KOL_IDS_PA_ratio_(r.codeUses,r.qrScans||clicks||r.footfall||base);
  r.newCustomerRatePct=KOL_IDS_PA_ratio_(r.newCustomers,r.orders||r.footfall||base);
  var chs=ch!=='UNKNOWN'?KOL_IDS_PA_score_(r,objective,ch):{score:null,evidence:[],rule:objective+'|UNKNOWN'};
  r.channelScore=chs.score; r.campaignBusinessScore=KOL_IDS_PA_businessScore_(r,objective);
  r.normalizedScore=r.channelScore===null?r.campaignBusinessScore:r.campaignBusinessScore===null?r.channelScore:KOL_IDS_PA_round_(r.channelScore*.55+r.campaignBusinessScore*.45,2);
  r.objective=objective; r.channel=ch; r.channelFamily=KOL_IDS_PA_family_(ch);
  return r;
}

function KOL_IDS_PA_rowToValues_(r,headers){
  var d=KOL_IDS_PA_calculate_(r),now=new Date(),map={
    'Performance ID':r.performanceId||('PF-'+Utilities.getUuid().replace(/-/g,'').slice(0,20).toUpperCase()),'Recorded At':r.recordedAt||now,'Observed At':r.observedAt?new Date(r.observedAt):now,
    'Analysis ID':r.analysisId||'','Campaign ID':r.campaignId||'','Brand ID':r.brandId||'','Creator ID':r.creatorId||'','Creator Name':r.creatorName||r.name||'',
    'Channel':d.channel==='UNKNOWN'?'':d.channel,'Channel Family':d.channelFamily,'Content Type':r.contentType||'','Objective':d.objective,'Source':r.source||'MANUAL_INPUT','Source ID':r.sourceId||'',
    'Verification Status':r.verificationStatus||'UNVERIFIED','Currency':r.currency||'THB',
    'Impressions':d.impressions,'Reach':d.reach,'Views':d.views,'Unique Viewers':d.uniqueViewers,'Likes':d.likes,'Reactions':d.reactions,'Comments':d.comments,'Shares':d.shares,'Saves':d.saves,
    'Reposts':d.reposts,'Replies':d.replies,'Bookmarks':d.bookmarks,'Engagements':d.engagements,'Clicks':d.clicks,'Link Clicks':d.linkClicks,'Profile Visits':d.profileVisits,
    'Watch Time Seconds':d.watchTimeSeconds,'Watch Time Minutes':d.watchTimeMinutes,'Avg Watch Time Seconds':d.avgWatchTimeSeconds,'Avg View Duration Seconds':d.avgViewDurationSeconds,
    'Avg View Percentage':d.avgViewPercentage,'Completion Rate Percentage':d.completionRatePct,'Subscribers Gained':d.subscribersGained,'Attendance':d.attendance,'Check-ins':d.checkIns,
    'Leads':d.leads,'QR Scans':d.qrScans,'Code Uses':d.codeUses,'Orders':d.orders,'Footfall':d.footfall,'Conversions':d.conversions,'New Customers':d.newCustomers,'Spend':d.spend,
    'Revenue':d.revenue,'Incremental Sales':d.incrementalSales,'Net Revenue':d.netRevenue||d.revenue,'CTR Percentage':d.ctrPct,'Engagement Rate Percentage':d.engagementRatePct,
    'Conversion Rate Percentage':d.conversionRatePct,'Cost Per Click':d.cpc,'Cost Per Conversion':d.cpa,'ROAS':d.roas,'Revenue Per Spend':d.revenuePerSpend,
    'Check-in Rate Percentage':d.checkInRatePct,'Lead Rate Percentage':d.leadRatePct,'QR Scan Rate Percentage':d.qrScanRatePct,'Code Use Rate Percentage':d.codeUseRatePct,'New Customer Rate Percentage':d.newCustomerRatePct,
    'Channel Score':d.channelScore,'Campaign Business Score':d.campaignBusinessScore,'Normalized Performance Score':d.normalizedScore,
    'Business Outcome Score':d.campaignBusinessScore,'Confidence':r.confidence||'','Evidence Quality':r.evidenceQuality||'','Gen Code':r.genCode||'','Attribution ID':r.attributionId||'',
    'KPI Rule Version':KOL_IDS_PERFORMANCE_AUTHORITY.VERSION+'|'+d.objective+'|'+d.channel,'Authority Version':KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,'Source Key':r.sourceKey||KOL_IDS_PA_key_(Object.assign({},r,d)),
    'Notes':r.notes||r.impactNote||''
  };
  return headers.map(function(h){return map[h]===undefined?'':map[h];});
}

function KOL_IDS_PA_context_(payload){
  var ctx=KOL_IDS_ATTRIBUTION_activeContext_(), first=(payload&&Array.isArray(payload.rows)&&payload.rows[0])||{};
  payload=payload||{};
  return {
    analysisId:KOL_IDS_PA_text_(payload.analysisId||first.analysisId||ctx.analysisId),
    campaignId:KOL_IDS_PA_text_(payload.campaignId||first.campaignId||ctx.campaignId),
    brandId:KOL_IDS_PA_text_(payload.brandId||first.brandId||ctx.brandId),
    orgId:KOL_IDS_PA_text_(payload.orgId||first.orgId||ctx.orgId)
  };
}

function KOL_IDS_PA_saveRows_(payload){
  payload=payload||{}; var sh=KOL_IDS_PA_ensureSheet_(), headers=KOL_IDS_PA_headers_(), ctx=KOL_IDS_PA_context_(payload), rows=Array.isArray(payload.rows)?payload.rows:[];
  if(!payload.skipLegacyMigration && sh.getLastRow()<=1){
    var legacy=KOL_IDS_PA_ss_().getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET);
    if(legacy&&legacy.getLastRow()>1){ try { KOL_IDS_PA_migrateLegacy(); } catch(e) { throw new Error('Legacy performance migration failed: '+e.message); } }
  }
  if(!ctx.campaignId||!ctx.brandId)throw new Error('Performance Authority requires Campaign and Brand context.');
  if(!rows.length)throw new Error('At least one performance record is required.');
  var lock=LockService.getScriptLock(); lock.tryLock(15000);
  try{
    var last=sh.getLastRow(), existing=last>1?sh.getRange(2,1,last-1,headers.length).getValues():[], idx={}; headers.forEach(function(h,i){idx[h]=i;});
    var keys={}; existing.forEach(function(row){var k=String(row[idx['Source Key']]||'');if(k)keys[k]=true;});
    var out=[];
    rows.forEach(function(raw){
      var r=Object.assign({},ctx,raw);
      if(!r.creatorId)throw new Error('Performance row is missing Creator ID.');
      if(!r.creatorName&&!r.name)throw new Error('Performance row is missing Creator Name.');
      if(r.channel&&r.channel!=='UNKNOWN'){
        var c=KOL_IDS_PA_normalizeChannel_(r.channel); if(c==='UNKNOWN')throw new Error('Unsupported performance channel: '+r.channel);
      }
      var vals=KOL_IDS_PA_rowToValues_(r,headers), key=String(vals[idx['Source Key']]||'');
      if(keys[key]){ /* idempotent upsert: update the existing authority row */ 
        var rowNo=-1; for(var j=0;j<existing.length;j++){if(String(existing[j][idx['Source Key']]||'')===key){rowNo=j+2;break;}}
        if(rowNo>1)sh.getRange(rowNo,1,1,headers.length).setValues([vals]);
      } else {out.push(vals);keys[key]=true;}
    });
    if(out.length)sh.getRange(sh.getLastRow()+1,1,out.length,headers.length).setValues(out);
    SpreadsheetApp.flush(); KOL_IDS_PA_rebuildIndex_(); KOL_IDS_PA_syncLegacyProjection_();
    if (typeof KOL_IDS_INTEL120_recordPerformanceRows_ === 'function') { KOL_IDS_INTEL120_recordPerformanceRows_(rows.map(function(raw){ return Object.assign({},ctx,raw); })); }
    if (typeof KOL_IDS_INTEL120_refreshLearning_ === 'function') { KOL_IDS_INTEL120_refreshLearning_(payload||{}); }
    return {success:true,count:rows.length,inserted:out.length,updated:rows.length-out.length,authorityVersion:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,source:'09_PERFORMANCE'};
  } finally {try{lock.releaseLock();}catch(e){}}
}

function KOL_IDS_PA_read_(ctx,maxRows){
  ctx=ctx||KOL_IDS_PA_context_({});
  maxRows=Math.max(1,Math.min(Number(maxRows)||KOL_IDS_PERFORMANCE_AUTHORITY.MAX_READ_ROWS,KOL_IDS_PERFORMANCE_AUTHORITY.MAX_READ_ROWS));
  var sh=KOL_IDS_PA_ensureSheet_(),last=sh.getLastRow();
  if(last<2)return {success:true,source:'09_PERFORMANCE',rows:[],truncated:false,authorityVersion:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION};
  var h=KOL_IDS_PA_headers_(), idx=KOL_IDS_PA_indexLookup_(ctx), rowNums;
  if(idx&&idx.length) rowNums=idx.slice(0,maxRows);
  else {
    var count=Math.min(last-1,maxRows);
    rowNums=[];
    for(var n=0;n<count;n++)rowNums.push(n+2);
  }
  var rows=[];
  /* True keyed read: only requested indexed rows are fetched; no contiguous full-sheet scan. */
  /* Read only indexed row runs; this is bounded and avoids a full-sheet scan. */
  var runs=[];
  rowNums.forEach(function(n){
    if(n<2||n>last)return;
    var cur=runs.length?runs[runs.length-1]:null;
    if(cur&&n===cur.last+1&&cur.last-cur.first<99)cur.last=n;
    else runs.push({first:n,last:n});
  });
  runs.forEach(function(run){
    var vals=sh.getRange(run.first,1,run.last-run.first+1,h.length).getValues();
    vals.forEach(function(v){
      var o=KOL_IDS_PA_valuesToObject_(v,h);
      if(ctx.analysisId&&String(o['Analysis ID'])!==String(ctx.analysisId))return;
      if(ctx.campaignId&&String(o['Campaign ID'])!==String(ctx.campaignId))return;
      if(ctx.brandId&&String(o['Brand ID'])!==String(ctx.brandId))return;
      if(ctx.creatorId&&String(o['Creator ID'])!==String(ctx.creatorId))return;
      if(ctx.channel&&String(o['Channel'])!==String(ctx.channel))return;
      rows.push(o);
    });
  });
  return {success:true,source:'09_PERFORMANCE',rows:rows.slice(0,maxRows),truncated:((idx&&idx.length>maxRows)||(!idx&&last-1>maxRows)),authorityVersion:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION};
}
function KOL_IDS_PA_valuesToObject_(v,h){var o={};h.forEach(function(x,i){o[x]=v[i];});return o;}

function KOL_IDS_PA_rebuildIndex_(campaignId){
  var sh=KOL_IDS_PA_ensureSheet_(),ix=KOL_IDS_PA_indexSheet_(),h=KOL_IDS_PA_headers_(),m={};h.forEach(function(x,i){m[x]=i;});
  var last=sh.getLastRow();
  var groups={};
  if(last>=2){
    var vals=sh.getRange(2,1,last-1,h.length).getValues();
    vals.forEach(function(v,i){
      var cid=String(v[m['Campaign ID']]||'');
      if(campaignId&&cid!==String(campaignId))return;
      var key=[v[m['Brand ID']],v[m['Campaign ID']],v[m['Analysis ID']],v[m['Creator ID']],v[m['Channel']]].join('|');
      if(!groups[key])groups[key]={brand:String(v[m['Brand ID']]||''),campaign:cid,analysis:String(v[m['Analysis ID']]||''),creator:String(v[m['Creator ID']]||''),channel:String(v[m['Channel']]||''),rows:[]};
      groups[key].rows.push(i+2);
    });
  }
  var old=ix.getLastRow()>1?ix.getRange(2,1,ix.getLastRow()-1,12).getValues():[];
  var keep=[];
  old.forEach(function(r){
    if(campaignId&&String(r[2])===String(campaignId))return;
    keep.push(r);
  });
  Object.keys(groups).forEach(function(key){
    var g=groups[key], rr=g.rows;
    keep.push([key,g.brand,g.campaign,g.analysis,g.creator,g.channel,rr[0],rr[rr.length-1],rr.length,new Date(),KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,JSON.stringify(rr)]);
  });
  if(ix.getLastRow()>1)ix.getRange(2,1,ix.getLastRow()-1,12).clearContent();
  if(keep.length)ix.getRange(2,1,keep.length,12).setValues(keep);
  ix.getRange(1,1,1,12).setValues([['Index Key','Brand ID','Campaign ID','Analysis ID','Creator ID','Channel','First Row','Last Row','Count','Updated At','Version','Row List']]);
  ix.setFrozenRows(1);
  return {success:true,groups:Object.keys(groups).length};
}

function KOL_IDS_PA_indexLookup_(ctx){
  var ix=KOL_IDS_PA_indexSheet_(),last=ix.getLastRow(); if(last<2)return null;
  var vals=ix.getRange(2,1,last-1,12).getValues(),best=[];
  vals.forEach(function(r){
    if(ctx.brandId&&String(r[1])!==String(ctx.brandId))return;
    if(ctx.campaignId&&String(r[2])!==String(ctx.campaignId))return;
    if(ctx.analysisId&&String(r[3])!==String(ctx.analysisId))return;
    if(ctx.creatorId&&String(r[4])!==String(ctx.creatorId))return;
    if(ctx.channel&&String(r[5])!==String(ctx.channel))return;
    var list=[];
    try{list=JSON.parse(String(r[11]||'[]'));}catch(e){list=[];}
    if(!Array.isArray(list)||!list.length){
      var first=Number(r[6]),lastRow=Number(r[7]),count=Number(r[8]);
      if(first>1&&count>0)for(var i=0;i<count;i++)list.push(first+i);
    }
    best=best.concat(list);
  });
  best.sort(function(a,b){return a-b;});
  return best.length?best:null;
}


function KOL_IDS_PA_legacyProjectionHeaders_(){
  return ['Performance ID','Campaign ID','Creator ID','Creator Name','Spend','Reach','Impressions','Views','Engagements','Clicks','Conversions','Revenue','Currency','Evidence','Reported Date','Notes','Created At','Status','Efficiency Score','CPM','CPE','CPC','ROAS','Actual Goal Score','Goal KPI','Performance Confidence','Likes','Comments','Shares','Saves'];
}
function KOL_IDS_PA_syncLegacyProjection_(){
  var ss=KOL_IDS_PA_ss_(), sh=ss.getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.SHEET);
  if(!sh)return {success:true,rows:0};
  var h=KOL_IDS_PA_headers_(), hm={};h.forEach(function(x,i){hm[x]=i;});
  var vals=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,h.length).getValues():[];
  var lh=KOL_IDS_PA_legacyProjectionHeaders_(), out=[];
  vals.forEach(function(v){
    function g(n){return hm[n]===undefined?'':v[hm[n]];}
    out.push([
      g('Performance ID'),g('Campaign ID'),g('Creator ID'),g('Creator Name'),g('Spend'),g('Reach'),g('Impressions'),g('Views'),g('Engagements'),g('Clicks'),g('Conversions'),g('Revenue'),g('Currency'),g('Evidence Quality'),g('Observed At'),g('Notes'),g('Recorded At'),
      g('Verification Status'),g('Channel Score'),g('Cost Per Thousand'),g('Cost Per Engagement'),g('Cost Per Click'),g('ROAS'),g('Campaign Business Score'),g('Objective'),g('Confidence'),g('Likes'),g('Comments'),g('Shares'),g('Saves')
    ]);
  });
  var legacy=ss.getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET)||ss.insertSheet(KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET);
  legacy.clearContents();
  legacy.getRange(1,1,1,lh.length).setValues([lh]);
  if(out.length)legacy.getRange(2,1,out.length,lh.length).setValues(out);
  legacy.setFrozenRows(1);
  return {success:true,rows:out.length,source:'09_PERFORMANCE',projection:'ENT_PERFORMANCE'};
}
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PA_SYNC_LEGACY_PROJECTION(){return KOL_IDS_PA_syncLegacyProjection_();}


function KOL_IDS_PA_legacyProjection_(ss){
  ss=ss||KOL_IDS_PA_ss_();
  try{KOL_IDS_PA_syncLegacyProjection_();}catch(e){}
  return ss.getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET);
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PA_migrateLegacy(){
  var ss=KOL_IDS_PA_ss_(),legacy=ss.getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET),authority=KOL_IDS_PA_ensureSheet_();
  if(!legacy||legacy.getLastRow()<2)return {success:true,status:'NO_LEGACY_DATA',migrated:0};
  var lh=legacy.getRange(1,1,1,legacy.getLastColumn()).getValues()[0].map(String),vals=legacy.getRange(2,1,legacy.getLastRow()-1,legacy.getLastColumn()).getValues(),m={};lh.forEach(function(x,i){m[x]=i;});
  function g(row,names){for(var i=0;i<names.length;i++)if(m[names[i]]!==undefined)return row[m[names[i]]];return '';}
  var campaignBrand={};
  var csh=ss.getSheetByName('ENT_CAMPAIGNS');
  if(csh&&csh.getLastRow()>1){
    var ch=csh.getRange(1,1,1,csh.getLastColumn()).getValues()[0].map(String),cm={};
    ch.forEach(function(x,i){cm[x]=i;});
    var cv=csh.getRange(2,1,csh.getLastRow()-1,csh.getLastColumn()).getValues();
    cv.forEach(function(row){var cid=cm['Campaign ID']!=null?String(row[cm['Campaign ID']]||''):'';if(cid)campaignBrand[cid]=cm['Brand ID']!=null?String(row[cm['Brand ID']]||''):'';});
  }
  var rows=vals.map(function(v){var cid=g(v,['Campaign ID']);return {
    performanceId:g(v,['Performance ID']),campaignId:cid,brandId:g(v,['Brand ID'])||campaignBrand[cid]||'',analysisId:g(v,['Analysis ID']),creatorId:g(v,['Creator ID']),creatorName:g(v,['Creator Name'])||g(v,['KOL Name']),
    spend:g(v,['Spend']),reach:g(v,['Reach']),impressions:g(v,['Impressions']),views:g(v,['Views']),engagements:g(v,['Engagements']),clicks:g(v,['Clicks']),
    conversions:g(v,['Conversions']),revenue:g(v,['Revenue']),currency:g(v,['Currency'])||'THB',evidenceQuality:g(v,['Evidence']),observedAt:g(v,['Reported Date']),source:'LEGACY_ENT_PERFORMANCE',sourceId:g(v,['Performance ID']),
    verificationStatus:g(v,['Status'])||'UNVERIFIED',objective:g(v,['Goal KPI'])||g(v,['Objective']),likes:g(v,['Likes']),comments:g(v,['Comments']),shares:g(v,['Shares']),saves:g(v,['Saves'])
  };}).filter(function(r){return r.campaignId&&r.brandId&&r.creatorId;});
  var result=KOL_IDS_PA_saveRows_({rows:rows,skipLegacyMigration:true}); return {success:result.success,status:'MIGRATED_TO_AUTHORITY',migrated:result.inserted+result.updated,skipped:vals.length-rows.length,authority:result};
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_HEALTH(){
  var sh=KOL_IDS_PA_ensureSheet_(),ix=KOL_IDS_PA_indexSheet_(),last=sh.getLastRow(),legacy=KOL_IDS_PA_ss_().getSheetByName(KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET);
  return {success:true,authorityVersion:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,canonicalSheet:KOL_IDS_PERFORMANCE_AUTHORITY.SHEET,canonicalRows:Math.max(0,last-1),indexRows:Math.max(0,ix.getLastRow()-1),legacyRows:legacy?Math.max(0,legacy.getLastRow()-1):0,legacyIsInputOnly:true,boundedReadMax:KOL_IDS_PERFORMANCE_AUTHORITY.MAX_READ_ROWS,kpiRuleCount:Object.keys(KOL_IDS_PERFORMANCE_KPI_RULES).length};
}
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_QA(){
  var tests=[],a=KOL_IDS_PA_calculate_({channel:'TIKTOK',objective:'AWARENESS',impressions:100000,reach:80000,views:73900,likes:5000,comments:500,shares:400,completionRatePct:70});
  var b=KOL_IDS_PA_calculate_({channel:'ONLINE_ADS',objective:'SALES',impressions:100000,clicks:3000,conversions:150,spend:30000,revenue:120000});
  tests.push({name:'Two-layer bounded score',pass:(a.channelScore===null||a.channelScore>=0&&a.channelScore<=100)&& (a.normalizedScore===null||a.normalizedScore>=0&&a.normalizedScore<=100)});
  tests.push({name:'Objective + channel formula selection',pass:b.channelScore!==null&&b.objective==='SALES'&&b.channel==='ONLINE_ADS'});
  tests.push({name:'Single canonical authority',pass:KOL_IDS_PERFORMANCE_AUTHORITY.SHEET==='09_PERFORMANCE'&&KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET==='ENT_PERFORMANCE'});
  tests.push({name:'Bounded read contract',pass:KOL_IDS_PERFORMANCE_AUTHORITY.MAX_READ_ROWS<=1000});
  return {success:tests.every(function(x){return x.pass;}),version:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,tests:tests};
}

/* Compatibility facade: all new performance writes/reads route here. */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_AUTHORITY_SAVE(payload){ return KOL_IDS_PA_saveRows_(payload||{}); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_AUTHORITY_READ(payload){ payload=payload||{}; return KOL_IDS_PA_read_(payload, payload.maxRows); }
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_AUTHORITY_MIGRATE_LEGACY(){ return KOL_IDS_PA_migrateLegacy(); }

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA_110(){
  var tests=[];
  tests.push({name:'Canonical performance authority',pass:KOL_IDS_PERFORMANCE_AUTHORITY.SHEET==='09_PERFORMANCE'});
  tests.push({name:'Legacy is projection/input only',pass:KOL_IDS_PERFORMANCE_AUTHORITY.LEGACY_SHEET==='ENT_PERFORMANCE'});
  tests.push({name:'Channel + objective KPI engine',pass:Object.keys(KOL_IDS_PERFORMANCE_KPI_RULES).length>=5});
  tests.push({name:'Two-layer bounded score',pass:KOL_IDS_PERFORMANCE_AUTHORITY.SCORE_MIN===0&&KOL_IDS_PERFORMANCE_AUTHORITY.SCORE_MAX===100});
  tests.push({name:'Bounded read',pass:KOL_IDS_PERFORMANCE_AUTHORITY.MAX_READ_ROWS<=1000});
  tests.push({name:'Keyed index contract',pass:KOL_IDS_PERFORMANCE_AUTHORITY.INDEX_SHEET==='ENT_PERFORMANCE_INDEX'});
  tests.push({name:'Authority facade',pass:typeof KOL_IDS_PERF_AUTHORITY_SAVE==='function'&&typeof KOL_IDS_PERF_AUTHORITY_READ==='function'});
  tests.push({name:'Legacy compatibility projection',pass:typeof KOL_IDS_PA_syncLegacyProjection_==='function'});
  return {success:tests.every(function(t){return t.pass;}),version:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,tests:tests};
}


function KOL_IDS_PA_SYNC_LEGACY_PROJECTION() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PA_SYNC_LEGACY_PROJECTION', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PA_SYNC_LEGACY_PROJECTION, this, arguments);
}


function KOL_IDS_PA_migrateLegacy() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PA_migrateLegacy', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PA_migrateLegacy, this, arguments);
}


function KOL_IDS_PERFORMANCE_AUTHORITY_HEALTH() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERFORMANCE_AUTHORITY_HEALTH', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_HEALTH, this, arguments);
}


function KOL_IDS_PERFORMANCE_AUTHORITY_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERFORMANCE_AUTHORITY_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_QA, this, arguments);
}


function KOL_IDS_PERF_AUTHORITY_SAVE() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERF_AUTHORITY_SAVE', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_AUTHORITY_SAVE, this, arguments);
}


function KOL_IDS_PERF_AUTHORITY_READ() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERF_AUTHORITY_READ', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_AUTHORITY_READ, this, arguments);
}


function KOL_IDS_PERF_AUTHORITY_MIGRATE_LEGACY() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERF_AUTHORITY_MIGRATE_LEGACY', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERF_AUTHORITY_MIGRATE_LEGACY, this, arguments);
}


function KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA_110() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA_110', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA_110, this, arguments);
}
