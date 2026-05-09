const urlFB = "https://www.facebook.com/share/r/1GUQtTouj7/";

async function test(url) {
  const host = "all-in-one-media-downloader-api.p.rapidapi.com";
  // We'll use the API key we know works
  const apiKey = "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856";

  const ep = "/download";
  try {
     const res = await fetch(`https://${host}${ep}?url=${encodeURIComponent(url)}`, {
       headers: {
         'X-RapidAPI-Key': apiKey,
         'X-RapidAPI-Host': host,
       }
     });
     console.log(ep, res.status);
     const txt = await res.json();
     console.log("Response:", JSON.stringify(txt, null, 2));
  } catch(e) { console.error(ep, e.message) }
}
test(urlFB);
