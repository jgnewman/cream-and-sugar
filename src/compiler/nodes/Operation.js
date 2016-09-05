import { compile, nodes } from '../utils';

/*
 * Recursively compile operations.
 */
compile(nodes.OperationNode, function () {
  return `${this.left.compile(true)} ${this.operator} ${this.right.compile(true)}`;
});
