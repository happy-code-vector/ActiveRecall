import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Brain, BatteryLow, Eye, Clock } from 'lucide-react';

interface DifficultyFrictionModalProps {
  currentMode: 'easy' | 'medium' | 'hard' | 'mastery';
  targetMode: 'easy' | 'medium' | 'hard' | 'mastery';
  requireReason: boolean;
  streak?: number;
  onConfirm: (reason?: 'tired' | 'confused' | 'other') => void;
  onCancel: () => void;
}

const MODE_LABELS = {
  easy: 'Easy Mode',
  medium: 'Standard Mode',
  hard: 'Hard Mode',
  mastery: 'Mastery Mode',
};

type ReasonType = 'too-hard' | 'tired' | 'browsing' | 'rush';

export function DifficultyFrictionModal({
  currentMode,
  targetMode,
  requireReason,
  streak = 0,
  onConfirm,
  onCancel,
}: DifficultyFrictionModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReasonType | null>(null);

  const isDowngrade = getModeLevel(targetMode) < getModeLevel(currentMode);

  if (!isDowngrade) {
    // No friction for upgrades
    onConfirm();
    return null;
  }

  const handleConfirmWithReason = () => {
    // Map selection to the callback reason types
    const reasonMap: Record<ReasonType, 'tired' | 'confused' | 'other'> = {
      'too-hard': 'confused',
      'tired': 'tired',
      'browsing': 'other',
      'rush': 'other',
    };
    
    const reason = selectedReason ? reasonMap[selectedReason] : 'other';
    onConfirm(reason);
  };

  if (!requireReason) {
    // Simple confirmation with asymmetric buttons
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 px-6">
        <motion.div
          className="bg-[#1A1A1A] rounded-[24px] max-w-md w-full overflow-hidden relative"
          style={{
            boxShadow: '0 0 60px rgba(138, 43, 226, 0.3), 0 0 100px rgba(138, 43, 226, 0.15)',
          }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Subtle Electric Violet Glow Edge */}
          <div className="absolute inset-0 rounded-[24px] border border-[#8A2BE2]/30 pointer-events-none" />

          <div className="p-6 pb-5">
            {/* Coach Tip - Streak Reminder */}
            {streak > 0 && (
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-[11px] text-[#A78BFA]" style={{ fontWeight: 600 }}>
                  🔥 You're on a {streak}-day streak. Don't break the flow!
                </span>
              </motion.div>
            )}

            {/* Icon - Thinking Face */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#8A2BE2]/15 flex items-center justify-center">
                <div className="text-3xl">🤔</div>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-white text-xl text-center mb-3" style={{ fontWeight: 700 }}>
              Switch to {MODE_LABELS[targetMode]}?
            </h2>

            {/* Body Text */}
            <p className="text-gray-400 text-sm text-center leading-relaxed mb-6">
              You are switching to lower difficulty. You will earn <span className="text-orange-400" style={{ fontWeight: 600 }}>50% fewer XP</span> for this session, and this change will be noted in your <span className="text-[#8A2BE2]" style={{ fontWeight: 500 }}>Weekly Report</span>.
            </p>

            {/* Asymmetric Horizontal Split Buttons */}
            <div className="flex gap-2">
              {/* Primary Button - 70% width */}
              <button
                onClick={onCancel}
                className="flex-[7] h-[52px] rounded-[16px] bg-gradient-to-r from-[#8A2BE2] to-[#7C3AED] text-white shadow-lg shadow-[#8A2BE2]/40 active:scale-[0.98] transition-transform"
                style={{ fontWeight: 700 }}
              >
                Stay in {MODE_LABELS[currentMode]}
              </button>

              {/* Secondary Button - 30% width */}
              <button
                onClick={() => onConfirm()}
                className="flex-[3] h-[52px] rounded-[16px] bg-transparent border-2 border-white/20 text-gray-300 text-sm hover:border-white/30 hover:bg-white/5 transition-all"
                style={{ fontWeight: 500 }}
              >
                Switch
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Bottom-sheet with reason selection
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-end">
        {/* Backdrop - Click to cancel */}
        <motion.div
          className="absolute inset-0"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Bottom Sheet */}
        <motion.div
          className="relative w-full bg-[#1A1A1A] rounded-t-[32px] border-t border-white/10"
          style={{
            boxShadow: '0 -4px 60px rgba(0, 0, 0, 0.6)',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 rounded-full bg-white/20" />
          </div>

          <div className="px-6 pb-8 pt-2">
            {/* Coach Tip - Streak Reminder */}
            {streak > 0 && (
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-[11px] text-[#A78BFA]" style={{ fontWeight: 600 }}>
                  🔥 You're on a {streak}-day streak. Don't break the flow!
                </span>
              </motion.div>
            )}

            {/* Header */}
            <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
              Quick Check-in
            </h2>

            {/* Subheader */}
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Why are you lowering difficulty? (This helps your Weekly Report)
            </p>

            {/* Selection Chips Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Chip 1: Topic is too hard */}
              <motion.button
                onClick={() => setSelectedReason('too-hard')}
                className="relative h-[88px] rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 transition-all"
                style={{
                  background: selectedReason === 'too-hard' 
                    ? 'rgba(255, 95, 31, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedReason === 'too-hard'
                    ? '2px solid #FF5F1F'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: selectedReason === 'too-hard'
                    ? '0 0 20px rgba(255, 95, 31, 0.4)'
                    : 'none',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Brain 
                  className={selectedReason === 'too-hard' ? 'text-[#FF5F1F]' : 'text-gray-400'} 
                  size={24} 
                />
                <span 
                  className={`text-xs text-center ${selectedReason === 'too-hard' ? 'text-[#FF5F1F]' : 'text-gray-300'}`}
                  style={{ fontWeight: 500 }}
                >
                  Topic is too hard
                </span>
              </motion.button>

              {/* Chip 2: Feeling Tired */}
              <motion.button
                onClick={() => setSelectedReason('tired')}
                className="relative h-[88px] rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 transition-all"
                style={{
                  background: selectedReason === 'tired' 
                    ? 'rgba(255, 95, 31, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedReason === 'tired'
                    ? '2px solid #FF5F1F'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: selectedReason === 'tired'
                    ? '0 0 20px rgba(255, 95, 31, 0.4)'
                    : 'none',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <BatteryLow 
                  className={selectedReason === 'tired' ? 'text-[#FF5F1F]' : 'text-gray-400'} 
                  size={24} 
                />
                <span 
                  className={`text-xs text-center ${selectedReason === 'tired' ? 'text-[#FF5F1F]' : 'text-gray-300'}`}
                  style={{ fontWeight: 500 }}
                >
                  Feeling Tired
                </span>
              </motion.button>

              {/* Chip 3: Just Browsing */}
              <motion.button
                onClick={() => setSelectedReason('browsing')}
                className="relative h-[88px] rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 transition-all"
                style={{
                  background: selectedReason === 'browsing' 
                    ? 'rgba(255, 95, 31, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedReason === 'browsing'
                    ? '2px solid #FF5F1F'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: selectedReason === 'browsing'
                    ? '0 0 20px rgba(255, 95, 31, 0.4)'
                    : 'none',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Eye 
                  className={selectedReason === 'browsing' ? 'text-[#FF5F1F]' : 'text-gray-400'} 
                  size={24} 
                />
                <span 
                  className={`text-xs text-center ${selectedReason === 'browsing' ? 'text-[#FF5F1F]' : 'text-gray-300'}`}
                  style={{ fontWeight: 500 }}
                >
                  Just Browsing
                </span>
              </motion.button>

              {/* Chip 4: In a Rush */}
              <motion.button
                onClick={() => setSelectedReason('rush')}
                className="relative h-[88px] rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 transition-all"
                style={{
                  background: selectedReason === 'rush' 
                    ? 'rgba(255, 95, 31, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedReason === 'rush'
                    ? '2px solid #FF5F1F'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: selectedReason === 'rush'
                    ? '0 0 20px rgba(255, 95, 31, 0.4)'
                    : 'none',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Clock 
                  className={selectedReason === 'rush' ? 'text-[#FF5F1F]' : 'text-gray-400'} 
                  size={24} 
                />
                <span 
                  className={`text-xs text-center ${selectedReason === 'rush' ? 'text-[#FF5F1F]' : 'text-gray-300'}`}
                  style={{ fontWeight: 500 }}
                >
                  In a Rush
                </span>
              </motion.button>
            </div>

            {/* Confirm Button */}
            <motion.button
              onClick={handleConfirmWithReason}
              disabled={!selectedReason}
              className="w-full h-[52px] rounded-[16px] transition-all"
              style={{
                background: selectedReason
                  ? 'linear-gradient(135deg, #8A2BE2, #7C3AED)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: selectedReason ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                fontWeight: 600,
                boxShadow: selectedReason
                  ? '0 4px 20px rgba(138, 43, 226, 0.4)'
                  : 'none',
              }}
              whileTap={selectedReason ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Confirm Switch
            </motion.button>

            {/* Cancel link */}
            <motion.button
              onClick={onCancel}
              className="w-full text-gray-500 text-sm hover:text-gray-400 transition-colors py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              Never mind
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getModeLevel(mode: 'easy' | 'medium' | 'hard' | 'mastery'): number {
  const levels = { easy: 1, medium: 2, hard: 3, mastery: 4 };
  return levels[mode];
}
