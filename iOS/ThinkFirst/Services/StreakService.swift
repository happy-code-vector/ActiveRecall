import Foundation

class StreakService: ObservableObject {
    static let shared = StreakService()
    
    private let userDefaults = UserDefaults.standard
    private let streakKey = "thinkfirst_streak"
    private let freezeKey = "thinkfirst_streak_freeze"
    
    private init() {}
    
    // MARK: - Streak Management
    func getCurrentStreak() -> StreakData {
        if let data = userDefaults.data(forKey: streakKey),
           let streak = try? JSONDecoder().decode(StreakData.self, from: data) {
            return streak
        }
        return StreakData()
    }
    
    func updateStreak() -> StreakData {
        var streak = getCurrentStreak()
        let today = Date()
        let calendar = Calendar.current
        
        // Check if we already updated today
        if let lastDateString = streak.lastDate,
           let lastDate = DateFormatter.streakDate.date(from: lastDateString),
           calendar.isDate(lastDate, inSameDayAs: today) {
            return streak // Already updated today
        }
        
        // Check if streak should continue or reset
        if let lastDateString = streak.lastDate,
           let lastDate = DateFormatter.streakDate.date(from: lastDateString) {
            
            let daysBetween = calendar.dateComponents([.day], from: lastDate, to: today).day ?? 0
            
            if daysBetween == 1 {
                // Consecutive day - increment streak
                streak.count += 1
            } else if daysBetween > 1 {
                // Gap detected - check for freeze usage
                if canUseFreeze() && shouldUseFreeze(daysMissed: daysBetween) {
                    // Use freeze to maintain streak
                    consumeFreeze()
                    streak.count += 1
                    streak.freezeUsedToday = true
                } else {
                    // Reset streak
                    streak.count = 1
                    streak.freezeUsedToday = false
                }
            }
        } else {
            // First time or no previous date
            streak.count = 1
        }
        
        streak.lastDate = DateFormatter.streakDate.string(from: today)
        saveStreak(streak)
        
        return streak
    }
    
    private func saveStreak(_ streak: StreakData) {
        if let data = try? JSONEncoder().encode(streak) {
            userDefaults.set(data, forKey: streakKey)
        }
    }
    
    // MARK: - Streak Freeze Management
    func getStreakFreezeState() -> StreakFreezeState {
        if let data = userDefaults.data(forKey: freezeKey),
           let freezeState = try? JSONDecoder().decode(StreakFreezeState.self, from: data) {
            return freezeState
        }
        return StreakFreezeState()
    }
    
    func saveStreakFreezeState(_ state: StreakFreezeState) {
        if let data = try? JSONEncoder().encode(state) {
            userDefaults.set(data, forKey: freezeKey)
        }
    }
    
    func canUseFreeze() -> Bool {
        let freezeState = getStreakFreezeState()
        return freezeState.personalFreezes > 0 || freezeState.familyPoolFreezes > 0
    }
    
    func consumeFreeze() {
        var freezeState = getStreakFreezeState()
        
        if freezeState.personalFreezes > 0 {
            freezeState.personalFreezes -= 1
            let event = FreezeEvent(
                type: "consumed",
                timestamp: ISO8601DateFormatter().string(from: Date()),
                source: "personal"
            )
            freezeState.freezeHistory.append(event)
        } else if freezeState.familyPoolFreezes > 0 {
            freezeState.familyPoolFreezes -= 1
            let event = FreezeEvent(
                type: "consumed",
                timestamp: ISO8601DateFormatter().string(from: Date()),
                source: "family_pool"
            )
            freezeState.freezeHistory.append(event)
        }
        
        saveStreakFreezeState(freezeState)
    }
    
    func grantMonthlyFreezes(plan: PlanType) {
        var freezeState = getStreakFreezeState()
        let today = Date()
        let calendar = Calendar.current
        
        // Check if we already granted this month
        if let lastGrantString = freezeState.lastFreezeGrantDate,
           let lastGrant = ISO8601DateFormatter().date(from: lastGrantString),
           calendar.isDate(lastGrant, equalTo: today, toGranularity: .month) {
            return // Already granted this month
        }
        
        // Grant freezes based on plan
        switch plan {
        case .free:
            freezeState.personalFreezes = min(freezeState.personalFreezes + 1, 3) // Cap at 3
        case .solo:
            freezeState.personalFreezes = min(freezeState.personalFreezes + 3, 5) // Cap at 5
        case .family:
            freezeState.personalFreezes = min(freezeState.personalFreezes + 3, 5)
            freezeState.familyPoolFreezes = min(freezeState.familyPoolFreezes + 5, 10)
        }
        
        freezeState.lastFreezeGrantDate = ISO8601DateFormatter().string(from: today)
        
        let event = FreezeEvent(
            type: "granted",
            timestamp: ISO8601DateFormatter().string(from: Date()),
            source: plan == .family ? "family_pool" : "personal"
        )
        freezeState.freezeHistory.append(event)
        
        saveStreakFreezeState(freezeState)
    }
    
    private func shouldUseFreeze(daysMissed: Int) -> Bool {
        // Auto-use freeze for gaps of 1-2 days
        return daysMissed <= 2
    }
    
    // MARK: - Streak Reset Logic
    func getStreakResetBoundary(for date: Date) -> Date {
        let calendar = Calendar.current
        var components = calendar.dateComponents([.year, .month, .day], from: date)
        components.hour = 3 // 3 AM reset time
        components.minute = 0
        components.second = 0
        
        return calendar.date(from: components) ?? date
    }
    
    func wasDayMissed(lastActivity: Date, currentDate: Date) -> Bool {
        let lastBoundary = getStreakResetBoundary(for: lastActivity)
        let currentBoundary = getStreakResetBoundary(for: currentDate)
        
        let calendar = Calendar.current
        let daysBetween = calendar.dateComponents([.day], from: lastBoundary, to: currentBoundary).day ?? 0
        
        return daysBetween > 1
    }
    
    // MARK: - Validation
    func validateStreakIntegrity() -> Bool {
        let streak = getCurrentStreak()
        
        guard let lastDateString = streak.lastDate,
              let lastDate = DateFormatter.streakDate.date(from: lastDateString) else {
            return streak.count == 0
        }
        
        let today = Date()
        let calendar = Calendar.current
        let daysBetween = calendar.dateComponents([.day], from: lastDate, to: today).day ?? 0
        
        // Streak should be reset if more than 2 days have passed without freeze
        if daysBetween > 2 && !streak.freezeUsedToday {
            return false
        }
        
        return true
    }
    
    func resetStreakIfNeeded() {
        if !validateStreakIntegrity() {
            var streak = getCurrentStreak()
            streak.count = 0
            streak.lastDate = nil
            streak.freezeUsedToday = false
            saveStreak(streak)
        }
    }
}

// MARK: - Extensions
extension DateFormatter {
    static let streakDate: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}