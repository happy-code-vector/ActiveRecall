import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStreakFreezeState,
  saveStreakFreezeState,
  consumeFreeze,
  borrowFromFamilyPool,
  grantMonthlyFreezes,
  wasDayMissed,
  getStreakResetBoundary,
  FREEZE_GRANTS,
  StreakFreezeState,
} from '../streakFreeze';

describe('Streak Freeze System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getStreakFreezeState', () => {
    it('returns default state when no data stored', () => {
      const state = getStreakFreezeState();
      expect(state.personalFreezes).toBe(0);
      expect(state.familyPoolFreezes).toBe(0);
      expect(state.freezeHistory).toEqual([]);
    });

    it('returns stored state when data exists', () => {
      const mockState: StreakFreezeState = {
        personalFreezes: 2,
        familyPoolFreezes: 3,
        lastFreezeGrantDate: '2024-01-01',
        freezeHistory: [],
      };
      localStorage.setItem('thinkfirst_streak_freeze', JSON.stringify(mockState));
      
      const state = getStreakFreezeState();
      expect(state.personalFreezes).toBe(2);
      expect(state.familyPoolFreezes).toBe(3);
    });
  });

  describe('consumeFreeze', () => {
    it('consumes a freeze when available', () => {
      const state: StreakFreezeState = {
        personalFreezes: 2,
        familyPoolFreezes: 0,
        lastFreezeGrantDate: null,
        freezeHistory: [],
      };

      const result = consumeFreeze(state);
      
      expect(result.success).toBe(true);
      expect(result.newState.personalFreezes).toBe(1);
      expect(result.newState.freezeHistory).toHaveLength(1);
      expect(result.newState.freezeHistory[0].type).toBe('consumed');
    });

    it('fails when no freezes available', () => {
      const state: StreakFreezeState = {
        personalFreezes: 0,
        familyPoolFreezes: 0,
        lastFreezeGrantDate: null,
        freezeHistory: [],
      };

      const result = consumeFreeze(state);
      
      expect(result.success).toBe(false);
      expect(result.newState.personalFreezes).toBe(0);
    });
  });

  describe('borrowFromFamilyPool', () => {
    it('borrows from family pool when available', () => {
      const state: StreakFreezeState = {
        personalFreezes: 0,
        familyPoolFreezes: 5,
        lastFreezeGrantDate: null,
        freezeHistory: [],
      };

      const result = borrowFromFamilyPool(state);
      
      expect(result.success).toBe(true);
      expect(result.newState.familyPoolFreezes).toBe(4);
      expect(result.newState.freezeHistory[0].type).toBe('borrowed');
      expect(result.newState.freezeHistory[0].source).toBe('family_pool');
    });

    it('fails when family pool is empty', () => {
      const state: StreakFreezeState = {
        personalFreezes: 0,
        familyPoolFreezes: 0,
        lastFreezeGrantDate: null,
        freezeHistory: [],
      };

      const result = borrowFromFamilyPool(state);
      
      expect(result.success).toBe(false);
    });
  });

  describe('grantMonthlyFreezes', () => {
    it('grants 1 freeze for free users', () => {
      const state: StreakFreezeState = {
        personalFreezes: 0,
        familyPoolFreezes: 0,
        lastFreezeGrantDate: null,
        freezeHistory: [],
      };

      const newState = grantMonthlyFreezes(state, 'free');
      
      expect(newState.personalFreezes).toBe(FREEZE_GRANTS.free);
    });

    it('grants 3 freezes for premium users', () => {
      const state: StreakFreezeState = {
        personalFreezes: 0,
        familyPoolFreezes: 0,
        lastFreezeGrantDate: null,
        freezeHistory: [],
      };

      const newState = grantMonthlyFreezes(state, 'solo');
      
      expect(newState.personalFreezes).toBe(FREEZE_GRANTS.solo);
    });

    it('grants family pool for family plan users', () => {
      const state: StreakFreezeState = {
        personalFreezes: 0,
        familyPoolFreezes: 0,
        lastFreezeGrantDate: null,
        freezeHistory: [],
      };

      const newState = grantMonthlyFreezes(state, 'family');
      
      expect(newState.personalFreezes).toBe(FREEZE_GRANTS.family);
      expect(newState.familyPoolFreezes).toBe(FREEZE_GRANTS.familyPool);
    });

    it('does not grant twice in same month', () => {
      const now = new Date();
      const state: StreakFreezeState = {
        personalFreezes: 1,
        familyPoolFreezes: 0,
        lastFreezeGrantDate: now.toISOString(),
        freezeHistory: [],
      };

      const newState = grantMonthlyFreezes(state, 'solo');
      
      // Should not change since already granted this month
      expect(newState.personalFreezes).toBe(1);
    });
  });

  describe('getStreakResetBoundary', () => {
    it('returns 3 AM boundary for given date', () => {
      const date = new Date('2024-01-15T10:30:00');
      const boundary = getStreakResetBoundary(date);
      
      expect(boundary.getHours()).toBe(3);
      expect(boundary.getMinutes()).toBe(0);
      expect(boundary.getSeconds()).toBe(0);
    });
  });

  describe('wasDayMissed', () => {
    it('returns false when activity is on same day', () => {
      const lastActivity = new Date('2024-01-15T10:00:00');
      const current = new Date('2024-01-15T20:00:00');
      
      expect(wasDayMissed(lastActivity, current)).toBe(false);
    });

    it('returns false when activity is on consecutive days', () => {
      const lastActivity = new Date('2024-01-15T10:00:00');
      const current = new Date('2024-01-16T10:00:00');
      
      expect(wasDayMissed(lastActivity, current)).toBe(false);
    });

    it('returns true when a day is skipped', () => {
      const lastActivity = new Date('2024-01-15T10:00:00');
      const current = new Date('2024-01-17T10:00:00');
      
      expect(wasDayMissed(lastActivity, current)).toBe(true);
    });
  });
});
