import dns from "dns";

const domains = [
  "api.ryzendesu.vip",
  "api.vreden.my.id",
  "delirius-api-oficial.vercel.app",
  "itzpire.site"
];

for (const domain of domains) {
  dns.resolve(domain, (err, addresses) => {
    if (err) {
      console.log(`DNS ${domain}: FAILED - ${err.code}`);
    } else {
      console.log(`DNS ${domain}: SUCCESS - ${addresses.join(', ')}`);
    }
  });
}
