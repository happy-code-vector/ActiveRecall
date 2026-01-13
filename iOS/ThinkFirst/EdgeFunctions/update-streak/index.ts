// Supabase Edge Function: update-streak
// Updates user streak and handles freeze logic

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StreakUpdateRequest {
  user_id: string
}

interface StreakResponse {
  count: number
  last_date: string | null
  freeze_used_today: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id }: StreakUpdateRequest = await req.json()

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

    const today = new Date().toISOString().split('T')[0]
    
    // Get current streak
    let { data: streak, error: streakError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (streakError && streakError.code !== 'PGRST116') {
      throw streakError
    }

    // Create streak record if it doesn't exist
    if (!streak) {
      const { data: newStreak, error: createError } = await supabase
        .from('streaks')
        .insert({
          user_id,
          count: 1,
          last_date: today,
          freeze_used_today: false
        })
        .select()
        .single()

      if (createError) throw createError
      
      return new Response(
        JSON.stringify({
          count: 1,
          last_date: today,
          freeze_used_today: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already updated today
    if (streak.last_date === today) {
      return new Response(
        JSON.stringify({
          count: streak.count,
          last_date: streak.last_date,
          freeze_used_today: streak.freeze_used_today
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate days between last activity and today
    const lastDate = new Date(streak.last_date || today)
    const todayDate = new Date(today)
    const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    let newCount = streak.count
    let freezeUsed = false

    if (daysDiff === 1) {
      // Consecutive day - increment streak
      newCount = streak.count + 1
    } else if (daysDiff > 1) {
      // Gap detected - check for freeze usage
      const canUseFreeze = await checkAndUseFreeze(supabase, user_id, daysDiff)
      
      if (canUseFreeze) {
        // Freeze used - maintain streak
        newCount = streak.count + 1
        freezeUsed = true
      } else {
        // No freeze available - reset streak
        newCount = 1
      }
    }

    // Update streak
    const { data: updatedStreak, error: updateError } = await supabase
      .from('streaks')
      .update({
        count: newCount,
        last_date: today,
        freeze_used_today: freezeUsed
      })
      .eq('user_id', user_id)
      .select()
      .single()

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({
        count: newCount,
        last_date: today,
        freeze_used_today: freezeUsed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in update-streak function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function checkAndUseFreeze(supabase: any, userId: string, daysMissed: number): Promise<boolean> {
  // Only auto-use freeze for 1-2 day gaps
  if (daysMissed > 2) return false

  // Get freeze state
  let { data: freezeState, error } = await supabase
    .from('streak_freezes')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching freeze state:', error)
    return false
  }

  // Create freeze record if it doesn't exist
  if (!freezeState) {
    const { data: newFreezeState, error: createError } = await supabase
      .from('streak_freezes')
      .insert({
        user_id: userId,
        personal_freezes: 0,
        family_pool_freezes: 0,
        freeze_history: []
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating freeze state:', createError)
      return false
    }
    
    freezeState = newFreezeState
  }

  // Check if freezes are available
  if (freezeState.personal_freezes > 0) {
    // Use personal freeze
    const newHistory = [...(freezeState.freeze_history || []), {
      type: 'consumed',
      timestamp: new Date().toISOString(),
      source: 'personal'
    }]

    const { error: updateError } = await supabase
      .from('streak_freezes')
      .update({
        personal_freezes: freezeState.personal_freezes - 1,
        freeze_history: newHistory
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating freeze state:', updateError)
      return false
    }

    return true
  } else if (freezeState.family_pool_freezes > 0) {
    // Use family pool freeze
    const newHistory = [...(freezeState.freeze_history || []), {
      type: 'consumed',
      timestamp: new Date().toISOString(),
      source: 'family_pool'
    }]

    const { error: updateError } = await supabase
      .from('streak_freezes')
      .update({
        family_pool_freezes: freezeState.family_pool_freezes - 1,
        freeze_history: newHistory
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating freeze state:', updateError)
      return false
    }

    return true
  }

  return false
}