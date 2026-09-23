/**
 * KOL IDS™ — Performance Authority Release QA
 * Read-only checks plus optional legacy migration entrypoint.
 */
function KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA(){
  var checks=[];
  try {
    var h=KOL_IDS_PERFORMANCE_AUTHORITY_HEALTH();
    checks.push({name:'Canonical authority exists',pass:h.canonicalSheet==='09_PERFORMANCE'});
    checks.push({name:'Legacy is input-only',pass:h.legacyIsInputOnly===true});
    checks.push({name:'Bounded read',pass:h.boundedReadMax<=1000});
    checks.push({name:'Index present',pass:h.indexRows>=0});
    var q=KOL_IDS_PERFORMANCE_AUTHORITY_QA();
    (q.tests||[]).forEach(function(t){checks.push(t);});
    return {success:checks.every(function(x){return x.pass===true;}),version:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,checks:checks,checkedAt:new Date().toISOString()};
  } catch(e) {
    return {success:false,version:KOL_IDS_PERFORMANCE_AUTHORITY.VERSION,checks:checks,error:String(e&&e.message||e)};
  }
}


function KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA() {
  return KOL_IDS_EXECUTION_LOG_run_('KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA', KOL_IDS_EXEC_ORIGINAL_KOL_IDS_PERFORMANCE_AUTHORITY_RELEASE_QA, this, arguments);
}
