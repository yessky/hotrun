/*
  author:
    aaron.xiao - <admin@veryos.com>
  summary:
    replace default extension hook
*/

const Module = require('module');
const toString = Object.prototype.toString;
const defaultHanlder = Module._extensions[ '.js' ];
let handledExtensions = {};

function ctorof(obj) {
  return toString.call(obj).match(/\[object\s+(\w+)\]/)[ 1 ]
}

function hook(ext) {
  if (handledExtensions[ ext ]) return
  let extensionHandler = Module._extensions[ ext ];
  if (!extensionHandler) {
    extensionHandler = defaultHanlder
  }
  handledExtensions[ ext ] = true;
  Module._extensions[ ext ] = (module, filename) => {
    // call default handler
    extensionHandler(module, filename);
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
            delete hotExports[ i ]
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

module.exports = hook
