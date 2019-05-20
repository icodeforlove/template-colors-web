"use strict";

const StyledString = require('./StyledString');

const patchConsoleLog = require('./patchConsoleLog');

const compileTemplate = require('./compileTemplate');

patchConsoleLog();

function colors(...args) {
  return new StyledString(args);
}

colors.define = compileTemplate.define;
let rgbs = {
  black: [0, 0, 0],
  red: [237, 80, 65],
  green: [102, 172, 92],
  yellow: [225, 178, 60],
  blue: [73, 148, 201],
  magenta: [127, 23, 53],
  cyan: [78, 181, 230],
  white: [255, 255, 255],
  gray: [124, 124, 124],
  grey: [124, 124, 124]
};
Object.keys(rgbs).forEach(key => {
  let rgb = rgbs[key];
  colors.define(`${key}BG`, `rgbBG(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
  colors.define(`${key}`, `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
});
colors.define('underline', 'style("text-decoration: underline")');
colors.define('bold', 'style("font-weight: bold")');
colors.define('italic', 'style("font-style: italic")');
colors.define('strikethrough', 'style("text-decoration: line-through")');
colors.define('dim', 'style("opacity: 0.75")');
colors.define('hidden', 'style("opacity: 0.00")'); //console.log(colors`${'test'}.underline.green.italic.style('font-size: 42px').bold`);

module.exports = colors;