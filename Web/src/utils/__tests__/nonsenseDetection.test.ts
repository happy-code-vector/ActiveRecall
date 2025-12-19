import { describe, it, expect } from 'vitest';
import {
  detectNonsense,
  getNonsenseErrorMessage,
  validateAttemptForNonsense,
} from '../nonsenseDetection';

describe('Nonsense Detection', () => {
  describe('detectNonsense', () => {
    it('detects keyboard smashing patterns', () => {
      expect(detectNonsense('asdfasdf asdfasdf').isNonsense).toBe(true);
      expect(detectNonsense('qwerqwer qwerqwer').isNonsense).toBe(true);
      expect(detectNonsense('zxcvzxcv zxcvzxcv').isNonsense).toBe(true);
    });

    it('detects excessive character repetition', () => {
      expect(detectNonsense('aaaaaaaaa').isNonsense).toBe(true);
      expect(detectNonsense('helloooooo').isNonsense).toBe(true);
    });

    it('detects alternating patterns', () => {
      expect(detectNonsense('abababababab').isNonsense).toBe(true);
      expect(detectNonsense('xyxyxyxyxy').isNonsense).toBe(true);
    });

    it('allows valid explanations', () => {
      expect(detectNonsense('The mitochondria is the powerhouse of the cell').isNonsense).toBe(false);
      expect(detectNonsense('Photosynthesis converts light energy into chemical energy').isNonsense).toBe(false);
    });

    it('allows short text (handled by word count validation)', () => {
      expect(detectNonsense('hi').isNonsense).toBe(false);
    });
  });

  describe('getNonsenseErrorMessage', () => {
    it('returns appropriate message for keyboard smashing', () => {
      const message = getNonsenseErrorMessage('keyboard_smashing');
      expect(message).toBe('Type a real explanation to unlock the answer.');
    });

    it('returns appropriate message for repetition', () => {
      const message = getNonsenseErrorMessage('excessive_repetition');
      expect(message).toContain('repeated characters');
    });

    it('returns default message for unknown reason', () => {
      const message = getNonsenseErrorMessage(undefined);
      expect(message).toBe('Type a real explanation to unlock the answer.');
    });
  });

  describe('validateAttemptForNonsense', () => {
    it('returns valid for real explanations', () => {
      const result = validateAttemptForNonsense('This is a real explanation about science');
      expect(result.valid).toBe(true);
    });

    it('returns invalid for nonsense', () => {
      const result = validateAttemptForNonsense('asdfasdf asdfasdf asdfasdf');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
