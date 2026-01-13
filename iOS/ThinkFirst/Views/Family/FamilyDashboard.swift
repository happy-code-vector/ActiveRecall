import SwiftUI

struct FamilyDashboard: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var familyService = FamilyService()
    @State private var showingAddStudent = false
    @State private var selectedStudent: FamilyMember?
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            ScrollView {
                VStack(spacing: 24) {
                    // Family overview
                    familyOverviewSection
                    
                    // Family leaderboard
                    leaderboardSection
                    
                    // Students list
                    studentsSection
                    
                    // Quick actions
                    quickActionsSection
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 100)
            }
            
            Spacer()
            
            BottomNavView()
        }
        .background(Color.black.ignoresSafeArea())
        .sheet(isPresented: $showingAddStudent) {
            AddStudentView()
        }
        .sheet(item: $selectedStudent) { student in
            StudentDetailView(student: student)
        }
        .onAppear {
            familyService.loadFamilyData()
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
            
            Text("Family Dashboard")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
            
            Spacer()
            
            Button(action: {
                showingAddStudent = true
            }) {
                Image(systemName: "plus")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.white)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var familyOverviewSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Family Overview")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                OverviewCard(
                    title: "Total Members",
                    value: "\(familyService.familyMembers.count)",
                    subtitle: "Active learners",
                    color: .blue,
                    icon: "person.2.fill"
                )
                
                OverviewCard(
                    title: "This Week",
                    value: "\(familyService.totalQuestionsThisWeek)",
                    subtitle: "Questions asked",
                    color: .green,
                    icon: "questionmark.circle.fill"
                )
                
                OverviewCard(
                    title: "Avg Streak",
                    value: "\(familyService.averageStreak)",
                    subtitle: "Days",
                    color: .orange,
                    icon: "flame.fill"
                )
                
                OverviewCard(
                    title: "Freezes Left",
                    value: "\(familyService.familyFreezes)",
                    subtitle: "Family pool",
                    color: .purple,
                    icon: "snowflake"
                )
            }
        }
    }
    
    private var leaderboardSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Family Leaderboard")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
                
                Button(action: {
                    // Navigate to full leaderboard
                }) {
                    Text("View All")
                        .font(.system(size: 14))
                        .foregroundColor(.purple)
                }
            }
            
            VStack(spacing: 12) {
                ForEach(Array(familyService.topPerformers.enumerated()), id: \.element.id) { index, member in
                    LeaderboardRow(
                        rank: index + 1,
                        member: member,
                        onTap: {
                            selectedStudent = member
                        }
                    )
                }
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
            )
        }
    }
    
    private var studentsSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Students")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
                
                Button(action: {
                    showingAddStudent = true
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: "plus")
                            .font(.system(size: 12))
                        Text("Add")
                            .font(.system(size: 14))
                    }
                    .foregroundColor(.purple)
                }
            }
            
            VStack(spacing: 12) {
                ForEach(familyService.familyMembers, id: \.id) { member in
                    StudentCard(member: member) {
                        selectedStudent = member
                    }
                }
            }
        }
    }
    
    private var quickActionsSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Quick Actions")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            VStack(spacing: 12) {
                QuickActionButton(
                    icon: "bell.fill",
                    title: "Send Nudge",
                    subtitle: "Remind family to practice",
                    color: .orange
                ) {
                    // Show nudge options
                }
                
                QuickActionButton(
                    icon: "chart.bar.fill",
                    title: "Weekly Report",
                    subtitle: "View family progress report",
                    color: .blue
                ) {
                    // Show weekly report
                }
                
                QuickActionButton(
                    icon: "gearshape.fill",
                    title: "Guardian Settings",
                    subtitle: "Manage parental controls",
                    color: .gray
                ) {
                    // Navigate to guardian settings
                }
            }
        }
    }
}

// MARK: - Overview Card
struct OverviewCard: View {
    let title: String
    let value: String
    let subtitle: String
    let color: Color
    let icon: String
    
    var body: some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)
                
                Spacer()
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.gray)
                
                Text(subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(color)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

// MARK: - Leaderboard Row
struct LeaderboardRow: View {
    let rank: Int
    let member: FamilyMember
    let onTap: () -> Void
    
    private var rankColor: Color {
        switch rank {
        case 1: return .yellow
        case 2: return .gray
        case 3: return .orange
        default: return .gray
        }
    }
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 16) {
                // Rank
                ZStack {
                    Circle()
                        .fill(rankColor.opacity(0.2))
                        .frame(width: 32, height: 32)
                    
                    Text("\(rank)")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(rankColor)
                }
                
                // Avatar
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color.purple, Color.blue],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(String(member.name.prefix(1)).uppercased())
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                    )
                
                // Info
                VStack(alignment: .leading, spacing: 2) {
                    Text(member.name)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                    
                    Text("\(member.streak) day streak")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                // Score
                VStack(alignment: .trailing, spacing: 2) {
                    Text("\(member.weeklyScore)")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("points")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
        }
    }
}

// MARK: - Student Card
struct StudentCard: View {
    let member: FamilyMember
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 16) {
                // Avatar
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color.purple, Color.blue],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 50, height: 50)
                    .overlay(
                        Text(String(member.name.prefix(1)).uppercased())
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                    )
                
                // Info
                VStack(alignment: .leading, spacing: 4) {
                    Text(member.name)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                    
                    Text("Grade \(member.gradeLevel)")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 12) {
                        HStack(spacing: 4) {
                            Image(systemName: "flame.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.orange)
                            Text("\(member.streak)")
                                .font(.system(size: 12))
                                .foregroundColor(.orange)
                        }
                        
                        HStack(spacing: 4) {
                            Image(systemName: "questionmark.circle.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.blue)
                            Text("\(member.questionsToday)")
                                .font(.system(size: 12))
                                .foregroundColor(.blue)
                        }
                    }
                }
                
                Spacer()
                
                // Status indicator
                Circle()
                    .fill(member.isActive ? Color.green : Color.gray)
                    .frame(width: 8, height: 8)
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
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

// MARK: - Quick Action Button
struct QuickActionButton: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)
                    .frame(width: 24)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                    
                    Text(subtitle)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(color.opacity(0.3), lineWidth: 1)
                    )
            )
        }
    }
}

// MARK: - Family Service
class FamilyService: ObservableObject {
    @Published var familyMembers: [FamilyMember] = []
    @Published var familyFreezes: Int = 5
    
    var totalQuestionsThisWeek: Int {
        familyMembers.reduce(0) { $0 + $1.questionsThisWeek }
    }
    
    var averageStreak: Int {
        guard !familyMembers.isEmpty else { return 0 }
        return familyMembers.reduce(0) { $0 + $1.streak } / familyMembers.count
    }
    
    var topPerformers: [FamilyMember] {
        Array(familyMembers.sorted { $0.weeklyScore > $1.weeklyScore }.prefix(3))
    }
    
    func loadFamilyData() {
        // Mock data for demo
        familyMembers = [
            FamilyMember(
                id: UUID(),
                name: "Emma",
                gradeLevel: "7",
                streak: 12,
                questionsToday: 3,
                questionsThisWeek: 15,
                weeklyScore: 850,
                isActive: true
            ),
            FamilyMember(
                id: UUID(),
                name: "Alex",
                gradeLevel: "5",
                streak: 8,
                questionsToday: 1,
                questionsThisWeek: 12,
                weeklyScore: 720,
                isActive: true
            ),
            FamilyMember(
                id: UUID(),
                name: "Sophie",
                gradeLevel: "9",
                streak: 5,
                questionsToday: 0,
                questionsThisWeek: 8,
                weeklyScore: 480,
                isActive: false
            )
        ]
    }
}

// MARK: - Family Member Model
struct FamilyMember: Identifiable {
    let id: UUID
    let name: String
    let gradeLevel: String
    let streak: Int
    let questionsToday: Int
    let questionsThisWeek: Int
    let weeklyScore: Int
    let isActive: Bool
}

// MARK: - Supporting Views
struct AddStudentView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Add Student")
                    .font(.title)
                    .foregroundColor(.white)
                
                Spacer()
                
                Text("Add student functionality would be implemented here")
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                
                Spacer()
            }
            .background(Color.black.ignoresSafeArea())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.purple)
                }
            }
        }
    }
}

struct StudentDetailView: View {
    let student: FamilyMember
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                Text(student.name)
                    .font(.title)
                    .foregroundColor(.white)
                
                Spacer()
                
                Text("Student detail view would be implemented here")
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                
                Spacer()
            }
            .background(Color.black.ignoresSafeArea())
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

#Preview {
    FamilyDashboard()
        .environmentObject(AppState())
}