import { compile, nodes } from '../utils';

/*
 * Translate logic operators.
 */
compile(nodes.LogicNode, function () {
  const operatorMap = {
    and: '&&',
    or: '||',
    lt: '<',
    gt: '>',
    lte: '<=',
    gte: '>=',
    is: '===',
    isnt: '!==',
    "==": '===',
    "!=": '!=='
  };
  return `${this.left.compile(true)} ${operatorMap[this.operator]} ${this.right.compile(true)}`;
});
