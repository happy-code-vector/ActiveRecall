import Foundation
import Combine

class APIService: ObservableObject {
    static let shared = APIService()
    
    private let baseURL = SupabaseConfig.url
    private let apiKey = SupabaseConfig.anonKey
    
    private init() {}
    
    // MARK: - Evaluation API
    func evaluateAttempt(
        question: String,
        attempt: String,
        masteryMode: Bool
    ) -> AnyPublisher<Evaluation, Error> {
        let url = URL(string: "\(baseURL)/functions/v1/evaluate")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let body = [
            "question": question,
            "attempt": attempt,
            "mastery_mode": masteryMode
        ] as [String: Any]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            return Fail(error: error).eraseToAnyPublisher()
        }
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: Evaluation.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Profile API
    func fetchUserProfile(userId: String) -> AnyPublisher<UserProfile, Error> {
        let url = URL(string: "\(baseURL)/rest/v1/profiles?id=eq.\(userId)")!
        
        var request = URLRequest(url: url)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("1", forHTTPHeaderField: "Range-Unit")
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: [UserProfile].self, decoder: JSONDecoder())
            .map { profiles in
                guard let profile = profiles.first else {
                    throw APIError.profileNotFound
                }
                return profile
            }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    func updateUserProfile(
        userId: String,
        updates: [String: Any]
    ) -> AnyPublisher<UserProfile, Error> {
        let url = URL(string: "\(baseURL)/rest/v1/profiles?id=eq.\(userId)")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: updates)
        } catch {
            return Fail(error: error).eraseToAnyPublisher()
        }
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: [UserProfile].self, decoder: JSONDecoder())
            .map { profiles in
                guard let profile = profiles.first else {
                    throw APIError.updateFailed
                }
                return profile
            }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Streak API
    func updateStreak(userId: String) -> AnyPublisher<StreakData, Error> {
        let url = URL(string: "\(baseURL)/functions/v1/update-streak")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let body = ["user_id": userId]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            return Fail(error: error).eraseToAnyPublisher()
        }
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: StreakData.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Badge API
    func checkBadgeUnlocks(userId: String) -> AnyPublisher<[Badge], Error> {
        let url = URL(string: "\(baseURL)/functions/v1/check-badges")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let body = ["user_id": userId]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            return Fail(error: error).eraseToAnyPublisher()
        }
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: [Badge].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Question Count API
    func incrementQuestionCount(userId: String) -> AnyPublisher<Int, Error> {
        let url = URL(string: "\(baseURL)/functions/v1/increment-questions")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let today = DateFormatter.iso8601.string(from: Date())
        let body = [
            "user_id": userId,
            "today_date": today
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            return Fail(error: error).eraseToAnyPublisher()
        }
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: QuestionCountResponse.self, decoder: JSONDecoder())
            .map(\.count)
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
}

// MARK: - Response Models
struct QuestionCountResponse: Codable {
    let count: Int
}

// MARK: - API Errors
enum APIError: Error, LocalizedError {
    case profileNotFound
    case updateFailed
    case invalidResponse
    case networkError
    
    var errorDescription: String? {
        switch self {
        case .profileNotFound:
            return "Profile not found"
        case .updateFailed:
            return "Failed to update profile"
        case .invalidResponse:
            return "Invalid response from server"
        case .networkError:
            return "Network error occurred"
        }
    }
}

// MARK: - Extensions
extension DateFormatter {
    static let iso8601: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone.current
        return formatter
    }()
}