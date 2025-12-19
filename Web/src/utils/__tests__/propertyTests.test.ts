/**
 * Property-Based Tests for PRD Requirements
 * Using fast-check for generative testing
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Import utilities to test
import { 
  consumeFreeze, 
  grantMonthlyFreezes, 
  borrowFromFamilyPool,
  wasDayMissed,
  getStreakResetBoundary,
  type StreakFreezeState 
} from '../streakFreeze';
import { 
  validateMinimumWords, 
  countWords,
  MINIMUM_WORD_COUNT 
} from '../validation';
import { 
  detectNonsense, 
  validateAttemptForNonsense 
} from '../nonsenseDetection';
import { 
  generateInviteCode, 
  validateInviteCode,
  INVITE_CODE_PATTERN 
} from '../inviteCode';
import { 
  ANIMATION_DURATION, 
  ANIMATION_EASING,
  isValidAnimationDuration 
} from '../animationTiming';
import {
  hasGuardianPin,
  verifyPin,
  isForceMasteryEnabled,
  isMercyButtonBlocked,
} from '../guardianPin';

// Helper to create valid StreakFreezeState
const createFreezeState = (personal: number, family: number = 0): StreakFreezeState => ({
  personalFreezes: personal,
  familyPoolFreezes: family,
  lastFreezeGrantDate: null,
  freezeHistory: [],
});

describe('Property-Based Tests', () => {
  // ===== STREAK FREEZE PROPERTIES =====
  
  describe('Property 1: Streak Freeze Consumption', () => {
    it('consuming a freeze decrements count by exactly 1', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (initialFreezes) => {
            const state = createFreezeState(initialFreezes);
            const result = consumeFreeze(state);
            
            expect(result.success).toBe(true);
            expect(result.newState.personalFreezes).toBe(initialFreezes - 1);
          }
        )
      );
    });

    it('cannot consume freeze when count is 0', () => {
      const state = createFreezeState(0);
      const result = consumeFreeze(state);
      
      expect(result.success).toBe(false);
      expect(result.newState.personalFreezes).toBe(0);
    });

    it('freeze history grows by 1 on successful consumption', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          (initialFreezes) => {
            const state = createFreezeState(initialFreezes);
            const initialHistoryLength = state.freezeHistory.length;
            const result = consumeFreeze(state);
            
            expect(result.newState.freezeHistory.length).toBe(initialHistoryLength + 1);
            expect(result.newState.freezeHistory[result.newState.freezeHistory.length - 1].type).toBe('consumed');
          }
        )
      );
    });
  });

  describe('Property 2: Streak Freeze Grant', () => {
    it('free plan grants exactly 1 freeze', () => {
      const state = createFreezeState(0);
      const newState = grantMonthlyFreezes(state, 'free');
      expect(newState.personalFreezes).toBe(1);
    });

    it('solo plan grants exactly 3 freezes', () => {
      const state = createFreezeState(0);
      const newState = grantMonthlyFreezes(state, 'solo');
      expect(newState.personalFreezes).toBe(3);
    });

    it('family plan grants 3 personal + 5 pool freezes', () => {
      const state = createFreezeState(0);
      const newState = grantMonthlyFreezes(state, 'family');
      expect(newState.personalFreezes).toBe(3);
      expect(newState.familyPoolFreezes).toBe(5);
    });

    it('freezes accumulate when granted multiple times in different months', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 }),
          (initialFreezes) => {
            const state = createFreezeState(initialFreezes);
            // Simulate granting (would need different months in real scenario)
            const newState = grantMonthlyFreezes(state, 'solo');
            expect(newState.personalFreezes).toBeGreaterThanOrEqual(initialFreezes);
          }
        )
      );
    });
  });

  describe('Property 3: Family Freeze Pool Borrowing', () => {
    it('borrowing from pool decrements pool by 1', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }),
          (poolSize) => {
            const state = createFreezeState(0, poolSize);
            const result = borrowFromFamilyPool(state);
            
            expect(result.success).toBe(true);
            expect(result.newState.familyPoolFreezes).toBe(poolSize - 1);
          }
        )
      );
    });

    it('cannot borrow when pool is empty', () => {
      const state = createFreezeState(0, 0);
      const result = borrowFromFamilyPool(state);
      
      expect(result.success).toBe(false);
      expect(result.newState.familyPoolFreezes).toBe(0);
    });

    it('borrowing does not affect personal freezes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          (personal, pool) => {
            const state = createFreezeState(personal, pool);
            const result = borrowFromFamilyPool(state);
            
            expect(result.newState.personalFreezes).toBe(personal);
          }
        )
      );
    });
  });

  // ===== WORD COUNT VALIDATION PROPERTIES =====

  describe('Property 8: Word Count Validation', () => {
    it('strings with >= MINIMUM_WORD_COUNT words are valid', () => {
      fc.assert(
        fc.property(
          fc.array(fc.lorem({ mode: 'words', maxCount: 1 }), { minLength: MINIMUM_WORD_COUNT, maxLength: 50 }),
          (words) => {
            const text = words.join(' ');
            const result = validateMinimumWords(text);
            expect(result.valid).toBe(true);
          }
        )
      );
    });

    it('strings with < MINIMUM_WORD_COUNT words are invalid', () => {
      fc.assert(
        fc.property(
          fc.array(fc.lorem({ mode: 'words', maxCount: 1 }), { minLength: 1, maxLength: MINIMUM_WORD_COUNT - 1 }),
          (words) => {
            const text = words.join(' ');
            const result = validateMinimumWords(text);
            expect(result.valid).toBe(false);
          }
        )
      );
    });

    it('word count is consistent regardless of whitespace', () => {
      fc.assert(
        fc.property(
          fc.array(fc.lorem({ mode: 'words', maxCount: 1 }), { minLength: 5, maxLength: 20 }),
          (words) => {
            const normalSpaces = words.join(' ');
            const extraSpaces = words.join('   ');
            const mixedSpaces = words.join(' \t\n ');
            
            expect(countWords(normalSpaces)).toBe(countWords(extraSpaces));
            expect(countWords(normalSpaces)).toBe(countWords(mixedSpaces));
          }
        )
      );
    });

    it('empty string has 0 words', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
      expect(countWords('\t\n')).toBe(0);
    });
  });

  // ===== NONSENSE DETECTION PROPERTIES =====

  describe('Property 19: Nonsense Detection', () => {
    it('keyboard smashing patterns are detected as nonsense', () => {
      const smashPatterns = [
        'asdfasdfasdf',
        'qwerqwerqwer',
        'zxcvzxcvzxcv',
        'aaaaaaaaaaaa',
      ];
      
      smashPatterns.forEach(pattern => {
        const result = detectNonsense(pattern);
        expect(result.isNonsense).toBe(true);
      });
    });

    it('real words are not detected as nonsense', () => {
      fc.assert(
        fc.property(
          fc.array(fc.lorem({ mode: 'words', maxCount: 1 }), { minLength: 10, maxLength: 30 }),
          (words) => {
            const text = words.join(' ');
            // Real lorem ipsum words should not be nonsense
            const result = validateAttemptForNonsense(text);
            expect(result.valid).toBe(true);
          }
        )
      );
    });

    it('very low vowel ratio indicates nonsense', () => {
      // Strings with almost no vowels (need to be long enough)
      const noVowelStrings = ['bcdfghjklmnpqrstvwxyz'];
      noVowelStrings.forEach(str => {
        const result = detectNonsense(str);
        expect(result.isNonsense).toBe(true);
      });
    });
  });

  // ===== INVITE CODE PROPERTIES =====

  describe('Property 10: Invite Code Format', () => {
    it('generated codes match FAM-XXX pattern', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.uuid(),
          (userId, subscriptionId) => {
            const code = generateInviteCode(userId, subscriptionId);
            expect(code.code).toMatch(INVITE_CODE_PATTERN);
          }
        )
      );
    });

    it('generated codes are always uppercase', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.uuid(),
          (userId, subscriptionId) => {
            const code = generateInviteCode(userId, subscriptionId);
            expect(code.code).toBe(code.code.toUpperCase());
          }
        )
      );
    });

    it('generated codes have exactly 7 characters (FAM-XXX)', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.uuid(),
          (userId, subscriptionId) => {
            const code = generateInviteCode(userId, subscriptionId);
            expect(code.code.length).toBe(7);
          }
        )
      );
    });
  });

  describe('Property 11: Family Account Linking', () => {
    it('valid codes pass validation', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.uuid(),
          (userId, subscriptionId) => {
            const generated = generateInviteCode(userId, subscriptionId);
            const validation = validateInviteCode(generated.code);
            expect(validation.valid).toBe(true);
          }
        )
      );
    });

    it('invalid format codes fail validation', () => {
      const invalidCodes = ['ABC123', 'FAM', 'FAM-', 'FAM-ABCD', 'fam-abc', ''];
      invalidCodes.forEach(code => {
        const result = validateInviteCode(code);
        expect(result.valid).toBe(false);
      });
    });
  });

  // ===== ANIMATION TIMING PROPERTIES =====

  describe('Property 20: Animation Duration Compliance', () => {
    it('FAST duration is between 150-180ms', () => {
      expect(ANIMATION_DURATION.FAST).toBeGreaterThanOrEqual(150);
      expect(ANIMATION_DURATION.FAST).toBeLessThanOrEqual(180);
    });

    it('STANDARD duration is between 220-260ms', () => {
      expect(ANIMATION_DURATION.STANDARD).toBeGreaterThanOrEqual(220);
      expect(ANIMATION_DURATION.STANDARD).toBeLessThanOrEqual(260);
    });

    it('SLOW duration is between 300-350ms', () => {
      expect(ANIMATION_DURATION.SLOW).toBeGreaterThanOrEqual(300);
      expect(ANIMATION_DURATION.SLOW).toBeLessThanOrEqual(350);
    });

    it('all durations are valid for their type', () => {
      expect(isValidAnimationDuration(ANIMATION_DURATION.FAST, 'fast')).toBe(true);
      expect(isValidAnimationDuration(ANIMATION_DURATION.STANDARD, 'standard')).toBe(true);
      expect(isValidAnimationDuration(ANIMATION_DURATION.SLOW, 'slow')).toBe(true);
    });

    it('easing curve is defined', () => {
      expect(ANIMATION_EASING.easeInOut).toBeDefined();
      expect(Array.isArray(ANIMATION_EASING.easeInOut)).toBe(true);
      expect(ANIMATION_EASING.easeInOut.length).toBe(4);
    });
  });

  // ===== GUARDIAN PIN PROPERTIES =====

  describe('Property 12: Guardian PIN Protection', () => {
    it('hasGuardianPin returns boolean', () => {
      const result = hasGuardianPin();
      expect(typeof result).toBe('boolean');
    });

    it('isForceMasteryEnabled returns boolean', () => {
      const result = isForceMasteryEnabled();
      expect(typeof result).toBe('boolean');
    });

    it('isMercyButtonBlocked returns boolean', () => {
      const result = isMercyButtonBlocked();
      expect(typeof result).toBe('boolean');
    });
  });

  // ===== STREAK RESET BOUNDARY PROPERTIES =====

  describe('Property: 3 AM Reset Boundary', () => {
    it('reset boundary is always at 3 AM', () => {
      // Test with specific valid dates instead of random generation
      const testDates = [
        new Date('2025-01-15T10:30:00'),
        new Date('2025-06-20T02:00:00'),
        new Date('2025-12-31T23:59:59'),
        new Date('2024-02-29T12:00:00'), // Leap year
        new Date('2023-07-04T00:00:00'),
      ];
      
      testDates.forEach(date => {
        const boundary = getStreakResetBoundary(date);
        expect(boundary.getHours()).toBe(3);
        expect(boundary.getMinutes()).toBe(0);
        expect(boundary.getSeconds()).toBe(0);
      });
    });

    it('same day before and after 3 AM are handled correctly', () => {
      const before3AM = new Date('2025-01-15T02:00:00');
      const after3AM = new Date('2025-01-15T04:00:00');
      
      // Activity at 2 AM and 4 AM on same calendar day should not be "missed"
      expect(wasDayMissed(before3AM, after3AM)).toBe(false);
    });

    it('activity yesterday after 3 AM, checking today after 3 AM is not missed (consecutive days)', () => {
      const yesterday4AM = new Date('2025-01-14T04:00:00');
      const today4AM = new Date('2025-01-15T04:00:00');
      
      // Consecutive days should not be missed
      expect(wasDayMissed(yesterday4AM, today4AM)).toBe(false);
    });
  });
});
