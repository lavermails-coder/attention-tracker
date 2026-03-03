import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function SetIntention() {
  const { setCurrentView, setIntention } = useApp();
  const [intentionText, setIntentionText] = useState('');

  const handleSubmit = async () => {
    if (intentionText.trim()) {
      await setIntention(null, intentionText.trim());
      setCurrentView('dashboard');
    }
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
          Set Your Intention
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          What would you like to focus your attention on?
        </p>

        <div className="mb-6">
          <textarea
            value={intentionText}
            onChange={(e) => setIntentionText(e.target.value)}
            placeholder="e.g., Stay present during my meeting, Focus on deep work for 2 hours..."
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!intentionText.trim()}
          className={`w-full py-4 px-6 font-semibold rounded-xl transition-colors text-lg ${
            intentionText.trim()
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          Set Intention
        </button>
      </div>
    </div>
  );
}
