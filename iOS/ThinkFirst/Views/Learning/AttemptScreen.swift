import SwiftUI

struct AttemptScreen: View {
    @EnvironmentObject var appState: AppState
    let question: String
    let onSubmit: (String, Bool) -> Void
    let onBack: () -> Void
    
    @State private var attempt = ""
    @State private var masteryMode = false
    @State private var showHint = false
    @State private var isShaking = false
    @FocusState private var isTextFieldFocused: Bool
    
    private let minimumWords = 10
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            // Main content
            ScrollView {
                VStack(spacing: 24) {
                    // Question
                    questionView
                    
                    // Attempt input
                    attemptInputView
                    
                    // Mastery mode toggle
                    masteryModeView
                    
                    // Hint
                    if showHint {
                        hintView
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 120) // Space for submit button
            }
            
            Spacer()
            
            // Submit button
            submitButtonView
        }
        .onAppear {
            isTextFieldFocused = true
            
            // Show hint after 3 seconds if no input
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                if attempt.isEmpty {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        showHint = true
                    }
                }
            }
        }
        .onChange(of: attempt) { _, newValue in
            if !newValue.isEmpty {
                withAnimation(.easeInOut(duration: 0.3)) {
                    showHint = false
                }
            }
        }
    }
    
    private var headerView: some View {
        HStack {
            Button(action: onBack) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            Text("Your Turn")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)
            
            Spacer()
            
            // Placeholder for symmetry
            Color.clear
                .frame(width: 24, height: 24)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var questionView: some View {
        VStack(spacing: 16) {
            Text("Explain this in your own words:")
                .font(.system(size: 16))
                .foregroundColor(.gray)
            
            Text(question)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
                .padding(20)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.purple.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.purple.opacity(0.3), lineWidth: 1)
                        )
                )
        }
    }
    
    private var attemptInputView: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Your explanation:")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white)
                
                Spacer()
                
                Text("\(wordCount)/\(minimumWords) words")
                    .font(.system(size: 14))
                    .foregroundColor(wordCount >= minimumWords ? .green : .gray)
            }
            
            TextField("Start typing your explanation...", text: $attempt, axis: .vertical)
                .textFieldStyle(PlainTextFieldStyle())
                .font(.system(size: 16))
                .foregroundColor(.white)
                .padding(16)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(
                                    isTextFieldFocused ? Color.purple.opacity(0.5) : Color.gray.opacity(0.3),
                                    lineWidth: isTextFieldFocused ? 2 : 1
                                )
                        )
                )
                .lineLimit(5...15)
                .focused($isTextFieldFocused)
                .scaleEffect(isShaking ? 0.98 : 1.0)
                .animation(.easeInOut(duration: 0.1), value: isShaking)
            
            // Voice input button (if premium)
            HStack {
                Spacer()
                VoiceInputButton(text: $attempt) { transcription in
                    attempt = transcription
                    isTextFieldFocused = false
                }
            }
        }
    }
    
    private var masteryModeView: some View {
        HStack(spacing: 12) {
            Toggle("", isOn: $masteryMode)
                .toggleStyle(SwitchToggleStyle(tint: .purple))
            
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("Mastery Mode")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                    
                    Text("2x XP")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.purple)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.purple.opacity(0.2))
                        .cornerRadius(8)
                }
                
                Text("Stricter evaluation, higher rewards")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            
            Spacer()
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(masteryMode ? Color.purple.opacity(0.1) : Color.gray.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(masteryMode ? Color.purple.opacity(0.3) : Color.gray.opacity(0.2), lineWidth: 1)
                )
        )
    }
    
    private var hintView: some View {
        HStack(spacing: 12) {
            Image(systemName: "lightbulb.fill")
                .font(.system(size: 16))
                .foregroundColor(.yellow)
            
            Text("Think about what you already know about this topic. Start with the basics and build up your explanation.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            
            Button(action: {
                withAnimation(.easeInOut(duration: 0.3)) {
                    showHint = false
                }
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.yellow.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.yellow.opacity(0.3), lineWidth: 1)
                )
        )
        .transition(.opacity.combined(with: .scale(scale: 0.95)))
    }
    
    private var submitButtonView: some View {
        VStack(spacing: 16) {
            if !canSubmit {
                Text("Write at least \(minimumWords) words to continue")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }
            
            Button(action: handleSubmit) {
                HStack {
                    Text("Submit Answer")
                        .font(.system(size: 18, weight: .semibold))
                    Image(systemName: "arrow.right")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(
                    LinearGradient(
                        colors: canSubmit ? [Color.purple, Color.blue] : [Color.gray],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(16)
                .shadow(
                    color: canSubmit ? Color.purple.opacity(0.3) : Color.clear,
                    radius: 20,
                    x: 0,
                    y: 10
                )
            }
            .disabled(!canSubmit)
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
    
    private var wordCount: Int {
        attempt.trimmingCharacters(in: .whitespacesAndNewlines)
            .components(separatedBy: .whitespacesAndNewlines)
            .filter { !$0.isEmpty }
            .count
    }
    
    private var canSubmit: Bool {
        wordCount >= minimumWords
    }
    
    private func handleSubmit() {
        guard canSubmit else {
            // Shake animation for invalid submission
            withAnimation(.easeInOut(duration: 0.1)) {
                isShaking = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                isShaking = false
            }
            return
        }
        
        // Hide keyboard
        isTextFieldFocused = false
        
        // Submit the attempt
        onSubmit(attempt, masteryMode)
    }
}

#Preview {
    AttemptScreen(
        question: "How does photosynthesis work?",
        onSubmit: { _, _ in },
        onBack: { }
    )
}