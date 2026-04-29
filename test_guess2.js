const expandedUrl = "https://www.facebook.com/share/v/18qSkTTRsD/";
const key = process.env.RAPIDAPI_KEY || "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856"; 
const host = "social-media-video-downloader.p.rapidapi.com";

async function testRapidAPI() {
   const eps = [
      '/snaptik', '/twitter', '/fbdl', '/igdl', '/tiktok', '/dl', '/api/facebook',
      '/media', '/v1/media', '/video', '/facebook', '/fb', '/api/fb', '/api/fbdl',
      '/api/v1/facebook', '/api/v1/fb', '/aweme', '/fdownloader', '/social',
      '/api/social', '/api/dl', '/api/download', '/get', '/api/get', '/getVideo'
   ];
   for (let ep of eps) {
     try {
       const [r1, r2] = await Promise.all([
         fetch(`https://${host}${ep}?url=${encodeURIComponent(expandedUrl)}`, { headers: { 'X-RapidAPI-Key':key, 'X-RapidAPI-Host':host } }),
         fetch(`https://${host}${ep}`, { method: 'POST', headers: { 'X-RapidAPI-Key':key, 'X-RapidAPI-Host':host, 'Content-Type': 'application/json' }, body: JSON.stringify({url: expandedUrl}) })
       ]);
       if(r1.status !== 404 || r2.status !== 404) {
          console.log("Found:", ep, r1.status, r2.status);
       }
     } catch(e) {}
   }
   console.log("Done");
}

testRapidAPI();
