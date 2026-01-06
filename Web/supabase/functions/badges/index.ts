import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Types
interface Badge {
  badgeId: string;
  awardedAt: string;
}

interface HistoryItem {
  id: string;
  question: string;
  attempt: string;
  evaluation: {
    effort_score: number;
    understanding_score: number;
    unlock: boolean;
    masteryAchieved?: boolean;
  };
  timestamp: string;
}

interface StreakData {
  count: number;
  lastDate: string | null;
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
  const userId = pathParts[0];
  const action = pathParts[1]; // 'award' or 'check'

  if (!userId) {
    return jsonResponse({ error: 'User ID is required' }, 400);
  }

  try {
    // GET /badges/{userId} - Get user badges
    if (req.method === 'GET' && !action) {
      const badges = await kvGet(`badges:${userId}`) || [];
      return jsonResponse(badges);
    }

    // POST /badges/{userId}/award - Award a badge
    if (req.method === 'POST' && action === 'award') {
      const { badgeId } = await req.json();
      
      if (!badgeId) {
        return jsonResponse({ error: 'Badge ID is required' }, 400);
      }

      const badgesKey = `badges:${userId}`;
      const badges: Badge[] = await kvGet(badgesKey) || [];
      
      const existing = badges.find(b => b.badgeId === badgeId);
      if (existing) {
        return jsonResponse({ message: 'Badge already awarded', badge: existing });
      }

      const newBadge: Badge = {
        badgeId,
        awardedAt: new Date().toISOString(),
      };
      
      badges.push(newBadge);
      await kvSet(badgesKey, badges);

      return jsonResponse({ message: 'Badge awarded successfully', badge: newBadge });
    }

    // POST /badges/{userId}/check - Check and auto-award badges
    if (req.method === 'POST' && action === 'check') {
      const history: HistoryItem[] = await kvGet(`history:${userId}`) || [];
      const streakData: StreakData = await kvGet(`streak:${userId}`) || { count: 0, lastDate: null };
      const badges: Badge[] = await kvGet(`badges:${userId}`) || [];
      
      const newBadges: Badge[] = [];
      const totalUnlocks = history.filter(item => item.evaluation?.unlock).length;
      const masteryUnlocks = history.filter(item => 
        item.evaluation?.unlock && item.evaluation?.masteryAchieved
      ).length;
      
      const avgEffortScore = history.length > 0
        ? history.reduce((sum, item) => sum + (item.evaluation?.effort_score || 0), 0) / history.length
        : 0;

      // Badge criteria checks
      const badgeChecks = [
        { id: 'ignition', criteria: { type: 'streak', value: 3 } },
        { id: 'the_furnace', criteria: { type: 'streak', value: 7 } },
        { id: 'momentum', criteria: { type: 'streak', value: 14 } },
        { id: 'blue_giant', criteria: { type: 'streak', value: 30 } },
        { id: 'the_century', criteria: { type: 'streak', value: 100 } },
        { id: 'the_initiate', criteria: { type: 'total_unlocks', value: 1 } },
        { id: 'the_apprentice', criteria: { type: 'total_unlocks', value: 10 } },
        { id: 'the_operator', criteria: { type: 'total_unlocks', value: 50 } },
        { id: 'the_veteran', criteria: { type: 'total_unlocks', value: 100 } },
        { id: 'the_apex', criteria: { type: 'total_unlocks', value: 500 } },
        { id: 'synapse', criteria: { type: 'effort_score_avg', value: 2.5 } },
        { id: 'vanguard', criteria: { type: 'mastery_unlocks', value: 1 } },
      ];

      for (const badge of badgeChecks) {
        if (!badges.some(b => b.badgeId === badge.id)) {
          let shouldAward = false;
          
          switch (badge.criteria.type) {
            case 'streak':
              shouldAward = streakData.count >= badge.criteria.value;
              break;
            case 'total_unlocks':
              shouldAward = totalUnlocks >= badge.criteria.value;
              break;
            case 'mastery_unlocks':
              shouldAward = masteryUnlocks >= badge.criteria.value;
              break;
            case 'effort_score_avg':
              shouldAward = avgEffortScore >= badge.criteria.value;
              break;
          }

          if (shouldAward) {
            const newBadge: Badge = {
              badgeId: badge.id,
              awardedAt: new Date().toISOString(),
            };
            badges.push(newBadge);
            newBadges.push(newBadge);
          }
        }
      }

      if (newBadges.length > 0) {
        await kvSet(`badges:${userId}`, badges);
      }

      return jsonResponse({ 
        newBadges,
        totalBadges: badges.length,
        stats: { totalUnlocks, masteryUnlocks, avgEffortScore, currentStreak: streakData.count }
      });
    }

    return jsonResponse({ error: 'Invalid request' }, 400);
  } catch (error) {
    console.error('Error in badges function:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});

console.log("Badges function started");