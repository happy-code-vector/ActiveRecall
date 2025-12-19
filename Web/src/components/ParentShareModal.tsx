import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check, MessageCircle, Mail } from 'lucide-react';

interface ParentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFamilyAccount?: () => void;
}

export function ParentShareModal({ isOpen, onClose, onCreateFamilyAccount }: ParentShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareMessage = `Hey Mom/Dad! 👋

I want to use ThinkFirst for school. It's a learning app that makes me think before giving me answers.

There's a Family Plan where you can see my progress and how much I'm studying. You get a dashboard with insights, and I get unlimited AI help.

No more "did you study?" arguments! 😊

Check it out: https://thinkfirst.app/family

Love you! ❤️`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ThinkFirst Family Plan',
          text: shareMessage,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSMS = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    window.location.href = `sms:?body=${encodedMessage}`;
  };

  const handleEmail = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const subject = encodeURIComponent('Check out ThinkFirst Family Plan');
    window.location.href = `mailto:?subject=${subject}&body=${encodedMessage}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-w-[480px] mx-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className="rounded-t-[32px] overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom, #1A1A1A, #0F0F0F)',
                backdropFilter: 'blur(40px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-white bg-opacity-30 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-3 pb-5">
                <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>
                  Share with Parents
                </h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Message Preview */}
              <div className="px-6 pb-5">
                <div
                  className="rounded-2xl p-4 border"
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                    {shareMessage}
                  </p>
                </div>
              </div>

              {/* Share Options */}
              <div className="px-6 pb-8 space-y-3">
                {/* Native Share (if supported) */}
                {navigator.share && (
                  <motion.button
                    onClick={handleNativeShare}
                    className="w-full py-4 px-6 rounded-2xl flex items-center gap-4 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-11 h-11 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <Share2 size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white" style={{ fontWeight: 600 }}>
                        Share via...
                      </p>
                      <p className="text-blue-200 text-xs">
                        Choose your preferred app
                      </p>
                    </div>
                  </motion.button>
                )}

                {/* Copy to Clipboard */}
                <motion.button
                  onClick={handleCopyToClipboard}
                  className="w-full py-4 px-6 rounded-2xl flex items-center gap-4 transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-11 h-11 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
                    {copied ? (
                      <Check size={20} className="text-green-400" />
                    ) : (
                      <Copy size={20} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white" style={{ fontWeight: 600 }}>
                      {copied ? 'Copied!' : 'Copy Message'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {copied ? 'Paste anywhere you like' : 'Copy to clipboard'}
                    </p>
                  </div>
                </motion.button>

                {/* SMS */}
                <motion.button
                  onClick={handleSMS}
                  className="w-full py-4 px-6 rounded-2xl flex items-center gap-4 transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-11 h-11 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                    <MessageCircle size={20} className="text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white" style={{ fontWeight: 600 }}>
                      Send via Text Message
                    </p>
                    <p className="text-gray-400 text-xs">
                      Opens your messaging app
                    </p>
                  </div>
                </motion.button>

                {/* Email */}
                <motion.button
                  onClick={handleEmail}
                  className="w-full py-4 px-6 rounded-2xl flex items-center gap-4 transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-11 h-11 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
                    <Mail size={20} className="text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white" style={{ fontWeight: 600 }}>
                      Send via Email
                    </p>
                    <p className="text-gray-400 text-xs">
                      Opens your email app
                    </p>
                  </div>
                </motion.button>
              </div>

              {/* Bottom padding for safe area */}
              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}