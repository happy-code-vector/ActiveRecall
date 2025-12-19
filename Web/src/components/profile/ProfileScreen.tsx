import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Star,
  Clock,
  Shield,
  Settings,
  ChevronRight,
  Flame,
  Lock,
  Award,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { BottomNav } from '../home/BottomNav';
import { StreakData } from '@/context/AppContext';
import { AvatarUploader } from './AvatarUploader';

interface ProfileScreenProps {
  onBack: () => void;
  onUpgrade?: () => void;
  onLogout?: () => void;
  onShowAnimations?: () => void;
  onGoToHome?: () => void;
  onGoToProgress?: () => void;
  onGoToHistory?: () => void;
  onGoToTechniques?: () => void;
  onGoToParentDashboard?: () => void;
  onGoToSettings?: () => void;
  onGoToGuardianSettings?: () => void;
  onConnectParent?: () => void;
  onShowBadges?: () => void;
  streak?: StreakData;
  userId?: string;
}

export function ProfileScreen({ 
  onBack, 
  onUpgrade, 
  onLogout, 
  onShowAnimations, 
  onGoToHome, 
  onGoToProgress, 
  onGoToHistory, 
  onGoToTechniques, 
  onGoToParentDashboard, 
  onGoToSettings, 
  onGoToGuardianSettings, 
  onConnectParent, 
  onShowBadges, 
  streak, 
  userId = 'user-demo-123' 
}: ProfileScreenProps) {
  const [userType, setUserType] = useState<'student' | 'parent' | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState<'solo' | 'family' | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserType(localStorage.getItem('thinkfirst_userType') as 'student' | 'parent' | null);
      setIsPremium(localStorage.getItem('thinkfirst_premium') === 'true');
      setPlan(localStorage.getItem('thinkfirst_plan') as 'solo' | 'family' | null);
      setAvatarUrl(localStorage.getItem('thinkfirst_avatar') || '');
    }
  }, []);
  
  // Mock user data
  const userData = {
    name: 'Alex S.',
    initials: 'AS',
    streak: 12,
    unlocks: 45,
    avgEffort: 'High',
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-28" style={{ background: '#000000' }}>
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[128px] opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-normal filter blur-[128px] opacity-10" />

      <div className="relative z-10">
        {/* STUDENT PROFILE Header Badge */}
        <motion.div
          className="px-6 pt-6 pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="rounded-[16px] px-4 py-2 text-center backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
              border: '2px solid rgba(34, 211, 238, 0.5)',
              boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" strokeWidth={2.5} />
              <span
                className="text-white tracking-wider"
                style={{ fontWeight: 800, fontSize: '15px' }}
              >
                STUDENT PROFILE
              </span>
              <GraduationCap className="w-5 h-5 text-cyan-400" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        {/* Header with Avatar and Progress Ring */}
        <div className="px-6 pt-6 pb-8">
          <div className="flex flex-col items-center">
            {/* Avatar with Glowing Progress Ring and Upload */}
            <AvatarUploader currentAvatar={avatarUrl} onUpdate={setAvatarUrl}>
              <motion.div
                className="relative mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              >
                {/* Progress Ring - Outer glow */}
                <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#22D3EE" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Background circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* Progress circle - 75% complete */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="url(#progressGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={364}
                    strokeDashoffset={364 * 0.25}
                    filter="url(#glow)"
                    initial={{ strokeDashoffset: 364 }}
                    animate={{ strokeDashoffset: 364 * 0.25 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
                  />
                </svg>

                {/* Avatar Circle */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden" style={{ padding: '6px' }}>
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    }}
                  >
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-14 h-14 text-white" strokeWidth={2} />
                    )}
                  </div>
                </div>

                {/* Streak Flame Badge - Attached to avatar */}
                <motion.div
                  className="absolute bottom-0 right-10"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #F97316, #FB923C)',
                      border: '3px solid #000000',
                      boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)',
                    }}
                  >
                    <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
              </motion.div>
            </AvatarUploader>

            {/* User Name */}
            <motion.h1
              className="text-white text-2xl mb-1"
              style={{ fontWeight: 700 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {userData.name}
            </motion.h1>
          </div>
        </div>

        {/* Stats Row - Three Horizontal Glass Cards */}
        <div className="px-6 mb-8">
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Streak Card */}
            <div
              className="rounded-[16px] p-4 text-center backdrop-blur-xl"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-white text-xl mb-1" style={{ fontWeight: 700 }}>
                {userData.streak}
              </div>
              <div className="text-gray-500 text-[11px]">Streak</div>
            </div>

            {/* Unlocks Card */}
            <div
              className="rounded-[16px] p-4 text-center backdrop-blur-xl"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-white text-xl mb-1" style={{ fontWeight: 700 }}>
                {userData.unlocks}
              </div>
              <div className="text-gray-500 text-[11px]">Unlocks</div>
            </div>

            {/* Avg Effort Card */}
            <div
              className="rounded-[16px] p-4 text-center backdrop-blur-xl"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-white text-xl mb-1" style={{ fontWeight: 700 }}>
                {userData.avgEffort}
              </div>
              <div className="text-gray-500 text-[11px]">Avg Effort</div>
            </div>
          </motion.div>
        </div>

        {/* Menu List - Vertical */}
        <div className="px-6">
          <motion.div
            className="rounded-[24px] overflow-hidden backdrop-blur-xl"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Item 1: My Badges */}
            <MenuItem
              icon={Star}
              label="My Badges"
              onClick={() => {
                if (onShowBadges) {
                  console.log('ProfileScreen: Navigating to badges');
                  onShowBadges();
                } else {
                  console.warn('ProfileScreen: onShowBadges not provided');
                }
              }}
            />

            {/* Item 2: Learning History */}
            <MenuItem
              icon={Clock}
              label="Learning History"
              onClick={onGoToHistory || (() => console.log('Learning History'))}
              hasBorder
            />

            {/* Item 4: Settings */}
            <MenuItem
              icon={Settings}
              label="Settings"
              onClick={onGoToSettings || (() => console.log('Settings'))}
              hasBorder
            />
          </motion.div>
        </div>

        {/* Bottom App Version */}
        <motion.div
          className="text-center mt-8 px-6 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white text-xs">ThinkFirst v1.0</p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      {onGoToHome && (
        <BottomNav
          currentTab="profile"
          onGoToHome={onGoToHome}
          onGoToProgress={onGoToProgress}
          onGoToHistory={onGoToHistory}
          onGoToTechniques={onGoToTechniques}
          onGoToParentDashboard={onGoToParentDashboard}
          streak={streak}
          isParent={userType === 'parent'}
        />
      )}
    </div>
  );
}

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  hasBorder?: boolean;
  locked?: boolean;
}

function MenuItem({ icon: Icon, label, onClick, hasBorder, locked }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white hover:bg-opacity-[0.01] active:bg-opacity-[0.03] transition-all ${
        hasBorder ? 'border-t border-white border-opacity-10' : ''
      }`}
    >
      {/* Icon Container */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <Icon className="w-5 h-5 text-gray-400" strokeWidth={2} />
      </div>

      {/* Label */}
      <span className="flex-1 text-left text-white text-[15px]" style={{ fontWeight: 500 }}>
        {label}
      </span>

      {/* Right Side - Lock icon or Chevron */}
      {locked ? (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}