import { compile, nodes } from '../utils';

/*
 * Reformat function calls to JavaScript syntax.
 */
compile(nodes.FunctionCallNode, function () {
  if (this.args.src === "()" && this.args.items.length === 1 && this.args.items[0].type === 'Wrap') {
    return `${this.fn.compile(true)}${this.args.items.map(arg => {
      return arg.compile(true);
    }).join(', ')}`;
  } else {
    return `${this.fn.compile(true)}(${this.args.items.map(arg => {
      return arg.compile(true);
    }).join(', ')})`;
  }
});
