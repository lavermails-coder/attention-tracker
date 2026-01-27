import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getCategoryById } from '../data/categories';

export function History() {
  const { entries, setCurrentView } = useApp();

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof entries> = {};

    entries.forEach(entry => {
      const date = entry.timestamp.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });

    // Sort by date descending
    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, entries]) => ({
        date,
        entries: entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
      }));
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
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
          Entry History
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {entries.length} total entries
        </p>

        {groupedEntries.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-slate-600 dark:text-slate-300">
              No entries yet. Start logging your attention!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedEntries.map(({ date, entries }) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                  {formatDate(date)}
                </h2>
                <div className="space-y-2">
                  {entries.map(entry => {
                    const category = getCategoryById(entry.category);
                    return (
                      <div
                        key={entry.id}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                            style={{ backgroundColor: `${category?.color}20` }}
                          >
                            {category?.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className="font-medium"
                                style={{ color: category?.color }}
                              >
                                {category?.label}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {formatTime(entry.timestamp)}
                              </span>
                            </div>
                            {entry.details && (
                              <p className="text-sm text-slate-600 dark:text-slate-300 break-words">
                                {entry.details}
                              </p>
                            )}
                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              Day {entry.dayNumber}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
