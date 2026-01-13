import SwiftUI

struct BadgeUnlockModal: View {
    let badge: Badge
    let onDismiss: () -> Void
    
    @State private var showBadge = false
    @State private var showText = false
    @State private var showButton = false
    @State private var particles: [Particle] = []
    
    var body: some View {
        ZStack {
            // Background
            Color.black.opacity(0.9)
                .ignoresSafeArea()
                .onTapGesture {
                    dismissModal()
                }
            
            // Particle effects
            ForEach(particles, id: \.id) { particle in
                Circle()
                    .fill(Color(hex: badge.color))
                    .frame(width: particle.size, height: particle.size)
                    .position(particle.position)
                    .opacity(particle.opacity)
                    .scaleEffect(particle.scale)
            }
            
            VStack(spacing: 32) {
                Spacer()
                
                // Badge display
                VStack(spacing: 24) {
                    ZStack {
                        // Glow effect
                        Circle()
                            .fill(
                                RadialGradient(
                                    colors: [
                                        Color(hex: badge.color).opacity(0.6),
                                        Color(hex: badge.color).opacity(0.3),
                                        Color.clear
                                    ],
                                    center: .center,
                                    startRadius: 60,
                                    endRadius: 120
                                )
                            )
                            .frame(width: 240, height: 240)
                            .blur(radius: 20)
                            .scaleEffect(showBadge ? 1.0 : 0.5)
                            .opacity(showBadge ? 1.0 : 0.0)
                            .animation(.easeOut(duration: 0.8), value: showBadge)
                        
                        // Badge circle
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [Color(hex: badge.color), Color(hex: badge.colorEnd)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 120, height: 120)
                            .shadow(
                                color: Color(hex: badge.color).opacity(0.5),
                                radius: 20,
                                x: 0,
                                y: 10
                            )
                            .scaleEffect(showBadge ? 1.0 : 0.3)
                            .opacity(showBadge ? 1.0 : 0.0)
                            .animation(.spring(response: 0.8, dampingFraction: 0.6), value: showBadge)
                        
                        // Badge icon
                        Image(systemName: badge.iconName)
                            .font(.system(size: 48, weight: .medium))
                            .foregroundColor(.white)
                            .scaleEffect(showBadge ? 1.0 : 0.3)
                            .opacity(showBadge ? 1.0 : 0.0)
                            .animation(.spring(response: 1.0, dampingFraction: 0.7).delay(0.2), value: showBadge)
                    }
                    
                    // Text content
                    VStack(spacing: 16) {
                        Text("Badge Unlocked!")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.white)
                            .opacity(showText ? 1.0 : 0.0)
                            .offset(y: showText ? 0 : 20)
                            .animation(.easeOut(duration: 0.6).delay(0.5), value: showText)
                        
                        Text(badge.name)
                            .font(.system(size: 24, weight: .semibold))
                            .foregroundColor(Color(hex: badge.color))
                            .opacity(showText ? 1.0 : 0.0)
                            .offset(y: showText ? 0 : 20)
                            .animation(.easeOut(duration: 0.6).delay(0.7), value: showText)
                        
                        Text(badge.description)
                            .font(.system(size: 16))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                            .opacity(showText ? 1.0 : 0.0)
                            .offset(y: showText ? 0 : 20)
                            .animation(.easeOut(duration: 0.6).delay(0.9), value: showText)
                        
                        // Rarity indicator
                        Text(badge.rarity.rawValue.capitalized)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(badge.rarity.color)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 6)
                            .background(badge.rarity.color.opacity(0.2))
                            .cornerRadius(12)
                            .opacity(showText ? 1.0 : 0.0)
                            .offset(y: showText ? 0 : 20)
                            .animation(.easeOut(duration: 0.6).delay(1.1), value: showText)
                    }
                }
                
                Spacer()
                
                // Continue button
                Button(action: dismissModal) {
                    HStack {
                        Text("Continue")
                            .font(.system(size: 18, weight: .semibold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        LinearGradient(
                            colors: [Color(hex: badge.color), Color(hex: badge.colorEnd)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(16)
                    .shadow(
                        color: Color(hex: badge.color).opacity(0.3),
                        radius: 20,
                        x: 0,
                        y: 10
                    )
                }
                .padding(.horizontal, 40)
                .opacity(showButton ? 1.0 : 0.0)
                .offset(y: showButton ? 0 : 30)
                .animation(.easeOut(duration: 0.6).delay(1.3), value: showButton)
                .padding(.bottom, 50)
            }
        }
        .onAppear {
            startAnimationSequence()
            createParticles()
            HapticUtils.triggerBadgeUnlockHaptic()
        }
    }
    
    private func startAnimationSequence() {
        // Badge appears
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            showBadge = true
        }
        
        // Text appears
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            showText = true
        }
        
        // Button appears
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            showButton = true
        }
    }
    
    private func createParticles() {
        particles = (0..<20).map { _ in
            Particle(
                id: UUID(),
                position: CGPoint(
                    x: CGFloat.random(in: 50...350),
                    y: CGFloat.random(in: 200...600)
                ),
                size: CGFloat.random(in: 4...12),
                opacity: Double.random(in: 0.3...0.8),
                scale: Double.random(in: 0.5...1.5)
            )
        }
        
        // Animate particles
        withAnimation(.easeOut(duration: 2.0)) {
            for i in particles.indices {
                particles[i].position.y -= CGFloat.random(in: 100...300)
                particles[i].opacity = 0.0
                particles[i].scale *= 1.5
            }
        }
    }
    
    private func dismissModal() {
        withAnimation(.easeInOut(duration: 0.3)) {
            showBadge = false
            showText = false
            showButton = false
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            onDismiss()
        }
    }
}

// MARK: - Particle Model
struct Particle {
    let id: UUID
    var position: CGPoint
    let size: CGFloat
    var opacity: Double
    var scale: Double
}

#Preview {
    BadgeUnlockModal(
        badge: BadgeDefinitions.allBadges.first!,
        onDismiss: { }
    )
}