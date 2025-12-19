/**
 * Badge Evaluation System
 * Evaluates user activity against badge criteria and awards badges
 */

import { Badge, BADGE_DEFINITIONS } from './badgeDefinitions';

export interface UserStats {
  currentStreak: number;
  totalUnlocks: number;
  masteryUnlocks: number;
  savedCount: number;
  averageEffortScore: number;
  hasPerfectScore: boolean;
  hasUsedStreakFreeze: boolean;
  lastUnlockTime: Date | null;
  editCountOnLastAttempt: number;
  subjectCategories: string[];
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

// Storage key for earned badges
const EARNED_BADGES_KEY = 'thinkfirst_earned_badges';

/**
 * Get all earned badges from localStorage
 */
export function getEarnedBadges(): EarnedBadge[] {
  const stored = localStorage.getItem(EARNED_BADGES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Save earned badges to localStorage
 */
function saveEarnedBadges(badges: EarnedBadge[]): void {
  localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(badges));
}

/**
 * Check if a badge has already been earned
 */
export function hasBadge(badgeId: string): boolean {
  const earned = getEarnedBadges();
  return earned.some(b => b.badgeId === badgeId);
}

/**
 * Award a badge to the user
 */
export function awardBadge(badgeId: string): EarnedBadge | null {
  if (hasBadge(badgeId)) {
    return null; // Already earned
  }
  
  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
  if (!badge) {
    return null; // Invalid badge
  }
  
  const earnedBadge: EarnedBadge = {
    badgeId,
    earnedAt: new Date().toISOString(),
  };
  
  const earned = getEarnedBadges();
  earned.push(earnedBadge);
  saveEarnedBadges(earned);
  
  return earnedBadge;
}

/**
 * Check if current time is late night (after 11 PM)
 */
function isLateNight(date: Date): boolean {
  return date.getHours() >= 23;
}

/**
 * Check if current time is early morning (before 8 AM)
 */
function isEarlyMorning(date: Date): boolean {
  return date.getHours() < 8;
}

/**
 * Evaluate a single badge's criteria against user stats
 */
export function evaluateBadgeCriteria(badge: Badge, stats: UserStats): boolean {
  if (!badge.criteria) {
    return false; // Manual badges require explicit awarding
  }
  
  switch (badge.criteria.type) {
    case 'streak':
      return stats.currentStreak >= (badge.criteria.value || 0);
      
    case 'total_unlocks':
      return stats.totalUnlocks >= (badge.criteria.value || 0);
      
    case 'mastery_unlocks':
      return stats.masteryUnlocks >= (badge.criteria.value || 0);
      
    case 'mastery_mode':
      return stats.masteryUnlocks > 0;
      
    case 'effort_score_avg':
      return stats.averageEffortScore >= (badge.criteria.value || 0);
      
    case 'perfect_score':
      return stats.hasPerfectScore;
      
    case 'streak_saved':
      return stats.hasUsedStreakFreeze;
      
    case 'saved_count':
      return stats.savedCount >= (badge.criteria.value || 0);
      
    case 'late_night':
      return stats.lastUnlockTime !== null && 
             isLateNight(stats.lastUnlockTime) && 
             stats.averageEffortScore >= 2.5;
      
    case 'early_morning':
      return stats.lastUnlockTime !== null && 
             isEarlyMorning(stats.lastUnlockTime);
      
    case 'manual':
      return false; // Manual badges are awarded through specific triggers
      
    default:
      return false;
  }
}

/**
 * Check all badges and award any newly earned ones
 * Returns array of newly awarded badges
 */
export function checkAndAwardBadges(stats: UserStats): Badge[] {
  const newlyAwarded: Badge[] = [];
  
  for (const badge of BADGE_DEFINITIONS) {
    // Skip if already earned
    if (hasBadge(badge.id)) {
      continue;
    }
    
    // Check if criteria is met
    if (evaluateBadgeCriteria(badge, stats)) {
      const awarded = awardBadge(badge.id);
      if (awarded) {
        newlyAwarded.push(badge);
      }
    }
  }
  
  return newlyAwarded;
}

/**
 * Award a manual badge (for badges that require specific triggers)
 * Used for: the_architect, the_polymath, the_refiner
 */
export function awardManualBadge(
  badgeId: 'the_architect' | 'the_polymath' | 'the_refiner',
  stats: UserStats
): Badge | null {
  // Validate specific conditions for manual badges
  switch (badgeId) {
    case 'the_architect':
      // Awarded when AI detects perfect structure
      break;
    case 'the_polymath':
      // Requires 5 different subject categories
      if (stats.subjectCategories.length < 5) {
        return null;
      }
      break;
    case 'the_refiner':
      // Requires 3+ edits on last attempt
      if (stats.editCountOnLastAttempt < 3) {
        return null;
      }
      break;
    default:
      return null;
  }
  
  const awarded = awardBadge(badgeId);
  if (awarded) {
    return BADGE_DEFINITIONS.find(b => b.id === badgeId) || null;
  }
  return null;
}

/**
 * Get progress towards a specific badge
 */
export function getBadgeProgress(badge: Badge, stats: UserStats): {
  current: number;
  target: number;
  percentage: number;
} {
  if (!badge.criteria || badge.criteria.type === 'manual') {
    return { current: 0, target: 1, percentage: 0 };
  }
  
  let current = 0;
  const target = badge.criteria.value || 1;
  
  switch (badge.criteria.type) {
    case 'streak':
      current = stats.currentStreak;
      break;
    case 'total_unlocks':
      current = stats.totalUnlocks;
      break;
    case 'mastery_unlocks':
      current = stats.masteryUnlocks;
      break;
    case 'saved_count':
      current = stats.savedCount;
      break;
    case 'effort_score_avg':
      current = stats.averageEffortScore;
      break;
    case 'perfect_score':
      current = stats.hasPerfectScore ? 1 : 0;
      break;
    case 'streak_saved':
      current = stats.hasUsedStreakFreeze ? 1 : 0;
      break;
    case 'mastery_mode':
      current = stats.masteryUnlocks > 0 ? 1 : 0;
      break;
    case 'late_night':
    case 'early_morning':
      current = 0; // Time-based badges don't show progress
      break;
  }
  
  const percentage = Math.min(100, (current / target) * 100);
  return { current, target, percentage };
}

/**
 * Get all badges with their earned status and progress
 */
export function getAllBadgesWithStatus(stats: UserStats): Array<{
  badge: Badge;
  earned: boolean;
  earnedAt: string | null;
  progress: { current: number; target: number; percentage: number };
}> {
  const earnedBadges = getEarnedBadges();
  
  return BADGE_DEFINITIONS.map(badge => {
    const earned = earnedBadges.find(e => e.badgeId === badge.id);
    return {
      badge,
      earned: !!earned,
      earnedAt: earned?.earnedAt || null,
      progress: getBadgeProgress(badge, stats),
    };
  });
}
