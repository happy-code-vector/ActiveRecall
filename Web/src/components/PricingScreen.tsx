import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Zap, Shield, TrendingUp, Flame, AlertCircle, Lock } from 'lucide-react';
import { ParentShareModal } from './ParentShareModal';
import { WeeklyReportMockup } from './WeeklyReportMockup';

interface PricingScreenProps {
  onStartTrial: (plan: 'solo' | 'family') => void;
  onBack?: () => void;
  onStayFree?: () => void;
  onCreateFamilyAccount?: () => void;
  defaultPlan?: 'student' | 'parent';
}

export function PricingScreen({ onStartTrial, onBack, onStayFree, onCreateFamilyAccount, defaultPlan = 'student' }: PricingScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'student' | 'parent'>(defaultPlan);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [showMissingOutScreen, setShowMissingOutScreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const planDetails = {
    student: {
      name: 'Pro Student Plan',
      priceMonthly: 9.99,
      priceAnnual: 59.99,
      features: [
        'Unlimited Unlocks',
        'Advanced AI Feedback',
        'Streak Freezes',
        'Priority Support',
        'Offline Access',
      ],
      icon: Zap,
      iconColor: '#8A2BE2',
      gradient: 'linear-gradient(135deg, #8A2BE2, #6A1BB2)',
      glowColor: 'rgba(138, 43, 226, 0.4)',
    },
    parent: {
      name: 'Guardian Plan',
      priceMonthly: 16.99,
      priceAnnual: 99.99,
      features: [
        'Up to 5 Student Accounts',
        'Family Squad Streak (Collaborative Goals)',
        'AI-Powered Weekly Insights',
        'Guardian Guidance (Soft-Lock System)',
        'Mode Switch Tracking & Reports',
        'Parent Dashboard + Real-time Alerts',
        'All Pro Student Features',
      ],
      icon: Shield,
      iconColor: '#FFBF00',
      gradient: 'linear-gradient(135deg, #FFBF00, #FF8C00)',
      glowColor: 'rgba(255, 191, 0, 0.4)',
    },
  };

  const currentPlan = planDetails[selectedPlan];
  const Icon = currentPlan.icon;
  
  const currentPrice = billingPeriod === 'monthly' ? currentPlan.priceMonthly : currentPlan.priceAnnual;
  const monthlyEquivalent = billingPeriod === 'annual' ? (currentPlan.priceAnnual / 12).toFixed(2) : null;
  const annualSavings = Math.round((1 - (currentPlan.priceAnnual / (currentPlan.priceMonthly * 12))) * 100);

  const handleStayFree = () => {
    setShowMissingOutScreen(true);
  };

  const handleConfirmStayFree = () => {
    if (onStayFree) {
      onStayFree();
    }
  };

  const handleShareWithParents = () => {
    setShowShareModal(true);
  };

  if (showMissingOutScreen) {
    return (
      <MissingOutScreen
        onUpgrade={() => {
          setShowMissingOutScreen(false);
        }}
        onConfirmFree={handleConfirmStayFree}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-normal filter blur-[128px] opacity-20"
        style={{
          background: selectedPlan === 'student' ? '#8A2BE2' : '#FFBF00',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full mix-blend-normal filter blur-[128px] opacity-20"
        style={{
          background: selectedPlan === 'student' ? '#6A1BB2' : '#FF8C00',
        }}
        animate={{
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

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
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-white text-3xl" style={{ fontWeight: 700 }}>
            Invest in Your Brain.
          </h1>
        </motion.div>

        {/* Toggle (The Critical Split) */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div
            className="relative p-1.5 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Sliding background - "The Sliding Door" (Ease-in-out: 250ms) */}
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

            {/* Buttons */}
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setSelectedPlan('student')}
                className="flex-1 py-4 rounded-full transition-all relative z-10 flex items-center justify-center gap-2"
              >
                <Flame 
                  size={20} 
                  className={selectedPlan === 'student' ? 'text-white' : 'text-gray-500'}
                />
                <span
                  className={`${
                    selectedPlan === 'student' ? 'text-white' : 'text-gray-500'
                  } transition-colors`}
                  style={{ fontWeight: 700 }}
                >
                  For Students
                </span>
              </button>

              <button
                onClick={() => setSelectedPlan('parent')}
                className="flex-1 py-4 rounded-full transition-all relative z-10 flex items-center justify-center gap-2"
              >
                <TrendingUp 
                  size={20} 
                  className={selectedPlan === 'parent' ? 'text-white' : 'text-gray-500'}
                />
                <span
                  className={`${
                    selectedPlan === 'parent' ? 'text-white' : 'text-gray-500'
                  } transition-colors`}
                  style={{ fontWeight: 700 }}
                >
                  For Parents
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Billing Period Toggle */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg transition-all ${
              billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'
            }`}
            style={{ fontWeight: 600 }}
          >
            Monthly
          </button>

          <button
            onClick={() => setBillingPeriod(billingPeriod === 'annual' ? 'monthly' : 'annual')}
            className="relative w-14 h-8 rounded-full transition-all"
            style={{
              background: billingPeriod === 'annual'
                ? currentPlan.gradient
                : '#2A2A2A',
            }}
          >
            <motion.div
              className="absolute top-1 w-6 h-6 bg-white rounded-full"
              animate={{
                left: billingPeriod === 'annual' ? '28px' : '4px',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>

          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-lg transition-all ${
              billingPeriod === 'annual' ? 'text-white' : 'text-gray-500'
            }`}
            style={{ fontWeight: 600 }}
          >
            Annual
            {billingPeriod === 'annual' && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500 bg-opacity-20 text-green-400">
                Save {annualSavings}%
              </span>
            )}
          </button>
        </motion.div>

        {/* Dynamic Card - "Crossfade + Slide Up" (10px motion) */}
        <motion.div
          key={`${selectedPlan}-${billingPeriod}`}
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          <div
            className="relative overflow-hidden rounded-3xl p-8"
            style={{
              background: `${currentPlan.gradient.replace('linear-gradient', 'linear-gradient').replace(')', ', 0.1)')}`,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${currentPlan.iconColor}40`,
              boxShadow: `0 8px 32px ${currentPlan.glowColor}`,
            }}
          >
            {/* 50% OFF Corner Badge - Only show for annual */}
            {billingPeriod === 'annual' && (
              <div className="absolute -right-2 top-6 z-10">
                <div 
                  className="px-6 py-2 rounded-l-full shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.5)',
                  }}
                >
                  <span className="text-white text-sm" style={{ fontWeight: 700 }}>
                    {annualSavings}% OFF
                  </span>
                </div>
              </div>
            )}

            {/* Icon with glow */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${currentPlan.glowColor} 0%, transparent 70%)`,
                    width: '100px',
                    height: '100px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
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

                {/* Icon background */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `${currentPlan.gradient.replace(')', ', 0.3)')}`,
                    border: `2px solid ${currentPlan.iconColor}80`,
                  }}
                >
                  <Icon 
                    size={40} 
                    style={{ 
                      color: currentPlan.iconColor,
                      filter: `drop-shadow(0 0 10px ${currentPlan.iconColor}80)`,
                    }}
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>

            {/* Plan Name */}
            <h2 className="text-white text-center text-3xl mb-2" style={{ fontWeight: 700 }}>
              {currentPlan.name}
            </h2>

            {/* Price */}
            <div className="text-center mb-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-white text-5xl" style={{ fontWeight: 700 }}>
                  ${currentPrice}
                </span>
                <span className="text-gray-400 text-xl">
                  / {billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {monthlyEquivalent && (
                <p className="text-gray-500 text-sm mt-2">
                  Just ${monthlyEquivalent}/month when billed annually
                </p>
              )}
            </div>

            {/* Savings Badge - Enhanced */}
            {billingPeriod === 'annual' && (
              <div className="flex justify-center mb-6">
                <motion.div 
                  className="px-5 py-2 rounded-full relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                    border: '2px solid rgba(16, 185, 129, 0.5)',
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {/* Shine animation */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
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
                  
                  <span className="text-green-400" style={{ fontWeight: 700 }}>
                    💰 Save {annualSavings}% vs monthly
                  </span>
                </motion.div>
              </div>
            )}

            {/* Features */}
            <div className="space-y-4">
              {currentPlan.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${currentPlan.iconColor}30`,
                    }}
                  >
                    <Check size={16} style={{ color: currentPlan.iconColor }} strokeWidth={3} />
                  </div>
                  <span className="text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Weekly Report Mockup - Only show for Family Plan */}
        {selectedPlan === 'parent' && (
          <motion.div
            className="mb-8 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="text-center mb-6">
              <h3 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>
                Weekly Guardian Reports
              </h3>
              <p className="text-gray-400 text-sm">
                Get a visual summary of your child&apos;s progress every week
              </p>
            </div>

            {/* Mockup Component */}
            <WeeklyReportMockup 
              studentName="Alex"
              streakDays={5}
              highEffortAnswers={14}
            />
          </motion.div>
        )}

        {/* Main CTA with Shine */}
        <motion.button
          onClick={() => onStartTrial(selectedPlan === 'student' ? 'solo' : 'family')}
          className="w-full py-5 rounded-full relative overflow-hidden mb-4"
          style={{
            background: currentPlan.gradient,
            fontWeight: 700,
            fontSize: '18px',
            boxShadow: `0 4px 20px ${currentPlan.glowColor}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 text-white">Start 7-Day Free Trial</span>
          
          {/* Shine animation */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
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

        {/* Stay Free Option */}
        {onStayFree && (
          <motion.button
            onClick={handleStayFree}
            className="w-full py-4 text-gray-500 hover:text-gray-400 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ fontWeight: 600 }}
          >
            Continue with Free Plan
          </motion.button>
        )}

        {/* Parent Referral Link - Only show on student plan */}
        {selectedPlan === 'student' && (
          <motion.button
            onClick={handleShareWithParents}
            className="w-full py-3 px-6 rounded-full mt-2 mb-2 transition-all"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield size={18} className="text-blue-400" />
              <span className="text-blue-300 text-[15px]" style={{ fontWeight: 600 }}>
                Parents paying? Get the Family Plan
              </span>
            </div>
          </motion.button>
        )}

        {/* Trust Signal */}
        <motion.p
          className="text-gray-600 text-center text-xs mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Cancel anytime in App Store settings. No commitment.
        </motion.p>
      </div>

      {/* Parent Share Modal */}
      <ParentShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onCreateFamilyAccount={onCreateFamilyAccount}
      />
    </div>
  );
}

function MissingOutScreen({ onUpgrade, onConfirmFree }: { onUpgrade: () => void; onConfirmFree: () => void }) {
  const missingFeatures = [
    {
      title: 'Unlimited Unlocks',
      description: 'Only 5 questions per day on free plan',
      icon: Lock,
    },
    {
      title: 'Advanced AI Feedback',
      description: 'Get detailed, personalized feedback on every answer',
      icon: Zap,
    },
    {
      title: 'Streak Freezes',
      description: 'Protect your learning streak when life gets busy',
      icon: Flame,
    },
    {
      title: 'Priority Support',
      description: 'Get help when you need it most',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20" />

      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* Close button */}
        <button
          onClick={onUpgrade}
          className="self-end w-10 h-10 rounded-full bg-white bg-opacity-5 backdrop-blur-sm flex items-center justify-center mb-6 hover:bg-opacity-10 transition-all"
        >
          <X size={20} className="text-gray-400" />
        </button>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex justify-center mb-4"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <AlertCircle size={64} className="text-red-400" />
          </motion.div>
          <h1 className="text-white text-3xl mb-3" style={{ fontWeight: 700 }}>
            Wait! Here&apos;s What You&apos;ll Miss
          </h1>
          <p className="text-gray-400">
            The free plan is extremely limited. Here&apos;s what you won&apos;t get:
          </p>
        </motion.div>

        {/* Missing Features */}
        <div className="space-y-4 mb-8">
          {missingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={24} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-1" style={{ fontWeight: 600 }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <button
            onClick={onUpgrade}
            className="w-full py-5 rounded-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #8A2BE2, #6A1BB2)',
              fontWeight: 700,
              fontSize: '18px',
              boxShadow: '0 4px 20px rgba(138, 43, 226, 0.5)',
            }}
          >
            <span className="relative z-10 text-white">Get Full Access Now</span>
            
            {/* Shine animation */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
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
          </button>

          <button
            onClick={onConfirmFree}
            className="w-full py-4 text-gray-500 hover:text-gray-400 transition-colors"
            style={{ fontWeight: 600 }}
          >
            I Understand, Stay Free
          </button>
        </motion.div>

        {/* Additional context */}
        <motion.p
          className="text-gray-600 text-center text-xs mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Free plan: 5 unlocks/day • Basic feedback • No streak protection
        </motion.p>
      </div>
    </div>
  );
}