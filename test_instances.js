const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

const instances = [
  "https://co.wuk.sh/api/json", 
  "https://cobalt.qwyh.dev/api/json",
  "https://dl.vmm.dev/api/json",
  "https://cobalt.luo.mx/api/json",
  "https://co.pussthecat.org/api/json",
  "https://api.cobalt.tools/api/json"
];

async function testCobalt() {
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
          url: url,
          filenameStyle: "pretty"
        })
      });
      const text = await response.text();
      console.log(`[${response.status}] ${api} -> ${text.slice(0, 150)}`);
    } catch (e) {
      console.error(api, "failed", e.message);
    }
  }
}

testCobalt();
