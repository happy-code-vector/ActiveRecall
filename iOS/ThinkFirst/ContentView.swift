import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        NavigationStack {
            Group {
                switch appState.currentScreen {
                case .splash:
                    SplashScreen()
                case .onboarding:
                    OnboardingFlow()
                case .home:
                    HomeScreen()
                case .learning:
                    LearningFlow()
                case .progress:
                    ProgressScreen()
                case .profile:
                    ProfileScreen()
                case .badges:
                    BadgesScreen()
                case .history:
                    HistoryScreen()
                case .pricing:
                    PricingScreen()
                case .settings:
                    SettingsScreen()
                case .family:
                    FamilyDashboard()
                }
            }
            .animation(.easeInOut(duration: 0.3), value: appState.currentScreen)
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}