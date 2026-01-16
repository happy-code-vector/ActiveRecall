import { useState } from 'react';
import { ChevronRight, Trash2, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsScreenProps {
  onBack: () => void;
  onManagePlan: () => void;
  onRestorePurchases: () => void;
  onEditEmail: () => void;
  onEditPassword: () => void;
  onLogOut: () => void;
  onDeleteAccount: () => void;
  notificationsEnabled?: boolean;
  onToggleNotifications?: (enabled: boolean) => void;
  onViewOnboarding?: () => void;
}

export function SettingsScreen({
  onBack,
  onManagePlan,
  onRestorePurchases,
  onEditEmail,
  onEditPassword,
  onLogOut,
  onDeleteAccount,
  notificationsEnabled = true,
  onToggleNotifications,
  onViewOnboarding,
}: SettingsScreenProps) {
  const [notifEnabled, setNotifEnabled] = useState(notificationsEnabled);

  const handleToggleNotifications = () => {
    const newValue = !notifEnabled;
    setNotifEnabled(newValue);
    onToggleNotifications?.(newValue);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center px-5 py-4">
          <button
            onClick={onBack}
            className="text-purple-500 active:opacity-60 transition-opacity"
          >
            ← Back
          </button>
          <h1 className="flex-1 text-center text-lg">Settings</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="pb-8">
        {/* Group 1: Subscription */}
        <div className="mt-6">
          <div className="px-5 pb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Subscription</p>
          </div>
          
          <div className="bg-black">
            {/* Manage Plan */}
            <button
              onClick={onManagePlan}
              className="w-full px-5 py-4 flex items-center justify-between border-b border-white/5 active:bg-white/5 transition-colors"
            >
              <span className="text-cyan-400">Manage Plan</span>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Restore Purchases */}
            <button
              onClick={onRestorePurchases}
              className="w-full px-5 py-4 flex items-center justify-between active:bg-white/5 transition-colors"
            >
              <span className="text-cyan-400">Restore Purchases</span>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Group 2: Account */}
        <div className="mt-8">
          <div className="px-5 pb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Account</p>
          </div>
          
          <div className="bg-black">
            {/* Notifications with Toggle */}
            <div className="w-full px-5 py-4 flex items-center justify-between border-b border-white/5">
              <span className="text-white">Notifications</span>
              
              {/* Custom Toggle Switch */}
              <button
                onClick={handleToggleNotifications}
                className="relative w-12 h-7 rounded-full transition-colors"
                style={{
                  backgroundColor: notifEnabled ? '#8B5CF6' : '#374151'
                }}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{
                    left: notifEnabled ? '26px' : '4px'
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                />
              </button>
            </div>

            {/* Email */}
            <button
              onClick={onEditEmail}
              className="w-full px-5 py-4 flex items-center justify-between border-b border-white/5 active:bg-white/5 transition-colors"
            >
              <span className="text-white">Email</span>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Password */}
            <button
              onClick={onEditPassword}
              className="w-full px-5 py-4 flex items-center justify-between active:bg-white/5 transition-colors"
            >
              <span className="text-white">Password</span>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Group 3: About */}
        <div className="mt-8">
          <div className="px-5 pb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">About</p>
          </div>
          
          <div className="bg-black">
            {/* View Onboarding */}
            {onViewOnboarding && (
              <button
                onClick={onViewOnboarding}
                className="w-full px-5 py-4 flex items-center justify-between border-b border-white/5 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span className="text-white">View Introduction</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Group 4: Danger Zone */}
        <div className="mt-16">
          <div className="px-5 pb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Danger Zone</p>
          </div>
          
          <div className="bg-black">
            {/* Log Out */}
            <button
              onClick={onLogOut}
              className="w-full px-5 py-4 flex items-center justify-between border-b border-white/5 active:bg-white/5 transition-colors"
            >
              <span className="text-white">Log Out</span>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Delete Account */}
            <button
              onClick={onDeleteAccount}
              className="w-full px-5 py-4 flex items-center justify-between active:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="text-red-500">Delete Account</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
