const url = "https://www.instagram.com/p/DXxXaG_ic8P/?igsh=MWVkZWp2MGxuaWUwZg==";
async function testPOST() {
  const host = "all-media-downloader1.p.rapidapi.com";
  const apiKey = "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856";

  const fetchUrl = `https://${host}/all`;
  try {
     const res = await fetch(fetchUrl, {
       method: 'POST',
       headers: {
         'X-RapidAPI-Key': apiKey,
         'X-RapidAPI-Host': host,
         'Content-Type': 'application/x-www-form-urlencoded',
         'User-Agent': 'Mozilla/5.0'
       },
       body: `url=${encodeURIComponent(url)}&cookies=&cookies_file=`
     });
     console.log("Status:", res.status);
     const txt = await res.text();
     console.log("Response:", txt);
  } catch(e) { console.error(e) }
}
testPOST();
