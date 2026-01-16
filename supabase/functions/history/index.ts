import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// Helper function to handle CORS
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

// Helper function to create JSON response with CORS
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper function to get from KV store
async function kvGet(key: string): Promise<any> {
  try {
    const { data } = await supabase
      .from('kv_store')
      .select('value')
      .eq('key', key)
      .single();
    
    return data?.value ? JSON.parse(data.value) : null;
  } catch {
    return null;
  }
}

// Main handler
serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop();

    if (!userId) {
      return jsonResponse({ error: 'User ID is required' }, 400);
    }

    const history = await kvGet(`history:${userId}`) || [];
    return jsonResponse(history);
  } catch (error) {
    console.error('Error getting history:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});

console.log("History function started");