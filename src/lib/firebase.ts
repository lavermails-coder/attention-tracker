import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

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
