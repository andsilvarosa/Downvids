async function test() {
  try {
    const urls = [
      "https://www.tiktok.com/@mrbeast/video/7338573278546562337",
      "https://vt.tiktok.com/ZSN4V6gNw/"
    ];
    for (const u of urls) {
      console.log("Testing:", u);
      const res = await fetch(`https://www.tikwm.com/api/?url=${u}`);
      const data = await res.json();
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}
test();
