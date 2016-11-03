'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = finalize;

var _cnsLib = require('cns-lib');

var _cnsLib2 = _interopRequireDefault(_cnsLib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  // const lib = [...tree.shared.lib];
  // const libPieces = [];
  // lib.forEach(name => {
  //   libPieces.push(`CNS_.${name} = CNS_.${name} || ${stringify(CNS_[name])}`);
  // });
  // tree.shared.output = prepend(tree.shared.output, libPieces.length ? libPieces.join(';\n') + ';\n' : '\n');
  tree.shared.output = prepend(tree.shared.output, '//**END LIBRARY**//');
  tree.shared.output = prepend(tree.shared.output, 'var CNS_ = require("cns-lib");\n');
  tree.shared.output = tree.shared.output.replace(/(\}|\n)\s*\;\s*$/, '$1');
  return tree;
}