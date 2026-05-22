const instances = [
  "https://cobalt.qwyh.dev/",
  "https://api.cobalt.luo.mx/",
  "https://co.pussthecat.org/"
];

async function test() {
  const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";
  for (const api of instances) {
    try {
      console.log("Testing:", api);
      const res = await fetch(api, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url }),
        signal: AbortSignal.timeout(5000)
      });
      console.log(`[${res.status}] ${api}:`, await res.text());
    } catch(e) {
      console.log(`Failed ${api}:`, e.message);
    }
  }
}
test();
