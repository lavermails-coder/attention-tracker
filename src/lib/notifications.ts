import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import type { PingSchedule, UserSettings } from '../types';

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (isNativePlatform()) {
    const result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
      await PushNotifications.register();
      return true;
    }
    return false;
  }

  // Web fallback
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function canUseNotifications(): boolean {
  if (isNativePlatform()) {
    return true; // Permissions are checked at request time on native
  }
  return 'Notification' in window && Notification.permission === 'granted';
}

export function showNotification(title: string, body: string, tag?: string): void {
  if (isNativePlatform()) {
    // On native, notifications are sent from the server via APNs
    return;
  }

  if (!canUseNotifications()) return;

  // If service worker is available, use it
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      payload: { title, body, tag },
    });
  } else {
    // Fallback to regular notification
    new Notification(title, { body, tag });
  }
}

export async function registerNativePushToken(
  apiBaseUrl: string,
  settings: { timezone: string; activeHoursStart: string; activeHoursEnd: string }
): Promise<void> {
  if (!isNativePlatform()) return;

  await PushNotifications.addListener('registration', async (token) => {
    console.log('Native push token:', token.value);

    try {
      await fetch(`${apiBaseUrl}/api/register-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.value,
          platform: 'ios',
          timezone: settings.timezone,
          activeHoursStart: settings.activeHoursStart,
          activeHoursEnd: settings.activeHoursEnd,
        }),
      });
    } catch (error) {
      console.error('Failed to register native push token:', error);
    }
  });

  await PushNotifications.addListener('registrationError', (error) => {
    console.error('Push registration error:', error);
  });

  await PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received:', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push notification action:', notification);
  });
}

function randomTimeInRange(startHour: number, startMin: number, endHour: number, endMin: number): Date {
  const today = new Date();
  const start = new Date(today);
  start.setHours(startHour, startMin, 0, 0);

  const end = new Date(today);
  end.setHours(endHour, endMin, 0, 0);

  const startMs = start.getTime();
  const endMs = end.getTime();
  const randomMs = startMs + Math.random() * (endMs - startMs);

  return new Date(randomMs);
}

export function generateDailyPingSchedule(settings: UserSettings): PingSchedule {
  const today = new Date().toISOString().split('T')[0];

  // Parse active hours
  const [startHour] = settings.activeHoursStart.split(':').map(Number);
  const [endHour] = settings.activeHoursEnd.split(':').map(Number);

  // Window 1: Start to midpoint (default 12:00-18:00)
  const midpoint = Math.floor((startHour + endHour) / 2);
  const ping1Time = randomTimeInRange(startHour, 0, midpoint, 0);

  // Window 2: Midpoint to end (default 18:00-22:00)
  const ping2Time = randomTimeInRange(midpoint, 0, endHour, 0);

  return {
    date: today,
    ping1Time: ping1Time.toISOString(),
    ping2Time: ping2Time.toISOString(),
    ping1Completed: false,
    ping2Completed: false,
  };
}

export function scheduleNotification(time: Date, title: string, body: string): number | null {
  if (isNativePlatform()) {
    // On native, notifications are scheduled server-side via APNs
    return null;
  }

  const now = new Date();
  const delay = time.getTime() - now.getTime();

  if (delay <= 0) return null;

  const timeoutId = window.setTimeout(() => {
    showNotification(title, body, 'attention-ping');
  }, delay);

  return timeoutId;
}

export function getTimeUntilNextPing(schedule: PingSchedule): string | null {
  const now = new Date();

  if (!schedule.ping1Completed) {
    const ping1 = new Date(schedule.ping1Time);
    if (ping1 > now) {
      const diff = ping1.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
  }

  if (!schedule.ping2Completed) {
    const ping2 = new Date(schedule.ping2Time);
    if (ping2 > now) {
      const diff = ping2.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
  }

  return null;
}
