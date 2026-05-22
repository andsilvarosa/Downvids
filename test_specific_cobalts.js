async function test() {
  const domains = ["cobalt.chylex.com", "cobalt.my"];
  const expandedUrl = "https://www.facebook.com/share/v/18qSkTTRsD/";
  for (const domain of domains) {
    try {
      console.log(`Testing: https://${domain}/`);
      const res = await fetch(`https://${domain}/`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: expandedUrl }),
        signal: AbortSignal.timeout(5000)
      });
      console.log(`Status of ${domain}:`, res.status);
      console.log(`Body of ${domain}:`, await res.text());
    } catch(e) {
      console.log(`Error of ${domain}:`, e.message);
    }
  }
}
test();
