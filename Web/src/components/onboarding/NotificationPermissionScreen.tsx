import React from 'react';
import { motion } from 'motion/react';
import { Bell } from 'lucide-react';

interface NotificationPermissionScreenProps {
  onEnable: () => void;
  onSkip: () => void;
}

export function NotificationPermissionScreen({ onEnable, onSkip }: NotificationPermissionScreenProps) {
  const handleEnable = () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
    onEnable();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12">
      {/* 3D Bell Icon */}
      <motion.div
        className="mb-12 relative"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Bell container with 3D chrome effect */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Glow layer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(100, 100, 120, 0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Main bell with chrome effect */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Shadow layers for depth */}
            <div
              className="absolute inset-0 blur-xl opacity-40"
              style={{
                transform: 'translateY(8px)',
                background: 'radial-gradient(circle, rgba(80, 80, 100, 0.6) 0%, transparent 60%)',
              }}
            />
            
            {/* Bell with gradient chrome effect */}
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3A3A4A 0%, #2A2A38 50%, #1A1A28 100%)',
                boxShadow: `
                  0 10px 30px rgba(0, 0, 0, 0.6),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.5)
                `,
              }}
            >
              {/* Highlight reflection */}
              <div
                className="absolute top-2 left-2 right-2 h-8 rounded-full opacity-30"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent)',
                }}
              />
              
              <Bell 
                size={48} 
                className="relative z-10"
                style={{ 
                  color: '#E8E8F0',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                }}
                strokeWidth={2}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-white text-3xl text-center mb-4"
        style={{ fontWeight: 600 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Protect Your Streak.
      </motion.h1>

      {/* Body Text */}
      <motion.p
        className="text-gray-400 text-center max-w-sm mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        We only notify you to keep your learning streak alive. No spam.
      </motion.p>

      {/* Buttons */}
      <div className="w-full max-w-sm space-y-4">
        {/* Enable Notifications - Primary Button */}
        <motion.button
          onClick={handleEnable}
          className="w-full bg-white text-black px-6 py-4 rounded-full"
          style={{ fontWeight: 600 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          whileTap={{ scale: 0.98 }}
        >
          Enable Notifications
        </motion.button>

        {/* Maybe Later - Text Button */}
        <motion.button
          onClick={onSkip}
          className="w-full text-gray-500 py-4"
          style={{ fontWeight: 500 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileTap={{ scale: 0.98 }}
        >
          Maybe Later
        </motion.button>
      </div>
    </div>
  );
}
