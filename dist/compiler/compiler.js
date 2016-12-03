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

require('./nodes/Functionizer');

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

require('./nodes/Binder');

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

require('./nodes/BackCons');

require('./nodes/Pipe');

require('./nodes/Chain');

require('./nodes/ObjCons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Export a function for initializing compilation.
 */
function compile(path, callback, options) {
  // Read in a file.
  return _fs2.default.readFile(path, function (err, result) {
    // Throw an error if we have one.
    if (err) {
      if (callback) {
        return callback(err);
      } else {
        throw err;
      }
      // If not, convert the result to a string and call compileCode with it.
    } else {
      return compileCode(result.toString(), callback, options);
    }
  });
}

function compileCode(str, callback, options) {
  var tree = void 0;
  options = options || {};

  // Make sure we always have a trailing newline
  str = /\n$/.test(str) ? str : str + '\n';

  // Parse the tree.
  try {
    tree = _utils.parser.parse(str);
  } catch (err1) {
    if (callback) {
      return callback(err1);
    } else {
      throw err1;
    }
  }

  // Compile the tree
  try {
    tree.compile();
  } catch (err2) {
    if (callback) {
      return callback(err2);
    } else {
      throw err2;
    }
  }

  // Get rid of some extraneous semis
  tree.shared.output = tree.shared.output.replace(/(\;)(\s+\;)+/g, '$1');

  // Finalize the code
  if (options.finalize) {
    try {
      (0, _finalize2.default)(tree);
    } catch (err3) {
      if (callback) {
        return callback(err3);
      } else {
        throw err3;
      }
    }
  }

  // Log output if necessary
  options.log && console.log(tree.shared.output);

  // Return a call to the callback if it exists or the code if not
  return callback ? callback(undefined, tree.shared.output) : tree.shared.output;
}