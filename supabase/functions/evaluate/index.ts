import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Types
interface EvaluationRequest {
  question: string;
  attempt: string;
  userId?: string;
  masteryMode?: boolean;
  gradeLevel?: string;
}

interface EvaluationResponse {
  effort_score: number;
  understanding_score: number;
  copied: boolean;
  what_is_right: string;
  what_is_missing: string;
  coach_hint?: string;
  level_up_tip?: string;
  unlock: boolean;
  full_explanation: string;
  masteryAchieved?: boolean;
}

interface StreakData {
  count: number;
  lastDate: string | null;
}

interface HistoryItem {
  id: string;
  question: string;
  attempt: string;
  evaluation: EvaluationResponse;
  timestamp: string;
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
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

// Create evaluation prompt
function createEvaluationPrompt(masteryMode: boolean): string {
  const basePrompt = `You are a SOCRATIC educational AI evaluator for ThinkFirst.

CRITICAL RULES:
1. NEVER give direct answers or explanations in feedback
2. ALWAYS use guiding questions to lead students to discover answers
3. Keep ALL feedback to 1-2 sentences maximum
4. Your role is to GUIDE, not TEACH directly

Provide JSON evaluation with:
1. effort_score (0-3): How much effort did they put in?
2. understanding_score (0-3): How well do they understand?
3. copied (boolean): Does this look copied?
4. what_is_right (string): Acknowledge understanding with questions
5. what_is_missing (string): Use SOCRATIC QUESTIONS to guide
6. coach_hint (string): ONE guiding question (max 12 words)
7. level_up_tip (string, optional): Question-based tip if unlock=true
8. unlock (boolean): true if effort_score >= 2 OR understanding_score >= 2
9. full_explanation (string): Leave empty, generated separately

Return ONLY valid JSON.`;

  if (masteryMode) {
    return basePrompt.replace(
      'unlock (boolean): true if effort_score >= 2 OR understanding_score >= 2',
      'unlock (boolean): true ONLY if effort_score >= 3 AND understanding_score >= 2\n10. masteryAchieved (boolean): true if unlock is true'
    );
  }

  return basePrompt;
}

// Store user history
async function storeHistory(userId: string, question: string, attempt: string, evaluation: EvaluationResponse): Promise<void> {
  const historyKey = `history:${userId}`;
  const history: HistoryItem[] = await kvGet(historyKey) || [];
  
  history.unshift({
    id: crypto.randomUUID(),
    question,
    attempt,
    evaluation,
    timestamp: new Date().toISOString(),
  });

  // Keep last 50 attempts
  if (history.length > 50) {
    history.pop();
  }

  await kvSet(historyKey, history);
}

// Update user streak
async function updateStreak(userId: string, masteryMode: boolean, masteryAchieved?: boolean): Promise<void> {
  const streakKey = `streak:${userId}`;
  const streakData: StreakData = await kvGet(streakKey) || { count: 0, lastDate: null };
  
  const today = new Date().toISOString().split('T')[0];
  const lastDate = streakData.lastDate;

  const streakIncrement = masteryMode && masteryAchieved ? 2 : 1;

  if (lastDate === today) {
    // Already completed today
    return;
  } else if (!lastDate) {
    // First streak
    streakData.count = streakIncrement;
    streakData.lastDate = today;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      // Continue streak
      streakData.count += streakIncrement;
      streakData.lastDate = today;
    } else {
      // Restart streak
      streakData.count = streakIncrement;
      streakData.lastDate = today;
    }
  }

  await kvSet(streakKey, streakData);
}

// Generate fallback explanation when AI explanation fails
function generateFallbackExplanation(question: string, attempt: string): string {
  return `Great effort on your attempt! You've unlocked the answer to: "${question}"

While I'm working on generating a detailed explanation, here are some key points to consider:

• Your attempt shows good thinking and effort
• This topic involves important concepts worth exploring further
• Consider researching the key terms and concepts mentioned in the question
• Try to connect this topic to what you already know
• Look for reliable sources that can provide more detailed explanations

The full AI-generated explanation will be available shortly. Keep up the excellent work in your learning journey!`;
}

// Main handler
serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const body: EvaluationRequest = await req.json();
    const { question, attempt, userId, masteryMode = false, gradeLevel = 'college' } = body;

    if (!question || !attempt) {
      return jsonResponse({ error: 'Question and attempt are required' }, 400);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return jsonResponse({ error: 'OpenAI API key not configured' }, 500);
    }

    // Grade-appropriate context
    const gradeContexts: Record<string, string> = {
      'k-2': 'Early elementary student (K-2nd grade). Use simple language, be encouraging.',
      '3-5': 'Upper elementary student (3rd-5th grade). Age-appropriate vocabulary.',
      '6-8': 'Middle school student (6th-8th grade). More developed reasoning skills.',
      '9-10': 'Early high school student (9th-10th grade). Algebra and basic sciences.',
      '11-12': 'Late high school student (11th-12th grade). College-prep level.',
      'college': 'College student. Advanced, nuanced understanding expected.'
    };

    const gradeContext = gradeContexts[gradeLevel] || gradeContexts['college'];
    const prompt = createEvaluationPrompt(masteryMode);

    // Phase 1: Evaluation with GPT-4o-mini
    const evalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `${gradeContext}\n${prompt}` },
          { role: 'user', content: `Question: ${question}\nAttempt: ${attempt}` }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });

    if (!evalResponse.ok) {
      const errorText = await evalResponse.text();
      console.error('OpenAI API error:', evalResponse.status, errorText);
      return jsonResponse({ error: 'AI evaluation failed' }, 500);
    }

    const evalData = await evalResponse.json();
    const evaluation: EvaluationResponse = JSON.parse(evalData.choices[0].message.content);

    // Phase 2: Generate full explanation if unlocked
    if (evaluation.unlock) {
      console.log('Generating full explanation with GPT-4o...');
      
      try {
        const explainResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { 
                role: 'system', 
                content: `${gradeContext}\n\nYou are an educational AI providing comprehensive explanations. Provide a clear, detailed explanation that helps the student understand the concept fully. Include key points, examples where helpful, and explain the reasoning behind the answer.` 
              },
              { 
                role: 'user', 
                content: `Question: ${question}\n\nStudent's attempt: ${attempt}\n\nProvide a complete, accurate explanation of the correct answer and the underlying concepts.` 
              }
            ],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        });

        if (explainResponse.ok) {
          const explainData = await explainResponse.json();
          if (explainData.choices?.[0]?.message?.content) {
            evaluation.full_explanation = explainData.choices[0].message.content;
            console.log('Full explanation generated successfully');
          } else {
            console.error('Invalid explanation response structure');
            evaluation.full_explanation = generateFallbackExplanation(question, attempt);
          }
        } else {
          const errorText = await explainResponse.text();
          console.error('Explanation API error:', explainResponse.status, errorText);
          evaluation.full_explanation = generateFallbackExplanation(question, attempt);
        }
      } catch (error) {
        console.error('Error generating explanation:', error);
        evaluation.full_explanation = generateFallbackExplanation(question, attempt);
      }
    } else {
      // Ensure full_explanation is empty string when not unlocked
      evaluation.full_explanation = '';
    }

    // Store history and update streak if userId provided
    if (userId) {
      await storeHistory(userId, question, attempt, evaluation);
      
      if (evaluation.unlock) {
        await updateStreak(userId, masteryMode, evaluation.masteryAchieved);
      }
    }

    return jsonResponse(evaluation);
  } catch (error) {
    console.error('Error in evaluate:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});

console.log("Evaluate function started");