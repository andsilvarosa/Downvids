const url = "https://vt.tiktok.com/ZSY2oP8gN/";
async function test() {
  try {
     const res = await fetch(`https://www.tikwm.com/api/?url=${url}`, {
       headers: { 'User-Agent': 'Mozilla/5.0' }
     });
     console.log(await res.json());
  } catch(e) {}
}
test();
