// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: 'AIzaSyBWLCq7qhCkU4-6kB_0eUTVolEInRyVars',
  authDomain: 'attention-tracker-b1e23.firebaseapp.com',
  projectId: 'attention-tracker-b1e23',
  storageBucket: 'attention-tracker-b1e23.firebasestorage.app',
  messagingSenderId: '605348474342',
  appId: '1:605348474342:web:130ae442d486140aeaba27',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Attention Check';
  const notificationOptions = {
    body: payload.notification?.body || "What's on your mind right now?",
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'attention-ping',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow('/?ping=true');
      }
    })
  );
});
