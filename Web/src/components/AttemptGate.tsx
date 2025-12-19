import { useState, useEffect } from 'react';
import { Lock, Sparkles, Zap, Award, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInputWaveform } from './VoiceInputWaveform';
import { MercyModal } from './MercyModal';
import { getSubscriptionStatus } from '../utils/subscription';
import { validateMinimumWords, MINIMUM_WORD_COUNT } from '../utils/validation';
import { validateAttemptForNonsense } from '../utils/nonsenseDetection';
import { triggerTypingHaptic, triggerMasteryToggleHaptic, triggerValidationErrorHaptic } from '../utils/haptics';
import { isForceMasteryEnabled, isMercyButtonBlocked } from '../utils/guardianPin';
import { ANIMATION_PRESETS } from '../utils/animationTiming';
import { toast } from 'sonner';

interface AttemptGateProps {
  question: string;
  onSubmit: (attempt: string, masteryMode: boolean) => void;
  onBack: () => void;
  // Revision mode props
  previousAttempt?: string;
  coachHint?: string;
  // Mercy mode - allow skipping with consequences
  onRevealAnswer?: () => void;
  // Upgrade prompt trigger
  onShowUpgradePrompt?: (feature: 'voice' | 'mastery') => void;
}

export function AttemptGate({ question, onSubmit, onBack, previousAttempt, coachHint, onRevealAnswer, onShowUpgradePrompt }: AttemptGateProps) {
  const [attempt, setAttempt] = useState(previousAttempt || '');
  const [showHint, setShowHint] = useState(false);
  const [copiedDetected, setCopiedDetected] = useState(false);
  const [masteryMode, setMasteryMode] = useState(isForceMasteryEnabled());
  const [showCoachTip, setShowCoachTip] = useState(!!coachHint);
  const [showMercyModal, setShowMercyModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  // Get subscription status
  const subscriptionStatus = getSubscriptionStatus();
  
  // Guardian mode settings
  const forceMastery = isForceMasteryEnabled();
  const mercyBlocked = isMercyButtonBlocked();

  const isRevisionMode = !!previousAttempt && !!coachHint;

  const wordCount = attempt.trim().split(/\s+/).filter(w => w.length > 0).length;
  const wordValidation = validateMinimumWords(attempt);
  const canSubmit = wordValidation.valid;

  // Simple copy/paste detection
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text') || '';
      
      if (pastedText.length > 100) {
        setCopiedDetected(true);
        setTimeout(() => setCopiedDetected(false), 5000);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  // Show hint after 3 seconds of idle
  useEffect(() => {
    if (attempt.length === 0) {
      const timer = setTimeout(() => setShowHint(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [attempt]);

  const handleSubmit = () => {
    // Check word count validation
    if (!wordValidation.valid) {
      setIsShaking(true);
      triggerValidationErrorHaptic();
      toast.error(wordValidation.message || 'Add a bit more detail so I can understand you.');
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    
    // Check for nonsense
    const nonsenseCheck = validateAttemptForNonsense(attempt);
    if (!nonsenseCheck.valid) {
      setIsShaking(true);
      triggerValidationErrorHaptic();
      toast.error(nonsenseCheck.error || 'Type a real explanation to unlock the answer.');
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    
    onSubmit(attempt, masteryMode);
  };
  
  // Handle text input with haptic feedback
  const handleAttemptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length > attempt.length) {
      triggerTypingHaptic();
    }
    setAttempt(newValue);
  };

  // Handle keyboard submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        background: '#000000',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors text-[15px]"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pb-32">
        {/* Question Display */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Lock icon badge */}
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: masteryMode 
                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(251, 146, 60, 0.2))'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(167, 139, 250, 0.2))',
                  border: masteryMode
                    ? '1px solid rgba(249, 115, 22, 0.3)'
                    : '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <Lock 
                  className="w-5 h-5"
                  style={{ color: masteryMode ? '#FB923C' : '#A78BFA' }}
                />
              </div>
              <div>
                <p className="text-white/50 text-[13px] uppercase tracking-wider">
                  {masteryMode ? 'Mastery Challenge' : 'Think First'}
                </p>
              </div>
            </div>

            {/* Question */}
            <h1 className="text-white text-[24px] leading-tight mb-6">
              {question}
            </h1>

            {/* Mastery Mode Toggle - "Ignition" style */}
            <div className="mb-6">
              <motion.button
                onClick={() => {
                  // If force mastery is enabled by guardian, don't allow toggle
                  if (forceMastery) {
                    toast.info('Mastery Mode is locked by your guardian.');
                    return;
                  }
                  if (!subscriptionStatus.canUseMasteryMode && !masteryMode) {
                    // Show upgrade prompt for mastery mode
                    onShowUpgradePrompt?.('mastery');
                  } else {
                    const newMode = !masteryMode;
                    setMasteryMode(newMode);
                    if (newMode) {
                      triggerMasteryToggleHaptic();
                    }
                  }
                }}
                className="relative group"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all"
                  style={{
                    background: masteryMode 
                      ? 'rgba(249, 115, 22, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: masteryMode
                      ? '1px solid rgba(249, 115, 22, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Toggle Switch */}
                  <motion.div 
                    className="relative w-12 h-6 rounded-full"
                    style={{
                      background: masteryMode 
                        ? 'linear-gradient(135deg, #F97316, #FB923C)'
                        : 'rgba(255, 255, 255, 0.2)',
                    }}
                    animate={{
                      boxShadow: masteryMode 
                        ? '0 0 20px rgba(249, 115, 22, 0.4)'
                        : 'none',
                    }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                      animate={{
                        x: masteryMode ? 26 : 2,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                    
                    {/* Lock icon for free users */}
                    {!subscriptionStatus.canUseMasteryMode && !masteryMode && (
                      <Lock className="absolute top-1 right-1 w-3 h-3 text-gray-500" />
                    )}
                  </motion.div>

                  {/* Label */}
                  <div className="flex items-center gap-2 relative">
                    <Zap 
                      className="w-4 h-4"
                      style={{ color: masteryMode ? '#FB923C' : '#6B7280' }}
                    />
                    <span 
                      className="text-[14px]"
                      style={{ color: masteryMode ? '#FB923C' : '#9CA3AF' }}
                    >
                      Mastery Mode
                    </span>
                    
                    {/* Heat shimmer particles on toggle ON */}
                    <AnimatePresence>
                      {masteryMode && (
                        <>
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'linear-gradient(135deg, #F97316, #FB923C)',
                                left: `${10 + i * 8}px`,
                                top: '50%',
                              }}
                              initial={{ 
                                opacity: 1, 
                                y: 0, 
                                scale: 1,
                              }}
                              animate={{ 
                                opacity: 0, 
                                y: -20 - Math.random() * 10, 
                                x: (Math.random() - 0.5) * 20,
                                scale: 0,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: i * 0.05,
                                ease: 'easeOut',
                              }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Badge or Lock indicator */}
                  <AnimatePresence>
                    {masteryMode && (
                      <motion.div
                        className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] tracking-wide uppercase"
                        style={{
                          background: 'rgba(249, 115, 22, 0.2)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          color: '#FB923C',
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Award className="w-3 h-3" />
                        +2x XP
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!subscriptionStatus.canUseMasteryMode && !masteryMode && (
                    <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600/20 border border-purple-600/30">
                      <Lock className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] text-purple-400 uppercase tracking-wide">Pro</span>
                    </div>
                  )}
                </div>
              </motion.button>

              {/* Mastery Mode Description */}
              <AnimatePresence>
                {masteryMode && (
                  <motion.div
                    className="mt-3 px-4 py-3 rounded-[12px]"
                    style={{
                      background: 'rgba(249, 115, 22, 0.1)',
                      border: '1px solid rgba(249, 115, 22, 0.2)',
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="text-[13px] leading-relaxed" style={{ color: '#FB923C' }}>
                      🔥 AI expects deeper analysis. Worth 2x experience points.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Text Area - Code editor style with Voice Input */}
        <div className="relative mb-8">
          <motion.textarea
            value={attempt}
            onChange={handleAttemptChange}
            onKeyDown={handleKeyDown}
            placeholder={isRevisionMode ? "Add a bit more detail..." : "Type your explanation here…"}
            rows={12}
            className="w-full px-5 py-4 pr-16 rounded-[16px] focus:outline-none resize-none text-white text-[17px] placeholder:text-white/40 transition-all font-mono leading-relaxed caret-purple-500"
            style={{
              background: '#0A0A0A',
              border: masteryMode 
                ? '1px solid rgba(249, 115, 22, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              caretColor: masteryMode ? '#F97316' : '#a855f7',
            }}
            animate={{
              borderColor: masteryMode 
                ? 'rgba(249, 115, 22, 0.3)'
                : 'rgba(255, 255, 255, 0.2)',
            }}
            whileFocus={{
              borderColor: masteryMode 
                ? 'rgba(249, 115, 22, 0.5)'
                : 'rgba(168, 85, 247, 0.5)',
            }}
          />
          
          {/* Voice Input with Waveform */}
          <VoiceInputWaveform
            onTranscript={(text) => {
              setAttempt(prev => prev ? `${prev} ${text}` : text);
            }}
            masteryMode={masteryMode}
          />
          
          {/* Floating hint bubble */}
          {showHint && attempt.length === 0 && (
            <div className="absolute top-20 left-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="relative">
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-[12px] blur-md"
                  style={{
                    background: masteryMode 
                      ? 'rgba(249, 115, 22, 0.3)'
                      : 'rgba(34, 211, 238, 0.3)',
                  }}
                />
                
                {/* Bubble */}
                <div 
                  className="relative px-4 py-2.5 backdrop-blur-xl rounded-[12px]"
                  style={{
                    background: masteryMode 
                      ? 'rgba(249, 115, 22, 0.2)'
                      : 'rgba(34, 211, 238, 0.2)',
                    border: masteryMode
                      ? '1px solid rgba(249, 115, 22, 0.4)'
                      : '1px solid rgba(34, 211, 238, 0.4)',
                  }}
                >
                  <p 
                    className="text-[14px] whitespace-nowrap"
                    style={{
                      color: masteryMode ? '#FB923C' : '#67E8F9',
                    }}
                  >
                    {masteryMode ? 'Show me everything you know...' : 'Just give me the gist...'}
                  </p>
                </div>
                
                {/* Pointer */}
                <div 
                  className="absolute -bottom-1 left-6 w-2 h-2 border-l border-b rotate-45"
                  style={{
                    background: masteryMode 
                      ? 'rgba(249, 115, 22, 0.2)'
                      : 'rgba(34, 211, 238, 0.2)',
                    borderColor: masteryMode
                      ? 'rgba(249, 115, 22, 0.4)'
                      : 'rgba(34, 211, 238, 0.4)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Word count */}
          <div className="absolute bottom-4 left-5 text-[13px] text-white/40">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </div>

          {/* Copy/Paste Warning */}
          <AnimatePresence>
            {copiedDetected && (
              <motion.div
                className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-[12px] backdrop-blur-xl"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <p className="text-[13px] text-red-400 whitespace-nowrap">
                  ⚠️ Think for yourself - don&apos;t paste!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Text */}
        <div className="flex items-start gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <p className="text-[14px] leading-relaxed" style={{ color: '#67E8F9' }}>
            The AI will evaluate your effort. Show genuine thinking to unlock the answer.
          </p>
        </div>
      </div>

      {/* Coach Tip - Sticky Note Banner (above keyboard) */}
      <AnimatePresence>
        {isRevisionMode && showCoachTip && coachHint && (
          <motion.div
            className="fixed bottom-28 left-0 right-0 px-6 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="relative max-w-[480px] mx-auto">
              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5), rgba(124, 58, 237, 0.3))',
                }}
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Sticky note card */}
              <div
                className="relative rounded-2xl p-5 backdrop-blur-xl"
                style={{
                  background: 'rgba(20, 20, 20, 0.95)',
                  border: '2px solid rgba(139, 92, 246, 0.4)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.25)',
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowCoachTip(false)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

                {/* Header with emoji */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.3))',
                    }}
                  >
                    <span className="text-base">🎯</span>
                  </div>
                  <h3
                    className="text-base"
                    style={{
                      fontWeight: 700,
                      color: '#A78BFA',
                    }}
                  >
                    Coach Tip
                  </h3>
                </div>

                {/* Hint text */}
                <p
                  className="text-[15px] leading-relaxed mb-3"
                  style={{
                    color: '#C4B5FD',
                  }}
                >
                  {coachHint}
                </p>

                {/* Motivational footer */}
                <div
                  className="flex items-center justify-between pt-3"
                  style={{
                    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <p
                    className="text-[13px]"
                    style={{
                      color: '#8B5CF6',
                      fontWeight: 600,
                    }}
                  >
                    You&apos;re on the right track - just need a bit more detail.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Submit Button - Fixed */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-6"
        style={{
          background: 'linear-gradient(to top, #000000 80%, transparent)',
        }}
      >
        <motion.button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-[16px] text-white text-[17px] disabled:opacity-40 transition-all"
          style={{
            background: canSubmit
              ? masteryMode
                ? 'linear-gradient(135deg, #F97316, #FB923C)'
                : 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
              : 'rgba(255, 255, 255, 0.1)',
          }}
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          animate={isShaking ? {
            x: ANIMATION_PRESETS.shake.keyframes.x,
          } : canSubmit ? {
            boxShadow: masteryMode
              ? ['0 0 0 0 rgba(249, 115, 22, 0.4)', '0 0 20px 0 rgba(249, 115, 22, 0.2)']
              : ['0 0 0 0 rgba(139, 92, 246, 0.4)', '0 0 20px 0 rgba(139, 92, 246, 0.2)'],
          } : {}}
          transition={isShaking ? {
            duration: ANIMATION_PRESETS.shake.duration / 1000,
          } : {
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
        >
          {canSubmit ? '→ Submit Answer' : 'Start typing to continue...'}
        </motion.button>

        {/* Keyboard Shortcut Hint */}
        {canSubmit && (
          <p className="text-center text-[12px] text-white/30 mt-2">
            ⌘ + Enter to submit
          </p>
        )}

        {/* Mercy Mode Button - Hidden if blocked by guardian */}
        {onRevealAnswer && !mercyBlocked && (
          <button
            onClick={() => setShowMercyModal(true)}
            className="absolute left-6 bottom-6 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center transition-all hover:bg-red-600"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mercy Modal */}
      <MercyModal
        isOpen={showMercyModal}
        onClose={() => setShowMercyModal(false)}
        onRevealAnswer={() => {
          setShowMercyModal(false);
          onRevealAnswer?.();
        }}
        coachTip="Hint: Try defining the key term first!"
      />
    </div>
  );
}