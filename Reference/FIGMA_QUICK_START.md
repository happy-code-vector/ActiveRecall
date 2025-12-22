# Badge System - Figma Quick Start Guide

## 📁 Files Included

1. **BADGE_SYSTEM_DESIGN_SPEC.md** - Complete design specification (21 badges, all specs)
2. **badge-preview.html** - Interactive visual preview (open in browser)
3. **This file** - Quick start guide for Figma setup

---

## 🚀 Quick Start (5 Minutes)

### Step 1: View the Visual Preview
1. Open `badge-preview.html` in your browser
2. This shows all 21 badges with correct colors, gradients, and layouts
3. Take screenshots or keep it open as reference

### Step 2: Create Your Figma File Structure
```
📁 ThinkFirst Badge System
├── 📄 Cover Page
├── 🎨 Design Tokens
│   ├── Rarity Colors
│   ├── Badge Gradients
│   └── Typography Scale
├── 🧩 Components
│   ├── Badge Card (Locked)
│   ├── Badge Card (Unlocked)
│   ├── Badge Detail Modal
│   ├── Category Filter Pill
│   └── Rarity Badge
├── 📱 Mobile Screens
│   ├── Badge Grid (Profile Screen)
│   ├── Badge Detail Modal (Locked)
│   └── Badge Detail Modal (Unlocked)
└── 🏅 Badge Library
    ├── Streak Badges (7)
    ├── Mastery Badges (3)
    ├── Milestone Badges (6)
    ├── Effort Badges (2)
    └── Special Badges (3)
```

### Step 3: Set Up Design Tokens First

**Color Styles to Create:**
```
Rarity/Common           → #9CA3AF
Rarity/Rare             → #60A5FA
Rarity/Epic             → #A855F7
Rarity/Legendary        → #FFD700

Background/Card         → rgba(255, 255, 255, 0.05)
Background/Modal        → rgba(0, 0, 0, 0.9)
Border/Subtle           → rgba(255, 255, 255, 0.1)
```

**Gradient Styles to Create (All at 135°):**
```
Badge/Streak/OnFire     → #FF6B35 to #FF4500
Badge/Streak/Week       → #FF8C42 to #FF6B35
Badge/Mastery/Gold      → #FFD700 to #FF8C42
Badge/Milestone/First   → #60A5FA to #3B82F6
Badge/Effort/High       → #8A2BE2 to #6A1BB2
... (See full spec for all 21)
```

**Text Styles to Create:**
```
Badge/Title             → 18px, Weight 700, White
Badge/Description       → 14px, Weight 400, #9CA3AF
Badge/Requirement       → 12px, Weight 600, #60A5FA
Modal/Title             → 24px, Weight 700, White
Rarity/Label            → 10px, Weight 700, Uppercase
```

---

## 🎨 Design Priority Order

### Phase 1: Core Components (30 min)
1. Create badge card component (locked state)
2. Create badge card component (unlocked state)
3. Add rarity variants (4 states)
4. Test with different gradients

### Phase 2: Badge Library (60 min)
1. Create all 7 streak badges
2. Create all 3 mastery badges
3. Create all 6 milestone badges
4. Create all 2 effort badges
5. Create all 3 special badges

**Pro Tip:** Use component variants for locked/unlocked states

### Phase 3: Layout Screens (30 min)
1. Design 4x4 grid layout (mobile)
2. Design category filter pills
3. Design badge detail modal
4. Add interactions/prototype

### Phase 4: Polish (30 min)
1. Add shine animation keyframes
2. Add modal entrance animation
3. Add hover states
4. Document spacing/sizing

---

## 📐 Critical Measurements

### Mobile Layout (375px width)
```
Container padding:      24px (left/right)
Badge grid:             4 columns
Gap between badges:     12px
Each badge width:       ~78px (calculated)
Badge aspect ratio:     1:1 (square)
Badge border radius:    16px
```

### Badge Card
```
Icon container:         80x80px
Icon size:              32px (unlocked), 24px (locked)
Rarity dot:             8px diameter
Dot position:           4px from bottom-right
Border radius:          16px (cards), 20px (icons)
```

### Modal
```
Max width:              360px
Padding:                32px
Border radius:          24px
Large icon:             128x128px
Icon inside:            64px
Close button:           40x40px (top-right)
```

---

## 🎯 Key Icons to Use

Map these to your icon library (we use Lucide icons):

| Badge | Icon Name | Emoji Fallback |
|-------|-----------|----------------|
| On Fire | Flame | 🔥 |
| Week Warrior | Calendar | 📅 |
| Fortnight Focus | Shield | 🛡️ |
| Monthly Master | Crown | 👑 |
| Dedication Diamond | Gem | 💎 |
| Century Legend | Trophy | 🏆 |
| Year of Mastery | Star | ⭐ |
| Thoughtful Thinker | Brain | 🧠 |
| Effort Excellence | Sparkles | ✨ |
| Mastery Initiate | Target | 🎯 |
| Gold Standard | Award | 🏅 |
| Knowledge Seeker | BookOpen | 📖 |
| Knowledge Hunter | TrendingUp | 📈 |
| Insight Master | Rocket | 🚀 |
| Perfect Week | Star | ⭐ |
| Locked Badge | Lock | 🔒 |

---

## 🎬 Animation Specs

### Shine Effect (Unlocked Badges Only)
```
Type:       Linear gradient overlay
Gradient:   135deg, transparent 30%, white 30% 50%, transparent 70%
Motion:     Translate X from -100% to 200%
Duration:   3 seconds
Delay:      2 seconds between loops
Repeat:     Infinite
```

### Badge Entrance (Grid)
```
Type:       Staggered fade + scale
Initial:    opacity: 0, scale: 0.8
Final:      opacity: 1, scale: 1
Stagger:    0.02s per badge (20ms)
Duration:   0.4s
```

### Modal Entrance
```
Backdrop:   opacity 0 → 1 (300ms)
Modal:      opacity 0 → 1, scale 0.9 → 1, translateY 20px → 0
Easing:     Spring (damping: 25, stiffness: 300)
```

### Badge Tap
```
Scale:      1.0 → 0.95
Duration:   200ms
Easing:     Ease-out
```

---

## ✅ Design Review Checklist

Before sharing with developers:

- [ ] All 21 badges designed with correct gradients
- [ ] Locked and unlocked states for each badge
- [ ] Rarity labels on all badges (Common/Rare/Epic/Legendary)
- [ ] Category filter pills (6 total: All, Streaks, Mastery, Milestones, Effort, Special)
- [ ] Badge detail modal (locked and unlocked versions)
- [ ] 4x4 grid layout on mobile (375px width)
- [ ] Shine animation documented
- [ ] Rarity dots on unlocked badges
- [ ] Lock icon on locked badges
- [ ] All measurements documented
- [ ] Interactive prototype created

---

## 💡 Design Tips

### Color Psychology
- **Orange/Red** (Streaks) → Fire, urgency, daily habit
- **Gold/Yellow** (Mastery) → Achievement, excellence, challenge
- **Blue/Green** (Milestones) → Progress, growth, learning
- **Purple** (Effort) → Quality, intelligence, depth
- **Multi-color** (Special) → Rare, prestigious, unique

### Visual Hierarchy
1. **Legendary** badges should feel the most premium (gold, complex gradients)
2. **Common** badges should feel accessible (simple gradients, gray accents)
3. **Locked** badges should create aspiration (subtle, mysterious)
4. **Unlocked** badges should feel rewarding (vibrant, animated)

### Accessibility
- Ensure 4.5:1 contrast for all text on backgrounds
- Icons should be recognizable at 32px size
- Touch targets minimum 44x44px
- Color shouldn't be the only indicator (use icons + text)

---

## 🔗 Reference Links

**Icon Library:** Lucide Icons (https://lucide.dev)  
**Color Tool:** Coolors.co for gradient generation  
**Animation:** Easings.net for motion curves  
**Inspiration:** Duolingo, Khan Academy, Apple Fitness badges

---

## 📤 Delivery Format

When complete, export:

1. **Figma Link** (with view/comment access)
2. **Component Library** (organized by category)
3. **Design Tokens** (JSON export if possible)
4. **Icon Assets** (SVG, 32px and 64px)
5. **Prototype Link** (with basic interactions)
6. **Specs** (Inspect mode enabled)

---

## ❓ Common Questions

**Q: Should all badges be the same size?**  
A: Yes, all badges are square (1:1 aspect ratio) in the grid view.

**Q: How do I show the locked state?**  
A: Use a gray background, lock icon, and reduce opacity slightly.

**Q: What about tablet/desktop?**  
A: Start with mobile (4 columns). Desktop could be 6-8 columns with same badge size.

**Q: Can users tap locked badges?**  
A: Yes! Tapping shows the modal with requirement info.

**Q: Should the shine animation play all the time?**  
A: It should loop with a 2-second pause between sweeps to avoid distraction.

---

**Need help?** Refer to the full design spec in `BADGE_SYSTEM_DESIGN_SPEC.md`

**See it in action?** Open `badge-preview.html` in your browser

Good luck! 🚀
