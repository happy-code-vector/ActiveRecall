import SwiftUI

struct HomeScreen: View {
    @EnvironmentObject var appState: AppState
    @State private var questionText = ""
    @State private var showStarterChallenges = true
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            // Ambient glow
            Circle()
                .fill(
                    RadialGradient(
                        colors: [Color.purple.opacity(0.2), Color.clear],
                        center: .center,
                        startRadius: 50,
                        endRadius: 400
                    )
                )
                .frame(width: 800, height: 800)
                .blur(radius: 100)
                .offset(y: -200)
            
            VStack(spacing: 0) {
                // Header
                headerView
                
                // Main content
                ScrollView {
                    VStack(spacing: 32) {
                        // Streak card
                        streakCard
                        
                        // Question input
                        questionInputSection
                        
                        // Starter challenges
                        if showStarterChallenges {
                            starterChallengesSection
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 100) // Space for bottom nav
                }
                
                Spacer()
                
                // Bottom navigation
                BottomNavView()
            }
        }
    }
    
    private var headerView: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Hello, \(appState.displayName)")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                
                Text("Ready to learn something new?")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            Button(action: {
                appState.navigateTo(.profile)
            }) {
                Image(systemName: "person.circle.fill")
                    .font(.system(size: 32))
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var streakCard: some View {
        HStack(spacing: 16) {
            // Streak flame
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color.orange.opacity(0.3), Color.red.opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 60, height: 60)
                
                Image(systemName: "flame.fill")
                    .font(.system(size: 28))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color.orange, Color.red],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("\(appState.streak.count) day streak")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.white)
                
                Text("Keep it going!")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            // Questions remaining
            VStack(alignment: .trailing, spacing: 4) {
                if appState.isPremium {
                    Text("∞")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.purple)
                } else {
                    Text("\(appState.questionsRemaining)")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(appState.questionsRemaining > 0 ? .green : .red)
                }
                
                Text("questions left")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
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
    
    private var questionInputSection: some View {
        VStack(spacing: 16) {
            Text("What would you like to understand?")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
            
            VStack(spacing: 12) {
                TextField("Type your question here...", text: $questionText, axis: .vertical)
                    .textFieldStyle(PlainTextFieldStyle())
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                            )
                    )
                    .lineLimit(3...6)
                
                Button(action: startLearning) {
                    HStack {
                        Text("Start Learning")
                            .font(.system(size: 16, weight: .semibold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(
                        LinearGradient(
                            colors: questionText.isEmpty ? [Color.gray] : [Color.purple, Color.blue],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(12)
                    .shadow(
                        color: questionText.isEmpty ? Color.clear : Color.purple.opacity(0.3),
                        radius: 10,
                        x: 0,
                        y: 5
                    )
                }
                .disabled(questionText.isEmpty || !appState.canAskQuestions)
            }
        }
    }
    
    private var starterChallengesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Quick Start")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
                
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        showStarterChallenges.toggle()
                    }
                }) {
                    Image(systemName: showStarterChallenges ? "chevron.up" : "chevron.down")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.gray)
                }
            }
            
            if showStarterChallenges {
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 12) {
                    ForEach(StarterChallenge.examples, id: \.id) { challenge in
                        StarterChallengeCard(challenge: challenge) {
                            questionText = challenge.question
                            startLearning()
                        }
                    }
                }
                .transition(.opacity.combined(with: .scale(scale: 0.95)))
            }
        }
    }
    
    private func startLearning() {
        guard !questionText.isEmpty && appState.canAskQuestions else { return }
        
        appState.currentQuestion = questionText
        appState.currentAttempt = ""
        appState.currentEvaluation = nil
        appState.navigateTo(.learning)
        
        // Clear the input
        questionText = ""
    }
}

// MARK: - Starter Challenge Card
struct StarterChallengeCard: View {
    let challenge: StarterChallenge
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: challenge.iconName)
                        .font(.system(size: 20))
                        .foregroundColor(challenge.color)
                    
                    Spacer()
                }
                
                Text(challenge.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.leading)
                
                Text(challenge.description)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: 100)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(challenge.color.opacity(0.3), lineWidth: 1)
                    )
            )
        }
    }
}

// MARK: - Bottom Navigation
struct BottomNavView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        HStack(spacing: 0) {
            BottomNavItem(
                icon: "house.fill",
                title: "Home",
                isSelected: appState.currentScreen == .home
            ) {
                appState.navigateTo(.home)
            }
            
            BottomNavItem(
                icon: "chart.line.uptrend.xyaxis",
                title: "Progress",
                isSelected: appState.currentScreen == .progress
            ) {
                appState.navigateTo(.progress)
            }
            
            BottomNavItem(
                icon: "clock.fill",
                title: "History",
                isSelected: appState.currentScreen == .history
            ) {
                appState.navigateTo(.history)
            }
            
            BottomNavItem(
                icon: "star.fill",
                title: "Badges",
                isSelected: appState.currentScreen == .badges
            ) {
                appState.navigateTo(.badges)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )
        )
        .padding(.horizontal, 20)
        .padding(.bottom, 34) // Safe area
    }
}

struct BottomNavItem: View {
    let icon: String
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(isSelected ? .purple : .gray)
                
                Text(title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(isSelected ? .purple : .gray)
            }
            .frame(maxWidth: .infinity)
        }
    }
}

// MARK: - Starter Challenge Model
struct StarterChallenge: Identifiable {
    let id = UUID()
    let title: String
    let question: String
    let description: String
    let iconName: String
    let color: Color
    
    static let examples = [
        StarterChallenge(
            title: "Science",
            question: "How does photosynthesis work?",
            description: "Explore how plants convert light into energy",
            iconName: "atom",
            color: .purple
        ),
        StarterChallenge(
            title: "Math",
            question: "What is the Pythagorean theorem?",
            description: "Discover triangle relationships",
            iconName: "function",
            color: .blue
        ),
        StarterChallenge(
            title: "History",
            question: "What caused World War II?",
            description: "Understand major historical events",
            iconName: "building.columns",
            color: .orange
        ),
        StarterChallenge(
            title: "Concepts",
            question: "What is artificial intelligence?",
            description: "Learn about modern technology",
            iconName: "lightbulb",
            color: .yellow
        )
    ]
}

#Preview {
    HomeScreen()
        .environmentObject(AppState())
}