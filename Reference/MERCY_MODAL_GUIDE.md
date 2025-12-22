# 🆘 Mercy Modal - "I'm Stuck" Feature

## Overview
The Mercy Modal is a safety net for students who are completely stuck on a question. It allows them to reveal the answer, but with clear consequences.

## Visual Design
- **Dark glassmorphic card** with orange (#F97316) border glow
- **Warning triangle icon** with pulsing animation
- **Coach tip banner** (optional) attached to the top in purple
- **Clear consequences** listed with icons
- **Two-button hierarchy**: Primary "Keep Trying" and danger "Reveal Answer"

## User Flow

### 1. Student Gets Stuck
On the Attempt Gate screen, if the student is truly stuck, they can tap the red help button (bottom-left corner).

### 2. Modal Appears
The modal shows:
- **Headline**: "Reveal Answer?"
- **Body**: Clear warning about consequences
- **Consequences**: 
  - 🔻 0 Effort Points
  - 🔓 Answer immediately unlocked
  - ⏸️ Streak paused
- **Optional Coach Tip**: "Hint: Try breaking the question into two parts first!"

### 3. Two Choices

#### Option A: Keep Trying (Primary)
- Transparent background with white border
- Returns to attempt screen
- Encourages perseverance

#### Option B: Reveal Answer (Danger)
- Red text (#EF4444)
- Minimal styling (intentionally de-emphasized)
- Bypasses evaluation
- Shows answer with 0 points

## Technical Implementation

### Files Modified
1. **`/components/MercyModal.tsx`** ✅ Created
   - Full modal component with animations
   - Coach tip banner (optional)
   - Two-button hierarchy

2. **`/components/AttemptGate.tsx`** ✅ Updated
   - Added help button (red circle, bottom-left)
   - Integrated MercyModal
   - Added `onRevealAnswer` prop

3. **`/App.tsx`** ✅ Updated
   - Handles "reveal answer" flow
   - Sets evaluation to 0 points
   - Navigates directly to answer screen

### Props Interface
```typescript
interface MercyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRevealAnswer: () => void;
  coachTip?: string; // Optional hint
}
```

## Design Tokens (Dark Focus)
- Background: `rgba(20, 20, 20, 0.98)` with `blur(40px)`
- Border: Orange glow `rgba(249, 115, 22, 0.4)`
- Icon: Warning triangle in orange gradient
- Coach Tip: Purple gradient `rgba(139, 92, 246, 0.2)`
- Buttons: White outline (primary), Red text (danger)

## Testing

### To Test:
1. Go to Home → Start a question
2. On Attempt Gate, look for red help button (bottom-left)
3. Tap help button → Mercy Modal appears
4. Options:
   - **"Keep Trying"** → Returns to attempt
   - **"Reveal Answer"** → Skips to answer with 0 points

### Expected Behavior:
- Modal has smooth fade + scale animation
- Coach tip banner appears above modal (purple)
- Backdrop is dark with blur effect
- Warning icon pulses gently
- Buttons respond to hover/tap

## Edge Cases Handled
1. ✅ No coach tip provided → Banner doesn't show
2. ✅ User clicks backdrop → Modal closes (same as "Keep Trying")
3. ✅ Reveal answer → Evaluation shows 0 points
4. ✅ Streak is NOT incremented
5. ✅ Daily unlock limit still applies

## Future Enhancements
- Track "mercy reveals" in user analytics
- Adjust coach tips based on subject/difficulty
- Add "Ask a Question" option (community help)
- Show similar solved examples instead of direct answer

---

**Status**: ✅ Fully implemented and integrated
**Last Updated**: 2024-12-13
