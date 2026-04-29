import { fetch } from 'undici';
const fbdl = require("fbdl-core");

async function test() {
   const url = "https://www.facebook.com/share/v/18qSkTTRsD/";
   const res = await fetch(url, {redirect:'follow'});
   const expanded = res.url;
   console.log("expanded:", expanded);
   fbdl.getInfo(expanded).then(console.log).catch(console.error);
}
test();
