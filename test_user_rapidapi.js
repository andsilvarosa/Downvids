const key = "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856";
const host = "social-media-video-downloader.p.rapidapi.com";
const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function testRapid() {
  const endpoints = ['/smvd/get/all']; // Wait! I need to know the correct endpoint for this API!
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': host
    }
  };

  try {
    const res = await fetch(`https://${host}/smvd/get/all?url=${encodeURIComponent(url)}`, options);
    const text = await res.text();
    console.log("Status:", res.status, text.slice(0, 1000));
  } catch(e) { console.error(e); }
}

testRapid();
