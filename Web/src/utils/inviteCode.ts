/**
 * Invite Code System
 * Manages family plan invite codes for linking student accounts
 */

export interface InviteCode {
  code: string; // Format: "FAM-XXX"
  parentUserId: string;
  subscriptionId: string;
  createdAt: string;
  linkedAccounts: string[];
  maxAccounts: number;
}

// Storage keys
const INVITE_CODE_KEY = 'thinkfirst_invite_code';
const FAMILY_LINK_KEY = 'thinkfirst_family_link';

// Constants
const MAX_FAMILY_ACCOUNTS = 5;
const CODE_PREFIX = 'FAM-';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars: I, O, 0, 1

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
 * Generate a random 3-character code
 */
function generateRandomCode(): string {
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

/**
 * Generate a new invite code for a family plan
 */
export function generateInviteCode(
  parentUserId: string,
  subscriptionId: string
): InviteCode {
  const code = `${CODE_PREFIX}${generateRandomCode()}`;
  
  const inviteCode: InviteCode = {
    code,
    parentUserId,
    subscriptionId,
    createdAt: new Date().toISOString(),
    linkedAccounts: [],
    maxAccounts: MAX_FAMILY_ACCOUNTS,
  };
  
  // Store the invite code
  setItem(INVITE_CODE_KEY, JSON.stringify(inviteCode));
  
  return inviteCode;
}

/**
 * Get the current invite code (for parents)
 */
export function getInviteCode(): InviteCode | null {
  const stored = getItem(INVITE_CODE_KEY);
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
 * Validate invite code format
 */
export function isValidInviteCodeFormat(code: string): boolean {
  const pattern = /^FAM-[A-Z0-9]{3}$/;
  return pattern.test(code.toUpperCase());
}

/**
 * Validate an invite code (simulated - in production this would be a server call)
 * Returns the invite code data if valid, null if invalid
 */
export function validateInviteCode(code: string): {
  valid: boolean;
  error?: string;
  inviteCode?: InviteCode;
} {
  // Check format
  if (!isValidInviteCodeFormat(code)) {
    return {
      valid: false,
      error: 'Invalid code format. Please enter a code like FAM-ABC.',
    };
  }
  
  // In a real app, this would validate against the server
  // For now, we'll check localStorage (simulating a valid code scenario)
  const storedCode = getInviteCode();
  
  if (!storedCode) {
    return {
      valid: false,
      error: 'This invite code is not recognized.',
    };
  }
  
  if (storedCode.code.toUpperCase() !== code.toUpperCase()) {
    return {
      valid: false,
      error: 'This invite code is not recognized.',
    };
  }
  
  // Check if family is full
  if (storedCode.linkedAccounts.length >= storedCode.maxAccounts) {
    return {
      valid: false,
      error: 'This family plan has reached its maximum of 5 members.',
    };
  }
  
  return {
    valid: true,
    inviteCode: storedCode,
  };
}

/**
 * Link a student account to a family plan
 */
export function linkStudentToFamily(
  studentUserId: string,
  inviteCode: InviteCode
): {
  success: boolean;
  error?: string;
} {
  // Check if already linked
  if (inviteCode.linkedAccounts.includes(studentUserId)) {
    return {
      success: false,
      error: 'This account is already linked to this family.',
    };
  }
  
  // Check capacity
  if (inviteCode.linkedAccounts.length >= inviteCode.maxAccounts) {
    return {
      success: false,
      error: 'This family plan has reached its maximum of 5 members.',
    };
  }
  
  // Add student to linked accounts
  inviteCode.linkedAccounts.push(studentUserId);
  
  // Update stored invite code
  setItem(INVITE_CODE_KEY, JSON.stringify(inviteCode));
  
  // Store family link for the student
  setItem(FAMILY_LINK_KEY, JSON.stringify({
    familyCode: inviteCode.code,
    parentUserId: inviteCode.parentUserId,
    linkedAt: new Date().toISOString(),
  }));
  
  return { success: true };
}

/**
 * Get family link status for a student
 */
export function getFamilyLinkStatus(): {
  isLinked: boolean;
  familyCode?: string;
  parentUserId?: string;
  linkedAt?: string;
} {
  const stored = getItem(FAMILY_LINK_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      return {
        isLinked: true,
        ...data,
      };
    } catch {
      return { isLinked: false };
    }
  }
  return { isLinked: false };
}

/**
 * Unlink a student from a family plan
 */
export function unlinkFromFamily(studentUserId: string): boolean {
  const inviteCode = getInviteCode();
  if (inviteCode) {
    inviteCode.linkedAccounts = inviteCode.linkedAccounts.filter(
      id => id !== studentUserId
    );
    setItem(INVITE_CODE_KEY, JSON.stringify(inviteCode));
  }
  
  removeItem(FAMILY_LINK_KEY);
  return true;
}

/**
 * Get the number of available slots in a family plan
 */
export function getAvailableFamilySlots(): number {
  const inviteCode = getInviteCode();
  if (!inviteCode) {
    return 0;
  }
  return inviteCode.maxAccounts - inviteCode.linkedAccounts.length;
}
