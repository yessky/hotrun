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
      } else if (ctor === 'Array' || ctor === 'Function') {
        hotExports = newExports
      }
      if (hotExports) {
        module.__hotExports = hotExports;
        if (opts.verbose) {
          console.log(`[HOT] created hot wrapper for ${module.id}`)
        }
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
          if (!newExports.hasOwnPropety(i)) {
            delete hotExports[i]
          }
        }
        Object.assign(hotExports, newExports)
      } else {
        module.__hotRef = newExports
      }
      module.exports = hotExports;
      if (opts.verbose) {
        console.log(`[HOT] hot update applied for wrapped ${module.id}`)
      }
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
    watcher.on('all', () => {
      let startTime = Date.now();
      Object.keys(Module._cache).forEach((mid) => {
        if (mid.indexOf('node_modules') < 0 && (!context || mid.indexOf(context) > -1)) {
          let mod = Module._cache[mid];
          let ext = path.parse(mod.filename).ext;
          let handler = Module._extensions[ext];
          handler && handler(mod, mod.filename)
        }
      });
      if (opts.verbose) {
        console.log(`[HOT] hot compiled in ${Date.now() - startTime} ms`)
      }
      emitter.emit('hot')
    })
  });
  return emitter
}
