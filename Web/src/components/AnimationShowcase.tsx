import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Zap, 
  Sparkles, 
  Award,
  X,
  TrendingUp,
  Shield,
  Snowflake
} from 'lucide-react';

interface AnimationShowcaseProps {
  onBack: () => void;
}

export function AnimationShowcase({ onBack }: AnimationShowcaseProps) {
  const [masteryMode, setMasteryMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'student' | 'parent'>('student');
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [freezeActivated, setFreezeActivated] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div 
        className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.8))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
        
        <div className="mt-4">
          <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
            Animation Showcase
          </h1>
          <p className="text-gray-400 text-sm">
            Premium micro-animations and special effects
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        
        {/* 1. MASTERY MODE TOGGLE - "The Ignition" */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>
            1. Mastery Mode Toggle
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            "The Ignition" - Switch knob slides with spring (300ms), color crossfades (250ms), spark particles, heavy haptic
          </p>

          <motion.div
            className="relative overflow-hidden rounded-[20px] p-1"
            animate={{
              background: masteryMode
                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.15))'
                : 'linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(6, 182, 212, 0.15))',
              borderColor: masteryMode
                ? 'rgba(249, 115, 22, 0.3)'
                : 'rgba(34, 211, 238, 0.3)',
            }}
            transition={{ duration: 0.25 }}
            style={{
              border: '1.5px solid',
            }}
          >
            <div className="relative bg-black/40 backdrop-blur-sm rounded-[16px] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: masteryMode ? [0, 10, -10, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {masteryMode ? (
                      <Zap className="w-5 h-5 text-orange-400" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    )}
                  </motion.div>
                  <span className="text-white/90 text-[16px]" style={{ fontWeight: 600 }}>
                    Mastery Mode
                  </span>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => {
                    setMasteryMode(!masteryMode);
                    if (navigator.vibrate) {
                      navigator.vibrate(50);
                    }
                  }}
                  className="relative w-14 h-8 rounded-full transition-all overflow-hidden"
                  style={{
                    background: masteryMode
                      ? 'linear-gradient(135deg, #F97316, #EA580C)'
                      : 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                  }}
                >
                  {/* Spark effect when turning ON */}
                  {masteryMode && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
                      }}
                    />
                  )}

                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{
                      left: masteryMode ? '28px' : '4px',
                    }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 300, 
                      damping: 25,
                      duration: 0.3 
                    }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2. BADGE UNLOCK - "The Loot Box" */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>
            2. Badge Unlock Modal
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            "The Loot Box" - Badge scales 0→110%→100% (bouncy spring), radial glow rotates (4s), text slides up + fades
          </p>

          <button
            onClick={() => setShowBadgeModal(true)}
            className="w-full py-3 rounded-xl text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
              fontWeight: 600,
            }}
          >
            Show Badge Unlock
          </button>
        </div>

        {/* 3. PAYWALL TOGGLE - "The Sliding Door" */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>
            3. Paywall Segmented Toggle
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            "The Sliding Door" - Background pill slides (ease-in-out 250ms), content card crossfades + slides up 10px
          </p>

          <div
            className="relative p-1.5 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Sliding background */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-full"
              style={{
                width: 'calc(50% - 6px)',
                background: selectedPlan === 'student' 
                  ? 'linear-gradient(135deg, #8A2BE2, #6A1BB2)'
                  : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                boxShadow: selectedPlan === 'student'
                  ? '0 0 20px rgba(138, 43, 226, 0.5)'
                  : '0 0 20px rgba(59, 130, 246, 0.5)',
              }}
              animate={{
                left: selectedPlan === 'student' ? '6px' : 'calc(50% + 0px)',
              }}
              transition={{ 
                duration: 0.25,
                ease: 'easeInOut',
              }}
            />

            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setSelectedPlan('student')}
                className="flex-1 py-3 rounded-full transition-all relative z-10 flex items-center justify-center gap-2"
              >
                <Flame 
                  size={18} 
                  className={selectedPlan === 'student' ? 'text-white' : 'text-gray-500'}
                />
                <span
                  className={`text-sm ${
                    selectedPlan === 'student' ? 'text-white' : 'text-gray-500'
                  } transition-colors`}
                  style={{ fontWeight: 700 }}
                >
                  Student
                </span>
              </button>

              <button
                onClick={() => setSelectedPlan('parent')}
                className="flex-1 py-3 rounded-full transition-all relative z-10 flex items-center justify-center gap-2"
              >
                <TrendingUp 
                  size={18} 
                  className={selectedPlan === 'parent' ? 'text-white' : 'text-gray-500'}
                />
                <span
                  className={`text-sm ${
                    selectedPlan === 'parent' ? 'text-white' : 'text-gray-500'
                  } transition-colors`}
                  style={{ fontWeight: 700 }}
                >
                  Parent
                </span>
              </button>
            </div>
          </div>

          {/* Card that animates below */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPlan}
              className="mt-4 rounded-xl p-4 text-center"
              style={{
                background: selectedPlan === 'student'
                  ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(106, 27, 178, 0.1))'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                border: selectedPlan === 'student'
                  ? '1px solid rgba(138, 43, 226, 0.3)'
                  : '1px solid rgba(59, 130, 246, 0.3)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{
                  background: selectedPlan === 'student'
                    ? 'linear-gradient(135deg, #8A2BE2, #6A1BB2)'
                    : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                }}
              >
                {selectedPlan === 'student' ? (
                  <Zap size={24} className="text-white" />
                ) : (
                  <Shield size={24} className="text-white" />
                )}
              </div>
              <p className="text-white" style={{ fontWeight: 600 }}>
                {selectedPlan === 'student' ? 'Pro Student Plan' : 'Family Plan'}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {selectedPlan === 'student' ? '$59.99/year' : '$99.99/year'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4. STREAK FREEZE - "The Cool Down" */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>
            4. Streak Freeze Activation
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            "The Cool Down" - Flame transitions Orange→Icy Blue, frost overlay grows from center (400ms), locks into frozen state
          </p>

          <button
            onClick={() => setFreezeActivated(!freezeActivated)}
            className="w-full"
          >
            <div 
              className="w-full rounded-xl p-6 flex items-center gap-4 transition-all"
              style={{
                background: freezeActivated 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05))' 
                  : 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05))',
                border: freezeActivated 
                  ? '2px solid rgba(59, 130, 246, 0.3)' 
                  : '2px solid rgba(249, 115, 22, 0.3)',
              }}
            >
              {/* Frozen Flame Icon */}
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden flex-shrink-0"
                style={{
                  background: freezeActivated 
                    ? 'linear-gradient(135deg, rgba(147, 197, 253, 0.3), rgba(191, 219, 254, 0.2))' 
                    : 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.2))',
                  border: freezeActivated 
                    ? '2px solid rgba(147, 197, 253, 0.4)' 
                    : '2px solid rgba(249, 115, 22, 0.4)',
                }}
              >
                {/* Ice crystals - only when frozen */}
                {freezeActivated && (
                  <>
                    <motion.div
                      className="absolute top-1 left-2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.6, 0.3],
                        scale: [0, 1.2, 1],
                      }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                    >
                      <Snowflake size={8} className="text-blue-200" />
                    </motion.div>
                    <motion.div
                      className="absolute bottom-2 right-1"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.7, 0.4],
                        scale: [0, 1.1, 1],
                      }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                        delay: 0.1,
                      }}
                    >
                      <Snowflake size={6} className="text-blue-300" />
                    </motion.div>
                  </>
                )}

                {/* Frost overlay that grows from center */}
                <AnimatePresence>
                  {freezeActivated && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.6) 0%, transparent 70%)',
                        mixBlendMode: 'screen',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        opacity: [0, 0.8, 0.4],
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Flame icon - color transition Orange → Icy Blue */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: freezeActivated ? [1, 0.9, 1] : 1,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <Flame 
                    size={28} 
                    className={freezeActivated ? "text-cyan-400" : "text-orange-400"} 
                    strokeWidth={2}
                  />
                </motion.div>
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-white mb-1" style={{ fontWeight: 600 }}>
                  {freezeActivated ? 'Streak Frozen ❄️' : 'Activate Freeze 🔥'}
                </h4>
                <p className="text-gray-400 text-xs">
                  {freezeActivated 
                    ? 'Your streak is protected from loss' 
                    : 'Tap to freeze your streak'}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Badge Unlock Modal */}
      <AnimatePresence>
        {showBadgeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setShowBadgeModal(false)}
            />

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
              <button
                onClick={() => setShowBadgeModal(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-20"
              >
                <X size={20} className="text-white" />
              </button>

              <div
                className="rounded-3xl overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 69, 0, 0.2))',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255, 107, 53, 0.4)',
                }}
              >
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
                  <div className="flex justify-center mb-6 relative">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        width: '200px',
                        height: '200px',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(255, 107, 53, 0.6) 0%, rgba(255, 69, 0, 0.4) 40%, transparent 70%)',
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

                    <motion.div
                      className="w-32 h-32 rounded-3xl relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                        boxShadow: '0 0 60px rgba(255, 107, 53, 0.8)',
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
                          <Flame
                            size={64}
                            className="text-white drop-shadow-2xl"
                            strokeWidth={2}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
                      The Furnace
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                      Heat is building, momentum is real
                    </p>

                    <div className="flex justify-center">
                      <motion.div
                        className="px-4 py-1.5 rounded-full"
                        style={{
                          background: 'rgba(255, 107, 53, 0.3)',
                          border: '1px solid rgba(255, 107, 53, 0.6)',
                          color: '#FF6B35',
                          fontWeight: 700,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        RARE
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
