import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';

// Firebase configuration - you'll get these from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Auth
export const auth = getAuth(app);

// Current user state
let currentUser: User | null = null;

export function getCurrentUser(): User | null {
  return currentUser;
}

export function getUserId(): string | null {
  return currentUser?.uid || null;
}

// Sign in anonymously
export async function signInAnonymouslyIfNeeded(): Promise<User | null> {
  if (currentUser) return currentUser;

  try {
    const result = await signInAnonymously(auth);
    currentUser = result.user;
    console.log('Signed in anonymously:', currentUser.uid);
    return currentUser;
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    return null;
  }
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
}

// Firestore helpers
export function getUserCollection(collectionName: string) {
  const userId = getUserId();
  if (!userId) throw new Error('Not authenticated');
  return collection(firestore, 'users', userId, collectionName);
}

export function getUserDoc(collectionName: string, docId: string) {
  const userId = getUserId();
  if (!userId) throw new Error('Not authenticated');
  return doc(firestore, 'users', userId, collectionName, docId);
}

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  writeBatch
};

// Initialize Firebase Cloud Messaging
let messaging: ReturnType<typeof getMessaging> | null = null;

export function getFirebaseMessaging() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
}

export async function requestNotificationPermissionAndToken(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    const messagingInstance = getFirebaseMessaging();
    if (!messagingInstance) {
      console.log('Messaging not available');
      return null;
    }

    // Get the FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  const messagingInstance = getFirebaseMessaging();
  if (messagingInstance) {
    onMessage(messagingInstance, callback);
  }
}
