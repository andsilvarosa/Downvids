async function test() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = "https://api.cobalt.tools/";
  try {
     const res = await fetch(u, {
        method: 'POST',
        headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({ url: url })
     });
     console.log(res.status, await res.text());
  } catch(e) { console.error(e) }
}
test();
