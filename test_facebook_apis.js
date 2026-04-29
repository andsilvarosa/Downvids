const expandedUrl = "https://www.facebook.com/reel/1317124733626557/?rdid=LXXjNMShRlucHQhL&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F18qSkTTRsD%2F";
const key = process.env.RAPIDAPI_KEY || "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856"; // using dummy or known
const host = "social-media-video-downloader.p.rapidapi.com";

async function testCovalt() {
   const eps = ["https://api.cobalt.tools", "https://api.cobalt.tools/api/json", "https://cobalt.api.unv.is"];
   for (let url of eps) {
     try {
       const u = url.endsWith("json") ? url : url+ "/";
       const res = await fetch(u, {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ url: expandedUrl })
       });
       console.log("Cobalt:", url, res.status, await res.text());
     } catch(e) {}
   }
}

async function testRapidAPI() {
   const eps = ['/main', '/all', '/json', '/', '/api/v1/dl', '/download', '/api/video'];
   for (let ep of eps) {
     try {
       const res = await fetch(`https://${host}${ep}?url=${encodeURIComponent(expandedUrl)}`, {
         headers: { 'X-RapidAPI-Key':key, 'X-RapidAPI-Host':host }
       });
       console.log("RapidAPI:", ep, res.status);
     } catch(e) {}
   }
}

testCovalt().then(testRapidAPI);
