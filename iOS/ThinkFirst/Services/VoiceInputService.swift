import Foundation
import Speech
import AVFoundation

class VoiceInputService: NSObject, ObservableObject {
    @Published var isRecording = false
    @Published var transcribedText = ""
    @Published var isAuthorized = false
    @Published var errorMessage: String?
    
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    
    override init() {
        super.init()
        checkPermissions()
    }
    
    func requestPermissions() async -> Bool {
        // Request speech recognition permission
        let speechStatus = await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { status in
                continuation.resume(returning: status)
            }
        }
        
        guard speechStatus == .authorized else {
            await MainActor.run {
                errorMessage = "Speech recognition permission denied"
            }
            return false
        }
        
        // Request microphone permission
        let micStatus = await withCheckedContinuation { continuation in
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                continuation.resume(returning: granted)
            }
        }
        
        guard micStatus else {
            await MainActor.run {
                errorMessage = "Microphone permission denied"
            }
            return false
        }
        
        await MainActor.run {
            isAuthorized = true
            errorMessage = nil
        }
        
        return true
    }
    
    private func checkPermissions() {
        let speechStatus = SFSpeechRecognizer.authorizationStatus()
        let micStatus = AVAudioSession.sharedInstance().recordPermission
        
        isAuthorized = speechStatus == .authorized && micStatus == .granted
    }
    
    func startRecording() {
        guard !isRecording else { return }
        guard isAuthorized else {
            errorMessage = "Permissions not granted"
            return
        }
        
        // Cancel any existing task
        recognitionTask?.cancel()
        recognitionTask = nil
        
        // Configure audio session
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
            try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
        } catch {
            errorMessage = "Audio session setup failed: \(error.localizedDescription)"
            return
        }
        
        // Create recognition request
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        guard let recognitionRequest = recognitionRequest else {
            errorMessage = "Unable to create recognition request"
            return
        }
        
        recognitionRequest.shouldReportPartialResults = true
        
        // Get audio input node
        let inputNode = audioEngine.inputNode
        
        // Create recognition task
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            DispatchQueue.main.async {
                if let result = result {
                    self?.transcribedText = result.bestTranscription.formattedString
                }
                
                if let error = error {
                    self?.errorMessage = error.localizedDescription
                    self?.stopRecording()
                }
            }
        }
        
        // Configure audio format
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            recognitionRequest.append(buffer)
        }
        
        // Start audio engine
        audioEngine.prepare()
        do {
            try audioEngine.start()
            isRecording = true
            errorMessage = nil
            HapticUtils.triggerVoiceStartHaptic()
        } catch {
            errorMessage = "Audio engine failed to start: \(error.localizedDescription)"
        }
    }
    
    func stopRecording() {
        guard isRecording else { return }
        
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        
        recognitionRequest?.endAudio()
        recognitionRequest = nil
        
        recognitionTask?.cancel()
        recognitionTask = nil
        
        isRecording = false
        HapticUtils.triggerVoiceStopHaptic()
        
        // Reset audio session
        do {
            try AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        } catch {
            print("Error deactivating audio session: \(error)")
        }
    }
    
    func clearTranscription() {
        transcribedText = ""
    }
}

// MARK: - Voice Input Button
struct VoiceInputButton: View {
    @StateObject private var voiceService = VoiceInputService()
    @Binding var text: String
    let onTranscriptionUpdate: (String) -> Void
    
    var body: some View {
        Button(action: {
            if voiceService.isRecording {
                voiceService.stopRecording()
                onTranscriptionUpdate(voiceService.transcribedText)
            } else {
                Task {
                    if voiceService.isAuthorized || await voiceService.requestPermissions() {
                        voiceService.startRecording()
                    }
                }
            }
        }) {
            ZStack {
                Circle()
                    .fill(
                        voiceService.isRecording ?
                        LinearGradient(colors: [Color.red, Color.orange], startPoint: .top, endPoint: .bottom) :
                        LinearGradient(colors: [Color.blue, Color.purple], startPoint: .top, endPoint: .bottom)
                    )
                    .frame(width: 56, height: 56)
                    .scaleEffect(voiceService.isRecording ? 1.1 : 1.0)
                    .animation(.easeInOut(duration: 0.1), value: voiceService.isRecording)
                
                Image(systemName: voiceService.isRecording ? "stop.fill" : "mic.fill")
                    .font(.system(size: 24))
                    .foregroundColor(.white)
            }
        }
        .disabled(!voiceService.isAuthorized && !voiceService.isRecording)
        .onChange(of: voiceService.transcribedText) { _, newValue in
            if !newValue.isEmpty {
                text = newValue
            }
        }
        .alert("Voice Input Error", isPresented: .constant(voiceService.errorMessage != nil)) {
            Button("OK") {
                voiceService.errorMessage = nil
            }
        } message: {
            Text(voiceService.errorMessage ?? "")
        }
    }
}

#Preview {
    VoiceInputButton(text: .constant(""), onTranscriptionUpdate: { _ in })
}