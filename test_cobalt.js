const instances = [
  "https://co.wuk.sh/",
  "https://api.cobalt.tools/",
  "https://cobalt.tools/api/json",
  "https://dl.wuk.sh/",
];
async function test() {
  for (const apiUrl of instances) {
    try {
      const isV10 = apiUrl.endsWith('/') || !apiUrl.includes('api/json');
      const reqUrl = isV10 ? apiUrl : apiUrl + 'api/json';
      const res = await fetch(reqUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ url: "https://www.facebook.com/share/r/1GUQtTouj7/" })
      });
      console.log(`\n--- ${reqUrl} [${res.status}] ---`);
      console.log(await res.text());
    } catch(e) {
      console.log(`\n--- ${apiUrl} [ERROR] ---`, e.message);
    }
  }
} test();
