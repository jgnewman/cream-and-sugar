import fs from 'fs';
import { parser } from './utils';
import finalize from './finalize';
import './nodes/Program';
import './nodes/NewLine';
import './nodes/Comment';
import './nodes/String';
import './nodes/Atom';
import './nodes/Special';
import './nodes/Identifier';
import './nodes/Number';
import './nodes/Lookup';
import './nodes/Operation';
import './nodes/Logic';
import './nodes/Cons';
import './nodes/Opposite';
import './nodes/Arr';
import './nodes/Obj';
import './nodes/Comp';
import './nodes/FunctionCall';
import './nodes/Qualifier';
import './nodes/Cond';
import './nodes/Caseof';
import './nodes/Fun-Polymorph';
import './nodes/Assignment';
import './nodes/TryCatch';
import './nodes/Tuple';
import './nodes/Import';
import './nodes/Export';
import './nodes/Html';
import './nodes/List';
import './nodes/Regexp';
import './nodes/Wrap';
import './nodes/BackCons';
import './nodes/Pipe';

/*
 * Export a function for initializing compilation.
 */
export function compile(path, callback, options) {
  return fs.readFile(path, function (err, result) {
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

export function compileCode(str, callback, options) {
  let tree;
  options = options || {};

  // Parse the tree.
  try {
    tree = parser.parse(str);
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
      finalize(tree);
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
