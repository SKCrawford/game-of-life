import * as express from 'express';

async function main() {
  const app = express.default();
  const port = 8000;

  app.use('/', (req, res, next) => {
    res.send('hello, world!')
  });

  app.listen(port, () => console.log(`Open on port ${port}`));
}

main();
