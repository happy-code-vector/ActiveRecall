import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// AI Evaluation Endpoint
app.post('/make-server-a0e3c496/evaluate', async (c) => {
  try {
    const { question, attempt, userId, masteryMode = false, gradeLevel = 'college' } = await c.req.json();

    if (!question || !attempt) {
      console.error('Validation error: Missing question or attempt');
      return c.json({ error: 'Question and attempt are required' }, 400);
    }

    // Call OpenAI API for evaluation
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Checking OPENAI_API_KEY:', openaiApiKey ? `Found (length: ${openaiApiKey.length})` : 'NOT FOUND');
    console.log('Available env vars:', Object.keys(Deno.env.toObject()));
    
    if (!openaiApiKey) {
      console.error('Configuration error: OPENAI_API_KEY environment variable is not set');
      return c.json({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your Supabase secrets.' }, 500);
    }

    // Grade-appropriate context for AI evaluation
    const gradeContexts: Record<string, string> = {
      'k-2': 'This is an early elementary student (K-2nd grade). Use simple language, be very encouraging, and expect basic understanding with simple vocabulary. Focus on effort over perfect accuracy.',
      '3-5': 'This is an upper elementary student (3rd-5th grade). Expect foundational knowledge but not advanced concepts. Vocabulary should be age-appropriate.',
      '6-8': 'This is a middle school student (6th-8th grade). Expect more developed reasoning skills and subject-specific terminology.',
      '9-10': 'This is an early high school student (9th-10th grade). Expect algebra, basic sciences, and essay writing skills.',
      '11-12': 'This is a late high school student (11th-12th grade). Expect college-prep level understanding and advanced reasoning.',
      'college': 'This is a college student. Expect advanced, nuanced understanding of complex topics.'
    };

    const gradeContext = gradeContexts[gradeLevel] || gradeContexts['college'];

    const standardPrompt = `You are an educational AI evaluator for ThinkFirst, an app that promotes active recall learning.

Evaluate the student's attempt to answer the question. Be supportive and encouraging while being honest about their understanding.

Question: "${question}"
Student's Attempt: "${attempt}"

Provide a JSON evaluation with:
1. effort_score (0-3): How much effort did they put in?
   - 0: No real effort, empty or nonsensical
   - 1: Minimal effort, very brief
   - 2: Good effort, meaningful attempt
   - 3: Strong effort, detailed explanation

2. understanding_score (0-3): How well do they understand the concept?
   - 0: Shows no understanding
   - 1: Shows partial/confused understanding
   - 2: Shows good understanding with minor gaps
   - 3: Shows strong, accurate understanding

3. copied (boolean): Does this look like it was copied from AI or another source? Check for overly formal language, perfect formatting, or suspiciously complete answers that don't match typical student writing.

4. what_is_right (string): 2-3 sentences praising what they got right or understood well. Be specific and encouraging.

5. what_is_missing (string): 2-3 sentences about what's missing or could be improved. Be constructive and helpful.

6. coach_hint (string): ONE SHORT QUESTION ONLY - A minimal, targeted hint for revision mode. Max 15 words. Point out a specific gap or vague term they used, then ask them to be more specific. Examples:
   - "You mentioned 'food' generally. Can you identify the specific sugar plants create?"
   - "What specific process do the mitochondria perform?"
   - "You said 'it happens fast.' What causes this speed?"
   Keep it brief, direct, and focused on ONE missing detail. Force recall, don't explain.

7. level_up_tip (string, optional): If unlock=true BUT scores aren't perfect (effort_score < 3 OR understanding_score < 3), provide ONE actionable tip (max 20 words) on how to strengthen their recall/explanation for next time. Frame it positively as a "pro move" not a criticism. Examples:
   - "Next time, explain the 'why' behind the process - it strengthens long-term memory."
   - "Try adding a real-world example to anchor your explanation."
   - "Great start! Add one more detail about the mechanism for mastery."
   Keep it aspirational and growth-focused. Only include if unlock=true and there's room for improvement.

8. unlock (boolean): Should they unlock the full answer?
   - true if effort_score >= 2 OR understanding_score >= 2
   - false if copied = true
   - false if both scores are < 2

9. full_explanation (string): A comprehensive, clear explanation of the concept. Make it educational, accurate, and easy to understand. Include key points, examples if relevant, and why it matters.

Return ONLY valid JSON, no other text.`;

    const masteryPrompt = `You are an educational AI evaluator for ThinkFirst, an app that promotes active recall learning.

The student has chosen MASTERY MODE - they want a rigorous challenge and are aiming for 2x streak points and a gold badge.

Question: "${question}"
Student's Attempt: "${attempt}"

Provide a JSON evaluation with HIGHER STANDARDS:
1. effort_score (0-3): How much effort did they put in? MASTERY MODE: Expect detailed, comprehensive explanations.
   - 0: No real effort, empty or nonsensical
   - 1: Minimal effort, too brief for mastery mode
   - 2: Good effort with meaningful depth
   - 3: Exceptional effort with thorough detail

2. understanding_score (0-3): How well do they understand the concept? MASTERY MODE: Demand precision and completeness.
   - 0: Shows no understanding
   - 1: Shows partial understanding but lacks depth
   - 2: Shows strong understanding with good detail
   - 3: Shows exceptional, nuanced understanding

3. copied (boolean): Does this look like it was copied from AI or another source? In mastery mode, be extra vigilant.

4. what_is_right (string): 2-3 sentences praising what they got right. Acknowledge their mastery attempt.

5. what_is_missing (string): 2-3 sentences about what's missing. Be more demanding - point out nuances, examples, or depth that's missing.

6. coach_hint (string): ONE SHORT QUESTION ONLY - A minimal, targeted hint for revision mode. Max 15 words. Point out a specific gap or vague term they used, then ask them to be more specific. Examples:
   - "You mentioned 'food' generally. Can you identify the specific sugar plants create?"
   - "What specific process do the mitochondria perform?"
   - "You said 'it happens fast.' What causes this speed?"
   Keep it brief, direct, and focused on ONE missing detail. Force recall, don't explain.

7. level_up_tip (string, optional): If unlock=true BUT scores aren't perfect (effort_score < 3 OR understanding_score < 3), provide ONE actionable tip (max 20 words) on how to strengthen their recall/explanation for next time. Frame it positively as a "pro move" not a criticism. Examples:
   - "Next time, explain the 'why' behind the process - it strengthens long-term memory."
   - "Try adding a real-world example to anchor your explanation."
   - "Great start! Add one more detail about the mechanism for mastery."
   Keep it aspirational and growth-focused. Only include if unlock=true and there's room for improvement.

8. unlock (boolean): Should they unlock the full answer? MASTERY MODE REQUIREMENTS:
   - true ONLY if effort_score >= 3 AND understanding_score >= 2
   - false if copied = true
   - false if they haven't shown sufficient mastery-level work

9. full_explanation (string): A comprehensive, clear explanation of the concept with extra depth for mastery-level learners.

10. masteryAchieved (boolean): true if unlock is true (they met mastery standards)

Return ONLY valid JSON, no other text.`;

    const prompt = masteryMode ? masteryPrompt : standardPrompt;

    console.log(`Calling OpenAI API for evaluation... Mode: ${masteryMode ? 'MASTERY' : 'STANDARD'}`);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `${gradeContext}\n${prompt}` },
          { role: 'user', content: `Question: ${question}\nAttempt: ${attempt}` }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', response.status, errorText);
      return c.json({ error: `AI evaluation failed: ${response.status} - ${errorText}` }, 500);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid OpenAI response structure:', JSON.stringify(data));
      return c.json({ error: 'Invalid response from AI service' }, 500);
    }

    console.log('OpenAI response received, parsing evaluation...');
    const evaluation = JSON.parse(data.choices[0].message.content);

    // Store the attempt in history if userId provided
    if (userId) {
      const historyKey = `history:${userId}`;
      const history = await kv.get(historyKey) || [];
      
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

      await kv.set(historyKey, history);

      // Update streak if unlocked
      if (evaluation.unlock) {
        const streakKey = `streak:${userId}`;
        const streakData = await kv.get(streakKey) || { count: 0, lastDate: null };
        
        const today = new Date().toISOString().split('T')[0];
        const lastDate = streakData.lastDate;

        // Determine streak increment: 2x for mastery mode, 1x for standard
        const streakIncrement = masteryMode && evaluation.masteryAchieved ? 2 : 1;

        if (lastDate === today) {
          // Already completed today, don't increment
        } else if (!lastDate) {
          // First ever streak
          streakData.count = streakIncrement;
          streakData.lastDate = today;
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastDate === yesterdayStr) {
            // Continuing streak - add 2x points for mastery, 1x for standard
            streakData.count += streakIncrement;
            streakData.lastDate = today;
          } else {
            // Streak broken, restart
            streakData.count = streakIncrement;
            streakData.lastDate = today;
          }
        }

        await kv.set(streakKey, streakData);
      }
    }

    console.log('Evaluation completed successfully');
    return c.json(evaluation);
  } catch (error) {
    console.error('Error in evaluate endpoint:', error);
    return c.json({ error: `Internal server error: ${error.message}` }, 500);
  }
});

// Get user streak
app.get('/make-server-a0e3c496/streak/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const streakData = await kv.get(`streak:${userId}`) || { count: 0, lastDate: null };
    
    // Check if streak is still valid
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streakData.lastDate !== today && streakData.lastDate !== yesterdayStr) {
      // Streak expired
      streakData.count = 0;
      streakData.lastDate = null;
    }

    return c.json(streakData);
  } catch (error) {
    console.error('Error getting streak:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user history
app.get('/make-server-a0e3c496/history/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const history = await kv.get(`history:${userId}`) || [];
    return c.json(history);
  } catch (error) {
    console.error('Error getting history:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user progress stats
app.get('/make-server-a0e3c496/progress/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const history = await kv.get(`history:${userId}`) || [];
    
    // Calculate stats from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentHistory = history.filter((item: any) => 
      new Date(item.timestamp) > sevenDaysAgo
    );

    const stats = {
      attemptsThisWeek: recentHistory.length,
      avgEffortScore: recentHistory.length > 0
        ? recentHistory.reduce((sum: number, item: any) => 
            sum + (item.evaluation?.effort_score || 0), 0) / recentHistory.length
        : 0,
      avgUnderstandingScore: recentHistory.length > 0
        ? recentHistory.reduce((sum: number, item: any) => 
            sum + (item.evaluation?.understanding_score || 0), 0) / recentHistory.length
        : 0,
      unlockRate: recentHistory.length > 0
        ? (recentHistory.filter((item: any) => item.evaluation?.unlock).length / recentHistory.length) * 100
        : 0,
    };

    return c.json(stats);
  } catch (error) {
    console.error('Error getting progress:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user badges
app.get('/make-server-a0e3c496/badges/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const badges = await kv.get(`badges:${userId}`) || [];
    return c.json(badges);
  } catch (error) {
    console.error('Error getting badges:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Award a badge to a user
app.post('/make-server-a0e3c496/badges/:userId/award', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { badgeId } = await c.req.json();
    
    if (!badgeId) {
      return c.json({ error: 'Badge ID is required' }, 400);
    }

    const badgesKey = `badges:${userId}`;
    const badges = await kv.get(badgesKey) || [];
    
    // Check if badge already awarded
    const existing = badges.find((b: any) => b.badgeId === badgeId);
    if (existing) {
      return c.json({ message: 'Badge already awarded', badge: existing });
    }

    // Award new badge
    const newBadge = {
      badgeId,
      awardedAt: new Date().toISOString(),
    };
    
    badges.push(newBadge);
    await kv.set(badgesKey, badges);

    return c.json({ message: 'Badge awarded successfully', badge: newBadge });
  } catch (error) {
    console.error('Error awarding badge:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Check and auto-award eligible badges
app.post('/make-server-a0e3c496/badges/:userId/check', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get user data
    const history = await kv.get(`history:${userId}`) || [];
    const streakData = await kv.get(`streak:${userId}`) || { count: 0, lastDate: null };
    const badges = await kv.get(`badges:${userId}`) || [];
    
    const earnedBadgeIds = badges.map((b: any) => b.badgeId);
    const newBadges: any[] = [];

    // Calculate stats for badge criteria
    const totalUnlocks = history.filter((item: any) => item.evaluation?.unlock).length;
    const masteryUnlocks = history.filter((item: any) => 
      item.evaluation?.unlock && item.evaluation?.masteryAchieved
    ).length;
    
    const avgEffortScore = history.length > 0
      ? history.reduce((sum: number, item: any) => 
          sum + (item.evaluation?.effort_score || 0), 0) / history.length
      : 0;

    // Check last 7 days for perfect week
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentHistory = history.filter((item: any) => 
      new Date(item.timestamp) > sevenDaysAgo
    );
    const isPerfectWeek = recentHistory.length >= 7 && 
      recentHistory.every((item: any) => item.evaluation?.effort_score >= 2.5);

    // Helper function to check badge criteria
    const checkBadge = (badgeId: string, criteria: any) => {
      // Check if badge already earned
      if (badges.some((b: any) => b.badgeId === badgeId)) {
        return false;
      }

      // Check criteria
      switch (criteria.type) {
        case 'streak':
          return streakData.count >= criteria.value;
        case 'total_unlocks':
          return totalUnlocks >= criteria.value;
        case 'mastery_unlocks':
          return masteryUnlocks >= criteria.value;
        case 'effort_score_avg':
          return avgEffortScore >= criteria.value;
        case 'mastery_mode':
          // Check if user has ANY mastery unlocks
          return masteryUnlocks >= 1;
        case 'perfect_score':
          // Check if user has ever gotten perfect scores
          return history.some((item: any) => 
            item.evaluation?.effort_score === 3 && item.evaluation?.understanding_score === 3
          );
        case 'late_night':
          // Check if user has ANY late night attempts with high effort
          return history.some((item: any) => {
            const hour = new Date(item.timestamp).getHours();
            return hour >= 23 && item.evaluation?.effort_score >= 2;
          });
        case 'early_morning':
          // Check if user has ANY early morning attempts
          return history.some((item: any) => {
            const hour = new Date(item.timestamp).getHours();
            return hour < 8;
          });
        case 'streak_saved':
          // This would be awarded when streak freeze is used
          // For now, return false (will be awarded separately)
          return false;
        case 'saved_count':
          // This requires tracking saved explanations
          // For now, return false (will be implemented later)
          return false;
        case 'manual':
          // Manual badges never auto-award
          return false;
        default:
          return false;
      }
    };

    // Define badge criteria (matching new badgeDefinitions.ts)
    const badgeChecks = [
      // Streaks
      { id: 'ignition', criteria: { type: 'streak', value: 3 } },
      { id: 'the_furnace', criteria: { type: 'streak', value: 7 } },
      { id: 'momentum', criteria: { type: 'streak', value: 14 } },
      { id: 'blue_giant', criteria: { type: 'streak', value: 30 } },
      { id: 'the_century', criteria: { type: 'streak', value: 100 } },
      { id: 'the_reboot', criteria: { type: 'streak_saved' } },
      // Mastery
      { id: 'synapse', criteria: { type: 'effort_score_avg', value: 2.5 } },
      { id: 'deep_dive', criteria: { type: 'perfect_score' } },
      { id: 'vanguard', criteria: { type: 'mastery_mode' } },
      { id: 'night_shift', criteria: { type: 'late_night' } },
      // Milestones
      { id: 'the_initiate', criteria: { type: 'total_unlocks', value: 1 } },
      { id: 'the_apprentice', criteria: { type: 'total_unlocks', value: 10 } },
      { id: 'the_operator', criteria: { type: 'total_unlocks', value: 50 } },
      { id: 'the_veteran', criteria: { type: 'total_unlocks', value: 100 } },
      { id: 'the_apex', criteria: { type: 'total_unlocks', value: 500 } },
      { id: 'early_riser', criteria: { type: 'early_morning' } },
    ];

    // Check each badge
    for (const badge of badgeChecks) {
      if (checkBadge(badge.id, badge.criteria)) {
        const newBadge = {
          badgeId: badge.id,
          awardedAt: new Date().toISOString(),
        };
        badges.push(newBadge);
        newBadges.push(newBadge);
      }
    }

    // Save updated badges
    if (newBadges.length > 0) {
      await kv.set(`badges:${userId}`, badges);
    }

    return c.json({ 
      newBadges,
      totalBadges: badges.length,
      stats: {
        totalUnlocks,
        masteryUnlocks,
        avgEffortScore,
        currentStreak: streakData.count,
      }
    });
  } catch (error) {
    console.error('Error checking badges:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===== FAMILY CONNECTION ENDPOINTS =====

// Generate invite code for parent (or get existing)
app.post('/make-server-a0e3c496/family/generate-invite', async (c) => {
  try {
    const { parentUserId } = await c.req.json();
    
    if (!parentUserId) {
      return c.json({ error: 'Parent user ID is required' }, 400);
    }

    // Check if parent already has an invite code
    const existingCode = await kv.get(`parent_invite:${parentUserId}`);
    
    if (existingCode) {
      return c.json({ inviteCode: existingCode });
    }

    // Generate new 8-character invite code
    const inviteCode = crypto.randomUUID().slice(0, 8).toUpperCase();
    
    // Store bidirectional mapping
    await kv.set(`parent_invite:${parentUserId}`, inviteCode);
    await kv.set(`invite_code:${inviteCode}`, parentUserId);
    
    console.log(`Generated invite code ${inviteCode} for parent ${parentUserId}`);
    
    return c.json({ inviteCode });
  } catch (error) {
    console.error('Error generating invite code:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Student connects to parent using invite code
app.post('/make-server-a0e3c496/family/connect-student', async (c) => {
  try {
    const { studentUserId, inviteCode, studentName } = await c.req.json();
    
    if (!studentUserId || !inviteCode) {
      return c.json({ error: 'Student ID and invite code are required' }, 400);
    }

    // Look up parent by invite code
    const parentUserId = await kv.get(`invite_code:${inviteCode}`);
    
    if (!parentUserId) {
      return c.json({ error: 'Invalid invite code' }, 404);
    }

    // Get or create parent's children list
    const childrenKey = `parent_children:${parentUserId}`;
    const children = await kv.get(childrenKey) || [];
    
    // Check if student already connected
    const alreadyConnected = children.some((child: any) => child.userId === studentUserId);
    
    if (alreadyConnected) {
      return c.json({ message: 'Already connected to this parent', parentUserId });
    }

    // Add student to parent's children list
    children.push({
      userId: studentUserId,
      name: studentName || 'Student',
      connectedAt: new Date().toISOString(),
    });
    
    await kv.set(childrenKey, children);
    
    // Store reverse relationship (student -> parent)
    await kv.set(`student_parent:${studentUserId}`, parentUserId);
    
    console.log(`Connected student ${studentUserId} to parent ${parentUserId}`);
    
    return c.json({ 
      success: true, 
      parentUserId,
      message: 'Successfully connected to parent account'
    });
  } catch (error) {
    console.error('Error connecting student:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get parent's children
app.get('/make-server-a0e3c496/family/children/:parentUserId', async (c) => {
  try {
    const parentUserId = c.req.param('parentUserId');
    const children = await kv.get(`parent_children:${parentUserId}`) || [];
    
    return c.json(children);
  } catch (error) {
    console.error('Error getting children:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get student's parent
app.get('/make-server-a0e3c496/family/parent/:studentUserId', async (c) => {
  try {
    const studentUserId = c.req.param('studentUserId');
    const parentUserId = await kv.get(`student_parent:${studentUserId}`);
    
    if (!parentUserId) {
      return c.json({ connected: false });
    }
    
    return c.json({ connected: true, parentUserId });
  } catch (error) {
    console.error('Error getting parent:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get family members for leaderboard/streak (includes parent + all children)
app.get('/make-server-a0e3c496/family/members/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Check if this user is a parent
    const children = await kv.get(`parent_children:${userId}`);
    
    if (children && children.length > 0) {
      // User is a parent - return all children + self
      const members = [
        { userId, name: 'You', isParent: true },
        ...children
      ];
      return c.json(members);
    }
    
    // Check if this user is a student with a connected parent
    const parentUserId = await kv.get(`student_parent:${userId}`);
    
    if (parentUserId) {
      // User is a student - get all siblings + parent
      const siblings = await kv.get(`parent_children:${parentUserId}`) || [];
      const members = siblings.map((child: any) => ({
        ...child,
        isYou: child.userId === userId
      }));
      return c.json(members);
    }
    
    // User has no family connections - return just themselves
    return c.json([{ userId, name: 'You' }]);
  } catch (error) {
    console.error('Error getting family members:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);