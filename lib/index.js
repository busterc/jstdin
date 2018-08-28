'use strict';

/* istanbul ignore next */
const highlight = process.stdout.isTTY ? require('cardinal').highlight : x => x;

/* eslint-disable no-eval */
module.exports = function(data, code, doFormatting = false) {
  try {
    code = eval(code);
  } catch (error) {
    code = jsonToggle(code);
  }

  if (typeof code === 'undefined' && !data) {
    return;
  }

  if (data && typeof code === 'undefined') {
    data = jsonToggle(data);
    return doFormatting ? prettyPrint(data) : jsonStringify(data);
  }

  if (typeof code === 'function' && data) {
    data = jsonStringify(data);
    data = eval(`(${code})(${data})`);
    return doFormatting ? prettyPrint(data) : jsonStringify(data);
  }

  if (typeof code === 'function' && !data) {
    data = eval(`(${code})()`);
    if (typeof data === 'undefined') {
      return;
    }
    return doFormatting ? prettyPrint(data) : jsonStringify(data);
  }

  return doFormatting ? prettyPrint(code) : code;
};

function prettyPrint(val) {
  val = String(typeof val).match(/^object$|^boolean$|^number$/)
    ? JSON.stringify(val, null, 2)
    : val;
  return highlight(val);
}

function jsonStringify(val, ...args) {
  try {
    return JSON.stringify(JSON.parse(val), ...args);
  } catch (error) {
    return JSON.stringify(val);
  }
}

function jsonToggle(val) {
  try {
    return JSON.parse(val);
  } catch (error) {
    return JSON.stringify(val);
  }
}
