import { compile, nodes } from '../utils';

/*
 * Turn comprehensions into functions as needed.
 */
compile(nodes.CompNode, function () {
  const action = this.action.compile(true);
  const params = `(${this.params.items.map(item => item.compile(true)).join(', ')})`;
  const list   = this.list.compile(true);
  const caveat = this.caveat ? this.caveat.compile(true) : null;
  if (!caveat) {
    return `
      ${list}.map(function ${params} {
        return ${action};
      }.bind(this))
    `.replace(/\s+/g, ' ');
  } else {
    return `
      (function () {
        const __acc__ = [];
        ${list}.forEach(function ${params} {
          if (${caveat}) {
            __acc__.push(${action});
          }
        }.bind(this));
        return __acc__;
      }.bind(this)())
    `;
  }
});
