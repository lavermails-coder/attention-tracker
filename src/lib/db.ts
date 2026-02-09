import type { AttentionEntry, Experiment, UserSettings, WeeklySummary, Intention } from '../types';
import { syncEntry, syncExperiment, syncSettings, syncWeeklySummary, syncIntention } from './sync';
import { db } from './dexie-db';

export { db };

// Helper functions
export async function getSettings(): Promise<UserSettings | undefined> {
  return db.userSettings.get('settings');
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await db.userSettings.put(settings);
  syncSettings(settings).catch(console.error);
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
  syncEntry(entry).catch(console.error);
}

export async function getActiveExperiment(): Promise<Experiment | undefined> {
  return db.experiments.where('status').equals('active').first();
}

export async function getAllExperiments(): Promise<Experiment[]> {
  return db.experiments.orderBy('startDate').reverse().toArray();
}

export async function saveExperiment(experiment: Experiment): Promise<void> {
  await db.experiments.put(experiment);
  syncExperiment(experiment).catch(console.error);
}

export async function getWeeklySummary(weekNumber: number): Promise<WeeklySummary | undefined> {
  return db.weeklySummaries.get(`week-${weekNumber}`);
}

export async function saveWeeklySummary(summary: WeeklySummary): Promise<void> {
  await db.weeklySummaries.put(summary);
  syncWeeklySummary(summary).catch(console.error);
}

export async function addIntention(intention: Intention): Promise<void> {
  await db.intentions.add(intention);
  syncIntention(intention).catch(console.error);
}

export async function getLatestIntention(): Promise<Intention | undefined> {
  return db.intentions.orderBy('timestamp').reverse().first();
}

export async function getAllIntentions(): Promise<Intention[]> {
  return db.intentions.orderBy('timestamp').reverse().toArray();
}

export async function clearAllData(): Promise<void> {
  await db.attentionEntries.clear();
  await db.experiments.clear();
  await db.weeklySummaries.clear();
  await db.userSettings.clear();
  await db.intentions.clear();
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
