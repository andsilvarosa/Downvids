const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function fetchFromRyzendesu() {
  try {
     const res = await fetch(`https://api.ryzendesu.vip/api/downloader/tiktok?url=${url}`, {
       headers: {
         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
       }
     });
     const data = await res.json();
     console.log("Ryzendesu:", data);
  } catch(e) { console.error("Ryzendesu Failed") }
}

async function fetchFromBochilGaming() {
  try {
    const res = await fetch(`https://api.bochilteam.workers.dev/download/tiktok?url=${url}`);
    const data = await res.json();
    console.log("Bochil:", data);
  } catch(e) { console.error("Bochil Failed") }
}

fetchFromRyzendesu();
fetchFromBochilGaming();
