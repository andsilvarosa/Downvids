import { Bindings } from '../types';
import { detectPlatform } from '../utils/url-parser';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<string | null> {
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
    
    // Instâncias públicas v10 do Cobalt
    const cobaltInstances = [
      'https://co.wuk.sh/',
      'https://api.cobalt.tools/'
    ];

    for (const apiUrl of cobaltInstances) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url
          })
        });
        
        const data: any = await response.json();
        
        // Cobalt v10 retorna 'url'
        if (response.ok && data && data.url) {
          return data.url;
        }
      } catch (e) {
        // Ignora erro de instância individual e tenta a próxima
      }
    }
  } catch (error) {
    console.error("[Downloader] Erro fatal no Fallback Cobalt:", error);
  }

  return null;
}
