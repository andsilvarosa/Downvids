async function testNewOnes() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  const u = encodeURIComponent(url);
  const eps = [
    `https://api.lolhuman.xyz/api/facebook?apikey=FREE&url=${u}`,
    `https://api.mhankbarbar.tech/facebook?url=${u}`,
    `https://itzpire.site/download/facebook?url=${u}`,
    `https://api.giftedtech.my.id/api/download/facebook?url=${u}&apikey=gifted`
  ];

  for (let ep of eps) {
    try {
      console.log("Testing:", ep);
      const res = await fetch(ep);
      console.log(res.status);
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.log("Error:", e.message);
    }
  }
}
testNewOnes();
