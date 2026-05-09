const url = "https://www.facebook.com/share/r/1GUQtTouj7/";

async function testAEMT(url) {
  try {
     const res = await fetch(`https://aemt.me/download/fbdl?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("AEMT FB:", data.status, data.result || "No result");
  } catch(e) {
     console.error("AEMT FB Error", e.message);
  }
}

async function testRyzendesu(url) {
  try {
     const res = await fetch(`https://api.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Ryzendesu FB:", data.status, data);
  } catch(e) {
     console.error("Ryzendesu FB Error", e.message);
  }
}

async function testVreden(url) {
  try {
     const res = await fetch(`https://api.vreden.web.id/api/fbdl?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Vreden FB:", data.status, data.result || data);
  } catch(e) {
     console.error("Vreden FB Error", e.message);
  }
}

async function testItzpire(url) {
  try {
     const res = await fetch(`https://itzpire.site/download/facebook?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Itzpire FB:", data.status, data.data || data);
  } catch(e) {
     console.error("Itzpire FB Error", e.message);
  }
}

async function testDarkYasiya(url) {
  try {
     const res = await fetch(`https://dark-yasiya-api-new.vercel.app/api/fdown?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("Dark Yasiya FB:", data.status, data.result || data);
  } catch(e) {
     console.error("Dark Yasiya FB Error", e.message);
  }
}

async function test() {
   await testAEMT(url);
   await testRyzendesu(url);
   await testVreden(url);
   await testItzpire(url);
   await testDarkYasiya(url);
}

test();
