import SwiftUI

struct BadgesScreen: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var badgeService = BadgeService()
    @State private var selectedCategory: BadgeCategory = .streak
    @State private var showBadgeDetail: Badge?
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            // Category selector
            categorySelector
            
            // Badges grid
            ScrollView {
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 16) {
                    ForEach(filteredBadges, id: \.id) { badge in
                        BadgeCard(
                            badge: badge,
                            isUnlocked: badgeService.isUnlocked(badge.id)
                        ) {
                            showBadgeDetail = badge
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 100)
            }
            
            Spacer()
            
            BottomNavView()
        }
        .background(Color.black.ignoresSafeArea())
        .sheet(item: $showBadgeDetail) { badge in
            BadgeDetailView(badge: badge, isUnlocked: badgeService.isUnlocked(badge.id))
        }
        .onAppear {
            badgeService.loadUserBadges()
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
            
            Text("Badges")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
            
            Spacer()
            
            Text("\(badgeService.unlockedCount)/\(BadgeDefinitions.allBadges.count)")
                .font(.system(size: 14))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var categorySelector: some View {
        HStack(spacing: 0) {
            ForEach(BadgeCategory.allCases, id: \.self) { category in
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedCategory = category
                    }
                }) {
                    VStack(spacing: 4) {
                        Text(category.displayName)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(selectedCategory == category ? .white : .gray)
                        
                        Rectangle()
                            .fill(selectedCategory == category ? Color.purple : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
    }
    
    private var filteredBadges: [Badge] {
        BadgeDefinitions.allBadges.filter { $0.category == selectedCategory }
    }
}

// MARK: - Badge Card
struct BadgeCard: View {
    let badge: Badge
    let isUnlocked: Bool
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 12) {
                // Badge icon
                ZStack {
                    Circle()
                        .fill(
                            isUnlocked ?
                            LinearGradient(
                                colors: [Color(hex: badge.color), Color(hex: badge.colorEnd)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ) :
                            LinearGradient(
                                colors: [Color.gray.opacity(0.3)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 60, height: 60)
                    
                    Image(systemName: badge.iconName)
                        .font(.system(size: 24))
                        .foregroundColor(isUnlocked ? .white : .gray)
                }
                
                VStack(spacing: 4) {
                    Text(badge.name)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(isUnlocked ? .white : .gray)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                    
                    Text(badge.requirement)
                        .font(.system(size: 10))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(
                                isUnlocked ? Color(hex: badge.color).opacity(0.5) : Color.gray.opacity(0.2),
                                lineWidth: 1
                            )
                    )
            )
            .scaleEffect(isUnlocked ? 1.0 : 0.95)
            .opacity(isUnlocked ? 1.0 : 0.7)
        }
    }
}

// MARK: - Badge Detail View
struct BadgeDetailView: View {
    let badge: Badge
    let isUnlocked: Bool
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        VStack(spacing: 24) {
            // Header
            HStack {
                Button("Close") {
                    dismiss()
                }
                .foregroundColor(.purple)
                
                Spacer()
            }
            .padding(.horizontal, 20)
            
            Spacer()
            
            // Badge display
            VStack(spacing: 20) {
                ZStack {
                    Circle()
                        .fill(
                            isUnlocked ?
                            LinearGradient(
                                colors: [Color(hex: badge.color), Color(hex: badge.colorEnd)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ) :
                            LinearGradient(
                                colors: [Color.gray.opacity(0.3)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 120, height: 120)
                        .shadow(
                            color: isUnlocked ? Color(hex: badge.color).opacity(0.5) : Color.clear,
                            radius: 20,
                            x: 0,
                            y: 10
                        )
                    
                    Image(systemName: badge.iconName)
                        .font(.system(size: 48))
                        .foregroundColor(isUnlocked ? .white : .gray)
                }
                
                VStack(spacing: 8) {
                    Text(badge.name)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text(badge.rarity.rawValue.capitalized)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(badge.rarity.color)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 4)
                        .background(badge.rarity.color.opacity(0.2))
                        .cornerRadius(8)
                }
                
                Text(badge.description)
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
                
                if !isUnlocked {
                    VStack(spacing: 8) {
                        Text("How to unlock:")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                        
                        Text(badge.requirement)
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                    }
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                    )
                    .padding(.horizontal, 20)
                }
            }
            
            Spacer()
        }
        .background(Color.black.ignoresSafeArea())
    }
}

// MARK: - Badge Service
class BadgeService: ObservableObject {
    @Published var unlockedBadges: Set<String> = []
    
    var unlockedCount: Int {
        unlockedBadges.count
    }
    
    func isUnlocked(_ badgeId: String) -> Bool {
        unlockedBadges.contains(badgeId)
    }
    
    func loadUserBadges() {
        // Load from UserDefaults
        if let data = UserDefaults.standard.data(forKey: "thinkfirst_unlocked_badges"),
           let badges = try? JSONDecoder().decode(Set<String>.self, from: data) {
            unlockedBadges = badges
        }
        
        // Mock some unlocked badges for demo
        unlockedBadges.insert("ignition")
        unlockedBadges.insert("the_initiate")
    }
    
    func unlockBadge(_ badgeId: String) {
        unlockedBadges.insert(badgeId)
        saveBadges()
    }
    
    private func saveBadges() {
        if let data = try? JSONEncoder().encode(unlockedBadges) {
            UserDefaults.standard.set(data, forKey: "thinkfirst_unlocked_badges")
        }
    }
}

#Preview {
    BadgesScreen()
        .environmentObject(AppState())
}