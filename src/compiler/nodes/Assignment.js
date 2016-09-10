import { compile, nodes, die } from '../utils';

/*
 * Handle assignment of variables using identifiers,
 * tuples, and cons statemtents. Note that all variables
 * are constants and should not be overwritable.
 */
compile(nodes.AssignmentNode, function () {
  let tuple;
  switch (this.left.type) {
    case 'Identifier':
    case 'Tuple':
      return `const ${this.left.compile(true)} = ${this.right.compile(true)}`;
    case 'Cons':
      const head = this.left.src.match(/^\[(.+)\|/)[1];
      const tail = this.left.src.match(/\|([^\]]+)\]/)[1];
      tuple = `{${head}, ${tail}}`;
      this.shared.lib.add('assnCons');
      return `const ${tuple} = SYSTEM.assnCons(${this.right.compile(true)}, "${head}", "${tail}")`;
    case 'BackCons':
      const lead = this.left.src.match(/^\[(.+)\|\|/)[1];
      const last = this.left.src.match(/\|\|([^\]]+)\]/)[1];
      tuple = `{${lead}, ${last}}`;
      this.shared.lib.add('assnBackCons');
      return `const ${tuple} = SYSTEM.assnBackCons(${this.right.compile(true)}, "${lead}", "${last}")`;
    default:
      die(this, `Invalid expression in left hand assignment: ${this.left.type}`);
  }
});
