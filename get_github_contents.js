async function test() {
  const url = "https://api.github.com/repos/saveweb/cobalt-instances";
  try {
    console.log("Calling GitHub API:", url);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Repo Info:", data);
  } catch(e) {
    console.log("Failed:", e);
  }
}
test();
