'use strict';

var _utils = require('../utils');

function collectChain(orig, accum) {
  orig.forEach(function (item) {
    if (item.type === 'Pipe') {
      accum.push(item.initVal.type === 'Wrap' ? item.initVal.item : item.initVal);
      accum = accum.concat(collectChain(item.chain, []));
    } else if (item.type === 'Wrap') {
      accum.push(item.item);
    } else {
      accum.push(item);
    }
  });
  return accum;
}

function meldChain(chain) {
  var accum = [];
  chain.forEach(function (currentNode, index) {
    if (index === 0) {
      accum.push(currentNode);
    } else {
      var functionized = void 0;
      switch (currentNode.type) {
        case 'Identifier':
        case 'Lookup':
          functionized = new _utils.nodes.Functionizer(accum.pop());
          accum.push(new _utils.nodes.FunctionCallNode(currentNode, { items: [functionized] }, currentNode.loc));
          break;
        case 'FunctionCall':
          functionized = new _utils.nodes.Functionizer(accum.pop());
          currentNode.args.items.push(functionized);
          accum.push(currentNode);
          break;
        default:
          throw new Error('Can not use an expression of type ' + currentNode.type + ' in a pipe.');
      }
    }
  });
  return new _utils.nodes.Functionizer(accum.pop());
}

/*
 * Translate scope piping chains.
 *
 *   foo >>= bar 'a' >>= baz 'b'
 *
 *   (function () {
 *     return baz('b', (function () {
 *       return bar('a', (function () {
 *         return foo
 *       }()))
 *     }()))
 *   }())
 */
(0, _utils.compile)(_utils.nodes.PipeNode, function () {
  var flatChain = collectChain(this.chain, [this.initVal]);
  var meldedChain = meldChain(flatChain);
  return meldedChain.compile(true);
});