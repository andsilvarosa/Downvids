async function test() {
  const url = "https://www.instagram.com/reel/DX-lqQeMBXe/";
  try {
     const res = await fetch(`https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`, {
         headers: {
             "User-Agent": "Mozilla/5.0"
         }
     });
     const txt = await res.text();
     console.log(txt.substring(0, 300));
  }catch(e){}
}
test();
