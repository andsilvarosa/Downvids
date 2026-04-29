const key = "dcfd309309mshd85c1a66a0b10abp115a87jsnc7b9d33ae856";
const host = "social-media-video-downloader.p.rapidapi.com";
const url = "https://www.tiktok.com/@irmasbarbosaoficial/video/7612026684161887509";
async function test() {
  const eps = [];
  const words = ['get', 'video', 'social', 'dl', 'download', 'tiktok', 'smvd'];
  for(let w1 of words) {
    eps.push(`/${w1}`);
    for(let w2 of words) {
      eps.push(`/${w1}/${w2}`);
      for(let w3 of words) {
         eps.push(`/${w1}/${w2}/${w3}`);
      }
    }
  }
  
  const options = { headers: { 'X-RapidAPI-Key':key, 'X-RapidAPI-Host':host } };
  
  // Test a known BAD endpoint to see what it returns
  let bad = await fetch(`https://${host}/bad-endpoint`, options);
  console.log("BAD ENDPOINT:", bad.status, await bad.text());

  // Wait, searching 400 endpoints serially could take 20 seconds.
}
test();
