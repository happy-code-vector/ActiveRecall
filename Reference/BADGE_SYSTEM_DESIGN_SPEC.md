# ThinkFirst Badge & Achievement System - Design Specification

## Overview
A comprehensive gamification system with 21 badges across 5 categories and 4 rarity tiers.

---

## 🎨 Visual Design System

### Rarity Tiers & Colors

| Rarity | Color | Hex Code | Use Case |
|--------|-------|----------|----------|
| Common | Gray | `#9CA3AF` | Entry-level achievements (1-10 unlocks) |
| Rare | Blue | `#60A5FA` | Regular progress (7-14 day streaks, 50 unlocks) |
| Epic | Purple | `#A855F7` | Major milestones (30 day streaks, 100 unlocks) |
| Legendary | Gold | `#FFD700` | Elite achievements (100+ streaks, 500 unlocks) |

### Badge Card Dimensions

**Grid Layout:**
- Mobile: 4 badges per row
- Gap: 12px between badges
- Aspect ratio: 1:1 (square)
- Border radius: 16px (rounded-2xl)

**Locked Badge:**
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Icon: Lock icon, 24px, gray (#6B7280)

**Unlocked Badge:**
- Background: Linear gradient from badge.color to badge.colorEnd (135deg)
- No border
- Icon: Badge-specific icon, 32px, white
- Rarity dot: 8px circle, bottom-right corner, matching rarity color
- Shine effect: Animated gradient overlay (135deg, transparent 30%, white 30% 50%, transparent 70%)

---

## 📋 Complete Badge Catalog

### STREAK BADGES (Category: Orange/Red Tones)

#### 1. On Fire 🔥
- **ID:** `streak_3`
- **Name:** On Fire
- **Description:** Complete 3 days in a row
- **Rarity:** Common
- **Icon:** Flame
- **Gradient:** `#FF6B35` → `#FF4500`
- **Requirement:** "3-day streak"

#### 2. Week Warrior 📅
- **ID:** `streak_7`
- **Name:** Week Warrior
- **Description:** Complete a full week streak
- **Rarity:** Rare
- **Icon:** Calendar
- **Gradient:** `#FF8C42` → `#FF6B35`
- **Requirement:** "7-day streak"

#### 3. Fortnight Focus 🛡️
- **ID:** `streak_14`
- **Name:** Fortnight Focus
- **Description:** Maintain 14 days of learning
- **Rarity:** Rare
- **Icon:** Shield
- **Gradient:** `#FFA500` → `#FF8C42`
- **Requirement:** "14-day streak"

#### 4. Monthly Master 👑
- **ID:** `streak_30`
- **Name:** Monthly Master
- **Description:** Unstoppable for 30 days
- **Rarity:** Epic
- **Icon:** Crown
- **Gradient:** `#FFD700` → `#FFA500`
- **Requirement:** "30-day streak"

#### 5. Dedication Diamond 💎
- **ID:** `streak_60`
- **Name:** Dedication Diamond
- **Description:** Two months of consistency
- **Rarity:** Epic
- **Icon:** Gem
- **Gradient:** `#00D9FF` → `#0099CC`
- **Requirement:** "60-day streak"

#### 6. Century Legend 🏆
- **ID:** `streak_100`
- **Name:** Century Legend
- **Description:** The ultimate commitment - 100 days
- **Rarity:** Legendary
- **Icon:** Trophy
- **Gradient:** `#FFD700` → `#FF6B35`
- **Requirement:** "100-day streak"

#### 7. Year of Mastery ⭐
- **ID:** `streak_365`
- **Name:** Year of Mastery
- **Description:** Learned every single day for a year
- **Rarity:** Legendary
- **Icon:** Star
- **Gradient:** `#8A2BE2` → `#FFD700`
- **Requirement:** "365-day streak"

---

### EFFORT BADGES (Category: Purple/Brain Tones)

#### 8. Thoughtful Thinker 🧠
- **ID:** `high_effort`
- **Name:** Thoughtful Thinker
- **Description:** Maintain 2.5+ average effort score
- **Rarity:** Rare
- **Icon:** Brain
- **Gradient:** `#8A2BE2` → `#6A1BB2`
- **Requirement:** "Avg effort ≥ 2.5"

#### 9. Effort Excellence ✨
- **ID:** `perfect_effort`
- **Name:** Effort Excellence
- **Description:** Maintain 2.8+ average effort score
- **Rarity:** Epic
- **Icon:** Sparkles
- **Gradient:** `#00FF94` → `#00CC75`
- **Requirement:** "Avg effort ≥ 2.8"

---

### MASTERY BADGES (Category: Gold/Yellow Tones)

#### 10. Mastery Initiate 🎯
- **ID:** `mastery_first`
- **Name:** Mastery Initiate
- **Description:** Complete your first Mastery Mode challenge
- **Rarity:** Rare
- **Icon:** Target
- **Gradient:** `#FFD700` → `#FFA500`
- **Requirement:** "1 Mastery unlock"

#### 11. Gold Standard 🏅
- **ID:** `mastery_10`
- **Name:** Gold Standard
- **Description:** Complete 10 Mastery Mode challenges
- **Rarity:** Epic
- **Icon:** Award
- **Gradient:** `#FFD700` → `#FF8C42`
- **Requirement:** "10 Mastery unlocks"

#### 12. Mastery Legend 👑
- **ID:** `mastery_50`
- **Name:** Mastery Legend
- **Description:** Complete 50 Mastery Mode challenges
- **Rarity:** Legendary
- **Icon:** Crown
- **Gradient:** `#FFD700` → `#8A2BE2`
- **Requirement:** "50 Mastery unlocks"

---

### MILESTONE BADGES (Category: Blue/Green Progression)

#### 13. Knowledge Seeker 📖
- **ID:** `first_unlock`
- **Name:** Knowledge Seeker
- **Description:** Unlock your first answer
- **Rarity:** Common
- **Icon:** BookOpen
- **Gradient:** `#60A5FA` → `#3B82F6`
- **Requirement:** "1 unlock"

#### 14. Curious Mind ✨
- **ID:** `unlocks_10`
- **Name:** Curious Mind
- **Description:** Unlock 10 answers through effort
- **Rarity:** Common
- **Icon:** Sparkles
- **Gradient:** `#8A2BE2` → `#6A1BB2`
- **Requirement:** "10 unlocks"

#### 15. Knowledge Hunter 📈
- **ID:** `unlocks_50`
- **Name:** Knowledge Hunter
- **Description:** Unlock 50 answers
- **Rarity:** Rare
- **Icon:** TrendingUp
- **Gradient:** `#00FF94` → `#00CC75`
- **Requirement:** "50 unlocks"

#### 16. Insight Master 🚀
- **ID:** `unlocks_100`
- **Name:** Insight Master
- **Description:** Unlock 100 answers
- **Rarity:** Epic
- **Icon:** Rocket
- **Gradient:** `#FF6B35` → `#8A2BE2`
- **Requirement:** "100 unlocks"

#### 17. Wisdom Collector 🏆
- **ID:** `unlocks_500`
- **Name:** Wisdom Collector
- **Description:** Unlock 500 answers - legendary dedication
- **Rarity:** Legendary
- **Icon:** Trophy
- **Gradient:** `#FFD700` → `#00D9FF`
- **Requirement:** "500 unlocks"

---

### SPECIAL BADGES (Category: Unique/Event-based)

#### 18. Perfect Week ⭐
- **ID:** `perfect_week`
- **Name:** Perfect Week
- **Description:** Complete 7 days with all effort scores ≥ 2.5
- **Rarity:** Epic
- **Icon:** Star
- **Gradient:** `#FFD700` → `#FF6B35`
- **Requirement:** "7 days, all effort ≥ 2.5"

#### 19. Early Bird ✨
- **ID:** `early_bird`
- **Name:** Early Bird
- **Description:** Manually awarded to beta users
- **Rarity:** Legendary
- **Icon:** Sparkles
- **Gradient:** `#00D9FF` → `#8A2BE2`
- **Requirement:** "Beta participant"

#### 20. Founder 👑
- **ID:** `founder`
- **Name:** Founder
- **Description:** One of the first ThinkFirst users
- **Rarity:** Legendary
- **Icon:** Crown
- **Gradient:** `#FFD700` → `#8A2BE2`
- **Requirement:** "Founding member"

---

## 🎭 Component Specifications

### Badge Showcase Header
```
Position: Top of badge section
Layout: Horizontal flex, space-between

Left side:
- Title: "Badges & Achievements"
  - Color: White (#FFFFFF)
  - Font size: 20px (text-xl)
  - Font weight: 700

- Subtitle: "X of 21 earned"
  - Color: Gray (#6B7280)
  - Font size: 14px (text-sm)
  - Margin top: 4px
```

### Category Filter Pills
```
Layout: Horizontal scroll, 8px gap
Pills: "All", "Streaks", "Mastery", "Milestones", "Effort", "Special"

Inactive state:
- Background: rgba(255, 255, 255, 0.05)
- Text color: Gray (#9CA3AF)
- Font weight: 600
- Padding: 8px 16px
- Border radius: 9999px (full)

Active state:
- Background: Purple gradient (#8A2BE2)
- Text color: White (#FFFFFF)
- Font weight: 600
```

### Badge Grid
```
Grid: 4 columns
Gap: 12px
Each badge: Square aspect ratio (1:1)
```

### Badge Detail Modal

**Backdrop:**
- Background: rgba(0, 0, 0, 0.9)
- Backdrop filter: blur(20px)

**Modal Container:**
- Max width: 360px (sm)
- Border radius: 24px (rounded-3xl)
- Background: 
  - Earned: rgba(badge.color, 0.2)
  - Locked: rgba(255, 255, 255, 0.05)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Padding: 32px

**Large Badge Icon:**
- Size: 128x128px
- Border radius: 24px
- Background: Badge gradient (if earned) or gray (if locked)
- Icon size: 64px
- Glow effect: Pulsing radial gradient (2s loop)

**Rarity Pill:**
- Position: Above title
- Padding: 4px 12px
- Border radius: 9999px
- Background: rgba(rarity.color, 0.2)
- Text color: rarity.color
- Border: 1px solid rgba(rarity.color, 0.4)
- Font weight: 700
- Font size: 12px
- Text: "COMMON" | "RARE" | "EPIC" | "LEGENDARY"

**Title:**
- Font size: 24px (text-2xl)
- Font weight: 700
- Color: White
- Margin bottom: 8px

**Description:**
- Font size: 14px (text-sm)
- Color: Gray (#9CA3AF)
- Line height: 1.6
- Margin bottom: 16px

**Requirement Badge:**
- Display: inline-block
- Background: rgba(255, 255, 255, 0.05)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Padding: 8px 16px
- Border radius: 9999px
- Font size: 14px
- "Requirement: " in gray, actual requirement in white bold

**Status:**
Earned:
- "✓ Unlocked" in green (#4ADE80)
- "Earned on [date]" in gray

Locked:
- "🔒 Locked" in gray (#4B5563)
- "Keep learning to unlock this badge!" in dark gray

---

## 🎬 Animations & Interactions

### Badge Entrance Animation
```
Stagger: 0.02s per badge
Initial: opacity: 0, scale: 0.8
Animate to: opacity: 1, scale: 1
Duration: 0.4s
```

### Badge Tap Interaction
```
Scale: 0.95 on tap
Transition: 200ms ease-out
```

### Shine Effect (Earned Badges Only)
```
Gradient: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)
Animation: Sweep from -100% to 200% on x-axis
Duration: 3s
Repeat: Infinite
Delay between loops: 2s
```

### Modal Entrance
```
Backdrop: opacity 0 → 1 (300ms)
Modal: 
  - opacity 0 → 1
  - scale 0.9 → 1
  - y: 20px → 0
Spring physics: damping 25, stiffness 300
```

### Large Badge Glow (Earned Only)
```
Effect: Radial gradient pulsing
Animation: scale [1, 1.2, 1], opacity [0.5, 0.8, 0.5]
Duration: 2s
Repeat: Infinite
```

---

## 📱 Layout Integration

### Profile Screen - Badge Section Location
```
Position: After "Stats Grid", before "Streak Freeze"
Padding horizontal: 24px
Padding bottom: 24px
Animation delay: 0.21s (after stats)
```

### Mobile Optimization
- Touch targets: Minimum 44x44px (iOS guidelines)
- Scrollable category pills with horizontal scroll
- Modal covers entire screen on mobile
- Close button: 40x40px tap target

---

## 🎯 User Experience Notes

### First-Time Experience
- Show all 21 badges (mix of locked/unlocked)
- Locked badges create aspiration
- First badge ("Knowledge Seeker") unlocks immediately after first answer
- Celebrate badge unlocks with toast notification (future feature)

### Progress Indication
- "X of 21 earned" creates collection mechanic
- Rarity dots on earned badges show status
- Category filters help users focus on specific achievement paths

### Social Proof
- Legendary badges are rare and prestigious
- Display earned date to show commitment
- Badge showcase on profile builds identity

---

## 🔄 Badge Awarding Logic

### Automatic Award Triggers
- Every successful unlock triggers badge check
- Backend evaluates all 21 badge criteria
- Multiple badges can be awarded in single session
- Idempotent: won't duplicate badges

### Criteria Types
1. **Streak milestones** - Based on current streak count
2. **Total unlocks** - Cumulative count from history
3. **Mastery unlocks** - Requires masteryAchieved: true
4. **Effort average** - Calculated from all historical attempts
5. **Perfect week** - Last 7 days all with effort ≥ 2.5
6. **Manual** - Admin-awarded special badges

---

## 🎨 Figma Design Checklist

### Frames to Create
- [ ] Badge grid (4x4 layout)
- [ ] Individual badge card (locked state)
- [ ] Individual badge card (unlocked state)
- [ ] Badge detail modal (locked)
- [ ] Badge detail modal (unlocked)
- [ ] Category filter pills
- [ ] All 21 badge designs with correct icons
- [ ] Rarity tier visual system
- [ ] Loading skeleton state

### Components to Build
- [ ] Badge card (locked/unlocked variants)
- [ ] Badge detail modal
- [ ] Category pill (active/inactive)
- [ ] Rarity badge
- [ ] Status indicator (locked/unlocked)

### Prototype Interactions
- [ ] Badge tap → opens modal
- [ ] Modal backdrop tap → closes modal
- [ ] Category pill tap → filters badges
- [ ] Close button → closes modal

### Design Tokens
- [ ] All 21 badge gradients
- [ ] 4 rarity tier colors
- [ ] Typography scale
- [ ] Spacing system
- [ ] Animation timing

---

## 📊 Success Metrics

**Engagement Goals:**
- Increase daily active users (streak badges)
- Increase session depth (milestone badges)
- Increase quality of attempts (effort badges)
- Create aspirational goals (legendary badges)

**Gamification Psychology:**
- Collection mechanics ("Gotta catch 'em all")
- Status signaling (rarity tiers)
- Loss aversion (streak protection)
- Progressive disclosure (locked → unlocked)

---

## 🚀 Future Enhancements

1. **Badge Celebration Animation** - Confetti on unlock
2. **Badge Sharing** - Social share for legendary badges
3. **Badge Display** - Show top 3 badges on profile header
4. **Leaderboards** - Compare badge collections with friends
5. **Seasonal Badges** - Limited-time event badges
6. **Achievement Paths** - Badge trees showing progression
7. **Badge Notifications** - Toast on unlock with preview

---

**Document Version:** 1.0  
**Last Updated:** December 8, 2024  
**Design System:** ThinkFirst Dark Focus Aesthetic
