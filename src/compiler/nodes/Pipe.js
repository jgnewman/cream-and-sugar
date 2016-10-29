import { compile, nodes, die } from '../utils';

function collectChain(orig, accum) {
  orig.forEach(item => {
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
  const accum = [];
  chain.forEach((currentNode, index) => {
    if (index === 0) {
      accum.push(currentNode);
    } else {
      let functionized;
      switch (currentNode.type) {
        case 'Identifier':
        case 'Lookup':
          functionized = new nodes.Functionizer(accum.pop());
          accum.push(new nodes.FunctionCallNode(currentNode, {items:[functionized]}, currentNode.loc));
          break;
        case 'FunctionCall':
          functionized = new nodes.Functionizer(accum.pop());
          currentNode.args.items.push(functionized);
          accum.push(currentNode);
          break;
        default:
          throw new Error(`Can not use an expression of type ${currentNode.type} in a pipe.`);
      }
    }
  });
  return new nodes.Functionizer(accum.pop());
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
compile(nodes.PipeNode, function () {
  const flatChain = collectChain(this.chain, [this.initVal]);
  const meldedChain = meldChain(flatChain);
  return meldedChain.compile(true);
});
