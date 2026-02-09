import {
  signInAnonymouslyIfNeeded,
  getUserId,
  getUserCollection,
  getUserDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
} from './firebase';
import { db } from './dexie-db';
import type { AttentionEntry, Experiment, UserSettings, WeeklySummary, Intention } from '../types';

type SyncCallback = () => void;
let syncListeners: SyncCallback[] = [];

export function addSyncListener(callback: SyncCallback): () => void {
  syncListeners.push(callback);
  return () => {
    syncListeners = syncListeners.filter(cb => cb !== callback);
  };
}

function notifySyncListeners() {
  syncListeners.forEach(cb => cb());
}

// Initialize sync - call this on app start
export async function initSync(): Promise<void> {
  try {
    const user = await signInAnonymouslyIfNeeded();
    if (!user) {
      console.warn('Sync disabled: not authenticated');
      return;
    }

    console.log('Sync initialized for user:', user.uid);

    // Initial sync: push local data to cloud, then listen for changes
    // Do this in background to not block app loading
    pushLocalToCloud().catch(console.error);
    setupRealtimeListeners();
  } catch (error) {
    console.error('Sync initialization failed:', error);
    // Don't throw - app should still work offline
  }
}

// Push all local data to Firestore
async function pushLocalToCloud(): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    // Sync attention entries
    const localEntries = await db.attentionEntries.toArray();
    for (const entry of localEntries) {
      await setDoc(getUserDoc('attentionEntries', entry.id), entry, { merge: true });
    }

    // Sync experiments
    const localExperiments = await db.experiments.toArray();
    for (const exp of localExperiments) {
      await setDoc(getUserDoc('experiments', exp.id), exp, { merge: true });
    }

    // Sync settings
    const settings = await db.userSettings.get('settings');
    if (settings) {
      await setDoc(getUserDoc('settings', 'main'), settings, { merge: true });
    }

    // Sync weekly summaries
    const summaries = await db.weeklySummaries.toArray();
    for (const summary of summaries) {
      await setDoc(getUserDoc('weeklySummaries', summary.id), summary, { merge: true });
    }

    console.log('Local data pushed to cloud');
  } catch (error) {
    console.error('Error pushing to cloud:', error);
  }
}

// Setup realtime listeners for cloud changes
function setupRealtimeListeners(): void {
  try {
    const userId = getUserId();
    if (!userId) return;

    // Listen to attention entries
    const entriesQuery = query(getUserCollection('attentionEntries'), orderBy('timestamp'));
    onSnapshot(entriesQuery, async (snapshot) => {
    for (const change of snapshot.docChanges()) {
      const data = change.doc.data() as AttentionEntry;
      if (change.type === 'added' || change.type === 'modified') {
        const existing = await db.attentionEntries.get(data.id);
        if (!existing || existing.createdAt < data.createdAt) {
          await db.attentionEntries.put(data);
        }
      } else if (change.type === 'removed') {
        await db.attentionEntries.delete(data.id);
      }
    }
    notifySyncListeners();
  });

  // Listen to experiments
  onSnapshot(getUserCollection('experiments'), async (snapshot) => {
    for (const change of snapshot.docChanges()) {
      const data = change.doc.data() as Experiment;
      if (change.type === 'added' || change.type === 'modified') {
        await db.experiments.put(data);
      } else if (change.type === 'removed') {
        await db.experiments.delete(data.id);
      }
    }
    notifySyncListeners();
  });

  // Listen to settings
  onSnapshot(getUserDoc('settings', 'main'), async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as UserSettings;
      await db.userSettings.put({ ...data, id: 'settings' });
      notifySyncListeners();
    }
  });

    // Listen to weekly summaries
    onSnapshot(getUserCollection('weeklySummaries'), async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        const data = change.doc.data() as WeeklySummary;
        if (change.type === 'added' || change.type === 'modified') {
          await db.weeklySummaries.put(data);
        } else if (change.type === 'removed') {
          await db.weeklySummaries.delete(data.id);
        }
      }
      notifySyncListeners();
    });

    console.log('Realtime listeners set up');
  } catch (error) {
    console.error('Error setting up realtime listeners:', error);
  }
}

// Sync a single entry to cloud
export async function syncEntry(entry: AttentionEntry): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    await setDoc(getUserDoc('attentionEntries', entry.id), entry, { merge: true });
  } catch (error) {
    console.error('Error syncing entry:', error);
  }
}

// Sync experiment to cloud
export async function syncExperiment(experiment: Experiment): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    await setDoc(getUserDoc('experiments', experiment.id), experiment, { merge: true });
  } catch (error) {
    console.error('Error syncing experiment:', error);
  }
}

// Sync settings to cloud
export async function syncSettings(settings: UserSettings): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    await setDoc(getUserDoc('settings', 'main'), settings, { merge: true });
  } catch (error) {
    console.error('Error syncing settings:', error);
  }
}

// Sync weekly summary to cloud
export async function syncWeeklySummary(summary: WeeklySummary): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    await setDoc(getUserDoc('weeklySummaries', summary.id), summary, { merge: true });
  } catch (error) {
    console.error('Error syncing weekly summary:', error);
  }
}

// Sync intention to cloud
export async function syncIntention(intention: Intention): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    await setDoc(getUserDoc('intentions', intention.id), intention, { merge: true });
  } catch (error) {
    console.error('Error syncing intention:', error);
  }
}

// Get the user's sync ID (for linking devices)
export function getSyncId(): string | null {
  return getUserId();
}
