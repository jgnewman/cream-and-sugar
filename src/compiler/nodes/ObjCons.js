import { compile, nodes } from '../utils';

/*
 * Use Object.assign to compile object consing.
 */
compile(nodes.ObjConsNode, function () {
  return `CNS_.assign({}, ${this.base.compile(true)}, ${this.toAdd.compile(true)})`;
});
