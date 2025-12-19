import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Check, Share2, Users, BarChart3, Lock, Flame, Snowflake, Brain } from 'lucide-react';

interface PremiumPaywallScreenProps {
  onStartTrial: (plan: 'solo' | 'family') => void;
  onSkip?: () => void;
}

type UserMode = 'student' | 'parent';

export function PremiumPaywallScreen({ onStartTrial, onSkip }: PremiumPaywallScreenProps) {
  const [selectedMode, setSelectedMode] = useState<UserMode>('student');

  const handleShare = () => {
    const message = `Hey! I'm using ThinkFirst to improve my learning and need a Family Plan to unlock all features. Can you help sponsor my subscription? It's $99.99/year for up to 4 students and includes parent monitoring. Check it out!`;
    
    const encodedMessage = encodeURIComponent(message);
    
    // Try native share first
    if (navigator.share) {
      navigator.share({
        title: 'ThinkFirst - Sponsor Request',
        text: message,
      }).catch(() => {
        // Fallback to SMS if share fails
        window.location.href = `sms:?&body=${encodedMessage}`;
      });
    } else {
      // Fallback to SMS
      window.location.href = `sms:?&body=${encodedMessage}`;
    }
  };

  const studentBenefits = [
    { icon: Flame, text: 'Unlimited Unlocks (No Daily Limit)', color: '#FF6B35' },
    { icon: Brain, text: 'Advanced AI Feedback (Why you were wrong)', color: '#8A2BE2' },
    { icon: Snowflake, text: '2x Streak Freezes (Never lose progress)', color: '#60A5FA' },
    { icon: Zap, text: 'Priority Support & Updates', color: '#00FF94' },
  ];

  const parentBenefits = [
    { icon: Users, text: 'Share with 3 other students', color: '#8A2BE2' },
    { icon: BarChart3, text: 'Parent Dashboard & Insights', color: '#00FF94' },
    { icon: Lock, text: 'Monitor Effort Scores', color: '#60A5FA' },
    { icon: Shield, text: 'Family-wide Streak Protection', color: '#FF6B35' },
  ];

  const benefits = selectedMode === 'student' ? studentBenefits : parentBenefits;

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex flex-col">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-14 pb-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glow behind text */}
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-2xl bg-purple-600/40" />
            <h1 className="relative text-white text-3xl mb-2" style={{ fontWeight: 700 }}>
              Unlock Your Full Potential
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            7-Day Free Trial • Cancel Anytime
          </p>
        </motion.div>

        {/* Segmented Control Toggle */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div
            className="relative w-full h-14 rounded-full p-1.5"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Sliding background indicator */}
            <motion.div
              className="absolute top-1.5 h-[calc(100%-12px)] rounded-full"
              style={{
                background: 'linear-gradient(135deg, #8A2BE2, #6A1BB2)',
                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.4)',
              }}
              initial={false}
              animate={{
                left: selectedMode === 'student' ? '6px' : '50%',
                right: selectedMode === 'student' ? '50%' : '6px',
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />

            {/* Buttons */}
            <div className="relative z-10 grid grid-cols-2 h-full">
              <button
                onClick={() => setSelectedMode('student')}
                className="flex items-center justify-center gap-2 transition-colors"
              >
                <Zap size={18} className={selectedMode === 'student' ? 'text-white' : 'text-gray-500'} />
                <span
                  className={`text-sm transition-colors ${
                    selectedMode === 'student' ? 'text-white' : 'text-gray-500'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  For Me (Student)
                </span>
              </button>

              <button
                onClick={() => setSelectedMode('parent')}
                className="flex items-center justify-center gap-2 transition-colors"
              >
                <Shield size={18} className={selectedMode === 'parent' ? 'text-white' : 'text-gray-500'} />
                <span
                  className={`text-sm transition-colors ${
                    selectedMode === 'parent' ? 'text-white' : 'text-gray-500'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  For Family (Parent)
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Offer Card - Dynamic Content */}
        <motion.div
          className="flex-1 rounded-3xl p-8 mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          key={selectedMode} // Re-animate on mode change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-2xl"
                style={{
                  background: selectedMode === 'student' 
                    ? 'radial-gradient(circle, rgba(138, 43, 226, 0.6), transparent)'
                    : 'radial-gradient(circle, rgba(96, 165, 250, 0.6), transparent)',
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
              
              {/* Icon container */}
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: selectedMode === 'student'
                    ? 'linear-gradient(135deg, #8A2BE2, #6A1BB2)'
                    : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                }}
              >
                {selectedMode === 'student' ? (
                  <Zap size={40} className="text-white" strokeWidth={2} />
                ) : (
                  <Shield size={40} className="text-white" strokeWidth={2} />
                )}
              </div>
            </div>
          </div>

          {/* Plan Name */}
          <h2 className="text-white text-2xl text-center mb-2" style={{ fontWeight: 700 }}>
            {selectedMode === 'student' ? 'Pro Student' : 'Family Plan'}
          </h2>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-white text-4xl" style={{ fontWeight: 700 }}>
                {selectedMode === 'student' ? '$59.99' : '$99.99'}
              </span>
              <span className="text-gray-400 text-lg">/ year</span>
            </div>
            <p className="text-gray-500 text-sm">
              {selectedMode === 'student' ? 'Just $4.99/month' : 'Includes 4 Accounts'}
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  {/* Icon with colored background */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${benefit.color}20`,
                      border: `1px solid ${benefit.color}40`,
                    }}
                  >
                    <Icon size={20} style={{ color: benefit.color }} strokeWidth={2} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-2">
                    <p className="text-white text-base leading-relaxed">
                      {benefit.text}
                    </p>
                  </div>

                  {/* Checkmark */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-2"
                    style={{
                      background: 'linear-gradient(135deg, #00FF94, #00CC75)',
                    }}
                  >
                    <Check size={14} className="text-black" strokeWidth={3} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={() => onStartTrial(selectedMode === 'student' ? 'solo' : 'family')}
          className="relative w-full h-16 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #00FF94, #00CC75)',
            boxShadow: '0 8px 30px rgba(0, 255, 148, 0.3)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'linear',
            }}
          />

          <span className="relative z-10 text-black text-lg" style={{ fontWeight: 700 }}>
            Start Free Trial
          </span>
        </motion.button>

        {/* "Broke Student" Fallback - Only for Student Mode */}
        {selectedMode === 'student' && (
          <motion.button
            onClick={handleShare}
            className="mt-4 flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Share2 size={16} />
            <span className="text-sm">Need a sponsor? Ask a parent to pay</span>
          </motion.button>
        )}

        {/* Skip link */}
        {onSkip && (
          <motion.button
            onClick={onSkip}
            className="mt-2 py-3 text-gray-600 hover:text-gray-400 transition-colors text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Maybe later
          </motion.button>
        )}
      </div>
    </div>
  );
}
