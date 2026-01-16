// Difficulty level type (should match App.tsx when defined there)
export type DifficultyLevel = 'base' | 'mid' | 'mastery';

// Minimum word count for valid attempts
export const MINIMUM_WORD_COUNT = 10;

/**
 * Count words in a text string
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Validate minimum word count for an attempt
 */
export function validateMinimumWords(text: string, minWords: number = MINIMUM_WORD_COUNT): {
  valid: boolean;
  wordCount: number;
  message?: string;
} {
  const wordCount = countWords(text);
  
  if (wordCount < minWords) {
    return {
      valid: false,
      wordCount,
      message: 'Add a bit more detail so I can understand you.',
    };
  }
  
  return {
    valid: true,
    wordCount,
  };
}

/**
 * Check if submit should be disabled based on word count
 */
export function isSubmitDisabled(text: string, minWords: number = MINIMUM_WORD_COUNT): boolean {
  return countWords(text) < minWords;
}

// Simple keyword extraction and matching for validation
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'it', 'its',
    'that', 'this', 'these', 'those', 'what', 'which', 'who', 'when', 'where',
    'why', 'how', 'i', 'you', 'he', 'she', 'we', 'they', 'them', 'their'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
}

// Get expected keywords based on the question
function getExpectedKeywords(question: string): string[] {
  const questionLower = question.toLowerCase();
  
  // Topic-specific keywords
  const topicKeywords: Record<string, string[]> = {
    mitochondria: ['energy', 'cell', 'power', 'atp', 'cellular', 'respiration', 'organelle', 'membrane'],
    photosynthesis: ['light', 'energy', 'glucose', 'oxygen', 'carbon', 'dioxide', 'chloroplast', 'plant'],
    dna: ['genetic', 'nucleotide', 'helix', 'information', 'gene', 'chromosome', 'base', 'adenine', 'thymine', 'guanine', 'cytosine'],
    protein: ['amino', 'acid', 'synthesis', 'molecule', 'enzyme', 'structure', 'function'],
    cell: ['membrane', 'nucleus', 'organelle', 'cytoplasm', 'structure', 'function'],
    evolution: ['natural', 'selection', 'adaptation', 'species', 'darwin', 'mutation', 'genetic'],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (questionLower.includes(topic)) {
      return keywords;
    }
  }

  // Default: extract from question
  return extractKeywords(question);
}

// Calculate similarity score
function calculateSimilarity(userKeywords: string[], expectedKeywords: string[]): number {
  if (expectedKeywords.length === 0) return 0.5; // Neutral score for unknown topics

  const matches = userKeywords.filter(keyword =>
    expectedKeywords.some(expected => 
      keyword.includes(expected) || expected.includes(keyword)
    )
  ).length;

  return matches / expectedKeywords.length;
}

export function validateAnswer(
  question: string,
  attempt: string,
  level: DifficultyLevel,
  threshold: number,
  minWords: number
): { passed: boolean; message: string } {
  // Check word count
  const wordCount = attempt.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  if (wordCount < minWords) {
    return {
      passed: false,
      message: `Your answer needs at least ${minWords} words. Current count: ${wordCount}. Try to elaborate more on the concept.`,
    };
  }

  // Extract keywords
  const userKeywords = extractKeywords(attempt);
  const expectedKeywords = getExpectedKeywords(question);
  
  // Calculate similarity
  const similarity = calculateSimilarity(userKeywords, expectedKeywords);

  // Determine if passed based on threshold
  if (similarity >= threshold) {
    return {
      passed: true,
      message: level === 'mastery' 
        ? 'Excellent! Your answer demonstrates mastery of the concept.'
        : level === 'mid'
        ? 'Good work! Your answer shows solid understanding.'
        : 'Well done! Your answer shows basic understanding.',
    };
  }

  // Provide specific feedback
  const matchedKeywords = userKeywords.filter(keyword =>
    expectedKeywords.some(expected => 
      keyword.includes(expected) || expected.includes(keyword)
    )
  );

  if (matchedKeywords.length === 0) {
    return {
      passed: false,
      message: 'Your answer doesn\'t include key concepts related to this topic. Try to include more specific terminology and details.',
    };
  }

  if (level === 'base') {
    return {
      passed: false,
      message: `You're on the right track! Try to expand on your answer with more details about the concept's function and characteristics.`,
    };
  } else if (level === 'mid') {
    return {
      passed: false,
      message: `Your answer includes some key concepts, but needs more depth. Include additional important aspects of the topic.`,
    };
  } else {
    return {
      passed: false,
      message: `Your answer needs significant improvement. Mastery requires comprehensive understanding with precise terminology and detailed explanation.`,
    };
  }
}
