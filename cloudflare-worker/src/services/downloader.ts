import { Bindings } from '../types';
import { detectPlatform } from '../utils/url-parser';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<{ url: string | null, debugInfo: string }> {
  let debugLog = `[Debug Info para ${url}]\n`;
  const appendDebug = (msg: string) => { debugLog += msg + '\n'; };

  // 1. PRIORIDADE MÁXIMA: RapidAPI (Se configurada no Cloudflare)
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    const host = env.RAPIDAPI_HOST.replace(/^https?:\/\//, ''); // Clean host just in case
    const endpoints = ['/download', '/api/v1/dl', '/all', '/main', '/json', '/', '/api/video'];
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
          const candidates: any[] = [
             data.hd, data.data?.hd, data.result?.hd,
             data.play, data.data?.play, data.result?.play,
             data.data?.medias?.[0]?.url, data.medias?.[0]?.url,
             data.video, data.data?.video, data.result?.video,
             data.video_url,
             data.links?.[0]?.url, data.links?.[0]?.link,
             data.data?.main_url,
             data.url, data.data?.url, data.result?.url,
             data.link, data.data?.link, data.result?.link,
             data.direct_link, data.result?.mp4,
             Array.isArray(data) ? data[0]?.url : null
          ].filter(Boolean);

          let mediaUrl = null;
          const platform = detectPlatform(url);
          for (const c of candidates) {
             if (typeof c === 'string' && c.startsWith('http')) {
                const lowerUrl = c.toLowerCase();
                let isValid = true;
                if (platform === 'instagram' && (lowerUrl.includes('instagram.com/p/') || lowerUrl.includes('instagram.com/reel/'))) isValid = false;
                if (platform === 'facebook' && lowerUrl.includes('facebook.com/')) isValid = false;
                if (platform === 'tiktok' && (lowerUrl.includes('tiktok.com/@') || lowerUrl.includes('v.tiktok.com'))) isValid = false;
                
                if (isValid) {
                   mediaUrl = c;
                   break;
                }
             }
          }
          if (!mediaUrl && candidates.length > 0) {
              appendDebug(`(Recusado) URLs do JSON foram rejeitadas como sendo a URL original: ${candidates[0]}`);
          }

          if (mediaUrl) {
            return { url: mediaUrl, debugInfo: debugLog };
          } else {
             appendDebug(`(Não achei URL no JSON do RapidAPI)`);
          }
        } else {
           if (res.status === 429) {
               appendDebug(`RapidAPI falhou com 429 Rate Limit. Abortando tentativa no RapidAPI.`);
               break;
           }
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

  // 3. Outros Fallbacks (Facebook/Instagram/Youtube/etc)
  if (platform === 'facebook' || platform === 'instagram' || platform === 'youtube' || platform === 'twitter') {
    try {
       appendDebug(`Buscando fallbacks públicos para ${platform}...`);
       
       // Fallback 1: Tioo.eu.org (Backend do btch-downloader) - Extremamente confiável
       try {
         let endpoint = '';
         if (platform === 'instagram') endpoint = 'igdl';
         else if (platform === 'facebook') endpoint = 'fbdown';
         else if (platform === 'youtube') endpoint = 'youtube';
         else if (platform === 'twitter') endpoint = 'twitter';

         if (endpoint) {
            appendDebug(`Tentando Tioo Backend (${endpoint})...`);
            const tiooRes = await fetch(`https://backend1.tioo.eu.org/${endpoint}?url=${encodeURIComponent(url)}`, {
               headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            if (tiooRes.ok) {
               const data: any = await tiooRes.json();
               appendDebug(`Tioo raw: ${JSON.stringify(data).substring(0, 100)}...`);
               
               let tiooUrl = null;
               if (platform === 'instagram') {
                  if (Array.isArray(data)) tiooUrl = data[0]?.url;
                  else if (data.result && Array.isArray(data.result)) tiooUrl = data.result[0]?.url;
                  else tiooUrl = data.url || data.result?.url;
               } else if (platform === 'facebook') {
                  tiooUrl = data.HD || data.Normal_video || data.result?.HD || data.result?.Normal_video;
               } else if (platform === 'youtube') {
                  tiooUrl = data.mp4 || data.result?.mp4 || data.video || data.result?.video;
               } else if (platform === 'twitter') {
                  tiooUrl = data.url || data.result?.url || data.video || data.result?.video;
               }

               if (tiooUrl && typeof tiooUrl === 'string' && tiooUrl.startsWith('http')) {
                  return { url: tiooUrl, debugInfo: debugLog };
               }
            }
         }
       } catch (e: any) {
          appendDebug(`Tioo Backend falhou: ${e.message}`);
       }

       // Fallback 2: Vreden (Suporta YT tbm)
       try {
         let vrPath = '';
         if (platform === 'facebook') vrPath = 'fbdl';
         else if (platform === 'instagram') vrPath = 'igdl';
         else if (platform === 'youtube') vrPath = 'ytdl';

         if (vrPath) {
            const vrUrl = `https://api.vreden.web.id/api/${vrPath}?url=${encodeURIComponent(url)}`;
            appendDebug(`Tentando Vreden...`);
            const vRes = await fetch(vrUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (vRes.ok) {
                const data: any = await vRes.json();
                const res = data.result;
                const urlResult = res?.hd || res?.sd || res?.url || res?.video || res?.mp4;
                if (urlResult) return { url: urlResult, debugInfo: debugLog };
            }
         }
       } catch(e) {}

       // Fallback 3: Agatz
       try {
         let agPath = '';
         if (platform === 'facebook') agPath = 'facebook';
         else if (platform === 'instagram') agPath = 'instagram';
         else if (platform === 'youtube') agPath = 'ytmp4';

         if (agPath) {
            const agUrl = `https://api.agatz.xyz/api/${agPath}?url=${encodeURIComponent(url)}`;
            appendDebug(`Tentando Agatz...`);
            const aRes = await fetch(agUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (aRes.ok) {
                const data: any = await aRes.json();
                const urlResult = data.data?.url || data.data?.video || data.data?.[0]?.url || data.data?.mp4;
                if (urlResult) return { url: urlResult, debugInfo: debugLog };
            }
         }
       } catch(e) {}

       const isFb = platform === 'facebook';
       const isIg = platform === 'instagram';

       if (isFb || isIg) {
          // Fallback 4: Ryzendesu API (Restored)
          try {
            const ryzUrl = `https://api.ryzendesu.vip/api/downloader/${isFb ? 'fbdl' : 'igdl'}?url=${encodeURIComponent(url)}`;
            appendDebug(`Tentando Ryzendesu...`);
            const rRes = await fetch(ryzUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (rRes.ok) {
                const data: any = await rRes.json();
                const urlResult = data.url || data.video || (data.data && (data.data.url || data.data.video)) || (data.result && (data.result.url || data.result.hd || data.result.video));
                if (urlResult && typeof urlResult === 'string' && !urlResult.includes('ryzendesu.vip/api/downloader')) { 
                  return { url: urlResult, debugInfo: debugLog };
                }
            }
          } catch(e) {}

          // Fallback 4: Agatz
          try {
            const agUrl = `https://api.agatz.xyz/api/${isFb ? 'facebook' : 'instagram'}?url=${encodeURIComponent(url)}`;
            appendDebug(`Tentando Agatz...`);
            const aRes = await fetch(agUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (aRes.ok) {
                const data: any = await aRes.json();
                const urlResult = data.data?.url || data.data?.video || data.data?.[0]?.url;
                if (urlResult) return { url: urlResult, debugInfo: debugLog };
            }
          } catch(e) {}
       }
    } catch(e: any) {
        appendDebug(`Fallbacks públicos falharam: ${e.message}`);
    }
  }

  // 4. Fallback: Cobalt (Várias instâncias)
  try {
    const cobaltInstances = [
      'https://cobalt.api.unv.is/',
      'https://api.cobalt.tools/',
      'https://cobalt.now.sh/',
      'https://co.wuk.sh/'
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

  // FINAL ATTEMPT: Se nada funcionou e a URL tem parâmetros, tenta limpar e rodar de novo (RECURSIVO)
  if (url.includes('?') || url.includes('&')) {
    const cleanUrl = url.split(/[?#]/)[0];
    if (cleanUrl !== url) {
       appendDebug(`Nada funcionou. Tentando com URL limpa: ${cleanUrl}`);
       const retryResult = await getDirectMediaUrl(cleanUrl, env);
       return { url: retryResult.url, debugInfo: debugLog + '\n--- RETRY ---\n' + retryResult.debugInfo };
    }
  }

  return { url: null, debugInfo: debugLog };
}
