import { compile, nodes } from '../utils';

/*
 * Wraps a node in an immediate function that returns it.
 */
compile(nodes.Functionizer, function () {
  return `(function () { return ${this.node.compile(true)} }())`;
});
