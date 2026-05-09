async function testVreden() {
  const rs = await fetch('https://api.vreden.web.id/api/ig?url=https://www.instagram.com/p/DXxXaG_ic8P/');
  console.log(rs.status);
}
testVreden();
