import SwiftUI

struct OnboardingFlow: View {
    @EnvironmentObject var appState: AppState
    @State private var currentStep = 0
    
    private let steps = [
        "userType",
        "gradeSelection", 
        "goalSelection",
        "methodology",
        "tryIt",
        "profileSetup"
    ]
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            Group {
                switch steps[currentStep] {
                case "userType":
                    UserTypeSelectionView(onNext: nextStep)
                case "gradeSelection":
                    GradeSelectionView(onNext: nextStep, onBack: previousStep)
                case "goalSelection":
                    GoalSelectionView(onNext: nextStep, onBack: previousStep)
                case "methodology":
                    MethodologyView(onNext: nextStep, onBack: previousStep)
                case "tryIt":
                    TryItView(onNext: nextStep, onBack: previousStep)
                case "profileSetup":
                    ProfileSetupView(onComplete: completeOnboarding, onBack: previousStep)
                default:
                    EmptyView()
                }
            }
            .transition(.asymmetric(
                insertion: .move(edge: .trailing).combined(with: .opacity),
                removal: .move(edge: .leading).combined(with: .opacity)
            ))
        }
    }
    
    private func nextStep() {
        withAnimation(.easeInOut(duration: 0.3)) {
            if currentStep < steps.count - 1 {
                currentStep += 1
            }
        }
    }
    
    private func previousStep() {
        withAnimation(.easeInOut(duration: 0.3)) {
            if currentStep > 0 {
                currentStep -= 1
            }
        }
    }
    
    private func completeOnboarding() {
        appState.completeOnboarding()
        appState.saveUserData()
    }
}

// MARK: - User Type Selection
struct UserTypeSelectionView: View {
    @EnvironmentObject var appState: AppState
    let onNext: () -> Void
    
    var body: some View {
        VStack(spacing: 40) {
            VStack(spacing: 16) {
                Text("Who's learning today?")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                
                Text("Choose your account type to get started")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, 60)
            
            Spacer()
            
            VStack(spacing: 20) {
                // Student option
                Button(action: {
                    appState.userType = .student
                    onNext()
                }) {
                    HStack(spacing: 16) {
                        Image(systemName: "graduationcap.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.blue)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("I'm a Student")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(.white)
                            Text("Learn and track your progress")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                        }
                        
                        Spacer()
                        
                        Image(systemName: "chevron.right")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.gray)
                    }
                    .padding(20)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
                }
                
                // Parent option
                Button(action: {
                    appState.userType = .parent
                    onNext()
                }) {
                    HStack(spacing: 16) {
                        Image(systemName: "person.2.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.green)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("I'm a Parent")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(.white)
                            Text("Manage family learning")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                        }
                        
                        Spacer()
                        
                        Image(systemName: "chevron.right")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.gray)
                    }
                    .padding(20)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
                }
            }
            .padding(.horizontal, 32)
            
            Spacer()
        }
    }
}

// MARK: - Grade Selection
struct GradeSelectionView: View {
    @EnvironmentObject var appState: AppState
    let onNext: () -> Void
    let onBack: () -> Void
    
    var body: some View {
        VStack(spacing: 40) {
            VStack(spacing: 16) {
                Text("What grade are you in?")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                
                Text("This helps us personalize your experience")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, 60)
            
            Spacer()
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                ForEach(GradeLevel.allCases, id: \.self) { grade in
                    Button(action: {
                        appState.gradeLevel = grade
                        onNext()
                    }) {
                        Text(grade.displayName)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 60)
                            .background(
                                appState.gradeLevel == grade ? 
                                LinearGradient(colors: [Color.purple, Color.blue], startPoint: .leading, endPoint: .trailing) :
                                LinearGradient(colors: [Color.gray.opacity(0.1)], startPoint: .leading, endPoint: .trailing)
                            )
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(
                                        appState.gradeLevel == grade ? Color.clear : Color.gray.opacity(0.2),
                                        lineWidth: 1
                                    )
                            )
                    }
                }
            }
            .padding(.horizontal, 32)
            
            Spacer()
            
            // Back button
            Button(action: onBack) {
                Text("Back")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 50)
        }
    }
}

// MARK: - Placeholder Views
struct GoalSelectionView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    
    var body: some View {
        VStack {
            Text("Goal Selection")
                .font(.title)
                .foregroundColor(.white)
            
            Button("Next", action: onNext)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
            
            Button("Back", action: onBack)
                .foregroundColor(.gray)
        }
    }
}

struct MethodologyView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    
    var body: some View {
        VStack {
            Text("Methodology")
                .font(.title)
                .foregroundColor(.white)
            
            Button("Next", action: onNext)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
            
            Button("Back", action: onBack)
                .foregroundColor(.gray)
        }
    }
}

struct TryItView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    
    var body: some View {
        VStack {
            Text("Try It")
                .font(.title)
                .foregroundColor(.white)
            
            Button("Next", action: onNext)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
            
            Button("Back", action: onBack)
                .foregroundColor(.gray)
        }
    }
}

struct ProfileSetupView: View {
    @EnvironmentObject var appState: AppState
    @State private var displayName = ""
    let onComplete: () -> Void
    let onBack: () -> Void
    
    var body: some View {
        VStack(spacing: 40) {
            Text("What should we call you?")
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
            
            TextField("Enter your name", text: $displayName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 32)
            
            Button(action: {
                appState.displayName = displayName
                onComplete()
            }) {
                Text("Complete Setup")
                    .font(.system(size: 18, weight: .semibold))
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
            }
            .padding(.horizontal, 32)
            .disabled(displayName.isEmpty)
            
            Button("Back", action: onBack)
                .foregroundColor(.gray)
        }
    }
}

#Preview {
    OnboardingFlow()
        .environmentObject(AppState())
}