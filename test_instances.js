async function getInstances() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/imputnet/cobalt/current/instances.json');
    if (res.ok) console.log((await res.text()).substring(0, 500));
  } catch(e) {}
}
getInstances();
