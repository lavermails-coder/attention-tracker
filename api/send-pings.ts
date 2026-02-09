import { createClient } from 'redis';
import admin from 'firebase-admin';

export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(request: Request) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const redis = createClient({ url: process.env.REDIS_URL });
  await redis.connect();

  try {
    // Get all active tokens
    const tokensResult = await redis.sMembers('active_tokens');
    const tokens = Array.isArray(tokensResult) ? tokensResult : Array.from(tokensResult);

    if (!tokens || tokens.length === 0) {
      await redis.disconnect();
      return new Response(JSON.stringify({ message: 'No active tokens' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const token of tokens) {
      try {
        // Send notification via FCM
        await admin.messaging().send({
          token: token as string,
          notification: {
            title: 'Attention Check',
            body: "What's on your mind right now?",
          },
          webpush: {
            fcmOptions: {
              link: '/?ping=true',
            },
            notification: {
              icon: '/icon.svg',
              badge: '/icon.svg',
              vibrate: [200, 100, 200],
              requireInteraction: true,
            },
          },
        });

        sentCount++;
      } catch (error: any) {
        // If token is invalid, remove it
        if (error.code === 'messaging/registration-token-not-registered') {
          await redis.sRem('active_tokens', token);
          await redis.del(`user:${token}`);
        }
        errors.push(`Token ${String(token).slice(0, 10)}...: ${error.message}`);
      }
    }

    await redis.disconnect();

    return new Response(
      JSON.stringify({
        success: true,
        tokenCount: tokens.length,
        sentCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending pings:', error);
    await redis.disconnect();
    return new Response('Internal error', { status: 500 });
  }
}
