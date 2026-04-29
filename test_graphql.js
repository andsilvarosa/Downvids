async function getApi() {
   const res = await fetch("https://rapidapi.com/graphql", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "x-rapidapi-key": "", // we don't necessarily need it for graphql maybe?
     },
     body: JSON.stringify({
       query: `query {
          api(name: "social-media-video-downloader") {
            endpoints {
              name
              route
            }
          }
       }`
     })
   });
   console.log(await res.text());
}
getApi();
