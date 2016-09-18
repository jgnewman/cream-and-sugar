'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = finalize;

var _SYSTEM = require('./SYSTEM');

var _SYSTEM2 = _interopRequireDefault(_SYSTEM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

function stringify(val) {
  if (Array.isArray(val)) {
    return JSON.stringify(val);
  } else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
    return '{' + Object.keys(val).map(function (key) {
      return key + ': ' + stringify(val[key]);
    }).join(',\n') + '}';
  } else {
    return val.toString();
  }
}

function finalize(tree) {
  var lib = [].concat(_toConsumableArray(tree.shared.lib));
  tree.shared.output = prepend(tree.shared.output, lib.map(function (name) {
    return 'SYSTEM.' + name + ' = SYSTEM.' + name + ' || ' + stringify(_SYSTEM2.default[name]);
  }).join(';\n') + ';\n');
  tree.shared.output = prepend(tree.shared.output, 'var SYSTEM = typeof SYSTEM !== "undefined" ? SYSTEM : {};');
  tree.shared.output = tree.shared.output.replace(/\}\s*\;\s*$/, '}');
  return tree;
}