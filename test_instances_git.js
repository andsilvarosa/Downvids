async function test() {
  const url = "https://raw.githubusercontent.com/imputnet/cobalt/instances/instances.json";
  try {
    console.log("Fetching instances from:", url);
    const res = await fetch(url);
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("BodySnippet:", text.substring(0, 1000));
  } catch(e) {
    console.log("Failed:", e.message);
  }
}

test();
