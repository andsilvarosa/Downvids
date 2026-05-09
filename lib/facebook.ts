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
  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl })
    });
    
    if (res.ok) {
      return await res.json();
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erro ao processar o vídeo");
    }
  } catch (e: any) {
    console.error("Download failed:", e);
    throw new Error(e.message || "Não foi possível conectar ao servidor de download.");
  }
}
