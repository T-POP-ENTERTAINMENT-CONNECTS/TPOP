/**
 * KOL IDS™ — PUBLIC WEBSITE CONTACT
 *
 * Public, narrowly scoped endpoint used by the T POP CONNECTS website contact modal.
 * It sends a notification to the configured KOL_IDS administrator email.
 * No authenticated workspace/API data is returned or exposed by this endpoint.
 */
function KOL_IDS_PUBLIC_CONTACT_submit_(payload) {
  payload = payload || {};
  var name = String(payload.name || '').trim();
  var email = String(payload.email || '').trim().toLowerCase();
  var company = String(payload.company || '').trim();
  var topic = String(payload.topic || '').trim();
  var other = String(payload.other || '').trim();
  var message = String(payload.message || '').trim();
  var source = String(payload.source || '').trim();

  if (!name || name.length > 160) throw new Error('Please provide a valid name.');
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please provide a valid email address.');
  if (company.length > 200) throw new Error('Company name is too long.');
  if (message.length < 2 || message.length > 5000) throw new Error('Please provide a message up to 5,000 characters.');
  if (['Partnership','Entertainment','Business','Technology','Other'].indexOf(topic) < 0) throw new Error('Please select a valid contact topic.');
  if (topic === 'Other' && (!other || other.length > 500)) throw new Error('Please tell us what you need.');

  // Lightweight duplicate/rate guard by sender email.
  var cache = CacheService.getScriptCache();
  var rateKey = 'public_contact_' + Utilities.base64EncodeWebSafe(email).slice(0, 80);
  if (cache.get(rateKey)) throw new Error('Please wait a moment before sending another message.');
  cache.put(rateKey, '1', 60);

  var props = PropertiesService.getScriptProperties();
  var adminKey = (typeof KOL_IDS !== 'undefined' && KOL_IDS.ADMIN_EMAIL) ? KOL_IDS.ADMIN_EMAIL : 'KOL_IDS_ADMIN_EMAIL_V5';
  var admin = String(props.getProperty(adminKey) || '').trim().toLowerCase();
  if (!admin) admin = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  if (!admin) throw new Error('Contact notification email is not configured.');

  var topicLine = topic === 'Other' ? 'Other — ' + other : topic;
  var now = new Date();
  var tz = Session.getScriptTimeZone() || 'Asia/Bangkok';
  var submittedAt = Utilities.formatDate(now, tz, 'dd MMM yyyy, HH:mm');
  var subject = '[T POP CONNECTS] New Contact — ' + topicLine;
  var body = [
    'NEW CONTACT REQUEST',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Company / Organization: ' + (company || '-'),
    'Topic: ' + topicLine,
    '',
    'Message:',
    message,
    '',
    'Submitted: ' + submittedAt,
    'Source: ' + (source || '-')
  ].join('\n');

  var html = '<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#1f1720">' +
    '<h2 style="margin-bottom:20px">New contact request</h2>' +
    '<p><b>Name:</b> ' + KOL_IDS_PUBLIC_CONTACT_escape_(name) + '</p>' +
    '<p><b>Email:</b> ' + KOL_IDS_PUBLIC_CONTACT_escape_(email) + '</p>' +
    '<p><b>Company / Organization:</b> ' + KOL_IDS_PUBLIC_CONTACT_escape_(company || '-') + '</p>' +
    '<p><b>Topic:</b> ' + KOL_IDS_PUBLIC_CONTACT_escape_(topicLine) + '</p>' +
    '<div style="margin:22px 0;padding:16px;border-left:4px solid #aeefff;background:#f7fbfc;white-space:pre-wrap"><b>Message</b><br>' + KOL_IDS_PUBLIC_CONTACT_escape_(message) + '</div>' +
    '<p style="color:#716a70;font-size:12px">Submitted: ' + KOL_IDS_PUBLIC_CONTACT_escape_(submittedAt) + '<br>Source: ' + KOL_IDS_PUBLIC_CONTACT_escape_(source || '-') + '</p>' +
    '</div>';

  MailApp.sendEmail({to: admin, replyTo: email, subject: subject, body: body, htmlBody: html});
  return {success:true, status:'SENT'};
}

function KOL_IDS_PUBLIC_CONTACT_escape_(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}
