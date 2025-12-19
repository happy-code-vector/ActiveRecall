import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock } from 'lucide-react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onUpgrade: () => void;
  onClose: () => void;
  currentCount?: number;
  maxCount?: number;
}

export function LimitReachedModal({ 
  isOpen, 
  onUpgrade, 
  onClose,
  currentCount = 5,
  maxCount = 5 
}: LimitReachedModalProps) {
  const progressPercentage = (currentCount / maxCount) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-[#1A1A1A] rounded-3xl p-8 max-w-sm w-full"
            style={{
              border: '1px solid rgba(255, 100, 100, 0.2)',
              boxShadow: '0 20px 60px rgba(255, 100, 100, 0.15)',
            }}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button (X) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white bg-opacity-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-opacity-10 transition-all"
            >
              ✕
            </button>

            {/* Padlock Icon with glow */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="relative w-24 h-24 flex items-center justify-center"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Outer glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 100, 50, 0.3) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Lock background circle */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 100, 50, 0.2), rgba(255, 50, 50, 0.2))',
                    boxShadow: '0 0 40px rgba(255, 100, 50, 0.4)',
                  }}
                >
                  <Lock 
                    size={40} 
                    style={{ 
                      color: '#FF6432',
                      filter: 'drop-shadow(0 0 8px rgba(255, 100, 50, 0.6))',
                    }}
                    strokeWidth={2.5}
                  />
                </div>
              </motion.div>
            </div>

            {/* Header */}
            <motion.h2
              className="text-white text-center text-2xl mb-3"
              style={{ fontWeight: 700 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Brain Power Depleted.
            </motion.h2>

            {/* Body text */}
            <motion.p
              className="text-gray-400 text-center mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              You&apos;ve hit your daily limit of <span className="text-white" style={{ fontWeight: 600 }}>{maxCount} meaningful unlocks</span>. Upgrade to keep learning or come back tomorrow.
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Daily Unlocks</span>
                <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                  {currentCount}/{maxCount}
                </span>
              </div>
              
              {/* Progress bar track */}
              <div className="w-full h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, #FF6432, #FF4520)',
                    width: `${progressPercentage}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                >
                  {/* Shine effect on progress bar */}
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={onUpgrade}
              className="w-full py-4 rounded-full relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8A2BE2, #6A1BB2)',
                fontWeight: 700,
                fontSize: '16px',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 text-white">Unlock Unlimited Access</span>
              
              {/* Shine animation */}
              <motion.div
                className="absolute inset-0 w-full h-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: 'linear',
                }}
              />
            </motion.button>

            {/* Secondary action */}
            <motion.button
              onClick={onClose}
              className="w-full mt-3 py-3 text-gray-500 text-sm"
              style={{ fontWeight: 500 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.98 }}
            >
              I&apos;ll wait until tomorrow
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
