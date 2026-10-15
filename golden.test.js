/* KOL IDS golden test: the 12 sample records of the GlowLab pilot.
   Run:  node tests/golden.test.js   (from the folder that contains this "tests" dir and the project folder) */
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const proj=fs.readdirSync(root).map(d=>path.join(root,d,'app.js')).find(p=>fs.existsSync(p));
assert(proj,'app.js not found next to tests/');
const src=fs.readFileSync(proj,'utf8');
const cut=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i);assert(i>=0&&j>i,'marker missing: '+a);return src.slice(i,j)};
const line=n=>{const m=src.match(new RegExp('^const '+n+'=.*$','m'));assert(m,'helper missing: '+n);return m[0]};
const S={creators:[{id:1,name:'Tee Chanon'},{id:2,name:'Nicha P.'},{id:3,name:'Fah Suthida'},{id:4,name:'Mali Wattanakul'}],selectedCampaign:{payload:{genCodes:{codes:[]}}}};
function campaignGenCodeForCreator(id){return {commissionRate:{1:10,2:8,3:10,4:8}[id]}}
const code=['esc','num','money','sumKnown','sumMetaKnown'].map(line).join('\n')+'\n'+
 cut('/* ===== Central money logic','// Canonical campaign aggregation:')+
 cut('const aggregateCampaignMetrics=','\nfunction ')+'\n'+
 cut('function buildImpactTransparency(rows){','function reportDecisionQuality(snap){')+
 '\nreturn {aggregateCampaignMetrics,buildReportVisuals,impactTransparencyModel,impactTransparencyRows,impactTransparencyHtml};';
const api=new Function('S','campaignGenCodeForCreator',code)(S,campaignGenCodeForCreator);

// [creatorId, spend, digitalRev, ecomNet, offlineRev, paidOrders, orders, gmv, commissionRate]
const D=[[1,12000,51920,51921,14750,92,92,59000],[2,15000,41300,41300,10620,75,75,47200],[3,10000,61950,61950,18880,110,110,70800],[4,13000,31270,31270,8850,56,56,35400]];
const rows=[];D.forEach(([id,sp,dg,ec,of,pc,ord,gmv])=>{const o='2026-10-15T00:00:00+00:00';
 rows.push({creator_id:id,spend_thb:sp,revenue_thb:dg,observed_at:o,conversions:pc,reach:1,metadata:{channelType:'DIGITAL'}});
 rows.push({creator_id:id,spend_thb:sp,revenue_thb:ec,observed_at:o,conversions:pc,metadata:{channelType:'ECOMMERCE',netSales:ec,gmv,paidOrders:pc,orders:ord}});
 rows.push({creator_id:id,spend_thb:sp,revenue_thb:of,observed_at:o,conversions:25,metadata:{channelType:'OFFLINE',attendance:100}});});
let n=0;const t=(name,fn)=>{fn();n++;console.log('ok -',name)};
const near=(a,b,e=.005)=>assert(Math.abs(a-b)<=e,`${a} != ${b}`);

t('headline revenue = e-commerce net sales, counted once',()=>{const a=api.aggregateCampaignMetrics(rows);assert.strictEqual(a.revenue,186441);assert.strictEqual(a.spend,50000);assert.strictEqual(a.conversions,333);near(a.revenue/a.spend,3.73,.01)});
t('revenue chart total equals headline (no triple counting)',()=>{const v=api.buildReportVisuals({perf:rows,digital:[1],ecommerce:[1],offline:[1]});assert.strictEqual(v.revBars.reduce((a,b)=>a+b.value,0),186441);assert.deepStrictEqual(v.revBars.map(x=>x.label),['Fah Suthida','Tee Chanon','Nicha P.','Mali Wattanakul'])});
t('trend revenue and spend equal headline',()=>{const v=api.buildReportVisuals({perf:rows,digital:[1],ecommerce:[1],offline:[1]});assert.strictEqual(v.trend.length,1);assert.strictEqual(v.trend[0].a,186441);assert.strictEqual(v.trend[0].b,50000)});
t('transparency: commission / offline / both',()=>{const m=api.impactTransparencyModel(rows);near(m.cur.roas,3.7288);const by=Object.fromEntries(m.items.map(i=>[i.name,i]));
 assert.strictEqual(Math.round(m.t.commission),17193);assert.strictEqual(m.t.offlineExtra,53100);
 near(by['Commission'].inc.roas,2.77,.01);near(by['Offline / event revenue'].inc.roas,4.79,.01);near(by['Both together'].inc.roas,3.56,.01);
 near(by['Commission'].dRoas,-0.95,.01);near(by['Offline / event revenue'].dRoas,1.06,.01)});
t('orders check flags missing / inconsistent orders',()=>{const bad=rows.map(r=>r.metadata.channelType==='ECOMMERCE'&&r.creator_id===3?{...r,metadata:{...r.metadata,orders:null}}:r);const o=api.impactTransparencyModel(bad).orders;assert(o.bad);assert(o.issues.some(x=>x.startsWith('Fah')));
 const worse=rows.map(r=>r.metadata.channelType==='ECOMMERCE'&&r.creator_id===1?{...r,metadata:{...r.metadata,orders:50}}:r);assert(api.impactTransparencyModel(worse).orders.bad);
 assert.strictEqual(api.impactTransparencyModel(rows).orders.bad,false)});
t('recorded commissionAmount wins over rate',()=>{const r2=rows.map(r=>r.metadata.channelType==='ECOMMERCE'?{...r,metadata:{...r.metadata,commissionAmount:1000}}:r);assert.strictEqual(api.impactTransparencyModel(r2).t.commission,4000)});
t('export rows and HTML render',()=>{const r=api.impactTransparencyRows(rows);assert.strictEqual(r.length,4);assert(r.every(x=>x.length===5));const h=api.impactTransparencyHtml(rows);assert(h.includes('Not included vs. if included')&&h.includes('Orders vs Paid orders'))});
t('no spend or no revenue => no card (nothing invented)',()=>{assert.strictEqual(api.impactTransparencyHtml([]),'');assert.strictEqual(api.impactTransparencyRows([{creator_id:1,metadata:{channelType:'DIGITAL'}}]).length,0)});
t('digital-only creator still gets revenue; same sales not doubled',()=>{const only=[{creator_id:1,spend_thb:100,revenue_thb:500,metadata:{channelType:'DIGITAL'}}];assert.strictEqual(api.aggregateCampaignMetrics(only).revenue,500)});
console.log(`\n${n} tests passed`);
