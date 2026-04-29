async function test() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  try {
     const res = await fetch("https://publer.io/api/v1/tools/download", {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
        body: JSON.stringify({ url })
     });
     console.log(res.status, await res.text());
  } catch(e) { console.error(e) }
}
test();
