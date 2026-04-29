async function testLastDitch() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = encodeURIComponent(url);
  const endpoints = [
    { name: "fdownloader", url: `https://v3.fdownloader.net/api/video?url=${u}`, method: 'GET' },
    { name: "mateid", url: `https://mateid.co/api/facebook/format?url=${u}`, method: 'GET' },
     { name: "ssyoutube", url: `https://ssyoutube.com/api/video/facebook?url=${u}`, method: 'GET' }
  ];

  for (let ep of endpoints) {
    try {
      console.log("Testing:", ep.name);
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      console.log(res.status);
      const text = await res.text();
      console.log(text.substring(0, 200));
    } catch (e) {
      console.log("Error:", ep.name, e.message);
    }
  }
}
testLastDitch();
