/**
 * JoinFamilyScreen Component
 * Allows students to join a family plan using an invite code
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Check, AlertCircle } from 'lucide-react';
import { ANIMATION_DURATION } from '../../utils/animationTiming';
import { 
  validateInviteCode, 
  linkStudentToFamily,
  getFamilyLinkStatus,
  isValidInviteCodeFormat 
} from '../../utils/inviteCode';

interface JoinFamilyScreenProps {
  onBack: () => void;
  studentUserId: string;
  onSuccess?: () => void;
}

export function JoinFamilyScreen({ 
  onBack, 
  studentUserId,
  onSuccess 
}: JoinFamilyScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const familyStatus = getFamilyLinkStatus();

  const handleCodeChange = (index: number, value: string) => {
    // Handle paste
    if (value.length > 1) {
      const pastedCode = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
      
      // Check if it's a full code like "FAM-ABC"
      if (pastedCode.startsWith('FAM-') && pastedCode.length === 7) {
        const chars = pastedCode.replace('FAM-', '').split('');
        setCode(['F', 'A', 'M', ...chars]);
        setError(null);
        return;
      }
    }
    
    const char = value.slice(-1).toUpperCase();
    if (!/^[A-Z0-9]?$/.test(char)) return;
    
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    setError(null);
    
    // Auto-focus next input
    if (char && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = `${code.slice(0, 3).join('')}-${code.slice(3).join('')}`;
    
    if (!isValidInviteCodeFormat(fullCode)) {
      setError('Please enter a valid invite code (e.g., FAM-ABC)');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const validation = validateInviteCode(fullCode);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid invite code');
      setIsLoading(false);
      return;
    }
    
    const linkResult = linkStudentToFamily(studentUserId, validation.inviteCode!);
    
    if (!linkResult.success) {
      setError(linkResult.error || 'Failed to join family');
      setIsLoading(false);
      return;
    }
    
    setIsSuccess(true);
    setIsLoading(false);
    
    setTimeout(() => {
      onSuccess?.();
    }, 1500);
  };

  // Already linked view
  if (familyStatus.isLinked) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">You're in a Family Squad!</h1>
          <p className="text-zinc-400 text-center mb-4">
            You're already linked to a family plan.
          </p>
          <p className="text-sm text-zinc-500">
            Code: {familyStatus.familyCode}
          </p>
        </div>
      </div>
    );
  }

  // Success view
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">Welcome to the Squad!</h1>
          <p className="text-zinc-400">
            You've successfully joined the family plan.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 
                          flex items-center justify-center">
            <Users className="w-10 h-10 text-violet-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Join Family Squad
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          Enter the invite code from your parent to join their family plan.
        </p>

        {/* Code Input */}
        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-3 text-center">
            Invite Code
          </label>
          
          <div className="flex justify-center items-center gap-1">
            {/* FAM- prefix */}
            {code.slice(0, 3).map((char, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center text-lg font-mono font-bold 
                           bg-zinc-800 border-2 border-zinc-700 rounded-lg text-white
                           focus:border-violet-500 focus:outline-none
                           transition-colors"
                placeholder={['F', 'A', 'M'][index]}
              />
            ))}
            
            <span className="text-2xl text-zinc-600 mx-1">-</span>
            
            {/* XXX suffix */}
            {code.slice(3).map((char, index) => (
              <input
                key={index + 3}
                id={`code-input-${index + 3}`}
                type="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleCodeChange(index + 3, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index + 3, e)}
                className="w-10 h-12 text-center text-lg font-mono font-bold 
                           bg-zinc-800 border-2 border-zinc-700 rounded-lg text-white
                           focus:border-violet-500 focus:outline-none
                           transition-colors"
              />
            ))}
          </div>
          
          <p className="text-xs text-zinc-500 text-center mt-2">
            Example: FAM-ABC
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || code.some(c => !c)}
          className="w-full py-4 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-violet-500 to-purple-500
                     hover:from-violet-600 hover:to-purple-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Joining...
            </span>
          ) : (
            'Join Family'
          )}
        </button>

        {/* Help text */}
        <p className="text-xs text-zinc-500 text-center mt-6">
          Ask your parent for the invite code. They can find it in their 
          Parent Dashboard under "Family Squad".
        </p>
      </div>
    </div>
  );
}

export default JoinFamilyScreen;
