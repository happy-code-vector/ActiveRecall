import { useState } from 'react';
import { ArrowLeft, Lightbulb, Lock, Unlock } from 'lucide-react';
import { DifficultyLevel } from '@/context/AppContext';
import { validateAnswer } from '../../utils/validation';
import { getDetailedAnswer } from '../../utils/answers';

interface RecallChallengeProps {
  level: DifficultyLevel;
  onReset: () => void;
}

export function RecallChallenge({ level, onReset }: RecallChallengeProps) {
  const [question, setQuestion] = useState('');
  const [attempt, setAttempt] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const levelConfig = {
    base: {
      name: 'Base Level',
      color: 'green',
      minWords: 5,
      threshold: 0.3,
      hintsAvailable: true,
    },
    mid: {
      name: 'Mid-Level',
      color: 'blue',
      minWords: 10,
      threshold: 0.5,
      hintsAvailable: false,
    },
    mastery: {
      name: 'Mastery Mode',
      color: 'purple',
      minWords: 15,
      threshold: 0.7,
      hintsAvailable: false,
    },
  };

  const config = levelConfig[level];

  const handleSubmitAttempt = () => {
    if (!question.trim() || !attempt.trim()) {
      setFeedback({
        passed: false,
        message: 'Please enter both a question and your answer attempt.',
      });
      return;
    }

    const validation = validateAnswer(question, attempt, level, config.threshold, config.minWords);

    setFeedback(validation);
    if (validation.passed) {
      setIsUnlocked(true);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAttempt('');
    setIsUnlocked(false);
    setFeedback(null);
    setShowHint(false);
  };

  const getHint = () => {
    // Simple hint system based on the question
    const hints: Record<string, string> = {
      mitochondria: 'Think about energy production in cells and the powerhouse analogy.',
      photosynthesis: 'Consider how plants convert light energy and what they produce.',
      dna: 'Think about genetic information storage and the double helix structure.',
    };

    const questionLower = question.toLowerCase();
    for (const [key, hint] of Object.entries(hints)) {
      if (questionLower.includes(key)) {
        return hint;
      }
    }
    return 'Break down the concept into: definition, function, and key characteristics.';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to level selection
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl">{config.name}</h2>
          <div className={`px-4 py-2 rounded-full bg-${config.color}-100 text-${config.color}-700 flex items-center gap-2`}>
            {isUnlocked ? (
              <>
                <Unlock className="w-5 h-5" />
                Unlocked
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Locked
              </>
            )}
          </div>
        </div>

        {!isUnlocked ? (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">
                What question do you want to answer?
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What is a mitochondria?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">
                Your answer attempt (minimum {config.minWords} words)
              </label>
              <textarea
                value={attempt}
                onChange={(e) => setAttempt(e.target.value)}
                placeholder="Write what you know about this topic..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <div className="text-sm text-gray-500 mt-1">
                Word count: {attempt.trim().split(/\s+/).filter(w => w.length > 0).length}
              </div>
            </div>

            {config.hintsAvailable && (
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Lightbulb className="w-5 h-5" />
                  {showHint ? 'Hide hint' : 'Show hint'}
                </button>
                {showHint && (
                  <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-700">
                    {getHint()}
                  </div>
                )}
              </div>
            )}

            {feedback && (
              <div
                className={`p-4 rounded-lg ${
                  feedback.passed
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmitAttempt}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Attempt
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-xl text-green-900 mb-2">Access Granted!</h3>
              <p className="text-green-800">
                Great job! Your answer demonstrated sufficient understanding. Here&apos;s the comprehensive answer.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-3">Question:</h3>
              <p className="text-gray-700 text-lg">{question}</p>
            </div>

            <div>
              <h3 className="text-xl mb-3">Your Answer:</h3>
              <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
                {attempt}
              </div>
            </div>

            <div>
              <h3 className="text-xl mb-3">Comprehensive Answer:</h3>
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-gray-800 leading-relaxed">
                {getDetailedAnswer(question)}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Another Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}