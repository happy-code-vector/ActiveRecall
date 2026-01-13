import SwiftUI

struct SplashScreen: View {
    @EnvironmentObject var appState: AppState
    @State private var showLogo = false
    @State private var showText = false
    
    var body: some View {
        ZStack {
            // Background
            Color.black
                .ignoresSafeArea()
            
            // Ambient glow
            Circle()
                .fill(
                    RadialGradient(
                        colors: [Color.purple.opacity(0.3), Color.clear],
                        center: .center,
                        startRadius: 50,
                        endRadius: 300
                    )
                )
                .frame(width: 600, height: 600)
                .blur(radius: 100)
            
            VStack(spacing: 40) {
                Spacer()
                
                // Logo
                VStack(spacing: 20) {
                    Image(systemName: "brain.head.profile")
                        .font(.system(size: 80, weight: .light))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color.purple, Color.blue],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .scaleEffect(showLogo ? 1.0 : 0.5)
                        .opacity(showLogo ? 1.0 : 0.0)
                        .animation(.spring(response: 0.8, dampingFraction: 0.6), value: showLogo)
                    
                    Text("ThinkFirst")
                        .font(.system(size: 32, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .opacity(showText ? 1.0 : 0.0)
                        .animation(.easeInOut(duration: 0.6).delay(0.3), value: showText)
                }
                
                Spacer()
                
                // Continue button
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        if appState.hasCompletedOnboarding {
                            appState.navigateTo(.home)
                        } else {
                            appState.navigateTo(.onboarding)
                        }
                    }
                }) {
                    HStack {
                        Text("Get Started")
                            .font(.system(size: 18, weight: .semibold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        LinearGradient(
                            colors: [Color.purple, Color.blue],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(16)
                    .shadow(color: Color.purple.opacity(0.3), radius: 20, x: 0, y: 10)
                }
                .padding(.horizontal, 32)
                .opacity(showText ? 1.0 : 0.0)
                .animation(.easeInOut(duration: 0.6).delay(0.6), value: showText)
            }
            .padding(.bottom, 50)
        }
        .onAppear {
            // Animate in sequence
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                showLogo = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                showText = true
            }
        }
    }
}

#Preview {
    SplashScreen()
        .environmentObject(AppState())
}