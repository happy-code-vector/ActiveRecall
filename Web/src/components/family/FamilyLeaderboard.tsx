import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, TrendingUp, Flame, Award, Crown } from 'lucide-react';

type TimeFilter = 'daily' | 'weekly' | 'alltime';

interface LeaderboardMember {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  totalUnlocks: number;
  averageScore: number;
  currentStreak: number;
  isYou?: boolean;
}

interface FamilyLeaderboardProps {
  onBack: () => void;
}

// Mock data - in production, this would come from backend
const MOCK_LEADERBOARD_DATA: Record<TimeFilter, LeaderboardMember[]> = {
  daily: [
    {
      id: '3',
      name: 'Sarah',
      avatar: '',
      rank: 1,
      totalUnlocks: 5,
      averageScore: 92,
      currentStreak: 12,
    },
    {
      id: '4',
      name: 'Mom',
      avatar: '',
      rank: 2,
      totalUnlocks: 4,
      averageScore: 88,
      currentStreak: 12,
    },
    {
      id: '1',
      name: 'You',
      avatar: '',
      rank: 3,
      totalUnlocks: 3,
      averageScore: 85,
      currentStreak: 12,
      isYou: true,
    },
    {
      id: '2',
      name: 'Dad',
      avatar: '',
      rank: 4,
      totalUnlocks: 1,
      averageScore: 78,
      currentStreak: 12,
    },
  ],
  weekly: [
    {
      id: '1',
      name: 'You',
      avatar: '',
      rank: 1,
      totalUnlocks: 18,
      averageScore: 87,
      currentStreak: 12,
      isYou: true,
    },
    {
      id: '3',
      name: 'Sarah',
      avatar: '',
      rank: 2,
      totalUnlocks: 15,
      averageScore: 90,
      currentStreak: 12,
    },
    {
      id: '4',
      name: 'Mom',
      avatar: '',
      rank: 3,
      totalUnlocks: 12,
      averageScore: 84,
      currentStreak: 12,
    },
    {
      id: '2',
      name: 'Dad',
      avatar: '',
      rank: 4,
      totalUnlocks: 8,
      averageScore: 79,
      currentStreak: 12,
    },
  ],
  alltime: [
    {
      id: '4',
      name: 'Mom',
      avatar: '',
      rank: 1,
      totalUnlocks: 156,
      averageScore: 91,
      currentStreak: 12,
    },
    {
      id: '1',
      name: 'You',
      avatar: '',
      rank: 2,
      totalUnlocks: 143,
      averageScore: 88,
      currentStreak: 12,
      isYou: true,
    },
    {
      id: '3',
      name: 'Sarah',
      avatar: '',
      rank: 3,
      totalUnlocks: 128,
      averageScore: 89,
      currentStreak: 12,
    },
    {
      id: '2',
      name: 'Dad',
      avatar: '',
      rank: 4,
      totalUnlocks: 95,
      averageScore: 82,
      currentStreak: 12,
    },
  ],
};

export function FamilyLeaderboard({ onBack }: FamilyLeaderboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
  
  const leaderboardData = MOCK_LEADERBOARD_DATA[timeFilter];

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFBF00'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#6B7280'; // Gray
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FFBF00]/20 border border-[#FFBF00]/40 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#FFBF00]" />
              </div>
            </div>
          </div>
          
          <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 800 }}>
            Family Leaderboard
          </h1>
          <p className="text-gray-400 text-sm">
            See who's crushing it this {timeFilter === 'daily' ? 'day' : timeFilter === 'weekly' ? 'week' : 'year'}! 🚀
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            {(['daily', 'weekly', 'alltime'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`flex-1 px-4 py-2.5 rounded-[12px] text-sm transition-all ${
                  timeFilter === filter
                    ? 'bg-[#FFBF00] text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                style={{ fontWeight: 600 }}
              >
                {filter === 'daily' ? 'Today' : filter === 'weekly' ? 'This Week' : 'All-Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="px-6 pt-6 pb-8">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <motion.div
            className="flex items-end justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Second Place */}
            {leaderboardData[1] && (
              <motion.div
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="relative mb-2">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2"
                    style={{ borderColor: getRankColor(2) }}
                  >
                    <div 
                      className="w-full h-full bg-gradient-to-br flex items-center justify-center text-white text-lg"
                      style={{
                        background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
                        fontWeight: 700,
                      }}
                    >
                      {leaderboardData[1].name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl">
                    {getMedalEmoji(2)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white text-xs mb-1" style={{ fontWeight: 600 }}>
                    {leaderboardData[1].isYou ? 'You' : leaderboardData[1].name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {leaderboardData[1].totalUnlocks} unlocks
                  </p>
                </div>
                <div
                  className="w-full rounded-t-[12px] mt-2"
                  style={{
                    height: '60px',
                    background: 'linear-gradient(180deg, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0.05) 100%)',
                    border: '1px solid rgba(192, 192, 192, 0.2)',
                    borderBottom: 'none',
                  }}
                />
              </motion.div>
            )}

            {/* First Place */}
            {leaderboardData[0] && (
              <motion.div
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="relative mb-2">
                  <motion.div
                    className="w-20 h-20 rounded-full overflow-hidden border-3"
                    style={{ borderColor: getRankColor(1), borderWidth: '3px' }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255, 191, 0, 0.4)',
                        '0 0 30px rgba(255, 191, 0, 0.6)',
                        '0 0 20px rgba(255, 191, 0, 0.4)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div 
                      className="w-full h-full bg-gradient-to-br flex items-center justify-center text-white text-xl"
                      style={{
                        background: 'linear-gradient(135deg, #FFBF00, #FF8C00)',
                        fontWeight: 700,
                      }}
                    >
                      {leaderboardData[0].name.charAt(0).toUpperCase()}
                    </div>
                  </motion.div>
                  <div className="absolute -top-3 -right-3 text-3xl">
                    {getMedalEmoji(1)}
                  </div>
                  <motion.div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Crown className="w-6 h-6 text-[#FFBF00]" />
                  </motion.div>
                </div>
                <div className="text-center">
                  <p className="text-white text-sm mb-1" style={{ fontWeight: 700 }}>
                    {leaderboardData[0].isYou ? 'You' : leaderboardData[0].name}
                  </p>
                  <p className="text-[#FFBF00] text-xs" style={{ fontWeight: 600 }}>
                    {leaderboardData[0].totalUnlocks} unlocks
                  </p>
                </div>
                <div
                  className="w-full rounded-t-[12px] mt-2"
                  style={{
                    height: '80px',
                    background: 'linear-gradient(180deg, rgba(255, 191, 0, 0.25) 0%, rgba(255, 191, 0, 0.08) 100%)',
                    border: '1px solid rgba(255, 191, 0, 0.3)',
                    borderBottom: 'none',
                    boxShadow: '0 -10px 30px rgba(255, 191, 0, 0.2)',
                  }}
                />
              </motion.div>
            )}

            {/* Third Place */}
            {leaderboardData[2] && (
              <motion.div
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="relative mb-2">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2"
                    style={{ borderColor: getRankColor(3) }}
                  >
                    <div 
                      className="w-full h-full bg-gradient-to-br flex items-center justify-center text-white text-lg"
                      style={{
                        background: 'linear-gradient(135deg, #CD7F32, #B8732D)',
                        fontWeight: 700,
                      }}
                    >
                      {leaderboardData[2].name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl">
                    {getMedalEmoji(3)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white text-xs mb-1" style={{ fontWeight: 600 }}>
                    {leaderboardData[2].isYou ? 'You' : leaderboardData[2].name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {leaderboardData[2].totalUnlocks} unlocks
                  </p>
                </div>
                <div
                  className="w-full rounded-t-[12px] mt-2"
                  style={{
                    height: '40px',
                    background: 'linear-gradient(180deg, rgba(205, 127, 50, 0.2) 0%, rgba(205, 127, 50, 0.05) 100%)',
                    border: '1px solid rgba(205, 127, 50, 0.2)',
                    borderBottom: 'none',
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Full Rankings List */}
        <div className="space-y-3">
          <h2 className="text-white text-sm mb-3 px-1" style={{ fontWeight: 600 }}>
            Full Rankings
          </h2>
          
          {leaderboardData.map((member, index) => (
            <motion.div
              key={member.id}
              className="relative rounded-[16px] p-4 overflow-hidden"
              style={{
                background: member.isYou 
                  ? 'rgba(139, 92, 246, 0.08)' 
                  : 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                border: member.isYou 
                  ? '1px solid rgba(139, 92, 246, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.05)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                {/* Rank Number */}
                <div className="w-8 text-center">
                  {member.rank <= 3 ? (
                    <span className="text-2xl">{getMedalEmoji(member.rank)}</span>
                  ) : (
                    <span 
                      className="text-lg"
                      style={{ 
                        fontWeight: 700,
                        color: member.isYou ? '#8B5CF6' : '#6B7280',
                      }}
                    >
                      {member.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border-2"
                  style={{
                    borderColor: member.rank <= 3 ? getRankColor(member.rank) : 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div 
                    className="w-full h-full bg-gradient-to-br flex items-center justify-center text-white text-sm"
                    style={{
                      background: member.isYou
                        ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                        : 'linear-gradient(135deg, #6B7280, #4B5563)',
                      fontWeight: 700,
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Name & Stats */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p 
                      className="text-sm"
                      style={{ 
                        fontWeight: 600,
                        color: member.isYou ? '#8B5CF6' : '#FFFFFF',
                      }}
                    >
                      {member.isYou ? 'You' : member.name}
                    </p>
                    {member.rank === 1 && (
                      <Crown className="w-3.5 h-3.5 text-[#FFBF00]" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{member.averageScore}% avg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{member.currentStreak} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Total Unlocks */}
                <div className="text-right">
                  <p 
                    className="text-lg mb-0.5"
                    style={{ 
                      fontWeight: 700,
                      color: member.isYou ? '#8B5CF6' : '#FFFFFF',
                    }}
                  >
                    {member.totalUnlocks}
                  </p>
                  <p className="text-xs text-gray-500">unlocks</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivational Footer */}
        <motion.div
          className="mt-8 rounded-[16px] p-4 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 191, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%)',
            border: '1px solid rgba(255, 191, 0, 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Award className="w-8 h-8 text-[#FFBF00] mx-auto mb-2" />
          <p className="text-white text-sm mb-1" style={{ fontWeight: 600 }}>
            Keep Learning Together!
          </p>
          <p className="text-gray-400 text-xs">
            Family that learns together, grows together. 🌱
          </p>
        </motion.div>
      </div>
    </div>
  );
}
