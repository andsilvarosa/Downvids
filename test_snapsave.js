async function test() {
  try {
    const res = await fetch("https://snapsave.app/action.php?catcher=facebook", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `q=${encodeURIComponent('https://www.facebook.com/share/r/1GUQtTouj7/')}`
    });
    const html = await res.text();
    console.log(res.status, html.substring(0, 100)); // might be packed JS
  } catch(e) {
    console.log(e.message);
  }
} test();
