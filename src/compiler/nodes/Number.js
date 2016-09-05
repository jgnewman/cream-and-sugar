import { compile, nodes } from '../utils';

/*
 * Drop in numbers.
 */
compile(nodes.NumberNode, function () {
  return this.number;
});
