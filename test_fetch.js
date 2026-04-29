const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function testV10() {
  try {
    const response = await fetch("https://cobalt.qwyh.dev/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });
    const text = await response.text();
    console.log(response.status, text);
  } catch(e) {
    console.error(e);
  }
}

testV10();
