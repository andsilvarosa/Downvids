import { Bindings } from '../types';
import { detectPlatform } from '../utils/url-parser';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<string | null> {
  // Limpar a URL (remover parâmetros de rastreamento como ?si=...)
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('facebook.com')) { // FB costuma precisar de params
      urlObj.search = '';
    }
    url = urlObj.toString();
  } catch (e) {}

  const platform = detectPlatform(url);

  // 1. TikTok Especializado (Gratuito sem Auth)
  if (platform === 'tiktok') {
    try {
      console.log(`[Downloader] Tentando API externa Tikwm para TikTok: ${url}`);
      // Tikwm funciona muito bem para links curtos, vamos testar diretamente
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      const data: any = await res.json();
      if (data && data.code === 0 && data.data) {
        return data.data.play || data.data.wmplay;
      } else {
         console.warn(`[Downloader] Tikwm falhou ou link não suportado. Resposta:`, JSON.stringify(data));
      }
    } catch (e) {
      console.error(`[Downloader] Erro ao usar Tikwm:`, e);
    }
  }

  // 2. Tentar RapidAPI se chaves foram preenchidas no env
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    // Lista de endpoints comuns para diversos provedores no RapidAPI (ex: social-media-video-downloader)
    const endpoints = ['/main', '/all', '/json', '/', '/api/v1/dl', '/download'];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`[Downloader] Tentando RapidAPI (${endpoint}) para: ${url}`);
        const res = await fetch(`https://${env.RAPIDAPI_HOST}${endpoint}?url=${encodeURIComponent(url)}`, {
          headers: {
            'X-RapidAPI-Key': env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': env.RAPIDAPI_HOST
          }
        });

        if (res.ok) {
          const data: any = await res.json();
          console.log(`[Downloader] Sucesso no endpoint ${endpoint}.`);

          // Mapeamento exaustivo de campos comuns de APIs de vídeo
          const mediaUrl = 
            data.url || 
            data.video || 
            data.video_url || 
            data.link ||
            (data.result && (data.result.url || data.result.video || data.result.hd)) ||
            (data.links && data.links[0]?.link) ||
            (data.data && (data.data.url || data.data.main_url || data.data.play));

          if (mediaUrl) return mediaUrl;
        } else {
          // Apenas mostra aviso (404 é comum se endpoint n existe)
          if (res.status !== 404) {
            console.warn(`[Downloader] Endpoint ${endpoint} falhou com status ${res.status}`);
          }
        }
      } catch (e) {
        console.error(`[Downloader] Erro na tentativa do endpoint ${endpoint}:`, e);
      }
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
