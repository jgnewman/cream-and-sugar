import { compile, nodes } from '../utils';

/*
 * Translate tuples 1-1.
 */
compile(nodes.TupleNode, function () {
  return `{${this.items.map(item => item.compile(true)).join(', ')}}`;
});
