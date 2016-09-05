import { compile, nodes } from '../utils';

/*
 * Translate arrays 1-1.
 */
compile(nodes.ArrNode, function () {
  return `[${this.items.map(item => item.compile(true)).join(', ')}]`;
});
