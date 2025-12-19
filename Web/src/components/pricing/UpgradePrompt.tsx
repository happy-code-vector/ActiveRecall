import { motion } from 'motion/react';
import { Lock, Sparkles, Mic, Target, Award, TrendingUp, X } from 'lucide-react';

interface UpgradePromptProps {
  feature: 'voice' | 'mastery' | 'coach' | 'badges' | 'stats' | 'questions';
  onUpgrade: () => void;
  onClose: () => void;
  questionsRemaining?: number;
}

const FEATURE_CONFIG = {
  questions: {
    icon: Sparkles,
    color: '#8B5CF6',
    title: 'Daily Question Limit Reached',
    description: 'Upgrade to Solo Plan for unlimited questions and accelerate your learning journey.',
    benefits: [
      'Unlimited questions every day',
      'All difficulty modes unlocked',
      'Voice input enabled',
      'AI coach tips',
      'Full badge collection'
    ]
  },
  voice: {
    icon: Mic,
    color: '#22D3EE',
    title: 'Voice Input',
    description: 'Speak your answers naturally with advanced voice recognition and animated waveforms.',
    benefits: [
      'Hands-free answer input',
      'Natural conversation flow',
      'Real-time waveform animation',
      'Perfect for mobile learning'
    ]
  },
  mastery: {
    icon: Target,
    color: '#FF5F1F',
    title: 'Mastery Mode',
    description: 'Challenge yourself with the highest difficulty level and prove true understanding.',
    benefits: [
      'Most challenging questions',
      'Deeper concept evaluation',
      'Premium badge unlocks',
      'Advanced skill development'
    ]
  },
  coach: {
    icon: Sparkles,
    color: '#8B5CF6',
    title: 'AI Coach Tips',
    description: 'Get personalized improvement suggestions after every answer with Level Up coaching.',
    benefits: [
      'Personalized feedback',
      'Learning optimization tips',
      'Skill gap identification',
      'Faster improvement'
    ]
  },
  badges: {
    icon: Award,
    color: '#22D3EE',
    title: 'Premium Badges',
    description: 'Unlock the complete badge collection and showcase your mastery achievements.',
    benefits: [
      '20+ unique badges',
      'Rare achievement unlocks',
      'Progress milestones',
      'Leaderboard status'
    ]
  },
  stats: {
    icon: TrendingUp,
    color: '#8B5CF6',
    title: 'Advanced Analytics',
    description: 'Track detailed performance metrics, streaks, and subject breakdowns.',
    benefits: [
      'Streak tracking',
      'Time analytics',
      'Subject performance',
      'Progress trends'
    ]
  }
};

export function UpgradePrompt({ feature, onUpgrade, onClose, questionsRemaining }: UpgradePromptProps) {
  const config = FEATURE_CONFIG[feature];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        className="bg-[#1A1A1A] rounded-[24px] max-w-md w-full border border-white/10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>

        {/* Header with icon */}
        <div className="relative pt-8 pb-6 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
          <div className="relative flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
                boxShadow: `0 0 40px ${config.color}40`
              }}
            >
              <Icon size={32} style={{ color: config.color }} />
            </div>
            
            <h2 className="text-white text-xl text-center mb-2" style={{ fontWeight: 700 }}>
              {config.title}
            </h2>
            
            <p className="text-gray-400 text-sm text-center max-w-xs">
              {config.description}
            </p>

            {/* Questions remaining badge */}
            {feature === 'questions' && typeof questionsRemaining === 'number' && (
              <div className="mt-4 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <p className="text-gray-300 text-sm">
                  <span style={{ fontWeight: 600 }}>{questionsRemaining}</span> free questions remaining today
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Benefits list */}
        <div className="px-6 pb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-[20px] p-5 border border-white/10 mb-5">
            <p className="text-white text-xs uppercase tracking-wide mb-3 opacity-60" style={{ fontWeight: 600 }}>
              Included in Solo Plan
            </p>
            <div className="space-y-2.5">
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#8B5CF6] to-purple-600 flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing reminder */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <p className="text-gray-500 text-xs">
              <span className="line-through">$8.25/month</span>
            </p>
            <p className="text-white text-sm" style={{ fontWeight: 600 }}>
              $4.08/month
            </p>
            <div className="px-2 py-0.5 bg-[#22D3EE]/20 rounded-full">
              <p className="text-[#22D3EE] text-xs" style={{ fontWeight: 600 }}>
                50% OFF
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[48px] rounded-[16px] bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={onUpgrade}
              className="flex-1 h-[48px] rounded-[16px] bg-gradient-to-r from-[#8B5CF6] to-purple-600 text-white shadow-lg shadow-[#8B5CF6]/30 active:scale-[0.98] transition-transform"
              style={{ fontWeight: 600 }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
