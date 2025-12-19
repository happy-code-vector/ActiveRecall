/**
 * Notification System
 * Manages nudge notifications and reminders
 */

export interface NotificationConfig {
  enabled: boolean;
  day1Nudge: boolean;
  day2Nudge: boolean;
  masteryNudge: boolean;
}

export interface ScheduledNotification {
  id: string;
  type: 'day1' | 'day2' | 'mastery' | 'streak_risk';
  message: string;
  scheduledFor: string;
  sent: boolean;
}

// Storage keys
const NOTIFICATION_CONFIG_KEY = 'thinkfirst_notification_config';
const SCHEDULED_NOTIFICATIONS_KEY = 'thinkfirst_scheduled_notifications';
const SESSION_COUNT_KEY = 'thinkfirst_session_count';
const HIGH_EFFORT_COUNT_KEY = 'thinkfirst_high_effort_count';

// Notification messages
const NOTIFICATION_MESSAGES = {
  day1: 'Nice effort today. Want to try one more?',
  day2: "Let's build Day 2. One explanation is all it takes.",
  mastery: 'Go Mastery — double your streak tonight?',
  streakRisk: "Don't lose your streak! Quick question before bed?",
};

/**
 * Get notification configuration
 */
export function getNotificationConfig(): NotificationConfig {
  const stored = localStorage.getItem(NOTIFICATION_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Return default
    }
  }
  return {
    enabled: true,
    day1Nudge: true,
    day2Nudge: true,
    masteryNudge: true,
  };
}

/**
 * Save notification configuration
 */
export function saveNotificationConfig(config: NotificationConfig): void {
  localStorage.setItem(NOTIFICATION_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Check if browser notifications are supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Send a browser notification
 */
export function sendNotification(
  title: string,
  body: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }
  
  try {
    return new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      ...options,
    });
  } catch {
    return null;
  }
}

/**
 * Schedule Day 1 nudge notification
 */
export function scheduleDay1Nudge(): void {
  const config = getNotificationConfig();
  if (!config.enabled || !config.day1Nudge) {
    return;
  }
  
  // Schedule for 2 hours after first activity
  const scheduledFor = new Date(Date.now() + 2 * 60 * 60 * 1000);
  
  const notification: ScheduledNotification = {
    id: `day1_${Date.now()}`,
    type: 'day1',
    message: NOTIFICATION_MESSAGES.day1,
    scheduledFor: scheduledFor.toISOString(),
    sent: false,
  };
  
  saveScheduledNotification(notification);
}

/**
 * Schedule Day 2 nudge notification
 */
export function scheduleDay2Nudge(): void {
  const config = getNotificationConfig();
  if (!config.enabled || !config.day2Nudge) {
    return;
  }
  
  // Schedule for 10 AM next day
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const notification: ScheduledNotification = {
    id: `day2_${Date.now()}`,
    type: 'day2',
    message: NOTIFICATION_MESSAGES.day2,
    scheduledFor: tomorrow.toISOString(),
    sent: false,
  };
  
  saveScheduledNotification(notification);
}

/**
 * Schedule Mastery Mode nudge
 */
export function scheduleMasteryNudge(): void {
  const config = getNotificationConfig();
  if (!config.enabled || !config.masteryNudge) {
    return;
  }
  
  // Schedule for 7 PM today or tomorrow
  const now = new Date();
  const scheduledFor = new Date();
  scheduledFor.setHours(19, 0, 0, 0);
  
  if (now.getHours() >= 19) {
    scheduledFor.setDate(scheduledFor.getDate() + 1);
  }
  
  const notification: ScheduledNotification = {
    id: `mastery_${Date.now()}`,
    type: 'mastery',
    message: NOTIFICATION_MESSAGES.mastery,
    scheduledFor: scheduledFor.toISOString(),
    sent: false,
  };
  
  saveScheduledNotification(notification);
}

/**
 * Save a scheduled notification
 */
function saveScheduledNotification(notification: ScheduledNotification): void {
  const notifications = getScheduledNotifications();
  
  // Remove existing notifications of the same type
  const filtered = notifications.filter(n => n.type !== notification.type);
  filtered.push(notification);
  
  localStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(filtered));
}

/**
 * Get all scheduled notifications
 */
export function getScheduledNotifications(): ScheduledNotification[] {
  const stored = localStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Check and send due notifications
 */
export function checkAndSendDueNotifications(): void {
  const notifications = getScheduledNotifications();
  const now = new Date();
  
  for (const notification of notifications) {
    if (notification.sent) continue;
    
    const scheduledTime = new Date(notification.scheduledFor);
    if (now >= scheduledTime) {
      sendNotification('ThinkFirst', notification.message);
      notification.sent = true;
    }
  }
  
  localStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

/**
 * Track session count for App Store review prompt
 */
export function incrementSessionCount(): number {
  const count = getSessionCount() + 1;
  localStorage.setItem(SESSION_COUNT_KEY, String(count));
  return count;
}

/**
 * Get current session count
 */
export function getSessionCount(): number {
  const stored = localStorage.getItem(SESSION_COUNT_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

/**
 * Track high effort unlocks for App Store review prompt
 */
export function incrementHighEffortCount(): number {
  const count = getHighEffortCount() + 1;
  localStorage.setItem(HIGH_EFFORT_COUNT_KEY, String(count));
  return count;
}

/**
 * Get high effort unlock count
 */
export function getHighEffortCount(): number {
  const stored = localStorage.getItem(HIGH_EFFORT_COUNT_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

/**
 * Check if should prompt for App Store review
 * Triggers on 3rd+ session with high effort unlock
 */
export function shouldPromptForReview(): boolean {
  const sessionCount = getSessionCount();
  const highEffortCount = getHighEffortCount();
  
  // Prompt on 3rd+ session with at least one high effort unlock
  return sessionCount >= 3 && highEffortCount > 0;
}

/**
 * Clear all scheduled notifications
 */
export function clearScheduledNotifications(): void {
  localStorage.removeItem(SCHEDULED_NOTIFICATIONS_KEY);
}
