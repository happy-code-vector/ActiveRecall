import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Flame, BookOpen, AlertCircle, ChevronDown, Check, Users, Copy } from 'lucide-react';
import { StreakData } from '../../App';
import { getInviteCode, generateInviteCode, getAvailableFamilySlots } from '../../utils/inviteCode';

interface Child {
  id: string;
  name: string;
  avatar: string;
}

interface ParentDashboardProps {
  onBack: () => void;
  userId: string;
  streak: StreakData;
  onAddStudent?: () => void;
  onViewLeaderboard?: () => void;
}

// Mock data for children - in production, this would come from the backend
const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Emma', avatar: '👧' },
  { id: '2', name: 'Alex', avatar: '👦' },
  { id: '3', name: 'Sofia', avatar: '👧' },
];

interface ActivityItem {
  date: string;
  effort_score: number;
  understanding_score: number;
  subject: string;
}

export function ParentDashboard({ onBack, userId, streak, onAddStudent, onViewLeaderboard }: ParentDashboardProps) {
  const [selectedChild, setSelectedChild] = useState<Child>(MOCK_CHILDREN[0]);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([65, 78, 72, 85, 90, 88, 92]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [avgEffortScore, setAvgEffortScore] = useState(87);
  const [weakSubjects, setWeakSubjects] = useState([
    { subject: 'Physics', score: 60, color: '#F59E0B' },
    { subject: 'Chemistry', score: 78, color: '#10B981' },
    { subject: 'Biology', score: 92, color: '#10B981' },
  ]);
  const [inviteCode, setInviteCode] = useState(getInviteCode());
  const [codeCopied, setCodeCopied] = useState(false);

  // Load child's activity data
  useEffect(() => {
    // In production, fetch real data for selectedChild.id
    // For now, using mock data
  }, [selectedChild]);

  const isPremium = localStorage.getItem('thinkfirst_premium') === 'true';
  const plan = localStorage.getItem('thinkfirst_plan') as 'solo' | 'family' | null;
  const isGuardianPlan = isPremium && plan === 'family';

  // Generate invite code if family plan and none exists
  useEffect(() => {
    if (isGuardianPlan && !inviteCode) {
      const subscriptionId = localStorage.getItem('thinkfirst_subscriptionId') || 'sub-default';
      const newCode = generateInviteCode(userId, subscriptionId);
      setInviteCode(newCode);
    }
  }, [isGuardianPlan, inviteCode, userId]);

  const handleCopyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  // If not premium, show the locked screen
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-white" />
            </div>
            <h2 className="text-white text-2xl mb-4" style={{ fontWeight: 700 }}>
              Family Plan Required
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Upgrade to the Family Plan to track your children's learning progress, view detailed insights, and support their academic journey.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white"
              style={{ fontWeight: 600 }}
            >
              Upgrade to Family Plan
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-8">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[128px] opacity-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white bg-opacity-5 backdrop-blur-sm flex items-center justify-center mb-6"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white text-xl" style={{ fontWeight: 700 }}>
              Parent Dashboard
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Track {selectedChild.name}'s learning progress
          </p>
        </div>

        {/* Child Selector */}
        <div className="px-6 mb-6">
          <div className="relative">
            <button
              onClick={() => setShowChildSelector(!showChildSelector)}
              className="w-full bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-4 flex items-center justify-between border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedChild.avatar}</div>
                <div className="text-left">
                  <div className="text-white text-sm" style={{ fontWeight: 600 }}>
                    {selectedChild.name}
                  </div>
                  <div className="text-gray-500 text-xs">Viewing progress</div>
                </div>
              </div>
              <ChevronDown 
                size={20} 
                className={`text-gray-400 transition-transform ${showChildSelector ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {showChildSelector && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E]/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {MOCK_CHILDREN.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => {
                      setSelectedChild(child);
                      setShowChildSelector(false);
                    }}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{child.avatar}</div>
                      <div className="text-white text-sm" style={{ fontWeight: 500 }}>
                        {child.name}
                      </div>
                    </div>
                    {selectedChild.id === child.id && (
                      <Check size={16} className="text-violet-400" />
                    )}
                  </button>
                ))}
                
                {/* Add Child Button */}
                <button
                  onClick={() => {
                    setShowChildSelector(false);
                    if (onAddStudent) {
                      onAddStudent();
                    }
                  }}
                  className="w-full px-5 py-4 border-t border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                    <span className="text-violet-400 text-lg">+</span>
                  </div>
                  <div className="text-violet-400 text-sm" style={{ fontWeight: 500 }}>
                    Add child profile
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Streak Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={18} className="text-orange-400" />
                <span className="text-gray-400 text-xs">Current Streak</span>
              </div>
              <p className="text-white text-3xl mb-1" style={{ fontWeight: 700 }}>
                {streak.count}
              </p>
              <p className="text-green-400 text-xs">
                +3 from last week
              </p>
            </div>

            {/* Average Score */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-blue-400" />
                <span className="text-gray-400 text-xs">Avg. Effort</span>
              </div>
              <p className="text-white text-3xl mb-1" style={{ fontWeight: 700 }}>
                {avgEffortScore}%
              </p>
              <p className="text-green-400 text-xs">
                +5% this month
              </p>
            </div>
          </div>
        </div>

        {/* Invite Code Card - Only show for Guardian Plan */}
        {isGuardianPlan && inviteCode && (
          <div className="px-6 mb-6">
            <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-5 border border-violet-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-violet-400" />
                  <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                    Family Invite Code
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {getAvailableFamilySlots()} seats left
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-violet-500/30 text-center">
                  <span className="text-violet-300 text-xl font-mono" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                    {inviteCode.code}
                  </span>
                </div>
                <button
                  onClick={handleCopyInviteCode}
                  className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center hover:bg-violet-600/30 transition-colors"
                >
                  {codeCopied ? (
                    <Check size={20} className="text-green-400" />
                  ) : (
                    <Copy size={20} className="text-violet-400" />
                  )}
                </button>
              </div>
              
              <p className="text-gray-400 text-xs mt-3 text-center">
                Share this code with your children to link their accounts
              </p>
            </div>
          </div>
        )}

        {/* View Leaderboard Button */}
        {onViewLeaderboard && (
          <div className="px-6 mb-6">
            <motion.button
              onClick={onViewLeaderboard}
              className="w-full rounded-[16px] p-4 flex items-center justify-between overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 191, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%)',
                border: '1px solid rgba(255, 191, 0, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Golden Glow */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 191, 0, 0.3) 0%, transparent 70%)',
                }}
              />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#FFBF00]/20 border border-[#FFBF00]/40 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#FFBF00]" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm mb-0.5" style={{ fontWeight: 600 }}>
                    Family Leaderboard
                  </p>
                  <p className="text-gray-400 text-xs">
                    See who's crushing it this week! 🏆
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="#FFBF00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.button>
          </div>
        )}

        {/* Weekly Activity Chart */}
        <div className="px-6 mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-purple-400" />
              <h3 className="text-white" style={{ fontWeight: 600 }}>
                Weekly Effort Trend
              </h3>
            </div>
            
            {/* Bar chart */}
            <div className="h-40 flex items-end gap-2 mb-3">
              {weeklyActivity.map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div className="text-center mb-2">
                    <span className="text-xs text-gray-400">{height}%</span>
                  </div>
                  <motion.div
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-purple-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="px-6 mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <AlertCircle size={20} className="text-yellow-400" />
              <h3 className="text-white" style={{ fontWeight: 600 }}>
                Subject Performance
              </h3>
            </div>
            <div className="space-y-4">
              {weakSubjects.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{item.subject}</span>
                    <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="px-6">
          <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-violet-500/30">
            <h3 className="text-white mb-3" style={{ fontWeight: 600 }}>
              💡 Weekly Insight
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {selectedChild.name} has been consistently improving their effort scores this week! They're showing strong performance in Biology and Chemistry. Consider encouraging more practice in Physics to strengthen understanding in that area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}