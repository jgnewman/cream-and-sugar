import { compile, nodes, die } from '../utils';

/*
 * Reformat function calls to JavaScript syntax.
 */
compile(nodes.FunctionCallNode, function () {

  // If the only argument is `_`, compile it like an empty call...
  if (this.args.items.length === 1 && this.args.items[0].type === 'Identifier' && this.args.items[0].src === '_') {
    return `${this.fn.compile(true)}()`;

  // Anything else...
  } else {
    return `${this.fn.compile(true)}(${this.args.items.map(arg => {
      let out;
      if (arg.type === "Destructure") {
        if (arg.destrType === 'Keys' && !arg.toDestructure.length) {
          out = '{}';
        } else {
          return die(this, 'Can not pass a destructuring expression to a function call.');
        }
      } else {
        out = arg.compile(true);  
      }
      out === '_' && die(this, '"_" can not be used as a member of an argument list.');
      return out;
    }).join(', ')})`;
  }
});
