import SwiftUI

struct SettingsScreen: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss
    @State private var notificationsEnabled = true
    @State private var hapticFeedbackEnabled = true
    @State private var voiceInputEnabled = true
    @State private var showingDeleteAccount = false
    @State private var showingLogout = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                headerView
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Account section
                        accountSection
                        
                        // Preferences section
                        preferencesSection
                        
                        // Learning section
                        learningSection
                        
                        // Privacy section
                        privacySection
                        
                        // Support section
                        supportSection
                        
                        // Danger zone
                        dangerZone
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 50)
                }
            }
            .background(Color.black.ignoresSafeArea())
        }
        .alert("Sign Out", isPresented: $showingLogout) {
            Button("Cancel", role: .cancel) { }
            Button("Sign Out", role: .destructive) {
                signOut()
            }
        } message: {
            Text("Are you sure you want to sign out?")
        }
        .alert("Delete Account", isPresented: $showingDeleteAccount) {
            Button("Cancel", role: .cancel) { }
            Button("Delete", role: .destructive) {
                deleteAccount()
            }
        } message: {
            Text("This action cannot be undone. All your data will be permanently deleted.")
        }
    }
    
    private var headerView: some View {
        HStack {
            Button("Cancel") {
                dismiss()
            }
            .foregroundColor(.purple)
            
            Spacer()
            
            Text("Settings")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)
            
            Spacer()
            
            Button("Done") {
                dismiss()
            }
            .foregroundColor(.purple)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var accountSection: some View {
        SettingsSection(title: "Account") {
            VStack(spacing: 0) {
                SettingsRow(
                    icon: "person.circle.fill",
                    title: "Profile",
                    subtitle: appState.displayName,
                    color: .blue
                ) {
                    // Navigate to profile edit
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsRow(
                    icon: "crown.fill",
                    title: "Subscription",
                    subtitle: appState.plan.rawValue.capitalized,
                    color: .yellow
                ) {
                    // Navigate to subscription management
                }
                
                if appState.userType == .student {
                    Divider()
                        .background(Color.gray.opacity(0.3))
                        .padding(.leading, 52)
                    
                    SettingsRow(
                        icon: "person.2.fill",
                        title: "Connect to Parent",
                        subtitle: "Link your account",
                        color: .green
                    ) {
                        // Navigate to parent connection
                    }
                }
            }
        }
    }
    
    private var preferencesSection: some View {
        SettingsSection(title: "Preferences") {
            VStack(spacing: 0) {
                SettingsToggleRow(
                    icon: "bell.fill",
                    title: "Notifications",
                    subtitle: "Streak reminders and updates",
                    color: .orange,
                    isOn: $notificationsEnabled
                )
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsToggleRow(
                    icon: "iphone.radiowaves.left.and.right",
                    title: "Haptic Feedback",
                    subtitle: "Vibration for interactions",
                    color: .purple,
                    isOn: $hapticFeedbackEnabled
                )
                
                if appState.isPremium {
                    Divider()
                        .background(Color.gray.opacity(0.3))
                        .padding(.leading, 52)
                    
                    SettingsToggleRow(
                        icon: "mic.fill",
                        title: "Voice Input",
                        subtitle: "Speak your answers",
                        color: .green,
                        isOn: $voiceInputEnabled
                    )
                }
            }
        }
    }
    
    private var learningSection: some View {
        SettingsSection(title: "Learning") {
            VStack(spacing: 0) {
                SettingsRow(
                    icon: "graduationcap.fill",
                    title: "Grade Level",
                    subtitle: appState.gradeLevel?.displayName ?? "Not set",
                    color: .blue
                ) {
                    // Navigate to grade selection
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsRow(
                    icon: "clock.fill",
                    title: "Study Reminders",
                    subtitle: "Set daily reminder times",
                    color: .orange
                ) {
                    // Navigate to reminder settings
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsRow(
                    icon: "chart.line.uptrend.xyaxis",
                    title: "Progress Export",
                    subtitle: "Download your learning data",
                    color: .green
                ) {
                    exportProgress()
                }
            }
        }
    }
    
    private var privacySection: some View {
        SettingsSection(title: "Privacy & Security") {
            VStack(spacing: 0) {
                SettingsRow(
                    icon: "hand.raised.fill",
                    title: "Privacy Policy",
                    subtitle: "How we protect your data",
                    color: .blue
                ) {
                    openPrivacyPolicy()
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsRow(
                    icon: "doc.text.fill",
                    title: "Terms of Service",
                    subtitle: "Usage terms and conditions",
                    color: .gray
                ) {
                    openTermsOfService()
                }
                
                if appState.userType == .parent {
                    Divider()
                        .background(Color.gray.opacity(0.3))
                        .padding(.leading, 52)
                    
                    SettingsRow(
                        icon: "lock.fill",
                        title: "Guardian PIN",
                        subtitle: "Set parental controls PIN",
                        color: .red
                    ) {
                        // Navigate to PIN setup
                    }
                }
            }
        }
    }
    
    private var supportSection: some View {
        SettingsSection(title: "Support") {
            VStack(spacing: 0) {
                SettingsRow(
                    icon: "questionmark.circle.fill",
                    title: "Help Center",
                    subtitle: "FAQs and guides",
                    color: .blue
                ) {
                    openHelpCenter()
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsRow(
                    icon: "envelope.fill",
                    title: "Contact Support",
                    subtitle: "Get help from our team",
                    color: .green
                ) {
                    contactSupport()
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsRow(
                    icon: "star.fill",
                    title: "Rate App",
                    subtitle: "Leave a review on the App Store",
                    color: .yellow
                ) {
                    rateApp()
                }
            }
        }
    }
    
    private var dangerZone: some View {
        SettingsSection(title: "Account") {
            VStack(spacing: 0) {
                SettingsRow(
                    icon: "rectangle.portrait.and.arrow.right",
                    title: "Sign Out",
                    subtitle: "Sign out of your account",
                    color: .orange
                ) {
                    showingLogout = true
                }
                
                Divider()
                    .background(Color.gray.opacity(0.3))
                    .padding(.leading, 52)
                
                SettingsRow(
                    icon: "trash.fill",
                    title: "Delete Account",
                    subtitle: "Permanently delete your account",
                    color: .red
                ) {
                    showingDeleteAccount = true
                }
            }
        }
    }
    
    // MARK: - Actions
    private func signOut() {
        appState.isAuthenticated = false
        appState.userType = nil
        appState.displayName = ""
        appState.navigateTo(.splash)
        dismiss()
    }
    
    private func deleteAccount() {
        // TODO: Implement account deletion
        signOut()
    }
    
    private func exportProgress() {
        // TODO: Implement progress export
    }
    
    private func openPrivacyPolicy() {
        if let url = URL(string: "https://thinkfirst.app/privacy") {
            UIApplication.shared.open(url)
        }
    }
    
    private func openTermsOfService() {
        if let url = URL(string: "https://thinkfirst.app/terms") {
            UIApplication.shared.open(url)
        }
    }
    
    private func openHelpCenter() {
        if let url = URL(string: "https://help.thinkfirst.app") {
            UIApplication.shared.open(url)
        }
    }
    
    private func contactSupport() {
        if let url = URL(string: "mailto:support@thinkfirst.app") {
            UIApplication.shared.open(url)
        }
    }
    
    private func rateApp() {
        if let url = URL(string: "https://apps.apple.com/app/thinkfirst/id123456789?action=write-review") {
            UIApplication.shared.open(url)
        }
    }
}

// MARK: - Settings Components
struct SettingsSection<Content: View>: View {
    let title: String
    let content: Content
    
    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.gray)
                .textCase(.uppercase)
                .padding(.horizontal, 20)
            
            content
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                        )
                )
        }
    }
}

struct SettingsRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(color)
                    .frame(width: 20)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 16))
                        .foregroundColor(.white)
                    
                    Text(subtitle)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            .padding(.vertical, 16)
            .padding(.horizontal, 20)
        }
    }
}

struct SettingsToggleRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
    @Binding var isOn: Bool
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(color)
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                
                Text(subtitle)
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            Toggle("", isOn: $isOn)
                .toggleStyle(SwitchToggleStyle(tint: color))
        }
        .padding(.vertical, 16)
        .padding(.horizontal, 20)
    }
}

#Preview {
    SettingsScreen()
        .environmentObject(AppState())
}