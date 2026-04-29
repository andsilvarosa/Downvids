async function testAll() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = encodeURIComponent(url);
  const eps = [
    "https://api.dreaded.site/api/fbdl?url=",
    "https://api.vreden.web.id/api/fbdl?url=",
    "https://itzpire.com/download/facebook?url="
  ];
  for(let ep of eps) {
     try {
       const res = await fetch(ep + u);
       console.log(ep, res.status, await res.text().then(t=>t.substring(0, 100)));
     } catch(e) { console.log(ep, e.message); }
  }
}
testAll();
