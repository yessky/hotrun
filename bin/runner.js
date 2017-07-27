const fs = require('fs');
const path = require('path');
const Module = require('module');
const hook = require('../lib/hook');
const log = require('../lib/log');

process.on('message', (options) => {
  if (options.action === 'START') {
    options.extensions.forEach(hook);
    process.argv = ['node'].concat(options.args);
    Module.runMain()
  } else if (options.action === 'COMPILE') {
    const ts = Date.now();
    const filename = options.filename;
    const ext = path.parse(filename).ext;
    const module_ = Module._cache[filename];
    const handle = Module._extensions[ext];
    if (module_ && handle) {
      handle(module_, module_.filename);
      log(`recompiled in ${Date.now() - ts} ms`)
    }
  }
})
