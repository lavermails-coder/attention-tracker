import Dexie, { type EntityTable } from 'dexie';
import type { AttentionEntry, Experiment, UserSettings, WeeklySummary, Intention } from '../types';

const db = new Dexie('AttentionTrackerDB') as Dexie & {
  attentionEntries: EntityTable<AttentionEntry, 'id'>;
  experiments: EntityTable<Experiment, 'id'>;
  userSettings: EntityTable<UserSettings, 'id'>;
  weeklySummaries: EntityTable<WeeklySummary, 'id'>;
  intentions: EntityTable<Intention, 'id'>;
};

db.version(1).stores({
  attentionEntries: 'id, dayNumber, weekNumber, category, timestamp',
  experiments: 'id, status, startDate',
  userSettings: 'id',
  weeklySummaries: 'id, weekNumber',
});

db.version(2).stores({
  attentionEntries: 'id, dayNumber, weekNumber, category, timestamp',
  experiments: 'id, status, startDate',
  userSettings: 'id',
  weeklySummaries: 'id, weekNumber',
  intentions: 'id, timestamp',
});

export { db };
