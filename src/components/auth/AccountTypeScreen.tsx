import { motion } from 'motion/react';
import { GraduationCap, Users } from 'lucide-react';

interface AccountTypeScreenProps {
  onSelect: (type: 'student' | 'parent') => void;
}

export function AccountTypeScreen({ onSelect }: AccountTypeScreenProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl mb-4" style={{ fontWeight: 800 }}>
            I'm a...
          </h1>
          <p className="text-gray-400 text-lg">
            Choose your account type
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-4 mb-8">
          {/* Student Card */}
          <motion.button
            onClick={() => onSelect('student')}
            className="w-full p-6 rounded-3xl text-left transition-all active:scale-98"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                }}
              >
                <GraduationCap className="w-7 h-7 text-purple-400" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl mb-2" style={{ fontWeight: 700 }}>
                  Student
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  I want to learn and improve my understanding through active recall
                </p>
              </div>
            </div>
          </motion.button>

          {/* Parent Card */}
          <motion.button
            onClick={() => onSelect('parent')}
            className="w-full p-6 rounded-3xl text-left transition-all active:scale-98"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 191, 0, 0.15), rgba(255, 140, 0, 0.1))',
              border: '2px solid rgba(255, 191, 0, 0.3)',
              boxShadow: '0 8px 32px rgba(255, 191, 0, 0.2)',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(255, 191, 0, 0.2)',
                  border: '1px solid rgba(255, 191, 0, 0.4)',
                }}
              >
                <Users className="w-7 h-7 text-yellow-400" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl mb-2" style={{ fontWeight: 700 }}>
                  Parent / Guardian
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  I want to support and monitor my children's learning journey
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          You can always change this later in settings
        </motion.p>
      </div>
    </div>
  );
}
