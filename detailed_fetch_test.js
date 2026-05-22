async function test() {
  try {
    console.log("Fetching cobalt.chylex.com...");
    await fetch("https://cobalt.chylex.com/");
  } catch(e) {
    console.log("Error on chylex:", e);
    if (e.cause) console.log("Cause on chylex:", e.cause);
  }

  try {
    console.log("Fetching cobalt.my...");
    await fetch("https://cobalt.my/");
  } catch(e) {
    console.log("Error on cobalt.my:", e);
    if (e.cause) console.log("Cause on cobalt.my:", e.cause);
  }
}
test();
