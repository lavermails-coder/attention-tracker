import { useApp } from '../context/AppContext';
import { exercises } from '../data/exercises';

export function ExerciseLibrary() {
  const { setCurrentView, setSelectedExerciseId } = useApp();

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setCurrentView('exercise-detail');
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
          Exercise Library
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Attention exercises based on Frederick Dodson's work
        </p>

        <div className="space-y-4">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleSelectExercise(exercise.id)}
              className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white pr-4">
                  {exercise.name}
                </h3>
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
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                {exercise.shortDescription}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>⏱ {exercise.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
