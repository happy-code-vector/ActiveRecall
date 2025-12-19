import React from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.25) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Top spacer */}
      <div className="flex-1" />

      {/* Center content */}
      <div className="flex flex-col items-center gap-8 z-10">
        {/* Animated Neural Network Brain */}
        <motion.div
          className="relative w-32 h-32"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: '#8A2BE2' }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Neural network nodes */}
          <svg
            viewBox="0 0 120 120"
            className="relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Connection lines */}
            <motion.path
              d="M30 30 L60 60"
              stroke="#8A2BE2"
              strokeWidth="2"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <motion.path
              d="M90 30 L60 60"
              stroke="#8A2BE2"
              strokeWidth="2"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <motion.path
              d="M30 90 L60 60"
              stroke="#8A2BE2"
              strokeWidth="2"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <motion.path
              d="M90 90 L60 60"
              stroke="#8A2BE2"
              strokeWidth="2"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <motion.path
              d="M30 30 L90 30"
              stroke="#8A2BE2"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <motion.path
              d="M30 90 L90 90"
              stroke="#8A2BE2"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />

            {/* Center node - largest */}
            <motion.circle
              cx="60"
              cy="60"
              r="8"
              fill="#8A2BE2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.circle
              cx="60"
              cy="60"
              r="12"
              stroke="#8A2BE2"
              strokeWidth="2"
              fill="none"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Corner nodes */}
            <motion.circle
              cx="30"
              cy="30"
              r="6"
              fill="#8A2BE2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, delay: 0.1, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="90"
              cy="30"
              r="6"
              fill="#8A2BE2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="30"
              cy="90"
              r="6"
              fill="#8A2BE2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="90"
              cy="90"
              r="6"
              fill="#8A2BE2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Mid nodes */}
            <motion.circle
              cx="60"
              cy="20"
              r="4"
              fill="#8A2BE2"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="60"
              cy="100"
              r="4"
              fill="#8A2BE2"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="20"
              cy="60"
              r="4"
              fill="#8A2BE2"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="100"
              cy="60"
              r="4"
              fill="#8A2BE2"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        {/* Main heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-white text-4xl tracking-tight mb-4 px-4" style={{ fontWeight: 700 }}>
            Stop Copying.
            <br />
            Start Thinking.
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="text-gray-400 text-center max-w-xs px-4"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          The only AI that builds your brain instead of bypassing it.
        </motion.p>
      </div>

      {/* Bottom spacer */}
      <div className="flex-1" />

      {/* Get Started Button */}
      <motion.button
        onClick={onGetStarted}
        className="w-full max-w-sm bg-[#00FF94] text-black px-8 py-4 rounded-full relative overflow-hidden"
        style={{ fontWeight: 600, fontSize: '18px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Neon glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60"
          style={{ background: '#00FF94' }}
        />
        <span className="relative z-10">Get Started</span>
      </motion.button>
    </div>
  );
}
