async function run() {
  const wikiUrl = "https://raw.githubusercontent.com/wiki/imputnet/cobalt/Public-instances.md";
  console.log("Fetching wiki from:", wikiUrl);
  try {
    const res = await fetch(wikiUrl);
    if (!res.ok) {
       console.log("Failed to fetch wiki page:", res.status);
       return;
    }
    const md = await res.text();
    console.log("Wiki content size:", md.length);
    
    // Find all links (http or https)
    const regex = /https?:\/\/[a-zA-Z0-9_\-\.\/]+/g;
    const urls = [...new Set(md.match(regex))];
    console.log("Found raw URLs in wiki:", urls.length);
    
    const candidates = urls.filter(u => {
      const lower = u.toLowerCase();
      // Remove asset links, main domain, etc.
      if (lower.includes('cobalt.tools') || lower.includes('github.com') || lower.includes('wuk.sh')) {
         return false;
      }
      return true;
    }).map(u => {
      // Clean host to root domain / path
      let clean = u;
      if (clean.endsWith('/')) {
        clean = clean.slice(0, -1);
      }
      return clean;
    });
    
    const uniqueCandidates = [...new Set(candidates)];
    console.log("Cleaned candidates:", uniqueCandidates);
    
    const testUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    
    for (const host of uniqueCandidates) {
      try {
        console.log(`Testing: ${host}`);
        const apiRes = await fetch(host + "/api/json", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          body: JSON.stringify({ url: testUrl }),
          signal: AbortSignal.timeout(3000)
        });
        
        console.log(`  --> Status: ${apiRes.status}`);
        const text = await apiRes.text();
        console.log(`  --> Res: ${text.substring(0, 150)}`);
      } catch (e) {
        console.log(`  --> Failed ${host}: ${e.message}`);
      }
    }
    
  } catch(e) {
    console.error("Crash:", e.message);
  }
}

run();
