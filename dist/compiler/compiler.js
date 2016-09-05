'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;
exports.compileCode = compileCode;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('./utils');

var _finalize = require('./finalize');

var _finalize2 = _interopRequireDefault(_finalize);

require('./nodes/Program');

require('./nodes/NewLine');

require('./nodes/Comment');

require('./nodes/String');

require('./nodes/Atom');

require('./nodes/Special');

require('./nodes/Identifier');

require('./nodes/Number');

require('./nodes/Lookup');

require('./nodes/Operation');

require('./nodes/Logic');

require('./nodes/Cons');

require('./nodes/Opposite');

require('./nodes/Arr');

require('./nodes/Obj');

require('./nodes/Comp');

require('./nodes/FunctionCall');

require('./nodes/Qualifier');

require('./nodes/Cond');

require('./nodes/Caseof');

require('./nodes/Fun-Polymorph');

require('./nodes/Assignment');

require('./nodes/TryCatch');

require('./nodes/Tuple');

require('./nodes/Import');

require('./nodes/Export');

require('./nodes/Html');

require('./nodes/List');

require('./nodes/Regexp');

require('./nodes/Wrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attempt(fn, callback) {
  try {
    return fn();
  } catch (err) {
    if (callback) {
      callback(err);
    } else {
      throw err;
    }
  }
}

/*
 * Export a function for initializing compilation.
 */
function compile(path, callback, options) {
  return _fs2.default.readFile(path, function (err, result) {
    if (err) {
      if (callback) {
        return callback(err);
      } else {
        throw err;
      }
    } else {
      return compileCode(result.toString(), callback, options);
    }
  });
}

function compileCode(str, callback, options) {
  var tree = attempt(function () {
    return _utils.parser.parse(str);
  }, callback);
  options = options || {};
  //console.log(tree);
  attempt(function () {
    return tree.compile();
  }, callback);
  options.finalize && attempt(function () {
    return (0, _finalize2.default)(tree);
  }, callback);
  options.log && console.log(tree.shared.output);
  return callback ? callback(undefined, tree.shared.output) : tree.shared.output;
}