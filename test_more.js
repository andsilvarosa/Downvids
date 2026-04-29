const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
async function testAll() {
  const eps = [
    "https://bk9.fun/download/facebook?url=",
    "https://api.vkrdownloader.workers.dev/api?url=",
    "https://api.agatz.my.id/api/fbdl?url="
  ];
  for(let ep of eps) {
     try {
       const u = ep + encodeURIComponent(url);
       const r = await fetch(u);
       console.log(ep, r.status, await r.text().then(t=>t.substring(0, 200)));
     } catch(e) { console.log(ep, e.message); }
  }
}
testAll();
