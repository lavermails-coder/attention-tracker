import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';
import type { CategoryType } from '../types';

export function PingResponse() {
  const { addEntry, setCurrentView, todayCompletion } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [details, setDetails] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory) return;

    await addEntry(selectedCategory, details || undefined);
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedCategory(null);
      setDetails('');
      setCurrentView('dashboard');
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">✓</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Noted!
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            {todayCompletion.count + 1}/2 for today
          </p>
        </div>
      </div>
    );
  }

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
          What is your attention on?
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Right now, in this moment
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedCategory === category.id
                  ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900'
                  : 'hover:scale-[1.02]'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id
                  ? category.color
                  : `${category.color}20`,
                color: selectedCategory === category.id ? 'white' : category.color,
              }}
            >
              <div className="text-2xl mb-1">{category.emoji}</div>
              <div className="font-semibold text-sm">{category.label}</div>
              <div className={`text-xs ${selectedCategory === category.id ? 'text-white/80' : 'opacity-70'}`}>
                {category.description}
              </div>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mb-6">
            <textarea
              placeholder="Add details (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
              rows={3}
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedCategory}
          className={`w-full py-4 px-6 font-semibold rounded-xl transition-colors text-lg ${
            selectedCategory
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
