import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Target, Flame, ChevronDown, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { StreakData } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { BottomNav } from './BottomNav';
import { ProgressTimeline, generateTimelineData, DayNode } from './ProgressTimeline';

interface Child {
  id: string;
  name: string;
  avatar: string;
}

// Mock data for children - in production, this would come from the backend
const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Emma', avatar: '👧' },
  { id: '2', name: 'Alex', avatar: '👦' },
  { id: '3', name: 'Sofia', avatar: '👧' },
];

interface ProgressScreenProps {
  userId: string;
  streak: StreakData;
  onBack: () => void;
  onGoToHome?: () => void;
  onGoToProgress?: () => void;
  onGoToHistory?: () => void;
  onGoToTechniques?: () => void;
  onGoToParentDashboard?: () => void;
}

interface ProgressStats {
  attemptsThisWeek: number;
  avgEffortScore: number;
  avgUnderstandingScore: number;
  unlockRate: number;
}

export function ProgressScreen({ userId, streak, onBack, onGoToHome, onGoToProgress, onGoToHistory, onGoToTechniques, onGoToParentDashboard }: ProgressScreenProps) {
  const userType = localStorage.getItem('thinkfirst_userType') as 'student' | 'parent' | null;
  const isParent = userType === 'parent';
  
  const [selectedChild, setSelectedChild] = useState<Child>(MOCK_CHILDREN[0]);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    attemptsThisWeek: 0,
    avgEffortScore: 0,
    avgUnderstandingScore: 0,
    unlockRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState<DayNode[]>([]);

  // Load progress data when userId or selectedChild changes
  useEffect(() => {
    loadProgress();
  }, [userId, selectedChild]);

  const loadProgress = async () => {
    try {
      // If parent, load selected child's data; otherwise load student's own data
      const targetUserId = isParent ? selectedChild.id : userId;
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0e3c496/progress/${targetUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
      
      // Generate timeline data based on streak
      // In production, this would use actual activity dates from the API
      const mockActivityDates: Date[] = [];
      const today = new Date();
      
      // Generate mock activity for the past streak.count days
      for (let i = 0; i < streak.count; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        mockActivityDates.push(date);
      }
      
      const timeline = generateTimelineData(streak.count, mockActivityDates, 14);
      setTimelineData(timeline);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreGradient = (score: number) => {
    if (score < 1.5) return 'from-yellow-400 to-yellow-500';
    if (score < 2.5) return 'from-blue-400 to-blue-500';
    return 'from-green-400 to-green-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative px-5 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="relative px-5 pt-6 pb-2">
        <h1 className="text-3xl text-white">Progress</h1>
        {isParent && (
          <p className="text-gray-500 text-sm mt-1">
            Track {selectedChild.name}'s learning progress
          </p>
        )}
      </div>

      {/* Child Selector - Only show for parents */}
      {isParent && (
        <div className="relative px-5 mb-4">
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
              </motion.div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        <div className="relative flex-1 px-5 pt-6 pb-24 overflow-y-auto space-y-4">{/* Added pb-24 for bottom nav space */}
          {/* Streak Card with animation */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-br from-orange-600/30 to-yellow-600/30 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/20">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Flame className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-orange-200/80 text-sm mb-1">Current Streak</p>
                  <motion.p 
                    className="text-3xl text-white"
                    key={streak.count}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 25,
                    }}
                  >
                    {streak.count} {streak.count === 1 ? 'day' : 'days'}
                  </motion.p>
                  {streak.count > 0 && (
                    <p className="text-orange-200/60 text-sm mt-1">
                      Keep it going!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Attempts */}
            <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl text-white mb-1">{stats.attemptsThisWeek}</p>
              <p className="text-xs text-gray-500">attempts this week</p>
            </div>

            {/* Success Rate */}
            <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl text-white mb-1">{Math.round(stats.unlockRate)}%</p>
              <p className="text-xs text-gray-500">success rate</p>
            </div>
          </div>

          {/* Progress Timeline */}
          {timelineData.length > 0 && (
            <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">
                {isParent ? `${selectedChild.name}'s Activity Timeline` : 'Your Activity Timeline'}
              </p>
              <ProgressTimeline days={timelineData} maxDaysToShow={7} />
            </div>
          )}

          {/* Average Scores */}
          <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
            <p className="text-sm text-gray-400 mb-4">
              {isParent ? `${selectedChild.name}'s scores (last 7 days)` : 'Your scores (last 7 days)'}
            </p>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white">Effort</p>
                  <p className="text-sm text-gray-400">
                    {stats.avgEffortScore.toFixed(1)}/3.0
                  </p>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreGradient(stats.avgEffortScore)} transition-all rounded-full`}
                    style={{ width: `${(stats.avgEffortScore / 3) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white">Understanding</p>
                  <p className="text-sm text-gray-400">
                    {stats.avgUnderstandingScore.toFixed(1)}/3.0
                  </p>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreGradient(stats.avgUnderstandingScore)} transition-all rounded-full`}
                    style={{ width: `${(stats.avgUnderstandingScore / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Encouragement */}
          {stats.attemptsThisWeek === 0 ? (
            <div className="bg-yellow-500/10 backdrop-blur-xl rounded-3xl p-5 border border-yellow-500/20">
              <p className="text-sm text-yellow-200 text-center">
                {isParent 
                  ? `${selectedChild.name} hasn't made any attempts this week yet.`
                  : 'Start your first attempt this week to build your learning habit.'}
              </p>
            </div>
          ) : stats.attemptsThisWeek < 5 ? (
            <div className="bg-blue-500/10 backdrop-blur-xl rounded-3xl p-5 border border-blue-500/20">
              <p className="text-sm text-blue-200 text-center">
                {isParent
                  ? `${selectedChild.name} is building consistency. Encourage them to reach 5 attempts this week!`
                  : "You're building consistency. Try to reach 5 attempts this week!"}
              </p>
            </div>
          ) : (
            <div className="bg-green-500/10 backdrop-blur-xl rounded-3xl p-5 border border-green-500/20">
              <p className="text-sm text-green-200 text-center">
                {isParent
                  ? `Excellent work! ${selectedChild.name} is building a strong learning habit.`
                  : "Excellent work! You're building a strong learning habit."}
              </p>
            </div>
          )}
        </div>
      )}
      <BottomNav
        onGoToHome={onGoToHome}
        onGoToProgress={onGoToProgress}
        onGoToHistory={onGoToHistory}
        onGoToTechniques={onGoToTechniques}
        onGoToParentDashboard={onGoToParentDashboard}
      />
    </div>
  );
}