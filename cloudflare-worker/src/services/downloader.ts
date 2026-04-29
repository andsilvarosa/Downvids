import { Bindings } from '../types';
import { detectPlatform } from '../utils/url-parser';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<string | null> {
  // 1. PRIORIDADE MÁXIMA: RapidAPI (Se configurada no Cloudflare)
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    const endpoints = ['/main', '/all', '/json', '/', '/api/v1/dl', '/download', '/api/video'];
    for (const endpoint of endpoints) {
      try {
        console.log(`[Downloader] Tentando RapidAPI: ${env.RAPIDAPI_HOST}${endpoint}`);
        const res = await fetch(`https://${env.RAPIDAPI_HOST}${endpoint}?url=${encodeURIComponent(url)}`, {
          headers: {
            'X-RapidAPI-Key': env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': env.RAPIDAPI_HOST,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        if (res.ok) {
          const data: any = await res.json();
          const mediaUrl = data.url || data.video || data.video_url || data.link || data.direct_link ||
            (data.result && (data.result.url || data.result.video || data.result.hd || data.result.link || data.result.mp4)) ||
            (data.data && (data.data.url || data.data.main_url || data.data.play || data.data.video || data.data.link)) ||
            (data.links && (data.links[0]?.link || data.links[0]?.url)) ||
            (data.medias && data.medias[0]?.url) || (Array.isArray(data) && data[0]?.url);
          if (mediaUrl && typeof mediaUrl === 'string' && mediaUrl.startsWith('http')) return mediaUrl;
        }
      } catch (e) {}
    }
  }

  const platform = detectPlatform(url);

  // 2. TikTok Especializado (Se a RapidAPI falhar ou não suportar o link)
  if (platform === 'tiktok') {
    try {
      console.log(`[Downloader] Tentando Fallback Tikwm para TikTok: ${url}`);
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
      });
      const data: any = await res.json();
      if (data && data.code === 0 && data.data) {
        return data.data.play || data.data.wmplay;
      }
    } catch (e) {
      console.error(`[Downloader] Erro no fallback Tikwm:`, e);
    }
  }

  // 3. Fallback: Cobalt API Pública
  try {
    console.log(`[Downloader] Tentando Fallback Cobalt para: ${url}`);
    
    // Lista expandida de instâncias do Cobalt para maior redundância
    const cobaltInstances = [
      'https://cobalt.api.unv.is/',
      'https://co.wuk.sh/',
      'https://api.cobalt.tools/',
      'https://cobalt.sh/',
      'https://cobalt.v06.re/',
      'https://cobalt.perv.cat/'
    ];

    for (const apiUrl of cobaltInstances) {
      try {
        console.log(`[Downloader] Testando instância: ${apiUrl}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          body: JSON.stringify({
            url: url,
            vQuality: "720", // 720p é mais seguro para o limite de 50MB do Telegram
            filenameStyle: "pretty"
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) continue;

        const data: any = await response.json();
        
        // Suporte para versões variadas do Cobalt (v7, v10, etc)
        const resultUrl = data.url || (data.picker && data.picker[0]?.url) || data.link;
        
        if (resultUrl) {
          console.log(`[Downloader] Sucesso com Cobalt na instância ${apiUrl}`);
          return resultUrl;
        }
      } catch (e) {
        console.warn(`[Downloader] Falha na instância ${apiUrl}:`, e);
      }
    }
  } catch (error) {
    console.error("[Downloader] Erro fatal no Fallback Cobalt:", error);
  }

  return null;
}
