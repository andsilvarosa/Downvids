async function testInstances() {
  const list = await fetch('https://raw.githubusercontent.com/imputnet/cobalt/current/instances.json');
  console.log(list.status);
  const data = await list.json().catch(e=>({}));
  console.log(JSON.stringify(data));
}
testInstances();
