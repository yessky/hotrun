/*
  author:
    aaron.xiao<admin@veryos.com>
  summary:
    hotrun is a node app runner that lets you hot-compile or reload the app on source file changes
*/

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const Module = require('module');
const chokidar = require('chokidar');
const hook = require('./lib/hook');
const log = require('./lib/log');

const cwd = process.cwd();

module.exports = (opts = {}) => {
  const extensions = Array.isArray(opts.extensions) ? opts.extensions : [ '.js' ];
  const excludes = [ path.join(cwd, 'node_modules') ].concat(opts.exclude);

  extensions.forEach(hook);

  const emitter = new EventEmitter();
  const context = opts.watch || opts.context || cwd;
  const watcher = chokidar.watch(context, {
    persistent: true,
    ignored: excludes,
    ignoreInitial: true,
    usePolling: opts.usePolling
  });
  process.on('SIGINT', () => {
    watcher.close();
    process.exit(0)
  });
  watcher.on('ready', () => {
    watcher.on('all', (evt, filename) => {
      const ts = Date.now();
      const ext = path.parse(filename).ext;
      const module_ = Module._cache[ filename ];
      const handle = Module._extensions[ ext ];
      if (module_ && handle) {
        handle(module_, module_.filename);
        log(`recompiled in ${Date.now() - ts} ms`);
        emitter.emit('hot')
      }
    })
  });

  return emitter
}
