/**
 * Clipboard Detection Hook
 * Detects text in clipboard for quick question input
 */

import { useState, useEffect, useCallback } from 'react';

export interface ClipboardState {
  hasText: boolean;
  text: string | null;
  truncatedText: string | null;
  isLoading: boolean;
  error: string | null;
}

const MAX_TRUNCATE_LENGTH = 50;

/**
 * Truncate text to specified length with ellipsis
 */
function truncateText(text: string, maxLength: number = MAX_TRUNCATE_LENGTH): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Check if text looks like a valid question or content
 * Filters out URLs, code snippets, etc.
 */
function isValidClipboardContent(text: string): boolean {
  // Skip if too short
  if (text.trim().length < 5) {
    return false;
  }
  
  // Skip if it's a URL
  if (/^https?:\/\//i.test(text.trim())) {
    return false;
  }
  
  // Skip if it looks like code (has too many special characters)
  const specialCharRatio = (text.match(/[{}[\]();=<>]/g) || []).length / text.length;
  if (specialCharRatio > 0.1) {
    return false;
  }
  
  return true;
}

/**
 * Hook for detecting and using clipboard text
 */
export function useClipboard(): ClipboardState & {
  readClipboard: () => Promise<void>;
  clearClipboard: () => void;
} {
  const [state, setState] = useState<ClipboardState>({
    hasText: false,
    text: null,
    truncatedText: null,
    isLoading: true,
    error: null,
  });

  const readClipboard = useCallback(async () => {
    // Check if clipboard API is available
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setState({
        hasText: false,
        text: null,
        truncatedText: null,
        isLoading: false,
        error: 'Clipboard API not available',
      });
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      
      if (text && isValidClipboardContent(text)) {
        const trimmedText = text.trim();
        setState({
          hasText: true,
          text: trimmedText,
          truncatedText: truncateText(trimmedText),
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          hasText: false,
          text: null,
          truncatedText: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (err) {
      // Permission denied or other error - fail silently
      setState({
        hasText: false,
        text: null,
        truncatedText: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to read clipboard',
      });
    }
  }, []);

  const clearClipboard = useCallback(() => {
    setState({
      hasText: false,
      text: null,
      truncatedText: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Read clipboard on mount
  useEffect(() => {
    readClipboard();
  }, [readClipboard]);

  // Re-read clipboard when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      readClipboard();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [readClipboard]);

  return {
    ...state,
    readClipboard,
    clearClipboard,
  };
}

export default useClipboard;
