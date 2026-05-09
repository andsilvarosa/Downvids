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
  const target = "https://www.facebook.com/share/r/1GUQtTouj7/";
  
  for(let u of urls) {
      try {
         const res = await fetch(u.includes('api.cobalt.tools') ? u : u + "api/json", {
             method: "POST",
             headers: {
                 "Accept": "application/json",
                 "Content-Type": "application/json",
             },
             body: JSON.stringify({ url: target })
         });
         console.log(u, res.status);
         if(res.ok) console.log(await res.json());
      } catch(e) {
          console.log(u, "failed", e.message);
      }
  }
}
getCobalt();
