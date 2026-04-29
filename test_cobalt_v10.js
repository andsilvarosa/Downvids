async function testCobaltV10() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const instances = [
    "https://cobalt.run/api/json",
    "https://api.cobalt.run/api/json",
    "https://v10.cobalt.tools/api/json",
    "https://cobalt.canard.cool/api/json",
    "https://co.wuk.sh/api/json"
  ];

  for (let api of instances) {
    try {
      console.log("Testing:", api);
      const res = await fetch(api, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          url: url,
          videoQuality: '720'
        })
      });
      const data = await res.json();
      console.log(res.status, data);
      if (data.url || data.status === 'stream') {
        console.log("Success with:", api);
        return;
      }
    } catch (e) {
      console.log("Failed:", api, e.message);
    }
  }
}
testCobaltV10();
