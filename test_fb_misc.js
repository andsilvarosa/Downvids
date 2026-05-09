async function test() {
  const url = encodeURIComponent("https://www.facebook.com/share/r/1GUQtTouj7/");
  const eps = [
      `https://api.akuari.my.id/downloader/fbdl?link=${url}`,
      `https://api.akuari.my.id/downloader/facebook?link=${url}`,
      `https://vihangayt.me/download/facebook?url=${url}`
  ];
  for (let u of eps) {
      try {
         const res = await fetch(u);
         console.log(u.split('/')[2], res.status);
      } catch(e) {}
  }
}
test();
