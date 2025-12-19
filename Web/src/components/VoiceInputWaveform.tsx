import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, Keyboard, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceInputWaveformProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  masteryMode?: boolean;
  onReviewStateChange?: (isReviewing: boolean) => void;
}

export function VoiceInputWaveform({ onTranscript, disabled = false, masteryMode = false, onReviewStateChange }: VoiceInputWaveformProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText + ' ';
          } else {
            interimTranscript += transcriptText;
          }
        }

        // Update local transcript for review mode
        if (finalTranscript) {
          setTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        // Only log non-permission errors
        if (event.error !== 'not-allowed') {
          console.error('Speech recognition error:', event.error);
        }
        
        // Handle permission denied
        if (event.error === 'not-allowed') {
          setPermissionDenied(true);
          setTimeout(() => setPermissionDenied(false), 5000);
        }
        
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // When recording stops, enter review mode if we have transcript
        if (finalTranscript.trim()) {
          setReviewMode(true);
          onReviewStateChange?.(true);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }
    };
  }, [onReviewStateChange]);

  const toggleListening = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
      setIsListening(false);
    } else {
      try {
        // Reset states
        setPermissionDenied(false);
        setReviewMode(false);
        setTranscript('');
        onReviewStateChange?.(false);
        
        // Start recognition
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setPermissionDenied(true);
        setIsListening(false);
      }
    }
  };

  const handleReRecord = () => {
    setReviewMode(false);
    setTranscript('');
    setShowKeyboard(false);
    onReviewStateChange?.(false);
    toggleListening();
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript(transcript);
      setReviewMode(false);
      setTranscript('');
      setShowKeyboard(false);
      onReviewStateChange?.(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  // Waveform bar count and heights
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <>
      {/* Voice Input FAB - Only show when not in review mode */}
      {!reviewMode && (
        <motion.button
          onClick={toggleListening}
          disabled={disabled}
          type="button"
          className="absolute top-4 right-4 p-3.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          style={{
            background: isListening 
              ? masteryMode
                ? 'linear-gradient(135deg, #F97316, #FB923C)'
                : 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
              : 'rgba(255, 255, 255, 0.1)',
            border: isListening 
              ? masteryMode
                ? '1px solid rgba(249, 115, 22, 0.5)'
                : '1px solid rgba(139, 92, 246, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.2)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-gray-400" />}
        </motion.button>
      )}

      {/* Permission Denied Warning */}
      <AnimatePresence>
        {permissionDenied && (
          <motion.div
            className="absolute -top-16 right-0 px-3 py-2 rounded-lg backdrop-blur-xl whitespace-nowrap"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] text-red-400">
              🎤 Microphone access denied
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Waveform Overlay - During Recording */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden rounded-b-[16px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(to top, rgba(10, 10, 10, 0.95), transparent)',
            }}
          >
            {/* Waveform bars */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-[3px] px-8">
              {bars.map((i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    background: masteryMode
                      ? 'linear-gradient(to top, #F97316, #22D3EE)'
                      : 'linear-gradient(to top, #8B5CF6, #22D3EE)',
                  }}
                  animate={{
                    height: [
                      Math.random() * 8 + 4,
                      Math.random() * 24 + 8,
                      Math.random() * 16 + 4,
                      Math.random() * 28 + 8,
                      Math.random() * 12 + 4,
                    ],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.03,
                  }}
                />
              ))}
            </div>

            {/* Listening text */}
            <motion.div
              className="absolute bottom-14 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 rounded-full backdrop-blur-xl"
              style={{
                background: masteryMode
                  ? 'rgba(249, 115, 22, 0.3)'
                  : 'rgba(139, 92, 246, 0.3)',
                border: masteryMode
                  ? '1px solid rgba(249, 115, 22, 0.5)'
                  : '1px solid rgba(139, 92, 246, 0.5)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: masteryMode ? '#FB923C' : '#A78BFA',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <span 
                  className="text-[11px] tracking-wide uppercase"
                  style={{
                    color: masteryMode ? '#FB923C' : '#A78BFA',
                  }}
                >
                  Listening
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review State - Show transcript with editing capabilities */}
      <AnimatePresence>
        {reviewMode && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{
              background: '#000000',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 pt-12 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.2), rgba(34, 211, 238, 0.2))',
                    border: '1px solid rgba(0, 255, 148, 0.3)',
                  }}
                >
                  <Mic className="w-5 h-5" style={{ color: '#00FF94' }} />
                </div>
                <div>
                  <h2 className="text-white text-lg" style={{ fontWeight: 600 }}>
                    Review Your Answer
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Check and edit before submitting
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-6 pb-8 flex flex-col">
              {/* Glass Container with Static Waveform and Editable Text */}
              <div 
                className="flex-1 rounded-[24px] p-6 relative overflow-hidden backdrop-blur-xl"
                style={{
                  background: 'rgba(20, 20, 20, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Static Audio Waveform - Floating above text */}
                <motion.div
                  className="mb-6 h-10 flex items-center justify-center gap-[3px] px-4 rounded-[12px]"
                  style={{
                    background: 'rgba(0, 255, 148, 0.08)',
                    border: '1px solid rgba(0, 255, 148, 0.2)',
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {bars.map((i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        height: `${[12, 20, 16, 28, 24, 18, 22, 14, 26, 20, 24, 16, 22, 18, 28, 20, 16, 24, 18, 22][i] || 16}px`,
                        background: '#00FF94',
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Editable Transcript Text */}
                <textarea
                  ref={textareaRef}
                  value={transcript}
                  onChange={handleTextChange}
                  placeholder="Your transcribed text will appear here..."
                  className="w-full flex-1 bg-transparent border-none resize-none outline-none text-white text-[17px] leading-relaxed placeholder-gray-600"
                  style={{
                    minHeight: '200px',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                />

                {/* Keyboard Accessory Toggle - Bottom right of container */}
                <button
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-full transition-all"
                  style={{
                    background: showKeyboard 
                      ? 'rgba(139, 92, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: showKeyboard
                      ? '1px solid rgba(139, 92, 246, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Keyboard 
                    className="w-4 h-4" 
                    style={{ color: showKeyboard ? '#A78BFA' : '#6B7280' }}
                  />
                </button>
              </div>

              {/* Bottom Controls Row */}
              <motion.div
                className="flex items-center gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Left: Circular Refresh/Redo button */}
                <button
                  onClick={handleReRecord}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'transparent',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>

                {/* Right: Pill-shaped Submit button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={!transcript.trim()}
                  className="flex-1 h-14 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: transcript.trim()
                      ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    boxShadow: transcript.trim()
                      ? '0 4px 24px rgba(139, 92, 246, 0.4)'
                      : 'none',
                  }}
                  whileHover={{ scale: transcript.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: transcript.trim() ? 0.98 : 1 }}
                >
                  <span className="text-white text-[16px]" style={{ fontWeight: 600 }}>
                    Submit
                  </span>
                  <motion.div
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}