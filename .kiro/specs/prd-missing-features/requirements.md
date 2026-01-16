# Requirements Document

## Introduction

This specification covers the implementation of all missing features identified in the ThinkFirst PRD gap analysis. The features span across streak management, badge system, UI/UX enhancements, guardian controls, evaluation engine improvements, and compliance requirements. The goal is to bring the web implementation to full parity with the PRD specification.

## Glossary

- **ThinkFirst**: The learning application that requires users to explain concepts before AI provides answers
- **Streak**: A consecutive day count of user learning activity
- **Streak Freeze**: A consumable item that preserves a streak when a day is missed
- **Mastery Mode**: An optional higher-difficulty mode that rewards 2x streak points
- **Guardian Mode**: Parent-controlled settings that influence student behavior
- **Mercy Modal**: The "I'm Stuck" surrender option that reveals answers without earning points
- **Invite Code**: A 6-character code (e.g., "FAM-882") used to link student accounts to family plans
- **Haptic Feedback**: Device vibration patterns for tactile user feedback
- **Clipboard Detection**: Auto-detection of text in device clipboard for quick input

## Requirements

### Requirement 1: Streak Freeze System

**User Story:** As a student, I want streak freezes to protect my learning streak when I miss a day, so that I don't lose my progress due to occasional missed days.

#### Acceptance Criteria

1. WHEN a user misses a day and has available streak freezes THEN the system SHALL automatically consume one freeze and preserve the current streak count
2. WHEN a free user's monthly cycle begins THEN the system SHALL grant 1 streak freeze
3. WHEN a premium user's monthly cycle begins THEN the system SHALL grant 3 streak freezes
4. WHEN a family plan user misses a day and has no personal freezes THEN the system SHALL allow borrowing from the shared family pool of 5 freezes per month
5. WHEN a family member borrows a freeze THEN the system SHALL notify all family members of the borrowed freeze
6. WHEN the streak reset time is evaluated THEN the system SHALL use 3:00 AM local time instead of midnight

### Requirement 2: Complete Badge System

**User Story:** As a student, I want to earn badges for various achievements, so that I feel rewarded for my learning progress and milestones.

#### Acceptance Criteria

1. WHEN a user maintains a 3-day streak THEN the system SHALL award the "Ignition" badge
2. WHEN a user maintains a 7-day streak THEN the system SHALL award the "The Furnace" badge
3. WHEN a user maintains a 14-day streak THEN the system SHALL award the "Momentum" badge
4. WHEN a user maintains a 30-day streak THEN the system SHALL award the "Blue Giant" badge
5. WHEN a user maintains a 100-day streak THEN the system SHALL award the "The Century" badge
6. WHEN a user uses a streak freeze THEN the system SHALL award the "The Reboot" badge
7. WHEN a user receives their first high effort score THEN the system SHALL award the "Synapse" badge
8. WHEN a user receives a perfect understanding score THEN the system SHALL award the "Deep Dive" badge
9. WHEN a user unlocks an answer in Mastery Mode THEN the system SHALL award the "Vanguard" badge
10. WHEN a user receives a perfect structure evaluation THEN the system SHALL award the "The Architect" badge
11. WHEN a user answers questions in 5 different subjects THEN the system SHALL award the "The Polymath" badge
12. WHEN a user achieves high effort after 11 PM local time THEN the system SHALL award the "Night Shift" badge
13. WHEN a user edits their attempt 3 or more times before submitting THEN the system SHALL award the "The Refiner" badge
14. WHEN a user completes their first unlock THEN the system SHALL award the "The Initiate" badge
15. WHEN a user completes 10 unlocks THEN the system SHALL award the "The Apprentice" badge
16. WHEN a user completes 50 unlocks THEN the system SHALL award the "The Operator" badge
17. WHEN a user completes 100 unlocks THEN the system SHALL award the "The Veteran" badge
18. WHEN a user completes 500 unlocks THEN the system SHALL award the "The Apex" badge
19. WHEN a user saves 20 items to history THEN the system SHALL award the "The Archivist" badge
20. WHEN a user unlocks an answer before 8 AM local time THEN the system SHALL award the "Early Riser" badge
21. WHEN a badge is earned THEN the system SHALL display a modal with 3D asset scaling animation and radial glow effect

### Requirement 3: Clipboard Detection

**User Story:** As a student, I want the app to detect text in my clipboard when I open it, so that I can quickly paste questions I've copied from elsewhere.

#### Acceptance Criteria

1. WHEN the home screen loads and the clipboard contains text THEN the system SHALL display a pill showing truncated clipboard content
2. WHEN the user taps the clipboard pill THEN the system SHALL populate the input field with the clipboard text
3. WHEN the clipboard is empty or contains non-text content THEN the system SHALL hide the clipboard pill

### Requirement 4: Dynamic Loading States

**User Story:** As a student, I want to see engaging loading messages while my attempt is being evaluated, so that I feel the AI is actively processing my response.

#### Acceptance Criteria

1. WHEN an attempt is submitted THEN the system SHALL display cycling loading messages every 1.5 seconds
2. WHEN displaying loading messages THEN the system SHALL cycle through: "Reading your attempt...", "Analyzing logic...", "Checking accuracy...", "Unlocking..."
3. WHEN the evaluation response arrives THEN the system SHALL fade out the loader and slide up the evaluation content

### Requirement 5: Minimum Viable Attempt Validation

**User Story:** As a student, I want feedback when my attempt is too short, so that I understand I need to provide more detail for a meaningful evaluation.

#### Acceptance Criteria

1. WHEN a user attempts to submit with fewer than 10 words THEN the system SHALL disable the submit button
2. WHEN a user taps submit with fewer than 10 words THEN the system SHALL perform a horizontal shake animation on the button
3. WHEN validation fails due to word count THEN the system SHALL display a toast: "Add a bit more detail so I can understand you."

### Requirement 6: Haptic Feedback

**User Story:** As a student using a mobile device, I want tactile feedback for key interactions, so that the app feels more responsive and engaging.

#### Acceptance Criteria

1. WHEN a user types characters in the input field THEN the system SHALL trigger a light tick vibration if haptics are enabled
2. WHEN the lock icon opens on successful unlock THEN the system SHALL trigger a heavy impact vibration
3. WHEN Mastery Mode is toggled ON THEN the system SHALL trigger a revving vibration pattern
4. WHEN validation fails due to insufficient words THEN the system SHALL trigger a warning double-tap vibration

### Requirement 7: Invite Code System

**User Story:** As a parent with a family plan, I want to generate invite codes for my children, so that they can join my family subscription without complex account management.

#### Acceptance Criteria

1. WHEN a parent purchases a family plan THEN the system SHALL generate a static 6-character invite code in format "FAM-XXX"
2. WHEN a student navigates to "Join Family Squad" in settings THEN the system SHALL display an input field for the invite code
3. WHEN a valid invite code is entered THEN the system SHALL link the student's account to the parent's subscription
4. WHEN an invalid invite code is entered THEN the system SHALL display an error message
5. WHEN a family reaches 5 linked accounts THEN the system SHALL prevent additional accounts from joining

### Requirement 8: Enhanced Guardian Mode

**User Story:** As a parent, I want PIN-protected controls over my child's learning settings, so that I can guide their learning without them bypassing restrictions.

#### Acceptance Criteria

1. WHEN a parent first accesses Guardian Settings THEN the system SHALL prompt for PIN creation
2. WHEN accessing Guardian Settings subsequently THEN the system SHALL require PIN entry
3. WHEN "Force Mastery Mode" is enabled THEN the system SHALL disable the Mastery Mode toggle for the student
4. WHEN "Block Mercy Button" is enabled THEN the system SHALL hide the "I'm Stuck" option from the student
5. WHEN Guardian Mode is active and student attempts Mercy Modal THEN the system SHALL require the guardian PIN to proceed

### Requirement 9: Socratic AI Constraints

**User Story:** As a student, I want the AI to guide me with questions rather than giving away answers, so that I develop deeper understanding through recall.

#### Acceptance Criteria

1. WHEN the AI generates feedback for "what_is_missing" THEN the system SHALL provide guiding questions instead of direct answers
2. WHEN the AI detects missing concepts THEN the system SHALL limit feedback to 1-2 sentences maximum
3. WHEN the AI evaluates an attempt THEN the system SHALL never include the missing keywords or definitions in the feedback

### Requirement 10: Dynamic Model Routing

**User Story:** As a product owner, I want to optimize AI costs while maintaining quality, so that the business remains sustainable.

#### Acceptance Criteria

1. WHEN evaluating an attempt (Phase 1) THEN the system SHALL use GPT-4o-mini for grading effort and understanding
2. WHEN generating the full explanation (Phase 2) THEN the system SHALL use GPT-4o for premium-quality responses
3. WHEN a family account exceeds 150 unlocks per month THEN the system SHALL silently switch Phase 2 to GPT-4o-mini
4. WHEN evaluating attempts THEN the system SHALL include user grade level to adjust scoring strictness

### Requirement 11: Notification System

**User Story:** As a student, I want timely reminders to maintain my learning habit, so that I stay consistent with my practice.

#### Acceptance Criteria

1. WHEN a user completes Day 1 THEN the system SHALL schedule nudge notifications: "Nice effort today. Want to try one more?"
2. WHEN Day 2 begins without activity THEN the system SHALL send: "Let's build Day 2. One explanation is all it takes."
3. WHEN a user has not used Mastery Mode recently THEN the system SHALL send: "Go Mastery — double your streak tonight?"
4. WHEN a user successfully unlocks with high effort on their 3rd+ session THEN the system SHALL trigger the App Store review prompt

### Requirement 12: Paywall Compliance

**User Story:** As a product owner, I want the paywall to meet App Store compliance requirements, so that the app is approved for distribution.

#### Acceptance Criteria

1. WHEN displaying the paywall THEN the system SHALL show a functional "Restore Purchases" link
2. WHEN displaying the paywall THEN the system SHALL show a "Terms of Service" link
3. WHEN displaying the paywall THEN the system SHALL show a "Privacy Policy" link
4. WHEN displaying the Family Plan THEN the system SHALL show auto-renewal disclosure text

### Requirement 13: Animation Timing Compliance

**User Story:** As a user, I want consistent and polished animations, so that the app feels professional and responsive.

#### Acceptance Criteria

1. WHEN performing fast interactions like taps THEN the system SHALL use 150-180ms duration
2. WHEN performing standard transitions like screen changes THEN the system SHALL use 220-260ms duration
3. WHEN performing slow animations like unlock effects THEN the system SHALL use 300-350ms duration
4. WHEN a streak increases THEN the system SHALL animate the streak pill with scale 100% → 110% → 100% over 350ms
5. WHEN Mastery Mode is toggled ON THEN the system SHALL display heat shimmer particle effects for 0.5 seconds

### Requirement 14: Nonsense Detection

**User Story:** As a student, I want the app to detect when I'm not providing a real attempt, so that I'm encouraged to engage meaningfully.

#### Acceptance Criteria

1. WHEN the AI detects keyboard smashing patterns like "asdfasdf" THEN the system SHALL return an error: "Type a real explanation to unlock the answer."
2. WHEN nonsense is detected THEN the system SHALL not count the attempt toward any metrics

### Requirement 15: Progress Timeline

**User Story:** As a student, I want to see a visual timeline of my learning journey, so that I can track my consistency over time.

#### Acceptance Criteria

1. WHEN viewing the progress screen THEN the system SHALL display a vertical timeline with day nodes
2. WHEN a day was completed THEN the system SHALL show a solid green node
3. WHEN a day was missed THEN the system SHALL show a red X node
4. WHEN viewing today THEN the system SHALL show a pulsing white node
5. WHEN a 7-day milestone is reached THEN the system SHALL display a milestone badge on the timeline
