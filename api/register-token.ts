import { createClient } from 'redis';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const redis = createClient({ url: process.env.REDIS_URL });
  await redis.connect();

  try {
    const { token, platform, timezone, activeHoursStart, activeHoursEnd } = await request.json();

    if (!token) {
      await redis.disconnect();
      return new Response('Token required', { status: 400 });
    }

    // Determine platform: 'ios' for native APNs, 'web' for FCM
    const tokenPlatform = platform || 'web';

    // Store token with user preferences
    await redis.hSet(`user:${token}`, {
      token,
      platform: tokenPlatform,
      timezone: timezone || 'UTC',
      activeHoursStart: activeHoursStart || '12:00',
      activeHoursEnd: activeHoursEnd || '22:00',
      registeredAt: new Date().toISOString(),
    });

    // Add to active tokens set
    await redis.sAdd('active_tokens', token);

    // Also add to platform-specific set for targeted sending
    await redis.sAdd(`active_tokens:${tokenPlatform}`, token);

    await redis.disconnect();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error registering token:', error);
    await redis.disconnect();
    return new Response('Internal error', { status: 500 });
  }
}
