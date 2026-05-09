async function test() {
  const url = encodeURIComponent("https://www.facebook.com/share/r/1GUQtTouj7/");
  try {
     const res = await fetch(`https://api.ryzendesu.vip/api/downloader/fbdl?url=${url}`, {
         headers: {
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
             "Accept": "application/json"
         }
     });
     console.log(res.status);
     const txt = await res.text();
     console.log(txt.substring(0, 200));
  }catch(e){}
}
test();
