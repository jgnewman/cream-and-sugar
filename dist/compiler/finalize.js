'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = finalize;

var _SYSTEM = require('./SYSTEM');

var _SYSTEM2 = _interopRequireDefault(_SYSTEM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

function finalize(tree) {
  var lib = [].concat(_toConsumableArray(tree.shared.lib));
  tree.shared.output = prepend(tree.shared.output, lib.map(function (name) {
    return 'SYSTEM.' + name + ' = ' + _SYSTEM2.default[name].toString();
  }).join(';\n'));
  tree.shared.output = prepend(tree.shared.output, 'const SYSTEM = {};');
  return tree;
}