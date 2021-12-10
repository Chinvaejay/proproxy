const { exec } = require('child_process');

function getProxies(url = 'https://proxy.yugogo.xyz/clash/proxies') {
  return new Promise((resolve, reject) => {
    exec(`curl -o ./config/proxies.yaml ${url}`, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

module.exports = {
  getProxies,
};
