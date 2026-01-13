// Supabase Edge Function: increment-questions
// Increments daily question count for a user

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IncrementRequest {
  user_id: string
  today_date: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, today_date }: IncrementRequest = await req.json()

    if (!user_id || !today_date) {
      return new Response(
        JSON.stringify({ error: 'User ID and date are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Use the database function to increment questions
    const { data, error } = await supabase.rpc('increment_questions', {
      user_id,
      today_date
    })

    if (error) {
      console.error('Error calling increment_questions:', error)
      
      // Fallback: direct update
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('questions_today, questions_reset_date')
        .eq('id', user_id)
        .single()

      if (fetchError) throw fetchError

      let newCount = profile.questions_today
      
      // Reset if new day
      if (profile.questions_reset_date !== today_date) {
        newCount = 1
        await supabase
          .from('profiles')
          .update({
            questions_today: 1,
            questions_reset_date: today_date
          })
          .eq('id', user_id)
      } else {
        newCount = profile.questions_today + 1
        await supabase
          .from('profiles')
          .update({ questions_today: newCount })
          .eq('id', user_id)
      }

      return new Response(
        JSON.stringify({ count: newCount }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ count: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in increment-questions function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})