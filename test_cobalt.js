const url = "https://vt.tiktok.com/ZS9U3ErRC/";
async function test() {
  const cobaltInstances = ['https://co.wuk.sh/'];
  for (const apiUrl of cobaltInstances) {
     try {
        const res = await fetch(apiUrl, {
           method: 'POST',
           headers: {'Accept': 'application/json','Content-Type': 'application/json'},
           body: JSON.stringify({url: url, vQuality: "720", filenameStyle: "pretty"})
        });
        console.log(apiUrl, res.status, await res.text());
     } catch(e) { console.error(e) }
  }
}
test();
