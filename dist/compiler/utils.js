'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReservedWords = exports.getMsgPassingFns = exports.getExposedFns = exports.groupPolymorphs = exports.compileBody = exports.compile = exports.die = exports.nodes = exports.parser = undefined;

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
 * Iterates over an array of nodes and groups together sequential
 * named functions with matching names into PolymorphNodes.
 *
 * @param   {Array} body  A list of compilable nodes.
 *
 * @returns {Array}       A modified list of nodes.
 */
function groupPolymorphs(body) {
  var newBody = [];
  var fnCollect = [];

  var resetCollect = function resetCollect(newVal) {
    if (fnCollect.length) {
      if (fnCollect.length > 1) {
        newBody.push(new nodes.PolymorphNode(fnCollect, true, fnCollect[0].loc));
      } else {
        newBody.push(fnCollect[0]);
      }
      newBody.push(new nodes.NewLineNode());
    }
    fnCollect = newVal;
  };

  body.forEach(function (node, index) {
    var isLast = index === body.length - 1;

    // Always add a newline to the body.
    // They shouldn't prevent us from collecting polymorphic functions.
    if (node.type === 'NewLine') {
      newBody.push(node);

      // If we have a named function and...
    } else if (node.type === 'Fun' && node.preArrow.fn && node.preArrow.fn.text) {

      // If we either haven't collected any functions yet or this one's name
      // matches the names of the ones previously collected,
      // collect it.
      if (!fnCollect.length || fnCollect[0].preArrow.fn.text === node.preArrow.fn.text) {
        fnCollect.push(node);

        // If its name doesn't match the names of functions we're collecting,
        // push the right thing into the body from the collection and reset the
        // collection to contain this new node.
      } else {
        resetCollect([node]);
      }

      // If we don't have a named function,
      // push the right thing into the body from the collection and reset the
      // collection, then push this node into the body.
    } else {
      resetCollect([]);
      newBody.push(node);
    }

    // If we happen to be on the last node and there are items in the
    // collection, push the right thing into the body from the collection.
    if (isLast) {
      resetCollect();
    }
  });
  return newBody;
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
  var cleanBody = removeNewlines(groupPolymorphs(body));
  var bodyPieces = [];
  cleanBody.forEach(function (item, index) {
    var prefix = index === cleanBody.length - 1 && !delim ? 'return ' : '';
    if (!item.compile) {
      throw new Error('Item type ' + item.type + ' has no compile method.');
    }
    bodyPieces.push(prefix + item.compile(true));
  });
  return !bodyPieces.length ? '' : bodyPieces.join(end + '\n') + (delim === ';' ? ';' : '');
}

// Official list of exposed system functions
function getExposedFns() {
  return ['apply', 'get', 'throw', 'create', 'dataType', 'instanceof', 'head', 'tail', 'random', 'lead', 'last', 'update', 'remove', 'eql', 'dom', 'domArray', 'spawn', 'receive', 'kill', 'reply', 'send', 'aritize', 'tupleToObject', 'tupleToArray', 'arrayToTuple', 'log', 'warn', 'debug', 'die', 'range', 'lang', 'dangerouslyMutate', 'cache', 'decache', 'classof', 'noop'];
}

function getMsgPassingFns() {
  return ['spawn', 'receive', 'kill', 'reply', 'send'];
}

// Official list of reserved words
function getReservedWords() {
  return ['fn', 'caseof', 'match', 'if', 'default', 'catch', 'for', 'in', 'when', 'var', 'const', 'let', 'while', 'switch', 'function', 'with', 'else', 'super', 'enum', 'break', 'extends', 'new', 'class', 'try', 'continue', 'typeof', 'delete', 'return', 'static', 'CNS_'];
}

exports.parser = _parser2.default;
exports.nodes = nodes;
exports.die = die;
exports.compile = compile;
exports.compileBody = compileBody;
exports.groupPolymorphs = groupPolymorphs;
exports.getExposedFns = getExposedFns;
exports.getMsgPassingFns = getMsgPassingFns;
exports.getReservedWords = getReservedWords;