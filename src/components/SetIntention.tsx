import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';

export function SetIntention() {
  const { setCurrentView, setIntention } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customIntention, setCustomIntention] = useState('');

  const handleSubmit = async () => {
    if (selectedCategory || customIntention.trim()) {
      await setIntention(selectedCategory, customIntention.trim() || undefined);
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

        {/* Category Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedCategory === category.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="font-medium text-slate-900 dark:text-white text-sm">
                {category.label}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Intention */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Or describe your intention
          </label>
          <textarea
            value={customIntention}
            onChange={(e) => setCustomIntention(e.target.value)}
            placeholder="e.g., Stay present during my meeting, Focus on deep work for 2 hours..."
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCategory && !customIntention.trim()}
          className={`w-full py-4 px-6 font-semibold rounded-xl transition-colors text-lg ${
            selectedCategory || customIntention.trim()
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
