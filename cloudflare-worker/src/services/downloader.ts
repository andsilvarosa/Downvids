import { Bindings } from '../types';
import { detectPlatform } from '../utils/url-parser';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<{ url: string | null, debugInfo: string }> {
  let debugLog = `[Debug Info para ${url}]\n`;
  const appendDebug = (msg: string) => { debugLog += msg + '\n'; };

  // 1. PRIORIDADE MÁXIMA: RapidAPI (Se configurada no Cloudflare)
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    const host = env.RAPIDAPI_HOST.replace(/^https?:\/\//, ''); // Clean host just in case
    const endpoints = ['/main', '/all', '/json', '/', '/api/v1/dl', '/download', '/api/video'];
    appendDebug(`RapidAPI Host config: ${host}`);
    
    for (const endpoint of endpoints) {
      try {
        appendDebug(`Tentando endpoints: ${endpoint}`);
        // Usar POST para /all ou se for o host que o usuário indicou
        const isPost = endpoint === '/all' || endpoint === '/main';
        const fetchUrl = `https://${host}${endpoint}`;
        
        const res = await fetch(isPost ? fetchUrl : `${fetchUrl}?url=${encodeURIComponent(url)}`, {
          method: isPost ? 'POST' : 'GET',
          headers: {
            'X-RapidAPI-Key': env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': host,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ...(isPost ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
          },
          ...(isPost ? { body: `url=${encodeURIComponent(url)}&cookies=&cookies_file=` } : {})
        });
        if (res.ok) {
          const data: any = await res.json();
          appendDebug(`RapidAPI OK res: ${JSON.stringify(data).substring(0, 100)}...`);
          const mediaUrl = data.url || data.video || data.video_url || data.link || data.direct_link ||
            (data.result && (data.result.url || data.result.video || data.result.hd || data.result.link || data.result.mp4)) ||
            (data.data && (data.data.url || data.data.main_url || data.data.play || data.data.video || data.data.link)) ||
            (data.links && (data.links[0]?.link || data.links[0]?.url)) ||
            (data.medias && data.medias[0]?.url) || (Array.isArray(data) && data[0]?.url);
          if (mediaUrl && typeof mediaUrl === 'string' && mediaUrl.startsWith('http')) {
            return { url: mediaUrl, debugInfo: debugLog };
          } else {
             appendDebug(`(Não achei URL no JSON do RapidAPI)`);
          }
        } else {
           if (res.status !== 404) {
             const txt = await res.text();
             appendDebug(`RapidAPI ${endpoint} Fail: ${res.status} - ${txt.substring(0, 50)}`);
           }
        }
      } catch (e: any) {
         // ignore
      }
    }
  } else {
     appendDebug(`RapidAPI_Key ou Host ausentes nas env vars.`);
  }

  const platform = detectPlatform(url);

  // Helper para expandir URL curta
  async function expandUrl(targetUrl: string): Promise<string> {
    try {
      if (targetUrl.includes('vt.tiktok.com') || targetUrl.includes('vm.tiktok.com')) {
        appendDebug(`Fazendo fetch de expansão em ${targetUrl}...`);
        const res = await fetch(targetUrl, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
        appendDebug(`Expandida para: ${res.url}`);
        return res.url;
      }
    } catch(e: any) {
      appendDebug(`Falha ao expandir URL: ${e.message}`);
    }
    return targetUrl;
  }

  // 2. TikTok Especializado
  if (platform === 'tiktok') {
    try {
      const fullUrl = await expandUrl(url);
      appendDebug(`Tentando Tikwm com URL: ${fullUrl}`);
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(fullUrl)}`, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
      });
      const data: any = await res.json();
      appendDebug(`Tikwm code: ${data?.code}`);
      if (data && data.code === 0 && data.data) {
        let r_url = data.data.play || data.data.wmplay;
        if (r_url) return { url: r_url, debugInfo: debugLog };
      }
      
      // Tentativa 2 com outra API pública (Lovetik)
      appendDebug('Tentando API alternativa (Lovetik)...');
      const altRes = await fetch('https://lovetik.com/api/ajax/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'User-Agent': 'Mozilla/5.0' },
        body: `query=${encodeURIComponent(fullUrl)}`
      });
      if (altRes.ok) {
        const altData: any = await altRes.json();
        if (altData && altData.status === 'ok' && altData.links && altData.links.length > 0) {
           // Encontrar o link MP4 HD ou o primeiro disponível (watermark free)
           let bestLink = altData.links.find((l: any) => l.a && l.t.includes('MP4') && !l.s?.includes('Watermarked'));
           if (!bestLink) bestLink = altData.links[0];
           appendDebug(`Lovetik API sucesso: ${JSON.stringify(bestLink).substring(0, 50)}`);
           return { url: bestLink.a, debugInfo: debugLog };
        }
      } else {
         appendDebug(`Lovetik API HTTP erro: ${altRes.status}`);
      }
      
      // Tentativa 3: TiklyDown
      appendDebug('Tentando TiklyDown...');
      const tiklyRes = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(fullUrl)}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (tiklyRes.ok) {
          const tiklyData: any = await tiklyRes.json();
          if (tiklyData && tiklyData.video && tiklyData.video.noWatermark) {
              appendDebug('TiklyDown OK.');
              return { url: tiklyData.video.noWatermark, debugInfo: debugLog };
          }
      } else {
         appendDebug(`TiklyDown HTTP erro: ${tiklyRes.status}`);
      }
      
    } catch (e: any) {
      appendDebug(`Tikwm/Lovetik/Tikly err: ${e.message}`);
    }
  }

  // 3. Fallback: Cobalt API Pública
  try {
    const cobaltInstances = [
      'https://cobalt.api.unv.is/',
      'https://api.cobalt.tools/'
    ];

    appendDebug('Tentando Cobalt...');

    for (const apiUrl of cobaltInstances) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); 

        const isV10 = apiUrl === 'https://api.cobalt.tools/';
        const reqUrl = isV10 ? apiUrl : apiUrl + 'api/json';

        const response = await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          body: JSON.stringify({
            url: url,
            vQuality: "720", 
            filenameStyle: "pretty"
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
           appendDebug(`Cobalt ${apiUrl} error ${response.status}`);
           continue;
        }

        const data: any = await response.json();
        const resultUrl = data.url || (data.picker && data.picker[0]?.url) || data.link;
        
        if (resultUrl) {
          appendDebug(`Cobalt OK: ${apiUrl}`);
          return { url: resultUrl, debugInfo: debugLog };
        } else {
           appendDebug(`Resposta Cobalt inválida: ${JSON.stringify(data).substring(0,50)}`);
        }
      } catch (e: any) {
         appendDebug(`Cobalt falhou em ${apiUrl}.`);
      }
    }
  } catch (error) {
    appendDebug('Cobalt fallback error');
  }

  return { url: null, debugInfo: debugLog };
}
