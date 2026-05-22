async function test() {
  const urls = [
    "https://raw.githubusercontent.com/cobalt-org/instances/main/instances.json",
    "https://raw.githubusercontent.com/cobalt-org/instances/master/instances.json"
  ];
  for (const url of urls) {
    try {
      console.log("Fetching:", url);
      const res = await fetch(url);
      console.log("  --> Status:", res.status);
      const text = await res.text();
      console.log("  --> Body Snippet:", text.substring(0, 300));
    } catch(e) {
      console.log("  --> Failed:", e.message);
    }
  }
}

test();
