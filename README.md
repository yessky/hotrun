# node-module-hot
using `node-module-hot`, we don't need to restart node process while modifying any codes. it's useful for speed-up development.

#### NOTICE: do not use it in production mode.

## Description
with `node-module-hot`:

we don't need `nodemon`/`pm2`/`supervisor` any more

no special codes to inject into your codes

simply configuration

## Install
`npm install --save-dev node-module-hot`

## Example
a working example see `./example`.

import `node-module-hot` and configure it in your development server entry, like `./example/app.js`
```JavaScript
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const emitter = require('node-module-hot')({
  extensions: ['.js'],
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

## Usage
```JavaScript
const emitter = require('../')({
  extensions: ['.js'],
  verbose: true,
  context: path.resolve(__dirname, './src')
});
```
#### options.extensions
specified which extension files to be hot compiling

#### options.verbose
used for listing debug info

#### options.context
specified which source modules in folder should be hot compiling.

## Credit
[aaron.xiao](http://veryos.com)