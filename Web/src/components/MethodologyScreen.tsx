import { motion } from 'motion/react';
import { Brain, Bot, User, ArrowRight, X, Check } from 'lucide-react';

interface MethodologyScreenProps {
  onComplete: () => void;
}

export function MethodologyScreen({ onComplete }: MethodologyScreenProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600 rounded-full mix-blend-normal filter blur-[150px] opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-green-600 rounded-full mix-blend-normal filter blur-[150px] opacity-10" />

      {/* Main Content Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-white text-3xl mb-3 leading-tight" style={{ fontWeight: 700 }}>
            How ThinkFirst
            <br />
            works differently
          </h1>
          <p className="text-gray-500 text-sm mt-2 px-4">
            We're not just another AI homework tool
          </p>
        </motion.div>

        {/* Comparison Diagram */}
        <div className="space-y-6 mb-12">
          {/* Traditional AI (Bad) */}
          <motion.div
            className="relative rounded-3xl p-6 border-2 overflow-hidden"
            style={{
              background: 'rgba(20, 20, 20, 0.6)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Red glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-30"
              style={{
                background: 'radial-gradient(circle at top left, rgba(239, 68, 68, 0.2), transparent)',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Label */}
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                  <span className="text-red-400 text-xs" style={{ fontWeight: 600 }}>
                    Other AIs
                  </span>
                </div>
              </div>

              {/* Diagram */}
              <div className="flex items-center justify-between mb-4">
                {/* Robot Icon */}
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))',
                      border: '2px solid rgba(107, 114, 128, 0.4)',
                    }}
                  >
                    <Bot size={28} className="text-gray-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-gray-500 text-xs" style={{ fontWeight: 600 }}>
                    AI
                  </div>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight size={24} className="text-gray-600" />
                </motion.div>

                {/* User Icon */}
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))',
                      border: '2px solid rgba(107, 114, 128, 0.4)',
                    }}
                  >
                    <User size={28} className="text-gray-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-gray-500 text-xs" style={{ fontWeight: 600 }}>
                    You
                  </div>
                </div>

                {/* Red X */}
                <motion.div
                  className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <X size={20} className="text-red-500" strokeWidth={3} />
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                AI does the thinking. You copy the answer. <span className="text-red-400" style={{ fontWeight: 600 }}>No learning happens.</span>
              </p>
            </div>
          </motion.div>

          {/* ThinkFirst (Good) */}
          <motion.div
            className="relative rounded-3xl p-6 border-2 overflow-hidden"
            style={{
              background: 'rgba(20, 20, 20, 0.6)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(34, 197, 94, 0.4)',
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Green glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-30"
              style={{
                background: 'radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.2), transparent)',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Label */}
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <span className="text-green-400 text-xs" style={{ fontWeight: 600 }}>
                    ThinkFirst
                  </span>
                </div>
              </div>

              {/* Diagram */}
              <div className="flex items-center justify-between mb-4">
                {/* Brain Icon (Glowing) */}
                <div className="relative">
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.6), transparent)',
                      filter: 'blur(16px)',
                      width: '70px',
                      height: '70px',
                      top: '-8px',
                      left: '-8px',
                    }}
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))',
                      border: '2px solid rgba(34, 197, 94, 0.5)',
                    }}
                  >
                    <Brain size={28} className="text-green-400" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-1 -right-1 text-green-400 text-xs" style={{ fontWeight: 600 }}>
                    You
                  </div>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                >
                  <ArrowRight size={24} className="text-green-600" />
                </motion.div>

                {/* AI Icon */}
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))',
                      border: '2px solid rgba(107, 114, 128, 0.4)',
                    }}
                  >
                    <Bot size={28} className="text-gray-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-gray-400 text-xs" style={{ fontWeight: 600 }}>
                    AI
                  </div>
                </div>

                {/* Green Check */}
                <motion.div
                  className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <Check size={20} className="text-green-500" strokeWidth={3} />
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-green-400" style={{ fontWeight: 600 }}>You think first.</span> AI evaluates your effort. Then you unlock the answer.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Main Message */}
        <motion.div
          className="text-center mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-white text-xl mb-3 leading-snug" style={{ fontWeight: 600 }}>
            You must attempt an explanation to unlock the answer.
          </h2>
          <p className="text-gray-500 text-sm">
            No shortcuts. No copy-paste. Real learning.
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          onClick={onComplete}
          className="relative w-full rounded-full px-8 py-4 transition-all duration-300 overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated gradient background */}
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

          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-white text-base" style={{ fontWeight: 600 }}>
              I understand, let&apos;s try it
            </span>
            <ArrowRight size={20} className="text-white" />
          </div>
        </motion.button>

        {/* Reassurance text */}
        <motion.p
          className="text-gray-600 text-center text-xs mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          Don&apos;t worry, we&apos;ll guide you through your first question
        </motion.p>
      </div>
    </div>
  );
}