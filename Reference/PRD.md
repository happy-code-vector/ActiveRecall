# **THINKFIRST — FULL PRODUCT REQUIREMENTS DOCUMENT (PRD)**

# **Dark Focus Edition (Developer Build Version \+ High-Energy Brand Copy)**

# **Version 1.0**

---

# **1\. PRODUCT SUMMARY**

ThinkFirst is a high-performance learning app that forces your brain to turn on before AI steps in. Students type their understanding first → AI evaluates → only then does the answer unlock.

This is **the opposite of cheating**.  
 This is **AI for thinkers**.

The aesthetic:  
 **“Late-night study grind” × “Terminal interface” × “Neon intelligence glow.”**  
 Think Discord meets VS Code, running at 2am.

Designed for:

* **Gen Z / Gen Alpha students** (primary)

* **Parents who want honest learning** (buyers)

## **Motion & Animation Documentation**

### **1.1 Motion Principles**

* Purposeful only — every animation should communicate state change, not decorate.

* Calm and quick — no bouncy or “playful” motion.

* Consistent timings:

  * **Fast:** 150–180 ms (taps, ripple feedback)

  * **Standard:** 220–260 ms (screen transitions, cards)

  * **Slow:** 300–350 ms (unlock animation, streak progress)

Use **easeInOut** curves for nearly everything.

---

### **1.2 Screen Transitions**

**Pattern:** slide \+ fade

* Navigation push (forward: Home → Attempt, Attempt → Evaluation, etc.)

  * Content slides in from the right by 16–24 px

  * Opacity from 0 → 100%

  * Duration: **220 ms**

* Navigation pop (back)

  * Content slides right 16–24 px

  * Opacity 100% → 0

  * Duration: **200 ms**

No zooming or overshoot.

---

### **1.3 Buttons and Taps**

* On tap down:

  * Scale: 100% → 97%

  * Duration: **80 ms**

  * Slight darkening of background (5–8%)

* On release:

  * Scale: 97% → 100%

  * Duration: **80 ms**

Applies to:

* Primary CTAs

* Secondary buttons

* Chips (optional, can just use color flash)

---

### **1.4 Loading / AI Evaluation**

When the user submits an attempt:

**State:** “Evaluating your attempt…”

* Fade out keyboard (if visible): 150 ms

* Fade in loading row:

  * Simple dot or pulse animation (3 dots or single bar)

  * Pulse cycle: 800 ms, infinite until response

  * Text appears with fade-in: “Evaluating your attempt…” (150 ms)

When response arrives:

* Loader fades out: 150 ms

* Evaluation content fades \+ slides up 12 px into place: 220 ms

No spinners rotating aggressively; aim for a soft pulse.

---

### **1.5 Unlock Animation**

This is the signature motion of the app.

When the user taps **“Unlock Explanation”**:

1. Lock icon:

   * Rotation: 0° → \-12° → 0° (subtle)

   * Shackle moves up 4 px (unlocks)

   * Duration total: **300 ms**

2. Background behind lock:

   * Slight glow (opacity 0 → 50% → 0\)

   * Duration: **250 ms**

3. Answer section:

   * Card below lock blurs in very lightly (optional)

   * Slide up 16 px and fade 0 → 100%

   * Duration: **260 ms**

No sound, no confetti. Feels like a calm but meaningful unlock.

---

### **1.6 Streak Animations**

* When streak increases:

  * Streak pill scales 100% → 110% → 100%

  * Opacity flash: 70% → 100% → 70%

  * Duration: **350 ms** total

  * Tiny spark or highlight on the flame icon (optional)

* If streak resets (don’t over-dramatize):

  * Quick fade of previous count: opacity 100% → 0% (200 ms)

  * New count fades in (0 → 100%) with no shake, no red color.

---

### **1.7 Error / Validation Feedback**

Examples: too short attempt, network failure.

* For minor validation (attempt too short):

  * Text hint appears with fade-in \+ 4 px upward motion (150 ms)

  * No shake motion (avoid feeling punitive).

* For serious errors (network):

  * Toast at top or bottom:

    * Slide from 8 px up/down \+ fade in: 200 ms

    * Auto-dismiss after 3 seconds with fade-out: 150 ms

Colors: use subtle amber, not harsh red, unless data loss.

---

### **1.8 Chip Interactions (Example Questions)**

* On tap:

  * Background color increases by \~15%

  * Text goes to 100% opacity

  * Optionally scale to 97% then back to 100% (80 ms each)

* When chip populates the main input:

  * Input field content crossfades: old text → new example text (150 ms)

---

### **1.9 Parent Dashboard & Charts**

* Graph/metric cards:

  * On load: values “count up” numerically (0 → actual value) over 400–600 ms

  * Line chart animates from left to right (stroke draw) over 350 ms

Keep motion subtle; these are informational screens.

### **1.10 Feature-Specific Micro-Animations**

* **Mastery Mode Toggle:**  
  * **Trigger:** Toggle ON.  
  * **Effect:** Switch slides right \+ color crossfades Cyan $\\to$ Safety Orange.  
  * **Particle:** Tiny "heat shimmer" particles emit for 0.5s.  
* **Badge Unlock Modal:**  
  * **Trigger:** Badge earned.  
  * **Effect:** 3D asset scales 0% $\\to$ 110% $\\to$ 100%. Radial glow rotates behind it (Infinite loop).  
* **Paywall Toggle:**  
  * **Trigger:** Switching Student $\\leftrightarrow$ Parent.  
  * **Effect:** The background pill **slides** behind the text (do not fade). The card below performs a "Flip" or "Slide Up" transition.

---

# **2\. PRODUCT PHILOSOPHY**

Other AI apps give answers instantly.  
 ThinkFirst does this instead:

**“You explain first. Then I help you unlock the truth.”**

This creates:

* Retrieval practice

* Deep learning

* Effort-driven mastery

* Anti-dependency on AI

ThinkFirst is not a homework tool.  
 It is a **cognitive training engine**.

---

# **3\. CORE EXPERIENCE**

## **3.1 Learning Cycle (“The Loop”)**

Every session revolves around the **Magic Loop**:

1. User asks a question

2. User explains the concept in their own words

3. AI evaluates Effort \+ Understanding

4. Lock opens → Final answer appears

5. Streak increases

6. Optional Mastery Mode → Double streak rewards

The core mechanic must be:

* Fast

* Fluid

* Addictive

* Visually cinematic

Unlocking the answer is the **emotional high**.

---

# **4\. USER SEGMENTS**

## **4.1 Students (Primary User)**

Identity:  
 “I’m trying to learn, improve, and build discipline.”

What they value:

* Deep learning

* A challenge

* A mastery path

* A serious tool that respects their intelligence

## **4.2 Parents (Buyer \+ Support Role)**

Identity:  
 “I want my kids to understand, not copy.”

What they value:

* Honest effort

* Healthy AI usage

* Insights into progress (NOT surveillance)

* Multi-child access

* Fair pricing

---

# **5\. SUBSCRIPTION MODEL**

ThinkFirst uses **two completely different premium products**:

---

## **5.1 Student Plan (Individual License)**

Price:

* $9.99/mo

* $59.99/yr

Features:

* Unlimited Unlocks

* Advanced AI Feedback

* Streak Freezes

* Offline Access

* Priority Support

* Mastery Mode \+ 2× Streak Rewards

Students pay directly.

---

## **5.2 Guardian Plan (The Harmony Tier)** 

**Price:** $16.99/mo | $99/yr **Target:** Parents who want to support habits without policing every interaction. **Includes:** Everything in Student Plan **PLUS**:

* **Up to 5 Family Seats:** One subscription covers the whole household. \* **Local Guardian Mode:** PIN-protected settings on the student's device for managing difficultly locks.  
* **Integrity Reporting:** Weekly email summaries highlighting effort trends and "Mode Switches" (when the student opted out of difficulty).  
* **Friction Controls:** Parents can enable "Soft Locks" (Interstitials) that encourage students to stick with Mastery Mode without technically blocking them.  
* **Family Streak Goals (Squad Mode):** A collaborative streak counter. If all linked family members complete at least one session on the same day, the "Family Streak" increases. This gamifies shared accountability. \* **Shared Freeze Pool:** A communal bank of 5 Streak Freezes per month. If a student misses a day, they can "borrow" a freeze from the family pool, which notifies the group—encouraging communication rather than punishment.

---

## **5.3 Consumables**

### **Streak Freeze**

* Used automatically when a day is missed

* Students get 1 per month free

* Premium users get 3 per month

* Extra freezes purchasable

**5.4 Badges & Achievement System** **Grid Content (20 Icons Total)**

**Chip A: Streaks (Theme: Magma Orange → Blue Heat)**

1. **Ignition (3 Days):** A single matchstick striking a spark.  
2. **The Furnace (7 Days):** Industrial furnace door glowing orange.  
3. **Momentum (14 Days):** Heavy flywheel spinning with green motion blur.  
4. **Blue Giant (30 Days):** Massive star burning with intense blue/white light.  
5. **The Century (100 Days):** The number "100" chiseled out of Platinum.  
6. **The Reboot:** A "System Restore" pixelated phoenix feather (Awarded for using a Streak Freeze).

**Chip B: Mastery (Theme: Electric Violet → Neon Pink)** 

7\. **Synapse:** Two neural nodes connecting with an electric zap (First High Effort). 

8\. **Deep Dive:** Futuristic diving helmet looking into the void (Perfect Score). 

9\. **Vanguard:** Tactical helmet with red visor (Unlocked in Mastery Mode). 

10\. **The Architect:** Glowing wireframe cube/tesseract (Perfect Structure). 

11\. **The Polymath:** Glass prism refracting light (5 different subjects). 

12\. **Night Shift:** Neon crescent moon with sunglasses (High effort after 11 PM). 

13\. **The Refiner:** Laser cutter working on rock (Edited attempt 3+ times).

**Chip C: Milestones (Theme: Chrome → Gold → Obsidian)** 

14\. **The Initiate:** Rough stone key (1st Unlock). 

15\. **The Apprentice:** Bronze gear (10 Unlocks). 

16\. **The Operator:** Chrome mechanical heart (50 Unlocks). 

17\. **The Veteran:** Gold Obelisk (100 Unlocks). 

18\. **The Apex:** Obsidian diamond with purple inner light (500 Unlocks). 

19\. **The Archivist:** Glowing server rack (Saved 20 items to History). 

20\. **Early Riser:** Digital sun rise over grid horizon (Unlock before 8 AM).

---

# **6\. APP STRUCTURE**

Everything revolves around **four core screens**:

1. **Dashboard (Home)**

2. **Attempt Gate**

3. **Evaluation**

4. **Unlock Answer**

5. **Progress Journey (Streak Timeline)**

All screens use the **Dark Focus System**.

---

# **7\. DESIGN SYSTEM — DARK FOCUS**

## **7.1 Colors**

* Background: **Void Grey (\#121212)**

* Text: **Ghost White (\#EDEDED)**

* AI / Unlocks: **Electric Violet (\#8A2BE2)**

* Success / Effort: **Cyber Mint (\#00FF94)**

* Warnings / Nudges: **Safety Orange (\#FF5F1F)**

## **7.2 Visual Identity**

* Neon edge glows

* Subtle gradients

* 1–3px borders

* Soft ambient purples behind cards

* “Terminal / Editor / Night Mode” vibe

## **7.3 Haptic Feedback Strategy (Taptic Engine)**

* **Input Tick:** Very light, subtle tick when typing characters (Optional toggle).  
* **Unlock Thud:** A distinct "Heavy" impact when the Lock icon opens (Success moment).  
* **Mastery Rev:** A "Revving" vibration texture when Mastery Mode is toggled ON.  
* **Error Shake:** A sharp "Warning" double-tap if the user tries to submit \<10 words.

---

# **8\. ONBOARDING — “THE SPEED RUN”**

Goal:  
Get user to their first **unlock** within 30–45 seconds.

## **Screen 1 — Identity**

* Big cards:  
   **I am a Student** (Blue Brain Icon)  
   **I am a Parent** (Amber Shield Icon)

* Selected card glows **Electric Violet**

**Onboarding (Parent vs Child)**

* Feature: Add account type selection at start of onboarding to branch student vs parent flows. Students proceed through grade selection (required for AI personalization), while parents skip directly to dashboard since grade is stored per-child on student accounts. This eliminates confusion when parents have multiple children in different grades and ensures only learners set learning preferences.

## **Screen 2 — Ambition**

“What's your main focus?”

Selectable pills:

* Ace Exams

* Build Habits

* Stop Cheating

Active pill \= **Solid Electric Violet**

## **Screen 3 — Method**

Visual:  
 Robot handing homework → Red X  
 Brain glowing with AI link → Green Check

Copy:

“Other AIs think for you.  
 We make sure *you* think first.”

## **Screen 4 — Interactive Demo**

Simulated question → user taps Unlock → screen flashes Cyber Mint  
 Badge appears: “Effort Score: High”

This is the **Magic Moment** preview.

## **Screen 5 — Segmented Paywall**

Toggle:  
 **For Students | For Parents**

* Student Plan card OR

* Family Plan card

Students get **Ask Parent to Pay** link.

---

# **9\. MAIN APP FLOWS**

## **9.1 Dashboard**

Figma Prompt:

“Mobile UI, dark mode. Center: glowing input field with purple halo. Placeholder text: ‘What are we learning tonight?’ Top right: Streak flame icon. Bottom: horizontal scroll of ‘Starter Quests’ like ‘Explain Photosynthesis’.”

**Clipboard Detection:** When the app opens, check if the clipboard contains text.

**The UI:** If text is detected, display a pill above the keyboard: *"Paste from Clipboard: 'What is the mitochond...'"*

**Action:** Tapping the pill instantly fills the input field.

---

## **9.2 Attempt Gate (Challenge Mode)**

Figma Prompt:

“Dark interface. Question at top in bright white. Center input zone in semi-transparent violet glass. Label: ‘Prove you know this.’ Cursor blinks Electric Violet. Hint bubble in neon blue: ‘Just give me the gist…’”

Contains **Mastery Mode Toggle**:

* Standard

  * Cool Cyan glow

  * “Effort: Normal · Reward: 1× Streak”

* Mastery Mode

  * Deep Red / Safety Orange highlight

  * Micro flames or heat shimmer

  * “Effort: High · Reward: 2× Streak \+ Gold Badge”

**Voice Input Integration**

* **Visual:** A circular "Mic" icon floating inside the right side of the input field (Color: Ghost White).  
* **Interaction:**  
  * **Tap:** Toggles native dictation keyboard.  
  * **Active State:** The input field border glows **Electric Violet** while recording.  
  * **Post-Record:** Text auto-populates the field. User must review and tap "Unlock" manually (prevents accidental submissions).

**Voice Input Logic (The "Review" Step)**

* **State 1 (Recording):** User holds or taps mic. Waveform animates Electric Violet.  
* **State 2 (Review):** Recording stops. Text is transcribed into the input field.  
* **Critical UI:** The "Unlock" button does **NOT** auto-submit. It changes to a "Review" state.  
* **User Action:** User *must* manually read the text and tap "Unlock" explicitly. This prevents frustration from bad transcription.

*Add a "Revision Mode" state to the Attempt Gate.*

**State: Revision Mode (Returning User)**

* **Input Field:** Pre-filled with the user's previous draft (Do NOT clear text).

**Coach Tip (New UI Element)**

* **Visual:** A dismissible "sticky note" or banner appearing just above the keyboard.  
* **Content:** Displays a **short, guiding question** from the evaluation.  
  * *Constraint:* Max 2 lines of text. No definitions.  
  * *Example:* "Coach: You identified the output (Oxygen), but what acts as the 'fuel' for this process?"  
* **Color:** Electric Violet text on a dark glass background.  
* **Microcopy:** The placeholder text changes to: *"Add a bit more detail..."*

---

## **9.3 Evaluation Screen**

Figma Prompt:

“Holographic 3D lock snaps open. Two progress rings: Effort (Cyber Mint) and Understanding (Electric Violet). Slide-up card shows bullet lists: ‘What you nailed’ and ‘What’s missing.’”

**State: Low Effort / Incomplete**

**Change the logic for when `unlock = false`**

* **Primary Button:** Changes from "Unlock Explanation" (Disabled) to **"Refine My Answer"** (Active, glowing Safety Orange).  
* **Action:** Tapping this returns the user to the Attempt Gate.  
* **Data Transfer:** Passes the specific *'What is missing'* bullet point back to the input screen.

**The "Mercy" Protocol (Surrender State)**

* **Trigger:** If a user fails the evaluation loop 2 times in a row OR taps a small "I'm Stuck" text link.  
* **The Modal:** A warning appears: "Reveal answer? You will earn **0 Streak Points** for this session."  
* **Guardian Override:** If Guardian Mode is active, this button requires the PIN to activate.  
* **Outcome:** Answer is revealed, but the background is desaturated (Grey), and no "Success" animation plays.

---

## **9.4 Unlock Answer Screen**

Displays:

* Student's attempt summary

* Final AI explanation

* Follow-up prompts

* Mastery Mode badge if earned

* “Save to History” button

---

## **9.5 Progress Journey**

Figma Prompt:

“Vertical timeline. Past days \= solid green nodes. Missed days \= red X. Today \= pulsing white node. Every 7 days \= milestone badge.”

## **9.6 Detailed Interaction Logic & Behavior**

**9.6.1 Home Screen Logic**

* **Hesitation Handler:** If the user focuses on the input field but does not type for **3 seconds**, fade in a subtle hint beneath the input: *"You can ask about anything you’re curious about."*  
* **Chip Interaction:** Tapping a "Starter Quest" chip immediately populates the input field and auto-focuses the cursor at the end of the text.

**9.6.2 Attempt Gate Logic**

* **Idle Timer:** If the user stays on this screen for **5 seconds** without typing, trigger the "Hint Bubble" animation near the cursor.  
* **Minimum Viable Attempt:**  
  * **Rule:** Input must be \>10 words to enable the "Unlock" button.  
  * **Validation:** If the user tries to submit \<10 words, the button performs a "Check/Shake" animation (10px horizontal shake), and a toast appears: *"Add a bit more detail so I can understand you."*  
* **Mastery Mode Logic:**  
  * **Toggle OFF:** Threshold is standard (low detail accepted).  
  * **Toggle ON:** Threshold increases. If the AI detects "Low Effort" while Mastery is ON, it returns a specific prompt: *"Mastery Mode is active. Dig deeper to earn the badge."*

**9.6.3 Evaluation & Unlock Logic**

* **Loading State:** When "Submit" is tapped, fade out the keyboard immediately. Show a pulse animation (not a spinner). Text cycles: *"Reading..."* $\\to$ *"Analyzing structure..."* $\\to$ *"Evaluating effort..."*  
* **Unlock Success:**  
  * **If Unlock \= True:** The "Unlock Explanation" button becomes active (Solid Electric Violet).  
  * **If Unlock \= False:** The button remains disabled. A specific coaching tip appears in Safety Orange: *"You're close. Try adding an example."*  
* **Back Navigation:** If the user taps "Back" during the API call, cancel the request but **preserve their text draft** so they don't lose progress.

**Dynamic Loading States:** Instead of a generic "Loading...", cycle through specific action verbs every 1.5 seconds to keep the user watching:

1. *"Reading your attempt..."*  
2. *"Analyzing logic..."*  
3. *"Checking accuracy..."*  
4. *"Unlocking..."*  
* **Why:** This gamifies the wait time and assures the user that the AI is actually *thinking*, not just lagging.

**9.6.4 Paywall Logic (The "Choose Your Path" Trigger)**

* **Trigger Event:** Occurs immediately when a Free User attempts their **6th unlock** of the day.  
* **The Modal:**  
  * Present the **"Segmented Toggle"** Paywall (Student vs. Parent).  
  * **Default Selection:** Defaults to "Student" tab.  
  * **Behavior:** If the user closes the Paywall without paying, return them to the Evaluation screen with the "Unlock" button disabled/locked.

**9.6.5 Error Handling**

* **Network Failure:** If the API fails, show a non-intrusive toast at the bottom: *"Connection slipped. Tap to retry."* (Do not clear the user's text input).  
* **Nonsense Detection:** If the AI detects keyboard smashing (e.g., "asdfasdf"), return a specific error: *"Type a real explanation to unlock the answer."*

***9.7 Viral Sharing & Social Export***

* ***Trigger:** Occurs when a user earns a **Badge** or hits a **7-Day Streak**.*  
* ***The Asset:** The app auto-generates a high-fidelity image (1080x1920) optimized for Instagram Stories/TikTok.*  
  * ***Visual:** Black background, the 3D Badge floating in the center, neon text: "I unlocked \[Badge Name\] on ThinkFirst."*  
  * ***Watermark:** Subtle "ThinkFirst" logo and App Store QR code at the bottom.*  
* ***UX:** A "Share" button appears on the Reward Modal. Tapping it opens the native iOS Share Sheet (Instagram, Save Image, Message).*

---

# **10\. GUARDIAN MODE (Local Accountability)**

10\. GUARDIAN CONTROLS & LINKING

## **10.1 The "Invite Code" System (No Passwords)**

Instead of full account management, we use a lightweight linking system:

* **Parent Action:** Purchases Family Plan $\\to$ App generates a static 6-character code (e.g., "FAM-882").  
* **Student Action:** Settings $\\to$ "Join Family Squad" $\\to$ Enters Code.  
* **Backend Logic:** The code links the Student's userId to the Parent's subscription\_id in Supabase.

## **10.2 Local Guardian Controls**

* **Access:** Profile to Guardian Settings (PIN Locked).  
* **Features:**  
  * **Force Mastery Mode:** Disables the difficulty toggle (Student cannot switch to Standard).  
  * **Block Mercy Button:** Disables the "Reveal Answer" option.  
  * **Email Reports:** Configured locally on the device to push weekly summaries to the parent's email.

---

# **11\. MASTER FEATURES**

## **11.1 Mastery Mode (Student Empowerment)**

Students manually opt into “Mastery Mode” per question.

Rewards:

* 2× Streak

* Gold Badge

* Special visual unlock

Requirements:

* Higher effort threshold

* Example-based reasoning

* Clearer articulation

Mastery Mode \= “Ranked Mode for learning.”

### **11.1.1 Accountability Logic**

* **Standard Behavior:** Student toggles Mastery Mode OFF $\\to$ Mode switches instantly.  
* **Guardian Behavior:** Student toggles Mastery Mode OFF $\\to$ **Friction Modal** appears.  
  * **Stay:** User remains in Mastery Mode.  
  * **Switch:** User enters Standard Mode; session flagged as "Low Rigor" in database.

---

## **11.2 Streak Freezes**

If a student misses a day:

* Streak Freeze activates  
* Saves streak  
* Gamifies consistency  
* Premium users get 3/month  
* Students get 1/month  
* Extras purchasable

## **11.2.1 Streak Logic**

* **The "Student Clock" (3 AM Rule):**  
  * **Logic:** The daily streak does **not** reset at midnight (00:00).  
  * **Reset Time:** Streaks reset at **3:00 AM local time**.  
  * **Reasoning:** Accommodates late-night study sessions without penalizing the user for crossing the midnight threshold.

## **11.3 Audio Interaction Constraints (MVP)**

* **Input Only:** The app supports **Speech-to-Text (STT)** at the Attempt Gate to reduce input friction.  
* **No Native TTS:** The app **does not** utilize Text-to-Speech (TTS) for the AI response. All evaluations and answers are delivered as text to enforce reading and retention.  
* **Accessibility:** Standard OS-level screen readers (VoiceOver/TalkBack) remain supported for accessibility compliance.

---

# **12\. LLM EVALUATION ENGINE**

Input:

* question

* attempt

Output JSON:

* effort\_score (0–3)

* understanding\_score (0–3)

* reasoning\_quality

* what\_you\_got\_right

* what\_you\_missed

* unlock\_flag \= true/false

* Mastery\_mode\_flag

## **12.1 System Prompt Constraints (The "Socratic" Rule)**

* **Constraint:** The AI is strictly forbidden from providing the missing keywords or definitions in the feedback.  
* **Personality:** The AI acts as a Socratic tutor, not a Wikipedia summarizer.  
* **Logic:**  
  * **Bad Output:** "You missed mentioning Glucose and Carbon Dioxide." (Too helpful).  
  * **Required Output:** "You mentioned 'food' generally. Can you identify the specific sugar plants create?" (Forces recall).  
* **Length:** The `what_you_missed` field must be limited to **1–2 sentences maximum**.

## **12.2 Cost Optimization Strategy (Dynamic Routing)** 

To maintain \>70% gross margins, the app utilizes a split-model strategy:

* **Phase 1 (Evaluation \- The Judge):** Uses **GPT-4o-mini**.  
  * **Task:** Grades Effort (0-3), Understanding (0-3), and checks for copy-paste.  
  * **Input:** Includes `{user_grade_level}` to adjust scoring strictness.  
  * **Reasoning:** High speed, negligible cost (\<$0.001/call).  
* **Phase 2 (Unlock \- The Tutor):** Uses **GPT-4o**.  
  * **Task:** Generates the final "Mastery Explanation" and "Level Up Tips."  
  * **Reasoning:** Provides the "premium" feeling of a high-intelligence tutor.  
* **Fair Use Cap:** If a Family Account exceeds 150 Unlocks/month, the *Phase 2* model silently switches to `gpt-4o-mini` until the next billing cycle.

---

# **13\. DATABASE MODEL**

Tables:

### **users**

* id

* type (student / parent)

* subscription\_tier

* family\_id

### **attempts**

* user\_id

* question

* attempt

* scores

* mastery\_mode\_used

* timestamp

### **streaks**

* user\_id

* current\_streak

* last\_active\_date

### **family\_accounts**

* parent\_id

* child\_user\_ids

---

# **14\. PAYWALL REQUIREMENTS**

Matches your screenshot:

### **Top Segmented Toggle:**

**For Students | For Parents**

### **Student Plan Card:**

* $59.99/year

* Unlimited Unlocks

* AI Feedback

* Streak Freezes

* Offline Access

* Priority Support

### **Parent Plan Card:**

* $99/year

* All student features

* Family seats

* Parent Dashboard

* Family challenges

* Family Streak Freezes

**Mandatory Compliance Links:** At the very bottom of the Paywall (small text, opacity 50%):

* "Restore Purchases" (Must be functional).  
* "Terms of Service" (Link to website).  
* "Privacy Policy" (Link to website).

**Family Plan Disclosure:** If selling the Family Plan, the text must explicitly state: *"Subscription automatically renews unless turned off in Account Settings at least 24 hours before end of current period."*

---

# **15\. NOTIFICATION SYSTEM**

Day 1 Nudges:

* “Nice effort today. Want to try one more?”

* “Your streak starts now.”

* “Still time to lock in Day 1.”

Day 2:

* “Let's build Day 2.”

* “One explanation is all it takes.”

Mastery Mode Nudges:

* “Go Mastery — double your streak tonight?”

**15.3 App Store Review Strategy**

* **The "High-Moment" Trigger:** The native iOS Review Prompt (`SKStoreReviewController`) must ONLY trigger when:  
  1. The user successfully unlocks an answer.  
  2. **AND** received a "High Effort" score.  
  3. **AND** it is at least their 3rd successful session.  
* **Logic:** This ensures we only ask happy, successful users who are feeling smart.  
* **Frequency:** Maximum once per version update (Apple standard).

---

# **16\. ANALYTICS & SUCCESS METRICS**

Success \=  
 Percentage of new users who complete **one full unlock** within 60s.

Other KPIs:

* Day 2 retention

* Week 1 streaks

* Mastery Mode adoption

* Conversion (Student vs Parent)

---

# **17\. ROADMAP (8 Weeks)**

Weeks 1–2: Infra \+ Onboarding  
 Weeks 3–4: Attempt Gate \+ Evaluation Engine  
 Weeks 5–6: Paywall \+ Family Accounts \+ Mastery Mode  
 Weeks 7: Streak Freeze \+ Progress Timeline  
 Weeks 8: Polish \+ QA \+ Launch

---

# **\================================================**

