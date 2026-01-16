import { motion } from 'motion/react';
import { ArrowLeft, Mail } from 'lucide-react';

interface WeeklyReportPreviewProps {
  onBack: () => void;
  studentName?: string;
}

export function WeeklyReportPreview({ onBack, studentName = 'Alex' }: WeeklyReportPreviewProps) {
  // Mock data for the chart
  const weekData = [
    { day: 'Mon', mode: 'mastery', sessions: 3 },
    { day: 'Tue', mode: 'mastery', sessions: 4 },
    { day: 'Wed', mode: 'mastery', sessions: 5 },
    { day: 'Thu', mode: 'standard', sessions: 2 },
    { day: 'Fri', mode: 'mastery', sessions: 4 },
    { day: 'Sat', mode: 'mastery', sessions: 6 },
    { day: 'Sun', mode: 'standard', sessions: 3 },
  ];

  const maxSessions = Math.max(...weekData.map(d => d.sessions));

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22D3EE]/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Header */}
      <div className="relative px-6 pt-12 pb-6 border-b border-white/10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mb-6 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-400" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22D3EE] to-cyan-600 flex items-center justify-center shadow-lg shadow-[#22D3EE]/30">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
              Weekly Report Preview
            </h1>
            <p className="text-gray-400 text-sm">
              What parents receive every Monday
            </p>
          </div>
        </div>
      </div>

      {/* Email Mockup */}
      <div className="px-6 py-8 flex items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Email Client Chrome */}
          <div className="bg-[#1A1A1A] rounded-t-[20px] border-t border-x border-white/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            
            {/* Subject Line */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">From:</span>
                <span className="text-gray-300 text-sm">ThinkFirst</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">Subject:</span>
                <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                  Weekly Insight: {studentName} is building momentum.
                </span>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-[#0A0A0A] rounded-b-[20px] border-b border-x border-white/10 p-6 space-y-6">
            
            {/* Header with Logo */}
            <div className="text-center pb-4 border-b border-white/5">
              <h2 
                className="text-2xl mb-1"
                style={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ThinkFirst
              </h2>
              <p className="text-gray-500 text-xs" style={{ fontWeight: 500 }}>
                Weekly Report
              </p>
            </div>

            {/* Hero Stat - Integrity Score */}
            <div className="text-center py-4">
              <p className="text-gray-400 text-xs mb-2" style={{ fontWeight: 500 }}>
                Learning Integrity
              </p>
              <div className="text-5xl mb-1" style={{ fontWeight: 800, color: '#22D3EE' }}>
                85%
              </div>
              <p className="text-gray-500 text-xs">
                Based on effort and consistency
              </p>
            </div>

            {/* Chart Area - Mode Usage */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-gray-300 text-sm mb-4" style={{ fontWeight: 600 }}>
                This Week's Sessions
              </p>
              
              <div className="flex items-end justify-between gap-2 h-32 mb-3">
                {weekData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      className="w-full rounded-t-[6px]"
                      style={{
                        height: `${(day.sessions / maxSessions) * 100}%`,
                        background: day.mode === 'mastery'
                          ? 'linear-gradient(180deg, #8B5CF6, #7C3AED)'
                          : 'linear-gradient(180deg, #6B7280, #4B5563)',
                        boxShadow: day.mode === 'mastery'
                          ? '0 0 10px rgba(139, 92, 246, 0.4)'
                          : 'none',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.sessions / maxSessions) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                    />
                    <span className="text-gray-500 text-[10px]">{day.day}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]" />
                  <span className="text-gray-400 text-xs">Mastery (5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-gray-500 to-gray-600" />
                  <span className="text-gray-400 text-xs">Standard (2)</span>
                </div>
              </div>
            </div>

            {/* Insight Section - The Selling Point */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-gray-300 text-sm mb-3" style={{ fontWeight: 600 }}>
                💡 Key Insight
              </p>

              <div className="bg-[#1A1A1A] rounded-[14px] border border-white/10 p-4 space-y-3">
                {/* Event Header */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Tuesday, 8:45 PM</span>
                  <div 
                    className="px-2 py-1 rounded-full text-[10px]"
                    style={{
                      background: 'rgba(255, 95, 31, 0.15)',
                      border: '1px solid rgba(255, 95, 31, 0.3)',
                      color: '#FF5F1F',
                      fontWeight: 600,
                    }}
                  >
                    Feeling Tired
                  </div>
                </div>

                {/* Event Description */}
                <p className="text-gray-300 text-sm">
                  Switched to <span className="text-gray-400">Standard Mode</span>
                </p>

                {/* AI Insight */}
                <div className="pt-3 border-t border-white/5">
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22D3EE] to-cyan-600 flex items-center justify-center">
                        <span className="text-[10px]">✨</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {studentName} lowered difficulty late at night. Consider moving study sessions to <span className="text-[#22D3EE]" style={{ fontWeight: 600 }}>6 PM</span> for peak performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
              <div className="text-center">
                <p className="text-2xl mb-1" style={{ fontWeight: 700, color: '#8B5CF6' }}>
                  27
                </p>
                <p className="text-gray-500 text-[10px]">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1" style={{ fontWeight: 700, color: '#22D3EE' }}>
                  7
                </p>
                <p className="text-gray-500 text-[10px]">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1" style={{ fontWeight: 700, color: '#FF5F1F' }}>
                  2
                </p>
                <p className="text-gray-500 text-[10px]">Mode Switches</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/5 text-center">
              <button className="text-[#22D3EE] text-xs hover:text-cyan-400 transition-colors">
                Manage Subscription
              </button>
              <p className="text-gray-600 text-[10px] mt-2">
                Sent every Monday at 9:00 AM
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Card */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto bg-[rgba(20,20,20,0.95)] backdrop-blur-xl rounded-[20px] border border-white/10 p-5">
          <h3 className="text-white text-sm mb-2" style={{ fontWeight: 600 }}>
            Why This Matters
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-3">
            The Weekly Report turns friction data into actionable insights. Parents stay informed without micromanaging, and students build better habits.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]" />
            <span className="text-gray-500 text-[10px]">Guardian Plan Feature</span>
          </div>
        </div>
      </div>
    </div>
  );
}
