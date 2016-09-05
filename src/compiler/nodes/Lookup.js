import { compile, nodes } from '../utils';

/*
 * Compile . lookups 1-1.
 */
compile(nodes.LookupNode, function () {
  return `${this.left.compile(true)}.${this.right.compile(true)}`;
});
