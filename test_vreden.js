async function testVredenFixed() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = encodeURIComponent(url);
  const eps = [
    `https://api.vreden.web.id/api/facebook?url=${u}`,
    `https://api.vreden.web.id/api/video/facebook?url=${u}`,
    `https://api.vreden.web.id/api/download/facebook?url=${u}`,
    `https://api.vreden.web.id/api/fdown?url=${u}`
  ];

  for (let ep of eps) {
    try {
      console.log("Testing:", ep);
      const res = await fetch(ep);
      console.log(res.status);
      const data = await res.json();
      console.log(data);
      if (res.status === 200 && data.status) return;
    } catch (e) {
      console.log("Error:", e.message);
    }
  }
}
testVredenFixed();
