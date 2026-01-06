import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Types
interface Child {
  userId: string;
  name: string;
  connectedAt: string;
}

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// Helper function to set in KV store
async function kvSet(key: string, value: any): Promise<void> {
  await supabase
    .from('kv_store')
    .upsert({ 
      key, 
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    });
}

// Main handler
serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const action = pathParts[0]; // 'generate-invite', 'connect-student', 'children', 'parent', 'members'
  const userId = pathParts[1];

  try {
    // POST /family/generate-invite - Generate family invite code
    if (req.method === 'POST' && action === 'generate-invite') {
      const { parentUserId } = await req.json();
      
      if (!parentUserId) {
        return jsonResponse({ error: 'Parent user ID is required' }, 400);
      }

      const existingCode = await kvGet(`parent_invite:${parentUserId}`);
      
      if (existingCode) {
        return jsonResponse({ inviteCode: existingCode });
      }

      const inviteCode = crypto.randomUUID().slice(0, 8).toUpperCase();
      
      await kvSet(`parent_invite:${parentUserId}`, inviteCode);
      await kvSet(`invite_code:${inviteCode}`, parentUserId);
      
      return jsonResponse({ inviteCode });
    }

    // POST /family/connect-student - Connect student to parent
    if (req.method === 'POST' && action === 'connect-student') {
      const { studentUserId, inviteCode, studentName } = await req.json();
      
      if (!studentUserId || !inviteCode) {
        return jsonResponse({ error: 'Student ID and invite code are required' }, 400);
      }

      const parentUserId = await kvGet(`invite_code:${inviteCode}`);
      
      if (!parentUserId) {
        return jsonResponse({ error: 'Invalid invite code' }, 404);
      }

      const childrenKey = `parent_children:${parentUserId}`;
      const children: Child[] = await kvGet(childrenKey) || [];
      
      const alreadyConnected = children.some(child => child.userId === studentUserId);
      
      if (alreadyConnected) {
        return jsonResponse({ message: 'Already connected to this parent', parentUserId });
      }

      children.push({
        userId: studentUserId,
        name: studentName || 'Student',
        connectedAt: new Date().toISOString(),
      });
      
      await kvSet(childrenKey, children);
      await kvSet(`student_parent:${studentUserId}`, parentUserId);
      
      return jsonResponse({ 
        success: true, 
        parentUserId,
        message: 'Successfully connected to parent account'
      });
    }

    // GET /family/children/{parentUserId} - Get parent's children
    if (req.method === 'GET' && action === 'children' && userId) {
      const children = await kvGet(`parent_children:${userId}`) || [];
      return jsonResponse(children);
    }

    // GET /family/parent/{studentUserId} - Get student's parent
    if (req.method === 'GET' && action === 'parent' && userId) {
      const parentUserId = await kvGet(`student_parent:${userId}`);
      
      if (!parentUserId) {
        return jsonResponse({ connected: false });
      }
      
      return jsonResponse({ connected: true, parentUserId });
    }

    // GET /family/members/{userId} - Get family members for leaderboard
    if (req.method === 'GET' && action === 'members' && userId) {
      const children = await kvGet(`parent_children:${userId}`);
      
      if (children && children.length > 0) {
        const members = [
          { userId, name: 'You', isParent: true },
          ...children
        ];
        return jsonResponse(members);
      }
      
      const parentUserId = await kvGet(`student_parent:${userId}`);
      
      if (parentUserId) {
        const siblings = await kvGet(`parent_children:${parentUserId}`) || [];
        const members = siblings.map((child: any) => ({
          ...child,
          isYou: child.userId === userId
        }));
        return jsonResponse(members);
      }
      
      return jsonResponse([{ userId, name: 'You' }]);
    }

    return jsonResponse({ error: 'Invalid request' }, 400);
  } catch (error) {
    console.error('Error in family function:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});

console.log("Family function started");