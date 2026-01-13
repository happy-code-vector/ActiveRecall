import SwiftUI

struct LearningFlow: View {
    @EnvironmentObject var appState: AppState
    @State private var currentStep: LearningStep = .attempt
    
    enum LearningStep {
        case attempt
        case evaluation
        case answer
    }
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            Group {
                switch currentStep {
                case .attempt:
                    AttemptScreen(
                        question: appState.currentQuestion,
                        onSubmit: { attempt, masteryMode in
                            appState.currentAttempt = attempt
                            submitAttempt(attempt: attempt, masteryMode: masteryMode)
                        },
                        onBack: {
                            appState.navigateTo(.home)
                        }
                    )
                    
                case .evaluation:
                    EvaluationScreen(
                        question: appState.currentQuestion,
                        attempt: appState.currentAttempt,
                        evaluation: appState.currentEvaluation,
                        isLoading: appState.isEvaluating,
                        onUnlock: {
                            currentStep = .answer
                        },
                        onRetry: {
                            currentStep = .attempt
                        },
                        onHome: {
                            appState.navigateTo(.home)
                        }
                    )
                    
                case .answer:
                    AnswerScreen(
                        question: appState.currentQuestion,
                        attempt: appState.currentAttempt,
                        evaluation: appState.currentEvaluation,
                        onHome: {
                            appState.navigateTo(.home)
                        },
                        onTryAnother: {
                            appState.navigateTo(.home)
                        }
                    )
                }
            }
            .transition(.asymmetric(
                insertion: .move(edge: .trailing).combined(with: .opacity),
                removal: .move(edge: .leading).combined(with: .opacity)
            ))
        }
    }
    
    private func submitAttempt(attempt: String, masteryMode: Bool) {
        appState.isEvaluating = true
        currentStep = .evaluation
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            // Mock evaluation response
            let mockEvaluation = Evaluation(
                effortScore: Double.random(in: 1.5...3.0),
                understandingScore: Double.random(in: 1.0...3.0),
                copied: false,
                whatIsRight: "You correctly identified the main concept and showed good understanding of the basic principles.",
                whatIsMissing: "Consider exploring the deeper mechanisms and real-world applications to strengthen your understanding.",
                coachHint: "Try thinking about how this concept connects to other things you know.",
                levelUpTip: nil,
                unlock: true,
                fullExplanation: "This is a comprehensive explanation of the concept you asked about. It includes detailed information about how it works, why it's important, and how it connects to other related topics."
            )
            
            appState.currentEvaluation = mockEvaluation
            appState.isEvaluating = false
            appState.incrementQuestionCount()
        }
    }
}

#Preview {
    LearningFlow()
        .environmentObject(AppState())
}