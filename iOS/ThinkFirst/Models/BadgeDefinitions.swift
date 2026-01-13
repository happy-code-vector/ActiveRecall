import SwiftUI

extension BadgeCategory {
    var displayName: String {
        switch self {
        case .streak: return "Streaks"
        case .mastery: return "Mastery"
        case .milestone: return "Milestones"
        }
    }
}

extension BadgeRarity {
    var color: Color {
        switch self {
        case .common: return .gray
        case .rare: return .blue
        case .epic: return .purple
        case .legendary: return .yellow
        }
    }
}

struct BadgeDefinitions {
    static let allBadges: [Badge] = [
        // STREAK BADGES (6)
        Badge(
            id: "ignition",
            name: "Ignition",
            description: "The spark has been struck",
            visual: "A single matchstick striking a spark against a dark surface",
            category: .streak,
            rarity: .common,
            iconName: "flame.fill",
            color: "#FF6B35",
            colorEnd: "#FF4500",
            requirement: "3-day streak",
            criteria: BadgeCriteria(type: "streak", value: 3)
        ),
        Badge(
            id: "the_furnace",
            name: "The Furnace",
            description: "Heat is building, momentum is real",
            visual: "An industrial furnace door glowing orange with heat leaking out",
            category: .streak,
            rarity: .rare,
            iconName: "flame.fill",
            color: "#FF8C42",
            colorEnd: "#FF6B35",
            requirement: "7-day streak",
            criteria: BadgeCriteria(type: "streak", value: 7)
        ),
        Badge(
            id: "momentum",
            name: "Momentum",
            description: "The flywheel is spinning",
            visual: "A heavy flywheel or turbine spinning with green motion blur",
            category: .streak,
            rarity: .rare,
            iconName: "arrow.triangle.2.circlepath",
            color: "#00FF94",
            colorEnd: "#00CC75",
            requirement: "14-day streak",
            criteria: BadgeCriteria(type: "streak", value: 14)
        ),
        Badge(
            id: "blue_giant",
            name: "Blue Giant",
            description: "Burning with the hottest intensity",
            visual: "A massive star burning with intense blue/white light",
            category: .streak,
            rarity: .epic,
            iconName: "star.fill",
            color: "#00D9FF",
            colorEnd: "#0099CC",
            requirement: "30-day streak",
            criteria: BadgeCriteria(type: "streak", value: 30)
        ),
        Badge(
            id: "supernova",
            name: "Supernova",
            description: "Explosive learning energy",
            visual: "A star exploding in brilliant colors",
            category: .streak,
            rarity: .epic,
            iconName: "burst",
            color: "#FF00FF",
            colorEnd: "#8A2BE2",
            requirement: "60-day streak",
            criteria: BadgeCriteria(type: "streak", value: 60)
        ),
        Badge(
            id: "the_century",
            name: "The Century",
            description: "A hundred days of dedication",
            visual: "A golden monument with '100' carved in stone",
            category: .streak,
            rarity: .legendary,
            iconName: "crown.fill",
            color: "#FFD700",
            colorEnd: "#FFA500",
            requirement: "100-day streak",
            criteria: BadgeCriteria(type: "streak", value: 100)
        ),
        
        // MASTERY BADGES (7)
        Badge(
            id: "synapse",
            name: "Synapse",
            description: "First neural connection formed",
            visual: "Two neurons connecting with a spark of electricity",
            category: .mastery,
            rarity: .common,
            iconName: "brain.head.profile",
            color: "#9D4EDD",
            colorEnd: "#7B2CBF",
            requirement: "First mastery mode unlock",
            criteria: BadgeCriteria(type: "mastery_unlocks", value: 1)
        ),
        Badge(
            id: "neural_network",
            name: "Neural Network",
            description: "Building complex understanding",
            visual: "A web of interconnected neurons glowing softly",
            category: .mastery,
            rarity: .rare,
            iconName: "network",
            color: "#6A4C93",
            colorEnd: "#5A3A7C",
            requirement: "5 mastery mode unlocks",
            criteria: BadgeCriteria(type: "mastery_unlocks", value: 5)
        ),
        Badge(
            id: "deep_thinker",
            name: "Deep Thinker",
            description: "Diving into complex concepts",
            visual: "A person's silhouette with gears turning in their head",
            category: .mastery,
            rarity: .rare,
            iconName: "gearshape.2.fill",
            color: "#4361EE",
            colorEnd: "#3F37C9",
            requirement: "10 mastery mode unlocks",
            criteria: BadgeCriteria(type: "mastery_unlocks", value: 10)
        ),
        Badge(
            id: "perfectionist",
            name: "Perfectionist",
            description: "Flawless understanding achieved",
            visual: "A perfect crystal with light refracting through it",
            category: .mastery,
            rarity: .epic,
            iconName: "diamond.fill",
            color: "#00F5FF",
            colorEnd: "#0080FF",
            requirement: "Perfect score in mastery mode",
            criteria: BadgeCriteria(type: "perfect_score", value: nil)
        ),
        Badge(
            id: "night_owl",
            name: "Night Owl",
            description: "Learning burns bright in darkness",
            visual: "An owl perched on books under moonlight",
            category: .mastery,
            rarity: .rare,
            iconName: "moon.stars.fill",
            color: "#4C956C",
            colorEnd: "#2F5233",
            requirement: "Learn after 10 PM",
            criteria: BadgeCriteria(type: "late_night", value: nil)
        ),
        Badge(
            id: "early_bird",
            name: "Early Bird",
            description: "Dawn brings fresh insights",
            visual: "A bird singing at sunrise with books nearby",
            category: .mastery,
            rarity: .rare,
            iconName: "sunrise.fill",
            color: "#F77F00",
            colorEnd: "#D62828",
            requirement: "Learn before 6 AM",
            criteria: BadgeCriteria(type: "early_morning", value: nil)
        ),
        Badge(
            id: "the_polymath",
            name: "The Polymath",
            description: "Master of many domains",
            visual: "A tree with branches representing different subjects",
            category: .mastery,
            rarity: .legendary,
            iconName: "tree.fill",
            color: "#2D6A4F",
            colorEnd: "#1B4332",
            requirement: "25 mastery mode unlocks",
            criteria: BadgeCriteria(type: "mastery_unlocks", value: 25)
        ),
        
        // MILESTONE BADGES (7)
        Badge(
            id: "the_initiate",
            name: "The Initiate",
            description: "First step on the learning journey",
            visual: "A single footprint on a path leading into the distance",
            category: .milestone,
            rarity: .common,
            iconName: "figure.walk",
            color: "#06D6A0",
            colorEnd: "#048A81",
            requirement: "First unlock",
            criteria: BadgeCriteria(type: "total_unlocks", value: 1)
        ),
        Badge(
            id: "the_explorer",
            name: "The Explorer",
            description: "Venturing into new territories",
            visual: "A compass pointing toward unknown lands",
            category: .milestone,
            rarity: .common,
            iconName: "location.fill",
            color: "#118AB2",
            colorEnd: "#073B4C",
            requirement: "10 unlocks",
            criteria: BadgeCriteria(type: "total_unlocks", value: 10)
        ),
        Badge(
            id: "the_scholar",
            name: "The Scholar",
            description: "Dedicated to the pursuit of knowledge",
            visual: "Ancient scrolls and quills arranged on a wooden desk",
            category: .milestone,
            rarity: .rare,
            iconName: "book.fill",
            color: "#8B5A3C",
            colorEnd: "#6F4E37",
            requirement: "25 unlocks",
            criteria: BadgeCriteria(type: "total_unlocks", value: 25)
        ),
        Badge(
            id: "the_sage",
            name: "The Sage",
            description: "Wisdom flows through understanding",
            visual: "An ancient tree with glowing leaves of knowledge",
            category: .milestone,
            rarity: .rare,
            iconName: "leaf.fill",
            color: "#52B788",
            colorEnd: "#2D6A4F",
            requirement: "50 unlocks",
            criteria: BadgeCriteria(type: "total_unlocks", value: 50)
        ),
        Badge(
            id: "the_virtuoso",
            name: "The Virtuoso",
            description: "Mastery through persistent practice",
            visual: "Musical notes transforming into mathematical equations",
            category: .milestone,
            rarity: .epic,
            iconName: "music.note",
            color: "#E63946",
            colorEnd: "#A4161A",
            requirement: "100 unlocks",
            criteria: BadgeCriteria(type: "total_unlocks", value: 100)
        ),
        Badge(
            id: "the_legend",
            name: "The Legend",
            description: "Stories will be told of this dedication",
            visual: "A golden statue on a pedestal with rays of light",
            category: .milestone,
            rarity: .epic,
            iconName: "trophy.fill",
            color: "#FFB700",
            colorEnd: "#FF8500",
            requirement: "250 unlocks",
            criteria: BadgeCriteria(type: "total_unlocks", value: 250)
        ),
        Badge(
            id: "the_apex",
            name: "The Apex",
            description: "The pinnacle of learning achievement",
            visual: "A mountain peak touching the stars",
            category: .milestone,
            rarity: .legendary,
            iconName: "mountain.2.fill",
            color: "#7209B7",
            colorEnd: "#480CA8",
            requirement: "500 unlocks",
            criteria: BadgeCriteria(type: "total_unlocks", value: 500)
        )
    ]
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}