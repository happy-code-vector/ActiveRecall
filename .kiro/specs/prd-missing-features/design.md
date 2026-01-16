# Design Document: PRD Missing Features Implementation

## Overview

This design document outlines the architecture and implementation approach for all missing features identified in the ThinkFirst PRD gap analysis. The implementation spans frontend components, utility functions, API integrations, and database schema updates to achieve full PRD compliance.

## Architecture

The implementation follows the existing React/Next.js architecture with the following layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components Layer                       │
│  (BadgeUnlockModal, ClipboardPill, LoadingStates, etc.)     │
├─────────────────────────────────────────────────────────────┤
│                    State Management Layer                    │
│  (App.tsx state, localStorage, Context providers)           │
├─────────────────────────────────────────────────────────────┤
│                    Utilities Layer                           │
│  (streakFreeze.ts, badges.ts, haptics.ts, validation.ts)    │
├─────────────────────────────────────────────────────────────┤
│                    API Integration Layer                     │
│  (Supabase Edge Functions, OpenAI API routing)              │
├─────────────────────────────────────────────────────────────┤
│                    Database Layer                            │
│  (Supabase PostgreSQL - users, streaks, badges, families)   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Streak Freeze System

```typescript
// Web/src/utils/streakFreeze.ts
interface StreakFreezeState {
  personalFreezes: number;
  familyPoolFreezes: number;
  lastFreezeGrantDate: string;
  freezeHistory: FreezeEvent[];
}

interface FreezeEvent {
  type: 'granted' | 'consumed' | 'borrowed';
  timestamp: string;
  source: 'personal' | 'family_pool';
}

interface StreakResetConfig {
  resetHour: number; // 3 for 3 AM
  timezone: string;
}
```

### 2. Badge System

```typescript
// Web/src/utils/badgeDefinitions.ts
interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: 'streaks' | 'mastery' | 'milestones';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'obsidian';
  icon: string;
  criteria: BadgeCriteria;
  theme: BadgeTheme;
}

interface BadgeCriteria {
  type: 'streak_days' | 'unlock_count' | 'effort_score' | 'time_based' | 'special';
  threshold?: number;
  condition?: string;
}

interface BadgeTheme {
  primaryColor: string;
  glowColor: string;
  gradient: string;
}
```

### 3. Clipboard Detection

```typescript
// Web/src/hooks/useClipboard.ts
interface ClipboardState {
  hasText: boolean;
  text: string | null;
  truncatedText: string | null;
}
```

### 4. Loading States

```typescript
// Web/src/components/EvaluationLoadingState.tsx
interface LoadingMessage {
  text: string;
  duration: number; // ms
}

const LOADING_MESSAGES: LoadingMessage[] = [
  { text: "Reading your attempt...", duration: 1500 },
  { text: "Analyzing logic...", duration: 1500 },
  { text: "Checking accuracy...", duration: 1500 },
  { text: "Unlocking...", duration: 1500 },
];
```

### 5. Haptic Feedback

```typescript
// Web/src/utils/haptics.ts
type HapticPattern = 'tick' | 'heavy' | 'revving' | 'warning';

interface HapticConfig {
  enabled: boolean;
  patterns: Record<HapticPattern, number[]>;
}
```

### 6. Invite Code System

```typescript
// Web/src/utils/inviteCode.ts
interface InviteCode {
  code: string; // Format: "FAM-XXX"
  parentUserId: string;
  subscriptionId: string;
  createdAt: string;
  linkedAccounts: string[];
  maxAccounts: number; // 5
}
```

### 7. Guardian Mode

```typescript
// Web/src/utils/guardianMode.ts
interface GuardianSettings {
  pinHash: string;
  forceMasteryMode: boolean;
  blockMercyButton: boolean;
  frictionInterstitials: boolean;
  requireReason: boolean;
  reportEmail: string;
}
```

## Data Models

### Database Schema Updates

```sql
-- Streak Freezes Table
CREATE TABLE streak_freezes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  personal_freezes INTEGER DEFAULT 0,
  family_pool_contribution INTEGER DEFAULT 0,
  last_grant_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Freeze Events Table
CREATE TABLE freeze_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  family_id UUID REFERENCES family_accounts(id),
  event_type VARCHAR(20), -- 'granted', 'consumed', 'borrowed'
  source VARCHAR(20), -- 'personal', 'family_pool'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Badges Table
CREATE TABLE badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  category VARCHAR(20),
  tier VARCHAR(20),
  icon_url TEXT,
  criteria JSONB,
  theme JSONB
);

-- User Badges Table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  badge_id VARCHAR(50) REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Family Accounts Table (enhanced)
ALTER TABLE family_accounts ADD COLUMN invite_code VARCHAR(7) UNIQUE;
ALTER TABLE family_accounts ADD COLUMN shared_freeze_pool INTEGER DEFAULT 5;
ALTER TABLE family_accounts ADD COLUMN monthly_unlock_count INTEGER DEFAULT 0;

-- Guardian Settings Table
CREATE TABLE guardian_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pin_hash VARCHAR(255),
  force_mastery_mode BOOLEAN DEFAULT FALSE,
  block_mercy_button BOOLEAN DEFAULT FALSE,
  friction_interstitials BOOLEAN DEFAULT TRUE,
  require_reason BOOLEAN DEFAULT TRUE,
  report_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Attempts Table (enhanced)
ALTER TABLE attempts ADD COLUMN mastery_mode_used BOOLEAN DEFAULT FALSE;
ALTER TABLE attempts ADD COLUMN edit_count INTEGER DEFAULT 0;
ALTER TABLE attempts ADD COLUMN is_nonsense BOOLEAN DEFAULT FALSE;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Streak Freeze Consumption
*For any* user with personalFreezes > 0 who misses a day (no activity between 3 AM boundaries), consuming a freeze should result in personalFreezes decreasing by exactly 1 and streak count remaining unchanged.
**Validates: Requirements 1.1, 1.6**

### Property 2: Streak Freeze Grant
*For any* user at the start of a new monthly cycle, free users should receive exactly 1 freeze and premium users should receive exactly 3 freezes.
**Validates: Requirements 1.2, 1.3**

### Property 3: Family Freeze Pool Borrowing
*For any* family plan user with personalFreezes = 0 and familyPoolFreezes > 0, borrowing should decrease familyPoolFreezes by 1 and preserve the user's streak.
**Validates: Requirements 1.4, 1.5**

### Property 4: Badge Award Criteria
*For any* user meeting a badge's criteria (e.g., streak_days >= threshold), the badge should be awarded exactly once and appear in their earned badges list.
**Validates: Requirements 2.1-2.20**

### Property 5: Clipboard Detection State
*For any* clipboard state, if clipboard contains text then hasText should be true and truncatedText should be the first 50 characters; otherwise hasText should be false.
**Validates: Requirements 3.1, 3.3**

### Property 6: Clipboard Paste Action
*For any* clipboard with text content, tapping the clipboard pill should result in the input field value equaling the full clipboard text.
**Validates: Requirements 3.2**

### Property 7: Loading Message Cycling
*For any* evaluation submission, loading messages should cycle through the defined sequence at 1.5-second intervals until response arrives.
**Validates: Requirements 4.1, 4.2**

### Property 8: Word Count Validation
*For any* attempt text, if word count < 10 then the submit button should be disabled and validation should fail.
**Validates: Requirements 5.1, 5.3**

### Property 9: Haptic Feedback Triggers
*For any* haptic-enabled device, the correct vibration pattern should be triggered for each interaction type (tick for typing, heavy for unlock, revving for mastery toggle, warning for validation failure).
**Validates: Requirements 6.1-6.4**

### Property 10: Invite Code Format
*For any* generated invite code, it should match the pattern /^FAM-[A-Z0-9]{3}$/ and be unique across all family accounts.
**Validates: Requirements 7.1**

### Property 11: Family Account Linking
*For any* valid invite code with fewer than 5 linked accounts, entering the code should successfully link the student account to the family subscription.
**Validates: Requirements 7.3, 7.5**

### Property 12: Guardian PIN Protection
*For any* guardian settings access after initial setup, the correct PIN must be provided to view or modify settings.
**Validates: Requirements 8.1, 8.2**

### Property 13: Force Mastery Mode
*For any* student with forceMasteryMode enabled by guardian, the Mastery Mode toggle should be disabled and locked to ON state.
**Validates: Requirements 8.3**

### Property 14: Block Mercy Button
*For any* student with blockMercyButton enabled by guardian, the "I'm Stuck" option should not be visible or accessible.
**Validates: Requirements 8.4, 8.5**

### Property 15: Socratic Feedback Format
*For any* AI-generated "what_is_missing" feedback, the text should contain at least one question mark and should not contain the exact answer keywords from the question.
**Validates: Requirements 9.1, 9.3**

### Property 16: Feedback Length Constraint
*For any* AI-generated feedback, the "what_is_missing" field should contain at most 2 sentences (determined by period count <= 2).
**Validates: Requirements 9.2**

### Property 17: Model Routing - Evaluation Phase
*For any* evaluation API call, the model parameter should be "gpt-4o-mini".
**Validates: Requirements 10.1**

### Property 18: Model Routing - Unlock Phase
*For any* unlock API call where family monthly_unlock_count < 150, the model parameter should be "gpt-4o".
**Validates: Requirements 10.2, 10.3**

### Property 19: Nonsense Detection
*For any* attempt containing keyboard smashing patterns (e.g., repeated adjacent keys, no vowels in 10+ char sequences), the system should return an error and not count the attempt.
**Validates: Requirements 14.1, 14.2**

### Property 20: Animation Duration Compliance
*For any* animation in the system, fast interactions should use 150-180ms, standard transitions should use 220-260ms, and slow animations should use 300-350ms.
**Validates: Requirements 13.1-13.3**

### Property 21: Timeline Node Rendering
*For any* day in the progress timeline, completed days should render as green nodes, missed days as red X nodes, and today as a pulsing white node.
**Validates: Requirements 15.2-15.4**

## Error Handling

### Network Errors
- Display non-intrusive toast: "Connection slipped. Tap to retry."
- Preserve user's text input on retry
- Implement exponential backoff for API retries

### Validation Errors
- Word count < 10: Shake animation + toast message
- Nonsense detection: Specific error message without counting attempt
- Invalid invite code: Clear error message with retry option

### Guardian Mode Errors
- Incorrect PIN: Allow 3 attempts before temporary lockout
- PIN forgotten: Provide recovery flow via email

### Clipboard Errors
- Permission denied: Gracefully hide clipboard pill
- Empty clipboard: Hide clipboard pill without error

## Testing Strategy

### Unit Testing Framework
- **Framework**: Vitest (already configured in project)
- **Coverage Target**: 80% for utility functions

### Property-Based Testing Framework
- **Framework**: fast-check (to be added)
- **Configuration**: Minimum 100 iterations per property test

### Test Categories

1. **Streak Freeze Tests**
   - Unit tests for freeze consumption logic
   - Property tests for 3 AM boundary calculations
   - Integration tests for family pool borrowing

2. **Badge System Tests**
   - Property tests for badge criteria evaluation
   - Unit tests for badge unlock modal rendering
   - Integration tests for badge persistence

3. **Validation Tests**
   - Property tests for word count validation
   - Property tests for nonsense detection patterns
   - Unit tests for haptic feedback triggers

4. **Guardian Mode Tests**
   - Property tests for PIN verification
   - Unit tests for setting enforcement
   - Integration tests for cross-device sync

5. **API Integration Tests**
   - Property tests for model routing logic
   - Unit tests for Socratic feedback constraints
   - Integration tests for evaluation flow

### Test File Structure
```
Web/src/
├── utils/
│   ├── __tests__/
│   │   ├── streakFreeze.test.ts
│   │   ├── streakFreeze.property.test.ts
│   │   ├── badges.test.ts
│   │   ├── badges.property.test.ts
│   │   ├── validation.test.ts
│   │   ├── validation.property.test.ts
│   │   ├── haptics.test.ts
│   │   ├── inviteCode.test.ts
│   │   └── inviteCode.property.test.ts
├── components/
│   ├── __tests__/
│   │   ├── ClipboardPill.test.tsx
│   │   ├── EvaluationLoadingState.test.tsx
│   │   ├── BadgeUnlockModal.test.tsx
│   │   └── GuardianPinModal.test.tsx
```
