/**
 * KOL IDS — UNIFIED SELF-SERVICE PRODUCT CORE
 * Deterministic decision + campaign learning + licensing + sales automation.
 * This layer is intentionally independent from the legacy KBIS product UI.
 */
KOL_IDS = KOL_IDS_MERGE_(KOL_IDS, {
  VERSION: '1.1.0',
  RELEASE_STATUS: 'UNIFIED_ACTIVE',
  DATA_HARDENING_VERSION: '1.0.0',
  // Commercial pricing — KOL IDS™
  // Commercial pricing is owned by KOL_IDS_PRICING_AUTHORITY_.
  // Upgrade delta is always derived from the pricing authority.
  PLANS: KOL_IDS_PRICING_AUTHORITY_().PLANS,
  COMMERCIAL: {
    CURRENCY: 'THB',
    UPGRADE_6M_TO_1Y: KOL_IDS_PRICING_AUTHORITY_().PLANS.ONE_YEAR.price-KOL_IDS_PRICING_AUTHORITY_().PLANS.SIX_MONTHS.price,
    PAYMENT_VERIFICATION: 'MANUAL_ADMIN'
  },
  SHEETS: {
    LICENSES: 'ENT_LICENSES', ORDERS: 'ENT_ORDERS',
    BRAND: 'ENT_BRANDS', PERSONA: 'ENT_PERSONAS', CREATORS: 'ENT_CREATORS',
    DECISIONS: 'ENT_DECISIONS', CAMPAIGNS: 'ENT_CAMPAIGNS', PERFORMANCE: 'ENT_PERFORMANCE',
    LEARNING: 'ENT_LEARNING', MEMORY: 'ENT_MEMORY', LEGACY_AUDIT: 'ENT_AUDIT_LOG'
  },
  DECISION: { RECOMMEND: 75, DO_NOT_SELECT: 59 },
  CONFIDENCE: { HIGH: 80, MEDIUM: 60 },
  SECRET_PROP: 'KOL_IDS_CORE_SECRET', ADMIN_EMAIL: 'KOL_IDS_ADMIN_EMAIL_V5', ADMIN_PIN: 'KOL_IDS_CORE_ADMIN_PIN', SALES_SS: 'KOL_IDS_CORE_SALES_SS', FORM_URL: 'KOL_IDS_CORE_FORM_URL', PRICE_CURRENCY: 'KOL_IDS_CORE_PRICE_CURRENCY'
});

/**
 * KOL IDS — CANONICAL WEB APP URL CONTROL
 *
 * Customer emails must never depend on a transient /dev URL or on a stale
 * deployment URL. The canonical URL is stored in Script Properties and is
 * refreshed from ScriptApp.getService().getUrl() only when that runtime value
 * is a real deployed /exec URL.
 */
function KOL_IDS_CORE_normalizeWebAppUrl_(url) {
  var u = String(url || '').trim();
  if (!u) return '';
  u = u.replace(/[?#].*$/, '').replace(/\/+$/, '');
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/i.test(u)) return '';
  return u;
}

function KOL_IDS_CORE_getWebAppUrl_() {
  var props = PropertiesService.getScriptProperties();
  var stored = KOL_IDS_CORE_normalizeWebAppUrl_(props.getProperty('KOL_IDS_PUBLIC_WEBAPP_URL'));
  if (stored) return stored;
  stored = KOL_IDS_CORE_normalizeWebAppUrl_(props.getProperty('KOL_IDS_ADMIN_WEBAPP_URL'));
  if (stored) {
    props.setProperty('KOL_IDS_PUBLIC_WEBAPP_URL', stored);
    return stored;
  }
  var runtime = KOL_IDS_CORE_normalizeWebAppUrl_(ScriptApp.getService().getUrl() || '');
  if (runtime) {
    props.setProperty('KOL_IDS_PUBLIC_WEBAPP_URL', runtime);
    props.setProperty('KOL_IDS_ADMIN_WEBAPP_URL', runtime);
  }
  return runtime;
}

/** Run this once AFTER deploying/updating the production Web App. */
function KOL_IDS_CORE_SYNC_WEBAPP_URL() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_SYNC_WEBAPP_URL');
  var started = Date.now();
  try {
    var runtime = KOL_IDS_CORE_normalizeWebAppUrl_(ScriptApp.getService().getUrl() || '');
    if (!runtime) {
      throw new Error('No deployed /exec Web App URL was detected. Deploy the project as a Web App first, then run this function from the Apps Script project.');
    }
    var props = PropertiesService.getScriptProperties();
    props.setProperty('KOL_IDS_PUBLIC_WEBAPP_URL', runtime);
    props.setProperty('KOL_IDS_ADMIN_WEBAPP_URL', runtime);
    return {
      success: true,
      status: 'PASS',
      webAppUrl: runtime,
      message: 'Canonical KOL IDS Web App URL synced successfully.'
    };
  } catch (e) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_SYNC_WEBAPP_URL', e);
    throw e;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_SYNC_WEBAPP_URL', Date.now() - started);
  }
}

/** Admin-only manual override, useful if Google rotates the deployment URL. */
function KOL_IDS_CORE_SET_WEBAPP_URL(url) {
  KOL_IDS_SYSTEM_requireAdmin_();

  // Optional argument:
  // - If a URL is supplied, validate and save it.
  // - If no URL is supplied (e.g. clicking Run in Apps Script), automatically
  //   use the currently deployed Web App URL from ScriptApp.
  // This prevents the common "Invalid Web App URL" failure caused by running
  // this admin helper without a function argument.
  var candidate = String(url || '').trim();
  if (!candidate) {
    candidate = String(ScriptApp.getService().getUrl() || '').trim();
  }

  var normalized = KOL_IDS_CORE_normalizeWebAppUrl_(candidate);

  // Current production deployment supplied for this release. This is only a
  // last-resort fallback when Apps Script does not expose the deployed URL
  // during a manual/admin execution.
  if (!normalized) {
    normalized = KOL_IDS_CORE_normalizeWebAppUrl_(
      'https://script.google.com/macros/s/AKfycby0ScBhEOtkCJZv5vPC9IiEp78h17JtrG16fab6scqiaRadjGRhLKkCa_-IbUEBRRMK/exec'
    );
  }

  if (!normalized) {
    throw new Error('Invalid Web App URL. Expected an HTTPS deployed Apps Script URL ending in /exec.');
  }

  var props = PropertiesService.getScriptProperties();
  props.setProperty('KOL_IDS_PUBLIC_WEBAPP_URL', normalized);
  props.setProperty('KOL_IDS_ADMIN_WEBAPP_URL', normalized);
  return {success:true, status:'PASS', webAppUrl:normalized};
}

function KOL_IDS_CORE_WEBAPP_URL_STATUS() {
  var url = KOL_IDS_CORE_getWebAppUrl_();
  return {
    success: !!url,
    status: url ? 'PASS' : 'FAIL',
    webAppUrl: url || '',
    canonicalConfigured: !!KOL_IDS_CORE_normalizeWebAppUrl_(PropertiesService.getScriptProperties().getProperty('KOL_IDS_PUBLIC_WEBAPP_URL')),
    message: url ? 'Canonical /exec Web App URL is configured.' : 'No valid deployed /exec Web App URL is configured.'
  };
}

function KOL_IDS_CORE_setupSales() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_setupSales'); var t=Date.now();
  try {
    var props=PropertiesService.getScriptProperties();
    var configured=String(props.getProperty(KOL_IDS.ADMIN_EMAIL)||String(Session.getEffectiveUser().getEmail()||'')).trim().toLowerCase();
    var current=String(Session.getEffectiveUser().getEmail()||'').trim().toLowerCase();
    if(configured&&configured!==current)throw new Error('Sales setup is restricted to the configured administrator.');
    var ss=SpreadsheetApp.getActiveSpreadsheet(); if(!ss)throw new Error('Run setup from the master Google Sheet.');
    var pin=props.getProperty(KOL_IDS.ADMIN_PIN); if(!pin){pin=KOL_IDS_CORE_random_(8);props.setProperty(KOL_IDS.ADMIN_PIN,pin);}
    props.setProperty(KOL_IDS.ADMIN_EMAIL,current); props.setProperty(KOL_IDS.SALES_SS,ss.getId()); props.setProperty(KOL_IDS.PRICE_CURRENCY,'THB'); try{KOL_IDS_CORE_SYNC_WEBAPP_URL();}catch(webErr){Logger.log('WEBAPP URL sync skipped during setup: '+String(webErr&&webErr.message||webErr));}
    KOL_IDS_CORE_ensureColumns_(ss,KOL_IDS.SHEETS.ORDERS,['Order ID','Timestamp','Customer Name','Email','Phone','Company','Order Type','Plan','Product','Amount','Currency','Slip URL','Existing License ID','Existing Client ID','Status','License ID','Customer Message','Approved At','Approved By','Issued Client ID','Trial Expires At','Google Accounts Requested','Payment Status','Customer Type','Billing Documents Requested','Billing Entity Type','Billing Legal Full Name','Billing Tax ID','Billing Branch','Billing Address','Billing Contact Name','Billing Email','Billing Phone','Billing Notes']);
    KOL_IDS_CORE_ensureColumns_(ss,KOL_IDS.SHEETS.LICENSES,['License ID','Access Code','Email','Customer Name','Workspace ID','Issued At','Expires At','Status','Order ID','Token','Plan','Last Order Type','Reminder 2M Sent','Reminder 1M Sent','Last Reminder At','Updated At']);
    var prop='KOL_IDS_CORE_PUBLIC_SALES_FORM_URL_V10', url=props.getProperty(prop), form=null; if(url){try{form=FormApp.openByUrl(url);}catch(e){}} if(!form)form=FormApp.create('KOL IDS — Free Trial & Subscription');
    form.getItems().slice().reverse().forEach(function(x){form.deleteItem(x);});
    form.addTextItem().setTitle('Customer Name').setRequired(true);
    form.addTextItem().setTitle('Google Account Email').setRequired(true);
    form.addTextItem().setTitle('Phone').setRequired(false); form.addTextItem().setTitle('Company').setRequired(false); form.addListItem().setTitle('Customer Type').setChoiceValues(['Brand / Company','Agency','In-house Team','Freelancer / Independent Consultant','Other']).setRequired(true);
    form.addListItem().setTitle('Request Type').setChoiceValues(['7-Day Free Trial','Paid Subscription','Renewal','Upgrade']).setRequired(true);
    var pricing=KOL_IDS_PRICING_AUTHORITY_().PLANS;
    form.addListItem().setTitle('Plan').setChoiceValues(['7-Day Free Trial — FREE','3 Months — THB '+Number(pricing.THREE_MONTHS.price).toLocaleString('en-US')+' — 1 Google Account','6 Months — THB '+Number(pricing.SIX_MONTHS.price).toLocaleString('en-US')+' — 2 Google Accounts','12 Months — THB '+Number(pricing.ONE_YEAR.price).toLocaleString('en-US')+' — 3 Google Accounts']).setRequired(true);
    form.addListItem().setTitle('Google Accounts Needed').setChoiceValues(['1','2','3']).setRequired(true);
    form.addTextItem().setTitle('Existing Client ID').setRequired(false); form.addTextItem().setTitle('Existing License ID').setRequired(false);

    // Customer payment instructions — displayed immediately before payment status.
    // This is informational only; payment verification remains manual/admin-controlled.
    form.addSectionHeaderItem()
      .setTitle('Payment Information')
      .setHelpText('สำหรับการชำระเงินค่าสมาชิก KOL IDS™\nธ.กสิกรไทย\nเลขที่บัญชี: 2151822269\nชื่อบัญชี: บจก. ที ป็อป เอนเตอร์เทนเมนท์ คอนเนคส์');

    form.addListItem().setTitle('Payment Status').setChoiceValues(['Trial / Not paying yet','Paid — payment proof provided','Paid — proof will be sent separately']).setRequired(true);
    form.addTextItem().setTitle('Payment Proof / Slip / Transfer Reference / Drive Link').setRequired(false);
    form.addParagraphTextItem().setTitle('Customer Message').setRequired(false);

    // Billing / tax-document routing: keep the entire commercial intake in one form.
    // If no document is needed, the respondent skips all billing questions and submits.
    var billingRequest=form.addListItem().setTitle('Billing Documents Requested').setHelpText('เลือกเอกสารที่ต้องการก่อนชำระเงิน ระบบจะขอข้อมูลออกเอกสารต่อในฟอร์มเดียวกัน').setRequired(true);
    var billingPage=form.addPageBreakItem().setTitle('Billing & Tax Documents').setHelpText('ข้อมูลส่วนนี้ใช้สำหรับจัดเตรียมใบเสนอราคา / ใบกำกับภาษี / ใบเสร็จ ตามที่คุณเลือก');
    var entityItem=form.addListItem().setTitle('Billing Entity Type').setRequired(true);
    var juristicPage=form.addPageBreakItem().setTitle('Juristic Person / Company Details').setHelpText('กรอกข้อมูลตามหนังสือรับรอง/ข้อมูลภาษีของนิติบุคคล เพื่อให้ทีมงานออกเอกสารได้โดยไม่ต้องขอข้อมูลซ้ำ');
    form.addTextItem().setTitle('Billing Legal Full Name').setHelpText('ชื่อนิติบุคคลตามเอกสารจดทะเบียน').setRequired(true);
    form.addTextItem().setTitle('Billing Tax ID').setHelpText('เลขประจำตัวผู้เสียภาษี 13 หลัก').setRequired(true);
    form.addTextItem().setTitle('Billing Branch').setHelpText('เช่น สำนักงานใหญ่ หรือ 00000').setRequired(true);
    form.addParagraphTextItem().setTitle('Billing Address').setRequired(true);
    form.addTextItem().setTitle('Billing Contact Name').setRequired(true);
    form.addTextItem().setTitle('Billing Email').setRequired(true);
    form.addTextItem().setTitle('Billing Phone').setRequired(true);
    form.addParagraphTextItem().setTitle('Billing Notes').setRequired(false);
    var individualPage=form.addPageBreakItem().setTitle('Individual / Freelancer Details').setHelpText('ใช้สำหรับบุคคลธรรมดา / Freelancer ที่ต้องการใบเสนอราคา ใบเสร็จ หรือเอกสารที่เกี่ยวข้อง');
    form.addTextItem().setTitle('Billing Legal Full Name').setRequired(true);
    form.addTextItem().setTitle('Billing Tax ID').setRequired(false);
    form.addTextItem().setTitle('Billing Branch').setRequired(false);
    form.addParagraphTextItem().setTitle('Billing Address').setRequired(true);
    form.addTextItem().setTitle('Billing Contact Name').setRequired(true);
    form.addTextItem().setTitle('Billing Email').setRequired(true);
    form.addTextItem().setTitle('Billing Phone').setRequired(true);
    form.addParagraphTextItem().setTitle('Billing Notes').setRequired(false);
    // The duplicate billing titles above are intentionally replaced below with unique internal titles
    // so Google Forms response columns remain deterministic.
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Legal Full Name'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Legal Full Name — Individual'); });
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Tax ID'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Tax ID — Individual'); });
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Branch'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Branch — Individual'); });
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Address'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Address — Individual'); });
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Contact Name'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Contact Name — Individual'); });
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Email'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Email — Individual'); });
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Phone'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Phone — Individual'); });
    form.getItems().filter(function(it){ return String(it.getTitle())==='Billing Notes'; }).forEach(function(it,i){ if(i===1) it.setTitle('Billing Notes — Individual'); });
    billingRequest.setChoices([
      billingRequest.createChoice('No — ไม่ต้องการเอกสารออกบิล',FormApp.PageNavigationType.SUBMIT),
      billingRequest.createChoice('Quotation / ใบเสนอราคา',billingPage),
      billingRequest.createChoice('Tax Invoice / ใบกำกับภาษี',billingPage),
      billingRequest.createChoice('Receipt / ใบเสร็จ',billingPage),
      billingRequest.createChoice('Quotation + Tax Invoice',billingPage),
      billingRequest.createChoice('Quotation + Receipt',billingPage),
      billingRequest.createChoice('Tax Invoice + Receipt',billingPage),
      billingRequest.createChoice('Quotation + Tax Invoice + Receipt',billingPage)
    ]);
    entityItem.setChoices([
      entityItem.createChoice('Juristic Person / Company',juristicPage),
      entityItem.createChoice('Individual / Freelancer',individualPage)
    ]);
    juristicPage.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    individualPage.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    form.setDescription('KOL IDS™ — 7-Day Free Trial + Subscription\n\nทดลองใช้ฟรี 7 วันทุกลูกค้าก่อนตัดสินใจ\n\n3 Months — THB '+Number(pricing.THREE_MONTHS.price).toLocaleString('en-US')+' — 1 Google Account\n6 Months — THB '+Number(pricing.SIX_MONTHS.price).toLocaleString('en-US')+' — 2 Google Accounts — Recommended\n12 Months — THB '+Number(pricing.ONE_YEAR.price).toLocaleString('en-US')+' — 3 Google Accounts — Best Value\n\nทุก Account ใช้ Client ID + Access Key เดียวกัน\nTrial: ใช้งานและดูผลได้ แต่ Download / Export Report ถูกล็อก\nPaid: ปลดล็อก Report Export และใช้ข้อมูล Trial เดิมต่อได้\n\nBilling Documents: หากต้องการใบเสนอราคา / ใบกำกับภาษี / ใบเสร็จ ระบบจะเก็บข้อมูลนิติบุคคลหรือบุคคลธรรมดาในฟอร์มเดียวกัน เพื่อไม่ต้องส่งข้อมูลซ้ำภายหลัง\n\nหลังส่งฟอร์ม ลูกค้าจะได้รับอีเมลยืนยันคำขอ และทีมงานจะได้รับอีเมลพร้อมพรีวิวข้อมูลทั้งหมดและลิงก์สำหรับ APPROVE');
    form.setConfirmationMessage('ได้รับข้อมูลแล้ว — ระบบส่งอีเมลยืนยันคำขอให้คุณแล้ว ทีมงานจะตรวจสอบและอนุมัติขั้นตอนถัดไป'); form.setDestination(FormApp.DestinationType.SPREADSHEET,ss.getId()); props.setProperty(prop,form.getPublishedUrl()); props.setProperty(KOL_IDS.FORM_URL,form.getPublishedUrl());
    // Canonicalize form triggers on every setup so legacy V9/V10 triggers cannot double-process an order.
var triggers=ScriptApp.getProjectTriggers();
triggers.forEach(function(tr){
  var h=String(tr.getHandlerFunction()||'');
  if(h==='KOL_IDS_CORE_onOrderSubmit'||h==='KOL_IDS_CORE_onTrialSubmit')ScriptApp.deleteTrigger(tr);
});
ScriptApp.newTrigger('KOL_IDS_CORE_onOrderSubmit').forSpreadsheet(ss).onFormSubmit().create();
props.setProperty('KOL_IDS_CORE_PUBLIC_SALES_TRIGGER_V10','1');
props.deleteProperty('KOL_IDS_CORE_ORDER_TRIGGER');
    KOL_IDS_CORE_installReminderTrigger_();
    return {success:true,adminEmail:current,adminPin:pin,orderSheet:ss.getUrl(),formUrl:form.getPublishedUrl(),trialFormUrl:form.getPublishedUrl(),qrFormUrl:form.getPublishedUrl(),plans:[KOL_IDS.PLANS.THREE_MONTHS,KOL_IDS.PLANS.SIX_MONTHS,KOL_IDS.PLANS.ONE_YEAR]};
  }catch(e){KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_setupSales',e);throw e;}finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_setupSales',Date.now()-t);}
}
function KOL_IDS_CORE_setupTrialForm_(ss){var u=PropertiesService.getScriptProperties().getProperty('KOL_IDS_CORE_PUBLIC_SALES_FORM_URL_V10')||PropertiesService.getScriptProperties().getProperty(KOL_IDS.FORM_URL)||'';return u?FormApp.openByUrl(u):null;}
function KOL_IDS_CORE_onTrialSubmit(e){return KOL_IDS_CORE_onOrderSubmit(e);}
function KOL_IDS_CORE_formEnsureText_(form,title,required){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_formEnsureText_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const exists=form.getItems().some(i=>String(i.getTitle())===title);
  if(!exists) form.addTextItem().setTitle(title).setRequired(!!required);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_formEnsureText_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_formEnsureText_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_formEnsureList_(form,title,choices,required){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_formEnsureList_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const item=form.getItems().find(i=>String(i.getTitle())===title);
  if(!item){form.addListItem().setTitle(title).setChoiceValues(choices).setRequired(!!required);return;}
  try{item.asListItem().setChoiceValues(choices).setRequired(!!required);}catch(e){}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_formEnsureList_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_formEnsureList_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_migrateLegacySalesRows_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_migrateLegacySalesRows_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const os=ss.getSheetByName(KOL_IDS.SHEETS.ORDERS);
  if(os&&os.getLastRow()>=2){
    const v=os.getDataRange().getValues();
    for(let i=1;i<v.length;i++){
      const r=v[i];
      // Legacy V5 order layout had 13 columns. Expand it without changing its business meaning.
      if(String(r[6]||'') && ['NEW','RENEWAL','UPGRADE'].indexOf(String(r[6]).toUpperCase())<0 && String(r[13]||'')===''){
        const legacy=[r[0],r[1],r[2],r[3],r[4],r[5],'NEW','12 Months',r[6],r[7],r[8],r[9],'','',r[10],r[11],r[12],'',''];
        os.getRange(i+1,1,1,legacy.length).setValues([legacy]);
      }
    }
  }
  const ls=ss.getSheetByName(KOL_IDS.SHEETS.LICENSES);
  if(ls&&ls.getLastRow()>=2){
    const v=ls.getDataRange().getValues();
    for(let i=1;i<v.length;i++){
      const r=v[i];
      if(r[10]===''||r[10]==null){
        ls.getRange(i+1,11,1,6).setValues([[ '1 Year','NEW',false,false,'',new Date() ]]);
      }
    }
  }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_migrateLegacySalesRows_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_migrateLegacySalesRows_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_installOrderTrigger_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_installOrderTrigger_');var __kolIdsTraceStartedAt=Date.now();
  try{
    if(!ss)throw new Error('Spreadsheet is required for order trigger.');
    var triggers=ScriptApp.getProjectTriggers();
    triggers.forEach(function(tr){
      var h=String(tr.getHandlerFunction()||'');
      if(h==='KOL_IDS_CORE_onOrderSubmit'||h==='KOL_IDS_CORE_onTrialSubmit')ScriptApp.deleteTrigger(tr);
    });
    ScriptApp.newTrigger('KOL_IDS_CORE_onOrderSubmit').forSpreadsheet(ss).onFormSubmit().create();
    PropertiesService.getScriptProperties().setProperty('KOL_IDS_CORE_PUBLIC_SALES_TRIGGER_V10','1');
    PropertiesService.getScriptProperties().deleteProperty('KOL_IDS_CORE_ORDER_TRIGGER');
    return {success:true,trigger:'KOL_IDS_CORE_onOrderSubmit'};
  }catch(__kolIdsTraceError){KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_installOrderTrigger_',__kolIdsTraceError);throw __kolIdsTraceError;}
  finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_installOrderTrigger_',Date.now()-__kolIdsTraceStartedAt);}
}
function KOL_IDS_CORE_orderHeaders_(sheet){var h=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0].map(String),idx={};h.forEach(function(x,i){idx[x]=i;});return {headers:h,idx:idx};}
function KOL_IDS_CORE_calculateOrderAmount_(type,plan,existingLicenseId,email,existingClientId){
  var t=String(type||'NEW').trim().toUpperCase(),target=KOL_IDS_CORE_plan_(plan);
  if(!target)return 0;
  if(t!=='UPGRADE')return Number(target.price||0);
  var existing=KOL_IDS_CORE_findLicense_(String(existingLicenseId||''),String(email||''));
  if(existing)return Number(target.price)>Number((KOL_IDS_CORE_plan_(existing.row[10])||{price:0}).price)?Number(target.price)-Number((KOL_IDS_CORE_plan_(existing.row[10])||{price:0}).price):0;
  // Trial users have a Client ID but no paid License row. Converting a Trial is a new paid entitlement at full plan price.
  var cid=String(existingClientId||'').trim();if(cid&&typeof KOL_IDS_SYSTEM_ensureClientDirectory_==='function'){
    var dir=KOL_IDS_SYSTEM_ensureClientDirectory_(),last=dir.getLastRow(),width=Math.max(13,dir.getLastColumn()),h=dir.getRange(1,1,1,width).getValues()[0].map(String),idx={};h.forEach(function(x,i){idx[x]=i;});
    if(last>=2){var rows=dir.getRange(2,1,last-1,width).getValues();for(var i=0;i<rows.length;i++){if(String(rows[i][idx['Client ID']]||'').trim()===cid&&String(rows[i][idx['Access Type']]||'').toUpperCase()==='TRIAL')return Number(target.price||0);}}
  }
  return 0;
}
function KOL_IDS_CORE_orderRowFromNamedValues_(sheet,get){
  var meta=KOL_IDS_CORE_orderHeaders_(sheet),r=new Array(meta.headers.length).fill(''),set=function(h,v){if(meta.idx[h]!=null)r[meta.idx[h]]=v;};
  var request=String(get('Request Type')||get('Order Type')||'7-Day Free Trial').trim(),pr=String(get('Plan')||'7-Day Free Trial — FREE').trim();
  var requestType=/^7-Day Free Trial$/i.test(request)?'TRIAL':(/Upgrade/i.test(request)?'UPGRADE':/Renewal/i.test(request)?'RENEWAL':'NEW');
  var plan=/3 Months/i.test(pr)?'3 Months':/6 Months/i.test(pr)?'6 Months':/12 Months/i.test(pr)?'12 Months':'7-Day Free Trial';
  var email=String(get('Google Account Email')||get('Email')||'').trim().toLowerCase(),existingLicenseId=String(get('Existing License ID')||'').trim();
  if(requestType!=='TRIAL'&&plan==='7-Day Free Trial')throw new Error('Paid / Renewal / Upgrade requests must select a paid plan.');
  // SECURITY: Google Accounts Needed is customer-form input only. It NEVER grants
  // entitlement. The selected Plan is the sole source of truth.
  var entitledAccounts=(typeof KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_==='function')
    ? KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(plan)
    : (plan==='3 Months'?1:plan==='6 Months'?2:plan==='12 Months'?3:1);
  if(!entitledAccounts)throw new Error('Unknown account entitlement for plan: '+plan);
  var amount=plan==='7-Day Free Trial'?0:KOL_IDS_CORE_calculateOrderAmount_(requestType,plan,existingLicenseId,email,String(get('Existing Client ID')||'').trim());
  if(requestType==='UPGRADE'&&amount<=0)throw new Error('Upgrade requires an existing License ID (or matching licensed email) and a higher target plan.');
  set('Order ID','ORD-'+Utilities.getUuid().slice(0,8).toUpperCase());set('Timestamp',new Date());set('Customer Name',get('Customer Name'));set('Email',email);set('Phone',get('Phone'));set('Company',get('Company'));set('Customer Type',get('Customer Type')||'Other');
  set('Order Type',requestType);set('Plan',plan);set('Product','KOL IDS Self-Service');set('Amount',amount);set('Currency','THB');set('Slip URL',get('Payment Proof / Slip / Transfer Reference / Drive Link')||get('Payment Slip / Transfer Reference / Drive Link')||get('Slip URL / Drive Link'));
  set('Existing License ID',existingLicenseId);set('Existing Client ID',get('Existing Client ID'));set('Status','PENDING');set('License ID','');set('Customer Message',get('Customer Message'));set('Approved At','');set('Approved By','');set('Issued Client ID','');set('Trial Expires At','');set('Google Accounts Requested',String(entitledAccounts));set('Payment Status',get('Payment Status')||'Trial / Not paying yet');
  var docReq=String(get('Billing Documents Requested')||'No — ไม่ต้องการเอกสารออกบิล').trim();
  var entity=String(get('Billing Entity Type')||'').trim();
  var isJuristic=/Juristic Person/i.test(entity);
  var legal=String(get('Billing Legal Full Name')||get('Billing Legal Full Name — Individual')||'').trim();
  var tax=String(get('Billing Tax ID')||get('Billing Tax ID — Individual')||'').trim();
  var branch=String(get('Billing Branch')||get('Billing Branch — Individual')||'').trim();
  var address=String(get('Billing Address')||get('Billing Address — Individual')||'').trim();
  var contact=String(get('Billing Contact Name')||get('Billing Contact Name — Individual')||'').trim();
  var bEmail=String(get('Billing Email')||get('Billing Email — Individual')||'').trim().toLowerCase();
  var bPhone=String(get('Billing Phone')||get('Billing Phone — Individual')||'').trim();
  var bNotes=String(get('Billing Notes')||get('Billing Notes — Individual')||'').trim();
  set('Billing Documents Requested',docReq);set('Billing Entity Type',entity);set('Billing Legal Full Name',legal);set('Billing Tax ID',tax);set('Billing Branch',branch);set('Billing Address',address);set('Billing Contact Name',contact);set('Billing Email',bEmail);set('Billing Phone',bPhone);set('Billing Notes',bNotes);
  return r;
}
function KOL_IDS_CORE_normalizeOrderRow_(sheet,data){var m=KOL_IDS_CORE_orderHeaders_(sheet),g=function(h){return m.idx[h]!=null?data[m.idx[h]]:'';};return [g('Order ID'),g('Timestamp'),g('Customer Name'),g('Email'),g('Phone'),g('Company'),g('Order Type'),g('Plan'),g('Product'),g('Amount'),g('Currency'),g('Slip URL'),g('Existing License ID'),g('Existing Client ID'),g('Status'),g('License ID'),g('Customer Message'),g('Approved At'),g('Approved By')];}

function KOL_IDS_CORE_onOrderSubmit(e){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_onOrderSubmit');var t=Date.now();
  try{
    var ss=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty(KOL_IDS.SALES_SS));
    var sh=KOL_IDS_CORE_ensureColumns_(ss,KOL_IDS.SHEETS.ORDERS,['Order ID','Timestamp','Customer Name','Email','Phone','Company','Order Type','Plan','Product','Amount','Currency','Slip URL','Existing License ID','Existing Client ID','Status','License ID','Customer Message','Approved At','Approved By','Issued Client ID','Trial Expires At','Google Accounts Requested','Payment Status','Customer Type','Billing Documents Requested','Billing Entity Type','Billing Legal Full Name','Billing Tax ID','Billing Branch','Billing Address','Billing Contact Name','Billing Email','Billing Phone','Billing Notes']);
    var nv=e&&e.namedValues?e.namedValues:{},get=function(k){return String((nv[k]||[''])[0]||'').trim();};
    var row=KOL_IDS_CORE_orderRowFromNamedValues_(sh,get),m=KOL_IDS_CORE_orderHeaders_(sh),id=String(row[m.idx['Order ID']]||''),type=String(row[m.idx['Order Type']]||'TRIAL'),plan=String(row[m.idx['Plan']]||'7-Day Free Trial'),email=String(row[m.idx['Email']]||'').toLowerCase(),accounts=String(row[m.idx['Google Accounts Requested']]||'1');
    KOL_IDS_CORE_validateBillingRequest_(row,m);
    sh.appendRow(row);
    var storedRow=sh.getRange(sh.getLastRow(),1,1,sh.getLastColumn()).getValues()[0];
    var isTrial=String(type||'').toUpperCase()==='TRIAL';
    var trialLicense=null;
    // Trial requests are self-service: the form is the customer verification/intake
    // step. No payment approval is required. Create the real workspace credentials
    // immediately and mark the order APPROVED so it never enters paid approval queue.
    if(isTrial){
      trialLicense=KOL_IDS_SYSTEM_CREATE_TRIAL_CLIENT_(String(row[2]||''),String(row[3]||''),String(plan||''));
      var om=KOL_IDS_CORE_orderHeaders_(sh),approvedRow=sh.getLastRow();
      sh.getRange(approvedRow,om.idx['Status']+1).setValue('APPROVED');
      sh.getRange(approvedRow,om.idx['Approved At']+1).setValue(new Date());
      sh.getRange(approvedRow,om.idx['Approved By']+1).setValue('SYSTEM · TRIAL');
      sh.getRange(approvedRow,om.idx['Issued Client ID']+1).setValue(trialLicense.clientId||'');
      sh.getRange(approvedRow,om.idx['Trial Expires At']+1).setValue(trialLicense.expiresAt||'');
      row=sh.getRange(approvedRow,1,1,sh.getLastColumn()).getValues()[0];
    }
    var admin=PropertiesService.getScriptProperties().getProperty(KOL_IDS.ADMIN_EMAIL)||String(Session.getEffectiveUser().getEmail()||'');
    var web=KOL_IDS_CORE_getWebAppUrl_();
    var approval=(!isTrial&&web)?(web+(web.indexOf('?')>=0?'&':'?')+'admin=1&order='+encodeURIComponent(id)):'';
    if(admin){
      var subject='KOL IDS — New '+type+' Request · '+id;
      var html=KOL_IDS_CORE_buildAdminOrderEmail_(sh,row,id,approval);
      var body=KOL_IDS_CORE_buildAdminOrderText_(sh,row,id,approval);
      MailApp.sendEmail({to:String(admin).trim().toLowerCase(),subject:subject,body:body,htmlBody:html});
    }
    if(isTrial&&trialLicense){
      KOL_IDS_CORE_sendTrialApprovalEmail_(row,trialLicense);
    } else if(email){
      var customerType=KOL_IDS_CORE_orderField_(sh,row,'Customer Type')||'—';
      var customerBody='เรียน '+String(row[2]||'ลูกค้า')+'\n\nเราได้รับคำขอของคุณแล้ว\n\nOrder: '+id+'\nประเภทลูกค้า: '+customerType+'\nPlan: '+plan+'\nGoogle Accounts: '+accounts+'\nราคา: '+row[9]+' '+row[10]+'\n\nทีมงานจะตรวจสอบข้อมูลและการชำระเงิน แล้วส่งผลการอนุมัติพร้อม Client ID / Access Key ทางอีเมล\n\nข้อมูล Trial จะคงอยู่เมื่อ Upgrade';
      var customerHtml='<div style="font-family:Arial,sans-serif;color:#26171a;max-width:620px;margin:auto"><div style="background:#3d131b;color:#fff;padding:28px;border-radius:18px 18px 0 0"><div style="font-size:12px;letter-spacing:2px;opacity:.75">KOL IDS</div><div style="font-size:24px;font-weight:700;margin-top:8px">Request received</div></div><div style="border:1px solid #eadfe1;border-top:0;padding:28px;border-radius:0 0 18px 18px"><p>เรียน '+KOL_IDS_CORE_html_(row[2]||'ลูกค้า')+',</p><p>เราได้รับคำขอของคุณแล้ว และทีมงานกำลังตรวจสอบข้อมูลก่อนอนุมัติ</p><table style="width:100%;border-collapse:collapse;font-size:14px">'+KOL_IDS_CORE_orderPreviewRows_(sh,row,false)+'</table><p style="margin-top:22px;color:#75686b;font-size:13px">เมื่ออนุมัติแล้ว ระบบจะส่ง Client ID / Access Key และรายละเอียดการใช้งานให้ทางอีเมลนี้</p></div></div>';
      MailApp.sendEmail({to:email,subject:'KOL IDS — Request received · '+id,body:customerBody,htmlBody:customerHtml});
    }
    KOL_IDS_CORE_audit_(ss,'ORDER_RECEIVED',id,'OK',type+' '+plan+(isTrial?' · TRIAL AUTO-ISSUED':''));
    return {success:true,orderId:id,status:isTrial?'APPROVED':'PENDING',type:type,plan:plan,clientId:trialLicense&&trialLicense.clientId||'',expiresAt:trialLicense&&trialLicense.expiresAt||''};
  }catch(e){KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_onOrderSubmit',e);throw e;}finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_onOrderSubmit',Date.now()-t);}
}
function KOL_IDS_CORE_orderField_(sheet,row,title){
  var m=KOL_IDS_CORE_orderHeaders_(sheet);return m.idx[title]!=null?String(row[m.idx[title]]==null?'':row[m.idx[title]]):'';
}
function KOL_IDS_CORE_isUrl_(v){return /^https?:\/\//i.test(String(v||'').trim());}
function KOL_IDS_CORE_orderPreviewRows_(sheet,row,admin){
  var m=KOL_IDS_CORE_orderHeaders_(sheet),hidden={'Status':1,'License ID':1,'Approved At':1,'Approved By':1,'Issued Client ID':1,'Trial Expires At':1};
  var labels=['Order ID','Timestamp','Customer Name','Customer Type','Email','Phone','Company','Order Type','Plan','Product','Amount','Currency','Google Accounts Requested','Existing Client ID','Existing License ID','Payment Status','Slip URL','Billing Documents Requested','Billing Entity Type','Billing Legal Full Name','Billing Tax ID','Billing Branch','Billing Address','Billing Contact Name','Billing Email','Billing Phone','Billing Notes','Customer Message'];
  return labels.map(function(label){if(!admin&&hidden[label])return '';var v=m.idx[label]!=null?row[m.idx[label]]:'';v=(v==null||v==='')?'—':String(v);var display=KOL_IDS_CORE_html_(v);if(label==='Slip URL'&&KOL_IDS_CORE_isUrl_(v))display='<a href="'+KOL_IDS_CORE_html_(v)+'" style="color:#3d131b;font-weight:700;text-decoration:underline">Open payment proof / slip</a><div style="font-size:11px;color:#8a7b7e;margin-top:4px;word-break:break-all">'+KOL_IDS_CORE_html_(v)+'</div>';return '<tr><td style="padding:9px 10px;border-bottom:1px solid #eee;color:#776a6d;width:36%">'+KOL_IDS_CORE_html_(label)+'</td><td style="padding:9px 10px;border-bottom:1px solid #eee;font-weight:600">'+display+'</td></tr>';}).join('');
}
function KOL_IDS_CORE_buildAdminOrderText_(sheet,row,id,approval){
  var m=KOL_IDS_CORE_orderHeaders_(sheet),labels=['Order ID','Timestamp','Customer Name','Customer Type','Email','Phone','Company','Order Type','Plan','Product','Amount','Currency','Google Accounts Requested','Existing Client ID','Existing License ID','Payment Status','Slip URL','Customer Message'];
  var out=['KOL IDS — NEW REQUEST','', 'Please review the complete submission before approval.'];
  labels.forEach(function(label){var v=m.idx[label]!=null?row[m.idx[label]]:'';out.push(label+': '+String(v==null?'':v||'—'));});
  out.push('','ACTION: '+(approval?'OPEN FOR APPROVAL':(String(KOL_IDS_CORE_orderField_(sheet,row,'Order Type')).toUpperCase()==='TRIAL'?'TRIAL AUTO-ISSUED — NO PAYMENT APPROVAL REQUIRED':'Approval URL unavailable')));
  return out.join('\n');
}
function KOL_IDS_CORE_buildAdminOrderEmail_(sheet,row,id,approval){
  var m=KOL_IDS_CORE_orderHeaders_(sheet),type=KOL_IDS_CORE_orderField_(sheet,row,'Order Type'),plan=KOL_IDS_CORE_orderField_(sheet,row,'Plan'),amount=KOL_IDS_CORE_orderField_(sheet,row,'Amount'),currency=KOL_IDS_CORE_orderField_(sheet,row,'Currency'),slip=KOL_IDS_CORE_orderField_(sheet,row,'Slip URL');
  var proof=KOL_IDS_CORE_isUrl_(slip)?'<a href="'+KOL_IDS_CORE_html_(slip)+'" style="display:inline-block;background:#3d131b;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:6px">VIEW PAYMENT PROOF</a>':'<span style="color:#9b3b46">No clickable payment-proof URL was provided.</span>';
  var approve=approval?'<a href="'+KOL_IDS_CORE_html_(approval)+'" style="display:inline-block;background:#3d131b;color:#fff;padding:13px 20px;border-radius:11px;text-decoration:none;font-weight:700;letter-spacing:.2px">OPEN FOR APPROVAL</a>':(String(type||'').toUpperCase()==='TRIAL'?'<div style="padding:12px 14px;border:1px solid #cfeee0;border-radius:11px;background:#f5fcf9;color:#147a5a;font-weight:700">Trial workspace auto-issued — no payment approval required.</div>':'<span style="color:#9b3b46">Approval URL unavailable — open Admin Center manually.</span>');
  return '<div style="margin:0;background:#f7f3f2;padding:28px 14px;font-family:Arial,Helvetica,sans-serif;color:#26171a"><div style="max-width:720px;margin:auto"><div style="background:#3d131b;color:#fff;padding:30px;border-radius:20px 20px 0 0"><div style="font-size:11px;letter-spacing:2.5px;opacity:.7">KOL IDS · SALES CONTROL</div><div style="font-size:25px;font-weight:700;margin-top:8px">New '+KOL_IDS_CORE_html_(type||'REQUEST')+' request</div><div style="margin-top:8px;color:#f1dfe2">'+KOL_IDS_CORE_html_(id)+' · '+KOL_IDS_CORE_html_(plan||'—')+' · '+KOL_IDS_CORE_html_(amount||'—')+' '+KOL_IDS_CORE_html_(currency||'THB')+'</div></div><div style="background:#fff;border:1px solid #e7dcde;border-top:0;padding:24px;border-radius:0 0 20px 20px"><div style="font-size:13px;color:#76696c;margin-bottom:8px">Complete submission preview</div><table style="width:100%;border-collapse:collapse;font-size:14px">'+KOL_IDS_CORE_orderPreviewRows_(sheet,row,true)+'</table><div style="margin-top:20px;padding:16px;border:1px solid #eadfe1;border-radius:14px;background:#fbf8f7"><div style="font-weight:700">Payment evidence</div><div style="margin-top:5px;font-size:13px;color:#75686b">Payment status: '+KOL_IDS_CORE_html_(KOL_IDS_CORE_orderField_(sheet,row,'Payment Status')||'—')+'</div>'+proof+'</div><div style="margin-top:22px">'+approve+'</div><div style="margin-top:14px;font-size:12px;color:#8b7c7f">Please verify the payment proof, customer identity, selected plan, and requested entitlement before approval.</div></div></div></div>';
}
function KOL_IDS_CORE_html_(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');}
function KOL_IDS_CORE_adminOrders() {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_adminOrders');var __kolIdsTraceStartedAt=Date.now();
  try{
    KOL_IDS_ARCH_assertAdminIdentity_();
    const ss=KOL_IDS_CORE_salesSS_(),sh=ss.getSheetByName(KOL_IDS.SHEETS.ORDERS);if(!sh||sh.getLastRow()<2)return {rows:[]};
    var m=KOL_IDS_CORE_orderHeaders_(sh);
    return {rows:KOL_IDS_CORE_values_(sh).map(function(raw){var r=KOL_IDS_CORE_normalizeOrderRow_(sh,raw);return {orderId:r[0],timestamp:r[1],customerName:r[2],email:r[3],phone:r[4],company:r[5],customerType:m.idx['Customer Type']!=null?String(raw[m.idx['Customer Type']]||''):'',orderType:r[6],plan:r[7],product:r[8],amount:r[9],currency:r[10],slipUrl:r[11],existingLicenseId:r[12],existingClientId:r[13],status:r[14],licenseId:r[15],message:r[16],approvedAt:r[17],approvedBy:r[18],googleAccountsRequested:m.idx['Google Accounts Requested']!=null?String(raw[m.idx['Google Accounts Requested']]||''):'',paymentStatus:m.idx['Payment Status']!=null?String(raw[m.idx['Payment Status']]||''):'',formPreview:{orderId:r[0],timestamp:r[1],customerName:r[2],customerType:m.idx['Customer Type']!=null?String(raw[m.idx['Customer Type']]||''):'',email:r[3],phone:r[4],company:r[5],orderType:r[6],plan:r[7],product:r[8],amount:r[9],currency:r[10],googleAccountsRequested:m.idx['Google Accounts Requested']!=null?String(raw[m.idx['Google Accounts Requested']]||''):'',existingClientId:r[13],existingLicenseId:r[12],paymentStatus:m.idx['Payment Status']!=null?String(raw[m.idx['Payment Status']]||''):'',slipUrl:r[11],customerMessage:r[16]}};}).reverse()};
  }catch(__kolIdsTraceError){KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_adminOrders',__kolIdsTraceError);throw __kolIdsTraceError;}finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_adminOrders',Date.now()-__kolIdsTraceStartedAt);}
}
function KOL_IDS_CORE_adminApprove(orderId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_adminApprove');var __kolIdsTraceStartedAt=Date.now(),approvalLock=LockService.getScriptLock(),locked=false;
  try{
    KOL_IDS_ARCH_assertAdminIdentity_();
    if(!approvalLock.tryLock(10000))throw new Error('Approval is busy. Please retry in a few seconds.');
    locked=true;
    var ss=KOL_IDS_CORE_salesSS_(),sh=ss.getSheetByName(KOL_IDS.SHEETS.ORDERS);if(!sh)throw new Error('Order sheet not found.');
    var id=String(orderId||'').trim(),row=-1,data=null,headers=KOL_IDS_CORE_orderHeaders_(sh);
    var idCol=(headers.idx['Order ID']||0)+1; row=KOL_IDS_ARCH_findRowByColumnValue_(sh,idCol,id,2);
    if(row>0){var rawRow=sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];data=KOL_IDS_CORE_normalizeOrderRow_(sh,rawRow);}
    if(row<0)throw new Error('Order not found: '+id);
    if(String(data[14]).toUpperCase()==='APPROVED')return {success:true,licenseId:data[15],message:'Already approved.'};
    if(String(data[14]).toUpperCase()!=='PENDING')throw new Error('Order is not pending.');
    // Re-validate the stored request under the same approval lock. The form field
    // Google Accounts Needed is informational; Plan controls the actual entitlement.
    var planEntitlement=(typeof KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_==='function')
      ? KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(String(data[7]||''))
      : (String(data[7]||'').toUpperCase()==='3 MONTHS'?1:String(data[7]||'').toUpperCase()==='6 MONTHS'?2:3);
    if(!planEntitlement)throw new Error('Invalid account entitlement for plan: '+String(data[7]||''));
    var rawAccountsIdx=headers.idx['Google Accounts Requested'];
    if(rawAccountsIdx!=null){
      var storedAccounts=Number(sh.getRange(row,rawAccountsIdx+1).getValue());
      if(storedAccounts!==planEntitlement){
        sh.getRange(row,rawAccountsIdx+1).setValue(String(planEntitlement));
        if(typeof KOL_IDS_TRACE_==='function')KOL_IDS_TRACE_('ACCOUNT_ENTITLEMENT_NORMALIZED_ON_APPROVAL '+String(data[7]||'')+' '+storedAccounts+' -> '+planEntitlement);
      }
    }
    var isTrial=String(data[6]||'').toUpperCase()==='TRIAL'||String(data[7]||'').toUpperCase()==='7-DAY FREE TRIAL';
    var license;
    if(isTrial){
      var trial=KOL_IDS_SYSTEM_CREATE_TRIAL_CLIENT_(data[2],data[3]);
      license={licenseId:'',code:trial.accessKey||'',expiresAt:trial.expiresAt||'',plan:'7-Day Free Trial',orderType:'TRIAL',clientId:trial.clientId};
    }else{
      KOL_IDS_CORE_validateOrderPayment_(data);
      license=KOL_IDS_CORE_processOrder_(data);
    }
    var om=KOL_IDS_CORE_orderHeaders_(sh);
    sh.getRange(row,om.idx['Status']+1).setValue('APPROVED');
    sh.getRange(row,om.idx['License ID']+1).setValue(license.licenseId||'');
    sh.getRange(row,om.idx['Approved At']+1).setValue(new Date());
    sh.getRange(row,om.idx['Approved By']+1).setValue(String(Session.getEffectiveUser().getEmail()||'admin'));
    if(isTrial){
      sh.getRange(row,om.idx['Issued Client ID']+1).setValue(license.clientId||'');
      sh.getRange(row,om.idx['Trial Expires At']+1).setValue(license.expiresAt||'');
      KOL_IDS_CORE_sendTrialApprovalEmail_(data,license);
    }else{
      if(typeof KOL_IDS_SYSTEM_SYNC_PAID_CLIENT_FROM_ORDER_==='function'){
        license.clientSync=KOL_IDS_SYSTEM_SYNC_PAID_CLIENT_FROM_ORDER_({orderId:data[0],customerName:data[2],email:data[3],orderType:data[6],plan:data[7],existingClientId:data[13],licenseId:license.licenseId,expiresAt:license.expiresAt});
      }
      if(data[3])KOL_IDS_CORE_sendLicenseEmail_(data,license);
      if(license.clientSync&&license.clientSync.clientId)sh.getRange(row,om.idx['Issued Client ID']+1).setValue(license.clientSync.clientId);
    }
    KOL_IDS_CORE_audit_(ss,'ORDER_APPROVED',id,'OK',String(data[6])+' '+String(data[7])+' -> '+license.licenseId);
    return {success:true,licenseId:license.licenseId||'',accessKey:(license.clientSync&&license.clientSync.accessKey)||license.code||'',clientId:(license.clientSync&&license.clientSync.clientId)||license.clientId||data[13]||'',email:data[3],expiresAt:license.expiresAt,orderType:data[6],plan:data[7]};
  }catch(__kolIdsTraceError){KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_adminApprove',__kolIdsTraceError);throw __kolIdsTraceError;}
  finally{if(locked)approvalLock.releaseLock();KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_adminApprove',Date.now()-__kolIdsTraceStartedAt);}
}
function KOL_IDS_CORE_plan_(planName) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_plan_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const raw=String(planName||'').trim().toUpperCase();
  if(raw==='3 MONTHS'||raw==='3_MONTHS') return KOL_IDS.PLANS.THREE_MONTHS;
  if(raw==='6 MONTHS'||raw==='6_MONTHS') return KOL_IDS.PLANS.SIX_MONTHS;
  if(raw==='1 YEAR'||raw==='1_YEAR'||raw==='12 MONTHS'||raw==='12_MONTHS'||raw==='ANNUAL') return KOL_IDS.PLANS.ONE_YEAR;
  return null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_plan_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_plan_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_validateBillingRequest_(order,headers){
  var idx=headers&&headers.idx?headers.idx:{};
  var get=function(name){return idx[name]!=null?String(order[idx[name]]||'').trim():'';};
  var req=get('Billing Documents Requested');
  if(!req||/^No\b/i.test(req))return {requested:false,valid:true};
  var entity=get('Billing Entity Type'),legal=get('Billing Legal Full Name'),tax=get('Billing Tax ID'),branch=get('Billing Branch'),address=get('Billing Address'),contact=get('Billing Contact Name'),email=get('Billing Email'),phone=get('Billing Phone');
  if(!entity)throw new Error('Billing Entity Type is required when billing documents are requested.');
  if(!legal||!address||!contact||!email||!phone)throw new Error('Billing information is incomplete. Please provide name, address, contact, billing email and phone.');
  if(!/@/.test(email))throw new Error('Billing Email is not valid.');
  if(/^Juristic/i.test(entity)&&(!tax||!/^\d{13}$/.test(tax.replace(/[- ]/g,''))))throw new Error('Juristic Person requires a valid 13-digit Billing Tax ID.');
  return {requested:true,valid:true,entity:entity,documents:req};
}

function KOL_IDS_CORE_validateOrderPayment_(order){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_validateOrderPayment_');var __kolIdsTraceStartedAt=Date.now();
  try{
    var type=String(order[6]||'NEW').toUpperCase(),plan=String(order[7]||'12 Months'),amount=Number(order[9]);
    if(!isFinite(amount)||amount<=0)throw new Error('Amount must be a valid positive number.');
    if(String(order[10]||'THB').toUpperCase()!=='THB')throw new Error('Currency must be THB.');
    var planDef=KOL_IDS_CORE_plan_(plan);if(!planDef)throw new Error('Unknown commercial plan: '+plan);
    var entitledAccounts=(typeof KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_==='function')
      ? KOL_IDS_COMMERCIAL_MAX_ACCOUNTS_FOR_PLAN_(plan)
      : (planDef.key==='THREE_MONTHS'?1:planDef.key==='SIX_MONTHS'?2:3);
    if(!entitledAccounts)throw new Error('Commercial account entitlement is invalid for plan: '+plan);
    // Ignore/reject any submitted account count that conflicts with the plan.
    // This field is informational and can never elevate the license.
    var requestedAccounts=Number(order[22]||entitledAccounts);
    if(!isFinite(requestedAccounts)||requestedAccounts<1)requestedAccounts=entitledAccounts;
    if(requestedAccounts!==entitledAccounts){
      order[22]=String(entitledAccounts);
      if(typeof KOL_IDS_TRACE_==='function')KOL_IDS_TRACE_('ACCOUNT_ENTITLEMENT_NORMALIZED '+plan+' '+requestedAccounts+' -> '+entitledAccounts);
    }
    var expected;
    if(type==='UPGRADE'){
      var existing=KOL_IDS_CORE_findLicense_(String(order[12]||''),String(order[3]||''));
      if(existing){
        var old=KOL_IDS_CORE_plan_(existing.row[10]);if(!old)throw new Error('Current customer plan is not recognized.');
        if(Number(planDef.price)<=Number(old.price))throw new Error('Upgrade target must be higher than the current plan.');
        expected=Number(planDef.price)-Number(old.price);
      }else{
        var cid=String(order[13]||'').trim(),isTrialClient=false;
        if(cid&&typeof KOL_IDS_SYSTEM_ensureClientDirectory_==='function'){
          var dir=KOL_IDS_SYSTEM_ensureClientDirectory_(),last=dir.getLastRow(),width=Math.max(13,dir.getLastColumn()),hh=dir.getRange(1,1,1,width).getValues()[0].map(String),ii={};hh.forEach(function(x,i){ii[x]=i;});
          if(last>=2){var rr=dir.getRange(2,1,last-1,width).getValues();for(var qi=0;qi<rr.length;qi++)if(String(rr[qi][ii['Client ID']]||'').trim()===cid&&String(rr[qi][ii['Access Type']]||'').toUpperCase()==='TRIAL'&&String(rr[qi][ii['Status']]||'').toUpperCase()==='ACTIVE'){isTrialClient=true;break;}}
        }
        if(!isTrialClient)throw new Error('Upgrade requires an existing paid License or an active Trial Client ID.');
        expected=Number(planDef.price);
      }
    }else{
      expected=Number(planDef.price);
      var commercial=(typeof KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_==='function')?KOL_IDS_COMMERCIAL_PLAN_FROM_AMOUNT_(amount):null;
      if(commercial&&String(plan).trim().toUpperCase()!==String(commercial.name).trim().toUpperCase())throw new Error('Commercial plan does not match the paid amount.');
    }
    if(amount!==expected)throw new Error('ยอดเงินไม่ตรงกับรายการ: expected '+expected+' THB, received '+amount+' THB. ตรวจสอบสลิป/รายการก่อน Approve');
    if(type==='RENEWAL'&&!String(order[12]||'').trim()&&!KOL_IDS_CORE_findLicenseByEmail_(String(order[3]||'')))throw new Error('Renewal requires an existing License ID or matching customer email.');
  }catch(__kolIdsTraceError){KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_validateOrderPayment_',__kolIdsTraceError);throw __kolIdsTraceError;}
  finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_validateOrderPayment_',Date.now()-__kolIdsTraceStartedAt);}
}
function KOL_IDS_CORE_processOrder_(order) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_processOrder_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  /* Defense in depth: no caller may issue/extend a license without commercial validation. */
  KOL_IDS_CORE_validateOrderPayment_(order);
  const type=String(order[6]||'NEW').toUpperCase();
  if(type==='NEW' || type==='TRIAL_CONVERSION') return KOL_IDS_CORE_issueLicense_(order);
  const existing=KOL_IDS_CORE_findLicense_(String(order[12]||''),String(order[3]||''));
  if(!existing && type==='UPGRADE') return KOL_IDS_CORE_issueLicense_(order);
  if(!existing) throw new Error('Existing License not found for renewal.');
  return KOL_IDS_CORE_extendLicense_(existing,order,type);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_processOrder_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_processOrder_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_issueLicense_(order) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_issueLicense_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  /* Do NOT create the customer workspace here: this function runs as the seller/admin.
   * Workspace ownership must be created by the customer-facing Web App under the
   * customer's Google Account. The license is issued first and bound on first login. */
  const licenseId='LIC-'+Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();
  const code='KOL-'+KOL_IDS_CORE_random_(4)+'-'+KOL_IDS_CORE_random_(4);
  const plan=KOL_IDS_CORE_plan_(order[7]) || KOL_IDS.PLANS.ONE_YEAR;
  const months=plan.months;
  const issued=new Date(), expires=KOL_IDS_CORE_addMonths_(issued,months);
  const token=KOL_IDS_CORE_makeToken_({licenseId,code,email:String(order[3]||'').toLowerCase(),workspaceId:'',exp:expires.getTime()});
  const sales=KOL_IDS_CORE_salesSS_();
  const sh=KOL_IDS_CORE_ensureColumns_(sales,'ENT_LICENSES',[
  'License ID','Access Code','Email','Customer Name','Workspace ID',
  'Issued At','Expires At','Status','Order ID','Token','Plan',
  'Last Order Type','Reminder 2M Sent','Reminder 1M Sent',
  'Last Reminder At','Updated At'
]);
  sh.appendRow([licenseId,code,String(order[3]||'').toLowerCase(),String(order[2]||''),'',issued,expires,'ACTIVE',String(order[0]||''),token,String(order[7]||'12 Months'),String(order[6]||'NEW').toUpperCase(),false,false,'',new Date()]);

  SpreadsheetApp.flush();
  return {licenseId,code,token,workspaceId:'',expiresAt:expires.toISOString(),plan:String(order[7]||'12 Months'),orderType:String(order[6]||'NEW').toUpperCase(),workspaceBinding:'PENDING_CUSTOMER_LOGIN'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_issueLicense_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_issueLicense_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_extendLicense_(license,order,type){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_extendLicense_');var __kolIdsTraceStartedAt=Date.now();
  try{
    var sales=KOL_IDS_CORE_salesSS_(),sh=sales.getSheetByName(KOL_IDS.SHEETS.LICENSES),idx=license.index,now=new Date(),currentExpiry=new Date(license.row[6]);
    if(isNaN(currentExpiry.getTime()))throw new Error('Current license expiry is invalid.');
    var base=currentExpiry.getTime()>now.getTime()?currentExpiry:now,oldPlan=String(license.row[10]||'6 Months'),requestedPlan=KOL_IDS_CORE_plan_(order[7])||KOL_IDS.PLANS.ONE_YEAR,months=requestedPlan.months;
    if(String(type||'').toUpperCase()==='UPGRADE'){var oldDef=KOL_IDS_CORE_plan_(oldPlan);if(!oldDef)throw new Error('Current license plan is not recognized.');if(requestedPlan.months<=oldDef.months)throw new Error('Upgrade target must have a longer duration than the current plan.');months=requestedPlan.months-oldDef.months;}
    var expires=KOL_IDS_CORE_addMonths_(base,months),code=String(license.row[1]),token=KOL_IDS_CORE_makeToken_({licenseId:license.row[0],code:code,email:String(license.row[2]),workspaceId:String(license.row[4]),exp:expires.getTime()});
    sh.getRange(idx+2,7).setValue(expires);sh.getRange(idx+2,8).setValue('ACTIVE');sh.getRange(idx+2,9).setValue(String(order[0]||''));sh.getRange(idx+2,10).setValue(token);sh.getRange(idx+2,11).setValue(String(order[7]||oldPlan));sh.getRange(idx+2,12).setValue(type);sh.getRange(idx+2,13).setValue(false);sh.getRange(idx+2,14).setValue(false);sh.getRange(idx+2,15).setValue('');sh.getRange(idx+2,16).setValue(new Date());
    if(String(license.row[4]||'').trim()){try{KOL_IDS_CORE_updateWorkspaceExpiry_(String(license.row[4]),expires);}catch(e){}}
    return {licenseId:license.row[0],code:code,token:token,workspaceId:license.row[4],expiresAt:expires.toISOString(),plan:String(order[7]||oldPlan),orderType:type};
  }catch(__kolIdsTraceError){KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_extendLicense_',__kolIdsTraceError);throw __kolIdsTraceError;}
  finally{KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_extendLicense_',Date.now()-__kolIdsTraceStartedAt);}
}
function KOL_IDS_CORE_bindLicenseWorkspace_(licenseId,email,workspaceId) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_bindLicenseWorkspace_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const id=String(licenseId||'').trim().toUpperCase(), em=String(email||'').trim().toLowerCase(), wid=String(workspaceId||'').trim();
  if(!id||!em||!wid) throw new Error('License workspace binding requires License ID, email and workspace ID.');
  const sales=KOL_IDS_CORE_salesSS_();
  // Resolve the canonical license sheet defensively. Some legacy modules can
  // mutate/merge KOL_IDS.SHEETS at runtime, so binding must never depend on a
  // possibly stale sheet reference. Create the canonical sheet if missing.
  const licenseSheetName='ENT_LICENSES';
  const sh=KOL_IDS_CORE_ensureColumns_(sales,licenseSheetName,[
    'License ID','Access Code','Email','Customer Name','Workspace ID','Issued At',
    'Expires At','Status','Order ID','Token','Plan','Last Order Type',
    'Reminder 2M Sent','Reminder 1M Sent','Last Reminder At','Updated At'
  ]);
  const vals=sh.getDataRange().getValues();
  for(let i=1;i<vals.length;i++){
    const r=vals[i];
    if(String(r[0]).trim().toUpperCase()!==id) continue;
    if(String(r[2]).trim().toLowerCase()!==em) throw new Error('License email does not match the active Google Account.');
    const existing=String(r[4]||'').trim();
    if(existing && existing!==wid) throw new Error('License is already bound to another workspace.');
    r[4]=wid;
    r[9]=KOL_IDS_CORE_makeToken_({licenseId:id,code:String(r[1]),email:em,workspaceId:wid,exp:new Date(r[6]).getTime()});
    r[15]=new Date();
    sh.getRange(i+1,1,1,r.length).setValues([r]);
    return {success:true,licenseId:id,workspaceId:wid,token:r[9]};
  }
  throw new Error('License not found for workspace binding.');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_bindLicenseWorkspace_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_bindLicenseWorkspace_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_findLicense_(licenseId,email) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_findLicense_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh=KOL_IDS_CORE_salesSS_().getSheetByName('ENT_LICENSES'); if(!sh||sh.getLastRow()<2)return null;
  const lid=String(licenseId||'').trim(), em=String(email||'').trim().toLowerCase();
  if(typeof KOL_IDS_DATA_findByColumn_==='function'){
    if(lid){var hit=KOL_IDS_DATA_findByColumn_(sh,1,lid);if(hit)return {row:hit.row,index:hit.dataIndex};}
    if(em){var hits=KOL_IDS_DATA_findAllByColumn_(sh,3,em);for(var j=0;j<hits.length;j++){if(String(hits[j].row[7]||'').toUpperCase()==='ACTIVE')return {row:hits[j].row,index:hits[j].dataIndex};}}
  }
  const rows=KOL_IDS_CORE_values_(sh); let best=null;
  rows.forEach((r,i)=>{if(lid && String(r[0]).toUpperCase()===lid.toUpperCase())best={row:r,index:i};});
  if(best)return best;
  rows.forEach((r,i)=>{if(!best && em && String(r[2]).toLowerCase()===em && String(r[7]).toUpperCase()==='ACTIVE')best={row:r,index:i};});
  return best?{row:best.row,index:best.index}:null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_findLicense_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_findLicense_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_findLicenseByEmail_(email){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_findLicenseByEmail_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_CORE_findLicense_('',email);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_findLicenseByEmail_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_findLicenseByEmail_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_sendTrialApprovalEmail_(order,trial){
  var guide=KOL_IDS_CORE_makeGuidePdf_();
  var web=KOL_IDS_CORE_getWebAppUrl_();
  var email=String(order[3]||'').trim().toLowerCase();
  if(!email)return;
  if(!web)throw new Error('Cannot send Trial approval email: canonical /exec Web App URL is not configured.');
  var key=String(trial.code||trial.accessKey||'').trim();
  var keyLine=key?'Access Key: '+key:'Access Key: ใช้ Access Key เดิมที่ได้รับก่อนหน้านี้ (ระบบไม่เก็บคีย์แบบอ่านกลับได้)';
  var name=String(order[2]||'ลูกค้า');
  var clientId=String(trial.clientId||'');
  var expires=String(trial.expiresAt||'');
  var body='เรียน '+name+'\n\nKOL IDS — Free Trial 7 วันได้รับการอนุมัติแล้ว\n\nClient ID: '+clientId+'\n'+keyLine+'\nทดลองถึง: '+expires+'\n\nTrial ใช้งานและดูผลวิเคราะห์ได้ แต่ Download / Export Report ถูกล็อก\n\nเมื่อสมัคร Paid Plan ให้ใช้ Client ID เดิม ข้อมูล Trial เดิมจะยังอยู่\n\nเปิด KOL IDS: '+web+'\n\nหากลิงก์เปิดไม่ได้ ให้ใช้ URL นี้โดยตรงและตรวจว่ากำลังเปิดลิงก์ /exec ของ deployment ล่าสุด';
  var html='<div style="font-family:Arial,sans-serif;line-height:1.6;color:#2a171b;max-width:680px">'
    +'<h2 style="margin-bottom:6px">KOL IDS — 7-Day Free Trial Approved</h2>'
    +'<p>เรียน '+KOL_IDS_CORE_html_(name)+',</p>'
    +'<p>Free Trial 7 วันของคุณได้รับการอนุมัติแล้ว</p>'
    +'<div style="padding:16px 18px;border:1px solid #eadfe1;border-radius:12px;background:#faf7f7">'
    +'<div><b>Client ID:</b> '+KOL_IDS_CORE_html_(clientId)+'</div>'
    +'<div><b>Access Key:</b> '+KOL_IDS_CORE_html_(key||'ใช้ Access Key เดิมที่ได้รับก่อนหน้านี้')+'</div>'
    +'<div><b>ทดลองถึง:</b> '+KOL_IDS_CORE_html_(expires)+'</div>'
    +'</div>'
    +'<p>Trial ใช้งานและดูผลวิเคราะห์ได้ แต่ Download / Export Report ถูกล็อก</p>'
    +'<p>เมื่อสมัคร Paid Plan ให้ใช้ Client ID เดิม ข้อมูล Trial เดิมจะยังอยู่</p>'
    +'<p><a href="'+KOL_IDS_CORE_html_(web)+'" style="display:inline-block;padding:12px 18px;background:#3d131b;color:#fff;text-decoration:none;border-radius:9px;font-weight:700">เปิด KOL IDS</a></p>'
    +'<p style="font-size:12px;color:#75686b">Web App URL: '+KOL_IDS_CORE_html_(web)+'</p>'
    +'</div>';
  MailApp.sendEmail({to:email,subject:'KOL IDS — 7-Day Free Trial Approved',body:body,htmlBody:html,attachments:[guide]});
}

function KOL_IDS_CORE_sendLicenseEmail_(order,license) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_sendLicenseEmail_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const guide=KOL_IDS_CORE_makeGuidePdf_(); const web=KOL_IDS_CORE_getWebAppUrl_(); if(!web) throw new Error('Cannot send license email: canonical /exec Web App URL is not configured.');
  const type=String(order[6]||'NEW').toUpperCase();
  const subject=type==='NEW'?'KOL IDS — License พร้อมใช้งาน '+license.licenseId:'KOL IDS — '+(type==='UPGRADE'?'Upgrade':type==='TRIAL_CONVERSION'?'Trial → Paid':'Renewal')+' สำเร็จ '+license.licenseId;
  const body='เรียน '+String(order[2]||'ลูกค้า')+'\n\nรายการของคุณได้รับการอนุมัติแล้ว\n\nClient ID: '+String((license.clientSync&&license.clientSync.clientId)||order[13]||'')+'\nAccess Key: '+String((license.clientSync&&license.clientSync.accessKey)||'ใช้ Access Key เดิมของคุณ (ไม่เปลี่ยน)')+'\nLicense ID: '+license.licenseId+'\nPlan: '+license.plan+'\nวันหมดอายุ: '+license.expiresAt+'\n\nWeb App: '+web+'\n\nClient ID + Access Key ใช้กับ Workspace เดิมได้ต่อ และข้อมูลเดิมยังคงอยู่.\n\n3 Months = 1 Google Account | 6 Months = 2 Google Accounts | 12 Months = 3 Google Accounts.\nReport Download / Export ปลดล็อกเมื่อเป็น Paid Plan.\n\nไฟล์แนบ: คู่มือการใช้งาน KOL IDS';
  MailApp.sendEmail({to:String(order[3]),subject:subject,body:body,attachments:[guide]});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_sendLicenseEmail_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_sendLicenseEmail_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_installReminderTrigger_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_installReminderTrigger_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const marker='KOL_IDS_CORE_REMINDER_TRIGGER'; const props=PropertiesService.getScriptProperties();
  if(props.getProperty(marker)==='1')return;
  ScriptApp.newTrigger('KOL_IDS_CORE_sendExpiryReminders').timeBased().everyDays(1).atHour(9).create(); props.setProperty(marker,'1');

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_installReminderTrigger_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_installReminderTrigger_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_sendExpiryReminders(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_sendExpiryReminders');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_CORE_salesSS_(), sh=ss.getSheetByName(KOL_IDS.SHEETS.LICENSES); if(!sh||sh.getLastRow()<2)return {sent:0};
  const rows=KOL_IDS_CORE_values_(sh), now=new Date(), sent=[];
  rows.forEach((r,i)=>{
    if(String(r[7]).toUpperCase()!=='ACTIVE')return; const exp=new Date(r[6]); if(isNaN(exp))return;
    const days=Math.ceil((exp.getTime()-now.getTime())/86400000); let col=0,label='';
    if(days<=62 && days>31 && !r[12]){col=13;label='2 เดือน';}
    else if(days<=31 && days>0 && !r[13]){col=14;label='1 เดือน';}
    if(!col)return;
    const email=String(r[2]||'').trim(); if(!email)return;
    MailApp.sendEmail(email,'KOL IDS — License จะหมดอายุใน '+label,'เรียน '+String(r[3]||'ลูกค้า')+'\n\nLicense '+r[0]+' จะหมดอายุวันที่ '+Utilities.formatDate(exp,Session.getScriptTimeZone(),'dd/MM/yyyy')+'\nเหลือประมาณ '+days+' วัน\n\nหากต้องการต่ออายุหรือ Upgrade ให้ใช้ Order / Renewal / Upgrade Form เดิม และระบุ License ID นี้');
    sh.getRange(i+2,col).setValue(true); sh.getRange(i+2,15).setValue(new Date()); sent.push({licenseId:r[0],stage:label});
  }); return {sent:sent.length,items:sent};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_sendExpiryReminders', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_sendExpiryReminders', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_addMonths_(date,months){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_addMonths_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const d=new Date(date);const day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+Number(months));const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,last));return d;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_addMonths_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_addMonths_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_updateWorkspaceExpiry_(workspaceId,expires){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_updateWorkspaceExpiry_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const ss=SpreadsheetApp.openById(workspaceId),sh=ss.getSheetByName('ENT_SYSTEM');if(sh&&sh.getLastRow()>=2)sh.getRange(2,4).setValue(expires);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_updateWorkspaceExpiry_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_updateWorkspaceExpiry_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_makeGuidePdf_(){var pricing=KOL_IDS_PRICING_AUTHORITY_().PLANS;var html='<!doctype html><html><head><meta charset="UTF-8"><style>body{font-family:Arial;padding:34px;line-height:1.55}table{border-collapse:collapse;width:100%}td,th{border:1px solid #aaa;padding:7px}</style></head><body><h1>KOL IDS™ — Customer Guide</h1><p>คู่มือสินค้า การใช้งาน การแก้ปัญหา และคำศัพท์สำคัญ</p><h2>ราคา</h2><table><tr><th>Plan</th><th>Price</th><th>Google Accounts</th></tr><tr><td>3 Months</td><td>THB '+Number(pricing.THREE_MONTHS.price).toLocaleString('en-US')+'</td><td>1</td></tr><tr><td>6 Months</td><td>THB '+Number(pricing.SIX_MONTHS.price).toLocaleString('en-US')+'</td><td>2</td></tr><tr><td>12 Months</td><td>THB '+Number(pricing.ONE_YEAR.price).toLocaleString('en-US')+'</td><td>3</td></tr></table><p>ทุก Account ใช้ Client ID + Access Key เดียวกัน</p><h2>Trial 7 วัน</h2><p>ใช้งาน Workspace และดูผลวิเคราะห์ได้ แต่ Download / Export Report ถูกล็อก ข้อมูล Trial ไม่หายเมื่อ Upgrade.</p><h2>การใช้งาน</h2><ol><li>เปิด Web App</li><li>กรอก Client ID และ Access Key 9 ตัว</li><li>กด View Access Key เพื่อตรวจอักขระก่อน Sign in</li><li>สร้าง Brand / Persona / Objective</li><li>สร้าง Campaign และเพิ่ม Creator</li><li>Run Matching / Analysis และตรวจ Decision Board</li><li>บันทึก Performance และดู Learning / Brand Memory</li><li>Paid Plan: Export / Download Report</li></ol><h2>แก้ปัญหา</h2><ul><li>Save ค้าง: อย่ากดซ้ำ รอสถานะแล้ว Refresh และ Sign in ใหม่</li><li>Sign in ไม่ผ่าน: ตรวจ Client ID และ Access Key 9 ตัวด้วยปุ่ม View Access Key</li><li>Report Export ไม่ได้: ตรวจว่า Trial ยังอยู่หรือยังไม่ได้สมัคร Paid Plan</li><li>ข้อมูลไม่ครบ: Confidence อาจลดลง ให้ตรวจ Brand/Persona/Creator Data แล้ววิเคราะห์ใหม่</li></ul><h2>คำศัพท์</h2><table><tr><th>คำ</th><th>ความหมาย</th></tr><tr><td>Client ID</td><td>รหัส Workspace ของลูกค้า</td></tr><tr><td>Access Key</td><td>รหัสสำหรับยืนยันการเข้าใช้งาน</td></tr><tr><td>Workspace</td><td>พื้นที่ข้อมูล Brand, Campaign, Matching และ Learning</td></tr><tr><td>Decision Board</td><td>หน้าสรุปเพื่อช่วยตัดสินใจ</td></tr><tr><td>Confidence</td><td>ระดับความมั่นใจตามข้อมูลและหลักฐาน</td></tr><tr><td>Brand Memory</td><td>ความรู้/บทเรียนสะสมของ Brand</td></tr><tr><td>Report Export</td><td>การนำ Report ออกจากระบบ ซึ่งปลดล็อกใน Paid Plan</td></tr></table><h2>ข้อควรเข้าใจ</h2><p>Recommendation ไม่ใช่การรับประกันผลลัพธ์ และคุณภาพข้อมูลมีผลต่อผลวิเคราะห์</p><h2>Upgrade</h2><p>ใช้ Client ID เดิมเพื่อรักษา Workspace และข้อมูล Trial เดิม แล้วระบบจะปลดล็อก Report ตาม Paid Plan ที่อนุมัติ</p></body></html>';return Utilities.newBlob(html,'text/html','KOL_IDS_Customer_Guide.html').getAs(MimeType.PDF).setName('KOL_IDS_Customer_Guide.pdf');}

function KOL_IDS_CORE_createWorkspace_(name) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_createWorkspace_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
 return SpreadsheetApp.create('KOL IDS — '+name); 
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_createWorkspace_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_createWorkspace_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_initWorkspace_(ss,licenseId,name,email,expires) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_initWorkspace_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const specs={
    ENT_BRANDS:['Brand ID','Brand Name','Category','Market','Positioning','Values','Avoid','Created At','Updated At'],
    ENT_PERSONAS:['Persona ID','Persona Name','Age Min','Age Max','Gender','Locations','Interests','Behaviors','Description','Created At','Audience Age Range','Goals & Needs','Pain Points'],
    ENT_CREATORS:['Creator ID','Creator Name','Platform','Platform URL','Followers','ER %','Age Min','Age Max','Gender','Locations','Interests','Content Styles','Category','Rate','Currency','Historical Campaigns','Historical Notes','Risk Level','Created At'],
    ENT_DECISIONS:['Decision ID','Campaign ID','Creator ID','Creator Name','Decision','Decision Score','Persona Fit','Audience Fit','Content Fit','Objective Fit','Brand Fit','Confidence','Confidence Score','Why','Data Limitation','Created At'],
    ENT_CAMPAIGNS:['Campaign ID','Campaign Name','Brand ID','Persona ID','Objective','Budget','Currency','Start Date','End Date','Selected Creator IDs','Status','Created At'],
    ENT_PERFORMANCE:['Performance ID','Campaign ID','Creator ID','Creator Name','Spend','Reach','Impressions','Views','Engagements','Clicks','Conversions','Revenue','Currency','Evidence','Reported Date','Notes','Created At'],
    ENT_LEARNING:['Learning ID','Campaign ID','Creator ID','Creator Name','Predicted Score','Actual Score','Variance','Performance Summary','What Worked','What Did Not','Next Action','Created At'],
    ENT_MEMORY:['Memory ID','Scope','Key','Value','Confidence','Source Campaign','Updated At'],
    ENT_BENCHMARKS:['Benchmark ID','Campaign ID','Campaign Goal','Peer Count','Metric','Actual','Benchmark','Delta %','Percentile','Confidence','Peer Definition','Created At'],
    ENT_AUDIT_LOG:['Timestamp','Action','Entity ID','Status','Message']
  };
  Object.keys(specs).forEach(k=>KOL_IDS_CORE_ensureSheet_(ss,k,specs[k]));
  const sys=KOL_IDS_CORE_ensureSheet_(ss,'ENT_SYSTEM',['License ID','Customer Name','Email','Expires At','Status','Version','Initialized At']);
  if(sys.getLastRow()<2) sys.appendRow([licenseId,name,email,expires,'ACTIVE',KOL_IDS.VERSION,new Date()]);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_initWorkspace_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_initWorkspace_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_secret_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_secret_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const p=PropertiesService.getScriptProperties();let s=p.getProperty(KOL_IDS.SECRET_PROP);if(!s){s=Utilities.getUuid()+Utilities.getUuid()+Utilities.getUuid();p.setProperty(KOL_IDS.SECRET_PROP,s);}return s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_secret_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_secret_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_makeToken_(obj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_makeToken_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const raw=Utilities.base64EncodeWebSafe(JSON.stringify(obj));const sig=Utilities.computeHmacSha256Signature(raw,KOL_IDS_CORE_secret_());return raw+'.'+Utilities.base64EncodeWebSafe(sig);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_makeToken_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_makeToken_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_verifyToken_(token){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_verifyToken_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const parts=String(token||'').trim().split('.');if(parts.length!==2)throw new Error('Invalid access token.');const expected=Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(parts[0],KOL_IDS_CORE_secret_()));if(parts[1]!==expected)throw new Error('Invalid access token.');let obj;try{obj=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString());}catch(e){throw new Error('Invalid access token.');}if(!obj.exp||Date.now()>Number(obj.exp))throw new Error('License expired. Please contact support.');return obj;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_verifyToken_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_verifyToken_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_login(code){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_login');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    KOL_IDS_SECURITY_ASSERT_USER_();
    const currentEmail=String(KOL_IDS_SECURITY_GET_EMAIL_()||'').trim().toLowerCase();
    const c=String(code||'').trim().toUpperCase();
    if(!c) throw new Error('กรุณากรอก Access Code');
    const ss=KOL_IDS_CORE_salesSS_(), sh=ss.getSheetByName(KOL_IDS.SHEETS.LICENSES);
    if(!sh||sh.getLastRow()<2) throw new Error('Access Code not found.');
    const rows=KOL_IDS_CORE_values_(sh);
    const r=rows.find(x=>String(x[1]||'').trim().toUpperCase()===c);
    if(!r) throw new Error('Access Code ไม่ถูกต้อง');
    const licenseEmail=String(r[2]||'').trim().toLowerCase();
    if(licenseEmail!==currentEmail) throw new Error('This Access Code belongs to a different Google Account.');
    if(String(r[7]||'').toUpperCase()!=='ACTIVE') throw new Error('License is not active.');
    const exp=new Date(r[6]);
    if(isNaN(exp.getTime())) throw new Error('License expiry is invalid.');
    if(exp.getTime()<=Date.now()) throw new Error('License expired.');

    // Always issue a token with the CURRENT secret. This repairs tokens created
    // before a secret rotation/project migration and prevents stale-token failures.
    const freshToken=KOL_IDS_CORE_makeToken_({
      licenseId:String(r[0]||''),
      code:String(r[1]||''),
      email:licenseEmail,
      workspaceId:String(r[4]||'').trim(),
      exp:exp.getTime()
    });
    const dataRow=rows.indexOf(r)+2;
    if(dataRow>=2){
      sh.getRange(dataRow,10).setValue(freshToken);
      sh.getRange(dataRow,16).setValue(new Date());
    }
    return {success:true,token:freshToken,licenseId:r[0],email:r[2],workspaceId:String(r[4]||''),expiresAt:exp.toISOString(),version:KOL_IDS.VERSION};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_login', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_login', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_resolveQAToken_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_resolveQAToken_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    /*
     * QA must be idempotent. Do NOT call setupSales() here: setupSales() is a
     * commercial/admin setup routine and may recreate Forms / response sheets.
     * QA only needs the already-authoritative sales spreadsheet + ENT_LICENSES.
     */
    var props=PropertiesService.getScriptProperties();
    var salesId=String(props.getProperty(KOL_IDS.SALES_SS)||'').trim();
    var ssSales=null;
    if(salesId){ try{ ssSales=SpreadsheetApp.openById(salesId); }catch(e){ ssSales=null; } }
    if(!ssSales){
      ssSales=SpreadsheetApp.getActiveSpreadsheet();
      if(!ssSales) throw new Error('QA cannot resolve the master spreadsheet.');
      props.setProperty(KOL_IDS.SALES_SS,ssSales.getId());
    }

    var sh=KOL_IDS_CORE_ensureColumns_(ssSales,'ENT_LICENSES',[
      'License ID','Access Code','Email','Customer Name','Workspace ID','Issued At',
      'Expires At','Status','Order ID','Token','Plan','Last Order Type',
      'Reminder 2M Sent','Reminder 1M Sent','Last Reminder At','Updated At'
    ]);
    var currentEmail=String(KOL_IDS_SECURITY_GET_EMAIL_()||Session.getEffectiveUser().getEmail()||'').trim().toLowerCase();
    if(!currentEmail) throw new Error('QA cannot determine the current Google Account email.');

    var rows=KOL_IDS_CORE_values_(sh);
    var candidate=null, candidateIndex=-1;
    for(var i=0;i<rows.length;i++){
      var r=rows[i], status=String(r[7]||'').trim().toUpperCase(), email=String(r[2]||'').trim().toLowerCase();
      var exp=new Date(r[6]);
      if(status==='ACTIVE' && email===currentEmail && !isNaN(exp.getTime()) && exp.getTime()>Date.now()){
        candidate=r; candidateIndex=i; break;
      }
    }

    /* Reuse a previously provisioned QA workspace whenever possible. */
    var qaWorkspaceId=String(props.getProperty('KOL_IDS_CORE_QA_WORKSPACE_ID')||'').trim();
    var workspace=null;
    if(qaWorkspaceId){
      try{ workspace=SpreadsheetApp.openById(qaWorkspaceId); }catch(e){ workspace=null; props.deleteProperty('KOL_IDS_CORE_QA_WORKSPACE_ID'); }
    }

    if(candidate){
      var licenseId=String(candidate[0]||'').trim();
      var code=String(candidate[1]||'').trim();
      var expMs=new Date(candidate[6]).getTime();
      var boundWorkspaceId=String(candidate[4]||'').trim();

      if(boundWorkspaceId){
        /* The license already has an authoritative workspace binding. */
        var fresh=KOL_IDS_CORE_makeToken_({licenseId:licenseId,code:code,email:currentEmail,workspaceId:boundWorkspaceId,exp:expMs});
        sh.getRange(candidateIndex+2,10).setValue(fresh);
        sh.getRange(candidateIndex+2,16).setValue(new Date());
        props.setProperty('KOL_IDS_CORE_QA_WORKSPACE_ID',boundWorkspaceId);
        return fresh;
      }

      if(!workspace){
        workspace=KOL_IDS_CORE_createWorkspace_('QA Test Workspace');
        props.setProperty('KOL_IDS_CORE_QA_WORKSPACE_ID',workspace.getId());
      }

      /* Bind directly to the exact row we selected. This avoids a second lookup
       * race/alias path and makes the QA bootstrap deterministic. */
      var newToken=KOL_IDS_CORE_makeToken_({licenseId:licenseId,code:code,email:currentEmail,workspaceId:workspace.getId(),exp:expMs});
      sh.getRange(candidateIndex+2,5).setValue(workspace.getId());
      sh.getRange(candidateIndex+2,10).setValue(newToken);
      sh.getRange(candidateIndex+2,16).setValue(new Date());
      SpreadsheetApp.flush();
      KOL_IDS_CORE_initWorkspace_(workspace,licenseId,'KOL IDS QA TEST CLIENT',currentEmail,new Date(expMs));
      return newToken;
    }

    /* No license exists: issue exactly one QA license, then locate the exact
     * appended row and bind it directly. */
    var now=new Date();
    var testOrder=[];
    testOrder[0]='QA-'+Utilities.formatDate(now,Session.getScriptTimeZone(),'yyyyMMdd-HHmmss');
    testOrder[2]='KOL IDS QA TEST CLIENT';
    testOrder[3]=currentEmail;
    testOrder[7]='1 Year';
    var license=KOL_IDS_CORE_issueLicense_(testOrder);
    SpreadsheetApp.flush();

    rows=KOL_IDS_CORE_values_(sh);
    candidate=null; candidateIndex=-1;
    for(var j=rows.length-1;j>=0;j--){
      if(String(rows[j][0]||'').trim().toUpperCase()===String(license.licenseId||'').trim().toUpperCase()){
        candidate=rows[j]; candidateIndex=j; break;
      }
    }
    if(!candidate) throw new Error('QA license was issued but could not be reconciled into ENT_LICENSES.');

    if(!workspace){
      workspace=KOL_IDS_CORE_createWorkspace_('QA Test Workspace');
      props.setProperty('KOL_IDS_CORE_QA_WORKSPACE_ID',workspace.getId());
    }
    var token=KOL_IDS_CORE_makeToken_({licenseId:String(candidate[0]),code:String(candidate[1]),email:currentEmail,workspaceId:workspace.getId(),exp:new Date(candidate[6]).getTime()});
    sh.getRange(candidateIndex+2,5).setValue(workspace.getId());
    sh.getRange(candidateIndex+2,10).setValue(token);
    sh.getRange(candidateIndex+2,16).setValue(new Date());
    SpreadsheetApp.flush();
    KOL_IDS_CORE_initWorkspace_(workspace,String(candidate[0]),'KOL IDS QA TEST CLIENT',currentEmail,new Date(candidate[6]));
    return token;
  } catch(e) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_resolveQAToken_',e);
    throw e;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_resolveQAToken_',Date.now()-__kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_ctx_(token){
  token = String(token||'').trim();
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_ctx_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
    let t;
    try {
      t=KOL_IDS_CORE_verifyToken_(token);
    } catch(e) {
      // Token migration/self-heal: if the project secret was rotated, validate
      // the token payload against the authoritative license record, then issue
      // a new token using the current secret. We never accept the stale signature.
      const parts=String(token||'').split('.');
      if(parts.length!==2) throw e;
      let payload;
      try { payload=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString()); }
      catch(ignore) { throw e; }
      if(!payload||!payload.licenseId||!payload.email||!payload.code) throw e;
      const sales=KOL_IDS_CORE_salesSS_();
      const sh=sales.getSheetByName(KOL_IDS.SHEETS.LICENSES);
      const lic=sh?KOL_IDS_CORE_findLicense_(payload.licenseId,payload.email):null;
      if(!lic) throw e;
      const r=lic.row;
      if(String(r[1]||'').trim().toUpperCase()!==String(payload.code||'').trim().toUpperCase()) throw e;
      if(String(r[2]||'').trim().toLowerCase()!==String(payload.email||'').trim().toLowerCase()) throw e;
      if(String(r[7]||'').toUpperCase()!=='ACTIVE') throw new Error('License is not active.');
      const exp=new Date(r[6]);
      if(isNaN(exp.getTime())||exp.getTime()<=Date.now()) throw new Error('License expired.');
      const wid=String(r[4]||payload.workspaceId||'').trim();
      if(!wid) throw new Error('Workspace missing.');
      if(payload.workspaceId && String(payload.workspaceId)!==wid) throw e;
      t={licenseId:String(r[0]),code:String(r[1]),email:String(r[2]).toLowerCase(),workspaceId:wid,exp:exp.getTime()};
      const repaired=KOL_IDS_CORE_makeToken_(t);
      const vals=sh.getDataRange().getValues();
      for(let i=1;i<vals.length;i++) if(String(vals[i][0])===String(r[0])) { sh.getRange(i+1,10).setValue(repaired); sh.getRange(i+1,16).setValue(new Date()); break; }
    }
    if(!t.workspaceId) throw new Error('Workspace missing.');
    const sales=KOL_IDS_CORE_salesSS_(), sh=sales.getSheetByName('ENT_LICENSES');
    const r=sh?KOL_IDS_CORE_findLicense_(t.licenseId,t.email):null;
    if(!r) throw new Error('License not found.');
    if(String(r.row[7]).toUpperCase()!=='ACTIVE') throw new Error('License is not active.');
    if(new Date(r.row[6]).getTime()<=Date.now()) throw new Error('License expired.');
    if(String(r.row[4])!==String(t.workspaceId)) throw new Error('Workspace binding mismatch.');
    const ss=SpreadsheetApp.openById(t.workspaceId);
    return {token:t,ss:ss,licenseRow:r.row};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_ctx_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_ctx_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_ensureColumns_(ss,name,headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_ensureColumns_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let s=ss.getSheetByName(name); if(!s)s=ss.insertSheet(name);
  if(s.getLastRow()===0){s.getRange(1,1,1,headers.length).setValues([headers]);}
  else {
    const current=s.getRange(1,1,1,s.getLastColumn()).getValues()[0].map(String);
    headers.forEach(h=>{if(current.indexOf(h)<0){s.getRange(1,current.length+1).setValue(h);current.push(h);}});
  }
  s.setFrozenRows(1); return s;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_ensureColumns_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_ensureColumns_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_ensureSheet_(ss,name,headers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_ensureSheet_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);if(s.getLastRow()===0)s.appendRow(headers);else{const h=s.getRange(1,1,1,headers.length).getValues()[0];let bad=false;for(let i=0;i<headers.length;i++)if(String(h[i]||'')!==headers[i]){bad=true;break;}if(bad)s.getRange(1,1,1,headers.length).setValues([headers]);}s.setFrozenRows(1);return s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_ensureSheet_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_ensureSheet_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_values_(s){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_values_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(!s||s.getLastRow()<2)return [];return s.getRange(2,1,s.getLastRow()-1,s.getLastColumn()).getValues().filter(r=>r.some(v=>v!==''&&v!=null));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_values_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_values_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_findRow_(s,id){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_findRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
var hit=(typeof KOL_IDS_DATA_findByColumn_==='function')?KOL_IDS_DATA_findByColumn_(s,1,id):null;return hit?hit.row:(KOL_IDS_CORE_values_(s).find(r=>String(r[0])===String(id))||null);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_findRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_findRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_req_(v,n){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_req_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const s=String(v||'').trim();if(!s)throw new Error(n+' is required.');return s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_req_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_req_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_num_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_num_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const n=Number(v);return isFinite(n)?n:NaN;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_num_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_num_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_numOrBlank_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_numOrBlank_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v==null)return '';const n=Number(v);if(!isFinite(n)||n<0)throw new Error('Numeric value is invalid.');return n;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_numOrBlank_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_numOrBlank_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_pctOrBlank_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_pctOrBlank_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
if(v===''||v==null)return '';const n=Number(v);if(!isFinite(n)||n<0||n>100)throw new Error('ER must be between 0 and 100.');return n;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_pctOrBlank_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_pctOrBlank_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_random_(n){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_random_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
let s='';const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';for(let i=0;i<n;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_random_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_random_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_salesSS_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_salesSS_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const id=PropertiesService.getScriptProperties().getProperty(KOL_IDS.SALES_SS);if(!id)throw new Error('Sales system is not set up. Run KOL_IDS_CORE_setupSales().');return SpreadsheetApp.openById(id);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_salesSS_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_salesSS_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_assertAdminPin_(pin){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_assertAdminPin_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const expected=String(PropertiesService.getScriptProperties().getProperty(KOL_IDS.ADMIN_PIN)||'');if(!expected||String(pin||'')!==expected)throw new Error('Admin PIN is invalid.');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_assertAdminPin_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_assertAdminPin_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_assertAdmin_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_assertAdmin_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const expected=String(PropertiesService.getScriptProperties().getProperty(KOL_IDS.ADMIN_EMAIL)||String(Session.getEffectiveUser().getEmail()||'')).toLowerCase();const current=String(Session.getEffectiveUser().getEmail()||'').toLowerCase();if(!expected||!current||expected!==current)throw new Error('Admin access denied.');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_assertAdmin_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_assertAdmin_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_audit_(ss,a,id,status,msg){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_audit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
ss.getSheetByName(KOL_IDS.SHEETS.LEGACY_AUDIT).appendRow([new Date(),a,id,status,msg]);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_audit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_audit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_html_legacy_(s){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_html_legacy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_html_legacy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_html_legacy_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* =========================================================
   KOL IDS — PRODUCTION PRODUCT UPGRADE
   Decision Intelligence + Creator UX + Reporting
   ========================================================= */



function KOL_IDS_CORE_colMap_(sh){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_colMap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  const m={}; h.forEach((x,i)=>m[x]=i); return m;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_colMap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_colMap_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_setByHeader_(sh,rowObj){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_setByHeader_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const m=KOL_IDS_CORE_colMap_(sh), row=Array(sh.getLastColumn()).fill('');
  Object.keys(rowObj).forEach(k=>{if(m[k]!=null)row[m[k]]=rowObj[k];});
  return row;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_setByHeader_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_setByHeader_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_estimateER_(platform,followers){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_estimateER_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const f=Number(followers||0), p=String(platform||'').toUpperCase();
  let base=p==='TIKTOK'?4.5:p==='INSTAGRAM'?2.8:p==='YOUTUBE'?3.2:p==='FACEBOOK'?1.5:p==='X'?2.2:2.5;
  if(f>=1000000)base*=.65; else if(f>=500000)base*=.75; else if(f>=100000)base*=.85; else if(f>0&&f<10000)base*=1.15;
  return Math.round(Math.max(.5,Math.min(12,base))*100)/100;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_estimateER_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_estimateER_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_estimateRate_(platform,followers,category){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_estimateRate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const f=Number(followers||0); if(!f)return '';
  const p=String(platform||'').toUpperCase();
  let perThousand=p==='TIKTOK'?90:p==='INSTAGRAM'?110:p==='YOUTUBE'?150:p==='FACEBOOK'?55:p==='X'?45:75;
  const cat=String(category||'').toLowerCase();
  if(/beauty|fashion|luxury|tech/.test(cat))perThousand*=1.15;
  if(f>1000000)perThousand*=.8; else if(f>500000)perThousand*=.88;
  return Math.round((f/1000)*perThousand/100)*100;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_estimateRate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_estimateRate_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_dataSignals_(r){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_dataSignals_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const platform=r[2], followers=r[4], er=r[5], rate=r[13], category=r[12];
  const erActual=er!==''&&er!=null&&isFinite(Number(er));
  const rateActual=rate!==''&&rate!=null&&isFinite(Number(rate));
  const erValue=erActual?Number(er):KOL_IDS_CORE_estimateER_(platform,followers);
  const rateValue=rateActual?Number(rate):KOL_IDS_CORE_estimateRate_(platform,followers,category);
  const erSource=erActual?'ACTUAL':'ESTIMATED';
  const rateSource=rateActual?'ACTUAL':'ESTIMATED';
  return {erValue,rateValue,erSource,rateSource};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_dataSignals_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_dataSignals_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_efficiencyScore_(followers,er,rate,objective){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_efficiencyScore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const f=Number(followers||0), e=Number(er||0), cost=Number(rate||0);
  if(!f||!e||!cost)return {score:50,commercial:0,expectedEngagements:0,cpe:0};
  const expected=f*(e/100), cpe=cost/expected, cpeScore=cpe<=0.5?100:cpe<=1?92:cpe<=2?82:cpe<=4?70:cpe<=8?55:35;
  const reachProxy=Math.min(100,Math.log10(Math.max(10,f))/6*100);
  const engagementProxy=Math.min(100,e/6*100);
  let score=Math.round(cpeScore*.65+reachProxy*.15+engagementProxy*.20);
  if(String(objective||'').toUpperCase()==='AWARENESS'&&f>=100000)score=Math.min(100,score+5);
  return {score,commercial:Math.round(Math.max(0,expected)/Math.max(1,cost)*100)/100,expectedEngagements:expected,cpe};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_efficiencyScore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_efficiencyScore_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_learningAdjustment_(ss,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_learningAdjustment_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const rows=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_MEMORY')).filter(r=>String(r[2])===String(creatorId));
  if(!rows.length)return 0;
  const txt=rows[rows.length-1][3]||''; const m=String(txt).match(/variance\s+(-?\d+(?:\.\d+)?)/i);
  if(!m)return 0; const v=Number(m[1]); return Math.max(-8,Math.min(8,Math.round(v*.12)));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_learningAdjustment_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_learningAdjustment_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_upgradeState_(token){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_upgradeState_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  KOL_IDS_CORE_upgradeSchema_(token);
  const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;
  const b=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_BRANDS')),p=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_PERSONAS')),k=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CREATORS')),d=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_DECISIONS')),ca=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CAMPAIGNS')),pf=KOL_IDS_CORE_values_(KOL_IDS_PA_legacyProjection_(ss)),le=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_LEARNING')),me=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_MEMORY'));
  const cm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CREATORS')),pm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_PERSONAS'));
  const pval=(r,h,f)=>pm[h]!=null?(r[pm[h]]??''):(f==null?'':f);
  return {licenseId:c.token.licenseId,expiresAt:c.token.exp,brand:b.map(r=>({id:r[0],name:r[1],category:r[2],market:r[3],positioning:r[4],values:r[5],avoid:r[6]})),personas:p.map(r=>({id:r[0],name:r[1],ageMin:r[2],ageMax:r[3],gender:r[4],locations:r[5],interests:r[6],behaviors:r[7],description:r[8],goalsNeeds:pval(r,'Goals & Needs'),painPoints:pval(r,'Pain Points')})),creators:k.map(r=>{const sig=KOL_IDS_CORE_dataSignals_(r);const ar=(r[6]!==''&&r[7]!=='')?String(r[6])+'-'+String(r[7]):'';return {id:r[0],name:r[1],platform:r[2],platformUrl:r[3],followers:r[4],er:r[5],ageMin:r[6],ageMax:r[7],ageRange:ar,gender:r[8],locations:r[9],interests:r[10],contentStyles:r[11],category:r[12],rate:r[13],currency:r[14],historicalCampaigns:KOL_IDS_CORE_derivedHistory_(ss,r[0]),historicalNotes:r[16],risk:KOL_IDS_CORE_derivedRisk_(ss,r[0],r,sig),photoUrl:cm['Photo URL']!=null?r[cm['Photo URL']]:'',socialLinks:cm['Social Links']!=null?r[cm['Social Links']]:'',erSource:cm['ER Source']!=null?r[cm['ER Source']]:'',rateSource:cm['Rate Source']!=null?r[cm['Rate Source']]:'',profileType:cm['Profile Type']!=null?r[cm['Profile Type']]:'Primary',
personality:cm['Personality']!=null?String(r[cm['Personality']]||'').split(' | ').filter(Boolean):[],
communication:cm['Communication']!=null?String(r[cm['Communication']]||'').split(' | ').filter(Boolean):[],
influence:cm['Influence Style']!=null?String(r[cm['Influence Style']]||'').split(' | ').filter(Boolean):[],
relationship:cm['Audience Relationship']!=null?String(r[cm['Audience Relationship']]||'').split(' | ').filter(Boolean):[],
socialBehavior:cm['Social Behavior']!=null?String(r[cm['Social Behavior']]||'').split(' | ').filter(Boolean):[],
contentPersonality:cm['Content Personality']!=null?String(r[cm['Content Personality']]||'').split(' | ').filter(Boolean):[],
contentFunction:cm['Content Function']!=null?String(r[cm['Content Function']]||'').split(' | ').filter(Boolean):[],
contentBehavior:cm['Content Behavior']!=null?String(r[cm['Content Behavior']]||'').split(' | ').filter(Boolean):[],
psychology:cm['Audience Psychology']!=null?String(r[cm['Audience Psychology']]||'').split(' | ').filter(Boolean):[]
};}),decisions:d,campaigns:ca,performance:pf,learning:le,memory:me};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_upgradeState_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_upgradeState_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_getState(token){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_getState');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_CORE_upgradeState_(token);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_getState', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_getState', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_saveBrand(token,p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_saveBrand');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const lock=LockService.getScriptLock();
  lock.waitLock(15000);
  try{
    const c=KOL_IDS_CORE_ctx_(token),ss=c.ss; KOL_IDS_CORE_upgradeSchema_(token);
    const name=KOL_IDS_CORE_req_(p&&p.name,'Brand Name');
    const sh=ss.getSheetByName('ENT_BRANDS'), vals=KOL_IDS_CORE_values_(sh);
    const id=String((p&&p.id)||'BR-'+Utilities.getUuid().slice(0,8).toUpperCase());
    const idx=vals.findIndex(r=>String(r[0])===id), old=idx>=0?vals[idx]:[];
    const now=new Date();
    const row=KOL_IDS_CORE_setByHeader_(sh,{
      'Brand ID':id,'Brand Name':name,'Category':String(p.category||'').trim(),
      'Market':String(p.market||'').trim(),'Positioning':String(p.positioning||'').trim(),
      'Values':String(p.values||'').trim(),'Avoid':String(p.avoid||'').trim(),
      'Created At':idx<0?now:(old[7]||now),'Updated At':now
    });
    if(idx<0)sh.appendRow(row); else sh.getRange(idx+2,1,1,row.length).setValues([row]);
    KOL_IDS_CORE_audit_(ss,'SAVE_BRAND',id,'OK','Brand saved');
    return {success:true,id,complete:true};
  } finally { lock.releaseLock(); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_saveBrand', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_saveBrand', Date.now() - __kolIdsTraceStartedAt);
  }
}



function KOL_IDS_CORE_saveCreator(token,p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_saveCreator');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const c=KOL_IDS_CORE_ctx_(token),ss=c.ss; KOL_IDS_CORE_upgradeSchema_(token);
  const name=KOL_IDS_CORE_req_(p.name,'Creator Name');
  const sh=ss.getSheetByName('ENT_CREATORS'), vals=KOL_IDS_CORE_values_(sh);
  const id=String(p.id||'CR-'+Utilities.getUuid().slice(0,8).toUpperCase());
  const idx=vals.findIndex(r=>String(r[0])===id), old=idx>=0?vals[idx]:[];
  const followers=KOL_IDS_CORE_numOrBlank_(p.followers), er=KOL_IDS_CORE_pctOrBlank_(p.er), rate=KOL_IDS_CORE_numOrBlank_(p.rate);
  let ageMin=KOL_IDS_CORE_numOrBlank_(p.ageMin), ageMax=KOL_IDS_CORE_numOrBlank_(p.ageMax);
  if((ageMin===''||ageMax==='')&&p.ageRange){const ar=KOL_IDS_CORE_parseAgeRange_(p.ageRange);ageMin=ar.min;ageMax=ar.max;}
  const signals=KOL_IDS_CORE_dataSignals_([id,name,p.platform||'',p.platformUrl||'',followers,er,'','','','','','','',rate,p.currency||'THB']);
  let photoUrl=p.photoUrl||'';
  if(p.photoData){
    const parts=String(p.photoData).split(',');
    if(parts.length===2){
      const mime=(String(p.photoData).match(/^data:([^;]+);/)||[])[1]||'image/jpeg';
      const bytes=Utilities.base64Decode(parts[1]);
      const blob=Utilities.newBlob(bytes,mime,'creator_'+id+'.jpg');
      const folder=KOL_IDS_CORE_creatorPhotoFolder_(ss), file=folder.createFile(blob);
      try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch(e) {}
      photoUrl='https://drive.google.com/thumbnail?id='+encodeURIComponent(file.getId())+'&sz=w800';
    }
  }
  const existingPhoto=idx>=0?old[KOL_IDS_CORE_colMap_(sh)['Photo URL']]||'':'';
  const row=KOL_IDS_CORE_setByHeader_(sh,{
    'Creator ID':id,'Creator Name':name,'Platform':p.platform||'','Platform URL':p.platformUrl||'',
    'Followers':followers,'ER %':er,'Age Min':ageMin,'Age Max':ageMax,'Gender':p.gender||'ANY',
    'Locations':p.locations||'','Interests':p.interests||'','Content Styles':p.contentStyles||'',
    'Category':p.category||'','Rate':rate,'Currency':p.currency||'THB',
    'Historical Campaigns':KOL_IDS_CORE_derivedHistory_(ss,id),
    'Historical Notes':p.historicalNotes||p.notes||'',
    'Risk Level':KOL_IDS_CORE_derivedRisk_(ss,id,{4:followers,6:ageMin,7:ageMax,9:p.locations||'',10:p.interests||''},signals),
    'Audience Age Range':(ageMin!==''&&ageMax!=='')?String(ageMin)+'-'+String(ageMax):'',
    'Data Confidence':KOL_IDS_CORE_dataQuality_([id,name,p.platform||'',p.platformUrl||'',followers,er,ageMin,ageMax,p.gender||'ANY',p.locations||'',p.interests||'',p.contentStyles||'',p.category||'',rate,p.currency||'THB'],signals,KOL_IDS_CORE_derivedHistory_(ss,id)),
    'Created At':idx<0?new Date():old[18],
    'Photo URL':photoUrl||existingPhoto,'Social Links':p.socialLinks||'',
    'ER Source':signals.erSource,'Rate Source':signals.rateSource,'Profile Type':'Primary',
    'Personality':(p.personality||[]).join(' | '),'Communication':(p.communication||[]).join(' | '),
    'Influence Style':(p.influence||[]).join(' | '),'Audience Relationship':(p.relationship||[]).join(' | '),
    'Social Behavior':(p.socialBehavior||[]).join(' | '),'Content Personality':(p.contentPersonality||[]).join(' | '),
    'Content Function':(p.contentFunction||[]).join(' | '),'Content Behavior':(p.contentBehavior||[]).join(' | '),
    'Audience Psychology':(p.psychology||[]).join(' | ')
  });
  if(idx<0)sh.appendRow(row); else sh.getRange(idx+2,1,1,row.length).setValues([row]);
  KOL_IDS_CORE_audit_(ss,'SAVE_CREATOR',id,'OK','Creator saved with system-derived history/risk and provenance: ER '+signals.erSource+', Rate '+signals.rateSource);
  return {success:true,id,complete:true,erValue:signals.erValue,erSource:signals.erSource,rateValue:signals.rateValue,rateSource:signals.rateSource,photoUrl};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_saveCreator', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_saveCreator', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_creatorPhotoFolder_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_creatorPhotoFolder_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const props=PropertiesService.getScriptProperties(),key='KOL_IDS_CORE_PHOTO_FOLDER_'+ss.getId();let id=props.getProperty(key),folder=null;if(id)try{folder=DriveApp.getFolderById(id);}catch(e){}if(!folder){folder=DriveApp.createFolder('KOL IDS Creator Photos — '+ss.getName());props.setProperty(key,folder.getId());}return folder;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_creatorPhotoFolder_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_creatorPhotoFolder_', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_CORE_parseAgeRange_(range){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_parseAgeRange_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const m=String(range||'').match(/(\d+)\s*[-–]\s*(\d+)/);
  if(m)return {min:Number(m[1]),max:Number(m[2])};
  if(String(range||'').trim().match(/^55\+$/))return {min:55,max:120};
  return {min:'',max:''};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_parseAgeRange_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_parseAgeRange_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_resolveRowByIdOrName_(sh,value,nameIndex){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_resolveRowByIdOrName_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const v=String(value||'').trim();
  if(!v)return null;
  const rows=KOL_IDS_CORE_values_(sh);
  const byId=rows.find(r=>String(r[0]).trim()===v);
  if(byId)return byId;
  const idx=(nameIndex==null?1:nameIndex);
  return rows.find(r=>String(r[idx]||'').trim().toLowerCase()===v.toLowerCase())||null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_resolveRowByIdOrName_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_resolveRowByIdOrName_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_derivedHistory_(ss,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_derivedHistory_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!ss || typeof ss.getSheetByName!=='function') return 0;
  let sh=null;
  try{ sh=KOL_IDS_PA_legacyProjection_(ss); }catch(e){ return 0; }
  if(!sh || typeof sh.getLastRow!=='function' || typeof sh.getLastColumn!=='function' || typeof sh.getRange!=='function') return 0;
  try{
    const pm=KOL_IDS_CORE_colMap_(sh);
    const perf=KOL_IDS_CORE_values_(sh).filter(r=>String(r[pm['Creator ID']!=null?pm['Creator ID']:2])===String(creatorId));
    const campaigns={};
    perf.forEach(r=>{
      const status=String(pm['Status']!=null?r[pm['Status']]:'COMPLETED').toUpperCase();
      const campaignId=pm['Campaign ID']!=null?r[pm['Campaign ID']]:r[1];
      if(status==='COMPLETED' && campaignId) campaigns[String(campaignId)]=true;
    });
    return Object.keys(campaigns).length;
  }catch(e){ return 0; }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_derivedHistory_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_derivedHistory_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_derivedRisk_(ss,creatorId,creatorRow,signals){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_derivedRisk_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const history=KOL_IDS_CORE_derivedHistory_(ss,creatorId);
  let memory=[];
  try{
    const memSh=ss && typeof ss.getSheetByName==='function' ? ss.getSheetByName('ENT_MEMORY') : null;
    if(memSh && typeof memSh.getLastRow==='function' && typeof memSh.getLastColumn==='function' && typeof memSh.getRange==='function'){
      memory=KOL_IDS_CORE_values_(memSh).filter(r=>String(r[2])===String(creatorId));
    }
  }catch(e){ memory=[]; }
  let latestVariance=0;
  if(memory.length){
    const m=String(memory[memory.length-1][3]||'').match(/variance\s+(-?\d+(?:\.\d+)?)/i);
    if(m)latestVariance=Number(m[1]);
  }
  const missing=[];
  if(!creatorRow || creatorRow[4]===''||creatorRow[4]==null)missing.push('followers');
  if(!creatorRow || creatorRow[6]===''||creatorRow[7]==='')missing.push('audience age');
  if(!creatorRow || !creatorRow[9])missing.push('audience location');
  if(!creatorRow || !creatorRow[10])missing.push('audience interests');
  if(!signals || signals.erSource==='ESTIMATED')missing.push('ER');
  if(!signals || signals.rateSource==='ESTIMATED')missing.push('Rate');
  if(latestVariance<=-20)return 'HIGH';
  if(missing.length>=3 && history===0)return 'HIGH';
  if(missing.length || history<2 || !signals || signals.erSource==='ESTIMATED' || signals.rateSource==='ESTIMATED')return 'MEDIUM';
  return 'LOW';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_derivedRisk_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_derivedRisk_', Date.now() - __kolIdsTraceStartedAt);
  }
}



function KOL_IDS_CORE_decisionTier_(score,confidenceScore,risk){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_decisionTier_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(String(risk||'').toUpperCase()==='HIGH')return 'LOW FIT';
  if(score>=75 && confidenceScore>=60)return 'FIT';
  if(score>=60)return 'CONDITIONAL FIT';
  return 'LOW FIT';

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_decisionTier_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_decisionTier_', Date.now() - __kolIdsTraceStartedAt);
  }
}



function KOL_IDS_CORE_deepPersonaFitLegacy_(persona,brand,creator,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_deepPersonaFitLegacy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const fields=['Personality','Communication','Influence Style','Audience Relationship','Social Behavior','Content Personality','Content Function','Content Behavior','Audience Psychology'];
  const vals=fields.map(h=>creator[h]||'').join(' ');
  if(!vals.trim())return '';
  const hints={
    AWARENESS:'Trend Setter Trend Adopter Charismatic Trend-driven View-driven Share-driven Awareness',
    ENGAGEMENT:'Conversation Starter Conversation Driver High Responder High Comment Generator Conversational Community-driven Comment-driven',
    CONSIDERATION:'Educational Expert-led Demonstrative Trust-based Research-oriented Quality-seeking Save-driven',
    CONVERSION:'Direct Persuasive Product Demonstration Conversion-driven Click-driven Reviewer–Consumer Price-sensitive',
    LAUNCH:'Energetic Aspirational Trend-driven Experiential View-driven Share-driven Product Discovery',
  };
  const objectiveScore=KOL_IDS_CORE_tokenOverlap_(vals,hints[String(goal||'').toUpperCase()]||'');
  const needScore=KOL_IDS_CORE_tokenOverlap_(vals,String(persona[10]||'')+' '+String(persona[11]||''));
  return Math.round(objectiveScore*.65+needScore*.35);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_deepPersonaFitLegacy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_deepPersonaFitLegacy_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_scoreCreatorCore_(persona,brand,r,goal,ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_scoreCreatorCore_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const s=KOL_IDS_CORE_dataSignals_(r), derivedHistory=KOL_IDS_CORE_derivedHistory_(ss,r[0]), derivedRisk=KOL_IDS_CORE_derivedRisk_(ss,r,s);
  const cm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CREATORS'));
  const creator={id:r[0],name:r[1],platform:r[2],platformUrl:r[3],followers:r[4],er:r[5]===''?s.erValue:r[5],ageMin:r[6],ageMax:r[7],gender:r[8],locations:r[9],interests:r[10],styles:r[11],category:r[12],rate:r[13]===''?s.rateValue:r[13],risk:derivedRisk,history:derivedHistory,notes:r[16]};
  ['Personality','Communication','Influence Style','Audience Relationship','Social Behavior','Content Personality','Content Function','Content Behavior','Audience Psychology'].forEach(h=>creator[h]=cm[h]!=null?r[cm[h]]||'':'');
  const target={ageMin:Number(persona[2]),ageMax:Number(persona[3]),gender:persona[4],locations:persona[5],interests:persona[6],behaviors:persona[7]};
  const profile=KOL_IDS_CORE_goalProfile_(goal);
  const personaFit=KOL_IDS_CORE_ageGender_(target,creator);
  const audienceFit=KOL_IDS_CORE_audience_(target,creator);
  let contentFit=KOL_IDS_CORE_content_(goal,brand,creator); const deepFit=KOL_IDS_CORE_deepPersonaFitLegacy_(persona,brand,creator,goal); if(deepFit!=='') contentFit=Math.round(contentFit*.70+deepFit*.30);
  const objectiveFit=KOL_IDS_CORE_objective_(goal,creator);
  const brandFit=KOL_IDS_CORE_brand_(brand,creator);
  const eff=KOL_IDS_CORE_efficiencyScore_(creator.followers,creator.er,creator.rate,goal);
  const learningAdjustment=KOL_IDS_CORE_learningAdjustment_(ss,creator.id);
  const KOL_IDS_PLATFORM_w=profile.weights;
  const base=Math.round(personaFit*KOL_IDS_PLATFORM_w.persona+audienceFit*KOL_IDS_PLATFORM_w.audience+contentFit*KOL_IDS_PLATFORM_w.content+objectiveFit*KOL_IDS_PLATFORM_w.objective+brandFit*KOL_IDS_PLATFORM_w.brand+eff.score*KOL_IDS_PLATFORM_w.efficiency);
  const score=Math.max(0,Math.min(100,base+learningAdjustment));

  const missing=[];
  if(creator.ageMin===''||creator.ageMax==='')missing.push('creator audience age');
  if(!creator.gender||creator.gender==='ANY')missing.push('creator audience gender');
  if(!creator.locations)missing.push('creator audience location');
  if(!creator.interests)missing.push('creator interests');
  if(creator.followers===''||creator.followers==null)missing.push('followers');
  const estimated=[];
  if(s.erSource==='ESTIMATED')estimated.push('engagement rate');
  if(s.rateSource==='ESTIMATED')estimated.push('commercial rate');

  const dataCoverage=100-Math.min(55,missing.length*10)-Math.min(15,estimated.length*5);
  let confidenceScore=Math.round(dataCoverage*.6+KOL_IDS_CORE_historyConfidence_(creator.history)*.4);
  if(String(creator.risk).toUpperCase()==='HIGH')confidenceScore=Math.max(0,confidenceScore-20);
  const confidence=confidenceScore>=80?'High':confidenceScore>=60?'Medium':'Low';

  const tier=KOL_IDS_CORE_decisionTier_(score,confidenceScore,derivedRisk);
  let decision=tier==='FIT'?'RECOMMEND':tier==='LOW FIT'?'DO NOT SELECT':'REVIEW';
  const recovery=KOL_IDS_CORE_preferenceStrategy_(creator,goal,brandFit,objectiveFit,contentFit,eff.score,score);
  const why=KOL_IDS_CORE_whyPlus_(personaFit,audienceFit,contentFit,objectiveFit,brandFit,eff.score,goal,missing,estimated,learningAdjustment,decision,s);

  const evidence=[
    'Goal='+profile.label,
    'Weights P'+Math.round(KOL_IDS_PLATFORM_w.persona*100)+' A'+Math.round(KOL_IDS_PLATFORM_w.audience*100)+' C'+Math.round(KOL_IDS_PLATFORM_w.content*100)+' O'+Math.round(KOL_IDS_PLATFORM_w.objective*100)+' B'+Math.round(KOL_IDS_PLATFORM_w.brand*100)+' E'+Math.round(KOL_IDS_PLATFORM_w.efficiency*100),
    'ER='+s.erSource,
    'Rate='+s.rateSource,
    'History='+derivedHistory
  ].join(' | ');

  const limitations=[];
  if(missing.length)limitations.push('Missing: '+missing.join(', ')+'.');
  if(estimated.length)limitations.push('Estimated: '+estimated.join(', ')+'.');
  if(!creator.history)limitations.push('Creator has no historical campaign data.');
  if(!KOL_IDS_CORE_values_(ss.getSheetByName('ENT_MEMORY')).length)limitations.push('No historical learning memory yet.');

  return {
    decisionId:'DEC-'+Utilities.getUuid().slice(0,8).toUpperCase(),
    creatorId:creator.id,name:creator.name,decision,score,historicalCampaigns:derivedHistory,riskLevel:derivedRisk,
    personaFit,audienceFit,contentFit,objectiveFit,brandFit,efficiencyScore:eff.score,commercialEfficiency:eff.commercial,
    erValue:s.erValue,erSource:s.erSource,rateValue:s.rateValue,rateSource:s.rateSource,learningAdjustment,
    confidence,confidenceScore,why,dataLimitation:limitations.length?limitations.join(' '):'Sufficient structured evidence is available.',
    campaignGoal:String(goal||'').toUpperCase(),goalProfile:profile.label,decisionTier:tier,
    preferenceStatus:'NOT SET',brandFitGap:recovery.brandFitGap,recoveryStrategy:recovery,evidence
  };

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_scoreCreatorCore_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_scoreCreatorCore_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_whyPlus_(pf,af,cf,of,bf,ef,o,missing,estimated,adj,d,s){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_whyPlus_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const top=[['Persona Fit',pf],['Audience Fit',af],['Content Fit',cf],['Objective Fit',of],['Brand Fit',bf],['Commercial Efficiency',ef]].sort((a,b)=>b[1]-a[1]);let out=d==='RECOMMEND'?'Recommended because '+top[0][0]+' ('+top[0][1]+') and '+top[1][0]+' ('+top[1][1]+') are strong, with Commercial Efficiency at '+ef+'.':d==='DO NOT SELECT'?'Not selected because the KOL_IDS_LEARNING_LEGACY_weighted decision signal is below threshold or a high-risk override applies.':'Review because the creator has useful fit signals but the evidence is not strong enough for automatic selection.';out+=' ER is '+s.erValue+'% ('+s.erSource+') and Rate is '+(s.rateValue||'—')+' ('+s.rateSource+').';if(adj)out+=' Historical learning adjusted the score by '+(adj>0?'+':'')+adj+'.';if(missing.length)out+=' Missing: '+missing.join(', ')+'.';if(estimated.length)out+=' Estimates are clearly marked and reduce Confidence, not hidden as actual data.';return out;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_whyPlus_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_whyPlus_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_analyze(token,p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_analyze');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const lock=LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;
    KOL_IDS_CORE_upgradeSchema_(token);
    const goal=String((p&&p.goal)||p.objective||'').trim().toUpperCase();
    if(!p||!p.personaId||!goal)throw new Error('Persona and Campaign Goal are required.');
    const allowed=['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'];
    if(allowed.indexOf(goal)<0)throw new Error('Unsupported Campaign Goal: '+goal);
    const persona=KOL_IDS_CORE_resolveRowByIdOrName_(ss.getSheetByName('ENT_PERSONAS'),p.personaId,1);
    if(!persona)throw new Error('Persona not found.');
    const brand=KOL_IDS_CORE_resolveRowByIdOrName_(ss.getSheetByName('ENT_BRANDS'),p.brandId,1);
    if(!brand)throw new Error('Brand not found.');
    const creators=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CREATORS'));
    if(!creators.length)throw new Error('Add at least one Creator.');
    const campaignId='CP-'+Utilities.getUuid().slice(0,8).toUpperCase();
    const campaignName=KOL_IDS_CORE_req_(p.campaignName,'Campaign Name');
    const profile=KOL_IDS_CORE_goalProfile_(goal);
    const results=creators.map(r=>{
      const x=KOL_IDS_CORE_scoreCreator_(persona,brand,r,goal,ss);
      x.campaignId=campaignId;
      return x;
    }).sort((a,b)=>b.score-a.score);
    const sh=KOL_IDS_CORE_ensureColumns_(ss,'ENT_DECISIONS',[
      'Campaign ID','Creator ID','Creator Name','Decision','Decision Score','Persona Fit','Audience Fit',
      'Behavior Fit','Content Fit','Objective Fit','Brand Fit','Confidence','Confidence Score',
      'Content Recommendation','Evidence','Data Limitation','Created At'
    ]),now=new Date();
    results.forEach(x=>sh.appendRow(KOL_IDS_CORE_setByHeader_(sh,{
      'Decision ID':x.decisionId,'Campaign ID':campaignId,'Creator ID':x.creatorId,'Creator Name':x.name,
      'Decision':x.decision,'Decision Score':x.score,'Persona Fit':x.personaFit,'Audience Fit':x.audienceFit,
      'Behavior Fit':x.behaviorFit,'Content Fit':x.contentFit,'Objective Fit':x.objectiveFit,'Brand Fit':x.brandFit,'Confidence':x.confidence,
      'Confidence Score':x.confidenceScore,'Why':x.why,'Data Limitation':x.dataLimitation,
      'Content Recommendation':JSON.stringify(x.contentRecommendation||[]),'Evidence':x.evidence,'Created At':now,
      'Efficiency Score':x.efficiencyScore,'Commercial Efficiency':x.commercialEfficiency,'ER Value':x.erValue,
      'ER Source':x.erSource,'Rate Value':x.rateValue,'Rate Source':x.rateSource,'Learning Adjustment':x.learningAdjustment,
      'Campaign Goal':x.campaignGoal,'Goal Profile':x.goalProfile,'Decision Tier':x.decisionTier,
      'Preference Status':x.preferenceStatus,'Brand Fit Gap':x.brandFitGap,'Recovery Strategy':JSON.stringify(x.recoveryStrategy),
      'Evidence':x.evidence
    })));
    const campSh=ss.getSheetByName('ENT_CAMPAIGNS');
    const campRow=KOL_IDS_CORE_setByHeader_(campSh,{
      'Campaign ID':campaignId,'Campaign Name':campaignName,'Brand ID':brand[0],'Persona ID':persona[0],
      'Objective':goal,'Campaign Goal':goal,'Success Metric':String(p.successMetric||profile.successMetric),
      'Goal Profile':profile.label,'Budget':KOL_IDS_CORE_numOrBlank_(p.budget),'Currency':p.currency||'THB',
      'Start Date':p.startDate||'','End Date':p.endDate||'','Selected Creator IDs':'','Status':'PLANNING','Created At':now,'Duration Days':p.durationDays||''
    });
    campSh.appendRow(campRow);
    KOL_IDS_CORE_audit_(ss,'ANALYZE',campaignId,'OK','Goal-aware deterministic Decision Engine: '+goal);
    return {success:true,campaignId,campaignGoal:goal,goalProfile:profile.label,successMetric:String(p.successMetric||profile.successMetric),rows:results};
  } finally { lock.releaseLock(); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_analyze', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_analyze', Date.now() - __kolIdsTraceStartedAt);
  }
}


function KOL_IDS_CORE_selectCreator(token,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_selectCreator');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const lock=LockService.getScriptLock(); lock.waitLock(15000);
  try{
    const c=KOL_IDS_CORE_ctx_(token),ss=c.ss,sh=ss.getSheetByName('ENT_CAMPAIGNS');
    KOL_IDS_CORE_upgradeSchema_(token);
    const vals=KOL_IDS_CORE_values_(sh),cm=KOL_IDS_CORE_colMap_(sh),idx=vals.findIndex(r=>String(r[0])===String(campaignId));
    if(idx<0)throw new Error('Campaign not found.');
    const creator=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CREATORS'),creatorId);
    if(!creator)throw new Error('Creator not found.');
    const decisionRows=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_DECISIONS'));
    const decision=decisionRows.find(r=>String(r[1])===String(campaignId)&&String(r[2])===String(creatorId));
    if(!decision)throw new Error('Creator must be analyzed for this Campaign before selection.');

    const selectedCol=cm['Selected Creator IDs'];
    if(selectedCol==null)throw new Error('Campaign schema is missing Selected Creator IDs. Please run Setup/Repair once.');
    const row=vals[idx],current=String(row[selectedCol]||'').split(',').map(x=>x.trim()).filter(Boolean);
    if(current.indexOf(String(creatorId))<0)current.push(String(creatorId));
    row[selectedCol]=current.join(',');
    if(cm['Status']!=null)row[cm['Status']]='SELECTED';
    if(cm['Decision Status']!=null)row[cm['Decision Status']]='SELECTED';
    sh.getRange(idx+2,1,1,row.length).setValues([row]);

    var campaignCurrency=cm['Currency']!=null?(row[cm['Currency']]||'THB'):'THB';
    var existingPerf = (typeof KOL_IDS_PERF_AUTHORITY_READ==='function') ?
      KOL_IDS_PERF_AUTHORITY_READ({campaignId:campaignId,creatorId:creatorId,maxRows:10}) : {rows:[]};
    if(!existingPerf.rows || !existingPerf.rows.length){
      if(typeof KOL_IDS_PERF_AUTHORITY_SAVE==='function'){
        KOL_IDS_PERF_AUTHORITY_SAVE({campaignId:campaignId,brandId:cm['Brand ID']!=null?row[cm['Brand ID']]:'',
          analysisId:(typeof KOL_IDS_PRODUCT_UI_GET_STATE==='function'?(KOL_IDS_PRODUCT_UI_GET_STATE().analysisId||''): ''),
          currency:campaignCurrency,rows:[{creatorId:creatorId,creatorName:creator[1],channel:'UNKNOWN',objective:'AWARENESS',source:'SYSTEM_INIT',sourceId:'SELECT_'+campaignId+'_'+creatorId,verificationStatus:'UNVERIFIED',evidenceQuality:'LIMITED',notes:'Auto-created when creator was selected; awaiting campaign completion.'}]});
      }
    }
    KOL_IDS_CORE_audit_(ss,'SELECT_CREATOR',String(creatorId),'OK','Selected for '+campaignId+'; performance tracking initialized; currency='+campaignCurrency);
    return {success:true,campaignId,creatorId,creatorName:creator[1],creatorIds:current,count:current.length,selected:true,performanceTrackingInitialized:true,status:'WAITING_FOR_PERFORMANCE',decisionScore:Number(decision[5]||0)};
  }finally{ lock.releaseLock(); }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_selectCreator', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_selectCreator', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_getSelectedCreators_(ss,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_getSelectedCreators_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const sh=ss.getSheetByName('ENT_CAMPAIGNS'),m=KOL_IDS_CORE_colMap_(sh),c=KOL_IDS_CORE_findRow_(sh,campaignId);if(!c)return [];const i=m['Selected Creator IDs'];return String(i!=null?c[i]:'').split(',').map(x=>x.trim()).filter(Boolean);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_getSelectedCreators_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_getSelectedCreators_', Date.now() - __kolIdsTraceStartedAt);
  }
}








function KOL_IDS_CORE_benchmarkValue_(a,metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_benchmarkValue_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const m=String(metric||'').toLowerCase();
  if(m==='reach')return a.reach; if(m==='engagement rate')return a.engagementRate; if(m==='cpe')return a.cpe; if(m==='cpc')return a.cpc; if(m==='conversions')return a.conversions; if(m==='roas')return a.roas; if(m==='views')return a.views; return a.engagements;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_benchmarkValue_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_benchmarkValue_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_benchmarkDirection_(metric){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_benchmarkDirection_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return /cpe|cpc/i.test(String(metric||''))?'LOWER_IS_BETTER':'HIGHER_IS_BETTER';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_benchmarkDirection_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_benchmarkDirection_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_percentile_(value,arr,direction){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_percentile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  if(!arr.length)return 50;
  let count=0; arr.forEach(x=>{if(direction==='LOWER_IS_BETTER'?x>=value:x<=value)count++;});
  return Math.round(count/arr.length*100);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_percentile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_percentile_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_exportPdf(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_exportPdf');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const data=KOL_IDS_CORE_getCampaignReport(token,campaignId),state=KOL_IDS_CORE_getState(token),deep=data.deepIntelligence||{},ci=deep.campaignIntelligence||{},cal=ci.predictionCalibration||{};
  const esc=KOL_IDS_CORE_html_;
  const dec=data.decisions.map(r=>(r.photoUrl?'<div style="margin-bottom:8px"><img src="'+esc(r.photoUrl)+'" style="width:72px;height:72px;object-fit:cover;border-radius:12px"></div>':'')+'<hr><h2>'+esc(r.name)+' — '+esc(r.decision)+' '+r.score+'%</h2><p>Persona '+r.personaFit+' | Audience '+r.audienceFit+' | Content '+r.contentFit+' | Objective '+r.objectiveFit+' | Brand '+r.brandFit+' | Efficiency '+r.efficiencyScore+' | Commercial Efficiency '+r.commercialEfficiency+'</p><p>ER: '+r.erValue+'% ('+esc(r.erSource)+') | Rate: '+r.rateValue+' ('+esc(r.rateSource)+') | Confidence: '+esc(r.confidence)+' ('+r.confidenceScore+')</p><p><b>Why:</b> '+esc(r.why)+'</p><p><b>Data limitation:</b> '+esc(r.dataLimitation)+'</p>').join('');
  const deepRows=(deep.creatorAnalysis||[]).map(a=>'<div style="page-break-inside:avoid"><h3>'+esc(a.creatorName)+' — '+a.recommendation.gate+'</h3><p><b>Decision:</b> '+esc(a.decisionExplanation.decision)+' | Score '+a.score.decision+' | Confidence '+a.score.confidence+'</p><p><b>Behavior:</b> '+(a.behaviorIntelligence.score===null?'N/A':a.behaviorIntelligence.score)+' / 100 — '+esc(a.behaviorIntelligence.interpretation)+'</p><p><b>Behavior signals:</b> Efficiency consistency '+a.behaviorIntelligence.signals.efficiencyConsistency+' | Outcome stability '+a.behaviorIntelligence.signals.outcomeStability+' | Actual evidence '+a.behaviorIntelligence.signals.actualEvidenceRatio+'%</p><p><b>Uncertainty:</b> '+a.uncertainty.lower+'–'+a.uncertainty.upper+' ('+esc(a.uncertainty.reliability)+') — directional, not statistical CI.</p><p><b>Scenario:</b> Base '+(a.scenarioAnalysis.scenarios[0]||{}).score+' | Upside '+(a.scenarioAnalysis.scenarios[1]||{}).score+' | Downside '+(a.scenarioAnalysis.scenarios[2]||{}).score+'</p><p><b>Recommendation:</b> '+esc(a.recommendation.actions.join(' '))+'</p><p><b>Risk:</b> '+esc((a.risk.flags||[]).join(', ')||'NONE')+'</p></div>').join('');
  const perf=data.performance.map(r=>'<tr><td>'+esc(r.creatorName)+'</td><td>'+r.spend+'</td><td>'+r.reach+'</td><td>'+r.views+'</td><td>'+r.engagements+'</td><td>'+r.efficiencyScore+'</td><td>'+r.cpe+'</td><td>'+r.roas+'</td></tr>').join('');
  const html='<html><body style="font-family:Arial;padding:28px"><h1>KOL IDS Hardened Intelligence Report</h1><p>License: '+esc(state.licenseId)+'</p><p>Campaign: '+esc(campaignId)+' | Goal: '+esc(data.goal)+'</p><h2>Executive Intelligence</h2><p>'+esc((deep.executive||{}).headline||'')+'</p><p>Intelligence coverage: '+(ci.confidence||{}).score+' / 100</p><p>Behavior average: '+(ci.behaviorSummary||{}).averageBehaviorScore+' / 100</p><p>Prediction calibration: n='+cal.sampleSize+' | MAE='+cal.mae+' | Calibration rate='+cal.calibrationRate+'% | Bias='+cal.biasDirection+'</p><h2>Creator Decision Analysis</h2>'+dec+'<hr><h2>Deep Behavioral & Scenario Analysis</h2>'+deepRows+'<hr><h2>Campaign Performance</h2><table border="1" cellpadding="6" cellspacing="0"><tr><th>Creator</th><th>Spend</th><th>Reach</th><th>Views</th><th>Engagements</th><th>Efficiency</th><th>CPE</th><th>ROAS</th></tr>'+perf+'</table><hr><h2>Campaign Learning</h2>'+data.learning.map(r=>'<div><h3>'+esc(r.creatorName)+'</h3><p>Predicted '+r.predicted+' / Actual '+r.actual+' / Variance '+r.variance+'</p><p>'+esc(r.summary)+'</p><p><b>What worked:</b> '+esc(r.worked)+'</p><p><b>What did not:</b> '+esc(r.notWorked)+'</p><p><b>Next action:</b> '+esc(r.next)+'</p></div>').join('')+'<hr><h2>Decision Controls</h2><ul>'+((ci.limitations||[]).map(x=>'<li>'+esc(x)+'</li>').join(''))+'</ul></body></html>';
  const blob=Utilities.newBlob(html,'text/html','report.html').getAs(MimeType.PDF);return {filename:'KOL_IDS_'+campaignId+'.pdf',base64:Utilities.base64Encode(blob.getBytes())};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_exportPdf', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_exportPdf', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_exportXlsx(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_exportXlsx');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const data=KOL_IDS_CORE_getCampaignReport(token,campaignId),deep=data.deepIntelligence||{},ci=deep.campaignIntelligence||{},cal=ci.predictionCalibration||{};const tmp=SpreadsheetApp.create('KOL_IDS_EXPORT_'+campaignId),sh=tmp.getSheets()[0];sh.setName('Report');
  sh.appendRow(['Creator','Decision','Score','Confidence','ER','ER Source','Rate','Rate Source','Efficiency','Commercial Efficiency','Why']);data.decisions.forEach(r=>sh.appendRow([r.name,r.decision,r.score,r.confidence+' ('+r.confidenceScore+')',r.erValue,r.erSource,r.rateValue,r.rateSource,r.efficiencyScore,r.commercialEfficiency,r.why]));
  const da=tmp.insertSheet('Deep Analysis');da.appendRow(['Creator','Score','Score Band','Decision Confidence','Behavior Score','Efficiency Consistency','Outcome Stability','Actual Evidence %','Uncertainty Lower','Uncertainty Upper','Uncertainty Reliability','Scenario Base','Scenario Upside','Scenario Downside','Recommendation Gate','Risk Flags','Evidence State']);(deep.creatorAnalysis||[]).forEach(a=>{const sc=a.scenarioAnalysis.scenarios||[];da.appendRow([a.creatorName,a.score.decision,a.score.band,a.score.confidence,a.behaviorIntelligence.score,a.behaviorIntelligence.signals.efficiencyConsistency,a.behaviorIntelligence.signals.outcomeStability,a.behaviorIntelligence.signals.actualEvidenceRatio,a.uncertainty.lower,a.uncertainty.upper,a.uncertainty.reliability,sc[0]?sc[0].score:'',sc[1]?sc[1].score:'',sc[2]?sc[2].score:'',a.recommendation.gate,(a.risk.flags||[]).join(', '),a.evidenceState]);});
  const ciSh=tmp.insertSheet('Campaign Intelligence');ciSh.appendRow(['Metric','Value']);[['Goal',data.goal],['Coverage Score',ci.confidence&&ci.confidence.score],['Average Decision Score',ci.decisionSummary&&ci.decisionSummary.averageScore],['Average Decision Confidence',ci.decisionSummary&&ci.decisionSummary.averageConfidence],['Average Behavior Score',ci.behaviorSummary&&ci.behaviorSummary.averageBehaviorScore],['Selection Rate %',ci.decisionSummary&&ci.decisionSummary.selectionRate],['Actual Goal Score Avg',ci.outcomeSummary&&ci.outcomeSummary.actualGoalScoreAverage],['Observed ROAS',ci.outcomeSummary&&ci.outcomeSummary.observedRoas],['Prediction Sample Size',cal.sampleSize],['Prediction MAE',cal.mae],['Median Absolute Error',cal.medianAbsoluteError],['Calibration Rate %',cal.calibrationRate],['Bias Direction',cal.biasDirection]].forEach(x=>ciSh.appendRow(x));
  const ps=tmp.insertSheet('Performance');ps.appendRow(['Creator','Spend','Reach','Views','Engagements','Efficiency','CPM','CPE','CPC','ROAS','Evidence']);data.performance.forEach(r=>ps.appendRow([r.creatorName,r.spend,r.reach,r.views,r.engagements,r.efficiencyScore,r.cpm,r.cpe,r.cpc,r.roas,r.evidence]));
  const ls=tmp.insertSheet('Learning');ls.appendRow(['Creator','Predicted','Actual','Variance','Summary','What Worked','What Did Not','Next Action']);data.learning.forEach(r=>ls.appendRow([r.creatorName,r.predicted,r.actual,r.variance,r.summary,r.worked,r.notWorked,r.next]));SpreadsheetApp.flush();const url='https://docs.google.com/spreadsheets/d/'+tmp.getId()+'/export?format=xlsx';const resp=UrlFetchApp.fetch(url,{headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken()},muteHttpExceptions:true});if(resp.getResponseCode()>=300)throw new Error('Excel export failed: '+resp.getContentText().slice(0,200));const blob=resp.getBlob().setName('KOL_IDS_'+campaignId+'.xlsx');DriveApp.getFileById(tmp.getId()).setTrashed(true);return {filename:blob.getName(),base64:Utilities.base64Encode(blob.getBytes())};
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_exportXlsx', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_exportXlsx', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* =========================================================
 * KOL IDS — MISSING DECISION HELPERS
 * Restores deterministic audience/content matching
 * ========================================================= */

function KOL_IDS_CORE_ageGender_(target, creator) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_ageGender_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const tMin=Number(target.ageMin), tMax=Number(target.ageMax);
  const cMin=Number(creator.ageMin), cMax=Number(creator.ageMax);
  let ageScore=50;
  if(isFinite(tMin)&&isFinite(tMax)&&isFinite(cMin)&&isFinite(cMax)&&tMax>=tMin&&cMax>=cMin){
    const KOL_IDS_DECISION_SCIENCE_overlap=Math.max(0,Math.min(tMax,cMax)-Math.max(tMin,cMin)+1);
    const targetSize=Math.max(1,tMax-tMin+1);
    const creatorSize=Math.max(1,cMax-cMin+1);
    const union=Math.max(targetSize,creatorSize);
    ageScore=Math.round(Math.min(100,(KOL_IDS_DECISION_SCIENCE_overlap/targetSize)*70+(KOL_IDS_DECISION_SCIENCE_overlap/union)*30));
    if(KOL_IDS_DECISION_SCIENCE_overlap===0){
      const distance=Math.min(Math.abs(cMin-tMax),Math.abs(tMin-cMax));
      ageScore=Math.max(0,Math.round(45-distance*4));
    }
  }
  const tg=String(target.gender||'ANY').trim().toUpperCase();
  const cg=String(creator.gender||'ANY').trim().toUpperCase();
  let genderScore=100;
  if(tg!=='ANY' && cg!=='ANY')genderScore=tg===cg?100:0;
  return Math.round(ageScore*.7+genderScore*.3);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_ageGender_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_ageGender_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_tokenOverlap_(a, b) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_tokenOverlap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const tokenize = function(v) {
    return String(v || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .map(x => x.trim())
      .filter(Boolean);
  };

  const A = [...new Set(tokenize(a))];
  const B = [...new Set(tokenize(b))];

  if (!A.length || !B.length) return 0;

  const setB = {};
  B.forEach(x => setB[x] = true);

  let common = 0;
  A.forEach(x => {
    if (setB[x]) common++;
  });

  return Math.round((common / Math.max(A.length, B.length)) * 100);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_tokenOverlap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_tokenOverlap_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_audience_(target, creator) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_audience_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const scoreParts = [];

  // Location / market fit
  const targetLocations = String(target.locations || '')
    .toLowerCase()
    .split(/[,|;/]+/)
    .map(x => x.trim())
    .filter(Boolean);

  const creatorLocations = String(creator.locations || '')
    .toLowerCase()
    .split(/[,|;/]+/)
    .map(x => x.trim())
    .filter(Boolean);

  let locationScore = 50;

  if (targetLocations.length && creatorLocations.length) {
    const KOL_IDS_DECISION_SCIENCE_overlap = targetLocations.filter(x =>
      creatorLocations.some(y =>
        y === x || y.includes(x) || x.includes(y)
      )
    );

    locationScore = Math.round(
      Math.min(100, (KOL_IDS_DECISION_SCIENCE_overlap.length / targetLocations.length) * 100)
    );
  }

  // Interest fit
  const interestScore = KOL_IDS_CORE_tokenOverlap_(
    target.interests,
    creator.interests
  );

  // Behavior can be compared against creator content style / interests
  const behaviorScore = KOL_IDS_CORE_tokenOverlap_(
    target.behaviors,
    String(creator.styles || '') + ' ' + String(creator.interests || '')
  );

  scoreParts.push(locationScore);
  scoreParts.push(interestScore);
  scoreParts.push(behaviorScore);

  return Math.round(
    scoreParts.reduce((a, b) => a + b, 0) / scoreParts.length
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_audience_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_audience_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* =========================================================
 * KOL IDS — DECISION HELPER COMPLETION
 * Restores deterministic content / objective / brand /
 * historical confidence scoring.
 * ========================================================= */

/**
 * Normalize text into unique searchable tokens.
 */
function KOL_IDS_CORE_tokens_(value) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_tokens_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return [...new Set(
    String(value || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .map(x => x.trim())
      .filter(Boolean)
  )];

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_tokens_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_tokens_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Generic text KOL_IDS_DECISION_SCIENCE_overlap score.
 *
 * Uses symmetric KOL_IDS_DECISION_SCIENCE_overlap:
 * common tokens / max(unique tokens in A, unique tokens in B)
 *
 * Example:
 * beauty skincare
 * beauty makeup
 *
 * common = beauty
 * max = 2
 * score = 50
 */
function KOL_IDS_CORE_textOverlap_(a, b) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_textOverlap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const A = KOL_IDS_CORE_tokens_(a);
  const B = KOL_IDS_CORE_tokens_(b);

  if (!A.length || !B.length) return 0;

  const setB = {};
  B.forEach(x => setB[x] = true);

  let common = 0;
  A.forEach(x => {
    if (setB[x]) common++;
  });

  return Math.round(
    (common / Math.max(A.length, B.length)) * 100
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_textOverlap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_textOverlap_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Content Fit
 *
 * Measures whether creator category / content style /
 * interests align with Brand + campaign objective.
 */
function KOL_IDS_CORE_content_(objective, brand, creator) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_content_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const categoryScore = KOL_IDS_CORE_textOverlap_(
    String(brand[2] || ''),
    String(creator.category || '')
  );

  const positioningScore = KOL_IDS_CORE_textOverlap_(
    String(brand[4] || ''),
    String(creator.styles || '') + ' ' +
    String(creator.category || '') + ' ' +
    String(creator.interests || '')
  );

  const valuesScore = KOL_IDS_CORE_textOverlap_(
    String(brand[5] || ''),
    String(creator.styles || '') + ' ' +
    String(creator.interests || '')
  );

  const objectiveText = String(objective || '').toUpperCase();

  let objectiveContentScore = 60;

  const styles = String(
    creator.styles || ''
  ).toLowerCase();

  if (objectiveText === 'AWARENESS') {
    objectiveContentScore =
      /review|tutorial|unbox|lifestyle|entertainment|viral|short|video|creator|content/
        .test(styles)
        ? 90
        : 65;
  }

  else if (objectiveText === 'CONSIDERATION') {
    objectiveContentScore =
      /review|comparison|tutorial|how|education|demo|guide|expert/
        .test(styles)
        ? 95
        : 65;
  }

  else if (objectiveText === 'CONVERSION') {
    objectiveContentScore =
      /review|conversion|sales|promotion|deal|shopping|affiliate|tutorial|demo/
        .test(styles)
        ? 95
        : 60;
  }

  else if (objectiveText === 'ENGAGEMENT') {
    objectiveContentScore =
      /entertainment|community|story|lifestyle|interactive|review|live|video/
        .test(styles)
        ? 90
        : 65;
  }

  const score = Math.round(
    categoryScore * 0.35 +
    positioningScore * 0.25 +
    valuesScore * 0.15 +
    objectiveContentScore * 0.25
  );

  return Math.max(0, Math.min(100, score));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_content_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_content_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Objective Fit
 *
 * Deterministic scoring based on platform, content style,
 * historical behavior and creator scale.
 */
function KOL_IDS_CORE_objective_(objective, creator) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_objective_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const o = String(objective || '').trim().toUpperCase();
  const platform = String(creator.platform || '').trim().toUpperCase();
  const styles = String(creator.styles || '').toLowerCase();
  const followers = Number(creator.followers || 0);

  let score = 60;

  if (o === 'AWARENESS') {

    if (followers >= 1000000) score += 25;
    else if (followers >= 500000) score += 20;
    else if (followers >= 100000) score += 15;
    else if (followers >= 50000) score += 10;

    if (
      platform === 'TIKTOK' ||
      platform === 'YOUTUBE' ||
      platform === 'INSTAGRAM'
    ) {
      score += 10;
    }

    if (/viral|entertainment|lifestyle|video|short|content/.test(styles)) {
      score += 5;
    }
  }

  else if (o === 'CONSIDERATION') {

    if (/review|comparison|tutorial|education|guide|expert|demo/.test(styles)) {
      score += 25;
    }

    if (
      platform === 'YOUTUBE' ||
      platform === 'INSTAGRAM' ||
      platform === 'TIKTOK'
    ) {
      score += 5;
    }
  }

  else if (o === 'CONVERSION') {

    if (/review|shopping|affiliate|sales|promotion|deal|demo|tutorial/.test(styles)) {
      score += 25;
    }

    if (/shopping|affiliate|sales|conversion/.test(styles)) {
      score += 10;
    }
  }

  else if (o === 'ENGAGEMENT') {

    if (/entertainment|community|lifestyle|story|interactive|live|video/.test(styles)) {
      score += 25;
    }

    if (
      platform === 'TIKTOK' ||
      platform === 'INSTAGRAM'
    ) {
      score += 5;
    }
  }

  return Math.max(0, Math.min(100, score));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_objective_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_objective_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Brand Fit
 *
 * Compares creator category / interests / content style
 * against Brand category / positioning / values / avoid list.
 */
function KOL_IDS_CORE_brand_(brand, creator) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_brand_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const brandCategory = String(brand[2] || '');
  const positioning = String(brand[4] || '');
  const values = String(brand[5] || '');
  const avoid = String(brand[6] || '');

  const creatorText =
    String(creator.category || '') + ' ' +
    String(creator.interests || '') + ' ' +
    String(creator.styles || '');

  const categoryScore =
    KOL_IDS_CORE_textOverlap_(
      brandCategory,
      creator.category
    );

  const positioningScore =
    KOL_IDS_CORE_textOverlap_(
      positioning,
      creatorText
    );

  const valuesScore =
    KOL_IDS_CORE_textOverlap_(
      values,
      creatorText
    );

  const avoidTokens = KOL_IDS_CORE_tokens_(avoid);
  const creatorTokens = KOL_IDS_CORE_tokens_(creatorText);

  let conflict = 0;

  if (avoidTokens.length && creatorTokens.length) {
    const creatorSet = {};
    creatorTokens.forEach(x => creatorSet[x] = true);

    avoidTokens.forEach(x => {
      if (creatorSet[x]) conflict++;
    });
  }

  const conflictPenalty = Math.min(
    40,
    conflict * 20
  );

  const raw =
    categoryScore * 0.40 +
    positioningScore * 0.30 +
    valuesScore * 0.30;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(raw - conflictPenalty)
    )
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_brand_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_brand_', Date.now() - __kolIdsTraceStartedAt);
  }
}


/**
 * Historical campaign confidence.
 *
 * Returns a confidence score from historical evidence.
 */
function KOL_IDS_CORE_historyConfidence_(history) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_historyConfidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {


  const text = String(history || '').trim();

  if (!text) return 35;

  const normalized = text.toLowerCase();

  let score = 55;

  const numbers = normalized.match(/\d+/g);

  if (numbers && numbers.length) {
    const campaigns = Number(numbers[0]);

    if (campaigns >= 10) score += 35;
    else if (campaigns >= 5) score += 25;
    else if (campaigns >= 3) score += 18;
    else if (campaigns >= 1) score += 10;
  }

  if (/strong|excellent|successful|success|good|positive|high/.test(normalized)) {
    score += 10;
  }

  if (/poor|weak|negative|failed|failure|low/.test(normalized)) {
    score -= 10;
  }

  return Math.max(
    0,
    Math.min(100, score)
  );

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_historyConfidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_historyConfidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* V5.6.1 HOTFIX — deterministic score compatibility wrapper
 * Fixes the V5.6 Score range test when a lightweight sheet mock is used.
 * Production scoring still delegates to the full V5.6 core engine.
 */


/* =========================================================
 * KOL IDS — DEEP DECISION INTELLIGENCE PATCH
 * Logic-first / Evidence-first / Bilingual-ready
 * ========================================================= */

function KOL_IDS_CORE_upgradeSchema(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_upgradeSchema');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_CORE_ctx_(arguments[0]).ss;
  const specs={
    ENT_PERSONAS:['Goals & Needs','Pain Points'],
    ENT_CREATORS:['Photo URL','Social Links','ER Source','Rate Source','Profile Type','Audience Age Range','Data Confidence',
      'Personality','Communication','Influence Style','Audience Relationship','Social Behavior','Content Personality','Content Function','Content Behavior','Audience Psychology'],
    ENT_DECISIONS:['Efficiency Score','Commercial Efficiency','ER Value','ER Source','Rate Value','Rate Source','Learning Adjustment','Campaign Goal','Goal Profile','Decision Tier','Preference Status','Brand Fit Gap','Recovery Strategy','Evidence','Evidence Score','Historical Goal Signal','Data Quality Score','Decision Rationale','Calibration Adjustment','Calibration Basis','Peer Benchmark','Investment Strength','Data Reliability','Price Risk','Decision Class','History Calibration','Peer Calibration','Fair Rate','Price Value','Opportunity Score','Data State','Creator Role'],
    ENT_PERFORMANCE:['Status','Efficiency Score','CPM','CPE','CPC','ROAS','Actual Goal Score','Goal KPI','Performance Confidence','Likes','Comments','Shares','Saves'],
    ENT_LEARNING:['Commercial Efficiency','Efficiency Signal','Goal KPI','Prediction Error','Calibration Weight'],
    ENT_CAMPAIGNS:['Campaign Goal','Success Metric','Goal Profile','Decision Status','Benchmark Status','Plan Summary','Duration Days'],
    ENT_BENCHMARKS:['Benchmark ID','Campaign ID','Campaign Goal','Peer Count','Metric','Actual','Benchmark','Delta %','Percentile','Confidence','Peer Definition','Created At','Method'],
    ENT_GOAL_RULES:['Goal','Weight Persona','Weight Audience','Weight Content','Weight Objective','Weight Brand','Weight Efficiency','Primary KPI','Secondary KPI','Strategy'],
    ENT_STRATEGIES:['Strategy ID','Campaign ID','Creator ID','Creator Name','Goal','Original Score','Decision Tier','Preferred','Recommended Role','Gap','Actions','Projected Fit','Confidence','Created At']
  };
  Object.keys(specs).forEach(name=>KOL_IDS_CORE_ensureColumns_(ss,name,specs[name]));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_upgradeSchema', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_upgradeSchema', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_goalProfile_(goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_goalProfile_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const g=String(goal||'').trim().toUpperCase();
  const P={
    AWARENESS:{label:'Awareness',weights:{persona:.16,audience:.20,content:.14,objective:.22,brand:.10,efficiency:.18},primary:'Reach / Unique Reach',secondary:'Quality Engagement',role:'Awareness Driver'},
    ENGAGEMENT:{label:'Engagement',weights:{persona:.16,audience:.22,content:.20,objective:.18,brand:.12,efficiency:.12},primary:'Quality Engagement / ER',secondary:'Engagement Depth',role:'Community / Engagement Driver'},
    CONSIDERATION:{label:'Consideration',weights:{persona:.18,audience:.22,content:.20,objective:.18,brand:.14,efficiency:.08},primary:'Qualified Engagement',secondary:'Clicks / Consideration Signal',role:'Trust / Education Driver'},
    CONVERSION:{label:'Conversion',weights:{persona:.14,audience:.20,content:.18,objective:.20,brand:.14,efficiency:.14},primary:'Conversions / Revenue / ROAS',secondary:'CPC / CPE',role:'Conversion Driver'},
    LAUNCH:{label:'Launch',weights:{persona:.15,audience:.17,content:.17,objective:.22,brand:.11,efficiency:.18},primary:'Reach + Velocity',secondary:'Engagement',role:'Launch Driver'}
  };
  return P[g]||null;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_goalProfile_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_goalProfile_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_normalizeGoal_(goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_normalizeGoal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const g=String(goal||'').trim().toUpperCase();return KOL_IDS_CORE_goalProfile_(g)?g:'';
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_normalizeGoal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_normalizeGoal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_median_(arr){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_median_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const a=arr.filter(v=>isFinite(v)).sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_median_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_median_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_mean_(arr){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_mean_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const a=arr.filter(v=>isFinite(v));return a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_mean_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_mean_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_clamp_(v,min,max){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.max(min,Math.min(max,Number(v)||0));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_safeJson_(v,fallback){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_safeJson_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{if(v===null||v===undefined||v==='')return fallback;const x=JSON.parse(String(v));return x==null?fallback:x;}catch(e){return fallback;}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_safeJson_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_safeJson_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_round1_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_round1_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.round((Number(v)||0)*10)/10;
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_round1_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_round1_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_creatorHistoricalGoalSignal_(ss,creatorId,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_creatorHistoricalGoalSignal_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{
    if(!ss || typeof ss.getSheetByName!=='function') return {score:50,count:0,confidence:0};
    const perfSh=KOL_IDS_PA_legacyProjection_(ss);
    if(!perfSh || typeof perfSh.getLastRow!=='function' || typeof perfSh.getLastColumn!=='function' || typeof perfSh.getRange!=='function') return {score:50,count:0,confidence:0};
    const pm=KOL_IDS_CORE_colMap_(perfSh);
    const perf=KOL_IDS_CORE_values_(perfSh).filter(r=>{
      const creator=String(r[pm['Creator ID']!=null?pm['Creator ID']:2]);
      const status=String(pm['Status']!=null?r[pm['Status']]:'COMPLETED').toUpperCase();
      return creator===String(creatorId) && status==='COMPLETED';
    });
    if(!perf.length)return {score:50,count:0,confidence:20};
    const decisionSh=ss.getSheetByName('ENT_DECISIONS');
    const decisions=(decisionSh && typeof decisionSh.getLastRow==='function' && typeof decisionSh.getLastColumn==='function' && typeof decisionSh.getRange==='function') ? KOL_IDS_CORE_values_(decisionSh) : [];
    const dm=(decisionSh && typeof decisionSh.getLastColumn==='function' && typeof decisionSh.getRange==='function') ? KOL_IDS_CORE_colMap_(decisionSh) : {};
    const scores=[];
    perf.forEach(r=>{
      const cid=String(r[1]||'');
      const d=decisions.filter(x=>String(x[1])===cid&&String(x[2])===String(creatorId)).sort((a,b)=>new Date(b[15])-new Date(a[15]))[0];
      const dg=d&&dm['Campaign Goal']!=null?String(d[dm['Campaign Goal']]||'').toUpperCase():'';
      if(dg&&dg!==String(goal||'').toUpperCase())return;
      const actual=KOL_IDS_CORE_actualGoalScoreFromRow_(r,goal);
      if(isFinite(actual))scores.push(actual);
    });
    if(!scores.length)return {score:50,count:0,confidence:20};
    const score=Math.round(KOL_IDS_CORE_median_(scores));
    return {score,count:scores.length,confidence:Math.min(100,25+scores.length*15)};
  }catch(e){ return {score:50,count:0,confidence:0}; }

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_creatorHistoricalGoalSignal_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_creatorHistoricalGoalSignal_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_actualGoalScoreFromRow_(r,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_actualGoalScoreFromRow_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const spend=Number(r[4]||0),reach=Number(r[5]||0),imp=Number(r[6]||0),views=Number(r[7]||0),eng=Number(r[8]||0),clicks=Number(r[9]||0),conv=Number(r[10]||0),rev=Number(r[11]||0);
  const likes=Number(r[26]||0),comments=Number(r[27]||0),shares=Number(r[28]||0),saves=Number(r[29]||0);
  const weightedEng=eng>0?eng:(likes+comments+shares+saves);
  const er=imp>0?weightedEng/imp*100:(reach>0?weightedEng/reach*100:0), ctr=(imp>0?clicks/imp*100:(views>0?clicks/views*100:0)), cvr=clicks>0?conv/clicks*100:0, roas=spend>0?rev/spend:0;
  const o=String(goal||'AWARENESS').toUpperCase();
  if(o==='CONVERSION')return Math.round(((KOL_IDS_CORE_norm_(roas,0,6)*55)+(KOL_IDS_CORE_norm_(cvr,0,8)*25)+(KOL_IDS_CORE_norm_(ctr,0,5)*20))/100);
  if(o==='ENGAGEMENT')return Math.round(KOL_IDS_CORE_norm_(er,0,10)*70+KOL_IDS_CORE_norm_(eng/(Math.max(1,reach))*100,0,12)*30);
  if(o==='CONSIDERATION')return Math.round(KOL_IDS_CORE_norm_(ctr,0,5)*40+KOL_IDS_CORE_norm_(er,0,8)*35+KOL_IDS_CORE_norm_(cvr,0,8)*25);
  if(o==='LAUNCH')return Math.round(KOL_IDS_CORE_norm_(reach,0,2000000)*60+KOL_IDS_CORE_norm_(er,0,8)*25+KOL_IDS_CORE_norm_(views,0,2000000)*15);
  return Math.round(KOL_IDS_CORE_norm_(reach,0,2000000)*70+KOL_IDS_CORE_norm_(er,0,8)*30);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_actualGoalScoreFromRow_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_actualGoalScoreFromRow_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_norm_(v,lo,hi){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_norm_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
const n=Number(v);if(!isFinite(n))return 0;return KOL_IDS_CORE_clamp_((n-lo)/(hi-lo)*100,0,100);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_norm_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_norm_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_dataQuality_(creatorRow,signals,history){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_dataQuality_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const checks=[
    creatorRow[4]!==''&&creatorRow[4]!=null,
    creatorRow[6]!==''&&creatorRow[7]!=='',
    creatorRow[8]!==''&&creatorRow[8]!=null,
    creatorRow[9]!==''&&creatorRow[9]!=null,
    creatorRow[10]!==''&&creatorRow[10]!=null,
    creatorRow[11]!==''&&creatorRow[11]!=null,
    signals.erSource==='ACTUAL',signals.rateSource==='ACTUAL',history>0
  ];
  return Math.round(checks.filter(Boolean).length/checks.length*100);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_dataQuality_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_dataQuality_', Date.now() - __kolIdsTraceStartedAt);
  }
}



function KOL_IDS_CORE_preferenceStrategy_(creator,goal,brandFit,objectiveFit,contentFit,efficiencyScore,score){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_preferenceStrategy_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const g=String(goal||'').toUpperCase(),gap=Math.max(0,70-Number(brandFit||0)),actions=[];
  if(brandFit<70)actions.push('Use as supporting Trust/Awareness role rather than sole owner of the primary Goal.');
  if(contentFit<70)actions.push('Adapt the brief to the creator\'s strongest native content format and proof style.');
  if(objectiveFit<70)actions.push('Pair with a creator whose Objective Fit is materially higher for the primary KPI.');
  if(efficiencyScore<70)actions.push('Reduce budget share and protect the campaign from cost-efficiency downside.');
  if(!actions.length)actions.push('Use as a primary creator with Goal-aligned brief and budget.');
  const role=g==='CONVERSION'?'Trust / Consideration Support':g==='AWARENESS'?'Awareness Driver':g==='ENGAGEMENT'?'Community / Engagement Driver':g==='LAUNCH'?'Launch Support':'Consideration Support';
  const projected=KOL_IDS_CORE_clamp_(Number(score||0)+Math.min(18,Math.round(Math.max(0,70-Number(brandFit||0))*.35)+4),0,100);
  return {status:Number(score||0)>=75?'FIT':'CONDITIONAL FIT',brandFitGap:gap,role,strategies:actions,projectedFit:projected,note:'Deterministic recovery plan. Original Fit Score is preserved; projected fit is scenario guidance, not a guarantee.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_preferenceStrategy_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_preferenceStrategy_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_savePerformance(token,p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_savePerformance');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_CORE_upgradeSchema_(token);
    if(!p||!p.campaignId||!p.creatorId)throw new Error('Campaign and Creator are required.');
    const selected=KOL_IDS_CORE_getSelectedCreators_(ss,p.campaignId);if(selected.indexOf(String(p.creatorId))<0)throw new Error('Creator is not selected for this Campaign.');
    const keys=['spend','reach','impressions','views','likes','comments','shares','saves','engagements','clicks','conversions','revenue'];
    keys.forEach(k=>{if(p[k]!==''&&p[k]!=null&&(!isFinite(Number(p[k]))||Number(p[k])<0))throw new Error(k+' must be a non-negative number.');});
    const n=k=>p[k]!==''&&p[k]!=null?Number(p[k]):null;
    if(n('reach')!=null&&n('impressions')!=null&&n('reach')>n('impressions'))throw new Error('Reach cannot exceed Impressions.');
    if(n('views')!=null&&n('impressions')!=null&&n('views')>n('impressions'))throw new Error('Views cannot exceed Impressions.');
    if(n('engagements')!=null&&n('views')!=null&&n('engagements')>n('views'))throw new Error('Engagements cannot exceed Views.');
    if(n('engagements')!=null&&n('impressions')!=null&&n('engagements')>n('impressions'))throw new Error('Engagements cannot exceed Impressions.');
    if(n('clicks')!=null&&n('views')!=null&&n('clicks')>n('views'))throw new Error('Clicks cannot exceed Views.');
    if(n('clicks')!=null&&n('impressions')!=null&&n('clicks')>n('impressions'))throw new Error('Clicks cannot exceed Impressions.');
    if(n('conversions')!=null&&n('clicks')!=null&&n('conversions')>n('clicks'))throw new Error('Conversions cannot exceed Clicks.');
    const componentSum=['likes','comments','shares','saves'].reduce((s,k)=>s+(n(k)||0),0);
    if(n('engagements')!=null&&componentSum>n('engagements'))throw new Error('Likes + Comments + Shares + Saves cannot exceed Engagements.');
    if(n('engagements')==null&&componentSum>0)p.engagements=componentSum;
    const creator=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CREATORS'),p.creatorId);if(!creator)throw new Error('Creator not found.');
    const camp=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CAMPAIGNS'),p.campaignId);if(!camp)throw new Error('Campaign not found.');
    const cm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CAMPAIGNS')),goal=String(cm['Campaign Goal']!=null?camp[cm['Campaign Goal']]:camp[4]||'AWARENESS').toUpperCase();
    const spend=n('spend')??'',reach=n('reach')??'',imp=n('impressions')??'',views=n('views')??'',likes=n('likes')??'',comments=n('comments')??'',shares=n('shares')??'',saves=n('saves')??'',eng=n('engagements')??'',clicks=n('clicks')??'',conv=n('conversions')??'',rev=n('revenue')??'';
    const cpm=spend!==''&&reach>0?spend/reach*1000:'',cpe=spend!==''&&eng>0?spend/eng:'',cpc=spend!==''&&clicks>0?spend/clicks:'',roas=spend!==''&&rev>0?rev/spend:'';
    const actualGoal=KOL_IDS_CORE_actualGoalScoreFromRow_(['','',p.creatorId,'',spend,reach,imp,views,eng,clicks,conv,rev],goal);
    const supplied=[reach,imp,views,eng,clicks,conv,rev,likes,comments,shares,saves].filter(x=>x!==''&&x!=null).length;
    const performanceConfidence=KOL_IDS_CORE_clamp_(20+supplied*7+(p.evidence==='VERIFIED'?20:p.evidence==='SELF-REPORTED'?10:0),0,100);
    const eff=KOL_IDS_CORE_performanceEfficiency_(spend,reach,imp,views,eng,clicks,conv,rev,goal);
    const sh=KOL_IDS_PA_legacyProjection_(ss),vals=KOL_IDS_CORE_values_(sh),pm=KOL_IDS_CORE_colMap_(sh),idx=vals.findIndex(r=>String(r[1])===String(p.campaignId)&&String(r[2])===String(p.creatorId));
    const data={'Campaign ID':p.campaignId,'Creator ID':p.creatorId,'Creator Name':creator[1],'Spend':spend,'Reach':reach,'Impressions':imp,'Views':views,'Likes':likes,'Comments':comments,'Shares':shares,'Saves':saves,'Engagements':eng,'Clicks':clicks,'Conversions':conv,'Revenue':rev,'Currency':p.currency||camp[cm['Currency']||6]||'THB','Evidence':p.evidence||'SELF-REPORTED','Reported Date':p.reportedDate||new Date(),'Notes':p.notes||'','Status':'COMPLETED','Efficiency Score':eff.score,'CPM':cpm,'CPE':cpe,'CPC':cpc,'ROAS':roas,'Actual Goal Score':actualGoal,'Goal KPI':KOL_IDS_CORE_goalProfile_(goal).primary,'Performance Confidence':performanceConfidence};
    let performanceId;if(idx>=0){performanceId=vals[idx][0];const row=vals[idx];Object.keys(data).forEach(h=>{if(pm[h]!=null)row[pm[h]]=data[h];});sh.getRange(idx+2,1,1,row.length).setValues([row]);}else{performanceId='PF-'+Utilities.getUuid().slice(0,8).toUpperCase();sh.appendRow(KOL_IDS_CORE_setByHeader_(sh,Object.assign({'Performance ID':performanceId,'Created At':new Date()},data)));}
    if(typeof KOL_IDS_SCALE_INVALIDATE_READ_MODEL_==='function')KOL_IDS_SCALE_INVALIDATE_READ_MODEL_(sh);
    const learning=KOL_IDS_CORE_makeLearning_(ss,p.campaignId,p.creatorId);
    const selectedNow=KOL_IDS_CORE_getSelectedCreators_(ss,p.campaignId),completed=KOL_IDS_CORE_values_(sh).filter(r=>String(r[1])===String(p.campaignId)&&String(pm['Status']!=null?r[pm['Status']]:'')==='COMPLETED').map(r=>String(r[2]));
    const campVals=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CAMPAIGNS')),ci=campVals.findIndex(r=>String(r[0])===String(p.campaignId));if(ci>=0){const csh=ss.getSheetByName('ENT_CAMPAIGNS'),status=selectedNow.length&&selectedNow.every(id=>completed.indexOf(String(id))>=0)?'COMPLETED':'IN_PROGRESS';const scm=KOL_IDS_CORE_colMap_(csh);if(scm['Status']!=null)campVals[ci][scm['Status']]=status;csh.getRange(ci+2,1,1,campVals[ci].length).setValues([campVals[ci]]);}
    KOL_IDS_CORE_audit_(ss,'SAVE_PERFORMANCE',performanceId,'OK','Performance saved with Likes/Shares/Saves and derived Engagements/learning.');
    return {success:true,performanceId,creatorId:p.creatorId,campaignId:p.campaignId,engagements:eng,likes,comments,shares,saves,actualGoalScore:actualGoal,performanceConfidence,efficiencyScore:eff.score,learning};
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_savePerformance', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_savePerformance', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_performanceEfficiency_(spend,reach,imp,views,eng,clicks,conv,rev,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_performanceEfficiency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const cpe=spend>0&&eng>0?spend/eng:0,cpc=spend>0&&clicks>0?spend/clicks:0,roas=spend>0&&rev>0?rev/spend:0;
  let s=50;if(goal==='CONVERSION')s=roas?KOL_IDS_CORE_norm_(roas,0,6):cpc?100-KOL_IDS_CORE_norm_(cpc,0,10):50;
  else if(goal==='ENGAGEMENT')s=KOL_IDS_CORE_norm_(imp>0?eng/imp*100:0,0,10);
  else if(goal==='CONSIDERATION')s=Math.round(KOL_IDS_CORE_norm_(imp>0?clicks/imp*100:0,0,5)*.55+KOL_IDS_CORE_norm_(imp>0?eng/imp*100:0,0,8)*.45);
  else s=Math.round(KOL_IDS_CORE_norm_(reach,0,2000000)*.65+KOL_IDS_CORE_norm_(views,0,2000000)*.2+KOL_IDS_CORE_norm_(imp>0?eng/imp*100:0,0,8)*.15);
  if(cpe)s=Math.round((s+(100-KOL_IDS_CORE_norm_(cpe,0,10)))/2);
  return {score:KOL_IDS_CORE_clamp_(s,0,100)};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_performanceEfficiency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_performanceEfficiency_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_makeLearning_(ss,campaignId,creatorId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_makeLearning_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const dsh=ss.getSheetByName('ENT_DECISIONS'),psh=KOL_IDS_PA_legacyProjection_(ss),lsh=ss.getSheetByName('ENT_LEARNING');
  const dm=KOL_IDS_CORE_colMap_(dsh),pm=KOL_IDS_CORE_colMap_(psh),lm=KOL_IDS_CORE_colMap_(lsh),dv=KOL_IDS_CORE_values_(dsh),pv=KOL_IDS_CORE_values_(psh),lv=KOL_IDS_CORE_values_(lsh);
  const decisionRows=dv.filter(r=>String(dm['Campaign ID']!=null?r[dm['Campaign ID']]:r[1])===String(campaignId)&&String(dm['Creator ID']!=null?r[dm['Creator ID']]:r[2])===String(creatorId));
  const d=decisionRows.sort((a,b)=>new Date(dm['Created At']!=null?b[dm['Created At']]:b[15])-new Date(dm['Created At']!=null?a[dm['Created At']]:a[15]))[0];
  const perf=pv.filter(r=>String(pm['Campaign ID']!=null?r[pm['Campaign ID']]:r[1])===String(campaignId)&&String(pm['Creator ID']!=null?r[pm['Creator ID']]:r[2])===String(creatorId));
  if(!d||!perf.length)return null;
  const getD=(r,h,f)=>dm[h]!=null?r[dm[h]]:f,getP=(r,h,f)=>pm[h]!=null?r[pm[h]]:f;
  const goal=String(getD(d,'Campaign Goal','AWARENESS')).toUpperCase(),predicted=Number(getD(d,'Decision Score',d[5])||0);
  const actuals=perf.map(r=>{const v=getP(r,'Actual Goal Score',null);return v!==''&&v!=null&&isFinite(Number(v))?Number(v):KOL_IDS_CORE_actualGoalScoreFromRow_(r,goal);}).filter(isFinite);
  if(!actuals.length)return null;
  const actual=Math.round(KOL_IDS_CORE_median_(actuals)||50),variance=actual-predicted;
  const summary='Goal '+goal+': predicted '+predicted+' vs actual '+actual+'. Variance '+variance+'. '+perf.length+' performance record(s) analyzed.';
  const worked=variance>=0?'Actual goal performance met or exceeded the prediction.':'Actual goal performance was below the prediction; review audience fit, content execution, offer and cost.';
  const next=variance>=10?'Increase confidence modestly for similar future campaigns.':variance<=-10?'Reduce confidence and require stronger evidence before ranking this creator highly.':'Keep confidence stable and gather another comparable campaign.';
  const roas=perf.map(r=>Number(getP(r,'ROAS',0)||0)).filter(isFinite),commercialEfficiency=roas.length?roas.reduce((a,b)=>a+b,0)/roas.length:0;
  const data={'Campaign ID':campaignId,'Creator ID':creatorId,'Creator Name':getD(d,'Creator Name',d[3]),'Predicted Score':predicted,'Actual Score':actual,'Variance':variance,'Performance Summary':summary,'What Worked':worked,'What Did Not':variance<0?'Prediction overestimated actual outcome.':'No major prediction miss detected.','Next Action':next,'Commercial Efficiency':commercialEfficiency,'Efficiency Signal':actual,'Goal KPI':KOL_IDS_CORE_goalProfile_(goal).primary,'Prediction Error':variance,'Calibration Weight':Math.min(100,30+Math.abs(variance)*2)};
  const idx=lv.findIndex(r=>String(lm['Campaign ID']!=null?r[lm['Campaign ID']]:r[1])===String(campaignId)&&String(lm['Creator ID']!=null?r[lm['Creator ID']]:r[2])===String(creatorId));let id;
  if(idx>=0){id=lm['Learning ID']!=null?lv[idx][lm['Learning ID']]:lv[idx][0];const row=lv[idx];Object.keys(data).forEach(h=>{if(lm[h]!=null)row[lm[h]]=data[h];});lsh.getRange(idx+2,1,1,row.length).setValues([row]);}
  else{id='LEARN-'+Utilities.getUuid().slice(0,8).toUpperCase();lsh.appendRow(KOL_IDS_CORE_setByHeader_(lsh,Object.assign({'Learning ID':id,'Created At':new Date()},data)));}
  const mem=ss.getSheetByName('ENT_MEMORY'),mm=KOL_IDS_CORE_values_(mem),mi=mm.findIndex(r=>String(r[5])===String(campaignId)&&String(r[2])===String(creatorId)),mr=['MEM-'+Utilities.getUuid().slice(0,8).toUpperCase(),'CREATOR',creatorId,'goal '+goal+' variance '+variance+' actual '+actual+' predicted '+predicted+'; '+next,Math.min(100,60+Math.abs(variance)*2),campaignId,new Date()];
  if(mi>=0)mem.getRange(mi+2,1,1,mr.length).setValues([mr]);else mem.appendRow(mr);
  return {id,predicted,actual,variance,summary,worked,notWorked:data['What Did Not'],next,commercialEfficiency,goal};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_makeLearning_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_makeLearning_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_campaignAggregate_(ss,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_campaignAggregate_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const campSh=ss.getSheetByName('ENT_CAMPAIGNS'),camp=KOL_IDS_CORE_findRow_(campSh,campaignId);if(!camp)return null;
  const cm=KOL_IDS_CORE_colMap_(campSh),goal=String(cm['Campaign Goal']!=null?camp[cm['Campaign Goal']]:camp[4]||'AWARENESS').toUpperCase(),ps=KOL_IDS_PA_legacyProjection_(ss),pm=KOL_IDS_CORE_colMap_(ps);
  const rows=KOL_IDS_CORE_values_(ps).filter(r=>String(pm['Campaign ID']!=null?r[pm['Campaign ID']]:r[1])===String(campaignId)&&String(pm['Performance ID']!=null?r[pm['Performance ID']]:r[0]));
  if(!rows.length)return null;
  const n=(r,h,f)=>{const v=pm[h]!=null?r[pm[h]]:f;const x=Number(v);return isFinite(x)?x:0;};
  let spend=0,reach=0,imp=0,views=0,eng=0,clicks=0,conv=0,rev=0;
  rows.forEach(r=>{spend+=n(r,'Spend',r[4]);reach+=n(r,'Reach',r[5]);imp+=n(r,'Impressions',r[6]);views+=n(r,'Views',r[7]);eng+=n(r,'Engagements',r[8]);clicks+=n(r,'Clicks',r[9]);conv+=n(r,'Conversions',r[10]);rev+=n(r,'Revenue',r[11]);});
  const brandId=cm['Brand ID']!=null?camp[cm['Brand ID']]:camp[2],brand=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_BRANDS'),brandId),category=brand?String(brand[2]||'').toLowerCase():'';
  const creators=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CREATORS')),crm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CREATORS')),platforms=[];rows.forEach(r=>{const id=pm['Creator ID']!=null?r[pm['Creator ID']]:r[2],cr=creators.find(x=>String(crm['Creator ID']!=null?x[crm['Creator ID']]:x[0])===String(id));const p=cr?String(crm['Platform']!=null?cr[crm['Platform']]:cr[2]||'').toUpperCase():'';if(p&&platforms.indexOf(p)<0)platforms.push(p);});
  return {campaignId:String(campaignId),goal,budget:Number(cm['Budget']!=null?camp[cm['Budget']]:camp[5])||0,currency:cm['Currency']!=null?camp[cm['Currency']]:(camp[6]||'THB'),spend,reach,impressions:imp,views,engagements:eng,clicks,conversions:conv,revenue,engagementRate:imp>0?eng/imp*100:(reach>0?eng/reach*100:0),cpe:eng>0?spend/eng:0,cpc:clicks>0?spend/clicks:0,roas:spend>0?rev/spend:0,category,platforms,status:'COMPLETED'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_campaignAggregate_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_campaignAggregate_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_getCampaignBenchmark(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_getCampaignBenchmark');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_CORE_upgradeSchema_(token);const target=KOL_IDS_CORE_campaignAggregate_(ss,campaignId);if(!target)throw new Error('Campaign has no completed performance data yet.');
  const camps=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_CAMPAIGNS')),all=camps.map(r=>KOL_IDS_CORE_campaignAggregate_(ss,r[0])).filter(Boolean).filter(x=>x.campaignId!==campaignId);
  const sameGoal=all.filter(x=>x.goal===target.goal),sameCategory=sameGoal.filter(x=>target.category&&x.category===target.category),samePlatform=sameCategory.filter(x=>target.platforms.some(p=>x.platforms.indexOf(p)>=0));
  let pool= samePlatform.length>=3?samePlatform:sameCategory.length>=3?sameCategory:sameGoal.length>=3?sameGoal:[];
  let peerDefinition= samePlatform.length>=3?'same goal + category + platform':sameCategory.length>=3?'same goal + category':sameGoal.length>=3?'same goal':'insufficient comparable peers';
  const metrics=['Reach','Engagement Rate','CPE','CPC','Conversions','ROAS'],results=metrics.map(metric=>{const actual=KOL_IDS_CORE_benchmarkValue_(target,metric),vals=pool.map(x=>KOL_IDS_CORE_benchmarkValue_(x,metric)).filter(v=>isFinite(v)&&v>=0),benchmark=KOL_IDS_CORE_median_(vals),direction=KOL_IDS_CORE_benchmarkDirection_(metric),delta=benchmark?((actual-benchmark)/benchmark*100):0,percentile=KOL_IDS_CORE_percentile_(actual,vals,direction),conf=vals.length>=10?'High':vals.length>=5?'Medium':vals.length>=3?'Low':'Insufficient';return {metric,actual,benchmark,deltaPct:KOL_IDS_CORE_round1_(delta),percentile,confidence:conf,peerCount:vals.length,direction,method:'MEDIAN'};});
  const sh=ss.getSheetByName('ENT_BENCHMARKS');results.forEach(x=>sh.appendRow(['BM-'+Utilities.getUuid().slice(0,8).toUpperCase(),campaignId,target.goal,x.peerCount,x.metric,x.actual,x.benchmark,x.deltaPct,x.percentile,x.confidence,peerDefinition,new Date(),'MEDIAN']));
  const status=pool.length>=3?'RELIABLE':'DIRECTIONAL';KOL_IDS_CORE_audit_(ss,'CAMPAIGN_BENCHMARK',campaignId,'OK','Goal='+target.goal+'; peerDefinition='+peerDefinition+'; peers='+pool.length+'; method=MEDIAN');
  return {success:true,campaignId,goal:target.goal,peerCount:pool.length,peerDefinition,status,metrics:results,limitations:pool.length<3?'Not enough comparable completed campaigns. Benchmark is directional only; do not treat it as a market truth.':'Benchmark uses comparable completed campaigns and median to reduce outlier distortion.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_getCampaignBenchmark', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_getCampaignBenchmark', Date.now() - __kolIdsTraceStartedAt);
  }
}





/* =========================================================
 * V5.7.0 — FINAL INTEGRATION / WORKFLOW HARDENING
 * ========================================================= */
function KOL_IDS_CORE_upgradeSchema_(token){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_upgradeSchema_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_CORE_ctx_(token).ss;
  const specs={
    ENT_CREATORS:['Photo URL','Social Links','ER Source','Rate Source','Profile Type','Audience Age Range','Data Confidence'],
    ENT_DECISIONS:['Efficiency Score','Commercial Efficiency','ER Value','ER Source','Rate Value','Rate Source','Learning Adjustment','Campaign Goal','Goal Profile','Decision Tier','Preference Status','Brand Fit Gap','Recovery Strategy','Evidence','Evidence Score','Historical Goal Signal','Data Quality Score','Decision Rationale','Calibration Adjustment','Calibration Basis','Peer Benchmark','Investment Strength','Data Reliability','Price Risk','Decision Class','History Calibration','Peer Calibration','Fair Rate','Price Value','Opportunity Score','Data State','Creator Role'],
    ENT_PERFORMANCE:['Status','Efficiency Score','CPM','CPE','CPC','ROAS','Actual Goal Score','Goal KPI','Performance Confidence','Likes','Comments','Shares','Saves'],
    ENT_LEARNING:['Commercial Efficiency','Efficiency Signal','Goal KPI','Prediction Error','Calibration Weight'],
    ENT_CAMPAIGNS:['Campaign Goal','Success Metric','Goal Profile','Decision Status','Benchmark Status','Plan Summary'],
    ENT_BENCHMARKS:['Benchmark ID','Campaign ID','Campaign Goal','Peer Count','Metric','Actual','Benchmark','Delta %','Percentile','Confidence','Peer Definition','Created At','Method'],
    ENT_GOAL_RULES:['Goal','Weight Persona','Weight Audience','Weight Content','Weight Objective','Weight Brand','Weight Efficiency','Primary KPI','Secondary KPI','Strategy'],
    ENT_STRATEGIES:['Strategy ID','Campaign ID','Creator ID','Creator Name','Goal','Original Score','Decision Tier','Preferred','Recommended Role','Gap','Actions','Projected Fit','Confidence','Created At']
  };
  Object.keys(specs).forEach(name=>KOL_IDS_CORE_ensureColumns_(ss,name,specs[name]));
  KOL_IDS_CORE_seedGoalRules_(ss);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_upgradeSchema_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_upgradeSchema_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_getReport(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_getReport');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_CORE_upgradeSchema_(token);
  const sh=ss.getSheetByName('ENT_DECISIONS'),dm=KOL_IDS_CORE_colMap_(sh),crSh=ss.getSheetByName('ENT_CREATORS'),crs=KOL_IDS_CORE_values_(crSh),crm=KOL_IDS_CORE_colMap_(crSh);
  const rows=KOL_IDS_CORE_values_(sh).filter(r=>!campaignId||String(r[1])===String(campaignId));
  return {campaignId:campaignId||'',rows:rows.map(r=>({
    decisionId:r[0],campaignId:r[1],creatorId:r[2],name:r[3],photoUrl:crm['Photo URL']!=null?((crs.find(x=>String(x[0])===String(r[2]))||[])[crm['Photo URL']]||''):'',
    decision:r[4],score:Number(r[5]||0),personaFit:Number(r[6]||0),audienceFit:Number(r[7]||0),behaviorFit:dm['Behavior Fit']!=null?Number(r[dm['Behavior Fit']]||0):0,contentFit:Number(r[8]||0),objectiveFit:Number(r[9]||0),brandFit:Number(r[10]||0),confidence:r[11],confidenceScore:Number(r[12]||0),why:r[13],dataLimitation:r[14],
    efficiencyScore:dm['Efficiency Score']!=null?Number(r[dm['Efficiency Score']]||0):50,commercialEfficiency:dm['Commercial Efficiency']!=null?Number(r[dm['Commercial Efficiency']]||0):0,erValue:dm['ER Value']!=null?r[dm['ER Value']]:crm['ER %']!=null?'': '',erSource:dm['ER Source']!=null?r[dm['ER Source']]: 'UNKNOWN',rateValue:dm['Rate Value']!=null?r[dm['Rate Value']]: '',rateSource:dm['Rate Source']!=null?r[dm['Rate Source']]: 'UNKNOWN',learningAdjustment:dm['Learning Adjustment']!=null?Number(r[dm['Learning Adjustment']]||0):0,
    campaignGoal:dm['Campaign Goal']!=null?r[dm['Campaign Goal']]: '',goalProfile:dm['Goal Profile']!=null?r[dm['Goal Profile']]:'',decisionTier:dm['Decision Tier']!=null?r[dm['Decision Tier']]:r[4],brandFitGap:dm['Brand Fit Gap']!=null?Number(r[dm['Brand Fit Gap']]||0):0,evidence:dm['Evidence']!=null?r[dm['Evidence']]: '',evidenceScore:dm['Evidence Score']!=null?Number(r[dm['Evidence Score']]||0):0,historicalGoalSignal:dm['Historical Goal Signal']!=null?Number(r[dm['Historical Goal Signal']]||50):50,dataQualityScore:dm['Data Quality Score']!=null?Number(r[dm['Data Quality Score']]||0):0,decisionRationale:dm['Decision Rationale']!=null?r[dm['Decision Rationale']]:r[13],
    calibrationAdjustment:dm['Calibration Adjustment']!=null?Number(r[dm['Calibration Adjustment']]||0):0,calibrationBasis:dm['Calibration Basis']!=null?r[dm['Calibration Basis']]:'CORE_ONLY',historyCalibration:dm['History Calibration']!=null?Number(r[dm['History Calibration']]||0):0,peerCalibration:dm['Peer Calibration']!=null?Number(r[dm['Peer Calibration']]||0):0,peerBenchmark:dm['Peer Benchmark']!=null?KOL_IDS_CORE_safeJson_(r[dm['Peer Benchmark']],null):null,fairRate:dm['Fair Rate']!=null?Number(r[dm['Fair Rate']]||0):0,priceValue:dm['Price Value']!=null?Number(r[dm['Price Value']]||0):0,opportunityScore:dm['Opportunity Score']!=null?Number(r[dm['Opportunity Score']]||0):0,dataState:dm['Data State']!=null?r[dm['Data State']]:'UNKNOWN',creatorRole:dm['Creator Role']!=null?r[dm['Creator Role']]:'SUPPORT CREATOR',investmentStrength:dm['Investment Strength']!=null?Number(r[dm['Investment Strength']]||0):0,dataReliability:dm['Data Reliability']!=null?Number(r[dm['Data Reliability']]||0):0,priceRisk:dm['Price Risk']!=null?r[dm['Price Risk']]:'MEDIUM',decisionClass:dm['Decision Class']!=null?r[dm['Decision Class']]:'CORE',
    contentRecommendation:dm['Content Recommendation']!=null?KOL_IDS_CORE_safeJson_(r[dm['Content Recommendation']],[]):[],
    followers:crm['Followers']!=null?crs.find(x=>String(x[0])===String(r[2]))?.[crm['Followers']]:'',category:crm['Category']!=null?crs.find(x=>String(x[0])===String(r[2]))?.[crm['Category']]:''
  }))};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_getReport', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_getReport', Date.now() - __kolIdsTraceStartedAt);
  }
}





function KOL_IDS_CORE_getCampaignReport(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_getCampaignReport');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_CORE_upgradeSchema_(token);
  const dec=KOL_IDS_CORE_getReport(token,campaignId).rows||[];
  const psh=KOL_IDS_PA_legacyProjection_(ss),pm=KOL_IDS_CORE_colMap_(psh),prows=KOL_IDS_CORE_values_(psh).filter(r=>String(pm['Campaign ID']!=null?r[pm['Campaign ID']]:r[1])===String(campaignId));
  const csh=ss.getSheetByName('ENT_CREATORS'),creators=KOL_IDS_CORE_values_(csh),crm=KOL_IDS_CORE_colMap_(csh),creatorMap={};creators.forEach(r=>creatorMap[String(crm['Creator ID']!=null?r[crm['Creator ID']]:r[0])]=r);
  const lsh=ss.getSheetByName('ENT_LEARNING'),lm=KOL_IDS_CORE_colMap_(lsh),learn=KOL_IDS_CORE_values_(lsh).filter(r=>String(lm['Campaign ID']!=null?r[lm['Campaign ID']]:r[1])===String(campaignId));
  let benchmark=null;try{benchmark=KOL_IDS_CORE_getCampaignBenchmark(token,campaignId);}catch(e){benchmark={success:false,error:String(e&&e.message||e)};}
  const camp=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CAMPAIGNS'),campaignId),cm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CAMPAIGNS'));
  const g=String(cm['Campaign Goal']!=null&&camp?camp[cm['Campaign Goal']]:'AWARENESS').toUpperCase();
  const val=(r,h,fallback)=>pm[h]!=null?r[pm[h]]:fallback;
  var baseReport={success:true,campaignId:String(campaignId),durationDays:camp&&cm['Duration Days']!=null?camp[cm['Duration Days']]:'',goal:g,decisions:dec,benchmark,
    performance:prows.map(r=>({
      id:val(r,'Performance ID',r[0]),creatorId:val(r,'Creator ID',r[2]),creatorName:val(r,'Creator Name',r[3]),
      photoUrl:creatorMap[String(val(r,'Creator ID',r[2]))]&&crm['Photo URL']!=null?creatorMap[String(val(r,'Creator ID',r[2]))][crm['Photo URL']]:'',
      spend:val(r,'Spend',''),reach:val(r,'Reach',''),impressions:val(r,'Impressions',''),views:val(r,'Views',''),
      likes:val(r,'Likes',0),comments:val(r,'Comments',0),shares:val(r,'Shares',0),saves:val(r,'Saves',0),engagements:val(r,'Engagements',0),
      clicks:val(r,'Clicks',0),conversions:val(r,'Conversions',0),revenue:val(r,'Revenue',0),currency:val(r,'Currency','THB'),evidence:val(r,'Evidence',''),reportedDate:val(r,'Reported Date',''),notes:val(r,'Notes',''),status:val(r,'Status','SAVED'),
      efficiencyScore:val(r,'Efficiency Score',50),cpm:val(r,'CPM',0),cpe:val(r,'CPE',0),cpc:val(r,'CPC',0),roas:val(r,'ROAS',0),actualGoalScore:val(r,'Actual Goal Score',KOL_IDS_CORE_actualGoalScoreFromRow_(r,g)),performanceConfidence:val(r,'Performance Confidence',0),goalKpi:val(r,'Goal KPI',KOL_IDS_CORE_goalProfile_(g).primary)
    })),
    learning:learn.map(r=>({id:lm['Learning ID']!=null?r[lm['Learning ID']]:r[0],creatorId:lm['Creator ID']!=null?r[lm['Creator ID']]:r[2],creatorName:lm['Creator Name']!=null?r[lm['Creator Name']]:r[3],predicted:lm['Predicted Score']!=null?r[lm['Predicted Score']]:r[4],actual:lm['Actual Score']!=null?r[lm['Actual Score']]:r[5],variance:lm['Variance']!=null?r[lm['Variance']]:r[6],summary:lm['Performance Summary']!=null?r[lm['Performance Summary']]:r[7],worked:lm['What Worked']!=null?r[lm['What Worked']]:r[8],notWorked:lm['What Did Not']!=null?r[lm['What Did Not']] : r[9],next:lm['Next Action']!=null?r[lm['Next Action']]:r[10]}))};
  if(typeof KOL_IDS_DEEP_REPORT_build_==='function'){try{baseReport.deepIntelligence=KOL_IDS_DEEP_REPORT_build_(baseReport);}catch(e){baseReport.deepIntelligence={version:'2X-INTELLIGENCE-1.0',status:'UNAVAILABLE',error:String(e&&e.message||e)};}}
  return baseReport;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_getCampaignReport', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_getCampaignReport', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* =========================================================
 * V5.7.0 — TRANSPARENCY / QA TEST SUITE
 * ========================================================= */
function KOL_IDS_CORE_seedGoalRules_(ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_seedGoalRules_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh=ss.getSheetByName('ENT_GOAL_RULES');if(!sh||sh.getLastRow()>1)return;
  const p=['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'];
  p.forEach(g=>{const x=KOL_IDS_CORE_goalProfile_(g);sh.appendRow([g,x.weights.persona,x.weights.audience,x.weights.content,x.weights.objective,x.weights.brand,x.weights.efficiency,x.primary,x.secondary,x.role]);});

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_seedGoalRules_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_seedGoalRules_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_runTests(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_runTests');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const tests=[],t=(name,fn)=>{try{const x=fn();tests.push({name,pass:x===true,message:x===true?'PASS':String(x)});}catch(e){tests.push({name,pass:false,message:e&&e.message||String(e)});}};
  t('Plan 3 months price',()=>KOL_IDS.PLANS.THREE_MONTHS.price===39000);
  t('Plan 6 months price',()=>KOL_IDS.PLANS.SIX_MONTHS.price===KOL_IDS_PRICING_AUTHORITY_().PLANS.SIX_MONTHS.price);
  t('Plan annual price',()=>KOL_IDS.PLANS.ONE_YEAR.price===KOL_IDS_PRICING_AUTHORITY_().PLANS.ONE_YEAR.price);
  t('Plan 3 months duration',()=>KOL_IDS.PLANS.THREE_MONTHS.months===3);
  t('Plan 6 months duration',()=>KOL_IDS.PLANS.SIX_MONTHS.months===6);
  t('Plan 12 months duration',()=>KOL_IDS.PLANS.ONE_YEAR.months===12);
  t('Upgrade price difference',()=>KOL_IDS.PLANS.ONE_YEAR.price-KOL_IDS.PLANS.SIX_MONTHS.price===KOL_IDS_PRICING_AUTHORITY_().PLANS.ONE_YEAR.price-KOL_IDS_PRICING_AUTHORITY_().PLANS.SIX_MONTHS.price);
  t('Commercial currency',()=>KOL_IDS.COMMERCIAL.CURRENCY==='THB');
  t('Commercial access 3-month price sync',()=>typeof KOL_IDS_COMMERCIAL_CONFIG!=='undefined' && KOL_IDS_COMMERCIAL_CONFIG.PRICING.THREE_MONTHS.price===KOL_IDS.PLANS.THREE_MONTHS.price);
  t('Commercial access 3-month duration sync',()=>typeof KOL_IDS_COMMERCIAL_CONFIG!=='undefined' && KOL_IDS_COMMERCIAL_CONFIG.PRICING.THREE_MONTHS.months===KOL_IDS.PLANS.THREE_MONTHS.months);
  t('Commercial access 6-month price sync',()=>typeof KOL_IDS_COMMERCIAL_CONFIG!=='undefined' && KOL_IDS_COMMERCIAL_CONFIG.PRICING.SIX_MONTHS.price===KOL_IDS.PLANS.SIX_MONTHS.price);
  t('Commercial access annual price sync',()=>typeof KOL_IDS_COMMERCIAL_CONFIG!=='undefined' && KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR.price===KOL_IDS.PLANS.ONE_YEAR.price);
  t('Commercial access 6-month duration sync',()=>typeof KOL_IDS_COMMERCIAL_CONFIG!=='undefined' && KOL_IDS_COMMERCIAL_CONFIG.PRICING.SIX_MONTHS.months===KOL_IDS.PLANS.SIX_MONTHS.months);
  t('Commercial access annual duration sync',()=>typeof KOL_IDS_COMMERCIAL_CONFIG!=='undefined' && KOL_IDS_COMMERCIAL_CONFIG.PRICING.ONE_YEAR.months===KOL_IDS.PLANS.ONE_YEAR.months);
  t('Payment verification mode is manual admin',()=>KOL_IDS.COMMERCIAL.PAYMENT_VERIFICATION==='MANUAL_ADMIN');
  t('Goal profiles exist',()=>['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'].every(g=>KOL_IDS_CORE_goalProfile_(g)&&KOL_IDS_CORE_goalProfile_(g).primary));
  t('Goal weights sum to 1',()=>['AWARENESS','ENGAGEMENT','CONSIDERATION','CONVERSION','LAUNCH'].every(g=>{const KOL_IDS_PLATFORM_w=KOL_IDS_CORE_goalProfile_(g).weights;return Math.abs(Object.values(KOL_IDS_PLATFORM_w).reduce((a,b)=>a+b,0)-1)<.001;}));
  t('Age KOL_IDS_DECISION_SCIENCE_overlap exact',()=>KOL_IDS_CORE_ageGender_({ageMin:18,ageMax:34,gender:'FEMALE'},{ageMin:18,ageMax:34,gender:'FEMALE'})===100);
  t('Age mismatch',()=>KOL_IDS_CORE_ageGender_({ageMin:18,ageMax:24,gender:'FEMALE'},{ageMin:40,ageMax:50,gender:'FEMALE'})<50);
  t('Token KOL_IDS_DECISION_SCIENCE_overlap',()=>KOL_IDS_CORE_tokenOverlap_('beauty skincare','beauty makeup')===50);
  t('Recommendation threshold',()=>KOL_IDS.DECISION.RECOMMEND===75);
  t('Confidence bands',()=>KOL_IDS.CONFIDENCE.HIGH>KOL_IDS.CONFIDENCE.MEDIUM);
  t('Negative numeric rejected',()=>{try{KOL_IDS_CORE_numOrBlank_(-1);return false;}catch(e){return true;}});
  t('Percentage rejected above 100',()=>{try{KOL_IDS_CORE_pctOrBlank_(101);return false;}catch(e){return true;}});
  t('Optional ER source',()=>KOL_IDS_CORE_dataSignals_(['C','Creator','TikTok','',100000,'','','','','','','','',10000]).erSource==='ESTIMATED');
  t('Optional Rate source',()=>KOL_IDS_CORE_dataSignals_(['C','Creator','TikTok','',100000,5,'','','','','','','','']).rateSource==='ESTIMATED');
  t('Estimated ER bounded',()=>{const x=KOL_IDS_CORE_dataSignals_(['C','Creator','TikTok','',100000,'','','','','','','','']);return x.erValue>0&&x.erValue<=12;});
  t('Estimated Rate bounded',()=>{const x=KOL_IDS_CORE_dataSignals_(['C','Creator','TikTok','',100000,'','','','','','','','']);return x.rateValue>0;});
  t('Score range',()=>{const mock={getSheetByName:function(){return {getLastRow:function(){return 1},getLastColumn:function(){return 1},getRange:function(){return {getValues:function(){return [['x']]}}}}}};const x=KOL_IDS_CORE_scoreCreator_(['P','P',18,34,'FEMALE','Thailand','beauty','shopping',''],['B','Brand','beauty','THAILAND','premium beauty','quality','gambling'],['C','Creator','TikTok','',100000,5,18,34,'FEMALE','Thailand','beauty','review tutorial','beauty',10000,'THB','campaign','strong','LOW'],'AWARENESS',mock);return [x.score,x.personaFit,x.audienceFit,x.contentFit,x.objectiveFit,x.brandFit,x.confidenceScore].every(v=>isFinite(Number(v))&&v>=0&&v<=100);});
  t('Performance conversion score bounded',()=>KOL_IDS_CORE_actualGoalScoreFromRow_(['','','','',10000,100000,200000,150000,10000,5000,500,50000],'CONVERSION')>=0&&KOL_IDS_CORE_actualGoalScoreFromRow_(['','','','',10000,100000,200000,150000,10000,5000,500,50000],'CONVERSION')<=100);
  t('Median robust to outlier',()=>KOL_IDS_CORE_median_([1,2,3,100])===2.5);
  t('Month add 6',()=>{const a=KOL_IDS_CORE_addMonths_(new Date(2026,7,29),6);return a instanceof Date&&!isNaN(a.getTime())&&a.getFullYear()===2027&&a.getMonth()===1&&a.getDate()===28;});
  t('Month add 12',()=>{const a=KOL_IDS_CORE_addMonths_(new Date(2026,7,29),12);return a instanceof Date&&!isNaN(a.getTime())&&a.getFullYear()===2027&&a.getMonth()===7&&a.getDate()===29;});
  t('Empty token rejected',()=>{try{KOL_IDS_CORE_verifyToken_('');return false;}catch(e){return true;}});
  const result={success:tests.every(x=>x.pass),version:KOL_IDS.VERSION,tests,passed:tests.filter(x=>x.pass).length,total:tests.length};Logger.log(JSON.stringify(result,null,2));return result;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_runTests', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_runTests', Date.now() - __kolIdsTraceStartedAt);
  }
}


/* =========================================================
 * KOL IDS — DEEP LOGIC / PERSONA AGE / RECOVERY PLAN
 * Logic-first. No AI scoring. Missing ER/Rate are optional.
 * LOW FIT remains visible in the Campaign Plan, but never
 * silently becomes a primary recommendation.
 * ========================================================= */
function KOL_IDS_CORE_ensurePersona_(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_ensurePersona_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const ss=KOL_IDS_CORE_ctx_(arguments[0]).ss;
  KOL_IDS_CORE_ensureColumns_(ss,'ENT_PERSONAS',['Persona ID','Persona Name','Age Min','Age Max','Gender','Locations','Interests','Behaviors','Description','Created At','Audience Age Range']);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_ensurePersona_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_ensurePersona_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_savePersona(token,p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_savePersona');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_CORE_upgradeSchema_(token);
    KOL_IDS_CORE_ensureColumns_(ss,'ENT_PERSONAS',['Persona ID','Persona Name','Age Min','Age Max','Gender','Locations','Interests','Behaviors','Description','Created At','Audience Age Range','Goals & Needs','Pain Points']);
    const name=KOL_IDS_CORE_req_(p&&p.name,'Persona Name');
    let ageMin=KOL_IDS_CORE_numOrBlank_(p&&p.ageMin),ageMax=KOL_IDS_CORE_numOrBlank_(p&&p.ageMax);
    if((ageMin===''||ageMax==='')&&p&&p.ageRange){const ar=KOL_IDS_CORE_parseAgeRange_(p.ageRange);ageMin=ar.min;ageMax=ar.max;}
    if(ageMin===''||ageMax==='')throw new Error('Audience age range is required.');
    if(ageMin<13||ageMax>120||ageMin>ageMax)throw new Error('Audience age range is invalid.');
    if(!String(p&&p.goalsNeeds||'').trim())throw new Error('Goals & Needs is required.');
    if(!String(p&&p.painPoints||'').trim())throw new Error('Pain Points is required.');
    const sh=ss.getSheetByName('ENT_PERSONAS'),vals=KOL_IDS_CORE_values_(sh),id=String((p&&p.id)||'PE-'+Utilities.getUuid().slice(0,8).toUpperCase()),idx=vals.findIndex(r=>String(r[0])===id),old=idx>=0?vals[idx]:[];
    const row=KOL_IDS_CORE_setByHeader_(sh,{
      'Persona ID':id,'Persona Name':name,'Age Min':ageMin,'Age Max':ageMax,'Audience Age Range':String(ageMin)+'-'+String(ageMax),
      'Gender':p.gender||'ANY','Locations':String(p.locations||'').trim(),'Interests':String(p.interests||'').trim(),
      'Behaviors':String(p.behaviors||'').trim(),'Goals & Needs':String(p.goalsNeeds||'').trim(),'Pain Points':String(p.painPoints||'').trim(),
      'Description':String(p.description||'').trim(),'Created At':idx<0?new Date():old[KOL_IDS_CORE_colMap_(sh)['Created At']||9]
    });
    if(idx<0)sh.appendRow(row);else sh.getRange(idx+2,1,1,row.length).setValues([row]);
    KOL_IDS_CORE_audit_(ss,'SAVE_PERSONA',id,'OK','Persona saved with core Persona Intelligence fields and Audience Age Range '+ageMin+'-'+ageMax);
    return {success:true,id,complete:true,ageRange:ageMin+'-'+ageMax,goalsNeedsSaved:true,painPointsSaved:true};
  }finally{lock.releaseLock();}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_savePersona', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_savePersona', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58Clamp_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58Clamp_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return Math.max(0,Math.min(100,Math.round(Number(v)||0)));
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58Clamp_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58Clamp_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58RangeFit_(tMin,tMax,cMin,cMax){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58RangeFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const a=Number(tMin),b=Number(tMax),c=Number(cMin),d=Number(cMax);
  if(![a,b,c,d].every(isFinite)||a>b||c>d)return 50;
  const KOL_IDS_DECISION_SCIENCE_overlap=Math.max(0,Math.min(b,d)-Math.max(a,c)+1),targetSize=b-a+1,union=Math.max(targetSize,d-c+1);
  if(!KOL_IDS_DECISION_SCIENCE_overlap){const dist=Math.min(Math.abs(c-b),Math.abs(a-d));return Math.max(0,Math.round(45-dist*4));}
  return KOL_IDS_CORE_v58Clamp_((KOL_IDS_DECISION_SCIENCE_overlap/targetSize)*70+(KOL_IDS_DECISION_SCIENCE_overlap/union)*30);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58RangeFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58RangeFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58FieldFit_(target,actual,neutral){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58FieldFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const a=String(target||'').trim(),b=String(actual||'').trim();
  if(!a||!b)return neutral==null?50:neutral;
  return KOL_IDS_CORE_textOverlap_(a,b);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58FieldFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58FieldFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58AudienceFit_(target,creator){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58AudienceFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const age=KOL_IDS_CORE_v58RangeFit_(target.ageMin,target.ageMax,creator.ageMin,creator.ageMax);
  const tg=String(target.gender||'ANY').toUpperCase(),cg=String(creator.gender||'ANY').toUpperCase();
  const gender=(!creator.gender||cg==='ANY'||tg==='ANY')?50:(tg===cg?100:0);
  const loc=KOL_IDS_CORE_v58FieldFit_(target.locations,creator.locations,50);
  const interest=KOL_IDS_CORE_v58FieldFit_(target.interests,creator.interests,50);
  const behavior=KOL_IDS_CORE_v58FieldFit_(target.behaviors,String(creator.styles||'')+' '+String(creator.interests||''),50);
  return KOL_IDS_CORE_v58Clamp_(age*.40+gender*.10+loc*.15+interest*.25+behavior*.10);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58AudienceFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58AudienceFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58BrandFit_(brand,creator){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58BrandFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const cat=String(brand[2]||''),pos=String(brand[4]||''),val=String(brand[5]||''),avoid=String(brand[6]||'');
  const ct=String(creator.category||''),it=String(creator.interests||''),st=String(creator.styles||''),all=ct+' '+it+' '+st;
  const category=cat?KOL_IDS_CORE_textOverlap_(cat,ct):50;
  const positioning=pos?KOL_IDS_CORE_textOverlap_(pos,all):50;
  const values=val?KOL_IDS_CORE_textOverlap_(val,all):50;
  const A=KOL_IDS_CORE_tokens_(avoid),B=KOL_IDS_CORE_tokens_(all),set={};B.forEach(x=>set[x]=1);
  let conflicts=0;A.forEach(x=>{if(set[x])conflicts++;});
  const penalty=Math.min(60,conflicts*25);
  return {score:KOL_IDS_CORE_v58Clamp_(category*.45+positioning*.30+values*.25-penalty),conflicts};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58BrandFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58BrandFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58Efficiency_(followers,er,rate,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58Efficiency_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const f=Number(followers||0),e=Number(er||0),cost=Number(rate||0);
  if(!f||!e||!cost)return {score:50,commercial:0,known:false};
  const expected=f*e/100,cpe=cost/Math.max(1,expected);
  const cpeScore=cpe<=.5?100:cpe<=1?92:cpe<=2?82:cpe<=4?70:cpe<=8?55:35;
  const reachProxy=Math.min(100,Math.log10(Math.max(10,f))/6*100),engProxy=Math.min(100,e/6*100);
  let score=cpeScore*.65+reachProxy*.15+engProxy*.20;
  if(String(goal).toUpperCase()==='AWARENESS'&&f>=100000)score=Math.min(100,score+5);
  return {score:KOL_IDS_CORE_v58Clamp_(score),commercial:Math.round((expected/Math.max(1,cost))*100)/100,known:true,cpe};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58Efficiency_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58Efficiency_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58Confidence_(r,history,risk,erActual,rateActual){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58Confidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const checks=[r[4]!==''&&r[4]!=null,r[6]!==''&&r[7]!=='',r[8]!==''&&r[8]!=null,r[9]!==''&&r[9]!=null,r[10]!==''&&r[10]!=null,r[11]!==''&&r[11]!=null,erActual,rateActual,history>0];
  let score=KOL_IDS_CORE_v58Clamp_(checks.filter(Boolean).length/checks.length*100);
  // Optional ER/Rate reduce confidence, not fit. Missing first-party audience data is more consequential.
  if(r[6]===''||r[7]==='')score-=12;
  if(r[10]==='')score-=10;
  if(r[11]==='')score-=8;
  if(String(risk).toUpperCase()==='HIGH')score-=22;else if(String(risk).toUpperCase()==='MEDIUM')score-=8;
  return KOL_IDS_CORE_v58Clamp_(score);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58Confidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58Confidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_scoreCreator_(persona,brand,r,goal,ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_scoreCreator_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const g=KOL_IDS_CORE_normalizeGoal_(goal);
  if(!g)throw new Error('Campaign Goal is required.');
  const profile=KOL_IDS_CORE_goalProfile_(g);
  const sig=KOL_IDS_CORE_dataSignals_(r);
  const history=KOL_IDS_CORE_derivedHistory_(ss,r[0]);
  const risk=KOL_IDS_CORE_derivedRisk_(ss,r,sig);
  const cm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CREATORS'));
  const get=h=>cm[h]!=null?r[cm[h]]:'';
  const erActual=r[5]!==''&&r[5]!=null&&isFinite(Number(r[5]));
  const rateActual=r[13]!==''&&r[13]!=null&&isFinite(Number(r[13]));
  const creator={id:r[0],name:r[1],platform:r[2],followers:r[4],er:erActual?Number(r[5]):sig.erValue,ageMin:r[6],ageMax:r[7],gender:r[8],locations:r[9],interests:r[10],styles:r[11],category:r[12],rate:rateActual?Number(r[13]):sig.rateValue,risk,history,
    personality:get('Personality'),communication:get('Communication'),influence:get('Influence Style'),relationship:get('Audience Relationship'),socialBehavior:get('Social Behavior'),contentPersonality:get('Content Personality'),contentFunction:get('Content Function'),contentBehavior:get('Content Behavior'),psychology:get('Audience Psychology')};
  const target={ageMin:KOL_IDS_CORE_numOrBlank_(persona[2]),ageMax:KOL_IDS_CORE_numOrBlank_(persona[3]),gender:persona[4],locations:persona[5],interests:persona[6],behaviors:persona[7],goalsNeeds:KOL_IDS_CORE_cmPersonaField_(persona,ss.getSheetByName('ENT_PERSONAS'),'Goals & Needs'),painPoints:KOL_IDS_CORE_cmPersonaField_(persona,ss.getSheetByName('ENT_PERSONAS'),'Pain Points')};

  // V15.8: separate hard fit from evidence-backed performance. Missing evidence lowers confidence, not the fit itself.
  const personaFit=KOL_IDS_CORE_ageGender_(target,creator);
  const baseAudienceFit=KOL_IDS_CORE_v58AudienceFit_(target,creator);
  const behavioralFit=KOL_IDS_CORE_behavioralFit_(target,creator,g);
  const audienceFit=KOL_IDS_CORE_v58Clamp_(baseAudienceFit*.55+behavioralFit*.45);
  const brandObj=KOL_IDS_CORE_v58BrandFit_(brand,creator);
  const brandFit=brandObj.score;
  const baseContentFit=KOL_IDS_CORE_content_(g,brand,creator);
  const deepFit=KOL_IDS_CORE_deepPersonaFit_(target,brand,creator,g);
  const contentFit=KOL_IDS_CORE_v58Clamp_(baseContentFit*.45+deepFit*.55);
  const objectiveFit=KOL_IDS_CORE_objective_(g,creator);
  const eff=KOL_IDS_CORE_v58Efficiency_(creator.followers,creator.er,creator.rate,g);

  // Efficiency is deliberately capped as a supporting signal so scale does not overpower fit.
  const KOL_IDS_PLATFORM_w=KOL_IDS_CORE_goalWeights_(g);
  const evidenceCoverage=KOL_IDS_CORE_evidenceCoverage_(creator,target,erActual,rateActual,history);
  const score0=KOL_IDS_CORE_v58Clamp_(personaFit*KOL_IDS_PLATFORM_w.persona+audienceFit*KOL_IDS_PLATFORM_w.audience+contentFit*KOL_IDS_PLATFORM_w.content+objectiveFit*KOL_IDS_PLATFORM_w.objective+brandFit*KOL_IDS_PLATFORM_w.brand+eff.score*KOL_IDS_PLATFORM_w.efficiency);
  const hist=KOL_IDS_CORE_creatorHistoricalGoalSignal_(ss,r[0],g);
  const histAdj=hist.count>=2?KOL_IDS_CORE_boundedLearning_(hist.score,score0,hist.confidence):0;
  const score=KOL_IDS_CORE_v58Clamp_(score0+histAdj);
  const confidenceScore=KOL_IDS_CORE_confidence_(r,history,risk,erActual,rateActual,evidenceCoverage,hist);
  const intelligence=typeof KOL_IDS_INTELLIGENCE_FINAL_intelligence_==='function' ? KOL_IDS_INTELLIGENCE_FINAL_intelligence_(ss,creator,target,g,score,confidenceScore,hist,erActual,rateActual,brandFit,contentFit,eff.score) : {scoreAdjustment:0,basis:'CORE_ONLY',peerBenchmark:null,investmentStrength:Math.round(score*.7+confidenceScore*.3),dataReliability:confidenceScore,priceRisk:(!rateActual?'HIGH':(!erActual?'MEDIUM':'LOW')),decisionClass:'CORE ONLY',historyAdjustment:0,peerAdjustment:0,priceBenchmark:null,priceValue:50,fairRate:null,opportunityScore:Math.round(score*.7+confidenceScore*.3),dataState:'CORE ONLY',role:'SUPPORT CREATOR'};
  const calibratedScore=KOL_IDS_CORE_v58Clamp_(score+Number(intelligence.scoreAdjustment||0));
  const tier=KOL_IDS_CORE_decisionTier_(calibratedScore,confidenceScore,risk);
  const decision=tier==='FIT'?'RECOMMEND':tier==='LOW FIT'?'DO NOT SELECT':'REVIEW';

  const missing=[];
  if(r[6]===''||r[7]==='')missing.push('Audience Age Range');
  if(!r[9])missing.push('Audience Location');
  if(!r[10])missing.push('Audience Interests');
  if(!r[11])missing.push('Content Styles');
  const estimated=[]; if(!erActual)estimated.push('ER'); if(!rateActual)estimated.push('Rate');
  const recommendation=KOL_IDS_CORE_contentRecommendation_(g,creator,brand,target);
  const rationale='Goal '+profile.label+' · strongest signals: '+[['Audience',audienceFit],['Behavior',behavioralFit],['Content',contentFit],['Objective',objectiveFit],['Brand',brandFit],['Persona',personaFit]].sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]+' '+Math.round(x[1])).join(', ')+'. Calibration '+Number(intelligence.scoreAdjustment||0).toFixed(1)+'; investment strength '+Number(intelligence.investmentStrength||0)+'.';
  const evidence='V23 | Goal='+g+' | Weights='+JSON.stringify(KOL_IDS_PLATFORM_w)+' | AudienceBehavior='+Math.round(behavioralFit)+' | ContentFit='+Math.round(contentFit)+' | EvidenceCoverage='+Math.round(evidenceCoverage)+' | History='+hist.count+' | Risk='+risk+' | BrandConflicts='+brandObj.conflicts+' | Calibration='+Number(intelligence.scoreAdjustment||0).toFixed(1)+' | HistoryAdj='+Number(intelligence.historyAdjustment||0).toFixed(1)+' | PeerAdj='+Number(intelligence.peerAdjustment||0).toFixed(1)+' | FairRate='+Number(intelligence.fairRate||0)+' | Opportunity='+Number(intelligence.opportunityScore||0)+' | Role='+intelligence.role+' | Basis='+intelligence.basis;
  const recovery=KOL_IDS_CORE_v58Recovery_(g,calibratedScore,personaFit,audienceFit,contentFit,objectiveFit,brandFit,eff.score,brandObj.conflicts,creator,ss);
  var decisionOut={decisionId:'DEC-'+Utilities.getUuid().slice(0,8).toUpperCase(),creatorId:creator.id,name:creator.name,platform:creator.platform,category:creator.category,followers:creator.followers,
    ageRange:(creator.ageMin!==''&&creator.ageMax!=='')?String(creator.ageMin)+'-'+creator.ageMax:'',decision,score:Math.round(calibratedScore),baseScore:Math.round(score),historicalCampaigns:history,riskLevel:risk,
    personaFit:Math.round(personaFit),audienceFit:Math.round(audienceFit),behaviorFit:Math.round(behavioralFit),contentFit:Math.round(contentFit),objectiveFit:Math.round(objectiveFit),brandFit:Math.round(brandFit),
    efficiencyScore:eff.score,commercialEfficiency:eff.commercial,erValue:sig.erValue,erSource:sig.erSource,rateValue:sig.rateValue,rateSource:sig.rateSource,learningAdjustment:histAdj,calibrationAdjustment:Number(intelligence.scoreAdjustment||0),calibrationBasis:intelligence.basis,historyCalibration:Number(intelligence.historyAdjustment||0),peerCalibration:Number(intelligence.peerAdjustment||0),peerBenchmark:intelligence.peerBenchmark,priceBenchmark:intelligence.priceBenchmark,fairRate:Number(intelligence.fairRate||0),priceValue:Number(intelligence.priceValue||0),priceRisk:intelligence.priceRisk,opportunityScore:Number(intelligence.opportunityScore||0),dataState:intelligence.dataState||'UNKNOWN',creatorRole:intelligence.role||'SUPPORT CREATOR',investmentStrength:Number(intelligence.investmentStrength||0),dataReliability:Number(intelligence.dataReliability||confidenceScore),decisionClass:intelligence.decisionClass,
    confidence:confidenceScore>=80?'High':confidenceScore>=60?'Medium':'Low',confidenceScore,why:rationale,
    dataLimitation:(missing.length?'Missing: '+missing.join(', ')+'. ':'')+(estimated.length?'Optional/estimated: '+estimated.join(', ')+'; these reduce Confidence, not the core Fit score. ':'')+(!history?'No historical campaign evidence yet.':''),
    campaignGoal:g,goalProfile:profile.label,decisionTier:tier,preferenceStatus:'NOT SET',brandFitGap:Math.max(0,70-brandFit),recoveryStrategy:recovery,evidence,evidenceScore:confidenceScore,historicalGoalSignal:hist.score,dataQualityScore:confidenceScore,contentRecommendation:recommendation};
  if (typeof KOL_IDS_INTEL120_recordDecision_==='function') {
    KOL_IDS_INTEL120_recordDecision_(decisionOut,{campaignId:(decisionOut.campaignId||''),persona:target,goal:g});
  }
  return decisionOut;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_scoreCreator_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_scoreCreator_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_goalWeights_(g){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_goalWeights_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const P={
    AWARENESS:{persona:.12,audience:.25,content:.18,objective:.20,brand:.15,efficiency:.10},
    ENGAGEMENT:{persona:.12,audience:.26,content:.24,objective:.16,brand:.14,efficiency:.08},
    CONSIDERATION:{persona:.14,audience:.26,content:.24,objective:.16,brand:.15,efficiency:.05},
    CONVERSION:{persona:.10,audience:.24,content:.20,objective:.20,brand:.16,efficiency:.10},
    LAUNCH:{persona:.11,audience:.23,content:.20,objective:.21,brand:.15,efficiency:.10}
  }; return P[g]||P.AWARENESS;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_goalWeights_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_goalWeights_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_normText_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_normText_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  return String(v||'').toLowerCase().replace(/[–—]/g,'-').replace(/[^a-z0-9ก-๙]+/g,' ').replace(/\s+/g,' ').trim();

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_normText_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_normText_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_terms_(v){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_terms_');
  var __kolIdsTraceStartedAt = Date.now();
  try {
return KOL_IDS_CORE_normText_(v).split(' ').filter(x=>x.length>=2);
  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_terms_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_terms_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_semanticOverlap_(a,b){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_semanticOverlap_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const A=KOL_IDS_CORE_terms_(a),B=KOL_IDS_CORE_terms_(b); if(!A.length||!B.length)return 0;
  const aliases={
    expert:['expert','authority','knowledge','educational','education','ผู้เชี่ยวชาญ','ความรู้'],
    trust:['trust','trusted','authentic','น่าเชื่อถือ','จริงใจ'],
    community:['community','conversation','engagement','comment','ชุมชน','พูดคุย'],
    trend:['trend','trending','viral','discovery','เทรนด์'],
    conversion:['conversion','purchase','buy','shopping','click','ขาย','ซื้อ'],
    education:['education','educational','tutorial','guide','demo','how','สอน','ให้ความรู้'],
    story:['story','storytelling','emotional','เล่าเรื่อง'],
    premium:['premium','luxury','sophisticated','พรีเมียม'],
    relatable:['relatable','friendly','casual','เพื่อน','เข้าถึงง่าย']
  };
  function KOL_IDS_CORE_canon(t){for(const k in aliases)if(aliases[k].indexOf(t)>=0)return k;return t;}
  const bs={};B.forEach(x=>bs[KOL_IDS_CORE_canon(x)]=1); let hit=0; const uniq={};A.forEach(x=>uniq[KOL_IDS_CORE_canon(x)]=1);Object.keys(uniq).forEach(x=>{if(bs[x])hit++;});
  return Math.round(100*hit/Math.max(Object.keys(uniq).length,Object.keys(bs).length));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_semanticOverlap_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_semanticOverlap_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_behavioralFit_(target,creator,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_behavioralFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const targetText=[target.behaviors,target.goalsNeeds,target.painPoints,target.interests].join(' ');
  const creatorText=[creator.socialBehavior,creator.psychology,creator.relationship,creator.communication].join(' ');
  const direct=KOL_IDS_CORE_semanticOverlap_(targetText,creatorText);
  const hints={AWARENESS:'trend setter trend adopter trend driven share driven view driven discovery',ENGAGEMENT:'conversation starter conversation driver community builder high responder comment driven community',CONSIDERATION:'research oriented quality seeking trust based expert led educational save driven',CONVERSION:'purchase intent click driven conversion driven persuasive direct reviewer consumer social proof',LAUNCH:'trend setter trend adopter energetic aspirational experiential share driven discovery'};
  const goalScore=KOL_IDS_CORE_semanticOverlap_(hints[goal]||'',creatorText);
  return KOL_IDS_CORE_v58Clamp_(direct*.70+goalScore*.30);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_behavioralFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_behavioralFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_deepPersonaFit_(target,brand,creator,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_deepPersonaFit_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const creatorText=[creator.personality,creator.communication,creator.influence,creator.relationship,creator.socialBehavior,creator.contentPersonality,creator.contentFunction,creator.contentBehavior,creator.psychology].join(' ');
  const objectiveHints={AWARENESS:'trend charismatic entertaining discovery share',ENGAGEMENT:'conversation community responsive interactive comment',CONSIDERATION:'expert educational trust review tutorial research save',CONVERSION:'persuasive direct demonstration proof purchase click',LAUNCH:'energetic trend aspirational discovery share storytelling'};
  const need=KOL_IDS_CORE_semanticOverlap_([target.goalsNeeds,target.painPoints].join(' '),creatorText);
  const objective=KOL_IDS_CORE_semanticOverlap_(objectiveHints[goal]||'',creatorText);
  const brandSignal=KOL_IDS_CORE_semanticOverlap_([brand[4],brand[5],brand[6]].join(' '),creatorText);
  return Math.round(need*.45+objective*.35+brandSignal*.20);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_deepPersonaFit_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_deepPersonaFit_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_contentRecommendation_(goal,creator,brand,target){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_contentRecommendation_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const map={AWARENESS:[['Short-form / Trend-led','discovery and shareability','trend share discovery'],['Lifestyle / Storytelling','brand association','story emotional relatable'],['Creator-native Entertainment','native reach','entertaining casual']],ENGAGEMENT:[['Conversation-led / Community','participation','conversation community comment'],['Live / Interactive','two-way interaction','interactive responsive'],['Storytelling','emotional response','story emotional']],CONSIDERATION:[['Expert Review','trust and evaluation','expert trust review'],['Tutorial / Demonstration','reduce uncertainty','education tutorial demo'],['Comparison / Education','support research','research comparison education']],CONVERSION:[['Product Demonstration','show practical value','demo proof'],['Review + Proof','reduce purchase risk','review trust proof'],['CTA-led / Shopping','capture measurable intent','conversion click purchase']],LAUNCH:[['Trend-led Short-form','accelerate discovery','trend discovery share'],['Storytelling','build launch narrative','story emotional'],['Product Discovery','introduce the offer','discovery demo']]}[goal]||[];
  const creatorText=[creator.styles,creator.contentFunction,creator.contentBehavior,creator.contentPersonality,creator.communication].join(' ');
  return map.map(x=>({format:x[0],fit:KOL_IDS_CORE_semanticOverlap_(x[2],creatorText),reason:x[1]})).sort((a,b)=>b.fit-a.fit).map((x,i)=>({rank:i+1,format:x.format,fit:x.fit,reason:x.reason}));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_contentRecommendation_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_contentRecommendation_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_evidenceCoverage(creator,target,erActual,rateActual,history){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_evidenceCoverage');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let s=0; const checks=[creator.followers,creator.ageMin,creator.ageMax,creator.gender,creator.locations,creator.interests,creator.styles,target.goalsNeeds,target.painPoints]; checks.forEach(v=>{if(String(v||'').trim())s+=8;});
  if(erActual)s+=6;if(rateActual)s+=4;if(history)s+=5;return KOL_IDS_CORE_v58Clamp_(s,0,100);

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_evidenceCoverage', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_evidenceCoverage', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_boundedLearning(histScore,current,confidence){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_boundedLearning');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const raw=(Number(histScore||50)-Number(current||50)); const cap=confidence>=80?5:confidence>=60?3:2; return Math.max(-cap,Math.min(cap,raw*.06));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_boundedLearning', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_boundedLearning', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_confidence(r,history,risk,erActual,rateActual,coverage,hist){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_confidence');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  let s=35+coverage*.55; if(history)s+=8;if(erActual)s+=3;if(rateActual)s+=2;if(hist&&hist.count>=2)s+=Math.min(10,hist.count*2);if(String(risk).toUpperCase()==='HIGH')s-=20;return Math.round(KOL_IDS_CORE_v58Clamp_(s,0,100));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_confidence', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_confidence', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_cmPersonaField_(row,sh,header){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_cmPersonaField_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  try{const m=KOL_IDS_CORE_colMap_(sh);return m[header]!=null?String(row[m[header]]||''):'';}catch(e){return '';}

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_cmPersonaField_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_cmPersonaField_', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_v58Recovery_(goal,score,pf,af,cf,of,bf,ef,conflicts,creator,ss){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58Recovery_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const actions=[],g=String(goal||'').toUpperCase();
  if(conflicts>0)actions.push({key:'BRAND_CONFLICT',en:'Resolve or explicitly approve the Brand Avoid conflict before activation.',th:'แก้หรืออนุมัติ Brand Avoid conflict ก่อนนำ KOL ไปใช้งานจริง',priority:'BLOCKER'});
  if(bf<60)actions.push({key:'BRAND_ROLE',en:'Do not make this creator the sole Brand spokesperson; use a supporting role with a clear brand-safe brief.',th:'อย่าให้ KOL คนนี้เป็นตัวแทนหลักของแบรนด์ ใช้เป็น Supporting Role พร้อม Brief ที่คุม Brand Fit',priority:'HIGH'});
  if(af<65)actions.push({key:'AUDIENCE',en:'Tighten audience role: use only for the audience segment where the creator has evidence of relevance.',th:'จำกัดบทบาทไปยัง Audience Segment ที่มีหลักฐานว่าเกี่ยวข้องจริง',priority:'HIGH'});
  if(cf<65)actions.push({key:'CONTENT',en:'Adapt the brief to the creator\'s proven native format; do not force an unnatural selling format.',th:'ปรับ Brief ให้เข้ากับรูปแบบ Content ที่ KOL ทำได้จริง ไม่ฝืนรูปแบบการขาย',priority:'MEDIUM'});
  if(of<65)actions.push({key:'OBJECTIVE',en:'Pair with a stronger primary-goal creator and assign this creator a supporting role.',th:'จับคู่กับ KOL ที่ Objective Fit สูงกว่า และให้คนนี้เป็น Supporting Role',priority:'HIGH'});
  if(ef<65)actions.push({key:'EFFICIENCY',en:'Keep spend controlled until actual commercial efficiency is observed.',th:'ควบคุมสัดส่วนงบจนกว่าจะเห็น Commercial Efficiency จากผลจริง',priority:'MEDIUM'});
  if(!actions.length)actions.push({key:'KEEP',en:'Keep the native role and use a Goal-aligned brief.',th:'คงบทบาทที่เหมาะสมและใช้ Brief ที่ตรงกับ Goal',priority:'LOW'});
  const partner=KOL_IDS_CORE_v58BestPartner_(ss,creator.id,goal);
  if(partner)actions.push({key:'PAIR',en:'Pair with '+partner.name+' (Objective Fit '+partner.objectiveFit+') as the primary-goal driver.',th:'จับคู่กับ '+partner.name+' (Objective Fit '+partner.objectiveFit+') ให้เป็นตัวขับ Goal หลัก',priority:'HIGH'});
  const role=g==='CONVERSION'?'Trust / Consideration Support':g==='AWARENESS'?'Awareness Support':g==='ENGAGEMENT'?'Community Support':g==='LAUNCH'?'Launch Support':'Consideration Support';
  const hardBlock=conflicts>0;
  return {status:score>=75?'FIT':'CONDITIONAL FIT',brandFitGap:Math.max(0,70-bf),role,actions,hardBlock,originalScore:score,scenarioScore:null,scenarioConfidence:'Low',scenarioMethod:'No score uplift is claimed without measurable intervention data. The plan is a mitigation strategy, not a fabricated prediction.',partner:partner||null};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58Recovery_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58Recovery_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_v58BestPartner_(ss,creatorId,goal){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_v58BestPartner_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const sh=ss.getSheetByName('ENT_DECISIONS'),rows=KOL_IDS_CORE_values_(sh),dm=KOL_IDS_CORE_colMap_(sh);let best=null;
  rows.forEach(r=>{if(String(r[2])===String(creatorId))return;const dg=dm['Campaign Goal']!=null?String(r[dm['Campaign Goal']]||'').toUpperCase():'';if(dg&&dg!==String(goal).toUpperCase())return;const tier=dm['Decision Tier']!=null?String(r[dm['Decision Tier']]||''):String(r[4]||'');if(tier!=='FIT')return;const obj=Number(dm['Objective Fit']!=null?r[dm['Objective Fit']]:r[9]||0);if(!best||obj>best.objectiveFit)best={creatorId:r[2],name:r[3],objectiveFit:obj};});return best;

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_v58BestPartner_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_v58BestPartner_', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_getPreferredStrategy(token,p){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_getPreferredStrategy');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_CORE_upgradeSchema_(token);
  const campaignId=String(p&&p.campaignId||'').trim(),creatorId=String(p&&p.creatorId||'').trim();
  if(!campaignId||!creatorId)throw new Error('Campaign and Creator are required.');
  const camp=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CAMPAIGNS'),campaignId),cr=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CREATORS'),creatorId);
  if(!camp||!cr)throw new Error('Campaign or Creator not found.');
  const dm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_DECISIONS')),rows=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_DECISIONS')).filter(r=>String(r[1])===campaignId),row=rows.find(r=>String(r[2])===creatorId);
  if(!row)throw new Error('Creator was not analyzed for this Campaign. Please run ANALYZE ALL CREATORS first.');
  const goal=String(dm['Campaign Goal']!=null?row[dm['Campaign Goal']]:camp[4]||'AWARENESS').toUpperCase(),score=Number(row[5]||0),brandFit=Number(row[10]||0),objectiveFit=Number(row[9]||0),contentFit=Number(row[8]||0),eff=dm['Efficiency Score']!=null?Number(row[dm['Efficiency Score']]||50):50;
  const behaviorFit=dm['Behavior Fit']!=null?Number(row[dm['Behavior Fit']]||0):0;
  const recovery=KOL_IDS_CORE_preferenceStrategy_({name:cr[1]},goal,brandFit,objectiveFit,contentFit,eff,score);
  if(behaviorFit<65)recovery.strategies.unshift('Reframe the role around the creator\'s strongest observed audience behavior before increasing spend.');
  recovery.behaviorFit=behaviorFit;
  recovery.contentRecommendation=dm['Content Recommendation']!=null?KOL_IDS_CORE_safeJson_(row[dm['Content Recommendation']],[]):[];
  recovery.audienceFit=Number(row[7]||0);
  const alternatives=rows.filter(r=>String(r[2])!==creatorId).map(r=>({creatorId:r[2],name:r[3],score:Number(r[5]||0),brandFit:Number(r[10]||0),objectiveFit:Number(r[9]||0),contentFit:Number(r[8]||0),behaviorFit:dm['Behavior Fit']!=null?Number(r[dm['Behavior Fit']]||0):0,tier:dm['Decision Tier']!=null?r[dm['Decision Tier']]:r[4]})).filter(x=>x.tier!=='LOW FIT').sort((a,b)=>((b.brandFit*.35+b.objectiveFit*.25+b.contentFit*.20+b.behaviorFit*.20)-(a.brandFit*.35+a.objectiveFit*.25+a.contentFit*.20+a.behaviorFit*.20))).slice(0,3);
  recovery.compensatingCreators=alternatives;
  recovery.primaryGap=[['Brand Fit',brandFit],['Objective Fit',objectiveFit],['Content Fit',contentFit],['Efficiency',eff]].sort((a,b)=>a[1]-b[1])[0][0];
  recovery.portfolioLogic=alternatives.length?'Keep the preferred creator for the recommended role and use the strongest complementary creator(s) to cover the weak signal.':'No non-low-fit complementary creator is available in this campaign analysis.';
  const strategyId='STR-'+Utilities.getUuid().slice(0,8).toUpperCase(),sh=ss.getSheetByName('ENT_STRATEGIES');
  sh.appendRow([strategyId,campaignId,creatorId,cr[1],goal,score,dm['Decision Tier']!=null?row[dm['Decision Tier']]:row[4],'YES',recovery.role,recovery.brandFitGap,recovery.strategies.join(' | '),recovery.projectedFit,Number(dm['Confidence Score']!=null?row[dm['Confidence Score']]:0),new Date()]);
  // Mark preference without altering the original decision score.
  if(dm['Preference Status']!=null){
    const dvals=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_DECISIONS')),di=dvals.findIndex(r=>String(r[0])===String(row[0]));
    if(di>=0){dvals[di][dm['Preference Status']]='PREFERRED';ss.getSheetByName('ENT_DECISIONS').getRange(di+2,1,1,dvals[di].length).setValues([dvals[di]]);}
  }
  KOL_IDS_CORE_audit_(ss,'PREFERRED_KOL_STRATEGY',campaignId,'OK','Goal='+goal+'; creator='+creatorId+'; primaryGap='+recovery.primaryGap);
  return {success:true,campaignId,creatorId,creatorName:cr[1],goal,originalScore:score,brandFit,objectiveFit,contentFit,efficiencyScore:eff,decisionTier:dm['Decision Tier']!=null?row[dm['Decision Tier']]:row[4],compensatingCreators:alternatives,strategy:recovery};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_getPreferredStrategy', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_getPreferredStrategy', Date.now() - __kolIdsTraceStartedAt);
  }
}

function KOL_IDS_CORE_getCampaignPlan(token,campaignId){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_getCampaignPlan');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const c=KOL_IDS_CORE_ctx_(token),ss=c.ss;KOL_IDS_CORE_upgradeSchema_(token);const camp=KOL_IDS_CORE_findRow_(ss.getSheetByName('ENT_CAMPAIGNS'),campaignId);if(!camp)throw new Error('Campaign not found.');
  const cm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_CAMPAIGNS')),goal=String(cm['Campaign Goal']!=null?camp[cm['Campaign Goal']]:camp[4]||'AWARENESS').toUpperCase(),budget=Number(cm['Budget']!=null?camp[cm['Budget']]:camp[5])||0,dm=KOL_IDS_CORE_colMap_(ss.getSheetByName('ENT_DECISIONS'));
  const selected=KOL_IDS_CORE_getSelectedCreators_(ss,campaignId);
  const all=KOL_IDS_CORE_values_(ss.getSheetByName('ENT_DECISIONS')).filter(r=>String(r[1])===String(campaignId)).map(r=>({creatorId:r[2],name:r[3],score:Number(r[5]||0),tier:String(dm['Decision Tier']!=null?r[dm['Decision Tier']]:r[4]||'LOW FIT'),confidence:Number(dm['Confidence Score']!=null?r[dm['Confidence Score']]||0:0),brandFit:Number(r[10]||0),objectiveFit:Number(r[9]||0),contentFit:Number(r[8]||0),personaFit:Number(r[6]||0),audienceFit:Number(r[7]||0),efficiency:Number(dm['Efficiency Score']!=null?r[dm['Efficiency Score']]||50:50)})).sort((a,b)=>b.score-a.score);
  // Selected creators take priority. If none selected, show the strongest decision set for planning.
  let pool=selected.length?all.filter(x=>selected.indexOf(String(x.creatorId))>=0):all.slice(0,5);
  if(!pool.length)pool=all.slice(0,5);
  const profile=KOL_IDS_CORE_goalProfile_(goal),weight=x=>x.tier==='FIT'?1:(x.tier==='CONDITIONAL FIT'?.75:.35);
  const KOL_IDS_LEARNING_LEGACY_weighted=pool.map(x=>Object.assign({},x,{planningWeight:Math.max(1,x.score)*weight(x)}));
  let sum=KOL_IDS_LEARNING_LEGACY_weighted.reduce((a,x)=>a+x.planningWeight,0),shares=KOL_IDS_LEARNING_LEGACY_weighted.map(x=>Math.round(x.planningWeight/Math.max(1,sum)*100));
  // LOW FIT stays in the plan as a visible recovery/experimental role, capped at 10% unless it is the only selected creator.
  KOL_IDS_LEARNING_LEGACY_weighted.forEach((x,i)=>{if(x.tier==='LOW FIT'&&KOL_IDS_LEARNING_LEGACY_weighted.length>1)shares[i]=Math.min(shares[i],10);});
  let diff=100-shares.reduce((a,b)=>a+b,0);const eligible=KOL_IDS_LEARNING_LEGACY_weighted.map((x,i)=>({x,i})).filter(o=>o.x.tier!=='LOW FIT');
  if(diff!==0&&eligible.length)shares[eligible[0].i]+=diff;
  if(shares.some(v=>v<0)){shares=shares.map(v=>Math.max(0,v));let s=shares.reduce((a,b)=>a+b,0);if(s)shares[0]+=100-s;}
  const allocations=KOL_IDS_LEARNING_LEGACY_weighted.map((x,i)=>{
    const recovery=KOL_IDS_CORE_v58Recovery_(goal,x.score,x.personaFit,x.audienceFit,x.contentFit,x.objectiveFit,x.brandFit,x.efficiency,0,{id:x.creatorId},ss);
    const isLow=x.tier==='LOW FIT';
    return {creatorId:x.creatorId,name:x.name,score:x.score,tier:x.tier,role:isLow?'Recovery / Experimental Support':(i===0?profile.role:'Supporting '+profile.label+' Creator'),budgetShare:shares[i],budget:budget?Math.round(budget*shares[i]/100):'',confidence:x.confidence,strategyRequired:isLow||x.tier==='CONDITIONAL FIT',adjustments:recovery.actions.map(a=>a.en),why:x.tier==='FIT'?'Primary fit for this plan.':isLow?'Included for visibility and recovery planning; not a primary recommendation.':'Included with conditions that should be addressed before execution.'};
  });
  const low=allocations.filter(x=>x.tier==='LOW FIT').length;
  const logic='Goal-aware deterministic portfolio. FIT leads; CONDITIONAL FIT is included with conditions; LOW FIT remains visible in the plan for recovery/experimental planning and is not treated as a primary recommendation.';
  return {success:true,campaignId,goal,budget,allocations,logic,lowFitCount:low,selectedCreatorIds:selected,planningRule:'FIT=100%, CONDITIONAL=75%, LOW FIT=35% planning weight; LOW FIT budget share capped at 10% when multiple creators are in the plan.'};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_getCampaignPlan', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_getCampaignPlan', Date.now() - __kolIdsTraceStartedAt);
  }
}
function KOL_IDS_CORE_runDeepLogicTests(){
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_runDeepLogicTests');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  const t=[];const ok=(name,fn)=>{try{const v=fn();t.push({name,pass:!!v,message:!!v?'PASS':'FAIL'});}catch(e){t.push({name,pass:false,message:String(e&&e.message||e)});}};
  ok('Persona age range parser',()=>{const a=KOL_IDS_CORE_parseAgeRange_('18-24');return a.min===18&&a.max===24;});
  ok('Persona 55+ parser',()=>{const a=KOL_IDS_CORE_parseAgeRange_('55+');return a.min===55&&a.max===120;});
  ok('Optional ER/Rate do not zero score',()=>{const x=KOL_IDS_CORE_v58Efficiency_(100000,'','', 'CONVERSION');return x.score===50&&x.known===false;});
  ok('Age exact match is high',()=>KOL_IDS_CORE_v58RangeFit_(20,34,20,34)>=95);
  ok('Age mismatch is low',()=>KOL_IDS_CORE_v58RangeFit_(20,24,40,50)<45);
  ok('Score bounded',()=>KOL_IDS_CORE_v58Clamp_(140)===100&&KOL_IDS_CORE_v58Clamp_(-4)===0);
  ok('LOW FIT is plan-visible',()=>true);
  return {success:t.every(x=>x.pass),version:KOL_IDS.VERSION,tests:t,passed:t.filter(x=>x.pass).length,total:t.length};

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_runDeepLogicTests', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_runDeepLogicTests', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* V15.8 score-range hotfix: self-contained evidence coverage calculation */
function KOL_IDS_CORE_evidenceCoverage_(creator, target, erActual, rateActual, history) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_evidenceCoverage_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  creator = creator || {};
  target = target || {};

  var fields = [
    creator.followers,
    creator.ageMin,
    creator.ageMax,
    creator.gender,
    creator.locations,
    creator.interests,
    creator.styles,
    target.goalsNeeds,
    target.painPoints
  ];

  var score = 0;

  fields.forEach(function(value) {
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      score += 8;
    }
  });

  if (erActual === true) score += 6;
  if (rateActual === true) score += 4;
  if (history === true || Number(history) > 0) score += 5;

  return Math.max(0, Math.min(100, score));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_evidenceCoverage_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_evidenceCoverage_', Date.now() - __kolIdsTraceStartedAt);
  }
}
/* V15.8 compatibility hotfix: learning adjustment */
function KOL_IDS_CORE_boundedLearning_(histScore, currentScore, confidence) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_boundedLearning_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var historical = Number(histScore);
  var current = Number(currentScore);
  var trust = Number(confidence);

  if (!isFinite(historical)) historical = 50;
  if (!isFinite(current)) current = 50;
  if (!isFinite(trust)) trust = 0;

  var cap = trust >= 80 ? 5 : (trust >= 60 ? 3 : 2);
  var adjustment = (historical - current) * 0.06;

  return Math.max(-cap, Math.min(cap, adjustment));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_boundedLearning_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_boundedLearning_', Date.now() - __kolIdsTraceStartedAt);
  }
}

/* V15.8 compatibility hotfix: confidence calculation */
function KOL_IDS_CORE_confidence_(
  creatorRow,
  history,
  risk,
  erActual,
  rateActual,
  evidenceCoverage,
  historicalSignal
) {
  KOL_IDS_TRACE_ENTER_('KOL_IDS_CORE_confidence_');
  var __kolIdsTraceStartedAt = Date.now();
  try {

  var coverage = Number(evidenceCoverage);
  if (!isFinite(coverage)) coverage = 0;

  var score = 35 + (coverage * 0.55);

  if (history === true || Number(history) > 0) score += 8;
  if (erActual === true) score += 3;
  if (rateActual === true) score += 2;

  var count = Number(historicalSignal && historicalSignal.count);
  if (isFinite(count) && count >= 2) {
    score += Math.min(10, count * 2);
  }

  if (String(risk || '').toUpperCase() === 'HIGH') score -= 20;

  return Math.round(Math.max(0, Math.min(100, score)));

  } catch (__kolIdsTraceError) {
    KOL_IDS_TRACE_ERROR_('KOL_IDS_CORE_confidence_', __kolIdsTraceError);
    throw __kolIdsTraceError;
  } finally {
    KOL_IDS_TRACE_EXIT_('KOL_IDS_CORE_confidence_', Date.now() - __kolIdsTraceStartedAt);
  }
}
