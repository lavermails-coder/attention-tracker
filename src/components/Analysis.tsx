import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { calculateCategoryBreakdown, suggestExercise } from '../lib/calculations';
import { getCategoryById } from '../data/categories';
import { getExerciseById } from '../data/exercises';

export function Analysis() {
  const { entries, setCurrentView, startExperiment } = useApp();

  const chartData = useMemo(() => {
    const breakdown = calculateCategoryBreakdown(entries);
    return breakdown.map(item => {
      const cat = getCategoryById(item.category);
      return {
        name: cat?.label || item.category,
        value: item.count,
        percentage: item.percentage,
        color: cat?.color || '#6B7280',
        emoji: cat?.emoji || '',
      };
    });
  }, [entries]);

  const suggestion = useMemo(() => {
    return suggestExercise(entries);
  }, [entries]);

  const suggestedExercise = suggestion ? getExerciseById(suggestion.exerciseId) : null;

  const handleStartExperiment = async () => {
    if (suggestion?.exerciseId) {
      await startExperiment(suggestion.exerciseId);
    }
  };

  const totalEntries = entries.length;
  const topThree = chartData.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mb-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            30 Days Complete!
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Here's what we found from {totalEntries} entries
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
            Your Attention Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.slice(0, 6).map(item => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-300 truncate">
                  {item.emoji} {item.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pattern Highlight */}
        {topThree[0] && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: `${topThree[0].color}15` }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{topThree[0].emoji}</div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: topThree[0].color }}
              >
                {topThree[0].percentage.toFixed(1)}%
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                of your attention on <strong>{topThree[0].name}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Suggestion */}
        {suggestion && suggestedExercise && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Want to Experiment?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              {suggestion.reason}
            </p>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {suggestedExercise.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                {suggestedExercise.shortDescription}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>⏱ {suggestedExercise.duration}</span>
                <span className="capitalize">
                  {suggestedExercise.difficulty === 'easy' ? '🟢' : suggestedExercise.difficulty === 'medium' ? '🟡' : '🔴'} {suggestedExercise.difficulty}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              7-Day Experiment: Practice this daily, we'll track if your attention shifts.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleStartExperiment}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                Start 7-Day Experiment
              </button>
              <button
                onClick={() => setCurrentView('exercise-library')}
                className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
              >
                Browse All Exercises
              </button>
            </div>
          </div>
        )}

        {!suggestion && (
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Continue Tracking
          </button>
        )}
      </div>
    </div>
  );
}
