import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';

interface NudgeNotification {
  id: string;
  fromName: string;
  timestamp: number;
}

interface NudgeNotificationBannerProps {
  notifications: NudgeNotification[];
  onDismiss: (id: string) => void;
}

export function NudgeNotificationBanner({ notifications, onDismiss }: NudgeNotificationBannerProps) {
  if (notifications.length === 0) return null;

  const notification = notifications[0]; // Show only the first notification

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={notification.id}
        className="fixed top-6 left-6 right-6 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 25,
          duration: 0.5 
        }}
      >
        <motion.div
          className="relative rounded-[20px] p-4 overflow-hidden"
          style={{
            background: 'rgba(20, 20, 20, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 191, 0, 0.3)',
            boxShadow: '0 0 40px rgba(255, 191, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Golden Glow */}
          <div 
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 191, 0, 0.4) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 flex items-start gap-3">
            {/* Bell Icon with Animation */}
            <motion.div 
              className="w-10 h-10 rounded-full bg-[#FFBF00]/20 border border-[#FFBF00]/40 flex items-center justify-center flex-shrink-0"
              animate={{
                rotate: [0, -15, 15, -15, 15, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
            >
              <Bell className="w-5 h-5 text-[#FFBF00]" />
            </motion.div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <p className="text-white text-sm mb-1" style={{ fontWeight: 600 }}>
                Family Squad Nudge
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                <span className="text-[#FFBF00]" style={{ fontWeight: 600 }}>
                  {notification.fromName}
                </span>{' '}
                sent you a gentle reminder! Keep your streak alive by unlocking 1 answer today.
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => onDismiss(notification.id)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
