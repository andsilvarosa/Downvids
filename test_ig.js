const url = "https://www.instagram.com/p/DXxXaG_ic8P/?igsh=MWVkZWp2MGxuaWUwZg==";

async function testVreden(url) {
  try {
     const res = await fetch(`https://api.vreden.web.id/api/igdl?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Vreden IG:", data.status, data.result || "No result");
  } catch(e) {
     console.error("Vreden IG Error", e.message);
  }
}

async function testItzpire(url) {
  try {
     const res = await fetch(`https://itzpire.site/download/instagram?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Itzpire IG:", data.status, data.data || "No data");
  } catch(e) {
     console.error("Itzpire IG Error", e.message);
  }
}

async function testRyzendesu(url) {
  try {
     const res = await fetch(`https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Ryzendesu IG:", data.status, data.data || data.url || "No data");
  } catch(e) {
     console.error("Ryzendesu IG Error", e.message);
  }
}

async function testDarkYasiya(url) {
  try {
     const res = await fetch(`https://dark-yasiya-api-new.vercel.app/api/igdown?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Dark Yasiya IG:", data.status, data.result || "No data");
  } catch(e) {
     console.error("Dark Yasiya IG Error", e.message);
  }
}

async function test() {
   await testVreden(url);
   await testItzpire(url);
   await testRyzendesu(url);
   await testDarkYasiya(url);
}

test();
