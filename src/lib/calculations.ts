import type { AttentionEntry, CategoryType, ExerciseSuggestion, CategoryBreakdown, WeeklySummary, WeekComparison } from '../types';

export function calculateDayNumber(entries: AttentionEntry[]): number {
  const uniqueDays = new Set(entries.map(e => e.timestamp.split('T')[0]));
  return uniqueDays.size;
}

export function getNextDayNumber(entries: AttentionEntry[]): number {
  const today = new Date().toISOString().split('T')[0];
  const hasEntryToday = entries.some(e => e.timestamp.startsWith(today));

  // If already logged today, return current day number
  // Otherwise, it's a new day
  if (hasEntryToday) {
    return calculateDayNumber(entries);
  }
  return calculateDayNumber(entries) + 1;
}

export function calculateWeekNumber(dayNumber: number): number {
  return Math.ceil(dayNumber / 7);
}

export function calculateCategoryPercentages(entries: AttentionEntry[]): Record<CategoryType, number> {
  const total = entries.length;
  if (total === 0) {
    return {
      acknowledgement: 0,
      desires: 0,
      significance: 0,
      resistances: 0,
      control: 0,
      safety_security: 0,
      connection: 0,
      achievement: 0,
      pleasure: 0,
      identity: 0,
      judgment: 0,
      exhaustion: 0,
      emptiness: 0,
    };
  }

  const counts: Record<string, number> = {};
  entries.forEach(entry => {
    counts[entry.category] = (counts[entry.category] || 0) + 1;
  });

  const percentages: Record<string, number> = {};
  const allCategories: CategoryType[] = [
    'acknowledgement', 'desires', 'significance', 'resistances',
    'control', 'safety_security', 'connection', 'achievement',
    'pleasure', 'identity', 'judgment', 'exhaustion', 'emptiness'
  ];

  allCategories.forEach(category => {
    percentages[category] = ((counts[category] || 0) / total) * 100;
  });

  return percentages as Record<CategoryType, number>;
}

export function calculateCategoryBreakdown(entries: AttentionEntry[]): CategoryBreakdown[] {
  const total = entries.length;
  if (total === 0) return [];

  const counts: Record<string, number> = {};
  entries.forEach(entry => {
    counts[entry.category] = (counts[entry.category] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([category, count]) => ({
      category: category as CategoryType,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

export function generateWeeklySummary(
  weekNumber: number,
  entries: AttentionEntry[],
  previousSummary?: WeeklySummary
): WeeklySummary | null {
  const weekEntries = entries.filter(e => e.weekNumber === weekNumber);

  if (weekEntries.length === 0) return null;

  const breakdown = calculateCategoryBreakdown(weekEntries);
  const topCategory = breakdown[0];

  let comparison: WeekComparison | undefined;
  if (previousSummary) {
    const prevTop = previousSummary.categoryBreakdown.find(
      c => c.category === topCategory.category
    );
    if (prevTop) {
      const change = topCategory.percentage - prevTop.percentage;
      comparison = {
        category: topCategory.category,
        percentageChange: change,
        direction: change > 1 ? 'increase' : change < -1 ? 'decrease' : 'same',
      };
    }
  }

  const sortedByDate = [...weekEntries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return {
    id: `week-${weekNumber}`,
    weekNumber,
    startDate: sortedByDate[0].timestamp.split('T')[0],
    endDate: sortedByDate[sortedByDate.length - 1].timestamp.split('T')[0],
    totalEntries: weekEntries.length,
    categoryBreakdown: breakdown,
    topCategory: topCategory.category,
    topCategoryPercentage: topCategory.percentage,
    comparisonToPreviousWeek: comparison,
    generatedAt: new Date().toISOString(),
  };
}

export function suggestExercise(entries: AttentionEntry[]): ExerciseSuggestion | null {
  if (entries.length < 40) {
    return null;
  }

  const percentages = calculateCategoryPercentages(entries);

  // Check for scattered pattern (3+ categories >20%)
  const categoriesAbove20 = Object.values(percentages).filter(p => p > 20).length;
  if (categoriesAbove20 >= 3) {
    return {
      exerciseId: 'priority_management',
      targetPattern: 'scattered',
      percentage: null,
      reason: `Your attention is scattered across multiple areas (${categoriesAbove20} categories above 20%).`,
    };
  }

  // Default fallback - suggest based on top category
  const topCategory = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0];
  return {
    exerciseId: 'expanding_consciousness',
    targetPattern: topCategory[0] as CategoryType,
    percentage: topCategory[1],
    reason: `Your attention is often on ${topCategory[0].replace('_', '/')} (${topCategory[1].toFixed(1)}%).`,
  };
}

export function calculateExperimentResults(
  beforeEntries: AttentionEntry[],
  duringEntries: AttentionEntry[],
  targetPattern: CategoryType | 'scattered'
): {
  before: number;
  after: number;
  change: number;
  improved: boolean;
} | null {
  if (duringEntries.length < 10) {
    return null;
  }

  if (targetPattern === 'scattered') {
    // For scattered, measure how many categories are above 20%
    const beforePercentages = calculateCategoryPercentages(beforeEntries);
    const duringPercentages = calculateCategoryPercentages(duringEntries);

    const beforeScattered = Object.values(beforePercentages).filter(p => p > 20).length;
    const duringScattered = Object.values(duringPercentages).filter(p => p > 20).length;

    return {
      before: beforeScattered,
      after: duringScattered,
      change: duringScattered - beforeScattered,
      improved: duringScattered < beforeScattered,
    };
  }

  const beforePercentages = calculateCategoryPercentages(beforeEntries);
  const duringPercentages = calculateCategoryPercentages(duringEntries);

  const beforePercent = beforePercentages[targetPattern] || 0;
  const duringPercent = duringPercentages[targetPattern] || 0;
  const change = duringPercent - beforePercent;

  // For patterns where decrease might be desired
  const decreasePatterns: CategoryType[] = ['resistances', 'judgment'];
  const isImprovement = decreasePatterns.includes(targetPattern)
    ? change < 0
    : change > 0;

  return {
    before: beforePercent,
    after: duringPercent,
    change,
    improved: isImprovement,
  };
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function hasEntryToday(entries: AttentionEntry[]): { ping1: boolean; ping2: boolean; count: number } {
  const today = getTodayDateString();
  const todayEntries = entries.filter(e => e.timestamp.startsWith(today));

  return {
    ping1: todayEntries.length >= 1,
    ping2: todayEntries.length >= 2,
    count: todayEntries.length,
  };
}
