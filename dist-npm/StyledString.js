"use strict";

class StyledString {
  constructor(templateArgs) {
    this.styles = [];
    this.templateArgs = templateArgs;
  }

  toString() {
    const compileTemplate = require('./compileTemplate');

    return compileTemplate(this.styles, ...this.templateArgs);
  }

  rgb(r, g, b) {
    this.styles.push(`rgb(${r},${g},${b})`);
    return this;
  }

  rgbBG(r, g, b) {
    this.styles.push(`rgbBG(${r},${g},${b})`);
    return this;
  }

  style(style) {
    this.styles.push(`style('${style}')`);
    return this;
  }

}

module.exports = StyledString;