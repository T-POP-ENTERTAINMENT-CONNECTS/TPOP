/**
 * KOL IDS™ 1.1.0 — Architecture Hardening
 * Canonical production contract for identity, state pointers and safe sheet I/O.
 *
 * Rules:
 *  - Creator ID is the immutable creator identity; name is display-only.
 *  - UserProperties contains pointers/session metadata only, never canonical objects.
 *  - Canonical context lives in ENT_CANONICAL_STATE in the active workspace.
 *  - Admin mutations require the authorized Google admin identity. Sales approval does not require a separate PIN.
 *  - Sheet reads prefer bounded ranges / indexed columns over whole-sheet scans.
 */
var KOL_IDS_ARCHITECTURE = Object.freeze({
  RELEASE: '1.1.0',
  CANONICAL_STATE_SHEET: 'ENT_CANONICAL_STATE',
  CANONICAL_STATE_KEY: 'CANONICAL_CONTEXT',
  CANONICAL_CHUNK_SIZE: 45000,
  POINTER_KEYS: Object.freeze({
    ACTIVE_REVISION: 'KOL_IDS_CANONICAL_ACTIVE_REVISION',
    ACTIVE_HASH: 'KOL_IDS_CANONICAL_ACTIVE_HASH',
    STATE_SHEET: 'KOL_IDS_CANONICAL_STATE_SHEET',
    MIGRATED: 'KOL_IDS_CANONICAL_STATE_MIGRATED_V100'
  })
});

function KOL_IDS_ARCH_getWorkspace_(){
  if(typeof KOL_IDS_SYSTEM_getSpreadsheet_==='function'){
    var ss=KOL_IDS_SYSTEM_getSpreadsheet_();
    if(ss)return ss;
  }
  var wid='';
  try{wid=PropertiesService.getUserProperties().getProperty('KOL_IDS_WORKSPACE_ID')||'';}catch(e){}
  if(wid)return SpreadsheetApp.openById(wid);
  var active=SpreadsheetApp.getActiveSpreadsheet();
  if(active)return active;
  throw new Error('KOL IDS™: Active workspace is unavailable.');
}

function KOL_IDS_ARCH_stateSheet_(){
  var ss=KOL_IDS_ARCH_getWorkspace_();
  var sh=ss.getSheetByName(KOL_IDS_ARCHITECTURE.CANONICAL_STATE_SHEET);
  if(!sh)sh=ss.insertSheet(KOL_IDS_ARCHITECTURE.CANONICAL_STATE_SHEET);
  var headers=['Key','Chunk','Chunk Count','Value','Revision','Updated At','Context Hash'];
  if(sh.getLastRow()===0){sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);}
  else if(sh.getLastColumn()<headers.length){sh.insertColumnsAfter(Math.max(1,sh.getLastColumn()),headers.length-sh.getLastColumn());sh.getRange(1,1,1,headers.length).setValues([headers]);}
  return sh;
}

function KOL_IDS_ARCH_readCanonical_(){
  var sh=KOL_IDS_ARCH_stateSheet_(), last=sh.getLastRow();
  if(last<2)return null;
  var width=Math.max(7,sh.getLastColumn());
  var rows=sh.getRange(2,1,last-1,width).getValues();
  var chunks=[];
  rows.forEach(function(r){if(String(r[0])===KOL_IDS_ARCHITECTURE.CANONICAL_STATE_KEY)chunks.push({n:Number(r[1])||0,count:Number(r[2])||0,value:String(r[3]||''),revision:Number(r[4])||0,updatedAt:r[5],hash:String(r[6]||'')});});
  if(!chunks.length)return null;
  chunks.sort(function(a,b){return a.n-b.n;});
  var expected=chunks[0].count||chunks.length;
  if(chunks.length<expected)return null;
  var raw=chunks.map(function(x){return x.value;}).join('');
  try{return {context:JSON.parse(raw),revision:chunks[0].revision,updatedAt:chunks[0].updatedAt,hash:chunks[0].hash};}catch(e){return null;}
}

function KOL_IDS_ARCH_writeCanonical_(ctx){
  var sh=KOL_IDS_ARCH_stateSheet_(), raw=JSON.stringify(ctx), size=KOL_IDS_ARCHITECTURE.CANONICAL_CHUNK_SIZE;
  var count=Math.max(1,Math.ceil(raw.length/size)), revision=Number(ctx&&ctx.meta&&ctx.meta.revision||0), hash=String(ctx&&ctx.meta&&ctx.meta.contextHash||'');
  var key=KOL_IDS_ARCHITECTURE.CANONICAL_STATE_KEY, last=sh.getLastRow(), existing=[];
  if(last>=2){
    // Read only column A first; avoid copying the whole state sheet on every save.
    var keys=sh.getRange(2,1,last-1,1).getValues();
    for(var j=0;j<keys.length;j++) if(String(keys[j][0])===key) existing.push(j+2);
  }
  var now=new Date(), values=[];
  for(var i=0;i<count;i++)values.push([key,i,count,raw.slice(i*size,(i+1)*size),revision,now,hash]);
  // Reuse the existing canonical block when possible. This avoids clearing and rewriting
  // unrelated rows and is materially faster for repeated Save operations.
  if(existing.length===count){
    var contiguous=true; for(var e=1;e<existing.length;e++) if(existing[e]!==existing[0]+e){contiguous=false;break;}
    if(contiguous) sh.getRange(existing[0],1,count,7).setValues(values);
    else { for(var q=0;q<count;q++) sh.getRange(existing[q],1,1,7).setValues([values[q]]); }
  } else {
    // Count changed: remove only old canonical rows, preserve all other state/audit rows.
    for(var x=existing.length-1;x>=0;x--) sh.deleteRow(existing[x]);
    var start=sh.getLastRow()+1; sh.getRange(start,1,count,7).setValues(values);
  }
  var p=PropertiesService.getUserProperties();
  p.setProperty(KOL_IDS_ARCHITECTURE.POINTER_KEYS.ACTIVE_REVISION,String(revision));
  p.setProperty(KOL_IDS_ARCHITECTURE.POINTER_KEYS.ACTIVE_HASH,hash);
  p.setProperty(KOL_IDS_ARCHITECTURE.POINTER_KEYS.STATE_SHEET,KOL_IDS_ARCHITECTURE.CANONICAL_STATE_SHEET);
  p.setProperty(KOL_IDS_ARCHITECTURE.POINTER_KEYS.MIGRATED,'1');
  try{CacheService.getUserCache().put('KOL_IDS_CANONICAL_CONTEXT_CACHE',raw,300);}catch(ignoreCache){}
  return ctx;
}

function KOL_IDS_ARCH_getCanonicalContext_(){
  // Fast path: the user cache is updated on every canonical write.
  try{var cached=CacheService.getUserCache().get('KOL_IDS_CANONICAL_CONTEXT_CACHE'); if(cached)return JSON.parse(cached);}catch(ignoreCache){}
  var found=KOL_IDS_ARCH_readCanonical_();
  if(found&&found.context){try{CacheService.getUserCache().put('KOL_IDS_CANONICAL_CONTEXT_CACHE',JSON.stringify(found.context),300);}catch(ignoreCache2){} return found.context;}
  // One-time migration from the old UserProperties object.
  var legacy=null;
  try{legacy=JSON.parse(PropertiesService.getUserProperties().getProperty('KOL_IDS_CANONICAL_FLOW_CONTEXT')||'');}catch(e){}
  if(legacy&&typeof legacy==='object'){
    KOL_IDS_ARCH_writeCanonical_(legacy);
    return legacy;
  }
  return null;
}

function KOL_IDS_ARCH_assertAdminIdentity_(){
  if(typeof KOL_IDS_SYSTEM_requireAdmin_==='function')KOL_IDS_SYSTEM_requireAdmin_();
  else if(typeof KOL_IDS_CORE_assertAdmin_==='function')KOL_IDS_CORE_assertAdmin_();
  return true;
}

function KOL_IDS_ARCH_assertAdminIdentityAndPin_(pin){
  if(typeof KOL_IDS_SYSTEM_requireAdmin_==='function')KOL_IDS_SYSTEM_requireAdmin_();
  else if(typeof KOL_IDS_CORE_assertAdmin_==='function')KOL_IDS_CORE_assertAdmin_();
  var expected=String(PropertiesService.getScriptProperties().getProperty((typeof KOL_IDS!=='undefined'&&KOL_IDS.ADMIN_PIN)||'KOL_IDS_CORE_ADMIN_PIN')||'');
  if(!expected||String(pin||'')!==expected)throw new Error('Admin PIN is invalid.');
  return true;
}

function KOL_IDS_ARCH_creatorId_(creator){
  var id=creator&&creator.creatorId!=null?creator.creatorId:(creator&&creator.id!=null?creator.id:'');
  return String(id||'').trim();
}

function KOL_IDS_ARCH_normalizeCreator_(creator,index){
  var c=creator&&typeof creator==='object'?creator:{};
  var id=KOL_IDS_ARCH_creatorId_(c);
  if(!id)id='CR-'+Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();
  c.creatorId=id;
  if(!c.id)c.id=id;
  c.name=String(c.name==null?'':c.name).trim();
  return c;
}

function KOL_IDS_ARCH_boundedValues_(sheet,startRow){
  if(!sheet||sheet.getLastRow()<startRow)return [];
  var rows=sheet.getLastRow()-startRow+1, cols=sheet.getLastColumn();
  if(cols<1)return [];
  return sheet.getRange(startRow,1,rows,cols).getValues();
}

function KOL_IDS_ARCH_findRowByColumnValue_(sheet,column,value,startRow){
  if(!sheet||sheet.getLastRow()<(startRow||2))return -1;
  var r=sheet.getRange(startRow||2,column,Math.max(1,sheet.getLastRow()-(startRow||2)+1),1);
  var found=r.createTextFinder(String(value)).matchEntireCell(true).findNext();
  return found?found.getRow():-1;
}

function KOL_IDS_ARCH_batchAppend_(sheet,rows){
  if(!rows||!rows.length)return 0;
  var start=sheet.getLastRow()+1, cols=rows[0].length;
  sheet.getRange(start,1,rows.length,cols).setValues(rows);
  return rows.length;
}

function KOL_IDS_ARCH_readIndex_(sheet,keyColumn,startRow){
  var out={}, first=startRow||2, last=sheet.getLastRow();
  if(last<first)return out;
  var values=sheet.getRange(first,keyColumn,last-first+1,1).getValues();
  values.forEach(function(r,i){var k=String(r[0]||'').trim();if(k)out[k]=first+i;});
  return out;
}
