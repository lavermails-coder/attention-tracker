import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getExerciseById } from '../data/exercises';
import { getTodayDateString } from '../lib/calculations';

export function ExperimentActive() {
  const {
    activeExperiment,
    setCurrentView,
    markPracticeComplete,
    completeExperiment,
    abandonExperiment,
  } = useApp();

  const [showInstructions, setShowInstructions] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [reflection, setReflection] = useState('');

  if (!activeExperiment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <p className="text-slate-600 dark:text-slate-300">No active experiment</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-4 text-indigo-600 dark:text-indigo-400"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const exercise = getExerciseById(activeExperiment.exerciseId);
  const today = getTodayDateString();
  const todayPractice = activeExperiment.dailyPracticeLog.find(p => p.date === today);
  const daysCompleted = activeExperiment.dailyPracticeLog.filter(p => p.completed).length;
  const isComplete = daysCompleted >= 7;

  const handleMarkComplete = async () => {
    await markPracticeComplete(today);
  };

  const handleFinish = async () => {
    await completeExperiment(reflection || undefined);
    setCurrentView('dashboard');
  };

  const handleAbandon = async () => {
    if (confirm('Are you sure you want to abandon this experiment?')) {
      await abandonExperiment();
      setCurrentView('dashboard');
    }
  };

  // Show completion screen
  if (isComplete || showComplete) {
    return (
      <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Experiment Complete!
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              You completed {daysCompleted} days of practice.
            </p>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              How did it go?
            </h2>
            <textarea
              placeholder="Add any reflections (optional)"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none mb-4"
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleFinish}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Complete Experiment
            </button>
            <button
              onClick={() => setCurrentView('exercise-library')}
              className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
            >
              Try Another Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show instructions
  if (showInstructions && exercise) {
    return (
      <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full mx-auto">
          <button
            onClick={() => setShowInstructions(false)}
            className="mb-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-2"
          >
            <span>←</span> Back
          </button>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {exercise.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {exercise.fullInstructions.overview}
          </p>

          {/* Steps */}
          <div className="space-y-4 mb-6">
            {exercise.fullInstructions.steps.map((step) => (
              <div
                key={step.step}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm pl-11">
                  {step.instruction}
                </p>
              </div>
            ))}
          </div>

          {/* Expected Outcome */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
              Expected Outcome
            </h3>
            <p className="text-green-700 dark:text-green-400 text-sm">
              {exercise.fullInstructions.expectedOutcome}
            </p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
              Note
            </h3>
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              {exercise.fullInstructions.warning}
            </p>
          </div>

          <button
            onClick={() => setShowInstructions(false)}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    );
  }

  // Main experiment view
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
          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
            Experiment in Progress
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {activeExperiment.exerciseName}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Day {daysCompleted + 1} of 7
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const dayDate = new Date(activeExperiment.startDate);
              dayDate.setDate(dayDate.getDate() + day - 1);
              const dateStr = dayDate.toISOString().split('T')[0];
              const practice = activeExperiment.dailyPracticeLog.find(p => p.date === dateStr);
              const isToday = dateStr === today;
              const isPast = dayDate < new Date(today);

              return (
                <div
                  key={day}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    practice?.completed
                      ? 'bg-green-500 text-white'
                      : isToday
                      ? 'bg-indigo-600 text-white'
                      : isPast
                      ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {practice?.completed ? '✓' : day}
                </div>
              );
            })}
          </div>
          <div className="text-center text-slate-600 dark:text-slate-300 text-sm">
            {daysCompleted}/7 days completed
          </div>
        </div>

        {/* Today's Status */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Today's Practice
          </h2>

          {todayPractice?.completed ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Completed for today!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                Have you completed today's practice?
              </p>
              <button
                onClick={handleMarkComplete}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                Mark as Complete
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setShowInstructions(true)}
            className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
          >
            View Instructions
          </button>

          {daysCompleted >= 7 && (
            <button
              onClick={() => setShowComplete(true)}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Complete Experiment
            </button>
          )}

          <button
            onClick={handleAbandon}
            className="w-full py-3 px-6 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-xl transition-colors"
          >
            Abandon Experiment
          </button>
        </div>
      </div>
    </div>
  );
}
