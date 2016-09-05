import { compile, nodes } from '../utils';

/*
 * Drop in regular keywords.
 */
compile(nodes.SpecialNode, function () {
  return this.text;
});
