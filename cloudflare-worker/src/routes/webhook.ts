import { Hono } from 'hono';
import { Bindings } from '../types';
import { TelegramBot } from '../services/telegram';
import { getDirectMediaUrl } from '../services/downloader';
import { logRequest } from '../services/analytics';
import { extractUrls, detectPlatform } from '../utils/url-parser';
import { isValidMediaUrl } from '../utils/validators';

const webhookRoute = new Hono<{ Bindings: Bindings }>();

webhookRoute.post('/', async (c) => {
  const update: any = await c.req.json();
  
  // Ignorar caso não seja uma mensagem de texto simples
  if (!update.message || !update.message.text) {
    return c.text('OK');
  }

  const chatId = update.message.chat.id;
  const text = update.message.text as string;
  const username = update.message.from?.username || 'desconhecido';
  
  const bot = new TelegramBot(c.env.TELEGRAM_BOT_TOKEN);

  if (text.startsWith('/start')) {
    await bot.sendMessage(
      chatId, 
      '🚀 *Video Downloader Bot*\n\nMe envie o link de um vídeo do YouTube, TikTok, Instagram ou Facebook e eu te retornarei o arquivo mp4!'
    );
    return c.text('OK');
  }

  if (!isValidMediaUrl(text)) {
    await bot.sendMessage(chatId, '❌ Por favor, envie um link válido de uma plataforma suportada.');
    return c.text('OK');
  }

  const targetUrl = extractUrls(text)[0];
  const platform = detectPlatform(targetUrl);

  // Defer Logging to background so it doesn't block Telegram request
  c.executionCtx.waitUntil(logRequest(c.env.DB, chatId, username, targetUrl, platform));

  await bot.sendMessage(chatId, '⏳ Baixando e processando mídia...');

  const { url: mediaUrl, debugInfo } = await getDirectMediaUrl(targetUrl, c.env);

  if (!mediaUrl) {
    await bot.sendMessage(chatId, `❌ Ops! Falha ao extrair vídeo deste link. O conteúdo pode ser privado ou não suportado.\n\n🛠 *Log de Debug:*\n\`\`\`${debugInfo}\`\`\``, { parse_mode: 'Markdown' });
    return c.text('OK');
  }

  const videoAttempt = await bot.sendVideo(chatId, mediaUrl);
  
  // O Telegram falha se o vídeo for >50mb ao tentar via URL (por Bot API direto)
  if (!videoAttempt.ok) {
    await bot.sendMessage(
      chatId, 
      `⚠️ O limite de tamanho do Telegram (50MB) foi excedido ou o formato não foi aceito nativamente.\n\nAqui está o link direto para baixar:\n${mediaUrl}`
    );
  }

  return c.text('OK');
});

export default webhookRoute;
