const url = "https://www.tiktok.com/@irmasbarbosaoficial/video/7612026684161887509";
async function test() {
  const instances = ['https://cobalt.ziyia.com', 'https://cobalt.kwiatektv.com', 'https://api.cobalt.lol', 'https://cobalt.catgirl.party'];
  for (const apiUrl of instances) {
     try {
        const v7 = await fetch(apiUrl + '/api/json', {
           method: 'POST',
           headers: {'Accept': 'application/json','Content-Type': 'application/json'},
           body: JSON.stringify({url: url, vQuality: "720", filenameStyle: "pretty"})
        });
        console.log(apiUrl + " v7:", v7.status, await v7.text().then(t=>t.substring(0,50)));
        
        const v10 = await fetch(apiUrl + '/', {
           method: 'POST',
           headers: {'Accept': 'application/json','Content-Type': 'application/json'},
           body: JSON.stringify({url: url})
        });
        console.log(apiUrl + " v10:", v10.status, await v10.text().then(t=>t.substring(0,50)));
     } catch(e) { console.error(apiUrl, e) }
  }
}
test();
