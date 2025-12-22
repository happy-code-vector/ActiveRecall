# ThinkFirst - Product Requirements Document

## 1. Product Overview

### 1.1 Vision
ThinkFirst is an active recall learning app that forces students to demonstrate their knowledge before accessing AI-generated answers, creating a learning environment that prioritizes effort and understanding over passive consumption.

### 1.2 Mission
Transform learning by making students think first, ensuring they engage deeply with material through mandatory attempt-before-answer mechanics and AI-powered evaluation.

### 1.3 Target Users
- **Primary**: Students (elementary through college) who want to improve learning outcomes through active recall
- **Secondary**: Parents/Guardians who want to monitor and support their children's learning journey

---

## 2. Core Principles

### 2.1 Three Pillars
1. **Students Must Provide Their Own Explanation Attempt First**
   - No access to answers without attempting
   - Mandatory text input before reveal
   - Encourages deep thinking and recall

2. **AI Evaluation Engine Scores Effort and Understanding**
   - Dual scoring: Effort (0-10) and Understanding (0-10)
   - Detects copied content
   - Provides personalized feedback
   - Grade-level aware evaluation

3. **Unlock Comprehensive Answers After Sufficient Effort**
   - Threshold-based unlock system
   - Retry mechanism with coach hints
   - Mercy mode for struggling students
   - Builds growth mindset

### 2.2 Learning Philosophy
- Active recall over passive reading
- Effort-based progression (not just correctness)
- Immediate, personalized feedback
- Gamification to drive engagement
- Streak-based habit formation

---

## 3. Design System

### 3.1 Visual Identity: "Dark Focus" Aesthetic

**Color Palette**
- **Background**: Pure black (#000000)
- **Surfaces**: Glassmorphic rgba(20, 20, 20, 0.95) with backdrop-blur-xl
- **Primary Accent**: Electric purple (#8B5CF6)
- **Secondary Accent**: Cyan (#22D3EE)
- **Family Features**: Gold/Amber (#FFBF00 to #FF8C00)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

**Typography**
- **Font Family**: Inter (system font fallback)
- **Sizes**: Managed via globals.css tokens
- **Weights**: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

**Border Radii**
- **Small elements**: 12px
- **Cards/Buttons**: 16px
- **Large containers**: 24px-32px

**Glassmorphism Style**
```css
background: rgba(20, 20, 20, 0.95);
backdrop-filter: blur(40px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
```

### 3.2 Motion Design
- **Micro-interactions**: All buttons, cards, and interactive elements have Motion animations
- **Page transitions**: Smooth fade/slide animations
- **Badge unlocks**: Celebration animations with confetti
- **Loading states**: Skeleton screens and spinners
- **Waveform**: Voice input has animated bars

### 3.3 Mobile-First Design
- **Max width**: 480px (centered on desktop)
- **Bottom navigation**: Tab bar for primary actions
- **Safe areas**: Respects mobile notches and home indicators
- **Touch targets**: Minimum 44px tap areas

---

## 4. Account Types & Onboarding

### 4.1 Account Type Selection
**New Feature**: At onboarding start, users choose account type:
- **Student Account** → Full learning flow with grade selection
- **Parent/Guardian Account** → Skip grade, access parent dashboard

**Rationale**: Parents don't answer questions (no grade needed), and each child has their own grade stored on their student account. This prevents confusion when parents have multiple children in different grades.

### 4.2 Onboarding Flow

#### Student Onboarding
1. **Splash Screen** → Animated ThinkFirst logo
2. **Account Type** → "I'm a Student" selection
3. **Grade Selection** → Elementary, Middle School, High School, College
4. **Goal Selection** → "What brings you here?" (Exam prep, homework help, etc.)
5. **Methodology Screen** → Explains the 3 core principles
6. **Try It Demo** → Sample question to experience the flow
7. **Notification Permission** → Optional push notifications
8. **Login/Signup** → Apple/Google OAuth or email
9. **Home Screen** → Main learning interface

#### Parent Onboarding
1. **Splash Screen** → Animated ThinkFirst logo
2. **Account Type** → "I'm a Parent/Guardian" selection
3. **Grade Selection** → SKIPPED (not applicable)
4. **Goal Selection** → Parent-specific goals
5. **Methodology Screen** → Explains monitoring features
6. **Try It Demo** → Shows parent dashboard preview
7. **Notification Permission** → Weekly report notifications
8. **Login/Signup** → Apple/Google OAuth or email
9. **Parent Dashboard** → Family monitoring interface

---

## 5. Core Learning Loop (Students)

### 5.1 Home Screen
**Layout**
- Top: Streak counter with fire emoji
- Hero: "What do you want to learn?" heading
- Input: Large text area + voice button
- Bottom: Tab navigation (Learn, Progress, History, Techniques, Profile)

**Question Input Methods**
1. **Text Input**: Manual typing
2. **Voice Input** (Premium): Animated waveform with speech-to-text
3. **Suggested Topics**: Quick-start buttons (Science, Math, History, etc.)

**Free vs Premium**
- **Free**: 3 questions per day
- **Premium**: Unlimited questions

### 5.2 Attempt Gate
**Purpose**: Force active recall before showing answer

**UI Elements**
- Question display (top card)
- Large text area: "Your attempt"
- Voice input button (Premium, locked for free users)
- Submit button (disabled until text entered)
- Bottom options:
  - "I'm Stuck" → Mastery mode retry flow (Premium)
  - "Reveal Answer" → Mercy mode (counts as 0 points)

**Validation**
- Minimum character count (prevents "idk" submissions)
- Real-time character counter
- Disabled submit for insufficient effort

### 5.3 Evaluation Screen
**AI Processing**
- Loading animation: "AI is thinking..."
- Backend calls OpenAI API with grade-level context
- Returns dual scores + feedback

**Results Display**
1. **Score Cards**
   - Effort Score (0-10): Circular progress ring, purple
   - Understanding Score (0-10): Circular progress ring, cyan
   - Total Score: Sum/20

2. **Feedback Sections**
   - ✅ What You Got Right (green)
   - ⚠️ What's Missing (orange)
   - 🚨 Copied Content Detection (red, if applicable)

3. **Unlock Logic**
   - **Score ≥ 12/20** → Unlock answer immediately
   - **Score < 12/20** → Show "Level Up" coach tip + Retry button

4. **Actions**
   - **Unlock Answer** (if threshold met)
   - **Try Again** (retry with coach hint)
   - **Go Home**

### 5.4 Answer Screen
**Layout**
- Question recap
- Your attempt (editable for notes)
- Full AI-generated explanation
- Action buttons:
  - "Ask Another Question"
  - "Go Home"

**Post-Unlock Actions**
- **Streak Update**: +1 if daily unlock achieved
- **Badge Check**: Auto-trigger badge unlock modal if earned
- **XP Award**: Points added to progress

---

## 6. Grade Level Integration

### 6.1 Purpose
Personalize AI evaluation and example questions to match student's learning level.

### 6.2 Grade Options
- **Elementary** (ages 5-10)
- **Middle School** (ages 11-13)
- **High School** (ages 14-18)
- **College** (18+)

### 6.3 Implementation
- Selected during student onboarding (skipped for parents)
- Stored in localStorage: `thinkfirst_userGrade`
- Passed to AI evaluation endpoint: `gradeLevel` parameter
- AI adjusts:
  - Language complexity
  - Explanation depth
  - Example questions
  - Feedback tone

### 6.4 Example Personalization
**Elementary Student asks: "What is photosynthesis?"**
- AI uses simple words: "plants make food from sunlight"
- Examples: "like a plant eating sunshine"

**College Student asks same question:**
- AI uses technical terms: "chlorophyll, glucose production, cellular respiration"
- Examples: "Calvin cycle, light-dependent reactions"

---

## 7. Premium Subscription System

### 7.1 Plans

#### Free Plan
- ❌ 3 questions per day limit
- ❌ 5 answer unlocks per day limit
- ❌ No voice input
- ❌ No mastery mode
- ❌ No coach tips
- ❌ No advanced stats
- ❌ No badges
- ✅ Basic learning loop
- ✅ Streak tracking
- ✅ History access

#### Solo Plan ($9.99/month)
- ✅ Unlimited questions
- ✅ Unlimited unlocks
- ✅ Voice input with waveform
- ✅ Mastery mode (adaptive difficulty)
- ✅ Coach tips on retry
- ✅ Advanced progress stats
- ✅ Full badge collection
- ✅ Ad-free experience

#### Family Plan ($14.99/month)
- ✅ All Solo features
- ✅ Up to 5 linked accounts
- ✅ Parent Dashboard
- ✅ Guardian Guidance (content filters, time limits)
- ✅ Family Leaderboard
- ✅ Weekly email reports
- ✅ Family Squad Streak card
- ✅ Nudge notifications

### 7.2 Paywall Strategy
**Contextual Upgrade Prompts**: Show feature-specific modals when free users tap locked features
- Voice button → "Unlock Voice Input" modal
- Mastery mode → "Upgrade for Adaptive Learning" modal
- Coach tips → "Get Personalized Hints" modal
- Badges → "Unlock Badge Collection" modal
- Questions limit → "You've reached your daily limit" modal

**Pricing Screen**
- Hero: "Unlock Your Full Potential"
- Plan comparison cards with checkmarks
- 7-day free trial CTA
- "Restore Purchases" link
- "Stay Free" option (graceful degradation)

---

## 8. Gamification & Engagement

### 8.1 Streak System
**Purpose**: Build daily learning habits

**Mechanics**
- +1 streak for first unlock each day
- Resets to 0 if no activity for 24 hours
- Displayed on Home screen with 🔥 emoji
- Stored in backend (KV store)

**Streak Milestones**
- 7 days → "Week Warrior" badge
- 30 days → "Monthly Master" badge
- 100 days → "Century Scholar" badge

### 8.2 Badge System
**Purpose**: Reward achievements and milestones

**Badge Categories**
1. **Streak Badges**
   - First Unlock (1 unlock)
   - Week Warrior (7-day streak)
   - Monthly Master (30-day streak)
   - Century Scholar (100-day streak)

2. **Volume Badges**
   - Question Asker (10 questions)
   - Knowledge Seeker (50 questions)
   - Learning Legend (100 questions)

3. **Quality Badges**
   - Perfect Score (score 20/20)
   - Effort Champion (effort score 10/10)
   - Understanding Expert (understanding score 10/10)

4. **Special Badges**
   - Night Owl (unlock after 10 PM)
   - Early Bird (unlock before 7 AM)
   - Weekend Warrior (unlock on Saturday/Sunday)

**Badge Display**
- Grid layout on Badges screen
- Locked badges shown as silhouettes
- Unlocked badges in full color
- Progress bars for incremental badges
- Unlock modal with celebration animation + confetti

**Auto-Check Trigger**
- After each successful unlock (evaluation screen)
- Backend endpoint: `/badges/:userId/check`
- Returns `newBadges[]` array
- Frontend displays unlock modal sequentially

### 8.3 XP & Levels
**XP Formula**
```
XP = (effort_score + understanding_score) * 10
Max XP per question = 200
```

**Level Progression**
- Level 1: 0 XP
- Level 2: 500 XP
- Level 3: 1500 XP
- Level 4: 3000 XP
- Level 5: 5000 XP
- ...continues exponentially

**Display**
- Progress screen shows level + XP bar
- Level-up animation when threshold crossed

---

## 9. Parent Dashboard & Family Features

### 9.1 Parent Dashboard
**Access**: Parents with Family Plan subscription

**Overview Cards**
1. **Student Cards** (scrollable)
   - Student name + avatar
   - Current streak
   - Questions this week
   - Average score
   - Tap to view details

2. **Family Squad Streak Card**
   - Golden theme (#FFBF00)
   - Combined family streak
   - Crown icon for longest streak holder
   - Motivational copy

3. **Quick Actions**
   - Add Student (invite code flow)
   - Guardian Settings
   - View Leaderboard
   - Download Weekly Report

**Student Detail View**
- Activity graph (7-day sparkline)
- Recent questions list
- Badge progress
- Time spent learning
- Difficulty distribution

### 9.2 Family Invite System
**Purpose**: Connect student accounts to parent's Family Plan

**Parent Flow**
1. Parent taps "Add Student" in dashboard
2. System generates 8-character invite code (alphanumeric)
3. Parent shares code via Share sheet or copy button
4. Code valid for 24 hours
5. Up to 5 students can connect

**Student Flow**
1. Student taps "Join Family Squad" in Profile
2. Enters 8-character code in OTP-style input boxes
3. Auto-advance on character entry
4. Submit → Backend validates + links accounts
5. Success modal: "Welcome to Family Squad!"
6. Premium features unlock immediately

**Invite Code Design**
- **Parent Screen**: Gold theme, massive monospace code, Share + Copy buttons
- **Student Screen**: Purple theme, 8 individual input boxes with focus states

**Backend**
- Endpoint: `/family/generate-invite` (POST)
- Endpoint: `/family/connect-student` (POST)
- Storage: KV store with TTL (24h expiry)

### 9.3 Family Leaderboard
**Purpose**: Friendly competition and motivation

**Layout**
1. **Time Toggle**: Daily / Weekly / All-Time
2. **Top 3 Podium**
   - 1st place: Gold medal, larger card, crown
   - 2nd place: Silver medal
   - 3rd place: Bronze medal
   - Animated entrance (stagger)

3. **Member Cards** (4th place onward)
   - Rank number
   - Avatar + name
   - Score (XP earned in timeframe)
   - Mini stats (questions, streak)

**Scoring Logic**
- Daily: XP earned today
- Weekly: XP earned this week (Monday-Sunday)
- All-Time: Total XP ever

**Access**: Family Plan members only

### 9.4 Nudge Notifications
**Purpose**: Family members can encourage each other to study

**Flow**
1. Tap "Nudge" button on Family Leaderboard member card
2. Creates notification for that family member
3. Glassmorphic banner appears at top of recipient's Home screen
4. Shows sender name: "Emma nudged you to study!"
5. Dismiss button (X icon)
6. Persists in localStorage until dismissed

**Design**
- Gold gradient background
- Rounded corners (16px)
- Slide-in animation from top
- Auto-dismiss after 10 seconds (optional)

### 9.5 Guardian Guidance System
**Purpose**: Parental controls for safety and screen time

**Guardian Settings Screen**
- Enable/disable difficulty friction (harder questions require parent approval)
- Set time limits per day
- Content filters (mature topics)
- Weekly report email settings
- Pause learning (lock student account temporarily)

**Difficulty Friction Feature**
- If student asks "hard" or mature topic (detected by AI)
- Show interstitial modal: "This topic may be challenging. Continue?"
- Options: "Ask Parent" (sends notification) or "Choose Different Topic"
- Parent can approve/deny in dashboard

**Weekly Report Email** (mockup only)
- Sent every Sunday at 8 PM
- Summary: total questions, avg score, streak, badges earned
- Preview available in Guardian Settings

---

## 10. Advanced Features

### 10.1 Voice Input (Premium)
**Purpose**: Faster question entry, accessibility

**UI**
- Microphone button in attempt gate
- Tap → Request mic permission
- Hold to record (animated waveform bars)
- Release → Speech-to-text conversion
- Text appears in input field
- Edit before submitting

**Tech**
- Uses Web Speech API (browser native)
- Fallback to text input if unsupported
- Premium-only feature (paywall for free users)

### 10.2 Mastery Mode (Premium)
**Purpose**: Adaptive difficulty with AI-generated practice

**Flow**
1. Student clicks "I'm Stuck" on Attempt Gate
2. AI generates 3 easier practice questions on same topic
3. Student answers each sequentially
4. After completing all 3, returns to original question
5. Coach hint provided to guide retry

**Benefits**
- Scaffolded learning
- Builds confidence
- Prevents frustration
- Gradual skill building

### 10.3 Coach Tips (Premium)
**Purpose**: Personalized hints on retry attempts

**When Shown**
- After failing first attempt (score < 12/20)
- On Evaluation screen in "Level Up" card
- Provides specific guidance without giving away answer

**Example**
- Question: "What is photosynthesis?"
- Bad Attempt: "plants grow"
- Coach Tip: "Think about what plants need to grow—sunlight, water, and air. What do they produce?"

### 10.4 Retry Flow with Coach Hint
1. Student scores < 12/20 on evaluation
2. "Level Up" card displays with coach tip
3. "Try Again" button returns to Attempt Gate
4. Attempt Gate shows previous attempt + coach hint at top
5. Student revises attempt
6. Re-evaluation (can unlock on second try)

---

## 11. Additional Screens

### 11.1 Progress Screen
**Stats Dashboard**
- Total questions asked
- Total unlocks
- Average score
- Current streak (with fire emoji)
- Level + XP bar
- Weekly activity graph (bar chart)
- Category breakdown (Science, Math, History, etc.)

**Premium Stats** (locked for free users)
- Time spent learning
- Best performing topics
- Improvement trends
- Detailed analytics

### 11.2 History Screen
**Question Log**
- Chronological list of past questions
- Each card shows:
  - Question text (truncated)
  - Date + time
  - Score badges (effort + understanding)
  - Tap to view full details
- Filter by date range or score
- Retry button to ask again

### 11.3 Techniques Screen
**Learning Methods Library**
- Grid of study technique cards
- Categories:
  - Active Recall
  - Spaced Repetition
  - Feynman Technique
  - Pomodoro
  - Mind Mapping
  - Interleaving
- Each card:
  - Title + icon
  - Short description
  - Tap to view full explanation + examples

### 11.4 Profile Screen (Student)
**Layout**
- Avatar + name + edit button
- Streak counter
- Level badge
- Quest cards (optional challenges)
- Actions:
  - Join Family Squad (invite code entry)
  - View Badges
  - Settings
  - Upgrade to Premium
  - Log Out

### 11.5 Profile Screen (Parent)
**Layout**
- Avatar + name + edit button
- Family plan badge (if subscribed)
- Actions:
  - Parent Dashboard
  - Guardian Settings
  - Family Leaderboard
  - Manage Plan
  - Settings
  - Log Out

### 11.6 Settings Screen
**Options**
- Notifications (toggle)
- Email (edit)
- Password (change)
- Manage Plan (for premium users)
- Restore Purchases
- Privacy Policy
- Terms of Service
- Log Out
- Delete Account (with confirmation)

---

## 12. Technical Architecture

### 12.1 Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Storage**: localStorage for client-side persistence
- **Build**: Vite

### 12.2 Backend Stack
- **Platform**: Supabase
- **Edge Functions**: Hono web server
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage (for file uploads)
- **Auth**: Supabase Auth (email, OAuth)

### 12.3 Three-Tier Architecture
```
Frontend (React)
    ↓
Server (Supabase Edge Function + Hono)
    ↓
Database (PostgreSQL + KV Store)
```

### 12.4 API Endpoints

**Base URL**: `https://{projectId}.supabase.co/functions/v1/make-server-a0e3c496`

**Evaluation**
- `POST /evaluate`
- Body: `{ question, attempt, userId, masteryMode, gradeLevel }`
- Returns: `{ effort_score, understanding_score, copied, what_is_right, what_is_missing, unlock, full_explanation, coach_hint?, level_up_tip? }`

**Streak**
- `GET /streak/:userId`
- Returns: `{ count, lastDate }`
- `POST /streak/:userId/increment`
- Auto-increments on first unlock each day

**Badges**
- `GET /badges/:userId`
- Returns: `{ badges: [{ id, name, description, icon, unlockedAt }] }`
- `POST /badges/:userId/check`
- Returns: `{ newBadges: ['badge_id'] }`
- Auto-checks after each unlock

**Family**
- `POST /family/generate-invite`
- Body: `{ parentUserId }`
- Returns: `{ inviteCode: '8CHAR123' }`
- `POST /family/connect-student`
- Body: `{ studentUserId, inviteCode, studentName }`
- Returns: `{ success: true, parentUserId }`

**Progress**
- `GET /progress/:userId`
- Returns: `{ totalQuestions, totalUnlocks, avgScore, xp, level, weeklyActivity: [...] }`

**History**
- `GET /history/:userId`
- Returns: `{ questions: [{ id, question, attempt, evaluation, timestamp }] }`

### 12.5 Data Storage (KV Store)

**Key-Value Table**: `kv_store_a0e3c496`

**Key Patterns**
- `user:{userId}:streak` → `{ count: 5, lastDate: '2025-12-13' }`
- `user:{userId}:badges` → `['first_unlock', 'week_warrior']`
- `user:{userId}:xp` → `1500`
- `user:{userId}:level` → `3`
- `user:{userId}:questions` → `[{ q, a, eval, ts }]`
- `family:invite:{code}` → `{ parentUserId, expiresAt, usedBy: [] }`
- `family:{parentId}:students` → `['studentId1', 'studentId2']`

**KV Store API**
```typescript
import * as kv from './supabase/functions/server/kv_store';

// Single operations
await kv.get(key);
await kv.set(key, value);
await kv.del(key);

// Multi operations
await kv.mget([key1, key2]);
await kv.mset({ key1: val1, key2: val2 });
await kv.mdel([key1, key2]);

// Prefix search
await kv.getByPrefix('user:123:');
```

### 12.6 Environment Variables
**Required Secrets** (Supabase Dashboard → Settings → Secrets)
- `SUPABASE_URL` (auto-provided)
- `SUPABASE_ANON_KEY` (auto-provided)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-provided)
- `OPENAI_API_KEY` (user must add)

### 12.7 AI Evaluation Logic
**OpenAI Integration**
- Model: GPT-4 Turbo (or GPT-4o)
- Temperature: 0.7 (balance creativity and consistency)
- Prompt engineering:
  - System: "You are an educational AI evaluator..."
  - Context: question, student attempt, grade level
  - Output: JSON with scores + feedback

**Evaluation Criteria**
1. **Effort Score (0-10)**
   - Length of response
   - Specificity and detail
   - Use of examples
   - Evidence of thinking (not copied)

2. **Understanding Score (0-10)**
   - Accuracy of concepts
   - Correct terminology
   - Logical reasoning
   - Addressing all parts of question

3. **Copied Detection**
   - Check for exact quotes without attribution
   - Generic "I don't know" responses
   - Suspicious formatting (e.g., markdown from ChatGPT)

**Response Format**
```json
{
  "effort_score": 7,
  "understanding_score": 8,
  "copied": false,
  "what_is_right": "Great explanation of...",
  "what_is_missing": "You could improve by...",
  "unlock": true,
  "full_explanation": "Photosynthesis is...",
  "coach_hint": "Think about the role of chlorophyll...",
  "level_up_tip": "To master this topic, try explaining it to a friend."
}
```

---

## 13. User Flows (Detailed)

### 13.1 First-Time Student Onboarding
```
Splash → Get Started
  ↓
Account Type → Select "Student"
  ↓
Grade Selection → Choose grade level (e.g., "High School")
  ↓
Goal Selection → Choose goal (e.g., "Exam Prep")
  ↓
Methodology → Learn the 3 principles
  ↓
Try It Demo → Experience sample question
  ↓
Notification Permission → Enable/Skip push notifications
  ↓
Login/Signup → Apple/Google/Email
  ↓
Home Screen → Start learning!
```

### 13.2 First-Time Parent Onboarding
```
Splash → Get Started
  ↓
Account Type → Select "Parent/Guardian"
  ↓
[SKIP GRADE SELECTION]
  ↓
Goal Selection → Choose parent goals (e.g., "Monitor Progress")
  ↓
Methodology → Learn parent dashboard features
  ↓
Try It Demo → Preview dashboard
  ↓
Notification Permission → Weekly report emails
  ↓
Login/Signup → Apple/Google/Email
  ↓
Parent Dashboard → View (empty state → Add Student CTA)
```

### 13.3 Student Learning Loop (First Unlock)
```
Home → Type/Voice question: "What is photosynthesis?"
  ↓
Attempt Gate → Write attempt: "Plants use sunlight to make food..."
  ↓
Submit → AI evaluation loads
  ↓
Evaluation Screen → Scores: Effort 8/10, Understanding 7/10 = 15/20
  ↓
Unlock Answer → Threshold met (≥12/20)
  ↓
Answer Screen → Read full explanation, streak +1
  ↓
Badge Check → Unlock "First Unlock" badge! 🎉
  ↓
Badge Modal → Celebration animation + confetti
  ↓
Close Modal → Ask Another Question or Go Home
```

### 13.4 Student Learning Loop (Retry Flow)
```
Home → Ask question
  ↓
Attempt Gate → Write insufficient attempt
  ↓
Evaluation Screen → Scores: 5/10 + 6/10 = 11/20
  ↓
Below Threshold (needs ≥12) → "Level Up" card appears
  ↓
Coach Tip: "Think about what plants need..." + Try Again button
  ↓
Attempt Gate (Retry) → Previous attempt shown + coach hint at top
  ↓
Revise Attempt → Add more detail
  ↓
Re-Evaluation → New scores: 8/10 + 7/10 = 15/20
  ↓
Unlock Answer → Success!
```

### 13.5 Family Connection Flow
```
[Parent Side]
Parent Dashboard → Add Student button
  ↓
Generate Invite Code → "8CHAR123" displayed in gold card
  ↓
Share Code → Tap Share button (native share sheet)
  ↓
[Send to student via iMessage, WhatsApp, etc.]

[Student Side]
Profile → "Join Family Squad" button
  ↓
Enter Code Screen → 8 OTP-style input boxes
  ↓
Type/Paste "8CHAR123" → Auto-advance per character
  ↓
Link Account → Backend validates + connects
  ↓
Success Modal → "Welcome to Family Squad!" + Premium unlocked
  ↓
Close → Return to Profile (now shows "Family Squad Active" badge)
```

### 13.6 Free User Hitting Question Limit
```
Home → Ask 4th question of the day
  ↓
System Check → localStorage dailyQuestionCount = 3
  ↓
Upgrade Prompt Modal → "You've reached your daily limit (3/3)"
  ↓
Options:
  - "Upgrade to Premium" → Pricing Screen
  - "Come Back Tomorrow" → Close modal, stay on home
```

### 13.7 Parent Viewing Student Progress
```
Parent Dashboard → Tap student card "Emma"
  ↓
Student Detail View → Shows:
  - 7-day activity graph
  - Recent questions list
  - Badge progress (5/12 unlocked)
  - Average score: 16/20
  - Time spent: 2.5 hours this week
  ↓
Tap "View All Questions" → Full history
  ↓
Tap specific question → View attempt + evaluation + answer
```

---

## 14. Edge Cases & Error Handling

### 14.1 Network Errors
- Show error toast: "Network error. Please try again."
- Retry button on evaluation screen
- Save attempt to localStorage (don't lose work)

### 14.2 OpenAI API Failures
- Detect API key missing → Show setup instructions
- Rate limit hit → "AI is busy. Try again in a moment."
- Malformed response → Fallback to generic feedback

### 14.3 Invalid Invite Codes
- Student enters wrong code → "Invalid code. Please check and try again."
- Code expired (>24h) → "Code expired. Ask for a new one."
- Code already used by 5 students → "Family limit reached."

### 14.4 Streak Reset Logic
- If no unlock today and lastDate < yesterday → Reset to 0
- Edge case: User unlocks at 11:59 PM, then 12:01 AM → Counts as 2 days (intended)

### 14.5 Badge Race Conditions
- If user unlocks 2 questions rapidly, ensure badge check doesn't duplicate
- Backend should use `UNIQUE` constraint on `(userId, badgeId)` pairs

### 14.6 Concurrent Family Connections
- If 2 students try same invite code simultaneously → First wins, second gets error
- Backend should lock invite code during connection

---

## 15. Analytics & Metrics (Future)

### 15.1 Key Metrics to Track
**Acquisition**
- New signups per day
- Onboarding completion rate
- Account type split (student vs parent)

**Engagement**
- Daily active users (DAU)
- Questions asked per user
- Unlock rate (% of attempts that unlock)
- Retry rate (% of failed attempts retried)
- Streak distribution (how many users at 7+, 30+ days)

**Monetization**
- Free-to-paid conversion rate
- Solo vs Family plan split
- Churn rate
- Lifetime value (LTV)

**Feature Adoption**
- Voice input usage (% of questions)
- Mastery mode usage
- Badge unlock rate
- Family connection rate (% of Family plan users with ≥2 students)

### 15.2 A/B Test Ideas
- Unlock threshold: 12/20 vs 10/20 vs 14/20
- Coach tip format: bullet points vs paragraph
- Badge unlock animation: confetti vs fireworks
- Free plan limit: 3 vs 5 questions/day
- Pricing: $9.99 vs $7.99 for Solo plan

---

## 16. Future Enhancements (Roadmap)

### 16.1 Short-Term (Next 3 Months)
- [ ] Real Supabase Auth (replace localStorage)
- [ ] Social login (Apple, Google) fully functional
- [ ] Backend migration from KV store to proper tables
- [ ] Weekly report email automation
- [ ] Push notifications for streaks + nudges
- [ ] Subject categorization (AI detects topic)
- [ ] Difficulty auto-detection (flag mature content)

### 16.2 Medium-Term (6 Months)
- [ ] Mobile apps (iOS + Android via React Native)
- [ ] Offline mode (cache questions + sync later)
- [ ] Study groups (peer learning, shared questions)
- [ ] Teacher accounts (classroom monitoring)
- [ ] Custom question packs (curated by educators)
- [ ] Multi-language support (Spanish, French, Mandarin)

### 16.3 Long-Term (12+ Months)
- [ ] AI tutor mode (conversational follow-ups)
- [ ] Video explanations (AI-generated or curated)
- [ ] AR flashcards (spatial repetition)
- [ ] Community marketplace (user-generated question packs)
- [ ] University partnerships (credit for usage)
- [ ] Enterprise plan (schools, districts)

---

## 17. Success Criteria

### 17.1 Launch Goals (Month 1)
- 1,000 signups
- 60% onboarding completion
- 30% DAU retention (day 7)
- 5% free-to-paid conversion

### 17.2 Growth Goals (Month 6)
- 50,000 users
- 10,000 paid subscribers
- 50% DAU retention (day 30)
- 4.5+ star rating (app stores)

### 17.3 Product-Market Fit Signals
- Users asking 10+ questions per week
- Streak distribution: 20% at 7+ days, 5% at 30+ days
- Organic referrals (family sharing invite codes)
- NPS score >50

---

## 18. Competitive Landscape

### 18.1 Competitors
- **Quizlet**: Flashcards, passive review (no AI evaluation)
- **Khan Academy**: Video lessons, practice problems (no active recall gate)
- **Duolingo**: Gamified language learning (different domain)
- **Socratic by Google**: AI homework help (no attempt requirement)
- **Photomath**: Math solver (instant answers, no effort check)

### 18.2 ThinkFirst Differentiators
1. **Mandatory attempt before answer** (unique mechanic)
2. **AI evaluates effort + understanding** (not just correctness)
3. **Grade-level personalization** (K-12 + college)
4. **Family collaboration** (parent dashboard + leaderboard)
5. **Dark Focus aesthetic** (premium, modern design)

---

## 19. Privacy & Safety

### 19.1 Data Collection
- Questions, attempts, evaluations stored server-side
- No personally identifiable information (PII) sold to third parties
- COPPA compliant (parental consent for <13 years old)

### 19.2 Content Moderation
- AI flags inappropriate questions (violence, hate speech, NSFW)
- Guardian friction for mature topics (parental approval)
- Report button for users to flag content

### 19.3 Security
- API keys stored in Supabase Secrets (not frontend)
- Row-level security (RLS) on database
- HTTPS only
- OAuth tokens encrypted

---

## 20. Open Questions / Future Decisions

### 20.1 Pricing Optimization
- Should we offer annual plans? (e.g., $99/year = 17% discount)
- Student discounts? (verify with .edu email)
- Lifetime access tier? (one-time payment)

### 20.2 AI Model Selection
- GPT-4 Turbo vs GPT-4o vs Claude 3.5 Sonnet?
- Cost per evaluation vs quality tradeoff
- Self-hosted model for cost savings?

### 20.3 Platform Expansion
- Native mobile apps (React Native) vs PWA?
- Web app sufficient for MVP?
- Desktop app (Electron) needed?

### 20.4 Social Features
- Should students see each other's attempts? (peer learning)
- Public leaderboard (all users) vs private (family only)?
- Share badges on social media?

---

## 21. Appendix

### 21.1 Glossary
- **Active Recall**: Retrieving information from memory (vs re-reading)
- **Attempt Gate**: UI that requires user input before showing answer
- **Glassmorphism**: Design style with frosted glass effect (blur + transparency)
- **KV Store**: Key-value storage (NoSQL-like for fast lookups)
- **Mastery Mode**: Adaptive difficulty with scaffolded practice
- **Nudge**: Social notification to encourage family member to study
- **OTP-style input**: Individual boxes for each character (like verification codes)
- **Streak**: Consecutive days with at least one unlock
- **Unlock**: Gaining access to the full answer after sufficient attempt

### 21.2 File Structure
```
/
├── App.tsx (main app, routing)
├── components/
│   ├── SplashScreen.tsx
│   ├── AccountTypeScreen.tsx (NEW)
│   ├── UserTypeScreen.tsx
│   ├── GradeSelectionScreen.tsx
│   ├── GoalSelectionScreen.tsx
│   ├── MethodologyScreen.tsx
│   ├── TryItScreen.tsx
│   ├── NotificationPermissionScreen.tsx
│   ├── HomeScreen.tsx
│   ├── AttemptGate.tsx
│   ├── EvaluationScreen.tsx
│   ├── AnswerScreen.tsx
│   ├── ProgressScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── ParentProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── PricingScreen.tsx
│   ├── ParentDashboard.tsx
│   ├── GuardianSettings.tsx
│   ├── ConnectParentScreen.tsx (OTP input)
│   ├── AddStudentScreen.tsx (Invite code display)
│   ├── FamilyLeaderboard.tsx
│   ├── BadgesScreen.tsx
│   ├── BadgeUnlockModal.tsx
│   ├── TechniquesScreen.tsx
│   ├── UpgradePrompt.tsx
│   ├── LimitReachedModal.tsx
│   ├── NudgeNotificationBanner.tsx
│   └── ui/ (reusable components)
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx (Hono web server)
│           ├── kv_store.tsx (KV utility, PROTECTED)
│           └── [other endpoints]
├── utils/
│   ├── supabase/
│   │   └── info.tsx (projectId, publicAnonKey)
│   └── subscription.tsx (premium logic)
├── styles/
│   └── globals.css (Tailwind + custom tokens)
└── PRODUCT_SPEC.md (this file)
```

### 21.3 Design Tokens (globals.css excerpt)
```css
:root {
  --color-primary: #8B5CF6;
  --color-secondary: #22D3EE;
  --color-gold: #FFBF00;
  --color-success: #10B981;
  --color-error: #EF4444;
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --blur-glass: 40px;
}
```

### 21.4 Motion Variants (Animation Patterns)
```typescript
// Fade in from bottom
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Scale pop
const scalePop = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 200 }
};

// Stagger children
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};
```

---

## 22. Changelog

### v1.0 (Current - December 2024)
- ✅ Full onboarding flow (splash → home)
- ✅ Core learning loop (attempt → evaluation → answer)
- ✅ Streak tracking system
- ✅ Badge system with auto-check
- ✅ Premium pricing (Solo + Family plans)
- ✅ Paywall system (upgrade prompts)
- ✅ Parent Dashboard
- ✅ Guardian Guidance (settings, friction, weekly report preview)
- ✅ Family Leaderboard
- ✅ Family invite system (8-char codes, OTP input)
- ✅ Nudge notifications (in-app banners)
- ✅ Account type selection (student vs parent branching)
- ✅ Grade level integration (AI personalization)
- ✅ Voice input (with waveform)
- ✅ Mastery mode (adaptive practice)
- ✅ Coach tips (retry hints)
- ✅ Dark Focus aesthetic (glassmorphism + purple/cyan accents)
- ✅ Mobile-first responsive design

---

**Document Version**: 1.0  
**Last Updated**: December 13, 2024  
**Status**: ✅ Complete MVP Specification  
**Next Review**: January 2025 (post-launch retrospective)
