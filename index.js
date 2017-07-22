/*
  module:
    node-module-hot
  author:
    aaron.xiao<admin@veryos.com>
  summary:
    used to speed up develpment, while modify any node codes, you don't restart your process
*/

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const Module = require('module');
const chokidar = require('chokidar');
const toString = Object.prototype.toString;

function ctorof(obj) {
  return toString.call(obj).match(/\[object\s+(\w+)\]/)[1]
}

function registerExtension(ext = '.js', opts = {}) {
  const extesionHandler = Module._extensions[ext];
  Module._extensions[ext] = function (module, filename) {
    // call default handler
    extesionHandler(module, filename);
    // skip native modules
    if (module.id.indexOf('node_modules') > -1) return
    // create hot wrapper for exports
    let hotExports = module.__hotExports;
    let newExports = module.exports;
    let type = typeof newExports;
    let ctor = ctorof(newExports);
    if (!hotExports) {
      if (type === 'string') {
        hotExports = new String('');
        hotExports.valueOf = hotExports.toString = () => String(module.__hotRef)
      } else if (type === 'number') {
        hotExports = new Number(0);
        hotExports.valueOf = hotExports.toString = () => Number(module.__hotRef)
      } else if (type === 'boolean') {
        hotExports = new Boolean(false);
        hotExports.valueOf = hotExports.toString = () => Boolean(module.__hotRef)
      } else if (type === 'function') {
        if (ctor === 'AsyncFunction') {
          hotExports = async (...args) => {
            return await module.__hotRef.apply(module.exports, args)
          }
        } else {
          hotExports = (...args) => {
            return module.__hotRef.apply(module.exports, args)
          }
        }
      } else if (ctor === 'Array' || ctor === 'Object') {
        hotExports = newExports
      }
      if (hotExports) {
        module.__hotExports = hotExports
      }
    }
    // hot update wrapped exports
    if (hotExports) {
      if (ctor === 'Array') {
        let len1 = hotExports.length;
        let len2 = newExports.length;
        if (len1 > len2) {
          hotExports.splice(len2 - 1, len1 - len2)
        }
        Object.assign(hotExports, newExports)
      } if (ctor === 'Object') {
        for (let i in hotExports) {
          if (!newExports.hasOwnProperty(i)) {
            delete hotExports[i]
          }
        }
        Object.assign(hotExports, newExports)
      } else {
        module.__hotRef = newExports
      }
      module.exports = hotExports
    }
  }
}

module.exports = (opts = {}) => {
  const extensions = Array.isArray(opts.extensions) ? opts.extensions : ['.js'];
  extensions.forEach(ext => registerExtension(ext, opts));
  const emitter = new EventEmitter();
  const context = opts.context || process.cwd();
  const watcher = chokidar.watch([context]);
  watcher.on('ready', () => {
    watcher.on('all', (evt, filename) => {
      let ext = path.parse(filename).ext;
      if (filename.indexOf('node_modules') > -1 || extensions.indexOf(ext) < 0) {
        return
      }
      let startTime = Date.now();
      let mod = Module._cache[filename];
      let handler = Module._extensions[ext];
      if (mod && handler) {
        handler(mod, mod.filename);
        console.log(`[HOT] compiled in ${Date.now() - startTime} ms`)
      }
      emitter.emit('hot')
    })
  });
  return emitter
}
