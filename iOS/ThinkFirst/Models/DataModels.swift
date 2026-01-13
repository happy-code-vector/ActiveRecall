import Foundation

// MARK: - User Profile
struct UserProfile: Codable {
    let id: String
    let email: String?
    let displayName: String?
    let avatarUrl: String?
    let userType: UserType
    let gradeLevel: String
    let plan: PlanType
    let isPremium: Bool
    let subscriptionId: String?
    let subscriptionStatus: String?
    let subscriptionStartDate: String?
    let subscriptionEndDate: String?
    let questionsToday: Int
    let questionsResetDate: String?
    let createdAt: String
    let updatedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id, email, plan
        case displayName = "display_name"
        case avatarUrl = "avatar_url"
        case userType = "user_type"
        case gradeLevel = "grade_level"
        case isPremium = "is_premium"
        case subscriptionId = "subscription_id"
        case subscriptionStatus = "subscription_status"
        case subscriptionStartDate = "subscription_start_date"
        case subscriptionEndDate = "subscription_end_date"
        case questionsToday = "questions_today"
        case questionsResetDate = "questions_reset_date"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - Evaluation
struct Evaluation: Codable {
    let effortScore: Double
    let understandingScore: Double
    let copied: Bool
    let whatIsRight: String
    let whatIsMissing: String
    let coachHint: String?
    let levelUpTip: String?
    let unlock: Bool
    let fullExplanation: String
    
    enum CodingKeys: String, CodingKey {
        case copied, unlock
        case effortScore = "effort_score"
        case understandingScore = "understanding_score"
        case whatIsRight = "what_is_right"
        case whatIsMissing = "what_is_missing"
        case coachHint = "coach_hint"
        case levelUpTip = "level_up_tip"
        case fullExplanation = "full_explanation"
    }
    
    var effortPercent: Int {
        return Int((effortScore / 3.0) * 100)
    }
    
    var understandingPercent: Int {
        return Int((understandingScore / 3.0) * 100)
    }
    
    var isHighEffort: Bool {
        return effortScore >= 2.5
    }
}

// MARK: - Streak Data
struct StreakData: Codable {
    var count: Int = 0
    var lastDate: String?
    var freezeUsedToday: Bool = false
    
    enum CodingKeys: String, CodingKey {
        case count
        case lastDate = "last_date"
        case freezeUsedToday = "freeze_used_today"
    }
}

// MARK: - Streak Freeze
struct StreakFreezeState: Codable {
    var personalFreezes: Int = 0
    var familyPoolFreezes: Int = 0
    var lastFreezeGrantDate: String?
    var freezeHistory: [FreezeEvent] = []
    
    enum CodingKeys: String, CodingKey {
        case personalFreezes = "personal_freezes"
        case familyPoolFreezes = "family_pool_freezes"
        case lastFreezeGrantDate = "last_freeze_grant_date"
        case freezeHistory = "freeze_history"
    }
}

struct FreezeEvent: Codable {
    let type: String // "granted", "consumed", "borrowed"
    let timestamp: String
    let source: String // "personal", "family_pool"
}

// MARK: - Badge System
enum BadgeCategory: String, CaseIterable {
    case streak = "streak"
    case mastery = "mastery"
    case milestone = "milestone"
}

enum BadgeRarity: String, CaseIterable {
    case common = "common"
    case rare = "rare"
    case epic = "epic"
    case legendary = "legendary"
}

struct Badge: Codable, Identifiable {
    let id: String
    let name: String
    let description: String
    let visual: String
    let category: BadgeCategory
    let rarity: BadgeRarity
    let iconName: String
    let color: String
    let colorEnd: String
    let requirement: String
    let criteria: BadgeCriteria?
    
    enum CodingKeys: String, CodingKey {
        case id, name, description, visual, category, rarity, color, requirement, criteria
        case iconName = "icon_name"
        case colorEnd = "color_end"
    }
}

struct BadgeCriteria: Codable {
    let type: String
    let value: Int?
}

// MARK: - Subscription Status
struct SubscriptionStatus {
    let isPremium: Bool
    let plan: PlanType
    let questionsToday: Int
    let questionsLimit: Int
    let canAskQuestions: Bool
    let canUseVoice: Bool
    let canUseMasteryMode: Bool
    let canUseCoachTips: Bool
    let canUnlockAllBadges: Bool
    let canViewAdvancedStats: Bool
}

// MARK: - Learning Models
enum DifficultyLevel: String, CaseIterable {
    case base = "base"
    case mid = "mid"
    case mastery = "mastery"
    
    var displayName: String {
        switch self {
        case .base: return "Base"
        case .mid: return "Mid"
        case .mastery: return "Mastery"
        }
    }
    
    var multiplier: Double {
        switch self {
        case .base: return 1.0
        case .mid: return 1.5
        case .mastery: return 2.0
        }
    }
}

struct LearningAttempt {
    let question: String
    let attempt: String
    let masteryMode: Bool
    let timestamp: Date
}

// MARK: - Validation
struct ValidationResult {
    let valid: Bool
    let message: String?
}

// MARK: - Nudge Notifications
struct NudgeNotification: Codable, Identifiable {
    let id: String
    let fromName: String
    let timestamp: TimeInterval
    
    var date: Date {
        return Date(timeIntervalSince1970: timestamp)
    }
}