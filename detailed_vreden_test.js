async function test() {
  const urls = [
    "https://api.vreden.my.id/",
    "https://api.vreden.my.id/api",
    "https://api.vreden.my.id/api/download/ytmp4"
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
