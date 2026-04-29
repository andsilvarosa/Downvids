const key = "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856";
const host = "social-media-video-downloader.p.rapidapi.com";
const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function testRapid() {
  const endpoints = ['/smvd/get/all', '/get/video', '/', '/api/v1/dl', '/download/video', '/api/downloader', '/api/video', '/api/download'];
  
  for (const ep of endpoints) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host
      }
    };
    try {
      const res = await fetch(`https://${host}${ep}?url=${encodeURIComponent(url)}`, options);
      if (res.status !== 404) {
        console.log(`Endpoint ${ep}:`, res.status);
      }
    } catch(e) { }
  }
}

testRapid();
