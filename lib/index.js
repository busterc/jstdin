'use strict';

const highlight = process.stdout.isTTY ? require('cardinal').highlight : x => x;

/* eslint-disable no-eval */
module.exports = function(data, code, doFormatting) {
  code = eval(code);
  if (typeof code === 'undefined') {
    if (!data) {
      return false;
    }
    code = doFormatting
      ? JSON.stringify(JSON.parse(data), null, 2)
      : JSON.stringify(JSON.parse(data));
  }
  if (typeof code === 'function') {
    code = eval(`(${code})(${data})`);
  }
  code = doFormatting ? prettyPrint(code) : code;
  return code;
};

function prettyPrint(val) {
  val = String(typeof val).match(/^object$|^boolean$|^number$/)
    ? JSON.stringify(val, null, 2)
    : val;
  val = typeof val === 'string' ? highlight(val) : val;
  return val;
}
