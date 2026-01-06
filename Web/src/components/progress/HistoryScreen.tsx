import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, TrendingUp, Brain, ChevronRight, X } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { BottomNav } from '../home/BottomNav';

interface HistoryScreenProps {
  userId: string;
  onBack: () => void;
  onRetry: (question: string) => void;
  onGoToHome?: () => void;
  onGoToProgress?: () => void;
  onGoToHistory?: () => void;
  onGoToTechniques?: () => void;
  onGoToParentDashboard?: () => void;
}

interface HistoryItem {
  id: string;
  question: string;
  attempt: string;
  evaluation: {
    effort_score: number;
    understanding_score: number;
    unlock: boolean;
    full_explanation?: string;
    what_is_right?: string;
    what_is_missing?: string;
  };
  timestamp: string;
}

export function HistoryScreen({ userId, onBack, onRetry, onGoToHome, onGoToProgress, onGoToHistory, onGoToTechniques, onGoToParentDashboard }: HistoryScreenProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/history/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getScoreDot = (score: number) => {
    const colors = ['bg-gray-600', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return <div className={`w-2 h-2 rounded-full ${colors[score]}`} />;
  };

  if (selectedItem) {
    return (
      <div className="min-h-screen flex flex-col bg-[#121212] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="relative px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={() => setSelectedItem(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>History</span>
          </button>
          <button
            onClick={() => setSelectedItem(null)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 px-5 pt-6 pb-32 overflow-y-auto">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-400">{formatDate(selectedItem.timestamp)}</p>
            {selectedItem.evaluation.unlock && (
              <span className="ml-auto text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                Unlocked
              </span>
            )}
          </div>

          {/* Question */}
          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-2">Question</p>
            <p className="text-lg text-white">{selectedItem.question}</p>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500">Effort</span>
              </div>
              <div className="flex items-center gap-2">
                {getScoreDot(selectedItem.evaluation.effort_score)}
                <span className="text-xl text-white">{selectedItem.evaluation.effort_score}/3</span>
              </div>
            </div>

            <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500">Understanding</span>
              </div>
              <div className="flex items-center gap-2">
                {getScoreDot(selectedItem.evaluation.understanding_score)}
                <span className="text-xl text-white">{selectedItem.evaluation.understanding_score}/3</span>
              </div>
            </div>
          </div>

          {/* Attempt */}
          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-2">Your attempt</p>
            <div className="bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-5 text-sm text-gray-300 border border-white/10">
              {selectedItem.attempt}
            </div>
          </div>

          {/* Explanation */}
          {selectedItem.evaluation.unlock && selectedItem.evaluation.full_explanation && (
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2">Explanation</p>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-5 text-sm text-white/90 border border-purple-500/20 leading-relaxed space-y-2">
                {selectedItem.evaluation.full_explanation.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {selectedItem.evaluation.what_is_right && selectedItem.evaluation.what_is_missing && (
            <div className="space-y-3">
              <div className="bg-green-500/10 backdrop-blur-xl rounded-3xl p-4 border border-green-500/20">
                <p className="text-xs text-green-400 mb-2">What you got right</p>
                <p className="text-sm text-green-100">{selectedItem.evaluation.what_is_right}</p>
              </div>
              <div className="bg-orange-500/10 backdrop-blur-xl rounded-3xl p-4 border border-orange-500/20">
                <p className="text-xs text-orange-400 mb-2">What to improve</p>
                <p className="text-sm text-orange-100">{selectedItem.evaluation.what_is_missing}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-5 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent">
          <button
            onClick={() => onRetry(selectedItem.question)}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full active:scale-95 transition-transform shadow-lg shadow-purple-500/30"
          >
            Try This Question Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative px-5 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="relative px-5 pt-6 pb-2">
        <h1 className="text-3xl text-white">History</h1>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="text-center">
            <p className="text-gray-400 mb-2">No attempts yet</p>
            <p className="text-sm text-gray-500">Start your first question!</p>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 px-5 pt-6 pb-24 overflow-y-auto space-y-2">{/* Added pb-24 for bottom nav space */}
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="w-full bg-[#1E1E1E]/50 backdrop-blur-xl rounded-3xl p-4 border border-white/10 hover:bg-[#1E1E1E]/80 hover:border-white/20 active:scale-95 transition-all text-left"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-white flex-1 line-clamp-2">{item.question}</p>
                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(item.timestamp)}
                </div>
                
                <div className="flex items-center gap-1.5">
                  {getScoreDot(item.evaluation.effort_score)}
                  {getScoreDot(item.evaluation.understanding_score)}
                </div>

                {item.evaluation.unlock && (
                  <span className="ml-auto text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    Unlocked
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      <BottomNav
        currentTab="history"
        onGoToHome={onGoToHome}
        onGoToProgress={onGoToProgress}
        onGoToHistory={onGoToHistory}
        onGoToTechniques={onGoToTechniques}
        onGoToParentDashboard={onGoToParentDashboard}
      />
    </div>
  );
}