import { compile, nodes } from '../utils';

/*
 * Compile the ! operator.
 */
compile(nodes.OppositeNode, function () {
  return `!${this.value.compile(true)}`;
});
