import { compile, nodes } from '../utils';

/*
 * Translate tuples 1-1.
 */
compile(nodes.TupleNode, function () {
  this.shared.lib.add('tuple');
  return `CNS_.tuple([${this.items.map(item => item.compile(true)).join(', ')}])`;
});
