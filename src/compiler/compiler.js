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
  const tree = attempt(() => parser.parse(str), callback);
  options = options || {};
  //console.log(tree);
  attempt(() => tree.compile(), callback);
  options.finalize && attempt(() => finalize(tree), callback);
  options.log && console.log(tree.shared.output);
  return callback ? callback(undefined, tree.shared.output) : tree.shared.output;
}
