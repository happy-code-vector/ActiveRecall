import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, LockOpen, StickyNote } from 'lucide-react';

interface MercyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRevealAnswer: () => void;
  coachTip?: string;
}

export function MercyModal({ isOpen, onClose, onRevealAnswer, coachTip = "Hint: Try defining the key term first!" }: MercyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Heavy blur */}
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-xl"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              className="w-full max-w-md pointer-events-auto relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Main Modal Card */}
              <motion.div
                className="rounded-[24px] relative overflow-visible"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255, 95, 31, 0.3)',
                  boxShadow: '0 0 60px rgba(255, 95, 31, 0.25), 0 20px 60px rgba(0, 0, 0, 0.6)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                {/* Red/Orange glow effect */}
                <div 
                  className="absolute inset-0 opacity-40 pointer-events-none rounded-[24px]"
                  style={{
                    background: 'radial-gradient(circle at top center, rgba(255, 95, 31, 0.3), transparent 70%)',
                  }}
                />

                {/* Coach Tip - Sticky Note in top right corner */}
                <motion.div
                  className="absolute -top-3 -right-3 z-20"
                  initial={{ opacity: 0, rotate: -5, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 3, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <div
                    className="relative px-4 py-3 rounded-[12px] shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      minWidth: '180px',
                      maxWidth: '220px',
                    }}
                  >
                    {/* Sticky note shadow */}
                    <div 
                      className="absolute inset-0 -z-10 rounded-[12px]"
                      style={{
                        background: '#8B5CF6',
                        filter: 'blur(8px)',
                        opacity: 0.6,
                      }}
                    />
                    
                    {/* Pin icon */}
                    <div className="absolute -top-1.5 left-3">
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                    </div>

                    <div className="flex items-start gap-2">
                      <StickyNote className="w-3.5 h-3.5 text-white/80 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-white leading-tight" style={{ fontWeight: 500 }}>
                        {coachTip}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10 px-8 pt-10 pb-8">
                  {/* Icon - Open padlock with warning triangle badge */}
                  <motion.div
                    className="flex justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <div className="relative">
                      {/* Main lock icon container */}
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center relative"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 95, 31, 0.15), rgba(251, 146, 60, 0.15))',
                          border: '2px solid rgba(255, 95, 31, 0.4)',
                        }}
                      >
                        {/* Pulsing glow */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'rgba(255, 95, 31, 0.3)',
                            filter: 'blur(12px)',
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
                        
                        {/* Open lock icon */}
                        <LockOpen 
                          className="w-9 h-9 relative z-10" 
                          style={{ color: '#FF5F1F' }}
                          strokeWidth={2}
                        />
                      </div>

                      {/* Warning triangle badge - bottom right */}
                      <motion.div
                        className="absolute -bottom-1 -right-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: '#EF4444',
                            border: '2px solid #1A1A1A',
                          }}
                        >
                          <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Headline */}
                  <motion.h2
                    className="text-white text-center text-[26px] mb-4"
                    style={{ fontWeight: 700 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    Reveal Answer?
                  </motion.h2>

                  {/* Body Text */}
                  <motion.p
                    className="text-gray-400 text-center text-[15px] leading-relaxed mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Viewing the answer now will end your attempt. You will earn{' '}
                    <span className="text-[#FF5F1F]" style={{ fontWeight: 600 }}>
                      0 Streak Points
                    </span>{' '}
                    and this will be marked as{' '}
                    <span className="text-[#FF5F1F]" style={{ fontWeight: 600 }}>
                      Passive Learning
                    </span>
                    .
                  </motion.p>

                  {/* Button Stack - Vertical */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Top Button: Keep Trying (Solid White background, Black text) */}
                    <motion.button
                      onClick={onClose}
                      className="w-full h-[52px] rounded-[16px] transition-all"
                      style={{
                        background: '#FFFFFF',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '16px',
                      }}
                      whileHover={{
                        background: '#F5F5F5',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Keep Trying
                    </motion.button>

                    {/* Bottom Button: Reveal Answer (Ghost button, Red text, opacity 80%) */}
                    <motion.button
                      onClick={onRevealAnswer}
                      className="w-full h-[52px] rounded-[16px] transition-all"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#EF4444',
                        opacity: 0.8,
                        fontWeight: 500,
                        fontSize: '16px',
                      }}
                      whileHover={{
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        opacity: 1,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reveal Answer
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
