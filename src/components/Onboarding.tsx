import { useState } from 'react';
import { useApp } from '../context/AppContext';

type Step = 'welcome' | 'permissions' | 'hours';

export function Onboarding() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState<Step>('welcome');
  const [activeHoursStart, setActiveHoursStart] = useState('12:00');
  const [activeHoursEnd, setActiveHoursEnd] = useState('22:00');

  const handleComplete = async () => {
    await completeOnboarding(activeHoursStart, activeHoursEnd);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Where Does Your Attention Go?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Track your mental focus for 30 days, discover patterns, experiment with change.
          </p>
          <button
            onClick={() => setStep('permissions')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  if (step === 'permissions') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🔔</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Enable Notifications
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            We'll ping you twice a day to check in on what your attention is focused on. No spam, just gentle reminders.
          </p>
          <button
            onClick={() => setStep('hours')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-lg mb-4"
          >
            Enable Notifications
          </button>
          <button
            onClick={() => setStep('hours')}
            className="w-full py-3 px-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">⏰</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          When Are You Typically Awake?
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          We'll send 2 random pings between these hours.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <label className="text-slate-700 dark:text-slate-300 font-medium">Start Time</label>
            <input
              type="time"
              value={activeHoursStart}
              onChange={(e) => setActiveHoursStart(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-slate-700 dark:text-slate-300 font-medium">End Time</label>
            <input
              type="time"
              value={activeHoursEnd}
              onChange={(e) => setActiveHoursEnd(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-lg"
        >
          Start Tracking
        </button>
      </div>
    </div>
  );
}
