/**
 * ProgressTimeline Component
 * Displays a vertical timeline of learning progress
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Award } from 'lucide-react';
import { ANIMATION_DURATION } from '../../utils/animationTiming';

export interface DayNode {
  date: Date;
  completed: boolean;
  isMissed: boolean;
  isToday: boolean;
  isMilestone: boolean;
  milestoneDay?: number;
  streakDay: number;
}

interface ProgressTimelineProps {
  days: DayNode[];
  maxDaysToShow?: number;
}

export function ProgressTimeline({ days, maxDaysToShow = 14 }: ProgressTimelineProps) {
  const displayDays = days.slice(-maxDaysToShow);

  return (
    <div className="relative py-4">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-700" />

      {/* Day nodes */}
      <div className="space-y-4">
        {displayDays.map((day, index) => (
          <TimelineNode key={day.date.toISOString()} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

interface TimelineNodeProps {
  day: DayNode;
  index: number;
}

function TimelineNode({ day, index }: TimelineNodeProps) {
  const formatDate = (date: Date): string => {
    if (day.isToday) return 'Today';
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: ANIMATION_DURATION.STANDARD / 1000,
        delay: index * 0.05,
      }}
      className="relative flex items-center gap-4 pl-3"
    >
      {/* Node */}
      <div className="relative z-10">
        {day.isToday ? (
          <TodayNode />
        ) : day.completed ? (
          <CompletedNode isMilestone={day.isMilestone} />
        ) : day.isMissed ? (
          <MissedNode />
        ) : (
          <FutureNode />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            day.isToday ? 'text-white' : 
            day.completed ? 'text-emerald-400' : 
            day.isMissed ? 'text-red-400' : 
            'text-zinc-500'
          }`}>
            {formatDate(day.date)}
          </p>
          {day.completed && (
            <p className="text-xs text-zinc-500">
              Day {day.streakDay}
            </p>
          )}
        </div>

        {/* Milestone badge */}
        {day.isMilestone && day.milestoneDay && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 25,
              delay: index * 0.05 + 0.2,
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-full 
                       bg-gradient-to-r from-amber-500/20 to-orange-500/20 
                       border border-amber-500/30"
          >
            <Award className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">
              {day.milestoneDay} days!
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function TodayNode() {
  return (
    <motion.div
      className="w-6 h-6 rounded-full bg-white flex items-center justify-center
                 shadow-lg shadow-white/20"
      animate={{
        scale: [1, 1.15, 1],
        boxShadow: [
          '0 0 0 0 rgba(255, 255, 255, 0.4)',
          '0 0 0 8px rgba(255, 255, 255, 0)',
          '0 0 0 0 rgba(255, 255, 255, 0.4)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="w-2 h-2 rounded-full bg-zinc-900" />
    </motion.div>
  );
}

function CompletedNode({ isMilestone }: { isMilestone: boolean }) {
  return (
    <motion.div
      className={`w-6 h-6 rounded-full flex items-center justify-center ${
        isMilestone 
          ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
          : 'bg-emerald-500'
      }`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 25,
      }}
    >
      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </motion.div>
  );
}

function MissedNode() {
  return (
    <div className="w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 
                    flex items-center justify-center">
      <X className="w-3 h-3 text-red-500" strokeWidth={3} />
    </div>
  );
}

function FutureNode() {
  return (
    <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-600" />
  );
}

/**
 * Generate timeline data from streak history
 */
export function generateTimelineData(
  currentStreak: number,
  activityDates: Date[],
  daysToShow: number = 14
): DayNode[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nodes: DayNode[] = [];
  const activitySet = new Set(
    activityDates.map(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );
  
  // Generate nodes for the past N days
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const isToday = i === 0;
    const completed = activitySet.has(date.getTime());
    const isMissed = !completed && !isToday;
    
    // Calculate streak day (simplified - in production, use actual streak data)
    const streakDay = completed ? currentStreak - i : 0;
    
    // Check for milestones (every 7 days)
    const isMilestone = completed && streakDay > 0 && streakDay % 7 === 0;
    
    nodes.push({
      date,
      completed,
      isMissed,
      isToday,
      isMilestone,
      milestoneDay: isMilestone ? streakDay : undefined,
      streakDay,
    });
  }
  
  return nodes;
}

export default ProgressTimeline;
