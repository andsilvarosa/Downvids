const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";

async function testCobalt() {
  console.log("Testing Cobalt API...");
  try {
    const response = await fetch("https://api.cobalt.tools/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url
      })
    });
    const data = await response.text();
    console.log("Cobalt Response:", response.status, data);
  } catch (error) {
    console.error("Cobalt Error:", error);
  }
}

async function testRapidAPI() {
  console.log("Testing RapidAPI...");
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    console.log("No RapidAPI credentials available, skipping.");
    return;
  }

  const endpoints = ['/main', '/all', '/json'];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`https://${RAPIDAPI_HOST}${endpoint}?url=${encodeURIComponent(url)}`, {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      });
      const data = await res.text();
      console.log(`RapidAPI ${endpoint} Response:`, res.status, data.slice(0, 500));
    } catch (e) {
      console.error(`RapidAPI ${endpoint} Error:`, e);
    }
  }
}

testCobalt();
testRapidAPI();
