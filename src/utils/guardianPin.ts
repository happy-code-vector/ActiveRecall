/**
 * Guardian PIN Utility
 * Manages PIN-protected guardian controls
 */

export interface GuardianSettings {
  pinHash: string;
  forceMasteryMode: boolean;
  blockMercyButton: boolean;
  frictionInterstitials: boolean;
  requireReason: boolean;
  reportEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const GUARDIAN_SETTINGS_KEY = 'thinkfirst_guardian_settings';
const PIN_ATTEMPTS_KEY = 'thinkfirst_pin_attempts';
const LOCKOUT_KEY = 'thinkfirst_pin_lockout';

// Constants
const MAX_PIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// SSR-safe localStorage access
const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

const removeItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

/**
 * Simple hash function for PIN (in production, use proper crypto)
 * This is a basic implementation - in production, use bcrypt or similar
 */
function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Add salt and convert to hex
  const salted = hash.toString(16) + '_tf_guardian';
  return btoa(salted);
}

/**
 * Validate PIN format (4 digits)
 */
export function isValidPinFormat(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/**
 * Check if guardian settings exist (PIN has been set)
 */
export function hasGuardianPin(): boolean {
  const settings = getGuardianSettings();
  return settings !== null && settings.pinHash !== '';
}

/**
 * Get guardian settings
 */
export function getGuardianSettings(): GuardianSettings | null {
  const stored = getItem(GUARDIAN_SETTINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Create initial guardian settings with PIN
 */
export function createGuardianPin(pin: string): {
  success: boolean;
  error?: string;
} {
  if (!isValidPinFormat(pin)) {
    return {
      success: false,
      error: 'PIN must be exactly 4 digits.',
    };
  }
  
  const settings: GuardianSettings = {
    pinHash: hashPin(pin),
    forceMasteryMode: false,
    blockMercyButton: false,
    frictionInterstitials: true,
    requireReason: true,
    reportEmail: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setItem(GUARDIAN_SETTINGS_KEY, JSON.stringify(settings));
  resetPinAttempts();
  
  return { success: true };
}

/**
 * Verify PIN
 */
export function verifyPin(pin: string): {
  success: boolean;
  error?: string;
  attemptsRemaining?: number;
  lockedUntil?: Date;
} {
  // Check lockout
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `Too many attempts. Try again in ${Math.ceil(lockout.remainingMs! / 60000)} minutes.`,
      lockedUntil: lockout.lockedUntil,
    };
  }
  
  const settings = getGuardianSettings();
  if (!settings) {
    return {
      success: false,
      error: 'Guardian PIN has not been set up.',
    };
  }
  
  const inputHash = hashPin(pin);
  if (inputHash === settings.pinHash) {
    resetPinAttempts();
    return { success: true };
  }
  
  // Wrong PIN - increment attempts
  const attempts = incrementPinAttempts();
  const remaining = MAX_PIN_ATTEMPTS - attempts;
  
  if (remaining <= 0) {
    setLockout();
    return {
      success: false,
      error: 'Too many incorrect attempts. Please wait 5 minutes.',
      attemptsRemaining: 0,
    };
  }
  
  return {
    success: false,
    error: `Incorrect PIN. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    attemptsRemaining: remaining,
  };
}

/**
 * Change PIN (requires current PIN verification)
 */
export function changePin(currentPin: string, newPin: string): {
  success: boolean;
  error?: string;
} {
  const verification = verifyPin(currentPin);
  if (!verification.success) {
    return verification;
  }
  
  if (!isValidPinFormat(newPin)) {
    return {
      success: false,
      error: 'New PIN must be exactly 4 digits.',
    };
  }
  
  const settings = getGuardianSettings();
  if (!settings) {
    return {
      success: false,
      error: 'Guardian settings not found.',
    };
  }
  
  settings.pinHash = hashPin(newPin);
  settings.updatedAt = new Date().toISOString();
  setItem(GUARDIAN_SETTINGS_KEY, JSON.stringify(settings));
  
  return { success: true };
}

/**
 * Update guardian settings (requires PIN verification first)
 */
export function updateGuardianSettings(
  updates: Partial<Omit<GuardianSettings, 'pinHash' | 'createdAt' | 'updatedAt'>>
): {
  success: boolean;
  error?: string;
} {
  const settings = getGuardianSettings();
  if (!settings) {
    return {
      success: false,
      error: 'Guardian settings not found.',
    };
  }
  
  const updatedSettings: GuardianSettings = {
    ...settings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  setItem(GUARDIAN_SETTINGS_KEY, JSON.stringify(updatedSettings));
  return { success: true };
}

/**
 * Check if Force Mastery Mode is enabled
 */
export function isForceMasteryEnabled(): boolean {
  const settings = getGuardianSettings();
  return settings?.forceMasteryMode ?? false;
}

/**
 * Check if Mercy Button is blocked
 */
export function isMercyButtonBlocked(): boolean {
  const settings = getGuardianSettings();
  return settings?.blockMercyButton ?? false;
}

// PIN attempt tracking helpers
function getPinAttempts(): number {
  const stored = getItem(PIN_ATTEMPTS_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementPinAttempts(): number {
  const attempts = getPinAttempts() + 1;
  setItem(PIN_ATTEMPTS_KEY, String(attempts));
  return attempts;
}

function resetPinAttempts(): void {
  removeItem(PIN_ATTEMPTS_KEY);
  removeItem(LOCKOUT_KEY);
}

function setLockout(): void {
  const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
  setItem(LOCKOUT_KEY, String(lockoutUntil));
}

function getLockoutStatus(): {
  isLocked: boolean;
  lockedUntil?: Date;
  remainingMs?: number;
} {
  const stored = getItem(LOCKOUT_KEY);
  if (!stored) {
    return { isLocked: false };
  }
  
  const lockoutUntil = parseInt(stored, 10);
  const now = Date.now();
  
  if (now >= lockoutUntil) {
    resetPinAttempts();
    return { isLocked: false };
  }
  
  return {
    isLocked: true,
    lockedUntil: new Date(lockoutUntil),
    remainingMs: lockoutUntil - now,
  };
}

/**
 * Reset guardian settings (for testing/recovery)
 */
export function resetGuardianSettings(): void {
  removeItem(GUARDIAN_SETTINGS_KEY);
  removeItem(PIN_ATTEMPTS_KEY);
  removeItem(LOCKOUT_KEY);
}
