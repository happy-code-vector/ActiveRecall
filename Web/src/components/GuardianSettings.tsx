import { useState } from 'react';
import { ArrowLeft, Shield, Users, Play, Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface GuardianSettingsProps {
  onBack: () => void;
  onUpgrade?: () => void;
  onShowDemo?: () => void;
  onShowWeeklyReport?: () => void;
}

export function GuardianSettings({ onBack, onUpgrade, onShowDemo, onShowWeeklyReport }: GuardianSettingsProps) {
  const isPremium = localStorage.getItem('thinkfirst_premium') === 'true';
  const plan = localStorage.getItem('thinkfirst_plan') as 'solo' | 'family' | null;
  const isGuardianPlan = isPremium && plan === 'family';

  // Card 1: Influence (The Soft Locks)
  const [enableFrictionInterstitials, setEnableFrictionInterstitials] = useState(
    localStorage.getItem('thinkfirst_frictionInterstitials') !== 'false'
  );
  const [requireReason, setRequireReason] = useState(
    localStorage.getItem('thinkfirst_requireReason') !== 'false'
  );

  // Card 2: Transparency
  const [reportEmail, setReportEmail] = useState(
    localStorage.getItem('thinkfirst_guardianEmail') || ''
  );
  const [includeModeSwitch, setIncludeModeSwitch] = useState(
    localStorage.getItem('thinkfirst_includeModeSwitch') !== 'false'
  );

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

              {/* Seats Available Badge */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-gray-400 text-sm">Available Seats</span>
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-100 text-sm" style={{ fontWeight: 500 }}>
                      5 Seats
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