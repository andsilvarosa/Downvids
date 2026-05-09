async function getCobalts() {
  const rs = await fetch('https://raw.githubusercontent.com/cobalt-org/instances/master/instances.json');
  if(rs.ok) {
     const data = await rs.json();
     console.log(data.map(d => d.api));
  } else {
     console.log(rs.status);
  }
}
getCobalts();
