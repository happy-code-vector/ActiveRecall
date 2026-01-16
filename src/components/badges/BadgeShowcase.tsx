import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { 
  BADGE_DEFINITIONS, 
  getBadgeById, 
  getRarityColor,
  getRarityLabel,
  type BadgeCategory 
} from '../../utils/badgeDefinitions';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface BadgeShowcaseProps {
  userId: string;
}

interface EarnedBadge {
  badgeId: string;
  awardedAt: string;
}

export function BadgeShowcase({ userId }: BadgeShowcaseProps) {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/badges/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEarnedBadges(data);
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const earnedBadgeIds = earnedBadges.map(b => b.badgeId);
  
  // Filter badges by category
  const filteredBadges = BADGE_DEFINITIONS.filter(badge => 
    selectedCategory === 'all' || badge.category === selectedCategory
  );

  const categories: { id: BadgeCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'streak', label: 'Streaks' },
    { id: 'mastery', label: 'Mastery' },
    { id: 'milestone', label: 'Milestones' },
  ];

  const selectedBadgeData = selectedBadge ? getBadgeById(selectedBadge) : null;
  const isEarned = selectedBadge ? earnedBadgeIds.includes(selectedBadge) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>
            Badges & Achievements
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {earnedBadges.length} of {BADGE_DEFINITIONS.length} earned
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          const chipColors = {
            all: { bg: '#8A2BE2', glow: 'rgba(138, 43, 226, 0.3)' },
            streak: { bg: '#FF6B35', glow: 'rgba(255, 107, 53, 0.3)' },
            mastery: { bg: '#A855F7', glow: 'rgba(168, 85, 247, 0.3)' },
            milestone: { bg: '#FFD700', glow: 'rgba(255, 215, 0, 0.3)' },
          };
          const colors = chipColors[cat.id as keyof typeof chipColors];
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              style={{
                fontWeight: 600,
                ...(isActive && {
                  background: colors.bg,
                  boxShadow: `0 0 20px ${colors.glow}`,
                }),
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Badge Grid */}
      {loading ? (
        <div className="grid grid-cols-4 gap-3">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {filteredBadges.map(badge => {
            const earned = earnedBadgeIds.includes(badge.id);
            const Icon = badge.icon;

            return (
              <motion.button
                key={badge.id}
                onClick={() => setSelectedBadge(badge.id)}
                className="aspect-square rounded-2xl relative overflow-hidden"
                style={{
                  background: earned
                    ? `linear-gradient(135deg, ${badge.color}, ${badge.colorEnd})`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: earned
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.02 * filteredBadges.indexOf(badge) }}
              >
                {/* Shine effect for earned badges */}
                {earned && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: 'linear',
                    }}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {earned ? (
                    <Icon
                      size={32}
                      className="text-white drop-shadow-lg"
                      strokeWidth={2}
                    />
                  ) : (
                    <>
                      {/* Show the actual badge icon even when locked, but grayed out */}
                      <Icon
                        size={28}
                        className="text-gray-600/40"
                        strokeWidth={2}
                      />
                      {/* Small lock indicator in corner */}
                      <div className="absolute top-1 right-1">
                        <Lock
                          size={12}
                          className="text-gray-600"
                          strokeWidth={2.5}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Rarity indicator for earned badges */}
                {earned && (
                  <div
                    className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
                    style={{
                      background: getRarityColor(badge.rarity),
                      boxShadow: `0 0 8px ${getRarityColor(badge.rarity)}`,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && selectedBadgeData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setSelectedBadge(null)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: isEarned
                  ? `linear-gradient(135deg, ${selectedBadgeData.color}20, ${selectedBadgeData.colorEnd}20)`
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-20"
              >
                <X size={20} className="text-white" />
              </button>

              <div className="p-8">
                {/* Badge Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-32 h-32 rounded-3xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: isEarned
                        ? `linear-gradient(135deg, ${selectedBadgeData.color}, ${selectedBadgeData.colorEnd})`
                        : 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {/* Animated glow for earned badges */}
                    {isEarned && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          background: `radial-gradient(circle, ${selectedBadgeData.color}60, transparent)`,
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
                    )}

                    <div className="relative z-10">
                      {isEarned ? (
                        <selectedBadgeData.icon
                          size={64}
                          className="text-white drop-shadow-2xl"
                          strokeWidth={2}
                        />
                      ) : (
                        <Lock
                          size={48}
                          className="text-gray-600"
                          strokeWidth={2}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge Info */}
                <div className="text-center mb-6">
                  {/* Rarity Badge */}
                  <div className="flex justify-center mb-3">
                    <div
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        background: `${getRarityColor(selectedBadgeData.rarity)}20`,
                        color: getRarityColor(selectedBadgeData.rarity),
                        border: `1px solid ${getRarityColor(selectedBadgeData.rarity)}40`,
                        fontWeight: 700,
                      }}
                    >
                      {getRarityLabel(selectedBadgeData.rarity).toUpperCase()}
                    </div>
                  </div>

                  <h3 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
                    {selectedBadgeData.name}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {selectedBadgeData.description}
                  </p>

                  {/* Requirement */}
                  <div
                    className="inline-block px-4 py-2 rounded-full text-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span className="text-gray-500">Requirement: </span>
                    <span className="text-white" style={{ fontWeight: 600 }}>
                      {selectedBadgeData.requirement}
                    </span>
                  </div>
                </div>

                {/* Earned Status */}
                {isEarned ? (
                  <div className="text-center">
                    <div className="text-green-400 text-sm mb-1" style={{ fontWeight: 600 }}>
                      ✓ Unlocked
                    </div>
                    <p className="text-gray-500 text-xs">
                      Earned on{' '}
                      {new Date(
                        earnedBadges.find(b => b.badgeId === selectedBadge)?.awardedAt || ''
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-gray-600 text-sm" style={{ fontWeight: 600 }}>
                      🔒 Locked
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                      Keep learning to unlock this badge!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}