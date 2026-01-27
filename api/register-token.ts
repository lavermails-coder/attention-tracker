import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { token, timezone, activeHoursStart, activeHoursEnd } = await request.json();

    if (!token) {
      return new Response('Token required', { status: 400 });
    }

    // Store token with user preferences
    await kv.hset(`user:${token}`, {
      token,
      timezone: timezone || 'UTC',
      activeHoursStart: activeHoursStart || '12:00',
      activeHoursEnd: activeHoursEnd || '22:00',
      registeredAt: new Date().toISOString(),
    });

    // Add to active tokens set
    await kv.sadd('active_tokens', token);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error registering token:', error);
    return new Response('Internal error', { status: 500 });
  }
}
