import { Bindings } from '../types';

export async function logRequest(db: any, chatId: number, username: string, url: string, platform: string) {
  if (!db) {
    console.error('D1 Database binding (DB) is missing.');
    return;
  }
  try {
    await db.prepare(
      'INSERT INTO requests_log (chat_id, username, url, platform) VALUES (?, ?, ?, ?)'
    ).bind(chatId, username, url, platform).run();
  } catch (error) {
    console.error('Failed to log request to D1:', error);
  }
}
