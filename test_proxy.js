const target = "https://www.tikwm.com/api/?url=https://www.tiktok.com/@irmasbarbosaoficial/video/7612026684161887509";
async function test() {
  try {
     const proxy1 = `https://corsproxy.io/?url=${encodeURIComponent(target)}`;
     const r1 = await fetch(proxy1);
     console.log('corsproxy.io', r1.status, await r1.text().then(t=>t.substring(0,100)));
     
     const proxy2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
     const r2 = await fetch(proxy2);
     console.log('allorigins', r2.status, await r2.text().then(t=>t.substring(0,100)));
  } catch(e) { console.error(e) }
}
test();
