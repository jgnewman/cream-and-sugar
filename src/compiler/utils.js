import parser from '../parser/parser';

const nodes = parser.parser.nodes;

/**
 * Create an error, log a problem, and die.
 *
 * @param  {Node}   node     Any compilable node.
 * @param  {String} problem  Optional. A problem to log to the console.
 *
 * @return {undefined}
 */
function die(node, problem) {
  console.log(`\nERROR compiling ${node.type} node between ${node.loc.start.line}:${node.loc.start.column} and ${node.loc.end.line}:${node.loc.end.column}.\n`);
  problem && console.log(`Problem: ${problem}\n`);
  console.log((new Error()).stack);
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
      const out = fn.bind(this)();
      // By default, add our compiled node to the output
      // unless noAdd is set to true. Then don't.
      if (!noAdd) {
        this.shared.output += out;
      }
      return out;
    } catch (err) {
      console.log(`\nERROR compiling ${this.type} node between ${this.loc.start.line}:${this.loc.start.column} and ${this.loc.end.line}:${this.loc.end.column}.\n`);
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
  return body.filter(item => item.type !== 'NewLine');
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
  const newBody = [];
  let   fnCollect = [];

  const resetCollect = function (newVal) {
    if (fnCollect.length) {
      if (fnCollect.length > 1) {
        newBody.push(new nodes.PolymorphNode(fnCollect, true, fnCollect[0].loc));
      } else {
        newBody.push(fnCollect[0]);
      }
      newBody.push(new nodes.NewLineNode());
    }
    fnCollect = newVal;
  }

  body.forEach((node, index) => {
    const isLast = index === body.length - 1;

    // Always add a newline to the body.
    // They shouldn't prevent us from collecting polymorphic functions.
    if (node.type === 'NewLine') {
      newBody.push(node);

    // If we have a named function and...
    } else if (
      node.type === 'Fun'   &&
      node.preArrow.fn      &&
      node.preArrow.fn.text
    ) {

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
  const end = delim || ';';
  const cleanBody = removeNewlines(groupPolymorphs(body));
  const bodyPieces = [];
  cleanBody.forEach((item, index) => {
    const prefix = (index === cleanBody.length - 1 && !delim) ? 'return ' : '' ;
    if (!item.compile) {
      throw new Error(`Item type ${item.type} has no compile method.`);
    }
    bodyPieces.push(prefix + item.compile(true));
  });
  return !bodyPieces.length ? '' : bodyPieces.join(`${end}\n`) + (delim === ';' ? ';' : '');
}

// Official list of exposed system functions
function getExposedFns() {
  return [
    'apply', 'get', 'throw', 'create', 'dataType', 'instanceof',
    'head', 'tail', 'random', 'lead', 'last', 'update',
    'remove', 'eql', 'dom', 'domArray', 'spawn',
    'receive', 'kill', 'reply', 'send', 'aritize', 'tupleToObject',
    'tupleToArray', 'arrayToTuple', 'log', 'warn', 'debug', 'die',
    'range', 'lang'
  ];
}

function getMsgPassingFns() {
  return [
    'spawn', 'receive', 'kill', 'reply', 'send'
  ];
}

// Official list of reserved words
function getReservedWords() {
  return [
    'fn', 'caseof', 'match', 'if',
    'for', 'in', 'when', 'var', 'const', 'let', 'while',
    'switch', 'function', 'with', 'else', 'instanceof', 'super',
    'enum', 'break', 'extends', 'catch', 'new', 'class',
    'try', 'continue', 'typeof', 'delete', 'return',
    'static', 'CNS_'
  ];
}

export {
  parser,
  nodes,
  die,
  compile,
  compileBody,
  groupPolymorphs,
  getExposedFns,
  getMsgPassingFns,
  getReservedWords
};
