const url = "https://www.instagram.com/p/DXxXaG_ic8P/?igsh=MWVkZWp2MGxuaWUwZg==";

async function testAEMT(url) {
  try {
     const res = await fetch(`https://aemt.me/download/igdl?url=${encodeURIComponent(url)}`);
     const data = await res.json();
     console.log("AEMT IG:", data.status, data.result || "No result");
  } catch(e) {
     console.error("AEMT IG Error", e.message);
  }
}

async function testSkizo(url) {
  try {
     // Needs apikey but maybe some public one?
     // Or "https://api.lolhuman.xyz/api/instagram?apikey=YOUR_API_KEY&url="
  } catch(e) {}
}

async function testBochil(url) {
  try {
     const res = await fetch(`https://api.bochilgaming.com/api/dowloader/igdown?url=${encodeURIComponent(url)}`);
     console.log("Bochil", res.status);
     const data = await res.json();
     console.log(data);
  } catch(e) {}
}

async function testOther(url) {
  try {
    const res = await fetch(`https://api.vreden.web.id/api/instagram?url=${encodeURIComponent(url)}`);
    console.log("Vreden IG 2", res.status);
  }catch(e){}
}

async function test() {
   await testAEMT(url);
   await testBochil(url);
   await testOther(url);
}

test();
