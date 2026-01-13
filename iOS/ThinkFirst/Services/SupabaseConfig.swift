import Foundation

struct SupabaseConfig {
    // TODO: Replace with your actual Supabase credentials
    static let url = "https://your-project-id.supabase.co"
    static let anonKey = "your-anon-key-here"
    
    // Edge Function endpoints
    static let evaluateEndpoint = "/functions/v1/evaluate"
    static let updateStreakEndpoint = "/functions/v1/update-streak"
    static let checkBadgesEndpoint = "/functions/v1/check-badges"
    static let incrementQuestionsEndpoint = "/functions/v1/increment-questions"
    
    // REST API endpoints
    static let profilesEndpoint = "/rest/v1/profiles"
    static let attemptsEndpoint = "/rest/v1/learning_attempts"
    static let badgesEndpoint = "/rest/v1/user_badges"
    
    // Headers
    static var defaultHeaders: [String: String] {
        return [
            "Content-Type": "application/json",
            "Authorization": "Bearer \(anonKey)",
            "apikey": anonKey
        ]
    }
}