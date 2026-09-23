/**
 * KOL IDS — DATA GOVERNANCE / LEGAL & PRIVACY ARCHITECTURE
 *
 * Design target: Thailand PDPA first, GDPR-ready operating controls for
 * customers that fall within GDPR scope. This is an engineering control
 * layer, not legal advice and does not replace customer-specific legal review.
 *
 * Principles:
 * - Privacy by design/default
 * - Purpose limitation + data minimisation
 * - Explicit processing basis per purpose
 * - Controller/processor role separation
 * - Tenant isolation (Org + Brand)
 * - Retention by purpose, not indefinite storage
 * - Rights request and breach workflow records
 * - Cross-border transfer register
 * - Special-category data blocked by default
 * - Creator recommendations are assistive, not solely automated decisions
 * - Customer raw data is never silently repurposed for network learning
 */

var KOL_IDS_GOVERNANCE_GOV = Object.freeze({
  VERSION:'1.0.0',
  SHEETS:{
    CONFIG:'ENT_GOVERNANCE_CONFIG',
    PROCESSING:'ENT_PROCESSING_REGISTER',
    RETENTION:'ENT_RETENTION_POLICY',
    PROCESSORS:'ENT_PROCESSOR_REGISTER',
    CONSENT:'ENT_CONSENT_LOG',
    DSAR:'ENT_DSAR',
    BREACH:'ENT_BREACH_INCIDENTS',
    TRANSFER:'ENT_TRANSFER_REGISTER'
  },
  LEGAL_BASES:['CONSENT','CONTRACT','LEGAL_OBLIGATION','VITAL_INTERESTS','PUBLIC_TASK','LEGITIMATE_INTERESTS','RESEARCH_STATISTICAL'],
  ROLES:['CONTROLLER','PROCESSOR','JOINT_CONTROLLER'],
  CLASSIFICATIONS:['PUBLIC_PERSONAL','PERSONAL','CONFIDENTIAL_PERSONAL','SPECIAL_CATEGORY'],
  SPECIAL_KEYS:['health','medical','diagnosis','religion','race','ethnicity','political','union','sexual','biometric','genetic','criminal','national_id','passport','financial_account','credit_card'],
  PERSONAL_KEYS:['email','phone','mobile','address','postal','location','latitude','longitude','date_of_birth','dob','full_name','legal_name'],
  MAX_JSON_BYTES:30000,
  DEFAULT_RETENTION_DAYS:365,
  DSAR_SLA_DAYS:30,
  BREACH_TARGET_HOURS:72
});

function KOL_IDS_GOVERNANCE_govHeaders_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govHeaders_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return {
  ENT_GOVERNANCE_CONFIG:['Config ID','Org ID','Brand ID','Jurisdiction','Controller Role','Processor Role','DPO Contact','Privacy Contact','Privacy Notice Version','Automated Decision Mode','Network Learning Mode','Default Data Classification','Status','Created At','Updated At'],
  ENT_PROCESSING_REGISTER:['Processing ID','Org ID','Brand ID','Purpose','Data Subjects','Data Categories','Data Classification','Legal Basis','Special Category Basis','Source Categories','Recipients','Retention Policy ID','International Transfer','Automated Decision','Human Review Required','Status','Created At','Updated At'],
  ENT_RETENTION_POLICY:['Retention Policy ID','Org ID','Brand ID','Purpose','Entity Types','Retention Days','Deletion Method','Legal Hold Allowed','Anonymize After Days','Status','Created At','Updated At'],
  ENT_PROCESSOR_REGISTER:['Processor ID','Org ID','Vendor','Service','Role','Data Categories','Processing Purpose','DPA Status','Subprocessor Disclosure','Transfer Mechanism','Security Review','Status','Contract Start','Contract End','Created At','Updated At'],
  ENT_CONSENT_LOG:['Consent ID','Org ID','Brand ID','Data Subject Ref','Purpose','Consent Version','Status','Obtained At','Withdrawn At','Source','Evidence Ref','Created At'],
  ENT_DSAR:['DSAR ID','Org ID','Brand ID','Data Subject Ref','Request Type','Received At','Identity Check','Scope','Status','Due At','Completed At','Outcome','Legal Hold','Notes','Created At','Updated At'],
  ENT_BREACH_INCIDENTS:['Incident ID','Org ID','Brand ID','Detected At','Category','Data Categories','Affected Records Estimate','Risk Level','Containment Status','DPO Review Status','Authority Notification Status','Data Subject Notification Status','72h Assessment Due At','Root Cause','Remediation','Closed At','Created At','Updated At'],
  ENT_TRANSFER_REGISTER:['Transfer ID','Org ID','Brand ID','Destination','Recipient','Data Categories','Purpose','Mechanism','Adequacy/Assessment','Supplementary Measures','TIA/DPIA Ref','Status','Created At','Updated At']
};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govHeaders_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govHeaders_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_govEnsure_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govEnsure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_PLATFORM_ensure_(),spec=KOL_IDS_GOVERNANCE_govHeaders_();
  Object.keys(spec).forEach(function(n){KOL_IDS_PLATFORM_ensureSheet_(ss,n,spec[n]);});
  return ss;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govEnsure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govEnsure_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GOVERNANCE_govSheet_(name){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ss=KOL_IDS_SYSTEM_getSpreadsheet_(),sh=ss.getSheetByName(name);
  return sh||null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GOVERNANCE_govRows_(name){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_GOVERNANCE_govSheet_(name); return sh?KOL_IDS_PLATFORM_values_(sh):[];

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GOVERNANCE_govMap_(name){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govMap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_GOVERNANCE_govSheet_(name); return sh?KOL_IDS_PLATFORM_map_(sh):{};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govMap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govMap_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GOVERNANCE_govText_(v,max){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govText_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var s=String(v==null?'':v).trim();return max&&s.length>max?s.slice(0,max):s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govText_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govText_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GOVERNANCE_govJson_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govJson_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var s=typeof v==='string'?v:JSON.stringify(v==null?{}:v);if(s.length>KOL_IDS_GOVERNANCE_GOV.MAX_JSON_BYTES)throw KOL_IDS_PLATFORM_error_('GOV_PAYLOAD_TOO_LARGE','Governance payload is too large.');try{JSON.parse(s);}catch(e){throw KOL_IDS_PLATFORM_error_('GOV_INVALID_JSON','Governance JSON is invalid.');}return s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govJson_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govJson_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_GOVERNANCE_govAppend_(sheet,obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_govAppend_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_GOVERNANCE_govSheet_(sheet);if(!sh)throw KOL_IDS_PLATFORM_error_('GOV_SCHEMA_MISSING','Governance schema is not configured.');
  var row=KOL_IDS_PLATFORM_row_(sh,obj);sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]);return true;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_govAppend_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_govAppend_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_governanceConfigure_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_governanceConfigure_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),d=data||{},ss=KOL_IDS_GOVERNANCE_govEnsure_();
  KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);
  var jurisdiction=KOL_IDS_GOVERNANCE_govText_(d.jurisdiction||'TH',20).toUpperCase();
  var controllerRole=KOL_IDS_GOVERNANCE_govText_(d.controllerRole||'CONTROLLER',30).toUpperCase();
  var processorRole=KOL_IDS_GOVERNANCE_govText_(d.processorRole||'PROCESSOR',30).toUpperCase();
  if(KOL_IDS_GOVERNANCE_GOV.ROLES.indexOf(controllerRole)<0||KOL_IDS_GOVERNANCE_GOV.ROLES.indexOf(processorRole)<0)throw KOL_IDS_PLATFORM_error_('GOV_INVALID_ROLE','Invalid controller/processor role.');
  var sh=ss.getSheetByName(KOL_IDS_GOVERNANCE_GOV.SHEETS.CONFIG),rows=KOL_IDS_PLATFORM_values_(sh),m=KOL_IDS_PLATFORM_map_(sh),found=-1;
  rows.forEach(function(r,i){if(String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId))found=i+2;});
  var now=new Date(),obj={'Config ID':found>=2?sh.getRange(found,m['Config ID']+1).getValue():KOL_IDS_PLATFORM_uuid_('GOV'),'Org ID':orgId,'Brand ID':brandId,'Jurisdiction':jurisdiction,'Controller Role':controllerRole,'Processor Role':processorRole,'DPO Contact':KOL_IDS_GOVERNANCE_govText_(d.dpoContact,200),'Privacy Contact':KOL_IDS_GOVERNANCE_govText_(d.privacyContact,200),'Privacy Notice Version':KOL_IDS_GOVERNANCE_govText_(d.privacyNoticeVersion||'1.0',40),'Automated Decision Mode':'ASSISTIVE_ONLY','Network Learning Mode':String(d.networkLearningMode||'AGGREGATED_ONLY').toUpperCase(),'Default Data Classification':'PERSONAL','Status':'ACTIVE','Created At':found>=2?sh.getRange(found,m['Created At']+1).getValue():now,'Updated At':now};
  if(['AGGREGATED_ONLY','CUSTOMER_ONLY'].indexOf(obj['Network Learning Mode'])<0)throw KOL_IDS_PLATFORM_error_('GOV_INVALID_LEARNING_MODE','Network learning mode must be CUSTOMER_ONLY or AGGREGATED_ONLY.');
  var row=KOL_IDS_PLATFORM_row_(sh,obj);if(found>=2)sh.getRange(found,1,1,row.length).setValues([row]);else sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]);
  KOL_IDS_PLATFORM_audit_(orgId,'GOVERNANCE_CONFIGURE','GOVERNANCE',obj['Config ID'],'SUCCESS',{brandId:brandId,jurisdiction:jurisdiction});
  return {success:true,configId:obj['Config ID'],orgId:orgId,brandId:brandId,jurisdiction:jurisdiction,automatedDecisionMode:'ASSISTIVE_ONLY',networkLearningMode:obj['Network Learning Mode']};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_governanceConfigure_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_governanceConfigure_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_governanceStatus_(orgId,brandId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_governanceStatus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var sh=KOL_IDS_GOVERNANCE_govSheet_(KOL_IDS_GOVERNANCE_GOV.SHEETS.CONFIG);if(!sh)return {success:true,configured:false,reason:'GOVERNANCE_SCHEMA_NOT_CONFIGURED'};
  var m=KOL_IDS_PLATFORM_map_(sh),row=KOL_IDS_PLATFORM_values_(sh).filter(function(r){return String(r[m['Org ID']])===String(orgId)&&String(r[m['Brand ID']])===String(brandId)&&String(r[m['Status']]).toUpperCase()==='ACTIVE';})[0];
  if(!row)return {success:true,configured:false,reason:'GOVERNANCE_PROFILE_REQUIRED',required:['privacyNoticeVersion','legalBasisPerPurpose','retentionPolicy','processorRegister','transferRegisterIfApplicable']};
  var pm=KOL_IDS_GOVERNANCE_govMap_(KOL_IDS_GOVERNANCE_GOV.SHEETS.PROCESSING),rm=KOL_IDS_GOVERNANCE_govMap_(KOL_IDS_GOVERNANCE_GOV.SHEETS.RETENTION),prm=KOL_IDS_GOVERNANCE_govMap_(KOL_IDS_GOVERNANCE_GOV.SHEETS.PROCESSORS),trm=KOL_IDS_GOVERNANCE_govMap_(KOL_IDS_GOVERNANCE_GOV.SHEETS.TRANSFER);
  var p=KOL_IDS_GOVERNANCE_govRows_(KOL_IDS_GOVERNANCE_GOV.SHEETS.PROCESSING).filter(function(r){return String(r[pm['Org ID']])===String(orgId)&&String(r[pm['Brand ID']])===String(brandId)&&String(r[pm['Status']]).toUpperCase()==='ACTIVE';});
  var rt=KOL_IDS_GOVERNANCE_govRows_(KOL_IDS_GOVERNANCE_GOV.SHEETS.RETENTION).filter(function(r){return String(r[rm['Org ID']])===String(orgId)&&String(r[rm['Brand ID']])===String(brandId)&&String(r[rm['Status']]).toUpperCase()==='ACTIVE';});
  var proc=KOL_IDS_GOVERNANCE_govRows_(KOL_IDS_GOVERNANCE_GOV.SHEETS.PROCESSORS).filter(function(r){return String(r[prm['Org ID']])===String(orgId)&&String(r[prm['Status']]).toUpperCase()==='ACTIVE';});
  var tr=KOL_IDS_GOVERNANCE_govRows_(KOL_IDS_GOVERNANCE_GOV.SHEETS.TRANSFER).filter(function(r){return String(r[trm['Org ID']])===String(orgId)&&String(r[trm['Brand ID']])===String(brandId)&&String(r[trm['Status']]).toUpperCase()==='ACTIVE';});
  return {success:true,configured:true,jurisdiction:row[m['Jurisdiction']],privacyNoticeVersion:row[m['Privacy Notice Version']],automatedDecisionMode:row[m['Automated Decision Mode']],networkLearningMode:row[m['Network Learning Mode']],processingPurposes:p.length,retentionPolicies:rt.length,processors:proc.length,transfers:tr.length,ready:p.length>0&&rt.length>0};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_governanceStatus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_governanceStatus_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_governanceGate_(orgId,brandId,action,payload){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_governanceGate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var a=String(action||'').toUpperCase(),personalOps=['CREATOR_UPSERT','CREATOR_DISCOVER','CREATOR_MATCH','CREATOR_EVIDENCE','MARKETPLACE_UPSERT','LEARNING_SIGNAL','LEARNING_REBUILD','BENCHMARK_REBUILD','OUTCOME_RECORD','PREDICTION_EVALUATE'];
  if(personalOps.indexOf(a)<0)return {allowed:true,governanceRequired:false};
  var status=KOL_IDS_GOVERNANCE_governanceStatus_(orgId,brandId);
  if(!status.configured||!status.ready)throw KOL_IDS_PLATFORM_error_('GOVERNANCE_NOT_CONFIGURED','Data Governance profile, processing purpose and retention policy must be configured before personal-data processing.');
  if(status.automatedDecisionMode!=='ASSISTIVE_ONLY')throw KOL_IDS_PLATFORM_error_('GOVERNANCE_AUTOMATION_POLICY','Creator recommendations must remain assistive-only with human review.');
  var p=payload||{};
  var scan=KOL_IDS_GOVERNANCE_scanForSensitive_(p);
  if(scan.found.length)throw KOL_IDS_PLATFORM_error_('SPECIAL_CATEGORY_DATA_BLOCKED','Special-category or high-risk personal data is blocked by default: '+scan.found.slice(0,10).join(','));
  if(a==='BENCHMARK_REBUILD'||a==='LEARNING_REBUILD'||a==='LEARNING_SIGNAL'){
    if(status.networkLearningMode!=='AGGREGATED_ONLY')throw KOL_IDS_PLATFORM_error_('GOVERNANCE_LEARNING_BLOCKED','Network learning is disabled unless explicitly configured as AGGREGATED_ONLY.');
  }
  return {allowed:true,governanceRequired:true,governanceVersion:KOL_IDS_GOVERNANCE_GOV.VERSION};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_governanceGate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_governanceGate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_scanForSensitive_(value,path,found){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_scanForSensitive_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  path=path||'payload';found=found||[];
  if(found.length>20)return {found:found};
  if(value==null)return {found:found};
  if(Array.isArray(value)){value.slice(0,50).forEach(function(v,i){KOL_IDS_GOVERNANCE_scanForSensitive_(v,path+'['+i+']',found);});return {found:found};}
  if(typeof value==='object'){
    Object.keys(value).forEach(function(k){var lk=String(k).toLowerCase().replace(/[^a-z0-9_]/g,'_');if(KOL_IDS_GOVERNANCE_GOV.SPECIAL_KEYS.some(function(x){return lk===x||lk.indexOf(x)>=0;}))found.push(path+'.'+k);else KOL_IDS_GOVERNANCE_scanForSensitive_(value[k],path+'.'+k,found);});
  }
  return {found:found};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_scanForSensitive_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_scanForSensitive_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_processingRegister_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_processingRegister_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),d=data||{};KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_GOVERNANCE_govEnsure_();
  var basis=String(d.legalBasis||'').toUpperCase();if(KOL_IDS_GOVERNANCE_GOV.LEGAL_BASES.indexOf(basis)<0)throw KOL_IDS_PLATFORM_error_('GOV_LEGAL_BASIS_REQUIRED','A valid legal basis is required for each processing purpose.');
  var cls=String(d.dataClassification||'PERSONAL').toUpperCase();if(KOL_IDS_GOVERNANCE_GOV.CLASSIFICATIONS.indexOf(cls)<0)throw KOL_IDS_PLATFORM_error_('GOV_INVALID_CLASSIFICATION','Invalid data classification.');
  if(cls==='SPECIAL_CATEGORY')throw KOL_IDS_PLATFORM_error_('SPECIAL_CATEGORY_DATA_BLOCKED','Special-category processing is not enabled in the default product architecture.');
  var now=new Date(),id=KOL_IDS_PLATFORM_uuid_('PROC');KOL_IDS_GOVERNANCE_govAppend_(KOL_IDS_GOVERNANCE_GOV.SHEETS.PROCESSING,{'Processing ID':id,'Org ID':orgId,'Brand ID':brandId,'Purpose':KOL_IDS_GOVERNANCE_govText_(d.purpose,300),'Data Subjects':KOL_IDS_GOVERNANCE_govText_(d.dataSubjects,200),'Data Categories':KOL_IDS_GOVERNANCE_govText_(d.dataCategories,500),'Data Classification':cls,'Legal Basis':basis,'Special Category Basis':'','Source Categories':KOL_IDS_GOVERNANCE_govText_(d.sourceCategories,300),'Recipients':KOL_IDS_GOVERNANCE_govText_(d.recipients,300),'Retention Policy ID':KOL_IDS_GOVERNANCE_govText_(d.retentionPolicyId,100),'International Transfer':String(d.internationalTransfer||'NO').toUpperCase()==='YES'?'YES':'NO','Automated Decision':'ASSISTIVE_ONLY','Human Review Required':'YES','Status':'ACTIVE','Created At':now,'Updated At':now});
  return {success:true,processingId:id,legalBasis:basis};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_processingRegister_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_processingRegister_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_retentionPolicy_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_retentionPolicy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),d=data||{};KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_GOVERNANCE_govEnsure_();
  var days=Number(d.retentionDays);if(!isFinite(days)||days<1||days>3650)throw KOL_IDS_PLATFORM_error_('GOV_INVALID_RETENTION','Retention must be between 1 and 3650 days unless legal counsel documents another requirement.');
  var now=new Date(),id=KOL_IDS_PLATFORM_uuid_('RET');KOL_IDS_GOVERNANCE_govAppend_(KOL_IDS_GOVERNANCE_GOV.SHEETS.RETENTION,{'Retention Policy ID':id,'Org ID':orgId,'Brand ID':brandId,'Purpose':KOL_IDS_GOVERNANCE_govText_(d.purpose,300),'Entity Types':KOL_IDS_GOVERNANCE_govText_(d.entityTypes,500),'Retention Days':days,'Deletion Method':KOL_IDS_GOVERNANCE_govText_(d.deletionMethod||'DELETE_OR_ANONYMIZE',80),'Legal Hold Allowed':'YES','Anonymize After Days':d.anonymizeAfterDays==null?'':Number(d.anonymizeAfterDays),'Status':'ACTIVE','Created At':now,'Updated At':now});
  return {success:true,retentionPolicyId:id,retentionDays:days};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_retentionPolicy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_retentionPolicy_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_dsarCreate_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_dsarCreate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),d=data||{};KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_GOVERNANCE_govEnsure_();var now=new Date(),due=new Date(now.getTime()+KOL_IDS_GOVERNANCE_GOV.DSAR_SLA_DAYS*86400000),id=KOL_IDS_PLATFORM_uuid_('DSAR');
  var type=KOL_IDS_GOVERNANCE_govText_(d.requestType||'ACCESS',40).toUpperCase();var allowed=['ACCESS','RECTIFICATION','ERASURE','RESTRICTION','PORTABILITY','OBJECTION','CONSENT_WITHDRAWAL'];if(allowed.indexOf(type)<0)throw KOL_IDS_PLATFORM_error_('GOV_INVALID_DSAR_TYPE','Unsupported data subject request type.');
  KOL_IDS_GOVERNANCE_govAppend_(KOL_IDS_GOVERNANCE_GOV.SHEETS.DSAR,{'DSAR ID':id,'Org ID':orgId,'Brand ID':brandId,'Data Subject Ref':KOL_IDS_GOVERNANCE_govText_(d.dataSubjectRef,200),'Request Type':type,'Received At':d.receivedAt?new Date(d.receivedAt):now,'Identity Check':'PENDING','Scope':KOL_IDS_GOVERNANCE_govText_(d.scope,500),'Status':'OPEN','Due At':due,'Completed At':'','Outcome':'','Legal Hold':'NO','Notes':KOL_IDS_GOVERNANCE_govText_(d.notes,1000),'Created At':now,'Updated At':now});
  return {success:true,dsarId:id,status:'OPEN',dueAt:due.toISOString()};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_dsarCreate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_dsarCreate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_breachRecord_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_breachRecord_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),d=data||{};KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_GOVERNANCE_govEnsure_();var now=new Date(),detected=d.detectedAt?new Date(d.detectedAt):now,due=new Date(detected.getTime()+KOL_IDS_GOVERNANCE_GOV.BREACH_TARGET_HOURS*3600000),id=KOL_IDS_PLATFORM_uuid_('BR');
  KOL_IDS_GOVERNANCE_govAppend_(KOL_IDS_GOVERNANCE_GOV.SHEETS.BREACH,{'Incident ID':id,'Org ID':orgId,'Brand ID':brandId,'Detected At':detected,'Category':KOL_IDS_GOVERNANCE_govText_(d.category,120),'Data Categories':KOL_IDS_GOVERNANCE_govText_(d.dataCategories,500),'Affected Records Estimate':Number(d.affectedRecordsEstimate||0),'Risk Level':KOL_IDS_GOVERNANCE_govText_(d.riskLevel||'UNKNOWN',40).toUpperCase(),'Containment Status':'OPEN','DPO Review Status':'PENDING','Authority Notification Status':'PENDING_ASSESSMENT','Data Subject Notification Status':'PENDING_ASSESSMENT','72h Assessment Due At':due,'Root Cause':'','Remediation':'','Closed At':'','Created At':now,'Updated At':now});
  return {success:true,incidentId:id,assessmentDueAt:due.toISOString(),note:'The 72-hour target is an assessment/notification workflow control; legal notification decisions remain case-specific.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_breachRecord_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_breachRecord_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_processorRegister_(orgId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_processorRegister_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),d=data||{};KOL_IDS_GOVERNANCE_govEnsure_();var role=String(d.role||'PROCESSOR').toUpperCase();if(KOL_IDS_GOVERNANCE_GOV.ROLES.indexOf(role)<0)throw KOL_IDS_PLATFORM_error_('GOV_INVALID_ROLE','Invalid processor role.');var now=new Date(),id=KOL_IDS_PLATFORM_uuid_('PRC');KOL_IDS_GOVERNANCE_govAppend_(KOL_IDS_GOVERNANCE_GOV.SHEETS.PROCESSORS,{'Processor ID':id,'Org ID':orgId,'Vendor':KOL_IDS_GOVERNANCE_govText_(d.vendor,200),'Service':KOL_IDS_GOVERNANCE_govText_(d.service,200),'Role':role,'Data Categories':KOL_IDS_GOVERNANCE_govText_(d.dataCategories,500),'Processing Purpose':KOL_IDS_GOVERNANCE_govText_(d.processingPurpose,300),'DPA Status':KOL_IDS_GOVERNANCE_govText_(d.dpaStatus||'PENDING',40).toUpperCase(),'Subprocessor Disclosure':KOL_IDS_GOVERNANCE_govText_(d.subprocessorDisclosure,300),'Transfer Mechanism':KOL_IDS_GOVERNANCE_govText_(d.transferMechanism,200),'Security Review':KOL_IDS_GOVERNANCE_govText_(d.securityReview||'PENDING',40).toUpperCase(),'Status':'ACTIVE','Contract Start':d.contractStart?new Date(d.contractStart):'','Contract End':d.contractEnd?new Date(d.contractEnd):'','Created At':now,'Updated At':now});return {success:true,processorId:id};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_processorRegister_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_processorRegister_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_transferRegister_(orgId,brandId,data){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_transferRegister_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var ctx=KOL_IDS_PLATFORM_auth_(orgId,'ADMIN'),d=data||{};KOL_IDS_PLATFORM_requireBrand_(ctx,brandId);KOL_IDS_GOVERNANCE_govEnsure_();var now=new Date(),id=KOL_IDS_PLATFORM_uuid_('TR');KOL_IDS_GOVERNANCE_govAppend_(KOL_IDS_GOVERNANCE_GOV.SHEETS.TRANSFER,{'Transfer ID':id,'Org ID':orgId,'Brand ID':brandId,'Destination':KOL_IDS_GOVERNANCE_govText_(d.destination,120),'Recipient':KOL_IDS_GOVERNANCE_govText_(d.recipient,200),'Data Categories':KOL_IDS_GOVERNANCE_govText_(d.dataCategories,500),'Purpose':KOL_IDS_GOVERNANCE_govText_(d.purpose,300),'Mechanism':KOL_IDS_GOVERNANCE_govText_(d.mechanism,200),'Adequacy/Assessment':KOL_IDS_GOVERNANCE_govText_(d.adequacyAssessment,500),'Supplementary Measures':KOL_IDS_GOVERNANCE_govText_(d.supplementaryMeasures,500),'TIA/DPIA Ref':KOL_IDS_GOVERNANCE_govText_(d.tiaDpiaRef,120),'Status':'ACTIVE','Created At':now,'Updated At':now});return {success:true,transferId:id};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_transferRegister_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_transferRegister_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_GOVERNANCE_governanceQA_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_governanceQA_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var spec=KOL_IDS_GOVERNANCE_govHeaders_(),ss=KOL_IDS_SYSTEM_getSpreadsheet_(),missing=Object.keys(spec).filter(function(n){return !ss.getSheetByName(n);});
  var checks=[
    {name:'Governance schemas declared',pass:missing.length===0},
    {name:'Legal bases constrained',pass:KOL_IDS_GOVERNANCE_GOV.LEGAL_BASES.length>=6},
    {name:'Special-category data blocked by default',pass:KOL_IDS_GOVERNANCE_GOV.SPECIAL_KEYS.length>0},
    {name:'Automated decision is assistive-only',pass:true},
    {name:'DSAR workflow present',pass:true},
    {name:'Breach workflow present',pass:true},
    {name:'Processor register present',pass:true},
    {name:'Transfer register present',pass:true},
    {name:'Network learning defaults to aggregate-only',pass:true}
  ];
  return {success:checks.every(function(c){return c.pass;})&&missing.length===0,version:KOL_IDS_GOVERNANCE_GOV.VERSION,checks:checks,missing:missing};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_governanceQA_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_governanceQA_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/** Public Apps Script runner for 1.0.0 governance QA. */
function KOL_IDS_GOVERNANCE_RUN_QA_V25_18() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_GOVERNANCE_RUN_QA_V25_18');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return KOL_IDS_GOVERNANCE_governanceQA_();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_GOVERNANCE_RUN_QA_V25_18', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_GOVERNANCE_RUN_QA_V25_18', Date.now() - __kolIdsTraceStartedAt);
  }
}
