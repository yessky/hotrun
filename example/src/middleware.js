const hotString = require('./hot-string');
const hotNumber = require('./hot-number');
const hotBoolean = require('./hot-boolean');
const hotFunc = require('./hot-func');
const hotAsyncFunc = require('./hot-async-func');
const hotArray = require('./hot-array');
const hotObject = require('./hot-object');

module.exports = async (ctx) => {
  hotFunc();
  await hotAsyncFunc();
  ctx.type = 'html';
  ctx.body = `
    hotrun tasting:<br>
    hot-string: ${hotString}<br>
    hot-number: ${hotNumber}<br>
    hot-boolean: ${hotBoolean}<br>
    hot-array: ${hotArray}<br>
    hot-object: ${Object.keys(hotObject)}
  `
}