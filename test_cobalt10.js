const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

const instances = [
  "https://co.wuk.sh/", 
  "https://cobalt.qwyh.dev/",
  "https://api.cobalt.tools/",
  "https://api.cobalt.luo.mx/",
  "https://co.pussthecat.org/"
];

async function testCobaltv10() {
  for (const api of instances) {
    console.log("Testing:", api);
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url
        })
      });
      const text = await response.text();
      console.log(`[${response.status}] ${api} -> ${text.slice(0, 150)}`);
    } catch (e) {
      console.error(api, "failed", e.message);
    }
  }
}

testCobaltv10();
