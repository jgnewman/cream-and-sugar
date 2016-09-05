import { compile, nodes } from '../utils';

/*
 * Turn the cons operation into a function call.
 */
compile(nodes.OppositeNode, function () {
  return `!(${this.value.compile(true)})`;
});
