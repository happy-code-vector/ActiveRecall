/**
 * Haptic Feedback Utility
 * Provides tactile feedback for key interactions on supported devices
 */

export type HapticPattern = 'tick' | 'heavy' | 'revving' | 'warning';

// Vibration patterns in milliseconds
// Format: [vibrate, pause, vibrate, pause, ...]
const HAPTIC_PATTERNS: Record<HapticPattern, number[]> = {
  /** Light tick for typing and micro-interactions */
  tick: [10],
  
  /** Heavy impact for successful unlock */
  heavy: [50],
  
  /** Revving pattern for Mastery Mode toggle */
  revving: [20, 30, 40, 30, 60],
  
  /** Warning double-tap for validation failures */
  warning: [30, 50, 30],
};

// Storage key for haptic preference
const HAPTIC_ENABLED_KEY = 'thinkfirst_haptics_enabled';

// SSR-safe localStorage access
const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         'vibrate' in navigator && 
         typeof navigator.vibrate === 'function';
}

/**
 * Check if haptic feedback is enabled by user
 */
export function isHapticEnabled(): boolean {
  const stored = getItem(HAPTIC_ENABLED_KEY);
  return stored !== 'false'; // Default to enabled
}

/**
 * Set haptic feedback preference
 */
export function setHapticEnabled(enabled: boolean): void {
  setItem(HAPTIC_ENABLED_KEY, String(enabled));
}

/**
 * Trigger haptic feedback with specified pattern
 */
export function triggerHaptic(pattern: HapticPattern): boolean {
  if (!isHapticSupported() || !isHapticEnabled()) {
    return false;
  }
  
  try {
    const vibrationPattern = HAPTIC_PATTERNS[pattern];
    return navigator.vibrate(vibrationPattern);
  } catch {
    return false;
  }
}

/**
 * Stop any ongoing vibration
 */
export function stopHaptic(): boolean {
  if (!isHapticSupported()) {
    return false;
  }
  
  try {
    return navigator.vibrate(0);
  } catch {
    return false;
  }
}

/**
 * Trigger haptic for typing (debounced internally)
 */
let lastTickTime = 0;
const TICK_DEBOUNCE_MS = 50;

export function triggerTypingHaptic(): boolean {
  const now = Date.now();
  if (now - lastTickTime < TICK_DEBOUNCE_MS) {
    return false;
  }
  lastTickTime = now;
  return triggerHaptic('tick');
}

/**
 * Trigger haptic for successful unlock
 */
export function triggerUnlockHaptic(): boolean {
  return triggerHaptic('heavy');
}

/**
 * Trigger haptic for Mastery Mode toggle
 */
export function triggerMasteryToggleHaptic(): boolean {
  return triggerHaptic('revving');
}

/**
 * Trigger haptic for validation failure
 */
export function triggerValidationErrorHaptic(): boolean {
  return triggerHaptic('warning');
}

/**
 * Get haptic configuration for settings display
 */
export function getHapticConfig(): {
  supported: boolean;
  enabled: boolean;
  patterns: typeof HAPTIC_PATTERNS;
} {
  return {
    supported: isHapticSupported(),
    enabled: isHapticEnabled(),
    patterns: HAPTIC_PATTERNS,
  };
}
