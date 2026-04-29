async function fetchList() {
  const rs = await fetch('https://raw.githubusercontent.com/imputnet/cobalt/instances/instances.json'); // check for other branch? Wait, the repo is now called cobalt-tools/cobalt ??
  console.log(rs.status);
}
fetchList();
