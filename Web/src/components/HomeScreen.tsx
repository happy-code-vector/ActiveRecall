import { useState, useEffect } from 'react';
import { Flame, BarChart3, Clock, Users, Crown, UserCircle, Sparkles, Brain, Atom, Landmark, Lightbulb, Zap, BookOpen } from 'lucide-react';
import { StreakData } from '../App';
import { motion } from 'motion/react';
import { BottomNav } from './BottomNav';
import { FamilySquadStreakCard } from './FamilySquadStreakCard';
import { ClipboardPill } from './ClipboardPill';
import { useClipboard } from '../hooks/useClipboard';
import { getSubscriptionStatus } from '../utils/subscription';
import { toast } from 'sonner';

interface HomeScreenProps {
  onStartQuestion: (question: string) => void;
  onGoToProgress: () => void;
  onGoToHistory: () => void;
  onGoToPricing?: () => void;
  onGoToParentDashboard?: () => void;
  onGoToProfile?: () => void;
  onGoToTechniques?: () => void;
  onLogin?: () => void;
  onNudgeMember?: (memberId: string, memberName: string) => void;
  streak: StreakData;
}

// Grade-specific example questions
const EXAMPLE_QUESTIONS_BY_GRADE: Record<string, string[]> = {
  'k-2': [
    'Why do plants need sunlight?',
    'What is counting by 2s?',
    'How do birds fly?',
    'What makes the seasons change?',
  ],
  '3-5': [
    'How does the water cycle work?',
    'What are fractions?',
    'Why do we have day and night?',
    'What is photosynthesis?',
  ],
  '6-8': [
    'Explain photosynthesis',
    'What is the Pythagorean theorem?',
    'How does cellular respiration work?',
    'What caused the American Revolution?',
  ],
  '9-10': [
    'Explain Newton\'s first law',
    'How does DNA replication work?',
    'What is quadratic formula used for?',
    'Explain the French Revolution',
  ],
  '11-12': [
    'What is calculus used for?',
    'How does natural selection work?',
    'Explain the causes of World War I',
    'What are the laws of thermodynamics?',
  ],
  'college': [
    'What is photosynthesis?',
    'Explain Newton\'s first law',
    'How does DNA replication work?',
    'What caused the French Revolution?',
  ]
};

// Starter challenge cards for quick start
const STARTER_CHALLENGES = [
  {
    id: 'science',
    icon: Atom,
    title: 'Science',
    question: 'How does photosynthesis work?',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    id: 'math',
    icon: Brain,
    title: 'Math',
    question: 'What is the Pythagorean theorem?',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'history',
    icon: Landmark,
    title: 'History',
    question: 'What caused World War II?',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'concepts',
    icon: Lightbulb,
    title: 'Concepts',
    question: 'What is artificial intelligence?',
    gradient: 'from-yellow-500 to-amber-500',
  },
];

export function HomeScreen({ onStartQuestion, onGoToProgress, onGoToHistory, onGoToPricing, onGoToParentDashboard, onGoToProfile, onGoToTechniques, onLogin, onNudgeMember, streak }: HomeScreenProps) {
  const [questionInput, setQuestionInput] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Clipboard detection
  const clipboard = useClipboard();
  
  // Check if user is a parent
  const userType = localStorage.getItem('thinkfirst_userType');
  const isParent = userType === 'parent';
  
  // Get subscription status
  const subscriptionStatus = getSubscriptionStatus();

  // Get grade-appropriate example questions
  const gradeLevel = localStorage.getItem('thinkfirst_userGrade') || 'college';
  const EXAMPLE_QUESTIONS = EXAMPLE_QUESTIONS_BY_GRADE[gradeLevel] || EXAMPLE_QUESTIONS_BY_GRADE['college'];

  // Check if user is new (no completed questions)
  useEffect(() => {
    const history = localStorage.getItem('thinkfirst_history');
    const hasHistory = history && JSON.parse(history).length > 0;
    setIsNewUser(!hasHistory);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) {
      onStartQuestion(questionInput.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle ambient glow - more neutral tones */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-slate-600/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="relative px-6 pt-14 pb-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            {/* Flashy animated title */}
            <div className="mb-4 relative">
              {/* Glow effect behind title */}
              <motion.div
                className="absolute -inset-4 rounded-2xl opacity-50 blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.4), transparent)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Main title with gradient */}
              <motion.h1
                className="text-4xl relative z-10"
                style={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 30%, #3B82F6 60%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                ThinkFirst
              </motion.h1>

              {/* Shine overlay effect */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                  backgroundSize: '50% 100%',
                }}
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeInOut',
                }}
              />
            </div>
            
            {/* Motivational tagline with sparkle effect */}
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Sparkles size={16} className="text-violet-400" />
              </motion.div>
              <motion.p
                className="text-base"
                style={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #E0E7FF 0%, #A78BFA 50%, #E0E7FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Your Brain, Supercharged
              </motion.p>
            </div>

            {/* Question Counter Badge - Only for free users */}
            {!subscriptionStatus.isPremium && (
              <motion.div
                className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-gray-300 text-xs">
                  <span style={{ fontWeight: 600 }} className="text-white">
                    {subscriptionStatus.questionsLimit - subscriptionStatus.questionsToday}
                  </span>{' '}
                  free questions left today
                </span>
              </motion.div>
            )}
          </div>
          
          {/* Profile button in top-right */}
          {onGoToProfile && (
            <button
              onClick={onGoToProfile}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
            >
              <UserCircle className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Upgrade Banner - Only shown to free users */}
        {!subscriptionStatus.isPremium && onGoToPricing && (
          <motion.button
            onClick={onGoToPricing}
            className="w-full relative overflow-hidden rounded-2xl p-4 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(106, 27, 178, 0.15))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(106, 27, 178, 0.1))',
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10 flex items-center gap-3">
              {/* Crown icon with glow */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full blur-md"
                  style={{
                    background: 'radial-gradient(circle, rgba(138, 43, 226, 0.6), transparent)',
                    width: '40px',
                    height: '40px',
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
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(106, 27, 178, 0.3))',
                  }}
                >
                  <Crown size={20} className="text-purple-400" />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 text-left">
                <h3 className="text-white text-sm" style={{ fontWeight: 700 }}>
                  Upgrade to Pro
                </h3>
                <p className="text-gray-400 text-xs">
                  Unlimited unlocks • Advanced feedback • From $4.99/mo
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="text-purple-400 text-xl">→</div>
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
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
          </motion.button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col justify-center pb-32">
        {/* Main Prompt - centered */}
        <div className="text-center mb-8">
          <h2 className="text-2xl text-white/90 leading-relaxed">
            What do you want to understand today?
          </h2>
        </div>

        {/* Clipboard Pill - shows when clipboard has text */}
        <ClipboardPill
          text={clipboard.text}
          truncatedText={clipboard.truncatedText}
          hasText={clipboard.hasText}
          onPaste={(text) => {
            setQuestionInput(text);
          }}
          onDismiss={clipboard.clearClipboard}
        />

        {/* Input Field - more neutral styling */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            {/* Subtle glow - much less intense */}
            <div className="absolute inset-0 bg-slate-500/5 rounded-3xl blur-lg" />
            
            {/* Input container */}
            <div className="relative">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask your question…"
                className="w-full px-6 py-5 bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-600/30 focus:border-slate-500/50 focus:outline-none text-white placeholder:text-gray-600 transition-all"
              />
              {questionInput.trim() && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white/90 rounded-full text-sm active:scale-95 transition-all"
                >
                  Ask
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Example Questions - directly under input */}
        <div className="space-y-3 mb-8">
          <p className="text-xs text-gray-600 px-1">
            Quick examples
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => onStartQuestion(question)}
                className="px-4 py-2 bg-slate-800/20 rounded-full border border-slate-700/30 text-gray-500 text-xs hover:bg-slate-800/30 hover:text-gray-400 hover:border-slate-600/40 active:scale-95 transition-all"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Section: Start Your Streak */}
        {(isNewUser || (subscriptionStatus.isPremium && localStorage.getItem('thinkfirst_plan') === 'family')) && (
          <div className="mb-8">
            {/* Section Header */}
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" />
              <h3 className="text-white text-sm" style={{ fontWeight: 600 }}>
                Start your Streak
              </h3>
            </div>

            {/* Family Squad Streak Card - Only for Family Plan users */}
            {subscriptionStatus.isPremium && localStorage.getItem('thinkfirst_plan') === 'family' && (
              <div className="mb-6">
                <FamilySquadStreakCard
                  streakDays={12}
                  members={[
                    {
                      id: '1',
                      name: 'You',
                      avatar: '',
                      completedToday: true,
                      isYou: true,
                    },
                    {
                      id: '2',
                      name: 'Dad',
                      avatar: '',
                      completedToday: false,
                    },
                    {
                      id: '3',
                      name: 'Sarah',
                      avatar: '',
                      completedToday: true,
                    },
                    {
                      id: '4',
                      name: 'Mom',
                      avatar: '',
                      completedToday: true,
                    },
                  ]}
                  onNudge={(memberId) => {
                    const memberName = ['You', 'Dad', 'Sarah', 'Mom'][parseInt(memberId) - 1];
                    if (onNudgeMember) {
                      onNudgeMember(memberId, memberName);
                    }
                    // Show success toast
                    toast.success(`Sent a gentle reminder to ${memberName}!`, {
                      description: 'They\'ll see a notification when they open the app.',
                      duration: 3000,
                    });
                  }}
                />
              </div>
            )}

            {/* Starter Challenges - Horizontal Scroll Quest Cards (only for new users) */}
            {isNewUser && (
              <motion.div
                className="-mx-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Horizontal Scroll Container */}
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 px-6 pb-2">
                    {STARTER_CHALLENGES.map((challenge, index) => {
                      const Icon = challenge.icon;
                      return (
                        <motion.button
                          key={challenge.id}
                          onClick={() => onStartQuestion(challenge.question)}
                          className="flex-shrink-0 w-64 rounded-2xl p-5 border-2 relative overflow-hidden group active:scale-95 transition-transform"
                          style={{
                            background: 'rgba(20, 20, 20, 0.8)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {/* Gradient glow overlay */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: challenge.gradient,
                              opacity: 0.1,
                            }}
                          />

                          {/* Gradient border glow */}
                          <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              boxShadow: `0 0 20px ${challenge.glowColor}`,
                            }}
                          />

                          {/* Content */}
                          <div className="relative z-10">
                            {/* Icon with glow */}
                            <div className="mb-4 relative w-fit">
                              {/* Icon glow */}
                              <motion.div
                                className="absolute inset-0 rounded-xl"
                                style={{
                                  background: `radial-gradient(circle, ${challenge.glowColor}, transparent)`,
                                  filter: 'blur(12px)',
                                  width: '56px',
                                  height: '56px',
                                  top: '-6px',
                                  left: '-6px',
                                }}
                                animate={{
                                  opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />

                              {/* Icon container */}
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                                style={{
                                  background: challenge.gradient,
                                }}
                              >
                                <Icon size={24} className="text-white" />
                              </div>

                              {/* NEW badge */}
                              <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-[10px] text-white" style={{ fontWeight: 700 }}>
                                NEW
                              </div>
                            </div>

                            {/* Title */}
                            <h4 className="text-white text-base mb-2" style={{ fontWeight: 600 }}>
                              {challenge.title}
                            </h4>

                            {/* Description */}
                            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                              {challenge.description}
                            </p>

                            {/* Bottom indicator */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-green-400 text-xs" style={{ fontWeight: 600 }}>
                                  Tap to start
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Shine effect on hover */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                            style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                            }}
                            animate={{
                              x: ['-100%', '200%'],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Scroll hint */}
                <div className="px-6 mt-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {STARTER_CHALLENGES.map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-700"
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-xs">Swipe to explore</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav
        currentTab="home"
        onGoToHome={() => {}}
        onGoToProgress={onGoToProgress}
        onGoToHistory={onGoToHistory}
        onGoToTechniques={onGoToTechniques}
        streak={streak}
      />
    </div>
  );
}