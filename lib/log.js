/*
  author:
    aaron.xiao<admin@veryos.com>
  summary:
    pretty log
*/

const color = require('./color');
const pkg = require('../package.json');

const name = pkg.name.toUpperCase();
const map = {
  '1': 'green',
  '2': 'yellow',
  '3': 'red'
};

function log(str, type = 1) {
  return console.log(color(map[type], `[${name}] ${str}`))
}

module.exports = log