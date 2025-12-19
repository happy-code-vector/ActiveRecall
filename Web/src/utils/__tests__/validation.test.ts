import { describe, it, expect } from 'vitest';
import {
  countWords,
  validateMinimumWords,
  isSubmitDisabled,
  MINIMUM_WORD_COUNT,
} from '../validation';

describe('Validation Utilities', () => {
  describe('countWords', () => {
    it('counts words correctly', () => {
      expect(countWords('hello world')).toBe(2);
      expect(countWords('one two three four five')).toBe(5);
      expect(countWords('   spaced   out   words   ')).toBe(3);
    });

    it('returns 0 for empty string', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('handles single word', () => {
      expect(countWords('hello')).toBe(1);
    });
  });

  describe('validateMinimumWords', () => {
    it('returns valid for text with enough words', () => {
      const text = 'This is a sentence with more than ten words in it here';
      const result = validateMinimumWords(text);
      
      expect(result.valid).toBe(true);
      expect(result.wordCount).toBeGreaterThanOrEqual(MINIMUM_WORD_COUNT);
    });

    it('returns invalid for text with too few words', () => {
      const text = 'Too short';
      const result = validateMinimumWords(text);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Add a bit more detail so I can understand you.');
    });

    it('respects custom minimum word count', () => {
      const text = 'one two three four five';
      
      expect(validateMinimumWords(text, 5).valid).toBe(true);
      expect(validateMinimumWords(text, 6).valid).toBe(false);
    });
  });

  describe('isSubmitDisabled', () => {
    it('returns true when word count is below minimum', () => {
      expect(isSubmitDisabled('too short')).toBe(true);
    });

    it('returns false when word count meets minimum', () => {
      const text = 'This is a sentence with more than ten words in it here';
      expect(isSubmitDisabled(text)).toBe(false);
    });
  });
});
