import { compile, nodes } from '../utils';

/*
 * Turn the cons operation into a function call.
 */
compile(nodes.ConsNode, function () {
  return `[${this.toAdd.compile(true)}].concat(${this.base.compile(true)})`;
});
