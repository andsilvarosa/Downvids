const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function fetchFromTikly() {
  try {
     const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${url}`);
     const data = await res.json();
     console.log("Tikly:", data);
  } catch(e) { console.error("Tikly Failed", e) }
}
fetchFromTikly();
