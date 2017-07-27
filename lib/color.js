/*
  author:
    aaron.xiao<admin@veryos.com>
  summary:
    console log color
*/

function color(c, str) {
  return (color[c] || color.black) + str + color.black;
}

color.red = '\x1B[31m';
color.yellow = '\x1B[33m';
color.green = '\x1B[32m';
color.black = '\x1B[39m';

module.exports = color