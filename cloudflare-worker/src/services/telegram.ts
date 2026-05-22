export class TelegramBot {
  constructor(private token: string) {}

  async sendMessage(chatId: number, text: string, options: any = {}) {
    const response = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, ...options })
    });
    if (!response.ok) {
       const err = await response.text();
       throw new Error(`Telegram API Error (sendMessage): ${response.status} - ${err}`);
    }
    return response;
  }

  async sendVideo(chatId: number, videoUrl: string) {
    const response = await fetch(`https://api.telegram.org/bot${this.token}/sendVideo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, video: videoUrl })
    });
    if (!response.ok) {
       const err = await response.text();
       throw new Error(`Telegram API Error (sendVideo): ${response.status} - ${err}`);
    }
    return response;
  }
}
