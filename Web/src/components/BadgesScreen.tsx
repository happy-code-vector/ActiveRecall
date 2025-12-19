import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Award, Lock, CheckCircle2, type LucideIcon } from 'lucide-react';
import { 
  BADGE_DEFINITIONS, 
  getBadgesByCategory, 
  getRarityColor, 
  getRarityLabel,
  type Badge as BadgeDefinition,
  type BadgeCategory,
  type BadgeRarity
} from '../utils/badgeDefinitions';

interface EarnedBadge {
  badgeId: string;
  earnedDate: string;
}

interface BadgeProgress {
  badgeId: string;
  current: number;
  target: number;
}

interface BadgesScreenProps {
  userId: string;
  onBack: () => void;
}

const categoryLabels: Record<BadgeCategory, string> = {
  streak: '🔥 Streaks',
  mastery: '🧠 Mastery',
  milestone: '🏆 Milestones',
};

const categoryDescriptions: Record<BadgeCategory, string> = {
  streak: 'Maintain your learning fire',
  mastery: 'Depth of thought and quality',
  milestone: 'Experience and volume',
};

export function BadgesScreen({ userId, onBack }: BadgesScreenProps) {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | BadgeCategory>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      // Load earned badges from localStorage (in production, from API)
      const storedBadges = localStorage.getItem('thinkfirst_earnedBadges');
      const earned: EarnedBadge[] = storedBadges ? JSON.parse(storedBadges) : [
        // Mock some earned badges for demo
        { badgeId: 'the_initiate', earnedDate: '2025-12-10' },
        { badgeId: 'ignition', earnedDate: '2025-12-12' },
        { badgeId: 'synapse', earnedDate: '2025-12-13' },
      ];
      setEarnedBadges(earned);

      // Load progress for locked badges
      const storedProgress = localStorage.getItem('thinkfirst_badgeProgress');
      const progress: BadgeProgress[] = storedProgress ? JSON.parse(storedProgress) : [
        { badgeId: 'the_furnace', current: 5, target: 7 },
        { badgeId: 'the_apprentice', current: 6, target: 10 },
        { badgeId: 'momentum', current: 8, target: 14 },
      ];
      setBadgeProgress(progress);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEarned = (badgeId: string) => earnedBadges.some(b => b.badgeId === badgeId);
  const getEarnedDate = (badgeId: string) => earnedBadges.find(b => b.badgeId === badgeId)?.earnedDate;
  const getProgress = (badgeId: string) => badgeProgress.find(p => p.badgeId === badgeId);

  const filteredBadges = filter === 'all' 
    ? BADGE_DEFINITIONS 
    : getBadgesByCategory(filter);

  const earnedCount = earnedBadges.length;
  const totalCount = BADGE_DEFINITIONS.length;

  const categories: BadgeCategory[] = ['streak', 'mastery', 'milestone'];

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
            <h1 className="text-white flex-1 text-center -ml-10" style={{ fontWeight: 600 }}>
              Badge Collection
            </h1>
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
                  <div className="text-white text-2xl" style={{ fontWeight: 700 }}>
                    {earnedCount}/{totalCount}
                  </div>
                  <div className="text-gray-400 text-sm">Badges Earned</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-purple-400" style={{ fontWeight: 600 }}>
                  {Math.round((earnedCount / totalCount) * 100)}%
                </div>
                <div className="text-gray-400 text-sm">Complete</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #8B5CF6 0%, #22D3EE 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap"
              style={{
                background: filter === 'all' 
                  ? 'rgba(139, 92, 246, 0.2)' 
                  : 'rgba(20, 20, 20, 0.5)',
                color: filter === 'all' ? '#8B5CF6' : '#9CA3AF',
                border: filter === 'all' 
                  ? '1px solid rgba(139, 92, 246, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.05)',
                fontWeight: 500,
              }}
            >
              All ({totalCount})
            </button>
            {categories.map((cat) => {
              const catBadges = getBadgesByCategory(cat);
              const catEarned = catBadges.filter(b => isEarned(b.id)).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap"
                  style={{
                    background: filter === cat 
                      ? 'rgba(139, 92, 246, 0.2)' 
                      : 'rgba(20, 20, 20, 0.5)',
                    color: filter === cat ? '#8B5CF6' : '#9CA3AF',
                    border: filter === cat 
                      ? '1px solid rgba(139, 92, 246, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    fontWeight: 500,
                  }}
                >
                  {categoryLabels[cat]} ({catEarned}/{catBadges.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges Grid by Category */}
        <div className="px-6 space-y-8">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Loading badges...
            </div>
          ) : filter === 'all' ? (
            // Show all categories
            categories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                badges={getBadgesByCategory(category)}
                isEarned={isEarned}
                getEarnedDate={getEarnedDate}
                getProgress={getProgress}
                onSelectBadge={setSelectedBadge}
              />
            ))
          ) : (
            // Show single category
            <CategorySection
              category={filter}
              badges={filteredBadges}
              isEarned={isEarned}
              getEarnedDate={getEarnedDate}
              getProgress={getProgress}
              onSelectBadge={setSelectedBadge}
            />
          )}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal
            badge={selectedBadge}
            isEarned={isEarned(selectedBadge.id)}
            earnedDate={getEarnedDate(selectedBadge.id)}
            progress={getProgress(selectedBadge.id)}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface CategorySectionProps {
  category: BadgeCategory;
  badges: BadgeDefinition[];
  isEarned: (id: string) => boolean;
  getEarnedDate: (id: string) => string | undefined;
  getProgress: (id: string) => BadgeProgress | undefined;
  onSelectBadge: (badge: BadgeDefinition) => void;
}

function CategorySection({ category, badges, isEarned, getEarnedDate, getProgress, onSelectBadge }: CategorySectionProps) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-white text-lg" style={{ fontWeight: 600 }}>
          {categoryLabels[category]}
        </h2>
        <p className="text-gray-500 text-sm">{categoryDescriptions[category]}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, index) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            index={index}
            earned={isEarned(badge.id)}
            earnedDate={getEarnedDate(badge.id)}
            progress={getProgress(badge.id)}
            onClick={() => onSelectBadge(badge)}
          />
        ))}
      </div>
    </div>
  );
}

interface BadgeCardProps {
  badge: BadgeDefinition;
  index: number;
  earned: boolean;
  earnedDate?: string;
  progress?: BadgeProgress;
  onClick: () => void;
}

function BadgeCard({ badge, index, earned, earnedDate, progress, onClick }: BadgeCardProps) {
  const Icon = badge.icon;
  const rarityColor = getRarityColor(badge.rarity);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="rounded-[16px] overflow-hidden backdrop-blur-xl p-3 relative text-center"
      style={{
        background: earned 
          ? `linear-gradient(135deg, ${badge.color}20, ${badge.colorEnd}10)`
          : 'rgba(20, 20, 20, 0.5)',
        border: `1px solid ${earned ? badge.color + '40' : 'rgba(255, 255, 255, 0.05)'}`,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Earned Checkmark */}
      {earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: badge.color }}
        >
          <CheckCircle2 className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* Badge Icon */}
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-2 relative"
          style={{
            background: earned 
              ? `linear-gradient(135deg, ${badge.color}, ${badge.colorEnd})`
              : 'rgba(30, 30, 30, 0.5)',
            boxShadow: earned ? `0 0 20px ${badge.color}40` : 'none',
          }}
        >
          {earned ? (
            <Icon className="w-6 h-6 text-white" />
          ) : (
            <Lock className="w-5 h-5 text-gray-600" />
          )}
        </div>

        <h3
          className="text-xs mb-0.5 line-clamp-1"
          style={{ 
            color: earned ? 'white' : '#6B7280',
            fontWeight: 600,
          }}
        >
          {badge.name}
        </h3>
        
        {/* Rarity indicator */}
        <span 
          className="text-[10px]"
          style={{ color: rarityColor }}
        >
          {getRarityLabel(badge.rarity)}
        </span>
      </div>

      {/* Progress Bar for Locked Badges */}
      {!earned && progress && (
        <div className="mt-2">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(30, 30, 30, 0.5)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress.current / progress.target) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${badge.color}, ${badge.colorEnd})`,
              }}
            />
          </div>
          <span className="text-[10px] text-gray-500">
            {progress.current}/{progress.target}
          </span>
        </div>
      )}
    </motion.button>
  );
}

interface BadgeDetailModalProps {
  badge: BadgeDefinition;
  isEarned: boolean;
  earnedDate?: string;
  progress?: BadgeProgress;
  onClose: () => void;
}

function BadgeDetailModal({ badge, isEarned, earnedDate, progress, onClose }: BadgeDetailModalProps) {
  const Icon = badge.icon;
  const rarityColor = getRarityColor(badge.rarity);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Content */}
      <motion.div
        className="relative w-full max-w-sm rounded-[24px] overflow-hidden"
        style={{
          background: 'rgba(20, 20, 20, 0.98)',
          border: `2px solid ${isEarned ? badge.color + '60' : 'rgba(255, 255, 255, 0.1)'}`,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Glow effect */}
        {isEarned && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${badge.color}30, transparent 60%)`,
            }}
          />
        )}

        <div className="relative p-6">
          {/* Badge Icon - Large */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center relative"
              style={{
                background: isEarned 
                  ? `linear-gradient(135deg, ${badge.color}, ${badge.colorEnd})`
                  : 'rgba(30, 30, 30, 0.5)',
                boxShadow: isEarned ? `0 0 40px ${badge.color}60` : 'none',
              }}
              animate={isEarned ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {isEarned ? (
                <Icon className="w-12 h-12 text-white" />
              ) : (
                <Lock className="w-10 h-10 text-gray-600" />
              )}
            </motion.div>
          </div>

          {/* Badge Info */}
          <div className="text-center mb-6">
            <h2 className="text-white text-xl mb-1" style={{ fontWeight: 700 }}>
              {badge.name}
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              {badge.description}
            </p>
            
            {/* Rarity Badge */}
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs"
              style={{ 
                background: rarityColor + '20',
                color: rarityColor,
                border: `1px solid ${rarityColor}40`,
                fontWeight: 600,
              }}
            >
              {getRarityLabel(badge.rarity)}
            </span>
          </div>

          {/* Requirement */}
          <div 
            className="rounded-xl p-4 mb-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-gray-500 text-xs mb-1">Requirement</p>
            <p className="text-white text-sm" style={{ fontWeight: 500 }}>
              {badge.requirement}
            </p>
          </div>

          {/* Progress or Earned Date */}
          {isEarned && earnedDate ? (
            <div className="text-center">
              <p className="text-green-400 text-sm" style={{ fontWeight: 500 }}>
                ✓ Earned on {new Date(earnedDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          ) : progress ? (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span>{progress.current}/{progress.target}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(30, 30, 30, 0.5)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.current / progress.target) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${badge.color}, ${badge.colorEnd})`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Keep learning to unlock this badge!
              </p>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 rounded-xl text-white text-sm transition-all"
            style={{
              background: isEarned 
                ? `linear-gradient(135deg, ${badge.color}, ${badge.colorEnd})`
                : 'rgba(255, 255, 255, 0.1)',
              fontWeight: 600,
            }}
          >
            {isEarned ? 'Awesome!' : 'Close'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
