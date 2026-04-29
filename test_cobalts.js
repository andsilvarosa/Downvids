const domains = [
  "co.wuk.sh", "cobalt.wuk.sh", "cobalt.ziyia.com", "v10.cobalt.tools",
  "cobalt.kwiatektv.com", "api.cobalt.lol", "cobalt.catgirl.party",
  "cobalt.run", "api.cobalt.run", "cobalt.tools", "co.balt.one",
  "cobalt.my", "dl.cobalt.tools", "cobalt.canard.cool", 
  "cobalt.pudding.cat", "cobalt.seeyou.su", "cobalt.chylex.com",
  "cobalt.owo.club", "cobalt.t1w.is", "cobalt.perv.cat", 
  "cobalt.v06.re", "cobalt.api.unv.is", "cobalt.1332024.xyz"
];

async function testCovalt() {
   const expandedUrl = "https://www.facebook.com/share/v/18qSkTTRsD/";
   for (let domain of domains) {
     const url = `https://${domain}`;
     try {
       const res = await fetch(url, {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         signal: AbortSignal.timeout(3000),
         body: JSON.stringify({ url: expandedUrl })
       });
       console.log(domain, res.status, await res.text().catch(()=>''));
     } catch(e) {
       //console.error(domain, e.message);
     }
   }
}

testCovalt();
