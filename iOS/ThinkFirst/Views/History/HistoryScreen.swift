import SwiftUI

struct HistoryScreen: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var historyService = HistoryService()
    @State private var selectedFilter: HistoryFilter = .all
    @State private var searchText = ""
    @State private var showingDetail: LearningAttemptHistory?
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            // Search and filter
            searchAndFilterView
            
            // History list
            if filteredAttempts.isEmpty {
                emptyStateView
            } else {
                historyListView
            }
            
            Spacer()
            
            BottomNavView()
        }
        .background(Color.black.ignoresSafeArea())
        .sheet(item: $showingDetail) { attempt in
            HistoryDetailView(attempt: attempt)
        }
        .onAppear {
            historyService.loadHistory()
        }
    }
    
    private var headerView: some View {
        HStack {
            Button(action: {
                appState.navigateTo(.home)
            }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            Text("History")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
            
            Spacer()
            
            Button(action: {
                // TODO: Export history
            }) {
                Image(systemName: "square.and.arrow.up")
                    .font(.system(size: 18))
                    .foregroundColor(.white)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var searchAndFilterView: some View {
        VStack(spacing: 16) {
            // Search bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
                
                TextField("Search questions...", text: $searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                
                if !searchText.isEmpty {
                    Button(action: {
                        searchText = ""
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                    )
            )
            
            // Filter tabs
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(HistoryFilter.allCases, id: \.self) { filter in
                        FilterTab(
                            title: filter.displayName,
                            count: historyService.getCount(for: filter),
                            isSelected: selectedFilter == filter
                        ) {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selectedFilter = filter
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
    }
    
    private var historyListView: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(filteredAttempts, id: \.id) { attempt in
                    HistoryCard(attempt: attempt) {
                        showingDetail = attempt
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 100)
        }
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Spacer()
            
            Image(systemName: "clock.fill")
                .font(.system(size: 48))
                .foregroundColor(.gray)
            
            Text("No Learning History")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.white)
            
            Text("Your questions and answers will appear here as you learn")
                .font(.system(size: 16))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            
            Button(action: {
                appState.navigateTo(.home)
            }) {
                Text("Start Learning")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(
                        LinearGradient(
                            colors: [Color.purple, Color.blue],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(12)
            }
            
            Spacer()
        }
    }
    
    private var filteredAttempts: [LearningAttemptHistory] {
        var attempts = historyService.attempts
        
        // Apply filter
        switch selectedFilter {
        case .all:
            break
        case .unlocked:
            attempts = attempts.filter { $0.unlocked }
        case .mastery:
            attempts = attempts.filter { $0.masteryMode }
        case .recent:
            let oneWeekAgo = Calendar.current.date(byAdding: .day, value: -7, to: Date()) ?? Date()
            attempts = attempts.filter { $0.timestamp > oneWeekAgo }
        }
        
        // Apply search
        if !searchText.isEmpty {
            attempts = attempts.filter { attempt in
                attempt.question.localizedCaseInsensitiveContains(searchText) ||
                attempt.attempt.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        return attempts.sorted { $0.timestamp > $1.timestamp }
    }
}

// MARK: - Filter Tab
struct FilterTab: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(isSelected ? .white : .gray)
                
                Text("\(count)")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(isSelected ? .white : .gray)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(
                        Capsule()
                            .fill(isSelected ? Color.white.opacity(0.2) : Color.gray.opacity(0.2))
                    )
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                Capsule()
                    .fill(isSelected ? Color.purple.opacity(0.3) : Color.gray.opacity(0.1))
                    .overlay(
                        Capsule()
                            .stroke(isSelected ? Color.purple.opacity(0.5) : Color.gray.opacity(0.2), lineWidth: 1)
                    )
            )
        }
    }
}

// MARK: - History Card
struct HistoryCard: View {
    let attempt: LearningAttemptHistory
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 12) {
                // Header
                HStack {
                    Text(attempt.question)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.leading)
                        .lineLimit(2)
                    
                    Spacer()
                    
                    if attempt.unlocked {
                        Image(systemName: "lock.open.fill")
                            .font(.system(size: 14))
                            .foregroundColor(.green)
                    }
                }
                
                // Attempt preview
                Text(attempt.attempt)
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
                    .lineLimit(3)
                
                // Footer
                HStack {
                    // Scores
                    if let effortScore = attempt.effortScore {
                        ScorePill(
                            title: "Effort",
                            score: Int((effortScore / 3.0) * 100),
                            color: .blue
                        )
                    }
                    
                    if let understandingScore = attempt.understandingScore {
                        ScorePill(
                            title: "Understanding",
                            score: Int((understandingScore / 3.0) * 100),
                            color: .purple
                        )
                    }
                    
                    if attempt.masteryMode {
                        Text("MASTERY")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.purple)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.purple.opacity(0.2))
                            .cornerRadius(4)
                    }
                    
                    Spacer()
                    
                    Text(attempt.timestamp.formatted(.relative(presentation: .named)))
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
            )
        }
    }
}

// MARK: - Score Pill
struct ScorePill: View {
    let title: String
    let score: Int
    let color: Color
    
    var body: some View {
        HStack(spacing: 4) {
            Text(title)
                .font(.system(size: 10))
                .foregroundColor(color)
            
            Text("\(score)%")
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(color)
        }
        .padding(.horizontal, 6)
        .padding(.vertical, 2)
        .background(color.opacity(0.2))
        .cornerRadius(4)
    }
}

// MARK: - History Detail View
struct HistoryDetailView: View {
    let attempt: LearningAttemptHistory
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Question
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Question")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.gray)
                            .textCase(.uppercase)
                        
                        Text(attempt.question)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    
                    // Your attempt
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Your Answer")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.gray)
                            .textCase(.uppercase)
                        
                        Text(attempt.attempt)
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                    }
                    
                    // Scores
                    if let effortScore = attempt.effortScore,
                       let understandingScore = attempt.understandingScore {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Scores")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.gray)
                                .textCase(.uppercase)
                            
                            HStack(spacing: 20) {
                                VStack(spacing: 8) {
                                    Text("Effort")
                                        .font(.system(size: 14))
                                        .foregroundColor(.gray)
                                    
                                    Text("\(Int((effortScore / 3.0) * 100))%")
                                        .font(.system(size: 24, weight: .bold))
                                        .foregroundColor(.blue)
                                }
                                
                                VStack(spacing: 8) {
                                    Text("Understanding")
                                        .font(.system(size: 14))
                                        .foregroundColor(.gray)
                                    
                                    Text("\(Int((understandingScore / 3.0) * 100))%")
                                        .font(.system(size: 24, weight: .bold))
                                        .foregroundColor(.purple)
                                }
                                
                                Spacer()
                            }
                        }
                    }
                    
                    // Metadata
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Details")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.gray)
                            .textCase(.uppercase)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text("Date:")
                                    .foregroundColor(.gray)
                                Spacer()
                                Text(attempt.timestamp.formatted(date: .abbreviated, time: .shortened))
                                    .foregroundColor(.white)
                            }
                            
                            HStack {
                                Text("Mode:")
                                    .foregroundColor(.gray)
                                Spacer()
                                Text(attempt.masteryMode ? "Mastery" : "Standard")
                                    .foregroundColor(.white)
                            }
                            
                            HStack {
                                Text("Status:")
                                    .foregroundColor(.gray)
                                Spacer()
                                Text(attempt.unlocked ? "Unlocked" : "Locked")
                                    .foregroundColor(attempt.unlocked ? .green : .orange)
                            }
                        }
                        .font(.system(size: 14))
                    }
                }
                .padding(20)
            }
            .background(Color.black.ignoresSafeArea())
            .navigationTitle("Learning Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundColor(.purple)
                }
            }
        }
    }
}

// MARK: - History Service
class HistoryService: ObservableObject {
    @Published var attempts: [LearningAttemptHistory] = []
    
    func loadHistory() {
        // Load from UserDefaults or API
        if let data = UserDefaults.standard.data(forKey: "thinkfirst_history"),
           let history = try? JSONDecoder().decode([LearningAttemptHistory].self, from: data) {
            attempts = history
        } else {
            // Mock data for demo
            loadMockData()
        }
    }
    
    func addAttempt(_ attempt: LearningAttemptHistory) {
        attempts.insert(attempt, at: 0)
        saveHistory()
    }
    
    func getCount(for filter: HistoryFilter) -> Int {
        switch filter {
        case .all:
            return attempts.count
        case .unlocked:
            return attempts.filter { $0.unlocked }.count
        case .mastery:
            return attempts.filter { $0.masteryMode }.count
        case .recent:
            let oneWeekAgo = Calendar.current.date(byAdding: .day, value: -7, to: Date()) ?? Date()
            return attempts.filter { $0.timestamp > oneWeekAgo }.count
        }
    }
    
    private func saveHistory() {
        if let data = try? JSONEncoder().encode(attempts) {
            UserDefaults.standard.set(data, forKey: "thinkfirst_history")
        }
    }
    
    private func loadMockData() {
        attempts = [
            LearningAttemptHistory(
                id: UUID(),
                question: "How does photosynthesis work?",
                attempt: "Photosynthesis is the process where plants use sunlight to make food. They take in carbon dioxide from the air and water from their roots, and use chlorophyll to convert these into glucose and oxygen.",
                effortScore: 2.8,
                understandingScore: 2.3,
                unlocked: true,
                masteryMode: false,
                timestamp: Date().addingTimeInterval(-3600)
            ),
            LearningAttemptHistory(
                id: UUID(),
                question: "What is the Pythagorean theorem?",
                attempt: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides. So a² + b² = c².",
                effortScore: 2.5,
                understandingScore: 2.7,
                unlocked: true,
                masteryMode: true,
                timestamp: Date().addingTimeInterval(-86400)
            ),
            LearningAttemptHistory(
                id: UUID(),
                question: "Explain Newton's first law of motion",
                attempt: "Newton's first law says that objects at rest stay at rest and objects in motion stay in motion unless acted upon by an external force. This is also called the law of inertia.",
                effortScore: 2.2,
                understandingScore: 2.0,
                unlocked: false,
                masteryMode: false,
                timestamp: Date().addingTimeInterval(-172800)
            )
        ]
    }
}

// MARK: - Supporting Types
enum HistoryFilter: CaseIterable {
    case all, unlocked, mastery, recent
    
    var displayName: String {
        switch self {
        case .all: return "All"
        case .unlocked: return "Unlocked"
        case .mastery: return "Mastery"
        case .recent: return "Recent"
        }
    }
}

struct LearningAttemptHistory: Identifiable, Codable {
    let id: UUID
    let question: String
    let attempt: String
    let effortScore: Double?
    let understandingScore: Double?
    let unlocked: Bool
    let masteryMode: Bool
    let timestamp: Date
}

#Preview {
    HistoryScreen()
        .environmentObject(AppState())
}