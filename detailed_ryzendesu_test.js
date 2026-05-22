async function test() {
  const urls = [
    "https://api.ryzendesu.vip/",
    "https://api.ryzendesu.vip/api",
    "https://api.ryzendesu.vip/api/downloader"
  ];
  for (const url of urls) {
    try {
      console.log("Calling:", url);
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      console.log("Status:", res.status);
      console.log("Response:", (await res.text()).substring(0, 500));
    } catch(e) {
      console.log("Failed:", e.message);
    }
  }
}
test();
