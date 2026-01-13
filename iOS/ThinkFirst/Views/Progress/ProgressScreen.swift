import SwiftUI

struct ProgressScreen: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            ScrollView {
                VStack(spacing: 24) {
                    // Stats overview
                    statsOverview
                    
                    // Streak section
                    streakSection
                    
                    // Progress chart placeholder
                    progressChart
                    
                    // Recent activity
                    recentActivity
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 100)
            }
            
            Spacer()
            
            BottomNavView()
        }
        .background(Color.black.ignoresSafeArea())
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
            
            Text("Progress")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
            
            Spacer()
            
            Color.clear
                .frame(width: 24, height: 24)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var statsOverview: some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 16) {
            StatCard(
                title: "Questions Today",
                value: "\(appState.questionsToday)",
                subtitle: appState.isPremium ? "Unlimited" : "of 3",
                color: .blue,
                icon: "questionmark.circle.fill"
            )
            
            StatCard(
                title: "Current Streak",
                value: "\(appState.streak.count)",
                subtitle: "days",
                color: .orange,
                icon: "flame.fill"
            )
            
            StatCard(
                title: "Total Unlocks",
                value: "12", // Mock data
                subtitle: "answers",
                color: .green,
                icon: "lock.open.fill"
            )
            
            StatCard(
                title: "Avg Effort",
                value: "85%", // Mock data
                subtitle: "score",
                color: .purple,
                icon: "chart.line.uptrend.xyaxis"
            )
        }
    }
    
    private var streakSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Streak Progress")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            VStack(spacing: 12) {
                // Streak visualization
                HStack(spacing: 8) {
                    ForEach(0..<7, id: \.self) { day in
                        Circle()
                            .fill(day < appState.streak.count % 7 ? Color.orange : Color.gray.opacity(0.3))
                            .frame(width: 32, height: 32)
                            .overlay(
                                Text("\(day + 1)")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(day < appState.streak.count % 7 ? .white : .gray)
                            )
                    }
                }
                
                Text("Keep your streak alive! Come back tomorrow.")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }
            .padding(20)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.orange.opacity(0.3), lineWidth: 1)
                    )
            )
        }
    }
    
    private var progressChart: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Weekly Activity")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            // Mock chart
            VStack(spacing: 12) {
                HStack(spacing: 8) {
                    ForEach(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], id: \.self) { day in
                        VStack(spacing: 4) {
                            Rectangle()
                                .fill(
                                    LinearGradient(
                                        colors: [Color.purple, Color.blue],
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                )
                                .frame(width: 24, height: CGFloat.random(in: 20...80))
                                .cornerRadius(4)
                            
                            Text(day)
                                .font(.system(size: 10))
                                .foregroundColor(.gray)
                        }
                    }
                }
                
                Text("Questions asked per day")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
            .padding(20)
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
    
    private var recentActivity: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Recent Activity")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
                
                Button(action: {
                    // TODO: Navigate to full history
                }) {
                    Text("View All")
                        .font(.system(size: 14))
                        .foregroundColor(.purple)
                }
            }
            
            VStack(spacing: 12) {
                // Mock recent activities
                ActivityItem(
                    question: "How does photosynthesis work?",
                    effortScore: 85,
                    timeAgo: "2 hours ago",
                    unlocked: true
                )
                
                ActivityItem(
                    question: "What is the Pythagorean theorem?",
                    effortScore: 72,
                    timeAgo: "1 day ago",
                    unlocked: true
                )
                
                ActivityItem(
                    question: "Explain Newton's first law",
                    effortScore: 91,
                    timeAgo: "2 days ago",
                    unlocked: true
                )
            }
        }
    }
}

// MARK: - Stat Card
struct StatCard: View {
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

// MARK: - Activity Item
struct ActivityItem: View {
    let question: String
    let effortScore: Int
    let timeAgo: String
    let unlocked: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            // Status indicator
            Circle()
                .fill(unlocked ? Color.green : Color.orange)
                .frame(width: 8, height: 8)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(question)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white)
                    .lineLimit(2)
                
                HStack {
                    Text("\(effortScore)% effort")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                    
                    Text("•")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                    
                    Text(timeAgo)
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
            
            Spacer()
            
            if unlocked {
                Image(systemName: "lock.open.fill")
                    .font(.system(size: 14))
                    .foregroundColor(.green)
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.1), lineWidth: 1)
                )
        )
    }
}

#Preview {
    ProgressScreen()
        .environmentObject(AppState())
}