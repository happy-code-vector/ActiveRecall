import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Zap, 
  Target, 
  Repeat, 
  MessageSquare, 
  Shuffle,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from 'lucide-react';
import { BottomNav } from './BottomNav';
import { StreakData } from '../App';

interface TechniquesScreenProps {
  onBack: () => void;
  onGoToHome?: () => void;
  onGoToProgress?: () => void;
  onGoToHistory?: () => void;
  onGoToTechniques?: () => void;
  onGoToParentDashboard?: () => void;
  streak?: StreakData;
}

interface Technique {
  id: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  colorEnd: string;
  description: string;
  howToUse: string[];
  whyItWorks: string;
  example: string;
}

const TECHNIQUES: Technique[] = [
  {
    id: 'active-recall',
    title: 'Active Recall',
    tagline: 'The foundation of deep learning',
    icon: Brain,
    color: '#8A2BE2',
    colorEnd: '#A855F7',
    description: 'Instead of re-reading notes, actively retrieve information from memory. This is the core principle of ThinkFirst.',
    howToUse: [
      'Close your book and write what you remember',
      'Explain concepts without looking at notes',
      'Use ThinkFirst to force yourself to think before seeing answers',
      'Quiz yourself regularly on material',
    ],
    whyItWorks: 'Retrieval strengthens memory pathways far more than passive review. Every time you struggle to recall something, you\'re building stronger neural connections.',
    example: 'Instead of re-reading a chapter on photosynthesis, close the book and write out the process from memory. Check your work afterward.',
  },
  {
    id: 'feynman',
    title: 'Feynman Technique',
    tagline: 'Explain it like they\'re five',
    icon: MessageSquare,
    color: '#FF6B35',
    colorEnd: '#FF4500',
    description: 'Named after physicist Richard Feynman. If you can\'t explain something simply, you don\'t understand it well enough.',
    howToUse: [
      'Choose a concept you want to learn',
      'Explain it in simple terms (as if teaching a child)',
      'Identify gaps in your explanation',
      'Go back to the source material to fill those gaps',
      'Simplify your explanation further',
    ],
    whyItWorks: 'Teaching forces you to organize knowledge clearly and reveals gaps in understanding. Simplification requires deep comprehension.',
    example: 'Try explaining gravity to a 10-year-old. If you struggle, you\'ve found where to study deeper.',
  },
  {
    id: 'spaced-repetition',
    title: 'Spaced Repetition',
    tagline: 'Time your reviews strategically',
    icon: Repeat,
    color: '#00D9FF',
    colorEnd: '#0099CC',
    description: 'Review information at increasing intervals. Study something today, tomorrow, next week, next month.',
    howToUse: [
      'Review new material after 1 day',
      'Review again after 3 days',
      'Then after 7 days, then 14 days',
      'Use your ThinkFirst streak to build daily review habits',
      'Focus on material you\'re about to forget',
    ],
    whyItWorks: 'The brain strengthens memories right before they fade. Spacing creates optimal challenge—not too easy, not too hard.',
    example: 'Learn Spanish vocabulary today. Review tomorrow, then 3 days later, then a week later. Each review cements it deeper.',
  },
  {
    id: 'interleaving',
    title: 'Interleaving',
    tagline: 'Mix up your practice',
    icon: Shuffle,
    color: '#A855F7',
    colorEnd: '#EC4899',
    description: 'Instead of studying one topic at a time (blocking), mix different topics together during study sessions.',
    howToUse: [
      'Study Topic A for 20 minutes',
      'Switch to Topic B for 20 minutes',
      'Switch to Topic C, then back to A',
      'Mix problem types in math/science',
      'Use ThinkFirst questions across different subjects',
    ],
    whyItWorks: 'Your brain learns to discriminate between concepts and when to apply each. It\'s harder but leads to better long-term retention and transfer.',
    example: 'Instead of doing 20 algebra problems, then 20 geometry problems, alternate between them: algebra, geometry, algebra, geometry.',
  },
  {
    id: 'elaborative-interrogation',
    title: 'Elaborative Interrogation',
    tagline: 'Ask "Why?" relentlessly',
    icon: Lightbulb,
    color: '#FFD700',
    colorEnd: '#FFA500',
    description: 'Generate explanations for why stated facts are true. Keep asking "why?" until you reach foundational principles.',
    howToUse: [
      'When learning a fact, ask "Why is this true?"',
      'Connect new info to what you already know',
      'Generate your own explanations',
      'Question assumptions and dig deeper',
      'Use ThinkFirst attempts to practice explaining "why"',
    ],
    whyItWorks: 'Creating explanations builds richer mental models. It transforms isolated facts into connected knowledge networks.',
    example: 'Fact: "Plants are green." Why? Chlorophyll. Why chlorophyll? It absorbs red/blue light. Why those wavelengths? Keep going deeper.',
  },
  {
    id: 'self-explanation',
    title: 'Self-Explanation',
    tagline: 'Talk through your thinking',
    icon: MessageSquare,
    color: '#10B981',
    colorEnd: '#059669',
    description: 'Explain the steps of your problem-solving process out loud or in writing. Make your thinking visible.',
    howToUse: [
      'Work through problems while explaining each step',
      'Say your reasoning out loud (even alone)',
      'Write explanations in your ThinkFirst attempts',
      'Explain not just what, but why you chose each step',
      'Review by re-explaining your past solutions',
    ],
    whyItWorks: 'Making thinking explicit helps identify errors and strengthens understanding. It\'s metacognition in action.',
    example: 'Solving a math problem? Say: "First I\'ll factor because... then I\'ll substitute because... this works because..."',
  },
  {
    id: 'testing-effect',
    title: 'Testing Effect',
    tagline: 'Tests aren\'t just for grading',
    icon: Target,
    color: '#DC2626',
    colorEnd: '#991B1B',
    description: 'Taking practice tests dramatically improves retention—even more than extra study time. Testing IS studying.',
    howToUse: [
      'Take practice tests before you feel ready',
      'Create your own quizzes on material',
      'Use ThinkFirst as low-stakes testing',
      'Test yourself immediately after learning',
      'Focus on retrieval, not recognition',
    ],
    whyItWorks: 'Retrieval practice creates stronger memories than review. The struggle to recall is what builds retention.',
    example: 'After reading a chapter, take a practice quiz immediately. Don\'t wait until you\'ve "studied enough"—test early and often.',
  },
  {
    id: 'pre-testing',
    title: 'Pre-Testing',
    tagline: 'Attempt before you learn',
    icon: Zap,
    color: '#F59E0B',
    colorEnd: '#D97706',
    description: 'Try to answer questions BEFORE learning the material. This primes your brain for learning and reveals knowledge gaps.',
    howToUse: [
      'Look at chapter questions before reading',
      'Attempt problems before the lecture',
      'Use ThinkFirst to pre-test yourself',
      'Guess answers and note confidence levels',
      'Compare your attempts to correct answers',
    ],
    whyItWorks: 'Failed retrieval attempts create "knowledge gaps" that your brain wants to fill. You learn more when you\'ve tried and failed first.',
    example: 'Before a history lecture, try to answer the study guide questions. You\'ll pay more attention to areas where you struggled.',
  },
];

export function TechniquesScreen({ 
  onBack, 
  onGoToHome, 
  onGoToProgress, 
  onGoToHistory, 
  onGoToTechniques, 
  onGoToParentDashboard, 
  streak 
}: TechniquesScreenProps) {
  const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);

  const toggleTechnique = (id: string) => {
    setExpandedTechnique(expandedTechnique === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* Header */}
      <div 
        className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.8))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
        
        <div className="mt-4">
          <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
            Learning Techniques
          </h1>
          <p className="text-gray-400 text-sm">
            Master these methods to supercharge your learning
          </p>
        </div>
      </div>

      {/* Techniques List */}
      <div className="px-6 pt-6 space-y-3">
        {TECHNIQUES.map((technique, index) => {
          const Icon = technique.icon;
          const isExpanded = expandedTechnique === technique.id;

          return (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <button
                onClick={() => toggleTechnique(technique.id)}
                className="w-full text-left"
              >
                <div
                  className="rounded-2xl p-4 transition-all"
                  style={{
                    background: isExpanded 
                      ? `linear-gradient(135deg, ${technique.color}15, ${technique.colorEnd}15)`
                      : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isExpanded ? `${technique.color}40` : 'rgba(255, 255, 255, 0.05)'}`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${technique.color}, ${technique.colorEnd})`,
                      }}
                    >
                      <Icon size={24} className="text-white" strokeWidth={2} />
                    </div>

                    {/* Title & Tagline */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>
                        {technique.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {technique.tagline}
                      </p>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                          {/* Description */}
                          <div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {technique.description}
                            </p>
                          </div>

                          {/* How to Use */}
                          <div>
                            <h4 
                              className="text-white text-sm mb-2" 
                              style={{ fontWeight: 700 }}
                            >
                              How to Use:
                            </h4>
                            <ul className="space-y-2">
                              {technique.howToUse.map((step, idx) => (
                                <li 
                                  key={idx}
                                  className="flex items-start gap-2 text-gray-400 text-sm"
                                >
                                  <CheckCircle2 
                                    size={16} 
                                    className="flex-shrink-0 mt-0.5"
                                    style={{ color: technique.color }}
                                    strokeWidth={2}
                                  />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Why It Works */}
                          <div 
                            className="rounded-xl p-3"
                            style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                          >
                            <h4 
                              className="text-white text-sm mb-1" 
                              style={{ fontWeight: 700 }}
                            >
                              Why It Works:
                            </h4>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              {technique.whyItWorks}
                            </p>
                          </div>

                          {/* Example */}
                          <div 
                            className="rounded-xl p-3"
                            style={{
                              background: `${technique.color}08`,
                              border: `1px solid ${technique.color}20`,
                            }}
                          >
                            <h4 
                              className="text-sm mb-1" 
                              style={{ 
                                fontWeight: 700,
                                color: technique.color,
                              }}
                            >
                              Example:
                            </h4>
                            <p className="text-gray-300 text-xs leading-relaxed italic">
                              {technique.example}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 mt-8 mb-6">
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(168, 85, 247, 0.1))',
            border: '1px solid rgba(138, 43, 226, 0.3)',
          }}
        >
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={24} className="text-white" strokeWidth={2} />
          </div>
          <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>
            Practice Makes Permanent
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            ThinkFirst combines these proven techniques into every question. 
            The more you practice active recall, the stronger your learning becomes.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab="learn"
        onGoToHome={onGoToHome}
        onGoToProgress={onGoToProgress}
        onGoToHistory={onGoToHistory}
        onGoToTechniques={onGoToTechniques}
        onGoToParentDashboard={onGoToParentDashboard}
        streak={streak}
      />
    </div>
  );
}