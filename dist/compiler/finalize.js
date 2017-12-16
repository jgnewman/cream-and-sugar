'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = finalize;

var _cnsLib = require('cns-lib');

var _cnsLib2 = _interopRequireDefault(_cnsLib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

function finalize(tree) {
  tree.shared.output = prepend(tree.shared.output, '//**END LIBRARY**//');
  tree.shared.output = prepend(tree.shared.output, 'var CNS_ = require("cns-lib");\n');
  tree.shared.output = tree.shared.output.replace(/(\}|\n)\s*\;\s*$/, '$1');
  return tree;
}