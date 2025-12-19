import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, Check } from 'lucide-react';

interface ShareCardProps {
  question: string;
  effortScore: number;
  onClose: () => void;
}

export function ShareCard({ question, effortScore, onClose }: ShareCardProps) {
  const [downloaded, setDownloaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate percentage (out of 3)
  const effortPercent = Math.round((effortScore / 3) * 100);

  // SVG circle calculations for progress ring
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (effortPercent / 100) * circumference;

  // Extract topic from question (first 50 chars or until punctuation)
  const getTopic = (q: string) => {
    const maxLength = 50;
    let topic = q.length > maxLength ? q.substring(0, maxLength) + '...' : q;
    
    // Clean up common question words
    topic = topic
      .replace(/^(what is|what are|how does|why is|why are|explain|describe)/i, '')
      .trim();
    
    return topic;
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Use html2canvas to capture the card
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `thinkfirst-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          
          setDownloaded(true);
          setTimeout(() => setDownloaded(false), 2000);
        }
      });
    } catch (error) {
      console.error('Failed to download card:', error);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'thinkfirst-share.png', { type: 'image/png' });
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'ThinkFirst Achievement',
              text: `I just explained something in my own words on ThinkFirst! 🧠`,
            });
          } else {
            // Fallback to download if share not supported
            handleDownload();
          }
        }
      });
    } catch (error) {
      console.error('Failed to share:', error);
      // Fallback to download
      handleDownload();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Content Container */}
        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
          >
            <X size={20} className="text-white" />
          </button>

          {/* The Instagram-Ready Card */}
          <div
            ref={cardRef}
            className="w-full aspect-square rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #000000 0%, #0A0A0A 100%)',
            }}
          >
            {/* Subtle gradient orbs */}
            <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
              {/* Background orbs */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-[120px]" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Effort Ring */}
                <div className="relative mb-8">
                  <svg width="200" height="200" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Progress circle with gradient */}
                    <defs>
                      <linearGradient id="shareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06d6a0" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      stroke="url(#shareGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{ 
                        filter: 'drop-shadow(0 0 12px rgba(6,214,160,0.6))',
                      }}
                    />
                  </svg>

                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-7xl text-white" style={{ fontWeight: 700, fontFamily: 'Inter, -apple-system, sans-serif' }}>
                      {effortPercent}%
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="px-6 mb-8">
                  <p className="text-white/90 text-xl leading-relaxed mb-2">
                    I explained
                  </p>
                  <p className="text-white text-2xl" style={{ fontWeight: 600 }}>
                    {getTopic(question)}
                  </p>
                  <p className="text-white/90 text-xl leading-relaxed mt-2">
                    in my own words.
                  </p>
                </div>

                {/* Branding */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                  <span className="text-white/70 text-sm" style={{ fontWeight: 500 }}>
                    ThinkFirst
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <motion.button
              onClick={handleDownload}
              className="flex-1 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center gap-2 hover:bg-white/15 active:scale-95 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {downloaded ? (
                <>
                  <Check size={20} className="text-green-400" />
                  <span className="text-green-400" style={{ fontWeight: 600 }}>
                    Downloaded!
                  </span>
                </>
              ) : (
                <>
                  <Download size={20} className="text-white" />
                  <span className="text-white" style={{ fontWeight: 600 }}>
                    Download
                  </span>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleShare}
              className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(135deg, #8A2BE2, #6A1BB2)',
                boxShadow: '0 4px 20px rgba(138, 43, 226, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={20} className="text-white" />
              <span className="text-white" style={{ fontWeight: 600 }}>
                Share
              </span>
            </motion.button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-gray-500 text-xs mt-4">
            Share your achievement on Instagram, Twitter, or Stories! 🎉
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
