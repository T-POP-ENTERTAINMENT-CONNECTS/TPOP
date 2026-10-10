(function(){
'use strict';
// KOL IDS FINAL HARD ROUTE · CREATOR INTELLIGENCE INTERACTION FIX · 2026-10-01
if(window.__KOL_IDS_RUNTIME_VERSION__ && window.__KOL_IDS_RUNTIME_VERSION__ !== 'V36.7-FINAL-COMPLETION-PREMIUM'){
  // A stale runtime may already be on the page. Clear its mount and let this release own the workspace.
  const stale=document.getElementById('app');
  if(stale) stale.innerHTML='';
}
if(window.__KOL_IDS_RUNTIME_STARTED__) return;
window.__KOL_IDS_RUNTIME_STARTED__='V36.7-FINAL-COMPLETION-PREMIUM';
window.__KOL_IDS_RUNTIME_VERSION__='V36.7-FINAL-COMPLETION-PREMIUM';
const C=window.KOL_IDS_CONFIG||{},root=document.getElementById('app');
let sb=null;
const S={session:null,org:null,membership:null,plan:null,subscription:null,access:false,accessReason:null,page:0,campaigns:[],audiences:[],creators:[],decisions:[],reviews:[],impacts:[],selectedCampaign:null,selectedAudience:null,analysis:null,engineRuns:[],portfolioRuns:[],performance:[],predictions:[],creatorBatch:[],creatorEditTarget:null,performanceEditTarget:null,audienceDraft:null,creatorFitAutoKey:null,creatorFitAutoBusy:false,localFitRows:[]};
const ready=C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&!String(C.SUPABASE_URL).includes('YOUR_');
if(ready&&window.supabase)sb=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const esc=x=>String(x??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const num=x=>{const raw=String(x??'').replace(/,/g,'').trim();return raw===''||Number.isNaN(Number(raw))?null:Number(raw)};
const money=x=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(x||0));
const hasValue=value=>value!==null&&value!==undefined&&value!=='';
const displayMetric=(value,hasData=hasValue(value))=>hasData?money(value):'Not recorded';
const hasNumeric=(rows,key)=>Array.isArray(rows)&&rows.some(x=>hasValue(x?.[key]));
const metricOrNot=(value,hasData=hasValue(value))=>hasData?money(value):'Not recorded';
const sumKnown=(rows,key)=>{const vals=(rows||[]).map(x=>num(x?.[key])).filter(v=>v!=null);return vals.length?vals.reduce((a,b)=>a+b,0):null};
const sumMetaKnown=(rows,key)=>{const vals=(rows||[]).map(x=>num(x?.metadata?.[key])).filter(v=>v!=null);return vals.length?vals.reduce((a,b)=>a+b,0):null};
const statusLabel=x=>x?.actual_score!=null?'Completed':'Pending';
const scoreState=x=>x?.actual_score!=null?`${Math.round(Number(x.actual_score))}/100`:'Pending';
const avgOutcomeScore=(rows)=>{const vals=(rows||[]).map(x=>x?.actual_score!=null?Number(x.actual_score):null).filter(Number.isFinite);return vals.length?clamp(vals.reduce((s,v)=>s+v,0)/vals.length):null;};
const formatNumericEntry=x=>{if(!x)return;const raw=String(x.value||'').replace(/,/g,'').trim();if(raw==='')return;const m=raw.match(/^(-?)(\d*)(?:\.(\d*))?$/);if(!m)return;const sign=m[1]||'',whole=(m[2]||'').replace(/^0+(?=\d)/,'')||'0',frac=m[3];x.value=sign+new Intl.NumberFormat('en-US',{useGrouping:true,maximumFractionDigits:0}).format(Number(whole))+(frac!==undefined?'.'+frac:'')};
const formatNumericTyping=x=>{if(!x)return;const raw=String(x.value||'').replace(/,/g,'');if(raw==='')return;const m=raw.match(/^(-?)(\d*)(?:\.(\d*))?$/);if(!m)return;const sign=m[1]||'',whole=m[2]||'',frac=m[3];if(!whole && frac===undefined)return;const grouped=whole?new Intl.NumberFormat('en-US',{useGrouping:true,maximumFractionDigits:0}).format(Number(whole)):'';x.value=sign+grouped+(frac!==undefined?'.'+frac:'');x.selectionStart=x.selectionEnd=x.value.length};
// Numeric fields show thousands separators live while typing; commas are stripped before saving/parsing.
if(!document.documentElement.dataset.kolNumberFormatBound){document.documentElement.dataset.kolNumberFormatBound='1';document.addEventListener('input',e=>{const x=e.target;if(x.matches('input[type=number],input[data-number-format]'))formatNumericTyping(x)});document.addEventListener('focusout',e=>{const x=e.target;if(x.matches('input[type=number],input[data-number-format]'))formatNumericEntry(x)});document.addEventListener('submit',e=>{e.target.querySelectorAll('input[type=number],input[data-number-format]').forEach(x=>x.value=String(x.value||'').replace(/,/g,''))},true);new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('input[data-number-format]'))formatNumericEntry(n);n.querySelectorAll?.('input[data-number-format]').forEach(formatNumericEntry)}}))).observe(document.body,{childList:true,subtree:true})}
const pct=x=>x==null||Number.isNaN(Number(x))?'·':`${Math.round(Number(x)*10)/10}%`;
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,Number(x)||0));
const avg=a=>a.length?a.reduce((s,x)=>s+Number(x||0),0)/a.length:null;
const ECOMMERCE_CHANNELS=['TikTok Shop','Shopee','Lazada','LINE SHOPPING','Shopify','WooCommerce','Amazon','Facebook / Instagram Shop','Brand Website','Other'];
const ecomChannelOptions=(selected=[])=>ECOMMERCE_CHANNELS.map(x=>`<label class="ecom-channel-option"><input type="checkbox" data-ecom-channel value="${esc(x)}" ${selected.includes(x)?'checked':''}><span>${esc(x)}</span></label>`).join('');
const creatorEcomChannels=x=>Array.isArray(x?.payload?.ecommerceChannels)?x.payload.ecommerceChannels:[];
function toast(m,type='info'){let e=document.getElementById('toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=m;e.className='kol-toast show '+type;clearTimeout(window.__kolToast);window.__kolToast=setTimeout(()=>e.className='kol-toast',3000)}
function styles(){if(document.getElementById('kol-app-style'))return;const s=document.createElement('style');s.id='kol-app-style';s.textContent=`
:root{--ink:#17171b;--ink2:#34343b;--muted:#77777f;--faint:#9c9ca4;--bg:#f5f6f8;--paper:#fff;--line:#e6e7eb;--cyan:#4fd7e8;--cyan2:#e3fbfe;--good:#148463;--warn:#a96b16;--danger:#b94d58;--violet:#8067e8;--shadow:0 18px 60px rgba(20,22,30,.07)}*{box-sizing:border-box}html,body,#app{min-height:100%;margin:0}body{background:radial-gradient(900px 520px at 85% -8%,rgba(79,215,232,.14),transparent 60%),linear-gradient(180deg,#fafbfc,#f3f4f6);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}button,input,textarea,select{font:inherit}button{cursor:pointer}.kol-shell{min-height:100vh}.kol-side{width:278px;background:#141417;color:#fff;position:fixed;inset:0 auto 0 0;padding:22px 15px;display:flex;flex-direction:column;z-index:20}.kol-brand{display:flex;align-items:center;gap:12px;padding:6px 11px 26px}.kol-logo{width:39px;height:39px;border-radius:12px;background:linear-gradient(145deg,#f4ffff,#4fd7e8);box-shadow:0 9px 28px rgba(79,215,232,.25);position:relative}.kol-logo:after{content:"";position:absolute;inset:10px;border-radius:6px;background:#fff9}.kol-brand b{font-size:17px;letter-spacing:-.04em}.kol-brand small{display:block;color:#898991;font-size:8px;letter-spacing:.16em;margin-top:4px}.kol-nav{display:grid;gap:3px}.nav-group{margin:13px 9px 6px;color:#77777f;font-size:8px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.kol-nav button{border:1px solid transparent;background:transparent;color:#aaaab2;padding:11px 12px;border-radius:10px;text-align:left;display:flex;gap:11px;align-items:center;font-size:11px;font-weight:800}.kol-nav button:hover{background:#1d1d21;color:#fff}.kol-nav button.active{background:linear-gradient(90deg,rgba(79,215,232,.18),rgba(79,215,232,.05));border-color:rgba(79,215,232,.2);color:#fff}.nav-icon{width:23px;height:23px;border-radius:7px;background:#202025;display:grid;place-items:center;font-size:9px;color:#9b9ba4}.active .nav-icon{background:var(--cyan);color:#132a2e}.side-spacer{flex:1}.side-foot{border:1px solid #2b2b31;background:#1a1a1e;border-radius:14px;padding:12px}.side-foot .org{font-size:11px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.side-foot .meta{font-size:9px;color:#85858e;margin-top:4px}.side-actions{display:flex;gap:7px;margin-top:11px}.side-actions button{flex:1;background:#24242a;border:1px solid #33333a;color:#ddd;border-radius:8px;padding:7px;font-size:9px;font-weight:850}.kol-main{margin-left:278px;min-height:100vh}.kol-top{height:88px;position:sticky;top:0;z-index:10;background:#fff!important;background-color:rgb(255 255 255)!important;background-image:none!important;opacity:1!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;mix-blend-mode:normal!important;box-shadow:0 1px 0 rgba(20,22,30,.04);border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;padding:0 40px}.eyebrow{font-size:8px;color:#9898a1;font-weight:900;letter-spacing:.18em}.kol-top h1{margin:5px 0 0;font-size:25px;letter-spacing:-.05em}.kol-top p{margin:5px 0 0;color:var(--muted);font-size:11px}.top-actions{display:flex;gap:8px;align-items:center}.top-chip{border:1px solid var(--line);background:#fff;padding:8px 10px;border-radius:9px;font-size:9px;font-weight:850;color:var(--muted)}.avatar{width:35px;height:35px;border-radius:11px;background:#17171b;color:#fff;display:grid;place-items:center;font-size:10px;font-weight:900}.kol-content{padding:30px 40px 80px;max-width:1540px}.hero{display:flex;justify-content:space-between;align-items:flex-end;gap:25px;margin-bottom:20px}.hero h2{font-size:31px;letter-spacing:-.055em;margin:3px 0 6px}.hero p{margin:0;color:var(--muted);font-size:12px}.hero-actions{display:flex;gap:8px;flex-wrap:wrap}.grid{display:grid;gap:14px}.g2{grid-template-columns:repeat(2,minmax(0,1fr))}.g3{grid-template-columns:repeat(3,minmax(0,1fr))}.g4{grid-template-columns:repeat(4,minmax(0,1fr))}.g5{grid-template-columns:repeat(5,minmax(0,1fr))}.card{background:rgba(255,255,255,.9);border:1px solid var(--line);border-radius:18px;padding:20px;box-shadow:0 8px 30px rgba(20,22,30,.04)}.dark-card{background:linear-gradient(135deg,#17171b,#29282f);color:#fff;border:0;box-shadow:0 25px 70px rgba(20,20,26,.16);position:relative;overflow:hidden}.dark-card:after{content:"";position:absolute;width:330px;height:330px;border-radius:50%;right:-140px;top:-170px;background:radial-gradient(circle,rgba(79,215,232,.2),transparent 67%)}.section-head{display:flex;justify-content:space-between;gap:15px;align-items:flex-start;margin-bottom:15px}.section-head h2,.section-head h3{margin:0;font-size:16px;letter-spacing:-.03em}.sub{font-size:10px;color:var(--muted);line-height:1.6}.dark-card .sub{color:#a9a9b2}.label{font-size:8px;text-transform:uppercase;letter-spacing:.14em;font-weight:900;color:var(--muted)}.dark-card .label{color:#8e8e97}.metric{padding:17px;border:1px solid var(--line);border-radius:14px;background:#fff;position:relative;overflow:hidden}.metric strong{display:block;font-size:28px;letter-spacing:-.05em;margin-top:8px}.metric small{display:block;color:var(--muted);font-size:9px;margin-top:7px}.metric .spark{position:absolute;right:12px;bottom:13px;font-size:10px;color:#8b8b93}.btn{border:1px solid #dadbe0;background:#fff;color:var(--ink);padding:10px 14px;border-radius:10px;font-size:10px;font-weight:900;transition:.16s}.btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(20,22,30,.08)}.btn.primary{background:#17171b;border-color:#17171b;color:#fff}.btn.cyan{background:var(--cyan);border-color:var(--cyan);color:#102c31}.btn.ghost{background:transparent}.btn.danger{color:var(--danger);border-color:#f0d4d7}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:15px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.field{display:grid;gap:6px}.field.full{grid-column:1/-1}.field label{font-size:9px;font-weight:900;color:#424249}.field input,.field textarea,.field select{width:100%;border:1px solid #dfe0e4;background:#fff;padding:11px 12px;border-radius:10px;outline:0;font-size:11px;color:var(--ink)}.field textarea{min-height:100px;resize:vertical}.field input:focus,.field textarea:focus,.field select:focus{border-color:var(--cyan);box-shadow:0 0 0 4px rgba(79,215,232,.12)}.required:after{content:" *";color:#d04c57}.hint{font-size:8px;color:#9a9aa2;line-height:1.5}.weight-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.weight-box{padding:10px;border:1px solid var(--line);border-radius:10px;background:#fafafa}.weight-box label{display:block;font-size:8px;font-weight:900;color:var(--muted);margin-bottom:5px}.weight-box input{width:100%;border:0;background:transparent;font-weight:900;font-size:15px;outline:0}.weight-total{font-size:10px;font-weight:900}.weight-total.ok{color:var(--good)}.weight-total.bad{color:var(--danger)}.signal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.signal-box{padding:14px;border:1px solid var(--line);border-radius:14px;background:#fbfbfc}.signal-box h4{margin:0 0 9px;font-size:10px}.chips{display:flex;gap:6px;flex-wrap:wrap}.chip{padding:6px 8px;border-radius:999px;border:1px solid #dfe1e5;background:#fff;font-size:9px;font-weight:850}.chip.selected{background:var(--cyan2);border-color:#b7edf3;color:#235d65}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:14px;background:#fff}table{width:100%;border-collapse:collapse;min-width:760px}th,td{text-align:left;padding:12px;border-bottom:1px solid #eef0f2;font-size:10px}th{font-size:8px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);background:#fafafa}tr:last-child td{border-bottom:0}.pill{display:inline-flex;padding:5px 8px;border-radius:999px;background:#f0f0f2;font-size:8px;font-weight:950}.pill.good{background:#e7f7f1;color:var(--good)}.pill.warn{background:#fff4df;color:var(--warn)}.pill.bad{background:#fff0f1;color:var(--danger)}.pill.cyan{background:var(--cyan2);color:#23606a}.workflow-page{max-width:1260px;margin:0 auto}.workflow-page .hero{margin-bottom:18px}.campaign-intake{background:#fff;border:1px solid #e4e6ea;border-radius:16px;padding:22px 24px;box-shadow:0 8px 28px rgba(20,22,30,.04)}.campaign-intake .section-title{font-size:10px;font-weight:950;letter-spacing:.08em;color:#315c73;text-transform:uppercase;margin-bottom:13px}.campaign-intake .section-title.red{color:#a85a5f}.campaign-intake .field{gap:6px}.campaign-intake .field label{font-size:9px;font-weight:850;color:#33373d}.campaign-intake .field input,.campaign-intake .field textarea,.campaign-intake .field select{min-height:39px;border-color:#dfe3e7;border-radius:8px;padding:9px 11px;font-size:10px;background:#fff}.campaign-intake .field textarea{min-height:76px}.campaign-intake .required-mark{font-size:7px;color:#b75b62;font-weight:950;text-transform:uppercase;letter-spacing:.08em;float:right}.campaign-intake .form-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:13px 16px}.campaign-intake .form-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.campaign-intake .field.full{grid-column:1/-1}.campaign-intake .objective-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}.campaign-intake .objective{display:flex;align-items:center;gap:7px;min-height:38px;padding:7px 9px;border:1px solid #e1e4e8;border-radius:8px;background:#fff;font-size:9px;font-weight:750;color:#4b5056}.campaign-intake .objective.selected{background:#eef9ff;border-color:#b8dce9;color:#244c5a}.campaign-intake .objective input{accent-color:#147ac0;width:13px;height:13px}.campaign-intake .selected-strip{margin-top:10px;padding:9px 11px;background:#f5f8fa;border:1px solid #e3e8ec;border-radius:8px;font-size:9px;color:#56616a}.campaign-intake .selected-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;background:#fff;border:1px solid #dce3e8;margin:3px 4px 0 0;font-weight:800}.campaign-intake .selected-chip button{border:0;background:none;color:#88929a;padding:0;font-size:12px;line-height:1}.campaign-intake .brand-grid{display:grid;grid-template-columns:1fr 1.15fr 1.15fr;gap:13px 16px}.campaign-intake .choice-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.campaign-intake .choice{display:flex;align-items:center;gap:7px;padding:8px 9px;border:1px solid #e1e4e8;border-radius:8px;background:#fff;font-size:9px}.campaign-intake .choice.selected{background:#f1f8f6;border-color:#c8e2d8}.campaign-intake .choice input{accent-color:#147a5a}.campaign-intake .message-list{display:grid;gap:7px}.campaign-intake .message-row{display:flex;gap:7px}.campaign-intake .message-row input{flex:1}.campaign-intake .icon-btn{width:38px;border:1px solid #e0e3e7;background:#fff;border-radius:8px;font-weight:900}.campaign-intake .bottom-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid #eceff1}.campaign-intake .bottom-actions .btn{min-height:40px;padding:0 17px}.workflow-side-note{font-size:9px;color:#7a8289;margin-top:10px;line-height:1.5}@media(max-width:1050px){.campaign-intake .form-grid,.campaign-intake .brand-grid{grid-template-columns:1fr 1fr}.campaign-intake .objective-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.campaign-intake{padding:16px}.campaign-intake .form-grid,.campaign-intake .form-grid.two,.campaign-intake .brand-grid{grid-template-columns:1fr}.campaign-intake .objective-grid,.campaign-intake .choice-grid{grid-template-columns:1fr 1fr}.campaign-intake .bottom-actions{justify-content:stretch}.campaign-intake .bottom-actions .btn{flex:1}.workflow-page{padding:0}}
.kol-side{width:250px;background:#fff;color:#25262a;border-right:1px solid #e3e6e9;padding:16px 10px;box-shadow:none}.kol-brand{padding:5px 10px 18px;border-bottom:1px solid #eef0f2;margin-bottom:10px}.kol-logo{width:32px;height:32px;border-radius:9px;box-shadow:none}.kol-brand b{font-size:15px;color:#1d1f22}.kol-brand small{color:#7e858b;font-size:7px}.kol-nav{gap:4px}.nav-group{display:none}.kol-nav button{color:#555d64;padding:10px 9px;border-radius:9px;gap:9px;border-color:transparent;align-items:flex-start}.kol-nav button:hover{background:#f7f9fa;color:#222}.kol-nav button.active{background:#dff5ff;border-color:#bce6f3;color:#1f3e4b}.nav-icon{width:26px;height:26px;flex:0 0 26px;border-radius:7px;background:#f3f5f6;color:#7b838a;font-size:8px}.active .nav-icon{background:#bfeafa;color:#1e5d70}.kol-nav button .nav-copy{display:flex;flex-direction:column;gap:2px;min-width:0}.kol-nav button .nav-copy strong{font-size:10px;line-height:1.2}.kol-nav button .nav-copy small{font-size:8px;line-height:1.25;color:#9299a0;font-weight:650}.kol-nav button.active .nav-copy small{color:#657f89}.side-spacer{flex:1}.side-foot{border:1px solid #e6e9eb;background:#fff;border-radius:11px;padding:10px}.side-foot .org{font-size:9px;color:#7d858c}.side-foot .meta{font-size:9px;color:#148463;font-weight:800;margin-top:4px}.side-foot .meta:before{content:'● ';font-size:8px}.side-actions{margin-top:8px}.side-actions button{background:#fff;border:1px solid #e2e5e8;color:#515961;padding:6px;font-size:8px}.kol-main{margin-left:250px}.kol-top{height:68px;background:#fff;backdrop-filter:none;padding:0 28px;border-bottom:1px solid #e5e7e9}.kol-top h1{font-size:22px;color:#27282c}.kol-top p{font-size:10px}.top-actions{gap:8px}.top-chip{font-size:8px;padding:7px 9px}.top-email{font-size:9px;color:#697178;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.new-analysis-btn{background:#17191d!important;color:#fff!important;border-color:#17191d!important}.kol-content{padding:24px 28px 60px;max-width:1380px}.hero h2{font-size:29px}.hero p{font-size:11px}.workflow-page .hero{align-items:flex-end}.kicker{font-size:8px;letter-spacing:.15em;font-weight:900;color:#8a9298}.score-ring{width:82px;height:82px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--cyan) calc(var(--score)*1%),#e8eaed 0);position:relative}.score-ring:after{content:"";position:absolute;inset:7px;border-radius:50%;background:#fff}.score-ring b{position:relative;z-index:1;font-size:18px}.dark-card .score-ring:after{background:#1e1e23}.progress{height:7px;border-radius:999px;background:#e9ebee;overflow:hidden}.progress i{display:block;height:100%;background:linear-gradient(90deg,var(--cyan),#7ee8f2);border-radius:999px}.creator-fit-results{display:grid;gap:12px}.creator-fit-card{border:1px solid var(--line);border-radius:14px;background:#fff;padding:16px}.creator-fit-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.creator-fit-scores{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;margin-top:12px}.creator-fit-score{border:1px solid var(--line);border-radius:10px;padding:9px;background:#fafafa}.creator-fit-score span{display:block;font-size:7px;color:var(--muted);text-transform:uppercase;font-weight:900}.creator-fit-score b{display:block;font-size:18px;margin-top:4px}.creator-fit-score small{display:block;font-size:7px;line-height:1.45;color:var(--muted);margin-top:4px}.creator-fit-score em{display:block;font-size:7px;line-height:1.45;color:#53616a;margin-top:5px;font-style:normal;font-weight:700}.creator-fit-reason{margin-top:10px;padding:10px 11px;border-left:3px solid var(--cyan);background:#f5fcfd;border-radius:0 9px 9px 0;font-size:9px;line-height:1.55}.creator-fit-recovery{margin-top:10px;border:1px solid #e8eaed;border-radius:11px;padding:11px;background:#fafafa}.creator-fit-recovery b{font-size:9px}.creator-fit-recovery li{font-size:9px;line-height:1.5;margin-top:5px}.creator-fit-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}@media(max-width:900px){.creator-fit-scores{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:620px){.creator-fit-scores{grid-template-columns:repeat(2,minmax(0,1fr))}}.decision-card{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}.reason{margin-top:11px;padding:11px 12px;border-left:3px solid var(--cyan);background:#f2fbfc;color:#5d686c;border-radius:0 9px 9px 0;font-size:9px;line-height:1.6}.dark-card .reason{background:#24242a;color:#b8b8c0}.readiness{display:grid;gap:8px}.ready-row{display:flex;align-items:center;gap:10px}.ready-dot{width:8px;height:8px;border-radius:50%;background:#d3d5d9}.ready-dot.ok{background:var(--good)}.ready-dot.warn{background:var(--warn)}.empty{padding:45px 25px;text-align:center;border:1px dashed #d8d9dd;border-radius:15px;color:var(--muted);font-size:11px}.toolbar{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px}.toolbar select,.toolbar input{border:1px solid var(--line);background:#fff;border-radius:9px;padding:9px 10px;font-size:10px}.kicker{font-size:8px;letter-spacing:.16em;font-weight:950;color:#92929a;text-transform:uppercase}.big-number{font-size:42px;font-weight:950;letter-spacing:-.07em}.explain-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.explain{padding:13px;border:1px solid var(--line);border-radius:12px;background:#fafafa}.explain b{font-size:10px}.explain p{font-size:9px;color:var(--muted);line-height:1.55;margin:6px 0 0}.footer-note{font-size:8px;color:#9a9aa2;margin-top:13px}.mobile-menu{display:none}.kol-toast{position:fixed;right:20px;bottom:20px;z-index:100;padding:11px 14px;border-radius:10px;background:#17171b;color:#fff;font-size:10px;font-weight:850;opacity:0;transform:translateY(8px);pointer-events:none;transition:.2s}.kol-toast.show{opacity:1;transform:none}.kol-toast.good{background:#117354}.kol-toast.error{background:#a73f4a}.required-star{color:#d04c57}.mini-stat{font-size:18px;font-weight:950}.list-card{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:13px 0;border-bottom:1px solid #eef0f2}.list-card:last-child{border-bottom:0}.list-card b{font-size:10px}.list-card small{display:block;color:var(--muted);font-size:8px;margin-top:4px}@media(max-width:1050px){.kol-side{width:220px}.kol-main{margin-left:220px}.kol-top,.kol-content{padding-left:25px;padding-right:25px}.g4{grid-template-columns:repeat(2,1fr)}.g5{grid-template-columns:repeat(2,1fr)}.weight-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.kol-side{transform:translateX(-100%);transition:.2s}.kol-side.open{transform:none}.kol-main{margin-left:0}.mobile-menu{display:grid;width:34px;height:34px;border:1px solid var(--line);border-radius:9px;background:#fff;place-items:center}.kol-top{padding:0 15px}.kol-top p{display:none}.kol-content{padding:20px 15px 60px}.hero{display:block}.hero-actions{margin-top:15px}.g2,.g3,.g4,.g5,.form-grid,.signal-grid,.explain-grid{grid-template-columns:1fr}.weight-grid{grid-template-columns:repeat(2,1fr)}.top-chip{display:none}}
`+`
/* V23 · Campaign intake matches reference UI exactly */
.kol-side{width:178px;background:#fff;color:#25262a;padding:13px 8px;border-right:1px solid #e2e6e9;box-shadow:none}.kol-brand{padding:3px 7px 15px;border-bottom:1px solid #edf0f2;margin-bottom:9px;gap:8px}.kol-logo{width:28px;height:28px;border-radius:8px;box-shadow:none}.kol-logo:after{inset:8px}.kol-brand b{font-size:12px}.kol-brand small{font-size:6px;letter-spacing:.13em;margin-top:2px}.kol-nav{gap:2px}.kol-nav button{padding:9px 7px;border-radius:8px;gap:7px}.nav-icon{width:22px;height:22px;flex:0 0 22px;font-size:7px;border-radius:6px}.kol-nav button .nav-copy strong{font-size:9px}.kol-nav button .nav-copy small{font-size:7px}.side-foot{padding:8px;border-radius:9px}.side-foot .org{font-size:8px}.side-foot .meta{font-size:8px}.side-actions button{padding:5px;font-size:7px}.kol-main{margin-left:178px}.kol-top{height:63px;padding:0 20px;background:#fff!important;background-color:#fff!important;opacity:1!important;border-bottom:1px solid #e6e8eb;backdrop-filter:none}.top-title-wrap{display:flex;align-items:center;gap:9px}.kol-top h1{font-size:21px;line-height:1.05;margin:0;letter-spacing:-.055em}.kol-top p{font-size:9px;margin:4px 0 0;color:#777d83}.top-actions{gap:6px}.top-chip{font-size:7px;padding:6px 8px;border-radius:7px}.top-email{font-size:7px;max-width:165px}.new-analysis-btn{font-size:8px;padding:7px 9px;border-radius:7px}.kol-content{padding:20px 24px 55px;max-width:none}.workflow-page{max-width:none;margin:0}.campaign-intake{border-radius:12px;padding:16px 18px;box-shadow:0 4px 18px rgba(20,22,30,.035)}.campaign-intake .section-title{font-size:9px;margin-bottom:9px;color:#315c73}.campaign-intake .form-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 14px}.campaign-intake .field label{font-size:8px}.campaign-intake .field input,.campaign-intake .field textarea,.campaign-intake .field select{min-height:34px;border-radius:7px;padding:7px 9px;font-size:9px}.campaign-intake .field textarea{min-height:68px}.campaign-intake .required-mark{font-size:6px}.campaign-intake .objective-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.campaign-intake .objective{min-height:31px;padding:5px 7px;border-radius:6px;font-size:8px;gap:5px}.campaign-intake .objective input{width:11px;height:11px}.campaign-intake .selected-strip{margin-top:7px;padding:7px 9px;font-size:8px}.campaign-intake .selected-chip{padding:4px 6px;margin:2px 3px 0 0}.other-objective{grid-column:span 2!important}.inline-objective-other{min-width:80px;flex:1;border:0;border-bottom:1px solid #cfd5da;background:transparent;padding:1px 3px;font-size:7px;outline:0}.campaign-intake .brand-grid{gap:10px}.campaign-intake .brand-grid .field textarea{min-height:70px}.campaign-intake .choice-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.campaign-intake .choice{padding:5px 6px;border-radius:6px;font-size:8px;min-height:28px}.campaign-intake .choice input{width:10px;height:10px}.campaign-intake .inline-other{min-width:50px;width:62px;border:0;border-bottom:1px solid #cfd5da;background:transparent;padding:1px 2px;font-size:7px;outline:0}.campaign-intake .message-row{gap:5px}.campaign-intake .message-row input{min-height:31px;font-size:8px}.campaign-intake .workflow-side-note{font-size:7px;margin-top:8px;padding:7px 9px}.campaign-intake .bottom-actions{margin-top:12px;padding-top:10px}.campaign-intake .bottom-actions .btn{font-size:8px;padding:7px 10px}.campaign-intake .section-title[style]{margin-top:15px!important}@media(max-width:1050px){.kol-side{width:178px}.kol-main{margin-left:178px}.kol-top,.kol-content{padding-left:18px;padding-right:18px}.campaign-intake .objective-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:760px){.kol-side{transform:translateX(-100%)}.kol-main{margin-left:0}.kol-top{padding:0 12px}.kol-content{padding:14px 10px 45px}.campaign-intake .form-grid,.campaign-intake .form-grid.two,.campaign-intake .brand-grid{grid-template-columns:1fr}.campaign-intake .objective-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.campaign-intake .choice-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.top-email{display:none}}

/* V24 · exact Campaign reference layout */
.campaign-reference-page{max-width:100%;}
.campaign-reference-page .campaign-intake{padding:0;background:#fff;border:1px solid #dfe4e7;border-radius:12px;box-shadow:0 6px 24px rgba(30,45,55,.035);overflow:hidden}
.campaign-reference-page .intake-section{padding:17px 18px 16px;border-bottom:1px solid #edf0f2}
.campaign-reference-page .section-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
.campaign-reference-page .section-title{font-size:9px;font-weight:950;letter-spacing:.06em;text-transform:uppercase;color:#315c73;margin:0}
.campaign-reference-page .section-required,.campaign-reference-page .required-mark{font-size:6px;font-weight:950;letter-spacing:.08em;color:#b75b62;text-transform:uppercase}
.campaign-reference-page .field{gap:5px;min-width:0}
.campaign-reference-page .field label{font-size:8px;font-weight:850;color:#31373c;display:flex;align-items:center;justify-content:space-between;gap:8px}
.campaign-reference-page .field input,.campaign-reference-page .field select,.campaign-reference-page .field textarea{width:100%;min-height:35px;border:1px solid #dfe4e7;border-radius:7px;background:#fff;color:#2d3338;padding:8px 10px;font-size:9px;outline:none;transition:.15s ease}
.campaign-reference-page .field textarea{min-height:73px;resize:vertical;line-height:1.45}
.campaign-reference-page .field input:focus,.campaign-reference-page .field select:focus,.campaign-reference-page .field textarea:focus{border-color:#8bcfe0;box-shadow:0 0 0 3px rgba(79,215,232,.10)}
.campaign-reference-page .form-grid{display:grid;gap:11px 16px;grid-template-columns:repeat(3,minmax(0,1fr))}
.campaign-reference-page .timeline-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
.campaign-reference-page .brand-profile-grid{display:grid;grid-template-columns:1fr 1.08fr 1.08fr;gap:14px}
.campaign-reference-page .brand-personality-row{width:100%;margin-top:12px}
.campaign-reference-page .objective-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
.campaign-reference-page .objective{display:flex;align-items:center;gap:6px;min-width:0;min-height:34px;padding:6px 8px;border:1px solid #e0e5e8;border-radius:7px;background:#fff;color:#505960;font-size:8px;font-weight:750;cursor:pointer}
.campaign-reference-page .objective:hover{border-color:#c9dfe7;background:#fbfeff}
.campaign-reference-page .objective.selected{background:#edf8fc;border-color:#a9dceb;color:#254e5a;box-shadow:inset 0 0 0 1px rgba(79,215,232,.06)}
.campaign-reference-page .objective input,.campaign-reference-page .choice input{width:11px;height:11px;margin:0;accent-color:#1479b7;flex:0 0 auto}
.campaign-reference-page .objective-icon{width:12px;text-align:center;color:#7f8a91;font-size:9px;flex:0 0 12px}
.campaign-reference-page .objective span:last-of-type{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.campaign-reference-page .other-objective{grid-column:span 2}
.campaign-reference-page .inline-objective-other{min-width:0;flex:1!important;height:20px!important;min-height:20px!important;padding:2px 4px!important;border:0!important;border-bottom:1px solid #d8dde0!important;border-radius:0!important;background:transparent!important;font-size:7px!important;box-shadow:none!important}
.campaign-reference-page .selected-strip{margin-top:8px;padding:7px 9px;border:1px solid #e2e7ea;border-radius:7px;background:#f7f9fa;color:#68727a;font-size:8px;line-height:1.5}
.campaign-reference-page .selected-chip{display:inline-flex;align-items:center;gap:4px;margin:1px 3px 1px 0;padding:3px 6px;border:1px solid #dce4e8;border-radius:999px;background:#fff;color:#465057;font-weight:800}
.campaign-reference-page .selected-chip button{border:0;background:none;color:#89939a;padding:0;line-height:1;font-size:10px}
.campaign-reference-page .brand-intelligence-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.campaign-reference-page .intelligence-column{min-width:0}
.campaign-reference-page .choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.campaign-reference-page .choice{display:flex;align-items:center;gap:6px;min-height:29px;padding:5px 7px;border:1px solid #e0e5e8;border-radius:6px;background:#fff;font-size:8px;color:#515960;cursor:pointer}
.campaign-reference-page .choice.selected{background:#f0f8f6;border-color:#c7e1d7;color:#315d50}
.campaign-reference-page .choice input{accent-color:#147a5a}
.campaign-reference-page .other-choice .inline-other{min-width:0;flex:1;width:40px;border:0;border-bottom:1px solid #d8dde0;background:transparent;padding:1px 2px;font-size:7px;outline:0}
.campaign-reference-page .selected-mini{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px;font-size:7px;color:#7d878e;min-height:15px}
.campaign-reference-page .selected-mini span{padding:3px 6px;border:1px solid #dfe5e8;background:#fff;border-radius:999px}
.campaign-reference-page .message-list{display:grid;gap:7px}
.campaign-reference-page .message-row{display:flex;gap:5px}
.campaign-reference-page .message-row input{min-height:32px!important}
.campaign-reference-page .icon-btn{width:31px;min-width:31px;border:1px solid #e0e5e8;background:#fff;border-radius:7px;color:#9a6368;font-weight:900;font-size:12px}
.campaign-reference-page .add-message-btn{width:100%;margin-top:7px;min-height:31px;border:1px solid #dfe5e8;background:#fff;border-radius:7px;color:#4e5960;font-size:8px;font-weight:850}
.campaign-reference-page .add-message-btn:hover{background:#f8fbfc;border-color:#c8dfe6}
.campaign-reference-page .workflow-side-note{padding:9px 18px;font-size:7px;color:#7b858b;line-height:1.45;background:#fbfcfc}
.campaign-reference-page .bottom-actions{display:flex;justify-content:flex-end;gap:7px;padding:11px 18px;border-top:1px solid #edf0f2;background:#fff}
.campaign-reference-page .bottom-actions .btn{min-height:34px;padding:7px 12px;font-size:8px;border-radius:7px}
@media(max-width:1100px){.campaign-reference-page .objective-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.campaign-reference-page .brand-intelligence-grid{grid-template-columns:1fr 1fr}.campaign-reference-page .brand-intelligence-grid .intelligence-column:last-child{grid-column:1/-1}.campaign-reference-page .brand-personality-row{width:100%}}
@media(max-width:760px){.campaign-reference-page .intake-section{padding:14px}.campaign-reference-page .form-grid,.campaign-reference-page .timeline-grid,.campaign-reference-page .brand-profile-grid,.campaign-reference-page .brand-intelligence-grid{grid-template-columns:1fr}.campaign-reference-page .brand-intelligence-grid .intelligence-column:last-child{grid-column:auto}.campaign-reference-page .brand-personality-row{width:100%}.campaign-reference-page .objective-grid,.campaign-reference-page .choice-grid{grid-template-columns:1fr 1fr}.campaign-reference-page .other-objective{grid-column:span 2}.campaign-reference-page .bottom-actions{padding:10px 14px}.campaign-reference-page .bottom-actions .btn{flex:1}}
/* V25 · requested clean reference adjustments */
.campaign-reference-page .section-required{display:none!important}
.campaign-reference-page .required-mark{display:none!important}
.campaign-reference-page .required-star{color:#d84b55;font-size:15px;font-weight:950;line-height:1;vertical-align:middle}
.campaign-reference-page .section-title{font-size:13px!important;letter-spacing:.055em!important}
.campaign-reference-page .section-title-row{margin-bottom:14px!important}
.campaign-reference-page .field label{font-size:11px!important;font-weight:850!important}
.campaign-reference-page .field input,.campaign-reference-page .field select,.campaign-reference-page .field textarea{font-size:13px!important;min-height:42px!important;padding:10px 12px!important}
.campaign-reference-page .field textarea{min-height:90px!important}
.campaign-reference-page .objective{font-size:11px!important;min-height:42px!important;padding:8px 10px!important}
.campaign-reference-page .objective input{width:14px!important;height:14px!important}
.campaign-reference-page .objective-icon{display:none!important}
.campaign-reference-page .selected-strip{font-size:10px!important;padding:9px 11px!important}
.campaign-reference-page .selected-chip{font-size:10px!important;padding:4px 8px!important}
.campaign-reference-page .hint{font-size:9px!important}
.campaign-reference-page .message-row input{font-size:12px!important;min-height:38px!important}
.campaign-reference-page .add-message-btn{font-size:11px!important;min-height:38px!important}
.campaign-reference-page .workflow-side-note{font-size:9px!important}
.campaign-reference-page .bottom-actions .btn{font-size:11px!important;min-height:40px!important;padding:9px 14px!important}
.kol-logo,.nav-icon{display:none!important}
.kol-brand{padding-left:11px!important;gap:0!important}
.kol-nav button{gap:0!important;padding-left:14px!important;font-size:12px!important}
.nav-copy strong{font-size:12px!important}
.nav-copy small{font-size:9px!important}
.kol-top h1{font-size:28px!important}
.kol-top p{font-size:12px!important}
.top-email,.top-chip{font-size:10px!important}
.mobile-menu{font-size:11px!important}.campaign-reference-page .remove-message-btn{width:auto;min-width:54px;border:1px solid #e0e5e8;background:#fff;border-radius:7px;color:#9a6368;font-weight:800;font-size:9px;padding:0 8px}.campaign-reference-page .icon-btn{display:none!important}

/* Final campaign workspace typography */
.campaign-reference-page .section-title{font-size:14px!important;letter-spacing:.06em!important}
.campaign-reference-page .field label{font-size:13px!important}
.campaign-reference-page .field input,.campaign-reference-page .field textarea,.campaign-reference-page .field select{font-size:13px!important;min-height:44px!important;padding:10px 12px!important}
.campaign-reference-page .field textarea{min-height:92px!important}
.campaign-reference-page .hint{font-size:11px!important}
.campaign-reference-page .required-star{color:#d71920!important;font-size:16px!important;font-weight:900!important}
.campaign-reference-page .objective{font-size:13px!important;min-height:44px!important}
.campaign-reference-page .selected-strip,.campaign-reference-page .workflow-side-note{font-size:12px!important}
.campaign-reference-page .bottom-actions .btn{font-size:13px!important}
.campaign-reference-page .brand-intelligence-grid .field label{font-size:13px!important}
.kol-nav button{font-size:13px!important}
.nav-copy strong{font-size:13px!important}
.nav-copy small{font-size:10px!important}

/* V26 · 7-Step production workspace cleanup */
.kol-nav .nav-icon{display:grid!important;place-items:center;width:25px!important;height:25px!important;flex:0 0 25px!important;border:1px solid #e1e6e9;border-radius:7px;background:#f7f9fa;color:#7a858b;font-size:8px!important;font-weight:900;letter-spacing:.02em}
.kol-nav button.active .nav-icon{background:#dff5ff;border-color:#bce6f3;color:#1f6f86}
.workflow-page .hero{margin-bottom:14px}
.workflow-page .card{overflow:visible}
.workflow-page .section-head{gap:12px}
.workflow-page .sub{line-height:1.55}
.workflow-page .bottom-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.workflow-page .bottom-actions .btn{min-height:38px}
/* V27 · balanced premium selection cards + explicit audience intelligence inputs */
.campaign-intake .objective-grid{grid-template-columns:repeat(5,minmax(0,1fr));align-items:stretch}
.campaign-intake .objective{min-height:46px;height:46px;justify-content:flex-start;line-height:1.2}
.campaign-intake .brand-personality-row{width:100%}
.campaign-intake .brand-personality-row .objective-grid{grid-template-columns:repeat(5,minmax(0,1fr))}
.campaign-intake .brand-personality-row .objective{min-height:46px;height:46px}
.audience-deep-field{background:#fbfdfe;border:1px solid #e5eef1;border-radius:12px;padding:14px}
.audience-deep-field textarea{background:#fff!important}
.audience-deep-field .hint{font-size:9px}
.gen-code-field{padding:12px 14px;border:1px dashed #d9e6e9;border-radius:12px;background:#fbfdfe}
.inline-code-field{display:flex;gap:8px;align-items:center}
.inline-code-field input{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:900;letter-spacing:.06em;background:#f7fbfc!important}
.gen-code-badge{display:inline-flex;align-items:center;gap:7px;margin-top:7px;padding:5px 8px;border-radius:7px;background:#f4fafb;border:1px solid #dcecef;color:#66777d;font-size:8px;font-weight:800;letter-spacing:.04em}.gen-code-panel .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.gen-code-panel code,.gen-code-table code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:900;letter-spacing:.04em;color:#1f6470}.gen-code-panel .hint{font-size:8px;color:#8a9298;font-weight:600}.gen-code-panel .footer-note{margin-top:12px}.gen-code-table{margin-top:14px}.gen-code-table .table-wrap{border-radius:10px}.gen-code-table th,.gen-code-table td{font-size:9px;padding:9px}.gen-code-panel .field input,.gen-code-panel .field select{min-height:38px}
.gen-code-badge strong{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#1f6470}
@media(max-width:1100px){.campaign-intake .objective-grid,.campaign-intake .brand-personality-row .objective-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){.campaign-intake .objective-grid,.campaign-intake .brand-personality-row .objective-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.campaign-intake .objective,.campaign-intake .brand-personality-row .objective{height:48px;min-height:48px}.inline-code-field{align-items:stretch}.inline-code-field input{min-width:0}.inline-code-field .btn{white-space:nowrap}.audience-deep-field{padding:11px}}
@media(max-width:420px){.inline-code-field{display:grid;grid-template-columns:1fr}.inline-code-field .btn{width:100%}}
@media(max-width:760px){.kol-nav .nav-icon{display:grid!important}.workflow-page .bottom-actions .btn{flex:1 1 140px}}
.kol-export-modal{position:fixed;inset:0;background:rgba(16,18,22,.46);backdrop-filter:blur(8px);display:grid;place-items:center;z-index:99999;padding:20px}.kol-export-card{width:min(560px,100%);background:#fff;border:1px solid #e1e4e8;border-radius:22px;box-shadow:0 30px 90px rgba(15,20,25,.22);padding:26px}.kol-export-card h3{margin:5px 0 8px;font-size:24px;letter-spacing:-.04em}.kol-export-card p{margin:0;color:#70767d;font-size:12px;line-height:1.6}.kol-export-kicker{font-size:8px;letter-spacing:.16em;font-weight:950;color:#5d7880}.kol-export-plans{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0}.kol-export-plan{border:1px solid #e2e5e8;border-radius:12px;padding:12px;background:#fafbfc}.kol-export-plan b{display:block;font-size:11px}.kol-export-plan span{display:block;margin-top:4px;font-size:9px;color:#7c8389}.kol-export-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:18px}.kol-export-actions button{border:1px solid #d8dce0;border-radius:10px;padding:10px 14px;font-size:10px;font-weight:900;background:#fff}.kol-export-actions .primary{background:#17171b;color:#fff;border-color:#17171b}@media(max-width:620px){.kol-export-plans{grid-template-columns:1fr}.kol-export-actions{flex-direction:column}.kol-export-actions button{width:100%}}

/* KOL IDS · PREMIUM PASS / presentation-only layer
   Keep the clean workflow; elevate hierarchy, spacing, material, and decision surfaces. */
:root{
  --kids-cyan:#cdf5ff;
  --kids-cyan-strong:#63d8ec;
  --kids-ink:#171317;
  --kids-muted:#737078;
  --kids-bg:#f5f7f8;
  --kids-line:#e4e7e9;
  --kids-paper:#ffffff;
  --kids-soft:#f8fbfc;
  --kids-shadow:0 12px 40px rgba(28,25,29,.045);
  --kids-shadow-lg:0 28px 80px rgba(28,25,29,.075);
}
html,body,#app{background:var(--kids-bg)}
body{background:
  radial-gradient(720px 360px at 88% -8%,rgba(205,245,255,.72),transparent 66%),
  radial-gradient(520px 300px at 18% 0%,rgba(255,255,255,.96),transparent 72%),
  linear-gradient(180deg,#f8fafb 0%,#f3f5f6 100%)}
.kol-shell{background:transparent}
.kol-side{
  width:266px;
  padding:22px 14px 16px;
  background:linear-gradient(180deg,#151416 0%,#111113 100%);
  border-right:1px solid rgba(255,255,255,.06);
  box-shadow:14px 0 50px rgba(15,14,16,.07);
}
.kol-brand{padding:7px 12px 24px;gap:10px}
.kol-logo{width:38px;height:38px;border-radius:11px;background:linear-gradient(145deg,#f8ffff 5%,var(--kids-cyan) 58%,#65d8eb 100%);box-shadow:0 8px 26px rgba(99,216,236,.18)}
.kol-brand b{font-size:16px;letter-spacing:-.045em}
.kol-brand small{font-size:8px;letter-spacing:.19em;color:#77757a}
.kol-nav{gap:4px}
.nav-group{margin:14px 10px 7px;color:#66646a;font-size:7px;letter-spacing:.19em}
.kol-nav button{min-height:44px;padding:9px 10px;border-radius:11px;color:#a9a7ad;font-size:11px;gap:10px}
.kol-nav button:hover{background:rgba(255,255,255,.045);color:#f8f8f8}
.kol-nav button.active{background:linear-gradient(90deg,rgba(205,245,255,.16),rgba(205,245,255,.045));border-color:rgba(205,245,255,.17);box-shadow:inset 2px 0 0 var(--kids-cyan);color:#fff}
.kol-nav .nav-icon{width:24px;height:24px;border-radius:7px;background:#202024;border-color:#2c2c31;color:#89878d}
.kol-nav button.active .nav-icon{background:var(--kids-cyan);border-color:var(--kids-cyan);color:#17282c;box-shadow:0 5px 18px rgba(205,245,255,.12)}
.side-foot{border-color:#2a292d;background:#19181b;border-radius:14px;padding:12px;box-shadow:none}
.side-foot .org{font-size:10px}
.side-foot .meta{font-size:8px}
.side-actions{gap:6px}
.side-actions button{border-color:#303035;background:#222126;border-radius:8px;padding:8px 7px;color:#c8c6ca}
.kol-main{margin-left:266px}
.kol-top{
  height:82px;
  padding:0 42px;
  background:rgba(248,250,251,.78);
  border-bottom:1px solid rgba(221,225,228,.92);
  box-shadow:0 8px 24px rgba(30,27,31,.025);
}
.eyebrow{font-size:8px;color:#8d898f;letter-spacing:.19em}
.kol-top h1{font-size:26px;letter-spacing:-.055em}
.kol-top p{font-size:11px;color:#77737a}
.top-actions{gap:7px}
.top-chip{padding:8px 11px;border-radius:10px;background:rgba(255,255,255,.86);border-color:#e0e4e6;color:#666168;box-shadow:0 4px 14px rgba(20,20,24,.025)}
.avatar{width:34px;height:34px;border-radius:10px;background:#19171a;box-shadow:0 6px 18px rgba(20,18,21,.12)}
.kol-content{padding:34px 42px 88px;max-width:1500px}
.workflow-page{max-width:1300px}
.hero{gap:30px;margin-bottom:24px;padding:3px 0 4px;position:relative}
.hero:after{content:"";position:absolute;left:0;bottom:-12px;width:54px;height:2px;background:var(--kids-cyan-strong);border-radius:99px}
.hero h2{font-size:34px;line-height:1.08;letter-spacing:-.06em;margin:4px 0 8px}
.hero p{max-width:760px;font-size:12px;line-height:1.7;color:#767279}
.hero-actions{gap:7px}
.grid{gap:16px}
.card{
  background:rgba(255,255,255,.92);
  border:1px solid rgba(224,227,230,.96);
  border-radius:19px;
  padding:22px;
  box-shadow:var(--kids-shadow);
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;
}
.card:hover{box-shadow:0 18px 48px rgba(28,25,29,.065);border-color:#dfe4e6}
.dark-card{background:linear-gradient(140deg,#171619 0%,#222126 100%);box-shadow:var(--kids-shadow-lg)}
.section-head{margin-bottom:17px}
.section-head h2,.section-head h3{font-size:17px;letter-spacing:-.035em}
.label{font-size:8px;letter-spacing:.17em;color:#858087}
.sub{font-size:10px;line-height:1.7;color:#777279}
.metric{padding:18px;border-radius:15px;border-color:#e4e7e9;background:#fff;box-shadow:0 7px 24px rgba(25,24,28,.035)}
.metric strong{font-size:30px;margin-top:9px;letter-spacing:-.06em}
.metric small{font-size:9px;color:#858087}
.metric:hover{transform:translateY(-2px);box-shadow:0 15px 34px rgba(25,24,28,.07)}
.btn{min-height:38px;padding:9px 14px;border-radius:10px;border-color:#dfe2e5;background:#fff;font-size:10px;font-weight:900;letter-spacing:-.01em;box-shadow:0 2px 7px rgba(20,20,24,.025)}
.btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(20,20,24,.08);border-color:#d5dadd}
.btn.primary{background:#171416;border-color:#171416;box-shadow:0 8px 20px rgba(23,20,22,.13)}
.btn.cyan{background:var(--kids-cyan);border-color:#b9edf6;color:#17282c;box-shadow:0 7px 20px rgba(99,216,236,.13)}
.btn.ghost{background:transparent;box-shadow:none}
.form-grid{gap:16px}
.field{gap:7px}
.field label{font-size:9px;color:#39353a}
.field input,.field textarea,.field select{border-color:#dde1e4;border-radius:10px;padding:11px 12px;background:#fff;box-shadow:inset 0 1px 1px rgba(20,20,24,.018);transition:.16s ease}
.field input:hover,.field textarea:hover,.field select:hover{border-color:#cfd5d9}
.field input:focus,.field textarea:focus,.field select:focus{border-color:#76d9eb;box-shadow:0 0 0 4px rgba(99,216,236,.12)}
.hint{font-size:8px;color:#979197}
.campaign-intake{border-color:#e0e4e7;border-radius:19px;padding:25px 27px;box-shadow:var(--kids-shadow);background:rgba(255,255,255,.95)}
.campaign-intake .section-title{font-size:10px;letter-spacing:.13em;color:#355b69;margin-bottom:14px}
.campaign-intake .field label{font-size:10px;color:#39363b}
.campaign-intake .field input,.campaign-intake .field textarea,.campaign-intake .field select{border-radius:9px;background:#fcfdfd}
.campaign-intake .objective{border-color:#dfe4e7;border-radius:9px;background:#fff;transition:.16s ease}
.campaign-intake .objective:hover{border-color:#b9dfe8;transform:translateY(-1px)}
.campaign-intake .objective.selected{background:linear-gradient(180deg,#f0fbfe,#eaf8fb);border-color:#9fdce9;box-shadow:inset 0 0 0 1px rgba(99,216,236,.07)}
.campaign-intake .selected-strip{background:#f8fafb;border-color:#e2e7e9;border-radius:9px}
.signal-grid{gap:14px}
.signal-box{border-color:#e1e5e7;border-radius:15px;background:linear-gradient(180deg,#fff,#fbfcfc);padding:15px}
.chip{border-color:#dfe3e5;background:#fff;padding:6px 9px}
.chip.selected{background:#effbfe;border-color:#b8e9f2;box-shadow:0 3px 10px rgba(99,216,236,.07)}
.pill{padding:5px 9px}
.table-wrap{border-color:#e0e4e7;border-radius:15px;box-shadow:0 6px 20px rgba(25,24,28,.025)}
th{background:#fafbfb}
th,td{padding:13px 12px}
.report-grid{gap:14px}
.report-summary{border-color:#e0e4e7;border-radius:16px;background:#fff;box-shadow:var(--kids-shadow)}
.kol-export-modal{background:rgba(15,14,16,.48);backdrop-filter:blur(12px)}
.kol-export-card{width:min(600px,100%);padding:30px;border-radius:24px;border-color:#e1e5e7;box-shadow:0 35px 110px rgba(10,10,12,.26)}
.kol-export-card h3{font-size:27px;letter-spacing:-.05em}
.kol-export-kicker{color:#6d858c;font-size:8px;letter-spacing:.18em}
.kol-export-plan{border-color:#e1e5e7;border-radius:14px;background:linear-gradient(180deg,#fff,#fafcfc);padding:14px;transition:.16s ease}
.kol-export-plan:hover{border-color:#a9dfe9;transform:translateY(-1px);box-shadow:0 8px 22px rgba(30,30,34,.05)}
.kol-toast{border-radius:11px!important;box-shadow:0 15px 45px rgba(20,20,24,.18)!important}
@media(max-width:1100px){.kol-content{padding:28px 28px 72px}.kol-top{padding:0 28px}.kol-side{width:250px}.kol-main{margin-left:250px}}
@media(max-width:760px){.kol-side{width:76px;padding:18px 8px}.kol-main{margin-left:76px}.kol-brand{padding:7px 8px 22px}.kol-brand b,.kol-brand small{display:none}.kol-nav button{justify-content:center;padding:9px 6px}.kol-nav .nav-copy{display:none}.side-foot .org,.side-foot .meta,.side-actions button{font-size:0}.side-actions button:before{content:'•';font-size:12px}.kol-top{padding:0 18px;height:76px}.kol-content{padding:24px 18px 64px}.hero{display:block}.hero-actions{margin-top:16px}.hero h2{font-size:28px}.card{padding:18px;border-radius:17px}.campaign-intake{padding:18px}.form-grid{grid-template-columns:1fr!important}.campaign-intake .objective-grid{grid-template-columns:1fr 1fr!important}}
@media(max-width:520px){.kol-top h1{font-size:21px}.kol-top p{font-size:10px}.top-chip{display:none}.kol-content{padding:20px 14px 52px}.hero h2{font-size:25px}.card{padding:16px}.campaign-intake{padding:15px}.campaign-intake .objective-grid{grid-template-columns:1fr!important}.kol-export-card{padding:22px}.kol-export-card h3{font-size:23px}}
/* V30.1 · Mobile premium layout + readability polish */
.kol-brand b,.kol-brand small{color:#fff!important}
.kol-brand small{opacity:.92!important}
@media(max-width:900px){
  .kol-side{width:0!important;padding:22px 0 16px!important;transform:translateX(-100%);overflow:hidden;box-shadow:none!important}
  .kol-side.open{width:280px!important;padding:24px 16px 18px!important;transform:translateX(0);overflow-y:auto;box-shadow:20px 0 60px rgba(0,0,0,.22)!important}
  .kol-side.open .kol-brand{padding:8px 12px 28px!important;justify-content:flex-start!important;align-items:flex-start!important}
  .kol-side.open .kol-brand b{display:block!important;font-size:17px!important;line-height:1.15!important;white-space:nowrap!important}
  .kol-side.open .kol-brand small{display:block!important;font-size:8px!important;line-height:1.45!important;letter-spacing:.16em!important;white-space:nowrap!important}
  .kol-side.open .kol-nav{width:100%!important;gap:5px!important}
  .kol-side.open .kol-nav button{width:100%!important;min-height:54px!important;justify-content:flex-start!important;align-items:center!important;text-align:left!important;padding:9px 12px!important;gap:12px!important;border-radius:12px!important}
  .kol-side.open .kol-nav .nav-icon{display:grid!important;flex:0 0 27px!important;width:27px!important;height:27px!important}
  .kol-side.open .kol-nav .nav-copy{display:flex!important;min-width:0!important;flex:1 1 auto!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:3px!important;line-height:1.2!important;overflow:hidden!important}
  .kol-side.open .kol-nav .nav-copy strong{display:block!important;width:100%!important;font-size:11px!important;line-height:1.25!important;font-weight:850!important;white-space:normal!important;text-align:left!important}
  .kol-side.open .kol-nav .nav-copy small{display:block!important;width:100%!important;font-size:9px!important;line-height:1.35!important;color:#85838a!important;white-space:normal!important;text-align:left!important}
  .kol-side.open .kol-nav button.active .nav-copy small{color:#b8c0c4!important}
  .kol-side.open .side-spacer{min-height:18px!important}
  .kol-side.open .side-foot{margin-top:12px!important}
  .kol-side.open .side-foot .org{display:block!important;font-size:10px!important;line-height:1.25!important;color:#fff!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .kol-side.open .side-foot .meta{display:block!important;font-size:8.5px!important;line-height:1.35!important;color:#a9a7ad!important;margin-top:4px!important;white-space:nowrap!important}
  .kol-side.open .side-actions{display:flex!important;gap:6px!important;margin-top:11px!important}
  .kol-side.open .side-actions button{display:block!important;flex:1 1 auto!important;font-size:9px!important;line-height:1.2!important;padding:8px 9px!important;color:#f0eef1!important;background:#222126!important;border:1px solid #303035!important;border-radius:8px!important}
  .kol-side.open .side-actions button:before{content:none!important}
  .kol-main{margin-left:0!important;width:100%;min-width:0}
  .kol-top{padding:0 14px!important;height:76px!important}
  .top-title-wrap{min-width:0}
  .mobile-menu{display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 auto}
  .top-email,.top-chip{display:none!important}
  .kol-content{padding:18px 14px 56px!important;max-width:none!important}
  .hero{display:block!important;margin-bottom:16px!important}
  .hero h2{font-size:30px!important;line-height:1.05!important}
  .hero p{font-size:12px!important;line-height:1.6!important;max-width:680px}
  .hero-actions{margin-top:13px!important}
  .workflow-page .card{border-radius:18px!important}
  .campaign-reference-page .campaign-intake{border-radius:18px!important}
  .campaign-reference-page .intake-section{padding:18px 16px!important}
  .campaign-reference-page .form-grid,.campaign-reference-page .timeline-grid,.campaign-reference-page .brand-profile-grid,.campaign-reference-page .brand-intelligence-grid{grid-template-columns:1fr!important}
  .campaign-reference-page .objective-grid,.campaign-intake .brand-personality-row .objective-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  .campaign-reference-page .objective{min-height:48px!important;height:auto!important;padding:10px 11px!important}
  .campaign-reference-page .field input,.campaign-reference-page .field textarea,.campaign-reference-page .field select{min-height:46px!important;font-size:14px!important}
  .campaign-reference-page .field textarea{min-height:104px!important}
  .campaign-reference-page .section-title{font-size:12px!important}
  .campaign-reference-page .field label{font-size:13px!important}
  .campaign-reference-page .hint{font-size:10px!important}
  .campaign-reference-page .selected-strip{font-size:11px!important;line-height:1.6}
  .campaign-reference-page .bottom-actions{position:sticky;bottom:0;z-index:8;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);margin:0 -16px -18px;padding:12px 16px!important}
}
@media(max-width:560px){
  .kol-side.open{width:min(286px,86vw)!important}
  .kol-side.open .kol-brand{padding-left:10px!important;padding-right:10px!important}
  .kol-side.open .kol-nav button{padding-left:10px!important;padding-right:10px!important}
  .kol-side.open .kol-nav .nav-copy strong{font-size:10.5px!important}
  .kol-side.open .kol-nav .nav-copy small{font-size:8.5px!important}
  .kol-top h1{font-size:22px!important}
  .kol-top p{font-size:10px!important}
  .mobile-menu{padding:9px 11px!important}
  .hero h2{font-size:27px!important}
  .hero p{font-size:11px!important}
  .kol-content{padding:14px 10px 52px!important}
  .campaign-reference-page .campaign-intake{border-radius:16px!important}
  .campaign-reference-page .intake-section{padding:16px 14px!important}
  .campaign-reference-page .objective-grid,.campaign-intake .brand-personality-row .objective-grid{gap:8px!important}
  .campaign-reference-page .objective{font-size:12px!important}
}
/* Campaign choice pattern: compact boxes like the KOL Persona reference image. No checkbox UI. */
.campaign-reference-page .objective-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.campaign-reference-page .objective{display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;min-height:34px!important;height:34px!important;padding:6px 9px!important;border:1px solid #dfe3e7!important;border-radius:8px!important;background:#fff!important;color:#30363b!important;font-size:9px!important;font-weight:800!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;box-shadow:none!important;cursor:pointer!important;transition:all .15s ease!important}
.campaign-reference-page .objective:hover{transform:translateY(-1px);border-color:#9adff0!important}
.campaign-reference-page .objective.selected{background:#eafaff!important;border-color:#9adff0!important;color:#164c5d!important;box-shadow:inset 0 0 0 1px rgba(174,239,255,.15)!important}
.campaign-reference-page .objective.custom-choice{background:#f7fdff!important;border-color:#8fdbea!important;color:#164c5d!important}
.campaign-reference-page .objective.custom-choice b{font-size:12px!important;font-weight:900!important;line-height:1!important;opacity:.55}
.campaign-reference-page .objective.other-trigger{background:#fff!important;color:#30363b!important}
.campaign-reference-page .objective.other-trigger:focus{outline:0;box-shadow:0 0 0 3px rgba(79,215,232,.12)!important}
.campaign-reference-page .other-input-row{display:none;align-items:center;gap:8px;margin-top:9px;padding:7px 9px;border:1px dashed #cfd8dd;border-radius:8px;background:#fbfdfe}
.campaign-reference-page .other-input-row.show{display:flex}
.campaign-reference-page .other-input-row label{min-width:auto!important;color:#53616a!important;font-size:8px!important;font-weight:800!important}
.campaign-reference-page .other-input-row input{flex:1;min-height:30px!important;border:1px solid #dfe3e7!important;border-radius:7px!important;padding:6px 8px!important;background:#fff!important;font-size:10px!important;outline:0}
.campaign-reference-page .other-input-row input:focus{border-color:#4fd7e8!important;box-shadow:0 0 0 3px rgba(79,215,232,.12)!important}
.campaign-reference-page .intake-section:first-of-type + .intake-section .selected-strip,.campaign-reference-page .brand-personality-row .selected-strip{display:none!important}
.signal-box .custom-signal-chip b{font-size:12px;opacity:.55;margin-left:2px}
@media(max-width:900px){.campaign-reference-page .objective-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:620px){.campaign-reference-page .objective-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.campaign-reference-page .objective{height:36px!important;min-height:36px!important;font-size:10px!important}.campaign-reference-page .other-input-row{align-items:stretch;flex-direction:column;gap:5px}.campaign-reference-page .other-input-row label{align-self:flex-start}}

.kol-top{position:sticky!important;isolation:isolate!important;background:#fff!important;background-color:#fff!important;background-image:none!important;opacity:1!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;mix-blend-mode:normal!important;}
.kol-top::before{content:""!important;position:absolute!important;inset:0!important;background:#fff!important;opacity:1!important;z-index:-1!important;pointer-events:none!important;}
.kol-top>*{position:relative!important;z-index:1!important;}

/* Creator registry v2 · compact decision dashboard */
.creator-registry-card{border-radius:22px!important;padding:18px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 18px 55px rgba(20,22,30,.06)!important}
/* Campaign History · premium archive layout */
.campaign-history-page{max-width:1380px;margin:0 auto}
.campaign-history-page .history-hero{align-items:flex-end!important;margin-bottom:10px!important}
.campaign-history-page .history-hero h2{letter-spacing:-.035em!important}
.campaign-history-page .history-hero p{max-width:760px!important}
.campaign-history-page .history-hero .hero-actions{display:flex;align-items:center;justify-content:flex-end}
.campaign-history-page .history-rule{width:54px;height:2px;border-radius:999px;background:#4fd7e8;margin:4px 0 18px}
.campaign-history-page .history-archive-card{padding:0!important;overflow:hidden;border:1px solid #e5eaee!important;background:#fff!important;box-shadow:0 20px 65px rgba(20,28,38,.07)!important;border-radius:24px!important}
.campaign-history-page .history-archive-card>.section-head{padding:24px 26px 20px!important;margin:0!important;border-bottom:1px solid #edf0f2!important;background:linear-gradient(180deg,#fff 0%,#fbfdfe 100%)!important}
.campaign-history-page .history-archive-card>.section-head h2{font-size:21px!important;letter-spacing:-.025em!important;margin:4px 0 5px!important}
.campaign-history-page .history-archive-card>.section-head .sub{max-width:780px!important;font-size:11px!important;line-height:1.55!important}
.campaign-history-page .history-list{padding:14px 16px 18px!important;background:#f7f9fa!important}
.campaign-history-page .history-row{display:grid!important;grid-template-columns:58px minmax(0,1fr) 170px auto;align-items:center;gap:18px;min-height:118px;padding:20px 22px;margin:0 0 10px;border:1px solid #e6ebee;border-radius:18px;background:#fff;box-shadow:0 8px 26px rgba(20,32,42,.045);transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease}
.campaign-history-page .history-row:last-child{margin-bottom:0}
.campaign-history-page .history-row:hover{transform:translateY(-1px);border-color:#d9e5e9;box-shadow:0 14px 34px rgba(20,32,42,.08)}
.campaign-history-page .history-index{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:#17191d;color:#aeefff;font-size:12px;font-weight:950;letter-spacing:.04em;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.campaign-history-page .history-main{min-width:0;display:flex;flex-direction:column;gap:5px}
.campaign-history-page .history-main b{font-size:17px;line-height:1.15;letter-spacing:-.02em;color:#151b20;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.campaign-history-page .history-main small{font-size:10px;line-height:1.45;color:#78828a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.campaign-history-page .history-main small:first-of-type{color:#39444b;font-weight:800}
.campaign-history-page .history-status{justify-self:start;display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:7px 11px;border:1px solid #d9eef3;border-radius:999px;background:#effbfe;color:#2d7382;font-size:9px;font-weight:950;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.campaign-history-page .history-status.complete{background:#edf9f3;border-color:#cde9da;color:#247653}.campaign-history-page .history-status.draft{background:#f6f6f7;border-color:#e2e3e5;color:#646a71}.formula-note{display:block;margin-top:4px;color:#7d858c;font-size:8px;line-height:1.35}
.campaign-history-page .history-actions{justify-self:end;display:flex!important;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:nowrap!important}
.campaign-history-page .history-actions .btn{min-width:76px!important;min-height:42px!important;padding:10px 14px!important;border-radius:12px!important;font-size:10px!important;font-weight:900!important}
.campaign-history-page .history-open{background:#17191d!important;color:#fff!important;border-color:#17191d!important;box-shadow:0 7px 18px rgba(23,25,29,.12)!important}
.campaign-history-page .history-open:hover{background:#25282d!important}
.campaign-history-page .history-remove{background:#fff!important;border-color:#e8d4d6!important;color:#a45d63!important}
.campaign-history-page .history-remove:hover{background:#fff7f7!important;border-color:#dcb9bd!important}
.campaign-history-page .history-empty{margin:0!important;padding:42px 24px!important;text-align:center;border:1px dashed #d9e1e5;border-radius:16px;background:#fff;color:#77818a;font-size:11px;line-height:1.6}
@media(max-width:900px){
 .campaign-history-page .history-row{grid-template-columns:50px minmax(0,1fr) 150px auto;gap:14px;padding:18px}
 .campaign-history-page .history-main b{font-size:15px}
 .campaign-history-page .history-status{font-size:8px}
}
@media(max-width:760px){
 .campaign-history-page .history-hero{margin-bottom:12px!important}
 .campaign-history-page .history-hero .hero-actions{justify-content:stretch}
 .campaign-history-page .history-hero .hero-actions .btn{width:100%}
 .campaign-history-page .history-rule{margin-bottom:14px}
 .campaign-history-page .history-archive-card{border-radius:18px!important}
 .campaign-history-page .history-archive-card>.section-head{padding:20px 18px 17px!important;display:flex!important;align-items:flex-start!important;gap:12px!important}
 .campaign-history-page .history-archive-card>.section-head .pill{flex:0 0 auto}
 .campaign-history-page .history-list{padding:10px!important}
 .campaign-history-page .history-row{grid-template-columns:42px minmax(0,1fr)!important;gap:12px!important;align-items:start!important;padding:16px!important;min-height:0!important;border-radius:16px!important}
 .campaign-history-page .history-index{width:38px;height:38px;border-radius:11px;font-size:10px}
 .campaign-history-page .history-main b{font-size:14px;white-space:normal;overflow:visible}
 .campaign-history-page .history-main small{white-space:normal;overflow:visible}
 .campaign-history-page .history-status{grid-column:2!important;justify-self:start!important;margin-top:-3px}
 .campaign-history-page .history-actions{grid-column:1/-1!important;justify-self:stretch!important;display:grid!important;grid-template-columns:1fr 1fr;gap:8px!important;margin-top:2px}
 .campaign-history-page .history-actions .btn{width:100%!important;min-width:0!important;min-height:44px!important}
}
@media(max-width:420px){
 .campaign-history-page .history-archive-card>.section-head{display:block!important}
 .campaign-history-page .history-archive-card>.section-head .pill{display:inline-flex!important;margin-top:10px}
 .campaign-history-page .history-list{padding:8px!important}
 .campaign-history-page .history-row{padding:14px!important}
 .campaign-history-page .history-actions{grid-template-columns:1fr!important}
}
.history-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex-wrap:wrap}.history-actions .btn{min-width:58px}.history-remove{border-color:#ead7d7!important;color:#a55f64!important;background:#fff!important}.history-remove:hover{background:#fff5f5!important;border-color:#dfbfc2!important}@media(max-width:760px){.history-row{display:grid!important;grid-template-columns:auto 1fr!important}.history-status{grid-column:2}.history-actions{grid-column:1/-1;justify-content:flex-start}.history-actions .btn{min-width:72px}}
.creator-registry-card .table-wrap{border:0!important;border-radius:16px!important;background:transparent!important;overflow:auto}
.creator-registry-card table{min-width:1180px!important;border-collapse:separate!important;border-spacing:0 8px!important}
.creator-registry-card th{background:#f7f9fb!important;border:0!important;padding:11px 12px!important;color:#707681!important}
.creator-registry-card th:first-child{border-radius:12px 0 0 12px}.creator-registry-card th:last-child{border-radius:0 12px 12px 0}
.creator-registry-card td{background:#fff!important;border-top:1px solid #edf0f3!important;border-bottom:1px solid #edf0f3!important;padding:13px 12px!important;vertical-align:middle!important}
.creator-registry-card tr td:first-child{border-left:1px solid #edf0f3!important;border-radius:16px 0 0 16px}.creator-registry-card tr td:last-child{border-right:1px solid #edf0f3!important;border-radius:0 16px 16px 0}
.creator-registry-card tbody tr{transition:transform .16s ease,box-shadow .16s ease}
.creator-registry-card tbody tr:hover{transform:translateY(-1px)}
.creator-registry-card tbody tr:hover td{box-shadow:0 8px 28px rgba(30,45,60,.055)}
.creator-row-main{display:flex;align-items:center;gap:10px;min-width:175px}.creator-row-avatar{width:42px;height:42px;border-radius:13px;overflow:hidden;flex:0 0 42px;background:linear-gradient(145deg,#eafcff,#eef0ff);display:grid;place-items:center;color:#52606b;font-size:12px;font-weight:950;border:1px solid #e6edf1}.creator-row-avatar img{width:100%;height:100%;object-fit:cover}.creator-row-name{font-size:12px;font-weight:950;letter-spacing:-.01em}.creator-row-code{font-size:8px;color:#989da5;margin-top:3px;white-space:nowrap}.creator-row-channel{display:inline-flex;align-items:center;gap:6px;font-weight:850;color:#4d5660}.creator-row-channel i{width:7px;height:7px;border-radius:50%;background:#e84fa2;display:inline-block}.creator-metric{font-weight:900;font-size:10px}.creator-metric-sub{display:block;font-size:8px;color:#9a9fa7;margin-top:3px}.fit-ring{--fit:50;--fit-color:#27b892;width:58px;height:58px;border-radius:50%;background:conic-gradient(var(--fit-color) calc(var(--fit)*1%),#edf1f4 0);display:grid;place-items:center;position:relative;box-shadow:0 8px 18px rgba(39,184,146,.10)}.fit-ring:after{content:"";position:absolute;inset:6px;border-radius:50%;background:#fff}.fit-ring b,.fit-ring span{position:relative;z-index:1}.fit-ring b{font-size:16px;letter-spacing:-.05em}.fit-ring span{font-size:7px;color:#8b929a;margin-top:-13px}.fit-stack{display:flex;align-items:center;gap:10px}.fit-status{font-size:8px;font-weight:900;color:#66717a;line-height:1.3}.fit-status strong{display:block;color:#20272d;font-size:9px}.dim-list{display:grid;gap:5px;min-width:190px}.dim-line{display:grid;grid-template-columns:112px 1fr 31px;align-items:center;gap:7px;font-size:8px;color:#626b74}.dim-line b{font-size:8px;color:#4a535c}.dim-bar{height:5px;border-radius:99px;background:#edf1f3;overflow:hidden}.dim-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#54d5c0,#3d93ef)}.dim-line.risk .dim-bar i{background:linear-gradient(90deg,#f1b35d,#e77878)}.dim-line strong{text-align:right;font-size:8px;color:#293139}.fit-summary{width:285px;max-width:285px;background:linear-gradient(135deg,#f5fffd,#f5f9ff);border:1px solid #e1efed;border-radius:14px;padding:10px 12px}.fit-summary-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px}.fit-summary-title{font-size:9px;font-weight:950;color:#24323a}.fit-summary-badge{font-size:7px;font-weight:950;padding:4px 7px;border-radius:999px;background:#e9faf5;color:#16886d}.fit-summary p{margin:0;color:#59646c;font-size:8px;line-height:1.5}.fit-summary .next{margin-top:6px;padding-top:6px;border-top:1px solid #dcebe9;color:#26343b}.fit-summary .next b{color:#16886d}.fit-details{margin-top:7px}.fit-details summary{cursor:pointer;list-style:none;font-size:8px;font-weight:900;color:#35718a}.fit-details summary::-webkit-details-marker{display:none}.fit-details summary:before{content:'+';display:inline-grid;place-items:center;width:15px;height:15px;margin-right:5px;border-radius:5px;background:#eaf8fb;color:#28758a;font-size:10px}.fit-details[open] summary:before{content:'−'}.fit-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:7px}.fit-detail-item{padding:7px;border:1px solid #e7ecef;border-radius:9px;background:#fff}.fit-detail-item b{font-size:8px}.fit-detail-item p{margin:3px 0 0;font-size:7.5px;line-height:1.45;color:#69727a}.creator-actions{display:flex;flex-direction:column;gap:6px}.creator-actions .btn{padding:8px 10px;font-size:8px}.creator-actions a{font-size:8px;text-align:center}.creator-registry-card .pill{font-size:7px!important;padding:4px 7px!important}
.creator-registry-card .table-wrap{overflow:auto;border:1px solid #e8edf0;border-radius:16px;background:#fff}.creator-registry-card table{min-width:1180px;border-collapse:separate;border-spacing:0}.creator-registry-card thead th{background:#f7fafb;color:#7a858d;font-size:7px;letter-spacing:.09em;text-transform:uppercase;border-bottom:1px solid #e8edf0;padding:11px 10px}.creator-registry-card tbody tr{transition:.16s}.creator-registry-card tbody tr:hover{background:#fbfefe}.creator-registry-card tbody td{padding:13px 10px;border-bottom:1px solid #eef1f3;vertical-align:middle}.creator-registry-card tbody tr:last-child td{border-bottom:0}.fit-summary{box-shadow:0 5px 18px rgba(20,50,60,.04)}.fit-summary-title{letter-spacing:-.01em}.fit-summary p{font-size:8.5px}.fit-summary .next{font-size:8.5px}.fit-details summary{display:inline-flex;align-items:center;gap:2px}.fit-detail-item{box-shadow:0 2px 7px rgba(20,40,50,.025)}

@media(max-width:900px){.creator-registry-card{padding:12px!important}.fit-summary{width:260px;max-width:260px}}

/* Creator registry v3 · executive rows, deeper details */
.creator-registry-v3{border-radius:24px!important;padding:18px!important;background:#fff!important;box-shadow:0 16px 50px rgba(22,30,42,.055)!important}
.creator-registry-v3 .creator-registry-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:14px}
.creator-fit-list{border:1px solid #e8edf1;border-radius:18px;overflow:hidden;background:#fbfcfd}
.creator-fit-list-head{display:grid;grid-template-columns:minmax(240px,1.45fr) 105px 95px 95px minmax(260px,1.6fr) 125px;gap:14px;align-items:center;padding:12px 16px;background:#17191d;color:#aeefff;font-size:8.5px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid #17191d}.creator-header-counters{display:flex;align-items:stretch;gap:8px}.creator-count-pill{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:70px;min-height:46px;padding:6px 10px;border:1px solid #e3e7ea;border-radius:12px;background:#fff;line-height:1.05}.creator-count-pill b{display:block;font-size:16px;line-height:1;font-weight:950;letter-spacing:-.04em;color:#17232b}.creator-count-pill small{display:block;margin-top:5px;font-size:7px;line-height:1;text-transform:uppercase;letter-spacing:.1em;font-weight:900;color:#65717a}.creator-count-pill.cyan{background:#eafaff;border-color:#cceff7}.creator-count-pill.cyan b{color:#17232b}.creator-count-pill.cyan small{color:#527684}
.creator-fit-row{background:#fff;border-top:1px solid #e8edf1}
.creator-fit-row:first-of-type{border-top:0}
.creator-fit-main{display:grid;grid-template-columns:minmax(240px,1.45fr) 105px 95px 95px minmax(260px,1.6fr) 125px;gap:14px;align-items:center;padding:15px 16px;min-height:105px}
.creator-fit-row:hover{background:#fcffff}
.creator-identity{display:flex;align-items:center;gap:10px;min-width:0}.creator-check{width:18px;flex:0 0 18px}.creator-check input{display:none}.creator-check span{display:block;width:17px;height:17px;border:1px solid #cbd4da;border-radius:6px;background:#fff;position:relative;cursor:pointer}.creator-check input:checked+span{background:#15212a;border-color:#15212a}.creator-check input:checked+span:after{content:'✓';position:absolute;color:#fff;font-size:11px;font-weight:900;left:3px;top:0px}.creator-handle{font-size:8px;color:#9aa2aa;margin-top:2px}.creator-mini-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:5px;color:#68727b;font-size:8px}.creator-mini-meta span{padding-right:7px;border-right:1px solid #e3e7ea}.creator-mini-meta span:last-child{border-right:0}.creator-score{display:flex;flex-direction:column;align-items:flex-start}.creator-score-number{font-size:27px;line-height:1;font-weight:950;letter-spacing:-.06em;color:#17232b}.creator-score-number small{font-size:8px;color:#9aa3aa;letter-spacing:0;margin-left:2px}.creator-score-label{margin-top:5px;font-size:7.5px;font-weight:900;color:#65717a}.creator-fit-row.strong .creator-score-number{color:#12a985}.creator-fit-row.good .creator-score-number{color:#2585c7}.creator-fit-row.adjust .creator-score-number{color:#d38b35}.creator-stat{border-left:1px solid #e9edef;padding-left:13px}.creator-stat b{display:block;font-size:18px;font-weight:900;letter-spacing:-.04em}.creator-stat span{display:block;margin-top:3px;font-size:8px;color:#89939a;text-transform:uppercase;letter-spacing:.08em}.creator-read{min-width:0}.creator-read-top{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.decision-badge,.gap-badge{display:inline-flex;align-items:center;padding:4px 7px;border-radius:999px;font-size:8px;font-weight:950}.decision-badge.strong{background:#e7faf4;color:#128b6f}.decision-badge.good{background:#eaf5ff;color:#2b78ae}.decision-badge.adjust{background:#fff4e5;color:#b56e19}.gap-badge{background:#f1f4f6;color:#68747c}.creator-read p{margin:6px 0 0;font-size:9px;line-height:1.45;color:#53606a}.creator-next{margin-top:5px;font-size:8.2px;line-height:1.4;color:#26343b}.creator-next b{color:#168c70}.creator-actions-v3{display:flex;align-items:center;justify-content:flex-end;gap:6px}.creator-actions-v3 .btn{padding:8px 12px;font-size:8px;border-radius:9px}.creator-actions-v3 .remove-creator-btn{border-color:#ead7d7;color:#a55f64;background:#fff}.creator-actions-v3 .remove-creator-btn:hover{background:#fff5f5;border-color:#dfbfc2}.social-link{font-size:8px;color:#2a6e8c;text-decoration:none;padding:8px 9px;border:1px solid #dce7eb;border-radius:9px;background:#fff}.social-link:hover{background:#f4fbfd}.creator-fit-details{padding:0 16px 16px 60px;background:#fbfcfd;border-top:1px dashed #e2e8eb}.creator-detail-grid{display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:8px;padding-top:12px}.creator-detail{background:#fff;border:1px solid #e7ecef;border-radius:11px;padding:9px}.creator-detail-top{display:flex;align-items:center;justify-content:space-between;gap:5px;font-size:8px;color:#59666f}.creator-detail-top b{font-size:11px;color:#202b32}.creator-detail-bar{height:5px;border-radius:99px;background:#edf1f3;overflow:hidden;margin:7px 0}.creator-detail-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#50cdb6,#3d8fe5)}.creator-detail-bar.risk i{background:linear-gradient(90deg,#efb25d,#e27d7d)}.creator-detail p{margin:0;font-size:8px;line-height:1.4;color:#7b858d;min-height:30px}.creator-detail-action{margin-top:5px;padding-top:5px;border-top:1px solid #edf0f2;font-size:8px;line-height:1.4;color:#315f67}.creator-detail p,.creator-detail-action{font-size:8px!important;line-height:1.35!important}.creator-detail-action{margin-top:6px!important}.creator-detail-bottom{gap:8px!important}.creator-detail-bottom>div{background:#17191d!important;color:#fff!important;border:1px solid #17191d!important;border-radius:10px!important;padding:10px 11px!important}.creator-detail-bottom>div>b{color:#aeefff!important;font-weight:900!important}.creator-detail-bottom>div>span{color:#fff!important}.creator-detail-top span{font-size:8px!important}.creator-detail-top b{font-size:12px!important}.creator-detail-bottom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:8px}.creator-detail-bottom>div{padding:10px 11px;border-radius:11px;background:#111820;border:1px solid #111820;box-shadow:0 4px 12px rgba(15,24,32,.08)}.creator-detail-bottom b{display:block;font-size:8px;color:#aeefff;margin-bottom:4px}.creator-detail-bottom span{display:block;font-size:8.5px;line-height:1.45;color:#fff}.creator-detail-bottom>div:nth-child(3){background:#111820}
@media(max-width:1100px){.creator-fit-list-head,.creator-fit-main{grid-template-columns:minmax(220px,1.4fr) 90px 85px 85px minmax(220px,1.4fr) 110px}.creator-detail-grid{grid-template-columns:repeat(3,minmax(130px,1fr))}}
@media(max-width:760px){.creator-fit-list-head{display:none}.creator-fit-main{grid-template-columns:1fr 80px 80px;gap:10px}.creator-read{grid-column:1/-1}.creator-actions-v3{grid-column:1/-1;justify-content:flex-start}.creator-fit-details{padding-left:16px}.creator-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.creator-detail-bottom{grid-template-columns:1fr}.creator-registry-v3 .creator-registry-head{flex-direction:column}}

.gen-code-individual-table th,.gen-code-individual-table td{font-size:9px;padding:8px 9px;vertical-align:middle}.gen-code-individual-table input,.gen-code-individual-table select{min-height:34px!important;padding:7px 8px!important;font-size:10px!important}.performance-type-picker{border:1px solid #dcecef;background:#f8fcfd;border-radius:12px;padding:14px;margin-top:14px}.performance-type-picker .type-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.performance-type-option{display:flex;align-items:center;gap:8px;border:1px solid #dfe5e8;border-radius:9px;background:#fff;padding:10px 11px;cursor:pointer}.performance-type-option input{margin:0;accent-color:#1479b7}.performance-type-option b{font-size:10px}.performance-type-option small{display:block;font-size:8px;color:#7b858d;margin-top:2px}@media(max-width:760px){.performance-type-picker .type-grid{grid-template-columns:1fr}.performance-type-option{min-height:42px}}.ecommerce-panel{border-color:#dcecef!important}.ecommerce-panel .signal-box{background:#f8fcfd;border-color:#dcecef}.ecommerce-panel .hint{font-size:8px;color:#7b858d}.ecommerce-panel .actions{margin-top:14px}.creator-ecommerce-box{grid-column:1/-1;border:1px solid #dcecef;background:#f8fcfd;border-radius:12px;padding:13px}.creator-ecommerce-box .label{color:#46717d}.ecom-channel-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin-top:9px}.ecom-channel-option{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:7px!important;min-height:36px;padding:7px 9px;border:1px solid #dfe5e8;border-radius:8px;background:#fff;cursor:pointer}.ecom-channel-option input{width:13px!important;min-height:13px!important;margin:0!important;accent-color:#1479b7}.ecom-channel-option span{font-size:10px!important;font-weight:750!important}.ecom-channel-selected{font-size:9px;color:#61717a;margin-top:8px}.ecom-linked-note{font-size:9px;color:#6f7b82;line-height:1.5;margin-top:8px}@media(max-width:900px){.ecom-channel-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.gen-code-individual-table{min-width:0;width:100%;display:block}.gen-code-individual-table thead{display:none}.gen-code-individual-table tbody,.gen-code-individual-table tr,.gen-code-individual-table td{display:block;width:100%}.gen-code-individual-table tr{border:1px solid #dfe5e8;border-radius:12px;padding:10px;margin-bottom:10px;background:#fff}.gen-code-individual-table td{border:0!important;padding:5px 0!important}.gen-code-individual-table td:before{display:block;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:#71808a;font-weight:800;margin-bottom:4px}.gen-code-individual-table td:nth-child(1):before{content:'Creator'}.gen-code-individual-table td:nth-child(2):before{content:'Discount'}.gen-code-individual-table td:nth-child(3):before{content:'Value'}.gen-code-individual-table td:nth-child(4):before{content:'Commission'}.gen-code-individual-table select,.gen-code-individual-table input{width:100%!important;max-width:100%!important;min-width:0!important}.gen-code-panel,.performance-entry-section{overflow:hidden}.gen-code-panel .form-grid,.performance-entry-section .form-grid{min-width:0}.gen-code-panel .field,.performance-entry-section .field{min-width:0}.gen-code-panel input,.gen-code-panel select,.gen-code-panel textarea,.performance-entry-section input,.performance-entry-section select,.performance-entry-section textarea{width:100%;max-width:100%;min-width:0;box-sizing:border-box}.gen-code-panel .section-head{gap:10px}.gen-code-panel .section-head>div{min-width:0}.gen-code-panel .section-head h2,.gen-code-panel .section-head p{overflow-wrap:anywhere}.ecommerce-panel .form-grid{grid-template-columns:1fr!important}.ecommerce-panel .actions .btn{width:100%}.ecom-channel-grid{grid-template-columns:1fr 1fr}.creator-ecommerce-box{padding:11px}.ecom-channel-option span{font-size:9px!important}}
.next-investment-card .signal-box h3{font-size:14px;letter-spacing:-.02em}.next-investment-card .signal-box p{line-height:1.5}@media(max-width:760px){.next-investment-card .grid.g3{grid-template-columns:1fr!important}.next-investment-card .section-head{align-items:flex-start}.next-investment-card .section-head .pill{flex:0 0 auto}.next-investment-card .signal-box{padding:12px!important}.performance-entry-section .actions{flex-wrap:wrap}.performance-entry-section .actions .btn{width:100%}}
/* KOL IDS · ACCESS GATE · 20261004
   Clear commercial state without pretending a pending paid account is active. */
.access-gate{min-height:100vh;display:grid;place-items:center;padding:32px 20px;background:radial-gradient(900px 520px at 50% -20%,rgba(255,255,255,.95),transparent 62%),linear-gradient(180deg,#f8f9fa,#eef0f2);color:#17171b}
.access-gate-shell{width:min(720px,100%)}
.access-gate-brand{display:flex;align-items:center;gap:11px;margin:0 0 16px 4px}
.access-gate-mark{width:34px;height:34px;border-radius:10px;background:#17171b;color:#fff;display:grid;place-items:center;font-size:13px;font-weight:950;box-shadow:0 8px 24px rgba(20,20,24,.14)}
.access-gate-brand b{display:block;font-size:14px;letter-spacing:-.02em}.access-gate-brand span{display:block;margin-top:2px;color:#8a8b92;font-size:8px;letter-spacing:.1em;text-transform:uppercase;font-weight:800}
.access-gate-card{background:rgba(255,255,255,.98);border:1px solid #dfe3e7;border-radius:24px;padding:42px;box-shadow:0 26px 80px rgba(20,22,28,.09)}
.access-gate-status{display:inline-flex;align-items:center;gap:8px;border:1px solid #e4e5e8;border-radius:999px;padding:7px 10px;font-size:8px;font-weight:950;letter-spacing:.13em;color:#666870;background:#fafafa}
.access-gate-status span{width:6px;height:6px;border-radius:50%;background:#8a8b91}.access-gate-status.pending span{background:#b67a1d}.access-gate-status.expired span{background:#b94d58}
.access-gate-kicker{margin-top:26px;color:#96979d;font-size:8px;font-weight:950;letter-spacing:.18em}
.access-gate-card h1{margin:9px 0 12px;font-size:35px;line-height:1.08;letter-spacing:-.045em;color:#111318}.access-gate-copy{font-weight:500}
.access-gate-copy{max-width:640px;margin:0;color:#5f666d;font-size:14px;line-height:1.75}
.access-gate-note{margin-top:22px;padding:15px 16px;border:1px solid #e8e8e9;border-radius:14px;background:#f8f8f8}.access-gate-note b{display:block;font-size:11px}.access-gate-note span{display:block;margin-top:4px;color:#777980;font-size:10px;line-height:1.55}
.access-gate-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:20px}.access-gate-meta>div{min-width:0;border:1px solid #e3e6e9;border-radius:13px;padding:13px 14px;background:#fff}.access-gate-meta span{display:block;color:#8b9298;font-size:8px;letter-spacing:.14em;font-weight:900;margin-bottom:6px}.access-gate-meta b{display:block;font-size:12px;color:#15171a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.access-gate-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:22px}.access-gate-actions .btn{min-height:42px;padding:10px 15px}.access-gate-actions .btn.ghost{border-color:transparent;color:#777980}.access-gate-foot{margin-top:18px;color:#8f969c;font-size:9px;line-height:1.5}
@media(max-width:620px){.access-gate{padding:18px 12px;place-items:start center}.access-gate-shell{margin-top:10vh}.access-gate-card{padding:26px 20px;border-radius:20px}.access-gate-card h1{font-size:28px}.access-gate-meta{grid-template-columns:1fr}.access-gate-actions{display:grid;grid-template-columns:1fr}.access-gate-actions .btn{width:100%}.access-gate-brand{margin-left:2px}}

/* V25 · Translucent Luxury Surface System */
:root{--glass:rgba(255,255,255,.62);--glass-strong:rgba(255,255,255,.76);--glass-soft:rgba(255,255,255,.46);--glass-line:rgba(120,130,140,.16);--glass-shadow:0 18px 55px rgba(25,30,38,.055)}
body{background:radial-gradient(900px 520px at 84% -8%,rgba(79,215,232,.11),transparent 62%),radial-gradient(720px 420px at 8% 18%,rgba(128,103,232,.035),transparent 65%),linear-gradient(180deg,#fbfcfd,#f4f5f7)}
.kol-top{background:rgba(255,255,255,.72)!important;background-color:rgba(255,255,255,.72)!important;background-image:none!important;backdrop-filter:blur(18px) saturate(125%)!important;-webkit-backdrop-filter:blur(18px) saturate(125%)!important;border-bottom-color:rgba(160,168,176,.18)!important;box-shadow:0 8px 30px rgba(20,22,30,.025)}
.card,.campaign-intake,.campaign-reference-page .campaign-intake{background:rgba(255,255,255,.66);border-color:rgba(160,168,176,.18);box-shadow:var(--glass-shadow);backdrop-filter:blur(16px) saturate(120%);-webkit-backdrop-filter:blur(16px) saturate(120%)}
.metric,.creator-fit-card,.creator-fit-recovery,.table-wrap,.signal-box,.weight-box,.campaign-intake .objective,.campaign-intake .choice,.campaign-reference-page .objective,.campaign-reference-page .choice,.top-chip,.side-foot{background:rgba(255,255,255,.58);border-color:rgba(150,160,170,.16)}
.metric,.creator-fit-card{box-shadow:0 10px 34px rgba(25,30,38,.035)}
.table-wrap{box-shadow:0 10px 34px rgba(25,30,38,.03)}
th{background:rgba(248,249,250,.56)}
.field input,.field textarea,.field select,.campaign-intake .field input,.campaign-intake .field textarea,.campaign-intake .field select,.campaign-reference-page .field input,.campaign-reference-page .field select,.campaign-reference-page .field textarea{background:rgba(255,255,255,.62);border-color:rgba(150,160,170,.2)}
.btn{background:rgba(255,255,255,.58);border-color:rgba(135,145,155,.2);box-shadow:0 5px 18px rgba(25,30,38,.025)}
.btn.primary{background:rgba(23,23,27,.88);border-color:rgba(23,23,27,.78);box-shadow:0 8px 24px rgba(20,20,25,.11)}
.btn.cyan{background:rgba(79,215,232,.68);border-color:rgba(79,215,232,.52);box-shadow:0 8px 24px rgba(79,215,232,.12)}
.chip,.pill,.selected-chip,.gen-code-badge{background:rgba(255,255,255,.55);border-color:rgba(150,160,170,.17)}
.chip.selected,.pill.cyan{background:rgba(227,251,254,.62);border-color:rgba(183,237,243,.62)}
.progress{background:rgba(220,224,228,.52)}
.score-ring{background:conic-gradient(rgba(79,215,232,.78) calc(var(--score)*1%),rgba(220,224,228,.5) 0)}
.score-ring:after{background:rgba(255,255,255,.78)}
.dark-card{background:linear-gradient(135deg,rgba(23,23,27,.92),rgba(41,40,47,.82));border:1px solid rgba(255,255,255,.07);box-shadow:0 25px 70px rgba(20,20,26,.12);backdrop-filter:blur(18px) saturate(115%);-webkit-backdrop-filter:blur(18px) saturate(115%)}
.dark-card .reason{background:rgba(255,255,255,.055)}
.kol-side{background:rgba(255,255,255,.78);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);border-right-color:rgba(160,168,176,.18)}
.kol-nav button.active{background:rgba(223,245,255,.62);border-color:rgba(188,230,243,.55)}
.kol-logo{background:linear-gradient(145deg,rgba(244,255,255,.92),rgba(79,215,232,.72));box-shadow:0 9px 28px rgba(79,215,232,.16)}
.campaign-reference-page .intake-section{border-bottom-color:rgba(160,168,176,.14)}
.campaign-reference-page .selected-strip,.campaign-intake .selected-strip,.workflow-side-note{background:rgba(247,249,250,.5);border-color:rgba(160,168,176,.15)}
.reason,.creator-fit-reason{background:rgba(242,251,252,.55)}
` ;document.head.appendChild(s)}
function initials(){const s=S.session?.user?.email||S.org?.name||'KOL';return s.split(/[^A-Za-z0-9]+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'K'}
async function loadContext(){const {data,error}=await sb.rpc('bootstrap_workspace');if(error)throw error;S.org=data.organization;S.membership=data.membership;S.plan=data.plan;S.subscription=data.subscription;S.access=Boolean(data.access_granted);S.accessReason=data.access_reason||null;return data}
async function refresh(){if(!S.org?.id)return;
 const orderBy={campaigns:'created_at',audiences:'created_at',creators:'created_at',creator_decisions:'created_at',review_runs:'created_at',generated_impacts:'created_at',intelligence_runs:'created_at',portfolio_runs:'created_at',performance_observations:'observed_at',prediction_ledger:'predicted_at'};
 const q=async(table)=>{const column=orderBy[table]||'created_at';const {data,error}=await sb.from(table).select('*').eq('organization_id',S.org.id).order(column,{ascending:false});if(error){if(['intelligence_runs','portfolio_runs','performance_observations','prediction_ledger'].includes(table))return [];throw error}return data||[]};
 [S.campaigns,S.audiences,S.creators,S.decisions,S.reviews,S.impacts,S.engineRuns,S.portfolioRuns,S.performance,S.predictions]=await Promise.all([q('campaigns'),q('audiences'),q('creators'),q('creator_decisions'),q('review_runs'),q('generated_impacts'),q('intelligence_runs'),q('portfolio_runs'),q('performance_observations'),q('prediction_ledger')]);
 if(!S.selectedCampaign)S.selectedCampaign=S.campaigns[0]||null;if(S.selectedCampaign)S.selectedAudience=S.audiences.find(x=>x.campaign_id===S.selectedCampaign.id)||S.audiences[0]||null}
const pages=[
 {label:'Campaign',group:'Workflow',icon:'01'},
 {label:'Audience',group:'Workflow',icon:'02'},
 {label:'Creators',group:'Workflow',icon:'03'},
 {label:'Decision',group:'Workflow',icon:'04'},
 {label:'Performance',group:'Workflow',icon:'05'},
 {label:'Business Impact',group:'Workflow',icon:'06'},
 {label:'Reports',group:'Workflow',icon:'07'},
 {label:'Campaign History',group:'Archive',icon:'08'}
];
function shell(){
 const descriptions=['Define campaign context & objective','Define the audience persona','Add creators manually and build creator intelligence','Calculate fit, explain the result & select creators','Measure digital and offline outcomes','Translate outcomes into business impact','Export the decision and impact report','Review saved campaigns and return to any campaign context'];
 const analysisId='AN-'+String(S.session?.user?.id||'').replace(/[^A-Za-z0-9]/g,'').slice(0,10).toUpperCase();
 root.innerHTML=`<div class="kol-shell"><aside class="kol-side" id="side"><div class="kol-brand"><div><b>KOL IDS™</b><small>INVESTMENT DECISION INTELLIGENCE</small></div></div><nav class="kol-nav">${pages.map((p,i)=>'<button data-page="'+i+'" class="'+(i===S.page?'active':'')+'"><span class="nav-icon">'+String(i+1).padStart(2,'0')+'</span><span class="nav-copy"><strong>Step '+String(i+1).padStart(2,'0')+' · '+p.label+'</strong><small>'+descriptions[i]+'</small></span></button>').join('')}</nav><div class="side-spacer"></div><div class="side-foot"><div class="org">System status</div><div class="meta">Connected</div><div class="side-actions"><button id="logout">Sign out</button></div></div></aside><main class="kol-main"><header class="kol-top"><div class="top-title-wrap"><button class="mobile-menu" id="mobile-menu" aria-label="Open menu">Menu</button><div><h1 id="title">Campaign</h1><p id="copy">Define campaign context & objective</p></div></div><div class="top-actions"><span class="top-email">${esc(S.session?.user?.email||'')}</span><span class="top-chip">${esc(analysisId)}</span><button class="btn new-analysis-btn" id="new-analysis">New analysis</button></div></header><div id="content" class="kol-content"></div></main></div>`;
 document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{
  const target=Number(b.dataset.page);
  // The 7-step workspace is intentionally non-linear. Users can open any step at any time.
  // Data validation happens when saving/running an action, not when navigating between steps.
  S.page=target;
  document.getElementById('side')?.classList.remove('open');
  renderPage();
});
 document.getElementById('mobile-menu').onclick=()=>document.getElementById('side')?.classList.toggle('open');
 
 document.getElementById('logout').onclick=()=>sb.auth.signOut();
 document.getElementById('new-analysis').onclick=()=>{S.selectedCampaign=null;S.selectedAudience=null;S.analysis=null;S.creatorBatch=[];S.page=0;renderPage();window.scrollTo({top:0,behavior:'smooth'})};
 // FINAL DOM GUARD: if any late callback ever paints the wrong step, restore the owner renderer.
 if(!window.__KOL_IDS_ROUTE_GUARD_BOUND__){
   window.__KOL_IDS_ROUTE_GUARD_BOUND__=true;
   const guard=new MutationObserver(()=>{
     const mount=document.getElementById('content');
     if(!mount||window.__KOL_IDS_ROUTE_GUARD_BUSY__)return;
     const page=Number(S.page);
     if(page===5 && mount.querySelector('[data-kol-report-page]')){
       window.__KOL_IDS_ROUTE_GUARD_BUSY__=true;
       try{renderBusinessImpactPage(mount);mount.dataset.kolPage='business-impact';}finally{window.__KOL_IDS_ROUTE_GUARD_BUSY__=false}
     }else if(page===6 && mount.querySelector('[data-kol-business-impact]')){
       window.__KOL_IDS_ROUTE_GUARD_BUSY__=true;
       try{reports(mount);mount.dataset.kolPage='reports';}finally{window.__KOL_IDS_ROUTE_GUARD_BUSY__=false}
     }
   });
   guard.observe(document.getElementById('content'),{childList:true,subtree:true});
   window.__KOL_IDS_ROUTE_GUARD__=guard;
 }
 renderPage()
}
async function invite(){if(!['owner','admin'].includes(String(S.membership?.role||''))){toast('Owner/Admin permission required','error');return}const email=prompt('Team member email:');if(!email)return;const {data,error}=await sb.rpc('invite_member',{p_email:email.trim().toLowerCase()});if(error)toast(error.message,'error');else toast(data?.message||'Invitation recorded.','good')}
function headerText(){const copy=['Define campaign context, objective and brand guardrails.','Build a realistic audience persona the brand wants to reach.','Add creator information manually, then build the intelligence used by the decision engine.','Review calculated creator fit, reasons and select who to work with.','Review and record digital/online and event/offline performance. No step is locked.','Review and calculate business impact from available campaign outcomes. No step is locked.','Review, save and export available evidence, decisions and impact. No step is locked.','Review saved campaigns and return to any campaign context.'];const p=pages[S.page]||pages[0],title=document.getElementById('title'),copyEl=document.getElementById('copy');if(title)title.textContent=p.label;if(copyEl)copyEl.textContent=copy[S.page]||copy[0]}
function renderPage(){
 headerText();
 document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',Number(b.dataset.page)===S.page));
 const c=document.getElementById('content');
 if(!c)return;
 // ABSOLUTE ROUTE GUARD: every navigation starts from an empty mount.
 // This prevents a late/stale renderer from visually surviving a step change.
 c.innerHTML='';
 const target=Number(S.page);
 // HARD ROUTE INVARIANT: each step owns its renderer. Never allow Reports to render into Step 06.
 c.dataset.kolPage=target===5?'business-impact':target===6?'reports':target===4?'performance':'rendering';
 if(target===0)return campaignIntake(c);
 if(target===1)return audience(c);
 if(target===2)return creators(c);
 if(target===3)return decision(c);
 if(target===4){renderPerformancePage(c);return;}
 if(target===5){renderBusinessImpactPage(c);return;}
 if(target===6){reports(c);return;}
 if(target===7){campaignHistory(c);return;}
 return campaignIntake(c);
}
async function removeCampaignFromHistory(id){
 const row=S.campaigns.find(x=>String(x.id)===String(id));
 if(!row)return;
 const name=row.name||'this campaign';
 if(!window.confirm(`Remove ${name} from Campaign History?\n\nThis permanently removes the campaign and its campaign-linked records from this workspace.`))return;
 const btn=document.querySelector(`[data-history-remove="${String(id).replace(/"/g,'\\"')}"]`);
 if(btn?.dataset.busy==='1')return;
 if(btn){btn.dataset.busy='1';btn.disabled=true;btn.textContent='Removing…'}
 try{
   const q=await sb.from('campaigns').delete().eq('id',id).eq('organization_id',S.org.id);
   if(q.error)throw q.error;
   const wasSelected=String(S.selectedCampaign?.id||'')===String(id);
   if(wasSelected){S.selectedCampaign=null;S.selectedAudience=null;S.analysis=null;S.creatorBatch=[];S.localFitRows=[];S.creatorEditTarget=null;S.performanceEditTarget=null}
   await refresh();
   toast(`${name} removed from campaign history`,'good');
   if(S.page===7)renderPage();else renderPage();
 }catch(err){
   toast(err?.message||'Could not remove campaign. No changes were kept.','error');
 }finally{
   if(btn&&document.body.contains(btn)){btn.dataset.busy='0';btn.disabled=false;btn.textContent='Remove'}
 }
}
async function markCampaignComplete(){
 const campaign=S.selectedCampaign;
 if(!campaign?.id||!S.org?.id)return false;
 if(String(campaign.status||'draft').toLowerCase()==='complete')return true;
 try{
   // Completion is an explicit Step 07 action. Use a security-definer RPC so
   // RLS cannot silently turn a successful-looking UPDATE into a no-op.
   const rpc=await sb.rpc('complete_campaign',{p_campaign_id:campaign.id});
   if(rpc.error)throw rpc.error;

   await refresh();
   const fresh=S.campaigns.find(x=>String(x.id)===String(campaign.id));
   if(!fresh||String(fresh.status||'').toLowerCase()!=='complete'){
     throw new Error('Campaign completion could not be confirmed.');
   }
   S.selectedCampaign=fresh;
   return true;
 }catch(err){
   console.warn('Could not mark campaign complete:',err?.message||err);
   return false;
 }
}

function campaignHistory(c){
 const rows=[...S.campaigns].sort((a,b)=>new Date(b.updated_at||b.created_at||0)-new Date(a.updated_at||a.created_at||0));
 const date=v=>{if(!v)return '·';const d=new Date(v);return Number.isNaN(d.getTime())?'·':d.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'})};
 const objective=x=>String(x?.payload?.objective||x?.payload?.objectives?.[0]||x?.payload?.goal||'No objective').trim();
 const status=x=>String(x?.status||'draft').toUpperCase();
 const statusClass=x=>String(x?.status||'draft').toLowerCase()==='complete'?'complete':'draft';
 c.innerHTML=`<div class="campaign-history-page">
  <div class="hero history-hero"><div><div class="kicker">CAMPAIGN HISTORY</div><h2>Saved campaign archive</h2><p>One subscription can contain multiple campaigns. Each campaign keeps its own audience, creators, decisions, performance, business impact and report.</p></div><div class="hero-actions"><button class="btn cyan" id="history-new-campaign">+ New campaign</button></div></div>
  <div class="history-rule"></div>
  <section class="card history-archive-card">
   <div class="section-head"><div><div class="label">WORKSPACE RECORD</div><h2>Campaign history</h2><p class="sub">Open a previous campaign to continue from its saved context. ${rows.length} campaign${rows.length===1?'':'s'} recorded.</p></div><span class="pill cyan">${rows.length} SAVED</span></div>
   <div class="history-list">${rows.length?rows.map((x,i)=>`<div class="history-row"><div class="history-index">${String(i+1).padStart(2,'0')}</div><div class="history-main"><b>${esc(x.name||'Untitled Campaign')}</b><small>${esc(String(x.status||'draft').toLowerCase())} · ${esc(objective(x))}</small><small>Created ${date(x.created_at)} · Updated ${date(x.updated_at||x.created_at)}</small></div><div class="history-status ${statusClass(x)}">${esc(status(x))}</div><div class="history-actions"><button class="btn history-open" type="button" data-history-open="${esc(x.id)}">Open</button><button class="btn danger history-remove" type="button" data-history-remove="${esc(x.id)}">Remove</button></div></div>`).join(''):'<div class="empty history-empty">No saved campaigns yet. Create a campaign and it will appear here automatically.</div>'}</div>
  </section>
 </div>`;
 document.getElementById('history-new-campaign')?.addEventListener('click',()=>{S.selectedCampaign=null;S.selectedAudience=null;S.analysis=null;S.creatorBatch=[];S.page=0;renderPage();window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>document.getElementById('campaign-name')?.focus(),60)});
 document.querySelectorAll('[data-history-open]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.historyOpen;selectCampaign(id);S.page=0;renderPage();window.scrollTo({top:0,behavior:'smooth'})}));
 document.querySelectorAll('[data-history-remove]').forEach(b=>b.addEventListener('click',()=>removeCampaignFromHistory(b.dataset.historyRemove)));
}

function selectCampaign(id){S.selectedCampaign=S.campaigns.find(x=>x.id===id)||null;S.selectedAudience=S.audiences.find(x=>x.campaign_id===id)||null;S.audienceDraft=null;S.analysis=null;renderPage()}
function readiness(){const c=S.selectedCampaign,a=S.selectedAudience;const req=[['Campaign context',!!c],['Audience intelligence',!!a],['Creator records',S.creators.length>0],['Creator Intelligence',S.creators.length>0&&S.creators.every(x=>creatorSignalCoverage(x).required===8)],['Decision weights',decisionWeights().total===100]];return req}
function overview(c){const decisions=S.decisions.filter(x=>!S.selectedCampaign||x.campaign_id===S.selectedCampaign.id);const avgScore=avg(decisions.map(x=>x.score));const conf=avg(decisions.map(x=>x.evidence?.confidence));const rec=decisions.filter(x=>x.decision==='RECOMMENDED').length;const ready=readiness();const completed=ready.filter(x=>x[1]).length;const active=S.selectedCampaign;const health=controlTower(active);c.innerHTML=`<div class="hero"><div><div class="kicker">EXECUTIVE COMMAND CENTER</div><h2>${esc(active?.name||'Build your intelligence workspace')}</h2><p>${active?'Live view of the selected campaign and its decision system.':'Create a campaign to activate the intelligence pipeline.'}</p></div><div class="hero-actions"><button class="btn cyan" id="new-campaign">+ New campaign</button><button class="btn" id="run-now" ${active?'':'disabled'}>Run analysis</button></div></div><div class="grid g4"><div class="metric"><span class="label">Campaigns</span><strong>${S.campaigns.length}</strong><small>Structured campaign contexts</small></div><div class="metric"><span class="label">Creator pool</span><strong>${S.creators.length}</strong><small>Creator intelligence records</small></div><div class="metric"><span class="label">Decision records</span><strong>${decisions.length}</strong><small>Auditable analysis outputs</small></div><div class="metric"><span class="label">Avg decision score</span><strong>${avgScore==null?'·':Math.round(avgScore)}</strong><small>Fit score, not a causal forecast</small></div></div><div class="grid g2" style="margin-top:14px"><section class="card dark-card"><div class="section-head"><div><div class="label">Decision system</div><h2 style="margin-top:6px">${active?'Analysis readiness':'Start with campaign context'}</h2><p class="sub">Every downstream output is traceable to inputs, weights, evidence and risk assumptions.</p></div><div class="score-ring" style="--score:${completed/ready.length*100}"><b>${Math.round(completed/ready.length*100)}%</b></div></div><div class="readiness">${ready.map(x=>`<div class="ready-row"><span class="ready-dot ${x[1]?'ok':'warn'}"></span><span style="font-size:10px">${x[1]?'Ready':'Missing'} · ${x[0]}</span></div>`).join('')}</div><div class="actions"><button class="btn cyan" id="go-decision">Open Decision Engine</button><button class="btn ghost" style="color:#fff;border-color:#44444c" id="go-creator">Open Creator Intelligence</button></div></section><section class="card"><div class="section-head"><div><div class="label">Campaign control</div><h2>Operating health</h2></div><span class="pill ${health.status==='HEALTHY'?'good':health.status==='WATCH'?'warn':'bad'}">${health.status}</span></div><div class="big-number">${health.score}</div><div class="progress" style="margin:12px 0"><i style="width:${health.score}%"></i></div><div class="grid g3"><div><span class="label">Budget</span><div class="mini-stat">${health.budget.pacing}%</div><small class="sub">pacing</small></div><div><span class="label">KPI</span><div class="mini-stat">${health.kpi.score}</div><small class="sub">health</small></div><div><span class="label">Risk</span><div class="mini-stat">${health.risk.score}</div><small class="sub">risk-adjusted</small></div></div><div class="footer-note">Control tower combines timeline, tasks, deliverables, budget pacing, KPI status and open risk exposure.</div></section></div><div class="grid g2" style="margin-top:14px"><section class="card"><div class="section-head"><div><div class="label">Decision distribution</div><h2>Current evidence</h2></div></div>${decisions.length?`<div class="grid g4"><div><span class="label">Recommended</span><div class="mini-stat">${rec}</div></div><div><span class="label">Consider</span><div class="mini-stat">${decisions.filter(x=>x.decision==='CONSIDER').length}</div></div><div><span class="label">Review</span><div class="mini-stat">${decisions.filter(x=>x.decision==='REVIEW REQUIRED').length}</div></div><div><span class="label">Evidence confidence</span><div class="mini-stat">${conf==null?'·':Math.round(conf)}</div></div></div>`:'<div class="empty">No decisions yet. The system will not fabricate a score without creator and campaign evidence.</div>'}</section><section class="card"><div class="section-head"><div><div class="label">Recent campaigns</div><h2>Workspace activity</h2></div></div>${S.campaigns.slice(0,5).map(x=>`<div class="list-card"><div><b>${esc(x.name)}</b><small>${esc(x.status||'draft')} · ${esc(x.payload?.objective||'No objective')}</small></div><button class="btn" data-open-campaign="${x.id}">Open</button></div>`).join('')||'<div class="empty">No campaigns yet.</div>'}</section></div>`;document.getElementById('new-campaign').onclick=()=>{S.page=0;renderPage();setTimeout(()=>document.getElementById('campaign-name')?.focus(),50)};document.getElementById('run-now').onclick=()=>{S.page=3;renderPage()};document.getElementById('go-decision').onclick=()=>{S.page=3;renderPage()};document.getElementById('go-creator').onclick=()=>{S.page=2;renderPage()};document.querySelectorAll('[data-open-campaign]').forEach(b=>b.onclick=()=>selectCampaign(b.dataset.openCampaign))}
function campaignIntake(c){
 const p=S.selectedCampaign?.payload||{};
 const objectiveOptions=['Brand Awareness','Reach','Engagement','Consideration','Conversion','Traffic','Lead Generation','Sales','Community Growth','Brand Preference','Product Launch','Trial / Adoption','Retention','Advocacy','Event Attendance'];
 const personalityOptions=['Premium','Authentic','Innovative','Bold','Sophisticated','Playful','Trustworthy','Energetic','Warm','Purpose-led'];
 const goals=['Brand Awareness','Consideration','Conversion','Engagement','Reach','Sales','Community Growth','Brand Preference','Traffic','Lead Generation','Other'];
 const campaignTypes=['Product Launch','Brand Campaign','Always-on','Promotion','Awareness','Conversion','Community','Other'];
 const currencies=[['THB','Thai Baht (฿)'],['USD','US Dollar ($)'],['EUR','Euro (€)'],['GBP','British Pound (£)'],['JPY','Japanese Yen (¥)'],['CNY','Chinese Yuan (¥)'],['KRW','South Korean Won (₩)'],['SGD','Singapore Dollar (S$)'],['AUD','Australian Dollar (A$)'],['CAD','Canadian Dollar (C$)'],['HKD','Hong Kong Dollar (HK$)'],['CHF','Swiss Franc (CHF)'],['MYR','Malaysian Ringgit (RM)'],['IDR','Indonesian Rupiah (Rp)'],['PHP','Philippine Peso (₱)'],['VND','Vietnamese Dong (₫)'],['TWD','New Taiwan Dollar (NT$)'],['INR','Indian Rupee (₹)']];
 const existingObjectives=(Array.isArray(p.objectives)?p.objectives:(p.objective?[p.objective]:[])).map(x=>String(x).trim()).filter(Boolean).filter(x=>x!=='Other');
 const existingPersonality=(Array.isArray(p.brandPersonalities)?p.brandPersonalities:(p.brandPersonality?[p.brandPersonality]:[])).map(x=>String(x).trim()).filter(Boolean).filter(x=>x!=='Other');
 let customObjectives=[...(Array.isArray(p.objectiveOthers)?p.objectiveOthers:[]),p.objectiveOther,...existingObjectives.filter(x=>!objectiveOptions.includes(x))].map(x=>String(x||'').trim()).filter(Boolean);
 let customPersonalities=[...(Array.isArray(p.brandPersonalityOthers)?p.brandPersonalityOthers:[]),p.brandPersonalityOther,...existingPersonality.filter(x=>!personalityOptions.includes(x))].map(x=>String(x||'').trim()).filter(Boolean);
 customObjectives=[...new Set(customObjectives)]; customPersonalities=[...new Set(customPersonalities)];
 const selectedObjectiveSet=new Set(existingObjectives.filter(x=>objectiveOptions.includes(x)));
 const selectedPersonalitySet=new Set(existingPersonality.filter(x=>personalityOptions.includes(x)));
 const escList=x=>esc(String(x));
 const standardCards=(name,options,set)=>options.map(x=>`<button type="button" class="objective ${set.has(x)?'selected':''}" data-choice-group="${name}" data-choice-value="${escList(x)}">${escList(x)}</button>`).join('');
 const customCards=(group,items)=>items.map((x,i)=>`<button type="button" class="objective custom-choice selected" data-custom-group="${group}" data-custom-index="${i}" title="Remove ${escList(x)}"><span>${escList(x)}</span><b aria-hidden="true">×</b></button>`).join('');
 c.innerHTML=`<div class="workflow-page campaign-reference-page"><form id="campaign-intake-form" class="campaign-intake">
 <section class="intake-section"><div class="section-title-row"><div class="section-title">Campaign Basics</div></div><div class="form-grid campaign-basics-grid">
 <div class="field"><label>Campaign Name <span class="required-star">*</span></label><input id="ci-name" required value="${esc(S.selectedCampaign?.name||'')}" placeholder="Enter campaign name"></div>
 <div class="field"><label>Goal <span class="required-star">*</span></label><select id="ci-goal" required><option value="">Select primary goal</option>${goals.map(x=>`<option value="${esc(x)}" ${(p.goal||'')===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
 <div class="field"><label>Market / Country / Region <span class="required-star">*</span></label><input id="ci-market" required value="${esc(p.market||'')}" placeholder="e.g. Thailand, SEA, Global"></div>
 </div><details class="advanced-details" style="margin-top:14px"><summary><b>Optional campaign context</b><span class="hint">Category, sub-category and campaign type</span></summary><div class="form-grid" style="margin-top:14px"><div class="field"><label>Category</label><input id="ci-category" value="${esc(p.category||'')}" placeholder="e.g. Beauty, Fashion, FMCG"></div><div class="field"><label>Sub-category</label><input id="ci-subcategory" value="${esc(p.subcategory||'')}" placeholder="e.g. Skincare, Makeup, Haircare"></div><div class="field"><label>Campaign Type</label><select id="ci-type"><option value="">Select campaign type</option>${campaignTypes.map(x=>`<option value="${esc(x)}" ${(p.campaignType||'')===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div></div></details></section>
 <section class="intake-section"><div class="section-title-row"><div class="section-title">Objectives <span class="required-star">*</span></div><span class="hint">Choose one or more. Tap Other, type your own, then press Enter.</span></div><div class="objective-grid" id="ci-objective-grid">${standardCards('objective',objectiveOptions,selectedObjectiveSet)}${customCards('objective',customObjectives)}<button type="button" class="objective other-trigger" id="ci-objective-other-trigger">Other</button></div>
 <div class="other-input-row" id="ci-objective-other-row"><label for="ci-objective-other">Add objective</label><input id="ci-objective-other" placeholder="Type your own objective and press Enter" autocomplete="off" enterkeyhint="done"></div>
 <div class="selected-strip" id="ci-selected-objectives"></div></section>
 <section class="intake-section"><div class="section-title-row"><div class="section-title">Budget &amp; Timeline</div></div><div class="form-grid timeline-grid">
 <div class="field"><label>Budget <span class="required-star">*</span></label><input id="ci-budget" required type="text" inputmode="decimal" data-number-format min="0" value="${esc(p.budget??'')}" placeholder="0"></div>
 <div class="field"><label>Currency <span class="required-star">*</span></label><select id="ci-currency" required>${currencies.map(([code,label])=>`<option value="${code}" ${(p.currency||'THB')===code?'selected':''}>${code} - ${label}</option>`).join('')}</select></div>
 </div><details class="advanced-details" style="margin-top:14px"><summary><b>Optional timing</b><span class="hint">Start and end dates improve pacing analysis</span></summary><div class="form-grid" style="margin-top:14px"><div class="field"><label>Start Date</label><input id="ci-start" type="date" value="${esc(p.startDate||'')}"></div><div class="field"><label>End Date</label><input id="ci-end" type="date" value="${esc(p.endDate||'')}"></div></div></details></section>
 <section class="intake-section"><div class="section-title-row"><div class="section-title">Brand Profile</div></div><div class="brand-profile-grid">
 <div class="field"><label>Brand Name <span class="required-star">*</span></label><input id="ci-brand-name" required value="${esc(p.brandName||p.brand||'')}" placeholder="Enter brand name"></div>
 <div class="field"><label>Brand / Product Context <span class="required-star">*</span></label><textarea id="ci-positioning" required placeholder="How is your brand positioned in the market?">${esc(p.brandPositioning||'')}</textarea></div>
 </div><details class="advanced-details" style="margin-top:14px"><summary><b>Optional brand depth</b><span class="hint">Promise and personality</span></summary><div class="form-grid" style="margin-top:14px"><div class="field"><label>Brand Promise</label><textarea id="ci-promise" placeholder="What promise do you deliver to customers?">${esc(p.brandPromise||'')}</textarea></div></div>
 <div class="brand-personality-row"><div class="field"><label>Brand Personality</label><div class="objective-grid" id="ci-personality-grid">${standardCards('personality',personalityOptions,selectedPersonalitySet)}${customCards('personality',customPersonalities)}<button type="button" class="objective other-trigger" id="ci-personality-other-trigger">Other</button></div><div class="other-input-row" id="ci-personality-other-row"><label for="ci-personality-other">Add personality</label><input id="ci-personality-other" placeholder="Type your own personality and press Enter" autocomplete="off" enterkeyhint="done"></div><div class="selected-strip" id="ci-selected-personality"></div></div></div></details></section>
 <details class="advanced-details intake-section brand-intelligence-section"><summary><b>Optional brand intelligence</b><span class="hint">Values, avoid topics and key messages</span></summary><div class="section-title-row"><div class="section-title">Brand Intelligence</div></div><div class="brand-intelligence-grid">
 <div class="field intelligence-column"><label>Brand Values</label><textarea id="ci-brand-values" placeholder="Type the values that define your brand.">${esc(p.brandValuesText||'')}</textarea></div>
 <div class="field intelligence-column"><label>Brand Avoid / Things We Must Avoid</label><textarea id="ci-brand-avoid" placeholder="Type content, themes, or approaches your brand should avoid.">${esc(p.brandAvoidText||'')}</textarea></div>
 <div class="field intelligence-column"><label>Key Brand Messages <span class="hint">optional · KOL IDS can derive a working message from the context</span></label><div id="ci-messages" class="message-list">${(Array.isArray(p.keyMessages)&&p.keyMessages.length?p.keyMessages:['']).slice(0,5).map((m,i)=>`<div class="message-row"><input data-key-message="${i}" value="${esc(m||'')}" placeholder="Enter key brand message"><button type="button" class="remove-message-btn" data-remove-message="${i}" aria-label="Remove message">×</button></div>`).join('')}</div><button type="button" class="add-message-btn" id="ci-add-message">Add another key message</button></div></div></details>
 <div class="bottom-actions"><button type="button" class="btn" id="ci-draft">Save as draft</button><button type="submit" class="btn primary">Continue → Audience</button></div></form></div>`;
 const renderChoices=()=>{
   const og=document.getElementById('ci-objective-grid'),pg=document.getElementById('ci-personality-grid');
   if(og)og.innerHTML=standardCards('objective',objectiveOptions,selectedObjectiveSet)+customCards('objective',customObjectives)+'<button type="button" class="objective other-trigger" id="ci-objective-other-trigger">Other</button>';
   if(pg)pg.innerHTML=standardCards('personality',personalityOptions,selectedPersonalitySet)+customCards('personality',customPersonalities)+'<button type="button" class="objective other-trigger" id="ci-personality-other-trigger">Other</button>';
   bindChoiceEvents(); updateStrips();
 };
 const updateStrips=()=>{
   const ob=document.getElementById('ci-selected-objectives'),pb=document.getElementById('ci-selected-personality');
   const o=[...selectedObjectiveSet,...customObjectives], b=[...selectedPersonalitySet,...customPersonalities];
   if(ob)ob.innerHTML=`Selected (${o.length}): ${o.map(x=>`<span class="selected-chip">${escList(x)}</span>`).join('')||'<span>No objective selected yet.</span>'}`;
   if(pb)pb.innerHTML=`Selected (${b.length}): ${b.map(x=>`<span class="selected-chip">${escList(x)}</span>`).join('')||'<span>No personality selected.</span>'}`;
 };
 const bindChoiceEvents=()=>{
   document.querySelectorAll('[data-choice-group]').forEach(btn=>btn.onclick=()=>{
     const group=btn.dataset.choiceGroup,value=btn.dataset.choiceValue;
     const set=group==='objective'?selectedObjectiveSet:selectedPersonalitySet;
     set.has(value)?set.delete(value):set.add(value); btn.classList.toggle('selected',set.has(value)); updateStrips();
   });
   document.querySelectorAll('[data-custom-group]').forEach(btn=>btn.onclick=()=>{
     const group=btn.dataset.customGroup,index=Number(btn.dataset.customIndex);
     if(group==='objective')customObjectives.splice(index,1); else customPersonalities.splice(index,1);
     renderChoices();
   });
   document.getElementById('ci-objective-other-trigger')?.addEventListener('click',()=>{const row=document.getElementById('ci-objective-other-row');row?.classList.add('show');document.getElementById('ci-objective-other')?.focus()});
   document.getElementById('ci-personality-other-trigger')?.addEventListener('click',()=>{const row=document.getElementById('ci-personality-other-row');row?.classList.add('show');document.getElementById('ci-personality-other')?.focus()});
 };
 const addOther=(type)=>{
   const input=document.getElementById(type==='objective'?'ci-objective-other':'ci-personality-other');if(!input)return;
   const value=input.value.trim();if(!value)return;
   const arr=type==='objective'?customObjectives:customPersonalities;
   if(!arr.some(x=>x.toLowerCase()===value.toLowerCase()))arr.push(value);
   input.value='';document.getElementById(type==='objective'?'ci-objective-other-row':'ci-personality-other-row')?.classList.remove('show');renderChoices();
 };
 document.getElementById('ci-objective-other')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addOther('objective')}});
 document.getElementById('ci-personality-other')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addOther('personality')}});
 bindChoiceEvents();updateStrips();
 document.querySelectorAll('[data-remove-message]').forEach(b=>b.onclick=()=>b.closest('.message-row')?.remove());
 document.getElementById('ci-add-message').onclick=()=>{const wrap=document.getElementById('ci-messages');if(wrap.children.length>=5){toast('Up to 5 key messages.','info');return}const row=document.createElement('div');row.className='message-row';row.innerHTML='<input data-key-message placeholder="Enter key brand message"><button type="button" class="remove-message-btn">×</button>';row.querySelector('button').onclick=()=>row.remove();wrap.appendChild(row)};
 const collect=()=>{const fallbackGoal=document.getElementById('ci-goal')?.value||'';const objectives=[...selectedObjectiveSet,...customObjectives];if(!objectives.length&&fallbackGoal)objectives.push(fallbackGoal);const personalities=[...selectedPersonalitySet,...customPersonalities];return{...p,goal:document.getElementById('ci-goal').value,objective:objectives[0]||document.getElementById('ci-goal').value,objectives,objectiveOther:customObjectives[0]||'',objectiveOthers:[...customObjectives],market:document.getElementById('ci-market').value.trim(),category:document.getElementById('ci-category').value.trim(),subcategory:document.getElementById('ci-subcategory').value.trim(),campaignType:document.getElementById('ci-type').value,currency:document.getElementById('ci-currency').value,budget:num(document.getElementById('ci-budget').value),startDate:document.getElementById('ci-start').value,endDate:document.getElementById('ci-end').value,brandName:document.getElementById('ci-brand-name').value.trim(),brand:document.getElementById('ci-brand-name').value.trim(),brandPositioning:document.getElementById('ci-positioning').value.trim(),brandPromise:document.getElementById('ci-promise').value.trim(),brandPersonalities:personalities,brandPersonality:personalities,brandPersonalityOther:customPersonalities[0]||'',brandPersonalityOthers:[...customPersonalities],brandValues:(document.getElementById('ci-brand-values')?.value||'').split(/[\n,]/).map(x=>x.trim()).filter(Boolean),brandValuesText:document.getElementById('ci-brand-values')?.value.trim()||'',brandAvoid:(document.getElementById('ci-brand-avoid')?.value||'').split(/[\n,]/).map(x=>x.trim()).filter(Boolean),brandAvoidText:document.getElementById('ci-brand-avoid')?.value.trim()||'',keyMessages:[...document.querySelectorAll('[data-key-message]')].map(x=>x.value.trim()).filter(Boolean)} };
 const save=async(e,continueNext)=>{e?.preventDefault();const name=document.getElementById('ci-name').value.trim(),payload=collect();if(!name){toast('Enter a campaign name before saving.','error');return}if(continueNext&&(!payload.goal||!payload.objectives.length||payload.budget==null||!payload.market||!payload.brandName||!payload.brandPositioning)){toast('Please complete the essential campaign fields: name, goal, market, budget, brand and brand/product context.','error');return}if(payload.startDate&&payload.endDate&&payload.endDate<payload.startDate){toast('End date must be after the start date.','error');return}const buttons=[document.getElementById('ci-draft'),document.querySelector('#campaign-intake-form button[type="submit"]')];const buttonLabels=buttons.map(b=>b?.textContent||'');buttons.forEach(b=>{if(b){b.disabled=true;b.textContent='Processing…'}});try{let q=S.selectedCampaign?.id?await sb.from('campaigns').update({name,payload,status:'draft',updated_at:new Date().toISOString()}).eq('id',S.selectedCampaign.id).select().single():await sb.from('campaigns').insert({organization_id:S.org.id,name,payload,status:'draft',created_by:S.session.user.id}).select().single();if(q.error)throw q.error;await refresh();S.selectedCampaign=q.data;toast(continueNext?'Campaign saved':'Draft saved','good');if(continueNext){S.page=1;renderPage()}else renderPage()}catch(err){toast(err.message||'Could not save campaign','error')}finally{buttons.forEach((b,i)=>{if(b){b.disabled=false;b.textContent=buttonLabels[i]||'Save'}})}};
 document.getElementById('campaign-intake-form').onsubmit=e=>save(e,true);document.getElementById('ci-draft').onclick=e=>save(e,false);
}
function audience(c){
 const p=S.selectedAudience?.payload||S.audienceDraft||{},val=k=>esc(p[k]??'');
 const campaignLabel=S.selectedCampaign?.name||'Campaign not completed yet';
 c.innerHTML=`<div class="workflow-page"><div class="hero"><div><div class="kicker">STEP 02 · AUDIENCE INTELLIGENCE</div><h2>Audience Persona</h2><p>Start with the audience you know. KOL IDS expands the brief into deeper decision intelligence automatically.</p></div><div class="hero-actions"><span class="pill cyan">${esc(campaignLabel)}</span></div></div>
 <section class="card"><div class="section-head"><div><div class="label">QUICK AUDIENCE BRIEF</div><h2>Tell us the essentials</h2><p class="sub">You only need the core audience facts. Advanced evidence can be added when available.</p></div></div>
 <form id="audience-form"><div class="form-grid">
 <div class="field"><label>Audience Type <span class="required-star">*</span></label><select id="au-type" required>${['Core Audience','Growth Audience','Niche Audience','Mass Audience','Community Audience','Retargeting Audience','Other'].map((x,i)=>`<option value="${esc(x)}" ${(String(p.audienceType||'Core Audience')===x)?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
 <div class="field"><label>Persona Name <span class="hint">auto-generated</span></label><input id="au-name" value="${esc(S.selectedAudience?.name||p.name||'Primary Audience')}" placeholder="Primary Audience"></div>
 <div class="field"><label>Age / Life Stage</label><input id="au-age" value="${val('age')}" placeholder="e.g. 22–34, early career"></div>
 <div class="field"><label>Market / Location</label><input id="au-market" value="${val('market')}" placeholder="City / country / region"></div>
 <div class="field full"><label>Audience Brief <span class="required-star">*</span></label><textarea id="au-brief" required style="min-height:110px" placeholder="In 1–3 sentences, describe who you want to reach, what they care about, and why they might buy.">${esc(p.audienceBrief||p.audiencePersona||'')}</textarea></div>
 <div class="field"><label>Interests / Category Signals</label><input id="au-interests" value="${val('interests')}" placeholder="Skincare, beauty, fitness, gaming..."></div>
 <div class="field"><label>Spending / Price Sensitivity</label><input id="au-income" value="${val('income')}" placeholder="Budget-conscious, willing to trade up..."></div>
 </div>
 <details class="advanced-details" style="margin-top:18px"><summary><b>Advanced audience intelligence</b><span class="hint">Optional · add detail when you have research</span></summary>
 <div class="form-grid" style="margin-top:14px">
 <div class="field full"><label>Audience Persona · Deep Profile</label><textarea id="au-persona" style="min-height:150px" placeholder="Detailed mindset, lifestyle, media habits, discovery journey, purchase triggers and barriers.">${val('audiencePersona')}</textarea></div>
 <div class="field"><label>Behavior & Decision Journey</label><textarea id="au-behavior" placeholder="Discover → evaluate → compare → decide → purchase → advocate.">${val('behavior')}</textarea></div>
 <div class="field"><label>Pain Points / Needs</label><textarea id="au-pain" placeholder="Needs, tensions, frustrations or unmet jobs.">${val('painPoints')}</textarea></div>
 <div class="field"><label>Lifestyle / Content Habits</label><textarea id="au-lifestyle" placeholder="Platforms, formats, communities and content behavior.">${val('lifestyle')}</textarea></div>
 <div class="field"><label>Purchase Triggers & Context</label><textarea id="au-purchase" placeholder="Occasion, trigger, offer, urgency, social proof, barriers.">${val('purchaseContext')}</textarea></div>
 <div class="field"><label>Why This Brand?</label><textarea id="au-why" placeholder="Why would this audience care about this brand or offer?">${val('whyBrand')}</textarea></div>
 <div class="field"><label>Audience Exclusions</label><textarea id="au-exclusions" placeholder="Who should not be treated as the target audience?">${val('exclusions')}</textarea></div>
 <div class="field"><label>Evidence / Source Notes</label><textarea id="au-evidence" placeholder="CRM, social listening, research, interviews, surveys or sales data.">${val('evidenceNotes')}</textarea></div>
 </div></details>
 <div class="hint" style="margin-top:12px">KOL IDS preserves every advanced field for deeper analysis. If you leave them blank, the system builds structured context from your quick brief and marks the evidence as limited.</div>
 <div class="bottom-actions"><button type="button" class="btn" id="au-back">← Campaign</button><button type="button" class="btn" id="au-draft">Save draft</button><button type="submit" class="btn primary">Save & continue → KOL Persona</button></div></form></section></div>`;
 const collect=()=>{const brief=document.getElementById('au-brief').value.trim(),age=document.getElementById('au-age').value.trim(),market=document.getElementById('au-market').value.trim(),interests=document.getElementById('au-interests').value.trim(),income=document.getElementById('au-income').value.trim();const persona=(document.getElementById('au-persona')?.value.trim()||brief);const pain=(document.getElementById('au-pain')?.value.trim()||`Needs, motivations and purchase barriers inferred from the stated audience brief: ${brief}`);const behavior=(document.getElementById('au-behavior')?.value.trim()||`Audience discovery and decision behavior is derived from the stated audience brief and available campaign context. ${brief}`);const lifestyle=(document.getElementById('au-lifestyle')?.value.trim()||`Content and platform behavior is currently based on the available audience description${interests?` and interests (${interests})`:''}.`);const purchase=(document.getElementById('au-purchase')?.value.trim()||`Purchase triggers should be validated against campaign evidence; initial context is based on ${brief}.`);const why=(document.getElementById('au-why')?.value.trim()||`Audience relevance to the brand is derived from the stated audience brief and campaign context.`);return{audienceType:document.getElementById('au-type').value,age,market,income,interests,audienceBrief:brief,audiencePersona:persona,behavior,painPoints:pain,lifestyle,purchaseContext:purchase,whyBrand:why,exclusions:document.getElementById('au-exclusions')?.value.trim()||'',evidenceNotes:document.getElementById('au-evidence')?.value.trim()||'Quick brief supplied by user; advanced evidence not supplied.',evidenceLevel:(document.getElementById('au-persona')?.value.trim()&&document.getElementById('au-pain')?.value.trim())?'DETAILED':'QUICK_BRIEF_DERIVED',updatedAt:new Date().toISOString()}};
 const save=async(next)=>{const name=document.getElementById('au-name').value.trim()||'Primary Audience',payload=collect();if(next&&(!payload.audienceType||!payload.audienceBrief)){toast('Complete the audience type and short audience brief before continuing.','error');return}const btn=next?document.querySelector('#audience-form button[type="submit"]'):document.getElementById('au-draft');if(btn){btn.disabled=true;btn.textContent='Saving…'}try{S.audienceDraft=payload;if(!S.selectedCampaign?.id){const shellPayload={status:'draft',createdFromStep:'AUDIENCE',objectives:[],goal:'',brandName:'',brand:'',brandPositioning:'',keyMessages:[]};const cq=await sb.from('campaigns').insert({organization_id:S.org.id,name:'Untitled Campaign',payload:shellPayload,status:'draft'}).select().single();if(cq.error)throw cq.error;S.selectedCampaign=cq.data;S.campaigns=[cq.data,...S.campaigns.filter(x=>x.id!==cq.data.id)]}let q;if(S.selectedAudience?.id)q=await sb.from('audiences').update({name,payload,campaign_id:S.selectedCampaign.id}).eq('id',S.selectedAudience.id).eq('organization_id',S.org.id).select().single();else q=await sb.from('audiences').insert({organization_id:S.org.id,campaign_id:S.selectedCampaign.id,name,payload}).select().single();if(q.error)throw q.error;await refresh();S.selectedAudience=q.data;S.audienceDraft=null;toast(next?'Audience saved':'Audience draft saved','good');if(next){S.page=2;renderPage()}else renderPage()}catch(err){toast(err.message||'Could not save audience persona','error')}finally{if(btn){btn.disabled=false;btn.textContent=next?'Save & continue → KOL Persona':'Save draft'}}};
 document.getElementById('audience-form').onsubmit=e=>{e.preventDefault();save(true)};document.getElementById('au-draft').onclick=()=>save(false);document.querySelectorAll('#audience-form input, #audience-form select, #audience-form textarea').forEach(el=>el.addEventListener('input',()=>{S.audienceDraft=collect()}));document.getElementById('au-back').onclick=()=>{S.audienceDraft=collect();S.page=0;renderPage()};
}

function campaigns(c){const active=S.selectedCampaign; c.innerHTML=`<div class="hero"><div><div class="kicker">CAMPAIGN INTELLIGENCE</div><h2>Campaign workspace</h2><p>Capture the business problem, objectives, budget, timing and decision assumptions.</p></div></div><div class="grid g2"><section class="card"><div class="section-head"><div><div class="label">Create / update</div><h2>Campaign context</h2></div><span class="pill cyan">Canonical input</span></div><form id="campaign-form"><div class="form-grid"><div class="field full"><label class="required">Campaign name</label><input id="campaign-name" required value="${esc(active?.name||'')}" placeholder="e.g. Summer Beauty Launch"></div><div class="field"><label class="required">Objective</label><select id="campaign-objective" required><option value="">Select objective</option>${['AWARENESS','CONSIDERATION','CONVERSION','ENGAGEMENT','REACH','SALES'].map(x=>`<option ${active?.payload?.objective===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label class="required">Budget · THB</label><input id="campaign-budget" required type="text" inputmode="decimal" data-number-format min="0" value="${esc(active?.payload?.budget??1000000)}"></div><div class="field"><label>Start date</label><input id="campaign-start" type="date" value="${esc(active?.payload?.startDate||'')}"></div><div class="field"><label>End date</label><input id="campaign-end" type="date" value="${esc(active?.payload?.endDate||'')}"></div><div class="field full"><label class="required">Brand / product context</label><textarea id="campaign-brand" required placeholder="What is being promoted and what must be true for the campaign to work?">${esc(active?.payload?.brand||'')}</textarea></div><div class="field full"><label>Success definition</label><textarea id="campaign-success" placeholder="What business outcome should the analysis support?">${esc(active?.payload?.success||'')}</textarea></div></div><div style="margin-top:18px"><div class="label">KPI governance</div><div class="grid g3" style="margin-top:10px">${[0,1,2].map(i=>`<div class="signal-box"><h4>KPI ${i+1}</h4><div class="field"><label>Name</label><input data-kpi-name="${i}" value="${esc(active?.payload?.kpis?.[i]?.name||'')}" placeholder="e.g. Reach"></div><div class="field" style="margin-top:7px"><label>Target</label><input data-kpi-target="${i}" type="text" inputmode="decimal" data-number-format value="${esc(active?.payload?.kpis?.[i]?.target??'')}"></div><div class="field" style="margin-top:7px"><label>Actual</label><input data-kpi-actual="${i}" type="text" inputmode="decimal" data-number-format value="${esc(active?.payload?.kpis?.[i]?.actual??'')}"></div><div class="field" style="margin-top:7px"><label>Direction</label><select data-kpi-direction="${i}"><option ${active?.payload?.kpis?.[i]?.direction!=='LOWER_BETTER'?'selected':''}>HIGHER_BETTER</option><option ${active?.payload?.kpis?.[i]?.direction==='LOWER_BETTER'?'selected':''}>LOWER_BETTER</option></select></div></div>`).join('')}</div></div><div style="margin-top:18px"><div class="label">Risk governance</div><div class="grid g2" style="margin-top:10px">${[0,1].map(i=>`<div class="signal-box"><h4>Risk ${i+1}</h4><div class="form-grid"><div class="field"><label>Type</label><input data-risk-type="${i}" value="${esc(active?.payload?.risks?.[i]?.type||'')}" placeholder="Execution"></div><div class="field"><label>Severity · 1–5</label><input data-risk-severity="${i}" type="text" inputmode="decimal" data-number-format min="1" max="5" value="${esc(active?.payload?.risks?.[i]?.severity??'')}"></div><div class="field"><label>Probability · 1–5</label><input data-risk-probability="${i}" type="text" inputmode="decimal" data-number-format min="1" max="5" value="${esc(active?.payload?.risks?.[i]?.probability??'')}"></div><div class="field"><label>Impact · 1–5</label><input data-risk-impact="${i}" type="text" inputmode="decimal" data-number-format min="1" max="5" value="${esc(active?.payload?.risks?.[i]?.impact??'')}"></div></div></div>`).join('')}</div></div></div><div class="actions"><button class="btn primary" type="submit">Save campaign context</button><button class="btn" type="button" id="clear-campaign">Clear</button></div></form></section><section class="card dark-card"><div class="section-head"><div><div class="label">Decision architecture</div><h2>Why these fields matter</h2><p class="sub">Campaign context becomes the reference frame for audience fit, creator fit, value and risk.</p></div></div><div class="explain-grid"><div class="explain"><b>Objective</b><p>Sets the optimization lens used by downstream decision logic.</p></div><div class="explain"><b>Budget</b><p>Feeds commercial efficiency and portfolio constraints.</p></div><div class="explain"><b>Brand context</b><p>Provides the business context for alignment judgments.</p></div></div><div class="footer-note">No result is produced merely because a campaign exists. Evidence must be present.</div></section></div><section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">Campaign registry</div><h2>Workspace campaigns</h2></div></div>${S.campaigns.length?`<div class="table-wrap"><table><thead><tr><th>Campaign</th><th>Objective</th><th>Budget</th><th>Status</th><th>Created</th><th></th></tr></thead><tbody>${S.campaigns.map(x=>`<tr><td><b>${esc(x.name)}</b></td><td>${esc(x.payload?.objective||'·')}</td><td>THB ${money(x.payload?.budget)}</td><td><span class="pill ${x.id===active?.id?'cyan':''}">${esc(x.status||'draft')}</span></td><td>${new Date(x.created_at).toLocaleDateString()}</td><td><button class="btn" data-select="${x.id}">Select</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No campaigns saved.</div>'}</section>`;document.getElementById('campaign-form').onsubmit=saveCampaign;document.getElementById('clear-campaign').onclick=()=>{S.selectedCampaign=null;S.selectedAudience=null;renderPage()};document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>selectCampaign(b.dataset.select))}
async function saveCampaign(e){e.preventDefault();const name=document.getElementById('campaign-name').value.trim(),payload={objective:document.getElementById('campaign-objective').value,budget:num(document.getElementById('campaign-budget').value),startDate:document.getElementById('campaign-start').value,endDate:document.getElementById('campaign-end').value,brand:document.getElementById('campaign-brand').value.trim(),success:document.getElementById('campaign-success').value.trim(),kpis:[0,1,2].map(i=>({name:document.querySelector('[data-kpi-name=\"'+i+'\"]')?.value.trim(),target:num(document.querySelector('[data-kpi-target=\"'+i+'\"]')?.value),actual:num(document.querySelector('[data-kpi-actual=\"'+i+'\"]')?.value),direction:document.querySelector('[data-kpi-direction=\"'+i+'\"]')?.value})).filter(x=>x.name),risks:[0,1].map(i=>({type:document.querySelector('[data-risk-type=\"'+i+'\"]')?.value.trim(),severity:num(document.querySelector('[data-risk-severity=\"'+i+'\"]')?.value),probability:num(document.querySelector('[data-risk-probability=\"'+i+'\"]')?.value),impact:num(document.querySelector('[data-risk-impact=\"'+i+'\"]')?.value)})).filter(x=>x.type)};if(!name||!payload.objective||payload.budget==null||!payload.brand){toast('Complete all required campaign inputs','error');return}let q;if(S.selectedCampaign)q=await sb.from('campaigns').update({name,payload,status:'draft',updated_at:new Date().toISOString()}).eq('id',S.selectedCampaign.id).select().single();else q=await sb.from('campaigns').insert({organization_id:S.org.id,name,payload,status:'draft',created_by:S.session.user.id}).select().single();if(q.error){toast(q.error.message,'error');return}await refresh();S.selectedCampaign=q.data;toast('Campaign context saved','good');renderPage()}
const signalExamples={Personality:['Warm','Confident','Playful','Thoughtful','Authoritative'],Communication:['Conversational','Storytelling','Educational','Direct','Editorial'],Audience_Relationship:['Trust-based','Community-led','Expert-led','Peer-like','Transactional'],Social_Behavior:['Trend-aware','Interactive','Community-driven','Fast-reactive','Niche-led'],Content_Personality:['Authentic','Editorial','Playful','Aspirational','Technical'],Content_Function:['Educate','Review','Inspire','Compare','Demonstrate'],Content_Behavior:['Consistent','Experiment-driven','Series-led','Reactive','Evergreen'],Audience_Psychology:['Trust-seeking','Discovery-led','Identity-led','Value-seeking','Entertainment-led']};

function decisionWeights(){
  const w=S.selectedCampaign?.payload?.decisionWeights||{};
  const out={
    brand:Number(w.brand??20),
    audience:Number(w.audience??20),
    campaign:Number(w.campaign??15),
    confidence:Number(w.confidence??15),
    value:Number(w.value??15),
    risk:Number(w.risk??15)
  };
  out.total=Math.round(Object.values(out).reduce((a,b)=>a+b,0));
  return out;
}
function creatorSignal(x){
  const p=x?.payload||{}, ci=p.intelligence||{};
  return {
    audience:clamp(Object.values(ci).flat().length*4+45),
    content:clamp(((ci.Content_Function||[]).length*12)+45),
    brand:clamp(((ci.Personality||[]).length*10)+45),
    performance:clamp((p.er==null?0:Math.min(100,Number(p.er)*10))),
    risk:clamp(p.profileUrl?20:30)
  };
}
function intelligenceCall(action,payload={}){
  if(!sb) return Promise.reject(new Error('Workspace connection is unavailable.'));
  const fn='intelligence-engine';
  return sb.functions.invoke(fn,{
    body:{
      ...payload,
      action,
      organization_id:S.org?.id,
      campaign_id:S.selectedCampaign?.id
    }
  }).then(({data,error})=>{
    if(error) throw error;
    if(!data) throw new Error('No response from the intelligence engine.');
    if(data.error) throw new Error(data.error);
    if(data.success===false) throw new Error(data.error||'Intelligence engine rejected the request.');
    return data;
  });
}

function fitText(v){return String(v??'').toLowerCase().replace(/[^a-z0-9ก-๙\s]/gi,' ')}
function fitTokens(v){return fitText(v).split(/\s+/).filter(w=>w.length>=3)}
function overlapScore(a,b){
 const A=new Set(fitTokens(a)), B=new Set(fitTokens(b)); if(!A.size||!B.size)return 0;
 let hit=0; A.forEach(x=>{if(B.has(x))hit++}); return Math.min(100,Math.round(hit/Math.max(3,Math.min(A.size,18))*100));
}
function localCreatorFit(creator){
 const cp=creator?.payload||{},ci=cp.intelligence||{},camp=S.selectedCampaign?.payload||{},aud=S.selectedAudience?.payload||{};
 const creatorText=[creator?.name,cp.bio,cp.channel,cp.secondaryChannel,(cp.ecommerceChannels||[]).join(' '),Object.values(ci).flat().join(' ')].join(' ');
 const audienceText=[aud.audienceBrief,aud.audiencePersona,aud.interests,aud.lifestyle,aud.behavior,aud.painPoints,aud.purchaseContext,aud.whyBrand,aud.market,aud.age].join(' ');
 const campaignText=[camp.goal,camp.objective,(camp.objectives||[]).join(' '),camp.category,camp.subcategory,camp.campaignType,camp.brandName,camp.brandPositioning,camp.brandPromise,camp.brandValuesText,(camp.brandPersonalities||[]).join(' '),(camp.keyMessages||[]).join(' ')].join(' ');
 const brandText=[camp.brandName,camp.brandPositioning,camp.brandPromise,camp.brandValuesText,(camp.brandPersonalities||[]).join(' '),(camp.keyMessages||[]).join(' ')].join(' ');
 const audienceFit=Math.max(20,Math.min(100,48+Math.round(overlapScore(creatorText,audienceText)*0.55)));
 const contentFit=Math.max(20,Math.min(100,48+Math.round(overlapScore(creatorText,campaignText)*0.55)));
 const brandFit=Math.max(20,Math.min(100,48+Math.round(overlapScore([ci.Personality,ci.Content_Function,ci.Values,cp.bio].flat().join(' '),brandText)*0.6)));
 const er=cp.er==null?null:Number(cp.er),followers=Number(cp.followers||0);
 const performance=er==null||Number.isNaN(er)?50:Math.min(100,Math.round(35+Math.min(55,er*8)+Math.min(10,Math.log10(followers+1)*2)));
 const performanceAvailable=er!=null&&!Number.isNaN(er);
 const budget=Number(camp.budget||0),rate=Number(cp.rate||0);let commercial=62;if(rate&&budget)commercial=Math.max(25,Math.min(100,Math.round(92-Math.max(0,rate/budget)*100)));else if(rate)commercial=55;
 const risk=Math.max(10,Math.min(70,20+(cp.primaryChannelLink?0:18)+(cp.profileImageUrl?0:4)+(cp.bio?0:12)+(er==null?8:0)));
 const confidence=Math.round(Math.min(82,35+(Object.values(ci).flat().length*2)+(cp.bio?8:0)+(performanceAvailable?10:0)+(rate&&budget?8:0)));
 const performanceComponent=50+(performance-50)*(0.55+0.45*confidence/100);
 const raw=Math.round(audienceFit*.20+contentFit*.20+brandFit*.20+performanceComponent*.15+commercial*.10+(100-risk)*.15);
 const overall=Math.round(50+(raw-50)*(0.70+0.30*confidence/100));
 const dims={
  audienceFit:{score:audienceFit,reason:audienceFit>=70?'Creator signals overlap with the stated audience interests and context.':'Creator evidence has limited overlap with the audience brief.',action:audienceFit>=70?'Keep audience-native language and proof points.':'Refine the brief to a creator-native audience angle and add audience-specific content examples.'},
  contentFit:{score:contentFit,reason:contentFit>=70?'Creator content signals are reasonably aligned with the campaign objective/category.':'The creator profile does not strongly evidence the current campaign objective or category.',action:contentFit>=70?'Use the creator’s native format while keeping the campaign KPI explicit.':'Give the creator a tighter objective-led content brief, required message and CTA while preserving native style.'},
  brandFit:{score:brandFit,reason:brandFit>=70?'Creator style/signals are compatible with the available brand context.':'Brand personality or positioning is not strongly reflected in the creator evidence.',action:brandFit>=70?'Anchor execution to the existing brand guardrails.':'Provide 2–3 non-negotiable brand cues, visual rules and message examples before activation.'},
  performance:{score:performance,available:performanceAvailable,reason:performanceAvailable?`Available engagement evidence is ${er}% with ${followers?money(followers)+' followers':'limited audience-size data'}.`:'No historical performance evidence was supplied; performance is held neutral at 50/100 rather than treated as poor.',action:performanceAvailable&&performance>=70?'Validate with a controlled test and tracked KPI.':'Request recent reach, views, saves, shares and conversion evidence before scaling.'},
  commercial:{score:commercial,reason:rate&&budget?`Rate-to-budget fit is estimated from ${money(rate)} fee against ${money(budget)} campaign budget.`:'Commercial fit is provisional because fee and/or campaign budget is missing.',action:commercial>=70?'Set a tracked deliverable package and attribution terms.':'Renegotiate scope/package, reduce deliverables, or use a smaller test allocation before scaling.'},
  risk:{score:risk,reason:risk<=30?'No major execution-risk signal was found in the supplied profile.':'Some creator evidence is incomplete, increasing execution uncertainty.',action:risk<=30?'Keep standard brand-safety and approval checks.':'Add pre-approval, content guardrails and a small controlled first activation.'}
 };
 const low=Object.entries(dims).filter(([k,v])=>k!=='risk'&&v.score<70).sort((a,b)=>a[1].score-b[1].score);
 const recoveryPlan=(low.length?low.slice(0,3):[['overall',{action:'Keep the creator-native style, lock the campaign KPI and validate with a controlled test.'}]]).map(([k,v])=>({area:k.replace(/([A-Z])/g,' $1').replace(/^./,x=>x.toUpperCase()),action:v.action}));
 const insufficient=!performanceAvailable;
 const evidence={audienceFit,contentFit,brandFit,performance,commercial,risk,confidence,performanceEvidenceAvailable:performanceAvailable,decisionScore:overall,reason:insufficient?'Fit is calculated from campaign, audience and creator signals, but historical performance evidence is missing.':'Fit is calculated from campaign, audience, creator signals and the available performance evidence.',dimensionEvidence:dims,recoveryPlan,method:'Local provisional fallback only. Remote V3 engine unavailable; missing performance evidence is neutral and the result is gated for review.',modelTrust:'LOW'};
 const decision=insufficient?'INSUFFICIENT HISTORICAL EVIDENCE':overall>=80?'RECOMMENDED':overall>=65?'CONSIDER':'REVIEW REQUIRED';
 return {decision,score:overall,evidence};
}
async function calculateCreatorFitSafe(creatorIds){
 const ids=(creatorIds||S.creators.map(x=>x.id)).filter(Boolean);
 if(!ids.length) return {success:true,rows:[]};
 try{
   const remote=await intelligenceCall('analyze',{creator_ids:ids});
   if(remote?.success && Array.isArray(remote.rows) && remote.rows.length){
     S.localFitRows=[];
     return remote;
   }
   throw new Error(remote?.error||'Remote intelligence engine returned no creator results.');
 }catch(remoteErr){
   // Never block the Creator page on the Edge Function or a DB write.
   // Calculate locally first, render immediately, then attempt persistence best-effort.
   const idSet=new Set(ids.map(String));
   const creators=S.creators.filter(x=>idSet.has(String(x.id)));
   const rows=creators.map(r=>({creator_id:r.id,...localCreatorFit(r)}));
   S.localFitRows=rows;
   if(sb&&S.org?.id&&S.selectedCampaign?.id&&rows.length){
     const payload=rows.map(x=>({organization_id:S.org.id,campaign_id:S.selectedCampaign.id,creator_id:x.creator_id,decision:x.decision,score:x.score,evidence:x.evidence,created_by:S.session?.user?.id||null}));
     try{
       const q=await sb.from('creator_decisions').insert(payload);
       if(!q.error) S.localFitRows=[];
     }catch(_persistErr){
       // Keep local results visible even when RLS/schema/network prevents persistence.
     }
   }
   return {success:true,localFallback:true,rows,warning:`Remote fit unavailable (${remoteErr?.message||'request failed'}); local fit shown instead.`};
 }
}
async function runAnalysis(){
 if(!S.selectedCampaign){toast('Create and save a campaign first.','error');return}
 if(!S.selectedAudience){toast('Complete Audience before analyzing creators.','error');S.page=1;renderPage();return}
 const shortlist=Array.isArray(S.selectedCampaign.payload?.decisionShortlistIds)?S.selectedCampaign.payload.decisionShortlistIds:[];
 const candidates=shortlist.length?S.creators.filter(x=>shortlist.includes(x.id)):S.creators;
 if(!candidates.length){toast('Add or shortlist at least one creator before analysis.','error');S.page=2;renderPage();return}
 const btn=document.getElementById('run-analysis');if(btn){btn.disabled=true;btn.textContent='Analyzing…'}
 try{const data=await calculateCreatorFitSafe(candidates.map(x=>x.id));if(!data.success)throw new Error(data.error||'Analysis did not complete.');S.analysis=data;await refresh();toast(`${data.localFallback?'Local fit calculated':'Analysis completed'} · ${Number(data.rows?.length||0)} creator results`,'good');renderPage()}catch(err){toast(err.message||'Creator analysis failed. No decision was saved as complete.','error')}finally{if(btn){btn.disabled=false;btn.textContent='Calculate creator fit'}}
}

function slugCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,8)||'KOL'}
function makeGenCode(name, campaignId, existing=[]){
  const base=`KOL_${slugCode(name)}_${slugCode(String(campaignId||'').slice(-6))}`;
  const used=new Set(existing.filter(Boolean).map(x=>String(x).toUpperCase()));
  let code=base.slice(0,28), i=1;
  while(used.has(code)){i++;code=`${base}_${String(i).padStart(2,'0')}`.slice(0,32)}
  return code;
}
function campaignGenCodes(){const g=S.selectedCampaign?.payload?.genCodes;return g&&Array.isArray(g.codes)?g.codes:[]}
function campaignGenCodeForCreator(creatorId){return campaignGenCodes().find(x=>String(x.creatorId)===String(creatorId))||null}
function genCodeStatus(item){if(!item)return 'NOT GENERATED';if(item.status==='PAUSED')return 'PAUSED';if(item.expiresAt){const d=new Date(String(item.expiresAt)+'T23:59:59');if(!isNaN(d.getTime())&&Date.now()>d.getTime())return 'EXPIRED'}return item.status||'ACTIVE'}
function defaultGenCodePlan(){const p=S.selectedCampaign?.payload||{};return{enabled:true,generationMode:'ALL_APPROVED',prefix:'KOL',discountType:'PERCENT',discountValue:0,commissionRate:0,startDate:p.startDate||new Date().toISOString().slice(0,10),endDate:p.endDate||'',validityMode:p.endDate?'CAMPAIGN_END':'DAYS',validityDays:30,expiresAt:'',maxUses:0,attributionWindowDays:30,notes:''}}
function readGenCodePlanFromForm(){const base={...defaultGenCodePlan()};const get=id=>document.getElementById(id)?.value;const generationMode=(get('gc-generation-mode')||base.generationMode||'ALL_APPROVED').toUpperCase();const mode=get('gc-validity-mode')||base.validityMode;const start=get('gc-start')||base.startDate;const end=get('gc-end')||base.endDate;let expires='';if(mode==='CAMPAIGN_END')expires=end;else if(mode==='CUSTOM_DATE')expires=get('gc-expiry')||'';const creatorPlans={...(base.creatorPlans||{})};if(generationMode==='INDIVIDUAL'){(S.creators||[]).filter(x=>(S.selectedCampaign?.payload?.selectedCreatorIds||[]).includes(x.id)).forEach(cr=>{const id=String(cr.id);creatorPlans[id]={discountType:(get(`gc-row-discount-type-${id}`)||base.discountType).toUpperCase(),discountValue:num(get(`gc-row-discount-value-${id}`))??0,commissionRate:num(get(`gc-row-commission-${id}`))??0}})}return{enabled:true,generationMode,prefix:slugCode(get('gc-prefix')||base.prefix),discountType:(get('gc-discount-type')||base.discountType).toUpperCase(),discountValue:num(get('gc-discount-value'))??0,commissionRate:num(get('gc-commission'))??0,startDate:start,endDate:end,validityMode:mode,validityDays:Math.max(1,Math.floor(num(get('gc-validity-days'))??base.validityDays)),expiresAt:expires,maxUses:Math.max(0,Math.floor(num(get('gc-max-uses'))??0)),attributionWindowDays:Math.max(0,Math.floor(num(get('gc-attribution-days'))??base.attributionWindowDays)),notes:String(get('gc-notes')||'').trim(),creatorPlans,savedAt:new Date().toISOString()}}
function calculateGenCodeExpiry(plan){if(plan.validityMode==='CAMPAIGN_END')return plan.endDate||'';if(plan.validityMode==='CUSTOM_DATE')return plan.expiresAt||'';const base=new Date((plan.startDate||new Date().toISOString().slice(0,10))+'T00:00:00');if(isNaN(base.getTime()))return '';base.setDate(base.getDate()+Math.max(1,Number(plan.validityDays||30)));return base.toISOString().slice(0,10)}
async function saveGenCodeConfiguration(forceNew=false){if(!S.selectedCampaign)return;const selectedIds=Array.isArray(S.selectedCampaign.payload?.selectedCreatorIds)?S.selectedCampaign.payload.selectedCreatorIds:[];const selected=S.creators.filter(x=>selectedIds.includes(x.id));if(!selected.length){toast('Select at least one approved creator in Step 04 before generating Gen Codes.','error');return}const plan=readGenCodePlanFromForm();if(!['PERCENT','FIXED','NONE'].includes(plan.discountType)){toast('Invalid discount type.','error');return}if(plan.discountType==='PERCENT'&&(plan.discountValue<0||plan.discountValue>100)){toast('Discount percentage must be between 0 and 100.','error');return}if(plan.commissionRate<0||plan.commissionRate>100){toast('Commission rate must be between 0 and 100.','error');return}if(plan.generationMode==='INDIVIDUAL'){for(const cr of selected){const q=plan.creatorPlans?.[String(cr.id)]||{};const dt=String(q.discountType||plan.discountType).toUpperCase(),dv=Number(q.discountValue??0),cm=Number(q.commissionRate??0);if(!['PERCENT','FIXED','NONE'].includes(dt)){toast(`Invalid discount type for ${cr.name}.`,'error');return}if(dt==='PERCENT'&&(dv<0||dv>100)){toast(`Discount percentage for ${cr.name} must be between 0 and 100.`,'error');return}if(cm<0||cm>100){toast(`Commission rate for ${cr.name} must be between 0 and 100.`,'error');return}}}plan.expiresAt=calculateGenCodeExpiry(plan);if(plan.validityMode!=='DAYS'&&!plan.expiresAt){toast('Set a valid Gen Code expiry date or campaign end date.','error');return}if(plan.startDate&&plan.expiresAt&&plan.expiresAt<plan.startDate){toast('Gen Code expiry cannot be before the start date.','error');return}const existing=campaignGenCodes();const used=new Set(existing.map(x=>String(x.code||'').toUpperCase()));const oldByCreator=new Map(existing.map(x=>[String(x.creatorId),x]));const codes=selected.map(cr=>{const old=oldByCreator.get(String(cr.id));const individual=plan.generationMode==='INDIVIDUAL'?(plan.creatorPlans?.[String(cr.id)]||{}):{};const discountType=String(individual.discountType||plan.discountType).toUpperCase();const discountValue=Number(individual.discountValue??plan.discountValue??0);const commissionRate=Number(individual.commissionRate??plan.commissionRate??0);if(old&&!forceNew){return{...old,creatorId:cr.id,creatorName:cr.name,platform:(cr.payload?.ecommerceChannels?.[0]||cr.payload?.channel||old.platform||''),campaignId:S.selectedCampaign.id,startDate:plan.startDate,endDate:plan.endDate,validityMode:plan.validityMode,validityDays:plan.validityDays,expiresAt:plan.expiresAt,discountType,discountValue,commissionRate,maxUses:plan.maxUses,attributionWindowDays:plan.attributionWindowDays,status:plan.enabled?'ACTIVE':'PAUSED',updatedAt:new Date().toISOString()}}let code=makeGenCode(cr.name,S.selectedCampaign.id,[...used]);used.add(code.toUpperCase());return{id:'GC-'+Math.random().toString(36).slice(2,14).toUpperCase(),code,creatorId:cr.id,creatorName:cr.name,platform:(cr.payload?.ecommerceChannels?.[0]||cr.payload?.channel||''),campaignId:S.selectedCampaign.id,analysisId:'',brandId:'',discountType,discountValue,commissionRate,startDate:plan.startDate,endDate:plan.endDate,validityMode:plan.validityMode,validityDays:plan.validityDays,expiresAt:plan.expiresAt,maxUses:plan.maxUses,attributionWindowDays:plan.attributionWindowDays,uses:0,orders:0,conversions:0,revenue:0,newCustomers:0,commission:0,status:'ACTIVE',planSnapshot:{...plan,creatorPlan:individual},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}});const nextPayload={...(S.selectedCampaign.payload||{}),genCodePlan:plan,genCodes:{codes,generatedAt:new Date().toISOString(),forceNew}};const q=await sb.from('campaigns').update({payload:nextPayload,updated_at:new Date().toISOString()}).eq('id',S.selectedCampaign.id).eq('organization_id',S.org.id).select().single();if(q.error){toast(q.error.message||'Could not save Gen Codes','error');return}S.selectedCampaign=q.data;await refresh();S.selectedCampaign=q.data;toast(`${codes.length} Gen Code${codes.length===1?'':'s'} saved for approved creators.`,'good');renderPage()}


function creatorSignalCoverage(x){const ci=x.payload?.intelligence||{};return{required:Object.keys(signalExamples).filter(k=>Array.isArray(ci[k])&&ci[k].length).length,total:Object.keys(signalExamples).length}}
function chipGroup(key,selected){const vals=[...(signalExamples[key]||[])];const customs=(selected||[]).filter(v=>v&&!vals.includes(v));return `<div class="signal-box"><h4>${key.replaceAll('_',' ')}</h4><div class="chips" data-chips-for="${key}">${vals.map(v=>`<button type="button" class="chip ${selected.includes(v)?'selected':''}" data-chip="${key}" data-value="${esc(v)}">${esc(v)}</button>`).join('')}${customs.map(v=>`<button type="button" class="chip selected custom-signal-chip" data-custom-signal="${key}" data-custom-value="${esc(v)}">${esc(v)} <b aria-hidden="true">×</b></button>`).join('')}</div><input class="signal-other" data-other-for="${key}" placeholder="Type your own signal and press Enter" autocomplete="off" enterkeyhint="done"></div>`}
function inferCreatorSignals(text,channel){
 const t=String(text||'').toLowerCase(), ch=String(channel||'').toLowerCase(), has=(...ks)=>ks.some(k=>t.includes(k));
 const pick=(arr, fallback)=>arr.find(x=>x[0])?.[1]||fallback;
 const out={Personality:[],Communication:[],Audience_Relationship:[],Social_Behavior:[],Content_Personality:[],Content_Function:[],Content_Behavior:[],Audience_Psychology:[]};
 out.Personality.push(has('expert','educat','professional','coach')?'Authoritative':has('fun','funny','playful','entertain')?'Playful':has('luxury','premium','elegant')?'Thoughtful':'Authentic');
 out.Communication.push(has('story','storytelling','vlog')?'Storytelling':has('educat','how-to','tips','guide')?'Educational':has('review','direct')?'Direct':'Conversational');
 out.Audience_Relationship.push(has('community','member','followers','family')?'Community-led':has('expert','professional','coach')?'Expert-led':'Peer-like');
 out.Social_Behavior.push(has('trend','viral','trending')?'Trend-aware':has('community','comment','followers')?'Interactive':has('niche','specialist')?'Niche-led':'Community-driven');
 out.Content_Personality.push(has('technical','data','science')?'Technical':has('premium','luxury','editorial')?'Editorial':has('aspirational','fashion','beauty')?'Aspirational':'Authentic');
 out.Content_Function.push(has('review','รีวิว')?'Review':has('demo','demonstrat','tutorial','how-to')?'Demonstrate':has('compare','comparison')?'Compare':has('educat','tips','guide')?'Educate':has('inspire','lifestyle')?'Inspire':'Review');
 out.Content_Behavior.push(has('series','episode')?'Series-led':has('evergreen','guide','tutorial')?'Evergreen':has('trend','reactive','news')?'Reactive':'Consistent');
 out.Audience_Psychology.push(has('trust','expert','review','proof')?'Trust-seeking':has('discover','explore','try')?'Discovery-led':has('identity','fashion','beauty','lifestyle')?'Identity-led':has('value','deal','price')?'Value-seeking':'Entertainment-led');
 return out;
}
function mergeCreatorSignals(manual,inferred){const out={};Object.keys(signalExamples).forEach(k=>{out[k]=Array.isArray(manual?.[k])&&manual[k].length?manual[k]:Array.isArray(inferred?.[k])?inferred[k]:[]});return out}
function creatorFormCollect(){const selected={};Object.keys(signalExamples).forEach(k=>{selected[k]=[...document.querySelectorAll(`[data-chip="${k}"].selected`)].map(b=>b.dataset.value).filter(v=>v!=='Other');selected[k].push(...[...document.querySelectorAll(`[data-custom-signal="${k}"]`)].map(b=>b.dataset.customValue).filter(Boolean));const other=document.querySelector(`[data-other-for="${k}"]`)?.value.trim();if(other)selected[k].push(other)});const name=document.getElementById('cr-name').value.trim(),channel=document.getElementById('cr-channel').value,bio=document.getElementById('cr-bio')?.value.trim()||'';const inferred=inferCreatorSignals(bio,channel);return{name,channel,secondaryChannel:document.getElementById('cr-secondary').value,ecommerceChannels:[...document.querySelectorAll('[data-ecom-channel]:checked')].map(x=>x.value),ecommerceStoreLink:document.getElementById('cr-ecom-store-link')?.value.trim()||'',followers:num(document.getElementById('cr-followers').value),er:num(document.getElementById('cr-er').value),rate:num(document.getElementById('cr-rate').value),primaryChannelLink:document.getElementById('cr-primary-link').value.trim(),profileUrl:document.getElementById('cr-primary-link').value.trim(),profileImageUrl:document.getElementById('cr-photo-data').value||'',bio,intelligence:mergeCreatorSignals(selected,inferred),intelligenceSource:Object.values(selected).some(v=>v.length)?'MANUAL_PLUS_PROFILE_INFERENCE':'PROFILE_INFERENCE'}}

function renderBatch(){
 const el=document.getElementById('creator-batch-list');
 const countEl=document.getElementById('creator-batch-count');
 if(countEl)countEl.textContent=`${S.creatorBatch.length} pending`;
 if(!el)return;
 el.innerHTML=S.creatorBatch.map((x,i)=>`<div class="list-card"><div><b>${esc(x.name)}</b><small>${esc(x.channel||'·')} · ${x.followers==null?'Followers not provided':money(x.followers)+' followers'}${x.secondaryChannel?' · '+esc(x.secondaryChannel):''}${Array.isArray(x.ecommerceChannels)&&x.ecommerceChannels.length?' · E-com: '+esc(x.ecommerceChannels.join(', ')):''} · Intelligence ${creatorSignalCoverage(x).required}/${creatorSignalCoverage(x).total}</small></div><div class="actions" style="margin:0;gap:8px"><button class="btn" type="button" data-edit-batch="${i}">Edit</button><button class="btn danger" type="button" data-remove-batch="${i}">Remove</button></div></div>`).join('')||'<div class="empty"><b>No unsaved creators.</b><br><span class="hint">Creators that have already been saved appear in the Creator Registry above. Use <b>+ Add creator</b> to queue another creator before saving.</span></div>';
 el.querySelectorAll('[data-remove-batch]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.removeBatch);if(!Number.isInteger(i)||i<0||i>=S.creatorBatch.length)return;if(S.creatorEditTarget?.type==='batch'&&S.creatorEditTarget.index===i)S.creatorEditTarget=null;S.creatorBatch.splice(i,1);renderBatch();clearCreatorForm()});
 el.querySelectorAll('[data-edit-batch]').forEach(b=>b.onclick=()=>editBatchCreator(Number(b.dataset.editBatch)));
}
function setCreatorActionMode(mode){
 const btn=document.getElementById('creator-action');
 if(!btn)return;
 const labels={default:'Save creators',batch:'Update creator',saved:'Update creator'};
 const label=labels[mode]||labels.default;
 btn.textContent=label;
 btn.dataset.action=mode==='default'?'save':'update';
 btn.dataset.mode=mode;
 btn.classList.toggle('primary',true);
}
function normalizeCreatorActionDom(){
 const form=document.getElementById('creator-form');
 if(!form)return null;
 let slot=document.getElementById('creator-action-slot');
 if(!slot){
   slot=document.createElement('div');slot.id='creator-action-slot';slot.className='actions';slot.dataset.creatorActionSlot='true';
   form.appendChild(slot);
 }
 let primary=document.getElementById('creator-action');
 if(!primary || !form.contains(primary)){
   primary=form.querySelector('[data-creator-action="primary"]')||form.querySelector('button[data-action]')||null;
 }
 if(!primary){
   primary=document.createElement('button');
   primary.className='btn primary';primary.type='button';primary.id='creator-action';primary.dataset.creatorAction='primary';
   primary.textContent='Save creators';
 }
 if(primary.parentElement!==slot)slot.appendChild(primary);
 primary.id='creator-action';primary.type='button';primary.dataset.creatorAction='primary';
 // HARD LOCK: there must be exactly one creator Update/Save action in the entire document.
 const isCreatorAction=(b)=>{
   const label=String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
   return b===primary || b.dataset.action==='update' || b.dataset.legacyCreatorAction!==undefined ||
     label==='update creator' || label==='updating…' || label==='updating...' ||
     b.id==='update-creator' || b.id==='save-creator-batch' || b.id==='add-creator-batch';
 };
 [...document.querySelectorAll('button')].forEach(b=>{if(b!==primary && isCreatorAction(b))b.remove()});
 return primary;
}
function enforceCreatorActionSingle(){
 const btn=normalizeCreatorActionDom();
 if(!btn)return;
 // Remove any duplicate exact-label action that may be injected after render by an older runtime.
 const seen=[];
 document.querySelectorAll('button').forEach(b=>{
   const label=String(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
   if(label==='update creator'||label==='updating…'||label==='updating...')seen.push(b);
 });
 seen.forEach(b=>{if(b!==btn)b.remove()});
 return btn;
}
function clearCreatorForm(){const form=document.getElementById('creator-form');form?.reset();const photo=document.getElementById('cr-photo-data');if(photo)photo.value='';const preview=document.getElementById('creator-photo-preview');if(preview)preview.innerHTML='';const status=document.getElementById('cr-photo-status');if(status)status.textContent='Upload a clear creator image. The browser compresses it before saving.';document.querySelectorAll('[data-chip]').forEach(b=>b.classList.remove('selected'));document.querySelectorAll('.custom-signal-chip').forEach(b=>b.remove());document.querySelectorAll('.signal-other').forEach(i=>i.value='');S.creatorEditTarget=null;setCreatorActionMode('default')}
function populateCreatorForm(x,target){if(!x)return;const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};set('cr-name',x.name);set('cr-channel',x.channel);set('cr-secondary',x.secondaryChannel);set('cr-followers',x.followers);set('cr-er',x.er);set('cr-rate',x.rate);set('cr-primary-link',x.primaryChannelLink||x.profileUrl);set('cr-ecom-store-link',x.ecommerceStoreLink||'');document.querySelectorAll('[data-ecom-channel]').forEach(b=>b.checked=Array.isArray(x.ecommerceChannels)&&x.ecommerceChannels.includes(b.value));set('cr-bio',x.bio);set('cr-photo-data',x.profileImageUrl||'');document.querySelectorAll('[data-chip]').forEach(b=>b.classList.remove('selected'));document.querySelectorAll('.custom-signal-chip').forEach(b=>b.remove());Object.entries(x.intelligence||{}).forEach(([k,values])=>{const selected=Array.isArray(values)?values:[];document.querySelectorAll(`[data-chip="${k}"]`).forEach(b=>{if(selected.includes(b.dataset.value))b.classList.add('selected')});const wrap=document.querySelector(`[data-chips-for="${k}"]`);if(!wrap)return;const standard=(signalExamples[k]||[]);selected.filter(v=>v&&!standard.includes(v)).forEach(value=>{const btn=document.createElement('button');btn.type='button';btn.className='chip selected custom-signal-chip';btn.dataset.customSignal=k;btn.dataset.customValue=value;btn.innerHTML=`${esc(value)} <b aria-hidden="true">×</b>`;btn.onclick=()=>btn.remove();wrap.appendChild(btn)})});const preview=document.getElementById('creator-photo-preview');const status=document.getElementById('cr-photo-status');if(preview&&x.profileImageUrl)preview.innerHTML=`<img src="${esc(x.profileImageUrl)}" alt="Creator preview" style="width:96px;height:96px;object-fit:cover;border-radius:16px;border:1px solid #e6e7eb">`;if(status)status.textContent=x.profileImageUrl?'Photo ready':'Upload a clear creator image. The browser compresses it before saving.';S.creatorEditTarget=target;const details=document.querySelector('#creator-form')?.closest('details');if(details)details.open=true;document.getElementById('creator-action')?.scrollIntoView({behavior:'smooth',block:'center'});setCreatorActionMode(target.type==='saved'?'saved':'batch')}
function editBatchCreator(index){const x=S.creatorBatch[index];if(!x)return;populateCreatorForm(x,{type:'batch',index});toast(`Editing ${x.name}`,'info')}
function editSavedCreator(id){const x=S.creators.find(v=>String(v.id)===String(id));if(!x)return;const p=x.payload||{};populateCreatorForm({name:x.name,...p,profileImageUrl:p.profileImageUrl||p.profileImageUrl},{type:'saved',id:x.id});toast(`Editing ${x.name}`,'info')}
async function removeSavedCreator(id){
 const x=S.creators.find(v=>String(v.id)===String(id));
 if(!x)return;
 const name=x.name||'this creator';
 if(!window.confirm(`Remove ${name} from Saved Creators?\n\nThis will remove the creator from the registry and from any current shortlist/approved selection.`))return;
 const btn=document.querySelector(`[data-remove-saved=\"${String(id).replace(/\"/g,'\\\"')}\"]`);
 if(btn?.dataset.busy==='1')return;
 if(btn){btn.dataset.busy='1';btn.disabled=true;btn.textContent='Removing…'}
 try{
   const q=await sb.from('creators').delete().eq('id',id).eq('organization_id',S.org.id);
   if(q.error)throw q.error;
   if(S.selectedCampaign?.id){
     const payload={...(S.selectedCampaign.payload||{})};
     const shortlist=Array.isArray(payload.decisionShortlistIds)?payload.decisionShortlistIds:[];
     const approved=Array.isArray(payload.selectedCreatorIds)?payload.selectedCreatorIds:[];
     payload.decisionShortlistIds=shortlist.filter(v=>String(v)!==String(id));
     payload.selectedCreatorIds=approved.filter(v=>String(v)!==String(id));
     if(shortlist.length!==payload.decisionShortlistIds.length||approved.length!==payload.selectedCreatorIds.length){
       const cq=await sb.from('campaigns').update({payload,updated_at:new Date().toISOString()}).eq('id',S.selectedCampaign.id).eq('organization_id',S.org.id).select().single();
       if(cq.error)throw cq.error;
       S.selectedCampaign=cq.data;
       const ci=S.campaigns.findIndex(v=>String(v.id)===String(cq.data.id));
       if(ci>=0)S.campaigns[ci]=cq.data;
     }
   }
   if(S.creatorEditTarget?.type==='saved'&&String(S.creatorEditTarget.id)===String(id))clearCreatorForm();
   await refresh();
   toast(`${name} removed`,'good');
   renderPage();
 }catch(err){
   toast(err?.message||'Could not remove creator. No changes were kept.','error');
 }finally{
   if(btn&&document.body.contains(btn)){btn.dataset.busy='0';btn.disabled=false;btn.textContent='Remove'}
 }
}
function creatorKolCode(x){const seed=String(x?.primaryChannelLink||x?.name||'CREATOR').trim().toUpperCase().replace(/[^A-Z0-9]+/g,'');const base=(seed.slice(0,6)||'CREATOR');const suffix=Math.random().toString(36).slice(2,8).toUpperCase();return `KOL-${base}-${suffix}`}
async function updateSavedCreator(x){const target=S.creatorEditTarget;if(!target||target.type!=='saved')return false;const payload={channel:x.channel,secondaryChannel:x.secondaryChannel,ecommerceChannels:x.ecommerceChannels||[],ecommerceStoreLink:x.ecommerceStoreLink||'',followers:x.followers,er:x.er,rate:x.rate,primaryChannelLink:x.primaryChannelLink,profileUrl:x.primaryChannelLink,profileImageUrl:x.profileImageUrl,bio:x.bio,intelligence:x.intelligence,intelligenceSource:x.intelligenceSource,campaignId:S.selectedCampaign?.id||null,updatedAt:new Date().toISOString()};const q=await sb.from('creators').update({name:x.name,payload}).eq('id',target.id).eq('organization_id',S.org.id).select().single();if(q.error){toast(q.error.message||'Could not update creator','error');return false}await refresh();toast('Creator updated','good');clearCreatorForm();if(S.selectedCampaign?.id&&S.selectedAudience?.id){try{const fit=await intelligenceCall('analyze',{creator_ids:[target.id]});if(!fit?.success)throw new Error(fit?.error||'Fit refresh did not complete');await refresh();toast('Creator updated · campaign fit refreshed','good')}catch(err){toast(`Creator updated, but fit could not refresh: ${err.message||'check campaign and audience data.'}`,'error')}}renderPage();return true}
async function autoCalculateCreatorFit(){
 const campaignId=S.selectedCampaign?.id, audienceId=S.selectedAudience?.id;
 if(!campaignId||!audienceId||!S.creators.length||S.creatorFitAutoBusy)return;
 const creatorKey=S.creators.map(x=>String(x.id)).sort().join(',');
 const key=`${campaignId}|${audienceId}|${creatorKey}`;
 const rows=latestDecisionRows();
 if(rows.length>=S.creators.length && rows.every(x=>x.creator))return;
 if(S.creatorFitAutoKey===key)return;
 S.creatorFitAutoKey=key;S.creatorFitAutoBusy=true;
 const wrap=document.getElementById('creator-fit-results');
 if(wrap)wrap.innerHTML='<div class="empty">Calculating Creator Fit automatically from your Campaign, Audience and Creator Intelligence…</div>';
 try{
   const data=await calculateCreatorFitSafe(S.creators.map(x=>x.id));
   if(!data?.success)throw new Error(data?.error||'Creator fit analysis failed.');
   // Render local/remote results immediately; refresh only if persistence succeeded.
   renderPage();
   if(data.localFallback) toast('Fit calculated locally · the remote engine is unavailable, so the page will not be blocked.','info');
   else { await refresh(); if(S.page===2)renderPage(); }
 }catch(err){
   S.creatorFitAutoKey=null;
   const wrap=document.getElementById('creator-fit-results');
   if(wrap)wrap.innerHTML='<div class="empty">Fit could not be calculated. Check Campaign + Audience data and try again.</div>';
   toast(err.message||'Creator fit analysis failed.','error');
 }finally{S.creatorFitAutoBusy=false;}
}

function creators(c){
 const shortlist=Array.isArray(S.selectedCampaign?.payload?.decisionShortlistIds)?S.selectedCampaign.payload.decisionShortlistIds:[];
 c.innerHTML=`<section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">CREATOR REGISTRY</div><h2>KOL Persona & Intelligence</h2><p class="sub">Add creators manually using the creator information available to you.</p></div><div class="hero-actions"><span class="pill cyan">Up to 100 creators / analysis</span></div></div>
 <details class="advanced-details" open style="margin-top:14px"><summary><b>MANUAL CREATOR INTAKE</b><span class="hint">Enter creator information directly</span></summary><div class="card" style="margin-top:12px"><div class="section-head"><div><div class="label">MANUAL CREATOR INTAKE</div><h2>Creator profile</h2><p class="sub">Enter creator information directly. This is the primary creator intake path.</p></div></div>
 <form id="creator-form"><div class="form-grid">
 <div class="field"><label>Creator / KOL Name <span class="required-star">*</span></label><input id="cr-name" required placeholder="Creator name"></div>
 <div class="field"><label>Primary Channel <span class="required-star">*</span></label><select id="cr-channel" required><option value="">Select channel</option><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>Facebook</option><option>X</option><option>Lemon8</option><option>Weibo</option><option>Other</option></select></div>
 <div class="field"><label>Primary Channel link <span class="required-star">*</span></label><input id="cr-primary-link" type="url" required placeholder="https://instagram.com/... or primary profile URL"></div>
 <div class="field"><label>Secondary Channel</label><select id="cr-secondary"><option value="">None / not known</option><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>Facebook</option><option>X</option><option>Lemon8</option><option>Weibo</option><option>Other</option></select></div>
 <div class="creator-ecommerce-box"><div class="label">E-COMMERCE CHANNELS</div><b style="display:block;margin-top:4px;font-size:12px">Where can this creator drive sales?</b><div class="ecom-channel-grid">${ecomChannelOptions([])}</div><div class="field" style="margin-top:10px"><label>Primary store / shop link</label><input id="cr-ecom-store-link" type="url" placeholder="https://... TikTok Shop / Shopee / Lazada / website"></div><div class="ecom-linked-note">These channels flow into Gen Code attribution and Step 05 e-commerce performance. Select every shop the creator actively uses.</div></div>
 <div class="field"><label>Followers</label><input id="cr-followers" type="text" inputmode="decimal" data-number-format min="0" placeholder="e.g. 850000"></div>
 <div class="field"><label>Engagement rate %</label><input id="cr-er" type="text" inputmode="decimal" data-number-format min="0" max="100" step="0.01" placeholder="Optional if unknown"></div>
 <div class="field"><label>Rate / Fee</label><input id="cr-rate" type="text" inputmode="decimal" data-number-format min="0" placeholder="Optional"></div>
 <div class="field"><label>Creator photo</label><input id="cr-photo" type="file" accept="image/*"><input id="cr-photo-data" type="hidden"><span id="cr-photo-status" class="hint">Upload a clear creator image. The browser compresses it before saving.</span></div>
 </div><div id="creator-photo-preview" style="margin-top:12px"></div>
 <div class="field full" style="margin-top:14px"><label>Creator bio / content description <span class="required-star">*</span></label><textarea id="cr-bio" required style="min-height:120px" placeholder="Paste the creator bio, profile description, content style or a short description of what they usually create."></textarea><span class="hint">KOL IDS uses this to build the 8 intelligence dimensions. You can still edit signals manually below.</span></div>
 <details class="advanced-details" style="margin-top:18px"><summary><b>Advanced creator intelligence</b><span class="hint">Optional manual refinement</span></summary><div class="signal-grid" style="margin-top:12px">${Object.keys(signalExamples).map(k=>chipGroup(k,[])).join('')}</div><div class="hint" style="margin-top:10px">Manual signals override the inferred signal for that category.</div></details>
 <div class="actions" id="creator-action-slot" data-creator-action-slot><button class="btn primary" type="button" id="creator-action" data-creator-action="primary" data-action="default">Save creators</button></div></form></div></details>
 <div id="creator-registry-shortlist"></div></div>`;
 setCreatorActionMode('default');

 if(S.selectedCampaign?.id&&S.selectedAudience?.id&&S.creators.length) setTimeout(autoCalculateCreatorFit,0);
 renderBatch();
 const renderRegistry=()=>{
  const wrap=document.getElementById('creator-registry-shortlist');
  const fitById=new Map(latestDecisionRows().map(row=>[String(row.creator.id),row.decision]));
  const dimension=(e,key,legacyKey)=>{
   const de=e?.dimensionEvidence||{}; const v=e?.[key]; const obj=de[key]||de[legacyKey]||{};
   return {score:v==null?(obj.score==null?null:Number(obj.score)):Number(v),reason:obj.reason||e?.[`${key}Reason`]||'Calculated from available campaign, audience, brand and creator evidence.',action:obj.action||e?.[`${key}Action`]||'Adjust the creator brief or activation plan, then re-check fit.'};
  };
  const short=(v,n=180)=>{const t=String(v||'').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1)+'…':t};
  const scoreTone=(n)=>n==null?'neutral':n>=80?'strong':n>=65?'good':'adjust';
  wrap.innerHTML=S.creators.length?`<section class="card creator-registry-card creator-registry-v3">
   <div class="creator-registry-head"><div><div class="label">CREATOR DECISION LAYER</div><h2 style="margin:3px 0 4px">Creator Fit &amp; Decision Readiness</h2><p class="sub">Fit, evidence and next action at a glance.</p></div><div class="hero-actions"><div class="creator-header-counters"><span class="creator-count-pill"><b>${S.creators.length}/100</b><small>saved</small></span><span class="creator-count-pill cyan"><b id="shortlist-count-number">${shortlist.length}</b><small>shortlisted</small></span></div><button class="btn" id="save-creator-fit-pdf" ${S.creators.length?'':'disabled'}>Save PDF</button><button class="btn cyan" id="run-creator-fit" ${S.creators.length?'':'disabled'}>Calculate / refresh fit</button></div></div>
   <div class="creator-fit-list"><div class="creator-fit-list-head"><span>CREATOR</span><span>FIT</span><span>EVIDENCE</span><span>CONF.</span><span>DECISION READ</span><span>ACTIONS</span></div>
   ${S.creators.map((x,i)=>{
    const p=x.payload||{},sel=shortlist.includes(x.id),coverage=creatorSignalCoverage(x),d=fitById.get(String(x.id)),e=d?.evidence||{};
    const rawFit=d?.score==null?null:Math.round(d.score), fit=rawFit==null?'·':rawFit;
    const dims=[['Audience Fit','audienceFit','audience','Audience'],['Campaign Fit','contentFit','campaign','Campaign'],['Brand Fit','brandFit','brand','Brand'],['Performance Evidence','performance','performance','Evidence'],['Commercial Fit','commercial','commercial','Efficiency'],['Risk ↓','risk','risk','Risk']].map(([label,key,legacy,shortLabel])=>[label,dimension(e,key,legacy),shortLabel]);
    const gaps=dims.filter(([,v])=>v.score!=null).sort((a,b)=>{const av=a[0]==='Risk ↓'?100-a[1].score:a[1].score,bv=b[0]==='Risk ↓'?100-b[1].score:b[1].score;return av-bv;});
    const priority=gaps[0], recovery=Array.isArray(e.recoveryPlan)?e.recoveryPlan:[];
    const confidence=e.confidence==null?null:Math.round(Number(e.confidence));
    const evidenceScore=dims.find(([l])=>l==='Performance Evidence')?.[1]?.score;
    const efficiencyScore=dims.find(([l])=>l==='Commercial Fit')?.[1]?.score;
    const summaryFor=(p)=>({Audience:'Audience match needs work.',Campaign:'Campaign objective fit needs work.',Brand:'Brand alignment needs work.',Evidence:'More performance evidence is needed.',Efficiency:'Fee / budget fit needs review.',Risk:'Execution risk needs tighter controls.'}[p?.[2]||'']||'Fit is based on the available evidence.');
    const actionFor=(p)=>({Audience:'Refine audience + content examples.',Campaign:'Tighten brief, message + CTA.',Brand:'Set 2–3 brand cues.',Evidence:'Add recent reach + conversions.',Efficiency:'Adjust scope or test budget.',Risk:'Add tighter review controls.'}[p?.[2]||'']||'Keep the brief aligned and test.');
    const overallWhy=summaryFor(priority);
    const next=actionFor(priority);
    const status=rawFit==null?'Awaiting fit':rawFit>=85?'Strong consider':rawFit>=70?'Consider':rawFit>=55?'Review':'Needs work';
    const tone=scoreTone(rawFit); const photo=p.profileImageUrl||''; const initials=(x.name||'K').trim().slice(0,1).toUpperCase();
    const reason=overallWhy||'Fit is based on available evidence.';
    return `<article class="creator-fit-row ${tone}">
      <div class="creator-fit-main">
       <div class="creator-identity"><label class="creator-check"><input type="checkbox" data-shortlist-creator="${x.id}" ${sel?'checked':''}><span></span></label><div class="creator-row-avatar">${photo?`<img src="${esc(photo)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`:''}<span style="${photo?'display:none':''}">${esc(initials)}</span></div><div><div class="creator-row-name">${esc(x.name)}</div><div class="creator-handle">${esc(x.kol_code||p.handle||'Creator profile')}</div><div class="creator-mini-meta"><span>${esc(p.channel||'·')}</span><span>${p.followers==null?'·':money(p.followers)} followers</span><span>${p.er==null?'·':pct(p.er)} ER</span></div></div></div>
       <div class="creator-score"><div class="creator-score-number">${fit}<small>/100</small></div><div class="creator-score-label">${esc(status)}</div></div>
       <div class="creator-stat"><b>${evidenceScore==null?'·':Math.round(evidenceScore)}</b><span>Evidence</span></div>
       <div class="creator-stat"><b>${confidence==null?'·':confidence}</b><span>Confidence</span></div>
       <div class="creator-read"><div class="creator-read-top"><span class="decision-badge ${tone}">${esc(status)}</span>${priority?`<span class="gap-badge">Gap: ${esc(priority[0])}</span>`:''}</div><p>${esc(reason)}</p><div class="creator-next"><b>Next:</b> ${esc(next)}</div></div>
       <div class="creator-actions-v3">${p.primaryChannelLink?`<a class="social-link" href="${esc(p.primaryChannelLink)}" target="_blank" rel="noopener">Social ↗</a>`:''}<button class="btn" type="button" data-edit-saved="${x.id}">Edit</button><button class="btn remove-creator-btn" type="button" data-remove-saved="${x.id}">Remove</button></div>
      </div>
      <div class="creator-fit-details"><div class="creator-detail-grid">${dims.map(([label,v,shortLabel])=>{const n=v.score==null?null:Math.round(v.score);const ci=compactDimensionInsight(shortLabel,n,v);return `<div class="creator-detail"><div class="creator-detail-top"><span>${esc(shortLabel)}</span><b>${n==null?'·':n}</b></div><div class="creator-detail-bar ${label==='Risk ↓'?'risk':''}"><i style="width:${n==null?0:Math.max(0,Math.min(100,n))}%"></i></div><p>${esc(ci.reason)}</p><div class="creator-detail-action">${esc(ci.action)}</div></div>`}).join('')}</div><div class="creator-detail-bottom"><div><b>Why</b><span>${esc(overallWhy)}</span></div><div><b>If selected</b><span>${esc(next)}</span></div>${recovery.length?`<div><b>Campaign move</b><span>${esc(next)}</span></div>`:''}</div></div>
    </article>`;
   }).join('')}</div>
   <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn primary" id="save-shortlist-registry">Save shortlist → Decision</button></div>
  </section>`:'<div class="empty">Save creators first. Then choose the creators that should move into Decision.</div>';
  const updateShortlistCount=()=>{
   const shortlistCount=document.getElementById('shortlist-count-number');
   if(shortlistCount) shortlistCount.textContent=String(document.querySelectorAll('[data-shortlist-creator]:checked').length);
  };
  updateShortlistCount();
  document.querySelectorAll('[data-shortlist-creator]').forEach(el=>el.onchange=updateShortlistCount);
  document.querySelectorAll('[data-edit-saved]').forEach(b=>b.onclick=()=>editSavedCreator(b.dataset.editSaved));
  document.querySelectorAll('[data-remove-saved]').forEach(b=>b.onclick=()=>removeSavedCreator(b.dataset.removeSaved));
  document.getElementById('save-shortlist-registry')?.addEventListener('click',async()=>{const btn=document.getElementById('save-shortlist-registry');if(btn?.dataset.busy==='1')return;if(!S.selectedCampaign){toast('Create a campaign first.','error');return}const ids=[...document.querySelectorAll('[data-shortlist-creator]:checked')].map(x=>x.dataset.shortlistCreator).filter(id=>S.creators.some(c=>String(c.id)===String(id)));if(!ids.length){toast('Select at least one creator before continuing.','error');return}const payload={...(S.selectedCampaign.payload||{}),decisionShortlistIds:ids,decisionShortlistUpdatedAt:new Date().toISOString()};if(btn){btn.dataset.busy='1';btn.disabled=true;btn.textContent='Saving shortlist…'}try{const q=await sb.from('campaigns').update({payload,updated_at:new Date().toISOString()}).eq('id',S.selectedCampaign.id).eq('organization_id',S.org.id).select().single();if(q.error)throw q.error;S.selectedCampaign=q.data;const i=S.campaigns.findIndex(x=>x.id===q.data.id);if(i>=0)S.campaigns[i]=q.data;toast(`${ids.length} creator${ids.length===1?'':'s'} moved to Decision`,'good');S.page=3;renderPage()}catch(err){toast(err.message||'Could not save shortlist. Your current selection is still on screen.','error')}finally{if(btn){btn.dataset.busy='0';btn.disabled=false;btn.textContent='Save shortlist → Decision'}}});
  document.getElementById('save-creator-fit-pdf')?.addEventListener('click',()=>exportGateOr(downloadCreatorFitPDF));
  document.getElementById('run-creator-fit')?.addEventListener('click',async()=>{const btn=document.getElementById('run-creator-fit');if(!btn||btn.dataset.busy==='1')return;if(!S.selectedCampaign){toast('Create and save a campaign first.','error');return}if(!S.selectedAudience){toast('Complete Audience before calculating creator fit.','error');S.page=1;renderPage();return}btn.dataset.busy='1';btn.disabled=true;btn.textContent='Calculating…';try{const data=await calculateCreatorFitSafe(S.creators.map(x=>x.id));if(!data.success)throw new Error(data.error||'Creator fit analysis failed.');await refresh();toast(`${data.localFallback?'Local fit calculated':'Creator fit calculated'} · ${data.rows?.length||0} creators`,'good');renderPage()}catch(err){toast(err.message||'Creator fit analysis failed.','error')}finally{if(document.body.contains(btn)){btn.dataset.busy='0';btn.disabled=false;btn.textContent='Calculate / refresh fit'}}});
 };
 try{renderRegistry()}catch(err){
   console.error('[KOL IDS] Creator registry render failed',err);
   const wrap=document.getElementById('creator-registry-shortlist');
   if(wrap)wrap.innerHTML='<div class="empty">Creator registry could not render. Your creator form is still available. Refresh the page after checking the console error.</div>';
   toast('Creator registry had a display error. The creator form remains available.','error');
 }
 // Bind Creator Intelligence controls through one stable form-level delegation.
 // This avoids losing click handlers when the registry is re-rendered by fit calculations.
 const creatorForm=document.getElementById('creator-form');
 if(creatorForm && !creatorForm.dataset.interactionBound){
   creatorForm.dataset.interactionBound='1';
   creatorForm.addEventListener('click',e=>{
     const chip=e.target.closest('[data-chip]');
     if(chip && creatorForm.contains(chip)){e.preventDefault();chip.classList.toggle('selected');return;}
     const custom=e.target.closest('.custom-signal-chip');
     if(custom && creatorForm.contains(custom)){e.preventDefault();custom.remove();}
   });
   creatorForm.addEventListener('keydown',e=>{
     const input=e.target.closest('.signal-other');
     if(!input || e.key!=='Enter')return;
     e.preventDefault();
     const value=input.value.trim(); if(!value)return;
     const k=input.dataset.otherFor;
     const wrap=creatorForm.querySelector(`[data-chips-for="${k}"]`); if(!wrap)return;
     const exists=[...wrap.querySelectorAll('[data-custom-signal]')].some(b=>String(b.dataset.customValue).toLowerCase()===value.toLowerCase());
     if(!exists){
       const btn=document.createElement('button');btn.type='button';btn.className='chip selected custom-signal-chip';btn.dataset.customSignal=k;btn.dataset.customValue=value;btn.innerHTML=`${esc(value)} <b aria-hidden="true">×</b>`;wrap.appendChild(btn);
     }
     input.value='';
   });
 }
 const photoInput=document.getElementById('cr-photo');
 if(photoInput) photoInput.onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=await compressCreatorImage(file);const dataEl=document.getElementById('cr-photo-data'),statusEl=document.getElementById('cr-photo-status'),previewEl=document.getElementById('creator-photo-preview');if(dataEl)dataEl.value=data;if(statusEl)statusEl.textContent='Photo ready';if(previewEl)previewEl.innerHTML=`<img src="${data}" alt="Creator preview" style="width:96px;height:96px;object-fit:cover;border-radius:16px;border:1px solid #e6e7eb">`}catch(err){toast(err.message||'Could not process image','error')}};
 document.querySelectorAll('[data-edit-saved]').forEach(b=>b.onclick=()=>editSavedCreator(b.dataset.editSaved));
 let creatorMutationBusy=false;
document.getElementById('creator-action').onclick=async()=>{
 const btn=document.getElementById('creator-action');
 if(!btn||btn.dataset.busy==='1'||creatorMutationBusy)return;
 const mode=S.creatorEditTarget?.type||'default';
 creatorMutationBusy=true;btn.dataset.busy='1';btn.disabled=true;
 try{
  const x=creatorFormCollect();
  if(!x.name||!x.channel||!x.primaryChannelLink||!x.bio){toast('Complete the creator name, channel, profile link and creator description.','error');return}
  if(!/^https?:\/\/\S+$/i.test(x.primaryChannelLink)){toast('Enter a valid creator profile URL.','error');return}
  if(Object.values(x.intelligence).some(v=>!v.length)){toast('Creator intelligence could not be derived. Add a short creator description.','error');return}
  if(mode==='saved'){btn.textContent='Updating…';await updateSavedCreator(x);return}
  if(mode==='batch'){
   const i=S.creatorEditTarget.index;
   if(Number.isInteger(i)&&i>=0&&i<S.creatorBatch.length){S.creatorBatch[i]=x;toast(`${x.name} updated`,'good');clearCreatorForm();renderBatch();}
   return;
  }
  if(S.creatorBatch.length>=100){toast('You can add up to 100 creators at once.','error');return}
  const identity=x.primaryChannelLink.trim().replace(/\/$/,'').toLowerCase();
  const duplicate=[...S.creators.map(v=>String(v.payload?.primaryChannelLink||'').trim().replace(/\/$/,'').toLowerCase()),...S.creatorBatch.map(v=>String(v.primaryChannelLink||'').trim().replace(/\/$/,'').toLowerCase())].includes(identity);
  if(duplicate){toast('This creator profile is already in your saved or pending creator list.','error');return}
  const payload={channel:x.channel,secondaryChannel:x.secondaryChannel,ecommerceChannels:x.ecommerceChannels||[],ecommerceStoreLink:x.ecommerceStoreLink||'',followers:x.followers,er:x.er,rate:x.rate,primaryChannelLink:x.primaryChannelLink,profileUrl:x.primaryChannelLink,profileImageUrl:x.profileImageUrl,bio:x.bio,intelligence:x.intelligence,intelligenceSource:x.intelligenceSource,campaignId:S.selectedCampaign?.id||null,updatedAt:new Date().toISOString()};
  btn.textContent='Saving…';
  const q=await sb.from('creators').insert({organization_id:S.org.id,name:x.name,payload}).select().single();
  if(q.error)throw q.error;
  await refresh();
  toast(`${x.name} saved successfully`,'good');
  clearCreatorForm();
  renderPage();
 }catch(err){
  toast(err?.message||'Could not save creator. Please try again.','error');
 }finally{creatorMutationBusy=false;btn.dataset.busy='0';btn.disabled=false;if(document.body.contains(btn))setCreatorActionMode(S.creatorEditTarget?.type||'default');}
};
 // HARD LOCK SINGLE ACTION: enforce once now and continuously against legacy/stale DOM injections.
 enforceCreatorActionSingle();
 if(!window.__KOL_IDS_CREATOR_ACTION_OBSERVER){
   window.__KOL_IDS_CREATOR_ACTION_OBSERVER=new MutationObserver(()=>enforceCreatorActionSingle());
   window.__KOL_IDS_CREATOR_ACTION_OBSERVER.observe(document.body,{subtree:true,childList:true});
 }

}
async function compressCreatorImage(file){if(!file.type.startsWith('image/'))throw new Error('Please upload an image file.');if(file.size>8*1024*1024)throw new Error('Image is too large. Please use an image under 8 MB.');return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('Could not read image.'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error('Could not decode image.'));img.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/webp',.82))};img.src=reader.result};reader.readAsDataURL(file)})}
function calculateDecision(c){const s=creatorSignal(c),w=decisionWeights();if(w.total!==100)return{...s,decision:'INVALID WEIGHTS',score:null};const score=clamp(s.fit*(w.brand/100)+s.audienceFit*(w.audience/100)+s.contentFit*(w.campaign/100)+s.confidence*(w.confidence/100)+(s.commercial==null?0:s.commercial)*(w.value/100)+(100-s.risk)*(w.risk/100));const threshold=num(S.selectedCampaign?.payload?.threshold)??70;const ceiling=num(S.selectedCampaign?.payload?.riskCeiling)??60;let decision;if(s.coverage.required<8||s.completeness<100)decision='INSUFFICIENT INTELLIGENCE';else if(s.evidence<50)decision='REVIEW REQUIRED';else if(s.risk>ceiling)decision='RISK EXCEEDS CEILING';else if(score>=threshold&&s.confidence>=60)decision='RECOMMENDED';else if(score>=60)decision='CONSIDER';else decision='NOT RECOMMENDED';return{...s,score:Math.round(score*100)/100,decision,threshold,ceiling,method:'Weighted decision = brand + audience + campaign/content + confidence + value − risk; evidence completeness gates the output.'}}
function latestDecisionRows(){
 const map=new Map();
 S.decisions.filter(x=>!S.selectedCampaign||x.campaign_id===S.selectedCampaign.id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).forEach(d=>{if(d.creator_id&&!map.has(d.creator_id))map.set(String(d.creator_id),d)});
 (S.localFitRows||[]).forEach(d=>{if(d.creator_id&&!map.has(String(d.creator_id)))map.set(String(d.creator_id),{...d,id:`local-${d.creator_id}`,creator_id:d.creator_id,campaign_id:S.selectedCampaign?.id||null,created_at:new Date().toISOString()})});
 return [...map.values()].map(d=>({decision:d,creator:S.creators.find(c=>String(c.id)===String(d.creator_id))})).filter(x=>x.creator);
}
function creatorAdaptation(x){const gaps=[];if(Number(x.audienceFit||0)<70)gaps.push('tighten audience targeting');if(Number(x.contentFit||0)<70)gaps.push('align content to the objective');if(Number(x.brandFit||0)<70)gaps.push('add clear brand guardrails');if(Number(x.risk||0)>50)gaps.push('use tighter review controls');if(!gaps.length)gaps.push('keep the brief aligned to the campaign');return gaps.join(' · ')+'.'}
function compactDimensionInsight(label,n,v){
 const score=Number(n);
 const action={
  Audience:'Refine audience + examples.',
  Campaign:'Tighten brief + CTA.',
  Brand:'Set 2–3 brand cues.',
  Evidence:'Add recent reach + conversions.',
  Efficiency:'Adjust scope or test budget.',
  Risk:'Keep safety checks.'
 }[label]||'Validate with a controlled test.';
 const reason={
  Audience:score>=80?'Strong audience match.':score>=60?'Moderate audience match.':'Limited audience match.',
  Campaign:score>=80?'Strong objective fit.':score>=60?'Moderate objective fit.':'Limited objective fit.',
  Brand:score>=80?'Strong brand alignment.':score>=60?'Moderate brand alignment.':'Limited brand alignment.',
  Evidence:score>=80?'Strong performance evidence.':score>=60?'Moderate performance evidence.':'Limited performance evidence.',
  Efficiency:score>=80?'Strong fee / budget fit.':score>=60?'Moderate fee / budget fit.':'Limited fee / budget fit.',
  Risk:score<=30?'Low execution risk.':score<=60?'Moderate execution risk.':'Higher execution risk.'
 }[label]||'Evidence available for review.';
 return {reason,action};
}

function decisionStrategy(e,creator,campaign){const obj=String(campaign?.payload?.objective||campaign?.payload?.goal||'AWARENESS').toUpperCase();const audience=Number(e?.audienceFit??50),content=Number(e?.contentFit??50),brand=Number(e?.brandFit??50),perf=Number(e?.performance??0),commercial=Number(e?.commercial??50),risk=Number(e?.risk??50);let bestRole='Audience / Content';if(/SALES|CONVERSION|LEAD/.test(obj))bestRole=commercial>=70?'Conversion Driver':'Conversion Support';else if(/ENGAGEMENT|COMMUNITY/.test(obj))bestRole=audience>=75?'Engagement Driver':'Engagement Support';else if(/TRAFFIC/.test(obj))bestRole=content>=75?'Traffic Driver':'Traffic Support';else if(/CONSIDERATION/.test(obj))bestRole=brand>=75?'Consideration Builder':'Consideration Support';else if(audience>=80&&content>=75)bestRole='Reach Driver';else if(brand>=80)bestRole='Brand Affinity';const gaps=[];if(audience<70)gaps.push('Audience fit');if(content<70)gaps.push('Content fit');if(brand<70)gaps.push('Brand fit');if(perf<50)gaps.push('Evidence');if(commercial<60)gaps.push('Commercial');if(risk>50)gaps.push('Risk');const fitGap=gaps.length?gaps.join(' · '):'No major fit gap';let format='Creator-native video';const ci=creator?.payload?.intelligence||{};const blob=Object.values(ci).flat().join(' ').toLowerCase();if(/review|demo|tutorial|how-to|education/.test(blob))format='Review / demo / tutorial';else if(/event|community|lifestyle|experience/.test(blob))format='Story / community';else if(/photo|fashion|beauty|visual/.test(blob))format='Visual / UGC';if(/SALES|CONVERSION/.test(obj)&&commercial>=65)format='Product demo + CTA';const deploy=risk>50?'Controlled test + guardrails':commercial>=70?'Performance + attribution':'Creator-native + KPI guardrails';return{bestRole,fitGap,contentFormat:format,deployment:deploy,decisionWhy:e?.reason||'Calculated from available campaign, audience and creator evidence.'}}
function predictionLearningForCreator(creatorId){const rows=S.predictions.filter(x=>x.campaign_id===S.selectedCampaign?.id&&x.creator_id===creatorId).sort((a,b)=>new Date(b.predicted_at||0)-new Date(a.predicted_at||0));if(!rows.length)return null;const r=rows[0];const predicted=Number(r.predicted_score),actual=r.actual_score==null?null:Number(r.actual_score);return{predicted,actual,delta:actual==null?null:actual-predicted,covered:r.covered}}
function predictionLearningSummary(){const rows=S.predictions.filter(x=>x.campaign_id===S.selectedCampaign?.id&&x.actual_score!=null&&x.predicted_score!=null);if(!rows.length)return{n:0,mae:null,bias:null,coverage:null};const errs=rows.map(x=>Number(x.actual_score)-Number(x.predicted_score));return{n:rows.length,mae:errs.reduce((a,v)=>a+Math.abs(v),0)/errs.length,bias:errs.reduce((a,v)=>a+v,0)/errs.length,coverage:rows.filter(x=>x.covered).length/rows.length*100}}
function adaptiveLearningSummary(){const rows=S.predictions.filter(x=>x.actual_score!=null&&x.predicted_score!=null);if(!rows.length)return{n:0,mae:null,bias:null,coverage:null,creatorAdapted:0,accountCalibrated:0};const errs=rows.map(x=>Number(x.actual_score)-Number(x.predicted_score));const creators=new Set(rows.filter(x=>Number(x.evidence?.creatorCalibrationN||0)>=3).map(x=>String(x.creator_id)));const calibrated=rows.filter(x=>Number(x.evidence?.calibrationN||0)>=10).length;return{n:rows.length,mae:errs.reduce((a,v)=>a+Math.abs(v),0)/errs.length,bias:errs.reduce((a,v)=>a+v,0)/errs.length,coverage:rows.filter(x=>x.covered).length/rows.length*100,creatorAdapted:creators.size,accountCalibrated:calibrated}}
function decision(c){const active=S.selectedCampaign;if(!active){c.innerHTML='<div class="empty">Create/select a campaign first.</div>';return}const shortlist=Array.isArray(active.payload?.decisionShortlistIds)?active.payload.decisionShortlistIds:[],rows=latestDecisionRows().filter(x=>!shortlist.length||shortlist.includes(x.creator.id));const selectedIds=Array.isArray(active.payload?.selectedCreatorIds)?active.payload.selectedCreatorIds:[];c.innerHTML=`<div class="hero"><div><div class="kicker">STEP 04 · DECISION</div><h2>Creator Decision Intelligence</h2><p>Review fit and approve creators.</p></div><div class="hero-actions"><button class="btn cyan" id="run-analysis" ${rows.length||S.creators.length?'':'disabled'}>Calculate fit</button></div></div><section class="card"><div class="section-head"><div><div class="label">Step 03 shortlist</div><h2>${shortlist.length} creator${shortlist.length===1?'':'s'} shortlisted</h2><p class="sub">Choose creators for tracking.</p></div><span class="pill cyan">${selectedIds.length} approved</span></div>${rows.length?`<div class="grid g2">${rows.map(({decision:d,creator:r})=>{const e=d.evidence||{},photo=r.payload?.profileImageUrl||'',sel=selectedIds.includes(r.id),score=d.score==null?'·':Math.round(d.score),cls=d.decision==='RECOMMENDED'?'good':d.decision==='CONSIDER'?'cyan':d.decision.includes('RISK')?'bad':'warn';return `<article class="card decision-card"><div style="display:flex;gap:14px;align-items:flex-start"><div class="creator-avatar">${photo?`<img src="${esc(photo)}" alt="${esc(r.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`:''}<span style="${photo?'display:none':''}">${esc((r.name||'K').slice(0,1).toUpperCase())}</span></div><div style="flex:1"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-select-creator="${r.id}" ${sel?'checked':''}> <b>${esc(r.name)}</b></label><div class="chips" style="margin-top:7px"><span class="pill ${cls}">${esc(d.decision||'CALCULATED')}</span><span class="pill">Overall ${score}</span><span class="pill">Confidence ${Math.round(e.confidence??0)}</span>${e.learning?.state?`<span class="pill cyan">${esc(String(e.learning.state).replaceAll('_',' '))}</span>`:''}</div><div class="reason" style="margin-top:9px">Audience <b>${Math.round(e.audienceFit??50)}</b> · Content <b>${Math.round(e.contentFit??50)}</b> · Brand <b>${Math.round(e.brandFit??50)}</b> · Perf <b>${Math.round(e.performance??0)}</b> · Commercial <b>${Math.round(e.commercial??50)}</b> · Risk <b>${Math.round(e.risk??50)}</b></div><p class="sub" style="margin-top:8px">${esc(String(e.reason||e.method||'Fit calculated from available evidence.').replace(/\s+/g,' ').slice(0,140))}</p>${(()=>{const st=decisionStrategy(e,r,active);return `<div class="strategy-grid" style="margin-top:12px"><div class="signal-box decision-strategy-item"><span class="label decision-strategy-label">Role</span><b class="decision-strategy-value">${esc(st.bestRole)}</b></div><div class="signal-box decision-strategy-item"><span class="label decision-strategy-label">Gap</span><b class="decision-strategy-value">${esc(st.fitGap)}</b></div><div class="signal-box decision-strategy-item"><span class="label decision-strategy-label">Format</span><b class="decision-strategy-value">${esc(st.contentFormat)}</b></div><div class="signal-box decision-strategy-item"><span class="label decision-strategy-label">Plan</span><b class="decision-strategy-value">${esc(st.deployment)}</b></div></div>`})()}${Number(score)<70?`<div class="adaptation-box"><b>Next step</b><p>${esc(creatorAdaptation(e))}</p></div>`:''}</div></div></article>`}).join('')}</div>`:'<div class="empty">Run the calculation after shortlisting creators in Step 03.</div>'}</section><div class="bottom-actions"><button class="btn" id="save-selection">Save approved</button><button class="btn primary" id="continue-performance">Approve & continue → Performance</button></div>`;document.getElementById('run-analysis').onclick=runAnalysis;document.getElementById('save-selection').onclick=saveCreatorSelection;document.getElementById('continue-performance').onclick=async()=>{const ids=[...document.querySelectorAll('[data-select-creator]:checked')].map(x=>x.dataset.selectCreator);if(!ids.length){toast('Select at least one approved creator before continuing.','error');return}const saved=await saveCreatorSelection();if(!saved)return;S.page=4;renderPage()}}
async function saveCreatorSelection(){if(!S.selectedCampaign){toast('Create a campaign first.','error');return null}const ids=[...document.querySelectorAll('[data-select-creator]:checked')].map(x=>x.dataset.selectCreator);if(ids.length){const latest=new Map();S.decisions.filter(d=>d.campaign_id===S.selectedCampaign.id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).forEach(d=>{if(d.creator_id&&!latest.has(String(d.creator_id)))latest.set(String(d.creator_id),d)});const missing=ids.filter(id=>!latest.has(String(id)));if(missing.length){toast('Calculate creator fit before approving creators for performance tracking.','error');return null}}const payload={...(S.selectedCampaign.payload||{}),selectedCreatorIds:ids,selectedCreatorAt:new Date().toISOString()};const {data,error}=await sb.from('campaigns').update({payload,updated_at:new Date().toISOString()}).eq('id',S.selectedCampaign.id).eq('organization_id',S.org.id).select().single();if(error){toast(error.message,'error');return null}S.selectedCampaign=data;const i=S.campaigns.findIndex(x=>x.id===data.id);if(i>=0)S.campaigns[i]=data;toast(`${ids.length} creator${ids.length===1?'':'s'} approved for performance tracking`,'good');return ids}
function downloadCreatorFitPDF(){
 if(!S.creators.length){toast('Save creators before exporting the PDF.','error');return}
 if(!window.jspdf?.jsPDF){window.print();return}
 const rows=latestDecisionRows();
 const doc=new window.jspdf.jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
 const W=297,H=210,M=10,CONTENT=W-M*2;
 const C={ink:[22,24,27],muted:[91,99,108],soft:[244,247,249],line:[222,227,232],cyan:[174,239,255],cyanDark:[32,120,150],cream:[255,248,231],creamLine:[242,216,164],white:[255,255,255]};
 const fill=(rgb)=>doc.setFillColor(...rgb), stroke=(rgb)=>doc.setDrawColor(...rgb), text=(rgb)=>doc.setTextColor(...rgb);
 const rounded=(x,y,w,h,r,fillRgb,lineRgb)=>{fill(fillRgb);stroke(lineRgb||fillRgb);doc.roundedRect(x,y,w,h,r,r,'FD')};
 const safe=(v,fallback='·')=>{const t=String(v??'').replace(/\s+/g,' ').trim();return t||fallback};
 const wrap=(v,w)=>doc.splitTextToSize(safe(v),Math.max(10,w));
 const pageHeader=()=>{
   fill(C.white);doc.rect(0,0,W,H,'F');
   text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text('KOL IDS™',M,11);
   doc.setFont('helvetica','normal');doc.setFontSize(6.5);text(C.muted);doc.text('CREATOR FIT & DECISION READINESS',M,16);
   doc.setFontSize(7);doc.text(`Campaign: ${safe(S.selectedCampaign?.name)}  ·  ${S.creators.length} saved`,W-M,11,{align:'right'});
   stroke(C.line);doc.line(M,20,W-M,20);
 };
 const drawMetric=(x,y,w,h,label,value,detail,action,isRisk)=>{
   rounded(x,y,w,h,2.5,C.soft,C.line);
   text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.6);doc.text(label,x+2.5,y+4);
   text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(String(value),x+w-2.5,y+4.5,{align:'right'});
   fill(isRisk?[235,138,119]:[71,166,224]);doc.roundedRect(x+2.5,y+7,w-5,1.5,.75,.75,'F');
   const pct=Math.max(0,Math.min(100,Number(value)||0));fill(isRisk?[242,178,157]:C.cyanDark);doc.roundedRect(x+2.5,y+7,(w-5)*pct/100,1.5,.75,.75,'F');
   text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.4);doc.text(wrap(detail,w-5).slice(0,1),x+2.5,y+12.5);
   stroke(C.line);doc.line(x+2.5,y+h-5.5,x+w-2.5,y+h-5.5);
   text(C.cyanDark);doc.setFontSize(5.2);doc.text(wrap(action,w-5).slice(0,1),x+2.5,y+h-2.5);
 };
 const drawSummary=(x,y,w,h,label,value)=>{
   rounded(x,y,w,h,2.5,C.cream,C.creamLine);
   text([80,63,34]);doc.setFont('helvetica','bold');doc.setFontSize(5.8);doc.text(label,x+2.5,y+4.5);
   text([108,83,47]);doc.setFont('helvetica','normal');doc.setFontSize(5.8);doc.text(wrap(value,w-5).slice(0,2),x+2.5,y+9);
 };
 const drawGuidance=(items,y)=>{
   const h=13, gap=3, labelSize=5.2, valueSize=6.6;
   const natural=items.map(([label,value])=>{
     doc.setFont('helvetica','bold');doc.setFontSize(valueSize);
     const lines=wrap(value,80);return {label,value,lines,w:Math.max(38,Math.min(88,Math.max(38,doc.getTextWidth(lines.reduce((a,b)=>a.length>b.length?a:b,''))+12)))};
   });
   const totalNatural=natural.reduce((a,x)=>a+x.w,0)+gap*(natural.length-1);
   const scale=totalNatural>CONTENT?(CONTENT-gap*(natural.length-1))/natural.reduce((a,x)=>a+x.w,0):1;
   let x=M;
   natural.forEach(item=>{
     const w=item.w*scale;
     rounded(x,y,w,h,2.5,C.white,C.line);
     text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(labelSize);doc.text(item.label.toUpperCase(),x+2.5,y+4.2);
     text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(valueSize);doc.text(wrap(item.value,w-5).slice(0,2),x+2.5,y+9);
     x+=w+gap;
   });
 };
 const drawCreator=(row,idx,total,baseY)=>{
   const r=row.creator,d=row.decision||{},e=d.evidence||{},st=decisionStrategy(e,r,S.selectedCampaign);
   const score=d.score==null?'·':Math.round(d.score), conf=e.confidence==null?'·':Math.round(e.confidence);
   text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.5);doc.text(`CREATOR ${idx+1} / ${total}`,M,baseY);
   text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(11.5);doc.text(safe(r.name,'Creator'),M,baseY+7);
   text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.8);doc.text(`${safe(r.payload?.channel)}  ·  ${r.payload?.followers==null?'·':money(r.payload.followers)} followers  ·  ${r.payload?.er==null?'·':pct(r.payload.er)} ER`,M,baseY+12);
   rounded(204,baseY-2,25,15,3,C.soft,C.line);text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(10.5);doc.text(String(score),216.5,baseY+5,{align:'center'});text(C.muted);doc.setFontSize(5);doc.text('FIT / 100',216.5,baseY+9,{align:'center'});
   rounded(232,baseY-2,25,15,3,C.soft,C.line);text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(10.5);doc.text(String(conf),244.5,baseY+5,{align:'center'});text(C.muted);doc.setFontSize(5);doc.text('CONFIDENCE',244.5,baseY+9,{align:'center'});
   rounded(260,baseY-2,27,15,3,C.cyan,C.line);text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(5.7);doc.text(safe(d.decision,'REVIEW REQUIRED').replace(/_/g,' '),273.5,baseY+5,{align:'center'});text(C.cyanDark);doc.setFontSize(5);doc.text('DECISION',273.5,baseY+9,{align:'center'});
   const dims=[
    ['Audience',e.audienceFit??e.dimensionEvidence?.audienceFit?.score??48,'Limited audience match.','Refine audience + examples.',false],
    ['Campaign',e.contentFit??e.dimensionEvidence?.contentFit?.score??48,'Limited objective fit.','Tighten brief + CTA.',false],
    ['Brand',e.brandFit??e.dimensionEvidence?.brandFit?.score??48,'Limited brand alignment.','Set 2–3 brand cues.',false],
    ['Evidence',e.performance??e.dimensionEvidence?.performance?.score??0,(Number(e.performance??0)>=65?'Moderate performance evidence.':'Limited performance evidence.'),'Add recent reach + conversions.',false],
    ['Efficiency',e.commercial??e.dimensionEvidence?.commercial?.score??50,'Moderate fee / budget fit.','Adjust scope or test budget.',false],
    ['Risk',e.risk??e.dimensionEvidence?.risk?.score??50,'Low execution risk.','Keep safety checks.',true]
   ];
   const gap=2.5, boxW=(CONTENT-gap*5)/6, boxH=22, metricY=baseY+17;
   dims.forEach((m,i)=>drawMetric(M+i*(boxW+gap),metricY,boxW,boxH,m[0],Math.round(Number(m[1])||0),m[2],m[3],m[4]));
   const sy=metricY+25, sw=(CONTENT-5)/3, sh=14;
   drawSummary(M,sy,sw,sh,'Why',safe(e.reason,'Fit is constrained by the available evidence.'));
   drawSummary(M+sw+2.5,sy,sw,sh,'If selected',safe(creatorAdaptation(e),'Tighten the creator brief and validate recent performance evidence.'));
   drawSummary(M+(sw+2.5)*2,sy,sw,sh,'Campaign move',safe(st.deployment,'Align content to the objective and add clear brand guardrails.'));
   text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.5);doc.text('DECISION GUIDANCE',M,sy+20);
   drawGuidance([['Role',st.bestRole],['Gap',st.fitGap],['Format',st.contentFormat],['Plan',st.deployment]],sy+23);
   stroke(C.line);doc.line(M,sy+39,W-M,sy+39);
 };
 const perPage=2;
 for(let pageIndex=0;pageIndex<rows.length;pageIndex+=perPage){
   if(pageIndex)doc.addPage();
   pageHeader();
   const pageRows=rows.slice(pageIndex,pageIndex+perPage);
   pageRows.forEach((row,i)=>drawCreator(row,pageIndex+i,rows.length,27+i*83));
   text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.5);doc.text('Generated from the saved creator profile and current campaign / audience context.',M,H-5);
   doc.text(`Page ${Math.floor(pageIndex/perPage)+1} / ${Math.ceil(rows.length/perPage)}`,W-M,H-5,{align:'right'});
 }
 const campaignSlug=String(S.selectedCampaign?.name||'Report').trim().replace(/[^A-Za-z0-9-_]+/g,'-').replace(/^-+|-+$/g,'')||'Report';
 doc.save('Save PDF.pdf');
 toast('Creator Fit PDF saved.','good');
}
function downloadDecisionPDF(){
 exportGateOr(()=>{
  const rows=latestDecisionRows();const selectedIds=new Set([...document.querySelectorAll('[data-select-creator]:checked')].map(x=>x.dataset.selectCreator));const selected=selectedIds.size?rows.filter(x=>selectedIds.has(x.creator.id)):rows;
  if(!selected.length){toast('Run creator fit calculation first.','error');return}if(!window.jspdf?.jsPDF){window.print();return}
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});const ctx=pdfEnterprise(doc,'Creator Decision Report','Decision evidence · fit signals · confidence · recommended campaign move');ctx.y=39;
  pdfMetricGrid(doc,ctx,[{label:'Creators evaluated',value:selected.length},{label:'Approved',value:selected.filter(x=>String(x.decision.decision||'').toUpperCase().includes('APPROVE')).length},{label:'Average fit',value:(selected.reduce((a,x)=>a+(Number(x.decision.score)||0),0)/selected.length).toFixed(1)},{label:'Evidence confidence',value:`${Math.round(selected.reduce((a,x)=>a+(Number(x.decision.evidence?.confidence)||0),0)/selected.length)}`}]);
  pdfSection(doc,ctx,'Decision register','01 · portfolio view');
  pdfRows(doc,ctx,['Creator','Decision','Fit','Audience','Content','Brand','Performance','Commercial','Risk','Confidence'],selected.map(({creator:r,decision:d})=>{const e=d.evidence||{};return [r.name,d.decision||'—',d.score==null?'—':Math.round(d.score),Math.round(e.audienceFit??50),Math.round(e.contentFit??50),Math.round(e.brandFit??50),Math.round(e.performance??0),Math.round(e.commercial??50),Math.round(e.risk??50),Math.round(e.confidence??0)]}),[31,23,12,13,13,13,14,14,11,15]);
  pdfSection(doc,ctx,'Decision rationale','02 · evidence notes');
  selected.forEach(({creator:r,decision:d})=>{const e=d.evidence||{};pdfNarrative(doc,ctx,r.name,`${d.decision||'—'} · Fit ${d.score==null?'—':Math.round(d.score)}/100 · Confidence ${Math.round(e.confidence??0)}/100 · ${e.reason||e.method||creatorAdaptation(e)||'No rationale recorded.'}`);});
  doc.save(pdfSaveName('KOL-IDS_Creator-Decision',S.selectedCampaign?.name));
 });
}
function validatePerformancePayload(payload){
 const errs=[];
 for(const k of ['spend_thb','revenue_thb','reach','impressions','views','likes','comments','shares','clicks','conversions','engagement']){const v=num(payload?.[k]);if(v!=null&&v<0)errs.push(`negative_${k}`)}
 const type=String(payload?.metadata?.channelType||'DIGITAL').toUpperCase(),m=payload?.metadata||{};
 if(type==='ECOMMERCE'){
  for(const k of ['gmv','discounts','refunds','netSales','orders','paidOrders','newCustomers','commissionAmount']){const v=num(m[k]);if(v!=null&&v<0)errs.push(`negative_${k}`)}
  const cr=num(m.commissionRate);if(cr!=null&&(cr<0||cr>100))errs.push('commission_rate_out_of_range');
  if(num(m.paidOrders)!=null&&num(m.orders)!=null&&num(m.paidOrders)>num(m.orders))errs.push('paid_orders_gt_orders');
 }
 if(type==='OFFLINE'){
  for(const k of ['capacity','attendance','qualifiedLeads','qrScans','demos','samples']){const v=num(m[k]);if(v!=null&&v<0)errs.push(`negative_${k}`)}
  if(num(m.capacity)!=null&&num(m.attendance)!=null&&num(m.attendance)>num(m.capacity))errs.push('attendance_gt_capacity');
 }
 return errs;
}

function localPerformanceScore(payload){
 const type=String(payload?.metadata?.channelType||'DIGITAL').toUpperCase(),goal=String(payload?.goal||'AWARENESS').toUpperCase();
 const n0=v=>v==null||v===''||Number.isNaN(Number(v))?null:Number(v),cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number(v)||0)),norm=(v,cap)=>v==null?null:cl(v/cap*100);
 const spend=n0(payload.spend_thb),rev=n0(payload.revenue_thb),imp=n0(payload.impressions),views=n0(payload.views),eng=n0(payload.engagement),clicks=n0(payload.clicks),conv=n0(payload.conversions);
 const md=payload.metadata||{};
 const weighted=parts=>{const v=parts.filter(x=>x[0]!=null),tw=v.reduce((s,x)=>s+x[1],0);return tw?Math.round(v.reduce((s,x)=>s+x[0]*x[1],0)/tw):null};
 if(type==='ECOMMERCE'){
  const gmv=n0(md.gmv)??rev,net=n0(md.netSales)??rev,orders=n0(md.paidOrders)??conv,newCustomers=n0(md.newCustomers),roas=spend&&net!=null?net/spend:null,cvr=clicks&&orders!=null?orders/clicks*100:null,takeRate=gmv&&net!=null?net/gmv*100:null;
  if(/SALES|CONVERSION|REVENUE/.test(goal))return weighted([[norm(roas,6),.40],[norm(net,500000),.25],[norm(cvr,8),.15],[norm(newCustomers,300),.10],[norm(orders,500),.10]]);
  if(/ENGAGEMENT|CONSIDERATION/.test(goal))return weighted([[norm(orders,500),.30],[norm(net,500000),.25],[norm(cvr,8),.20],[norm(takeRate,100),.10],[norm(gmv,600000),.15]]);
  return weighted([[norm(gmv,600000),.30],[norm(net,500000),.30],[norm(orders,500),.20],[norm(newCustomers,300),.10],[norm(takeRate,100),.10]]);
 }
 if(type==='OFFLINE'){
  const cap=n0(md.capacity),attendance=n0(md.attendance),leads=n0(md.qualifiedLeads),scans=n0(md.qrScans),demos=n0(md.demos),leadRate=attendance&&leads!=null?leads/attendance*100:null,convRate=attendance&&conv!=null?conv/attendance*100:null,scanRate=attendance&&scans!=null?scans/attendance*100:null,demoRate=attendance&&demos!=null?demos/attendance*100:null,roas=spend&&rev!=null?rev/spend:null,attRate=cap&&attendance!=null?attendance/cap*100:null;
  if(/CONVERSION|SALES/.test(goal))return weighted([[norm(roas,6),.40],[norm(convRate,10),.20],[norm(leadRate,25),.15],[norm(rev,500000),.15],[norm(demoRate,15),.10]]);
  if(/ENGAGEMENT|COMMUNITY/.test(goal))return weighted([[norm(leadRate,20),.30],[norm(demoRate,15),.25],[norm(scanRate,30),.20],[norm(attRate,100),.25]]);
  return weighted([[norm(attRate,100),.30],[norm(leads,500),.25],[norm(demos,300),.15],[norm(scans,500),.15],[norm(rev,500000),.15]]);
 }
 const er=imp&&eng!=null?eng/imp*100:null,ctr=imp&&clicks!=null?clicks/imp*100:null,cvr=clicks&&conv!=null?conv/clicks*100:null,roas=spend&&rev!=null?rev/spend:null;
 if(/CONVERSION|SALES/.test(goal))return weighted([[norm(roas,6),.40],[norm(cvr,8),.25],[norm(ctr,5),.15],[norm(rev,500000),.20]]);
 if(goal.includes('ENGAGEMENT'))return weighted([[norm(er,8),.65],[norm(views,2000000),.15],[norm(eng,100000),.20]]);
 if(goal.includes('CONSIDERATION'))return weighted([[norm(ctr,5),.40],[norm(er,8),.35],[norm(cvr,8),.25]]);
 if(goal.includes('LAUNCH'))return weighted([[norm(n0(payload.reach),2000000),.45],[norm(views,2000000),.25],[norm(er,8),.20],[norm(ctr,5),.10]]);
 return weighted([[norm(n0(payload.reach),2000000),.55],[norm(views,2000000),.20],[norm(er,8),.25]]);
}
async function syncLocalPredictionLedger(creatorId,observation){
 const preds=S.predictions.filter(x=>String(x.campaign_id)===String(S.selectedCampaign?.id)&&String(x.creator_id)===String(creatorId));
 for(const row of preds.filter(x=>x.actual_score==null)){
  const before=new Date(String(row.predicted_at||0)).getTime()<=new Date(String(observation.observed_at||0)).getTime();
  if(!before)continue;
  const actual=localPerformanceScore({...observation,goal:observation.goal||S.selectedCampaign?.payload?.objective||'AWARENESS'});
  const covered=actual!=null&&row.lower_bound!=null&&row.upper_bound!=null&&actual>=Number(row.lower_bound)&&actual<=Number(row.upper_bound);
  const q=await sb.from('prediction_ledger').update({actual_score:actual,actual_at:observation.observed_at,covered,evidence:{...(row.evidence||{}),actualPerformanceType:observation.metadata?.channelType||'DIGITAL',actualQuality:observation.quality_score||70}}).eq('id',row.id).eq('organization_id',S.org.id);
  if(q.error)throw q.error;
 }
}

async function savePerformanceDirectFallback(payload){const errs=validatePerformancePayload(payload);if(errs.length)throw new Error(`Evidence rejected: ${errs.join(', ')}`);if(new Date(String(payload.observed_at)).getTime()>Date.now()+60000)throw new Error('Observed time cannot be in the future');const row={organization_id:S.org.id,campaign_id:S.selectedCampaign.id,creator_id:payload.creator_id,observed_at:payload.observed_at,status:'COMPLETED',source:payload.source||'SELF-REPORTED',goal:payload.goal,spend_thb:payload.spend_thb??null,revenue_thb:payload.revenue_thb??null,reach:payload.reach??null,impressions:payload.impressions??null,views:payload.views??null,likes:payload.likes??null,comments:payload.comments??null,shares:payload.shares??null,clicks:payload.clicks??null,conversions:payload.conversions??null,engagement:payload.engagement??null,quality_score:70,validation:{mode:'CLIENT_FALLBACK',note:'Saved directly because the intelligence-engine Edge Function was unavailable. Prediction ledger sync may require a later successful engine call.'},metadata:payload.metadata||{},created_by:S.session?.user?.id||null,updated_at:new Date().toISOString()};const q=await sb.from('performance_observations').insert(row).select().single();if(q.error)throw q.error;await syncLocalPredictionLedger(payload.creator_id,q.data);return{success:true,observation:q.data,actualScore:localPerformanceScore(payload),fallback:true}}
function renderPerformancePage(c){
 const selectedIds=Array.isArray(S.selectedCampaign?.payload?.selectedCreatorIds)?S.selectedCampaign.payload.selectedCreatorIds:[],
 selected=S.creators.filter(x=>selectedIds.includes(x.id)),
 rows=S.performance.filter(x=>x.campaign_id===S.selectedCampaign?.id),
 genCodes=campaignGenCodes(),
 plan=S.selectedCampaign?.payload?.genCodePlan||defaultGenCodePlan();
 const genCodeOptions=(prefix,creatorId)=>{
   const item=campaignGenCodeForCreator(creatorId);
   return item?`<option value="${esc(item.code)}">${esc(item.code)} · ${esc(genCodeStatus(item))}</option>`:'<option value="">No campaign Gen Code · generate above</option>'
 };
 const ecomPlatformOptions=(creatorId,selectedValue='')=>{
   const creator=S.creators.find(x=>String(x.id)===String(creatorId));
   const channels=creatorEcomChannels(creator);
   const list=[...(channels.length?channels:ECOMMERCE_CHANNELS)];
   if(selectedValue&&!list.includes(selectedValue))list.push(selectedValue);
   return list.map(x=>`<option value="${esc(x)}" ${x===selectedValue?'selected':''}>${esc(x)}</option>`).join('');
 };
 c.innerHTML=`<div class="hero"><div><div class="kicker">STEP 05 · PERFORMANCE INTELLIGENCE</div><h2>Performance Intelligence</h2><p>Choose the outcome model first, then record the evidence for that performance type.</p></div><div class="hero-actions"><span class="pill cyan">${selected.length} approved creators</span><span class="pill">${genCodes.length} Gen Codes</span></div></div>
 <section class="card performance-type-picker"><div class="section-head"><div><div class="label">PERFORMANCE TYPE</div><h2>What are you measuring?</h2><p class="sub">Choose one. KOL IDS keeps each outcome model separate while linking it to the same Creator, campaign and attribution data.</p></div></div><div class="type-grid"><label class="performance-type-option"><input type="radio" name="performance-type" value="ECOMMERCE"><span><b>E-commerce</b><small>Sales, orders, GMV & commission</small></span></label><label class="performance-type-option"><input type="radio" name="performance-type" value="DIGITAL" checked><span><b>Multi-platform digital</b><small>Reach, views, engagement & conversion</small></span></label><label class="performance-type-option"><input type="radio" name="performance-type" value="OFFLINE"><span><b>Event</b><small>Attendance, leads, demos & sales</small></span></label></div></section>
 <section class="card"><div class="section-head"><div><div class="label">Approved creators</div><h2>Who is being measured?</h2><p class="sub">Only creators approved in Step 04 are eligible for performance evidence and campaign Gen Code attribution.</p></div></div>${selected.length?selected.map(r=>{const gc=campaignGenCodeForCreator(r.id);return `<div class="list-card"><div><b>${esc(r.name)}</b><small>${esc(r.payload?.channel||'')} ${r.payload?.secondaryChannel?'· '+esc(r.payload.secondaryChannel):''}${creatorEcomChannels(r).length?' · E-com: '+esc(creatorEcomChannels(r).join(', ')):''}</small>${gc?`<div class="gen-code-badge">Gen Code <strong>${esc(gc.code)}</strong><span class="pill ${genCodeStatus(gc)==='ACTIVE'?'good':genCodeStatus(gc)==='EXPIRED'?'bad':'warn'}">${esc(genCodeStatus(gc))}</span></div>`:'<small class="muted">No campaign Gen Code yet</small>'}</div><span class="pill">${rows.filter(x=>x.creator_id===r.id).length} observations</span></div>`}).join(''):'<div class="empty">No creators approved yet. Return to Step 04.</div>'}</section>
 <section class="card gen-code-panel" style="margin-top:14px"><div class="section-head"><div><div class="label">GEN CODE · ATTRIBUTION</div><h2>Generate campaign codes for approved creators</h2><p class="sub">Create creator-level codes with commercial terms, validity and attribution settings. Each code stays linked to this campaign and its performance evidence.</p></div><span class="pill cyan">${genCodes.length}/${selected.length||0} generated</span></div>
 <div class="form-grid">
  <div class="field full"><label>Generation mode</label><select id="gc-generation-mode"><option value="ALL_APPROVED" ${plan.generationMode!=='INDIVIDUAL'?'selected':''}>Use one setup for all approved creators</option><option value="INDIVIDUAL" ${plan.generationMode==='INDIVIDUAL'?'selected':''}>Set commercial terms per creator</option></select><div class="hint" style="margin-top:5px">Use individual mode when creators have different commercial terms.</div></div>
  <div class="field"><label>Prefix</label><input id="gc-prefix" value="${esc(plan.prefix||'KOL')}" placeholder="KOL"></div>
  <div id="gc-global-fields" class="form-grid" style="display:${plan.generationMode==='INDIVIDUAL'?'none':'contents'}"><div class="field"><label>Discount Type</label><select id="gc-discount-type"><option value="PERCENT" ${plan.discountType==='PERCENT'?'selected':''}>PERCENT</option><option value="FIXED" ${plan.discountType==='FIXED'?'selected':''}>FIXED</option><option value="NONE" ${plan.discountType==='NONE'?'selected':''}>NONE</option></select></div>
  <div class="field"><label>Discount Value</label><input id="gc-discount-value" type="text" inputmode="decimal" data-number-format min="0" value="${esc(plan.discountValue??0)}"></div>
  <div class="field"><label>Commission Rate %</label><input id="gc-commission" type="text" inputmode="decimal" data-number-format min="0" max="100" step="0.1" value="${esc(plan.commissionRate??0)}"></div></div>
  <div id="gc-individual-fields" class="field full" style="display:${plan.generationMode==='INDIVIDUAL'?'block':'none'};margin-top:10px"><label>Creator-specific commercial terms</label><div class="table-wrap" style="margin-top:8px"><table class="gen-code-individual-table"><thead><tr><th>Creator</th><th>Discount</th><th>Value</th><th>Commission</th></tr></thead><tbody>${selected.map(cr=>{const q=plan.creatorPlans?.[String(cr.id)]||{};return `<tr><td><b>${esc(cr.name)}</b></td><td><select id="gc-row-discount-type-${cr.id}"><option value="PERCENT" ${String(q.discountType||plan.discountType)==='PERCENT'?'selected':''}>%</option><option value="FIXED" ${String(q.discountType||plan.discountType)==='FIXED'?'selected':''}>THB</option><option value="NONE" ${String(q.discountType||plan.discountType)==='NONE'?'selected':''}>None</option></select></td><td><input id="gc-row-discount-value-${cr.id}" type="text" inputmode="decimal" data-number-format value="${esc(q.discountValue??plan.discountValue??0)}"></td><td><input id="gc-row-commission-${cr.id}" type="text" inputmode="decimal" data-number-format min="0" max="100" step="0.1" value="${esc(q.commissionRate??plan.commissionRate??0)}"></td></tr>`}).join('')}</tbody></table></div></div>
  <div class="field"><label>Start Date</label><input id="gc-start" type="date" value="${esc(plan.startDate||S.selectedCampaign?.payload?.startDate||'')}"></div>
  <div class="field"><label>Campaign End</label><input id="gc-end" type="date" value="${esc(plan.endDate||S.selectedCampaign?.payload?.endDate||'')}"></div>
  <div class="field"><label>Validity</label><select id="gc-validity-mode"><option value="DAYS" ${plan.validityMode==='DAYS'?'selected':''}>Number of days</option><option value="CAMPAIGN_END" ${plan.validityMode==='CAMPAIGN_END'?'selected':''}>Campaign end</option><option value="CUSTOM_DATE" ${plan.validityMode==='CUSTOM_DATE'?'selected':''}>Custom date</option></select></div>
  <div class="field"><label>Validity Days</label><input id="gc-validity-days" type="text" inputmode="decimal" data-number-format min="1" max="3650" value="${esc(plan.validityDays??30)}"></div>
  <div class="field"><label>Custom Expiry</label><input id="gc-expiry" type="date" value="${esc(plan.expiresAt||'')}"></div>
  <div class="field"><label>Max Uses <span class="hint">0 = unlimited</span></label><input id="gc-max-uses" type="text" inputmode="decimal" data-number-format min="0" value="${esc(plan.maxUses??0)}"></div>
  <div class="field"><label>Attribution Window</label><input id="gc-attribution-days" type="text" inputmode="decimal" data-number-format min="0" value="${esc(plan.attributionWindowDays??30)}"></div>
  <div class="field full"><label>Notes</label><input id="gc-notes" value="${esc(plan.notes||'')}" placeholder="Optional commercial or attribution notes"></div>
 </div>
 <div class="actions"><button class="btn primary" type="button" id="save-gen-codes">${genCodes.length?'Update Gen Codes':'Generate Gen Codes'}</button><button class="btn" type="button" id="regen-gen-codes">Regenerate new codes</button></div>
 <div class="gen-code-table">${genCodes.length?`<div class="table-wrap"><table><thead><tr><th>Creator</th><th>Sales channel</th><th>Gen Code</th><th>Discount</th><th>Commission</th><th>Expires</th><th>Status</th></tr></thead><tbody>${genCodes.map(x=>`<tr><td><b>${esc(x.creatorName||'·')}</b></td><td>${esc(x.platform||'·')}</td><td><code>${esc(x.code||'·')}</code></td><td>${x.discountType==='NONE'?'·':esc(String(x.discountValue??0)+(x.discountType==='PERCENT'?'%':''))}</td><td>${esc(String(x.commissionRate??0))}%</td><td>${esc(x.expiresAt||'·')}</td><td><span class="pill ${genCodeStatus(x)==='ACTIVE'?'good':genCodeStatus(x)==='EXPIRED'?'bad':'warn'}">${esc(genCodeStatus(x))}</span></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No campaign Gen Codes generated yet.</div>'}</div>
 <div class="footer-note">Performance records store the selected Gen Code in evidence metadata so creator outcomes can be traced back to the campaign attribution setup.</div>
 </section>
 <section id="performance-digital-section" class="card performance-entry-section" style="margin-top:14px"><div class="section-head"><div><div class="label">Digital / Online</div><h2>Multi-platform digital performance</h2><p class="sub">Record each active channel for the same Creator. KOL IDS combines the evidence into one cross-platform performance view.</p></div></div><form id="digital-performance-form"><div class="form-grid"><div class="field"><label>Creator</label><select id="dp-creator">${selected.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="field"><label>Campaign Gen Code</label><select id="dp-gen-code">${selected.length?genCodeOptions('dp',selected[0].id):'<option value="">No creator</option>'}</select></div><div class="field"><label>Platform / Channel</label><select id="dp-platform"><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>Facebook</option><option>X</option><option>Lemon8</option><option>Other</option></select></div><div class="field"><label>Source</label><select id="dp-source"><option>VERIFIED</option><option>API</option><option selected>SELF-REPORTED</option><option>ESTIMATED</option></select><div class="hint" style="margin-top:5px">Where the evidence came from.</div></div><div class="field"><label>Evidence confidence</label><select id="dp-confidence"><option>VERIFIED</option><option selected>REPORTED</option><option>ESTIMATED</option></select></div><div class="field"><label>Content / Post ID</label><input id="dp-content-id" placeholder="Optional post, video or asset ID"></div><div class="field"><label>Observed at</label><input id="dp-date" type="date" required></div><div class="field"><label>Spend</label><input id="dp-spend" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Reach</label><input id="dp-reach" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Conversions</label><input id="dp-conversions" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Revenue</label><input id="dp-revenue" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field full"><details class="advanced-details"><summary><b>Advanced performance metrics</b><span class="hint">Optional · add more evidence for deeper analysis</span></summary><div class="form-grid" style="margin-top:14px"><div class="field"><label>Impressions</label><input id="dp-impressions" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Views / Plays</label><input id="dp-views" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Likes</label><input id="dp-likes" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Comments</label><input id="dp-comments" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Shares</label><input id="dp-shares" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Saves</label><input id="dp-saves" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Clicks / Link taps</label><input id="dp-clicks" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Landing-page sessions</label><input id="dp-sessions" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Leads</label><input id="dp-leads" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Content pieces</label><input id="dp-content-pieces" type="text" inputmode="decimal" data-number-format min="0"></div></div></details></div></div><div class="actions"><button class="btn primary" type="submit">Calculate & save digital performance</button></div></form><div id="digital-preview" class="signal-box" style="margin-top:14px">Enter data to see derived efficiency metrics.</div><div class="signal-box" style="margin-top:10px"><b>Multi-platform rule</b><p>Instagram, TikTok, Facebook, YouTube, X and Lemon8 are stored as separate evidence records under the same Creator. Decision Intelligence combines them by evidence quality and campaign objective; observed reach/views are never treated as unique cross-platform users.</p></div></section>
 <section id="performance-ecommerce-section" class="card ecommerce-panel performance-entry-section" style="margin-top:14px;display:none"><div class="section-head"><div><div class="label">E-COMMERCE · SALES ATTRIBUTION</div><h2>Track creator-driven orders</h2><p class="sub">Record shop sales, orders, discounts, refunds and commission per creator or Gen Code.</p></div><span class="pill cyan">Gen Code ready</span></div><form id="ecommerce-performance-form"><div class="form-grid"><div class="field"><label>Creator</label><select id="ec-creator">${selected.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="field"><label>Campaign Gen Code</label><select id="ec-gen-code">${selected.length?genCodeOptions('ec',selected[0].id):'<option value="">No creator</option>'}</select></div><div class="field"><label>Shop / Platform</label><select id="ec-platform">${selected.length?ecomPlatformOptions(selected[0].id):ecomPlatformOptions('', 'Shopify')}</select><div id="ec-channel-note" class="hint" style="margin-top:5px">Shows the e-commerce channels saved on this creator profile.</div></div><div class="field"><label>Source</label><select id="ec-source"><option>VERIFIED</option><option>API</option><option selected>SELF-REPORTED</option><option>ESTIMATED</option></select><div class="hint" style="margin-top:5px">Where the evidence came from.</div></div><div class="field"><label>Evidence confidence</label><select id="ec-confidence"><option>VERIFIED</option><option selected>REPORTED</option><option>ESTIMATED</option></select></div><div class="field"><label>Observed at</label><input id="ec-date" type="date" required></div><div class="field"><label>Spend / creator fee</label><input id="ec-spend" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Orders</label><input id="ec-orders" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Paid orders</label><input id="ec-paid-orders" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Gross sales / GMV</label><input id="ec-gmv" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Discounts</label><input id="ec-discounts" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Refunds</label><input id="ec-refunds" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Net sales</label><input id="ec-net-sales" type="text" inputmode="decimal" data-number-format min="0"><div class="hint">Leave blank to calculate GMV − discounts − refunds.</div></div><div class="field"><label>Clicks / sessions</label><input id="ec-clicks" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>New customers</label><input id="ec-new-customers" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Commission rate %</label><input id="ec-commission" type="text" inputmode="decimal" data-number-format min="0" max="100" step="0.1"></div><div class="field"><label>Commission amount</label><input id="ec-commission-amount" type="text" inputmode="decimal" data-number-format min="0"></div></div><div class="actions"><button class="btn primary" type="submit">Calculate & save e-commerce</button></div></form><div id="ecommerce-preview" class="signal-box" style="margin-top:14px">Enter sales data to see GMV, net sales, AOV, commission and ROAS.</div></section>
 <section id="performance-event-section" class="card performance-entry-section" style="margin-top:14px;display:none"><div class="section-head"><div><div class="label">Event / Offline</div><h2>Deep event performance</h2><p class="sub">Track the event funnel from capacity and attendance through engagement, leads, actions and revenue.</p></div></div><form id="offline-performance-form"><div class="form-grid"><div class="field"><label>Creator</label><select id="op-creator">${selected.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="field"><label>Campaign Gen Code</label><select id="op-gen-code">${selected.length?genCodeOptions('op',selected[0].id):'<option value="">No creator</option>'}</select></div><div class="field"><label>Event type</label><select id="op-event-type"><option>Launch</option><option>Pop-up</option><option>Brand Experience</option><option>Concert / Music</option><option>Community</option><option>Other</option></select></div><div class="field"><label>Source</label><select id="op-source"><option>VERIFIED</option><option selected>SELF-REPORTED</option><option>ESTIMATED</option></select><div class="hint" style="margin-top:5px">Where the evidence came from.</div></div><div class="field"><label>Evidence confidence</label><select id="op-confidence"><option>VERIFIED</option><option selected>REPORTED</option><option>ESTIMATED</option></select></div><div class="field"><label>Observed at</label><input id="op-date" type="date" required></div><div class="field"><label>Attendance</label><input id="op-attendance" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Conversions / purchases</label><input id="op-conversions" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Revenue</label><input id="op-revenue" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Spend</label><input id="op-spend" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field full"><details class="advanced-details"><summary><b>Advanced event metrics</b><span class="hint">Optional · add more funnel evidence</span></summary><div class="form-grid" style="margin-top:14px"><div class="field"><label>Event capacity</label><input id="op-capacity" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Qualified leads</label><input id="op-leads" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>QR scans / tracked visits</label><input id="op-scans" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Product demos / trials</label><input id="op-demos" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Samples / redemptions</label><input id="op-samples" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field"><label>Engagement actions</label><input id="op-engagement" type="text" inputmode="decimal" data-number-format min="0"></div><div class="field full"><label>Event outcome notes</label><textarea id="op-notes" placeholder="Quality of attendance, lead quality, audience behavior, feedback, sales observations, creator contribution..."></textarea></div></div></details></div></div><div class="actions"><button class="btn primary" type="submit">Calculate & save event performance</button></div></form><div id="event-preview" class="signal-box" style="margin-top:14px">Enter event data to see funnel efficiency metrics.</div></section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">Recorded outcomes</div><h2>Evidence</h2><p class="sub">Every observation stays attached to its Creator and performance type. Edit or remove any record without affecting other creators.</p></div></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th>Type</th><th>Creator</th><th>Gen Code</th><th>Evidence</th><th>Score</th><th>Reach</th><th>Views</th><th>Clicks</th><th>Conversions</th><th>Revenue</th><th>Actions</th></tr></thead><tbody>${rows.slice().reverse().map(x=>`<tr><td>${esc(x.metadata?.channelType||'·')}</td><td><b>${esc(S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'·')}</b><br><small>${esc(x.observed_at||'')}</small></td><td><code>${esc(x.metadata?.genCode||'·')}</code></td><td><span class="pill">${esc(x.metadata?.evidenceConfidence||x.source||'REPORTED')}</span></td><td>${x.actual_score==null?'·':Math.round(x.actual_score)}</td><td>${displayMetric(x.reach)}</td><td>${displayMetric(x.views)}</td><td>${displayMetric(x.clicks)}</td><td>${displayMetric(x.conversions)}</td><td>${displayMetric(x.revenue_thb)}</td><td><div class="actions" style="margin:0;gap:6px;flex-wrap:nowrap"><button class="btn" type="button" data-edit-performance="${esc(x.id)}">Edit</button><button class="btn danger" type="button" data-remove-performance="${esc(x.id)}">Remove</button></div></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No performance evidence recorded yet.</div>'}</section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">PREDICTION → ACTUAL → LEARNING</div><h2>Evidence calibration</h2><p class="sub">Actual outcomes are matched back to the campaign prediction ledger. No accuracy claim is shown until actual evidence exists.</p></div></div>${(()=>{const z=predictionLearningSummary();return `<div class="grid g4"><div><span class="label">Matched outcomes</span><div class="mini-stat">${z.n}</div></div><div><span class="label">Mean absolute error</span><div class="mini-stat">${z.mae==null?'·':z.mae.toFixed(1)}</div></div><div><span class="label">Prediction bias</span><div class="mini-stat">${z.bias==null?'·':(z.bias>0?'+':'')+z.bias.toFixed(1)}</div></div><div><span class="label">Interval coverage</span><div class="mini-stat">${z.coverage==null?'·':z.coverage.toFixed(0)+'%'}</div></div></div><div class="table-wrap" style="margin-top:12px">${selected.length?`<table><thead><tr><th>Creator</th><th>Predicted</th><th>Actual</th><th>Delta</th><th>Interval</th></tr></thead><tbody>${selected.map(r=>{const q=predictionLearningForCreator(r.id);return `<tr><td><b>${esc(r.name)}</b></td><td>${q?q.predicted.toFixed(1):'·'}</td><td>${q?.actual==null?'·':q.actual.toFixed(1)}</td><td>${q?.delta==null?'·':(q.delta>0?'+':'')+q.delta.toFixed(1)}</td><td>${q?.covered==null?'·':q.covered?'Covered':'Outside'}</td></tr>`}).join('')}</tbody></table>`:'<div class="empty">No approved creators yet.</div>'}</div>`})()}</section>
 <div class="bottom-actions"><button class="btn primary" id="continue-impact">Continue → Business Impact & Learning</button></div>`;
 const setPerformanceType=(type)=>{const map={DIGITAL:"performance-digital-section",ECOMMERCE:"performance-ecommerce-section",OFFLINE:"performance-event-section"};document.querySelectorAll(".performance-entry-section").forEach(el=>el.style.display="none");const target=document.getElementById(map[type]||map.DIGITAL);if(target)target.style.display="block";document.querySelectorAll("input[name=performance-type]").forEach(r=>r.checked=r.value===type);};document.querySelectorAll("input[name=performance-type]").forEach(r=>r.addEventListener("change",()=>setPerformanceType(r.value)));setPerformanceType("DIGITAL");
 const syncCode=(prefix)=>{const creator=document.getElementById(`${prefix}-creator`)?.value;const select=document.getElementById(`${prefix}-gen-code`);if(!select)return;const item=campaignGenCodeForCreator(creator);select.innerHTML=item?`<option value="${esc(item.code)}">${esc(item.code)} · ${esc(genCodeStatus(item))}</option>`:'<option value="">No campaign Gen Code · generate above</option>';select.value=item?.code||''};
 const digitalPreview=()=>{const imp=num(document.getElementById('dp-impressions').value),reach=num(document.getElementById('dp-reach').value),views=num(document.getElementById('dp-views').value),eng=(num(document.getElementById('dp-likes').value)||0)+(num(document.getElementById('dp-comments').value)||0)+(num(document.getElementById('dp-shares').value)||0)+(num(document.getElementById('dp-saves').value)||0),clicks=num(document.getElementById('dp-clicks').value),leads=num(document.getElementById('dp-leads').value),conv=num(document.getElementById('dp-conversions').value),spend=num(document.getElementById('dp-spend').value),rev=num(document.getElementById('dp-revenue').value);const f=(a,b)=>a!=null&&b>0?((a/b)*100):null;document.getElementById('digital-preview').innerHTML=`<b>Live efficiency calculation</b><p>Engagement rate ${f(eng,imp)==null?'·':f(eng,imp).toFixed(2)+'%'} · View rate ${f(views,reach)==null?'·':f(views,reach).toFixed(2)+'%'} · CTR ${f(clicks,imp)==null?'·':f(clicks,imp).toFixed(2)+'%'} · Lead rate ${f(leads,clicks)==null?'·':f(leads,clicks).toFixed(2)+'%'} · Conversion rate ${f(conv,clicks)==null?'·':f(conv,clicks).toFixed(2)+'%'} · CPM ${spend!=null&&imp>0?money(spend/imp*1000):'·'} · CPC ${spend!=null&&clicks>0?money(spend/clicks):'·'} · CPA ${spend!=null&&conv>0?money(spend/conv):'·'} · ROAS ${spend>0&&rev!=null?(rev/spend).toFixed(2)+'x':'·'}</p>`};
 const ecommercePreview=()=>{const orders=num(document.getElementById('ec-orders')?.value),paid=num(document.getElementById('ec-paid-orders')?.value),gmv=num(document.getElementById('ec-gmv')?.value)||0,discounts=num(document.getElementById('ec-discounts')?.value)||0,refunds=num(document.getElementById('ec-refunds')?.value)||0,netRaw=num(document.getElementById('ec-net-sales')?.value),net=netRaw!=null?netRaw:Math.max(0,gmv-discounts-refunds),clicks=num(document.getElementById('ec-clicks')?.value),spend=num(document.getElementById('ec-spend')?.value),cr=num(document.getElementById('ec-commission')?.value)||0,commRaw=num(document.getElementById('ec-commission-amount')?.value),comm=commRaw!=null?commRaw:net*cr/100;const aov=paid!=null&&paid>0?net/paid:null,conversion=clicks!=null&&clicks>0&&paid!=null?paid/clicks*100:null,roas=spend!=null&&spend>0?net/spend:null;document.getElementById('ecommerce-preview').innerHTML=`<b>Live e-commerce calculation</b><p>GMV ${money(gmv)} · Net sales ${money(net)} · AOV ${aov==null?'·':money(aov)} · Conversion ${conversion==null?'·':conversion.toFixed(2)+'%'} · Commission ${money(comm)} · ROAS ${roas==null?'Not calculable':roas.toFixed(2)+'x'}</p>`};
 document.querySelectorAll('#ecommerce-performance-form input').forEach(x=>x.oninput=ecommercePreview);
 const eventPreview=()=>{const cap=num(document.getElementById('op-capacity').value),att=num(document.getElementById('op-attendance').value),leads=num(document.getElementById('op-leads').value),scans=num(document.getElementById('op-scans').value),demos=num(document.getElementById('op-demos').value),samples=num(document.getElementById('op-samples').value),eng=num(document.getElementById('op-engagement').value),conv=num(document.getElementById('op-conversions').value),spend=num(document.getElementById('op-spend').value),rev=num(document.getElementById('op-revenue').value);const f=(a,b)=>a!=null&&b>0?((a/b)*100):null;document.getElementById('event-preview').innerHTML=`<b>Live event funnel calculation</b><p>Attendance rate ${f(att,cap)==null?'·':f(att,cap).toFixed(2)+'%'} · Lead rate ${f(leads,att)==null?'·':f(leads,att).toFixed(2)+'%'} · Scan rate ${f(scans,att)==null?'·':f(scans,att).toFixed(2)+'%'} · Demo rate ${f(demos,att)==null?'·':f(demos,att).toFixed(2)+'%'} · Sample rate ${f(samples,att)==null?'·':f(samples,att).toFixed(2)+'%'} · Conversion rate ${f(conv,att)==null?'·':f(conv,att).toFixed(2)+'%'} · Cost/attendee ${spend!=null&&att>0?money(spend/att):'·'} · Cost/lead ${spend!=null&&leads>0?money(spend/leads):'·'} · Revenue/attendee ${rev!=null&&att>0?money(rev/att):'·'} · ROAS ${spend>0&&rev!=null?(rev/spend).toFixed(2)+'x':'·'}</p>`};
 document.querySelectorAll('#digital-performance-form input').forEach(x=>x.oninput=digitalPreview);document.querySelectorAll('#offline-performance-form input').forEach(x=>x.oninput=eventPreview);
 document.getElementById('digital-performance-form').onsubmit=e=>savePerformance(e,'DIGITAL');document.getElementById('ecommerce-performance-form').onsubmit=e=>savePerformance(e,'ECOMMERCE');document.getElementById('offline-performance-form').onsubmit=e=>savePerformance(e,'OFFLINE');
 document.getElementById('dp-creator')?.addEventListener('change',()=>syncCode('dp'));document.getElementById('op-creator')?.addEventListener('change',()=>syncCode('op'));document.getElementById('ec-creator')?.addEventListener('change',()=>{const creatorId=document.getElementById('ec-creator')?.value;syncCode('ec');const platform=document.getElementById('ec-platform');if(platform)platform.innerHTML=ecomPlatformOptions(creatorId,platform.value);const note=document.getElementById('ec-channel-note');if(note){const channels=creatorEcomChannels(S.creators.find(x=>String(x.id)===String(creatorId)));note.textContent=channels.length?`Linked creator channels: ${channels.join(', ')}`:'No creator-specific e-commerce channels saved · showing all supported channels.'}const item=campaignGenCodeForCreator(creatorId);const rate=document.getElementById('ec-commission');if(rate&&item)rate.value=String(item.commissionRate??0);ecommercePreview()});syncCode('ec');{const creatorId=document.getElementById('ec-creator')?.value,platform=document.getElementById('ec-platform');if(platform)platform.innerHTML=ecomPlatformOptions(creatorId,platform.value||creatorEcomChannels(S.creators.find(x=>String(x.id)===String(creatorId)))[0]||'');const note=document.getElementById('ec-channel-note');if(note){const channels=creatorEcomChannels(S.creators.find(x=>String(x.id)===String(creatorId)));note.textContent=channels.length?`Linked creator channels: ${channels.join(', ')}`:'No creator-specific e-commerce channels saved · showing all supported channels.'}const item=campaignGenCodeForCreator(creatorId),rate=document.getElementById('ec-commission');if(rate&&item)rate.value=String(item.commissionRate??0)}
 document.getElementById('gc-generation-mode')?.addEventListener('change',e=>{const v=e.target.value==='INDIVIDUAL';const a=document.getElementById('gc-global-fields'),b=document.getElementById('gc-individual-fields');if(a)a.style.display=v?'none':'contents';if(b)b.style.display=v?'block':'none'});document.getElementById('save-gen-codes')?.addEventListener('click',()=>saveGenCodeConfiguration(false));document.getElementById('regen-gen-codes')?.addEventListener('click',()=>{if(confirm('Generate new codes for all approved creators? Existing campaign codes will be replaced.'))saveGenCodeConfiguration(true)});
 bindPerformanceRecordActions();document.getElementById('continue-impact').onclick=()=>{S.page=5;renderPage()};
}
function performanceFormMap(type){return type==='DIGITAL'?{form:'digital-performance-form',prefix:'dp'}:type==='ECOMMERCE'?{form:'ecommerce-performance-form',prefix:'ec'}:{form:'offline-performance-form',prefix:'op'}}
function performanceField(prefix,key,value){const el=document.getElementById(`${prefix}-${key}`);if(el)el.value=value==null?'':String(value)}
function editPerformanceRecord(id){const row=S.performance.find(x=>String(x.id)===String(id));if(!row)return;const type=String(row.metadata?.channelType||'DIGITAL').toUpperCase(),m=performanceFormMap(type),p=m.prefix;S.performanceEditTarget={id:row.id,type};const radio=document.querySelector(`input[name="performance-type"][value="${type}"]`);radio?.click();const set=(key,val)=>performanceField(p,key,val);set('creator',row.creator_id);set('date',row.observed_at);set('source',row.source||'SELF-REPORTED');set('spend',row.spend_thb);set('revenue',row.revenue_thb);set('reach',row.reach);set('impressions',row.impressions);set('views',row.views);set('likes',row.likes);set('comments',row.comments);set('shares',row.shares);set('clicks',row.clicks);set('conversions',row.conversions);set('engagement',row.engagement);set('gen-code',row.metadata?.genCode||'');if(type==='DIGITAL'){set('platform',row.metadata?.platform);set('saves',row.metadata?.saves);set('sessions',row.metadata?.landingSessions);set('leads',row.metadata?.leads);set('content-pieces',row.metadata?.contentPieces)}else if(type==='ECOMMERCE'){set('platform',row.metadata?.platform);set('orders',row.metadata?.orders);set('paid-orders',row.metadata?.paidOrders);set('gmv',row.metadata?.gmv);set('discounts',row.metadata?.discounts);set('refunds',row.metadata?.refunds);set('net-sales',row.metadata?.netSales);set('new-customers',row.metadata?.newCustomers);set('commission',row.metadata?.commissionRate);set('commission-amount',row.metadata?.commissionAmount)}else{set('event-type',row.metadata?.eventType);set('capacity',row.metadata?.capacity);set('attendance',row.metadata?.attendance);set('leads',row.metadata?.qualifiedLeads);set('scans',row.metadata?.qrScans);set('demos',row.metadata?.demos);set('samples',row.metadata?.samples);set('notes',row.metadata?.notes)}const form=document.getElementById(m.form);const submit=form?.querySelector('button[type="submit"]');if(submit)submit.textContent='Update performance';let cancel=document.getElementById('cancel-performance-edit');if(!cancel&&form){cancel=document.createElement('button');cancel.type='button';cancel.id='cancel-performance-edit';cancel.className='btn';cancel.textContent='Cancel edit';submit?.parentElement?.appendChild(cancel)}cancel?.addEventListener('click',()=>cancelPerformanceEdit(),{once:true});form?.scrollIntoView({behavior:'smooth',block:'center'});toast('Editing performance record','info')}
function cancelPerformanceEdit(){S.performanceEditTarget=null;document.getElementById('cancel-performance-edit')?.remove();document.querySelectorAll('#digital-performance-form button[type="submit"],#ecommerce-performance-form button[type="submit"],#offline-performance-form button[type="submit"]').forEach(b=>b.textContent='Calculate & save performance');renderPage()}
async function removePerformanceRecord(id){const row=S.performance.find(x=>String(x.id)===String(id));if(!row)return;if(!confirm('Remove this performance record? This also recalculates prediction evidence linked to this creator.'))return;try{const data=await intelligenceCall('delete_performance',{id:row.id,creator_id:row.creator_id});if(!data?.success)throw new Error(data?.error||'Could not remove performance record');S.performance=S.performance.filter(x=>String(x.id)!==String(id));S.predictions=S.predictions.filter(x=>!(String(x.campaign_id)===String(S.selectedCampaign.id)&&String(x.creator_id)===String(row.creator_id)));await refresh();if(String(S.performanceEditTarget?.id)===String(id))S.performanceEditTarget=null;toast('Performance record removed and evidence recalculated','good');renderPage()}catch(err){toast(err.message||'Could not remove performance record','error')}}
function bindPerformanceRecordActions(){document.querySelectorAll('[data-edit-performance]').forEach(b=>b.onclick=()=>editPerformanceRecord(b.dataset.editPerformance));document.querySelectorAll('[data-remove-performance]').forEach(b=>b.onclick=()=>removePerformanceRecord(b.dataset.removePerformance))}
async function savePerformance(e,type){e.preventDefault();if(!S.selectedCampaign)return;const ids=Array.isArray(S.selectedCampaign.payload?.selectedCreatorIds)?S.selectedCampaign.payload.selectedCreatorIds:[];if(!ids.length){toast('Select creators first','error');return}const prefix=type==='DIGITAL'?'dp':type==='ECOMMERCE'?'ec':'op',creator=document.getElementById(`${prefix}-creator`).value,date=document.getElementById(`${prefix}-date`).value;if(!date){toast('Observed at is required','error');return}let payload={creator_id:creator,observed_at:date,source:document.getElementById(`${prefix}-source`).value,campaign_id:S.selectedCampaign.id,goal:String(S.selectedCampaign.payload?.objective||S.selectedCampaign.payload?.goal||'AWARENESS').toUpperCase(),metadata:{channelType:type,genCode:document.getElementById(`${prefix}-gen-code`)?.value||'',genCodeId:campaignGenCodeForCreator(creator)?.id||'',attributionWindowDays:campaignGenCodeForCreator(creator)?.attributionWindowDays??null}};if(type==='DIGITAL'){Object.assign(payload,{spend_thb:num(document.getElementById('dp-spend').value),reach:num(document.getElementById('dp-reach').value),impressions:num(document.getElementById('dp-impressions').value),views:num(document.getElementById('dp-views').value),likes:num(document.getElementById('dp-likes').value),comments:num(document.getElementById('dp-comments').value),shares:num(document.getElementById('dp-shares').value),clicks:num(document.getElementById('dp-clicks').value),conversions:num(document.getElementById('dp-conversions').value),revenue_thb:num(document.getElementById('dp-revenue').value),engagement:(()=>{const ev=[num(document.getElementById('dp-likes').value),num(document.getElementById('dp-comments').value),num(document.getElementById('dp-shares').value),num(document.getElementById('dp-saves').value)];return ev.some(v=>v!=null)?ev.reduce((a,v)=>a+(v??0),0):null})(),metadata:{channelType:type,genCode:document.getElementById('dp-gen-code').value||'',genCodeId:campaignGenCodeForCreator(creator)?.id||'',attributionWindowDays:campaignGenCodeForCreator(creator)?.attributionWindowDays??null,platform:document.getElementById('dp-platform').value,saves:num(document.getElementById('dp-saves').value),landingSessions:num(document.getElementById('dp-sessions').value),leads:num(document.getElementById('dp-leads').value),contentPieces:num(document.getElementById('dp-content-pieces').value)}})}else if(type==='ECOMMERCE'){const gmv=num(document.getElementById('ec-gmv').value),discounts=num(document.getElementById('ec-discounts').value),refunds=num(document.getElementById('ec-refunds').value),netRaw=num(document.getElementById('ec-net-sales').value),net=netRaw!=null?netRaw:(gmv!=null?Math.max(0,gmv-(discounts??0)-(refunds??0)):null),paid=num(document.getElementById('ec-paid-orders').value),orders=num(document.getElementById('ec-orders').value),clicks=num(document.getElementById('ec-clicks').value),commissionRate=num(document.getElementById('ec-commission').value),commissionRaw=num(document.getElementById('ec-commission-amount').value),commission=commissionRaw!=null?commissionRaw:(net!=null&&commissionRate!=null?net*commissionRate/100:null);Object.assign(payload,{spend_thb:num(document.getElementById('ec-spend').value),revenue_thb:net,clicks,conversions:paid,engagement:null,metadata:{channelType:type,genCode:document.getElementById('ec-gen-code').value||'',genCodeId:campaignGenCodeForCreator(creator)?.id||'',attributionWindowDays:campaignGenCodeForCreator(creator)?.attributionWindowDays??null,platform:document.getElementById('ec-platform').value,orders,paidOrders:paid,gmv,discounts,refunds,netSales:net,newCustomers:num(document.getElementById('ec-new-customers').value),commissionRate,commissionAmount:commission,aov:paid!=null&&paid>0&&net!=null?net/paid:null}})}else{Object.assign(payload,{spend_thb:num(document.getElementById('op-spend').value),revenue_thb:num(document.getElementById('op-revenue').value),conversions:num(document.getElementById('op-conversions').value),engagement:num(document.getElementById('op-engagement').value),metadata:{channelType:type,genCode:document.getElementById('op-gen-code').value||'',genCodeId:campaignGenCodeForCreator(creator)?.id||'',attributionWindowDays:campaignGenCodeForCreator(creator)?.attributionWindowDays??null,eventType:document.getElementById('op-event-type').value,capacity:num(document.getElementById('op-capacity').value),attendance:num(document.getElementById('op-attendance').value),qualifiedLeads:num(document.getElementById('op-leads').value),qrScans:num(document.getElementById('op-scans').value),demos:num(document.getElementById('op-demos').value),samples:num(document.getElementById('op-samples').value),notes:document.getElementById('op-notes').value.trim()}})}payload.metadata=payload.metadata||{};payload.metadata.evidenceConfidence=document.getElementById(`${prefix}-confidence`)?.value||'REPORTED';if(type==='DIGITAL')payload.metadata.contentId=document.getElementById('dp-content-id')?.value.trim()||null;try{let data;const validationErrors=validatePerformancePayload(payload);if(validationErrors.length){throw new Error(`Evidence rejected: ${validationErrors.join(', ')}`)}if(S.performanceEditTarget?.id){const id=S.performanceEditTarget.id;data=await intelligenceCall('update_performance',{id,...payload});S.performanceEditTarget=null;toast(`Performance updated · outcome ${data.actualScore==null?'pending':Math.round(data.actualScore)}`,'good')}else{try{data=await intelligenceCall('record_performance',payload)}catch(remoteErr){data=await savePerformanceDirectFallback(payload);toast('Edge Function unavailable · performance saved with direct database fallback.','good')}toast(`Performance saved · outcome ${data.actualScore==null?'pending':Math.round(data.actualScore)}`,'good')}await refresh();renderPage()}catch(err){toast(err.message||'Evidence rejected','error')}}

/* ENTERPRISE EXPORT SYSTEM · 20261006 */
function pdfSafeText(v){return v==null||v===''?'—':String(v)}
function pdfFmt(v,unit=''){if(v==null||v==='')return '—';const n=Number(v);if(Number.isFinite(n)){if(unit==='%')return `${n.toLocaleString('en-US',{maximumFractionDigits:2})}%`;if(unit==='x')return `${n.toLocaleString('en-US',{maximumFractionDigits:2})}x`;if(unit==='THB')return `THB ${n.toLocaleString('en-US',{maximumFractionDigits:2})}`;return n.toLocaleString('en-US',{maximumFractionDigits:2})}return String(v)}
function pdfEnterprise(doc,title,subtitle=''){
 const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
 const header=()=>{doc.setDrawColor(225,229,232);doc.setLineWidth(.22);doc.line(14,12,W-14,12);doc.setTextColor(25,29,33);doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.text('T POP ENTERTAINMENT CONNECTS',14,9);doc.setFont('helvetica','normal');doc.setTextColor(105,112,118);doc.text('INVESTMENT DECISION INTELLIGENCE',W-14,9,{align:'right'});};
 const footer=()=>{doc.setDrawColor(230,233,235);doc.setLineWidth(.18);doc.line(14,H-13,W-14,H-13);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(120,126,132);doc.text('T POP Entertainment Connects · KOL IDS™ · Confidential · Evidence-led analysis',14,H-8);doc.text(`Page ${doc.internal.getNumberOfPages()}`,W-14,H-8,{align:'right'});};
 header(); footer();
 doc.setTextColor(24,28,32);doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text(title,14,24);if(subtitle){doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(105,112,118);doc.text(subtitle,14,30)}
 return {W,H,header,footer};
}
function pdfPageBreak(doc,ctx,needed=18){const H=doc.internal.pageSize.getHeight();if(ctx.y+needed>H-20){doc.addPage();ctx.header();ctx.footer();ctx.y=22;return true}return false}
function pdfSection(doc,ctx,title,kicker=''){
 pdfPageBreak(doc,ctx,18);ctx.y+=5;doc.setTextColor(120,126,132);doc.setFont('helvetica','bold');doc.setFontSize(7);doc.text(String(kicker||'SECTION').toUpperCase(),14,ctx.y);ctx.y+=6;doc.setTextColor(25,29,33);doc.setFont('helvetica','bold');doc.setFontSize(12);doc.text(title,14,ctx.y);ctx.y+=7;doc.setDrawColor(215,220,223);doc.setLineWidth(.18);doc.line(14,ctx.y,ctx.W-14,ctx.y);ctx.y+=6;
}
function pdfMetricGrid(doc,ctx,items){const gap=4;const w=(ctx.W-28-gap*3)/4;let x=14;const h=20;items.forEach((it,i)=>{if(i&&i%4===0){ctx.y+=h+4;x=14}if(pdfPageBreak(doc,ctx,h+2))x=14;doc.setDrawColor(226,230,232);doc.setLineWidth(.2);doc.roundedRect(x,ctx.y,w,h,2,2,'S');doc.setFont('helvetica','normal');doc.setTextColor(115,121,127);doc.setFontSize(7.5);doc.text(String(it.label||'').toUpperCase(),x+4,ctx.y+6);doc.setFont('helvetica','bold');doc.setTextColor(24,28,32);doc.setFontSize(11);doc.text(pdfSafeText(it.value),x+4,ctx.y+14);x+=w+gap});ctx.y+=h+6}
function pdfRows(doc,ctx,headers,rows,widths){
 const startX=14;const totalW=ctx.W-28;const ws=widths||headers.map(()=>totalW/headers.length);const lineH=5.6;const headH=9;
 const drawHead=()=>{doc.setFillColor(247,248,249);doc.setDrawColor(224,228,230);doc.setLineWidth(.18);let x=startX;headers.forEach((h,i)=>{doc.rect(x,ctx.y,ws[i],headH,'FD');doc.setFont('helvetica','bold');doc.setFontSize(8.2);doc.setTextColor(70,77,83);const lines=doc.splitTextToSize(pdfSafeText(h),ws[i]-4);doc.text(lines.slice(0,2),x+2,ctx.y+4);x+=ws[i]});ctx.y+=headH};
 drawHead();rows.forEach(row=>{const cells=row.map((v,i)=>doc.splitTextToSize(pdfSafeText(v),ws[i]-4).slice(0,3));const rh=Math.max(7,...cells.map(a=>a.length*lineH+2));if(ctx.y+rh>ctx.H-20){doc.addPage();ctx.header();ctx.footer();ctx.y=22;drawHead()}let x=startX;row.forEach((v,i)=>{doc.setDrawColor(235,237,239);doc.setLineWidth(.15);doc.rect(x,ctx.y,ws[i],rh,'S');doc.setFont('helvetica',i===0?'bold':'normal');doc.setFontSize(8);doc.setTextColor(38,43,48);doc.text(cells[i],x+2,ctx.y+4);x+=ws[i]});ctx.y+=rh});ctx.y+=5;
}
function pdfNarrative(doc,ctx,label,text){pdfPageBreak(doc,ctx,20);doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(103,110,116);doc.text(String(label).toUpperCase(),14,ctx.y);ctx.y+=5;doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.setTextColor(43,48,53);const lines=doc.splitTextToSize(pdfSafeText(text),ctx.W-28);doc.text(lines,14,ctx.y);ctx.y+=Math.max(8,lines.length*4.2+4)}
function pdfSaveName(prefix,name){return `${prefix}_${csvSafeName(name)}_${csvDateStamp()}.pdf`}

function downloadPerformancePDF(){
 exportGateOr(()=>{
  if(!window.jspdf?.jsPDF){window.print();return}
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});const ctx=pdfEnterprise(doc,'Performance Evidence Report','Campaign-linked observations · source transparency · operational metrics');ctx.y=39;
  const rows=S.performance.filter(x=>x.campaign_id===S.selectedCampaign?.id),campaign=S.selectedCampaign?.payload||{};
  const creatorName=id=>S.creators.find(x=>String(x.id)===String(id))?.name||'Creator';
  pdfMetricGrid(doc,ctx,[{label:'Records',value:rows.length},{label:'Digital',value:rows.filter(x=>String(x.metadata?.channelType).toUpperCase()==='DIGITAL').length},{label:'E-commerce',value:rows.filter(x=>String(x.metadata?.channelType).toUpperCase()==='ECOMMERCE').length},{label:'Offline / Event',value:rows.filter(x=>String(x.metadata?.channelType).toUpperCase()==='OFFLINE').length}]);
  pdfNarrative(doc,ctx,'Campaign',`${S.selectedCampaign?.name||'—'} · ${campaign.objective||campaign.goal||'Objective not specified'} · Performance model: ${campaign.performanceType||'—'}`);
  pdfSection(doc,ctx,'Evidence register','01 · observed data');
  if(!rows.length){pdfNarrative(doc,ctx,'Status','No performance records were recorded for this campaign.');}
  else {
   const table=rows.map(x=>[creatorName(x.creator_id),String(x.metadata?.channelType||'PERFORMANCE'),x.observed_at||'—',x.metadata?.platform||x.metadata?.eventType||'—',x.source||'—',x.metadata?.evidenceConfidence||x.source||'—',x.actual_score==null?'Pending':`${Math.round(x.actual_score)}/100`,x.metadata?.contentId||x.metadata?.genCode||'—']);
   pdfRows(doc,ctx,['Creator','Type','Observed','Channel / Event','Source','Confidence','Outcome','Content / Code'],table,[31,20,18,28,19,20,18,22]);
  }
  pdfSection(doc,ctx,'Metric detail','02 · complete evidence');
  rows.forEach((x,i)=>{
   const m=x.metadata||{},type=String(m.channelType||'PERFORMANCE').toUpperCase();
   pdfPageBreak(doc,ctx,38);doc.setFont('helvetica','bold');doc.setFontSize(9.5);doc.setTextColor(25,29,33);doc.text(`${i+1}. ${creatorName(x.creator_id)} · ${type}`,14,ctx.y);ctx.y+=7;
   let pairs=[];
   if(type==='DIGITAL') pairs=[['Platform',m.platform],['Content / Post ID',m.contentId],['Spend',pdfFmt(x.spend_thb,'THB')],['Revenue',pdfFmt(x.revenue_thb,'THB')],['Reach',pdfFmt(x.reach)],['Impressions',pdfFmt(x.impressions)],['Views',pdfFmt(x.views)],['Likes',pdfFmt(x.likes)],['Comments',pdfFmt(x.comments)],['Shares',pdfFmt(x.shares)],['Saves',pdfFmt(m.saves)],['Clicks',pdfFmt(x.clicks)],['Landing sessions',pdfFmt(m.landingSessions)],['Leads',pdfFmt(m.leads)],['Conversions',pdfFmt(x.conversions)],['Engagement',pdfFmt(x.engagement)],['Content pieces',pdfFmt(m.contentPieces)]];
   else if(type==='ECOMMERCE') pairs=[['Shop / platform',m.platform],['Spend / creator fee',pdfFmt(x.spend_thb,'THB')],['GMV',pdfFmt(m.gmv,'THB')],['Discounts',pdfFmt(m.discounts,'THB')],['Refunds',pdfFmt(m.refunds,'THB')],['Net sales',pdfFmt(m.netSales??x.revenue_thb,'THB')],['Orders',pdfFmt(m.orders)],['Paid orders',pdfFmt(m.paidOrders??x.conversions)],['Clicks / sessions',pdfFmt(x.clicks)],['New customers',pdfFmt(m.newCustomers)],['Commission rate',pdfFmt(m.commissionRate,'%')],['Commission amount',pdfFmt(m.commissionAmount,'THB')],['AOV',pdfFmt(m.aov,'THB')]];
   else pairs=[['Event type',m.eventType],['Spend',pdfFmt(x.spend_thb,'THB')],['Revenue',pdfFmt(x.revenue_thb,'THB')],['Capacity',pdfFmt(m.capacity)],['Attendance',pdfFmt(m.attendance)],['Qualified leads',pdfFmt(m.qualifiedLeads)],['QR scans',pdfFmt(m.qrScans)],['Demos',pdfFmt(m.demos)],['Samples',pdfFmt(m.samples)],['Engagement',pdfFmt(x.engagement)],['Conversions',pdfFmt(x.conversions)],['Notes',m.notes]];
   pdfRows(doc,ctx,['Metric','Observed value'],pairs,[58,122]);
  });
  doc.save(pdfSaveName('KOL-IDS_Performance',S.selectedCampaign?.name));
 });
}
function buildLinkedLearning({campaignPayload={},audience,decisionRows=[],digital=[],ecommerce=[],offline=[],rows=[],revenue=0,spend=0,conv=0,reach=0,views=0,clicks=0,eng=0,attendance=0,leads=0,roi=null,roas=null,ctr=null,engRate=null,convRate=null}){
 const fmt=n=>Number(n||0).toLocaleString('en-US');
 const creatorName=id=>S.creators.find(x=>String(x.id)===String(id))?.name||'Creator';
 const allPerf=[...digital,...ecommerce,...offline];
 const scored=allPerf.filter(x=>x.actual_score!=null).map(x=>({x,score:Number(x.actual_score),name:creatorName(x.creator_id)})).sort((a,b)=>b.score-a.score);
 const top=scored[0];
 const objective=campaignPayload.objective||campaignPayload.goal||'the campaign objective';
 const audienceText=audience?.payload?.audiencePersona||audience?.payload?.audienceType||'the selected audience';
 const selectedNames=decisionRows.map(x=>x.creator?.name).filter(Boolean);
 const types=[digital.length?'multi-platform digital':null,ecommerce.length?'e-commerce':null,offline.length?'event/offline':null].filter(Boolean);
 const worked=[];
 if(top) worked.push(`${top.name} produced the strongest observed ${String(top.x.metadata?.channelType||'performance').toLowerCase()} outcome score (${Math.round(top.score)}/100).`);
 if(revenue>0&&spend>0) worked.push(`Recorded revenue ${fmt(revenue)} from spend ${fmt(spend)} (${Number(roas||0).toFixed(2)}x ROAS).`);
 if(ctr!=null&&ctr>=1) worked.push(`Digital click-through reached ${ctr.toFixed(2)}%, indicating measurable traffic response.`);
 if(engRate!=null&&engRate>=2) worked.push(`Digital engagement reached ${engRate.toFixed(2)}% of impressions.`);
 if(attendance>0) worked.push(`Event attendance reached ${fmt(attendance)} with ${fmt(leads)} qualified leads.`);
 if(conv>0) worked.push(`${fmt(conv)} recorded conversions/purchases were attributed to the measured outcomes.`);
 if(!worked.length) worked.push(`The campaign has ${fmt(rows.length)} linked performance record${rows.length===1?'':'s'} but not enough outcome evidence to identify a clear winner yet.`);
 const friction=[];
 if(ctr!=null&&ctr<1) friction.push(`CTR is ${ctr.toFixed(2)}%; review the creative hook, CTA and channel/audience alignment.`);
 if(engRate!=null&&engRate<2) friction.push(`Engagement is ${engRate.toFixed(2)}%; test stronger creator-native formats and opening hooks.`);
 if(convRate!=null&&convRate<3) friction.push(`Conversion rate is ${convRate.toFixed(2)}%; audit offer, landing-page and conversion friction before scaling.`);
 if(roi!=null&&roi<0) friction.push(`ROI is ${Math.round(roi)}%; review spend allocation and unit economics before increasing budget.`);
 if(attendance>0&&leads>0&&leads/attendance<.08) friction.push(`Qualified leads are ${((leads/attendance)*100).toFixed(1)}% of attendance; strengthen on-site capture and CTA mechanics.`);
 if(!ecommerce.length&&campaignPayload?.performanceType==='ECOMMERCE') friction.push('The selected outcome model is e-commerce but no linked e-commerce observation is recorded yet.');
 if(!friction.length) friction.push(rows.length?`No major threshold breach was detected in the linked ${types.join(' + ')||'performance'} evidence; continue validating with additional observations.`:'No performance evidence is recorded yet; business-impact conclusions remain unavailable.');
 const hypothesis=[];
 if(top) hypothesis.push(`Replicate the conditions behind ${top.name}'s observed result while keeping the same campaign objective (${objective}) and validating the audience fit.`);
 if(roi!=null&&roi>=0&&roas!=null) hypothesis.push(`Test whether the current creator/channel mix can sustain ${Number(roas).toFixed(2)}x+ ROAS at a controlled incremental budget.`);
 if(convRate!=null&&convRate<3) hypothesis.push('Test a stronger offer and CTA before adding more reach; compare conversion rate against the current baseline.');
 if(attendance>0&&leads>0) hypothesis.push('Test event mechanics that increase qualified-lead yield per attendee, then compare lead quality and downstream revenue.');
 if(!hypothesis.length) hypothesis.push(`Add more verified outcome observations for ${selectedNames.join(', ')||'approved creators'} before changing the next campaign setup.`);
 const sources={campaign:{id:campaignPayload?.id||null,name:campaignPayload?.name||S.selectedCampaign?.name||null,objective},audience:{id:audience?.id||null,persona:audienceText},decision:{creators:selectedNames,count:decisionRows.length},performance:{records:rows.length,types,creators:[...new Set(rows.map(x=>creatorName(x.creator_id))) ]},businessImpact:{revenue,spend,roas,roi,conversions:conv,reach,views,clicks,engagement:eng,attendance,leads}};
 return {worked:worked.join(' '),friction:friction.join(' '),hypothesis:hypothesis.join(' '),sources,generatedAt:new Date().toISOString()};
}
function buildInvestmentMemory(){
 const currentId=String(S.selectedCampaign?.id||'');
 const history=S.campaigns.filter(c=>String(c.id)!==currentId&&String(c.status||'').toLowerCase()==='complete');
 const completed=history.length;
 const learnings=history.map(c=>c.payload?.learning||{}).filter(Boolean);
 const impacts=history.map(c=>c.payload?.businessImpact||{}).filter(x=>x&&Object.keys(x).length);
 const roasVals=impacts.map(x=>Number(x.roas)).filter(Number.isFinite);
 const roiVals=impacts.map(x=>Number(x.roi)).filter(Number.isFinite);
 const avgRoas=roasVals.length?roasVals.reduce((a,b)=>a+b,0)/roasVals.length:null;
 const avgRoi=roiVals.length?roiVals.reduce((a,b)=>a+b,0)/roiVals.length:null;
 const recurring=[];
 const seen=new Set();
 learnings.forEach(l=>[l.worked,l.hypothesis].forEach(v=>{
   if(!v)return;
   const text=String(v).trim();
   if(text.length<28)return;
   const key=text.toLowerCase().replace(/[^a-z0-9ก-๙]+/g,' ').trim().slice(0,90);
   if(!seen.has(key)){seen.add(key);recurring.push(text)}
 }));
 return {completed,avgRoas,avgRoi,recurring:recurring.slice(0,3),hasMemory:completed>0};
}
function buildNextInvestmentDecision({rows=[],roi=null,roas=null,ctr=null,convRate=null}){const memory=buildInvestmentMemory();const evidenceRows=rows.filter(x=>x?.metadata?.evidenceConfidence||x?.source);const verified=evidenceRows.filter(x=>String(x.metadata?.evidenceConfidence||x.source||'').toUpperCase()==='VERIFIED').length;const confidence=rows.length?(verified===rows.length?'High':verified>0?'Medium':'Low'):'Low';const top=rows.filter(x=>x.actual_score!=null).sort((a,b)=>Number(b.actual_score)-Number(a.actual_score))[0];const topName=top?S.creators.find(c=>String(c.id)===String(top.creator_id))?.name:'Current evidence';let recommendation='HOLD & LEARN',reason='Collect more outcome evidence before changing budget allocation.';if(roi!=null&&roi<0){recommendation='REALLOCATE WITH CONTROL';reason='Observed ROI is negative; protect budget and shift spend toward evidence with stronger unit economics.'}else if(roas!=null&&roas>=3){recommendation='SCALE WITH CONTROL';reason=`Recorded ROAS is ${Number(roas).toFixed(2)}x; scale only while monitoring incremental efficiency.`}else if(rows.length&&top){recommendation='REPLICATE THE WINNER';reason=`${topName||'The strongest observed record'} has the highest observed outcome score; test its conditions before broad scaling.`}const tests=[];if(top)tests.push(`Replicate the strongest observed pattern from ${topName||'the top-performing record'} with 2–3 controlled variations.`);if(ctr!=null&&ctr<1)tests.push('Test a stronger hook and CTA before adding more traffic spend.');if(convRate!=null&&convRate<3)tests.push('Improve offer and conversion flow before increasing creator volume.');if(!tests.length)tests.push('Keep the current measurement framework and add verified outcomes before the next allocation decision.');const threshold=roas!=null&&roas>0?`Maintain ROAS ≥ ${Math.max(1,Number(roas)*.86).toFixed(2)}x`:'Set a measurable efficiency threshold before scaling.';const historicalBenchmark=memory.avgRoas!=null?Number(memory.avgRoas):null;if(historicalBenchmark!=null&&roas!=null){if(Number(roas)<historicalBenchmark*.85){recommendation='REVIEW AGAINST HISTORY';reason=`Current ROAS ${Number(roas).toFixed(2)}x is materially below this workspace's observed historical average of ${historicalBenchmark.toFixed(2)}x. Recheck creator mix, content pattern and attribution before reallocating budget.`}else if(Number(roas)>=historicalBenchmark*1.1&&recommendation==='SCALE WITH CONTROL'){reason+=` This is also above the workspace historical average of ${historicalBenchmark.toFixed(2)}x.`}}return{recommendation,reason,confidence,tests,threshold,verified,records:rows.length,topCreator:topName||null,historicalBenchmark,historyCount:memory.completed}}
function renderBusinessImpactPage(c){const fmt=n=>n==null?'Not recorded':Number(n).toLocaleString('en-US');const p=S.selectedCampaign?.payload||{},rows=S.performance.filter(x=>x.campaign_id===S.selectedCampaign?.id),digital=rows.filter(x=>String(x.metadata?.channelType||'').toUpperCase()==='DIGITAL'),ecommerce=rows.filter(x=>String(x.metadata?.channelType||'').toUpperCase()==='ECOMMERCE'),offline=rows.filter(x=>String(x.metadata?.channelType||'').toUpperCase()==='OFFLINE');const revenueDirect=sumKnown(rows,'revenue_thb'),ecommerceNet=sumMetaKnown(ecommerce,'netSales')??sumMetaKnown(ecommerce,'gmv'),revenue=revenueDirect??ecommerceNet,spend=sumKnown(rows,'spend_thb'),convDirect=sumKnown(rows,'conversions'),ecommercePaid=sumMetaKnown(ecommerce,'paidOrders'),conv=convDirect??ecommercePaid,reach=sumKnown(rows,'reach'),views=sumKnown(rows,'views'),clicks=sumKnown(rows,'clicks'),eng=sumKnown(rows,'engagement'),attendance=sumMetaKnown(offline,'attendance'),leads=sumMetaKnown(offline,'qualifiedLeads'),digitalEng=sumKnown(digital,'engagement');
 const hasRevenue=hasValue(revenue),hasSpend=hasValue(spend),hasConv=hasValue(conv),hasReach=hasValue(reach),hasViews=hasValue(views),hasClicks=hasValue(clicks),hasAttendance=hasValue(attendance),hasDigitalImpressions=hasNumeric(digital,'impressions'),hasDigitalConversions=hasNumeric(digital,'conversions')||ecommerce.some(x=>hasValue(x?.metadata?.paidOrders)),hasDigitalClicks=hasNumeric(digital,'clicks');const roi=spend>0&&hasRevenue?((revenue-spend)/spend*100):null,roas=spend>0&&hasRevenue?revenue/spend:null,ctr=hasDigitalClicks&&hasDigitalImpressions&&sumKnown(digital,'impressions')>0?clicks/sumKnown(digital,'impressions')*100:null,engRate=hasDigitalImpressions&&sumKnown(digital,'impressions')>0?digitalEng/sumKnown(digital,'impressions')*100:null,convRate=hasDigitalClicks&&hasDigitalConversions&&clicks>0?conv/clicks*100:null;const decisionRows=latestDecisionRows().filter(x=>(p.selectedCreatorIds||[]).includes(x.creator.id)),selectedNames=decisionRows.map(x=>x.creator?.name).filter(Boolean),avgDecision=decisionRows.length?decisionRows.reduce((s,x)=>s+Number(x.decision.score||0),0)/decisionRows.length:null,avgConfidence=decisionRows.length?decisionRows.reduce((s,x)=>s+Number(x.decision.evidence?.confidence||0),0)/decisionRows.length:null;const impactScore=avgOutcomeScore(rows);const linkedLearning=buildLinkedLearning({campaignPayload:p,audience:S.selectedAudience,decisionRows,digital,ecommerce,offline,rows,revenue,spend,conv,reach,views,clicks,eng,attendance,leads,roi,roas,ctr,engRate,convRate}),nextDecision=buildNextInvestmentDecision({rows,roi,roas,ctr,convRate}),investmentMemory=buildInvestmentMemory(),learning={...linkedLearning,...(p.learning||{}),sources:(p.learning?.sources||linkedLearning.sources),nextInvestmentDecision:p.learning?.nextInvestmentDecision||nextDecision},recs=[];if(ctr!=null&&ctr<1)recs.push('Review creative hook, CTA and audience-channel alignment before increasing traffic spend.');if(engRate!=null&&engRate<2)recs.push('Test stronger creator-native formats and opening hooks to improve meaningful interaction.');if(convRate!=null&&convRate<3)recs.push('Audit landing page, offer and conversion friction before scaling creator reach.');if(roi!=null&&roi<0)recs.push('Reallocate budget toward creators/channels with stronger observed unit economics and keep high-risk spend controlled.');if(attendance&&leads&&leads/attendance<.08)recs.push('Improve on-site lead capture, staff scripting and CTA mechanics at future events.');if(!recs.length)recs.push(rows.length?'Continue collecting verified outcomes before making a scaling decision.':'Record performance outcomes before drawing a business-impact conclusion.');c.innerHTML=`<div data-kol-business-impact="1"><div class="hero"><div><div class="kicker">STEP 06 · BUSINESS IMPACT & LEARNING</div><h2>What did the campaign actually change?</h2><p>Step 06 connects creator decisions and observed performance to business outcomes, then turns the evidence into learning and next actions.</p></div><div class="hero-actions"><span class="pill cyan">Impact score ${impactScore==null?'Not scored':Math.round(impactScore)}</span></div></div><div class="grid g4"><div class="metric"><span class="label">Revenue</span><strong>${hasRevenue?money(revenue):'Not recorded'}</strong><small>Recorded outcomes</small></div><div class="metric"><span class="label">Spend</span><strong>${hasSpend?money(spend):'Not recorded'}</strong><small>Digital + event</small></div><div class="metric"><span class="label">ROAS</span><strong>${roas==null?'Not calculable':roas.toFixed(2)+'x'}</strong><small>(Revenue ÷ Spend)</small></div><div class="metric"><span class="label">ROI</span><strong>${roi==null?'Not calculable':Math.round(roi)+'%'}</strong><small>((Revenue − Spend) ÷ Spend × 100)</small></div></div>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">Decision → Outcome</div><h2>What the previous analysis led to</h2></div></div><div class="grid g4"><div><span class="label">Approved creators</span><div class="mini-stat">${(p.selectedCreatorIds||[]).length}</div></div><div><span class="label">Avg decision score</span><div class="mini-stat">${avgDecision==null?'·':Math.round(avgDecision)}</div></div><div><span class="label">Avg confidence</span><div class="mini-stat">${avgConfidence==null?'·':Math.round(avgConfidence)}</div></div><div><span class="label">Outcome records</span><div class="mini-stat">${rows.length}</div></div></div><div class="signal-box" style="margin-top:14px"><b>Observed effect</b><p>Digital reach ${hasReach?money(reach):'Not recorded'} · views ${hasViews?money(views):'Not recorded'} · clicks ${hasClicks?money(clicks):'Not recorded'} · conversions ${hasConv?money(conv):'Not recorded'} · event attendance ${hasAttendance?money(attendance):'Not recorded'} · event leads ${hasValue(leads)?money(leads):'Not recorded'}.</p></div><div class="signal-box" style="margin-top:12px"><b>Prediction learning signal</b><p>${(()=>{const z=predictionLearningSummary();return z.n?`${z.n} matched outcome${z.n===1?'':'s'} · MAE ${z.mae.toFixed(1)} · bias ${(z.bias>0?'+':'')+z.bias.toFixed(1)} · interval coverage ${z.coverage.toFixed(0)}%. Use this as calibration evidence, not as a guarantee.`:'No matched prediction/actual pairs yet. Record actual performance to activate the learning loop.'})()}</p></div></section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">ADAPTIVE LEARNING ENGINE</div><h2>The model gets better from observed outcomes</h2><p class="sub">KOL IDS compares prior predictions with actual performance, then uses out-of-sample residuals, creator history, recency and drift checks to calibrate future estimates.</p></div><span class="pill cyan">No self-training on future data</span></div><div class="grid g4">${(()=>{const z=adaptiveLearningSummary();return `<div class="metric"><span class="label">Matched predictions</span><strong>${z.n}</strong><small>Prediction → actual pairs</small></div><div class="metric"><span class="label">Model MAE</span><strong>${z.mae==null?'·':z.mae.toFixed(1)}</strong><small>Lower is tighter</small></div><div class="metric"><span class="label">Interval coverage</span><strong>${z.coverage==null?'·':z.coverage.toFixed(0)+'%'}</strong><small>Actuals inside estimated range</small></div><div class="metric"><span class="label">Creator-adapted</span><strong>${z.creatorAdapted}</strong><small>Creators with ≥3 matched predictions</small></div>`})()}</div><div class="signal-box" style="margin-top:12px"><b>How the loop works</b><p>Predict before activation → record verified or self-reported outcome → compare actual vs predicted → calibrate by recency → check creator drift → use the corrected estimate in the next decision. Sparse history stays explicitly guarded instead of being treated as certainty.</p></div></section>
 <section class="card next-investment-card" style="margin-top:14px"><div class="section-head"><div><div class="label">NEXT INVESTMENT DECISION</div><h2>What should happen next?</h2><p class="sub">A decision signal built from observed evidence, business impact and evidence confidence. It is a recommendation, not a forecast guarantee.</p></div><span class="pill cyan">${esc(nextDecision.confidence)} confidence</span></div><div class="grid g3"><div class="signal-box"><span class="label">Recommendation</span><h3 style="margin:7px 0 4px">${esc(nextDecision.recommendation)}</h3><p>${esc(nextDecision.reason)}</p></div><div class="signal-box"><span class="label">Best observed signal</span><p>${esc(nextDecision.topCreator||'Not enough evidence yet')}</p><small>${nextDecision.records} linked record${nextDecision.records===1?'':'s'} · ${nextDecision.verified} verified</small></div><div class="signal-box"><span class="label">Success threshold</span><p>${esc(nextDecision.threshold)}</p><small>Review after the next measurement period.</small></div></div><div class="signal-box" style="margin-top:12px"><b>Suggested experiment</b><ul style="margin:8px 0 0 18px;padding:0">${nextDecision.tests.map(x=>`<li style="margin:5px 0">${esc(x)}</li>`).join('')}</ul></div></section>
 <section class="card investment-memory-card" style="margin-top:14px"><div class="section-head"><div><div class="label">BRAND LEARNING MEMORY</div><h2>What KOL IDS already knows</h2><p class="sub">Completed campaigns become reusable decision evidence. The system never treats an old result as a guarantee for a new campaign.</p></div><span class="pill cyan">${investmentMemory.completed} completed campaign${investmentMemory.completed===1?'':'s'} linked</span></div>${investmentMemory.hasMemory?`<div class="grid g4"><div class="metric"><span class="label">Historical campaigns</span><strong>${investmentMemory.completed}</strong><small>Completed in this workspace</small></div><div class="metric"><span class="label">Historical avg ROAS</span><strong>${investmentMemory.avgRoas==null?'Not recorded':investmentMemory.avgRoas.toFixed(2)+'x'}</strong><small>Observed, not forecast</small></div><div class="metric"><span class="label">Historical avg ROI</span><strong>${investmentMemory.avgRoi==null?'Not recorded':Math.round(investmentMemory.avgRoi)+'%'}</strong><small>Observed, not forecast</small></div><div class="metric"><span class="label">Reusable learning</span><strong>${investmentMemory.recurring.length}</strong><small>Prior signals available</small></div></div><div class="memory-list">${investmentMemory.recurring.length?investmentMemory.recurring.map((x,i)=>`<div class="memory-item"><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x)}</p></div>`).join(''):'<div class="empty">Complete more campaigns to build reusable brand learning.</div>'}</div>`:'<div class="empty">No completed campaign memory yet. Complete this campaign and KOL IDS will preserve its evidence, learning and next-action history for future decisions.</div>'}</section>
<section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">Learning · LINKED EVIDENCE</div><h2>What did we learn?</h2><p class="sub">These three conclusions are generated from the same campaign → audience → creator decision → performance → business impact chain. You can edit them before saving.</p></div><span class="pill cyan">${esc(`${rows.length} performance record${rows.length===1?'':'s'} linked`)}</span></div><div class="grid g3 business-learning-cards" style="margin-bottom:14px"><div class="signal-box"><b>Campaign</b><p>${esc(p.name||S.selectedCampaign?.name||'·')}</p><small>${esc(p.objective||p.goal||'Objective not set')}</small></div><div class="signal-box"><b>Audience</b><p>${esc(S.selectedAudience?.payload?.audienceType||'·')}</p><small>${esc(S.selectedAudience?.payload?.audiencePersona||'·')}</small></div><div class="signal-box"><b>Evidence</b><p>${fmt(rows.length)} records · ${esc([digital.length?'Digital':null,ecommerce.length?'E-commerce':null,offline.length?'Event':null].filter(Boolean).join(' · ')||'No type yet')}</p><small>${fmt(selectedNames.length)} approved creators linked</small></div></div><form id="learning-form"><div class="form-grid"><div class="field full"><label>What worked</label><textarea id="learn-worked" placeholder="Linked from observed outcomes, creator decisions and business results.">${esc(learning.worked||linkedLearning.worked)}</textarea><div class="hint">Linked from: campaign objective · audience · approved creators · observed performance · revenue/conversion evidence.</div></div><div class="field full"><label>What did not work / friction</label><textarea id="learn-friction" placeholder="Linked from measured thresholds, missing evidence and efficiency gaps.">${esc(learning.friction||linkedLearning.friction)}</textarea><div class="hint">Linked from: CTR · engagement · conversion · ROI/ROAS · event funnel · evidence coverage.</div></div><div class="field full"><label>Learning / hypothesis for next campaign</label><textarea id="learn-hypothesis" placeholder="Linked from the strongest observed outcome and the current gaps.">${esc(learning.hypothesis||linkedLearning.hypothesis)}</textarea><div class="hint">Linked from: strongest observed creator/outcome · campaign objective · current performance baseline.</div></div></div><div class="actions"><button class="btn" type="button" id="regenerate-linked-learning">Refresh from linked evidence</button><button class="btn primary" type="submit">Save learning & next actions</button></div></form></section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">Calculated next actions</div><h2>Recommended next steps</h2></div></div><div class="grid g2">${recs.map((r,i)=>`<div class="signal-box"><span class="pill cyan">${i+1}</span><p>${esc(r)}</p></div>`).join('')}</div></section>
 <div class="bottom-actions"><button class="btn" id="impact-csv">Export impact CSV</button><button class="btn primary" id="continue-report">Continue → Reports</button></div></div>`;
 document.getElementById('regenerate-linked-learning')?.addEventListener('click',()=>{document.getElementById('learn-worked').value=linkedLearning.worked;document.getElementById('learn-friction').value=linkedLearning.friction;document.getElementById('learn-hypothesis').value=linkedLearning.hypothesis;toast('Learning refreshed from linked campaign evidence','good')});
 document.getElementById('learning-form').onsubmit=async e=>{e.preventDefault();const next={...(S.selectedCampaign.payload||{}),impactObjective:p.objective||p.goal||'',impactNotes:document.getElementById('learn-friction').value.trim(),learning:{worked:document.getElementById('learn-worked').value.trim(),friction:document.getElementById('learn-friction').value.trim(),hypothesis:document.getElementById('learn-hypothesis').value.trim(),nextActions:recs,nextInvestmentDecision:nextDecision,sources:linkedLearning.sources,investmentMemoryAtSave:{completedCampaigns:investmentMemory.completed,avgRoas:investmentMemory.avgRoas,avgRoi:investmentMemory.avgRoi},generatedAt:new Date().toISOString()},businessImpact:{score:impactScore,revenue,spend,roi,roas,conversions:conv,reach,views,clicks,engagement:eng,attendance,leads,ctr,engagementRate:engRate,conversionRate:convRate,digitalRecords:digital.length,offlineRecords:offline.length,calculatedAt:new Date().toISOString()}};const q=await sb.from('campaigns').update({payload:next,updated_at:new Date().toISOString()}).eq('id',S.selectedCampaign.id).select().single();if(q.error){toast(q.error.message,'error');return}S.selectedCampaign=q.data;toast('Business impact, learning and next actions saved','good');renderPage()};document.getElementById('impact-csv').onclick=downloadImpactCSV;document.getElementById('continue-report').onclick=()=>{S.page=6;renderPage()}}
function downloadImpactPDF(){
 exportGateOr(()=>{
  if(!window.jspdf?.jsPDF){window.print();return}
  const snap=reportLiveSnapshot(),i=snap.impact||{},l=snap.learning||{};const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});const ctx=pdfEnterprise(doc,'Business Impact & Learning','Observed outcomes · efficiency · evidence coverage · next investment learning');ctx.y=39;
  pdfMetricGrid(doc,ctx,[{label:'Impact score',value:i.score==null?'Not scored':`${Math.round(i.score)}/100`},{label:'Revenue',value:i.revenue==null?'Not recorded':pdfFmt(i.revenue,'THB')},{label:'Spend',value:i.spend==null?'Not recorded':pdfFmt(i.spend,'THB')},{label:'ROAS',value:i.roas==null?'Not calculable':pdfFmt(i.roas,'x')}]);
  pdfSection(doc,ctx,'Business impact','01 · observed commercial effect');
  pdfRows(doc,ctx,['Metric','Value','Status'],[
   ['Revenue',i.revenue==null?'Not recorded':pdfFmt(i.revenue,'THB'),i.revenue==null?'MISSING':'AVAILABLE'],
   ['Spend',i.spend==null?'Not recorded':pdfFmt(i.spend,'THB'),i.spend==null?'MISSING':'AVAILABLE'],
   ['ROAS',i.roas==null?'Not calculable':pdfFmt(i.roas,'x'),i.roas==null?'NOT CALCULABLE':'CALCULATED'],
   ['ROI',i.roi==null?'Not calculable':pdfFmt(i.roi,'%'),i.roi==null?'NOT CALCULABLE':'CALCULATED'],
   ['Conversions',i.conversions==null?'Not recorded':pdfFmt(i.conversions),'OBSERVED'],
   ['Reach',i.reach==null?'Not recorded':pdfFmt(i.reach),'OBSERVED'],
   ['Views',i.views==null?'Not recorded':pdfFmt(i.views),'OBSERVED'],
   ['Clicks',i.clicks==null?'Not recorded':pdfFmt(i.clicks),'OBSERVED'],
   ['Event attendance',i.attendance==null?'Not recorded':pdfFmt(i.attendance),'OBSERVED'],
   ['Qualified leads',i.leads==null?'Not recorded':pdfFmt(i.leads),'OBSERVED']
  ],[62,68,50]);
  pdfSection(doc,ctx,'Learning register','02 · decision memory');
  pdfNarrative(doc,ctx,'What worked',l.worked);pdfNarrative(doc,ctx,'Friction / what did not work',l.friction);pdfNarrative(doc,ctx,'Next hypothesis',l.hypothesis);
  pdfSection(doc,ctx,'Recommended next actions','03 · calculated action set');
  (l.nextActions||[]).forEach((x,n)=>pdfNarrative(doc,ctx,`Action ${n+1}`,x));
  doc.save(pdfSaveName('KOL-IDS_Business-Impact',S.selectedCampaign?.name));
 });
}
function reportExportIsTrial(){return Boolean(S.plan?.is_trial||String(S.subscription?.plan_code||'').toUpperCase()==='TRIAL_7')}
function showPaidExportGate(){
 const old=document.getElementById('kol-export-gate');if(old)old.remove();
 const m=document.createElement('div');m.id='kol-export-gate';m.className='kol-export-modal';
 m.innerHTML=`<div class="kol-export-card" role="dialog" aria-modal="true" aria-labelledby="kol-export-title"><div class="kol-export-kicker">KOL IDS · PAID EXPORT</div><h3 id="kol-export-title">Unlock report exports</h3><p>Your Trial workspace can review everything on screen. CSV exports from Reports and the Creator Fit PDF are available after upgrading to a paid plan.</p><div class="kol-export-plans"><div class="kol-export-plan"><b>3 Months</b><strong>THB 29,900</strong><span>1 user · paid workspace</span></div><div class="kol-export-plan"><b>6 Months</b><strong>THB 55,900</strong><span>2 users · paid workspace</span></div><div class="kol-export-plan"><b>12 Months</b><strong>THB 105,900</strong><span>3 users · paid workspace</span></div></div><div class="kol-export-actions"><button type="button" id="kol-export-close">Not now</button><button type="button" class="primary" id="kol-export-upgrade">View plans &amp; subscribe →</button></div></div>`;
 document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)m.remove()});document.getElementById('kol-export-close').onclick=()=>m.remove();document.getElementById('kol-export-upgrade').onclick=()=>{window.location.href='/KOLIDS'};
}
function csvSafeName(name){return String(name||'Campaign').trim().replace(/[^A-Za-z0-9-_]+/g,'-').replace(/^-+|-+$/g,'')||'Campaign'}
function csvDateStamp(){const d=new Date();return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`}
function csvIsoNow(){return new Date().toISOString()}
function csvCell(v){return `"${String(v==null?'':v).replace(/"/g,'""')}"`}
function enterpriseCSV(headers,rows,scope){
 const metaHeaders=['Export Version','Generated At','Product','Data Scope','Campaign ID','Campaign Name',...headers];
 const generated=csvIsoNow();
 const metaRows=rows.map(r=>['3.0',generated,'KOL IDS','Enterprise / '+scope,S.selectedCampaign?.id||'',S.selectedCampaign?.name||'',...r]);
 return {headers:metaHeaders,rows:metaRows};
}
function downloadCSVFile(filename,headers,rows){
 const csv='\ufeff'+[headers,...rows].map(r=>r.map(csvCell).join(',')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function downloadEnterpriseCSV(filename,headers,rows,scope){
 const out=enterpriseCSV(headers,rows,scope);
 downloadCSVFile(filename,out.headers,out.rows);
}
function exportGateOr(fn){if(reportExportIsTrial()){showPaidExportGate();return}fn()}
function reportContext(){
 const p=S.selectedCampaign?.payload||{},snap=reportLiveSnapshot(),c=S.selectedCampaign||{},a=S.selectedAudience?.payload||{};
 return {p,snap,c,a};
}
function downloadDecisionCSV(){exportGateOr(()=>{
 const {p}=reportContext(), rows=latestDecisionRows().filter(x=>(p.selectedCreatorIds||[]).includes(x.creator.id));
 if(!rows.length){toast('Run creator fit calculation first.','error');return}
 const headers=['Campaign','Campaign ID','Creator ID','Creator','Channel','Followers','ER','Decision','Overall Fit','Confidence','Evidence','Audience Fit','Content Fit','Brand Fit','Performance Fit','Commercial Fit','Risk','Why','If Selected','Campaign Move'];
 const out=rows.map(({creator:r,decision:d})=>{const e=d.evidence||{};return [S.selectedCampaign?.name,S.selectedCampaign?.id,r.id,r.name,r.payload?.channel,r.payload?.followers,r.payload?.engagementRate,d.decision,d.score,e.confidence,e.evidence||e.method,e.audienceFit,e.contentFit,e.brandFit,e.performance,e.commercial,e.risk,e.reason,e.ifSelected||creatorAdaptation(e),e.campaignMove||creatorAdaptation(e)]});
 downloadEnterpriseCSV(`KOL-IDS_Decision_${csvSafeName(S.selectedCampaign?.name)}_${csvDateStamp()}.csv`,headers,out,'Decision readiness');toast('Decision CSV saved','good')
})}
function performanceExportRows(){
 const {snap}=reportContext(),perf=snap.perf,creatorName=id=>S.creators.find(c=>String(c.id)===String(id))?.name||'Creator';
 const headers=['Report Version','Generated At','Campaign','Campaign ID','Performance Type','Creator ID','Creator','Observed At','Source','Evidence Confidence','Status','Outcome Score','Gen Code','Attribution Window Days','Spend THB','Revenue THB','Platform','Reach','Impressions','Views','Likes','Comments','Shares','Saves','Clicks / Sessions','Landing Sessions','Leads','Conversions','Engagement','Content Pieces','Orders','Paid Orders','GMV','Discounts','Refunds','Net Sales','New Customers','Commission Rate %','Commission Amount','AOV','Event Type','Capacity','Attendance','Qualified Leads','QR Scans','Demos','Samples','Event Engagement','Event Conversions','Outcome Notes'];
 const rows=perf.map(x=>{const m=x.metadata||{},t=String(m.channelType||'PERFORMANCE').toUpperCase();return ['3.0',csvIsoNow(),S.selectedCampaign?.name,S.selectedCampaign?.id,t,x.creator_id,creatorName(x.creator_id),x.observed_at,x.source,m.evidenceConfidence||x.source,x.status,x.actual_score,m.genCode,m.attributionWindowDays,x.spend_thb,x.revenue_thb,m.platform,x.reach,x.impressions,x.views,x.likes,x.comments,x.shares,m.saves,x.clicks,m.landingSessions,m.leads,x.conversions,x.engagement,m.contentPieces,m.orders,m.paidOrders,m.gmv,m.discounts,m.refunds,m.netSales,m.newCustomers,m.commissionRate,m.commissionAmount,m.aov,m.eventType,m.capacity,m.attendance,m.qualifiedLeads,m.qrScans,m.demos,m.samples,m.engagement,x.conversions,m.notes]});
 return {headers,rows}
}
function downloadPerformanceCSV(){exportGateOr(()=>{const {headers,rows}=performanceExportRows();if(!rows.length){toast('No performance records to export yet.','error');return}downloadEnterpriseCSV(`KOL-IDS_Performance_${csvSafeName(S.selectedCampaign?.name)}_${csvDateStamp()}.csv`,headers,rows,'Performance observations');toast('Performance CSV saved','good')})}
function downloadImpactCSV(){exportGateOr(()=>{
 const {snap}=reportContext(),i=snap.impact;
 const headers=['Campaign','Campaign ID','Metric','Value','Unit'];
 const pairs=[['Impact score',i.score,'score'],['Revenue',i.revenue,'THB'],['Spend',i.spend,'THB'],['ROAS',i.roas,'x'],['ROI',i.roi,'%'],['Conversions',i.conversions,'count'],['Reach',i.reach,'count'],['Views',i.views,'count'],['Clicks',i.clicks,'count'],['Engagement',i.engagement,'count'],['Event attendance',i.attendance,'count'],['Event leads',i.leads,'count'],['CTR',i.ctr,'%'],['Engagement rate',i.engagementRate,'%'],['Conversion rate',i.conversionRate,'%'],['Digital records',i.digitalRecords,'count'],['E-commerce records',i.ecommerceRecords,'count'],['Event records',i.offlineRecords,'count']];
 downloadEnterpriseCSV(`KOL-IDS_Business-Impact_${csvSafeName(S.selectedCampaign?.name)}_${csvDateStamp()}.csv`,headers,pairs.map(x=>[S.selectedCampaign?.name,S.selectedCampaign?.id,x[0],x[1],x[2]]),'Business impact');toast('Business impact CSV saved','good')
})}
function downloadLearningCSV(){exportGateOr(()=>{
 const {snap}=reportContext(),l=snap.learning||{};
 const headers=['Campaign','Campaign ID','Learning Type','Value'];
 const rows=[['Worked',l.worked],['Friction',l.friction],['Next hypothesis',l.hypothesis],...(l.nextActions||[]).map((x,i)=>[`Next action ${i+1}`,x])].map(x=>[S.selectedCampaign?.name,S.selectedCampaign?.id,x[0],x[1]]);
 downloadEnterpriseCSV(`KOL-IDS_Learning_${csvSafeName(S.selectedCampaign?.name)}_${csvDateStamp()}.csv`,headers,rows,'Learning and next actions');toast('Learning CSV saved','good')
})}
function downloadReportCSV(){exportGateOr(()=>{
 const {p,snap,c,a}=reportContext(),decision=snap.decisionRows;
 const headers=['Section','Campaign','Campaign ID','Creator ID','Creator','Performance Type','Field','Value','Unit','Decision','Overall Fit','Confidence','Source'];
 const rows=[];
 const push=(section,field,value,creatorId='',creator='',type='',unit='',decisionValue='',score='',confidence='',source='')=>rows.push([section,c.name,c.id,creatorId,creator,type,field,value,unit,decisionValue,score,confidence,source]);
 push('Campaign','Name',c.name);push('Campaign','Status',c.status);push('Campaign','Objective',p.objective||p.goal);push('Campaign','Performance Type',p.performanceType);push('Campaign','Budget',p.budget);push('Campaign','Market',p.market);push('Campaign','Start Date',p.startDate);push('Campaign','End Date',p.endDate);
 push('Audience','Type',a.audienceType);push('Audience','Persona',a.audiencePersona);
 decision.forEach(({creator:r,decision:d})=>{const e=d.evidence||{};const base=[r.id,r.name,'',d.decision,d.score,e.confidence];[['Name',r.name],['Channel',r.payload?.channel],['Followers',r.payload?.followers],['ER',r.payload?.engagementRate],['Decision',d.decision],['Overall Fit',d.score],['Confidence',e.confidence],['Audience Fit',e.audienceFit],['Content Fit',e.contentFit],['Brand Fit',e.brandFit],['Performance Fit',e.performance],['Commercial Fit',e.commercial],['Risk',e.risk],['Why',e.reason],['If Selected',e.ifSelected||creatorAdaptation(e)],['Campaign Move',e.campaignMove||creatorAdaptation(e)]].forEach(([f,v])=>push('Creator Decision',f,v,...base));});
 snap.perf.forEach(x=>{const m=x.metadata||{},t=String(m.channelType||'PERFORMANCE').toUpperCase(),r=S.creators.find(c=>String(c.id)===String(x.creator_id)),rn=r?.name||'Creator',d=decision.find(q=>String(q.creator.id)===String(x.creator_id));
   const fields=[['Observed At',x.observed_at],['Source',x.source],['Status',x.status],['Outcome Score',x.actual_score],['Gen Code',m.genCode],['Attribution Window Days',m.attributionWindowDays],['Spend THB',x.spend_thb,'THB'],['Revenue THB',x.revenue_thb,'THB'],['Platform',m.platform],['Reach',x.reach],['Impressions',x.impressions],['Views',x.views],['Likes',x.likes],['Comments',x.comments],['Shares',x.shares],['Saves',m.saves],['Clicks / Sessions',x.clicks],['Landing Sessions',m.landingSessions],['Leads',m.leads],['Conversions',x.conversions],['Engagement',x.engagement],['Content Pieces',m.contentPieces],['Orders',m.orders],['Paid Orders',m.paidOrders],['GMV',m.gmv,'THB'],['Discounts',m.discounts,'THB'],['Refunds',m.refunds,'THB'],['Net Sales',m.netSales,'THB'],['New Customers',m.newCustomers],['Commission Rate',m.commissionRate,'%'],['Commission Amount',m.commissionAmount,'THB'],['AOV',m.aov,'THB'],['Event Type',m.eventType],['Capacity',m.capacity],['Attendance',m.attendance],['Qualified Leads',m.qualifiedLeads],['QR Scans',m.qrScans],['Demos',m.demos],['Samples',m.samples],['Event Engagement',x.engagement],['Event Conversions',x.conversions],['Outcome Notes',m.notes]];
   fields.forEach(([f,v,u=''])=>push('Performance',f,v,x.creator_id,rn,t,u,d?.decision||'',d?.score??'',d?.decision?.evidence?.confidence??'',x.source||''));
 });
 Object.entries(snap.impact||{}).forEach(([k,v])=>push('Business Impact',k,v,'','','','', '', '', '',''));['worked','friction','hypothesis'].forEach(k=>push('Learning',k,snap.learning?.[k]));(snap.learning?.nextActions||[]).forEach((x,i)=>push('Learning',`nextAction${i+1}`,x));push('Next Investment Decision','Recommendation',snap.learning?.nextInvestmentDecision?.recommendation);push('Next Investment Decision','Confidence',snap.learning?.nextInvestmentDecision?.confidence);push('Next Investment Decision','Reason',snap.learning?.nextInvestmentDecision?.reason);push('Next Investment Decision','Success Threshold',snap.learning?.nextInvestmentDecision?.threshold);push('Next Investment Decision','Historical ROAS Benchmark',snap.learning?.nextInvestmentDecision?.historicalBenchmark);push('Next Investment Decision','Historical Campaign Count',snap.learning?.nextInvestmentDecision?.historyCount);(snap.learning?.nextInvestmentDecision?.tests||[]).forEach((x,i)=>push('Next Investment Decision',`Experiment ${i+1}`,x));
 downloadEnterpriseCSV(`KOL-IDS_Campaign-Intelligence_${csvSafeName(c.name)}_${csvDateStamp()}.csv`,headers,rows,'Campaign intelligence');toast('Campaign Intelligence CSV saved','good')
})}
function reportLiveSnapshot(){
 const p=S.selectedCampaign?.payload||{};
 const perf=S.performance.filter(x=>x.campaign_id===S.selectedCampaign?.id);
 const digital=perf.filter(x=>String(x.metadata?.channelType||'').toUpperCase()==='DIGITAL');
 const ecommerce=perf.filter(x=>String(x.metadata?.channelType||'').toUpperCase()==='ECOMMERCE');
 const offline=perf.filter(x=>String(x.metadata?.channelType||'').toUpperCase()==='OFFLINE');
 const revenueDirect=sumKnown(perf,'revenue_thb'),ecommerceNet=sumMetaKnown(ecommerce,'netSales')??sumMetaKnown(ecommerce,'gmv'),revenue=revenueDirect??ecommerceNet;
 const spend=sumKnown(perf,'spend_thb');
 const convDirect=sumKnown(perf,'conversions'),ecommercePaid=sumMetaKnown(ecommerce,'paidOrders'),conv=convDirect??ecommercePaid;
 const reach=sumKnown(perf,'reach'),views=sumKnown(perf,'views'),clicks=sumKnown(perf,'clicks'),eng=sumKnown(perf,'engagement');
 const impressions=sumKnown(perf,'impressions');
 const attendance=sumMetaKnown(offline,'attendance');
 const leads=sumMetaKnown(offline,'qualifiedLeads');
 const hasRevenue=perf.some(x=>x?.revenue_thb!=null)||ecommerce.some(x=>x?.metadata?.netSales!=null||x?.metadata?.gmv!=null);
 const hasSpend=perf.some(x=>x?.spend_thb!=null);
 const hasConversionEvidence=perf.some(x=>x?.conversions!=null)||ecommerce.some(x=>x?.metadata?.paidOrders!=null);
 const hasImpressionEvidence=digital.some(x=>x?.impressions!=null);
 const hasClickEvidence=digital.some(x=>x?.clicks!=null);
 const roi=spend>0&&hasRevenue?((revenue-spend)/spend*100):null;
 const roas=spend>0&&hasRevenue?revenue/spend:null;
 const ctr=hasImpressionEvidence&&hasClickEvidence&&impressions>0?clicks/impressions*100:null;
 const engRate=hasImpressionEvidence&&impressions>0?eng/impressions*100:null;
 const convRate=hasClickEvidence&&hasConversionEvidence&&clicks>0?conv/clicks*100:null;
 const decisionRows=latestDecisionRows().filter(x=>(p.selectedCreatorIds||[]).includes(x.creator.id));
 const linked=buildLinkedLearning({campaignPayload:p,audience:S.selectedAudience,decisionRows,digital,ecommerce,offline,rows:perf,revenue,spend,conv,reach,views,clicks,eng,attendance,leads,roi,roas,ctr,engRate,convRate});
 const impact={score:avgOutcomeScore(perf),revenue,spend,roi,roas,conversions:conv,reach,views,clicks,engagement:eng,attendance,leads,ctr,engagementRate:engRate,conversionRate:convRate,digitalRecords:digital.length,ecommerceRecords:ecommerce.length,offlineRecords:offline.length,hasRevenue,hasSpend,hasConversionEvidence,hasImpressionEvidence,hasClickEvidence};
 const stored=p.learning||{};
 const usable=v=>v&&String(v).trim()&&!/^not recorded yet\.?$/i.test(String(v).trim())&&String(v).trim()!=='Complete Step 06 to generate next actions.';
 const autoActions=[];
 if(impact.roi!=null&&impact.roi<0)autoActions.push('Review spend allocation and unit economics before scaling.');
 if(impact.conversionRate!=null&&impact.conversionRate<3)autoActions.push('Audit offer, CTA and conversion friction before increasing reach.');
 if(impact.engagementRate!=null&&impact.engagementRate<2)autoActions.push('Test stronger creator-native hooks and formats.');
 if(!autoActions.length)autoActions.push('Add another verified outcome observation before making the next allocation change.');
 const learning={worked:usable(stored.worked)?stored.worked:linked.worked,friction:usable(stored.friction)?stored.friction:linked.friction,hypothesis:usable(stored.hypothesis)?stored.hypothesis:linked.hypothesis,nextActions:Array.isArray(stored.nextActions)&&stored.nextActions.length?stored.nextActions:autoActions,sources:linked.sources};
 return {p,perf,digital,ecommerce,offline,decisionRows,impact,learning,linked};
}

function reportSvgBarChart(items, opts={}){
 const width=opts.width||760,height=opts.height||390,pad={l:205,r:92,t:44,b:56};
 const valid=items.filter(x=>Number.isFinite(Number(x.value)));
 if(!valid.length)return `<div class="report-chart-empty">Not enough evidence to visualize</div>`;
 const max=Math.max(...valid.map(x=>Number(x.value)),1),innerW=width-pad.l-pad.r,innerH=height-pad.t-pad.b;
 const rowH=Math.max(62,innerH/valid.length),barH=Math.min(34,rowH*.42);
 const ticks=4;
 const grid=Array.from({length:ticks+1},(_,i)=>{const x=pad.l+innerW*i/ticks;const v=max*i/ticks;return `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${pad.t+innerH}" class="rchart-gridline"/><text x="${x}" y="${height-18}" text-anchor="middle" class="rchart-axis">${esc(opts.format?opts.format(v):String(Math.round(v)))}</text>`}).join('');
 const bars=valid.map((x,i)=>{
   const v=Number(x.value)||0,y=pad.t+i*rowH+(rowH-barH)/2,w=Math.max(4,v/max*innerW);
   const label=String(x.label||'');
   const value=opts.format?opts.format(v):String(Math.round(v));
   const valueX=Math.min(width-pad.r+5,pad.l+w+12);
   return `<g><text x="${pad.l-18}" y="${y+barH/2+6}" text-anchor="end" class="rchart-label rchart-label-strong">${esc(label)}</text><rect x="${pad.l}" y="${y}" width="${w.toFixed(1)}" height="${barH}" rx="5" class="rchart-bar"/><text x="${valueX}" y="${y+barH/2+6}" class="rchart-value">${esc(value)}</text></g>`;
 }).join('');
 return `<svg class="report-chart-svg report-chart-horizontal" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.aria||'Bar chart')}">${grid}${bars}</svg>`;
}

function reportSvgLineChart(items, opts={}){
 const width=opts.width||760,height=opts.height||420,pad={l:104,r:104,t:104,b:72};
 if(!items.length)return `<div class="report-chart-empty">Not enough evidence to visualize</div>`;
 const aVals=items.map(x=>Number(x.a)).filter(Number.isFinite),bVals=items.map(x=>Number(x.b)).filter(Number.isFinite);
 if(!aVals.length&&!bVals.length)return `<div class="report-chart-empty">Not enough evidence to visualize</div>`;
 const maxA=Math.max(...aVals,1),maxB=Math.max(...bVals,1),innerW=width-pad.l-pad.r,innerH=height-pad.t-pad.b;
 const xAt=i=>pad.l+(items.length===1?innerW/2:i*innerW/(Math.max(1,items.length-1)));
 const yA=v=>pad.t+innerH-(Number(v)/maxA)*innerH,yB=v=>pad.t+innerH-(Number(v)/maxB)*innerH;
 const moneyAxis=v=>{const n=Number(v)||0;if(Math.abs(n)>=1000000)return `฿${(n/1000000).toFixed(1)}M`;if(Math.abs(n)>=1000)return `฿${Math.round(n/1000)}K`;return `฿${Math.round(n).toLocaleString()}`};
 const path=(key,fn,cls)=>{let pts=[];const out=[];items.forEach((x,i)=>{const v=Number(x[key]);if(Number.isFinite(v))pts.push(`${xAt(i).toFixed(1)},${fn(v).toFixed(1)}`);else if(pts.length){out.push(`<polyline fill="none" class="${cls}" points="${pts.join(' ')}"/>`);pts=[];}});if(pts.length)out.push(`<polyline fill="none" class="${cls}" points="${pts.join(' ')}"/>`);return out.join('')};
 const pointLabels=(key,fn,cls)=>items.map((x,i)=>{
  const v=Number(x[key]);if(!Number.isFinite(v))return '';
  const px=xAt(i),py=fn(v),atLeft=i===0,atRight=i===items.length-1;
  // Dense timelines keep every point and line, but label alternate dates (plus the final date).
  // This prevents adjacent currency values from becoming an unreadable block.
  const dense=items.length>5;
  const showLabel=!dense || i%2===0 || i===items.length-1;
  let tx=px,anchor='middle';
  // Increase horizontal separation between adjacent value labels to avoid overlap.
  const labelGap=items.length>4?22:14;
  if(atLeft){tx=px+labelGap;anchor='start'}else if(atRight){tx=px-labelGap;anchor='end'}
  let y=py+(key==='a'?-20:26);
  if(Number.isFinite(Number(x.a))&&Number.isFinite(Number(x.b))&&Math.abs(yA(Number(x.a))-yB(Number(x.b)))<42){
    y=py+(key==='a'?-38:44);
  }
  if(y<pad.t+12)y=Math.min(pad.t+innerH-8,py+28);
  if(y>pad.t+innerH-4)y=Math.max(pad.t+14,py-28);
  // For dense data, nudge visible labels outward from alternating points.
  if(dense && i>0 && i<items.length-1){tx=px+(i%2===0?labelGap:-labelGap);anchor=i%2===0?'start':'end';}
  if(items.length===1){tx=px+(key==='a'?-12:12);anchor=key==='a'?'end':'start';}
  return `<circle cx="${px}" cy="${py}" r="4" class="${cls}"/>${showLabel?`<text x="${tx}" y="${y}" text-anchor="${anchor}" class="rchart-point-value ${cls}-text">${esc(moneyAxis(v))}</text>`:''}`;
 }).join('');
 const grid=Array.from({length:5},(_,i)=>{const frac=i/4,y=pad.t+innerH*frac;const av=maxA*(1-frac),bv=maxB*(1-frac);return `<line x1="${pad.l}" y1="${y}" x2="${width-pad.r}" y2="${y}" class="rchart-gridline"/><text x="${pad.l-14}" y="${y+5}" text-anchor="end" class="rchart-axis">${esc(moneyAxis(av))}</text><text x="${width-pad.r+14}" y="${y+5}" class="rchart-axis">${esc(moneyAxis(bv))}</text>`}).join('');
 const labels=items.map((x,i)=>`<text x="${xAt(i)}" y="${height-24}" text-anchor="middle" class="rchart-label rchart-date-label">${esc(String(x.label||''))}</text>`).join('');
 const legendX=(width-240)/2;
 return `<svg class="report-chart-svg report-chart-trend" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.aria||'Revenue and spend over observed dates')}"><g transform="translate(${legendX},24)"><circle cx="5" cy="0" r="4.5" class="rchart-dot-a"/><text x="16" y="4" class="rchart-legend">Revenue</text><circle cx="112" cy="0" r="4.5" class="rchart-dot-b"/><text x="123" y="4" class="rchart-legend">Spend</text></g><text x="${pad.l}" y="57" class="rchart-axis">Revenue · THB</text><text x="${width-pad.r}" y="57" text-anchor="end" class="rchart-axis">Spend · THB</text>${grid}${path('a',yA,'rchart-line-a')}${path('b',yB,'rchart-line-b')}${pointLabels('a',yA,'rchart-dot-a')}${pointLabels('b',yB,'rchart-dot-b')}${labels}</svg>`;
}

function reportSvgRevenueContribution(items, opts={}){
 const valid=items.filter(x=>Number.isFinite(Number(x.value))&&Number(x.value)>0).sort((a,b)=>Number(b.value)-Number(a.value));
 if(!valid.length)return `<div class="report-chart-empty">Not enough revenue evidence to visualize</div>`;
 const total=valid.reduce((a,x)=>a+Number(x.value),0);
 const width=opts.width||760,height=Math.max(330,105+valid.length*72),pad={l:205,r:128,t:48,b:56};
 const innerW=width-pad.l-pad.r,rowH=(height-pad.t-pad.b)/valid.length;
 const moneyAxis=v=>{const n=Number(v)||0;if(Math.abs(n)>=1000000)return `฿${(n/1000000).toFixed(1)}M`;if(Math.abs(n)>=1000)return `฿${Math.round(n/1000)}K`;return `฿${Math.round(n).toLocaleString()}`};
 const maxValue=Math.max(...valid.map(x=>Number(x.value)),1);
 const grid=Array.from({length:5},(_,i)=>{const x=pad.l+innerW*i/4;const v=maxValue*i/4;return `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${height-pad.b}" class="rchart-gridline"/><text x="${x}" y="${height-18}" text-anchor="middle" class="rchart-axis">${esc(moneyAxis(v))}</text>`}).join('');
 const rows=valid.map((x,i)=>{
   const v=Number(x.value),share=v/total*100,y=pad.t+i*rowH+(rowH-38)/2,w=Math.max(5,v/maxValue*innerW),label=String(x.label||'');
   const shareText=`${share.toFixed(1)}%`;
   const shareX=Math.min(width-pad.r-62,pad.l+w+14);
   return `<g><text x="${pad.l-18}" y="${y+25}" text-anchor="end" class="rchart-label rchart-label-strong">${esc(label)}</text><rect x="${pad.l}" y="${y}" width="${innerW}" height="38" rx="5" class="rchart-bar-track"/><rect x="${pad.l}" y="${y}" width="${w.toFixed(1)}" height="38" rx="5" class="rchart-bar rchart-revenue-bar-${i}"/><text x="${shareX}" y="${y+25}" class="rchart-share">${esc(shareText)}</text><text x="${width-pad.r+12}" y="${y+25}" class="rchart-value">${esc(money(v))}</text></g>`;
 }).join('');
 return `<svg class="report-chart-svg report-chart-revenue" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.aria||'Revenue contribution by creator')}">${grid}${rows}</svg>`;
}

function reportSvgDonut(parts, opts={}){
 const valid=parts.filter(x=>Number(x.value)>0),total=valid.reduce((a,x)=>a+Number(x.value),0);
 if(!total)return `<div class="report-chart-empty">Not enough evidence to visualize</div>`;
 let offset=0;
 const colors=['#55CDE8','#3D131B','#D9CBB0','#A8E9F4','#7B5960','#EEF9FB'];
 const stops=valid.map((x,i)=>{const pct=Number(x.value)/total*100,s=`${colors[i%colors.length]} ${offset}% ${offset+pct}%`;offset+=pct;return s}).join(',');
 return `<div class="report-donut-wrap"><div class="report-donut" style="background:conic-gradient(${stops})"><div><strong>${esc(opts.center||'100%')}</strong><span>${esc(opts.centerLabel||'observed mix')}</span></div></div><div class="report-legend">${valid.map((x,i)=>`<div><i style="background:${colors[i%colors.length]}"></i><span>${esc(x.label)}</span><b>${Number(x.value).toLocaleString()}</b></div>`).join('')}</div></div>`;
}
function buildReportVisuals(snap){
 const {perf,impact,digital,ecommerce,offline}=snap;
 const creatorName=id=>S.creators.find(x=>String(x.id)===String(id))?.name||'Creator';
 const byCreator={};
 perf.forEach(x=>{
   const id=String(x.creator_id||'unknown');
   const o=byCreator[id]||(byCreator[id]={name:creatorName(x.creator_id),revenue:0,score:[],records:0});
   o.records++;
   if(x.revenue_thb!=null)o.revenue+=Number(x.revenue_thb)||0;
   if(x.metadata?.netSales!=null&&x.revenue_thb==null)o.revenue+=Number(x.metadata.netSales)||0;
   if(x.metadata?.gmv!=null&&x.revenue_thb==null&&x.metadata?.netSales==null)o.revenue+=Number(x.metadata.gmv)||0;
   if(x.actual_score!=null&&Number.isFinite(Number(x.actual_score)))o.score.push(Number(x.actual_score));
 });
 const creators=Object.values(byCreator);
 const bars=creators.filter(x=>x.score.length).map(x=>({label:x.name,value:x.score.reduce((a,b)=>a+b,0)/x.score.length})).sort((a,b)=>b.value-a.value).slice(0,6);
 const revBars=creators.filter(x=>x.revenue>0).map(x=>({label:x.name,value:x.revenue})).sort((a,b)=>b.value-a.value).slice(0,6);
 const dated={};
 perf.forEach(x=>{
   if(!x.observed_at)return;
   const date=String(x.observed_at).slice(0,10);
   const q=dated[date]||(dated[date]={date,label:date.slice(5),a:null,b:null});
   if(x.revenue_thb!=null)q.a=(q.a||0)+(Number(x.revenue_thb)||0);
   else if(x.metadata?.netSales!=null)q.a=(q.a||0)+(Number(x.metadata.netSales)||0);
   else if(x.metadata?.gmv!=null)q.a=(q.a||0)+(Number(x.metadata.gmv)||0);
   if(x.spend_thb!=null)q.b=(q.b||0)+(Number(x.spend_thb)||0);
 });
 const trend=Object.values(dated).sort((a,b)=>a.date.localeCompare(b.date)).slice(-10);
 const mix=[{label:'Digital',value:digital.length},{label:'E-commerce',value:ecommerce.length},{label:'Event / Offline',value:offline.length}].filter(x=>x.value>0);
 return {bars,revBars,trend,mix};
}

function reportDecisionQuality(snap){
 const decisions=snap.decisionRows||[],perf=snap.perf||[];
 const conf=decisions.map(x=>Number(x.decision?.evidence?.confidence)).filter(Number.isFinite);
 const high=decisions.filter(x=>String(x.decision?.evidence?.modelTrust||'').toUpperCase()==='HIGH').length;
 const calibrated=decisions.filter(x=>String(x.decision?.evidence?.calibrationStatus||'').toUpperCase()==='CALIBRATED').length;
 const insufficient=decisions.filter(x=>String(x.decision?.decision||'').includes('INSUFFICIENT')).length;
 const verified=perf.filter(x=>['VERIFIED','API'].includes(String(x.source||'').toUpperCase())).length;
 const quality=perf.map(x=>Number(x.quality_score)).filter(Number.isFinite);
 const pred=predictionLearningSummary();
 return {avgConfidence:conf.length?conf.reduce((a,b)=>a+b,0)/conf.length:null,highTrust:high,calibrated,insufficient,verified,avgEvidenceQuality:quality.length?quality.reduce((a,b)=>a+b,0)/quality.length:null,predictionN:pred.n,predictionMae:pred.mae,predictionBias:pred.bias,predictionCoverage:pred.coverage};
}

function reports(c){
 // HARD ROUTE GUARD: Reports is Step 07 only. If a stale/late callback reaches here on Step 06,
 // immediately restore the Business Impact renderer instead of overwriting the page.
 if(Number(S.page)!==6){
   if(Number(S.page)===5){renderBusinessImpactPage(c);c.dataset.kolPage='business-impact';}
   return;
 }

 // Opening Step 07 only prepares the report. Completion is explicit via the button below.
 const snap=reportLiveSnapshot(),{p,perf,digital,ecommerce,offline,decisionRows,impact,learning}=snap;
 const decisionQuality=reportDecisionQuality(snap);
 const active=p.selectedCreatorIds||[],selected=decisionRows;
 const creatorName=id=>S.creators.find(x=>String(x.id)===String(id))?.name||'Creator';
 const topByCreator=(()=>{const by={};perf.forEach(x=>{if(x?.actual_score==null)return;const score=Number(x.actual_score);if(Number.isFinite(score))((by[String(x.creator_id)]??=[]).push(score));});return Object.entries(by).map(([id,v])=>({id,name:creatorName(id),score:v.reduce((a,b)=>a+b,0)/v.length,n:v.length})).sort((a,b)=>b.score-a.score).slice(0,3)})();
 c.innerHTML=`<div data-kol-report-page="1" class="kol-report-page"><div class="hero"><div><div class="kicker">T POP ENTERTAINMENT CONNECTS · KOL IDS™ · STEP 07</div><h2>Campaign Intelligence Report</h2><div class="report-brandline"><span>T POP Entertainment Connects</span><span>Investment Decision Intelligence</span></div><p>Everything below is calculated from the same evidence chain used by the decision engine. The report separates fit, observed performance, evidence quality and model reliability so a missing metric is never presented as a false negative.</p></div><div class="hero-actions"><span class="pill ${String(S.selectedCampaign?.status||'draft').toUpperCase()=='COMPLETE'?'good':'cyan'}">${String(S.selectedCampaign?.status||'draft').toUpperCase()=='COMPLETE'?'COMPLETE':'REPORT READY'}</span>${String(S.selectedCampaign?.status||'draft').toUpperCase()=='COMPLETE'?'<button class="btn good" id="complete-campaign" type="button">CAMPAIGN SAVED</button>':'<button class="btn primary" id="complete-campaign" type="button">Save campaign →</button>'}<button class="btn" id="report-campaign-intelligence-csv">Intelligence CSV</button><button class="btn" id="report-performance-csv">Performance CSV</button><button class="btn" id="report-decision-csv">Decision CSV</button><button class="btn" id="report-impact-csv">Impact CSV</button><button class="btn primary" id="report-full-pdf">Download Complete Report PDF</button></div></div>
 <div class="grid g4"><div class="metric"><span class="label">Creators approved</span><strong>${active.length}</strong><small>User-approved for performance tracking</small></div><div class="metric"><span class="label">Performance records</span><strong>${perf.length}</strong><small>All outcome types</small></div><div class="metric"><span class="label">Impact score</span><strong>${impact.score==null?'Not scored':Math.round(impact.score)}</strong><small>Recorded outcome score</small></div><div class="metric"><span class="label">ROAS</span><strong>${impact.roas==null?'Not calculable':Number(impact.roas).toFixed(2)+'x'}</strong><small>(Revenue ÷ Spend)</small></div></div>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">01 · Campaign & Audience</div><h2>Strategic context</h2></div></div><div class="grid g2"><div class="signal-box"><h4>Campaign</h4><p><b>${esc(S.selectedCampaign?.name||'·')}</b></p><p>${esc((p.objectives||[]).join(' · ')||p.objective||p.goal||'·')}</p><p>${esc((p.brandPersonalities||[]).join(' · ')||'·')}</p></div><div class="signal-box"><h4>Audience</h4><p><b>${esc(S.selectedAudience?.payload?.audienceType||'·')}</b></p><p>${esc(S.selectedAudience?.payload?.audiencePersona||'·')}</p></div></div></section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">02 · Creator Decision</div><h2>Creator Decision Evidence</h2><p class="sub">Approval is the user decision. The decision signal below is the intelligence engine recommendation and evidence state.</p></div></div>${selected.length?`<div class="table-wrap"><table><thead><tr><th>Creator</th><th>Decision signal</th><th>Overall</th><th>Audience</th><th>Content</th><th>Brand</th><th>Performance</th><th>Commercial</th><th>Risk</th></tr></thead><tbody>${selected.map(x=>{const e=x.decision.evidence||{};return `<tr><td><b>${esc(x.creator.name)}</b></td><td>${esc(x.decision.decision||'·')}</td><td>${x.decision.score==null?'·':Math.round(x.decision.score)}</td><td>${Math.round(e.audienceFit??50)}</td><td>${Math.round(e.contentFit??50)}</td><td>${Math.round(e.brandFit??50)}</td><td>${e.performanceEvidenceAvailable===false?'—':Math.round(e.performance??0)}</td><td>${Math.round(e.commercial??50)}</td><td>${Math.round(e.risk??50)}</td></tr>`}).join('')}</tbody></table></div>` :'<div class="empty">No creators have been approved for performance tracking yet.</div>'}</section>
 <section class="card report-model-quality" style="margin-top:14px"><div class="section-head"><div><div class="label">02B · DECISION GOVERNANCE</div><h2>Decision quality &amp; model reliability</h2><p class="sub">Confidence is evidence reliability — not a bonus to fit. Missing history stays neutral, while weak or unverified evidence is surfaced for review.</p></div></div><div class="grid g4"><div class="metric"><span class="label">Avg. confidence</span><strong>${decisionQuality.avgConfidence==null?'—':Math.round(decisionQuality.avgConfidence)}</strong><small>Across linked creator decisions</small></div><div class="metric"><span class="label">High-trust decisions</span><strong>${decisionQuality.highTrust}</strong><small>OOS calibration + creator evidence</small></div><div class="metric"><span class="label">Calibrated</span><strong>${decisionQuality.calibrated}</strong><small>Account calibration available</small></div><div class="metric"><span class="label">Verified records</span><strong>${decisionQuality.verified}/${perf.length}</strong><small>API / verified evidence sources</small></div></div><div class="evidence-status-grid" style="margin-top:12px"><div class="evidence-status ${decisionQuality.insufficient?'is-missing':'is-present'}"><b>${decisionQuality.insufficient?'REVIEW':'READY'}</b><span>Historical evidence gate</span></div><div class="evidence-status ${decisionQuality.predictionN>=5?'is-present':'is-missing'}"><b>${decisionQuality.predictionN}</b><span>Predictions with actuals</span></div><div class="evidence-status ${decisionQuality.predictionCoverage==null?'is-missing':decisionQuality.predictionCoverage>=70?'is-present':'is-missing'}"><b>${decisionQuality.predictionCoverage==null?'—':Math.round(decisionQuality.predictionCoverage)+'%'}</b><span>Interval coverage</span></div><div class="evidence-status ${decisionQuality.predictionMae==null?'is-missing':decisionQuality.predictionMae<=12?'is-present':'is-missing'}"><b>${decisionQuality.predictionMae==null?'—':Math.round(decisionQuality.predictionMae)}</b><span>Prediction MAE</span></div></div></section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">03 · Performance</div><h2>All observed evidence & outcomes</h2><p class="sub">Every observed record is retained and reported. Digital, e-commerce and event/offline evidence remains linked to the campaign and creator.</p></div></div><div class="grid g2"><div class="signal-box"><h4>Multi-platform digital</h4><p>${digital.length?`${digital.length} record${digital.length===1?'':'s'} · Reach ${displayMetric(sumKnown(digital,'reach'))} · Views ${displayMetric(sumKnown(digital,'views'))} · Impressions ${displayMetric(sumKnown(digital,'impressions'))} · Clicks ${displayMetric(sumKnown(digital,'clicks'))} · Conversions ${displayMetric(sumKnown(digital,'conversions'))}`:'No records'}</p></div><div class="signal-box"><h4>E-commerce</h4><p>${ecommerce.length?`${ecommerce.length} record${ecommerce.length===1?'':'s'} · GMV ${displayMetric(sumMetaKnown(ecommerce,'gmv'))} · Net sales ${displayMetric(sumMetaKnown(ecommerce,'netSales'))} · Orders ${displayMetric(sumMetaKnown(ecommerce,'orders'))} · Paid orders ${displayMetric(sumMetaKnown(ecommerce,'paidOrders'))}`:'No records'}</p></div><div class="signal-box"><h4>Event / offline</h4><p>${offline.length?`${offline.length} record${offline.length===1?'':'s'} · Attendance ${displayMetric(sumMetaKnown(offline,'attendance'))} · Capacity ${displayMetric(sumMetaKnown(offline,'capacity'))} · Qualified leads ${displayMetric(sumMetaKnown(offline,'qualifiedLeads'))} · Demos ${displayMetric(sumMetaKnown(offline,'demos'))} · Samples ${displayMetric(sumMetaKnown(offline,'samples'))} · Conversions ${displayMetric(sumKnown(offline,'conversions'))}`:'No records'}</p></div></div><div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Creator</th><th>Type</th><th>Date</th><th>Outcome</th><th>Revenue</th><th>Spend</th><th>Key evidence</th></tr></thead><tbody>${perf.length?perf.map(x=>{const t=String(x.metadata?.channelType||'PERFORMANCE').toUpperCase();const key=t==='ECOMMERCE'?`GMV ${money(x.metadata?.gmv)} · Orders ${money(x.metadata?.paidOrders||x.metadata?.orders)} · Commission ${money(x.metadata?.commissionAmount)}`:t==='OFFLINE'?`Attendance ${money(x.metadata?.attendance)} · Leads ${money(x.metadata?.qualifiedLeads)} · Demos ${money(x.metadata?.demos)}`:`Reach ${x.reach==null?'Not recorded':money(x.reach)} · Views ${x.views==null?'Not recorded':money(x.views)} · Clicks ${x.clicks==null?'Not recorded':money(x.clicks)} · Conv ${x.conversions==null?'Not recorded':money(x.conversions)}`;return `<tr><td>${esc(creatorName(x.creator_id))}</td><td>${esc(t)}</td><td>${esc(x.observed_at||'·')}</td><td>${x.actual_score==null?'Pending':Math.round(x.actual_score)+'/100'}</td><td>${displayMetric(x.revenue_thb)}</td><td>${displayMetric(x.spend_thb)}</td><td>${esc(key)}</td></tr>`}).join(''):'<tr><td colspan="7">No performance records yet.</td></tr>'}</tbody></table></div></section>
 <section class="card report-visuals" style="margin-top:14px"><div class="section-head"><div><div class="label">04 · VISUAL INTELLIGENCE</div><h2>Performance at a glance</h2><p class="sub">Charts use only observed campaign evidence. Missing or insufficient evidence is never converted into invented values.</p></div></div><div class="report-chart-grid"><div class="report-chart-card"><div class="report-chart-head"><b>Outcome trend</b><span>Revenue vs Spend</span></div>${reportSvgLineChart(buildReportVisuals(snap).trend,{title:'Observed financial movement',aria:'Revenue and spend over observed dates'})}</div><div class="report-chart-card"><div class="report-chart-head"><b>Creator performance</b><span>Observed score</span></div>${reportSvgBarChart(buildReportVisuals(snap).bars,{title:'Completed outcome score',aria:'Creator observed outcome scores'})}</div><div class="report-chart-card"><div class="report-chart-head"><b>Revenue contribution</b><span>By creator</span></div>${reportSvgRevenueContribution(buildReportVisuals(snap).revBars,{title:'Revenue share by creator',aria:'Revenue contribution share by creator'})}</div><div class="report-chart-card"><div class="report-chart-head"><b>Evidence mix</b><span>Observed records</span></div>${reportSvgDonut(buildReportVisuals(snap).mix,{center:perf.length?String(perf.length):'0',centerLabel:'records'})}</div></div></section>
 <section class="card report-data-quality" style="margin-top:14px"><div class="section-head"><div><div class="label">05 · DATA COVERAGE & QUALITY</div><h2>Evidence coverage</h2><p class="sub">A transparent inventory of what the report actually observed. Missing evidence remains explicitly marked as unavailable.</p></div></div><div class="grid g4"><div class="metric"><span class="label">Digital records</span><strong>${digital.length}</strong><small>Reach · views · impressions · clicks · conversions</small></div><div class="metric"><span class="label">E-commerce records</span><strong>${ecommerce.length}</strong><small>GMV · net sales · orders · paid orders</small></div><div class="metric"><span class="label">Offline records</span><strong>${offline.length}</strong><small>Attendance · leads · demos · samples</small></div><div class="metric"><span class="label">Decision records</span><strong>${selected.length}</strong><small>Approved creator decisions linked to this campaign</small></div></div><div class="evidence-status-grid"><div class="evidence-status ${impact.hasRevenue?'is-present':'is-missing'}"><b>${impact.hasRevenue?'AVAILABLE':'MISSING'}</b><span>Revenue evidence</span></div><div class="evidence-status ${impact.hasSpend?'is-present':'is-missing'}"><b>${impact.hasSpend?'AVAILABLE':'MISSING'}</b><span>Spend evidence</span></div><div class="evidence-status ${impact.hasConversionEvidence?'is-present':'is-missing'}"><b>${impact.hasConversionEvidence?'AVAILABLE':'MISSING'}</b><span>Conversion evidence</span></div><div class="evidence-status ${impact.hasImpressionEvidence?'is-present':'is-missing'}"><b>${impact.hasImpressionEvidence?'AVAILABLE':'MISSING'}</b><span>Impression evidence</span></div><div class="evidence-status ${impact.hasClickEvidence?'is-present':'is-missing'}"><b>${impact.hasClickEvidence?'AVAILABLE':'MISSING'}</b><span>Click evidence</span></div></div></section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">06 · Business Impact</div><h2>Observed business effect</h2><p class="sub">Calculated live from the linked performance records.</p></div></div><div class="grid g4"><div><span class="label">Revenue</span><div class="mini-stat">${perf.some(x=>x?.revenue_thb!=null||x?.metadata?.netSales!=null||x?.metadata?.gmv!=null)?money(impact.revenue):'Not recorded'}</div></div><div><span class="label">Spend</span><div class="mini-stat">${perf.some(x=>x?.spend_thb!=null)?money(impact.spend):'Not recorded'}</div></div><div><span class="label">ROI</span><div class="mini-stat">${impact.roi==null?'Not calculable':Math.round(impact.roi)+'%'}</div><small class="formula-note">((Revenue − Spend) ÷ Spend × 100)</small></div><div><span class="label">Conversions</span><div class="mini-stat">${perf.some(x=>x?.conversions!=null||x?.metadata?.paidOrders!=null)?money(impact.conversions):'Not recorded'}</div></div></div><div class="grid g4" style="margin-top:12px"><div><span class="label">Reach</span><div class="mini-stat">${money(impact.reach)}</div></div><div><span class="label">Views</span><div class="mini-stat">${money(impact.views)}</div></div><div><span class="label">Clicks</span><div class="mini-stat">${money(impact.clicks)}</div></div><div><span class="label">Event attendance</span><div class="mini-stat">${money(impact.attendance)}</div></div></div></section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">06B · PERFORMANCE LEADERBOARD</div><h2>Top 3 Performance</h2><p class="sub">Shows only creators with a completed observed outcome score. Pending records stay out of the ranking until an actual score is recorded.</p></div></div>${topByCreator.length?`<div class="grid g3">${topByCreator.map((x,i)=>`<div class="signal-box"><div style="display:flex;justify-content:space-between;gap:12px"><b>#${i+1} ${esc(x.name)}</b><strong>${Math.round(x.score)}/100</strong></div><p>${x.n} observed record${x.n===1?'':'s'}</p></div>`).join('')}</div>`:'<div class="empty">No completed performance outcomes yet.</div>'}</section>
 <section class="card" style="margin-top:14px"><div class="section-head"><div><div class="label">07 · Learning & Next Actions</div><h2>What should happen next?</h2><p class="sub">Generated from the same live evidence chain; stored text is used only when you explicitly saved an edited version.</p></div></div><div class="grid g2 reports-next-cards"><div class="signal-box"><h4>What worked</h4><p>${esc(learning.worked||'Not recorded yet.')}</p></div><div class="signal-box"><h4>Friction / what did not work</h4><p>${esc(learning.friction||'Not recorded yet.')}</p></div><div class="signal-box"><h4>Next hypothesis</h4><p>${esc(learning.hypothesis||'Not recorded yet.')}</p></div><div class="signal-box"><h4>Calculated next actions</h4><p>${(learning.nextActions||[]).map((x,i)=>`${i+1}. ${esc(x)}`).join('<br>')||'No saved next actions; Step 06 can calculate them.'}</p></div></div></section></div>`;
 document.getElementById('report-campaign-intelligence-csv').onclick=downloadReportCSV;document.getElementById('report-performance-csv').onclick=downloadPerformanceCSV;document.getElementById('report-decision-csv').onclick=downloadDecisionCSV;document.getElementById('report-impact-csv').onclick=downloadImpactCSV;document.getElementById('report-full-pdf').onclick=downloadFullPDF;
 const completeBtn=document.getElementById('complete-campaign');
 if(completeBtn){completeBtn.onclick=async()=>{
   if(completeBtn.dataset.busy==='1')return;
   completeBtn.dataset.busy='1';
   completeBtn.disabled=true;
   const wasComplete=String(S.selectedCampaign?.status||'draft').toLowerCase()==='complete';
   completeBtn.textContent='Saving…';
   const ok=await markCampaignComplete();
   if(ok){toast(wasComplete?'Campaign saved.':'Campaign completed and saved to Campaign History.','good');S.page=6;renderPage();}
   else {completeBtn.disabled=false;completeBtn.dataset.busy='0';completeBtn.textContent=wasComplete?'CAMPAIGN SAVED':'Save campaign →';toast('Could not save this campaign. Please try again.','error');}
 }};
}
function downloadFullPDF(){
 exportGateOr(()=>{
  if(!window.jspdf?.jsPDF){window.print();return}
  const snap=reportLiveSnapshot(),{p,perf,digital,ecommerce,offline,decisionRows,impact,learning}=snap;const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});const ctx=pdfEnterprise(doc,'Campaign Intelligence Report','Executive decision pack · evidence register · creator decisions · performance · business impact');ctx.y=39;
  const creatorName=id=>S.creators.find(x=>String(x.id)===String(id))?.name||'Creator';
  pdfMetricGrid(doc,ctx,[{label:'Creators approved',value:decisionRows.length},{label:'Evidence records',value:perf.length},{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')}]);
  pdfSection(doc,ctx,'Executive context','01 · campaign context');
  pdfRows(doc,ctx,['Field','Observed value'],[
   ['Campaign',S.selectedCampaign?.name||'—'],['Status',S.selectedCampaign?.status||'—'],['Objective',(p.objectives||[]).join(' · ')||p.objective||p.goal||'—'],['Performance model',p.performanceType||'—'],['Budget',pdfFmt(p.budget,'THB')],['Market',p.market||'—'],['Start date',p.startDate||'—'],['End date',p.endDate||'—'],['Audience type',S.selectedAudience?.payload?.audienceType||'—'],['Audience persona',S.selectedAudience?.payload?.audiencePersona||'—']],[58,122]);
  pdfSection(doc,ctx,'Creator decision register','02 · decision evidence');
  if(!decisionRows.length) pdfNarrative(doc,ctx,'Status','No creator decision records were linked to this campaign.');
  else pdfRows(doc,ctx,['Creator','Decision','Overall','Audience','Content','Brand','Performance','Commercial','Risk','Confidence'],decisionRows.map(({creator:r,decision:d})=>{const e=d.evidence||{};return [r.name,d.decision||'—',d.score==null?'—':Math.round(d.score),Math.round(e.audienceFit??50),Math.round(e.contentFit??50),Math.round(e.brandFit??50),Math.round(e.performance??0),Math.round(e.commercial??50),Math.round(e.risk??50),Math.round(e.confidence??0)]}),[30,24,13,13,13,13,14,14,11,15]);
  pdfSection(doc,ctx,'Performance evidence','03 · all linked observations');
  if(!perf.length) pdfNarrative(doc,ctx,'Status','No performance evidence was recorded yet.');
  else pdfRows(doc,ctx,['Creator','Type','Observed','Source','Confidence','Outcome','Content / Code'],perf.map(x=>[creatorName(x.creator_id),String(x.metadata?.channelType||'PERFORMANCE'),x.observed_at||'—',x.source||'—',x.metadata?.evidenceConfidence||x.source||'—',x.actual_score==null?'Pending':`${Math.round(x.actual_score)}/100`,x.metadata?.contentId||x.metadata?.genCode||'—']),[34,22,20,22,23,20,37]);
  pdfSection(doc,ctx,'Business impact','04 · commercial effect');
  pdfRows(doc,ctx,['Metric','Value','Interpretation'],[
   ['Revenue',impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB'),impact.revenue==null?'Evidence unavailable':'Observed revenue'],
   ['Spend',impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB'),impact.spend==null?'Evidence unavailable':'Observed spend'],
   ['ROAS',impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x'),impact.roas==null?'Requires revenue + spend':'Revenue ÷ spend'],
   ['ROI',impact.roi==null?'Not calculable':pdfFmt(impact.roi,'%'),impact.roi==null?'Requires revenue + spend':'(Revenue − spend) ÷ spend'],
   ['Conversions',impact.conversions==null?'Not recorded':pdfFmt(impact.conversions),'Observed conversion count'],
   ['Reach',impact.reach==null?'Not recorded':pdfFmt(impact.reach),'Observed reach'],
   ['Clicks',impact.clicks==null?'Not recorded':pdfFmt(impact.clicks),'Observed clicks / sessions'],
   ['Event attendance',impact.attendance==null?'Not recorded':pdfFmt(impact.attendance),'Observed attendance'],
   ['Qualified leads',impact.leads==null?'Not recorded':pdfFmt(impact.leads),'Observed lead count']
  ],[52,55,73]);
  pdfSection(doc,ctx,'Learning & next decision','05 · institutional memory');
  pdfNarrative(doc,ctx,'What worked',learning.worked);pdfNarrative(doc,ctx,'Friction',learning.friction);pdfNarrative(doc,ctx,'Next hypothesis',learning.hypothesis);
  const nid=learning.nextInvestmentDecision||{};if(nid.recommendation) pdfNarrative(doc,ctx,'Next investment decision',`${nid.recommendation} · Confidence ${nid.confidence||'—'} · ${nid.reason||''}`);if(nid.threshold)pdfNarrative(doc,ctx,'Success threshold',nid.threshold);if(nid.historicalBenchmark)pdfNarrative(doc,ctx,'Historical benchmark',`ROAS ${nid.historicalBenchmark} · ${nid.historyCount||0} historical campaign(s)`);(learning.nextActions||[]).forEach((x,n)=>pdfNarrative(doc,ctx,`Next action ${n+1}`,x));
  pdfSection(doc,ctx,'Evidence coverage','06 · data quality');
  const coverage=[['Digital records',digital.length],['E-commerce records',ecommerce.length],['Offline / event records',offline.length],['Decision records',decisionRows.length],['Revenue evidence',impact.revenue==null?'MISSING':'AVAILABLE'],['Spend evidence',impact.spend==null?'MISSING':'AVAILABLE'],['Conversion evidence',impact.conversions==null?'MISSING':'AVAILABLE'],['Impression evidence',digital.some(x=>x.impressions!=null)?'AVAILABLE':'MISSING'],['Click evidence',impact.clicks==null?'MISSING':'AVAILABLE']];
  pdfRows(doc,ctx,['Evidence class','Status / count'],coverage,[80,100]);
  doc.save(pdfSaveName('KOL-IDS_Full-Report',S.selectedCampaign?.name));
 });
}
function accessGate(){
 const reason=S.accessReason||'NO_ACTIVE_SUBSCRIPTION';
 const pending=reason==='PAYMENT_PENDING';
 const expired=reason==='SUBSCRIPTION_EXPIRED';
 const title=pending?'Payment approval is still pending':expired?'Your subscription has expired':'Workspace access is not active';
 const body=pending?'Your account was created successfully, but the paid workspace is not active yet. The previous application is still stored on this account, so KOL IDS will not create a second workspace just because you sign in again.':expired?'Your account is valid, but the current subscription period has ended. Renew the organization plan to continue.':'Your account is authenticated, but this organization does not currently have an active KOL IDS plan.';
 const plan=S.plan?.name||S.subscription?.plan_code||'';
 const price=Number(S.plan?.price_thb);
 const priceLabel=Number.isFinite(price)&&price>0?`THB ${price.toLocaleString('en-US',{maximumFractionDigits:2})}`:'';
 const order=S.subscription?.order_id||'';
 const expiresAt=S.subscription?.expires_at||'';
 root.innerHTML=`<div class="access-gate"><div class="access-gate-shell">
   <div class="access-gate-brand"><div class="access-gate-mark">K</div><div><b>KOL IDS™</b><span>Investment Decision Intelligence</span></div></div>
   <main class="access-gate-card">
     <div class="access-gate-status ${pending?'pending':expired?'expired':'neutral'}"><span></span>${pending?'PAYMENT PENDING':expired?'SUBSCRIPTION EXPIRED':'ACCESS CHECK'}</div>
     <div class="access-gate-kicker">ACCOUNT VERIFIED</div>
     <h1>${esc(title)}</h1>
     <p class="access-gate-copy">${esc(body)}</p>
     ${pending?`<div class="access-gate-note"><b>No new account was created.</b><span>Your existing account and organization are being kept safely in place while payment approval is pending.</span></div>`:''}
     <div class="access-gate-meta">
       <div><span>ACCOUNT</span><b>${esc(S.session?.user?.email||'Verified account')}</b></div>
       ${plan?`<div><span>PLAN</span><b>${esc(plan)}</b></div>`:''}
       ${priceLabel?`<div><span>PLAN PRICE</span><b>${esc(priceLabel)}</b></div>`:order?`<div><span>ORDER</span><b>${esc(order)}</b></div>`:''}
       ${priceLabel&&order?`<div><span>ORDER</span><b>${esc(order)}</b></div>`:''}
       ${expired&&expiresAt?`<div><span>ACCESS ENDED</span><b>${esc(new Date(expiresAt).toLocaleString('en-GB',{dateStyle:'medium',timeZone:'Asia/Bangkok'}))}</b></div>`:''}
     </div>
     <div class="access-gate-actions">
       <button id="gate-refresh" class="btn primary">Check Access Again</button>
       <button id="gate-home" class="btn">Back to KOL IDS</button>
       <button id="gate-signout" class="btn ghost">Sign out</button>
     </div>
     <div class="access-gate-foot">Access changes automatically after the account status is updated.</div>
   </main>
 </div></div>`;
 document.getElementById('gate-refresh').onclick=boot;
 document.getElementById('gate-home').onclick=()=>window.location.assign('/KOLIDS');
 document.getElementById('gate-signout').onclick=()=>sb.auth.signOut();
}

/* REPORTS ENTERPRISE FINAL POLISH · 20261006 */
(function(){
 const styleId='kol-ids-reports-enterprise-final-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  .kol-report-page{background:#fff!important;color:#171717!important}
  .kol-report-page>.hero{background:#fff!important;border:1px solid #e7e7e7!important;box-shadow:0 18px 50px rgba(0,0,0,.045)!important}
  .kol-report-page>.hero h2,.kol-report-page>.card .section-head h2{color:#171717!important}
  .kol-report-page>.hero .kicker,.kol-report-page>.card .section-head .label{color:#171717!important}
  .kol-report-page .btn.cyan,.kol-report-page .pill.cyan{background:#AEEFFF!important;border-color:#AEEFFF!important;color:#111!important}
  .kol-report-page>.card{background:#fff!important;border:1px solid #e5e5e5!important;box-shadow:0 14px 40px rgba(0,0,0,.035)!important}
  .report-chart-grid{gap:18px!important}
  .report-chart-card{background:#FFF8E8!important;border:1px solid #F0DFBD!important;border-radius:16px!important;padding:22px 22px 20px!important;box-shadow:0 10px 30px rgba(107,79,40,.055)!important}
  .report-chart-head{padding-bottom:14px!important;margin-bottom:14px!important;border-bottom:1px solid #EAD9B9!important}
  .report-chart-head b{font-size:15px!important;font-weight:800!important;color:#6B4F28!important;letter-spacing:-.02em!important}
  .report-chart-head span{font-size:11px!important;color:#92744A!important}
  .report-chart-svg{min-height:340px!important;height:auto!important;overflow:visible!important}
  .rchart-title{font-size:13px!important;fill:#6B4F28!important;font-weight:800!important}
  .rchart-value{font-size:16px!important;fill:#6B4F28!important;font-weight:900!important}
  .rchart-share{font-size:15px!important;fill:#7A5C2E!important;font-weight:900!important}
  .rchart-label{font-size:13px!important;fill:#8A704D!important}
  .rchart-label-strong{font-size:15px!important;fill:#6B4F28!important;font-weight:850!important}
  .rchart-axis{font-size:13px!important;fill:#9A805B!important;font-weight:650!important}
  .rchart-axis-heading{font-size:11px!important;fill:#8A704D!important;font-weight:700!important}
  .rchart-legend{font-size:13px!important;fill:#6B4F28!important;font-weight:750!important}
  .rchart-gridline{stroke:#EADDC5!important;stroke-width:1!important}
  .rchart-bar{fill:#C8A96B!important}
  .rchart-bar-track{fill:#F1E3C7!important}
  .rchart-line-a{stroke:#7A5C2E!important;stroke-width:4!important}
  .rchart-line-b{stroke:#D9B77A!important;stroke-width:4!important;stroke-dasharray:9 7!important}
  .rchart-dot-a{fill:#7A5C2E!important}
  .rchart-dot-b{fill:#D9B77A!important;stroke:#FFF8E8!important;stroke-width:3!important}
  .rchart-point-value{font-size:14px!important;font-weight:900!important}
  .rchart-dot-a-text{fill:#7A5C2E!important}.rchart-dot-b-text{fill:#7A5C2E!important}
  .rchart-footnote{font-size:10px!important;fill:#92744A!important}
  .report-donut-wrap{min-height:320px!important;gap:48px!important}
  .report-donut{width:218px!important;height:218px!important;flex-basis:218px!important;box-shadow:0 0 0 1px #EAD9B9!important}
  .report-donut>div{width:142px!important;height:142px!important;background:#FFFDF8!important;box-shadow:0 6px 24px rgba(107,79,40,.07)!important}
  .report-donut strong{font-size:38px!important;color:#6B4F28!important;font-weight:900!important;letter-spacing:-.04em!important}
  .report-donut span{font-size:10px!important;color:#92744A!important;letter-spacing:.12em!important}
  .report-legend{gap:15px!important;min-width:205px!important}
  .report-legend>div{font-size:14px!important;grid-template-columns:12px 1fr auto!important;gap:11px!important}
  .report-legend i{width:12px!important;height:12px!important;border-radius:50%!important}
  .report-legend span{color:#7A6445!important;font-weight:600!important}
  .report-legend b{font-size:15px!important;color:#6B4F28!important;font-weight:900!important}
  .report-chart-empty{min-height:340px!important;height:340px!important;font-size:14px!important;border-color:#E8D7B6!important;color:#92744A!important;background:#FFF8E8!important}
  .kol-report-page .report-chart-card{border:1px solid #F0DFBD!important;border-radius:16px!important;padding:26px 26px 24px!important;box-shadow:0 16px 45px rgba(107,79,40,.06)!important}
  .kol-report-page .report-chart-head b{font-size:17px!important;letter-spacing:-.025em!important;color:#6B4F28!important}
  .kol-report-page .report-chart-head span{font-size:12px!important;color:#92744A!important}
  .kol-report-page .report-chart-revenue .rchart-bar{fill:#B8894E!important}
  .kol-report-page .report-chart-revenue .rchart-bar-track{fill:#F1E3C7!important}
  .kol-report-page .report-chart-trend .rchart-dot-b{fill:#D9B77A!important}
  .kol-report-page .report-chart-trend .rchart-line-b{stroke:#B58B55!important}
  .kol-report-page .report-chart-svg{display:block;width:100%;max-width:100%;overflow:visible}
  @media(max-width:900px){
    .report-chart-grid{grid-template-columns:1fr!important}
    .report-chart-svg{min-height:280px!important}
    .report-donut-wrap{min-height:250px!important}
  }
  /* Final chart legibility: designed for the actual two-column report cards. */
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .report-chart-revenue .rchart-bar,.kol-report-page .rchart-bar{shape-rendering:geometricPrecision!important}
  .kol-report-page .report-chart-card{isolation:isolate!important}

  @media(max-width:560px){
    .report-chart-card{padding:16px!important}
    .report-chart-head b{font-size:14px!important}
    .rchart-value{font-size:11px!important}.rchart-label,.rchart-label-strong{font-size:10px!important}.rchart-axis{font-size:9px!important}
    .report-donut{width:150px!important;height:150px!important;flex-basis:150px!important}.report-donut>div{width:100px!important;height:100px!important}.report-donut strong{font-size:24px!important}
    .report-legend{min-width:145px!important;gap:10px!important}.report-legend>div{font-size:11px!important}.report-legend b{font-size:11px!important}
  }
 `;document.head.appendChild(s);
})();


/* REPORT UI CLEAN PASS · 20261008 · final CI alignment */
(function(){
 const styleId='kol-ids-reports-clean-pass-20261008';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  .kol-report-page{background:#f8fbfc!important;color:#172126!important}
  .kol-report-page>.hero{background:linear-gradient(135deg,#ffffff 0%,#fbfeff 72%,#f2fbfd 100%)!important;border:1px solid #d9e9ed!important;box-shadow:0 12px 36px rgba(23,33,38,.045)!important}
  .kol-report-page>.hero h2,.kol-report-page>.card .section-head h2{color:#172126!important}
  .kol-report-page>.hero .kicker,.kol-report-page>.card .section-head .label{color:#657981!important}
  .kol-report-page .report-brandline{color:#30454d!important}
  .kol-report-page .report-brandline span+span{color:#80929a!important}
  .kol-report-page .btn.cyan,.kol-report-page .pill.cyan{background:#e9faff!important;border-color:#bdebf5!important;color:#24515d!important}
  .kol-report-page>.card{background:#fff!important;border:1px solid #dfecef!important;box-shadow:0 10px 30px rgba(23,33,38,.035)!important}
  .kol-report-page .report-chart-grid{gap:16px!important}
  .kol-report-page .report-chart-card{background:#fff!important;border:1px solid #dbe9ed!important;border-top:3px solid #b8eef8!important;border-radius:16px!important;padding:20px 20px 18px!important;box-shadow:0 8px 24px rgba(23,33,38,.035)!important}
  .kol-report-page .report-chart-head{padding-bottom:12px!important;margin-bottom:8px!important;border-bottom:1px solid #e5eff2!important;display:flex!important;align-items:baseline!important;justify-content:space-between!important;gap:16px!important}
  .kol-report-page .report-chart-head b{font-size:16px!important;font-weight:800!important;color:#203139!important;letter-spacing:-.02em!important}
  .kol-report-page .report-chart-head span{font-size:11px!important;color:#80929a!important;font-weight:700!important;letter-spacing:.08em!important;text-transform:uppercase!important;white-space:nowrap!important}
  .kol-report-page .report-chart-svg{min-height:300px!important;height:auto!important;display:block!important;width:100%!important;max-width:100%!important;overflow:visible!important}
  .kol-report-page .rchart-gridline{stroke:#e4eef1!important;stroke-width:1!important}
  .kol-report-page .rchart-axis{font-size:12px!important;fill:#81939b!important;font-weight:650!important}
  .kol-report-page .rchart-label{font-size:12px!important;fill:#657981!important}
  .kol-report-page .rchart-label-strong{font-size:13px!important;fill:#30454d!important;font-weight:800!important}
  .kol-report-page .rchart-value{font-size:14px!important;fill:#263a42!important;font-weight:850!important}
  .kol-report-page .rchart-point-value{font-size:13px!important;font-weight:900!important;paint-order:stroke!important;stroke:#fff!important;stroke-width:4px!important;stroke-linejoin:round!important}
  .kol-report-page .rchart-legend{font-size:11px!important;fill:#526870!important;font-weight:800!important}
  .kol-report-page .rchart-line-a{stroke:#263a42!important;stroke-width:2.4!important}
  .kol-report-page .rchart-line-b{stroke:#9ee8f5!important;stroke-width:2.4!important;stroke-dasharray:7 6!important}
  .kol-report-page .rchart-dot-a{fill:#263a42!important}
  .kol-report-page .rchart-dot-b{fill:#9ee8f5!important;stroke:#fff!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-a-text{fill:#263a42!important}
  .kol-report-page .rchart-dot-b-text{fill:#52727b!important}
  .kol-report-page .rchart-bar{fill:#9ee8f5!important}
  .kol-report-page .rchart-bar-track{fill:#edf8fa!important}
  .kol-report-page .rchart-share{font-size:13px!important;fill:#30454d!important;font-weight:850!important}
  .kol-report-page .report-chart-empty{min-height:300px!important;height:300px!important;border-color:#dbe9ed!important;color:#80929a!important;background:#fbfeff!important}
  .kol-report-page .report-donut-wrap{min-height:290px!important;gap:34px!important}
  .kol-report-page .report-donut{box-shadow:0 0 0 1px #dbe9ed!important}
  .kol-report-page .report-donut>div{background:#fff!important;box-shadow:0 5px 20px rgba(23,33,38,.05)!important}
  .kol-report-page .report-donut strong{color:#263a42!important}
  .kol-report-page .report-donut span{color:#80929a!important}
  .kol-report-page .report-legend span{color:#657981!important}
  .kol-report-page .report-legend b{color:#30454d!important}
  .kol-report-page .evidence-status,.kol-report-page .metric,.kol-report-page .signal-box{border-color:#dfecef!important}
  @media(max-width:900px){
    .kol-report-page .report-chart-grid{grid-template-columns:1fr!important}
    .kol-report-page .report-chart-svg{min-height:270px!important}
  }
  @media(max-width:560px){
    .kol-report-page .report-chart-card{padding:16px!important}
    .kol-report-page .report-chart-head{align-items:flex-start!important;flex-direction:column!important;gap:4px!important}
    .kol-report-page .rchart-value,.kol-report-page .rchart-point-value{font-size:11px!important}
    .kol-report-page .rchart-label,.kol-report-page .rchart-label-strong{font-size:10px!important}
    .kol-report-page .rchart-axis{font-size:9px!important}
  }
 `;document.head.appendChild(s);
})();

async function boot(){styles();if(!sb){window.location.assign('/KOLIDS');return}const {data:{session}}=await sb.auth.getSession();S.session=session;if(!session){window.location.assign('/KOLIDS');return}try{await loadContext();if(!S.access){accessGate();return}await refresh();if(window.location.pathname!=='/KOLIDSworkspace'){window.history.replaceState({},'', '/KOLIDSworkspace');}shell()}catch(e){window.location.assign('/KOLIDS')}}if(sb)sb.auth.onAuthStateChange(e=>{if(e==='SIGNED_OUT'){S.session=null;window.location.assign('/KOLIDS')}});boot();
})();
/* V4 · warm Next-step treatment for creator fit action summaries */
(function(){
  const styleId='creator-fit-action-warm-v4';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
    .creator-detail-bottom>div{
      background:#fff8e9!important;
      border:1px solid #f9f1e0!important;
      color:#5b4b34!important;
      box-shadow:none!important;
      border-radius:11px!important;
    }
    .creator-detail-bottom>div>b{
      color:#171717!important;
      font-weight:900!important;
    }
    .creator-detail-bottom>div>span{
      color:#5b4b34!important;
    }
    .creator-detail-bottom>div:nth-child(3){
      background:#fff8e9!important;
      border-color:#f9f1e0!important;
    }
  `;

  document.head.appendChild(s);
})();
/* V5 · Mobile density pass: compact Creator registry + Decision cards */
(function(){
  const styleId='kol-ids-mobile-density-v5';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
@media(max-width:760px){
  /* Creator registry */
  .creator-registry-v3{padding:12px!important;border-radius:16px!important}
  .creator-registry-v3 .creator-registry-head{gap:10px!important;margin-bottom:10px!important}
  .creator-registry-v3 .creator-registry-head h2{font-size:20px!important;line-height:1.1!important}
  .creator-registry-v3 .creator-registry-head .sub{font-size:9px!important;line-height:1.45!important;margin-top:4px!important}
  .creator-header-counters{gap:5px!important;flex-wrap:wrap!important}
  .creator-count-pill{min-width:58px!important;min-height:40px!important;padding:5px 7px!important;border-radius:10px!important}
  .creator-count-pill b{font-size:14px!important}
  .creator-count-pill small{font-size:6px!important;margin-top:3px!important}
  .creator-registry-v3 .hero-actions{gap:6px!important;margin-top:8px!important;width:100%!important}
  .creator-registry-v3 .hero-actions .btn{font-size:9px!important;padding:8px 10px!important;min-height:34px!important}
  .creator-fit-list{border-radius:14px!important}
  .creator-fit-main{
    grid-template-columns:minmax(0,1fr) 62px 62px!important;
    gap:7px!important;
    padding:11px!important;
    min-height:0!important;
  }
  .creator-identity{grid-column:1/-1!important;gap:8px!important}
  .creator-check{width:18px!important;flex-basis:18px!important}
  .creator-row-avatar{width:42px!important;height:42px!important;border-radius:12px!important;flex:0 0 42px!important}
  .creator-row-name{font-size:13px!important;line-height:1.15!important;font-weight:900!important}
  .creator-handle{font-size:7px!important;margin-top:2px!important}
  .creator-mini-meta{font-size:7px!important;gap:5px!important;margin-top:4px!important}
  .creator-mini-meta span{padding-right:5px!important}
  .creator-score{grid-column:1!important;grid-row:2!important;justify-self:start!important}
  .creator-score-number{font-size:24px!important}
  .creator-score-label{font-size:7px!important;margin-top:3px!important}
  .creator-stat{padding-left:8px!important;min-width:0!important}
  .creator-stat b{font-size:17px!important}
  .creator-stat span{font-size:6.5px!important;margin-top:2px!important}
  .creator-read{grid-column:1/-1!important;grid-row:3!important;padding-top:4px!important}
  .creator-read-top{gap:5px!important}
  .decision-badge,.gap-badge{font-size:7px!important;padding:4px 6px!important}
  .creator-read p{font-size:8px!important;line-height:1.4!important;margin:5px 0 0!important}
  .creator-next{font-size:7.5px!important;line-height:1.35!important;margin-top:4px!important}
  .creator-actions-v3{grid-column:1/-1!important;grid-row:4!important;justify-content:flex-start!important;gap:5px!important;padding-top:2px!important}
  .creator-actions-v3 .btn,.social-link{font-size:8px!important;padding:7px 9px!important;border-radius:8px!important}
  .creator-fit-details{padding:9px 11px 11px!important}
  .creator-detail-grid{grid-template-columns:1fr 1fr!important;gap:6px!important;padding-top:0!important}
  .creator-detail{padding:8px!important;border-radius:9px!important}
  .creator-detail-top span{font-size:7px!important}
  .creator-detail-top b{font-size:11px!important}
  .creator-detail-bar{height:4px!important;margin:5px 0!important}
  .creator-detail p,.creator-detail-action{font-size:7px!important;line-height:1.3!important;min-height:24px!important}
  .creator-detail-action{margin-top:4px!important;padding-top:4px!important}
  .creator-detail-bottom{grid-template-columns:1fr!important;gap:6px!important;margin-top:6px!important}
  .creator-detail-bottom>div{padding:8px 9px!important;border-radius:9px!important}
  .creator-detail-bottom>div>b{font-size:7px!important}
  .creator-detail-bottom>div>span{font-size:7.5px!important;line-height:1.35!important}

  /* Decision */
  .workflow-page .decision-card{padding:12px!important;border-radius:15px!important;gap:8px!important}
  .workflow-page .decision-card>div:first-child{
    display:grid!important;
    grid-template-columns:56px minmax(0,1fr)!important;
    gap:9px!important;
    align-items:start!important;
  }
  .workflow-page .decision-card .creator-avatar{width:56px!important;height:56px!important;border-radius:13px!important}
  .workflow-page .decision-card label{gap:6px!important;min-width:0!important}
  .workflow-page .decision-card label input{width:17px!important;height:17px!important;margin:0!important;flex:0 0 17px!important}
  .workflow-page .decision-card label b{font-size:16px!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .workflow-page .decision-card .chips{gap:4px!important;margin-top:5px!important}
  .workflow-page .decision-card .chips .pill{font-size:7px!important;padding:4px 6px!important}
  .workflow-page .decision-card .reason{font-size:8px!important;line-height:1.4!important;padding:8px 9px!important;margin-top:7px!important}
  .workflow-page .decision-card .sub{font-size:8px!important;line-height:1.45!important;margin-top:6px!important}
  .workflow-page .decision-card .strategy-grid{grid-template-columns:1fr 1fr!important;gap:5px!important;margin-top:8px!important}
  .workflow-page .decision-card .decision-strategy-item{padding:8px 9px!important;min-height:48px!important;border-radius:9px!important}
  .workflow-page .decision-card .decision-strategy-label{font-size:6px!important;letter-spacing:.12em!important}
  .workflow-page .decision-card .decision-strategy-value{font-size:9px!important;line-height:1.3!important;display:block!important;margin-top:3px!important}
  .workflow-page .decision-card .adaptation-box{padding:8px 9px!important;margin-top:7px!important;border-radius:9px!important}
  .workflow-page .decision-card .adaptation-box b{font-size:8px!important}
  .workflow-page .decision-card .adaptation-box p{font-size:7.5px!important;line-height:1.4!important;margin:4px 0 0!important}
  .workflow-page .decision-card .reason+ .sub{max-width:none!important}
}
@media(max-width:420px){
  .kol-content{padding-left:9px!important;padding-right:9px!important}
  .creator-registry-v3{padding:10px!important}
  .creator-fit-main{grid-template-columns:minmax(0,1fr) 58px 58px!important;padding:10px!important}
  .creator-row-avatar{width:38px!important;height:38px!important;flex-basis:38px!important}
  .creator-row-name{font-size:12px!important}
  .creator-mini-meta{font-size:6.5px!important}
  .creator-score-number{font-size:22px!important}
  .creator-stat b{font-size:16px!important}
  .workflow-page .decision-card>div:first-child{grid-template-columns:52px minmax(0,1fr)!important;gap:8px!important}
  .workflow-page .decision-card .creator-avatar{width:52px!important;height:52px!important}
  .workflow-page .decision-card label b{font-size:15px!important}
}
`;

  document.head.appendChild(s);
})();


/* FINAL AUDIT UI · 20261001 */
(function(){
  const styleId='kol-ids-final-audit-ui-20261001';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
    .creator-detail-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:10px!important}
    .creator-detail{padding:12px!important;min-width:0!important}
    .creator-detail-top span{font-size:9px!important;font-weight:800!important}
    .creator-detail-top b{font-size:17px!important;line-height:1!important}
    .creator-detail-bar{height:6px!important;margin:8px 0!important}
    .creator-detail p{font-size:9.5px!important;line-height:1.45!important;min-height:34px!important;color:#626d75!important}
    .creator-detail-action{font-size:9.5px!important;line-height:1.4!important;min-height:34px!important;color:#315f67!important}

    .decision-strategy-item{padding:10px 11px!important;min-height:52px!important;border-radius:10px!important}
    .decision-strategy-label{font-size:7px!important;letter-spacing:.12em!important}
    .decision-strategy-value{display:block!important;margin-top:4px!important;font-size:13px!important;line-height:1.25!important;font-weight:850!important}

    .investment-memory-card{overflow:hidden}
    .investment-memory-card .memory-list{display:grid;gap:7px;margin-top:14px}
    .investment-memory-card .memory-item{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid rgba(174,239,255,.12);background:rgba(255,255,255,.025);border-radius:10px}
    .investment-memory-card .memory-item>span{font:800 9px/1 var(--mono,monospace);color:#AEEFFF;min-width:22px;padding-top:2px}
    .investment-memory-card .memory-item p{margin:0;font-size:11px;line-height:1.55;color:#e9e9ed}
    .business-learning-cards .signal-box{
      background:#fff8e8!important;border-color:#f1dfba!important;color:#6b4f28!important;box-shadow:none!important
    }
    .business-learning-cards .signal-box>b,
    .business-learning-cards .signal-box p,
    .business-learning-cards .signal-box small{color:#6b4f28!important}
    .business-learning-cards .signal-box>b{font-size:10px!important;font-weight:900!important}
    .business-learning-cards .signal-box p{font-size:11px!important;line-height:1.45!important}
    .business-learning-cards .signal-box small{font-size:9px!important;line-height:1.4!important}

    .reports-next-cards .signal-box{
      background:#fff8e8!important;border-color:#f1dfba!important;color:#6b4f28!important;box-shadow:none!important
    }
    .reports-next-cards .signal-box h4,
    .reports-next-cards .signal-box p{color:#6b4f28!important}
    .reports-next-cards .signal-box h4{font-size:10px!important;font-weight:900!important}
    .reports-next-cards .signal-box p{font-size:10px!important;line-height:1.5!important}

    html,body,#app{max-width:100%;overflow-x:hidden!important}
    .kol-main,.kol-content,.workflow-page,.card,.creator-registry-v3{min-width:0!important;max-width:100%}
    img,video,svg,canvas{max-width:100%}
    .table-wrap{max-width:100%;overflow-x:auto!important;-webkit-overflow-scrolling:touch}

    @media(max-width:900px){
      .creator-detail-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      .hero-actions{width:100%}
      .hero-actions .btn{min-height:38px}
    }
    @media(max-width:760px){
      .kol-top{height:64px!important;padding:0 12px!important;gap:8px!important}
      .top-title-wrap{min-width:0!important;flex:1 1 auto!important}
      .kol-top h1{font-size:20px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
      .top-actions{flex:0 0 auto!important;gap:5px!important}
      .top-actions .top-email{display:none!important}
      .top-actions .new-analysis-btn{padding:8px 10px!important;font-size:9px!important;white-space:nowrap!important}
      .kol-content{width:100%!important;padding:16px 10px 50px!important}
      .hero{width:100%!important}
      .hero h2{font-size:24px!important;line-height:1.08!important}
      .hero p{font-size:10px!important;line-height:1.45!important}
      .hero-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;margin-top:10px!important}
      .hero-actions .btn{width:100%!important;min-width:0!important;padding:9px 8px!important;font-size:9px!important;white-space:normal!important}
      .card{padding:13px!important;border-radius:14px!important}
      .section-head{gap:8px!important}
      .section-head h2{font-size:15px!important;line-height:1.2!important}
      .sub{font-size:9px!important;line-height:1.45!important}

      .creator-registry-head{width:100%!important}
      .creator-registry-head .hero-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .creator-header-counters{grid-column:1/-1!important;width:100%!important;display:flex!important;flex-wrap:wrap!important}
      .creator-count-pill{flex:1 1 0!important;min-width:0!important}
      .creator-detail-grid{grid-template-columns:1fr 1fr!important;gap:7px!important}
      .creator-detail{padding:9px!important}
      .creator-detail-top span{font-size:7.5px!important}
      .creator-detail-top b{font-size:14px!important}
      .creator-detail-bar{height:5px!important;margin:6px 0!important}
      .creator-detail p,.creator-detail-action{font-size:7.5px!important;line-height:1.35!important;min-height:30px!important}
      .creator-detail-bottom{grid-template-columns:1fr!important}

      .decision-strategy-item{padding:8px 9px!important;min-height:44px!important}
      .decision-strategy-label{font-size:6px!important}
      .decision-strategy-value{font-size:10px!important;line-height:1.25!important}
      .workflow-page .decision-card{width:100%!important;min-width:0!important}

      .business-learning-cards,.reports-next-cards{grid-template-columns:1fr!important}
      .investment-memory-card .grid{grid-template-columns:1fr 1fr!important}
      .investment-memory-card .memory-item{padding:9px 10px}
      .investment-memory-card .memory-item p{font-size:10px!important}
      .business-learning-cards .signal-box,.reports-next-cards .signal-box{padding:10px!important}
      .business-learning-cards .signal-box p{font-size:10px!important}
      .reports-next-cards .signal-box p{font-size:9px!important}

      .actions,.bottom-actions{display:grid!important;grid-template-columns:1fr!important;width:100%!important;gap:7px!important}
      .actions .btn,.bottom-actions .btn{width:100%!important;min-width:0!important}
      .form-grid,.signal-grid,.explain-grid,.g2,.g3,.g4,.g5{grid-template-columns:1fr!important}
      .weight-grid{grid-template-columns:1fr 1fr!important}
      .field input,.field textarea,.field select{max-width:100%!important}
    }
    @media(max-width:420px){
      .kol-content{padding-left:8px!important;padding-right:8px!important}
      .kol-top{padding-left:9px!important;padding-right:9px!important}
      .kol-top h1{font-size:18px!important}
      .mobile-menu{width:31px!important;height:31px!important;font-size:9px!important}
      .top-actions .new-analysis-btn{padding:7px 8px!important;font-size:8px!important}
      .hero h2{font-size:21px!important}
      .creator-detail-grid{grid-template-columns:1fr!important}
      .creator-detail p,.creator-detail-action{min-height:0!important}
      .creator-fit-main{width:100%!important}
    }
  `;

  document.head.appendChild(s);
})();


/* V6 · Creator mobile reference layout: spacious 3-metric / 3-action composition */
(function(){
  const styleId='kol-ids-creator-mobile-reference-v6';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style'); s.id=styleId;
  s.textContent=`
@media (max-width:900px){
  /* Keep the creator decision surface centered and deliberately narrow like the mobile reference. */
  .creator-registry-v3{
    width:min(100%,642px)!important;
    max-width:642px!important;
    margin:0 auto!important;
    padding:28px 30px 30px!important;
    border-radius:20px!important;
  }
  .creator-registry-v3 .creator-registry-head{display:flex!important;flex-direction:column!important;gap:14px!important;margin-bottom:18px!important}
  .creator-registry-v3 .creator-registry-head h2{font-size:25px!important;line-height:1.08!important;letter-spacing:-.04em!important}
  .creator-registry-v3 .creator-registry-head .sub{font-size:10px!important;line-height:1.5!important}
  .creator-registry-v3 .hero-actions{width:100%!important;display:flex!important;flex-wrap:wrap!important;gap:8px!important}
  .creator-registry-v3 .hero-actions .creator-header-counters{display:none!important}
  .creator-registry-v3 .hero-actions .btn{min-height:40px!important;padding:10px 14px!important;font-size:10px!important}

  .creator-fit-list{border-radius:16px!important;overflow:hidden!important}
  .creator-fit-list-head{display:none!important}
  .creator-fit-main{
    display:grid!important;
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:16px!important;
    padding:12px 28px 30px!important;
    min-height:0!important;
    align-items:stretch!important;
  }
  .creator-identity{
    grid-column:1/-1!important;
    display:grid!important;
    grid-template-columns:34px 112px minmax(0,1fr)!important;
    align-items:center!important;
    gap:12px!important;
    min-width:0!important;
    padding:0!important;
  }
  .creator-check{width:34px!important;flex:0 0 34px!important;display:grid!important;place-items:center!important}
  .creator-check span{width:34px!important;height:34px!important;border-radius:10px!important;border-width:0!important;background:#18252d!important}
  .creator-check input:checked+span:after{font-size:22px!important;left:6px!important;top:1px!important}
  .creator-row-avatar{width:112px!important;height:112px!important;flex:0 0 112px!important;border-radius:18px!important;font-size:26px!important}
  .creator-row-name{font-size:30px!important;line-height:1.05!important;letter-spacing:-.045em!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .creator-handle{font-size:14px!important;line-height:1.25!important;margin-top:7px!important;color:#a0a7ad!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .creator-mini-meta{font-size:14px!important;gap:9px!important;margin-top:8px!important;color:#6c767e!important;line-height:1.3!important}
  .creator-mini-meta span{padding-right:9px!important}

  /* Fit / evidence / confidence become the three large cards from the reference. */
  .creator-score,.creator-stat{
    grid-column:auto!important;
    grid-row:auto!important;
    min-width:0!important;
    min-height:142px!important;
    padding:22px 18px!important;
    border:1px solid #e1e5e8!important;
    border-radius:18px!important;
    background:#fff!important;
    display:flex!important;
    flex-direction:column!important;
    align-items:center!important;
    justify-content:center!important;
    text-align:center!important;
  }
  .creator-score{border-color:#e1e5e8!important}
  .creator-score-number{font-size:48px!important;line-height:.95!important;letter-spacing:-.07em!important}
  .creator-score-number small{font-size:16px!important;margin-left:3px!important}
  .creator-score-label{font-size:16px!important;margin-top:10px!important;font-weight:900!important;color:#66717a!important}
  .creator-stat{border-left:1px solid #e1e5e8!important;padding-left:18px!important}
  .creator-stat b{font-size:48px!important;line-height:.95!important;letter-spacing:-.06em!important}
  .creator-stat span{font-size:12px!important;letter-spacing:.16em!important;margin-top:10px!important;color:#9aa1a6!important}

  .creator-read{
    grid-column:1/-1!important;
    grid-row:auto!important;
    padding:0 0 2px!important;
    min-width:0!important;
  }
  .creator-read-top{gap:7px!important}
  .decision-badge,.gap-badge{font-size:12px!important;padding:7px 11px!important}
  .creator-read p{font-size:16px!important;line-height:1.45!important;margin:12px 0 0!important;color:#5e6971!important}
  .creator-next{font-size:16px!important;line-height:1.4!important;margin-top:8px!important;color:#2d3940!important}

  .creator-actions-v3{
    grid-column:1/-1!important;
    grid-row:auto!important;
    display:grid!important;
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:16px!important;
    justify-content:stretch!important;
    padding:0!important;
  }
  .creator-actions-v3 .btn,.creator-actions-v3 .social-link{
    width:100%!important;
    min-height:92px!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    padding:12px 10px!important;
    border-radius:18px!important;
    font-size:20px!important;
    font-weight:850!important;
  }

  .creator-fit-details{
    padding:28px 28px 30px!important;
    background:#fbfcfd!important;
    border-top:1px dashed #e2e8eb!important;
  }
  .creator-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px!important;padding-top:0!important}
  .creator-detail{
    min-height:272px!important;
    padding:20px!important;
    border-radius:18px!important;
    display:flex!important;
    flex-direction:column!important;
  }
  .creator-detail-top{font-size:18px!important;gap:8px!important}
  .creator-detail-top span{font-size:18px!important;color:#5d6870!important}
  .creator-detail-top b{font-size:34px!important;line-height:1!important}
  .creator-detail-bar{height:10px!important;margin:13px 0!important}
  .creator-detail p{font-size:16px!important;line-height:1.45!important;min-height:58px!important;margin:0!important;color:#7a838a!important}
  .creator-detail-action{font-size:16px!important;line-height:1.4!important;margin-top:auto!important;padding-top:14px!important;color:#315f67!important}
  .creator-detail-bottom{grid-template-columns:1fr!important;gap:12px!important;margin-top:16px!important}
  .creator-detail-bottom>div{padding:16px 18px!important;border-radius:14px!important}
  .creator-detail-bottom>div>b{font-size:14px!important;margin-bottom:5px!important}
  .creator-detail-bottom>div>span{font-size:14px!important;line-height:1.45!important}

  .creator-registry-v3 > div:last-child{margin-top:16px!important}
  .creator-registry-v3 > div:last-child .btn{width:100%!important;min-height:48px!important;font-size:12px!important}
}
@media (max-width:560px){
  .creator-registry-v3{padding:20px 14px 22px!important;border-radius:18px!important}
  .creator-fit-main{grid-template-columns:1fr 1fr!important;padding:12px 14px 24px!important;gap:12px!important}
  .creator-identity{grid-template-columns:32px 88px minmax(0,1fr)!important;gap:9px!important}
  .creator-check{width:32px!important;flex-basis:32px!important}.creator-check span{width:32px!important;height:32px!important}
  .creator-row-avatar{width:88px!important;height:88px!important;flex-basis:88px!important;border-radius:15px!important}
  .creator-row-name{font-size:23px!important}.creator-handle{font-size:11px!important;margin-top:5px!important}.creator-mini-meta{font-size:11px!important;gap:6px!important;margin-top:6px!important}.creator-mini-meta span{padding-right:6px!important}
  .creator-score,.creator-stat{min-height:120px!important;padding:17px 10px!important}
  .creator-score{grid-column:1/-1!important}
  .creator-score-number,.creator-stat b{font-size:40px!important}.creator-score-label{font-size:14px!important}.creator-stat span{font-size:10px!important;margin-top:8px!important}
  .creator-read p,.creator-next{font-size:13px!important}.decision-badge,.gap-badge{font-size:10px!important;padding:6px 9px!important}
  .creator-actions-v3{gap:10px!important}.creator-actions-v3 .btn,.creator-actions-v3 .social-link{min-height:70px!important;border-radius:14px!important;font-size:16px!important}
  .creator-fit-details{padding:18px 14px 22px!important}.creator-detail-grid{gap:10px!important}.creator-detail{min-height:205px!important;padding:14px!important;border-radius:14px!important}.creator-detail-top span{font-size:14px!important}.creator-detail-top b{font-size:27px!important}.creator-detail-bar{height:7px!important;margin:10px 0!important}.creator-detail p{font-size:12px!important;min-height:45px!important}.creator-detail-action{font-size:12px!important;padding-top:10px!important}.creator-detail-bottom>div{padding:13px 14px!important}.creator-detail-bottom>div>b{font-size:12px!important}.creator-detail-bottom>div>span{font-size:12px!important}
}

/* FINAL SIDEBAR TYPOGRAPHY · stage titles bold, supporting descriptions regular */
.kol-nav button .nav-copy small{font-weight:400!important;}
.kol-side.open .kol-nav .nav-copy small{font-weight:400!important;}

`;

  document.head.appendChild(s);
})();


/* REPORTS PREMIUM UI · 20261001 */
(function(){
  const styleId='kol-ids-reports-premium-20261001';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
    .kol-report-page{max-width:1320px!important;margin:0 auto!important}
    .kol-report-page>.hero{
      padding:38px 46px!important;
      margin-bottom:18px!important;
      border:1px solid #e3e6ea!important;
      border-radius:18px!important;
      background:linear-gradient(135deg,#ffffff 0%,#fbfcfd 72%,#f3fbfd 100%)!important;
      box-shadow:0 12px 36px rgba(20,22,30,.055)!important;
      align-items:center!important;
    }
    .kol-report-page>.hero>div:first-child{min-width:0!important;max-width:780px!important;padding-right:18px!important;padding-left:2px!important}
    .kol-report-page>.hero .kicker{font-size:8px!important;letter-spacing:.18em!important;font-weight:950!important;color:#5d7a84!important}
    .kol-report-page>.hero h2{font-size:30px!important;line-height:1.05!important;margin:6px 0 8px!important;letter-spacing:-.055em!important}
    .kol-report-page>.hero p{font-size:11px!important;line-height:1.7!important;color:#68727b!important;max-width:740px!important;margin:0!important;padding-right:8px!important}
    .kol-report-page>.hero .hero-actions{
      display:grid!important;
      grid-template-columns:repeat(2,minmax(150px,1fr))!important;
      gap:8px!important;
      min-width:330px!important;
      max-width:390px!important;
      padding:8px!important;
      border:1px solid #e3e6ea!important;
      border-radius:14px!important;
      background:#f7f8fa!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.9)!important;
    }
    .kol-report-page>.hero .hero-actions .btn{
      width:100%!important;
      min-height:42px!important;
      padding:10px 12px!important;
      border-radius:10px!important;
      font-size:9px!important;
      letter-spacing:-.01em!important;
      white-space:nowrap!important;
      box-shadow:none!important;
    }
    .kol-report-page>.hero .hero-actions .btn.primary{
      background:#17171b!important;
      border-color:#17171b!important;
      box-shadow:0 8px 18px rgba(20,20,25,.14)!important;
    }

    .kol-report-page>.hero .hero-actions .btn:not(.primary){
      background:#fff!important;
      color:#15171b!important;
      border-color:#dce2e6!important;
    }
    #report-campaign-intelligence-csv{background:#fff!important;color:#15171b!important;border-color:#dce2e6!important}
    .kol-report-page>.hero .hero-actions .btn:not(.primary):hover{
      border-color:#9fe9f4!important;
      box-shadow:0 6px 18px rgba(40,80,90,.07)!important;
    }
    .kol-report-page>.card{
      position:relative!important;
      overflow:hidden!important;
      border:1px solid #e3e6ea!important;
      border-radius:18px!important;
      background:#fff!important;
      box-shadow:0 10px 34px rgba(20,22,30,.045)!important;
      padding:21px 22px!important;
    }
    .kol-report-page>.card:before{
      content:"";position:absolute;left:0;top:0;bottom:0;width:3px;
      background:linear-gradient(180deg,#4fd7e8,#cceff3);opacity:.75;
    }
    .kol-report-page>.card .section-head{margin-bottom:16px!important;padding-bottom:12px!important;border-bottom:1px solid #eef0f2!important}
    .kol-report-page>.card .section-head .label{font-size:8px!important;letter-spacing:.17em!important;color:#6c858d!important}
    .kol-report-page>.card .section-head h2{font-size:18px!important;line-height:1.15!important;margin-top:4px!important}
    .kol-report-page>.card .section-head .sub{font-size:9px!important;line-height:1.55!important;max-width:900px!important}
    .kol-report-page>.card .signal-box{
      min-width:0!important;
      padding:16px!important;
      border:1px solid #e5e8eb!important;
      border-radius:13px!important;
      background:linear-gradient(180deg,#fff,#fafbfc)!important;
      box-shadow:0 5px 16px rgba(20,22,30,.035)!important;
    }
    .kol-report-page>.card .signal-box h4{
      margin:0 0 9px!important;
      font-size:10px!important;
      line-height:1.25!important;
      letter-spacing:.01em!important;
      color:#252a2f!important;
    }
    .kol-report-page>.card .signal-box p{
      margin:5px 0 0!important;
      font-size:10px!important;
      line-height:1.55!important;
      color:#626d75!important;
      overflow-wrap:anywhere!important;
    }
    .kol-report-page>.card .signal-box p b{color:#17171b!important}
    .kol-report-page>.card .table-wrap{
      border:1px solid #e2e6e9!important;
      border-radius:13px!important;
      box-shadow:none!important;
    }
    .kol-report-page>.card table{min-width:920px!important}
    .kol-report-page>.card th{
      background:#17171b!important;
      color:#d9fbff!important;
      border-bottom:0!important;
      padding:11px 12px!important;
      font-size:7px!important;
      letter-spacing:.14em!important;
    }
    .kol-report-page>.card td{padding:11px 12px!important;font-size:9px!important;vertical-align:top!important;color:#424b52!important}
    .kol-report-page>.card tbody tr:hover td{background:#fbfdfe!important}
    .kol-report-page>.card:nth-of-type(3) .signal-box,
    .kol-report-page>.card:nth-of-type(4) .signal-box{background:#f8fafb!important}
    .kol-report-page>.card .reports-next-cards .signal-box{
      background:#fff8e8!important;
      border-color:#f0dfbd!important;
      box-shadow:0 5px 16px rgba(113,78,27,.045)!important;
      min-height:126px!important;
    }
    .kol-report-page>.card .reports-next-cards .signal-box h4,
    .kol-report-page>.card .reports-next-cards .signal-box p{color:#6b4f28!important}
    .kol-report-page>.card .reports-next-cards .signal-box h4{font-size:10px!important;font-weight:900!important}
    .kol-report-page>.card .reports-next-cards .signal-box p{font-size:10px!important;line-height:1.55!important}
    .kol-report-page>.card .pill{font-size:8px!important;padding:5px 8px!important}
    .kol-report-page>.card .empty{padding:18px!important;border:1px dashed #dfe3e6!important;border-radius:12px!important;color:#7b838a!important;background:#fafbfc!important;font-size:10px!important}
    @media(max-width:900px){
      .kol-report-page>.hero{align-items:flex-start!important;flex-direction:column!important}
      .kol-report-page>.hero .hero-actions{width:100%!important;max-width:none!important;min-width:0!important}
      .kol-report-page>.card{padding:16px!important}
    }
    /* Final chart legibility: designed for the actual two-column report cards. */
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .report-chart-revenue .rchart-bar,.kol-report-page .rchart-bar{shape-rendering:geometricPrecision!important}
  .kol-report-page .report-chart-card{isolation:isolate!important}

  @media(max-width:560px){
      .kol-report-page>.hero{padding:16px!important;border-radius:15px!important}
      .kol-report-page>.hero h2{font-size:24px!important}
      .kol-report-page>.hero p{font-size:9px!important}
      .kol-report-page>.hero .hero-actions{grid-template-columns:1fr 1fr!important;gap:6px!important;padding:6px!important}
      .kol-report-page>.hero .hero-actions .btn{min-height:40px!important;padding:8px 6px!important;font-size:8px!important;white-space:normal!important}
      .kol-report-page>.card{padding:13px!important;border-radius:14px!important}
      .kol-report-page>.card .section-head h2{font-size:15px!important}
      .kol-report-page>.card .section-head .sub{font-size:8.5px!important}
      .kol-report-page>.card .signal-box{padding:12px!important}
      .kol-report-page>.card .signal-box h4{font-size:9px!important}
      .kol-report-page>.card .signal-box p{font-size:9px!important}
      .kol-report-page>.card .reports-next-cards .signal-box{min-height:0!important}
    }
  `;

  document.head.appendChild(s);
})();



/* REPORTS VISUAL INTELLIGENCE · 20261006 */
(function(){
 const styleId='kol-ids-reports-visuals-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
 .report-chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
 .report-chart-card{min-width:0;border:1px solid #e3e7ea;border-radius:14px;background:linear-gradient(180deg,#fff,#fafcfd);padding:14px;overflow:hidden}
 .report-chart-head{display:flex;justify-content:space-between;gap:10px;align-items:baseline;margin-bottom:5px}
 .report-chart-head b{font-size:10px;color:#17171b}
 .report-chart-head span{font-size:8px;color:#7a858c}
 .report-chart-svg{width:100%;height:auto;display:block}
 .rchart-title{font-size:8px;fill:#6d7880;font-weight:700}
 .rchart-value{font-size:8px;fill:#17171b;font-weight:800}
 .rchart-label{font-size:7px;fill:#78838a}
 .rchart-legend{font-size:7px;fill:#78838a}
 .report-chart-empty{height:180px;display:grid;place-items:center;border:1px dashed #dfe4e7;border-radius:10px;color:#8a949b;font-size:9px}
 .report-donut-wrap{min-height:205px;display:flex;align-items:center;justify-content:center;gap:22px}
 .report-donut{width:142px;height:142px;border-radius:50%;display:grid;place-items:center;flex:0 0 142px}
 .report-donut>div{width:86px;height:86px;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center}
 .report-donut strong{font-size:20px;color:#17171b}
 .report-donut span{font-size:7px;color:#7a858c;letter-spacing:.08em;text-transform:uppercase}
 .report-legend{display:grid;gap:9px;min-width:130px}
 .report-legend>div{display:grid;grid-template-columns:9px 1fr auto;gap:7px;align-items:center;font-size:8px}
 .report-legend i{width:8px;height:8px;border-radius:2px}
 .report-legend span{color:#69747b}.report-legend b{color:#17171b}
 @media(max-width:900px){.report-chart-grid{grid-template-columns:1fr}}
 @media(max-width:560px){.report-chart-card{padding:10px}.report-donut-wrap{min-height:180px;gap:12px}.report-donut{width:118px;height:118px;flex-basis:118px}.report-donut>div{width:72px;height:72px}.report-donut strong{font-size:17px}.report-legend{min-width:100px;gap:7px}}
 `;
 document.head.appendChild(s);
})();

/* REPORTS ENTERPRISE VISUAL SYSTEM · 20261006 */
(function(){
 const styleId='kol-ids-reports-enterprise-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
 .kol-report-page,.kol-report-page *{font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important}
 .kol-report-page{font-size:13px!important;color:#20262b!important;letter-spacing:0!important}
 .kol-report-page>.hero{padding:42px 48px!important;border-radius:20px!important;background:linear-gradient(135deg,#fff 0%,#fbfcfd 58%,#f1fbfd 100%)!important}
 .kol-report-page>.hero h2{font-size:34px!important;line-height:1.08!important;letter-spacing:-.045em!important;font-weight:800!important}
 .kol-report-page>.hero p{font-size:13px!important;line-height:1.7!important;color:#59656d!important}
 .kol-report-page>.hero .kicker,.kol-report-page>.card .section-head .label{font-size:10px!important;letter-spacing:.16em!important;font-weight:800!important}
 .kol-report-page>.card{padding:26px 28px!important;border-radius:18px!important}
 .kol-report-page>.card .section-head h2{font-size:22px!important;line-height:1.2!important;letter-spacing:-.025em!important;font-weight:780!important}
 .kol-report-page>.card .section-head .sub{font-size:12px!important;line-height:1.6!important;color:#68747c!important}
 .kol-report-page>.card .signal-box{padding:18px!important;border-radius:14px!important}
 .kol-report-page>.card .signal-box h4{font-size:13px!important;font-weight:750!important}
 .kol-report-page>.card .signal-box p{font-size:12px!important;line-height:1.65!important;color:#556169!important}
 .kol-report-page>.card th{font-size:10px!important;letter-spacing:.08em!important;padding:13px 14px!important;white-space:nowrap!important}
 .kol-report-page>.card td{font-size:12px!important;line-height:1.5!important;padding:13px 14px!important}
 .kol-report-page>.card .metric{padding:18px!important;border:1px solid #e3e7ea!important;border-radius:14px!important;background:#fbfcfd!important}
 .kol-report-page>.card .metric .label{font-size:10px!important;letter-spacing:.08em!important;font-weight:750!important}
 .kol-report-page>.card .metric strong{font-size:28px!important;line-height:1.05!important;letter-spacing:-.035em!important}
 .kol-report-page>.card .metric small{font-size:11px!important;line-height:1.45!important;color:#707b82!important}
 .report-chart-grid{gap:16px!important}
 .report-chart-card{padding:18px!important;border-radius:16px!important;background:#fff!important;box-shadow:0 8px 24px rgba(20,30,35,.035)!important}
 .report-chart-head{margin-bottom:12px!important}
 .report-chart-head b{font-size:13px!important;font-weight:750!important}
 .report-chart-head span{font-size:10px!important;color:#78838a!important}
 .report-chart-svg{min-height:230px!important}
 .rchart-title{font-size:11px!important;fill:#65727a!important;font-weight:750!important}
 .rchart-value{font-size:11px!important;fill:#1b2024!important;font-weight:800!important}
 .rchart-label{font-size:10px!important;fill:#707b82!important}
 .rchart-label-strong{font-size:11px!important;fill:#4d5960!important;font-weight:650!important}
 .rchart-axis{font-size:9px!important;fill:#8a949b!important}
 .rchart-legend{font-size:10px!important;fill:#657078!important}
 .rchart-gridline{stroke:#edf0f2!important;stroke-width:1!important}
 .rchart-bar{fill:#17171b!important}
 .rchart-line-a{stroke:#17171b!important;stroke-width:3!important;stroke-linecap:round!important;stroke-linejoin:round!important}
 .rchart-line-b{stroke:#63cbd9!important;stroke-width:3!important;stroke-linecap:round!important;stroke-linejoin:round!important}
 .rchart-dot-a{fill:#17171b!important}.rchart-dot-b{fill:#63cbd9!important}
 .report-chart-empty{height:230px!important;font-size:12px!important;color:#7b868d!important;background:#fbfcfd!important}
 .report-donut-wrap{min-height:240px!important;gap:30px!important}
 .report-donut{width:166px!important;height:166px!important;flex-basis:166px!important}
 .report-donut>div{width:104px!important;height:104px!important}
 .report-donut strong{font-size:25px!important;font-weight:800!important}
 .report-donut span{font-size:9px!important}
 .report-legend{gap:12px!important;min-width:170px!important}
 .report-legend>div{font-size:11px!important;grid-template-columns:10px 1fr auto!important;gap:9px!important}
 .report-legend b{font-size:11px!important}
 .evidence-status-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:16px}
 .evidence-status{padding:13px 14px;border-radius:12px;border:1px solid #e2e7e9;background:#fafbfc;display:flex;flex-direction:column;gap:5px}
 .evidence-status b{font-size:9px;letter-spacing:.08em}
 .evidence-status span{font-size:11px;color:#59656d}
 .evidence-status.is-present{border-color:#cfecef;background:#f5fcfd}
 .evidence-status.is-present b{color:#167584}
 .evidence-status.is-missing{border-color:#e5e7e9;background:#fafafa}
 .evidence-status.is-missing b{color:#8a9298}
 @media(max-width:900px){.evidence-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.kol-report-page>.hero{padding:30px!important}}
 @media(max-width:560px){.kol-report-page>.hero{padding:22px!important}.kol-report-page>.hero h2{font-size:27px!important}.kol-report-page>.hero p{font-size:12px!important}.kol-report-page>.card{padding:18px!important}.kol-report-page>.card .section-head h2{font-size:19px!important}.kol-report-page>.card .section-head .sub{font-size:11px!important}.kol-report-page>.card .signal-box p{font-size:11px!important}.kol-report-page>.card th{font-size:9px!important}.kol-report-page>.card td{font-size:11px!important}.evidence-status-grid{grid-template-columns:1fr 1fr}.evidence-status span{font-size:10px!important}.report-donut-wrap{gap:14px!important}.report-donut{width:128px!important;height:128px!important;flex-basis:128px!important}.report-donut>div{width:80px!important;height:80px!important}.report-donut strong{font-size:20px!important}.report-legend{min-width:110px!important}.report-legend>div{font-size:9px!important}}
 `;
 document.head.appendChild(s);
})();

/* FINAL MOBILE CREATOR FIT · 3-UP METRICS / COMPACT REFERENCE */
(function(){
  const styleId='kol-ids-creator-mobile-3up-final';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style'); s.id=styleId;
  s.textContent=`
@media (max-width:560px){
  .creator-registry-v3{
    width:100%!important;max-width:100%!important;margin:0 auto!important;
    padding:14px 10px 18px!important;border-radius:16px!important;
  }
  .creator-fit-main{
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:9px!important;padding:12px 12px 18px!important;
  }
  .creator-identity{
    grid-column:1/-1!important;
    grid-template-columns:30px 76px minmax(0,1fr)!important;
    gap:8px!important;
  }
  .creator-check,.creator-check span{width:30px!important;height:30px!important;flex-basis:30px!important}
  .creator-check input:checked+span:after{font-size:18px!important;left:5px!important;top:2px!important}
  .creator-row-avatar{width:76px!important;height:76px!important;flex-basis:76px!important;border-radius:14px!important}
  .creator-row-name{font-size:21px!important;line-height:1.05!important;letter-spacing:-.035em!important}
  .creator-handle{font-size:10px!important;margin-top:4px!important}
  .creator-mini-meta{font-size:10px!important;gap:5px!important;margin-top:5px!important;line-height:1.25!important}
  .creator-mini-meta span{padding-right:5px!important}

  .creator-score,.creator-stat{
    grid-column:auto!important;grid-row:auto!important;
    min-width:0!important;min-height:82px!important;
    padding:12px 6px!important;border:1px solid #e1e5e8!important;
    border-radius:14px!important;background:#fff!important;
  }
  .creator-score{align-items:center!important;justify-content:center!important;text-align:center!important}
  .creator-stat{align-items:center!important;justify-content:center!important;text-align:center!important;border-left:1px solid #e1e5e8!important;padding-left:6px!important}
  .creator-score-number,.creator-stat b{font-size:31px!important;line-height:.95!important;letter-spacing:-.06em!important}
  .creator-score-number small{font-size:10px!important;margin-left:2px!important}
  .creator-score-label{font-size:10px!important;margin-top:6px!important}
  .creator-stat span{font-size:8px!important;letter-spacing:.12em!important;margin-top:6px!important}

  .creator-read{grid-column:1/-1!important;padding:1px 0 0!important}
  .creator-read-top{gap:5px!important}
  .decision-badge,.gap-badge{font-size:9px!important;padding:5px 8px!important}
  .creator-read p{font-size:12px!important;line-height:1.4!important;margin:8px 0 0!important}
  .creator-next{font-size:12px!important;line-height:1.35!important;margin-top:5px!important}

  .creator-actions-v3{
    grid-column:1/-1!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:8px!important;padding:0!important;
  }
  .creator-actions-v3 .btn,.creator-actions-v3 .social-link{
    width:100%!important;min-width:0!important;min-height:62px!important;
    padding:8px 5px!important;border-radius:13px!important;font-size:13px!important;
  }

  .creator-fit-details{padding:14px 12px 18px!important}
  .creator-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
  .creator-detail{min-height:174px!important;padding:12px!important;border-radius:13px!important}
  .creator-detail-top span{font-size:11px!important}
  .creator-detail-top b{font-size:24px!important}
  .creator-detail-bar{height:6px!important;margin:8px 0!important}
  .creator-detail p{font-size:10.5px!important;line-height:1.35!important;min-height:38px!important}
  .creator-detail-action{font-size:10.5px!important;line-height:1.35!important;padding-top:8px!important;margin-top:5px!important}
  .creator-detail-bottom{grid-template-columns:1fr!important;gap:8px!important;margin-top:10px!important}
  .creator-detail-bottom>div{padding:10px 11px!important;border-radius:11px!important}
  .creator-detail-bottom>div>b{font-size:10px!important}
  .creator-detail-bottom>div>span{font-size:10px!important;line-height:1.35!important}
}
@media (max-width:390px){
  .creator-registry-v3{padding-left:8px!important;padding-right:8px!important}
  .creator-fit-main{gap:7px!important;padding-left:9px!important;padding-right:9px!important}
  .creator-identity{grid-template-columns:28px 68px minmax(0,1fr)!important;gap:7px!important}
  .creator-check,.creator-check span{width:28px!important;height:28px!important;flex-basis:28px!important}
  .creator-row-avatar{width:68px!important;height:68px!important;flex-basis:68px!important;border-radius:13px!important}
  .creator-row-name{font-size:19px!important}
  .creator-handle,.creator-mini-meta{font-size:9px!important}
  .creator-score,.creator-stat{min-height:76px!important;padding:10px 4px!important}
  .creator-score-number,.creator-stat b{font-size:28px!important}
  .creator-score-label{font-size:9px!important}.creator-stat span{font-size:7px!important}
  .creator-actions-v3{gap:6px!important}
  .creator-actions-v3 .btn,.creator-actions-v3 .social-link{min-height:58px!important;font-size:12px!important}
  .creator-detail-grid{gap:7px!important}
  .creator-detail{min-height:165px!important;padding:10px!important}
  .creator-detail-top span{font-size:10px!important}.creator-detail-top b{font-size:22px!important}
  .creator-detail p,.creator-detail-action{font-size:9.5px!important}
}
`;

  document.head.appendChild(s);
})();

/* ENTERPRISE PERFORMANCE + BUSINESS IMPACT UI · 20261001 */

/* ENTERPRISE PERFORMANCE + BUSINESS IMPACT UI · 20261001 */
(function(){
  const styleId='kol-ids-enterprise-performance-impact-ui-20261001';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
  /* ---------- Performance desktop ---------- */
  .performance-type-picker{
    background:linear-gradient(180deg,#fbfeff 0%,#f7fbfc 100%)!important;
    border:1px solid #d9e9ed!important;
    box-shadow:0 8px 24px rgba(20,45,55,.035)!important;
  }
  .performance-type-picker .section-head{margin-bottom:12px!important}
  .performance-type-picker .type-grid{gap:10px!important}
  .performance-type-option{
    min-height:64px!important;
    padding:12px 14px!important;
    border-radius:12px!important;
    border-color:#dce5e8!important;
    transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease!important;
  }
  .performance-type-option:hover{transform:translateY(-1px);border-color:#b9dce4;box-shadow:0 8px 20px rgba(24,80,92,.07)}
  .performance-type-option:has(input:checked){border-color:#8ecfdc;background:#f3fcfe;box-shadow:inset 0 0 0 1px #8ecfdc,0 8px 20px rgba(24,80,92,.06)}
  .performance-type-option b{font-size:11px!important;font-weight:900!important}
  .performance-type-option small{font-size:8.5px!important;line-height:1.4!important}

  .performance-entry-section,.ecommerce-panel,.gen-code-panel{
    border-color:#dfe7ea!important;
    box-shadow:0 8px 28px rgba(20,30,40,.035)!important;
  }
  .performance-entry-section .section-head,.ecommerce-panel .section-head{margin-bottom:12px!important}
  .performance-entry-section .form-grid,.ecommerce-panel .form-grid{gap:10px!important}
  .performance-entry-section .field,.ecommerce-panel .field{min-width:0!important}
  .performance-entry-section .field input,
  .performance-entry-section .field select,
  .performance-entry-section .field textarea,
  .ecommerce-panel .field input,
  .ecommerce-panel .field select,
  .ecommerce-panel .field textarea{
    border-color:#dce4e8!important;
    border-radius:10px!important;
    min-height:40px!important;
    background:#fff!important;
  }
  .performance-entry-section .field textarea,.ecommerce-panel .field textarea{min-height:88px!important}
  .performance-entry-section .field input:focus,
  .performance-entry-section .field select:focus,
  .performance-entry-section .field textarea:focus,
  .ecommerce-panel .field input:focus,
  .ecommerce-panel .field select:focus,
  .ecommerce-panel .field textarea:focus{border-color:#8ecfdc!important;box-shadow:0 0 0 3px rgba(174,239,255,.24)!important;outline:0!important}
  .performance-entry-section .actions,.ecommerce-panel .actions,.gen-code-panel .actions{align-items:center!important}
  .performance-entry-section .actions .btn,.ecommerce-panel .actions .btn,.gen-code-panel .actions .btn{min-height:40px!important}

  .gen-code-panel{background:linear-gradient(180deg,#fff 0%,#fbfdfe 100%)!important}
  .gen-code-panel .table-wrap,.gen-code-table .table-wrap{border:1px solid #e0e7ea!important;border-radius:12px!important;box-shadow:none!important}
  .gen-code-panel table th,.gen-code-table table th{background:#17181c!important;color:#aeefff!important;font-size:8px!important;letter-spacing:.08em!important}
  .gen-code-panel table td,.gen-code-table table td{font-size:9px!important;padding:10px!important}
  .gen-code-panel .footer-note{font-size:8px!important;line-height:1.5!important;color:#78858c!important}

  /* Recorded outcomes */
  .performance-entry-section ~ .card .table-wrap,
  .card:has([data-edit-performance]) .table-wrap{border:1px solid #e0e7ea!important;border-radius:12px!important;box-shadow:none!important}
  .card:has([data-edit-performance]) table th{background:#17181c!important;color:#aeefff!important;font-size:8px!important;letter-spacing:.08em!important}
  .card:has([data-edit-performance]) table td{font-size:9px!important;padding:10px 9px!important;vertical-align:middle!important}
  .card:has([data-edit-performance]) table td .actions{display:flex!important;gap:6px!important;align-items:center!important}
  .card:has([data-edit-performance]) table td .actions .btn{min-height:32px!important;padding:7px 10px!important;white-space:nowrap!important}

  /* ---------- Business Impact ---------- */
  [data-kol-business-impact="1"] .hero{margin-bottom:4px!important}
  [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric{
    background:linear-gradient(180deg,#fff 0%,#fbfcfd 100%)!important;
    border:1px solid #e0e7ea!important;
    border-radius:14px!important;
    box-shadow:0 8px 24px rgba(20,30,40,.035)!important;
  }
  [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric strong{font-size:25px!important;letter-spacing:-.035em!important}
  [data-kol-business-impact="1"] .card{border-color:#e0e7ea!important;box-shadow:0 8px 28px rgba(20,30,40,.03)!important}
  [data-kol-business-impact="1"] .mini-stat{font-size:21px!important;font-weight:900!important;letter-spacing:-.025em!important}
  [data-kol-business-impact="1"] .signal-box{border-color:#e0e7ea!important;border-radius:12px!important}
  [data-kol-business-impact="1"] .business-learning-cards .signal-box{
    min-height:118px!important;
    display:flex!important;
    flex-direction:column!important;
    justify-content:flex-start!important;
    background:#fff8e8!important;
    border-color:#f0dfbd!important;
  }
  [data-kol-business-impact="1"] .business-learning-cards .signal-box>b{font-size:11px!important;letter-spacing:.01em!important}
  [data-kol-business-impact="1"] .business-learning-cards .signal-box p{font-size:12px!important;line-height:1.5!important;margin:9px 0 5px!important}
  [data-kol-business-impact="1"] .business-learning-cards .signal-box small{font-size:9px!important;line-height:1.45!important}
  [data-kol-business-impact="1"] #learning-form textarea{min-height:110px!important;border-radius:11px!important;border-color:#dce4e8!important}
  [data-kol-business-impact="1"] #learning-form textarea:focus{border-color:#c7b078!important;box-shadow:0 0 0 3px rgba(255,228,167,.28)!important;outline:0!important}
  [data-kol-business-impact="1"] #learning-form .actions{margin-top:12px!important}
  [data-kol-business-impact="1"] .bottom-actions{margin-top:16px!important;align-items:center!important}
  [data-kol-business-impact="1"] .bottom-actions .btn{min-height:40px!important}

  /* ---------- Mobile: keep every control inside viewport ---------- */
  @media(max-width:760px){
    .performance-type-picker .type-grid{grid-template-columns:1fr 1fr!important;gap:7px!important}
    .performance-type-option{min-height:56px!important;padding:9px 10px!important;align-items:flex-start!important}
    .performance-type-option b{font-size:9px!important;line-height:1.25!important}
    .performance-type-option small{font-size:7px!important;line-height:1.35!important;margin-top:2px!important}
    .performance-type-option input{width:14px!important;height:14px!important;flex:0 0 14px!important;margin-top:1px!important}
    .performance-type-option:last-child{grid-column:1/-1}

    .performance-entry-section,.ecommerce-panel,.gen-code-panel{padding:12px!important}
    .performance-entry-section .section-head,.ecommerce-panel .section-head,.gen-code-panel .section-head{margin-bottom:9px!important}
    .performance-entry-section .section-head h2,.ecommerce-panel .section-head h2,.gen-code-panel .section-head h2{font-size:14px!important}
    .performance-entry-section .field label,.ecommerce-panel .field label,.gen-code-panel .field label{font-size:8px!important}
    .performance-entry-section .field input,
    .performance-entry-section .field select,
    .performance-entry-section .field textarea,
    .ecommerce-panel .field input,
    .ecommerce-panel .field select,
    .ecommerce-panel .field textarea,
    .gen-code-panel .field input,
    .gen-code-panel .field select{width:100%!important;min-width:0!important;box-sizing:border-box!important}
    .performance-entry-section .actions,.ecommerce-panel .actions,.gen-code-panel .actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important}
    .performance-entry-section .actions .btn,.ecommerce-panel .actions .btn,.gen-code-panel .actions .btn{width:100%!important;min-width:0!important;padding:9px 7px!important;font-size:8px!important;white-space:normal!important}

    .gen-code-panel .form-grid{grid-template-columns:1fr!important}
    .gen-code-panel .form-grid .field.full{grid-column:1!important}
    .gen-code-individual-table{min-width:590px!important}
    .gen-code-table .table-wrap,.gen-code-panel .table-wrap{max-width:100%!important;overflow-x:auto!important}

    .card:has([data-edit-performance]) .table-wrap{margin-left:-2px!important;margin-right:-2px!important}
    .card:has([data-edit-performance]) table{min-width:760px!important}
    .card:has([data-edit-performance]) table td .actions{flex-wrap:nowrap!important}
    .card:has([data-edit-performance]) table td .actions .btn{font-size:8px!important;padding:7px 9px!important}

    [data-kol-business-impact="1"] > .grid.g4:first-of-type{grid-template-columns:1fr 1fr!important;gap:7px!important}
    [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric{padding:10px!important;border-radius:11px!important}
    [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric strong{font-size:19px!important}
    [data-kol-business-impact="1"] .mini-stat{font-size:18px!important}
    [data-kol-business-impact="1"] .business-learning-cards{grid-template-columns:1fr!important;gap:7px!important}
    [data-kol-business-impact="1"] .business-learning-cards .signal-box{min-height:0!important;padding:11px!important}
    [data-kol-business-impact="1"] .business-learning-cards .signal-box p{font-size:10px!important;line-height:1.45!important}
    [data-kol-business-impact="1"] .business-learning-cards .signal-box small{font-size:8px!important}
    [data-kol-business-impact="1"] #learning-form textarea{min-height:96px!important}
    [data-kol-business-impact="1"] .bottom-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important}
    [data-kol-business-impact="1"] .bottom-actions .btn{width:100%!important;min-width:0!important;padding:9px 7px!important;font-size:8px!important;white-space:normal!important}
  }
  @media(max-width:420px){
    .performance-type-picker .type-grid{grid-template-columns:1fr!important}
    .performance-type-option:last-child{grid-column:auto}
    .performance-type-option{min-height:48px!important}
    .performance-entry-section .actions,.ecommerce-panel .actions,.gen-code-panel .actions{grid-template-columns:1fr!important}
    [data-kol-business-impact="1"] > .grid.g4:first-of-type{grid-template-columns:1fr 1fr!important}
    [data-kol-business-impact="1"] .bottom-actions{grid-template-columns:1fr!important}
  }
`;

  document.head.appendChild(s);
})();


/* FINAL PREMIUM TECH UI · 20261003 */
(function(){
  const styleId='kol-ids-premium-tech-20261003';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style'); s.id=styleId;
  s.textContent=`
    :root{
      --kol-cyan:#aeefff;
      --kol-cyan-strong:#4fd7e8;
      --kol-gold:#c8a96b;
      --kol-ink:#101114;
      --kol-surface:#ffffff;
      --kol-border:#dfe5e9;
      --kol-shadow:0 18px 55px rgba(18,25,32,.065);
    }
    body{
      background:
        radial-gradient(850px 420px at 78% -8%,rgba(174,239,255,.18),transparent 62%),
        radial-gradient(700px 360px at 18% 18%,rgba(200,169,107,.055),transparent 64%),
        linear-gradient(180deg,#fafbfc 0%,#f1f3f5 100%)!important;
    }
    .kol-side{
      background:linear-gradient(180deg,#111216 0%,#17181c 52%,#101114 100%)!important;
      border-right:1px solid rgba(255,255,255,.055)!important;
      box-shadow:14px 0 50px rgba(0,0,0,.08)!important;
    }
    .kol-brand{border-bottom:1px solid rgba(255,255,255,.09);margin-bottom:10px!important}
    .kol-logo{background:linear-gradient(145deg,#f7ffff,#aeefff 48%,#4fd7e8)!important;box-shadow:0 8px 32px rgba(79,215,232,.18)!important}
    .kol-top{
      background:rgba(255,255,255,.98)!important;
      border-bottom:1px solid #e3e7ea!important;
      box-shadow:0 8px 28px rgba(20,25,30,.045)!important;
    }
    .kol-top:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(79,215,232,.5) 30%,rgba(200,169,107,.35) 70%,transparent 100%);pointer-events:none}
    .kol-content{padding-top:34px!important}
    .hero h2{font-size:34px!important;letter-spacing:-.06em!important}
    .hero .kicker,.kicker{color:#71818a!important;letter-spacing:.2em!important}
    .card{
      background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(250,252,253,.96))!important;
      border-color:var(--kol-border)!important;
      box-shadow:var(--kol-shadow)!important;
      position:relative;
    }
    .card:before{content:"";position:absolute;left:18px;right:18px;top:0;height:1px;background:linear-gradient(90deg,rgba(79,215,232,.0),rgba(79,215,232,.36),rgba(200,169,107,.22),rgba(79,215,232,0));opacity:.75}
    .metric{
      background:linear-gradient(180deg,#fff,#f8fafb)!important;
      border:1px solid #dfe6e9!important;
      box-shadow:0 12px 34px rgba(18,25,32,.05)!important;
      border-radius:15px!important;
      position:relative;
      overflow:hidden;
    }
    .metric:after{content:"";position:absolute;right:-36px;top:-42px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(174,239,255,.2),transparent 68%);pointer-events:none}
    .metric strong{letter-spacing:-.045em!important}
    .label{letter-spacing:.16em!important;color:#75848c!important}
    .section-head h2,.section-head h3{letter-spacing:-.035em!important}
    .signal-box{
      background:linear-gradient(180deg,#fff,#fbfcfd)!important;
      border-color:#e0e6e9!important;
      box-shadow:0 8px 25px rgba(18,25,32,.025)!important;
    }
    .btn{
      border-color:#d6dfe3!important;
      background:#fff!important;
      color:#17181b!important;
      box-shadow:0 5px 16px rgba(18,25,32,.035)!important;
      transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease!important;
    }
    .btn:hover{transform:translateY(-1px);border-color:#a8d7df!important;box-shadow:0 9px 24px rgba(18,25,32,.075)!important}
    .btn.primary{background:linear-gradient(135deg,#111216,#22252a)!important;color:#aeefff!important;border-color:#111216!important;box-shadow:0 10px 28px rgba(17,18,22,.16)!important}
    .btn.primary:hover{border-color:#4fd7e8!important}
    .pill.cyan{background:#effcff!important;color:#1c6672!important;border-color:#c8edf3!important}
    .table-wrap{border-color:#dfe6e9!important;box-shadow:0 10px 30px rgba(18,25,32,.035)!important}
    table th{background:linear-gradient(180deg,#15161a,#1b1c20)!important;color:#aeefff!important;letter-spacing:.11em!important}
    table td{border-color:#edf0f2!important}
    table tbody tr:hover{background:#f7fbfc!important}
    code{border:1px solid #dbe8eb!important;background:#f4fbfc!important;color:#21616c!important}
    input:focus,select:focus,textarea:focus{border-color:#8bcbd7!important;box-shadow:0 0 0 3px rgba(174,239,255,.22)!important}
    .empty{border-color:#dce5e8!important;background:linear-gradient(180deg,#fbfcfd,#f6f8f9)!important;color:#76848b!important}
    .side-foot{background:linear-gradient(180deg,#1b1c20,#17181c)!important;border-color:#2d3035!important;box-shadow:0 10px 30px rgba(0,0,0,.14)!important}
    [data-kol-business-impact="1"] .business-learning-cards .signal-box{background:linear-gradient(180deg,#fffaf0,#fff7e7)!important;border-color:#ead9b7!important}
    [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric:first-child{border-top:2px solid rgba(200,169,107,.58)!important}
    [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric:nth-child(3){border-top:2px solid rgba(79,215,232,.5)!important}
    [data-kol-report-page="1"] .hero{padding:34px 40px!important;margin-bottom:18px!important}
    .workflow-page > .card{margin-bottom:14px}
    .workflow-page > .card:last-child{margin-bottom:0}
    .workflow-page .section-head{align-items:flex-start}
    .workflow-page .section-head h2{line-height:1.2}
    .workflow-page .section-head .sub{max-width:920px}
    [data-kol-report-page="1"] .metric{min-height:128px}
    [data-kol-report-page="1"] .metric small{line-height:1.45}
    [data-kol-report-page="1"] .metric strong{font-size:29px!important}
    [data-kol-report-page="1"] .card{scroll-margin-top:100px}
    .performance-type-option{background:linear-gradient(180deg,#fff,#f8fafb)!important}
    .performance-type-option:has(input:checked){background:linear-gradient(180deg,#f5fdff,#edfafd)!important;border-color:#83cbd7!important;box-shadow:inset 0 0 0 1px #83cbd7,0 12px 25px rgba(79,215,232,.08)!important}
    .gen-code-badge{box-shadow:0 5px 16px rgba(18,25,32,.035)!important}
    @media(max-width:900px){
      .kol-top{height:76px!important;padding:0 20px!important}
      .kol-content{padding:24px 20px 60px!important}
      .hero h2{font-size:29px!important}
    }
    /* Final chart legibility: designed for the actual two-column report cards. */
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .report-chart-revenue .rchart-bar,.kol-report-page .rchart-bar{shape-rendering:geometricPrecision!important}
  .kol-report-page .report-chart-card{isolation:isolate!important}

  @media(max-width:560px){
      .kol-top{padding:0 12px!important}
      .kol-content{padding:18px 10px 45px!important}
      .hero{gap:12px!important;margin-bottom:14px!important}
      .hero h2{font-size:24px!important}
      .card{border-radius:14px!important;padding:14px!important}
      .card:before{left:12px;right:12px}
      .metric{border-radius:12px!important}
      .metric strong{font-size:22px!important}
      .top-actions{gap:5px!important}
      .top-chip{padding:7px 8px!important;font-size:8px!important}
    }
  `;

  document.head.appendChild(s);
})();

/* FINAL CREATOR MOBILE COMPACT + EQUAL BOXES · 20261001 */
(function(){
  const styleId='kol-ids-creator-mobile-compact-equal-20261001';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style'); s.id=styleId;
  s.textContent=`
  /* Final chart legibility: designed for the actual two-column report cards. */
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .report-chart-revenue .rchart-bar,.kol-report-page .rchart-bar{shape-rendering:geometricPrecision!important}
  .kol-report-page .report-chart-card{isolation:isolate!important}

  @media(max-width:560px){
    .creator-fit-main{
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:8px!important;
      padding:10px 10px 14px!important;
    }
    .creator-score,.creator-stat{
      width:100%!important;
      min-width:0!important;
      min-height:72px!important;
      height:72px!important;
      padding:8px 4px!important;
      border-radius:12px!important;
      box-sizing:border-box!important;
    }
    .creator-score-number,.creator-stat b{
      font-size:27px!important;
      line-height:.92!important;
    }
    .creator-score-number small{font-size:9px!important;margin-left:2px!important}
    .creator-score-label{font-size:9px!important;margin-top:5px!important}
    .creator-stat span{font-size:7px!important;letter-spacing:.1em!important;margin-top:5px!important}
    .creator-actions-v3{
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:7px!important;
      width:100%!important;
    }
    .creator-actions-v3 .btn,.creator-actions-v3 .social-link{
      width:100%!important;
      min-width:0!important;
      min-height:52px!important;
      height:52px!important;
      padding:7px 4px!important;
      border-radius:11px!important;
      box-sizing:border-box!important;
      font-size:12px!important;
      font-weight:700!important;
    }
    .creator-fit-details{padding:12px 10px 16px!important}
    .creator-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
    .creator-detail{
      min-height:150px!important;
      height:150px!important;
      padding:10px!important;
      border-radius:11px!important;
      box-sizing:border-box!important;
    }
  }
  @media(max-width:390px){
    .creator-fit-main{gap:6px!important;padding-left:8px!important;padding-right:8px!important}
    .creator-score,.creator-stat{height:68px!important;min-height:68px!important;padding:7px 3px!important}
    .creator-score-number,.creator-stat b{font-size:25px!important}
    .creator-score-label{font-size:8px!important;margin-top:4px!important}
    .creator-stat span{font-size:6.5px!important;margin-top:4px!important}
    .creator-actions-v3{gap:5px!important}
    .creator-actions-v3 .btn,.creator-actions-v3 .social-link{height:48px!important;min-height:48px!important;font-size:11px!important;border-radius:10px!important}
    .creator-detail{height:142px!important;min-height:142px!important;padding:9px!important}
  }
  `;

  document.head.appendChild(s);
})();

/* KOL IDS · PREMIUM TECH REFINEMENT · 20261003 */
(function(){
  const id='kol-ids-premium-tech-refinement-20261003';
  if(document.getElementById(id)) return;
  const s=document.createElement('style');
  s.id=id;
  s.textContent=`
:root{
  --lux-gold:#b69a67;
  --lux-gold-soft:#f7f2e8;
  --lux-cyan:#aeefff;
  --lux-cyan-strong:#62d8ec;
  --lux-ink:#171317;
}
html{background:#f3f5f6}
body{
  background:
    radial-gradient(760px 420px at 86% -10%,rgba(174,239,255,.34),transparent 64%),
    radial-gradient(620px 360px at 18% 0%,rgba(255,255,255,.95),transparent 70%),
    linear-gradient(180deg,#f8fafb 0%,#f1f3f4 100%)!important;
}
.kol-shell{position:relative}
.kol-shell:before{
  content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;opacity:.22;
  background-image:linear-gradient(rgba(23,19,23,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(23,19,23,.028) 1px,transparent 1px);
  background-size:34px 34px;
  mask-image:linear-gradient(to bottom,rgba(0,0,0,.72),transparent 58%);
}
.kol-side{box-shadow:16px 0 48px rgba(15,14,16,.08)!important}
.kol-brand{position:relative}
.kol-brand:after{content:"";position:absolute;left:12px;right:12px;bottom:11px;height:1px;background:linear-gradient(90deg,rgba(174,239,255,.65),rgba(255,255,255,.06),transparent)}
.kol-nav button{transition:transform .16s ease,background .16s ease,border-color .16s ease,box-shadow .16s ease!important}
.kol-nav button.active{box-shadow:inset 2px 0 0 var(--lux-cyan),0 8px 22px rgba(0,0,0,.12)!important}
.kol-top{box-shadow:0 8px 28px rgba(24,21,25,.035)!important}
.kol-top:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(174,239,255,.7) 22%,rgba(182,154,103,.34) 52%,transparent 82%);pointer-events:none}
.kol-top h1{font-weight:850!important}
.kol-content{padding-top:30px!important}
.hero{isolation:isolate}
.hero:before{content:"";position:absolute;right:2%;top:-24px;width:180px;height:180px;border:1px solid rgba(174,239,255,.22);border-radius:50%;opacity:.55;pointer-events:none;z-index:-1}
.hero:after{width:68px!important;height:2px!important;background:linear-gradient(90deg,var(--lux-cyan-strong),var(--lux-gold))!important}
.card,.campaign-intake{
  box-shadow:0 10px 34px rgba(24,21,25,.038),0 1px 0 rgba(255,255,255,.9) inset!important;
}
.card:hover{transform:translateY(-1px);box-shadow:0 18px 48px rgba(24,21,25,.055),0 1px 0 rgba(255,255,255,.95) inset!important}
.section-head h2,.section-head h3{font-weight:850!important}
.section-head .label{color:#7d8990!important}
.metric{box-shadow:0 7px 24px rgba(24,21,25,.035),0 1px 0 #fff inset!important}
.metric:before{content:"";position:absolute;left:0;top:0;width:34px;height:2px;background:linear-gradient(90deg,var(--lux-cyan-strong),var(--lux-gold));opacity:.8}
.table-wrap{box-shadow:0 8px 24px rgba(24,21,25,.028)!important}
th{background:linear-gradient(180deg,#18171a,#202025)!important;color:#d9f8fc!important;border-bottom:0!important}
th:first-child{border-radius:0!important}
td{background:rgba(255,255,255,.88)}
tbody tr:hover td{background:#fbfdfe}
.btn{box-shadow:0 4px 14px rgba(24,21,25,.025)}
.btn.primary{box-shadow:0 10px 24px rgba(23,19,23,.16)!important}
.btn.cyan{box-shadow:0 9px 22px rgba(98,216,236,.18)!important}
.pill{border:1px solid rgba(23,19,23,.055)}
.kol-toast{box-shadow:0 20px 55px rgba(20,18,22,.18)!important;border:1px solid rgba(255,255,255,.72)!important}
.creator-registry-card,.decision-card,.performance-card,.impact-card{box-shadow:0 14px 42px rgba(24,21,25,.045)!important}
.creator-registry-card{position:relative;overflow:hidden}
.creator-registry-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--lux-cyan-strong),var(--lux-gold));opacity:.72}
.adaptation-box{box-shadow:0 7px 18px rgba(95,74,36,.05)}
@media(max-width:900px){
  .kol-content{padding-top:22px!important}
  .hero:before{right:-50px;top:-35px;opacity:.28}
}
@media(max-width:620px){
  .kol-top:after{background:linear-gradient(90deg,transparent,rgba(174,239,255,.72),transparent)}
  .card{box-shadow:0 8px 26px rgba(24,21,25,.035)!important}
  .hero:before{display:none}
}
`;

  document.head.appendChild(s);
})();

/* KOL IDS · REMOVE LATE CYAN/GOLD ACCENT LINES · 20261003 */
(function(){
  const id='kol-ids-remove-cyan-gold-accent-lines-20261003';
  if(document.getElementById(id)) return;
  const s=document.createElement('style');
  s.id=id;
  s.textContent=`
    .kol-brand:after,
    .kol-top:after,
    .hero:after,
    .card:before,
    .metric:before,
    .creator-registry-card:before{display:none!important;content:none!important}
    [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric:first-child,
    [data-kol-business-impact="1"] > .grid.g4:first-of-type .metric:nth-child(3){border-top:1px solid #e0e6e9!important}
  `;

  document.head.appendChild(s);
})();

/* FINAL MOBILE GEN CODE POLISH · 20261006 */
(function(){
  const styleId='kol-ids-gen-code-mobile-20261006';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
    /* Keep the Gen Code module structurally inside the viewport. */
    .gen-code-panel,
    .gen-code-panel *{box-sizing:border-box;min-width:0;}
    .gen-code-panel{overflow:hidden!important;}
    .gen-code-panel .section-head{min-width:0;}
    .gen-code-panel .section-head>div:first-child{min-width:0;flex:1 1 auto;}
    .gen-code-panel .section-head .pill{flex:0 0 auto;}
    .gen-code-panel .sub{max-width:760px;line-height:1.6;}
    .gen-code-panel .hint{line-height:1.45;}
    .gen-code-panel .form-grid{min-width:0;}
    .gen-code-panel .field{min-width:0;}
    .gen-code-panel input,
    .gen-code-panel select,
    .gen-code-panel textarea{max-width:100%;}

    /* Desktop individual terms remain a compact data table. */
    .gen-code-individual-table{width:100%!important;}

    @media(max-width:760px){
      .gen-code-panel{padding:14px!important;border-radius:14px!important;}
      .gen-code-panel .section-head{display:flex!important;flex-wrap:wrap!important;gap:9px!important;}
      .gen-code-panel .section-head>div:first-child{width:100%;}
      .gen-code-panel .section-head .pill{margin-left:auto;}
      .gen-code-panel .section-head h2{font-size:16px!important;line-height:1.2!important;}
      .gen-code-panel .sub{font-size:9px!important;line-height:1.55!important;margin-top:5px!important;}
      .gen-code-panel .form-grid{gap:11px!important;}
      .gen-code-panel .field label{font-size:8.5px!important;}
      .gen-code-panel .field input,
      .gen-code-panel .field select{min-height:42px!important;font-size:11px!important;padding:10px 11px!important;}
      .gen-code-panel .field .hint{font-size:8px!important;line-height:1.45!important;}

      /* The desktop table becomes stacked creator cards. No horizontal overflow. */
      .gen-code-panel #gc-individual-fields{width:100%!important;}
      .gen-code-panel #gc-individual-fields>.table-wrap{
        width:100%!important;
        max-width:100%!important;
        overflow:visible!important;
        border:0!important;
        background:transparent!important;
      }
      .gen-code-panel .gen-code-individual-table{
        display:block!important;
        width:100%!important;
        min-width:0!important;
        border:0!important;
        background:transparent!important;
      }
      .gen-code-panel .gen-code-individual-table thead{display:none!important;}
      .gen-code-panel .gen-code-individual-table tbody,
      .gen-code-panel .gen-code-individual-table tr,
      .gen-code-panel .gen-code-individual-table td{
        display:block!important;
        width:100%!important;
      }
      .gen-code-panel .gen-code-individual-table tbody{display:grid!important;gap:8px!important;}
      .gen-code-panel .gen-code-individual-table tr{
        padding:11px!important;
        border:1px solid #e0e7ea!important;
        border-radius:11px!important;
        background:#fff!important;
      }
      .gen-code-panel .gen-code-individual-table td{
        border:0!important;
        padding:0!important;
        margin:0!important;
      }
      .gen-code-panel .gen-code-individual-table td+td{margin-top:8px!important;}
      .gen-code-panel .gen-code-individual-table td:first-child{
        padding-bottom:8px!important;
        border-bottom:1px solid #edf0f2!important;
      }
      .gen-code-panel .gen-code-individual-table td:first-child b{
        display:block!important;
        font-size:11px!important;
        line-height:1.3!important;
      }
      .gen-code-panel .gen-code-individual-table td:nth-child(2),
      .gen-code-panel .gen-code-individual-table td:nth-child(3),
      .gen-code-panel .gen-code-individual-table td:nth-child(4){
        display:grid!important;
        grid-template-columns:94px minmax(0,1fr)!important;
        gap:8px!important;
        align-items:center!important;
      }
      .gen-code-panel .gen-code-individual-table td:nth-child(2)::before{content:'Discount type';}
      .gen-code-panel .gen-code-individual-table td:nth-child(3)::before{content:'Discount value';}
      .gen-code-panel .gen-code-individual-table td:nth-child(4)::before{content:'Commission %';}
      .gen-code-panel .gen-code-individual-table td:nth-child(n+2)::before{
        font-size:8px!important;
        font-weight:850!important;
        color:#78858c!important;
        text-transform:uppercase!important;
        letter-spacing:.07em!important;
      }
      .gen-code-panel .gen-code-individual-table select,
      .gen-code-panel .gen-code-individual-table input{
        width:100%!important;
        min-width:0!important;
        max-width:100%!important;
        min-height:38px!important;
        font-size:10px!important;
        padding:8px 9px!important;
        box-sizing:border-box!important;
      }

      /* Prevent date controls and long option text from visually pushing the card. */
      .gen-code-panel input[type=date]{
        width:100%!important;
        min-width:0!important;
        display:block!important;
      }
      .gen-code-panel select{white-space:normal!important;text-overflow:ellipsis!important;}
      .gen-code-panel .actions{grid-template-columns:1fr!important;}
      .gen-code-panel .actions .btn{min-height:42px!important;font-size:9px!important;}

      /* Existing generated-code results are intentionally scrollable as data, but the
         control itself never exceeds the card width. */
      .gen-code-panel .gen-code-table .table-wrap{
        width:100%!important;
        max-width:100%!important;
        overflow-x:auto!important;
        -webkit-overflow-scrolling:touch!important;
      }
      .gen-code-panel .gen-code-table table{min-width:650px!important;}
      .gen-code-panel .footer-note{font-size:8px!important;line-height:1.55!important;}
    }

    @media(max-width:420px){
      .gen-code-panel{padding:12px!important;}
      .gen-code-panel .section-head h2{font-size:15px!important;}
      .gen-code-panel .sub{font-size:8.5px!important;}
      .gen-code-panel .gen-code-individual-table td:nth-child(2),
      .gen-code-panel .gen-code-individual-table td:nth-child(3),
      .gen-code-panel .gen-code-individual-table td:nth-child(4){
        grid-template-columns:82px minmax(0,1fr)!important;
      }
    }
  `;

  document.head.appendChild(s);
})();



/* REPORTS EDITORIAL GLASS / INSTITUTIONAL BLUE PASS · 20261006 */
(function(){
 const styleId='kol-ids-reports-editorial-glass-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  :root{
    --editorial-blue:#2454c7;
    --editorial-blue-2:#7f92e5;
    --editorial-blue-soft:rgba(36,84,199,.075);
    --editorial-ink:#171a1e;
    --editorial-body:#3f474e;
    --editorial-muted:#788189;
    --editorial-line:rgba(32,42,52,.095);
  }
  /* Overall report: quiet paper, generous white space, restrained glass surfaces. */
  .kol-report-page{
    background:
      radial-gradient(700px 300px at 92% 0%,rgba(125,146,229,.075),transparent 68%),
      radial-gradient(620px 300px at 6% 8%,rgba(255,255,255,.95),transparent 72%),
      linear-gradient(180deg,#f8f9fa 0%,#f3f5f6 100%)!important;
  }
  .kol-report-page>.hero{
    background:rgba(255,255,255,.78)!important;
    border:1px solid rgba(210,216,222,.82)!important;
    border-radius:2px!important;
    box-shadow:0 18px 55px rgba(27,34,42,.045)!important;
    backdrop-filter:blur(10px)!important;
    -webkit-backdrop-filter:blur(10px)!important;
  }
  .kol-report-page>.hero h2{font-size:35px!important;font-weight:760!important;letter-spacing:-.055em!important;color:var(--editorial-ink)!important}
  .kol-report-page>.hero p{font-size:12px!important;line-height:1.75!important;color:#586169!important;max-width:720px!important}
  .kol-report-page>.hero:after{width:48px!important;height:2px!important;background:var(--editorial-blue)!important;opacity:.8}

  .kol-report-page>.card{
    background:rgba(255,255,255,.78)!important;
    border:1px solid rgba(214,220,225,.82)!important;
    border-radius:2px!important;
    box-shadow:0 16px 45px rgba(28,35,42,.035)!important;
    backdrop-filter:blur(10px)!important;
    -webkit-backdrop-filter:blur(10px)!important;
  }
  .kol-report-page>.card .section-head{margin-bottom:19px!important}
  .kol-report-page>.card .section-head h2{font-size:18px!important;font-weight:760!important;color:var(--editorial-ink)!important;letter-spacing:-.025em!important}
  .kol-report-page>.card .section-head .sub{font-size:10px!important;line-height:1.6!important;color:#737d84!important}
  .kol-report-page>.card .metric{
    background:rgba(255,255,255,.60)!important;
    border:1px solid rgba(220,225,229,.85)!important;
    border-radius:2px!important;
    box-shadow:none!important;
  }
  .kol-report-page>.card .metric strong{font-size:29px!important;color:#15181c!important;font-weight:780!important}
  .kol-report-page>.card .metric small{color:#7b858c!important}

  /* Editorial chart cards: thin rules, blue ink, no heavy dashboard chrome. */
  .report-chart-grid{gap:20px!important}
  .report-chart-card{
    border:1px solid rgba(218,223,227,.82)!important;
    border-radius:2px!important;
    background:rgba(255,255,255,.54)!important;
    padding:22px 22px 18px!important;
    box-shadow:none!important;
  }
  .report-chart-head{margin-bottom:11px!important;padding-bottom:11px!important;border-bottom:1px solid rgba(32,42,52,.07)!important}
  .report-chart-head b{font-size:13px!important;font-weight:720!important;color:#171b20!important}
  .report-chart-head span{font-size:9px!important;color:#8b949a!important}
  .rchart-title{font-size:9px!important;fill:#7e878e!important;font-weight:650!important}
  .rchart-value{font-size:10px!important;fill:#1e2429!important;font-weight:760!important}
  .rchart-label{font-size:9px!important;fill:#7b858c!important}
  .rchart-label-strong{font-size:10px!important;fill:#4a545c!important;font-weight:650!important}
  .rchart-axis{font-size:8px!important;fill:#a0a8ad!important}
  .rchart-legend{font-size:9px!important;fill:#707a82!important}
  .rchart-gridline{stroke:rgba(65,76,86,.105)!important;stroke-width:.55!important}
  .rchart-bar{fill:#2454c7!important;opacity:.92!important}
  .rchart-line-a{stroke:#2454c7!important;stroke-width:1.45!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important}
  .rchart-line-b{stroke:#8a9ae2!important;stroke-width:1.15!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important}
  .rchart-dot-a{fill:#2454c7!important}
  .rchart-dot-b{fill:#8a9ae2!important}
  .report-chart-empty{height:230px!important;border:1px dashed rgba(170,179,186,.45)!important;background:rgba(255,255,255,.42)!important;color:#8a9399!important}

  /* Thin, quiet donut. The actual segment colors are defined in JS. */
  .report-donut-wrap{min-height:238px!important;gap:34px!important}
  .report-donut{width:164px!important;height:164px!important;flex-basis:164px!important;box-shadow:none!important}
  .report-donut>div{width:134px!important;height:134px!important;background:rgba(255,255,255,.90)!important}
  .report-donut strong{font-size:24px!important;font-weight:780!important;color:#171b20!important}
  .report-donut span{font-size:8px!important;color:#899298!important;letter-spacing:.12em!important}
  .report-legend{gap:13px!important;min-width:180px!important}
  .report-legend>div{font-size:10px!important;grid-template-columns:7px 1fr auto!important;gap:9px!important}
  .report-legend i{width:7px!important;height:7px!important;border-radius:50%!important}
  .report-legend span{color:#68737b!important}
  .report-legend b{font-size:10px!important;color:#1b2025!important;font-weight:740!important}

  /* Evidence and tables should read like an annual report, not a control panel. */
  .evidence-status-grid{gap:8px!important}
  .evidence-status{padding:14px!important;border:1px solid rgba(216,222,226,.85)!important;background:rgba(255,255,255,.50)!important;border-radius:2px!important;box-shadow:none!important}
  .evidence-status.is-present{border-color:rgba(36,84,199,.18)!important;background:rgba(36,84,199,.035)!important}
  .evidence-status.is-present b{color:#2454c7!important}
  .evidence-status.is-missing{background:rgba(255,255,255,.34)!important}
  .evidence-status b{font-size:8px!important;letter-spacing:.12em!important}
  .evidence-status span{font-size:10px!important;color:#5e6971!important}
  .kol-report-page .table-wrap{background:rgba(255,255,255,.58)!important;border:1px solid rgba(214,220,225,.82)!important;border-radius:2px!important;box-shadow:none!important}
  .kol-report-page table{background:transparent!important}
  .kol-report-page th{background:rgba(246,248,249,.76)!important;color:#7c858c!important;border-bottom:1px solid rgba(32,42,52,.075)!important}
  .kol-report-page td{color:#3c454c!important;border-bottom:1px solid rgba(32,42,52,.055)!important}
  .kol-report-page .pill{border-radius:2px!important;background:rgba(36,84,199,.065)!important;color:#3158a4!important}

  @media(max-width:900px){
    .kol-report-page>.hero,.kol-report-page>.card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
  }
 `;
 document.head.appendChild(s);
})();

/* REPORTS LUXURY ENTERPRISE REFINEMENT · 20261006 */
(function(){
 const styleId='kol-ids-reports-luxury-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  :root{
    --lux-ink:#17191c;
    --lux-body:#3e464d;
    --lux-muted:#778087;
    --lux-hairline:#e8ebed;
    --lux-paper:#ffffff;
    --lux-pearl:#fbfbfa;
    --lux-cyan:#59bfcb;
    --lux-gold:#b29a6b;
  }
  .kol-report-page{color:var(--lux-ink)!important;background:transparent!important}
  .kol-report-page>.hero{
    background:linear-gradient(180deg,#fff 0%,#fcfcfb 100%)!important;
    border:1px solid var(--lux-hairline)!important;
    box-shadow:0 18px 55px rgba(20,24,28,.035)!important;
  }
  .kol-report-page>.hero h2{font-weight:820!important;color:#111315!important}
  .kol-report-page>.hero p{color:#59636a!important}
  .kol-report-page>.card{
    background:rgba(255,255,255,.97)!important;
    border:1px solid var(--lux-hairline)!important;
    box-shadow:0 14px 42px rgba(20,24,28,.028)!important;
  }
  .kol-report-page>.card .section-head h2{color:#151719!important;font-weight:790!important}
  .kol-report-page>.card .section-head .sub{color:#69737a!important}
  .kol-report-page>.card .metric{background:#fff!important;border:1px solid #eceeef!important;box-shadow:none!important}
  .kol-report-page>.card .metric strong{color:#121416!important;font-weight:800!important}

  /* Charts: restrained, hairline geometry; typography remains high-contrast. */
  .report-chart-grid{gap:18px!important}
  .report-chart-card{
    border:1px solid #eceeef!important;
    border-radius:18px!important;
    background:#fff!important;
    padding:20px 20px 18px!important;
    box-shadow:none!important;
  }
  .report-chart-head{margin-bottom:10px!important;padding-bottom:10px!important;border-bottom:1px solid #f0f1f2!important}
  .report-chart-head b{font-size:13px!important;font-weight:780!important;color:#17191c!important;letter-spacing:-.01em!important}
  .report-chart-head span{font-size:9px!important;color:#8a9298!important;letter-spacing:.04em!important}
  .report-chart-svg{min-height:230px!important}
  .rchart-title{font-size:10px!important;fill:#7d868c!important;font-weight:650!important}
  .rchart-value{font-size:10px!important;fill:#202428!important;font-weight:760!important}
  .rchart-label{font-size:9px!important;fill:#7b858b!important}
  .rchart-label-strong{font-size:10px!important;fill:#3f474d!important;font-weight:650!important}
  .rchart-axis{font-size:8px!important;fill:#9aa1a6!important}
  .rchart-legend{font-size:9px!important;fill:#70797f!important}
  .rchart-gridline{stroke:#eef0f1!important;stroke-width:.65!important;shape-rendering:crispEdges!important}
  .rchart-bar{fill:#202326!important}
  .rchart-line-a{stroke:#202326!important;stroke-width:1.35!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important}
  .rchart-line-b{stroke:#59bfcb!important;stroke-width:1.25!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important}
  .rchart-dot-a{fill:#202326!important;r:2.25px!important}
  .rchart-dot-b{fill:#59bfcb!important;r:2.25px!important}
  .report-chart-empty{height:230px!important;border:1px dashed #e4e7e9!important;background:#fdfdfc!important;color:#899197!important}

  /* Donut: intentionally light and thin, like an institutional report. */
  .report-donut-wrap{min-height:238px!important;gap:32px!important}
  .report-donut{width:164px!important;height:164px!important;flex-basis:164px!important;box-shadow:none!important}
  .report-donut>div{width:134px!important;height:134px!important;background:#fff!important}
  .report-donut strong{font-size:24px!important;font-weight:800!important;letter-spacing:-.04em!important;color:#17191c!important}
  .report-donut span{font-size:8px!important;color:#899197!important;letter-spacing:.12em!important}
  .report-legend{gap:13px!important;min-width:180px!important}
  .report-legend>div{font-size:10px!important;grid-template-columns:8px 1fr auto!important;gap:9px!important}
  .report-legend i{width:7px!important;height:7px!important;border-radius:50%!important}
  .report-legend span{color:#69737a!important}
  .report-legend b{font-size:10px!important;color:#1b1e21!important;font-weight:760!important}

  /* Enterprise evidence language: calm, precise, no visual noise. */
  .evidence-status-grid{gap:8px!important}
  .evidence-status{border:1px solid #eceeef!important;background:#fdfdfc!important;border-radius:11px!important;box-shadow:none!important}
  .evidence-status.is-present{border-color:#d9edef!important;background:#fbfefe!important}
  .evidence-status.is-missing{border-color:#eceeef!important;background:#fdfdfd!important}
  .evidence-status b{font-size:8px!important;letter-spacing:.12em!important}
  .evidence-status span{font-size:10px!important;color:#5f6970!important}

  /* FINAL READABILITY PASS · chart typography and geometry */
  .report-chart-card{padding:22px 22px 20px!important}
  .report-chart-head b{font-size:15px!important;font-weight:800!important}
  .report-chart-head span{font-size:10px!important}
  .report-chart-svg{min-height:270px!important}
  .rchart-title{font-size:12px!important;fill:#66727a!important;font-weight:750!important}
  .rchart-value{font-size:13px!important;fill:#171b20!important;font-weight:820!important}
  .rchart-share{font-size:12px!important;fill:#4b5962!important;font-weight:780!important}
  .rchart-label{font-size:11px!important;fill:#68747c!important}
  .rchart-label-strong{font-size:12px!important;fill:#252d33!important;font-weight:720!important}
  .rchart-axis{font-size:10px!important;fill:#7f8a91!important}
  .rchart-axis-heading{font-size:10px!important;fill:#5e6a72!important;font-weight:760!important}
  .rchart-legend{font-size:11px!important;fill:#5f6b73!important;font-weight:650!important}
  .rchart-gridline{stroke:#e7ebed!important;stroke-width:.7!important}
  .rchart-bar{fill:#2454c7!important;opacity:.88!important}
  .rchart-line-a{stroke:#2454c7!important;stroke-width:2.1!important;stroke-linecap:round!important;stroke-linejoin:round!important}
  .rchart-line-b{stroke:#59bfcb!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important}
  .rchart-dot-a{fill:#2454c7!important}.rchart-dot-b{fill:#59bfcb!important}
  .report-donut-wrap{min-height:260px!important;gap:38px!important}
  .report-donut{width:176px!important;height:176px!important;flex-basis:176px!important}
  .report-donut>div{width:132px!important;height:132px!important}
  .report-donut strong{font-size:28px!important;font-weight:820!important}
  .report-donut span{font-size:10px!important}
  .report-legend{gap:15px!important;min-width:200px!important}
  .report-legend>div{font-size:12px!important;grid-template-columns:9px 1fr auto!important;gap:10px!important}
  .report-legend b{font-size:12px!important}

  @media(max-width:900px){
    .kol-report-page>.card{box-shadow:none!important}
    .report-chart-card{padding:18px!important}
  }
 `;
 document.head.appendChild(s);
})();


/* V6 · CI chart readability + translucent premium pass */
(function(){
  const styleId='kol-ids-ci-chart-readability-v6';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
    .report-chart-card{background:rgba(255,255,255,.82)!important;border-color:rgba(23,23,27,.09)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important;box-shadow:0 10px 34px rgba(20,22,30,.035)!important}
    .report-chart-head{padding-bottom:13px!important;margin-bottom:14px!important;border-bottom:1px solid rgba(23,23,27,.075)!important}
    .report-chart-head b{font-size:16px!important;font-weight:820!important;color:#17171b!important}
    .report-chart-head span{font-size:11px!important;color:#77777f!important}
    .report-chart-svg{min-height:320px!important}
    .rchart-title{font-size:14px!important;fill:#34343b!important;font-weight:800!important}
    .rchart-value{font-size:14px!important;fill:#17171b!important;font-weight:850!important}
    .rchart-share{font-size:13px!important;fill:#8067e8!important;font-weight:800!important}
    .rchart-label{font-size:12px!important;fill:#5f626b!important}
    .rchart-label-strong{font-size:14px!important;fill:#34343b!important;font-weight:780!important}
    .rchart-axis{font-size:11px!important;fill:#77777f!important;font-weight:650!important}
    .rchart-axis-heading{font-size:11px!important;fill:#34343b!important;font-weight:800!important}
    .rchart-legend{font-size:12px!important;fill:#34343b!important;font-weight:700!important}
    .rchart-point-value{font-size:14px!important;font-weight:900!important}
    .rchart-dot-a{fill:#8067e8!important}
    .rchart-dot-b{fill:#4fd7e8!important}
    .rchart-dot-a-text{fill:#8067e8!important}
    .rchart-dot-b-text{fill:#4fd7e8!important}
    .rchart-line-a{stroke:#8067e8!important;stroke-width:2.25!important;opacity:.78!important}
    .rchart-line-b{stroke:#4fd7e8!important;stroke-width:2.25!important;opacity:.82!important}
    .rchart-bar{fill:#4fd7e8!important;opacity:.58!important}
    .rchart-bar-track{fill:rgba(79,215,232,.08)!important;stroke:rgba(79,215,232,.18)!important;stroke-width:1!important}
    .rchart-gridline{stroke:rgba(23,23,27,.09)!important;stroke-width:.7!important}
    .rchart-footnote{font-size:10px!important;fill:#9c9ca4!important;font-weight:600!important}
    .rchart-date-label{font-size:12px!important;fill:#5f626b!important;font-weight:700!important}
    .report-chart-empty{height:270px!important;font-size:14px!important;color:#77777f!important;background:rgba(255,255,255,.58)!important;border:1px dashed rgba(23,23,27,.12)!important}
    .report-donut-wrap{min-height:280px!important;gap:42px!important}
    .report-donut{width:184px!important;height:184px!important;flex-basis:184px!important;box-shadow:none!important;opacity:.94!important}
    .report-donut>div{width:138px!important;height:138px!important;background:rgba(255,255,255,.92)!important}
    .report-donut strong{font-size:30px!important;font-weight:850!important;color:#17171b!important}
    .report-donut span{font-size:11px!important;color:#77777f!important;font-weight:700!important}
    .report-legend{gap:17px!important;min-width:220px!important}
    .report-legend>div{font-size:13px!important;grid-template-columns:10px 1fr auto!important;gap:11px!important}
    .report-legend i{width:9px!important;height:9px!important}
    .report-legend span{color:#5f626b!important;font-weight:650!important}
    .report-legend b{font-size:13px!important;color:#17171b!important;font-weight:850!important}
    @media(max-width:900px){.report-chart-svg{min-height:290px!important}.report-chart-card{padding:18px!important}}

    /* FINAL UNIFIED BLUE REPORT THEME — all four visual cards */
    .kol-report-page .report-chart-card{
      background:linear-gradient(180deg,#FFFFFF 0%,#F8FAFF 100%)!important;
      border:1px solid #D4DFF0!important;
      border-top:2px solid #2454C7!important;
      border-radius:18px!important;
      box-shadow:0 12px 32px rgba(36,84,199,.065)!important;
    }
    .kol-report-page .report-chart-card:hover{
      border-color:#BFCDE7!important;
      border-top-color:#2454C7!important;
      box-shadow:0 16px 40px rgba(36,84,199,.10)!important;
    }
    .kol-report-page .report-chart-head{
      border-bottom:1px solid #DCE4F1!important;
    }
    .kol-report-page .report-chart-head b{color:#17243C!important}
    .kol-report-page .report-chart-head span{color:#61708A!important}

    /* Readable chart typography */
    .kol-report-page .rchart-label-strong{fill:#263A5A!important;font-weight:800!important}
    .kol-report-page .rchart-label{fill:#52627A!important;font-weight:650!important}
    .kol-report-page .rchart-axis{fill:#68778E!important;font-weight:650!important}
    .kol-report-page .rchart-value{fill:#183A7A!important;font-weight:900!important}
    .kol-report-page .rchart-share{fill:#173A7B!important;font-weight:900!important}
    .kol-report-page .rchart-legend{fill:#43536D!important;font-weight:750!important}
    .kol-report-page .rchart-gridline{stroke:#E1E8F3!important;stroke-width:1!important}

    /* Creator performance: consistent blue scale */
    .kol-report-page .rchart-bar{fill:#2454C7!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(2) .rchart-bar{fill:#4B73D5!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(3) .rchart-bar{fill:#6D8DDF!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(4) .rchart-bar{fill:#91A9E9!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(5) .rchart-bar{fill:#B4C4F2!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(6) .rchart-bar{fill:#D7E0FA!important}

    /* Revenue contribution: same scale, with readable dark text */
    .kol-report-page .report-chart-revenue .rchart-bar-track{fill:#EDF2FA!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-0{fill:#2454C7!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-1{fill:#4B73D5!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-2{fill:#6D8DDF!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-3{fill:#91A9E9!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-4{fill:#B4C4F2!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-5{fill:#D7E0FA!important}

    /* Outcome trend: both series remain visibly blue */
    .kol-report-page .rchart-line-a{stroke:#2454C7!important;stroke-width:3.5!important}
    .kol-report-page .rchart-dot-a{fill:#2454C7!important}
    .kol-report-page .rchart-dot-a-text{fill:#2454C7!important}
    .kol-report-page .rchart-line-b{stroke:#6D8DDF!important;stroke-width:3!important;stroke-dasharray:8 6!important}
    .kol-report-page .rchart-dot-b{fill:#6D8DDF!important;stroke:#FFFFFF!important;stroke-width:3!important}
    .kol-report-page .rchart-dot-b-text{fill:#4B73D5!important}

    /* Empty state matches the same visual language */
    .kol-report-page .report-chart-empty{
      background:#F8FAFF!important;
      border:1px dashed #C9D6EA!important;
      color:#52627A!important;
      font-weight:700!important;
    }

    /* Donut: same blue family + readable legend */
    .kol-report-page .report-donut{
      box-shadow:0 0 0 1px #D3DFF0,0 14px 34px rgba(36,84,199,.09)!important;
    }
    .kol-report-page .report-donut>div{background:#FFFFFF!important}
    .kol-report-page .report-donut strong{color:#17243C!important;font-weight:900!important}
    .kol-report-page .report-donut span{color:#65748B!important}
    .kol-report-page .report-legend span{color:#40516B!important;font-weight:700!important}
    .kol-report-page .report-legend b{color:#2454C7!important;font-weight:900!important}

    /* Stronger axis / legend contrast on the lightest blue elements */
    .kol-report-page .report-chart-svg text{paint-order:stroke;stroke:transparent;stroke-width:0!important}

  `;
  document.head.appendChild(s);
})();


/* V7 · CI palette · translucent chart color + oversized readable type */
(function(){
  const styleId='kol-ids-ci-chart-readability-v7';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
    /* KOL IDS CI: cyan #4FD7E8 · violet #8067E8 · gold #B29A6B */
    .report-chart-card{
      background:rgba(255,255,255,.78)!important;
      border-color:rgba(79,215,232,.16)!important;
      backdrop-filter:blur(8px)!important;
      -webkit-backdrop-filter:blur(8px)!important;
    }
    .report-chart-head b{font-size:17px!important;font-weight:850!important;color:#17171b!important}
    .report-chart-head span{font-size:12px!important;color:#77777f!important}
    .report-chart-svg{min-height:340px!important}
    .rchart-title{font-size:15px!important;fill:#34343b!important;font-weight:820!important}
    .rchart-value{font-size:16px!important;fill:#17171b!important;font-weight:900!important}
    .rchart-share{font-size:14px!important;fill:#8067e8!important;font-weight:850!important}
    .rchart-label{font-size:13px!important;fill:#4f5961!important}
    .rchart-label-strong{font-size:14px!important;fill:#252b30!important;font-weight:800!important}
    .rchart-axis{font-size:12px!important;fill:#69747b!important;font-weight:700!important}
    .rchart-axis-heading{font-size:12px!important;fill:#34343b!important;font-weight:850!important}
    .rchart-legend{font-size:13px!important;fill:#34343b!important;font-weight:750!important}
    .rchart-point-value{font-size:14px!important;font-weight:900!important}

    /* CI chart ink: light translucent fills, never heavy blocks */
    .rchart-dot-a{fill:#8067e8!important;opacity:.78!important}
    .rchart-dot-b{fill:#4fd7e8!important;opacity:.82!important}
    .rchart-dot-a-text{fill:#8067e8!important}
    .rchart-dot-b-text{fill:#4fd7e8!important}
    .rchart-line-a{stroke:#8067e8!important;stroke-width:2.2!important;opacity:.72!important}
    .rchart-line-b{stroke:#4fd7e8!important;stroke-width:2.2!important;opacity:.78!important}
    .rchart-bar{fill:#4fd7e8!important;opacity:.46!important}
    .rchart-bar-track{fill:rgba(79,215,232,.07)!important;stroke:rgba(79,215,232,.16)!important;stroke-width:1!important}
    .rchart-gridline{stroke:rgba(23,23,27,.075)!important;stroke-width:.65!important}
    .rchart-footnote{font-size:11px!important;fill:#8a949a!important;font-weight:650!important}
    .rchart-date-label{font-size:13px!important;fill:#4f5961!important;font-weight:750!important}

    /* Revenue contribution uses all three CI accents to distinguish ranked records. */
    .report-chart-revenue .rchart-bar{fill:#8067e8!important;opacity:.48!important}
    .report-chart-revenue .rchart-bar-track{fill:rgba(128,103,232,.065)!important;stroke:rgba(128,103,232,.15)!important}
    .report-chart-revenue .rchart-share{fill:#b29a6b!important;font-size:14px!important;font-weight:900!important}

    .report-chart-empty{
      height:290px!important;font-size:15px!important;color:#77777f!important;
      background:rgba(255,255,255,.52)!important;
      border:1px dashed rgba(79,215,232,.20)!important;
    }

    /* Donut / evidence mix: CI palette, soft transparency, larger typography. */
    .report-donut-wrap{min-height:300px!important;gap:44px!important}
    .report-donut{width:190px!important;height:190px!important;flex-basis:190px!important;opacity:.95!important}
    .report-donut>div{width:142px!important;height:142px!important;background:rgba(255,255,255,.92)!important}
    .report-donut strong{font-size:32px!important;font-weight:900!important;color:#17171b!important}
    .report-donut span{font-size:12px!important;color:#69747b!important;font-weight:750!important}
    .report-legend{gap:18px!important;min-width:225px!important}
    .report-legend>div{font-size:14px!important;grid-template-columns:11px 1fr auto!important;gap:11px!important}
    .report-legend i{width:10px!important;height:10px!important}
    .report-legend span{color:#4f5961!important;font-weight:700!important}
    .report-legend b{font-size:14px!important;color:#17171b!important;font-weight:900!important}

    @media(max-width:900px){
      .report-chart-svg{min-height:310px!important}
      .report-chart-head b{font-size:16px!important}
      .report-chart-card{padding:18px!important}
    }
  `;
  document.head.appendChild(s);
})();

/* FINAL CI CHART CORRECTION · ORIGINAL KOL IDS PALETTE · NO VIOLET · 20261006 */
(function(){
  const styleId='kol-ids-final-ci-chart-correction-20261006';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style'); s.id=styleId; s.textContent=`
    /* KOL IDS original CI: maroon + soft cyan + warm neutral. No violet. */
    .report-chart-card{background:rgba(255,255,255,.84)!important;border:1px solid rgba(70,201,232,.20)!important;border-radius:18px!important;box-shadow:0 10px 34px rgba(61,19,27,.035)!important}
    .report-chart-head b{font-size:18px!important;font-weight:850!important;color:#3d131b!important}
    .report-chart-head span{font-size:12px!important;color:#6f7d83!important}
    .report-chart-svg{min-height:370px!important;overflow:visible!important}
    .rchart-title{font-size:18px!important;fill:#3d131b!important;font-weight:850!important}
    .rchart-value{font-size:20px!important;fill:#3d131b!important;font-weight:900!important}
    .rchart-share{font-size:18px!important;fill:#3d131b!important;font-weight:900!important}
    .rchart-label{font-size:17px!important;fill:#56636a!important;font-weight:700!important}
    .rchart-label-strong{font-size:18px!important;fill:#3d131b!important;font-weight:850!important}
    .rchart-axis{font-size:15px!important;fill:#68767d!important;font-weight:700!important}
    .rchart-axis-heading{font-size:15px!important;fill:#3d131b!important;font-weight:850!important}
    .rchart-legend{font-size:15px!important;fill:#3d131b!important;font-weight:800!important}
    .rchart-point-value{font-size:17px!important;font-weight:900!important}
    .rchart-date-label{font-size:16px!important;fill:#56636a!important;font-weight:800!important}
    .rchart-footnote{font-size:13px!important;fill:#7b878d!important;font-weight:650!important}
    .rchart-gridline{stroke:rgba(61,19,27,.09)!important;stroke-width:.65!important}
    .rchart-dot-a{fill:#3d131b!important;opacity:.72!important}
    .rchart-dot-b{fill:#46c9e8!important;opacity:.78!important}
    .rchart-dot-a-text{fill:#3d131b!important}
    .rchart-dot-b-text{fill:#247f95!important}
    .rchart-line-a{stroke:#3d131b!important;stroke-width:2.5!important;opacity:.68!important;fill:none!important}
    .rchart-line-b{stroke:#46c9e8!important;stroke-width:2.5!important;opacity:.78!important;fill:none!important}
    .rchart-bar{fill:#46c9e8!important;opacity:.34!important}
    .rchart-bar-track{fill:rgba(205,245,255,.34)!important;stroke:rgba(70,201,232,.22)!important;stroke-width:1!important}
    .report-chart-revenue .rchart-bar{fill:#46c9e8!important;opacity:.36!important}
    .report-chart-revenue .rchart-bar-track{fill:rgba(205,245,255,.42)!important;stroke:rgba(70,201,232,.22)!important}
    .report-chart-revenue .rchart-share{fill:#3d131b!important;font-size:18px!important;font-weight:900!important}
    .report-chart-empty{height:300px!important;font-size:17px!important;color:#6f7d83!important;background:rgba(205,245,255,.12)!important;border:1px dashed rgba(70,201,232,.28)!important}
    .report-donut-wrap{min-height:310px!important;gap:46px!important}
    .report-donut{width:198px!important;height:198px!important;flex-basis:198px!important;opacity:.96!important}
    .report-donut>div{width:148px!important;height:148px!important;background:rgba(255,255,255,.94)!important}
    .report-donut strong{font-size:36px!important;font-weight:900!important;color:#3d131b!important}
    .report-donut span{font-size:13px!important;color:#6f7d83!important;font-weight:750!important}
    .report-legend{gap:20px!important;min-width:240px!important}
    .report-legend>div{font-size:15px!important;grid-template-columns:11px 1fr auto!important;gap:12px!important}
    .report-legend i{width:11px!important;height:11px!important}
    .report-legend span{color:#56636a!important;font-weight:750!important}
    .report-legend b{font-size:15px!important;color:#3d131b!important;font-weight:900!important}
    @media(max-width:900px){.report-chart-svg{min-height:330px!important}.rchart-title{font-size:16px!important}.rchart-value{font-size:17px!important}.rchart-label,.rchart-label-strong{font-size:14px!important}.rchart-axis,.rchart-axis-heading{font-size:12px!important}.rchart-legend{font-size:12px!important}.report-chart-card{padding:18px!important}}
  `; document.head.appendChild(s);
})();


/* FINAL CI LUXURY DATA-INSIGHT OVERRIDE · #AEEFFF · 20261006 */
(function(){
 const styleId='kol-ids-ci-luxury-data-insight-final-20261006';
 if(document.getElementById(styleId)) return;
 const s=document.createElement('style'); s.id=styleId; s.textContent=`
  :root{--kol-ci-cyan:#aeefff;--kol-ci-maroon:#3d131b;--kol-ci-ink:#17191c;--kol-ci-muted:#65727a;--kol-ci-line:#e9eef0}
  .kol-report-page .report-chart-grid{gap:22px!important}
  .kol-report-page .report-chart-card{
    position:relative!important; overflow:hidden!important;
    min-height:430px!important; padding:24px 24px 22px!important;
    background:linear-gradient(180deg,#ffffff 0%,#fcfeff 100%)!important;
    border:1px solid rgba(174,239,255,.62)!important;
    border-radius:20px!important;
    box-shadow:0 16px 42px rgba(61,19,27,.045),0 2px 8px rgba(174,239,255,.10)!important;
  }
  .kol-report-page .report-chart-card:before{
    content:"";position:absolute;left:0;right:0;top:0;height:3px;
    background:linear-gradient(90deg,var(--kol-ci-cyan),rgba(174,239,255,.25))!important;
  }
  .kol-report-page .report-chart-head{margin:0 0 14px!important;padding:0 0 13px!important;border-bottom:1px solid #edf2f3!important}
  .kol-report-page .report-chart-head b{font-size:18px!important;line-height:1.2!important;font-weight:850!important;letter-spacing:-.02em!important;color:var(--kol-ci-maroon)!important}
  .kol-report-page .report-chart-head span{font-size:12px!important;line-height:1.2!important;font-weight:650!important;color:#748189!important}
  .kol-report-page .report-chart-svg{min-height:340px!important;width:100%!important;height:auto!important;overflow:visible!important;display:block!important}
  .kol-report-page .rchart-title{font-size:15px!important;fill:var(--kol-ci-maroon)!important;font-weight:850!important}
  .kol-report-page .rchart-value{font-size:16px!important;fill:var(--kol-ci-maroon)!important;font-weight:900!important}
  .kol-report-page .rchart-share{font-size:15px!important;fill:var(--kol-ci-maroon)!important;font-weight:900!important}
  .kol-report-page .rchart-label{font-size:14px!important;fill:#4e5c64!important;font-weight:700!important}
  .kol-report-page .rchart-label-strong{font-size:15px!important;fill:var(--kol-ci-maroon)!important;font-weight:850!important}
  .kol-report-page .rchart-axis{font-size:12px!important;fill:#65737b!important;font-weight:700!important}
  .kol-report-page .rchart-axis-heading{font-size:12px!important;fill:var(--kol-ci-maroon)!important;font-weight:850!important}
  .kol-report-page .rchart-legend{font-size:12px!important;fill:#39464d!important;font-weight:800!important}
  .kol-report-page .rchart-point-value{font-size:14px!important;font-weight:900!important}
  .kol-report-page .rchart-date-label{font-size:13px!important;fill:#4e5c64!important;font-weight:800!important}
  .kol-report-page .rchart-footnote{font-size:10px!important;fill:#7b878e!important;font-weight:650!important}
  .kol-report-page .rchart-gridline{stroke:rgba(61,19,27,.10)!important;stroke-width:.7!important}
  .kol-report-page .rchart-line-a{stroke:var(--kol-ci-maroon)!important;stroke-width:2.8!important;opacity:.88!important}
  .kol-report-page .rchart-line-b{stroke:var(--kol-ci-cyan)!important;stroke-width:2.8!important;opacity:1!important}
  .kol-report-page .rchart-dot-a{fill:var(--kol-ci-maroon)!important;opacity:.95!important}
  .kol-report-page .rchart-dot-b{fill:var(--kol-ci-cyan)!important;stroke:var(--kol-ci-maroon)!important;stroke-width:1!important;opacity:1!important}
  .kol-report-page .rchart-dot-a-text{fill:var(--kol-ci-maroon)!important}
  .kol-report-page .rchart-dot-b-text{fill:#247b8f!important}
  .kol-report-page .rchart-bar-track{fill:rgba(174,239,255,.24)!important;stroke:rgba(174,239,255,.70)!important;stroke-width:1!important}
  .kol-report-page .rchart-bar{fill:var(--kol-ci-cyan)!important;opacity:.78!important}
  .kol-report-page .report-chart-revenue .rchart-bar{fill:var(--kol-ci-cyan)!important;opacity:.82!important}
  .kol-report-page .report-chart-revenue .rchart-bar-track{fill:rgba(174,239,255,.22)!important;stroke:rgba(174,239,255,.72)!important}
  .kol-report-page .report-chart-revenue .rchart-share{fill:var(--kol-ci-maroon)!important}
  .kol-report-page .report-chart-empty{height:250px!important;margin-top:4px!important;border:1px dashed rgba(174,239,255,.85)!important;background:linear-gradient(180deg,rgba(174,239,255,.08),rgba(255,255,255,.4))!important;color:#66757d!important;font-size:16px!important;font-weight:750!important}
  .kol-report-page .report-donut-wrap{min-height:330px!important;gap:48px!important}
  .kol-report-page .report-donut{width:205px!important;height:205px!important;flex-basis:205px!important}
  .kol-report-page .report-donut>div{width:150px!important;height:150px!important;background:#fff!important;box-shadow:0 4px 18px rgba(61,19,27,.05)!important}
  .kol-report-page .report-donut strong{font-size:38px!important;line-height:1!important;font-weight:900!important;letter-spacing:-.04em!important;color:var(--kol-ci-maroon)!important}
  .kol-report-page .report-donut span{font-size:12px!important;line-height:1.2!important;color:#6d7a81!important;font-weight:800!important;letter-spacing:.12em!important}
  .kol-report-page .report-legend{gap:19px!important;min-width:245px!important}
  .kol-report-page .report-legend>div{font-size:15px!important;grid-template-columns:12px 1fr auto!important;gap:12px!important}
  .kol-report-page .report-legend i{width:11px!important;height:11px!important;border-radius:50%!important}
  .kol-report-page .report-legend span{font-size:15px!important;color:#4e5c64!important;font-weight:750!important}
  .kol-report-page .report-legend b{font-size:16px!important;color:var(--kol-ci-maroon)!important;font-weight:900!important}
  @media(max-width:900px){
    .kol-report-page .report-chart-card{min-height:390px!important;padding:20px!important}
    .kol-report-page .report-chart-svg{min-height:340px!important}
    .kol-report-page .report-chart-head b{font-size:17px!important}
    .kol-report-page .rchart-title{font-size:16px!important}.kol-report-page .rchart-value{font-size:17px!important}
    .kol-report-page .rchart-label,.kol-report-page .rchart-label-strong{font-size:14px!important}
    .kol-report-page .rchart-axis,.kol-report-page .rchart-axis-heading{font-size:12px!important}
  }
  /* Final chart legibility: designed for the actual two-column report cards. */
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .report-chart-revenue .rchart-bar,.kol-report-page .rchart-bar{shape-rendering:geometricPrecision!important}
  .kol-report-page .report-chart-card{isolation:isolate!important}

  @media(max-width:560px){
    .kol-report-page .report-chart-card{min-height:350px!important;padding:18px!important;border-radius:16px!important}
    .kol-report-page .report-chart-svg{min-height:340px!important;height:auto!important;overflow:visible!important}
    .kol-report-page .report-donut-wrap{min-height:300px!important;gap:18px!important}
    .kol-report-page .report-donut{width:150px!important;height:150px!important;flex-basis:150px!important}
    .kol-report-page .report-donut>div{width:108px!important;height:108px!important}
    .kol-report-page .report-donut strong{font-size:28px!important}.kol-report-page .report-donut span{font-size:9px!important}
    .kol-report-page .report-legend{min-width:120px!important;gap:11px!important}
    .kol-report-page .report-legend>div{font-size:11px!important;grid-template-columns:9px 1fr auto!important;gap:8px!important}
    .kol-report-page .report-legend span{font-size:11px!important}.kol-report-page .report-legend b{font-size:12px!important}
  }
 `; document.head.appendChild(s);
})();


/* REPORTS · LUXURY MONOCHROME CHART SYSTEM · 20261006 */
(function(){
 const styleId='kol-ids-reports-luxury-monochrome-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
 .kol-report-page .report-chart-grid{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:20px!important}
 .kol-report-page .report-chart-card{min-width:0!important;min-height:430px!important;padding:22px 22px 20px!important;background:#fff!important;border:1px solid #d8d8d8!important;border-radius:18px!important;box-shadow:0 12px 35px rgba(0,0,0,.055)!important;overflow:hidden!important}
 .kol-report-page .report-chart-head{display:flex!important;justify-content:space-between!important;align-items:baseline!important;gap:18px!important;margin:0 0 14px!important;padding:0 0 15px!important;border-bottom:1px solid #e6e6e6!important}
 .kol-report-page .report-chart-head b{font-size:16px!important;line-height:1.2!important;font-weight:800!important;letter-spacing:-.025em!important;color:#111!important}
 .kol-report-page .report-chart-head span{font-size:11px!important;line-height:1.2!important;font-weight:650!important;letter-spacing:.08em!important;text-transform:uppercase!important;color:#777!important;white-space:nowrap!important}
 .kol-report-page .report-chart-svg{width:100%!important;height:auto!important;min-height:350px!important;display:block!important;overflow:visible!important}
 .kol-report-page .rchart-title{font-size:15px!important;fill:#111!important;font-weight:800!important}
 .kol-report-page .rchart-value{font-size:15px!important;fill:#111!important;font-weight:850!important}
 .kol-report-page .rchart-share{font-size:14px!important;fill:#333!important;font-weight:800!important}
 .kol-report-page .rchart-label{font-size:14px!important;fill:#555!important;font-weight:600!important}
 .kol-report-page .rchart-label-strong{font-size:15px!important;fill:#111!important;font-weight:750!important}
 .kol-report-page .rchart-axis{font-size:13px!important;fill:#777!important;font-weight:550!important}
 .kol-report-page .rchart-axis-heading{font-size:13px!important;fill:#555!important;font-weight:700!important}
 .kol-report-page .rchart-legend{font-size:13px!important;fill:#333!important;font-weight:700!important}
 .kol-report-page .rchart-point-value{font-size:14px!important;fill:#111!important;font-weight:850!important}
 .kol-report-page .rchart-gridline{stroke:#e3e3e3!important;stroke-width:1!important}
 .kol-report-page .rchart-bar{fill:#111!important}
 .kol-report-page .rchart-bar-track{fill:#eeeeee!important}
 .kol-report-page .rchart-line-a{stroke:#111!important;stroke-width:4!important;stroke-linecap:round!important;stroke-linejoin:round!important}
 .kol-report-page .rchart-line-b{stroke:#777!important;stroke-width:3.5!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-dasharray:9 7!important}
 .kol-report-page .rchart-dot-a{fill:#111!important}
 .kol-report-page .rchart-dot-b{fill:#fff!important;stroke:#555!important;stroke-width:2.5!important}
 .kol-report-page .rchart-footnote{font-size:12px!important;fill:#777!important}
 .kol-report-page .report-chart-empty{height:350px!important;min-height:350px!important;display:grid!important;place-items:center!important;border:1px dashed #cfcfcf!important;border-radius:12px!important;color:#777!important;background:#fafafa!important;font-size:14px!important}
 .kol-report-page .report-donut-wrap{min-height:350px!important;height:350px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:42px!important}
 .kol-report-page .report-donut{width:205px!important;height:205px!important;flex:0 0 205px!important;border-radius:50%!important;display:grid!important;place-items:center!important}
 .kol-report-page .report-donut>div{width:126px!important;height:126px!important;border-radius:50%!important;background:#fff!important;box-shadow:0 0 0 1px #eee!important}
 .kol-report-page .report-donut strong{font-size:34px!important;line-height:1!important;font-weight:850!important;letter-spacing:-.04em!important;color:#111!important}
 .kol-report-page .report-donut span{font-size:11px!important;color:#777!important;letter-spacing:.12em!important;text-transform:uppercase!important;font-weight:700!important}
 .kol-report-page .report-legend{display:grid!important;gap:17px!important;min-width:185px!important}
 .kol-report-page .report-legend>div{display:grid!important;grid-template-columns:12px 1fr auto!important;gap:11px!important;align-items:center!important;font-size:14px!important}
 .kol-report-page .report-legend i{width:11px!important;height:11px!important;border-radius:50%!important;box-shadow:0 0 0 1px rgba(0,0,0,.08)!important}
 .kol-report-page .report-legend span{color:#555!important;font-weight:650!important}
 .kol-report-page .report-legend b{color:#111!important;font-size:15px!important;font-weight:850!important}
 @media(max-width:1100px){
   .kol-report-page .report-chart-grid{grid-template-columns:1fr!important}
   .kol-report-page .report-chart-card{min-height:410px!important}
 }
 @media(max-width:560px){
   .kol-report-page .report-chart-card{padding:16px!important;min-height:350px!important;border-radius:15px!important}
   .kol-report-page .report-chart-head b{font-size:14px!important}
   .kol-report-page .report-chart-head span{font-size:9px!important}
   .kol-report-page .report-chart-svg{min-height:340px!important;height:auto!important;overflow:visible!important}
   .kol-report-page .report-donut-wrap{height:290px!important;min-height:290px!important;gap:18px!important}
   .kol-report-page .report-donut{width:145px!important;height:145px!important;flex-basis:145px!important}
   .kol-report-page .report-donut>div{width:90px!important;height:90px!important}
   .kol-report-page .report-donut strong{font-size:25px!important}
   .kol-report-page .report-legend{min-width:115px!important;gap:11px!important}
   .kol-report-page .report-legend>div{font-size:11px!important}
   .kol-report-page .report-legend b{font-size:12px!important}
 }
 `;document.head.appendChild(s);
})();

/* KOL IDS · FINAL CI MASTER OVERRIDE · #AEEFFF #CDF5FF #C8A96B #B29A6B */
(function(){
 const styleId='kol-ids-final-ci-master-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  .kol-report-page .report-chart-card{background:#fff!important;border:1px solid #D9DEE1!important;border-radius:18px!important;box-shadow:0 16px 44px rgba(20,22,30,.055)!important;padding:24px 24px 22px!important;overflow:visible!important}
  .kol-report-page .report-chart-head{margin-bottom:16px!important;padding-bottom:15px!important;border-bottom:1px solid #E8ECEE!important}
  .kol-report-page .report-chart-head b{font-size:17px!important;line-height:1.25!important;font-weight:850!important;color:#111!important;letter-spacing:-.025em!important}
  .kol-report-page .report-chart-head span{font-size:11px!important;font-weight:750!important;letter-spacing:.08em!important;text-transform:uppercase!important;color:#737A7E!important}
  .kol-report-page .report-chart-svg{width:100%!important;height:auto!important;min-height:370px!important;display:block!important;overflow:visible!important}
  .kol-report-page .rchart-title{font-size:16px!important;fill:#111!important;font-weight:850!important}
  .kol-report-page .rchart-value{font-size:17px!important;fill:#111!important;font-weight:900!important}
  .kol-report-page .rchart-share{font-size:16px!important;fill:#B29A6B!important;font-weight:900!important}
  .kol-report-page .rchart-label{font-size:14px!important;fill:#5D666B!important;font-weight:650!important}
  .kol-report-page .rchart-label-strong{font-size:15px!important;fill:#111!important;font-weight:850!important}
  .kol-report-page .rchart-axis{font-size:13px!important;fill:#747D82!important;font-weight:650!important}
  .kol-report-page .rchart-axis-heading{font-size:13px!important;fill:#555!important;font-weight:750!important}
  .kol-report-page .rchart-legend{font-size:13px!important;fill:#6B4F28!important;font-weight:750!important}
  .kol-report-page .rchart-point-value{font-size:15px!important;fill:#111!important;font-weight:900!important}
  .kol-report-page .rchart-date-label{font-size:13px!important;fill:#5D666B!important;font-weight:750!important}
  .kol-report-page .rchart-gridline{stroke:#E4E9EB!important;stroke-width:1!important}
  .kol-report-page .rchart-line-a{stroke:#111!important;stroke-width:4!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important}
  .kol-report-page .rchart-line-b{stroke:#B29A6B!important;stroke-width:3.5!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-dasharray:9 7!important;fill:none!important}
  .kol-report-page .rchart-dot-a{fill:#111!important}
  .kol-report-page .rchart-dot-b{fill:#D9B77A!important;stroke:#FFF8E8!important;stroke-width:3!important}
  .kol-report-page .rchart-dot-a-text,.kol-report-page .rchart-dot-b-text{fill:#111!important}
  .kol-report-page .rchart-bar{fill:#AEEFFF!important;opacity:1!important}
  .kol-report-page .rchart-bar-track{fill:#CDF5FF!important;stroke:#DDE7EA!important;stroke-width:1!important}
  .kol-report-page .report-chart-revenue .rchart-bar{fill:#C8A96B!important;opacity:1!important}
  .kol-report-page .report-chart-revenue .rchart-bar-track{fill:#CDF5FF!important;stroke:#D9E5E8!important}
  .kol-report-page .report-chart-revenue .rchart-share{fill:#B29A6B!important}
  .kol-report-page .report-chart-empty{height:370px!important;min-height:370px!important;display:grid!important;place-items:center!important;border:1px dashed #D4DADC!important;border-radius:14px!important;color:#6F787D!important;background:linear-gradient(180deg,#fff,#FAFCFC)!important;font-size:14px!important;font-weight:700!important}
  .kol-report-page .report-donut-wrap{min-height:370px!important;height:370px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:46px!important}
  .kol-report-page .report-donut{width:220px!important;height:220px!important;flex:0 0 220px!important;border-radius:50%!important;display:grid!important;place-items:center!important;box-shadow:0 0 0 1px #EEF2F3!important}
  .kol-report-page .report-donut>div{width:142px!important;height:142px!important;border-radius:50%!important;background:#fff!important;box-shadow:0 7px 24px rgba(20,22,30,.06)!important}
  .kol-report-page .report-donut strong{font-size:39px!important;line-height:1!important;font-weight:900!important;letter-spacing:-.045em!important;color:#111!important}
  .kol-report-page .report-donut span{font-size:11px!important;color:#747D82!important;letter-spacing:.14em!important;text-transform:uppercase!important;font-weight:800!important}
  .kol-report-page .report-legend{display:grid!important;gap:18px!important;min-width:205px!important}
  .kol-report-page .report-legend>div{display:grid!important;grid-template-columns:12px 1fr auto!important;gap:11px!important;align-items:center!important;font-size:14px!important}
  .kol-report-page .report-legend i{width:12px!important;height:12px!important;border-radius:50%!important;box-shadow:0 0 0 1px rgba(0,0,0,.07)!important}
  .kol-report-page .report-legend span{color:#505A60!important;font-weight:700!important}
  .kol-report-page .report-legend b{color:#111!important;font-size:15px!important;font-weight:900!important}
  @media(max-width:1100px){
    .kol-report-page .report-chart-grid{grid-template-columns:1fr!important}
    .kol-report-page .report-chart-card{min-height:410px!important}
  }
  @media(max-width:560px){
    .kol-report-page .report-chart-card{padding:18px!important;min-height:360px!important;border-radius:16px!important}
    .kol-report-page .report-chart-head b{font-size:15px!important}
    .kol-report-page .report-chart-head span{font-size:9px!important}
    .kol-report-page .report-chart-svg{min-height:340px!important}
    .kol-report-page .rchart-value{font-size:15px!important}
    .kol-report-page .rchart-label,.kol-report-page .rchart-label-strong{font-size:13px!important}
    .kol-report-page .rchart-axis{font-size:11px!important}
    .kol-report-page .report-donut-wrap{height:300px!important;min-height:300px!important;gap:18px!important}
    .kol-report-page .report-donut{width:155px!important;height:155px!important;flex-basis:155px!important}
    .kol-report-page .report-donut>div{width:100px!important;height:100px!important}
    .kol-report-page .report-donut strong{font-size:28px!important}
    .kol-report-page .report-legend{min-width:125px!important;gap:11px!important}
    .kol-report-page .report-legend>div{font-size:11px!important;grid-template-columns:9px 1fr auto!important;gap:8px!important}
    .kol-report-page .report-legend i{width:9px!important;height:9px!important}
    .kol-report-page .report-legend b{font-size:12px!important}
  }
 `;document.head.appendChild(s);
})();


/* REPORTS SYSTEM CYAN ALIGNMENT · 20261006 */
(function(){
 const styleId='kol-ids-reports-system-cyan-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  :root{
    --report-cyan-1:#AEEFFF;
    --report-cyan-2:#D7F7FC;
    --report-cyan-3:#8FD6E3;
    --report-cyan-4:#46C5DC;
    --report-cyan-ink:#315D68;
    --report-cyan-deep:#244B55;
    --report-cyan-line:#CDEEF4;
    --report-cyan-track:#F0FBFD;
    --report-success:#4BAA7A;
    --report-success-soft:#E8F7F0;
    --report-success-line:#C7E8D8;
  }
  /* Keep Reports visually consistent with the system's cyan status language. */
  .kol-report-page .report-chart-card{
    background:linear-gradient(180deg,#FFFFFF 0%,#FBFEFE 100%)!important;
    border-color:#CDEEF4!important;
    box-shadow:0 8px 28px rgba(49,93,104,.045)!important;
  }
  .kol-report-page .report-chart-head{border-bottom-color:#E6F3F6!important}
  .kol-report-page .report-chart-head b{color:var(--report-cyan-ink)!important}
  .kol-report-page .report-chart-head span{color:#7898A2!important}
  .kol-report-page .rchart-title{fill:#648692!important}
  .kol-report-page .rchart-value{fill:#3F6875!important}
  .kol-report-page .rchart-label{fill:#6F8D96!important}
  .kol-report-page .rchart-label-strong{fill:#527684!important}
  .kol-report-page .rchart-axis{fill:#91AAB2!important}
  .kol-report-page .rchart-axis-heading{fill:#6F8D96!important}
  .kol-report-page .rchart-legend{fill:#648692!important}
  .kol-report-page .rchart-gridline{stroke:#E3F1F4!important}
  .kol-report-page .rchart-bar{fill:#8FD6E3!important}
  .kol-report-page .rchart-bar-track{fill:#EAF9FF!important;stroke:#D8EEF3!important}
  .kol-report-page .rchart-line-a{stroke:#46BBD1!important}
  .kol-report-page .rchart-line-b{stroke:#4BAA7A!important}
  .kol-report-page .rchart-dot-a{fill:#46BBD1!important}
  .kol-report-page .rchart-dot-b{fill:#4BAA7A!important;stroke:#fff!important}
  .kol-report-page .rchart-dot-a-text{fill:#315D68!important}
  .kol-report-page .rchart-dot-b-text{fill:#247653!important}
  .kol-report-page .rchart-share{fill:#527684!important}
  .kol-report-page .report-chart-revenue .rchart-bar{fill:#A9DFC4!important}
  .kol-report-page .report-chart-revenue .rchart-bar-track{fill:#EAF9FF!important;stroke:#D8EEF3!important}
  .kol-report-page .report-chart-empty{
    border-color:#CDEEF4!important;
    background:linear-gradient(180deg,#F7FDFE,#FFFFFF)!important;
    color:#648692!important;
  }
  .kol-report-page .report-donut{
    box-shadow:0 0 0 1px #DCEFF3!important;
  }
  .kol-report-page .report-donut>div{
    background:#fff!important;
    box-shadow:0 7px 24px rgba(82,118,132,.06)!important;
  }
  .kol-report-page .report-donut strong{color:#315D68!important}
  .kol-report-page .report-donut span{color:#7898A2!important}
  .kol-report-page .report-legend i{border-color:#DCEFF3!important}
  .kol-report-page .report-legend span{color:#648692!important}
  .kol-report-page .report-legend b{color:#315D68!important}
  .kol-report-page .report-legend i[style*='A9DFC4'],.kol-report-page .report-legend i[style*='4BAA7A']{box-shadow:0 0 0 2px #E8F7F0!important}

  /* COMPLETE stays the system success state: green, not cyan. */
  .kol-report-page .pill.good,
  .kol-report-page .history-status.complete{
    background:#E8F7F0!important;
    border-color:#C7E8D8!important;
    color:#247653!important;
  }
 `;
 document.head.appendChild(s);
})();


/* KOL IDS · REPORT DECISION-GRADE POLISH · 20261006 */
(function(){
 const styleId='kol-ids-report-decision-grade-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  /* Active navigation: clearer selected state without changing the dark system. */
  .kol-nav button.active{
    background:linear-gradient(90deg,rgba(79,215,232,.34),rgba(79,215,232,.13))!important;
    border-color:rgba(174,239,255,.58)!important;
    color:#fff!important;
    box-shadow:inset 3px 0 0 #AEEFFF,0 7px 20px rgba(0,0,0,.18)!important;
  }
  .kol-nav button.active .nav-icon{
    background:#AEEFFF!important;color:#102a30!important;
    box-shadow:0 0 0 1px rgba(174,239,255,.55),0 5px 16px rgba(79,215,232,.2)!important;
  }
  .kol-nav button.active .nav-copy small{color:#D7F7FC!important}
  /* Report chart system: cyan + green only; no gold/violet. */
  .kol-report-page .report-chart-card{
    background:linear-gradient(180deg,#fff 0%,#fbfeff 100%)!important;
    border-color:#CDEEF4!important;
  }
  .kol-report-page .report-chart-head b{color:#315D68!important}
  .kol-report-page .report-chart-head span{color:#7898A2!important}
  .kol-report-page .rchart-line-a{stroke:#2F9EB5!important;stroke-width:3.1!important}
  .kol-report-page .rchart-line-b{stroke:#4BAA7A!important;stroke-width:2.8!important;stroke-dasharray:8 6!important}
  .kol-report-page .rchart-dot-a{fill:#2F9EB5!important}
  .kol-report-page .rchart-dot-b{fill:#4BAA7A!important;stroke:#fff!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-a-text{fill:#247F95!important}
  .kol-report-page .rchart-dot-b-text{fill:#247653!important}
  .kol-report-page .rchart-point-value{font-size:14px!important;font-weight:900!important}
  .kol-report-page .rchart-value{fill:#315D68!important}
  .kol-report-page .rchart-share{fill:#247F95!important}
  .kol-report-page .report-chart-revenue .rchart-bar{fill:#8FD6E3!important}
  .kol-report-page .report-chart-revenue .rchart-bar-track{fill:#EAF9FF!important;stroke:#D8EEF3!important}
  .kol-report-page .rchart-bar{fill:#8FD6E3!important}
  .kol-report-page .rchart-bar-track{fill:#EAF9FF!important;stroke:#D8EEF3!important}
  .kol-report-page .rchart-gridline{stroke:#E3F1F4!important}
  .kol-report-page .rchart-axis{fill:#91AAB2!important}
  .kol-report-page .rchart-label,.kol-report-page .rchart-date-label{fill:#5F7C86!important}
  .kol-report-page .rchart-label-strong{fill:#315D68!important}
  .kol-report-page .rchart-legend{fill:#527684!important}
  .kol-report-page .report-donut strong{color:#315D68!important}
  .kol-report-page .report-donut span{color:#7898A2!important}
  .kol-report-page .report-legend span{color:#527684!important}
  .kol-report-page .report-legend b{color:#315D68!important}
  .kol-report-page .hero-actions .btn{white-space:nowrap}
  @media(max-width:900px){.kol-report-page .hero-actions{gap:6px}.kol-report-page .hero-actions .btn{font-size:9px;padding:9px 10px}}
 `;
 document.head.appendChild(s);
})();


/* REPORT CHART PALETTE FINAL · SOFT CYAN ONLY · 20261006 */
(function(){
 const styleId='kol-ids-report-chart-soft-cyan-final-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  /* One family only: blue/cyan descending into lighter tints. No gold, brown or green. */
  .kol-report-page .rchart-line-a{stroke:#2D9FB7!important;stroke-width:3.2!important;opacity:1!important;fill:none!important}
  .kol-report-page .rchart-line-b{stroke:#8AD8E5!important;stroke-width:3!important;opacity:1!important;stroke-dasharray:8 6!important;fill:none!important}
  .kol-report-page .rchart-dot-a{fill:#2D9FB7!important;stroke:#fff!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-b{fill:#8AD8E5!important;stroke:#fff!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-a-text,.kol-report-page .rchart-dot-b-text{fill:#111!important}
  .kol-report-page .rchart-point-value,
  .kol-report-page .rchart-value,
  .kol-report-page .rchart-share,
  .kol-report-page .rchart-label,
  .kol-report-page .rchart-label-strong,
  .kol-report-page .rchart-axis,
  .kol-report-page .rchart-axis-heading,
  .kol-report-page .rchart-legend,
  .kol-report-page .rchart-date-label,
  .kol-report-page .rchart-title{fill:#111!important;color:#111!important}
  .kol-report-page .rchart-gridline{stroke:#E7F2F5!important;stroke-width:1!important}
  .kol-report-page .rchart-bar{fill:#8FD8E5!important;opacity:1!important}
  .kol-report-page .rchart-bar-track{fill:#F2FBFD!important;stroke:#DCEFF3!important;stroke-width:1!important}
  .kol-report-page .report-chart-revenue .rchart-bar{fill:#8FD8E5!important;opacity:1!important}
  .kol-report-page .report-chart-revenue .rchart-share{fill:#111!important}
  .kol-report-page .rchart-revenue-bar-0{fill:#69C9DB!important}
  .kol-report-page .rchart-revenue-bar-1{fill:#8DD9E5!important}
  .kol-report-page .rchart-revenue-bar-2{fill:#AFE6EE!important}
  .kol-report-page .rchart-revenue-bar-3{fill:#D0F1F5!important}
  .kol-report-page .report-donut{box-shadow:0 0 0 1px #E2F1F4!important}
  .kol-report-page .report-donut strong{color:#111!important}
  .kol-report-page .report-donut span{color:#111!important}
  .kol-report-page .report-legend span,.kol-report-page .report-legend b{color:#111!important}
  .kol-report-page .report-legend i{box-shadow:0 0 0 1px rgba(17,17,17,.06)!important;border-color:#E2F1F4!important}
  .kol-report-page .report-chart-head b{color:#315D68!important}
  .kol-report-page .report-chart-head span{color:#6D8D97!important}
 `;document.head.appendChild(s);
})();

/* DECISION-GRADE EXPORT HELPERS */
function reportDecisionSignal(snap){
 const i=snap.impact||{}, rows=snap.decisionRows||[], perf=snap.perf||[];
 const next=buildNextInvestmentDecision({rows:perf,roi:i.roi,roas:i.roas,ctr:i.ctr,convRate:i.conversionRate})||{};
 const approved=rows.filter(x=>String(x.decision?.decision||'').toUpperCase().includes('APPROVE')).length;
 const top=rows.slice().sort((a,b)=>(Number(b.decision?.score)||0)-(Number(a.decision?.score)||0))[0];
 const verified=perf.filter(x=>String(x.metadata?.evidenceConfidence||x.source||'').toUpperCase().includes('VER')).length;
 const quality=perf.length?(verified/perf.length*100):0;
 const action=next.recommendation|| (top?`Prioritize ${top.creator.name}`:'Hold allocation pending stronger evidence');
 const rationale=next.reason||snap.learning?.friction||'Use observed evidence and add another measurement before scaling.';
 return {next,approved,top,verified,quality,action,rationale};
}
function pdfDecisionSummary(doc,ctx,snap){
 const d=reportDecisionSignal(snap),i=snap.impact||{};
 pdfSection(doc,ctx,'Executive decision summary','01 · decision-ready interpretation');
 pdfNarrative(doc,ctx,'Recommended action',`${d.action}. ${d.rationale}`);
 pdfRows(doc,ctx,['Signal','Observed','Decision use'],[
  ['Evidence records',snap.perf.length,d.quality>=70?'Strong enough to use with normal controls':'Treat as directional; increase evidence quality before major allocation changes'],
  ['Creators approved',d.approved||snap.decisionRows.length,d.top?`Highest observed fit: ${d.top.creator.name} (${Math.round(d.top.decision.score||0)}/100)`:'No clear creator leader yet'],
  ['Revenue',i.revenue==null?'Not recorded':pdfFmt(i.revenue,'THB'),i.revenue==null?'Do not infer commercial return':'Observed commercial outcome'],
  ['Spend',i.spend==null?'Not recorded':pdfFmt(i.spend,'THB'),i.spend==null?'Unit economics unavailable':'Compare against revenue / outcome'],
  ['ROAS',i.roas==null?'Not calculable':pdfFmt(i.roas,'x'),i.roas==null?'Requires revenue + spend':'Use as observed efficiency signal'],
  ['ROI',i.roi==null?'Not calculable':pdfFmt(i.roi,'%'),i.roi==null?'Requires revenue + spend':'Use as observed return signal'],
  ['Evidence quality',`${Math.round(d.quality)}% verified`,d.quality>=70?'Higher-confidence operating evidence':'Add verified source records']
 ],[42,52,74]);
 if(d.next.threshold) pdfNarrative(doc,ctx,'Success threshold',d.next.threshold);
 if(Array.isArray(d.next.tests)) d.next.tests.slice(0,3).forEach((x,n)=>pdfNarrative(doc,ctx,`Decision test ${n+1}`,x));
}
function pdfEvidenceQuality(doc,ctx,snap){
 const i=snap.impact||{},p=snap.perf||[];
 pdfSection(doc,ctx,'Evidence quality & limitations','06 · controls');
 const verified=p.filter(x=>String(x.metadata?.evidenceConfidence||x.source||'').toUpperCase().includes('VER')).length;
 const self=p.filter(x=>String(x.source||'').toUpperCase().includes('SELF')).length;
 const estimated=p.filter(x=>String(x.source||'').toUpperCase().includes('EST')).length;
 pdfRows(doc,ctx,['Control','Status','Why it matters'],[
  ['Revenue evidence',i.hasRevenue?'AVAILABLE':'MISSING',i.hasRevenue?'Commercial conclusions can reference observed revenue':'Do not claim ROI / ROAS'],
  ['Spend evidence',i.hasSpend?'AVAILABLE':'MISSING',i.hasSpend?'Efficiency can be calculated when paired with revenue':'Unit economics remain incomplete'],
  ['Conversion evidence',i.hasConversionEvidence?'AVAILABLE':'MISSING',i.hasConversionEvidence?'Conversion outcomes are observable':'Do not overstate sales impact'],
  ['Verified records',verified,verified?'Higher-trust source coverage':'Increase source verification'],
  ['Self-reported records',self,self?'Useful but should be distinguished from verified evidence':'None recorded'],
  ['Estimated records',estimated,estimated?'Directional only; avoid treating as actual':'None recorded'],
  ['Click evidence',i.hasClickEvidence?'AVAILABLE':'MISSING',i.hasClickEvidence?'Traffic response can be assessed':'CTR / CVR may be unavailable']
 ],[42,32,94]);
 pdfNarrative(doc,ctx,'Use rule','KOL IDS exports preserve provenance. Decision makers should distinguish observed, self-reported, estimated and missing evidence before changing budget, creator selection or campaign strategy.');
}

/* Override report PDFs with decision-grade content while preserving the existing data model. */
function downloadDecisionPDF(){
 exportGateOr(()=>{
  const snap=reportLiveSnapshot(),rows=snap.decisionRows||[];
  if(!rows.length){toast('Run creator fit calculation first.','error');return}
  if(!window.jspdf?.jsPDF){window.print();return}
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});
  const ctx=pdfEnterprise(doc,'Creator Decision Report','Decision-ready creator selection · evidence quality · deployment guidance');ctx.y=39;
  const d=reportDecisionSignal(snap);
  pdfMetricGrid(doc,ctx,[{label:'Creators evaluated',value:rows.length},{label:'Approved',value:d.approved},{label:'Average fit',value:(rows.reduce((a,x)=>a+(Number(x.decision.score)||0),0)/rows.length).toFixed(1)},{label:'Evidence quality',value:`${Math.round(d.quality)}% verified`}]);
  pdfDecisionSummary(doc,ctx,snap);
  pdfSection(doc,ctx,'Decision register','02 · portfolio view');
  pdfRows(doc,ctx,['Creator','Decision','Fit','Audience','Content','Brand','Performance','Commercial','Risk','Confidence'],rows.map(({creator:r,decision:x})=>{const e=x.evidence||{};return [r.name,x.decision||'—',x.score==null?'—':Math.round(x.score),Math.round(e.audienceFit??50),Math.round(e.contentFit??50),Math.round(e.brandFit??50),Math.round(e.performance??0),Math.round(e.commercial??50),Math.round(e.risk??50),Math.round(e.confidence??0)]}),[30,24,13,13,13,13,14,14,11,15]);
  pdfSection(doc,ctx,'Deployment guidance','03 · how to use the decision');
  rows.slice().sort((a,b)=>(Number(b.decision.score)||0)-(Number(a.decision.score)||0)).forEach(({creator:r,decision:x})=>{
    const e=x.evidence||{};
    pdfNarrative(doc,ctx,r.name,`Decision: ${x.decision||'—'} · Fit ${x.score==null?'—':Math.round(x.score)}/100 · Confidence ${Math.round(e.confidence??0)}/100. Best use: ${e.ifSelected||creatorAdaptation(e)||'Use only within the stated campaign objective.'} Campaign move: ${e.campaignMove||creatorAdaptation(e)||'Validate with observed performance before scaling.'}`);
  });
  pdfEvidenceQuality(doc,ctx,snap);
  doc.save(pdfSaveName('KOL-IDS_Creator-Decision',S.selectedCampaign?.name));
 });
}

function downloadPerformancePDF(){
 exportGateOr(()=>{
  const snap=reportLiveSnapshot(),rows=snap.perf||[],campaign=snap.p||{};
  if(!window.jspdf?.jsPDF){window.print();return}
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});
  const ctx=pdfEnterprise(doc,'Performance Evidence Report','Observed performance · source provenance · efficiency · operational interpretation');ctx.y=39;
  const i=snap.impact||{},d=reportDecisionSignal(snap);
  pdfMetricGrid(doc,ctx,[{label:'Records',value:rows.length},{label:'Revenue',value:i.revenue==null?'Not recorded':pdfFmt(i.revenue,'THB')},{label:'Spend',value:i.spend==null?'Not recorded':pdfFmt(i.spend,'THB')},{label:'ROAS',value:i.roas==null?'Not calculable':pdfFmt(i.roas,'x')}]);
  pdfSection(doc,ctx,'Executive interpretation','01 · what the evidence means');
  pdfNarrative(doc,ctx,'Operating conclusion',rows.length?`${d.action}. ${d.rationale}`:'No performance evidence is recorded yet; commercial and creator-performance conclusions remain unavailable.');
  pdfRows(doc,ctx,['Metric','Observed','Interpretation'],[
    ['Revenue',i.revenue==null?'Not recorded':pdfFmt(i.revenue,'THB'),i.revenue==null?'Missing evidence':'Observed revenue'],
    ['Spend',i.spend==null?'Not recorded':pdfFmt(i.spend,'THB'),i.spend==null?'Missing evidence':'Observed spend'],
    ['ROAS',i.roas==null?'Not calculable':pdfFmt(i.roas,'x'),i.roas==null?'Requires revenue + spend':'Observed revenue / spend'],
    ['ROI',i.roi==null?'Not calculable':pdfFmt(i.roi,'%'),i.roi==null?'Requires revenue + spend':'Observed return after spend'],
    ['CTR',i.ctr==null?'Not calculable':pdfFmt(i.ctr,'%'),i.ctr==null?'Needs impressions + clicks':'Traffic response'],
    ['Engagement rate',i.engagementRate==null?'Not calculable':pdfFmt(i.engagementRate,'%'),i.engagementRate==null?'Needs impressions + engagement':'Audience response'],
    ['Conversion rate',i.conversionRate==null?'Not calculable':pdfFmt(i.conversionRate,'%'),i.conversionRate==null?'Needs clicks + conversions':'Conversion efficiency']
  ],[42,48,78]);
  pdfSection(doc,ctx,'Evidence register','02 · all linked observations');
  if(!rows.length) pdfNarrative(doc,ctx,'Status','No performance records were recorded for this campaign.');
  else pdfRows(doc,ctx,['Creator','Type','Observed','Channel / Event','Source','Confidence','Outcome','Content / Code'],rows.map(x=>[S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',String(x.metadata?.channelType||'PERFORMANCE'),x.observed_at||'—',x.metadata?.platform||x.metadata?.eventType||'—',x.source||'—',x.metadata?.evidenceConfidence||x.source||'—',x.actual_score==null?'Pending':`${Math.round(x.actual_score)}/100`,x.metadata?.contentId||x.metadata?.genCode||'—']),[31,20,18,28,19,20,18,22]);
  pdfSection(doc,ctx,'Operational detail','03 · execution record');
  rows.forEach((x,n)=>{
    const m=x.metadata||{},type=String(m.channelType||'PERFORMANCE').toUpperCase();
    pdfPageBreak(doc,ctx,32);
    pdfNarrative(doc,ctx,`${n+1}. ${S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator'} · ${type}`,`Observed ${x.observed_at||'—'} · Source ${x.source||'—'} · Confidence ${m.evidenceConfidence||x.source||'—'} · Outcome ${x.actual_score==null?'Pending':Math.round(x.actual_score)+'/100'}.`);
    let pairs=[];
    if(type==='DIGITAL') pairs=[['Platform',m.platform],['Content / Post ID',m.contentId],['Spend',pdfFmt(x.spend_thb,'THB')],['Revenue',pdfFmt(x.revenue_thb,'THB')],['Reach',pdfFmt(x.reach)],['Impressions',pdfFmt(x.impressions)],['Views',pdfFmt(x.views)],['Likes',pdfFmt(x.likes)],['Comments',pdfFmt(x.comments)],['Shares',pdfFmt(x.shares)],['Saves',pdfFmt(m.saves)],['Clicks',pdfFmt(x.clicks)],['Landing sessions',pdfFmt(m.landingSessions)],['Leads',pdfFmt(m.leads)],['Conversions',pdfFmt(x.conversions)],['Engagement',pdfFmt(x.engagement)],['Content pieces',pdfFmt(m.contentPieces)]];
    else if(type==='ECOMMERCE') pairs=[['Shop / platform',m.platform],['Spend / creator fee',pdfFmt(x.spend_thb,'THB')],['GMV',pdfFmt(m.gmv,'THB')],['Discounts',pdfFmt(m.discounts,'THB')],['Refunds',pdfFmt(m.refunds,'THB')],['Net sales',pdfFmt(m.netSales??x.revenue_thb,'THB')],['Orders',pdfFmt(m.orders)],['Paid orders',pdfFmt(m.paidOrders??x.conversions)],['Clicks / sessions',pdfFmt(x.clicks)],['New customers',pdfFmt(m.newCustomers)],['Commission rate',pdfFmt(m.commissionRate,'%')],['Commission amount',pdfFmt(m.commissionAmount,'THB')],['AOV',pdfFmt(m.aov,'THB')]];
    else pairs=[['Event type',m.eventType],['Spend',pdfFmt(x.spend_thb,'THB')],['Revenue',pdfFmt(x.revenue_thb,'THB')],['Capacity',pdfFmt(m.capacity)],['Attendance',pdfFmt(m.attendance)],['Qualified leads',pdfFmt(m.qualifiedLeads)],['QR scans',pdfFmt(m.qrScans)],['Demos',pdfFmt(m.demos)],['Samples',pdfFmt(m.samples)],['Engagement',pdfFmt(x.engagement)],['Conversions',pdfFmt(x.conversions)],['Notes',m.notes]];
    pdfRows(doc,ctx,['Metric','Observed value'],pairs,[58,122]);
  });
  pdfEvidenceQuality(doc,ctx,snap);
  doc.save(pdfSaveName('KOL-IDS_Performance',S.selectedCampaign?.name));
 });
}

function downloadImpactPDF(){
 exportGateOr(()=>{
  const snap=reportLiveSnapshot(),i=snap.impact||{},l=snap.learning||{};
  if(!window.jspdf?.jsPDF){window.print();return}
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});
  const ctx=pdfEnterprise(doc,'Business Impact Report','Observed commercial outcomes · efficiency · learning · next investment decision');ctx.y=39;
  const d=reportDecisionSignal(snap);
  pdfMetricGrid(doc,ctx,[{label:'Impact score',value:i.score==null?'Not scored':Math.round(i.score)},{label:'Revenue',value:i.revenue==null?'Not recorded':pdfFmt(i.revenue,'THB')},{label:'Spend',value:i.spend==null?'Not recorded':pdfFmt(i.spend,'THB')},{label:'ROAS',value:i.roas==null?'Not calculable':pdfFmt(i.roas,'x')}]);
  pdfDecisionSummary(doc,ctx,snap);
  pdfSection(doc,ctx,'Business impact register','02 · observed outcome metrics');
  pdfRows(doc,ctx,['Metric','Value','Decision interpretation'],[
   ['Revenue',i.revenue==null?'Not recorded':pdfFmt(i.revenue,'THB'),i.revenue==null?'No commercial evidence':'Observed revenue'],
   ['Spend',i.spend==null?'Not recorded':pdfFmt(i.spend,'THB'),i.spend==null?'No cost basis':'Observed spend'],
   ['ROAS',i.roas==null?'Not calculable':pdfFmt(i.roas,'x'),i.roas==null?'Requires revenue + spend':'Efficiency signal'],
   ['ROI',i.roi==null?'Not calculable':pdfFmt(i.roi,'%'),i.roi==null?'Requires revenue + spend':'Return signal'],
   ['Conversions',i.conversions==null?'Not recorded':pdfFmt(i.conversions),'Observed conversions / paid orders'],
   ['Reach',i.reach==null?'Not recorded':pdfFmt(i.reach),'Observed reach'],
   ['Views',i.views==null?'Not recorded':pdfFmt(i.views),'Observed views'],
   ['Clicks',i.clicks==null?'Not recorded':pdfFmt(i.clicks),'Observed clicks / sessions'],
   ['Engagement',i.engagement==null?'Not recorded':pdfFmt(i.engagement),'Observed engagement'],
   ['Attendance',i.attendance==null?'Not recorded':pdfFmt(i.attendance),'Observed event attendance'],
   ['Qualified leads',i.leads==null?'Not recorded':pdfFmt(i.leads),'Observed lead volume']
  ],[42,48,90]);
  pdfSection(doc,ctx,'Learning & next action','03 · reusable operating intelligence');
  pdfNarrative(doc,ctx,'What worked',l.worked||'No learning recorded yet.');
  pdfNarrative(doc,ctx,'Friction',l.friction||'No friction recorded yet.');
  pdfNarrative(doc,ctx,'Next hypothesis',l.hypothesis||'No hypothesis recorded yet.');
  (l.nextActions||[]).slice(0,5).forEach((x,n)=>pdfNarrative(doc,ctx,`Next action ${n+1}`,x));
  pdfEvidenceQuality(doc,ctx,snap);
  doc.save(pdfSaveName('KOL-IDS_Business-Impact',S.selectedCampaign?.name));
 });
}

function downloadFullPDF(){
 exportGateOr(()=>{
  if(!window.jspdf?.jsPDF){window.print();return}
  const snap=reportLiveSnapshot(),{p,perf,digital,ecommerce,offline,decisionRows,impact,learning}=snap;
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});
  const ctx=pdfEnterprise(doc,'Campaign Intelligence Report','Executive decision pack · evidence register · creator decisions · performance · business impact');ctx.y=39;
  const d=reportDecisionSignal(snap);
  pdfMetricGrid(doc,ctx,[{label:'Creators approved',value:decisionRows.length},{label:'Evidence records',value:perf.length},{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')}]);
  pdfDecisionSummary(doc,ctx,snap);
  pdfSection(doc,ctx,'Campaign context','02 · campaign definition');
  pdfRows(doc,ctx,['Field','Observed value'],[
   ['Campaign',S.selectedCampaign?.name||'—'],['Status',S.selectedCampaign?.status||'—'],['Objective',(p.objectives||[]).join(' · ')||p.objective||p.goal||'—'],['Performance model',p.performanceType||'—'],['Budget',pdfFmt(p.budget,'THB')],['Market',p.market||'—'],['Start date',p.startDate||'—'],['End date',p.endDate||'—'],['Audience type',S.selectedAudience?.payload?.audienceType||'—'],['Audience persona',S.selectedAudience?.payload?.audiencePersona||'—']
  ],[58,122]);
  pdfSection(doc,ctx,'Creator decision register','03 · decision evidence');
  if(!decisionRows.length) pdfNarrative(doc,ctx,'Status','No creator decision records were linked to this campaign.');
  else pdfRows(doc,ctx,['Creator','Decision','Overall','Audience','Content','Brand','Performance','Commercial','Risk','Confidence'],decisionRows.map(({creator:r,decision:x})=>{const e=x.evidence||{};return [r.name,x.decision||'—',x.score==null?'—':Math.round(x.score),Math.round(e.audienceFit??50),Math.round(e.contentFit??50),Math.round(e.brandFit??50),Math.round(e.performance??0),Math.round(e.commercial??50),Math.round(e.risk??50),Math.round(e.confidence??0)]}),[30,24,13,13,13,13,14,13,11,15]);
  pdfSection(doc,ctx,'Performance evidence','04 · all linked observations');
  if(!perf.length) pdfNarrative(doc,ctx,'Status','No performance evidence was recorded yet.');
  else pdfRows(doc,ctx,['Creator','Type','Observed','Source','Confidence','Outcome','Content / Code'],perf.map(x=>[S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',String(x.metadata?.channelType||'PERFORMANCE'),x.observed_at||'—',x.source||'—',x.metadata?.evidenceConfidence||x.source||'—',x.actual_score==null?'Pending':`${Math.round(x.actual_score)}/100`,x.metadata?.contentId||x.metadata?.genCode||'—']),[34,22,20,22,23,20,37]);
  pdfSection(doc,ctx,'Business impact','05 · observed commercial effect');
  pdfRows(doc,ctx,['Metric','Value','Interpretation'],[
   ['Revenue',impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB'),impact.revenue==null?'Evidence unavailable':'Observed revenue'],
   ['Spend',impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB'),impact.spend==null?'Evidence unavailable':'Observed spend'],
   ['ROAS',impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x'),impact.roas==null?'Requires revenue + spend':'Revenue ÷ spend'],
   ['ROI',impact.roi==null?'Not calculable':pdfFmt(impact.roi,'%'),impact.roi==null?'Requires revenue + spend':'Observed return'],
   ['Conversions',impact.conversions==null?'Not recorded':pdfFmt(impact.conversions),'Observed conversion count'],
   ['Reach',impact.reach==null?'Not recorded':pdfFmt(impact.reach),'Observed reach'],
   ['Clicks',impact.clicks==null?'Not recorded':pdfFmt(impact.clicks),'Observed clicks / sessions'],
   ['Engagement',impact.engagement==null?'Not recorded':pdfFmt(impact.engagement),'Observed engagement'],
   ['Event attendance',impact.attendance==null?'Not recorded':pdfFmt(impact.attendance),'Observed attendance'],
   ['Qualified leads',impact.leads==null?'Not recorded':pdfFmt(impact.leads),'Observed lead count']
  ],[48,52,80]);
  pdfSection(doc,ctx,'Learning & next investment','06 · institutional memory');
  pdfNarrative(doc,ctx,'What worked',learning.worked);
  pdfNarrative(doc,ctx,'Friction',learning.friction);
  pdfNarrative(doc,ctx,'Next hypothesis',learning.hypothesis);
  const nid=learning.nextInvestmentDecision||d.next||{};
  if(nid.recommendation) pdfNarrative(doc,ctx,'Next investment decision',`${nid.recommendation} · Confidence ${nid.confidence||'—'} · ${nid.reason||''}`);
  if(nid.threshold)pdfNarrative(doc,ctx,'Success threshold',nid.threshold);
  (learning.nextActions||[]).slice(0,5).forEach((x,n)=>pdfNarrative(doc,ctx,`Next action ${n+1}`,x));
  pdfEvidenceQuality(doc,ctx,snap);
  pdfSection(doc,ctx,'Decision use note','07 · governance');
  pdfNarrative(doc,ctx,'How to use this pack','Use the report to approve, hold, reallocate or test investment based on observed evidence. It is designed to support a decision, not to present an unsupported forecast. Where evidence is missing, the report explicitly marks the metric as unavailable rather than filling the gap with an assumption.');
  doc.save(pdfSaveName('KOL-IDS_Full-Decision-Report',S.selectedCampaign?.name));
 });
}



/* CSV EXPORTS · DECISION-GRADE V3 */
function downloadDecisionCSV(){exportGateOr(()=>{
 const snap=reportLiveSnapshot(),rows=snap.decisionRows||[],d=reportDecisionSignal(snap);
 if(!rows.length){toast('Run creator fit calculation first.','error');return}
 const headers=['Campaign','Campaign ID','Creator ID','Creator','Channel','Followers','ER','Decision','Overall Fit','Confidence','Audience Fit','Content Fit','Brand Fit','Performance Fit','Commercial Fit','Risk','Why','If Selected','Campaign Move','Decision Use','Evidence Quality'];
 const out=rows.map(({creator:r,decision:x})=>{const e=x.evidence||{};const q=Number(e.confidence||0)>=70?'Higher':'Directional';return [S.selectedCampaign?.name,S.selectedCampaign?.id,r.id,r.name,r.payload?.channel,r.payload?.followers,r.payload?.engagementRate,x.decision,x.score,e.confidence,e.audienceFit,e.contentFit,e.brandFit,e.performance,e.commercial,e.risk,e.reason,e.ifSelected||creatorAdaptation(e),e.campaignMove||creatorAdaptation(e),String(x.decision||'').toUpperCase().includes('APPROVE')?'Eligible for deployment review':'Hold / review before deployment',q]});
 downloadEnterpriseCSV(`KOL-IDS_Decision_${csvSafeName(S.selectedCampaign?.name)}_${csvDateStamp()}.csv`,headers,out,'Decision readiness');toast('Decision CSV saved','good')
})}
function performanceExportRows(){
 const snap=reportLiveSnapshot(),perf=snap.perf,creatorName=id=>S.creators.find(c=>String(c.id)===String(id))?.name||'Creator';
 const headers=['Performance Type','Creator ID','Creator','Observed At','Source','Evidence Confidence','Status','Outcome Score','Gen Code','Attribution Window Days','Spend THB','Revenue THB','ROAS','ROI %','Platform','Reach','Impressions','Views','Likes','Comments','Shares','Saves','Clicks / Sessions','Landing Sessions','Leads','Conversions','Engagement','Engagement Rate %','CTR %','Conversion Rate %','Content Pieces','Orders','Paid Orders','GMV','Discounts','Refunds','Net Sales','New Customers','Commission Rate %','Commission Amount','AOV','Event Type','Capacity','Attendance','Qualified Leads','QR Scans','Demos','Samples','Event Engagement','Event Conversions','Outcome Notes','Decision Relevance'];
 const rows=perf.map(x=>{
   const m=x.metadata||{},t=String(m.channelType||'PERFORMANCE').toUpperCase(),sp=num(x.spend_thb),rev=num(x.revenue_thb),imp=num(x.impressions),eng=num(x.engagement),clicks=num(x.clicks),conv=num(x.conversions);
   const net=m.netSales!=null?num(m.netSales):rev;
   const roas=sp>0&&net!=null?net/sp:null,roi=sp>0&&net!=null?(net-sp)/sp*100:null,er=imp>0&&eng!=null?eng/imp*100:null,ctr=imp>0&&clicks!=null?clicks/imp*100:null,cvr=clicks>0&&conv!=null?conv/clicks*100:null;
   const relevance=roas!=null?'Commercial efficiency available':(cvr!=null?'Conversion efficiency available':(er!=null||ctr!=null?'Engagement / traffic signal available':'Operational evidence only'));
   return [t,x.creator_id,creatorName(x.creator_id),x.observed_at,x.source,m.evidenceConfidence||x.source,x.status,x.actual_score,m.genCode,m.attributionWindowDays,x.spend_thb,x.revenue_thb,roas,roi,m.platform,x.reach,x.impressions,x.views,x.likes,x.comments,x.shares,m.saves,x.clicks,m.landingSessions,m.leads,x.conversions,x.engagement,er,ctr,cvr,m.contentPieces,m.orders,m.paidOrders,m.gmv,m.discounts,m.refunds,m.netSales,m.newCustomers,m.commissionRate,m.commissionAmount,m.aov,m.eventType,m.capacity,m.attendance,m.qualifiedLeads,m.qrScans,m.demos,m.samples,m.engagement,x.conversions,m.notes,relevance];
 });
 return {headers,rows}
}
function downloadPerformanceCSV(){exportGateOr(()=>{const {headers,rows}=performanceExportRows();if(!rows.length){toast('No performance records to export yet.','error');return}downloadEnterpriseCSV(`KOL-IDS_Performance_${csvSafeName(S.selectedCampaign?.name)}_${csvDateStamp()}.csv`,headers,rows,'Performance observations');toast('Performance CSV saved','good')})}
function downloadImpactCSV(){exportGateOr(()=>{
 const {snap}=reportContext(),i=snap.impact||{},d=reportDecisionSignal(snap);
 const headers=['Campaign','Campaign ID','Metric','Value','Unit','Evidence Status','Decision Interpretation'];
 const pairs=[['Impact score',i.score,'score','Observed outcome score'],['Revenue',i.revenue,'THB',i.hasRevenue?'AVAILABLE':'MISSING',i.hasRevenue?'Observed commercial output':'Do not infer commercial return'],['Spend',i.spend,'THB',i.hasSpend?'AVAILABLE':'MISSING',i.hasSpend?'Observed investment base':'Unit economics incomplete'],['ROAS',i.roas,'x',i.roas!=null?'CALCULABLE':'MISSING REVENUE OR SPEND',i.roas!=null?'Observed efficiency':'Requires revenue + spend'],['ROI',i.roi,'%',i.roi!=null?'CALCULABLE':'MISSING REVENUE OR SPEND',i.roi!=null?'Observed return':'Requires revenue + spend'],['Conversions',i.conversions,'count',i.hasConversionEvidence?'AVAILABLE':'MISSING',i.hasConversionEvidence?'Observed conversion outcome':'Do not overstate sales impact'],['Reach',i.reach,'count','AVAILABLE','Observed reach'],['Views',i.views,'count','AVAILABLE','Observed views'],['Clicks',i.clicks,'count',i.hasClickEvidence?'AVAILABLE':'MISSING',i.hasClickEvidence?'Observed traffic response':'CTR / CVR may be unavailable'],['Engagement',i.engagement,'count','AVAILABLE','Observed engagement'],['Event attendance',i.attendance,'count',i.attendance!=null?'AVAILABLE':'MISSING',i.attendance!=null?'Observed attendance':'No event evidence'],['Event leads',i.leads,'count',i.leads!=null?'AVAILABLE':'MISSING',i.leads!=null?'Observed qualified leads':'No event lead evidence'],['CTR',i.ctr,'%',i.ctr!=null?'CALCULABLE':'MISSING','Traffic efficiency'],['Engagement rate',i.engagementRate,'%',i.engagementRate!=null?'CALCULABLE':'MISSING','Audience response'],['Conversion rate',i.conversionRate,'%',i.conversionRate!=null?'CALCULABLE':'MISSING','Conversion efficiency']];
 downloadEnterpriseCSV(`KOL-IDS_Business-Impact_${csvSafeName(S.selectedCampaign?.name)}_${csvDateStamp()}.csv`,headers,pairs.map(x=>[S.selectedCampaign?.name,S.selectedCampaign?.id,...x]),'Business impact');toast(`Impact CSV saved · ${d.action}`,'good')
})}



/* KOL IDS · REPORT CHARTS PREMIUM SOFT CYAN · 20261006 */
(function(){
 const styleId='kol-ids-report-charts-premium-soft-cyan-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  .kol-report-page .report-chart-card{
    background:linear-gradient(145deg,#FFFFFF 0%,#FCFEFF 72%,#F8FCFD 100%)!important;
    border:1px solid #E1EAED!important;border-radius:12px!important;
    box-shadow:0 4px 16px rgba(25,55,65,.025)!important;
    padding:22px 22px 20px!important;
  }
  .kol-report-page .report-chart-head{border-bottom:1px solid #EDF2F4!important;padding-bottom:13px!important;margin-bottom:14px!important}
  .kol-report-page .report-chart-head b{color:#171A1D!important;font-size:12px!important;font-weight:800!important;letter-spacing:.045em!important}
  .kol-report-page .report-chart-head span{color:#7C8A92!important;font-size:11px!important;font-weight:500!important}
  .kol-report-page .rchart-title{fill:#71818A!important}
  .kol-report-page .rchart-value,.kol-report-page .rchart-share{fill:#20272B!important;font-weight:750!important}
  .kol-report-page .rchart-label,.kol-report-page .rchart-date-label{fill:#71818A!important}
  .kol-report-page .rchart-label-strong{fill:#39474E!important;font-weight:700!important}
  .kol-report-page .rchart-axis{fill:#9AA8AE!important;font-weight:500!important}
  .kol-report-page .rchart-axis-heading{fill:#71818A!important}
  .kol-report-page .rchart-legend{fill:#586A72!important;font-weight:650!important}
  .kol-report-page .rchart-gridline{stroke:#EAF0F2!important;stroke-width:1!important}
  .kol-report-page .rchart-line-a{stroke:#319FB4!important;stroke-width:2.6!important;fill:none!important}
  .kol-report-page .rchart-line-b{stroke:#A1DDE5!important;stroke-width:2.4!important;stroke-dasharray:6 5!important;fill:none!important}
  .kol-report-page .rchart-dot-a{fill:#319FB4!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-b{fill:#A1DDE5!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-a-text{fill:#267F91!important}
  .kol-report-page .rchart-dot-b-text{fill:#648D95!important}
  .kol-report-page .rchart-point-value{font-size:12px!important;font-weight:750!important}
  .kol-report-page .rchart-bar{fill:#83D2DE!important}
  .kol-report-page .rchart-bar-track{fill:#F5FBFC!important;stroke:#E2EEF1!important;stroke-width:1!important}
  .kol-report-page .rchart-revenue-bar-0{fill:#42B4C7!important}
  .kol-report-page .rchart-revenue-bar-1{fill:#76CCD9!important}
  .kol-report-page .rchart-revenue-bar-2{fill:#A5E0E8!important}
  .kol-report-page .rchart-revenue-bar-3{fill:#D2EFF3!important}
  .kol-report-page .report-donut{box-shadow:0 0 0 1px #E4EDF0!important}
  .kol-report-page .report-donut>div{background:#FFFFFF!important;box-shadow:0 3px 14px rgba(30,70,80,.045)!important}
  .kol-report-page .report-donut strong{color:#171A1D!important}
  .kol-report-page .report-donut span{color:#7C8A92!important}
  .kol-report-page .report-legend i{border:1px solid #E1EAED!important;box-shadow:none!important}
  .kol-report-page .report-legend span{color:#71818A!important}
  .kol-report-page .report-legend b{color:#20272B!important;font-weight:750!important}
  .kol-report-page .report-chart-empty{border-color:#E1EAED!important;background:#FCFEFF!important;color:#71818A!important;border-radius:10px!important}
  @media(max-width:900px){.kol-report-page .report-chart-card{padding:16px!important}}
 `;document.head.appendChild(s);
})();


/* REPORT POLISH V2 · readable charts + one complete PDF export · 20261006 */
(function(){
 const styleId='kol-ids-report-polish-v2-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  .kol-report-page .report-chart-grid{gap:22px!important;align-items:stretch!important}
  .kol-report-page .report-chart-card{padding:23px 23px 21px!important;border-color:#E5EDF0!important;box-shadow:0 5px 20px rgba(32,65,74,.025)!important;overflow:visible!important}
  .kol-report-page .report-chart-head{gap:12px!important;align-items:center!important;margin-bottom:17px!important;padding-bottom:15px!important}
  .kol-report-page .report-chart-head b{font-size:16px!important;line-height:1.35!important;letter-spacing:0!important}
  .kol-report-page .report-chart-head span{font-size:11px!important;letter-spacing:.045em!important}
  /* Make only the two requested charts more legible on desktop and mobile. */
  .kol-report-page .report-chart-card:nth-child(1) .rchart-label,
  .kol-report-page .report-chart-card:nth-child(1) .rchart-date-label,
  .kol-report-page .report-chart-card:nth-child(1) .rchart-axis,
  .kol-report-page .report-chart-card:nth-child(1) .rchart-legend,
  .kol-report-page .report-chart-card:nth-child(1) .rchart-point-value,
  .kol-report-page .report-chart-card:nth-child(1) .rchart-value,
  .kol-report-page .report-chart-card:nth-child(1) .rchart-title,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-label,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-date-label,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-axis,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-legend,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-point-value,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-value,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-share,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-title{font-size:15px!important}
  .kol-report-page .report-chart-card:nth-child(1) .rchart-axis,
  .kol-report-page .report-chart-card:nth-child(3) .rchart-axis{font-size:13px!important}
  /* A quieter soft-cyan palette across every chart. */
  .kol-report-page .rchart-line-a{stroke:#79BDCA!important;stroke-width:2.4!important;opacity:.82!important}
  .kol-report-page .rchart-line-b{stroke:#C0E4E9!important;stroke-width:2.2!important;opacity:.9!important}
  .kol-report-page .rchart-dot-a{fill:#79BDCA!important;opacity:.82!important}
  .kol-report-page .rchart-dot-b{fill:#C0E4E9!important;opacity:.92!important}
  .kol-report-page .rchart-dot-a-text{fill:#5F9EAA!important}
  .kol-report-page .rchart-dot-b-text{fill:#7FAAB2!important}
  .kol-report-page .rchart-bar{fill:#A9DDE4!important;opacity:.82!important}
  .kol-report-page .rchart-revenue-bar-0{fill:#83C9D4!important}
  .kol-report-page .rchart-revenue-bar-1{fill:#A5D9E1!important}
  .kol-report-page .rchart-revenue-bar-2{fill:#C3E7EB!important}
  .kol-report-page .rchart-revenue-bar-3{fill:#DDEFF1!important}
  .kol-report-page .rchart-gridline{stroke:#EFF4F5!important;stroke-width:.9!important}
  .kol-report-page .rchart-bar-track{fill:#FAFDFD!important;stroke:#E8F1F3!important}
  .kol-report-page .report-chart-head span{color:#81939A!important}
  @media(max-width:900px){
    .kol-report-page .report-chart-grid{gap:16px!important}
    .kol-report-page .report-chart-card{padding:18px 17px 17px!important}
    .kol-report-page .report-chart-head b{font-size:16px!important}
    .kol-report-page .report-chart-card:nth-child(1) .rchart-label,
    .kol-report-page .report-chart-card:nth-child(1) .rchart-date-label,
    .kol-report-page .report-chart-card:nth-child(1) .rchart-legend,
    .kol-report-page .report-chart-card:nth-child(1) .rchart-value,
    .kol-report-page .report-chart-card:nth-child(3) .rchart-label,
    .kol-report-page .report-chart-card:nth-child(3) .rchart-date-label,
    .kol-report-page .report-chart-card:nth-child(3) .rchart-legend,
    .kol-report-page .report-chart-card:nth-child(3) .rchart-value,
    .kol-report-page .report-chart-card:nth-child(3) .rchart-share{font-size:14px!important}
  }
 `;document.head.appendChild(s);
})();


/* REPORT FINAL POLISH · restore save action, unified PDF, soft premium chart system */
(function(){
 const id='kol-ids-report-final-polish-20261006'; if(document.getElementById(id))return;
 const st=document.createElement('style');st.id=id;st.textContent=`
 .kol-report-page .report-chart-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:20px!important;align-items:stretch!important}
 .kol-report-page .report-chart-card{background:linear-gradient(180deg,#fff 0%,#FBFDFD 100%)!important;border:1px solid #E3EEF0!important;border-radius:18px!important;padding:22px!important;box-shadow:0 8px 26px rgba(39,91,101,.045)!important;overflow:visible!important;min-width:0!important}
 .kol-report-page .report-chart-head{display:flex!important;justify-content:space-between!important;gap:12px!important;align-items:baseline!important;margin:0 0 16px!important;padding:0 0 12px!important;border-bottom:1px solid #EDF4F5!important}
 .kol-report-page .report-chart-head b{font-size:17px!important;line-height:1.4!important;color:#26383D!important;font-weight:700!important;letter-spacing:-.015em!important}
 .kol-report-page .report-chart-head span{font-size:12px!important;color:#82969B!important;line-height:1.45!important}
 .kol-report-page .report-chart-svg{display:block!important;width:100%!important;height:auto!important;min-height:0!important;overflow:visible!important}
 .kol-report-page .report-chart-svg .rchart-title{font-size:15px!important;fill:#71878D!important}
 .kol-report-page .report-chart-svg .rchart-value{font-size:17px!important;fill:#40575D!important;font-weight:700!important}
 .kol-report-page .report-chart-svg .rchart-label,.kol-report-page .report-chart-svg .rchart-label-strong{font-size:15px!important;fill:#657B81!important;font-weight:550!important}
 .kol-report-page .report-chart-svg .rchart-axis{font-size:13px!important;fill:#87999E!important;font-weight:500!important}
 .kol-report-page .report-chart-svg .rchart-legend{font-size:14px!important;fill:#72878C!important;font-weight:550!important}
 .kol-report-page .report-chart-svg .rchart-share{font-size:16px!important;fill:#5C8F98!important;font-weight:750!important}
 .kol-report-page .report-chart-svg .rchart-point-value{font-size:15px!important;font-weight:700!important}
 .kol-report-page .report-chart-svg .rchart-gridline{stroke:#EAF1F2!important;stroke-width:1!important}
 .kol-report-page .report-chart-svg .rchart-line-a{stroke:#83BEC8!important;stroke-width:3!important;opacity:.88!important;fill:none!important;stroke-linecap:round!important;stroke-linejoin:round!important}
 .kol-report-page .report-chart-svg .rchart-line-b{stroke:#C3DDE1!important;stroke-width:2.7!important;opacity:1!important;fill:none!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-dasharray:6 5!important}
 .kol-report-page .report-chart-svg .rchart-dot-a{fill:#83BEC8!important;opacity:.95!important}
 .kol-report-page .report-chart-svg .rchart-dot-b{fill:#C3DDE1!important;stroke:#fff!important;stroke-width:2!important;opacity:1!important}
 .kol-report-page .report-chart-svg .rchart-dot-a-text{fill:#628F98!important}.kol-report-page .report-chart-svg .rchart-dot-b-text{fill:#829FA5!important}
 .kol-report-page .report-chart-svg .rchart-bar{fill:#A9D4DA!important;opacity:.9!important}
 .kol-report-page .report-chart-svg .rchart-revenue-bar-0{fill:#83BEC8!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-1{fill:#A1D0D7!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-2{fill:#BFDFE3!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-3{fill:#D9EAEC!important}
 .kol-report-page .report-chart-svg .rchart-bar-track{fill:#F8FBFB!important;stroke:#E7F0F1!important;stroke-width:1!important}
 .kol-report-page .report-donut-wrap{gap:24px!important;min-height:230px!important}
 .kol-report-page .report-donut{box-shadow:inset 0 0 0 1px rgba(255,255,255,.65)!important}
 .kol-report-page .report-legend{gap:12px!important;min-width:140px!important}
 .kol-report-page .report-legend>div{font-size:12px!important;gap:9px!important}
 .kol-report-page .report-legend span{color:#6D8288!important}.kol-report-page .report-legend b{color:#344A50!important;font-size:12px!important}
 .kol-report-page #complete-campaign.btn.good{background:#EDF7F8!important;color:#527F87!important;border:1px solid #D5E9EC!important;box-shadow:none!important;cursor:pointer!important}
 .kol-report-page #complete-campaign{min-height:42px!important;padding:10px 16px!important;font-size:12px!important;letter-spacing:.015em!important}
 @media(max-width:900px){.kol-report-page .report-chart-grid{grid-template-columns:1fr!important;gap:16px!important}.kol-report-page .report-chart-card{padding:20px!important}.kol-report-page .report-chart-head b{font-size:18px!important}.kol-report-page .report-chart-head span{font-size:12px!important}}
 @media(max-width:560px){.kol-report-page .report-chart-card{padding:16px!important;border-radius:15px!important}.kol-report-page .report-chart-head{align-items:flex-start!important;flex-direction:column!important;gap:3px!important;margin-bottom:12px!important;padding-bottom:10px!important}.kol-report-page .report-chart-head b{font-size:17px!important}.kol-report-page .report-chart-svg .rchart-label,.kol-report-page .report-chart-svg .rchart-label-strong{font-size:16px!important}.kol-report-page .report-chart-svg .rchart-axis{font-size:14px!important}.kol-report-page .report-chart-svg .rchart-value,.kol-report-page .report-chart-svg .rchart-share{font-size:17px!important}.kol-report-page .report-donut-wrap{flex-wrap:wrap;gap:16px!important}.kol-report-page .report-legend{width:100%!important}}
 `;document.head.appendChild(st);
})();


/* FINAL REPORT PALETTE · #AEEFFF IS THE STRONGEST TONE, THEN PROGRESSIVELY LIGHTER */
(function(){
 const styleId='kol-ids-report-aeefff-tiered-palette-20261006';
 if(document.getElementById(styleId)) return;
 const st=document.createElement('style'); st.id=styleId; st.textContent=`
  .kol-report-page .report-chart-svg .rchart-line-a{stroke:#AEEFFF!important;opacity:1!important;stroke-width:3!important}
  .kol-report-page .report-chart-svg .rchart-line-b{stroke:#DDF8FF!important;opacity:1!important;stroke-width:3!important;stroke-dasharray:6 5!important}
  .kol-report-page .report-chart-svg .rchart-dot-a{fill:#AEEFFF!important;opacity:1!important;stroke:#83CFE3!important;stroke-width:1.2!important}
  .kol-report-page .report-chart-svg .rchart-dot-b{fill:#DDF8FF!important;opacity:1!important;stroke:#B8EAF5!important;stroke-width:1.2!important}
  .kol-report-page .report-chart-svg .rchart-dot-a-text,.kol-report-page .report-chart-svg .rchart-dot-b-text{fill:#527985!important}
  .kol-report-page .report-chart-svg .rchart-bar{fill:#AEEFFF!important;opacity:1!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-0{fill:#AEEFFF!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-1{fill:#C8F4FF!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-2{fill:#DDF8FF!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-3{fill:#EEFBFF!important}
  .kol-report-page .report-chart-svg .rchart-bar-track{fill:#FBFEFF!important;stroke:#E1F7FC!important}
  .kol-report-page .report-donut{box-shadow:inset 0 0 0 1px rgba(255,255,255,.8)!important}
  .kol-report-page .report-legend i{border:1px solid rgba(91,157,173,.12)!important}
 `;document.head.appendChild(st);
})();


/* V6 · Report visual system — premium KOL IDS blue intelligence palette */
(function(){
  const styleId='kol-ids-report-premium-blue-v6';
  if(document.getElementById(styleId)) return;
  const s=document.createElement('style');
  s.id=styleId;
  s.textContent=`
    /* Report page hierarchy */
    .kol-report-page{
      --report-blue:#2454C7;
      --report-blue-2:#4B73D5;
      --report-blue-3:#6D8DDF;
      --report-blue-4:#91A9E9;
      --report-blue-5:#B4C4F2;
      --report-blue-6:#D7E0FA;
      --report-ink:#101827;
      --report-muted:#68758A;
      --report-line:#DCE4F2;
      --report-surface:#FFFFFF;
      --report-soft:#F7F9FD;
    }

    .kol-report-page > .hero{
      position:relative!important;
      margin-bottom:22px!important;
      padding:30px 32px!important;
      border:1px solid var(--report-line)!important;
      border-radius:22px!important;
      background:
        radial-gradient(circle at 92% 10%,rgba(36,84,199,.10),transparent 34%),
        linear-gradient(135deg,#fff 0%,#fbfcff 100%)!important;
      box-shadow:0 18px 55px rgba(31,55,98,.07)!important;
      overflow:hidden!important;
    }
    .kol-report-page > .hero:before{
      content:""!important;
      position:absolute!important;
      left:0!important;top:0!important;bottom:0!important;
      width:4px!important;
      background:#2454C7!important;
    }
    .kol-report-page > .hero h2{
      color:var(--report-ink)!important;
      font-size:30px!important;
      letter-spacing:-.035em!important;
      line-height:1.08!important;
    }
    .kol-report-page > .hero p{
      color:var(--report-muted)!important;
      max-width:760px!important;
      line-height:1.65!important;
    }

    /* Top metrics */
    .kol-report-page > .grid.g4{
      gap:14px!important;
      margin-bottom:4px!important;
    }
    .kol-report-page > .grid.g4 .metric{
      border:1px solid var(--report-line)!important;
      border-radius:18px!important;
      background:#fff!important;
      box-shadow:0 10px 32px rgba(31,55,98,.055)!important;
      padding:19px 20px!important;
      min-height:108px!important;
    }
    .kol-report-page > .grid.g4 .metric .label{
      color:#718096!important;
      letter-spacing:.08em!important;
    }
    .kol-report-page > .grid.g4 .metric strong{
      color:#14213A!important;
      font-size:28px!important;
      letter-spacing:-.035em!important;
    }
    .kol-report-page > .grid.g4 .metric small{
      color:#8A95A6!important;
    }

    /* All report sections */
    .kol-report-page > section.card{
      border:1px solid var(--report-line)!important;
      border-radius:20px!important;
      background:#fff!important;
      box-shadow:0 12px 38px rgba(31,55,98,.055)!important;
      padding:24px!important;
    }
    .kol-report-page .section-head{
      margin-bottom:18px!important;
    }
    .kol-report-page .section-head .label{
      color:#2454C7!important;
      font-weight:850!important;
      letter-spacing:.12em!important;
    }
    .kol-report-page .section-head h2{
      color:var(--report-ink)!important;
      letter-spacing:-.025em!important;
    }
    .kol-report-page .section-head .sub{
      color:#738095!important;
      line-height:1.6!important;
    }

    /* Visual intelligence gets premium treatment */
    .kol-report-page .report-visuals{
      padding:26px!important;
      background:
        linear-gradient(180deg,#FCFDFF 0%,#F8FAFE 100%)!important;
      border-color:#D6E0F2!important;
    }
    .kol-report-page .report-visuals .section-head{
      padding-bottom:18px!important;
      border-bottom:1px solid #E6EBF4!important;
    }
    .kol-report-page .report-chart-grid{
      display:grid!important;
      grid-template-columns:repeat(2,minmax(0,1fr))!important;
      gap:18px!important;
      align-items:stretch!important;
    }
    .kol-report-page .report-chart-card{
      min-width:0!important;
      border:1px solid #DCE4F2!important;
      border-radius:18px!important;
      padding:22px 22px 18px!important;
      background:#fff!important;
      box-shadow:0 10px 30px rgba(31,55,98,.055)!important;
      transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease!important;
    }
    .kol-report-page .report-chart-card:hover{
      transform:translateY(-2px)!important;
      border-color:#C8D5EE!important;
      box-shadow:0 16px 38px rgba(31,55,98,.09)!important;
    }
    .kol-report-page .report-chart-head{
      display:flex!important;
      align-items:flex-end!important;
      justify-content:space-between!important;
      gap:16px!important;
      margin-bottom:10px!important;
      padding-bottom:12px!important;
      border-bottom:1px solid #EEF1F6!important;
    }
    .kol-report-page .report-chart-head b{
      color:#15213A!important;
      font-size:16px!important;
      font-weight:850!important;
      letter-spacing:-.02em!important;
    }
    .kol-report-page .report-chart-head span{
      color:#7A879A!important;
      font-size:11px!important;
      font-weight:650!important;
      letter-spacing:.07em!important;
      text-transform:uppercase!important;
    }

    /* SVG typography */
    .kol-report-page .rchart-label-strong{fill:#26344C!important}
    .kol-report-page .rchart-label{fill:#68758A!important}
    .kol-report-page .rchart-axis{fill:#8A96A8!important}
    .kol-report-page .rchart-value{fill:#2454C7!important}
    .kol-report-page .rchart-share{fill:#2454C7!important}
    .kol-report-page .rchart-legend{fill:#536176!important}
    .kol-report-page .rchart-gridline{stroke:#E8EDF5!important;stroke-width:1!important}

    /* Main bar chart — primary to progressively lighter blue */
    .kol-report-page .rchart-bar{fill:#2454C7!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(2) .rchart-bar{fill:#4B73D5!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(3) .rchart-bar{fill:#6D8DDF!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(4) .rchart-bar{fill:#91A9E9!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(5) .rchart-bar{fill:#B4C4F2!important}
    .kol-report-page .report-chart-horizontal > g:nth-of-type(6) .rchart-bar{fill:#D7E0FA!important}

    /* Revenue contribution — track + tiered bars */
    .kol-report-page .report-chart-revenue .rchart-bar-track{fill:#EEF2F9!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-0{fill:#2454C7!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-1{fill:#4B73D5!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-2{fill:#6D8DDF!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-3{fill:#91A9E9!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-4{fill:#B4C4F2!important}
    .kol-report-page .report-chart-revenue .rchart-revenue-bar-5{fill:#D7E0FA!important}

    /* Trend chart — primary revenue, lighter spend */
    .kol-report-page .rchart-line-a{stroke:#2454C7!important;stroke-width:4!important}
    .kol-report-page .rchart-dot-a{fill:#2454C7!important}
    .kol-report-page .rchart-dot-a-text{fill:#2454C7!important}
    .kol-report-page .rchart-line-b{stroke:#91A9E9!important;stroke-width:3.5!important;stroke-dasharray:8 7!important}
    .kol-report-page .rchart-dot-b{fill:#91A9E9!important;stroke:#fff!important;stroke-width:3!important}
    .kol-report-page .rchart-dot-b-text{fill:#6D8DDF!important}

    /* Donut / evidence mix */
    .kol-report-page .report-donut{
      box-shadow:0 0 0 1px #D7E1F2,0 14px 38px rgba(36,84,199,.08)!important;
    }
    .kol-report-page .report-donut>div{
      background:#fff!important;
      box-shadow:0 7px 26px rgba(36,84,199,.08)!important;
    }
    .kol-report-page .report-donut strong{
      color:#17243C!important;
    }
    .kol-report-page .report-donut span{
      color:#7B8799!important;
    }
    .kol-report-page .report-legend span{color:#5E6B7F!important}
    .kol-report-page .report-legend b{color:#2454C7!important}

    /* Blue evidence/status accents */
    .kol-report-page .evidence-status.is-present{
      border-color:#D5E0F4!important;
      background:#F7F9FD!important;
    }
    .kol-report-page .evidence-status.is-present b{
      color:#2454C7!important;
    }

    @media(max-width:900px){
      .kol-report-page .report-chart-grid{grid-template-columns:1fr!important}
      .kol-report-page > .hero{padding:24px!important}
      .kol-report-page > .hero h2{font-size:26px!important}
    }
    @media(max-width:560px){
      .kol-report-page > section.card{padding:18px!important;border-radius:16px!important}
      .kol-report-page .report-chart-card{padding:16px!important;border-radius:15px!important}
      .kol-report-page .report-chart-head{align-items:flex-start!important;flex-direction:column!important;gap:4px!important}
      .kol-report-page > .hero{padding:20px!important;border-radius:17px!important}
    }
  `;
  document.head.appendChild(s);
})();
/* KOL IDS REPORT · UNIFIED ROYAL BLUE + PREMIUM PDF · 20261006 */
(function(){
 const styleId='kol-ids-report-unified-blue-premium-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  .kol-report-page .report-chart-grid{gap:18px!important}
  .kol-report-page .report-chart-card{background:linear-gradient(180deg,#FFFFFF 0%,#F9FBFF 100%)!important;border:1px solid #D8E2F3!important;border-top:2px solid #2454C7!important;border-radius:16px!important;padding:22px 22px 20px!important;box-shadow:0 12px 34px rgba(36,84,199,.07)!important}
  .kol-report-page .report-chart-head{border-bottom:1px solid #E6ECF6!important;padding-bottom:13px!important;margin-bottom:14px!important}
  .kol-report-page .report-chart-head b{color:#17243C!important;font-size:14px!important;font-weight:800!important;letter-spacing:-.02em!important}
  .kol-report-page .report-chart-head span{color:#667892!important;font-size:10px!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:.08em!important}
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .rchart-value,.kol-report-page .rchart-share{fill:#17243C!important;font-weight:850!important}
  .kol-report-page .rchart-label-strong{fill:#30415D!important;font-weight:750!important}
  .kol-report-page .rchart-label,.kol-report-page .rchart-date-label{fill:#52647F!important;font-weight:650!important}
  .kol-report-page .rchart-axis{fill:#71819A!important;font-weight:650!important}
  .kol-report-page .rchart-legend{fill:#30415D!important;font-weight:750!important}
  .kol-report-page .rchart-gridline{stroke:#E3EAF5!important;stroke-width:1!important}
  .kol-report-page .rchart-bar{fill:#2454C7!important;opacity:1!important}
  .kol-report-page .rchart-bar-track{fill:#E8EEF9!important}
  .kol-report-page .rchart-line-a{stroke:#2454C7!important;stroke-width:3.2!important;stroke-linecap:round!important;stroke-linejoin:round!important}
  .kol-report-page .rchart-line-b{stroke:#6D8DDF!important;stroke-width:3!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-dasharray:7 5!important}
  .kol-report-page .rchart-dot-a{fill:#2454C7!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-b{fill:#6D8DDF!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  .kol-report-page .rchart-point-value{fill:#17243C!important;font-size:13px!important;font-weight:900!important}
  .kol-report-page .rchart-dot-a-text,.kol-report-page .rchart-dot-b-text{fill:#17243C!important}
  .kol-report-page .report-chart-empty{height:230px!important;min-height:230px!important;border:1px dashed #C9D6EB!important;background:#F8FAFE!important;color:#536783!important;font-weight:750!important}
  .kol-report-page .report-donut-wrap{min-height:250px!important;gap:42px!important}
  .kol-report-page .report-donut{width:174px!important;height:174px!important;flex-basis:174px!important;box-shadow:0 0 0 1px #D5E0F4,0 16px 38px rgba(36,84,199,.09)!important}
  .kol-report-page .report-donut>div{width:132px!important;height:132px!important;background:#FFFFFF!important;box-shadow:0 8px 26px rgba(36,84,199,.08)!important}
  .kol-report-page .report-donut strong{color:#17243C!important;font-size:27px!important;font-weight:900!important}
  .kol-report-page .report-donut span{color:#71819A!important;font-size:8px!important;font-weight:800!important;letter-spacing:.12em!important}
  .kol-report-page .report-legend{gap:13px!important;min-width:190px!important}
  .kol-report-page .report-legend>div{font-size:11px!important;grid-template-columns:9px 1fr auto!important;gap:10px!important}
  .kol-report-page .report-legend i{width:9px!important;height:9px!important}
  .kol-report-page .report-legend span{color:#52647F!important;font-weight:700!important}
  .kol-report-page .report-legend b{color:#2454C7!important;font-size:12px!important;font-weight:900!important}
  .kol-report-page .evidence-status.is-present{border-color:#D5E0F4!important;background:#F7F9FD!important}
  .kol-report-page .evidence-status.is-present b{color:#2454C7!important}
  @media(max-width:900px){.kol-report-page .report-chart-grid{grid-template-columns:1fr!important}}
  @media(max-width:560px){.kol-report-page .report-chart-card{padding:16px!important}.kol-report-page .report-chart-head b{font-size:13px!important}.kol-report-page .rchart-value{font-size:11px!important}.kol-report-page .rchart-label,.kol-report-page .rchart-label-strong{font-size:10px!important}.kol-report-page .rchart-axis{font-size:9px!important}}
 `;document.head.appendChild(s);
})();

function pdfBlueHeader(doc,title,subtitle=''){
 const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
 const header=()=>{doc.setDrawColor(36,84,199);doc.setLineWidth(.65);doc.line(14,12,W-14,12);doc.setFillColor(36,84,199);doc.roundedRect(14,6.2,4.2,4.2,1,1,'F');doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(36,84,199);doc.text('KOL IDS™',21,9.3);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(93,108,132);doc.text('INVESTMENT DECISION INTELLIGENCE',W-14,9.3,{align:'right'});};
 const footer=()=>{doc.setDrawColor(220,227,239);doc.setLineWidth(.18);doc.line(14,H-13,W-14,H-13);doc.setFont('helvetica','normal');doc.setFontSize(6.8);doc.setTextColor(105,119,142);doc.text('Confidential · Evidence-led decision report · Observed data only',14,H-8);doc.setTextColor(36,84,199);doc.text('Page '+doc.internal.getNumberOfPages(),W-14,H-8,{align:'right'});};
 header();footer();doc.setFont('helvetica','bold');doc.setFontSize(21);doc.setTextColor(23,36,60);doc.text(pdfSafeText(title),14,25);if(subtitle){doc.setFont('helvetica','normal');doc.setFontSize(8.3);doc.setTextColor(82,100,127);doc.text(pdfSafeText(subtitle),14,31)}return {W,H,header,footer};
}
function pdfBlueSection(doc,ctx,title,kicker=''){pdfPageBreak(doc,ctx,19);ctx.y+=4;doc.setFont('helvetica','bold');doc.setFontSize(6.8);doc.setTextColor(36,84,199);doc.text(pdfSafeText(kicker||'SECTION').toUpperCase(),14,ctx.y);ctx.y+=6;doc.setFontSize(12.5);doc.setTextColor(23,36,60);doc.text(pdfSafeText(title),14,ctx.y);ctx.y+=5;doc.setDrawColor(36,84,199);doc.setLineWidth(.45);doc.line(14,ctx.y,ctx.W-14,ctx.y);ctx.y+=6;}
function pdfBlueMetrics(doc,ctx,items){const gap=4,w=(ctx.W-28-gap*3)/4,h=22;let x=14;items.forEach((it,i)=>{if(i&&i%4===0){ctx.y+=h+4;x=14}if(pdfPageBreak(doc,ctx,h+2))x=14;doc.setFillColor(248,250,254);doc.setDrawColor(214,224,241);doc.roundedRect(x,ctx.y,w,h,2.5,2.5,'FD');doc.setFont('helvetica','bold');doc.setFontSize(6.7);doc.setTextColor(91,109,137);doc.text(String(it.label||'').toUpperCase(),x+4,ctx.y+6.5);doc.setFontSize(11.5);doc.setTextColor(23,36,60);doc.text(pdfSafeText(it.value),x+4,ctx.y+15);x+=w+gap});ctx.y+=h+7}
function pdfChartSvgStyled(svg){if(!svg||!svg.startsWith('<svg'))return svg;const css='.rchart-gridline{stroke:#DDE8EB;stroke-width:1}.rchart-axis{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:16px;fill:#6F7D83;font-weight:650}.rchart-label{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:16px;fill:#3D131B;font-weight:700}.rchart-label-strong{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:17px;fill:#3D131B;font-weight:800}.rchart-value{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:18px;fill:#3D131B;font-weight:850}.rchart-share{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:17px;fill:#3D131B;font-weight:850}.rchart-line-a{stroke:#3D131B;stroke-width:2.4;fill:none;stroke-linecap:round;stroke-linejoin:round}.rchart-line-b{stroke:#55CDE8;stroke-width:2.4;fill:none;stroke-linecap:round;stroke-linejoin:round}.rchart-dot-a{fill:#3D131B;stroke:#fff;stroke-width:2}.rchart-dot-b{fill:#55CDE8;stroke:#fff;stroke-width:2}.rchart-point-value{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:16px;fill:#3D131B;font-weight:900}.rchart-legend{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:15px;fill:#3D131B;font-weight:750}.rchart-bar{fill:#55CDE8;fill-opacity:.62}.rchart-bar-track{fill:#EEF9FB}';return svg.replace(/(<svg\b[^>]*>)/,'$1<style>'+css+'</style>')}
function pdfDonutSvg(parts){const valid=(parts||[]).filter(x=>Number(x.value)>0),total=valid.reduce((a,x)=>a+Number(x.value),0);if(!total)return '';const colors=['#55CDE8','#3D131B','#D9CBB0','#A8E9F4','#7B5960','#EEF9FB'];const cx=190,cy=150,r=88,inner=57;let angle=-Math.PI/2,paths='';valid.forEach((x,i)=>{const a0=angle,a1=angle+(Number(x.value)/total)*Math.PI*2;const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),ix1=cx+inner*Math.cos(a1),iy1=cy+inner*Math.sin(a1),ix0=cx+inner*Math.cos(a0),iy0=cy+inner*Math.sin(a0),large=a1-a0>Math.PI?1:0;paths+='<path d="M '+x0+' '+y0+' A '+r+' '+r+' 0 '+large+' 1 '+x1+' '+y1+' L '+ix1+' '+iy1+' A '+inner+' '+inner+' 0 '+large+' 0 '+ix0+' '+iy0+' Z" fill="'+colors[i%colors.length]+'"/>';angle=a1});const legend=valid.map((x,i)=>{const y=70+i*34;return '<circle cx="330" cy="'+y+'" r="5" fill="'+colors[i%colors.length]+'"/><text x="344" y="'+(y+4)+'" font-family="Noto Sans Thai, Arial" font-size="13" fill="#52647F" font-weight="700">'+esc(x.label)+'</text><text x="500" y="'+(y+4)+'" text-anchor="end" font-family="Noto Sans Thai, Arial" font-size="13" fill="#2454C7" font-weight="900">'+Number(x.value).toLocaleString()+'</text>'}).join('');return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300" width="1040" height="600"><rect width="520" height="300" fill="#FFFFFF"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r+1)+'" fill="none" stroke="#D5E0F4"/><g>'+paths+'</g><circle cx="'+cx+'" cy="'+cy+'" r="'+inner+'" fill="#FFFFFF"/><text x="'+cx+'" y="'+(cy-2)+'" text-anchor="middle" font-family="Noto Sans Thai, Arial" font-size="30" fill="#17243C" font-weight="900">'+total.toLocaleString()+'</text><text x="'+cx+'" y="'+(cy+17)+'" text-anchor="middle" font-family="Noto Sans Thai, Arial" font-size="10" fill="#71819A" font-weight="800" letter-spacing="2">RECORDS</text>'+legend+'</svg>'}
function pdfChartTitle(doc,ctx,title,note){pdfPageBreak(doc,ctx,30);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.setTextColor(23,36,60);doc.text(pdfSafeText(title),14,ctx.y);ctx.y+=5;doc.setFont('helvetica','normal');doc.setFontSize(7.3);doc.setTextColor(91,109,137);doc.text(pdfSafeText(note),14,ctx.y);ctx.y+=5;}
function pdfAddSvgImage(doc,svg,x,y,w,h){return new Promise(resolve=>{if(!svg||!svg.startsWith('<svg')){resolve(false);return}const img=new Image();img.onload=()=>{try{const scale=2,canvas=document.createElement('canvas');canvas.width=Math.round(w*3.78*scale);canvas.height=Math.round(h*3.78*scale);const c=canvas.getContext('2d');c.fillStyle='#FFFFFF';c.fillRect(0,0,canvas.width,canvas.height);c.drawImage(img,0,0,canvas.width,canvas.height);doc.addImage(canvas.toDataURL('image/png',1),'PNG',x,y,w,h,undefined,'FAST');resolve(true)}catch(e){resolve(false)}};img.onerror=()=>resolve(false);img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(pdfChartSvgStyled(svg))})}
function pdfObservationRows(snap){return (snap.perf||[]).map(x=>{const m=x.metadata||{},t=String(m.channelType||'PERFORMANCE').toUpperCase(),sp=num(x.spend_thb),rev=m.netSales!=null?num(m.netSales):num(x.revenue_thb),roas=sp>0&&rev!=null?rev/sp:null,roi=sp>0&&rev!=null?(rev-sp)/sp*100:null;return [S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',t,x.observed_at||'—',m.platform||'—',m.evidenceConfidence||x.source||'—',x.actual_score==null?'Pending':`${Math.round(x.actual_score)}/100`,sp==null?'—':pdfFmt(sp,'THB'),rev==null?'—':pdfFmt(rev,'THB'),roas==null?'—':pdfFmt(roas,'x'),roi==null?'—':pdfFmt(roi,'%')]})}
function pdfCreatorDetailRows(snap){return (snap.decisionRows||[]).map(({creator:r,decision:d})=>{const e=d.evidence||{};return [r.name,r.payload?.channel||'—',r.payload?.followers==null?'—':Number(r.payload.followers).toLocaleString(),r.payload?.engagementRate==null?'—':`${Number(r.payload.engagementRate).toFixed(2)}%`,d.decision||'—',d.score==null?'—':Math.round(d.score),Math.round(e.confidence??0),Math.round(e.audienceFit??50),Math.round(e.contentFit??50),Math.round(e.brandFit??50),Math.round(e.performance??0),Math.round(e.commercial??50),Math.round(e.risk??50)]})}

/* FINAL REPORT CLEAN THEME · 20261006 */
(function(){
 const s=document.createElement('style');
 s.textContent=`
 .kol-report-page{color:#17243C!important}
 .kol-report-page .report-chart-grid{gap:14px!important}
 .kol-report-page .report-chart-card{background:#fff!important;border:1px solid #DCE5F3!important;border-radius:14px!important;box-shadow:0 4px 18px rgba(23,36,60,.045)!important;padding:20px!important;overflow:hidden!important}
 .kol-report-page .report-chart-head{border-bottom:1px solid #E8EDF5!important;padding-bottom:12px!important;margin-bottom:12px!important}
 .kol-report-page .report-chart-head b{color:#17243C!important;font-weight:750!important}
 .kol-report-page .report-chart-head span{color:#6B7B95!important}
 .kol-report-page .report-chart-svg{background:#fff!important}
 .kol-report-page .report-chart-svg .rchart-gridline{stroke:#E7ECF4!important;stroke-width:1!important}
 .kol-report-page .report-chart-svg .rchart-axis{fill:#5D6D86!important;font-weight:600!important}
 .kol-report-page .report-chart-svg .rchart-label,.kol-report-page .report-chart-svg .rchart-label-strong{fill:#30415D!important;font-weight:700!important}
 .kol-report-page .report-chart-svg .rchart-value,.kol-report-page .report-chart-svg .rchart-share{fill:#17243C!important;font-weight:800!important}
 .kol-report-page .report-chart-svg .rchart-legend{fill:#30415D!important;font-weight:700!important}
 .kol-report-page .report-chart-svg .rchart-line-a{stroke:#2454C7!important;stroke-width:3.2!important;opacity:1!important;fill:none!important}
 .kol-report-page .report-chart-svg .rchart-line-b{stroke:#4B73D5!important;stroke-width:3!important;opacity:1!important;fill:none!important;stroke-dasharray:7 5!important}
 .kol-report-page .report-chart-svg .rchart-dot-a{fill:#2454C7!important;stroke:#fff!important;stroke-width:2!important}
 .kol-report-page .report-chart-svg .rchart-dot-b{fill:#4B73D5!important;stroke:#fff!important;stroke-width:2!important}
 .kol-report-page .report-chart-svg .rchart-dot-a-text,.kol-report-page .report-chart-svg .rchart-dot-b-text{fill:#17243C!important}
 .kol-report-page .report-chart-svg .rchart-bar{fill:#2454C7!important;opacity:1!important}
 .kol-report-page .report-chart-svg .rchart-revenue-bar-0{fill:#2454C7!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-1{fill:#4B73D5!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-2{fill:#6D8DDF!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-3{fill:#91A9E9!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-4{fill:#B4C4F2!important}.kol-report-page .report-chart-svg .rchart-revenue-bar-5{fill:#D7E0FA!important}
 .kol-report-page .report-chart-svg .rchart-bar-track{fill:#F4F7FC!important;stroke:#E2E8F2!important}
 .kol-report-page .report-legend span{color:#30415D!important}.kol-report-page .report-legend b{color:#17243C!important}.kol-report-page .report-legend i{border:1px solid rgba(23,36,60,.08)!important}
 .kol-report-page .report-donut{box-shadow:none!important}
 .kol-report-page .card,.kol-report-page .report-data-quality{box-shadow:0 4px 18px rgba(23,36,60,.035)!important;border-color:#DCE5F3!important}
 .kol-report-page .signal-box{border-color:#E1E8F2!important;background:#FBFCFE!important}
 `;
 document.head.appendChild(s);
})();

function pdfAllPayloadRows(label,payload){
 const rows=[]; Object.entries(payload||{}).forEach(([k,v])=>{if(v===undefined||v===null||v==='')return; let out=v; if(typeof v==='object'){try{out=JSON.stringify(v)}catch(e){out=String(v)}} rows.push([`${label} · ${k}`,pdfSafeText(out)]);}); return rows;
}
function pdfCompleteEvidenceRows(x){
 const rows=[]; const base=['id','campaign_id','creator_id','observed_at','actual_score','spend_thb','revenue_thb','reach','impressions','views','likes','comments','shares','clicks','conversions','engagement','source'];
 base.forEach(k=>{if(x[k]!==undefined&&x[k]!==null&&x[k]!=='')rows.push([k,pdfSafeText(x[k])])});
 Object.entries(x.metadata||{}).forEach(([k,v])=>{if(v===undefined||v===null||v==='')return;let out=v;if(typeof v==='object'){try{out=JSON.stringify(v)}catch(e){out=String(v)}}rows.push([`metadata · ${k}`,pdfSafeText(out)])});
 return rows;
}
function pdfCreatorIntelligenceRows(snap){return (snap.decisionRows||[]).map(({creator:r,decision:d})=>{const e=d.evidence||{};return [r.name,r.payload?.channel||'—',r.payload?.niche||r.payload?.category||'—',r.payload?.followers==null?'—':Number(r.payload.followers).toLocaleString(),r.payload?.engagementRate==null?'—':`${Number(r.payload.engagementRate).toFixed(2)}%`,e.reason||e.method||'—',e.ifSelected||creatorAdaptation(e)||'—',e.campaignMove||creatorAdaptation(e)||'—']})}

async function buildPremiumFullPDF(){
 if(!window.jspdf?.jsPDF){window.print();return}
 const snap=reportLiveSnapshot(),{p,perf,digital,ecommerce,offline,decisionRows,impact,learning}=snap;const visuals=buildReportVisuals(snap);const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});const ctx=pdfBlueHeader(doc,'KOL IDS™ Campaign Intelligence Report','Premium decision pack · observed evidence · creator intelligence · performance · business impact');ctx.y=40;
 pdfBlueMetrics(doc,ctx,[{label:'Creators approved',value:decisionRows.length},{label:'Evidence records',value:perf.length},{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')}]);
 pdfBlueSection(doc,ctx,'Executive decision summary','01 · executive view');pdfNarrative(doc,ctx,'Decision posture',reportDecisionSignal(snap).action||'Review the linked evidence before changing investment allocation.');pdfNarrative(doc,ctx,'Campaign objective',(p.objectives||[]).join(' · ')||p.objective||p.goal||'Not recorded');pdfNarrative(doc,ctx,'Evidence posture',`${perf.length} observed performance record(s), ${decisionRows.length} creator decision record(s), ${digital.length} digital, ${ecommerce.length} e-commerce and ${offline.length} offline/event record(s).`);
 pdfBlueSection(doc,ctx,'Campaign & audience intelligence','02 · strategic context');pdfRows(doc,ctx,['Field','Observed value'],[['Campaign',S.selectedCampaign?.name||'—'],['Status',S.selectedCampaign?.status||'—'],['Objective',(p.objectives||[]).join(' · ')||p.objective||p.goal||'—'],['Performance model',p.performanceType||'—'],['Budget',pdfFmt(p.budget,'THB')],['Market',p.market||'—'],['Start date',p.startDate||'—'],['End date',p.endDate||'—'],['Brand personality',(p.brandPersonalities||[]).join(' · ')||'—'],['Audience type',S.selectedAudience?.payload?.audienceType||'—'],['Audience persona',S.selectedAudience?.payload?.audiencePersona||'—'],['Audience notes',S.selectedAudience?.payload?.notes||'—']],[55,125]);
 pdfBlueSection(doc,ctx,'Complete campaign & audience record','02A · full source fields');
pdfRows(doc,ctx,['Field','Recorded value'],pdfAllPayloadRows('Campaign',p).concat(pdfAllPayloadRows('Audience',S.selectedAudience?.payload||{})),[55,125]);
pdfBlueSection(doc,ctx,'Creator intelligence & decision rationale','03 · creator intelligence');
if(decisionRows.length)pdfRows(doc,ctx,['Creator','Channel','Niche','Followers','ER','Why','If selected','Campaign move'],pdfCreatorIntelligenceRows(snap),[25,16,20,18,14,42,40,40]);else pdfNarrative(doc,ctx,'Status','No creator intelligence records are linked to this campaign.');
pdfBlueSection(doc,ctx,'Creator decision register','03A · scored decision matrix');if(decisionRows.length)pdfRows(doc,ctx,['Creator','Channel','Followers','ER','Decision','Fit','Conf.','Audience','Content','Brand','Perf.','Commercial','Risk'],pdfCreatorDetailRows(snap),[27,17,18,14,20,12,12,13,13,13,13,14,11]);else pdfNarrative(doc,ctx,'Status','No creator decision records are linked to this campaign.');
 decisionRows.forEach(({creator:r,decision:d})=>{const e=d.evidence||{};pdfNarrative(doc,ctx,r.name,`${d.decision||'—'} · Fit ${d.score==null?'—':Math.round(d.score)}/100 · Confidence ${Math.round(e.confidence??0)}/100 · ${e.reason||e.method||creatorAdaptation(e)||'No rationale recorded.'}`)});
 pdfBlueSection(doc,ctx,'Complete creator source records','03B · full creator fields');
 if(decisionRows.length){decisionRows.forEach(({creator:r,decision:d},i)=>{pdfPageBreak(doc,ctx,25);pdfNarrative(doc,ctx,`${i+1}. ${r.name||'Creator'}`,'Complete creator record used by the report, including stored source fields and decision context.');pdfRows(doc,ctx,['Recorded field','Value'],pdfAllPayloadRows('Creator',r).concat(pdfAllPayloadRows('Decision',d)),[58,122]);});}else pdfNarrative(doc,ctx,'Status','No creator records are linked to this campaign.');
 pdfBlueSection(doc,ctx,'Performance evidence register','04 · observed records');if(perf.length)pdfRows(doc,ctx,['Creator','Type','Observed','Platform','Confidence','Outcome','Spend','Revenue','ROAS','ROI'],pdfObservationRows(snap),[27,17,18,18,19,17,20,22,16,16]);else pdfNarrative(doc,ctx,'Status','No performance evidence was recorded.');
 pdfBlueSection(doc,ctx,'Digital performance detail','04A · multi-platform evidence');if(digital.length)pdfRows(doc,ctx,['Creator','Platform','Observed','Reach','Impressions','Views','Likes','Comments','Shares','Clicks','Conversions','Engagement'],digital.map(x=>[S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',x.metadata?.platform||'—',x.observed_at||'—',x.reach==null?'—':Number(x.reach).toLocaleString(),x.impressions==null?'—':Number(x.impressions).toLocaleString(),x.views==null?'—':Number(x.views).toLocaleString(),x.likes==null?'—':Number(x.likes).toLocaleString(),x.comments==null?'—':Number(x.comments).toLocaleString(),x.shares==null?'—':Number(x.shares).toLocaleString(),x.clicks==null?'—':Number(x.clicks).toLocaleString(),x.conversions==null?'—':Number(x.conversions).toLocaleString(),x.engagement==null?'—':Number(x.engagement).toLocaleString()]),[25,17,18,18,20,18,18,18,18,18,18,20]);else pdfNarrative(doc,ctx,'Status','No digital records.');
 pdfBlueSection(doc,ctx,'E-commerce performance detail','04B · commerce evidence');if(ecommerce.length)pdfRows(doc,ctx,['Creator','Platform','Observed','GMV','Net sales','Orders','Paid orders','Discounts','Refunds','AOV','Commission','New customers'],ecommerce.map(x=>{const m=x.metadata||{};return [S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',m.platform||'—',x.observed_at||'—',m.gmv==null?'—':pdfFmt(m.gmv,'THB'),m.netSales==null?'—':pdfFmt(m.netSales,'THB'),m.orders==null?'—':Number(m.orders).toLocaleString(),m.paidOrders==null?'—':Number(m.paidOrders).toLocaleString(),m.discounts==null?'—':pdfFmt(m.discounts,'THB'),m.refunds==null?'—':pdfFmt(m.refunds,'THB'),m.aov==null?'—':pdfFmt(m.aov,'THB'),m.commissionAmount==null?'—':pdfFmt(m.commissionAmount,'THB'),m.newCustomers==null?'—':Number(m.newCustomers).toLocaleString()]}),[25,17,18,22,22,17,19,22,22,20,24,22]);else pdfNarrative(doc,ctx,'Status','No e-commerce records.');
 pdfBlueSection(doc,ctx,'Offline / event performance detail','04C · physical evidence');if(offline.length)pdfRows(doc,ctx,['Creator','Event','Observed','Capacity','Attendance','Leads','QR scans','Demos','Samples','Conversions','Engagement','Revenue'],offline.map(x=>{const m=x.metadata||{};return [S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',m.eventType||'—',x.observed_at||'—',m.capacity==null?'—':Number(m.capacity).toLocaleString(),m.attendance==null?'—':Number(m.attendance).toLocaleString(),m.qualifiedLeads==null?'—':Number(m.qualifiedLeads).toLocaleString(),m.qrScans==null?'—':Number(m.qrScans).toLocaleString(),m.demos==null?'—':Number(m.demos).toLocaleString(),m.samples==null?'—':Number(m.samples).toLocaleString(),x.conversions==null?'—':Number(x.conversions).toLocaleString(),m.engagement==null?'—':Number(m.engagement).toLocaleString(),x.revenue_thb==null?'—':pdfFmt(x.revenue_thb,'THB')]}),[25,20,18,19,20,19,18,18,18,19,20,22]);else pdfNarrative(doc,ctx,'Status','No offline/event records.');

 pdfBlueSection(doc,ctx,'Complete evidence ledger','04D · every recorded field');
 if(perf.length){perf.forEach((x,i)=>{pdfPageBreak(doc,ctx,25);const nm=S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator';pdfNarrative(doc,ctx,`${i+1}. ${nm} · ${String(x.metadata?.channelType||'PERFORMANCE').toUpperCase()}`,`Observed ${x.observed_at||'—'} · Every stored base field and metadata field is reproduced below for auditability.`);pdfRows(doc,ctx,['Recorded field','Value'],pdfCompleteEvidenceRows(x),[58,122]);});}else pdfNarrative(doc,ctx,'Status','No observed evidence records are available.');
 const charts=[['Outcome trend','Revenue vs Spend across observed dates',reportSvgLineChart(visuals.trend,{title:'Observed financial movement',aria:'Revenue and spend over observed dates',width:760,height:390}),760,390],['Creator performance','Observed outcome score by creator',reportSvgBarChart(visuals.bars,{title:'Completed outcome score',aria:'Creator observed outcome scores',width:760,height:390}),760,390],['Revenue contribution','Observed revenue contribution by creator',reportSvgRevenueContribution(visuals.revBars,{title:'Revenue share by creator',aria:'Revenue contribution share by creator',width:760,height:390}),760,390],['Evidence mix','Observed records by evidence type',pdfDonutSvg(visuals.mix),520,300]];
 for(let i=0;i<charts.length;i++){const [title,note,svg,sw,sh]=charts[i];doc.addPage();ctx.header();ctx.footer();ctx.y=24;pdfChartTitle(doc,ctx,title,note);const maxW=ctx.W-28,ratio=sw/sh,w=maxW,h=Math.min(90,maxW/ratio);await pdfAddSvgImage(doc,svg,14,ctx.y,w,h);ctx.y+=h+8;const related=i===0?visuals.trend.map(x=>[x.label,x.a==null?'—':pdfFmt(x.a,'THB'),x.b==null?'—':pdfFmt(x.b,'THB')]):i===1?visuals.bars.map(x=>[x.label,Math.round(x.value)]):i===2?visuals.revBars.map(x=>[x.label,pdfFmt(x.value,'THB')]):visuals.mix.map(x=>[x.label,Number(x.value)]);pdfRows(doc,ctx,i===0?['Observed date','Revenue','Spend']:i===1?['Creator','Observed score']:i===2?['Creator','Revenue']:['Evidence type','Records'],related,i===0?[55,63,64]:[115,67]);}

 pdfBlueSection(doc,ctx,'Complete impact & learning records','05A · full recorded fields');
 pdfRows(doc,ctx,['Recorded field','Value'],pdfAllPayloadRows('Impact',impact).concat(pdfAllPayloadRows('Learning',learning)),[58,122]);
 pdfBlueSection(doc,ctx,'Business impact & unit economics','06 · observed commercial effect');pdfBlueMetrics(doc,ctx,[{label:'Impact score',value:impact.score==null?'Not scored':`${Math.round(impact.score)}/100`},{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'Spend',value:impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')}]);pdfRows(doc,ctx,['Metric','Value','Interpretation'],[['Revenue',impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB'),impact.revenue==null?'Evidence unavailable':'Observed commercial output'],['Spend',impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB'),impact.spend==null?'Evidence unavailable':'Observed investment base'],['ROAS',impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x'),impact.roas==null?'Requires revenue + spend':'Revenue ÷ spend'],['ROI',impact.roi==null?'Not calculable':pdfFmt(impact.roi,'%'),impact.roi==null?'Requires revenue + spend':'(Revenue − spend) ÷ spend'],['Conversions',impact.conversions==null?'Not recorded':pdfFmt(impact.conversions),'Observed conversion outcome'],['Reach',impact.reach==null?'Not recorded':pdfFmt(impact.reach),'Observed reach'],['Views',impact.views==null?'Not recorded':pdfFmt(impact.views),'Observed views'],['Clicks',impact.clicks==null?'Not recorded':pdfFmt(impact.clicks),'Observed traffic response'],['Engagement',impact.engagement==null?'Not recorded':pdfFmt(impact.engagement),'Observed engagement'],['Event attendance',impact.attendance==null?'Not recorded':pdfFmt(impact.attendance),'Observed attendance'],['Qualified leads',impact.leads==null?'Not recorded':pdfFmt(impact.leads),'Observed qualified leads'],['CTR',impact.ctr==null?'Not calculable':pdfFmt(impact.ctr,'%'),'Clicks ÷ impressions'],['Engagement rate',impact.engagementRate==null?'Not calculable':pdfFmt(impact.engagementRate,'%'),'Engagement ÷ impressions'],['Conversion rate',impact.conversionRate==null?'Not calculable':pdfFmt(impact.conversionRate,'%'),'Conversions ÷ clicks']],[50,55,75]);
 pdfBlueSection(doc,ctx,'Learning & next investment decision','07 · institutional memory');pdfNarrative(doc,ctx,'What worked',learning.worked||'Not recorded yet.');pdfNarrative(doc,ctx,'Friction / what did not work',learning.friction||'Not recorded yet.');pdfNarrative(doc,ctx,'Next hypothesis',learning.hypothesis||'Not recorded yet.');const nid=learning.nextInvestmentDecision||{};if(nid.recommendation)pdfNarrative(doc,ctx,'Next investment decision',`${nid.recommendation} · Confidence ${nid.confidence||'—'} · ${nid.reason||''}`);if(nid.threshold)pdfNarrative(doc,ctx,'Success threshold',nid.threshold);if(nid.historicalBenchmark)pdfNarrative(doc,ctx,'Historical benchmark',`ROAS ${nid.historicalBenchmark} · ${nid.historyCount||0} historical campaign(s)`);(learning.nextActions||[]).forEach((x,n)=>pdfNarrative(doc,ctx,`Next action ${n+1}`,x));
 pdfBlueSection(doc,ctx,'Evidence coverage & governance','08 · data quality');pdfRows(doc,ctx,['Evidence class','Status / count'],[['Digital records',digital.length],['E-commerce records',ecommerce.length],['Offline / event records',offline.length],['Decision records',decisionRows.length],['Revenue evidence',impact.revenue==null?'MISSING':'AVAILABLE'],['Spend evidence',impact.spend==null?'MISSING':'AVAILABLE'],['Conversion evidence',impact.conversions==null?'MISSING':'AVAILABLE'],['Impression evidence',impact.hasImpressionEvidence?'AVAILABLE':'MISSING'],['Click evidence',impact.hasClickEvidence?'AVAILABLE':'MISSING'],['Generated at',new Date().toLocaleString('en-GB',{timeZone:'Asia/Bangkok'})]],[85,95]);pdfNarrative(doc,ctx,'Governance note','Use this report to approve, hold, reallocate or test investment based on observed evidence. KOL IDS does not convert missing evidence into invented values. Forecast-like language should be treated as a hypothesis until supported by observed campaign data.');
 doc.save(pdfSaveName('KOL-IDS_Premium-Campaign-Intelligence',S.selectedCampaign?.name));toast('Premium detailed PDF saved','good');
}
function downloadFullPDF(){if(reportExportIsTrial()){showPaidExportGate();return}buildPremiumFullPDF().catch(err=>{console.error(err);toast('Could not generate the detailed PDF. Please try again.','error')})}


/* KOL IDS REPORT · FINAL CLEAN OVERRIDE · 20261006 */
(function(){
 const styleId='kol-ids-report-final-clean-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  /* One restrained visual language: white, navy text, royal blue accents. */
  .kol-report-page .report-chart-grid{
    gap:16px!important;
  }
  .kol-report-page .report-chart-card{
    min-width:0!important;
    min-height:0!important;
    background:#FFFFFF!important;
    border:1px solid #DCE4EF!important;
    border-top:1px solid #DCE4EF!important;
    border-radius:14px!important;
    padding:18px 18px 16px!important;
    box-shadow:none!important;
    overflow:hidden!important;
  }
  .kol-report-page .report-chart-card:hover{
    transform:none!important;
    box-shadow:none!important;
  }
  .kol-report-page .report-chart-head{
    display:flex!important;
    align-items:center!important;
    justify-content:space-between!important;
    gap:12px!important;
    margin:0 0 12px!important;
    padding:0 0 10px!important;
    border-bottom:1px solid #E8EDF4!important;
  }
  .kol-report-page .report-chart-head b{
    color:#17243C!important;
    font-size:14px!important;
    line-height:1.2!important;
    font-weight:800!important;
    letter-spacing:-.02em!important;
  }
  .kol-report-page .report-chart-head span{
    color:#6B7A91!important;
    font-size:9px!important;
    line-height:1.2!important;
    font-weight:750!important;
    text-transform:uppercase!important;
    letter-spacing:.08em!important;
  }
  .kol-report-page .report-chart-svg{
    display:block!important;
    width:100%!important;
    height:auto!important;
    min-height:0!important;
    overflow:visible!important;
  }
  /* Readable chart typography */
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .rchart-gridline{stroke:#E5EBF3!important;stroke-width:1!important}
  .kol-report-page .rchart-axis{fill:#687990!important;font-size:12px!important;font-weight:650!important}
  .kol-report-page .rchart-axis-heading{fill:#5D6E86!important;font-size:10px!important;font-weight:700!important}
  .kol-report-page .rchart-label{fill:#4F6078!important;font-size:12px!important;font-weight:650!important}
  .kol-report-page .rchart-label-strong{fill:#263A58!important;font-size:13px!important;font-weight:750!important}
  .kol-report-page .rchart-value{fill:#17243C!important;font-size:14px!important;font-weight:900!important}
  .kol-report-page .rchart-share{fill:#17243C!important;font-size:13px!important;font-weight:900!important}
  .kol-report-page .rchart-legend{fill:#30415D!important;font-size:11px!important;font-weight:750!important}
  .kol-report-page .rchart-point-value{fill:#17243C!important;font-size:12px!important;font-weight:900!important}
  .kol-report-page .rchart-dot-a-text,.kol-report-page .rchart-dot-b-text{fill:#17243C!important}
  /* Everything visual stays in the same royal-blue family. */
  .kol-report-page .rchart-bar{fill:#2454C7!important;opacity:1!important}
  .kol-report-page .rchart-bar-track{fill:#EEF2F8!important}
  .kol-report-page .rchart-revenue-bar-0{fill:#2454C7!important}
  .kol-report-page .rchart-revenue-bar-1{fill:#4B73D5!important}
  .kol-report-page .rchart-revenue-bar-2{fill:#6D8DDF!important}
  .kol-report-page .rchart-revenue-bar-3{fill:#91A9E9!important}
  .kol-report-page .rchart-revenue-bar-4{fill:#B4C4F2!important}
  .kol-report-page .rchart-revenue-bar-5{fill:#D7E0FA!important}
  /* Outcome trend: both series remain dark blue; dash pattern is the only distinction. */
  .kol-report-page .rchart-line-a{stroke:#2454C7!important;stroke-width:3!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important}
  .kol-report-page .rchart-line-b{stroke:#2454C7!important;stroke-width:2.6!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-dasharray:7 5!important;fill:none!important}
  .kol-report-page .rchart-dot-a{fill:#2454C7!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-b{fill:#2454C7!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  /* Donut stays blue-only with readable legend. */
  .kol-report-page .report-donut{box-shadow:0 0 0 1px #D7E1F0!important}
  .kol-report-page .report-donut>div{background:#FFFFFF!important;box-shadow:none!important}
  .kol-report-page .report-donut strong{color:#17243C!important}
  .kol-report-page .report-donut span{color:#6B7A91!important}
  .kol-report-page .report-legend{gap:11px!important;min-width:180px!important}
  .kol-report-page .report-legend>div{font-size:12px!important;grid-template-columns:9px 1fr auto!important;gap:9px!important}
  .kol-report-page .report-legend i{width:9px!important;height:9px!important}
  .kol-report-page .report-legend span{color:#4F6078!important;font-weight:700!important}
  .kol-report-page .report-legend b{color:#2454C7!important;font-size:12px!important;font-weight:900!important}
  .kol-report-page .report-chart-empty{
    min-height:250px!important;
    height:250px!important;
    border:1px dashed #C9D5E6!important;
    border-radius:10px!important;
    background:#FBFCFE!important;
    color:#65758C!important;
    font-size:13px!important;
    font-weight:700!important;
  }
  /* Keep the surrounding report cards clean too. */
  .kol-report-page > .card{
    background:#FFFFFF!important;
    border:1px solid #E0E6EE!important;
    box-shadow:none!important;
    border-radius:14px!important;
  }
  .kol-report-page > .hero{
    background:#FFFFFF!important;
    border:1px solid #E0E6EE!important;
    box-shadow:none!important;
    border-radius:14px!important;
  }
  .kol-report-page > .hero h2,.kol-report-page > .card h2{color:#17243C!important}
  .kol-report-page .label,.kol-report-page .sub{color:#687990!important}
  @media(max-width:900px){
    .kol-report-page .report-chart-grid{grid-template-columns:1fr!important}
  }
 `;document.head.appendChild(s);
})();


/* ENTERPRISE PDF REBUILD · CREATOR FIT 2-UP + REPORT CHARTS · 20261008 */
function kolPdfText(v, fallback='—'){
  const t=String(v??'').replace(/\s+/g,' ').trim();
  return t||fallback;
}
function kolPdfWrap(doc,v,w){return doc.splitTextToSize(kolPdfText(v),Math.max(8,w));}
function kolPdfMoney(v){return v==null||!Number.isFinite(Number(v))?'—':Number(v).toLocaleString('en-US',{maximumFractionDigits:0});}
function kolPdfPct(v){return v==null||!Number.isFinite(Number(v))?'—':`${Number(v).toFixed(1)}%`;}
function kolPdfScore(v){return v==null||!Number.isFinite(Number(v))?'—':String(Math.round(Number(v)));}

function downloadCreatorFitPDF(){
  if(!S.creators.length){toast('Save creators before exporting the PDF.','error');return}
  if(!window.jspdf?.jsPDF){window.print();return}
  const rows=latestDecisionRows();
  if(!rows.length){toast('Run Creator Fit calculation before exporting the PDF.','error');return}
  const doc=new window.jspdf.jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const W=297,H=210,M=10,G=7,HEADER=19,FOOT=7,PANEL_H=(H-HEADER-FOOT-G-M*2)/2;
  const C={ink:[27,29,32],muted:[104,111,118],soft:[248,250,251],line:[218,224,228],cyan:[207,245,255],cyanStrong:[70,201,232],cream:[255,248,231],creamLine:[242,216,164],good:[34,139,104],warn:[215,132,43],risk:[194,88,74],white:[255,255,255]};
  const fill=(c)=>doc.setFillColor(...c),stroke=(c)=>doc.setDrawColor(...c),text=(c)=>doc.setTextColor(...c);
  const box=(x,y,w,h,r,fc=C.white,lc=C.line)=>{fill(fc);stroke(lc);doc.setLineWidth(.28);doc.roundedRect(x,y,w,h,r,r,'FD')};
  const header=(pageNo,total)=>{
    fill(C.white);doc.rect(0,0,W,H,'F');
    text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(10.5);doc.text('KOL IDS™',M,9.5);
    text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.4);doc.text('INVESTMENT DECISION INTELLIGENCE',M,14.1);
    text(C.muted);doc.setFontSize(6.3);doc.text(`CREATOR FIT & DECISION READINESS  ·  ${kolPdfText(S.selectedCampaign?.name)}`,W-M,9.5,{align:'right'});
    stroke(C.line);doc.setLineWidth(.25);doc.line(M,18,W-M,18);
    text(C.muted);doc.setFontSize(5.4);doc.text('Evidence-led decision view · Saved creator profile + current campaign / audience context',M,H-3.5);
    doc.text(`Page ${pageNo} / ${total}`,W-M,H-3.5,{align:'right'});
  };
  const statusFor=(score)=>score==null?'Awaiting fit':score>=85?'Strong consider':score>=70?'Consider':score>=55?'Review':'Needs work';
  const statusColor=(score)=>score==null?C.muted:score>=70?C.good:score>=55?C.warn:C.risk;
  const dimension=(e,key,legacy)=>{const de=e?.dimensionEvidence||{};const obj=de[key]||de[legacy]||{};const v=e?.[key];return {score:v==null?(obj.score==null?null:Number(obj.score)):Number(v),reason:obj.reason||e?.[`${key}Reason`]||'Based on available evidence.',action:obj.action||e?.[`${key}Action`]||'Refine the brief and validate evidence.'};};
  const drawMetric=(x,y,w,h,label,v,insight,action,isRisk)=>{
    box(x,y,w,h,2.2,C.soft,C.line);
    text(C.muted);doc.setFont('helvetica','bold');doc.setFontSize(5.1);doc.text(label.toUpperCase(),x+2.4,y+4.3);
    text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8.8);doc.text(kolPdfScore(v),x+w-2.4,y+4.8,{align:'right'});
    const n=Math.max(0,Math.min(100,Number(v)||0));fill(isRisk?[244,184,169]:C.cyanStrong);doc.roundedRect(x+2.4,y+7,w-4.8,1.8,.9,.9,'F');
    fill(isRisk?[222,119,99]:[104,214,238]);doc.roundedRect(x+2.4,y+7,(w-4.8)*n/100,1.8,.9,.9,'F');
    text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(4.7);doc.text(kolPdfWrap(insight,w-4.8).slice(0,1),x+2.4,y+12.7);
    stroke(C.line);doc.line(x+2.4,y+h-6,x+w-2.4,y+h-6);
    text(isRisk?C.risk:C.cyanStrong);doc.setFontSize(4.6);doc.text(kolPdfWrap(action,w-4.8).slice(0,1),x+2.4,y+h-2.5);
  };
  const drawGuidance=(x,y,w,h,label,value)=>{
    box(x,y,w,h,2.2,C.cream,C.creamLine);text([94,74,40]);doc.setFont('helvetica','bold');doc.setFontSize(4.9);doc.text(label.toUpperCase(),x+2.6,y+4.1);text(C.ink);doc.setFont('helvetica','normal');doc.setFontSize(5.1);doc.text(kolPdfWrap(value,w-5).slice(0,2),x+2.6,y+8.6);
  };
  const drawCreator=(row,idx,total,y)=>{
    const r=row.creator,d=row.decision||{},e=d.evidence||{},p=r.payload||{};
    const score=d.score==null?null:Math.round(Number(d.score)),conf=e.confidence==null?null:Math.round(Number(e.confidence));
    const dims=[
      ['Audience',dimension(e,'audienceFit','audience'),false],['Campaign',dimension(e,'contentFit','campaign'),false],['Brand',dimension(e,'brandFit','brand'),false],['Evidence',dimension(e,'performance','performance'),false],['Efficiency',dimension(e,'commercial','commercial'),false],['Risk',dimension(e,'risk','risk'),true]
    ];
    const gaps=dims.filter(x=>x[1].score!=null).sort((a,b)=>{const av=a[0]==='Risk'?100-a[1].score:a[1].score;const bv=b[0]==='Risk'?100-b[1].score:b[1].score;return av-bv});
    const priority=gaps[0];
    const status=statusFor(score);
    const reason=priority?({'Audience':'Audience match needs work.','Campaign':'Campaign objective fit needs work.','Brand':'Brand alignment needs work.','Evidence':'More performance evidence is needed.','Efficiency':'Fee / budget fit needs review.','Risk':'Execution risk needs tighter controls.'}[priority[0]]||'Fit is based on available evidence.'):'Fit is based on the available evidence.';
    const next=priority?({'Audience':'Refine audience + content examples.','Campaign':'Tighten brief, message + CTA.','Brand':'Set 2–3 brand cues.','Evidence':'Add recent reach + conversions.','Efficiency':'Adjust scope or test budget.','Risk':'Add tighter review controls.'}[priority[0]]||'Keep the brief aligned and test.'):'Keep the brief aligned and validate the next evidence point.';
    const st=decisionStrategy(e,r,S.selectedCampaign);
    box(M,y,W-2*M,PANEL_H,4,C.white,C.line);
    text(C.muted);doc.setFont('helvetica','bold');doc.setFontSize(4.9);doc.text(`CREATOR ${idx+1} / ${total}`,M+4,y+6.5);
    text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text(kolPdfText(r.name,'Creator'),M+4,y+13.2);
    text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.2);doc.text(`${kolPdfText(p.channel)}  ·  ${p.followers==null?'—':kolPdfMoney(p.followers)} followers  ·  ${p.er==null?'—':kolPdfPct(p.er)} ER`,M+4,y+18);
    // top metrics
    const mx=M+73,mw=39,mh=17,g=3;
    [['FIT',score],['EVIDENCE',dimension(e,'performance','performance').score],['CONFIDENCE',conf]].forEach((it,i)=>{const xx=mx+i*(mw+g);box(xx,y+4,mw,mh,2.4,C.soft,C.line);text(C.muted);doc.setFont('helvetica','bold');doc.setFontSize(4.7);doc.text(it[0],xx+2.4,y+8.3);text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(9.3);doc.text(kolPdfScore(it[1]),xx+2.4,y+15);});
    const dx=M+205;box(dx,y+4,78,mh,2.4,C.cyan,C.line);text(statusColor(score));doc.setFont('helvetica','bold');doc.setFontSize(6.1);doc.text(status.toUpperCase(),dx+3,y+10);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(4.7);doc.text(priority?`Gap: ${priority[0]}`:'No priority gap identified',dx+3,y+15);
    // six dimensions
    const gy=y+24, gap=2.3, cardW=(W-2*M-8-5*gap)/6, cardH=26;
    dims.forEach((m,i)=>drawMetric(M+4+i*(cardW+gap),gy,cardW,cardH,m[0],m[1].score,m[1].reason,m[1].action,m[2]));
    // decision read
    const sy=y+54,sw=(W-2*M-8)/3;
    drawGuidance(M+4,sy,sw,19,'Why',reason);
    drawGuidance(M+4+sw+4,sy,sw,19,'If selected',next);
    drawGuidance(M+4+(sw+4)*2,sy,sw,19,'Campaign move',st?.deployment||'Align content to the campaign objective and validate the next outcome.');
    text(C.muted);doc.setFont('helvetica','bold');doc.setFontSize(4.7);doc.text('DECISION GUIDANCE',M+4,y+78);
    text(C.ink);doc.setFont('helvetica','normal');doc.setFontSize(5.1);doc.text(kolPdfWrap(`Role: ${st?.bestRole||'—'}  ·  Gap: ${st?.fitGap||'—'}  ·  Format: ${st?.contentFormat||'—'}  ·  Plan: ${st?.deployment||'—'}`,W-2*M-12).slice(0,1),M+4,y+82);
  };
  const pages=Math.ceil(rows.length/2);
  for(let pi=0;pi<pages;pi++){
    if(pi)doc.addPage();
    header(pi+1,pages);
    const slice=rows.slice(pi*2,pi*2+2);
    slice.forEach((row,i)=>drawCreator(row,pi*2+i,rows.length,M+HEADER+i*(PANEL_H+G)));
  }
  const slug=String(S.selectedCampaign?.name||'Creator-Fit').trim().replace(/[^A-Za-z0-9-_]+/g,'-').replace(/^-+|-+$/g,'')||'Creator-Fit';
  doc.save(`KOL-IDS_Creator-Fit-Decision-Readiness_${slug}.pdf`);
  toast('Creator Fit PDF saved · 2 creators per A4 landscape page.','good');
}

function kolReportChartSvg(type,items){
 const W=1100,H=470,ink='#1B1D20',muted='#69727A',grid='#E9EEF1',cyan='#55CDE8',cyanSoft='#EAF9FC',maroon='#1B1D20';
 const escText=(v)=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const fmt=(v)=>{const n=Number(v)||0;if(Math.abs(n)>=1000000)return `฿${(n/1e6).toFixed(1)}M`;if(Math.abs(n)>=1000)return `฿${Math.round(n/1000)}K`;return `฿${Math.round(n).toLocaleString()}`};
 const base=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="2200" height="940"><rect width="${W}" height="${H}" fill="#FFFFFF"/><style>text{font-family:"Noto Sans Thai",Arial,sans-serif}.axis{font-size:20px;fill:${muted};font-weight:650}.label{font-size:21px;fill:${ink};font-weight:750}.value{font-size:23px;fill:${maroon};font-weight:850}.legend{font-size:20px;fill:${ink};font-weight:700}.grid{stroke:${grid};stroke-width:1}.lineA{stroke:${maroon};stroke-width:3.5;fill:none;stroke-linecap:round;stroke-linejoin:round}.lineB{stroke:${cyan};stroke-width:3.5;fill:none;stroke-linecap:round;stroke-linejoin:round}.dotA{fill:${maroon};stroke:#fff;stroke-width:3}.dotB{fill:${cyan};stroke:#fff;stroke-width:3}.small{font-size:18px;fill:${muted};font-weight:600}</style>`;
 if(type==='trend'){
   const valid=items||[],aVals=valid.map(x=>Number(x.a)).filter(Number.isFinite),bVals=valid.map(x=>Number(x.b)).filter(Number.isFinite);if(!aVals.length&&!bVals.length)return '';
   const maxA=Math.max(...aVals,1),maxB=Math.max(...bVals,1),l=105,r=105,t=88,b=75,iw=W-l-r,ih=H-t-b;
   const xAt=i=>l+(valid.length===1?iw/2:i*iw/(Math.max(1,valid.length-1))),yA=v=>t+ih-(Number(v)/maxA)*ih,yB=v=>t+ih-(Number(v)/maxB)*ih;
   const path=(k,fn,cls)=>{let pts=[];const out=[];valid.forEach((x,i)=>{const v=Number(x[k]);if(Number.isFinite(v))pts.push(`${xAt(i)},${fn(v)}`);else if(pts.length){out.push(`<polyline class="${cls}" points="${pts.join(' ')}"/>`);pts=[];}});if(pts.length)out.push(`<polyline class="${cls}" points="${pts.join(' ')}"/>`);return out.join('')};
   const dots=(k,fn,cls,offset)=>valid.map((x,i)=>{const v=Number(x[k]);if(!Number.isFinite(v))return '';const cx=xAt(i),cy=fn(v);const dense=valid.length>5,showLabel=!dense||i%2===0||i===valid.length-1;let ly=Math.max(t+18,Math.min(H-b-8,cy+offset+(dense&&i%2?16:0)));let tx=cx,anchor='middle';if(i===0){tx=cx+10;anchor='start'}else if(i===valid.length-1){tx=cx-10;anchor='end'}if(valid.length===1){tx=cx+(k==='a'?-10:10);anchor=k==='a'?'end':'start'}return `<circle class="${cls}" cx="${cx}" cy="${cy}" r="6"/>${showLabel?`<text class="value" x="${tx}" y="${ly}" text-anchor="${anchor}">${escText(fmt(v))}</text>`:''}`}).join('');
   const gridlines=Array.from({length:5},(_,i)=>{const f=i/4,y=t+ih*f,av=maxA*(1-f),bv=maxB*(1-f);return `<line class="grid" x1="${l}" y1="${y}" x2="${W-r}" y2="${y}"/><text class="axis" x="${l-16}" y="${y+7}" text-anchor="end">${escText(fmt(av))}</text><text class="axis" x="${W-r+16}" y="${y+7}">${escText(fmt(bv))}</text>`}).join('');
   const labels=valid.map((x,i)=>`<text class="axis" x="${xAt(i)}" y="${H-30}" text-anchor="middle">${escText(x.label)}</text>`).join('');
   return base+`<text class="label" x="${l}" y="27">Observed financial movement</text><text class="axis" x="${l}" y="52">Revenue · THB</text><text class="axis" x="${W-r}" y="52" text-anchor="end">Spend · THB</text><circle class="dotA" cx="790" cy="25" r="6"/><text class="legend" x="805" y="32">Revenue</text><circle class="dotB" cx="935" cy="25" r="6"/><text class="legend" x="950" y="32">Spend</text>${gridlines}${path('a',yA,'lineA')}${path('b',yB,'lineB')}${dots('a',yA,'dotA',-18)}${dots('b',yB,'dotB',24)}${labels}</svg>`;
 }
 if(type==='revenue'){
   const valid=(items||[]).filter(x=>Number(x.value)>0).sort((a,b)=>Number(b.value)-Number(a.value)),total=valid.reduce((a,x)=>a+Number(x.value),0),l=235,r=150,t=62,b=55,iw=W-l-r,rowH=Math.max(58,(H-t-b)/Math.max(1,valid.length)),max=Math.max(...valid.map(x=>Number(x.value)),1);
   const ticks=Array.from({length:5},(_,i)=>{const x=l+iw*i/4,v=max*i/4;return `<line class="grid" x1="${x}" y1="${t}" x2="${x}" y2="${H-b}"/><text class="axis" x="${x}" y="${H-20}" text-anchor="middle">${escText(fmt(v))}</text>`}).join('');
   const rows=valid.map((x,i)=>{const v=Number(x.value),share=v/total*100,y=t+i*rowH+(rowH-34)/2,w=iw*v/max;return `<text class="label" x="${l-18}" y="${y+24}" text-anchor="end">${escText(x.label)}</text><rect x="${l}" y="${y}" width="${iw}" height="34" rx="11" fill="${cyanSoft}" stroke="#D8EEF2"/><rect class="bar" x="${l}" y="${y}" width="${w}" height="34" rx="11"/><text class="value" x="${Math.min(l+w+12,l+iw-90)}" y="${y+24}">${escText(fmt(v))}</text><text class="value" x="${W-r+18}" y="${y+24}">${share.toFixed(1)}%</text>`}).join('');
   return base+`<text class="label" x="${l}" y="31">Recorded revenue by creator</text><text class="axis" x="${l}" y="51">Revenue scale · THB</text>${ticks}${rows}</svg>`;
 }
 if(type==='bar'){
   const valid=(items||[]).filter(x=>Number.isFinite(Number(x.value))),l=235,r=110,t=62,b=55,iw=W-l-r,rowH=Math.max(58,(H-t-b)/Math.max(1,valid.length)),max=Math.max(...valid.map(x=>Number(x.value)),1);
   const ticks=Array.from({length:5},(_,i)=>{const x=l+iw*i/4,v=max*i/4;return `<line class="grid" x1="${x}" y1="${t}" x2="${x}" y2="${H-b}"/><text class="axis" x="${x}" y="${H-20}" text-anchor="middle">${Math.round(v)}</text>`}).join('');
   const rows=valid.map((x,i)=>{const v=Number(x.value),y=t+i*rowH+(rowH-34)/2,w=iw*v/max;return `<text class="label" x="${l-18}" y="${y+24}" text-anchor="end">${escText(x.label)}</text><rect x="${l}" y="${y}" width="${iw}" height="34" rx="11" fill="${cyanSoft}" stroke="#D8EEF2"/><rect class="bar" x="${l}" y="${y}" width="${w}" height="34" rx="11"/><text class="value" x="${Math.min(l+w+12,l+iw-75)}" y="${y+24}">${Math.round(v)}</text>`}).join('');
   return base+`<text class="label" x="${l}" y="31">Observed outcome score</text><text class="axis" x="${l}" y="51">Score · 0–100</text>${ticks}${rows}</svg>`;
 }
 return '';
}
function kolReportDonutSvg(parts){
  const valid=(parts||[]).filter(x=>Number(x.value)>0),total=valid.reduce((a,x)=>a+Number(x.value),0);if(!total)return '';
  const W=900,H=470,cx=275,cy=245,r=145,inner=92,colors=['#46C9E8','#3D131B','#C9B58A','#9FDDEA'];let angle=-Math.PI/2,paths='';
  valid.forEach((x,i)=>{const a0=angle,a1=angle+Number(x.value)/total*Math.PI*2,x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),ix1=cx+inner*Math.cos(a1),iy1=cy+inner*Math.sin(a1),ix0=cx+inner*Math.cos(a0),iy0=cy+inner*Math.sin(a0),large=a1-a0>Math.PI?1:0;paths+=`<path d="M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix0} ${iy0} Z" fill="${colors[i%colors.length]}" opacity=".72"/>`;angle=a1});
  const legend=valid.map((x,i)=>{const y=105+i*58;return `<circle cx="585" cy="${y}" r="8" fill="${colors[i%colors.length]}" opacity=".75"/><text x="605" y="${y+7}" class="legend">${esc(x.label)}</text><text x="850" y="${y+7}" text-anchor="end" class="value">${Number(x.value).toLocaleString()}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="1800" height="940"><rect width="${W}" height="${H}" fill="#FFFFFF"/><style>text{font-family:"Noto Sans Thai",Arial,sans-serif}.label{font-size:21px;fill:#1B1D20;font-weight:700}.legend{font-size:21px;fill:#1B1D20;font-weight:700}.value{font-size:23px;fill:#1B1D20;font-weight:800}.center{font-size:38px;fill:#1B1D20;font-weight:900}.small{font-size:16px;fill:#69727A;font-weight:700;letter-spacing:2px}</style><text class="label" x="70" y="45">Observed records by evidence type</text><circle cx="${cx}" cy="${cy}" r="${r+2}" fill="none" stroke="#E6ECEF" stroke-width="2"/>${paths}<circle cx="${cx}" cy="${cy}" r="${inner}" fill="#FFFFFF"/><text class="center" x="${cx}" y="${cy+6}" text-anchor="middle">${total.toLocaleString()}</text><text class="small" x="${cx}" y="${cy+31}" text-anchor="middle">RECORDS</text>${legend}</svg>`;
}

async function buildPremiumFullPDF(){
  if(!window.jspdf?.jsPDF){window.print();return}
  const snap=reportLiveSnapshot(),{p,perf,digital,ecommerce,offline,decisionRows,impact,learning}=snap,visuals=buildReportVisuals(snap);
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
  const C={ink:[27,29,32],muted:[103,112,120],line:[218,225,229],cyan:[70,201,232],cyanSoft:[239,251,254],cream:[255,248,231],creamLine:[242,216,164],maroon:[61,19,27],white:[255,255,255]};
  const fill=c=>doc.setFillColor(...c),stroke=c=>doc.setDrawColor(...c),text=c=>doc.setTextColor(...c);
  const pageChrome=(title,sub)=>{fill(C.white);doc.rect(0,0,W,H,'F');text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('T POP ENTERTAINMENT CONNECTS',14,9);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(5.6);doc.text('INVESTMENT DECISION INTELLIGENCE',W-14,9,{align:'right'});stroke(C.line);doc.setLineWidth(.25);doc.line(14,13,W-14,13);text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text(pdfSafeText(title),14,23);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.text(pdfSafeText(sub||''),14,29);stroke(C.line);doc.line(14,H-11,W-14,H-11);doc.setFontSize(5.5);doc.text('Confidential · Evidence-led decision report · Observed data only',14,H-7);doc.text(`Page ${doc.internal.getNumberOfPages()}`,W-14,H-7,{align:'right'});};
  const section=(title,kicker)=>{text(C.cyan);doc.setFont('helvetica','bold');doc.setFontSize(6);doc.text(String(kicker||'SECTION').toUpperCase(),14,37);text(C.ink);doc.setFontSize(12);doc.text(pdfSafeText(title),14,44);stroke(C.line);doc.setLineWidth(.3);doc.line(14,48,W-14,48);};
  const metricCards=(items,y)=>{const gap=4,w=(W-28-gap*3)/4,h=23;items.slice(0,4).forEach((it,i)=>{const x=14+i*(w+gap);fill([248,250,251]);stroke(C.line);doc.setLineWidth(.28);doc.roundedRect(x,y,w,h,2.5,2.5,'FD');text(C.muted);doc.setFont('helvetica','bold');doc.setFontSize(5.3);doc.text(String(it.label||'').toUpperCase(),x+4,y+6);text(C.ink);doc.setFontSize(11);doc.text(kolPdfText(it.value),x+4,y+15);});};
  // cover / executive summary
  pageChrome('Campaign Intelligence Report',`Executive decision pack · ${kolPdfText(p?.name)} · observed evidence, creator decisions, performance and business impact`);
  section('Executive snapshot','01 · DECISION CONTEXT');
  metricCards([{label:'Creators evaluated',value:decisionRows.length||S.creators.length},{label:'Evidence records',value:perf.length},{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')}],55);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Campaign objective',14,90);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text(doc.splitTextToSize(pdfSafeText(p?.objective||p?.campaignObjective||'Not recorded.'),W-28),14,96);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Decision context',14,116);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text(doc.splitTextToSize(`Audience: ${kolPdfText(S.selectedAudience?.name)} · Selected creators: ${(p?.selectedCreatorIds||[]).length||0} · Evidence classes: ${digital.length} digital / ${ecommerce.length} commerce / ${offline.length} event`,W-28),14,122);
  fill(C.cream);stroke(C.creamLine);doc.roundedRect(14,145,W-28,29,3,3,'FD');text([94,74,40]);doc.setFont('helvetica','bold');doc.setFontSize(7);doc.text('GOVERNANCE NOTE',18,153);text(C.ink);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.text(doc.splitTextToSize('KOL IDS uses observed evidence only. Missing evidence remains missing and is not converted into invented values. Forecast-like language is treated as a hypothesis until supported by campaign observations.',W-40),18,160);
  // creator decision register
  doc.addPage();pageChrome('Creator decision register','Fit, evidence, confidence and recommended campaign move');section('Creator decision register','02 · CREATOR INTELLIGENCE');
  if(decisionRows.length){const tctx={W,H,y:53,header:()=>{pageChrome('Creator decision register','Fit, evidence, confidence and recommended campaign move');tctx.y=53},footer:()=>{}};pdfRows(doc,tctx,['Creator','Channel','Fit','Evidence','Confidence','Decision','Gap'],decisionRows.map(({creator:r,decision:d})=>{const e=d.evidence||{};const dims=[['Audience',e.audienceFit],['Campaign',e.contentFit],['Brand',e.brandFit],['Evidence',e.performance],['Efficiency',e.commercial],['Risk',e.risk]];const gaps=dims.filter(x=>x[1]!=null).sort((a,b)=>Number(a[1])-Number(b[1]));return [r.name,r.payload?.channel||'—',kolPdfScore(d.score),e.performanceEvidenceAvailable===false?'—':kolPdfScore(e.performance),kolPdfScore(e.confidence),String(d.decision||'REVIEW').replace(/_/g,' '),gaps[0]?.[0]||'—']}),[48,26,18,20,24,42,20]);}
  else {text(C.muted);doc.setFontSize(8);doc.text('No calculated creator decisions are available.',14,58)}
  // model governance / accuracy page
  doc.addPage();pageChrome('Decision quality & model governance','Reliability, evidence quality and out-of-sample prediction monitoring');section('Decision quality & model governance','03 · MODEL GOVERNANCE');
  const q=reportDecisionQuality(snap);
  metricCards([{label:'Avg confidence',value:q.avgConfidence==null?'—':Math.round(q.avgConfidence)},{label:'High-trust decisions',value:q.highTrust},{label:'Predictions with actuals',value:q.predictionN},{label:'Prediction MAE',value:q.predictionMae==null?'—':Math.round(q.predictionMae)}],55);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Governance interpretation',14,94);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text(doc.splitTextToSize('Confidence is an evidence-reliability measure, not a bonus added to creator fit. Performance history is modeled from observed outcomes, comparable cohorts, recency weighting, out-of-sample calibration and drift guards. When history is missing, performance remains neutral and the decision is gated for review rather than penalized as poor performance.',W-28),14,101);
  const govRows=[['Calibrated decisions',`${q.calibrated}`],['High-trust decisions',`${q.highTrust}`],['Historical-evidence gate',q.insufficient?'REVIEW REQUIRED':'PASSED'],['Verified / API performance records',`${q.verified}/${perf.length}`],['Prediction interval coverage',q.predictionCoverage==null?'Not enough history':`${Math.round(q.predictionCoverage)}%`],['Prediction bias',q.predictionBias==null?'Not enough history':`${q.predictionBias>0?'+':''}${q.predictionBias.toFixed(1)} points`]];
  const gctx={W,H,y:122,header:()=>{pageChrome('Decision quality & model governance','Reliability, evidence quality and out-of-sample prediction monitoring');gctx.y=53},footer:()=>{}};pdfRows(doc,gctx,['Control','Current state'],govRows,[72,100]);
  // charts - one large professional chart per page
  const chartPages=[['Outcome trend','Revenue vs spend across observed dates',kolReportChartSvg('trend',visuals.trend)],['Creator performance','Observed outcome score by creator',kolReportChartSvg('bar',visuals.bars)],['Revenue contribution','Observed revenue contribution by creator',kolReportChartSvg('revenue',visuals.revBars)],['Evidence mix','Observed records by evidence type',kolReportDonutSvg(visuals.mix)]];
  for(const [title,note,svg] of chartPages){doc.addPage();pageChrome(title,note);if(svg){await pdfAddSvgImage(doc,svg,14,43,W-28,115);}else{text(C.muted);doc.setFontSize(9);doc.text('Not enough evidence to visualize',14,55);} }
  // performance detail
  doc.addPage();pageChrome('Performance evidence','Observed records with source transparency and commercial outcomes');section('Performance evidence','07 · PERFORMANCE');
  if(perf.length){const pctx={W,H,y:53,header:()=>{pageChrome('Performance evidence','Observed records with source transparency and commercial outcomes');pctx.y=53},footer:()=>{}};pdfRows(doc,pctx,['Creator','Type','Observed','Source','Score','Spend','Revenue','ROAS'],pdfObservationRows(snap).map(r=>[r[0],r[1],r[2],r[4],r[5],r[6],r[7],r[8]]),[40,24,25,26,18,27,30,24]);}
  else {text(C.muted);doc.setFontSize(8);doc.text('No observed performance records are available.',14,58)}
  // impact and learning
  doc.addPage();pageChrome('Business impact & learning','Observed outcomes, unit economics and next investment decision');section('Business impact','08 · COMMERCIAL OUTCOME');
  metricCards([{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'Spend',value:impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')},{label:'Conversions',value:impact.conversions==null?'Not recorded':Number(impact.conversions).toLocaleString()}],55);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('What worked',14,92);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7.3);doc.text(doc.splitTextToSize(kolPdfText(learning.worked,'Not recorded yet.'),W-28),14,98);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Friction / what did not work',14,120);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7.3);doc.text(doc.splitTextToSize(kolPdfText(learning.friction,'Not recorded yet.'),W-28),14,126);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Next hypothesis',14,148);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7.3);doc.text(doc.splitTextToSize(kolPdfText(learning.hypothesis,'Not recorded yet.'),W-28),14,154);
  // executive interpretation: distinguish observed facts from data gaps
  doc.addPage();pageChrome('Outcome interpretation','Observed signals, limitations and decision implications');section('Outcome interpretation','08A · PERFORMANCE ANALYSIS');
  const interp=[
    ['Revenue recorded',impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')],
    ['Spend recorded',impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB')],
    ['ROAS',impact.roas==null?'Not calculable from the available evidence':pdfFmt(impact.roas,'x')],
    ['Evidence volume',`${perf.length} performance records (${digital.length} digital · ${ecommerce.length} commerce · ${offline.length} offline/event)`],
    ['Creator decisions',`${decisionRows.length} creator decision records`],
    ['Evidence confidence',`${reportDecisionQuality(snap).avgConfidence==null?'Not enough evidence':Math.round(reportDecisionQuality(snap).avgConfidence)+' / 100'}`],
    ['Interpretation boundary','Recorded values describe the evidence supplied; they do not independently verify third-party platform analytics.']
  ];
  const ictx={W,H,y:53,header:()=>{pageChrome('Outcome interpretation','Observed signals, limitations and decision implications');ictx.y=53},footer:()=>{}};
  pdfRows(doc,ictx,['Measure','Observed value / interpretation'],interp,[55,125]);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Decision implications',14,ictx.y+10);
  text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(7.5);
  const implications=[
    impact.roas==null?'Do not compare commercial efficiency until spend and attributable revenue are both recorded.':`Use the observed ROAS of ${pdfFmt(impact.roas,'x')} as a campaign-specific signal, not as a guaranteed future return.`,
    perf.length?'Check evidence provenance, observation dates and attribution scope before reallocating budget.':'Collect platform, source, observation date, spend and outcome evidence before drawing performance conclusions.',
    decisionRows.length?'Review fit, confidence and evidence gaps together; confidence is not a substitute for fit.':'Complete creator decision records to make selection rationale and trade-offs auditable.'
  ];
  implications.forEach((v,i)=>{text(C.cyan);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text(String(i+1),16,ictx.y+19+i*15);text(C.ink);doc.setFont('helvetica','normal');doc.setFontSize(7.2);doc.text(doc.splitTextToSize(v,W-42),24,ictx.y+19+i*15);});
  // audit-ready evidence ledger and next decision
  doc.addPage();pageChrome('Evidence ledger','Complete recorded performance fields for auditability');section('Evidence ledger','09 · GOVERNANCE');
  if(perf.length){perf.forEach((x,i)=>{if(i){doc.addPage();pageChrome('Evidence ledger','Complete recorded performance fields for auditability');section(`Evidence record ${i+1}`,'09 · GOVERNANCE')}const nm=S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator';const ectx={W,H,y:53,header:()=>{pageChrome(`Evidence record ${i+1}`,'Complete recorded performance fields for auditability');ectx.y=53},footer:()=>{}};pdfRows(doc,ectx,['Recorded field','Value'],pdfCompleteEvidenceRows(x),[58,122]);});}else{text(C.muted);doc.setFontSize(8);doc.text('No complete evidence records are available.',14,58)}
  doc.addPage();pageChrome('Next investment decision','Learning memory and recommended next actions');section('Next investment decision','10 · LEARNING MEMORY');
  const next=learning.nextInvestmentDecision||{};
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Recommendation',14,57);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(doc.splitTextToSize(kolPdfText(next.recommendation,'Not recorded yet.'),W-28),14,63);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Confidence / rationale',14,83);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(doc.splitTextToSize(`${kolPdfText(next.confidence,'—')} · ${kolPdfText(next.reason,'No rationale recorded.')}`,W-28),14,89);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Success threshold',14,110);text(C.muted);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(doc.splitTextToSize(kolPdfText(next.threshold,'Not recorded yet.'),W-28),14,116);
  text(C.ink);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Next actions',14,137);
  (learning.nextActions||[]).slice(0,5).forEach((a,i)=>{text(C.cyan);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text(`${i+1}`,16,146+i*11);text(C.ink);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text(doc.splitTextToSize(kolPdfText(a),W-40).slice(0,2),24,146+i*11)});
  doc.save(pdfSaveName('KOL-IDS_Enterprise-Campaign-Intelligence',S.selectedCampaign?.name));
  toast('Enterprise report PDF saved · professional chart pages included.','good');
}
function downloadFullPDF(){if(reportExportIsTrial()){showPaidExportGate();return}buildPremiumFullPDF().catch(err=>{console.error(err);toast('Could not generate the detailed PDF. Please try again.','error')})}


/* KOL IDS CI FINAL REPORT OVERRIDE · 20261008
   Keep the product palette intact: maroon + soft cyan + warm neutral.
   No violet / royal-blue substitutions. Prioritize large, readable chart typography. */
(function(){
  const id='kol-ids-report-ci-final-20261008';
  if(document.getElementById(id))return;
  const s=document.createElement('style');s.id=id;s.textContent=`
    .kol-report-page .report-chart-card{background:rgba(255,255,255,.92)!important;border:1px solid #D9EDF2!important;box-shadow:0 10px 28px rgba(61,19,27,.045)!important;border-radius:16px!important}
    .kol-report-page .report-chart-card h3,.kol-report-page .report-chart-card h4{color:#3D131B!important;font-size:19px!important}
    .kol-report-page .report-chart-card .sub,.kol-report-page .report-chart-card small{color:#6F7D83!important;font-size:12px!important}
    .kol-report-page .report-chart-svg .rchart-gridline{stroke:#DDE8EB!important;stroke-width:1!important}
    .kol-report-page .report-chart-svg .rchart-axis{fill:#6F7D83!important;font-size:16px!important;font-weight:650!important}
    .kol-report-page .report-chart-svg .rchart-label{fill:#3D131B!important;font-size:16px!important;font-weight:700!important}
    .kol-report-page .report-chart-svg .rchart-label-strong{fill:#3D131B!important;font-size:17px!important;font-weight:850!important}
    .kol-report-page .report-chart-svg .rchart-value{fill:#3D131B!important;font-size:18px!important;font-weight:900!important}
    .kol-report-page .report-chart-svg .rchart-share{fill:#3D131B!important;font-size:17px!important;font-weight:900!important}
    .kol-report-page .report-chart-svg .rchart-point-value{fill:#3D131B!important;font-size:16px!important;font-weight:900!important}
    .kol-report-page .report-chart-svg .rchart-legend{fill:#3D131B!important;font-size:15px!important;font-weight:800!important}
    .kol-report-page .report-chart-svg .rchart-line-a{stroke:#3D131B!important;stroke-width:2.4!important;fill:none!important;opacity:1!important}
    .kol-report-page .report-chart-svg .rchart-line-b{stroke:#55CDE8!important;stroke-width:2.4!important;fill:none!important;opacity:1!important}
    .kol-report-page .report-chart-svg .rchart-dot-a{fill:#3D131B!important;stroke:#fff!important;stroke-width:2!important}
    .kol-report-page .report-chart-svg .rchart-dot-b{fill:#55CDE8!important;stroke:#fff!important;stroke-width:2!important}
    .kol-report-page .report-chart-svg .rchart-bar{fill:#55CDE8!important;fill-opacity:.62!important;opacity:1!important}
    .kol-report-page .report-chart-svg .rchart-bar-track{fill:#EEF9FB!important;stroke:#D9EDF2!important}
    .kol-report-page .report-donut{box-shadow:inset 0 0 0 1px rgba(61,19,27,.05)!important}
    .kol-report-page .report-donut strong{color:#3D131B!important;font-size:34px!important}
    .kol-report-page .report-donut span{color:#6F7D83!important;font-size:12px!important;font-weight:800!important}
    .kol-report-page .report-legend>div{font-size:15px!important;grid-template-columns:11px 1fr auto!important;gap:10px!important}
    .kol-report-page .report-legend span{color:#3D131B!important;font-size:15px!important;font-weight:750!important}
    .kol-report-page .report-legend b{color:#3D131B!important;font-size:16px!important;font-weight:900!important}
    .kol-report-page .report-legend i{width:10px!important;height:10px!important}
    .kol-report-page .report-chart-empty{font-size:15px!important;color:#6F7D83!important;border-color:#D9EDF2!important;background:rgba(255,255,255,.72)!important}
  `;document.head.appendChild(s);
})();

/* T POP ENTERTAINMENT CONNECTS · STEP 07 REPORT UI FINAL · 20261008 */
(function(){
 const id='kol-ids-step07-tpop-entertainment-final-20261008';
 if(document.getElementById(id))return;
 const s=document.createElement('style');s.id=id;s.textContent=`
  .kol-report-page{
    --tpop-ink:#11181B;
    --tpop-muted:#66777D;
    --tpop-line:#DDECEF;
    --tpop-cyan:#AEEFFF;
    --tpop-cyan-deep:#49B8CC;
    --tpop-cyan-soft:#F3FCFE;
    color:var(--tpop-ink)!important;
    max-width:1480px!important;
    margin:0 auto!important;
    padding-bottom:56px!important;
  }
  .kol-report-page > .hero{
    background:linear-gradient(135deg,#FFFFFF 0%,#FBFEFF 72%,#F3FCFE 100%)!important;
    border:1px solid var(--tpop-line)!important;
    border-radius:22px!important;
    box-shadow:0 18px 48px rgba(17,24,27,.055)!important;
    padding:30px 32px 28px!important;
    margin-bottom:16px!important;
  }
  .kol-report-page > .hero:before{background:var(--tpop-cyan)!important;width:3px!important}
  .kol-report-page > .hero .kicker{color:#71858B!important;font-size:10px!important;font-weight:800!important;letter-spacing:.13em!important}
  .kol-report-page > .hero h2{color:var(--tpop-ink)!important;font-size:31px!important;line-height:1.08!important;letter-spacing:-.035em!important;margin:8px 0 6px!important}
  .kol-report-page > .hero p{color:#617278!important;max-width:820px!important;font-size:14px!important;line-height:1.72!important;margin-top:10px!important}
  .kol-report-page .report-brandline{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 6px!important;color:#31464D!important;font-size:11px!important;font-weight:750!important;letter-spacing:.02em!important}
  .kol-report-page .report-brandline span:first-child{padding-right:10px;border-right:1px solid #D5E7EB!important}
  .kol-report-page .report-brandline span:last-child{color:#7C8E94!important;font-weight:650!important}
  .kol-report-page .hero-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex-wrap:wrap!important;margin-top:18px!important}
  .kol-report-page .hero-actions .btn{border:1px solid #D7E7EA!important;background:#fff!important;color:#31464D!important;border-radius:10px!important;min-height:40px!important;padding:9px 13px!important;font-weight:750!important;box-shadow:none!important}
  .kol-report-page .hero-actions .btn:hover{border-color:#A8DCE6!important;background:#F8FDFE!important}
  .kol-report-page .hero-actions .btn.primary{background:#11181B!important;border-color:#11181B!important;color:#fff!important}
  .kol-report-page .hero-actions .btn.primary:hover{background:#243137!important;border-color:#243137!important}
  .kol-report-page .hero-actions .btn.good{background:#F2FCFE!important;border-color:#C8EDF3!important;color:#2F7F8C!important}
  .kol-report-page .pill.cyan{background:#F1FCFE!important;border-color:#C8EDF3!important;color:#3C8793!important}
  .kol-report-page .pill.good{background:#F1FCFE!important;border-color:#C8EDF3!important;color:#2F7F8C!important}

  .kol-report-page > .grid.g4{gap:12px!important;margin-bottom:0!important}
  .kol-report-page > .grid.g4 .metric,
  .kol-report-page .report-model-quality .metric,
  .kol-report-page .report-data-quality .metric{
    background:#fff!important;border:1px solid var(--tpop-line)!important;border-radius:16px!important;
    box-shadow:0 8px 24px rgba(17,24,27,.035)!important;padding:18px 19px!important;min-height:106px!important
  }
  .kol-report-page .metric .label{color:#74878D!important;font-size:10px!important;font-weight:800!important;letter-spacing:.085em!important;text-transform:uppercase!important}
  .kol-report-page .metric strong{color:var(--tpop-ink)!important;font-size:27px!important;font-weight:850!important;letter-spacing:-.035em!important}
  .kol-report-page .metric small{color:#8A999E!important;font-size:11px!important;line-height:1.45!important}

  .kol-report-page > section.card{
    border:1px solid var(--tpop-line)!important;border-radius:18px!important;background:#fff!important;
    box-shadow:0 8px 28px rgba(17,24,27,.035)!important;padding:23px 24px!important
  }
  .kol-report-page .section-head{margin-bottom:16px!important}
  .kol-report-page .section-head .label{color:#6F858C!important;font-size:10px!important;font-weight:850!important;letter-spacing:.12em!important}
  .kol-report-page .section-head h2{color:var(--tpop-ink)!important;font-size:20px!important;letter-spacing:-.025em!important;margin-top:5px!important}
  .kol-report-page .section-head .sub{color:#73858B!important;font-size:12px!important;line-height:1.65!important}
  .kol-report-page .signal-box{background:#FBFEFF!important;border:1px solid #E1EEF1!important;border-radius:13px!important;box-shadow:none!important;padding:17px 18px!important}
  .kol-report-page .signal-box h4{color:#1C3036!important;font-size:13px!important;font-weight:800!important;margin-bottom:7px!important}
  .kol-report-page .signal-box p{color:#61747A!important;font-size:12px!important;line-height:1.62!important}
  .kol-report-page .signal-box b,.kol-report-page .signal-box strong{color:#17252A!important}

  .kol-report-page .report-model-quality{background:linear-gradient(180deg,#FFFFFF 0%,#FAFEFF 100%)!important;border-color:#CFEAF0!important}
  .kol-report-page .report-model-quality .evidence-status-grid,
  .kol-report-page .report-data-quality .evidence-status-grid{gap:9px!important;margin-top:12px!important}
  .kol-report-page .evidence-status{
    min-height:58px!important;background:#FAFDFE!important;border:1px solid #DDECEF!important;border-radius:12px!important;
    padding:11px 12px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:3px!important
  }
  .kol-report-page .evidence-status b{color:#26383D!important;font-size:14px!important;font-weight:850!important}
  .kol-report-page .evidence-status span{color:#789097!important;font-size:10px!important;font-weight:700!important;letter-spacing:.02em!important}
  .kol-report-page .evidence-status.is-present{background:#F2FCFE!important;border-color:#C7EAF0!important}
  .kol-report-page .evidence-status.is-present b{color:#3B8996!important}
  .kol-report-page .evidence-status.is-missing{background:#FCFDFD!important;border-color:#E5ECEE!important}
  .kol-report-page .evidence-status.is-missing b{color:#7C898D!important}

  .kol-report-page .table-wrap{border:1px solid #E1ECEF!important;border-radius:12px!important;overflow:auto!important;background:#fff!important}
  .kol-report-page table{min-width:860px!important;border-collapse:separate!important;border-spacing:0!important}
  .kol-report-page th{background:#F7FBFC!important;color:#71838A!important;font-size:10px!important;font-weight:850!important;letter-spacing:.07em!important;text-transform:uppercase!important;padding:11px 12px!important;border-bottom:1px solid #DFEBEE!important;white-space:nowrap!important}
  .kol-report-page td{color:#405158!important;font-size:12px!important;line-height:1.45!important;padding:12px!important;border-bottom:1px solid #EEF3F4!important;vertical-align:top!important}
  .kol-report-page tr:last-child td{border-bottom:0!important}
  .kol-report-page td b{color:#18272C!important;font-weight:800!important}

  .kol-report-page .report-visuals{background:linear-gradient(180deg,#FBFEFF 0%,#F7FCFD 100%)!important;border-color:#D4EAF0!important;padding:25px!important}
  .kol-report-page .report-visuals .section-head{border-bottom:1px solid #E0EEF1!important;padding-bottom:15px!important}
  .kol-report-page .report-chart-grid{gap:14px!important}
  .kol-report-page .report-chart-card{background:#fff!important;border:1px solid #DDECEF!important;border-radius:15px!important;box-shadow:0 6px 22px rgba(17,24,27,.035)!important;padding:18px 18px 15px!important}
  .kol-report-page .report-chart-head{border-bottom:1px solid #E7F0F2!important;padding-bottom:10px!important;margin-bottom:10px!important}
  .kol-report-page .report-chart-head b{color:#1B2C31!important;font-size:13px!important;font-weight:800!important;letter-spacing:.015em!important}
  .kol-report-page .report-chart-head span{color:#7B8C92!important;font-size:10px!important;font-weight:750!important;letter-spacing:.05em!important;text-transform:uppercase!important}
  .kol-report-page .report-chart-svg{min-height:320px!important;background:#fff!important}
  .kol-report-page .report-chart-svg .rchart-line-a{stroke:#25373D!important;stroke-width:2.3!important}
  .kol-report-page .report-chart-svg .rchart-line-b{stroke:#AEEFFF!important;stroke-width:2.2!important;stroke-dasharray:6 5!important}
  .kol-report-page .report-chart-svg .rchart-dot-a{fill:#25373D!important;stroke:#fff!important;stroke-width:2.2!important}
  .kol-report-page .report-chart-svg .rchart-dot-b{fill:#AEEFFF!important;stroke:#79CFE0!important;stroke-width:1.4!important}
  .kol-report-page .report-chart-svg .rchart-bar{fill:#AEEFFF!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-0{fill:#78D6E8!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-1{fill:#AEEFFF!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-2{fill:#C9F5FC!important}
  .kol-report-page .report-chart-svg .rchart-revenue-bar-3{fill:#E5FAFD!important}
  .kol-report-page .report-chart-svg .rchart-bar-track{fill:#F5FCFD!important;stroke:#DCECEF!important}
  .kol-report-page .report-chart-svg .rchart-gridline{stroke:#E7F1F3!important}
  .kol-report-page .report-chart-svg .rchart-axis{fill:#819196!important;font-size:11px!important}
  .kol-report-page .report-chart-svg .rchart-label,.kol-report-page .report-chart-svg .rchart-label-strong,.kol-report-page .report-chart-svg .rchart-value,.kol-report-page .report-chart-svg .rchart-share,.kol-report-page .report-chart-svg .rchart-point-value,.kol-report-page .report-chart-svg .rchart-legend{fill:#25373D!important}
  .kol-report-page .report-donut{box-shadow:0 0 0 1px #DDECEF!important}

  .kol-report-page .report-data-quality{background:#fff!important}
  .kol-report-page .formula-note{color:#89989D!important;font-size:10px!important}
  .kol-report-page .mini-stat{color:#152329!important;font-size:23px!important;font-weight:850!important;letter-spacing:-.025em!important}
  .kol-report-page .reports-next-cards .signal-box{min-height:130px!important}
  .kol-report-page .empty{border:1px dashed #D5E6EA!important;background:#FBFEFF!important;color:#7B8B90!important;border-radius:12px!important;padding:22px!important}
  @media(max-width:1100px){.kol-report-page > .hero{padding:25px!important}.kol-report-page .hero-actions{justify-content:flex-start!important}.kol-report-page .hero-actions .btn{font-size:10px!important}}
  @media(max-width:900px){.kol-report-page .report-chart-grid{grid-template-columns:1fr!important}.kol-report-page > .grid.g4{grid-template-columns:repeat(2,minmax(0,1fr))!important}.kol-report-page > section.card{padding:19px!important}}
  @media(max-width:560px){.kol-report-page{padding:0 2px 36px!important}.kol-report-page > .hero h2{font-size:25px!important}.kol-report-page > .hero p{font-size:12px!important}.kol-report-page .report-brandline{font-size:10px!important}.kol-report-page .hero-actions .btn{width:100%!important}.kol-report-page > .grid.g4{grid-template-columns:1fr!important}.kol-report-page .metric strong{font-size:24px!important}.kol-report-page .report-chart-svg{min-height:280px!important}.kol-report-page .report-chart-card{padding:14px!important}}
 `;document.head.appendChild(s);
})();


/* Integrated report/chart upgrade from release patch */
/* KOL IDS REPORT · UNIFIED ROYAL BLUE + PREMIUM PDF · 20261006 */
(function(){
 const styleId='kol-ids-report-unified-blue-premium-20261006';
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
  .kol-report-page .report-chart-grid{gap:18px!important}
  .kol-report-page .report-chart-card{background:linear-gradient(180deg,#FFFFFF 0%,#F9FBFF 100%)!important;border:1px solid #D8E2F3!important;border-top:2px solid #2454C7!important;border-radius:16px!important;padding:22px 22px 20px!important;box-shadow:0 12px 34px rgba(36,84,199,.07)!important}
  .kol-report-page .report-chart-head{border-bottom:1px solid #E6ECF6!important;padding-bottom:13px!important;margin-bottom:14px!important}
  .kol-report-page .report-chart-head b{color:#17243C!important;font-size:14px!important;font-weight:800!important;letter-spacing:-.02em!important}
  .kol-report-page .report-chart-head span{color:#667892!important;font-size:10px!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:.08em!important}
  .kol-report-page .report-chart-svg text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
  .kol-report-page .rchart-value,.kol-report-page .rchart-share{fill:#17243C!important;font-weight:850!important}
  .kol-report-page .rchart-label-strong{fill:#30415D!important;font-weight:750!important}
  .kol-report-page .rchart-label,.kol-report-page .rchart-date-label{fill:#52647F!important;font-weight:650!important}
  .kol-report-page .rchart-axis{fill:#71819A!important;font-weight:650!important}
  .kol-report-page .rchart-legend{fill:#30415D!important;font-weight:750!important}
  .kol-report-page .rchart-gridline{stroke:#E3EAF5!important;stroke-width:1!important}
  .kol-report-page .rchart-bar{fill:#2454C7!important;opacity:1!important}
  .kol-report-page .rchart-bar-track{fill:#E8EEF9!important}
  .kol-report-page .rchart-line-a{stroke:#2454C7!important;stroke-width:3.2!important;stroke-linecap:round!important;stroke-linejoin:round!important}
  .kol-report-page .rchart-line-b{stroke:#6D8DDF!important;stroke-width:3!important;stroke-linecap:round!important;stroke-linejoin:round!important;stroke-dasharray:7 5!important}
  .kol-report-page .rchart-dot-a{fill:#2454C7!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  .kol-report-page .rchart-dot-b{fill:#6D8DDF!important;stroke:#FFFFFF!important;stroke-width:2.5!important}
  .kol-report-page .rchart-point-value{fill:#17243C!important;font-size:13px!important;font-weight:900!important}
  .kol-report-page .rchart-dot-a-text,.kol-report-page .rchart-dot-b-text{fill:#17243C!important}
  .kol-report-page .report-chart-empty{height:230px!important;min-height:230px!important;border:1px dashed #C9D6EB!important;background:#F8FAFE!important;color:#536783!important;font-weight:750!important}
  .kol-report-page .report-donut-wrap{min-height:250px!important;gap:42px!important}
  .kol-report-page .report-donut{width:174px!important;height:174px!important;flex-basis:174px!important;box-shadow:0 0 0 1px #D5E0F4,0 16px 38px rgba(36,84,199,.09)!important}
  .kol-report-page .report-donut>div{width:132px!important;height:132px!important;background:#FFFFFF!important;box-shadow:0 8px 26px rgba(36,84,199,.08)!important}
  .kol-report-page .report-donut strong{color:#17243C!important;font-size:27px!important;font-weight:900!important}
  .kol-report-page .report-donut span{color:#71819A!important;font-size:8px!important;font-weight:800!important;letter-spacing:.12em!important}
  .kol-report-page .report-legend{gap:13px!important;min-width:190px!important}
  .kol-report-page .report-legend>div{font-size:11px!important;grid-template-columns:9px 1fr auto!important;gap:10px!important}
  .kol-report-page .report-legend i{width:9px!important;height:9px!important}
  .kol-report-page .report-legend span{color:#52647F!important;font-weight:700!important}
  .kol-report-page .report-legend b{color:#2454C7!important;font-size:12px!important;font-weight:900!important}
  .kol-report-page .evidence-status.is-present{border-color:#D5E0F4!important;background:#F7F9FD!important}
  .kol-report-page .evidence-status.is-present b{color:#2454C7!important}
  @media(max-width:900px){.kol-report-page .report-chart-grid{grid-template-columns:1fr!important}}
  @media(max-width:560px){.kol-report-page .report-chart-card{padding:16px!important}.kol-report-page .report-chart-head b{font-size:13px!important}.kol-report-page .rchart-value{font-size:11px!important}.kol-report-page .rchart-label,.kol-report-page .rchart-label-strong{font-size:10px!important}.kol-report-page .rchart-axis{font-size:9px!important}}
 `;document.head.appendChild(s);
})();

function pdfBlueHeader(doc,title,subtitle=''){
 const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
 const header=()=>{doc.setDrawColor(36,84,199);doc.setLineWidth(.65);doc.line(14,12,W-14,12);doc.setFillColor(36,84,199);doc.roundedRect(14,6.2,4.2,4.2,1,1,'F');doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(36,84,199);doc.text('KOL IDS™',21,9.3);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(93,108,132);doc.text('INVESTMENT DECISION INTELLIGENCE',W-14,9.3,{align:'right'});};
 const footer=()=>{doc.setDrawColor(220,227,239);doc.setLineWidth(.18);doc.line(14,H-13,W-14,H-13);doc.setFont('helvetica','normal');doc.setFontSize(6.8);doc.setTextColor(105,119,142);doc.text('Confidential · Evidence-led decision report · Observed data only',14,H-8);doc.setTextColor(36,84,199);doc.text('Page '+doc.internal.getNumberOfPages(),W-14,H-8,{align:'right'});};
 header();footer();doc.setFont('helvetica','bold');doc.setFontSize(21);doc.setTextColor(23,36,60);doc.text(pdfSafeText(title),14,25);if(subtitle){doc.setFont('helvetica','normal');doc.setFontSize(8.3);doc.setTextColor(82,100,127);doc.text(pdfSafeText(subtitle),14,31)}return {W,H,header,footer};
}
function pdfBlueSection(doc,ctx,title,kicker=''){pdfPageBreak(doc,ctx,19);ctx.y+=4;doc.setFont('helvetica','bold');doc.setFontSize(6.8);doc.setTextColor(36,84,199);doc.text(pdfSafeText(kicker||'SECTION').toUpperCase(),14,ctx.y);ctx.y+=6;doc.setFontSize(12.5);doc.setTextColor(23,36,60);doc.text(pdfSafeText(title),14,ctx.y);ctx.y+=5;doc.setDrawColor(36,84,199);doc.setLineWidth(.45);doc.line(14,ctx.y,ctx.W-14,ctx.y);ctx.y+=6;}
function pdfBlueMetrics(doc,ctx,items){const gap=4,w=(ctx.W-28-gap*3)/4,h=22;let x=14;items.forEach((it,i)=>{if(i&&i%4===0){ctx.y+=h+4;x=14}if(pdfPageBreak(doc,ctx,h+2))x=14;doc.setFillColor(248,250,254);doc.setDrawColor(214,224,241);doc.roundedRect(x,ctx.y,w,h,2.5,2.5,'FD');doc.setFont('helvetica','bold');doc.setFontSize(6.7);doc.setTextColor(91,109,137);doc.text(String(it.label||'').toUpperCase(),x+4,ctx.y+6.5);doc.setFontSize(11.5);doc.setTextColor(23,36,60);doc.text(pdfSafeText(it.value),x+4,ctx.y+15);x+=w+gap});ctx.y+=h+7}
function pdfChartSvgStyled(svg){if(!svg||!svg.startsWith('<svg'))return svg;const css='.rchart-gridline{stroke:#E3EAF5;stroke-width:1}.rchart-axis{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:13px;fill:#71819A;font-weight:600}.rchart-label{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:13px;fill:#52647F;font-weight:650}.rchart-label-strong{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:15px;fill:#30415D;font-weight:750}.rchart-value{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:16px;fill:#17243C;font-weight:850}.rchart-share{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:15px;fill:#17243C;font-weight:850}.rchart-line-a{stroke:#2454C7;stroke-width:3.2;fill:none;stroke-linecap:round;stroke-linejoin:round}.rchart-line-b{stroke:#6D8DDF;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:7 5}.rchart-dot-a{fill:#2454C7;stroke:#fff;stroke-width:2.5}.rchart-dot-b{fill:#6D8DDF;stroke:#fff;stroke-width:2.5}.rchart-point-value{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:13px;fill:#17243C;font-weight:900}.rchart-legend{font-family:"Noto Sans Thai",Arial,sans-serif;font-size:13px;fill:#30415D;font-weight:750}.rchart-bar{fill:#2454C7}.rchart-bar-track{fill:#E8EEF9}';return svg.replace(/(<svg\b[^>]*>)/,'$1<style>'+css+'</style>')}
function pdfDonutSvg(parts){const valid=(parts||[]).filter(x=>Number(x.value)>0),total=valid.reduce((a,x)=>a+Number(x.value),0);if(!total)return '';const colors=['#2454C7','#4B73D5','#6D8DDF','#91A9E9','#B4C4F2','#D7E0FA'];const cx=190,cy=150,r=88,inner=57;let angle=-Math.PI/2,paths='';valid.forEach((x,i)=>{const a0=angle,a1=angle+(Number(x.value)/total)*Math.PI*2;const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),ix1=cx+inner*Math.cos(a1),iy1=cy+inner*Math.sin(a1),ix0=cx+inner*Math.cos(a0),iy0=cy+inner*Math.sin(a0),large=a1-a0>Math.PI?1:0;paths+='<path d="M '+x0+' '+y0+' A '+r+' '+r+' 0 '+large+' 1 '+x1+' '+y1+' L '+ix1+' '+iy1+' A '+inner+' '+inner+' 0 '+large+' 0 '+ix0+' '+iy0+' Z" fill="'+colors[i%colors.length]+'"/>';angle=a1});const legend=valid.map((x,i)=>{const y=70+i*34;return '<circle cx="330" cy="'+y+'" r="5" fill="'+colors[i%colors.length]+'"/><text x="344" y="'+(y+4)+'" font-family="Noto Sans Thai, Arial" font-size="13" fill="#52647F" font-weight="700">'+esc(x.label)+'</text><text x="500" y="'+(y+4)+'" text-anchor="end" font-family="Noto Sans Thai, Arial" font-size="13" fill="#2454C7" font-weight="900">'+Number(x.value).toLocaleString()+'</text>'}).join('');return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300" width="1040" height="600"><rect width="520" height="300" fill="#FFFFFF"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r+1)+'" fill="none" stroke="#D5E0F4"/><g>'+paths+'</g><circle cx="'+cx+'" cy="'+cy+'" r="'+inner+'" fill="#FFFFFF"/><text x="'+cx+'" y="'+(cy-2)+'" text-anchor="middle" font-family="Noto Sans Thai, Arial" font-size="30" fill="#17243C" font-weight="900">'+total.toLocaleString()+'</text><text x="'+cx+'" y="'+(cy+17)+'" text-anchor="middle" font-family="Noto Sans Thai, Arial" font-size="10" fill="#71819A" font-weight="800" letter-spacing="2">RECORDS</text>'+legend+'</svg>'}
function pdfChartTitle(doc,ctx,title,note){pdfPageBreak(doc,ctx,30);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.setTextColor(23,36,60);doc.text(pdfSafeText(title),14,ctx.y);ctx.y+=5;doc.setFont('helvetica','normal');doc.setFontSize(7.3);doc.setTextColor(91,109,137);doc.text(pdfSafeText(note),14,ctx.y);ctx.y+=5;}
function pdfAddSvgImage(doc,svg,x,y,w,h){return new Promise(resolve=>{if(!svg||!svg.startsWith('<svg')){resolve(false);return}const img=new Image();img.onload=()=>{try{const scale=2,canvas=document.createElement('canvas');canvas.width=Math.round(w*3.78*scale);canvas.height=Math.round(h*3.78*scale);const c=canvas.getContext('2d');c.fillStyle='#FFFFFF';c.fillRect(0,0,canvas.width,canvas.height);c.drawImage(img,0,0,canvas.width,canvas.height);doc.addImage(canvas.toDataURL('image/png',1),'PNG',x,y,w,h,undefined,'FAST');resolve(true)}catch(e){resolve(false)}};img.onerror=()=>resolve(false);img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(pdfChartSvgStyled(svg))})}
function pdfObservationRows(snap){return (snap.perf||[]).map(x=>{const m=x.metadata||{},t=String(m.channelType||'PERFORMANCE').toUpperCase(),sp=num(x.spend_thb),rev=m.netSales!=null?num(m.netSales):num(x.revenue_thb),roas=sp>0&&rev!=null?rev/sp:null,roi=sp>0&&rev!=null?(rev-sp)/sp*100:null;return [S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',t,x.observed_at||'—',m.platform||'—',m.evidenceConfidence||x.source||'—',x.actual_score==null?'Pending':`${Math.round(x.actual_score)}/100`,sp==null?'—':pdfFmt(sp,'THB'),rev==null?'—':pdfFmt(rev,'THB'),roas==null?'—':pdfFmt(roas,'x'),roi==null?'—':pdfFmt(roi,'%')]})}
function pdfCreatorDetailRows(snap){return (snap.decisionRows||[]).map(({creator:r,decision:d})=>{const e=d.evidence||{};return [r.name,r.payload?.channel||'—',r.payload?.followers==null?'—':Number(r.payload.followers).toLocaleString(),r.payload?.engagementRate==null?'—':`${Number(r.payload.engagementRate).toFixed(2)}%`,d.decision||'—',d.score==null?'—':Math.round(d.score),Math.round(e.confidence??0),Math.round(e.audienceFit??50),Math.round(e.contentFit??50),Math.round(e.brandFit??50),Math.round(e.performance??0),Math.round(e.commercial??50),Math.round(e.risk??50)]})}

async function buildPremiumFullPDF(){
 if(!window.jspdf?.jsPDF){window.print();return}
 const snap=reportLiveSnapshot(),{p,perf,digital,ecommerce,offline,decisionRows,impact,learning}=snap;const visuals=buildReportVisuals(snap);const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});const ctx=pdfBlueHeader(doc,'KOL IDS™ Campaign Intelligence Report','Premium decision pack · observed evidence · creator intelligence · performance · business impact');ctx.y=40;
 pdfBlueMetrics(doc,ctx,[{label:'Creators approved',value:decisionRows.length},{label:'Evidence records',value:perf.length},{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')}]);
 pdfBlueSection(doc,ctx,'Executive decision summary','01 · executive view');pdfNarrative(doc,ctx,'Decision posture',reportDecisionSignal(snap).action||'Review the linked evidence before changing investment allocation.');pdfNarrative(doc,ctx,'Campaign objective',(p.objectives||[]).join(' · ')||p.objective||p.goal||'Not recorded');pdfNarrative(doc,ctx,'Evidence posture',`${perf.length} observed performance record(s), ${decisionRows.length} creator decision record(s), ${digital.length} digital, ${ecommerce.length} e-commerce and ${offline.length} offline/event record(s).`);
 pdfBlueSection(doc,ctx,'Campaign & audience intelligence','02 · strategic context');pdfRows(doc,ctx,['Field','Observed value'],[['Campaign',S.selectedCampaign?.name||'—'],['Status',S.selectedCampaign?.status||'—'],['Objective',(p.objectives||[]).join(' · ')||p.objective||p.goal||'—'],['Performance model',p.performanceType||'—'],['Budget',pdfFmt(p.budget,'THB')],['Market',p.market||'—'],['Start date',p.startDate||'—'],['End date',p.endDate||'—'],['Brand personality',(p.brandPersonalities||[]).join(' · ')||'—'],['Audience type',S.selectedAudience?.payload?.audienceType||'—'],['Audience persona',S.selectedAudience?.payload?.audiencePersona||'—'],['Audience notes',S.selectedAudience?.payload?.notes||'—']],[55,125]);
 pdfBlueSection(doc,ctx,'Creator decision register','03 · creator intelligence');if(decisionRows.length)pdfRows(doc,ctx,['Creator','Channel','Followers','ER','Decision','Fit','Conf.','Audience','Content','Brand','Perf.','Commercial','Risk'],pdfCreatorDetailRows(snap),[27,17,18,14,20,12,12,13,13,13,13,14,11]);else pdfNarrative(doc,ctx,'Status','No creator decision records are linked to this campaign.');
 decisionRows.slice(0,20).forEach(({creator:r,decision:d})=>{const e=d.evidence||{};pdfNarrative(doc,ctx,r.name,`${d.decision||'—'} · Fit ${d.score==null?'—':Math.round(d.score)}/100 · Confidence ${Math.round(e.confidence??0)}/100 · ${e.reason||e.method||creatorAdaptation(e)||'No rationale recorded.'}`)});
 pdfBlueSection(doc,ctx,'Performance evidence register','04 · observed records');if(perf.length)pdfRows(doc,ctx,['Creator','Type','Observed','Platform','Confidence','Outcome','Spend','Revenue','ROAS','ROI'],pdfObservationRows(snap),[27,17,18,18,19,17,20,22,16,16]);else pdfNarrative(doc,ctx,'Status','No performance evidence was recorded.');
 pdfBlueSection(doc,ctx,'Digital performance detail','04A · multi-platform evidence');if(digital.length)pdfRows(doc,ctx,['Creator','Platform','Observed','Reach','Impressions','Views','Likes','Comments','Shares','Clicks','Conversions','Engagement'],digital.map(x=>[S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',x.metadata?.platform||'—',x.observed_at||'—',x.reach==null?'—':Number(x.reach).toLocaleString(),x.impressions==null?'—':Number(x.impressions).toLocaleString(),x.views==null?'—':Number(x.views).toLocaleString(),x.likes==null?'—':Number(x.likes).toLocaleString(),x.comments==null?'—':Number(x.comments).toLocaleString(),x.shares==null?'—':Number(x.shares).toLocaleString(),x.clicks==null?'—':Number(x.clicks).toLocaleString(),x.conversions==null?'—':Number(x.conversions).toLocaleString(),x.engagement==null?'—':Number(x.engagement).toLocaleString()]),[25,17,18,18,20,18,18,18,18,18,18,20]);else pdfNarrative(doc,ctx,'Status','No digital records.');
 pdfBlueSection(doc,ctx,'E-commerce performance detail','04B · commerce evidence');if(ecommerce.length)pdfRows(doc,ctx,['Creator','Platform','Observed','GMV','Net sales','Orders','Paid orders','Discounts','Refunds','AOV','Commission','New customers'],ecommerce.map(x=>{const m=x.metadata||{};return [S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',m.platform||'—',x.observed_at||'—',m.gmv==null?'—':pdfFmt(m.gmv,'THB'),m.netSales==null?'—':pdfFmt(m.netSales,'THB'),m.orders==null?'—':Number(m.orders).toLocaleString(),m.paidOrders==null?'—':Number(m.paidOrders).toLocaleString(),m.discounts==null?'—':pdfFmt(m.discounts,'THB'),m.refunds==null?'—':pdfFmt(m.refunds,'THB'),m.aov==null?'—':pdfFmt(m.aov,'THB'),m.commissionAmount==null?'—':pdfFmt(m.commissionAmount,'THB'),m.newCustomers==null?'—':Number(m.newCustomers).toLocaleString()]}),[25,17,18,22,22,17,19,22,22,20,24,22]);else pdfNarrative(doc,ctx,'Status','No e-commerce records.');
 pdfBlueSection(doc,ctx,'Offline / event performance detail','04C · physical evidence');if(offline.length)pdfRows(doc,ctx,['Creator','Event','Observed','Capacity','Attendance','Leads','QR scans','Demos','Samples','Conversions','Engagement','Revenue'],offline.map(x=>{const m=x.metadata||{};return [S.creators.find(c=>String(c.id)===String(x.creator_id))?.name||'Creator',m.eventType||'—',x.observed_at||'—',m.capacity==null?'—':Number(m.capacity).toLocaleString(),m.attendance==null?'—':Number(m.attendance).toLocaleString(),m.qualifiedLeads==null?'—':Number(m.qualifiedLeads).toLocaleString(),m.qrScans==null?'—':Number(m.qrScans).toLocaleString(),m.demos==null?'—':Number(m.demos).toLocaleString(),m.samples==null?'—':Number(m.samples).toLocaleString(),x.conversions==null?'—':Number(x.conversions).toLocaleString(),m.engagement==null?'—':Number(m.engagement).toLocaleString(),x.revenue_thb==null?'—':pdfFmt(x.revenue_thb,'THB')]}),[25,20,18,19,20,19,18,18,18,19,20,22]);else pdfNarrative(doc,ctx,'Status','No offline/event records.');

 const charts=[['Outcome trend','Revenue vs Spend across observed dates',reportSvgLineChart(visuals.trend,{title:'Observed financial movement',aria:'Revenue and spend over observed dates',width:760,height:390}),760,390],['Creator performance','Observed outcome score by creator',reportSvgBarChart(visuals.bars,{title:'Completed outcome score',aria:'Creator observed outcome scores',width:760,height:390}),760,390],['Revenue contribution','Observed revenue contribution by creator',reportSvgRevenueContribution(visuals.revBars,{title:'Revenue share by creator',aria:'Revenue contribution share by creator',width:760,height:390}),760,390],['Evidence mix','Observed records by evidence type',pdfDonutSvg(visuals.mix),520,300]];
 for(let i=0;i<charts.length;i++){const [title,note,svg,sw,sh]=charts[i];doc.addPage();ctx.header();ctx.footer();ctx.y=24;pdfChartTitle(doc,ctx,title,note);const maxW=ctx.W-28,ratio=sw/sh,w=maxW,h=Math.min(90,maxW/ratio);await pdfAddSvgImage(doc,svg,14,ctx.y,w,h);ctx.y+=h+8;const related=i===0?visuals.trend.map(x=>[x.label,x.a==null?'—':pdfFmt(x.a,'THB'),x.b==null?'—':pdfFmt(x.b,'THB')]):i===1?visuals.bars.map(x=>[x.label,Math.round(x.value)]):i===2?visuals.revBars.map(x=>[x.label,pdfFmt(x.value,'THB')]):visuals.mix.map(x=>[x.label,Number(x.value)]);pdfRows(doc,ctx,i===0?['Observed date','Revenue','Spend']:i===1?['Creator','Observed score']:i===2?['Creator','Revenue']:['Evidence type','Records'],related,i===0?[55,63,64]:[115,67]);}

 pdfBlueSection(doc,ctx,'Business impact & unit economics','06 · observed commercial effect');pdfBlueMetrics(doc,ctx,[{label:'Impact score',value:impact.score==null?'Not scored':`${Math.round(impact.score)}/100`},{label:'Revenue',value:impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB')},{label:'Spend',value:impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB')},{label:'ROAS',value:impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x')}]);pdfRows(doc,ctx,['Metric','Value','Interpretation'],[['Revenue',impact.revenue==null?'Not recorded':pdfFmt(impact.revenue,'THB'),impact.revenue==null?'Evidence unavailable':'Observed commercial output'],['Spend',impact.spend==null?'Not recorded':pdfFmt(impact.spend,'THB'),impact.spend==null?'Evidence unavailable':'Observed investment base'],['ROAS',impact.roas==null?'Not calculable':pdfFmt(impact.roas,'x'),impact.roas==null?'Requires revenue + spend':'Revenue ÷ spend'],['ROI',impact.roi==null?'Not calculable':pdfFmt(impact.roi,'%'),impact.roi==null?'Requires revenue + spend':'(Revenue − spend) ÷ spend'],['Conversions',impact.conversions==null?'Not recorded':pdfFmt(impact.conversions),'Observed conversion outcome'],['Reach',impact.reach==null?'Not recorded':pdfFmt(impact.reach),'Observed reach'],['Views',impact.views==null?'Not recorded':pdfFmt(impact.views),'Observed views'],['Clicks',impact.clicks==null?'Not recorded':pdfFmt(impact.clicks),'Observed traffic response'],['Engagement',impact.engagement==null?'Not recorded':pdfFmt(impact.engagement),'Observed engagement'],['Event attendance',impact.attendance==null?'Not recorded':pdfFmt(impact.attendance),'Observed attendance'],['Qualified leads',impact.leads==null?'Not recorded':pdfFmt(impact.leads),'Observed qualified leads'],['CTR',impact.ctr==null?'Not calculable':pdfFmt(impact.ctr,'%'),'Clicks ÷ impressions'],['Engagement rate',impact.engagementRate==null?'Not calculable':pdfFmt(impact.engagementRate,'%'),'Engagement ÷ impressions'],['Conversion rate',impact.conversionRate==null?'Not calculable':pdfFmt(impact.conversionRate,'%'),'Conversions ÷ clicks']],[50,55,75]);
 pdfBlueSection(doc,ctx,'Learning & next investment decision','07 · institutional memory');pdfNarrative(doc,ctx,'What worked',learning.worked||'Not recorded yet.');pdfNarrative(doc,ctx,'Friction / what did not work',learning.friction||'Not recorded yet.');pdfNarrative(doc,ctx,'Next hypothesis',learning.hypothesis||'Not recorded yet.');const nid=learning.nextInvestmentDecision||{};if(nid.recommendation)pdfNarrative(doc,ctx,'Next investment decision',`${nid.recommendation} · Confidence ${nid.confidence||'—'} · ${nid.reason||''}`);if(nid.threshold)pdfNarrative(doc,ctx,'Success threshold',nid.threshold);if(nid.historicalBenchmark)pdfNarrative(doc,ctx,'Historical benchmark',`ROAS ${nid.historicalBenchmark} · ${nid.historyCount||0} historical campaign(s)`);(learning.nextActions||[]).forEach((x,n)=>pdfNarrative(doc,ctx,`Next action ${n+1}`,x));
 pdfBlueSection(doc,ctx,'Evidence coverage & governance','08 · data quality');pdfRows(doc,ctx,['Evidence class','Status / count'],[['Digital records',digital.length],['E-commerce records',ecommerce.length],['Offline / event records',offline.length],['Decision records',decisionRows.length],['Revenue evidence',impact.revenue==null?'MISSING':'AVAILABLE'],['Spend evidence',impact.spend==null?'MISSING':'AVAILABLE'],['Conversion evidence',impact.conversions==null?'MISSING':'AVAILABLE'],['Impression evidence',impact.hasImpressionEvidence?'AVAILABLE':'MISSING'],['Click evidence',impact.hasClickEvidence?'AVAILABLE':'MISSING'],['Generated at',new Date().toLocaleString('en-GB',{timeZone:'Asia/Bangkok'})]],[85,95]);pdfNarrative(doc,ctx,'Governance note','Use this report to approve, hold, reallocate or test investment based on observed evidence. KOL IDS does not convert missing evidence into invented values. Forecast-like language should be treated as a hypothesis until supported by observed campaign data.');
 doc.save(pdfSaveName('KOL-IDS_Premium-Campaign-Intelligence',S.selectedCampaign?.name));toast('Premium detailed PDF saved','good');
}
function downloadFullPDF(){if(reportExportIsTrial()){showPaidExportGate();return}buildPremiumFullPDF().catch(err=>{console.error(err);toast('Could not generate the detailed PDF. Please try again.','error')})}
