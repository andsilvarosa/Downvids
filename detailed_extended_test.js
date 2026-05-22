async function test() {
  const urls = [
    "https://cobalt.qwyh.dev/",
    "https://api.cobalt.luo.mx/",
    "https://co.pussthecat.org/"
  ];
  for (const url of urls) {
    try {
      console.log("Fetching:", url);
      await fetch(url);
    } catch(e) {
      console.log("Error:", url, e);
      if (e.cause) console.log("Cause:", url, e.cause);
    }
  }
}
test();
