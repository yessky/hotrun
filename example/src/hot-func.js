const ctx = this;
module.exports = function() {
  if (ctx !== this) {
    console.log('hot-ctor');
    this.name = 'HotCtor'
  } else {
    console.log('hot-func');
    return 'hot-func-result'
  }
};