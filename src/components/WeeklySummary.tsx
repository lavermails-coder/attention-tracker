import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { calculateCategoryBreakdown, calculateWeekNumber } from '../lib/calculations';
import { getCategoryById } from '../data/categories';

export function WeeklySummary() {
  const { entries, currentDayNumber, setCurrentView } = useApp();

  const currentWeek = calculateWeekNumber(currentDayNumber || 1);

  const weekData = useMemo(() => {
    const weekEntries = entries.filter(e => e.weekNumber === currentWeek);
    const breakdown = calculateCategoryBreakdown(weekEntries);

    return breakdown.map(item => {
      const cat = getCategoryById(item.category);
      return {
        name: cat?.label || item.category,
        value: item.count,
        percentage: item.percentage,
        color: cat?.color || '#6B7280',
        emoji: cat?.emoji || '',
      };
    });
  }, [entries, currentWeek]);

  const previousWeekData = useMemo(() => {
    if (currentWeek <= 1) return null;
    const weekEntries = entries.filter(e => e.weekNumber === currentWeek - 1);
    return calculateCategoryBreakdown(weekEntries);
  }, [entries, currentWeek]);

  const totalEntries = weekData.reduce((sum, d) => sum + d.value, 0);
  const topThree = weekData.slice(0, 3);

  // Calculate comparison
  const comparison = useMemo(() => {
    if (!previousWeekData || previousWeekData.length === 0 || topThree.length === 0) return null;

    const currentTop = topThree[0];
    const prevTop = previousWeekData.find(p => getCategoryById(p.category)?.label === currentTop.name);

    if (!prevTop) return null;

    const change = currentTop.percentage - prevTop.percentage;
    return {
      category: currentTop.name,
      change: change.toFixed(1),
      direction: change > 1 ? 'more' : change < -1 ? 'less' : 'same',
    };
  }, [previousWeekData, topThree]);

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
          Week {currentWeek} Summary
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {totalEntries} entries logged
        </p>

        {totalEntries === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-slate-600 dark:text-slate-300">
              No entries yet this week. Start logging to see your summary!
            </p>
          </div>
        ) : (
          <>
            {/* Pie Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={weekData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {weekData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value, entry: any) => (
                      <span className="text-slate-700 dark:text-slate-300 text-sm">
                        {entry.payload?.emoji} {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Top Categories
              </h2>
              <div className="space-y-4">
                {topThree.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {index + 1}. {item.name}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 font-semibold">
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Text */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
              <p className="text-slate-700 dark:text-slate-300">
                This week you spent most attention on{' '}
                <span className="font-semibold" style={{ color: topThree[0]?.color }}>
                  {topThree[0]?.name}
                </span>
                {topThree[0] && ` (${topThree[0].percentage.toFixed(0)}%)`}.
              </p>

              {comparison && comparison.direction !== 'same' && (
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                  Compared to last week:{' '}
                  {comparison.direction === 'more' ? '↑' : '↓'}{' '}
                  {Math.abs(parseFloat(comparison.change))}% {comparison.direction}
                </p>
              )}
            </div>
          </>
        )}

        <button
          onClick={() => setCurrentView('dashboard')}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
        >
          Continue Tracking
        </button>
      </div>
    </div>
  );
}
