import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Users, Share2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AddStudentScreenProps {
  onBack: () => void;
  parentUserId: string;
}

export function AddStudentScreen({ onBack, parentUserId }: AddStudentScreenProps) {
  const [inviteCode, setInviteCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateInviteCode();
  }, []);

  const generateInviteCode = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0e3c496/family/generate-invite`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parentUserId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInviteCode(data.inviteCode);
      } else {
        console.error('Failed to generate invite code');
      }
    } catch (error) {
      console.error('Error generating invite code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const message = `Join our Family Squad on ThinkFirst! Use code: ${inviteCode}\n\nOpen ThinkFirst → Profile → Join Family Squad`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ThinkFirst Family Squad',
          text: message,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to copying
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center px-5 py-4">
          <button
            onClick={onBack}
            className="text-purple-500 active:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg">Family Squad</h1>
          <div className="w-5" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        {/* Icon Header - 3D Ticket/Key Style */}
        <motion.div
          className="mb-8 relative"
          initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Glow effect - Gold/Orange */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(255, 191, 0, 0.5), rgba(255, 140, 0, 0.3), transparent)',
              width: '160px',
              height: '160px',
              top: '-30px',
              left: '-30px',
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Icon container - Golden */}
          <motion.div
            className="w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 191, 0, 0.15), rgba(255, 140, 0, 0.1))',
              border: '2px solid rgba(255, 191, 0, 0.4)',
              boxShadow: '0 8px 32px rgba(255, 191, 0, 0.3)',
            }}
            animate={{
              rotateY: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Sparkle effect */}
            <motion.div
              className="absolute top-2 right-2"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
            
            <Users className="w-12 h-12 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2 
          className="text-3xl text-center mb-3" 
          style={{ fontWeight: 700 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Family Squad Active
          </span>
        </motion.h2>

        {/* Helper text */}
        <motion.p 
          className="text-center text-gray-400 mb-8 max-w-[280px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Link up to 5 devices to this plan
        </motion.p>

        {isLoading ? (
          /* Loading State */
          <motion.div
            className="w-full max-w-[360px] rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-gray-400 mt-4">Generating code...</p>
            </div>
          </motion.div>
        ) : (
          /* Code Display Card - High Contrast Glass */
          <motion.div
            className="w-full max-w-[360px] rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98), rgba(20, 20, 20, 0.95))',
              backdropFilter: 'blur(40px)',
              border: '2px solid rgba(255, 191, 0, 0.3)',
              boxShadow: '0 12px 40px rgba(255, 191, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Animated border glow - Gold */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 191, 0, 0.4), rgba(255, 140, 0, 0.2))',
                opacity: 0.4,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10">
              {/* Card label */}
              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Your Family Code
                </p>
              </div>

              {/* The Code - Massive Monospace */}
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl tracking-widest select-all"
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FFBF00, #FF8C00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(255, 191, 0, 0.3)',
                  }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                  {inviteCode}
                </motion.div>
              </div>

              {/* Action Row - Copy & Share */}
              <div className="flex gap-3">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{
                    background: copied 
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : 'linear-gradient(135deg, rgba(255, 191, 0, 0.15), rgba(255, 140, 0, 0.1))',
                    border: copied
                      ? '1px solid #10B981'
                      : '1px solid rgba(255, 191, 0, 0.4)',
                    boxShadow: copied
                      ? '0 4px 20px rgba(16, 185, 129, 0.4)'
                      : '0 4px 20px rgba(255, 191, 0, 0.3)',
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span className="text-white" style={{ fontWeight: 600 }}>
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400" style={{ fontWeight: 600 }}>
                        Copy
                      </span>
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #FFBF00, #FF8C00)',
                    boxShadow: '0 4px 20px rgba(255, 191, 0, 0.4)',
                  }}
                >
                  <Share2 className="w-5 h-5 text-black" />
                  <span className="text-black" style={{ fontWeight: 600 }}>
                    Share
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          className="mt-8 text-center max-w-[340px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-400 mb-4">
            Tell your family to:
          </p>
          <div className="text-left space-y-2">
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <span 
                className="text-yellow-400 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ 
                  background: 'rgba(255, 191, 0, 0.1)',
                  border: '1px solid rgba(255, 191, 0, 0.3)',
                  fontWeight: 700,
                }}
              >
                1
              </span>
              <span>Open ThinkFirst app</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <span 
                className="text-yellow-400 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ 
                  background: 'rgba(255, 191, 0, 0.1)',
                  border: '1px solid rgba(255, 191, 0, 0.3)',
                  fontWeight: 700,
                }}
              >
                2
              </span>
              <span>Go to Profile → Join Family Squad</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <span 
                className="text-yellow-400 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ 
                  background: 'rgba(255, 191, 0, 0.1)',
                  border: '1px solid rgba(255, 191, 0, 0.3)',
                  fontWeight: 700,
                }}
              >
                3
              </span>
              <span>Enter this code</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}