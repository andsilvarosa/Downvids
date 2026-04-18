import { Bindings } from '../types';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<string | null> {
  // 1. Tentar RapidAPI se chaves foram preenchidas no env
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    try {
      const res = await fetch(`https://${env.RAPIDAPI_HOST}/download?url=${encodeURIComponent(url)}`, {
        headers: {
          'X-RapidAPI-Key': env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': env.RAPIDAPI_HOST
        }
      });
      if (res.ok) {
        const data: any = await res.json();
        // A chave '.video_url' varia conforme o provedor exato na RapidAPI (ajuste se necessário)
        if (data.video_url || data.url) {
          return data.video_url || data.url; 
        }
      }
    } catch (e) {
      console.error("Erro no fallback do RapidAPI:", e);
    }
  }

  // 2. Fallback base (Cobalt API via POST)
  try {
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
    
    if (!response.ok) return null;
    const data: any = await response.json();
    return data.url || null;
  } catch (error) {
    console.error("Erro na integração com Cobalt API:", error);
    return null;
  }
}
