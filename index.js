const express = require('express');
const { configGenerator } = require('./configGenerator');
const { getProxies } = require('./getProxies');

async function run() {
  await getProxies();
  const app = express();
  const port = process.env.PORT || '3003';

  app.get('/', async (req, res) => {
    if (req.query.refresh) {
      try {
        await getProxies();
      } catch (e) {
        res.send(e);
      }
    }
    let count = 20;
    if (req.query.count) {
      count = +req.query.count;
    }
    res.send(configGenerator(count));
  });

  app.listen(port, () => {
    console.log('Server is running!');
  });
}
run();
