import UIKit

struct HapticUtils {
    
    // MARK: - Feedback Generators
    private static let impactLight = UIImpactFeedbackGenerator(style: .light)
    private static let impactMedium = UIImpactFeedbackGenerator(style: .medium)
    private static let impactHeavy = UIImpactFeedbackGenerator(style: .heavy)
    private static let notificationGenerator = UINotificationFeedbackGenerator()
    private static let selectionGenerator = UISelectionFeedbackGenerator()
    
    // MARK: - Learning Flow Haptics
    static func triggerTypingHaptic() {
        impactLight.impactOccurred()
    }
    
    static func triggerSubmissionHaptic() {
        impactMedium.impactOccurred()
    }
    
    static func triggerValidationErrorHaptic() {
        notificationGenerator.notificationOccurred(.error)
    }
    
    static func triggerSuccessHaptic() {
        notificationGenerator.notificationOccurred(.success)
    }
    
    static func triggerWarningHaptic() {
        notificationGenerator.notificationOccurred(.warning)
    }
    
    // MARK: - UI Interaction Haptics
    static func triggerSelectionHaptic() {
        selectionGenerator.selectionChanged()
    }
    
    static func triggerButtonTapHaptic() {
        impactLight.impactOccurred()
    }
    
    static func triggerToggleHaptic() {
        impactMedium.impactOccurred()
    }
    
    // MARK: - Mastery Mode Haptics
    static func triggerMasteryToggleHaptic() {
        impactMedium.impactOccurred()
        
        // Double tap for mastery mode activation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            impactLight.impactOccurred()
        }
    }
    
    static func triggerMasteryUnlockHaptic() {
        // Triple impact for mastery unlock
        impactHeavy.impactOccurred()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            impactMedium.impactOccurred()
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            impactLight.impactOccurred()
        }
    }
    
    // MARK: - Unlock & Achievement Haptics
    static func triggerUnlockHaptic() {
        // Success notification followed by medium impact
        notificationGenerator.notificationOccurred(.success)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            impactMedium.impactOccurred()
        }
    }
    
    static func triggerBadgeUnlockHaptic() {
        // Celebration sequence
        impactHeavy.impactOccurred()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            impactMedium.impactOccurred()
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            impactLight.impactOccurred()
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            notificationGenerator.notificationOccurred(.success)
        }
    }
    
    // MARK: - Streak Haptics
    static func triggerStreakIncrementHaptic() {
        impactMedium.impactOccurred()
        
        // Light follow-up for streak continuation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            impactLight.impactOccurred()
        }
    }
    
    static func triggerStreakMilestoneHaptic() {
        // Major milestone celebration
        impactHeavy.impactOccurred()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            impactHeavy.impactOccurred()
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            notificationGenerator.notificationOccurred(.success)
        }
    }
    
    static func triggerStreakFreezeHaptic() {
        // Gentle warning that freeze was used
        notificationGenerator.notificationOccurred(.warning)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            impactLight.impactOccurred()
        }
    }
    
    // MARK: - Navigation Haptics
    static func triggerScreenTransitionHaptic() {
        impactLight.impactOccurred()
    }
    
    static func triggerBackNavigationHaptic() {
        selectionGenerator.selectionChanged()
    }
    
    // MARK: - Voice Input Haptics
    static func triggerVoiceStartHaptic() {
        impactMedium.impactOccurred()
    }
    
    static func triggerVoiceStopHaptic() {
        impactLight.impactOccurred()
    }
    
    static func triggerVoiceErrorHaptic() {
        notificationGenerator.notificationOccurred(.error)
    }
    
    // MARK: - Progress Haptics
    static func triggerProgressUpdateHaptic() {
        impactLight.impactOccurred()
    }
    
    static func triggerLevelUpHaptic() {
        // Level up celebration
        notificationGenerator.notificationOccurred(.success)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            impactMedium.impactOccurred()
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            impactLight.impactOccurred()
        }
    }
    
    // MARK: - Error & Warning Haptics
    static func triggerGenericErrorHaptic() {
        notificationGenerator.notificationOccurred(.error)
    }
    
    static func triggerNetworkErrorHaptic() {
        // Double error for network issues
        notificationGenerator.notificationOccurred(.error)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            impactLight.impactOccurred()
        }
    }
    
    static func triggerLimitReachedHaptic() {
        // Warning followed by gentle impact
        notificationGenerator.notificationOccurred(.warning)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            impactMedium.impactOccurred()
        }
    }
    
    // MARK: - Subscription & Premium Haptics
    static func triggerUpgradePromptHaptic() {
        impactMedium.impactOccurred()
    }
    
    static func triggerPremiumUnlockHaptic() {
        // Premium unlock celebration
        impactHeavy.impactOccurred()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            notificationGenerator.notificationOccurred(.success)
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            impactMedium.impactOccurred()
        }
    }
    
    // MARK: - Utility Methods
    static func prepareHaptics() {
        // Prepare all generators for reduced latency
        impactLight.prepare()
        impactMedium.prepare()
        impactHeavy.prepare()
        notificationGenerator.prepare()
        selectionGenerator.prepare()
    }
    
    static func isHapticsEnabled() -> Bool {
        // Check if haptics are supported and enabled
        return UIDevice.current.userInterfaceIdiom == .phone
    }
    
    // MARK: - Custom Haptic Patterns
    static func triggerCustomPattern(_ pattern: HapticPattern) {
        guard isHapticsEnabled() else { return }
        
        for (index, haptic) in pattern.haptics.enumerated() {
            let delay = pattern.delays.count > index ? pattern.delays[index] : 0.0
            
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                switch haptic {
                case .light:
                    impactLight.impactOccurred()
                case .medium:
                    impactMedium.impactOccurred()
                case .heavy:
                    impactHeavy.impactOccurred()
                case .success:
                    notificationGenerator.notificationOccurred(.success)
                case .warning:
                    notificationGenerator.notificationOccurred(.warning)
                case .error:
                    notificationGenerator.notificationOccurred(.error)
                case .selection:
                    selectionGenerator.selectionChanged()
                }
            }
        }
    }
}

// MARK: - Haptic Pattern Support
struct HapticPattern {
    enum HapticType {
        case light, medium, heavy
        case success, warning, error
        case selection
    }
    
    let haptics: [HapticType]
    let delays: [TimeInterval]
    
    // Predefined patterns
    static let celebration = HapticPattern(
        haptics: [.heavy, .medium, .light, .success],
        delays: [0.0, 0.1, 0.2, 0.3]
    )
    
    static let doubleConfirm = HapticPattern(
        haptics: [.medium, .medium],
        delays: [0.0, 0.15]
    )
    
    static let errorSequence = HapticPattern(
        haptics: [.error, .light],
        delays: [0.0, 0.2]
    )
}