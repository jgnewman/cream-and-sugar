import { compile, nodes } from '../utils';

/*
 * Turn the cons operation into a function call.
 */
compile(nodes.BackConsNode, function () {
  return `${this.base.compile(true)}.concat([${this.toAdd.compile(true)}])`;
});
