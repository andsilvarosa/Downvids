const url = "https://vt.tiktok.com/ZS9U3ErRC/";
async function test() {
  const cobaltInstances = ['https://api.cobalt.tools/api/json', 'https://api.cobalt.tools/'];
  for (const apiUrl of cobaltInstances) {
     try {
        const res = await fetch(apiUrl, {
           method: 'POST',
           headers: {'Accept': 'application/json','Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
           body: JSON.stringify({url: url, vQuality: "720", filenameStyle: "pretty"})
        });
        console.log(apiUrl, res.status, await res.text());
     } catch(e) { console.error(apiUrl, e.message) }
  }
}
test();
