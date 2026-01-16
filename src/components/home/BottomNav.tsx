import { BarChart3, Clock, Brain, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { StreakData } from '@/context/AppContext';
import { ANIMATION_DURATION } from '../../utils/animationTiming';

interface BottomNavProps {
  currentTab: 'home' | 'progress' | 'history' | 'learn' | 'profile';
  onGoToHome?: () => void;
  onGoToProgress?: () => void;
  onGoToHistory?: () => void;
  onGoToTechniques?: () => void;
  streak?: StreakData;
  isParent?: boolean;
  onGoToParentDashboard?: () => void;
}

export function BottomNav({
  currentTab,
  onGoToHome,
  onGoToProgress,
  onGoToHistory,
  onGoToTechniques,
  streak,
  isParent,
  onGoToParentDashboard,
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-5 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent z-40 pointer-events-none">
      <div className="bg-[#1E1E1E]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-2 flex items-center gap-2 pointer-events-auto">
        {/* Home Tab */}
        {onGoToHome && (
          <button
            onClick={onGoToHome}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-colors ${
              currentTab === 'home'
                ? 'bg-white/10'
                : 'hover:bg-white/5 active:bg-white/10'
            }`}
          >
            <Home className={`w-5 h-5 ${currentTab === 'home' ? 'text-white' : 'text-gray-400'}`} />
            <span className={`text-sm ${currentTab === 'home' ? 'text-white' : 'text-gray-300'}`}>
              Home
            </span>
          </button>
        )}

        {/* Progress Tab */}
        {onGoToProgress && (
          <button
            onClick={onGoToProgress}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-colors relative ${
              currentTab === 'progress'
                ? 'bg-white/10'
                : 'hover:bg-white/5 active:bg-white/10'
            }`}
          >
            <BarChart3 className={`w-5 h-5 ${currentTab === 'progress' ? 'text-white' : 'text-gray-400'}`} />
            <span className={`text-sm ${currentTab === 'progress' ? 'text-white' : 'text-gray-300'}`}>
              Progress
            </span>
            {/* Streak count badge with scale animation */}
            {streak && streak.count > 0 && (
              <motion.div 
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-orange-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 25,
                }}
                whileHover={{
                  scale: [1, 1.1, 1],
                  transition: {
                    duration: ANIMATION_DURATION.SLOW / 1000,
                    ease: 'easeInOut',
                  },
                }}
              >
                <motion.span 
                  className="text-[10px] text-white" 
                  style={{ fontWeight: 700 }}
                  key={streak.count}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                  }}
                >
                  {streak.count}
                </motion.span>
              </motion.div>
            )}
          </button>
        )}

        {/* History Tab */}
        {onGoToHistory && (
          <button
            onClick={onGoToHistory}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-colors ${
              currentTab === 'history'
                ? 'bg-white/10'
                : 'hover:bg-white/5 active:bg-white/10'
            }`}
          >
            <Clock className={`w-5 h-5 ${currentTab === 'history' ? 'text-white' : 'text-gray-400'}`} />
            <span className={`text-sm ${currentTab === 'history' ? 'text-white' : 'text-gray-300'}`}>
              History
            </span>
          </button>
        )}

        {/* Learn Tab (Techniques) */}
        {onGoToTechniques && (
          <button
            onClick={onGoToTechniques}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-colors ${
              currentTab === 'learn'
                ? 'bg-white/10'
                : 'hover:bg-white/5 active:bg-white/10'
            }`}
          >
            <Brain className={`w-5 h-5 ${currentTab === 'learn' ? 'text-white' : 'text-gray-400'}`} />
            <span className={`text-sm ${currentTab === 'learn' ? 'text-white' : 'text-gray-300'}`}>
              Learn
            </span>
          </button>
        )}

        {/* Profile Tab (Parent Dashboard) */}
        {isParent && onGoToParentDashboard && (
          <button
            onClick={onGoToParentDashboard}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-colors ${
              currentTab === 'profile'
                ? 'bg-white/10'
                : 'hover:bg-white/5 active:bg-white/10'
            }`}
          >
            <Home className={`w-5 h-5 ${currentTab === 'profile' ? 'text-white' : 'text-gray-400'}`} />
            <span className={`text-sm ${currentTab === 'profile' ? 'text-white' : 'text-gray-300'}`}>
              Profile
            </span>
          </button>
        )}
      </div>
    </div>
  );
}