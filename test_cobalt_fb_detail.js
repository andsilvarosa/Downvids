async function test() {
  try {
     const res = await fetch("https://api.cobalt.tools/", {
         method: "POST",
         headers: {
             "Accept": "application/json",
             "Content-Type": "application/json",
         },
         body: JSON.stringify({ url: "https://www.facebook.com/share/r/1GUQtTouj7/" })
     });
     console.log(await res.text());
  } catch(e) {}
}
test();
