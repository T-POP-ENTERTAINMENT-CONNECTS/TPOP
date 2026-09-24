/**
 * KOL IDS™ — Google Form Payment Proof + One-Click Email Approval
 *
 * This module is intentionally independent from the main Apps Script UI.
 * Deploy this file as a small Google Apps Script Web App.
 *
 * Flow:
 *   Customer creates paid KOL IDS account
 *   -> submits payment proof Google Form
 *   -> admin receives email with APPROVE / REJECT buttons
 *   -> button opens this Web App
 *   -> Web App validates a short-lived HMAC token
 *   -> calls Supabase payment-approval Edge Function
 *   -> customer subscription becomes active (or order is rejected)
 *   -> customer receives confirmation email
 *
 * Required Script Properties:
 *   KOL_IDS_SUPABASE_URL
 *   KOL_IDS_PAYMENT_APPROVAL_SECRET
 *   KOL_IDS_PAYMENT_ADMIN_EMAIL
 *
 * First run:
 *   KOL_IDS_PAYMENT_SETUP()
 * Then deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * IMPORTANT:
 *   No Supabase service-role key is stored here. The Edge Function owns
 *   the privileged database operation.
 */

const KOL_IDS_PAYMENT_CFG = Object.freeze({
  SUPABASE_URL: 'KOL_IDS_SUPABASE_URL',
  SECRET: 'KOL_IDS_PAYMENT_APPROVAL_SECRET',
  ADMIN_EMAIL: 'KOL_IDS_PAYMENT_ADMIN_EMAIL',
  FORM_ID: 'KOL_IDS_PAYMENT_FORM_ID',
  FORM_URL: 'KOL_IDS_PAYMENT_FORM_URL',
  WEB_APP_URL: 'KOL_IDS_PAYMENT_WEB_APP_URL',
  CURRENCY: 'THB'
});

function KOL_IDS_PAYMENT_SETUP() {
  const props = PropertiesService.getScriptProperties();
  const admin = String(props.getProperty(KOL_IDS_PAYMENT_CFG.ADMIN_EMAIL) || Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  if (!admin) throw new Error('Set KOL_IDS_PAYMENT_ADMIN_EMAIL first.');
  props.setProperty(KOL_IDS_PAYMENT_CFG.ADMIN_EMAIL, admin);

  const supabaseUrl = String(props.getProperty(KOL_IDS_PAYMENT_CFG.SUPABASE_URL) || '').trim();
  if (!supabaseUrl) throw new Error('Set KOL_IDS_SUPABASE_URL first.');
  if (!props.getProperty(KOL_IDS_PAYMENT_CFG.SECRET)) {
    props.setProperty(KOL_IDS_PAYMENT_CFG.SECRET, Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''));
  }

  let form = null;
  const existingId = String(props.getProperty(KOL_IDS_PAYMENT_CFG.FORM_ID) || '').trim();
  if (existingId) { try { form = FormApp.openById(existingId); } catch (e) {} }
  if (!form) {
    form = FormApp.create('KOL IDS — Payment Proof / Payment Confirmation');
    form.setDescription(
      'KOL IDS™ paid-plan payment confirmation.\n\n' +
      'กรุณากรอก Order Number ให้ตรงกับคำสั่งซื้อ และแนบรายละเอียดการโอน/หลักฐานการชำระเงินให้ทีมตรวจสอบ\n\n' +
      'หลังตรวจสอบแล้ว ระบบจะส่งผลการอนุมัติไปยังอีเมลของผู้สั่งซื้อ'
    );
    form.addTextItem().setTitle('Order Number').setRequired(true);
    form.addTextItem().setTitle('Customer Email').setRequired(true);
    form.addTextItem().setTitle('Customer Name').setRequired(true);
    form.addTextItem().setTitle('Plan').setRequired(true);
    form.addTextItem().setTitle('Amount (THB)').setRequired(true);
    form.addTextItem().setTitle('Transfer Date / Time').setRequired(true);
    form.addTextItem().setTitle('Bank / Transfer Reference').setRequired(false);
    form.addTextItem().setTitle('Payment Slip URL').setRequired(false);
    form.addParagraphTextItem().setTitle('Customer Note').setRequired(false);
    props.setProperty(KOL_IDS_PAYMENT_CFG.FORM_ID, form.getId());
    props.setProperty(KOL_IDS_PAYMENT_CFG.FORM_URL, form.getPublishedUrl());
  }

  // Remove duplicate triggers for this handler, then create exactly one.
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'KOL_IDS_PAYMENT_onFormSubmit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('KOL_IDS_PAYMENT_onFormSubmit').forForm(form).onFormSubmit().create();

  const web = ScriptApp.getService().getUrl() || '';
  if (web) props.setProperty(KOL_IDS_PAYMENT_CFG.WEB_APP_URL, web);

  return {
    ok: true,
    admin_email: admin,
    payment_form_url: form.getPublishedUrl(),
    web_app_url: web,
    next: 'Deploy this Apps Script as a Web App, then run KOL_IDS_PAYMENT_SETUP() again so the Web App URL is stored.'
  };
}

function KOL_IDS_PAYMENT_onFormSubmit(e) {
  if (!e || !e.response) throw new Error('Form submit event is required.');
  const answers = {};
  e.response.getItemResponses().forEach(r => {
    answers[String(r.getItem().getTitle()).trim()] = String(r.getResponse() || '').trim();
  });

  const orderNumber = answers['Order Number'];
  const email = String(answers['Customer Email'] || '').trim().toLowerCase();
  const name = answers['Customer Name'] || '';
  const plan = answers['Plan'] || '';
  const amount = answers['Amount (THB)'] || '';
  const slip = answers['Payment Slip URL'] || '';
  if (!orderNumber || !email) throw new Error('Order Number and Customer Email are required.');

  const approveUrl = KOL_IDS_PAYMENT_actionUrl_(orderNumber, 'approve');
  const rejectUrl = KOL_IDS_PAYMENT_actionUrl_(orderNumber, 'reject');
  const admin = KOL_IDS_PAYMENT_requireProp_(KOL_IDS_PAYMENT_CFG.ADMIN_EMAIL);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#24181d">
      <h2>KOL IDS™ — Payment proof received</h2>
      <p>A customer submitted payment proof and the order is waiting for review.</p>
      <table cellpadding="7" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td><b>Order</b></td><td>${KOL_IDS_PAYMENT_esc_(orderNumber)}</td></tr>
        <tr><td><b>Customer</b></td><td>${KOL_IDS_PAYMENT_esc_(name)}</td></tr>
        <tr><td><b>Email</b></td><td>${KOL_IDS_PAYMENT_esc_(email)}</td></tr>
        <tr><td><b>Plan</b></td><td>${KOL_IDS_PAYMENT_esc_(plan)}</td></tr>
        <tr><td><b>Amount</b></td><td>${KOL_IDS_PAYMENT_esc_(amount)} THB</td></tr>
        <tr><td><b>Slip</b></td><td>${slip ? '<a href="' + KOL_IDS_PAYMENT_escAttr_(slip) + '">Open payment slip</a>' : 'Not provided'}</td></tr>
      </table>
      <p style="margin-top:24px">
        <a href="${approveUrl}" style="display:inline-block;background:#147a5a;color:#fff;text-decoration:none;padding:13px 20px;border-radius:9px;font-weight:700;margin-right:8px">APPROVE PAYMENT</a>
        <a href="${rejectUrl}" style="display:inline-block;background:#8a2634;color:#fff;text-decoration:none;padding:13px 20px;border-radius:9px;font-weight:700">REJECT</a>
      </p>
      <p style="font-size:12px;color:#777">Approval links expire automatically and can only be used for this order/action.</p>
    </div>`;

  MailApp.sendEmail({
    to: admin,
    subject: 'KOL IDS — Payment approval required: ' + orderNumber,
    htmlBody: html,
    body: 'Payment approval required for ' + orderNumber + '. Open the HTML email to approve or reject.'
  });
}

function doGet(e) {
  return KOL_IDS_PAYMENT_doGet_(e);
}

function KOL_IDS_PAYMENT_doGet_(e) {
  const p = (e && e.parameter) || {};
  const order = String(p.order || '').trim();
  const action = String(p.action || '').trim().toLowerCase();
  const exp = String(p.exp || '').trim();
  const sig = String(p.sig || '').trim();
  if (!order || !['approve','reject'].includes(action) || !exp || !sig) {
    return KOL_IDS_PAYMENT_page_('Invalid approval link.', false);
  }
  const n = Number(exp);
  if (!isFinite(n) || Date.now() > n) return KOL_IDS_PAYMENT_page_('This approval link has expired. Submit a new payment review request.', false);

  const secret = KOL_IDS_PAYMENT_requireProp_(KOL_IDS_PAYMENT_CFG.SECRET);
  const expected = KOL_IDS_PAYMENT_hmac_(secret, [order, action, exp].join('|'));
  if (!KOL_IDS_PAYMENT_equal_(expected, sig)) return KOL_IDS_PAYMENT_page_('Invalid approval link.', false);

  try {
    const url = KOL_IDS_PAYMENT_requireProp_(KOL_IDS_PAYMENT_CFG.SUPABASE_URL).replace(/\/$/, '') + '/functions/v1/payment-approval';
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      headers: {'x-kol-ids-approval-secret': secret},
      payload: JSON.stringify({order_number: order, action: action})
    });
    const code = response.getResponseCode();
    const body = JSON.parse(response.getContentText() || '{}');
    if (code < 200 || code >= 300 || !body.ok) {
      return KOL_IDS_PAYMENT_page_(body.error || 'The payment action could not be completed.', false);
    }

    const customerEmail = String(body.customer_email || '').trim();
    const plan = String(body.plan_code || '').trim();
    const expires = String(body.expires_at || '').trim();
    if (customerEmail) {
      if (action === 'approve') {
        MailApp.sendEmail({
          to: customerEmail,
          subject: 'KOL IDS — Payment approved / workspace access activated',
          htmlBody: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><h2>Payment approved</h2><p>Your KOL IDS account is now active.</p><p><b>Plan:</b> ${KOL_IDS_PAYMENT_esc_(plan)}<br><b>Access expires:</b> ${KOL_IDS_PAYMENT_esc_(expires)}</p><p>You can sign in with the same email and password you used when creating the account.</p><p><a href="https://tpopconnects.com/KOLIDS.html">Open KOL IDS</a></p></div>`,
          body: 'Your KOL IDS payment was approved and your workspace is active. Sign in at https://tpopconnects.com/KOLIDS.html'
        });
      } else {
        MailApp.sendEmail({
          to: customerEmail,
          subject: 'KOL IDS — Payment review requires attention',
          htmlBody: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><h2>Payment review update</h2><p>Your order was not approved from this payment review. Your account and submitted campaign data remain in the system. Please contact support if you need to resubmit payment proof.</p></div>`,
          body: 'Your KOL IDS payment review was not approved. Your account and submitted data remain in the system. Contact support to resubmit proof.'
        });
      }
    }
    return KOL_IDS_PAYMENT_page_(action === 'approve' ? 'Payment approved. Customer access is now active.' : 'Payment rejected. The customer remains locked until a valid payment is approved.', true);
  } catch (err) {
    return KOL_IDS_PAYMENT_page_(String(err && err.message || err), false);
  }
}

function KOL_IDS_PAYMENT_actionUrl_(orderNumber, action) {
  const base = KOL_IDS_PAYMENT_requireProp_(KOL_IDS_PAYMENT_CFG.WEB_APP_URL);
  const exp = String(Date.now() + 24 * 60 * 60 * 1000);
  const secret = KOL_IDS_PAYMENT_requireProp_(KOL_IDS_PAYMENT_CFG.SECRET);
  const sig = KOL_IDS_PAYMENT_hmac_(secret, [orderNumber, action, exp].join('|'));
  return base + '?order=' + encodeURIComponent(orderNumber) + '&action=' + encodeURIComponent(action) + '&exp=' + encodeURIComponent(exp) + '&sig=' + encodeURIComponent(sig);
}

function KOL_IDS_PAYMENT_hmac_(secret, value) {
  const bytes = Utilities.computeHmacSha256Signature(value, secret);
  return bytes.map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

function KOL_IDS_PAYMENT_equal_(a,b) {
  a=String(a); b=String(b);
  if(a.length!==b.length) return false;
  let x=0; for(let i=0;i<a.length;i++) x |= a.charCodeAt(i)^b.charCodeAt(i);
  return x===0;
}

function KOL_IDS_PAYMENT_requireProp_(key) {
  const v=String(PropertiesService.getScriptProperties().getProperty(key)||'').trim();
  if(!v) throw new Error('Missing Script Property: '+key);
  return v;
}

function KOL_IDS_PAYMENT_page_(message, ok) {
  const title=ok?'KOL IDS — Completed':'KOL IDS — Action unavailable';
  const color=ok?'#147a5a':'#8a2634';
  return HtmlService.createHtmlOutput(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#f7f9fa;font-family:Arial,sans-serif;color:#24181d"><main style="max-width:640px;margin:10vh auto;padding:32px;background:#fff;border:1px solid #e5e1e3;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.08)"><div style="font-size:11px;letter-spacing:.16em;color:${color};font-weight:800">KOL IDS™</div><h1 style="font-size:30px">${KOL_IDS_PAYMENT_esc_(message)}</h1><p style="color:#6f7d83">You can close this window.</p></main></body></html>`).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function KOL_IDS_PAYMENT_esc_(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function KOL_IDS_PAYMENT_escAttr_(v){return KOL_IDS_PAYMENT_esc_(v).replace(/javascript:/gi,'');}
