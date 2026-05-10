import { Bindings } from '../types';
import { detectPlatform } from '../utils/url-parser';

export async function getDirectMediaUrl(url: string, env: Bindings): Promise<{ url: string | null, debugInfo: string }> {
  let debugLog = `[Debug Info para ${url}]\n`;
  const appendDebug = (msg: string) => { debugLog += msg + '\n'; };

  // 1. PRIORIDADE MÁXIMA: RapidAPI (Se configurada no Cloudflare)
  if (env.RAPIDAPI_KEY && env.RAPIDAPI_HOST) {
    const host = env.RAPIDAPI_HOST.replace(/^https?:\/\//, ''); // Clean host just in case
    // Endpoints comuns em APIs de download no RapidAPI (Jakub Lipinski / outros)
    const endpoints = ['/', '/all', '/main', '/get-video', '/download', '/api/video', '/api/youtube', '/v1/social/autolink', '/social/autolink', '/api/v1/dl'];
    appendDebug(`RapidAPI Host config: ${host}`);
    
    for (const endpoint of endpoints) {
      try {
        appendDebug(`Tentando RapidAPI endpoint: ${endpoint}`);
        // Forçar POST para hosts específicos que sabemos que funcionam assim
        const isSocialDownloader = host.includes('social-media-video-downloader');
        const isPost = endpoint === '/all' || endpoint === '/main' || endpoint === '/' || isSocialDownloader;
        const fetchUrl = `https://${host}${endpoint}`;
        
        // Tentar tanto POST com FORM quanto POST com JSON se for um endpoint de POST
        const subMethods = isPost ? ['POST_JSON', 'POST_FORM'] : ['GET'];

        for (const subMethod of subMethods) {
          try {
            const isJson = subMethod === 'POST_JSON';
            const isForm = subMethod === 'POST_FORM';
            
            appendDebug(`RapidAPI sub-tentativa: ${subMethod}`);
            
            const res = await fetch(isPost ? fetchUrl : `${fetchUrl}?url=${encodeURIComponent(url)}`, {
              method: isPost ? 'POST' : 'GET',
              headers: {
                'X-RapidAPI-Key': env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': host,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ...(isForm ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
                ...(isJson ? { 'Content-Type': 'application/json' } : {})
              },
              ...(isForm ? { body: `url=${encodeURIComponent(url)}` } : {}),
              ...(isJson ? { body: JSON.stringify({ url }) } : {}),
              cf: { cacheEverything: false } // Avoid CF cache on API calls
            });

            if (res.ok) {
              const data: any = await res.json();
              appendDebug(`RapidAPI Sucesso (${subMethod}): ${JSON.stringify(data).substring(0, 150)}...`);
              
              // Mapeamento extensivo de chaves de resposta
              const candidates: any[] = [
                 data.hd, data.data?.hd, data.result?.hd,
                 data.play, data.data?.play, data.result?.play,
                 data.url, data.data?.url, data.result?.url,
                 data.link, data.data?.link, data.result?.link,
                 data.video, data.data?.video, data.result?.video,
                 data.video_url, data.data?.video_url,
                 data.mp4, data.data?.mp4,
                 data.direct_link,
                 data.links?.[0]?.url, data.links?.[0]?.link,
                 data.data?.medias?.[0]?.url, data.medias?.[0]?.url,
                 data.result?.medias?.[0]?.url,
                 data.data?.main_url,
                 Array.isArray(data) ? (data[0]?.url || data[0]?.link) : null,
                 data.result?.mp4,
                 data.data?.link_video,
                 data.data?.links?.[0]?.url,
                 data.data?.download_link,
                 data.data?.links?.HD,
                 data.data?.links?.SD
              ].filter(Boolean);

              let mediaUrl = null;
              const platform = detectPlatform(url);
              for (const c of candidates) {
                 if (typeof c === 'string' && c.startsWith('http')) {
                    const lowerUrl = c.toLowerCase();
                    let isValid = true;
                    if (platform === 'instagram' && (lowerUrl.includes('instagram.com/p/') || lowerUrl.includes('instagram.com/reel/'))) isValid = false;
                    if (platform === 'facebook' && (lowerUrl.includes('facebook.com/share/') || lowerUrl.includes('facebook.com/watch') || lowerUrl.includes('fb.watch/'))) isValid = false;
                    if (platform === 'tiktok' && (lowerUrl.includes('tiktok.com/@') || lowerUrl.includes('v.tiktok.com'))) isValid = false;
                    if (platform === 'youtube' && (lowerUrl.includes('youtube.com/') || lowerUrl.includes('youtu.be/'))) isValid = false;
                    
                    if (isValid) {
                       mediaUrl = c;
                       break;
                    }
                 }
              }

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

  // 3. Outros Fallbacks (Facebook/Instagram/etc)
  if (platform === 'facebook' || platform === 'instagram' || platform === 'youtube') {
    try {
       const isFb = platform === 'facebook';
       const isIg = platform === 'instagram';
       appendDebug(`Buscando fallbacks públicos para ${platform}...`);
       
       // Fallback 1: Ryzendesu API (IG/FB)
       if (isFb || isIg) {
         try {
           const ryzUrl = `https://api.ryzendesu.vip/api/downloader/${isFb ? 'fbdl' : 'igdl'}?url=${encodeURIComponent(url)}`;
           appendDebug(`Tentando Ryzendesu...`);
           const rRes = await fetch(ryzUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
           if (rRes.ok) {
              const data: any = await rRes.json();
              appendDebug(`Ryzendesu res: ${JSON.stringify(data).substring(0, 100)}`);
              const urlResult = data.url || data.video || (data.data && (data.data.url || data.data.video)) || (data.result && (data.result.url || data.result.hd || data.result.video));
              if (urlResult && !urlResult.includes('ryzendesu.vip/api/downloader')) { 
                 return { url: urlResult, debugInfo: debugLog };
              }
           } else {
              appendDebug(`Ryzendesu falhou: ${rRes.status}`);
           }
         } catch(e) { appendDebug(`Erro Ryzendesu.`); }
       }
       
       // Fallback 2: Vreden (FB/IG/YT)
       try {
         let vrUrl = '';
         if (isFb) vrUrl = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`;
         else if (isIg) vrUrl = `https://api.vreden.my.id/api/igdl?url=${encodeURIComponent(url)}`;
         else if (platform === 'youtube') vrUrl = `https://api.vreden.my.id/api/ytdl?url=${encodeURIComponent(url)}`;

         if (vrUrl) {
           appendDebug(`Tentando Vreden...`);
           const vRes = await fetch(vrUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
           if (vRes.ok) {
              const data: any = await vRes.json();
              appendDebug(`Vreden res: ${JSON.stringify(data).substring(0, 100)}`);
              const urlResult = data.result?.hd || data.result?.sd || data.result?.url || data.result?.video || data.result?.mp4;
              if (urlResult) return { url: urlResult, debugInfo: debugLog };
           } else {
              appendDebug(`Vreden falhou: ${vRes.status}`);
           }
         }
       } catch(e) { appendDebug(`Erro Vreden.`); }

       // Fallback 3: Itzpire API
       if (isFb || isIg) {
         try {
           const itzUrl = `https://itzpire.site/download/${isFb ? 'facebook' : 'instagram'}?url=${encodeURIComponent(url)}`;
           appendDebug(`Tentando Itzpire...`);
           const itzRes = await fetch(itzUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
           if (itzRes.ok) {
              const data: any = await itzRes.json();
              appendDebug(`Itzpire res: ${JSON.stringify(data).substring(0, 100)}`);
              const payload = data.data || data;
              const urlResult = payload.video || payload.url;
              if (urlResult) return { url: urlResult, debugInfo: debugLog };
           } else {
              appendDebug(`Itzpire falhou: ${itzRes.status}`);
           }
         } catch(e) { appendDebug(`Erro Itzpire.`); }
       }
    } catch(e: any) {
        appendDebug(`Fallbacks públicos falharam: ${e.message}`);
    }
  }

  // 4. Fallback: Cobalt API Pública (VÁRIAS INSTÂNCIAS)
  try {
    const cobaltInstances = [
      'https://cobalt.asap.works/',
      'https://cobalt.fast-api.tools/',
      'https://api.cobalt.codes/',
      'https://cobalt.hyonsu.com/',
      'https://cobalt.disroot.org/',
      'https://cobalt.q69.de/',
      'https://api.cobalt.is/',
      'https://cobalt.cloud/'
    ];

    appendDebug('Tentando instâncias do Cobalt...');

    for (const apiUrl of cobaltInstances) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout per cobalt instance
        const isV10 = apiUrl.includes('cobalt.tools');
        const reqUrl = isV10 ? apiUrl : (apiUrl.endsWith('/') ? apiUrl + 'api/json' : apiUrl + '/api/json');

        appendDebug(`>> Cobalt try: ${apiUrl}`);

        const response = await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          body: JSON.stringify({
            url: url,
            videoQuality: "720", // Cobalt v10 usa videoQuality
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
              const retryRes = await fetch(reqUrl, {
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
