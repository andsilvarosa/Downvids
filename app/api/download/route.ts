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
      
      const mediaUrl = data.url || data.video || data.video_url || data.link || data.direct_link ||
            (data.result && (data.result.url || data.result.video || data.result.hd || data.result.link || data.result.mp4)) ||
            (data.data && (data.data.url || data.data.main_url || data.data.play || data.data.video || data.data.link)) ||
            (data.links && (data.links[0]?.link || data.links[0]?.url)) ||
            (data.medias && data.medias[0]?.url) || (Array.isArray(data) && data[0]?.url);

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

    // If RapidAPI fails, we could try fallbacks here or return error
    return NextResponse.json({ error: 'Falha ao processar o vídeo com a API principal.' }, { status: 500 });
  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
