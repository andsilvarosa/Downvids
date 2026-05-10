import { Bindings } from '../types';
import { detectPlatform } from '../utils/url-parser';


async function fetchWithTimeout(url: string, options: any = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
     const response = await fetch(url, { ...options, signal: controller.signal });
     clearTimeout(id);
     return response;
  } catch (e) {
     clearTimeout(id);
     throw e;
  }
}

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<{ url: string | null, debugInfo: string }> {
  let debugLog = `[Debug Info para ${url}]\n`;
  const appendDebug = (msg: string) => { debugLog += msg + '\n'; };

  // 1. PRIORIDADE MÁXIMA: RapidAPI (Se configurada no Cloudflare)
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    const host = env.RAPIDAPI_HOST.replace(/^https?:\/\//, ''); // Clean host just in case
    // Endpoints comuns em APIs de download no RapidAPI (Jakub Lipinski / outros)
    const endpoints = [
      '/v1/social/autolink', '/social/autolink', '/smvd/get/all', '/smvd/all', 
      '/', '/all', '/main', '/get-video', '/download', '/api/video', '/api/v1/dl'
    ];
    appendDebug(`RapidAPI Host config: ${host}`);
    
    for (const endpoint of endpoints) {
      try {
        appendDebug(`Tentando RapidAPI endpoint: ${endpoint}`);
        // Tentar tanto GET quanto POST (JSON e FORM) para cada endpoint
        const variants = [
          { method: 'GET', type: 'QUERY' },
          { method: 'POST', type: 'JSON' },
          { method: 'POST', type: 'FORM' }
        ];

        for (const variant of variants) {
          try {
            const isPost = variant.method === 'POST';
            const subMethod = variant.type;
            
            appendDebug(`RapidAPI sub-tentativa: ${variant.method} ${subMethod}`);
            
            const fetchUrl = isPost ? `https://${host}${endpoint}` : `https://${host}${endpoint}?url=${encodeURIComponent(url)}`;
            const res = await fetchWithTimeout(fetchUrl, {
              method: variant.method,
              headers: {
                'X-RapidAPI-Key': env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': host,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ...(variant.type === 'FORM' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
                ...(variant.type === 'JSON' ? { 'Content-Type': 'application/json' } : {})
              },
              ...(variant.type === 'FORM' ? { body: `url=${encodeURIComponent(url)}` } : {}),
              ...(variant.type === 'JSON' ? { body: JSON.stringify({ url }) } : {}),
              cf: { cacheEverything: false }
            });

            if (res.ok) {
              const data: any = await res.json();
              appendDebug(`RapidAPI Sucesso (${subMethod}): ${JSON.stringify(data).substring(0, 50)}...`);
              
              // Busca recursiva profunda por campos que contêm URLs de mídia direta
              const findAnyUrl = (obj: any): string | null => {
                 if (!obj || typeof obj !== 'object') return null;
                 const mediaKeys = [
                    'hd', 'sd', 'play', 'url', 'link', 'video', 'video_url', 'mp4', 'direct_link', 
                    'download_link', 'main_url', 'media'
                 ];
                 for (const k of mediaKeys) {
                    const val = obj[k];
                    if (typeof val === 'string' && val.startsWith('http')) {
                       const vLower = val.toLowerCase();
                       const platform = detectPlatform(url);
                       // Ignorar se for a própria página original (algumas APIs retornam o input)
                       let looksValid = true;
                       if (platform === 'instagram' && vLower.includes('instagram.com/p/')) looksValid = false;
                       if (platform === 'facebook' && (vLower.includes('facebook.com/share/') || vLower.includes('fb.watch/'))) looksValid = false;
                       if (looksValid) return val;
                    }
                 }
                 // Recursão
                 for (const k in obj) {
                    if (typeof obj[k] === 'object') {
                       const found = findAnyUrl(obj[k]);
                       if (found) return found;
                    }
                 }
                 return null;
              };

              let mediaUrl = findAnyUrl(data);

              if (mediaUrl) {
                appendDebug(`URL Final RapidAPI: ${mediaUrl.substring(0, 50)}...`);
                return { url: mediaUrl, debugInfo: debugLog };
              }
            } else {
               const txt = await res.text();
               appendDebug(`RapidAPI ${subMethod} falhou: ${res.status} - ${txt.substring(0, 50)}`);
            }
          } catch (smErr) {}
        }
      } catch (e: any) {
         appendDebug(`Erro ao chamar RapidAPI ${endpoint}: ${e.message}`);
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
      const res = await fetchWithTimeout(`https://www.tikwm.com/api/?url=${encodeURIComponent(fullUrl)}`, {
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
      const altRes = await fetchWithTimeout('https://lovetik.com/api/ajax/search', {
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
      const tiklyRes = await fetchWithTimeout(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(fullUrl)}`, {
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

  // 3. Outros Fallbacks (Facebook/Instagram/etc)
  if (platform === 'facebook' || platform === 'instagram' || platform === 'youtube') {
    try {
       const isFb = platform === 'facebook';
       const isIg = platform === 'instagram';
       appendDebug(`Buscando fallbacks públicos para ${platform}...`);
       
       // Fallback 1: Ryzendesu API (IG/FB/TikTok)
       try {
         const rPath = isFb ? 'fbdl' : isIg ? 'igdl' : platform === 'tiktok' ? 'ttdl' : 'ytdl';
         const ryzUrl = `https://api.ryzendesu.vip/api/downloader/${rPath}?url=${encodeURIComponent(url)}`;
         appendDebug(`Tentando Ryzendesu ${rPath}...`);
         const rRes = await fetch(ryzUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
         if (rRes.ok) {
            const data: any = await rRes.json();
            const urlResult = data.url || data.video || (data.data && (data.data.url || data.data.video)) || (data.result && (data.result.url || data.result.hd || data.result.video));
            if (urlResult) return { url: urlResult, debugInfo: debugLog };
         }
       } catch(e) { }
       
       // Fallback 2: Vreden & Outras APIs Agregadoras
       try {
         const vredenHosts = ['https://api.vreden.my.id', 'https://api.vreden.web.id', 'https://vreden.my.id'];
         const vPaths = isFb ? ['/api/fbdl', '/api/download/facebook'] : 
                        isIg ? ['/api/igdl', '/api/download/instagram'] : 
                        platform === 'tiktok' ? ['/api/ttdl', '/api/tiktok'] :
                        ['/api/ytdl', '/api/download/youtube', '/api/download/ytmp4'];
         
         for (const vHost of vredenHosts) {
           for (const vPath of vPaths) {
             try {
               const vrUrl = `${vHost}${vPath}?url=${encodeURIComponent(url)}`;
               const vRes = await fetch(vrUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
               if (vRes.ok) {
                  const data: any = await vRes.json();
                  const urlResult = data.result?.hd || data.result?.sd || data.result?.url || data.result?.video || data.data?.url || data.data?.video || data.result?.mp4;
                  if (urlResult) return { url: urlResult, debugInfo: debugLog };
               }
             } catch(e) {}
           }
         }
       } catch(e) { }

       // Fallback 3: Delirius API (Muito estável para redes sociais)
       try {
         const delPaths = isFb ? ['/download/facebook'] : isIg ? ['/download/instagram'] : platform === 'tiktok' ? ['/download/tiktok'] : ['/download/ytmp4'];
         for (const dP of delPaths) {
           const delUrl = `https://delirius-api-oficial.vercel.app${dP}?url=${encodeURIComponent(url)}`;
           appendDebug(`Tentando Delirius ${dP}...`);
           const delRes = await fetch(delUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
           if (delRes.ok) {
              const data: any = await delRes.json();
              const urlResult = data.data?.url || data.data?.media || data.result?.url || data.data?.video || data.result?.video || data.data?.download?.url;
              if (urlResult) return { url: urlResult, debugInfo: debugLog };
           }
         }
       } catch(e) { }

       // Fallback 4: Itzpire API
       if (isFb || isIg || platform === 'tiktok' || platform === 'youtube') {
         try {
           let itzPath = isFb ? 'facebook' : isIg ? 'instagram' : platform === 'tiktok' ? 'tiktok' : 'youtube';
           const itzUrl = `https://itzpire.site/download/${itzPath}?url=${encodeURIComponent(url)}`;
           appendDebug(`Tentando Itzpire...`);
           const itzRes = await fetch(itzUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
           if (itzRes.ok) {
              const data: any = await itzRes.json();
              const payload = data.data || data;
              const urlResult = payload.video || payload.url || (payload.links && payload.links[0]?.url);
              if (urlResult) return { url: urlResult, debugInfo: debugLog };
           }
         } catch(e) { }
       }
    } catch(e: any) {
        appendDebug(`Fallbacks públicos falharam: ${e.message}`);
    }
  }

  // 4. Fallback: Cobalt API Pública (VÁRIAS INSTÂNCIAS)
  try {
    const cobaltInstances = [
      'https://cobalt.api.unv.is/',
      'https://cobalt.asap.works/',
      'https://cobalt.fast-api.tools/',
      'https://api.cobalt.codes/'
    ].sort(() => Math.random() - 0.5);

    appendDebug('Tentando instâncias do Cobalt...');

    for (const apiUrl of cobaltInstances) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout reduzido
        const isV10 = apiUrl.includes('cobalt.tools');
        const reqUrl = isV10 ? apiUrl : (apiUrl.endsWith('/') ? apiUrl + 'api/json' : apiUrl + '/api/json');

        appendDebug(`>> Cobalt try: ${apiUrl}`);

        const response = await fetchWithTimeout(reqUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          body: JSON.stringify({
            url: url,
            videoQuality: "720", 
            filenameStyle: "pretty",
            downloadMode: "auto"
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
           const errTxt = await response.text();
           appendDebug(`Cobalt ${apiUrl} error ${response.status}: ${errTxt.substring(0, 60)}`);
           
           // Se for 400, talvez tentar sem videoQuality (auto)
           if (response.status === 400 && apiUrl.includes('cobalt.tools')) {
              appendDebug(`Tentando novamente ${apiUrl} sem videoQuality...`);
              const retryRes = await fetchWithTimeout(reqUrl, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
              });
              if (retryRes.ok) {
                 const retryData: any = await retryRes.json();
                 if (retryData.url) return { url: retryData.url, debugInfo: debugLog };
              }
           }
           continue;
        }

        const data: any = await response.json();
        const resultUrl = data.url || (data.picker && data.picker[0]?.url) || data.link;
        
        if (resultUrl) {
          appendDebug(`Cobalt OK: ${apiUrl}`);
          return { url: resultUrl, debugInfo: debugLog };
        } else {
           appendDebug(`Resposta Cobalt sem URL: ${JSON.stringify(data).substring(0,100)}`);
        }
      } catch (e: any) {
         appendDebug(`Cobalt falhou em ${apiUrl}: ${e.message}`);
      }
    }
  } catch (error) {
    appendDebug('Cobalt fallback general error');
  }

  return { url: null, debugInfo: debugLog };
}
