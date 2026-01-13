import SwiftUI

struct ProfileScreen: View {
    @EnvironmentObject var appState: AppState
    @State private var showingSettings = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            ScrollView {
                VStack(spacing: 24) {
                    // Profile info
                    profileInfoView
                    
                    // Subscription status
                    subscriptionView
                    
                    // Quick stats
                    quickStatsView
                    
                    // Menu items
                    menuItemsView
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 100)
            }
            
            Spacer()
            
            BottomNavView()
        }
        .background(Color.black.ignoresSafeArea())
        .sheet(isPresented: $showingSettings) {
            SettingsScreen()
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
            
            Text("Profile")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
            
            Spacer()
            
            Button(action: {
                showingSettings = true
            }) {
                Image(systemName: "gearshape.fill")
                    .font(.system(size: 18))
                    .foregroundColor(.white)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var profileInfoView: some View {
        VStack(spacing: 16) {
            // Avatar
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color.purple, Color.blue],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 80, height: 80)
                
                Text(String(appState.displayName.prefix(1)).uppercased())
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(.white)
            }
            
            VStack(spacing: 4) {
                Text(appState.displayName)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                
                Text(appState.userType?.rawValue.capitalized ?? "Student")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
                
                if let grade = appState.gradeLevel {
                    Text("Grade \(grade.displayName)")
                        .font(.system(size: 14))
                        .foregroundColor(.purple)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 4)
                        .background(Color.purple.opacity(0.2))
                        .cornerRadius(8)
                }
            }
        }
    }
    
    private var subscriptionView: some View {
        VStack(spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(appState.plan.rawValue.capitalized + " Plan")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(.white)
                    
                    if appState.isPremium {
                        Text("Premium features unlocked")
                            .font(.system(size: 14))
                            .foregroundColor(.green)
                    } else {
                        Text("Limited features")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                    }
                }
                
                Spacer()
                
                if appState.isPremium {
                    Image(systemName: "crown.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.yellow)
                } else {
                    Button(action: {
                        appState.navigateTo(.pricing)
                    }) {
                        Text("Upgrade")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(
                                LinearGradient(
                                    colors: [Color.purple, Color.blue],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(20)
                    }
                }
            }
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(appState.isPremium ? Color.yellow.opacity(0.1) : Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(appState.isPremium ? Color.yellow.opacity(0.3) : Color.gray.opacity(0.2), lineWidth: 1)
                )
        )
    }
    
    private var quickStatsView: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Quick Stats")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            HStack(spacing: 16) {
                QuickStatItem(
                    title: "Streak",
                    value: "\(appState.streak.count)",
                    icon: "flame.fill",
                    color: .orange
                )
                
                QuickStatItem(
                    title: "Today",
                    value: "\(appState.questionsToday)",
                    icon: "questionmark.circle.fill",
                    color: .blue
                )
                
                QuickStatItem(
                    title: "Badges",
                    value: "3", // Mock data
                    icon: "star.fill",
                    color: .yellow
                )
            }
        }
    }
    
    private var menuItemsView: some View {
        VStack(spacing: 12) {
            ProfileMenuItem(
                title: "Badges & Achievements",
                icon: "star.fill",
                color: .yellow
            ) {
                appState.navigateTo(.badges)
            }
            
            ProfileMenuItem(
                title: "Learning History",
                icon: "clock.fill",
                color: .blue
            ) {
                appState.navigateTo(.history)
            }
            
            ProfileMenuItem(
                title: "Settings",
                icon: "gearshape.fill",
                color: .gray
            ) {
                appState.navigateTo(.settings)
            }
            
            if appState.userType == .student {
                ProfileMenuItem(
                    title: "Connect to Parent",
                    icon: "person.2.fill",
                    color: .green
                ) {
                    // TODO: Navigate to connect parent
                }
            }
            
            if appState.userType == .parent {
                ProfileMenuItem(
                    title: "Family Dashboard",
                    icon: "person.2.fill",
                    color: .green
                ) {
                    appState.navigateTo(.family)
                }
            }
            
            ProfileMenuItem(
                title: "Help & Support",
                icon: "questionmark.circle.fill",
                color: .purple
            ) {
                // TODO: Navigate to help
            }
        }
    }
}

// MARK: - Quick Stat Item
struct QuickStatItem: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)
            
            Text(value)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text(title)
                .font(.system(size: 12))
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
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

// MARK: - Profile Menu Item
struct ProfileMenuItem: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(color)
                    .frame(width: 24)
                
                Text(title)
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            .padding(.vertical, 16)
            .padding(.horizontal, 20)
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

// MARK: - Settings View (removed - now using dedicated SettingsScreen)

#Preview {
    ProfileScreen()
        .environmentObject(AppState())
}