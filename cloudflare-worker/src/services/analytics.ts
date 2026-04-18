import { Bindings } from '../types';

export async function logRequest(db: D1Database, chatId: number, username: string, url: string, platform: string) {
  try {
    await db.prepare(
      'INSERT INTO requests_log (chat_id, username, url, platform) VALUES (?, ?, ?, ?)'
    ).bind(chatId, username, url, platform).run();
  } catch (error) {
    console.error('Failed to log request to D1:', error);
  }
}
