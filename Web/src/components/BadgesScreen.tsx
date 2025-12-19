import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Award, Lock, Star, Flame, Trophy, Target, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'star' | 'flame' | 'trophy' | 'target' | 'zap' | 'trending';
  tier: 'bronze' | 'silver' | 'gold';
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface BadgesScreenProps {
  userId: string;
  onBack: () => void;
}

const iconMap = {
  star: Star,
  flame: Flame,
  trophy: Trophy,
  target: Target,
  zap: Zap,
  trending: TrendingUp,
};

const tierColors = {
  bronze: {
    bg: 'rgba(205, 127, 50, 0.15)',
    border: 'rgba(205, 127, 50, 0.3)',
    glow: 'rgba(205, 127, 50, 0.5)',
    text: '#CD7F32',
  },
  silver: {
    bg: 'rgba(192, 192, 192, 0.15)',
    border: 'rgba(192, 192, 192, 0.3)',
    glow: 'rgba(192, 192, 192, 0.5)',
    text: '#C0C0C0',
  },
  gold: {
    bg: 'rgba(255, 215, 0, 0.15)',
    border: 'rgba(255, 215, 0, 0.3)',
    glow: 'rgba(255, 215, 0, 0.5)',
    text: '#FFD700',
  },
};

export function BadgesScreen({ userId, onBack }: BadgesScreenProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // For now, using mock data
      const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Complete your first question',
          icon: 'star',
          tier: 'bronze',
          earned: true,
          earnedDate: '2025-12-10',
        },
        {
          id: '2',
          name: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: 'flame',
          tier: 'silver',
          earned: true,
          earnedDate: '2025-12-12',
        },
        {
          id: '3',
          name: 'Perfect Score',
          description: 'Get 100% on understanding',
          icon: 'trophy',
          tier: 'gold',
          earned: true,
          earnedDate: '2025-12-13',
        },
        {
          id: '4',
          name: 'Sharpshooter',
          description: 'Answer 50 questions correctly',
          icon: 'target',
          tier: 'silver',
          earned: false,
          progress: 23,
          maxProgress: 50,
        },
        {
          id: '5',
          name: 'Speed Demon',
          description: 'Complete 10 questions in one day',
          icon: 'zap',
          tier: 'bronze',
          earned: false,
          progress: 3,
          maxProgress: 10,
        },
        {
          id: '6',
          name: 'Master Mind',
          description: 'Unlock 100 answers',
          icon: 'trending',
          tier: 'gold',
          earned: false,
          progress: 45,
          maxProgress: 100,
        },
      ];
      
      setBadges(mockBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges = badges.filter((badge) => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return true;
  });

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#000000' }}>
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[128px] opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-normal filter blur-[128px] opacity-10" />

      <div className="relative z-10 pb-8">
        {/* Header */}
        <div className="px-6 pt-14 pb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-white hover:bg-opacity-[0.02] active:bg-opacity-[0.05] rounded-full transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-white flex-1 text-center -ml-10">My Badges</h1>
            <div className="w-6" />
          </div>

          {/* Progress Summary */}
          <motion.div
            className="rounded-[24px] overflow-hidden backdrop-blur-xl p-6"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)',
                  }}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white text-2xl">{earnedCount}/{totalCount}</div>
                  <div className="text-gray-400 text-sm">Badges Earned</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-purple-400">{Math.round((earnedCount / totalCount) * 100)}%</div>
                <div className="text-gray-400 text-sm">Complete</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 mb-6">
          <div className="flex gap-2">
            {(['all', 'earned', 'locked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  background: filter === tab 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(20, 20, 20, 0.5)',
                  color: filter === tab ? '#8B5CF6' : '#9CA3AF',
                  border: filter === tab 
                    ? '1px solid rgba(139, 92, 246, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && (
                  <span className="ml-1">
                    ({tab === 'earned' ? earnedCount : totalCount - earnedCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="px-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Loading badges...
            </div>
          ) : filteredBadges.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <div className="text-gray-400">No {filter} badges</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredBadges.map((badge, index) => (
                <BadgeCard key={badge.id} badge={badge} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge, index }: { badge: Badge; index: number }) {
  const Icon = iconMap[badge.icon];
  const colors = tierColors[badge.tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-[16px] overflow-hidden backdrop-blur-xl p-4 relative"
      style={{
        background: badge.earned 
          ? colors.bg
          : 'rgba(20, 20, 20, 0.5)',
        border: `1px solid ${badge.earned ? colors.border : 'rgba(255, 255, 255, 0.05)'}`,
      }}
    >
      {/* Earned Checkmark */}
      {badge.earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: colors.glow }}
        >
          <CheckCircle2 className="w-4 h-4" style={{ color: colors.text }} />
        </motion.div>
      )}

      {/* Badge Icon */}
      <div className="flex flex-col items-center text-center mb-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3 relative"
          style={{
            background: badge.earned 
              ? `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`
              : 'rgba(30, 30, 30, 0.5)',
          }}
        >
          {badge.earned ? (
            <Icon className="w-8 h-8" style={{ color: colors.text }} />
          ) : (
            <Lock className="w-8 h-8 text-gray-600" />
          )}
        </div>

        <h3
          className="text-sm mb-1"
          style={{ color: badge.earned ? 'white' : '#6B7280' }}
        >
          {badge.name}
        </h3>
        <p className="text-xs text-gray-500 leading-tight">
          {badge.description}
        </p>
      </div>

      {/* Progress Bar for Locked Badges */}
      {!badge.earned && badge.progress !== undefined && badge.maxProgress && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{badge.progress}/{badge.maxProgress}</span>
            <span>{Math.round((badge.progress / badge.maxProgress) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30, 30, 30, 0.5)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #8B5CF6 0%, #22D3EE 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Earned Date */}
      {badge.earned && badge.earnedDate && (
        <div className="text-xs text-gray-500 text-center mt-2">
          Earned {new Date(badge.earnedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}
    </motion.div>
  );
}