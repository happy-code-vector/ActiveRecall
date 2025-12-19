import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface GoalSelectionScreenProps {
  onComplete: (goal: string) => void;
  userType: 'student' | 'parent';
}

const STUDENT_GOALS = [
  '🧠 Stop relying on easy answers',
  '🅰️ Ace my exams',
  '🎯 Build meaningful habits',
  '⚡ Learn faster',
];

const PARENT_GOALS = [
  '👨‍👩‍👧 Help my child succeed',
  '📊 Track their learning progress',
  '🎯 Support better study habits',
  '💡 Understand their challenges',
];

export function GoalSelectionScreen({ onComplete, userType }: GoalSelectionScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Select the appropriate goals based on user type
  const GOALS = userType === 'student' ? STUDENT_GOALS : PARENT_GOALS;

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      onComplete(selectedGoal);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600 rounded-full mix-blend-normal filter blur-[160px] opacity-20" />

      {/* Header */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className="text-white text-3xl mb-3 leading-tight px-4" style={{ fontWeight: 700 }}>
          What is your main focus?
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Choose the goal that matters most to you
        </p>
      </motion.div>

      {/* Goal Pills Grid */}
      <div className="w-full max-w-md grid grid-cols-1 gap-4 relative z-10 mb-8">
        {GOALS.map((goal, index) => {
          const isSelected = selectedGoal === goal;
          
          return (
            <motion.button
              key={goal}
              onClick={() => handleGoalSelect(goal)}
              className="relative rounded-2xl px-6 py-5 transition-all duration-300 text-left overflow-hidden group"
              style={{
                background: isSelected 
                  ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                  : 'transparent',
                border: isSelected 
                  ? '2px solid rgba(139, 92, 246, 0.6)' 
                  : '2px solid rgba(255, 255, 255, 0.15)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect when selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(124, 58, 237, 0.4))',
                    filter: 'blur(20px)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Hover glow for unselected */}
              {!isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
                  }}
                />
              )}

              {/* Text content */}
              <div className="relative z-10 flex items-center justify-between">
                <span 
                  className="text-base"
                  style={{ 
                    color: isSelected ? '#FFFFFF' : '#D1D5DB',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  {goal}
                </span>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 300, 
                      damping: 20 
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-violet-600" />
                  </motion.div>
                )}
              </div>

              {/* Animated shine effect on select */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ 
                    duration: 1,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.button
        onClick={handleContinue}
        disabled={!selectedGoal}
        className="relative w-full max-w-md rounded-full px-8 py-4 transition-all duration-300 overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: selectedGoal
            ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
            : 'rgba(139, 92, 246, 0.3)',
          boxShadow: selectedGoal
            ? '0 8px 32px rgba(139, 92, 246, 0.4)'
            : 'none',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={selectedGoal ? { scale: 1.02 } : {}}
        whileTap={selectedGoal ? { scale: 0.98 } : {}}
      >
        {/* Animated gradient background */}
        {selectedGoal && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.3))',
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="text-white text-base" style={{ fontWeight: 600 }}>
            Continue
          </span>
          <ArrowRight size={20} className="text-white" />
        </div>
      </motion.button>

      {/* Helper text */}
      <motion.p
        className="text-gray-600 text-center text-xs mt-6 max-w-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        You can change this later in settings
      </motion.p>
    </div>
  );
}