import Foundation

struct ValidationUtils {
    
    // MARK: - Word Count Validation
    static func validateMinimumWords(_ text: String, minimum: Int = 10) -> ValidationResult {
        let words = getWordCount(text)
        
        if words < minimum {
            let remaining = minimum - words
            let message = remaining == 1 ? 
                "Add 1 more word to continue" : 
                "Add \(remaining) more words to continue"
            return ValidationResult(valid: false, message: message)
        }
        
        return ValidationResult(valid: true, message: nil)
    }
    
    static func getWordCount(_ text: String) -> Int {
        return text.trimmingCharacters(in: .whitespacesAndNewlines)
            .components(separatedBy: .whitespacesAndNewlines)
            .filter { !$0.isEmpty }
            .count
    }
    
    // MARK: - Nonsense Detection
    static func validateAttemptForNonsense(_ text: String) -> ValidationResult {
        let cleanText = text.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        
        // Check for empty or too short
        if cleanText.count < 10 {
            return ValidationResult(valid: false, message: "Please write a more detailed explanation.")
        }
        
        // Check for keyboard smashing patterns
        if isKeyboardSmashing(cleanText) {
            return ValidationResult(valid: false, message: "Please write a real explanation, not random characters.")
        }
        
        // Check for repeated characters
        if hasExcessiveRepeatedCharacters(cleanText) {
            return ValidationResult(valid: false, message: "Please avoid repeating characters excessively.")
        }
        
        // Check vowel ratio (real text should have reasonable vowel distribution)
        if hasUnreasonableVowelRatio(cleanText) {
            return ValidationResult(valid: false, message: "Please write a meaningful explanation.")
        }
        
        // Check for common nonsense patterns
        if containsNonsensePatterns(cleanText) {
            return ValidationResult(valid: false, message: "Please provide a genuine explanation.")
        }
        
        return ValidationResult(valid: true, message: nil)
    }
    
    private static func isKeyboardSmashing(_ text: String) -> Bool {
        // Check for common keyboard patterns
        let keyboardPatterns = [
            "qwerty", "asdf", "zxcv", "qwertyuiop", "asdfghjkl", "zxcvbnm",
            "123456", "abcdef", "qazwsx", "plmokn"
        ]
        
        for pattern in keyboardPatterns {
            if text.contains(pattern) && pattern.count > 4 {
                return true
            }
        }
        
        // Check for alternating patterns
        let alternatingPatterns = ["ababab", "121212", "xyxyxy"]
        for pattern in alternatingPatterns {
            if text.contains(pattern) {
                return true
            }
        }
        
        return false
    }
    
    private static func hasExcessiveRepeatedCharacters(_ text: String) -> Bool {
        var consecutiveCount = 1
        var lastChar: Character?
        
        for char in text {
            if char == lastChar {
                consecutiveCount += 1
                if consecutiveCount >= 4 { // 4 or more consecutive same characters
                    return true
                }
            } else {
                consecutiveCount = 1
                lastChar = char
            }
        }
        
        return false
    }
    
    private static func hasUnreasonableVowelRatio(_ text: String) -> Bool {
        let vowels = Set("aeiou")
        let letters = text.filter { $0.isLetter }
        
        guard letters.count > 10 else { return false }
        
        let vowelCount = letters.filter { vowels.contains($0) }.count
        let vowelRatio = Double(vowelCount) / Double(letters.count)
        
        // Reasonable vowel ratio is typically between 20% and 60%
        return vowelRatio < 0.15 || vowelRatio > 0.7
    }
    
    private static func containsNonsensePatterns(_ text: String) -> Bool {
        let nonsensePatterns = [
            "hahaha", "lolol", "hehehe", "blahblah", "lalala",
            "nanana", "dadada", "bababa", "gagaga", "tatata",
            "idk", "dunno", "whatever", "nothing", "no idea"
        ]
        
        for pattern in nonsensePatterns {
            if text.contains(pattern) && text.count < pattern.count * 3 {
                return true
            }
        }
        
        return false
    }
    
    // MARK: - Copy/Paste Detection
    static func detectPotentialCopying(_ text: String, threshold: Int = 100) -> Bool {
        // Simple heuristic: very long text pasted at once might be copied
        return text.count > threshold
    }
    
    // MARK: - Content Quality Checks
    static func assessContentQuality(_ text: String) -> ContentQuality {
        let wordCount = getWordCount(text)
        let sentenceCount = getSentenceCount(text)
        let avgWordsPerSentence = sentenceCount > 0 ? Double(wordCount) / Double(sentenceCount) : 0
        
        var score = 0
        var feedback: [String] = []
        
        // Word count scoring
        if wordCount >= 50 {
            score += 3
        } else if wordCount >= 30 {
            score += 2
        } else if wordCount >= 15 {
            score += 1
        } else {
            feedback.append("Try to write more to show your understanding")
        }
        
        // Sentence structure scoring
        if avgWordsPerSentence >= 8 && avgWordsPerSentence <= 20 {
            score += 2
        } else if avgWordsPerSentence < 5 {
            feedback.append("Try writing more complete sentences")
        }
        
        // Complexity indicators
        if hasComplexVocabulary(text) {
            score += 2
            feedback.append("Great use of specific terminology!")
        }
        
        if hasGoodStructure(text) {
            score += 1
            feedback.append("Well-structured explanation")
        }
        
        let level: ContentQuality.Level
        if score >= 6 {
            level = .excellent
        } else if score >= 4 {
            level = .good
        } else if score >= 2 {
            level = .fair
        } else {
            level = .poor
        }
        
        return ContentQuality(level: level, score: score, feedback: feedback)
    }
    
    private static func getSentenceCount(_ text: String) -> Int {
        let sentences = text.components(separatedBy: CharacterSet(charactersIn: ".!?"))
        return sentences.filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }.count
    }
    
    private static func hasComplexVocabulary(_ text: String) -> Bool {
        let complexWords = [
            "because", "therefore", "however", "although", "furthermore",
            "consequently", "specifically", "particularly", "essentially",
            "mechanism", "process", "function", "structure", "relationship"
        ]
        
        let lowercaseText = text.lowercased()
        return complexWords.contains { lowercaseText.contains($0) }
    }
    
    private static func hasGoodStructure(_ text: String) -> Bool {
        let structureIndicators = [
            "first", "second", "third", "finally", "in conclusion",
            "for example", "such as", "this means", "in other words"
        ]
        
        let lowercaseText = text.lowercased()
        return structureIndicators.contains { lowercaseText.contains($0) }
    }
}

// MARK: - Supporting Types
struct ContentQuality {
    enum Level {
        case poor, fair, good, excellent
    }
    
    let level: Level
    let score: Int
    let feedback: [String]
}