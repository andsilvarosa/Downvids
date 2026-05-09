async function getCobalt() {
  const urls = [
    "https://cobalt.api.unv.is/",
    "https://api.cobalt.tools/",
    "https://co.wuk.sh/",
    "https://cobalt.wuk.sh/",
    "https://api.cobalt.wuk.sh/",
    "https://cobalt.siesens.moe/",
    "https://api.cobalt.siesens.moe/",
    "https://cobalt.kyoko.top/",
  ];
  
  for(let u of urls) {
      try {
         const res = await fetch(u.includes('api.cobalt.tools') ? u : u + "api/json", {
             method: "POST",
             headers: {
                 "Accept": "application/json",
                 "Content-Type": "application/json",
             },
             body: JSON.stringify({
                 url: "https://www.instagram.com/p/DXxXaG_ic8P/?igsh=MWVkZWp2MGxuaWUwZg=="
             })
         });
         console.log(u, res.status);
         if(res.ok) console.log(await res.json());
      } catch(e) {
          console.log(u, "failed", e.message);
      }
  }
}
getCobalt();
