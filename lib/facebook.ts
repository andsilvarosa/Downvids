export interface FacebookVideoInfo {
  title: string;
  thumbnail: string;
  duration?: string;
  links: {
    quality: string;
    url: string;
  }[];
  source: string;
}

export async function downloadFacebookVideo(videoUrl: string): Promise<FacebookVideoInfo> {
  const encUrl = encodeURIComponent(videoUrl);
  
  // Strategy 1: Vreden API (trying common working endpoints)
  try {
    const res = await fetch(`https://api.vreden.web.id/api/fbdl?url=${encUrl}`);
    if (res.ok) {
      const data = await res.json();
      if (data.status && data.result) {
         return {
            title: data.result.title || "Facebook Video",
            thumbnail: data.result.thumbnail || "",
            links: [
              { quality: "HD", url: data.result.hd || data.result.url },
              { quality: "SD", url: data.result.sd || data.result.url }
            ].filter(l => l.url),
            source: "Vreden"
         };
      }
    }
  } catch (e) {
    console.error("Vreden failed", e);
  }

  // Strategy 2: Itzpire API
  try {
    const res = await fetch(`https://itzpire.site/download/facebook?url=${encUrl}`);
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success" || data.data) {
         const d = data.data || data;
         return {
            title: d.title || "Facebook Video",
            thumbnail: d.thumbnail || "",
            links: [
              { quality: "Video", url: d.video || d.url }
            ].filter(l => l.url),
            source: "Itzpire"
         };
      }
    }
  } catch (e) {
    console.error("Itzpire failed", e);
  }

  // Strategy 3: Ryzendesu (Trying their downloader API)
  try {
     const res = await fetch(`https://api.ryzendesu.vip/api/downloader/fbdl?url=${encUrl}`);
     if (res.ok) {
        const data = await res.json();
        if (data.status === true && data.result) {
           return {
             title: data.result.title || "Facebook Video",
             thumbnail: data.result.thumbnail || "",
             links: data.result.links || [{ quality: "Video", url: data.result.url }],
             source: "Ryzendesu"
           };
        }
     }
  } catch (e) {}

  // Strategy 4: Dark Yasiya
  try {
    const res = await fetch(`https://dark-yasiya-api-new.vercel.app/api/fdown?url=${encUrl}`);
    if (res.ok) {
      const data = await res.json();
      if (data.status && data.result) {
        return {
          title: data.result.title || "Facebook Video",
          thumbnail: data.result.thumbnail || "",
          links: [
            { quality: "HD", url: data.result.hd },
            { quality: "SD", url: data.result.sd }
          ].filter(l => l.url),
          source: "Dark Yasiya"
        };
      }
    }
  } catch(e) {}

  throw new Error("Não foi possível obter links de download para este vídeo. Tente outro link ou tente mais tarde.");
}
