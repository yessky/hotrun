# node-module-hot
node-module-hot gives you the power that modify your node modules without restarting node process. it's useful for developing node server-side.

#### NOTICE: do not use it in production mode.

## Description
with `node-module-hot`:

you almost do not need modules like `nodemon`/`pm2`/`supervisor` to restart you node process while module were modified.

you do not need to put one bit special code in your moddules which want to be hot compiled.

you start developing with almost zero config for this module.

## Install
`npm install --save-dev node-module-hot`

## Example
a working example see `./example`.

import `node-module-hot` and configure it in your development server entry, like `./example/app.js`
```JavaScript
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const emitter = require('node-module-hot')(['.js'], {
  context: path.resolve(__dirname, './src')
});
const middleware = require('./src/middleware');

const app = new Koa();
app.use(middleware);
emitter.on('hot', () => {
  console.log('module hot compiled done!')
});

const server = require('http').createServer(app.callback());
server.listen(3100, (err) => {
  if (err) throw err;
  console.log('app running at port 3100')
})
```
see `./example/src/middleware.js`
```JavaScript
const hotString = require('./hot-string');
const hotNumber = require('./hot-number');
const hotBoolean = require('./hot-boolean');
const hotFunc = require('./hot-func');
const hotAsyncFunc = require('./hot-async-func');
const hotArray = require('./hot-array');
const hotObject = require('./hot-object');

module.exports = async (ctx, next) => {
  hotFunc();
  await hotAsyncFunc();
  ctx.type = 'html';
  ctx.body = `
    node-module-hot tasting:<br>
    hot-string: ${hotString}<br>
    hot-number: ${hotNumber}<br>
    hot-boolean: ${hotBoolean}<br>
    hot-array: ${hotArray}<br>
    hot-object: ${Object.keys(hotObject)}
  `
}
```
see `./example/src/hot-string.js`
```JavaScript
module.exports = 'hot-string';
```
see `./example/src/hot-boolean.js`
```JavaScript
module.exports = true;
```
see `./example/src/hot-number.js`
```JavaScript
module.exports = 'hot-number';
```
so, If you reach here, I guess you alreay understand its power, just try with the working example `./exmaple`, run `cd ./example && node app.js`, then do some changes in `src` folder, then reload your browser, and finally you see the changes.

## Usage
```JavaScript
const emitter = require('../')(['.js'], {
  verbose: true,
  context: path.resolve(__dirname, './src')
});
```

#### options.verbose
used for listing debug info

#### options.context
specified which source modules in folder should be hot compiling.

## Credit
[aaron.xiao](http://veryos.com)