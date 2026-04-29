const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function testRyzendesu() {
  const apis = [
    `https://api.ryzendesu.vip/api/downloader/tiktok?url=${url}`,
    `https://api.ryzendesu.vip/api/downloader/igdl?url=${url}`, // for IG
    `https://bk9.fun/download/tiktok?url=${url}` // BK9 API (another free one)
  ];
  for (const api of apis) {
    try {
      console.log("Testing:", api);
      const res = await fetch(api);
      const data = await res.text();
      console.log(`[${res.status}] -> ${data.slice(0, 300)}`);
    } catch (e) {
      console.error(api, "failed", e.message);
    }
  }
}

testRyzendesu();
