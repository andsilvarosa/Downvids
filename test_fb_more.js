async function test() {
  const url = encodeURIComponent("https://www.facebook.com/share/r/1GUQtTouj7/");
  
  const eps = [
    `https://api.siputzx.my.id/api/d/facebook?url=${url}`,
    `https://api.bk9.site/downloader/facebook?url=${url}`,
    `https://api.aguzfamilia.com/api/downloader/facebook?url=${url}`,
    `https://api.vkrdownloader.vercel.app/server?vkr=${url}`,
    `https://aemt.me/download/fbdl?url=${url}`
  ];

  for (let u of eps) {
      try {
          let res = await fetch(u);
          console.log(u.split('/')[2], res.status);
          if (res.ok) {
              console.log(JSON.stringify(await res.json()).substring(0, 150));
          } else {
              console.log(await res.text());
          }
      } catch (e) {
          console.log(u.split('/')[2], e.message);
      }
  }
}
test();
