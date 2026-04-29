const facebookUrl = "https://www.facebook.com/share/v/18qSkTTRsD/";
async function testAll() {
  const eps = [
    // api.ryzendesu.vip ?
    "https://api.ryzendesu.vip/api/downloader/fbdl",
  ];
  for(let ep of eps) {
     try {
       const u = ep + "?url=" + encodeURIComponent(facebookUrl);
       const r = await fetch(u);
       console.log(ep, r.status, await r.text().then(t=>t.substring(0, 200)));
     } catch(e) {}
  }
}
testAll();
