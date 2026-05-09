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
  
  if (!videoAttempt.ok) {
    const errorData: any = await videoAttempt.json().catch(() => ({}));
    const errorMsg = errorData.description || 'Erro desconhecido';
    
    // Se for erro de formato ou download, tenta sendDocument
    if (errorMsg.includes('failed to get HTTP content') || 
        errorMsg.includes('wrong file identifier') || 
        errorMsg.includes('wrong remote file identifier for video')) {
      
      await bot.sendMessage(chatId, '🔄 O vídeo não pôde ser processado nativamente. Tentando enviar como arquivo...');
      const docAttempt = await bot.sendDocument(chatId, mediaUrl);
      
      if (docAttempt.ok) return c.text('OK');
      
      const docError: any = await docAttempt.json().catch(() => ({}));
      const finalError = docError.description || errorMsg;

      await bot.sendMessage(
        chatId, 
        `⚠️ Falha ao enviar mídia.\n\n*Motivo:* ${finalError}\n\n*Nota:* O Telegram permite links diretos de até 20-50MB. Se o vídeo for maior, ele não será enviado.\n\n🔗 *Link Direto:* [Clique aqui para baixar](${mediaUrl})`,
        { parse_mode: 'Markdown' }
      );
    } else {
      await bot.sendMessage(
        chatId, 
        `⚠️ Erro do Telegram: ${errorMsg}\n\n🔗 *Link Direto para download:* ${mediaUrl}`
      );
    }
  }

  return c.text('OK');
});

export default webhookRoute;
