import { motion } from 'motion/react';
import { CheckCircle2, Bell } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  completedToday: boolean;
  isYou?: boolean;
}

interface FamilySquadStreakCardProps {
  streakDays: number;
  members: FamilyMember[];
  onNudge?: (memberId: string) => void;
}

export function FamilySquadStreakCard({ 
  streakDays, 
  members,
  onNudge 
}: FamilySquadStreakCardProps) {
  const waitingMembers = members.filter(m => !m.completedToday);
  const completedCount = members.filter(m => m.completedToday).length;
  
  // Find the first waiting member for the subtext
  const firstWaiting = waitingMembers[0];

  return (
    <motion.div
      className="relative rounded-[24px] p-5 overflow-hidden"
      style={{
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 191, 0, 0.2)',
        boxShadow: '0 0 40px rgba(255, 191, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Ambient Golden Glow - Top Right */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 191, 0, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-white text-lg" style={{ fontWeight: 700 }}>
          Family Squad Streak
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFBF00]/10 border border-[#FFBF00]/20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFBF00] animate-pulse" />
          <span className="text-[#FFBF00] text-xs" style={{ fontWeight: 600 }}>
            {completedCount}/{members.length}
          </span>
        </div>
      </div>

      {/* Avatars Row */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        {members.map((member, index) => (
          <div key={member.id} className="relative flex flex-col items-center gap-2">
            {/* Avatar Circle */}
            <motion.div
              className="relative w-14 h-14 rounded-full overflow-hidden"
              style={{
                border: member.completedToday
                  ? '2.5px solid #10B981'
                  : '2.5px solid rgba(255, 255, 255, 0.1)',
                boxShadow: member.completedToday
                  ? '0 0 20px rgba(16, 185, 129, 0.4)'
                  : 'none',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: member.completedToday ? 1 : 0.5,
                scale: 1,
              }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {/* Avatar Image */}
              <div 
                className="w-full h-full bg-gradient-to-br flex items-center justify-center text-white text-lg"
                style={{
                  background: member.completedToday
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : 'linear-gradient(135deg, #6B7280, #4B5563)',
                  fontWeight: 700,
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>

              {/* Waiting Pulse Animation */}
              {!member.completedToday && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gray-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>

            {/* Checkmark Badge */}
            {member.completedToday && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#10B981] border-2 border-[#0A0A0A] flex items-center justify-center"
                style={{
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 500, damping: 15 }}
              >
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
            )}

            {/* Name Label */}
            <div className="whitespace-nowrap">
              <span 
                className="text-xs"
                style={{ 
                  color: member.isYou ? '#FFBF00' : member.completedToday ? '#10B981' : '#6B7280',
                  fontWeight: member.isYou ? 600 : 500,
                }}
              >
                {member.isYou ? 'You' : member.name}
              </span>
            </div>

            {/* Nudge Button - Below Avatar and Name */}
            {!member.completedToday && !member.isYou && onNudge && (
              <motion.button
                onClick={() => onNudge(member.id)}
                className="w-8 h-8 rounded-full bg-[#FFBF00]/20 border border-[#FFBF00]/40 flex items-center justify-center hover:bg-[#FFBF00]/30 active:bg-[#FFBF00]/40 transition-colors"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Bell className="w-4 h-4 text-[#FFBF00]" />
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* Spacer for labels */}
      <div className="h-2" />

      {/* Main Stat - Streak Days */}
      <div className="text-center mb-3 relative z-10">
        <motion.div
          className="text-5xl mb-1"
          style={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFBF00, #FF8C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(255, 191, 0, 0.4))',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
        >
          {streakDays} Days
        </motion.div>
        <p className="text-gray-500 text-xs" style={{ fontWeight: 500 }}>
          Family Squad Streak
        </p>
      </div>

      {/* Subtext - Waiting Member */}
      {firstWaiting && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-[rgba(255,191,0,0.08)] backdrop-blur-sm rounded-[14px] border border-[#FFBF00]/20 p-3 text-center">
            <p className="text-gray-300 text-xs leading-relaxed">
              <span className="text-[#FFBF00]" style={{ fontWeight: 600 }}>
                {firstWaiting.name}
              </span>{' '}
              needs to unlock{' '}
              <span className="text-white" style={{ fontWeight: 600 }}>
                1 answer
              </span>{' '}
              to keep the streak alive!
            </p>
          </div>
        </motion.div>
      )}

      {/* All Complete State */}
      {waitingMembers.length === 0 && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-[rgba(16,185,129,0.08)] backdrop-blur-sm rounded-[14px] border border-[#10B981]/20 p-3 text-center">
            <p className="text-gray-300 text-xs leading-relaxed">
              🎉{' '}
              <span className="text-[#10B981]" style={{ fontWeight: 600 }}>
                Everyone completed today!
              </span>{' '}
              Squad streak secured.
            </p>
          </div>
        </motion.div>
      )}

      {/* Decorative Golden Sparkle */}
      <motion.div
        className="absolute top-6 right-6 w-2 h-2 rounded-full bg-[#FFBF00]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}