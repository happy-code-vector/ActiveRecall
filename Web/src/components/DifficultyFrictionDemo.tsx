import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Award, ArrowLeft } from 'lucide-react';
import { DifficultyFrictionModal } from './DifficultyFrictionModal';

interface DifficultyFrictionDemoProps {
  onBack: () => void;
}

export function DifficultyFrictionDemo({ onBack }: DifficultyFrictionDemoProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentMode, setCurrentMode] = useState<'easy' | 'medium' | 'hard' | 'mastery'>('mastery');
  const [targetMode, setTargetMode] = useState<'easy' | 'medium' | 'hard' | 'mastery'>('medium');
  const streak = 3;

  const handleModeSwitch = (mode: 'easy' | 'medium' | 'hard' | 'mastery') => {
    const frictionEnabled = localStorage.getItem('thinkfirst_frictionInterstitials') !== 'false';
    
    // Check if this is a downgrade
    const levels = { easy: 1, medium: 2, hard: 3, mastery: 4 };
    const isDowngrade = levels[mode] < levels[currentMode];

    if (frictionEnabled && isDowngrade) {
      setTargetMode(mode);
      setShowModal(true);
    } else {
      setCurrentMode(mode);
    }
  };

  const handleConfirm = (reason?: 'tired' | 'confused' | 'other') => {
    console.log('Mode switch confirmed with reason:', reason);
    setCurrentMode(targetMode);
    setShowModal(false);
    
    // Log the switch for weekly report
    const switches = JSON.parse(localStorage.getItem('thinkfirst_modeSwitches') || '[]');
    switches.push({
      date: new Date().toISOString(),
      from: currentMode,
      to: targetMode,
      reason,
    });
    localStorage.setItem('thinkfirst_modeSwitches', JSON.stringify(switches));
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <ArrowLeft size={20} className="text-gray-400" />
      </button>

      {/* Demo Card */}
      <div className="max-w-md w-full bg-[rgba(20,20,20,0.95)] backdrop-blur-xl rounded-[24px] border border-white/10 p-6">
        <h2 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>
          Guardian Friction Demo
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Try switching from Mastery Mode to a lower difficulty to see the friction interstitial.
        </p>

        {/* Current Mode Display */}
        <div className="mb-6 p-4 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-gray-500 text-xs mb-1">Current Mode</p>
          <div className="flex items-center gap-2">
            {currentMode === 'mastery' && <Zap className="w-5 h-5 text-orange-400" />}
            {currentMode === 'hard' && <Award className="w-5 h-5 text-purple-400" />}
            <span className="text-white text-lg capitalize" style={{ fontWeight: 600 }}>
              {currentMode} Mode
            </span>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleModeSwitch('mastery')}
            className={`w-full h-[48px] rounded-[14px] text-left px-4 transition-all ${
              currentMode === 'mastery'
                ? 'bg-orange-500/20 border-2 border-orange-500/40 text-orange-300'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
            }`}
            style={{ fontWeight: 500 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Mastery Mode
              <span className="ml-auto text-xs text-orange-400">+2x XP</span>
            </div>
          </button>

          <button
            onClick={() => handleModeSwitch('hard')}
            className={`w-full h-[48px] rounded-[14px] text-left px-4 transition-all ${
              currentMode === 'hard'
                ? 'bg-purple-500/20 border-2 border-purple-500/40 text-purple-300'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
            }`}
            style={{ fontWeight: 500 }}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Hard Mode
              <span className="ml-auto text-xs text-purple-400">+1.5x XP</span>
            </div>
          </button>

          <button
            onClick={() => handleModeSwitch('medium')}
            className={`w-full h-[48px] rounded-[14px] text-left px-4 transition-all ${
              currentMode === 'medium'
                ? 'bg-cyan-500/20 border-2 border-cyan-500/40 text-cyan-300'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
            }`}
            style={{ fontWeight: 500 }}
          >
            <div className="flex items-center gap-2">
              Standard Mode
              <span className="ml-auto text-xs text-gray-500">1x XP</span>
            </div>
          </button>

          <button
            onClick={() => handleModeSwitch('easy')}
            className={`w-full h-[48px] rounded-[14px] text-left px-4 transition-all ${
              currentMode === 'easy'
                ? 'bg-green-500/20 border-2 border-green-500/40 text-green-300'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
            }`}
            style={{ fontWeight: 500 }}
          >
            <div className="flex items-center gap-2">
              Easy Mode
              <span className="ml-auto text-xs text-gray-500">0.5x XP</span>
            </div>
          </button>
        </div>

        {/* Settings Link */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-gray-500 text-xs text-center">
            Friction interstitials can be configured in{' '}
            <span className="text-[#8A2BE2]" style={{ fontWeight: 500 }}>
              Guardian Guidance
            </span>
          </p>
        </div>
      </div>

      {/* Friction Modal */}
      {showModal && (
        <DifficultyFrictionModal
          currentMode={currentMode}
          targetMode={targetMode}
          requireReason={localStorage.getItem('thinkfirst_requireReason') !== 'false'}
          streak={streak}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}