async function testRyz() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = "https://api.ryzendesu.vip/api/downloader/fbdl?url=" + encodeURIComponent(url);
  try {
     const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
     const text = await res.text();
     console.log(res.status, text.substring(0, 500));
     
     // Is it json?
     try {
       const json = JSON.parse(text);
       console.log("JSON PARSED:", json);
     } catch(e) {}
  } catch(e) { console.error(e) }
}
testRyz();
