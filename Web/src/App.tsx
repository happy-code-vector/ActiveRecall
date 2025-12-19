import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AccountTypeScreen } from './components/AccountTypeScreen';
import { UserTypeScreen } from './components/UserTypeScreen';
import { GradeSelectionScreen } from './components/GradeSelectionScreen';
import { GoalSelectionScreen } from './components/GoalSelectionScreen';
import { MethodologyScreen } from './components/MethodologyScreen';
import { TryItScreen } from './components/TryItScreen';
import { NotificationPermissionScreen } from './components/NotificationPermissionScreen';
import { HomeScreen } from './components/HomeScreen';
import { AttemptGate } from './components/AttemptGate';
import { EvaluationScreen } from './components/EvaluationScreen';
import { AnswerScreen } from './components/AnswerScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { PricingScreen } from './components/PricingScreen';
import { ParentPlanDetails } from './components/ParentPlanDetails';
import { ParentDashboard } from './components/ParentDashboard';
import { GuardianSettings } from './components/GuardianSettings';
import { LimitReachedModal } from './components/LimitReachedModal';
import { ProfileScreen } from './components/ProfileScreen';
import { ParentProfileScreen } from './components/ParentProfileScreen';
import { TechniquesScreen } from './components/TechniquesScreen';
import { AnimationShowcase } from './components/AnimationShowcase';
import { LoginScreen } from './components/LoginScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ConnectParentScreen } from './components/ConnectParentScreen';
import { AddStudentScreen } from './components/AddStudentScreen';
import { UpgradePrompt } from './components/UpgradePrompt';
import { DifficultyFrictionDemo } from './components/DifficultyFrictionDemo';
import { WeeklyReportPreview } from './components/WeeklyReportPreview';
import { NudgeNotificationBanner } from './components/NudgeNotificationBanner';
import { FamilyLeaderboard } from './components/FamilyLeaderboard';
import { BadgesScreen } from './components/BadgesScreen';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { getSubscriptionStatus, incrementQuestionCount, getQuestionsRemaining } from './utils/subscription';

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

export default function App() {
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
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate state from localStorage on client
  useEffect(() => {
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
        setStreak(data);
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
            gradeLevel, // NEW: Send grade level to AI
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
          // Don't fail the evaluation if badge checking fails
        }
      }
    } catch (error) {
      console.error('Error evaluating attempt:', error);
      
      // Determine user-friendly error message
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
      
      // Set error state
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
    // Check if user is a free user and has reached the daily unlock limit
    if (!localStorage.getItem('thinkfirst_premium') && dailyUnlockCount >= 5) {
      setShowLimitModal(true);
      return;
    }

    // Increment daily unlock count
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

  const goToProfile = () => {
    console.log('App: Navigating to profile');
    setCurrentScreen('profile');
  };

  const goHome = () => {
    console.log('App: Navigating to home');
    setCurrentScreen('home');
  };

  const goToPricing = () => {
    console.log('App: Navigating to pricing');
    setCurrentScreen('pricing');
  };

  const goToProgress = () => {
    console.log('App: Navigating to progress');
    setCurrentScreen('progress');
  };

  const goToHistory = () => {
    console.log('App: Navigating to history');
    setCurrentScreen('history');
  };

  const goToTechniques = () => {
    console.log('App: Navigating to techniques');
    setCurrentScreen('techniques');
  };

  const goToSettings = () => {
    console.log('App: Navigating to settings');
    setCurrentScreen('settings');
  };

  const goToParentDashboard = () => {
    console.log('App: Navigating to parent dashboard');
    setCurrentScreen('parentDashboard');
  };

  const goToGuardianSettings = () => {
    console.log('App: Navigating to guardian settings');
    setCurrentScreen('guardianSettings');
  };

  const goToBadges = () => {
    console.log('App: Navigating to badges');
    setCurrentScreen('badges');
  };

  const handleGetStarted = () => {
    setCurrentScreen('accountType');
  };

  const handleAccountTypeSelect = (type: 'student' | 'parent') => {
    setUserType(type);
    localStorage.setItem('thinkfirst_userType', type);
    
    // Branch flow: Students go to grade selection, Parents skip to goal selection
    if (type === 'student') {
      setCurrentScreen('gradeSelection');
    } else {
      // Parents skip grade selection and go straight to goal selection
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

  const handleMethodologyComplete = () => {
    setCurrentScreen('tryIt');
  };

  const handleTryItComplete = () => {
    setCurrentScreen('notification');
  };

  const handleNotificationEnable = () => {
    localStorage.setItem('thinkfirst_notificationEnabled', 'true');
    setCurrentScreen('login');
  };

  const handleNotificationSkip = () => {
    localStorage.setItem('thinkfirst_notificationEnabled', 'false');
    setCurrentScreen('login');
  };

  const handleStartTrial = (plan: 'solo' | 'family') => {
    console.log(`Starting trial for ${plan} plan`);
    localStorage.setItem('thinkfirst_premium', 'true');
    localStorage.setItem('thinkfirst_plan', plan);
    setCurrentScreen('home');
  };

  const handleStayFree = () => {
    console.log('User chose to stay on free plan');
    setCurrentScreen('home');
  };

  const handleCreateFamilyAccount = () => {
    console.log('Creating family account');
    localStorage.setItem('thinkfirst_premium', 'true');
    localStorage.setItem('thinkfirst_plan', 'family');
    setCurrentScreen('home');
  };

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleLoginSubmit = (email: string, password: string) => {
    console.log('Login submitted:', email);
    // TODO: Implement actual Supabase auth
    // For now, just go to home
    setCurrentScreen('home');
  };

  const handleSocialLogin = (provider: 'apple' | 'google') => {
    console.log('Social login with:', provider);
    // TODO: Implement Supabase OAuth
    // For now, just go to home
    setCurrentScreen('home');
  };

  const handleRestorePurchases = () => {
    console.log('Restore purchases requested');
    // TODO: Implement purchase restoration logic
  };

  const handleToggleNotifications = (enabled: boolean) => {
    console.log('Notifications toggled:', enabled);
    localStorage.setItem('thinkfirst_notificationEnabled', enabled.toString());
  };

  const handleEditEmail = () => {
    console.log('Edit email requested');
    // TODO: Implement email editing
  };

  const handleEditPassword = () => {
    console.log('Edit password requested');
    // TODO: Implement password editing
  };

  const handleLogOut = () => {
    console.log('Log out requested');
    setUserType(null);
    localStorage.removeItem('thinkfirst_userType');
    setCurrentScreen('splash');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account requested');
    // TODO: Show confirmation modal, then delete account
  };

  const handleAddStudent = () => {
    console.log('Add student requested');
    setCurrentScreen('addStudent');
  };

  const handleNudgeMember = (memberId: string, memberName: string) => {
    // Get the current user's name (in a real app, this would come from auth)
    // For demo purposes, we're assuming the logged-in user is the main student ("You")
    const currentUserName = "You"; // In production, get from user context
    
    // Create a new nudge notification
    const newNotification: NudgeNotification = {
      id: crypto.randomUUID(),
      fromName: currentUserName,
      timestamp: Date.now(),
    };

    // Add to notifications
    const updatedNotifications = [...nudgeNotifications, newNotification];
    setNudgeNotifications(updatedNotifications);
    
    // Save to localStorage
    localStorage.setItem('thinkfirst_nudgeNotifications', JSON.stringify(updatedNotifications));
  };

  const handleDismissNotification = (id: string) => {
    // Remove notification
    const updatedNotifications = nudgeNotifications.filter(n => n.id !== id);
    setNudgeNotifications(updatedNotifications);
    
    // Save to localStorage
    localStorage.setItem('thinkfirst_nudgeNotifications', JSON.stringify(updatedNotifications));
  };

  return (
    <div className="min-h-screen bg-[#121212] max-w-[480px] mx-auto relative">
      {/* Nudge Notification Banner */}
      <NudgeNotificationBanner 
        notifications={nudgeNotifications}
        onDismiss={handleDismissNotification}
      />

      {currentScreen === 'splash' && (
        <SplashScreen onGetStarted={handleGetStarted} />
      )}

      {currentScreen === 'accountType' && (
        <AccountTypeScreen
          onSelect={handleAccountTypeSelect}
        />
      )}

      {currentScreen === 'userType' && (
        <UserTypeScreen
          onSelect={handleUserTypeSelect}
        />
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
        <MethodologyScreen
          onComplete={handleMethodologyComplete}
        />
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
            // Handle mercy mode - reveal answer with zero points
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
        <AnimationShowcase
          onBack={goToProfile}
        />
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
        <DifficultyFrictionDemo
          onBack={goToGuardianSettings}
        />
      )}

      {currentScreen === 'weeklyReport' && (
        <WeeklyReportPreview
          onBack={goToGuardianSettings}
        />
      )}

      {currentScreen === 'leaderboard' && (
        <FamilyLeaderboard
          onBack={goToParentDashboard}
        />
      )}

      {currentScreen === 'badges' && (
        <BadgesScreen
          userId={userId}
          onBack={goToProfile}
        />
      )}

      {/* Upgrade Prompts */}
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

      {/* Badge Unlock Modal */}
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