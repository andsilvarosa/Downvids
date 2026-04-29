async function testSnapsave() {
  const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
  try {
     const res = await fetch("https://snapsave.app/action.php?catch=catch", {
        method: "POST",
        headers: {
           "Content-Type": "application/x-www-form-urlencoded",
           "User-Agent": "Mozilla/5.0"
        },
        body: "q=" + encodeURIComponent(url) + "&vt=facebook"
     });
     console.log(res.status);
     console.log(await res.text());
  } catch(e) { console.error(e) }
}
testSnapsave();
