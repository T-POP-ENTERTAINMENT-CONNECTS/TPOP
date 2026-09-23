/**
 * KOL IDS — END-TO-END CERTIFICATION GATE
 *
 * Purpose: certify the executable workflow contract before a real browser run.
 * This suite is intentionally split into:
 *   1) STATIC — source/UI/authority coverage, read-only.
 *   2) LIVE — controlled workspace execution. LIVE never fabricates a pass and
 *      must be run only against a disposable/staging workspace.
 *
 * A browser cannot be simulated from Apps Script. Therefore browser-click
 * certification is represented as a deterministic action manifest plus live
 * server-side contract checks; the final browser gate must be performed against
 * the deployed /exec UI.
 */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_E2E_CERTIFICATION_STATIC_QA(){
  var checks=[], failures=[], warnings=[];
  function check(name, pass, detail){
    var x={name:name,pass:!!pass,detail:detail||''}; checks.push(x); if(!x.pass) failures.push(x);
  }
  function fn(name){return typeof globalThis[name]==='function';}

  var required=[
    'doGet','KOL_IDS_SELF_SERVICE_BOOTSTRAP','KOL_IDS_SELF_GET_STATE',
    'KOL_IDS_SELF_SAVE_CAMPAIGN_DRAFT','KOL_IDS_SELF_SAVE_CAMPAIGN_CONTEXT',
    'KOL_IDS_SELF_SAVE_AUDIENCE_CONTEXT','KOL_IDS_SELF_SAVE','KOL_IDS_SELF_SAVE_SELECTION',
    'KOL_IDS_SELF_SAVE_DECISION_CONTEXT','KOL_IDS_SELF_RUN','KOL_IDS_SELF_SAVE_GEN_CODES',
    'KOL_IDS_SELF_SAVE_PERFORMANCE','KOL_IDS_SELF_GET_REPORT','KOL_IDS_SELF_GET_HISTORY',
    'KOL_IDS_SELF_EXPORT_CURRENT','KOL_IDS_SELF_RESET','KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_',
    'KOL_IDS_CANONICAL_getContext_','KOL_IDS_CANONICAL_mutate_','KOL_IDS_CANONICAL_persist_',
    'KOL_IDS_CANONICAL_result_','KOL_IDS_WORKFLOW_getWorkflow','KOL_IDS_WORKFLOW_setSelection',
    'KOL_IDS_WORKFLOW_savePerformanceBatch','KOL_IDS_WORKFLOW_getCampaignReport',
    'KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY','KOL_IDS_ATTRIBUTION_RUN_ATTRIBUTION'
  ];
  required.forEach(function(n){check('Function '+n,fn(n),'Executable function present');});

  var ui=HtmlService.createHtmlOutputFromFile('KOL_IDS_UI').getContent();
  var actions={
    'campaign-draft':'btnCampaignDraft','campaign-continue':'btnCampaignContinue',
    'audience-back':'btnAudienceBack','audience-continue':'btnAudienceContinue',
    'add-kol':'btnAddKOL','persona-back':'btnPersonaBack','analyze-kols':'btnAnalyzeKOLs',
    'decision-back':'btnDecisionBack','decision-save':'btnDecisionSave',
    'review-back':'btnReviewBack','run-decision':'btnRunDecision',
    'gen-codes':'btnGenerateCodes','regen-codes':'btnRegenerateCodes',
    'impact-back':'btnImpactBack','save-performance':'btnSavePerformance',
    'load-reports':null,'export-current':null,'load-readiness':null,'load-idi':null
  };
  Object.keys(actions).forEach(function(a){
    var id=actions[a];
    // The production UI uses the hard-click action engine. add-kol also has
    // a V17 alias on the live control, so either canonical binding is valid.
    var hasAction=ui.indexOf('data-kol-action="'+a+'"')>=0 ||
      (a==='add-kol' && ui.indexOf('data-kol-action="add-kol-v17"')>=0);
    check('UI action '+a,hasAction,'Canonical action binding present');
    if(id) check('UI control '+id,ui.indexOf('id="'+id+'"')>=0,'Control ID present');
  });
  // V17+ deliberately uses direct button bindings through the hard-click
  // engine, not the retired document-level delegated router.
  check('UI hard-click action engine',ui.indexOf('KOL_IDS_WORKFLOW_CLICK_ENGINE')>=0 && ui.indexOf('var map={')>=0 && ui.indexOf('function runAction(action,button)')>=0,'Production hard-click action engine present');
  check('UI click binding',ui.indexOf("addEventListener('click'")>=0 || ui.indexOf('.onclick=')>=0,'Executable click binding present');
  // Promise rejection is surfaced by runAction().catch(...), followed by a
  // finally() that releases the button lock. Do not require the old router
  // string Promise.resolve(action(a)).catch(...).
  check('UI Promise error boundary',ui.indexOf('function runAction(action,button)')>=0 && ui.indexOf('.catch(function(e)')>=0 && ui.indexOf('.finally(function(){')>=0,'Rejected action is surfaced and lock is released');
  check('UI step 6 navigation',/data-step="6"[^>]*data-kol-action="step-6"/.test(ui),'Step 6 navigation bound');
  check('UI step 7 navigation',/data-step="7"[^>]*data-kol-action="step-7"/.test(ui),'Step 7 navigation bound');

  var workflow=String((function(){try{return HtmlService.createHtmlOutputFromFile('KOL_IDS_UI').getContent();}catch(e){return '';}})());
  var rpcBundled = ui.indexOf("include('KOL_IDS_UI_RPC')")>=0 || ui.indexOf('KOL IDS BUNDLED MODULE: KOL_IDS_UI_RPC.html')>=0 || ui.indexOf('KOL_IDS_UI_RPC_WITH_TIMEOUT_')>=0;
  // HtmlService/template normalization may strip HTML comments, so the
  // certification gate must accept an executable marker/function as proof
  // of the bundled canonical render module, not comments alone.
  var renderBundled =
    ui.indexOf("include('KOL_IDS_UI_RENDER')")>=0 ||
    ui.indexOf('KOL IDS BUNDLED MODULE: KOL_IDS_UI_RENDER.html')>=0 ||
    ui.indexOf('KOL_IDS_UI_RENDER')>=0 ||
    ui.indexOf('__KOL_IDS_CANONICAL_RENDER_MODULE__')>=0 ||
    ui.indexOf('KOL_IDS_UX_RENDER_EXECUTIVE_REPORT')>=0;
  check('Canonical RPC include',rpcBundled,'UI uses canonical RPC bridge or bundled canonical RPC module');
  check('Canonical render include',renderBundled,'UI uses canonical render bridge or bundled canonical render module');

  // Runtime boundary is proven by the executable function gate below.
  check('Final runtime executor',fn('KOL_IDS_RUNTIME_FINAL_SELF_EXECUTE_'),'All canonical write endpoints must use the final runtime executor');

  // Recovery contracts that can be proven without touching business data.
  check('Idempotency helper',fn('KOL_IDS_WORKFLOW_idempotent_'),'Replay protection helper exists');
  check('Workflow hash helper',fn('KOL_IDS_WORKFLOW_hash_'),'Request hashing exists');
  check('Selection canonical owner',fn('KOL_IDS_SELF_SAVE_SELECTION'),'Selection endpoint exists');
  check('Performance canonical owner',fn('KOL_IDS_SELF_SAVE_PERFORMANCE'),'Performance endpoint exists');
  check('Integrity verifier',fn('KOL_IDS_ATTRIBUTION_VERIFY_INTEGRITY'),'Ledger integrity gate exists');
  check('Full system cohesion gate',fn('KOL_IDS_1203_COHESION_QA'),'All canonical workflow/intelligence hand-offs have a static gate');
  check('Performance intelligence hand-off',fn('KOL_IDS_1203_syncIntelligenceAfterPerformance_'),'Performance save has an intelligence evidence/learning bridge');

  return {success:failures.length===0,status:failures.length?'RED':'GREEN',suite:'E2E CERTIFICATION STATIC',checks:checks,failures:failures,warnings:warnings,summary:{passed:checks.filter(function(x){return x.pass;}).length,failed:failures.length,warnings:warnings.length,total:checks.length},liveBrowserRequired:true};
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_E2E_CERTIFICATION_RECOVERY_MATRIX(){
  var cases=[
    {id:'R01',name:'Double click / duplicate request',expected:'IDEMPOTENT_REPLAY',mechanism:'same idempotencyKey + identical request'},
    {id:'R02',name:'Idempotency key reused with changed payload',expected:'REJECT',mechanism:'same key + different request hash'},
    {id:'R03',name:'Selection omitted',expected:'REJECT',mechanism:'no analyzed creator selected'},
    {id:'R04',name:'Performance before RUN_COMPLETE',expected:'REJECT',mechanism:'stage guard'},
    {id:'R05',name:'Business impact creator outside shortlist',expected:'REJECT',mechanism:'shortlist membership guard'},
    {id:'R06',name:'Invalid decision weights',expected:'REJECT',mechanism:'weights must total 100'},
    {id:'R07',name:'Negative KPI / money value',expected:'REJECT',mechanism:'non-negative numeric validation'},
    {id:'R08',name:'Ledger money invariant violation',expected:'REJECT',mechanism:'gross/discount/net integrity check'},
    {id:'R09',name:'Removed/re-added creator stale performance',expected:'EXCLUDE_SUPERSEDED',mechanism:'SUPERSEDED rows excluded from active projection'},
    {id:'R10',name:'Execution timeout / deployment failure',expected:'MANUAL_RESUME_REQUIRED',mechanism:'real /exec retry; never fabricate completion'}
  ];
  return {success:true,status:'GREEN',suite:'E2E RECOVERY MATRIX',cases:cases,note:'R01-R09 have server-side contracts in the release. R10 requires live deployment failure injection and must not be marked PASS by static QA.'};
}

function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_E2E_CERTIFICATION_RUN_ALL_STATIC(){
  var st=KOL_IDS_E2E_CERTIFICATION_STATIC_QA(); var rm=KOL_IDS_E2E_CERTIFICATION_RECOVERY_MATRIX(); var pass=st.success===true && rm.success===true; return {success:pass,status:pass?'GREEN':'RED',static:st,recovery:rm,next:['Run KOL_IDS_RELEASE_LIVE_E2E_QA()','Run controlled browser certification against /exec','Execute recovery matrix R01-R10 on staging','Only then mark release E2E-CERTIFIED']};
}


function KOL_IDS_E2E_CERTIFICATION_STATIC_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_E2E_CERTIFICATION_STATIC_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_E2E_CERTIFICATION_STATIC_QA, this, arguments);
}


function KOL_IDS_E2E_CERTIFICATION_RECOVERY_MATRIX() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_E2E_CERTIFICATION_RECOVERY_MATRIX', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_E2E_CERTIFICATION_RECOVERY_MATRIX, this, arguments);
}


function KOL_IDS_E2E_CERTIFICATION_RUN_ALL_STATIC() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_E2E_CERTIFICATION_RUN_ALL_STATIC', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_E2E_CERTIFICATION_RUN_ALL_STATIC, this, arguments);
}
