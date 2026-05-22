async function test() {
  const urls = [
    "https://cobalt.api.unv.is/",
    "https://cobalt.asap.works/",
    "https://cobalt.fast-api.tools/",
    "https://api.cobalt.codes/"
  ];
  for (const url of urls) {
    try {
      console.log("Checking:", url);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
        signal: AbortSignal.timeout(3000)
      });
      console.log(`Status of ${url}: ${res.status}`);
      console.log(`Body:`, await res.text());
    } catch(e) {
      console.log(`Failed ${url}:`, e.message);
    }
  }
}
test();
