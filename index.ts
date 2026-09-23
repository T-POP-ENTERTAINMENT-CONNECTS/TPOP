import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } });
const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function json(status:number, body:unknown){ return new Response(JSON.stringify(body), { status, headers: cors }); }
function clean(v:unknown){ return String(v ?? '').trim(); }
function syntheticEmail(){ return `c_${crypto.randomUUID().replaceAll('-','')}@auth.kolids.internal`; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { success:false, message:'Method not allowed.' });
  try {
    const body = await req.json();
    const clientId = clean(body.clientId).toUpperCase();
    const accessKey = clean(body.accessKey).toUpperCase();
    if (!/^CL-[A-Z0-9]{10}$/.test(clientId)) return json(400,{success:false,message:'Invalid Client ID format.'});
    if (!/^[A-Z0-9]{9}$/.test(accessKey)) return json(400,{success:false,message:'Access Key must be exactly 9 characters.'});

    const { data: result, error: rpcError } = await admin.rpc('client_verify_access', { p_client_id: clientId, p_access_key: accessKey });
    if (rpcError) throw rpcError;
    if (!result?.authenticated) return json(401,{success:false,message:'Invalid Client ID or Access Key.'});

    const email = String(result.auth_login_id || syntheticEmail()).trim().toLowerCase();
    let userId = String(result.user_id || '');
    if (!userId) {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password: accessKey,
        email_confirm: true,
        user_metadata: { client_id: clientId }
      });
      if (createError && !/already registered|already exists/i.test(createError.message)) throw createError;
      userId = String(created?.user?.id || '');
      if (!userId) {
        const { data: found, error: findError } = await admin.auth.admin.getUserByEmail(email);
        if (findError) throw findError;
        userId = String(found?.user?.id || '');
      }
      if (!userId) throw new Error('Unable to provision the secure customer identity.');
      const { error: bindError } = await admin.rpc('client_bind_auth_user', { p_client_id: clientId, p_user_id: userId, p_auth_login_id: email });
      if (bindError) throw bindError;
    }

    // Keep the hidden Supabase credential equal to the 9-character Access Key.
    // Customers never see or enter the synthetic email.
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, { password: accessKey, email_confirm: true });
    if (updateError) throw updateError;

    const { data: signed, error: signError } = await anon.auth.signInWithPassword({ email, password: accessKey });
    if (signError || !signed.session) throw signError || new Error('Secure session could not be created.');

    return json(200, {
      success:true,
      authenticated:true,
      clientId,
      clientName:result.client_name,
      plan:result.plan_code,
      status:result.status,
      expiresAt:result.expires_at,
      organizationId:result.organization_id,
      accessType:result.access_type,
      session:signed.session
    });
  } catch (e) {
    return json(500,{success:false,message:e instanceof Error ? e.message : 'Customer authentication failed.'});
  }
});
