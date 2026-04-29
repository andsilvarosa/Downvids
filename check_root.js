async function checkRoot() {
  try {
    const res = await fetch("https://api.vreden.web.id/");
    const html = await res.text();
    console.log(html.substring(0, 1000));
  } catch(e) { console.error(e) }
}
checkRoot();
