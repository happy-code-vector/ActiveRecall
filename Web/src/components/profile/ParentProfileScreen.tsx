import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Users,
  Shield,
  Settings,
  ChevronRight,
  Flame,
  Trophy,
  LayoutDashboard,
  Crown,
  TrendingUp
} from 'lucide-react';
import { BottomNav } from '../home/BottomNav';
import { StreakData } from '@/context/AppContext';
import { AvatarUploader } from './AvatarUploader';

interface ParentProfileScreenProps {
  onBack: () => void;
  onUpgrade?: () => void;
  onLogout?: () => void;
  onGoToHome?: () => void;
  onGoToProgress?: () => void;
  onGoToHistory?: () => void;
  onGoToTechniques?: () => void;
  onGoToParentDashboard?: () => void;
  onGoToSettings?: () => void;
  onGoToGuardianSettings?: () => void;
  onGoToLeaderboard?: () => void;
  streak?: StreakData;
  userId?: string;
}

export function ParentProfileScreen({ 
  onBack, 
  onUpgrade, 
  onLogout, 
  onGoToHome, 
  onGoToProgress, 
  onGoToHistory, 
  onGoToTechniques, 
  onGoToParentDashboard, 
  onGoToSettings, 
  onGoToGuardianSettings,
  onGoToLeaderboard,
  streak, 
  userId = 'parent-demo-123' 
}: ParentProfileScreenProps) {
  const isPremium = localStorage.getItem('thinkfirst_premium') === 'true';
  const plan = localStorage.getItem('thinkfirst_plan') as 'solo' | 'family' | null;
  const [avatarUrl, setAvatarUrl] = useState<string>(
    localStorage.getItem('thinkfirst_avatar') || ''
  );
  
  // Mock parent/family data
  const familyData = {
    parentName: 'Sarah Johnson',
    initials: 'SJ',
    studentCount: 2,
    familyStreak: 15,
    totalUnlocks: 127,
    weeklyActivity: 'High',
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-28" style={{ background: '#000000' }}>
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[128px] opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-normal filter blur-[128px] opacity-10" />

      <div className="relative z-10">
        {/* PARENT PROFILE Header Badge */}
        <motion.div
          className="px-6 pt-6 pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="rounded-[16px] px-4 py-2 text-center backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(34, 211, 238, 0.25) 100%)',
              border: '2px solid rgba(139, 92, 246, 0.5)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
              <span
                className="text-white tracking-wider"
                style={{ fontWeight: 800, fontSize: '15px' }}
              >
                PARENT PROFILE
              </span>
              <Shield className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        {/* Header with Avatar */}
        <div className="px-6 pt-6 pb-8">
          <div className="flex flex-col items-center">
            {/* Parent Avatar with Upload - Different from student */}
            <AvatarUploader currentAvatar={avatarUrl} onUpdate={setAvatarUrl}>
              <motion.div
                className="relative mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              >
                {/* Avatar Circle with Shield Border */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden" style={{ padding: '6px' }}>
                  {/* Outer border with shield gradient */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
                      padding: '3px',
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-full"
                      style={{ background: '#000000' }}
                    />
                  </div>
                  
                  {/* Avatar Content */}
                  <div 
                    className="relative w-full h-full rounded-full flex items-center justify-center z-10 overflow-hidden"
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

                {/* Family Plan Badge */}
                {plan === 'family' && (
                  <motion.div
                    className="absolute bottom-0 right-10"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #FFBF00, #FFA000)',
                        border: '3px solid #000000',
                        boxShadow: '0 0 20px rgba(255, 191, 0, 0.6)',
                      }}
                    >
                      <Crown className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AvatarUploader>

            {/* Parent Name */}
            <motion.h1
              className="text-white text-2xl mb-1"
              style={{ fontWeight: 700 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {familyData.parentName}
            </motion.h1>
            
            {/* Parent Badge */}
            <motion.div
              className="px-3 py-1 rounded-full text-xs"
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#A78BFA',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Parent Account
            </motion.div>
          </div>
        </div>

        {/* Family Stats Row */}
        <div className="px-6 mb-8">
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Students Card */}
            <div
              className="rounded-[16px] p-4 text-center backdrop-blur-xl"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-white text-xl mb-1" style={{ fontWeight: 700 }}>
                {familyData.studentCount}
              </div>
              <div className="text-gray-500 text-[11px]">Students</div>
            </div>

            {/* Family Streak Card */}
            <div
              className="rounded-[16px] p-4 text-center backdrop-blur-xl"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <div className="text-white text-xl" style={{ fontWeight: 700 }}>
                  {familyData.familyStreak}
                </div>
              </div>
              <div className="text-gray-500 text-[11px]">Fam Streak</div>
            </div>

            {/* Total Unlocks Card */}
            <div
              className="rounded-[16px] p-4 text-center backdrop-blur-xl"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-white text-xl mb-1" style={{ fontWeight: 700 }}>
                {familyData.totalUnlocks}
              </div>
              <div className="text-gray-500 text-[11px]">Total Unlocks</div>
            </div>
          </motion.div>
        </div>

        {/* Family Plan Card */}
        {plan === 'family' && (
          <div className="px-6 mb-6">
            <motion.div
              className="rounded-[20px] overflow-hidden backdrop-blur-xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(34, 211, 238, 0.15) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #FFBF00, #FFA000)',
                    }}
                  >
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white mb-1" style={{ fontWeight: 600 }}>
                      Family Plan Active
                    </div>
                    <div className="text-gray-400 text-sm">
                      Unlimited learning for your family
                    </div>
                  </div>
                </div>
                <button
                  onClick={onUpgrade}
                  className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Manage
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Menu List - Parent Focused */}
        <div className="px-6">
          <motion.div
            className="rounded-[24px] overflow-hidden backdrop-blur-xl"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Item 1: Parent Dashboard */}
            <MenuItem
              icon={LayoutDashboard}
              label="Parent Dashboard"
              sublabel="View student progress"
              onClick={() => {
                if (onGoToParentDashboard) {
                  onGoToParentDashboard();
                } else {
                  console.warn('Parent Dashboard navigation not configured');
                }
              }}
            />

            {/* Item 2: Guardian Controls */}
            <MenuItem
              icon={Shield}
              label="Guardian Controls"
              sublabel="Manage learning settings"
              onClick={() => {
                if (onGoToGuardianSettings) {
                  onGoToGuardianSettings();
                } else {
                  console.warn('Guardian Settings navigation not configured');
                }
              }}
              hasBorder
            />

            {/* Item 3: Family Leaderboard */}
            <MenuItem
              icon={Trophy}
              label="Family Leaderboard"
              sublabel="See family rankings"
              onClick={() => {
                if (onGoToLeaderboard) {
                  onGoToLeaderboard();
                } else {
                  console.warn('Leaderboard navigation not configured');
                }
              }}
              hasBorder
            />

            {/* Item 4: Settings */}
            <MenuItem
              icon={Settings}
              label="Settings"
              sublabel="Account & preferences"
              onClick={() => {
                if (onGoToSettings) {
                  onGoToSettings();
                } else {
                  console.warn('Settings navigation not configured');
                }
              }}
              hasBorder
            />
          </motion.div>
        </div>

        {/* Bottom App Version */}
        <motion.div
          className="text-center mt-8 px-6 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.7 }}
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
          isParent={true}
        />
      )}
    </div>
  );
}

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  onClick: () => void;
  hasBorder?: boolean;
}

function MenuItem({ icon: Icon, label, sublabel, onClick, hasBorder }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white hover:bg-opacity-[0.02] active:bg-opacity-[0.05] transition-all ${
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
      <div className="flex-1 text-left">
        <div className="text-white text-[15px]" style={{ fontWeight: 500 }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-gray-500 text-xs mt-0.5">
            {sublabel}
          </div>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight className="w-5 h-5 text-gray-600" />
    </button>
  );
}