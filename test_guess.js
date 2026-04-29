const key = "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856";
const host = "social-media-video-downloader.p.rapidapi.com";
const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function testRapid() {
  const eps = [
    '/apidownloader/api/v1/tiktok/video',
    '/apidownloader/api/v1/social/video',
    '/v1/video',
    '/twitter/video',
    '/api/v1/dl',
    '/api/v1/download',
    '/social',
    '/smvd/video'
  ];
  
  for (const ep of eps) {
    let uri = `https://${host}${ep}?url=${encodeURIComponent(url)}&link=${encodeURIComponent(url)}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host
      }
    };
    try {
      const res = await fetch(uri, options);
      if (res.status !== 404 && res.status !== 405) {
          console.log(ep, res.status);
          if (res.status === 200) console.log(await res.text().then(t=>t.slice(0, 100)));
      }
    } catch(e) {}
  }
}
testRapid();
