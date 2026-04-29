const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function testTikwm() {
  try {
    const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    console.log("Tikwm:", data.data?.play || data);
  } catch (e) {
    console.error(e);
  }
}

testTikwm();
