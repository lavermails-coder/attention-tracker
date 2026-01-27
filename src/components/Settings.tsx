import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { settings, setCurrentView, updateSettings, exportData, clearData } = useApp();

  const [activeHoursStart, setActiveHoursStart] = useState(settings?.activeHoursStart || '12:00');
  const [activeHoursEnd, setActiveHoursEnd] = useState(settings?.activeHoursEnd || '22:00');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveHours = async () => {
    await updateSettings({ activeHoursStart, activeHoursEnd });
  };

  const handleExport = async () => {
    await exportData();
  };

  const handleClear = async () => {
    await clearData();
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

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Settings
        </h1>

        {/* Active Hours */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Active Hours
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Pings will be sent randomly within these hours.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 dark:text-slate-300">Start Time</label>
              <input
                type="time"
                value={activeHoursStart}
                onChange={(e) => setActiveHoursStart(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-slate-700 dark:text-slate-300">End Time</label>
              <input
                type="time"
                value={activeHoursEnd}
                onChange={(e) => setActiveHoursEnd(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleSaveHours}
            className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Hours
          </button>
        </div>

        {/* Notifications Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300">Status</span>
            <span className={`text-sm font-medium ${
              settings?.notificationsEnabled
                ? 'text-green-600 dark:text-green-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {settings?.notificationsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {!settings?.notificationsEnabled && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Enable notifications in your browser settings to receive ping reminders.
            </p>
          )}
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Data Management
          </h2>

          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>📥</span> Export Data (JSON)
            </button>

            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors"
              >
                Clear All Data
              </button>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                  This will permanently delete all your entries, experiments, and settings. This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClear}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Delete Everything
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 px-4 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            About
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Attention Tracker helps you understand where your mental focus goes throughout the day.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Based on exercises from Frederick Dodson's attention/awareness work.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
