const hotString = require('./hot-string');
const hotNumber = require('./hot-number');
const hotBoolean = require('./hot-boolean');
const hotFunc = require('./hot-func');
const hotAsyncFunc = require('./hot-async-func');
const hotGeneratorFunc = require('./hot-generator-func');
const hotArray = require('./hot-array');
const hotObject = require('./hot-object');

module.exports = async (ctx) => {
  hotFunc();
  await hotAsyncFunc();
  const obj = new hotFunc();
  const gen = hotGeneratorFunc();
  console.log('ctor:', JSON.stringify(obj));
  while (true) {
    const ret = gen.next();
    if (ret.done) break;
    console.log('iterator:', ret.value);
  }
  ctx.type = 'html';
  ctx.body = `
    hotrun tasting:<br>
    hot-string: ${hotString }<br>
    hot-number: ${hotNumber }<br>
    hot-boolean: ${hotBoolean }<br>
    hot-array: ${hotArray }<br>
    hot-object: ${Object.keys(hotObject) }
  `
}