import { useState, useEffect } from 'react';
// Onboarding
import { SplashScreen } from './components/onboarding/SplashScreen';
import { GradeSelectionScreen } from './components/onboarding/GradeSelectionScreen';
import { GoalSelectionScreen } from './components/onboarding/GoalSelectionScreen';
import { MethodologyScreen } from './components/onboarding/MethodologyScreen';
import { TryItScreen } from './components/onboarding/TryItScreen';
import { NotificationPermissionScreen } from './components/onboarding/NotificationPermissionScreen';
// Auth
import { AccountTypeScreen } from './components/auth/AccountTypeScreen';
import { UserTypeScreen } from './components/auth/UserTypeScreen';
import { LoginScreen } from './components/auth/LoginScreen';
// Home
import { HomeScreen } from './components/home/HomeScreen';
// Learning
import { AttemptGate } from './components/learning/AttemptGate';
import { EvaluationScreen } from './components/learning/EvaluationScreen';
import { AnswerScreen } from './components/learning/AnswerScreen';
import { TechniquesScreen } from './components/learning/TechniquesScreen';
// Progress
import { ProgressScreen } from './components/progress/ProgressScreen';
import { HistoryScreen } from './components/progress/HistoryScreen';
// Pricing
import { PricingScreen } from './components/pricing/PricingScreen';
import { UpgradePrompt } from './components/pricing/UpgradePrompt';
// Family
import { ParentPlanDetails } from './components/family/ParentPlanDetails';
import { ParentDashboard } from './components/family/ParentDashboard';
import { GuardianSettings } from './components/family/GuardianSettings';
import { AddStudentScreen } from './components/family/AddStudentScreen';
import { FamilyLeaderboard } from './components/family/FamilyLeaderboard';
// Profile
import { ProfileScreen } from './components/profile/ProfileScreen';
import { ParentProfileScreen } from './components/profile/ParentProfileScreen';
import { SettingsScreen } from './components/profile/SettingsScreen';
import { ConnectParentScreen } from './components/profile/ConnectParentScreen';
// Badges
import { BadgesScreen } from './components/badges/BadgesScreen';
import { BadgeUnlockModal } from './components/badges/BadgeUnlockModal';
// Shared
import { LimitReachedModal } from './components/shared/LimitReachedModal';
import { AnimationShowcase } from './components/shared/AnimationShowcase';
import { DifficultyFrictionDemo } from './components/shared/DifficultyFrictionDemo';
import { WeeklyReportPreview } from './components/shared/WeeklyReportPreview';
import { NudgeNotificationBanner } from './components/shared/NudgeNotificationBanner';
// Utils
import { projectId, publicAnonKey } from './utils/supabase/info';
import { getSubscriptionStatus, incrementQuestionCount, getQuestionsRemaining } from './utils/subscription';
import { 
  getStreakFreezeState, 
  consumeFreeze, 
  grantMonthlyFreezes, 
  wasDayMissed,
  saveStreakFreezeState,
  type StreakFreezeState 
} from './utils/streakFreeze';


export type Screen = 'splash' | 'accountType' | 'userType' | 'gradeSelection' | 'goalSelection' | 'methodology' | 'tryIt' | 'notification' | 'home' | 'pricing' | 'parentPlanDetails' | 'parentDashboard' | 'guardianSettings' | 'attempt' | 'evaluation' | 'answer' | 'progress' | 'history' | 'profile' | 'techniques' | 'animations' | 'login' | 'settings' | 'connectParent' | 'addStudent' | 'frictionDemo' | 'weeklyReport' | 'leaderboard' | 'badges';

export interface Evaluation {
  effort_score: number;
  understanding_score: number;
  copied: boolean;
  what_is_right: string;
  what_is_missing: string;
  coach_hint?: string;
  level_up_tip?: string;
  unlock: boolean;
  full_explanation: string;
}

export interface StreakData {
  count: number;
  lastDate: string | null;
  freezeUsedToday?: boolean;
}

export interface NudgeNotification {
  id: string;
  fromName: string;
  timestamp: number;
}

// Helper to safely access localStorage (SSR-safe)
const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

// Check if onboarding has been completed
const hasCompletedOnboarding = (): boolean => {
  return getLocalStorage('thinkfirst_onboardingComplete') === 'true';
};

// Mark onboarding as complete
const markOnboardingComplete = (): void => {
  setLocalStorage('thinkfirst_onboardingComplete', 'true');
};

export default function App() {
  // Always start with 'splash' to avoid hydration mismatch, then update in useEffect
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userType, setUserType] = useState<'student' | 'parent' | null>(null);
  const [question, setQuestion] = useState('');
  const [attempt, setAttempt] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastDate: null });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [dailyUnlockCount, setDailyUnlockCount] = useState(0);
  const [userId, setUserId] = useState('');
  const [upgradePromptFeature, setUpgradePromptFeature] = useState<'voice' | 'mastery' | 'coach' | 'badges' | 'stats' | 'questions' | null>(null);
  const [nudgeNotifications, setNudgeNotifications] = useState<NudgeNotification[]>([]);
  const [_isHydrated, setIsHydrated] = useState(false);
  const [_streakFreezeState, setStreakFreezeState] = useState<StreakFreezeState | null>(null);
  const [isViewingOnboarding, setIsViewingOnboarding] = useState(false);

  // Hydrate state from localStorage on client
  useEffect(() => {
    // Check onboarding status and set initial screen
    if (hasCompletedOnboarding()) {
      setCurrentScreen('home');
    }

    // User type
    const storedUserType = getLocalStorage('thinkfirst_userType');
    if (storedUserType) {
      setUserType(storedUserType as 'student' | 'parent');
    }

    // Daily unlock count
    const storedUnlocks = getLocalStorage('thinkfirst_dailyUnlocks');
    if (storedUnlocks) {
      const data = JSON.parse(storedUnlocks);
      const today = new Date().toDateString();
      if (data.date === today) {
        setDailyUnlockCount(data.count || 0);
      }
    }

    // User ID
    let storedUserId = getLocalStorage('thinkfirst_userId');
    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      setLocalStorage('thinkfirst_userId', storedUserId);
    }
    setUserId(storedUserId);

    // Nudge notifications
    const storedNotifications = getLocalStorage('thinkfirst_nudgeNotifications');
    if (storedNotifications) {
      setNudgeNotifications(JSON.parse(storedNotifications));
    }

    // Load streak freeze state
    const freezeState = getStreakFreezeState();
    setStreakFreezeState(freezeState);
    
    // Check if we need to grant monthly freezes (first of month)
    const today = new Date();
    const lastGrantDate = getLocalStorage('thinkfirst_lastFreezeGrant');
    const lastGrantMonth = lastGrantDate ? new Date(lastGrantDate).getMonth() : -1;
    
    if (lastGrantMonth !== today.getMonth()) {
      const isPremium = getLocalStorage('thinkfirst_premium') === 'true';
      const plan = getLocalStorage('thinkfirst_plan') as 'solo' | 'family' | null;
      const planType = isPremium ? (plan || 'solo') : 'free';
      const updatedState = grantMonthlyFreezes(freezeState, planType);
      setStreakFreezeState(updatedState);
      saveStreakFreezeState(updatedState);
      setLocalStorage('thinkfirst_lastFreezeGrant', today.toISOString());
    }

    setIsHydrated(true);
  }, []);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<string[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Load streak on mount
  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0e3c496/streak/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        
        // Check if streak should be reset (missed a day)
        if (data.lastDate) {
          const lastDate = new Date(data.lastDate);
          const now = new Date();
          
          if (wasDayMissed(lastDate, now)) {
            // Check if we can use a freeze
            const currentFreezeState = getStreakFreezeState();
            if (currentFreezeState && currentFreezeState.personalFreezes > 0) {
              // Use a freeze to save the streak
              const result = consumeFreeze(currentFreezeState);
              if (result.success) {
                setStreakFreezeState(result.newState);
                saveStreakFreezeState(result.newState);
                
                // Mark that freeze was used today
                setStreak({ ...data, freezeUsedToday: true });
                console.log('Streak saved with freeze! Remaining:', result.newState.personalFreezes);
              } else {
                // No freeze available, streak resets
                setStreak({ count: 0, lastDate: null });
                console.log('Streak reset - no freeze available');
              }
            } else {
              // No freeze available, streak resets
              setStreak({ count: 0, lastDate: null });
              console.log('Streak reset - no freeze available');
            }
          } else {
            setStreak(data);
          }
        } else {
          setStreak(data);
        }
      }
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };


  const startNewQuestion = (q: string) => {
    // Check if user has reached daily question limit
    const status = getSubscriptionStatus();
    
    if (!status.canAskQuestions) {
      // Show upgrade prompt for questions limit
      setUpgradePromptFeature('questions');
      return;
    }
    
    // Increment question count for free users
    if (!status.isPremium) {
      incrementQuestionCount();
    }
    
    setQuestion(q);
    setAttempt('');
    setEvaluation(null);
    setIsRevisionMode(false);
    setCurrentScreen('attempt');
  };

  const submitAttempt = async (userAttempt: string, masteryMode: boolean = false) => {
    setAttempt(userAttempt);
    setCurrentScreen('evaluation');

    // Get grade level for personalized evaluation
    const gradeLevel = localStorage.getItem('thinkfirst_userGrade') || 'college';

    // Call AI evaluation
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0e3c496/evaluate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            attempt: userAttempt,
            userId,
            masteryMode,
            gradeLevel,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Evaluation failed';
        console.error('Evaluation API error:', response.status, errorMessage);
        throw new Error(errorMessage);
      }

      const evalData = await response.json();
      
      if (evalData.error) {
        console.error('Evaluation returned error:', evalData.error);
        throw new Error(evalData.error);
      }
      
      setEvaluation(evalData);

      // Reload streak if unlocked
      if (evalData.unlock) {
        await loadStreak();
        
        // Check for new badges after successful unlock
        try {
          const badgeResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-a0e3c496/badges/${userId}/check`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (badgeResponse.ok) {
            const badgeData = await badgeResponse.json();
            console.log('Badge check response:', badgeData);
            
            if (badgeData.newBadges && badgeData.newBadges.length > 0) {
              setNewlyUnlockedBadges(badgeData.newBadges);
              setCurrentBadgeIndex(0);
              setShowBadgeModal(true);
            }
          }
        } catch (badgeError) {
          console.error('Error checking badges:', badgeError);
        }
      }
    } catch (error) {
      console.error('Error evaluating attempt:', error);
      
      let errorMessage = 'We encountered an error evaluating your attempt.';
      let errorDetail = 'Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('OPENAI_API_KEY')) {
          errorMessage = 'OpenAI API key is not configured.';
          errorDetail = 'Please add your OPENAI_API_KEY to Supabase secrets in the dashboard.';
        } else if (error.message.includes('AI evaluation failed')) {
          errorMessage = 'The AI evaluation service encountered an error.';
          errorDetail = error.message;
        } else {
          errorDetail = error.message;
        }
      }
      
      setEvaluation({
        effort_score: 0,
        understanding_score: 0,
        copied: false,
        what_is_right: errorMessage,
        what_is_missing: errorDetail,
        unlock: false,
        full_explanation: '',
      });
    }
  };

  const unlockAnswer = () => {
    if (!localStorage.getItem('thinkfirst_premium') && dailyUnlockCount >= 5) {
      setShowLimitModal(true);
      return;
    }

    setDailyUnlockCount(prevCount => {
      const newCount = prevCount + 1;
      localStorage.setItem('thinkfirst_dailyUnlocks', JSON.stringify({
        date: new Date().toDateString(),
        count: newCount,
      }));
      return newCount;
    });

    setCurrentScreen('answer');
  };

  const goToProfile = () => setCurrentScreen('profile');
  const goHome = () => setCurrentScreen('home');
  const goToPricing = () => setCurrentScreen('pricing');
  const goToProgress = () => setCurrentScreen('progress');
  const goToHistory = () => setCurrentScreen('history');
  const goToTechniques = () => setCurrentScreen('techniques');
  const goToSettings = () => setCurrentScreen('settings');
  const goToParentDashboard = () => setCurrentScreen('parentDashboard');
  const goToGuardianSettings = () => setCurrentScreen('guardianSettings');
  const goToBadges = () => setCurrentScreen('badges');

  const handleGetStarted = () => setCurrentScreen('accountType');

  const handleAccountTypeSelect = (type: 'student' | 'parent') => {
    setUserType(type);
    localStorage.setItem('thinkfirst_userType', type);
    if (type === 'student') {
      setCurrentScreen('gradeSelection');
    } else {
      setCurrentScreen('goalSelection');
    }
  };

  const handleUserTypeSelect = (type: 'student' | 'parent') => {
    setUserType(type);
    localStorage.setItem('thinkfirst_userType', type);
    setCurrentScreen('gradeSelection');
  };

  const handleGradeSelect = (grade: string) => {
    localStorage.setItem('thinkfirst_userGrade', grade);
    setCurrentScreen('goalSelection');
  };

  const handleGoalSelect = (goal: string) => {
    localStorage.setItem('thinkfirst_userGoal', goal);
    setCurrentScreen('methodology');
  };

  const handleMethodologyComplete = () => setCurrentScreen('tryIt');
  const handleTryItComplete = () => setCurrentScreen('notification');

  const handleNotificationEnable = () => {
    localStorage.setItem('thinkfirst_notificationEnabled', 'true');
    // If viewing onboarding from settings, go back to home instead of login
    if (isViewingOnboarding) {
      setIsViewingOnboarding(false);
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleNotificationSkip = () => {
    localStorage.setItem('thinkfirst_notificationEnabled', 'false');
    // If viewing onboarding from settings, go back to home instead of login
    if (isViewingOnboarding) {
      setIsViewingOnboarding(false);
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleStartTrial = (plan: 'solo' | 'family') => {
    localStorage.setItem('thinkfirst_premium', 'true');
    localStorage.setItem('thinkfirst_plan', plan);
    setCurrentScreen('home');
  };

  const handleStayFree = () => setCurrentScreen('home');

  const handleCreateFamilyAccount = () => {
    localStorage.setItem('thinkfirst_premium', 'true');
    localStorage.setItem('thinkfirst_plan', 'family');
    setCurrentScreen('home');
  };

  const handleLogin = () => setCurrentScreen('login');

  const handleLoginSubmit = (_email: string, _password: string) => {
    // Mark onboarding as complete when user logs in
    if (!isViewingOnboarding) {
      markOnboardingComplete();
    }
    setIsViewingOnboarding(false);
    setCurrentScreen('home');
  };

  const handleSocialLogin = (_provider: 'apple' | 'google') => {
    // Mark onboarding as complete when user logs in
    if (!isViewingOnboarding) {
      markOnboardingComplete();
    }
    setIsViewingOnboarding(false);
    setCurrentScreen('home');
  };

  // Handler to view onboarding from settings
  const handleViewOnboarding = () => {
    setIsViewingOnboarding(true);
    setCurrentScreen('splash');
  };

  // Handler for completing onboarding when viewing from settings
  const handleOnboardingComplete = () => {
    setIsViewingOnboarding(false);
    setCurrentScreen('home');
  };

  const handleRestorePurchases = () => {
    console.log('Restore purchases requested');
  };

  const handleToggleNotifications = (enabled: boolean) => {
    localStorage.setItem('thinkfirst_notificationEnabled', enabled.toString());
  };

  const handleEditEmail = () => console.log('Edit email requested');
  const handleEditPassword = () => console.log('Edit password requested');

  const handleLogOut = () => {
    setUserType(null);
    localStorage.removeItem('thinkfirst_userType');
    setCurrentScreen('splash');
  };

  const handleDeleteAccount = () => console.log('Delete account requested');
  const handleAddStudent = () => setCurrentScreen('addStudent');

  const handleNudgeMember = (_memberId: string, _memberName: string) => {
    const currentUserName = "You";
    const newNotification: NudgeNotification = {
      id: crypto.randomUUID(),
      fromName: currentUserName,
      timestamp: Date.now(),
    };
    const updatedNotifications = [...nudgeNotifications, newNotification];
    setNudgeNotifications(updatedNotifications);
    localStorage.setItem('thinkfirst_nudgeNotifications', JSON.stringify(updatedNotifications));
  };

  const handleDismissNotification = (id: string) => {
    const updatedNotifications = nudgeNotifications.filter(n => n.id !== id);
    setNudgeNotifications(updatedNotifications);
    localStorage.setItem('thinkfirst_nudgeNotifications', JSON.stringify(updatedNotifications));
  };


  return (
    <div className="min-h-screen bg-[#121212] max-w-[480px] mx-auto relative">
      <NudgeNotificationBanner 
        notifications={nudgeNotifications}
        onDismiss={handleDismissNotification}
      />

      {currentScreen === 'splash' && (
        <SplashScreen onGetStarted={handleGetStarted} />
      )}

      {currentScreen === 'accountType' && (
        <AccountTypeScreen onSelect={handleAccountTypeSelect} />
      )}

      {currentScreen === 'userType' && (
        <UserTypeScreen onSelect={handleUserTypeSelect} />
      )}

      {currentScreen === 'gradeSelection' && (
        <GradeSelectionScreen
          onSelect={handleGradeSelect}
          userType={userType || 'student'}
        />
      )}

      {currentScreen === 'goalSelection' && (
        <GoalSelectionScreen
          onComplete={handleGoalSelect}
          userType={userType || 'student'}
        />
      )}

      {currentScreen === 'methodology' && (
        <MethodologyScreen onComplete={handleMethodologyComplete} />
      )}

      {currentScreen === 'tryIt' && (
        <TryItScreen onComplete={handleTryItComplete} />
      )}

      {currentScreen === 'notification' && (
        <NotificationPermissionScreen
          onEnable={handleNotificationEnable}
          onSkip={handleNotificationSkip}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onStartQuestion={startNewQuestion}
          onGoToProgress={goToProgress}
          onGoToHistory={goToHistory}
          onGoToPricing={goToPricing}
          onGoToParentDashboard={goToParentDashboard}
          streak={streak}
          onGoToProfile={goToProfile}
          onGoToTechniques={goToTechniques}
          onLogin={handleLogin}
          onNudgeMember={handleNudgeMember}
        />
      )}

      {currentScreen === 'attempt' && (
        <AttemptGate
          question={question}
          onSubmit={submitAttempt}
          onBack={goHome}
          previousAttempt={isRevisionMode ? attempt : undefined}
          coachHint={isRevisionMode && evaluation ? evaluation.coach_hint : undefined}
          onShowUpgradePrompt={(feature) => setUpgradePromptFeature(feature)}
          onRevealAnswer={() => {
            setCurrentScreen('answer');
            setEvaluation({
              effort_score: 0,
              understanding_score: 0,
              copied: false,
              what_is_right: 'No attempt provided.',
              what_is_missing: 'Everything - you skipped the attempt.',
              unlock: true,
              full_explanation: 'Since you chose to reveal the answer without attempting, here it is...',
            });
          }}
        />
      )}

      {currentScreen === 'evaluation' && evaluation && (
        <EvaluationScreen
          question={question}
          attempt={attempt}
          evaluation={evaluation}
          isRevisionMode={isRevisionMode}
          onUnlock={unlockAnswer}
          onRetry={() => {
            setIsRevisionMode(true);
            setCurrentScreen('attempt');
          }}
          onHome={goHome}
        />
      )}

      {currentScreen === 'answer' && evaluation && (
        <AnswerScreen
          question={question}
          attempt={attempt}
          evaluation={evaluation}
          onHome={goHome}
          onNewQuestion={startNewQuestion}
          streak={streak}
        />
      )}

      {currentScreen === 'progress' && (
        <ProgressScreen
          userId={userId}
          streak={streak}
          onBack={goHome}
          onGoToHome={goHome}
          onGoToProgress={goToProgress}
          onGoToHistory={goToHistory}
          onGoToTechniques={goToTechniques}
          onGoToParentDashboard={goToParentDashboard}
        />
      )}

      {currentScreen === 'history' && (
        <HistoryScreen
          userId={userId}
          onBack={goHome}
          onRetry={startNewQuestion}
          onGoToHome={goHome}
          onGoToProgress={goToProgress}
          onGoToHistory={goToHistory}
          onGoToTechniques={goToTechniques}
          onGoToParentDashboard={goToParentDashboard}
        />
      )}

      {currentScreen === 'pricing' && (
        <PricingScreen
          onBack={goHome}
          onStartTrial={handleStartTrial}
          onStayFree={handleStayFree}
          onCreateFamilyAccount={handleCreateFamilyAccount}
        />
      )}

      {currentScreen === 'parentDashboard' && (
        <ParentDashboard
          onBack={goHome}
          userId={userId}
          streak={streak}
          onAddStudent={handleAddStudent}
          onViewLeaderboard={() => setCurrentScreen('leaderboard')}
        />
      )}

      {currentScreen === 'guardianSettings' && (
        <GuardianSettings
          onBack={goToProfile}
          onUpgrade={goToPricing}
          onShowDemo={() => setCurrentScreen('frictionDemo')}
          onShowWeeklyReport={() => setCurrentScreen('weeklyReport')}
        />
      )}

      {currentScreen === 'parentPlanDetails' && (
        <ParentPlanDetails
          onBack={goHome}
          onCreateAccount={handleCreateFamilyAccount}
        />
      )}

      {showLimitModal && (
        <LimitReachedModal
          isOpen={showLimitModal}
          currentCount={dailyUnlockCount}
          maxCount={5}
          onUpgrade={() => {
            setShowLimitModal(false);
            goToPricing();
          }}
          onClose={() => setShowLimitModal(false)}
        />
      )}

      {currentScreen === 'profile' && userType === 'parent' && (
        <ParentProfileScreen
          onBack={goHome}
          onUpgrade={goToPricing}
          userId={userId}
          onGoToHome={goHome}
          onGoToProgress={goToProgress}
          onGoToHistory={goToHistory}
          onGoToTechniques={goToTechniques}
          onGoToParentDashboard={goToParentDashboard}
          onGoToSettings={goToSettings}
          onGoToGuardianSettings={goToGuardianSettings}
          onGoToLeaderboard={() => setCurrentScreen('leaderboard')}
          streak={streak}
          onLogout={() => {
            setUserType(null);
            setCurrentScreen('splash');
          }}
        />
      )}

      {currentScreen === 'profile' && userType === 'student' && (
        <ProfileScreen
          onBack={goHome}
          onUpgrade={goToPricing}
          userId={userId}
          onShowAnimations={() => setCurrentScreen('animations')}
          onGoToHome={goHome}
          onGoToProgress={goToProgress}
          onGoToHistory={goToHistory}
          onGoToTechniques={() => setCurrentScreen('techniques')}
          onGoToParentDashboard={undefined}
          onGoToSettings={goToSettings}
          onGoToGuardianSettings={undefined}
          onConnectParent={() => setCurrentScreen('connectParent')}
          onShowBadges={goToBadges}
          streak={streak}
          onLogout={() => {
            setUserType(null);
            setCurrentScreen('splash');
          }}
        />
      )}

      {currentScreen === 'techniques' && (
        <TechniquesScreen
          onBack={goHome}
          onGoToHome={goHome}
          onGoToProgress={goToProgress}
          onGoToHistory={goToHistory}
          onGoToTechniques={goToTechniques}
          onGoToParentDashboard={userType === 'parent' ? goToParentDashboard : undefined}
          streak={streak}
        />
      )}

      {currentScreen === 'animations' && (
        <AnimationShowcase onBack={goToProfile} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onSubmit={handleLoginSubmit}
          onSocialLogin={handleSocialLogin}
          onRestorePurchases={handleRestorePurchases}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          onBack={goToProfile}
          onManagePlan={goToPricing}
          onRestorePurchases={handleRestorePurchases}
          onToggleNotifications={handleToggleNotifications}
          onEditEmail={handleEditEmail}
          onEditPassword={handleEditPassword}
          onLogOut={handleLogOut}
          onDeleteAccount={handleDeleteAccount}
          onViewOnboarding={handleViewOnboarding}
        />
      )}

      {currentScreen === 'connectParent' && (
        <ConnectParentScreen
          onBack={goToProfile}
          userId={userId}
          studentName={localStorage.getItem('thinkfirst_userName') || undefined}
        />
      )}

      {currentScreen === 'addStudent' && (
        <AddStudentScreen
          onBack={goToParentDashboard}
          parentUserId={userId}
        />
      )}

      {currentScreen === 'frictionDemo' && (
        <DifficultyFrictionDemo onBack={goToGuardianSettings} />
      )}

      {currentScreen === 'weeklyReport' && (
        <WeeklyReportPreview onBack={goToGuardianSettings} />
      )}

      {currentScreen === 'leaderboard' && (
        <FamilyLeaderboard onBack={goToParentDashboard} />
      )}

      {currentScreen === 'badges' && (
        <BadgesScreen userId={userId} onBack={goToProfile} />
      )}

      {upgradePromptFeature && (
        <UpgradePrompt
          feature={upgradePromptFeature}
          onUpgrade={() => {
            setUpgradePromptFeature(null);
            goToPricing();
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
    </div>
  );
}
