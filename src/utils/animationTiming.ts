/**
 * Animation Timing Constants
 * PRD-compliant animation durations for consistent UX
 */

// Duration constants in milliseconds
export const ANIMATION_DURATION = {
  /** Fast interactions: taps, toggles, micro-interactions (150-180ms) */
  FAST: 165,
  FAST_MIN: 150,
  FAST_MAX: 180,
  
  /** Standard transitions: screen changes, modals, panels (220-260ms) */
  STANDARD: 240,
  STANDARD_MIN: 220,
  STANDARD_MAX: 260,
  
  /** Slow animations: unlock effects, celebrations, complex animations (300-350ms) */
  SLOW: 325,
  SLOW_MIN: 300,
  SLOW_MAX: 350,
  
  /** Streak pill animation duration */
  STREAK_PULSE: 350,
  
  /** Mastery mode heat shimmer duration */
  MASTERY_SHIMMER: 500,
  
  /** Loading message cycle interval */
  LOADING_CYCLE: 1500,
} as const;

// Easing curves
export const EASING = {
  /** Standard ease-in-out for most animations */
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  /** Ease-out for elements entering */
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  
  /** Ease-in for elements exiting */
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  
  /** Spring-like bounce for celebrations */
  SPRING: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  /** Linear for continuous animations */
  LINEAR: 'linear',
} as const;

// Easing curve as array for motion libraries (Framer Motion format)
export const ANIMATION_EASING = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  /** Button tap feedback */
  buttonTap: {
    duration: ANIMATION_DURATION.FAST,
    easing: EASING.EASE_OUT,
  },
  
  /** Modal open/close */
  modal: {
    duration: ANIMATION_DURATION.STANDARD,
    easing: EASING.EASE_IN_OUT,
  },
  
  /** Screen transition */
  screenTransition: {
    duration: ANIMATION_DURATION.STANDARD,
    easing: EASING.EASE_IN_OUT,
  },
  
  /** Unlock celebration */
  unlock: {
    duration: ANIMATION_DURATION.SLOW,
    easing: EASING.SPRING,
  },
  
  /** Badge reveal */
  badgeReveal: {
    duration: ANIMATION_DURATION.SLOW,
    easing: EASING.SPRING,
  },
  
  /** Streak pulse */
  streakPulse: {
    duration: ANIMATION_DURATION.STREAK_PULSE,
    easing: EASING.EASE_IN_OUT,
    keyframes: {
      scale: [1, 1.1, 1],
    },
  },
  
  /** Shake animation for validation errors */
  shake: {
    duration: ANIMATION_DURATION.FAST,
    easing: EASING.EASE_IN_OUT,
    keyframes: {
      x: [0, -10, 10, -10, 10, 0] as number[],
    },
  },
} as const;

/**
 * Validates that an animation duration falls within PRD-compliant ranges
 */
export function isValidAnimationDuration(
  duration: number,
  type: 'fast' | 'standard' | 'slow'
): boolean {
  switch (type) {
    case 'fast':
      return duration >= ANIMATION_DURATION.FAST_MIN && duration <= ANIMATION_DURATION.FAST_MAX;
    case 'standard':
      return duration >= ANIMATION_DURATION.STANDARD_MIN && duration <= ANIMATION_DURATION.STANDARD_MAX;
    case 'slow':
      return duration >= ANIMATION_DURATION.SLOW_MIN && duration <= ANIMATION_DURATION.SLOW_MAX;
    default:
      return false;
  }
}

/**
 * Get CSS transition string for a preset
 */
export function getTransitionCSS(
  property: string,
  preset: keyof typeof ANIMATION_PRESETS
): string {
  const config = ANIMATION_PRESETS[preset];
  return `${property} ${config.duration}ms ${config.easing}`;
}
