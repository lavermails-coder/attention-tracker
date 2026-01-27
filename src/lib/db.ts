import Dexie, { type EntityTable } from 'dexie';
import type { AttentionEntry, Experiment, UserSettings, WeeklySummary } from '../types';

const db = new Dexie('AttentionTrackerDB') as Dexie & {
  attentionEntries: EntityTable<AttentionEntry, 'id'>;
  experiments: EntityTable<Experiment, 'id'>;
  userSettings: EntityTable<UserSettings, 'id'>;
  weeklySummaries: EntityTable<WeeklySummary, 'id'>;
};

db.version(1).stores({
  attentionEntries: 'id, dayNumber, weekNumber, category, timestamp',
  experiments: 'id, status, startDate',
  userSettings: 'id',
  weeklySummaries: 'id, weekNumber',
});

export { db };

// Helper functions
export async function getSettings(): Promise<UserSettings | undefined> {
  return db.userSettings.get('settings');
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await db.userSettings.put(settings);
}

export async function getAllEntries(): Promise<AttentionEntry[]> {
  return db.attentionEntries.orderBy('timestamp').toArray();
}

export async function getEntriesByWeek(weekNumber: number): Promise<AttentionEntry[]> {
  return db.attentionEntries.where('weekNumber').equals(weekNumber).toArray();
}

export async function getEntriesInDateRange(startDate: string, endDate: string): Promise<AttentionEntry[]> {
  return db.attentionEntries
    .where('timestamp')
    .between(startDate, endDate, true, true)
    .toArray();
}

export async function addEntry(entry: AttentionEntry): Promise<void> {
  await db.attentionEntries.add(entry);
}

export async function getActiveExperiment(): Promise<Experiment | undefined> {
  return db.experiments.where('status').equals('active').first();
}

export async function getAllExperiments(): Promise<Experiment[]> {
  return db.experiments.orderBy('startDate').reverse().toArray();
}

export async function saveExperiment(experiment: Experiment): Promise<void> {
  await db.experiments.put(experiment);
}

export async function getWeeklySummary(weekNumber: number): Promise<WeeklySummary | undefined> {
  return db.weeklySummaries.get(`week-${weekNumber}`);
}

export async function saveWeeklySummary(summary: WeeklySummary): Promise<void> {
  await db.weeklySummaries.put(summary);
}

export async function clearAllData(): Promise<void> {
  await db.attentionEntries.clear();
  await db.experiments.clear();
  await db.weeklySummaries.clear();
  await db.userSettings.clear();
}

export async function exportAllData(): Promise<object> {
  const entries = await getAllEntries();
  const experiments = await getAllExperiments();
  const settings = await getSettings();
  const summaries = await db.weeklySummaries.toArray();

  const uniqueDays = new Set(entries.map(e => e.timestamp.split('T')[0]));

  return {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    user: {
      firstUseDate: settings?.firstUseDate || '',
      totalLoggedDays: uniqueDays.size,
      timezone: settings?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    entries: entries.map(e => ({
      timestamp: e.timestamp,
      category: e.category,
      details: e.details,
      dayNumber: e.dayNumber,
    })),
    experiments: experiments.map(exp => ({
      exerciseName: exp.exerciseName,
      startDate: exp.startDate,
      endDate: exp.endDate,
      targetPattern: exp.targetPattern,
      baselinePercentage: exp.baselinePercentage,
      resultPercentage: exp.resultPercentage,
      percentageChange: exp.percentageChange,
      practiceCompletionRate: exp.dailyPracticeLog.filter(d => d.completed).length / 7 * 100,
    })),
    weeklySummaries: summaries,
  };
}
