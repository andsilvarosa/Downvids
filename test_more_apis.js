async function testAll() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const eps = [
    "https://api.alyachan.dev/api/fb?url=",
    "https://api.botcahx.eu.org/api/dowloader/fbdown?url=", 
    "https://api.tiklydown.eu.org/api/download/facebook?url=",
    "https://restapi.apibotwa.biz.id/api/fbdl?url="
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
