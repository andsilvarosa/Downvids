const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

async function test() {
  const hosts = [
    { name: "Siesens Cobalt", url: "https://cobalt.siesens.moe/api/json", method: "POST", body: { url: youtubeUrl } },
    { name: "Siesens Api Cobalt", url: "https://api.cobalt.siesens.moe/api/json", method: "POST", body: { url: youtubeUrl } },
    { name: "Kyoko Cobalt", url: "https://cobalt.kyoko.top/api/json", method: "POST", body: { url: youtubeUrl } },
    { name: "BochilGaming", url: `https://api.bochilgaming.com/api/dowloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`, method: "GET" },
    { name: "Apibotwa", url: `https://restapi.apibotwa.biz.id/api/facebook?url=${encodeURIComponent(youtubeUrl)}`, method: "GET" },
    { name: "Giftedtech", url: `https://api.giftedtech.my.id/api/download/facebook?url=${encodeURIComponent(youtubeUrl)}&apikey=gifted`, method: "GET" }
  ];
  for (const h of hosts) {
    try {
      console.log(`Testing ${h.name}...`);
      const options = {
        method: h.method || "GET",
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        signal: AbortSignal.timeout(4000)
      };
      if (h.method === "POST" && h.body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(h.body);
      }
      const res = await fetch(h.url, options);
      console.log(`  --> Status: ${res.status}`);
      const text = await res.text();
      console.log(`  --> Body: ${text.substring(0, 200)}`);
    } catch (e) {
      console.log(`  --> Failed: ${e.message}`);
    }
  }
}

test();
