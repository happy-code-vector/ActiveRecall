import { Brain, Target, Trophy } from 'lucide-react';
import { DifficultyLevel } from '../../App';

interface LevelSelectorProps {
  onSelectLevel: (level: DifficultyLevel) => void;
}

export function LevelSelector({ onSelectLevel }: LevelSelectorProps) {
  const levels = [
    {
      id: 'base' as DifficultyLevel,
      name: 'Base Level',
      icon: Brain,
      description: 'Get started with active recall. Partial matches accepted, hints available.',
      color: 'from-green-400 to-emerald-500',
      requirement: 'Show basic understanding',
    },
    {
      id: 'mid' as DifficultyLevel,
      name: 'Mid-Level',
      icon: Target,
      description: 'Moderate challenge. Must demonstrate good understanding with key concepts.',
      color: 'from-blue-400 to-indigo-500',
      requirement: 'Include key concepts',
    },
    {
      id: 'mastery' as DifficultyLevel,
      name: 'Mastery Mode',
      icon: Trophy,
      description: 'Ultimate challenge. Comprehensive answer required with precise terminology.',
      color: 'from-purple-400 to-pink-500',
      requirement: 'Demonstrate mastery',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl mb-4">Active Recall Learning</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Test your knowledge before accessing answers. Choose your difficulty level to begin.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl mb-3">{level.name}</h2>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {level.requirement}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
