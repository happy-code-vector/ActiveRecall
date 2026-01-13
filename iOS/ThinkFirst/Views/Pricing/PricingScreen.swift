import SwiftUI

struct PricingScreen: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedPlan: PlanType = .solo
    @State private var isAnnual = true
    @State private var showingPurchase = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            headerView
            
            ScrollView {
                VStack(spacing: 32) {
                    // Hero section
                    heroSection
                    
                    // Billing toggle
                    billingToggle
                    
                    // Plans
                    plansSection
                    
                    // Features comparison
                    featuresSection
                    
                    // FAQ
                    faqSection
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 120)
            }
            
            Spacer()
            
            // Purchase button
            purchaseButton
        }
        .background(Color.black.ignoresSafeArea())
        .sheet(isPresented: $showingPurchase) {
            PurchaseFlow(plan: selectedPlan, isAnnual: isAnnual)
        }
    }
    
    private var headerView: some View {
        HStack {
            Button(action: {
                appState.navigateTo(.home)
            }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            Text("Upgrade")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
            
            Spacer()
            
            Color.clear
                .frame(width: 24, height: 24)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }
    
    private var heroSection: some View {
        VStack(spacing: 16) {
            Image(systemName: "crown.fill")
                .font(.system(size: 48))
                .foregroundStyle(
                    LinearGradient(
                        colors: [Color.yellow, Color.orange],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
            
            Text("Unlock Your Full Potential")
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
            
            Text("Get unlimited questions, voice input, mastery mode, and more premium features")
                .font(.system(size: 16))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
        }
        .padding(.top, 20)
    }
    
    private var billingToggle: some View {
        HStack(spacing: 0) {
            Button(action: {
                withAnimation(.easeInOut(duration: 0.2)) {
                    isAnnual = false
                }
            }) {
                Text("Monthly")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(isAnnual ? .gray : .white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 44)
                    .background(isAnnual ? Color.clear : Color.purple.opacity(0.3))
                    .cornerRadius(12)
            }
            
            Button(action: {
                withAnimation(.easeInOut(duration: 0.2)) {
                    isAnnual = true
                }
            }) {
                HStack {
                    Text("Annual")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(isAnnual ? .white : .gray)
                    
                    Text("Save 20%")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.green)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.green.opacity(0.2))
                        .cornerRadius(6)
                        .opacity(isAnnual ? 1.0 : 0.7)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(isAnnual ? Color.purple.opacity(0.3) : Color.clear)
                .cornerRadius(12)
            }
        }
        .padding(4)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )
        )
    }
    
    private var plansSection: some View {
        VStack(spacing: 16) {
            // Solo Plan
            PlanCard(
                plan: .solo,
                title: "Solo",
                subtitle: "Perfect for individual learners",
                monthlyPrice: 9.99,
                annualPrice: 7.99,
                isAnnual: isAnnual,
                isSelected: selectedPlan == .solo,
                features: [
                    "Unlimited questions",
                    "Voice input",
                    "Mastery mode",
                    "Coach tips",
                    "Advanced stats",
                    "Priority support"
                ],
                onSelect: {
                    selectedPlan = .solo
                }
            )
            
            // Family Plan
            PlanCard(
                plan: .family,
                title: "Family",
                subtitle: "Manage up to 6 family members",
                monthlyPrice: 19.99,
                annualPrice: 15.99,
                isAnnual: isAnnual,
                isSelected: selectedPlan == .family,
                features: [
                    "Everything in Solo",
                    "Up to 6 family members",
                    "Parent dashboard",
                    "Family leaderboard",
                    "Guardian controls",
                    "Weekly reports",
                    "Family streak freezes"
                ],
                isPopular: true,
                onSelect: {
                    selectedPlan = .family
                }
            )
        }
    }
    
    private var featuresSection: some View {
        VStack(spacing: 20) {
            Text("What's Included")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            VStack(spacing: 16) {
                FeatureRow(
                    icon: "infinity",
                    title: "Unlimited Questions",
                    description: "Ask as many questions as you want, no daily limits",
                    color: .blue
                )
                
                FeatureRow(
                    icon: "mic.fill",
                    title: "Voice Input",
                    description: "Speak your answers naturally with voice recognition",
                    color: .green
                )
                
                FeatureRow(
                    icon: "brain.head.profile",
                    title: "Mastery Mode",
                    description: "Challenge yourself with stricter evaluation for 2x XP",
                    color: .purple
                )
                
                FeatureRow(
                    icon: "lightbulb.fill",
                    title: "Coach Tips",
                    description: "Get personalized hints to improve your explanations",
                    color: .yellow
                )
                
                FeatureRow(
                    icon: "chart.line.uptrend.xyaxis",
                    title: "Advanced Analytics",
                    description: "Track your progress with detailed insights and trends",
                    color: .orange
                )
                
                if selectedPlan == .family {
                    FeatureRow(
                        icon: "person.2.fill",
                        title: "Family Management",
                        description: "Monitor and guide your family's learning journey",
                        color: .pink
                    )
                }
            }
        }
    }
    
    private var faqSection: some View {
        VStack(spacing: 16) {
            Text("Frequently Asked Questions")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            VStack(spacing: 12) {
                FAQItem(
                    question: "Can I cancel anytime?",
                    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                )
                
                FAQItem(
                    question: "What happens to my progress if I downgrade?",
                    answer: "Your learning history and badges are always saved. You'll just lose access to premium features like unlimited questions and voice input."
                )
                
                FAQItem(
                    question: "How does family sharing work?",
                    answer: "The family plan allows you to add up to 6 family members. Each person gets their own account with full premium features, and parents can monitor progress."
                )
                
                FAQItem(
                    question: "Is there a free trial?",
                    answer: "Yes! All new users get a 7-day free trial of premium features. No credit card required to start."
                )
            }
        }
    }
    
    private var purchaseButton: some View {
        VStack(spacing: 12) {
            Button(action: {
                showingPurchase = true
            }) {
                HStack {
                    Text("Start Free Trial")
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
            
            Text("7-day free trial, then \(selectedPlan == .solo ? "$\(isAnnual ? "7.99" : "9.99")" : "$\(isAnnual ? "15.99" : "19.99")")/\(isAnnual ? "month" : "month")")
                .font(.system(size: 14))
                .foregroundColor(.gray)
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
}

// MARK: - Plan Card
struct PlanCard: View {
    let plan: PlanType
    let title: String
    let subtitle: String
    let monthlyPrice: Double
    let annualPrice: Double
    let isAnnual: Bool
    let isSelected: Bool
    let features: [String]
    var isPopular: Bool = false
    let onSelect: () -> Void
    
    private var displayPrice: Double {
        isAnnual ? annualPrice : monthlyPrice
    }
    
    var body: some View {
        Button(action: onSelect) {
            VStack(spacing: 16) {
                // Header
                VStack(spacing: 8) {
                    HStack {
                        Text(title)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                        
                        Spacer()
                        
                        if isPopular {
                            Text("Most Popular")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(Color.purple)
                                .cornerRadius(12)
                        }
                    }
                    
                    Text(subtitle)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                
                // Price
                HStack(alignment: .bottom, spacing: 4) {
                    Text("$\(String(format: "%.2f", displayPrice))")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("/month")
                        .font(.system(size: 16))
                        .foregroundColor(.gray)
                    
                    Spacer()
                }
                
                // Features
                VStack(spacing: 8) {
                    ForEach(features, id: \.self) { feature in
                        HStack(spacing: 12) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 16))
                                .foregroundColor(.green)
                            
                            Text(feature)
                                .font(.system(size: 14))
                                .foregroundColor(.white)
                            
                            Spacer()
                        }
                    }
                }
            }
            .padding(20)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(isSelected ? Color.purple.opacity(0.2) : Color.gray.opacity(0.1))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(
                                isSelected ? Color.purple : Color.gray.opacity(0.2),
                                lineWidth: isSelected ? 2 : 1
                            )
                    )
            )
        }
    }
}

// MARK: - Feature Row
struct FeatureRow: View {
    let icon: String
    let title: String
    let description: String
    let color: Color
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                
                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }
            
            Spacer()
        }
        .padding(.vertical, 8)
    }
}

// MARK: - FAQ Item
struct FAQItem: View {
    let question: String
    let answer: String
    @State private var isExpanded = false
    
    var body: some View {
        VStack(spacing: 0) {
            Button(action: {
                withAnimation(.easeInOut(duration: 0.2)) {
                    isExpanded.toggle()
                }
            }) {
                HStack {
                    Text(question)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.leading)
                    
                    Spacer()
                    
                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
                .padding(.vertical, 16)
            }
            
            if isExpanded {
                Text(answer)
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.bottom, 16)
                    .transition(.opacity.combined(with: .scale(scale: 0.95, anchor: .top)))
            }
        }
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )
        )
        .padding(.horizontal, 16)
    }
}

// MARK: - Purchase Flow
struct PurchaseFlow: View {
    let plan: PlanType
    let isAnnual: Bool
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Purchase \(plan.rawValue.capitalized) Plan")
                    .font(.title)
                    .foregroundColor(.white)
                
                Spacer()
                
                Text("Purchase flow would be implemented here with StoreKit")
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                
                Spacer()
            }
            .background(Color.black.ignoresSafeArea())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.purple)
                }
            }
        }
    }
}

#Preview {
    PricingScreen()
        .environmentObject(AppState())
}