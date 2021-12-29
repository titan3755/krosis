const ping = require("ping");
async function pingTest (targetBaseUrl) {
  const result = await ping.promise.probe(targetBaseUrl, {
    timeout: 10
  });
  return result
}
module.exports = pingTest