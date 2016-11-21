import { compile, nodes } from '../utils';

/*
 * Use the lazify lib to lazify a value.
 */
compile(nodes.BinderNode, function () {
  return `CNS_.lazify(${this.value.compile(true)}, this)`;
});
