import { compile, nodes, compileBody } from '../utils';

/*
 * Format call chain syntax.
 */
compile(nodes.ChainNode, function () {
  return this.body.map(each => each.compile(true)).join('.');
});
