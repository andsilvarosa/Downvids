async function testNewAPIs() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = encodeURIComponent(url);
  const endpoints = [
    `https://restapi.apibotwa.biz.id/api/facebook?url=${u}`,
    `https://api.vreden.web.id/api/downloader/fbdl?url=${u}`,
    `https://api.neoxr.eu/api/fb?url=${u}`,
    `https://api.botcahx.live/api/download/fb?url=${u}`,
    `https://aemt.me/facebook?url=${u}`,
    `https://api.caliph.biz.id/api/facebook?url=${u}`
  ];

  for (let ep of endpoints) {
    try {
      console.log("Testing:", ep);
      const res = await fetch(ep, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(res.status);
      const text = await res.text();
      console.log(text.substring(0, 200));
      if (res.status === 200 && (text.includes(".mp4") || text.includes("url"))) {
         console.log("MAYBE SUCCESS with:", ep);
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
  }
}
testNewAPIs();
