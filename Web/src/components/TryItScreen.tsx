import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';

interface TryItScreenProps {
  onComplete: () => void;
}

export function TryItScreen({ onComplete }: TryItScreenProps) {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const fullText = 'It is because of Rayleigh scattering...';
  const question = 'Explain why the sky is blue.';

  // Typing animation effect
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      // Finished typing, show unlock prompt after a delay
      const timeout = setTimeout(() => {
        setShowUnlockPrompt(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    setShowUnlockPrompt(false);
    setShowSuccess(true);

    // Flash green then show badge
    setTimeout(() => {
      setShowSuccess(false);
      setShowBadge(true);
    }, 600);

    // Show message
    setTimeout(() => {
      setShowMessage(true);
    }, 900);

    // Complete the tutorial
    setTimeout(() => {
      onComplete();
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Green flash overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute inset-0 z-50"
            style={{ background: '#00FF94' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="min-h-screen flex flex-col px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={20} className="text-[#8A2BE2]" />
            <span className="text-gray-400 text-sm">Try it yourself</span>
          </motion.div>
        </div>

        {/* Question Card */}
        <motion.div
          className="bg-[#1A1A1A] rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#8A2BE2] bg-opacity-20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#8A2BE2]">?</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-lg">{question}</p>
            </div>
          </div>
        </motion.div>

        {/* Input Box with Ghost Typing */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#2A2A2A] min-h-[120px] relative">
            <p className="text-gray-300 font-mono text-sm">
              {typedText}
              {typedText.length < fullText.length && showCursor && (
                <span className="inline-block w-0.5 h-4 bg-[#8A2BE2] ml-0.5 animate-pulse" />
              )}
            </p>
          </div>
          
          {/* Lock icon overlay */}
          <div className="absolute -right-2 -top-2">
            <motion.div
              className="w-12 h-12 rounded-full bg-[#8A2BE2] flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(138, 43, 226, 0.4)',
                  '0 0 30px rgba(138, 43, 226, 0.6)',
                  '0 0 20px rgba(138, 43, 226, 0.4)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Lock size={20} className="text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Unlock Prompt */}
        <AnimatePresence>
          {showUnlockPrompt && (
            <motion.button
              onClick={handleUnlock}
              className="bg-gradient-to-r from-[#8A2BE2] to-[#6A1BB2] text-white px-8 py-4 rounded-full mx-auto block"
              style={{ fontWeight: 600, fontSize: '18px' }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.95 }}
            >
              Tap to Unlock
            </motion.button>
          )}
        </AnimatePresence>

        {/* Success Badge */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              className="mt-8 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              {/* High Effort Badge */}
              <motion.div
                className="bg-gradient-to-br from-[#00FF94] to-[#00CC76] px-8 py-4 rounded-full mb-6"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(0, 255, 148, 0.4)',
                    '0 0 50px rgba(0, 255, 148, 0.6)',
                    '0 0 30px rgba(0, 255, 148, 0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-black text-xl" style={{ fontWeight: 700 }}>
                    High Effort
                  </span>
                </div>
              </motion.div>

              {/* Message */}
              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    className="text-center px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-white text-lg mb-2" style={{ fontWeight: 600 }}>
                      You just earned your first Effort Score.
                    </p>
                    <p className="text-gray-400">
                      This is how you win.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
