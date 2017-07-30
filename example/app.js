const fs = require('fs');
const path = require('path');
const Koa = require('koa');
// const emitter = require('../')({
//   watch: path.resolve(__dirname, './src')
// });
const middleware = require('./src/middleware');

const app = new Koa();
app.use(middleware);
// emitter.on('hot', () => {
//   console.log('module hot compiled done!')
// });

const server = require('http').createServer(app.callback());
server.listen(3100, (err) => {
  if (err) throw err;
  console.log('app running at port 3100')
})
