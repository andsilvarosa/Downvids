import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const apiKey = process.env.RAPIDAPI_KEY || "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856";
    const host = process.env.RAPIDAPI_HOST || "all-media-downloader1.p.rapidapi.com";

    console.log("Using API Key:", apiKey.substring(0, 5) + "...");

    // Try RapidAPI with POST (as requested by user)
    const rapidRes = await fetch(`https://${host}/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      body: new URLSearchParams({
        url: url,
        cookies: "",
        cookies_file: ""
      })
    });

    if (rapidRes.ok) {
      const data = await rapidRes.json();
      console.log("RapidAPI Success Data Substring:", JSON.stringify(data).substring(0, 100));
      
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
      for (const c of candidates) {
         if (typeof c === 'string' && c.startsWith('http')) {
            const lowerUrl = c.toLowerCase();
            let isValid = true;
            if (lowerUrl.includes('instagram.com/p/') || lowerUrl.includes('instagram.com/reel/')) isValid = false;
            if (lowerUrl.includes('facebook.com/share/') || lowerUrl.includes('facebook.com/watch') || lowerUrl.includes('fb.watch/')) isValid = false;
            if (lowerUrl.includes('tiktok.com/@') || lowerUrl.includes('v.tiktok.com')) isValid = false;
            if (isValid) {
               mediaUrl = c;
               break;
            }
         }
      }

      const title = data.title || data.result?.title || data.data?.title || data.result?.description || "Facebook Video";
      const thumbnail = data.thumbnail || data.result?.thumbnail || data.data?.thumbnail || data.result?.image || "";

      if (mediaUrl) {
         return NextResponse.json({
            title,
            thumbnail,
            links: [
              { quality: "Download", url: mediaUrl }
            ],
            source: "RapidAPI"
         });
      }
    } else {
       const errText = await rapidRes.text();
       console.error("RapidAPI Error:", rapidRes.status, errText);
    }

    // Fallback 1: Vreden API
    try {
      const encUrl = encodeURIComponent(url);
      const vredenRes = await fetch(`https://api.vreden.web.id/api/fbdl?url=${encUrl}`);
      if (vredenRes.ok) {
        const data = await vredenRes.json();
        if (data.status && data.result) {
          return NextResponse.json({
            title: data.result.title || "Facebook Video",
            thumbnail: data.result.thumbnail || "",
            links: [
              { quality: "HD", url: data.result.hd || data.result.url },
              { quality: "SD", url: data.result.sd || data.result.url }
            ].filter((l: any) => l.url),
            source: "Vreden"
          });
        }
      }
    } catch (e) {
      console.error("Vreden fallback failed", e);
    }

    // Fallback 2: Itzpire API
    try {
      const encUrl = encodeURIComponent(url);
      const itzpireRes = await fetch(`https://itzpire.site/download/facebook?url=${encUrl}`);
      if (itzpireRes.ok) {
        const data = await itzpireRes.json();
        const d = data.data || data;
        if (data.status === "success" || d.video || d.url) {
          return NextResponse.json({
            title: d.title || "Facebook Video",
            thumbnail: d.thumbnail || "",
            links: [
              { quality: "Video", url: d.video || d.url }
            ].filter((l: any) => l.url),
            source: "Itzpire"
          });
        }
      }
    } catch (e) {
      console.error("Itzpire fallback failed", e);
    }

    return NextResponse.json({ error: 'Falha ao processar o vídeo. Todas as APIs falharam ou o vídeo é privado.' }, { status: 500 });
  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
