import { compile, nodes } from '../utils';

/*
 * Translate parenwraps 1-1.
 */
compile(nodes.WrapNode, function () {
  const dropParens = this.item.type === 'Fun' || this.item.type === 'FunctionCall';
  const begin      = dropParens ? '' : '(';
  const end        = dropParens ? '' : ')';
  return `${begin}${this.item.compile(true)}${end}`;
});
