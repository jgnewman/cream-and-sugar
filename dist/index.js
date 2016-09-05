'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compiler = require('./compiler/compiler');

Object.defineProperty(exports, 'compile', {
  enumerable: true,
  get: function get() {
    return _compiler.compile;
  }
});
Object.defineProperty(exports, 'compileCode', {
  enumerable: true,
  get: function get() {
    return _compiler.compileCode;
  }
});