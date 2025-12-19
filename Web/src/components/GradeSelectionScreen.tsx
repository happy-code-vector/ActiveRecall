import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

interface GradeSelectionScreenProps {
  onSelect: (grade: string) => void;
  userType: 'student' | 'parent';
}

const GRADE_OPTIONS = [
  { value: 'k-2', label: 'K-2nd Grade', description: 'Early elementary' },
  { value: '3-5', label: '3rd-5th Grade', description: 'Upper elementary' },
  { value: '6-8', label: '6th-8th Grade', description: 'Middle school' },
  { value: '9-10', label: '9th-10th Grade', description: 'Early high school' },
  { value: '11-12', label: '11th-12th Grade', description: 'Late high school' },
  { value: 'college', label: 'College', description: 'University level' },
];

export function GradeSelectionScreen({ onSelect, userType }: GradeSelectionScreenProps) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const handleSelect = (grade: string) => {
    setSelectedGrade(grade);
    // Brief delay to show the selection glow before transitioning
    setTimeout(() => {
      onSelect(grade);
    }, 300);
  };

  const promptText = userType === 'parent' 
    ? "What grade is your student in?"
    : "What grade are you in?";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[150px] opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-normal filter blur-[150px] opacity-20" />

      {/* Header */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Icon */}
        <motion.div 
          className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(34, 211, 238, 0.25))',
            border: '2px solid rgba(139, 92, 246, 0.4)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <GraduationCap size={32} className="text-purple-400" strokeWidth={2} />
        </motion.div>

        <h1 className="text-white text-3xl mb-3 leading-tight" style={{ fontWeight: 700 }}>
          {promptText}
        </h1>
        <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>
          This helps us personalize your experience
        </p>
      </motion.div>

      {/* Grade Options Grid */}
      <div className="w-full max-w-md space-y-3 relative z-10">
        {GRADE_OPTIONS.map((grade, index) => (
          <motion.button
            key={grade.value}
            onClick={() => handleSelect(grade.value)}
            className="w-full rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden group"
            style={{
              background: selectedGrade === null || selectedGrade === grade.value
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(20, 20, 20, 0.4)',
              backdropFilter: 'blur(20px)',
              borderColor: selectedGrade === grade.value
                ? 'rgba(139, 92, 246, 0.6)'
                : 'rgba(255, 255, 255, 0.1)',
              opacity: selectedGrade && selectedGrade !== grade.value ? 0.4 : 1,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: selectedGrade && selectedGrade !== grade.value ? 0.4 : 1, 
              x: 0 
            }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: selectedGrade === null ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glowing border effect when selected */}
            {selectedGrade === grade.value && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(34, 211, 238, 0.2))',
                  filter: 'blur(15px)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Subtle hover glow when unselected */}
            {selectedGrade === null && (
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(34, 211, 238, 0.05))',
                }}
              />
            )}

            <div className="flex items-center justify-between relative z-10">
              {/* Text */}
              <div className="text-left">
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  {grade.label}
                </h3>
                <p 
                  className="text-xs"
                  style={{ 
                    color: selectedGrade === grade.value ? '#A78BFA' : '#6B7280',
                    fontWeight: 500,
                  }}
                >
                  {grade.description}
                </p>
              </div>

              {/* Checkmark indicator */}
              {selectedGrade === grade.value && (
                <motion.div
                  className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="3"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
