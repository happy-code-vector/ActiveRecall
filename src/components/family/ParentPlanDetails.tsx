import React from 'react';
import { motion } from 'motion/react';
import { Check, Users, User, TrendingUp, Zap, Shield, X } from 'lucide-react';

interface ParentPlanDetailsProps {
  onCreateAccount: () => void;
  onBack?: () => void;
}

export function ParentPlanDetails({ onCreateAccount, onBack }: ParentPlanDetailsProps) {
  const valueProps = [
    {
      icon: TrendingUp,
      text: 'You get: Activity Dashboard & Insights.',
      color: '#3B82F6',
    },
    {
      icon: Zap,
      text: 'They get: Unlimited AI Unlocks (Premium).',
      color: '#8A2BE2',
    },
    {
      icon: Shield,
      text: 'No more arguments about "did you study?"',
      color: '#22C55E',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background gradient orbs - subtle blue tones for trust */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20" />

      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* Close button */}
        {onBack && (
          <button
            onClick={onBack}
            className="self-end w-10 h-10 rounded-full bg-white bg-opacity-5 backdrop-blur-sm flex items-center justify-center mb-6 hover:bg-opacity-10 transition-all"
          >
            <X size={20} className="text-gray-400" />
          </button>
        )}

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-white text-3xl mb-2" style={{ fontWeight: 700 }}>
            One Subscription.
          </h1>
          <h2 className="text-white text-3xl" style={{ fontWeight: 700 }}>
            Entire Family.
          </h2>
        </motion.div>

        {/* Hub Visualization */}
        <motion.div
          className="mb-12 px-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative h-80 flex items-center justify-center">
            {/* Connection lines */}
            {[0, 1, 2, 3].map((index) => {
              const angle = (index * 90 - 45) * (Math.PI / 180);
              const length = 100;
              const x = Math.cos(angle) * length;
              const y = Math.sin(angle) * length;

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    width: '2px',
                    height: `${length}px`,
                    background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0.1))',
                    transformOrigin: 'top center',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -100%) rotate(${index * 90 - 45}deg)`,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                />
              );
            })}

            {/* Central Hub - Parent */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)',
                  width: '120px',
                  height: '120px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Hub circle */}
              <div
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))',
                  border: '2px solid rgba(59, 130, 246, 0.6)',
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                }}
              >
                <Users size={28} className="text-blue-400 mb-1" strokeWidth={2} />
                <span className="text-blue-300 text-xs" style={{ fontWeight: 600 }}>
                  Parent
                </span>
              </div>
            </motion.div>

            {/* Student nodes - positioned in a circle around the hub */}
            {[0, 1, 2, 3].map((index) => {
              const angle = (index * 90 - 45) * (Math.PI / 180);
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: 'rgba(138, 43, 226, 0.2)',
                      border: '2px solid rgba(138, 43, 226, 0.4)',
                      boxShadow: '0 0 20px rgba(138, 43, 226, 0.2)',
                    }}
                  >
                    <User size={20} className="text-purple-400" strokeWidth={2} />
                    <span className="text-purple-300 text-[10px] mt-0.5" style={{ fontWeight: 600 }}>
                      Student
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Value Propositions */}
        <motion.div
          className="space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={index}
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${prop.color}20`,
                    }}
                  >
                    <Icon size={24} style={{ color: prop.color }} strokeWidth={2} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-start gap-2">
                      <Check
                        size={20}
                        className="text-green-400 flex-shrink-0 mt-0.5"
                        strokeWidth={3}
                      />
                      <p className="text-gray-200 text-[17px]">{prop.text}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div
            className="relative overflow-hidden rounded-3xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className="text-center">
              <h3 className="text-white text-xl mb-2" style={{ fontWeight: 600 }}>
                Family Plan
              </h3>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-white text-4xl" style={{ fontWeight: 700 }}>
                  $99.99
                </span>
                <span className="text-gray-400 text-lg">/ year</span>
              </div>
              <p className="text-gray-500 text-sm">
                Just $8.33/month for the whole family
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={onCreateAccount}
          className="w-full py-5 rounded-full relative overflow-hidden mb-4"
          style={{
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            fontWeight: 700,
            fontSize: '18px',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 text-white">Create Family Account</span>

          {/* Shine animation */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: 'linear',
            }}
          />
        </motion.button>

        {/* Trust Signal */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <p className="text-gray-500 text-sm">
            7-day free trial • Cancel anytime
          </p>
          <p className="text-gray-600 text-xs">
            All data encrypted and private
          </p>
        </motion.div>
      </div>
    </div>
  );
}
