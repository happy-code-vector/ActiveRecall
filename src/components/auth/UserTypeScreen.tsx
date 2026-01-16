import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, TrendingUp } from 'lucide-react';

interface UserTypeScreenProps {
  onSelect: (type: 'student' | 'parent') => void;
}

export function UserTypeScreen({ onSelect }: UserTypeScreenProps) {
  const [selectedType, setSelectedType] = useState<'student' | 'parent' | null>(null);

  const handleSelect = (type: 'student' | 'parent') => {
    setSelectedType(type);
    // Brief delay to show the selection glow before transitioning
    setTimeout(() => {
      onSelect(type);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-normal filter blur-[150px] opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-normal filter blur-[150px] opacity-20" />

      {/* Header */}
      <motion.div
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className="text-white text-4xl mb-3 leading-tight" style={{ fontWeight: 700 }}>
          How will you use
          <br />
          ThinkFirst?
        </h1>
      </motion.div>

      {/* Cards Container */}
      <div className="w-full max-w-md space-y-5 relative z-10">
        {/* Student Card */}
        <motion.button
          onClick={() => handleSelect('student')}
          className="w-full rounded-3xl p-8 border transition-all duration-500 relative overflow-hidden group"
          style={{
            background: selectedType === null || selectedType === 'student' 
              ? 'rgba(30, 30, 30, 0.8)' 
              : 'rgba(20, 20, 20, 0.4)',
            backdropFilter: 'blur(20px)',
            borderColor: selectedType === 'student' 
              ? 'rgba(59, 130, 246, 0.6)' 
              : 'rgba(255, 255, 255, 0.1)',
            opacity: selectedType === 'parent' ? 0.4 : 1,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: selectedType === 'parent' ? 0.4 : 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: selectedType === null ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glowing border effect when selected */}
          {selectedType === 'student' && (
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(96, 165, 250, 0.3))',
                filter: 'blur(20px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Subtle hover glow when unselected */}
          {selectedType === null && (
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.1))',
              }}
            />
          )}

          <div className="flex items-center gap-5 relative z-10">
            {/* Glowing Blue Brain Icon */}
            <div className="relative">
              {/* Icon glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)',
                  filter: 'blur(16px)',
                  width: '80px',
                  height: '80px',
                  top: '-8px',
                  left: '-8px',
                }}
                animate={{
                  opacity: selectedType === 'student' ? [0.6, 1, 0.6] : 0.3,
                  scale: selectedType === 'student' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: selectedType === 'student' ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Icon container */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(96, 165, 250, 0.25))',
                  border: '2px solid rgba(59, 130, 246, 0.4)',
                }}
              >
                <GraduationCap 
                  size={32} 
                  className="text-blue-400" 
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 text-left">
              <h3 className="text-white text-xl mb-2" style={{ fontWeight: 600 }}>
                I am a Student.
              </h3>
              <p 
                className="text-sm"
                style={{ 
                  color: selectedType === 'student' ? '#93C5FD' : '#6B7280',
                  fontWeight: 500,
                }}
              >
                I want to build deep understanding.
              </p>
            </div>
          </div>
        </motion.button>

        {/* Parent Card */}
        <motion.button
          onClick={() => handleSelect('parent')}
          className="w-full rounded-3xl p-8 border transition-all duration-500 relative overflow-hidden group"
          style={{
            background: selectedType === null || selectedType === 'parent' 
              ? 'rgba(30, 30, 30, 0.8)' 
              : 'rgba(20, 20, 20, 0.4)',
            backdropFilter: 'blur(20px)',
            borderColor: selectedType === 'parent' 
              ? 'rgba(245, 158, 11, 0.6)' 
              : 'rgba(255, 255, 255, 0.1)',
            opacity: selectedType === 'student' ? 0.4 : 1,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: selectedType === 'student' ? 0.4 : 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: selectedType === null ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glowing border effect when selected */}
          {selectedType === 'parent' && (
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(251, 191, 36, 0.3))',
                filter: 'blur(20px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Subtle hover glow when unselected */}
          {selectedType === null && (
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))',
              }}
            />
          )}

          <div className="flex items-center gap-5 relative z-10">
            {/* Glowing Amber Shield Icon */}
            <div className="relative">
              {/* Icon glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.6), transparent)',
                  filter: 'blur(16px)',
                  width: '80px',
                  height: '80px',
                  top: '-8px',
                  left: '-8px',
                }}
                animate={{
                  opacity: selectedType === 'parent' ? [0.6, 1, 0.6] : 0.3,
                  scale: selectedType === 'parent' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: selectedType === 'parent' ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Icon container */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(251, 191, 36, 0.25))',
                  border: '2px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                <TrendingUp 
                  size={32} 
                  className="text-amber-400" 
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 text-left">
              <h3 className="text-white text-xl mb-2" style={{ fontWeight: 600 }}>
                I am a Parent.
              </h3>
              <p 
                className="text-sm"
                style={{ 
                  color: selectedType === 'parent' ? '#FCD34D' : '#6B7280',
                  fontWeight: 500,
                }}
              >
                I want to track learning progress.
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Optional subtext */}
      <motion.p
        className="text-gray-600 text-center text-sm mt-10 max-w-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        This helps us customize your experience
      </motion.p>
    </div>
  );
}