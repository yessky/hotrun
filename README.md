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
const chokidar = require('chokidar');
const Module = require('module');
const emitter = require('../')(['.js'], {
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