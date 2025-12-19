import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { getBadgeById } from '../utils/badgeDefinitions';

interface BadgeUnlockModalProps {
  isOpen: boolean;
  badges: string[] | { badgeId: string }[];
  currentBadgeIndex?: number;
  onClose: () => void;
  onNext?: () => void;
  // Legacy support for single badge
  badgeId?: string;
}

export function BadgeUnlockModal({ isOpen, badges, currentBadgeIndex = 0, onClose, onNext, badgeId }: BadgeUnlockModalProps) {
  // Support legacy single badge mode or new multiple badge mode
  const badgeIds = badgeId ? [badgeId] : (badges || []).map(b => typeof b === 'string' ? b : b.badgeId);
  const currentBadgeId = badgeIds[currentBadgeIndex];
  const badge = getBadgeById(currentBadgeId);
  
  const hasMore = currentBadgeIndex < badgeIds.length - 1;

  if (!badge) return null;

  const Icon = badge.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Content - "The Loot Box" Moment */}
          <motion.div
            className="relative z-10 w-full max-w-sm"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.1, 1],
              opacity: 1,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 400,
              damping: 25,
              duration: 0.6,
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-20"
            >
              <X size={20} className="text-white" />
            </button>

            <div
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${badge.color}20, ${badge.colorEnd}20)`,
                backdropFilter: 'blur(20px)',
                border: `2px solid ${badge.color}40`,
              }}
            >
              {/* "Badge Unlocked" Text - Slides up + fades in (Delay: 100ms) */}
              <motion.div
                className="absolute top-6 left-0 right-0 text-center z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <span 
                  className="text-white text-sm tracking-wider"
                  style={{ fontWeight: 700 }}
                >
                  🎉 BADGE UNLOCKED
                </span>
              </motion.div>

              <div className="p-12 pt-16">
                {/* Badge Icon with Radial Glow - "The Loot Box" */}
                <div className="flex justify-center mb-6 relative">
                  {/* Radial glow that rotates (Infinite loop, 4s duration) */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: '200px',
                      height: '200px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: `radial-gradient(circle, ${badge.color}60 0%, ${badge.colorEnd}40 40%, transparent 70%)`,
                    }}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                  />

                  {/* Badge Container - Scales up with bounce */}
                  <motion.div
                    className="w-32 h-32 rounded-3xl relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${badge.color}, ${badge.colorEnd})`,
                      boxShadow: `0 0 60px ${badge.color}80`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1.1, 1],
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: 0.05,
                    }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
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

                    {/* Icon */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2,
                        }}
                      >
                        <Icon
                          size={64}
                          className="text-white drop-shadow-2xl"
                          strokeWidth={2}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Badge Name */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
                    {badge.name}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4">
                    {badge.description}
                  </p>

                  {/* Rarity Badge */}
                  <div className="flex justify-center">
                    <motion.div
                      className="px-4 py-1.5 rounded-full"
                      style={{
                        background: `${badge.color}30`,
                        border: `1px solid ${badge.color}60`,
                        color: badge.color,
                        fontWeight: 700,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Continue/Close Button */}
                <motion.button
                  onClick={hasMore ? onNext : onClose}
                  className="w-full py-3 rounded-2xl text-white mt-6 transition-all active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${badge.color}, ${badge.colorEnd})`,
                    fontWeight: 600,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {hasMore ? `Next (${currentBadgeIndex + 1}/${badgeIds.length})` : 'Awesome!'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}