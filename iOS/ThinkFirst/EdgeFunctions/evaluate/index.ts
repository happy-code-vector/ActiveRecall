// Supabase Edge Function: evaluate
// Evaluates student learning attempts using AI

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EvaluationRequest {
  question: string
  attempt: string
  mastery_mode: boolean
  user_id?: string
}

interface EvaluationResponse {
  effort_score: number
  understanding_score: number
  copied: boolean
  what_is_right: string
  what_is_missing: string
  coach_hint?: string
  level_up_tip?: string
  unlock: boolean
  full_explanation: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question, attempt, mastery_mode, user_id }: EvaluationRequest = await req.json()

    // Validate input
    if (!question || !attempt) {
      return new Response(
        JSON.stringify({ error: 'Question and attempt are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Mock AI evaluation (replace with actual AI service)
    const evaluation = await evaluateAttempt(question, attempt, mastery_mode)

    // Store the attempt in database if user_id provided
    if (user_id) {
      const { error } = await supabase
        .from('learning_attempts')
        .insert({
          user_id,
          question,
          attempt,
          effort_score: evaluation.effort_score,
          understanding_score: evaluation.understanding_score,
          copied: evaluation.copied,
          what_is_right: evaluation.what_is_right,
          what_is_missing: evaluation.what_is_missing,
          coach_hint: evaluation.coach_hint,
          level_up_tip: evaluation.level_up_tip,
          unlock: evaluation.unlock,
          full_explanation: evaluation.full_explanation,
          mastery_mode
        })

      if (error) {
        console.error('Error storing attempt:', error)
      }
    }

    return new Response(
      JSON.stringify(evaluation),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in evaluate function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function evaluateAttempt(
  question: string, 
  attempt: string, 
  masteryMode: boolean
): Promise<EvaluationResponse> {
  // Mock evaluation logic (replace with actual AI service like OpenAI)
  
  const wordCount = attempt.trim().split(/\s+/).length
  const questionWords = question.toLowerCase().split(/\s+/)
  const attemptWords = attempt.toLowerCase().split(/\s+/)
  
  // Calculate effort score based on length and detail
  let effortScore = Math.min(3, wordCount / 20) // Base on word count
  if (wordCount > 50) effortScore += 0.3
  if (wordCount > 100) effortScore += 0.2
  
  // Calculate understanding score based on keyword overlap and structure
  const keywordOverlap = questionWords.filter(word => 
    attemptWords.some(attemptWord => attemptWord.includes(word))
  ).length / questionWords.length
  
  let understandingScore = keywordOverlap * 2.5
  if (attempt.includes('because') || attempt.includes('therefore')) understandingScore += 0.3
  if (attempt.includes('for example') || attempt.includes('such as')) understandingScore += 0.2
  
  // Adjust for mastery mode (stricter evaluation)
  if (masteryMode) {
    effortScore *= 0.8
    understandingScore *= 0.8
  }
  
  // Cap scores at 3.0
  effortScore = Math.min(3.0, Math.max(0, effortScore))
  understandingScore = Math.min(3.0, Math.max(0, understandingScore))
  
  // Determine if answer should be unlocked (effort >= 1.5 or understanding >= 2.0)
  const unlock = effortScore >= 1.5 || understandingScore >= 2.0
  
  // Generate feedback
  const whatIsRight = generatePositiveFeedback(attempt, effortScore, understandingScore)
  const whatIsMissing = generateImprovementFeedback(attempt, question, effortScore, understandingScore)
  const coachHint = effortScore < 2.0 ? generateCoachHint(question) : undefined
  
  // Generate full explanation (mock)
  const fullExplanation = generateFullExplanation(question)
  
  return {
    effort_score: Math.round(effortScore * 100) / 100,
    understanding_score: Math.round(understandingScore * 100) / 100,
    copied: false, // Would implement plagiarism detection here
    what_is_right: whatIsRight,
    what_is_missing: whatIsMissing,
    coach_hint: coachHint,
    level_up_tip: effortScore >= 2.5 ? "Great explanation! Try connecting this to other concepts you know." : undefined,
    unlock,
    full_explanation: fullExplanation
  }
}

function generatePositiveFeedback(attempt: string, effort: number, understanding: number): string {
  const positives = []
  
  if (effort >= 2.0) {
    positives.push("You put good effort into explaining this concept")
  }
  
  if (understanding >= 2.0) {
    positives.push("You demonstrated solid understanding of the key ideas")
  }
  
  if (attempt.includes('because') || attempt.includes('therefore')) {
    positives.push("You used good reasoning words to connect your ideas")
  }
  
  if (attempt.length > 100) {
    positives.push("You provided detailed explanations")
  }
  
  return positives.length > 0 
    ? positives.join('. ') + '.'
    : "You made a good attempt at explaining this concept."
}

function generateImprovementFeedback(attempt: string, question: string, effort: number, understanding: number): string {
  const improvements = []
  
  if (effort < 2.0) {
    improvements.push("Try adding more detail and examples to show your thinking")
  }
  
  if (understanding < 2.0) {
    improvements.push("Consider explaining the key mechanisms or processes involved")
  }
  
  if (!attempt.includes('because') && !attempt.includes('therefore')) {
    improvements.push("Use connecting words like 'because' or 'therefore' to show relationships")
  }
  
  if (attempt.length < 50) {
    improvements.push("Expand your explanation with more specific details")
  }
  
  return improvements.length > 0
    ? improvements.join('. ') + '.'
    : "Consider exploring the deeper connections and real-world applications."
}

function generateCoachHint(question: string): string {
  const hints = [
    "Think about what you already know about this topic and build from there.",
    "Try explaining it like you're teaching a friend who's never heard of this before.",
    "What are the main steps or parts involved in this process?",
    "Can you think of an example or analogy that might help explain this?",
    "What would happen if one part of this process was missing or changed?"
  ]
  
  return hints[Math.floor(Math.random() * hints.length)]
}

function generateFullExplanation(question: string): string {
  // Mock full explanation - in production, this would be generated by AI
  return `This is a comprehensive explanation of "${question}". It would include detailed information about the concept, how it works, why it's important, and how it connects to other related topics. The explanation would be thorough and educational, providing the complete understanding that the student is working toward.`
}