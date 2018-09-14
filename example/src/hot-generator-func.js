module.exports = function* () {
  console.log('I am generator function');
  yield 'iterator-val-1';
  yield 'iterator-val-2';
};
