import { Bindings } from '../types';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<string | null> {
  // 1. Tentar RapidAPI se chaves foram preenchidas no env
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    try {
      console.log(`[Downloader] Tentando RapidAPI para: ${url}`);
      // Alguns provedores usam /main ou /json, vamos tentar o padrão /main que é comum nesse host
      const res = await fetch(`https://${env.RAPIDAPI_HOST}/main?url=${encodeURIComponent(url)}`, {
        headers: {
          'X-RapidAPI-Key': env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': env.RAPIDAPI_HOST
        }
      });
      
      const data: any = await res.json();
      console.log('[Downloader] Resposta RapidAPI:', JSON.stringify(data));

      if (res.ok) {
        // Mapeamento comum de campos em APIs de download
        if (data.url) return data.url;
        if (data.video_url) return data.video_url;
        if (data.result && data.result.url) return data.result.url;
        if (data.links && data.links.length > 0) return data.links[0].link || data.links[0].url;
      }
    } catch (e) {
      console.error("[Downloader] Erro RapidAPI:", e);
    }
  }

  // 2. Fallback base (Cobalt API via POST)
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
        vQuality: "720"
      })
    });
    
    const data: any = await response.json();
    console.log('[Downloader] Resposta Cobalt:', JSON.stringify(data));

    if (!response.ok) return null;
    return data.url || null;
  } catch (error) {
    console.error("[Downloader] Erro Cobalt:", error);
    return null;
  }
}
