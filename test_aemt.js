const url = "https://www.tiktok.com/@irmasbarbosaoficial/video/7612026684161887509";
async function test() {
  try {
     const altRes = await fetch(`https://aemt.me/download/tiktok?url=${Math.random()}`); // test if it exists
     console.log(altRes.status);
  } catch(e) { console.error(e) }
}
test();
