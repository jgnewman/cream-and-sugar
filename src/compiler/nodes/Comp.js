import { compile, nodes } from '../utils';

/*
 * Turn comprehensions into functions as needed.
 */
compile(nodes.CompNode, function () {
  const action = this.action.compile(true);
  const params = `(${this.params.map(item => item.compile(true)).join(', ')})`;
  const list   = this.list.compile(true);
  const caveat = this.caveat ? this.caveat.compile(true) : null;
  if (!caveat) {
    return `${list}.map(function ${params} {
        return ${action};
      }.bind(this))
    `.replace(/\s+/g, ' ');
  } else {
    return `
      (function () {
        const acc_ = [];
        ${list}.forEach(function ${params} {
          if (${caveat}) {
            acc_.push(${action});
          }
        }.bind(this));
        return acc_;
      }.bind(this)())
    `.replace(/^\s+|\s+$/g, '');
  }
});
