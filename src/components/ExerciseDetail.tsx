import { useApp } from '../context/AppContext';
import { getExerciseById } from '../data/exercises';

export function ExerciseDetail() {
  const { selectedExerciseId, setCurrentView, startExperiment, activeExperiment } = useApp();

  const exercise = selectedExerciseId ? getExerciseById(selectedExerciseId) : null;

  if (!exercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <p className="text-slate-600 dark:text-slate-300">Exercise not found</p>
        <button
          onClick={() => setCurrentView('exercise-library')}
          className="mt-4 text-indigo-600 dark:text-indigo-400"
        >
          Back to Library
        </button>
      </div>
    );
  }

  const handleStartExperiment = async () => {
    await startExperiment(exercise.id);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => setCurrentView('exercise-library')}
          className="mb-6 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>

        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {exercise.name}
          </h1>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              exercise.difficulty === 'easy'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : exercise.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {exercise.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <span>⏱ {exercise.duration}</span>
        </div>

        {/* Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            {exercise.fullInstructions.overview}
          </p>
        </div>

        {/* Steps */}
        <div className="mb-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Steps
          </h2>
          <div className="space-y-3">
            {exercise.fullInstructions.steps.map((step) => (
              <div
                key={step.step}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm pl-10">
                  {step.instruction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Outcome */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1 text-sm">
            Expected Outcome
          </h3>
          <p className="text-green-700 dark:text-green-400 text-sm">
            {exercise.fullInstructions.expectedOutcome}
          </p>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1 text-sm">
            Note
          </h3>
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            {exercise.fullInstructions.warning}
          </p>
        </div>

        {/* Start Button */}
        {activeExperiment ? (
          <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4 text-center">
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              You have an active experiment. Complete or abandon it before starting a new one.
            </p>
          </div>
        ) : (
          <button
            onClick={handleStartExperiment}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Start 7-Day Experiment
          </button>
        )}
      </div>
    </div>
  );
}
