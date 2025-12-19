import { useState, useEffect } from 'react';
import { Unlock, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Evaluation } from '../App';
import { ShareCard } from './ShareCard';
import { EvaluationLoadingState } from './EvaluationLoadingState';
import { triggerUnlockHaptic } from '../utils/haptics';
import { ANIMATION_DURATION } from '../utils/animationTiming';

interface EvaluationScreenProps {
  question: string;
  attempt: string;
  evaluation: Evaluation | null;
  isLoading?: boolean;
  isRevisionMode: boolean;
  onUnlock: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export function EvaluationScreen({
  question,
  attempt,
  evaluation,
  isLoading = false,
  isRevisionMode,
  onUnlock,
  onRetry,
  onHome,
}: EvaluationScreenProps) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [effortProgress, setEffortProgress] = useState(0);
  const [understandingProgress, setUnderstandingProgress] = useState(0);
  const [showShareCard, setShowShareCard] = useState(false);

  // Calculate percentages (out of 3) - only if evaluation exists
  const effortPercent = evaluation ? Math.round((evaluation.effort_score / 3) * 100) : 0;
  const understandingPercent = evaluation ? Math.round((evaluation.understanding_score / 3) * 100) : 0;

  // Check if this is a "high effort" score worth sharing (83%+ = 2.5/3 or higher)
  const isHighEffort = evaluation ? evaluation.effort_score >= 2.5 : false;

  // Animate lock opening and progress rings
  useEffect(() => {
    if (!evaluation) return;
    
    if (evaluation.unlock) {
      setTimeout(() => setShowUnlock(true), 300);
    }
    
    // Animate progress rings
    setTimeout(() => {
      setEffortProgress(effortPercent);
      setUnderstandingProgress(understandingPercent);
    }, 600);

    // Auto-show share card for high effort scores after animations complete
    if (isHighEffort && !evaluation.copied) {
      setTimeout(() => {
        setShowShareCard(true);
      }, 2000); // Show after 2 seconds to let user see their scores first
    }
  }, [evaluation, effortPercent, understandingPercent, isHighEffort]);

  // Show loading state
  if (isLoading || !evaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
        {/* Ambient purple glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative flex-1 flex items-center justify-center px-6">
          <EvaluationLoadingState />
        </div>
        
        {/* Back button during loading */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-6 bg-gradient-to-t from-black via-black to-transparent">
          <button
            onClick={onHome}
            className="w-full py-3 text-gray-400 hover:text-white transition-colors text-[15px]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // SVG circle calculations for progress rings
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  const getStrokeDashoffset = (percent: number) => {
    return circumference - (percent / 100) * circumference;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Ambient purple glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <div className="relative flex-1 px-6 pt-16 pb-40 overflow-y-auto">
        
        {/* Visual Hero - Holographic 3D Lock */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Holographic glow */}
            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
              showUnlock 
                ? 'bg-purple-500/60 scale-150' 
                : 'bg-purple-600/30 scale-100'
            }`} />
            
            {/* Lock Icon */}
            <div className={`relative w-32 h-32 flex items-center justify-center transition-all duration-700 ${
              showUnlock ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
            }`}>
              <Unlock 
                className={`w-20 h-20 transition-all duration-700 ${
                  showUnlock 
                    ? 'text-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]' 
                    : 'text-purple-500/50'
                }`} 
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Circular Progress Rings */}
        {!evaluation.copied && (
          <div className="flex justify-center gap-8 mb-12">
            {/* Effort Ring - Cyber Mint */}
            <div className="relative">
              <svg width="120" height="120" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#06d6a0"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={getStrokeDashoffset(effortProgress)}
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(6,214,160,0.6)]"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(6,214,160,0.6))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[32px] text-[#06d6a0]" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  {effortPercent}%
                </div>
                <div className="text-[13px] text-white/60">Effort</div>
              </div>
            </div>

            {/* Understanding Ring - Electric Violet */}
            <div className="relative">
              <svg width="120" height="120" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#a855f7"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={getStrokeDashoffset(understandingProgress)}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.7))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[32px] text-purple-500" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  {understandingPercent}%
                </div>
                <div className="text-[13px] text-white/60">Understanding</div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Card - Dark Grey with Emoji Bullets */}
        {!evaluation.copied && (
          <div className="bg-[#1a1a1a] rounded-[20px] p-6 border border-white/10 space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            
            {/* What you nailed */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✅</span>
                <h3 className="text-[17px] text-white" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  What you nailed
                </h3>
              </div>
              <p className="text-[15px] text-white/70 leading-relaxed pl-8">
                {evaluation.what_is_right}
              </p>
            </div>

            {/* What's missing */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚠️</span>
                <h3 className="text-[17px] text-white" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
                  What&apos;s missing
                </h3>
              </div>
              <p className="text-[15px] text-white/70 leading-relaxed pl-8">
                {evaluation.what_is_missing}
              </p>
            </div>
          </div>
        )}

        {/* Copied detection message */}
        {evaluation.copied && (
          <div className="bg-red-500/10 rounded-[20px] p-6 border border-red-500/30">
            <p className="text-[17px] text-red-200 text-center">
              This looks copied. Try explaining in your own words.
            </p>
          </div>
        )}

        {/* Question & Attempt */}
        <div className="mt-8 space-y-4">
          <div>
            <p className="text-[13px] text-white/40 mb-2">Your question</p>
            <p className="text-[15px] text-white/70">{question}</p>
          </div>
          
          <div>
            <p className="text-[13px] text-white/40 mb-2">Your attempt</p>
            <div className="bg-[#0A0A0A] rounded-[16px] p-4 border border-white/10">
              <p className="text-[15px] text-white/70 leading-relaxed">{attempt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-6 bg-gradient-to-t from-black via-black to-transparent space-y-3">
        {evaluation.unlock ? (
          <>
            {/* They earned it - encourage revision */}
            <button
              onClick={onRetry}
              className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-purple-600 to-violet-500 text-white text-[17px] shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all"
              style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
            >
              ✏️ Revise My Answer
            </button>
            
            {/* Skip option only appears after second attempt */}
            {isRevisionMode && (
              <button
                onClick={onUnlock}
                className="w-full h-[48px] rounded-[16px] bg-white/5 border border-white/10 text-white/70 text-[15px] hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all"
                style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                Skip to Full Answer →
              </button>
            )}
            
            {/* Share button for high effort scores */}
            {isHighEffort && !evaluation.copied && (
              <button
                onClick={() => setShowShareCard(true)}
                className="w-full h-[48px] rounded-[16px] bg-white/10 border border-white/20 text-white text-[15px] hover:bg-white/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                <Share2 size={18} />
                Share Achievement
              </button>
            )}
            
            <button
              onClick={onHome}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors text-[15px]"
            >
              Back to Home
            </button>
          </>
        ) : (
          <>
            {/* They're close but didn't unlock - show BOTH options */}
            
            {/* Primary: Try Again (with coach hint) */}
            <button
              onClick={onRetry}
              className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-purple-600 to-violet-500 text-white text-[17px] shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all"
              style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
            >
              🎯 Try Again with Hint
            </button>
            
            {/* Secondary: Give up and unlock anyway */}
            <button
              onClick={onUnlock}
              className="w-full h-[48px] rounded-[16px] bg-white/5 border border-white/10 text-white/70 text-[15px] hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all"
              style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
            >
              Unlock Full Explanation
            </button>
            
            {/* Share button for high effort scores (even if didn't unlock) */}
            {isHighEffort && !evaluation.copied && (
              <button
                onClick={() => setShowShareCard(true)}
                className="w-full h-[48px] rounded-[16px] bg-white/10 border border-white/20 text-white text-[15px] hover:bg-white/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}
              >
                <Share2 size={18} />
                Share Achievement
              </button>
            )}
            
            <button
              onClick={onHome}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors text-[15px]"
            >
              Back to Home
            </button>
          </>
        )}
      </div>

      {/* Share Card */}
      {showShareCard && (
        <ShareCard
          question={question}
          effortScore={evaluation.effort_score}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
}