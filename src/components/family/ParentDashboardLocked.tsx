import React from 'react';
import { motion } from 'motion/react';
import { Lock, TrendingUp, Flame, BookOpen, ArrowLeft } from 'lucide-react';

interface ParentDashboardLockedProps {
  onUpgrade: () => void;
  onBack: () => void;
}

export function ParentDashboardLocked({ onUpgrade, onBack }: ParentDashboardLockedProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white bg-opacity-5 backdrop-blur-sm flex items-center justify-center mb-6"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>

          <h1 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>
            Parent Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Track your child&apos;s learning progress
          </p>
        </div>

        {/* Blurred Content Preview */}
        <div className="flex-1 px-6 pb-32 relative">
          {/* Mock Charts/Data (Blurred) */}
          <div className="space-y-6 filter blur-md opacity-40 pointer-events-none select-none">
            {/* Effort Trends Graph */}
            <div className="bg-white bg-opacity-5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-purple-400" />
                <h3 className="text-white" style={{ fontWeight: 600 }}>
                  Student Effort Trends
                </h3>
              </div>
              
              {/* Mock line chart */}
              <div className="h-48 flex items-end gap-2">
                {[65, 78, 72, 85, 90, 88, 92].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-400"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Streak Card */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-gray-400 text-xs">Current Streak</span>
                </div>
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>
                  12 days
                </p>
                <p className="text-green-400 text-xs mt-1">
                  +3 from last week
                </p>
              </div>

              {/* Understanding Score */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-blue-400" />
                  <span className="text-gray-400 text-xs">Avg. Score</span>
                </div>
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>
                  87%
                </p>
                <p className="text-green-400 text-xs mt-1">
                  +5% this month
                </p>
              </div>
            </div>

            {/* Weak Subjects */}
            <div className="bg-white bg-opacity-5 rounded-2xl p-6">
              <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>
                Areas for Improvement
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Physics</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-yellow-500 rounded-full" />
                    </div>
                    <span className="text-white text-sm">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Chemistry</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-white text-sm">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Biology</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-green-500 rounded-full" />
                    </div>
                    <span className="text-white text-sm">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lock Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.div
              className="text-center max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Lock Icon with glow */}
              <motion.div
                className="flex justify-center mb-6"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="relative">
                  {/* Outer glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, transparent 70%)',
                      width: '120px',
                      height: '120px',
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

                  {/* Lock background */}
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(106, 27, 178, 0.3))',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 0 60px rgba(138, 43, 226, 0.5)',
                      border: '2px solid rgba(138, 43, 226, 0.5)',
                    }}
                  >
                    <Lock 
                      size={48} 
                      style={{ 
                        color: '#8A2BE2',
                        filter: 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.8))',
                      }}
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h2
                className="text-white text-3xl mb-4"
                style={{ fontWeight: 700 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                See How They Are Really Doing.
              </motion.h2>

              {/* Body */}
              <motion.p
                className="text-gray-400 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                The Parent Dashboard gives you visibility into their <span className="text-white" style={{ fontWeight: 600 }}>Effort Scores</span>, <span className="text-white" style={{ fontWeight: 600 }}>Streak consistency</span>, and <span className="text-white" style={{ fontWeight: 600 }}>weak subjects</span>.
              </motion.p>

              {/* CTA Button */}
              <motion.button
                onClick={onUpgrade}
                className="w-full py-5 rounded-full relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #8A2BE2, #6A1BB2)',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 text-white">
                  Upgrade to Family Plan ($99/yr)
                </span>
                
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

              {/* Feature bullets */}
              <motion.div
                className="mt-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>Up to 4 child profiles</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>Real-time progress alerts</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>Weekly insight reports</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
