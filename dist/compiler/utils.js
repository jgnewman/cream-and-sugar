'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReservedWords = exports.getExposedFns = exports.compileBody = exports.compile = exports.die = exports.nodes = exports.parser = undefined;

var _parser = require('../parser/parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodes = _parser2.default.parser.nodes;

/**
 * Create an error, log a problem, and die.
 *
 * @param  {Node}   node     Any compilable node.
 * @param  {String} problem  Optional. A problem to log to the console.
 *
 * @return {undefined}
 */
function die(node, problem) {
  console.log('\nERROR compiling ' + node.type + ' node between ' + node.loc.start.line + ':' + node.loc.start.column + ' and ' + node.loc.end.line + ':' + node.loc.end.column + '.\n');
  problem && console.log('Problem: ' + problem + '\n');
  console.log(new Error().stack);
  process.exit(1);
}

/**
 * Attach a compile function to a node's prototype.
 *
 * @param  {Class}    node  A parser node.
 * @param  {Function} fn    The compile function.
 *
 * @return {undefined}
 */
function compile(node, fn) {
  node.prototype.compile = function (noAdd) {
    try {
      var out = fn.bind(this)();
      // By default, add our compiled node to the output
      // unless noAdd is set to true. Then don't.
      if (!noAdd) {
        this.shared.output += out;
      }
      return out;
    } catch (err) {
      console.log('\nERROR compiling ' + this.type + ' node between ' + this.loc.start.line + ':' + this.loc.start.column + ' and ' + this.loc.end.line + ':' + this.loc.end.column + '.\n');
      console.log(err.stack);
      process.exit(1);
    }
  };
}

/**
 * Removes NewLine nodes from a list of compilable nodes.
 *
 * @param  {Array} body  A list of compilable nodes.
 *
 * @return {Array}
 */
function removeNewlines(body) {
  return body.filter(function (item) {
    return item.type !== 'NewLine';
  });
}

/**
 * Runs through a series of compilable nodes, compiles them all,
 * and returns the last one.
 *
 * @param  {Array}  body   A list of compilable nodes.
 * @param  {String} delim  A delimiter to use. Defaults to ';'
 *
 * @return {String}      The compiled string.
 */
function compileBody(body, delim) {
  var end = delim || ';';
  var cleanBody = removeNewlines(body);
  return cleanBody.map(function (item, index) {
    var prefix = index === cleanBody.length - 1 && !delim ? 'return ' : '';
    if (!item.compile) {
      throw new Error('Item type ' + item.type + ' has no compile method.');
    }
    return prefix + item.compile(true);
  }).join(end + '\n') + (delim === ';' ? ';' : '');
}

// Official list of exposed system functions
function getExposedFns() {
  return ['elem', 'throw', 'create', 'typeof', 'instanceof', 'head', 'tail', 'random', 'lead', 'last', 'update', 'remove', 'eql', 'do'];
}

// Official list of reserved words
function getReservedWords() {
  return ['fn', 'caseof', 'def', 'match', 'end', 'if', 'no', 'cond', 'for', 'in', 'when', 'var', 'const', 'let', 'while', 'switch', 'function', 'with', 'else', 'instanceof', 'super', 'enum', 'break', 'extends', 'catch', 'new', 'class', 'try', 'continue', 'typeof', 'delete', 'return', 'return', 'static', 'SYSTEM'];
}

exports.parser = _parser2.default;
exports.nodes = nodes;
exports.die = die;
exports.compile = compile;
exports.compileBody = compileBody;
exports.getExposedFns = getExposedFns;
exports.getReservedWords = getReservedWords;