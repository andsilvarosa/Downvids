const url = "https://www.instagram.com/p/DXxXaG_ic8P/?igsh=MWVkZWp2MGxuaWUwZg==";
async function testCobaltV10() {
  try {
     const res = await fetch("https://api.cobalt.tools/", {
        method: "POST",
        headers: {
           "Accept": "application/json",
           "Content-Type": "application/json",
           "Origin": "https://cobalt.tools",
           "Referer": "https://cobalt.tools/",
           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: JSON.stringify({ url: url })
     });
     console.log("Status:", res.status);
     const text = await res.text();
     console.log("Res:", text);
  } catch(e) { console.error(e); }
}
testCobaltV10();
