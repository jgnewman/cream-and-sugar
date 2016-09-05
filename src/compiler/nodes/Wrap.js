import { compile, nodes } from '../utils';

/*
 * Translate parenwraps 1-1.
 */
compile(nodes.WrapNode, function () {
  return `(${this.item.compile(true)})`;
});
