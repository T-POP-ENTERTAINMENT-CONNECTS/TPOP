import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const url=Deno.env.get('SUPABASE_URL')!;
const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default;
if(!secret) throw new Error('Supabase secret key is not configured');
const admin=createClient(url,secret,{auth:{autoRefreshToken:false,persistSession:false}});
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json'};
const json=(s:number,b:unknown)=>new Response(JSON.stringify(b),{status:s,headers});

Deno.serve(async req=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers});
  if(req.method!=='POST') return json(405,{error:'POST required'});
  try{
    const auth=req.headers.get('Authorization')||'';
    const token=auth.replace(/^Bearer\s+/i,'');
    if(!token) return json(401,{error:'Unauthorized'});
    const {data:{user},error:ue}=await admin.auth.getUser(token);
    if(ue||!user) return json(401,{error:'Unauthorized'});

    const {data:isAdmin,error:ae}=await admin.from('platform_admins').select('user_id').eq('user_id',user.id).eq('active',true).maybeSingle();
    if(ae) throw ae;
    if(!isAdmin) return json(403,{error:'Platform admin permission required'});

    const body=await req.json();
    const action=String(body.action||'').trim();

    if(action==='activate_order'){
      const orderId=String(body.order_id||'');
      if(!orderId) return json(400,{error:'order_id required'});
      const {data:order,error:oe}=await admin.from('customer_orders').select('*').eq('id',orderId).single();
      if(oe) throw oe;
      if(['cancelled','failed','expired'].includes(order.status)) return json(409,{error:'Order is not activatable'});
      const {data:plan,error:pe}=await admin.from('plans').select('*').eq('code',order.plan_code).eq('active',true).single();
      if(pe) throw pe;
      await admin.from('subscriptions').update({status:'cancelled',updated_at:new Date().toISOString()}).eq('organization_id',order.organization_id).eq('status','active');
      const starts=new Date();
      const expires=new Date(starts.getTime()+Number(plan.duration_days)*86400000);
      const {data:sub,error:se}=await admin.from('subscriptions').select('*').eq('order_id',order.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
      if(se) throw se;
      let subscriptionId:string;
      if(sub){
        const r=await admin.from('subscriptions').update({status:'active',starts_at:starts.toISOString(),expires_at:expires.toISOString(),approved_at:starts.toISOString(),approved_by:user.id,updated_at:starts.toISOString()}).eq('id',sub.id).select().single();
        if(r.error) throw r.error; subscriptionId=r.data.id;
      }else{
        const r=await admin.from('subscriptions').insert({organization_id:order.organization_id,plan_code:order.plan_code,order_id:order.id,status:'active',starts_at:starts.toISOString(),expires_at:expires.toISOString(),approved_at:starts.toISOString(),approved_by:user.id}).select().single();
        if(r.error) throw r.error; subscriptionId=r.data.id;
      }
      const up=await admin.from('customer_orders').update({status:'approved',payment_status:'paid',paid_at:starts.toISOString(),approved_at:starts.toISOString(),approved_by:user.id,provider:body.provider||null,provider_reference:body.provider_reference||null,updated_at:starts.toISOString()}).eq('id',order.id);
      if(up.error) throw up.error;
      const ev=await admin.from('subscription_events').insert({subscription_id:subscriptionId,organization_id:order.organization_id,order_id:order.id,event_type:'subscription_activated',actor_user_id:user.id,provider:body.provider||null,provider_event_id:body.provider_reference||null,payload:{source:'admin-provision'}});
      if(ev.error) throw ev.error;
      return json(200,{ok:true,order_id:order.id,subscription_id:subscriptionId,plan:plan.code,expires_at:expires.toISOString()});
    }

    if(action==='invite_member'){
      const email=String(body.email||'').trim().toLowerCase();
      const orgId=String(body.organization_id||'');
      if(!email||!orgId) return json(400,{error:'email and organization_id required'});
      const {data:activeSub}=await admin.from('subscriptions').select('plan_code').eq('organization_id',orgId).eq('status','active').order('expires_at',{ascending:false}).limit(1).maybeSingle();
      if(!activeSub) return json(409,{error:'Active subscription required'});
      const {data:p,error:pe}=await admin.from('plans').select('*').eq('code',activeSub.plan_code).single();
      if(pe) throw pe;
      const {data:members,error:me}=await admin.from('organization_memberships').select('*').eq('organization_id',orgId).in('status',['active','invited']);
      if(me) throw me;
      if((members||[]).length>=Number(p.seats)) return json(409,{error:'Seat limit reached'});
      const {data:list,error:le}=await admin.auth.admin.listUsers({page:1,perPage:1000});
      if(le) throw le;
      let target=list.users.find((u:any)=>String(u.email||'').toLowerCase()===email);
      if(!target){
        const r=await admin.auth.admin.createUser({email,email_confirm:true});
        if(r.error) throw r.error;
        target=r.data.user;
      }
      const {error:ins}=await admin.from('organization_memberships').upsert({organization_id:orgId,user_id:target.id,role:'member',status:'active'},{onConflict:'organization_id,user_id'});
      if(ins) throw ins;
      return json(200,{ok:true,user_id:target.id,email,organization_id:orgId,seats:p.seats});
    }

    return json(400,{error:'Unknown admin action'});
  }catch(e){return json(500,{error:e instanceof Error?e.message:'Admin operation failed'});}
});
