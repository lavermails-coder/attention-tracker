import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getCategoryById } from '../data/categories';
import { getAllIntentions } from '../lib/db';
import type { Intention } from '../types';

export function AttentionOverview() {
  const { entries, setCurrentView } = useApp();
  const [intentions, setIntentions] = useState<Intention[]>([]);

  useEffect(() => {
    getAllIntentions().then(setIntentions);
  }, []);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Sort entries by timestamp descending (newest first)
  const sortedEntries = [...entries].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp)
  );

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mb-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Attention Overview
        </h1>

        {sortedEntries.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-600 dark:text-slate-300">
              No entries yet. Start logging your attention!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEntries.map(entry => {
              const category = getCategoryById(entry.category);
              return (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {formatDateTime(entry.timestamp)}
                  </div>
                  <div
                    className="font-medium"
                    style={{ color: category?.color }}
                  >
                    {category?.label}
                  </div>
                  {entry.details && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {entry.details}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Intentions Section */}
        {intentions.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              Intentions
            </h2>
            <div className="space-y-3">
              {intentions.map(intention => (
                <div
                  key={intention.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {formatDateTime(intention.timestamp)}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {intention.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
