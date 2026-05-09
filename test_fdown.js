async function test() {
  try {
    const res = await fetch("https://fdown.net/download.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `URLz=${encodeURIComponent('https://www.facebook.com/share/r/1GUQtTouj7/')}`
    });
    const html = await res.text();
    const hdMatch = html.match(/href="([^"]+)"[^>]*>Download Video in HD/i);
    const sdMatch = html.match(/href="([^"]+)"[^>]*>Download Video in Normal/i);
    console.log(res.status, "HD:", hdMatch?.[1]?.substring(0, 50), "SD:", sdMatch?.[1]?.substring(0, 50));
  } catch(e) {
    console.log(e.message);
  }
} test();
