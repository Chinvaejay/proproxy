const fs = require('fs');
const y = require('js-yaml');

const base = y.load(fs.readFileSync('./config/base.yaml'));
const { rules } = y.load(fs.readFileSync('./config/rules.yaml'));

function getRandom(max = 10, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomArray(count = 10, max = 10, min = 0) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    let r = getRandom(max, min);
    if (arr.includes(r)) {
      i -= 1;
    } else {
      arr.push(r);
    }
  }
  return arr;
}

function pickProxies(allProxies, count = 10) {
  const proxies = [];
  const randomArr = getRandomArray(count, allProxies.length - 1);
  for (const i of randomArr) {
    proxies.push(allProxies[i]);
  }
  return proxies;
}

function groupGenerator(group, proxies) {
  for (let i = 0; i < group['proxy-groups'].length - 2; i++) {
    if (group['proxy-groups'][i].proxies) {
      group['proxy-groups'][i].proxies = [
        ...group['proxy-groups'][i].proxies,
        ...proxies.map(({ name }) => name),
      ];
    } else {
      group['proxy-groups'][i].proxies = [...proxies.map(({ name }) => name)];
    }
  }
}

function configGenerator(count = 10) {
  const { proxies: allProxies } = y.load(
    fs.readFileSync('./config/proxies.yaml')
  );
  const group = y.load(fs.readFileSync('./config/proxy-group.yaml'));

  const proxies = pickProxies(allProxies, count);
  groupGenerator(group, proxies);

  return y.dump({
    ...base,
    proxies,
    ...group,
    rules,
  });
}

module.exports = {
  configGenerator,
};
