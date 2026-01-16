import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateInviteCode,
  getInviteCode,
  isValidInviteCodeFormat,
  validateInviteCode,
  linkStudentToFamily,
  getAvailableFamilySlots,
} from '../inviteCode';

describe('Invite Code System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('isValidInviteCodeFormat', () => {
    it('validates correct format', () => {
      expect(isValidInviteCodeFormat('FAM-ABC')).toBe(true);
      expect(isValidInviteCodeFormat('FAM-123')).toBe(true);
      expect(isValidInviteCodeFormat('FAM-A1B')).toBe(true);
    });

    it('rejects invalid formats', () => {
      expect(isValidInviteCodeFormat('ABC-123')).toBe(false);
      expect(isValidInviteCodeFormat('FAM-ABCD')).toBe(false);
      expect(isValidInviteCodeFormat('FAM-AB')).toBe(false);
      expect(isValidInviteCodeFormat('FAMABC')).toBe(false);
      expect(isValidInviteCodeFormat('')).toBe(false);
    });

    it('is case insensitive', () => {
      expect(isValidInviteCodeFormat('fam-abc')).toBe(true);
      expect(isValidInviteCodeFormat('Fam-Abc')).toBe(true);
    });
  });

  describe('generateInviteCode', () => {
    it('generates code in correct format', () => {
      const code = generateInviteCode('parent-123', 'sub-456');
      
      expect(code.code).toMatch(/^FAM-[A-Z0-9]{3}$/);
      expect(code.parentUserId).toBe('parent-123');
      expect(code.subscriptionId).toBe('sub-456');
      expect(code.linkedAccounts).toEqual([]);
      expect(code.maxAccounts).toBe(5);
    });

    it('stores the code in localStorage', () => {
      generateInviteCode('parent-123', 'sub-456');
      
      const stored = getInviteCode();
      expect(stored).not.toBeNull();
      expect(stored?.parentUserId).toBe('parent-123');
    });
  });

  describe('validateInviteCode', () => {
    it('validates existing code', () => {
      const generated = generateInviteCode('parent-123', 'sub-456');
      const result = validateInviteCode(generated.code);
      
      expect(result.valid).toBe(true);
      expect(result.inviteCode).toBeDefined();
    });

    it('rejects invalid format', () => {
      const result = validateInviteCode('INVALID');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid code format');
    });

    it('rejects non-existent code', () => {
      const result = validateInviteCode('FAM-XYZ');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not recognized');
    });
  });

  describe('linkStudentToFamily', () => {
    it('links student to family', () => {
      const code = generateInviteCode('parent-123', 'sub-456');
      const result = linkStudentToFamily('student-789', code);
      
      expect(result.success).toBe(true);
      
      const updatedCode = getInviteCode();
      expect(updatedCode?.linkedAccounts).toContain('student-789');
    });

    it('prevents duplicate linking', () => {
      const code = generateInviteCode('parent-123', 'sub-456');
      linkStudentToFamily('student-789', code);
      
      const updatedCode = getInviteCode()!;
      const result = linkStudentToFamily('student-789', updatedCode);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('already linked');
    });

    it('enforces max accounts limit', () => {
      const code = generateInviteCode('parent-123', 'sub-456');
      
      // Link 5 students
      for (let i = 0; i < 5; i++) {
        const currentCode = getInviteCode()!;
        linkStudentToFamily(`student-${i}`, currentCode);
      }
      
      // Try to link 6th student
      const fullCode = getInviteCode()!;
      const result = linkStudentToFamily('student-6', fullCode);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('maximum');
    });
  });

  describe('getAvailableFamilySlots', () => {
    it('returns correct available slots', () => {
      generateInviteCode('parent-123', 'sub-456');
      expect(getAvailableFamilySlots()).toBe(5);
      
      const code = getInviteCode()!;
      linkStudentToFamily('student-1', code);
      expect(getAvailableFamilySlots()).toBe(4);
    });

    it('returns 0 when no code exists', () => {
      expect(getAvailableFamilySlots()).toBe(0);
    });
  });
});
