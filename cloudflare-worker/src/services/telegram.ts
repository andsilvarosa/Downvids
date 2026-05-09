export class TelegramBot {
  constructor(private token: string) {}

  async sendMessage(chatId: number, text: string) {
    return await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
  }

  async sendVideo(chatId: number, videoUrl: string) {
    return await fetch(`https://api.telegram.org/bot${this.token}/sendVideo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, video: videoUrl })
    });
  }
}
