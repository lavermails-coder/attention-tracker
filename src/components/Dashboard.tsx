import { useApp } from '../context/AppContext';
import { getCategoryById } from '../data/categories';

export function Dashboard() {
  const {
    currentDayNumber,
    activeExperiment,
    currentIntention,
    setCurrentView,
    showMilestone,
    dismissMilestone,
  } = useApp();

  // Show milestone modal
  if (showMilestone === 'week') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Week {Math.ceil(currentDayNumber / 7)} Complete!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Great job tracking your attention this week.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                dismissMilestone();
                setCurrentView('weekly-summary');
              }}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              View Weekly Summary
            </button>
            <button
              onClick={dismissMilestone}
              className="w-full py-3 px-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Continue Tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showMilestone === '30day') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            30 Days Complete!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            You've collected enough data to see your attention patterns. Ready to experiment with change?
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                dismissMilestone();
                setCurrentView('analysis');
              }}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              See My Patterns
            </button>
            <button
              onClick={dismissMilestone}
              className="w-full py-3 px-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Continue Tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Attention Tracker
          </h1>
          <button
            onClick={() => setCurrentView('settings')}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
              Day {currentDayNumber || 1}
              <span className="text-slate-400 dark:text-slate-500 text-2xl">/30</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((currentDayNumber / 30) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Active Experiment Card */}
        {activeExperiment && (
          <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Experiment in Progress
              </div>
              <div className="text-sm text-indigo-500 dark:text-indigo-400">
                Day {activeExperiment.dailyPracticeLog.length + 1}/7
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {activeExperiment.exerciseName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Don't forget to practice today!
            </p>
            <button
              onClick={() => setCurrentView('experiment')}
              className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline"
            >
              View Instructions →
            </button>
          </div>
        )}


        {/* Current Intention */}
        {currentIntention && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-6">
            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
              Current Intention
            </div>
            <div className="text-slate-900 dark:text-white">
              {currentIntention.description || (currentIntention.category && getCategoryById(currentIntention.category)?.label) || 'Set'}
            </div>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="space-y-3 mb-4">
          <button
            onClick={() => setCurrentView('ping-response')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            What is your attention on now?
          </button>
          <button
            onClick={() => setCurrentView('set-intention')}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            What would you like your attention to be on?
          </button>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentView('attention-overview')}
            className="py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors shadow-sm"
          >
            Attention Overview
          </button>
          <button
            onClick={() => setCurrentView('weekly-summary')}
            className="py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors shadow-sm"
          >
            Weekly Summary
          </button>
          {currentDayNumber >= 30 && (
            <button
              onClick={() => setCurrentView('analysis')}
              className="py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors shadow-sm"
            >
              30-Day Analysis
            </button>
          )}
          <button
            onClick={() => setCurrentView('exercise-library')}
            className="py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors shadow-sm"
          >
            Exercise Library
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className="py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors shadow-sm"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
