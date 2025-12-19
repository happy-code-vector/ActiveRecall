"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LimitReachedModal } from './LimitReachedModal';
import { UpgradePrompt } from '@/components/pricing/UpgradePrompt';
import { BadgeUnlockModal } from '@/components/badges/BadgeUnlockModal';
import { NudgeNotificationBanner } from './NudgeNotificationBanner';
import { getQuestionsRemaining } from '@/utils/subscription';

export function GlobalModals() {
  const router = useRouter();
  const {
    showLimitModal,
    setShowLimitModal,
    dailyUnlockCount,
    upgradePromptFeature,
    setUpgradePromptFeature,
    showBadgeModal,
    setShowBadgeModal,
    newlyUnlockedBadges,
    currentBadgeIndex,
    setCurrentBadgeIndex,
    nudgeNotifications,
    setNudgeNotifications,
  } = useApp();

  const handleDismissNotification = (id: string) => {
    const updated = nudgeNotifications.filter(n => n.id !== id);
    setNudgeNotifications(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thinkfirst_nudgeNotifications', JSON.stringify(updated));
    }
  };

  return (
    <>
      <NudgeNotificationBanner 
        notifications={nudgeNotifications}
        onDismiss={handleDismissNotification}
      />

      {showLimitModal && (
        <LimitReachedModal
          isOpen={showLimitModal}
          currentCount={dailyUnlockCount}
          maxCount={5}
          onUpgrade={() => {
            setShowLimitModal(false);
            router.push('/pricing');
          }}
          onClose={() => setShowLimitModal(false)}
        />
      )}

      {upgradePromptFeature && (
        <UpgradePrompt
          feature={upgradePromptFeature}
          onUpgrade={() => {
            setUpgradePromptFeature(null);
            router.push('/pricing');
          }}
          onClose={() => setUpgradePromptFeature(null)}
          questionsRemaining={getQuestionsRemaining()}
        />
      )}

      {showBadgeModal && (
        <BadgeUnlockModal
          isOpen={showBadgeModal}
          badges={newlyUnlockedBadges}
          currentBadgeIndex={currentBadgeIndex}
          onClose={() => setShowBadgeModal(false)}
          onNext={() => {
            if (currentBadgeIndex < newlyUnlockedBadges.length - 1) {
              setCurrentBadgeIndex(currentBadgeIndex + 1);
            } else {
              setShowBadgeModal(false);
            }
          }}
        />
      )}
    </>
  );
}
