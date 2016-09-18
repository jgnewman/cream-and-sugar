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
      return `const ${this.left.compile(true)} = ${this.right.compile(true)}`;

    case 'Tuple':
      const ref = `__ref${this.shared.refs += 1}__`;
      // Use var here so it can be redeclared in the REPL.
      let base = `var ${ref} = ${this.right.compile(true)};\n`;
      this.left.items.forEach((item, index) => {
        const varName = item.compile(true);
        base += `const ${varName} = ${ref}.${varName}`;
        index !== this.left.items.length - 1 && (base += ';\n');
      });
      return base;

    case 'Cons':
      const head = this.left.src.match(/^\[(.+)\|/)[1];
      const tail = this.left.src.match(/\|([^\]]+)\]/)[1];
      const aref = `__ref${this.shared.refs += 1}__`;
      return `var ${aref} = ${this.right.compile(true)};
      const ${head} = ${aref}[0];
      const ${tail} = ${aref}.slice(1)`;

    case 'BackCons':
      const lead = this.left.src.match(/^\[(.+)\|\|/)[1];
      const last = this.left.src.match(/\|\|([^\]]+)\]/)[1];
      const bref = `__ref${this.shared.refs += 1}__`;
      return `var ${bref} = ${this.right.compile(true)};
      const ${lead} = ${bref}.slice(0, ${bref}.length - 1);
      const ${last} = ${bref}[${bref}.length - 1]`;

    default:
      die(this, `Invalid expression in left hand assignment: ${this.left.type}`);
  }
});
