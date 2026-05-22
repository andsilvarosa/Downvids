async function test() {
  const url = "https://raw.githubusercontent.com/simon04/cobalt-instances/gh-pages/index.json";
  try {
    console.log("Calling:", url);
    const res = await fetch(url);
    console.log("Status:", res.status);
    if (res.ok) {
      const text = await res.text();
      console.log("Body Snippet:", text.substring(0, 3000));
    }
  } catch(e) {
    console.log("Failed:", e);
  }
}
test();
