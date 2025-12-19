import { CheckCircle2, Home, ArrowRight, Sparkles, Lightbulb, X } from 'lucide-react';
import { Evaluation, StreakData } from '@/context/AppContext';
import { useState } from 'react';

interface AnswerScreenProps {
  question: string;
  attempt: string;
  evaluation: Evaluation;
  onHome: () => void;
  onNewQuestion: (question: string) => void;
  streak: StreakData;
}

const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  mitochondria: [
    'How does cellular respiration work?',
    'What is ATP?',
  ],
  photosynthesis: [
    'What is chlorophyll?',
    'How do plants use glucose?',
  ],
  dna: [
    'How does DNA replication work?',
    'What are genes?',
  ],
  newton: [
    'What is Newton\'s second law?',
    'What is inertia?',
  ],
  quantum: [
    'What is quantum entanglement?',
    'What is Schrödinger\'s cat?',
  ],
  gatsby: [
    'What are the themes in The Great Gatsby?',
    'Who is the narrator?',
  ],
};

export function AnswerScreen({
  question,
  attempt,
  evaluation,
  onHome,
  onNewQuestion,
  streak,
}: AnswerScreenProps) {
  const [showLevelUpTip, setShowLevelUpTip] = useState(true);
  
  const getFollowUpQuestions = () => {
    const questionLower = question.toLowerCase();
    for (const [key, questions] of Object.entries(FOLLOW_UP_QUESTIONS)) {
      if (questionLower.includes(key)) {
        return questions;
      }
    }
    return [];
  };

  const followUps = getFollowUpQuestions();

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] relative overflow-hidden">
      {/* Success glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Success Banner */}
      <div className="relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl px-5 pt-12 pb-8 border-b border-green-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/40 rounded-full blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl text-white mb-1">Well done!</h2>
            <p className="text-green-200/80 text-sm">
              {streak.count === 1 ? 'Streak Started: Day 1' : `Day ${streak.count} — keep it going!`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 px-5 pt-6 pb-40 overflow-y-auto">
        {/* Question */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Question</p>
          <p className="text-lg text-white">{question}</p>
        </div>

        {/* Your Attempt */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Your attempt</p>
          <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-5 text-sm text-gray-300 border border-white/10">
            {attempt}
          </div>
        </div>

        {/* Full Explanation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-500">Complete explanation</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-6 text-sm text-white/90 border border-purple-500/20 leading-relaxed space-y-3">
            {evaluation.full_explanation.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Level Up Tip - Show when unlocked but scores aren't perfect */}
        {evaluation.level_up_tip && showLevelUpTip && (
          <div className="relative mb-6">
            {/* Cyan glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl" />
            
            <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-5 border border-cyan-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm text-cyan-300">💡 Level Up Your Recall</p>
                    <button
                      onClick={() => setShowLevelUpTip(false)}
                      className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
                      aria-label="Dismiss tip"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-cyan-100 leading-relaxed mb-3">
                    {evaluation.level_up_tip}
                  </p>
                  
                  <p className="text-xs text-cyan-300/60">
                    Pro tip for next time →
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What You Learned */}
        <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-white/10">
          <p className="text-xs text-gray-500 mb-4">What you learned</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-green-400 mb-1">You already knew</p>
              <p className="text-sm text-gray-300">{evaluation.what_is_right}</p>
            </div>
            <div>
              <p className="text-xs text-orange-400 mb-1">New understanding</p>
              <p className="text-sm text-gray-300">{evaluation.what_is_missing}</p>
            </div>
          </div>
        </div>

        {/* Follow-up Questions */}
        {followUps.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-3">Continue learning</p>
            <div className="space-y-2">
              {followUps.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onNewQuestion(q)}
                  className="w-full px-5 py-4 bg-white/5 backdrop-blur-xl rounded-3xl text-left text-white border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all flex items-center justify-between group"
                >
                  <span className="text-sm">{q}</span>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-5 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent">
        <button
          onClick={onHome}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
        <p className="text-center text-xs text-gray-500 mt-3">
          Come back tomorrow for Day {streak.count + 1}
        </p>
      </div>
    </div>
  );
}