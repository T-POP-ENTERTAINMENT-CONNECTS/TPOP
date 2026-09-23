/**
 * KOL IDS™ — KOL DATA CONTRACT QA
 * V22
 *
 * Purpose: verify that the active KOL workflow uses one canonical contract:
 * UI payload -> 04_KOL_DATABASE -> Decision Engine -> 05/06/07 -> 14_CREATOR_REPORT.
 */
function KOL_IDS_QA_validateKOLDataContract(){
  var ss=KOL_IDS_SYSTEM_getSpreadsheet_();
  var expected={
    '04_KOL_DATABASE':['KOL ID','KOL Name','Platform','Platform URL','Category','Followers','Engagement Rate','Audience Age','Audience Gender','Audience Location','Audience Interest','Content Style','Rate','Currency','Previous Brand Work','Previous Campaign Result','Audience Evidence','Engagement Evidence','Content Evidence','Performance Evidence','Reputation Evidence','Risk Level','Risk Score','Audience Fit Input','Brand Image Fit Input','Content Fit Input','Category Fit Input','Value Fit Input','Performance Evidence Input','Awareness Potential','Credibility Potential','Brand Relevance Potential','Perception Potential','Purchase Influence Potential','Community Potential','KOL Status','Last Updated'],
    '05_BRAND_FIT':['Campaign ID','KOL ID','KOL Name','Audience Fit','Brand Image Fit','Content Fit','Category Fit','Value Fit','Performance Evidence','Risk Adjustment','Brand Fit Score','Brand Fit Status','Strength 1','Strength 2','Fit Gap 1','Fit Gap 2','Evidence Quality','Confidence Score','Confidence Level','Calculated At'],
    '06_BRAND_IMPACT':['Campaign ID','KOL ID','KOL Name','Awareness','Credibility','Brand Relevance','Perception','Purchase Influence','Community','Overall Impact Score','Primary Impact','Secondary Impact','Impact Evidence','Confidence Score','Confidence Level','Calculated At'],
    '07_KOL_DECISION':['Campaign ID','KOL ID','KOL Name','Brand Fit Score','Brand Impact Score','Confidence Score','Risk Level','Decision','Recommended Role','Primary Impact','Secondary Impact','Best Used For','Not Ideal For','Decision Reason','Evidence Summary','Decision Owner','Decision Date'],
    '14_CREATOR_REPORT':['Analysis ID','Campaign ID','Brand ID','KOL ID','KOL Name','Platform','Platform URL','Category','Followers','Engagement Rate','Audience Fit','Brand Image Fit','Content Fit','Category Fit','Value Fit','Performance Evidence','Brand Fit Score','Brand Impact Score','Confidence Score','Risk Level','Decision','Recommended Role','Primary Impact','Secondary Impact','Best Used For','Not Ideal For','Decision Reason','Evidence Summary','Persona Fit','Persona Name','Creator Intelligence Fit','Creator Intelligence Coverage','Creator Intelligence Summary','Generated At']
  };
  var out={success:true,checks:[],errors:[]};
  Object.keys(expected).forEach(function(name){
    var sh=ss.getSheetByName(name);
    if(!sh){out.success=false;out.errors.push(name+': sheet missing');return;}
    var actual=sh.getRange(1,1,1,Math.max(sh.getLastColumn(),expected[name].length)).getValues()[0].slice(0,expected[name].length).map(String);
    var same=JSON.stringify(actual)===JSON.stringify(expected[name]);
    out.checks.push({sheet:name,headersMatch:same});
    if(!same)out.errors.push(name+': header contract mismatch');
  });
  var kol=ss.getSheetByName('04_KOL_DATABASE');
  var allowed=['VERIFIED','SELF_REPORTED','ESTIMATED','MISSING'];
  var rawCount=0;
  if(kol&&kol.getLastRow()>1){
    var rows=kol.getRange(2,1,kol.getLastRow()-1,37).getValues();
    rows.forEach(function(r,i){
      if(!String(r[0]||'').trim())return;
      rawCount++;
      if(!String(r[1]||'').trim())out.errors.push('04_KOL_DATABASE row '+(i+2)+': KOL Name missing');
      if(r[5]!=='' && r[5]!==null && r[5]!==undefined && (!(Number(String(r[5]).replace(/,/g,''))>=0)))out.errors.push('04_KOL_DATABASE row '+(i+2)+': Followers invalid');
      if(r[6]!=='' && r[6]!==null && r[6]!==undefined && (!isFinite(Number(r[6]))||Number(r[6])<0||Number(r[6])>100))out.errors.push('04_KOL_DATABASE row '+(i+2)+': Engagement Rate invalid');
      if(r[12]!=='' && r[12]!==null && r[12]!==undefined && (!(Number(String(r[12]).replace(/,/g,''))>=0)))out.errors.push('04_KOL_DATABASE row '+(i+2)+': Rate invalid');
      var risk=String(r[21]||'').trim().toUpperCase();
      if(risk!==''&&['LOW','MEDIUM','HIGH','UNKNOWN'].indexOf(risk)<0)out.errors.push('04_KOL_DATABASE row '+(i+2)+': invalid Risk Level');
      [16,17,18,19,20].forEach(function(c){var v=String(r[c]||'').trim().toUpperCase();if(v!==''&&allowed.indexOf(v)<0)out.errors.push('04_KOL_DATABASE row '+(i+2)+': invalid evidence status in column '+(c+1));});
    });
  }
  out.kolCount=rawCount;
  out.success=out.errors.length===0;
  return out;
}
