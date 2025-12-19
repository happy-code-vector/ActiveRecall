import { motion } from 'motion/react';
import { Brain, Flame, Award, TrendingUp } from 'lucide-react';

interface WeeklyReportMockupProps {
  studentName?: string;
  streakDays?: number;
  highEffortAnswers?: number;
}

export function WeeklyReportMockup({ 
  studentName = 'Alex', 
  streakDays = 5, 
  highEffortAnswers = 14 
}: WeeklyReportMockupProps) {
  return (
    <motion.div
      className="relative w-full max-w-[320px] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Phone Frame Outline (subtle) */}
      <div
        className="rounded-[32px] p-1 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(34, 211, 238, 0.1))',
        }}
      >
        {/* Phone Screen */}
        <div
          className="rounded-[28px] overflow-hidden relative"
          style={{
            background: 'linear-gradient(to bottom, #0A0A0A, #000000)',
            aspectRatio: '9/19.5',
          }}
        >
          {/* Lock Screen Time (top) */}
          <div className="text-center pt-16 pb-12">
            <motion.div
              className="text-white text-6xl mb-2"
              style={{ fontWeight: 300, letterSpacing: '-0.02em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              9:41
            </motion.div>
            <motion.div
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Monday, December 13
            </motion.div>
          </div>

          {/* Notification Card */}
          <motion.div
            className="mx-4 rounded-[24px] overflow-hidden backdrop-blur-xl relative"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1)',
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Neon Glow Top Edge */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #8B5CF6, #22D3EE, transparent)',
                opacity: 0.6,
              }}
            />

            {/* Notification Header */}
            <div className="flex items-center gap-3 p-4 pb-3">
              {/* ThinkFirst App Icon */}
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                }}
              >
                {/* Icon shine effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
                  }}
                />
                <Brain className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
              </div>

              {/* App Name & Time */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white text-[13px]" style={{ fontWeight: 600 }}>
                    ThinkFirst
                  </span>
                  <span className="text-gray-500 text-[11px]">now</span>
                </div>
                <div className="text-white text-[15px]" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
                  Weekly Guardian Report
                </div>
              </div>
            </div>

            {/* Notification Body */}
            <div className="px-4 pb-4">
              <p className="text-gray-300 text-[14px] leading-relaxed mb-3">
                <span className="text-white" style={{ fontWeight: 600 }}>{studentName}</span> is crushing it! 
                <span className="text-white" style={{ fontWeight: 600 }}> {streakDays} Day Streak</span> achieved. 
                <span className="text-white" style={{ fontWeight: 600 }}> {highEffortAnswers} High-Effort</span> answers unlocked this week.
              </p>

              {/* Quick Stats Row */}
              <div className="flex items-center gap-2">
                {/* Streak Badge */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(251, 146, 60, 0.2))',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                  }}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" strokeWidth={2.5} />
                  <span className="text-orange-300 text-[11px]" style={{ fontWeight: 700 }}>
                    {streakDays}
                  </span>
                </div>

                {/* Unlocks Badge */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(6, 182, 212, 0.2))',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                  }}
                >
                  <Award className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2.5} />
                  <span className="text-cyan-300 text-[11px]" style={{ fontWeight: 700 }}>
                    {highEffortAnswers}
                  </span>
                </div>

                {/* Trend Badge */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                  <span className="text-green-300 text-[11px]" style={{ fontWeight: 700 }}>
                    +24%
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Bottom Glow */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)',
              }}
            />
          </motion.div>

          {/* Lock Screen Bottom Elements */}
          <div className="absolute bottom-8 left-0 right-0">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
              <div className="w-1 h-1 rounded-full bg-gray-600" />
              <div className="w-1 h-1 rounded-full bg-gray-700" />
              <div className="w-1 h-1 rounded-full bg-gray-700" />
            </div>
          </div>

          {/* Ambient Light Effects */}
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>

      {/* Feature Label (below mockup) */}
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
              boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
            }}
          />
          <span className="text-gray-500 text-[11px] uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Delivered Weekly
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
              boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
            }}
          />
        </div>
        <p className="text-gray-600 text-xs">
          Stay connected to your child&apos;s learning journey
        </p>
      </motion.div>
    </motion.div>
  );
}
