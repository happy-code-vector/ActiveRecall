/**
 * Nonsense Detection Utility
 * Detects keyboard smashing and invalid input patterns
 */

export interface NonsenseCheckResult {
  isNonsense: boolean;
  reason?: string;
}

// Common keyboard smashing patterns
const KEYBOARD_PATTERNS = [
  /asdf/i,
  /qwer/i,
  /zxcv/i,
  /hjkl/i,
  /uiop/i,
  /jkl;/i,
  /fghj/i,
  /sdfg/i,
  /dfgh/i,
  /cvbn/i,
  /vbnm/i,
  /bnm,/i,
  /yuio/i,
  /tyui/i,
  /rtyu/i,
  /wert/i,
  /erty/i,
];

// Repeated character patterns
const REPEATED_CHAR_PATTERN = /(.)\1{4,}/i; // Same char 5+ times

// Alternating patterns like "ababab"
const ALTERNATING_PATTERN = /(..)\1{2,}/i; // Same 2-char pattern 3+ times

/**
 * Check if text contains keyboard smashing patterns
 */
function hasKeyboardSmashing(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s/g, '');
  
  for (const pattern of KEYBOARD_PATTERNS) {
    if (pattern.test(normalized)) {
      // Check if the pattern appears multiple times or is a significant portion
      const matches = normalized.match(new RegExp(pattern.source, 'gi'));
      if (matches && matches.length >= 2) {
        return true;
      }
      // Or if the pattern is more than 30% of the text
      if (matches && matches[0].length / normalized.length > 0.3) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if text has too few vowels (indicates random typing)
 */
function hasLowVowelRatio(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[^a-z]/g, '');
  
  // Skip short texts
  if (normalized.length < 10) {
    return false;
  }
  
  const vowels = normalized.match(/[aeiou]/g) || [];
  const vowelRatio = vowels.length / normalized.length;
  
  // Normal English text has ~38% vowels
  // If less than 15%, likely nonsense
  return vowelRatio < 0.15;
}

/**
 * Check for repeated characters
 */
function hasExcessiveRepetition(text: string): boolean {
  return REPEATED_CHAR_PATTERN.test(text);
}

/**
 * Check for alternating patterns
 */
function hasAlternatingPattern(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s/g, '');
  return ALTERNATING_PATTERN.test(normalized);
}

/**
 * Check if text is just random characters
 */
function isRandomCharacters(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s/g, '');
  
  // Skip short texts
  if (normalized.length < 8) {
    return false;
  }
  
  // Check for lack of common letter combinations
  const commonBigrams = ['th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'en', 'nd'];
  let bigramCount = 0;
  
  for (const bigram of commonBigrams) {
    if (normalized.includes(bigram)) {
      bigramCount++;
    }
  }
  
  // If no common bigrams in a text of 20+ chars, likely nonsense
  if (normalized.length >= 20 && bigramCount === 0) {
    return true;
  }
  
  return false;
}

/**
 * Check if text contains only special characters or numbers
 */
function isOnlySpecialOrNumbers(text: string): boolean {
  const lettersOnly = text.replace(/[^a-zA-Z]/g, '');
  return lettersOnly.length < 3 && text.length >= 5;
}

/**
 * Main nonsense detection function
 */
export function detectNonsense(text: string): NonsenseCheckResult {
  // Trim and normalize
  const trimmed = text.trim();
  
  // Empty or very short text is handled by word count validation
  if (trimmed.length < 5) {
    return { isNonsense: false };
  }
  
  // Check for keyboard smashing
  if (hasKeyboardSmashing(trimmed)) {
    return {
      isNonsense: true,
      reason: 'keyboard_smashing',
    };
  }
  
  // Check for excessive repetition
  if (hasExcessiveRepetition(trimmed)) {
    return {
      isNonsense: true,
      reason: 'excessive_repetition',
    };
  }
  
  // Check for alternating patterns
  if (hasAlternatingPattern(trimmed)) {
    return {
      isNonsense: true,
      reason: 'alternating_pattern',
    };
  }
  
  // Check for low vowel ratio
  if (hasLowVowelRatio(trimmed)) {
    return {
      isNonsense: true,
      reason: 'low_vowel_ratio',
    };
  }
  
  // Check for random characters
  if (isRandomCharacters(trimmed)) {
    return {
      isNonsense: true,
      reason: 'random_characters',
    };
  }
  
  // Check for only special characters or numbers
  if (isOnlySpecialOrNumbers(trimmed)) {
    return {
      isNonsense: true,
      reason: 'no_letters',
    };
  }
  
  return { isNonsense: false };
}

/**
 * Get user-friendly error message for nonsense detection
 */
export function getNonsenseErrorMessage(reason?: string): string {
  switch (reason) {
    case 'keyboard_smashing':
    case 'alternating_pattern':
    case 'random_characters':
      return 'Type a real explanation to unlock the answer.';
    case 'excessive_repetition':
      return 'Please write a meaningful explanation without repeated characters.';
    case 'low_vowel_ratio':
      return 'Your response doesn\'t look like a real explanation. Try again.';
    case 'no_letters':
      return 'Please write your explanation using words, not just numbers or symbols.';
    default:
      return 'Type a real explanation to unlock the answer.';
  }
}

/**
 * Validate attempt text for nonsense before submission
 */
export function validateAttemptForNonsense(text: string): {
  valid: boolean;
  error?: string;
} {
  const result = detectNonsense(text);
  
  if (result.isNonsense) {
    return {
      valid: false,
      error: getNonsenseErrorMessage(result.reason),
    };
  }
  
  return { valid: true };
}
