// Supabase Edge Function: check-badges
// Checks for new badge unlocks based on user activity

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BadgeCheckRequest {
  user_id: string
}

interface Badge {
  id: string
  name: string
  description: string
  category: string
  rarity: string
  icon_name: string
  color: string
  color_end: string
  requirement: string
  criteria: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id }: BadgeCheckRequest = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all badge definitions
    const { data: allBadges, error: badgesError } = await supabase
      .from('badge_definitions')
      .select('*')

    if (badgesError) throw badgesError

    // Get user's already unlocked badges
    const { data: unlockedBadges, error: unlockedError } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', user_id)

    if (unlockedError) throw unlockedError

    const unlockedBadgeIds = new Set(unlockedBadges?.map(b => b.badge_id) || [])

    // Get user stats for badge checking
    const userStats = await getUserStats(supabase, user_id)
    
    // Check each badge for unlock eligibility
    const newlyUnlockedBadges: Badge[] = []

    for (const badge of allBadges || []) {
      // Skip if already unlocked
      if (unlockedBadgeIds.has(badge.id)) continue

      // Check if badge criteria is met
      if (await checkBadgeCriteria(badge, userStats)) {
        // Unlock the badge
        const { error: unlockError } = await supabase
          .from('user_badges')
          .insert({
            user_id,
            badge_id: badge.id
          })

        if (!unlockError) {
          newlyUnlockedBadges.push(badge)
        }
      }
    }

    return new Response(
      JSON.stringify(newlyUnlockedBadges),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in check-badges function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function getUserStats(supabase: any, userId: string) {
  // Get streak data
  const { data: streak } = await supabase
    .from('streaks')
    .select('count')
    .eq('user_id', userId)
    .single()

  // Get total unlocks
  const { data: attempts, count: totalUnlocks } = await supabase
    .from('learning_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('unlock', true)

  // Get mastery mode unlocks
  const { data: masteryAttempts, count: masteryUnlocks } = await supabase
    .from('learning_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('mastery_mode', true)
    .eq('unlock', true)

  // Get perfect scores
  const { data: perfectScores, count: perfectCount } = await supabase
    .from('learning_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('effort_score', 3.0)
    .eq('understanding_score', 3.0)

  // Get recent attempts for time-based badges
  const { data: recentAttempts } = await supabase
    .from('learning_attempts')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  return {
    streakCount: streak?.count || 0,
    totalUnlocks: totalUnlocks || 0,
    masteryUnlocks: masteryUnlocks || 0,
    perfectScores: perfectCount || 0,
    recentAttempts: recentAttempts || [],
  }
}

async function checkBadgeCriteria(badge: Badge, userStats: any): Promise<boolean> {
  if (!badge.criteria) return false

  const criteria = badge.criteria

  switch (criteria.type) {
    case 'streak':
      return userStats.streakCount >= criteria.value

    case 'total_unlocks':
      return userStats.totalUnlocks >= criteria.value

    case 'mastery_unlocks':
      return userStats.masteryUnlocks >= criteria.value

    case 'perfect_score':
      return userStats.perfectScores > 0

    case 'late_night':
      // Check if any recent attempts were after 10 PM
      return userStats.recentAttempts.some((attempt: any) => {
        const hour = new Date(attempt.created_at).getHours()
        return hour >= 22 || hour <= 2
      })

    case 'early_morning':
      // Check if any recent attempts were before 6 AM
      return userStats.recentAttempts.some((attempt: any) => {
        const hour = new Date(attempt.created_at).getHours()
        return hour >= 4 && hour <= 6
      })

    default:
      return false
  }
}