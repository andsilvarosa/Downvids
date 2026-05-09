async function testIG() {
  const urls = [
    "https://anonyig.com/api/ig/userInfoByUsername/instagram", // just testing if it's alive
    "https://api.ryzendesu.vip/api/downloader/igdl?url=",
    "https://itzpire.site/download/instagram?url=",
    "https://api.vreden.web.id/api/igdl?url=",
    "https://dark-yasiya-api-new.vercel.app/api/igdown?url=",
    "https://api.siputzx.my.id/api/d/igdl?url="
  ];
  
  const target = encodeURIComponent("https://www.instagram.com/reel/DX-lqQeMBXe/");
  
  for (let u of urls) {
      try {
         const res = await fetch(u.includes('?') ? u + target : u);
         console.log(u, res.status);
         if(res.ok) {
             const data = await res.json();
             console.log(JSON.stringify(data).substring(0, 100));
         }
      } catch(e) {
          console.log(u, "failed", e.message);
      }
  }
}
testIG();
