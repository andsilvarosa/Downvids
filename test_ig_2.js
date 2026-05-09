async function test() {
  const url = encodeURIComponent("https://www.instagram.com/p/DXxXaG_ic8P/?igsh=MWVkZWp2MGxuaWUwZg==");
  try {
     let r1 = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${url}`);
     console.log("siputzx", r1.status);
     console.log(await r1.json());
  }catch(e) {}
  
  try {
     let r2 = await fetch(`https://api.vkrdownloader.vercel.app/server?vkr=${url}`);
     console.log("vkrdownloader", r2.status);
     console.log(await r2.json());
  }catch(e) {}
}
test();
