import { Bindings } from '../types';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<string | null> {
  // 1. Tentar RapidAPI se chaves foram preenchidas no env
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    // Lista de endpoints comuns para esse provedor "social-media-video-downloader"
    const endpoints = ['/main', '/all', '/json'];
    
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
          console.log(`[Downloader] Sucesso no endpoint ${endpoint}. Resposta:`, JSON.stringify(data));

          // Mapeamento exaustivo de campos comuns
          const mediaUrl = 
            data.url || 
            data.video || 
            data.video_url || 
            data.link ||
            (data.result && (data.result.url || data.result.video || data.result.hd)) ||
            (data.links && data.links[0]?.link) ||
            (data.data && (data.data.url || data.data.main_url));

          if (mediaUrl) return mediaUrl;
        } else {
          const errorText = await res.text();
          console.warn(`[Downloader] Endpoint ${endpoint} falhou com status ${res.status}: ${errorText}`);
        }
      } catch (e) {
        console.error(`[Downloader] Erro na tentativa do endpoint ${endpoint}:`, e);
      }
    }
  }

  // 2. Fallback: Cobalt API (Referência: https://api.cobalt.tools/)
  try {
    console.log(`[Downloader] Tentando Fallback Cobalt para: ${url}`);
    const COBALT_API_URL = 'https://api.cobalt.tools/api/json';
    const response = await fetch(COBALT_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        vQuality: "720",
        filenameStyle: "pretty"
      })
    });
    
    const data: any = await response.json();
    console.log('[Downloader] Resposta Cobalt:', JSON.stringify(data));

    if (response.ok && data.url) return data.url;
    if (data.picker && data.picker.length > 0) return data.picker[0].url;
  } catch (error) {
    console.error("[Downloader] Erro fatal no Fallback Cobalt:", error);
  }

  return null;
}
