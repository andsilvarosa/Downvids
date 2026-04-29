async function testTikwm3() {
  const url = "https://www.tiktok.com/@mrbeast/video/7338573278546562337";
  try {
     const res = await fetch("https://tikwm.com/api/", {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
       },
       body: 'url=' + encodeURIComponent(url) + '&count=12&cursor=0&web=1&hd=1'
     });
     const data = await res.json();
     console.log("tikwm:", data.msg);
     if (data.data) {
        console.log("success!", data.data.play);
     }
  } catch(e) { console.error(e) }
}
testTikwm3();
