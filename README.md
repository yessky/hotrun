# hotrun
hot module compiled for node.js, no need to restart server. it's useful to speed-up node.js development

#### NOTICE: do not use it in production mode.

## Description

- we don't need `nodemon`/`pm2`/`supervisor` any more

- no special codes to inject into your codes

- simply configuration

## Install
local
`npm install --save-dev hotrun`

global
`npm install -g hotrun`

## CLI Example

`hotrun app.js -i -b -w src -x src/excule.js -f src/server.js`

## API Example
a working example see `./example`.

import `hotrun` and configure it in your development server entry, like `./example/app.js`
```JavaScript
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const emitter = require('hotrun')({
  extensions: ['.js'],
  watch: path.resolve(__dirname, './src')
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

## CLI Options
```
-i, --inspect [port]             Enable inspect mode on port
-b, --debug-brk                  Enable inspect break mode
-c, --config                     Specify a json config file
-e, --extensions [extensions]    List of extensions to hook into [.es6,.js,.es,.jsx]
-w, --watch [dir]                Watch directory "dir" or files, to hot compile
-f, --force [dir]                Force restart if directory "dir" or files changed
-x, --exclude [dir]              Exclude matching directory/files from watcher
-p, --use-polling                In some filesystems watch events may not work correcly. This option enables "polling" which should mitigate this type of issues
-V, --version                    output the version number
-h, --help                       output usage information
```

## API Options
```JavaScript
const emitter = require('hotrun')({
  extensions: ['.js'],
  usePolling: true,
  watch: path.resolve(__dirname, './src'),
  exclude: 'path/to/exclue.js'
});
```
#### options.extensions
specify which extension files to be hot compiling

#### options.watch
specify which source modules in folder should be hot compiling

#### options.exclude
specify which files should not be hot compiling

#### options.context
deprecated, use options.watch instead

#### options.usePolling
In some filesystems watch events may not work correcly. This option enables "polling" which should mitigate this type of issues

## Credit
[aaron.xiao](http://veryos.com)
