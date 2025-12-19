/**
 * GuardianPinModal Component
 * PIN entry modal for guardian settings access
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { ANIMATION_DURATION, EASING } from '../utils/animationTiming';
import { 
  verifyPin, 
  createGuardianPin, 
  hasGuardianPin,
  isValidPinFormat 
} from '../utils/guardianPin';
import { triggerValidationErrorHaptic } from '../utils/haptics';

interface GuardianPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'verify' | 'create';
}

export function GuardianPinModal({
  isOpen,
  onClose,
  onSuccess,
  mode: initialMode,
}: GuardianPinModalProps) {
  const [mode, setMode] = useState<'verify' | 'create' | 'confirm'>(
    initialMode || (hasGuardianPin() ? 'verify' : 'create')
  );
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setError(null);
      setMode(initialMode || (hasGuardianPin() ? 'verify' : 'create'));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen, initialMode]);

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value.slice(-1);
    
    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }
    
    setError(null);
    
    // Auto-focus next input
    if (value && index < 3) {
      const refs = isConfirm ? confirmInputRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits entered
    if (value && index === 3) {
      const fullPin = newPin.join('');
      if (isValidPinFormat(fullPin)) {
        if (isConfirm) {
          handleConfirmSubmit(fullPin);
        } else if (mode === 'verify') {
          handleVerifySubmit(fullPin);
        } else if (mode === 'create') {
          setMode('confirm');
          setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
        }
      }
    }
  };

  const handleKeyDown = (
    index: number, 
    e: React.KeyboardEvent, 
    isConfirm: boolean = false
  ) => {
    if (e.key === 'Backspace') {
      const currentPin = isConfirm ? confirmPin : pin;
      if (!currentPin[index] && index > 0) {
        const refs = isConfirm ? confirmInputRefs : inputRefs;
        refs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifySubmit = (pinValue: string) => {
    const result = verifyPin(pinValue);
    
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Incorrect PIN');
      triggerShake();
      triggerValidationErrorHaptic();
      setPin(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const handleConfirmSubmit = (confirmPinValue: string) => {
    const originalPin = pin.join('');
    
    if (confirmPinValue !== originalPin) {
      setError('PINs do not match. Please try again.');
      triggerShake();
      triggerValidationErrorHaptic();
      setConfirmPin(['', '', '', '']);
      setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
      return;
    }
    
    const result = createGuardianPin(originalPin);
    
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to create PIN');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: isShaking ? [1, 1.02, 0.98, 1.02, 0.98, 1] : 1, 
            opacity: 1,
            x: isShaking ? [-10, 10, -10, 10, 0] : 0,
          }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{
            duration: isShaking ? 0.4 : ANIMATION_DURATION.STANDARD / 1000,
            ease: EASING.EASE_OUT.replace('cubic-bezier(', '').replace(')', '').split(', ').map(Number),
          }}
          className="relative w-full max-w-sm mx-4 bg-zinc-900 rounded-2xl p-6 border border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            {mode === 'verify' ? 'Enter Guardian PIN' : 
             mode === 'create' ? 'Create Guardian PIN' : 
             'Confirm PIN'}
          </h2>
          
          <p className="text-sm text-zinc-400 text-center mb-6">
            {mode === 'verify' 
              ? 'Enter your 4-digit PIN to access guardian settings.'
              : mode === 'create'
              ? 'Create a 4-digit PIN to protect guardian settings.'
              : 'Re-enter your PIN to confirm.'}
          </p>

          {/* PIN Input */}
          <div className="flex justify-center gap-3 mb-4">
            {(mode === 'confirm' ? confirmPin : pin).map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (mode === 'confirm') {
                    confirmInputRefs.current[index] = el;
                  } else {
                    inputRefs.current[index] = el;
                  }
                }}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value, mode === 'confirm')}
                onKeyDown={(e) => handleKeyDown(index, e, mode === 'confirm')}
                className="w-14 h-14 text-center text-2xl font-bold bg-zinc-800 border-2 
                           border-zinc-700 rounded-xl text-white
                           focus:border-emerald-500 focus:outline-none
                           transition-colors"
              />
            ))}
          </div>

          {/* Show/Hide PIN toggle */}
          <button
            onClick={() => setShowPin(!showPin)}
            className="flex items-center justify-center gap-2 mx-auto mb-4 
                       text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            {showPin ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide PIN
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show PIN
              </>
            )}
          </button>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 text-center mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Back button for confirm mode */}
          {mode === 'confirm' && (
            <button
              onClick={() => {
                setMode('create');
                setConfirmPin(['', '', '', '']);
                setError(null);
                setTimeout(() => inputRefs.current[0]?.focus(), 100);
              }}
              className="w-full py-3 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              ← Back to enter PIN
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GuardianPinModal;
