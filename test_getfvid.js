async function test() {
  try {
    const res = await fetch("https://www.getfvid.com/downloader", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `url=${encodeURIComponent('https://www.facebook.com/share/r/1GUQtTouj7/')}`
    });
    const html = await res.text();
    const hdMatch = html.match(/href="([^"]+)"[^>]*>Download in HD/);
    const sdMatch = html.match(/href="([^"]+)"[^>]*>Download in Normal/);
    console.log(res.status, "HD:", hdMatch?.[1], "SD:", sdMatch?.[1]);
  } catch(e) {
    console.log(e.message);
  }
} test();
