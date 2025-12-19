import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Users, Play, Mail, Lock, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GuardianPinModal } from '../shared/GuardianPinModal';
import { 
  hasGuardianPin, 
  getGuardianSettings, 
  updateGuardianSettings,
  verifyPin 
} from '../../utils/guardianPin';
import { getInviteCode, generateInviteCode, getAvailableFamilySlots } from '../../utils/inviteCode';

interface GuardianSettingsProps {
  onBack: () => void;
  onUpgrade?: () => void;
  onShowDemo?: () => void;
  onShowWeeklyReport?: () => void;
}

// SSR-safe localStorage getter
const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

export function GuardianSettings({ onBack, onUpgrade, onShowDemo, onShowWeeklyReport }: GuardianSettingsProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState<'solo' | 'family' | null>(null);
  const [userId, setUserId] = useState('parent-default');
  const [isHydrated, setIsHydrated] = useState(false);

  // PIN Modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Card 1: Influence (The Soft Locks)
  const [enableFrictionInterstitials, setEnableFrictionInterstitials] = useState(true);
  const [requireReason, setRequireReason] = useState(true);
  
  // Card 1.5: Hard Locks (Guardian Controls)
  const [forceMasteryMode, setForceMasteryMode] = useState(false);
  const [blockMercyButton, setBlockMercyButton] = useState(false);

  // Card 2: Transparency
  const [reportEmail, setReportEmail] = useState('');
  const [includeModeSwitch, setIncludeModeSwitch] = useState(true);
  
  // Invite code
  const [inviteCode, setInviteCode] = useState(getInviteCode());

  // Hydrate from localStorage
  useEffect(() => {
    setIsPremium(getItem('thinkfirst_premium') === 'true');
    setPlan(getItem('thinkfirst_plan') as 'solo' | 'family' | null);
    setUserId(getItem('thinkfirst_userId') || 'parent-default');
    setEnableFrictionInterstitials(getItem('thinkfirst_frictionInterstitials') !== 'false');
    setRequireReason(getItem('thinkfirst_requireReason') !== 'false');
    setReportEmail(getItem('thinkfirst_guardianEmail') || '');
    setIncludeModeSwitch(getItem('thinkfirst_includeModeSwitch') !== 'false');
    
    const guardianSettings = getGuardianSettings();
    setForceMasteryMode(guardianSettings?.forceMasteryMode ?? false);
    setBlockMercyButton(guardianSettings?.blockMercyButton ?? false);
    
    setIsHydrated(true);
  }, []);

  const isGuardianPlan = isPremium && plan === 'family';
  
  // Generate invite code if family plan and none exists
  useEffect(() => {
    if (isHydrated && isGuardianPlan && !inviteCode) {
      const subscriptionId = getItem('thinkfirst_subscriptionId') || 'sub-default';
      const newCode = generateInviteCode(userId, subscriptionId);
      setInviteCode(newCode);
    }
  }, [isHydrated, isGuardianPlan, inviteCode, userId]);
  
  // Require PIN for sensitive actions
  const requirePinForAction = (action: () => void) => {
    if (!hasGuardianPin()) {
      // No PIN set, show modal to create one
      setPendingAction(() => action);
      setShowPinModal(true);
    } else if (!pinVerified) {
      // PIN exists but not verified this session
      setPendingAction(() => action);
      setShowPinModal(true);
    } else {
      // PIN verified, execute action
      action();
    }
  };

  const handleToggleFriction = (enabled: boolean) => {
    setEnableFrictionInterstitials(enabled);
    localStorage.setItem('thinkfirst_frictionInterstitials', enabled.toString());
  };

  const handleToggleReason = (enabled: boolean) => {
    setRequireReason(enabled);
    localStorage.setItem('thinkfirst_requireReason', enabled.toString());
  };

  const handleToggleModeSwitch = (enabled: boolean) => {
    setIncludeModeSwitch(enabled);
    localStorage.setItem('thinkfirst_includeModeSwitch', enabled.toString());
  };

  const handleEmailChange = (email: string) => {
    setReportEmail(email);
    localStorage.setItem('thinkfirst_guardianEmail', email);
  };
  
  const handleToggleForceMastery = (enabled: boolean) => {
    requirePinForAction(() => {
      setForceMasteryMode(enabled);
      updateGuardianSettings({ forceMasteryMode: enabled });
    });
  };
  
  const handleToggleBlockMercy = (enabled: boolean) => {
    requirePinForAction(() => {
      setBlockMercyButton(enabled);
      updateGuardianSettings({ blockMercyButton: enabled });
    });
  };
  
  const handlePinSuccess = () => {
    setPinVerified(true);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] relative overflow-hidden">
      {/* Ambient glow - Electric Violet theme */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8A2BE2]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative px-6 pt-12 pb-6 border-b border-white/10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mb-6 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-400" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8A2BE2] to-purple-700 flex items-center justify-center shadow-lg shadow-[#8A2BE2]/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
            Guardian Guidance
          </h1>
        </div>
        <p className="text-gray-400 text-sm">
          Gentle nudges that preserve student autonomy
        </p>
      </div>

      {/* Content */}
      <div className="relative flex-1 px-6 pt-6 pb-24 overflow-y-auto space-y-4">
        
        {/* Card 1: Influence (The Soft Locks) */}
        <motion.div
          className="bg-[rgba(20,20,20,0.95)] backdrop-blur-xl rounded-[20px] p-5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4">
            <h3 className="text-white text-base mb-1" style={{ fontWeight: 600 }}>
              Influence (The Soft Locks)
            </h3>
            <p className="text-gray-500 text-xs">
              Guide without controlling
            </p>
          </div>

          <div className="space-y-4">
            {/* Toggle 1: Friction Interstitials */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-200 text-sm mb-1" style={{ fontWeight: 500 }}>
                  Enable Friction Interstitials
                </p>
                <p className="text-gray-500 text-xs">
                  Show a confirmation prompt before lowering difficulty.
                </p>
              </div>
              <button
                onClick={() => handleToggleFriction(!enableFrictionInterstitials)}
                className="flex-shrink-0"
              >
                <div
                  className="relative w-12 h-6 rounded-full transition-all"
                  style={{
                    background: enableFrictionInterstitials
                      ? 'linear-gradient(135deg, #22D3EE, #06B6D4)'
                      : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: enableFrictionInterstitials
                      ? '0 0 20px rgba(34, 211, 238, 0.4)'
                      : 'none',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: enableFrictionInterstitials ? 26 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>

            {/* Toggle 2: Require Reason */}
            <div className="flex items-start justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex-1">
                <p className="text-gray-200 text-sm mb-1" style={{ fontWeight: 500 }}>
                  Require Reason for Switching
                </p>
                <p className="text-gray-500 text-xs">
                  Ask student if they are tired or confused when they switch modes.
                </p>
              </div>
              <button
                onClick={() => handleToggleReason(!requireReason)}
                className="flex-shrink-0"
              >
                <div
                  className="relative w-12 h-6 rounded-full transition-all"
                  style={{
                    background: requireReason
                      ? 'linear-gradient(135deg, #22D3EE, #06B6D4)'
                      : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: requireReason
                      ? '0 0 20px rgba(34, 211, 238, 0.4)'
                      : 'none',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: requireReason ? 26 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 1.5: Hard Locks (Guardian Controls) */}
        <motion.div
          className="bg-[rgba(20,20,20,0.95)] backdrop-blur-xl rounded-[20px] p-5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-orange-400" />
              <h3 className="text-white text-base" style={{ fontWeight: 600 }}>
                Hard Locks
              </h3>
            </div>
            <p className="text-gray-500 text-xs">
              PIN-protected controls (use sparingly)
            </p>
          </div>

          <div className="space-y-4">
            {/* Toggle: Force Mastery Mode */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <p className="text-gray-200 text-sm" style={{ fontWeight: 500 }}>
                    Force Mastery Mode
                  </p>
                </div>
                <p className="text-gray-500 text-xs">
                  Lock student to Mastery Mode (2x difficulty)
                </p>
              </div>
              <button
                onClick={() => handleToggleForceMastery(!forceMasteryMode)}
                className="flex-shrink-0"
              >
                <div
                  className="relative w-12 h-6 rounded-full transition-all"
                  style={{
                    background: forceMasteryMode
                      ? 'linear-gradient(135deg, #F97316, #FB923C)'
                      : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: forceMasteryMode
                      ? '0 0 20px rgba(249, 115, 22, 0.4)'
                      : 'none',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: forceMasteryMode ? 26 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>

            {/* Toggle: Block Mercy Button */}
            <div className="flex items-start justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle className="w-4 h-4 text-red-400" />
                  <p className="text-gray-200 text-sm" style={{ fontWeight: 500 }}>
                    Block "I'm Stuck" Button
                  </p>
                </div>
                <p className="text-gray-500 text-xs">
                  Hide the mercy option from students
                </p>
              </div>
              <button
                onClick={() => handleToggleBlockMercy(!blockMercyButton)}
                className="flex-shrink-0"
              >
                <div
                  className="relative w-12 h-6 rounded-full transition-all"
                  style={{
                    background: blockMercyButton
                      ? 'linear-gradient(135deg, #EF4444, #F87171)'
                      : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: blockMercyButton
                      ? '0 0 20px rgba(239, 68, 68, 0.4)'
                      : 'none',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: blockMercyButton ? 26 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Transparency */}
        <motion.div
          className="bg-[rgba(20,20,20,0.95)] backdrop-blur-xl rounded-[20px] p-5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <h3 className="text-white text-base mb-1" style={{ fontWeight: 600 }}>
              Transparency
            </h3>
            <p className="text-gray-500 text-xs">
              Stay informed without hovering
            </p>
          </div>

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-400 text-xs mb-2">
                Weekly Report Email
              </label>
              <input
                type="email"
                value={reportEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="parent@email.com"
                className="w-full h-12 px-4 rounded-[12px] bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#8A2BE2]/50 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Toggle: Include Mode Switches */}
            <div className="flex items-start justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex-1">
                <p className="text-gray-200 text-sm mb-1" style={{ fontWeight: 500 }}>
                  Include Mode Switches
                </p>
                <p className="text-gray-500 text-xs">
                  Report when students change difficulty modes
                </p>
              </div>
              <button
                onClick={() => handleToggleModeSwitch(!includeModeSwitch)}
                className="flex-shrink-0"
              >
                <div
                  className="relative w-12 h-6 rounded-full transition-all"
                  style={{
                    background: includeModeSwitch
                      ? 'linear-gradient(135deg, #22D3EE, #06B6D4)'
                      : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: includeModeSwitch
                      ? '0 0 20px rgba(34, 211, 238, 0.4)'
                      : 'none',
                  }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                    animate={{
                      x: includeModeSwitch ? 26 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>

            {/* Weekly Report Preview Button */}
            {onShowWeeklyReport && (
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={onShowWeeklyReport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
                  style={{ fontWeight: 500 }}
                >
                  <Mail className="w-4 h-4" />
                  Preview Weekly Report
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 3: Family */}
        <motion.div
          className="bg-[rgba(20,20,20,0.95)] backdrop-blur-xl rounded-[20px] p-5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-white text-base mb-1" style={{ fontWeight: 600 }}>
              Family
            </h3>
            <p className="text-gray-500 text-xs">
              Manage your household
            </p>
          </div>

          {isGuardianPlan ? (
            <div className="space-y-3">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                  <span className="text-[#22D3EE] text-sm" style={{ fontWeight: 500 }}>
                    Guardian Plan Active
                  </span>
                </div>
              </div>

              {/* Invite Code Display */}
              {inviteCode && (
                <div className="pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Invite Code</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteCode.code);
                        // Could add toast here
                      }}
                      className="text-xs text-violet-400 hover:text-violet-300"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center">
                    <span className="text-violet-300 text-xl font-mono" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                      {inviteCode.code}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Share this code with your children to link their accounts
                  </p>
                </div>
              )}

              {/* Seats Available Badge */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-gray-400 text-sm">Available Seats</span>
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-100 text-sm" style={{ fontWeight: 500 }}>
                      {getAvailableFamilySlots()} of 5 Seats
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm mb-4">
                Upgrade to Guardian Plan to manage multiple students
              </p>
              <div className="space-y-2">
                {onUpgrade && (
                  <button
                    onClick={onUpgrade}
                    className="w-full px-6 py-2.5 rounded-[12px] bg-gradient-to-r from-[#8A2BE2] to-purple-600 text-white text-sm shadow-lg shadow-[#8A2BE2]/30 hover:shadow-[#8A2BE2]/40 transition-all"
                    style={{ fontWeight: 600 }}
                  >
                    Upgrade Now
                  </button>
                )}
                {onShowDemo && (
                  <button
                    onClick={onShowDemo}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
                    style={{ fontWeight: 500 }}
                  >
                    <Play className="w-4 h-4" />
                    Watch Friction Demo
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent pointer-events-none">
        <p className="text-gray-500 text-xs text-center" style={{ opacity: 0.3 }}>
          These settings help build habits without removing autonomy.
        </p>
      </div>
    </div>
  );
}