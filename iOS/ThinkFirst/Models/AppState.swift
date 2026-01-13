import SwiftUI
import Foundation

enum AppScreen {
    case splash
    case onboarding
    case home
    case learning
    case progress
    case profile
    case badges
    case history
    case pricing
    case settings
    case family
}

enum UserType: String, CaseIterable {
    case student = "student"
    case parent = "parent"
}

enum PlanType: String, CaseIterable {
    case free = "free"
    case solo = "solo"
    case family = "family"
}

enum GradeLevel: String, CaseIterable {
    case k2 = "k-2"
    case grade35 = "3-5"
    case grade68 = "6-8"
    case grade910 = "9-10"
    case grade1112 = "11-12"
    case college = "college"
    
    var displayName: String {
        switch self {
        case .k2: return "K-2"
        case .grade35: return "3-5"
        case .grade68: return "6-8"
        case .grade910: return "9-10"
        case .grade1112: return "11-12"
        case .college: return "College"
        }
    }
}

class AppState: ObservableObject {
    @Published var currentScreen: AppScreen = .splash
    @Published var userType: UserType?
    @Published var gradeLevel: GradeLevel?
    @Published var plan: PlanType = .free
    @Published var isPremium: Bool = false
    @Published var displayName: String = ""
    @Published var questionsToday: Int = 0
    @Published var streak: StreakData = StreakData()
    @Published var isAuthenticated: Bool = false
    @Published var hasCompletedOnboarding: Bool = false
    
    // Learning state
    @Published var currentQuestion: String = ""
    @Published var currentAttempt: String = ""
    @Published var currentEvaluation: Evaluation?
    @Published var isEvaluating: Bool = false
    
    init() {
        loadUserData()
        checkOnboardingStatus()
    }
    
    private func loadUserData() {
        // Load from UserDefaults
        if let userTypeString = UserDefaults.standard.string(forKey: "thinkfirst_userType"),
           let userType = UserType(rawValue: userTypeString) {
            self.userType = userType
        }
        
        if let gradeString = UserDefaults.standard.string(forKey: "thinkfirst_userGrade"),
           let grade = GradeLevel(rawValue: gradeString) {
            self.gradeLevel = grade
        }
        
        if let planString = UserDefaults.standard.string(forKey: "thinkfirst_plan"),
           let plan = PlanType(rawValue: planString) {
            self.plan = plan
        }
        
        self.isPremium = UserDefaults.standard.bool(forKey: "thinkfirst_premium")
        self.displayName = UserDefaults.standard.string(forKey: "thinkfirst_displayName") ?? ""
        self.questionsToday = UserDefaults.standard.integer(forKey: "thinkfirst_questionsToday")
        self.isAuthenticated = UserDefaults.standard.bool(forKey: "thinkfirst_authenticated")
        
        // Load streak data
        loadStreakData()
    }
    
    private func checkOnboardingStatus() {
        self.hasCompletedOnboarding = UserDefaults.standard.bool(forKey: "thinkfirst_onboardingComplete")
        
        if !hasCompletedOnboarding {
            currentScreen = .splash
        } else if isAuthenticated {
            currentScreen = .home
        } else {
            currentScreen = .onboarding
        }
    }
    
    private func loadStreakData() {
        if let data = UserDefaults.standard.data(forKey: "thinkfirst_streak"),
           let streakData = try? JSONDecoder().decode(StreakData.self, from: data) {
            self.streak = streakData
        }
    }
    
    func saveUserData() {
        if let userType = userType {
            UserDefaults.standard.set(userType.rawValue, forKey: "thinkfirst_userType")
        }
        
        if let gradeLevel = gradeLevel {
            UserDefaults.standard.set(gradeLevel.rawValue, forKey: "thinkfirst_userGrade")
        }
        
        UserDefaults.standard.set(plan.rawValue, forKey: "thinkfirst_plan")
        UserDefaults.standard.set(isPremium, forKey: "thinkfirst_premium")
        UserDefaults.standard.set(displayName, forKey: "thinkfirst_displayName")
        UserDefaults.standard.set(questionsToday, forKey: "thinkfirst_questionsToday")
        UserDefaults.standard.set(isAuthenticated, forKey: "thinkfirst_authenticated")
        
        // Save streak data
        if let data = try? JSONEncoder().encode(streak) {
            UserDefaults.standard.set(data, forKey: "thinkfirst_streak")
        }
    }
    
    func completeOnboarding() {
        hasCompletedOnboarding = true
        UserDefaults.standard.set(true, forKey: "thinkfirst_onboardingComplete")
        currentScreen = .home
    }
    
    func navigateTo(_ screen: AppScreen) {
        currentScreen = screen
    }
    
    func incrementQuestionCount() {
        questionsToday += 1
        UserDefaults.standard.set(questionsToday, forKey: "thinkfirst_questionsToday")
    }
    
    var questionsRemaining: Int {
        if isPremium { return Int.max }
        return max(0, 3 - questionsToday)
    }
    
    var canAskQuestions: Bool {
        return isPremium || questionsToday < 3
    }
}