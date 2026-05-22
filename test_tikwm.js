async function test() {
  const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";
  try {
    const tikwmUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    console.log("Calling tikwm:", tikwmUrl);
    const res = await fetch(tikwmUrl);
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", JSON.stringify(data).substring(0, 500));
  } catch(e) {
    console.log("Failed:", e.message);
  }
}
test();
