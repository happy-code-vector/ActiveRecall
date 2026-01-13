import SwiftUI

struct EvaluationScreen: View {
    let question: String
    let attempt: String
    let evaluation: Evaluation?
    let isLoading: Bool
    let onUnlock: () -> Void
    let onRetry: () -> Void
    let onHome: () -> Void
    
    @State private var showUnlock = false
    @State private var effortProgress: Double = 0
    @State private var understandingProgress: Double = 0
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            // Ambient glow
            Circle()
                .fill(
                    RadialGradient(
                        colors: [Color.purple.opacity(0.3), Color.clear],
                        center: .center,
                        startRadius: 50,
                        endRadius: 400
                    )
                )
                .frame(width: 600, height: 600)
                .blur(radius: 150)
                .offset(y: -100)
            
            if isLoading || evaluation == nil {
                loadingView
            } else {
                evaluationView
            }
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 40) {
            Spacer()
            
            // Loading animation
            VStack(spacing: 24) {
                ZStack {
                    Circle()
                        .stroke(Color.purple.opacity(0.3), lineWidth: 4)
                        .frame(width: 80, height: 80)
                    
                    Circle()
                        .trim(from: 0, to: 0.7)
                        .stroke(
                            LinearGradient(
                                colors: [Color.purple, Color.blue],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            style: StrokeStyle(lineWidth: 4, lineCap: .round)
                        )
                        .frame(width: 80, height: 80)
                        .rotationEffect(.degrees(-90))
                        .animation(.linear(duration: 1.0).repeatForever(autoreverses: false), value: isLoading)
                }
                
                VStack(spacing: 8) {
                    Text("Evaluating your answer...")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(.white)
                    
                    Text("This may take a moment")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
            }
            
            Spacer()
            
            // Cancel button
            Button(action: onHome) {
                Text("Cancel")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 50)
        }
    }
    
    private var evaluationView: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            ScrollView {
                VStack(spacing: 32) {
                    // Progress rings
                    progressRingsView
                    
                    // Feedback
                    feedbackView
                    
                    // Unlock section
                    if let eval = evaluation, eval.unlock {
                        unlockView
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 120)
            }
            
            Spacer()
            
            // Action buttons
            actionButtonsView
        }
        .onAppear {
            animateResults()
        }
    }
    
    private var headerView: some View {
        HStack {
            Button(action: onHome) {
                Image(systemName: "xmark")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            Text("Your Results")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)
            
            Spacer()
            
            Color.clear
                .frame(width: 24, height: 24)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var progressRingsView: some View {
        HStack(spacing: 40) {
            // Effort score
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .stroke(Color.gray.opacity(0.3), lineWidth: 8)
                        .frame(width: 100, height: 100)
                    
                    Circle()
                        .trim(from: 0, to: effortProgress)
                        .stroke(
                            LinearGradient(
                                colors: [Color.cyan, Color.blue],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            style: StrokeStyle(lineWidth: 8, lineCap: .round)
                        )
                        .frame(width: 100, height: 100)
                        .rotationEffect(.degrees(-90))
                    
                    Text("\(evaluation?.effortPercent ?? 0)%")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                }
                
                Text("Effort")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.gray)
            }
            
            // Understanding score
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .stroke(Color.gray.opacity(0.3), lineWidth: 8)
                        .frame(width: 100, height: 100)
                    
                    Circle()
                        .trim(from: 0, to: understandingProgress)
                        .stroke(
                            LinearGradient(
                                colors: [Color.purple, Color.pink],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            style: StrokeStyle(lineWidth: 8, lineCap: .round)
                        )
                        .frame(width: 100, height: 100)
                        .rotationEffect(.degrees(-90))
                    
                    Text("\(evaluation?.understandingPercent ?? 0)%")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                }
                
                Text("Understanding")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.gray)
            }
        }
    }
    
    private var feedbackView: some View {
        VStack(spacing: 20) {
            // What's right
            if let eval = evaluation, !eval.whatIsRight.isEmpty {
                FeedbackCard(
                    title: "What you got right",
                    content: eval.whatIsRight,
                    icon: "checkmark.circle.fill",
                    color: .green
                )
            }
            
            // What's missing
            if let eval = evaluation, !eval.whatIsMissing.isEmpty {
                FeedbackCard(
                    title: "What to explore further",
                    content: eval.whatIsMissing,
                    icon: "lightbulb.fill",
                    color: .orange
                )
            }
            
            // Coach hint
            if let eval = evaluation, let hint = eval.coachHint {
                FeedbackCard(
                    title: "Coach tip",
                    content: hint,
                    icon: "person.fill.questionmark",
                    color: .purple
                )
            }
        }
    }
    
    private var unlockView: some View {
        VStack(spacing: 16) {
            // Unlock animation
            ZStack {
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [Color.green.opacity(0.3), Color.clear],
                            center: .center,
                            startRadius: 20,
                            endRadius: 60
                        )
                    )
                    .frame(width: 120, height: 120)
                    .scaleEffect(showUnlock ? 1.0 : 0.8)
                    .opacity(showUnlock ? 1.0 : 0.0)
                    .animation(.spring(response: 0.6, dampingFraction: 0.7), value: showUnlock)
                
                Image(systemName: "lock.open.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.green)
                    .scaleEffect(showUnlock ? 1.0 : 0.5)
                    .opacity(showUnlock ? 1.0 : 0.0)
                    .animation(.spring(response: 0.8, dampingFraction: 0.6).delay(0.2), value: showUnlock)
            }
            
            Text("Answer Unlocked!")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
                .opacity(showUnlock ? 1.0 : 0.0)
                .animation(.easeInOut(duration: 0.6).delay(0.4), value: showUnlock)
            
            Text("Great effort! You've earned the full explanation.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .opacity(showUnlock ? 1.0 : 0.0)
                .animation(.easeInOut(duration: 0.6).delay(0.5), value: showUnlock)
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.green.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.green.opacity(0.3), lineWidth: 1)
                )
        )
    }
    
    private var actionButtonsView: some View {
        VStack(spacing: 12) {
            if let eval = evaluation, eval.unlock {
                Button(action: onUnlock) {
                    HStack {
                        Text("View Full Answer")
                            .font(.system(size: 18, weight: .semibold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        LinearGradient(
                            colors: [Color.green, Color.teal],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(16)
                    .shadow(color: Color.green.opacity(0.3), radius: 20, x: 0, y: 10)
                }
            } else {
                Button(action: onRetry) {
                    HStack {
                        Text("Try Again")
                            .font(.system(size: 18, weight: .semibold))
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        LinearGradient(
                            colors: [Color.orange, Color.red],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(16)
                    .shadow(color: Color.orange.opacity(0.3), radius: 20, x: 0, y: 10)
                }
            }
            
            Button(action: onHome) {
                Text("Back to Home")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 50)
        .background(
            LinearGradient(
                colors: [Color.clear, Color.black.opacity(0.8), Color.black],
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
    
    private func animateResults() {
        guard let eval = evaluation else { return }
        
        // Animate progress rings
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation(.easeInOut(duration: 1.0)) {
                effortProgress = Double(eval.effortPercent) / 100.0
                understandingProgress = Double(eval.understandingPercent) / 100.0
            }
        }
        
        // Show unlock animation if unlocked
        if eval.unlock {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                showUnlock = true
            }
        }
    }
}

// MARK: - Feedback Card
struct FeedbackCard: View {
    let title: String
    let content: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(color)
                
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            Text(content)
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(color.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

#Preview {
    EvaluationScreen(
        question: "How does photosynthesis work?",
        attempt: "Photosynthesis is the process where plants use sunlight to make food...",
        evaluation: Evaluation(
            effortScore: 2.5,
            understandingScore: 2.0,
            copied: false,
            whatIsRight: "You correctly identified that plants use sunlight to make food.",
            whatIsMissing: "Consider explaining the role of chlorophyll and the chemical equation.",
            coachHint: "Think about what plants need besides sunlight.",
            levelUpTip: nil,
            unlock: true,
            fullExplanation: "Photosynthesis is a complex process..."
        ),
        isLoading: false,
        onUnlock: { },
        onRetry: { },
        onHome: { }
    )
}