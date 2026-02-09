import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getCategoryById } from '../data/categories';
import { calculateCategoryBreakdown } from '../lib/calculations';

export function AttentionOverview() {
  const { entries, setCurrentView } = useApp();

  // Group entries by date and calculate breakdown per day
  const dailyBreakdowns = useMemo(() => {
    const groups: Record<string, typeof entries> = {};

    entries.forEach(entry => {
      const date = entry.timestamp.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });

    // Sort by date descending and calculate breakdowns
    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, dayEntries]) => ({
        date,
        entries: dayEntries,
        breakdown: calculateCategoryBreakdown(dayEntries),
      }));
  }, [entries]);

  // Overall breakdown
  const overallBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(entries);
  }, [entries]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mb-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Attention Overview
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          See where your attention has been
        </p>

        {entries.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-600 dark:text-slate-300">
              No entries yet. Start logging your attention!
            </p>
          </div>
        ) : (
          <>
            {/* Overall Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                All Time Summary
              </h2>
              <div className="space-y-3">
                {overallBreakdown.map(item => {
                  const category = getCategoryById(item.category);
                  if (!category) return null;
                  return (
                    <div key={item.category} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {category.label}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {item.percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: category.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {entries.length} total entries
                </p>
              </div>
            </div>

            {/* Daily Breakdowns */}
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              By Date
            </h2>
            <div className="space-y-4">
              {dailyBreakdowns.map(({ date, entries: dayEntries, breakdown }) => (
                <div
                  key={date}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {formatDate(date)}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.map(item => {
                      const category = getCategoryById(item.category);
                      if (!category) return null;
                      return (
                        <div
                          key={item.category}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          {category.label} ({item.percentage.toFixed(0)}%)
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
