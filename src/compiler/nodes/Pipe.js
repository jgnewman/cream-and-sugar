import { compile, nodes, die } from '../utils';

function collectChain(orig, accum) {
  orig.forEach(item => {
    if (item.type === 'Pipe') {
      accum.push(item.initVal);
      accum = accum.concat(collectChain(item.chain, []));
    } else {
      accum.push(item);
    }
  });
  return accum;
}

/*
 * Translate scope piping chains.
 */
// CNS_.pipe(4).to(addNum, 2).to(subNum, 2)();
compile(nodes.PipeNode, function () {
  const flatChain = collectChain(this.chain, []);
  
  const links = flatChain.map(item => {
    if (item.type === 'FunctionCall') {
      const args = item.args.items.map(arg => arg.compile(true)).join(', ');
      return `.to(${item.fn.compile(true)}, ${args})`;
    } else {
      return `.to(${item.compile(true)})`;
    }
  }).join('');
  this.shared.lib.add('pipe');

  if (this.initVal.type === 'Import') {
    if (this.initVal.toImport.type === 'Tuple') {
      die(this, 'You can only use scope piping when importing an entire module, not when importing multiple values in tuple form.');
    }
    const ref = `__ref${this.shared.refs += 1}__`;
    const imp = this.initVal.compile(true).replace(/[^\s]+\s*=/, `${ref} =`);
    return `${imp};\nconst ${this.initVal.toImport.compile(true)} = CNS_.pipe(${ref})${links}()`;

  } else {
    return `CNS_.pipe(${this.initVal.compile(true)})${links}()`;
  }
});
