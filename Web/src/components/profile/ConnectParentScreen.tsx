import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Link2, Loader2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface ConnectParentScreenProps {
  onBack: () => void;
  userId: string;
  studentName?: string;
}

export function ConnectParentScreen({
  onBack,
  userId,
  studentName,
}: ConnectParentScreenProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow letters and numbers
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (sanitized.length === 0) {
      // Handle delete
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      setError('');
      return;
    }

    if (sanitized.length === 1) {
      const newCode = [...code];
      newCode[index] = sanitized;
      setCode(newCode);
      setError('');

      // Auto-focus next input
      if (index < 7) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }
    } else if (sanitized.length > 1) {
      // Handle paste
      const chars = sanitized.split('').slice(0, 8);
      const newCode = [...code];
      chars.forEach((char, i) => {
        if (index + i < 8) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      setError('');

      // Focus the last filled input or next empty
      const lastFilledIndex = Math.min(index + chars.length - 1, 7);
      inputRefs.current[lastFilledIndex]?.focus();
      setFocusedIndex(lastFilledIndex);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 7) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const isComplete = code.every(digit => digit !== '');

  const handleConnect = async () => {
    if (!isComplete) return;

    setIsConnecting(true);
    setError('');

    const inviteCode = code.join('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/family/connect-student`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentUserId: userId,
            inviteCode: inviteCode,
            studentName: studentName || 'Student',
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setIsConnected(true);
        // Store connection status in localStorage
        localStorage.setItem('thinkfirst_parentConnected', 'true');
        localStorage.setItem('thinkfirst_parentId', data.parentUserId);
        
        // Auto-close after 2 seconds
        setTimeout(() => onBack(), 2000);
      } else {
        setError(data.error || 'Invalid code. Please check and try again.');
        // Clear the code
        setCode(['', '', '', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setFocusedIndex(0);
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsConnecting(false);
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
          <h1 className="flex-1 text-center text-lg">Join Family Squad</h1>
          <div className="w-5" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        {!isConnected ? (
          <>
            {/* Icon Header */}
            <motion.div
              className="mb-8 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)',
                  width: '120px',
                  height: '120px',
                  top: '-20px',
                  left: '-20px',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Icon container */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <Link2 className="w-10 h-10 text-purple-400" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl text-center mb-3" style={{ fontWeight: 700 }}>
              Have a Family Code?
            </h2>

            {/* Helper text */}
            <p className="text-center text-gray-400 mb-12 max-w-[300px]">
              Enter the 8-character code from your parent to join the Family Squad
            </p>

            {/* OTP Input Boxes */}
            <div className="flex gap-2 mb-6">
              {code.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="text"
                  maxLength={8}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onFocus={() => handleFocus(index)}
                  className="w-11 h-14 text-center text-xl text-white rounded-xl transition-all outline-none"
                  style={{
                    background: '#1A1A1A',
                    border: focusedIndex === index 
                      ? '2px solid #8B5CF6'
                      : '2px solid transparent',
                    boxShadow: focusedIndex === index
                      ? '0 0 20px rgba(139, 92, 246, 0.4)'
                      : 'none',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    caretColor: '#8B5CF6',
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                className="text-red-400 text-sm text-center mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            {/* Link Account Button */}
            <button
              onClick={handleConnect}
              disabled={!isComplete || isConnecting}
              className="w-full max-w-[340px] py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 disabled:active:scale-100 mb-8"
              style={{
                background: isComplete && !isConnecting
                  ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                  : '#2A2A2A',
                color: isComplete && !isConnecting ? 'white' : '#666666',
                boxShadow: isComplete && !isConnecting
                  ? '0 4px 24px rgba(139, 92, 246, 0.4)'
                  : 'none',
                cursor: isComplete && !isConnecting ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                'Link Account'
              )}
            </button>

            {/* Footer info */}
            <motion.div
              className="text-center max-w-[320px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-gray-500">
                This will unlock Premium features and join the Family Leaderboard
              </p>
            </motion.div>
          </>
        ) : (
          /* Success State */
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 relative inline-block">
              <motion.div
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Check className="w-12 h-12 text-green-500" />
              </motion.div>
            </div>
            
            <h2 className="text-2xl text-white mb-3" style={{ fontWeight: 700 }}>
              Welcome to Family Squad!
            </h2>
            <p className="text-gray-400">
              Premium features unlocked · Leaderboard active
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
