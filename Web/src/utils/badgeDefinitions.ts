import { 
  Flame, 
  Zap, 
  Award, 
  Target, 
  Star, 
  Crown, 
  Sparkles, 
  Trophy,
  Rocket,
  Brain,
  BookOpen,
  TrendingUp,
  Shield,
  Gem,
  Key,
  Settings,
  Heart,
  Database,
  Sun,
  Moon,
  Sunrise,
  Layers,
  type LucideIcon
} from 'lucide-react';

export type BadgeCategory = 'streak' | 'mastery' | 'milestone';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  visual: string; // Visual description for designers
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: LucideIcon;
  color: string; // Gradient start color
  colorEnd: string; // Gradient end color
  requirement: string; // User-facing requirement text
  // Used for automatic badge awarding
  criteria?: {
    type: 'streak' | 'total_unlocks' | 'effort_score_avg' | 'mastery_unlocks' | 'mastery_mode' | 'perfect_score' | 'late_night' | 'early_morning' | 'saved_count' | 'streak_saved' | 'manual';
    value?: number;
  };
}

export const BADGE_DEFINITIONS: Badge[] = [
  // ===== STREAKS (6 Badges) =====
  // Theme: Maintaining the fire (Magma Orange → Blue Heat)
  {
    id: 'ignition',
    name: 'Ignition',
    description: 'The spark has been struck',
    visual: 'A single matchstick striking a spark against a dark surface',
    category: 'streak',
    rarity: 'common',
    icon: Flame,
    color: '#FF6B35',
    colorEnd: '#FF4500',
    requirement: '3-day streak',
    criteria: { type: 'streak', value: 3 },
  },
  {
    id: 'the_furnace',
    name: 'The Furnace',
    description: 'Heat is building, momentum is real',
    visual: 'An industrial furnace door glowing orange with heat leaking out',
    category: 'streak',
    rarity: 'rare',
    icon: Zap,
    color: '#FF8C42',
    colorEnd: '#FF6B35',
    requirement: '7-day streak',
    criteria: { type: 'streak', value: 7 },
  },
  {
    id: 'momentum',
    name: 'Momentum',
    description: 'The flywheel is spinning',
    visual: 'A heavy flywheel or turbine spinning with green motion blur',
    category: 'streak',
    rarity: 'rare',
    icon: TrendingUp,
    color: '#00FF94',
    colorEnd: '#00CC75',
    requirement: '14-day streak',
    criteria: { type: 'streak', value: 14 },
  },
  {
    id: 'blue_giant',
    name: 'Blue Giant',
    description: 'Burning with the hottest intensity',
    visual: 'A massive star burning with intense blue/white light (hottest flame)',
    category: 'streak',
    rarity: 'epic',
    icon: Star,
    color: '#00D9FF',
    colorEnd: '#0099CC',
    requirement: '30-day streak',
    criteria: { type: 'streak', value: 30 },
  },
  {
    id: 'the_century',
    name: 'The Century',
    description: 'Discipline forged in platinum',
    visual: 'The number "100" chiseled out of solid Platinum, glowing from behind',
    category: 'streak',
    rarity: 'legendary',
    icon: Trophy,
    color: '#E5E4E2',
    colorEnd: '#C0C0C0',
    requirement: '100-day streak',
    criteria: { type: 'streak', value: 100 },
  },
  {
    id: 'the_reboot',
    name: 'The Reboot',
    description: 'System restored, continuity maintained',
    visual: 'A "System Restore" icon or a Phoenix Feather digitized into pixels',
    category: 'streak',
    rarity: 'epic',
    icon: Shield,
    color: '#8A2BE2',
    colorEnd: '#6A1BB2',
    requirement: 'Used Streak Freeze',
    criteria: { type: 'streak_saved' },
  },

  // ===== MASTERY (7 Badges) =====
  // Theme: Depth of thought and quality (Electric Violet → Neon Pink)
  {
    id: 'synapse',
    name: 'Synapse',
    description: 'The connection has been made',
    visual: 'Two neural nodes connecting with a bright electrical zap',
    category: 'mastery',
    rarity: 'rare',
    icon: Zap,
    color: '#8A2BE2',
    colorEnd: '#A855F7',
    requirement: 'First high effort score',
    criteria: { type: 'effort_score_avg', value: 2.5 },
  },
  {
    id: 'deep_dive',
    name: 'Deep Dive',
    description: 'Explored the depths of understanding',
    visual: 'A futuristic diving helmet or a submarine window looking into a dark void',
    category: 'mastery',
    rarity: 'epic',
    icon: Target,
    color: '#3B82F6',
    colorEnd: '#2563EB',
    requirement: '100% on effort & understanding',
    criteria: { type: 'perfect_score' },
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    description: 'Elite difficulty conquered',
    visual: 'A tactical "Spec-Ops" helmet with a glowing red visor',
    category: 'mastery',
    rarity: 'epic',
    icon: Shield,
    color: '#DC2626',
    colorEnd: '#991B1B',
    requirement: 'Unlock in Mastery Mode',
    criteria: { type: 'mastery_mode' },
  },
  {
    id: 'the_architect',
    name: 'The Architect',
    description: 'Perfect logical structure detected',
    visual: 'A glowing wireframe cube (tesseract) floating in space',
    category: 'mastery',
    rarity: 'legendary',
    icon: Layers,
    color: '#00D9FF',
    colorEnd: '#8A2BE2',
    requirement: 'Perfect structure in explanation',
    criteria: { type: 'manual' }, // AI detects perfect structure
  },
  {
    id: 'the_polymath',
    name: 'The Polymath',
    description: 'Knowledge spans multiple domains',
    visual: 'A glass prism refracting a beam of light into a rainbow',
    category: 'mastery',
    rarity: 'legendary',
    icon: Sparkles,
    color: '#FF6B35',
    colorEnd: '#8A2BE2',
    requirement: '5 different subject categories',
    criteria: { type: 'manual' }, // Requires subject tracking
  },
  {
    id: 'night_shift',
    name: 'Night Shift',
    description: 'Late-night focus session completed',
    visual: 'A neon crescent moon wearing cyber-sunglasses',
    category: 'mastery',
    rarity: 'rare',
    icon: Moon,
    color: '#A855F7',
    colorEnd: '#EC4899',
    requirement: 'High effort after 11:00 PM',
    criteria: { type: 'late_night' },
  },
  {
    id: 'the_refiner',
    name: 'The Refiner',
    description: 'Crafted through iteration',
    visual: 'A scalpel or laser cutter working on a rough rock',
    category: 'mastery',
    rarity: 'epic',
    icon: Settings,
    color: '#10B981',
    colorEnd: '#059669',
    requirement: 'Revised explanation 3+ times',
    criteria: { type: 'manual' }, // Requires edit tracking
  },

  // ===== MILESTONES (7 Badges) =====
  // Theme: Experience levels and volume (Raw Materials → Precious Metals)
  {
    id: 'the_initiate',
    name: 'The Initiate',
    description: 'The journey begins',
    visual: 'A rough, unpolished stone key',
    category: 'milestone',
    rarity: 'common',
    icon: Key,
    color: '#78716C',
    colorEnd: '#57534E',
    requirement: '1 unlock',
    criteria: { type: 'total_unlocks', value: 1 },
  },
  {
    id: 'the_apprentice',
    name: 'The Apprentice',
    description: 'Learning the fundamentals',
    visual: 'A bronze gear, slightly rusted but functional',
    category: 'milestone',
    rarity: 'common',
    icon: Settings,
    color: '#CD7F32',
    colorEnd: '#B87333',
    requirement: '10 unlocks',
    criteria: { type: 'total_unlocks', value: 10 },
  },
  {
    id: 'the_operator',
    name: 'The Operator',
    description: 'Systems running at full capacity',
    visual: 'A sleek, chrome/silver mechanical heart',
    category: 'milestone',
    rarity: 'rare',
    icon: Heart,
    color: '#C0C0C0',
    colorEnd: '#A8A8A8',
    requirement: '50 unlocks',
    criteria: { type: 'total_unlocks', value: 50 },
  },
  {
    id: 'the_veteran',
    name: 'The Veteran',
    description: 'Battle-tested and proven',
    visual: 'A solid Gold pyramid or obelisk',
    category: 'milestone',
    rarity: 'epic',
    icon: Award,
    color: '#FFD700',
    colorEnd: '#FFA500',
    requirement: '100 unlocks',
    criteria: { type: 'total_unlocks', value: 100 },
  },
  {
    id: 'the_apex',
    name: 'The Apex',
    description: 'Peak performance achieved',
    visual: 'An Obsidian (black glass) diamond with purple inner light',
    category: 'milestone',
    rarity: 'legendary',
    icon: Gem,
    color: '#1F1F1F',
    colorEnd: '#8A2BE2',
    requirement: '500 unlocks',
    criteria: { type: 'total_unlocks', value: 500 },
  },
  {
    id: 'the_archivist',
    name: 'The Archivist',
    description: 'Knowledge meticulously preserved',
    visual: 'A glowing crystal shard or a futuristic data server rack',
    category: 'milestone',
    rarity: 'rare',
    icon: Database,
    color: '#06B6D4',
    colorEnd: '#0891B2',
    requirement: 'Saved 20 explanations',
    criteria: { type: 'saved_count', value: 20 },
  },
  {
    id: 'early_riser',
    name: 'Early Riser',
    description: 'Conquered the morning hours',
    visual: 'A digital sun rising over a retro-wave grid horizon',
    category: 'milestone',
    rarity: 'rare',
    icon: Sunrise,
    color: '#F59E0B',
    colorEnd: '#D97706',
    requirement: 'Attempt before 8:00 AM',
    criteria: { type: 'early_morning' },
  },
];

// Helper functions for badge operations
export function getBadgeById(id: string): Badge | undefined {
  return BADGE_DEFINITIONS.find(badge => badge.id === id);
}

export function getBadgesByCategory(category: BadgeCategory): Badge[] {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category);
}

export function getBadgesByRarity(rarity: BadgeRarity): Badge[] {
  return BADGE_DEFINITIONS.filter(badge => badge.rarity === rarity);
}

export function getRarityColor(rarity: BadgeRarity): string {
  const colors = {
    common: '#9CA3AF',
    rare: '#60A5FA',
    epic: '#A855F7',
    legendary: '#FFD700',
  };
  return colors[rarity];
}

export function getRarityLabel(rarity: BadgeRarity): string {
  const labels = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  };
  return labels[rarity];
}
