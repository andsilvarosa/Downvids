const testUrls = {
  youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  facebook: "https://www.facebook.com/share/v/18qSkTTRsD/",
  instagram: "https://www.instagram.com/p/DXxXaG_ic8P/?igsh=MWVkZWp2MGxuaWUwZg=="
};

const providers = [
  {
    name: "Ryzendesu YT",
    url: `https://api.ryzendesu.vip/api/downloader/ytdl?url=${encodeURIComponent(testUrls.youtube)}`
  },
  {
    name: "Ryzendesu FB",
    url: `https://api.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(testUrls.facebook)}`
  },
  {
    name: "Vreden MY YT",
    url: `https://api.vreden.my.id/api/download/ytmp4?url=${encodeURIComponent(testUrls.youtube)}`
  },
  {
    name: "Vreden MY FB",
    url: `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(testUrls.facebook)}`
  },
  {
    name: "Delirius FB",
    url: `https://delirius-api-oficial.vercel.app/download/facebook?url=${encodeURIComponent(testUrls.facebook)}`
  },
  {
    name: "Delirius IG",
    url: `https://delirius-api-oficial.vercel.app/download/instagram?url=${encodeURIComponent(testUrls.instagram)}`
  },
  {
    name: "Itzpire IG",
    url: `https://itzpire.site/download/instagram?url=${encodeURIComponent(testUrls.instagram)}`
  },
  {
    name: "Itzpire YT",
    url: `https://itzpire.site/download/youtube?url=${encodeURIComponent(testUrls.youtube)}`
  }
];

async function run() {
  for (const prov of providers) {
    try {
      console.log(`Testing ${prov.name}...`);
      const res = await fetch(prov.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(5000)
      });
      console.log(`  --> Status: ${res.status}`);
      const text = await res.text();
      console.log(`  --> Response: ${text.substring(0, 150)}`);
    } catch(e) {
      console.log(`  --> Failed: ${e.message}`);
    }
  }
}

run();
