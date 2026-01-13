import SwiftUI

struct AnswerScreen: View {
    let question: String
    let attempt: String
    let evaluation: Evaluation?
    let onHome: () -> Void
    let onTryAnother: () -> Void
    
    @State private var showShareSheet = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            ScrollView {
                VStack(spacing: 24) {
                    // Question reminder
                    questionView
                    
                    // Full explanation
                    explanationView
                    
                    // Your attempt comparison
                    attemptComparisonView
                    
                    // Share section
                    shareView
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 120)
            }
            
            Spacer()
            
            // Action buttons
            actionButtonsView
        }
    }
    
    private var headerView: some View {
        HStack {
            Button(action: onHome) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            Text("Full Answer")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)
            
            Spacer()
            
            Button(action: { showShareSheet = true }) {
                Image(systemName: "square.and.arrow.up")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.white)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var questionView: some View {
        VStack(spacing: 12) {
            Text("Question")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.gray)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            Text(question)
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.purple.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.purple.opacity(0.3), lineWidth: 1)
                        )
                )
        }
    }
    
    private var explanationView: some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: "lightbulb.fill")
                    .font(.system(size: 16))
                    .foregroundColor(.yellow)
                
                Text("Complete Explanation")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            Text(evaluation?.fullExplanation ?? "")
                .font(.system(size: 15))
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.yellow.opacity(0.05))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.yellow.opacity(0.2), lineWidth: 1)
                        )
                )
        }
    }
    
    private var attemptComparisonView: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Your Attempt vs. Complete Answer")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            VStack(spacing: 12) {
                // Your attempt
                VStack(spacing: 8) {
                    HStack {
                        Text("Your Answer")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.blue)
                        
                        Spacer()
                        
                        if let eval = evaluation {
                            Text("\(eval.effortPercent)% effort")
                                .font(.system(size: 12))
                                .foregroundColor(.blue)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color.blue.opacity(0.2))
                                .cornerRadius(6)
                        }
                    }
                    
                    Text(attempt)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.leading)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color.blue.opacity(0.05))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color.blue.opacity(0.2), lineWidth: 1)
                                )
                        )
                }
                
                // Comparison insights
                if let eval = evaluation {
                    VStack(spacing: 8) {
                        if !eval.whatIsRight.isEmpty {
                            InsightCard(
                                title: "What you got right",
                                content: eval.whatIsRight,
                                color: .green
                            )
                        }
                        
                        if !eval.whatIsMissing.isEmpty {
                            InsightCard(
                                title: "What you could add",
                                content: eval.whatIsMissing,
                                color: .orange
                            )
                        }
                    }
                }
            }
        }
    }
    
    private var shareView: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Share Your Learning")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            if let eval = evaluation, eval.isHighEffort {
                VStack(spacing: 12) {
                    HStack(spacing: 12) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 16))
                            .foregroundColor(.yellow)
                        
                        Text("Great effort! Share your learning journey.")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                        
                        Spacer()
                    }
                    
                    Button(action: { showShareSheet = true }) {
                        HStack {
                            Image(systemName: "square.and.arrow.up")
                                .font(.system(size: 16))
                            Text("Share Progress")
                                .font(.system(size: 16, weight: .medium))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(
                            LinearGradient(
                                colors: [Color.purple.opacity(0.8), Color.blue.opacity(0.8)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(12)
                    }
                }
                .padding(16)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.yellow.opacity(0.05))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.yellow.opacity(0.2), lineWidth: 1)
                        )
                )
            }
        }
    }
    
    private var actionButtonsView: some View {
        VStack(spacing: 12) {
            Button(action: onTryAnother) {
                HStack {
                    Text("Ask Another Question")
                        .font(.system(size: 18, weight: .semibold))
                    Image(systemName: "plus")
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
        .sheet(isPresented: $showShareSheet) {
            ShareSheet(
                activityItems: [createShareText()],
                applicationActivities: nil
            )
        }
    }
    
    private func createShareText() -> String {
        let effortPercent = evaluation?.effortPercent ?? 0
        return """
        Just learned about: \(question)
        
        My effort score: \(effortPercent)%
        
        Learning with ThinkFirst! 🧠✨
        """
    }
}

// MARK: - Insight Card
struct InsightCard: View {
    let title: String
    let content: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(color)
                .textCase(.uppercase)
            
            Text(content)
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(color.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(color.opacity(0.2), lineWidth: 1)
                )
        )
    }
}

// MARK: - Share Sheet
struct ShareSheet: UIViewControllerRepresentable {
    let activityItems: [Any]
    let applicationActivities: [UIActivity]?
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(
            activityItems: activityItems,
            applicationActivities: applicationActivities
        )
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    AnswerScreen(
        question: "How does photosynthesis work?",
        attempt: "Photosynthesis is when plants use sunlight to make food. They take in carbon dioxide and water and use chlorophyll to convert it into glucose and oxygen.",
        evaluation: Evaluation(
            effortScore: 2.8,
            understandingScore: 2.3,
            copied: false,
            whatIsRight: "You correctly identified the main inputs and outputs of photosynthesis.",
            whatIsMissing: "Consider explaining the light and dark reactions in more detail.",
            coachHint: nil,
            levelUpTip: nil,
            unlock: true,
            fullExplanation: "Photosynthesis is a complex biological process that occurs in two main stages: the light-dependent reactions and the Calvin cycle. During the light reactions, chlorophyll absorbs photons and converts them into chemical energy (ATP and NADPH). In the Calvin cycle, this energy is used to fix carbon dioxide into glucose. The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2."
        ),
        onHome: { },
        onTryAnother: { }
    )
}